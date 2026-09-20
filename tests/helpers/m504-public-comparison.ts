import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import type { ComparisonPass, ComparisonViolation, PageAnalysisRun,
  ScannerReviewObservation } from '../../src/server/domain/run-contract.ts';
import { startLocalService } from '../../src/server/service.ts';
import type { LocalService, StartResult } from '../../src/server/service.ts';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const fixedRoot = path.join(repo, 'temp/m504-public-comparison-02');
const clientRoot = path.join(repo, 'dist/client');
const scanScratch = path.join(repo, 'temp/m103-scan');
const uiScratch = path.join(repo, 'temp/m104-ui');
const entryHead = '434d7de121472a076a02b6eca6027059480c6995';
export const publicTarget = 'https://www.w3.org/WAI/demos/bad/before/home.html';

type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type BaselineSummary = { readonly ok: true; readonly runId: string; readonly findingIds: readonly string[];
  readonly sha256: string } | { readonly ok: false; readonly reason: string };
type LaterSummary = { readonly ok: true; readonly runId: string; readonly baselineRunId: string;
  readonly findingId: string; readonly sha256: string; readonly outcome: string }
  | { readonly ok: false; readonly reason: string };
export type ShutdownSummary = { readonly contextClosed: boolean; readonly browserClosed: boolean;
  readonly serviceStopped: boolean; readonly portClosed: boolean; readonly servicePort?: number;
  readonly methodPathCounts?: Readonly<Record<string, number>>; readonly scanScratchEmpty?: boolean;
  readonly uiScratchEmpty?: boolean };

export interface PublicSequence {
  start(): Promise<void>;
  baseline(): Promise<BaselineSummary>;
  rescan(findingId: string): Promise<LaterSummary>;
  close(): Promise<ShutdownSummary>;
}

export interface PublicComparisonResult {
  readonly ok: boolean;
  readonly stage: 'arguments' | 'root' | 'start' | 'baseline' | 'rescan' | 'shutdown' | 'complete';
  readonly activations: number;
  readonly reason?: string;
  readonly baseline?: BaselineSummary;
  readonly later?: LaterSummary;
  readonly shutdown?: ShutdownSummary;
}

interface TestOptions {
  readonly root: string;
  readonly createSequence: (runRoot: string) => PublicSequence;
  readonly timeoutMs?: number;
}

export interface ActualSequenceDependencies {
  readonly readHead: () => string;
  readonly startService: (options: Parameters<typeof startLocalService>[0]) => Promise<StartResult>;
  readonly launchBrowser: () => Promise<Browser>;
  readonly request: typeof fetch;
  readonly observeClosedPort: (url: string) => Promise<boolean>;
  readonly inspectScratch: (target: string) => boolean;
}

const hash = (bytes: Buffer): string => createHash('sha256').update(bytes).digest('hex');
const samePath = (left: string, right: string): boolean => path.normalize(left).toLowerCase() === path.normalize(right).toLowerCase();

function ordinaryDirectory(target: string): void {
  const resolved = path.resolve(target);
  const info = fs.lstatSync(resolved);
  assert.ok(info.isDirectory() && !info.isSymbolicLink(), 'Ordinary directory required');
  assert.ok(samePath(fs.realpathSync.native(resolved), resolved), 'Aliased directory rejected');
}

function currentHead(): string {
  const dotGit = path.join(repo, '.git');
  const gitInfo = fs.lstatSync(dotGit);
  const gitRoot = gitInfo.isDirectory() ? dotGit : path.resolve(repo, fs.readFileSync(dotGit, 'utf8').trim().replace(/^gitdir:\s*/, ''));
  const head = fs.readFileSync(path.join(gitRoot, 'HEAD'), 'utf8').trim();
  if (!head.startsWith('ref: ')) return head;
  const reference = head.slice(5);
  const loose = path.join(gitRoot, ...reference.split('/'));
  if (fs.existsSync(loose)) return fs.readFileSync(loose, 'utf8').trim();
  const row = fs.readFileSync(path.join(gitRoot, 'packed-refs'), 'utf8').split(/\r?\n/)
    .find(value => value.endsWith(` ${reference}`));
  assert.ok(row);
  return row.slice(0, 40);
}

