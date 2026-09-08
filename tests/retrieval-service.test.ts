import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, RetrievalOutcome, ServiceOptions } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { RunRepository, RunningRun, StoreResult } from '../src/server/persistence/run-repository.ts';
import { RetrievalError } from '../src/server/retrieval/retrieval-error.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import {
  completedRetrievalRun,
  completedScanRun,
  expectedRetrievalResult,
  retrievalRequest,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';

type Sandbox = { root: string; runs: string; services: LocalService[]; releases: Array<() => void> };

const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const serial = { concurrency: false };

function success<T>(result: StoreResult<T>): T { assert.ok(result.ok, JSON.stringify(result)); return result.value; }
function open(root: string): RunRepository { return success(openRunRepository(root)); }
function seedCompleted(root: string, runId = 'run-01'): void {
  const store = open(root);
  success(store.create(runningRun(runId)));
  success(store.finish(completedRun(runId)));
}
function scanInput() {
  const run = runningRun('input');
  return structuredClone({
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    scanContext: run.scanContext,
  });
}
function scanTerminal(run: RunningRun): Record<string | number, unknown> {
  const sample = structuredClone(completedRun(run.runId)) as unknown as Record<string | number, unknown>;
  const timestamp = new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString();
  Object.assign(sample, {
    runId: run.runId,
    createdAt: run.createdAt,
    applicationRevision: run.applicationRevision,
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    finishedAt: timestamp,
  });
  const scan = sample.scan as Record<string, unknown>;
  const sampleContext = scan.context as Record<string, unknown>;
  scan.context = {
    ...run.scanContext,
    finalUrl: sampleContext.finalUrl,
    browserVersion: sampleContext.browserVersion,
    scannedAt: { value: timestamp },
    readinessReached: true,
    cleanup: 'closed',
  };
  return sample;
}
function disk(root: string, runId = 'run-01'): unknown {
  return JSON.parse(fs.readFileSync(path.join(root, runId, 'run.json'), 'utf8'));
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  void promise.catch(() => { /* The fixture always consumes an owned late rejection. */ });
  return { promise, resolve, reject };
}
async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}
async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Owned port did not close')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}
function ordinaryInventory(root: string): void {
  for (const name of fs.readdirSync(root)) {
    const child = path.join(root, name);
    const stat = fs.lstatSync(child);
    assert.equal(stat.isSymbolicLink(), false, 'Unexpected link prevents owned cleanup');
    if (stat.isDirectory()) ordinaryInventory(child);
    else assert.ok(stat.isFile() && stat.nlink === 1, 'Unexpected file topology prevents owned cleanup');
  }
}
function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Cleanup ancestor must remain ordinary');
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}
async function withSandbox(body: (box: Sandbox) => Promise<void>): Promise<void> {
  const root = fs.mkdtempSync(path.join(tempParent, 'm202-retrieval-'));
  const box: Sandbox = { root, runs: path.join(root, 'runs'), services: [], releases: [] };
  const errors: unknown[] = [];
  let cleanupConfirmed = true;
  try { await body(box); } catch (error) { errors.push(error); }
  for (const release of box.releases) try { release(); } catch (error) { errors.push(error); }
  for (const service of box.services) {
    try { await within(service.stop(), 6500, 'Owned service stop did not settle'); }
    catch (error) { cleanupConfirmed = false; errors.push(error); }
    try { await portClosed(service.url); }
    catch (error) { cleanupConfirmed = false; errors.push(error); }
  }
  try {
    assert.equal(path.dirname(root), path.resolve(tempParent));
    assert.match(path.basename(root), /^m202-retrieval-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    if (cleanupConfirmed) fs.rmSync(root, { recursive: true, force: false });
  } catch (error) { errors.push(error); }
  if (errors.length) throw new AggregateError(errors, 'Retrieval service test or cleanup failed');
}
async function start(box: Sandbox, options: Partial<ServiceOptions> = {}): Promise<LocalService> {
  const result = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40), ...options });
  assert.ok(result.ok);
  box.services.push(result.service);
  return result.service;
}
function rejected(error: string, run: unknown = null, persisted = false, cleanupFailed = false) {
  return { ok: false, error, run, persisted, cleanupFailed };
}
function retrievalOf(run: unknown): Record<string, unknown> {
  return selectedFinding(run as Record<string | number, unknown>).retrieval as Record<string, unknown>;
}
function deepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.ok(Object.isFrozen(value));
  for (const item of Object.values(value)) deepFrozen(item);
}
function assertRunningState(run: unknown): string {
  const finding = selectedFinding(run as Record<string | number, unknown>);
  assert.equal(finding.state, 'active');
  const retrieval = retrievalOf(run);
  assert.deepEqual(Object.keys(retrieval).sort(), ['startedAt', 'status']);
  assert.equal(retrieval.status, 'running');
  assert.match(retrieval.startedAt as string, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/);
  assert.ok((retrieval.startedAt as string) >= ((run as Record<string, unknown>).finishedAt as string));
  return retrieval.startedAt as string;
}
function assertCompletedState(run: unknown, startedAt: string): void {
  const finding = selectedFinding(run as Record<string | number, unknown>);
  assert.equal(finding.state, 'active');
  const retrieval = retrievalOf(run);
  assert.equal(retrieval.status, 'completed');
  assert.equal(retrieval.startedAt, startedAt);
  assert.ok((retrieval.finishedAt as string) >= startedAt);
  assert.deepEqual(retrieval.result, expectedRetrievalResult());
}
function assertFailedState(run: unknown, startedAt: string, error: string): void {
  const finding = selectedFinding(run as Record<string | number, unknown>);
  assert.equal(finding.state, 'failed');
  const retrieval = retrievalOf(run);
  assert.equal(retrieval.status, 'failed');
  assert.equal(retrieval.startedAt, startedAt);
  assert.ok((retrieval.finishedAt as string) >= startedAt);
  assert.equal(retrieval.error, error);
}

