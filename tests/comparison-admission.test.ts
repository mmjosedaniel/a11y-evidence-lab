import assert from 'node:assert/strict';
import test from 'node:test';
import { admitComparisonRead } from '../src/client/comparison-admission.ts';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';
import { completedRun } from './helpers/m102-run-fixture.ts';
import { assessedSupportedRetrievalRun } from './helpers/m202-retrieval-service-fixture.ts';
import { mutate, remove, withComparison } from './helpers/m503-comparison-fixture.ts';

const { createComparisonRequest, getComparisonRun } = await import('../src/client/comparison-request.ts');

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
const serial = { concurrency: false };

function compared(run: CompleteRun = completedRun('later-run')): CompleteRun {
  return withComparison(run) as CompleteRun;
}

function reply(run: CompleteRun, comparisonLineage: unknown, status = 200): unknown {
  return { status, body: { ok: true, run, interrupted: false, comparisonLineage } };
}

function immutableComparisonSource(run: CompleteRun): unknown {
  return {
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    context: run.scan.context,
    coverage: run.scan.coverage,
    scannerReviewObservations: run.scan.scannerReviewObservations,
    findings: run.scan.findings.map(finding => ({
      findingId: finding.findingId,
      ruleId: finding.ruleId,
      nativeResult: finding.nativeResult,
      checks: finding.checks,
      locator: finding.locator,
      evidence: finding.evidence,
    })),
    comparison: (run as unknown as { comparison: unknown }).comparison,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

async function turn(): Promise<void> {
  await new Promise<void>(resolve => setImmediate(resolve));
}

async function withMemoryWindow<T>(body: (clock: { fire(): void; delays(): readonly number[] }) => Promise<T>): Promise<T> {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const performanceDescriptor = Object.getOwnPropertyDescriptor(performance, 'now');
  let now = 0;
  let next = 1;
  const timers = new Map<number, TimerHandler>();
  const delays: number[] = [];
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    setTimeout(handler: TimerHandler, delay = 0): number {
      const handle = next++;
      delays.push(delay);
      timers.set(handle, handler);
      return handle;
    },
    clearTimeout(handle?: number): void { if (handle !== undefined) timers.delete(handle); },
  } });
  Object.defineProperty(performance, 'now', { configurable: true, value: () => now });
  try {
    return await body({
      fire(): void {
        now = 30000;
        const entry = [...timers.entries()][0];
        assert.ok(entry, 'Expected one owned comparison-read timer');
        timers.delete(entry[0]);
        if (typeof entry[1] !== 'function') assert.fail('String timer handlers are forbidden');
        entry[1]();
      },
      delays: () => [...delays],
    });
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor);
    else delete (globalThis as { window?: unknown }).window;
    if (performanceDescriptor) Object.defineProperty(performance, 'now', performanceDescriptor);
    else delete (performance as { now?: unknown }).now;
  }
}

test('admits only exact lineage metadata while tolerating newer downstream Finding state', serial, () => {
  const captured = compared();
  const newer = compared(assessedSupportedRetrievalRun('later-run') as unknown as CompleteRun);
  assert.notDeepEqual(newer.scan.findings, captured.scan.findings);
  assert.deepEqual(immutableComparisonSource(newer), immutableComparisonSource(captured),
    'Downstream-state fixture must preserve immutable native/context/comparison identity');

  assert.deepEqual(admitComparisonRead(reply(newer, { status: 'available' }), captured),
    { status: 'available' });
  for (const reason of ['not-found', 'invalid-run', 'read-failed', 'stored-run-unavailable', 'baseline-mismatch'] as const) {
    assert.deepEqual(admitComparisonRead(reply(newer, { status: 'unavailable', reason }), captured),
      { status: 'unavailable', reason });
  }
});

test('rejects stale, foreign, malformed, native-changed and comparison-changed readbacks without returning a run', serial, () => {
  const captured = compared();
  const valid = reply(captured, { status: 'available' });
  const cases: unknown[] = [
    null,
    { status: 200 },
    { status: 201, body: (valid as { body: unknown }).body },
    { ...(valid as object), extra: true },
    { status: 200, body: { ...(valid as { body: object }).body, extra: true } },
    { status: 200, body: { ok: true, run: captured, interrupted: false } },
    { status: 200, body: { ok: true, run: captured, interrupted: false,
      comparisonLineage: { status: 'unavailable', reason: 'private-reason' } } },
    reply(compared(completedRun('foreign-run')), { status: 'available' }),
    reply(mutate(captured, ['scan', 'context', 'locale'], 'fr-FR') as CompleteRun, { status: 'available' }),
    reply(mutate(captured, ['comparison', 'baseline', 'findingId'], 'changed') as CompleteRun, { status: 'available' }),
    reply(remove(captured, ['comparison']) as CompleteRun, { status: 'available' }),
  ];
  for (const candidate of cases) assert.equal(admitComparisonRead(candidate, captured), null);
  const admitted = admitComparisonRead(valid, captured);
  assert.deepEqual(admitted, { status: 'available' });
  assert.equal(Object.hasOwn(admitted as object, 'run'), false, 'Admission returns metadata only');
});

