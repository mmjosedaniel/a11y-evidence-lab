import type { IncomingMessage } from 'node:http';
import { readId, readObject } from '../domain/run-contract/contract-value-reader.ts';
import type { GenerationServiceOutcome } from './contracts.ts';

export function receiveGeneration(request: IncomingMessage,
  generate: (input: unknown) => Promise<GenerationServiceOutcome>,
  send: (status: number, body: unknown) => void): void {
  let settled = false;
  const reject = () => {
    if (settled) return;
    settled = true;
    send(400, { ok: false, error: 'invalid-request', run: null, persisted: false,
      cleanupFailed: false, invocationPersisted: false });
  };
  request.once('aborted', reject);
  request.once('error', reject);
  const contentType = request.headers['content-type'];
  const declared = request.headers['content-length'];
  if (/[?#]/.test(request.url ?? '') || typeof contentType !== 'string'
      || contentType.trim().toLowerCase() !== 'application/json'
      || (declared !== undefined && (!/^[0-9]+$/.test(declared)
        || !Number.isSafeInteger(Number(declared)) || Number(declared) > 1024))) {
    reject();
    request.resume();
    return;
  }
  const chunks: Buffer[] = [];
  let bytes = 0;
  request.on('data', chunk => {
    if (settled) return;
    const buffer = Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > 1024) { chunks.length = 0; reject(); return; }
    chunks.push(buffer);
  });
  request.once('end', () => {
    if (settled) return;
    let input: { runId: string; findingId: string };
    try {
      const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
      const record = readObject(body, ['runId', 'findingId']);
      input = { runId: readId(record.runId), findingId: readId(record.findingId) };
    } catch { reject(); return; }
    // Dispatch owns the operation even if this request's connection subsequently closes.
    settled = true;
    void Promise.resolve().then(() => generate(input)).then(result => {
      const status = result.ok ? 200 : result.error === 'invalid-request' ? 400
        : result.error === 'not-found' ? 404
        : ['busy', 'workflow-active', 'not-eligible'].includes(result.error) ? 409
        : ['stopping', 'shutdown', 'missing-prerequisite'].includes(result.error) ? 503 : 500;
      send(status, result);
    }, () => send(500, { ok: false, error: 'response-validation', run: null,
      persisted: false, cleanupFailed: true, invocationPersisted: false }));
  });
}
