import { completedRun } from './m102-run-fixture.ts';
import { queryCases, retrievalResult } from './m202-retrieval-fixture.ts';
import { buildFindingAnalysis } from '../../src/server/domain/finding-analysis.ts';
import { classifyGuidanceSupport } from '../../src/server/retrieval/support-policy.ts';

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

export function retrievalResultForPassages(passages: { passageId: string; score: number }[]) {
  return retrievalResult(queryCases[0]!.expected, passages);
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

function assessedRetrievalRun(
  runId: string,
  passages: { passageId: string; score: number }[],
): MutableRecord {
  const run = runningRetrievalRun(runId);
  const native = selectedFinding(completedScanRun(runId));
  const retrieval = retrievalResultForPassages(passages);
  const support = classifyGuidanceSupport(native, retrieval);
  if (!support.ok) throw new Error('Assessed retrieval fixture must have valid support');
  const decision = buildFindingAnalysis(native as never, retrievalStartedAt, retrievalFinishedAt, support.value);
  Object.assign(selectedFinding(run), {
    state: decision.state,
    retrieval: {
      status: 'completed', startedAt: retrievalStartedAt, finishedAt: retrievalFinishedAt,
      result: retrieval, support: support.value,
    },
    analysis: decision.analysis,
    ...('result' in decision ? { result: decision.result } : {}),
  });
  return run;
}

export function assessedSupportedRetrievalRun(runId = 'run-01'): MutableRecord {
  return assessedRetrievalRun(runId, [
    { passageId: 'h37-text-alternative', score: 0.75 },
    { passageId: 'understanding111-intent', score: 0.5 },
    { passageId: 'wcag22-sc111', score: 0.25 },
  ]);
}

export function assessedMissingRetrievalRun(runId = 'run-01'): MutableRecord {
  return assessedRetrievalRun(runId, []);
}

export function assessedIncompleteRetrievalRun(runId = 'run-01'): MutableRecord {
  return assessedRetrievalRun(runId, [{ passageId: 'wcag22-sc111', score: 0.75 }]);
}

export function runningEvidenceAnalysisRun(runId = 'run-01'): MutableRecord {
  const run = completedScanRun(runId);
  const finding = selectedFinding(run);
  (finding.evidence as MutableRecord).altState = { unavailable: 'missing' };
  Object.assign(finding, {
    state: 'active', analysis: { status: 'running', startedAt: retrievalStartedAt },
  });
  return run;
}

export function evidenceAbstainedRun(runId = 'run-01'): MutableRecord {
  const run = completedScanRun(runId);
  const finding = selectedFinding(run);
  (finding.evidence as MutableRecord).altState = { unavailable: 'missing' };
  const decision = buildFindingAnalysis(finding as never, retrievalStartedAt, retrievalFinishedAt, null);
  Object.assign(finding, decision);
  return run;
}

export function failedEvidenceAnalysisRun(
  runId = 'run-01', error: 'shutdown' | 'result-validation' = 'shutdown',
): MutableRecord {
  const run = runningEvidenceAnalysisRun(runId);
  Object.assign(selectedFinding(run), {
    state: 'failed',
    analysis: { status: 'failed', startedAt: retrievalStartedAt, finishedAt: retrievalFinishedAt, error },
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
