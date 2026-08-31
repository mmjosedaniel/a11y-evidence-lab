import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncBuiltinESMExports } from 'node:module';
import nodeTest from 'node:test';
import type { TestContext } from 'node:test';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, BrowserContextOptions, LaunchOptions, Page } from 'playwright';
import { prepareScanRequest, captureNativeScan, executeScan } from '../src/server/scan/scan-page.ts';
import { normalizeNativeScan } from '../src/server/scan/normalize-scan.ts';
import { validateRun, validateScan } from '../src/server/domain/run-contract.ts';
import type { ScanResult } from '../src/server/domain/run-contract.ts';
import type { RunningRun, TerminalRun } from '../src/server/persistence/run-repository.ts';
import type { LocalService } from '../src/server/service.ts';

// M103-SCAN-01. Real cases use the implementation capture profile
// m103-native-dom-v1. Doubled reports below are lifecycle controls, not browser
// observations. Native payloads are never logged, snapshotted or persisted.
type RecordValue = Record<string, unknown>;
type Rule = 'image-alt' | 'label' | 'color-contrast';
type Bucket = 'violations' | 'incomplete' | 'passes' | 'inapplicable';
type Collection = Pick<ScanResult, 'coverage' | 'findings' | 'scannerReviewObservations'>;
const test = (name: string, run: (context: TestContext) => void | Promise<void>) =>
  nodeTest(name, { concurrency: false, timeout: 120000 }, run);
