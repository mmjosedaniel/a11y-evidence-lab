import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import http, { type ClientRequest, type IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import test, { type TestContext } from 'node:test';
import { randomUUID } from 'node:crypto';
import type { Browser, BrowserContext, Page } from 'playwright';
import {
  prepareM602SuccessorObservers,
  type M602SuccessorObserverIO,
  type M602SuccessorObserverSession,
} from './helpers/m602-successor-observers.ts';
import type {
  M602SuccessorCleanup,
  M602SuccessorFailure,
} from './helpers/m602-successor-evidence.ts';
import {
  formatM602SuccessorFailure,
  parseM602Arguments,
} from './helpers/m602-run-case.ts';

type JsonRecord = Record<string, any>;
type Deferred<T> = ReturnType<typeof Promise.withResolvers<T>>;
type PreparationPhase = 'application' | 'browser' | 'context' | 'page' | 'ready' | 'gpu';
type RuntimeFailureCode = 'transport-lifecycle' | 'http-metadata' | 'body-limit' | 'encoding-json'
  | 'target-cardinality' | 'digest' | 'context' | 'memory';
type RuntimeFailureSink = (code: RuntimeFailureCode) => unknown;

const repo = path.resolve(import.meta.dirname, '..');
const revision = 'a'.repeat(40);
const allNotCreated = Object.freeze({
  ui: 'not-created', runtime: 'not-created', gpu: 'not-created', application: 'not-created',
  browser: 'not-created', scratch: 'not-created',
}) satisfies M602SuccessorCleanup;
const allComplete = Object.freeze({
  ui: 'complete', runtime: 'complete', gpu: 'complete', application: 'complete',
  browser: 'complete', scratch: 'complete',
}) satisfies M602SuccessorCleanup;

function createRoot(): string {
  const root = path.join(repo, 'temp', `m602-test-${randomUUID()}`);
  fs.mkdirSync(root);
  fs.mkdirSync(path.join(root, 'runs'));
  fs.mkdirSync(path.join(root, 'client', 'assets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'observer-scratch'));
  fs.writeFileSync(path.join(root, 'client', 'index.html'), '<!doctype html><title>synthetic</title>\n', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'client', 'assets', 'index-C6L8S9Ht.css'), 'body{}\n', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'client', 'assets', 'index-C7OtU_Ke.js'), 'export {};\n', { flag: 'wx' });
  return root;
}

function removeRoot(root: string): void {
  assert.equal(path.dirname(root), path.join(repo, 'temp'));
  assert.match(path.basename(root), /^m602-test-[0-9a-f-]{36}$/u);
  assert.equal(fs.realpathSync(root).toLowerCase(), root.toLowerCase());
  const inspect = (target: string): void => {
    const stat = fs.lstatSync(target);
    assert.equal(stat.isSymbolicLink(), false);
    assert.equal(stat.nlink, 1);
    if (stat.isDirectory()) for (const child of fs.readdirSync(target)) inspect(path.join(target, child));
  };
  inspect(root);
  fs.rmSync(root, { recursive: true });
}

async function turns(count = 4): Promise<void> {
  for (let index = 0; index < count; index++) await new Promise<void>(resolve => setImmediate(resolve));
}

function response(body: string | Uint8Array, options: { status?: number; type?: string; end?: boolean } = {}): IncomingMessage & PassThrough {
  const value = new PassThrough() as IncomingMessage & PassThrough;
  value.statusCode = options.status ?? 200;
  value.headers = { 'content-type': options.type ?? 'application/json' };
  Object.defineProperty(value, 'complete', { value: false, writable: true });
  queueMicrotask(() => {
    value.write(body);
    if (options.end !== false) { Object.defineProperty(value, 'complete', { value: true, writable: true }); value.end(); }
  });
  return value;
}

function runtimeRequest(body: string | Uint8Array = JSON.stringify({ models: [{
  name: 'qwen3.5:4b', digest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd',
  context_length: 32768, size: 3_000_000_000, size_vram: 3_000_000_000,
}] }), options: { status?: number; type?: string; end?: boolean;
  capture?: (request: ClientRequest, incoming: IncomingMessage) => void } = {}) {
  return ((requestOptions: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
    assert.equal(requestOptions.method, 'GET');
    assert.equal(requestOptions.hostname, '127.0.0.1');
    assert.equal(requestOptions.port, 11434);
    assert.equal(requestOptions.path, '/api/ps');
    const request = new EventEmitter() as ClientRequest & { destroyed: boolean };
    const socket = new EventEmitter() as EventEmitter & { destroyed: boolean; destroy(): void };
    socket.destroyed = false;
    socket.destroy = () => { socket.destroyed = true; socket.emit('close'); };
    request.destroyed = false;
    Object.defineProperty(request, 'socket', { value: socket });
    request.destroy = (() => { request.destroyed = true; socket.destroy(); queueMicrotask(() => request.emit('close')); return request; }) as never;
    request.end = (() => { queueMicrotask(() => {
      const incoming = response(body, options);
      Object.defineProperty(incoming, 'socket', { value: socket });
      incoming.once('end', () => { queueMicrotask(() => { incoming.emit('close'); request.emit('close'); socket.destroy(); }); });
      options.capture?.(request, incoming);
      callback(incoming);
    }); return request; }) as never;
    request.setTimeout = (() => request) as never;
    return request;
  }) as M602SuccessorObserverIO['runtimeRequest'];
}

function lifecycleRuntimeRequest(kind: 'request-error' | 'response-abort' | 'incomplete' | 'duplicate' | 'premature-close') {
  return ((requestOptions: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
    assert.deepEqual({ hostname: requestOptions.hostname, port: requestOptions.port, path: requestOptions.path, method: requestOptions.method },
      { hostname: '127.0.0.1', port: 11434, path: '/api/ps', method: 'GET' });
    const request = new EventEmitter() as ClientRequest & { destroyed: boolean };
    const socket = new EventEmitter() as EventEmitter & { destroyed: boolean; destroy(): void };
    socket.destroyed = false;
    socket.destroy = () => { if (socket.destroyed) return; socket.destroyed = true; queueMicrotask(() => socket.emit('close')); };
    request.destroyed = false;
    Object.defineProperty(request, 'socket', { value: socket });
    request.destroy = (() => { if (request.destroyed) return request; request.destroyed = true; socket.destroy(); queueMicrotask(() => request.emit('close')); return request; }) as never;
    request.setTimeout = (() => request) as never;
    const incoming = () => {
      const value = new PassThrough() as IncomingMessage & PassThrough;
      value.statusCode = 200; value.headers = { 'content-type': 'application/json' };
      Object.defineProperty(value, 'socket', { value: socket });
      Object.defineProperty(value, 'complete', { value: false, writable: true });
      return value;
    };
    request.end = (() => { queueMicrotask(() => {
      if (kind === 'request-error') { request.emit('error', new Error('private request detail')); return; }
      if (kind === 'premature-close') { request.emit('close'); return; }
      const first = incoming(); callback(first);
      if (kind === 'response-abort') { first.emit('aborted'); first.destroy(); return; }
      if (kind === 'incomplete') { first.end('{}'); return; }
      const second = incoming(); callback(second); first.destroy(); second.destroy();
    }); return request; }) as never;
    return request;
  }) as M602SuccessorObserverIO['runtimeRequest'];
}

async function prepareWithRuntimeFailure(root: string, io: M602SuccessorObserverIO, sink: RuntimeFailureSink, signal?: AbortSignal) {
  return await prepareM602SuccessorObservers(environment(root, io), signal, sink);
}

async function exerciseScheduledRuntime(session: Pick<M602SuccessorObserverSession, 'observers'>,
  tick: (milliseconds: number) => void, deadline = false): Promise<'fulfilled' | 'rejected'> {
  const running = exerciseObserver(session.observers.runtime as never).then(() => 'fulfilled' as const, () => 'rejected' as const);
  await turns(); tick(1000); await turns();
  if (deadline) { tick(5000); await turns(); }
  return await running;
}

async function collectRuntimeResult(t: TestContext, runtime: M602SuccessorObserverIO['runtimeRequest'], sink: RuntimeFailureSink,
  deadline = false) {
  const root = createRoot();
  try {
    const harness = primitiveHarness({ runtime });
    const prepared = await prepareWithRuntimeFailure(root, harness.io, sink);
    assert.equal(prepared.ok, true);
    if (!prepared.ok) throw new Error('Synthetic observer preparation failed');
    harness.activateCollection();
    const state = await exerciseScheduledRuntime(prepared.session, milliseconds => t.mock.timers.tick(milliseconds), deadline);
    const samples = prepared.session.samples({ ui: { status: 'unavailable' }, runtime: { status: 'failed' },
      gpu: { status: 'unavailable' } } as never);
    assert.ok(samples);
    const cleanup = await prepared.session.close();
    return { state, samples, cleanup };
  } finally { removeRoot(root); }
}

function gpuSpawn(output = '1000, 7000\n', options: { close?: boolean; code?: number; stderr?: string } = {}) {
  return ((command: string, args: readonly string[], spawnOptions: JsonRecord) => {
    assert.equal(command, 'C:/Windows/System32/nvidia-smi.exe');
    assert.deepEqual(args, ['--query-gpu=memory.used,memory.free', '--format=csv,noheader,nounits']);
    assert.deepEqual({ shell: spawnOptions.shell, windowsHide: spawnOptions.windowsHide }, { shell: false, windowsHide: true });
    const child = new EventEmitter() as JsonRecord;
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.kill = () => { queueMicrotask(() => child.emit('close', null)); return true; };
    queueMicrotask(() => {
      child.stdout.end(output);
      child.stderr.end(options.stderr ?? '');
      child.emit('exit', options.code ?? 0);
      if (options.close !== false) child.emit('close', options.code ?? 0);
    });
    return child;
  }) as M602SuccessorObserverIO['spawnGpu'];
}

function closedPortConnect() {
  return ((..._args: unknown[]) => {
    const socket = new EventEmitter() as Socket & { destroyed: boolean };
    socket.destroyed = false;
    socket.destroy = (() => { socket.destroyed = true; queueMicrotask(() => socket.emit('close')); return socket; }) as never;
    socket.setTimeout = (() => socket) as never;
    queueMicrotask(() => socket.emit('error', Object.assign(new Error('closed'), { code: 'ECONNREFUSED' })));
    return socket;
  }) as M602SuccessorObserverIO['connect'];
}

type HarnessOptions = {
  readonly pending?: Partial<Record<PreparationPhase, Deferred<unknown>>>;
  readonly pendingClose?: Partial<Record<'application' | 'browser' | 'context', Deferred<void>>>;
  readonly pageFault?: 'external-request' | 'non-get-request' | 'popup' | 'download' | 'crash' | 'pageerror';
  readonly runtime?: M602SuccessorObserverIO['runtimeRequest'];
  readonly spawnGpu?: M602SuccessorObserverIO['spawnGpu'];
  readonly connect?: M602SuccessorObserverIO['connect'];
  readonly uiPendingStep?: 'focus' | 'focused' | 'change' | 'checked';
  readonly uiStepDelayMs?: number;
};

function primitiveHarness(options: HarnessOptions = {}) {
  const calls: string[] = [];
  const listeners = new Map<string, (...args: unknown[]) => void>();
  let routeHandler: ((route: JsonRecord) => void | Promise<void>) | undefined;
  let connected = true;
  let focused = false;
  let selectedMode: 'local' | 'groq' | undefined;
  let collectionActive = false;
  const pendingUi = options.uiPendingStep ? Promise.withResolvers<void>() : undefined;
  const pause = async (step: NonNullable<HarnessOptions['uiPendingStep']>) => {
    if (!collectionActive) return;
    if (options.uiPendingStep === step) await pendingUi!.promise;
    if (options.uiStepDelayMs !== undefined) await new Promise<void>(resolve => setTimeout(resolve, options.uiStepDelayMs));
  };
  const target = {
    async isEnabled() { calls.push('target.enabled'); return true; },
    async focus() { calls.push('target.focus'); await pause('focus'); focused = true; },
    async evaluate() { calls.push('target.focused'); await pause('focused'); return focused; },
  };
  const local = {
    async isEnabled() { calls.push('local.enabled'); return true; },
    async isChecked() { calls.push('local.checked'); return selectedMode === 'local'; },
    async check() { calls.push('local.check'); selectedMode = 'local'; },
  };
  const groq = {
    async isEnabled() { calls.push('groq.enabled'); return true; },
    async isChecked() { calls.push('groq.checked'); await pause('checked'); return selectedMode === 'groq'; },
    async check() { calls.push('groq.check'); await pause('change'); selectedMode = 'groq'; },
  };
  const page = {
    on(event: string, listener: (...args: unknown[]) => void) { listeners.set(event, listener); },
    async route(_pattern: string, handler: (route: JsonRecord) => void | Promise<void>) { calls.push('page.route'); routeHandler = handler; },
    setDefaultTimeout(milliseconds: number) { calls.push(`page.timeout:${milliseconds}`); },
    async goto(url: string) {
      calls.push(`page.goto:${url}`);
      if (options.pending?.ready) await options.pending.ready.promise;
      if (routeHandler) {
        const requestedUrl = options.pageFault === 'external-request' ? 'https://example.test/' : url;
        const method = options.pageFault === 'non-get-request' ? 'POST' : 'GET';
        const route = { request: () => ({ url: () => requestedUrl, method: () => method }),
          async continue() { calls.push(`route.continue:${requestedUrl}`); },
          async abort() { calls.push(`route.abort:${requestedUrl}`); } };
        await routeHandler(route);
      }
      if (options.pageFault === 'popup') listeners.get('popup')?.({});
      if (options.pageFault === 'download') listeners.get('download')?.({});
      if (options.pageFault === 'crash') listeners.get('crash')?.();
      if (options.pageFault === 'pageerror') listeners.get('pageerror')?.(new Error('page'));
      return { status: () => 200, url: () => url };
    },
    getByLabel(name: string) {
      if (name === 'Target URL') return target;
      if (/Local/u.test(name)) return local;
      if (/Groq/u.test(name)) return groq;
      throw new Error(`Unexpected label ${name}`);
    },
  } as unknown as Page;
  const context = {
    async route(_pattern: string, handler: (route: JsonRecord) => void | Promise<void>) { calls.push('context.route'); routeHandler = handler; },
    async newPage() { calls.push('page.new'); if (options.pending?.page) return await options.pending.page.promise as Page; return page; },
    async close() { calls.push('context.close'); if (options.pendingClose?.context) await options.pendingClose.context.promise; },
  } as unknown as BrowserContext;
  const browser = {
    async newContext(input: JsonRecord) {
      calls.push(`context.new:${JSON.stringify(input)}`);
      if (options.pending?.context) return await options.pending.context.promise as BrowserContext;
      return context;
    },
    async close() { calls.push('browser.close'); if (options.pendingClose?.browser) await options.pendingClose.browser.promise; connected = false; },
    isConnected() { return connected; },
    version() { return '151.0.7922.34'; },
  } as unknown as Browser;
  const service = { url: 'http://127.0.0.1:41234', async stop() { calls.push('application.stop');
    if (options.pendingClose?.application) await options.pendingClose.application.promise;
    return { ok: true, status: 'stopped' } as const; } };
  const io = Object.freeze({
    async startApplication(input: JsonRecord) {
      calls.push(`application.start:${JSON.stringify(input)}`);
      if (options.pending?.application) return await options.pending.application.promise as never;
      return { ok: true, service } as never;
    },
    async launchBrowser(input: JsonRecord) {
      calls.push(`browser.launch:${JSON.stringify(input)}`);
      if (options.pending?.browser) return await options.pending.browser.promise as Browser;
      return browser;
    },
    runtimeRequest: options.runtime ?? runtimeRequest(),
    spawnGpu: options.spawnGpu ?? gpuSpawn(),
    connect: options.connect ?? closedPortConnect(),
  }) as unknown as M602SuccessorObserverIO;
  return { io, calls, service, browser, context, page, pendingUi, listeners,
    activateCollection() { collectionActive = true; } };
}

function environment(root: string, io: M602SuccessorObserverIO) {
  return Object.freeze({ root, applicationRevision: revision, io });
}

async function exerciseObserver(observer: ((gate: JsonRecord) => unknown) | undefined, signal = new AbortController().signal) {
  assert.ok(observer);
  let accepted = false;
  let effect: Promise<void> | undefined;
  const started = Promise.withResolvers<void>();
  await observer({ signal, start(work: (active: AbortSignal) => void | Promise<void>) {
    assert.equal(accepted, false);
    accepted = true;
    effect = Promise.resolve(work(signal));
    started.resolve();
    return true;
  } });
  await started.promise;
  await effect;
  assert.equal(accepted, true);
}

test('parses only the three literal successor command shapes and preserves all original modes', () => {
  for (const label of ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'] as const) {
    assert.deepEqual(parseM602Arguments(['--execute-successor', '--case', label]), { ok: true, mode: 'execute-successor', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback-successor', '--case', label]), { ok: true, mode: 'readback-successor', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--execute', '--case', label]), { ok: true, mode: 'execute', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback', '--case', label]), { ok: true, mode: 'readback', caseLabel: label });
  }
  assert.deepEqual(parseM602Arguments(['--qualify-successor-observers']), { ok: true, mode: 'qualify-successor-observers' });
  for (const args of [
    ['--qualify-successor-observers', '--case', 'local-image'],
    ['--execute-successor'],
    ['--execute-successor', '--case', 'unknown'],
    ['--execute-successor', '--case', 'local-image', '--root', 'alternate'],
    ['--execute-successor', '--readback-successor', '--case', 'local-image'],
    ['--execute-successor', '--case', 'local-image', '--case', 'local-label'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });
});

test('parses only the three literal completion command shapes without widening successor modes', () => {
  for (const label of ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'] as const) {
    assert.deepEqual(parseM602Arguments(['--execute-completion', '--case', label]),
      { ok: true, mode: 'execute-completion', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback-completion', '--case', label]),
      { ok: true, mode: 'readback-completion', caseLabel: label });
  }
  assert.deepEqual(parseM602Arguments(['--qualify-completion-observers']),
    { ok: true, mode: 'qualify-completion-observers' });
  for (const args of [
    ['--qualify-completion-observers', '--case', 'local-image'],
    ['--execute-completion'],
    ['--execute-completion', '--case', 'unknown'],
    ['--execute-completion', '--case', 'local-image', '--root', 'alternate'],
    ['--execute-completion', '--readback-completion', '--case', 'local-image'],
    ['--execute-successor', '--execute-completion', '--case', 'local-image'],
    ['--execute-completion', '--case', 'local-image', '--case', 'local-label'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });
});

test('formats every closed successor failure without arbitrary fields, I/O, or mutation', () => {
  const states = [allComplete, allNotCreated, Object.freeze({ ...allNotCreated, application: 'uncertain', browser: 'uncertain' as const })];
  const errors = ['evidence-blocked', 'evidence-publication', 'observer-readiness'] as const;
  for (const [index, error] of errors.entries()) {
    const input = Object.freeze({ ok: false, error, cleanup: states[index], secret: 'exclude-me' }) as unknown as M602SuccessorFailure;
    const before = structuredClone(input);
    const formatted = formatM602SuccessorFailure(input);
    assert.equal(formatted, `${JSON.stringify({ ok: false, error, cleanup: states[index] })}\n`);
    assert.equal(formatted.endsWith('\n'), true);
    assert.equal(formatted.endsWith('\n\n'), false);
    assert.deepEqual(JSON.parse(formatted), { ok: false, error, cleanup: states[index] });
    assert.equal(formatted.includes('secret'), false);
    assert.deepEqual(input, before);
  }
});

test('requires the complete five-member isolated observer environment before acquiring resources', async () => {
  const root = createRoot();
  try {
    const harness = primitiveHarness();
    for (const missing of ['startApplication', 'launchBrowser', 'runtimeRequest', 'spawnGpu', 'connect'] as const) {
      const io = { ...harness.io } as JsonRecord;
      delete io[missing];
      assert.deepEqual(await prepareM602SuccessorObservers({ root, applicationRevision: revision, io } as never), {
        ok: false, error: 'observer-readiness', cleanup: allNotCreated,
      }, missing);
    }
    assert.deepEqual(harness.calls, []);
  } finally { removeRoot(root); }
});

test('refuses an already-aborted caller before the first primitive and freezes the cleanup receipt', async () => {
  const root = createRoot();
  try {
    const harness = primitiveHarness();
    const controller = new AbortController();
    controller.abort();
    const result = await prepareM602SuccessorObservers(environment(root, harness.io), controller.signal);
    assert.deepEqual(result, { ok: false, error: 'observer-readiness', cleanup: allNotCreated });
    assert.ok(!result.ok);
    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result.cleanup), true);
    assert.deepEqual(harness.calls, []);
  } finally { removeRoot(root); }
});

test('provisions only the fixed local service/browser/GPU shapes and closes the session idempotently', async () => {
  const root = createRoot();
  try {
    const harness = primitiveHarness();
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    assert.match(prepared.session.gpuBefore.observedAt, /^\d{4}-\d{2}-\d{2}T/u);
    assert.deepEqual({ usedMiB: prepared.session.gpuBefore.usedMiB, freeMiB: prepared.session.gpuBefore.freeMiB },
      { usedMiB: 1000, freeMiB: 7000 });
    await exerciseObserver(prepared.session.observers.ui as never);
    await exerciseObserver(prepared.session.observers.runtime as never);
    await exerciseObserver(prepared.session.observers.gpu as never);
    assert.deepEqual(await prepared.session.close(), allComplete);
    assert.deepEqual(await prepared.session.close(), allComplete);
    assert.equal(harness.calls.filter(call => call === 'context.close').length, 1);
    assert.equal(harness.calls.filter(call => call === 'browser.close').length, 1);
    assert.equal(harness.calls.filter(call => call === 'application.stop').length, 1);
    assert.equal(harness.calls.some(call => call.includes('"runRoot"') && call.includes(`${path.sep}runs`)), true);
    assert.equal(harness.calls.some(call => call.includes('"clientRoot"') && call.includes(`${path.sep}client`)), true);
    assert.equal(harness.calls.some(call => call.includes('"headless":false') && call.includes('"channel":"chromium"')), true);
    assert.equal(harness.calls.includes('local.check'), true);
    assert.deepEqual(fs.readdirSync(path.join(root, 'observer-scratch')), []);
  } finally { removeRoot(root); }
});

test('aborting each awaited preparation stage prevents the next stage and owns every late resource', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const phase of ['application', 'browser', 'context', 'page', 'ready'] as const) {
    const root = createRoot();
    try {
      const gate = Promise.withResolvers<unknown>();
      const harness = primitiveHarness({ pending: { [phase]: gate } });
      const controller = new AbortController();
      const pending = prepareM602SuccessorObservers(environment(root, harness.io), controller.signal);
      await turns();
      controller.abort();
      await turns();
      t.mock.timers.tick(5000);
      const beforeLate = await pending;
      assert.equal(beforeLate.ok, false, phase);
      if (beforeLate.ok) continue;
      assert.equal(beforeLate.error, 'observer-readiness');
      const late = phase === 'application' ? { ok: true, service: harness.service }
        : phase === 'browser' ? harness.browser : phase === 'context' ? harness.context : harness.page;
      gate.resolve(late);
      await turns();
      assert.equal(harness.calls.some(call => call === 'application.stop'), true, phase);
      if (phase !== 'application') assert.equal(harness.calls.some(call => call === 'browser.close'), true, phase);
      if (phase === 'context' || phase === 'page' || phase === 'ready') assert.equal(harness.calls.some(call => call === 'context.close'), true, phase);
      const forbidden = phase === 'application' ? 'browser.launch' : phase === 'browser' ? 'context.new'
        : phase === 'context' ? 'page.new' : phase === 'page' ? 'page.goto' : 'target.enabled';
      assert.equal(harness.calls.some(call => call.startsWith(forbidden)), false, `${phase} advanced after cancellation`);
    } finally { removeRoot(root); }
  }
});

test('startup timeout records pending acquisition as uncertain and late settlement cannot reopen admission', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const gate = Promise.withResolvers<unknown>();
    const harness = primitiveHarness({ pending: { browser: gate } });
    const pending = prepareM602SuccessorObservers(environment(root, harness.io));
    await turns();
    t.mock.timers.tick(10000);
    await turns();
    t.mock.timers.tick(5000);
    const failed = await pending;
    assert.equal(failed.ok, false);
    if (failed.ok) return;
    assert.equal(failed.cleanup.browser, 'uncertain');
    gate.resolve(harness.browser);
    await turns();
    assert.equal(harness.calls.filter(call => call === 'browser.close').length, 1);
    assert.equal(harness.calls.some(call => call.startsWith('context.new')), false);
  } finally { removeRoot(root); }
});

