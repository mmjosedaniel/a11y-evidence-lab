import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createGenerationOperation } from '../src/server/local-service/generation-operation.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, ServiceOptions } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { RunRepository, StoreResult } from '../src/server/persistence/run-repository.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import {
  assessedSupportedRetrievalRun,
  completedScanRun,
  expectedRetrievalResult,
  retrievalRequest,
  runningRetrievalRun,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';
import {
  generationAdapterHarness,
  generationFixture,
  generationInvocation,
  proposalGenerationRun,
  runningGenerationRun,
} from './helpers/m302-generation-fixture.ts';
import { controlledMissingPrerequisiteAdapter } from './helpers/m305-generation-fixture.ts';

const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const serial = { concurrency: false };
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;
type Mode = 'local' | 'groq';
type Sandbox = { root: string; runs: string; services: LocalService[]; releases: Array<() => void>; preserve: boolean };

function success<T>(result: StoreResult<T>): T { assert.ok(result.ok, JSON.stringify(result)); return result.value; }
function open(root: string): RunRepository { return success(openRunRepository(root)); }
function request(runId = 'run-01', findingId = 'finding-0') { return { runId, findingId }; }
function disk(root: string, runId = 'run-01'): Record<string | number, unknown> {
  return JSON.parse(fs.readFileSync(path.join(root, runId, 'run.json'), 'utf8')) as Record<string | number, unknown>;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  void promise.catch(() => undefined);
  return { promise, resolve, reject };
}
async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = nativeSetTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally { nativeClearTimeout(timer); }
}
async function waitUntil(predicate: () => boolean, message: string): Promise<void> {
  const expires = performance.now() + 2000;
  while (performance.now() < expires) {
    if (predicate()) return;
    await new Promise<void>(resolve => nativeSetTimeout(resolve, 5));
  }
  assert.fail(message);
}
function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Generation test ancestor must be ordinary');
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}
function ordinaryInventory(target: string): void {
  for (const name of fs.readdirSync(target)) {
    const child = path.join(target, name);
    const stat = fs.lstatSync(child);
    assert.equal(stat.isSymbolicLink(), false, 'Unexpected link preserves owned artifacts');
    if (stat.isDirectory()) ordinaryInventory(child);
    else assert.ok(stat.isFile() && stat.nlink === 1, 'Unexpected file topology preserves owned artifacts');
  }
}
async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Owned generation port did not close')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned generation port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}
async function withSandbox(body: (box: Sandbox) => Promise<void>): Promise<void> {
  ordinaryAncestors(tempParent);
  const root = fs.mkdtempSync(path.join(tempParent, 'm302-generation-'));
  const box: Sandbox = { root, runs: path.join(root, 'runs'), services: [], releases: [], preserve: false };
  const errors: unknown[] = [];
  try { await body(box); } catch (error) { errors.push(error); }
  for (const release of box.releases) try { release(); } catch (error) { errors.push(error); }
  for (const service of box.services) {
    try { await within(service.stop(), 6500, 'Owned generation service stop did not settle'); }
    catch (error) { box.preserve = true; errors.push(error); }
    try { await portClosed(service.url); }
    catch (error) { box.preserve = true; errors.push(error); }
  }
  try {
    assert.equal(path.dirname(root), path.resolve(tempParent));
    assert.match(path.basename(root), /^m302-generation-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    if (!box.preserve) fs.rmSync(root, { recursive: true, force: false });
  } catch (error) { errors.push(error); }
  if (errors.length) throw new AggregateError(errors, 'Generation service test or owned cleanup failed');
}
function seedCompleted(root: string, mode: Mode = 'local', runId = 'run-01'): void {
  const store = open(root);
  success(store.create(runningRun(runId, mode)));
  success(store.finish(completedRun(runId, mode)));
}
function seedSupported(root: string): void {
  seedCompleted(root);
  const store = open(root);
  success(store.updateRetrieval(completedScanRun() as never, runningRetrievalRun()));
  success(store.updateRetrieval(runningRetrievalRun() as never, assessedSupportedRetrievalRun()));
}
async function start(box: Sandbox, options: Partial<ServiceOptions> = {}): Promise<LocalService> {
  const result = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40), ...options });
  assert.ok(result.ok);
  box.services.push(result.service);
  return result.service;
}
async function ready(box: Sandbox, mode: Mode = 'local',
  result: unknown = expectedRetrievalResult()): Promise<LocalService> {
  seedCompleted(box.runs, mode);
  const service = await start(box);
  const retrieval = await service.retrieveFinding(retrievalRequest(), async () => result);
  assert.ok(retrieval.ok, JSON.stringify(retrieval));
  return service;
}
function failed(result: Awaited<ReturnType<LocalService['generateFinding']>>, error: string) {
  assert.equal(result.ok, false);
  if (result.ok) throw new Error('Expected generation failure');
  assert.equal(result.error, error);
  return result;
}

