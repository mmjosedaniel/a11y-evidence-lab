import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from 'playwright';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';
import { completedRun, failedRun } from './helpers/m102-run-fixture.ts';
import {
  failedGenerationEnvelope, generationInvocation, generationScanRun, runningGenerationRun,
  supportedGuidanceEnvelope,
} from './helpers/m305-generation-fixture.ts';
import { reviewProfileStages, reviewedProfileRun } from './helpers/m402-review-fixture.ts';
import { repo, richRun, startHarness, valid } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
type Mode = 'local' | 'groq';

const unknownCopy = 'Rescan outcome unknown. The service may have created a later run. Further actions are blocked.';
const baselineCopy = 'Baseline evidence — read-only. Return to later results to continue.';
const captureFlag = 'A11Y_M501_CAPTURE_PROOF';
const proofRoot = path.join(repo, 'temp/m501-rescan-proof');

let harness: Harness;
let page: Page;
let baseline: CompleteRun;

const status = () => page.getByRole('status');
const results = () => page.getByRole('region', { name: 'Results', exact: true });
const findings = () => page.getByRole('region', { name: 'Findings', exact: true });
const modeSelect = () => page.getByLabel('New scan mode', { exact: true });
const rescanButton = () => page.getByRole('button', { name: 'Start intentional rescan', exact: true });

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

function laterRun(before: CompleteRun, runId: string, mode: Mode, zero = false): CompleteRun {
  const template = structuredClone(completedRun(runId, mode, zero ? 'zero' : 'populated')) as CompleteRun;
  return valid<CompleteRun>({
    ...template,
    baselineRunId: before.runId,
    requestedUrl: before.requestedUrl,
    scan: { ...template.scan, context: { ...template.scan.context, finalUrl: before.scan.context.finalUrl } },
  });
}

function laterFailure(before: CompleteRun, runId: string, mode: Mode,
  cleanup: 'closed' | 'failed' = 'closed'): FailedRun {
  const template = structuredClone(failedRun(runId, mode, cleanup)) as FailedRun;
  return valid<FailedRun>({ ...template, baselineRunId: before.runId, requestedUrl: before.requestedUrl });
}

async function mountBaseline(run = richRun('m501-baseline-01'), accessor = false): Promise<CompleteRun> {
  baseline = run;
  await page.evaluate(({ run, accessor }) => {
    window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
    window.m104.rescan = () => Promise.resolve({ status: 400,
      body: { ok: false, error: 'invalid-request', run: null, persisted: false, cleanupFailed: false } });
    window.m104.mount(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
      false, true, false, true, accessor);
  }, { run, accessor });
  await page.getByLabel('Target URL').fill(run.requestedUrl);
  await page.getByLabel(run.providerContext.mode === 'local' ? 'Local (recommended)' : 'Groq').check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await results().waitFor();
  return run;
}

async function selectFinding(index = 0): Promise<void> {
  await findings().getByRole('button').nth(index).click();
  await page.getByRole('region', { name: /evidence/i }).waitFor();
}

async function configureRescan(value: unknown | 'hold', accessor = false, key = 'rescan'): Promise<void> {
  await page.evaluate(({ value, accessor, key }) => {
    window.m104.rescan = value === 'hold'
      ? () => window.m104.hold(key)
      : () => Promise.resolve(structuredClone(value));
    window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
      false, true, false, true, accessor);
  }, { value, accessor, key });
  await paint();
}

async function configureSuccessfulRescan(before: CompleteRun, mode: Mode, zero = false): Promise<void> {
  const template = laterRun(before, 'run-m501-template', mode, zero);
  await page.evaluate(template => {
    window.m104.rescan = intent => Promise.resolve({ status: 200, body: { ok: true, run: {
      ...structuredClone(template), runId: intent.runId, baselineRunId: intent.baselineRunId,
    } } });
    window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
      false, true, false, true, false);
  }, template);
  await paint();
}

async function resolveSuccessfulRescan(key: string, before: CompleteRun, mode: Mode, zero = false): Promise<CompleteRun> {
  const calls = await rescanCalls();
  const intent = calls.at(-1)!.value as { runId: string };
  const linked = laterRun(before, intent.runId, mode, zero);
  await page.evaluate(({ key, linked }) => window.m104.resolveKey(key, {
    status: 200, body: { ok: true, run: structuredClone(linked) },
  }), { key, linked });
  return linked;
}

async function submit(mode: Mode): Promise<void> {
  assert.equal(await modeSelect().count(), 1, 'Selected Finding must expose the intentional-rescan mode control');
  await modeSelect().selectOption(mode);
  await rescanButton().click();
}

async function rescanCalls(): Promise<Array<{ value: unknown; callback: number; aborted: boolean }>> {
  return page.evaluate(() => window.m104.calls.filter(call => call.stage === 'rescan').map(call => ({
    value: call.stage === 'rescan' ? call.value : null,
    callback: call.callback,
    aborted: call.stage === 'rescan' && call.signal.aborted,
  })));
}