test('caller abort during pending baseline GPU collection owns and closes the child before returning', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const harness = primitiveHarness({ spawnGpu: gpuSpawn('1, 2\n', { close: false }) });
    const controller = new AbortController();
    const pending = prepareM602SuccessorObservers(environment(root, harness.io), controller.signal);
    await turns();
    controller.abort();
    await turns();
    t.mock.timers.tick(5000);
    const result = await pending;
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, 'observer-readiness');
      assert.ok(['complete', 'uncertain'].includes(result.cleanup.gpu));
      assert.equal(result.cleanup.application, 'complete');
      assert.equal(result.cleanup.browser, 'complete');
    }
  } finally { removeRoot(root); }
});

test('pending context closure is uncertain at cleanup expiry and late close cannot mutate the returned receipt', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const closeGate = Promise.withResolvers<void>();
    const harness = primitiveHarness({ pendingClose: { context: closeGate } });
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    const closing = prepared.session.close();
    await turns();
    t.mock.timers.tick(5000);
    const receipt = await closing;
    assert.equal(receipt.browser, 'uncertain');
    const snapshot = structuredClone(receipt);
    closeGate.resolve();
    await turns();
    assert.deepEqual(receipt, snapshot);
  } finally { removeRoot(root); }
});

test('rejects external browser activity and page faults while preserving owned cleanup', async () => {
  for (const fault of ['external-request', 'non-get-request', 'popup', 'download', 'crash', 'pageerror'] as const) {
    const root = createRoot();
    try {
      const harness = primitiveHarness({ pageFault: fault });
      const result = await prepareM602SuccessorObservers(environment(root, harness.io));
      assert.equal(result.ok, false, fault);
      if (result.ok) continue;
      assert.equal(result.error, 'observer-readiness');
      assert.equal(result.cleanup.application, 'complete');
      assert.equal(result.cleanup.browser, 'complete');
      assert.equal(result.cleanup.scratch, 'complete');
      if (fault === 'external-request') assert.equal(harness.calls.includes('route.abort:https://example.test/'), true);
      if (fault === 'non-get-request') assert.equal(harness.calls.includes('route.abort:http://127.0.0.1:41234/'), true);
    } finally { removeRoot(root); }
  }
});

