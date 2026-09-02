import http from 'node:http';
import { openRunRepository } from './persistence/run-repository.ts';
import type { RunningRun, FailedRun } from './persistence/run-repository.ts';
import { parseServiceConfiguration, prepareRunningRun } from './local-service/input-validation.ts';
import { createFailedRun, createRejectedScanOutcome, matchTerminalRun } from './local-service/scan-run-records.ts';
import type { ScanFailure } from './local-service/scan-run-records.ts';
import { createLoopbackApiServer } from './local-service/loopback-api.ts';
import type { ReadResult, ScanOutcome, ServiceOptions, StartResult, StopResult } from './local-service/contracts.ts';

export type { ReadResult, ScanOutcome, StopResult, LocalService, StartResult, ServiceOptions } from './local-service/contracts.ts';

export async function startLocalService(options: ServiceOptions): Promise<StartResult> {
  const config = parseServiceConfiguration(options);
  if (!config) return { ok: false, error: 'invalid-configuration' };
  const opened = openRunRepository(config.runRoot);
  if (!opened.ok) return { ok: false, error: 'storage-unavailable' };
  const repository = opened.value;
  const applicationRevision = config.applicationRevision;
  const timeoutMilliseconds = config.stopTimeoutMs;
  const stopping = Promise.withResolvers<void>();
  const stopped = Promise.withResolvers<StopResult>();
  let admissionClosed = false;
  let stopStarted = false;
  let stopSettled = false;
  let stopFailed = false;
  let deadlineExpired = false;
  let cleanupUncertain = false;
  let listenerClosed = false;
  let closeFinished = false;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  type Operation = { controller: AbortController; settled: boolean; completion: Promise<ScanOutcome> };
  let operation: Operation | undefined;
  let reading = false;
  const busy = () => reading || operation !== undefined;

  function closeAdmission(): void {
    if (admissionClosed) return;
    admissionClosed = true;
  }
  function settleStop(result: StopResult): void {
    if (stopSettled) return;
    stopSettled = true;
    clearTimeout(deadline);
    stopped.resolve(result);
  }
  function finishStop(): void {
    if (!stopStarted || stopSettled || !closeFinished || reading || (operation && !operation.settled)) return;
    settleStop(stopFailed || cleanupUncertain || !listenerClosed
      ? { ok: false, error: 'stop-failed' } : { ok: true, status: 'stopped' });
  }
  function stop(): Promise<StopResult> {
    if (stopStarted) return stopped.promise;
    stopStarted = true;
    closeAdmission();
    stopping.resolve();
    deadline = setTimeout(() => {
      deadlineExpired = true;
      stopFailed = true;
      settleStop({ ok: false, error: 'stop-failed' });
    }, timeoutMilliseconds);
    operation?.controller.abort();
    try {
      server.close(error => {
        // Only a prior successful close can justify an already-closed error.
        if (error && !(listenerClosed && 'code' in error && error.code === 'ERR_SERVER_NOT_RUNNING')) {
          stopFailed = true;
        }
        if (!error) listenerClosed = true;
        closeFinished = true;
        finishStop();
      });
    } catch {
      stopFailed = true;
      closeFinished = true;
    }
    try { server.closeAllConnections(); }
    catch { stopFailed = true; }
    finishStop();
    return stopped.promise;
  }

  function readRun(id: unknown): ReadResult {
    if (admissionClosed) return { ok: false, error: 'stopping' };
    if (busy()) return { ok: false, error: 'busy' };
    reading = true;
    try {
      const result = repository.read(id);
      if (result.ok) return { ok: true, run: result.value, interrupted: result.value.status === 'running' };
      switch (result.error) {
        case 'invalid-id': case 'not-found': case 'invalid-run': case 'read-failed':
          return { ok: false, error: result.error };
        case 'unsafe-path': case 'identity-mismatch':
          return { ok: false, error: 'stored-run-unavailable' };
        default: return { ok: false, error: 'read-failed' };
      }
    } finally { reading = false; finishStop(); }
  }

  function runScan(input: unknown, execute: (run: RunningRun, signal: AbortSignal) => Promise<unknown>): Promise<ScanOutcome> {
    if (admissionClosed) return Promise.resolve(createRejectedScanOutcome('stopping'));
    if (busy()) return Promise.resolve(createRejectedScanOutcome('busy'));
    if (typeof execute !== 'function') return Promise.resolve(createRejectedScanOutcome('invalid-request'));
    const initial = prepareRunningRun(input, applicationRevision);
    if (!initial) return Promise.resolve(createRejectedScanOutcome('invalid-request'));

    // Register the reservation and its result before any collaborator or await can reenter.
    const completion = Promise.withResolvers<ScanOutcome>();
    const active: Operation = { controller: new AbortController(), settled: false, completion: completion.promise };
    operation = active;
    function settle(outcome: ScanOutcome): void {
      if (!outcome.ok && outcome.cleanupFailed) {
        cleanupUncertain = true;
        closeAdmission();
      }
      active.settled = true;
      if (!cleanupUncertain && !deadlineExpired) operation = undefined;
      completion.resolve(outcome);
      finishStop();
    }
    const created = repository.create(initial);
    if (!created.ok) {
      settle(createRejectedScanOutcome('create-failed', created.cleanupFailed));
      return completion.promise;
    }
    const running = created.value;
    async function executeAndFinish(): Promise<void> {
      let returned: unknown;
      let callbackFailed = false;
      try { returned = await execute(running, active.controller.signal); }
      catch { callbackFailed = true; }
      const terminal = callbackFailed ? undefined : matchTerminalRun(running, returned);
      let error: ScanFailure['error'];
      let failure: FailedRun;
      let writeCleanupFailed = false;
      if (stopStarted) {
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
          settle({ ok: true, run: completed.value });
          return;
        }
        writeCleanupFailed = !completed.ok && completed.cleanupFailed;
        error = 'initial-persistence';
        failure = createFailedRun(running, 'initial-persistence', terminal);
      }
      const persisted = deadlineExpired ? undefined : repository.finish(failure);
      const cleanupFailed = writeCleanupFailed || (!persisted?.ok && !!persisted?.cleanupFailed)
        || failure.scanContext.cleanup === 'failed';
      if (error === 'shutdown' && !persisted?.ok) stopFailed = true;
      settle({ ok: false, error, run: failure, persisted: persisted?.ok === true, cleanupFailed });
    }
    void executeAndFinish();
    return completion.promise;
  }

  let server: http.Server;
  try {
    server = createLoopbackApiServer({ isStopping: () => admissionClosed, isBusy: busy, readRun });
  } catch { return { ok: false, error: 'listen-failed' }; }
  return new Promise<StartResult>(resolve => {
    let startupSettled = false;
    let started = false;
    function startupFailure(): void {
      if (startupSettled) return;
      startupSettled = true;
      try { server.close(); } catch { /* No successfully started service is returned. */ }
      try { server.closeAllConnections(); } catch { /* Startup remains a failure. */ }
      resolve({ ok: false, error: 'listen-failed' });
    }
    server.on('error', () => {
      if (!started) { startupFailure(); return; }
      if (stopSettled) return;
      stopFailed = true;
      stop();
    });
    server.once('listening', () => {
      if (startupSettled) return;
      const address = server.address();
      if (!address || typeof address === 'string') { startupFailure(); return; }
      startupSettled = true;
      started = true;
      resolve({ ok: true, service: { url: `http://127.0.0.1:${address.port}`, whenStopping: stopping.promise,
        whenStopped: stopped.promise, readRun, runScan, stop } });
    });
    try { server.listen(config.port, '127.0.0.1'); }
    catch { startupFailure(); }
  });
}
