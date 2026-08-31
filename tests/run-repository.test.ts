import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import type { TestContext } from 'node:test';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { RunRepository, StoreResult, RunningRun, CompletedRun, FailedRun, TerminalRun } from '../src/server/persistence/run-repository.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { runningRun, completedRun, failedRun } from './helpers/m102-run-fixture.ts';
import type { FixtureMode, FixtureScan } from './helpers/m102-run-fixture.ts';

// M102-STORE-01: one real publish-or-preserve boundary, no service/scanner behavior.
const repo = fileURLToPath(new URL('../', import.meta.url));
const tempParent = path.join(repo, 'temp');
const options = { concurrency: false };
type Sandbox = { root: string; runs: string; junctions: Set<string>; preserve: boolean };
type PublicTypes = [RunningRun, CompletedRun, FailedRun, TerminalRun];
const publicTypes: PublicTypes = [runningRun(), completedRun(), failedRun(), completedRun()];
assert.equal(publicTypes.length, 4);

function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Cleanup ancestor must remain ordinary');
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function inventory(target: string, links: Set<string>): void {
  for (const name of fs.readdirSync(target)) {
    const child = path.join(target, name);
    const stat = fs.lstatSync(child);
    if (stat.isSymbolicLink()) {
      assert.ok(links.has(child), 'Unexpected link: preserve artifacts');
    } else if (stat.isDirectory()) {
      inventory(child, links);
    } else {
      assert.ok(stat.isFile(), 'Unexpected filesystem entry: preserve artifacts');
    }
  }
}

async function withSandbox(body: (sandbox: Sandbox) => void | Promise<void>): Promise<void> {
  ordinaryAncestors(tempParent);
  const root = fs.mkdtempSync(path.join(tempParent, 'm102-store-'));
  const sandbox: Sandbox = { root, runs: path.join(root, 'runs'), junctions: new Set(), preserve: false };
  let failure: unknown;
  try { await body(sandbox); } catch (error) { failure = error; }
  try {
    assert.equal(sandbox.preserve, false, 'Child exit unconfirmed; preserve owned artifacts');
    assert.equal(path.resolve(root), root);
    assert.equal(path.dirname(root), path.resolve(tempParent));
    ordinaryAncestors(root);
    inventory(root, sandbox.junctions);
    for (const junction of sandbox.junctions) {
      assert.ok(path.relative(root, junction).split(path.sep).every(part => part !== '..'));
      assert.ok(fs.lstatSync(junction).isSymbolicLink());
      fs.unlinkSync(junction);
    }
    inventory(root, new Set());
    fs.rmSync(root, { recursive: true, force: false });
  } catch (cleanupError) {
    if (failure !== undefined) throw new AggregateError([failure, cleanupError], 'Test and owned cleanup failed');
    throw cleanupError;
  }
  if (failure !== undefined) throw failure;
}

function success<T>(result: StoreResult<T>): T {
  assert.ok(result.ok, JSON.stringify(result));
  assert.deepEqual(Object.keys(result).sort(), ['ok', 'value']);
  return result.value;
}
function failure(result: StoreResult<unknown>, error: string, cleanupFailed = false): void {
  assert.deepEqual(result, { ok: false, error, cleanupFailed });
}
function open(root: string): RunRepository { return success(openRunRepository(root)); }
function canonical(root: string, id = 'run-01'): string { return path.join(root, id, 'run.json'); }
function bytes(root: string, id = 'run-01'): Buffer { return fs.readFileSync(canonical(root, id)); }
function seed(root: string, id = 'run-01'): { store: RunRepository; before: Buffer } {
  const store = open(root);
  success(store.create(runningRun(id)));
  return { store, before: bytes(root, id) };
}
function deepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.ok(Object.isFrozen(value));
  for (const item of Object.values(value)) deepFrozen(item);
}
function changed(input: unknown, keys: readonly (string | number)[], value: unknown): unknown {
  const clone: unknown = structuredClone(input);
  let current = clone as Record<string | number, unknown>;
  for (const key of keys.slice(0, -1)) current = current[key] as Record<string | number, unknown>;
  current[keys[keys.length - 1]!] = value;
  return clone;
}
function valid(input: unknown): void { assert.ok(validateRun(input).ok, 'Transition candidate must be domain-valid'); }
function residue(root: string, id = 'run-01'): string[] {
  return fs.readdirSync(path.join(root, id)).filter(name => name !== 'run.json');
}
function fault(): never { throw new Error('SYNTHETIC_SECRET path=C:\\private\\input'); }

