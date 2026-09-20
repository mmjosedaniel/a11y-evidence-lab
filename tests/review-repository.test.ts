import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import type { CompletedRun, RunRepository, StoreResult } from '../src/server/persistence/run-repository.ts';
import { selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import { proposalGenerationRun } from './helpers/m302-generation-fixture.ts';
import { reviewedRun, type ReviewAction } from './helpers/m401-review-fixture.ts';
import { withReviewSandbox } from './helpers/m401-review-sandbox.ts';
import { mutate as mutateComparison, remove as removeComparison, withComparison } from './helpers/m503-comparison-fixture.ts';

const options = { concurrency: false };
type ReviewRepository = RunRepository & {
  updateReview(expected: CompletedRun, input: unknown): StoreResult<CompletedRun>;
};

function success<T>(result: StoreResult<T>): T {
  assert.ok(result.ok, JSON.stringify(result));
  return result.value;
}

function failure(result: StoreResult<unknown>, error: string, cleanupFailed = false): void {
  assert.deepEqual(result, { ok: false, error, cleanupFailed });
}

function writeSyntheticRun(root: string, input: unknown): CompletedRun {
  const validated = validateRun(input);
  assert.ok(validated.ok, 'Synthetic pending review aggregate must be valid');
  assert.equal(validated.value.status, 'completed');
  if (validated.value.status !== 'completed') throw new Error('Expected completed synthetic run');
  const directory = path.join(root, validated.value.runId);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'run.json'), JSON.stringify(validated.value, null, 2) + '\n', { flag: 'wx' });
  return validated.value;
}

function open(root: string): ReviewRepository {
  return success(openRunRepository(root)) as ReviewRepository;
}

function canonical(root: string, runId = 'run-01'): string {
  return path.join(root, runId, 'run.json');
}

function bytes(root: string, runId = 'run-01'): Buffer {
  return fs.readFileSync(canonical(root, runId));
}

function deepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.ok(Object.isFrozen(value));
  for (const child of Object.values(value)) deepFrozen(child);
}

function mutate(input: unknown, keys: readonly (string | number)[], value: unknown): unknown {
  const clone = structuredClone(input);
  let current = clone as Record<string | number, unknown>;
  for (const key of keys.slice(0, -1)) current = current[key] as Record<string | number, unknown>;
  current[keys.at(-1)!] = value;
  return clone;
}

for (const action of ['approve', 'edit-and-accept', 'reject'] as const satisfies readonly ReviewAction[]) {
  test(`updateReview publishes one immutable ${action} decision and round-trips the selected Finding`, options, async () => {
    await withReviewSandbox('repository', ({ runs }) => {
      const pending = writeSyntheticRun(runs, proposalGenerationRun());
      const original = structuredClone(selectedFinding(pending as never));
      const candidate = reviewedRun(action);
      const store = open(runs);

      const durable = success(store.updateReview(pending, candidate));
      assert.deepEqual(durable, candidate);
      deepFrozen(durable);
      assert.deepEqual(success(store.read('run-01')), candidate);
      const after = selectedFinding(durable as never);
      assert.deepEqual(after.result, original.result);
      assert.deepEqual(after.retrieval, original.retrieval);
      assert.deepEqual(after.analysis, original.analysis);
      assert.deepEqual(after.generation, original.generation);
      assert.deepEqual(durable.scan.findings[1], pending.scan.findings[1]);
      assert.deepEqual(bytes(runs), Buffer.from(JSON.stringify(durable, null, 2) + '\n'));
      assert.deepEqual(fs.readdirSync(path.join(runs, 'run-01')), ['run.json']);
    });
  });
}

test('updateReview rejects stale, duplicate, final, wrong-identity and unrelated mutations without changing bytes', options, async () => {
  await withReviewSandbox('repository', ({ runs }) => {
    const pending = writeSyntheticRun(runs, proposalGenerationRun());
    const store = open(runs);
    const approved = reviewedRun('approve');
    const before = bytes(runs);
    const stale = mutate(pending, ['applicationRevision'], 'b'.repeat(40)) as CompletedRun;
    const unrelated = mutate(approved, ['scan', 'findings', 1, 'evidence', 'altState'], { value: 'empty' });
    const wrongIdentity = mutate(approved, ['runId'], 'other-run');

    failure(store.updateReview(stale, approved), 'invalid-transition');
    failure(store.updateReview(pending, unrelated), 'invalid-transition');
    failure(store.updateReview(pending, wrongIdentity), 'not-found');
    assert.deepEqual(bytes(runs), before);

    success(store.updateReview(pending, approved));
    const finalBytes = bytes(runs);
    failure(store.updateReview(pending, approved), 'invalid-transition');
    failure(store.updateReview(approved as CompletedRun, reviewedRun('reject')), 'invalid-transition');
    assert.deepEqual(bytes(runs), finalBytes);
  });
});