function prepareRoot(root: string): { readonly runs: string; readonly evidence: string } {
  const resolved = path.resolve(root);
  assert.equal(path.dirname(resolved), path.join(repo, 'temp'), 'Public comparison root must be one fixed temp child');
  ordinaryDirectory(path.dirname(resolved));
  assert.equal(fs.existsSync(resolved), false, 'Public comparison root must not pre-exist');
  fs.mkdirSync(resolved, { recursive: false });
  const runs = path.join(resolved, 'runs');
  const evidence = path.join(resolved, 'evidence');
  fs.mkdirSync(runs, { recursive: false });
  fs.mkdirSync(evidence, { recursive: false });
  return { runs, evidence };
}

async function bounded<T>(operation: Promise<T>, milliseconds: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_resolve, reject) => { timer = setTimeout(() => reject(new Error(`${label}-timeout`)), milliseconds); }),
    ]);
  } finally { clearTimeout(timer); }
}

function writeResult(evidenceRoot: string, result: PublicComparisonResult): void {
  ordinaryDirectory(evidenceRoot);
  assert.deepEqual(fs.readdirSync(evidenceRoot), [], 'Evidence root changed unexpectedly');
  fs.writeFileSync(path.join(evidenceRoot, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
}

export async function runPublicComparisonForTest(args: readonly string[], options: TestOptions): Promise<PublicComparisonResult> {
  if (args.length !== 1 || args[0] !== '--public') return { ok: false, stage: 'arguments', activations: 0,
    reason: 'exact---public-argument-required' };
  let prepared: ReturnType<typeof prepareRoot>;
  try { prepared = prepareRoot(options.root); }
  catch { return { ok: false, stage: 'root', activations: 0, reason: 'root-rejected' }; }
  const sequence = options.createSequence(prepared.runs);
  const timeoutMs = options.timeoutMs ?? 15000;
  let activations = 0;
  let stage: PublicComparisonResult['stage'] = 'start';
  let reason: string | undefined;
  let baseline: BaselineSummary | undefined;
  let later: LaterSummary | undefined;
  let shutdown: ShutdownSummary | undefined;
  try {
    await bounded(sequence.start(), 30000, 'start');
    stage = 'baseline';
    activations++;
    baseline = await bounded(sequence.baseline(), timeoutMs, 'baseline');
    if (!baseline.ok) reason = baseline.reason;
    else if (baseline.findingIds.length === 0) reason = 'baseline-has-no-findings';
    else {
      stage = 'rescan';
      activations++;
      later = await bounded(sequence.rescan(baseline.findingIds[0]!), timeoutMs, 'rescan');
      if (!later.ok) reason = later.reason;
    }
  } catch (error) {
    reason = error instanceof Error && /-timeout$/.test(error.message) ? error.message : `${stage}-failed`;
  } finally {
    try { shutdown = await bounded(sequence.close(), 25000, 'shutdown'); }
    catch { reason ??= 'shutdown-failed'; }
  }
  const shutdownOk = shutdown?.contextClosed === true && shutdown.browserClosed === true &&
    shutdown.serviceStopped === true && shutdown.portClosed === true &&
    shutdown.scanScratchEmpty === true && shutdown.uiScratchEmpty === true;
  if (!shutdownOk) { stage = 'shutdown'; reason ??= 'shutdown-uncertain'; }
  else if (!reason && later?.ok) stage = 'complete';
  const result: PublicComparisonResult = { ok: stage === 'complete', stage, activations,
    ...(reason ? { reason } : {}), ...(baseline ? { baseline } : {}), ...(later ? { later } : {}),
    ...(shutdown ? { shutdown } : {}) };
  try { writeResult(prepared.evidence, result); }
  catch { return { ...result, ok: false, stage: 'shutdown', reason: 'evidence-state-changed' }; }
  return result;
}

function readCompleted(runRoot: string, runId: string): { readonly run: CompletedRun; readonly bytes: Buffer } {
  const directory = path.resolve(runRoot, runId);
  assert.equal(path.dirname(directory), path.resolve(runRoot));
  ordinaryDirectory(directory);
  assert.deepEqual(fs.readdirSync(directory), ['run.json']);
  const file = path.join(directory, 'run.json');
  const info = fs.lstatSync(file);
  assert.ok(info.isFile() && !info.isSymbolicLink() && info.nlink === 1);
  const bytes = fs.readFileSync(file);
  const checked = validateRun(JSON.parse(bytes.toString('utf8')));
  assert.ok(checked.ok && checked.value.status === 'completed' && checked.value.runId === runId);
  return { run: checked.value, bytes };
}

async function closedPort(url: string): Promise<boolean> {
  const address = new URL(url);
  return new Promise(resolve => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(5000, () => { socket.destroy(); resolve(false); });
    socket.once('connect', () => { socket.destroy(); resolve(false); });
    socket.once('error', (error: NodeJS.ErrnoException) => { socket.destroy(); resolve(error.code === 'ECONNREFUSED'); });
  });
}

async function launchUiBrowser(): Promise<Browser> {
  ordinaryDirectory(scanScratch);
  ordinaryDirectory(uiScratch);
  assert.deepEqual(fs.readdirSync(scanScratch), []);
  assert.deepEqual(fs.readdirSync(uiScratch), []);
  const previousTemp = process.env.TEMP;
  const previousTmp = process.env.TMP;
  try {
    process.env.TEMP = uiScratch;
    process.env.TMP = uiScratch;
    return await chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 });
  } finally {
    if (previousTemp === undefined) delete process.env.TEMP; else process.env.TEMP = previousTemp;
    if (previousTmp === undefined) delete process.env.TMP; else process.env.TMP = previousTmp;
  }
}

