import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, ServiceOptions, StartResult, ReadResult, ScanOutcome, StopResult } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { RunningRun, CompletedRun, FailedRun, RunRepository, StoreResult } from '../src/server/persistence/run-repository.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { runningRun, completedRun } from './helpers/m102-run-fixture.ts';
import type { FixtureMode, FixtureScan } from './helpers/m102-run-fixture.ts';

// M102-SERVICE-01: real HTTP and disk; synthetic internal collaborators only.
const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const applicationRuns = path.join(repo, 'data', 'runs');
const revision = 'b'.repeat(40);
const canary = 'SYNTHETIC_PRIVATE_INPUT_DO_NOT_ECHO';
const serial = { concurrency: false };
const stopped: StopResult = { ok: true, status: 'stopped' };
const stopFailed: StopResult = { ok: false, error: 'stop-failed' };
const tick = () => new Promise<void>(resolve => setImmediate(resolve));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}
function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Expected an ordinary directory');
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}
function ordinaryInventory(target: string): void {
  for (const name of fs.readdirSync(target)) {
    const child = path.join(target, name);
    const stat = fs.lstatSync(child);
    assert.equal(stat.isSymbolicLink(), false, 'Unexpected link prevents cleanup');
    if (stat.isDirectory()) ordinaryInventory(child);
    else assert.ok(stat.isFile() && stat.nlink === 1, 'Unexpected file topology prevents cleanup');
  }
}
type Sandbox = { root: string; runs: string; services: LocalService[]; release: Array<() => void>; preserve: boolean };
async function withSandbox(body: (box: Sandbox) => Promise<void>): Promise<void> {
  const root = fs.mkdtempSync(path.join(tempParent, 'm102-service-'));
  const box: Sandbox = { root, runs: path.join(root, 'runs'), services: [], release: [], preserve: false };
  const errors: unknown[] = [];
  try { await body(box); } catch (error) { errors.push(error); }
  try {
    for (const release of box.release) release();
    for (const service of box.services) {
      await within(service.stop(), 6500, 'Owned service stop did not settle');
      await portClosed(service.url);
    }
    assert.equal(box.preserve, false, 'Unconfirmed child ownership: preserve test artifacts');
    assert.equal(path.resolve(root), root);
    assert.equal(path.dirname(root), tempParent);
    assert.match(path.basename(root), /^m102-service-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    fs.rmSync(root, { recursive: true, force: false });
  } catch (error) { errors.push(error); }
  if (errors.length) throw new AggregateError(errors, 'Service test or owned cleanup failed');
}
function success<T>(result: StoreResult<T>): T { assert.ok(result.ok); return result.value; }
function open(root: string): RunRepository { return success(openRunRepository(root)); }
function disk(root: string, id: string): unknown { return JSON.parse(fs.readFileSync(path.join(root, id, 'run.json'), 'utf8')); }
function bytes(root: string, id: string): Buffer { return fs.readFileSync(path.join(root, id, 'run.json')); }
async function start(box: Sandbox, extra: Partial<ServiceOptions> = {}): Promise<LocalService> {
  const result: StartResult = await startLocalService({ runRoot: box.runs, applicationRevision: revision, ...extra });
  assert.ok(result.ok);
  box.services.push(result.service);
  return result.service;
}
function requestInput(mode: FixtureMode = 'local') {
  const run = runningRun('input-only', mode);
  return structuredClone({ requestedUrl: run.requestedUrl, providerContext: run.providerContext, scanContext: run.scanContext });
}
function complete(run: RunningRun, kind: FixtureScan = 'populated', futureMs = 0): CompletedRun {
  const sample = completedRun(run.runId, run.providerContext.mode, kind);
  const timestamp = new Date(Math.max(Date.now(), Date.parse(run.createdAt)) + futureMs).toISOString();
  const candidate = {
    ...sample, runId: run.runId, createdAt: run.createdAt, applicationRevision: run.applicationRevision,
    requestedUrl: run.requestedUrl, providerContext: run.providerContext, finishedAt: timestamp,
    scan: { ...sample.scan, context: { ...run.scanContext, finalUrl: sample.scan.context.finalUrl,
      browserVersion: sample.scan.context.browserVersion, readinessReached: true,
      scannedAt: { value: timestamp }, cleanup: 'closed' } },
  };
  const checked = validateRun(candidate);
  assert.ok(checked.ok && checked.value.status === 'completed', 'Service-local fixture must satisfy the actual validator');
  return checked.value;
}
function failRun(run: RunningRun, cleanup: 'closed' | 'failed' = 'closed'): FailedRun {
  const candidate = { ...run, status: 'failed', finishedAt: new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString(),
    scanContext: { ...run.scanContext, cleanup }, failure: { category: 'navigation' } };
  const checked = validateRun(candidate);
  assert.ok(checked.ok && checked.value.status === 'failed');
  return checked.value;
}
function failure(result: ScanOutcome, error: string, persisted: boolean, cleanupFailed: boolean): FailedRun {
  assert.equal(result.ok, false);
  assert.equal(result.error, error);
  assert.equal(result.persisted, persisted);
  assert.equal(result.cleanupFailed, cleanupFailed);
  assert.ok(result.run);
  const checked = validateRun(result.run);
  assert.ok(checked.ok && checked.value.status === 'failed');
  return result.run;
}
function noRun(error: string, cleanupFailed = false) {
  return { ok: false, error, run: null, persisted: false, cleanupFailed };
}
function health(status: 'ready' | 'stopping', busy: boolean, scan = false) {
  return { status, busy, capabilities: { readRuns: true, scan } };
}
type Reply = { status: number; headers: http.IncomingHttpHeaders; text: string; body: unknown };
function get(url: string, target = '/api/health', method = 'GET'): Promise<Reply> {
  const address = new URL(url);
  return new Promise((resolve, reject) => {
    const request = http.request({ hostname: address.hostname, port: address.port, path: target, method,
      agent: false, signal: AbortSignal.timeout(5000) }, response => {
      let text = '';
      response.setEncoding('utf8');
      response.on('data', (chunk: string) => { text += chunk; if (Buffer.byteLength(text) > 65536) request.destroy(new Error('HTTP output overflow')); });
      response.on('error', reject);
      response.on('end', () => {
        try { resolve({ status: response.statusCode!, headers: response.headers, text, body: text ? JSON.parse(text) : undefined }); }
        catch (error) { reject(error); }
      });
    });
    request.on('error', reject);
    request.end();
  });
}
function headers(reply: Reply): void {
  assert.equal(reply.headers['content-type'], 'application/json;charset=utf-8');
  assert.equal(reply.headers['cache-control'], 'no-store');
  assert.equal(reply.headers['x-content-type-options'], 'nosniff');
  assert.equal(reply.headers['set-cookie'], undefined);
  assert.equal(Object.keys(reply.headers).some(key => key.startsWith('access-control-')), false);
  assert.equal(reply.text.includes(canary), false);
}
async function errorReply(service: LocalService, target: string, status: number, error: string, method = 'GET'): Promise<void> {
  const reply = await get(service.url, target, method);
  headers(reply);
  assert.equal(reply.status, status);
  if (method === 'HEAD') assert.equal(reply.text, '');
  else assert.deepEqual(reply.body, { ok: false, error });
}
async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(5000, () => { socket.destroy(); reject(new Error('Port closure check timed out')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned service port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}
async function captureServer(body: (current: () => http.Server) => Promise<void>): Promise<void> {
  const original = http.createServer;
  let server: http.Server | undefined;
  http.createServer = ((...args: Parameters<typeof http.createServer>) => {
    server = original(...args);
    return server;
  }) as typeof http.createServer;
  try { await body(() => { assert.ok(server); return server; }); }
  finally { http.createServer = original; }
}

test('loopback readiness, exact read boundary, passive stop promises and repeated clean stop', serial, async () => {
  await withSandbox(async box => {
    const store = open(box.runs);
    success(store.create(runningRun('retained')));
    const service = await start(box);
    assert.equal(new URL(service.url).hostname, '127.0.0.1');
    assert.ok(Number(new URL(service.url).port) > 0);
    let stoppingSeen = 0;
    let stoppedSeen = 0;
    const notifications: string[] = [];
    void service.whenStopping.then(() => { stoppingSeen++; notifications.push('stopping'); });
    void service.whenStopped.then(() => { stoppedSeen++; notifications.push('stopped'); });
    await tick();
    assert.equal(stoppingSeen, 0);
    assert.equal(stoppedSeen, 0);
    const ready = await get(service.url);
    headers(ready);
    assert.equal(ready.status, 200);
    assert.deepEqual(ready.body, health('ready', false));
    const read: ReadResult = service.readRun('retained');
    assert.deepEqual(read, { ok: true, run: runningRun('retained'), interrupted: true });
    const reply = await get(service.url, '/api/runs/retained');
    headers(reply);
    assert.equal(reply.status, 200);
    assert.deepEqual(reply.body, read);
    const promise = service.stop();
    assert.strictEqual(promise, service.whenStopped);
    assert.strictEqual(service.stop(), promise);
    assert.deepEqual(service.readRun(null), { ok: false, error: 'stopping' });
    assert.deepEqual(await service.runScan(requestInput(), async () => undefined), noRun('stopping'));
    assert.deepEqual(await within(promise, 6000, 'Clean stop timed out'), stopped);
    await tick();
    assert.deepEqual(notifications, ['stopping', 'stopped']);
    assert.equal(stoppingSeen, 1);
    assert.equal(stoppedSeen, 1);
    await service.whenStopping;
    assert.deepEqual(await service.whenStopped, stopped);
    await portClosed(service.url);
  });
});

test('invalid configuration rejects unknown, accessor, undefined and out-of-range values before effects', serial, async () => {
  await withSandbox(async box => {
    let getterCalls = 0;
    const valid = { runRoot: box.runs, applicationRevision: revision };
    const cases: unknown[] = [null, [], {}, { ...valid, extra: canary }, { ...valid, applicationRevision: 'B'.repeat(40) },
      { ...valid, applicationRevision: revision + '\n' }, { ...valid, applicationRevision: '' },
      ...[undefined, -1, 65536, 1.5, '0', NaN].map(port => ({ ...valid, port })),
      ...[undefined, 0, -1, 2147483648, 1.5, '5000', Infinity].map(stopTimeoutMs => ({ ...valid, stopTimeoutMs })),
      Object.defineProperty({ ...valid }, 'port', { enumerable: true, get() { getterCalls++; return 0; } }),
      Object.defineProperty({ ...valid }, 'applicationRevision', { enumerable: true, get() { getterCalls++; return revision; } })];
    const original = http.createServer;
    let listeners = 0;
    http.createServer = ((...args: Parameters<typeof http.createServer>) => { listeners++; return original(...args); }) as typeof http.createServer;
    try {
      for (const input of cases) {
        const result: StartResult = await startLocalService(input as ServiceOptions);
        assert.deepEqual(result, { ok: false, error: 'invalid-configuration' });
        assert.equal(fs.existsSync(box.runs), false);
      }
      assert.equal(listeners, 0);
      assert.equal(getterCalls, 0);
    } finally { http.createServer = original; }
  });
});

test('storage failure and occupied loopback port report bounded startup failure', serial, async () => {
  await withSandbox(async box => {
    success(open(box.runs).create(runningRun('blocked-root')));
    assert.deepEqual(await startLocalService({ runRoot: path.join(box.runs, 'blocked-root', 'run.json'), applicationRevision: revision }),
      { ok: false, error: 'storage-unavailable' });
    const first = await start(box, { stopTimeoutMs: 2147483647 });
    const result: StartResult = await startLocalService({ runRoot: box.runs, applicationRevision: revision, port: Number(new URL(first.url).port) });
    assert.deepEqual(result, { ok: false, error: 'listen-failed' });
    assert.deepEqual((await get(first.url)).body, health('ready', false));
  });
});

test('HTTP precedence rejects methods, literal queries, invalid IDs and all nonapplication paths', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']) {
      await errorReply(service, '/api/health?' + canary, 405, 'method-not-allowed', method);
    }
    for (const target of ['/api/health?', '/api/health#' + canary, '/missing?' + canary]) {
      await errorReply(service, target, 400, 'invalid-request');
    }
    for (const target of ['/api/runs/', '/api/runs/a/b', '/api/runs/%72etained', '/api/runs/..', '/api/runs/CON', '/api/runs/a%2fb']) {
      await errorReply(service, target, 400, 'invalid-id');
    }
    await errorReply(service, '/api/runs/missing', 404, 'not-found');
    for (const target of ['/', '/api/health/', '/api/runs', '/README.md', '/data/runs/', '/api/configuration', '/api/stop', '/api/analyze']) {
      await errorReply(service, target, 404, 'not-found');
    }
    assert.deepEqual(service.readRun(undefined), { ok: false, error: 'invalid-id' });
  });
});

