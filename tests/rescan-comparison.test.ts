import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { CompletedRun, FailedRun, RunningRun } from '../src/server/persistence/run-repository.ts';
import { completedRun, failedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { coverage, imagePassCandidate } from './helpers/comparison-fixtures.ts';
import { matchTerminalRun } from '../src/server/local-service/scan-run-records.ts';
import { prepareRescan, type PreparedRescan } from '../src/server/local-service/rescan-operation.ts';
import type { ScanOperationDependencies } from '../src/server/local-service/scan-operation.ts';

const realComparator = await import('../src/server/comparison/compare-finding.ts');
let comparatorThrows = false;
const comparatorInputs: unknown[] = [];
mock.module(new URL('../src/server/comparison/compare-finding.ts', import.meta.url).href, { namedExports: {
  compareFinding(input: unknown) {
    comparatorInputs.push(input);
    if (comparatorThrows) throw new Error('CONTROLLED_COMPARATOR_SECRET');
    return realComparator.compareFinding(input);
  },
} });
const { executeRescanComparison } = await import('../src/server/local-service/rescan-comparison.ts');

function linkedRunning(id = 'later-run'): RunningRun {
  const checked = validateRun({ ...runningRun(id), baselineRunId: 'baseline-run' });
  assert.ok(checked.ok); assert.equal(checked.value.status, 'running');
  return checked.value as RunningRun;
}
function linkedTerminal(run: RunningRun, kind: 'populated' | 'zero' = 'populated'): CompletedRun {
  const sample = completedRun(run.runId, run.providerContext.mode, kind);
  const finishedAt = new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString();
  const candidate = { formatVersion: run.formatVersion, runId: run.runId, baselineRunId: 'baseline-run',
    createdAt: run.createdAt, applicationRevision: run.applicationRevision, requestedUrl: run.requestedUrl,
    providerContext: run.providerContext, status: 'completed', finishedAt, scan: { ...sample.scan, context: {
      ...run.scanContext, finalUrl: sample.scan.context.finalUrl, scannedAt: { value: finishedAt },
      browserVersion: sample.scan.context.browserVersion, readinessReached: true, cleanup: 'closed',
    }, coverage: kind === 'zero' ? { ...sample.scan.coverage, 'image-alt': coverage(1) } : sample.scan.coverage } };
  const checked = validateRun(candidate); assert.ok(checked.ok); assert.equal(checked.value.status, 'completed');
  const terminal = checked.value as CompletedRun;
  assert.deepEqual(matchTerminalRun(run, terminal), terminal);
  return terminal;
}
function linkedFailure(run: RunningRun): FailedRun {
  const candidate = { ...failedRun(run.runId, run.providerContext.mode), baselineRunId: 'baseline-run',
    createdAt: run.createdAt, applicationRevision: run.applicationRevision, requestedUrl: run.requestedUrl,
    providerContext: run.providerContext, scanContext: { ...run.scanContext, cleanup: 'closed' } };
  const checked = validateRun(candidate); assert.ok(checked.ok); assert.equal(checked.value.status, 'failed');
  assert.ok(matchTerminalRun(run, checked.value)); return checked.value as FailedRun;
}
function setup(kind: 'populated' | 'zero' = 'populated') {
  const run = linkedRunning(); const terminal = linkedTerminal(run, kind); const baselineRun = completedRun('baseline-run');
  const prepared = { ok: true, run, rule: 'image-alt', baselineRun,
    baselineFindingId: baselineRun.scan.findings[0]!.findingId } as PreparedRescan;
  const writes: unknown[] = []; const state = { stopping: false, deadline: false };
  const repository = { create: () => ({ ok: true, value: run }),
    finish: (value: unknown) => { writes.push(value); return { ok: true, value }; } };
  const dependencies = { repository, isStopping: () => state.stopping, deadlineExpired: () => state.deadline,
    markStopFailed: () => undefined } as unknown as ScanOperationDependencies;
  return { run, terminal, prepared, dependencies, repository, state, writes };
}

test('prepareRescan retains one detached validated baseline selection and selected Finding', () => {
  const baseline = completedRun('baseline-run');
  const result = prepareRescan({ runId: 'later-run', baselineRunId: 'baseline-run', findingId: 'finding-0', mode: 'local' },
    { read: () => ({ ok: true, value: baseline }) } as never, 'b'.repeat(40), () => false);
  assert.equal(result.ok, true); if (!result.ok) return;
  const selected = result as unknown as { baselineRun: CompletedRun; baselineFindingId: string };
  assert.deepEqual(selected.baselineRun, baseline); assert.equal(selected.baselineFindingId, 'finding-0');
  assert.equal(Object.isFrozen(selected.baselineRun), true);
});

test('uses one admitted terminal snapshot for real comparison and publication despite later mutation', async () => {
  comparatorInputs.length = 0; const f = setup('zero'); const original = structuredClone(f.terminal);
  const snapshot = structuredClone(original); let runReads = 0;
  let completed = 0;
  const envelope = new Proxy({}, { ownKeys: () => ['run', 'candidates'], getOwnPropertyDescriptor: (_target, key) => {
    if (key === 'run') return { configurable: true, enumerable: true, writable: true,
      value: ++runReads === 1 ? original : { ...original, runId: 'substituted' } };
    (original.scan.context as unknown as { finalUrl: { value: string } }).finalUrl =
      { value: 'https://mutated.invalid/' };
    return { configurable: true, enumerable: true, writable: true, value: [imagePassCandidate()] };
  } });
  const result = await executeRescanComparison(f.dependencies, f.prepared, new AbortController().signal,
    async () => envelope, () => { completed++; });
  assert.equal(runReads, 1); assert.equal(result.outcome.ok, true); assert.equal(result.comparison.ok, true);
  assert.equal(comparatorInputs.length, 1);
  assert.deepEqual((comparatorInputs[0] as { laterRun: CompletedRun }).laterRun, snapshot);
  assert.deepEqual(f.writes[0], snapshot);
  assert.equal(completed, 1);
});

test('separates missing scan truth from malformed candidates and never invokes accessors', async () => {
  const raw = setup();
  const rawResult = await executeRescanComparison(raw.dependencies, raw.prepared, new AbortController().signal,
    async () => raw.terminal);
  assert.equal(rawResult.outcome.ok, false);
  assert.deepEqual(rawResult.comparison, { ok: false, error: 'scan-unavailable' });
  for (const candidates of [[], [{ ...imagePassCandidate(), ruleId: 'label' }],
    [imagePassCandidate(), imagePassCandidate()], [null]]) {
    const f = setup('zero');
    const result = await executeRescanComparison(f.dependencies, f.prepared, new AbortController().signal,
      async () => ({ run: f.terminal, candidates }));
    assert.equal(result.outcome.ok, true);
    assert.deepEqual(result.comparison, { ok: false, error: 'invalid-comparison-input' });
  }
  for (const envelope of [{ run: setup().terminal }, { run: setup().terminal, candidates: [], extra: true }]) {
    const f = setup();
    const result = await executeRescanComparison(f.dependencies, f.prepared, new AbortController().signal,
      async () => envelope);
    assert.equal(result.outcome.ok, true);
    assert.deepEqual(result.comparison, { ok: false, error: 'invalid-comparison-input' });
  }
  const f = setup(); let getters = 0;
  const accessor = Object.defineProperty({ run: f.terminal }, 'candidates',
    { enumerable: true, get: () => { getters++; return []; } });
  const result = await executeRescanComparison(f.dependencies, f.prepared, new AbortController().signal,
    async () => accessor);
  assert.equal(result.outcome.ok, true);
  assert.deepEqual(result.comparison, { ok: false, error: 'invalid-comparison-input' });
  assert.equal(getters, 0);
  const runAccessor = setup(); let runGetters = 0;
  const inaccessible = Object.defineProperty({ candidates: [] }, 'run',
    { enumerable: true, get: () => { runGetters++; return runAccessor.terminal; } });
  const inaccessibleResult = await executeRescanComparison(runAccessor.dependencies, runAccessor.prepared,
    new AbortController().signal, async () => inaccessible);
  assert.equal(inaccessibleResult.outcome.ok, false); assert.equal(runGetters, 0);
});

test('contains comparator exceptions and maps failed scan, publication and lifetime boundaries truthfully', async () => {
  comparatorThrows = true; const throwing = setup('zero');
  const contained = await executeRescanComparison(throwing.dependencies, throwing.prepared,
    new AbortController().signal, async () => ({ run: throwing.terminal, candidates: [imagePassCandidate()] }));
  assert.equal(contained.outcome.ok, true);
  assert.deepEqual(contained.comparison, { ok: false, error: 'comparison-failed' });
  comparatorThrows = false;
  const failed = setup();
  let failedCompleted = 0;
  const failedResult = await executeRescanComparison(failed.dependencies, failed.prepared,
    new AbortController().signal, async () => ({ run: linkedFailure(failed.run) }), () => { failedCompleted++; });
  assert.equal(failedResult.outcome.ok, false);
  assert.deepEqual(failedResult.comparison, { ok: false, error: 'scan-unavailable' });
  assert.equal(failedCompleted, 0);
  for (const boundary of ['create', 'publication', 'abort', 'reflection-stop', 'commit-stop',
    'commit-deadline', 'deadline'] as const) {
    const f = setup('zero'); const controller = new AbortController();
    if (boundary === 'create') f.repository.create = () => ({ ok: false, value: f.run });
    if (boundary === 'publication') f.repository.finish = () => ({ ok: false, cleanupFailed: false, value: undefined });
    if (boundary === 'abort') controller.abort();
    if (boundary === 'deadline') f.state.deadline = true;
    if (boundary === 'commit-stop') f.repository.finish = value => { f.state.stopping = true; return { ok: true, value }; };
    if (boundary === 'commit-deadline') f.repository.finish = value => { f.state.deadline = true; return { ok: true, value }; };
    const envelope = boundary === 'reflection-stop' ? new Proxy({}, {
      ownKeys: () => { f.state.stopping = true; return ['run', 'candidates']; },
      getOwnPropertyDescriptor: (_target, key) => ({ configurable: true, enumerable: true, writable: true,
        value: key === 'run' ? f.terminal : [imagePassCandidate()] }),
    }) : { run: f.terminal, candidates: [imagePassCandidate()] };
    const result = await executeRescanComparison(f.dependencies, f.prepared, controller.signal, async () => envelope);
    if (boundary === 'commit-stop' || boundary === 'commit-deadline') assert.equal(result.outcome.ok, true);
    assert.deepEqual(result.comparison, { ok: false,
      error: ['abort', 'reflection-stop', 'commit-stop', 'commit-deadline', 'deadline'].includes(boundary)
        ? 'shutdown' : 'scan-unavailable' });
  }
});
