import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Locator, Page } from 'playwright';
import { completedRun, failedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { richRun, startHarness, targetUrl, valid } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';

const copy = {
  absent: 'Analyze and reopen are unavailable in this build; service integration is pending.',
  analyzeAbsent: 'Analyze is unavailable in this build; service integration is pending.',
  reopenAbsent: 'Reopen is unavailable in this build; service integration is pending.',
  target: 'Choose a non-sensitive public HTTPS page you are permitted to analyze and willing to trust. Hostile, private and authenticated targets are unsupported. The application does not prove authorization, public reachability or safety.',
  results: 'This automated scan covers only image-alt, label and color-contrast in the current rendered top-level document. Iframes, inactive states and other rules are excluded. Findings and counts do not establish accessibility, conformance, certification or legal compliance.',
  local: 'Local (recommended) — Ollama · qwen3.5:4b. Generation prompts and responses use the approved loopback Ollama endpoint and a locally present model, not hosted inference. The public-page scan still uses external HTTPS; this is not offline or system-wide zero-egress operation.',
  groq: 'Groq — openai/gpt-oss-20b. A later explicit Generate action for one eligible Finding may send minimized rule-specific evidence and required curated-guidance passages to Groq for remote processing. Target URLs, locators, sibling Findings and credentials are excluded from that content. Selecting a mode or scanning makes no provider call.',
  urlError: 'Enter a valid HTTPS URL without embedded credentials.',
  modeError: 'Choose Local or Groq.',
  idError: 'Enter a run ID using 1–64 letters, numbers, underscores or hyphens, starting with a letter or number.',
  busy: 'An operation is in progress. Wait before analyzing or reopening another run.',
  interrupted: 'Interrupted stored run; not currently executing. It will not resume automatically.',
};

let harness: Harness;
let page: Page;
const textbox = () => page.getByRole('textbox', { name: /target|url/i });
const runId = () => page.getByRole('textbox', { name: /run id/i });
const analyzeButton = () => page.getByRole('button', { name: /^analyze$/i });
const reopenButton = () => page.getByRole('button', { name: /^reopen(?: run)?$/i });
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
async function mount(analyze = true, reopen = true): Promise<void> {
  await page.evaluate(({ analyze, reopen }) => window.m104.mount(analyze, reopen), { analyze, reopen });
  await paint();
}
async function response(stage: 'analyze' | 'reopen', result: unknown): Promise<void> {
  await page.evaluate(({ stage, result }) => {
    window.m104.raw = result;
    window.m104[stage] = () => Promise.resolve(window.m104.raw);
    window.m104.rerender();
  }, { stage, result });
  await paint();
}
async function analyze(result: unknown, mode: 'local' | 'groq' = 'local', target = targetUrl): Promise<void> {
  await response('analyze', result);
  await textbox().fill(target);
  await page.getByRole('radio', { name: mode === 'local' ? /local/i : /groq/i }).check();
  await analyzeButton().click();
  await paint();
}
async function reopen(record: PageAnalysisRun): Promise<void> {
  await response('reopen', { ok: true, run: record, interrupted: record.status === 'running' });
  await runId().fill(record.runId);
  await reopenButton().click();
  await paint();
}
async function reopenResult(id: string, result: unknown): Promise<void> {
  await response('reopen', result);
  await runId().fill(id);
  await reopenButton().click();
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
  await visible('m104-complete-01');
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
async function rejected(stage: 'Analyze' | 'Reopen', code = 'invalid-result'): Promise<void> {
  await announced(`${stage} failed: ${code}.`);
  await visible(`${stage} failed: ${code}.`);
}

describe('M1-04 actual target/results UI: complete bounded observable contract', { concurrency: false }, () => {
  // One shared setup exposes the real Vite import failure once. All tests below remain unconditional.
  before(async () => { harness = await startHarness(); page = harness.page; });
  after(async () => { if (harness) await harness.close(); });
  beforeEach(async () => {
    await page.evaluate(async () => {
      await window.m104.settle();
      window.m104.analyze = () => Promise.resolve({ ok: false, error: 'create-failed', run: null, persisted: false, cleanupFailed: false });
      window.m104.reopen = () => Promise.resolve({ ok: false, error: 'not-found' });
      window.m104.reads = 0; window.m104.canary = 0; window.m104.raw = null;
      window.m104.savedNode = null; window.m104.oldNode = null;
      window.m104.mount();
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await paint();
  });

  it('provides native landmarks, one preexisting atomic status, and truthful absent/partial capabilities', async () => {
    for (const [hasAnalyze, hasReopen, text] of [[false, false, copy.absent], [true, false, copy.reopenAbsent], [false, true, copy.analyzeAbsent]] as const) {
      await mount(hasAnalyze, hasReopen);
      assert.equal(await page.getByRole('main').count(), 1);
      assert.equal(await status().count(), 1);
      assert.equal(await status().getAttribute('aria-atomic'), 'true');
      await visible(text);
      assert.equal(await analyzeButton().isDisabled(), !hasAnalyze);
      assert.equal(await reopenButton().isDisabled(), !hasReopen);
      if (!hasAnalyze) await described(analyzeButton(), text);
      if (!hasReopen) await described(reopenButton(), text);
      assert.equal(await calls(), 0);
    }
    await described(textbox(), copy.target);
    assert.equal(await page.getByRole('radio', { checked: true }).count(), 0);
    assert.ok(await page.locator('fieldset legend').count() >= 1);
    assert.equal(await page.getByRole('button', { name: /generate|retry|resume|cancel|review|compare|filter/i }).count(), 0);
    assert.equal(await page.locator('iframe, object, embed').count(), 0);
  });

  it('requires URL and explicit mode with associated errors without issuing any request', async () => {
    await analyzeButton().click();
    await visible(copy.urlError);
    await visible(copy.modeError);
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
    await visible(`normal-${mode}`);
    const recorded = await page.evaluate(() => window.m104.calls);
    assert.deepEqual(recorded.map(call => ({ stage: call.stage, value: call.value })), [{ stage: 'analyze', value: { requestedUrl: normalized, providerContext: record.providerContext } }]);
    await select();
    await announced(`Selected Finding finding-0, image-alt, unprocessed. ${mode}, ${record.providerContext.provider}, ${record.providerContext.model}. No provider call was attempted.`);
    assert.equal(await calls(), 1);
  });

  it('rejects whole-string invalid run IDs and accepts both exact boundary lengths', async () => {
    for (const id of ['', '_abc', '-abc', 'a/b', 'a.b', 'a b', 'é', 'a'.repeat(65)]) {
      await runId().fill(id);
      await reopenButton().click();
      await visible(copy.idError);
      await described(runId(), copy.idError);
    }
    assert.equal(await calls(), 0);
    for (const id of ['a', 'A' + 'b_9-'.repeat(15) + 'xyz']) {
      await reopenResult(id, { ok: false, error: 'not-found' });
      await rejected('Reopen', 'not-found');
    }
    assert.equal(await calls(), 2);
  });

  it('keeps complete evidence, selection and source/provider context through every closed request failure', async () => {
    await keepComplete();
    for (const error of ['invalid-request', 'busy', 'stopping', 'create-failed', 'scan-failed', 'result-validation', 'initial-persistence', 'shutdown']) {
      await analyze({ ok: false, error, run: null, persisted: false, cleanupFailed: false });
      await rejected('Analyze', error);
      await retained();
    }
    for (const error of ['invalid-id', 'busy', 'stopping', 'not-found', 'invalid-run', 'stored-run-unavailable', 'read-failed']) {
      await reopenResult('missing', { ok: false, error });
      await rejected('Reopen', error);
      await retained();
    }
  });

  it('distinguishes failed canonical records, unsaved failures and both directions of cleanup uncertainty', async () => {
    await keepComplete();
    await analyze({ ok: false, error: 'scan-failed', run: failedRun('failed-closed'), persisted: false, cleanupFailed: true });
    await visible('failed-closed');
    await visible('This failed run was not saved.');
    await visible('Resource cleanup is uncertain.');
    await retained();
    await analyze({ ok: false, error: 'create-failed', run: null, persisted: false, cleanupFailed: true });
    await visible('Resource cleanup is uncertain.');
    await retained();
    await analyze({ ok: false, error: 'scan-failed', run: failedRun('cleanup-bad', 'local', 'failed'), persisted: true, cleanupFailed: false });
    await rejected('Analyze');
    assert.equal(await page.getByText('cleanup-bad', { exact: true }).count(), 0);
    await analyze({ ok: false, error: 'scan-failed', run: failedRun('cleanup-good', 'local', 'failed'), persisted: true, cleanupFailed: true });
    await visible('cleanup-good');
    await visible('Resource cleanup is uncertain.');
    await retained();
  });

  it('shows interrupted history independently of live busy and retains earlier completed results', async () => {
    await keepComplete();
    await reopen(runningRun('interrupted', 'groq'));
    await visible(copy.interrupted);
    await visible('interrupted');
    assert.equal(await analyzeButton().isEnabled(), true);
    assert.equal(await reopenButton().isEnabled(), true);
    await retained();
    await reopenResult('other', { ok: false, error: 'not-found' });
    await rejected('Reopen', 'not-found');
    await visible('interrupted');
    await retained();
  });

  for (const stage of ['analyze', 'reopen'] as const) it(`rejects closed-envelope key/type/prototype/descriptor violations for ${stage}`, async () => {
    await keepComplete();
    const record = richRun('envelope-candidate');
    const success = stage === 'analyze' ? { ok: true, run: record } : { ok: true, run: record, interrupted: false };
    const failure = stage === 'analyze' ? { ok: false, error: 'scan-failed', run: null, persisted: false, cleanupFailed: false } : { ok: false, error: 'not-found' };
    for (const base of [success, failure]) {
    for (const mutation of ['null', 'array', 'primitive', 'extra', 'missing', 'undefined', 'symbol', 'nonenumerable', 'accessor', 'prototype', 'boolean', 'throw-ownKeys', 'throw-descriptor', 'throw-prototype']) {
      await page.evaluate(({ stage, base, mutation }) => {
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
        bridge[stage] = () => Promise.resolve(value);
        bridge.rerender();
      }, { stage, base, mutation });
      await paint();
      if (stage === 'analyze') await analyzeButton().click();
      else { await runId().fill(record.runId); await reopenButton().click(); }
      await rejected(stage === 'analyze' ? 'Analyze' : 'Reopen');
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
      await visible(record.runId);
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
      { ok: true, run: runningRun('invalid-candidate') }, { ok: true, run: failedRun('invalid-candidate') },
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
      await rejected('Analyze');
      await retained();
      assert.equal(await page.getByText('invalid-candidate', { exact: true }).count(), 0);
    }
    for (const result of [
      { ok: true, run: candidate, interrupted: true }, { ok: true, run: runningRun('invalid-candidate'), interrupted: false },
      { ok: true, run: candidate, interrupted: 0 }, { ok: false, error: 'scan-failed' },
      { ok: false, error: 'not-found', run: null }, { ok: false },
    ]) {
      await reopenResult('invalid-candidate', result);
      await rejected('Reopen');
      await retained();
    }
    assert.ok(!(await page.locator('body').innerText()).includes('DO-NOT-DISPLAY'));
  });

  it('validates Analyze URL/provider identity even for failed records and rejects either retained run ID', async () => {
    await keepComplete();
    await reopen(failedRun('retained-failure'));
    for (const record of [richRun('m104-complete-01'), richRun('retained-failure'), failedRun('m104-complete-01'), failedRun('retained-failure')]) {
      await analyze(record.status === 'completed' ? { ok: true, run: record } : { ok: false, error: 'scan-failed', run: record, persisted: true, cleanupFailed: false });
      await rejected('Analyze');
      await retained();
      await visible('retained-failure');
    }
    for (const source of [richRun('new-identity'), failedRun('new-identity')]) {
      for (const record of [valid({ ...source, requestedUrl: 'https://different.example/' }), valid({ ...source, providerContext: completedRun('x', 'groq').providerContext })]) {
        await analyze(record.status === 'completed' ? { ok: true, run: record } : { ok: false, error: 'scan-failed', run: record, persisted: true, cleanupFailed: false });
        await rejected('Analyze');
        await retained();
      }
    }
    await reopenResult('requested-other', { ok: true, run: richRun('response-other'), interrupted: false });
    await rejected('Reopen');
  });

  it('retains exact completed DOM/evidence/selection on same-ID valid changed evidence; never refreshes terminals', async () => {
    const record = await keepComplete();
    const changed = structuredClone(record) as any;
    changed.scan.findings[0].evidence.altState = { value: 'whitespace-only' };
    await reopen(valid(changed));
    await announced(`Run ${record.runId} is already open. Existing evidence and selection retained.`);
    await retained();
    assert.equal(await page.getByText('whitespace-only', { exact: true }).count(), 0);
    for (const statusRecord of [runningRun(record.runId), failedRun(record.runId)]) {
      await reopen(statusRecord);
      await rejected('Reopen');
      await retained();
    }
    const failed = failedRun('terminal-failed');
    await reopen(failed);
    const changedFailure = valid({ ...failed, failure: { category: 'timeout' } });
    await reopen(changedFailure);
    await announced('Run terminal-failed is already open. Existing failed snapshot retained.');
    assert.equal(await page.getByText('timeout', { exact: true }).count(), 0);
    for (const statusRecord of [runningRun(failed.runId), completedRun(failed.runId)]) {
      await reopen(statusRecord);
      await rejected('Reopen');
      await visible('terminal-failed');
      await retained();
    }
  });

  it('checks immutable common identity against both retained completed and noncompleted snapshots', async () => {
    await keepComplete();
    const failure = failedRun('held-failure');
    await reopen(failure);
    for (const held of [richRun(), failure]) {
      const changes = [
        { createdAt: '2026-08-30T09:00:00.000Z' }, { applicationRevision: 'b'.repeat(40) },
        { requestedUrl: 'https://example.org/changed' }, { providerContext: completedRun('x', 'groq').providerContext },
      ];
      for (const change of changes) {
        await reopen(valid({ ...held, ...change }));
        await rejected('Reopen');
        await retained();
        await visible('held-failure');
      }
      await reopenResult(held.runId, { ok: true, run: { ...held, formatVersion: 2 }, interrupted: false });
      await rejected('Reopen');
    }
  });

  it('discards matching interrupted reads, rejects profile drift, and accepts monotonic terminal completion', async () => {
    await keepComplete();
    const held = runningRun('held-running');
    await reopen(held);
    for (const change of [{ createdAt: '2026-08-30T09:00:00.000Z' }, { applicationRevision: 'b'.repeat(40) },
      { requestedUrl: 'https://example.org/changed' }, { providerContext: completedRun('x', 'groq').providerContext }]) {
      await reopen(valid({ ...held, ...change }));
      await rejected('Reopen');
      await retained();
    }
    const improved = valid({ ...held, scanContext: { ...held.scanContext, finalUrl: { value: 'https://example.org/final' }, readinessReached: true } });
    await reopen(improved);
    await announced('Run held-running is already open. Existing interrupted snapshot retained.');
    assert.equal(await page.getByText('https://example.org/final', { exact: true }).count(), 0);
    const profileChanges = [
      { readiness: 'load' }, { viewport: { width: 1000, height: 720 } }, { viewport: { width: 1280, height: 900 } },
      { locale: 'fr-FR' }, { timeoutMs: 25000 },
      { scannerVersion: 'other' }, { evidencePolicyVersion: 'other' }, { rules: ['label', 'image-alt', 'color-contrast'] },
      { scope: 'other' }, { freshContext: false }, { importedState: true }, { interaction: true },
      { crawling: true }, { iframes: true }, { contrastProfile: 'other' },
    ];
    for (const change of profileChanges) {
      await reopenResult(held.runId, { ok: true, run: { ...held, scanContext: { ...held.scanContext, ...change } }, interrupted: true });
      await rejected('Reopen');
      await retained();
      await visible(copy.interrupted);
    }
    await reopen(completedRun(held.runId));
    await visible(held.runId);
    assert.equal(await page.getByText(copy.interrupted, { exact: true }).count(), 0);
    assert.equal(await findingButton('finding-0').getAttribute('aria-pressed'), 'false');
    assert.equal(await page.getByText('m104-complete-01', { exact: true }).count(), 0);
  });

  it('requires available observations and readiness to remain monotonic on running-to-terminal reads', async () => {
    await keepComplete();
    const complete = completedRun('observed-running');
    const observed = valid({ ...runningRun(complete.runId), scanContext: { ...complete.scan.context, cleanup: 'pending' } });
    await reopen(observed);
    for (const key of ['finalUrl', 'scannedAt', 'browserVersion'] as const) {
      const changedValues = key === 'finalUrl' ? ['https://example.org/other'] : key === 'scannedAt' ? ['2026-08-30T10:00:01.500Z'] : ['999.0'];
      for (const replacement of [{ unavailable: 'missing' }, { value: changedValues[0] }]) {
        const candidate = valid({ ...failedRun(complete.runId), scanContext: { ...complete.scan.context, [key]: replacement } });
        await reopen(candidate);
        await rejected('Reopen');
        await retained();
      }
    }
    await reopen(valid({ ...failedRun(complete.runId), scanContext: complete.scan.context }));
    await visible('navigation');
    assert.equal(await page.getByText(copy.interrupted, { exact: true }).count(), 0);
    await retained();
    const readiness = valid({ ...runningRun('readiness-running'), scanContext: { ...complete.scan.context, scannedAt: { unavailable: 'missing' }, cleanup: 'pending' } });
    await reopen(readiness);
    await reopen(valid({ ...failedRun(readiness.runId), scanContext: { ...complete.scan.context, scannedAt: { unavailable: 'missing' }, readinessReached: false } }));
    await rejected('Reopen');
    await visible(copy.interrupted);
    await retained();
  });

  it('shares a synchronous reservation across Analyze and reopen, including callback reentry', async () => {
    await page.evaluate(() => {
      window.m104.analyze = () => {
        for (const button of document.querySelectorAll('button')) {
          if (/^(Analyze|Reopen(?: run)?)$/i.test(button.textContent?.trim() ?? '')) button.closest('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
        return window.m104.hold();
      };
      window.m104.rerender();
    });
    await paint();
    await textbox().fill(targetUrl);
    await runId().fill('reentry');
    await page.getByRole('radio', { name: /local/i }).check();
    await analyzeButton().click();
    await visible(copy.busy);
    assert.equal(await calls(), 1);
    assert.equal(await analyzeButton().isDisabled(), true);
    assert.equal(await reopenButton().isDisabled(), true);
    await described(analyzeButton(), copy.busy);
    await described(reopenButton(), copy.busy);
    await page.evaluate(record => window.m104.resolve({ ok: true, run: record }), richRun('reentry-done'));
    await visible('reentry-done');
    assert.equal(await analyzeButton().isEnabled(), true);
    assert.equal(await reopenButton().isEnabled(), true);
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
    await visible('captured');
    assert.equal(await page.evaluate(() => window.m104.reads), 0);
    await select();
    await announced('local, ollama, qwen3.5:4b. No provider call was attempted.');
    assert.equal(await calls(), 1);
  });

  it('captures the requested reopen ID and callback across delayed form/prop changes', async () => {
    await page.evaluate(() => { window.m104.reopen = () => window.m104.hold(); window.m104.rerender(); });
    await paint();
    await runId().fill('captured-read');
    await reopenButton().click();
    await announced('Reopening the requested run. No provider call was attempted.');
    await runId().fill('changed-read');
    await page.evaluate(() => { window.m104.reopen = () => { window.m104.reads++; throw Error('replacement'); }; window.m104.rerender(); });
    await paint();
    await page.evaluate(record => window.m104.resolve({ ok: true, run: record, interrupted: false }), richRun('captured-read', 'groq'));
    await visible('captured-read');
    assert.equal(await page.evaluate(() => window.m104.reads), 0);
    assert.equal(await calls(), 1);
  });

  for (const stage of ['analyze', 'reopen'] as const) it(`uses fixed request-failed copy for ${stage} throws/rejections and releases ownership`, async () => {
    await keepComplete();
    for (const synchronous of [true, false]) {
      await page.evaluate(({ stage, synchronous }) => {
        window.m104[stage] = () => {
          const error = Object.defineProperty({}, 'message', { get() { window.m104.reads++; return 'PRIVATE'; } });
          if (synchronous) throw error;
          return Promise.reject(error);
        };
        window.m104.rerender();
      }, { stage, synchronous });
      await paint();
      if (stage === 'analyze') await analyzeButton().click(); else { await runId().fill('throws'); await reopenButton().click(); }
      await rejected(stage === 'analyze' ? 'Analyze' : 'Reopen', 'request-failed');
      await retained();
      assert.equal(await page.evaluate(() => window.m104.reads), 0);
      assert.ok(!(await page.locator('body').innerText()).includes('PRIVATE'));
      assert.equal(await analyzeButton().isEnabled(), true);
      assert.equal(await reopenButton().isEnabled(), true);
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
      window.m104.mount(false, false);
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
    await visible('detached');
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

  it('projects every run/context/coverage field and all three rule details without merging duplicate locators', async () => {
    const record = await openComplete();
    await visible(copy.results);
    const body = await page.getByRole('main').innerText();
    assert.match(body, /(?:4\s+Findings|Findings\s*:?\s*4)/i);
    assert.match(body, /(?:3\s+(?:scanner.review\s+)?observations|observations\s*:?\s*3)/i);
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
      const detail = await select(finding.findingId);
      const text = await detail.innerText();
      assert.ok(text.includes('Scanner evidence'));
      assert.ok(text.includes('unprocessed'));
      assert.ok(text.includes('violation'));
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
    assert.match(body, /coverage/i);
    for (const bucket of ['violations', 'incomplete', 'passes', 'inapplicable']) assert.match(body, new RegExp(bucket, 'i'));
    assert.ok(body.includes('Not reported'));
    // Accept either a native table or labelled rule groups; the contract fixes
    // the exact values and their association, not one particular layout owner.
    for (const [rule, counts] of Object.entries(record.scan.coverage)) {
      const values = Object.values(counts).map(value => value === null ? 'Not reported' : String(value));
      assert.match(body, new RegExp(rule + '[\\s\\S]*?' + values.join('[\\s\\S]*?'), 'i'));
    }
  });

  it('retains every observation with global index, full evidence and no Finding selection/state semantics', async () => {
    const record = await openComplete();
    for (const [index, observation] of record.scan.scannerReviewObservations.entries()) {
      const label = `Scanner-review observation ${index + 1} — ${observation.ruleId} — incomplete`;
      const heading = page.getByText(label, { exact: true });
      await heading.waitFor();
      const container = heading.locator('xpath=ancestor::*[self::details or self::article or self::li or self::section][1]');
      if (await container.evaluate(node => node.tagName === 'DETAILS' && !node.hasAttribute('open'))) await heading.click();
      const text = await container.innerText();
      assert.ok(text.includes('incomplete'));
      assert.match(text, /incomplete\s*reason/i);
      assert.match(text, /locator/i);
      assert.match(text, /checks/i);
      assert.ok(!text.includes('unprocessed'));
      assert.ok(!text.includes('findingId'));
      assert.equal(await container.locator('[aria-pressed], button').count(), 0);
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
      for (const value of expected) assert.ok((await detail.innerText()).includes(value));
    }
    await reopen(runningRun('unobserved'));
    const text = await page.getByRole('main').innerText();
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
    await rejected('Analyze');
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
    await announced('Selected Finding finding-0, image-alt, unprocessed. local, ollama, qwen3.5:4b. No provider call was attempted.');
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
    await visible('replacement');
    assert.ok(await resultsHeading().evaluate(node => window.m104.oldNode === node));
    assert.ok(await (focusInside ? resultsHeading() : textbox()).evaluate(node => node === document.activeElement));
    assert.equal(await page.getByRole('button', { pressed: true }).count(), 0);
  });

  it('keeps focus in outgoing detail for invalid, failed, interrupted and same-ID reads', async () => {
    const record = await openComplete();
    for (const result of [
      { ok: true, run: record, interrupted: false }, { ok: false, error: 'not-found' },
      { ok: true, run: failedRun('focus-failed'), interrupted: false },
      { ok: true, run: runningRun('focus-running'), interrupted: true }, { bad: true },
    ]) {
      await page.evaluate(() => { window.m104.reopen = () => window.m104.hold(); window.m104.rerender(); });
      await paint();
      await runId().fill('run' in result ? result.run!.runId : 'focus-missing');
      await reopenButton().click();
      await select();
      await page.evaluate(() => { window.m104.savedNode = document.activeElement; });
      await page.evaluate(result => window.m104.resolve(result), result);
      await paint();
      assert.ok(await page.evaluate(() => document.activeElement === window.m104.savedNode));
    }
  });

  it('renders adversarial accepted strings inertly without hrefs, selectors, HTML, images or executable previews', async () => {
    const run = structuredClone(richRun('inert-text')) as any;
    const markup = '<img src="https://canary.invalid/x" onerror="window.m104.canary++"><script>window.m104.canary++</script>';
    const canary = new URL('https://example.org/?evidence=' + markup).href;
    run.requestedUrl = canary;
    run.scan.context.finalUrl = { value: canary };
    await analyze({ ok: true, run: valid(run) }, 'local', canary);
    await visible(canary);
    await select();
    assert.equal(await page.evaluate(() => window.m104.canary), 0);
    assert.equal(await page.locator('img, iframe, object, embed, a[href*="canary.invalid"], [onerror]').count(), 0);
    assert.equal(await page.locator('a[href]').count(), 0, 'Recorded target URLs and locators must remain text');
    await analyze({ ok: true, run: { ...run, scan: { ...run.scan, context: { ...run.scan.context, locale: markup } } } }, 'local', canary);
    await rejected('Analyze');
    assert.equal(await page.locator('img, iframe, [onerror]').count(), 0);
    assert.equal(await page.evaluate(() => window.m104.canary), 0);
  });

  it('passes unrestricted axe and preserves long evidence at desktop and narrow width with review samples', async () => {
    await openComplete();
    await select('finding-contrast');
    const desktop = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(desktop.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
    await harness.screenshot('desktop-results.png');
    await page.setViewportSize({ width: 320, height: 800 });
    await paint();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), '320 CSS pixels must not require horizontal document scrolling');
    for (const id of ['finding-0', 'finding-1', 'finding-label', 'finding-contrast']) await findingButton(id).waitFor({ state: 'visible' });
    const selected = page.locator(`[id=${JSON.stringify(await findingButton('finding-contrast').getAttribute('aria-controls'))}]`);
    assert.ok((await selected.innerText()).includes(':root' + ' > :nth-child(1)'.repeat(24)), 'Long locator is complete');
    assert.ok((await selected.innerText()).includes('4.478089453577214'), 'Native measurement is not rounded');
    const narrow = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(narrow.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
    await harness.screenshot('narrow-detail.png');
  });
});
