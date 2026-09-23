import assert from 'node:assert/strict';
import type { CandidateDetail } from '../../src/server/generation/generation-diagnostics.ts';
import type { RuntimeFailureCode, M602SuccessorObservation } from './m602-successor-evidence.ts';
import type { M602Result } from './m602-operation.ts';

export type M602InstrumentedDetails = Readonly<{
  integrity: 'complete' | 'failed'; candidate: CandidateDetail | null; runtime: RuntimeFailureCode | null;
}>;
const fields: readonly CandidateDetail['field'][] = ['candidate', 'type', 'findingId', 'evidenceSufficiency',
  'evidenceSufficiency.findingEvidence', 'evidenceSufficiency.guidance', 'assumptions', 'assumptions[]',
  'findingSummary', 'findingSummary.text', 'findingSummary.evidenceReferences', 'findingSummary.passageIds',
  'userImpact', 'userImpact.text', 'userImpact.evidenceReferences', 'userImpact.passageIds',
  'remediation', 'remediation.text', 'remediation.evidenceReferences', 'remediation.passageIds',
  'confidence', 'uncertainty', 'blockingManualJudgment', 'postChangeVerificationReminder'];
const reasons: readonly CandidateDetail['reason'][] = ['structure', 'fixed-value', 'finding-mismatch',
  'prose-type', 'prose-length', 'prose-blank', 'prohibited-claim', 'reference-value', 'reference-duplicate',
  'reference-count', 'assumption-count', 'choice'];
const runtimeCodes: readonly RuntimeFailureCode[] = ['transport-lifecycle', 'http-metadata', 'body-limit',
  'encoding-json', 'target-cardinality', 'digest', 'context', 'memory'];

function closed(value: unknown, keys: readonly string[]): asserts value is Record<string, unknown> {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  assert.deepEqual(Reflect.ownKeys(value).sort(), [...keys].sort());
}
function candidateDetail(value: unknown): CandidateDetail {
  closed(value, ['field', 'reason']);
  const { field, reason } = value;
  assert.ok(fields.includes(field as CandidateDetail['field']) && reasons.includes(reason as CandidateDetail['reason']));
  return Object.freeze({ field, reason }) as CandidateDetail;
}
function runtimeDetail(value: unknown): RuntimeFailureCode {
  assert.ok(runtimeCodes.includes(value as RuntimeFailureCode));
  return value as RuntimeFailureCode;
}
export function createM602InstrumentedDiagnosticCollector() {
  let candidate: CandidateDetail | null = null, runtime: RuntimeFailureCode | null = null;
  let failed = false, result: M602InstrumentedDetails | undefined;
  return Object.freeze({
    onCandidate(value: unknown): void {
      if (result || failed) return;
      try {
        const detail = candidateDetail(value);
        if (candidate) assert.deepEqual(detail, candidate);
        else candidate = detail;
      } catch { failed = true; candidate = null; runtime = null; }
    },
    onRuntime(value: unknown): void {
      if (result || failed) return;
      try {
        const code = runtimeDetail(value);
        if (runtime) assert.equal(code, runtime);
        else runtime = code;
      } catch { failed = true; candidate = null; runtime = null; }
    },
    close(): M602InstrumentedDetails {
      return result ??= Object.freeze({ integrity: failed ? 'failed' : 'complete', candidate, runtime });
    },
  });
}
export function reconcileInstrumentedDetails(details: M602InstrumentedDetails,
  timing: M602SuccessorObservation['timing']): M602InstrumentedDetails {
  // Cancellation can emit a transport failure after the coordinator freezes an aborted sample.
  return timing.runtime.status === 'failed' || details.runtime === null
    ? details : Object.freeze({ ...details, runtime: null });
}
export function validateInstrumentedDetails(value: unknown, observation: Pick<M602SuccessorObservation,
  'caseLabel' | 'diagnostic' | 'timing'>, result: Pick<M602Result, 'status' | 'error' | 'observation'>): asserts value is M602InstrumentedDetails {
  closed(value, ['integrity', 'candidate', 'runtime']);
  assert.ok(value.integrity === 'complete' || value.integrity === 'failed');
  if (value.integrity === 'failed') {
    assert.equal(value.candidate, null); assert.equal(value.runtime, null); return;
  }
  if (value.candidate !== null) {
    candidateDetail(value.candidate);
    assert.equal(observation.diagnostic.integrity, 'complete');
    assert.equal(observation.diagnostic.code, 'candidate/contract');
    assert.equal(result.status, 'failed'); assert.equal(result.error, 'response-validation');
    assert.equal(result.observation?.outcome, 'response'); assert.equal(result.observation?.validation, 'failed');
  }
  if (value.runtime !== null) {
    runtimeDetail(value.runtime);
    assert.ok(observation.caseLabel.startsWith('local-'));
    assert.equal(observation.timing.runtime.status, 'failed');
  }
}