test('reads revalidate disk, distinguish terminal state and map failures without rejected-content disclosure', serial, async () => {
  await withSandbox(async box => {
    const store = open(box.runs);
    for (const id of ['complete', 'corrupt', 'version', 'identity', 'CaseSensitive', 'read-error']) success(store.create(runningRun(id)));
    success(store.finish(completedRun('complete')));
    fs.writeFileSync(path.join(box.runs, 'corrupt', 'run.json'), canary);
    fs.writeFileSync(path.join(box.runs, 'version', 'run.json'), JSON.stringify({ ...runningRun('version'), formatVersion: 2, extra: canary }));
    fs.writeFileSync(path.join(box.runs, 'identity', 'run.json'), JSON.stringify(runningRun('other')));
    const service = await start(box);
    assert.deepEqual(service.readRun('complete'), { ok: true, run: completedRun('complete'), interrupted: false });
    for (const id of ['corrupt', 'version']) await errorReply(service, '/api/runs/' + id, 500, 'invalid-run');
    for (const id of ['identity', 'casesensitive']) await errorReply(service, '/api/runs/' + id, 500, 'stored-run-unavailable');
    const original = fs.readFileSync;
    fs.readFileSync = ((...args: Parameters<typeof fs.readFileSync>) => {
      if (String(args[0]) === path.join(box.runs, 'read-error', 'run.json')) throw new Error(canary);
      return original(...args);
    }) as typeof fs.readFileSync;
    try { await errorReply(service, '/api/runs/read-error', 500, 'read-failed'); }
    finally { fs.readFileSync = original; }
    assert.deepEqual(bytes(box.runs, 'complete'), Buffer.from(JSON.stringify(completedRun('complete'), null, 2) + '\n'));
  });
});