test('UI collection applies one total deadline across ordered steps and rejects abort between every step', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const step of ['focus', 'focused', 'change', 'checked'] as const) {
    const root = createRoot();
    try {
      const harness = primitiveHarness({ uiPendingStep: step });
      const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
      assert.equal(prepared.ok, true, step);
      if (!prepared.ok) continue;
      harness.activateCollection();
      const controller = new AbortController();
      const running = exerciseObserver(prepared.session.observers.ui as never, controller.signal).then(() => 'fulfilled', () => 'rejected');
      await turns();
      t.mock.timers.tick(1000);
      await turns();
      assert.equal(harness.calls.includes(step === 'focus' ? 'target.focus' : step === 'focused' ? 'target.focused'
        : step === 'change' ? 'groq.check' : 'groq.checked'), true, step);
      controller.abort();
      await turns();
      t.mock.timers.tick(5000);
      assert.equal(await running, 'rejected', step);
      harness.pendingUi?.resolve();
      await turns();
      const snapshot = structuredClone(prepared.session.samples({ ui: { status: 'aborted' }, runtime: { status: 'unavailable' }, gpu: { status: 'unavailable' } } as never));
      await turns();
      assert.deepEqual(prepared.session.samples({ ui: { status: 'aborted' }, runtime: { status: 'unavailable' }, gpu: { status: 'unavailable' } } as never), snapshot);
      await prepared.session.close();
    } finally { removeRoot(root); }
  }
});

