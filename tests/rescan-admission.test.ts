import assert from 'node:assert/strict';
import test from 'node:test';
import { admitRescan } from '../src/client/rescan-admission.ts';
import type { RescanIntent } from '../src/client/rescan-admission.ts';
import { createRescanRequest } from '../src/client/rescan-request.ts';
import type {
  RescanCallback,
  RescanPresentation,
  RescanSettlement,
} from '../src/client/rescan-request.ts';
import { postRescan } from '../src/client/rescan-transport.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';
import type { RescanOutcome } from '../src/server/local-service/contracts.ts';
import { completedRun, failedRun } from './helpers/m102-run-fixture.ts';
import { selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import { pendingReviewRun, successfulReviewRun } from './helpers/m402-review-fixture.ts';
import { expectedComparison } from './helpers/m503-comparison-fixture.ts';

const serial = { concurrency: false };
type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
type RescanFailure = Extract<RescanOutcome, { ok: false }>;
type HistoricalRescanFailure = Extract<RescanFailure, { run: FailedRun | null }>;
type Mode = RescanIntent['mode'];

function checkedComplete(input: unknown): CompleteRun {
  const parsed = validateRun(input);
  assert.ok(parsed.ok && parsed.value.status === 'completed', 'Fixture must remain a valid completed run');
  return parsed.value;
}

function checkedFailure(input: unknown): FailedRun {
  const parsed = validateRun(input);
  assert.ok(parsed.ok && parsed.value.status === 'failed', 'Fixture must remain a valid failed run');
  return parsed.value;
}

function baseline(runId = 'run-baseline', kind: 'populated' | 'zero' | 'unavailable' = 'populated'): CompleteRun {
  return completedRun(runId, 'local', kind);
}

function intent(
  runId = 'run-rescan',
  baselineRunId = 'run-baseline',
  mode: Mode = 'groq',
  findingId = 'finding-0',
): RescanIntent {
  return { runId, baselineRunId, findingId, mode };
}

function linkedComplete(
  selected = intent(),
  kind: 'populated' | 'zero' = 'populated',
  requestedUrl = baseline(selected.baselineRunId).requestedUrl,
): CompleteRun {
  const value = structuredClone(completedRun(selected.runId, selected.mode, kind)) as Record<string, unknown>;
  value.baselineRunId = selected.baselineRunId;
  value.requestedUrl = requestedUrl;
  const scan = value.scan as Record<string, unknown>;
  const context = scan.context as Record<string, unknown>;
  context.finalUrl = { value: 'https://redirect.example.org/final?view=rescan#results' };
  return checkedComplete(value);
}

function linkedCompared(
  selected = intent(),
  kind: 'populated' | 'zero' = 'populated',
  requestedUrl = baseline(selected.baselineRunId).requestedUrl,
  before: CompleteRun = baseline(selected.baselineRunId),
): CompleteRun {
  const later = linkedComplete(selected, kind, requestedUrl);
  const comparison = expectedComparison({ baselineRun: before,
    baselineFindingId: selected.findingId, laterRun: later, candidates: [] });
  return checkedComplete({ ...later, comparison });
}

function linkedFailure(
  selected = intent(),
  cleanup: 'closed' | 'failed' = 'closed',
  requestedUrl = baseline(selected.baselineRunId).requestedUrl,
): FailedRun {
  const value = structuredClone(failedRun(selected.runId, selected.mode, cleanup)) as Record<string, unknown>;
  value.baselineRunId = selected.baselineRunId;
  value.requestedUrl = requestedUrl;
  return checkedFailure(value);
}

function transport(status: number, body: unknown): { status: number; body: unknown } {
  return { status, body };
}

function failure(
  error: HistoricalRescanFailure['error'],
  run: FailedRun | null = null,
  persisted = false,
  cleanupFailed = false,
): HistoricalRescanFailure {
  return { ok: false, error, run, persisted, cleanupFailed };
}

function deferred<T>(): { promise: Promise<T>; resolve(value: T): void; reject(reason?: unknown): void } {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((accept, refuse) => { resolve = accept; reject = refuse; });
  return { promise, resolve, reject };
}

async function turn(): Promise<void> {
  await new Promise<void>(resolve => setImmediate(resolve));
}

type ClockWindow = {
  setTimeout(handler: TimerHandler, delay?: number, ...arguments_: unknown[]): number;
  clearTimeout(handle?: number): void;
};

async function withMemoryWindow<T>(body: (clock: {
  now(value?: number): number;
  fire(handle?: number): void;
  delays(): readonly number[];
}) => Promise<T>): Promise<T> {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const performanceNow = Object.getOwnPropertyDescriptor(performance, 'now');
  let now = 0;
  let next = 1;
  const handlers = new Map<number, { handler: TimerHandler; arguments_: unknown[] }>();
  const scheduled: number[] = [];
  const memoryWindow: ClockWindow = {
    setTimeout(handler: TimerHandler, delay = 0, ...arguments_: unknown[]): number {
      const handle = next++;
      scheduled.push(delay);
      handlers.set(handle, { handler, arguments_ });
      return handle;
    },
    clearTimeout(handle?: number): void {
      if (handle !== undefined) handlers.delete(handle);
    },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: memoryWindow });
  Object.defineProperty(performance, 'now', { configurable: true, value: () => now });
  try {
    return await body({
      now(value?: number): number { if (value !== undefined) now = value; return now; },
      fire(handle?: number): void {
        const selected = handle ?? [...handlers.keys()][0];
        if (selected === undefined) throw new Error('No controlled timer remains');
        const entry = handlers.get(selected);
        if (!entry) throw new Error('Controlled timer was cleared');
        handlers.delete(selected);
        if (typeof entry.handler === 'function') entry.handler(...entry.arguments_);
        else throw new Error('String timer handlers are not accepted by the request owner');
      },
      delays: () => [...scheduled],
    });
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else delete (globalThis as { window?: unknown }).window;
    if (performanceNow) Object.defineProperty(performance, 'now', performanceNow);
    else delete (performance as { now?: unknown }).now;
  }
}

