import type { ComparisonResult } from '../comparison/comparison-contract.ts';
import { validateRun } from '../domain/run-contract.ts';
import type { ComparisonFailure, RescanOutcome } from './contracts.ts';
import { comparisonLineage, matchesComparisonBaseline } from './comparison-lineage.ts';
import type { executeRescanComparison } from './rescan-comparison.ts';
import type { PreparedRescan } from './rescan-operation.ts';
import type { ScanOperationDependencies } from './scan-operation.ts';

function projectComparison(value: ComparisonResult) {
  const { baseline, laterRunId: _laterRunId, context, ...result } = value;
  return { ...result, baseline: { findingId: baseline.findingId, observation: baseline.observation,
    requestedUrl: context.baseline.requestedUrl, scanContext: context.baseline.scanContext } };
}

export function publishComparison(dependencies: ScanOperationDependencies, prepared: PreparedRescan,
  signal: AbortSignal, result: Awaited<ReturnType<typeof executeRescanComparison>>): RescanOutcome {
  const { outcome, comparison } = result;
  if (!outcome.ok) return outcome;
  const run = outcome.run;
  const fail = (error: ComparisonFailure['error'], cleanupFailed = false): ComparisonFailure =>
    ({ ok: false, error, run, persisted: true, comparisonPersisted: false, cleanupFailed });
  const lifetime = (): ComparisonFailure | undefined =>
    dependencies.isStopping() || dependencies.deadlineExpired() ? fail('comparison-shutdown')
      : signal.aborted ? fail('comparison-aborted') : undefined;
  let stopped = lifetime();
  if (stopped) return stopped;
  if (!comparison.ok) return fail('comparison-calculation');
  const projected = projectComparison(comparison.value);
  const checked = validateRun({ ...run, comparison: projected });
  if (!checked.ok || checked.value.status !== 'completed') return fail('comparison-calculation');
  stopped = lifetime();
  if (stopped) return stopped;
  const baseline = dependencies.repository.read(prepared.baselineRun.runId);
  stopped = lifetime();
  if (stopped) return stopped;
  if (!baseline.ok || baseline.value.status !== 'completed'
    || !matchesComparisonBaseline(baseline.value, checked.value.comparison!.baseline)) return fail('comparison-lineage');
  if (prepared.baselineRun.comparison || baseline.value.comparison) {
    const lineage = comparisonLineage(dependencies.repository, baseline.value);
    stopped = lifetime();
    if (stopped) return stopped;
    if (lineage.status !== 'available') return fail('comparison-lineage');
  }
  stopped = lifetime();
  if (stopped) return stopped;
  const saved = dependencies.repository.updateComparison(run, checked.value);
  // A successful rename is durable truth. Never downgrade it through a later read or lifetime check.
  if (saved.ok) return { ok: true, run: saved.value };
  return fail(dependencies.isStopping() || dependencies.deadlineExpired()
    ? 'comparison-shutdown' : 'comparison-persistence', saved.cleanupFailed);
}
