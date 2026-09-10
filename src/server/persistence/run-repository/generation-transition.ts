import { isDeepStrictEqual } from 'node:util';
import type { CompletedRun } from './contracts.ts';
import { reject } from './store-errors.ts';
import { selectedFindingTransition } from './selected-finding-transition.ts';

export function checkGenerationTransition(expected: CompletedRun, current: CompletedRun, next: CompletedRun): void {
  const { before, after } = selectedFindingTransition(expected, current, next);
  if (before.state !== 'active' || !('retrieval' in before) || before.retrieval.status !== 'completed'
      || !('analysis' in before) || before.analysis.status !== 'completed' || 'result' in before
      || !('generation' in after) || !('retrieval' in after) || !('analysis' in after)
      || !isDeepStrictEqual(before.retrieval, after.retrieval)
      || !isDeepStrictEqual(before.analysis, after.analysis)) reject('invalid-transition');
  if (!('generation' in before)) {
    if (after.state === 'active' && after.generation.status === 'running') return;
  } else if (before.generation.status === 'running'
      && after.generation.startedAt === before.generation.startedAt
      && ((after.state === 'failed' && after.generation.status === 'failed')
        || (after.state === 'proposal-pending-review' && after.generation.status === 'completed'))) return;
  reject('invalid-transition');
}
