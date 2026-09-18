import assert from 'node:assert/strict';
import http, { type IncomingMessage } from 'node:http';
import net from 'node:net';
import { performance } from 'node:perf_hooks';
import { PassThrough } from 'node:stream';
import test, { mock } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { CompletedRun, FailedRun, RunningRun, StoreResult } from '../src/server/persistence/run-repository.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService } from '../src/server/service.ts';
import type { RescanExecutor, RescanOutcome } from '../src/server/local-service/contracts.ts';
import { completedRun, failedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { expectedRetrievalResult } from './helpers/m202-retrieval-service-fixture.ts';
import { generationAdapterHarness } from './helpers/m302-generation-fixture.ts';
import { withReviewSandbox } from './helpers/m401-review-sandbox.ts';

mock.module(new URL('../src/server/generation/ollama-generation.ts', import.meta.url).href, {
  namedExports: { createOllamaGenerationAdapter: () => { throw new Error('Rescan invoked Local provider'); } },
});
mock.module(new URL('../src/server/generation/groq-generation.ts', import.meta.url).href, {
  namedExports: { createGroqGenerationAdapter: () => { throw new Error('Rescan invoked Groq provider'); } },
});

const { receiveRescan } = await import('../src/server/local-service/rescan-api.ts');
const { createLoopbackApiServer } = await import('../src/server/local-service/loopback-api.ts');

type RescanFailure = Extract<RescanOutcome, { ok: false }>;
type RescanService = LocalService & {
  rescanFinding(input: unknown, execute?: RescanExecutor): Promise<RescanOutcome>;
};
type Reply = { status: number; headers: http.IncomingHttpHeaders; body: unknown };
type ApiCallbacks = Parameters<typeof createLoopbackApiServer>[0] & {
  rescanFinding?: (input: unknown) => Promise<RescanOutcome>;
};
const serial = { concurrency: false };

function intent() {
  return { runId: 'run-rescan', baselineRunId: 'run-baseline', findingId: 'finding-0', mode: 'groq' };
}
function linkedCompleted(): CompletedRun {
  return { ...completedRun('run-rescan', 'groq'), baselineRunId: 'run-baseline' } as CompletedRun;
}
function linkedFailed(): FailedRun {
  return { ...failedRun('run-rescan', 'groq'), baselineRunId: 'run-baseline' } as FailedRun;
}
function terminalFrom(run: RunningRun): CompletedRun {
  const sample = completedRun(run.runId, run.providerContext.mode);
  const finishedAt = new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString();
  const candidate = {
    formatVersion: run.formatVersion,
    runId: run.runId,
    baselineRunId: (run as RunningRun & { baselineRunId: string }).baselineRunId,
    createdAt: run.createdAt,
    applicationRevision: run.applicationRevision,
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    status: 'completed',
    finishedAt,
    scan: { ...sample.scan, context: { ...run.scanContext, finalUrl: sample.scan.context.finalUrl,
      scannedAt: { value: finishedAt }, browserVersion: sample.scan.context.browserVersion,
      readinessReached: true, cleanup: 'closed' } },
  };
  const checked = validateRun(candidate);
  if (!checked.ok || checked.value.status !== 'completed') assert.fail('API linked terminal fixture must be valid');
  return checked.value as CompletedRun;
}
function stored<T>(result: StoreResult<T>): T { assert.ok(result.ok, JSON.stringify(result)); return result.value; }
function failure(error: RescanFailure['error'], run: FailedRun | null = null, persisted = false,
  cleanupFailed = false): RescanFailure {
  return { ok: false, error, run, persisted, cleanupFailed };
}
function invalidRequest() { return failure('invalid-request'); }
function fakeRequest(headers: http.IncomingHttpHeaders = { 'content-type': 'application/json' }, url = '/api/rescans'):
  IncomingMessage & PassThrough {
  const request = new PassThrough() as IncomingMessage & PassThrough;
  Object.defineProperties(request, {
    headers: { value: headers, writable: true },
    url: { value: url, writable: true },
    complete: { value: false, writable: true },
  });
  return request;
}
function direct(body: string | Buffer | undefined, execute: (input: unknown) => Promise<RescanOutcome>,
  options: { headers?: http.IncomingHttpHeaders; url?: string } = {}) {
  const request = fakeRequest(options.headers, options.url);
  const replies: Array<{ status: number; body: unknown }> = [];
  const response = new Promise<{ status: number; body: unknown }>(resolve => {
    receiveRescan(request, execute, (status: number, value: unknown) => {
      replies.push({ status, body: value });
      resolve({ status, body: value });
    });
  });
  if (body !== undefined) {
    Object.defineProperty(request, 'complete', { value: true, writable: true });
    request.end(body);
  }
  return { request, response, replies };
}
async function listen(callbacks: ApiCallbacks) {
  const server = createLoopbackApiServer(callbacks);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return { server, url: `http://127.0.0.1:${address.port}` };
}
async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Rescan port did not close')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Rescan port remained open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}
async function withApi(callbacks: ApiCallbacks, body: (api: Awaited<ReturnType<typeof listen>>) => Promise<void>) {
  const api = await listen(callbacks);
  const errors: unknown[] = [];
  try { await body(api); } catch (error) { errors.push(error); }
  try { await new Promise<void>((resolve, reject) => api.server.close(error => error ? reject(error) : resolve())); }
  catch (error) { errors.push(error); }
  try { await portClosed(api.url); } catch (error) { errors.push(error); }
  if (errors.length) throw new AggregateError(errors, 'Rescan API or owned listener cleanup failed');
}
async function request(base: string, target = '/api/rescans', method = 'POST'): Promise<Reply> {
  const body = JSON.stringify(intent());
  const address = new URL(base);
  return new Promise<Reply>((resolve, reject) => {
    const outgoing = http.request({ hostname: address.hostname, port: address.port, path: target, method, agent: false,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, incoming => {
      const chunks: Buffer[] = [];
      incoming.setTimeout(3000, () => incoming.destroy(new Error('Rescan response timed out')));
      incoming.on('data', chunk => chunks.push(Buffer.from(chunk)));
      incoming.once('error', reject);
      incoming.once('end', () => {
        try { resolve({ status: incoming.statusCode!, headers: incoming.headers,
          body: JSON.parse(Buffer.concat(chunks).toString('utf8')) }); }
        catch (error) { reject(error); }
      });
    });
    outgoing.once('error', reject);
    outgoing.setTimeout(3000, () => outgoing.destroy(new Error('Rescan request timed out')));
    outgoing.end(body);
  });
}

test('rescan route is absent without built-client callback and exact when configured', serial, async () => {
  const base = { isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false as const, error: 'not-found' as const }) };
  await withApi(base, async api => {
    const reply = await request(api.url);
    assert.equal(reply.status, 405);
    assert.deepEqual(reply.body, { ok: false, error: 'method-not-allowed' });
  });

  let calls = 0;
  await withApi({ ...base, rescanFinding: async input => {
    calls++;
    assert.deepEqual(input, intent());
    return failure('not-found');
  } }, async api => {
    const reply = await request(api.url);
    assert.equal(reply.status, 404);
    assert.deepEqual(reply.body, failure('not-found'));
    assert.equal(reply.headers['cache-control'], 'no-store');
    assert.equal(reply.headers['x-content-type-options'], 'nosniff');
    assert.equal(reply.headers['content-type'], 'application/json;charset=utf-8');
    assert.equal((await request(api.url, '/api/rescans?', 'POST')).status, 400);
    assert.equal((await request(api.url, '/api/not-rescans', 'POST')).status, 405);
    assert.equal(calls, 1);
  });
});