test('retrieval admission is exact, selected-only and effect-free before an eligible completed selection', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const store = open(box.runs);
    success(store.create(runningRun('running-parent')));
    success(store.create(runningRun('zero')));
    success(store.finish(completedRun('zero', 'local', 'zero')));
    const service = await start(box);
    let calls = 0;
    const execute = async () => { calls++; return expectedRetrievalResult(); };
    for (const input of [null, {}, { runId: 'run-01' }, { runId: 'run-01', findingId: 'finding-0', extra: true }]) {
      assert.deepEqual(await service.retrieveFinding(input, execute), rejected('invalid-request'));
    }
    assert.deepEqual(await service.retrieveFinding(retrievalRequest('missing'), execute), rejected('not-found'));
    assert.deepEqual(await service.retrieveFinding(retrievalRequest('run-01', 'missing'), execute),
      rejected('not-found', completedScanRun()));
    assert.deepEqual(await service.retrieveFinding(retrievalRequest('running-parent'), execute), rejected('not-eligible'));
    assert.deepEqual(await service.retrieveFinding(retrievalRequest('zero'), execute),
      rejected('not-found', completedRun('zero', 'local', 'zero')));
    assert.deepEqual(await service.retrieveFinding(retrievalRequest(), null as unknown as typeof execute),
      rejected('invalid-request'));
    assert.equal(calls, 0);
    assert.deepEqual(disk(box.runs), completedScanRun());
    await service.stop();
    assert.deepEqual(await service.retrieveFinding(retrievalRequest(), execute), rejected('stopping'));
  });
});

test('retrieval reserves synchronously, publishes running before immutable selected execution, and retains its successful owner', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const entered = deferred<void>();
    const release = deferred<unknown>();
    box.releases.push(() => release.reject(new Error('Owned release')));
    let received: unknown;
    let durableRunning: unknown;
    let nested: Promise<RetrievalOutcome> | undefined;
    let invalidNested: Promise<RetrievalOutcome> | undefined;
    const operation = service.retrieveFinding(retrievalRequest(), async (finding, signal) => {
      received = finding;
      assert.equal(signal.aborted, false);
      durableRunning = disk(box.runs);
      assertRunningState(durableRunning);
      assert.deepEqual(service.readRun('run-01'), { ok: false, error: 'busy' });
      nested = service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
      invalidNested = service.retrieveFinding(null, null as never);
      assert.deepEqual(await service.runScan({}, async () => undefined), rejected('busy'));
      entered.resolve();
      return release.promise;
    });
    await entered.promise;
    assert.ok(nested);
    assert.ok(invalidNested);
    assert.deepEqual(await nested, rejected('busy'));
    assert.deepEqual(await invalidNested, rejected('busy'));
    release.resolve(expectedRetrievalResult());
    const outcome = await operation;
    assert.ok(outcome.ok);
    const startedAt = assertRunningState(durableRunning);
    assertCompletedState(outcome.run, startedAt);
    assert.deepEqual(received, selectedFinding(completedScanRun()));
    assert.ok(Object.isFrozen(received));
    assert.notStrictEqual(received, selectedFinding(durableRunning as Record<string | number, unknown>));
    assert.deepEqual(disk(box.runs), outcome.run);
    assert.deepEqual(service.readRun('run-01'), { ok: true, run: outcome.run, interrupted: false });
    assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
      rejected('workflow-active'));
    const independent = await service.runScan(scanInput(), async run => scanTerminal(run));
    assert.ok(independent.ok, JSON.stringify(independent));
    assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
    assert.deepEqual(disk(box.runs), outcome.run);
  });
});

