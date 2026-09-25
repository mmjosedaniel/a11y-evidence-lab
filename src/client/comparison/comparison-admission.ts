import { validateRun } from '../../server/domain/run-contract.ts';
import type { CompletedRun } from '../../server/persistence/run-repository.ts';
import { comparisonObservation } from '../../server/comparison/target-correlation.ts';
import { readChoice, readObject, requireKeys, requireValid } from '../../server/domain/run-contract/contract-value-reader.ts';
import type { ComparisonLineage } from '../../server/local-service/contracts.ts';
import { equal, snapshot } from '../responses/finding-response-snapshot.ts';

export type { ComparisonLineage } from '../../server/local-service/contracts.ts';

function immutableSource(run: CompletedRun) {
  return { ...run, scan: { ...run.scan, findings: run.scan.findings.map(finding =>
    ({ findingId: finding.findingId, ...comparisonObservation(finding) })) } };
}

export function admitComparisonRead(raw: unknown, captured: CompletedRun): ComparisonLineage | null {
  try {
    const before = validateRun(snapshot(captured));
    requireValid(before.ok && before.value.status === 'completed' && before.value.comparison);
    const transport = readObject(snapshot(raw), ['status', 'body']);
    requireValid(transport.status === 200);
    const body = readObject(transport.body, ['ok', 'run', 'interrupted', 'comparisonLineage']);
    requireValid(body.ok === true && typeof body.interrupted === 'boolean');
    const parsed = validateRun(body.run);
    requireValid(parsed.ok && parsed.value.status === 'completed' && parsed.value.comparison
      && equal(immutableSource(before.value), immutableSource(parsed.value)));
    const lineage = readObject(body.comparisonLineage);
    if (lineage.status === 'available') {
      requireKeys(lineage, ['status']);
      return Object.freeze({ status: 'available' });
    }
    requireKeys(lineage, ['status', 'reason']);
    requireValid(lineage.status === 'unavailable');
    const reason = readChoice(lineage.reason,
      ['not-found', 'invalid-run', 'read-failed', 'stored-run-unavailable', 'baseline-mismatch']);
    return Object.freeze({ status: 'unavailable', reason });
  } catch { return null; }
}
