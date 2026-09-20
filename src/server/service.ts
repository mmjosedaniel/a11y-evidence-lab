import { createGenerationOperation } from './local-service/generation-operation.ts';
import { createReviewOperation } from './local-service/review-operation.ts';
import type { ReviewOutcome } from './local-service/contracts.ts';
import type { Server } from 'node:http';
import { openRunRepository } from './persistence/run-repository.ts';
import type { RunningRun } from './persistence/run-repository.ts';
import { parseServiceConfiguration, prepareRunningRun, prepareServiceScan } from './local-service/input-validation.ts';
import { createRejectedScanOutcome } from './local-service/scan-run-records.ts';
import { startScanOperation } from './local-service/scan-operation.ts';
import { prepareRescan, rejectedRescan } from './local-service/rescan-operation.ts';
import { executeRescanComparison } from './local-service/rescan-comparison.ts';
import { publishComparison } from './local-service/comparison-publication.ts';
import { comparisonLineage } from './local-service/comparison-lineage.ts';
import type { RescanOutcome, RescanExecutor } from './local-service/contracts.ts';
import { createLoopbackApiServer } from './local-service/loopback-api.ts';
import { loadClientResponses } from './local-service/client-assets.ts';
import type { ClientResponseTable } from './local-service/client-assets.ts';
import type { GenerationServiceOutcome, LocalService, ReadResult, RetrievalOutcome, ScanOutcome, ServiceOptions, StartResult, StopResult } from './local-service/contracts.ts';
import { createRetrievalOperation } from './local-service/retrieval-operation.ts';
import type { RetrievalReservation } from './local-service/retrieval-operation.ts';
import { executeRescanScan, executeScan } from './scan/scan-page.ts';
import { createExactRetrieval } from './retrieval/exact-retrieval.ts';

export type { GenerationServiceOutcome, ReadResult, RetrievalOutcome, ScanOutcome, StopResult, LocalService, StartResult, ServiceOptions } from './local-service/contracts.ts';
export type { ReviewOutcome } from './local-service/contracts.ts';

