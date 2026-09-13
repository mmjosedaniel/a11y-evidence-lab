import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { mock } from 'node:test';
import type { GenerationServiceOutcome, LocalService } from '../src/server/service.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { expectedRetrievalResult, selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import {
  controlledGenerationFactory,
  failedGenerationEnvelope,
  generationIntent,
} from './helpers/m305-generation-fixture.ts';

const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const clientRoot = path.join(repo, 'dist', 'client');
const serial = { concurrency: false };
const localFactory = controlledGenerationFactory('local');
const groqFactory = controlledGenerationFactory('groq');
const factoryArguments: Record<'local' | 'groq', unknown[][]> = { local: [], groq: [] };
let expectedFactory: { mode: 'local' | 'groq'; runs: string } | undefined;

function createControlledAdapter(mode: 'local' | 'groq', args: unknown[]) {
  factoryArguments[mode].push(args);
  assert.deepEqual(args, [], 'Default factories receive no browser-owned options');
  assert.deepEqual(expectedFactory?.mode, mode);
  const durable = JSON.parse(fs.readFileSync(path.join(expectedFactory!.runs, 'run-01', 'run.json'), 'utf8')) as
    Record<string | number, unknown>;
  assert.deepEqual(selectedFinding(durable).generation,
    { status: 'running', startedAt: (selectedFinding(durable).generation as Record<string, unknown>).startedAt },
    'Default factory resolution occurs only after running publication');
  return mode === 'local' ? localFactory.create() : groqFactory.create();
}

mock.module(new URL('../src/server/generation/ollama-generation.ts', import.meta.url).href, {
  namedExports: {
    createOllamaGenerationAdapter: (...args: unknown[]) => createControlledAdapter('local', args),
  },
});
mock.module(new URL('../src/server/generation/groq-generation.ts', import.meta.url).href, {
  namedExports: {
    createGroqGenerationAdapter: (...args: unknown[]) => createControlledAdapter('groq', args),
  },
});

// This focused owner must exist before route composition can execute the behavioral tests below.
await import('../src/server/local-service/generation-api.ts');
const [{ createLoopbackApiServer }, { startLocalService }, { openRunRepository }] = await Promise.all([
  import('../src/server/local-service/loopback-api.ts'),
  import('../src/server/service.ts'),
  import('../src/server/persistence/run-repository.ts'),
]);

type Reply = { status: number; headers: http.IncomingHttpHeaders; body: unknown; text: string };
type ApiCallbacks = Parameters<typeof createLoopbackApiServer>[0];

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

async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Owned M305 port did not close')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned M305 port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
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

function request(
  url: string,
  target = '/api/finding-generation',
  body: string | Buffer = JSON.stringify(generationIntent()),
  contentType: string | null = 'application/json',
  declaredLength?: number,
): Promise<Reply> {
  const address = new URL(url);
  return new Promise((resolve, reject) => {
    const headers: Record<string, string | number> = {};
    if (contentType !== null) headers['Content-Type'] = contentType;
    if (declaredLength !== undefined) headers['Content-Length'] = declaredLength;
    const outgoing = http.request({ hostname: address.hostname, port: address.port, path: target,
      method: 'POST', headers, agent: false, signal: AbortSignal.timeout(5000) }, incoming => {
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

function invalidRequest() {
  return failedGenerationEnvelope('invalid-request');
}

test('generation route is absent for API-only construction and never changes health capability shape', serial, async () => {
  const apiOnly = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }) });
  try {
    const address = new URL(apiOnly.url);
    const health = await new Promise<Reply>((resolve, reject) => {
      http.get({ hostname: address.hostname, port: address.port, path: '/api/health', agent: false }, incoming => {
        let text = '';
        incoming.setEncoding('utf8');
        incoming.on('data', (chunk: string) => { text += chunk; });
        incoming.once('error', reject);
        incoming.once('end', () => resolve({ status: incoming.statusCode!, headers: incoming.headers,
          text, body: JSON.parse(text) }));
      }).once('error', reject);
    });
    assert.deepEqual(health.body, { status: 'ready', busy: false,
      capabilities: { readRuns: true, scan: false, guidance: false } });
    const post = await request(apiOnly.url);
    assert.equal(post.status, 405);
    assert.deepEqual(post.body, { ok: false, error: 'method-not-allowed' });
  } finally { await close(apiOnly.server, apiOnly.url); }
});

test('closed POST admits exactly 1024 UTF-8 bytes and maps every service outcome unchanged', serial, async () => {
  let calls = 0;
  let outcome: GenerationServiceOutcome = failedGenerationEnvelope('not-found');
  const api = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    generateFinding: async input => { calls++; assert.deepEqual(input, generationIntent()); return outcome; } });
  try {
    const exact = JSON.stringify(generationIntent()).padEnd(1024, ' ');
    const accepted = await request(api.url, '/api/finding-generation', exact);
    assert.equal(accepted.status, 404);
    assert.deepEqual(accepted.body, outcome);
    assertHeaders(accepted);

    const mappings = [
      [400, ['invalid-request']],
      [404, ['not-found']],
      [409, ['busy', 'workflow-active', 'not-eligible']],
      [503, ['stopping', 'shutdown', 'missing-prerequisite']],
      [500, ['invalid-run', 'stored-run-unavailable', 'read-failed', 'generation-persistence',
        'input-integrity', 'configuration', 'input-fit', 'authentication', 'quota', 'rate-limit',
        'network', 'provider', 'timeout', 'response-validation']],
    ] as const;
    for (const [status, errors] of mappings) {
      for (const error of errors) {
        outcome = failedGenerationEnvelope(error);
        const reply = await request(api.url);
        assert.equal(reply.status, status, error);
        assert.deepEqual(reply.body, outcome);
      }
    }
    assert.equal(calls, 1 + mappings.reduce((count, entry) => count + entry[1].length, 0));
  } finally { await close(api.server, api.url); }
});

