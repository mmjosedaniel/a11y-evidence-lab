import { isDeepStrictEqual } from 'node:util';
import type { PageAnalysisRun } from '../../domain/run-contract.ts';
import type { TerminalRun } from './contracts.ts';
import { reject } from './store-errors.ts';

export function checkTransition(previous: PageAnalysisRun, next: TerminalRun): void {
  if (previous.status !== 'running') reject('invalid-transition');
  for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl', 'providerContext'] as const) {
    if (!isDeepStrictEqual(previous[key], next[key])) reject('invalid-transition');
  }
  const before = previous.scanContext;
  const after = next.status === 'completed' ? next.scan.context : next.scanContext;
  for (const key of ['scannerVersion', 'evidencePolicyVersion', 'rules', 'scope', 'readiness', 'viewport',
    'locale', 'timeoutMs', 'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'contrastProfile'] as const) {
    if (!isDeepStrictEqual(before[key], after[key])) reject('invalid-transition');
  }
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion'] as const) {
    if ('value' in before[key] && !isDeepStrictEqual(before[key], after[key])) reject('invalid-transition');
  }
  if (before.readinessReached && !after.readinessReached) reject('invalid-transition');
}
