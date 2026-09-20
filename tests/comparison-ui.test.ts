import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from 'playwright';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';
import { completedRun } from './helpers/m102-run-fixture.ts';
import { reviewProfileStages, reviewedProfileRun } from './helpers/m402-review-fixture.ts';
import {
  comparisonForRuns,
  comparisonRun,
  comparisonScenario,
  contrastComparisonRun,
  resolvedZeroComparisonForRuns,
} from './helpers/m503-comparison-fixture.ts';
import { repo, richRun, startHarness, valid } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type MutableRecord = Record<string, any>;
type Lineage = { readonly status: 'available' }
  | { readonly status: 'unavailable'; readonly reason: 'not-found' | 'invalid-run' | 'read-failed'
      | 'stored-run-unavailable' | 'baseline-mismatch' };

const captureFlag = 'A11Y_M503_CAPTURE_PROOF';
const proofRoot = path.join(repo, 'temp/m503-ui-proof');
const expectedProof = [
  'broken-lineage-desktop.png', 'broken-lineage-narrow.png',
  'resolved-desktop.png', 'resolved-narrow.png',
  'unavailable-desktop.png', 'unavailable-narrow.png',
] as const;

let harness: Harness;
let page: Page;

const results = () => page.getByRole('region', { name: 'Results', exact: true });
const findings = () => page.getByRole('region', { name: 'Findings', exact: true });
const status = () => page.getByRole('status');
const comparisonHeading = () => page.getByRole('heading', { name: 'Comparison', exact: true });
const comparison = () => comparisonHeading().locator('xpath=..');

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

async function mountRun(run: CompleteRun, options: {
  readonly callback?: boolean;
  readonly lineage?: Lineage;
  readonly comparisonValue?: unknown | 'hold';
  readonly comparisonKey?: string;
} = {}): Promise<void> {
  const callback = options.callback ?? true;
  const lineage = options.lineage ?? { status: 'available' as const };
  await page.evaluate(({ run, callback, lineage, comparisonValue, comparisonKey }) => {
    window.m104.raw = structuredClone(run);
    window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
    window.m104.comparison = comparisonValue === 'hold'
      ? () => window.m104.hold(comparisonKey)
      : comparisonValue === undefined
        ? () => Promise.resolve({ status: 200, body: { ok: true, run: structuredClone(run), interrupted: false,
          comparisonLineage: structuredClone(lineage) } })
        : () => Promise.resolve(structuredClone(comparisonValue));
    window.m104.mount(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
      false, true, false, true, false, callback, false);
  }, { run, callback, lineage, comparisonValue: options.comparisonValue, comparisonKey: options.comparisonKey ?? 'comparison-read' });
  await page.getByLabel('Target URL').fill(run.requestedUrl);
  await page.getByLabel(run.providerContext.mode === 'local' ? 'Local (recommended)' : 'Groq').check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await results().waitFor();
  await paint();
}

async function selectFirstFinding(): Promise<void> {
  await findings().getByRole('button').first().click();
  await page.getByRole('region', { name: /evidence/i }).waitFor();
}

async function beginComparisonRescan(prefix: string): Promise<{ readonly saved: CompleteRun; readonly key: string }> {
  const baseline = richRun(`${prefix}-baseline`);
  await mountRun(baseline);
  await selectFirstFinding();
  const key = `${prefix}-rescan`;
  const laterTemplate = completedRun(`${prefix}-template`, 'groq') as CompleteRun;
  await page.evaluate(key => {
    window.m104.rescan = () => window.m104.hold(key);
    window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
      false, true, false, true, false, true, false);
  }, key);
  await page.getByLabel('New scan mode', { exact: true }).selectOption('groq');
  await page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click();
  const intent = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'rescan').at(-1)!.value as any);
  const linked = asRun({ ...structuredClone(laterTemplate), runId: intent.runId, baselineRunId: baseline.runId,
    requestedUrl: baseline.requestedUrl,
    scan: { ...laterTemplate.scan, context: { ...laterTemplate.scan.context, finalUrl: baseline.scan.context.finalUrl } } });
  return { saved: asRun(comparisonForRuns(baseline, linked, [], intent.findingId)), key };
}

