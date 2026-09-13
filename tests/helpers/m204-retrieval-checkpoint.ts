import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Locator, Page } from 'playwright';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { admitGuidance } from '../../src/client/finding-guidance-admission.ts';
import { openRunRepository } from '../../src/server/persistence/run-repository.ts';
import { createLoopbackApiServer } from '../../src/server/local-service/loopback-api.ts';
import { loadClientResponses } from '../../src/server/local-service/client-assets.ts';
import { startLocalService } from '../../src/server/service.ts';
import type { LocalService } from '../../src/server/service.ts';
import { RetrievalError } from '../../src/server/retrieval/retrieval-error.ts';
import { resolveFindingCitations, loadCorpusCatalog } from '../../src/server/retrieval/corpus-catalog.ts';
import { prepareEmbeddingInput } from '../../src/server/retrieval/embedding-input-fit.ts';
import { buildFindingAnalysis } from '../../src/server/domain/finding-analysis.ts';
import { classifyGuidanceSupport } from '../../src/server/retrieval/support-policy.ts';
import { retrievalResult } from './m202-retrieval-fixture.ts';
import { assessedSupportedRetrievalRun, completedScanRun } from './m202-retrieval-service-fixture.ts';
import {
  buildCheckpointSeed,
  checkpointFindingId,
  checkpointTargetUrl,
  controlledCaseIds,
  controlledCases,
  realCaseIds,
  realCases,
  sha256Json,
} from './m204-checkpoint-fixture.ts';
import type { CheckpointCaseId, ControlledCaseId, RealCaseId } from './m204-checkpoint-fixture.ts';

const repo = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const historicalTaskRoot = path.join(repo, 'temp', 'm204-retrieval-checkpoint');
const roleSelectionTaskRoot = path.join(repo, 'temp', 'm305-retrieval-role-proof');
let taskRoot = historicalTaskRoot;
const clientRoot = path.join(repo, 'dist', 'client');
const uiScratch = path.join(repo, 'temp', 'm104-ui');

type Cleanup = {
  contextClosed: boolean;
  browserClosed: boolean;
  apiClosed: boolean;
  serviceStopped: boolean;
  portsClosed: boolean;
  uiScratchRestored: boolean;
};

type CoordinatedResources = {
  context?: { close(): Promise<void> };
  browser?: { close(): Promise<void> };
  closeApi?: () => Promise<void>;
  stopService?: () => Promise<void>;
  assertPortsClosed?: () => Promise<void>;
  assertScratch?: () => void;
};

function ordinary(target: string, allowMissing = false): void {
  const full = path.resolve(target);
  assert.ok(full === taskRoot || full.startsWith(taskRoot + path.sep)
    || full === uiScratch || full.startsWith(uiScratch + path.sep)
    || full === clientRoot || full.startsWith(clientRoot + path.sep), 'M204 path escapes owned roots');
  let current = full;
  let first = true;
  while (true) {
    if (fs.existsSync(current)) {
      const stat = fs.lstatSync(current);
      assert.equal(stat.isSymbolicLink(), false, 'M204 paths must not traverse links');
      assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase());
    } else if (!allowMissing || !first) {
      assert.fail(`Required ordinary ancestor is missing: ${current}`);
    }
    if ([taskRoot, uiScratch, clientRoot].includes(current)) return;
    current = path.dirname(current);
    first = false;
  }
}

function ordinaryThroughRepo(target: string): void {
  let current = path.resolve(target);
  assert.ok(current.startsWith(repo + path.sep));
  while (true) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
    assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase());
    if (current === repo) return;
    current = path.dirname(current);
  }
}

function sha256Text(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').toUpperCase();
}

function sha256File(file: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function canonicalWireValue(value: unknown): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    assert.ok(Number.isFinite(value), 'Canonical wire numbers must be finite');
    return value;
  }
  if (Array.isArray(value)) return value.map(canonicalWireValue);
  assert.ok(typeof value === 'object' && value !== null, 'Canonical wire values must be JSON values');
  const prototype = Object.getPrototypeOf(value);
  assert.ok(prototype === Object.prototype || prototype === null, 'Canonical wire records must be plain records');
  assert.equal(Object.getOwnPropertySymbols(value).length, 0);
  const normalized: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    assert.ok(descriptor?.enumerable && 'value' in descriptor, 'Canonical wire records must contain enumerable data');
    normalized[key] = canonicalWireValue(descriptor.value);
  }
  return normalized;
}

function assertCanonicalWireEqual(actual: unknown, expected: unknown, label: string): void {
  assert.deepEqual(canonicalWireValue(actual), canonicalWireValue(expected), label);
}

function inventory(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const queue = [root];
  while (queue.length) {
    const directory = queue.shift()!;
    for (const name of fs.readdirSync(directory).sort()) {
      const child = path.join(directory, name);
      const stat = fs.lstatSync(child);
      assert.equal(stat.isSymbolicLink(), false);
      if (stat.isDirectory()) queue.push(child);
      else {
        assert.ok(stat.isFile() && stat.nlink === 1);
        result[path.relative(repo, child).replaceAll('\\', '/')] = sha256File(child);
      }
    }
  }
  return result;
}

function validateGuidanceEnvelope(raw: unknown, seed: any) {
  const admitted = admitGuidance(raw, seed, checkpointFindingId);
  assert.ok(admitted, 'Guidance response must satisfy the shared client admission contract');
  return admitted;
}