test('admits exact linked success for both modes, arbitrary baseline Finding state, unavailable locator, and zero later Findings', serial, () => {
  const reviewed = successfulReviewRun('approve', 'run-reviewed', 'local');
  const pending = pendingReviewRun('run-pending', 'local');
  const ordinary = baseline();
  const zero = baseline('run-zero-baseline');
  const unavailable = baseline('run-unavailable', 'unavailable');
  const cases: Array<{ before: CompleteRun; selected: RescanIntent; later: CompleteRun }> = [
    { before: ordinary, selected: intent(), later: linkedCompared(intent(), 'populated', ordinary.requestedUrl, ordinary) },
    { before: zero, selected: intent('run-zero', 'run-zero-baseline', 'local'),
      later: linkedCompared(intent('run-zero', 'run-zero-baseline', 'local'), 'zero', zero.requestedUrl, zero) },
    { before: unavailable,
      selected: intent('run-from-unavailable', 'run-unavailable', 'groq'),
      later: linkedCompared(intent('run-from-unavailable', 'run-unavailable', 'groq'), 'populated',
        unavailable.requestedUrl, unavailable) },
    { before: reviewed, selected: intent('run-from-reviewed', reviewed.runId, 'local'),
      later: linkedCompared(intent('run-from-reviewed', reviewed.runId, 'local'), 'populated', reviewed.requestedUrl, reviewed) },
    { before: pending, selected: intent('run-from-pending', pending.runId, 'groq'),
      later: linkedCompared(intent('run-from-pending', pending.runId, 'groq'), 'populated', pending.requestedUrl, pending) },
  ];

  for (const entry of cases) {
    const raw = transport(200, { ok: true, run: structuredClone(entry.later) });
    const expected = structuredClone(raw.body);
    const admitted = admitRescan(raw, entry.before, entry.selected) as RescanOutcome | null;
    assert.deepEqual(admitted, expected);
    assert.ok(admitted && admitted.ok);
    assert.ok(admitted.run.scan.findings.every(finding => finding.state === 'unprocessed'));
    assert.equal(admitted.run.scan.context.finalUrl.value, 'https://redirect.example.org/final?view=rescan#results');

    (raw.body as { run: Record<string, unknown> }).run.requestedUrl = 'https://mutated.example.org/';
    (entry.selected as { runId: string }).runId = 'run-mutated';
    assert.deepEqual(admitted, expected, 'Admitted truth must be detached from response and intent mutation');
  }
});