test('HTTP refuses a hard-linked canonical record as stored-run-unavailable', serial, async () => {
  await withSandbox(async box => {
    const caseRoot = path.join(box.root, 'cases', 'unsafe');
    const runs = path.join(caseRoot, 'runs');
    success(open(runs).create(runningRun('linked')));
    const canonical = path.join(runs, 'linked', 'run.json');
    const target = path.join(caseRoot, 'hardlink-target.json');
    fs.writeFileSync(target, bytes(runs, 'linked'), { flag: 'wx' });
    fs.unlinkSync(canonical);
    fs.linkSync(target, canonical);
    try {
      const service = await start(box, { runRoot: runs });
      await errorReply(service, '/api/runs/linked', 500, 'stored-run-unavailable');
      assert.deepEqual(service.readRun('linked'), { ok: false, error: 'stored-run-unavailable' });
      assert.deepEqual(await service.stop(), stopped);
    } finally {
      assert.equal(path.dirname(canonical), path.join(runs, 'linked'));
      ordinaryAncestors(path.dirname(canonical));
      const link = fs.lstatSync(canonical);
      const ownedTarget = fs.lstatSync(target);
      assert.ok(link.isFile() && !link.isSymbolicLink() && link.nlink === 2);
      assert.equal(link.ino, ownedTarget.ino);
      assert.equal(link.dev, ownedTarget.dev);
      fs.unlinkSync(canonical);
    }
  });
});

for (const mode of ['local', 'groq'] as const) {
  for (const kind of ['populated', 'zero', 'incomplete', 'unavailable'] as const) {
    test(`service owns ${mode} ${kind} creation and commits the complete detached collaborator result`, serial, async () => {
      await withSandbox(async box => {
        const service = await start(box);
        const input = requestInput(mode);
        const inputBefore = structuredClone(input);
        const before = Date.now();
        let received: RunningRun | undefined;
        let returned: CompletedRun | undefined;
        const result: ScanOutcome = await service.runScan(input, async (run: RunningRun, signal: AbortSignal) => {
          received = run;
          assert.ok(signal instanceof AbortSignal && !signal.aborted);
          assert.equal(run.status, 'running');
          assert.equal(run.formatVersion, 1);
          assert.equal(run.applicationRevision, revision);
          assert.match(run.runId, /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/);
          assert.ok(Date.parse(run.createdAt) >= before && Date.parse(run.createdAt) <= Date.now());
          assert.notStrictEqual(run.providerContext, input.providerContext);
          assert.notStrictEqual(run.scanContext, input.scanContext);
          assert.deepEqual(disk(box.runs, run.runId), run, 'Running must be durable before collaborator invocation');
          returned = complete(run, kind);
          return returned;
        });
        assert.ok(result.ok && received && returned);
        assert.deepEqual(input, inputBefore);
        assert.deepEqual(result.run, returned);
        assert.notStrictEqual(result.run, returned);
        assert.deepEqual(disk(box.runs, received.runId), result.run);
        assert.deepEqual(service.readRun(received.runId), { ok: true, run: result.run, interrupted: false });
        const again: ScanOutcome = await service.runScan(requestInput(mode), async (run: RunningRun) => complete(run, 'zero'));
        assert.ok(again.ok);
        assert.notEqual(again.run.runId, received.runId);
        assert.deepEqual(disk(box.runs, received.runId), result.run);
      });
    });
  }
}

test('invalid scan requests have no creation, callback, provider default or getter effects', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    let getters = 0;
    let calls = 0;
    const execute = async () => { calls++; return undefined; };
    const valid = requestInput();
    const cases: unknown[] = [null, [], {}, { ...valid, runId: 'injected' }, { ...valid, extra: canary },
      { ...valid, applicationRevision: revision }, { ...valid, requestedUrl: 'http://example.org' },
      { ...valid, providerContext: undefined }, { ...valid, scanContext: {} },
      Object.create(valid), Object.defineProperty({ ...valid }, 'requestedUrl', { enumerable: true, get() { getters++; return valid.requestedUrl; } }),
      { ...valid, scanContext: { ...valid.scanContext, finalUrl: { value: valid.requestedUrl } } },
      { ...valid, scanContext: { ...valid.scanContext, scannedAt: { value: new Date().toISOString() } } },
      { ...valid, scanContext: { ...valid.scanContext, browserVersion: { value: 'observed' } } },
      { ...valid, scanContext: { ...valid.scanContext, readinessReached: true } },
      { ...valid, scanContext: { ...valid.scanContext, cleanup: 'closed' } }];
    for (const input of cases) assert.deepEqual(await service.runScan(input, execute), noRun('invalid-request'));
    assert.deepEqual(await service.runScan(valid, null as unknown as typeof execute), noRun('invalid-request'));
    assert.equal(getters, 0);
    assert.equal(calls, 0);
    assert.deepEqual(fs.readdirSync(box.runs), []);
    assert.deepEqual((await get(service.url)).body, health('ready', false));
  });
});

test('synchronous reservation refuses callback reentry and HTTP contention without queuing or disconnect release', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    const release = deferred<unknown>();
    const entered = deferred<RunningRun>();
    box.release.push(() => release.reject(new Error('Owned test release')));
    let secondCalls = 0;
    let reentry: Promise<ScanOutcome> | undefined;
    const operation: Promise<ScanOutcome> = service.runScan(requestInput(), (run: RunningRun) => {
      entered.resolve(run);
      assert.deepEqual(service.readRun(null), { ok: false, error: 'busy' });
      reentry = service.runScan(requestInput(), async () => { secondCalls++; return undefined; });
      return release.promise;
    });
    const run = await within(entered.promise, 1000, 'Collaborator was not invoked');
    assert.ok(reentry);
    assert.deepEqual(await reentry, noRun('busy'));
    assert.deepEqual((await get(service.url)).body, health('ready', true));
    await errorReply(service, '/api/runs/' + run.runId, 409, 'busy');
    const address = new URL(service.url);
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    await within(new Promise<void>((resolve, reject) => {
      socket.once('error', reject);
      socket.once('connect', () => { socket.write('GET /api/runs/' + run.runId + ' HTTP/1.1\r\nHost: localhost\r\n\r\n'); socket.destroy(); });
      socket.once('close', () => resolve());
    }), 5000, 'Owned disconnect did not close');
    assert.deepEqual(await service.runScan(requestInput(), async () => { secondCalls++; return undefined; }), noRun('busy'));
    assert.equal(secondCalls, 0);
    release.resolve(complete(run));
    const result: ScanOutcome = await operation;
    assert.ok(result.ok);
    assert.deepEqual((await get(service.url)).body, health('ready', false));
  });
});

