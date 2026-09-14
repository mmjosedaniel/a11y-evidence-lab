import { validateProposal } from '../server/generation/proposal-contract.ts';
import type { Proposal } from '../server/generation/proposal-contract.ts';
import { validateReviewInput } from '../server/domain/review-contract.ts';
import type { ReviewContext } from '../server/domain/review-contract.ts';

export type ReviewAction = '' | 'approve' | 'edit-and-accept' | 'reject';
export type Judgment = 'supports-proposal' | 'not-applicable' | 'unresolved' | 'contradicts-proposal';
export type ReviewDraft = {
  readonly action: ReviewAction;
  readonly judgment: Judgment;
  readonly reason: string;
  readonly note: string;
  readonly confirmed: boolean;
  readonly proposal: Proposal;
  readonly assumptions: readonly string[];
};
export type ReviewErrors = Readonly<Record<string, string>>;
export const claimFields = [
  ['findingSummary', 'Finding summary', 1000],
  ['userImpact', 'User impact', 1000],
  ['remediation', 'Remediation proposal', 2000],
] as const;
export const proseFields = [
  ['uncertainty', 'Uncertainty'],
  ['blockingManualJudgment', 'Blocking manual judgment'],
  ['postChangeVerificationReminder', 'Post-change verification reminder'],
] as const;

export function initialReviewDraft(proposal: Proposal): ReviewDraft {
  return { action: '', judgment: 'unresolved', reason: '', note: '', confirmed: false,
    proposal, assumptions: Array.from({ length: 5 }, (_, index) => proposal.assumptions[index] ?? '') };
}

export function validateReviewDraft(draft: ReviewDraft, context: ReviewContext):
  { readonly errors: ReviewErrors; readonly review?: unknown } {
  const errors: Record<string, string> = {};
  const text = (key: string, label: string, value: string, maximum: number): void => {
    if (!value.trim()) errors[key] = `${label} is required.`;
    else if (value.length > maximum) errors[key] = `${label} must be at most ${maximum} characters.`;
  };
  if (!draft.action) errors.action = 'Choose a review action.';
  const proposal = { ...draft.proposal, assumptions: draft.assumptions.filter(value => value.trim().length > 0) };
  if (draft.action === 'edit-and-accept') {
    for (const [key, label, maximum] of claimFields) {
      text(key, label, proposal[key].text, maximum);
      if (key === 'findingSummary' && proposal[key].evidenceReferences.length === 0)
        errors[`${key}-evidenceReferences`] = `${label} needs at least one evidence reference.`;
      if (key !== 'findingSummary' && proposal[key].passageIds.length === 0)
        errors[`${key}-passageIds`] = `${label} needs at least one retrieved guidance reference.`;
    }
    for (const [key, label] of proseFields) text(key, label, proposal[key], 1000);
    draft.assumptions.forEach((value, index) => {
      if (value.length > 500) errors[`assumption-${index}`] = `Assumption ${index + 1} must be at most 500 characters.`;
    });
    if (Object.keys(errors).length === 0 && !validateProposal(proposal, context).ok)
      errors.editor = 'The proposal content or reference rules must be corrected.';
  }
  if (draft.judgment === 'not-applicable') text('reason', 'Not applicable reason', draft.reason, 500);
  if (draft.note.length > 1000) errors.note = 'Reviewer note must be at most 1000 characters.';
  if (draft.action && draft.action !== 'reject') {
    if (draft.judgment === 'unresolved' || draft.judgment === 'contradicts-proposal')
      errors.judgment = 'Resolve the blocking judgment before accepting the proposal.';
    if (!draft.confirmed) errors.confirmed = 'Confirm the resulting proposal’s material claims against cited guidance, recorded scanner evidence or both.';
  }
  if (Object.keys(errors).length > 0) return { errors };
  const review = { action: draft.action,
    blockingJudgment: { status: draft.judgment, ...(draft.judgment === 'not-applicable' ? { reason: draft.reason } : {}) },
    ...(draft.note.trim() ? { note: draft.note } : {}),
    ...(draft.action !== 'reject' ? { supportConfirmed: true } : {}),
    ...(draft.action === 'edit-and-accept' ? { editedProposal: proposal } : {}),
  };
  if (!validateReviewInput(review, context).ok)
    return { errors: { editor: 'The proposal content or reference rules must be corrected.' } };
  return { errors, review };
}
