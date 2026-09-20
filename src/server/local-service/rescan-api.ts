import type { IncomingMessage } from 'node:http';
import { performance } from 'node:perf_hooks';
import { validateRun } from '../domain/run-contract.ts';
import { readChoice, readObject, requireKeys, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { readRescanIntent } from './rescan-operation.ts';
import type { ComparisonFailure, RescanOutcome } from './contracts.ts';

const statuses = {
  'invalid-request': 400, 'not-found': 404,
  busy: 409, 'not-eligible': 409, stopping: 503, shutdown: 503,
  'invalid-run': 500, 'stored-run-unavailable': 500, 'read-failed': 500,
  'create-failed': 500, 'scan-failed': 500, 'result-validation': 500, 'initial-persistence': 500,
  'comparison-lineage': 409,
} as const;

const comparisonStatuses = { 'comparison-calculation': 500, 'comparison-lineage': 409,
  'comparison-persistence': 500, 'comparison-aborted': 409, 'comparison-shutdown': 503 } as const;

function frameOutcome(raw: unknown): { status: number; body: RescanOutcome } {
  const record = readObject(raw);
  requireValid(record.ok === true || record.ok === false);
  const checked = record.run === null ? null : validateRun(record.run);
  requireValid(checked === null || checked.ok);
  const run = checked?.ok ? checked.value : null;
  if (record.ok) {
    requireKeys(record, ['ok', 'run']);
    requireValid(run?.status === 'completed' && run.comparison);
    return { status: 200, body: { ok: true, run } };
  }
  if (run?.status === 'completed') {
    requireKeys(record, ['ok', 'error', 'run', 'persisted', 'comparisonPersisted', 'cleanupFailed']);
    const error = readChoice(record.error, Object.keys(comparisonStatuses) as Array<ComparisonFailure['error']>);
    requireValid(!run.comparison && record.persisted === true && record.comparisonPersisted === false
      && typeof record.cleanupFailed === 'boolean'
      && (!record.cleanupFailed || error === 'comparison-persistence' || error === 'comparison-shutdown'));
    return { status: comparisonStatuses[error], body: { ok: false, error, run,
      persisted: true, comparisonPersisted: false, cleanupFailed: record.cleanupFailed } };
  }
  requireKeys(record, ['ok', 'error', 'run', 'persisted', 'cleanupFailed']);
  const error = readChoice(record.error, Object.keys(statuses) as Array<keyof typeof statuses>);
  requireValid(typeof record.persisted === 'boolean' && typeof record.cleanupFailed === 'boolean');
  if (run !== null) {
    requireValid(run.status === 'failed' && (error === 'scan-failed' || error === 'result-validation'
      || error === 'initial-persistence' || error === 'shutdown'));
    return { status: statuses[error], body: { ok: false, error, run,
      persisted: record.persisted, cleanupFailed: record.cleanupFailed } };
  }
  requireValid(!['scan-failed', 'result-validation', 'initial-persistence'].includes(error)
    && !record.persisted && (!record.cleanupFailed || error === 'create-failed'));
  return { status: statuses[error], body: { ok: false, error, run: null,
    persisted: record.persisted, cleanupFailed: record.cleanupFailed } };
}

export function receiveRescan(request: IncomingMessage,
  execute: (input: unknown) => Promise<RescanOutcome>,
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
  if (request.url !== '/api/rescans' || typeof contentType !== 'string'
      || contentType.trim().toLowerCase() !== 'application/json'
      || (declared !== undefined && (typeof declared !== 'string' || !/^[0-9]+$/.test(declared)
        || !Number.isSafeInteger(Number(declared)) || Number(declared) > 4096))) {
    reject();
    request.resume();
    return;
  }
  request.on('data', chunk => {
    if (settled) return;
    const buffer = Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > 4096 || performance.now() >= expiresAt) { reject(); return; }
    chunks.push(buffer);
  });
  request.on('end', () => {
    if (settled) return;
    let input: ReturnType<typeof readRescanIntent>;
    try {
      requireValid(declared === undefined || Number(declared) === bytes);
      const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
      input = readRescanIntent(body);
      requireValid(performance.now() < expiresAt);
    } catch { reject(); return; }
    // Reserve dispatch before the collaborator; later disconnects cannot establish non-commit.
    settled = true;
    clearTimeout(deadline);
    chunks.length = 0;
    const unknown = () => send(500, { ok: false, error: 'rescan-outcome-unknown' });
    void Promise.resolve().then(() => execute(input)).then(raw => {
      let framed: ReturnType<typeof frameOutcome>;
      try { framed = frameOutcome(raw); }
      catch { unknown(); return; }
      send(framed.status, framed.body);
    }, unknown);
  });
}
