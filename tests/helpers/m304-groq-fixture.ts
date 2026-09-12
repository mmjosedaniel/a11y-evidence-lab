import { EventEmitter } from 'node:events';
import type { ClientRequest, IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import type { RequestOptions } from 'node:https';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { GenerationRequest } from '../../src/server/generation/generation-contract.ts';
import {
  GENERATION_DEADLINE_MS,
  GENERATION_SCHEMA,
  GROQ_PARAMETERS,
  OUTPUT_CONTRACT_VERSION,
  PROMPT_VERSION,
  SCHEMA_VERSION,
} from '../../src/server/generation/generation-artifacts.ts';
import { GROQ_CONFIGURATION } from '../../src/server/generation/groq-generation-configuration.ts';
import type {
  GroqCredentialIO,
  GroqCredentialStat,
} from '../../src/server/generation/groq-credential.ts';

export const GROQ_ENV_PATH = fileURLToPath(new URL('../../.env', import.meta.url));
export const GROQ_REPOSITORY_ROOT = fileURLToPath(new URL('../../', import.meta.url));

export type MutableGroqRequest = {
  -readonly [K in keyof GenerationRequest]: GenerationRequest[K];
};

export function groqGenerationRequest(
  system = '',
  user = '',
  mutate?: (request: MutableGroqRequest) => void,
): GenerationRequest {
  const request: MutableGroqRequest = {
    messages: Object.freeze([
      Object.freeze({ role: 'system' as const, content: system }),
      Object.freeze({ role: 'user' as const, content: user }),
    ]),
    schema: GENERATION_SCHEMA,
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    outputContractVersion: OUTPUT_CONTRACT_VERSION,
    controls: GROQ_PARAMETERS,
    deadlineMs: GENERATION_DEADLINE_MS,
    configuration: GROQ_CONFIGURATION,
  };
  mutate?.(request);
  return Object.freeze(request);
}

export function expectedGroqBody(request: GenerationRequest): string {
  return JSON.stringify({
    model: 'openai/gpt-oss-20b',
    messages: request.messages,
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'm301_proposal_v1', strict: true, schema: request.schema },
    },
    temperature: 0,
    top_p: 1,
    max_completion_tokens: 4096,
    reasoning_effort: 'low',
    include_reasoning: false,
    stream: false,
    n: 1,
  });
}

export function requestAtSerializedBytes(bytes: number): GenerationRequest {
  const base = groqGenerationRequest('', '');
  const difference = bytes - Buffer.byteLength(expectedGroqBody(base), 'utf8');
  if (!Number.isSafeInteger(difference) || difference < 0) {
    throw new Error('Requested synthetic Groq body is smaller than its fixed envelope');
  }
  const request = groqGenerationRequest('x'.repeat(difference), '');
  if (Buffer.byteLength(expectedGroqBody(request), 'utf8') !== bytes) {
    throw new Error('Synthetic Groq body did not reach the requested byte length');
  }
  return request;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((receivedResolve, receivedReject) => {
    resolve = receivedResolve;
    reject = receivedReject;
  });
  return { promise, resolve, reject };
}

function pathLineage(candidate: string): readonly string[] {
  const resolved = path.resolve(candidate);
  const values: string[] = [resolved];
  let cursor = resolved;
  while (true) {
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    values.unshift(parent);
    cursor = parent;
  }
  return values;
}

function credentialStat(options: {
  readonly inode: number;
  readonly size?: number;
  readonly directory?: boolean;
  readonly file?: boolean;
  readonly symbolicLink?: boolean;
  readonly links?: number;
  readonly device?: number;
}): GroqCredentialStat {
  return {
    dev: options.device ?? 17,
    ino: options.inode,
    nlink: options.links ?? 1,
    size: options.size ?? 0,
    isDirectory: () => options.directory ?? false,
    isFile: () => options.file ?? false,
    isSymbolicLink: () => options.symbolicLink ?? false,
  };
}