function checkpointPresentation(seed: any) {
  const ruleOrder = ['image-alt', 'label', 'color-contrast'] as const;
  const labels = {
    'image-alt': 'Image alternative issue',
    label: 'Form label issue',
    'color-contrast': 'Color contrast issue',
  } as const;
  const findings = seed.scan.findings as readonly any[];
  const rendered = ruleOrder.flatMap(rule => findings.filter(finding => finding.ruleId === rule)
    .map((finding, index) => ({
      kind: 'finding' as const,
      item: finding,
      label: `${labels[rule]} ${index + 1}`,
      selection: { findingId: finding.findingId },
    })));
  const matches = rendered.filter(result => result.selection.findingId === checkpointFindingId);
  assert.equal(matches.length, 1, 'The checkpoint Finding must have one rendered card identity');
  return { target: matches[0]!, rendered };
}

async function analyzeAndSelectCheckpoint(page: Page, appUrl: string, seed: any) {
  await page.goto(appUrl);
  await page.getByLabel('Target URL').fill(checkpointTargetUrl);
  await page.getByLabel('Local (recommended)').check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  const target = checkpointPresentation(seed).target;
  const findings = page.getByRole('region', { name: 'Findings', exact: true });
  const targetButton = findings.getByRole('button').filter({ hasText: target.label });
  await targetButton.first().waitFor();
  assert.equal(await targetButton.count(), 1, 'The intended checkpoint Finding card must be unique');
  assert.equal((await targetButton.locator('strong').textContent())?.trim(), target.label);
  const renderedCardLabels = (await findings.locator('button strong').allTextContents()).map(label => label.trim());
  await targetButton.click();
  const detail = page.getByRole('region', { name: `${target.label} evidence`, exact: true });
  await detail.getByRole('heading', { name: target.label, exact: true }).waitFor();
  return { targetLabel: target.label, detail, renderedCardLabels };
}

async function assertRenderedPassages(page: Page, detail: Locator, passages: readonly any[]) {
  const passageItems = detail.locator('ol.passage-list > li');
  for (const passage of passages) {
    const passageItem = passageItems.filter({ has: page.getByText(passage.passageId, { exact: true }) });
    await passageItem.getByText(passage.passageId, { exact: true }).waitFor();
    assert.equal(await passageItem.count(), 1, `Passage ${passage.passageId} must have one rendered item`);
    await passageItem.getByText(passage.text, { exact: true }).waitFor();
    const link = passageItem.getByRole('link',
      { name: `${passage.sourceTitle} (opens in a new tab)`, exact: true });
    await link.waitFor();
    assert.equal(await link.count(), 1);
    assert.equal(await link.getAttribute('href'), passage.url);
  }
}

async function syntheticGuidance(seed: any, passageIds: readonly string[]) {
  const initial = seed.completed.scan.findings.find((finding: any) => finding.findingId === checkpointFindingId);
  assert.ok(initial);
  const retrieval = retrievalResult(seed.query,
    passageIds.map((passageId, index) => ({ passageId, score: 0.9 - index * 0.1 })));
  const support = classifyGuidanceSupport(initial, retrieval);
  assert.ok(support.ok);
  const startedAt = '2026-09-09T10:00:03.000Z';
  const finishedAt = '2026-09-09T10:00:04.000Z';
  const decision = buildFindingAnalysis(initial, startedAt, finishedAt, support.value);
  const after: any = structuredClone(seed.completed);
  const selected = after.scan.findings.find((finding: any) => finding.findingId === checkpointFindingId);
  Object.assign(selected, decision, { retrieval: { status: 'completed', startedAt, finishedAt,
    result: retrieval, support: support.value } });
  const checked = validateRun(after);
  assert.ok(checked.ok && checked.value.status === 'completed');
  if (!checked.ok || checked.value.status !== 'completed') throw new Error('Synthetic browser proof run is invalid');
  const resolved = await resolveFindingCitations(initial, retrieval);
  assert.ok(resolved.ok);
  return { ok: true as const, run: checked.value,
    view: { runId: checked.value.runId, findingId: checkpointFindingId, ...resolved.value } };
}

