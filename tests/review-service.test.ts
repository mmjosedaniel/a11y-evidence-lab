import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { buildFindingAnalysis } from '../src/server/domain/finding-analysis.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';
import type { CompletedRun } from '../src/server/persistence/run-repository.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, ServiceOptions } from '../src/server/service.ts';
import { classifyGuidanceSupport } from '../src/server/retrieval/support-policy.ts';
import { completedRun } from './helpers/m102-run-fixture.ts';
import { runningRun } from './helpers/m102-run-fixture.ts';
import {
  assessedSupportedRetrievalRun,
  evidenceAbstainedRun,
  expectedRetrievalResult,
  retrievalFinishedAt,
  retrievalStartedAt,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';
import {
  failedGenerationRun,
  generationAdapterHarness,
  generationFixture,
  proposalGenerationRun,
  type GenerationProfile,
} from './helpers/m302-generation-fixture.ts';
import { reviewDecidedAt, reviewedRun, reviewInput, type ReviewAction } from './helpers/m401-review-fixture.ts';
import { withReviewSandbox, type ReviewSandbox } from './helpers/m401-review-sandbox.ts';

const serial = { concurrency: false };
type ReviewOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: string; run: CompletedRun | null; persisted: false; cleanupFailed: boolean };
type ReviewService = LocalService & { reviewFinding(input: unknown): Promise<ReviewOutcome> };

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(yes => { resolve = yes; });
  return { promise, resolve };
}

function pendingForProfile(profile: GenerationProfile, runId: string): CompletedRun {
  const run = proposalGenerationRun(runId);
  if (profile !== 'image-alt') {
    const current = selectedFinding(run);
    const fixture = generationFixture(profile);
    for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence'] as const) {
      current[key] = structuredClone(fixture.finding[key]);
    }
    const support = classifyGuidanceSupport(fixture.finding, fixture.retrieval);
    assert.ok(support.ok);
    const analysis = buildFindingAnalysis(fixture.finding, retrievalStartedAt, retrievalFinishedAt, support.value);
    current.retrieval = {
      status: 'completed',
      startedAt: retrievalStartedAt,
      finishedAt: retrievalFinishedAt,
      result: fixture.retrieval,
      support: support.value,
    };
    current.analysis = analysis.analysis;
    current.result = fixture.proposal;
    const coverage = (run.scan as Record<string, unknown>).coverage as Record<string, Record<string, unknown>>;
    coverage['image-alt']!.violations = 1;
    coverage[profile] = { violations: 1, incomplete: null, passes: null, inapplicable: null };
  }
  const validated = validateRun(run);
  assert.ok(validated.ok, `Synthetic ${profile} pending run must be valid`);
  assert.equal(validated.value.status, 'completed');
  if (validated.value.status !== 'completed') throw new Error('Expected completed pending run');
  return validated.value;
}

function writeSyntheticRecord(root: string, run: PageAnalysisRun): void {
  const directory = path.join(root, run.runId);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'run.json'), JSON.stringify(run, null, 2) + '\n', { flag: 'wx' });
}

function writeSyntheticRun(root: string, run: CompletedRun): void {
  writeSyntheticRecord(root, run);
}

function completedFixture(runId: string): CompletedRun {
  const validated = validateRun(completedRun(runId));
  assert.ok(validated.ok);
  assert.equal(validated.value.status, 'completed');
  if (validated.value.status !== 'completed') throw new Error('Expected completed fixture');
  return validated.value;
}

function disk(root: string, runId: string): CompletedRun {
  const parsed: unknown = JSON.parse(fs.readFileSync(path.join(root, runId, 'run.json'), 'utf8'));
  const validated = validateRun(parsed);
  assert.ok(validated.ok);
  assert.equal(validated.value.status, 'completed');
  if (validated.value.status !== 'completed') throw new Error('Expected completed durable run');
  return validated.value;
}