for (const mode of ['local', 'groq'] as const satisfies readonly FixtureMode[]) {
  for (const kind of ['populated', 'zero', 'incomplete', 'unavailable'] as const satisfies readonly FixtureScan[]) {
    test(`round trip ${mode} ${kind} preserves complete detached immutable records`, options, async () => {
      await withSandbox(({ runs }) => {
        const store = open(runs);
        const input = structuredClone(runningRun('run-01', mode));
        const created = success(store.create(input));
        assert.deepEqual(created, input);
        assert.notStrictEqual(created, input);
        assert.notStrictEqual(created.scanContext, input.scanContext);
        deepFrozen(created);
        assert.deepEqual(bytes(runs), Buffer.from(JSON.stringify(created, null, 2) + '\n'));
        const terminal = structuredClone(completedRun('run-01', mode, kind));
        const finished = success(store.finish(terminal));
        assert.deepEqual(finished, terminal);
        assert.notStrictEqual(finished, terminal);
        deepFrozen(finished);
        const reopened = success(open(runs).read('run-01'));
        assert.deepEqual(reopened, terminal);
        assert.notStrictEqual(reopened, finished);
        deepFrozen(reopened);
        assert.deepEqual(bytes(runs), Buffer.from(JSON.stringify(terminal, null, 2) + '\n'));
        assert.deepEqual(residue(runs), []);
        Reflect.set(input.scanContext.viewport, 'width', 640);
        assert.deepEqual(success(store.read('run-01')), terminal);
      });
    });
  }
}

test('running records reopen as retained data; both failed cleanup states can finish exactly once', options, async () => {
  await withSandbox(({ runs }) => {
    for (const cleanup of ['closed', 'failed'] as const) {
      const id = `run-${cleanup}`;
      const store = open(runs);
      success(store.create(runningRun(id)));
      assert.deepEqual(success(open(runs).read(id)), runningRun(id));
      const terminal = failedRun(id, 'local', cleanup);
      assert.deepEqual(success(store.finish(terminal)), terminal);
      const before = bytes(runs, id);
      failure(store.finish(terminal), 'invalid-transition');
      failure(store.finish(completedRun(id)), 'invalid-transition');
      assert.deepEqual(bytes(runs, id), before);
    }
  });
});

test('all terminal overwrites, common context and sibling changes preserve committed evidence', options, async () => {
  await withSandbox(({ runs }) => {
    const { store } = seed(runs);
    success(store.create(runningRun('sibling')));
    success(store.finish(completedRun('sibling')));
    success(store.finish(completedRun()));
    const before = bytes(runs);
    const sibling = bytes(runs, 'sibling');
    for (const candidate of [
      completedRun(), failedRun(), runningRun(),
      changed(completedRun(), ['scan', 'findings', 0, 'evidence', 'altState'], { value: 'empty' }),
      changed(completedRun(), ['scan', 'findings', 1, 'evidence', 'altState'], { value: 'empty' }),
      changed(completedRun(), ['applicationRevision'], 'b'.repeat(40)),
    ]) {
      valid(candidate);
      failure(store.finish(candidate), 'invalid-transition');
      assert.deepEqual(bytes(runs), before);
      assert.deepEqual(bytes(runs, 'sibling'), sibling);
    }
  });
});

test('rejects invalid schemas without evaluating accessors or creating a directory', options, async () => {
  await withSandbox(({ runs }) => {
    const store = open(runs);
    let getterCalls = 0;
    const accessor = { ...runningRun() };
    Object.defineProperty(accessor, 'runId', { enumerable: true, get() { getterCalls++; return 'run-01'; } });
    for (const candidate of [null, {}, accessor, changed(runningRun(), ['formatVersion'], 2),
      changed(runningRun(), ['extra'], 'SYNTHETIC_SECRET'), changed(runningRun(), ['runId'], '../escape')]) {
      failure(store.create(candidate), 'invalid-run');
      failure(store.finish(candidate), 'invalid-run');
      assert.deepEqual(fs.readdirSync(runs), []);
    }
    assert.equal(getterCalls, 0);
    failure(store.create(completedRun()), 'invalid-transition');
    failure(store.create(failedRun()), 'invalid-transition');
    failure(store.finish(runningRun()), 'invalid-transition');
    assert.deepEqual(fs.readdirSync(runs), []);
  });
});

test('read ID validation and storage device names are closed and effect-free', options, async () => {
  await withSandbox(({ runs }) => {
    const store = open(runs);
    for (const id of [null, 1, {}, '', '.', '..', '../escape', 'a/b', 'a\\b', 'a:b', 'x.', 'x ', 'x\0', 'a'.repeat(65)]) {
      failure(store.read(id), 'invalid-id');
    }
    for (const id of ['CON', 'con', 'PrN', 'AUX', 'nul', ...Array.from({ length: 9 }, (_, n) => `COM${n + 1}`),
      ...Array.from({ length: 9 }, (_, n) => `lpt${n + 1}`)]) {
      failure(store.read(id), 'invalid-id');
      failure(store.create(runningRun(id)), 'invalid-id');
      failure(store.finish(completedRun(id)), 'invalid-id');
    }
    assert.deepEqual(fs.readdirSync(runs), []);
    for (const id of ['COM0', 'COM10', 'LPT0', 'CON-safe', 'a_B-9']) success(store.create(runningRun(id)));
  });
});

