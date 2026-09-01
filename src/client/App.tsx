import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';
import { validateRun } from '../server/domain/run-contract.ts';
import type { PageAnalysisRun, ProviderContext } from '../server/domain/run-contract.ts';
import { RunResults } from './RunResults.tsx';

export interface AnalyzeIntent {
  readonly requestedUrl: string;
  readonly providerContext: ProviderContext;
}
export interface AppProps {
  readonly analyze?: (intent: AnalyzeIntent) => Promise<unknown>;
  readonly reopen?: (runId: string) => Promise<unknown>;
}

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type IncompleteRun = Exclude<PageAnalysisRun, CompleteRun>;
type Stage = 'Analyze' | 'Reopen';
type Outcome =
  | { readonly ok: true; readonly run: PageAnalysisRun }
  | { readonly ok: false; readonly error: string; readonly run: IncompleteRun | null;
      readonly persisted: boolean; readonly cleanupFailed: boolean };

const targetNotice = 'Choose a non-sensitive public HTTPS page you are permitted to analyze and willing to trust. Hostile, private and authenticated targets are unsupported. The application does not prove authorization, public reachability or safety.';
const resultsNotice = 'This automated scan covers only image-alt, label and color-contrast in the current rendered top-level document. Iframes, inactive states and other rules are excluded. Findings and counts do not establish accessibility, conformance, certification or legal compliance.';
const localDisclosure = 'Local (recommended) — Ollama · qwen3.5:4b. Generation prompts and responses use the approved loopback Ollama endpoint and a locally present model, not hosted inference. The public-page scan still uses external HTTPS; this is not offline or system-wide zero-egress operation.';
const groqDisclosure = 'Groq — openai/gpt-oss-20b. A later explicit Generate action for one eligible Finding may send minimized rule-specific evidence and required curated-guidance passages to Groq for remote processing. Target URLs, locators, sibling Findings and credentials are excluded from that content. Selecting a mode or scanning makes no provider call.';
const busyNotice = 'An operation is in progress. Wait before analyzing or reopening another run.';
const urlError = 'Enter a valid HTTPS URL without embedded credentials.';
const modeError = 'Choose Local or Groq.';
const idError = 'Enter a run ID using 1–64 letters, numbers, underscores or hyphens, starting with a letter or number.';
const interruptedNotice = 'Interrupted stored run; not currently executing. It will not resume automatically.';
const analyzeErrors = ['invalid-request', 'busy', 'stopping', 'create-failed', 'scan-failed', 'result-validation', 'initial-persistence', 'shutdown'];
const reopenErrors = ['invalid-id', 'busy', 'stopping', 'not-found', 'invalid-run', 'stored-run-unavailable', 'read-failed'];

// Snapshot only own data descriptors. All later envelope reads use this local copy.
function snapshotEnvelope(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const prototype = Object.getPrototypeOf(raw);
  if (prototype !== Object.prototype && prototype !== null) return null;
  const copy: Record<string, unknown> = Object.create(null);
  for (const key of Reflect.ownKeys(raw)) {
    if (typeof key !== 'string') return null;
    const descriptor = Object.getOwnPropertyDescriptor(raw, key);
    if (!descriptor?.enumerable || !('value' in descriptor) || descriptor.value === undefined) return null;
    copy[key] = descriptor.value;
  }
  return copy;
}

function exactKeys(record: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(record).length === keys.length && keys.every(key => Object.hasOwn(record, key));
}

function admit(stage: Stage, raw: unknown): Outcome | null {
  try {
    const envelope = snapshotEnvelope(raw);
    if (!envelope) return null;
    if (envelope.ok === true) {
      if (!exactKeys(envelope, stage === 'Analyze' ? ['ok', 'run'] : ['ok', 'run', 'interrupted'])) return null;
      const result = validateRun(envelope.run);
      if (!result.ok) return null;
      if (stage === 'Analyze' && result.value.status !== 'completed') return null;
      if (stage === 'Reopen' && envelope.interrupted !== (result.value.status === 'running')) return null;
      return { ok: true, run: result.value };
    }
    if (envelope.ok !== false || typeof envelope.error !== 'string') return null;
    if (stage === 'Reopen') {
      if (!exactKeys(envelope, ['ok', 'error']) || !reopenErrors.includes(envelope.error)) return null;
      return { ok: false, error: envelope.error, run: null, persisted: false, cleanupFailed: false };
    }
    if (!exactKeys(envelope, ['ok', 'error', 'run', 'persisted', 'cleanupFailed']) ||
        !analyzeErrors.includes(envelope.error) || typeof envelope.persisted !== 'boolean' ||
        typeof envelope.cleanupFailed !== 'boolean') return null;
    let run: IncompleteRun | null = null;
    if (envelope.run !== null) {
      const result = validateRun(envelope.run);
      if (!result.ok || result.value.status !== 'failed') return null;
      run = result.value;
      if (run.scanContext.cleanup === 'failed' && !envelope.cleanupFailed) return null;
    } else if (envelope.persisted) return null;
    return { ok: false, error: envelope.error, run, persisted: envelope.persisted, cleanupFailed: envelope.cleanupFailed };
  } catch {
    return null;
  }
}