test('accepts only closed rescan intent and exact 4096-byte fatal UTF-8 framing', serial, async () => {
  let calls = 0;
  const execute = async (input: unknown): Promise<RescanOutcome> => {
    calls++;
    assert.deepEqual(input, intent());
    return failure('not-found');
  };
  assert.equal((await direct(JSON.stringify(intent()), execute).response).status, 404);
  const compact = JSON.stringify(intent());
  const exact = compact + ' '.repeat(4096 - Buffer.byteLength(compact));
  assert.equal(Buffer.byteLength(exact), 4096);
  assert.equal((await direct(exact, execute).response).status, 404);

  for (const [body, headers, url] of [
    [exact + ' ', { 'content-type': 'application/json' }, '/api/rescans'],
    [Buffer.from([0xc3, 0x28]), { 'content-type': 'application/json' }, '/api/rescans'],
    ['{', { 'content-type': 'application/json' }, '/api/rescans'],
    [JSON.stringify({ ...intent(), extra: true }), { 'content-type': 'application/json' }, '/api/rescans'],
    [JSON.stringify({ ...intent(), mode: 'LOCAL' }), { 'content-type': 'application/json' }, '/api/rescans'],
    [compact, {}, '/api/rescans'],
    [compact, { 'content-type': 'application/json;charset=utf-8' }, '/api/rescans'],
    [compact, { 'content-type': 'application/json', 'content-length': '+1' }, '/api/rescans'],
    [compact, { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(compact) + 1) }, '/api/rescans'],
    [compact, { 'content-type': 'application/json' }, '/api/rescans#fragment'],
  ] as const) {
    assert.deepEqual(await direct(body, execute, { headers, url }).response,
      { status: 400, body: invalidRequest() });
  }
  assert.equal(calls, 2);
});