export type VirtualCredentialOptions = {
  readonly content?: string | Uint8Array;
  readonly debugSequence?: readonly boolean[];
  readonly readChunkSize?: number;
  readonly holdOpen?: boolean;
  readonly holdRead?: boolean;
  readonly holdClose?: boolean;
  readonly openError?: NodeJS.ErrnoException;
  readonly readError?: NodeJS.ErrnoException;
  readonly closeError?: NodeJS.ErrnoException;
};

export function virtualCredentialIO(options: VirtualCredentialOptions = {}) {
  const bytes = typeof options.content === 'string'
    ? new TextEncoder().encode(options.content)
    : Uint8Array.from(options.content ?? new TextEncoder().encode('GROQ_API_KEY=synthetic-key\n'));
  const ancestors = pathLineage(GROQ_ENV_PATH);
  const pathStats = new Map<string, GroqCredentialStat>();
  ancestors.forEach((entry, index) => {
    pathStats.set(entry, entry === path.resolve(GROQ_ENV_PATH)
      ? credentialStat({ inode: 9001, size: bytes.byteLength, file: true })
      : credentialStat({ inode: 100 + index, directory: true }));
  });
  const realpaths = new Map(ancestors.map(entry => [entry, entry] as const));
  const descriptorStats: GroqCredentialStat[] = [
    credentialStat({ inode: 9001, size: bytes.byteLength, file: true }),
    credentialStat({ inode: 9001, size: bytes.byteLength, file: true }),
  ];
  const debugValues = [...(options.debugSequence ?? [false])];
  const openDeferred = deferred<ReturnType<typeof createHandle>>();
  const readDeferred = deferred<{ bytesRead: number }>();
  const closeDeferred = deferred<void>();
  let heldRead: {
    buffer: Uint8Array;
    offset: number;
    length: number;
    position: number;
    call: { offset: number; length: number; position: number; bytesRead?: number };
  } | undefined;

  const calls = {
    debug: 0,
    lstat: [] as string[],
    realpath: [] as string[],
    open: [] as { path: string; flags: 'r' }[],
    descriptorStat: 0,
    read: [] as { offset: number; length: number; position: number; bytesRead?: number }[],
    close: 0,
    buffers: [] as Uint8Array[],
  };

  function requireKnownPath(candidate: string): string {
    const resolved = path.resolve(candidate);
    if (!pathStats.has(resolved)) throw new Error(`Unexpected synthetic credential path: ${candidate}`);
    return resolved;
  }

  function completeRead(buffer: Uint8Array, offset: number, length: number, position: number) {
    if (options.readError) throw options.readError;
    const available = Math.max(0, bytes.byteLength - position);
    const count = Math.min(length, available, options.readChunkSize ?? length);
    buffer.set(bytes.subarray(position, position + count), offset);
    return { bytesRead: count };
  }

  function createHandle() {
    return {
      async stat() {
        const index = calls.descriptorStat++;
        return descriptorStats[Math.min(index, descriptorStats.length - 1)]!;
      },
      async read(buffer: Uint8Array, offset: number, length: number, position: number) {
        const call = { offset, length, position } as { offset: number; length: number; position: number; bytesRead?: number };
        calls.read.push(call);
        if (!calls.buffers.includes(buffer)) calls.buffers.push(buffer);
        if (options.holdRead && !heldRead) {
          heldRead = { buffer, offset, length, position, call };
          return readDeferred.promise;
        }
        const result = completeRead(buffer, offset, length, position);
        call.bytesRead = result.bytesRead;
        return result;
      },
      async close() {
        calls.close++;
        if (options.closeError) throw options.closeError;
        if (options.holdClose) return closeDeferred.promise;
      },
    };
  }

  const handle = createHandle();
  const io: GroqCredentialIO = {
    async lstat(candidate: string) {
      const resolved = requireKnownPath(candidate);
      calls.lstat.push(resolved);
      return pathStats.get(resolved)!;
    },
    async realpath(candidate: string) {
      const resolved = requireKnownPath(candidate);
      calls.realpath.push(resolved);
      return realpaths.get(resolved)!;
    },
    async open(candidate: string, flags: 'r') {
      const resolved = requireKnownPath(candidate);
      if (resolved !== path.resolve(GROQ_ENV_PATH) || flags !== 'r') {
        throw new Error('Unexpected synthetic credential open');
      }
      calls.open.push({ path: resolved, flags });
      if (options.openError) throw options.openError;
      if (options.holdOpen) return openDeferred.promise;
      return handle;
    },
    debugEnabled() {
      const index = calls.debug++;
      return debugValues[Math.min(index, debugValues.length - 1)] ?? false;
    },
  };

  return {
    io,
    calls,
    pathStats,
    realpaths,
    descriptorStats,
    control: {
      releaseOpen() { openDeferred.resolve(handle); },
      rejectOpen(reason: unknown) { openDeferred.reject(reason); },
      releaseRead() {
        if (!heldRead) throw new Error('No synthetic credential read is pending');
        try {
          const result = completeRead(heldRead.buffer, heldRead.offset, heldRead.length, heldRead.position);
          heldRead.call.bytesRead = result.bytesRead;
          readDeferred.resolve(result);
        } catch (error) {
          readDeferred.reject(error);
        }
      },
      rejectRead(reason: unknown) { readDeferred.reject(reason); },
      releaseClose() { closeDeferred.resolve(); },
      rejectClose(reason: unknown) { closeDeferred.reject(reason); },
    },
    stat(overrides: {
      readonly inode?: number;
      readonly size?: number;
      readonly directory?: boolean;
      readonly file?: boolean;
      readonly symbolicLink?: boolean;
      readonly links?: number;
      readonly device?: number;
    } = {}) {
      return credentialStat({
        inode: overrides.inode ?? 9001,
        size: overrides.size ?? bytes.byteLength,
        directory: overrides.directory,
        file: overrides.file ?? true,
        symbolicLink: overrides.symbolicLink,
        links: overrides.links,
        device: overrides.device,
      });
    },
  };
}

