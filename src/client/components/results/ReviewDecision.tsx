import { useId, useLayoutEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { ReviewDecision as Decision } from '../../../server/domain/review-contract.ts';
import type { FindingGuidanceView } from '../../../server/domain/finding-analysis-types.ts';
import { ProposalContent } from './ProposalContent.tsx';

export function ReviewDecision({ decision, view, findingId, takeFocus }: {
  readonly decision: Decision;
  readonly view: FindingGuidanceView;
  readonly findingId: string;
  readonly takeFocus: (findingId: string) => boolean;
}): ReactElement {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    if (takeFocus(findingId)) heading.current?.focus();
  }, [findingId, takeFocus]);
  const action = { approve: 'Approve — accepted', 'edit-and-accept': 'Edit and accept — edited and accepted', reject: 'Reject — rejected' }[decision.action];
  return <section className="review-decision" aria-labelledby={id}>
    <h4 id={id} tabIndex={-1} ref={heading}>Saved review decision</h4>
    <dl className="evidence-facts">
      <div><dt>Action</dt><dd>{action}</dd></div>
      <div><dt>Decision time</dt><dd><time dateTime={decision.decidedAt}>{decision.decidedAt}</time></dd></div>
      <div><dt>Blocking judgment</dt><dd>{decision.blockingJudgment.status.replaceAll('-', ' ')}</dd></div>
      {decision.blockingJudgment.status === 'not-applicable' && <div><dt>Not applicable reason</dt><dd>{decision.blockingJudgment.reason}</dd></div>}
      {decision.note !== undefined && <div><dt>Reviewer note</dt><dd>{decision.note}</dd></div>}
    </dl>
    {decision.action === 'reject' && <p>No remediation plan was accepted.</p>}
    {decision.action === 'edit-and-accept' && <>
      <h4>Reviewer-authored accepted proposal</h4>
      <ProposalContent proposal={decision.editedProposal} view={view} reviewer />
    </>}
  </section>;
}
