import { request as nativeRequest } from 'node:http';
import type { ClientRequest, IncomingMessage, RequestOptions } from 'node:http';
import { EMBEDDING_IDENTITY, EMBEDDING_KEEP_ALIVE } from './embedding-profile.ts';
import { RetrievalError } from './retrieval-error.ts';

export type OllamaRequest =
  | { readonly kind: 'version' | 'tags' | 'show' | 'ps' }
  | { readonly kind: 'embed'; readonly input: string };
export type OllamaRequester = (request: OllamaRequest, signal: AbortSignal) => Promise<unknown>;
type NativeRequest = (options: RequestOptions, callback: (response: IncomingMessage) => void) => ClientRequest;

const BODY_LIMIT = 1024 * 1024;

function requestShape(request: OllamaRequest): { options: RequestOptions; body: string; timeout: number } {
  const path = request.kind === 'version' ? '/api/version' : request.kind === 'tags' ? '/api/tags'
    : request.kind === 'show' ? '/api/show' : request.kind === 'ps' ? '/api/ps' : '/api/embed';
  const body = request.kind === 'show'
    ? JSON.stringify({ model: EMBEDDING_IDENTITY.resolvedModel, verbose: false })
    : request.kind === 'embed'
      ? JSON.stringify({
        model: EMBEDDING_IDENTITY.resolvedModel,
        input: [request.input],
        truncate: false,
        options: { num_ctx: EMBEDDING_IDENTITY.context, num_batch: EMBEDDING_IDENTITY.numBatch },
        keep_alive: EMBEDDING_KEEP_ALIVE,
      })
      : '';
  return {
    options: {
      hostname: '127.0.0.1', port: 11434,
      method: body === '' ? 'GET' : 'POST', path, agent: false,
      ...(body === '' ? {} : { headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) } }),
    },
    body,
    timeout: request.kind === 'embed' ? 60_000 : 10_000,
  };
}

export function requestOllama(
  request: OllamaRequest,
  signal: AbortSignal,
  requestImplementation: NativeRequest = nativeRequest,
): Promise<unknown> {
  if (signal.aborted) return Promise.reject(new RetrievalError('shutdown'));
  const shape = requestShape(request);
  return new Promise((resolve, reject) => {
    let settled = false;
    let response: IncomingMessage | undefined;
    let handle: ClientRequest | undefined;
    let totalTimer: ReturnType<typeof setTimeout> | undefined;
    const chunks: Buffer[] = [];
    let bytes = 0;

    const finish = (error?: RetrievalError, value?: unknown) => {
      if (settled) return;
      settled = true;
      if (totalTimer !== undefined) clearTimeout(totalTimer);
      signal.removeEventListener('abort', onAbort);
      if (error) {
        response?.destroy();
        handle?.destroy();
        reject(error);
      } else resolve(value);
    };
    const onAbort = () => finish(new RetrievalError('shutdown', true));
    const onTimeout = () => finish(new RetrievalError('timeout', true));

    try {
      handle = requestImplementation(shape.options, incoming => {
        response = incoming;
        if (settled) { incoming.destroy(); return; }
        if (typeof incoming.statusCode !== 'number' || incoming.statusCode < 200 || incoming.statusCode >= 300) {
          finish(new RetrievalError(incoming.statusCode === 404 && request.kind !== 'embed'
            ? 'missing-prerequisite' : 'embedding-failed'));
          return;
        }
        incoming.on('data', (chunk: string | Buffer | Uint8Array) => {
          if (settled) return;
          const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
          bytes += buffer.byteLength;
          if (bytes > BODY_LIMIT) { finish(new RetrievalError(request.kind === 'embed' ? 'embedding-response' : 'model-identity')); return; }
          chunks.push(buffer);
        });
        incoming.on('error', () => finish(new RetrievalError('embedding-failed')));
        incoming.on('end', () => {
          if (settled) return;
          try {
            const text = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
            finish(undefined, JSON.parse(text));
          } catch {
            finish(new RetrievalError(request.kind === 'embed' ? 'embedding-response' : 'model-identity'));
          }
        });
      });
    } catch {
      reject(new RetrievalError('embedding-failed'));
      return;
    }
    totalTimer = setTimeout(onTimeout, shape.timeout);
    handle.setTimeout(shape.timeout, onTimeout);
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) { onAbort(); return; }
    handle.on('error', (error: NodeJS.ErrnoException) => {
      finish(new RetrievalError(error.code === 'ECONNREFUSED' ? 'missing-prerequisite' : 'embedding-failed'));
    });
    try {
      handle.end(shape.body === '' ? undefined : shape.body);
    } catch {
      finish(new RetrievalError('embedding-failed'));
    }
  });
}