test('first module exposes the purpose-named generation operation', serial, () => {
  assert.equal(typeof createGenerationOperation, 'function');
});

test('canonical service admission preserves historical and current persisted invocation tuples', serial, async () => {
  for (const promptVersion of ['m302-instructions-v1', 'm302-instructions-v2'] as const) {
    await withSandbox(async box => {
      seedSupported(box.runs);
      const store = open(box.runs);
      const supported = assessedSupportedRetrievalRun();
      const running = runningGenerationRun();
      success(store.updateGeneration(supported as never, running as never));
      const completed = proposalGenerationRun('run-01', 'local', promptVersion);
      const written = store.updateGeneration(running as never, completed as never);
      assert.equal(written.ok, true, `Canonical repository rejected ${promptVersion}`);
      if (!written.ok) return;
      const service = await start(box);
      const read = service.readRun('run-01');
      assert.ok(read.ok, JSON.stringify(read));
      if (!read.ok) return;
      const invocation = (selectedFinding(read.run).generation as Record<string, unknown>).invocation as Record<string, unknown>;
      assert.equal(invocation.promptVersion, promptVersion);
    });
  }
});

test('marked role selection remains durable and supplies the unchanged three-passage generation package', serial, async () => {
  await withSandbox(async box => {
    const marked = { ...expectedRetrievalResult(), selectionPolicy: 'highest-per-required-role-v1' as const };
    const service = await ready(box, 'local', marked);
    const harness = generationAdapterHarness();
    let preparedInput: Record<string, unknown> | undefined;
    const adapter = Object.freeze({
      configuration: harness.adapter.configuration,
      prepare(request: Parameters<typeof harness.adapter.prepare>[0], signal: AbortSignal) {
        const message = request.messages[1];
        assert.ok(message && message.role === 'user');
        preparedInput = JSON.parse(message.content) as Record<string, unknown>;
        return harness.adapter.prepare(request, signal);
      },
    });
    const outcome = await service.generateFinding(request(), adapter);
    assert.ok(outcome.ok, JSON.stringify(outcome));
    if (!outcome.ok) return;
    const persistedRetrieval = selectedFinding(outcome.run).retrieval as Record<string, unknown>;
    assert.equal((persistedRetrieval.result as Record<string, unknown>).selectionPolicy,
      'highest-per-required-role-v1');
    const guidance = preparedInput?.guidance as Record<string, unknown>;
    const passages = guidance.passages as readonly Record<string, unknown>[];
    assert.deepEqual(passages.map(passage => passage.passageId),
      ['wcag22-sc111', 'understanding111-intent', 'h37-text-alternative']);
    assert.equal(passages.length, 3);
    assert.equal(Object.hasOwn(preparedInput!, 'selectionPolicy'), false);
  });
});

