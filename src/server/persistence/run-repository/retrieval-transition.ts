import { isDeepStrictEqual } from 'node:util';
import type { Finding } from '../../domain/run-contract.ts';
import { assessFindingEvidence } from '../../domain/finding-sufficiency.ts';
import type { CompletedRun } from './contracts.ts';
import { reject } from './store-errors.ts';

function sameNativeFinding(before: Finding, after: Finding): boolean {
  for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence'] as const) {
    if (!isDeepStrictEqual(before[key], after[key])) return false;
  }
  return true;
}

export function checkRetrievalTransition(expected: CompletedRun, current: CompletedRun, next: CompletedRun): void {
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
  if (before.state === 'unprocessed') {
    if (after.state !== 'active') reject('invalid-transition');
    const complete = assessFindingEvidence(before).state === 'complete';
    if (complete ? !('retrieval' in after && after.retrieval.status === 'running')
      : !('analysis' in after && after.analysis.status === 'running')) reject('invalid-transition');
    return;
  }
  if (before.state !== 'active') reject('invalid-transition');
  if ('retrieval' in before && before.retrieval.status === 'running') {
    if ('retrieval' in after && after.retrieval.startedAt === before.retrieval.startedAt) {
      if (after.state === 'failed' && after.retrieval.status === 'failed') return;
      if ((after.state === 'active' || after.state === 'abstained') && after.retrieval.status === 'completed'
          && 'analysis' in after && after.analysis.status === 'completed') return;
    }
  } else if ('analysis' in before && before.analysis.status === 'running'
      && 'analysis' in after && !('retrieval' in after) && after.analysis.startedAt === before.analysis.startedAt) {
    if (after.state === 'abstained' && after.analysis.status === 'completed') return;
    if (after.state === 'failed' && after.analysis.status === 'failed') return;
  }
  reject('invalid-transition');
}
