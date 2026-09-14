import type { IncomingMessage } from 'node:http';
import { performance } from 'node:perf_hooks';
import { validateRun } from '../domain/run-contract.ts';
import { readChoice, readId, readObject, requireKeys, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { ReviewOutcome } from './contracts.ts';

const statuses = {
  'invalid-request': 400, 'review-validation': 400, 'not-found': 404,
  busy: 409, 'workflow-active': 409, 'not-eligible': 409, stopping: 503, shutdown: 503,
  'invalid-run': 500, 'stored-run-unavailable': 500, 'read-failed': 500, 'review-persistence': 500,
} as const;

function frameOutcome(raw: unknown): { status: number; body: ReviewOutcome } {
  const record = readObject(raw);
  requireValid(record.ok === true || record.ok === false);
  requireKeys(record, record.ok ? ['ok', 'run'] : ['ok', 'error', 'run', 'persisted', 'cleanupFailed']);
  let run: Extract<ReviewOutcome, { ok: true }>['run'] | null = null;
  if (record.run !== null) {
    const parsed = validateRun(record.run);
    requireValid(parsed.ok && parsed.value.status === 'completed');
    run = parsed.value;
  }
  if (record.ok) {
    requireValid(run);
    return { status: 200, body: { ok: true, run } };
  }
  const error = readChoice(record.error, Object.keys(statuses) as Array<keyof typeof statuses>);
  requireValid(record.persisted === false && typeof record.cleanupFailed === 'boolean'
    && (!record.cleanupFailed || error === 'review-persistence'));
  return { status: statuses[error], body: { ok: false, error, run, persisted: false,
    cleanupFailed: record.cleanupFailed } };
}

export function receiveReview(request: IncomingMessage,
  execute: (input: unknown) => Promise<ReviewOutcome>,
  send: (status: number, body: unknown) => void): void {
  const expiresAt = performance.now() + 30000;
  const chunks: Buffer[] = [];
  let bytes = 0;
  let settled = false;
  const reject = () => {
    if (settled) return;
    settled = true;
    clearTimeout(deadline);
    chunks.length = 0;
    send(400, { ok: false, error: 'invalid-request', run: null, persisted: false, cleanupFailed: false });
  };
  const deadline = setTimeout(reject, 30000);
  request.on('aborted', reject);
  request.on('error', reject);
  request.on('close', () => { if (!request.complete) reject(); });
  const contentType = request.headers['content-type'];
  const declared = request.headers['content-length'];
  if (request.url !== '/api/finding-review' || typeof contentType !== 'string'
      || contentType.trim().toLowerCase() !== 'application/json'
      || (declared !== undefined && (typeof declared !== 'string' || !/^[0-9]+$/.test(declared)
        || !Number.isSafeInteger(Number(declared)) || Number(declared) > 131072))) {
    reject();
    request.resume();
    return;
  }
  request.on('data', chunk => {
    if (settled) return;
    const buffer = Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > 131072 || performance.now() >= expiresAt) { reject(); return; }
    chunks.push(buffer);
  });
  request.on('end', () => {
    if (settled) return;
    let input: { runId: string; findingId: string; review: unknown };
    try {
      requireValid(declared === undefined || Number(declared) === bytes);
      const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
      const record = readObject(body, ['runId', 'findingId', 'review']);
      input = { runId: readId(record.runId), findingId: readId(record.findingId), review: record.review };
      requireValid(performance.now() < expiresAt);
    } catch { reject(); return; }
    // Reserve dispatch before the collaborator; later disconnects cannot establish non-commit.
    settled = true;
    clearTimeout(deadline);
    chunks.length = 0;
    const unknown = () => send(500, { ok: false, error: 'review-outcome-unknown' });
    void Promise.resolve().then(() => execute(input)).then(raw => {
      let framed: ReturnType<typeof frameOutcome>;
      try { framed = frameOutcome(raw); }
      catch { unknown(); return; }
      send(framed.status, framed.body);
    }, unknown);
  });
}