test('rejects success with stale or mismatched status, later identity, lineage, requested URL, provider context, or processed Findings', serial, () => {
  const before = baseline();
  const selected = intent();
  const candidates: unknown[] = [
    transport(201, { ok: true, run: linkedCompared(selected) }),
    transport(200, { ok: true, run: linkedCompared(intent('run-other')) }),
    transport(200, { ok: true, run: linkedComplete(selected) }),
    transport(200, { ok: true, run: completedRun(selected.runId, selected.mode) }),
    transport(200, { ok: true, run: linkedCompared(intent(selected.runId, 'run-other')) }),
    transport(200, { ok: true, run: linkedCompared(selected, 'populated', 'https://example.org/other') }),
    transport(200, { ok: true, run: linkedCompared(intent(selected.runId, selected.baselineRunId, 'local')) }),
  ];

  const wrongProvider = structuredClone(linkedCompared(selected)) as Record<string, unknown>;
  wrongProvider.providerContext = { mode: 'groq', provider: 'groq', model: 'unknown-model' };
  candidates.push(transport(200, { ok: true, run: wrongProvider }));

  const processed = structuredClone(pendingReviewRun(selected.runId, selected.mode)) as Record<string, unknown>;
  processed.baselineRunId = selected.baselineRunId;
  processed.requestedUrl = before.requestedUrl;
  const processedRun = checkedComplete(processed);
  const processedComparison = expectedComparison({ baselineRun: before,
    baselineFindingId: selected.findingId, laterRun: processedRun, candidates: [] });
  candidates.push(transport(200, { ok: true,
    run: checkedComplete({ ...processedRun, comparison: processedComparison }) }));

  candidates.push(
    transport(200, { ok: true, run: linkedCompared(selected), extra: true }),
    { status: 200, body: { ok: true, run: linkedCompared(selected) }, extra: true },
    transport(Number.NaN, { ok: true, run: linkedCompared(selected) }),
    { status: 200 },
    null,
  );
  for (const candidate of candidates) assert.equal(admitRescan(candidate, before, selected), null);
});

test('admits only the exact closed failure/status/identity tuples', serial, () => {
  const before = baseline();
  const selected = intent();
  const precreation = [
    [400, 'invalid-request'], [404, 'not-found'], [409, 'busy'], [409, 'not-eligible'],
    [503, 'stopping'], [503, 'shutdown'], [500, 'invalid-run'], [500, 'stored-run-unavailable'],
    [500, 'read-failed'], [500, 'create-failed'],
  ] as const;
  for (const [status, error] of precreation) {
    const body = failure(error);
    assert.deepEqual(admitRescan(transport(status, body), before, selected), body, error);
  }
  const uncertainCreate = failure('create-failed', null, false, true);
  assert.deepEqual(admitRescan(transport(500, uncertainCreate), before, selected), uncertainCreate);
  const precreationLineage = { ok: false, error: 'comparison-lineage', run: null,
    persisted: false, cleanupFailed: false };
  assert.deepEqual(admitRescan(transport(409, precreationLineage), before, selected), precreationLineage);

  for (const error of ['scan-failed', 'result-validation', 'initial-persistence'] as const) {
    for (const persisted of [false, true]) {
      const body = failure(error, linkedFailure(selected), persisted, false);
      assert.deepEqual(admitRescan(transport(500, body), before, selected), body, `${error}:${persisted}`);
    }
    const cleanup = failure(error, linkedFailure(selected, 'failed'), false, true);
    assert.deepEqual(admitRescan(transport(500, cleanup), before, selected), cleanup, `${error}:cleanup`);
  }
  const shutdownAfterCreate = failure('shutdown', linkedFailure(selected), false, false);
  assert.deepEqual(admitRescan(transport(503, shutdownAfterCreate), before, selected), shutdownAfterCreate);

  const completed = linkedComplete(selected);
  for (const [status, error, cleanupFailed] of [
    [500, 'comparison-calculation', false],
    [409, 'comparison-lineage', false],
    [500, 'comparison-persistence', false],
    [500, 'comparison-persistence', true],
    [409, 'comparison-aborted', false],
    [503, 'comparison-shutdown', false],
    [503, 'comparison-shutdown', true],
  ] as const) {
    const body = { ok: false, error, run: completed, persisted: true,
      comparisonPersisted: false, cleanupFailed };
    assert.deepEqual(admitRescan(transport(status, body), before, selected), body, error);
  }
});

