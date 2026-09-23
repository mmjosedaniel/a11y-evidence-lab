import assert from 'node:assert/strict';
import fs from 'node:fs';
import http, { type IncomingMessage } from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { PassThrough } from 'node:stream';
import test, { mock } from 'node:test';
import type { ReviewOutcome } from '../src/server/service.ts';
import { validateReviewInput } from '../src/server/domain/review-contract.ts';
import { selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import { reviewInput } from './helpers/m401-review-fixture.ts';
import { withReviewSandbox } from './helpers/m401-review-sandbox.ts';
import {
  fullyEscapeJson,
  maximumReviewContext,
  maximumReviewIntent,
  pendingReviewRun,
  reviewBodyLimit,
  reviewFailure,
  reviewIntent,
  successfulReviewRun,
} from './helpers/m402-review-fixture.ts';

const serial = { concurrency: false };
const clientRoot = path.resolve('dist/client');

// These factories are never part of review transport. Any accidental provider path is a test failure.
mock.module(new URL('../src/server/generation/ollama-generation.ts', import.meta.url).href, {
  namedExports: {
    createOllamaGenerationAdapter: () => { throw new Error('Review invoked Local provider'); },
    createReasoningOllamaGenerationAdapter: () => { throw new Error('Review invoked Local provider'); },
    createJudgmentOllamaGenerationAdapter: () => { throw new Error('Review invoked Local provider'); },
    createUncertaintyOllamaGenerationAdapter: () => { throw new Error('Review invoked Local provider'); },
    createNativeSchemaOllamaGenerationAdapter: () => { throw new Error('Review invoked Local provider'); },
  },
});
mock.module(new URL('../src/server/generation/groq-generation.ts', import.meta.url).href, {
  namedExports: {
    createGroqGenerationAdapter: () => { throw new Error('Review invoked Groq provider'); },
    createJudgmentGroqGenerationAdapter: () => { throw new Error('Review invoked Groq provider'); },
    createUncertaintyGroqGenerationAdapter: () => { throw new Error('Review invoked Groq provider'); },
  },
});

// The full suite intentionally reaches initial Red at this agreed missing production owner.
const { receiveReview } = await import('../src/server/local-service/review-api.ts');
const [{ createLoopbackApiServer }, { startLocalService }] = await Promise.all([
  import('../src/server/local-service/loopback-api.ts'),
  import('../src/server/service.ts'),
]);

type Reply = { status: number; headers: http.IncomingHttpHeaders; body: unknown; text: string };
type ApiCallbacks = Parameters<typeof createLoopbackApiServer>[0];

function fakeRequest(
  headers: http.IncomingHttpHeaders = { 'content-type': 'application/json' },
  url = '/api/finding-review',
): IncomingMessage & PassThrough {
  const request = new PassThrough() as IncomingMessage & PassThrough;
  Object.defineProperties(request, {
    headers: { value: headers, writable: true },
    url: { value: url, writable: true },
    complete: { value: false, writable: true },
  });
  return request;
}

function direct(
  body: string | Buffer | undefined,
  execute: (input: unknown) => Promise<ReviewOutcome>,
  options: { headers?: http.IncomingHttpHeaders; url?: string; finish?: boolean } = {},
) {
  const request = fakeRequest(options.headers, options.url);
  const replies: Array<{ status: number; body: unknown }> = [];
  const response = new Promise<{ status: number; body: unknown }>(resolve => {
    receiveReview(request, execute, (status, value) => {
      replies.push({ status, body: value });
      resolve({ status, body: value });
    });
  });
  if (body !== undefined) {
    if (options.finish !== false) Object.defineProperty(request, 'complete', { value: true, writable: true });
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
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Review port did not close')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Review port remained open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve();
      else reject(error);
    });
  });
}

async function close(server: http.Server, url: string): Promise<void> {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await portClosed(url);
}

async function withApi(callbacks: ApiCallbacks, body: (api: Awaited<ReturnType<typeof listen>>) => Promise<void>) {
  const api = await listen(callbacks);
  const errors: unknown[] = [];
  try { await body(api); }
  catch (error) { errors.push(error); }
  try { await close(api.server, api.url); }
  catch (error) { errors.push(error); }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Review API test and listener cleanup failed');
}