test('receipt deadline, abort and incomplete close refuse once before dispatch', serial, async t => {
  let calls = 0;
  const execute = async (): Promise<RescanOutcome> => { calls++; return failure('not-found'); };
  for (const event of ['aborted', 'error', 'close'] as const) {
    const pending = direct(undefined, execute);
    if (event === 'error') pending.request.emit(event, new Error('CONTROLLED_REQUEST_ERROR'));
    else pending.request.emit(event);
    assert.deepEqual(await pending.response, { status: 400, body: invalidRequest() });
    pending.request.emit('aborted');
    assert.equal(pending.replies.length, 1);
  }

  t.mock.timers.enable({ apis: ['setTimeout'] });
  const expired = direct(undefined, execute);
  t.mock.timers.tick(30000);
  assert.deepEqual(await expired.response, { status: 400, body: invalidRequest() });
  assert.equal(calls, 0);
});

test('checks monotonic expiry and owns one dispatch despite later disconnect', serial, async t => {
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  let calls = 0;
  const execute = async (): Promise<RescanOutcome> => { calls++; return { ok: true, run: linkedCompleted() }; };
  const delayed = direct(undefined, execute);
  now = 30001;
  Object.defineProperty(delayed.request, 'complete', { value: true, writable: true });
  delayed.request.end(JSON.stringify(intent()));
  assert.deepEqual(await delayed.response, { status: 400, body: invalidRequest() });
  t.mock.restoreAll();

  let finish!: (value: RescanOutcome) => void;
  const completion = new Promise<RescanOutcome>(resolve => { finish = resolve; });
  const dispatched = direct(JSON.stringify(intent()), async () => { calls++; return completion; });
  await new Promise<void>(resolve => setImmediate(resolve));
  dispatched.request.emit('aborted');
  dispatched.request.emit('close');
  finish({ ok: true, run: linkedCompleted() });
  assert.deepEqual(await dispatched.response, { status: 200, body: { ok: true, run: linkedCompleted() } });
  assert.equal(dispatched.replies.length, 1);
  assert.equal(calls, 1);
});

