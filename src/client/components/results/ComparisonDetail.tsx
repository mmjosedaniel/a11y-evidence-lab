import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Finding, PageAnalysisRun } from '../../../server/domain/run-contract.ts';
import type { CompleteScanContext } from '../../../server/domain/run-contract/run-types.ts';
import type { Proposal } from '../../../server/generation/proposal-contract.ts';
import type { ComparisonAvailability } from '../../comparison/comparison-request.ts';
import { RuleEvidence } from './RuleEvidence.tsx';
import { ordinaryText, plainReason, ruleDisplayName } from './resultPresentation.ts';
import { availabilityText, presentComparison } from './comparisonPresentation.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;

function Field({ label, children }: { readonly label: string; readonly children: ReactNode }): ReactElement {
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}

function Provenance({ runId, requestedUrl, context }: {
  readonly runId: string; readonly requestedUrl: string; readonly context: CompleteScanContext;
}): ReactElement {
  return <dl className="evidence-facts">
    <Field label="Run reference">{runId}</Field>
    <Field label="Requested page">{requestedUrl}</Field>
    <Field label="Analyzed page">{context.finalUrl.value}</Field>
    <Field label="Scan time">{context.scannedAt.value}</Field>
    <Field label="Browser version">{context.browserVersion.value}</Field>
  </dl>;
}

function ProposalContext({ proposal }: { readonly proposal: Proposal }): ReactElement {
  return <div className="comparison-proposal">
    <dl className="evidence-facts">
      <Field label="Output type">{proposal.type}</Field>
      <Field label="Finding reference">{proposal.findingId}</Field>
      {(['findingSummary', 'userImpact', 'remediation'] as const).map((key, index) =>
        <Field key={key} label={['Finding summary', 'User impact', 'Remediation proposal'][index]!}>
          <p>{proposal[key].text}</p>
          {proposal[key].evidenceReferences.length > 0 && <p>Evidence references: {proposal[key].evidenceReferences.join(', ')}</p>}
          {proposal[key].passageIds.length > 0 && <p>Guidance references: {proposal[key].passageIds.join(', ')}</p>}
        </Field>)}
      <Field label="Finding evidence sufficiency">{proposal.evidenceSufficiency.findingEvidence}</Field>
      <Field label="Guidance sufficiency">{proposal.evidenceSufficiency.guidance}</Field>
      <Field label="Confidence">{proposal.confidence}</Field>
      <Field label="Uncertainty">{proposal.uncertainty}</Field>
      <Field label="Assumptions">{proposal.assumptions.length ? <ul>{proposal.assumptions.map((item, index) => <li key={index}>{item}</li>)}</ul> : 'No assumptions stated.'}</Field>
      <Field label="Blocking manual judgment">{proposal.blockingManualJudgment}</Field>
      <Field label="Post-change verification reminder">{proposal.postChangeVerificationReminder}</Field>
    </dl>
  </div>;
}

function BaselineContext({ finding }: { readonly finding: Finding }): ReactElement | null {
  if (!('result' in finding) || finding.result.type !== 'proposal') return null;
  const decision = 'review' in finding ? finding.review : null;
  return <div className="comparison-context">
    <p>Baseline proposal and human work are context only and are not used to classify this comparison.</p>
    <h4>AI original proposal</h4>
    <ProposalContext proposal={finding.result} />
    {decision?.action === 'edit-and-accept' && <>
      <h4>Human-edited proposal</h4><ProposalContext proposal={decision.editedProposal} />
    </>}
    {decision && <>
      <h4>Human decision</h4>
      <dl className="evidence-facts">
        <Field label="Action">{plainReason(decision.action)}</Field>
        <Field label="Decision time">{decision.decidedAt}</Field>
        <Field label="Blocking judgment">{plainReason(decision.blockingJudgment.status)}</Field>
        {decision.blockingJudgment.status === 'not-applicable' && <Field label="Not applicable reason">{decision.blockingJudgment.reason}</Field>}
        {decision.note !== undefined && <Field label="Reviewer note">{decision.note}</Field>}
      </dl>
      {decision.action === 'reject' && <p>No remediation plan was accepted.</p>}
    </>}
  </div>;
}

export function ComparisonDetail({ run, availability, baseline }: {
  readonly run: CompleteRun;
  readonly availability: ComparisonAvailability;
  readonly baseline?: CompleteRun;
}): ReactElement | null {
  const id = useId();
  const comparison = run.comparison;
  if (!comparison) return null;
  const view = presentComparison(comparison);
  const notice = availabilityText(availability);
  const context = availability.status === 'available' && baseline && baseline.runId === run.baselineRunId
    ? baseline.scan.findings.find(item => item.findingId === comparison.baseline.findingId) : undefined;
  return <section className="comparison-detail" aria-labelledby={id}>
    <h3 id={id}>Comparison</h3>
    <p>Comparison saved.</p>
    {notice && <p>{notice}</p>}
    <dl className="evidence-facts">
      <Field label="Pair comparability">{view.pair}</Field>
      {view.match && <Field label="Target match">{view.match}</Field>}
      <Field label="Outcome">{view.outcome}</Field>
      <Field label="Reason">{view.reason}</Field>
      {view.mismatches.length > 0 && <Field label="Pair differences">{view.mismatches.join(', ')}</Field>}
    </dl>
    <p>{comparison.rationale}</p>
    <div className="comparison-evidence">
      <div>
        <h4>Before</h4>
        <Provenance runId={run.baselineRunId!} requestedUrl={comparison.baseline.requestedUrl} context={comparison.baseline.scanContext} />
        <p>Finding reference: {comparison.baseline.findingId}</p>
        <RuleEvidence item={comparison.baseline.observation} explanation={`${ruleDisplayName(comparison.baseline.observation.ruleId)} — Finding`} nested />
      </div>
      <div>
        <h4>After</h4>
        <Provenance runId={run.runId} requestedUrl={run.requestedUrl} context={run.scan.context} />
        {view.after ? <>
          {view.after.kind === 'finding' && <p>Finding reference: {view.after.findingId}</p>}
          <RuleEvidence item={view.after.observation} explanation={view.afterLabel} nested />
          {view.after.kind === 'incomplete' && <p>Incomplete reason: {ordinaryText(view.after.observation.incompleteReason)}</p>}
        </> : <p>{view.absentAfter}</p>}
      </div>
    </div>
    {view.delta && <>
      <h4>Contrast margin difference</h4>
      <dl className="evidence-facts">
        <Field label="Before margin">{view.delta.baselineMargin}</Field>
        <Field label="After margin">{view.delta.laterMargin}</Field>
        <Field label="Change">{view.delta.change}</Field>
      </dl>
    </>}
    <h4>Limitations</h4><ul>{comparison.limitations.map(text => <li key={text}>{text}</li>)}</ul>
    <h4>Follow-up</h4><p>{comparison.followUp}</p>
    {context && <BaselineContext finding={context} />}
  </section>;
}
