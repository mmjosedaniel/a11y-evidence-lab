import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Locator, Page } from 'playwright';
import { completedRun, failedRun } from './helpers/m102-run-fixture.ts';
import { richRun, startHarness, targetUrl, valid } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';
import type { Finding, ScannerReviewObservation } from '../src/server/domain/run-contract.ts';

const copy = {
  absent: 'Analyze is unavailable in this build; service integration is pending.',
  analyzeAbsent: 'Analyze is unavailable in this build; service integration is pending.',
  target: 'Use a public HTTPS page you are permitted to analyze and willing to trust. Private, authenticated, and hostile pages aren’t supported.',
  results: 'This automated scan covers only image-alt, label and color-contrast in the current rendered top-level document. Iframes, inactive states and other rules are excluded. Findings and counts do not establish accessibility, conformance, certification or legal compliance.',
  local: 'Local (recommended) — Ollama · qwen3.5:4b. Generation prompts and responses use the approved loopback Ollama endpoint and a locally present model, not hosted inference. The public-page scan still uses external HTTPS; this is not offline or system-wide zero-egress operation.',
  groq: 'Groq — openai/gpt-oss-20b. A later explicit Generate action for one eligible Finding may send minimized rule-specific evidence and required curated-guidance passages to Groq for remote processing. Target URLs, locators, sibling Findings and credentials are excluded from that content. Selecting a mode or scanning makes no provider call.',
  urlError: 'Enter a valid HTTPS URL without embedded credentials.',
  modeError: 'Choose Local or Groq.',
  busy: 'An operation is in progress.',
};