test('supported retained ownership publishes one durable pending proposal in either immutable mode', serial, async () => {
  for (const mode of ['local', 'groq'] as const) {
    await withSandbox(async box => {
      const service = await ready(box, mode);
      const harness = generationAdapterHarness({ mode });
      const before = disk(box.runs);
      const sibling = structuredClone(selectedFinding(before, 1));
      const result = await service.generateFinding(request(), harness.adapter);
      assert.ok(result.ok, JSON.stringify(result));
      if (!result.ok) return;
      const finding = selectedFinding(result.run);
      assert.equal(finding.state, 'proposal-pending-review');
      assert.deepEqual((finding.generation as Record<string, unknown>).invocation,
        generationInvocation(mode, 'response', 'passed'));
      assert.deepEqual(finding.result, generationFixture().proposal);
      assert.equal('review' in finding, false);
      assert.deepEqual(selectedFinding(result.run, 1), sibling);
      for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl',
        'providerContext', 'status', 'finishedAt'] as const) assert.deepEqual(result.run[key], before[key]);
      for (const key of ['context', 'coverage', 'scannerReviewObservations'] as const) {
        assert.deepEqual(result.run.scan[key], (before.scan as Record<string, unknown>)[key]);
      }
      const beforeSelected = selectedFinding(before);
      for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence', 'retrieval', 'analysis'] as const) {
        assert.deepEqual(finding[key], beforeSelected[key]);
      }
      assert.deepEqual(disk(box.runs), result.run);
      assert.deepEqual(harness.calls, { prepare: 1, dispatch: 1, transport: 1 });
      assert.equal(failed(await service.generateFinding(request(), harness.adapter), 'not-eligible').persisted, false);
    });
  }
});

test('pre-call and attempted failures persist exact invocation truth without a proposal', serial, async () => {
  await withSandbox(async box => {
    const missingService = await ready(box);
    const missing = failed(await missingService.generateFinding(
      request(), controlledMissingPrerequisiteAdapter()), 'missing-prerequisite');
    assert.equal(missing.persisted, true);
    assert.equal(missing.invocationPersisted, false);
    assert.equal('invocation' in missing, false);
    assert.equal('result' in selectedFinding(missing.run!), false);
  });
  for (const [envelope, error, invocation] of [
    [{ ok: false, error: 'network', cleanup: 'complete' }, 'network', generationInvocation('local', 'network', 'not-run')],
    [{ ok: true, candidate: { invalid: true }, complete: true, cleanup: 'complete' }, 'response-validation',
      generationInvocation('local', 'response', 'failed')],
  ] as const) {
    await withSandbox(async box => {
      const service = await ready(box);
      const harness = generationAdapterHarness({ envelope });
      const result = failed(await service.generateFinding(request(), harness.adapter), error);
      assert.equal(result.persisted, true);
      assert.equal(result.invocationPersisted, true);
      assert.deepEqual(result.invocation, invocation);
      assert.deepEqual((selectedFinding(result.run!).generation as Record<string, unknown>).invocation, invocation);
      assert.equal('result' in selectedFinding(result.run!), false);
    });
  }
});

test('admission rejects missing selection, foreign ownership, concurrent activation and terminal replay', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    assert.equal(failed(await service.generateFinding(request('missing')), 'not-found').run, null);
    assert.equal(failed(await service.generateFinding(request('run-01', 'missing')), 'not-found').persisted, false);
    assert.equal(failed(await service.generateFinding(request()), 'not-eligible').persisted, false);
  });
  await withSandbox(async box => {
    seedSupported(box.runs);
    const service = await start(box);
    const harness = generationAdapterHarness();
    const result = failed(await service.generateFinding(request(), harness.adapter), 'workflow-active');
    assert.equal(result.persisted, false);
    assert.deepEqual(harness.calls, { prepare: 0, dispatch: 0, transport: 0 });
  });
  await withSandbox(async box => {
    const service = await ready(box);
    const release = deferred<unknown>();
    box.releases.push(() => release.resolve({ ok: false, error: 'shutdown', cleanup: 'complete' }));
    const harness = generationAdapterHarness({ dispatch: () => release.promise });
    const active = service.generateFinding(request(), harness.adapter);
    await waitUntil(() => harness.calls.dispatch === 1, 'Generation dispatch did not become active');
    assert.equal(failed(await service.generateFinding(request(), generationAdapterHarness().adapter), 'busy').persisted, false);
    assert.deepEqual(service.readRun('run-01'), { ok: false, error: 'busy' });
    release.resolve({ ok: false, error: 'provider', cleanup: 'complete' });
    await active;
  });
});

