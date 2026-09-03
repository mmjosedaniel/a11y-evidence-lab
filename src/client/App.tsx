import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { PageAnalysisRun } from '../server/domain/run-contract.ts';
import { AnalyzeSection } from './components/analysis/AnalyzeSection.tsx';
import type { AnalysisConfiguration, AnalysisError, AnalyzeIntent } from './components/analysis/analysisTypes.ts';
import { ResultsSection } from './components/results/ResultsSection.tsx';
import type { ResultSelection } from './components/results/resultPresentation.ts';
import { admit, sameProvider } from './run-admission.ts';

export type { AnalyzeIntent } from './components/analysis/analysisTypes.ts';

export interface AppProps {
  readonly analyze?: (intent: AnalyzeIntent) => Promise<unknown>;
  readonly configuration?: AnalysisConfiguration;
}

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;

function countText(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}

export function App(props: AppProps): ReactElement {
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState<AnalysisError | null>(null);
  const [complete, setComplete] = useState<CompleteRun | null>(null);
  const [failed, setFailed] = useState<FailedRun | null>(null);
  const [selectedResult, setSelectedResult] = useState<ResultSelection | null>(null);
  const held = useRef<{ complete: CompleteRun | null; failed: FailedRun | null }>({ complete: null, failed: null });
  const reservation = useRef<object | null>(null);
  const mounted = useRef(true);
  const resultsContent = useRef<HTMLDivElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const moveResultsFocus = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; reservation.current = null; };
  }, []);

  useLayoutEffect(() => {
    if (moveResultsFocus.current) {
      moveResultsFocus.current = false;
      resultsHeading.current?.focus();
    }
  }, [complete]);

  function showError(code: string, unsaved = false, cleanup = false): void {
    const text = `Analyze failed: ${code}.`;
    setError({ text, unsaved, cleanup });
    setAnnouncement([text, unsaved ? 'This failed run was not saved.' : '', cleanup ? 'Resource cleanup is uncertain.' : ''].filter(Boolean).join(' '));
  }

  function operationIsReserved(): boolean {
    if (!reservation.current) return false;
    return true;
  }

  function publish(run: CompleteRun | FailedRun): void {
    if (run.status === 'completed') {
      if (run.runId !== held.current.complete?.runId) {
        moveResultsFocus.current = !!resultsContent.current?.contains(document.activeElement);
        setSelectedResult(null);
      }
      held.current = { complete: run, failed: null };
      setComplete(run);
      setFailed(null);
      setAnnouncement(`Analysis completed: ${countText(run.scan.findings.length, 'finding')} and ${countText(run.scan.scannerReviewObservations.length, 'item')} need manual review.`);
      return;
    }

    held.current = { complete: held.current.complete, failed: run };
    setFailed(run);
    setAnnouncement('Analysis could not be completed.');
  }

  async function execute(callback: () => Promise<unknown>, intent: AnalyzeIntent): Promise<void> {
    const token = {};
    const known = held.current;
    held.current = { complete: known.complete, failed: null };
    reservation.current = token;
    setBusy(true);
    setError(null);
    setFailed(null);
    setAnnouncement('Analysis started.');
    try {
      const raw = await callback();
      if (!mounted.current || reservation.current !== token) return;
      const outcome = admit(raw);
      // Reflection can run Proxy traps, including trusted code that unmounts App.
      if (!mounted.current || reservation.current !== token) return;
      if (!outcome) { showError('invalid-result'); return; }
      const run = outcome.run;
      if (run && (run.requestedUrl !== intent.requestedUrl ||
          !sameProvider(run.providerContext, intent.providerContext) || run.runId === known.complete?.runId ||
          run.runId === known.failed?.runId)) {
        showError('invalid-result');
        return;
      }
      if (run) publish(run);
      if (!outcome.ok) showError(outcome.error, !outcome.persisted, outcome.cleanupFailed);
    } catch {
      if (mounted.current && reservation.current === token) showError('request-failed');
    } finally {
      if (mounted.current && reservation.current === token) {
        reservation.current = null;
        setBusy(false);
      }
    }
  }

  function analyze(intent: AnalyzeIntent): void {
    if (operationIsReserved()) return;
    const callback = props.analyze;
    if (!callback) return;
    void execute(() => callback(intent), intent);
  }

  function selectResult(selection: ResultSelection, label: string): void {
    if (!complete) return;
    const exists = selection.kind === 'finding'
      ? complete.scan.findings.some(item => item.findingId === selection.findingId)
      : Number.isInteger(selection.observationIndex) &&
        complete.scan.scannerReviewObservations[selection.observationIndex] !== undefined;
    if (!exists) return;
    setSelectedResult(selection);
    setAnnouncement(`Selected ${label}.`);
  }

  const capability = !props.analyze ? 'Analyze is unavailable in this build; service integration is pending.' : '';
  const displayedRun = complete ?? failed;
  const failedIsDisplayed = displayedRun?.status === 'failed';

  return <main>
    <AnalyzeSection available={!!props.analyze} busy={busy} capability={capability}
      configuration={props.configuration} error={failedIsDisplayed ? null : error}
      announcement={announcement} onOperationReserved={operationIsReserved}
      onAnalyze={analyze} onAnnounce={setAnnouncement} />
    {displayedRun && <ResultsSection run={displayedRun}
      selectedResult={selectedResult} failure={failedIsDisplayed ? error : null}
      headingRef={resultsHeading} contentRef={resultsContent} onSelect={selectResult} />}
  </main>;
}
