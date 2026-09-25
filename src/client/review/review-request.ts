import { validateRun } from '../../server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../../server/domain/run-contract.ts';
import { validateReviewInput } from '../../server/domain/review-contract.ts';
import { admitReview } from './finding-review-admission.ts';
import type { ReviewIntent } from './finding-review-admission.ts';
import { snapshot } from '../responses/finding-response-snapshot.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
export type ReviewCallback = (intent: ReviewIntent, signal: AbortSignal) => Promise<unknown>;
export type ReviewPresentation =
  | { readonly status: 'pending' }
  | { readonly status: 'unknown' }
  | { readonly status: 'refused'; readonly error: string; readonly cleanup: boolean; readonly released: boolean };
type Settlement = Exclude<ReviewPresentation, { status: 'pending' }> | { readonly status: 'saved'; readonly run: CompleteRun };

export function reviewRefusalText(result: Extract<ReviewPresentation, { status: 'refused' }>): string {
  let reason: string;
  switch (result.error) {
    case 'invalid-request': case 'review-validation':
      reason = result.released ? 'Check the review content before submitting again.' : 'The review content could not be accepted.';
      break;
    case 'busy': case 'workflow-active': reason = 'Another operation is still active.'; break;
    case 'not-eligible': reason = 'This Finding is no longer available for review.'; break;
    case 'not-found': reason = 'The saved run could not be found.'; break;
    case 'stopping': case 'shutdown': reason = 'The service is stopping.'; break;
    case 'review-persistence': reason = 'The service could not save the decision.'; break;
    case 'Review is unavailable': reason = 'Review is unavailable.'; break;
    default: reason = 'The saved run could not be read safely.';
  }
  return `${reason}${result.cleanup ? ' Resource cleanup is uncertain.' : ''}${!result.released ? ' Further actions are blocked.' : ''}`;
}

// App has already reserved the shared token. Construction performs no caller reflection;
// the stop handle is installed before start can enter a collaborator or a Proxy trap.
export function createReviewRequest(options: {
  readonly baseline: CompleteRun;
  readonly intent: ReviewIntent;
  readonly current: () => boolean;
  readonly readCallback: () => unknown;
  readonly settle: (result: Settlement) => void;
}): { start: () => void; stop: () => void } {
  const controller = new AbortController();
  let terminal = false;
  let timer: number | undefined;
  let expires = 0;
  const current = (): boolean => !terminal && options.current();
  const finish = (result: Settlement): void => {
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
  const refuseLocal = (error: string): void => finish({ status: 'refused', error, cleanup: false, released: true });

  async function execute(): Promise<void> {
    let baseline: CompleteRun;
    let intent: ReviewIntent;
    try {
      const before = snapshot(options.baseline);
      if (!timely()) return;
      const captured = snapshot(options.intent) as ReviewIntent;
      if (!timely()) return;
      const parsed = validateRun(before);
      if (!timely()) return;
      if (!parsed.ok || parsed.value.status !== 'completed' || captured.runId !== parsed.value.runId) {
        refuseLocal('review-validation'); return;
      }
      baseline = parsed.value;
      const finding = baseline.scan.findings.find(item => item.findingId === captured.findingId);
      if (!finding || finding.state !== 'proposal-pending-review' || baseline.scan.findings.some(item => item.state === 'active')) {
        refuseLocal('review-validation'); return;
      }
      const { analysis, retrieval, generation, result, ...native } = finding;
      const validated = validateReviewInput(captured.review, {
        finding: { ...native, state: 'unprocessed' }, retrieval: retrieval.result,
      });
      if (!timely()) return;
      if (!validated.ok) { refuseLocal('review-validation'); return; }
      intent = captured;
    } catch {
      if (timely()) refuseLocal('review-validation');
      return;
    }
    try {
      const callback = options.readCallback();
      if (!timely()) return;
      if (typeof callback !== 'function') { refuseLocal('Review is unavailable'); return; }
      const pending = (callback as ReviewCallback)(intent, controller.signal);
      // Observe even a reentrantly invalidated callback's rejection without publishing it.
      if (!timely()) { void Promise.resolve(pending).catch(() => undefined); return; }
      const raw = await pending;
      if (!timely()) return;
      const outcome = admitReview(raw, baseline, intent);
      if (!timely()) return;
      if (!outcome) { unknown(); return; }
      if (outcome.ok) { finish({ status: 'saved', run: outcome.run }); return; }
      const released = outcome.run !== null && !outcome.cleanupFailed
        && (outcome.error === 'invalid-request' || outcome.error === 'review-validation');
      finish({ status: 'refused', error: outcome.error, cleanup: outcome.cleanupFailed, released });
    } catch { unknown(); }
  }

  return {
    start(): void {
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