async function resolveComparisonRescan(key: string, saved: CompleteRun): Promise<void> {
  await page.evaluate(({ key, saved }) => window.m104.resolveKey(key, {
    status: 200, body: { ok: true, run: structuredClone(saved) },
  }), { key, saved });
  await paint();
}

async function assertAccessibleComparison(): Promise<void> {
  const violations = await new AxeBuilder({ page }).include('main').analyze();
  assert.deepEqual(violations.violations.map(item => item.id), []);
  const viewport = page.viewportSize();
  assert.ok(viewport);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  assert.equal(await comparisonHeading().count(), 1);
}

function asRun(value: unknown): CompleteRun {
  return valid<CompleteRun>(value);
}

function renamedRun(value: unknown, runId: string, baselineRunId: string): CompleteRun {
  const run = structuredClone(value) as MutableRecord;
  run.runId = runId;
  run.baselineRunId = baselineRunId;
  return asRun(run);
}

async function capture(name: typeof expectedProof[number]): Promise<void> {
  if (process.env[captureFlag] !== '1') return;
  let ancestor = proofRoot;
  for (;;) {
    if (fs.existsSync(ancestor)) {
      const stat = fs.lstatSync(ancestor);
      assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Proof ancestors must be ordinary directories');
      assert.equal(fs.realpathSync.native(ancestor).toLowerCase(), path.resolve(ancestor).toLowerCase());
    }
    if (path.resolve(ancestor).toLowerCase() === repo.toLowerCase()) break;
    const parent = path.dirname(ancestor);
    assert.notEqual(parent, ancestor, 'Proof path must remain inside the repository');
    ancestor = parent;
  }
  if (fs.existsSync(proofRoot)) {
    assert.ok(fs.readdirSync(proofRoot).every(item => expectedProof.includes(item as typeof expectedProof[number])));
    for (const item of fs.readdirSync(proofRoot)) {
      const file = path.join(proofRoot, item);
      const stat = fs.lstatSync(file);
      assert.ok(stat.isFile() && !stat.isSymbolicLink(), 'Existing proof must be an ordinary file');
      assert.equal(stat.nlink, 1, 'Existing proof must have one hard link');
      assert.equal(fs.realpathSync.native(file).toLowerCase(), path.resolve(file).toLowerCase());
    }
  } else {
    fs.mkdirSync(proofRoot);
  }
  await page.screenshot({ path: path.join(proofRoot, name), fullPage: true });
}

