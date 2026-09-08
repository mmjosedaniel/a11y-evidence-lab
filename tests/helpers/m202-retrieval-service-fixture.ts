import { completedRun } from './m102-run-fixture.ts';
import { queryCases, retrievalResult } from './m202-retrieval-fixture.ts';

export const retrievalStartedAt = '2026-08-30T10:00:03.000Z';
export const retrievalFinishedAt = '2026-08-30T10:00:04.000Z';

export type MutableRecord = Record<string | number, unknown>;

export function completedScanRun(runId = 'run-01'): MutableRecord {
  return structuredClone(completedRun(runId)) as unknown as MutableRecord;
}

export function selectedFinding(run: MutableRecord, index = 0): MutableRecord {
  return ((run.scan as MutableRecord).findings as MutableRecord[])[index]!;
}

export function expectedRetrievalResult() {
  return retrievalResult(queryCases[0]!.expected, [
    { passageId: 'h37-text-alternative', score: 0.75 },
    { passageId: 'understanding111-intent', score: 0.5 },
    { passageId: 'wcag22-sc111', score: 0.25 },
  ]);
}

export function runningRetrievalRun(runId = 'run-01'): MutableRecord {
  const run = completedScanRun(runId);
  Object.assign(selectedFinding(run), {
    state: 'active', retrieval: { status: 'running', startedAt: retrievalStartedAt },
  });
  return run;
}

export function completedRetrievalRun(runId = 'run-01'): MutableRecord {
  const run = runningRetrievalRun(runId);
  Object.assign(selectedFinding(run), {
    retrieval: {
      status: 'completed', startedAt: retrievalStartedAt,
      finishedAt: retrievalFinishedAt, result: expectedRetrievalResult(),
    },
  });
  return run;
}

export function failedRetrievalRun(
  runId = 'run-01',
  error = 'embedding-failed',
): MutableRecord {
  const run = runningRetrievalRun(runId);
  Object.assign(selectedFinding(run), {
    state: 'failed',
    retrieval: { status: 'failed', startedAt: retrievalStartedAt, finishedAt: retrievalFinishedAt, error },
  });
  return run;
}

export function retrievalRequest(runId = 'run-01', findingId = 'finding-0') {
  return { runId, findingId };
}

export function replaceAt(input: unknown, path: readonly (string | number)[], replacement: unknown): unknown {
  const clone = structuredClone(input);
  let current = clone as MutableRecord;
  for (const key of path.slice(0, -1)) current = current[key] as MutableRecord;
  current[path[path.length - 1]!] = replacement;
  return clone;
}
