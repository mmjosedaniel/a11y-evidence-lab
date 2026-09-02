import type { PageAnalysisRun } from '../domain/run-contract.ts';
import type { CompletedRun, FailedRun, RunningRun } from '../persistence/run-repository.ts';

export type ReadResult =
  | { ok: true; run: PageAnalysisRun; interrupted: boolean }
  | { ok: false; error: 'invalid-id' | 'busy' | 'stopping' | 'not-found'
      | 'invalid-run' | 'stored-run-unavailable' | 'read-failed' };

export type ScanOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: 'invalid-request' | 'busy' | 'stopping' | 'create-failed'
      | 'scan-failed' | 'result-validation' | 'initial-persistence' | 'shutdown';
      run: FailedRun | null; persisted: boolean; cleanupFailed: boolean };

export type StopResult =
  | { ok: true; status: 'stopped' }
  | { ok: false; error: 'stop-failed' };

export interface LocalService {
  readonly url: string;
  readonly whenStopping: Promise<void>;
  readonly whenStopped: Promise<StopResult>;
  readRun(id: unknown): ReadResult;
  runScan(input: unknown, execute: (run: RunningRun, signal: AbortSignal) => Promise<unknown>): Promise<ScanOutcome>;
  stop(): Promise<StopResult>;
}

export type StartResult =
  | { ok: true; service: LocalService }
  | { ok: false; error: 'invalid-configuration' | 'storage-unavailable' | 'listen-failed' };

export interface ServiceOptions {
  runRoot: string;
  applicationRevision: string;
  port?: number;
  stopTimeoutMs?: number;
}
