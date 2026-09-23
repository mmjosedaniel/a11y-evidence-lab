import { request as nativeRequest } from 'node:https';
import type { RequestOptions } from 'node:https';
import type { ClientRequest, IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import { debuglog } from 'node:util';
import type { AttemptTransport } from './generation-contract.ts';

export type GroqNativeRequest = (options: RequestOptions, callback: (response: IncomingMessage) => void) => ClientRequest;
type WireError = 'configuration' | 'authentication' | 'quota' | 'rate-limit' | 'provider'
  | 'network' | 'incomplete-output' | 'timeout' | 'shutdown';
type DispatchResult = { readonly ok: true; readonly candidate: unknown; readonly complete: true; readonly cleanup: 'complete' }
  | { readonly ok: false; readonly error: WireError; readonly cleanup: 'complete' | 'uncertain' };
type Pending = { ok: true; candidate: unknown } | { ok: false; error: WireError };

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function containsCredential(value: unknown, credential: string): boolean {
  // Iteration also handles deeply nested, bounded provider JSON without recursion overflow.
  const pending: unknown[] = [value];
  while (pending.length) {
    const item = pending.pop();
    if (typeof item === 'string' && item.includes(credential)) return true;
    if (typeof item !== 'object' || item === null) continue;
    for (const [key, child] of Object.entries(item)) {
      if (key.includes(credential)) return true;
      pending.push(child);
    }
  }
  return false;
}

function noOutputExtensions(value: Record<string, unknown>): boolean {
  return (!Object.hasOwn(value, 'refusal') || value.refusal === null)
    && (!Object.hasOwn(value, 'reasoning') || value.reasoning === null || value.reasoning === '')
    && !Object.hasOwn(value, 'tool_calls') && !Object.hasOwn(value, 'function_call');
}

function candidateFrom(value: unknown, credential: string): unknown {
  if (!object(value) || !noOutputExtensions(value) || containsCredential(value, credential) || value.object !== 'chat.completion'
    || value.model !== 'openai/gpt-oss-20b' || !Array.isArray(value.choices) || value.choices.length !== 1) throw null;
  const choice: unknown = value.choices[0];
  if (!object(choice) || !noOutputExtensions(choice) || choice.index !== 0
    || choice.finish_reason !== 'stop' || !object(choice.message)) throw null;
  const message = choice.message;
  if (message.role !== 'assistant' || typeof message.content !== 'string' || !noOutputExtensions(message)) throw null;
  const candidate: unknown = JSON.parse(message.content);
  if (!object(candidate) || containsCredential(candidate, credential)) throw null;
  return candidate;
}

function destroy(resource: ClientRequest | IncomingMessage | Socket | undefined): void {
  try { resource?.destroy(); } catch { /* Only observed close proves settlement. */ }
}

function discardLate(resource: IncomingMessage | Socket): void {
  const ignoreError = () => {};
  resource.on('error', ignoreError);
  resource.once('close', () => resource.removeListener('error', ignoreError));
  destroy(resource);
}

export async function dispatchGroqGeneration(body: string, credential: string, signal: AbortSignal,
  attemptTransport: AttemptTransport, requestImplementation: GroqNativeRequest = nativeRequest, expiresAt?: number): Promise<DispatchResult> {
  const deadline = expiresAt ?? Date.now() + 120000;
  if (Date.now() >= deadline) return { ok: false, error: 'timeout', cleanup: 'complete' };
  if (signal.aborted) return { ok: false, error: 'shutdown', cleanup: 'complete' };
  try {
    if (!credential || debuglog('http').enabled || debuglog('https').enabled
      || containsCredential(JSON.parse(body), credential)) throw null;
  } catch {
    credential = ''; body = '';
    // The shared stage treats a pre-entry dispatch exception as configuration failure.
    throw new Error('Groq dispatch configuration rejected');
  }
  return new Promise<DispatchResult>(resolve => {
    let handle: ClientRequest | undefined;
    let response: IncomingMessage | undefined;
    const sockets = new Map<Socket, boolean>();
    let requestClosed = false;
    let responseClosed = false;
    let ended = false;
    let settled = false;
    let failing = false;
    let statusError: WireError | undefined;
    let pending: Pending | undefined;
    let bytes = 0;
    const chunks: Buffer[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;
    const closed = () => (!handle || requestClosed) && (!response || responseClosed)
      && [...sockets.values()].every(value => value);
    const clearBody = () => {
      for (const chunk of chunks) chunk.fill(0);
      chunks.length = 0;
    };
    const finish = (result: DispatchResult) => {
      if (settled) return;
      settled = true;
      credential = ''; body = ''; pending = undefined;
      clearBody();
      if (timer !== undefined) clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      resolve(Object.freeze(result));
    };
    const publish = () => {
      if (!settled && !failing && pending && closed()) {
        if (pending.ok && Date.now() >= deadline) pending = { ok: false, error: 'timeout' };
        finish(pending.ok ? { ok: true, candidate: pending.candidate, complete: true, cleanup: 'complete' }
          : { ok: false, error: pending.error, cleanup: 'complete' });
      }
    };
    const fail = (error: WireError) => {
      if (settled) return;
      // Cancellation remains authoritative while destruction is settling.
      if (failing && error !== 'shutdown' && error !== 'timeout') return;
      failing = true;
      pending = { ok: false, error };
      credential = ''; body = ''; clearBody();
      destroy(response); destroy(handle);
      for (const socket of sockets.keys()) destroy(socket);
      queueMicrotask(() => {
        if (!settled && pending && !pending.ok) finish({ ok: false, error: pending.error, cleanup: 'uncertain' });
      });
    };
    const onAbort = () => fail('shutdown');
    const onTimeout = () => fail('timeout');
    const observeSocket = (socket: Socket | null | undefined) => {
      if (!socket || sockets.has(socket)) return;
      if (settled || failing) { discardLate(socket); return; }
      sockets.set(socket, false);
      socket.on('error', () => fail(statusError ?? 'network'));
      socket.once('close', () => {
        sockets.set(socket, true);
        if (!ended && !pending) fail(statusError ?? 'network');
        else publish();
      });
    };
    const receive = (incoming: IncomingMessage) => {
      if (settled || failing || response) {
        // An active extra response has unobserved closure; revoke success before destruction can emit close.
        if (!settled && !failing) fail(statusError ?? 'incomplete-output');
        if (incoming.socket && !sockets.has(incoming.socket)) discardLate(incoming.socket);
        discardLate(incoming);
        return;
      }
      response = incoming;
      statusError = incoming.statusCode === 200 ? undefined : incoming.statusCode === 401
        ? 'authentication' : incoming.statusCode === 429 ? 'rate-limit' : 'provider';
      observeSocket(incoming.socket);
      incoming.on('error', () => fail(statusError ?? 'network'));
      incoming.on('aborted', () => fail(statusError ?? 'network'));
      incoming.once('close', () => {
        responseClosed = true;
        if (!ended) fail(statusError ?? 'network');
        else publish();
      });
      incoming.on('data', (chunk: unknown) => {
        if (settled || failing || ended) return;
        try {
          if (typeof chunk !== 'string' && !Buffer.isBuffer(chunk) && !(chunk instanceof Uint8Array)) throw null;
          const length = typeof chunk === 'string' ? Buffer.byteLength(chunk, 'utf8') : chunk.byteLength;
          if (length > 1048576 - bytes) throw null;
          bytes += length;
          chunks.push(Buffer.from(chunk));
        } catch { fail(statusError ?? 'incomplete-output'); }
      });
      incoming.on('end', () => {
        if (settled || failing || ended) return;
        ended = true;
        let decoded: unknown;
        if (incoming.complete) {
          const buffer = Buffer.concat(chunks, bytes);
          try { decoded = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer)); }
          catch { /* Malformed errors retain status; malformed success fails validation. */ }
          finally { buffer.fill(0); }
        }
        clearBody();
        if (statusError) {
          if (incoming.statusCode === 400 && object(decoded) && object(decoded.error)
            && decoded.error.code === 'blocked_api_access') statusError = 'quota';
          pending = { ok: false, error: statusError };
        } else {
          try { pending = { ok: true, candidate: candidateFrom(decoded, credential) }; }
          catch { pending = { ok: false, error: 'incomplete-output' }; }
        }
        credential = '';
        if (pending.ok) publish();
        else fail(pending.error);
      });
    };
    const remaining = expiresAt === undefined ? 120000 : Math.min(120000, deadline - Date.now());
    if (remaining <= 0) { finish({ ok: false, error: 'timeout', cleanup: 'complete' }); return; }
    timer = setTimeout(onTimeout, remaining);
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) { finish({ ok: false, error: 'shutdown', cleanup: 'complete' }); return; }
    try {
      attemptTransport(() => {
        if (Date.now() >= deadline) { onTimeout(); return; }
        handle = requestImplementation({ hostname: 'api.groq.com', port: 443, path: '/openai/v1/chat/completions',
          method: 'POST', agent: false, maxHeaderSize: 16384, rejectUnauthorized: true,
          headers: { authorization: `Bearer ${credential}`, 'content-type': 'application/json',
            'content-length': Buffer.byteLength(body, 'utf8') } }, receive);
        observeSocket(handle.socket);
        handle.on('socket', observeSocket);
        handle.on('error', () => fail(statusError ?? 'network'));
        handle.once('close', () => {
          requestClosed = true;
          if (!ended && !pending) fail(statusError ?? 'network');
          else publish();
        });
        handle.on('timeout', onTimeout);
        handle.setTimeout(expiresAt === undefined ? 120000 : Math.max(1, Math.min(remaining, deadline - Date.now())));
        if (signal.aborted || failing || settled) { destroy(handle); onAbort(); return; }
        handle.end(body);
        body = '';
      });
    } catch {
      if (handle || response || sockets.size) fail(statusError ?? 'network');
      else finish({ ok: false, error: 'network', cleanup: 'complete' });
    }
  });
}