const actualDefaults: ActualSequenceDependencies = {
  readHead: currentHead,
  startService: startLocalService,
  launchBrowser: launchUiBrowser,
  request: fetch,
  observeClosedPort: closedPort,
  inspectScratch: target => {
    ordinaryDirectory(target);
    return fs.readdirSync(target).length === 0;
  },
};

const ruleGroup = { 'image-alt': 'Image alternatives', label: 'Form labels',
  'color-contrast': 'Color contrast' } as const;
const issueLabel = { 'image-alt': 'Image alternative issue', label: 'Form label issue',
  'color-contrast': 'Color contrast issue' } as const;
const displayReason = (value: string): string => value.replaceAll('-', ' ');
const locationText = (locator: { readonly value: string } | { readonly unavailable: string }): string =>
  'value' in locator ? locator.value : `Page location unavailable (${displayReason(locator.unavailable)})`;
type NativeObservation = ComparisonViolation | ComparisonPass | ScannerReviewObservation;
type DisplayFact = { readonly value: unknown } | { readonly unavailable: string };
const unavailableText = (fact: { readonly unavailable: string }): string =>
  `Unavailable (${displayReason(fact.unavailable)})`;
const ordinaryText = (fact: DisplayFact): string => 'value' in fact ? String(fact.value)
  : fact.unavailable === 'not-applicable' ? 'Not applicable' : unavailableText(fact);
const attributeText = (fact: DisplayFact): string => {
  if ('unavailable' in fact) return unavailableText(fact);
  const names = { absent: 'Missing', empty: 'Empty', 'whitespace-only': 'Whitespace only',
    'non-empty': 'Present', unresolved: 'Unresolved', 'partially-resolved': 'Partially resolved', resolved: 'Resolved' };
  const value = String(fact.value);
  return value in names ? names[value as keyof typeof names] : value.length ? value[0]!.toUpperCase() + value.slice(1) : value;
};
const booleanText = (fact: DisplayFact): string => 'unavailable' in fact ? unavailableText(fact) : fact.value ? 'Yes' : 'No';
const ratioText = (fact: DisplayFact): string => {
  if ('unavailable' in fact) return unavailableText(fact);
  const value = Number(fact.value);
  return `${Number.isInteger(value) ? value : Number(value.toFixed(2))}:1`;
};
const titleText = (fact: DisplayFact): string => {
  const value = ordinaryText(fact);
  return value.length ? value[0]!.toUpperCase() + value.slice(1) : value;
};

