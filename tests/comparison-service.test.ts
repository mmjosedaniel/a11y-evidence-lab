import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { CompletedRun, RunRepository, RunningRun, StoreResult } from '../src/server/persistence/run-repository.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService } from '../src/server/service.ts';
import type { RescanExecutor, RescanOutcome } from '../src/server/local-service/contracts.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import {
  assessedSupportedRetrievalRun,
  runningRetrievalRun,
} from './helpers/m202-retrieval-service-fixture.ts';
import { expectedComparison } from './helpers/m503-comparison-fixture.ts';
import { withReviewSandbox, type ReviewSandbox } from './helpers/m401-review-sandbox.ts';

const revision = 'b'.repeat(40);
const serial = { concurrency: false };
type ComparisonService = LocalService & {
  rescanFinding(input: unknown, execute?: RescanExecutor): Promise<RescanOutcome>;
};

function success<T>(result: StoreResult<T>): T {
  assert.ok(result.ok, JSON.stringify(result));
  return result.value;
}

function open(root: string): RunRepository {
  return success(openRunRepository(root));
}

function disk(root: string, runId: string): CompletedRun {
  const checked = validateRun(JSON.parse(fs.readFileSync(path.join(root, runId, 'run.json'), 'utf8')));
  assert.ok(checked.ok && checked.value.status === 'completed');
  return checked.value;
}

function bytes(root: string, runId: string): Buffer {
  return fs.readFileSync(path.join(root, runId, 'run.json'));
}

function immutableNativeSource(run: CompletedRun): unknown {
  return {
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    context: run.scan.context,
    coverage: run.scan.coverage,
    scannerReviewObservations: run.scan.scannerReviewObservations,
    findings: run.scan.findings.map(finding => ({ findingId: finding.findingId,
      ruleId: finding.ruleId, nativeResult: finding.nativeResult, checks: finding.checks,
      locator: finding.locator, evidence: finding.evidence })),
  };
}

function intent(runId = 'later-run', baselineRunId = 'baseline-run') {
  return { runId, baselineRunId, findingId: 'finding-0', mode: 'local' as const };
}

function linkedRunning(runId: string, baselineRunId: string): RunningRun {
  const checked = validateRun({ ...runningRun(runId), baselineRunId });
  assert.ok(checked.ok && checked.value.status === 'running');
  return checked.value;
}

function linkedTerminal(run: RunningRun, kind: 'populated' | 'zero' = 'populated'): CompletedRun {
  const sample = completedRun(run.runId, run.providerContext.mode, kind);
  const finishedAt = new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString();
  const checked = validateRun({
    ...sample,
    runId: run.runId,
    baselineRunId: (run as RunningRun & { baselineRunId: string }).baselineRunId,
    createdAt: run.createdAt,
    applicationRevision: run.applicationRevision,
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    finishedAt,
    scan: { ...sample.scan, context: { ...run.scanContext,
      finalUrl: sample.scan.context.finalUrl, scannedAt: { value: finishedAt },
      browserVersion: sample.scan.context.browserVersion, readinessReached: true, cleanup: 'closed' } },
  });
  assert.ok(checked.ok && checked.value.status === 'completed');
  return checked.value;
}

function seedCompleted(root: string, runId = 'baseline-run'): CompletedRun {
  const repository = open(root);
  success(repository.create(runningRun(runId)));
  return success(repository.finish(completedRun(runId))) as CompletedRun;
}

function seedComparisonBearingBaseline(root: string): { immediate: CompletedRun; baseline: CompletedRun } {
  const repository = open(root);
  const immediate = seedCompleted(root, 'immediate-run');
  const running = linkedRunning('baseline-run', immediate.runId);
  success(repository.create(running));
  const terminal = linkedTerminal(running);
  const completed = success(repository.finish(terminal)) as CompletedRun;
  const comparison = expectedComparison({ baselineRun: immediate,
    baselineFindingId: immediate.scan.findings[0]!.findingId, laterRun: completed, candidates: [] });
  const baseline = success(repository.updateComparison(completed, { ...completed, comparison })) as CompletedRun;
  return { immediate, baseline };
}

async function start(box: ReviewSandbox, options: { stopTimeoutMs?: number } = {}): Promise<ComparisonService> {
  const started = await startLocalService({ runRoot: box.runs, applicationRevision: revision, ...options });
  assert.ok(started.ok);
  box.services.push(started.service);
  return started.service as ComparisonService;
}

