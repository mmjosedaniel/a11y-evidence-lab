import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Locator, Page } from 'playwright';
import { completedRun, failedRun } from './helpers/m102-run-fixture.ts';
import { richRun, startHarness, targetUrl, valid } from './helpers/m104-ui-harness.ts';
import type { Harness, KnownConfiguration } from './helpers/m104-ui-harness.ts';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';

const copy = {
  absent: 'Analyze is unavailable in this build; service integration is pending.',
  urlError: 'Enter a valid HTTPS URL without embedded credentials.',
  modeError: 'Choose Local or Groq.',
  localMissing: 'The Local model is not installed. Install it before using Local generation.',
  groqMissing: 'The Groq API URL is not configured. Define it before using Groq.',
  limitation: 'Checks cover image alternatives, form labels, and color contrast in the rendered top-level page. Results are not an accessibility or compliance certification.',
  manualIntro: 'Items tagged Needs manual review could not be determined automatically.',
  started: 'Analysis started.',
} as const;
const labels: Readonly<Record<string, string>> = {
  'finding-0': 'Image alternative issue 1', 'finding-1': 'Image alternative issue 2',
  'finding-label': 'Form label issue 1', 'finding-contrast': 'Color contrast issue 1',
};

let harness: Harness; let page: Page;
const textbox = () => page.getByRole('textbox', { name: 'Target URL', exact: true });
const analyzeButton = () => page.getByRole('button', { name: 'Analyze', exact: true });
const status = () => page.getByRole('status');
const results = () => page.getByRole('region', { name: 'Results', exact: true });
const findingsPanel = () => results().getByRole('region', { name: 'Findings', exact: true });
const findingButton = (id: string) => page.getByRole('button', { name: new RegExp(labels[id], 'i') });
async function paint() { await page.evaluate(() => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))); }
async function visible(text: string, root: Locator = page.locator('body')) { await root.getByText(text, { exact: true }).first().waitFor({ state: 'visible' }); }
async function announced(text: string) { await page.waitForFunction(v => document.querySelector('[role=status]')?.textContent === v, text); }
async function calls() { return page.evaluate(() => window.m104.calls.length); }
async function leadingPresentation() {
  return page.evaluate(() => {
    const style = (selector: string) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) throw new Error(`Missing ${selector}`);
      return getComputedStyle(element);
    };
    const evidence = style('.rule-evidence');
    return {
      overviewBorderLeftWidth: style('.results-overview').borderLeftWidth,
      evidence: { borderLeftWidth: evidence.borderLeftWidth, paddingLeft: evidence.paddingLeft },
      manual: Array.from(document.querySelectorAll<HTMLElement>('.manual-review-tag'), element => {
        const computed = getComputedStyle(element);
        return { borderLeftWidth: computed.borderLeftWidth, paddingLeft: computed.paddingLeft };
      }),
    };
  });
}
async function findingsPresentation() {
  return findingsPanel().evaluate(element => {
    const computed = getComputedStyle(element);
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const expectedMaxHeight = Math.min(42 * rootFontSize, window.innerHeight * 0.75);
    const computedMaxHeight = Number.parseFloat(computed.maxHeight);
    const borderWidths = [computed.borderTopWidth, computed.borderRightWidth, computed.borderBottomWidth, computed.borderLeftWidth];
    const borderStyles = [computed.borderTopStyle, computed.borderRightStyle, computed.borderBottomStyle, computed.borderLeftStyle];
    const borderColors = [computed.borderTopColor, computed.borderRightColor, computed.borderBottomColor, computed.borderLeftColor];
    return {
      tabIndex: element.tabIndex,
      neutralBoundary: borderWidths.every(value => value === '1px')
        && borderStyles.every(value => value === 'solid')
        && borderColors.every(value => value === 'rgb(200, 209, 220)'),
      maxHeightMatches: Number.isFinite(computedMaxHeight) && Math.abs(computedMaxHeight - expectedMaxHeight) <= 1,
      heightWithinLimit: element.getBoundingClientRect().height <= expectedMaxHeight + 1,
      overflowY: computed.overflowY,
      overflowX: computed.overflowX,
      scrollbarGutter: computed.scrollbarGutter,
      overscrollBehaviorY: computed.overscrollBehaviorY,
      verticallyScrollable: element.scrollHeight > element.clientHeight,
      noHorizontalOverflow: element.scrollWidth <= element.clientWidth,
    };
  });
}
async function mount(available = true, configuration: KnownConfiguration = {}) {
  await page.evaluate(x => window.m104.mount(x.available, x.configuration), { available, configuration }); await paint();
}
async function analyze(result: unknown, mode: 'local' | 'groq' = 'local', target = targetUrl, configuration: KnownConfiguration = {}) {
  await page.evaluate(x => { window.m104.analyze = () => { window.m104.raw = x.result; return Promise.resolve(x.result); }; window.m104.rerender(true, x.configuration); }, { result, configuration });
  await paint(); await textbox().fill(target); await page.getByRole('radio', { name: mode === 'local' ? /local/i : /groq/i }).check(); await analyzeButton().click(); await paint();
}
async function published(run: Extract<PageAnalysisRun, { status: 'completed' }>) {
  await results().waitFor({ state: 'visible' }); await visible(run.scan.context.finalUrl.value, results());
  assert.equal(await results().getByText(run.runId, { exact: true }).count(), 0);
}
async function openComplete(id = 'm104-complete-01') { const run = richRun(id); await analyze({ ok: true, run }); await published(run); return run; }
async function select(id = 'finding-0') {
  await findingButton(id).click(); const detail = page.getByRole('region', { name: new RegExp(`${labels[id]} evidence`, 'i') });
  await detail.waitFor({ state: 'visible' }); assert.equal(await findingButton(id).getAttribute('aria-pressed'), 'true'); return detail;
}
async function keepComplete() { await openComplete(); await select(); await findingButton('finding-0').evaluate(n => { window.m104.savedNode = n; }); }
async function retained() { await visible(labels['finding-0'], results()); assert.equal(await findingButton('finding-0').getAttribute('aria-pressed'), 'true'); assert.ok(await page.evaluate(() => window.m104.savedNode?.isConnected)); }
async function rejected(code = 'invalid-result') { await visible(`Analyze failed: ${code}.`); }

