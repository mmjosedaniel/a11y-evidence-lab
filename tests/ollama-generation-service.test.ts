import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createOllamaGenerationAdapter } from '../src/server/generation/ollama-generation.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { OllamaNativeRequest } from '../src/server/generation/ollama-generation-http.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { expectedRetrievalResult, retrievalRequest, selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import { manuallySettledNativeHarness, nativeHarness, ollamaChatBody, validMetadata } from './helpers/m303-ollama-fixture.ts';

const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const serial = { concurrency: false };
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;
type Box = { root: string; runs: string; services: LocalService[]; preserve: boolean };

function success<T>(result: { ok: true; value: T } | { ok: false }): T { assert.ok(result.ok); return result.value; }
function disk(root: string): Record<string | number, unknown> {
  return JSON.parse(fs.readFileSync(path.join(root, 'run-01', 'run.json'), 'utf8')) as Record<string | number, unknown>;
}
function request() { return { runId: 'run-01', findingId: 'finding-0' }; }
function scanInput() {
  const run = runningRun('input-only', 'local');
  return structuredClone({ requestedUrl: run.requestedUrl, providerContext: run.providerContext, scanContext: run.scanContext });
}
function replies(candidate: unknown, chat: Record<string, unknown> = { body: ollamaChatBody(candidate) }) {
  const metadata = validMetadata();
  return [{ body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, chat];
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
    let expectedRefusal = false;
    let failure: Error | undefined;
    const watchdog = nativeSetTimeout(() => {
      failure = new Error('Owned service port close probe timed out');
      socket.destroy();
    }, 2000);
    socket.once('connect', () => {
      failure = new Error('Owned service port remained open');
      socket.destroy();
    });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ECONNREFUSED') expectedRefusal = true;
      else failure = error;
      socket.destroy();
    });
    socket.once('close', () => {
      nativeClearTimeout(watchdog);
      if (failure) reject(failure);
      else if (expectedRefusal) resolve();
      else reject(new Error('Owned service port probe closed without refusal'));
    });
  });
}
async function withBox(run: (box: Box) => Promise<void>): Promise<void> {
  ordinaryAncestors(tempParent);
  const root = fs.mkdtempSync(path.join(tempParent, 'm303-generation-'));
  const box: Box = { root, runs: path.join(root, 'runs'), services: [], preserve: false };
  const errors: unknown[] = [];
  try { await run(box); } catch (error) { errors.push(error); }
  for (const service of box.services) {
    try {
      await within(service.stop(), 6500, 'Owned service stop did not settle');
      await portClosed(service.url);
    }
    catch (error) { box.preserve = true; errors.push(error); }
  }
  try {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(tempParent));
    assert.match(path.basename(root), /^m303-generation-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    if (!box.preserve) fs.rmSync(root, { recursive: true, force: false });
  } catch (error) { errors.push(error); }
  if (errors.length) throw new AggregateError(errors, 'Owned M303 service fixture failed');
}
async function ready(box: Box): Promise<LocalService> {
  const store = success(openRunRepository(box.runs));
  success(store.create(runningRun('run-01', 'local')));
  success(store.finish(completedRun('run-01', 'local')));
  const started = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
  assert.ok(started.ok);
  box.services.push(started.service);
  const retrieval = await started.service.retrieveFinding(retrievalRequest(), async () => expectedRetrievalResult());
  assert.ok(retrieval.ok, JSON.stringify(retrieval));
  return started.service;
}

test('actual live retrieval ownership and real adapter publish only the selected pending proposal', serial, async () => {
  await withBox(async box => {
    const fixture = generationFixture();
    const native = nativeHarness(replies(fixture.proposal));
    const adapter = createOllamaGenerationAdapter(native.request);
    assert.equal(native.calls.length, 0, 'service construction and retrieval selection perform no generation I/O');
    const service = await ready(box);
    assert.equal(native.calls.length, 0);
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
      'providerContext', 'status', 'finishedAt'] as const) {
      assert.deepEqual(result.run[key], before[key]);
    }
    for (const key of ['context', 'coverage', 'scannerReviewObservations'] as const) {
      assert.deepEqual(result.run.scan[key], (before.scan as Record<string, unknown>)[key]);
    }
    for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence',
      'retrieval', 'analysis'] as const) {
      assert.deepEqual(selected[key], beforeSelected[key]);
    }
    assert.deepEqual(disk(box.runs), result.run);
    assert.deepEqual(native.calls.map(call => call.options.path), ['/api/version', '/api/show', '/api/tags', '/api/chat']);
    assert.equal(JSON.stringify(result.run).includes('thinking'), false);
    assert.equal(JSON.stringify(result.run).includes('SECRET'), false);
  });
});

test('startup and scan execute without touching a constructed generation adapter', serial, async () => {
  await withBox(async box => {
    const native = nativeHarness([]);
    createOllamaGenerationAdapter(native.request);
    const started = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
    assert.ok(started.ok);
    box.services.push(started.service);
    const scan = await started.service.runScan(scanInput(), async () => undefined);
    assert.equal(scan.ok, false);
    assert.equal(native.calls.length, 0);
  });
});