for (const phase of ['write', 'flush', 'close', 'identity', 'rename'] as const) {
  test(`updateReview ${phase} failure preserves the pending aggregate and reports cleanup truth`, options, async t => {
    await withReviewSandbox('repository', box => {
      const { runs } = box;
      const pending = writeSyntheticRun(runs, proposalGenerationRun());
      const store = open(runs);
      const before = bytes(runs);
      const original = {
        write: fs.writeSync,
        flush: fs.fsyncSync,
        close: fs.closeSync,
        rename: fs.renameSync,
        open: fs.openSync,
      };
      let stagedDescriptor = -1;
      let stagedPath = '';
      let alias = '';
      t.mock.method(fs, 'openSync', (name: fs.PathLike, flags: string | number, mode?: fs.Mode) => {
        const descriptor = original.open(name, flags, mode);
        if (String(name).includes('run.json.tmp-')) {
          stagedDescriptor = descriptor;
          stagedPath = String(name);
        }
        return descriptor;
      });
      if (phase === 'write') t.mock.method(fs, 'writeSync', () => { throw new Error('CONTROLLED_WRITE'); });
      if (phase === 'flush') t.mock.method(fs, 'fsyncSync', () => { throw new Error('CONTROLLED_FLUSH'); });
      if (phase === 'close') t.mock.method(fs, 'closeSync', (descriptor: number) => {
        if (descriptor === stagedDescriptor) throw new Error('CONTROLLED_CLOSE');
        original.close(descriptor);
      });
      if (phase === 'identity') t.mock.method(fs, 'closeSync', (descriptor: number) => {
        original.close(descriptor);
        if (descriptor === stagedDescriptor) {
          alias = path.join(runs, 'run-01', 'RUN.JSON');
          original.rename(canonical(runs), alias);
        }
      });
      if (phase === 'rename') t.mock.method(fs, 'renameSync', () => { throw new Error('CONTROLLED_RENAME'); });

      try {
        const result = store.updateReview(pending, reviewedRun('approve'));
        failure(result, phase === 'identity' ? 'identity-mismatch' : 'write-failed', phase === 'close');
      } finally {
        t.mock.restoreAll();
        try {
          if (phase === 'close' && stagedDescriptor >= 0) {
            original.close(stagedDescriptor);
            if (stagedPath && fs.existsSync(stagedPath)) fs.unlinkSync(stagedPath);
          }
          if (phase === 'identity' && alias && fs.existsSync(alias)) original.rename(alias, canonical(runs));
        } catch (error) {
          box.preserve = true;
          throw new Error(`Controlled repository fault cleanup failed; retained review sandbox: ${box.root}`, { cause: error });
        }
      }
      assert.deepEqual(bytes(runs), before);
      assert.deepEqual(success(open(runs).read('run-01')), pending);
    });
  });
}

test('successful review rename is the commit point and no later filesystem observation can reverse success', options, async t => {
  await withReviewSandbox('repository', ({ runs }) => {
    const pending = writeSyntheticRun(runs, proposalGenerationRun());
    const store = open(runs);
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
      result = store.updateReview(pending, reviewedRun('approve'));
      assert.ok(result.ok, JSON.stringify(result));
    } finally {
      t.mock.restoreAll();
    }
    assert.deepEqual(success(open(runs).read('run-01')), reviewedRun('approve'));
  });
});

test('review publication preserves a saved comparison while changing only the selected Finding review state', options, async () => {
  await withReviewSandbox('repository', ({ runs }) => {
    const pending = writeSyntheticRun(runs, { ...proposalGenerationRun(), baselineRunId: 'baseline-run' });
    const store = open(runs) as ReviewRepository & {
      updateComparison(expected: CompletedRun, input: unknown): StoreResult<CompletedRun>;
    };
    const compared = success(store.updateComparison(pending, withComparison(pending)));
    const reviewed = withComparison({ ...reviewedRun('approve'), baselineRunId: 'baseline-run' });
    const committed = bytes(runs);
    const changed = mutateComparison(reviewed,
      ['comparison', 'baseline', 'findingId'], 'finding-changed');
    assert.ok(validateRun(changed).ok);
    failure(store.updateReview(compared, removeComparison(reviewed, ['comparison'])), 'invalid-transition');
    failure(store.updateReview(compared, changed), 'invalid-transition');
    assert.deepEqual(bytes(runs), committed);
    const durable = success(store.updateReview(compared, reviewed));
    assert.deepEqual((durable as unknown as Record<string, unknown>).comparison,
      (compared as unknown as Record<string, unknown>).comparison);
    assert.deepEqual(success(open(runs).read('run-01')), durable);
  });
});