async function request(
  base: string,
  target = '/api/finding-review',
  body: string | Buffer = JSON.stringify(reviewIntent()),
  contentType: string | null = 'application/json',
  method = 'POST',
): Promise<Reply> {
  const address = new URL(base);
  return new Promise<Reply>((resolve, reject) => {
    const outgoing = http.request({
      hostname: address.hostname,
      port: address.port,
      path: target,
      method,
      agent: false,
      headers: {
        ...(contentType === null ? {} : { 'Content-Type': contentType }),
        'Content-Length': Buffer.byteLength(body),
      },
    }, incoming => {
      const chunks: Buffer[] = [];
      incoming.setTimeout(3000, () => incoming.destroy(new Error('Review response timed out')));
      incoming.on('data', chunk => chunks.push(Buffer.from(chunk)));
      incoming.once('error', reject);
      incoming.once('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        try { resolve({ status: incoming.statusCode!, headers: incoming.headers, text, body: JSON.parse(text) }); }
        catch (error) { reject(error); }
      });
    });
    outgoing.once('error', reject);
    outgoing.setTimeout(3000, () => outgoing.destroy(new Error('Review request timed out')));
    outgoing.end(body);
  });
}

function invalidRequest() {
  return { ok: false, error: 'invalid-request', run: null, persisted: false, cleanupFailed: false };
}

function assertHeaders(reply: Reply): void {
  assert.equal(reply.headers['cache-control'], 'no-store');
  assert.equal(reply.headers['x-content-type-options'], 'nosniff');
  assert.equal(reply.headers['content-type'], 'application/json;charset=utf-8');
}

test('review route is absent without its callback and health capabilities stay unchanged', serial, async () => {
  await withApi({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }) }, async api => {
    const health = await new Promise<unknown>((resolve, reject) => {
      http.get(`${api.url}/api/health`, incoming => {
        const chunks: Buffer[] = [];
        incoming.setTimeout(3000, () => incoming.destroy(new Error('Review health response timed out')));
        incoming.on('data', chunk => chunks.push(Buffer.from(chunk)));
        incoming.once('error', reject);
        incoming.once('end', () => {
          try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
          catch (error) { reject(error); }
        });
      }).setTimeout(3000, function (this: http.ClientRequest) {
        this.destroy(new Error('Review health request timed out'));
      }).once('error', reject);
    });
    assert.deepEqual(health, { status: 'ready', busy: false,
      capabilities: { readRuns: true, scan: false, guidance: false } });
    const reply = await request(api.url);
    assert.equal(reply.status, 405);
    assert.deepEqual(reply.body, { ok: false, error: 'method-not-allowed' });
  });
});

test('router exposes only the exact POST when a review callback exists and does not advertise a capability', serial, async () => {
  let calls = 0;
  await withApi({
    isStopping: () => false,
    isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    reviewFinding: async input => { calls++; assert.deepEqual(input, reviewIntent()); return reviewFailure('not-found'); },
  }, async api => {
    const accepted = await request(api.url);
    assert.equal(accepted.status, 404);
    assert.deepEqual(accepted.body, reviewFailure('not-found'));
    assertHeaders(accepted);
    const wrongPath = await request(api.url, '/api/not-review');
    assert.equal(wrongPath.status, 405);
    assert.deepEqual(wrongPath.body, { ok: false, error: 'method-not-allowed' });
    const wrongMethod = await request(api.url, '/api/finding-review', Buffer.alloc(0), null, 'GET');
    assert.equal(wrongMethod.status, 404);
    assert.deepEqual(wrongMethod.body, { ok: false, error: 'not-found' });
    const health = await request(api.url, '/api/health', Buffer.alloc(0), null, 'GET');
    assert.equal(health.status, 200);
    assert.deepEqual(health.body, { status: 'ready', busy: false,
      capabilities: { readRuns: true, scan: false, guidance: false } });
    assert.equal(calls, 1);
  });
});

test('accepts only the exact review route and outer object and preserves native duplicate last-wins parsing', serial, async () => {
  const seen: unknown[] = [];
  const execute = async (input: unknown) => { seen.push(input); return reviewFailure('not-found'); };
  const accepted = direct(JSON.stringify(reviewIntent()), execute,
    { headers: { 'content-type': '  Application/JSON  ' } });
  assert.deepEqual(await accepted.response, { status: 404, body: reviewFailure('not-found') });

  const duplicate = direct(
    `{"runId":"discarded","runId":"run-01","findingId":"finding-0","review":${JSON.stringify(reviewInput('reject'))}}`,
    execute,
  );
  assert.equal((await duplicate.response).status, 404);
  assert.deepEqual(seen, [reviewIntent(), reviewIntent('reject')]);

  for (const [url, value] of [
    ['/api/finding-review?', reviewIntent()],
    ['/api/finding-review#fragment', reviewIntent()],
    ['/api/finding-review', { runId: 'run-01', findingId: 'finding-0' }],
    ['/api/finding-review', { ...reviewIntent(), extra: true }],
    ['/api/finding-review', { ...reviewIntent(), runId: '../escape' }],
    ['/api/finding-review', { ...reviewIntent(), findingId: 'f'.repeat(65) }],
  ] as const) {
    const refused = direct(JSON.stringify(value), execute, { url });
    assert.deepEqual(await refused.response, { status: 400, body: invalidRequest() });
  }
  assert.equal(seen.length, 2);
});

