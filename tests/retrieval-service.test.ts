import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, RetrievalOutcome, ServiceOptions } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { RunRepository, RunningRun, StoreResult } from '../src/server/persistence/run-repository.ts';
import { RetrievalError } from '../src/server/retrieval/retrieval-error.ts';
import { resolveFindingCitations } from '../src/server/retrieval/corpus-catalog.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import {
  assessedIncompleteRetrievalRun,
  assessedMissingRetrievalRun,
  assessedSupportedRetrievalRun,
  completedRetrievalRun,
  completedScanRun,
  expectedRetrievalResult,
  retrievalResultForPassages,
  retrievalRequest,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';
import { buildCheckpointSeed, controlledCases } from './helpers/m204-checkpoint-fixture.ts';
import type { ControlledCaseId } from './helpers/m204-checkpoint-fixture.ts';
import { generationAdapterHarness } from './helpers/m302-generation-fixture.ts';

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
  assert.deepEqual(retrieval.support, { state: 'supported', missingRoles: [], conflicts: [] });
  const analysis = finding.analysis as Record<string, unknown>;
  assert.deepEqual(Object.keys(analysis).sort(), ['evidence', 'finishedAt', 'startedAt', 'status']);
  assert.equal(analysis.status, 'completed');
  assert.equal(analysis.startedAt, startedAt);
  assert.equal(analysis.finishedAt, retrieval.finishedAt);
  assert.equal((analysis.evidence as Record<string, unknown>).state, 'complete');
}
function seedIncomplete(root: string, runId = 'run-01'): void {
  const store = open(root);
  success(store.create(runningRun(runId)));
  const completed = structuredClone(completedRun(runId)) as unknown as Record<string | number, unknown>;
  (selectedFinding(completed).evidence as Record<string, unknown>).altState = { unavailable: 'missing' };
  success(store.finish(completed as never));
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
    const expectedCitations = await resolveFindingCitations(
      selectedFinding(completedScanRun()), expectedRetrievalResult());
    assert.ok(expectedCitations.ok);
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
    assert.equal('view' in outcome, true);
    assert.deepEqual((outcome as unknown as { view: unknown }).view,
      { runId: 'run-01', findingId: 'finding-0', ...expectedCitations.value });
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

test('marked role selection survives publication, disk, repository validation and restart', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const marked = { ...expectedRetrievalResult(), selectionPolicy: 'highest-per-required-role-v1' as const };
    const outcome = await service.retrieveFinding(retrievalRequest(), async () => marked);
    assert.ok(outcome.ok, JSON.stringify(outcome));
    if (!outcome.ok) return;
    assert.deepEqual((retrievalOf(outcome.run).result as Record<string, unknown>).selectionPolicy,
      'highest-per-required-role-v1');
    assert.deepEqual(disk(box.runs), outcome.run);
    assert.deepEqual(service.readRun('run-01'), { ok: true, run: outcome.run, interrupted: false });
    assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
    const restarted = await start(box);
    const historical = restarted.readRun('run-01');
    assert.ok(historical.ok && historical.interrupted === true);
    if (historical.ok) assert.equal((retrievalOf(historical.run).result as Record<string, unknown>).selectionPolicy,
      'highest-per-required-role-v1');
  });
});

test('supported retrieval ownership transfers once to generation and cannot be reacquired after terminal publication', serial, async () => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const retrieval = await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
    assert.ok(retrieval.ok, JSON.stringify(retrieval));
    const generation = await service.generateFinding(retrievalRequest(), generationAdapterHarness().adapter);
    assert.ok(generation.ok, JSON.stringify(generation));
    assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
      rejected('not-eligible', generation.ok ? generation.run : null));
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
    const view = (outcome as unknown as { view?: { passages: Array<{ passageId: string; score: number }> } }).view;
    assert.deepEqual(executorResult, before);
    assert.equal(Object.is(executorResult.passages[2]!.score, -0), true);
    assert.notStrictEqual(returnedResult, executorResult);
    assert.ok(view);
    assert.deepEqual(view.passages.map(passage => ({ passageId: passage.passageId, score: passage.score })), [
      { passageId: 'h37-text-alternative', score: 0.75 },
      { passageId: 'understanding111-intent', score: 0.5 },
      { passageId: 'wcag22-sc111', score: 0 },
    ]);
    deepFrozen(outcome.run);
    assert.deepEqual(disk(box.runs), durable);
    assert.deepEqual(outcome.run, durable);
  });
});