const record = (value: unknown): RecordValue => value as RecordValue;
const list = (value: unknown): unknown[] => value as unknown[];
const value = (input: unknown): RecordValue => ({ value: input });
const missing = (): RecordValue => ({ unavailable: 'missing' });
const rules: Rule[] = ['image-alt', 'label', 'color-contrast'];
const buckets: Bucket[] = ['violations', 'incomplete', 'passes', 'inapplicable'];
const repo = fileURLToPath(new URL('../', import.meta.url));
const scratch = path.join(repo, 'temp', 'm103-scan');
const residue = path.join(scratch, 'scan-page-test-residue');
const canary = 'M103_PRIVATE_TEXT_PASSWORD_TOKEN';
const createdAt = '2026-08-31T00:00:00.000Z';
const reportedAt = '2026-08-31T00:00:01.000Z';
const launchOptions: LaunchOptions = {
  headless: true, channel: 'chromium', timeout: 10000, args: [],
  handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false,
};
const contextOptions: BrowserContextOptions = {
  viewport: { width: 1280, height: 720 }, locale: 'en-US', timezoneId: 'UTC',
  deviceScaleFactor: 1, colorScheme: 'light', forcedColors: 'none', reducedMotion: 'no-preference',
  acceptDownloads: false, permissions: [], serviceWorkers: 'block', offline: false,
  javaScriptEnabled: true, ignoreHTTPSErrors: false, bypassCSP: false,
};
function nativeOptions(): RecordValue {
  return {
    runOnly: { type: 'rule', values: [...rules] }, reporter: 'm103-native-dom-v1',
    resultTypes: [...buckets], selectors: true, ancestry: false, xpath: false,
    absolutePaths: false, elementRef: true, iframes: false,
  };
}
function initialContext(): RecordValue {
  return {
    finalUrl: missing(), scannedAt: missing(), browserVersion: missing(),
    scannerVersion: '4.13.0', evidencePolicyVersion: 'm1-public-v1', rules: [...rules],
    scope: 'current-rendered-top-level-document', readiness: 'load', readinessReached: false,
    viewport: { width: 1280, height: 720 }, locale: 'en-US', timeoutMs: 10000,
    freshContext: true, importedState: false, interaction: false, crawling: false,
    iframes: false, cleanup: 'pending', contrastProfile: 'axe-core-4.13.0-default',
  };
}
function running(mode: 'local' | 'groq' = 'local', changes: RecordValue = {}): RunningRun {
  const checked = validateRun({
    formatVersion: 1, runId: 'm103-scan-test', createdAt, applicationRevision: 'a'.repeat(40),
    requestedUrl: 'https://m103.test/a', status: 'running',
    providerContext: mode === 'local'
      ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
      : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' },
    scanContext: initialContext(), ...changes,
  });
  assert.ok(checked.ok && checked.value.status === 'running', 'Test input must be a valid running record');
  return checked.value;
}
function contextOf(terminal: TerminalRun) {
  return terminal.status === 'completed' ? terminal.scan.context : terminal.scanContext;
}
function assertFrozen(input: unknown): void {
  if (input === null || typeof input !== 'object') return;
  assert.equal(Object.isFrozen(input), true);
  for (const child of Object.values(input)) assertFrozen(child);
}
function assertTerminal(run: RunningRun, terminal: TerminalRun): void {
  assert.equal(validateRun(terminal).ok, true, 'Terminal must satisfy the unchanged domain boundary');
  if (terminal.status === 'completed') assert.equal(validateScan(terminal.scan).ok, true);
  for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl', 'providerContext'] as const) {
    assert.deepEqual(terminal[key], run[key]);
  }
  const after = contextOf(terminal);
  for (const key of ['scannerVersion', 'evidencePolicyVersion', 'rules', 'scope', 'readiness', 'viewport',
    'locale', 'timeoutMs', 'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'contrastProfile'] as const) {
    assert.deepEqual(after[key], run.scanContext[key]);
  }
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion'] as const) {
    if ('value' in run.scanContext[key]) assert.deepEqual(after[key], run.scanContext[key]);
  }
  assert.ok(!run.scanContext.readinessReached || after.readinessReached);
  assert.ok(Date.parse(terminal.finishedAt) >= Date.parse(run.createdAt));
  if ('value' in after.scannedAt) assert.ok(Date.parse(terminal.finishedAt) >= Date.parse(after.scannedAt.value));
  assert.notEqual(terminal, run);
  assert.notEqual(terminal.providerContext, run.providerContext);
  assert.notEqual(after, run.scanContext);
  assert.equal(JSON.stringify(terminal).includes(canary), false, 'No raw error or private evidence may escape');
  assertFrozen(terminal);
}
function failed(run: RunningRun, terminal: TerminalRun, category: string, cleanup = 'closed') {
  assertTerminal(run, terminal);
  assert.equal(terminal.status, 'failed');
  assert.ok(terminal.status === 'failed');
  assert.deepEqual(terminal.failure, { category });
  assert.equal(terminal.scanContext.cleanup, cleanup);
  assert.equal(Object.hasOwn(terminal, 'scan'), false);
  assert.equal(Object.hasOwn(terminal, 'findings'), false);
  return terminal.scanContext;
}
function assertScratchEmpty(): void {
  assert.equal(path.resolve(os.tmpdir()), path.resolve(scratch));
  const info = fs.lstatSync(scratch);
  assert.equal(info.isDirectory(), true);
  assert.equal(info.isSymbolicLink(), false);
  assert.equal(fs.realpathSync(scratch).toLowerCase(), path.resolve(scratch).toLowerCase());
  assert.deepEqual(fs.readdirSync(scratch), []);
}
function projected(input: unknown): Collection {
  const output = normalizeNativeScan(input);
  assert.ok(output.ok, 'The bounded native collection must normalize');
  assert.equal(JSON.stringify(output.value).includes(canary), false);
  return output.value;
}
function nativeNode(rule: Rule): RecordValue {
  return {
    target: [`#${canary}`], html: `<input value="${canary}">`, failureSummary: canary,
    any: [{ id: rule === 'image-alt' ? 'has-alt' : rule === 'label' ? 'explicit-label' : 'color-contrast',
      message: canary, ...(rule === 'color-contrast' ? { data: {
        fgColor: '#777777', bgColor: '#ffffff', contrastRatio: 4.478089453577214,
        expectedContrastRatio: '4.5:1', fontSize: '12.0pt (16px)', fontWeight: 'normal',
      } } : {}) }], all: [], none: [],
    capturedDom: {
      locator: value(':root > :nth-child(2) > :nth-child(1)'),
      ...(rule === 'image-alt' ? { evidence: { elementKind: value('img'), altState: value('absent') } } : {}),
      ...(rule === 'label' ? { evidence: {
        elementKind: value('input'), inputType: value('email'), nameSources: {
          explicitLabel: value(false), implicitLabel: value(false), ariaLabel: value('absent'),
          ariaLabelledby: value('absent'), title: value('absent'), placeholder: value('absent'), presentationalRole: value(false),
        },
      } } : {}),
    },
  };
}
function nativeReport(): RecordValue {
  return {
    url: 'https://m103.test/a', timestamp: reportedAt,
    testEngine: { name: 'axe-core', version: '4.13.0' }, toolOptions: nativeOptions(),
    violations: rules.map(id => ({ id, nodes: [nativeNode(id)] })),
    incomplete: [], passes: [], inapplicable: [],
  };
}
function nodes(report: unknown, bucket: Bucket, rule?: Rule): RecordValue[] {
  return list(record(report)[bucket]).flatMap(entry => {
    const item = record(entry);
    return rule === undefined || item.id === rule ? list(item.nodes).map(record) : [];
  });
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const turn = (): Promise<void> => new Promise(resolve => setImmediate(resolve));
async function turns(): Promise<void> { for (let index = 0; index < 8; index++) await turn(); }

// A finite public-browser boundary double. The only native execution return is
// the pre-authored report; this deliberately makes no real-scanner claim.
function lifecycle(t: TestContext, report: unknown = nativeReport()) {
  assertScratchEmpty();
  const events: string[] = [];
  const entered = { launch: deferred<void>(), context: deferred<void>(), page: deferred<void>(),
    navigation: deferred<void>(), capture: deferred<void>(), pageClose: deferred<void>() };
  let pageClosed = false;
  let connected = true;
  const state = {
    report, url: 'https://m103.test/a', version: '151.0.7922.34', events, entered,
    capture: async (): Promise<unknown> => state.report,
    navigation: async (): Promise<unknown> => null,
    pageClose: async (): Promise<void> => { pageClosed = true; },
    contextClose: async (): Promise<void> => {},
    browserClose: async (): Promise<void> => { connected = false; },
    launch: async (): Promise<Browser> => browser as unknown as Browser,
    newContext: async (): Promise<BrowserContext> => context as unknown as BrowserContext,
    newPage: async (): Promise<Page> => page as unknown as Page,
    navigationTimeouts: [] as number[],
    get pageClosed() { return pageClosed; }, get connected() { return connected; },
  };
  const page = {
    frames: () => [],
    url: () => state.url,
    isClosed: () => pageClosed,
    goto: async (_url: string, options: { waitUntil: string; timeout: number }) => {
      events.push('navigation'); entered.navigation.resolve();
      assert.equal(_url, 'https://m103.test/a');
      assert.equal(options.waitUntil, 'load');
      assert.ok(options.timeout > 0 && options.timeout <= 10000);
      state.navigationTimeouts.push(options.timeout);
      return state.navigation();
    },
    evaluate: async (source: unknown, argument?: unknown): Promise<unknown> => {
      if (typeof source === 'string') return source.includes('typeof ') ? true : undefined;
      const input = record(argument);
      assert.deepEqual(input.options, nativeOptions());
      assert.deepEqual(record(input.context).exclude, ['iframe', 'frame']);
      events.push('capture'); entered.capture.resolve();
      return { error: null, results: await state.capture() };
    },
    close: async () => { events.push('close-page'); entered.pageClose.resolve(); await state.pageClose(); },
  };
  const context = {
    newPage: async () => { events.push('page'); entered.page.resolve(); return state.newPage(); },
    close: async () => { events.push('close-context'); await state.contextClose(); },
  };
  const browser = {
    version: () => { events.push('version'); return state.version; },
    newContext: async (options: BrowserContextOptions) => {
      assert.deepEqual(options, contextOptions);
      events.push('context'); entered.context.resolve(); return state.newContext();
    },
    close: async () => { events.push('close-browser'); await state.browserClose(); },
    isConnected: () => connected,
  };
  t.mock.method(chromium, 'launch', async (options: LaunchOptions) => {
    assert.deepEqual(options, launchOptions);
    events.push('launch'); entered.launch.resolve(); return state.launch();
  });
  t.after(() => assertScratchEmpty());
  return { ...state, state, browser: browser as unknown as Browser, context: context as unknown as BrowserContext,
    page: page as unknown as Page };
}
function clock(t: TestContext): void {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-08-31T00:00:02.000Z') });
  t.mock.method(performance, 'now', () => Date.now() - Date.parse('2026-08-31T00:00:02.000Z'));
}
async function advance(t: TestContext, milliseconds: number): Promise<void> {
  t.mock.timers.tick(milliseconds);
  await turns();
}

test('preparation rejects URL before mode without coercion, time, identity, browser or provider effects', t => {
  let coercions = 0;
  t.mock.method(chromium, 'launch', () => { assert.fail('Admission launched a browser'); });
  t.mock.method(Date, 'now', () => { assert.fail('Admission read the clock'); });
  t.mock.method(crypto, 'randomUUID', () => { assert.fail('Admission allocated identity'); });
  t.mock.method(globalThis, 'fetch', () => { assert.fail('Admission called a provider/network'); });
  syncBuiltinESMExports();
  try {
    for (const url of [undefined, null, 3, {}, { toString() { coercions++; return 'https://m103.test/'; } },
      '', 'not a URL', '/relative', 'http://m103.test/', 'file:///C:/a', 'data:text/html,x',
      'https://user:password@m103.test/', 'https://user@m103.test/', 'https://:password@m103.test/']) {
      assert.deepEqual(prepareScanRequest(url, 'bad-mode'), { ok: false, error: 'invalid-url' });
    }
    for (const mode of [undefined, null, '', 'LOCAL', 'cloud', 1, {}]) {
      assert.deepEqual(prepareScanRequest('https://m103.test/', mode), { ok: false, error: 'invalid-mode' });
    }
    assert.equal(coercions, 0);
  } finally { t.mock.restoreAll(); syncBuiltinESMExports(); }
});

test('preparation returns only canonical HTTPS, exact provider context and the frozen initial profile', t => {
  t.mock.method(chromium, 'launch', () => { assert.fail('Preparation launched a browser'); });
  t.mock.method(Date, 'now', () => { assert.fail('Preparation read the clock'); });
  t.mock.method(crypto, 'randomUUID', () => { assert.fail('Preparation allocated identity'); });
  t.mock.method(globalThis, 'fetch', () => { assert.fail('Preparation called a provider/network'); });
  syncBuiltinESMExports();
  t.after(() => { t.mock.restoreAll(); syncBuiltinESMExports(); });
  for (const mode of ['local', 'groq'] as const) {
    const result = prepareScanRequest(' HTTPS://M103.TEST:443/a/../b?q=1#part ', mode);
    assert.deepEqual(result, { ok: true, value: {
      requestedUrl: 'https://m103.test/b?q=1#part', providerContext: running(mode).providerContext,
      scanContext: initialContext(),
    } });
    assert.equal(result instanceof Promise, false);
  }
});

test('execution rejects malformed/nonrunning records and invalid signals before acquisition', async t => {
  const launch = t.mock.method(chromium, 'launch', () => { assert.fail('Invalid input acquired a browser'); });
  for (const input of [undefined, null, {}, { ...running(), status: 'completed' }]) {
    await assert.rejects(executeScan(input as RunningRun, new AbortController().signal), { name: 'Error', message: 'invalid-run' });
  }
  for (const signal of [undefined, null, {}, { aborted: false }]) {
    await assert.rejects(executeScan(running(), signal as AbortSignal), { name: 'Error', message: 'invalid-signal' });
  }
  assert.equal(launch.mock.callCount(), 0);
});

test('unsupported valid initial profiles fail closed and preserve every immutable/monotonic field', async t => {
  t.mock.method(chromium, 'launch', () => { assert.fail('Unsupported profile acquired a browser'); });
  const changes: RecordValue[] = [
    { readiness: 'domcontentloaded' }, { timeoutMs: 30000 }, { locale: 'fr-FR' },
    { viewport: { width: 800, height: 600 } }, { readinessReached: true },
    { browserVersion: value('150.1') }, { finalUrl: value('https://m103.test/earlier') },
    { scannedAt: value(reportedAt), readinessReached: true },
  ];
  for (const change of changes) {
    const run = running('local', { scanContext: { ...initialContext(), ...change } });
    failed(run, await executeScan(run, new AbortController().signal), 'result-validation');
  }
});

test('already-aborted valid input returns shutdown without browser acquisition', async t => {
  t.mock.method(chromium, 'launch', () => { assert.fail('Aborted input acquired a browser'); });
  const controller = new AbortController(); controller.abort();
  const run = running();
  const context = failed(run, await executeScan(run, controller.signal), 'shutdown');
  assert.deepEqual(context.finalUrl, missing());
  assert.deepEqual(context.scannedAt, missing());
  assert.deepEqual(context.browserVersion, missing());
  assert.equal(context.readinessReached, false);
});

test('doubled native completion preserves paired report provenance, all nodes and provider isolation', async t => {
  const report = nativeReport();
  list(record(list(report.violations)[0]).nodes).push(nativeNode('image-alt'));
  report.incomplete = [{ id: 'image-alt', nodes: [nativeNode('image-alt')] }];
  const h = lifecycle(t, report);
  t.mock.method(globalThis, 'fetch', () => { assert.fail('Scanner invoked provider/network'); });
  // Compile-time compatibility does not invoke the service or storage.
  const compatible: Parameters<LocalService['runScan']>[1] = executeScan;
  assert.equal(compatible, executeScan);
  const run = running('groq');
  const before = structuredClone(run);
  const terminal = await executeScan(run, new AbortController().signal);
  assertTerminal(run, terminal);
  assert.deepEqual(run, before);
  assert.ok(terminal.status === 'completed');
  assert.deepEqual(terminal.scan.context.finalUrl, value(report.url));
  assert.deepEqual(terminal.scan.context.scannedAt, value(report.timestamp));
  assert.deepEqual(terminal.scan.context.browserVersion, value('151.0.7922.34'));
  assert.equal(terminal.scan.context.readinessReached, true);
  assert.equal(terminal.scan.context.cleanup, 'closed');
  assert.equal(terminal.scan.findings.length, 4);
  assert.equal(terminal.scan.scannerReviewObservations.length, 1);
  assert.equal(new Set(terminal.scan.findings.map(item => item.findingId)).size, 4);
  assert.deepEqual(terminal.scan.findings[0].locator, terminal.scan.findings[1].locator);
  assert.notEqual(terminal.scan.findings[0].findingId, terminal.scan.findings[1].findingId);
  assert.deepEqual(terminal.scan.coverage['image-alt'], { violations: 2, incomplete: 1, passes: null, inapplicable: null });
  assert.equal(Object.hasOwn(terminal.scan.scannerReviewObservations[0], 'findingId'), false);
  assert.deepEqual(h.events, ['launch', 'version', 'context', 'page', 'navigation', 'capture', 'close-page', 'close-context', 'close-browser']);
  assert.equal(h.state.pageClosed, true); assert.equal(h.state.connected, false);
  assert.equal(h.events.filter(event => event === 'version').length, 1);
});

test('zero findings retain incomplete observations and require complete exact-three-rule coverage', async t => {
  const report = nativeReport();
  report.violations = [];
  report.incomplete = [{ id: 'image-alt', nodes: [nativeNode('image-alt')] }];
  report.inapplicable = [{ id: 'label', nodes: [] }, { id: 'color-contrast', nodes: [] }];
  lifecycle(t, report);
  const run = running(); const terminal = await executeScan(run, new AbortController().signal);
  assertTerminal(run, terminal); assert.ok(terminal.status === 'completed');
  assert.equal(terminal.scan.findings.length, 0);
  assert.equal(terminal.scan.scannerReviewObservations.length, 1);
  assert.deepEqual(terminal.scan.coverage['image-alt'], { violations: null, incomplete: 1, passes: null, inapplicable: null });
  assert.deepEqual(terminal.scan.coverage.label, { violations: null, incomplete: null, passes: null, inapplicable: 0 });
});

test('malformed, missing-coverage and fatal native reports never publish partial success', async t => {
  const variants: { category: string; change: (report: RecordValue) => unknown; paired: boolean }[] = [
    { category: 'result-validation', change: report => { report.violations = null; return report; }, paired: true },
    { category: 'coverage-validation', change: report => { report.violations = list(report.violations).slice(1); return report; }, paired: true },
    { category: 'coverage-validation', change: report => { list(report.violations).push({ id: 'unknown-rule', nodes: [{}] }); return report; }, paired: true },
    { category: 'scanner', change: report => { record(list(report.violations)[0]).error = canary; return report; }, paired: true },
    { category: 'evidence-capture', change: report => { delete nodes(report, 'violations')[0].capturedDom; return report; }, paired: true },
    { category: 'evidence-capture', change: () => ({ captureFailure: 'evidence-capture' }), paired: false },
    { category: 'result-validation', change: report => { record(report.testEngine).version = '0.0.0'; return report; }, paired: false },
  ];
  for (const variant of variants) {
    await t.test(variant.category + (variant.paired ? ' with report identity' : ' without report identity'), async child => {
      lifecycle(child, variant.change(nativeReport()));
      const run = running(); const context = failed(run, await executeScan(run, new AbortController().signal), variant.category);
      assert.deepEqual(context.scannedAt, variant.paired ? value(reportedAt) : missing());
      assert.equal(context.readinessReached, true);
    });
  }
});

test('individual missing facts preserve nodes and valid siblings through completed execution', async t => {
  const report = nativeReport(); const first = nodes(report, 'violations')[0];
  const dom = record(first.capturedDom);
  delete dom.locator;
  delete record(dom.evidence).altState;
  delete first.any;
  lifecycle(t, report);
  const run = running(); const terminal = await executeScan(run, new AbortController().signal);
  assertTerminal(run, terminal); assert.ok(terminal.status === 'completed');
  assert.equal(terminal.scan.findings.length, 3);
  assert.deepEqual(terminal.scan.findings[0].locator, missing());
  assert.deepEqual(terminal.scan.findings[0].checks, missing());
  assert.deepEqual(terminal.scan.findings[0].evidence, { elementKind: value('img'), altState: missing() });
});

test('report URL/time use own data, reject invalid facts and preserve valid siblings', async t => {
  const variants: { field: 'url' | 'timestamp'; supplied: unknown; unavailable: string }[] = [
    { field: 'url', supplied: undefined, unavailable: 'missing' },
    { field: 'url', supplied: null, unavailable: 'invalid' },
    { field: 'url', supplied: 'https://user:password@m103.test/a', unavailable: 'invalid' },
    { field: 'url', supplied: 'HTTPS://M103.TEST:443/a', unavailable: 'invalid' },
    { field: 'url', supplied: 'about:blank', unavailable: 'invalid' },
    { field: 'timestamp', supplied: undefined, unavailable: 'missing' },
    { field: 'timestamp', supplied: null, unavailable: 'invalid' },
    { field: 'timestamp', supplied: '2026-08-31T00:00:01Z', unavailable: 'invalid' },
    { field: 'timestamp', supplied: '2026-08-30T23:59:59.999Z', unavailable: 'invalid' },
  ];
  for (const [index, variant] of variants.entries()) await t.test(`metadata control ${index}`, async child => {
    const report = nativeReport(); report[variant.field] = variant.supplied;
    lifecycle(child, report);
    const run = running(); const context = failed(run, await executeScan(run, new AbortController().signal), 'result-validation');
    assert.deepEqual(context[variant.field === 'url' ? 'finalUrl' : 'scannedAt'], { unavailable: variant.unavailable });
    assert.deepEqual(context[variant.field === 'url' ? 'scannedAt' : 'finalUrl'], value(variant.field === 'url' ? reportedAt : 'https://m103.test/a'));
  });
  await t.test('accessor is never invoked', async child => {
    const report = nativeReport(); let reads = 0;
    Object.defineProperty(report, 'timestamp', { enumerable: true, get() { reads++; return reportedAt; } });
    lifecycle(child, report);
    const run = running(); const context = failed(run, await executeScan(run, new AbortController().signal), 'result-validation');
    assert.equal(reads, 0); assert.deepEqual(context.scannedAt, { unavailable: 'invalid' });
    assert.deepEqual(context.finalUrl, value('https://m103.test/a'));
  });
});

test('browser, acquisition, navigation and scanner failures retain only actually observed context', async t => {
  for (const phase of ['launch', 'version', 'context', 'page', 'navigation', 'capture'] as const) {
    await t.test(phase, async child => {
      const h = lifecycle(child);
      const reject = async (): Promise<never> => { throw new Error(canary); };
      if (phase === 'launch') h.state.launch = reject;
      if (phase === 'version') h.state.version = 'not-a-browser-version';
      if (phase === 'context') h.state.newContext = reject;
      if (phase === 'page') h.state.newPage = reject;
      if (phase === 'navigation') h.state.navigation = reject;
      if (phase === 'capture') h.state.capture = reject;
      const run = running(); const category = phase === 'navigation' ? 'navigation' : phase === 'capture' ? 'scanner' : 'browser';
      const context = failed(run, await executeScan(run, new AbortController().signal), category);
      assert.deepEqual(context.scannedAt, missing());
      assert.equal(context.readinessReached, phase === 'capture');
      assert.deepEqual(context.browserVersion, phase === 'launch' ? missing() : phase === 'version' ? { unavailable: 'invalid' } : value('151.0.7922.34'));
      assert.deepEqual(context.finalUrl, phase === 'navigation' || phase === 'capture' ? value('https://m103.test/a') : missing());
      assert.equal(h.events.includes('close-browser'), phase !== 'launch');
    });
  }
});

test('unsafe or nonempty scratch prevents acquisition and preserves foreign residue', async t => {
  assertScratchEmpty();
  const launch = t.mock.method(chromium, 'launch', () => { assert.fail('Unsafe scratch acquired a browser'); });
  fs.writeFileSync(residue, 'test-owned-residue', { flag: 'wx' });
  try {
    const run = running(); failed(run, await executeScan(run, new AbortController().signal), 'browser', 'failed');
    assert.equal(fs.readFileSync(residue, 'utf8'), 'test-owned-residue');
  } finally { fs.unlinkSync(residue); }
  t.mock.method(os, 'tmpdir', () => path.join(scratch, 'absent-wrong-root'));
  syncBuiltinESMExports();
  try {
    const run = running(); failed(run, await executeScan(run, new AbortController().signal), 'browser', 'failed');
    assert.equal(launch.mock.callCount(), 0);
  } finally { t.mock.restoreAll(); syncBuiltinESMExports(); }
  assertScratchEmpty();
});

test('one work deadline includes acquisition and passes only remaining positive time to navigation', async t => {
  clock(t); const h = lifecycle(t); const contextReady = deferred<BrowserContext>();
  h.state.newContext = () => contextReady.promise;
  const run = running(); const operation = executeScan(run, new AbortController().signal);
  await h.entered.context.promise;
  await advance(t, 2500); contextReady.resolve(h.context);
  const terminal = await operation; assertTerminal(run, terminal); assert.equal(terminal.status, 'completed');
  assert.equal(h.state.navigationTimeouts.length, 1);
  assert.ok(h.state.navigationTimeouts[0] <= 7500 && h.state.navigationTimeouts[0] > 0);
});

test('deadline cancels pending native work and late fulfillment cannot become completion', async t => {
  clock(t); const h = lifecycle(t); const pending = deferred<unknown>(); h.state.capture = () => pending.promise;
  const run = running(); let settled = false;
  const operation = executeScan(run, new AbortController().signal).then(result => { settled = true; return result; });
  await h.entered.capture.promise;
  await advance(t, 9999); assert.equal(settled, false); assert.equal(h.events.includes('close-page'), false);
  await advance(t, 1); assert.equal(h.events.includes('close-page'), true);
  pending.resolve(nativeReport()); await turns();
  const context = failed(run, await operation, 'timeout');
  assert.deepEqual(context.scannedAt, missing()); assert.equal(context.readinessReached, true);
});

test('abort during navigation or native work keeps shutdown priority and observes late settlement', async t => {
  for (const phase of ['navigation', 'capture'] as const) await t.test(phase, async child => {
    const h = lifecycle(child); const pending = deferred<unknown>(); const controller = new AbortController();
    h.state[phase] = () => pending.promise;
    const run = running(); const operation = executeScan(run, controller.signal);
    await h.entered[phase].promise; controller.abort();
    await h.entered.pageClose.promise; pending.reject(new Error(canary));
    const context = failed(run, await operation, 'shutdown');
    assert.deepEqual(context.scannedAt, missing()); assert.equal(context.readinessReached, phase === 'capture');
  });
});

test('abort during cleanup retains accepted report identity and suppresses the success collection', async t => {
  const h = lifecycle(t); const closing = deferred<void>(); const controller = new AbortController();
  const originalClose = h.state.pageClose; h.state.pageClose = async () => { await closing.promise; await originalClose(); };
  const run = running(); const operation = executeScan(run, controller.signal);
  await h.entered.pageClose.promise; controller.abort(); closing.resolve();
  const context = failed(run, await operation, 'shutdown');
  assert.deepEqual(context.finalUrl, value('https://m103.test/a')); assert.deepEqual(context.scannedAt, value(reportedAt));
});

test('deadline and abort are rechecked after synchronous normalization before success publication', async t => {
  for (const cancellation of ['timeout', 'shutdown'] as const) await t.test(cancellation, async child => {
    clock(child); lifecycle(child);
    const controller = new AbortController(); const uuid = crypto.randomUUID.bind(crypto);
    let first = true;
    child.mock.method(crypto, 'randomUUID', () => {
      if (first) {
        first = false;
        if (cancellation === 'timeout') child.mock.timers.tick(10000); else controller.abort();
      }
      return uuid();
    });
    syncBuiltinESMExports();
    try {
      const run = running(); const context = failed(run, await executeScan(run, controller.signal), cancellation);
      assert.deepEqual(context.finalUrl, value('https://m103.test/a'));
      assert.deepEqual(context.scannedAt, value(reportedAt));
    } finally { child.mock.restoreAll(); syncBuiltinESMExports(); }
  });
});

test('late browser, context and page acquisition is registered and disposed without starting later work', async t => {
  for (const phase of ['launch', 'context', 'page'] as const) await t.test(phase, async child => {
    const h = lifecycle(child); const controller = new AbortController();
    const pending = deferred<Browser | BrowserContext | Page>();
    if (phase === 'launch') h.state.launch = () => pending.promise as Promise<Browser>;
    if (phase === 'context') h.state.newContext = () => pending.promise as Promise<BrowserContext>;
    if (phase === 'page') h.state.newPage = () => pending.promise as Promise<Page>;
    const run = running(); const operation = executeScan(run, controller.signal);
    await h.entered[phase].promise; controller.abort(); await turns();
    pending.resolve(phase === 'launch' ? h.browser : phase === 'context' ? h.context : h.page);
    const context = failed(run, await operation, 'shutdown');
    assert.equal(h.events.includes('navigation'), false);
    assert.equal(h.events.includes('capture'), false);
    assert.equal(h.events.includes('close-browser'), true);
    if (phase !== 'launch') assert.equal(h.events.includes('close-context'), true);
    if (phase === 'page') assert.equal(h.events.includes('close-page'), true);
    assert.deepEqual(context.scannedAt, missing());
  });
});

test('unsettled acquisition reaches failed cleanup at the total deadline and late disposal never upgrades it', async t => {
  clock(t); const h = lifecycle(t); const pending = deferred<Browser>(); const controller = new AbortController();
  h.state.launch = () => pending.promise;
  const run = running(); let settled = false;
  const operation = executeScan(run, controller.signal).then(result => { settled = true; return result; });
  await h.entered.launch.promise; controller.abort(); await turns();
  await advance(t, 3999); assert.equal(settled, false);
  await advance(t, 1);
  const terminal = await operation; failed(run, terminal, 'shutdown', 'failed');
  const before = JSON.stringify(terminal);
  pending.resolve(h.browser); await turns();
  assert.equal(h.events.includes('close-browser'), true); assert.equal(h.events.includes('context'), false);
  assert.equal(JSON.stringify(terminal), before);
});

test('native work still pending after cleanup deadline cannot publish its late report', async t => {
  clock(t); const h = lifecycle(t); const pending = deferred<unknown>(); h.state.capture = () => pending.promise;
  const run = running(); const operation = executeScan(run, new AbortController().signal);
  await h.entered.capture.promise;
  await advance(t, 10000); await advance(t, 4000);
  const terminal = await operation; const context = failed(run, terminal, 'timeout', 'failed');
  assert.deepEqual(context.scannedAt, missing());
  const before = JSON.stringify(terminal); pending.resolve(nativeReport()); await turns();
  assert.equal(JSON.stringify(terminal), before);
  assert.equal(h.events.filter(event => event === 'capture').length, 1);
});

test('close rejections remain permanent, attempt later closes, and do not override an earlier phase failure', async t => {
  for (const phase of ['pageClose', 'contextClose', 'browserClose'] as const) await t.test(phase, async child => {
    const h = lifecycle(child); h.state[phase] = async () => { throw new Error(canary); };
    const run = running(); failed(run, await executeScan(run, new AbortController().signal), 'cleanup', 'failed');
    assert.deepEqual(h.events.filter(event => event.startsWith('close-')), ['close-page', 'close-context', 'close-browser']);
  });
  await t.test('scanner remains first phase failure', async child => {
    const h = lifecycle(child); h.state.capture = async () => { throw new Error(canary); };
    h.state.pageClose = async () => { throw new Error(canary); };
    const run = running(); failed(run, await executeScan(run, new AbortController().signal), 'scanner', 'failed');
    assert.equal(h.events.includes('close-browser'), true);
  });
});

test('close allowances are 500/1000/1500 within one 4000ms cleanup budget', async t => {
  clock(t); const h = lifecycle(t);
  const pending = { page: deferred<void>(), context: deferred<void>(), browser: deferred<void>() };
  h.state.pageClose = () => pending.page.promise;
  h.state.contextClose = () => pending.context.promise;
  h.state.browserClose = () => pending.browser.promise;
  const run = running(); let settled = false;
  const operation = executeScan(run, new AbortController().signal).then(result => { settled = true; return result; });
  await h.entered.pageClose.promise;
  await advance(t, 499); assert.equal(h.events.includes('close-context'), false);
  await advance(t, 1); assert.equal(h.events.includes('close-context'), true);
  await advance(t, 999); assert.equal(h.events.includes('close-browser'), false);
  await advance(t, 1); assert.equal(h.events.includes('close-browser'), true);
  await advance(t, 1500); assert.equal(settled, false);
  await advance(t, 1000);
  const terminal = await operation; failed(run, terminal, 'cleanup', 'failed');
  pending.page.resolve(); pending.context.resolve(); pending.browser.resolve(); await turns();
  failed(run, terminal, 'cleanup', 'failed');
});

test('fulfilled close promises do not hide connected resources or swallowed temporary-delete failures', async t => {
  await t.test('resource status is required', async child => {
    const h = lifecycle(child); h.state.pageClose = async () => {}; h.state.browserClose = async () => {};
    const run = running(); failed(run, await executeScan(run, new AbortController().signal), 'cleanup', 'failed');
  });
  await t.test('ordinary residue is preserved', async child => {
    const h = lifecycle(child); const original = h.state.launch;
    h.state.launch = async () => { fs.writeFileSync(residue, 'test-owned-residue', { flag: 'wx' }); return original(); };
    try {
      const run = running(); failed(run, await executeScan(run, new AbortController().signal), 'cleanup', 'failed');
      assert.equal(fs.readFileSync(residue, 'utf8'), 'test-owned-residue');
    } finally { fs.unlinkSync(residue); }
  });
});

test('terminal chronology uses legitimate existing observations without fabricating scan time', async t => {
  const h = lifecycle(t);
  const originalClose = h.state.browserClose;
  h.state.browserClose = async () => { await originalClose(); t.mock.method(Date, 'now', () => Number.NaN); };
  const run = running(); const terminal = await executeScan(run, new AbortController().signal);
  assertTerminal(run, terminal); assert.ok(terminal.status === 'completed');
  assert.equal(terminal.finishedAt, reportedAt); assert.deepEqual(terminal.scan.context.scannedAt, value(reportedAt));
});

// All real resources below are test-owned. Fallback closure prevents an assertion
// failure from abandoning a browser; assertions still check production closure.
async function closeOwned(page: Page | undefined, context: BrowserContext | undefined, browser: Browser | undefined): Promise<void> {
  const failures: boolean[] = [];
  for (const resource of [page, context, browser]) {
    if (resource) { try { await resource.close(); } catch { failures.push(true); } }
  }
  assert.equal(failures.length, 0, 'Every test-owned close must fulfill');
  if (page) assert.equal(page.isClosed(), true);
  if (browser) assert.equal(browser.isConnected(), false);
  assertScratchEmpty();
}
async function offline(html: string, inspect: (page: Page, browser: Browser) => Promise<void>, profile?: BrowserContextOptions): Promise<void> {
  assertScratchEmpty(); let browser: Browser | undefined; let context: BrowserContext | undefined; let page: Page | undefined;
  let requests = 0;
  try {
    browser = await chromium.launch(launchOptions);
    context = await browser.newContext(profile ?? { ...contextOptions, offline: true });
    await context.route('**/*', async route => { requests++; await route.abort(); });
    page = await context.newPage(); await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
    assert.equal(page.url(), 'about:blank');
    await inspect(page, browser);
    assert.equal(requests, 0, 'Offline fixture must make no request');
  } finally { await closeOwned(page, context, browser); }
}
function assertNativeProfile(report: unknown): void {
  const native = record(report);
  assert.deepEqual(native.toolOptions, nativeOptions());
  assert.equal(record(native.testEngine).name, 'axe-core');
  assert.equal(record(native.testEngine).version, '4.13.0');
  for (const bucket of buckets) {
    assert.ok(Array.isArray(native[bucket]));
    for (const entry of list(native[bucket])) {
      assert.ok(rules.includes(record(entry).id as Rule));
      for (const item of list(record(entry).nodes)) {
        assert.equal(Object.hasOwn(record(item), 'element'), false, 'Native element references must not serialize');
        for (const group of ['any', 'all', 'none']) for (const check of list(record(item)[group] ?? [])) {
          for (const related of list(record(check).relatedNodes ?? [])) {
            assert.equal(Object.hasOwn(record(related), 'element'), false, 'Related element references must not serialize');
          }
        }
      }
    }
  }
}
async function assertCorrespondence(page: Page, locator: unknown, selector: string): Promise<void> {
  const fact = record(locator); assert.equal(typeof fact.value, 'string');
  const matches = await page.evaluate(({ structural, authored }) => {
    const selected = document.querySelectorAll(structural);
    return selected.length === 1 && selected[0] === document.querySelector(authored);
  }, { structural: fact.value as string, authored: selector });
  assert.equal(matches, true, 'Structural locator must identify the actual intended element');
}

test('six frozen states execute production capture once each, including native corrected same-target passes', async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'evaluation/rd003-scan-v1.json'), 'utf8')) as {
    version: string; browser: { context: BrowserContextOptions }; cases: {
      path: string; content: string; rule: Rule; selector: string; elementKind: string; stateRole: string;
      expected: { nativeBucket: Bucket; intendedTargetCount: number; incompleteCount: number; otherViolationCount: number };
    }[];
  };
  assert.equal(manifest.version, 'rd003-scan-v1'); assert.equal(manifest.cases.length, 6);
  for (const fixture of manifest.cases) {
    const bytes = fs.readFileSync(path.join(repo, fixture.path));
    assert.equal(bytes.equals(Buffer.from(fixture.content, 'utf8')), true, 'Frozen fixture bytes must match');
    await offline(bytes.toString('utf8'), async (page, browser) => {
      assert.equal(browser.version(), '151.0.7922.34');
      assert.equal(await page.evaluate(() => document.readyState), 'complete');
      assert.equal(await page.locator('[data-rd003-ready="true"]').count(), 1);
      assert.equal(await page.locator(fixture.selector).count(), 1);
      assert.equal(await page.locator(fixture.selector).evaluate(element => element.tagName.toLowerCase()), fixture.elementKind);
      assert.equal(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0)), true);
      const native = await captureNativeScan(page); assertNativeProfile(native);
      assert.equal(record(native).url, 'about:blank');
      const targets = nodes(native, fixture.expected.nativeBucket, fixture.rule).filter(node =>
        Array.isArray(node.target) && node.target.length === 1 && node.target[0] === fixture.selector);
      assert.equal(targets.length, fixture.expected.intendedTargetCount, 'Expected native target must exist in its declared bucket');
      assert.equal(nodes(native, 'incomplete').length, fixture.expected.incompleteCount);
      assert.equal(nodes(native, 'violations').filter(node => !nodes(native, 'violations', fixture.rule).includes(node)).length, fixture.expected.otherViolationCount);
      const collection = projected(native);
      assert.equal(collection.findings.length, nodes(native, 'violations').length);
      assert.equal(collection.scannerReviewObservations.length, nodes(native, 'incomplete').length);
      for (const rule of rules) for (const bucket of buckets) {
        const entry = list(record(native)[bucket]).find(item => record(item).id === rule);
        assert.equal(collection.coverage[rule][bucket], entry === undefined ? null : list(record(entry).nodes).length);
      }
      if (fixture.stateRole === 'failing') {
        const finding = collection.findings.find(item => item.ruleId === fixture.rule); assert.ok(finding);
        await assertCorrespondence(page, finding.locator, fixture.selector);
        if (finding.ruleId === 'color-contrast') {
          const check = list(targets[0].any).map(record).find(item => item.id === 'color-contrast'); assert.ok(check);
          const data = record(check.data);
          assert.deepEqual(finding.evidence.contrastRatio, value(data.contrastRatio));
          assert.deepEqual(finding.evidence.foregroundColor, value(data.fgColor));
          assert.deepEqual(finding.evidence.backgroundColor, value(data.bgColor));
          assert.deepEqual(finding.evidence.expectedContrastRatio, value(4.5));
          assert.deepEqual(finding.evidence.fontSize, value(data.fontSize));
          assert.deepEqual(finding.evidence.fontWeight, value(data.fontWeight));
        }
      } else {
        assert.equal(collection.findings.length, 0);
        assert.equal(nodes(native, 'violations', fixture.rule).length, 0);
        assert.equal(await page.locator(fixture.selector).count(), 1);
        assert.equal(targets.length, 1, 'Corrected same-target positive comes from native passes, not empty violations');
      }
      assert.equal(Object.hasOwn(collection, 'context'), false, 'about:blank gold is never fabricated public provenance');
    }, manifest.browser.context);
  }
});

