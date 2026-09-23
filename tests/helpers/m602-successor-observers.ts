import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { request } from 'node:http';
import type { ClientRequest, IncomingMessage } from 'node:http';
import { spawn } from 'node:child_process';
import { connect } from 'node:net';
import type { Socket } from 'node:net';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { startLocalService, type LocalService } from '../../src/server/service.ts';
import type { OllamaNativeRequest } from '../../src/server/generation/ollama-generation-http.ts';
import { hash, ordinary } from './m602-evidence-files.ts';
import type { M602Observers } from './m602-observation.ts';
import { noSuccessorResources, successorFreeze, validateGpuSample, validateRuntimeSample, RuntimeSampleFailure,
  type M602SuccessorCleanup, type M602SuccessorFailure, type M602SuccessorObservation, type M602SuccessorSamples,
  type GpuSample, type RuntimeSample, type RuntimeFailureCode, type UiSample } from './m602-successor-evidence.ts';

export type M602SuccessorObserverIO = Readonly<{ startApplication: typeof startLocalService;
  launchBrowser: typeof chromium.launch; runtimeRequest: OllamaNativeRequest; spawnGpu: typeof spawn; connect: typeof connect }>;
type Environment = Readonly<{ root: string; applicationRevision: string; io: M602SuccessorObserverIO }>;
type CleanupKey = keyof M602SuccessorCleanup;
const repository = path.resolve(import.meta.dirname, '../..');
const stamp = () => new Date().toISOString();
const failure = () => new Error('Observer readiness failed');
const check = (signal: AbortSignal) => { if (signal.aborted) throw failure(); };
export function completeSuccessorIO(io: unknown): asserts io is M602SuccessorObserverIO {
  assert.ok(io && typeof io === 'object');
  for (const key of ['startApplication', 'launchBrowser', 'runtimeRequest', 'spawnGpu', 'connect']) {
    assert.equal(typeof (io as Record<string, unknown>)[key], 'function');
  }
}
export function isolatedSuccessorRoot(root: string): string {
  const resolved = path.resolve(root);
  assert.equal(path.dirname(resolved).toLowerCase(), path.join(repository, 'temp').toLowerCase());
  assert.match(path.basename(resolved), /^m602-test-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u);
  ordinary(resolved, fs, false); return resolved;
}
function inventory(root: string): string {
  const entries: { path: string; hash: string }[] = [];
  function visit(directory: string) {
    ordinary(directory, fs, false);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(target);
      else { ordinary(target, fs, true); entries.push({ path: path.relative(root, target), hash: hash(fs.readFileSync(target)) }); }
    }
  }
  visit(root); return hash(JSON.stringify(entries.sort((a, b) => a.path.localeCompare(b.path))));
}
// A single elapsed deadline revokes admission; settling a primitive later cannot commit a value.
function bounded<T>(signal: AbortSignal, milliseconds: number, work: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const finish = (ok: boolean, value?: T) => {
      if (settled) return; settled = true; clearTimeout(timer); signal.removeEventListener('abort', abort);
      if (!ok) controller.abort();
      if (ok) resolve(value!); else reject(failure());
    };
    const abort = () => finish(false);
    const timer = setTimeout(abort, milliseconds);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { abort(); return; }
    try { void work(controller.signal).then(value => finish(!controller.signal.aborted && !signal.aborted, value), () => finish(false)); }
    catch { finish(false); }
  });
}
export type M602SuccessorObserverSession = Readonly<{
  observers: M602Observers; gpuBefore: GpuSample & { readonly observedAt: string };
  samples(timing: M602SuccessorObservation['timing']): M602SuccessorSamples;
  close(): Promise<M602SuccessorCleanup>;
}>;
export async function prepareM602SuccessorObservers(environment?: Environment, callerSignal?: AbortSignal,
  onRuntimeFailure?: (code: RuntimeFailureCode) => unknown, policy?: 'm602-loading-observation-v2'):
  Promise<{ readonly ok: true; readonly session: M602SuccessorObserverSession } | M602SuccessorFailure> {
  const caller = callerSignal ?? new AbortController().signal;
  let io: M602SuccessorObserverIO, runRoot: string, clientRoot: string, scratch: string, revision: string;
  let runInventory: string;
  try {
    check(caller);
    assert.ok(policy === undefined || policy === 'm602-loading-observation-v2');
    if (environment !== undefined) {
      completeSuccessorIO(environment.io); const root = isolatedSuccessorRoot(environment.root);
      io = environment.io; runRoot = path.join(root, 'runs'); clientRoot = path.join(root, 'client');
      scratch = path.join(root, 'observer-scratch'); revision = environment.applicationRevision;
    } else {
      io = { startApplication: startLocalService, launchBrowser: chromium.launch.bind(chromium), runtimeRequest: request, spawnGpu: spawn, connect };
      runRoot = path.join(repository, 'data/runs'); clientRoot = path.join(repository, 'dist/client');
      scratch = path.join(repository, 'temp/m104-ui'); revision = process.env.A11Y_APPLICATION_REVISION ?? '';
      for (const relative of ['temp/m103-scan', 'temp/m105-integration']) {
        ordinary(path.join(repository, relative), fs, false); assert.deepEqual(fs.readdirSync(path.join(repository, relative)), []);
      }
    }
    assert.match(revision, /^[0-9a-f]{40}$/u); ordinary(clientRoot, fs, false); ordinary(scratch, fs, false);
    assert.deepEqual(fs.readdirSync(scratch), []); runInventory = inventory(runRoot);
  } catch { return successorFreeze({ ok: false, error: 'observer-readiness', cleanup: noSuccessorResources }); }

  const controller = new AbortController();
  const signal = controller.signal;
  const cleanupController = new AbortController();
  let closing = false, closePromise: Promise<M602SuccessorCleanup> | undefined;
  const states: Record<CleanupKey, M602SuccessorCleanup[CleanupKey]> = { ...noSuccessorResources, scratch: 'uncertain' };
  const jobs = new Set<Promise<unknown>>();
  let service: LocalService | undefined, browser: Browser | undefined, context: BrowserContext | undefined, page: Page | undefined;
  let serviceClose: Promise<void> | undefined, browserClose: Promise<void> | undefined, contextClose: Promise<void> | undefined;
  let browserAcquisitions = 0, serviceAcquisitions = 0;
  let browserClosed = false, contextClosed = false, serviceClosed = false;
  let ui: UiSample | null = null, runtime: RuntimeSample | null = null, gpuDuring: GpuSample | null = null;
  let runtimeFailureReported = false;
  const runtimeReady = Promise.withResolvers<boolean>();
  async function reportRuntimeFailure(code: RuntimeFailureCode): Promise<void> {
    if (runtimeFailureReported) return;
    runtimeFailureReported = true;
    // Await inside this detached notification contains rejection without calling replaceable Promise methods.
    try { await onRuntimeFailure?.(code); } catch { /* Diagnostics cannot change observation or cleanup. */ }
  }
  const tracked = <T>(promise: Promise<T>): Promise<T> => {
    jobs.add(promise); void promise.then(() => jobs.delete(promise), () => jobs.delete(promise)); return promise;
  };
  function refreshCleanup(): void {
    if (browserAcquisitions === 0 && contextClosed) states.ui = 'complete';
    if (browserAcquisitions === 0 && browserClosed && (!context || contextClosed)) states.browser = 'complete';
    if (serviceAcquisitions === 0 && serviceClosed) states.application = 'complete';
  }
  function closeContext(): Promise<void> {
    if (!context) return Promise.resolve();
    return contextClose ??= tracked(Promise.resolve().then(() => context!.close()).then(() => { contextClosed = true; refreshCleanup(); }));
  }
  function closeBrowser(): Promise<void> {
    if (!browser) return Promise.resolve();
    return browserClose ??= tracked((async () => {
      // Context failure or pending settlement must not prevent ordinary browser shutdown.
      const contextClosing = closeContext().catch(() => {});
      await browser!.close(); assert.equal(browser!.isConnected(), false);
      browserClosed = true; refreshCleanup();
      await contextClosing;
    })());
  }
  function closedPort(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      check(cleanupController.signal);
      const endpoint = new URL(url); let refused = false, connected = false;
      const socket = io.connect({ host: '127.0.0.1', port: Number(endpoint.port) });
      const destroy = () => { try { socket.destroy(); } catch { /* Close remains unconfirmed. */ } };
      socket.on('error', error => { refused = (error as NodeJS.ErrnoException).code === 'ECONNREFUSED'; destroy(); });
      socket.once('connect', () => { connected = true; destroy(); });
      socket.once('close', () => {
        cleanupController.signal.removeEventListener('abort', destroy);
        if (refused && !connected && !cleanupController.signal.aborted) resolve(); else reject(failure());
      });
      cleanupController.signal.addEventListener('abort', destroy, { once: true });
      if (cleanupController.signal.aborted) destroy();
    });
  }
  function closeService(): Promise<void> {
    if (!service) return Promise.resolve();
    return serviceClose ??= tracked((async () => {
      assert.ok((await service!.stop()).ok); await closedPort(service!.url);
      serviceClosed = true; refreshCleanup();
    })());
  }
  async function close(): Promise<M602SuccessorCleanup> {
    if (closePromise) return closePromise;
    closing = true; runtimeReady.resolve(false); controller.abort();
    closePromise = (async () => {
      let timer: ReturnType<typeof setTimeout>;
      const deadline = new Promise<void>(resolve => { timer = setTimeout(() => {
        cleanupController.abort(); resolve();
      }, 5000); });
      // One group deadline also owns the port probe, including delayed service-stop settlement.
      void closeBrowser().catch(() => {}); void closeService().catch(() => {});
      const drain = async () => { while (jobs.size) await Promise.allSettled([...jobs]); };
      await Promise.race([drain(), deadline]); clearTimeout(timer!);
      try { assert.deepEqual(fs.readdirSync(scratch), []); assert.equal(inventory(runRoot), runInventory); states.scratch = 'complete'; }
      catch { states.scratch = 'uncertain'; }
      caller.removeEventListener('abort', onCallerAbort);
      return successorFreeze({ ...states });
    })();
    return closePromise;
  }
  const onCallerAbort = () => { controller.abort(); void close(); };
  caller.addEventListener('abort', onCallerAbort, { once: true });
  if (caller.aborted) onCallerAbort();

  async function stage<T>(work: () => Promise<T>, acquired: (value: T) => void, kind: 'application' | 'browser' | 'ui'): Promise<T> {
    check(signal);
    states[kind] = 'uncertain';
    if (kind === 'application') serviceAcquisitions++; else browserAcquisitions++;
    const pending = tracked(Promise.resolve().then(() => { check(signal); return work(); }).then(value => {
      if (kind === 'application') serviceAcquisitions--; else browserAcquisitions--;
      acquired(value);
      refreshCleanup();
      if (closing || signal.aborted) { void closeContext().catch(() => {}); void closeBrowser().catch(() => {}); void closeService().catch(() => {}); }
      return value;
    }, error => {
      if (kind === 'application') serviceAcquisitions--; else browserAcquisitions--;
      refreshCleanup(); throw error;
    }));
    const value = await bounded(signal, 10000, async () => pending); check(signal); return value;
  }
  function gpuSample(active: AbortSignal): Promise<GpuSample> {
    return bounded(active, 5000, collectorSignal => new Promise<GpuSample>((resolve, reject) => {
      check(collectorSignal); states.gpu = 'uncertain';
      const child = io.spawnGpu('C:/Windows/System32/nvidia-smi.exe',
        ['--query-gpu=memory.used,memory.free', '--format=csv,noheader,nounits'], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
      let out = Buffer.alloc(0), stderrBytes = 0, failed = false;
      const closed = Promise.withResolvers<void>(); tracked(closed.promise);
      const abort = () => {
        if (!failed) {
          failed = true;
          try { child.kill(); } catch { /* Child close remains unconfirmed. */ }
          for (const stream of [child.stdout, child.stderr]) {
            try { stream?.destroy(); } catch { /* Child/stdio close remains authoritative. */ }
          }
        }
        reject(failure());
      };
      collectorSignal.addEventListener('abort', abort, { once: true });
      child.on('error', abort);
      child.stdout!.on('error', abort); child.stderr!.on('error', abort);
      child.stdout!.on('data', (chunk: Buffer) => { if (failed) return; if (out.length + chunk.length > 4096) abort(); else out = Buffer.concat([out, chunk]); });
      child.stderr!.on('data', (chunk: Buffer) => { if (failed) return; stderrBytes += chunk.length; if (stderrBytes > 4096) abort(); });
      child.once('close', code => {
        states.gpu = 'complete'; closed.resolve(); collectorSignal.removeEventListener('abort', abort);
        try {
          check(collectorSignal); assert.ok(!failed && code === 0);
          const text = new TextDecoder('utf-8', { fatal: true }).decode(out).trim();
          const match = /^(\d+),\s*(\d+)$/u.exec(text); assert.ok(match);
          const value = { usedMiB: Number(match[1]), freeMiB: Number(match[2]) }; validateGpuSample(value); resolve(successorFreeze(value));
        } catch { reject(failure()); }
      });
      if (collectorSignal.aborted) abort();
    }));
  }
  function runtimeSample(active: AbortSignal, allowAbsent = false): Promise<RuntimeSample | null> {
    return bounded(active, 5000, collectorSignal => new Promise<RuntimeSample | null>((resolve, reject) => {
      check(collectorSignal); states.runtime = 'uncertain';
      let incoming: IncomingMessage | undefined, handle: ClientRequest | undefined;
      let requestReturned = false, failed = false, destroying = false;
      let parsed: RuntimeSample | null | undefined;
      const resources = new Map<ClientRequest | IncomingMessage | Socket, boolean>();
      const closed = Promise.withResolvers<void>(); tracked(closed.promise);
      const terminal = () => {
        if (!requestReturned || ![...resources.values()].every(value => value)) return;
        states.runtime = 'complete'; closed.resolve();
        collectorSignal.removeEventListener('abort', abort);
        if (!failed && parsed !== undefined && !collectorSignal.aborted) resolve(parsed);
      };
      const destroyOwned = () => {
        if (destroying) return;
        destroying = true;
        for (const [resource, ended] of resources) {
          if (ended) continue;
          try { resource.destroy(); } catch { /* Only a later close can prove cleanup. */ }
        }
        destroying = false;
      };
      const fail = (code: RuntimeFailureCode) => {
        if (!failed) { failed = true; void reportRuntimeFailure(code); }
        destroyOwned(); reject(failure()); terminal();
      };
      const abort = () => fail('transport-lifecycle');
      const own = (resource: ClientRequest | IncomingMessage | Socket | null | undefined, premature: () => boolean) => {
        if (!resource || resources.has(resource)) return;
        resources.set(resource, false); states.runtime = 'uncertain';
        resource.on('error', abort);
        resource.once('close', () => {
          resources.set(resource, true);
          if (!failed && premature()) abort();
          terminal();
        });
      };
      const ownSocket = (socket: Socket | null | undefined) => {
        own(socket, () => parsed === undefined);
        if (failed || collectorSignal.aborted) destroyOwned();
      };
      collectorSignal.addEventListener('abort', abort, { once: true });
      try {
        handle = io.runtimeRequest({ hostname: '127.0.0.1', port: 11434, path: '/api/ps', method: 'GET' }, response => {
          const duplicate = incoming !== undefined;
          own(response, () => parsed === undefined); ownSocket(response.socket);
          if (duplicate || failed || collectorSignal.aborted) { abort(); return; }
          incoming = response; let bytes = Buffer.alloc(0);
          response.once('aborted', abort);
          response.on('data', (chunk: Buffer | string) => {
            if (failed || collectorSignal.aborted) return;
            const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            if (bytes.length + value.length > 65536) fail('body-limit'); else bytes = Buffer.concat([bytes, value]);
          });
          response.once('end', () => {
            let code: RuntimeFailureCode = 'transport-lifecycle';
            try {
              check(collectorSignal); assert.ok(!failed);
              code = 'http-metadata'; assert.equal(response.statusCode, 200);
              code = 'transport-lifecycle'; assert.equal(response.complete, true);
              code = 'http-metadata';
              assert.match(String(response.headers['content-type']), /^application\/json(?:\s*;|$)/iu);
              code = 'encoding-json';
              const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); assert.ok(Array.isArray(body.models));
              if (allowAbsent) {
                assert.ok(body && typeof body === 'object' && !Array.isArray(body));
                for (const model of body.models) assert.ok(model && typeof model === 'object' && !Array.isArray(model)
                  && typeof model.name === 'string' && model.name.length > 0);
              }
              code = 'target-cardinality';
              const matches = body.models.filter((model: { name?: unknown }) => model && model.name === 'qwen3.5:4b');
              if (allowAbsent && matches.length === 0) parsed = null;
              else {
                assert.equal(matches.length, 1);
                const model = matches[0]; const value = { digest: model.digest, contextLength: model.context_length, sizeBytes: model.size, sizeVramBytes: model.size_vram };
                validateRuntimeSample(value); parsed = successorFreeze(value);
              }
              code = 'transport-lifecycle'; check(collectorSignal);
              // Parsed data remains provisional until every observed native resource closes.
              for (const resource of resources.keys()) {
                if (resource !== handle && resource !== incoming) {
                  try { resource.destroy(); } catch { /* The total deadline owns unresolved closure. */ }
                }
              }
              terminal();
            } catch (error) { fail(error instanceof RuntimeSampleFailure ? error.code : code); }
          });
        });
        own(handle, () => parsed === undefined); ownSocket(handle.socket);
        handle.on('socket', ownSocket); requestReturned = true;
        if (failed || collectorSignal.aborted) abort(); else handle.end();
        terminal();
      } catch { requestReturned = true; abort(); }
    }));
  }

  async function acquireRuntime(active: AbortSignal): Promise<RuntimeSample> {
    const acquisition = new AbortController();
    const linked = AbortSignal.any([active, acquisition.signal]);
    const exhausted = () => {
      if (!active.aborted) void reportRuntimeFailure('target-cardinality');
      acquisition.abort();
    };
    const timer = setTimeout(exhausted, 120000);
    try {
      for (let attempt = 0; attempt < 120; attempt++) {
        check(linked);
        const value = await runtimeSample(linked, true);
        check(linked);
        if (value !== null) return value;
        if (attempt === 119) { exhausted(); throw failure(); }
        // A null value is released only after complete native closure; no overlap is possible.
        await new Promise<void>((resolve, reject) => {
          const abort = () => { clearTimeout(interval); linked.removeEventListener('abort', abort); reject(failure()); };
          const interval = setTimeout(() => { linked.removeEventListener('abort', abort); resolve(); }, 1000);
          linked.addEventListener('abort', abort, { once: true });
          if (linked.aborted) abort();
        });
      }
      throw failure();
    } finally { clearTimeout(timer); }
  }

  try {
    await stage(() => io.startApplication({ runRoot, clientRoot, applicationRevision: revision, port: 0 }), value => {
      assert.ok(value.ok); if (value.ok) service = value.service;
    }, 'application');
    const endpoint = new URL(service!.url); assert.equal(endpoint.protocol, 'http:'); assert.equal(endpoint.hostname, '127.0.0.1');
    await stage(() => io.launchBrowser({ channel: 'chromium', headless: false, timeout: 10000 }), value => { browser = value; }, 'browser');
    assert.equal(browser!.version(), '151.0.7922.34');
    await stage(() => browser!.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false, serviceWorkers: 'block' }), value => { context = value; }, 'browser');
    const route: Parameters<BrowserContext['route']>[1] = async routed => {
      const incoming = routed.request();
      if (new URL(incoming.url()).origin !== endpoint.origin || !['GET', 'HEAD'].includes(incoming.method())) {
        controller.abort(); await routed.abort();
      } else await routed.continue();
    };
    await stage(async () => { check(signal); await context!.route('**/*', route); check(signal); return await context!.newPage(); }, value => { page = value; }, 'ui');
    const onPageFault = () => controller.abort();
    page!.on('popup', onPageFault); page!.on('download', onPageFault);
    page!.on('crash', onPageFault); page!.on('pageerror', onPageFault);
    page!.setDefaultTimeout(5000);
    await stage(async () => { const response = await page!.goto(`${endpoint.origin}/`, { timeout: 10000, signal }); assert.equal(response?.status(), 200); }, () => {}, 'ui');
    const target = page!.getByLabel('Target URL', { exact: true });
    const local = page!.getByLabel(/Local/u), groq = page!.getByLabel(/Groq/u);
    await stage(async () => {
      for (const control of [target, local, groq]) { check(signal); assert.ok(await control.isEnabled({ timeout: 5000, signal })); }
      check(signal); await local.check({ timeout: 5000, signal }); check(signal); assert.ok(await local.isChecked({ timeout: 5000, signal }));
      check(signal); assert.equal(await groq.isChecked({ timeout: 5000, signal }), false);
    }, () => {}, 'ui');
    const baseline = await gpuSample(signal); check(signal);
    const gpuBefore = successorFreeze({ observedAt: stamp(), ...baseline });
    const uiEffect = (active: AbortSignal) => bounded(active, 5000, async collectorSignal => {
      check(collectorSignal); await target.focus({ timeout: 5000, signal: collectorSignal });
      check(collectorSignal); assert.ok(await target.evaluate(element => element === element.ownerDocument.activeElement,
        undefined, { timeout: 5000, signal: collectorSignal }));
      check(collectorSignal); await groq.check({ timeout: 5000, signal: collectorSignal });
      check(collectorSignal); assert.ok(await groq.isChecked({ timeout: 5000, signal: collectorSignal }));
      check(collectorSignal); assert.equal(await local.isChecked({ timeout: 5000, signal: collectorSignal }), false); check(collectorSignal);
      return successorFreeze({ textboxFocused: true, radioChanged: true, radioChecked: true } as const);
    });
    const scheduled = (effect: (active: AbortSignal) => Promise<void>): NonNullable<M602Observers['ui']> => gate => {
      if (signal.aborted || gate.signal.aborted || closing) return;
      const cancel = () => { clearTimeout(timer); gate.signal.removeEventListener('abort', cancel); signal.removeEventListener('abort', cancel); };
      const timer = setTimeout(() => {
        cancel(); if (signal.aborted || gate.signal.aborted || closing) return;
        gate.start(active => {
          const linked = AbortSignal.any([active, signal]);
          const pending = effect(linked);
          // Keep the rejected result for the gate while owning errors before a delayed consumer attaches.
          if (policy === 'm602-loading-observation-v2') void pending.catch(() => {});
          return pending;
        });
      }, policy === 'm602-loading-observation-v2' ? 1 : 1000);
      gate.signal.addEventListener('abort', cancel, { once: true }); signal.addEventListener('abort', cancel, { once: true });
    };
    return successorFreeze({ ok: true, session: {
      gpuBefore,
      observers: {
        ui: scheduled(async active => { const value = await uiEffect(active); check(active); ui = value; }),
        runtime: scheduled(async active => {
          try {
            const value = policy === 'm602-loading-observation-v2' ? await acquireRuntime(active) : await runtimeSample(active);
            check(active); runtime = value; runtimeReady.resolve(true);
          } catch (error) { runtimeReady.resolve(false); throw error; }
        }),
        gpu: policy === 'm602-loading-observation-v2' ? gate => {
          void runtimeReady.promise.then(ready => {
            if (!ready || signal.aborted || gate.signal.aborted || closing) return;
            gate.start(async active => {
              const linked = AbortSignal.any([active, signal]);
              check(linked); const value = await gpuSample(linked); check(linked); gpuDuring = value;
            });
          }).catch(() => { /* Gate failure cannot admit another sample. */ });
        } : scheduled(async active => { const value = await gpuSample(active); check(active); gpuDuring = value; }),
      },
      samples(timing) { return successorFreeze({ gpuBefore, ui: timing.ui.status === 'completed' ? ui : null,
        runtime: timing.runtime.status === 'completed' ? runtime : null, gpuDuring: timing.gpu.status === 'completed' ? gpuDuring : null }); },
      close,
    } });
  } catch { return successorFreeze({ ok: false, error: 'observer-readiness', cleanup: await close() }); }
}