test('pre-call and attempted adapter failures persist exact durable truth without raw diagnostics', serial, async () => {
  for (const [fixtureReplies, error, attempted] of [
    [[{ requestError: Object.assign(new Error('SECRET unavailable'), { code: 'ECONNREFUSED' }) }], 'missing-prerequisite', false],
    [replies(generationFixture().proposal, { status: 503, body: '{"diagnostic":"SECRET"}' }), 'provider', true],
    [replies(generationFixture().proposal, { body: '{"model":"wrong"}' }), 'response-validation', true],
  ] as const) {
    await withBox(async box => {
      const service = await ready(box);
      const native = nativeHarness(fixtureReplies);
      const result = await service.generateFinding(request(), createOllamaGenerationAdapter(native.request));
      assert.equal(result.ok, false);
      if (result.ok) return;
      assert.equal(result.error, error);
      assert.equal(result.persisted, true);
      assert.equal(result.invocationPersisted, attempted);
      assert.equal('result' in selectedFinding(result.run as never), false);
      assert.equal(JSON.stringify(result.run).includes('SECRET'), false);
      assert.deepEqual(disk(box.runs), result.run);
    });
  }
});

test('wrong and restarted stale ownership reject before real adapter I/O', serial, async () => {
  await withBox(async box => {
    const service = await ready(box);
    const native = nativeHarness([]);
    const adapter = createOllamaGenerationAdapter(native.request);
    const missing = await service.generateFinding({ runId: 'run-01', findingId: 'missing' }, adapter);
    assert.equal(missing.ok, false);
    const wrongRun = await service.generateFinding({ runId: 'missing', findingId: 'finding-0' }, adapter);
    assert.equal(wrongRun.ok, false);
    assert.equal(native.calls.length, 0);
    assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' });
    const restartedResult = await startLocalService({ runRoot: box.runs, applicationRevision: 'b'.repeat(40) });
    assert.ok(restartedResult.ok);
    box.services.push(restartedResult.service);
    const stale = await restartedResult.service.generateFinding(request(), adapter);
    assert.equal(stale.ok, false);
    if (!stale.ok) assert.equal(stale.error, 'workflow-active');
    assert.equal(native.calls.length, 0);
  });
});

test('stop during active native dispatch publishes shutdown and ignores actual late native callbacks', serial, async () => {
  await withBox(async box => {
    const service = await ready(box);
    const metadata = validMetadata();
    const metadataNative = nativeHarness([{ body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
      { body: JSON.stringify(metadata.tags) }]);
    const activeNative = manuallySettledNativeHarness();
    const requestImplementation: OllamaNativeRequest = (options, callback) => options.path === '/api/chat'
      ? activeNative.request(options, callback)
      : metadataNative.request(options, callback);
    const operation = service.generateFinding(request(), createOllamaGenerationAdapter(requestImplementation));
    await waitUntil(() => activeNative.calls.length === 1, 'Chat request did not become active');
    const overlapping = await service.generateFinding(request(), createOllamaGenerationAdapter(requestImplementation));
    assert.equal(overlapping.ok, false);
    if (!overlapping.ok) assert.equal(overlapping.error, 'busy');
    assert.equal(activeNative.calls.length, 1);
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
    activeNative.control.respond();
    assert.equal(activeNative.control.responseDestroyed, true);
    activeNative.control.data(ollamaChatBody(generationFixture().proposal));
    activeNative.control.end();
    activeNative.control.closeResponse();
    activeNative.control.closeRequest();
    activeNative.control.closeSocket();
    activeNative.control.repeatCallback();
    assert.equal(activeNative.control.lateResponseDestroyed, true);
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.deepEqual(disk(box.runs), durable);
    assert.equal(activeNative.calls.length, 1);
  });
});

test('failed terminal publication exposes unpersisted invocation and preserves the last durable running record', serial, async t => {
  await withBox(async box => {
    const service = await ready(box);
    const fixture = generationFixture();
    const native = nativeHarness(replies(fixture.proposal));
    const originalRename = fs.renameSync;
    let running: unknown;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string | number, unknown>;
      const generation = selectedFinding(candidate).generation as Record<string, unknown> | undefined;
      if (generation?.status === 'running') {
        const result = originalRename(from, to);
        running = disk(box.runs);
        return result;
      }
      if (generation?.status === 'completed') throw new Error('SYNTHETIC_M303_TERMINAL_WRITE_FAILURE');
      return originalRename(from, to);
    });
    try {
      const result = await service.generateFinding(request(), createOllamaGenerationAdapter(native.request));
      assert.equal(result.ok, false);
      if (result.ok) return;
      assert.equal(result.error, 'generation-persistence');
      assert.equal(result.persisted, false);
      assert.equal(result.invocationPersisted, false);
      assert.ok(result.invocation);
      assert.deepEqual(result.run, running);
      assert.deepEqual(disk(box.runs), running);
    } finally { t.mock.restoreAll(); }
  });
});