async function start(sandbox: ReviewSandbox, options: Partial<ServiceOptions> = {}): Promise<ReviewService> {
  const result = await startLocalService({
    runRoot: sandbox.runs,
    applicationRevision: 'b'.repeat(40),
    port: 0,
    ...options,
  });
  assert.ok(result.ok, JSON.stringify(result));
  sandbox.services.push(result.service);
  return result.service as ReviewService;
}

function request(runId: string, action: ReviewAction, profile: GenerationProfile = 'image-alt'): unknown {
  return { runId, findingId: 'finding-0', review: reviewInput(action, profile) };
}

function reflected<T extends object>(target: T, effect: () => void, throws: boolean, trap: 'prototype' | 'keys' = 'prototype'): T {
  return new Proxy(target, {
    getPrototypeOf(value) {
      if (trap === 'prototype') {
        effect();
        if (throws) throw new Error('CALLER_SECRET');
      }
      return Reflect.getPrototypeOf(value);
    },
    ownKeys(value) {
      if (trap === 'keys') {
        effect();
        if (throws) throw new Error('CALLER_SECRET');
      }
      return Reflect.ownKeys(value);
    },
  });
}

function rejected(outcome: ReviewOutcome, error: string): Extract<ReviewOutcome, { ok: false }> {
  assert.equal(outcome.ok, false);
  if (outcome.ok) throw new Error('Expected review rejection');
  assert.equal(outcome.error, error);
  assert.equal(outcome.persisted, false);
  return outcome;
}

test('reviewFinding persists approve, edit-and-accept and reject for every supported profile', serial, async t => {
  await withReviewSandbox('service', async box => {
    const profiles = ['image-alt', 'label', 'color-contrast'] as const satisfies readonly GenerationProfile[];
    const actions = ['approve', 'edit-and-accept', 'reject'] as const satisfies readonly ReviewAction[];
    const originals = new Map<string, CompletedRun>();
    for (const profile of profiles) {
      for (const action of actions) {
        const runId = `${profile}-${action}`;
        const pending = pendingForProfile(profile, runId);
        originals.set(runId, pending);
        writeSyntheticRun(box.runs, pending);
      }
    }
    t.mock.method(Date, 'now', () => Date.parse(reviewDecidedAt));
    const service = await start(box);
    try {
      for (const profile of profiles) {
        for (const action of actions) {
          const runId = `${profile}-${action}`;
          const outcome = await service.reviewFinding(request(runId, action, profile));
          assert.ok(outcome.ok, JSON.stringify(outcome));
          const durable = disk(box.runs, runId);
          assert.deepEqual(outcome.run, durable);
          const finding = selectedFinding(durable as never);
          assert.equal(finding.state, ({ approve: 'accepted', 'edit-and-accept': 'edited-and-accepted', reject: 'rejected' } as const)[action]);
          assert.equal((finding.review as Record<string, unknown>).action, action);
          assert.equal((finding.review as Record<string, unknown>).decidedAt, reviewDecidedAt);
          assert.equal('supportConfirmed' in (finding.review as Record<string, unknown>), false);
          assert.equal('editedProposal' in (finding.review as Record<string, unknown>), action === 'edit-and-accept');
          const original = selectedFinding(originals.get(runId)! as never);
          assert.deepEqual(finding.result, original.result);
          assert.deepEqual(finding.retrieval, original.retrieval);
          assert.deepEqual(finding.analysis, original.analysis);
          assert.deepEqual(finding.generation, original.generation);
          assert.deepEqual(durable.scan.findings[1], originals.get(runId)!.scan.findings[1]);
        }
      }
    } finally {
      t.mock.restoreAll();
    }
  });
});

