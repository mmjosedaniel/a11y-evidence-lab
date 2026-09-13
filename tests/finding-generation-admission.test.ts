import assert from 'node:assert/strict';
import test from 'node:test';
import { admitGeneration } from '../src/client/finding-generation-admission.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import {
  failedGenerationEnvelope,
  failedGenerationRun,
  generationInvocation,
  proposalGenerationRun,
  runningGenerationRun,
  successfulGenerationEnvelope,
  supportedGenerationRun,
} from './helpers/m305-generation-fixture.ts';

const serial = { concurrency: false };

function valid<T extends Record<string | number, unknown>>(run: T): T {
  assert.ok(validateRun(run).ok, 'Preservation witness must remain a valid independent run');
  return run;
}

test('admits only the selected completed proposal and returns a detached validated aggregate', serial, () => {
  const before = supportedGenerationRun();
  const raw = successfulGenerationEnvelope();
  const expected = structuredClone(raw.run);
  const admitted = admitGeneration(raw, before as never, 'finding-0');
  assert.ok(admitted?.ok);
  assert.deepEqual(admitted, { ok: true, run: expected });
  selectedFinding(raw.run as unknown as Record<string | number, unknown>).locator = { value: ':root > changed' };
  selectedFinding(before).locator = { value: ':root > changed-before' };
  assert.deepEqual(admitted.run, expected);
});

test('client admission preserves historical and current persisted invocation tuples', serial, () => {
  for (const mode of ['local', 'groq'] as const) {
    const before = supportedGenerationRun('run-01', mode);
    for (const promptVersion of ['m302-instructions-v1', 'm302-instructions-v2'] as const) {
      const run = proposalGenerationRun('run-01', mode, promptVersion);
      const admitted = admitGeneration({ ok: true, run } as never, before as never, 'finding-0');
      assert.ok(admitted?.ok, `${mode}:${promptVersion}`);
      if (!admitted?.ok) continue;
      const invocation = (selectedFinding(admitted.run as unknown as Record<string | number, unknown>)
        .generation as Record<string, unknown>).invocation as Record<string, unknown>;
      assert.equal(invocation.promptVersion, promptVersion);
    }
  }
});

test('client admission rejects unknown and mismatched persisted invocation tuples', serial, () => {
  const before = supportedGenerationRun();
  for (const [name, change] of [
    ['unknown prompt', { promptVersion: 'm302-instructions-v3' }],
    ['mismatched schema', { promptVersion: 'm302-instructions-v1', schemaVersion: 'm302-schema-v2' }],
    ['mismatched output', { promptVersion: 'm302-instructions-v2', outputContractVersion: 'm301-proposal-v2' }],
  ] as const) {
    const run = proposalGenerationRun();
    const invocation = (selectedFinding(run).generation as Record<string, unknown>).invocation as Record<string, unknown>;
    Object.assign(invocation, change);
    assert.equal(admitGeneration({ ok: true, run } as never, before as never, 'finding-0'), null, name);
  }
});

test('admits persisted failed generation with exact durable and envelope invocation truth', serial, () => {
  for (const [mode, error, invocation] of [
    ['local', 'network', generationInvocation('local', 'network')],
    ['groq', 'response-validation', generationInvocation('groq', 'response', 'failed')],
    ['local', 'timeout', generationInvocation('local', 'response', 'passed')],
    ['groq', 'shutdown', generationInvocation('groq', 'response', 'passed')],
  ] as const) {
    const before = supportedGenerationRun('run-01', mode);
    const run = failedGenerationRun(error, { mode, invocation });
    const raw = failedGenerationEnvelope(error, {
      run,
      persisted: true,
      cleanupFailed: error === 'shutdown',
      invocationPersisted: true,
      invocation,
    });
    assert.deepEqual(admitGeneration(raw, before as never, 'finding-0'), raw, `${mode}:${error}`);
  }

  const before = supportedGenerationRun();
  const preCall = failedGenerationRun('missing-prerequisite');
  const persistedPreCall = failedGenerationEnvelope('missing-prerequisite', {
    run: preCall,
    persisted: true,
  });
  assert.deepEqual(admitGeneration(persistedPreCall, before as never, 'finding-0'), persistedPreCall);
});

test('distinguishes safe nonpersisted pre-call, running-attempt, known rejection and unknown tuples', serial, () => {
  const before = supportedGenerationRun();
  const preCall = failedGenerationEnvelope('generation-persistence', { run: before });
  assert.deepEqual(admitGeneration(preCall, before as never, 'finding-0'), preCall);

  const invocation = generationInvocation('local', 'network');
  const attempted = failedGenerationEnvelope('generation-persistence', {
    run: runningGenerationRun(), invocation, cleanupFailed: true,
  });
  assert.deepEqual(admitGeneration(attempted, before as never, 'finding-0'), attempted);

  for (const error of ['invalid-request', 'not-found', 'busy', 'workflow-active', 'not-eligible',
    'stopping', 'missing-prerequisite'] as const) {
    const rejected = failedGenerationEnvelope(error);
    assert.deepEqual(admitGeneration(rejected, before as never, 'finding-0'), rejected, error);
  }

  const unknown = failedGenerationEnvelope('response-validation', { cleanupFailed: true });
  assert.deepEqual(admitGeneration(unknown, before as never, 'finding-0'), unknown);
  const deadline = failedGenerationEnvelope('shutdown', {
    run: runningGenerationRun(), cleanupFailed: true,
  });
  assert.deepEqual(admitGeneration(deadline, before as never, 'finding-0'), deadline);
});

