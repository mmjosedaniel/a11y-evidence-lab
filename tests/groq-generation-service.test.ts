import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createGroqGenerationAdapter } from '../src/server/generation/groq-generation.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { expectedRetrievalResult, retrievalRequest, selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import {
  groqChatBody,
  groqNativeHarness,
  manuallySettledGroqNativeHarness,
  SYNTHETIC_GROQ_CREDENTIAL,
  virtualCredentialIO,
} from './helpers/m304-groq-fixture.ts';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repositoryRoot, 'temp');
const serial = { concurrency: false };
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;
type Box = { root: string; runs: string; services: LocalService[]; preserve: boolean };

function success<T>(result: { ok: true; value: T } | { ok: false }): T {
  assert.ok(result.ok);
  return result.value;
}

function disk(root: string): Record<string | number, any> {
  return JSON.parse(fs.readFileSync(path.join(root, 'run-01', 'run.json'), 'utf8')) as Record<string | number, any>;
}

function request() { return { runId: 'run-01', findingId: 'finding-0' }; }

function scanInput() {
  const run = runningRun('input-only', 'groq');
  return structuredClone({ requestedUrl: run.requestedUrl, providerContext: run.providerContext, scanContext: run.scanContext });
}

async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = nativeSetTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally {
    if (timer !== undefined) nativeClearTimeout(timer);
  }
}

async function waitUntil(predicate: () => boolean, message: string): Promise<void> {
  const expires = performance.now() + 2000;
  while (performance.now() < expires) {
    if (predicate()) return;
    await new Promise<void>(resolve => nativeSetTimeout(resolve, 5));
  }
  assert.fail(message);
}

function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function ordinaryInventory(target: string): void {
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const child = path.join(target, entry.name);
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
    let refused = false;
    let failure: Error | undefined;
    const watchdog = nativeSetTimeout(() => {
      failure = new Error('Owned M304 service port close probe timed out');
      socket.destroy();
    }, 2000);
    socket.once('connect', () => {
      failure = new Error('Owned M304 service port remained open');
      socket.destroy();
    });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ECONNREFUSED') refused = true;
      else failure = error;
      socket.destroy();
    });
    socket.once('close', () => {
      nativeClearTimeout(watchdog);
      if (failure) reject(failure);
      else if (refused) resolve();
      else reject(new Error('Owned M304 service port probe closed without refusal'));
    });
  });
}

async function withBox(run: (box: Box) => Promise<void>): Promise<void> {
  ordinaryAncestors(tempParent);
  const root = fs.mkdtempSync(path.join(tempParent, 'm304-groq-'));
  const box: Box = { root, runs: path.join(root, 'runs'), services: [], preserve: false };
  const errors: unknown[] = [];
  try { await run(box); } catch (error) { errors.push(error); }
  for (const service of box.services) {
    try {
      await within(service.stop(), 6500, 'Owned M304 service stop did not settle');
      await portClosed(service.url);
    } catch (error) {
      box.preserve = true;
      errors.push(error);
    }
  }
  try {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(tempParent));
    assert.match(path.basename(root), /^m304-groq-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    if (!box.preserve) fs.rmSync(root, { recursive: true, force: false });
  } catch (error) {
    box.preserve = true;
    errors.push(error);
  }
  if (errors.length) throw new AggregateError(errors, `Owned M304 fixture failed; preserved=${box.preserve}; root=${root}`);
}

async function ready(box: Box): Promise<LocalService> {
  const store = success(openRunRepository(box.runs));
  success(store.create(runningRun('run-01', 'groq')));
  success(store.finish(completedRun('run-01', 'groq')));
  const started = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
  assert.ok(started.ok);
  box.services.push(started.service);
  const retrieval = await started.service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
  assert.ok(retrieval.ok, JSON.stringify(retrieval));
  return started.service;
}

