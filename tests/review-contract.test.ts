import assert from 'node:assert/strict';
import test from 'node:test';
import {
  readReviewDecision,
  validateReviewInput,
} from '../src/server/domain/review-contract.ts';
import type {
  ReviewBody,
  ReviewContext,
  ReviewDecision,
} from '../src/server/domain/review-contract.ts';
import {
  durableReview,
  editedProposal,
  generationFinishedAt,
  reviewDecidedAt,
  reviewFixture,
  reviewInput,
} from './helpers/m401-review-fixture.ts';
import type { MutableReviewInput, ReviewAction } from './helpers/m401-review-fixture.ts';
import type { GenerationProfile } from './helpers/m302-generation-fixture.ts';

const profiles = ['image-alt', 'label', 'color-contrast'] as const satisfies readonly GenerationProfile[];
const actions = ['approve', 'edit-and-accept', 'reject'] as const satisfies readonly ReviewAction[];
const failure = Object.freeze({ ok: false, error: 'review-validation' } as const);

function context(profile: GenerationProfile = 'image-alt'): ReviewContext {
  const fixture = reviewFixture(profile);
  return { finding: fixture.finding, retrieval: fixture.retrieval };
}

function deepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) deepFrozen(child);
}

function valid(input: unknown, profile: GenerationProfile = 'image-alt'): ReviewBody {
  const result = validateReviewInput(input, context(profile));
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error('Expected a valid review body');
  deepFrozen(result);
  deepFrozen(result.value);
  return result.value;
}

function invalid(input: unknown, profile: GenerationProfile = 'image-alt'): void {
  const result = validateReviewInput(input, context(profile));
  assert.deepEqual(result, failure);
  deepFrozen(result);
}

test('admits all three final actions for every supported profile and removes input-only confirmation', () => {
  for (const profile of profiles) {
    for (const action of actions) {
      const input = reviewInput(action, profile);
      input.note = `  ${profile} ${action} note  `;
      const before = structuredClone(input);
      const value = valid(input, profile);
      assert.equal(value.action, action);
      assert.deepEqual(value.blockingJudgment, { status: 'supports-proposal' });
      assert.equal(value.note, before.note);
      assert.equal('supportConfirmed' in value, false);
      assert.equal('editedProposal' in value, action === 'edit-and-accept');
      assert.notEqual(value, input);
      input.blockingJudgment.status = 'unresolved';
      input.note = 'changed after validation';
      if (input.editedProposal) input.editedProposal.remediation.text = 'changed after validation';
      assert.equal(value.blockingJudgment.status, 'supports-proposal');
      assert.equal(value.note, before.note);
      if (value.action === 'edit-and-accept') assert.deepEqual(value.editedProposal, before.editedProposal);
    }
  }
});

test('requires literal true support confirmation for approval and edit, and forbids it for rejection', () => {
  for (const action of ['approve', 'edit-and-accept'] as const) {
    for (const confirmation of [undefined, false, null, 1, 'true']) {
      const input = reviewInput(action) as Record<string, unknown>;
      if (confirmation === undefined) delete input.supportConfirmed;
      else input.supportConfirmed = confirmation;
      invalid(input);
    }
  }
  for (const confirmation of [true, false, null]) {
    invalid({ ...reviewInput('reject'), supportConfirmed: confirmation });
  }
});

test('enforces action-specific blocking dispositions and a reason only for not-applicable', () => {
  for (const action of ['approve', 'edit-and-accept'] as const) {
    valid(reviewInput(action, 'image-alt', { status: 'supports-proposal' }));
    valid(reviewInput(action, 'image-alt', { status: 'not-applicable', reason: '  No blocking judgment applies here.  ' }));
    invalid(reviewInput(action, 'image-alt', { status: 'unresolved' }));
    invalid(reviewInput(action, 'image-alt', { status: 'contradicts-proposal' }));
  }
  for (const status of ['supports-proposal', 'unresolved', 'contradicts-proposal'] as const) {
    valid(reviewInput('reject', 'image-alt', { status }));
  }
  valid(reviewInput('reject', 'image-alt', { status: 'not-applicable', reason: 'A bounded reason.' }));
  invalid(reviewInput('reject', 'image-alt', { status: 'not-applicable' }));
  invalid(reviewInput('reject', 'image-alt', { status: 'not-applicable', reason: '   ' }));
  invalid(reviewInput('reject', 'image-alt', { status: 'supports-proposal', reason: 'forbidden' }));
});

test('accepts only the closed action-discriminated input and judgment shapes without invoking accessors', () => {
  for (const action of actions) {
    const input = reviewInput(action) as unknown as Record<string, unknown>;
    invalid({ ...input, unexpected: true });
    const missingAction = structuredClone(input);
    delete missingAction.action;
    invalid(missingAction);
    const missingJudgment = structuredClone(input);
    delete missingJudgment.blockingJudgment;
    invalid(missingJudgment);
  }
  invalid({ ...reviewInput('approve'), editedProposal: editedProposal() });
  const editWithoutProposal = reviewInput('edit-and-accept') as unknown as Record<string, unknown>;
  delete editWithoutProposal.editedProposal;
  invalid(editWithoutProposal);
  invalid({ ...reviewInput('reject'), editedProposal: editedProposal() });
  invalid({ ...reviewInput('approve'), action: 'accept' });
  invalid({ ...reviewInput('approve'), blockingJudgment: { status: 'supports-proposal', reason: 'extra' } });
  invalid(Object.assign(Object.create({ inherited: true }), reviewInput('approve')));

  let bodyAccessed = false;
  const bodyAccessor = reviewInput('approve') as unknown as Record<string, unknown>;
  Object.defineProperty(bodyAccessor, 'action', { enumerable: true, get() { bodyAccessed = true; return 'approve'; } });
  invalid(bodyAccessor);
  assert.equal(bodyAccessed, false);
  let judgmentAccessed = false;
  const judgmentAccessor = reviewInput('approve');
  Object.defineProperty(judgmentAccessor.blockingJudgment, 'status', {
    enumerable: true, get() { judgmentAccessed = true; return 'supports-proposal'; },
  });
  invalid(judgmentAccessor);
  assert.equal(judgmentAccessed, false);
});