function sameProvider(left: ProviderContext, right: ProviderContext): boolean {
  return left.mode === right.mode && left.provider === right.provider && left.model === right.model;
}

function sameIdentity(held: PageAnalysisRun, incoming: PageAnalysisRun): boolean {
  return held.formatVersion === incoming.formatVersion && held.runId === incoming.runId &&
    held.createdAt === incoming.createdAt && held.applicationRevision === incoming.applicationRevision &&
    held.requestedUrl === incoming.requestedUrl && sameProvider(held.providerContext, incoming.providerContext);
}

function permitsRead(held: PageAnalysisRun, incoming: PageAnalysisRun): boolean {
  if (!sameIdentity(held, incoming)) return false;
  if (held.status !== 'running') return held.status === incoming.status;
  const previous = held.scanContext;
  const next = incoming.status === 'completed' ? incoming.scan.context : incoming.scanContext;
  const fixed = ['scannerVersion', 'evidencePolicyVersion', 'scope', 'readiness', 'locale', 'timeoutMs',
    'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'contrastProfile'] as const;
  if (!fixed.every(key => previous[key] === next[key]) ||
      !previous.rules.every((rule, index) => rule === next.rules[index]) ||
      previous.rules.length !== next.rules.length || previous.viewport.width !== next.viewport.width ||
      previous.viewport.height !== next.viewport.height) return false;
  if (incoming.status === 'running') return true;
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion'] as const) {
    const before = previous[key];
    const after = next[key];
    if ('value' in before && (!('value' in after) || before.value !== after.value)) return false;
  }
  return !previous.readinessReached || next.readinessReached;
}