test('retrieval success returns the frozen durable representation without mutating a negative-zero executor result', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const executorResult = expectedRetrievalResult();
    executorResult.passages[2]!.score = -0;
    const before = structuredClone(executorResult);

    const outcome = await service.retrieveFinding(retrievalRequest(), async () => executorResult);
    assert.ok(outcome.ok);
    if (!outcome.ok) return;
    const durable = success(open(box.runs).read('run-01'));
    const returnedResult = retrievalOf(outcome.run).result;
    assert.deepEqual(executorResult, before);
    assert.equal(Object.is(executorResult.passages[2]!.score, -0), true);
    assert.notStrictEqual(returnedResult, executorResult);
    deepFrozen(outcome.run);
    assert.deepEqual(disk(box.runs), durable);
    assert.deepEqual(outcome.run, durable);
  });
});

test('the shared reservation exists before initial repository publication can reenter service admission', serial, async t => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const originalOpen = fs.openSync;
    let entered = false;
    let readResult: unknown;
    let scanResult: Promise<unknown> | undefined;
    let retrievalResult: Promise<RetrievalOutcome> | undefined;
    t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
      if (!entered && String(name).includes('run.json.tmp-')) {
        entered = true;
        readResult = service.readRun('run-01');
        scanResult = service.runScan(scanInput(), async run => scanTerminal(run));
        retrievalResult = service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
      }
      return originalOpen(name, flags, mode);
    });
    try {
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
      assert.ok(outcome.ok);
    } finally { t.mock.restoreAll(); }
    assert.equal(entered, true);
    assert.deepEqual(readResult, { ok: false, error: 'busy' });
    assert.deepEqual(await scanResult, rejected('busy'));
    assert.deepEqual(await retrievalResult, rejected('busy'));
  });
});

test('scanner callbacks remain native-only after persisted workflow validation broadens', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    const outcome = await service.runScan(scanInput(), async run => {
      const terminal = scanTerminal(run);
      const finding = selectedFinding(terminal);
      Object.assign(finding, {
        state: 'active',
        retrieval: { status: 'running', startedAt: terminal.finishedAt },
      });
      return terminal;
    });
    assert.equal(outcome.ok, false);
    assert.equal(outcome.error, 'result-validation');
    assert.equal(outcome.persisted, true);
    assert.ok(outcome.run && outcome.run.status === 'failed');
    assert.equal('scan' in outcome.run, false);
  });
});

test('bounded executor failures persist only the selected failed state and cleanup uncertainty closes admission', serial, async () => {
  for (const [code, uncertain] of [['embedding-failed', false], ['timeout', true]] as const) {
    await withSandbox(async box => {
      seedCompleted(box.runs);
      const service = await start(box);
      let running: unknown;
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => {
        running = disk(box.runs);
        throw new RetrievalError(code, uncertain);
      });
      assert.equal(outcome.ok, false);
      assert.equal(outcome.error, code);
      assert.equal(outcome.persisted, true);
      assert.equal(outcome.cleanupFailed, uncertain);
      const startedAt = assertRunningState(running);
      assertFailedState(outcome.run, startedAt, code);
      assert.deepEqual(disk(box.runs), outcome.run);
      const expected = uncertain ? rejected('stopping') : rejected('not-eligible', outcome.run);
      assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()), expected);
    });
  }
});

