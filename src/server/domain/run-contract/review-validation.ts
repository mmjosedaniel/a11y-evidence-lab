import { readReviewDecision } from '../review-contract.ts';
import { readChoice, requireValid } from './contract-value-reader.ts';
import { readGenerationFinding } from './generation-validation.ts';
import type { NativeFinding, ReviewedFinding } from './run-types.ts';

export function readReviewedFinding(record: Record<string, unknown>, native: NativeFinding,
  parentFinishedAt: string): ReviewedFinding {
  const state = readChoice(record.state, ['accepted', 'edited-and-accepted', 'rejected']);
  // Keep every other key so the existing generation reader still rejects unknown content.
  const { review: input, ...original } = record;
  const base = readGenerationFinding({ ...original, state: 'proposal-pending-review' }, native, parentFinishedAt);
  requireValid(base.state === 'proposal-pending-review');
  const review = readReviewDecision(input, { finding: native, retrieval: base.retrieval.result },
    base.generation.finishedAt);
  if (review.action === 'approve') {
    requireValid(state === 'accepted');
    return Object.freeze({ ...base, state, review });
  }
  if (review.action === 'edit-and-accept') {
    requireValid(state === 'edited-and-accepted');
    return Object.freeze({ ...base, state, review });
  }
  requireValid(state === 'rejected');
  return Object.freeze({ ...base, state, review });
}