test('case-insensitive claims never inspect or overwrite a colliding run', options, async () => {
  await withSandbox(({ runs }) => {
    const { store, before } = seed(runs, 'Run-One');
    failure(store.create(runningRun('run-one')), 'collision');
    failure(store.create(runningRun('Run-One')), 'collision');
    failure(store.read('run-one'), 'identity-mismatch');
    failure(store.finish(completedRun('run-one')), 'identity-mismatch');
    assert.deepEqual(bytes(runs, 'Run-One'), before);
    fs.writeFileSync(path.join(runs, 'occupied'), 'SYNTHETIC_SECRET');
    failure(store.create(runningRun('OCCUPIED')), 'collision');
    assert.equal(fs.readFileSync(path.join(runs, 'occupied'), 'utf8'), 'SYNTHETIC_SECRET');
  });
});

test('missing root, run and canonical data are not repaired or treated as completed', options, async () => {
  await withSandbox(({ runs }) => {
    const store = open(runs);
    failure(store.read('absent'), 'not-found');
    failure(store.finish(completedRun('absent')), 'not-found');
    fs.mkdirSync(path.join(runs, 'run-01'));
    failure(store.read('run-01'), 'not-found');
    failure(store.finish(completedRun()), 'not-found');
    fs.rmdirSync(path.join(runs, 'run-01'));
    fs.rmdirSync(runs);
    failure(store.read('run-01'), 'not-found');
    failure(store.finish(completedRun()), 'not-found');
    assert.equal(fs.existsSync(runs), false);
  });
});

test('actual canonical JSON is revalidated and stored identity is checked on read and finish', options, async () => {
  await withSandbox(({ runs }) => {
    const { store } = seed(runs);
    for (const text of ['{', '', 'null', JSON.stringify({ ...runningRun(), formatVersion: 2 }),
      JSON.stringify({ ...runningRun(), extra: 'SYNTHETIC_SECRET' })]) {
      fs.writeFileSync(canonical(runs), text);
      failure(store.read('run-01'), 'invalid-run');
      failure(store.finish(completedRun()), 'invalid-run');
      assert.equal(fs.readFileSync(canonical(runs), 'utf8'), text);
    }
    const other = JSON.stringify(runningRun('different'));
    fs.writeFileSync(canonical(runs), other);
    failure(store.read('run-01'), 'identity-mismatch');
    failure(store.finish(completedRun()), 'identity-mismatch');
    assert.equal(fs.readFileSync(canonical(runs), 'utf8'), other);
  });
});