test('rejects contradictory failures, foreign failed runs, unknown errors, and outcome-unknown envelopes', serial, () => {
  const before = baseline();
  const selected = intent();
  const wrongId = linkedFailure(intent('run-other'));
  const wrongLink = linkedFailure(intent(selected.runId, 'run-other'));
  const wrongUrl = linkedFailure(selected, 'closed', 'https://example.org/other');
  const wrongMode = linkedFailure(intent(selected.runId, selected.baselineRunId, 'local'));
  const candidates: unknown[] = [
    transport(500, failure('scan-failed')),
    transport(500, failure('result-validation')),
    transport(500, failure('initial-persistence')),
    transport(400, failure('invalid-request', linkedFailure(selected))),
    transport(409, failure('busy', linkedFailure(selected))),
    transport(500, failure('create-failed', linkedFailure(selected))),
    transport(500, failure('scan-failed', wrongId)),
    transport(500, failure('scan-failed', wrongLink)),
    transport(500, failure('scan-failed', wrongUrl)),
    transport(500, failure('scan-failed', wrongMode)),
    transport(500, failure('scan-failed', linkedFailure(selected, 'failed'), false, false)),
    transport(500, failure('scan-failed', linkedFailure(selected), false, true)),
    transport(500, { ...failure('scan-failed', linkedFailure(selected)), extra: true }),
    transport(500, { ok: false, error: 'comparison-persistence', run: linkedComplete(selected),
      persisted: true, cleanupFailed: false }),
    transport(500, { ok: false, error: 'comparison-persistence', run: linkedComplete(selected),
      persisted: true, comparisonPersisted: true, cleanupFailed: false }),
    transport(500, { ok: false, error: 'comparison-persistence', run: linkedCompared(selected),
      persisted: true, comparisonPersisted: false, cleanupFailed: false }),
    transport(409, { ok: false, error: 'comparison-lineage', run: null,
      persisted: false, comparisonPersisted: false, cleanupFailed: false }),
    transport(404, failure('not-found', null, true)),
    transport(500, { ok: false, error: 'private-error', run: null, persisted: false, cleanupFailed: false }),
    transport(500, { ok: false, error: 'rescan-outcome-unknown' }),
  ];
  for (const candidate of candidates) assert.equal(admitRescan(candidate, before, selected), null);
});

test('fails closed without evaluating accessors and handles symbols, cycles, prototypes, hostile proxies, and reentrant reflection', serial, () => {
  const before = baseline();
  const selected = intent();
  const success = (): unknown => transport(200, { ok: true, run: linkedCompared(selected) });
  let reads = 0;
  const accessorRaw = Object.defineProperty({ status: 200 }, 'body', {
    enumerable: true, get() { reads++; throw new Error('SYNTHETIC_SECRET'); },
  });
  const accessorBefore = structuredClone(before);
  Object.defineProperty(selectedFinding(accessorBefore as unknown as Record<string | number, unknown>).evidence,
    'altState', { enumerable: true, get() { reads++; throw new Error('SYNTHETIC_SECRET'); } });
  const accessorIntent = Object.defineProperty({
    runId: selected.runId, baselineRunId: selected.baselineRunId, findingId: selected.findingId,
  }, 'mode', { enumerable: true, get() { reads++; throw new Error('SYNTHETIC_SECRET'); } });
  const symbolic = success() as Record<PropertyKey, unknown>;
  symbolic[Symbol('secret')] = true;
  const cycle = success() as Record<string, unknown>;
  cycle.self = cycle;
  const inherited = Object.assign(Object.create({ inherited: true }), success());
  const hostile = new Proxy(success() as object, { getPrototypeOf() { throw new Error('SYNTHETIC_SECRET'); } });
  let reentered = false;
  const reentrant = new Proxy(success() as object, {
    ownKeys(target) {
      reentered = true;
      assert.equal(admitRescan(transport(409, failure('busy')), before, selected)?.ok, false);
      return Reflect.ownKeys(target);
    },
  });

  for (const [raw, original, submitted] of [
    [accessorRaw, before, selected], [success(), accessorBefore, selected],
    [success(), before, accessorIntent], [symbolic, before, selected], [cycle, before, selected],
    [inherited, before, selected], [hostile, before, selected],
  ] as const) {
    assert.equal(admitRescan(raw, original, submitted as RescanIntent), null);
  }
  assert.ok(admitRescan(reentrant, before, selected)?.ok);
  assert.equal(reentered, true);
  assert.equal(reads, 0);
});

