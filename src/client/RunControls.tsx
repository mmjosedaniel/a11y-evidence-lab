import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';
import type { ProviderContext } from '../server/domain/run-contract.ts';

export interface AnalyzeIntent {
  readonly requestedUrl: string;
  readonly providerContext: ProviderContext;
}

interface OperationError {
  readonly text: string;
  readonly unsaved: boolean;
  readonly cleanup: boolean;
}

interface TargetAnalysisFormProps {
  readonly available: boolean;
  readonly busy: boolean;
  readonly pending: boolean;
  readonly error: OperationError | null;
  readonly onOperationReserved: () => boolean;
  readonly onAnalyze: (intent: AnalyzeIntent) => void;
  readonly onAnnounce: (message: string) => void;
}

export const TARGET_NOTICE = 'Use a public HTTPS page you are permitted to analyze. Private, authenticated, and hostile pages aren’t supported.';

const localDisclosure = 'Local (recommended) — Ollama · qwen3.5:4b. Generation prompts and responses use the approved loopback Ollama endpoint and a locally present model, not hosted inference. The public-page scan still uses external HTTPS; this is not offline or system-wide zero-egress operation.';
const groqDisclosure = 'Groq — openai/gpt-oss-20b. A later explicit Generate action for one eligible Finding may send minimized rule-specific evidence and required curated-guidance passages to Groq for remote processing. Target URLs, locators, sibling Findings and credentials are excluded from that content. Selecting a mode or scanning makes no provider call.';
const urlError = 'Enter a valid HTTPS URL without embedded credentials.';
const modeError = 'Choose Local or Groq.';

function normalizeTarget(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function OperationErrorMessage({ id, error }: { readonly id: string; readonly error: OperationError | null }): ReactElement | null {
  if (!error) return null;
  return <div className="error" id={id}>
    <p>{error.text}</p>
    {error.unsaved && <p>This failed run was not saved.</p>}
    {error.cleanup && <p>Resource cleanup is uncertain.</p>}
  </div>;
}

export function TargetAnalysisForm(props: TargetAnalysisFormProps): ReactElement {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState<ProviderContext['mode'] | ''>('');
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [invalidMode, setInvalidMode] = useState(false);

  function submitAnalyze(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (props.onOperationReserved()) return;
    if (!props.available) return;
    const requestedUrl = normalizeTarget(target);
    setInvalidUrl(requestedUrl === null);
    setInvalidMode(mode === '');
    if (requestedUrl === null || mode === '') {
      props.onAnnounce([requestedUrl === null ? urlError : '', mode === '' ? modeError : ''].filter(Boolean).join(' '));
      return;
    }
    const providerContext: ProviderContext = mode === 'local'
      ? Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' })
      : Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' });
    props.onAnalyze(Object.freeze({ requestedUrl, providerContext }));
  }

  const modeDescription = [
    mode ? 'mode-disclosure' : '',
    props.pending ? 'next-analysis-notice' : '',
    invalidMode ? 'mode-error' : '',
  ].filter(Boolean).join(' ') || undefined;

  return <form onSubmit={submitAnalyze} noValidate>
    {props.pending && <p id="next-analysis-notice" className="limitation">Changes to target and generation mode apply to the next analysis.</p>}
    <label htmlFor="target-url">Target URL</label>
    <input id="target-url" type="text" inputMode="url" value={target} onChange={event => setTarget(event.target.value)}
      aria-invalid={invalidUrl} aria-describedby={`target-notice${props.pending ? ' next-analysis-notice' : ''}${invalidUrl ? ' url-error' : ''}`} />
    {invalidUrl && <p id="url-error" className="error">{urlError}</p>}
    <fieldset aria-describedby={modeDescription} aria-invalid={invalidMode}>
      <legend>Generation mode</legend>
      <div className="mode-options">
        <label><input type="radio" name="mode" value="local" checked={mode === 'local'} onChange={() => setMode('local')} /> Local (recommended)</label>
        <label><input type="radio" name="mode" value="groq" checked={mode === 'groq'} onChange={() => setMode('groq')} /> Groq</label>
      </div>
      {invalidMode && <p id="mode-error" className="error">{modeError}</p>}
      {mode && <p id="mode-disclosure" className="limitation">{mode === 'local' ? localDisclosure : groqDisclosure}</p>}
    </fieldset>
    <OperationErrorMessage id="analyze-error" error={props.error} />
    <button type="submit" className="primary" disabled={!props.available} aria-disabled={props.busy || undefined}
      aria-describedby={[!props.available ? 'capability' : '', props.busy ? 'busy-notice' : '', props.error ? 'analyze-error' : ''].filter(Boolean).join(' ') || undefined}>Analyze</button>
  </form>;
}
