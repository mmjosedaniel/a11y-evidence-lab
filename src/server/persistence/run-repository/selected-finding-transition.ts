import { isDeepStrictEqual } from 'node:util';
import type { Finding } from '../../domain/run-contract.ts';
import type { CompletedRun } from './contracts.ts';
import { reject } from './store-errors.ts';

function sameNativeFinding(before: Finding, after: Finding): boolean {
  for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence'] as const) {
    if (!isDeepStrictEqual(before[key], after[key])) return false;
  }
  return true;
}

export function selectedFindingTransition(expected: CompletedRun, current: CompletedRun, next: CompletedRun): { before: Finding; after: Finding } {
  if (!isDeepStrictEqual(expected, current)) reject('invalid-transition');
  for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl',
    'providerContext', 'status', 'finishedAt'] as const) {
    if (!isDeepStrictEqual(current[key], next[key])) reject('invalid-transition');
  }
  for (const key of ['context', 'coverage', 'scannerReviewObservations'] as const) {
    if (!isDeepStrictEqual(current.scan[key], next.scan[key])) reject('invalid-transition');
  }
  if (current.scan.findings.length !== next.scan.findings.length) reject('invalid-transition');
  const changed: number[] = [];
  for (let index = 0; index < current.scan.findings.length; index++) {
    if (!isDeepStrictEqual(current.scan.findings[index], next.scan.findings[index])) changed.push(index);
  }
  if (changed.length !== 1) reject('invalid-transition');
  const before = current.scan.findings[changed[0]!]!;
  const after = next.scan.findings[changed[0]!]!;
  if (!sameNativeFinding(before, after)) reject('invalid-transition');
  return { before, after };
}