test('enforces the actual-byte cap and admits every maximum complete edit in compact and escaped JSON', serial, async () => {
  let calls = 0;
  const execute = async () => { calls++; return reviewFailure('not-found'); };
  for (const profile of ['image-alt', 'label', 'color-contrast'] as const) {
    for (const unit of ['\u0001', 'é'] as const) {
      const intent = maximumReviewIntent(profile, unit);
      assert.equal(intent.review.editedProposal?.findingId, intent.findingId);
      assert.ok(validateReviewInput(intent.review, maximumReviewContext(profile)).ok,
        `${profile} ${JSON.stringify(unit)} must remain a valid maximum review`);
      for (const encoded of [JSON.stringify(intent), fullyEscapeJson(intent)]) {
        assert.ok(Buffer.byteLength(encoded) <= 85110,
          `${profile} ${JSON.stringify(unit)} remains inside the accepted analytical bound`);
        assert.equal((await direct(encoded, execute).response).status, 404);
      }
    }
  }
  const compact = JSON.stringify(reviewIntent('edit-and-accept'));
  const exact = compact + ' '.repeat(reviewBodyLimit - Buffer.byteLength(compact));
  assert.equal(Buffer.byteLength(exact), reviewBodyLimit);
  assert.equal((await direct(exact, execute).response).status, 404);
  const oversized = exact + ' ';
  assert.deepEqual(await direct(oversized, execute).response, { status: 400, body: invalidRequest() });
  assert.equal(calls, 13);
});

test('validates Content-Length, fatal UTF-8, JSON and content type before dispatch', serial, async () => {
  let calls = 0;
  const execute = async () => { calls++; return reviewFailure('not-found'); };
  const body = JSON.stringify(reviewIntent());
  const invalid: Array<[string | Buffer, http.IncomingHttpHeaders, string?]> = [
    ['{', { 'content-type': 'application/json' }],
    [Buffer.from([0xc3, 0x28]), { 'content-type': 'application/json' }],
    [body, {}],
    [body, { 'content-type': 'application/json;charset=utf-8' }],
    [body, { 'content-type': 'application/json', 'content-length': '+1' }],
    [body, { 'content-type': 'application/json', 'content-length': '9007199254740992' }],
    [body, { 'content-type': 'application/json', 'content-length': String(reviewBodyLimit + 1) }],
    [body, { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(body) + 1) }],
  ];
  for (const [value, headers, url] of invalid) {
    const reply = direct(value, execute, { headers, url });
    assert.deepEqual(await reply.response, { status: 400, body: invalidRequest() });
  }
  assert.equal(calls, 0);
  const correct = direct(body, execute, { headers: {
    'content-type': 'application/json', 'content-length': String(Buffer.byteLength(body)),
  } });
  assert.equal((await correct.response).status, 404);
  assert.equal(calls, 1);
});

test('refuses abort, error, incomplete close and deadline exactly once without dispatch', serial, async t => {
  let calls = 0;
  const execute = async () => { calls++; return reviewFailure('not-found'); };
  for (const event of ['aborted', 'error', 'close'] as const) {
    const pending = direct(undefined, execute);
    if (event === 'error') pending.request.emit(event, new Error('CONTROLLED_REQUEST_ERROR'));
    else pending.request.emit(event);
    assert.deepEqual(await pending.response, { status: 400, body: invalidRequest() });
    pending.request.emit('aborted');
    pending.request.emit('close');
    assert.equal(pending.replies.length, 1);
  }

  t.mock.timers.enable({ apis: ['setTimeout'] });
  const expired = direct(undefined, execute);
  t.mock.timers.tick(30000);
  assert.deepEqual(await expired.response, { status: 400, body: invalidRequest() });
  assert.equal(expired.replies.length, 1);
  assert.equal(calls, 0);
});

test('checks monotonic expiry after parsing and clears the deadline on dispatch', serial, async t => {
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  let calls = 0;
  const execute = async () => { calls++; return reviewFailure('not-found'); };
  const delayed = direct(undefined, execute);
  now = 30001;
  Object.defineProperty(delayed.request, 'complete', { value: true, writable: true });
  delayed.request.end(JSON.stringify(reviewIntent()));
  assert.deepEqual(await delayed.response, { status: 400, body: invalidRequest() });

  now = 0;
  const nativeParse = JSON.parse;
  t.mock.method(JSON, 'parse', ((value: string) => {
    const parsed = nativeParse(value);
    now = 30001;
    return parsed;
  }) as typeof JSON.parse);
  const parseExpired = direct(JSON.stringify(reviewIntent()), execute);
  assert.deepEqual(await parseExpired.response, { status: 400, body: invalidRequest() });
  t.mock.restoreAll();

  t.mock.timers.enable({ apis: ['setTimeout'] });
  const dispatched = direct(JSON.stringify(reviewIntent()), execute);
  assert.equal((await dispatched.response).status, 404);
  assert.equal(calls, 1);
  t.mock.timers.tick(30000);
  assert.equal(dispatched.replies.length, 1);
});