test('reviewFinding blocks invalid support and judgment for every profile without changing pending bytes', serial, async () => {
  await withReviewSandbox('service', async box => {
    const profiles = ['image-alt', 'label', 'color-contrast'] as const satisfies readonly GenerationProfile[];
    for (const profile of profiles) {
      const runId = `review-gates-${profile}`;
      const pending = pendingForProfile(profile, runId);
      writeSyntheticRun(box.runs, pending);
    }
    const service = await start(box);
    for (const profile of profiles) {
      const runId = `review-gates-${profile}`;
      const pending = disk(box.runs, runId);
      const before = fs.readFileSync(path.join(box.runs, runId, 'run.json'));
      const invalidReviews = [
        { ...reviewInput('approve', profile), supportConfirmed: false },
        { ...reviewInput('approve', profile), blockingJudgment: { status: 'unresolved' } },
        { ...reviewInput('approve', profile), blockingJudgment: { status: 'contradicts-proposal' } },
        { ...reviewInput('approve', profile), blockingJudgment: { status: 'not-applicable' } },
        { ...reviewInput('edit-and-accept', profile), supportConfirmed: false },
        { ...reviewInput('edit-and-accept', profile), blockingJudgment: { status: 'unresolved' } },
        { ...reviewInput('edit-and-accept', profile), blockingJudgment: { status: 'contradicts-proposal' } },
        { ...reviewInput('edit-and-accept', profile), editedProposal: undefined },
      ];
      for (const review of invalidReviews) {
        const failure = rejected(await service.reviewFinding({ runId, findingId: 'finding-0', review }), 'review-validation');
        assert.deepEqual(failure.run, pending);
        assert.equal(failure.cleanupFailed, false);
        assert.deepEqual(fs.readFileSync(path.join(box.runs, runId, 'run.json')), before);
      }
    }
  });
});

test('reviewFinding rejects native, active, abstained, failed, noncompleted, wrong-ID, final and active-sibling states', serial, async () => {
  await withReviewSandbox('service', async box => {
    const native = completedFixture('native-review');
    const activeResult = validateRun(assessedSupportedRetrievalRun('active-review'));
    const abstainedResult = validateRun(evidenceAbstainedRun('abstained-review'));
    const failedResult = validateRun(failedGenerationRun('missing-prerequisite', { runId: 'failed-review' }));
    assert.ok(activeResult.ok && activeResult.value.status === 'completed');
    assert.ok(abstainedResult.ok && abstainedResult.value.status === 'completed');
    assert.ok(failedResult.ok && failedResult.value.status === 'completed');
    const finalResult = validateRun(reviewedRun('approve'));
    assert.ok(finalResult.ok && finalResult.value.status === 'completed');
    const final = structuredClone(finalResult.value) as CompletedRun;
    Object.defineProperty(final, 'runId', { value: 'final-review', enumerable: true, writable: true, configurable: true });
    const finalValidated = validateRun(final);
    assert.ok(finalValidated.ok && finalValidated.value.status === 'completed');
    const activeSibling = structuredClone(pendingForProfile('image-alt', 'active-sibling-review'));
    Object.assign(activeSibling.scan.findings[1] as unknown as Record<string, unknown>, {
      state: 'active', retrieval: { status: 'running', startedAt: retrievalStartedAt },
    });
    const siblingResult = validateRun(activeSibling);
    assert.ok(siblingResult.ok && siblingResult.value.status === 'completed');
    const running = runningRun('running-review');
    const runningResult = validateRun(running);
    assert.ok(runningResult.ok);
    for (const run of [native, activeResult.value, abstainedResult.value, failedResult.value,
      finalValidated.value, siblingResult.value, runningResult.value]) writeSyntheticRecord(box.runs, run);
    const service = await start(box);
    for (const runId of ['native-review', 'active-review', 'abstained-review', 'failed-review',
      'final-review', 'running-review']) {
      rejected(await service.reviewFinding(request(runId, 'reject')), 'not-eligible');
    }
    rejected(await service.reviewFinding(request('active-sibling-review', 'reject')), 'workflow-active');
    rejected(await service.reviewFinding({ runId: 'missing-run', findingId: 'finding-0', review: reviewInput('reject') }), 'not-found');
    rejected(await service.reviewFinding({ runId: 'native-review', findingId: 'missing-finding', review: reviewInput('reject') }), 'not-found');
    rejected(await service.reviewFinding({ runId: '../unsafe', findingId: 'finding-0', review: reviewInput('reject') }), 'invalid-request');
  });
});

