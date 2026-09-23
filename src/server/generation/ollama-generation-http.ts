import { emitGenerationRejection, emitOutputValidationDetail, type OutputValidationDetailSink, type GenerationRejectionSink } from './generation-diagnostics.ts';
import { request as nativeRequest } from 'node:http';
import type { ClientRequest, IncomingMessage, RequestOptions } from 'node:http';
import type { Socket } from 'node:net';
import type { AttemptTransport } from './generation-contract.ts';

export type OllamaNativeRequest = (options: RequestOptions, callback: (response: IncomingMessage) => void) => ClientRequest;
type Cleanup = 'complete' | 'uncertain';
type WireError = 'missing-prerequisite' | 'configuration' | 'incomplete-output' | 'rate-limit'
  | 'network' | 'provider' | 'timeout' | 'shutdown';
type WireResult = { readonly ok: true; readonly value: unknown; readonly cleanup: 'complete' }
  | { readonly ok: false; readonly error: WireError; readonly cleanup: Cleanup };
type MetadataResult = { readonly ok: true; readonly value: unknown; readonly cleanup: 'complete' }
  | { readonly ok: false; readonly error: 'missing-prerequisite' | 'configuration'; readonly cleanup: Cleanup };
type DispatchResult = { readonly ok: true; readonly candidate: unknown; readonly complete: true; readonly cleanup: 'complete' }
  | { readonly ok: false; readonly error: 'incomplete-output' | 'rate-limit' | 'network' | 'provider' | 'timeout' | 'shutdown';
    readonly cleanup: Cleanup };

const BODY_LIMIT = 1048576;

function requestOptions(path: string, body: string): RequestOptions {
  return { hostname: '127.0.0.1', port: 11434, agent: false, maxHeaderSize: 16384,
    path, method: body === '' ? 'GET' : 'POST',
    ...(body === '' ? {} : { headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body, 'utf8') } }) };
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function noOutputExtensions(value: Record<string, unknown>): boolean {
  return !['images', 'image', 'tools', 'tool_calls', 'remote_host', 'remote_model'].some(key => Object.hasOwn(value, key));
}

function chatCandidate(value: unknown, onRejection?: GenerationRejectionSink, reasoning = false, onDetail?: OutputValidationDetailSink): unknown {
  if (!object(value) || !noOutputExtensions(value) || value.model !== 'qwen3.5:4b:local'
    || value.done !== true || value.done_reason !== 'stop' || !object(value.message)
    || !noOutputExtensions(value.message) || value.message.role !== 'assistant'
    || typeof value.message.content !== 'string'
    || (Object.hasOwn(value, 'thinking') && value.thinking !== '')
    || (Object.hasOwn(value.message, 'thinking') && (reasoning ? typeof value.message.thinking !== 'string' : value.message.thinking !== ''))) {
    emitGenerationRejection(onRejection, 'adapter-response/envelope');
    throw new Error('Invalid output');
  }
  let candidate: unknown;
  try { candidate = JSON.parse(value.message.content); }
  catch {
    emitGenerationRejection(onRejection, 'adapter-response/content');
    emitOutputValidationDetail(onDetail, { kind: 'content', reason: 'json-syntax' });
    throw new Error('Invalid output');
  }
  if (!object(candidate)) {
    emitGenerationRejection(onRejection, 'adapter-response/content');
    emitOutputValidationDetail(onDetail, { kind: 'content', reason: 'non-object' });
    throw new Error('Invalid output');
  }
  return candidate;
}