test('incomplete native evidence completes a durable evidence-only abstention without executing retrieval', serial, async () => {
  await withSandbox(async box => {
    seedIncomplete(box.runs);
    const before = disk(box.runs);
    const sibling = structuredClone(selectedFinding(before as Record<string | number, unknown>, 1));
    const service = await start(box);
    let calls = 0;

    const outcome = await service.retrieveFinding(retrievalRequest(), async () => {
      calls++;
      return expectedRetrievalResult();
    });
    assert.ok(outcome.ok);
    if (!outcome.ok) return;
    assert.equal(calls, 0);
    const finding = selectedFinding(outcome.run as unknown as Record<string | number, unknown>);
    assert.equal(finding.state, 'abstained');
    assert.equal('retrieval' in finding, false);
    assert.deepEqual(finding.result, {
      type: 'abstention', findingId: 'finding-0',
      evidenceReferences: ['checks', 'evidence.elementKind'], retrievalReference: null,
      reason: 'incomplete-evidence', explanation: 'Required captured evidence is incomplete.',
      providerCalled: false,
      manualInvestigation: 'Inspect the affected image and verify its purpose and alternative-text state. Capture the unavailable required facts before requesting guidance in a new analysis.',
    });
    assert.deepEqual(selectedFinding(outcome.run as unknown as Record<string | number, unknown>, 1), sibling);
    assert.deepEqual((outcome as unknown as { view: unknown }).view,
      { runId: 'run-01', findingId: 'finding-0', corpus: null, passages: [], notices: [] });
    assert.deepEqual(disk(box.runs), outcome.run);
    assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
      rejected('not-eligible', outcome.run));
  });
});

test('authentic missing and incomplete guidance abstain durably and release workflow ownership', serial, async () => {
  for (const [name, passages, expectedRun] of [
    ['missing', [], assessedMissingRetrievalRun()],
    ['incomplete', [{ passageId: 'wcag22-sc111', score: 0.75 }], assessedIncompleteRetrievalRun()],
  ] as const) {
    await withSandbox(async box => {
      seedCompleted(box.runs);
      const service = await start(box);
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => retrievalResultForPassages([...passages]));
      assert.ok(outcome.ok, `${name} guidance must produce a successful durable abstention`);
      if (!outcome.ok) return;
      const finding = selectedFinding(outcome.run as unknown as Record<string | number, unknown>);
      const expectedFinding = structuredClone(selectedFinding(expectedRun));
      const actualRetrieval = finding.retrieval as Record<string, unknown>;
      const expectedRetrieval = expectedFinding.retrieval as Record<string, unknown>;
      expectedRetrieval.startedAt = actualRetrieval.startedAt;
      expectedRetrieval.finishedAt = actualRetrieval.finishedAt;
      const actualAnalysis = finding.analysis as Record<string, unknown>;
      const expectedAnalysis = expectedFinding.analysis as Record<string, unknown>;
      assert.ok(actualAnalysis);
      expectedAnalysis.startedAt = actualAnalysis.startedAt;
      expectedAnalysis.finishedAt = actualAnalysis.finishedAt;
      assert.equal(finding.state, 'abstained');
      assert.deepEqual(finding, expectedFinding);
      assert.equal(((finding.result as Record<string, unknown>).providerCalled), false);
      assert.deepEqual(disk(box.runs), outcome.run);
      assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
        rejected('not-eligible', outcome.run));
      const independent = await service.runScan(scanInput(), async run => scanTerminal(run));
      assert.ok(independent.ok);
    });
  }
});

