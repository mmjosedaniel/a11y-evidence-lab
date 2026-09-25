import type { PageAnalysisRun } from '../../server/domain/run-contract.ts';
import { generationTimeoutMs } from '../../shared/generation-timeout.ts';
import type { GenerationPresentation } from '../components/results/FindingGeneration.tsx';
import { admitGeneration } from './finding-generation-admission.ts';
import type { GenerationOutcome } from './finding-generation-admission.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type UnknownError = Extract<GenerationPresentation, { status: 'unknown' }>['error'];

// Capture the deadline before App publishes pending state. Caller reflection and
// dispatch wait until App has consumed the continuation and installed stop.
export function createGenerationRequest(options: {
  readonly run: CompleteRun;
  readonly findingId: string;
  readonly current: () => boolean;
  readonly readCallback: () => unknown;
  readonly unknown: (error: UnknownError) => void;
  readonly settle: (outcome: GenerationOutcome) => void;
  readonly cleanup: (stop: () => void) => void;
}): { start: () => Promise<void>; stop: () => void } {
  const controller = new AbortController();
  const duration = generationTimeoutMs(options.run.providerContext.mode);
  const expires = performance.now() + duration;
  let timer: number | undefined;
  const unknown = (error: UnknownError): void => {
    if (!options.current()) return;
    // Shared ownership and announcements must be published before abort reenters.
    options.unknown(error);
    controller.abort();
  };
  const stop = (): void => { window.clearTimeout(timer); controller.abort(); };
  const timely = (): boolean => {
    if (!options.current()) return false;
    if (performance.now() >= expires) { unknown('timeout'); return false; }
    return true;
  };

  async function start(): Promise<void> {
    timer = window.setTimeout(() => unknown('timeout'), duration);
    try {
      const callback = options.readCallback();
      if (!timely()) return;
      if (typeof callback !== 'function') { unknown('unavailable'); return; }
      const raw = await callback({ runId: options.run.runId, findingId: options.findingId }, controller.signal);
      if (!timely()) return;
      const outcome = admitGeneration(raw, options.run, options.findingId);
      if (!timely()) return;
      if (!outcome) { unknown('invalid-result'); return; }
      options.settle(outcome);
    } catch {
      unknown('request-failed');
    } finally {
      window.clearTimeout(timer);
      options.cleanup(stop);
    }
  }

  return { start, stop };
}