test('reviewFinding reserves before root and body reflection and direct stop wins over successful or throwing traps', serial, async () => {
  for (const boundary of ['root', 'body'] as const) {
    for (const throws of [false, true]) {
      await withReviewSandbox('service', async box => {
        const runId = `reflection-${boundary}-${throws}`;
        writeSyntheticRun(box.runs, pendingForProfile('image-alt', runId));
        const service = await start(box);
        let reentrant: Promise<ReviewOutcome> | undefined;
        let stop: Promise<unknown> | undefined;
        const effect = () => {
          reentrant = service.reviewFinding(request(runId, 'reject'));
          stop = service.stop();
        };
        const body = boundary === 'body'
          ? reflected(reviewInput('approve'), effect, throws)
          : reviewInput('approve');
        const plain = { runId, findingId: 'finding-0', review: body };
        const input = boundary === 'root' ? reflected(plain, effect, throws) : plain;
        const outcome = await service.reviewFinding(input);
        rejected(outcome, 'shutdown');
        assert.ok(reentrant);
        rejected(await reentrant, 'busy');
        assert.ok(stop);
        assert.deepEqual(await stop, { ok: true, status: 'stopped' });
        assert.equal(selectedFinding(disk(box.runs, runId) as never).state, 'proposal-pending-review');
      });
    }
  }
});

test('reviewFinding rejects root and review accessors without invoking them', serial, async () => {
  for (const boundary of ['root', 'body'] as const) {
    await withReviewSandbox('service', async box => {
      const runId = `accessor-${boundary}`;
      writeSyntheticRun(box.runs, pendingForProfile('image-alt', runId));
      const service = await start(box);
      let calls = 0;
      const root = boundary === 'root'
        ? { runId, findingId: 'finding-0', get review() { calls++; return reviewInput('approve'); } }
        : { runId, findingId: 'finding-0', review: {
            get action() { calls++; return 'approve'; },
            supportConfirmed: true,
            blockingJudgment: { status: 'supports-proposal' },
          } };
      rejected(await service.reviewFinding(root), boundary === 'root' ? 'invalid-request' : 'review-validation');
      assert.equal(calls, 0);
    });
  }
});

test('reviewFinding completes synchronously through commit before a reflection microtask can observe disk', serial, async () => {
  await withReviewSandbox('service', async box => {
    const runId = 'microtask-order';
    writeSyntheticRun(box.runs, pendingForProfile('image-alt', runId));
    const service = await start(box);
    let observedState = '';
    const input = {
      runId,
      findingId: 'finding-0',
      review: reflected(reviewInput('approve'), () => {
        queueMicrotask(() => { observedState = String(selectedFinding(disk(box.runs, runId) as never).state); });
      }, false, 'keys'),
    };
    const outcome = await service.reviewFinding(input);
    assert.ok(outcome.ok, JSON.stringify(outcome));
    await Promise.resolve();
    assert.equal(observedState, 'accepted');
  });
});