type Publication = { status: string; record: unknown };
async function withPublicationFault(body: (attempts: Publication[]) => Promise<void>,
  rejectPublication: (status: string, index: number) => boolean, failCleanup = false): Promise<void> {
  const rename = fs.renameSync;
  const unlink = fs.unlinkSync;
  const attempts: Publication[] = [];
  fs.renameSync = ((source: fs.PathLike, destination: fs.PathLike) => {
    const record = JSON.parse(fs.readFileSync(source, 'utf8')) as { status: string };
    attempts.push({ status: record.status, record });
    if (rejectPublication(record.status, attempts.length)) throw new Error(canary);
    rename(source, destination);
  }) as typeof fs.renameSync;
  fs.unlinkSync = ((target: fs.PathLike) => {
    if (failCleanup && String(target).includes('run.json.tmp-')) throw new Error(canary);
    unlink(target);
  }) as typeof fs.unlinkSync;
  try { await body(attempts); }
  finally { fs.renameSync = rename; fs.unlinkSync = unlink; }
}

for (const uncertain of [false, true]) {
  test(`failed running creation has no collaborator or retry, cleanup uncertainty ${uncertain}`, serial, async () => {
    await withSandbox(async box => {
      const service = await start(box);
      let calls = 0;
      await withPublicationFault(async attempts => {
        assert.deepEqual(await service.runScan(requestInput(), async () => { calls++; return undefined; }), noRun('create-failed', uncertain));
        assert.equal(calls, 0);
        assert.deepEqual(attempts.map(item => item.status), ['running']);
        assert.deepEqual((await get(service.url)).body, health(uncertain ? 'stopping' : 'ready', uncertain));
        if (uncertain) {
          assert.deepEqual(await service.runScan(requestInput(), async () => undefined), noRun('stopping'));
          assert.deepEqual(service.readRun('any'), { ok: false, error: 'stopping' });
        } else assert.deepEqual(fs.readdirSync(box.runs), []);
      }, () => true, uncertain);
      assert.deepEqual(await service.stop(), uncertain ? stopFailed : stopped);
    });
  });
}

for (const cause of ['creation cleanup uncertainty', 'settled collaborator cleanup uncertainty'] as const) {
  test(`M102-SERVICE-F01 ${cause} closes admission without announcing shutdown`, serial, async () => {
    await withSandbox(async box => {
      const service = await start(box);
      const notifications: string[] = [];
      void service.whenStopping.then(() => notifications.push('stopping'));
      void service.whenStopped.then(() => notifications.push('stopped'));
      let signal: AbortSignal | undefined;
      if (cause === 'creation cleanup uncertainty') {
        let calls = 0;
        await withPublicationFault(async attempts => {
          assert.deepEqual(await service.runScan(requestInput(), async () => { calls++; return undefined; }), noRun('create-failed', true));
          assert.equal(calls, 0);
          assert.deepEqual(attempts.map(item => item.status), ['running']);
        }, () => true, true);
      } else {
        const outcome = await service.runScan(requestInput(), async (run: RunningRun, ownedSignal: AbortSignal) => {
          signal = ownedSignal;
          ownedSignal.addEventListener('abort', () => {
            queueMicrotask(() => notifications.push('abort observed'));
          }, { once: true });
          return failRun(run, 'failed');
        });
        failure(outcome, 'scan-failed', true, true);
        assert.ok(signal);
        assert.equal(signal.aborted, false);
      }
      const reply = await get(service.url);
      headers(reply);
      assert.equal(reply.status, 200, 'The owned listener remains available before explicit stop');
      assert.deepEqual(reply.body, health('stopping', true));
      assert.deepEqual(service.readRun('any'), { ok: false, error: 'stopping' });
      assert.deepEqual(await service.runScan(requestInput(), async () => undefined), noRun('stopping'));
      await tick();
      assert.deepEqual(notifications, [], 'Admission closure must not announce actual shutdown');

      const terminal = service.stop();
      assert.strictEqual(terminal, service.whenStopped);
      assert.strictEqual(service.stop(), terminal);
      await service.whenStopping;
      assert.deepEqual(await within(terminal, 6000, 'Explicit stop after cleanup uncertainty timed out'), stopFailed);
      await tick();
      assert.deepEqual(notifications, cause === 'creation cleanup uncertainty'
        ? ['stopping', 'stopped'] : ['stopping', 'abort observed', 'stopped']);
      await portClosed(service.url);
    });
  });
}

const badTerminals: Array<[string, (run: RunningRun) => unknown]> = [
  ['nonterminal', run => run],
  ['malformed', () => ({ extra: canary })],
  ['different identity', run => ({ ...complete(run), runId: 'other' })],
  ['changed common context', run => ({ ...complete(run), requestedUrl: 'https://example.org/changed' })],
  ['changed mode', run => ({ ...complete(run), providerContext: runningRun('other', 'groq').providerContext })],
  ['changed policy', run => { const value = complete(run); return { ...value, scan: { ...value.scan, context: { ...value.scan.context, timeoutMs: 999 } } }; }],
  ['invalid observed fact', run => { const value = complete(run); return { ...value, scan: { ...value.scan, context: { ...value.scan.context, scannedAt: { value: 'not-time' } } } }; }],
  ['extra rejected content', run => ({ ...complete(run), extra: canary })],
];
for (const [name, terminal] of badTerminals) {
  test(`invalid collaborator result (${name}) uses original context and closes uncertain admission`, serial, async () => {
    await withSandbox(async box => {
      const service = await start(box);
      let original: RunningRun | undefined;
      await withPublicationFault(async attempts => {
        const outcome: ScanOutcome = await service.runScan(requestInput(), async (run: RunningRun) => { original = run; return terminal(run); });
        const failed = failure(outcome, 'result-validation', true, true);
        assert.ok(original);
        assert.deepEqual(failed.scanContext, { ...original.scanContext, cleanup: 'failed' });
        assert.deepEqual(failed.failure, { category: 'result-validation' });
        assert.deepEqual(disk(box.runs, failed.runId), failed);
        assert.deepEqual(attempts.map(item => item.status), ['running', 'failed']);
        assert.equal(JSON.stringify(outcome).includes(canary), false);
        assert.deepEqual((await get(service.url)).body, health('stopping', true));
        await errorReply(service, '/missing', 503, 'stopping');
        await errorReply(service, '/missing?' + canary, 400, 'invalid-request');
        await errorReply(service, '/missing', 405, 'method-not-allowed', 'POST');
      }, () => false);
      assert.deepEqual(await service.stop(), stopFailed);
    });
  });
}

for (const synchronous of [true, false]) {
  for (const publicationFails of [false, true]) {
    test(`callback ${synchronous ? 'throw' : 'rejection'}, failure publication ${publicationFails ? 'fails' : 'succeeds'}`, serial, async () => {
      await withSandbox(async box => {
        const service = await start(box);
        let run: RunningRun | undefined;
        await withPublicationFault(async attempts => {
          const outcome: ScanOutcome = await service.runScan(requestInput(), (value: RunningRun) => {
            run = value;
            if (synchronous) throw new Error(canary);
            return Promise.reject(new Error(canary));
          });
          const failed = failure(outcome, 'scan-failed', !publicationFails, true);
          assert.ok(run);
          assert.deepEqual(failed.failure, { category: 'scanner' });
          assert.deepEqual(failed.scanContext, { ...run.scanContext, cleanup: 'failed' });
          assert.deepEqual(disk(box.runs, run.runId), publicationFails ? run : failed);
          assert.deepEqual(attempts.map(item => item.status), ['running', 'failed']);
          assert.equal(JSON.stringify(outcome).includes(canary), false);
        }, status => publicationFails && status === 'failed');
        assert.deepEqual(await service.stop(), stopFailed);
      });
    });
  }
}