test('never evaluates accessors and detaches admitted lineage from later mutation', serial, () => {
  const captured = compared();
  let reads = 0;
  const hostile = Object.defineProperty({ status: 200 }, 'body', {
    enumerable: true,
    get() { reads++; return { ok: true, run: captured, interrupted: false, comparisonLineage: { status: 'available' } }; },
  });
  assert.equal(admitComparisonRead(hostile, captured), null);
  assert.equal(reads, 0);

  const raw = reply(captured, { status: 'unavailable', reason: 'not-found' }) as {
    body: { comparisonLineage: { status: string; reason: string } };
  };
  const result = admitComparisonRead(raw, captured);
  raw.body.comparisonLineage.reason = 'read-failed';
  assert.deepEqual(result, { status: 'unavailable', reason: 'not-found' });
});

test('comparison request verifies one captured run and maps unavailable transport to unverified exactly once', serial, async () => {
  await withMemoryWindow(async clock => {
    const run = compared();
    const settlements: unknown[] = [];
    let calls = 0;
    let signal: AbortSignal | undefined;
    const request = createComparisonRequest({
      run,
      current: () => true,
      readCallback: () => async (runId: string, currentSignal: AbortSignal) => {
        calls++;
        signal = currentSignal;
        assert.equal(runId, run.runId);
        return reply(run, { status: 'available' });
      },
      settle: (value: unknown) => settlements.push(value),
    });
    request.start();
    await turn();
    assert.deepEqual(settlements, [{ status: 'available' }]);
    assert.equal(calls, 1);
    assert.deepEqual(clock.delays(), [30000]);
    request.start();
    assert.equal(calls, 1);
    assert.equal(signal?.aborted, false);

    for (const callback of [undefined, () => Promise.reject(new Error('CONTROLLED_READ_FAILURE')),
      () => Promise.resolve(null)]) {
      const failures: unknown[] = [];
      const failed = createComparisonRequest({ run, current: () => true, readCallback: () => callback,
        settle: (value: unknown) => failures.push(value) });
      failed.start();
      await turn();
      assert.deepEqual(failures, [{ status: 'unverified' }]);
    }
  });
});

test('comparison request rechecks ownership across synchronous callback access and observes an in-flight rejection', serial, async () => {
  await withMemoryWindow(async () => {
    const run = compared();
    let current = true;
    let dispatches = 0;
    const settlements: unknown[] = [];
    const invalidatedOnAccess = createComparisonRequest({
      run,
      current: () => current,
      readCallback: () => {
        current = false;
        return () => {
          dispatches++;
          return Promise.resolve(reply(run, { status: 'available' }));
        };
      },
      settle: (value: unknown) => settlements.push(value),
    });
    invalidatedOnAccess.start();
    await turn();
    assert.equal(dispatches, 0, 'Ownership invalidated during callback access forbids dispatch');
    assert.equal(settlements.length, 0);

    current = true;
    let rejectionObserved = 0;
    const rejectedDuringDispatch = createComparisonRequest({
      run,
      current: () => current,
      readCallback: () => () => {
        dispatches++;
        current = false;
        return {
          then(_resolve: (value: unknown) => void, reject: (reason: unknown) => void): void {
            rejectionObserved++;
            reject(new Error('CONTROLLED_REENTRANT_READ_FAILURE'));
          },
        } as unknown as Promise<unknown>;
      },
      settle: (value: unknown) => settlements.push(value),
    });
    rejectedDuringDispatch.start();
    await turn();
    assert.equal(dispatches, 1, 'No further dispatch occurs after synchronous ownership invalidation');
    assert.equal(rejectionObserved, 1, 'The already-created rejection remains observed');
    assert.deepEqual(settlements, []);
  });
});

test('comparison request timeout, stop and stale ownership cannot apply late metadata', serial, async () => {
  await withMemoryWindow(async clock => {
    const run = compared();
    const pending = deferred<unknown>();
    const settlements: unknown[] = [];
    let signal: AbortSignal | undefined;
    const request = createComparisonRequest({ run, current: () => true,
      readCallback: () => (_runId: string, currentSignal: AbortSignal) => {
        signal = currentSignal;
        return pending.promise;
      }, settle: (value: unknown) => settlements.push(value) });
    request.start();
    await turn();
    clock.fire();
    assert.deepEqual(settlements, [{ status: 'unverified' }]);
    assert.equal(signal?.aborted, true);
    pending.resolve(reply(run, { status: 'available' }));
    await turn();
    assert.equal(settlements.length, 1);

    for (const mode of ['stop', 'stale'] as const) {
      const late = deferred<unknown>();
      const results: unknown[] = [];
      let current = true;
      const owned = createComparisonRequest({ run, current: () => current,
        readCallback: () => () => late.promise, settle: (value: unknown) => results.push(value) });
      owned.start();
      await turn();
      if (mode === 'stop') owned.stop(); else current = false;
      late.resolve(reply(run, { status: 'available' }));
      await turn();
      assert.deepEqual(results, []);
    }
  });
});

test('GET transport performs one same-origin encoded run read and returns status/body without retry', serial, async () => {
  const original = globalThis.fetch;
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async (...args: unknown[]) => {
    calls.push(args);
    return { status: 200, json: async () => ({ ok: true }) };
  } });
  try {
    const signal = new AbortController().signal;
    assert.deepEqual(await getComparisonRun('later-run', signal), { status: 200, body: { ok: true } });
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ['/api/runs/later-run', { method: 'GET', signal }]);
  } finally {
    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: original });
  }
});