test('configured context and available observations cannot change or regress', options, async () => {
  await withSandbox(({ runs }) => {
    const store = open(runs);
    const completed = completedRun();
    const observedRunning = { ...runningRun(), scanContext: { ...completed.scan.context, cleanup: 'pending' } };
    valid(observedRunning);
    success(store.create(observedRunning));
    const before = bytes(runs);
    const mutations: [readonly (string | number)[], unknown][] = [
      [['createdAt'], '2026-08-30T09:00:00.000Z'], [['applicationRevision'], 'b'.repeat(40)],
      [['requestedUrl'], 'https://example.org/other'],
      [['providerContext'], { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' }],
      [['scan', 'context', 'readiness'], 'load'], [['scan', 'context', 'viewport', 'width'], 640],
      [['scan', 'context', 'viewport', 'height'], 480], [['scan', 'context', 'locale'], 'es-CO'],
      [['scan', 'context', 'timeoutMs'], 1000], [['scan', 'context', 'finalUrl'], { value: 'https://example.org/other' }],
      [['scan', 'context', 'scannedAt'], { value: '2026-08-30T10:00:01.500Z' }],
      [['scan', 'context', 'browserVersion'], { value: '146.0' }],
    ];
    for (const [keys, value] of mutations) {
      const candidate = changed(completed, keys, value);
      valid(candidate);
      failure(store.finish(candidate), 'invalid-transition');
      assert.deepEqual(bytes(runs), before);
    }
    for (const key of ['finalUrl', 'scannedAt', 'browserVersion']) {
      const candidate = changed({ ...failedRun(), scanContext: { ...completed.scan.context, cleanup: 'closed' } },
        ['scanContext', key], { unavailable: 'missing' });
      valid(candidate);
      failure(store.finish(candidate), 'invalid-transition');
      assert.deepEqual(bytes(runs), before);
    }
    const regressed = { ...failedRun(), scanContext: { ...completed.scan.context,
      scannedAt: { unavailable: 'missing' }, readinessReached: false, cleanup: 'closed' } };
    valid(regressed);
    failure(store.finish(regressed), 'invalid-transition');
    failure(store.finish(observedRunning), 'invalid-transition');
    assert.deepEqual(bytes(runs), before);
    success(store.finish(completed));
  });
});

test('unavailable observations may change reason or advance, and readiness may advance', options, async () => {
  await withSandbox(({ runs }) => {
    const store = open(runs);
    for (const reason of ['missing', 'invalid'] as const) {
      const id = `run-${reason}`;
      const initial = { ...runningRun(id), scanContext: { ...runningRun(id).scanContext,
        finalUrl: { unavailable: reason }, scannedAt: { unavailable: reason }, browserVersion: { unavailable: reason } } };
      valid(initial);
      success(store.create(initial));
      const terminal = { ...failedRun(id), scanContext: { ...failedRun(id).scanContext,
        finalUrl: { unavailable: reason === 'missing' ? 'invalid' : 'missing' },
        browserVersion: { value: '145.0' }, readinessReached: true } };
      valid(terminal);
      assert.deepEqual(success(store.finish(terminal)), terminal);
    }
  });
});

test('opening rejects unsupported roots without touching their targets', options, async () => {
  await withSandbox(({ root }) => {
    for (const candidate of ['', 'relative', 'C:relative', '\\\\server\\share', '\\\\?\\C:\\device',
      path.join(root, 'NUL'), path.join(root, 'COM1'), path.join(root, 'trailing.'),
      path.join(root, 'trailing '), path.join(root, 'stream:name'), root + '\0']) {
      failure(openRunRepository(candidate), 'unsafe-path');
    }
    assert.deepEqual(fs.readdirSync(root), []);
    const normalized = path.join(root, 'cases', 'ordinary', '..', 'ordinary', 'runs');
    success(openRunRepository(normalized));
    assert.ok(fs.statSync(path.resolve(normalized)).isDirectory());
  });
});

test('wrong run/file types, exact canonical spelling and multiple hard links are refused', options, async () => {
  await withSandbox(({ root, runs }) => {
    const { store, before } = seed(runs);
    fs.renameSync(canonical(runs), path.join(runs, 'run-01', 'RUN.JSON'));
    failure(store.read('run-01'), 'identity-mismatch');
    failure(store.finish(completedRun()), 'identity-mismatch');
    assert.deepEqual(fs.readFileSync(path.join(runs, 'run-01', 'RUN.JSON')), before);
    fs.renameSync(path.join(runs, 'run-01', 'RUN.JSON'), canonical(runs));
    fs.mkdirSync(path.join(root, 'cases', 'hardlink'), { recursive: true });
    const linked = path.join(root, 'cases', 'hardlink', 'hardlink-target.json');
    fs.linkSync(canonical(runs), linked);
    assert.equal(fs.statSync(canonical(runs)).nlink, 2);
    failure(store.read('run-01'), 'unsafe-path');
    failure(store.finish(completedRun()), 'unsafe-path');
    assert.deepEqual(fs.readFileSync(linked), before);
    fs.unlinkSync(linked);
    fs.unlinkSync(canonical(runs));
    fs.mkdirSync(canonical(runs));
    failure(store.read('run-01'), 'unsafe-path');
    failure(store.finish(completedRun()), 'unsafe-path');
    fs.writeFileSync(path.join(runs, 'file-run'), 'sentinel');
    failure(store.read('file-run'), 'unsafe-path');
    failure(store.finish(completedRun('file-run')), 'unsafe-path');
    failure(openRunRepository(path.join(runs, 'file-run')), 'unsafe-path');
    assert.equal(fs.readFileSync(path.join(runs, 'file-run'), 'utf8'), 'sentinel');
  });
});

test('junction roots, ancestors, run entries and canonical entries never follow external identity', options, async () => {
  await withSandbox(sandbox => {
    const { root, junctions } = sandbox;
    const outside = path.join(root, 'outside-sentinel');
    const corpus = path.join(root, 'corpus');
    fs.mkdirSync(outside);
    fs.mkdirSync(corpus);
    fs.writeFileSync(path.join(outside, 'marker.txt'), 'outside');
    fs.writeFileSync(path.join(corpus, 'marker.txt'), 'corpus');
    const cases = path.join(root, 'cases');
    fs.mkdirSync(cases);
    const junction = (name: string, target: string): string => {
      const entry = path.join(cases, name);
      fs.symlinkSync(target, entry, 'junction');
      junctions.add(entry);
      return entry;
    };
    const rootLink = junction('root-link', outside);
    failure(openRunRepository(rootLink), 'unsafe-path');
    failure(openRunRepository(path.join(rootLink, 'runs')), 'unsafe-path');
    const store = open(sandbox.runs);
    const runLink = path.join(sandbox.runs, 'run-01');
    fs.symlinkSync(outside, runLink, 'junction');
    junctions.add(runLink);
    failure(store.read('run-01'), 'unsafe-path');
    failure(store.finish(completedRun()), 'unsafe-path');
    failure(store.create(runningRun()), 'collision');
    fs.mkdirSync(path.join(sandbox.runs, 'canonical-link'));
    const fileLink = canonical(sandbox.runs, 'canonical-link');
    fs.symlinkSync(outside, fileLink, 'junction');
    junctions.add(fileLink);
    failure(store.read('canonical-link'), 'unsafe-path');
    failure(store.finish(completedRun('canonical-link')), 'unsafe-path');
    const mutableRoot = path.join(cases, 'mutable', 'runs');
    const mutableStore = open(mutableRoot);
    fs.rmdirSync(mutableRoot);
    fs.symlinkSync(outside, mutableRoot, 'junction');
    junctions.add(mutableRoot);
    failure(mutableStore.create(runningRun()), 'unsafe-path');
    failure(mutableStore.read('run-01'), 'unsafe-path');
    failure(mutableStore.finish(completedRun()), 'unsafe-path');
    assert.deepEqual(fs.readdirSync(outside), ['marker.txt']);
    assert.equal(fs.readFileSync(path.join(outside, 'marker.txt'), 'utf8'), 'outside');
    assert.equal(fs.readFileSync(path.join(corpus, 'marker.txt'), 'utf8'), 'corpus');
  });
});

test('staging residue is not promoted, repaired or swept when opening and reading', options, async () => {
  await withSandbox(({ runs }) => {
    const { before } = seed(runs);
    const name = 'run.json.tmp-00000000-0000-4000-8000-000000000000';
    const staged = path.join(runs, 'run-01', name);
    const text = JSON.stringify(completedRun());
    fs.writeFileSync(staged, text);
    assert.deepEqual(success(open(runs).read('run-01')), runningRun());
    assert.deepEqual(bytes(runs), before);
    assert.equal(fs.readFileSync(staged, 'utf8'), text);
    fs.unlinkSync(canonical(runs));
    failure(open(runs).read('run-01'), 'not-found');
    assert.equal(fs.readFileSync(staged, 'utf8'), text);
  });
});

test('a staging descriptor with another hard link is unsafe and cannot publish', options, async t => {
  await withSandbox(({ root, runs }) => {
    const { store, before } = seed(runs);
    const caseRoot = path.join(root, 'cases', 'staging-link');
    fs.mkdirSync(caseRoot, { recursive: true });
    const linked = path.join(caseRoot, 'hardlink-target.json');
    const originalOpen = fs.openSync;
    let staging = '';
    try {
      t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
        const fd = originalOpen(name, flags, mode);
        if (String(name).includes('run.json.tmp-')) {
          staging = String(name);
          fs.linkSync(staging, linked);
          assert.equal(fs.fstatSync(fd).nlink, 2);
        }
        return fd;
      });
      failure(store.finish(completedRun()), 'unsafe-path');
    } finally { t.mock.restoreAll(); }
    assert.notEqual(staging, '');
    assert.deepEqual(bytes(runs), before);
    assert.equal(fs.existsSync(staging), false);
    assert.ok(fs.statSync(linked).isFile(), 'Cleanup must not delete an unowned second link');
  });
});