test('initial and terminal write failures return only the last durable run and retain ownership', serial, async t => {
  for (const terminal of [false, true]) {
    await withSandbox(async box => {
      const service = await ready(box);
      const supported = disk(box.runs);
      let running: Record<string | number, unknown> | undefined;
      const originalRename = fs.renameSync;
      t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
        const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string | number, unknown>;
        const generation = selectedFinding(candidate).generation as Record<string, unknown> | undefined;
        if (generation?.status === 'running') {
          if (!terminal) throw new Error('SYNTHETIC_GENERATION_INITIAL_WRITE_FAILURE');
          const result = originalRename(from, to);
          running = disk(box.runs);
          return result;
        }
        if (terminal && generation?.status === 'completed') throw new Error('SYNTHETIC_GENERATION_TERMINAL_WRITE_FAILURE');
        return originalRename(from, to);
      });
      const harness = generationAdapterHarness();
      try {
        const result = failed(await service.generateFinding(request(), harness.adapter), 'generation-persistence');
        assert.equal(result.persisted, false);
        assert.equal(result.cleanupFailed, false);
        assert.deepEqual(result.run, terminal ? running : supported);
        assert.equal(result.invocationPersisted, false);
        if (terminal) assert.deepEqual(result.invocation, generationInvocation());
        else {
          assert.equal('invocation' in result, false);
          assert.deepEqual(harness.calls, { prepare: 0, dispatch: 0, transport: 0 });
        }
        assert.deepEqual(disk(box.runs), terminal ? running : supported);
        assert.equal(failed(await service.generateFinding(request(), harness.adapter), 'workflow-active').persisted, false);
      } finally { t.mock.restoreAll(); }
    });
  }
});

test('publication deadline after stage success discards the proposal and preserves observed invocation', serial, async t => {
  await withSandbox(async box => {
    const service = await ready(box, 'local');
    const base = 1_800_000_000_000;
    let now = base;
    t.mock.method(Date, 'now', () => now);
    let scheduled = false;
    const candidate = new Proxy(generationFixture().proposal, {
      ownKeys(target) {
        if (!scheduled) {
          scheduled = true;
          queueMicrotask(() => { now = base + 120001; });
        }
        return Reflect.ownKeys(target);
      },
    });
    const harness = generationAdapterHarness({ candidate });
    try {
      const result = failed(await service.generateFinding(request(), harness.adapter), 'timeout');
      assert.equal(result.persisted, true);
      assert.equal(result.invocationPersisted, true);
      assert.deepEqual(result.invocation, generationInvocation('local', 'response', 'passed'));
      assert.equal('result' in selectedFinding(result.run!), false);
    } finally { t.mock.restoreAll(); }
  });
});

test('shutdown during unresolved transport records uncertainty and rejects late success', serial, async () => {
  await withSandbox(async box => {
    const service = await ready(box, 'local');
    const late = deferred<unknown>();
    box.releases.push(() => late.resolve({ ok: true, candidate: generationFixture().proposal, complete: true, cleanup: 'complete' }));
    const harness = generationAdapterHarness({ dispatch: (_signal, attempt) => attempt(() => late.promise) });
    const before = disk(box.runs);
    const operation = service.generateFinding(request(), harness.adapter);
    await waitUntil(() => harness.calls.dispatch === 1, 'Generation dispatch did not become active');
    const stopping = service.stop();
    const result = failed(await operation, 'shutdown');
    assert.equal(result.persisted, true);
    assert.equal(result.cleanupFailed, true);
    assert.equal(result.invocationPersisted, true);
    assert.deepEqual(result.invocation, generationInvocation('local', 'shutdown', 'not-run'));
    const committed = disk(box.runs);
    assert.notDeepEqual(committed, before);
    late.resolve({ ok: true, candidate: generationFixture().proposal, complete: true, cleanup: 'complete' });
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.deepEqual(disk(box.runs), committed);
    assert.deepEqual(await stopping, { ok: false, error: 'stop-failed' });
  });
});