export async function flushAsyncWork(): Promise<void> {
  await new Promise<void>(resolve => setImmediate(resolve));
  await new Promise<void>(resolve => setImmediate(resolve));
}

export function nodeError(code: string): NodeJS.ErrnoException {
  const error = new Error('synthetic filesystem failure') as NodeJS.ErrnoException;
  error.code = code;
  return error;
}

export const SYNTHETIC_GROQ_CREDENTIAL = 'synthetic-key';

export function groqChatBody(candidate: unknown, overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    object: 'chat.completion',
    model: 'openai/gpt-oss-20b',
    choices: [{
      index: 0,
      message: { role: 'assistant', content: JSON.stringify(candidate), refusal: null },
      finish_reason: 'stop',
    }],
    ...overrides,
  });
}

export type GroqNativeReply = {
  readonly status?: number;
  readonly body?: string | Buffer | readonly (string | Buffer | Uint8Array)[];
  readonly complete?: boolean;
  readonly hold?: boolean;
  readonly requestError?: NodeJS.ErrnoException;
  readonly responseFailure?: 'error' | 'aborted' | 'close';
  readonly socketFailure?: boolean;
  readonly extraSockets?: number;
} | { readonly synchronousError: Error };

export type GroqNativeCall = {
  options: RequestOptions;
  body: Buffer;
  timeout: number | undefined;
  ended: boolean;
  requestDestroyed: boolean;
  responseDestroyed: boolean;
  readonly sockets: Array<{ destroyed: boolean; closed: boolean }>;
};

type SyntheticSocket = Socket & EventEmitter & { destroyed: boolean };

