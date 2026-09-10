import { EventEmitter } from 'node:events';
import type { ClientRequest, IncomingMessage, RequestOptions } from 'node:http';
import type { GenerationRequest } from '../../src/server/generation/generation-contract.ts';
import { GENERATION_SCHEMA, LOCAL_PARAMETERS, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from '../../src/server/generation/generation-artifacts.ts';
import { QWEN_CONFIGURATION } from '../../src/server/generation/ollama-generation-model.ts';
import type { OllamaNativeRequest } from '../../src/server/generation/ollama-generation-http.ts';

export const QWEN_DIGEST = '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd';

export function validMetadata() {
  return {
    version: { version: '0.33.3' },
    show: {
      details: { parent_model: '', format: 'gguf', family: 'qwen35', quantization_level: 'Q4_K_M' },
      capabilities: ['completion'],
      template: '{{ .Prompt }}',
      parameters: 'presence_penalty 1.5\ntemperature 1\ntop_k 20\ntop_p 0.95',
      model_info: {
        'general.architecture': 'qwen35',
        'qwen35.context_length': 262144,
        'tokenizer.ggml.model': 'gpt2',
        'tokenizer.ggml.pre': 'qwen35',
        'tokenizer.ggml.add_eos_token': false,
        'tokenizer.ggml.add_padding_token': false,
        'tokenizer.ggml.add_bos_token': false,
      },
      remote_model: '', remote_host: '',
    },
    tags: {
      models: [{
        name: 'qwen3.5:4b', model: 'qwen3.5:4b', digest: QWEN_DIGEST,
        details: { format: 'gguf', family: 'qwen35', quantization_level: 'Q4_K_M' },
        remote_model: '', remote_host: '',
      }],
    },
  };
}

export function generationRequest(system = '', user = ''): GenerationRequest {
  return Object.freeze({
    messages: Object.freeze([
      Object.freeze({ role: 'system' as const, content: system }),
      Object.freeze({ role: 'user' as const, content: user }),
    ]),
    schema: GENERATION_SCHEMA,
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    outputContractVersion: OUTPUT_CONTRACT_VERSION,
    controls: LOCAL_PARAMETERS,
    deadlineMs: 120000,
    configuration: QWEN_CONFIGURATION,
  });
}

export function ollamaChatBody(candidate: unknown, overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    model: 'qwen3.5:4b:local',
    message: { role: 'assistant', content: JSON.stringify(candidate) },
    done: true,
    done_reason: 'stop',
    ...overrides,
  });
}

export type NativeReply = {
  readonly status?: number;
  readonly body?: string | Buffer | readonly (string | Buffer)[];
  readonly headers?: Record<string, string>;
  readonly complete?: boolean;
  readonly responseError?: boolean;
  readonly closeBeforeEnd?: boolean;
  readonly afterHeadersFailure?: 'response-error' | 'response-aborted' | 'response-close' | 'socket-error' | 'request-error';
} | { readonly requestError: NodeJS.ErrnoException }
  | { readonly synchronousError: Error }
  | { readonly hold: true };

export type NativeCall = {
  options: RequestOptions;
  body: string;
  timeout: number | undefined;
  ended: boolean;
  destroyed: boolean;
  responseDestroyed: boolean;
};

export function nativeHarness(replies: readonly NativeReply[]) {
  const queue = [...replies];
  const calls: NativeCall[] = [];
  const request: OllamaNativeRequest = ((options: RequestOptions, callback: (response: IncomingMessage) => void) => {
    const reply = queue.shift() ?? { hold: true };
    if ('synchronousError' in reply) throw reply.synchronousError;
    const call: NativeCall = {
      options: structuredClone(options), body: '', timeout: undefined,
      ended: false, destroyed: false, responseDestroyed: false,
    };
    calls.push(call);
    const handle = new EventEmitter() as ClientRequest;
    Object.defineProperties(handle, {
      destroyed: { get: () => call.destroyed },
      writableEnded: { get: () => call.ended },
    });
    handle.write = ((chunk: unknown) => {
      call.body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
      return true;
    }) as ClientRequest['write'];
    handle.setTimeout = ((milliseconds: number, listener?: () => void) => {
      call.timeout = milliseconds;
      if (listener) handle.once('fixture-timeout', listener);
      return handle;
    }) as ClientRequest['setTimeout'];
    handle.destroy = (() => { call.destroyed = true; return handle; }) as ClientRequest['destroy'];
    handle.end = ((chunk?: unknown) => {
      call.ended = true;
      if (chunk !== undefined) call.body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
      queueMicrotask(() => {
        if (call.destroyed || 'hold' in reply) return;
        if ('requestError' in reply) { handle.emit('error', reply.requestError); handle.emit('close'); return; }
        const response = new EventEmitter() as IncomingMessage;
        const socket = new EventEmitter() as EventEmitter & { destroyed: boolean; destroy: () => void };
        socket.destroyed = false;
        socket.destroy = () => { socket.destroyed = true; };
        Object.defineProperty(handle, 'socket', { value: socket, configurable: true });
        const chunks = Array.isArray(reply.body) ? reply.body : [reply.body ?? '{}'];
        Object.defineProperties(response, {
          statusCode: { value: reply.status ?? 200, writable: true },
          headers: { value: reply.headers ?? { 'content-type': 'application/json' } },
          complete: { value: reply.complete ?? true, writable: true },
          destroyed: { get: () => call.responseDestroyed },
          socket: { value: socket },
        });
        response.destroy = (() => { call.responseDestroyed = true; return response; }) as IncomingMessage['destroy'];
        response.resume = (() => response) as IncomingMessage['resume'];
        callback(response);
        if (reply.afterHeadersFailure) {
          if (reply.afterHeadersFailure === 'response-error') response.emit('error', new Error('SECRET response failure'));
          else if (reply.afterHeadersFailure === 'response-aborted') response.emit('aborted');
          else if (reply.afterHeadersFailure === 'response-close') response.emit('close');
          else if (reply.afterHeadersFailure === 'socket-error') socket.emit('error', new Error('SECRET socket failure'));
          else handle.emit('error', new Error('SECRET request failure'));
          return;
        }
        if (reply.responseError) { response.emit('error', new Error('SECRET response failure')); response.emit('close'); return; }
        for (const chunkValue of chunks) response.emit('data', chunkValue);
        if (reply.closeBeforeEnd) { response.emit('close'); return; }
        response.emit('end');
        response.emit('close');
        handle.emit('close');
        socket.destroyed = true;
        socket.emit('close');
      });
      return handle;
    }) as ClientRequest['end'];
    return handle;
  }) as OllamaNativeRequest;
  return { calls, request };
}