test('root establishment rechecks an EEXIST race and rejects a non-directory', options, async t => {
  await withSandbox(({ root }) => {
    const target = path.join(root, 'runs');
    const originalMkdir = fs.mkdirSync;
    try {
      t.mock.method(fs, 'mkdirSync', (name: fs.PathLike, settings?: fs.MakeDirectoryOptions | fs.Mode | null) => {
        if (String(name) === target) {
          fs.writeFileSync(target, 'collision-sentinel', { flag: 'wx' });
          return originalMkdir(name, settings);
        }
        return originalMkdir(name, settings);
      });
      failure(openRunRepository(target), 'unsafe-path');
    } finally { t.mock.restoreAll(); }
    assert.equal(fs.readFileSync(target, 'utf8'), 'collision-sentinel');
  });
});

test('closed read and root-establishment errors never expose native exception content', options, async t => {
  await withSandbox(({ root, runs }) => {
    const { store, before } = seed(runs);
    try {
      t.mock.method(fs, 'readdirSync', fault);
      failure(store.read('run-01'), 'read-failed');
    } finally { t.mock.restoreAll(); }
    try {
      t.mock.method(fs, 'readFileSync', fault);
      failure(store.read('run-01'), 'read-failed');
      failure(store.finish(completedRun()), 'read-failed');
    } finally { t.mock.restoreAll(); }
    try {
      t.mock.method(fs, 'mkdirSync', fault);
      failure(openRunRepository(path.join(root, 'cases', 'new', 'runs')), 'write-failed');
      failure(store.create(runningRun('new-run')), 'write-failed');
    } finally { t.mock.restoreAll(); }
    assert.deepEqual(bytes(runs), before);
  });
});