function syntheticSocket(call: GroqNativeCall): SyntheticSocket {
  const socket = new EventEmitter() as SyntheticSocket;
  const state = { destroyed: false, closed: false };
  call.sockets.push(state);
  Object.defineProperty(socket, 'destroyed', { get: () => state.destroyed });
  socket.destroy = (() => {
    state.destroyed = true;
    return socket;
  }) as Socket['destroy'];
  socket.once('close', () => { state.closed = true; });
  return socket;
}

function appendBody(call: GroqNativeCall, chunk: unknown): void {
  const bytes = Buffer.isBuffer(chunk) ? chunk : chunk instanceof Uint8Array
    ? Buffer.from(chunk) : Buffer.from(String(chunk), 'utf8');
  call.body = Buffer.concat([call.body, bytes]);
}

export function groqNativeHarness(replies: readonly GroqNativeReply[]) {
  const queue = [...replies];
  const calls: GroqNativeCall[] = [];
  const request = ((options: RequestOptions, callback: (response: IncomingMessage) => void) => {
    const reply = queue.shift();
    if (!reply) throw new Error('Unexpected synthetic Groq request');
    if ('synchronousError' in reply) throw reply.synchronousError;
    const call: GroqNativeCall = {
      options: structuredClone(options), body: Buffer.alloc(0), timeout: undefined, ended: false,
      requestDestroyed: false, responseDestroyed: false, sockets: [],
    };
    calls.push(call);
    const handle = new EventEmitter() as ClientRequest;
    const socket = syntheticSocket(call);
    Object.defineProperties(handle, {
      destroyed: { get: () => call.requestDestroyed },
      writableEnded: { get: () => call.ended },
      socket: { value: socket },
    });
    handle.write = ((chunk: unknown) => { appendBody(call, chunk); return true; }) as ClientRequest['write'];
    handle.setTimeout = ((milliseconds: number, listener?: () => void) => {
      call.timeout = milliseconds;
      if (listener) handle.once('timeout', listener);
      return handle;
    }) as ClientRequest['setTimeout'];
    handle.destroy = (() => { call.requestDestroyed = true; return handle; }) as ClientRequest['destroy'];
    handle.end = ((chunk?: unknown) => {
      call.ended = true;
      if (chunk !== undefined) appendBody(call, chunk);
      queueMicrotask(() => {
        if (reply.hold || call.requestDestroyed) return;
        if (reply.requestError) {
          handle.emit('error', reply.requestError);
          handle.emit('close');
          socket.emit('close');
          return;
        }
        const response = new EventEmitter() as IncomingMessage;
        Object.defineProperties(response, {
          statusCode: { value: reply.status ?? 200 },
          complete: { value: reply.complete ?? true, writable: true },
          socket: { value: socket },
          destroyed: { get: () => call.responseDestroyed },
        });
        response.destroy = (() => { call.responseDestroyed = true; return response; }) as IncomingMessage['destroy'];
        response.resume = (() => response) as IncomingMessage['resume'];
        callback(response);
        for (let index = 0; index < (reply.extraSockets ?? 0); index++) handle.emit('socket', syntheticSocket(call));
        if (reply.responseFailure === 'error') response.emit('error', new Error('SYNTHETIC_SECRET_RESPONSE'));
        else if (reply.responseFailure === 'aborted') response.emit('aborted');
        else if (reply.responseFailure === 'close') response.emit('close');
        else if (reply.socketFailure) socket.emit('error', new Error('SYNTHETIC_SECRET_SOCKET'));
        else {
          const chunks = Array.isArray(reply.body) ? reply.body : [reply.body ?? '{}'];
          for (const chunk of chunks) response.emit('data', chunk);
          response.emit('end');
          response.emit('close');
          handle.emit('close');
          for (const stateSocket of [socket]) stateSocket.emit('close');
        }
      });
      return handle;
    }) as ClientRequest['end'];
    return handle;
  }) as (options: RequestOptions, callback: (response: IncomingMessage) => void) => ClientRequest;
  return { calls, request };
}

