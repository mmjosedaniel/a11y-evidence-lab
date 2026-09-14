import { validateReviewInput } from '../domain/review-contract.ts';
import { readId, readObject, readTime, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { CompletedRun, RunRepository } from '../persistence/run-repository.ts';
import type { ReviewOutcome } from './contracts.ts';

type Dependencies = {
  readonly repository: RunRepository;
  readonly isStopping: () => boolean;
  readonly closeAdmission: () => void;
};
type ReviewReservation = {
  readonly promise: Promise<ReviewOutcome>;
  settle(outcome: ReviewOutcome): void;
};

export function createReviewOperation(dependencies: Dependencies) {
  function execute(input: unknown): ReviewOutcome {
    let durable: CompletedRun | null = null;
    const rejected = (error: Extract<ReviewOutcome, { ok: false }>['error'],
      run = durable, cleanupFailed = false): ReviewOutcome =>
      ({ ok: false, error, run, persisted: false, cleanupFailed });

    let selection: { runId: string; findingId: string; review: unknown };
    try {
      const record = readObject(input, ['runId', 'findingId', 'review']);
      selection = { runId: readId(record.runId), findingId: readId(record.findingId), review: record.review };
    } catch {
      return rejected(dependencies.isStopping() ? 'shutdown' : 'invalid-request');
    }
    if (dependencies.isStopping()) return rejected('shutdown');

    const read = dependencies.repository.read(selection.runId);
    if (!read.ok) {
      const error = read.error === 'not-found' || read.error === 'invalid-run' ? read.error
        : read.error === 'unsafe-path' || read.error === 'identity-mismatch' ? 'stored-run-unavailable'
          : 'read-failed';
      return rejected(error);
    }
    if (read.value.status !== 'completed') return rejected('not-eligible');
    durable = read.value;
    if (dependencies.isStopping()) return rejected('shutdown');
    const index = durable.scan.findings.findIndex(finding => finding.findingId === selection.findingId);
    if (index < 0) return rejected('not-found');
    const selected = durable.scan.findings[index]!;
    if (selected.state !== 'proposal-pending-review') return rejected('not-eligible');
    if (durable.scan.findings.some(finding => finding.state === 'active')) return rejected('workflow-active');

    const { retrieval, analysis, generation, result, ...nativeFields } = selected;
    const native = { ...nativeFields, state: 'unprocessed' as const };
    const body = validateReviewInput(selection.review, { finding: native, retrieval: selected.retrieval.result });
    if (dependencies.isStopping()) return rejected('shutdown');
    if (!body.ok) return rejected('review-validation');
    let decidedAt: string;
    try {
      const now = Date.now();
      requireValid(typeof now === 'number' && Number.isFinite(now));
      decidedAt = readTime(new Date(Math.max(now, Date.parse(selected.generation.finishedAt))).toISOString());
    } catch {
      return rejected(dependencies.isStopping() ? 'shutdown' : 'review-validation');
    }
    if (dependencies.isStopping()) return rejected('shutdown');
    const state = ({ approve: 'accepted', 'edit-and-accept': 'edited-and-accepted', reject: 'rejected' } as const)[body.value.action];
    const reviewed = { ...selected, state, review: { ...body.value, decidedAt } };
    const candidate = { ...durable, scan: { ...durable.scan,
      findings: durable.scan.findings.map((finding, position) => position === index ? reviewed : finding) } };
    // The existing synchronous writer owns commit truth, including shutdown during rename.
    const saved = dependencies.repository.updateReview(durable, candidate);
    if (!saved.ok) {
      if (saved.cleanupFailed) dependencies.closeAdmission();
      return rejected('review-persistence', saved.error === 'invalid-transition' ? null : durable, saved.cleanupFailed);
    }
    return { ok: true, run: saved.value };
  }

  function start(input: unknown, reservation: ReviewReservation): Promise<ReviewOutcome> {
    reservation.settle(execute(input));
    return reservation.promise;
  }
  return Object.freeze({ start });
}
