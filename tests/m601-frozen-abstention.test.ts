import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import test from 'node:test';
import type { LocalService } from '../src/server/service.ts';
import { startLocalService } from '../src/server/service.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { explanations, investigations } from './helpers/m203-finding-fixture.ts';
import { completedScanRun, retrievalResultForPassages, selectedFinding } from './helpers/m202-retrieval-service-fixture.ts';
import { runningRun } from './helpers/m102-run-fixture.ts';
import { generationAdapterHarness } from './helpers/m302-generation-fixture.ts';
import { repo, startHarness, targetUrl } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';
import {
  authenticateFrozenAbstentionBytes,
  loadOptInFrozenAbstention,
} from './helpers/m601-frozen-abstention.ts';
import type { FrozenAbstentionBinding } from './helpers/m601-frozen-abstention.ts';

type Mutable = Record<string | number, any>;

const manifestFile = path.join(repo, 'evaluation/m301-generation-v1.json');
const fixedRoot = path.join(repo, 'temp/m601-frozen-abstention');
const optIn = process.env.A11Y_M601_FROZEN_NO_CALL;
if (optIn !== undefined && optIn !== '1') throw new Error('A11Y_M601_FROZEN_NO_CALL must be absent or exactly 1');

function syntheticBinding(): FrozenAbstentionBinding {
  const native = structuredClone(selectedFinding(completedScanRun('m601-synthetic'))) as FrozenAbstentionBinding['native'];
  return Object.freeze({
    native,
    passageIds: Object.freeze(['wcag22-sc111', 'understanding111-intent'] as const),
    expected: Object.freeze({
      support: 'incomplete', missingRoles: Object.freeze(['remediation'] as const),
      reason: 'incomplete-guidance', providerCalled: false, providerInvocation: false,
      proposal: false, reviewDecision: false,
    }),
    explanation: explanations['incomplete-guidance'],
    manualInvestigation: investigations.guidance,
    packageSha256: 'synthetic-maintained-fixture',
  });
}

function success<T>(result: { ok: true; value: T } | { ok: false }): T {
  assert.ok(result.ok);
  return result.value;
}

function ordinaryInventory(root: string): void {
  for (const name of fs.readdirSync(root)) {
    const child = path.join(root, name);
    const item = fs.lstatSync(child);
    assert.equal(item.isSymbolicLink(), false, 'Unexpected link preserves the M6-01 sandbox');
    if (item.isDirectory()) ordinaryInventory(child);
    else assert.ok(item.isFile() && item.nlink === 1, 'Unexpected file topology preserves the M6-01 sandbox');
  }
}

function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const item = fs.lstatSync(current);
    assert.ok(item.isDirectory() && !item.isSymbolicLink());
    assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase());
    if (current === repo) break;
    current = path.dirname(current);
  }
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Owned service port closure is uncertain')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned service remains reachable')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

function disk(runRoot: string, runId: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(runRoot, runId, 'run.json'), 'utf8'));
}

function pathState(target: string): string {
  if (!fs.existsSync(target)) return 'absent';
  const root = fs.lstatSync(target);
  assert.ok(root.isDirectory() && !root.isSymbolicLink());
  const entries = fs.readdirSync(target).sort().map(name => {
    const child = path.join(target, name);
    const item = fs.lstatSync(child);
    assert.equal(item.isSymbolicLink(), false);
    if (item.isDirectory()) return { name, kind: 'directory', length: 0, hash: null };
    assert.ok(item.isFile() && item.nlink === 1);
    return { name, kind: 'file', length: item.size,
      hash: crypto.createHash('sha256').update(fs.readFileSync(child)).digest('hex') };
  });
  return JSON.stringify(entries);
}

function currentRevision(): string {
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();
  assert.match(revision, /^[0-9a-f]{40}$/);
  return revision;
}

function withoutSelectedWorkflow(input: unknown): unknown {
  const clone = structuredClone(input) as Mutable;
  const selected = selectedFinding(clone);
  selected.state = 'unprocessed';
  delete selected.retrieval;
  delete selected.analysis;
  delete selected.result;
  return clone;
}