export function manuallySettledGroqNativeHarness() {
  const calls: GroqNativeCall[] = [];
  let received!: (response: IncomingMessage) => void;
  let response: IncomingMessage | undefined;
  let lateResponseDestroyed = false;
  const call: GroqNativeCall = {
    options: {}, body: Buffer.alloc(0), timeout: undefined, ended: false,
    requestDestroyed: false, responseDestroyed: false, sockets: [],
  };
  const handle = new EventEmitter() as ClientRequest;
  const socket = syntheticSocket(call);
  const socketEmitters: SyntheticSocket[] = [socket];
  Object.defineProperties(handle, {
    destroyed: { get: () => call.requestDestroyed }, writableEnded: { get: () => call.ended }, socket: { value: socket },
  });
  handle.write = ((chunk: unknown) => { appendBody(call, chunk); return true; }) as ClientRequest['write'];
  handle.setTimeout = ((milliseconds: number, listener?: () => void) => {
    call.timeout = milliseconds;
    if (listener) handle.once('timeout', listener);
    return handle;
  }) as ClientRequest['setTimeout'];
  handle.destroy = (() => { call.requestDestroyed = true; return handle; }) as ClientRequest['destroy'];
  handle.end = ((chunk?: unknown) => {
    call.ended = true;
    if (chunk !== undefined) appendBody(call, chunk);
    return handle;
  }) as ClientRequest['end'];
  const request = ((options: RequestOptions, callback: (incoming: IncomingMessage) => void) => {
    if (calls.length) throw new Error('Unexpected second synthetic Groq request');
    call.options = structuredClone(options);
    calls.push(call);
    received = callback;
    return handle;
  }) as (options: RequestOptions, callback: (response: IncomingMessage) => void) => ClientRequest;
  const control = {
    respond(status = 200, complete = false) {
      response = new EventEmitter() as IncomingMessage;
      Object.defineProperties(response, {
        statusCode: { value: status }, complete: { value: complete, writable: true, configurable: true },
        socket: { value: socket }, destroyed: { get: () => call.responseDestroyed },
      });
      response.destroy = (() => { call.responseDestroyed = true; return response; }) as IncomingMessage['destroy'];
      response.resume = (() => response!) as IncomingMessage['resume'];
      received(response);
    },
    data(chunk: string | Buffer | Uint8Array) { response?.emit('data', chunk); },
    end(complete = true) {
      if (!response) throw new Error('Synthetic Groq response was not started');
      Object.defineProperty(response, 'complete', { value: complete, writable: true });
      response.emit('end');
    },
    assignSocket() {
      const assigned = syntheticSocket(call);
      socketEmitters.push(assigned);
      handle.emit('socket', assigned);
    },
    closeResponse() { response?.emit('close'); },
    closeRequest() { handle.emit('close'); },
    closeSocket(index = 0) {
      socketEmitters[index]?.emit('close');
    },
    errorSocket(index = 0) { socketEmitters[index]?.emit('error', new Error('SYNTHETIC_SECRET_SOCKET')); },
    errorRequest() { handle.emit('error', new Error('SYNTHETIC_SECRET_REQUEST')); },
    timeout() { handle.emit('timeout'); },
    repeatCallback() {
      const late = new EventEmitter() as IncomingMessage;
      Object.defineProperties(late, { statusCode: { value: 200 }, complete: { value: true }, destroyed: { get: () => lateResponseDestroyed } });
      late.destroy = (() => { lateResponseDestroyed = true; return late; }) as IncomingMessage['destroy'];
      late.resume = (() => late) as IncomingMessage['resume'];
      received(late);
    },
    duplicateTerminalEvents() { response?.emit('end'); response?.emit('close'); handle.emit('close'); socket.emit('close'); },
    get responseDestroyed() { return call.responseDestroyed; },
    get lateResponseDestroyed() { return lateResponseDestroyed; },
  };
  return { calls, request, control };
}
