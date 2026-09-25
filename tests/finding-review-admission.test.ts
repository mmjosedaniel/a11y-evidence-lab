import assert from 'node:assert/strict';
import test from 'node:test';
import { admitReview } from '../src/client/review/finding-review-admission.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { selectedFinding, retrievalStartedAt } from './helpers/m202-retrieval-service-fixture.ts';
import { durableReview, reviewInput, type ReviewAction } from './helpers/m401-review-fixture.ts';
import {
  pendingReviewRun,
  reviewFailure,
  reviewIntent,
  reviewTransport,
  successfulReviewRun,
} from './helpers/m402-review-fixture.ts';

const serial = { concurrency: false };

function valid<T>(run: T): T {
  assert.ok(validateRun(run).ok, 'Mutation witness must remain an independently valid run');
  return run;
}

function selected(run: unknown): Record<string, unknown> {
  return selectedFinding(run as Record<string | number, unknown>);
}

function success(action: ReviewAction = 'approve', runId = 'run-01', mode: 'local' | 'groq' = 'local') {
  return reviewTransport(200, { ok: true, run: successfulReviewRun(action, runId, mode) });
}

test('admits each exact selected review transition and returns detached caller-independent truth', serial, () => {
  for (const action of ['approve', 'edit-and-accept', 'reject'] as const) {
    const baseline = structuredClone(pendingReviewRun());
    const intent = reviewIntent(action);
    if (action !== 'reject') intent.review.note = '  Reviewer note remains exact.  ';
    const returned = structuredClone(successfulReviewRun(action));
    if (action !== 'reject') (selected(returned).review as Record<string, unknown>).note = intent.review.note;
    const reparsed = validateRun(returned);
    assert.ok(reparsed.ok && reparsed.value.status === 'completed');
    const raw = reviewTransport(200, { ok: true, run: returned });
    const expected = structuredClone(raw.body);
    const admitted = admitReview(raw, baseline, intent);
    assert.deepEqual(admitted, expected, action);

    selected((raw.body as { run: unknown }).run).locator = { value: ':root > changed' };
    selected(baseline).locator = { value: ':root > changed-before' };
    intent.runId = 'changed-intent';
    assert.deepEqual(admitted, expected, `${action} admission must be detached`);
  }
});

test('requires a valid completed pending baseline, matching intent and no active Finding', serial, () => {
  const baseline = pendingReviewRun();
  assert.equal(admitReview(success(), baseline, reviewIntent('approve', 'foreign-run')), null);
  assert.equal(admitReview(success(), baseline, { ...reviewIntent(), findingId: 'finding-1' }), null);
  assert.equal(admitReview(success('approve', 'foreign-run'), baseline, reviewIntent()), null);
  assert.equal(admitReview(success('approve', 'run-01', 'groq'), baseline, reviewIntent()), null);
  assert.equal(admitReview(success(), successfulReviewRun('approve'), reviewIntent()), null);

  const activeSibling = structuredClone(baseline);
  Object.assign(selectedFinding(activeSibling as unknown as Record<string | number, unknown>, 1), {
    state: 'active',
    retrieval: { status: 'running', startedAt: retrievalStartedAt },
  });
  assert.ok(validateRun(activeSibling).ok);
  assert.equal(admitReview(success(), activeSibling, reviewIntent()), null);
  const activeSuccess = structuredClone(activeSibling);
  Object.assign(selected(activeSuccess), { state: 'accepted', review: durableReview('approve') });
  assert.ok(validateRun(activeSuccess).ok, 'A final selected Finding may coexist with an active sibling structurally');
  assert.equal(admitReview(reviewTransport(200, { ok: true, run: activeSuccess }), activeSibling, reviewIntent()), null);
});