test('complete staged writes loop over real short writes and flush and close before rename', options, async t => {
  await withSandbox(({ runs }) => {
    const { store } = seed(runs);
    const original = { write: fs.writeSync, flush: fs.fsyncSync, close: fs.closeSync, rename: fs.renameSync, open: fs.openSync };
    const events: string[] = [];
    let descriptor = -1;
    let staged = '';
    try {
      t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
        const fd = original.open(name, flags, mode);
        if (String(name).includes('run.json.tmp-')) {
          assert.equal(flags, 'wx');
          descriptor = fd;
          staged = String(name);
          assert.match(path.basename(staged), /^run\.json\.tmp-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
          assert.equal(path.dirname(staged), path.join(runs, 'run-01'));
        }
        return fd;
      });
      t.mock.method(fs, 'writeSync', (fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null) => {
        assert.equal(fd, descriptor);
        assert.ok(Buffer.isBuffer(buffer));
        events.push('write');
        return original.write(fd, buffer, offset, Math.min(length, 37), position);
      });
      t.mock.method(fs, 'fsyncSync', (fd: number) => { assert.equal(fd, descriptor); events.push('flush'); original.flush(fd); });
      t.mock.method(fs, 'closeSync', (fd: number) => { if (fd === descriptor) events.push('close'); original.close(fd); });
      t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
        assert.equal(String(from), staged);
        assert.equal(String(to), canonical(runs));
        assert.ok(fs.existsSync(canonical(runs)), 'Canonical must never be unlinked before replacement');
        events.push('rename');
        original.rename(from, to);
      });
      assert.deepEqual(success(store.finish(completedRun())), completedRun());
    } finally { t.mock.restoreAll(); }
    assert.ok(events.filter(event => event === 'write').length > 1);
    assert.deepEqual(events.slice(-3), ['flush', 'close', 'rename']);
    assert.equal(events.filter(event => event === 'close').length, 1);
    assert.deepEqual(bytes(runs), Buffer.from(JSON.stringify(completedRun(), null, 2) + '\n'));
    assert.deepEqual(residue(runs), []);
  });
});

type FaultPhase = 'open' | 'partial-write' | 'zero' | 'negative' | 'fraction' | 'oversize' | 'nan' | 'flush' | 'close' | 'rename' | 'unlink' | 'collision' | 'rmdir';
function installFault(t: TestContext, phase: FaultPhase): { release: () => void; inspect: () => { staged: string; closes: number; prefix: number; renames: number } } {
  const original = { open: fs.openSync, write: fs.writeSync, close: fs.closeSync, rename: fs.renameSync, unlink: fs.unlinkSync, rmdir: fs.rmdirSync };
  let descriptor = -1;
  let staged = '';
  let closes = 0;
  let prefix = 0;
  let renames = 0;
  let closeUncertain = false;
  t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
    if (String(name).includes('run.json.tmp-')) {
      staged = String(name);
      assert.equal(flags, 'wx');
      if (phase === 'open') return fault();
      if (phase === 'collision') {
        const collision = original.open(name, 'wx');
        original.write(collision, 'collision-sentinel');
        original.close(collision);
      }
      descriptor = original.open(name, flags, mode);
      return descriptor;
    }
    return original.open(name, flags, mode);
  });
  t.mock.method(fs, 'writeSync', (fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null) => {
    assert.equal(fd, descriptor);
    if (phase === 'partial-write') { prefix = original.write(fd, buffer, offset, Math.min(19, length), position); return fault(); }
    if (phase === 'zero') return 0;
    if (phase === 'negative') return -1;
    if (phase === 'fraction') return 0.5;
    if (phase === 'oversize') return length + 1;
    if (phase === 'nan') return NaN;
    return original.write(fd, buffer, offset, length, position);
  });
  if (phase === 'flush') t.mock.method(fs, 'fsyncSync', fault);
  t.mock.method(fs, 'closeSync', (fd: number) => {
    if (fd === descriptor) {
      closes++;
      if (phase === 'close') { closeUncertain = true; return fault(); }
    }
    original.close(fd);
  });
  t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
    renames++;
    if (['rename', 'unlink', 'rmdir'].includes(phase)) return fault();
    original.rename(from, to);
  });
  if (phase === 'unlink') t.mock.method(fs, 'unlinkSync', fault);
  if (phase === 'rmdir') t.mock.method(fs, 'rmdirSync', fault);
  return {
    inspect: () => ({ staged, closes, prefix, renames }),
    release: () => {
      t.mock.restoreAll();
      // Test-created uncertain descriptor belongs to this fixture, never to application recovery.
      if (closeUncertain) original.close(descriptor);
    },
  };
}

