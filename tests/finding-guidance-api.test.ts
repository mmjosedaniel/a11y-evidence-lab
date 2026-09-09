import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createLoopbackApiServer } from '../src/server/local-service/loopback-api.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, RetrievalOutcome } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { CompletedRun } from '../src/server/persistence/run-repository.ts';
import { runningRun, completedRun } from './helpers/m102-run-fixture.ts';
import {
  completedScanRun,
  evidenceAbstainedRun,
  retrievalRequest,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';

const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const clientRoot = path.join(repo, 'dist', 'client');
const serial = { concurrency: false };

type Reply = { status: number; headers: http.IncomingHttpHeaders; body: unknown; text: string };
type GuidanceCallback = (input: unknown) => Promise<RetrievalOutcome>;
type ApiCallbacks = Parameters<typeof createLoopbackApiServer>[0] & { retrieveFinding?: GuidanceCallback };

function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

function ordinaryInventory(target: string): void {
  for (const name of fs.readdirSync(target)) {
    const child = path.join(target, name);
    const stat = fs.lstatSync(child);
    assert.equal(stat.isSymbolicLink(), false);
    if (stat.isDirectory()) ordinaryInventory(child);
    else assert.ok(stat.isFile() && stat.nlink === 1);
  }
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(5000, () => { socket.destroy(); reject(new Error('Port closure timed out')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => reject(new Error(message)), milliseconds).unref();
    }),
  ]);
}

async function listen(callbacks: ApiCallbacks): Promise<{ server: http.Server; url: string }> {
  const server = createLoopbackApiServer(callbacks);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return { server, url: `http://127.0.0.1:${address.port}` };
}

async function close(server: http.Server, url: string): Promise<void> {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  server.closeAllConnections();
  await portClosed(url);
}

function request(url: string, target: string, method = 'POST', body = JSON.stringify(retrievalRequest()),
  contentType: string | null = 'application/json'): Promise<Reply> {
  const address = new URL(url);
  return new Promise((resolve, reject) => {
    const headers = contentType === null ? {} : { 'Content-Type': contentType };
    const outgoing = http.request({ hostname: address.hostname, port: address.port, path: target, method,
      headers, agent: false, signal: AbortSignal.timeout(5000) }, incoming => {
      let text = '';
      incoming.setEncoding('utf8');
      incoming.on('data', (chunk: string) => { text += chunk; });
      incoming.once('error', reject);
      incoming.once('end', () => {
        try { resolve({ status: incoming.statusCode!, headers: incoming.headers,
          text, body: text ? JSON.parse(text) : undefined }); }
        catch (error) { reject(error); }
      });
    });
    outgoing.once('error', reject);
    outgoing.end(body);
  });
}

function assertHeaders(reply: Reply): void {
  assert.equal(reply.headers['content-type'], 'application/json;charset=utf-8');
  assert.equal(reply.headers['cache-control'], 'no-store');
  assert.equal(reply.headers['x-content-type-options'], 'nosniff');
}

function failure(error: string): RetrievalOutcome {
  return { ok: false, error: error as never, run: null, persisted: false, cleanupFailed: false };
}

test('guidance POST is absent for API-only construction and health reports callback capability directly', serial, async () => {
  const apiOnly = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }) });
  try {
    const health = await request(apiOnly.url, '/api/health', 'GET', '', null);
    assert.equal(health.status, 200);
    assert.deepEqual(health.body, { status: 'ready', busy: false,
      capabilities: { readRuns: true, scan: false, guidance: false } });
    const post = await request(apiOnly.url, '/api/finding-guidance');
    assert.equal(post.status, 405);
    assert.deepEqual(post.body, { ok: false, error: 'method-not-allowed' });
  } finally { await close(apiOnly.server, apiOnly.url); }
});