test('frozen abstention authentication fails closed before application effects', () => {
  const before = pathState(fixedRoot);
  const manifestBytes = fs.readFileSync(manifestFile);
  assert.throws(() => authenticateFrozenAbstentionBytes(manifestBytes, undefined));
  assert.throws(() => authenticateFrozenAbstentionBytes(manifestBytes, Buffer.from('altered package')));
  assert.equal(pathState(fixedRoot), before, 'Binding rejection must not change prior opt-in state');
});

test('service-owned incomplete guidance abstention is durable, rendered and provider-effect free', { timeout: 120000 }, async () => {
  const privateCase = optIn === '1';
  const binding = privateCase ? loadOptInFrozenAbstention() : syntheticBinding();
  const tempParent = path.join(repo, 'temp');
  ordinaryAncestors(tempParent);
  if (privateCase) assert.equal(fs.existsSync(fixedRoot), false, 'Fixed opt-in root must be exclusive');
  const root = privateCase ? (fs.mkdirSync(fixedRoot), fixedRoot)
    : fs.mkdtempSync(path.join(tempParent, 'm601-frozen-abstention-test-'));
  const runRoot = path.join(root, 'runs');
  const runId = privateCase ? 'm601-frozen-abstention' : `m601-synthetic-${crypto.randomUUID()}`;
  let service: LocalService | undefined;
  let browser: Harness | undefined;
  let cleanupSafe = true;
  const failures: unknown[] = [];
  try {
    const initial = completedScanRun(runId);
    ((initial.scan as Mutable).findings as unknown[])[0] = structuredClone(binding.native);
    initial.runId = runId;
    const validated = validateRun(initial);
    assert.ok(validated.ok);
    const seed = validated.value;
    const repository = success(openRunRepository(runRoot));
    success(repository.create(runningRun(runId)));
    success(repository.finish(seed));

    const started = await startLocalService({ runRoot, applicationRevision: currentRevision(), port: 0 });
    assert.ok(started.ok);
    service = started.service;
    let retrievalCalls = 0;
    const retrieval = retrievalResultForPassages(binding.passageIds.map((passageId, index) => ({
      passageId, score: 0.75 - index * 0.25,
    })));
    const outcome = await service.retrieveFinding({ runId, findingId: binding.native.findingId }, async () => {
      retrievalCalls++;
      return retrieval;
    });
    assert.ok(outcome.ok);
    assert.equal(retrievalCalls, 1);
    const finding = selectedFinding(outcome.run as unknown as Mutable);
    const persistedRetrieval = finding.retrieval as Mutable;
    const abstention = finding.result as Mutable;
    const applicationExplanation = explanations['incomplete-guidance'];
    const applicationManualInvestigation = investigations.guidance;
    assert.equal(finding.state, 'abstained');
    assert.deepEqual(persistedRetrieval.support, {
      state: binding.expected.support, missingRoles: binding.expected.missingRoles, conflicts: [],
    });
    assert.equal(abstention.reason, binding.expected.reason);
    assert.equal(abstention.explanation, applicationExplanation);
    assert.equal(abstention.manualInvestigation, applicationManualInvestigation);
    assert.equal(abstention.providerCalled, binding.expected.providerCalled);
    for (const key of ['generation', 'invocation', 'proposal', 'review']) assert.equal(key in finding, false, key);
    assert.deepEqual(withoutSelectedWorkflow(outcome.run), structuredClone(seed),
      'Only the selected Finding workflow fields may change');
    assert.deepEqual(disk(runRoot, runId), outcome.run);
    const read = service.readRun(runId);
    assert.ok(read.ok && !read.interrupted);
    assert.deepEqual(read.run, outcome.run);

    const runFile = path.join(runRoot, runId, 'run.json');
    const beforeRefusalBytes = fs.readFileSync(runFile);
    const adapter = generationAdapterHarness();
    const refused = await service.generateFinding({ runId, findingId: binding.native.findingId }, adapter.adapter);
    assert.equal(refused.ok, false);
    if (!refused.ok) {
      assert.equal(refused.error, 'not-eligible');
      assert.equal(refused.persisted, false);
      assert.equal(refused.invocationPersisted, false);
      assert.equal('invocation' in refused, false);
      assert.deepEqual(refused.run, outcome.run);
    }
    assert.deepEqual(adapter.calls, { prepare: 0, dispatch: 0, transport: 0 });
    assert.deepEqual(fs.readFileSync(runFile), beforeRefusalBytes, 'Generation refusal must not rewrite durable bytes');
    assert.deepEqual(disk(runRoot, runId), outcome.run);
    const afterRefusalRead = service.readRun(runId);
    assert.ok(afterRefusalRead.ok && !afterRefusalRead.interrupted);
    assert.deepEqual(afterRefusalRead.run, outcome.run);

    browser = await startHarness();
    const page = browser.page;
    await page.evaluate(({ initial, outcome }) => {
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(initial) });
      window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
      window.m104.mount(true, {}, true, true, false, true);
    }, { initial: seed, outcome });
    await page.getByLabel('Target URL').fill(targetUrl);
    await page.getByLabel('Local (recommended)').check();
    await page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
    await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    const detail = page.getByRole('region', { name: / evidence$/i });
    await detail.getByText('No proposal generated', { exact: true }).waitFor();
    const text = await detail.innerText();
    for (const expected of [
      'Alternative text', 'Missing', 'incomplete', 'remediation', applicationExplanation,
      applicationManualInvestigation, 'No generation provider was called',
      ...binding.passageIds,
    ]) assert.ok(text.includes(expected), expected);
    assert.equal(await detail.getByText('Eligible for generation', { exact: true }).count(), 0);
    assert.equal(await detail.getByRole('button', { name: /Generate|Approve|Edit and accept|Reject/i }).count(), 0);
    assert.deepEqual(await page.evaluate(() => window.m104.calls.map(call => call.stage)), ['analyze', 'guidance']);
    console.log(JSON.stringify({ event: 'm601-frozen-abstention', provenance: privateCase
      ? 'frozen-controlled-guidance' : 'synthetic-canonical-guidance', packageSha256: binding.packageSha256,
    retrievalCalls, adapter: adapter.calls, persisted: true, rendered: true }));
  } catch (error) {
    failures.push(error);
  }

  if (browser) {
    try { await browser.close(); } catch (error) { cleanupSafe = false; failures.push(error); }
  }
  if (service) {
    try { assert.deepEqual(await service.stop(), { ok: true, status: 'stopped' }); }
    catch (error) { cleanupSafe = false; failures.push(error); }
    try { await portClosed(service.url); }
    catch (error) { cleanupSafe = false; failures.push(error); }
  }
  try {
    assert.equal(path.dirname(root), path.resolve(tempParent));
    assert.match(path.basename(root), privateCase ? /^m601-frozen-abstention$/ : /^m601-frozen-abstention-test-/);
    ordinaryAncestors(root);
    ordinaryInventory(root);
    assert.deepEqual(fs.readdirSync(root), ['runs']);
    assert.deepEqual(fs.readdirSync(runRoot), [runId]);
    assert.deepEqual(fs.readdirSync(path.join(runRoot, runId)), ['run.json']);
    if (cleanupSafe && (!privateCase || failures.length === 0)) {
      fs.rmSync(runRoot, { recursive: true, force: false });
      if (!privateCase) fs.rmdirSync(root);
    }
  } catch (error) {
    cleanupSafe = false;
    failures.push(new Error(`M6-01 sandbox retained at ${root}`, { cause: error }));
  }
  if (privateCase && failures.length) throw new AggregateError(failures, `M6-01 private sandbox retained at ${root}`);
  if (failures.length === 1) throw failures[0];
  if (failures.length > 1) throw new AggregateError(failures, `M6-01 sandbox retained at ${root}`);
});