async function acquireBrowser(resources: CoordinatedResources,
  launch: () => Promise<Browser> = () => chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 })) {
  const browser = await launch();
  resources.browser = browser;
  return browser;
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(5000, () => { socket.destroy(); reject(new Error('Owned port closure timed out')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

async function coordinate<T>(body: (resources: CoordinatedResources) => Promise<T>,
  resources: CoordinatedResources, deadlineMs: number, onDeadline: () => void = () => undefined) {
  const cleanup: Cleanup = { contextClosed: false, browserClosed: false, apiClosed: false,
    serviceStopped: false, portsClosed: false, uiScratchRestored: false };
  let bodyError: unknown;
  let value: T | undefined;
  let timedOut = false;
  const deadline = setTimeout(() => { timedOut = true; onDeadline(); }, deadlineMs);
  try {
    value = await body(resources);
    assert.equal(timedOut, false, `M204 case exceeded ${deadlineMs} ms outer deadline`);
  } catch (error) {
    bodyError = error;
  } finally {
    clearTimeout(deadline);
    const errors: unknown[] = [];
    const attempt = async (action: () => unknown, mark: keyof Cleanup) => {
      try { await action(); cleanup[mark] = true; } catch (error) { errors.push(error); }
    };
    if (resources.context) await attempt(() => resources.context!.close(), 'contextClosed');
    if (resources.browser) await attempt(() => resources.browser!.close(), 'browserClosed');
    if (resources.closeApi) await attempt(resources.closeApi, 'apiClosed');
    if (resources.stopService) await attempt(resources.stopService, 'serviceStopped');
    if (resources.assertPortsClosed) await attempt(resources.assertPortsClosed, 'portsClosed');
    if (resources.assertScratch) await attempt(resources.assertScratch, 'uiScratchRestored');
    if (bodyError || errors.length) {
      const aggregate = new AggregateError([...(bodyError ? [bodyError] : []), ...errors],
        'M204 proof or cleanup failed; preserve case outputs and do not retry automatically');
      Object.assign(aggregate, { cleanup, timedOut });
      throw aggregate;
    }
  }
  return { value: value as T, cleanup, timedOut };
}

function parseArguments(argv: readonly string[]) {
  const roleSelection = argv.at(-1) === '--m305-role-selection';
  const args = roleSelection ? argv.slice(0, -1) : argv;
  if (args.length === 2 && args[0] === '--prepare' && /^[0-9a-f]{40}$/.test(args[1]!)) {
    return { mode: 'prepare' as const, revision: args[1]!, roleSelection };
  }
  if (args.length === 3 && args[0] === '--real' && realCaseIds.includes(args[1] as RealCaseId)
      && /^[0-9a-f]{40}$/.test(args[2]!)) {
    return { mode: 'real' as const, caseId: args[1] as RealCaseId, revision: args[2]!, roleSelection };
  }
  if (args.length === 3 && args[0] === '--controlled' && controlledCaseIds.includes(args[1] as ControlledCaseId)
      && /^[0-9a-f]{40}$/.test(args[2]!)) {
    return { mode: 'controlled' as const, caseId: args[1] as ControlledCaseId, revision: args[2]!, roleSelection };
  }
  throw new Error('Usage: --prepare <HEAD> | --real G1|G2|G3 <HEAD> | --controlled S|A|Z|F|I <HEAD> [--m305-role-selection]');
}

function assertRevision(revision: string): void {
  assert.equal(process.cwd().toLowerCase(), repo.toLowerCase());
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), revision);
}

function createExclusiveCaseRoot(name: string): string {
  ordinary(taskRoot);
  const root = path.join(taskRoot, name.toLowerCase());
  ordinary(root, true);
  assert.equal(fs.existsSync(root), false, `M204 ${name} root must be absent`);
  fs.mkdirSync(root);
  return root;
}

function publishSeed(caseId: CheckpointCaseId, revision: string, root: string) {
  const seed = buildCheckpointSeed(caseId, revision);
  const runs = path.join(root, 'runs');
  const opened = openRunRepository(runs);
  assert.ok(opened.ok);
  assert.ok(opened.value.create(seed.running as never).ok);
  const finished = opened.value.finish(seed.completed as never);
  assert.ok(finished.ok);
  const read = opened.value.read(seed.completed.runId);
  assert.ok(read.ok);
  assert.deepEqual(read.value, finished.value);
  const checked = validateRun(read.value);
  assert.ok(checked.ok && checked.value.status === 'completed');
  fs.writeFileSync(path.join(root, 'seed.json'), JSON.stringify(seed.completed, null, 2) + '\n', { flag: 'wx' });
  return { seed, runs, repository: opened.value };
}

function stripSelectedDownstream(run: unknown): unknown {
  const copy: any = structuredClone(run);
  const selected = copy.scan.findings.find((finding: any) => finding.findingId === checkpointFindingId);
  assert.ok(selected);
  selected.state = 'unprocessed';
  delete selected.retrieval;
  delete selected.analysis;
  delete selected.result;
  return copy;
}

async function prepare(revision: string): Promise<void> {
  assertRevision(revision);
  ordinary(taskRoot);
  const resultPath = path.join(taskRoot, 'preparation.json');
  ordinary(resultPath, true);
  assert.equal(fs.existsSync(resultPath), false, 'M204 preparation receipt is single-use');
  const beforeCliChecks = fs.readdirSync(taskRoot).sort();
  for (const invalid of [[], ['--prepare'], ['--prepare', revision, 'extra'], ['--real', 'G4', revision],
    ['--real', 'G1', 'bad'],
    ['--controlled', 'C', revision], ['--unknown', revision],
    ['--m305-role-selection', '--prepare', revision],
    ['--prepare', revision, '--m305-role-selection', '--m305-role-selection']]) {
    assert.throws(() => parseArguments(invalid));
    assert.deepEqual(fs.readdirSync(taskRoot).sort(), beforeCliChecks);
  }
  const gold = JSON.parse(fs.readFileSync(path.join(repo, 'evaluation', 'm201-corpus-v1.json'), 'utf8')) as any;
  const scan = JSON.parse(fs.readFileSync(path.join(repo, 'evaluation', 'rd003-scan-v1.json'), 'utf8')) as any;
  assert.equal(gold.version, 'm201-corpus-v1');
  assert.equal(scan.version, 'rd003-scan-v1');
  const assertSubset = (actual: any, expected: any, label: string): void => {
    if (expected === null || typeof expected !== 'object') return assert.deepEqual(actual, expected, label);
    for (const [key, value] of Object.entries(expected)) assertSubset(actual?.[key], value, `${label}.${key}`);
  };
  const seeds: Record<string, unknown> = {};
  for (const caseId of [...realCaseIds, ...controlledCaseIds]) {
    const root = fs.mkdtempSync(path.join(taskRoot, 'prep-seed-'));
    try {
      const { seed } = publishSeed(caseId, revision, root);
      if (realCaseIds.includes(caseId as RealCaseId)) {
        const frozen = realCases[caseId as RealCaseId];
        const goldCase = gold.cases.find((entry: any) => entry.profile === frozen.profile);
        const scanCase = scan.cases.find((entry: any) => entry.profile === frozen.profile && entry.stateRole === 'failing');
        assert.ok(goldCase && scanCase);
        assert.deepEqual({ fixtureRevision: goldCase.fixtureRevision, targetKey: goldCase.targetKey,
          goldPassageIds: goldCase.goldPassageIds, selector: scanCase.selector,
          ruleId: goldCase.ruleId, successCriterion: goldCase.successCriterion },
        { fixtureRevision: frozen.fixtureRevision, targetKey: frozen.targetKey,
          goldPassageIds: [...frozen.goldPassageIds], selector: frozen.selector,
          ruleId: seed.query.ruleId, successCriterion: seed.query.successCriterion });
        assertSubset(seed.completed.scan.findings[0].evidence, goldCase.expectedMinimizedEvidence,
          `${caseId}.expectedMinimizedEvidence`);
      }
      const presentation = checkpointPresentation(seed.completed);
      const renderedFindingIds = presentation.rendered.flatMap(result => result.kind === 'finding'
        ? [result.selection.findingId] : []);
      assert.ok(renderedFindingIds.includes(checkpointFindingId));
      if (caseId === 'G1') assert.equal(renderedFindingIds[0], checkpointFindingId);
      if (caseId === 'G2' || caseId === 'G3') {
        assert.equal(renderedFindingIds[0], 'finding-1', `${caseId} must retain the earlier image-group sibling`);
        assert.notEqual(presentation.target.label, presentation.rendered[0]!.label);
      }
      seeds[caseId] = {
        runId: seed.completed.runId,
        seedSha256: sha256Json(seed.completed),
        querySha256: sha256Text(seed.admittedQueryInput),
        query: seed.query,
        selection: { targetFindingId: checkpointFindingId, targetLabel: presentation.target.label,
          renderedFindingIds },
      };
    } finally {
      ordinary(root);
      ordinaryThroughRepo(root);
      fs.rmSync(root, { recursive: true, force: false });
    }
  }

  const probes: Record<string, unknown> = {};
  probes['target-selection'] = Object.fromEntries(realCaseIds.map(caseId => {
    const selection = (seeds[caseId] as any).selection;
    return [caseId, { targetFindingId: selection.targetFindingId, targetLabel: selection.targetLabel,
      firstRenderedFindingId: selection.renderedFindingIds[0], renderedFindingIds: selection.renderedFindingIds }];
  }));
  const admissionBefore = completedScanRun('m204-admission-probe') as any;
  const admissionAfter = assessedSupportedRetrievalRun('m204-admission-probe') as any;
  const admissionFinding = admissionAfter.scan.findings.find((finding: any) => finding.findingId === checkpointFindingId);
  assert.ok(admissionFinding?.retrieval?.status === 'completed');
  const admissionView = await resolveFindingCitations(admissionBefore.scan.findings[0], admissionFinding.retrieval.result);
  assert.ok(admissionView.ok);
  const admittedProbe = validateGuidanceEnvelope({ ok: true, run: admissionAfter,
    view: { runId: admissionAfter.runId, findingId: checkpointFindingId, ...admissionView.value } }, admissionBefore);
  assert.ok(admittedProbe.ok);
  probes['guidance-admission-accepted'] = { accepted: true, runId: admittedProbe.run.runId,
    passageIds: admittedProbe.view.passages.map(passage => passage.passageId) };
  const canonicalAdmissionView = { runId: admissionAfter.runId, findingId: checkpointFindingId,
    ...admissionView.value };
  assert.equal(Object.getPrototypeOf(admittedProbe.view.passages[0]!), null);
  assertCanonicalWireEqual(admittedProbe.view, canonicalAdmissionView,
    'Validated admitted citations must equal canonical JSON values independent of record prototypes');
  const alteredText: any = canonicalWireValue(admittedProbe.view);
  alteredText.passages[0].text += ' altered';
  const alteredUrl: any = canonicalWireValue(admittedProbe.view);
  alteredUrl.passages[0].url += '#altered';
  const alteredOrder: any = canonicalWireValue(admittedProbe.view);
  alteredOrder.passages.reverse();
  for (const [label, altered] of [['text', alteredText], ['url', alteredUrl], ['order', alteredOrder]] as const) {
    assert.throws(() => assertCanonicalWireEqual(altered, canonicalAdmissionView,
      `Altered canonical ${label} must fail comparison`));
  }
  probes['canonical-wire-comparison'] = { admittedPassagePrototype: 'null', matchingValues: true,
    alteredTextRejected: true, alteredUrlRejected: true, alteredOrderRejected: true };

  const duplicateCitationCases = [
    { caseId: 'G2' as const, passageIds: ['h44-explicit-label', 'h44-label-applicability'] },
    { caseId: 'G3' as const, passageIds: ['understanding143-intent', 'understanding143-threshold-measurement'] },
  ];
  const duplicateCitationResults: Record<string, unknown> = {};
  for (const duplicate of duplicateCitationCases) {
    const seed = buildCheckpointSeed(duplicate.caseId, revision);
    const resolved = await resolveFindingCitations(seed.completed.scan.findings[0],
      retrievalResult(seed.query, duplicate.passageIds.map((passageId, index) => ({ passageId, score: 0.9 - index * 0.1 }))));
    assert.ok(resolved.ok);
    assert.deepEqual(resolved.value.passages.map(passage => passage.passageId), duplicate.passageIds);
    assert.equal(new Set(resolved.value.passages.map(passage => passage.url)).size, 1,
      `${duplicate.caseId} must preserve distinct canonical passages that share one URL`);
    duplicateCitationResults[duplicate.caseId] = resolved.value.passages.map(passage =>
      ({ passageId: passage.passageId, url: passage.url }));
  }
  probes['duplicate-url-citations'] = duplicateCitationResults;
  const fakeResources = () => {
    const events: string[] = [];
    const resources: CoordinatedResources = {
      context: { close: async () => { events.push('context'); } },
      browser: { close: async () => { events.push('browser'); } },
      closeApi: async () => { events.push('api'); },
      stopService: async () => { events.push('service'); },
      assertPortsClosed: async () => { events.push('ports'); },
      assertScratch: () => { events.push('scratch'); },
    };
    return { events, resources };
  };
  const failureProbe = async (name: string, body: () => Promise<unknown>, deadlineMs = 1000,
    onDeadline: () => void = () => undefined, failCleanup = false) => {
    const fake = fakeResources();
    if (failCleanup) fake.resources.context = { close: async () => {
      fake.events.push('context');
      throw new Error('SYNTHETIC_CONTEXT_CLOSE_FAILURE');
    } };
    try {
      await coordinate(async () => body(), fake.resources, deadlineMs, onDeadline);
      assert.fail(`${name} must fail`);
    } catch (error) {
      assert.ok(error instanceof AggregateError);
      assert.deepEqual(fake.events, ['context', 'browser', 'api', 'service', 'ports', 'scratch']);
      probes[name] = { failed: true, cleanupOrder: [...fake.events],
        aggregateErrorCount: error.errors.length,
        bodyAndCleanupSeparated: 'cleanup' in error && 'timedOut' in error };
    }
  };
  await failureProbe('launch-failure', async () => {
    const isolated: CoordinatedResources = {};
    await acquireBrowser(isolated, async () => { throw new Error('SYNTHETIC_LAUNCH_FAILURE'); });
  });
  await failureProbe('malformed-output', async () => {
    validateGuidanceEnvelope({ ok: true }, buildCheckpointSeed('S', revision).completed);
  });
  await failureProbe('early-assertion', async () => assert.fail('SYNTHETIC_EARLY_ASSERTION'),
    1000, () => undefined, true);
  let releaseDeadline!: () => void;
  const deadlineBody = new Promise<void>(resolve => { releaseDeadline = resolve; });
  await failureProbe('deadline', async () => deadlineBody, 1, releaseDeadline);
  const orderly = fakeResources();
  const orderlyResult = await coordinate(async () => ({ ok: true }), orderly.resources, 1000);
  assert.deepEqual(orderly.events, ['context', 'browser', 'api', 'service', 'ports', 'scratch']);
  probes['orderly-teardown'] = { value: orderlyResult.value, cleanup: orderlyResult.cleanup,
    cleanupOrder: orderly.events };

  const catalog = await loadCorpusCatalog();
  assert.ok(catalog.ok);
  const documentInputs = catalog.value.passages.map(passage => prepareEmbeddingInput('D', passage.text));
  assert.equal(documentInputs.length, 16);
  const baselineIdentity = {
    source: inventory(path.join(repo, 'src')),
    tests: inventory(path.join(repo, 'tests')),
    build: inventory(clientRoot),
    corpus: inventory(path.join(repo, 'corpus', 'wcag22-mvp-v1')),
    configuration: { packageJson: sha256File(path.join(repo, 'package.json')),
      packageLock: sha256File(path.join(repo, 'package-lock.json')) },
  };
  const browserPreparation = await prepareBrowserProof(revision);

  fs.writeFileSync(resultPath, JSON.stringify({
    kind: 'm204-preparation', revision, modelRequestsObserved: 0,
    sourceDerivedRealRequestBound: { perCase: { embeds: 17, metadata: '7-or-8', totalMaximum: 25 },
      threeCases: { embedsMaximum: 51, totalMaximum: 75 } },
    frozenInputs: {
      goldSha256: sha256File(path.join(repo, 'evaluation', 'm201-corpus-v1.json')),
      scanSha256: sha256File(path.join(repo, 'evaluation', 'rd003-scan-v1.json')),
      corpusManifestSha256: sha256File(path.join(repo, 'corpus', 'wcag22-mvp-v1', 'manifest.json')),
      corpusPassagesSha256: sha256File(path.join(repo, 'corpus', 'wcag22-mvp-v1', 'passages.json')),
      documentInputSha256: documentInputs.map(sha256Text),
    },
    baselineIdentity, seeds, probes, browserPreparation,
  }, null, 2) + '\n', { flag: 'wx' });
}

async function listen(server: http.Server): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return `http://127.0.0.1:${address.port}`;
}

async function closeServer(server: http.Server): Promise<void> {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  server.closeAllConnections();
}

async function prepareBrowserProof(revision: string) {
  ordinary(uiScratch);
  assert.deepEqual(fs.readdirSync(uiScratch), []);
  ordinary(clientRoot);
  const resources: CoordinatedResources = {
    assertScratch: () => assert.deepEqual(fs.readdirSync(uiScratch), []),
  };
  let api: http.Server | undefined;
  let apiUrl = '';
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let activeSeed = buildCheckpointSeed('G1', revision);
  let delayedEnvelope: Awaited<ReturnType<typeof syntheticGuidance>> | undefined;
  let releaseGuidance!: () => void;
  const guidanceGate = new Promise<void>(resolve => { releaseGuidance = resolve; });
  let guidanceCalls = 0;
  const coordinated = await coordinate(async () => {
    api = createLoopbackApiServer({
      isStopping: () => false,
      isBusy: () => false,
      readRun: () => ({ ok: false, error: 'not-found' }),
      clientResponses: loadClientResponses(clientRoot),
      runScan: async input => {
        assert.deepEqual(input, { requestedUrl: checkpointTargetUrl, mode: 'local' });
        return { ok: true, run: activeSeed.completed as never };
      },
      retrieveFinding: async input => {
        assert.deepEqual(input, { runId: activeSeed.completed.runId, findingId: checkpointFindingId });
        assert.ok(delayedEnvelope);
        guidanceCalls++;
        await guidanceGate;
        return delayedEnvelope as never;
      },
    });
    resources.closeApi = () => closeServer(api!);
    resources.assertPortsClosed = async () => { if (apiUrl) await portClosed(apiUrl); };
    apiUrl = await listen(api);
    browser = await acquireBrowser(resources);
    context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false,
      serviceWorkers: 'block' });
    resources.context = context;
    await context.route('**/*', async route => {
      if (new URL(route.request().url()).origin !== apiUrl) { await route.abort(); return; }
      await route.continue();
    });
    const selections: Record<string, unknown> = {};
    for (const caseId of realCaseIds) {
      activeSeed = buildCheckpointSeed(caseId, revision);
      const page = await context.newPage();
      const selected = await analyzeAndSelectCheckpoint(page, apiUrl, activeSeed.completed);
      if (caseId === 'G2' || caseId === 'G3') {
        assert.equal(selected.renderedCardLabels[0], 'Image alternative issue 1');
        assert.ok(selected.renderedCardLabels.indexOf(selected.targetLabel) > 0);
      }
      selections[caseId] = { targetLabel: selected.targetLabel,
        firstRenderedLabel: selected.renderedCardLabels[0], renderedCardLabels: selected.renderedCardLabels,
        detailSelected: true };
      await page.close();
    }
    activeSeed = buildCheckpointSeed('G2', revision);
    delayedEnvelope = await syntheticGuidance(activeSeed,
      ['h44-explicit-label', 'h44-label-applicability']);
    const delayedPage = await context.newPage();
    const selected = await analyzeAndSelectCheckpoint(delayedPage, apiUrl, activeSeed.completed);
    const responsePromise = delayedPage.waitForResponse(response =>
      new URL(response.url()).pathname === '/api/finding-guidance');
    await selected.detail.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await selected.detail.getByText('Retrieving guidance…', { exact: true }).waitFor();
    const expectedPassages = delayedEnvelope.view.passages;
    const pendingPassageWait = assertRenderedPassages(delayedPage, selected.detail, expectedPassages);
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.equal(await selected.detail.locator('ol.passage-list > li').count(), 0);
    releaseGuidance();
    const httpResponse = await responsePromise;
    const admitted = validateGuidanceEnvelope(await httpResponse.json(), activeSeed.completed);
    assert.ok(admitted.ok);
    await pendingPassageWait;
    assert.equal(guidanceCalls, 1);
    const urls = admitted.view.passages.map(passage => passage.url);
    assert.equal(new Set(urls).size, 1);
    await delayedPage.close();
    return { lane: 'controlled-synthetic-no-model', browserVersion: browser!.version(), selections,
      delayedPresentation: { absentBeforeRelease: true, passageIds: admitted.view.passages.map(p => p.passageId),
        sharedCanonicalUrl: urls[0], guidanceCalls, sharedWaitCompletedAfterRelease: true } };
  }, resources, 120000, () => { void context?.close(); void browser?.close(); void (api && closeServer(api)); });
  return { ...coordinated.value, cleanup: coordinated.cleanup };
}