test('fixed guidance POST passes only its parsed body and maps success and every service error', serial, async () => {
  let received: unknown;
  let outcome: RetrievalOutcome = { ok: true, run: evidenceAbstainedRun() as unknown as CompletedRun,
    view: { runId: 'run-01', findingId: 'finding-0', corpus: null, passages: [], notices: [] } } as RetrievalOutcome;
  const api = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    retrieveFinding: async input => { received = input; return outcome; } });
  try {
    const health = await request(api.url, '/api/health', 'GET', '', null);
    assert.deepEqual(health.body, { status: 'ready', busy: false,
      capabilities: { readRuns: true, scan: false, guidance: true } });
    const success = await request(api.url, '/api/finding-guidance');
    assertHeaders(success);
    assert.equal(success.status, 200);
    assert.deepEqual(received, retrievalRequest());
    assert.deepEqual(success.body, outcome);

    const mappings = [
      [400, ['invalid-request']],
      [404, ['not-found']],
      [409, ['busy', 'workflow-active', 'not-eligible']],
      [503, ['stopping', 'shutdown', 'missing-prerequisite']],
      [500, ['invalid-run', 'stored-run-unavailable', 'read-failed', 'retrieval-persistence',
        'corpus-integrity', 'model-identity', 'input-fit', 'embedding-failed', 'embedding-response',
        'timeout', 'result-validation']],
    ] as const;
    for (const [status, errors] of mappings) {
      for (const error of errors) {
        outcome = failure(error);
        const reply = await request(api.url, '/api/finding-guidance');
        assert.equal(reply.status, status, error);
        assert.deepEqual(reply.body, outcome);
      }
    }
  } finally { await close(api.server, api.url); }
});

test('guidance POST rejects malformed transport input and callback rejection with a closed envelope', serial, async () => {
  let calls = 0;
  let rejectCallback = false;
  const api = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    retrieveFinding: async input => {
      calls++;
      if (rejectCallback) throw new Error('SYNTHETIC_CALLBACK_SECRET');
      if (JSON.stringify(input) !== JSON.stringify(retrievalRequest())) return failure('invalid-request');
      return failure('not-found');
    } });
  try {
    for (const [target, body, contentType] of [
      ['/api/finding-guidance?', JSON.stringify(retrievalRequest()), 'application/json'],
      ['/api/finding-guidance#fragment', JSON.stringify(retrievalRequest()), 'application/json'],
      ['/api/finding-guidance', '{', 'application/json'],
      ['/api/finding-guidance', JSON.stringify(retrievalRequest()), 'application/json; charset=utf-8'],
      ['/api/finding-guidance', JSON.stringify(retrievalRequest()), null],
    ] as const) {
      const reply = await request(api.url, target, 'POST', body, contentType);
      assert.equal(reply.status, 400);
      assert.equal(JSON.stringify(reply.body).includes('SYNTHETIC_CALLBACK_SECRET'), false);
    }
    for (const body of [null, {}, { runId: 'run-01' }, { ...retrievalRequest(), extra: true },
      { runId: '../escape', findingId: 'finding-0' }, { runId: 'run-01', findingId: '' }]) {
      const reply = await request(api.url, '/api/finding-guidance', 'POST', JSON.stringify(body));
      assert.equal(reply.status, 400);
      assert.deepEqual(reply.body, failure('invalid-request'));
    }
    assert.equal(calls, 6);
    rejectCallback = true;
    const rejected = await request(api.url, '/api/finding-guidance');
    assert.equal(rejected.status, 500);
    assert.deepEqual(rejected.body,
      { ok: false, error: 'result-validation', run: null, persisted: false, cleanupFailed: false });
    assert.equal(rejected.text.includes('SYNTHETIC_CALLBACK_SECRET'), false);
  } finally { await close(api.server, api.url); }
});