test('UI collector uses one total deadline rather than resetting a timeout after each successful step', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const harness = primitiveHarness({ uiStepDelayMs: 2000 });
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    let state = 'pending';
    const running = exerciseObserver(prepared.session.observers.ui as never).then(
      () => { state = 'fulfilled'; }, () => { state = 'rejected'; });
    await turns();
    t.mock.timers.tick(1000);
    await turns();
    t.mock.timers.tick(2000);
    await turns();
    t.mock.timers.tick(2000);
    await turns();
    t.mock.timers.tick(1000);
    await turns();
    assert.equal(state, 'rejected');
    await prepared.session.close();
    await running;
  } finally { removeRoot(root); }
});

function streamingRuntimeRequest() {
  return ((_: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
    const incoming = new PassThrough() as IncomingMessage & PassThrough;
    incoming.statusCode = 200;
    incoming.headers = { 'content-type': 'application/json' };
    Object.defineProperty(incoming, 'complete', { value: false, writable: true });
    const request = new EventEmitter() as ClientRequest & { destroyed: boolean };
    request.destroyed = false;
    request.destroy = (() => { request.destroyed = true; incoming.destroy(); queueMicrotask(() => request.emit('close')); return request; }) as never;
    request.setTimeout = (() => request) as never;
    request.end = (() => {
      callback(incoming);
      let count = 0;
      const next = () => {
        if (request.destroyed) return;
        incoming.write(count++ === 0 ? '{"models":[' : ' ');
        setTimeout(next, 900);
      };
      next();
      return request;
    }) as never;
    return request;
  }) as M602SuccessorObserverIO['runtimeRequest'];
}