// This wrapper changes only controlled DOM/reference conditions immediately
// before production projection. Native v1 aggregation remains the producer.
function beforeProjection(t: TestContext, page: Page, body: string): void {
  const evaluate = page.evaluate.bind(page);
  const call = evaluate as unknown as (source: unknown, argument?: unknown) => Promise<unknown>;
  t.mock.method(page, 'evaluate', async (source: unknown, argument?: unknown) => {
    if (typeof source === 'function' && record(record(argument)?.options)?.reporter === 'm103-native-dom-v1') {
      const appendix = `;(() => {
        const original = axe.getReporter('v1');
        axe.addReporter('v1', (raw, options, resolve, reject) => {
          original(raw, options, report => { ${body}; resolve(report); }, reject);
        });
      })();`;
      await call(appendix);
    }
    return call(source, argument);
  });
}
const imageHtml = '<!doctype html><html lang="en"><head><title>Control</title></head><body><img id="target" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22/%3E"></body></html>';

test('actual-element capture never substitutes a replacement selected by a stale native locator', async t => {
  await offline(imageHtml, async page => {
    beforeProjection(t, page, `const node = report.violations.find(rule => rule.id === 'image-alt').nodes[0];
      const old = node.element; const replacement = old.cloneNode(true); replacement.setAttribute('alt','private replacement'); old.replaceWith(replacement);`);
    const collection = projected(await captureNativeScan(page));
    assert.equal(collection.findings.length, 1);
    assert.deepEqual(collection.findings[0].locator, { unavailable: 'invalid' });
    assert.deepEqual(collection.findings[0].evidence, { elementKind: { unavailable: 'invalid' }, altState: { unavailable: 'invalid' } });
    assert.equal(await page.locator('#target').count(), 1);
  });
});