test('maps every closed service outcome and bounds rejected or malformed results as unknown', serial, async () => {
  const success = { ok: true as const, run: linkedCompleted() };
  assert.deepEqual(await direct(JSON.stringify(intent()), async () => success).response,
    { status: 200, body: success });
  const mappings = [
    [400, ['invalid-request']],
    [404, ['not-found']],
    [409, ['busy', 'not-eligible']],
    [503, ['stopping', 'shutdown']],
    [500, ['invalid-run', 'stored-run-unavailable', 'read-failed', 'create-failed', 'scan-failed',
      'result-validation', 'initial-persistence']],
  ] as const;
  for (const [status, errors] of mappings) {
    for (const error of errors) {
      const postcreation = ['scan-failed', 'result-validation', 'initial-persistence'].includes(error);
      const outcome = failure(error, postcreation ? linkedFailed() : null, postcreation, false);
      assert.deepEqual(await direct(JSON.stringify(intent()), async () => outcome).response,
        { status, body: outcome });
    }
  }
  const creationCleanup = failure('create-failed', null, false, true);
  assert.deepEqual(await direct(JSON.stringify(intent()), async () => creationCleanup).response,
    { status: 500, body: creationCleanup });
  for (const shutdown of [failure('shutdown'), failure('shutdown', linkedFailed(), true, false)]) {
    assert.deepEqual(await direct(JSON.stringify(intent()), async () => shutdown).response,
      { status: 503, body: shutdown });
  }
  const unknown = { ok: false, error: 'rescan-outcome-unknown' };
  for (const execute of [
    async () => { throw new Error('SYNTHETIC_CALLBACK_SECRET'); },
    async () => null as never,
    async () => ({ ok: true }) as never,
    async () => failure('not-found', linkedFailed(), false, false),
    async () => failure('busy', null, true, false),
    async () => failure('scan-failed', null, false, true),
  ]) {
    const reply = await direct(JSON.stringify(intent()), execute).response;
    assert.deepEqual(reply, { status: 500, body: unknown });
    assert.equal(JSON.stringify(reply).includes('SYNTHETIC_CALLBACK_SECRET'), false);
  }
});

test('a dropped durable-success reply cannot restore the retired server capability', serial, async () => {
  await withReviewSandbox('service', async box => {
    const repository = stored(openRunRepository(box.runs));
    stored(repository.create(runningRun('run-baseline')));
    stored(repository.finish(completedRun('run-baseline')));
    const started = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
    assert.ok(started.ok);
    box.services.push(started.service);
    const service = started.service as RescanService;
    assert.equal((await service.retrieveFinding({ runId: 'run-baseline', findingId: 'finding-0' },
      async () => expectedRetrievalResult())).ok, true);

    let entered!: () => void;
    const dispatched = new Promise<void>(resolve => { entered = resolve; });
    let release!: () => void;
    const continueScan = new Promise<void>(resolve => { release = resolve; });
    let committed!: Promise<RescanOutcome>;
    const callbacks: ApiCallbacks = {
      isStopping: () => false,
      isBusy: () => false,
      readRun: id => service.readRun(id),
      rescanFinding: input => {
        committed = service.rescanFinding(input, async (run: RunningRun) => {
          entered();
          await continueScan;
          return { run: terminalFrom(run), candidates: [] };
        });
        return committed;
      },
    };
    await withApi(callbacks, async api => {
      const body = JSON.stringify(intent());
      const address = new URL(api.url);
      const outgoing = http.request({ hostname: address.hostname, port: address.port, path: '/api/rescans',
        method: 'POST', agent: false,
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } });
      outgoing.on('response', incoming => incoming.resume());
      outgoing.on('error', () => undefined);
      outgoing.end(body);
      await dispatched;
      outgoing.destroy();
      release();
      assert.equal((await committed).ok, true);
    });

    const oldGeneration = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
      generationAdapterHarness().adapter);
    assert.equal(oldGeneration.ok, false);
    if (!oldGeneration.ok) assert.equal(oldGeneration.error, 'workflow-active');
    assert.equal((await service.retrieveFinding({ runId: 'run-rescan', findingId: 'finding-0' },
      async () => expectedRetrievalResult())).ok, true);
    assert.equal(fs.existsSync(path.join(box.runs, 'run-rescan', 'run.json')), true);
  });
});