test('shutdown after a validated response publishes one clean failure and no proposal', serial, async () => {
  await withSandbox(async box => {
    const service = await ready(box, 'local');
    let stopping: Promise<unknown> | undefined;
    let scheduled = false;
    const candidate = new Proxy(generationFixture().proposal, {
      ownKeys(target) {
        if (!scheduled) {
          scheduled = true;
          queueMicrotask(() => { stopping = service.stop(); });
        }
        return Reflect.ownKeys(target);
      },
    });
    const result = failed(await service.generateFinding(request(), generationAdapterHarness({ candidate }).adapter), 'shutdown');
    assert.equal(result.persisted, true);
    assert.equal(result.cleanupFailed, false);
    assert.equal(result.invocationPersisted, true);
    assert.deepEqual(result.invocation, generationInvocation('local', 'response', 'passed'));
    assert.equal('result' in selectedFinding(result.run!), false);
    assert.ok(stopping);
    assert.deepEqual(await stopping, { ok: true, status: 'stopped' });
  });
});

test('service stop deadline retains running bytes and ignores late transport settlement', serial, async t => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box, { stopTimeoutMs: 25 });
    const retrieval = await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
    assert.ok(retrieval.ok);
    const pending = deferred<unknown>();
    box.releases.push(() => pending.resolve({ ok: true, candidate: generationFixture().proposal, complete: true, cleanup: 'complete' }));
    let transportCalls = 0;
    const harness = generationAdapterHarness({ dispatch: (_signal, attempt) => attempt(() => {
      transportCalls++;
      return pending.promise;
    }) });
    t.mock.timers.enable({ apis: ['setTimeout'] });
    try {
      const operation = service.generateFinding(request(), harness.adapter);
      await waitUntil(() => transportCalls === 1, 'Generation transport did not become active');
      const running = disk(box.runs);
      const stopping = service.stop();
      t.mock.timers.tick(25);
      const stopResult = await stopping;
      const result = await operation;
      assert.deepEqual(stopResult, { ok: false, error: 'stop-failed' });
      const failure = failed(result, 'shutdown');
      assert.deepEqual(failure.run, running);
      assert.equal(failure.persisted, false);
      assert.equal(failure.cleanupFailed, true);
      pending.resolve({ ok: true, candidate: generationFixture().proposal, complete: true, cleanup: 'complete' });
      await new Promise<void>(resolve => setImmediate(resolve));
      assert.deepEqual(disk(box.runs), running);
    } finally { t.mock.timers.reset(); }
  });
});

test('restart reports a retained running generation as interrupted and never reconstructs its owner', serial, async t => {
  await withSandbox(async box => {
    const service = await ready(box);
    let running: Record<string | number, unknown> | undefined;
    const originalRename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string | number, unknown>;
      const generation = selectedFinding(candidate).generation as Record<string, unknown> | undefined;
      if (generation?.status === 'running') {
        const renamed = originalRename(from, to);
        running = disk(box.runs);
        return renamed;
      }
      if (generation?.status === 'completed') throw new Error('SYNTHETIC_RESTART_TERMINAL_WRITE_FAILURE');
      return originalRename(from, to);
    });
    try {
      const failedWrite = failed(await service.generateFinding(request(), generationAdapterHarness().adapter),
        'generation-persistence');
      assert.deepEqual(failedWrite.run, running);
      assert.equal(failedWrite.invocationPersisted, false);
    } finally { t.mock.restoreAll(); }
    assert.ok(running);
    assert.deepEqual(disk(box.runs), running);
    await service.stop();
    const restarted = await start(box);
    assert.deepEqual(restarted.readRun('run-01'), { ok: true, run: running, interrupted: true });
    const harness = generationAdapterHarness();
    const result = failed(await restarted.generateFinding(request(), harness.adapter), 'workflow-active');
    assert.equal(result.persisted, false);
    assert.deepEqual(harness.calls, { prepare: 0, dispatch: 0, transport: 0 });
  });
});