test('actual Groq adapter publishes only the selected durable pending proposal', serial, async () => {
  await withBox(async box => {
    const fixture = generationFixture();
    const credential = virtualCredentialIO();
    const native = groqNativeHarness([{ body: groqChatBody(fixture.proposal) }]);
    const adapter = createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
    assert.equal(native.calls.length, 0);
    assert.equal(credential.calls.debug, 0);
    const service = await ready(box);
    const before = disk(box.runs);
    const beforeSelected = structuredClone(selectedFinding(before));
    const sibling = structuredClone(selectedFinding(before, 1));
    const result = await service.generateFinding(request(), adapter);
    assert.ok(result.ok, JSON.stringify(result));
    if (!result.ok) return;
    const selected = selectedFinding(result.run as never);
    assert.equal(selected.state, 'proposal-pending-review');
    assert.deepEqual(selected.result, fixture.proposal);
    assert.equal('review' in selected, false);
    assert.deepEqual(selectedFinding(result.run as never, 1), sibling);
    for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl',
      'providerContext', 'status', 'finishedAt'] as const) assert.deepEqual(result.run[key], before[key]);
    for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence',
      'retrieval', 'analysis'] as const) assert.deepEqual(selected[key], beforeSelected[key]);
    assert.deepEqual(disk(box.runs), result.run);
    assert.equal(native.calls.length, 1);
    const outbound = native.calls[0]!.body.toString('utf8');
    for (const excluded of [String(before.requestedUrl), ':root > :nth-child(1)', 'finding-1',
      SYNTHETIC_GROQ_CREDENTIAL]) {
      assert.equal(outbound.includes(excluded), false, `Outbound body exposed ${excluded}`);
    }
    const durable = JSON.stringify(result.run);
    assert.equal(durable.includes(SYNTHETIC_GROQ_CREDENTIAL), false);
  });
});

test('service startup, scan and retrieval do not touch a constructed Groq adapter', serial, async () => {
  await withBox(async box => {
    const credential = virtualCredentialIO();
    const native = groqNativeHarness([]);
    createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
    const started = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
    assert.ok(started.ok);
    box.services.push(started.service);
    const scan = await started.service.runScan(scanInput(), async () => undefined);
    assert.equal(scan.ok, false);
    assert.equal(credential.calls.debug, 0);
    assert.equal(native.calls.length, 0);
  });
});

test('pre-call and attempted Groq failures persist exact invocation truth without secret diagnostics', serial, async () => {
  const fixture = generationFixture();
  const vectors = [
    ['missing-prerequisite', false, virtualCredentialIO({ content: 'OTHER=value\n' }), []],
    ['authentication', true, virtualCredentialIO(), [{ status: 401, body: JSON.stringify({ diagnostic: SYNTHETIC_GROQ_CREDENTIAL }) }]],
    ['quota', true, virtualCredentialIO(), [{ status: 400, body: JSON.stringify({ error: { code: 'blocked_api_access' }, echo: SYNTHETIC_GROQ_CREDENTIAL }) }]],
    ['provider', true, virtualCredentialIO(), [{ status: 503, body: JSON.stringify({ diagnostic: SYNTHETIC_GROQ_CREDENTIAL }) }]],
    ['response-validation', true, virtualCredentialIO(), [{ body: groqChatBody({ invalid: true }) }]],
  ] as const;
  for (const [error, attempted, credential, replies] of vectors) {
    await withBox(async box => {
      const service = await ready(box);
      const native = groqNativeHarness(replies);
      const result = await service.generateFinding(request(),
        createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request }));
      assert.equal(result.ok, false);
      if (result.ok) return;
      assert.equal(result.error, error);
      assert.equal(result.persisted, true);
      assert.equal(result.invocationPersisted, attempted);
      assert.equal('result' in selectedFinding(result.run as never), false);
      assert.equal(native.calls.length, attempted ? 1 : 0);
      assert.equal(JSON.stringify(result).includes(SYNTHETIC_GROQ_CREDENTIAL), false);
      assert.deepEqual(disk(box.runs), result.run);
    });
  }
});

