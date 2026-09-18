import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { startLocalService } from '../src/server/service.ts';
import type { LocalService, ServiceOptions } from '../src/server/service.ts';
import type { RescanExecutor, RescanOutcome } from '../src/server/local-service/contracts.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { Finding } from '../src/server/domain/run-contract.ts';
import type { NativeRule } from '../src/server/scan/normalization/native-rule-evidence.ts';
import type { CompletedRun, FailedRun, RunRepository, RunningRun, StoreResult } from '../src/server/persistence/run-repository.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import { completedRun, runningRun } from './helpers/m102-run-fixture.ts';
import {
  assessedSupportedRetrievalRun,
  completedScanRun,
  expectedRetrievalResult,
  failedRetrievalRun,
  runningRetrievalRun,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';
import { generationAdapterHarness, proposalGenerationRun, runningGenerationRun } from './helpers/m302-generation-fixture.ts';
import { reviewedRun } from './helpers/m401-review-fixture.ts';
import { withReviewSandbox, type ReviewSandbox } from './helpers/m401-review-sandbox.ts';

type RescanInput = { runId: string; baselineRunId: string; findingId: string; mode: 'local' | 'groq' };
type RescanFailure = Extract<RescanOutcome, { ok: false }>;
type RescanService = LocalService & {
  rescanFinding(input: unknown, execute?: RescanExecutor): Promise<RescanOutcome>;
};

const serial = { concurrency: false };
const revision = 'b'.repeat(40);

function success<T>(result: StoreResult<T>): T { assert.ok(result.ok, JSON.stringify(result)); return result.value; }
function open(root: string): RunRepository { return success(openRunRepository(root)); }
function disk(root: string, runId: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(root, runId, 'run.json'), 'utf8'));
}
function bytes(root: string, runId: string): Buffer {
  return fs.readFileSync(path.join(root, runId, 'run.json'));
}
function intent(runId = 'run-rescan', baselineRunId = 'run-baseline', mode: 'local' | 'groq' = 'groq'): RescanInput {
  return { runId, baselineRunId, findingId: 'finding-0', mode };
}
function failed(outcome: RescanOutcome, error: RescanFailure['error']): RescanFailure {
  assert.equal(outcome.ok, false);
  assert.equal(outcome.error, error);
  return outcome;
}
function linkedTerminal(run: RunningRun, kind: 'populated' | 'zero' = 'populated'): CompletedRun {
  const sample = completedRun(run.runId, run.providerContext.mode, kind);
  const finishedAt = new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString();
  const candidate = {
    formatVersion: run.formatVersion,
    runId: run.runId,
    baselineRunId: (run as RunningRun & { baselineRunId: string }).baselineRunId,
    createdAt: run.createdAt,
    applicationRevision: run.applicationRevision,
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    status: 'completed',
    finishedAt,
    scan: {
      ...sample.scan,
      context: {
        ...run.scanContext,
        finalUrl: sample.scan.context.finalUrl,
        scannedAt: { value: finishedAt },
        browserVersion: sample.scan.context.browserVersion,
        readinessReached: true,
        cleanup: 'closed',
      },
    },
  };
  const checked = validateRun(candidate);
  if (!checked.ok || checked.value.status !== 'completed') {
    assert.fail('Linked terminal fixture must satisfy the production validator');
  }
  return checked.value as CompletedRun;
}
function linkedFailure(run: RunningRun, cleanup: 'closed' | 'failed'): FailedRun {
  const finishedAt = new Date(Math.max(Date.now(), Date.parse(run.createdAt))).toISOString();
  const candidate = {
    formatVersion: run.formatVersion,
    runId: run.runId,
    baselineRunId: (run as RunningRun & { baselineRunId: string }).baselineRunId,
    createdAt: run.createdAt,
    applicationRevision: run.applicationRevision,
    requestedUrl: run.requestedUrl,
    providerContext: run.providerContext,
    status: 'failed',
    finishedAt,
    scanContext: { ...run.scanContext, cleanup },
    failure: { category: cleanup === 'failed' ? 'cleanup' : 'navigation' },
  };
  const checked = validateRun(candidate);
  if (!checked.ok || checked.value.status !== 'failed') assert.fail('Linked failure fixture must be valid');
  return checked.value as FailedRun;
}
function linkedEnvelope(run: RunningRun, kind: 'populated' | 'zero' = 'populated') {
  return { run: linkedTerminal(run, kind), candidates: [] };
}
function failedEnvelope(run: RunningRun, cleanup: 'closed' | 'failed') {
  return { run: linkedFailure(run, cleanup) };
}
function seedCompleted(root: string, runId = 'run-baseline', kind: 'populated' | 'unavailable' = 'populated'): CompletedRun {
  const store = open(root);
  success(store.create(runningRun(runId)));
  return success(store.finish(completedRun(runId, 'local', kind))) as CompletedRun;
}
function seedFailedFinding(root: string, runId: string): CompletedRun {
  const original = seedCompleted(root, runId);
  const store = open(root);
  const running = runningRetrievalRun(runId) as unknown as CompletedRun;
  success(store.updateRetrieval(original, running));
  return success(store.updateRetrieval(running, failedRetrievalRun(runId) as unknown as CompletedRun));
}
function seedReviewedFinding(root: string, runId: string): CompletedRun {
  const original = seedCompleted(root, runId);
  const store = open(root);
  const retrievalRunning = runningRetrievalRun(runId) as unknown as CompletedRun;
  const supported = assessedSupportedRetrievalRun(runId) as unknown as CompletedRun;
  const generationRunning = runningGenerationRun(runId) as unknown as CompletedRun;
  const pending = proposalGenerationRun(runId) as unknown as CompletedRun;
  const reviewed = { ...reviewedRun('approve'), runId } as unknown as CompletedRun;
  success(store.updateRetrieval(original, retrievalRunning));
  success(store.updateRetrieval(retrievalRunning, supported));
  success(store.updateGeneration(supported, generationRunning));
  success(store.updateGeneration(generationRunning, pending));
  return success(store.updateReview(pending, reviewed));
}
async function start(box: ReviewSandbox, options: Partial<ServiceOptions> = {}): Promise<RescanService> {
  const result = await startLocalService({ runRoot: box.runs, applicationRevision: revision, ...options });
  assert.ok(result.ok);
  box.services.push(result.service);
  return result.service as RescanService;
}
async function retrieve(service: LocalService, runId: string) {
  return service.retrieveFinding({ runId, findingId: 'finding-0' }, async () => expectedRetrievalResult());
}