function diagnosticRuntimeModel(overrides: JsonRecord = {}) {
  return JSON.stringify({ models: [{
    name: 'qwen3.5:4b', digest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd',
    context_length: 32768, size: 3_000_000_000, size_vram: 3_000_000_000, ...overrides,
  }] });
}

test('runtime total deadline expires despite continuously arriving sub-deadline chunks', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const harness = primitiveHarness({ runtime: streamingRuntimeRequest() });
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    let state = 'pending';
    const running = exerciseObserver(prepared.session.observers.runtime as never).then(
      () => { state = 'fulfilled'; }, () => { state = 'rejected'; });
    await turns();
    t.mock.timers.tick(1000);
    await turns();
    for (let elapsed = 0; elapsed < 5000; elapsed += 900) {
      t.mock.timers.tick(Math.min(900, 5000 - elapsed));
      await turns();
    }
    assert.equal(state, 'rejected');
    await prepared.session.close();
    await running;
  } finally { removeRoot(root); }
});

test('runtime collector rejects malformed, oversized, wrong-model, and invalid HTTP evidence', async () => {
  const model = (overrides: JsonRecord = {}) => JSON.stringify({ models: [{
    name: 'qwen3.5:4b', digest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd',
    context_length: 32768, size: 3_000_000_000, size_vram: 3_000_000_000, ...overrides,
  }] });
  const cases = [
    ['status', runtimeRequest('{}', { status: 500 })],
    ['type', runtimeRequest('{}', { type: 'text/plain' })],
    ['json', runtimeRequest('{')],
    ['oversized', runtimeRequest('x'.repeat(65537))],
    ['wrong-model', runtimeRequest(JSON.stringify({ models: [{ name: 'other' }] }))],
    ['invalid-utf8', runtimeRequest(Buffer.concat([
      Buffer.from(`${model().slice(0, -1)},"ignored":"`, 'utf8'), Buffer.from([0xc3, 0x28]), Buffer.from('"}', 'utf8'),
    ]))],
    ['digest', runtimeRequest(model({ digest: '0'.repeat(64) }))],
    ['context', runtimeRequest(model({ context_length: 32767 }))],
    ['size', runtimeRequest(model({ size: 0 }))],
    ['vram', runtimeRequest(model({ size_vram: 3_000_000_001 }))],
  ] as const;
  for (const [name, runtime] of cases) {
    const root = createRoot();
    try {
      const harness = primitiveHarness({ runtime });
      const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
      assert.equal(prepared.ok, true, name);
      if (!prepared.ok) continue;
      const state = await exerciseObserver(prepared.session.observers.runtime as never).then(() => 'fulfilled', () => 'rejected');
      assert.equal(state, 'rejected', name);
      await prepared.session.close();
    } finally { removeRoot(root); }
  }
});

test('runtime failure detail classifies every transport lifecycle failure once without changing samples or cleanup', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const thrown = (() => { throw new Error('private request detail'); }) as M602SuccessorObserverIO['runtimeRequest'];
  const cases = [
    ['request throw', thrown, false],
    ['request error', lifecycleRuntimeRequest('request-error'), false],
    ['response abort', lifecycleRuntimeRequest('response-abort'), false],
    ['incomplete response', lifecycleRuntimeRequest('incomplete'), false],
    ['duplicate response', lifecycleRuntimeRequest('duplicate'), false],
    ['premature request close', lifecycleRuntimeRequest('premature-close'), false],
    ['total deadline', streamingRuntimeRequest(), true],
  ] as const;
  const observed: unknown[] = [];
  for (const [name, runtime, deadline] of cases) {
    const details: RuntimeFailureCode[] = [];
    const result = await collectRuntimeResult(t, runtime, code => details.push(code), deadline);
    observed.push({ name, details, state: result.state, runtime: result.samples.runtime,
      frozen: Object.isFrozen(result.samples), cleanup: result.cleanup });
  }
  assert.deepEqual(observed, cases.map(([name]) => ({ name, details: ['transport-lifecycle'], state: 'rejected',
    runtime: null, frozen: true, cleanup: allComplete })));
});