test('rejects a success that changes any context outside the exact submitted terminal decision', serial, () => {
  const baseline = pendingReviewRun();
  const candidates: unknown[] = [];

  const parent = structuredClone(successfulReviewRun('approve'));
  Object.defineProperty(parent, 'applicationRevision', {
    value: 'c'.repeat(40), enumerable: true, writable: true, configurable: true,
  });
  candidates.push(reviewTransport(200, { ok: true, run: valid(parent) }));

  const sibling = structuredClone(successfulReviewRun('approve'));
  selectedFinding(sibling as unknown as Record<string | number, unknown>, 1).locator = {
    value: ':root > :nth-child(9)',
  };
  candidates.push(reviewTransport(200, { ok: true, run: valid(sibling) }));

  const reordered = structuredClone(successfulReviewRun('approve'));
  ((reordered.scan as unknown as Record<string, unknown>).findings as unknown[]).reverse();
  candidates.push(reviewTransport(200, { ok: true, run: valid(reordered) }));

  const original = structuredClone(successfulReviewRun('approve'));
  (selected(original).result as Record<string, unknown>).uncertainty = 'Changed but independently valid uncertainty.';
  candidates.push(reviewTransport(200, { ok: true, run: valid(original) }));

  const provenance = structuredClone(successfulReviewRun('approve'));
  const generation = selected(provenance).generation as Record<string, unknown>;
  generation.startedAt = '2026-08-30T10:00:04.500Z';
  candidates.push(reviewTransport(200, { ok: true, run: valid(provenance) }));

  const retrieval = structuredClone(successfulReviewRun('approve'));
  const passages = (((selected(retrieval).retrieval as Record<string, unknown>).result as Record<string, unknown>)
    .passages as Array<Record<string, unknown>>);
  passages[0]!.score = 0.95;
  candidates.push(reviewTransport(200, { ok: true, run: valid(retrieval) }));

  for (const candidate of candidates) {
    assert.equal(admitReview(candidate, baseline, reviewIntent()), null);
  }
});

test('binds action, complete edit, note presence and whitespace, judgment, reference order and decision time', serial, () => {
  const baseline = pendingReviewRun();
  assert.equal(admitReview(success('reject'), baseline, reviewIntent('approve')), null);
  assert.equal(admitReview(success('approve'), baseline, reviewIntent('reject')), null);

  const noteIntent = reviewIntent('approve');
  noteIntent.review.note = '  exact note  ';
  assert.equal(admitReview(success('approve'), baseline, noteIntent), null);

  const judgmentIntent = reviewIntent('approve');
  judgmentIntent.review.blockingJudgment = { status: 'not-applicable', reason: '  exact reason  ' };
  assert.equal(admitReview(success('approve'), baseline, judgmentIntent), null);
  const invalidIntent = reviewIntent('approve');
  invalidIntent.review.supportConfirmed = false;
  assert.equal(admitReview(success('approve'), baseline, invalidIntent), null);

  const editIntent = reviewIntent('edit-and-accept');
  const changedEdit = structuredClone(successfulReviewRun('edit-and-accept'));
  const durableEdit = (selected(changedEdit).review as Record<string, unknown>).editedProposal as Record<string, unknown>;
  durableEdit.uncertainty = 'Reviewer returned a different valid uncertainty.';
  assert.equal(admitReview(reviewTransport(200, { ok: true, run: valid(changedEdit) }), baseline, editIntent), null);

  const orderedIntent = reviewIntent('edit-and-accept');
  const passageIds = ((((selected(baseline).retrieval as Record<string, unknown>).result as Record<string, unknown>)
    .passages as Array<Record<string, unknown>>).map(passage => String(passage.passageId)));
  assert.ok(passageIds.length >= 2, 'Reference-order witness needs at least two allowed passages');
  orderedIntent.review.editedProposal!.userImpact.passageIds = [...passageIds];
  const reorderedReferences = structuredClone(successfulReviewRun('edit-and-accept'));
  const proposal = (selected(reorderedReferences).review as Record<string, unknown>).editedProposal as Record<string, unknown>;
  const impact = proposal.userImpact as Record<string, unknown>;
  impact.passageIds = [...passageIds].reverse();
  assert.notDeepEqual(impact.passageIds, orderedIntent.review.editedProposal!.userImpact.passageIds);
  assert.equal(admitReview(reviewTransport(200, { ok: true, run: valid(reorderedReferences) }), baseline, orderedIntent), null);

  for (const decidedAt of ['invalid-time', '2026-08-30T10:00:05.000Z']) {
    const timed = structuredClone(successfulReviewRun('approve'));
    (selected(timed).review as Record<string, unknown>).decidedAt = decidedAt;
    assert.equal(admitReview(reviewTransport(200, { ok: true, run: timed }), baseline, reviewIntent()), null);
  }
});

