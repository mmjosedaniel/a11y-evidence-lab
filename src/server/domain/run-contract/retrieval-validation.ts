import { validateRetrievalResult } from '../../retrieval/retrieval-contract.ts';
import type { RetrievalErrorCode } from '../../retrieval/retrieval-error.ts';
import { readChoice, readObject, readTime, requireKeys, requireValid } from './contract-value-reader.ts';
import { readFinding } from './finding-validation.ts';
import type { Finding, NativeFinding } from './run-types.ts';

const retrievalErrors = [
  'corpus-integrity', 'missing-prerequisite', 'model-identity', 'input-fit',
  'embedding-failed', 'embedding-response', 'timeout', 'shutdown', 'result-validation',
] as const satisfies readonly RetrievalErrorCode[];
const nativeKeys = ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence'] as const;

function nativeFinding(record: Record<string, unknown>): NativeFinding {
  const input = Object.fromEntries(nativeKeys.map(key => [key, record[key]]));
  return readFinding({ ...input, state: 'unprocessed' });
}

export function readStoredFinding(input: unknown, parentFinishedAt: string): Finding {
  const record = readObject(input);
  const state = readChoice(record.state, ['unprocessed', 'active', 'failed']);
  if (state === 'unprocessed') {
    requireKeys(record, [...nativeKeys, 'state']);
    return nativeFinding(record);
  }
  requireKeys(record, [...nativeKeys, 'state', 'retrieval']);
  const native = nativeFinding(record);
  const retrieval = readObject(record.retrieval);
  const status = readChoice(retrieval.status, ['running', 'completed', 'failed']);
  const startedAt = readTime(retrieval.startedAt);
  requireValid(startedAt >= parentFinishedAt);
  if (state === 'active' && status === 'running') {
    requireKeys(retrieval, ['status', 'startedAt']);
    return Object.freeze({ ...native, state, retrieval: Object.freeze({ status, startedAt }) });
  }
  const finishedAt = readTime(retrieval.finishedAt);
  requireValid(finishedAt >= startedAt);
  if (state === 'active' && status === 'completed') {
    requireKeys(retrieval, ['status', 'startedAt', 'finishedAt', 'result']);
    const result = validateRetrievalResult(retrieval.result, native);
    requireValid(result.ok);
    return Object.freeze({ ...native, state, retrieval: Object.freeze({ status, startedAt, finishedAt, result: result.value }) });
  }
  requireValid(state === 'failed' && status === 'failed');
  requireKeys(retrieval, ['status', 'startedAt', 'finishedAt', 'error']);
  const error = readChoice(retrieval.error, retrievalErrors);
  return Object.freeze({ ...native, state, retrieval: Object.freeze({ status, startedAt, finishedAt, error }) });
}