test('creates an independent exact-ID linked run from baseline evidence without mutating the baseline', serial, async () => {
  await withReviewSandbox('service', async box => {
    const baseline = seedCompleted(box.runs);
    const before = bytes(box.runs, baseline.runId);
    const service = await start(box);
    let calls = 0;
    const outcome = await service.rescanFinding(intent(), async (running: RunningRun, signal: AbortSignal,
      rule: NativeRule) => {
      calls++;
      assert.equal(signal.aborted, false);
      assert.equal(rule, 'image-alt');
      assert.equal(running.runId, 'run-rescan');
      assert.equal((running as RunningRun & { baselineRunId: string }).baselineRunId, baseline.runId);
      assert.equal(running.requestedUrl, baseline.requestedUrl);
      assert.deepEqual(running.providerContext,
        { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' });
      return linkedEnvelope(running);
    });
    assert.equal(outcome.ok, true);
    assert.equal(calls, 1);
    assert.deepEqual(outcome.ok && outcome.run, disk(box.runs, 'run-rescan'));
    assert.equal(outcome.ok && outcome.run.scan.findings.every((finding: Finding) => finding.state === 'unprocessed'), true);
    assert.deepEqual(bytes(box.runs, baseline.runId), before);
  });
});

test('reserves before reflection, reads only actual Findings, and accepts downstream state or unavailable locator', serial, async () => {
  const states = [
    ['unprocessed', (root: string, id: string) => seedCompleted(root, id)],
    ['failed', seedFailedFinding],
    ['reviewed', seedReviewedFinding],
    ['unavailable', (root: string, id: string) => seedCompleted(root, id, 'unavailable')],
  ] as const;
  await withReviewSandbox('service', async box => {
    for (const [suffix, seed] of states) {
      const run = seed(box.runs, `fixture-${suffix}`);
      assert.equal(run.status, 'completed');
      assert.deepEqual(success(open(box.runs).read(`fixture-${suffix}`)), run);
    }
  });

  for (const [suffix, seed] of states) {
    await withReviewSandbox('service', async box => {
      const baselineId = `baseline-${suffix}`;
      seed(box.runs, baselineId);
      const service = await start(box);
      let reentry: Promise<RescanOutcome> | undefined;
      let reentered = false;
      const enter = () => {
        if (reentered) return;
        reentered = true;
        reentry = service.rescanFinding(intent(`nested-${suffix}`, baselineId),
          async (run: RunningRun) => linkedEnvelope(run));
      };
      const requested = intent(`later-${suffix}`, baselineId, suffix === 'unprocessed' ? 'local' : 'groq');
      const raw = new Proxy(requested, {
        getPrototypeOf(target) {
          enter();
          return Reflect.getPrototypeOf(target);
        },
        ownKeys(target) {
          enter();
          return Reflect.ownKeys(target);
        },
      });
      const result = await service.rescanFinding(raw, async (run: RunningRun) => linkedEnvelope(run));
      assert.equal(result.ok, true);
      assert.equal(result.ok && result.run.scan.findings.every((finding: Finding) => finding.state === 'unprocessed'), true);
      assert.equal((await reentry!).ok, false);
      assert.equal(failed(await reentry!, 'busy').run, null);
    });
  }

  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    let calls = 0;
    const execute: RescanExecutor = async (run: RunningRun) => { calls++; return linkedEnvelope(run); };
    assert.deepEqual(failed(await service.rescanFinding({ ...intent(), findingId: 'observation-only' }, execute), 'not-found'),
      { ok: false, error: 'not-found', run: null, persisted: false, cleanupFailed: false });
    assert.deepEqual(failed(await service.rescanFinding({ ...intent(), findingId: 'missing-finding' }, execute), 'not-found'),
      { ok: false, error: 'not-found', run: null, persisted: false, cleanupFailed: false });
    assert.equal(calls, 0);
  });
});

