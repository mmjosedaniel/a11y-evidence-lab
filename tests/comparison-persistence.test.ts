import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test, { type TestContext } from 'node:test';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { CompletedRun, RunRepository, StoreResult } from '../src/server/persistence/run-repository.ts';
import { runningRun } from './helpers/m102-run-fixture.ts';
import { withReviewSandbox } from './helpers/m401-review-sandbox.ts';
import {
  comparisonRun,
  comparisonScenario,
  mutate,
  remove,
} from './helpers/m503-comparison-fixture.ts';

const options = { concurrency: false };
type ComparisonRepository = RunRepository & {
  updateComparison(expected: CompletedRun, input: unknown): StoreResult<CompletedRun>;
};

function success<T>(result: StoreResult<T>): T {
  assert.ok(result.ok, JSON.stringify(result));
  return result.value;
}

function failure(result: StoreResult<unknown>, error: string, cleanupFailed = false): void {
  assert.deepEqual(result, { ok: false, error, cleanupFailed });
}

function open(root: string): ComparisonRepository {
  return success(openRunRepository(root)) as ComparisonRepository;
}

function seed(root: string): { store: ComparisonRepository; current: CompletedRun } {
  const scenario = comparisonScenario();
  const store = open(root);
  success(store.create({ ...runningRun('later-run'), baselineRunId: scenario.baselineRun.runId }));
  return { store, current: success(store.finish(scenario.laterRun)) as CompletedRun };
}

function canonical(root: string): string {
  return path.join(root, 'later-run', 'run.json');
}

function bytes(root: string): Buffer {
  return fs.readFileSync(canonical(root));
}

function withoutComparison(input: unknown): unknown {
  const value = structuredClone(input) as Record<string, unknown>;
  delete value.comparison;
  return value;
}

function deepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.ok(Object.isFrozen(value));
  for (const child of Object.values(value)) deepFrozen(child);
}

test('updateComparison appends one validated durable comparison and returns the serialized aggregate', options, async () => {
  await withReviewSandbox('repository', ({ runs }) => {
    const { store, current } = seed(runs);
    const candidate = comparisonRun();
    const submitted = structuredClone(candidate);
    const durable = success(store.updateComparison(current, submitted));
    assert.deepEqual(withoutComparison(durable), current);
    assert.deepEqual(submitted, candidate);
    assert.notStrictEqual(durable, submitted);
    deepFrozen(durable);
    assert.deepEqual(success(open(runs).read('later-run')), durable);
    assert.deepEqual(JSON.parse(bytes(runs).toString('utf8')), durable);
    assert.deepEqual(fs.readdirSync(path.dirname(canonical(runs))).sort(), ['run.json']);
  });
});

test('updateComparison rejects stale, duplicate, overwrite and removal while finish cannot bypass append', options, async () => {
  await withReviewSandbox('repository', ({ runs }) => {
    const { store, current } = seed(runs);
    const candidate = comparisonRun();
    const stale = comparisonScenario('ambiguous').laterRun;
    const unrelated = mutate(candidate, ['applicationRevision'], 'b'.repeat(40));
    const overwrite = mutate(candidate, ['comparison', 'baseline', 'findingId'], 'finding-overwrite');
    const malformed = mutate(candidate, ['comparison', 'rationale'], 'Replacement rationale');
    assert.ok(validateRun(unrelated).ok, 'Unrelated aggregate mutation control must remain schema-valid');
    assert.ok(validateRun(overwrite).ok, 'Overwrite control must be a valid alternative comparison');
    assert.equal(validateRun(malformed).ok, false);
    const before = bytes(runs);
    failure(store.updateComparison(stale, candidate), 'invalid-transition');
    assert.deepEqual(bytes(runs), before);
    failure(store.updateComparison(current, unrelated), 'invalid-transition');
    assert.deepEqual(bytes(runs), before);

    const durable = success(store.updateComparison(current, candidate));
    const committed = bytes(runs);
    for (const [expected, next] of [
      [current, candidate],
      [durable, overwrite],
      [durable, remove(durable, ['comparison'])],
    ] as const) {
      failure(store.updateComparison(expected as CompletedRun, next), 'invalid-transition');
      assert.deepEqual(bytes(runs), committed);
    }
    failure(store.updateComparison(durable, malformed), 'invalid-run');
    assert.deepEqual(bytes(runs), committed);

  });
});

