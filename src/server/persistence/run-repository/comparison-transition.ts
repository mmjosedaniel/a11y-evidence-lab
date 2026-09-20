import { isDeepStrictEqual } from 'node:util';
import type { CompletedRun } from './contracts.ts';
import { reject } from './store-errors.ts';

export function checkComparisonTransition(expected: CompletedRun, current: CompletedRun, next: CompletedRun): void {
  if (!isDeepStrictEqual(expected, current) || current.comparison !== undefined || next.comparison === undefined) {
    reject('invalid-transition');
  }
  const { comparison, ...unchanged } = next;
  if (!isDeepStrictEqual(current, unchanged)) reject('invalid-transition');
}