test('missing, wrong, shadow, overlong and nonunique actual reference conditions preserve bounded items', async t => {
  const cases = [
    { name: 'missing', code: 'delete node.element;', locator: 'missing', fact: 'missing' },
    { name: 'wrong', code: 'node.element = {};', locator: 'invalid', fact: 'invalid' },
    { name: 'shadow', code: "const host=document.createElement('div');document.body.append(host);host.attachShadow({mode:'open'}).append(node.element);", locator: 'unsupported', fact: 'available' },
    { name: 'overlong', code: "let parent=document.body;for(let i=0;i<150;i++){const child=document.createElement('div');parent.append(child);parent=child;}parent.append(node.element);", locator: 'too-long', fact: 'available' },
    { name: 'nonunique', code: "const original=document.querySelectorAll.bind(document);document.querySelectorAll=selector=>selector.startsWith(':root')?[node.element,node.element]:original(selector);", locator: 'invalid', fact: 'available' },
  ];
  for (const control of cases) await t.test(control.name, async child => {
    await offline(imageHtml, async page => {
      beforeProjection(child, page, `const node=report.violations.find(rule=>rule.id==='image-alt').nodes[0];${control.code}`);
      const collection = projected(await captureNativeScan(page)); assert.equal(collection.findings.length, 1);
      assert.deepEqual(collection.findings[0].locator, { unavailable: control.locator });
      assert.deepEqual(collection.findings[0].evidence, control.fact === 'available'
        ? { elementKind: value('img'), altState: value('absent') }
        : { elementKind: { unavailable: control.fact }, altState: { unavailable: control.fact } });
    });
  });
});