test('admits only exact known failure status and envelope combinations with baseline-or-null truth', serial, () => {
  const baseline = pendingReviewRun();
  const mappings = [
    [400, ['invalid-request', 'review-validation']],
    [404, ['not-found']],
    [409, ['busy', 'workflow-active', 'not-eligible']],
    [503, ['stopping', 'shutdown']],
    [500, ['invalid-run', 'stored-run-unavailable', 'read-failed', 'review-persistence']],
  ] as const;
  for (const [status, errors] of mappings) {
    for (const error of errors) {
      for (const run of [null, baseline] as const) {
        const cleanupValues = error === 'review-persistence' ? [false, true] : [false];
        for (const cleanup of cleanupValues) {
          const body = reviewFailure(error, run, cleanup);
          assert.deepEqual(admitReview(reviewTransport(status, body), baseline, reviewIntent()), body,
            `${status}:${error}:${cleanup}`);
        }
        if (error !== 'review-persistence') {
          assert.equal(admitReview(reviewTransport(status, reviewFailure(error, run, true)), baseline, reviewIntent()), null);
        }
      }
    }
  }

  for (const error of ['invalid-request', 'review-validation'] as const) {
    const body = reviewFailure(error, baseline);
    assert.deepEqual(admitReview(reviewTransport(400, body), baseline, reviewIntent()), body,
      `${error} is a definite exact-baseline refusal`);
  }
});

test('rejects mismatched, forged and unknown transport outcomes instead of publishing false certainty', serial, () => {
  const baseline = pendingReviewRun();
  const changed = structuredClone(baseline);
  Object.defineProperty(changed, 'applicationRevision', {
    value: 'd'.repeat(40), enumerable: true, writable: true, configurable: true,
  });
  assert.ok(validateRun(changed).ok);
  const candidates: unknown[] = [
    reviewTransport(201, { ok: true, run: successfulReviewRun('approve') }),
    reviewTransport(500, reviewFailure('not-found')),
    reviewTransport(400, { ...reviewFailure('invalid-request'), persisted: true }),
    reviewTransport(400, { ...reviewFailure('invalid-request'), extra: true }),
    reviewTransport(400, reviewFailure('invalid-request', changed as never)),
    reviewTransport(400, reviewFailure('invalid-request', baseline, true)),
    reviewTransport(500, { ok: false, error: 'review-outcome-unknown' }),
    reviewTransport(500, { ok: false, error: 'private-error', run: null, persisted: false, cleanupFailed: false }),
    { status: 400, body: reviewFailure('invalid-request'), extra: true },
    { status: Number.NaN, body: reviewFailure('invalid-request') },
    { status: 400 },
    null,
  ];
  for (const candidate of candidates) {
    assert.equal(admitReview(candidate, baseline, reviewIntent()), null);
  }
});

test('fails closed on accessors, symbols, prototypes, cycles, proxies and reentrant reflection', serial, () => {
  const baseline = pendingReviewRun();
  let reads = 0;
  const accessorRaw = Object.defineProperty({ status: 200 }, 'body', {
    enumerable: true,
    get() { reads++; throw new Error('SYNTHETIC_SECRET'); },
  });
  const accessorBaseline = structuredClone(pendingReviewRun());
  Object.defineProperty(selected(accessorBaseline).evidence, 'altState', {
    enumerable: true,
    get() { reads++; throw new Error('SYNTHETIC_SECRET'); },
  });
  const accessorIntent = Object.defineProperty({ runId: 'run-01', findingId: 'finding-0' }, 'review', {
    enumerable: true,
    get() { reads++; throw new Error('SYNTHETIC_SECRET'); },
  });
  const symbolic = reviewTransport(200, { ok: true, run: successfulReviewRun() }) as Record<PropertyKey, unknown>;
  symbolic[Symbol('secret')] = true;
  const cycle = reviewTransport(400, reviewFailure('invalid-request')) as Record<string, unknown>;
  cycle.self = cycle;
  const prototype = Object.assign(Object.create({ inherited: true }), success());
  let reentered = false;
  const reentrant = new Proxy(success(), {
    ownKeys(target) {
      reentered = true;
      assert.equal(admitReview(reviewTransport(400, reviewFailure('invalid-request')), baseline, reviewIntent())?.ok, false);
      return Reflect.ownKeys(target);
    },
  });
  const hostile = new Proxy(success(), { getPrototypeOf() { throw new Error('SYNTHETIC_SECRET'); } });

  for (const [raw, before, intent] of [
    [accessorRaw, baseline, reviewIntent()],
    [success(), accessorBaseline, reviewIntent()],
    [success(), baseline, accessorIntent],
    [symbolic, baseline, reviewIntent()],
    [cycle, baseline, reviewIntent()],
    [prototype, baseline, reviewIntent()],
    [hostile, baseline, reviewIntent()],
  ] as const) {
    assert.equal(admitReview(raw, before, intent as never), null);
  }
  assert.ok(admitReview(reentrant, baseline, reviewIntent())?.ok);
  assert.equal(reentered, true);
  assert.equal(reads, 0);
});
