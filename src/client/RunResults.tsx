import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Finding, PageAnalysisRun, ScannerReviewObservation } from '../server/domain/run-contract.ts';
import { affectedElementText, findingExplanation, manualReviewReason, RuleEvidence, ruleDisplayName } from './RuleEvidence.tsx';

interface FailureNotice {
  readonly text: string;
  readonly unsaved: boolean;
  readonly cleanup: boolean;
}

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;

interface RunResultsProps {
  readonly run: CompleteRun | FailedRun;
  readonly selectedResult?: ResultSelection | null;
  readonly failure?: FailureNotice | null;
  readonly onSelect?: (selection: ResultSelection, label: string) => void;
}

type RuleId = Finding['ruleId'];

export type ResultSelection =
  | { readonly kind: 'finding'; readonly findingId: string }
  | { readonly kind: 'manual-review'; readonly observationIndex: number };

interface LabeledFinding {
  readonly kind: 'finding';
  readonly finding: Finding;
  readonly label: string;
}

interface LabeledReview {
  readonly kind: 'manual-review';
  readonly observation: ScannerReviewObservation;
  readonly observationIndex: number;
  readonly label: string;
}

type LabeledResult = LabeledFinding | LabeledReview;

const ruleOrder: readonly RuleId[] = ['image-alt', 'label', 'color-contrast'];
const limitation = 'Checks cover image alternatives, form labels, and color contrast in the rendered top-level page. Results are not an accessibility or compliance certification.';
const manualIntro = 'Items tagged Needs manual review could not be determined automatically.';

function Field({ label, children }: { readonly label: string; readonly children: ReactNode }): ReactElement {
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}

