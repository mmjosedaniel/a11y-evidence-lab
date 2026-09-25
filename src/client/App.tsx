import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { PageAnalysisRun } from '../server/domain/run-contract.ts';
import { AnalyzeSection } from './components/analysis/AnalyzeSection.tsx';
import type { AnalysisConfiguration, AnalysisError, AnalyzeIntent } from './components/analysis/analysisTypes.ts';
import { ResultsSection } from './components/results/ResultsSection.tsx';
import { useResultsFocus } from './components/results/useResultsFocus.ts';
import type { ResultSelection } from './components/results/resultPresentation.ts';
import { admit, sameProvider } from './analysis/run-admission.ts';
import { executeGuidanceRequest } from './findings/guidance-request.ts';
import type { GuidanceIntent } from './findings/finding-guidance-admission.ts';
import type { GuidancePresentation } from './components/results/FindingGuidance.tsx';
import { createGenerationRequest } from './findings/generation-request.ts';
import type { GenerationIntent } from './findings/finding-generation-admission.ts';
import { finalReviewStatus, generationAnnouncement, reviewedAnnouncement } from './components/results/FindingGeneration.tsx';
import type { GenerationPresentation } from './components/results/FindingGeneration.tsx';
import { createRescanRequest } from './rescan/rescan-request.ts';
import type { RescanCallback, RescanPresentation } from './rescan/rescan-request.ts';
import { comparisonFeedback, rescanAnnouncement } from './components/results/IntentionalRescanForm.tsx';
import { availabilityText } from './components/results/comparisonPresentation.ts';
import { createComparisonRequest } from './comparison/comparison-request.ts';
import type { ComparisonAvailability, ComparisonReadCallback } from './comparison/comparison-request.ts';
import { createReviewRequest, reviewRefusalText } from './review/review-request.ts';
import type { ReviewCallback, ReviewPresentation } from './review/review-request.ts';

export type { AnalyzeIntent } from './components/analysis/analysisTypes.ts';

export interface AppProps {
  readonly analyze?: (intent: AnalyzeIntent) => Promise<unknown>;
  readonly configuration?: AnalysisConfiguration;
  readonly retrieveFinding?: (intent: GuidanceIntent) => Promise<unknown>;
  readonly generateFinding?: (intent: GenerationIntent, signal: AbortSignal) => Promise<unknown>;
  readonly reviewFinding?: ReviewCallback;
  readonly rescanFinding?: RescanCallback;
  readonly readComparisonRun?: ComparisonReadCallback;
}

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
interface BaselinePreview {
  readonly run: CompleteRun;
  readonly selection: ResultSelection | null;
  readonly guidance: Readonly<Record<string, GuidancePresentation>>;
  readonly generation: Readonly<Record<string, GenerationPresentation>>;
}
const baselineNotice = 'Baseline evidence — read-only. Return to later results to continue.';

function countText(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}