test('canonical citation resolution failure persists retrieval failure with no support or abstention', serial, async t => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const originalRead = fsPromises.readFile;
    t.mock.method(fsPromises, 'readFile', async (...args: Parameters<typeof fsPromises.readFile>) => {
      if (String(args[0]).includes('wcag22-mvp-v1')) throw new Error('SYNTHETIC_CORPUS_READ_FAILURE');
      return Reflect.apply(originalRead, fsPromises, args);
    });
    syncBuiltinESMExports();
    try {
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
      assert.equal(outcome.ok, false);
      assert.equal(outcome.error, 'corpus-integrity');
      assert.equal(outcome.persisted, true);
      const finding = selectedFinding(outcome.run as unknown as Record<string | number, unknown>);
      assert.equal(finding.state, 'failed');
      assert.equal('analysis' in finding, false);
      assert.equal('result' in finding, false);
      assert.equal('support' in (finding.retrieval as Record<string, unknown>), false);
      assert.deepEqual(selectedFinding(outcome.run as unknown as Record<string | number, unknown>, 1),
        selectedFinding(completedScanRun(), 1));
      assert.deepEqual(disk(box.runs), outcome.run);
    } finally {
      t.mock.restoreAll();
      syncBuiltinESMExports();
    }
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

test('failed evidence-only activation makes no executor call and releases the reservation', serial, async t => {
  await withSandbox(async box => {
    seedIncomplete(box.runs);
    const service = await start(box);
    const original = disk(box.runs);
    const originalRename = fs.renameSync;
    let calls = 0;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8'));
      const analysis = selectedFinding(candidate).analysis as Record<string, unknown> | undefined;
      if (analysis?.status === 'running') throw new Error('SYNTHETIC_ANALYSIS_ACTIVATION_FAILURE');
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
    const next = await service.retrieveFinding(retrievalRequest(), async () => {
      calls++;
      return expectedRetrievalResult();
    });
    assert.ok(next.ok);
    assert.equal(calls, 0);
  });
});

test('failed evidence-only terminal publication returns the running aggregate and retains its owner', serial, async t => {
  await withSandbox(async box => {
    seedIncomplete(box.runs);
    const service = await start(box);
    const originalRename = fs.renameSync;
    let running: unknown;
    let calls = 0;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8'));
      const analysis = selectedFinding(candidate).analysis as Record<string, unknown> | undefined;
      if (analysis?.status === 'running') {
        const result = originalRename(from, to);
        running = disk(box.runs);
        return result;
      }
      if (selectedFinding(candidate).state === 'abstained') {
        throw new Error('SYNTHETIC_ABSTENTION_PUBLICATION_FAILURE');
      }
      return originalRename(from, to);
    });
    try {
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => {
        calls++;
        return expectedRetrievalResult();
      });
      assert.deepEqual(outcome, rejected('retrieval-persistence', running));
      assert.equal(calls, 0);
      assert.deepEqual(disk(box.runs), running);
      assert.deepEqual(await service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult()),
        rejected('workflow-active'));
    } finally { t.mock.restoreAll(); }
  });
});