test('counts raw UTF-16 units and preserves bounded note and reason text exactly', () => {
  const noteBoundary = `${'n'.repeat(998)}😀`;
  const reasonBoundary = `${'r'.repeat(498)}😀`;
  const input = reviewInput('approve', 'image-alt', { status: 'not-applicable', reason: `  ${reasonBoundary.slice(2, -2)}  ` });
  input.note = noteBoundary;
  const value = valid(input);
  assert.equal(value.note, noteBoundary);
  assert.deepEqual(value.blockingJudgment, input.blockingJudgment);

  invalid({ ...reviewInput('approve'), note: `${'n'.repeat(999)}😀` });
  invalid(reviewInput('approve', 'image-alt', { status: 'not-applicable', reason: `${'r'.repeat(499)}😀` }));
  for (const note of ['', ' \t\n ', null, undefined, 7]) {
    const candidate = reviewInput('reject') as unknown as Record<string, unknown>;
    candidate.note = note;
    invalid(candidate);
  }
});

test('requires a complete edited proposal for the selected finding and retained retrieval context', () => {
  for (const profile of profiles) valid(reviewInput('edit-and-accept', profile), profile);
  const partial = reviewInput('edit-and-accept');
  delete (partial.editedProposal as unknown as Record<string, unknown>).remediation;
  invalid(partial);
  const wrongFinding = reviewInput('edit-and-accept');
  wrongFinding.editedProposal!.findingId = 'finding-elsewhere';
  invalid(wrongFinding);
  const inventedReference = reviewInput('edit-and-accept');
  inventedReference.editedProposal!.remediation.passageIds = ['invented-passage'];
  invalid(inventedReference);
  const prohibitedClaim = reviewInput('edit-and-accept');
  prohibitedClaim.editedProposal!.remediation.text = 'The finding has been fixed.';
  invalid(prohibitedClaim);
  invalid(reviewInput('edit-and-accept', 'label'), 'image-alt');
});

test('stored decisions admit exact durable shapes, all dispositions for rejection and chronological equality', () => {
  for (const action of actions) {
    const stored = durableReview(action);
    const value: ReviewDecision = readReviewDecision(stored, context(), generationFinishedAt);
    assert.deepEqual(value, stored);
    assert.notEqual(value, stored);
    deepFrozen(value);
  }
  for (const status of ['supports-proposal', 'unresolved', 'contradicts-proposal'] as const) {
    const stored = durableReview('reject', 'image-alt', { status });
    assert.deepEqual(readReviewDecision(stored, context(), generationFinishedAt), stored);
  }
  const equal = durableReview('approve');
  equal.decidedAt = generationFinishedAt;
  assert.deepEqual(readReviewDecision(equal, context(), generationFinishedAt), equal);
});

test('stored decisions reject input confirmation, malformed shape, action mismatch and invalid chronology', () => {
  const invalidStored: unknown[] = [
    { ...durableReview('approve'), supportConfirmed: true },
    { ...durableReview('approve'), unexpected: true },
    { ...durableReview('approve'), editedProposal: editedProposal() },
    { ...durableReview('reject'), editedProposal: editedProposal() },
    { ...durableReview('edit-and-accept'), editedProposal: undefined },
    { ...durableReview('approve'), blockingJudgment: { status: 'unresolved' } },
    { ...durableReview('approve'), decidedAt: '2026-08-30T10:00:05.999Z' },
    { ...durableReview('approve'), decidedAt: 'not-a-time' },
    { ...durableReview('approve'), decidedAt: null },
  ];
  for (const candidate of invalidStored) {
    assert.throws(() => readReviewDecision(candidate, context(), generationFinishedAt));
  }
});

test('validation contains hostile inspection failures and never returns caller-owned mutable state', () => {
  const secret = 'SYNTHETIC_PRIVATE_REVIEW';
  for (const trap of [
    { ownKeys() { throw new Error(secret); } },
    { getPrototypeOf() { throw new Error(secret); } },
    { getOwnPropertyDescriptor() { throw new Error(secret); } },
  ] as const) {
    invalid(new Proxy(reviewInput('approve') as unknown as Record<string, unknown>, trap));
  }
  const revoked = Proxy.revocable({}, {});
  revoked.revoke();
  invalid(revoked.proxy);
});

// Compile-time use keeps the complete public discriminated union in the accepted test boundary.
type PublicReviewTypes = [ReviewBody, ReviewDecision, ReviewContext, MutableReviewInput];
const publicReviewTypesExist: PublicReviewTypes | null = null;
assert.equal(publicReviewTypesExist, null);