test('invalid result and final publication failure return only the last durable aggregate', serial, async t => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    let running: unknown;
    const originalRename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8'));
      if (selectedFinding(candidate).retrieval &&
          (selectedFinding(candidate).retrieval as Record<string, unknown>).status === 'completed') {
        throw new Error('SYNTHETIC_FINAL_PUBLICATION_FAILURE');
      }
      return originalRename(from, to);
    });
    try {
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => {
        running = disk(box.runs);
        return expectedRetrievalResult();
      });
      assert.deepEqual(outcome, rejected('retrieval-persistence', running));
      assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
        rejected('workflow-active'));
    } finally { t.mock.restoreAll(); }
    assert.deepEqual(disk(box.runs), running);
  });
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    let running: unknown;
    const outcome = await service.retrieveFinding(retrievalRequest(), async () => {
      running = disk(box.runs);
      return { unexpected: true };
    });
    assert.equal(outcome.ok, false);
    assert.equal(outcome.error, 'result-validation');
    assert.equal(outcome.persisted, true);
    assert.equal(outcome.cleanupFailed, false);
    assertFailedState(outcome.run, assertRunningState(running), 'result-validation');
  });
});

test('failed running-state publication makes no executor call and releases the reservation', serial, async t => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const original = completedScanRun();
    const originalRename = fs.renameSync;
    let calls = 0;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8'));
      if ((retrievalOf(candidate)).status === 'running') throw new Error('SYNTHETIC_INITIAL_PUBLICATION_FAILURE');
      return originalRename(from, to);
    });
    try {
      assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => {
        calls++;
        return expectedRetrievalResult();
      }), rejected('retrieval-persistence', original));
    } finally { t.mock.restoreAll(); }
    assert.equal(calls, 0);
    assert.deepEqual(disk(box.runs), original);
    const next = await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
    assert.ok(next.ok);
  });
});

test('cooperative shutdown persists one bounded failure before the deadline and abort-handler reentry sees stopping', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box, { stopTimeoutMs: 5000 });
    const entered = deferred<void>();
    let running: unknown;
    let nested: Promise<RetrievalOutcome> | undefined;
    const operation = service.retrieveFinding(retrievalRequest(), async (_finding, signal) => {
      running = disk(box.runs);
      entered.resolve();
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          nested = service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
          assert.deepEqual(service.readRun('run-01'), { ok: false, error: 'stopping' });
          reject(new RetrievalError('shutdown'));
        }, { once: true });
      });
    });
    await entered.promise;
    const stop = service.stop();
    const outcome = await operation;
    assert.equal(outcome.ok, false);
    assert.equal(outcome.error, 'shutdown');
    assert.equal(outcome.persisted, true);
    assert.equal(outcome.cleanupFailed, false);
    assertFailedState(outcome.run, assertRunningState(running), 'shutdown');
    assert.ok(nested);
    assert.deepEqual(await nested, rejected('stopping'));
    assert.deepEqual(await stop, { ok: true, status: 'stopped' });
    assert.deepEqual(disk(box.runs), outcome.run);
  });
});

test('shutdown deadline settles the retrieval once, rejects late publication and makes restart treat active data as historical', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box, { stopTimeoutMs: 25 });
    const entered = deferred<AbortSignal>();
    const pending = deferred<unknown>();
    box.releases.push(() => pending.reject(new Error('Owned late release')));
    const operation = service.retrieveFinding(retrievalRequest(), async (_finding, signal) => {
      entered.resolve(signal);
      return pending.promise;
    });
    const signal = await entered.promise;
    const running = disk(box.runs);
    assertRunningState(running);
    const stopping = service.stop();
    assert.equal(signal.aborted, true);
    assert.deepEqual(await within(stopping, 1000, 'Stop deadline did not settle'), { ok: false, error: 'stop-failed' });
    assert.deepEqual(await within(operation, 1000, 'Retrieval deadline did not settle'),
      rejected('shutdown', running, false, true));
    pending.resolve(expectedRetrievalResult());
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.deepEqual(disk(box.runs), running);
  });
  await withSandbox(async box => {
    seedCompleted(box.runs);
    fs.writeFileSync(path.join(box.runs, 'run-01', 'run.json'), JSON.stringify(completedRetrievalRun(), null, 2) + '\n');
    const service = await start(box);
    assert.deepEqual(service.readRun('run-01'), { ok: true, run: completedRetrievalRun(), interrupted: true });
    assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
      rejected('workflow-active', completedRetrievalRun()));
  });
});