test('failed result-validation publication preserves the original error and running bytes without fallback', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    let original: RunningRun | undefined;
    await withPublicationFault(async attempts => {
      const outcome: ScanOutcome = await service.runScan(requestInput(), async (run: RunningRun) => {
        original = run;
        return { extra: canary };
      });
      const failed = failure(outcome, 'result-validation', false, true);
      assert.ok(original);
      assert.deepEqual(failed.failure, { category: 'result-validation' });
      assert.deepEqual(disk(box.runs, original.runId), original);
      assert.deepEqual(attempts.map(item => item.status), ['running', 'failed']);
    }, status => status === 'failed');
    assert.deepEqual(await service.stop(), stopFailed);
  });
});

for (const cleanup of ['closed', 'failed'] as const) {
  for (const publicationFails of [false, true]) {
    test(`valid failed terminal preserves exact record, cleanup ${cleanup}, persistence failure ${publicationFails}`, serial, async () => {
      await withSandbox(async box => {
        const service = await start(box);
        let original: RunningRun | undefined;
        let returned: FailedRun | undefined;
        await withPublicationFault(async attempts => {
          const outcome: ScanOutcome = await service.runScan(requestInput(), async (run: RunningRun) => {
            original = run; returned = failRun(run, cleanup); return returned;
          });
          const failed = failure(outcome, 'scan-failed', !publicationFails, cleanup === 'failed');
          assert.ok(original && returned);
          assert.deepEqual(failed, returned);
          assert.notStrictEqual(failed, returned);
          assert.deepEqual(disk(box.runs, original.runId), publicationFails ? original : returned);
          assert.deepEqual(attempts.map(item => item.status), ['running', 'failed']);
        }, status => publicationFails && status === 'failed');
        if (cleanup === 'closed') {
          assert.deepEqual((await get(service.url)).body, health('ready', false));
          const next: ScanOutcome = await service.runScan(requestInput(), async (run: RunningRun) => complete(run));
          assert.ok(next.ok, 'Settled closed failure must release ordinary admission even when it was not retained');
        } else assert.deepEqual((await get(service.url)).body, health('stopping', true));
        assert.deepEqual(await service.stop(), cleanup === 'closed' ? stopped : stopFailed);
      });
    });
  }
}

for (const fallbackFails of [false, true]) {
  for (const cleanupUncertain of [false, true]) {
    test(`complete publication failure allows exactly one failure attempt; fallback failure ${fallbackFails}, cleanup uncertainty ${cleanupUncertain}`, serial, async () => {
      await withSandbox(async box => {
        const service = await start(box);
        let original: RunningRun | undefined;
        let terminal: CompletedRun | undefined;
        await withPublicationFault(async attempts => {
          const outcome: ScanOutcome = await service.runScan(requestInput(), async (run: RunningRun) => {
            original = run; terminal = complete(run, 'populated', 60000); return terminal;
          });
          const failed = failure(outcome, 'initial-persistence', !fallbackFails, cleanupUncertain);
          assert.ok(original && terminal);
          assert.deepEqual(failed.failure, { category: 'initial-persistence' });
          assert.deepEqual(failed.scanContext, terminal.scan.context);
          assert.equal(failed.finishedAt, terminal.finishedAt, 'Authored failure must retain the future valid terminal chronology');
          assert.equal('scan' in failed, false);
          assert.deepEqual(disk(box.runs, failed.runId), fallbackFails ? original : failed);
          assert.deepEqual(attempts.map(item => item.status), ['running', 'completed', 'failed']);
          assert.equal(JSON.stringify(outcome).includes(canary), false);
        }, status => status === 'completed' || (fallbackFails && status === 'failed'), cleanupUncertain);
        assert.deepEqual((await get(service.url)).body, health(cleanupUncertain ? 'stopping' : 'ready', cleanupUncertain));
        assert.deepEqual(await service.stop(), cleanupUncertain ? stopFailed : stopped);
      });
    });
  }
}

test('explicit valid policy values are preserved without scanner or provider defaults', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    const base = requestInput('groq');
    const input = { ...base, scanContext: { ...base.scanContext, timeoutMs: 12345,
      viewport: { ...base.scanContext.viewport, width: 997 }, locale: 'es-CO' } };
    const result: ScanOutcome = await service.runScan(input, async (run: RunningRun) => {
      assert.deepEqual(run.scanContext, input.scanContext);
      assert.deepEqual(run.providerContext, input.providerContext);
      return complete(run);
    });
    assert.ok(result.ok);
    assert.equal(result.run.scan.context.timeoutMs, 12345);
  });
});

const settlements: Array<[string, (run: RunningRun) => unknown, boolean]> = [
  ['completed closed', run => complete(run, 'populated', 60000), false],
  ['failed closed', run => failRun(run), false],
  ['failed cleanup', run => failRun(run, 'failed'), true],
  ['rejection', () => { throw new Error(canary); }, true],
  ['malformed', () => ({ extra: canary }), true],
  ['nonterminal', run => run, true],
  ['mutated policy', run => { const value = complete(run); return { ...value, scan: { ...value.scan, context: { ...value.scan.context, locale: 'fr-FR' } } }; }, true],
];
for (const late of [false, true]) {
  for (const [name, settle, uncertain] of settlements) {
    test(`shutdown ${late ? 'after deadline' : 'before deadline'} with ${name} selects only validated context`, serial, async () => {
      await withSandbox(async box => {
        const service = await start(box, { stopTimeoutMs: late ? 30 : 5000 });
        const pending = deferred<unknown>();
        const entered = deferred<RunningRun>();
        box.release.push(() => pending.reject(new Error('Owned test release')));
        await withPublicationFault(async attempts => {
          let operationSettled = false;
          const operation: Promise<ScanOutcome> = service.runScan(requestInput(), (run: RunningRun) => { entered.resolve(run); return pending.promise; });
          void operation.then(() => { operationSettled = true; });
          const run = await entered.promise;
          const stop = service.stop();
          assert.strictEqual(stop, service.whenStopped);
          assert.deepEqual(service.readRun(run.runId), { ok: false, error: 'stopping' });
          if (late) {
            assert.deepEqual(await within(stop, 1000, 'Stop deadline did not settle'), stopFailed);
            assert.equal(operationSettled, false, 'Deadline must not pretend the collaborator has settled');
            assert.deepEqual(attempts.map(item => item.status), ['running']);
          }
          let terminal: unknown;
          try { terminal = settle(run); pending.resolve(terminal); }
          catch (error) { pending.reject(error); }
          const outcome: ScanOutcome = await within(operation, 5000, 'Settled collaborator was not observed');
          const failed = failure(outcome, 'shutdown', !late, uncertain);
          assert.deepEqual(failed.failure, { category: 'shutdown' });
          const checked = validateRun(terminal);
          if (checked.ok && checked.value.status !== 'running' && !name.startsWith('mutated')) {
            const context = checked.value.status === 'completed' ? checked.value.scan.context : checked.value.scanContext;
            assert.deepEqual(failed.scanContext, context);
            assert.ok(Date.parse(failed.finishedAt) >= Date.parse(checked.value.finishedAt));
          } else assert.deepEqual(failed.scanContext, { ...run.scanContext, cleanup: 'failed' });
          assert.equal('scan' in failed, false);
          assert.equal(JSON.stringify(outcome).includes(canary), false);
          assert.deepEqual(attempts.map(item => item.status), late ? ['running'] : ['running', 'failed']);
          assert.deepEqual(disk(box.runs, run.runId), late ? run : failed);
          assert.deepEqual(await stop, late || uncertain ? stopFailed : stopped);
          assert.strictEqual(service.stop(), stop);
          assert.deepEqual(await service.runScan(requestInput(), async () => undefined), noRun('stopping'));
          await tick();
          assert.deepEqual(attempts.map(item => item.status), late ? ['running'] : ['running', 'failed']);
          await portClosed(service.url);
        }, () => false);
      });
    });
  }
}