// The transport owns only its HTTP resources. Disconnect cannot prove runner cancellation.
function exchange(options: RequestOptions, body: string, signal: AbortSignal, metadata: boolean,
  start: AttemptTransport, requestImplementation: OllamaNativeRequest, onRejection?: GenerationRejectionSink, expiresAt?: number, reasoning = false, onDetail?: OutputValidationDetailSink): Promise<WireResult> {
  const fallback = metadata ? 10000 : 120000;
  const enteredAt = Date.now();
  const deadline = expiresAt === undefined ? enteredAt + fallback
    : metadata ? Math.min(expiresAt, enteredAt + fallback) : expiresAt;
  const rejectBody = () => { if (!metadata) emitGenerationRejection(onRejection, 'adapter-response/body'); };
  const invalid: WireError = metadata ? 'configuration' : 'incomplete-output';
  const network: WireError = metadata ? 'configuration' : 'network';
  const cancelled: WireError = metadata ? 'configuration' : 'shutdown';
  if (Date.now() >= deadline) return Promise.resolve(Object.freeze({ ok: false, error: metadata ? 'configuration' : 'timeout', cleanup: 'complete' }));
  if (signal.aborted) return Promise.resolve(Object.freeze({ ok: false, error: cancelled, cleanup: 'complete' }));
  return new Promise(resolve => {
    let handle: ClientRequest | undefined;
    let response: IncomingMessage | undefined;
    let requestClosed = false;
    let responseClosed = false;
    let ended = false;
    let settled = false;
    let uncertainSettlement = false;
    let failing = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let statusError: WireError | undefined;
    let pending: { ok: true; value: unknown } | { ok: false; error: WireError } | undefined;
    let bytes = 0;
    const chunks: Buffer[] = [];
    const sockets = new Map<Socket, boolean>();
    const removals: (() => void)[] = [];

    const terminal = () => requestClosed && (!response || responseClosed)
      && [...sockets.values()].every(closed => closed);
    const listen = (emitter: ClientRequest | IncomingMessage | Socket, event: string, listener: (...args: any[]) => void) => {
      emitter.on(event, listener);
      removals.push(() => emitter.removeListener(event, listener));
    };
    const finish = (result: WireResult) => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      for (const remove of removals) remove();
      // Keep late native error events harmless until uncertain resources close.
      if (result.cleanup === 'uncertain') {
        for (const resource of [handle, response, ...sockets.keys()]) {
          if (!resource || (resource === handle && requestClosed) || (resource === response && responseClosed)
            || sockets.get(resource as Socket) === true) continue;
          const ignoreError = () => {};
          resource.on('error', ignoreError);
          resource.once('close', () => resource.removeListener('error', ignoreError));
        }
      }
      chunks.length = 0;
      resolve(Object.freeze(result));
    };
    const publishTerminal = () => {
      if (settled || !pending || !terminal()) return;
      if (pending.ok && Date.now() >= deadline) pending = { ok: false, error: metadata ? 'configuration' : 'timeout' };
      finish(pending.ok ? { ok: true, value: pending.value, cleanup: 'complete' }
        : { ok: false, error: pending.error, cleanup: uncertainSettlement ? 'uncertain' : 'complete' });
    };
    const destroyOwned = () => {
      try { response?.destroy(); } catch { /* Settlement remains uncertain. */ }
      try { handle?.destroy(); } catch { /* Settlement remains uncertain. */ }
      for (const socket of sockets.keys()) {
        try { socket.destroy(); } catch { /* Settlement remains uncertain. */ }
      }
    };
    const failNow = (error: WireError, uncertain: boolean) => {
      if (settled || failing) return;
      failing = true;
      uncertainSettlement ||= uncertain;
      pending = { ok: false, error };
      destroyOwned();
      // A same-stack close may settle native errors; destroyed flags alone never do.
      queueMicrotask(() => {
        if (!settled) finish({ ok: false, error, cleanup: !uncertainSettlement && terminal() ? 'complete' : 'uncertain' });
      });
    };
    const onAbort = () => failNow(cancelled, true);
    const onTimeout = () => failNow(metadata ? 'configuration' : 'timeout', true);
    const observeSocket = (socket: Socket | null | undefined) => {
      if (!socket || sockets.has(socket)) return;
      sockets.set(socket, false);
      listen(socket, 'close', () => {
        sockets.set(socket, true);
        if (!ended && !pending) failNow(statusError ?? network, true);
        else publishTerminal();
      });
      listen(socket, 'error', () => failNow(statusError ?? network, true));
    };
    const receive = (incoming: IncomingMessage) => {
      if (settled || response) {
        const ignoreError = () => {};
        incoming.on('error', ignoreError);
        incoming.once('close', () => incoming.removeListener('error', ignoreError));
        try { incoming.destroy(); } catch { /* Late callbacks cannot alter the settled result. */ }
        return;
      }
      response = incoming;
      statusError = incoming.statusCode === 200 ? undefined : metadata
        ? incoming.statusCode === 404 ? 'missing-prerequisite' : 'configuration'
        : incoming.statusCode === 429 ? 'rate-limit' : 'provider';
      observeSocket(incoming.socket);
      listen(incoming, 'error', () => failNow(statusError ?? network, true));
      listen(incoming, 'aborted', () => failNow(statusError ?? network, true));
      listen(incoming, 'close', () => {
        responseClosed = true;
        if (!ended) failNow(statusError ?? network, true);
        else publishTerminal();
      });
      listen(incoming, 'data', (chunk: unknown) => {
        if (settled || pending || ended) return;
        try {
          if (typeof chunk !== 'string' && !Buffer.isBuffer(chunk) && !(chunk instanceof Uint8Array)) {
            if (!statusError) rejectBody();
            failNow(statusError ?? invalid, true); return;
          }
          const length = typeof chunk === 'string' ? Buffer.byteLength(chunk, 'utf8') : chunk.byteLength;
          if (length > BODY_LIMIT - bytes) { if (!statusError) rejectBody(); failNow(statusError ?? invalid, true); return; }
          bytes += length;
          chunks.push(Buffer.from(chunk));
        } catch { if (!statusError) rejectBody(); failNow(statusError ?? invalid, true); }
      });
      listen(incoming, 'end', () => {
        if (settled || ended) return;
        ended = true;
        if (!pending) {
          if (statusError) pending = { ok: false, error: statusError };
          else if (!incoming.complete) { rejectBody(); pending = { ok: false, error: invalid }; }
          else {
            try {
              let value: unknown;
              try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks, bytes))); }
              catch (error) { rejectBody(); throw error; }
              pending = { ok: true, value: metadata ? value : chatCandidate(value, onRejection, reasoning, onDetail) };
            } catch { pending = { ok: false, error: invalid }; }
          }
        }
        chunks.length = 0;
        publishTerminal();
      });
    };
    const remaining = expiresAt === undefined ? fallback : Math.min(metadata ? 10000 : Infinity, deadline - Date.now());
    if (remaining <= 0) { finish({ ok: false, error: metadata ? 'configuration' : 'timeout', cleanup: 'complete' }); return; }
    timer = setTimeout(onTimeout, remaining);
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) { finish({ ok: false, error: cancelled, cleanup: 'complete' }); return; }
    try {
      start(() => {
        if (Date.now() >= deadline) { onTimeout(); return; }
        handle = requestImplementation(options, receive);
        observeSocket(handle.socket);
        listen(handle, 'socket', observeSocket);
        listen(handle, 'close', () => {
          requestClosed = true;
          if (!ended && !pending) failNow(statusError ?? network, true);
          else publishTerminal();
        });
        listen(handle, 'error', (error: NodeJS.ErrnoException) => {
          const refusedBeforeResponse = error.code === 'ECONNREFUSED' && !response;
          failNow(statusError ?? (metadata && refusedBeforeResponse ? 'missing-prerequisite' : network), !refusedBeforeResponse);
        });
        handle.setTimeout(expiresAt === undefined ? fallback : Math.max(1, Math.min(remaining, deadline - Date.now())));
        listen(handle, 'timeout', onTimeout);
        if (signal.aborted) { onAbort(); return; }
        handle.end(body === '' ? undefined : body);
      });
    } catch {
      if (handle || response) failNow(statusError ?? network, true);
      else finish({ ok: false, error: network, cleanup: 'complete' });
    }
  });
}

