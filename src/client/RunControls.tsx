import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';
import type { ProviderContext } from '../server/domain/run-contract.ts';

export interface AnalyzeIntent {
  readonly requestedUrl: string;
  readonly providerContext: ProviderContext;
}

export interface AnalysisConfiguration {
  readonly localModelInstalled?: boolean;
  readonly groqApiUrlConfigured?: boolean;
}

export interface OperationError {
  readonly text: string;
  readonly unsaved: boolean;
  readonly cleanup: boolean;
}

interface TargetAnalysisFormProps {
  readonly available: boolean;
  readonly busy: boolean;
  readonly configuration?: AnalysisConfiguration;
  readonly error: OperationError | null;
  readonly onOperationReserved: () => boolean;
  readonly onAnalyze: (intent: AnalyzeIntent) => void;
  readonly onAnnounce: (message: string) => void;
}

const urlError = 'Enter a valid HTTPS URL without embedded credentials.';
const modeError = 'Choose Local or Groq.';
const localMissing = 'The Local model is not installed. Install it before using Local generation.';
const groqMissing = 'The Groq API URL is not configured. Define it before using Groq.';

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

  function selectMode(selected: ProviderContext['mode']): void {
    setMode(selected);
    setInvalidMode(false);
  }

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

  const configurationMessage = mode === 'local' && props.configuration?.localModelInstalled === false
    ? localMissing
    : mode === 'groq' && props.configuration?.groqApiUrlConfigured === false
      ? groqMissing
      : '';
  const modeDescription = [invalidMode ? 'mode-error' : '', configurationMessage ? 'mode-configuration' : '']
    .filter(Boolean).join(' ') || undefined;

  return <form onSubmit={submitAnalyze} noValidate>
    <label htmlFor="target-url">Target URL</label>
    <input id="target-url" type="text" inputMode="url" value={target} onChange={event => setTarget(event.target.value)}
      aria-invalid={invalidUrl} aria-describedby={invalidUrl ? 'url-error' : undefined} />
    {invalidUrl && <p id="url-error" className="error">{urlError}</p>}
    <fieldset aria-describedby={modeDescription} aria-invalid={invalidMode}>
      <legend>Generation mode</legend>
      <div className="mode-options">
        <label><input type="radio" name="mode" value="local" checked={mode === 'local'} onChange={() => selectMode('local')} /> Local (recommended)</label>
        <label><input type="radio" name="mode" value="groq" checked={mode === 'groq'} onChange={() => selectMode('groq')} /> Groq</label>
      </div>
      {invalidMode && <p id="mode-error" className="error">{modeError}</p>}
      {configurationMessage && <p id="mode-configuration" className="configuration-message">{configurationMessage}</p>}
    </fieldset>
    <OperationErrorMessage id="analyze-error" error={props.error} />
    <button type="submit" className="primary" disabled={!props.available} aria-disabled={props.busy || undefined}
      aria-describedby={[!props.available ? 'capability' : '', props.error ? 'analyze-error' : ''].filter(Boolean).join(' ') || undefined}>Analyze</button>
  </form>;
}