test('rejects malformed, missing, noncompleted and colliding work without retry or executor effects', serial, async () => {
  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const store = open(box.runs);
    success(store.create(runningRun('run-running')));
    success(store.create(runningRun('run-collision')));
    seedCompleted(box.runs, 'run-malformed');
    const malformed = disk(box.runs, 'run-malformed') as Record<string, unknown>;
    fs.writeFileSync(path.join(box.runs, 'run-malformed', 'run.json'),
      JSON.stringify({ ...malformed, unexpected: true }, null, 2) + '\n');
    let calls = 0;
    const service = await start(box);
    const execute: RescanExecutor = async (run: RunningRun) => { calls++; return linkedEnvelope(run); };
    for (const [raw, error] of [
      [null, 'invalid-request'],
      [{ ...intent(), extra: true }, 'invalid-request'],
      [{ ...intent(), runId: 'run-baseline' }, 'invalid-request'],
      [intent('run-missing', 'absent'), 'not-found'],
      [intent('run-from-running', 'run-running'), 'not-eligible'],
      [intent('run-from-malformed', 'run-malformed'), 'invalid-run'],
      [intent('run-collision'), 'create-failed'],
    ] as const) {
      const result = failed(await service.rescanFinding(raw, execute), error);
      assert.equal(result.run, null);
      assert.equal(result.persisted, false);
      assert.equal(result.cleanupFailed, false);
    }
    assert.equal(calls, 0);
    assert.deepEqual(success(open(box.runs).read('run-collision')), runningRun('run-collision'));
  });
});