async function assertField(scope: ReturnType<Page['locator']>, label: string, value: string): Promise<void> {
  const row = scope.getByText(label, { exact: true }).locator('..');
  await row.getByText(value, { exact: true }).waitFor();
}

function affectedElement(observation: NativeObservation): string {
  if (observation.ruleId === 'image-alt') return 'Image element';
  if (observation.ruleId === 'color-contrast') return [ordinaryText(observation.evidence.foregroundColor),
    ordinaryText(observation.evidence.backgroundColor), ordinaryText(observation.evidence.fontSize),
    ordinaryText(observation.evidence.fontWeight)].join(' · ');
  const element = 'value' in observation.evidence.elementKind ? observation.evidence.elementKind.value : undefined;
  const input = 'value' in observation.evidence.inputType ? observation.evidence.inputType.value : undefined;
  return element === 'textarea' ? 'Textarea' : element === 'input' ? input ? `Input · ${input}` : 'Input' : 'Form control';
}

async function assertNativeEvidence(scope: ReturnType<Page['locator']>, observation: NativeObservation): Promise<void> {
  assert.ok(observation.checks && ('value' in observation.checks || 'unavailable' in observation.checks));
  if ('value' in observation.checks) {
    assert.deepEqual(Object.keys(observation.checks.value).sort(), ['all', 'any', 'none']);
  }
  await assertField(scope, 'Affected element', affectedElement(observation));
  await assertField(scope, 'Where on the page', locationText(observation.locator));
  if (observation.ruleId === 'image-alt') {
    await assertField(scope, 'Element', 'Image');
    await assertField(scope, 'Alternative text', attributeText(observation.evidence.altState));
    return;
  }
  if (observation.ruleId === 'label') {
    await assertField(scope, 'Element', ordinaryText(observation.evidence.elementKind));
    await assertField(scope, 'Input type', ordinaryText(observation.evidence.inputType));
    for (const [label, fact, format] of [
      ['Explicit label', observation.evidence.nameSources.explicitLabel, booleanText],
      ['Implicit label', observation.evidence.nameSources.implicitLabel, booleanText],
      ['ARIA label', observation.evidence.nameSources.ariaLabel, attributeText],
      ['ARIA labelled by', observation.evidence.nameSources.ariaLabelledby, attributeText],
      ['Title', observation.evidence.nameSources.title, attributeText],
      ['Placeholder', observation.evidence.nameSources.placeholder, attributeText],
    ] as const) await assertField(scope, label, format(fact));
    if ('value' in observation.evidence.nameSources.presentationalRole &&
        observation.evidence.nameSources.presentationalRole.value === true) {
      await assertField(scope, 'Presentational role', 'Yes');
    }
    return;
  }
  for (const [label, fact, format] of [
    ['Text color', observation.evidence.foregroundColor, ordinaryText],
    ['Background color', observation.evidence.backgroundColor, ordinaryText],
    ['Measured contrast', observation.evidence.contrastRatio, ratioText],
    ['Required contrast', observation.evidence.expectedContrastRatio, ratioText],
    ['Font size', observation.evidence.fontSize, ordinaryText],
    ['Font weight', observation.evidence.fontWeight, titleText],
  ] as const) await assertField(scope, label, format(fact));
  const messageKey = 'value' in observation.evidence.messageKey ? observation.evidence.messageKey.value : undefined;
  if ('value' in observation.evidence.shadowColor &&
      (messageKey === 'shadowOnBgColor' || messageKey === 'fgOnShadowColor')) {
    await assertField(scope, 'Shadow color', ordinaryText(observation.evidence.shadowColor));
  }
}