test('disconnect after accepted body does not cancel service work or write to the destroyed response', serial, async () => {
  let resolve!: (value: RetrievalOutcome) => void;
  const completion = new Promise<RetrievalOutcome>(done => { resolve = done; });
  let calls = 0;
  let entered!: () => void;
  const accepted = new Promise<void>(done => { entered = done; });
  const api = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    retrieveFinding: async () => { calls++; entered(); return completion; } });
  const address = new URL(api.url);
  let observedResponse: http.ServerResponse | undefined;
  let writesAfterClose = 0;
  api.server.on('request', (_incoming, response) => {
    observedResponse = response;
    const originalWrite = response.write;
    const originalEnd = response.end;
    response.write = ((...args: unknown[]) => {
      if (response.destroyed) writesAfterClose++;
      return Reflect.apply(originalWrite, response, args);
    }) as typeof response.write;
    response.end = ((...args: unknown[]) => {
      if (response.destroyed) writesAfterClose++;
      return Reflect.apply(originalEnd, response, args);
    }) as typeof response.end;
  });
  let partialSocket: net.Socket | undefined;
  let acceptedSocket: net.Socket | undefined;
  try {
    partialSocket = net.connect({ host: address.hostname, port: Number(address.port) });
    const partialClosed = new Promise<void>(done => partialSocket!.once('close', () => done()));
    await new Promise<void>((done, reject) => {
      partialSocket!.once('error', reject);
      partialSocket!.once('connect', () => {
        const body = JSON.stringify(retrievalRequest());
        partialSocket!.write(`POST /api/finding-guidance HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body.slice(0, 1)}`, () => {
          partialSocket!.destroy();
          done();
        });
      });
    });
    await within(partialClosed, 1000, 'Partial request socket did not close');
    await new Promise<void>(done => setImmediate(done));
    assert.equal(calls, 0);

    acceptedSocket = net.connect({ host: address.hostname, port: Number(address.port) });
    const firstAcceptedActivity = Promise.race([
      accepted.then(() => 'callback' as const),
      new Promise<'response'>(done => acceptedSocket!.once('data', () => done('response'))),
    ]);
    await new Promise<void>((done, reject) => {
      acceptedSocket!.once('error', reject);
      acceptedSocket!.once('connect', () => {
        const body = JSON.stringify(retrievalRequest());
        acceptedSocket!.write(`POST /api/finding-guidance HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`, () => done());
      });
    });
    assert.equal(await within(firstAcceptedActivity, 1000, 'Accepted request produced no activity'),
      'callback', 'Guidance response started before service work was accepted');
    assert.ok(observedResponse);
    const responseClosed = new Promise<void>(done => observedResponse!.once('close', () => done()));
    acceptedSocket.destroy();
    await within(responseClosed, 1000, 'Accepted request response did not close');
    assert.equal(observedResponse.destroyed, true);
    resolve(failure('not-found'));
    await new Promise<void>(done => setImmediate(done));
    assert.equal(calls, 1);
    assert.equal(writesAfterClose, 0);
  } finally {
    resolve(failure('not-found'));
    partialSocket?.destroy();
    acceptedSocket?.destroy();
    await close(api.server, api.url);
  }
});

test('built-client service wires effect-free incomplete-evidence guidance and returns its durable run and view', serial, async () => {
  ordinaryAncestors(tempParent);
  const root = fs.mkdtempSync(path.join(tempParent, 'm203-guidance-api-'));
  const runs = path.join(root, 'runs');
  let service: LocalService | undefined;
  try {
    const opened = openRunRepository(runs);
    assert.ok(opened.ok);
    assert.ok(opened.value.create(runningRun()).ok);
    const incomplete = completedScanRun();
    (selectedFinding(incomplete).evidence as Record<string, unknown>).altState = { unavailable: 'missing' };
    assert.ok(opened.value.finish(incomplete as unknown as CompletedRun).ok);
    const started = await startLocalService({ runRoot: runs, applicationRevision: 'b'.repeat(40), clientRoot });
    assert.ok(started.ok);
    service = started.service;
    const health = await request(service.url, '/api/health', 'GET', '', null);
    assert.deepEqual(health.body, { status: 'ready', busy: false,
      capabilities: { readRuns: true, scan: true, guidance: true } });
    const reply = await request(service.url, '/api/finding-guidance');
    assert.equal(reply.status, 200);
    const body = reply.body as { ok: boolean; run: Record<string | number, unknown>; view: unknown };
    assert.equal(body.ok, true);
    const actualFinding = selectedFinding(body.run);
    const expectedFinding = structuredClone(selectedFinding(evidenceAbstainedRun()));
    const actualAnalysis = actualFinding.analysis as Record<string, unknown>;
    const expectedAnalysis = expectedFinding.analysis as Record<string, unknown>;
    expectedAnalysis.startedAt = actualAnalysis.startedAt;
    expectedAnalysis.finishedAt = actualAnalysis.finishedAt;
    assert.deepEqual(actualFinding, expectedFinding);
    assert.deepEqual(body.view,
      { runId: 'run-01', findingId: 'finding-0', corpus: null, passages: [], notices: [] });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(runs, 'run-01', 'run.json'), 'utf8')),
      body.run);
  } finally {
    if (service) {
      assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
      await portClosed(service.url);
    }
    assert.equal(path.dirname(root), path.resolve(tempParent));
    assert.match(path.basename(root), /^m203-guidance-api-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    fs.rmSync(root, { recursive: true, force: false });
  }
});
