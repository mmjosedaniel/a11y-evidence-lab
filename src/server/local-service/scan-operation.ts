import type { FailedRun, RunningRun, RunRepository } from '../persistence/run-repository.ts';
import type { ScanOutcome } from './contracts.ts';
import { createFailedRun, createRejectedScanOutcome, matchTerminalRun } from './scan-run-records.ts';
import type { ScanFailure } from './scan-run-records.ts';

export type ScanOperationDependencies = {
  repository: RunRepository;
  isStopping(): boolean;
  deadlineExpired(): boolean;
  markStopFailed(): void;
};

export function startScanOperation(dependencies: ScanOperationDependencies, initial: RunningRun,
  execute: (run: RunningRun, signal: AbortSignal) => Promise<unknown>, signal: AbortSignal,
  settle: (outcome: ScanOutcome) => void, onCompleted?: () => void): void {
  const { repository } = dependencies;
  const created = repository.create(initial);
  if (!created.ok) {
    settle(createRejectedScanOutcome('create-failed', created.cleanupFailed));
    return;
  }
  const running = created.value;
  async function executeAndFinish(): Promise<void> {
    let returned: unknown;
    let callbackFailed = false;
    try { returned = await execute(running, signal); }
    catch { callbackFailed = true; }
    const terminal = callbackFailed ? undefined : matchTerminalRun(running, returned);
    let error: ScanFailure['error'];
    let failure: FailedRun;
    let writeCleanupFailed = false;
    if (dependencies.isStopping()) {
      error = 'shutdown';
      failure = createFailedRun(running, 'shutdown', terminal);
    } else if (!terminal) {
      error = callbackFailed ? 'scan-failed' : 'result-validation';
      failure = createFailedRun(running, callbackFailed ? 'scanner' : 'result-validation');
    } else if (terminal.status === 'failed') {
      error = 'scan-failed';
      failure = terminal;
    } else {
      const completed = repository.finish(terminal);
      if (completed.ok && completed.value.status === 'completed') {
        onCompleted?.();
        settle({ ok: true, run: completed.value });
        return;
      }
      writeCleanupFailed = !completed.ok && completed.cleanupFailed;
      error = 'initial-persistence';
      failure = createFailedRun(running, 'initial-persistence', terminal);
    }
    const persisted = dependencies.deadlineExpired() ? undefined : repository.finish(failure);
    const cleanupFailed = writeCleanupFailed || (!persisted?.ok && !!persisted?.cleanupFailed)
      || failure.scanContext.cleanup === 'failed';
    if (error === 'shutdown' && !persisted?.ok) dependencies.markStopFailed();
    settle({ ok: false, error, run: failure, persisted: persisted?.ok === true, cleanupFailed });
  }
  void executeAndFinish();
}