export async function assertCanonicalComparisonUi(page: Page, run: CompletedRun): Promise<void> {
  assert.ok(run.comparison);
  const comparisonValue = run.comparison;
  const comparison = page.getByRole('region', { name: 'Comparison', exact: true });
  await comparison.waitFor();
  await assertField(comparison, 'Pair comparability', displayReason(comparisonValue.pair));
  if ('match' in comparisonValue) await assertField(comparison, 'Target match', displayReason(comparisonValue.match));
  await assertField(comparison, 'Outcome', 'outcome' in comparisonValue
    ? displayReason(comparisonValue.outcome) : 'not comparable');
  await assertField(comparison, 'Reason', displayReason(comparisonValue.reason));
  if ('mismatches' in comparisonValue) {
    await assertField(comparison, 'Pair differences', comparisonValue.mismatches.map(displayReason).join(', '));
  }
  await comparison.getByText(comparisonValue.rationale, { exact: true }).waitFor();
  const before = comparison.getByRole('heading', { name: 'Before', exact: true }).locator('..');
  await assertField(before, 'Run reference', run.baselineRunId!);
  await assertField(before, 'Requested page', comparisonValue.baseline.requestedUrl);
  await assertField(before, 'Analyzed page', comparisonValue.baseline.scanContext.finalUrl.value);
  await assertField(before, 'Scan time', comparisonValue.baseline.scanContext.scannedAt.value);
  await assertField(before, 'Browser version', comparisonValue.baseline.scanContext.browserVersion.value);
  await before.getByText(`Finding reference: ${comparisonValue.baseline.findingId}`, { exact: true }).waitFor();
  await assertNativeEvidence(before, comparisonValue.baseline.observation);
  const after = comparison.getByRole('heading', { name: 'After', exact: true }).locator('..');
  await assertField(after, 'Run reference', run.runId);
  await assertField(after, 'Requested page', run.requestedUrl);
  await assertField(after, 'Analyzed page', run.scan.context.finalUrl.value);
  await assertField(after, 'Scan time', run.scan.context.scannedAt.value);
  await assertField(after, 'Browser version', run.scan.context.browserVersion.value);
  if ('after' in comparisonValue) {
    const label = comparisonValue.after.kind === 'native-pass' ? 'Native pass observation'
      : comparisonValue.after.kind === 'incomplete' ? 'Scanner review observation' : 'Finding';
    await after.getByText(label, { exact: true }).waitFor();
    if (comparisonValue.after.kind === 'finding') {
      await after.getByText(`Finding reference: ${comparisonValue.after.findingId}`, { exact: true }).waitFor();
    }
    await assertNativeEvidence(after, comparisonValue.after.observation);
    if (comparisonValue.after.kind === 'incomplete') {
      await after.getByText(`Incomplete reason: ${ordinaryText(comparisonValue.after.observation.incompleteReason)}`,
        { exact: true }).waitFor();
    }
  } else {
    await after.getByText(`After evidence unavailable: ${displayReason(comparisonValue.reason)}.`,
      { exact: true }).waitFor();
  }
  const delta = 'delta' in comparisonValue ? comparisonValue.delta : undefined;
  if (delta) {
    await assertField(comparison, 'Before margin', String(delta.baselineMargin));
    await assertField(comparison, 'After margin', String(delta.laterMargin));
    await assertField(comparison, 'Change', String(delta.change));
  }
  for (const laterFinding of run.scan.findings) {
    const index = run.scan.findings.filter(item => item.ruleId === laterFinding.ruleId)
      .findIndex(item => item.findingId === laterFinding.findingId) + 1;
    await page.getByRole('group', { name: ruleGroup[laterFinding.ruleId], exact: true })
      .getByRole('button').nth(index - 1).getByText(`${issueLabel[laterFinding.ruleId]} ${index}`,
        { exact: true }).waitFor();
  }
}