function exactOwnedRunDirectory(root: string, runId: string): { directory: string; file: string; sha256: string } {
  const resolvedRoot = path.resolve(root);
  const sandboxRoot = path.dirname(resolvedRoot);
  const directory = path.resolve(root, runId);
  const file = path.join(directory, 'run.json');
  assert.equal(path.dirname(directory), resolvedRoot);
  let current = directory;
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Deletion ancestor must be an ordinary directory');
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    if (current === sandboxRoot) break;
    const parent = path.dirname(current);
    assert.notEqual(parent, current, 'Deletion ancestor chain must reach the owned sandbox root');
    current = parent;
  }
  const directoryStat = fs.lstatSync(directory);
  assert.ok(directoryStat.isDirectory() && !directoryStat.isSymbolicLink());
  assert.deepEqual(fs.readdirSync(directory), ['run.json']);
  const fileStat = fs.lstatSync(file);
  assert.ok(fileStat.isFile() && !fileStat.isSymbolicLink() && fileStat.nlink === 1);
  for (const sibling of fs.readdirSync(root)) {
    if (sibling === runId) continue;
    const siblingFile = path.join(root, sibling, 'run.json');
    if (!fs.existsSync(siblingFile)) continue;
    const stat = fs.lstatSync(siblingFile);
    assert.ok(stat.dev !== fileStat.dev || stat.ino !== fileStat.ino, 'Owned baseline must have no file alias');
  }
  const content = fs.readFileSync(file);
  return { directory, file, sha256: createHash('sha256').update(content).digest('hex') };
}

test('publishes the calculated comparison once, holds reservation through rename, and returns exact disk truth', serial, async t => {
  await withReviewSandbox('service', async box => {
    const baseline = seedCompleted(box.runs);
    const baselineBefore = bytes(box.runs, baseline.runId);
    const service = await start(box);
    let nested: Promise<RescanOutcome> | undefined;
    const originalRename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string, unknown>;
      if (candidate.runId === 'later-run' && Object.hasOwn(candidate, 'comparison')) {
        nested = service.rescanFinding(intent('nested-run'), async run => ({ run: linkedTerminal(run), candidates: [] }));
      }
      return originalRename(from, to);
    });
    let terminal!: CompletedRun;
    try {
      const outcome = await service.rescanFinding(intent(), async run => {
        terminal = linkedTerminal(run);
        return { run: terminal, candidates: [] };
      });
      assert.ok(outcome.ok);
      const expected = expectedComparison({ baselineRun: baseline,
        baselineFindingId: baseline.scan.findings[0]!.findingId, laterRun: terminal, candidates: [] });
      assert.deepEqual(outcome.run, { ...terminal, comparison: expected });
      assert.deepEqual(outcome.run, disk(box.runs, 'later-run'));
      assert.deepEqual(await nested, {
        ok: false, error: 'busy', run: null, persisted: false, cleanupFailed: false,
      });
      assert.deepEqual(service.readRun('later-run'), {
        ok: true, run: outcome.run, interrupted: false, comparisonLineage: { status: 'available' },
      });
      assert.deepEqual(bytes(box.runs, baseline.runId), baselineBefore);
    } finally { t.mock.restoreAll(); }
  });
});

test('fresh baseline recheck permits downstream Finding work but rejects changed native identity', serial, async () => {
  await withReviewSandbox('service', async box => {
    const baseline = seedCompleted(box.runs);
    const service = await start(box);
    const repository = open(box.runs);
    const result = await service.rescanFinding(intent(), async run => {
      const running = runningRetrievalRun(baseline.runId) as unknown as CompletedRun;
      success(repository.updateRetrieval(baseline, running));
      const supported = success(repository.updateRetrieval(running,
        assessedSupportedRetrievalRun(baseline.runId) as unknown as CompletedRun)) as CompletedRun;
      assert.deepEqual(immutableNativeSource(supported), immutableNativeSource(baseline),
        'Downstream baseline work must preserve the native/context comparison source');
      return { run: linkedTerminal(run), candidates: [] };
    });
    assert.ok(result.ok, JSON.stringify(result));
  });

  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const result = await service.rescanFinding(intent(), async run => {
      const file = path.join(box.runs, 'baseline-run', 'run.json');
      const changed = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
      (changed.scan as { findings: Array<{ findingId: string }> }).findings[0]!.findingId = 'changed-finding';
      fs.writeFileSync(file, JSON.stringify(changed, null, 2) + '\n');
      return { run: linkedTerminal(run), candidates: [] };
    });
    assert.deepEqual(result, {
      ok: false, error: 'comparison-lineage', run: disk(box.runs, 'later-run'), persisted: true,
      comparisonPersisted: false, cleanupFailed: false,
    });
  });
});

