import { compareFinding } from '../comparison/compare-finding.ts';
import type { ComparisonCalculation } from '../comparison/comparison-contract.ts';
import type { RunningRun, TerminalRun } from '../persistence/run-repository.ts';
import { executeRescanScan } from '../scan/scan-page.ts';
import type { RescanExecutor, ScanOutcome } from './contracts.ts';
import type { PreparedRescan } from './rescan-operation.ts';
import { startScanOperation, type ScanOperationDependencies } from './scan-operation.ts';
import { matchTerminalRun } from './scan-run-records.ts';

type Comparison = ComparisonCalculation | { ok: false;
  error: 'comparison-failed' | 'scan-unavailable' | 'shutdown' };

function admitTerminal(envelope: unknown, running: RunningRun): TerminalRun | undefined {
  try {
    if (typeof envelope !== 'object' || envelope === null) return;
    const descriptor = Object.getOwnPropertyDescriptor(envelope, 'run');
    if (!descriptor?.enumerable || !('value' in descriptor)) return;
    return matchTerminalRun(running, descriptor.value);
  } catch { return; }
}

function readCandidates(envelope: unknown, terminal: TerminalRun, stopped: () => boolean): unknown {
  if (typeof envelope !== 'object' || envelope === null || Array.isArray(envelope)) {
    throw new Error('Invalid envelope');
  }
  const prototype = Object.getPrototypeOf(envelope);
  if (stopped()) return;
  if (prototype !== Object.prototype && prototype !== null) throw new Error('Invalid envelope');
  const keys = Reflect.ownKeys(envelope);
  if (stopped()) return;
  const expected = terminal.status === 'completed' ? ['run', 'candidates'] : ['run'];
  if (keys.length !== expected.length || keys.some(key => typeof key !== 'string' || !expected.includes(key))) {
    throw new Error('Invalid envelope');
  }
  // The admitted run is immutable; later reflection must never read its descriptor again.
  if (terminal.status === 'failed') return;
  const descriptor = Object.getOwnPropertyDescriptor(envelope, 'candidates');
  if (!descriptor?.enumerable || !('value' in descriptor)) throw new Error('Invalid envelope');
  return descriptor.value;
}

export function executeRescanComparison(dependencies: ScanOperationDependencies, prepared: PreparedRescan,
  signal: AbortSignal, execute: RescanExecutor = executeRescanScan,
  onCompleted?: () => void): Promise<{ outcome: ScanOutcome; comparison: Comparison }> {
  const stopped = () => signal.aborted || dependencies.isStopping() || dependencies.deadlineExpired();
  let provisional: Comparison = { ok: false, error: 'scan-unavailable' };
  return new Promise(resolve => {
    startScanOperation(dependencies, prepared.run, async running => {
      let envelope: unknown;
      let candidates: unknown;
      try {
        envelope = await execute(running, signal, prepared.rule);
        const terminal = admitTerminal(envelope, running);
        if (!terminal || stopped()) return terminal;
        try {
          candidates = readCandidates(envelope, terminal, stopped);
        } catch {
          provisional = { ok: false, error: 'invalid-comparison-input' };
          return terminal;
        }
        if (stopped() || terminal.status !== 'completed') return terminal;
        try {
          provisional = compareFinding({ baselineRun: prepared.baselineRun,
            baselineFindingId: prepared.baselineFindingId, laterRun: terminal, candidates });
        } catch { provisional = { ok: false, error: 'comparison-failed' }; }
        return terminal;
      } finally {
        candidates = undefined;
        envelope = undefined;
      }
    }, signal, outcome => {
      const comparison = stopped() ? { ok: false as const, error: 'shutdown' as const }
        : !outcome.ok ? { ok: false as const, error: 'scan-unavailable' as const } : provisional;
      provisional = { ok: false, error: 'scan-unavailable' };
      resolve({ outcome, comparison });
    }, onCompleted);
  });
}
