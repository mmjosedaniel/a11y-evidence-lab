import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { validateRun } from './domain/run-contract.ts';
import type { PageAnalysisRun } from './domain/run-contract.ts';
import { openRunRepository } from './persistence/run-repository.ts';
import type { RunningRun, CompletedRun, FailedRun, TerminalRun } from './persistence/run-repository.ts';

export type ReadResult =
  | { ok: true; run: PageAnalysisRun; interrupted: boolean }
  | { ok: false; error: 'invalid-id' | 'busy' | 'stopping' | 'not-found'
      | 'invalid-run' | 'stored-run-unavailable' | 'read-failed' };
export type ScanOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: 'invalid-request' | 'busy' | 'stopping' | 'create-failed'
      | 'scan-failed' | 'result-validation' | 'initial-persistence' | 'shutdown';
      run: FailedRun | null; persisted: boolean; cleanupFailed: boolean };
export type StopResult =
  | { ok: true; status: 'stopped' }
  | { ok: false; error: 'stop-failed' };
export interface LocalService {
  readonly url: string;
  readonly whenStopping: Promise<void>;
  readonly whenStopped: Promise<StopResult>;
  readRun(id: unknown): ReadResult;
  runScan(input: unknown, execute: (run: RunningRun, signal: AbortSignal) => Promise<unknown>): Promise<ScanOutcome>;
  stop(): Promise<StopResult>;
}
export type StartResult =
  | { ok: true; service: LocalService }
  | { ok: false; error: 'invalid-configuration' | 'storage-unavailable' | 'listen-failed' };
export interface ServiceOptions {
  runRoot: string;
  applicationRevision: string;
  port?: number;
  stopTimeoutMs?: number;
}

function ownData(input: unknown, required: readonly string[], optional: readonly string[] = []): Record<string, unknown> | undefined {
  try {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) return;
    const prototype = Object.getPrototypeOf(input);
    if (prototype !== Object.prototype && prototype !== null) return;
    const value: Record<string, unknown> = Object.create(null);
    for (const key of Reflect.ownKeys(input)) {
      if (typeof key !== 'string' || (!required.includes(key) && !optional.includes(key))) return;
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor) || descriptor.value === undefined) return;
      value[key] = descriptor.value;
    }
    if (required.some(key => !Object.hasOwn(value, key))) return;
    return value;
  } catch { return; }
}

function matchingTerminal(running: RunningRun, input: unknown): TerminalRun | undefined {
  const checked = validateRun(input);
  if (!checked.ok || checked.value.status === 'running') return;
  const terminal = checked.value;
  for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl', 'providerContext'] as const) {
    if (!isDeepStrictEqual(running[key], terminal[key])) return;
  }
  const before = running.scanContext;
  const after = terminal.status === 'completed' ? terminal.scan.context : terminal.scanContext;
  for (const key of ['scannerVersion', 'evidencePolicyVersion', 'rules', 'scope', 'readiness', 'viewport',
    'locale', 'timeoutMs', 'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'contrastProfile'] as const) {
    if (!isDeepStrictEqual(before[key], after[key])) return;
  }
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion'] as const) {
    if ('value' in before[key] && !isDeepStrictEqual(before[key], after[key])) return;
  }
  if (before.readinessReached && !after.readinessReached) return;
  return terminal;
}

function authoredFailure(running: RunningRun, category: FailedRun['failure']['category'], terminal?: TerminalRun): FailedRun {
  const context = terminal
    ? terminal.status === 'completed' ? terminal.scan.context : terminal.scanContext
    : { ...running.scanContext, cleanup: 'failed' as const };
  const finishedAt = new Date(Math.max(Date.now(), Date.parse(running.createdAt),
    'value' in context.scannedAt ? Date.parse(context.scannedAt.value) : -Infinity,
    terminal ? Date.parse(terminal.finishedAt) : -Infinity)).toISOString();
  const checked = validateRun({ ...running, status: 'failed', scanContext: context, finishedAt, failure: { category } });
  if (!checked.ok || checked.value.status !== 'failed') throw new Error('Invalid authored failure');
  return checked.value;
}

type ScanFailure = Extract<ScanOutcome, { ok: false }>;
function rejectedScan(error: ScanFailure['error'], cleanupFailed = false): ScanFailure {
  return { ok: false, error, run: null, persisted: false, cleanupFailed };
}