test('runtime failure detail distinguishes HTTP metadata, body limit, encoding, and target cardinality', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cases = [
    ['status', 'http-metadata', runtimeRequest('{}', { status: 500 })],
    ['content type', 'http-metadata', runtimeRequest('{}', { type: 'text/plain' })],
    ['body limit', 'body-limit', runtimeRequest('x'.repeat(65537))],
    ['UTF-8', 'encoding-json', runtimeRequest(Buffer.from([0xc3, 0x28]))],
    ['JSON', 'encoding-json', runtimeRequest('{')],
    ['top level', 'encoding-json', runtimeRequest('null')],
    ['models shape', 'encoding-json', runtimeRequest('{"models":{}}')],
    ['zero targets', 'target-cardinality', runtimeRequest('{"models":[]}')],
    ['duplicate targets', 'target-cardinality', runtimeRequest(JSON.stringify({ models: [
      JSON.parse(diagnosticRuntimeModel()).models[0], JSON.parse(diagnosticRuntimeModel()).models[0],
    ] }))],
  ] as const;
  const observed: unknown[] = [];
  for (const [name, expected, runtime] of cases) {
    const details: RuntimeFailureCode[] = [];
    const result = await collectRuntimeResult(t, runtime, code => details.push(code));
    observed.push({ name, details, state: result.state, runtime: result.samples.runtime, cleanup: result.cleanup });
    assert.equal(expected satisfies RuntimeFailureCode, expected);
  }
  assert.deepEqual(observed, cases.map(([name, expected]) => ({ name, details: [expected], state: 'rejected',
    runtime: null, cleanup: allComplete })));
});

test('runtime failure detail attributes missing and invalid sample fields to digest, context, or memory', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cases = [
    ['wrong digest', 'digest', diagnosticRuntimeModel({ digest: '0'.repeat(64) })],
    ['missing digest', 'digest', diagnosticRuntimeModel({ digest: undefined })],
    ['wrong context', 'context', diagnosticRuntimeModel({ context_length: 32767 })],
    ['missing context', 'context', diagnosticRuntimeModel({ context_length: undefined })],
    ['zero size', 'memory', diagnosticRuntimeModel({ size: 0 })],
    ['VRAM exceeds size', 'memory', diagnosticRuntimeModel({ size_vram: 3_000_000_001 })],
    ['missing size', 'memory', diagnosticRuntimeModel({ size: undefined })],
    ['missing VRAM', 'memory', diagnosticRuntimeModel({ size_vram: undefined })],
  ] as const;
  const observed: unknown[] = [];
  for (const [name, expected, body] of cases) {
    const details: RuntimeFailureCode[] = [];
    const result = await collectRuntimeResult(t, runtimeRequest(body), code => details.push(code));
    observed.push({ name, details, state: result.state, runtime: result.samples.runtime, cleanup: result.cleanup });
    assert.equal(expected satisfies RuntimeFailureCode, expected);
  }
  assert.deepEqual(observed, cases.map(([name, expected]) => ({ name, details: [expected], state: 'rejected',
    runtime: null, cleanup: allComplete })));
});

test('runtime failure detail latches body-limit before synchronous destructive reentry', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let reenter = () => {};
  const details: RuntimeFailureCode[] = [];
  const runtime = runtimeRequest('x'.repeat(65537), { capture(request, incoming) {
    reenter = () => { incoming.emit('aborted'); request.emit('error', new Error('private later failure')); };
  } });
  const result = await collectRuntimeResult(t, runtime, code => { details.push(code); reenter(); });
  assert.deepEqual(details, ['body-limit']);
  assert.equal(result.state, 'rejected');
  assert.equal(result.samples.runtime, null);
  assert.deepEqual(result.cleanup, allComplete);
});

test('runtime failure detail contains hostile callback results without awaiting or changing failure truth', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const never = new Promise<never>(() => {});
  const cases: readonly [string, RuntimeFailureSink][] = [
    ['throw', () => { throw new Error('private sink detail'); }],
    ['handled rejection', () => { const rejected = Promise.reject(new Error('private rejection')); void rejected.then(undefined, () => {}); return rejected; }],
    ['pending', () => never],
    ['thenable', () => ({ then() { throw new Error('private then detail'); } })],
    ['poisoned native catch', () => {
      const rejected = Promise.reject(new Error('private poisoned rejection'));
      Object.defineProperty(rejected, 'catch', { value() { throw new Error('private catch detail'); } });
      return rejected;
    }],
  ];
  const observed: unknown[] = [];
  for (const [name, adverse] of cases) {
    let calls = 0;
    const result = await collectRuntimeResult(t, runtimeRequest('{'), code => { calls++; assert.equal(code, 'encoding-json'); return adverse(code); });
    observed.push({ name, calls, state: result.state, runtime: result.samples.runtime, cleanup: result.cleanup });
  }
  assert.deepEqual(observed, cases.map(([name]) => ({ name, calls: 1, state: 'rejected', runtime: null, cleanup: allComplete })));
});

test('runtime failure detail stays silent for a valid sample and does not alter admitted data', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const details: RuntimeFailureCode[] = [];
  const root = createRoot();
  try {
    const harness = primitiveHarness();
    const prepared = await prepareWithRuntimeFailure(root, harness.io, code => details.push(code));
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    assert.equal(await exerciseScheduledRuntime(prepared.session, milliseconds => t.mock.timers.tick(milliseconds)), 'fulfilled');
    assert.deepEqual(details, []);
    const samples = prepared.session.samples({ ui: { status: 'unavailable' }, runtime: { status: 'completed' },
      gpu: { status: 'unavailable' } } as never);
    assert.ok(samples);
    assert.deepEqual(samples.runtime, {
      digest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd',
      contextLength: 32768, sizeBytes: 3_000_000_000, sizeVramBytes: 3_000_000_000,
    });
    assert.deepEqual(await prepared.session.close(), allComplete);
  } finally { removeRoot(root); }
});

