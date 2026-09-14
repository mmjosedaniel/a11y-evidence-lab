import type { ReactElement } from 'react';
import type { Finding, ProviderContext } from '../../../server/domain/run-contract.ts';
import type { GenerationOutcome } from '../../finding-generation-admission.ts';

export type GenerationPresentation =
  | { readonly status: 'pending' }
  | { readonly status: 'unknown'; readonly error: 'timeout' | 'request-failed' | 'invalid-result' | 'unavailable' }
  | { readonly status: 'settled'; readonly outcome: GenerationOutcome };

export interface GenerationControls {
  readonly busy: boolean;
  readonly eligibleFindingId: string | null;
  readonly presentations: Readonly<Record<string, GenerationPresentation>>;
  readonly onGenerate: (findingId: string, label: string) => void;
}

type FailedGeneration = Extract<GenerationOutcome, { ok: false }>;

export function finalReviewStatus(finding: Finding): string | null {
  switch (finding.state) {
    case 'accepted': return 'Accepted';
    case 'edited-and-accepted': return 'Edited and accepted';
    case 'rejected': return 'Rejected';
    default: return null;
  }
}

export function reviewedAnnouncement(finding: Finding, provider: ProviderContext): string {
  return `${finalReviewStatus(finding)}. ${provider.mode}, ${provider.provider}, ${provider.model}. A generation provider call was attempted. The original validated proposal and invocation remain saved.`;
}

function callState(outcome: FailedGeneration, findingId: string): 'attempted' | 'not-attempted' | 'unknown' {
  if (outcome.invocation) return 'attempted';
  // Admission binds a persisted failure to its complete durable invocation record.
  if (outcome.persisted) return 'not-attempted';
  const selected = outcome.run?.scan.findings.find(item => item.findingId === findingId);
  if (outcome.cleanupFailed || (selected && 'generation' in selected)) return 'unknown';
  if (outcome.error === 'generation-persistence') {
    return selected?.state === 'active' ? 'not-attempted' : 'unknown';
  }
  switch (outcome.error) {
    case 'invalid-request': case 'busy': case 'stopping': case 'not-found': case 'invalid-run':
    case 'stored-run-unavailable': case 'read-failed': case 'not-eligible': case 'workflow-active':
    case 'input-integrity': case 'configuration': case 'missing-prerequisite': case 'input-fit':
      return 'not-attempted';
    default: return 'unknown';
  }
}

export function generationStatus(state: GenerationPresentation, findingId: string): string {
  if (state.status === 'pending') return 'Generating proposal';
  if (state.status === 'unknown') return 'Generation outcome unknown';
  if (state.outcome.ok) return 'Proposal pending review';
  return callState(state.outcome, findingId) === 'unknown' ? 'Generation outcome unknown' : 'Generation failed';
}

export function generationPersistenceText(outcome: FailedGeneration, findingId: string): string {
  if (outcome.persisted) return 'This failed generation was saved.';
  if (outcome.error !== 'generation-persistence' && callState(outcome, findingId) === 'unknown') {
    return 'A saved generation outcome could not be confirmed.';
  }
  return 'This generation outcome was not saved.';
}

function providerCallText(outcome: FailedGeneration, findingId: string): string {
  const call = callState(outcome, findingId);
  return call === 'attempted' ? 'A generation provider call was attempted.' : call === 'not-attempted'
    ? 'Generation stopped before a provider call was attempted.'
    : 'The provider-call outcome is unknown.';
}