test('request constructor is inert, stop is installed first, and local invalid input or unavailable callback releases without a call', serial, async () => {
  await withMemoryWindow(async () => {
    let reads = 0;
    const reflected = Object.defineProperties({}, {
      baseline: { enumerable: true, get() { reads++; return baseline(); } },
      intent: { enumerable: true, get() { reads++; return intent(); } },
      current: { enumerable: true, get() { reads++; return () => true; } },
      readCallback: { enumerable: true, get() { reads++; return () => undefined; } },
      settle: { enumerable: true, get() { reads++; return () => undefined; } },
    });
    const stopped = createRescanRequest(reflected as Parameters<typeof createRescanRequest>[0]);
    assert.equal(reads, 0);
    stopped.stop();
    stopped.start();
    assert.equal(reads, 0);

    const cases: Array<{ before: unknown; selected: unknown; callback: unknown; error: string }> = [
      { before: { malformed: true }, selected: intent(), callback: () => Promise.resolve(null), error: 'invalid-request' },
      { before: baseline(), selected: { ...intent(), extra: true }, callback: () => Promise.resolve(null), error: 'invalid-request' },
      { before: baseline(), selected: intent('run-rescan', 'run-other'), callback: () => Promise.resolve(null), error: 'invalid-request' },
      { before: baseline(), selected: intent('run-rescan', 'run-baseline', 'groq', 'missing-finding'),
        callback: () => Promise.resolve(null), error: 'invalid-request' },
      { before: baseline(), selected: intent(), callback: null, error: 'Rescan is unavailable' },
    ];
    for (const entry of cases) {
      let callbackReads = 0;
      const settlements: RescanSettlement[] = [];
      const request = createRescanRequest({
        baseline: entry.before as CompleteRun,
        intent: entry.selected as RescanIntent,
        current: () => true,
        readCallback: (): unknown => { callbackReads++; return entry.callback; },
        settle: (result: RescanSettlement): void => { settlements.push(result); },
      });
      request.start();
      await turn();
      assert.deepEqual(settlements, [{ status: 'refused', error: entry.error, cleanup: false,
        released: true, run: null, persisted: false }]);
      assert.equal(callbackReads, entry.error === 'Rescan is unavailable' ? 1 : 0);
    }
  });
});

test('request accepts arbitrary baseline Finding state and starts exactly once', serial, async () => {
  await withMemoryWindow(async clock => {
    const before = successfulReviewRun('approve', 'run-reviewed', 'local');
    const selected = intent('run-rescan-reviewed', before.runId, 'groq');
    const result = transport(200, { ok: true,
      run: linkedCompared(selected, 'populated', before.requestedUrl, before) });
    const pending = deferred<unknown>();
    const settlements: RescanSettlement[] = [];
    let reads = 0;
    let calls = 0;
    let captured: { intent: RescanIntent; signal: AbortSignal } | undefined;
    const callback: RescanCallback = (submitted: RescanIntent, signal: AbortSignal): Promise<unknown> => {
      calls++;
      captured = { intent: submitted, signal };
      return pending.promise;
    };
    const request = createRescanRequest({ baseline: before, intent: selected, current: () => true,
      readCallback: (): unknown => { reads++; return callback; },
      settle: (value: RescanSettlement): void => { settlements.push(value); } });
    request.start(); request.start(); request.start();
    assert.equal(reads, 1);
    assert.equal(calls, 1);
    assert.deepEqual(captured?.intent, selected);
    assert.equal(captured?.signal.aborted, false);
    assert.deepEqual(clock.delays(), [30000]);
    pending.resolve(result);
    await turn();
    assert.deepEqual(settlements, [{ status: 'completed',
      run: linkedCompared(selected, 'populated', before.requestedUrl, before) }]);
    request.start();
    assert.equal(calls, 1);
  });
});