test('shutdown failed-record publication failure keeps original running bytes and fails stop without fallback', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    const entered = deferred<RunningRun>();
    const pending = deferred<unknown>();
    box.release.push(() => pending.reject(new Error('Owned test release')));
    await withPublicationFault(async attempts => {
      const operation: Promise<ScanOutcome> = service.runScan(requestInput(), (run: RunningRun) => { entered.resolve(run); return pending.promise; });
      const run = await entered.promise;
      const stop = service.stop();
      pending.resolve(complete(run));
      failure(await operation, 'shutdown', false, false);
      assert.deepEqual(await stop, stopFailed);
      assert.deepEqual(disk(box.runs, run.runId), run);
      assert.deepEqual(attempts.map(item => item.status), ['running', 'failed']);
    }, status => status === 'failed');
  });
});

test('synchronous callback stop and abort-handler reentry share the already registered operation and stop promise', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    let first: Promise<StopResult> | undefined;
    let fromAbort: Promise<StopResult> | undefined;
    let observedAbort = false;
    let nested: Promise<ScanOutcome> | undefined;
    const result: ScanOutcome = await service.runScan(requestInput(), (run: RunningRun, signal: AbortSignal) => {
      signal.addEventListener('abort', () => {
        observedAbort = true;
        assert.deepEqual(service.readRun(null), { ok: false, error: 'stopping' });
        fromAbort = service.stop();
        nested = service.runScan(requestInput(), async () => undefined);
      }, { once: true });
      first = service.stop();
      assert.ok(signal.aborted);
      return Promise.resolve(complete(run));
    });
    failure(result, 'shutdown', true, false);
    assert.equal(observedAbort, true);
    assert.ok(first && fromAbort && nested);
    assert.strictEqual(first, service.whenStopped);
    assert.strictEqual(fromAbort, first);
    assert.deepEqual(await nested, noRun('stopping'));
    assert.deepEqual(await within(first, 6000, 'Reentrant stop hung'), stopped);
  });
});

test('completion committed before the stop callback remains success and preserves its bytes', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    const result: ScanOutcome = await service.runScan(requestInput(), async (run: RunningRun) => complete(run));
    assert.ok(result.ok);
    const saved = bytes(box.runs, result.run.runId);
    assert.deepEqual(await service.stop(), stopped);
    assert.deepEqual(bytes(box.runs, result.run.runId), saved);
    assert.deepEqual(success(open(box.runs).read(result.run.runId)), result.run);
  });
});

test('synchronous reads hold admission throughout the real repository read', serial, async () => {
  await withSandbox(async box => {
    success(open(box.runs).create(runningRun('retained')));
    const service = await start(box);
    const original = fs.readFileSync;
    let nested: Promise<ScanOutcome> | undefined;
    let reentered = false;
    fs.readFileSync = ((...args: Parameters<typeof fs.readFileSync>) => {
      if (!reentered && String(args[0]) === path.join(box.runs, 'retained', 'run.json')) {
        reentered = true;
        assert.deepEqual(service.readRun('retained'), { ok: false, error: 'busy' });
        nested = service.runScan(requestInput(), async () => undefined);
      }
      return original(...args);
    }) as typeof fs.readFileSync;
    try {
      assert.deepEqual(service.readRun('retained'), { ok: true, run: runningRun('retained'), interrupted: true });
      assert.ok(nested);
      assert.deepEqual(await nested, noRun('busy'));
    } finally { fs.readFileSync = original; }
    assert.deepEqual((await get(service.url)).body, health('ready', false));
  });
});

test('CONNECT and upgrade sockets are destroyed without application JSON; stop also closes idle connections', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    const address = new URL(service.url);
    for (const message of ['CONNECT example.org:443 HTTP/1.1\r\nHost: localhost\r\n\r\n',
      'GET /api/health HTTP/1.1\r\nHost: localhost\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n\r\n']) {
      const socket = net.connect({ host: address.hostname, port: Number(address.port) });
      let output = '';
      try {
        await within(new Promise<void>((resolve, reject) => {
          socket.on('data', (chunk: Buffer) => { output += chunk.toString(); });
          socket.on('error', (error: NodeJS.ErrnoException) => { if (error.code !== 'ECONNRESET') reject(error); });
          socket.once('connect', () => socket.write(message));
          socket.once('close', () => resolve());
        }), 5000, 'CONNECT/upgrade remained open');
        assert.equal(output, '');
      } finally { socket.destroy(); }
    }
    const idle = net.connect({ host: address.hostname, port: Number(address.port) });
    const closed = new Promise<void>(resolve => idle.once('close', () => resolve()));
    idle.on('error', () => {});
    try {
      await within(new Promise<void>(resolve => idle.once('connect', resolve)), 5000, 'Idle connection did not connect');
      assert.deepEqual(await service.stop(), stopped);
      await within(closed, 5000, 'Stop left an owned idle connection open');
    } finally { idle.destroy(); }
  });
});

test('runtime listener error starts owned shutdown and permanently forces the passive terminal result to failed', serial, async () => {
  await captureServer(async current => {
    await withSandbox(async box => {
      const stdinBefore = process.stdin.listenerCount('data');
      const sigintBefore = process.listenerCount('SIGINT');
      const sigbreakBefore = process.listenerCount('SIGBREAK');
      const service = await start(box);
      const server = current();
      const address = server.address();
      assert.ok(address && typeof address !== 'string');
      assert.equal(address.address, '127.0.0.1');
      assert.equal(process.stdin.listenerCount('data'), stdinBefore);
      assert.equal(process.listenerCount('SIGINT'), sigintBefore);
      assert.equal(process.listenerCount('SIGBREAK'), sigbreakBefore);
      const notifications: string[] = [];
      void service.whenStopping.then(() => notifications.push('stopping'));
      void service.whenStopped.then(() => notifications.push('stopped'));
      await tick();
      assert.deepEqual(notifications, []);
      server.emit('error', new Error(canary));
      assert.deepEqual(service.readRun(null), { ok: false, error: 'stopping' });
      assert.strictEqual(service.stop(), service.whenStopped);
      assert.deepEqual(await within(service.whenStopped, 6000, 'Runtime-error stop hung'), stopFailed);
      await tick();
      assert.deepEqual(notifications, ['stopping', 'stopped']);
      assert.equal(server.listening, false);
      await portClosed(service.url);
      server.emit('error', new Error(canary));
      assert.deepEqual(await service.whenStopped, stopFailed);
      await tick();
      assert.deepEqual(notifications, ['stopping', 'stopped']);
    });
  });
});