function normalizeTarget(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function App(props: AppProps): ReactElement {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState<ProviderContext['mode'] | ''>('');
  const [runId, setRunId] = useState('');
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [invalidMode, setInvalidMode] = useState(false);
  const [invalidId, setInvalidId] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<AnalyzeIntent | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState<{ stage: Stage; text: string; unsaved: boolean; cleanup: boolean } | null>(null);
  const [complete, setComplete] = useState<CompleteRun | null>(null);
  const [incomplete, setIncomplete] = useState<IncompleteRun | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectionRequest, setSelectionRequest] = useState(0);
  const held = useRef<{ complete: CompleteRun | null; incomplete: IncompleteRun | null }>({ complete: null, incomplete: null });
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

  function showError(stage: Stage, code: string, unsaved = false, cleanup = false): void {
    const text = `${stage} failed: ${code}.`;
    setError({ stage, text, unsaved, cleanup });
    setAnnouncement([text, unsaved ? 'This failed run was not saved.' : '', cleanup ? 'Resource cleanup is uncertain.' : ''].filter(Boolean).join(' '));
  }

  function publish(run: PageAnalysisRun): void {
    if (run.status === 'completed') {
      if (run.runId !== held.current.complete?.runId) {
        moveResultsFocus.current = !!resultsContent.current?.contains(document.activeElement);
        setSelectedId(null);
      }
      held.current = { complete: run, incomplete: null };
      setComplete(run);
      setIncomplete(null);
      setAnnouncement(`Completed scan: ${run.scan.findings.length} Findings. ${run.scan.scannerReviewObservations.length} scanner-review observations. No provider call was attempted.`);
    } else {
      held.current = { complete: held.current.complete, incomplete: run };
      setIncomplete(run);
      setAnnouncement(run.status === 'running' ? interruptedNotice : `Run ${run.runId} failed: ${run.failure.category}. No provider call was attempted.`);
    }
  }

  async function execute(stage: Stage, callback: () => Promise<unknown>, intent: AnalyzeIntent | string): Promise<void> {
    const token = {};
    const known = held.current;
    reservation.current = token;
    setBusy(true);
    setPendingAnalysis(stage === 'Analyze' && typeof intent !== 'string' ? intent : null);
    setError(null);
    setAnnouncement(stage === 'Analyze' ? 'Analyzing the requested page. No provider call was attempted.' : 'Reopening the requested run. No provider call was attempted.');
    try {
      const raw = await callback();
      if (!mounted.current || reservation.current !== token) return;
      const outcome = admit(stage, raw);
      // Reflection can run Proxy traps, including trusted code that unmounts App.
      if (!mounted.current || reservation.current !== token) return;
      if (!outcome) { showError(stage, 'invalid-result'); return; }
      const run = outcome.run;
      if (run && stage === 'Analyze') {
        if (typeof intent === 'string' || run.requestedUrl !== intent.requestedUrl ||
            !sameProvider(run.providerContext, intent.providerContext) || run.runId === known.complete?.runId ||
            run.runId === known.incomplete?.runId) { showError(stage, 'invalid-result'); return; }
      }
      if (run && stage === 'Reopen') {
        if (run.runId !== intent) { showError(stage, 'invalid-result'); return; }
        const previous = [known.complete, known.incomplete].find(item => item?.runId === run.runId);
        if (previous) {
          if (!permitsRead(previous, run)) { showError(stage, 'invalid-result'); return; }
          if (previous.status !== 'running' || run.status === 'running') {
            const retained = previous.status === 'completed' ? 'evidence and selection' : previous.status === 'failed' ? 'failed snapshot' : 'interrupted snapshot';
            setAnnouncement(`Run ${run.runId} is already open. Existing ${retained} retained.`);
            return;
          }
        }
      }
      if (run) publish(run);
      if (!outcome.ok) showError(stage, outcome.error, run !== null && !outcome.persisted, outcome.cleanupFailed);
    } catch {
      if (mounted.current && reservation.current === token) showError(stage, 'request-failed');
    } finally {
      if (mounted.current && reservation.current === token) {
        reservation.current = null;
        setBusy(false);
        setPendingAnalysis(null);
      }
    }
  }

  function submitAnalyze(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (reservation.current) { setAnnouncement(busyNotice); return; }
    const callback = props.analyze;
    if (!callback) return;
    const requestedUrl = normalizeTarget(target);
    setInvalidUrl(requestedUrl === null);
    setInvalidMode(mode === '');
    if (requestedUrl === null || mode === '') {
      setAnnouncement([requestedUrl === null ? urlError : '', mode === '' ? modeError : ''].filter(Boolean).join(' '));
      return;
    }
    const providerContext: ProviderContext = mode === 'local'
      ? Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' })
      : Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' });
    const intent = Object.freeze({ requestedUrl, providerContext });
    void execute('Analyze', () => callback(intent), intent);
  }

  function submitReopen(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (reservation.current) { setAnnouncement(busyNotice); return; }
    const callback = props.reopen;
    if (!callback) return;
    const valid = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.exec(runId)?.[0] === runId && runId.length > 0;
    setInvalidId(!valid);
    if (!valid) { setAnnouncement(idError); return; }
    const capturedId = runId;
    void execute('Reopen', () => callback(capturedId), capturedId);
  }

  function selectFinding(id: string): void {
    const finding = complete?.scan.findings.find(item => item.findingId === id);
    if (!complete || !finding) return;
    setSelectedId(id);
    setSelectionRequest(value => value + 1);
    const provider = complete.providerContext;
    setAnnouncement(`Selected Finding ${id}, ${finding.ruleId}, unprocessed. ${provider.mode}, ${provider.provider}, ${provider.model}. No provider call was attempted.`);
  }

  const capability = !props.analyze && !props.reopen
    ? 'Analyze and reopen are unavailable in this build; service integration is pending.'
    : !props.analyze ? 'Analyze is unavailable in this build; service integration is pending.'
      : !props.reopen ? 'Reopen is unavailable in this build; service integration is pending.' : '';

  function operationError(stage: Stage): ReactElement | null {
    if (error?.stage !== stage) return null;
    return <div className="error" id={`${stage.toLowerCase()}-error`}>
      <p>{error.text}</p>
      {error.unsaved && <p>This failed run was not saved.</p>}
      {error.cleanup && <p>Resource cleanup is uncertain.</p>}
    </div>;
  }

  return <main>
    <header><h1>A11y Evidence Lab</h1></header>
    <section aria-labelledby="setup-heading" className="setup">
      <h2 id="setup-heading">Target and generation mode</h2>
      <p id="target-notice" className="limitation">{targetNotice}</p>
      {capability && <p id="capability" className="notice">{capability}</p>}
      <form onSubmit={submitAnalyze} noValidate>
        {pendingAnalysis && <p id="next-analysis-notice" className="limitation">Changes to target and generation mode apply to the next analysis.</p>}
        <label htmlFor="target-url">Target URL</label>
        <input id="target-url" type="text" inputMode="url" value={target} onChange={event => setTarget(event.target.value)}
          aria-invalid={invalidUrl} aria-describedby={`target-notice${pendingAnalysis ? ' next-analysis-notice' : ''}${invalidUrl ? ' url-error' : ''}`} />
        {invalidUrl && <p id="url-error" className="error">{urlError}</p>}
        <fieldset aria-describedby={`mode-disclosure${pendingAnalysis ? ' next-analysis-notice' : ''}${invalidMode ? ' mode-error' : ''}`} aria-invalid={invalidMode}>
          <legend>Generation mode</legend>
          <div className="mode-options">
            <label><input type="radio" name="mode" value="local" checked={mode === 'local'} onChange={() => setMode('local')} /> Local (recommended)</label>
            <label><input type="radio" name="mode" value="groq" checked={mode === 'groq'} onChange={() => setMode('groq')} /> Groq</label>
          </div>
          {invalidMode && <p id="mode-error" className="error">{modeError}</p>}
          <p id="mode-disclosure" className="limitation">{mode === 'local' ? localDisclosure : mode === 'groq' ? groqDisclosure : modeError}</p>
        </fieldset>
        {operationError('Analyze')}
        <button type="submit" className="primary" disabled={!props.analyze} aria-disabled={busy || undefined}
          aria-describedby={[!props.analyze ? 'capability' : '', busy ? 'busy-notice' : '', error?.stage === 'Analyze' ? 'analyze-error' : ''].filter(Boolean).join(' ') || undefined}>Analyze</button>
      </form>
      <form onSubmit={submitReopen} noValidate className="reopen-form">
        <h3>Reopen retained evidence</h3>
        <label htmlFor="run-id">Run ID</label>
        <input id="run-id" type="text" value={runId} onChange={event => setRunId(event.target.value)}
          aria-invalid={invalidId} aria-describedby={invalidId ? 'id-error' : undefined} />
        {invalidId && <p id="id-error" className="error">{idError}</p>}
        {operationError('Reopen')}
        <button type="submit" disabled={!props.reopen} aria-disabled={busy || undefined}
          aria-describedby={[!props.reopen ? 'capability' : '', busy ? 'busy-notice' : '', error?.stage === 'Reopen' ? 'reopen-error' : ''].filter(Boolean).join(' ') || undefined}>Reopen</button>
      </form>
      {busy && <p id="busy-notice" className="notice">{busyNotice}</p>}
      {pendingAnalysis && <section aria-labelledby="pending-analysis-heading" className="notice">
        <h3 id="pending-analysis-heading">Pending analysis</h3>
        <p>Mode: {pendingAnalysis.providerContext.mode}. Provider: {pendingAnalysis.providerContext.provider}. Model: {pendingAnalysis.providerContext.model}.</p>
        <p>No provider call was attempted.</p>
      </section>}
      <p role="status" aria-atomic="true" className="status">{announcement}</p>
    </section>
    {incomplete && <section aria-labelledby="history-heading" className="run-history">
      <h2 id="history-heading">{incomplete.status === 'running' ? 'Interrupted run' : 'Failed run'}</h2>
      {incomplete.status === 'running' && <p className="notice">{interruptedNotice}</p>}
      <RunResults key={incomplete.runId} run={incomplete} />
    </section>}
    <section aria-labelledby="results-heading" className="results">
      <h2 id="results-heading" tabIndex={-1} ref={resultsHeading}>Results</h2>
      <p className="limitation">{resultsNotice}</p>
      {complete && <p className="limitation">{targetNotice}</p>}
      <div ref={resultsContent}>
        {complete && <RunResults key={complete.runId} run={complete} selectedId={selectedId}
          selectionRequest={selectionRequest} onSelect={selectFinding} />}
      </div>
    </section>
  </main>;
}