async function saveRescanSubmitHandler(name: string): Promise<void> {
  const form = modeSelect().locator('xpath=ancestor::form');
  await form.evaluate((node, name) => {
    const reactKey = Object.keys(node).find(key => key.startsWith('__reactProps$'));
    const handler = reactKey ? (node as any)[reactKey]?.onSubmit : undefined;
    if (typeof handler !== 'function') throw new Error('Rescan form must expose its submit handler');
    window.m104.raw = { ...(window.m104.raw ?? {}), [name]: handler };
  }, name);
}

async function invokeSavedSubmitHandler(name: string): Promise<void> {
  await page.evaluate(name => {
    const handler = window.m104.raw?.[name];
    if (typeof handler !== 'function') throw new Error('Saved rescan handler is unavailable');
    handler({ preventDefault() {} });
  }, name);
  await paint();
}

function ordinaryDirectory(target: string): void {
  const full = path.resolve(target);
  assert.equal(path.dirname(full), path.join(repo, 'temp'));
  const temp = path.join(repo, 'temp');
  for (const candidate of [temp, ...(fs.existsSync(full) ? [full] : [])]) {
    const stat = fs.lstatSync(candidate);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
    assert.equal(fs.realpathSync.native(candidate).toLowerCase(), candidate.toLowerCase());
    assert.equal(stat.nlink >= 1, true);
  }
}

async function capture(name: string): Promise<void> {
  ordinaryDirectory(proofRoot);
  if (!fs.existsSync(proofRoot)) fs.mkdirSync(proofRoot, { recursive: false });
  ordinaryDirectory(proofRoot);
  const target = path.join(proofRoot, `${name}.png`);
  assert.equal(path.dirname(target), proofRoot);
  assert.equal(fs.existsSync(target), false, `Capture is create-only: ${target}`);
  const bytes = await page.screenshot({ fullPage: true });
  fs.writeFileSync(target, bytes, { flag: 'wx' });
}

