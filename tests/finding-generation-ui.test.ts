import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Locator, Page } from 'playwright';
import { assessedMissingRetrievalRun } from './helpers/m202-retrieval-service-fixture.ts';
import { admitGeneration } from '../src/client/findings/finding-generation-admission.ts';
import { admitGuidance } from '../src/client/findings/finding-guidance-admission.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import {
  failedGenerationEnvelope,
  failedGenerationRun,
  generationInvocation,
  generationScanRun,
  proposalGenerationRun,
  runningGenerationRun,
  successfulGenerationEnvelope,
  supportedGenerationRun,
  supportedGuidanceEnvelope,
} from './helpers/m305-generation-fixture.ts';
import { repo, startHarness, valid } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';

type Mode = 'local' | 'groq';
type Mutable = Record<string | number, any>;

let harness: Harness;
let page: Page;
let appHarnessClosed = false;

const status = () => page.getByRole('status');
const analyzeButton = () => page.getByRole('button', { name: 'Analyze', exact: true });
const generationButton = () => page.getByRole('button', { name: 'Generate', exact: true });
const detail = () => page.getByRole('region', { name: /Image alternative issue 1 evidence/i });

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

async function generationCalls(): Promise<number> {
  return page.evaluate(() => window.m104.calls.filter(call => call.stage === 'generation').length);
}

async function setGeneration(value: unknown | 'hold', key = 'generation'): Promise<void> {
  await page.evaluate(({ value, key }) => {
    window.m104.generation = value === 'hold'
      ? () => window.m104.hold(key)
      : () => Promise.resolve(structuredClone(value));
    window.m104.rerender(true, {}, true, true);
  }, { value, key });
  await paint();
}

async function openEligible(runId: string, mode: Mode = 'local', accessor = false): Promise<void> {
  const scan = valid(generationScanRun(runId, mode));
  const guidance = await supportedGuidanceEnvelope(runId, mode);
  await page.evaluate(({ scan, guidance, accessor }) => {
    window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(scan) });
    window.m104.guidance = () => Promise.resolve(structuredClone(guidance));
    window.m104.generation = () => Promise.resolve({ ok: false, error: 'not-eligible', run: null,
      persisted: false, cleanupFailed: false, invocationPersisted: false });
    window.m104.generationAccessor = callback => callback;
    window.m104.generationReads = 0;
    window.m104.mount(true, {}, true, true, accessor);
  }, { scan, guidance, accessor });
  await paint();
  await page.getByLabel('Target URL').fill(scan.requestedUrl);
  await page.getByLabel(mode === 'local' ? 'Local (recommended)' : 'Groq').check();
  await analyzeButton().click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
  await detail().getByText('Eligible for generation', { exact: true }).waitFor();
}

function persistedFailure(runId: string, mode: Mode,
  error: 'authentication' | 'quota' | 'rate-limit' | 'network' | 'provider' | 'response-validation' | 'timeout') {
  const invocation = error === 'response-validation'
    ? generationInvocation(mode, 'response', 'failed')
    : generationInvocation(mode, error, 'not-run');
  return failedGenerationEnvelope(error, {
    run: failedGenerationRun(error, { runId, mode, invocation }),
    persisted: true,
    invocationPersisted: true,
    invocation,
  });
}

async function assertAccessibleAtViewports(region: Locator): Promise<void> {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await region.scrollIntoViewIfNeeded();
    await paint();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
  }
}

async function assertTerminalControl(): Promise<void> {
  assert.equal(await generationButton().count(), 1, 'The consumed control stays mounted for focus continuity');
  assert.equal(await generationButton().getAttribute('aria-disabled'), 'true');
  const before = await generationCalls();
  await generationButton().dispatchEvent('click');
  assert.equal(await generationCalls(), before, 'A terminal control cannot activate again');
}