test('reviewFinding rejects busy, stopping and retained workflow ownership before inspecting review input', serial, async () => {
  await withReviewSandbox('service', async box => {
    const pendingId = 'pending-review';
    const retrievalId = 'retained-retrieval';
    writeSyntheticRun(box.runs, pendingForProfile('image-alt', pendingId));
    writeSyntheticRun(box.runs, completedFixture(retrievalId));
    const service = await start(box);
    const release = deferred<ReturnType<typeof expectedRetrievalResult>>();
    box.releases.push(() => release.resolve(expectedRetrievalResult()));
    const active = service.retrieveFinding({ runId: retrievalId, findingId: 'finding-0' }, async () => release.promise);
    let reflectedInput = false;
    const guarded = reflected({ runId: pendingId, findingId: 'finding-0', review: reviewInput('approve') },
      () => { reflectedInput = true; }, false);
    rejected(await service.reviewFinding(guarded), 'busy');
    assert.equal(reflectedInput, false);
    release.resolve(expectedRetrievalResult());
    const retrieval = await active;
    assert.ok(retrieval.ok, JSON.stringify(retrieval));
    reflectedInput = false;
    rejected(await service.reviewFinding(guarded), 'workflow-active');
    assert.equal(reflectedInput, false);
    const stop = service.stop();
    rejected(await service.reviewFinding(guarded), 'stopping');
    assert.equal(reflectedInput, false);
    assert.deepEqual(await stop, { ok: true, status: 'stopped' });
  });
});

test('reviewFinding maps invalid, unavailable and failed durable reads without reflecting rejected content', serial, async t => {
  await withReviewSandbox('service', async box => {
    const corruptId = 'corrupt-review';
    const mismatchId = 'mismatch-review';
    const failedReadId = 'failed-read-review';
    for (const runId of [corruptId, mismatchId, failedReadId]) fs.mkdirSync(path.join(box.runs, runId), { recursive: true });
    fs.writeFileSync(path.join(box.runs, corruptId, 'run.json'), '{invalid', { flag: 'wx' });
    fs.writeFileSync(path.join(box.runs, mismatchId, 'run.json'),
      JSON.stringify(pendingForProfile('image-alt', 'different-id'), null, 2) + '\n', { flag: 'wx' });
    fs.writeFileSync(path.join(box.runs, failedReadId, 'run.json'),
      JSON.stringify(pendingForProfile('image-alt', failedReadId), null, 2) + '\n', { flag: 'wx' });
    const service = await start(box);
    assert.equal(rejected(await service.reviewFinding(request(corruptId, 'reject')), 'invalid-run').run, null);
    assert.equal(rejected(await service.reviewFinding(request(mismatchId, 'reject')), 'stored-run-unavailable').run, null);
    const read = fs.readFileSync;
    t.mock.method(fs, 'readFileSync', (name: fs.PathOrFileDescriptor, ...args: unknown[]) => {
      if (String(name).endsWith(path.join(failedReadId, 'run.json'))) throw new Error('CONTROLLED_READ_SECRET');
      return Reflect.apply(read, fs, [name, ...args]) as never;
    });
    try {
      assert.equal(rejected(await service.reviewFinding(request(failedReadId, 'reject')), 'read-failed').run, null);
    } finally {
      t.mock.restoreAll();
    }
  });
});

test('retained retrieval and generation owners block review before reflection without provider dispatch', serial, async t => {
  await withReviewSandbox('service', async box => {
    const pendingId = 'owner-pending';
    const retrievalOwnerId = 'retrieval-owner';
    writeSyntheticRun(box.runs, pendingForProfile('image-alt', pendingId));
    writeSyntheticRun(box.runs, completedFixture(retrievalOwnerId));
    const service = await start(box);

    const retained = await service.retrieveFinding(
      { runId: retrievalOwnerId, findingId: 'finding-0' },
      async () => expectedRetrievalResult(),
    );
    assert.ok(retained.ok, JSON.stringify(retained));
    let reflectedInput = false;
    const guarded = reflected({ runId: pendingId, findingId: 'finding-0', review: reviewInput('approve') },
      () => { reflectedInput = true; }, false);
    rejected(await service.reviewFinding(guarded), 'workflow-active');
    assert.equal(reflectedInput, false);

    const harness = generationAdapterHarness();
    t.mock.method(fs, 'writeSync', () => { throw new Error('CONTROLLED_INITIAL_GENERATION_WRITE'); });
    let generation: Awaited<ReturnType<LocalService['generateFinding']>> | undefined;
    try {
      generation = await service.generateFinding({ runId: retrievalOwnerId, findingId: 'finding-0' }, harness.adapter);
    } finally {
      t.mock.restoreAll();
    }
    assert.ok(generation);
    assert.equal(generation.ok, false);
    if (!generation.ok) {
      assert.equal(generation.error, 'generation-persistence');
      assert.equal(generation.cleanupFailed, false);
    }
    assert.deepEqual(harness.calls, { prepare: 0, dispatch: 0, transport: 0 });
    reflectedInput = false;
    rejected(await service.reviewFinding(guarded), 'workflow-active');
    assert.equal(reflectedInput, false);
    assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
  });
});