test('shutdown after evidence-only activation persists its bounded failure without invoking retrieval', serial, async t => {
  await withSandbox(async box => {
    seedIncomplete(box.runs);
    const service = await start(box, { stopTimeoutMs: 5000 });
    const originalRename = fs.renameSync;
    let running: unknown;
    let stopping: Promise<unknown> | undefined;
    let calls = 0;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8'));
      const analysis = selectedFinding(candidate).analysis as Record<string, unknown> | undefined;
      if (analysis?.status === 'running') {
        const result = originalRename(from, to);
        running = disk(box.runs);
        stopping = service.stop();
        return result;
      }
      return originalRename(from, to);
    });
    try {
      const outcome = await service.retrieveFinding(retrievalRequest(), async () => {
        calls++;
        return expectedRetrievalResult();
      });
      assert.equal(calls, 0);
      assert.equal(outcome.ok, false);
      assert.equal(outcome.error, 'shutdown');
      assert.equal(outcome.persisted, true);
      assert.equal(outcome.cleanupFailed, false);
      const finding = selectedFinding(outcome.run as unknown as Record<string | number, unknown>);
      assert.equal(finding.state, 'failed');
      assert.deepEqual(finding.analysis, {
        status: 'failed',
        startedAt: (selectedFinding(running as Record<string | number, unknown>).analysis as Record<string, unknown>).startedAt,
        finishedAt: (finding.analysis as Record<string, unknown>).finishedAt,
        error: 'shutdown',
      });
      assert.equal('retrieval' in finding, false);
      assert.equal('result' in finding, false);
      assert.ok(stopping);
      assert.deepEqual(await stopping, { ok: true, status: 'stopped' });
      assert.deepEqual(disk(box.runs), outcome.run);
    } finally { t.mock.restoreAll(); }
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

test('shutdown deadline during citation resolution forbids publication from late authenticated bytes', serial, async t => {
  await withSandbox(async box => {
    seedCompleted(box.runs);
    const service = await start(box, { stopTimeoutMs: 25 });
    const entered = deferred<void>();
    const release = deferred<void>();
    box.releases.push(() => release.resolve(undefined));
    const originalRead = fsPromises.readFile;
    t.mock.method(fsPromises, 'readFile', async (...args: Parameters<typeof fsPromises.readFile>) => {
      if (String(args[0]).includes('wcag22-mvp-v1')) {
        entered.resolve(undefined);
        await release.promise;
      }
      return Reflect.apply(originalRead, fsPromises, args);
    });
    syncBuiltinESMExports();
    try {
      const operation = service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
      assert.equal(await within(Promise.race([
        entered.promise.then(() => 'citation' as const),
        operation.then(() => 'operation' as const),
      ]), 1000, 'Retrieval produced no citation-resolution activity'),
      'citation', 'Retrieval completed before canonical citation resolution');
      const running = disk(box.runs);
      const stopping = service.stop();
      assert.deepEqual(await within(stopping, 1000, 'Stop deadline did not settle'),
        { ok: false, error: 'stop-failed' });
      assert.deepEqual(await within(operation, 1000, 'Retrieval deadline did not settle'),
        rejected('shutdown', running, false, true));
      release.resolve(undefined);
      await new Promise<void>(resolve => setImmediate(resolve));
      assert.deepEqual(disk(box.runs), running);
    } finally {
      release.resolve(undefined);
      t.mock.restoreAll();
      syncBuiltinESMExports();
    }
  });
});

test('M204 controlled service cases preserve the aggregate and join altered corpus bytes to durable integrity failure', serial, async t => {
  for (const caseId of ['S', 'A', 'Z', 'F', 'I'] as const satisfies readonly ControlledCaseId[]) {
    await withSandbox(async box => {
      const seed = buildCheckpointSeed(caseId, 'b'.repeat(40));
      const store = open(box.runs);
      success(store.create(seed.running as never));
      success(store.finish(seed.completed as never));
      const before = disk(box.runs, seed.completed.runId);
      const service = await start(box);
      const config = controlledCases[caseId];
      const originalRead = fsPromises.readFile;
      if (caseId === 'I') {
        t.mock.method(fsPromises, 'readFile', async (...args: Parameters<typeof fsPromises.readFile>) => {
          const bytes = await Reflect.apply(originalRead, fsPromises, args) as Buffer;
          if (!String(args[0]).endsWith('passages.json')) return bytes;
          const altered = Buffer.from(bytes);
          const offset = altered.indexOf(Buffer.from('WCAG'));
          assert.ok(offset >= 0);
          altered[offset + 3] = 'g'.charCodeAt(0);
          return altered;
        });
        syncBuiltinESMExports();
      }
      let outcome: RetrievalOutcome;
      try {
        outcome = await service.retrieveFinding(retrievalRequest(seed.completed.runId), async () => {
          if (caseId === 'F') throw new RetrievalError('embedding-failed');
          return retrievalResultForPassages([...(config.passages ?? [])]);
        });
      } finally {
        if (caseId === 'I') {
          t.mock.restoreAll();
          syncBuiltinESMExports();
        }
      }
      assert.deepEqual(disk(box.runs, seed.completed.runId), outcome.run);
      assert.ok(outcome.run);
      const after: any = structuredClone(outcome.run);
      const prior: any = structuredClone(before);
      for (const aggregate of [after, prior]) {
        const selected = selectedFinding(aggregate);
        selected.state = 'unprocessed';
        delete selected.retrieval;
        delete selected.analysis;
        delete selected.result;
      }
      assert.deepEqual(after, prior, `${caseId}: only selected downstream fields may change`);
      const finding = selectedFinding(outcome.run as unknown as Record<string | number, unknown>);
      assert.equal('invocation' in finding, false);
      assert.equal('review' in finding, false);
      const settledRead = service.readRun(seed.completed.runId);
      assert.ok(settledRead.ok && settledRead.interrupted === false);
      assert.deepEqual(settledRead.run, outcome.run);
      if (caseId === 'S') {
        assert.ok(outcome.ok);
        assert.equal(finding.state, 'active');
        assert.deepEqual((finding.retrieval as Record<string, unknown>).support,
          { state: 'supported', missingRoles: [], conflicts: [] });
        assert.equal('result' in finding, false);
        assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
        const restarted = await start(box);
        const historical = restarted.readRun(seed.completed.runId);
        assert.ok(historical.ok && historical.interrupted === true);
        return;
      }
      if (caseId === 'A' || caseId === 'Z') {
        assert.ok(outcome.ok);
        assert.equal(finding.state, 'abstained');
        const support = (finding.retrieval as Record<string, unknown>).support;
        assert.deepEqual(support, caseId === 'A'
          ? { state: 'incomplete', missingRoles: ['interpretation', 'remediation'], conflicts: [] }
          : { state: 'missing', missingRoles: ['criterion', 'interpretation', 'remediation'], conflicts: [] });
        const result = finding.result as Record<string, unknown>;
        assert.equal(result.providerCalled, false);
        assert.equal(result.reason, caseId === 'A' ? 'incomplete-guidance' : 'missing-guidance');
        return;
      }
      assert.equal(outcome.ok, false);
      if (!outcome.ok) assert.equal(outcome.error, caseId === 'F' ? 'embedding-failed' : 'corpus-integrity');
      assert.equal(finding.state, 'failed');
      assert.equal('analysis' in finding, false);
      assert.equal('result' in finding, false);
      assert.equal('support' in (finding.retrieval as Record<string, unknown>), false);
    });
  }
});