test('native loopback preserves original request options and classifies truncated response ordering', async () => {
  const results: unknown[] = [];
  for (const truncated of [false, true]) {
    const body = diagnosticRuntimeModel();
    const server = http.createServer((incoming, outgoing) => {
      assert.equal(incoming.method, 'GET'); assert.equal(incoming.url, '/api/ps');
      outgoing.writeHead(200, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) });
      if (!truncated) outgoing.end(body);
      else { outgoing.flushHeaders(); outgoing.write(body.slice(0, 16)); setImmediate(() => outgoing.destroy()); }
    });
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve());
    });
    const address = server.address(); assert.ok(address && typeof address === 'object');
    const root = createRoot();
    const details: RuntimeFailureCode[] = [];
    try {
      const native = ((options: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
        assert.deepEqual({ hostname: options.hostname, port: options.port, path: options.path, method: options.method },
          { hostname: '127.0.0.1', port: 11434, path: '/api/ps', method: 'GET' });
        return http.request({ ...options, hostname: '127.0.0.1', port: address.port, agent: false }, callback);
      }) as M602SuccessorObserverIO['runtimeRequest'];
      const harness = primitiveHarness({ runtime: native });
      const prepared = await prepareWithRuntimeFailure(root, harness.io, code => details.push(code));
      assert.equal(prepared.ok, true);
      if (!prepared.ok) continue;
      harness.activateCollection();
      const state = await exerciseObserver(prepared.session.observers.runtime as never).then(() => 'fulfilled', () => 'rejected');
      const timing = { ui: { status: 'unavailable' }, runtime: { status: truncated ? 'failed' : 'completed' },
        gpu: { status: 'unavailable' } } as never;
      const samples = prepared.session.samples(timing); assert.ok(samples);
      const sample = samples.runtime;
      const cleanup = await prepared.session.close();
      results.push({ truncated, details, state, present: sample !== null, cleanup });
    } finally {
      removeRoot(root); server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  }
  assert.deepEqual(results, [
    { truncated: false, details: [], state: 'fulfilled', present: true, cleanup: allComplete },
    { truncated: true, details: ['transport-lifecycle'], state: 'rejected', present: false, cleanup: allComplete },
  ]);
});

test('GPU collector rejects malformed, multiple-row, oversized, and nonzero samples', async () => {
  for (const [name, spawn] of [
    ['malformed', gpuSpawn('unknown\n')],
    ['multiple', gpuSpawn('1, 2\n3, 4\n')],
    ['oversized', gpuSpawn('1'.repeat(4097))],
    ['nonzero', gpuSpawn('', { code: 1, stderr: 'private details' })],
  ] as const) {
    const root = createRoot();
    try {
      const harness = primitiveHarness({ spawnGpu: spawn });
      const result = await prepareM602SuccessorObservers(environment(root, harness.io));
      assert.equal(result.ok, false, name);
      if (!result.ok) {
        assert.equal(result.error, 'observer-readiness');
        assert.equal(JSON.stringify(result).includes('private details'), false);
      }
    } finally { removeRoot(root); }
  }
});

test('preparation owns a baseline GPU child pending close and returns truthful cleanup', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const harness = primitiveHarness({ spawnGpu: gpuSpawn('1, 2\n', { close: false }) });
    const pending = prepareM602SuccessorObservers(environment(root, harness.io));
    await turns();
    t.mock.timers.tick(5000);
    await turns();
    t.mock.timers.tick(5000);
    const result = await pending;
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, 'observer-readiness');
      assert.ok(['complete', 'uncertain'].includes(result.cleanup.gpu));
    }
  } finally { removeRoot(root); }
});

test('late collector settlement and close may improve cleanup but never mutate frozen timing samples', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  try {
    const body = response(JSON.stringify({ models: [] }), { end: false });
    let request: (ClientRequest & { destroyed: boolean }) | undefined;
    const runtime = ((_: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
      request = new EventEmitter() as ClientRequest & { destroyed: boolean };
      request.destroyed = false;
      request.destroy = (() => { request!.destroyed = true; return request!; }) as never;
      request.end = (() => { callback(body); return request!; }) as never;
      request.setTimeout = (() => request!) as never;
      return request;
    }) as M602SuccessorObserverIO['runtimeRequest'];
    const harness = primitiveHarness({ runtime });
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io));
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    const running = exerciseObserver(prepared.session.observers.runtime as never).then(() => 'fulfilled', () => 'rejected');
    await turns();
    t.mock.timers.tick(1000);
    await turns();
    t.mock.timers.tick(5000);
    assert.equal(await running, 'rejected');
    assert.equal(request?.destroyed, true);
    const timing = { ui: { status: 'unavailable' }, runtime: { status: 'failed' }, gpu: { status: 'unavailable' } } as never;
    const before = structuredClone(prepared.session.samples(timing));
    body.end();
    body.emit('close');
    request?.emit('close');
    await turns();
    assert.deepEqual(prepared.session.samples(timing), before);
    await prepared.session.close();
  } finally { removeRoot(root); }
});

function loadingRuntimeSequence(bodies: readonly string[], calls: string[]) {
  let index = 0;
  return ((options: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
    calls.push(`runtime:${index}`);
    const body = bodies[Math.min(index, bodies.length - 1)]!;
    index++;
    return runtimeRequest(body)(options, callback);
  }) as M602SuccessorObserverIO['runtimeRequest'];
}

test('loading policy polls only after a closed valid absence and admits the later exact target', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  const runtimeCalls: string[] = [];
  try {
    const absent = JSON.stringify({ models: [{ name: 'another-model' }] });
    const ready = diagnosticRuntimeModel();
    const harness = primitiveHarness({ runtime: loadingRuntimeSequence([absent, ready], runtimeCalls) });
    const details: RuntimeFailureCode[] = [];
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io), undefined,
      code => details.push(code), 'm602-loading-observation-v2');
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    const controller = new AbortController();
    let effect: Promise<void> | undefined;
    await prepared.session.observers.runtime?.({ signal: controller.signal, start(work) {
      assert.equal(effect, undefined); effect = Promise.resolve(work(controller.signal)); return true;
    } });
    await turns(); t.mock.timers.tick(1); await turns();
    assert.ok(effect, 'positive one-millisecond offset must start runtime acquisition');
    assert.deepEqual(runtimeCalls, ['runtime:0']);
    assert.deepEqual(details, [], 'valid absence is provisional readiness, not a failure');
    t.mock.timers.tick(999); await turns();
    assert.deepEqual(runtimeCalls, ['runtime:0']);
    t.mock.timers.tick(1); await turns();
    await effect;
    assert.deepEqual(runtimeCalls, ['runtime:0', 'runtime:1']);
    assert.deepEqual(details, []);
    const samples = prepared.session.samples({ ui: { status: 'unavailable' }, runtime: { status: 'completed' },
      gpu: { status: 'unavailable' } } as never);
    assert.ok(samples?.runtime);
    assert.equal(samples.runtime.digest, '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd');
    assert.deepEqual(await prepared.session.close(), allComplete);
  } finally { removeRoot(root); }
});

