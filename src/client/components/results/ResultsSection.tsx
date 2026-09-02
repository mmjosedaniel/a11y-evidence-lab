import { useId } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import type { PageAnalysisRun } from '../../../server/domain/run-contract.ts';
import type { AnalysisError } from '../analysis/analysisTypes.ts';
import { FindingsPanel } from './FindingsPanel.tsx';
import { ResultDetail } from './ResultDetail.tsx';
import { ResultsOverview } from './ResultsOverview.tsx';
import { limitation, presentResults, selectedResult as findSelectedResult } from './resultPresentation.ts';
import type { ResultSelection } from './resultPresentation.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;

interface ResultsSectionProps {
  readonly run: CompleteRun | FailedRun;
  readonly selectedResult?: ResultSelection | null;
  readonly failure?: AnalysisError | null;
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
  readonly failure: AnalysisError | null;
}): ReactElement {
  return <div className="run-evidence failed-result">
    <dl className="results-context"><Field label="Requested page">{run.requestedUrl}</Field></dl>
    <h3>Analysis could not be completed</h3>
    <p>{failureExplanation(run.failure.category)}</p>
    {failure?.unsaved && <p>This failed run was not saved.</p>}
    {failure?.cleanup && <p>Resource cleanup is uncertain.</p>}
  </div>;
}

function CompletedResults({ run, selectedResult, onSelect }: {
  readonly run: CompleteRun;
  readonly selectedResult: ResultSelection | null;
  readonly onSelect?: (selection: ResultSelection, label: string) => void;
}): ReactElement {
  const idPrefix = useId();
  const results = presentResults(run.scan.findings, run.scan.scannerReviewObservations);
  const selected = findSelectedResult(results, selectedResult);

  return <div className="run-evidence">
    <dl className="results-context"><Field label="Analyzed page">{run.scan.context.finalUrl.value}</Field></dl>
    <p className="result-limitation">{limitation}</p>
    <ResultsOverview run={run} />
    <div className="finding-workspace">
      <FindingsPanel idPrefix={idPrefix} results={results} selectedResult={selectedResult} onSelect={onSelect} />
      {selected && <ResultDetail idPrefix={idPrefix} result={selected} />}
    </div>
  </div>;
}

export function ResultsSection({ run, selectedResult = null, failure = null, headingRef, contentRef, onSelect }:
  ResultsSectionProps): ReactElement {
  return <section aria-labelledby="results-heading" className="results">
    <h2 id="results-heading" tabIndex={-1} ref={headingRef}>Results</h2>
    <div ref={contentRef}>
      {run.status === 'failed'
        ? <FailedResults key={run.runId} run={run} failure={failure} />
        : <CompletedResults key={run.runId} run={run} selectedResult={selectedResult} onSelect={onSelect} />}
    </div>
  </section>;
}