function countText(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function findingLabel(finding: Finding, index: number): string {
  switch (finding.ruleId) {
    case 'image-alt': return `Image alternative issue ${index}`;
    case 'label': return `Form label issue ${index}`;
    case 'color-contrast': return `Color contrast issue ${index}`;
  }
}

function manualReviewLabel(observation: ScannerReviewObservation, index: number): string {
  switch (observation.ruleId) {
    case 'image-alt': return `Image alternative review ${index}`;
    case 'label': return `Form label review ${index}`;
    case 'color-contrast': return `Color contrast review ${index}`;
  }
}

function selectionFor(item: LabeledResult): ResultSelection {
  return item.kind === 'finding'
    ? { kind: 'finding', findingId: item.finding.findingId }
    : { kind: 'manual-review', observationIndex: item.observationIndex };
}

function isSelected(item: LabeledResult, selected: ResultSelection | null): boolean {
  if (!selected) return false;
  if (item.kind === 'finding') {
    return selected.kind === 'finding' && item.finding.findingId === selected.findingId;
  }
  return selected.kind === 'manual-review' && item.observationIndex === selected.observationIndex;
}

function failureExplanation(category: Extract<PageAnalysisRun, { status: 'failed' }>['failure']['category']): string {
  switch (category) {
    case 'navigation': return 'The requested page could not be opened.';
    case 'timeout': return 'The page did not become ready before the analysis timed out.';
    case 'browser': return 'The analysis browser could not complete the request.';
    case 'scanner': return 'The accessibility checks could not be completed.';
    case 'result-validation':
    case 'coverage-validation': return 'The scanner returned an invalid result.';
    case 'evidence-capture': return 'The scanner could not retain the required evidence.';
    case 'initial-persistence': return 'The analysis could not be saved.';
    case 'shutdown': return 'The analysis stopped before it could finish.';
    case 'cleanup': return 'The analysis stopped because cleanup could not be confirmed.';
  }
}

function ResultsOverview({ run }: { readonly run: CompleteRun }): ReactElement {
  const findings = run.scan.findings.length;
  const reviews = run.scan.scannerReviewObservations.length;
  return <section aria-labelledby="results-overview-heading" className="results-overview">
    <h3 id="results-overview-heading">Results overview</h3>
    <p className="finding-total">{findings === 0 ? 'No automated findings in the three supported checks' : `${countText(findings, 'finding')} ${findings === 1 ? 'needs' : 'need'} review`}</p>
    {reviews > 0 && <p className="review-total">{countText(reviews, 'item')} {reviews === 1 ? 'needs' : 'need'} manual review</p>}
    <div className="overview-groups">
      {ruleOrder.map(rule => {
        const findingCount = run.scan.findings.filter(item => item.ruleId === rule).length;
        const reviewCount = run.scan.scannerReviewObservations.filter(item => item.ruleId === rule).length;
        return <div className="overview-group" key={rule}>
          <h4>{ruleDisplayName(rule)}</h4>
          <p>{countText(findingCount, 'finding')} · {countText(reviewCount, 'manual review', 'manual reviews')}</p>
        </div>;
      })}
    </div>
    {findings === 0 && <p className="zero-limitation">This does not prove that the page is accessible or compliant.</p>}
  </section>;
}

export function RunResults({ run, selectedResult = null, failure = null, onSelect }: RunResultsProps): ReactElement {
  const prefix = useId();

  const labeledFindings: LabeledFinding[] = run.status === 'completed' ? run.scan.findings.map(finding => ({
    kind: 'finding',
    finding,
    label: findingLabel(finding, run.scan.findings.filter(candidate => candidate.ruleId === finding.ruleId)
      .findIndex(candidate => candidate.findingId === finding.findingId) + 1),
  })) : [];
  const labeledReviews: LabeledReview[] = run.status === 'completed'
    ? run.scan.scannerReviewObservations.map((observation, observationIndex) => ({
      kind: 'manual-review',
      observation,
      observationIndex,
      label: manualReviewLabel(observation, run.scan.scannerReviewObservations
        .filter(candidate => candidate.ruleId === observation.ruleId)
        .findIndex(candidate => candidate === observation) + 1),
    }))
    : [];
  const selected = selectedResult?.kind === 'finding'
    ? labeledFindings.find(item => item.finding.findingId === selectedResult.findingId)
    : labeledReviews.find(item => item.observationIndex === selectedResult?.observationIndex);

  if (run.status === 'failed') return <div className="run-evidence failed-result">
    <dl className="results-context"><Field label="Requested page">{run.requestedUrl}</Field></dl>
    <h3>Analysis could not be completed</h3>
    <p>{failureExplanation(run.failure.category)}</p>
    {failure?.unsaved && <p>This failed run was not saved.</p>}
    {failure?.cleanup && <p>Resource cleanup is uncertain.</p>}
  </div>;

  return <div className="run-evidence">
    <dl className="results-context"><Field label="Analyzed page">{run.scan.context.finalUrl.value}</Field></dl>
    <p className="result-limitation">{limitation}</p>
    <ResultsOverview run={run} />
    <div className="finding-workspace">
      <section aria-labelledby={`${prefix}-findings`} className="findings-column" tabIndex={0}>
        <h3 id={`${prefix}-findings`}>Findings</h3>
        {labeledReviews.length > 0 && <p>{manualIntro}</p>}
        {ruleOrder.map(rule => {
          const group: LabeledResult[] = [
            ...labeledFindings.filter(item => item.finding.ruleId === rule),
            ...labeledReviews.filter(item => item.observation.ruleId === rule),
          ];
          const headingId = `${prefix}-${rule}-findings`;
          return <div key={rule} role="group" aria-labelledby={headingId} className="finding-group">
            <h4 id={headingId}>{ruleDisplayName(rule)}</h4>
            {group.length === 0 ? <p>No findings or manual reviews in this check.</p> : <ul className="finding-list">
              {group.map(item => {
                const evidenceItem = item.kind === 'finding' ? item.finding : item.observation;
                const key = item.kind === 'finding' ? `finding-${item.finding.findingId}` : `review-${item.observationIndex}`;
                return <li key={key}>
                  <button type="button" aria-pressed={isSelected(item, selectedResult)}
                    onClick={() => onSelect?.(selectionFor(item), item.label)}>
                    <strong>{item.label}</strong>
                    <span>{affectedElementText(evidenceItem)}</span>
                    {item.kind === 'manual-review' && <span className="manual-review-tag">Needs manual review</span>}
                  </button>
                </li>;
              })}
            </ul>}
          </div>;
        })}
      </section>
      {selected && <section className="finding-detail" role="region" aria-label={`${selected.label} evidence`}>
        <h3 id={`${prefix}-selected-heading`}>{selected.label}</h3>
        {selected.kind === 'manual-review' && <p className="manual-review-tag">Needs manual review</p>}
        <RuleEvidence item={selected.kind === 'finding' ? selected.finding : selected.observation}
          explanation={selected.kind === 'finding' ? findingExplanation(selected.finding) : manualReviewReason(selected.observation)} />
      </section>}
    </div>
  </div>;
}