for (const operation of ['create', 'finish'] as const) {
  for (const phase of ['open', 'partial-write', 'zero', 'negative', 'fraction', 'oversize', 'nan', 'flush', 'close', 'rename', 'unlink', 'collision',
    ...(operation === 'create' ? ['rmdir' as const] : [])] as const satisfies readonly FaultPhase[]) {
    test(`${operation} ${phase} fault preserves canonical bytes and reports exact cleanup ownership`, options, async t => {
      await withSandbox(({ runs }) => {
        const store = open(runs);
        if (operation === 'finish') success(store.create(runningRun()));
        success(store.create(runningRun('sibling')));
        success(store.finish(completedRun('sibling')));
        const sibling = bytes(runs, 'sibling');
        const before = operation === 'finish' ? bytes(runs) : null;
        const control = installFault(t, phase);
        let state: ReturnType<typeof control.inspect>;
        try {
          const result = operation === 'create' ? store.create(runningRun()) : store.finish(completedRun());
          failure(result, 'write-failed', ['close', 'unlink', 'rmdir'].includes(phase) || (phase === 'collision' && operation === 'create'));
          state = control.inspect();
          assert.equal(state.closes, phase === 'open' || phase === 'collision' ? 0 : 1);
          assert.equal(state.renames, ['rename', 'unlink', 'rmdir'].includes(phase) ? 1 : 0);
          if (phase === 'partial-write') assert.equal(state.prefix, 19);
        } finally { control.release(); }
        if (before !== null) assert.deepEqual(bytes(runs), before);
        else assert.equal(fs.existsSync(canonical(runs)), false);
        assert.deepEqual(bytes(runs, 'sibling'), sibling);
        const hasResidue = ['close', 'unlink', 'collision'].includes(phase);
        assert.equal(fs.existsSync(state.staged), hasResidue);
        if (phase === 'collision') assert.equal(fs.readFileSync(state.staged, 'utf8'), 'collision-sentinel');
        if (operation === 'create') {
          assert.equal(fs.existsSync(path.join(runs, 'run-01')), hasResidue || phase === 'rmdir');
        } else {
          assert.ok(fs.statSync(path.join(runs, 'run-01')).isDirectory());
        }
      });
    });
  }
}

test('ordinary Windows read-only canonical file refuses real rename and preserves bytes', options, async () => {
  await withSandbox(({ runs }) => {
    const { store, before } = seed(runs);
    fs.chmodSync(canonical(runs), 0o444);
    try {
      failure(store.finish(completedRun()), 'write-failed');
      assert.deepEqual(bytes(runs), before);
      assert.deepEqual(residue(runs), []);
    } finally { fs.chmodSync(canonical(runs), 0o666); }
  });
});

test('topology changed after staging close is refused before publication', options, async t => {
  await withSandbox(({ runs }) => {
    const { store, before } = seed(runs);
    const originalOpen = fs.openSync;
    const originalClose = fs.closeSync;
    const alias = path.join(runs, 'run-01', 'RUN.JSON');
    let descriptor = -1;
    try {
      t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
        const fd = originalOpen(name, flags, mode);
        if (String(name).includes('run.json.tmp-')) descriptor = fd;
        return fd;
      });
      t.mock.method(fs, 'closeSync', (fd: number) => {
        originalClose(fd);
        if (fd === descriptor) fs.renameSync(canonical(runs), alias);
      });
      failure(store.finish(completedRun()), 'identity-mismatch');
    } finally { t.mock.restoreAll(); }
    assert.deepEqual(fs.readFileSync(alias), before);
    assert.deepEqual(fs.readdirSync(path.join(runs, 'run-01')), ['RUN.JSON']);
  });
});

test('successful rename is the commit point with no fallible filesystem work afterward', options, async t => {
  await withSandbox(({ runs }) => {
    const { store } = seed(runs);
    const rename = fs.renameSync;
    try {
      t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
        rename(from, to);
        for (const method of ['lstatSync', 'statSync', 'realpathSync', 'readdirSync', 'readFileSync',
          'openSync', 'writeSync', 'fsyncSync', 'closeSync', 'unlinkSync', 'rmdirSync'] as const) t.mock.method(fs, method, fault);
      });
      assert.deepEqual(success(store.finish(completedRun())), completedRun());
    } finally { t.mock.restoreAll(); }
    assert.deepEqual(success(open(runs).read('run-01')), completedRun());
  });
});