test('reserves one dispatch and a later disconnect or repeated event cannot repeat or relabel it', serial, async () => {
  let finish!: (outcome: ReviewOutcome) => void;
  const completion = new Promise<ReviewOutcome>(resolve => { finish = resolve; });
  let calls = 0;
  let entered!: () => void;
  const started = new Promise<void>(resolve => { entered = resolve; });
  const pending = direct(JSON.stringify(reviewIntent()), async () => { calls++; entered(); return completion; });
  await started;
  pending.request.emit('aborted');
  pending.request.emit('error', new Error('LATE_REQUEST_ERROR'));
  pending.request.emit('close');
  pending.request.emit('end');
  finish(reviewFailure('not-found'));
  assert.deepEqual(await pending.response, { status: 404, body: reviewFailure('not-found') });
  assert.equal(calls, 1);
  assert.equal(pending.replies.length, 1);
});

test('maps every usable service result unchanged and reports thrown or unusable results as unknown', serial, async () => {
  const success = { ok: true as const, run: successfulReviewRun('approve') };
  assert.deepEqual(await direct(JSON.stringify(reviewIntent()), async () => success).response,
    { status: 200, body: success });
  const mappings = [
    [400, ['invalid-request', 'review-validation']],
    [404, ['not-found']],
    [409, ['busy', 'workflow-active', 'not-eligible']],
    [503, ['stopping', 'shutdown']],
    [500, ['invalid-run', 'stored-run-unavailable', 'read-failed', 'review-persistence']],
  ] as const;
  for (const [status, errors] of mappings) {
    for (const error of errors) {
      const outcome = reviewFailure(error, error === 'review-validation' ? pendingReviewRun() : null,
        error === 'review-persistence');
      assert.deepEqual(await direct(JSON.stringify(reviewIntent()), async () => outcome).response,
        { status, body: outcome });
    }
  }
  const unknown = { ok: false, error: 'review-outcome-unknown' };
  for (const execute of [
    async () => { throw new Error('SYNTHETIC_CALLBACK_SECRET'); },
    async () => null as never,
    async () => ({ ok: true }) as never,
  ]) {
    const reply = await direct(JSON.stringify(reviewIntent()), execute).response;
    assert.deepEqual(reply, { status: 500, body: unknown });
    assert.equal(JSON.stringify(reply).includes('SYNTHETIC_CALLBACK_SECRET'), false);
  }
});

test('loopback review delegates to the existing service once and preserves durable truth on nested refusal', serial, async () => {
  await withReviewSandbox('service', async sandbox => {
    const runId = 'm402-review-service';
    const seed = pendingReviewRun(runId);
    fs.mkdirSync(path.join(sandbox.runs, runId), { recursive: true });
    fs.writeFileSync(path.join(sandbox.runs, runId, 'run.json'), JSON.stringify(seed, null, 2) + '\n', { flag: 'wx' });
    const started = await startLocalService({
      runRoot: sandbox.runs,
      applicationRevision: 'b'.repeat(40),
      clientRoot,
      port: 0,
    });
    assert.ok(started.ok, JSON.stringify(started));
    sandbox.services.push(started.service);
    assert.deepEqual(started.service.readRun(runId), { ok: true, run: seed, interrupted: false });

    const invalid = reviewIntent('approve', runId);
    invalid.review.supportConfirmed = false;
    const before = fs.readFileSync(path.join(sandbox.runs, runId, 'run.json'));
    const refused = await request(started.service.url, '/api/finding-review', JSON.stringify(invalid));
    assert.equal(refused.status, 400);
    assertHeaders(refused);
    assert.deepEqual(refused.body, reviewFailure('review-validation', seed));
    assert.deepEqual(fs.readFileSync(path.join(sandbox.runs, runId, 'run.json')), before);

    const accepted = await request(started.service.url, '/api/finding-review',
      JSON.stringify(reviewIntent('approve', runId)));
    assert.equal(accepted.status, 200);
    assertHeaders(accepted);
    const body = accepted.body as { ok: true; run: Record<string | number, unknown> };
    assert.equal(body.ok, true);
    assert.equal(selectedFinding(body.run).state, 'accepted');
    assert.deepEqual(started.service.readRun(runId), { ok: true, run: body.run, interrupted: false });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(sandbox.runs, runId, 'run.json'), 'utf8')), body.run);
  });
});