test('request rechecks current ownership after baseline, intent, callback lookup, and callback invocation reflection', serial, async () => {
  await withMemoryWindow(async () => {
    for (const boundary of ['baseline', 'intent', 'callback-lookup', 'callback-call'] as const) {
      let active = true;
      let calls = 0;
      const settlements: RescanSettlement[] = [];
      const baseValue = baseline();
      const intentValue = intent();
      const reflectedBaseline = boundary === 'baseline' ? new Proxy(baseValue, {
        ownKeys(target) { active = false; return Reflect.ownKeys(target); },
      }) : baseValue;
      const reflectedIntent = boundary === 'intent' ? new Proxy(intentValue, {
        ownKeys(target) { active = false; return Reflect.ownKeys(target); },
      }) : intentValue;
      const callback: RescanCallback = (_submitted: RescanIntent, _signal: AbortSignal): Promise<unknown> => {
        calls++;
        if (boundary === 'callback-call') active = false;
        return Promise.reject(new Error('CONTROLLED_REENTRANT_REJECTION'));
      };
      const request = createRescanRequest({
        baseline: reflectedBaseline,
        intent: reflectedIntent,
        current: () => active,
        readCallback: (): unknown => {
          if (boundary === 'callback-lookup') active = false;
          return callback;
        },
        settle: (value: RescanSettlement): void => { settlements.push(value); },
      });
      request.start();
      await turn();
      assert.deepEqual(settlements, [], boundary);
      assert.equal(calls, boundary === 'callback-call' ? 1 : 0, boundary);
    }
  });
});

test('request applies the exact release matrix and preserves failed-run and persistence evidence', serial, async () => {
  await withMemoryWindow(async () => {
    const before = baseline();
    const selected = intent();
    const cases: Array<{ raw: unknown; expected: RescanSettlement }> = [];
    for (const [status, error] of [
      [400, 'invalid-request'], [404, 'not-found'], [409, 'not-eligible'],
      [500, 'invalid-run'], [500, 'stored-run-unavailable'], [500, 'read-failed'], [500, 'create-failed'],
    ] as const) {
      cases.push({ raw: transport(status, failure(error)), expected: { status: 'refused', error,
        cleanup: false, released: true, run: null, persisted: false } });
    }
    for (const [status, error] of [[409, 'busy'], [503, 'stopping'], [503, 'shutdown']] as const) {
      cases.push({ raw: transport(status, failure(error)), expected: { status: 'refused', error,
        cleanup: false, released: false, run: null, persisted: false } });
    }
    cases.push({ raw: transport(500, failure('create-failed', null, false, true)), expected: {
      status: 'refused', error: 'create-failed', cleanup: true, released: false, run: null, persisted: false,
    } });
    cases.push({ raw: transport(409, { ok: false, error: 'comparison-lineage', run: null,
      persisted: false, cleanupFailed: false }), expected: {
      status: 'refused', error: 'comparison-lineage', cleanup: false,
      released: true, run: null, persisted: false,
    } as RescanSettlement });
    for (const error of ['scan-failed', 'result-validation', 'initial-persistence'] as const) {
      for (const persisted of [false, true]) {
        const run = linkedFailure(selected);
        cases.push({ raw: transport(500, failure(error, run, persisted)), expected: {
          status: 'refused', error, cleanup: false, released: true, run, persisted,
        } });
      }
      const run = linkedFailure(selected, 'failed');
      cases.push({ raw: transport(500, failure(error, run, false, true)), expected: {
        status: 'refused', error, cleanup: true, released: false, run, persisted: false,
      } });
    }
    for (const [status, error, cleanupFailed, released] of [
      [500, 'comparison-calculation', false, true],
      [409, 'comparison-lineage', false, true],
      [500, 'comparison-persistence', false, true],
      [500, 'comparison-persistence', true, false],
      [409, 'comparison-aborted', false, true],
      [503, 'comparison-shutdown', false, false],
      [503, 'comparison-shutdown', true, false],
    ] as const) {
      const run = linkedComplete(selected);
      cases.push({ raw: transport(status, { ok: false, error, run, persisted: true,
        comparisonPersisted: false, cleanupFailed }), expected: {
        status: 'completed', run, comparisonFailure: { error, cleanupFailed, released },
      } as RescanSettlement });
    }

    for (const entry of cases) {
      const settlements: RescanSettlement[] = [];
      const request = createRescanRequest({ baseline: before, intent: selected, current: () => true,
        readCallback: (): RescanCallback => async (_submitted: RescanIntent, _signal: AbortSignal): Promise<unknown> => entry.raw,
        settle: (value: RescanSettlement): void => { settlements.push(value); } });
      request.start();
      await turn();
      assert.deepEqual(settlements, [entry.expected], JSON.stringify(entry.expected));
    }
  });
});

