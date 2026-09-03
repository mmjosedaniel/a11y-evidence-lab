import { isDeepStrictEqual } from 'node:util';
import { validateRun } from '../domain/run-contract.ts';
import type { FailedRun, RunningRun, TerminalRun } from '../persistence/run-repository.ts';
import type { ScanOutcome } from './contracts.ts';

export type ScanFailure = Extract<ScanOutcome, { ok: false }>;

export function matchTerminalRun(running: RunningRun, input: unknown): TerminalRun | undefined {
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

export function createFailedRun(running: RunningRun, category: FailedRun['failure']['category'], terminal?: TerminalRun): FailedRun {
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

export function createRejectedScanOutcome(error: ScanFailure['error'], cleanupFailed = false): ScanFailure {
  return { ok: false, error, run: null, persisted: false, cleanupFailed };
}
