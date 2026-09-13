import { validateRun } from '../server/domain/run-contract.ts';
import type { Finding, PageAnalysisRun } from '../server/domain/run-contract.ts';
import { readChoice, readObject, requireKeys, requireValid } from '../server/domain/run-contract/contract-value-reader.ts';
import { invocationMatchesProvider, readProviderInvocation } from '../server/generation/generation-contract.ts';
import type { GenerationServiceOutcome } from '../server/local-service/contracts.ts';
import { equal, snapshot } from './finding-response-snapshot.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
export type GenerationIntent = { readonly runId: string; readonly findingId: string };
export type GenerationOutcome = GenerationServiceOutcome;

const errors = ['invalid-request', 'busy', 'stopping', 'not-found', 'invalid-run',
  'stored-run-unavailable', 'read-failed', 'not-eligible', 'workflow-active', 'generation-persistence',
  'input-integrity', 'configuration', 'missing-prerequisite', 'input-fit', 'authentication',
  'quota', 'rate-limit', 'network', 'provider', 'timeout', 'shutdown', 'response-validation'] as const;
const attemptedErrors = ['authentication', 'quota', 'rate-limit', 'network', 'provider', 'response-validation'];

function eligible(finding: Finding): boolean {
  return finding.state === 'active' && !('generation' in finding) && !('result' in finding)
    && 'analysis' in finding && finding.analysis.status === 'completed'
    && 'retrieval' in finding && finding.retrieval.status === 'completed';
}

function selectedTransition(before: CompleteRun, after: CompleteRun, findingId: string): Finding {
  const original = before.scan.findings.find(item => item.findingId === findingId);
  const selected = after.scan.findings.find(item => item.findingId === findingId);
  requireValid(original && selected);
  const preserved = Object.fromEntries(Object.entries(selected)
    .filter(([key]) => !['state', 'generation', 'result'].includes(key)));
  requireValid(equal({ ...original, state: undefined }, { ...preserved, state: undefined }));
  requireValid(equal(before, { ...after, scan: { ...after.scan,
    findings: after.scan.findings.map(item => item.findingId === findingId ? original : item) } }));
  return selected;
}

export function admitGeneration(raw: unknown, before: CompleteRun, findingId: string): GenerationOutcome | null {
  try {
    const baseline = validateRun(snapshot(before));
    requireValid(baseline.ok && baseline.value.status === 'completed');
    const original = baseline.value.scan.findings.find(item => item.findingId === findingId);
    requireValid(original && eligible(original));
    const envelope = readObject(snapshot(raw));
    requireValid(envelope.ok === true || envelope.ok === false);
    const hasInvocation = Object.hasOwn(envelope, 'invocation');
    requireKeys(envelope, envelope.ok ? ['ok', 'run']
      : ['ok', 'run', 'error', 'persisted', 'cleanupFailed', 'invocationPersisted',
        ...(hasInvocation ? ['invocation'] : [])]);
    let run: CompleteRun | null = null;
    let selected: Finding | undefined;
    if (envelope.run !== null) {
      const parsed = validateRun(envelope.run);
      requireValid(parsed.ok && parsed.value.status === 'completed');
      run = parsed.value;
      selected = selectedTransition(baseline.value, run, findingId);
    }
    if (envelope.ok) {
      requireValid(run && selected?.state === 'proposal-pending-review'
        && 'generation' in selected && selected.generation.status === 'completed' && 'result' in selected);
      return { ok: true, run };
    }
    const error = readChoice(envelope.error, errors);
    requireValid(typeof envelope.persisted === 'boolean' && typeof envelope.cleanupFailed === 'boolean'
      && typeof envelope.invocationPersisted === 'boolean');
    const invocation = hasInvocation ? readProviderInvocation(envelope.invocation) : undefined;
    if (invocation) requireValid(invocationMatchesProvider(invocation, baseline.value.providerContext));
    requireValid(!selected || !('result' in selected));
    if (envelope.persisted) {
      requireValid(selected && 'generation' in selected && selected.generation.status === 'failed'
        && selected.generation.error === error);
      const durable = selected.generation.invocation;
      requireValid(hasInvocation === (durable !== undefined) && equal(invocation, durable)
        && envelope.invocationPersisted === hasInvocation);
    } else {
      requireValid(!envelope.invocationPersisted);
      const unknown = error === 'response-validation' && run === null && envelope.cleanupFailed && !hasInvocation;
      requireValid(!attemptedErrors.includes(error) || unknown);
      const running = selected && 'generation' in selected && selected.generation.status === 'running';
      requireValid(!selected || eligible(selected) || running);
      if (hasInvocation) requireValid(running && error === 'generation-persistence');
      if (running) requireValid(error === 'generation-persistence'
        || (error === 'shutdown' && envelope.cleanupFailed && !hasInvocation));
    }
    return { ok: false, run, error, persisted: envelope.persisted, cleanupFailed: envelope.cleanupFailed,
      invocationPersisted: envelope.invocationPersisted, ...(invocation ? { invocation } : {}) };
  } catch { return null; }
}