async function assertAccessibleState(): Promise<void> {
  const audit = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(audit.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
}

describe('M5-01 intentional rescan UI', { concurrency: false, timeout: 120000 }, () => {
  before(async () => {
    assert.equal(process.env.A11Y_M402_CAPTURE_PROOF, undefined);
    assert.equal(process.env.A11Y_M305_CAPTURE_PROOF, undefined);
    harness = await startHarness(false, 'app');
    page = harness.page;
  });

  after(async () => { await harness.close(); });
  beforeEach(async () => { await mountBaseline(); });

  it('offers a fresh explicit mode only for a selected Finding and validates missing selection', async () => {
    assert.equal(await modeSelect().count(), 0, 'The accepted rescan control is the initial behavioral Red');
    await selectFinding();
    assert.equal(await modeSelect().count(), 1);
    assert.equal(await modeSelect().inputValue(), '');
    assert.deepEqual(await modeSelect().locator('option').allTextContents(), ['Choose a mode', 'Local', 'Groq']);
    await rescanButton().click();
    assert.ok(await modeSelect().evaluate(node => node === document.activeElement));
    assert.equal((await status().innerText()).trim(), 'Choose a new scan mode.');
    assert.equal((await rescanCalls()).length, 0);

    await findings().getByRole('button').last().click();
    const detail = page.getByRole('region', { name: /evidence/i });
    assert.equal(await detail.getByText('Needs manual review', { exact: true }).count(), 1);
    assert.equal(await modeSelect().count(), 0, 'Scanner review observations never expose rescan');

    await mountBaseline(valid<CompleteRun>(completedRun('m501-unavailable-locator', 'local', 'unavailable')));
    await selectFinding();
    assert.equal(await modeSelect().count(), 1, 'An unavailable locator does not remove an actual Finding action');

    await mountBaseline(reviewedProfileRun('approve', 'image-alt', 'm501-reviewed-finding'));
    await selectFinding();
    assert.equal(await modeSelect().count(), 1, 'A final reviewed Finding remains an eligible rescan selection');

    await page.evaluate(() => {
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, false, false);
    });
    await submit('local');
    await results().getByText(/Rescan is unavailable/i).waitFor();
    assert.equal((await rescanCalls()).length, 0, 'Missing callback is a local no-call refusal');
    assert.equal(await modeSelect().inputValue(), '', 'A released local refusal requires a fresh explicit mode');
  });

  it('allocates one fresh run identity per valid submit and reads the callback only after reservation', async () => {
    await mountBaseline(richRun('m501-identity'), true);
    await selectFinding();
    await configureRescan('hold', true, 'identity');
    await page.evaluate(() => {
      window.m104.rescanAccessor = callback => {
        (document.querySelector('button[type="submit"]') as HTMLButtonElement | null)?.click();
        return callback;
      };
    });
    assert.equal(await page.evaluate(() => window.m104.rescanReads), 0,
      'Rendering and selection must not inspect the optional callback');
    const analyzeBeforeReflection = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length);
    await submit('local');
    const calls = await rescanCalls();
    assert.equal(calls.length, 1);
    const intent = calls[0]!.value as { runId: string; baselineRunId: string; findingId: string; mode: string };
    assert.match(intent.runId, /^run-[0-9a-f-]{36}$/i);
    assert.notEqual(intent.runId, baseline.runId);
    assert.equal(intent.baselineRunId, baseline.runId);
    assert.equal(intent.findingId, baseline.scan.findings[0]!.findingId);
    assert.equal(intent.mode, 'local', 'Selecting the same mode remains an explicit new intent');
    assert.equal(await page.evaluate(() => window.m104.rescanReads), 1);
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length),
      analyzeBeforeReflection, 'Reentrant callback reflection cannot dispatch Analyze after rescan reservation');
    await rescanButton().dispatchEvent('click');
    assert.equal((await rescanCalls()).length, 1, 'Pending submission cannot allocate or dispatch another identity');
    await page.evaluate(() => window.m104.resolveKey('identity', {
      status: 409, body: { ok: false, error: 'not-eligible', run: null, persisted: false, cleanupFailed: false },
    }));
    await results().getByText(/Finding is not eligible for a rescan/i).waitFor();
    await submit('local');
    const second = await rescanCalls();
    assert.equal(second.length, 2);
    assert.notEqual((second[1]!.value as { runId: string }).runId, intent.runId,
      'A later valid submission allocates a new identity exactly once');
    await page.evaluate(() => window.m104.resolveKey('identity', {
      status: 409, body: { ok: false, error: 'not-eligible', run: null, persisted: false, cleanupFailed: false },
    }));
  });

  it('preserves the baseline, selected Finding and chosen mode while pending and blocks competing mutations', async () => {
    await selectFinding(1);
    const selectedLabel = await findings().getByRole('button').nth(1).innerText();
    await configureRescan('hold', false, 'pending');
    await submit('groq');
    assert.equal(await modeSelect().inputValue(), 'groq');
    assert.equal(await results().getByText(baseline.scan.context.finalUrl.value, { exact: true }).count(), 1);
    assert.equal(await findings().getByRole('button').nth(1).getAttribute('aria-pressed'), 'true');
    assert.ok((await page.getByRole('main').innerText()).includes(selectedLabel.trim().split('\n')[0]!));
    assert.match(await status().innerText(), /rescan|scan.*started|pending/i);
    await findings().getByRole('button').last().click();
    assert.match(await results().innerText(), /rescan|scan.*started|pending/i,
      'Run-scoped pending status remains visible when a scanner observation is selected');
    await selectFinding(1);
    const before = await page.evaluate(() => window.m104.calls.length);
    const analyze = page.getByRole('button', { name: 'Analyze', exact: true });
    const guidance = page.getByRole('button', { name: 'Get guidance', exact: true });
    assert.equal(await analyze.count(), 1);
    assert.equal(await guidance.count(), 1);
    assert.equal(await rescanButton().count(), 1);
    await analyze.dispatchEvent('click');
    await guidance.dispatchEvent('click');
    await rescanButton().dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.length), before);
    await page.evaluate(() => window.m104.resolveKey('pending', {
      status: 503, body: { ok: false, error: 'shutdown', run: null, persisted: false, cleanupFailed: false },
    }));
  });

  it('releases only definite clean refusals and presents correlated failed runs without losing baseline evidence', async () => {
    const cases = [
      { name: 'not eligible', message: /Finding is not eligible for a rescan/i, response: { status: 409, body: { ok: false, error: 'not-eligible', run: null, persisted: false, cleanupFailed: false } }, released: true },
      { name: 'busy', message: /another operation.*active/i, response: { status: 409, body: { ok: false, error: 'busy', run: null, persisted: false, cleanupFailed: false } }, released: false },
      { name: 'stopping', message: /service is stopping/i, response: { status: 503, body: { ok: false, error: 'stopping', run: null, persisted: false, cleanupFailed: false } }, released: false },
      { name: 'shutdown', message: /service (?:is )?stopped/i, response: { status: 503, body: { ok: false, error: 'shutdown', run: null, persisted: false, cleanupFailed: false } }, released: false },
    ] as const;
    for (const scenario of cases) {
      await mountBaseline(richRun(`m501-${scenario.name.replace(' ', '-')}`));
      await selectFinding();
      await configureRescan(scenario.response);
      await submit('groq');
      await results().getByText(scenario.message).waitFor();
      assert.equal(await modeSelect().inputValue(), scenario.released ? '' : 'groq');
      const analyzeBefore = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length);
      await page.getByRole('button', { name: 'Analyze', exact: true }).dispatchEvent('click');
      assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length),
        analyzeBefore + (scenario.released ? 1 : 0), scenario.name);
    }

    await mountBaseline(richRun('m501-failed-run'));
    await selectFinding();
    await configureRescan('hold', false, 'failed-rescan');
    await submit('groq');
    const failedIntent = (await rescanCalls()).at(-1)!.value as { runId: string };
    const failed = laterFailure(baseline, failedIntent.runId, 'groq');
    await page.evaluate(failed => window.m104.resolveKey('failed-rescan', { status: 500,
      body: { ok: false, error: 'scan-failed', run: structuredClone(failed), persisted: false, cleanupFailed: false },
    }), failed);
    await results().getByText(/not saved/i).waitFor();
    assert.match(await results().innerText(), /not saved/i);
    assert.equal(await results().getByText(baseline.scan.context.finalUrl.value, { exact: true }).count(), 1,
      'The baseline remains present after a released failed rescan');
    assert.equal(await modeSelect().inputValue(), '');
  });

  it('retains all mutation locks for unknown or cleanup-uncertain outcomes and never retries', async () => {
    await selectFinding();
    await page.evaluate(() => {
      window.m104.rescan = () => Promise.reject(new Error('PRIVATE'));
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    });
    await submit('groq');
    await results().getByText(unknownCopy, { exact: true }).waitFor();
    await findings().getByRole('button').last().click();
    assert.equal(await results().getByText(unknownCopy, { exact: true }).count(), 1,
      'Run-scoped unknown status remains visible independently of selected result');
    await selectFinding();
    assert.equal(await modeSelect().inputValue(), 'groq',
      'Unknown ownership preserves the active explicit mode across result selection changes');
    assert.equal((await rescanCalls()).length, 1);
    const beforeUnknown = await page.evaluate(() => window.m104.calls.length);
    assert.equal(await rescanButton().count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Get guidance', exact: true }).count(), 1);
    await rescanButton().dispatchEvent('click');
    await page.getByRole('button', { name: 'Analyze', exact: true }).dispatchEvent('click');
    await page.getByRole('button', { name: 'Get guidance', exact: true }).dispatchEvent('click');
    assert.equal((await rescanCalls()).length, 1);
    assert.equal(await page.evaluate(() => window.m104.calls.length), beforeUnknown,
      'Unknown rescan ownership blocks all available mutation callbacks');
    assert.equal((await page.locator('body').innerText()).includes('PRIVATE'), false);

    await mountBaseline(richRun('m501-cleanup-uncertain'));
    await selectFinding();
    await configureRescan('hold', false, 'cleanup-rescan');
    await submit('local');
    const cleanupIntent = (await rescanCalls()).at(-1)!.value as { runId: string };
    const failed = laterFailure(baseline, cleanupIntent.runId, 'local', 'failed');
    await page.evaluate(failed => window.m104.resolveKey('cleanup-rescan', { status: 500,
      body: { ok: false, error: 'scan-failed', run: structuredClone(failed), persisted: true, cleanupFailed: true },
    }), failed);
    await results().getByText(/cleanup is uncertain/i).waitFor();
    const before = await page.evaluate(() => window.m104.calls.length);
    await page.getByRole('button', { name: 'Analyze', exact: true }).dispatchEvent('click');
    await rescanButton().dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.length), before);
  });

  it('blocks intentional rescan and every competing mutation after a review outcome becomes unknown', async () => {
    const stages = reviewProfileStages('image-alt', 'm501-review-unknown', 'local');
    await mountBaseline(stages.scan);
    await page.evaluate(stages => {
      window.m104.guidance = () => Promise.resolve(structuredClone(stages.guidance));
      window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(stages.pending) });
      window.m104.review = () => Promise.resolve({ status: 200, body: { malformed: true } });
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, stages);
    await selectFinding();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    assert.equal(await modeSelect().count(), 1, 'A selected Finding exposes a valid rescan intent before review uncertainty');
    await modeSelect().selectOption('groq');
    await page.getByRole('radio', { name: 'Approve', exact: true }).check();
    await page.getByRole('combobox', { name: /blocking.*judgment/i }).selectOption('supports-proposal');
    await page.getByLabel(/confirm.*material claims/i).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    await results().getByText('Save outcome unknown', { exact: true }).waitFor();
    assert.equal(await modeSelect().count(), 1);
    const before = await page.evaluate(() => window.m104.calls.length);
    await rescanButton().dispatchEvent('click');
    await page.getByRole('button', { name: 'Analyze', exact: true }).dispatchEvent('click');
    await page.getByRole('button', { name: 'Get guidance', exact: true }).dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.length), before,
      'Unknown review ownership blocks rescan, Analyze, and Finding mutation callbacks');
  });

  it('admits rescan after settled historical ownership but blocks it during generation uncertainty', async () => {
    const runId = 'm501-historical-owner';
    const scan = valid<CompleteRun>(generationScanRun(runId));
    const guidance = await supportedGuidanceEnvelope(runId);
    await mountBaseline(scan);
    await page.evaluate(guidance => {
      window.m104.guidance = () => Promise.resolve(structuredClone(guidance));
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, guidance);
    await selectFinding();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
    assert.equal(await modeSelect().count(), 1,
      'Historical supported retrieval does not remove the selected Finding rescan form');
    assert.equal(await modeSelect().getAttribute('aria-disabled'), null,
      'A settled supported retrieval with no generation presentation is not an active-operation gate');

    const knownUnsaved = failedGenerationEnvelope('generation-persistence', {
      run: runningGenerationRun(runId), cleanupFailed: false, invocation: generationInvocation('local'),
    });
    await page.evaluate(knownUnsaved => {
      window.m104.generation = () => Promise.resolve(structuredClone(knownUnsaved));
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, knownUnsaved);
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await results().getByText(/generation-persistence/i).waitFor();
    await configureRescan('hold', false, 'known-unsaved-rescan');
    await submit('groq');
    const knownCalls = await rescanCalls();
    assert.equal(knownCalls.length, 1,
      'A clean settled unsaved invocation is historical evidence, not active-operation uncertainty');
    assert.ok(knownUnsaved.run);
    const knownBaseline = valid<CompleteRun>(knownUnsaved.run);
    const knownIntent = knownCalls[0]!.value as { runId: string };
    const linked = laterRun(knownBaseline, knownIntent.runId, 'groq');
    await page.evaluate(linked => window.m104.resolveKey('known-unsaved-rescan', {
      status: 200, body: { ok: true, run: structuredClone(linked) },
    }), linked);
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    const historical = await results().innerText();
    assert.match(historical, /generation-persistence/i);
    assert.match(historical, /provider-call outcome/i);
    assert.match(historical, /not saved/i);
    assert.equal(await page.getByRole('button', { name: 'Generate', exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Return to later results', exact: true }).click();

    const unknownId = 'm501-generation-unknown';
    const unknownScan = valid<CompleteRun>(generationScanRun(unknownId));
    const unknownGuidance = await supportedGuidanceEnvelope(unknownId);
    await mountBaseline(unknownScan);
    await page.evaluate(unknownGuidance => {
      window.m104.guidance = () => Promise.resolve(structuredClone(unknownGuidance));
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, unknownGuidance);
    await selectFinding();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
    await modeSelect().selectOption('groq');
    await page.evaluate(() => {
      const nativeTimeout = window.setTimeout;
      window.m104.raw = { nativeTimeout };
      window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: any[]) =>
        delay === 120000 ? nativeTimeout(handler, 0, ...args) : nativeTimeout(handler, delay, ...args)) as typeof window.setTimeout;
      window.m104.generation = () => window.m104.hold('generation-unknown');
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    });
    try {
      await page.getByRole('button', { name: 'Generate', exact: true }).click();
      await page.waitForFunction(() => /unknown/i.test(document.querySelector('[role=status]')?.textContent ?? ''));
      const beforeRescan = (await rescanCalls()).length;
      await rescanButton().dispatchEvent('click');
      assert.equal((await rescanCalls()).length, beforeRescan, 'Generation uncertainty blocks a valid rescan intent');
      const analyzeBefore = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length);
      await page.getByRole('button', { name: 'Analyze', exact: true }).dispatchEvent('click');
      assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length), analyzeBefore + 1,
        'The existing generation-unknown independent Analyze exception remains available');
    } finally {
      await page.evaluate(() => { window.setTimeout = window.m104.raw.nativeTimeout; });
    }
  });

  it('retires a supported retrieval owner with an empty generation map so the later run can retrieve', async () => {
    const runId = 'm501-retrieval-retirement';
    const scan = valid<CompleteRun>(generationScanRun(runId));
    const guidance = await supportedGuidanceEnvelope(runId);
    await mountBaseline(scan);
    await page.evaluate(guidance => {
      window.m104.guidance = () => Promise.resolve(structuredClone(guidance));
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, guidance);
    await selectFinding();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
    await configureRescan('hold', false, 'retrieval-retirement');
    await submit('groq');
    const intent = (await rescanCalls()).at(-1)!.value as { runId: string };
    const template = valid<CompleteRun>(generationScanRun(intent.runId, 'groq'));
    const next = valid<CompleteRun>({ ...template, baselineRunId: scan.runId, requestedUrl: scan.requestedUrl,
      scan: { ...template.scan, context: { ...template.scan.context, finalUrl: scan.scan.context.finalUrl } } });
    await page.evaluate(next => window.m104.resolveKey('retrieval-retirement', {
      status: 200, body: { ok: true, run: structuredClone(next) },
    }), next);
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
    await selectFinding();
    const laterGuidance = await supportedGuidanceEnvelope(next.runId, 'groq');
    const linkedGuidance = { ...laterGuidance,
      run: valid<CompleteRun>({ ...laterGuidance.run, baselineRunId: scan.runId }) };
    await page.evaluate(linkedGuidance => {
      window.m104.guidance = () => Promise.resolve(structuredClone(linkedGuidance));
      window.m104.rerender(true, { groqApiUrlConfigured: true }, true, true, false, true, false, true, false);
    }, linkedGuidance);
    const before = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance').length);
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance').length), before + 1,
      'Successful rescan retires the old supported retrieval owner even when no generation presentation existed');
  });

  it('publishes a fresh zero or nonzero run, retires prior client capabilities, and moves focus conditionally', async () => {
    for (const [zero, focusInside] of [[false, true], [true, false]] as const) {
      await mountBaseline(richRun(`m501-success-${zero}-${focusInside}`));
      await selectFinding();
      const before = baseline;
      await configureRescan('hold', false, `success-${zero}-${focusInside}`);
      await submit('groq');
      if (focusInside) await rescanButton().focus();
      else await page.getByLabel('Target URL').focus();
      const next = await resolveSuccessfulRescan(`success-${zero}-${focusInside}`, before, 'groq', zero);
      await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
      assert.equal(await results().getByText(zero ? 'No automated findings in the three supported checks' : /findings? need review/).count(), 1);
      assert.equal(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement), focusInside);
      assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 1);
      assert.equal(await results().getByText(next.scan.context.finalUrl.value, { exact: true }).count(), 1);
    }
  });

  it('keeps one isolated read-only baseline preview while the later workflow continues', async () => {
    await selectFinding(1);
    const capturedButton = findings().getByRole('button').nth(1);
    const before = baseline;
    await configureRescan('hold', false, 'preview-rescan');
    assert.equal(await modeSelect().count(), 1);
    await modeSelect().selectOption('groq');
    await saveRescanSubmitHandler('oldRescan');
    await rescanButton().click();
    const previewIntent = (await rescanCalls()).at(-1)!.value as { runId: string };
    const generationTemplate = valid<CompleteRun>(generationScanRun(previewIntent.runId, 'groq'));
    const next = valid<CompleteRun>({ ...generationTemplate, baselineRunId: before.runId,
      requestedUrl: before.requestedUrl,
      scan: { ...generationTemplate.scan, context: { ...generationTemplate.scan.context,
        finalUrl: before.scan.context.finalUrl } } });
    await page.evaluate(next => window.m104.resolveKey('preview-rescan', {
      status: 200, body: { ok: true, run: structuredClone(next) },
    }), next);
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
    const afterSuccessCalls = (await rescanCalls()).length;
    await invokeSavedSubmitHandler('oldRescan');
    assert.equal((await rescanCalls()).length, afterSuccessCalls,
      'A saved baseline submit handler cannot silently retarget the active later run');
    await selectFinding();
    const laterGuidance = await supportedGuidanceEnvelope(next.runId, 'groq');
    const linkedGuidance = {
      ...laterGuidance,
      run: valid<CompleteRun>({ ...laterGuidance.run, baselineRunId: baseline.runId }),
    };
    await page.evaluate(() => {
      window.m104.guidance = () => window.m104.hold('later-guidance');
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true },
        true, true, false, true, false, true, false);
    });
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    await results().getByText(baselineCopy, { exact: true }).waitFor();
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement));
    assert.equal(await capturedButton.getAttribute('aria-pressed'), 'true');
    for (const name of ['Get guidance', 'Generate', 'Save decision', 'Start intentional rescan']) {
      assert.equal(await page.getByRole('button', { name, exact: true }).count(), 0, `${name} is omitted in read-only preview`);
    }
    const callsBefore = await page.evaluate(() => window.m104.calls.length);
    await invokeSavedSubmitHandler('oldRescan');
    assert.equal(await page.evaluate(() => window.m104.calls.length), callsBefore,
      'The imperative preview gate rejects a stale mutation callback');
    await page.evaluate(linkedGuidance => window.m104.resolveKey('later-guidance', structuredClone(linkedGuidance)), linkedGuidance);
    await paint();
    assert.equal(await page.getByRole('heading', { name: 'Eligible for generation', exact: true }).count(), 0,
      'Intervening validated later updates stay outside the baseline preview');
    await findings().getByRole('button').first().click();
    assert.equal(await page.evaluate(() => window.m104.calls.length), callsBefore);
    await page.getByRole('button', { name: 'Return to later results', exact: true }).click();
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement));
    assert.equal(await results().getByText(next.scan.context.finalUrl.value, { exact: true }).count(), 1);
    await page.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    assert.equal(await findings().getByRole('button').nth(1).getAttribute('aria-pressed'), 'true',
      'Each baseline entry restores the originally captured baseline selection');
  });

  it('preserves reviewed proposal, invocation and decision evidence in preview without mounting mutation controls', async () => {
    const stages = reviewProfileStages('image-alt', 'm501-reviewed-preview', 'local');
    const reviewed = reviewedProfileRun('approve', 'image-alt', 'm501-reviewed-preview', 'local', undefined, stages.pending);
    await mountBaseline(stages.scan);
    await page.evaluate(({ stages, reviewed }) => {
      window.m104.guidance = () => Promise.resolve(structuredClone(stages.guidance));
      window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(stages.pending) });
      window.m104.review = () => Promise.resolve({ status: 200, body: { ok: true, run: structuredClone(reviewed) } });
      window.m104.rescan = () => window.m104.hold('reviewed-preview-rescan');
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, { stages, reviewed });
    await selectFinding();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await page.getByRole('radio', { name: 'Approve', exact: true }).check();
    await page.getByRole('combobox', { name: /blocking.*judgment/i }).selectOption('supports-proposal');
    await page.getByLabel(/confirm.*material claims/i).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    await page.getByText('Saved review decision', { exact: true }).waitFor();
    await submit('groq');
    const intent = (await rescanCalls()).at(-1)!.value as { runId: string };
    const later = laterRun(reviewed, intent.runId, 'groq');
    await page.evaluate(later => window.m104.resolveKey('reviewed-preview-rescan', {
      status: 200, body: { ok: true, run: structuredClone(later) },
    }), later);
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    await page.getByText('This is the original model-generated proposal, preserved after human review.', { exact: true }).waitFor();
    await page.getByText('Saved review decision', { exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Generation provenance', exact: true }).waitFor();
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement),
      'Historical ReviewDecision rendering must not consume or steal later-workflow focus');
    for (const name of ['Get guidance', 'Generate', 'Save decision', 'Start intentional rescan']) {
      assert.equal(await page.getByRole('button', { name, exact: true }).count(), 0);
    }
  });

  it('defers a later review settlement while baseline preview and preserves navigation focus', async () => {
    const original = baseline;
    await selectFinding();
    await configureRescan('hold', false, 'review-during-preview-rescan');
    await submit('groq');
    const intent = (await rescanCalls()).at(-1)!.value as { runId: string };
    const stages = reviewProfileStages('image-alt', intent.runId, 'groq');
    const linkedScan = valid<CompleteRun>({ ...stages.scan, baselineRunId: original.runId,
      requestedUrl: original.requestedUrl,
      scan: { ...stages.scan.scan, context: { ...stages.scan.scan.context, finalUrl: original.scan.context.finalUrl } } });
    await page.evaluate(linkedScan => window.m104.resolveKey('review-during-preview-rescan', {
      status: 200, body: { ok: true, run: structuredClone(linkedScan) },
    }), linkedScan);
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
    await selectFinding();
    const linkedGuidance = { ...stages.guidance,
      run: valid<CompleteRun>({ ...stages.guidance.run, baselineRunId: original.runId,
        requestedUrl: original.requestedUrl,
        scan: { ...stages.guidance.run.scan, context: { ...stages.guidance.run.scan.context,
          finalUrl: original.scan.context.finalUrl } } }) };
    const linkedPending = valid<CompleteRun>({ ...stages.pending, baselineRunId: original.runId,
      requestedUrl: original.requestedUrl,
      scan: { ...stages.pending.scan, context: { ...stages.pending.scan.context, finalUrl: original.scan.context.finalUrl } } });
    const reviewed = reviewedProfileRun('approve', 'image-alt', intent.runId, 'groq', undefined, linkedPending);
    await page.evaluate(({ linkedGuidance, linkedPending }) => {
      window.m104.guidance = () => Promise.resolve(structuredClone(linkedGuidance));
      window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(linkedPending) });
      window.m104.review = () => window.m104.hold('review-during-preview');
      window.m104.rerender(true, { groqApiUrlConfigured: true }, true, true, false, true, false, true, false);
    }, { linkedGuidance, linkedPending });
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await page.getByRole('radio', { name: 'Approve', exact: true }).check();
    await page.getByRole('combobox', { name: /blocking.*judgment/i }).selectOption('supports-proposal');
    await page.getByLabel(/confirm.*material claims/i).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    await results().getByText(baselineCopy, { exact: true }).waitFor();
    await page.evaluate(reviewed => window.m104.resolveKey('review-during-preview', {
      status: 200, body: { ok: true, run: structuredClone(reviewed) },
    }), reviewed);
    await paint();
    assert.equal(await page.getByText('Saved review decision', { exact: true }).count(), 0,
      'The later settlement does not replace the visible baseline preview');
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement));
    await page.getByRole('button', { name: 'Return to later results', exact: true }).click();
    const decisionHeading = page.getByRole('heading', { name: 'Saved review decision', exact: true });
    await decisionHeading.waitFor();
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement),
      'Return to later results keeps the accepted navigation focus on Results');
  });

  it('clears the preview pair after a successful Analyze and replaces it after the next rescan', async () => {
    const original = baseline;
    await selectFinding();
    await configureRescan('hold', false, 'pair-first');
    await submit('groq');
    const first = await resolveSuccessfulRescan('pair-first', original, 'groq');
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    assert.equal(await findings().getByRole('button').count(),
      original.scan.findings.length + original.scan.scannerReviewObservations.length);
    await page.getByRole('button', { name: 'Return to later results', exact: true }).click();
    await selectFinding();
    await configureRescan('hold', false, 'pair-second');
    await submit('local');
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    await results().getByText(baselineCopy, { exact: true }).waitFor();
    assert.match(await results().innerText(), /rescan|scan.*started|pending/i,
      'The current later run status remains visible while its previous baseline is previewed');
    await page.getByRole('button', { name: 'Return to later results', exact: true }).click();
    assert.equal(await modeSelect().inputValue(), 'local',
      'Preview navigation preserves the explicit mode of the still-pending rescan intent');
    await resolveSuccessfulRescan('pair-second', first, 'local');
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    assert.equal(await findings().getByRole('button').count(),
      first.scan.findings.length + first.scan.scannerReviewObservations.length,
      'The next successful rescan replaces the one-pair baseline with the immediately preceding later run');
    await page.getByRole('button', { name: 'Return to later results', exact: true }).click();

    const replacement = richRun('m501-independent-analysis');
    await page.evaluate(run => {
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, false, true, false);
    }, replacement);
    await page.getByLabel('Target URL').fill(replacement.requestedUrl);
    await page.getByLabel('Local (recommended)').check();
    await page.getByRole('button', { name: 'Analyze', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 0);
  });

  it('composes the built main transport as one exact same-origin JSON POST', async () => {
    await harness.close();
    harness = await startHarness(false, 'main');
    page = harness.page;
    try {
      const before = richRun('m501-main-before');
      const next = laterRun(before, 'run-m501-template', 'groq');
      await page.evaluate(({ before, next }) => {
        window.m104.fetch = (input, init = {}) => {
          const pathname = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
            location.href).pathname;
          const run = pathname === '/api/runs' ? before : (() => {
            const intent = JSON.parse(typeof init.body === 'string' ? init.body : '{}');
            return { ...structuredClone(next), runId: intent.runId, baselineRunId: intent.baselineRunId };
          })();
          return Promise.resolve(new Response(JSON.stringify({ ok: true, run }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
          }));
        };
        window.m104.raw = before;
      }, { before, next });
      await page.getByLabel('Target URL').fill(before.requestedUrl);
      await page.getByLabel('Local (recommended)').check();
      await page.getByRole('button', { name: 'Analyze', exact: true }).click();
      await results().waitFor();
      await selectFinding();
      await submit('groq');
      const posts = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'http')
        .map(call => call.stage === 'http' ? call.value : null));
      assert.equal(posts.length, 2);
      const rescan = posts[1]!;
      assert.deepEqual({ url: rescan.url, method: rescan.method, contentType: rescan.contentType },
        { url: '/api/rescans', method: 'POST', contentType: 'application/json' });
      assert.deepEqual(Object.keys(JSON.parse(rescan.body!)).sort(), ['baselineRunId', 'findingId', 'mode', 'runId']);
    } finally {
      await harness.close();
      harness = await startHarness(false, 'app');
      page = harness.page;
    }
  });

  it('passes axe, keyboard focus and overflow checks at both required viewports and gates eight proof images', async () => {
    await selectFinding();
    const samples = [{ width: 1366, height: 900, prefix: 'desktop' }, { width: 390, height: 844, prefix: 'narrow' }] as const;
    for (const sample of samples) {
      await page.setViewportSize({ width: sample.width, height: sample.height });
      await paint();
      assert.equal(await modeSelect().count(), 1);
      await modeSelect().focus();
      assert.ok(await modeSelect().evaluate(node => node === document.activeElement));
      await page.keyboard.press('ArrowDown');
      assert.equal(await modeSelect().inputValue(), 'local');
      await page.keyboard.press('Tab');
      assert.ok(await rescanButton().evaluate(node => node === document.activeElement));
      await assertAccessibleState();
      if (process.env[captureFlag] === '1') await capture(`${sample.prefix}-ready`);
      await configureRescan('hold', false, `${sample.prefix}-pending`);
      await submit('groq');
      await assertAccessibleState();
      if (process.env[captureFlag] === '1') await capture(`${sample.prefix}-pending`);
      await page.evaluate(key => window.m104.resolveKey(key, { status: 409,
        body: { ok: false, error: 'not-eligible', run: null, persisted: false, cleanupFailed: false } }),
      `${sample.prefix}-pending`);
      await results().getByText(/Finding is not eligible for a rescan/i).waitFor();
      await assertAccessibleState();
      if (process.env[captureFlag] === '1') await capture(`${sample.prefix}-error`);
      await configureSuccessfulRescan(baseline, 'groq');
      await submit('groq');
      await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();
      await assertAccessibleState();
      if (process.env[captureFlag] === '1') await capture(`${sample.prefix}-complete`);
      await mountBaseline(richRun(`m501-${sample.prefix}-next`));
      await selectFinding();
    }
    if (process.env[captureFlag] === '1') {
      assert.deepEqual(fs.readdirSync(proofRoot).sort(), [
        'desktop-complete.png', 'desktop-error.png', 'desktop-pending.png', 'desktop-ready.png',
        'narrow-complete.png', 'narrow-error.png', 'narrow-pending.png', 'narrow-ready.png',
      ]);
    }
  });
});
