import { readId, readObject } from '../domain/run-contract/contract-value-reader.ts';
import type { Finding } from '../domain/run-contract.ts';
import type { CompletedRun, RunRepository } from '../persistence/run-repository.ts';
import { validateRetrievalResult } from '../retrieval/retrieval-contract.ts';
import { RetrievalError } from '../retrieval/retrieval-error.ts';
import type { RetrievalErrorCode } from '../retrieval/retrieval-error.ts';
import type { RetrievalExecutor, RetrievalOutcome } from './contracts.ts';

export type RetrievalReservation = {
  readonly controller: AbortController;
  readonly promise: Promise<RetrievalOutcome>;
  settle(outcome: RetrievalOutcome): void;
  onDeadline(handler: () => void): void;
};

type Dependencies = {
  readonly repository: RunRepository;
  readonly defaultExecute: RetrievalExecutor;
  readonly isStopping: () => boolean;
  readonly deadlineExpired: () => boolean;
  readonly closeAdmission: () => void;
  readonly markStopFailed: () => void;
};

type Selection = { readonly runId: string; readonly findingId: string };
const retrievalErrorCodes = new Set<RetrievalErrorCode>([
  'corpus-integrity', 'missing-prerequisite', 'model-identity', 'input-fit', 'embedding-failed',
  'embedding-response', 'timeout', 'shutdown', 'result-validation',
]);

function request(input: unknown): Selection | undefined {
  try {
    const record = readObject(input, ['runId', 'findingId']);
    return Object.freeze({ runId: readId(record.runId), findingId: readId(record.findingId) });
  } catch { return; }
}

function rejected(error: Extract<RetrievalOutcome, { ok: false }>['error'], run: CompletedRun | null = null,
  persisted = false, cleanupFailed = false): RetrievalOutcome {
  return { ok: false, error, run, persisted, cleanupFailed };
}

function timestamp(notBefore: string): string {
  return new Date(Math.max(Date.now(), Date.parse(notBefore))).toISOString();
}

function replaceFinding(run: CompletedRun, index: number, finding: Finding): unknown {
  const findings = run.scan.findings.map((current, currentIndex) => currentIndex === index ? finding : current);
  return { ...run, scan: { ...run.scan, findings } };
}

function boundedFailure(error: unknown, stopping: boolean): { code: RetrievalErrorCode; cleanupFailed: boolean } {
  let code: RetrievalErrorCode = 'embedding-failed';
  let cleanupFailed = false;
  if (error instanceof RetrievalError) {
    const codeDescriptor = Object.getOwnPropertyDescriptor(error, 'code');
    const cleanupDescriptor = Object.getOwnPropertyDescriptor(error, 'cleanupFailed');
    if (codeDescriptor && 'value' in codeDescriptor && retrievalErrorCodes.has(codeDescriptor.value as RetrievalErrorCode)
        && cleanupDescriptor && 'value' in cleanupDescriptor && typeof cleanupDescriptor.value === 'boolean') {
      code = codeDescriptor.value as RetrievalErrorCode;
      cleanupFailed = cleanupDescriptor.value;
    }
  }
  return { code: stopping ? 'shutdown' : code, cleanupFailed };
}