test('actual attributes are classified without retaining text and per-field read failure preserves siblings', async t => {
  for (const [attribute, expected] of [[null, 'absent'], ['', 'empty'], [' \t\n', 'whitespace-only'], [canary, 'non-empty']] as const) {
    await t.test(expected, async child => {
      await offline(imageHtml, async page => {
        beforeProjection(child, page, `const node=report.violations.find(rule=>rule.id==='image-alt').nodes[0];
          const text=${JSON.stringify(attribute)};if(text===null)node.element.removeAttribute('alt');else node.element.setAttribute('alt',text);`);
        const collection = projected(await captureNativeScan(page));
        assert.deepEqual(collection.findings[0].evidence, { elementKind: value('img'), altState: value(expected) });
        await assertCorrespondence(page, collection.findings[0].locator, '#target');
      });
    });
  }
  await t.test('field read exception', async child => {
    await offline(imageHtml, async page => {
      beforeProjection(child, page, `const node=report.violations.find(rule=>rule.id==='image-alt').nodes[0];
        const original=node.element.getAttribute.bind(node.element);node.element.getAttribute=name=>{if(name==='alt')throw Error('private');return original(name);};`);
      const collection = projected(await captureNativeScan(page));
      assert.deepEqual(collection.findings[0].evidence, { elementKind: value('img'), altState: { unavailable: 'invalid' } });
      await assertCorrespondence(page, collection.findings[0].locator, '#target');
    });
  });
});

