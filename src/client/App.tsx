import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { PageAnalysisRun } from '../server/domain/run-contract.ts';
import { AnalyzeSection } from './components/analysis/AnalyzeSection.tsx';
import type { AnalysisConfiguration, AnalysisError, AnalyzeIntent } from './components/analysis/analysisTypes.ts';
import { ResultsSection } from './components/results/ResultsSection.tsx';
import type { ResultSelection } from './components/results/resultPresentation.ts';
import { admit, sameProvider } from './run-admission.ts';
import { admitGuidance } from './finding-guidance-admission.ts';
import type { GuidanceIntent } from './finding-guidance-admission.ts';
import type { GuidancePresentation } from './components/results/FindingGuidance.tsx';
import { admitGeneration } from './finding-generation-admission.ts';
import type { GenerationIntent } from './finding-generation-admission.ts';
import { generationAnnouncement } from './components/results/FindingGeneration.tsx';
import type { GenerationPresentation } from './components/results/FindingGeneration.tsx';

export type { AnalyzeIntent } from './components/analysis/analysisTypes.ts';

export interface AppProps {
  readonly analyze?: (intent: AnalyzeIntent) => Promise<unknown>;
  readonly configuration?: AnalysisConfiguration;
  readonly retrieveFinding?: (intent: GuidanceIntent) => Promise<unknown>;
  readonly generateFinding?: (intent: GenerationIntent, signal: AbortSignal) => Promise<unknown>;
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
  const [guidance, setGuidance] = useState<Readonly<Record<string, GuidancePresentation>>>({});
  const guidanceRef = useRef<Readonly<Record<string, GuidancePresentation>>>({});
  const [ownerKnown, setOwnerKnown] = useState(false);
  const retainedOwner = useRef(false);
  const continuation = useRef<{ run: CompleteRun; findingId: string } | null>(null);
  const [generation, setGeneration] = useState<Readonly<Record<string, GenerationPresentation>>>({});
  const generationRef = useRef<Readonly<Record<string, GenerationPresentation>>>({});
  const stopGeneration = useRef<(() => void) | null>(null);
  const mounted = useRef(true);
  const resultsContent = useRef<HTMLDivElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const moveResultsFocus = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      reservation.current = null;
      continuation.current = null;
      stopGeneration.current?.();
      stopGeneration.current = null;
    };
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

  function retainOwner(): void {
    retainedOwner.current = true;
    setOwnerKnown(true);
  }

  function updateGuidance(findingId: string, state: GuidancePresentation): void {
    guidanceRef.current = { ...guidanceRef.current, [findingId]: state };
    setGuidance(guidanceRef.current);
  }

  function publish(run: CompleteRun | FailedRun): void {
    if (run.status === 'completed') {
      if (run.runId !== held.current.complete?.runId) {
        moveResultsFocus.current = !!resultsContent.current?.contains(document.activeElement);
        setSelectedResult(null);
        guidanceRef.current = {};
        setGuidance(guidanceRef.current);
        continuation.current = null;
        // A new validated analysis replaces this run's consumed generation context;
        // it does not assert that a previous provider operation was cancelled.
        if (Object.keys(generationRef.current).length > 0) {
          retainedOwner.current = false;
          setOwnerKnown(false);
        }
        generationRef.current = {};
        setGeneration(generationRef.current);
      }
      if (run.scan.findings.some(finding => finding.state === 'active')) retainOwner();
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
      if (!outcome.ok) {
        if (outcome.cleanupFailed) retainOwner();
        showError(outcome.error, !outcome.persisted, outcome.cleanupFailed);
      }
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

  async function retrieveFinding(findingId: string, label: string): Promise<void> {
    const run = held.current.complete;
    const finding = run?.scan.findings.find(item => item.findingId === findingId);
    if (reservation.current || retainedOwner.current || !run || !finding || finding.state !== 'unprocessed' ||
        guidanceRef.current[findingId]?.attempted) return;
    const callback = props.retrieveFinding;
    if (!callback) return;
    const token = {};
    reservation.current = token;
    updateGuidance(findingId, { attempted: true, pending: true });
    setBusy(true);
    setAnnouncement(`Retrieving guidance for ${label}.`);
    const current = (): boolean => mounted.current && reservation.current === token && held.current.complete === run;
    const fail = (error: string, unsaved = false, cleanup = false): void => {
      updateGuidance(findingId, { attempted: true, error, unsaved, cleanup });
      if (cleanup) retainOwner();
      setAnnouncement(`Guidance failed for ${label}: ${error}.${unsaved ? ' This guidance attempt was not saved.' : ''}${cleanup ? ' Resource cleanup is uncertain.' : ''}`);
    };
    try {
      const raw = await callback({ runId: run.runId, findingId });
      if (!current()) return;
      const outcome = admitGuidance(raw, run, findingId);
      // Descriptor reflection may reenter or unmount App; ownership must still be ours.
      if (!current()) return;
      if (!outcome) { fail('invalid-result'); return; }
      if (outcome.run) {
        held.current = { ...held.current, complete: outcome.run };
        setComplete(outcome.run);
        if (outcome.run.scan.findings.some(item => item.state === 'active')) retainOwner();
      }
      if (!outcome.ok) { fail(outcome.error, !outcome.persisted, outcome.cleanupFailed); return; }
      updateGuidance(findingId, { attempted: true, view: outcome.view });
      const selected = outcome.run.scan.findings.find(item => item.findingId === findingId);
      if (selected?.state === 'active' && 'retrieval' in selected && selected.retrieval.status === 'completed'
          && 'support' in selected.retrieval && selected.retrieval.support.state === 'supported'
          && !('generation' in selected) && !('result' in selected)) {
        continuation.current = { run: outcome.run, findingId };
      }
      setAnnouncement(selected?.state === 'abstained'
        ? `No proposal generated for ${label}. No generation provider was called.`
        : `Guidance ready for ${label}.`);
    } catch {
      if (current()) fail('request-failed');
    } finally {
      if (mounted.current && reservation.current === token) {
        reservation.current = null;
        setBusy(false);
      }
    }
  }

  async function generateFinding(findingId: string, label: string): Promise<void> {
    const run = held.current.complete;
    if (!mounted.current || reservation.current || !run || generationRef.current[findingId]
        || continuation.current?.run !== run || continuation.current.findingId !== findingId) return;
    const token = {};
    const controller = new AbortController();
    const expires = performance.now() + 120000;
    reservation.current = token;
    continuation.current = null;
    const update = (state: GenerationPresentation): void => {
      generationRef.current = { ...generationRef.current, [findingId]: state };
      setGeneration(generationRef.current);
    };
    update({ status: 'pending' });
    setBusy(true);
    setAnnouncement(`${label}. ${generationAnnouncement(run.providerContext, findingId, { status: 'pending' })}`);
    const current = (): boolean => mounted.current && reservation.current === token && held.current.complete === run;
    const unknown = (error: Extract<GenerationPresentation, { status: 'unknown' }>['error']): void => {
      if (!current()) return;
      update({ status: 'unknown', error });
      retainOwner();
      reservation.current = null;
      setBusy(false);
      setAnnouncement(`${label}. ${generationAnnouncement(run.providerContext, findingId, { status: 'unknown', error })}`);
      controller.abort();
    };
    const timer = window.setTimeout(() => unknown('timeout'), 120000);
    const stop = (): void => { window.clearTimeout(timer); controller.abort(); };
    stopGeneration.current = stop;
    const timely = (): boolean => {
      if (!current()) return false;
      if (performance.now() >= expires) { unknown('timeout'); return false; }
      return true;
    };
    try {
      // The continuation and action are consumed before callback property reflection.
      const callback = props.generateFinding;
      if (!timely()) return;
      if (typeof callback !== 'function') { unknown('unavailable'); return; }
      const raw = await callback({ runId: run.runId, findingId }, controller.signal);
      if (!timely()) return;
      const outcome = admitGeneration(raw, run, findingId);
      if (!timely()) return;
      if (!outcome) { unknown('invalid-result'); return; }
      update({ status: 'settled', outcome });
      if (outcome.run) {
        held.current = { ...held.current, complete: outcome.run };
        setComplete(outcome.run);
      }
      if (outcome.ok || (outcome.persisted && !outcome.cleanupFailed)) {
        retainedOwner.current = false;
        setOwnerKnown(false);
      } else {
        retainOwner();
      }
      setAnnouncement(`${label}. ${generationAnnouncement(run.providerContext, findingId, { status: 'settled', outcome })}`);
    } catch {
      unknown('request-failed');
    } finally {
      window.clearTimeout(timer);
      if (stopGeneration.current === stop) stopGeneration.current = null;
      if (mounted.current && reservation.current === token) {
        reservation.current = null;
        setBusy(false);
      }
    }
  }

  function selectResult(selection: ResultSelection, label: string): void {
    if (!complete) return;
    const exists = selection.kind === 'finding'
      ? complete.scan.findings.some(item => item.findingId === selection.findingId)
      : Number.isInteger(selection.observationIndex) &&
        complete.scan.scannerReviewObservations[selection.observationIndex] !== undefined;
    if (!exists) return;
    setSelectedResult(selection);
    const finding = selection.kind === 'finding'
      ? complete.scan.findings.find(item => item.findingId === selection.findingId) : null;
    const provider = complete.providerContext;
    const generationState = finding ? generationRef.current[finding.findingId] : undefined;
    const eligible = finding && continuation.current?.run === complete && continuation.current.findingId === finding.findingId;
    setAnnouncement(finding?.state === 'abstained'
      ? `Selected ${label}. No proposal generated. Unused generation configuration: ${provider.mode}, ${provider.provider}, ${provider.model}. No generation provider was called.`
      : finding && (generationState || eligible)
        ? `Selected ${label}. ${generationAnnouncement(provider, finding.findingId, generationState ?? null)}`
        : `Selected ${label}.`);
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
      guidance={{ available: !!props.retrieveFinding, busy, ownerKnown, presentations: guidance,
        onRetrieve: (findingId, label) => { void retrieveFinding(findingId, label); } }}
      generation={{ busy, eligibleFindingId: continuation.current?.run === complete ? continuation.current.findingId : null,
        presentations: generation, onGenerate: (findingId, label) => { void generateFinding(findingId, label); } }}
      headingRef={resultsHeading} contentRef={resultsContent} onSelect={selectResult} />}
  </main>;
}