export async function requestOllamaGenerationMetadata(kind: 'version' | 'show' | 'tags', signal: AbortSignal,
  requestImplementation: OllamaNativeRequest = nativeRequest, expiresAt?: number): Promise<MetadataResult> {
  const body = kind === 'show' ? '{"model":"qwen3.5:4b","verbose":false}' : '';
  const result = await exchange(requestOptions(`/api/${kind}`, body), body, signal, true, start => start(), requestImplementation, undefined, expiresAt);
  if (result.ok) return result;
  return Object.freeze({ ok: false, error: result.error === 'missing-prerequisite' ? 'missing-prerequisite' : 'configuration',
    cleanup: result.cleanup });
}

export async function dispatchOllamaGeneration(body: string, signal: AbortSignal, attemptTransport: AttemptTransport,
  requestImplementation: OllamaNativeRequest = nativeRequest, onRejection?: GenerationRejectionSink, expiresAt?: number, reasoning = false, onDetail?: OutputValidationDetailSink): Promise<DispatchResult> {
  const result = await exchange(requestOptions('/api/chat', body), body, signal, false, attemptTransport, requestImplementation, onRejection, expiresAt, reasoning, onDetail);
  if (result.ok) return Object.freeze({ ok: true, candidate: result.value, complete: true, cleanup: 'complete' } as const);
  return Object.freeze({ ok: false,
    error: result.error === 'configuration' || result.error === 'missing-prerequisite' ? 'provider' : result.error,
    cleanup: result.cleanup });
}