test('label DOM capture uses actual association, normalized input type and resolved references without private values', async t => {
  const html = `<!doctype html><html lang="en"><head><title>Control</title></head><body>
    <input id="target" type="email" value="${canary}"><textarea id="area"></textarea><span id="resolved">${canary}</span></body></html>`;
  await offline(html, async page => {
    beforeProjection(t, page, `for(const node of report.violations.find(rule=>rule.id==='label').nodes){
      const element=node.element;if(element.id==='target'){
        const explicit=document.createElement('label');explicit.htmlFor=element.id;explicit.textContent='${canary}';document.body.append(explicit);
        const implicit=document.createElement('label');element.before(implicit);implicit.append(element);
        element.setAttribute('type','unknown-input-kind');element.setAttribute('aria-label',' ');
        element.setAttribute('aria-labelledby','resolved\t missing');element.setAttribute('title','');
        element.setAttribute('placeholder','${canary}');element.setAttribute('role','presentation\tbutton');
      }} `);
    const native = await captureNativeScan(page); assertNativeProfile(native); const collection = projected(native);
    assert.equal(collection.findings.length, 2);
    const input = collection.findings.find(item => record(item.evidence).inputType && record(record(item.evidence).inputType).value === 'text');
    assert.ok(input);
    assert.deepEqual(input.evidence, { elementKind: value('input'), inputType: value('text'), nameSources: {
      explicitLabel: value(true), implicitLabel: value(true), ariaLabel: value('whitespace-only'),
      ariaLabelledby: value('partially-resolved'), title: value('empty'), placeholder: value('non-empty'), presentationalRole: value(true),
    } });
    await assertCorrespondence(page, input.locator, '#target');
    const area = collection.findings.find(item => record(record(item.evidence).elementKind).value === 'textarea'); assert.ok(area);
    assert.deepEqual(record(area.evidence).inputType, { unavailable: 'not-applicable' });
    assert.deepEqual(record(area.evidence).nameSources, { explicitLabel: value(false), implicitLabel: value(false),
      ariaLabel: value('absent'), ariaLabelledby: value('absent'), title: value('absent'), placeholder: value('absent'), presentationalRole: value(false) });
  });
});