test('malformed, rejected, timed-out, late, stopped, and stale results never claim release or retry', serial, async () => {
  await withMemoryWindow(async clock => {
    const before = baseline();
    const selected = intent();
    for (const raw of [null, transport(500, { ok: false, error: 'rescan-outcome-unknown' }),
      transport(200, { ok: true, run: linkedCompared(intent('run-other')) })]) {
      const settlements: RescanSettlement[] = [];
      let signal: AbortSignal | undefined;
      let calls = 0;
      const request = createRescanRequest({ baseline: before, intent: selected, current: () => true,
        readCallback: (): RescanCallback => async (_submitted: RescanIntent, currentSignal: AbortSignal): Promise<unknown> => {
          calls++; signal = currentSignal; return raw;
        }, settle: (value: RescanSettlement): void => { settlements.push(value); } });
      request.start();
      await turn();
      assert.deepEqual(settlements, [{ status: 'unknown' }]);
      assert.equal(signal?.aborted, true);
      assert.equal(calls, 1);
    }

    const rejected: RescanSettlement[] = [];
    let rejectedCalls = 0;
    let rejectedSignal: AbortSignal | undefined;
    const rejectedRequest = createRescanRequest({ baseline: before, intent: selected, current: () => true,
      readCallback: (): RescanCallback => (_submitted: RescanIntent, signal: AbortSignal): Promise<unknown> => {
        rejectedCalls++; rejectedSignal = signal; return Promise.reject(new Error('CONTROLLED_TRANSPORT_REJECTION'));
      }, settle: (value: RescanSettlement): void => { rejected.push(value); } });
    rejectedRequest.start();
    await turn();
    assert.deepEqual(rejected, [{ status: 'unknown' }]);
    assert.equal(rejectedSignal?.aborted, true);
    assert.equal(rejectedCalls, 1);

    const late = deferred<unknown>();
    const timed: RescanSettlement[] = [];
    let timedSignal: AbortSignal | undefined;
    let timedCalls = 0;
    const timedRequest = createRescanRequest({ baseline: before, intent: selected, current: () => true,
      readCallback: (): RescanCallback => (_submitted: RescanIntent, signal: AbortSignal): Promise<unknown> => {
        timedCalls++; timedSignal = signal; return late.promise;
      }, settle: (value: RescanSettlement): void => { timed.push(value); } });
    timedRequest.start();
    clock.now(30000);
    clock.fire();
    assert.deepEqual(timed, [{ status: 'unknown' }]);
    assert.equal(timedSignal?.aborted, true);
    late.resolve(transport(200, { ok: true, run: linkedCompared(selected) }));
    await turn();
    assert.deepEqual(timed, [{ status: 'unknown' }]);
    assert.equal(timedCalls, 1);

    const stoppedCompletion = deferred<unknown>();
    const stopped: RescanSettlement[] = [];
    let stoppedSignal: AbortSignal | undefined;
    const stoppedRequest = createRescanRequest({ baseline: before, intent: selected, current: () => true,
      readCallback: (): RescanCallback => (_submitted: RescanIntent, signal: AbortSignal): Promise<unknown> => {
        stoppedSignal = signal; return stoppedCompletion.promise;
      }, settle: (value: RescanSettlement): void => { stopped.push(value); } });
    stoppedRequest.start();
    stoppedRequest.stop();
    assert.equal(stoppedSignal?.aborted, true);
    stoppedCompletion.reject(new Error('CONTROLLED_LATE_REJECTION'));
    await turn();
    assert.deepEqual(stopped, []);
  });
});