export function createRetrievalOperation(dependencies: Dependencies) {
  let owner: Selection | undefined;

  function owns(runId: string, findingId: string): boolean {
    return owner?.runId === runId && owner.findingId === findingId;
  }

  function start(input: unknown, supplied: RetrievalExecutor | undefined, reservation: RetrievalReservation): Promise<RetrievalOutcome> {
    let durable: CompletedRun | null = null;
    let settled = false;
    const settle = (outcome: RetrievalOutcome) => {
      if (settled) return;
      settled = true;
      reservation.settle(outcome);
    };
    reservation.onDeadline(() => {
      dependencies.closeAdmission();
      settle(rejected('shutdown', durable, false, true));
    });

    const selection = request(input);
    if (!selection || (supplied !== undefined && typeof supplied !== 'function')) {
      settle(rejected('invalid-request'));
      return reservation.promise;
    }
    if (owner) {
      settle(rejected('workflow-active'));
      return reservation.promise;
    }

    const read = dependencies.repository.read(selection.runId);
    if (!read.ok) {
      const error = read.error === 'not-found' ? 'not-found'
        : read.error === 'invalid-run' ? 'invalid-run'
          : read.error === 'unsafe-path' || read.error === 'identity-mismatch' ? 'stored-run-unavailable'
            : 'read-failed';
      settle(rejected(error));
      return reservation.promise;
    }
    if (read.value.status !== 'completed') {
      settle(rejected('not-eligible'));
      return reservation.promise;
    }
    durable = read.value;
    if (dependencies.isStopping()) {
      settle(rejected('shutdown', durable));
      return reservation.promise;
    }
    const index = durable.scan.findings.findIndex(finding => finding.findingId === selection.findingId);
    if (index < 0) {
      settle(rejected('not-found', durable));
      return reservation.promise;
    }
    if (durable.scan.findings.some(finding => finding.state === 'active')) {
      settle(rejected('workflow-active', durable));
      return reservation.promise;
    }
    const selected = durable.scan.findings[index]!;
    if (selected.state !== 'unprocessed') {
      settle(rejected('not-eligible', durable));
      return reservation.promise;
    }

    const startedAt = timestamp(durable.finishedAt);
    const runningFinding = { ...selected, state: 'active' as const,
      retrieval: Object.freeze({ status: 'running' as const, startedAt }) };
    const runningResult = dependencies.repository.updateRetrieval(durable, replaceFinding(durable, index, runningFinding));
    if (!runningResult.ok) {
      if (runningResult.cleanupFailed) dependencies.closeAdmission();
      settle(rejected('retrieval-persistence', durable, false, runningResult.cleanupFailed));
      return reservation.promise;
    }
    durable = runningResult.value;
    owner = selection;

    const persistFailure = (code: RetrievalErrorCode, cleanupFailed: boolean) => {
      if (dependencies.deadlineExpired()) return;
      const finishedAt = timestamp(startedAt);
      const failedFinding = { ...selected, state: 'failed' as const,
        retrieval: Object.freeze({ status: 'failed' as const, startedAt, finishedAt, error: code }) };
      const saved = dependencies.repository.updateRetrieval(durable!, replaceFinding(durable!, index, failedFinding));
      if (!saved.ok) {
        const uncertain = cleanupFailed || saved.cleanupFailed;
        if (uncertain) dependencies.closeAdmission();
        if (code === 'shutdown') dependencies.markStopFailed();
        settle(rejected('retrieval-persistence', durable, false, uncertain));
        return;
      }
      durable = saved.value;
      if (!cleanupFailed) owner = undefined;
      else dependencies.closeAdmission();
      settle(rejected(code, durable, true, cleanupFailed));
    };

    if (dependencies.isStopping()) {
      persistFailure('shutdown', false);
      return reservation.promise;
    }
    const execute = supplied ?? dependencies.defaultExecute;
    void (async () => {
      let returned: unknown;
      let thrown: unknown;
      let callbackFailed = false;
      try { returned = await execute(selected, reservation.controller.signal); }
      catch (error) { callbackFailed = true; thrown = error; }
      if (settled || dependencies.deadlineExpired()) return;
      if (callbackFailed || dependencies.isStopping()) {
        const failure = boundedFailure(thrown, dependencies.isStopping());
        persistFailure(failure.code, failure.cleanupFailed);
        return;
      }
      const checked = validateRetrievalResult(returned, selected);
      if (dependencies.isStopping()) {
        persistFailure('shutdown', false);
        return;
      }
      if (!checked.ok) {
        persistFailure('result-validation', false);
        return;
      }
      const finishedAt = timestamp(startedAt);
      const completedFinding = { ...selected, state: 'active' as const,
        retrieval: Object.freeze({ status: 'completed' as const, startedAt, finishedAt, result: checked.value }) };
      const saved = dependencies.repository.updateRetrieval(durable!, replaceFinding(durable!, index, completedFinding));
      if (!saved.ok) {
        if (saved.cleanupFailed) dependencies.closeAdmission();
        settle(rejected('retrieval-persistence', durable, false, saved.cleanupFailed));
        return;
      }
      durable = saved.value;
      if (dependencies.isStopping()) {
        settle(rejected('shutdown', durable));
        return;
      }
      settle({ ok: true, run: durable });
    })().catch(() => {
      if (!settled && !dependencies.deadlineExpired()) persistFailure('embedding-failed', false);
    });
    return reservation.promise;
  }

  return Object.freeze({ start, owns });
}
