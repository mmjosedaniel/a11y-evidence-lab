import type { ReactElement } from 'react';
import type { Proposal } from '../../../server/generation/proposal-contract.ts';
import type { FindingGuidanceView } from '../../../server/domain/finding-analysis-types.ts';

function Claim({ title, claim, view }: {
  readonly title: string; readonly claim: Proposal['findingSummary']; readonly view: FindingGuidanceView;
}): ReactElement {
  return <div className="proposal-claim">
    <h5>{title}</h5>
    <p>{claim.text}</p>
    {claim.evidenceReferences.length > 0 && <>
      <h6>Supporting evidence references</h6>
      <ul>{claim.evidenceReferences.map(reference => <li key={reference}><code>{reference}</code></li>)}</ul>
    </>}
    {claim.passageIds.length > 0 && <>
      <h6>Supporting retrieved guidance</h6>
      <ul>{claim.passageIds.map(id => {
        const passage = view.passages.find(item => item.passageId === id);
        return <li key={id}><code>{id}</code>{passage && <>
          {' — '}<a href={passage.url} target="_blank" rel="noopener noreferrer">
            {passage.sourceTitle}: {passage.heading} (opens in a new tab)
          </a>
        </>}</li>;
      })}</ul>
    </>}
  </div>;
}

export function ProposalDetail({ proposal, view }: {
  readonly proposal: Proposal; readonly view: FindingGuidanceView;
}): ReactElement {
  return <div className="proposal-detail">
    <h4>AI interpretation — proposal pending review</h4>
    <p>This is the original model-generated proposal. Human review is still required.</p>
    <dl className="evidence-facts">
      <div><dt>Output type</dt><dd>{proposal.type}</dd></div>
      <div><dt>Selected Finding reference</dt><dd>{proposal.findingId}</dd></div>
    </dl>
    <Claim title="Finding summary" claim={proposal.findingSummary} view={view} />
    <Claim title="User impact" claim={proposal.userImpact} view={view} />
    <Claim title="Remediation proposal" claim={proposal.remediation} view={view} />
    <h5>Evidence sufficiency</h5>
    <dl className="evidence-facts">
      <div><dt>Finding evidence</dt><dd>{proposal.evidenceSufficiency.findingEvidence}</dd></div>
      <div><dt>Retrieved guidance</dt><dd>{proposal.evidenceSufficiency.guidance}</dd></div>
    </dl>
    <h5>Model confidence</h5><p>{proposal.confidence}</p>
    <h5>Uncertainty</h5><p>{proposal.uncertainty}</p>
    <h5>Assumptions</h5>
    {proposal.assumptions.length > 0
      ? <ul>{proposal.assumptions.map((assumption, index) => <li key={index}>{assumption}</li>)}</ul>
      : <p>No assumptions stated.</p>}
    <h5>Blocking manual judgment</h5><p>{proposal.blockingManualJudgment}</p>
    <h5>Post-change verification reminder</h5><p>{proposal.postChangeVerificationReminder}</p>
  </div>;
}