export async function startLocalService(options: ServiceOptions): Promise<StartResult> {
  const config = parseServiceConfiguration(options);
  if (!config) return { ok: false, error: 'invalid-configuration' };
  let clientResponses: ClientResponseTable | undefined;
  if (config.clientRoot) {
    try { clientResponses = loadClientResponses(config.clientRoot); }
    catch { return { ok: false, error: 'client-unavailable' }; }
  }
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
  type Operation = { controller: AbortController; settled: boolean; completion: Promise<unknown>; onDeadline?: () => void };
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
      operation?.onDeadline?.();
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

  const retrieval = createRetrievalOperation({
    repository,
    defaultExecute: createExactRetrieval(),
    isStopping: () => stopStarted,
    deadlineExpired: () => deadlineExpired,
    closeAdmission,
    markStopFailed: () => { stopFailed = true; },
  });

  const generation = createGenerationOperation({ repository, retrieval,
    isStopping: () => stopStarted, deadlineExpired: () => deadlineExpired,
    closeAdmission, markStopFailed: () => { stopFailed = true; } });

  const review = createReviewOperation({ repository, isStopping: () => stopStarted, closeAdmission });

  function reserveFinding<T extends RetrievalOutcome | GenerationServiceOutcome | ReviewOutcome | RescanOutcome>() {
    const completion = Promise.withResolvers<T>();
    const active: Operation = { controller: new AbortController(), settled: false, completion: completion.promise };
    operation = active;
    return {
      controller: active.controller,
      promise: completion.promise,
      settle(outcome: T) {
        if (active.settled) return;
        if (!outcome.ok && outcome.cleanupFailed) cleanupUncertain = true;
        active.settled = true;
        if (!cleanupUncertain && !deadlineExpired) operation = undefined;
        completion.resolve(outcome);
        finishStop();
      },
      onDeadline(handler: () => void) { active.onDeadline = handler; },
    };
  }

  function retrieveFinding(input: unknown, execute?: Parameters<LocalService['retrieveFinding']>[1]): Promise<RetrievalOutcome> {
    if (admissionClosed) return Promise.resolve({ ok: false, error: 'stopping', run: null, persisted: false, cleanupFailed: false });
    if (busy()) return Promise.resolve({ ok: false, error: 'busy', run: null, persisted: false, cleanupFailed: false });
    if (generation.hasOwner()) return Promise.resolve({ ok: false, error: 'workflow-active', run: null, persisted: false, cleanupFailed: false });
    const reservation: RetrievalReservation = reserveFinding<RetrievalOutcome>();
    return retrieval.start(input, execute, reservation);
  }

  function generateFinding(input: unknown, adapter?: Parameters<LocalService['generateFinding']>[1]): Promise<GenerationServiceOutcome> {
    const error = admissionClosed ? 'stopping' : busy() ? 'busy' : undefined;
    if (error) return Promise.resolve({ ok: false, error, run: null, persisted: false,
      cleanupFailed: false, invocationPersisted: false });
    return generation.start(input, adapter, reserveFinding<GenerationServiceOutcome>());
  }

  function reviewFinding(input: unknown): Promise<ReviewOutcome> {
    const error = admissionClosed ? 'stopping' : busy() ? 'busy'
      : generation.hasOwner() || retrieval.hasOwner() ? 'workflow-active' : undefined;
    if (error) return Promise.resolve({ ok: false, error, run: null, persisted: false, cleanupFailed: false });
    return review.start(input, reserveFinding<ReviewOutcome>());
  }

  function readRun(id: unknown): ReadResult {
    if (admissionClosed) return { ok: false, error: 'stopping' };
    if (busy()) return { ok: false, error: 'busy' };
    reading = true;
    try {
      const result = repository.read(id);
      if (result.ok) {
        const interrupted = result.value.status === 'running' || (result.value.status === 'completed'
          && result.value.scan.findings.some(finding => finding.state === 'active'
            && !retrieval.owns(result.value.runId, finding.findingId)
            && !generation.owns(result.value.runId, finding.findingId)));
        const lineage = result.value.status === 'completed' && result.value.comparison
          ? comparisonLineage(repository, result.value) : undefined;
        if (admissionClosed) return { ok: false, error: 'stopping' };
        return { ok: true, run: result.value, interrupted,
          ...(lineage ? { comparisonLineage: lineage } : {}) };
      }
      switch (result.error) {
        case 'invalid-id': case 'not-found': case 'invalid-run': case 'read-failed':
          return { ok: false, error: result.error };
        case 'unsafe-path': case 'identity-mismatch':
          return { ok: false, error: 'stored-run-unavailable' };
        default: return { ok: false, error: 'read-failed' };
      }
    } finally { reading = false; finishStop(); }
  }

  const scanDependencies = { repository, isStopping: () => stopStarted, deadlineExpired: () => deadlineExpired,
    markStopFailed: () => { stopFailed = true; } };

  function rescanFinding(input: unknown, execute: RescanExecutor = executeRescanScan): Promise<RescanOutcome> {
    if (admissionClosed) return Promise.resolve(rejectedRescan('stopping'));
    if (busy()) return Promise.resolve(rejectedRescan('busy'));
    const reservation = reserveFinding<RescanOutcome>();
    const prepared = prepareRescan(input, repository, applicationRevision, () => stopStarted);
    if (stopStarted) reservation.settle(rejectedRescan('shutdown'));
    else if (typeof execute !== 'function') reservation.settle(rejectedRescan('invalid-request'));
    else if (!prepared.ok) reservation.settle(prepared);
    else void executeRescanComparison(scanDependencies, prepared, reservation.controller.signal, execute,
      () => { retrieval.discardSettledOwner(); generation.discardSettledOwner(); }).then(result => {
        const outcome = publishComparison(scanDependencies, prepared, reservation.controller.signal, result);
        if (!outcome.ok && outcome.cleanupFailed) closeAdmission();
        reservation.settle(outcome);
      });
    return reservation.promise;
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
    startScanOperation(scanDependencies, initial, execute, active.controller.signal, settle);
    return completion.promise;
  }

  let server: Server;
  try {
    server = createLoopbackApiServer({ isStopping: () => admissionClosed, isBusy: busy, readRun,
      ...(clientResponses ? { clientResponses, retrieveFinding, generateFinding, reviewFinding, rescanFinding, runScan: (input: unknown) => {
        const prepared = prepareServiceScan(input);
        return prepared ? runScan(prepared, executeScan) : Promise.resolve(createRejectedScanOutcome('invalid-request'));
      } } : {}) });
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
        whenStopped: stopped.promise, readRun, runScan, retrieveFinding, generateFinding, reviewFinding, rescanFinding, stop } });
    });
    try { server.listen(config.port, '127.0.0.1'); }
    catch { startupFailure(); }
  });
}
