import type { ReactElement } from 'react';
import type { Proposal } from '../../../server/generation/proposal-contract.ts';
import type { FindingGuidanceView } from '../../../server/domain/finding-analysis-types.ts';
import { ProposalContent } from './ProposalContent.tsx';

export function ProposalDetail({ proposal, view, reviewed = false }: {
  readonly proposal: Proposal; readonly view: FindingGuidanceView; readonly reviewed?: boolean;
}): ReactElement {
  return <div className="proposal-detail">
    <h4>{reviewed ? 'AI interpretation — original proposal' : 'AI interpretation — proposal pending review'}</h4>
    <p>{reviewed ? 'This is the original model-generated proposal, preserved after human review.'
      : 'This is the original model-generated proposal. Human review is still required.'}</p>
    <ProposalContent proposal={proposal} view={view} />
  </div>;
}