test('finish accepts the scan-only control but cannot publish a comparison from a running record', options, async () => {
  await withReviewSandbox('repository', ({ runs }) => {
    const store = open(runs);
    const scenario = comparisonScenario();
    const control = { ...structuredClone(scenario.laterRun), runId: 'control-run' };
    success(store.create({ ...runningRun('control-run'), baselineRunId: scenario.baselineRun.runId }));
    assert.deepEqual(success(store.finish(control)), control);

    const guardedRunning = { ...runningRun('guarded-run'), baselineRunId: scenario.baselineRun.runId };
    const guarded = { ...comparisonRun(), runId: 'guarded-run' };
    success(store.create(guardedRunning));
    failure(store.finish(guarded as unknown as CompletedRun), 'invalid-transition');
    assert.deepEqual(success(store.read('guarded-run')), guardedRunning);
  });
});

type FaultPhase = 'open' | 'partial-write' | 'write' | 'flush' | 'close' | 'rename';

function installFault(t: TestContext, phase: FaultPhase): { release(): void } {
  const original = {
    open: fs.openSync, write: fs.writeSync, flush: fs.fsyncSync,
    close: fs.closeSync, rename: fs.renameSync,
  };
  let stagedDescriptor = -1;
  let stagedPath = '';
  let writes = 0;
  t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
    if (phase === 'open' && String(name).includes('run.json.tmp-')) throw new Error('CONTROLLED_OPEN');
    const descriptor = original.open(name, flags, mode);
    if (String(name).includes('run.json.tmp-')) {
      stagedDescriptor = descriptor;
      stagedPath = String(name);
    }
    return descriptor;
  });
  if (phase === 'partial-write' || phase === 'write') {
    t.mock.method(fs, 'writeSync', (descriptor: number, buffer: Uint8Array, offset: number,
      length: number, position: number | null) => {
      writes++;
      if (phase === 'write' || writes > 1) throw new Error('CONTROLLED_WRITE');
      return original.write(descriptor, buffer, offset, Math.min(length, 19), position);
    });
  }
  if (phase === 'flush') t.mock.method(fs, 'fsyncSync', () => { throw new Error('CONTROLLED_FLUSH'); });
  if (phase === 'close') t.mock.method(fs, 'closeSync', (descriptor: number) => {
    if (descriptor === stagedDescriptor) throw new Error('CONTROLLED_CLOSE');
    original.close(descriptor);
  });
  if (phase === 'rename') t.mock.method(fs, 'renameSync', () => { throw new Error('CONTROLLED_RENAME'); });
  return {
    release() {
      t.mock.restoreAll();
      if (phase === 'close' && stagedDescriptor >= 0) {
        original.close(stagedDescriptor);
        if (stagedPath && fs.existsSync(stagedPath)) fs.unlinkSync(stagedPath);
      }
    },
  };
}

for (const phase of ['open', 'partial-write', 'write', 'flush', 'close', 'rename'] as const) {
  test(`updateComparison ${phase} failure retains the last valid aggregate`, options, async t => {
    await withReviewSandbox('repository', ({ runs }) => {
      const { store, current } = seed(runs);
      const before = bytes(runs);
      const control = installFault(t, phase);
      try {
        failure(store.updateComparison(current, comparisonRun()), 'write-failed', phase === 'close');
      } finally {
        control.release();
      }
      assert.deepEqual(bytes(runs), before);
      assert.deepEqual(success(open(runs).read('later-run')), current);
    });
  });
}

test('successful comparison rename is the commit point with no postcommit filesystem dependency', options, async t => {
  await withReviewSandbox('repository', ({ runs }) => {
    const { store, current } = seed(runs);
    const rename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      rename(from, to);
      for (const method of ['lstatSync', 'statSync', 'realpathSync', 'readdirSync', 'readFileSync',
        'openSync', 'writeSync', 'fsyncSync', 'closeSync', 'unlinkSync', 'rmdirSync'] as const) {
        t.mock.method(fs, method, () => { throw new Error('POST_COMMIT_FILESYSTEM_CALL'); });
      }
    });
    let result: StoreResult<CompletedRun>;
    try {
      result = store.updateComparison(current, comparisonRun());
      assert.ok(result.ok, JSON.stringify(result));
    } finally {
      t.mock.restoreAll();
    }
    const readback = success(open(runs).read('later-run'));
    assert.ok(validateRun(readback).ok);
    assert.deepEqual(readback, result!.ok ? result!.value : null);
  });
});