export function manuallySettledNativeHarness() {
  const calls: NativeCall[] = [];
  const handle = new EventEmitter() as ClientRequest;
  const socket = new EventEmitter() as EventEmitter & { destroyed: boolean; destroy: () => void };
  socket.destroyed = false;
  socket.destroy = () => { socket.destroyed = true; socket.emit('close'); };
  let callback!: (response: IncomingMessage) => void;
  let response: IncomingMessage | undefined;
  let responseDestroyed = false;
  let lateResponseDestroyed = false;
  const call: NativeCall = {
    options: {}, body: '', timeout: undefined, ended: false, destroyed: false, responseDestroyed: false,
  };
  Object.defineProperties(handle, {
    destroyed: { get: () => call.destroyed },
    writableEnded: { get: () => call.ended },
    socket: { value: socket },
  });
  handle.write = ((chunk: unknown) => { call.body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk); return true; }) as ClientRequest['write'];
  handle.setTimeout = ((milliseconds: number, listener?: () => void) => {
    call.timeout = milliseconds;
    if (listener) handle.once('fixture-timeout', listener);
    return handle;
  }) as ClientRequest['setTimeout'];
  handle.destroy = (() => { call.destroyed = true; return handle; }) as ClientRequest['destroy'];
  handle.end = ((chunk?: unknown) => {
    call.ended = true;
    if (chunk !== undefined) call.body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
    return handle;
  }) as ClientRequest['end'];
  const request: OllamaNativeRequest = ((options: RequestOptions, received: (incoming: IncomingMessage) => void) => {
    call.options = structuredClone(options);
    calls.push(call);
    callback = received;
    return handle;
  }) as OllamaNativeRequest;
  const control = {
    respond(status = 200) {
      response = new EventEmitter() as IncomingMessage;
      Object.defineProperties(response, {
        statusCode: { value: status, writable: true }, headers: { value: { 'content-type': 'application/json' } },
        complete: { value: false, writable: true, configurable: true },
        destroyed: { get: () => responseDestroyed }, socket: { value: socket },
      });
      response.destroy = (() => { responseDestroyed = true; call.responseDestroyed = true; return response; }) as IncomingMessage['destroy'];
      response.resume = (() => response!) as IncomingMessage['resume'];
      callback(response);
    },
    data(chunk: string | Buffer) { response?.emit('data', chunk); },
    end(complete = true) {
      if (!response) throw new Error('Response not started');
      Object.defineProperty(response, 'complete', { value: complete, writable: true });
      response.emit('end');
    },
    closeResponse() { response?.emit('close'); },
    closeRequest() { handle.emit('close'); },
    closeSocket() { socket.destroy(); },
    repeatCallback() {
      const late = new EventEmitter() as IncomingMessage;
      Object.defineProperties(late, { statusCode: { value: 200 }, complete: { value: true }, destroyed: { get: () => lateResponseDestroyed } });
      late.destroy = (() => { lateResponseDestroyed = true; return late; }) as IncomingMessage['destroy'];
      late.resume = (() => late) as IncomingMessage['resume'];
      callback(late);
    },
    duplicateTerminalEvents() { response?.emit('end'); response?.emit('close'); handle.emit('close'); socket.emit('close'); },
    get responseDestroyed() { return responseDestroyed; },
    get lateResponseDestroyed() { return lateResponseDestroyed; },
  };
  return { calls, request, control };
}