async function validateSyntheticFixtures(): Promise<void> {
  for (const mode of ['local', 'groq'] as const) {
    const runId = `generation-fixture-${mode}`;
    const parsed = validateRun(generationScanRun(runId, mode));
    assert.ok(parsed.ok && parsed.value.status === 'completed');
    const guidance = await supportedGuidanceEnvelope(runId, mode);
    const admittedGuidance = admitGuidance(guidance, parsed.value, 'finding-0');
    assert.ok(admittedGuidance?.ok);

    const proposal = structuredClone(successfulGenerationEnvelope(runId, mode)) as Mutable;
    proposal.run.scan.findings[0].result.assumptions = [];
    proposal.run.scan.findings[0].result.uncertainty = '<img src="https://canary.invalid">';
    assert.ok(admitGeneration(proposal, admittedGuidance.run, 'finding-0')?.ok);

    if (mode === 'local') {
      for (const error of ['missing-prerequisite', 'configuration', 'input-fit'] as const) {
        assert.ok(admitGeneration(failedGenerationEnvelope(error, {
          run: supportedGenerationRun(runId, mode),
        }), admittedGuidance.run, 'finding-0'));
      }
      for (const error of ['authentication', 'quota', 'rate-limit', 'network', 'provider',
        'response-validation', 'timeout'] as const) {
        assert.ok(admitGeneration(persistedFailure(runId, mode, error), admittedGuidance.run, 'finding-0'));
      }
      const invocation = generationInvocation(mode);
      assert.ok(admitGeneration(failedGenerationEnvelope('generation-persistence', {
        run: runningGenerationRun(runId), cleanupFailed: true, invocation,
      }), admittedGuidance.run, 'finding-0'));
      assert.ok(admitGeneration(failedGenerationEnvelope('response-validation', {
        cleanupFailed: true,
      }), admittedGuidance.run, 'finding-0'));
      assert.ok(admitGeneration(failedGenerationEnvelope('shutdown', {
        cleanupFailed: true,
      }), admittedGuidance.run, 'finding-0'));
    }
  }
}