test('aria-labelledby resolution distinguishes empty, unresolved and resolved without retaining identifiers', async t => {
  for (const [attribute, expected] of [[' \t\r\n\f', 'empty'], ['missing', 'unresolved'], ['resolved resolved', 'resolved']] as const) {
    await t.test(expected, async child => {
      await offline('<!doctype html><html><head><title>Control</title></head><body><input id="target"><span id="resolved">Name</span></body></html>', async page => {
        beforeProjection(child, page, `const node=report.violations.find(rule=>rule.id==='label').nodes[0];node.element.setAttribute('aria-labelledby',${JSON.stringify(attribute)});`);
        const item = projected(await captureNativeScan(page)).findings[0];
        assert.deepEqual(record(record(item.evidence).nameSources).ariaLabelledby, value(expected));
      });
    });
  }
});

test('duplicate authored identifiers do not merge actual nodes or become retained locators', async () => {
  await offline(imageHtml.replace('</body>', '<img id="target" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22/%3E"></body>'), async page => {
    const collection = projected(await captureNativeScan(page)); assert.equal(collection.findings.length, 2);
    assert.equal(new Set(collection.findings.map(item => item.findingId)).size, 2);
    assert.notDeepEqual(collection.findings[0].locator, collection.findings[1].locator);
    const locators = collection.findings.map(item => record(item.locator).value as string);
    assert.equal(await page.evaluate(paths => paths.every((selector, index) => {
      const matches = document.querySelectorAll(selector);
      return matches.length === 1 && matches[0] === document.querySelectorAll('img')[index];
    }), locators), true);
  });
});

test('real native contrast incomplete remains separate and keeps only native reason and measurements', async () => {
  await offline('<!doctype html><html lang="en"><head><title>Incomplete control</title></head><body><p id="target" style="font-size:16px;color:#777777;background-image:linear-gradient(#ffffff,#eeeeee)">A controlled gradient prevents a definite background measurement.</p></body></html>', async page => {
    const native = await captureNativeScan(page); assertNativeProfile(native);
    const incomplete = nodes(native, 'incomplete', 'color-contrast');
    assert.equal(incomplete.length, 1, 'Native gradient check must produce the controlled incomplete');
    const collection = projected(native);
    const observation = collection.scannerReviewObservations.find(item => item.ruleId === 'color-contrast');
    assert.ok(observation && observation.ruleId === 'color-contrast');
    assert.equal(collection.findings.filter(item => item.ruleId === 'color-contrast').length, 0);
    assert.equal(Object.hasOwn(observation, 'state'), false);
    assert.equal(Object.hasOwn(observation, 'findingId'), false);
    assert.deepEqual(observation.incompleteReason, observation.evidence.messageKey);
    await assertCorrespondence(page, observation.locator, '#target');
    assert.equal(observation.evidence.measurementSource, 'axe-core');
  });
});

type OwnedResponse = { html: string; headers?: Record<string, string> };
async function routed(t: TestContext, responses: Map<string, OwnedResponse>, inspect: (state: {
  pages: Page[]; versions: string[]; requested: string[]; reports: unknown[];
}) => Promise<void>, observePage?: (page: Page) => Promise<void>): Promise<void> {
  assertScratchEmpty();
  const browsers: Browser[] = []; const contexts: BrowserContext[] = [];
  const pages: Page[] = []; const versions: string[] = []; const requested: string[] = []; const reports: unknown[] = [];
  const launch = chromium.launch.bind(chromium);
  t.mock.method(chromium, 'launch', async (options: LaunchOptions) => {
    assert.deepEqual(options, launchOptions);
    const browser = await launch(options); browsers.push(browser); versions.push(browser.version());
    const create = browser.newContext.bind(browser);
    t.mock.method(browser, 'newContext', async (options: BrowserContextOptions) => {
      assert.deepEqual(options, contextOptions);
      const context = await create(options); contexts.push(context);
      await context.route('**/*', async route => {
        const url = route.request().url(); requested.push(url);
        const response = responses.get(url);
        if (!response) { await route.abort(); return; }
        assert.equal(new URL(url).origin, 'https://m103.test');
        assert.equal(Object.keys(response.headers ?? {}).some(key => key.toLowerCase() === 'location'), false);
        await route.fulfill({ status: 200, contentType: 'text/html', body: response.html, headers: response.headers });
      });
      const newPage = context.newPage.bind(context);
      t.mock.method(context, 'newPage', async () => {
        const page = await newPage(); pages.push(page);
        if (observePage) await observePage(page);
        const evaluate = page.evaluate.bind(page) as unknown as (source: unknown, argument?: unknown) => Promise<unknown>;
        t.mock.method(page, 'evaluate', async (source: unknown, argument?: unknown) => {
          const result = await evaluate(source, argument);
          if (result && typeof result === 'object' && Object.hasOwn(result, 'results')) reports.push(record(result).results);
          return result;
        });
        return page;
      });
      return context;
    });
    return browser;
  });
  try {
    await inspect({ pages, versions, requested, reports });
    for (const page of pages) assert.equal(page.isClosed(), true, 'Production must close its page');
    for (const browser of browsers) assert.equal(browser.isConnected(), false, 'Production must disconnect its browser');
    assertScratchEmpty();
  } finally {
    const failures: boolean[] = [];
    for (const resource of [...pages, ...contexts, ...browsers]) {
      try { await resource.close(); } catch { failures.push(true); }
    }
    assert.equal(failures.length, 0, 'Fallback test-owned closure must fulfill');
    assertScratchEmpty();
  }
}