test('loading policy cancels the interval after a fully closed absence without another request or GPU start', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  const runtimeCalls: string[] = [];
  try {
    const absent = JSON.stringify({ models: [{ name: 'another-model' }] });
    const harness = primitiveHarness({ runtime: loadingRuntimeSequence([absent, diagnosticRuntimeModel()], runtimeCalls) });
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io), undefined, undefined,
      'm602-loading-observation-v2');
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    const controller = new AbortController();
    let runtimeEffect: Promise<void> | undefined, gpuStarts = 0;
    await prepared.session.observers.runtime?.({ signal: controller.signal, start(work) {
      runtimeEffect = Promise.resolve(work(controller.signal)); return true;
    } });
    await prepared.session.observers.gpu?.({ signal: controller.signal, start() { gpuStarts++; return true; } });
    t.mock.timers.tick(1); await turns();
    assert.ok(runtimeEffect);
    assert.deepEqual(runtimeCalls, ['runtime:0']);
    t.mock.timers.tick(500); await turns();
    controller.abort(); await turns();
    assert.equal(await runtimeEffect.then(() => 'fulfilled', () => 'rejected'), 'rejected');
    t.mock.timers.tick(10_000); await turns();
    assert.deepEqual(runtimeCalls, ['runtime:0']);
    assert.equal(gpuStarts, 0);
    assert.deepEqual(await prepared.session.close(), allComplete);
  } finally { removeRoot(root); }
});

test('loading policy keeps malformed entries and duplicate targets terminal without another request', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cases = [
    ['malformed entry', JSON.stringify({ models: [{}] }), 'encoding-json'],
    ['duplicate target', JSON.stringify({ models: [
      JSON.parse(diagnosticRuntimeModel()).models[0], JSON.parse(diagnosticRuntimeModel()).models[0],
    ] }), 'target-cardinality'],
  ] as const;
  for (const [name, body, expected] of cases) {
    const root = createRoot();
    const runtimeCalls: string[] = [];
    try {
      const harness = primitiveHarness({ runtime: loadingRuntimeSequence([body], runtimeCalls) });
      const details: RuntimeFailureCode[] = [];
      const prepared = await prepareM602SuccessorObservers(environment(root, harness.io), undefined,
        code => details.push(code), 'm602-loading-observation-v2');
      assert.equal(prepared.ok, true, name);
      if (!prepared.ok) continue;
      harness.activateCollection();
      const controller = new AbortController();
      let effect: Promise<void> | undefined;
      await prepared.session.observers.runtime?.({ signal: controller.signal, start(work) {
        effect = Promise.resolve(work(controller.signal)); return true;
      } });
      t.mock.timers.tick(1); await turns();
      assert.ok(effect, name);
      assert.equal(await effect.then(() => 'fulfilled', () => 'rejected'), 'rejected', name);
      t.mock.timers.tick(10_000); await turns();
      assert.deepEqual(runtimeCalls, ['runtime:0'], name);
      assert.deepEqual(details, [expected], name);
      assert.deepEqual(await prepared.session.close(), allComplete, name);
    } finally { removeRoot(root); }
  }
});

test('loading policy bounds valid absences at 120 closed requests and reports cardinality once', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  const runtimeCalls: string[] = [];
  try {
    const harness = primitiveHarness({ runtime: loadingRuntimeSequence(
      [JSON.stringify({ models: [{ name: 'another-model' }] })], runtimeCalls) });
    const details: RuntimeFailureCode[] = [];
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io), undefined,
      code => details.push(code), 'm602-loading-observation-v2');
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    const controller = new AbortController();
    let effect: Promise<void> | undefined;
    await prepared.session.observers.runtime?.({ signal: controller.signal, start(work) {
      effect = Promise.resolve(work(controller.signal)); return true;
    } });
    t.mock.timers.tick(1); await turns();
    assert.ok(effect);
    for (let attempt = 1; attempt < 120; attempt++) { t.mock.timers.tick(1000); await turns(); }
    assert.equal(await effect.then(() => 'fulfilled', () => 'rejected'), 'rejected');
    assert.equal(runtimeCalls.length, 120);
    assert.deepEqual(details, ['target-cardinality']);
    t.mock.timers.tick(10_000); await turns();
    assert.equal(runtimeCalls.length, 120);
    assert.deepEqual(await prepared.session.close(), allComplete);
  } finally { removeRoot(root); }
});

test('loading policy will not poll or start during-GPU work while absence closure is uncertain', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const root = createRoot();
  let runtimeRequests = 0;
  let response: (IncomingMessage & PassThrough) | undefined;
  let request: (ClientRequest & EventEmitter & { destroyed: boolean }) | undefined;
  const runtime = ((_: http.RequestOptions, callback: (incoming: IncomingMessage) => void) => {
    runtimeRequests++;
    request = new EventEmitter() as ClientRequest & EventEmitter & { destroyed: boolean };
    request.destroyed = false;
    const socket = new EventEmitter() as EventEmitter & { destroyed: boolean; destroy(): void };
    socket.destroyed = false;
    socket.destroy = () => { if (!socket.destroyed) { socket.destroyed = true; socket.emit('close'); } };
    Object.defineProperty(request, 'socket', { value: socket });
    request.setTimeout = (() => request!) as never;
    request.destroy = (() => {
      if (!request!.destroyed) { request!.destroyed = true; response?.emit('close'); request!.emit('close'); socket.destroy(); }
      return request!;
    }) as never;
    request.end = (() => {
      response = new PassThrough() as IncomingMessage & PassThrough;
      response.statusCode = 200; response.headers = { 'content-type': 'application/json' };
      Object.defineProperty(response, 'complete', { value: true, writable: true });
      Object.defineProperty(response, 'socket', { value: socket });
      response.destroy = (() => { response!.emit('close'); return response!; }) as never;
      response.resume = (() => response!) as never;
      callback(response);
      response.write(JSON.stringify({ models: [] })); response.emit('end');
      return request!;
    }) as never;
    return request;
  }) as M602SuccessorObserverIO['runtimeRequest'];
  try {
    const harness = primitiveHarness({ runtime });
    const prepared = await prepareM602SuccessorObservers(environment(root, harness.io), undefined, undefined,
      'm602-loading-observation-v2');
    assert.equal(prepared.ok, true);
    if (!prepared.ok) return;
    harness.activateCollection();
    const controller = new AbortController();
    let runtimeEffect: Promise<void> | undefined, gpuStarts = 0;
    await prepared.session.observers.runtime?.({ signal: controller.signal, start(work) {
      runtimeEffect = Promise.resolve(work(controller.signal)); return true;
    } });
    await prepared.session.observers.gpu?.({ signal: controller.signal, start() { gpuStarts++; return true; } });
    t.mock.timers.tick(1); await turns();
    assert.ok(runtimeEffect);
    assert.equal(runtimeRequests, 1);
    t.mock.timers.tick(1500); await turns();
    assert.equal(runtimeRequests, 1, 'no next request is allowed before full native closure');
    assert.equal(gpuStarts, 0, 'during-GPU sampling waits for successful runtime acquisition');
    controller.abort(); await turns();
    assert.equal(await runtimeEffect.then(() => 'fulfilled', () => 'rejected'), 'rejected');
    t.mock.timers.tick(120_000); await turns();
    assert.equal(runtimeRequests, 1);
    assert.equal(gpuStarts, 0);
    assert.deepEqual(await prepared.session.close(), allComplete);
  } finally { removeRoot(root); }
});