test('rejects malformed transport before dispatch and reports callback exceptions as unknown', serial, async () => {
  let calls = 0;
  let reject = false;
  const api = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    generateFinding: async () => {
      calls++;
      if (reject) throw new Error('SYNTHETIC_CALLBACK_SECRET');
      return failedGenerationEnvelope('not-found');
    } });
  try {
    const oversized = JSON.stringify(generationIntent()).padEnd(1025, ' ');
    const cases: Array<[string, string | Buffer, string | null, number?]> = [
      ['/api/finding-generation?', JSON.stringify(generationIntent()), 'application/json'],
      ['/api/finding-generation#fragment', JSON.stringify(generationIntent()), 'application/json'],
      ['/api/finding-generation', '{', 'application/json'],
      ['/api/finding-generation', Buffer.from([0xc3, 0x28]), 'application/json'],
      ['/api/finding-generation', JSON.stringify(generationIntent()), 'application/json;charset=utf-8'],
      ['/api/finding-generation', JSON.stringify(generationIntent()), null],
      ['/api/finding-generation', oversized, 'application/json'],
      ['/api/finding-generation', oversized, 'application/json', 1025],
      ['/api/finding-generation', JSON.stringify({ runId: 'run-01' }), 'application/json'],
      ['/api/finding-generation', JSON.stringify({ ...generationIntent(), extra: true }), 'application/json'],
      ['/api/finding-generation', JSON.stringify({ runId: '../escape', findingId: 'finding-0' }), 'application/json'],
      ['/api/finding-generation', JSON.stringify({ runId: 'a'.repeat(65), findingId: 'finding-0' }), 'application/json'],
      ['/api/finding-generation', JSON.stringify({ runId: 'run-01', findingId: '' }), 'application/json'],
    ];
    for (const [target, body, contentType, length] of cases) {
      const reply = await request(api.url, target, body, contentType, length);
      assert.equal(reply.status, 400);
      assert.deepEqual(reply.body, invalidRequest());
    }
    assert.equal(calls, 0);
    reject = true;
    const unknown = await request(api.url);
    assert.equal(unknown.status, 500);
    assert.deepEqual(unknown.body, failedGenerationEnvelope('response-validation', { cleanupFailed: true }));
    assert.equal(unknown.text.includes('SYNTHETIC_CALLBACK_SECRET'), false);
    assert.equal(calls, 1);
  } finally { await close(api.server, api.url); }
});