test('reviewFinding rejects every nonfinite clock, clamps an older finite clock and rejects later action', serial, async t => {
  await withReviewSandbox('service', async box => {
    const runId = 'clock-and-repeat';
    const pending = pendingForProfile('image-alt', runId);
    writeSyntheticRun(box.runs, pending);
    const service = await start(box);
    for (const invalid of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      t.mock.method(Date, 'now', () => invalid);
      try {
        const invalidClock = rejected(await service.reviewFinding(request(runId, 'approve')), 'review-validation');
        assert.deepEqual(invalidClock.run, pending);
      } finally {
        t.mock.restoreAll();
      }
    }
    t.mock.method(Date, 'now', () => Date.parse('2026-08-30T09:00:00.000Z'));
    try {
      const accepted = await service.reviewFinding(request(runId, 'approve'));
      assert.ok(accepted.ok, JSON.stringify(accepted));
    } finally {
      t.mock.restoreAll();
    }
    const final = disk(box.runs, runId);
    assert.equal((selectedFinding(final as never).review as Record<string, unknown>).decidedAt,
      '2026-08-30T10:00:06.000Z');
    const repeated = rejected(await service.reviewFinding(request(runId, 'reject')), 'not-eligible');
    assert.deepEqual(repeated.run, final);
    assert.deepEqual(disk(box.runs, runId), final);
  });
});

test('reviewFinding rechecks shutdown after a returning or throwing clock', serial, async t => {
  for (const throws of [false, true]) {
    await withReviewSandbox('service', async box => {
      const runId = `clock-stop-${throws}`;
      writeSyntheticRun(box.runs, pendingForProfile('image-alt', runId));
      const service = await start(box);
      let stop: Promise<unknown> | undefined;
      t.mock.method(Date, 'now', () => {
        stop = service.stop();
        if (throws) throw new Error('CLOCK_SECRET');
        return Date.parse(reviewDecidedAt);
      });
      try {
        rejected(await service.reviewFinding(request(runId, 'approve')), 'shutdown');
      } finally {
        t.mock.restoreAll();
      }
      assert.ok(stop);
      assert.deepEqual(await stop, { ok: true, status: 'stopped' });
      assert.equal(selectedFinding(disk(box.runs, runId) as never).state, 'proposal-pending-review');
    });
  }
});

test('reviewFinding reports a stale expected-current transition with no attempted candidate as durable', serial, async () => {
  await withReviewSandbox('service', async box => {
    const runId = 'stale-review';
    const pending = pendingForProfile('image-alt', runId);
    writeSyntheticRun(box.runs, pending);
    const stale = structuredClone(pending);
    Object.defineProperty(stale, 'applicationRevision', {
      value: 'c'.repeat(40), enumerable: true, writable: true, configurable: true,
    });
    const staleResult = validateRun(stale);
    assert.ok(staleResult.ok && staleResult.value.status === 'completed');
    const service = await start(box);
    const review = reflected(reviewInput('approve'), () => {
      fs.writeFileSync(path.join(box.runs, runId, 'run.json'), JSON.stringify(staleResult.value, null, 2) + '\n');
    }, false);
    const outcome = rejected(await service.reviewFinding({ runId, findingId: 'finding-0', review }), 'review-persistence');
    assert.equal(outcome.run, null);
    assert.deepEqual(disk(box.runs, runId), staleResult.value);
  });
});