test('monotonic expiry during hostile snapshot prevents dispatch and settles unknown once', serial, async () => {
  await withMemoryWindow(async clock => {
    const before = baseline();
    const rawIntent = intent();
    const reflected = new Proxy(rawIntent, {
      ownKeys(target) { clock.now(30001); return Reflect.ownKeys(target); },
    });
    let calls = 0;
    const settlements: RescanSettlement[] = [];
    const request = createRescanRequest({ baseline: before, intent: reflected, current: () => true,
      readCallback: (): RescanCallback => async (_submitted: RescanIntent, _signal: AbortSignal): Promise<unknown> => {
        calls++; return transport(200, { ok: true, run: linkedCompared(rawIntent) });
      }, settle: (value: RescanSettlement): void => { settlements.push(value); } });
    request.start();
    await turn();
    assert.deepEqual(settlements, [{ status: 'unknown' }]);
    assert.equal(calls, 0);
    assert.deepEqual(clock.delays(), [30000]);
  });
});

test('transport performs one same-origin four-field JSON POST and returns status/body without retry or readback', serial, async t => {
  const selected = intent();
  const controller = new AbortController();
  const responseBody = failure('busy');
  const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    calls.push({ input, init });
    return new Response(JSON.stringify(responseBody), { status: 409, headers: { 'Content-Type': 'application/json' } });
  });
  const withExtra = { ...selected, arbitraryUrl: 'https://secret.example/', provider: 'forbidden', extra: true };
  assert.deepEqual(await postRescan(withExtra as RescanIntent, controller.signal), { status: 409, body: responseBody });
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.input, '/api/rescans');
  assert.deepEqual(calls[0]?.init, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(selected), signal: controller.signal,
  });

  t.mock.restoreAll();
  let rejectedCalls = 0;
  t.mock.method(globalThis, 'fetch', async (_input: RequestInfo | URL, _init?: RequestInit): Promise<Response> => {
    rejectedCalls++;
    throw new Error('CONTROLLED_FETCH_REJECTION');
  });
  await assert.rejects(postRescan(selected, controller.signal), /CONTROLLED_FETCH_REJECTION/);
  assert.equal(rejectedCalls, 1);
});

test('request presentation and settlement exports retain the frozen closed shapes', serial, () => {
  const pending: RescanPresentation = { status: 'pending' };
  const unknown: RescanPresentation = { status: 'unknown' };
  const refused: RescanPresentation = { status: 'refused', error: 'busy', cleanup: false,
    released: false, run: null, persisted: false };
  const completed: RescanSettlement = { status: 'completed', run: linkedCompared() };
  const comparisonFailed: RescanSettlement = { status: 'completed', run: linkedComplete(),
    comparisonFailure: { error: 'comparison-persistence', cleanupFailed: true, released: false } } as RescanSettlement;
  assert.deepEqual([pending, unknown, refused, completed, comparisonFailed].map(value => Object.keys(value).sort()), [
    ['status'], ['status'], ['cleanup', 'error', 'persisted', 'released', 'run', 'status'], ['run', 'status'],
    ['comparisonFailure', 'run', 'status'],
  ]);
  assert.deepEqual(Object.keys((comparisonFailed as unknown as { comparisonFailure: object }).comparisonFailure).sort(),
    ['cleanupFailed', 'error', 'released']);
});