test('bounds calculation, lineage and persistence failures after scan completion without rewriting the completed run', serial, async t => {
  for (const kind of ['calculation', 'lineage', 'persistence'] as const) {
    await withReviewSandbox('service', async box => {
      seedCompleted(box.runs);
      const service = await start(box);
      const originalRename = fs.renameSync;
      if (kind === 'persistence') t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
        const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string, unknown>;
        if (candidate.runId === `later-${kind}` && Object.hasOwn(candidate, 'comparison')) {
          throw new Error('CONTROLLED_COMPARISON_APPEND_FAILURE');
        }
        return originalRename(from, to);
      });
      try {
        const result = await service.rescanFinding(intent(`later-${kind}`), async run => {
          const terminal = linkedTerminal(run);
          if (kind === 'lineage') {
            const owned = exactOwnedRunDirectory(box.runs, 'baseline-run');
            assert.equal(owned.sha256, createHash('sha256').update(fs.readFileSync(owned.file)).digest('hex'));
            fs.rmSync(owned.directory, { recursive: true, force: false });
          }
          return { run: terminal, candidates: kind === 'calculation' ? [null] : [] };
        });
        const expectedError = `comparison-${kind}`;
        assert.equal(result.ok, false);
        if (result.ok) return;
        assert.equal(result.error, expectedError);
        assert.equal(result.persisted, true);
        assert.equal((result as unknown as { comparisonPersisted: boolean }).comparisonPersisted, false);
        assert.equal(result.cleanupFailed, false);
        assert.ok(result.run?.status === 'completed');
        assert.equal(Object.hasOwn(result.run as object, 'comparison'), false);
        assert.deepEqual(result.run, disk(box.runs, `later-${kind}`));
      } finally { t.mock.restoreAll(); }
    });
  }
});

test('completed-scan publication distinguishes preappend abort/shutdown and failed-append abort precedence', serial, async t => {
  for (const boundary of ['abort', 'shutdown', 'append-abort'] as const) {
    await withReviewSandbox('service', async box => {
      seedCompleted(box.runs);
      const service = await start(box);
      const originalRename = fs.renameSync;
      let operationSignal: AbortSignal | undefined;
      let stopping: Promise<unknown> | undefined;
      t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
        const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string, unknown>;
        if (candidate.runId === `later-${boundary}` && candidate.status === 'completed') {
          const hasComparison = Object.hasOwn(candidate, 'comparison');
          if (boundary === 'shutdown' && !hasComparison) stopping = service.stop();
          if (boundary === 'append-abort' && hasComparison) {
            assert.ok(operationSignal);
            Object.defineProperty(operationSignal, 'aborted', { configurable: true, value: true });
            throw new Error('CONTROLLED_APPEND_FAILURE_WITH_ABORT');
          }
        }
        return originalRename(from, to);
      });
      try {
        const result = await service.rescanFinding(intent(`later-${boundary}`), async (run, signal) => {
          operationSignal = signal;
          const terminal = linkedTerminal(run);
          if (boundary === 'abort') {
            Object.defineProperty(signal, 'aborted', { configurable: true, value: true });
          }
          return { run: terminal, candidates: [] };
        });
        assert.equal(result.ok, false);
        if (!result.ok) {
          const expected = boundary === 'abort' ? 'comparison-aborted'
            : boundary === 'shutdown' ? 'comparison-shutdown' : 'comparison-persistence';
          assert.equal(result.error, expected);
          assert.equal(result.persisted, true);
          assert.equal((result as unknown as { comparisonPersisted: boolean }).comparisonPersisted, false);
          assert.equal(result.cleanupFailed, false);
          assert.ok(result.run?.status === 'completed');
          assert.deepEqual(result.run, disk(box.runs, `later-${boundary}`));
        }
        if (boundary === 'shutdown') {
          assert.ok(stopping);
          await stopping;
        }
      } finally { t.mock.restoreAll(); }
    });
  }
});

test('successful comparison rename is terminal truth while failed append under stop reports shutdown and retains admission', serial, async t => {
  for (const append of ['success', 'failure'] as const) {
    await withReviewSandbox('service', async box => {
      seedCompleted(box.runs);
      const service = await start(box);
      const originalRename = fs.renameSync;
      let stopping: Promise<unknown> | undefined;
      t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
        const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string, unknown>;
        if (candidate.runId === `later-${append}` && Object.hasOwn(candidate, 'comparison')) {
          stopping = service.stop();
          if (append === 'failure') throw new Error('CONTROLLED_STOPPING_APPEND_FAILURE');
        }
        return originalRename(from, to);
      });
      try {
        const result = await service.rescanFinding(intent(`later-${append}`),
          async run => ({ run: linkedTerminal(run), candidates: [] }));
        if (append === 'success') {
          assert.ok(result.ok, JSON.stringify(result));
          assert.ok(Object.hasOwn(result.run, 'comparison'));
        } else {
          assert.equal(result.ok, false);
          if (!result.ok) {
            assert.equal(result.error, 'comparison-shutdown');
            assert.equal(result.persisted, true);
            assert.equal((result as unknown as { comparisonPersisted: boolean }).comparisonPersisted, false);
            assert.equal(result.cleanupFailed, false);
          }
          assert.deepEqual(await service.rescanFinding(intent('blocked-after-stop'),
            async run => ({ run: linkedTerminal(run), candidates: [] })), {
            ok: false, error: 'stopping', run: null, persisted: false, cleanupFailed: false,
          });
        }
        assert.ok(stopping);
        await stopping;
      } finally { t.mock.restoreAll(); }
    });
  }
});