async function browserAction(page: Page, appUrl: string, seed: any) {
  const selected = await analyzeAndSelectCheckpoint(page, appUrl, seed);
  const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === '/api/finding-guidance');
  await selected.detail.getByRole('button', { name: 'Get guidance', exact: true }).click();
  const response = await responsePromise;
  const body = await response.json();
  const admitted = validateGuidanceEnvelope(body, seed);
  assert.equal(response.status(), admitted.ok ? 200 : 500);
  assert.ok(admitted.run);
  assert.deepEqual(stripSelectedDownstream(admitted.run), seed);
  return { raw: body, admitted, targetLabel: selected.targetLabel, detail: selected.detail };
}

async function executeCase(caseId: CheckpointCaseId, revision: string, real: boolean): Promise<void> {
  assertRevision(revision);
  ordinary(uiScratch);
  assert.deepEqual(fs.readdirSync(uiScratch), []);
  ordinary(clientRoot);
  const preparationPath = path.join(taskRoot, 'preparation.json');
  ordinary(preparationPath);
  const preparation = JSON.parse(fs.readFileSync(preparationPath, 'utf8')) as any;
  assert.equal(preparation.kind, 'm204-preparation');
  assert.equal(preparation.revision, revision);
  const expectedSeed = buildCheckpointSeed(caseId, revision);
  assert.equal(preparation.seeds[caseId].seedSha256, sha256Json(expectedSeed.completed));
  assert.equal(preparation.seeds[caseId].querySha256, sha256Text(expectedSeed.admittedQueryInput));
  assert.equal(preparation.frozenInputs.goldSha256,
    sha256File(path.join(repo, 'evaluation', 'm201-corpus-v1.json')));
  assert.equal(preparation.frozenInputs.corpusPassagesSha256,
    sha256File(path.join(repo, 'corpus', 'wcag22-mvp-v1', 'passages.json')));
  const baselineIdentity = {
    source: inventory(path.join(repo, 'src')),
    tests: inventory(path.join(repo, 'tests')),
    build: inventory(clientRoot),
    corpus: inventory(path.join(repo, 'corpus', 'wcag22-mvp-v1')),
    configuration: { packageJson: sha256File(path.join(repo, 'package.json')),
      packageLock: sha256File(path.join(repo, 'package-lock.json')) },
  };
  assert.deepEqual(baselineIdentity, preparation.baselineIdentity,
    'M204 source/test/build/corpus/configuration identity changed after preparation');
  const root = createExclusiveCaseRoot(caseId);
  const published = publishSeed(caseId, revision, root);
  let service: LocalService | undefined;
  let api: http.Server | undefined;
  let serviceUrl = '';
  let apiUrl = '';
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  const resources: CoordinatedResources = {};
  resources.assertScratch = () => assert.deepEqual(fs.readdirSync(uiScratch), []);
  let guidanceStarted = false;
  let guidanceCount = 0;
  let analyzeCount = 0;
  let semanticFailure: string | undefined;
  let coordinated: { value: any; cleanup: Cleanup; timedOut: boolean } | undefined;
  let coordinateFailure: unknown;
  try {
    coordinated = await coordinate(async () => {
    const started = await startLocalService({ runRoot: published.runs, applicationRevision: revision,
      ...(real ? { clientRoot } : {}) });
    assert.ok(started.ok);
    service = started.service;
    serviceUrl = service.url;
    resources.stopService = async () => { assert.deepEqual(await service!.stop(), { ok: true, status: 'stopped' }); };
    resources.assertPortsClosed = async () => {
      await portClosed(serviceUrl);
      if (apiUrl) await portClosed(apiUrl);
    };
    let appUrl = serviceUrl;
    if (!real) {
      const controlled = controlledCases[caseId as ControlledCaseId];
      const executor = async () => {
        if (caseId === 'F') throw new RetrievalError('embedding-failed');
        return retrievalResult(published.seed.query, [...(controlled.passages ?? [])]);
      };
      api = createLoopbackApiServer({
        isStopping: () => false, isBusy: () => false, readRun: input => service!.readRun(input),
        clientResponses: loadClientResponses(clientRoot),
        runScan: async input => {
          assert.deepEqual(input, { requestedUrl: checkpointTargetUrl, mode: 'local' });
          return { ok: true, run: published.seed.completed as never };
        },
        retrieveFinding: async input => {
          if (caseId !== 'I') return service!.retrieveFinding(input, executor);
          const original = fsPromises.readFile;
          fsPromises.readFile = (async (...args: Parameters<typeof fsPromises.readFile>) => {
            const bytes = await Reflect.apply(original, fsPromises, args) as Buffer;
            if (String(args[0]).endsWith('passages.json')) {
              const altered = Buffer.from(bytes);
              const offset = altered.indexOf(Buffer.from('WCAG'));
              assert.ok(offset >= 0);
              altered[offset + 3] = 'g'.charCodeAt(0);
              return altered;
            }
            return bytes;
          }) as typeof fsPromises.readFile;
          syncBuiltinESMExports();
          try { return await service!.retrieveFinding(input, executor); }
          finally { fsPromises.readFile = original; syncBuiltinESMExports(); }
        },
      });
      resources.closeApi = () => closeServer(api!);
      apiUrl = await listen(api);
      appUrl = apiUrl;
    }
    browser = await acquireBrowser(resources);
    context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false,
      serviceWorkers: 'block' });
    resources.context = context;
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === appUrl && url.pathname === '/api/runs') {
        assert.equal(request.method(), 'POST');
        assert.deepEqual(request.postDataJSON(), { requestedUrl: checkpointTargetUrl, mode: 'local' });
        analyzeCount++;
        if (real) await route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: true, run: published.seed.completed }) });
        else await route.continue();
        return;
      }
      if (url.origin === appUrl && url.pathname === '/api/finding-guidance') {
        assert.equal(request.method(), 'POST');
        assert.deepEqual(request.postDataJSON(),
          { runId: published.seed.completed.runId, findingId: checkpointFindingId });
        guidanceStarted = true;
        guidanceCount++;
        await route.continue();
        return;
      }
      if (url.origin !== appUrl) { await route.abort(); return; }
      await route.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(300000);
    const response = await browserAction(page, appUrl, published.seed.completed);
    assert.equal(analyzeCount, 1);
    assert.equal(guidanceCount, 1);
    const canonicalPath = path.join(published.runs, published.seed.completed.runId, 'run.json');
    const disk = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
    assert.deepEqual(response.admitted.run, disk);
    const repositoryRead = published.repository.read(published.seed.completed.runId);
    assert.ok(repositoryRead.ok);
    assert.deepEqual(repositoryRead.value, disk);
    const checked = validateRun(disk);
    assert.ok(checked.ok && checked.value.status === 'completed');
    if (!checked.ok || checked.value.status !== 'completed') throw new Error('M204 durable result must be completed');
    const serviceRead = service!.readRun(published.seed.completed.runId);
    assert.ok(serviceRead.ok && serviceRead.interrupted === false);
    assert.deepEqual(serviceRead.run, disk);
    const selected: any = checked.value.scan.findings.find(finding => finding.findingId === checkpointFindingId);
    assert.ok(selected);
    let ranking: unknown = null;
    if ('retrieval' in selected && selected.retrieval.status === 'completed') {
      const initial = published.seed.completed.scan.findings.find((finding: any) => finding.findingId === checkpointFindingId);
      const resolved = await resolveFindingCitations(initial, selected.retrieval.result);
      assert.ok(resolved.ok);
      assert.ok(response.admitted.ok);
      assertCanonicalWireEqual(response.admitted.view,
        { runId: published.seed.completed.runId, findingId: checkpointFindingId, ...resolved.value },
        'Validated browser citations must equal independently resolved canonical wire values');
    }
    if (response.admitted.ok) {
      const detail = page.getByRole('region', { name: `${response.targetLabel} evidence`, exact: true });
      await assertRenderedPassages(page, detail, response.admitted.view.passages);
      for (const notice of response.admitted.view.notices) await detail.getByText(notice.text, { exact: true }).waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    }
    const detail = page.getByRole('region', { name: `${response.targetLabel} evidence`, exact: true });
    const renderedAssertions: string[] = ['selected-finding-0'];
    if (real) {
      assert.ok(response.admitted.ok);
      assert.equal(selected.retrieval?.status, 'completed');
      const ordered = selected.retrieval.result.passages.map((passage: any) =>
        ({ passageId: passage.passageId, score: passage.score }));
      const acceptable = realCases[caseId as RealCaseId].goldPassageIds as readonly string[];
      const goldHits = ordered.filter((passage: any) => acceptable.includes(passage.passageId));
      ranking = { ordered, acceptable, goldHits, support: selected.retrieval.support ?? null,
        finalState: selected.state };
      if (goldHits.length === 0) semanticFailure = `${caseId}: no frozen acceptable gold passage returned`;
      if (selected.state === 'active') {
        await detail.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
        renderedAssertions.push('eligible-for-generation');
      } else {
        assert.equal(selected.state, 'abstained');
        await detail.getByRole('heading', { name: 'No proposal generated', exact: true }).waitFor();
        await detail.getByText('No generation provider was called', { exact: true }).waitFor();
        await detail.getByText(selected.result.manualInvestigation, { exact: true }).waitFor();
        renderedAssertions.push('no-proposal', 'no-generation-call', 'manual-investigation');
      }
    }
    if (!real) {
      const expectation = caseId as ControlledCaseId;
      if (expectation === 'S') {
        assert.ok(response.admitted.ok);
        assert.equal(selected.state, 'active');
        assert.deepEqual(selected.retrieval.support, { state: 'supported', missingRoles: [], conflicts: [] });
        assert.equal('result' in selected || 'invocation' in selected || 'review' in selected || 'proposal' in selected, false);
        await detail.getByRole('heading', { name: 'Guidance support', exact: true }).waitFor();
        await detail.getByText('supported', { exact: true }).waitFor();
        await detail.getByRole('heading', { name: 'Eligible for generation', exact: true }).waitFor();
        renderedAssertions.push('supported', 'eligible-for-generation');
      } else if (expectation === 'A' || expectation === 'Z') {
        assert.ok(response.admitted.ok);
        assert.equal(selected.state, 'abstained');
        assert.equal(selected.result.providerCalled, false);
        assert.deepEqual(selected.retrieval.support, expectation === 'A'
          ? { state: 'incomplete', missingRoles: ['interpretation', 'remediation'], conflicts: [] }
          : { state: 'missing', missingRoles: ['criterion', 'interpretation', 'remediation'], conflicts: [] });
        assert.equal(selected.result.reason, expectation === 'A' ? 'incomplete-guidance' : 'missing-guidance');
        assert.equal('invocation' in selected || 'review' in selected || 'proposal' in selected, false);
        await detail.getByRole('heading', { name: 'Guidance support', exact: true }).waitFor();
        await detail.getByText(expectation === 'A' ? 'incomplete' : 'missing', { exact: true }).waitFor();
        await detail.getByRole('heading', { name: 'No proposal generated', exact: true }).waitFor();
        await detail.getByText('No generation provider was called', { exact: true }).waitFor();
        await detail.getByText(selected.result.manualInvestigation, { exact: true }).waitFor();
        assert.equal(await detail.getByRole('heading', { name: 'Eligible for generation', exact: true }).count(), 0);
        renderedAssertions.push(`${expectation === 'A' ? 'incomplete' : 'missing'}-support`,
          'no-proposal', 'no-generation-call', 'manual-investigation');
        if (expectation === 'Z') {
          await detail.getByText('wcag22-mvp-v1', { exact: true }).waitFor();
          renderedAssertions.push('corpus-wcag22-mvp-v1');
        }
      } else {
        assert.equal(response.admitted.ok, false);
        if (!response.admitted.ok) assert.equal(response.admitted.error,
          expectation === 'F' ? 'embedding-failed' : 'corpus-integrity');
        assert.equal(selected.state, 'failed');
        assert.equal('support' in selected.retrieval || 'analysis' in selected || 'result' in selected
          || 'invocation' in selected || 'review' in selected || 'proposal' in selected, false);
        const expectedError = expectation === 'F' ? 'embedding-failed' : 'corpus-integrity';
        await detail.getByText(`Guidance failed: ${expectedError}.`, { exact: true }).waitFor();
        await detail.getByRole('heading', { name: 'Guidance failed', exact: true }).waitFor();
        await detail.getByText(expectedError, { exact: true }).waitFor();
        for (const heading of ['Guidance support', 'No proposal generated', 'Eligible for generation']) {
          assert.equal(await detail.getByRole('heading', { name: heading, exact: true }).count(), 0);
        }
        renderedAssertions.push('guidance-failed', expectedError, 'no-success-outcome');
      }
    }
    if (real) await page.screenshot({ path: path.join(root, 'desktop.png'), fullPage: true });
    if (caseId === 'A') {
      await page.screenshot({ path: path.join(root, 'desktop.png'), fullPage: true });
      await page.setViewportSize({ width: 320, height: 800 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
      await page.screenshot({ path: path.join(root, 'narrow.png'), fullPage: true });
    }
    return { response: response.raw, disk, selected, canonicalSha256: sha256Json(disk), ranking,
      renderedAssertions,
      browserVersion: browser!.version(), semanticFailure };
    }, resources, 330000, () => { void context?.close(); void service?.stop(); });
  } catch (error) {
    coordinateFailure = error;
  }
  let partialCanonical: unknown = null;
  const canonicalPath = path.join(published.runs, published.seed.completed.runId, 'run.json');
  if (fs.existsSync(canonicalPath)) partialCanonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  const cleanup = coordinated?.cleanup ?? ((coordinateFailure as any)?.cleanup ?? null);
  fs.writeFileSync(path.join(root, 'evidence.json'), JSON.stringify({ kind: real ? 'real' : 'controlled', caseId,
    revision, modelRequestsObserved: real ? 'not-instrumented' : 0,
    sourceDerivedRequestBound: real ? { embeds: 17, metadata: '7-or-8', maximum: 25 } : null,
    identities: { baseline: baselineIdentity, seedSha256: sha256Json(published.seed.completed),
      querySha256: sha256Text(published.seed.admittedQueryInput) },
    guidance: { started: guidanceStarted, count: guidanceCount, analyzeSeedResponses: analyzeCount },
    outcome: coordinated?.value ?? null, partialCanonical,
    failure: coordinateFailure instanceof Error ? { name: coordinateFailure.name, message: coordinateFailure.message } : null,
    timeout: Boolean((coordinateFailure as any)?.timedOut), cleanup }, null, 2) + '\n', { flag: 'wx' });
  if (coordinateFailure) throw coordinateFailure;
  if (semanticFailure) throw new Error(semanticFailure);
}

async function main(argv: readonly string[]): Promise<void> {
  const parsed = parseArguments(argv);
  taskRoot = parsed.roleSelection ? roleSelectionTaskRoot : historicalTaskRoot;
  if (parsed.mode === 'prepare') return prepare(parsed.revision);
  return executeCase(parsed.caseId, parsed.revision, parsed.mode === 'real');
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) await main(process.argv.slice(2));