describe('M1-04 analyze and evidence-first Results presentation', { concurrency: false }, () => {
  before(async () => { harness = await startHarness(); page = harness.page; });
  after(async () => { if (harness) await harness.close(); });
  beforeEach(async () => {
    await page.evaluate(async () => { await window.m104.settle(); window.m104.analyze = () => Promise.resolve({ ok: false, error: 'create-failed', run: null, persisted: false, cleanupFailed: false }); window.m104.reads = 0; window.m104.canary = 0; window.m104.raw = null; window.m104.savedNode = null; window.m104.oldNode = null; window.m104.mount(); });
    await page.setViewportSize({ width: 1280, height: 800 }); await paint();
  });

  it('shows only the compact ready task, one atomic status, and truthful capability', async () => {
    for (const [available, capability] of [[false, copy.absent], [true, '']] as const) { await mount(available); assert.equal(await status().count(), 1); assert.equal(await status().getAttribute('aria-atomic'), 'true'); assert.equal(await analyzeButton().isDisabled(), !available); if (capability) await visible(capability); }
    assert.equal(await page.getByRole('heading', { level: 1, name: 'Analyze a page', exact: true }).count(), 1);
    assert.equal(await page.getByRole('radio', { checked: true }).count(), 0); assert.equal(await page.getByText(copy.modeError, { exact: true }).count(), 0);
    assert.equal(await page.getByText(/use a public https page|permitted to analyze|hostile pages/i).count(), 0);
    assert.equal(await page.getByText(/ollama|qwen|gpt-oss|no provider call/i).count(), 0);
    assert.equal(await results().count(), 0, 'Results must not exist before a terminal outcome');
    assert.equal(await page.getByRole('button', { name: /generate|retry|resume|cancel|review|compare|filter|reopen/i }).count(), 0);
  });

  it('associates exact URL and mode errors and removes the mode error on selection without a request', async () => {
    await analyzeButton().click(); await visible(copy.urlError); await visible(copy.modeError);
    const group = page.getByRole('group').filter({ has: page.getByRole('radio', { name: /local/i }) });
    for (const [control, message] of [[textbox(), copy.urlError], [group, copy.modeError]] as const) assert.ok(await control.evaluate((n, m) => (n.getAttribute('aria-describedby') ?? '').split(/\s+/).some(id => document.getElementById(id)?.textContent === m), message));
    for (const url of ['not a url', 'http://example.org', 'file:///C:/target', 'https://user:secret@example.org']) { await textbox().fill(url); await analyzeButton().click(); await visible(copy.urlError); }
    await page.getByRole('radio', { name: /local/i }).check(); assert.equal(await page.getByText(copy.modeError, { exact: true }).count(), 0); assert.equal(await calls(), 0);
  });

  for (const scenario of [
    { mode: 'local', configuration: { localModelInstalled: false }, message: copy.localMissing },
    { mode: 'groq', configuration: { groqApiUrlConfigured: false }, message: copy.groqMissing },
  ] as const) it(`shows only known missing ${scenario.mode} configuration and does not block Analyze`, async () => {
    const run = richRun(`missing-${scenario.mode}`, scenario.mode); await analyze({ ok: true, run }, scenario.mode, targetUrl, scenario.configuration);
    await visible(scenario.message); await published(run); assert.equal(await calls(), 1);
    assert.equal(await page.getByText(scenario.mode === 'local' ? copy.groqMissing : copy.localMissing, { exact: true }).count(), 0);
    assert.equal(await page.getByText(/ollama|qwen3\.5|gpt-oss|no provider call/i).count(), 0);
  });

  for (const mode of ['local', 'groq'] as const) it(`normalizes URL and captures immutable ${mode} intent without normal helper copy`, async () => {
    const normalized = 'https://example.org/a?x=1#fragment'; const run = valid<Extract<PageAnalysisRun, { status: 'completed' }>>({ ...completedRun(`normal-${mode}`, mode), requestedUrl: normalized });
    await analyze({ ok: true, run }, mode, ' HTTPS://EXAMPLE.ORG:443/a?x=1#fragment '); await published(run);
    assert.deepEqual((await page.evaluate(() => window.m104.calls)).map(c => c.value), [{ requestedUrl: normalized, providerContext: run.providerContext }]);
    await announced(`Analysis completed: ${run.scan.findings.length} ${run.scan.findings.length === 1 ? 'finding' : 'findings'} and ${run.scan.scannerReviewObservations.length} ${run.scan.scannerReviewObservations.length === 1 ? 'item' : 'items'} need manual review.`);
    assert.equal(await page.getByText(/ollama|qwen3\.5|gpt-oss|no provider call/i).count(), 0);
  });

  it('preserves completed evidence and selection through every closed Analyze failure', async () => {
    await keepComplete(); for (const error of ['invalid-request', 'busy', 'stopping', 'create-failed', 'scan-failed', 'result-validation', 'initial-persistence', 'shutdown']) { await analyze({ ok: false, error, run: null, persisted: false, cleanupFailed: false }); await rejected(error); await retained(); }
  });

  it('presents failed outcomes without completed overview or internal run/provider context', async () => {
    const run = failedRun('failed-closed'); await analyze({ ok: false, error: 'scan-failed', run, persisted: false, cleanupFailed: true });
    await visible('Analysis could not be completed', results()); await visible(run.requestedUrl, results()); await visible('This failed run was not saved.'); await visible('Resource cleanup is uncertain.');
    const text = await results().innerText(); for (const omitted of [run.runId, run.providerContext.provider, run.providerContext.model, 'Technical run details', 'findings need review']) assert.ok(!text.includes(omitted));
  });

  it('replaces an obsolete failed result with a new independent run-less failure', async () => {
    const oldUrl = 'https://old.example/';
    const oldRun = valid<Extract<PageAnalysisRun, { status: 'failed' }>>({ ...failedRun('old-failed'), requestedUrl: oldUrl });
    await analyze({ ok: false, error: 'scan-failed', run: oldRun, persisted: true, cleanupFailed: false }, 'local', oldUrl);
    await visible('The requested page could not be opened.', results());
    await analyze({ ok: false, error: 'create-failed', run: null, persisted: false, cleanupFailed: true });
    const form = page.locator('form');
    await visible('Analyze failed: create-failed.', form);
    await visible('This failed run was not saved.', form);
    await visible('Resource cleanup is uncertain.', form);
    assert.equal(await results().count(), 0);
    const body = await page.locator('body').innerText();
    assert.ok(!body.includes(oldUrl));
    assert.ok(!body.includes('The requested page could not be opened.'));
  });

  it('rejects unsafe envelope shape and descriptor variants without rendering diagnostics', async () => {
    await keepComplete(); const run = richRun('candidate');
    for (const mutation of ['null', 'array', 'extra', 'missing', 'accessor', 'prototype', 'boolean', 'throw-ownKeys']) {
      await page.evaluate(({ run, mutation }) => { let value: any = { ok: true, run }; if (mutation === 'null') value = null; if (mutation === 'array') value = []; if (mutation === 'extra') value.extra = true; if (mutation === 'missing') delete value.run; if (mutation === 'accessor') Object.defineProperty(value, 'run', { enumerable: true, get() { window.m104.reads++; throw Error('raw diagnostic'); } }); if (mutation === 'prototype') Object.setPrototypeOf(value, { inherited: true }); if (mutation === 'boolean') value.ok = 'true'; if (mutation === 'throw-ownKeys') value = new Proxy(value, { ownKeys() { throw Error('raw diagnostic'); } }); window.m104.analyze = () => Promise.resolve(value); window.m104.rerender(); }, { run, mutation });
      await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /local/i }).check(); await analyzeButton().click(); await rejected(); await retained(); assert.equal(await page.evaluate(() => window.m104.reads), 0); assert.ok(!(await page.locator('body').innerText()).includes('raw diagnostic'));
    }
  });

  it('rejects malformed coverage, incomplete collections, identity changes and contradictory envelopes', async () => {
    await keepComplete(); const candidate = richRun('invalid-candidate'); const coverage = structuredClone(candidate) as any; delete coverage.scan.coverage.label; const dropped = structuredClone(candidate) as any; dropped.scan.findings.pop();
    const changedUrl = valid({ ...candidate, requestedUrl: 'https://different.example/' }); const changedProvider = valid({ ...candidate, providerContext: completedRun('x', 'groq').providerContext });
    for (const result of [{ ok: true, run: coverage }, { ok: true, run: dropped }, { ok: true, run: { ...candidate, credentials: 'DO-NOT-DISPLAY' } }, { ok: true, run: failedRun('wrong') }, { ok: false, error: 'scan-failed', run: candidate, persisted: true, cleanupFailed: false }, { ok: true, run: changedUrl }, { ok: true, run: changedProvider }, { ok: true, run: valid({ ...candidate, runId: 'm104-complete-01' }) }]) { await analyze(result); await rejected(); await retained(); }
    assert.ok(!(await page.locator('body').innerText()).includes('DO-NOT-DISPLAY'));
  });

  it('admits null-prototype data envelopes without invoking get traps', async () => {
    const run = richRun('null-prototype'); await page.evaluate(run => { const envelope = Object.assign(Object.create(null), { ok: true, run }); window.m104.analyze = () => Promise.resolve(new Proxy(envelope, { get(target, key, receiver) { if (key !== 'then') { window.m104.reads++; throw Error('raw property read'); } return Reflect.get(target, key, receiver); } })); window.m104.rerender(); }, run);
    await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /local/i }).check(); await analyzeButton().click(); await published(run); assert.equal(await page.evaluate(() => window.m104.reads), 0);
  });

  it('uses one synchronous reservation and keeps Analyze focus through settlement', async () => {
    await page.evaluate(() => { window.m104.analyze = () => { document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); return window.m104.hold(); }; window.m104.rerender(); });
    await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /local/i }).check(); await analyzeButton().focus(); await analyzeButton().click(); await announced(copy.started);
    assert.equal(await calls(), 1); assert.equal(await analyzeButton().getAttribute('aria-disabled'), 'true'); assert.ok(await analyzeButton().evaluate(n => n === document.activeElement)); await analyzeButton().dispatchEvent('click'); assert.equal(await calls(), 1);
    const run = richRun('focus'); await page.evaluate(run => window.m104.resolve({ ok: true, run }), run); await published(run); assert.ok(await analyzeButton().evaluate(n => n === document.activeElement));
  });

  for (const width of [1280, 320]) it(`keeps captured intent separate from editable controls at ${width}px`, async () => {
    await page.setViewportSize({ width, height: 800 }); await page.evaluate(() => { window.m104.analyze = intent => { window.m104.raw = structuredClone(intent); return window.m104.hold(); }; window.m104.rerender(); });
    await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /local/i }).check(); await analyzeButton().click(); await announced(copy.started);
    await textbox().fill('https://example.net/next'); await page.getByRole('radio', { name: /groq/i }).check();
    assert.deepEqual(await page.evaluate(() => window.m104.raw), { requestedUrl: targetUrl, providerContext: { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' } });
    assert.equal(await page.getByText(/pending analysis|changes to target|ollama|qwen|no provider call/i).count(), 0); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    const run = richRun(`settled-${width}`); await page.evaluate(run => window.m104.resolve({ ok: true, run }), run); await published(run);
  });

  it('invalidates unmounted ownership and fixedly handles collaborator rejection', async () => {
    await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); }); await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /groq/i }).check(); await analyzeButton().click(); await mount();
    await page.evaluate(run => window.m104.resolve({ ok: true, run }), richRun('late', 'groq')); await paint(); assert.equal(await results().count(), 0);
    await page.evaluate(() => { window.m104.analyze = () => Promise.reject(Error('PRIVATE')); window.m104.rerender(); }); await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /local/i }).check(); await analyzeButton().click(); await rejected('request-failed'); assert.ok(!(await page.locator('body').innerText()).includes('PRIVATE')); assert.equal(await analyzeButton().getAttribute('aria-disabled'), null);
  });

  it('detaches admitted data from later collaborator mutation', async () => {
    const run = richRun('detached'); await analyze({ ok: true, run }); await published(run); const detail = await select(); const before = await detail.innerText();
    await page.evaluate(() => { window.m104.raw.run.scan.findings[0].evidence.altState.value = 'whitespace-only'; window.m104.raw.run.providerContext.model = 'MUTATED'; });
    assert.equal(await detail.innerText(), before); assert.equal(await page.getByText('MUTATED', { exact: true }).count(), 0); assert.equal(await page.getByText('whitespace-only', { exact: true }).count(), 0);
  });

  it('renders one overview, complete human groups and direct rule evidence without internal fields', async () => {
    const run = await openComplete(); await visible(copy.limitation, results()); await visible('4 findings need review', results()); await visible('3 items need manual review', results());
    const overview = results().getByRole('region', { name: 'Results overview', exact: true });
    assert.equal(await overview.getByRole('group').count(), 3);
    for (const [name, count] of [['Image alternatives', '2 findings · 1 manual review'], ['Form labels', '1 finding · 1 manual review'], ['Color contrast', '1 finding · 1 manual review']] as const) {
      const group = overview.getByRole('group', { name, exact: true });
      assert.equal(await group.count(), 1);
      assert.equal(await group.getByRole('heading', { name, exact: true }).count(), 1);
      assert.equal(await group.getByText(count, { exact: true }).count(), 1);
    }
    for (const id of Object.keys(labels)) assert.equal(await findingButton(id).count(), 1);
    for (const [id, expected] of [['finding-0', ['The image does not have usable alternative text.', 'Affected element', 'Where on the page', 'Alternative text', 'Missing']], ['finding-label', ['The form control does not have a usable accessible name.', 'Input type', 'Explicit label', 'Implicit label', 'ARIA label', 'ARIA labelled by', 'Title', 'Placeholder']], ['finding-contrast', ['Measured contrast is 4.48:1; this text requires 4.5:1.', 'Text color', 'Background color', 'Measured contrast', 'Required contrast', 'Font size', 'Font weight']]] as const) { const text = await (await select(id)).innerText(); for (const value of expected) assert.ok(text.includes(value), `${id} missing ${value}`); }
    const text = await results().innerText(); for (const omitted of [run.runId, run.providerContext.provider, run.providerContext.model, 'unprocessed', 'Native result', 'Technical run details', 'Technical scanner evidence', 'Message key', 'axe-core']) assert.ok(!text.includes(omitted), `exposed ${omitted}`);
  });

  it('projects every observation once as a tagged selectable item in its Finding group', async () => {
    const run = await openComplete(); await visible(copy.manualIntro, results());
    assert.equal(await results().getByRole('heading', { name: 'Needs manual review', exact: true }).count(), 0);
    assert.equal(await results().getByText('Needs manual review', { exact: true }).count(), 3);
    assert.equal(await results().getByText('View evidence', { exact: true }).count(), 0);
    const reviews = [
      ['Image alternatives', 'Image alternative review 1', /Image alternative review 1[\s\S]*Image element[\s\S]*Needs manual review$/i, 'Alternative text could not be inspected', ['Alternative text', 'Unavailable (missing)']],
      ['Form labels', 'Form label review 1', /Form label review 1[\s\S]*Input · text[\s\S]*Needs manual review$/i, 'Label information was withheld', ['Input type', 'Explicit label', 'Implicit label']],
      ['Color contrast', 'Color contrast review 1', /Color contrast review 1[\s\S]*#777777 · #ffffff · 12\.0pt \(16px\) · normal[\s\S]*Needs manual review$/i, 'Background imagery prevented a reliable contrast result', ['Measured contrast', '4.48:1']],
    ] as const;
    for (const [groupName, label, accessibleName, reason, evidence] of reviews) {
      const group = results().getByRole('group', { name: new RegExp(groupName, 'i') });
      const button = group.getByRole('button', { name: accessibleName });
      assert.equal(await button.count(), 1);
      if (label === 'Image alternative review 1') { await button.focus(); await page.keyboard.press('Enter'); assert.ok(await button.evaluate(n => n === document.activeElement)); await announced(`Selected ${label}.`); }
      else await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      const detail = page.getByRole('region', { name: new RegExp(`${label} evidence`, 'i') });
      await detail.waitFor({ state: 'visible' }); await visible('Needs manual review', detail); await visible(reason, detail);
      const text = await detail.innerText(); for (const value of evidence) assert.ok(text.includes(value), `${label} missing ${value}`);
    }
    assert.equal(run.scan.scannerReviewObservations.length, 3); assert.equal(await results().getByText(/scanner-review observation|technical scanner evidence/i).count(), 0);
  });

  it('distinguishes missing and withheld label evidence and shows only material shadow colors', async () => {
    const candidate = structuredClone(richRun('evidence-variants')) as any;
    const labelIndex = candidate.scan.scannerReviewObservations.findIndex((item: any) => item.ruleId === 'label');
    const withheld = structuredClone(candidate.scan.scannerReviewObservations[labelIndex]);
    const missing = structuredClone(withheld);
    missing.incompleteReason = { unavailable: 'missing' };
    candidate.scan.scannerReviewObservations.splice(labelIndex, 1, missing, withheld);
    candidate.scan.coverage.label.incomplete = 2;
    const contrast = candidate.scan.findings.find((item: any) => item.ruleId === 'color-contrast');
    const shadowOnBackground = structuredClone(contrast);
    shadowOnBackground.findingId = 'finding-shadow-background';
    shadowOnBackground.evidence.shadowColor = { value: '#123456' };
    shadowOnBackground.evidence.messageKey = { value: 'shadowOnBgColor' };
    const foregroundOnShadow = structuredClone(contrast);
    foregroundOnShadow.findingId = 'finding-shadow-foreground';
    foregroundOnShadow.evidence.shadowColor = { value: '#654321' };
    foregroundOnShadow.evidence.messageKey = { value: 'fgOnShadowColor' };
    const incidentalShadow = structuredClone(contrast);
    incidentalShadow.findingId = 'finding-shadow-incidental';
    incidentalShadow.evidence.shadowColor = { value: '#abcdef' };
    incidentalShadow.evidence.messageKey = { value: 'bgImage' };
    candidate.scan.findings = candidate.scan.findings.filter((item: any) => item.ruleId !== 'color-contrast');
    candidate.scan.findings.push(shadowOnBackground, foregroundOnShadow, incidentalShadow);
    candidate.scan.coverage['color-contrast'].violations = 3;
    const run = valid<Extract<PageAnalysisRun, { status: 'completed' }>>(candidate);
    await analyze({ ok: true, run });
    const missingReview = results().getByRole('button', { name: /Form label review 1/i });
    const withheldReview = results().getByRole('button', { name: /Form label review 2/i });
    await missingReview.click();
    const missingEvidence = page.getByRole('region', { name: /Form label review 1 evidence/i });
    await visible('Label information was not available', missingEvidence);
    assert.equal(await missingEvidence.getByText(/withheld/i).count(), 0);
    await withheldReview.click();
    await visible('Label information was withheld', page.getByRole('region', { name: /Form label review 2 evidence/i }));
    for (const [position, color, shown] of [[1, '#123456', true], [2, '#654321', true], [3, '#abcdef', false]] as const) {
      await page.getByRole('button', { name: new RegExp(`Color contrast issue ${position}`, 'i') }).click();
      const detail = page.getByRole('region', { name: new RegExp(`Color contrast issue ${position} evidence`, 'i') });
      assert.equal(await detail.getByText('Shadow color', { exact: true }).count(), shown ? 1 : 0);
      assert.equal(await detail.getByText(color, { exact: true }).count(), shown ? 1 : 0);
    }
  });

  it('includes only each human label and affected-element summary in Finding names', async () => {
    await openComplete();
    for (const name of [
      /Image alternative issue 1[\s\S]*Image element$/i,
      /Image alternative issue 2[\s\S]*Image element$/i,
      /Form label issue 1[\s\S]*Input · text$/i,
      /Color contrast issue 1[\s\S]*#777777 · #ffffff · 12\.0pt \(16px\) · normal$/i,
    ]) assert.equal(await page.getByRole('button', { name }).count(), 1);
  });

  it('uses singular visible and announced grammar for one finding and one manual-review item', async () => {
    const candidate = structuredClone(completedRun('singular-counts', 'local', 'incomplete')) as any;
    candidate.scan.findings = [structuredClone(richRun('singular-source').scan.findings[0])];
    candidate.scan.coverage['image-alt'].violations = 1;
    const run = valid<Extract<PageAnalysisRun, { status: 'completed' }>>(candidate);
    await analyze({ ok: true, run });
    await visible('1 finding needs review', results());
    await visible('1 item needs manual review', results());
    await announced('Analysis completed: 1 finding and 1 item need manual review.');
  });

  it('keeps unavailable, false and textarea evidence honest without raw keys', async () => {
    const run = structuredClone(richRun('reasons')) as any; run.scan.findings[0].locator = { unavailable: 'unsupported' }; run.scan.findings[0].evidence = { elementKind: { unavailable: 'missing' }, altState: { unavailable: 'invalid' } }; run.scan.findings[2].evidence.elementKind = { value: 'textarea' }; run.scan.findings[2].evidence.inputType = { unavailable: 'not-applicable' };
    await analyze({ ok: true, run: valid(run) }); assert.ok((await (await select('finding-0')).innerText()).includes('Page location unavailable')); const label = await select('finding-label'); for (const v of ['Textarea', 'Not applicable', 'No', 'Yes']) assert.ok((await label.innerText()).includes(v)); assert.equal(await results().getByText(/explicit-label|hidden-explicit-label/i).count(), 0);
  });

  for (const kind of ['zero', 'incomplete'] as const) it(`distinguishes completed ${kind} from malformed coverage and failure`, async () => {
    const run = completedRun(`complete-${kind}`, 'local', kind); await analyze({ ok: true, run }); await visible('No automated findings in the three supported checks', results()); await visible('This does not prove that the page is accessible or compliant.', results());
    const emptyGroups = kind === 'zero' ? ['Image alternatives', 'Form labels', 'Color contrast'] : ['Form labels', 'Color contrast'];
    for (const heading of emptyGroups) await visible('No findings or manual reviews in this check.', results().getByRole('group', { name: new RegExp(heading, 'i') }));
    const imageGroup = results().getByRole('group', { name: /Image alternatives/i });
    if (kind === 'incomplete') {
      assert.equal(await imageGroup.getByText('No findings or manual reviews in this check.', { exact: true }).count(), 0);
      assert.equal(await imageGroup.getByRole('button', { name: /Image alternative review 1[\s\S]*Image element[\s\S]*Needs manual review$/i }).count(), 1);
      assert.equal(await results().getByRole('heading', { name: 'Needs manual review', exact: true }).count(), 0);
    }
    assert.equal(await results().getByText(copy.manualIntro, { exact: true }).count(), kind === 'incomplete' ? 1 : 0); await mount(); const malformed = structuredClone(run) as any; malformed.scan.coverage.label = { violations: null, incomplete: null, passes: null, inapplicable: null }; await analyze({ ok: true, run: malformed }); await rejected(); assert.equal(await page.getByText('No automated findings in the three supported checks', { exact: true }).count(), 0);
  });

  it('keeps keyboard focus on the selected finding without a redundant return control', async () => {
    await openComplete(); const panel = findingsPanel(); assert.equal(await panel.getAttribute('tabindex'), '0'); await panel.focus(); await paint(); const beforeScroll = await page.evaluate(() => ({ panel: document.querySelector<HTMLElement>('.findings-column')?.scrollTop ?? -1, window: window.scrollY })); await page.keyboard.press('PageDown');
    const panelScrolled = await page.waitForFunction(previous => (document.querySelector<HTMLElement>('.findings-column')?.scrollTop ?? -1) > previous, beforeScroll.panel, { timeout: 1500 }).then(() => true, () => false);
    const afterScroll = await page.evaluate(() => { const panel = document.querySelector<HTMLElement>('.findings-column'); const style = panel && getComputedStyle(panel); return { panel: panel?.scrollTop ?? -1, window: window.scrollY, focused: panel === document.activeElement, visibleOutline: style?.outlineStyle === 'solid' && Number.parseFloat(style.outlineWidth) > 0 }; });
    const selected = findingButton('finding-0'); await selected.focus(); await page.keyboard.press('Enter'); const detail = page.getByRole('region', { name: /Image alternative issue 1 evidence/i }); await detail.waitFor({ state: 'visible' }); assert.ok(await selected.evaluate(n => n === document.activeElement));
    assert.equal(await selected.getAttribute('aria-pressed'), 'true'); assert.equal(await findingButton('finding-1').getAttribute('aria-pressed'), 'false'); await announced('Selected Image alternative issue 1.'); assert.equal(await page.getByRole('button', { name: 'Back to findings', exact: true }).count(), 0);
    assert.deepEqual({ panelScrolled, panelMoved: afterScroll.panel > beforeScroll.panel, windowStayed: afterScroll.window === beforeScroll.window, focused: afterScroll.focused, visibleOutline: afterScroll.visibleOutline }, { panelScrolled: true, panelMoved: true, windowStayed: true, focused: true, visibleOutline: true });
  });

  for (const focusInside of [true, false]) it(`restores replacement focus only when outgoing evidence owns it: ${focusInside}`, async () => {
    await openComplete(); await select(); await page.evaluate(() => { window.m104.analyze = () => window.m104.hold(); window.m104.rerender(); }); await paint(); await textbox().fill(targetUrl); await page.getByRole('radio', { name: /local/i }).check(); await analyzeButton().click(); if (focusInside) await select('finding-contrast'); else await textbox().focus();
    const heading = results().getByRole('heading', { name: 'Results', exact: true }); await heading.evaluate(n => { window.m104.oldNode = n; }); const run = richRun('replacement'); await page.evaluate(run => window.m104.resolve({ ok: true, run }), run); await published(run); assert.ok(await heading.evaluate(n => window.m104.oldNode === n)); assert.ok(await (focusInside ? heading : textbox()).evaluate(n => n === document.activeElement));
  });

  it('renders accepted external strings inertly', async () => {
    const run = structuredClone(richRun('inert')) as any; const markup = '<img src="https://canary.invalid/x" onerror="window.m104.canary++">'; const canary = new URL('https://example.org/?evidence=' + markup).href; run.requestedUrl = canary; run.scan.context.finalUrl = { value: canary }; await analyze({ ok: true, run: valid(run) }, 'local', canary); await visible(canary, results()); await select('finding-contrast'); assert.equal(await page.evaluate(() => window.m104.canary), 0); assert.equal(await page.locator('img, iframe, object, embed, a[href], [onerror]').count(), 0);
  });

  it('passes axe and preserves complete evidence at desktop and 320px without horizontal scrolling', async () => {
    await openComplete(); await select('finding-contrast'); const desktopPresentation = await leadingPresentation(); const desktopFindings = await findingsPresentation(); const desktop = await new AxeBuilder({ page }).analyze(); assert.deepEqual(desktop.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []); await page.setViewportSize({ width: 320, height: 800 }); await paint(); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)); for (const id of Object.keys(labels)) await findingButton(id).waitFor({ state: 'visible' }); const detail = page.getByRole('region', { name: /Color contrast issue 1 evidence/i }); assert.ok((await detail.innerText()).includes(':root' + ' > :nth-child(1)'.repeat(24))); assert.ok((await detail.innerText()).includes('4.48:1')); assert.ok(!(await detail.innerText()).includes('4.478089453577214')); const narrowPresentation = await leadingPresentation(); const narrowFindings = await findingsPresentation(); const narrow = await new AxeBuilder({ page }).analyze(); assert.deepEqual(narrow.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
    const expectedPresentation = {
      overviewBorderLeftWidth: '0px',
      evidence: { borderLeftWidth: '0px', paddingLeft: '0px' },
      manual: Array.from({ length: 3 }, () => ({ borderLeftWidth: '0px', paddingLeft: '0px' })),
    };
    assert.deepEqual(desktopPresentation, expectedPresentation);
    assert.deepEqual(narrowPresentation, expectedPresentation);
    const expectedFindings = { tabIndex: 0, neutralBoundary: true, maxHeightMatches: true, heightWithinLimit: true, overflowY: 'auto', overflowX: 'hidden', scrollbarGutter: 'stable', overscrollBehaviorY: 'contain', verticallyScrollable: true, noHorizontalOverflow: true };
    assert.deepEqual(desktopFindings, expectedFindings);
    assert.deepEqual(narrowFindings, expectedFindings);
  });
});