const interruptionSource = `
  import fs from 'node:fs';
  import { openRunRepository } from ${JSON.stringify(pathToFileURL(path.join(repo, 'src/server/persistence/run-repository.ts')).href)};
  import { completedRun } from ${JSON.stringify(pathToFileURL(path.join(repo, 'tests/helpers/m102-run-fixture.ts')).href)};
  const [root, runId, phase] = process.argv.slice(1);
  const opened = openRunRepository(root);
  if (!opened.ok) throw new Error('Synthetic child could not open repository');
  const originalRename = fs.renameSync;
  fs.renameSync = (...args) => {
    if (phase === 'before') process.exit(86);
    originalRename(...args);
    process.exit(87);
  };
  const result = opened.value.finish(completedRun(runId));
  process.stdout.write(JSON.stringify(result));
  process.exit(88);
`;

async function interrupt(sandbox: Sandbox, phase: 'before' | 'after'): Promise<void> {
  const childEnv: NodeJS.ProcessEnv = {};
  for (const key of ['SystemRoot', 'WINDIR', 'TEMP', 'TMP']) {
    if (process.env[key] !== undefined) childEnv[key] = process.env[key];
  }
  const child = spawn(process.execPath, ['--input-type=module', '--eval', interruptionSource, sandbox.runs, 'run-01', phase], {
    cwd: repo, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: childEnv,
  });
  let exited = false;
  let total = 0;
  let stdout = '';
  let stderr = '';
  let timer: ReturnType<typeof setTimeout> | undefined;
  let killTimer: ReturnType<typeof setTimeout> | undefined;
  let failureReason: Error | undefined;
  const result = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
    const failedTermination = (reason: string) => {
      if (failureReason !== undefined || exited) return;
      failureReason = new Error(reason);
      if (timer !== undefined) clearTimeout(timer);
      child.kill();
      killTimer = setTimeout(() => {
        sandbox.preserve = true;
        reject(new Error('Owned interruption child exit could not be confirmed'));
      }, 5000);
    };
    child.once('exit', () => {
      exited = true;
      if (timer !== undefined) clearTimeout(timer);
      if (killTimer !== undefined) clearTimeout(killTimer);
      killTimer = setTimeout(() => reject(new Error('Owned child exited but output streams did not close')), 5000);
    });
    child.once('close', (code, signal) => {
      if (timer !== undefined) clearTimeout(timer);
      if (killTimer !== undefined) clearTimeout(killTimer);
      if (!exited) {
        sandbox.preserve = true;
        reject(new Error('Owned child close did not confirm process exit'));
        return;
      }
      resolve({ code, signal });
    });
    child.once('error', () => failedTermination('Owned interruption child failed to start or terminate'));
    const capture = (data: Buffer, stream: 'stdout' | 'stderr') => {
      total += data.length;
      if (total > 65536) { failedTermination('Owned interruption child output exceeded 64 KiB'); return; }
      if (stream === 'stdout') stdout += data.toString('utf8');
      else stderr += data.toString('utf8');
    };
    child.stdout.on('data', (data: Buffer) => capture(data, 'stdout'));
    child.stderr.on('data', (data: Buffer) => capture(data, 'stderr'));
    timer = setTimeout(() => failedTermination('Owned interruption child exceeded 10 seconds'), 10000);
  });
  assert.equal(failureReason, undefined);
  assert.equal(result.signal, null);
  assert.equal(result.code, phase === 'before' ? 86 : 87, stderr);
  assert.equal(stdout, '', 'Interruption must not acknowledge successful finish');
  assert.equal(stderr, '');
}

for (const phase of ['before', 'after'] as const) {
  test(`real child exit immediately ${phase} rename retains the truthful committed state`, options, async () => {
    await withSandbox(async sandbox => {
      const { before } = seed(sandbox.runs);
      await interrupt(sandbox, phase);
      const reopened = success(open(sandbox.runs).read('run-01'));
      if (phase === 'before') {
        assert.deepEqual(bytes(sandbox.runs), before);
        assert.deepEqual(reopened, runningRun());
        const names = residue(sandbox.runs);
        assert.equal(names.length, 1);
        assert.match(names[0]!, /^run\.json\.tmp-[0-9a-f-]{36}$/);
        assert.deepEqual(JSON.parse(fs.readFileSync(path.join(sandbox.runs, 'run-01', names[0]!), 'utf8')), completedRun());
      } else {
        assert.deepEqual(reopened, completedRun());
        assert.deepEqual(bytes(sandbox.runs), Buffer.from(JSON.stringify(completedRun(), null, 2) + '\n'));
        assert.deepEqual(residue(sandbox.runs), []);
      }
    });
  });
}
