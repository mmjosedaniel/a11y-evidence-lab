import { isDeepStrictEqual } from 'node:util';
import { comparisonObservation } from '../comparison/target-correlation.ts';
import type { CompletedRun, RunRepository } from '../persistence/run-repository.ts';
import type { StoredComparison } from '../domain/run-contract.ts';
import type { ComparisonLineage } from './contracts.ts';

export function matchesComparisonBaseline(run: CompletedRun, expected: StoredComparison['baseline']): boolean {
  const finding = run.scan.findings.find(item => item.findingId === expected.findingId);
  return !!finding && run.requestedUrl === expected.requestedUrl
    && isDeepStrictEqual(run.scan.context, expected.scanContext)
    && isDeepStrictEqual(comparisonObservation(finding), expected.observation);
}

// Only the immediate link is inspected; ancestors of that baseline are irrelevant to readback.
export function comparisonLineage(repository: RunRepository, run: CompletedRun): ComparisonLineage {
  if (!run.comparison || !run.baselineRunId) return { status: 'unavailable', reason: 'baseline-mismatch' };
  const baseline = repository.read(run.baselineRunId);
  if (!baseline.ok) {
    const reason = baseline.error === 'not-found' || baseline.error === 'invalid-run' ? baseline.error
      : baseline.error === 'unsafe-path' || baseline.error === 'identity-mismatch' ? 'stored-run-unavailable' : 'read-failed';
    return { status: 'unavailable', reason };
  }
  return baseline.value.status === 'completed' && matchesComparisonBaseline(baseline.value, run.comparison.baseline)
    ? { status: 'available' } : { status: 'unavailable', reason: 'baseline-mismatch' };
}
