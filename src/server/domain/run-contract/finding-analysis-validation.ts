import { buildFindingAnalysis } from '../finding-analysis.ts';
import { assessFindingEvidence } from '../finding-sufficiency.ts';
import { classifyGuidanceSupport } from '../../retrieval/support-policy.ts';
import { validateRetrievalResult } from '../../retrieval/retrieval-contract.ts';
import { readArray, readChoice, readObject, readTime, requireKeys, requireValid } from './contract-value-reader.ts';
import type { AssessedFinding, NativeFinding } from './run-types.ts';

// Compare strict own-data shapes against recomputed policy, without depending on key order.
function requireCorrespondence(input: unknown, expected: unknown): void {
  if (Array.isArray(expected)) {
    const items = readArray(input, item => item);
    requireValid(items.length === expected.length);
    items.forEach((item, index) => requireCorrespondence(item, expected[index]));
  } else if (typeof expected === 'object' && expected !== null) {
    const values = expected as Record<string, unknown>;
    const record = readObject(input, Object.keys(values));
    for (const key of Object.keys(values)) requireCorrespondence(record[key], values[key]);
  } else requireValid(Object.is(input, expected));
}

export function readAssessedFinding(
  record: Record<string, unknown>, native: NativeFinding, parentFinishedAt: string,
): AssessedFinding {
  const nativeKeys = Object.keys(native);
  const analysis = readObject(record.analysis);
  const startedAt = readTime(analysis.startedAt);
  requireValid(startedAt >= parentFinishedAt);
  const evidence = assessFindingEvidence(native);
  if (evidence.state === 'incomplete') {
    if (analysis.status === 'running') {
      requireKeys(record, [...nativeKeys, 'analysis']);
      requireKeys(analysis, ['status', 'startedAt']);
      requireValid(record.state === 'active');
      return Object.freeze({ ...native, state: 'active', analysis: Object.freeze({ status: 'running', startedAt }) });
    }
    const finishedAt = readTime(analysis.finishedAt);
    requireValid(finishedAt >= startedAt);
    if (analysis.status === 'failed') {
      requireKeys(record, [...nativeKeys, 'analysis']);
      requireKeys(analysis, ['status', 'startedAt', 'finishedAt', 'error']);
      requireValid(record.state === 'failed');
      const error = readChoice(analysis.error, ['shutdown', 'result-validation']);
      return Object.freeze({ ...native, state: 'failed',
        analysis: Object.freeze({ status: 'failed', startedAt, finishedAt, error }) });
    }
    const decision = buildFindingAnalysis(native, startedAt, finishedAt, null);
    requireValid(decision.state === 'abstained');
    requireKeys(record, [...nativeKeys, 'analysis', 'result']);
    requireCorrespondence({ state: record.state, analysis: record.analysis, result: record.result }, decision);
    return Object.freeze({ ...native, ...decision });
  }
  const retrieval = readObject(record.retrieval, ['status', 'startedAt', 'finishedAt', 'result', 'support']);
  requireValid(retrieval.status === 'completed' && retrieval.startedAt === startedAt);
  const finishedAt = readTime(retrieval.finishedAt);
  const result = validateRetrievalResult(retrieval.result, native);
  requireValid(result.ok);
  // The authenticated production snapshot declares no unresolved conflicts.
  const support = classifyGuidanceSupport(native, result.value);
  requireValid(support.ok);
  requireCorrespondence(retrieval.support, support.value);
  const decision = buildFindingAnalysis(native, startedAt, finishedAt, support.value);
  requireKeys(record, [...nativeKeys, 'retrieval', 'analysis', ...('result' in decision ? ['result'] : [])]);
  requireCorrespondence({ state: record.state, analysis: record.analysis,
    ...('result' in decision ? { result: record.result } : {}) }, decision);
  return Object.freeze({ ...native, retrieval: Object.freeze({ status: 'completed' as const, startedAt,
    finishedAt, result: result.value, support: support.value }), ...decision });
}
