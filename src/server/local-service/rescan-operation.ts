import { validateRun } from '../domain/run-contract.ts';
import { readChoice, readId, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { CompletedRun, RunRepository, RunningRun } from '../persistence/run-repository.ts';
import { prepareScanRequest } from '../scan/scan-page.ts';
import type { NativeRule } from '../scan/normalization/native-rule-evidence.ts';
import type { RescanOutcome } from './contracts.ts';
import { comparisonLineage } from './comparison-lineage.ts';

type Failure = Exclude<Extract<RescanOutcome, { ok: false }>, { comparisonPersisted: false }>;

export type PreparedRescan = { ok: true; run: RunningRun; rule: NativeRule;
  baselineRun: CompletedRun; baselineFindingId: string };

export function rejectedRescan(error: Failure['error']): Failure {
  return { ok: false, error, run: null, persisted: false, cleanupFailed: false };
}

export function readRescanIntent(input: unknown) {
  const record = readObject(input, ['runId', 'baselineRunId', 'findingId', 'mode']);
  const runId = readId(record.runId);
  const baselineRunId = readId(record.baselineRunId);
  requireValid(runId !== baselineRunId);
  return Object.freeze({ runId, baselineRunId, findingId: readId(record.findingId),
    mode: readChoice(record.mode, ['local', 'groq']) });
}

export function prepareRescan(input: unknown, repository: RunRepository, applicationRevision: string,
  isStopping: () => boolean): PreparedRescan | Failure {
  let intent: ReturnType<typeof readRescanIntent>;
  try { intent = readRescanIntent(input); }
  catch { return rejectedRescan('invalid-request'); }
  // Reflection can reenter stop; never read or create after that boundary.
  if (isStopping()) return rejectedRescan('shutdown');
  const baseline = repository.read(intent.baselineRunId);
  if (isStopping()) return rejectedRescan('shutdown');
  if (!baseline.ok) return rejectedRescan(baseline.error === 'not-found' ? 'not-found'
    : baseline.error === 'invalid-run' ? 'invalid-run'
      : baseline.error === 'unsafe-path' || baseline.error === 'identity-mismatch' ? 'stored-run-unavailable' : 'read-failed');
  if (baseline.value.status !== 'completed') return rejectedRescan('not-eligible');
  const finding = baseline.value.scan.findings.find(value => value.findingId === intent.findingId);
  if (!finding) return rejectedRescan('not-found');
  if (baseline.value.comparison) {
    const lineage = comparisonLineage(repository, baseline.value);
    if (isStopping()) return rejectedRescan('shutdown');
    if (lineage.status !== 'available') return rejectedRescan('comparison-lineage');
  }
  const request = prepareScanRequest(baseline.value.requestedUrl, intent.mode);
  if (!request.ok) return rejectedRescan('invalid-request');
  const checked = validateRun({ ...request.value, formatVersion: 1, runId: intent.runId,
    baselineRunId: intent.baselineRunId, createdAt: new Date().toISOString(), applicationRevision, status: 'running' });
  if (!checked.ok || checked.value.status !== 'running') return rejectedRescan('invalid-request');
  return { ok: true, run: checked.value, rule: finding.ruleId,
    baselineRun: baseline.value, baselineFindingId: finding.findingId };
}
