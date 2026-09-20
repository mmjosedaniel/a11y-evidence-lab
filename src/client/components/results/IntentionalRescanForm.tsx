import { useEffect, useId, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { RescanPresentation } from '../../rescan-request.ts';
import type { RescanSettlement } from '../../rescan-request.ts';

export interface RescanControls {
  readonly blocked: boolean;
  readonly blockedReason?: string | null;
  readonly comparisonFeedback?: string | null;
  readonly presentation: RescanPresentation | null;
  readonly submitted: { readonly findingId: string; readonly mode: 'local' | 'groq' } | null;
  readonly onSubmit: (findingId: string, mode: 'local' | 'groq') => void;
  readonly onAnnounce: (text: string) => void;
}

export function comparisonFeedback(result: Extract<RescanSettlement, { status: 'completed' }>): string {
  switch (result.comparisonFailure?.error) {
    case 'comparison-calculation': return 'Scan completed. Comparison could not be calculated.';
    case 'comparison-persistence': return 'Scan completed. Comparison could not be saved.';
    case 'comparison-lineage': return 'Scan completed. The baseline is unavailable for comparison.';
    case 'comparison-aborted': return 'Scan completed. Comparison was cancelled before saving.';
    case 'comparison-shutdown': return 'Scan completed. The service stopped before comparison was saved.';
    default: return 'Comparison saved.';
  }
}

export function rescanAnnouncement(state: RescanPresentation): string {
  if (state.status === 'pending') return 'Intentional rescan started. Baseline evidence remains available.';
  if (state.status === 'unknown') return 'Rescan outcome unknown. The service may have created a later run. Further actions are blocked.';
  const explanation = (() => {
    switch (state.error) {
      case 'not-eligible': return 'The Finding is not eligible for a rescan.';
      case 'busy': return 'Another operation remains active.';
      case 'stopping': return 'The service is stopping.';
      case 'shutdown': return 'The service stopped.';
      case 'Rescan is unavailable': return 'Rescan is unavailable.';
      case 'invalid-request': return 'The rescan request could not be accepted.';
      case 'not-found': return 'The baseline run could not be found.';
      case 'comparison-lineage': return 'The baseline is unavailable for comparison.';
      case 'invalid-run': case 'stored-run-unavailable': case 'read-failed': return 'The saved baseline could not be read safely.';
      case 'initial-persistence': return 'The later run could not be saved.';
      case 'result-validation': return 'The later scan returned an invalid result.';
      default: return 'The intentional rescan could not be completed.';
    }
  })();
  return [explanation, state.run && !state.persisted ? 'This failed run was not saved.' : '',
    state.cleanup ? 'Resource cleanup is uncertain.' : '', !state.released ? 'Further actions are blocked.' : ''].filter(Boolean).join(' ');
}

export function RescanStatus({ state }: { readonly state: RescanPresentation | null }): ReactElement | null {
  return state ? <p className={state.status === 'pending' ? 'rescan-status' : 'rescan-status error'}>{rescanAnnouncement(state)}</p> : null;
}

export function IntentionalRescanForm({ findingId, controls }: {
  readonly findingId: string; readonly controls: RescanControls;
}): ReactElement {
  const id = useId();
  const select = useRef<HTMLSelectElement>(null);
  const [mode, setMode] = useState<'' | 'local' | 'groq'>('');
  const [invalid, setInvalid] = useState(false);
  const displayedMode = controls.submitted?.findingId === findingId ? controls.submitted.mode : mode;
  useEffect(() => {
    if (controls.presentation?.status === 'refused' && controls.presentation.released) setMode('');
  }, [controls.presentation]);
  return <form className="intentional-rescan" onSubmit={event => {
    event.preventDefault();
    if (controls.blocked) return;
    if (!mode) {
      setInvalid(true);
      controls.onAnnounce('Choose a new scan mode.');
      select.current?.focus();
      return;
    }
    controls.onSubmit(findingId, mode);
  }}>
    <h4>Intentional rescan</h4>
    {controls.blockedReason && <p>{controls.blockedReason}</p>}
    <label htmlFor={`${id}-mode`}>New scan mode</label>
    <select id={`${id}-mode`} ref={select} value={displayedMode} disabled={controls.blocked}
      aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined}
      onChange={event => { setMode(event.target.value as typeof mode); setInvalid(false); }}>
      <option value="">Choose a mode</option><option value="local">Local</option><option value="groq">Groq</option>
    </select>
    {invalid && <p id={`${id}-error`} className="error">Choose a new scan mode.</p>}
    <button type="submit" aria-disabled={controls.blocked}>Start intentional rescan</button>
  </form>;
}