export function createActualSequenceForTest(runRoot: string,
  supplied: Partial<ActualSequenceDependencies> = {}): PublicSequence {
  const dependencies = { ...actualDefaults, ...supplied };
  let service: LocalService | undefined;
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page | undefined;
  let baselineRun: CompletedRun | undefined;
  let baselineBytes: Buffer | undefined;
  const paths: string[] = [];
  let startSettled = false;
  let closing = false;
  let servicePort: number | undefined;
  let startOperation: Promise<void> | undefined;
  let contextClose: Promise<boolean> | undefined;
  let browserClose: Promise<boolean> | undefined;
  let serviceStop: Promise<boolean> | undefined;
  const closeContext = (): Promise<boolean> => {
    if (contextClose) return contextClose;
    if (!context) return Promise.resolve(startSettled);
    contextClose = bounded(context.close(), 5000, 'context-close').then(() => true, () => false);
    return contextClose;
  };
  const closeBrowser = (): Promise<boolean> => {
    if (browserClose) return browserClose;
    if (!browser) return Promise.resolve(startSettled);
    browserClose = bounded(browser.close(), 5000, 'browser-close')
      .then(() => !browser!.isConnected(), () => false);
    return browserClose;
  };
  const stopService = (): Promise<boolean> => {
    if (serviceStop) return serviceStop;
    if (!service) return Promise.resolve(startSettled);
    serviceStop = bounded(service.stop(), 5000, 'service-stop').then(value => value.ok, () => false);
    return serviceStop;
  };
  async function rejectClosedStartup(): Promise<void> {
    if (!closing) return;
    if (context) await closeContext();
    if (browser) await closeBrowser();
    if (service) await stopService();
    throw new Error('startup-closed');
  }
  async function startOwned(): Promise<void> {
    try {
      assert.equal(dependencies.readHead(), entryHead, 'Public caller must run from the reviewed entry HEAD');
      const started = await dependencies.startService({ runRoot, applicationRevision: entryHead,
        clientRoot, port: 0, stopTimeoutMs: 5000 });
      assert.ok(started.ok, 'Fixed public service must start');
      service = started.service;
      servicePort = Number(new URL(service.url).port);
      await rejectClosedStartup();
      browser = await dependencies.launchBrowser();
      await rejectClosedStartup();
      context = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: false,
        serviceWorkers: 'block' });
      await rejectClosedStartup();
      page = await context.newPage();
      await rejectClosedStartup();
      page.setDefaultTimeout(15000);
      page.on('request', request => {
        const url = new URL(request.url());
        if (url.origin === service!.url) paths.push(`${request.method()} ${url.pathname}`);
      });
      const response = await page.goto(service.url + '/');
      assert.equal(response?.status(), 200);
      await rejectClosedStartup();
    } finally { startSettled = true; }
  }
  return {
    async start() {
      startOperation ??= startOwned();
      return startOperation;
    },
    async baseline() {
      assert.equal(closing, false);
      assert.ok(page && service);
      await page.getByLabel('Target URL').fill(publicTarget);
      await page.getByLabel('Local (recommended)').check();
      const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === '/api/runs' &&
        response.request().method() === 'POST');
      const clickPromise = page.getByRole('button', { name: 'Analyze', exact: true }).click();
      const [response] = await Promise.all([responsePromise, clickPromise]);
      if (response.status() !== 200) return { ok: false, reason: 'baseline-request-failed' };
      const body = await response.json() as { run?: unknown };
      const checked = validateRun(body.run);
      if (!checked.ok || checked.value.status !== 'completed') return { ok: false, reason: 'baseline-invalid' };
      const disk = readCompleted(runRoot, checked.value.runId);
      assert.deepEqual(disk.run, checked.value);
      paths.push(`GET /api/runs/${disk.run.runId}`);
      const get = await dependencies.request(new URL(`/api/runs/${encodeURIComponent(disk.run.runId)}`, service.url),
        { signal: AbortSignal.timeout(15000) });
      assert.equal(get.status, 200);
      const readback = await get.json() as { run?: unknown };
      assert.deepEqual(readback.run, disk.run);
      baselineRun = disk.run;
      baselineBytes = disk.bytes;
      return { ok: true, runId: disk.run.runId, findingIds: disk.run.scan.findings.map(item => item.findingId),
        sha256: hash(disk.bytes) };
    },
    async rescan(findingId: string) {
      assert.equal(closing, false);
      assert.ok(page && service && baselineRun && baselineBytes);
      const selectedIndex = baselineRun.scan.findings.findIndex(item => item.findingId === findingId);
      assert.ok(selectedIndex >= 0);
      const finding = baselineRun.scan.findings[selectedIndex]!;
      const withinRuleIndex = baselineRun.scan.findings.slice(0, selectedIndex)
        .filter(item => item.ruleId === finding.ruleId).length;
      const groupName = ruleGroup[finding.ruleId];
      await page.getByRole('group', { name: groupName, exact: true }).getByRole('button').nth(withinRuleIndex).click();
      await page.getByLabel('New scan mode', { exact: true }).selectOption('local');
      const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === '/api/rescans' &&
        response.request().method() === 'POST');
      const clickPromise = page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click();
      const [response] = await Promise.all([responsePromise, clickPromise]);
      const request = response.request().postDataJSON() as { findingId?: string };
      assert.equal(request.findingId, findingId);
      if (response.status() !== 200) return { ok: false, reason: 'rescan-request-failed' };
      const body = await response.json() as { run?: unknown };
      const checked = validateRun(body.run);
      if (!checked.ok || checked.value.status !== 'completed' || !checked.value.comparison) {
        return { ok: false, reason: 'rescan-invalid' };
      }
      const disk = readCompleted(runRoot, checked.value.runId);
      assert.deepEqual(disk.run, checked.value);
      assert.equal(disk.run.baselineRunId, baselineRun.runId);
      assert.equal(disk.run.comparison?.baseline.findingId, findingId);
      assert.deepEqual(readCompleted(runRoot, baselineRun.runId).bytes, baselineBytes);
      paths.push(`GET /api/runs/${disk.run.runId}`);
      const get = await dependencies.request(new URL(`/api/runs/${encodeURIComponent(disk.run.runId)}`, service.url),
        { signal: AbortSignal.timeout(15000) });
      assert.equal(get.status, 200);
      const readback = await get.json() as { run?: unknown };
      assert.deepEqual(readback.run, disk.run);
      await assertCanonicalComparisonUi(page, disk.run);
      await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
      await page.getByRole('button', { name: 'Return to later results', exact: true }).click();
      assert.equal(paths.some(item => /retriev|generat|review/i.test(item)), false);
      assert.equal(paths.filter(item => item === 'POST /api/runs').length, 1);
      assert.equal(paths.filter(item => item === 'POST /api/rescans').length, 1);
      assert.equal(baselineRun.requestedUrl, publicTarget);
      assert.equal(baselineRun.providerContext.mode, 'local');
      assert.equal(disk.run.requestedUrl, publicTarget);
      assert.equal(disk.run.providerContext.mode, 'local');
      const outcome = disk.run.comparison.pair === 'not-comparable' ? disk.run.comparison.reason : disk.run.comparison.outcome;
      return { ok: true, runId: disk.run.runId, baselineRunId: baselineRun.runId, findingId,
        sha256: hash(disk.bytes), outcome };
    },
    async close() {
      closing = true;
      if (startOperation) try { await bounded(startOperation, 5000, 'startup-settle'); } catch { /* preserve uncertainty */ }
      const contextClosed = await closeContext();
      const browserClosed = await closeBrowser();
      const serviceStopped = await stopService();
      let portIsClosed = startSettled && service === undefined;
      if (service) try { portIsClosed = await bounded(dependencies.observeClosedPort(service.url), 5000, 'port-close'); }
      catch { /* preserve uncertainty */ }
      const methodPathCounts = Object.freeze(Object.fromEntries([...new Set(paths)].sort()
        .map(value => [value, paths.filter(item => item === value).length])));
      let scanScratchEmpty = false;
      let uiScratchEmpty = false;
      try { scanScratchEmpty = dependencies.inspectScratch(scanScratch); } catch { /* preserve uncertainty */ }
      try { uiScratchEmpty = dependencies.inspectScratch(uiScratch); } catch { /* preserve uncertainty */ }
      return { contextClosed, browserClosed, serviceStopped, portClosed: portIsClosed,
        ...(servicePort === undefined ? {} : { servicePort }), methodPathCounts, scanScratchEmpty, uiScratchEmpty };
    },
  };
}

export async function runPublicComparison(args: readonly string[]): Promise<PublicComparisonResult> {
  if (currentHead() !== entryHead) return { ok: false, stage: 'start', activations: 0, reason: 'entry-head-changed' };
  return runPublicComparisonForTest(args, { root: fixedRoot, createSequence: createActualSequenceForTest });
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const result = await runPublicComparison(process.argv.slice(2));
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.ok) process.exitCode = 1;
}