test('listener error during stop overrides a successfully committed shutdown record', serial, async () => {
  await captureServer(async current => {
    await withSandbox(async box => {
      const service = await start(box);
      const pending = deferred<unknown>();
      const entered = deferred<RunningRun>();
      box.release.push(() => pending.reject(new Error('Owned test release')));
      const operation: Promise<ScanOutcome> = service.runScan(requestInput(), (run: RunningRun) => { entered.resolve(run); return pending.promise; });
      const run = await entered.promise;
      const stopping = service.stop();
      current().emit('error', new Error(canary));
      pending.resolve(complete(run));
      failure(await operation, 'shutdown', true, false);
      assert.deepEqual(await stopping, stopFailed);
    });
  });
});

test('stale listener events cannot change an already clean terminal stop result', serial, async () => {
  await captureServer(async current => {
    await withSandbox(async box => {
      const service = await start(box);
      assert.deepEqual(await service.stop(), stopped);
      current().emit('error', new Error(canary));
      assert.deepEqual(await service.whenStopped, stopped);
      assert.strictEqual(service.stop(), service.whenStopped);
    });
  });
});

function allowedWindowsEnv(): NodeJS.ProcessEnv {
  const result: NodeJS.ProcessEnv = {};
  for (const key of ['SystemRoot', 'WINDIR', 'TEMP', 'TMP']) {
    if (process.env[key] !== undefined) result[key] = process.env[key];
  }
  return result;
}
type ChildRecord = {
  child: ChildProcessWithoutNullStreams;
  spawnedAt: number;
  exited: boolean;
  exit: Promise<{ code: number | null; signal: NodeJS.Signals | null }>;
  drained: Promise<void>;
  output: { stdout: string; stderr: string };
  ready: Promise<string>;
  issue: Promise<never>;
  problem: unknown;
  stopSent: boolean;
};
function entryChild(env: NodeJS.ProcessEnv, listenerError = false): ChildRecord {
  const source = `import http from 'node:http';
const original = http.createServer;
http.createServer = (...args) => {
  const server = original(...args);
  server.once('listening', () => setImmediate(() => server.emit('error', new Error(${JSON.stringify(canary)}))));
  return server;
};
await import(${JSON.stringify(pathToFileURL(path.join(repo, 'src/server/main.ts')).href)});`;
  const spawnedAt = Date.now();
  const child = spawn(process.execPath, listenerError ? ['--input-type=module', '--eval', source] : ['src/server/main.ts'],
    { cwd: repo, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'], env });
  const exit = deferred<{ code: number | null; signal: NodeJS.Signals | null }>();
  const drained = deferred<void>();
  const ready = deferred<string>();
  const issue = deferred<never>();
  // A later race observes failures; attaching handlers now prevents detached rejection warnings.
  void issue.promise.catch(() => {});
  void ready.promise.catch(() => {});
  void exit.promise.catch(() => {});
  const record: ChildRecord = { child, spawnedAt, exited: false, exit: exit.promise, drained: drained.promise,
    output: { stdout: '', stderr: '' }, ready: ready.promise, issue: issue.promise, problem: undefined, stopSent: false };
  function report(error: unknown): void { record.problem ??= error; issue.reject(error); }
  child.once('exit', (code, signal) => { record.exited = true; exit.resolve({ code, signal }); });
  child.once('close', () => drained.resolve());
  child.once('error', error => { report(error); exit.reject(error); ready.reject(error); });
  child.stdin.on('error', error => { if (!record.exited) report(error); });
  let stdoutLine = '';
  for (const name of ['stdout', 'stderr'] as const) {
    child[name].setEncoding('utf8');
    child[name].on('data', (chunk: string) => {
      if (Buffer.byteLength(record.output.stdout) + Buffer.byteLength(record.output.stderr) + Buffer.byteLength(chunk) > 65536) {
        report(new Error('Owned child output exceeded 64 KiB'));
        return;
      }
      record.output[name] += chunk;
      if (name === 'stdout') {
        stdoutLine += chunk;
        while (stdoutLine.includes('\n')) {
          const index = stdoutLine.indexOf('\n');
          const line = stdoutLine.slice(0, index).replace(/\r$/, '');
          stdoutLine = stdoutLine.slice(index + 1);
          try {
            const event = JSON.parse(line) as { event?: unknown; url?: unknown };
            if (event.event === 'service-ready') {
              assert.equal(typeof event.url, 'string');
              assert.deepEqual(Object.keys(event).sort(), ['event', 'url']);
              ready.resolve(event.url as string);
            }
          } catch (error) { report(error); }
        }
      }
    });
  }
  return record;
}
async function childReady(record: ChildRecord): Promise<string> {
  const url = await within(Promise.race([record.ready, record.issue]), Math.max(1, 10000 - (Date.now() - record.spawnedAt)), 'Entry readiness deadline expired');
  assert.equal(record.problem, undefined);
  return url;
}
function sendStop(record: ChildRecord, line = 'stop\n'): void {
  record.stopSent = true;
  record.child.stdin.write(line);
}
async function childExit(record: ChildRecord, expected: number): Promise<void> {
  const exit = await within(Promise.race([record.exit, record.issue]), 10000, 'Entry exit deadline expired');
  assert.equal(exit.signal, null);
  assert.equal(exit.code, expected);
  await within(record.drained, 1000, 'Exited child output did not close');
  assert.equal(record.problem, undefined);
}
async function cleanupChild(record: ChildRecord, box: Sandbox): Promise<void> {
  if (record.exited) return;
  if (!record.stopSent && record.child.stdin.writable) sendStop(record);
  try { await within(record.exit, 10000, 'Owned child did not stop during cleanup'); }
  catch {
    if (record.exited) return;
    record.child.kill();
    try { await within(record.exit, 5000, 'Owned child exit remains unconfirmed'); }
    catch (error) { box.preserve = true; throw error; }
    throw new Error('Forced termination of owned child is failed-stop evidence');
  }
}
function events(text: string): unknown[] {
  assert.ok(text === '' || text.endsWith('\n'), 'Diagnostics must be newline-delimited JSON');
  assert.equal(text.includes(canary), false);
  return text.trim() ? text.trim().split(/\r?\n/).map(line => JSON.parse(line)) : [];
}
async function withEntry(box: Sandbox, body: (record: ChildRecord) => Promise<void>,
  environment: NodeJS.ProcessEnv = { ...allowedWindowsEnv(), A11Y_APPLICATION_REVISION: revision, A11Y_PORT: '0' }, listenerError = false): Promise<void> {
  const record = entryChild(environment, listenerError);
  const errors: unknown[] = [];
  try { await body(record); } catch (error) { errors.push(error); }
  try { await cleanupChild(record, box); } catch (error) { errors.push(error); }
  if (errors.length) throw new AggregateError(errors, 'Entry verification or owned-child cleanup failed');
}
async function fetchEntry(url: string, target: string): Promise<unknown> {
  const response = await fetch(url + target, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200);
  return response.json();
}

test('M102 entry-point reopen and exact deletion', serial, async () => {
  await withSandbox(async box => {
    const before = fs.existsSync(applicationRuns) ? fs.readdirSync(applicationRuns).sort() : [];
    const ids = [`m102-demo-${randomUUID()}`, `m102-demo-${randomUUID()}`];
    const owned: string[] = [];
    fs.mkdirSync(path.join(box.root, 'corpus'));
    const sentinel = path.join(box.root, 'corpus', 'marker.txt');
    fs.writeFileSync(sentinel, 'Synthetic corpus boundary', { flag: 'wx' });
    const sentinelBytes = fs.readFileSync(sentinel);
    function deleteOwned(id: string): void {
      assert.ok(owned.includes(id));
      assert.match(id, /^m102-demo-[0-9a-f-]{36}$/);
      const target = path.resolve(applicationRuns, id);
      assert.equal(path.dirname(target), applicationRuns);
      ordinaryAncestors(target);
      assert.equal(fs.readdirSync(applicationRuns).find(name => name.toLowerCase() === id.toLowerCase()), id);
      assert.equal(fs.realpathSync(target).toLowerCase(), target.toLowerCase());
      assert.deepEqual(fs.readdirSync(target), ['run.json']);
      ordinaryInventory(target);
      fs.rmSync(target, { recursive: true, force: false });
      owned.splice(owned.indexOf(id), 1);
    }
    const errors: unknown[] = [];
    try {
      const store = open(applicationRuns);
      for (const id of ids) {
        assert.equal(before.includes(id), false);
        success(store.create(runningRun(id)));
        owned.push(id);
        success(store.finish(completedRun(id)));
      }
      const firstBytes = bytes(applicationRuns, ids[0]);
      const secondBytes = bytes(applicationRuns, ids[1]);
      for (let index = 0; index < 2; index++) {
        await withEntry(box, async record => {
          const url = await childReady(record);
          assert.equal(new URL(url).hostname, '127.0.0.1');
          assert.deepEqual(await fetchEntry(url, '/api/health'), health('ready', false, true));
          assert.deepEqual(await fetchEntry(url, '/api/runs/' + ids[0]), { ok: true, run: completedRun(ids[0]), interrupted: false });
          sendStop(record);
          await childExit(record, 0);
          assert.deepEqual(events(record.output.stdout), [{ event: 'service-ready', url }, { event: 'service-stopped' }]);
          assert.deepEqual(events(record.output.stderr), []);
          await portClosed(url);
        });
      }
      assert.deepEqual(bytes(applicationRuns, ids[0]), firstBytes);
      assert.deepEqual(bytes(applicationRuns, ids[1]), secondBytes);
      deleteOwned(ids[0]);
      assert.deepEqual(bytes(applicationRuns, ids[1]), secondBytes);
      assert.deepEqual(fs.readFileSync(sentinel), sentinelBytes);
      assert.deepEqual(fs.readdirSync(applicationRuns).filter(name => name !== ids[1]).sort(), before);
      deleteOwned(ids[1]);
      assert.deepEqual(fs.readdirSync(applicationRuns).sort(), before);
      assert.deepEqual(fs.readFileSync(sentinel), sentinelBytes);
    } catch (error) { errors.push(error); }
    try {
      assert.equal(box.preserve, false, 'Do not remove records while owned-child exit is unconfirmed');
      for (const id of [...owned]) deleteOwned(id);
      assert.deepEqual(fs.readdirSync(applicationRuns).sort(), before);
    } catch (error) { errors.push(error); }
    if (errors.length) throw new AggregateError(errors, 'Exact entry-point/deletion proof failed');
  });
});

test('real entry ignores non-stop lines without echo, accepts CRLF stop, and supports EOF', serial, async () => {
  await withSandbox(async box => {
    for (const channel of ['line', 'eof']) {
      await withEntry(box, async record => {
        const url = await childReady(record);
        record.child.stdin.write(canary + '\r\n stop\nstop \r\n');
        assert.deepEqual(await fetchEntry(url, '/api/health'), health('ready', false, true));
        if (channel === 'line') sendStop(record, 'stop\r\n');
        else { record.stopSent = true; record.child.stdin.end(); }
        await childExit(record, 0);
        assert.deepEqual(events(record.output.stdout), [{ event: 'service-ready', url }, { event: 'service-stopped' }]);
        assert.deepEqual(events(record.output.stderr), []);
        await portClosed(url);
      }, { ...allowedWindowsEnv(), A11Y_APPLICATION_REVISION: revision });
    }
  });
});

test('real entry rejects invalid revision and port text with only the bounded startup diagnostic', serial, async () => {
  await withSandbox(async box => {
    const cases: NodeJS.ProcessEnv[] = [
      {}, { A11Y_APPLICATION_REVISION: canary }, { A11Y_APPLICATION_REVISION: 'B'.repeat(40) },
      ...['', '00', '+1', '-1', ' 0', '0 ', '1\n', '65536', '1.5'].map(A11Y_PORT => ({ A11Y_APPLICATION_REVISION: revision, A11Y_PORT })),
    ];
    const before = fs.existsSync(applicationRuns) ? fs.readdirSync(applicationRuns).sort() : null;
    for (const extra of cases) {
      await withEntry(box, async record => {
        await childExit(record, 1);
        assert.deepEqual(events(record.output.stdout), []);
        assert.deepEqual(events(record.output.stderr), [{ event: 'service-startup-failed', error: 'invalid-configuration' }]);
        assert.deepEqual(fs.existsSync(applicationRuns) ? fs.readdirSync(applicationRuns).sort() : null, before);
      }, { ...allowedWindowsEnv(), ...extra });
    }
  });
});

test('real entry occupied-port startup fails without closing the existing owned listener', serial, async () => {
  await withSandbox(async box => {
    const service = await start(box);
    await withEntry(box, async record => {
      await childExit(record, 1);
      assert.deepEqual(events(record.output.stdout), []);
      assert.deepEqual(events(record.output.stderr), [{ event: 'service-startup-failed', error: 'listen-failed' }]);
      assert.deepEqual((await get(service.url)).body, health('ready', false));
    }, { ...allowedWindowsEnv(), A11Y_APPLICATION_REVISION: revision, A11Y_PORT: new URL(service.url).port });
  });
});

test('real entry observes listener-initiated shutdown with stdin open and emits exactly one failed terminal event', serial, async () => {
  await withSandbox(async box => {
    await withEntry(box, async record => {
      const url = await childReady(record);
      assert.equal(record.stopSent, false, 'No stdin or signal stop request may initiate this shutdown');
      await childExit(record, 1);
      assert.deepEqual(events(record.output.stdout), [{ event: 'service-ready', url }]);
      assert.deepEqual(events(record.output.stderr), [{ event: 'service-stop-failed' }]);
      await portClosed(url);
    }, { ...allowedWindowsEnv(), A11Y_APPLICATION_REVISION: revision, A11Y_PORT: '0' }, true);
  });
});