describe('M3-05 explicit Finding generation UI', { concurrency: false, timeout: 120000 }, () => {
  before(async () => {
    await validateSyntheticFixtures();
    harness = await startHarness();
    page = harness.page;
  });
  after(async () => { if (!appHarnessClosed && harness) await harness.close(); });
  beforeEach(async () => {
    await page.evaluate(async () => {
      await window.m104.settle();
      window.m104.timerDelay = null;
      window.m104.reads = 0;
      window.m104.canary = 0;
      window.m104.raw = null;
      window.m104.mount(false);
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await paint();
  });

  it('exposes one mode-bound explicit action and consumes it synchronously without moving focus', async () => {
    for (const [mode, disclosure] of [
      ['local', ['Local', 'Ollama', 'qwen3.5:4b', 'loopback']],
      ['groq', ['Groq', 'openai/gpt-oss-20b', 'external', 'selected']],
    ] as const) {
      const runId = `generation-explicit-${mode}`;
      await openEligible(runId, mode);
      assert.equal(await generationButton().count(), 1);
      const text = await detail().innerText();
      for (const value of disclosure) assert.match(text, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').nth(1).click();
      await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
      assert.match(await status().innerText(), mode === 'local' ? /local.*ollama.*qwen3\.5:4b/i : /groq.*openai\/gpt-oss-20b/i);
      assert.match(await status().innerText(), /no.*call|not.*attempt/i);
      await setGeneration('hold', `${mode}-pending`);
      await generationButton().focus();
      await page.keyboard.press('Enter');
      assert.equal(await generationCalls(), 1);
      assert.deepEqual(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'generation')
        .map(call => call.stage === 'generation' ? call.value : null)), [{ runId, findingId: 'finding-0' }]);
      assert.equal(await generationButton().getAttribute('aria-disabled'), 'true');
      assert.ok(await generationButton().evaluate(node => node === document.activeElement));
      await generationButton().dispatchEvent('click');
      assert.equal(await generationCalls(), 1);
      assert.match(await status().innerText(), /generat|proposal/i);
      const sibling = page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').nth(1);
      const original = page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first();
      await sibling.click();
      await original.click();
      assert.match(await status().innerText(), mode === 'local' ? /local.*ollama.*qwen3\.5:4b/i : /groq.*openai\/gpt-oss-20b/i);
      assert.match(await status().innerText(), /unknown|not.*confirm|does not yet confirm/i);
      assert.ok(await original.evaluate(node => node === document.activeElement));
      await sibling.focus();
      await page.keyboard.press('Enter');
      await page.evaluate(({ key, outcome }) => window.m104.resolveKey(key, outcome), {
        key: `${mode}-pending`, outcome: successfulGenerationEnvelope(runId, mode),
      });
      await page.waitForFunction(() => /proposal pending review/i.test(document.querySelector('[role=status]')?.textContent ?? ''));
      assert.match(await status().innerText(), /provider call.*attempt|invocation.*attempt/i);
      assert.ok(await sibling.evaluate(node => node === document.activeElement));
      assert.equal(await sibling.getAttribute('aria-pressed'), 'true');
      await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
      await detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).waitFor();
      assert.match(await status().innerText(), mode === 'local' ? /local.*ollama.*qwen3\.5:4b/i : /groq.*openai\/gpt-oss-20b/i);
      assert.match(await status().innerText(), /provider call.*attempt|invocation.*attempt/i);
      await assertTerminalControl();
    }
  });

  it('presents pre-call, attempted, unsaved and unknown failures without creating another action', async () => {
    const cases = [
      { name: 'missing prerequisite', error: 'missing-prerequisite', outcome: (id: string) =>
        failedGenerationEnvelope('missing-prerequisite', { run: supportedGenerationRun(id) }), expected: /before|not attempted|no provider/i },
      { name: 'configuration', error: 'configuration', outcome: (id: string) =>
        failedGenerationEnvelope('configuration', { run: supportedGenerationRun(id) }), expected: /before|not attempted|no provider/i },
      { name: 'input fit', error: 'input-fit', outcome: (id: string) =>
        failedGenerationEnvelope('input-fit', { run: supportedGenerationRun(id) }), expected: /before|not attempted|no provider/i },
      { name: 'authentication attempt', error: 'authentication', outcome: (id: string) =>
        persistedFailure(id, 'local', 'authentication'), expected: /attempt/i },
      { name: 'quota attempt', error: 'quota', outcome: (id: string) =>
        persistedFailure(id, 'local', 'quota'), expected: /attempt/i },
      { name: 'rate limit attempt', error: 'rate-limit', outcome: (id: string) =>
        persistedFailure(id, 'local', 'rate-limit'), expected: /attempt/i },
      { name: 'network attempt', error: 'network', outcome: (id: string) =>
        persistedFailure(id, 'local', 'network'), expected: /attempt/i },
      { name: 'provider attempt', error: 'provider', outcome: (id: string) =>
        persistedFailure(id, 'local', 'provider'), expected: /attempt/i },
      { name: 'response validation attempt', error: 'response-validation', outcome: (id: string) =>
        persistedFailure(id, 'local', 'response-validation'), expected: /attempt/i },
      { name: 'timeout attempt', error: 'timeout', outcome: (id: string) =>
        persistedFailure(id, 'local', 'timeout'), expected: /attempt/i },
      { name: 'unsaved known attempt', error: 'generation-persistence', outcome: (id: string) => {
        const invocation = generationInvocation('local');
        return failedGenerationEnvelope('generation-persistence', { run: runningGenerationRun(id),
          cleanupFailed: true, invocation });
      }, expected: /attempt|not saved|save/i },
      { name: 'unknown response', error: 'response-validation', outcome: () =>
        failedGenerationEnvelope('response-validation', { cleanupFailed: true }), expected: /unknown|uncertain/i },
      { name: 'shutdown uncertainty', error: 'shutdown', outcome: () =>
        failedGenerationEnvelope('shutdown', { cleanupFailed: true }), expected: /unknown|uncertain/i },
    ];
    for (const [index, scenario] of cases.entries()) {
      const runId = `generation-failure-${index}`;
      await openEligible(runId);
      await setGeneration(scenario.outcome(runId));
      await generationButton().click();
      const text = await detail().innerText();
      assert.ok(text.includes(scenario.error), `${scenario.name} must expose its bounded category`);
      assert.match(text, scenario.expected, scenario.name);
      assert.equal(text.includes('proposal-pending-review'), false);
      await assertTerminalControl();
      const card = page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first();
      assert.match(await card.innerText(), /generation failed|outcome unknown/i);
      assert.equal((await card.innerText()).includes('Guidance failed'), false);
      await card.click();
      assert.match(await status().innerText(), /local.*ollama.*qwen3\.5:4b/i);
      assert.match(await status().innerText(), scenario.expected, scenario.name);
      if (index >= 3 && index <= 10) assert.match(await status().innerText(), /provider call.*attempt|invocation.*attempt/i);
      assert.ok(await card.evaluate(node => node === document.activeElement));
      if (scenario.error === 'provider') await assertAccessibleAtViewports(detail());
    }

    for (const [name, expectedCalls] of [
      ['rejected', 1],
      ['malformed', 1],
      ['missing', 0],
    ] as const) {
      await openEligible(`generation-collaborator-${name}`);
      await page.evaluate(({ name }) => {
        if (name === 'rejected') window.m104.generation = () => Promise.reject(new Error('PRIVATE'));
        if (name === 'malformed') window.m104.generation = () => Promise.resolve({ private: 'PRIVATE' });
        window.m104.rerender(true, {}, true, name !== 'missing');
      }, { name });
      await generationButton().click();
      await page.waitForFunction(() => /unknown|uncertain|failed|invalid/i.test(
        document.querySelector('[role=status]')?.textContent ?? ''));
      assert.equal(await generationCalls(), expectedCalls);
      assert.ok(!(await page.locator('body').innerText()).includes('PRIVATE'));
      await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
      assert.equal(await page.getByRole('radio', { name: /Approve|Edit and accept|Reject/ }).count(), 0,
        'Failed, malformed, and missing generation outcomes must remain non-reviewable');
      assert.match(await status().innerText(), /local.*ollama.*qwen3\.5:4b/i);
      assert.match(await status().innerText(), /unknown|uncertain/i);
      await assertTerminalControl();
    }
  });

  it('renders the validated proposal as inert interpretation with all eleven contract fields', async () => {
    for (const assumptions of [['The retained evidence describes the element under review.'], []] as const) {
      const runId = assumptions.length ? 'generation-proposal-assumption' : 'generation-proposal-no-assumptions';
      const outcome = structuredClone(successfulGenerationEnvelope(runId)) as Mutable;
      const proposal = outcome.run.scan.findings[0].result;
      outcome.run.scan.findings[0].result.assumptions = [...assumptions];
      outcome.run.scan.findings[0].result.uncertainty = '<img src="https://canary.invalid" onerror="window.m104.canary++">';
      valid(outcome.run);
      await openEligible(runId);
      await setGeneration(outcome);
      await generationButton().click();
      const text = await detail().innerText();
      for (const value of [
        'The scanner recorded a bounded issue for the selected element.',
        'Some people may not receive the information conveyed by this element.',
        'Use the cited guidance to choose a bounded change for this element.',
        'complete', 'supported', 'medium', '<img src="https://canary.invalid"',
        'Determine the appropriate accessible treatment for this element.',
        'Rescan and perform the relevant human checks after the change.',
      ]) assert.ok(text.includes(value), value);
      if (assumptions.length) assert.ok(text.includes(assumptions[0]!));
      else assert.match(text, /no assumptions|none/i);
      for (const reference of [
        ...proposal.findingSummary.evidenceReferences,
        ...proposal.userImpact.passageIds,
        ...proposal.remediation.passageIds,
      ]) assert.ok(text.includes(reference), `Missing proposal-scoped reference ${reference}`);
      assert.match(text, /Retrieved guidance/i);
      for (const heading of [/AI interpretation|model-generated/i, /confidence/i, /uncertainty/i,
        /assumptions/i, /manual judgment/i, /post-change|verification reminder/i])
        assert.match(text, heading);
      assert.equal(await detail().locator('img, iframe, object, embed, script, [onerror]').count(), 0);
      assert.equal(await page.evaluate(() => window.m104.canary), 0);
      assert.match(await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().innerText(),
        /proposal pending review/i);
      assert.equal((await detail().innerText()).includes('Eligible for generation'), false);
      await assertTerminalControl();
      if (!assumptions.length) await assertAccessibleAtViewports(detail());
    }
  });

  it('reserves before callback-property reflection and rejects reentry or unmount dispatch', async () => {
    await openEligible('generation-accessor-reentry', 'local', true);
    assert.equal(await page.evaluate(() => window.m104.generationReads), 0,
      'The generation collaborator must not be reflected during ordinary render');
    await page.evaluate(() => {
      window.m104.generation = () => window.m104.hold('accessor-reentry');
      window.m104.rerender(true, {}, true, true, true);
    });
    await paint();
    await generationButton().evaluate(node => { window.m104.savedNode = node; });
    await page.evaluate(() => {
      window.m104.generationAccessor = callback => {
        window.m104.canary++;
        (window.m104.savedNode as HTMLButtonElement).click();
        return callback;
      };
    });
    await generationButton().click();
    assert.equal(await page.evaluate(() => window.m104.canary), 1, 'The callback-property getter reentered through the observed control');
    assert.equal(await page.evaluate(() => window.m104.generationReads), 1);
    assert.equal(await generationCalls(), 1);
    await page.evaluate(outcome => window.m104.resolveKey('accessor-reentry', outcome),
      successfulGenerationEnvelope('generation-accessor-reentry'));
    await detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).waitFor();

    await openEligible('generation-accessor-unmount', 'local', true);
    await page.evaluate(() => {
      window.m104.generation = () => Promise.resolve({ ok: false, error: 'not-eligible', run: null,
        persisted: false, cleanupFailed: false, invocationPersisted: false });
      window.m104.rerender(true, {}, true, true, true);
      window.m104.generationAccessor = callback => { window.m104.unmount(); return callback; };
    });
    await generationButton().click();
    await paint();
    assert.equal(await page.evaluate(() => window.m104.generationReads), 1);
    assert.equal(await generationCalls(), 0, 'Unmount during reflection must prevent collaborator dispatch');
    assert.equal(await page.getByRole('main').count(), 0);

    await openEligible('generation-accessor-deadline', 'local', true);
    await page.evaluate(() => {
      const ownPerformance = Object.getOwnPropertyDescriptor(performance, 'now');
      const originalPerformance = performance.now.bind(performance);
      const originalDate = Date.now;
      window.m104.raw = { ownPerformance, originalDate };
      window.m104.generation = () => Promise.resolve({ ok: false, error: 'not-eligible', run: null,
        persisted: false, cleanupFailed: false, invocationPersisted: false });
      window.m104.rerender(true, {}, true, true, true);
      window.m104.generationAccessor = callback => {
        Object.defineProperty(performance, 'now', { configurable: true, value: () => originalPerformance() + 300001 });
        Date.now = () => originalDate() + 300001;
        return callback;
      };
    });
    try {
      await generationButton().click();
      assert.equal(await page.evaluate(() => window.m104.generationReads), 1);
      assert.equal(await generationCalls(), 0, 'Elapsed deadline after reflection must prevent dispatch');
      assert.match(await status().innerText(), /time|unknown|uncertain/i);
    } finally {
      await page.evaluate(() => {
        const saved = window.m104.raw;
        Date.now = saved.originalDate;
        if (saved.ownPerformance) Object.defineProperty(performance, 'now', saved.ownPerformance);
        else delete (performance as any).now;
        window.m104.raw = null;
      });
    }
  });

  it('aborts pending generation on unmount and ignores its late settlement', async () => {
    const runId = 'generation-unmount-pending';
    const key = 'generation-unmount-pending';
    await openEligible(runId);
    await setGeneration('hold', key);
    await generationButton().click();
    assert.equal(await generationCalls(), 1);

    const aborted = await page.evaluate(() => {
      window.m104.reads = 0;
      window.m104.unmount();
      const call = window.m104.calls.find(item => item.stage === 'generation');
      return call?.stage === 'generation' && call.signal.aborted;
    });
    assert.equal(aborted, true);
    await page.evaluate(async ({ key, outcome }) => {
      const late = new Proxy(structuredClone(outcome), {
        ownKeys(target) {
          window.m104.reads++;
          return Reflect.ownKeys(target);
        },
      });
      window.m104.resolveKey(key, late);
      await Promise.resolve();
      await Promise.resolve();
    }, { key, outcome: successfulGenerationEnvelope(runId) });

    assert.equal(await page.evaluate(() => window.m104.reads), 0,
      'Late generation success must not enter response admission');
    assert.equal(await generationCalls(), 1);
    assert.equal(await page.getByRole('main').count(), 0);
  });

  it('times out when generation expires during response admission reflection', async () => {
    const runId = 'generation-response-reflection-deadline';
    const outcome = successfulGenerationEnvelope(runId);
    await openEligible(runId);
    await page.evaluate(outcome => {
      const descriptor = Object.getOwnPropertyDescriptor(performance, 'now');
      const original = performance.now.bind(performance);
      window.m104.raw = { descriptor };
      window.m104.reads = 0;
      window.m104.generation = () => Promise.resolve(new Proxy(structuredClone(outcome), {
        ownKeys(target) {
          window.m104.reads++;
          Object.defineProperty(performance, 'now', {
            configurable: true,
            value: () => original() + 300001,
          });
          return Reflect.ownKeys(target);
        },
      }));
      window.m104.rerender(true, {}, true, true);
    }, outcome);

    try {
      await generationButton().click();
      await page.waitForFunction(() => /time|unknown|uncertain/i.test(document.querySelector('[role=status]')?.textContent ?? ''));
      assert.equal(await page.evaluate(() => window.m104.reads), 1);
      assert.equal(await page.evaluate(() => {
        const call = window.m104.calls.find(item => item.stage === 'generation');
        return call?.stage === 'generation' && call.signal.aborted;
      }), true);
      assert.equal(await detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).count(), 0,
        'A response admitted after expiry must not publish generation success');
    } finally {
      await page.evaluate(() => {
        const descriptor = window.m104.raw?.descriptor;
        if (descriptor) Object.defineProperty(performance, 'now', descriptor);
        else delete (performance as any).now;
        window.m104.raw = null;
      });
    }
  });

  it('keeps Local pending beyond the Groq deadline while Groq still expires at 120 seconds', async () => {
    await openEligible('generation-local-extended-deadline', 'local');
    await setGeneration('hold', 'local-after-120');
    await page.evaluate(() => {
      const ownPerformance = Object.getOwnPropertyDescriptor(performance, 'now');
      const originalPerformance = performance.now.bind(performance);
      window.m104.raw = { ownPerformance, originalPerformance };
    });
    try {
      await generationButton().click();
      await page.evaluate(() => {
        const saved = window.m104.raw;
        Object.defineProperty(performance, 'now', {
          configurable: true,
          value: () => saved.originalPerformance() + 120001,
        });
      });
      await page.evaluate(outcome => window.m104.resolveKey('local-after-120', outcome),
        successfulGenerationEnvelope('generation-local-extended-deadline'));
      await detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).waitFor();
    } finally {
      await page.evaluate(() => {
        const saved = window.m104.raw;
        if (saved.ownPerformance) Object.defineProperty(performance, 'now', saved.ownPerformance);
        else delete (performance as any).now;
        window.m104.raw = null;
      });
    }

    await openEligible('generation-groq-deadline', 'groq');
    await setGeneration('hold', 'groq-timeout');
    await page.evaluate(() => {
      const nativeTimeout = window.setTimeout.bind(window);
      window.m104.raw = { nativeTimeout };
      window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: any[]) => {
        if (delay === 120000) {
          window.m104.timerDelay = delay;
          return nativeTimeout(handler, 0, ...args);
        }
        return nativeTimeout(handler, delay, ...args);
      }) as typeof window.setTimeout;
    });
    try {
      await generationButton().click();
      await page.waitForFunction(() => window.m104.timerDelay !== null);
      assert.equal(await page.evaluate(() => window.m104.timerDelay), 120000);
      await page.waitForFunction(() => /time|unknown|uncertain/i.test(document.querySelector('[role=status]')?.textContent ?? ''));
    } finally {
      await page.evaluate(() => {
        window.setTimeout = window.m104.raw.nativeTimeout;
        window.m104.raw = null;
      });
    }
  });

  it('times out the complete collaborator lifetime and prevents an old settlement from changing a newer owner', async () => {
    const oldId = 'generation-late-old';
    await openEligible(oldId);
    await setGeneration('hold', 'old-generation');
    await page.evaluate(() => {
      const nativeTimeout = window.setTimeout.bind(window);
      window.m104.raw = { nativeTimeout };
      window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: any[]) => {
        if (delay === 300000 || delay === 120000) {
          window.m104.timerDelay = delay;
          return nativeTimeout(handler, 0, ...args);
        }
        return nativeTimeout(handler, delay, ...args);
      }) as typeof window.setTimeout;
    });
    try {
      await generationButton().click();
      await page.waitForFunction(() => window.m104.timerDelay !== null);
      assert.equal(await page.evaluate(() => window.m104.timerDelay), 300000);
      await page.waitForFunction(() => /time|unknown|uncertain/i.test(document.querySelector('[role=status]')?.textContent ?? ''));
      const oldSignalAborted = await page.evaluate(() => {
        const call = window.m104.calls.find(item => item.stage === 'generation');
        return call?.stage === 'generation' && call.signal.aborted;
      });
      assert.equal(oldSignalAborted, true);
    } finally {
      await page.evaluate(() => { window.setTimeout = window.m104.raw.nativeTimeout; });
    }

    const newId = 'generation-late-new';
    const newScan = valid(generationScanRun(newId));
    const newGuidance = await supportedGuidanceEnvelope(newId);
    await page.evaluate(({ newScan, newGuidance }) => {
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(newScan) });
      window.m104.guidance = () => Promise.resolve(structuredClone(newGuidance));
      window.m104.generation = () => window.m104.hold('new-generation');
      window.m104.rerender(true, {}, true, true);
    }, { newScan, newGuidance });
    await page.getByLabel('Target URL').fill(newScan.requestedUrl);
    await page.getByLabel('Local (recommended)').check();
    const analyzeBeforeNewRun = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length);
    await analyzeButton().click();
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length),
      analyzeBeforeNewRun + 1, 'A generation-unknown owner must still allow a new independent Analyze');
    await detail().waitFor({ state: 'detached' });
    await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await detail().getByText('Eligible for generation', { exact: true }).waitFor();
    await generationButton().click();
    assert.equal(await generationCalls(), 2);
    await page.evaluate(outcome => window.m104.resolveKey('old-generation', outcome), successfulGenerationEnvelope(oldId));
    await paint();
    assert.equal((await detail().innerText()).includes('The scanner recorded a bounded issue'), false,
      'Late old success cannot publish into the new run');
    assert.equal(await generationButton().getAttribute('aria-disabled'), 'true');
    await generationButton().dispatchEvent('click');
    assert.equal(await generationCalls(), 2, 'Old settlement cannot release the newer pending owner');
    await page.evaluate(outcome => window.m104.resolveKey('new-generation', outcome), successfulGenerationEnvelope(newId));
    await detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).waitFor();
    await page.evaluate(() => { window.m104.raw = null; });
  });

  it('keeps abstentions and observations action-free and preserves selection, semantics and reflow', async () => {
    const abstained = valid(assessedMissingRetrievalRun('generation-abstention'));
    await page.evaluate(run => {
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
      window.m104.mount(true, {}, true, true);
    }, abstained);
    await page.getByLabel('Target URL').fill(abstained.requestedUrl);
    await page.getByLabel('Local (recommended)').check();
    await analyzeButton().click();
    await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
    assert.equal(await generationButton().count(), 0);
    await page.getByRole('button', { name: /review 1/i }).first().click();
    assert.equal(await generationButton().count(), 0);
    assert.equal(await page.getByRole('radio', { name: /Approve|Edit and accept|Reject/ }).count(), 0,
      'Scanner review observations must remain non-reviewable');

    await openEligible('generation-accessibility');
    const selectedCard = page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first();
    await selectedCard.focus();
    await page.keyboard.press('Enter');
    assert.ok(await selectedCard.evaluate(node => node === document.activeElement));
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 800 });
      await paint();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
      const axe = await new AxeBuilder({ page }).analyze();
      assert.deepEqual(axe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
    }
    assert.equal(await status().getAttribute('aria-atomic'), 'true');
  });

  it('writes only the eight explicitly enabled synthetic proof images', async () => {
    if (process.env.A11Y_M305_CAPTURE_PROOF !== '1') return;
    const proofRoot = path.resolve(repo, 'temp/m305-generation-proof');
    assert.ok(proofRoot.startsWith(repo + path.sep));
    const proofStat = fs.lstatSync(proofRoot);
    assert.ok(proofStat.isDirectory() && !proofStat.isSymbolicLink());
    assert.deepEqual(fs.readdirSync(proofRoot), []);
    const capture = async (state: string): Promise<void> => {
      for (const [viewport, width] of [['desktop', 1280], ['narrow', 320]] as const) {
        await page.setViewportSize({ width, height: 800 });
        await (state === 'proposal'
          ? detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true })
          : generationButton()).scrollIntoViewIfNeeded();
        await paint();
        const target = path.join(proofRoot, `${state}-${viewport}.png`);
        assert.equal(fs.existsSync(target), false);
        const buffer = await page.screenshot();
        fs.writeFileSync(target, buffer, { flag: 'wx' });
      }
    };
    await openEligible('generation-capture-eligible');
    await capture('eligible');
    await setGeneration('hold', 'capture-pending');
    await generationButton().click();
    await capture('pending');
    await page.evaluate(outcome => window.m104.resolveKey('capture-pending', outcome),
      failedGenerationEnvelope('missing-prerequisite', { run: supportedGenerationRun('generation-capture-eligible') }));
    await detail().getByText(/missing-prerequisite/).waitFor();
    await capture('failed');
    await openEligible('generation-capture-proposal');
    await setGeneration(successfulGenerationEnvelope('generation-capture-proposal'));
    await generationButton().click();
    await detail().getByText('The scanner recorded a bounded issue for the selected element.', { exact: true }).waitFor();
    await capture('proposal');
    assert.deepEqual(fs.readdirSync(proofRoot).sort(), [
      'eligible-desktop.png', 'eligible-narrow.png', 'failed-desktop.png', 'failed-narrow.png',
      'pending-desktop.png', 'pending-narrow.png', 'proposal-desktop.png', 'proposal-narrow.png',
    ]);
  });

  it('keeps actual main fetch and deferred response.json inside the local deadline', async () => {
    const runId = 'generation-main-transport';
    const scan = valid(generationScanRun(runId));
    const guidance = await supportedGuidanceEnvelope(runId);
    await harness.close();
    appHarnessClosed = true;
    const mainHarness = await startHarness(false, 'main');
    page = mainHarness.page;
    try {
      await page.evaluate(({ scan, guidance }) => {
        const nativeTimeout = window.setTimeout.bind(window);
        window.m104.raw = { signal: null, jsonStarted: false, nativeTimeout };
        window.m104.fetch = (input, init = {}) => {
          const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
          const pathname = new URL(url, location.href).pathname;
          if (pathname === '/api/runs') return Promise.resolve({ json: () => Promise.resolve({ ok: true, run: structuredClone(scan) }) });
          if (pathname === '/api/finding-guidance') return Promise.resolve({ json: () => Promise.resolve(structuredClone(guidance)) });
          if (pathname === '/api/finding-generation') {
            window.m104.raw.signal = init.signal ?? null;
            window.m104.raw.jsonStarted = false;
            return Promise.resolve({ json: () => {
              window.m104.raw.jsonStarted = true;
              return window.m104.hold('main-json');
            } });
          }
          return Promise.reject(new Error(`Unexpected controlled path ${pathname}`));
        };
      }, { scan, guidance });
      await page.getByLabel('Target URL').fill(scan.requestedUrl);
      await page.getByLabel('Local (recommended)').check();
      await analyzeButton().click();
      await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
      await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
      await detail().getByText('Eligible for generation', { exact: true }).waitFor();
      assert.equal(await generationButton().count(), 1);
      await page.evaluate(() => {
        const nativeTimeout = window.m104.raw.nativeTimeout;
        window.m104.timerDelay = null;
        window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: any[]) => {
          if (delay === 300000 || delay === 120000) {
            window.m104.timerDelay = delay;
            return nativeTimeout(handler, 0, ...args);
          }
          return nativeTimeout(handler, delay, ...args);
        }) as typeof window.setTimeout;
      });
      await generationButton().click();
      await page.waitForFunction(() => window.m104.raw?.jsonStarted === true);
      const call = await page.evaluate(() => window.m104.calls.find(item => item.stage === 'http'
        && new URL(item.stage === 'http' ? item.value.url : '', location.href).pathname === '/api/finding-generation'));
      assert.ok(call && call.stage === 'http');
      assert.deepEqual({ method: call.value.method, body: call.value.body, contentType: call.value.contentType }, {
        method: 'POST', body: JSON.stringify({ runId, findingId: 'finding-0' }), contentType: 'application/json',
      });
      assert.equal(await page.evaluate(() => window.m104.timerDelay), 300000);
      await page.waitForFunction(() => window.m104.raw?.signal?.aborted === true);
      assert.match(await status().innerText(), /time|unknown|uncertain/i);
      await page.evaluate(outcome => window.m104.resolveKey('main-json', outcome), successfulGenerationEnvelope(runId));
      await paint();
      assert.equal((await detail().innerText()).includes('The scanner recorded a bounded issue'), false);
    } finally {
      if (!page.isClosed()) {
        await page.evaluate(() => {
          if (window.m104.raw?.nativeTimeout) window.setTimeout = window.m104.raw.nativeTimeout;
        });
      }
      await mainHarness.close();
    }
  });
});