test('validates immutable linked terminal identity and preserves truthful failure and shutdown publication', serial, async () => {
  for (const [name, execute, error] of [
    ['throw', async () => { throw new Error('SYNTHETIC_SCAN_FAILURE'); }, 'scan-failed'],
    ['malformed', async () => null, 'result-validation'],
    ['removed-link', async (run: RunningRun) => {
      const terminal = structuredClone(linkedEnvelope(run)) as unknown as { run: Record<string, unknown> };
      delete terminal.run.baselineRunId;
      return terminal;
    }, 'result-validation'],
    ['changed-link', async (run: RunningRun) => ({ run: { ...linkedTerminal(run), baselineRunId: 'run-other' }, candidates: [] }), 'result-validation'],
  ] as const) {
    await withReviewSandbox('service', async box => {
      seedCompleted(box.runs);
      const baseline = bytes(box.runs, 'run-baseline');
      const service = await start(box);
      const outcome = failed(await service.rescanFinding(intent(`run-${name}`), execute), error);
      assert.equal(outcome.run?.runId, `run-${name}`);
      assert.equal((outcome.run as FailedRun & { baselineRunId: string }).baselineRunId, 'run-baseline');
      assert.equal(outcome.persisted, true);
      assert.deepEqual(bytes(box.runs, 'run-baseline'), baseline);
      if (name === 'throw') {
        assert.equal(outcome.cleanupFailed, true);
        assert.deepEqual(await service.rescanFinding(intent('run-after-throw'),
          async (run: RunningRun) => linkedEnvelope(run)),
        { ok: false, error: 'stopping', run: null, persisted: false, cleanupFailed: false });
      }
    });
  }

  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box, { stopTimeoutMs: 1000 });
    const operation = service.rescanFinding(intent('run-shutdown'), async (run: RunningRun, signal: AbortSignal) => {
      await new Promise<void>(resolve => signal.addEventListener('abort', () => resolve(), { once: true }));
      return linkedEnvelope(run);
    });
    const stopping = service.stop();
    const outcome = failed(await operation, 'shutdown');
    assert.equal(outcome.persisted, true);
    assert.equal((await stopping).ok, true);
    assert.equal((disk(box.runs, 'run-shutdown') as { status: string }).status, 'failed');
  });
});

test('cleanup uncertainty closes admission and a late stop deadline cannot publish late completion', serial, async () => {
  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    const uncertain = failed(await service.rescanFinding(intent('run-cleanup'),
      async (run: RunningRun) => failedEnvelope(run, 'failed')),
      'scan-failed');
    assert.equal(uncertain.persisted, true);
    assert.equal(uncertain.cleanupFailed, true);
    assert.deepEqual(failed(await service.rescanFinding(intent('run-after-cleanup'),
      async (run: RunningRun) => linkedEnvelope(run)), 'stopping'),
      { ok: false, error: 'stopping', run: null, persisted: false, cleanupFailed: false });
    assert.equal((await service.stop()).ok, false);
  });

  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box, { stopTimeoutMs: 10 });
    let entered!: () => void;
    const started = new Promise<void>(resolve => { entered = resolve; });
    let finish!: (value: unknown) => void;
    const late = new Promise<unknown>(resolve => { finish = resolve; });
    let running!: RunningRun;
    const operation = service.rescanFinding(intent('run-late'), async (run: RunningRun) => {
      running = run;
      entered();
      return late;
    });
    await started;
    const stopping = service.stop();
    assert.deepEqual(await stopping, { ok: false, error: 'stop-failed' });
    finish(linkedEnvelope(running));
    const outcome = failed(await operation, 'shutdown');
    assert.equal(outcome.run?.runId, 'run-late');
    assert.equal(outcome.persisted, false);
    assert.equal((disk(box.runs, 'run-late') as { status: string }).status, 'running');
  });
});

test('durable success retires supported retrieval ownership and permits the later workflow', serial, async () => {
  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    assert.equal((await retrieve(service, 'run-baseline')).ok, true);
    const result = await service.rescanFinding(intent(), async (run: RunningRun) => linkedEnvelope(run));
    assert.equal(result.ok, true);
    const oldGeneration = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
      generationAdapterHarness().adapter);
    assert.equal(oldGeneration.ok, false);
    assert.equal(oldGeneration.error, 'workflow-active');
    assert.equal((await retrieve(service, 'run-rescan')).ok, true);
  });
});

