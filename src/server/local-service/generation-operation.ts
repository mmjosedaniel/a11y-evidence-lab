import { readId, readObject } from '../domain/run-contract/contract-value-reader.ts';
import type { NativeFinding } from '../domain/run-contract.ts';
import type { CompletedRun, RunRepository } from '../persistence/run-repository.ts';
import { executeGeneration } from '../generation/generation-stage.ts';
import type { GenerationAdapter, GenerationErrorCode, GenerationOutcome, ProviderInvocation } from '../generation/generation-contract.ts';
import type { GenerationServiceOutcome } from './contracts.ts';

type Selection = { runId: string; findingId: string };
type Reservation = {
  controller: AbortController; promise: Promise<GenerationServiceOutcome>;
  settle(outcome: GenerationServiceOutcome): void; onDeadline(handler: () => void): void;
};
type Dependencies = {
  repository: RunRepository;
  retrieval: { takeOwner(expected: CompletedRun, findingId: string): boolean };
  isStopping(): boolean; deadlineExpired(): boolean; closeAdmission(): void; markStopFailed(): void;
};

export function createGenerationOperation(dependencies: Dependencies) {
  let owner: Selection | undefined;
  const owns = (runId: string, findingId: string) => owner?.runId === runId && owner.findingId === findingId;

  function start(input: unknown, adapter: GenerationAdapter | undefined, reservation: Reservation): Promise<GenerationServiceOutcome> {
    let durable: CompletedRun | null = null;
    let settled = false;
    const settle = (outcome: GenerationServiceOutcome) => {
      if (settled) return;
      settled = true;
      if (!outcome.ok && outcome.cleanupFailed) dependencies.closeAdmission();
      reservation.settle(outcome);
    };
    const fail = (error: Extract<GenerationServiceOutcome, { ok: false }>['error'], persisted = false,
      cleanupFailed = false, invocation?: ProviderInvocation) => settle({ ok: false, error, run: durable,
      persisted, cleanupFailed, invocationPersisted: persisted && invocation !== undefined,
      ...(invocation ? { invocation } : {}) });
    reservation.onDeadline(() => fail('shutdown', false, true));
    if (owner) { fail('workflow-active'); return reservation.promise; }
    let selection: Selection;
    try {
      const record = readObject(input, ['runId', 'findingId']);
      selection = { runId: readId(record.runId), findingId: readId(record.findingId) };
    } catch { fail('invalid-request'); return reservation.promise; }
    const read = dependencies.repository.read(selection.runId);
    if (!read.ok) {
      fail(read.error === 'not-found' ? 'not-found' : read.error === 'invalid-run' ? 'invalid-run'
        : read.error === 'unsafe-path' || read.error === 'identity-mismatch' ? 'stored-run-unavailable' : 'read-failed');
      return reservation.promise;
    }
    if (read.value.status !== 'completed') { fail('not-eligible'); return reservation.promise; }
    durable = read.value;
    const index = durable.scan.findings.findIndex(finding => finding.findingId === selection.findingId);
    if (index < 0) { fail('not-found'); return reservation.promise; }
    const selected = durable.scan.findings[index]!;
    if (selected.state !== 'active') { fail('not-eligible'); return reservation.promise; }
    if ('generation' in selected || 'result' in selected || !('analysis' in selected)
        || selected.analysis.status !== 'completed' || !('retrieval' in selected)
        || selected.retrieval.status !== 'completed'
        || durable.scan.findings.some((finding, i) => i !== index && finding.state === 'active')) {
      fail('workflow-active'); return reservation.promise;
    }
    if (dependencies.isStopping()) { fail('shutdown'); return reservation.promise; }
    // Consume the exact durable retrieval snapshot and establish the successor without an await.
    if (!dependencies.retrieval.takeOwner(durable, selection.findingId)) {
      fail('workflow-active'); return reservation.promise;
    }
    owner = selection;
    const startedAt = new Date(Math.max(Date.now(), Date.parse(selected.analysis.finishedAt),
      Date.parse(selected.retrieval.finishedAt))).toISOString();
    const replace = (finding: unknown) => ({ ...durable!, scan: { ...durable!.scan,
      findings: durable!.scan.findings.map((current, i) => i === index ? finding : current) } });
    const running = dependencies.repository.updateGeneration(durable,
      replace({ ...selected, generation: { status: 'running', startedAt } }));
    if (!running.ok) { fail('generation-persistence', false, running.cleanupFailed); return reservation.promise; }
    durable = running.value;

    const native: NativeFinding = { findingId: selected.findingId, ruleId: selected.ruleId,
      nativeResult: selected.nativeResult, checks: selected.checks, locator: selected.locator,
      evidence: selected.evidence, state: 'unprocessed' } as NativeFinding;
    const expires = Date.now() + 120000;
    void (async () => {
      const outcome: GenerationOutcome = dependencies.isStopping()
        ? { status: 'failed', error: 'shutdown', cleanupFailed: false }
        : await executeGeneration({ finding: Object.freeze(native), retrieval: selected.retrieval.result,
          analysisStartedAt: selected.analysis.startedAt, analysisFinishedAt: selected.analysis.finishedAt,
          providerContext: durable!.providerContext, ...(adapter ? { adapter } : {}), signal: reservation.controller.signal });
      if (settled || dependencies.deadlineExpired()) return;
      const invocation = 'invocation' in outcome ? outcome.invocation : undefined;
      let error: GenerationErrorCode | undefined = outcome.status === 'failed' ? outcome.error
        : outcome.status === 'abstained' ? 'input-integrity' : undefined;
      if (dependencies.isStopping()) error = 'shutdown';
      else if (Date.now() >= expires) error = 'timeout';
      const finishedAt = new Date(Math.max(Date.now(), Date.parse(startedAt))).toISOString();
      // Recheck immediately before constructing the single terminal publication.
      if (settled || dependencies.deadlineExpired()) return;
      if (dependencies.isStopping()) error = 'shutdown';
      else if (Date.now() >= expires) error = 'timeout';
      const finding = error ? { ...selected, state: 'failed', generation: { status: 'failed', startedAt,
        finishedAt, error, ...(invocation ? { invocation } : {}) } }
        : { ...selected, state: 'proposal-pending-review', generation: { status: 'completed', startedAt,
          finishedAt, invocation }, result: outcome.status === 'proposal' ? outcome.proposal : undefined };
      const saved = dependencies.repository.updateGeneration(durable!, replace(finding));
      if (!saved.ok) {
        if (error === 'shutdown') dependencies.markStopFailed();
        fail('generation-persistence', false, outcome.cleanupFailed || saved.cleanupFailed, invocation);
        return;
      }
      durable = saved.value;
      if (!outcome.cleanupFailed) owner = undefined;
      if (error) fail(error, true, outcome.cleanupFailed, invocation);
      else settle({ ok: true, run: durable });
    })();
    return reservation.promise;
  }
  return Object.freeze({ start, owns, hasOwner: () => owner !== undefined });
}
