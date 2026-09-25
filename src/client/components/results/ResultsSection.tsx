import { useId } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import type { PageAnalysisRun } from '../../../server/domain/run-contract.ts';
import { RescanStatus } from './IntentionalRescanForm.tsx';
import type { RescanControls } from './IntentionalRescanForm.tsx';
import { FindingsPanel } from './FindingsPanel.tsx';
import { ResultDetail } from './ResultDetail.tsx';
import { ResultsOverview } from './ResultsOverview.tsx';
import { ComparisonDetail } from './ComparisonDetail.tsx';
import type { ComparisonAvailability } from '../../comparison/comparison-request.ts';
import { limitation, presentResults, selectedResult as findSelectedResult } from './resultPresentation.ts';
import type { ResultSelection } from './resultPresentation.ts';
import type { GuidanceControls } from './FindingGuidance.tsx';
import type { GenerationControls } from './FindingGeneration.tsx';
import type { ReviewControls } from './ProposalReviewForm.tsx';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;

interface FailureNotice {
  readonly unsaved: boolean;
  readonly cleanup: boolean;
}

interface ResultsSectionProps {
  readonly readOnly?: boolean;
  readonly rescan?: RescanControls;
  readonly navigation?: ReactNode;
  readonly comparison?: { readonly availability: ComparisonAvailability; readonly baseline?: CompleteRun };
  readonly review: ReviewControls;
  readonly generation: GenerationControls;
  readonly guidance: GuidanceControls;
  readonly run: CompleteRun | FailedRun;
  readonly selectedResult?: ResultSelection | null;
  readonly failure?: FailureNotice | null;
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
  readonly contentRef: RefObject<HTMLDivElement | null>;
  readonly onSelect?: (selection: ResultSelection, label: string) => void;
}

function Field({ label, children }: { readonly label: string; readonly children: ReactNode }): ReactElement {
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}

function failureExplanation(category: FailedRun['failure']['category']): string {
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

function FailedResults({ run, failure }: {
  readonly run: FailedRun;
  readonly failure: FailureNotice | null;
}): ReactElement {
  return <div className="run-evidence failed-result">
    <dl className="results-context"><Field label="Requested page">{run.requestedUrl}</Field></dl>
    <h3>Analysis could not be completed</h3>
    <p>{failureExplanation(run.failure.category)}</p>
    {failure?.unsaved && <p>This failed run was not saved.</p>}
    {failure?.cleanup && <p>Resource cleanup is uncertain.</p>}
  </div>;
}

function CompletedResults({ run, selectedResult, onSelect, guidance, generation, review, readOnly, rescan }: {
  readonly readOnly: boolean;
  readonly rescan?: RescanControls;
  readonly review: ReviewControls;
  readonly generation: GenerationControls;
  readonly guidance: GuidanceControls;
  readonly run: CompleteRun;
  readonly selectedResult: ResultSelection | null;
  readonly onSelect?: (selection: ResultSelection, label: string) => void;
}): ReactElement {
  const idPrefix = useId();
  const results = presentResults(run.scan.findings, run.scan.scannerReviewObservations, generation.presentations);
  const selected = findSelectedResult(results, selectedResult);

  return <div className="run-evidence">
    <dl className="results-context"><Field label="Analyzed page">{run.scan.context.finalUrl.value}</Field></dl>
    <p className="result-limitation">{limitation}</p>
    <ResultsOverview run={run} />
    <div className="finding-workspace">
      <FindingsPanel idPrefix={idPrefix} results={results} selectedResult={selectedResult} onSelect={onSelect} />
      {selected && <ResultDetail key={selected.key} idPrefix={idPrefix} result={selected} providerContext={run.providerContext} guidance={guidance} generation={generation} review={review} readOnly={readOnly} rescan={rescan} />}
    </div>
  </div>;
}

export function ResultsSection({ run, selectedResult = null, failure = null, headingRef, contentRef, onSelect, guidance, generation, review, readOnly = false, rescan, navigation, comparison }:
  ResultsSectionProps): ReactElement {
  return <section aria-labelledby="results-heading" className="results">
    <h2 id="results-heading" tabIndex={-1} ref={headingRef}>Results</h2>
    <div ref={contentRef}>
      {navigation}
      <RescanStatus state={rescan?.presentation ?? null} />
      {rescan?.comparisonFeedback && <p className="rescan-status">{rescan.comparisonFeedback}</p>}
      {run.status === 'failed'
        ? <FailedResults key={run.runId} run={run} failure={failure} />
        : <CompletedResults key={run.runId} run={run} selectedResult={selectedResult} onSelect={onSelect} guidance={guidance} generation={generation} review={review} readOnly={readOnly} rescan={rescan} />}
      {!readOnly && run.status === 'completed' && comparison && <ComparisonDetail run={run} availability={comparison.availability} baseline={comparison.baseline} />}
    </div>
  </section>;
}
