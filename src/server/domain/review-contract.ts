import { validateProposal } from '../generation/proposal-contract.ts';
import type { Proposal } from '../generation/proposal-contract.ts';
import type { RetrievalResult } from '../retrieval/retrieval-contract.ts';
import { readChoice, readObject, readTime, requireKeys, requireValid } from './run-contract/contract-value-reader.ts';
import type { NativeFinding } from './run-contract/run-types.ts';

export type ReviewContext = { finding: NativeFinding; retrieval: RetrievalResult };
type SupportingJudgment =
  | { readonly status: 'supports-proposal' }
  | { readonly status: 'not-applicable'; readonly reason: string };
type BlockingJudgment = SupportingJudgment
  | { readonly status: 'unresolved' }
  | { readonly status: 'contradicts-proposal' };
export type ReviewBody = { readonly note?: string } & (
  | { readonly action: 'approve'; readonly blockingJudgment: SupportingJudgment }
  | { readonly action: 'edit-and-accept'; readonly blockingJudgment: SupportingJudgment;
      readonly editedProposal: Proposal }
  | { readonly action: 'reject'; readonly blockingJudgment: BlockingJudgment }
);
export type ReviewDecision = ReviewBody & { readonly decidedAt: string };

function readText(input: unknown, maximum: number): string {
  requireValid(typeof input === 'string' && input.length <= maximum && input.trim().length > 0);
  return input;
}

function readJudgment(input: unknown): BlockingJudgment {
  const record = readObject(input);
  const status = readChoice(record.status,
    ['supports-proposal', 'not-applicable', 'unresolved', 'contradicts-proposal']);
  requireKeys(record, ['status', ...(status === 'not-applicable' ? ['reason'] : [])]);
  if (status === 'not-applicable') return Object.freeze({ status, reason: readText(record.reason, 500) });
  return Object.freeze({ status });
}

function readBody(record: Record<string, unknown>, context: ReviewContext, inputOnly: boolean): ReviewBody {
  const action = readChoice(record.action, ['approve', 'edit-and-accept', 'reject']);
  const hasNote = Object.hasOwn(record, 'note');
  requireKeys(record, ['action', 'blockingJudgment', ...(hasNote ? ['note'] : []),
    ...(action === 'edit-and-accept' ? ['editedProposal'] : []),
    ...(inputOnly && action !== 'reject' ? ['supportConfirmed'] : [])]);
  if (inputOnly && action !== 'reject') requireValid(record.supportConfirmed === true);
  const blockingJudgment = readJudgment(record.blockingJudgment);
  const note = hasNote ? { note: readText(record.note, 1000) } : {};
  if (action === 'reject') return Object.freeze({ action, blockingJudgment, ...note });
  requireValid(blockingJudgment.status === 'supports-proposal' || blockingJudgment.status === 'not-applicable');
  if (action === 'approve') return Object.freeze({ action, blockingJudgment, ...note });
  const proposal = validateProposal(record.editedProposal, context);
  requireValid(proposal.ok);
  return Object.freeze({ action, blockingJudgment, ...note, editedProposal: proposal.value });
}

const failure = Object.freeze({ ok: false, error: 'review-validation' } as const);

export function validateReviewInput(input: unknown, context: ReviewContext):
  { readonly ok: true; readonly value: ReviewBody } |
  { readonly ok: false; readonly error: 'review-validation' } {
  try {
    return Object.freeze({ ok: true, value: readBody(readObject(input), context, true) });
  } catch {
    return failure;
  }
}

export function readReviewDecision(input: unknown, context: ReviewContext,
  generationFinishedAt: string): ReviewDecision {
  const record = readObject(input);
  const decidedAt = readTime(record.decidedAt);
  requireValid(decidedAt >= readTime(generationFinishedAt));
  delete record.decidedAt;
  return Object.freeze({ ...readBody(record, context, false), decidedAt });
}
