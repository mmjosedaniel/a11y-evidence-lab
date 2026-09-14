import { validateRun } from '../server/domain/run-contract.ts';
import { validateReviewInput } from '../server/domain/review-contract.ts';
import { readChoice, readId, readObject, requireKeys, requireValid } from '../server/domain/run-contract/contract-value-reader.ts';
import type { ReviewOutcome } from '../server/local-service/contracts.ts';
import { equal, snapshot } from './finding-response-snapshot.ts';

export type ReviewIntent = { readonly runId: string; readonly findingId: string; readonly review: unknown };

const statuses = {
  'invalid-request': 400, 'review-validation': 400, 'not-found': 404,
  busy: 409, 'workflow-active': 409, 'not-eligible': 409, stopping: 503, shutdown: 503,
  'invalid-run': 500, 'stored-run-unavailable': 500, 'read-failed': 500, 'review-persistence': 500,
} as const;

export function admitReview(raw: unknown, before: unknown, intent: ReviewIntent): ReviewOutcome | null {
  try {
    const capturedBefore = snapshot(before);
    const capturedIntent = snapshot(intent);
    const capturedRaw = snapshot(raw);
    const baseline = validateRun(capturedBefore);
    requireValid(baseline.ok && baseline.value.status === 'completed');
    const selection = readObject(capturedIntent, ['runId', 'findingId', 'review']);
    requireValid(readId(selection.runId) === baseline.value.runId);
    const findingId = readId(selection.findingId);
    const original = baseline.value.scan.findings.find(finding => finding.findingId === findingId);
    requireValid(original?.state === 'proposal-pending-review'
      && !baseline.value.scan.findings.some(finding => finding.state === 'active'));
    const { retrieval, analysis, generation, result, ...nativeFields } = original;
    const expected = validateReviewInput(selection.review, {
      finding: { ...nativeFields, state: 'unprocessed' }, retrieval: retrieval.result,
    });
    requireValid(expected.ok);
    const transport = readObject(capturedRaw, ['status', 'body']);
    const body = readObject(transport.body);
    requireValid(body.ok === true || body.ok === false);
    requireKeys(body, body.ok ? ['ok', 'run'] : ['ok', 'error', 'run', 'persisted', 'cleanupFailed']);
    let run: Extract<ReviewOutcome, { ok: true }>['run'] | null = null;
    if (body.run !== null) {
      const parsed = validateRun(body.run);
      requireValid(parsed.ok && parsed.value.status === 'completed');
      run = parsed.value;
    }
    if (body.ok) {
      requireValid(transport.status === 200 && run);
      const selected = run.scan.findings.find(finding => finding.findingId === findingId);
      const state = ({ approve: 'accepted', 'edit-and-accept': 'edited-and-accepted', reject: 'rejected' } as const)[expected.value.action];
      requireValid(selected && selected.state === state && 'review' in selected);
      const { decidedAt, ...decision } = selected.review;
      requireValid(equal(decision, expected.value));
      const { review, ...preserved } = selected;
      const restored = { ...preserved, state: 'proposal-pending-review' };
      requireValid(equal(baseline.value, { ...run, scan: { ...run.scan,
        findings: run.scan.findings.map(finding => finding.findingId === findingId ? restored : finding) } }));
      return { ok: true, run };
    }
    const error = readChoice(body.error, Object.keys(statuses) as Array<keyof typeof statuses>);
    requireValid(transport.status === statuses[error] && body.persisted === false
      && typeof body.cleanupFailed === 'boolean' && (!body.cleanupFailed || error === 'review-persistence')
      && (run === null || equal(run, baseline.value)));
    return { ok: false, error, run, persisted: false, cleanupFailed: body.cleanupFailed };
  } catch { return null; }
}
