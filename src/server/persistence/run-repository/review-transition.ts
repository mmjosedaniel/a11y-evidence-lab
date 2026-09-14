import { isDeepStrictEqual } from 'node:util';
import type { CompletedRun } from './contracts.ts';
import { reject } from './store-errors.ts';
import { selectedFindingTransition } from './selected-finding-transition.ts';

export function checkReviewTransition(expected: CompletedRun, current: CompletedRun, next: CompletedRun): void {
  const { before, after } = selectedFindingTransition(expected, current, next);
  if (before.state !== 'proposal-pending-review'
      || (after.state !== 'accepted' && after.state !== 'edited-and-accepted' && after.state !== 'rejected')) {
    reject('invalid-transition');
  }
  for (const key of ['result', 'generation', 'analysis', 'retrieval'] as const) {
    if (!isDeepStrictEqual(before[key], after[key])) reject('invalid-transition');
  }
}
