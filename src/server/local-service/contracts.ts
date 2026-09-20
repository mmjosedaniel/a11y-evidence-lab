import type { NativeRule } from '../scan/normalization/native-rule-evidence.ts';
import type { GenerationAdapter, GenerationErrorCode, ProviderInvocation } from '../generation/generation-contract.ts';
import type { Finding, PageAnalysisRun } from '../domain/run-contract.ts';
import type { CompletedRun, FailedRun, RunningRun } from '../persistence/run-repository.ts';
import type { RetrievalErrorCode } from '../retrieval/retrieval-error.ts';
import type { FindingGuidanceView } from '../domain/finding-analysis-types.ts';

export type ComparisonLineage = { readonly status: 'available' }
  | { readonly status: 'unavailable'; readonly reason: 'not-found' | 'invalid-run'
      | 'read-failed' | 'stored-run-unavailable' | 'baseline-mismatch' };
export type ComparisonFailure = { ok: false; error: 'comparison-calculation' | 'comparison-lineage'
  | 'comparison-persistence' | 'comparison-aborted' | 'comparison-shutdown';
  run: CompletedRun; persisted: true; comparisonPersisted: false; cleanupFailed: boolean };

export type ReadResult =
  | { ok: true; run: PageAnalysisRun; interrupted: boolean; comparisonLineage?: ComparisonLineage }
  | { ok: false; error: 'invalid-id' | 'busy' | 'stopping' | 'not-found'
      | 'invalid-run' | 'stored-run-unavailable' | 'read-failed' };

export type ScanOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: 'invalid-request' | 'busy' | 'stopping' | 'create-failed'
      | 'scan-failed' | 'result-validation' | 'initial-persistence' | 'shutdown';
      run: FailedRun | null; persisted: boolean; cleanupFailed: boolean };

export type RescanOutcome = ScanOutcome | ComparisonFailure | { ok: false; error: 'not-found' | 'not-eligible' | 'comparison-lineage'
  | 'invalid-run' | 'stored-run-unavailable' | 'read-failed';
  run: FailedRun | null; persisted: boolean; cleanupFailed: boolean };
export type RescanExecutor = (run: RunningRun, signal: AbortSignal, selectedRule: NativeRule) => Promise<unknown>;

export type RetrievalServiceError =
  | 'invalid-request' | 'busy' | 'stopping' | 'not-found' | 'invalid-run'
  | 'stored-run-unavailable' | 'read-failed' | 'not-eligible' | 'workflow-active'
  | 'retrieval-persistence' | RetrievalErrorCode;
export type RetrievalOutcome =
  | { ok: true; run: CompletedRun; view: FindingGuidanceView }
  | { ok: false; error: RetrievalServiceError; run: CompletedRun | null; persisted: boolean; cleanupFailed: boolean };
export type RetrievalExecutor = (finding: Finding, signal: AbortSignal) => Promise<unknown>;

export type GenerationServiceOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: Exclude<RetrievalServiceError, RetrievalErrorCode | 'retrieval-persistence'>
      | GenerationErrorCode | 'generation-persistence'; run: CompletedRun | null; persisted: boolean;
      cleanupFailed: boolean; invocationPersisted: boolean; invocation?: ProviderInvocation };

export type StopResult =
  | { ok: true; status: 'stopped' }
  | { ok: false; error: 'stop-failed' };

export type ReviewOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: 'invalid-request' | 'busy' | 'stopping' | 'workflow-active' | 'not-found'
      | 'invalid-run' | 'stored-run-unavailable' | 'read-failed' | 'not-eligible'
      | 'review-validation' | 'review-persistence' | 'shutdown';
      run: CompletedRun | null; persisted: false; cleanupFailed: boolean };

export interface LocalService {
  readonly url: string;
  readonly whenStopping: Promise<void>;
  readonly whenStopped: Promise<StopResult>;
  readRun(id: unknown): ReadResult;
  runScan(input: unknown, execute: (run: RunningRun, signal: AbortSignal) => Promise<unknown>): Promise<ScanOutcome>;
  rescanFinding(input: unknown, execute?: RescanExecutor): Promise<RescanOutcome>;
  retrieveFinding(input: unknown, execute?: RetrievalExecutor): Promise<RetrievalOutcome>;
  generateFinding(input: unknown, adapter?: GenerationAdapter): Promise<GenerationServiceOutcome>;
  reviewFinding(input: unknown): Promise<ReviewOutcome>;
  stop(): Promise<StopResult>;
}

export type StartResult =
  | { ok: true; service: LocalService }
  | { ok: false; error: 'invalid-configuration' | 'client-unavailable' | 'storage-unavailable' | 'listen-failed' };

export interface ServiceOptions {
  runRoot: string;
  applicationRevision: string;
  clientRoot?: string;
  port?: number;
  stopTimeoutMs?: number;
}
