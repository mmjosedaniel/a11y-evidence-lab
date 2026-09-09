import type { ReactElement } from 'react';
import type { Finding, ProviderContext } from '../../../server/domain/run-contract.ts';

export function FindingOutcome({ finding, providerContext }: {
  readonly finding: Finding; readonly providerContext: ProviderContext;
}): ReactElement | null {
  const analysis = 'analysis' in finding ? finding.analysis : null;
  if (finding.state === 'failed') {
    const error = 'retrieval' in finding ? finding.retrieval.status === 'failed' && finding.retrieval.error
      : analysis?.status === 'failed' && analysis.error;
    return <div className="finding-outcome"><h4>Guidance failed</h4><p>{error}</p></div>;
  }
  if (!analysis || analysis.status !== 'completed') return null;
  const support = 'retrieval' in finding && finding.retrieval.status === 'completed' && 'support' in finding.retrieval
    ? finding.retrieval.support : null;
  const abstention = finding.state === 'abstained' ? finding.result : null;
  return <div className="finding-outcome">
    <h4>Evidence sufficiency</h4>
    <p>{analysis.evidence.state === 'complete' ? 'Complete' : 'Incomplete'}</p>
    <h5>Available evidence references</h5>
    <ul>{analysis.evidence.availableReferences.map(reference => <li key={reference}>{reference}</li>)}</ul>
    {analysis.evidence.blockers.length > 0 && <>
      <h5>Required evidence blockers</h5>
      <ul>{analysis.evidence.blockers.map(blocker => <li key={blocker.reference}>
        {blocker.reference}: Unavailable ({blocker.reason})
      </li>)}</ul>
    </>}
    {support && <>
      <h4>Guidance support</h4><p>{support.state}</p>
      {support.missingRoles.length > 0 && <><h5>Missing guidance roles</h5>
        <ul>{support.missingRoles.map(role => <li key={role}>{role}</li>)}</ul></>}
      {support.conflicts.length > 0 && <><h5>Conflicting passage references</h5>
        <ul>{support.conflicts.map(pair => <li key={pair.join(':')}>{pair.join(' / ')}</li>)}</ul></>}
    </>}
    {abstention ? <>
      <h4>No proposal generated</h4>
      <p>{abstention.explanation}</p>
      <p>{abstention.manualInvestigation}</p>
      <p>No generation provider was called</p>
      <h5>Unused generation configuration</h5>
      <dl className="evidence-facts">
        <div><dt>Mode</dt><dd>{providerContext.mode}</dd></div>
        <div><dt>Provider</dt><dd>{providerContext.provider}</dd></div>
        <div><dt>Model</dt><dd>{providerContext.model}</dd></div>
      </dl>
    </> : support?.state === 'supported' && <h4>Eligible for generation</h4>}
  </div>;
}