test('pre-completion abort dispatches nothing while post-dispatch disconnect neither cancels nor repeats work', serial, async () => {
  let resolve!: (value: GenerationServiceOutcome) => void;
  const completion = new Promise<GenerationServiceOutcome>(done => { resolve = done; });
  let calls = 0;
  let entered!: () => void;
  const accepted = new Promise<void>(done => { entered = done; });
  const api = await listen({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }),
    generateFinding: async () => { calls++; entered(); return completion; } });
  const address = new URL(api.url);
  let response: http.ServerResponse | undefined;
  let writesAfterClose = 0;
  api.server.on('request', (_request, current) => {
    response = current;
    const end = current.end;
    current.end = ((...args: unknown[]) => {
      if (current.destroyed) writesAfterClose++;
      return Reflect.apply(end, current, args);
    }) as typeof current.end;
  });
  let partial: net.Socket | undefined;
  let complete: net.Socket | undefined;
  try {
    const body = JSON.stringify(generationIntent());
    partial = net.connect({ host: address.hostname, port: Number(address.port) });
    const partialClosed = new Promise<void>(done => partial!.once('close', () => done()));
    await new Promise<void>((done, reject) => {
      partial!.once('error', reject);
      partial!.once('connect', () => {
        partial!.write(`POST /api/finding-generation HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body.slice(0, 1)}`, () => {
          partial!.destroy();
          done();
        });
      });
    });
    await within(partialClosed, 1000, 'Partial M305 request did not close');
    await new Promise<void>(done => setImmediate(done));
    assert.equal(calls, 0);

    complete = net.connect({ host: address.hostname, port: Number(address.port) });
    await new Promise<void>((done, reject) => {
      complete!.once('error', reject);
      complete!.once('connect', () => {
        complete!.write(`POST /api/finding-generation HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`, () => done());
      });
    });
    assert.equal(await within(Promise.race([
      accepted.then(() => 'callback' as const),
      new Promise<'response'>(done => complete!.once('data', () => done('response'))),
    ]), 1000, 'Accepted M305 request produced no activity'), 'callback');
    assert.ok(response);
    const closed = new Promise<void>(done => response!.once('close', () => done()));
    complete.destroy();
    await within(closed, 1000, 'Accepted M305 response did not close');
    resolve(failedGenerationEnvelope('not-found'));
    await new Promise<void>(done => setImmediate(done));
    assert.equal(calls, 1);
    assert.equal(writesAfterClose, 0);
  } finally {
    resolve(failedGenerationEnvelope('not-found'));
    partial?.destroy();
    complete?.destroy();
    await close(api.server, api.url);
  }
});

test('built-client HTTP selects one fixed factory only after eligibility and running persistence', serial, async () => {
  ordinaryAncestors(tempParent);
  for (const mode of ['local', 'groq'] as const) {
    const root = fs.mkdtempSync(path.join(tempParent, 'm305-generation-'));
    const runs = path.join(root, 'runs');
    let service: LocalService | undefined;
    try {
      const repository = openRunRepository(runs);
      assert.ok(repository.ok);
      assert.ok(repository.value.create(runningRun('run-01', mode)).ok);
      assert.ok(repository.value.finish(completedRun('run-01', mode)).ok);
      const started = await startLocalService({ runRoot: runs, applicationRevision: 'b'.repeat(40), clientRoot });
      assert.ok(started.ok);
      service = started.service;
      const beforeCalls = localFactory.calls.factory + groqFactory.calls.factory;
      const health = await new Promise<number>((resolve, reject) => {
        http.get(`${service!.url}/api/health`, incoming => {
          incoming.resume();
          incoming.once('end', () => resolve(incoming.statusCode!));
        }).once('error', reject);
      });
      assert.equal(health, 200);
      const ineligible = await request(service.url);
      assert.equal(ineligible.status, 409);
      assert.equal(localFactory.calls.factory + groqFactory.calls.factory, beforeCalls);

      const retrieval = await service.retrieveFinding(generationIntent(), async () => expectedRetrievalResult());
      assert.ok(retrieval.ok);
      expectedFactory = { mode, runs };
      const result = await request(service.url);
      assert.equal(result.status, 200);
      const body = result.body as { ok: boolean; run: Record<string | number, unknown> };
      assert.equal(body.ok, true);
      assert.equal(selectedFinding(body.run).state, 'proposal-pending-review');
      assert.deepEqual(JSON.parse(fs.readFileSync(path.join(runs, 'run-01', 'run.json'), 'utf8')), body.run);
      assert.equal(localFactory.calls.factory + groqFactory.calls.factory, beforeCalls + 1);
      assert.equal(mode === 'local' ? localFactory.calls.factory : groqFactory.calls.factory,
        factoryArguments[mode].length);
    } finally {
      expectedFactory = undefined;
      if (service) {
        assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
        await portClosed(service.url);
      }
      assert.equal(path.dirname(root), path.resolve(tempParent));
      assert.match(path.basename(root), /^m305-generation-/);
      ordinaryAncestors(root);
      ordinaryInventory(root);
      fs.rmSync(root, { recursive: true, force: false });
    }
  }
});