test('rejects nonpersisted attempted-only errors and every contradictory persistence tuple', serial, () => {
  const before = supportedGenerationRun();
  for (const error of ['authentication', 'quota', 'rate-limit', 'network', 'provider',
    'response-validation'] as const) {
    assert.equal(admitGeneration(failedGenerationEnvelope(error), before as never, 'finding-0'), null, error);
  }

  const invocation = generationInvocation('local', 'network');
  const durable = failedGenerationRun('network', { invocation });
  const contradictions = [
    failedGenerationEnvelope('network', { run: durable, persisted: true }),
    failedGenerationEnvelope('network', {
      run: durable, persisted: true, invocationPersisted: true,
    }),
    failedGenerationEnvelope('network', {
      run: durable, persisted: true, invocationPersisted: false, invocation,
    }),
    failedGenerationEnvelope('generation-persistence', {
      run: runningGenerationRun(), invocationPersisted: true, invocation,
    }),
    failedGenerationEnvelope('generation-persistence', {
      run: supportedGenerationRun(), invocationPersisted: false, invocation,
    }),
    failedGenerationEnvelope('generation-persistence', { invocation }),
    failedGenerationEnvelope('generation-persistence', {
      run: runningGenerationRun(),
      invocation: generationInvocation('groq', 'network'),
    }),
    failedGenerationEnvelope('network', { persisted: true }),
    { ...failedGenerationEnvelope('network'), extra: true },
  ];
  for (const candidate of contradictions) {
    assert.equal(admitGeneration(candidate, before as never, 'finding-0'), null);
  }
});

test('binds provider mode, run and Finding identity and preserves all nonselected evidence', serial, () => {
  const before = supportedGenerationRun();
  const candidates: unknown[] = [];

  const foreignRun = valid(proposalGenerationRun('run-foreign'));
  candidates.push({ ok: true, run: foreignRun });

  const foreignFinding = valid(proposalGenerationRun());
  assert.equal(admitGeneration({ ok: true, run: foreignFinding }, before as never, 'finding-1'), null);

  const changedSibling = proposalGenerationRun();
  selectedFinding(changedSibling, 1).locator = { value: ':root > :nth-child(99)' };
  candidates.push({ ok: true, run: valid(changedSibling) });

  const changedLocator = proposalGenerationRun();
  selectedFinding(changedLocator).locator = { value: ':root > :nth-child(98)' };
  candidates.push({ ok: true, run: valid(changedLocator) });

  const changedRetrieval = proposalGenerationRun();
  const retrieval = selectedFinding(changedRetrieval).retrieval as Record<string, unknown>;
  const result = retrieval.result as Record<string, unknown>;
  const passages = result.passages as Array<Record<string, unknown>>;
  passages[0]!.score = 0.7;
  candidates.push({ ok: true, run: valid(changedRetrieval) });

  const changedAnalysis = structuredClone(proposalGenerationRun());
  (selectedFinding(changedAnalysis).analysis as Record<string, unknown>).finishedAt =
    '2026-08-30T10:00:03.500Z';
  (selectedFinding(changedAnalysis).retrieval as Record<string, unknown>).finishedAt =
    '2026-08-30T10:00:03.500Z';
  candidates.push({ ok: true, run: valid(changedAnalysis) });

  const reordered = proposalGenerationRun();
  const findings = (reordered.scan as Record<string, unknown>).findings as unknown[];
  findings.reverse();
  candidates.push({ ok: true, run: valid(reordered) });

  candidates.push({ ok: true, run: valid(proposalGenerationRun('run-01', 'groq')) });

  for (const candidate of candidates) {
    assert.equal(admitGeneration(candidate, before as never, 'finding-0'), null);
  }
});

test('rejects a noneligible baseline even when the returned proposal is independently valid', serial, () => {
  const before = valid(proposalGenerationRun());
  const raw = successfulGenerationEnvelope();
  assert.equal(admitGeneration(raw, before as never, 'finding-0'), null);
});

test('never admits a successful proposal through a failed envelope', serial, () => {
  const before = supportedGenerationRun();
  const proposal = proposalGenerationRun();
  for (const error of ['generation-persistence', 'network', 'shutdown'] as const) {
    assert.equal(admitGeneration(failedGenerationEnvelope(error, {
      run: proposal,
      persisted: error !== 'generation-persistence',
    }), before as never, 'finding-0'), null);
  }
});

test('fails closed on accessors, cycles, proxies and hostile baseline reflection without reading secrets', serial, () => {
  let reads = 0;
  const before = supportedGenerationRun();
  const accessor = Object.defineProperty({ ok: true }, 'run', {
    enumerable: true,
    get() { reads++; throw new Error('SYNTHETIC_SECRET'); },
  });
  const cycle: Record<string, unknown> = failedGenerationEnvelope('not-found');
  cycle.run = cycle;
  const hostile = new Proxy(successfulGenerationEnvelope(), {
    ownKeys() { throw new Error('SYNTHETIC_SECRET'); },
  });
  const accessorBefore = supportedGenerationRun();
  Object.defineProperty(selectedFinding(accessorBefore).evidence, 'altState', {
    enumerable: true,
    get() { reads++; throw new Error('SYNTHETIC_SECRET'); },
  });

  for (const [raw, baseline] of [
    [accessor, before], [cycle, before], [hostile, before], [successfulGenerationEnvelope(), accessorBefore],
  ] as const) {
    assert.equal(admitGeneration(raw, baseline as never, 'finding-0'), null);
  }
  assert.equal(reads, 0);
});
