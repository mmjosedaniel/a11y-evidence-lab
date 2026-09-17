import type { PageAnalysisRun } from '../server/domain/run-contract.ts';
import { admitRescan, readRescanSelection } from './rescan-admission.ts';
import type { RescanIntent } from './rescan-admission.ts';
import { snapshot } from './finding-response-snapshot.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
export type RescanCallback = (intent: RescanIntent, signal: AbortSignal) => Promise<unknown>;
export type RescanPresentation =
  | { readonly status: 'pending' }
  | { readonly status: 'unknown' }
  | { readonly status: 'refused'; readonly error: string; readonly cleanup: boolean;
      readonly released: boolean; readonly run: FailedRun | null; readonly persisted: boolean };
export type RescanSettlement = Exclude<RescanPresentation, { status: 'pending' }>
  | { readonly status: 'completed'; readonly run: CompleteRun };

// Construction is inert: App installs stop before start can reflect caller-owned values.
export function createRescanRequest(options: {
  readonly baseline: CompleteRun;
  readonly intent: RescanIntent;
  readonly current: () => boolean;
  readonly readCallback: () => unknown;
  readonly settle: (result: RescanSettlement) => void;
}): { start: () => void; stop: () => void } {
  const controller = new AbortController();
  let started = false;
  let terminal = false;
  let timer: number | undefined;
  let expires = 0;
  const current = (): boolean => !terminal && options.current() && !terminal;
  const finish = (result: RescanSettlement): void => {
    if (!current()) return;
    terminal = true;
    window.clearTimeout(timer);
    options.settle(result);
  };
  const unknown = (): void => {
    if (!current()) return;
    finish({ status: 'unknown' });
    controller.abort();
  };
  const timely = (): boolean => {
    if (!current()) return false;
    if (performance.now() >= expires) { unknown(); return false; }
    return true;
  };
  const refuseLocal = (error: string): void => finish({ status: 'refused', error,
    cleanup: false, released: true, run: null, persisted: false });

  async function execute(): Promise<void> {
    let selection: ReturnType<typeof readRescanSelection>;
    try {
      const before = snapshot(options.baseline);
      if (!timely()) return;
      const captured = snapshot(options.intent);
      if (!timely()) return;
      selection = readRescanSelection(before, captured);
      if (!timely()) return;
    } catch {
      if (timely()) refuseLocal('invalid-request');
      return;
    }
    try {
      const callback = options.readCallback();
      if (!timely()) return;
      if (typeof callback !== 'function') { refuseLocal('Rescan is unavailable'); return; }
      const pending = (callback as RescanCallback)(selection.intent, controller.signal);
      // Observe rejection even if invocation reentrantly invalidated the request.
      if (!timely()) { void Promise.resolve(pending).catch(() => undefined); return; }
      const raw = await pending;
      if (!timely()) return;
      const outcome = admitRescan(raw, selection.baseline, selection.intent);
      if (!timely()) return;
      if (!outcome) { unknown(); return; }
      if (outcome.ok) { finish({ status: 'completed', run: outcome.run }); return; }
      const released = !outcome.cleanupFailed
        && !['busy', 'stopping', 'shutdown'].includes(outcome.error);
      finish({ status: 'refused', error: outcome.error, cleanup: outcome.cleanupFailed,
        released, run: outcome.run, persisted: outcome.persisted });
    } catch { unknown(); }
  }

  return {
    start(): void {
      if (started || terminal) return;
      started = true;
      if (!current()) return;
      expires = performance.now() + 30000;
      timer = window.setTimeout(unknown, 30000);
      void execute();
    },
    stop(): void {
      terminal = true;
      window.clearTimeout(timer);
      controller.abort();
    },
  };
}
