import type { PageAnalysisRun } from '../../server/domain/run-contract.ts';
import { admitGuidance } from './finding-guidance-admission.ts';
import type { GuidanceIntent, GuidanceOutcome } from './finding-guidance-admission.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;

export async function executeGuidanceRequest(options: {
  readonly run: CompleteRun;
  readonly findingId: string;
  readonly callback: (intent: GuidanceIntent) => Promise<unknown>;
  readonly current: () => boolean;
  readonly fail: (error: string) => void;
  readonly settle: (outcome: GuidanceOutcome) => void;
  readonly cleanup: () => void;
}): Promise<void> {
  const { callback } = options;
  try {
    const raw = await callback({ runId: options.run.runId, findingId: options.findingId });
    if (!options.current()) return;
    const outcome = admitGuidance(raw, options.run, options.findingId);
    // Descriptor reflection may reenter or unmount App; ownership must still be ours.
    if (!options.current()) return;
    if (!outcome) { options.fail('invalid-result'); return; }
    options.settle(outcome);
  } catch {
    if (options.current()) options.fail('request-failed');
  } finally {
    options.cleanup();
  }
}
