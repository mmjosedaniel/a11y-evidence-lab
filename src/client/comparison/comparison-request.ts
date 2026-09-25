import { validateRun } from '../../server/domain/run-contract.ts';
import type { CompletedRun } from '../../server/persistence/run-repository.ts';
import type { ComparisonLineage } from './comparison-admission.ts';
import { admitComparisonRead } from './comparison-admission.ts';
import { snapshot } from '../responses/finding-response-snapshot.ts';

export type ComparisonReadCallback = (runId: string, signal: AbortSignal) => Promise<unknown>;
export type ComparisonAvailability = ComparisonLineage | { readonly status: 'unverified' };

export async function getComparisonRun(runId: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(`/api/runs/${encodeURIComponent(runId)}`, { method: 'GET', signal });
  return { status: response.status, body: await response.json() };
}

// App installs stop before start can reflect caller-owned values.
export function createComparisonRequest(options: {
  readonly run: CompletedRun;
  readonly current: () => boolean;
  readonly readCallback: () => unknown;
  readonly settle: (result: ComparisonAvailability) => void;
}): { start: () => void; stop: () => void } {
  const controller = new AbortController();
  let started = false;
  let terminal = false;
  let timer: number | undefined;
  let expires = 0;
  const current = () => !terminal && options.current() && !terminal;
  const finish = (result: ComparisonAvailability): void => {
    if (!current()) return;
    terminal = true;
    window.clearTimeout(timer);
    options.settle(result);
  };
  const unverified = (): void => {
    if (!current()) return;
    finish({ status: 'unverified' });
    controller.abort();
  };
  const timely = (): boolean => {
    if (!current()) return false;
    if (performance.now() >= expires) { unverified(); return false; }
    return true;
  };
  async function execute(): Promise<void> {
    try {
      const captured = snapshot(options.run);
      if (!timely()) return;
      const parsed = validateRun(captured);
      if (!timely()) return;
      if (!parsed.ok || parsed.value.status !== 'completed' || !parsed.value.comparison) { unverified(); return; }
      const callback = options.readCallback();
      if (!timely()) return;
      if (typeof callback !== 'function') { unverified(); return; }
      const pending = (callback as ComparisonReadCallback)(parsed.value.runId, controller.signal);
      if (!timely()) { void Promise.resolve(pending).catch(() => undefined); return; }
      const raw = await pending;
      if (!timely()) return;
      const admitted = admitComparisonRead(raw, parsed.value);
      // Snapshot reflection can itself invalidate ownership; metadata is applied only afterward.
      if (!timely()) return;
      if (!admitted) { unverified(); return; }
      finish(admitted);
    } catch { unverified(); }
  }
  return {
    start(): void {
      if (started || terminal) return;
      started = true;
      if (!current()) return;
      expires = performance.now() + 30000;
      timer = window.setTimeout(unverified, 30000);
      void execute();
    },
    stop(): void {
      terminal = true;
      window.clearTimeout(timer);
      controller.abort();
    },
  };
}