for (const phase of ['write', 'close'] as const) {
  test(`reviewFinding ${phase} failure reports review-persistence and preserves last valid readback`, serial, async t => {
    await withReviewSandbox('service', async box => {
      const runId = `persistence-${phase}`;
      const pending = pendingForProfile('image-alt', runId);
      writeSyntheticRun(box.runs, pending);
      const service = await start(box);
      const original = { open: fs.openSync, close: fs.closeSync };
      let descriptor = -1;
      let staged = '';
      t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
        const fd = original.open(name, flags, mode);
        if (String(name).includes('run.json.tmp-')) { descriptor = fd; staged = String(name); }
        return fd;
      });
      if (phase === 'write') t.mock.method(fs, 'writeSync', () => { throw new Error('CONTROLLED_WRITE'); });
      if (phase === 'close') t.mock.method(fs, 'closeSync', (fd: number) => {
        if (fd === descriptor) throw new Error('CONTROLLED_CLOSE');
        original.close(fd);
      });
      let raw: ReviewOutcome | undefined;
      try {
        raw = await service.reviewFinding(request(runId, 'approve'));
      } finally {
        t.mock.restoreAll();
        if (phase === 'close' && descriptor >= 0) {
          try {
            original.close(descriptor);
            if (staged && fs.existsSync(staged)) fs.unlinkSync(staged);
          } catch (error) {
            box.preserve = true;
            throw new Error(`Controlled service fault cleanup failed; retained review sandbox: ${box.root}`, { cause: error });
          }
        }
      }
      assert.ok(raw);
      const outcome = rejected(raw, 'review-persistence');
      assert.deepEqual(outcome.run, pending);
      assert.equal(outcome.cleanupFailed, phase === 'close');
      assert.deepEqual(disk(box.runs, runId), pending);
      if (phase === 'close') {
        rejected(await service.reviewFinding(request(runId, 'reject')), 'stopping');
        assert.deepEqual(await service.stop(), { ok: false, error: 'stop-failed' });
      }
    });
  });
}

test('shutdown requested during the trusted rename cannot reverse committed review success', serial, async t => {
  await withReviewSandbox('service', async box => {
    const runId = 'commit-shutdown';
    writeSyntheticRun(box.runs, pendingForProfile('image-alt', runId));
    const service = await start(box);
    const rename = fs.renameSync;
    let stop: Promise<unknown> | undefined;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      rename(from, to);
      stop = service.stop();
    });
    let outcome: ReviewOutcome | undefined;
    try {
      outcome = await service.reviewFinding(request(runId, 'approve'));
      assert.ok(outcome.ok, JSON.stringify(outcome));
    } finally {
      t.mock.restoreAll();
    }
    assert.equal(selectedFinding(disk(box.runs, runId) as never).state, 'accepted');
    assert.ok(stop);
    assert.deepEqual(await stop, { ok: true, status: 'stopped' });
  });
});

test('a clean service restart reviews a durable pending proposal without a generation owner', serial, async t => {
  await withReviewSandbox('service', async box => {
    const runId = 'restart-review';
    writeSyntheticRun(box.runs, pendingForProfile('image-alt', runId));
    const first = await start(box);
    assert.deepEqual(await first.stop(), { ok: true, status: 'stopped' });
    t.mock.method(Date, 'now', () => Date.parse(reviewDecidedAt));
    const restarted = await start(box);
    try {
      const outcome = await restarted.reviewFinding(request(runId, 'reject'));
      assert.ok(outcome.ok, JSON.stringify(outcome));
    } finally {
      t.mock.restoreAll();
    }
    assert.equal(selectedFinding(disk(box.runs, runId) as never).state, 'rejected');
  });
});