test('append cleanup uncertainty is reported exactly and closes service admission', serial, async t => {
  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const originalRename = fs.renameSync;
    const originalUnlink = fs.unlinkSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string, unknown>;
      if (candidate.runId === 'later-cleanup' && Object.hasOwn(candidate, 'comparison')) {
        throw new Error('CONTROLLED_COMPARISON_RENAME_FAILURE');
      }
      return originalRename(from, to);
    });
    t.mock.method(fs, 'unlinkSync', (target: fs.PathLike) => {
      if (String(target).includes(`${path.sep}later-cleanup${path.sep}run.json.tmp-`)) {
        throw new Error('CONTROLLED_COMPARISON_CLEANUP_FAILURE');
      }
      return originalUnlink(target);
    });
    try {
      const result = await service.rescanFinding(intent('later-cleanup'),
        async run => ({ run: linkedTerminal(run), candidates: [] }));
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.error, 'comparison-persistence');
        assert.equal(result.persisted, true);
        assert.equal((result as unknown as { comparisonPersisted: boolean }).comparisonPersisted, false);
        assert.equal(result.cleanupFailed, true);
        assert.ok(result.run?.status === 'completed');
      }
      assert.deepEqual(await service.rescanFinding(intent('blocked-after-cleanup'),
        async run => ({ run: linkedTerminal(run), candidates: [] })), {
        ok: false, error: 'stopping', run: null, persisted: false, cleanupFailed: false,
      });
    } finally { t.mock.restoreAll(); }
  });
});

test('comparison-bearing baseline action gate has a valid-Finding positive control and exact missing-link refusal', serial, async () => {
  for (const link of ['available', 'deleted', 'deleted-during-scan'] as const) {
    await withReviewSandbox('service', async box => {
      const seeded = seedComparisonBearingBaseline(box.runs);
      const baselineBytes = bytes(box.runs, seeded.baseline.runId);
      const beforeInventory = fs.readdirSync(box.runs).sort();
      let removed: ReturnType<typeof exactOwnedRunDirectory> | undefined;
      if (link === 'deleted') {
        removed = exactOwnedRunDirectory(box.runs, seeded.immediate.runId);
        assert.equal(removed.sha256,
          createHash('sha256').update(fs.readFileSync(removed.file)).digest('hex'));
        fs.rmSync(removed.directory, { recursive: true, force: false });
        assert.equal(fs.existsSync(removed.directory), false);
      }
      const expectedInventory = fs.readdirSync(box.runs).sort();
      const service = await start(box);
      let calls = 0;
      const result = await service.rescanFinding(intent(`later-${link}`), async run => {
        calls++;
        if (link === 'deleted-during-scan') {
          removed = exactOwnedRunDirectory(box.runs, seeded.immediate.runId);
          assert.equal(removed.sha256,
            createHash('sha256').update(fs.readFileSync(removed.file)).digest('hex'));
          fs.rmSync(removed.directory, { recursive: true, force: false });
        }
        return { run: linkedTerminal(run), candidates: [] };
      });
      if (link === 'available') {
        assert.ok(result.ok, JSON.stringify(result));
        assert.equal(calls, 1);
        assert.ok(fs.readdirSync(box.runs).includes('later-available'));
      } else if (link === 'deleted') {
        assert.deepEqual(result, {
          ok: false, error: 'comparison-lineage', run: null, persisted: false, cleanupFailed: false,
        });
        assert.equal(calls, 0);
        assert.deepEqual(fs.readdirSync(box.runs).sort(), expectedInventory);
        assert.equal(fs.existsSync(path.join(box.runs, 'later-deleted')), false);
        assert.ok(removed && path.dirname(removed.directory) === path.resolve(box.runs));
      } else {
        assert.equal(calls, 1);
        assert.equal(result.ok, false);
        if (!result.ok) {
          assert.equal(result.error, 'comparison-lineage');
          assert.equal(result.persisted, true);
          assert.equal((result as unknown as { comparisonPersisted: boolean }).comparisonPersisted, false);
          assert.ok(result.run?.status === 'completed');
        }
        assert.deepEqual(disk(box.runs, 'later-deleted-during-scan'), result.run);
        assert.ok(removed && !fs.existsSync(removed.directory));
      }
      assert.deepEqual(bytes(box.runs, seeded.baseline.runId), baselineBytes);
      assert.deepEqual(beforeInventory, ['baseline-run', 'immediate-run']);
    });
  }
});