export function App(props: AppProps): ReactElement {
  const currentProps = useRef(props);
  currentProps.current = props;
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
  const stopReview = useRef<(() => void) | null>(null);
  const reviewOwner = useRef(false);
  const [reviewLocked, setReviewLocked] = useState(false);
  const [reviews, setReviews] = useState<Readonly<Record<string, ReviewPresentation>>>({});
  const [rescan, setRescan] = useState<RescanPresentation | null>(null);
  const [submittedRescan, setSubmittedRescan] = useState<{
    baselineRunId: string; findingId: string; mode: 'local' | 'groq';
  } | null>(null);
  const rescanOwner = useRef(false);
  const [rescanLocked, setRescanLocked] = useState(false);
  const stopRescan = useRef<(() => void) | null>(null);
  const [baselinePreview, setBaselinePreview] = useState<BaselinePreview | null>(null);
  const [comparisonAvailability, setComparisonAvailability] = useState<ComparisonAvailability>({ status: 'unverified' });
  const availability = useRef<ComparisonAvailability>({ status: 'unverified' });
  const comparisonReadOwner = useRef<object | null>(null);
  const stopComparison = useRef<(() => void) | null>(null);
  const [completedComparisonFeedback, setCompletedComparisonFeedback] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const previewing = useRef(false);
  const [previewSelection, setPreviewSelection] = useState<ResultSelection | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      reservation.current = null;
      continuation.current = null;
      stopGeneration.current?.();
      stopGeneration.current = null;
      stopReview.current?.();
      stopReview.current = null;
      stopRescan.current?.();
      stopRescan.current = null;
      comparisonReadOwner.current = null;
      stopComparison.current?.();
      stopComparison.current = null;
    };
  }, []);

  const { resultsContent, resultsHeading, captureComparisonRemovalFocus, captureReplacementFocus,
    requestResultsFocus, attachReviewForm, captureSavedReviewFocus, clearSavedFocus, resetReviewFocus, takeSavedFocus
  } = useResultsFocus(complete, preview, comparisonAvailability, () => previewing.current);

  function showError(code: string, unsaved = false, cleanup = false): void {
    const text = `Analyze failed: ${code}.`;
    setError({ text, unsaved, cleanup });
    setAnnouncement([text, unsaved ? 'This failed run was not saved.' : '', cleanup ? 'Resource cleanup is uncertain.' : ''].filter(Boolean).join(' '));
  }

  function operationIsReserved(): boolean {
    return !!reservation.current || reviewOwner.current || rescanOwner.current;
  }

  function retainOwner(): void {
    retainedOwner.current = true;
    setOwnerKnown(true);
  }

  function updateGuidance(findingId: string, state: GuidancePresentation): void {
    guidanceRef.current = { ...guidanceRef.current, [findingId]: state };
    setGuidance(guidanceRef.current);
  }

  function stopComparisonRead(): void {
    comparisonReadOwner.current = null;
    stopComparison.current?.();
    stopComparison.current = null;
  }

  function refreshComparison(run: CompleteRun): void {
    stopComparisonRead();
    if (!run.comparison) return;
    const token = {};
    comparisonReadOwner.current = token;
    // The active run identity survives legitimate downstream aggregate replacement.
    // The read request validates its captured native evidence and returns metadata only.
    const request = createComparisonRequest({ run,
      current: () => mounted.current && comparisonReadOwner.current === token
        && held.current.complete?.runId === run.runId,
      readCallback: () => currentProps.current.readComparisonRun,
      settle: result => {
        comparisonReadOwner.current = null;
        stopComparison.current = null;
        availability.current = result;
        setComparisonAvailability(result);
        if (result.status !== 'available') {
          captureComparisonRemovalFocus();
          previewing.current = false;
          setPreview(false);
          if (result.status === 'unavailable') setBaselinePreview(null);
        }
        const notice = availabilityText(result);
        if (notice) setAnnouncement(notice);
      },
    });
    stopComparison.current = request.stop;
    request.start();
  }

  function publish(run: CompleteRun | FailedRun, completionAnnouncement?: string): void {
    if (run.status === 'completed') {
      if (run.runId !== held.current.complete?.runId) {
        stopComparisonRead();
        availability.current = { status: 'unverified' };
        setComparisonAvailability(availability.current);
        captureReplacementFocus();
        setSelectedResult(null);
        setReviews({});
        clearSavedFocus();
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
      setAnnouncement(completionAnnouncement ?? `Analysis completed: ${countText(run.scan.findings.length, 'finding')} and ${countText(run.scan.scannerReviewObservations.length, 'item')} need manual review.`);
      if (run.comparison) refreshComparison(run);
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
    stopComparisonRead();
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
      if (run) {
        if (run.status === 'completed') {
          previewing.current = false;
          setPreview(false);
          setBaselinePreview(null);
          setRescan(null);
          setSubmittedRescan(null);
          setCompletedComparisonFeedback(null);
        }
        publish(run);
      }
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
    if (previewing.current || rescanOwner.current || reservation.current || reviewOwner.current || retainedOwner.current || !run || !finding || finding.state !== 'unprocessed' ||
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
    await executeGuidanceRequest({ run, findingId, callback, current, fail,
      settle: outcome => {
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
      },
      cleanup: () => {
        if (mounted.current && reservation.current === token) {
          reservation.current = null;
          setBusy(false);
        }
      },
    });
  }

  async function generateFinding(findingId: string, label: string): Promise<void> {
    const run = held.current.complete;
    if (!mounted.current || previewing.current || rescanOwner.current || reservation.current || reviewOwner.current || !run || generationRef.current[findingId]
        || continuation.current?.run !== run || continuation.current.findingId !== findingId) return;
    const token = {};
    const request = createGenerationRequest({ run, findingId,
      current: () => mounted.current && reservation.current === token && held.current.complete === run,
      readCallback: () => props.generateFinding,
      unknown: error => {
        update({ status: 'unknown', error });
        retainOwner();
        reservation.current = null;
        setBusy(false);
        setAnnouncement(`${label}. ${generationAnnouncement(run.providerContext, findingId, { status: 'unknown', error })}`);
      },
      settle: outcome => {
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
      },
      cleanup: stop => {
        if (stopGeneration.current === stop) stopGeneration.current = null;
        // Successful settlement replaces the run object but still owns this token.
        if (mounted.current && reservation.current === token) {
          reservation.current = null;
          setBusy(false);
        }
      },
    });
    reservation.current = token;
    continuation.current = null;
    const update = (state: GenerationPresentation): void => {
      generationRef.current = { ...generationRef.current, [findingId]: state };
      setGeneration(generationRef.current);
    };
    update({ status: 'pending' });
    setBusy(true);
    setAnnouncement(`${label}. ${generationAnnouncement(run.providerContext, findingId, { status: 'pending' })}`);
    stopGeneration.current = request.stop;
    await request.start();
  }

  function reviewBlocked(): boolean {
    return !mounted.current || previewing.current || rescanOwner.current || !!reservation.current || reviewOwner.current || retainedOwner.current;
  }

  function reviewFinding(findingId: string, label: string, review: unknown): void {
    const run = held.current.complete;
    if (reviewBlocked() || !run) return;
    const token = {};
    reservation.current = token;
    reviewOwner.current = true;
    setReviewLocked(true);
    setBusy(true);
    setReviews(previous => ({ ...previous, [findingId]: { status: 'pending' } }));
    const provider = run.providerContext;
    const provenance = `${provider.mode}, ${provider.provider}, ${provider.model}. The original proposal and provider invocation remain saved.`;
    setAnnouncement(`${label}. Saving decision. ${provenance}`);
    const request = createReviewRequest({ baseline: run, intent: { runId: run.runId, findingId, review },
      current: () => mounted.current && reservation.current === token && held.current.complete === run,
      readCallback: () => props.reviewFinding,
      settle: result => {
        // The request owner terminalizes before this shared state publication.
        reservation.current = null;
        stopReview.current = null;
        setBusy(false);
        const retained = result.status === 'unknown' || (result.status === 'refused' && !result.released);
        reviewOwner.current = retained;
        setReviewLocked(retained);
        if (result.status === 'saved') {
          captureSavedReviewFocus(findingId);
          held.current = { ...held.current, complete: result.run };
          setComplete(result.run);
          const finding = result.run.scan.findings.find(item => item.findingId === findingId)!;
          setAnnouncement(`${label}. Saved review decision. ${reviewedAnnouncement(finding, provider)}`);
        } else {
          setReviews(previous => ({ ...previous, [findingId]: result }));
          setAnnouncement(`${label}. ${result.status === 'unknown'
            ? 'Save outcome unknown. The decision may have been saved. Further actions are blocked.'
            : `Review refused. ${reviewRefusalText(result)}`} ${provenance}`);
        }
      },
    });
    stopReview.current = request.stop;
    request.start();
  }

  function rescanBlocked(): boolean {
    return !mounted.current || previewing.current || operationIsReserved()
      || (!!held.current.complete?.comparison && availability.current.status !== 'available')
      || Object.values(guidanceRef.current).some(state => state.cleanup)
      || Object.values(generationRef.current).some(state => state.status === 'unknown'
        || (state.status === 'settled' && !state.outcome.ok && state.outcome.cleanupFailed));
  }

  function rescanFinding(baselineRunId: string, findingId: string, mode: 'local' | 'groq'): void {
    const run = held.current.complete;
    if (rescanBlocked() || !run || run.runId !== baselineRunId
        || !run.scan.findings.some(finding => finding.findingId === findingId)) return;
    const token = {};
    stopComparisonRead();
    reservation.current = token;
    rescanOwner.current = true;
    setRescanLocked(true);
    setBusy(true);
    const current = (): boolean => mounted.current && reservation.current === token && held.current.complete === run;
    // Capture data only; preview never owns a continuation or a request capability.
    const captured: BaselinePreview = { run, selection: selectedResult,
      guidance: guidanceRef.current, generation: generationRef.current };
    const pending: RescanPresentation = { status: 'pending' };
    setSubmittedRescan({ baselineRunId, findingId, mode });
    setRescan(pending);
    setCompletedComparisonFeedback(null);
    setAnnouncement(rescanAnnouncement(pending));
    let runId: string;
    try {
      runId = `run-${crypto.randomUUID()}`;
      if (!current()) return;
    } catch {
      if (!current()) return;
      const refused: RescanPresentation = { status: 'refused', error: 'invalid-request', cleanup: false,
        released: true, run: null, persisted: false };
      reservation.current = null;
      rescanOwner.current = false;
      setRescanLocked(false);
      setBusy(false);
      setRescan(refused);
      setSubmittedRescan(null);
      setAnnouncement(rescanAnnouncement(refused));
      return;
    }
    const request = createRescanRequest({ baseline: run, intent: { runId, baselineRunId, findingId, mode },
      current, readCallback: () => props.rescanFinding,
      settle: result => {
        reservation.current = null;
        stopRescan.current = null;
        setBusy(false);
        const retained = result.status === 'unknown' || (result.status === 'refused' && !result.released)
          || (result.status === 'completed' && !!result.comparisonFailure && !result.comparisonFailure.released);
        rescanOwner.current = retained;
        setRescanLocked(retained);
        if (!retained) setSubmittedRescan(null);
        if (result.status !== 'completed') {
          setRescan(result);
          setAnnouncement(rescanAnnouncement(result));
          return;
        }
        continuation.current = null;
        retainedOwner.current = false;
        setOwnerKnown(false);
        reviewOwner.current = false;
        setReviewLocked(false);
        resetReviewFocus();
        setRescan(null);
        setError(null);
        setBaselinePreview(captured);
        previewing.current = false;
        setPreview(false);
        const feedback = comparisonFeedback(result);
        setCompletedComparisonFeedback(result.comparisonFailure ? feedback : null);
        // Finalize this settlement before the reader can settle or start a newer operation.
        publish(result.run, feedback);
      },
    });
    stopRescan.current = request.stop;
    request.start();
  }

  function navigatePreview(show: boolean): void {
    if (!baselinePreview) return;
    if (show && held.current.complete?.comparison && availability.current.status !== 'available') return;
    previewing.current = show;
    if (show) setPreviewSelection(baselinePreview.selection);
    requestResultsFocus();
    setPreview(show);
    setAnnouncement(show ? baselineNotice : 'Later results.');
    if (held.current.complete?.comparison) refreshComparison(held.current.complete);
  }

  function selectResult(selection: ResultSelection, label: string): void {
    if (previewing.current && baselinePreview) {
      setPreviewSelection(selection);
      setAnnouncement(`Selected ${label}. ${baselineNotice}`);
      return;
    }
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
      : finding && finalReviewStatus(finding)
        ? `Selected ${label}. ${reviewedAnnouncement(finding, provider)}`
      : finding && (generationState || eligible)
        ? `Selected ${label}. ${generationAnnouncement(provider, finding.findingId, generationState ?? null)}`
        : `Selected ${label}.`);
  }

  const capability = !props.analyze ? 'Analyze is unavailable in this build; service integration is pending.' : '';
  const displayedRun = preview && baselinePreview ? baselinePreview.run : complete ?? failed;
  const failedIsDisplayed = displayedRun?.status === 'failed';
  const verifiedPreview = !complete?.comparison || comparisonAvailability.status === 'available';

  return <main>
    <AnalyzeSection available={!!props.analyze} busy={busy || reviewLocked || rescanLocked} capability={capability}
      configuration={props.configuration} error={failedIsDisplayed ? null : error}
      announcement={announcement} onOperationReserved={operationIsReserved}
      onAnalyze={analyze} onAnnounce={setAnnouncement} />
    {displayedRun && <ResultsSection run={displayedRun}
      selectedResult={preview ? previewSelection : selectedResult} readOnly={preview}
      comparison={{ availability: comparisonAvailability, baseline: verifiedPreview ? baselinePreview?.run : undefined }}
      navigation={baselinePreview && verifiedPreview && <div className="rescan-navigation">
        {preview && <p>{baselineNotice}</p>}
        <button type="button" onClick={() => navigatePreview(!preview)}>{preview ? 'Return to later results' : 'Return to baseline'}</button>
      </div>}
      rescan={{ blocked: rescanBlocked(), presentation: rescan, onAnnounce: setAnnouncement,
        comparisonFeedback: completedComparisonFeedback,
        blockedReason: complete?.comparison ? availabilityText(comparisonAvailability) : null,
        submitted: submittedRescan?.baselineRunId === displayedRun.runId ? submittedRescan : null,
        onSubmit: (findingId, mode) => { if (displayedRun.status === 'completed') rescanFinding(displayedRun.runId, findingId, mode); } }}
      failure={failedIsDisplayed ? error : null}
      guidance={{ available: !!props.retrieveFinding, busy: busy || reviewLocked || rescanLocked, ownerKnown, presentations: preview && baselinePreview ? baselinePreview.guidance : guidance,
        onRetrieve: (findingId, label) => { void retrieveFinding(findingId, label); } }}
      generation={{ busy: busy || reviewLocked || rescanLocked, eligibleFindingId: !preview && continuation.current?.run === complete ? continuation.current.findingId : null,
        presentations: preview && baselinePreview ? baselinePreview.generation : generation, onGenerate: (findingId, label) => { void generateFinding(findingId, label); } }}
      review={{ busy: busy || reviewLocked || rescanLocked || ownerKnown, presentations: reviews, isBlocked: reviewBlocked,
        onSubmit: reviewFinding, onAnnounce: setAnnouncement, takeSavedFocus, attachForm: attachReviewForm }}
      headingRef={resultsHeading} contentRef={resultsContent} onSelect={selectResult} />}
  </main>;
}
