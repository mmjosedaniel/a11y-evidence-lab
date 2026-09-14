import type { NativeFinding } from '../../src/server/domain/run-contract.ts';
import type { Proposal } from '../../src/server/generation/proposal-contract.ts';
import type { RetrievalResult } from '../../src/server/retrieval/retrieval-contract.ts';
import {
  cloneCandidate,
  generationFinishedAt,
  generationFixture,
  proposalGenerationRun,
} from './m302-generation-fixture.ts';
import type { GenerationProfile, MutableProposalCandidate } from './m302-generation-fixture.ts';
import { selectedFinding } from './m202-retrieval-service-fixture.ts';

export type ReviewAction = 'approve' | 'edit-and-accept' | 'reject';
export type MutableJudgment = {
  status: 'supports-proposal' | 'not-applicable' | 'unresolved' | 'contradicts-proposal';
  reason?: string;
};
export type MutableReviewInput = {
  action: ReviewAction;
  blockingJudgment: MutableJudgment;
  supportConfirmed?: boolean;
  note?: string;
  editedProposal?: MutableProposalCandidate;
};

export const reviewDecidedAt = '2026-08-30T10:00:07.000Z';

export function reviewFixture(profile: GenerationProfile = 'image-alt'): {
  finding: NativeFinding;
  retrieval: RetrievalResult;
  proposal: MutableProposalCandidate;
} {
  return generationFixture(profile);
}

export function editedProposal(profile: GenerationProfile = 'image-alt'): MutableProposalCandidate {
  const proposal = cloneCandidate(generationFixture(profile).proposal);
  proposal.remediation.text = 'Use the cited guidance and the reviewer-authored bounded change for this element.';
  proposal.uncertainty = '  The reviewer preserved this exact uncertainty text.  ';
  return proposal;
}

export function reviewInput(
  action: ReviewAction,
  profile: GenerationProfile = 'image-alt',
  judgment: MutableJudgment = { status: 'supports-proposal' },
): MutableReviewInput {
  if (action === 'approve') return { action, supportConfirmed: true, blockingJudgment: structuredClone(judgment) };
  if (action === 'edit-and-accept') return {
    action,
    supportConfirmed: true,
    blockingJudgment: structuredClone(judgment),
    editedProposal: editedProposal(profile),
  };
  return { action, blockingJudgment: structuredClone(judgment) };
}

export function durableReview(
  action: ReviewAction,
  profile: GenerationProfile = 'image-alt',
  judgment: MutableJudgment = { status: 'supports-proposal' },
): Record<string, unknown> {
  return {
    action,
    decidedAt: reviewDecidedAt,
    blockingJudgment: structuredClone(judgment),
    ...(action === 'edit-and-accept' ? { editedProposal: editedProposal(profile) } : {}),
  };
}

export function reviewedRun(action: ReviewAction): Record<string | number, unknown> {
  const run = proposalGenerationRun();
  const finding = selectedFinding(run);
  finding.state = ({
    approve: 'accepted',
    'edit-and-accept': 'edited-and-accepted',
    reject: 'rejected',
  } as const)[action];
  finding.review = durableReview(action);
  return run;
}

export function pendingProposalFrom(run: Record<string | number, unknown>): Proposal {
  return selectedFinding(run).result as Proposal;
}

export { generationFinishedAt };
