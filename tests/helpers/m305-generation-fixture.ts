import type { GenerationServiceOutcome } from '../../src/server/service.ts';
import type { GenerationAdapter } from '../../src/server/generation/generation-contract.ts';
import {
  failedGenerationRun,
  generationAdapterHarness,
  generationInvocation,
  proposalGenerationRun,
  runningGenerationRun,
} from './m302-generation-fixture.ts';
import {
  assessedSupportedRetrievalRun,
  completedScanRun,
  selectedFinding,
} from './m202-retrieval-service-fixture.ts';

export type M305Mode = 'local' | 'groq';

export function generationIntent(runId = 'run-01', findingId = 'finding-0') {
  return Object.freeze({ runId, findingId });
}

export function supportedGenerationRun(runId = 'run-01', mode: M305Mode = 'local') {
  const run = assessedSupportedRetrievalRun(runId);
  run.providerContext = mode === 'local'
    ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
    : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' };
  return run;
}

export function generationScanRun(runId = 'run-01', mode: M305Mode = 'local') {
  const run = completedScanRun(runId);
  run.providerContext = mode === 'local'
    ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
    : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' };
  return run;
}

export async function supportedGuidanceEnvelope(runId = 'run-01', mode: M305Mode = 'local') {
  const [{ default: fs }, { resolveCitations }] = await Promise.all([
    import('node:fs'),
    import('../../src/server/retrieval/citation-resolution.ts'),
  ]);
  const run = supportedGenerationRun(runId, mode);
  const finding = selectedFinding(run) as any;
  const nativeFinding = selectedFinding(completedScanRun(runId));
  const resolved = resolveCitations(nativeFinding, finding.retrieval.result,
    fs.readFileSync(new URL('../../corpus/wcag22-mvp-v1/manifest.json', import.meta.url)),
    fs.readFileSync(new URL('../../corpus/wcag22-mvp-v1/passages.json', import.meta.url)));
  if (!resolved.ok) throw new Error('Synthetic M305 guidance citations must resolve');
  return { ok: true as const, run, view: {
    runId, findingId: finding.findingId, ...resolved.value,
  } };
}

export function controlledGenerationFactory(mode: M305Mode) {
  const harness = generationAdapterHarness({ mode });
  const calls = { factory: 0 };
  return Object.freeze({
    calls,
    create(): GenerationAdapter {
      calls.factory++;
      return harness.adapter;
    },
    harness,
  });
}

export function controlledMissingPrerequisiteAdapter(): GenerationAdapter {
  const controlled = generationAdapterHarness().adapter;
  return Object.freeze({
    configuration: controlled.configuration,
    prepare: () => Object.freeze({
      ok: false as const,
      error: 'missing-prerequisite' as const,
      cleanup: 'complete' as const,
    }),
  });
}

export function successfulGenerationEnvelope(runId = 'run-01', mode: M305Mode = 'local'):
Extract<GenerationServiceOutcome, { ok: true }> {
  return { ok: true, run: proposalGenerationRun(runId, mode) as never };
}

export function failedGenerationEnvelope(
  error: Extract<GenerationServiceOutcome, { ok: false }>['error'],
  options: {
    readonly run?: Record<string | number, unknown> | null;
    readonly persisted?: boolean;
    readonly cleanupFailed?: boolean;
    readonly invocationPersisted?: boolean;
    readonly invocation?: ReturnType<typeof generationInvocation>;
  } = {},
): Extract<GenerationServiceOutcome, { ok: false }> {
  return {
    ok: false,
    error,
    run: (options.run ?? null) as never,
    persisted: options.persisted ?? false,
    cleanupFailed: options.cleanupFailed ?? false,
    invocationPersisted: options.invocationPersisted ?? false,
    ...(options.invocation ? { invocation: options.invocation } : {}),
  };
}

export { failedGenerationRun, generationInvocation, proposalGenerationRun, runningGenerationRun };

async function manual(): Promise<void> {
  const { startHarness } = await import('./m104-ui-harness.ts');
  const runId = 'm305-manual-local';
  const scan = generationScanRun(runId, 'local');
  const guidance = await supportedGuidanceEnvelope(runId, 'local');
  const generation = successfulGenerationEnvelope(runId, 'local');
  const harness = await startHarness(true);
  try {
    await harness.page.evaluate(({ scan, guidance, generation }) => {
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(scan) });
      window.m104.guidance = () => Promise.resolve(structuredClone(guidance));
      window.m104.generation = () => new Promise(resolve => setTimeout(
        () => resolve(structuredClone(generation)), 1500));
      window.m104.mount(true, {}, true, true);
    }, { scan, guidance, generation });
    if (typeof scan.requestedUrl !== 'string') throw new Error('Synthetic M305 scan needs a requested URL');
    await harness.page.getByLabel('Target URL').fill(scan.requestedUrl);
    await harness.page.getByLabel('Local (recommended)').check();
    await harness.page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await harness.page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
    await harness.page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
    await harness.page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await harness.page.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
    console.log(JSON.stringify({ event: 'm305-manual-ready', origin: harness.origin, synthetic: true,
      mode: 'local', runId }));
    await harness.page.getByRole('button', { name: 'Generate', exact: true }).click();
    await harness.page.getByText('Generating a proposal… A submitted request does not yet confirm a provider call or saved outcome.', { exact: true }).waitFor();
    await harness.page.getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).waitFor();
    console.log(JSON.stringify({ event: 'm305-manual-proposal-ready', origin: harness.origin, synthetic: true,
      mode: 'local', runId }));
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { dispose(); reject(new Error('Manual session reached its 15-minute ceiling')); }, 15 * 60 * 1000);
      const done = () => { dispose(); resolve(); };
      function dispose() { clearTimeout(timer); process.removeListener('SIGINT', done); harness.page.removeListener('close', done); }
      process.once('SIGINT', done);
      harness.page.once('close', done);
    });
  } finally { await harness.close(); }
}

if (process.argv.includes('--manual')) await manual();