test('durable success retires a settled unsaved generation owner while failures preserve prior capability', serial, async t => {
  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    assert.equal((await retrieve(service, 'run-baseline')).ok, true);
    const originalRename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string | number, unknown>;
      const generation = selectedFinding(candidate).generation as Record<string, unknown> | undefined;
      if (generation?.status === 'completed') throw new Error('SYNTHETIC_UNSAVED_GENERATION');
      return originalRename(from, to);
    });
    try {
      const generation = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
        generationAdapterHarness().adapter);
      assert.equal(generation.ok, false);
      if (!generation.ok) assert.equal(generation.error, 'generation-persistence');
    } finally { t.mock.restoreAll(); }

    assert.equal((await service.rescanFinding(intent(), async (run: RunningRun) => linkedEnvelope(run))).ok, true);
    const oldGeneration = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
      generationAdapterHarness().adapter);
    assert.equal(oldGeneration.ok, false);
    if (!oldGeneration.ok) assert.equal(oldGeneration.error, 'workflow-active');
    assert.equal((await retrieve(service, 'run-rescan')).ok, true);
  });

  for (const [raw, prepare, execute, expected] of [
    [{ ...intent('run-invalid'), extra: true }, () => undefined,
      async (run: RunningRun) => linkedEnvelope(run), 'invalid-request'],
    [intent('run-missing', 'missing-baseline'), () => undefined,
      async (run: RunningRun) => linkedEnvelope(run), 'not-found'],
    [intent('run-collision'), (root: string) => success(open(root).create(runningRun('run-collision'))),
      async (run: RunningRun) => linkedEnvelope(run), 'create-failed'],
    [intent('run-scan-failure'), () => undefined,
      async (run: RunningRun) => failedEnvelope(run, 'closed'), 'scan-failed'],
  ] as const) {
    await withReviewSandbox('service', async box => {
      seedCompleted(box.runs);
      prepare(box.runs);
      const service = await start(box);
      assert.equal((await retrieve(service, 'run-baseline')).ok, true);
      const before = bytes(box.runs, 'run-baseline');
      assert.equal(failed(await service.rescanFinding(raw, execute), expected).ok, false);
      assert.deepEqual(bytes(box.runs, 'run-baseline'), before);
      const oldGeneration = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
        generationAdapterHarness().adapter);
      assert.equal(oldGeneration.ok, true, 'Failed rescan must preserve the supported retrieval capability');
    });
  }

  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    assert.equal((await retrieve(service, 'run-baseline')).ok, true);
    const originalRename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as { runId?: string; status?: string };
      if (candidate.runId === 'run-publication' && candidate.status === 'completed') {
        throw new Error('SYNTHETIC_RESCAN_PUBLICATION_FAILURE');
      }
      return originalRename(from, to);
    });
    try {
      const before = bytes(box.runs, 'run-baseline');
      const result = failed(await service.rescanFinding(intent('run-publication'),
        async (run: RunningRun) => linkedEnvelope(run)),
        'initial-persistence');
      assert.equal(result.persisted, true);
      assert.deepEqual(bytes(box.runs, 'run-baseline'), before);
    } finally { t.mock.restoreAll(); }
    const oldGeneration = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
      generationAdapterHarness().adapter);
    assert.equal(oldGeneration.ok, true, 'Publication failure must preserve the supported retrieval capability');
  });

  await withReviewSandbox('service', async box => {
    seedCompleted(box.runs);
    const service = await start(box);
    assert.equal((await retrieve(service, 'run-baseline')).ok, true);
    const originalRename = fs.renameSync;
    t.mock.method(fs, 'renameSync', (from: fs.PathLike, to: fs.PathLike) => {
      const candidate = JSON.parse(fs.readFileSync(from, 'utf8')) as Record<string | number, unknown>;
      const generation = selectedFinding(candidate).generation as Record<string, unknown> | undefined;
      if (generation?.status === 'completed') throw new Error('SYNTHETIC_RETAINED_GENERATION');
      return originalRename(from, to);
    });
    try {
      const generation = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
        generationAdapterHarness().adapter);
      assert.equal(generation.ok, false);
      if (!generation.ok) assert.equal(generation.error, 'generation-persistence');
    } finally { t.mock.restoreAll(); }
    const before = bytes(box.runs, 'run-baseline');
    assert.equal(failed(await service.rescanFinding(intent('run-retained-owner-failure'),
      async (run: RunningRun) => failedEnvelope(run, 'closed')), 'scan-failed').ok, false);
    assert.deepEqual(bytes(box.runs, 'run-baseline'), before);
    const stillOwned = await service.generateFinding({ runId: 'run-baseline', findingId: 'finding-0' },
      generationAdapterHarness().adapter);
    assert.equal(stillOwned.ok, false);
    if (!stillOwned.ok) assert.equal(stillOwned.error, 'workflow-active');
  });
});
