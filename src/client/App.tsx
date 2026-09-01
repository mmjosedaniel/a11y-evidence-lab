import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { PageAnalysisRun } from '../server/domain/run-contract.ts';
import { TARGET_NOTICE, TargetAnalysisForm } from './RunControls.tsx';
import type { AnalyzeIntent } from './RunControls.tsx';
import { RunResults } from './RunResults.tsx';
import { admit, sameProvider } from './run-admission.ts';

export type { AnalyzeIntent } from './RunControls.tsx';

export interface AppProps {
  readonly analyze?: (intent: AnalyzeIntent) => Promise<unknown>;
}

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;

const resultsNotice = 'This automated scan covers only image-alt, label and color-contrast in the current rendered top-level document. Iframes, inactive states and other rules are excluded. Findings and counts do not establish accessibility, conformance, certification or legal compliance.';
const busyNotice = 'An operation is in progress.';

export function App(props: AppProps): ReactElement {
  const [busy, setBusy] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<AnalyzeIntent | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState<{ text: string; unsaved: boolean; cleanup: boolean } | null>(null);
  const [complete, setComplete] = useState<CompleteRun | null>(null);
  const [failed, setFailed] = useState<FailedRun | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectionRequest, setSelectionRequest] = useState(0);
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
    setAnnouncement(busyNotice);
    return true;
  }

  function publish(run: CompleteRun | FailedRun): void {
    if (run.status === 'completed') {
      if (run.runId !== held.current.complete?.runId) {
        moveResultsFocus.current = !!resultsContent.current?.contains(document.activeElement);
        setSelectedId(null);
      }
      held.current = { complete: run, failed: null };
      setComplete(run);
      setFailed(null);
      setAnnouncement(`Completed scan: ${run.scan.findings.length} Findings. ${run.scan.scannerReviewObservations.length} scanner-review observations. No provider call was attempted.`);
    } else {
      held.current = { complete: held.current.complete, failed: run };
      setFailed(run);
      setAnnouncement(`Run ${run.runId} failed: ${run.failure.category}. No provider call was attempted.`);
    }
  }

  async function execute(callback: () => Promise<unknown>, intent: AnalyzeIntent): Promise<void> {
    const token = {};
    const known = held.current;
    reservation.current = token;
    setBusy(true);
    setPendingAnalysis(intent);
    setError(null);
    setAnnouncement('Analyzing the requested page. No provider call was attempted.');
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
      if (!outcome.ok) showError(outcome.error, run !== null && !outcome.persisted, outcome.cleanupFailed);
    } catch {
      if (mounted.current && reservation.current === token) showError('request-failed');
    } finally {
      if (mounted.current && reservation.current === token) {
        reservation.current = null;
        setBusy(false);
        setPendingAnalysis(null);
      }
    }
  }

  function analyze(intent: AnalyzeIntent): void {
    if (operationIsReserved()) return;
    const callback = props.analyze;
    if (!callback) return;
    void execute(() => callback(intent), intent);
  }

  function selectFinding(id: string): void {
    const finding = complete?.scan.findings.find(item => item.findingId === id);
    if (!complete || !finding) return;
    setSelectedId(id);
    setSelectionRequest(value => value + 1);
    const provider = complete.providerContext;
    setAnnouncement(`Selected Finding ${id}, ${finding.ruleId}, unprocessed. ${provider.mode}, ${provider.provider}, ${provider.model}. No provider call was attempted.`);
  }

  const capability = !props.analyze ? 'Analyze is unavailable in this build; service integration is pending.' : '';

  return <main>
    <section aria-labelledby="setup-heading" className="setup">
      <h1 id="setup-heading">Analyze a page</h1>
      <p id="target-notice" className="limitation">{TARGET_NOTICE}</p>
      {capability && <p id="capability" className="notice">{capability}</p>}
      <TargetAnalysisForm available={!!props.analyze} busy={busy} pending={pendingAnalysis !== null}
        error={error} onOperationReserved={operationIsReserved}
        onAnalyze={analyze} onAnnounce={setAnnouncement} />
      {busy && <p id="busy-notice" className="notice">{busyNotice}</p>}
      {pendingAnalysis && <section aria-labelledby="pending-analysis-heading" className="notice">
        <h3 id="pending-analysis-heading">Pending analysis</h3>
        <p>Mode: {pendingAnalysis.providerContext.mode}. Provider: {pendingAnalysis.providerContext.provider}. Model: {pendingAnalysis.providerContext.model}.</p>
        <p>No provider call was attempted.</p>
      </section>}
      <p role="status" aria-atomic="true" className="status">{announcement}</p>
    </section>
    {failed && <section aria-labelledby="history-heading" className="run-history">
      <h2 id="history-heading">Failed run</h2>
      <RunResults key={failed.runId} run={failed} />
    </section>}
    <section aria-labelledby="results-heading" className="results">
      <h2 id="results-heading" tabIndex={-1} ref={resultsHeading}>Results</h2>
      <p className="limitation">{resultsNotice}</p>
      {complete && <p className="limitation">{TARGET_NOTICE}</p>}
      <div ref={resultsContent}>
        {complete && <RunResults key={complete.runId} run={complete} selectedId={selectedId}
          selectionRequest={selectionRequest} onSelect={selectFinding} />}
      </div>
    </section>
  </main>;
}