test('real intercepted execution retains native provenance and actual version, excludes child frame findings, and never calls providers', async t => {
  const responses = new Map<string, OwnedResponse>([
    ['https://m103.test/a', { html: '<!doctype html><html lang="en"><head><title>Public control</title></head><body><iframe src="https://m103.test/frame"></iframe><a href="https://m103.test/never">Do not follow</a></body></html>' }],
    ['https://m103.test/frame', { html: '<!doctype html><html><body><input><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22/%3E"></body></html>' }],
  ]);
  t.mock.method(globalThis, 'fetch', () => { assert.fail('Real scan invoked provider/network outside browser'); });
  await routed(t, responses, async state => {
    const run = running('local'); const terminal = await executeScan(run, new AbortController().signal);
    assertTerminal(run, terminal); assert.ok(terminal.status === 'completed');
    assert.equal(state.reports.length, 1); assertNativeProfile(state.reports[0]);
    assert.deepEqual(terminal.scan.context.finalUrl, value(record(state.reports[0]).url));
    assert.deepEqual(terminal.scan.context.scannedAt, value(record(state.reports[0]).timestamp));
    assert.deepEqual(terminal.scan.context.browserVersion, value(state.versions[0]));
    assert.equal(terminal.scan.context.readinessReached, true);
    assert.equal(terminal.scan.findings.length, 0, 'Child-frame input/image failures must be excluded');
    assert.equal(state.requested.includes('https://m103.test/frame'), true);
    assert.equal(state.requested.includes('https://m103.test/never'), false);
  });
});

test('real runs use fresh state across both provider contexts without importing cookies or storage', async t => {
  const states: { cookie: boolean; storage: boolean }[] = [];
  const html = `<!doctype html><html lang="en"><head><title>State control</title></head><body><script>
    window.priorState={cookie:document.cookie.length>0,storage:localStorage.length>0};
    document.cookie='m103state=present; SameSite=Lax';localStorage.setItem('m103state','present');
    </script></body></html>`;
  await routed(t, new Map([['https://m103.test/a', { html }]]), async state => {
    for (const mode of ['local', 'groq'] as const) {
      const run = running(mode); const terminal = await executeScan(run, new AbortController().signal);
      assertTerminal(run, terminal); assert.equal(terminal.status, 'completed');
      assertScratchEmpty();
    }
    assert.deepEqual(states, [{ cookie: false, storage: false }, { cookie: false, storage: false }]);
    assert.equal(state.pages.length, 2); assert.notEqual(state.pages[0].context(), state.pages[1].context());
  }, async page => {
    const navigate = page.goto.bind(page);
    t.mock.method(page, 'goto', async (url: string, options: Parameters<Page['goto']>[1]) => {
      const response = await navigate(url, options);
      states.push(await page.evaluate(() => (window as unknown as { priorState: { cookie: boolean; storage: boolean } }).priorState));
      return response;
    });
  });
});

test('real page-initiated download is refused without save/path calls or retained files', async t => {
  const attempted = deferred<void>(); const rejected = deferred<boolean>();
  const responses = new Map<string, OwnedResponse>([
    ['https://m103.test/a', { html: '<!doctype html><html lang="en"><head><title>Download control</title></head><body><iframe src="https://m103.test/attachment"></iframe></body></html>' }],
    ['https://m103.test/attachment', { html: 'test-owned attachment', headers: { 'Content-Disposition': 'attachment; filename="m103-test.txt"' } }],
  ]);
  await routed(t, responses, async state => {
    const run = running(); const terminal = await executeScan(run, new AbortController().signal);
    assertTerminal(run, terminal); assert.ok(terminal.status === 'completed');
    await attempted.promise; assert.equal(await rejected.promise, true, 'acceptDownloads:false must refuse the attempted download');
    assert.equal(state.requested.includes('https://m103.test/attachment'), true); assertScratchEmpty();
  }, async page => {
    page.on('download', download => {
      attempted.resolve();
      t.mock.method(download, 'path', () => { assert.fail('Download path must not be exposed'); });
      t.mock.method(download, 'saveAs', () => { assert.fail('Download must not be retained'); });
      void download.failure().then(error => rejected.resolve(error !== null), () => rejected.resolve(false));
    });
  });
});

test('real report A cannot be associated with later page B after a separate intercepted navigation', async t => {
  const responses = new Map<string, OwnedResponse>([
    ['https://m103.test/a', { html: imageHtml }],
    ['https://m103.test/b', { html: '<!doctype html><html lang="en"><head><title>Later page</title></head><body></body></html>' }],
  ]);
  let reportA: RecordValue | undefined; let observedB = false;
  await routed(t, responses, async () => {
    const run = running(); const terminal = await executeScan(run, new AbortController().signal);
    assertTerminal(run, terminal); assert.equal(observedB, true); assert.ok(reportA);
    if (terminal.status === 'completed') {
      assert.deepEqual(terminal.scan.context.finalUrl, value(reportA.url));
      assert.deepEqual(terminal.scan.context.scannedAt, value(reportA.timestamp));
      assert.equal(terminal.scan.findings.length, 1);
    } else {
      assert.equal(Object.hasOwn(terminal, 'scan'), false);
    }
  }, async page => {
    const evaluate = page.evaluate.bind(page) as unknown as (source: unknown, argument?: unknown) => Promise<unknown>;
    t.mock.method(page, 'evaluate', async (source: unknown, argument?: unknown) => {
      const result = await evaluate(source, argument);
      if (result && typeof result === 'object' && Object.hasOwn(result, 'results')) {
        reportA = record(record(result).results);
        await page.goto('https://m103.test/b', { waitUntil: 'load', timeout: 10000 });
        observedB = page.url() === 'https://m103.test/b';
      }
      return result;
    });
  });
});

test('launch rejection with residue cannot report closed cleanup, including shutdown priority', async t => {
  for (const shutdown of [false, true]) await t.test(shutdown ? 'shutdown priority' : 'browser failure', async child => {
    const h = lifecycle(child);
    const controller = new AbortController();
    const residueBytes = Buffer.from('test-owned-residue', 'utf8');
    h.state.launch = async () => {
      fs.writeFileSync(residue, residueBytes, { flag: 'wx' });
      if (shutdown) controller.abort();
      throw new Error(canary);
    };
    try {
      const run = running();
      const terminal = await executeScan(run, controller.signal);
      assertTerminal(run, terminal);
      assert.equal(terminal.status, 'failed');
      assert.ok(terminal.status === 'failed');
      assert.deepEqual(terminal.failure, { category: shutdown ? 'shutdown' : 'browser' });
      assert.equal(Object.hasOwn(terminal, 'scan'), false);
      assert.equal(Object.hasOwn(terminal, 'findings'), false);
      assert.deepEqual(h.events, ['launch'], 'Rejected acquisition must not start later work');
      assert.deepEqual(fs.readFileSync(residue), residueBytes, 'Uncertain launch residue must remain byte-preserved');
      assert.equal(terminal.scanContext.cleanup, 'failed');
    } finally { fs.unlinkSync(residue); }
  });
});