export async function startLocalService(options: ServiceOptions): Promise<StartResult> {
  const config = ownData(options, ['runRoot', 'applicationRevision'], ['port', 'stopTimeoutMs']);
  if (!config || typeof config.runRoot !== 'string' || typeof config.applicationRevision !== 'string'
    || !/^[0-9a-f]{40}$/.test(config.applicationRevision) || config.applicationRevision.length !== 40) {
    return { ok: false, error: 'invalid-configuration' };
  }
  const port = Object.hasOwn(config, 'port') ? config.port : 0;
  const stopTimeoutMs = Object.hasOwn(config, 'stopTimeoutMs') ? config.stopTimeoutMs : 5000;
  if (typeof port !== 'number' || !Number.isInteger(port) || port < 0 || port > 65535
    || typeof stopTimeoutMs !== 'number' || !Number.isInteger(stopTimeoutMs) || stopTimeoutMs < 1 || stopTimeoutMs > 2147483647) {
    return { ok: false, error: 'invalid-configuration' };
  }
  const opened = openRunRepository(config.runRoot);
  if (!opened.ok) return { ok: false, error: 'storage-unavailable' };
  const repository = opened.value;
  const applicationRevision = config.applicationRevision;
  const timeoutMilliseconds = stopTimeoutMs;
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
    if (admissionClosed) return Promise.resolve(rejectedScan('stopping'));
    if (busy()) return Promise.resolve(rejectedScan('busy'));
    const request = ownData(input, ['requestedUrl', 'providerContext', 'scanContext']);
    if (!request || typeof execute !== 'function') return Promise.resolve(rejectedScan('invalid-request'));
    const checked = validateRun({ ...request, formatVersion: 1, runId: `run-${randomUUID()}`,
      createdAt: new Date().toISOString(), applicationRevision, status: 'running' });
    if (!checked.ok || checked.value.status !== 'running') return Promise.resolve(rejectedScan('invalid-request'));
    const initial = checked.value;
    if (initial.scanContext.readinessReached || ['finalUrl', 'scannedAt', 'browserVersion'].some(key => {
      const fact = initial.scanContext[key as 'finalUrl' | 'scannedAt' | 'browserVersion'];
      return !('unavailable' in fact) || fact.unavailable !== 'missing';
    })) return Promise.resolve(rejectedScan('invalid-request'));

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
      settle(rejectedScan('create-failed', created.cleanupFailed));
      return completion.promise;
    }
    const running = created.value;
    async function executeAndFinish(): Promise<void> {
      let returned: unknown;
      let callbackFailed = false;
      try { returned = await execute(running, active.controller.signal); }
      catch { callbackFailed = true; }
      const terminal = callbackFailed ? undefined : matchingTerminal(running, returned);
      let error: ScanFailure['error'];
      let failure: FailedRun;
      let writeCleanupFailed = false;
      if (stopStarted) {
        error = 'shutdown';
        failure = authoredFailure(running, 'shutdown', terminal);
      } else if (!terminal) {
        error = callbackFailed ? 'scan-failed' : 'result-validation';
        failure = authoredFailure(running, callbackFailed ? 'scanner' : 'result-validation');
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
        failure = authoredFailure(running, 'initial-persistence', terminal);
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
    server = http.createServer((request, response) => {
      response.setHeader('Content-Type', 'application/json;charset=utf-8');
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      const send = (status: number, body: unknown) => { response.statusCode = status; response.end(JSON.stringify(body)); };
      const error = (status: number, code: string) => send(status, { ok: false, error: code });
      const target = request.url ?? '';
      if (request.method !== 'GET') return error(405, 'method-not-allowed');
      if (target.includes('?') || target.includes('#')) return error(400, 'invalid-request');
      if (target === '/api/health') return send(200, {
        status: admissionClosed ? 'stopping' : 'ready', busy: busy(), capabilities: { readRuns: true, scan: false },
      });
      if (admissionClosed) return error(503, 'stopping');
      if (!target.startsWith('/api/runs/')) return error(404, 'not-found');
      const result = readRun(target.slice('/api/runs/'.length));
      if (result.ok) return send(200, result);
      const status = { 'invalid-id': 400, busy: 409, stopping: 503, 'not-found': 404,
        'invalid-run': 500, 'read-failed': 500, 'stored-run-unavailable': 500 }[result.error];
      return send(status, result);
    });
  } catch { return { ok: false, error: 'listen-failed' }; }
  server.on('connect', (_request, socket) => socket.destroy());
  server.on('upgrade', (_request, socket) => socket.destroy());
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
    try { server.listen(port, '127.0.0.1'); }
    catch { startupFailure(); }
  });
}
