import { failureCategories } from './run-policy.ts';
import {
  readChoice,
  readId,
  readObject,
  readPattern,
  readTime,
  readUrl,
  requireKeys,
  requireValid,
} from './contract-value-reader.ts';
import { readContext, readScan, requireCompleteContext } from './scan-validation.ts';
import type {
  PageAnalysisRun,
  ProviderContext,
  RunContext,
  ScanContext,
  ValidationResult,
} from './run-types.ts';

function readProvider(input: unknown): ProviderContext {
  const record = readObject(input, ['mode', 'provider', 'model']);
  if (record.mode === 'local') {
    return Object.freeze({ mode: 'local', provider: readChoice(record.provider, ['ollama']), model: readChoice(record.model, ['qwen3.5:4b']) });
  }
  return Object.freeze({ mode: readChoice(record.mode, ['groq']), provider: readChoice(record.provider, ['groq']), model: readChoice(record.model, ['openai/gpt-oss-20b']) });
}

function requireChronology(createdAt: string, context: ScanContext, finishedAt?: string): void {
  // Canonical four-digit UTC timestamps sort in instant order, including year zero.
  if (finishedAt !== undefined) requireValid(createdAt <= finishedAt);
  if ('value' in context.scannedAt) {
    requireValid(createdAt <= context.scannedAt.value);
    if (finishedAt !== undefined) requireValid(context.scannedAt.value <= finishedAt);
  }
}

function readRun(input: unknown): PageAnalysisRun {
  const record = readObject(input);
  const commonKeys = ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl', 'providerContext', 'status'];
  const status = readChoice(record.status, ['running', 'completed', 'failed']);
  requireKeys(record, [...commonKeys, ...(status === 'running' ? ['scanContext'] : status === 'completed' ? ['finishedAt', 'scan'] : ['scanContext', 'finishedAt', 'failure'])]);
  const common: RunContext = {
    formatVersion: readChoice(record.formatVersion, [1]), runId: readId(record.runId),
    createdAt: readTime(record.createdAt), applicationRevision: readPattern(record.applicationRevision, /^[0-9a-f]{40}$/),
    requestedUrl: readUrl(record.requestedUrl), providerContext: readProvider(record.providerContext),
  };
  if (status === 'completed') {
    const finishedAt = readTime(record.finishedAt);
    const scan = readScan(record.scan);
    requireChronology(common.createdAt, scan.context, finishedAt);
    return Object.freeze({ ...common, status, finishedAt, scan });
  }
  const context = readContext(record.scanContext);
  if (status === 'running') {
    requireValid(context.cleanup === 'pending');
    requireChronology(common.createdAt, context);
    return Object.freeze({ ...common, status, scanContext: Object.freeze({ ...context, cleanup: context.cleanup }) });
  }
  requireValid(context.cleanup === 'closed' || context.cleanup === 'failed');
  const finishedAt = readTime(record.finishedAt);
  const failure = readObject(record.failure, ['category']);
  const category = readChoice(failure.category, failureCategories);
  if (category === 'cleanup') requireValid(context.cleanup === 'failed');
  if (category === 'initial-persistence') requireCompleteContext(context);
  requireChronology(common.createdAt, context, finishedAt);
  return Object.freeze({ ...common, status, finishedAt, scanContext: Object.freeze({ ...context, cleanup: context.cleanup }), failure: Object.freeze({ category }) });
}

export function validateRun(input: unknown): ValidationResult<PageAnalysisRun> {
  try {
    return Object.freeze({ ok: true, value: readRun(input) });
  } catch {
    return Object.freeze({ ok: false, error: 'invalid-run' });
  }
}