describe('M5-03 saved comparison UI', { concurrency: false, timeout: 120000 }, () => {
  before(async () => { harness = await startHarness(false, 'app'); page = harness.page; });
  after(async () => {
    await harness.close();
    if (process.env[captureFlag] === '1') assert.deepEqual(fs.readdirSync(proofRoot).sort(), [...expectedProof]);
  });
  beforeEach(async () => { await page.evaluate(() => window.m104.settle()); });

  it('omits the region for historical runs and fails closed when availability cannot be verified', async () => {
    const historical = richRun('m503-historical');
    await mountRun(historical, { callback: false });
    assert.equal(await comparisonHeading().count(), 0);
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'comparison').length), 0);

    const saved = renamedRun(comparisonRun('unique-violation'), 'm503-unverified', 'm503-baseline-unverified');
    await mountRun(saved, { callback: false });
    await comparisonHeading().waitFor();
    assert.match(await comparison().innerText(), /Baseline availability could not be verified/i);
    assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 0);
    await selectFirstFinding();
    assert.equal(await page.getByLabel('New scan mode', { exact: true }).isDisabled(), true);
    assert.match(await results().innerText(), /cannot be verified|unverified/i);
  });

  it('renders the complete canonical outcome matrix independently of later Finding selection', async () => {
    const branches = [
      'not-comparable', 'baseline-locator-unavailable', 'ambiguous', 'later-locator-unavailable',
      'no-exact-match', 'unique-incomplete', 'unique-violation', 'unique-pass',
    ] as const;
    for (const branch of branches) {
      const run = renamedRun(comparisonRun(branch), `m503-${branch}`, `m503-${branch}-baseline`);
      await mountRun(run);
      await comparisonHeading().waitFor();
      const text = await comparison().innerText();
      const normalized = text.toLowerCase();
      const stored = run.comparison as MutableRecord;
      assert.ok(normalized.includes('before'));
      assert.ok(normalized.includes('after'));
      assert.ok(normalized.includes(String(stored.pair).replaceAll('-', ' ')));
      if (stored.outcome) assert.ok(normalized.includes(String(stored.outcome).replaceAll('-', ' ')));
      assert.ok(normalized.includes(String(stored.reason).replaceAll('-', ' ')));
      assert.ok(text.includes(stored.rationale));
      assert.ok(text.includes(stored.limitations[0]));
      assert.ok(text.includes(stored.followUp));
      if (branch === 'unique-pass') assert.match(text, /Native pass observation/i);
      if (!['unique-violation', 'unique-incomplete', 'unique-pass'].includes(branch)) {
        assert.match(text, /After.*unavailable|unavailable.*After|no .*after/i);
      }
      assert.doesNotMatch(text, /certif(?:y|ied|ication)|page is accessible|page is compliant/i);
    }

    for (const direction of ['improved', 'persistent', 'regressed'] as const) {
      const run = renamedRun(contrastComparisonRun(direction), `m503-contrast-${direction}`, `m503-contrast-${direction}-baseline`);
      await mountRun(run);
      const text = await comparison().innerText();
      assert.match(text, new RegExp(direction, 'i'));
      assert.match(text, /contrast/i);
      assert.doesNotMatch(text, /page score|accessibility score/i);
    }
  });

  it('keeps a resolved comparison visible when the later scan has zero Findings', async () => {
    const baseline = richRun('m503-zero-baseline');
    const empty = completedRun('m503-zero-later', 'local', 'zero') as CompleteRun;
    const linked = asRun({ ...structuredClone(empty), baselineRunId: baseline.runId,
      requestedUrl: baseline.requestedUrl,
      scan: { ...empty.scan, context: { ...empty.scan.context, finalUrl: baseline.scan.context.finalUrl } } });
    const run = asRun(resolvedZeroComparisonForRuns(baseline, linked));
    await mountRun(run);
    await comparisonHeading().waitFor();
    assert.equal(run.scan.findings.length, 0);
    assert.match(await comparison().innerText(), /resolved/i);
    assert.match(await comparison().innerText(), /Native pass observation/i);
    assert.match(await results().innerText(), /No automated findings in the three supported checks/i);
    assert.equal(await comparisonHeading().count(), 1);
  });

  it('labels optional AI and human baseline context without making it comparison evidence', async () => {
    const baseline = reviewedProfileRun('edit-and-accept', 'image-alt', 'm503-context-baseline', 'local');
    await mountRun(baseline);
    await selectFirstFinding();
    await page.evaluate(() => {
      window.m104.rescan = () => window.m104.hold('context-rescan');
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    });
    await page.getByLabel('New scan mode', { exact: true }).selectOption('groq');
    await page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click();
    const intent = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'rescan').at(-1)!.value as any);
    const template = completedRun(intent.runId, 'groq') as CompleteRun;
    const linked = asRun({ ...structuredClone(template), baselineRunId: baseline.runId,
      requestedUrl: baseline.requestedUrl,
      scan: { ...template.scan, context: { ...template.scan.context, finalUrl: baseline.scan.context.finalUrl } } });
    const saved = asRun(comparisonForRuns(baseline, linked));
    await page.evaluate(saved => {
      window.m104.comparison = () => Promise.resolve({ status: 200, body: { ok: true,
        run: structuredClone(saved), interrupted: false, comparisonLineage: { status: 'available' } } });
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    }, saved);
    await paint();
    await page.evaluate(saved => window.m104.resolveKey('context-rescan', {
      status: 200, body: { ok: true, run: structuredClone(saved) },
    }), saved);
    await comparisonHeading().waitFor();
    const text = await comparison().innerText();
    assert.match(text, /AI original proposal/i);
    assert.match(text, /Human-edited proposal/i);
    assert.match(text, /Human decision/i);
    assert.match(text, /context only|does not determine|not used to classify/i);
    await page.evaluate(saved => {
      window.m104.comparison = () => Promise.resolve({ status: 200, body: { ok: true,
        run: structuredClone(saved), interrupted: false,
        comparisonLineage: { status: 'unavailable', reason: 'not-found' } } });
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    }, saved);
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    await comparison().getByText(/saved comparison remains available.*baseline cannot be inspected/i).waitFor();
    assert.equal(await comparison().getByText(/AI original proposal|Human-edited proposal|Human decision/i).count(), 0);
    assert.equal(await page.getByRole('button', { name: /Return to baseline|Return to later results/ }).count(), 0);
  });

  it('applies pending availability metadata without replacing a newer human decision or restoring capability', async () => {
    const baseline = richRun('m503-human-baseline');
    const stages = reviewProfileStages('image-alt', 'm503-human-later', 'groq');
    const linkedScan = asRun({ ...structuredClone(stages.scan), baselineRunId: baseline.runId,
      requestedUrl: baseline.requestedUrl,
      scan: { ...stages.scan.scan, context: { ...stages.scan.scan.context,
        finalUrl: baseline.scan.context.finalUrl } } });
    const savedScan = asRun(comparisonForRuns(baseline, linkedScan));
    const linkedGuidance = { ...stages.guidance, run: asRun({ ...structuredClone(stages.guidance.run),
      baselineRunId: baseline.runId, comparison: structuredClone(savedScan.comparison),
      requestedUrl: baseline.requestedUrl,
      scan: { ...stages.guidance.run.scan, context: { ...stages.guidance.run.scan.context,
        finalUrl: baseline.scan.context.finalUrl } } }) };
    const linkedPending = asRun({ ...structuredClone(stages.pending), baselineRunId: baseline.runId,
      comparison: structuredClone(savedScan.comparison), requestedUrl: baseline.requestedUrl,
      scan: { ...stages.pending.scan, context: { ...stages.pending.scan.context,
        finalUrl: baseline.scan.context.finalUrl } } });
    const reviewed = reviewedProfileRun('approve', 'image-alt', savedScan.runId, 'groq', undefined, linkedPending);
    assert.deepEqual(reviewed.comparison, savedScan.comparison, 'Review fixture must preserve the saved comparison');
    await mountRun(savedScan, { comparisonValue: 'hold', comparisonKey: 'human-read' });
    await page.waitForFunction(() => window.m104.calls.some(call => call.stage === 'comparison'));
    await page.evaluate(({ linkedGuidance, linkedPending, reviewed }) => {
      window.m104.guidance = () => Promise.resolve(structuredClone(linkedGuidance));
      window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(linkedPending) });
      window.m104.review = () => Promise.resolve({ status: 200, body: { ok: true, run: structuredClone(reviewed) } });
      window.m104.rerender(true, { groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    }, { linkedGuidance, linkedPending, reviewed });
    await paint();
    await selectFirstFinding();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await page.getByRole('radio', { name: 'Approve', exact: true }).check();
    await page.getByRole('combobox', { name: /blocking.*judgment/i }).selectOption('supports-proposal');
    await page.getByLabel(/confirm.*material claims/i).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    await page.getByRole('heading', { name: 'Saved review decision', exact: true }).waitFor();
    await page.evaluate(savedScan => window.m104.resolveKey('human-read', { status: 200,
      body: { ok: true, run: structuredClone(savedScan), interrupted: false,
        comparisonLineage: { status: 'available' } } }), savedScan);
    await paint();
    assert.equal(await page.getByRole('heading', { name: 'Saved review decision', exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Save decision', exact: true }).count(), 0,
      'Availability metadata cannot restore the consumed review capability');
  });

  it('announces every completed-scan comparison failure truthfully and preserves locking semantics', async () => {
    const cases = [
      ['comparison-calculation', 500, 'Scan completed. Comparison could not be calculated.', false],
      ['comparison-persistence', 500, 'Scan completed. Comparison could not be saved.', false],
      ['comparison-lineage', 409, 'Scan completed. The baseline is unavailable for comparison.', false],
      ['comparison-aborted', 409, 'Scan completed. Comparison was cancelled before saving.', false],
      ['comparison-shutdown', 503, 'Scan completed. The service stopped before comparison was saved.', true],
    ] as const;
    for (const [error, responseStatus, message, locked] of cases) {
      const baseline = richRun(`m503-${error}-baseline`);
      await mountRun(baseline);
      await selectFirstFinding();
      const laterTemplate = completedRun(`m503-${error}-template`, 'groq') as CompleteRun;
      await page.evaluate(({ laterTemplate, error, responseStatus }) => {
        window.m104.rescan = intent => Promise.resolve({ status: responseStatus, body: { ok: false, error,
          run: { ...structuredClone(laterTemplate), runId: intent.runId, baselineRunId: intent.baselineRunId },
          persisted: true, comparisonPersisted: false, cleanupFailed: false } });
        window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
          false, true, false, true, false, true, false);
      }, { laterTemplate, error, responseStatus });
      await page.getByLabel('New scan mode', { exact: true }).selectOption('groq');
      await page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click();
      await status().getByText(message, { exact: true }).waitFor();
      assert.equal(laterTemplate.scan.findings.length, 2, 'The failure fixture retains both later Findings');
      assert.equal(await results().getByText('2 findings need review', { exact: true }).count(), 1,
        'The completed later scan and its exact Finding count remain visible despite the comparison failure');
      await selectFirstFinding();
      assert.equal(await page.getByLabel('New scan mode', { exact: true }).isDisabled(), locked);
    }
  });

  it('refreshes availability with token ownership and never overwrites newer downstream work', async () => {
    const baseline = richRun('m503-refresh-baseline');
    await mountRun(baseline);
    await selectFirstFinding();
    const laterTemplate = completedRun('m503-refresh-template', 'groq') as CompleteRun;
    await page.evaluate(laterTemplate => {
      window.m104.rescan = intent => window.m104.hold(`rescan-${intent.runId}`);
      window.m104.comparison = () => window.m104.hold('availability-old');
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
      window.m104.raw = structuredClone(laterTemplate);
    }, laterTemplate);
    await page.getByLabel('New scan mode', { exact: true }).selectOption('groq');
    await page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click();
    const intent = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'rescan').at(-1)!.value as any);
    const linked = asRun({ ...structuredClone(laterTemplate), runId: intent.runId, baselineRunId: baseline.runId,
      requestedUrl: baseline.requestedUrl,
      scan: { ...laterTemplate.scan, context: { ...laterTemplate.scan.context, finalUrl: baseline.scan.context.finalUrl } } });
    const saved = asRun(comparisonForRuns(baseline, linked));
    await page.evaluate(({ intent, saved }) => window.m104.resolveKey(`rescan-${intent.runId}`, {
      status: 200, body: { ok: true, run: structuredClone(saved) },
    }), { intent, saved });
    await comparisonHeading().waitFor();

    const focusBefore = await page.evaluate(() => document.activeElement?.textContent ?? '');
    await page.evaluate(saved => window.m104.resolveKey('availability-old', { status: 200,
      body: { ok: true, run: structuredClone(saved), interrupted: false,
        comparisonLineage: { status: 'available' } } }), saved);
    await paint();
    assert.equal(await page.evaluate(() => document.activeElement?.textContent ?? ''), focusBefore,
      'Availability settlement does not move focus');

    await page.evaluate(() => {
      let navigationRead = 0;
      window.m104.comparison = () => window.m104.hold(`availability-nav-${++navigationRead}`);
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    });
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement));
    await page.getByRole('button', { name: 'Return to later results', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.ok(await page.getByRole('heading', { name: 'Results', exact: true }).evaluate(node => node === document.activeElement));
    const calls = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'comparison').length);
    assert.ok(calls >= 3, 'Both explicit navigation actions refresh availability');
    await page.evaluate(saved => window.m104.resolveKey('availability-nav-1', { status: 200,
      body: { ok: true, run: structuredClone(saved), interrupted: false,
        comparisonLineage: { status: 'unavailable', reason: 'not-found' } } }), saved);
    await paint();
    assert.doesNotMatch(await comparison().innerText(), /baseline cannot be inspected/i,
      'An older refresh cannot replace the current navigation request');
    await page.evaluate(saved => window.m104.resolveKey('availability-nav-2', { status: 200,
      body: { ok: true, run: structuredClone(saved), interrupted: false,
        comparisonLineage: { status: 'available' } } }), saved);
    await comparisonHeading().waitFor();
  });

  it('keeps synchronous missing and throwing availability notices ahead of rescan success feedback', async () => {
    const observations: { readonly notice: string; readonly blocked: boolean; readonly detail: string }[] = [];
    for (const kind of ['missing', 'throwing'] as const) {
      const { saved, key } = await beginComparisonRescan(`m503-order-${kind}`);
      await page.evaluate(kind => {
        if (kind === 'throwing') window.m104.comparison = () => { throw new Error('controlled read failure'); };
        window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
          false, true, false, true, false, kind === 'throwing', false);
      }, kind);
      await paint();
      await resolveComparisonRescan(key, saved);
      const notice = await status().innerText();
      const detail = await comparison().innerText();
      await selectFirstFinding();
      observations.push({
        notice,
        blocked: await page.getByLabel('New scan mode', { exact: true }).isDisabled(),
        detail,
      });
    }
    assert.deepEqual(observations.map(item => item.notice), [
      'Baseline availability could not be verified.', 'Baseline availability could not be verified.',
    ]);
    assert.deepEqual(observations.map(item => item.blocked), [true, true]);
    assert.ok(observations.every(item => /Baseline availability could not be verified/i.test(item.detail)));
  });

  it('does not let an older rescan announcement replace a reentrant Analyze announcement', async () => {
    const { saved, key } = await beginComparisonRescan('m503-order-reentrant');
    await page.evaluate(saved => {
      window.m104.analyze = () => window.m104.hold('reentrant-analysis');
      window.m104.comparison = () => {
        const analyze = [...document.querySelectorAll('button')]
          .find(candidate => candidate.textContent?.trim() === 'Analyze');
        if (!(analyze instanceof HTMLButtonElement)) throw new Error('Analyze control is unavailable');
        analyze.click();
        return Promise.resolve({ status: 200, body: { ok: true, run: structuredClone(saved), interrupted: false,
          comparisonLineage: { status: 'available' } } });
      };
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    }, saved);
    await paint();
    await resolveComparisonRescan(key, saved);
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length), 2,
      'The initial Analyze and reentrant Analyze are both observable');
    assert.equal(await status().innerText(), 'Analysis started.');
    assert.equal(await page.getByRole('button', { name: 'Analyze', exact: true }).isDisabled(), true);
  });

  it('restores Results focus when delayed unverified or unavailable metadata removes a focused preview', async () => {
    const observations: { readonly focused: boolean; readonly navigation: number; readonly notice: string }[] = [];
    for (const availability of ['unverified', 'unavailable'] as const) {
      const { saved, key } = await beginComparisonRescan(`m503-preview-${availability}`);
      await page.evaluate(saved => {
        window.m104.comparison = () => Promise.resolve({ status: 200, body: { ok: true,
          run: structuredClone(saved), interrupted: false, comparisonLineage: { status: 'available' } } });
        window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
          false, true, false, true, false, true, false);
      }, saved);
      await paint();
      await resolveComparisonRescan(key, saved);
      await page.getByRole('button', { name: 'Return to baseline', exact: true }).waitFor();

      const readKey = `m503-preview-read-${availability}`;
      await page.evaluate(readKey => {
        window.m104.comparison = () => window.m104.hold(readKey);
        window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
          false, true, false, true, false, true, false);
      }, readKey);
      await paint();
      await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
      await selectFirstFinding();
      if (availability === 'unverified') {
        await page.evaluate(readKey => window.m104.resolveKey(readKey, { malformed: true }), readKey);
      } else {
        await page.evaluate(({ readKey, saved }) => window.m104.resolveKey(readKey, { status: 200,
          body: { ok: true, run: structuredClone(saved), interrupted: false,
            comparisonLineage: { status: 'unavailable', reason: 'not-found' } } }), { readKey, saved });
      }
      await paint();
      observations.push({
        focused: await page.getByRole('heading', { name: 'Results', exact: true })
          .evaluate(node => node === document.activeElement),
        navigation: await page.getByRole('button', { name: /Return to baseline|Return to later results/ }).count(),
        notice: await status().innerText(),
      });
    }
    assert.deepEqual(observations.map(item => item.focused), [true, true]);
    assert.deepEqual(observations.map(item => item.navigation), [0, 0]);
    assert.deepEqual(observations.map(item => item.notice), [
      'Baseline availability could not be verified.',
      'The saved comparison remains available, but its baseline cannot be inspected.',
    ]);
  });

  it('restores focus for synchronous preview invalidation without moving focus outside a preview', async () => {
    const { saved, key } = await beginComparisonRescan('m503-preview-synchronous');
    await page.evaluate(saved => {
      window.m104.comparison = () => Promise.resolve({ status: 200, body: { ok: true,
        run: structuredClone(saved), interrupted: false, comparisonLineage: { status: 'available' } } });
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    }, saved);
    await paint();
    await resolveComparisonRescan(key, saved);
    const returnButton = page.getByRole('button', { name: 'Return to baseline', exact: true });
    await returnButton.focus();
    await page.evaluate(() => window.m104.rerender(true,
      { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
      false, true, false, true, false, false, false));
    await paint();
    await page.keyboard.press('Enter');
    await paint();
    const synchronousFocus = await page.getByRole('heading', { name: 'Results', exact: true })
      .evaluate(node => node === document.activeElement);
    const synchronousNavigation = await page.getByRole('button', { name: /Return to baseline|Return to later results/ }).count();

    const outsidePair = await beginComparisonRescan('m503-outside-focus');
    await page.evaluate(saved => {
      window.m104.comparison = () => Promise.resolve({ status: 200, body: { ok: true,
        run: structuredClone(saved), interrupted: false, comparisonLineage: { status: 'available' } } });
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    }, outsidePair.saved);
    await paint();
    await resolveComparisonRescan(outsidePair.key, outsidePair.saved);
    await page.evaluate(() => {
      window.m104.comparison = () => window.m104.hold('outside-focus-read');
      window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true,
        false, true, false, true, false, true, false);
    });
    await paint();
    await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
    const target = page.getByLabel('Target URL');
    await target.focus();
    await page.evaluate(() => window.m104.resolveKey('outside-focus-read', { malformed: true }));
    await paint();
    const outsideFocus = await target.evaluate(node => node === document.activeElement);

    assert.equal(synchronousFocus, true);
    assert.equal(synchronousNavigation, 0);
    assert.equal(outsideFocus, true, 'Availability settlement must preserve focus outside the removed preview');
  });

  it('keeps minimized evidence for unavailable lineage, clears preview/context, and blocks another comparison', async () => {
    const scenario = comparisonScenario('unique-violation');
    const run = renamedRun({ ...structuredClone(scenario.laterRun), comparison: structuredClone(scenario.comparison) },
      'm503-broken-lineage', 'm503-missing-baseline');
    await mountRun(run, { lineage: { status: 'unavailable', reason: 'not-found' } });
    await comparisonHeading().waitFor();
    assert.match(await comparison().innerText(), /persistent/i);
    assert.match(await comparison().innerText(), /saved comparison remains available.*baseline cannot be inspected/i);
    assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 0);
    await selectFirstFinding();
    assert.equal(await page.getByLabel('New scan mode', { exact: true }).isDisabled(), true);
    assert.equal(await results().getByText(/AI original proposal|Human-edited proposal|Human decision/i).count(), 0);
  });

  it('uses one shared status, inert strings, keyboard focus, reflow, and six gated visual samples', async () => {
    const samples = [{ width: 1366, height: 900, suffix: 'desktop' }, { width: 390, height: 844, suffix: 'narrow' }] as const;
    for (const sample of samples) {
      await page.setViewportSize(sample);
      const resolved = renamedRun(comparisonRun('unique-pass'), `m503-proof-resolved-${sample.suffix}`,
        `m503-proof-resolved-baseline-${sample.suffix}`);
      const inert = structuredClone(resolved) as MutableRecord;
      const markup = '<img src="https://canary.invalid/x" onerror="window.m104.canary++">';
      const canary = new URL(`https://example.org/?comparison=${markup}`).href;
      inert.requestedUrl = canary;
      inert.scan.context.finalUrl = { value: canary };
      inert.comparison.baseline.requestedUrl = canary;
      inert.comparison.baseline.scanContext.finalUrl = { value: canary };
      const validatedInert = asRun(inert);
      await mountRun(validatedInert);
      await page.getByLabel('Target URL').focus();
      assert.ok(await page.getByLabel('Target URL').evaluate(node => node === document.activeElement));
      assert.equal(await page.evaluate(() => window.m104.canary), 0);
      assert.equal(await page.locator('main [role="status"]').count(), 1);
      await assertAccessibleComparison();
      await capture(`resolved-${sample.suffix}.png`);

      const unavailable = renamedRun(comparisonRun('later-locator-unavailable'),
        `m503-proof-unavailable-${sample.suffix}`, `m503-proof-unavailable-baseline-${sample.suffix}`);
      await mountRun(unavailable);
      await assertAccessibleComparison();
      await capture(`unavailable-${sample.suffix}.png`);

      const broken = renamedRun(comparisonRun('unique-violation'),
        `m503-proof-broken-${sample.suffix}`, `m503-proof-broken-baseline-${sample.suffix}`);
      await mountRun(broken, { lineage: { status: 'unavailable', reason: 'not-found' } });
      await assertAccessibleComparison();
      await capture(`broken-lineage-${sample.suffix}.png`);
    }
  });

  it('composes the main callback as an exact same-origin comparison GET', async () => {
    await harness.close();
    harness = await startHarness(false, 'main');
    page = harness.page;
    try {
      const run = renamedRun(comparisonRun('unique-violation'), 'm503-main-later', 'm503-main-baseline');
      await page.evaluate(run => {
        window.m104.fetch = input => {
          const pathname = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href).pathname;
          const body = pathname === '/api/runs'
            ? { ok: true, run: structuredClone(run) }
            : { ok: true, run: structuredClone(run), interrupted: false, comparisonLineage: { status: 'available' } };
          return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));
        };
      }, run);
      await page.getByLabel('Target URL').fill(run.requestedUrl);
      await page.getByLabel('Local (recommended)').check();
      await page.getByRole('button', { name: 'Analyze', exact: true }).click();
      await comparisonHeading().waitFor();
      const calls = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'http')
        .map(call => call.stage === 'http' ? call.value : null));
      assert.deepEqual(calls.map(call => ({ url: call!.url, method: call!.method, body: call!.body })), [
        { url: '/api/runs', method: 'POST', body: JSON.stringify({ requestedUrl: run.requestedUrl, mode: 'local' }) },
        { url: `/api/runs/${encodeURIComponent(run.runId)}`, method: 'GET', body: null },
      ]);
    } finally {
      await harness.close();
      harness = await startHarness(false, 'app');
      page = harness.page;
    }
  });
});