let harness: Harness;
let page: Page;
const textbox = () => page.getByRole('textbox', { name: /target|url/i });
const analyzeButton = () => page.getByRole('button', { name: /^analyze$/i });
const status = () => page.getByRole('status');
const findingButton = (id: string) => page.getByRole('button', { name: new RegExp(`\\b${id}\\b`) });
const resultsHeading = () => page.getByRole('heading', { name: /^results$/i });

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}
async function visible(text: string): Promise<void> { await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible' }); }
async function announced(text: string): Promise<void> {
  await page.waitForFunction(text => document.querySelector('[role="status"]')?.textContent?.includes(text), text);
}
async function calls(): Promise<number> { return page.evaluate(() => window.m104.calls.length); }
async function mount(analyze = true): Promise<void> {
  await page.evaluate(analyze => window.m104.mount(analyze), analyze);
  await paint();
}
async function response(result: unknown): Promise<void> {
  await page.evaluate(result => {
    window.m104.raw = result;
    window.m104.analyze = () => Promise.resolve(window.m104.raw);
    window.m104.rerender();
  }, result);
  await paint();
}
async function analyze(result: unknown, mode: 'local' | 'groq' = 'local', target = targetUrl): Promise<void> {
  await response(result);
  await textbox().fill(target);
  await page.getByRole('radio', { name: mode === 'local' ? /local/i : /groq/i }).check();
  await analyzeButton().click();
  await paint();
}
async function openComplete(): Promise<ReturnType<typeof richRun>> {
  const run = richRun();
  await analyze({ ok: true, run });
  await findingButton('finding-0').waitFor();
  return run;
}
async function select(id = 'finding-0'): Promise<Locator> {
  const button = findingButton(id);
  await button.click();
  assert.equal(await button.getAttribute('aria-pressed'), 'true');
  const controls = await button.getAttribute('aria-controls');
  assert.ok(controls, 'Finding button must identify its detail region');
  const detail = page.locator(`[id=${JSON.stringify(controls)}]`);
  const heading = detail.getByRole('heading', { name: new RegExp(id) });
  assert.equal(await heading.getAttribute('tabindex'), '-1');
  assert.ok(await heading.evaluate(node => node === document.activeElement));
  return detail;
}
async function retained(): Promise<void> {
  assert.equal(await findingButton('finding-0').getAttribute('aria-pressed'), 'true');
  assert.ok(await page.evaluate(() => window.m104.savedNode?.isConnected));
  await technicalRunContains('m104-complete-01');
}
async function technicalRunContains(runId: string, root: Locator = page.getByRole('region', { name: 'Results', exact: true }), outcome = 'completed'): Promise<void> {
  const defaultText = await root.innerText();
  assert.ok(defaultText.includes(outcome));
  assert.ok(defaultText.includes('No provider call was attempted.'));
  const technical = disclosure('Technical run details', root);
  assert.equal(await technical.count(), 1);
  assert.equal(await technical.evaluate(node => (node as HTMLDetailsElement).open), false);
  assert.equal(await technical.getByText(runId, { exact: true }).count(), 1);
  assert.equal(await technical.getByText(runId, { exact: true }).isVisible(), false);
}
async function keepComplete(): Promise<ReturnType<typeof richRun>> {
  const record = await openComplete();
  await select();
  await page.evaluate(() => { window.m104.savedNode = document.activeElement; });
  return record;
}
async function described(control: Locator, text: string): Promise<void> {
  assert.ok(await control.evaluate((element, expected) => (element.getAttribute('aria-describedby') ?? '').split(/\s+/)
    .some(id => document.getElementById(id)?.textContent?.includes(expected)), text), `Control must describe: ${text}`);
}
async function notDescribed(control: Locator, text: string): Promise<void> {
  assert.ok(await control.evaluate((element, excluded) => (element.getAttribute('aria-describedby') ?? '').split(/\s+/)
    .every(id => !document.getElementById(id)?.textContent?.includes(excluded)), text), `Control must not describe: ${text}`);
}
function renderedFact(fact: { readonly value: unknown } | { readonly unavailable: string }): string {
  return 'value' in fact ? String(fact.value) : `Unavailable: ${fact.unavailable}`;
}
function conciseTargetFacts(item: Finding | ScannerReviewObservation): readonly string[] {
  switch (item.ruleId) {
    case 'image-alt': return [renderedFact(item.evidence.elementKind)];
    case 'label': return [renderedFact(item.evidence.elementKind), renderedFact(item.evidence.inputType)];
    case 'color-contrast': return [renderedFact(item.evidence.foregroundColor), renderedFact(item.evidence.backgroundColor),
      renderedFact(item.evidence.fontSize), renderedFact(item.evidence.fontWeight)];
  }
}
function disclosure(label: string, root: Locator = page.locator('body')): Locator {
  return root.getByText(label, { exact: true }).locator('xpath=ancestor::details[1]');
}
async function openDisclosure(label: string, root: Locator = page.locator('body'), keyboard = false): Promise<Locator> {
  const details = disclosure(label, root);
  assert.equal(await details.count(), 1, `${label} must identify one native disclosure`);
  assert.equal(await details.evaluate(node => node instanceof HTMLDetailsElement && node.open), false, `${label} must start collapsed`);
  const summary = details.locator('summary');
  if (keyboard) {
    await summary.focus();
    await page.keyboard.press('Enter');
  } else {
    await summary.click();
  }
  assert.equal(await details.evaluate(node => node instanceof HTMLDetailsElement && node.open), true, `${label} must open`);
  return details;
}
async function hasCoverageRuleGroup(root: Locator, rule: string, counts: Record<string, number | null>, complete: boolean): Promise<boolean> {
  const expected = Object.entries(counts).filter(([, value]) => complete || value !== null);
  const semanticLabels = root.getByRole('heading', { name: rule, exact: true })
    .or(root.getByRole('rowheader', { name: rule, exact: true }));
  for (let index = 0; index < await semanticLabels.count(); index += 1) {
    const label = semanticLabels.nth(index);
    const group = label.locator('xpath=ancestor::*[self::section or self::article or self::tr or @role="group" or @role="region"][1]');
    if (await group.count() !== 1) continue;
    const text = await group.innerText();
    if (expected.every(([bucket, value]) => new RegExp(`${bucket}[\\s\\S]*?${value ?? 'Not reported'}`, 'i').test(text))) return true;
  }
  return false;
}
async function rejected(code = 'invalid-result'): Promise<void> {
  await announced(`Analyze failed: ${code}.`);
  await visible(`Analyze failed: ${code}.`);
}

describe('M1-04 actual target/results UI: complete bounded observable contract', { concurrency: false }, () => {
  // One shared setup exposes the real Vite import failure once. All tests below remain unconditional.
  before(async () => { harness = await startHarness(); page = harness.page; });
  after(async () => { if (harness) await harness.close(); });
  beforeEach(async () => {
    await page.evaluate(async () => {
      await window.m104.settle();
      window.m104.analyze = () => Promise.resolve({ ok: false, error: 'create-failed', run: null, persisted: false, cleanupFailed: false });
      window.m104.reads = 0; window.m104.canary = 0; window.m104.raw = null;
      window.m104.savedNode = null; window.m104.oldNode = null;
      window.m104.mount();
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await paint();
  });

  it('provides the accepted entry semantics, one atomic status, and truthful Analyze capability', async () => {
    for (const [hasAnalyze, text] of [[false, copy.absent], [true, '']] as const) {
      await mount(hasAnalyze);
      assert.equal(await page.getByRole('main').count(), 1);
      assert.equal(await status().count(), 1);
      assert.equal(await status().getAttribute('aria-atomic'), 'true');
      if (text) await visible(text);
      assert.equal(await analyzeButton().isDisabled(), !hasAnalyze);
      if (!hasAnalyze) await described(analyzeButton(), text);
      assert.equal(await calls(), 0);
    }
    assert.equal(await page.getByRole('heading', { level: 1, name: 'Analyze a page', exact: true }).count(), 1);
    assert.equal(await page.getByRole('heading', { name: 'A11y Evidence Lab', exact: true }).count(), 0);
    assert.equal(await page.getByRole('heading', { name: 'Target and generation mode', exact: true }).count(), 0);
    assert.equal(await page.getByText(copy.modeError, { exact: true }).count(), 0);
    assert.equal(await page.getByRole('radio', { checked: true }).count(), 0);
    assert.ok(await page.locator('fieldset legend').count() >= 1);
    assert.equal(await page.getByRole('textbox', { name: /run id/i }).count(), 0);
    assert.equal(await page.getByRole('button', { name: /^reopen(?: run)?$/i }).count(), 0);
    assert.equal(await page.getByText(/reopen retained evidence/i).count(), 0);
    assert.equal(await page.getByRole('button', { name: /generate|retry|resume|cancel|review|compare|filter/i }).count(), 0);
    assert.equal(await page.locator('iframe, object, embed').count(), 0);
    const resultsLimitation = page.getByRole('region', { name: 'Results', exact: true }).locator('p').filter({ hasText: /image-alt/i });
    const entryDescription = await textbox().evaluate(element => {
      const descriptions = (element.getAttribute('aria-describedby') ?? '').split(/\s+/)
        .map(id => document.getElementById(id)).filter((node): node is HTMLElement => node instanceof HTMLElement);
      return { text: descriptions.map(node => node.textContent).join(' '), visible: descriptions.every(node => node.getClientRects().length > 0) };
    });
    assert.deepEqual({
      entryDescription,
      resultsLimitation: await resultsLimitation.innerText(),
    }, {
      entryDescription: { text: copy.target, visible: true },
      resultsLimitation: `${copy.results} ${copy.target}`,
    }, 'Entry and Results must state both permission and willingness to trust the public HTTPS page');
  });

  it('requires URL and explicit mode with associated errors without issuing any request', async () => {
    await analyzeButton().click();
    await visible(copy.urlError);
    await visible(copy.modeError);
    assert.ok((await status().textContent())?.includes(`${copy.urlError} ${copy.modeError}`));
    await described(textbox(), copy.urlError);
    assert.equal(await textbox().getAttribute('aria-invalid'), 'true');
    const modeGroup = page.getByRole('group').filter({ has: page.getByRole('radio', { name: /local/i }) });
    await described(modeGroup, copy.modeError);
    for (const url of ['not a url', 'http://example.org', 'file:///C:/target', 'https://', 'https://user:secret@example.org', 'javascript:alert(1)']) {
      await textbox().fill(url);
      await analyzeButton().click();
      await visible(copy.urlError);
    }
    await textbox().fill(targetUrl);
    await analyzeButton().click();
    await visible(copy.modeError);
    assert.equal(await calls(), 0);
  });

  for (const mode of ['local', 'groq'] as const) it(`normalizes URL and captures immutable ${mode} context without implicit provider work`, async () => {
    await page.getByRole('radio', { name: mode === 'local' ? /local/i : /groq/i }).check();
    await visible(mode === 'local' ? copy.local : copy.groq);
    assert.equal(await calls(), 0);
    const normalized = 'https://example.org/a?x=1#fragment';
    const record = valid({ ...completedRun(`normal-${mode}`, mode), requestedUrl: normalized });
    await analyze({ ok: true, run: record }, mode, ' HTTPS://EXAMPLE.ORG:443/a?x=1#fragment ');
    await technicalRunContains(record.runId);
    const recorded = await page.evaluate(() => window.m104.calls);
    assert.deepEqual(recorded.map(call => ({ stage: call.stage, value: call.value })), [{ stage: 'analyze', value: { requestedUrl: normalized, providerContext: record.providerContext } }]);
    await select();
    await announced(`Selected Finding finding-0, image-alt, unprocessed. ${mode}, ${record.providerContext.provider}, ${record.providerContext.model}. No provider call was attempted.`);
    assert.equal(await calls(), 1);
  });

  it('keeps complete evidence, selection and source/provider context through every closed Analyze failure', async () => {
    await keepComplete();
    for (const error of ['invalid-request', 'busy', 'stopping', 'create-failed', 'scan-failed', 'result-validation', 'initial-persistence', 'shutdown']) {
      await analyze({ ok: false, error, run: null, persisted: false, cleanupFailed: false });
      await rejected(error);
      await retained();
    }
  });

  it('distinguishes failed canonical records, unsaved failures and both directions of cleanup uncertainty', async () => {
    await keepComplete();
    const failed = failedRun('failed-closed');
    await analyze({ ok: false, error: 'scan-failed', run: failed, persisted: false, cleanupFailed: true });
    const failedRegion = page.getByRole('region', { name: 'Failed run', exact: true });
    const failedDefault = await failedRegion.innerText();
    for (const value of [failed.requestedUrl, 'failed', failed.providerContext.mode, failed.providerContext.provider,
      failed.providerContext.model, 'No provider call was attempted.']) assert.ok(failedDefault.includes(value), `Missing failed-run summary ${value}`);
    const combinedAxe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual({
      runSummaryRegions: await page.getByRole('region', { name: 'Run summary', exact: true }).count(),
      failedRequestedPageLabels: await failedRegion.getByText('Requested page', { exact: true }).count(),
      failedAnalyzedPageLabels: await failedRegion.getByText('Analyzed page', { exact: true }).count(),
      failedRequestedUrlPresent: await failedRegion.getByText(failed.requestedUrl, { exact: true }).count() > 0,
      axeViolations: combinedAxe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })),
    }, {
      runSummaryRegions: 0,
      failedRequestedPageLabels: 1,
      failedAnalyzedPageLabels: 0,
      failedRequestedUrlPresent: true,
      axeViolations: [],
    }, 'Combined retained-complete and failed results must have distinct navigation and truthful requested-page labeling');
    assert.ok(!failedDefault.includes(failed.runId), 'Run ID is technical provenance, not default failure content');
    const failedTechnical = await openDisclosure('Technical run details', failedRegion, true);
    assert.ok((await failedTechnical.innerText()).includes(failed.runId));
    await visible('This failed run was not saved.');
    await visible('Resource cleanup is uncertain.');
    await retained();
    await analyze({ ok: false, error: 'create-failed', run: null, persisted: false, cleanupFailed: true });
    await visible('Resource cleanup is uncertain.');
    await retained();
    await analyze({ ok: false, error: 'scan-failed', run: failedRun('cleanup-bad', 'local', 'failed'), persisted: true, cleanupFailed: false });
    await rejected();
    assert.equal(await page.getByText('cleanup-bad', { exact: true }).count(), 0);
    const cleanupGood = failedRun('cleanup-good', 'local', 'failed');
    await analyze({ ok: false, error: 'scan-failed', run: cleanupGood, persisted: true, cleanupFailed: true });
    const cleanupRegion = page.getByRole('region', { name: 'Failed run', exact: true });
    const cleanupTechnical = await openDisclosure('Technical run details', cleanupRegion);
    assert.ok((await cleanupTechnical.innerText()).includes(cleanupGood.runId));
    await visible('Resource cleanup is uncertain.');
    await retained();
  });

  it('rejects closed-envelope key/type/prototype/descriptor violations for Analyze', async () => {
    await keepComplete();
    const record = richRun('envelope-candidate');
    const success = { ok: true, run: record };
    const failure = { ok: false, error: 'scan-failed', run: null, persisted: false, cleanupFailed: false };
    for (const base of [success, failure]) {
    for (const mutation of ['null', 'array', 'primitive', 'extra', 'missing', 'undefined', 'symbol', 'nonenumerable', 'accessor', 'prototype', 'boolean', 'throw-ownKeys', 'throw-descriptor', 'throw-prototype']) {
      await page.evaluate(({ base, mutation }) => {
        const bridge = window.m104;
        const consumedKey = base.ok ? 'run' : 'error';
        let value: any = structuredClone(base);
        if (mutation === 'null') value = null;
        if (mutation === 'array') value = [];
        if (mutation === 'primitive') value = 'raw secret <img onerror=alert(1)>';
        if (mutation === 'extra') value.extra = true;
        if (mutation === 'missing') delete value[consumedKey];
        if (mutation === 'undefined') value[consumedKey] = undefined;
        if (mutation === 'symbol') value[Symbol('extra')] = true;
        if (mutation === 'nonenumerable') Object.defineProperty(value, consumedKey, { value: value[consumedKey], enumerable: false });
        if (mutation === 'accessor') Object.defineProperty(value, consumedKey, { enumerable: true, get() { bridge.reads++; throw Error('raw diagnostic'); } });
        if (mutation === 'prototype') Object.setPrototypeOf(value, { inherited: true });
        if (mutation === 'boolean') value.ok = 'true';
        if (mutation === 'throw-ownKeys') value = new Proxy(value, { ownKeys() { throw Error('raw diagnostic'); } });
        if (mutation === 'throw-descriptor') value = new Proxy(value, { getOwnPropertyDescriptor() { throw Error('raw diagnostic'); } });
        if (mutation === 'throw-prototype') value = new Proxy(value, { getPrototypeOf() { throw Error('raw diagnostic'); } });
        bridge.analyze = () => Promise.resolve(value);
        bridge.rerender();
      }, { base, mutation });
      await paint();
      await analyzeButton().click();
      await rejected();
      await retained();
      assert.equal(await page.evaluate(() => window.m104.reads), 0, mutation);
      assert.ok(!(await page.locator('body').innerText()).includes('raw diagnostic'));
    }
    }
  });

  it('admits null-prototype and get-trap canary envelopes only through captured data descriptors', async () => {
    for (const nullPrototype of [false, true]) {
      const record = richRun(nullPrototype ? 'null-proto' : 'get-trap');
      await page.evaluate(({ record, nullPrototype }) => {
        const envelope = Object.assign(Object.create(nullPrototype ? null : Object.prototype), { ok: true, run: record });
        window.m104.analyze = () => Promise.resolve(new Proxy(envelope, { get(target, key, receiver) {
          if (key !== 'then') { window.m104.reads++; throw Error('Raw property read'); }
          return Reflect.get(target, key, receiver);
        } }));
        window.m104.rerender();
      }, { record, nullPrototype });
      await paint();
      await textbox().fill(targetUrl);
      await page.getByRole('radio', { name: /local/i }).check();
      await analyzeButton().click();
      await technicalRunContains(record.runId);
      assert.equal(await page.evaluate(() => window.m104.reads), 0);
    }
  });

  it('rejects malformed runs/coverage and contradictory success/failure envelopes without partial publication', async () => {
    await keepComplete();
    const candidate = richRun('invalid-candidate');
    const missingCoverage = structuredClone(candidate) as any;
    delete missingCoverage.scan.coverage.label;
    const droppedNode = structuredClone(candidate) as any;
    droppedNode.scan.findings.pop();
    const unknownField = { ...candidate, credentials: 'DO-NOT-DISPLAY' };
    const cases: unknown[] = [
      { ok: true, run: missingCoverage }, { ok: true, run: droppedNode }, { ok: true, run: unknownField },
      { ok: true, run: failedRun('invalid-candidate') },
      { ok: false, error: 'not-found', run: null, persisted: false, cleanupFailed: false },
      { ok: false, error: 'scan-failed', run: candidate, persisted: true, cleanupFailed: false },
      { ok: false, error: 'scan-failed', run: null, persisted: true, cleanupFailed: false },
      { ok: false, error: 'scan-failed', run: null, persisted: 0, cleanupFailed: false },
      { ok: false, error: 'scan-failed', run: null, persisted: false, cleanupFailed: 'false' },
      { ok: false, error: 'scan-failed', run: null, persisted: false },
      { ok: false, error: 'scan-failed', run: null, persisted: false, cleanupFailed: false, extra: null },
    ];
    for (const result of cases) {
      await analyze(result);
      await rejected();
      await retained();
      assert.equal(await page.getByText('invalid-candidate', { exact: true }).count(), 0);
    }
    assert.ok(!(await page.locator('body').innerText()).includes('DO-NOT-DISPLAY'));
  });

  it('validates Analyze URL/provider identity even for failed records and rejects either retained run ID', async () => {
    await keepComplete();
    await analyze({ ok: false, error: 'scan-failed', run: failedRun('retained-failure'), persisted: true, cleanupFailed: false });
    await rejected('scan-failed');
    for (const record of [richRun('m104-complete-01'), richRun('retained-failure'), failedRun('m104-complete-01'), failedRun('retained-failure')]) {
      await analyze(record.status === 'completed' ? { ok: true, run: record } : { ok: false, error: 'scan-failed', run: record, persisted: true, cleanupFailed: false });
      await rejected();
      await retained();
      await technicalRunContains('retained-failure', page.getByRole('region', { name: 'Failed run', exact: true }), 'failed');
    }
    for (const source of [richRun('new-identity'), failedRun('new-identity')]) {
      for (const record of [valid({ ...source, requestedUrl: 'https://different.example/' }), valid({ ...source, providerContext: completedRun('x', 'groq').providerContext })]) {
        await analyze(record.status === 'completed' ? { ok: true, run: record } : { ok: false, error: 'scan-failed', run: record, persisted: true, cleanupFailed: false });
        await rejected();
        await retained();
      }
    }
  });

  it('shares a synchronous reservation across Analyze callback reentry', async () => {
    await page.evaluate(() => {
      window.m104.analyze = () => {
        for (const button of document.querySelectorAll('button')) {
          if (/^Analyze$/i.test(button.textContent?.trim() ?? '')) button.closest('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
        return window.m104.hold();
      };
      window.m104.rerender();
    });
    await paint();
    await textbox().fill(targetUrl);
    await page.getByRole('radio', { name: /local/i }).check();
    await analyzeButton().click();
    await visible(copy.busy);
    assert.equal(await calls(), 1);
    assert.equal(await analyzeButton().evaluate(node => !(node as HTMLButtonElement).disabled), true);
    assert.equal(await analyzeButton().getAttribute('aria-disabled'), 'true');
    await described(analyzeButton(), copy.busy);
    await page.evaluate(record => window.m104.resolve({ ok: true, run: record }), richRun('reentry-done'));
    await technicalRunContains('reentry-done');
    assert.equal(await analyzeButton().isEnabled(), true);
  });

  it('retains Analyze focus through owned work without permitting overlap', async () => {
    await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); });
    await paint();
    await textbox().fill(targetUrl);
    await page.getByRole('radio', { name: /local/i }).check();
    await analyzeButton().focus();
    await page.keyboard.press('Enter');
    await announced('Analyzing the requested page. No provider call was attempted.');
    assert.ok(await analyzeButton().evaluate(node => node === document.activeElement));
    assert.equal(await analyzeButton().evaluate(node => !(node as HTMLButtonElement).disabled), true);
    assert.equal(await analyzeButton().getAttribute('aria-disabled'), 'true');
    await described(analyzeButton(), copy.busy);
    await page.keyboard.press('Enter');
    await visible(copy.busy);
    assert.equal(await calls(), 1);
    assert.ok(await analyzeButton().evaluate(node => node === document.activeElement));
    await page.evaluate(record => window.m104.resolve({ ok: true, run: record }), richRun('focus-analyze'));
    await technicalRunContains('focus-analyze');
    assert.ok(await analyzeButton().evaluate(node => node === document.activeElement));
    assert.ok(await page.evaluate(() => document.activeElement !== document.body));

  });

  it('captures intent and callback through form/prop changes and refuses collaborator retargeting', async () => {
    await page.evaluate(() => {
      window.m104.analyze = intent => {
        try { (intent as any).requestedUrl = 'https://attacker.example/'; } catch {}
        try { (intent.providerContext as any).model = 'changed'; } catch {}
        return window.m104.hold();
      };
      window.m104.rerender();
    });
    await paint();
    await textbox().fill(targetUrl);
    await page.getByRole('radio', { name: /local/i }).check();
    await analyzeButton().click();
    await announced('Analyzing the requested page. No provider call was attempted.');
    await textbox().fill('https://changed.example/');
    await page.getByRole('radio', { name: /groq/i }).check();
    await page.evaluate(() => { window.m104.analyze = () => { window.m104.reads++; throw Error('new callback'); }; window.m104.rerender(); });
    await paint();
    await page.evaluate(record => window.m104.resolve({ ok: true, run: record }), richRun('captured'));
    await technicalRunContains('captured');
    assert.equal(await page.evaluate(() => window.m104.reads), 0);
    await select();
    await announced('local, ollama, qwen3.5:4b. No provider call was attempted.');
    assert.equal(await calls(), 1);
  });

  for (const scenario of [
    { mode: 'local', next: 'groq', width: 1280, settlements: ['success', 'failure'] },
    { mode: 'groq', next: 'local', width: 320, settlements: ['invalid', 'rejection'] },
  ] as const) it(`keeps pending ${scenario.mode} identity separate from editable ${scenario.next} controls and clears it on settlement`, async () => {
    const pending = page.getByRole('region', { name: 'Pending analysis', exact: true });
    const nextNotice = 'Changes to target and generation mode apply to the next analysis.';
    const identity = scenario.mode === 'local'
      ? 'Mode: local. Provider: ollama. Model: qwen3.5:4b.'
      : 'Mode: groq. Provider: groq. Model: openai/gpt-oss-20b.';
    await page.setViewportSize({ width: scenario.width, height: 800 });
    for (const settlement of scenario.settlements) {
      await mount();
      const prior = richRun(`prior-${scenario.mode}-${settlement}`, scenario.next);
      await analyze({ ok: true, run: prior }, scenario.next);
      await select();
      await page.evaluate(() => { window.m104.savedNode = document.activeElement; });
      const results = page.getByRole('region', { name: 'Results', exact: true });
      const priorText = await results.innerText();
      assert.equal(await pending.count(), 0);
      assert.equal(await page.getByText(nextNotice, { exact: true }).count(), 0);
      await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); });
      await paint();
      await textbox().fill(targetUrl);
      await page.getByRole('radio', { name: scenario.mode === 'local' ? /local/i : /groq/i }).check();
      const beforeCalls = await calls();
      await analyzeButton().click();
      await announced('Analyzing the requested page. No provider call was attempted.');
      await paint();
      assert.equal(await pending.count(), 1, 'An owned Analyze must expose a separately named Pending analysis region');
      assert.equal(await pending.isVisible(), true);
      assert.equal(await pending.getByText(identity, { exact: true }).isVisible(), true);
      assert.equal(await pending.getByText('No provider call was attempted.', { exact: true }).isVisible(), true);
      await visible(nextNotice);
      assert.equal(await textbox().isEnabled(), true);
      await textbox().fill('https://next.example/changed');
      const nextMode = page.getByRole('radio', { name: scenario.next === 'local' ? /local/i : /groq/i });
      assert.equal(await nextMode.isEnabled(), true);
      await nextMode.check();
      await paint();
      await visible(scenario.next === 'local' ? copy.local : copy.groq);
      assert.equal(await pending.getByText(identity, { exact: true }).isVisible(), true);
      assert.equal(await results.innerText(), priorText, 'Pending edits must preserve the earlier result and its provider context');
      assert.ok(await page.evaluate(() => window.m104.savedNode?.isConnected));
      assert.equal(await findingButton('finding-0').getAttribute('aria-pressed'), 'true');
      assert.equal(await calls(), beforeCalls + 1, 'Editing next-run controls must not issue a request');
      assert.equal(await status().count(), 1);
      const bounds = await pending.boundingBox();
      assert.ok(bounds && bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= scenario.width + 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));

      const completed = richRun(`settled-${scenario.mode}-${settlement}`, scenario.mode);
      if (settlement === 'success') {
        await page.evaluate(run => window.m104.resolve({ ok: true, run }), completed);
        await technicalRunContains(completed.runId);
      } else if (settlement === 'failure') {
        await page.evaluate(run => window.m104.resolve({ ok: false, error: 'scan-failed', run, persisted: true, cleanupFailed: false }), failedRun(completed.runId, scenario.mode));
        await rejected('scan-failed');
      } else if (settlement === 'invalid') {
        await page.evaluate(() => window.m104.resolve({ ok: true, run: null }));
        await rejected();
      } else {
        await page.evaluate(() => window.m104.reject(new Error('synthetic rejection')));
        await rejected('request-failed');
      }
      await paint();
      assert.equal(await pending.count(), 0, 'Only the owning Analyze settlement clears pending context');
      assert.equal(await page.getByText(nextNotice, { exact: true }).count(), 0);
      assert.equal(await analyzeButton().isEnabled(), true);
      if (settlement !== 'success') {
        assert.equal(await results.innerText(), priorText);
        assert.ok(await page.evaluate(() => window.m104.savedNode?.isConnected));
      }

    }
  });

  it('does not carry pending provider context or late settlement into a newly mounted App', async () => {
    await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); });
    await paint();
    await textbox().fill(targetUrl);
    await page.getByRole('radio', { name: /groq/i }).check();
    await analyzeButton().click();
    await announced('Analyzing the requested page. No provider call was attempted.');
    const pending = page.getByRole('region', { name: 'Pending analysis', exact: true });
    assert.equal(await pending.count(), 1, 'An owned Analyze must expose pending context before unmount');
    await page.evaluate(record => {
      const late = window.m104.resolve;
      window.m104.mount(false);
      late({ ok: true, run: record });
    }, richRun('late-pending-context', 'groq'));
    await paint();
    await visible(copy.absent);
    assert.equal(await pending.count(), 0);
    assert.equal(await page.getByText('Changes to target and generation mode apply to the next analysis.', { exact: true }).count(), 0);
    assert.equal(await page.getByText('late-pending-context', { exact: true }).count(), 0);
  });

  it('uses fixed request-failed copy for Analyze throws/rejections and releases ownership', async () => {
    await keepComplete();
    for (const synchronous of [true, false]) {
      await page.evaluate(synchronous => {
        window.m104.analyze = () => {
          const error = Object.defineProperty({}, 'message', { get() { window.m104.reads++; return 'PRIVATE'; } });
          if (synchronous) throw error;
          return Promise.reject(error);
        };
        window.m104.rerender();
      }, synchronous);
      await paint();
      await analyzeButton().click();
      await rejected('request-failed');
      await retained();
      assert.equal(await page.evaluate(() => window.m104.reads), 0);
      assert.ok(!(await page.locator('body').innerText()).includes('PRIVATE'));
      assert.equal(await analyzeButton().isEnabled(), true);
    }
  });

  it('invalidates unmounted operation ownership so a late completion cannot replace a new App', async () => {
    await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); });
    await paint();
    await textbox().fill(targetUrl);
    await page.getByRole('radio', { name: /local/i }).check();
    await analyzeButton().click();
    await page.evaluate(record => {
      const late = window.m104.resolve;
      window.m104.mount(false);
      late({ ok: true, run: record });
    }, richRun('late-stale'));
    await paint();
    await visible(copy.absent);
    assert.equal(await page.getByText('late-stale', { exact: true }).count(), 0);
    assert.equal(await findingButton('finding-0').count(), 0);
  });

  it('detaches admitted data from later collaborator mutation without freezing or changing the input', async () => {
    const record = richRun('detached');
    await analyze({ ok: true, run: record });
    await technicalRunContains(record.runId);
    const inputBefore = await page.evaluate(() => JSON.stringify(window.m104.raw));
    await select();
    assert.equal(await page.evaluate(() => JSON.stringify(window.m104.raw)), inputBefore);
    assert.equal(await page.evaluate(() => Object.isFrozen(window.m104.raw.run)), false);
    await page.evaluate(() => { window.m104.raw.run.scan.findings[0].evidence.altState.value = 'whitespace-only'; window.m104.raw.run.providerContext.model = 'MUTATED'; });
    await page.getByRole('button', { name: /^back to finding$/i }).click();
    await select();
    assert.equal(await page.getByText('MUTATED', { exact: true }).count(), 0);
    assert.equal(await page.getByText('whitespace-only', { exact: true }).count(), 0);
  });

  it('leads with a concise complete result and preserves full provenance, coverage and scanner evidence in disclosures', async () => {
    const record = await openComplete();
    const results = page.getByRole('region', { name: 'Results', exact: true });
    const limitation = results.locator('p').filter({ hasText: /image-alt/i }).filter({ hasText: /private/i }).filter({ hasText: /certification/i });
    assert.equal(await limitation.count(), 1, 'Results must combine scan scope, unsupported targets and non-certification in one limitation');
    const defaultText = await results.innerText();
    for (const value of ['completed', String(record.scan.findings.length),
      String(record.scan.scannerReviewObservations.length), record.providerContext.mode, record.providerContext.provider,
      record.providerContext.model, 'No provider call was attempted.']) assert.ok(defaultText.includes(value), `Missing default result context ${value}`);
    const analyzedPageTerm = results.locator('dt').filter({ hasText: /^Analyzed page$/ });
    assert.deepEqual({
      terms: await analyzedPageTerm.count(),
      value: await analyzedPageTerm.locator('xpath=following-sibling::dd[1]').innerText(),
    }, {
      terms: 1,
      value: record.scan.context.finalUrl.value,
    }, 'Completed summary must associate Analyzed page with the observed final URL');
    assert.ok(!defaultText.includes(record.applicationRevision), 'Application revision must not dominate the default result');
    assert.equal(await results.getByText('Not reported', { exact: true }).first().isVisible(), false, 'Null coverage buckets start in technical detail');
    const missingCoverageAssociations: string[] = [];
    for (const [rule, counts] of Object.entries(record.scan.coverage)) {
      const reported = Object.entries(counts).filter(([, value]) => value !== null).map(([bucket, value]) => `${bucket}[\\s\\S]*?${value}`);
      assert.match(defaultText, new RegExp(rule + '[\\s\\S]*?' + reported.join('[\\s\\S]*?'), 'i'));
      if (!await hasCoverageRuleGroup(results, rule, counts, false)) missingCoverageAssociations.push(`default ${rule}`);
    }
    const runTechnical = await openDisclosure('Technical run details', results, true);
    const body = await runTechnical.innerText();
    for (const value of [record.runId, record.createdAt, record.applicationRevision, record.requestedUrl, record.finishedAt,
      'completed', 'local', 'ollama', 'qwen3.5:4b', 'https://example.org/final?view=summary#results', '2026-08-30T10:00:01.000Z',
      '145.0.7632.6', '4.13.0', 'm1-public-v1', 'current-rendered-top-level-document', 'domcontentloaded', '1280', '720', 'en-US', '30000', 'closed', 'axe-core-4.13.0-default']) assert.ok(body.includes(value), `Missing context ${value}`);
    for (const label of [/format\s*version/i, /readiness\s*reached/i, /fresh\s*context/i, /imported\s*state/i, /interaction/i, /crawling/i, /iframes/i]) assert.match(body, label);
    const groups = await page.getByRole('heading', { name: /^(image-alt|label|color-contrast)$/ }).allTextContents();
    assert.deepEqual(groups, ['image-alt', 'label', 'color-contrast']);
    for (const finding of record.scan.findings) {
      const button = findingButton(finding.findingId);
      const name = await button.getAttribute('aria-label') ?? await button.innerText();
      assert.ok(name.includes(finding.ruleId));
      assert.ok(name.includes(finding.findingId));
      assert.ok(name.includes(finding.state));
      for (const fact of conciseTargetFacts(finding)) assert.ok((await button.innerText()).includes(fact), `Finding target summary missing ${fact}`);
      assert.ok(!(await button.innerText()).includes(renderedFact(finding.locator)), 'Raw locator stays out of the default Finding card');
      const detail = await select(finding.findingId);
      const concise = await detail.innerText();
      for (const value of [finding.findingId, finding.state, ...conciseTargetFacts(finding), record.providerContext.mode,
        record.providerContext.provider, record.providerContext.model, 'No provider call was attempted.']) assert.ok(concise.includes(value));
      assert.ok(!concise.includes(renderedFact(finding.locator)), 'Raw locator starts collapsed');
      assert.ok(!concise.includes('Native result'), 'Raw native result starts collapsed');
      assert.ok(!concise.includes('Checks'), 'Raw checks start collapsed');
      const scannerTechnical = await openDisclosure('Technical scanner evidence', detail);
      const text = await scannerTechnical.innerText();
      assert.ok(text.includes('Scanner evidence'));
      assert.ok(text.includes('violation'));
      assert.ok(text.includes(renderedFact(finding.locator)));
      for (const [key, fact] of Object.entries(finding.evidence)) {
        if (key === 'nameSources') {
          for (const [source, value] of Object.entries(fact as object)) {
            assert.match(text, new RegExp(source.replace(/[A-Z]/g, letter => `\\s*${letter}`), 'i'));
            assert.ok(text.includes(String((value as any).value ?? (value as any).unavailable)));
          }
        } else {
          assert.match(text, new RegExp(key.replace(/[A-Z]/g, letter => `\\s*${letter}`), 'i'));
          assert.ok(text.includes(typeof fact === 'object' ? String((fact as any).value ?? (fact as any).unavailable) : String(fact)));
        }
      }
      for (const bucket of ['any', 'all', 'none']) assert.match(text, new RegExp(`\\b${bucket}\\b`, 'i'));
      if ('value' in finding.checks) for (const check of [...finding.checks.value.any, ...finding.checks.value.none]) assert.ok(text.includes(check));
      assert.ok(text.includes('None'));
      assert.equal(await page.getByRole('button', { pressed: true }).count(), 1);
      assert.equal(await page.getByRole('button', { name: /finding-/ }).count(), record.scan.findings.length);
    }
    const coverageTechnical = results.locator('details').filter({ hasText: 'Not reported' }).first();
    assert.equal(await coverageTechnical.count(), 1, 'One technical disclosure must retain null coverage buckets');
    if (!await coverageTechnical.evaluate(node => (node as HTMLDetailsElement).open)) await coverageTechnical.locator('summary').click();
    const coverageText = await coverageTechnical.innerText();
    assert.match(coverageText, /coverage/i);
    for (const bucket of ['violations', 'incomplete', 'passes', 'inapplicable']) assert.match(coverageText, new RegExp(bucket, 'i'));
    assert.ok(coverageText.includes('Not reported'));
    // Accept either a native table or labelled rule groups; the contract fixes
    // the exact values and their association, not one particular layout owner.
    for (const [rule, counts] of Object.entries(record.scan.coverage)) {
      const values = Object.values(counts).map(value => value === null ? 'Not reported' : String(value));
      assert.match(coverageText, new RegExp(rule + '[\\s\\S]*?' + values.join('[\\s\\S]*?'), 'i'));
      if (!await hasCoverageRuleGroup(runTechnical, rule, counts, true)) missingCoverageAssociations.push(`technical ${rule}`);
    }
    assert.deepEqual(missingCoverageAssociations, [], 'Every default and technical coverage rule must semantically label its bucket/value group');
  });

  it('retains every observation as a concise distinct summary with complete nested technical evidence', async () => {
    const record = await openComplete();
    for (const [index, observation] of record.scan.scannerReviewObservations.entries()) {
      const summary = page.locator('summary').filter({ hasText: `Scanner-review observation ${index + 1}` });
      assert.equal(await summary.count(), 1);
      const summaryText = await summary.innerText();
      const requiredSummaryFacts = [observation.ruleId, 'incomplete', ...conciseTargetFacts(observation),
        renderedFact(observation.incompleteReason)];
      for (const value of requiredSummaryFacts) assert.ok(summaryText.includes(value), `Observation summary missing ${value}`);
      assert.doesNotMatch(summaryText, /\bLocator\b/i);
      const rawLocator = renderedFact(observation.locator);
      if (!requiredSummaryFacts.includes(rawLocator)) assert.ok(!summaryText.includes(rawLocator), 'Distinct raw observation locator stays out of its summary');
      const container = summary.locator('xpath=ancestor::details[1]');
      assert.equal(await container.evaluate(node => (node as HTMLDetailsElement).open), false);
      await summary.click();
      assert.equal(await container.evaluate(node => (node as HTMLDetailsElement).open), true);
      const concise = await container.innerText();
      assert.ok(!concise.includes('unprocessed'));
      assert.ok(!concise.includes('findingId'));
      assert.equal(await container.locator('[aria-pressed], button').count(), 0);
      const scannerTechnical = await openDisclosure('Technical scanner evidence', container);
      const text = await scannerTechnical.innerText();
      assert.match(text, /incomplete\s*reason/i);
      assert.match(text, /locator/i);
      assert.match(text, /checks/i);
      for (const key of Object.keys(observation.evidence)) assert.match(text, new RegExp(key.replace(/[A-Z]/g, letter => `\\s*${letter}`), 'i'));
    }
    assert.equal(await calls(), 1);
  });

  it('preserves all unavailable reasons, false facts, textarea not-applicable and missing observed facts', async () => {
    const run = structuredClone(richRun('all-reasons')) as any;
    run.scan.findings[0].locator = { unavailable: 'unsupported' };
    run.scan.findings[1].locator = { unavailable: 'too-long' };
    run.scan.findings[0].checks = { unavailable: 'withheld' };
    run.scan.findings[0].evidence = { elementKind: { unavailable: 'missing' }, altState: { unavailable: 'invalid' } };
    run.scan.findings[2].evidence.elementKind = { value: 'textarea' };
    run.scan.findings[2].evidence.inputType = { unavailable: 'not-applicable' };
    await analyze({ ok: true, run: valid(run) });
    for (const [id, expected] of [['finding-0', ['unsupported', 'withheld', 'missing', 'invalid']], ['finding-1', ['too-long']], ['finding-label', ['textarea', 'not-applicable', 'false', 'true']]] as const) {
      const detail = await select(id);
      const scannerTechnical = await openDisclosure('Technical scanner evidence', detail);
      for (const value of expected) assert.ok((await scannerTechnical.innerText()).includes(value));
    }
    await analyze({ ok: false, error: 'scan-failed', run: failedRun('unobserved'), persisted: true, cleanupFailed: false });
    const text = await (await openDisclosure('Technical run details', page.getByRole('region', { name: 'Failed run', exact: true }))).innerText();
    assert.match(text, /final\s*url[\s\S]*missing/i);
    assert.match(text, /scanned\s*at[\s\S]*missing/i);
    assert.match(text, /browser\s*version[\s\S]*missing/i);
  });

  for (const kind of ['zero', 'incomplete'] as const) it(`distinguishes complete ${kind} results from malformed coverage and failure`, async () => {
    const record = completedRun(`complete-${kind}`, 'local', kind);
    await analyze({ ok: true, run: record });
    await visible('Completed scan: 0 Findings.');
    assert.equal(await page.getByRole('button', { name: /finding-/ }).count(), 0);
    assert.deepEqual(await page.getByRole('heading', { name: /^(image-alt|label|color-contrast)$/ }).allTextContents(), ['image-alt', 'label', 'color-contrast']);
    assert.equal(await page.getByText(/Scanner-review observation 1 — image-alt — incomplete/).count(), kind === 'incomplete' ? 1 : 0);
    await visible(copy.results);
    await mount();
    const malformed = structuredClone(record) as any;
    malformed.scan.coverage.label = { violations: null, incomplete: null, passes: null, inapplicable: null };
    await analyze({ ok: true, run: malformed });
    await rejected();
    assert.equal(await page.getByText('Completed scan: 0 Findings.', { exact: true }).count(), 0);
    await analyze({ ok: false, error: 'scan-failed', run: failedRun(`failed-${kind}`), persisted: true, cleanupFailed: false });
    assert.equal(await page.getByText('Completed scan: 0 Findings.', { exact: true }).count(), 0);
  });

  it('supports keyboard selection, visible focus, predictable return, and unchanged sibling states', async () => {
    await openComplete();
    await findingButton('finding-0').focus();
    await page.keyboard.press('Enter');
    const detailId = await findingButton('finding-0').getAttribute('aria-controls');
    assert.ok(detailId);
    assert.ok(await page.evaluate(id => document.getElementById(id)?.contains(document.activeElement), detailId));
    const detail = page.locator(`[id=${JSON.stringify(detailId)}]`);
    const detailHeading = detail.getByRole('heading', { name: 'Finding finding-0' });
    assert.ok(!(await detail.innerText()).includes('m104-complete-01'), 'Run ID stays out of selected Finding default content');
    await described(detailHeading, 'State: unprocessed');
    await notDescribed(detailHeading, 'm104-complete-01');
    await described(detailHeading, 'local');
    await described(detailHeading, 'ollama');
    await described(detailHeading, 'qwen3.5:4b');
    await described(detailHeading, 'No provider call was attempted.');
    await announced('Selected Finding finding-0, image-alt, unprocessed. local, ollama, qwen3.5:4b. No provider call was attempted.');
    const technical = await openDisclosure('Technical scanner evidence', page.locator(`[id=${JSON.stringify(detailId)}]`), true);
    assert.ok((await technical.innerText()).includes(':root > :nth-child(1)'));
    const back = page.getByRole('button', { name: /^back to finding$/i });
    await back.focus();
    await page.keyboard.press('Enter');
    assert.ok(await findingButton('finding-0').evaluate(node => node === document.activeElement));
    assert.ok(await findingButton('finding-0').evaluate(node => {
      const style = getComputedStyle(node);
      return (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none';
    }));
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.activeElement !== document.body));
    assert.equal(await findingButton('finding-1').getAttribute('aria-pressed'), 'false');
    assert.equal(await calls(), 1);
  });

  for (const focusInside of [true, false]) it(`conditionally restores replacement focus when outgoing detail owns focus: ${focusInside}`, async () => {
    await openComplete();
    await select();
    await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); });
    await paint();
    await analyzeButton().click();
    if (focusInside) await select('finding-contrast'); else await textbox().focus();
    await resultsHeading().evaluate(node => { window.m104.oldNode = node; });
    await page.evaluate(record => window.m104.resolve({ ok: true, run: record }), richRun('replacement'));
    await technicalRunContains('replacement');
    assert.ok(await resultsHeading().evaluate(node => window.m104.oldNode === node));
    assert.ok(await (focusInside ? resultsHeading() : textbox()).evaluate(node => node === document.activeElement));
    assert.equal(await page.getByRole('button', { pressed: true }).count(), 0);
  });

  it('renders adversarial accepted strings inertly without hrefs, selectors, HTML, images or executable previews', async () => {
    const run = structuredClone(richRun('inert-text')) as any;
    const markup = '<img src="https://canary.invalid/x" onerror="window.m104.canary++"><script>window.m104.canary++</script>';
    const canary = new URL('https://example.org/?evidence=' + markup).href;
    run.requestedUrl = canary;
    run.scan.context.finalUrl = { value: canary };
    await analyze({ ok: true, run: valid(run) }, 'local', canary);
    await visible(canary);
    const results = page.getByRole('region', { name: 'Results', exact: true });
    await openDisclosure('Technical run details', results);
    const detail = await select();
    await openDisclosure('Technical scanner evidence', detail);
    assert.equal(await page.evaluate(() => window.m104.canary), 0);
    assert.equal(await page.locator('img, iframe, object, embed, a[href*="canary.invalid"], [onerror]').count(), 0);
    assert.equal(await page.locator('a[href]').count(), 0, 'Recorded target URLs and locators must remain text');
    await analyze({ ok: true, run: { ...run, scan: { ...run.scan, context: { ...run.scan.context, locale: markup } } } }, 'local', canary);
    await rejected();
    assert.equal(await page.locator('img, iframe, [onerror]').count(), 0);
    assert.equal(await page.evaluate(() => window.m104.canary), 0);
  });

  it('passes unrestricted axe and preserves long evidence at desktop and narrow width with review samples', async () => {
    await openComplete();
    const detail = await select('finding-contrast');
    await openDisclosure('Technical run details', page.getByRole('region', { name: 'Results', exact: true }));
    await openDisclosure('Technical scanner evidence', detail);
    const desktop = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(desktop.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
    await page.setViewportSize({ width: 320, height: 800 });
    await paint();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '320 CSS pixels must not require horizontal document scrolling');
    for (const id of ['finding-0', 'finding-1', 'finding-label', 'finding-contrast']) await findingButton(id).waitFor({ state: 'visible' });
    const selected = page.locator(`[id=${JSON.stringify(await findingButton('finding-contrast').getAttribute('aria-controls'))}]`);
    assert.ok((await selected.innerText()).includes(':root' + ' > :nth-child(1)'.repeat(24)), 'Long locator is complete');
    assert.ok((await selected.innerText()).includes('4.478089453577214'), 'Native measurement is not rounded');
    const narrow = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(narrow.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
  });
});
