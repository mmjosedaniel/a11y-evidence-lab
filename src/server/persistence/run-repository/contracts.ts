import type { PageAnalysisRun } from '../../domain/run-contract.ts';

export type RunningRun = Extract<PageAnalysisRun, { status: 'running' }>;
export type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;
export type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
export type TerminalRun = CompletedRun | FailedRun;
export type StoreError =
  | 'invalid-id' | 'unsafe-path' | 'collision' | 'not-found'
  | 'invalid-run' | 'identity-mismatch' | 'invalid-transition'
  | 'read-failed' | 'write-failed';
export type StoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: StoreError; cleanupFailed: boolean };
export interface RunRepository {
  create(input: unknown): StoreResult<RunningRun>;
  read(runId: unknown): StoreResult<PageAnalysisRun>;
  finish(input: unknown): StoreResult<TerminalRun>;
}
