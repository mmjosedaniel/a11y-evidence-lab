import type { IncomingMessage } from 'node:http';
import { performance } from 'node:perf_hooks';
import { validateRun } from '../domain/run-contract.ts';
import type { FailedRun } from '../persistence/run-repository.ts';
import { readChoice, readObject, requireKeys, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { readRescanIntent } from './rescan-operation.ts';
import type { RescanOutcome } from './contracts.ts';

const statuses = {
  'invalid-request': 400, 'not-found': 404,
  busy: 409, 'not-eligible': 409, stopping: 503, shutdown: 503,
  'invalid-run': 500, 'stored-run-unavailable': 500, 'read-failed': 500,
  'create-failed': 500, 'scan-failed': 500, 'result-validation': 500, 'initial-persistence': 500,
} as const;

function frameOutcome(raw: unknown): { status: number; body: RescanOutcome } {
  const record = readObject(raw);
  requireValid(record.ok === true || record.ok === false);
  requireKeys(record, record.ok ? ['ok', 'run'] : ['ok', 'error', 'run', 'persisted', 'cleanupFailed']);
  const checked = record.run === null ? null : validateRun(record.run);
  requireValid(checked === null || checked.ok);
  const run = checked?.ok ? checked.value : null;
  if (record.ok) {
    requireValid(run?.status === 'completed');
    return { status: 200, body: { ok: true, run } };
  }
  const error = readChoice(record.error, Object.keys(statuses) as Array<keyof typeof statuses>);
  requireValid(typeof record.persisted === 'boolean' && typeof record.cleanupFailed === 'boolean');
  let failedRun: FailedRun | null = null;
  if (run !== null) {
    requireValid(run.status === 'failed');
    failedRun = run;
  }
  const postcreation = ['scan-failed', 'result-validation', 'initial-persistence'].includes(error);
  if (postcreation) requireValid(run !== null);
  else if (error !== 'shutdown') requireValid(run === null);
  if (run === null) requireValid(!record.persisted && (!record.cleanupFailed || error === 'create-failed'));
  return { status: statuses[error], body: { ok: false, error, run: failedRun,
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