test('wrong and restarted stale ownership reject before credential or native I/O', serial, async () => {
  await withBox(async box => {
    const service = await ready(box);
    const credential = virtualCredentialIO();
    const native = groqNativeHarness([]);
    const adapter = createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
    assert.equal((await service.generateFinding({ runId: 'run-01', findingId: 'missing' }, adapter)).ok, false);
    assert.equal((await service.generateFinding({ runId: 'missing', findingId: 'finding-0' }, adapter)).ok, false);
    assert.equal(credential.calls.debug, 0);
    assert.equal(native.calls.length, 0);
    assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
    const restarted = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
    assert.ok(restarted.ok);
    box.services.push(restarted.service);
    const stale = await restarted.service.generateFinding(request(), adapter);
    assert.equal(stale.ok, false);
    if (!stale.ok) assert.equal(stale.error, 'workflow-active');
    assert.equal(credential.calls.debug, 0);
    assert.equal(native.calls.length, 0);
  });
});

test('service stop during active Groq dispatch rejects late native success and preserves durable failure', serial, async () => {
  await withBox(async box => {
    const service = await ready(box);
    const native = manuallySettledGroqNativeHarness();
    const adapter = createGroqGenerationAdapter({ credentialIO: virtualCredentialIO().io, requestImplementation: native.request });
    const operation = service.generateFinding(request(), adapter);
    await waitUntil(() => native.calls.length === 1, 'Groq request did not become active');
    const overlapping = await service.generateFinding(request(), adapter);
    assert.equal(overlapping.ok, false);
    if (!overlapping.ok) assert.equal(overlapping.error, 'busy');
    const stopping = service.stop();
    const result = await operation;
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, 'shutdown');
      assert.equal(result.invocationPersisted, true);
      assert.equal('result' in selectedFinding(result.run as never), false);
    }
    assert.deepEqual(await stopping, { ok: false, error: 'stop-failed' });
    const durable = disk(box.runs);
    native.control.respond();
    assert.equal(native.control.responseDestroyed, true);
    native.control.data(groqChatBody(generationFixture().proposal));
    native.control.end();
    native.control.closeResponse();
    native.control.closeRequest();
    native.control.closeSocket();
    native.control.repeatCallback();
    assert.equal(native.control.lateResponseDestroyed, true);
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.deepEqual(disk(box.runs), durable);
    assert.equal(native.calls.length, 1);
  });
});

test('failed terminal publication exposes unpersisted Groq invocation and preserves running bytes', serial, async t => {
  await withBox(async box => {
    const service = await ready(box);
    const fixture = generationFixture();
    const native = groqNativeHarness([{ body: groqChatBody(fixture.proposal) }]);
    const originalRename = fs.renameSync;
    let running: unknown;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string | number, any>;
      const generation = selectedFinding(candidate).generation as Record<string, unknown> | undefined;
      if (generation?.status === 'running') {
        const result = originalRename(from, to);
        running = disk(box.runs);
        return result;
      }
      if (generation?.status === 'completed') throw new Error('SYNTHETIC_M304_TERMINAL_WRITE_FAILURE');
      return originalRename(from, to);
    });
    try {
      const result = await service.generateFinding(request(), createGroqGenerationAdapter({
        credentialIO: virtualCredentialIO().io, requestImplementation: native.request,
      }));
      assert.equal(result.ok, false);
      if (result.ok) return;
      assert.equal(result.error, 'generation-persistence');
      assert.equal(result.persisted, false);
      assert.equal(result.invocationPersisted, false);
      assert.ok(result.invocation);
      assert.deepEqual(result.run, running);
      assert.deepEqual(disk(box.runs), running);
      assert.equal(JSON.stringify(result).includes(SYNTHETIC_GROQ_CREDENTIAL), false);
    } finally {
      t.mock.restoreAll();
    }
  });
});