export function generationAnnouncement(provider: ProviderContext, findingId: string,
  state: GenerationPresentation | null): string {
  const context = `${provider.mode}, ${provider.provider}, ${provider.model}.`;
  if (!state) return `${context} Eligible for generation. No generation provider call has been attempted.`;
  const status = generationStatus(state, findingId);
  if (state.status === 'pending') return `${context} ${status}. A provider call or saved outcome cannot yet be confirmed.`;
  if (state.status === 'unknown') {
    return `${context} ${status}: ${state.error}. A provider call, saved outcome, and resource cleanup cannot be confirmed.`;
  }
  if (state.outcome.ok) return `${context} ${status}. A generation provider call was attempted. The original validated proposal and invocation were saved.`;
  const outcome = state.outcome;
  return `${context} ${status}: ${outcome.error}. ${providerCallText(outcome, findingId)} ${generationPersistenceText(outcome, findingId)}${outcome.cleanupFailed ? ' Resource cleanup is uncertain.' : ''}`;
}

function Failure({ outcome, findingId }: {
  readonly outcome: FailedGeneration;
  readonly findingId: string;
}): ReactElement {
  return <div className="generation-failure">
    <p className="error">{generationStatus({ status: 'settled', outcome }, findingId)}: {outcome.error}.</p>
    <p>{providerCallText(outcome, findingId)}</p>
    <p>{generationPersistenceText(outcome, findingId)}</p>
    {outcome.invocation && <dl className="evidence-facts">
      <div><dt>Provider-call outcome</dt><dd>{outcome.invocation.outcome}</dd></div>
      <div><dt>Response validation</dt><dd>{outcome.invocation.validation}</dd></div>
      <div><dt>Invocation record</dt><dd>{outcome.invocationPersisted ? 'Saved with the run' : 'Not saved with the run'}</dd></div>
    </dl>}
    {outcome.cleanupFailed && <p>Resource cleanup is uncertain. The service or provider may still be working.</p>}
    {outcome.error === 'generation-persistence' && <p>The generation workflow remains reserved.</p>}
  </div>;
}

export function FindingGeneration({ finding, label, providerContext, controls }: {
  readonly finding: Finding; readonly label: string; readonly providerContext: ProviderContext;
  readonly controls: GenerationControls;
}): ReactElement | null {
  const finalStatus = finalReviewStatus(finding);
  if (finalStatus && 'generation' in finding && finding.generation.status === 'completed') {
    const invocation = finding.generation.invocation;
    return <div className="finding-generation">
      <h4>Generation provenance</h4>
      <p>{finalStatus}. The original model-generated proposal and provider invocation remain saved.</p>
      <p>{providerContext.mode}, {providerContext.provider}, {providerContext.model}. A generation provider call was attempted.</p>
      <dl className="evidence-facts">
        <div><dt>Provider-call outcome</dt><dd>{invocation.outcome}</dd></div>
        <div><dt>Response validation</dt><dd>{invocation.validation}</dd></div>
      </dl>
    </div>;
  }
  const state = controls.presentations[finding.findingId];
  const eligible = controls.eligibleFindingId === finding.findingId;
  if (!state && !eligible) return null;
  const disabled = controls.busy || !!state || !eligible;
  return <div className="finding-generation">
    <h4>Generate a proposal</h4>
    {providerContext.mode === 'local'
      ? <p>Local generation uses Ollama · {providerContext.model} on loopback. The complete input must fit the Local token limit.</p>
      : <p>Groq · {providerContext.model} runs externally. Only minimized selected-Finding facts and retrieved guidance are sent. Request byte admission does not guarantee hosted input fit.</p>}
    <button className="primary" type="button" aria-disabled={disabled} onClick={() => {
      if (!disabled) controls.onGenerate(finding.findingId, label);
    }}>Generate</button>
    {state?.status === 'pending' && <p>Generating a proposal… A submitted request does not yet confirm a provider call or saved outcome.</p>}
    {state?.status === 'unknown' && <div className="generation-failure">
      <p className="error">Generation outcome unknown: {state.error}.</p>
      <p>The request ended locally. A provider call, saved outcome, and resource cleanup cannot be confirmed. The service or provider may still be working.</p>
    </div>}
    {state?.status === 'settled' && (state.outcome.ok
      ? <p>Proposal pending review. The provider call and original validated proposal were saved.</p>
      : <Failure outcome={state.outcome} findingId={finding.findingId} />)}
  </div>;
}
