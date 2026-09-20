import { validateRun } from '../server/domain/run-contract.ts';
import { readChoice, readId, readObject, requireKeys, requireValid } from '../server/domain/run-contract/contract-value-reader.ts';
import type { ComparisonFailure, RescanOutcome } from '../server/local-service/contracts.ts';
import { comparisonObservation } from '../server/comparison/target-correlation.ts';
import { equal, snapshot } from './finding-response-snapshot.ts';

export type RescanIntent = {
  readonly runId: string;
  readonly baselineRunId: string;
  readonly findingId: string;
  readonly mode: 'local' | 'groq';
};

const statuses = {
  'invalid-request': 400, 'not-found': 404, busy: 409, 'not-eligible': 409,
  stopping: 503, shutdown: 503, 'invalid-run': 500, 'stored-run-unavailable': 500,
  'read-failed': 500, 'create-failed': 500, 'scan-failed': 500,
  'result-validation': 500, 'initial-persistence': 500,
  'comparison-lineage': 409,
} as const;

const comparisonStatuses = { 'comparison-calculation': 500, 'comparison-lineage': 409,
  'comparison-persistence': 500, 'comparison-aborted': 409, 'comparison-shutdown': 503 } as const;

// Callers detach the two values first so request ownership can be checked between snapshots.
export function readRescanSelection(before: unknown, submitted: unknown) {
  const parsed = validateRun(before);
  requireValid(parsed.ok && parsed.value.status === 'completed');
  const record = readObject(submitted, ['runId', 'baselineRunId', 'findingId', 'mode']);
  const intent: RescanIntent = Object.freeze({
    runId: readId(record.runId), baselineRunId: readId(record.baselineRunId),
    findingId: readId(record.findingId), mode: readChoice(record.mode, ['local', 'groq']),
  });
  requireValid(intent.runId !== intent.baselineRunId && intent.baselineRunId === parsed.value.runId
    && parsed.value.scan.findings.some(finding => finding.findingId === intent.findingId));
  return { baseline: parsed.value, intent };
}

export function admitRescan(raw: unknown, before: unknown, submitted: RescanIntent): RescanOutcome | null {
  try {
    const { baseline, intent } = readRescanSelection(snapshot(before), snapshot(submitted));
    const transport = readObject(snapshot(raw), ['status', 'body']);
    const body = readObject(transport.body);
    requireValid(body.ok === true || body.ok === false);
    const parsed = body.run === null ? null : validateRun(body.run);
    requireValid(parsed === null || (parsed.ok && parsed.value.runId === intent.runId
      && parsed.value.baselineRunId === intent.baselineRunId
      && parsed.value.requestedUrl === baseline.requestedUrl && parsed.value.providerContext.mode === intent.mode));
    const run = parsed?.ok ? parsed.value : null;
    if (body.ok) {
      requireKeys(body, ['ok', 'run']);
      requireValid(transport.status === 200 && run?.status === 'completed'
        && run.comparison && run.scan.findings.every(finding => finding.state === 'unprocessed'));
      const finding = baseline.scan.findings.find(item => item.findingId === intent.findingId)!;
      requireValid(equal(run.comparison.baseline, { findingId: finding.findingId,
        observation: comparisonObservation(finding), requestedUrl: baseline.requestedUrl,
        scanContext: baseline.scan.context }));
      return { ok: true, run };
    }
    if (run?.status === 'completed') {
      requireKeys(body, ['ok', 'error', 'run', 'persisted', 'comparisonPersisted', 'cleanupFailed']);
      const error = readChoice(body.error, Object.keys(comparisonStatuses) as Array<ComparisonFailure['error']>);
      requireValid(transport.status === comparisonStatuses[error] && !run.comparison
        && run.scan.findings.every(finding => finding.state === 'unprocessed')
        && body.persisted === true && body.comparisonPersisted === false && typeof body.cleanupFailed === 'boolean'
        && (!body.cleanupFailed || error === 'comparison-persistence' || error === 'comparison-shutdown'));
      return { ok: false, error, run, persisted: true, comparisonPersisted: false, cleanupFailed: body.cleanupFailed };
    }
    requireKeys(body, ['ok', 'error', 'run', 'persisted', 'cleanupFailed']);
    const error = readChoice(body.error, Object.keys(statuses) as Array<keyof typeof statuses>);
    requireValid(transport.status === statuses[error] && typeof body.persisted === 'boolean'
      && typeof body.cleanupFailed === 'boolean');
    if (run !== null) {
      requireValid(run.status === 'failed'
        && (error === 'scan-failed' || error === 'result-validation'
          || error === 'initial-persistence' || error === 'shutdown')
        && body.cleanupFailed === (run.scanContext.cleanup === 'failed'));
      return { ok: false, error, run, persisted: body.persisted, cleanupFailed: body.cleanupFailed };
    }
    requireValid(!['scan-failed', 'result-validation', 'initial-persistence'].includes(error)
      && body.persisted === false && (!body.cleanupFailed || error === 'create-failed'));
    return { ok: false, error, run: null, persisted: false, cleanupFailed: body.cleanupFailed };
  } catch { return null; }
}
