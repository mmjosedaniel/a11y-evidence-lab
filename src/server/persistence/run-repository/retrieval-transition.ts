import { assessFindingEvidence } from '../../domain/finding-sufficiency.ts';
import type { CompletedRun } from './contracts.ts';
import { reject } from './store-errors.ts';
import { selectedFindingTransition } from './selected-finding-transition.ts';

export function checkRetrievalTransition(expected: CompletedRun, current: CompletedRun, next: CompletedRun): void {
  const { before, after } = selectedFindingTransition(expected, current, next);
  if ('generation' in before || 'generation' in after) reject('invalid-transition');
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
