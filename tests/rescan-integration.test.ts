import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import nodeTest from 'node:test';
import type { TestContext } from 'node:test';
import { validateRun } from '../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../src/server/domain/run-contract.ts';
import type { RunningRun } from '../src/server/persistence/run-repository.ts';
import type { NativeRule } from '../src/server/scan/normalization/native-rule-evidence.ts';
import { openRunRepository } from '../src/server/persistence/run-repository.ts';
import { prepareRunningRun } from '../src/server/local-service/input-validation.ts';
import { prepareScanRequest } from '../src/server/scan/scan-request.ts';
import { executeRescanScan, executeScan } from '../src/server/scan/scan-page.ts';
import { executeRescanComparison } from '../src/server/local-service/rescan-comparison.ts';
import { prepareRescan } from '../src/server/local-service/rescan-operation.ts';
import type { ScanOperationDependencies } from '../src/server/local-service/scan-operation.ts';
import { compareControlledScanPair, controlledComparisonFixtures } from './helpers/comparison-fixtures.ts';
import {
  createIntegrationRoot, installManagedFixtureScan, installManagedScan, repo, startBrowserHarness, targetUrl,
} from './helpers/m105-walking-skeleton-harness.ts';

const test = (name: string, run: (context: TestContext) => void | Promise<void>) =>
  nodeTest(name, { concurrency: false, timeout: 120000 }, run);

function readRuns(runRoot: string): Array<{ bytes: Buffer; run: PageAnalysisRun }> {
  return fs.readdirSync(runRoot).sort().map(name => {
    const file = path.join(runRoot, name, 'run.json');
    const bytes = fs.readFileSync(file);
    const checked = validateRun(JSON.parse(bytes.toString('utf8')));
    assert.ok(checked.ok, `Persisted ${name} must satisfy the aggregate run contract`);
    return { bytes, run: checked.value };
  });
}

function assertNoPrivateHandoff(value: unknown): void {
  const forbidden = new Set(['candidate', 'candidates', 'raw', 'comparison', 'comparisons', 'delta', 'score']);
  const visit = (item: unknown): void => {
    if (!item || typeof item !== 'object') return;
    if (Array.isArray(item)) { for (const entry of item) visit(entry); return; }
    for (const [key, child] of Object.entries(item)) {
      assert.equal(forbidden.has(key), false, `Private scanner/comparison field escaped through ${key}`);
      visit(child);
    }
  };
  visit(value);
}

test('built client creates one linked later run through the real service, scanner and disk without mutating its baseline', async t => {
  assert.equal(process.env.A11Y_M501_CAPTURE_PROOF, undefined);
  const harness = await startBrowserHarness(t, 'm501-rescan', 'populated');
  const { page } = harness;
  await page.getByLabel('Target URL').fill(targetUrl);
  await page.getByLabel('Local (recommended)').check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  const initial = readRuns(harness.runRoot);
  assert.equal(initial.length, 1);
  const baseline = initial[0]!;
  assert.equal(baseline.run.status, 'completed');
  assert.equal(baseline.run.providerContext.mode, 'local');
  assert.equal('baselineRunId' in baseline.run, false);
  assert.ok(baseline.run.status === 'completed' && baseline.run.scan.findings.length > 0);

  await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
  await page.getByRole('region', { name: /evidence/i }).waitFor();
  await page.getByLabel('New scan mode', { exact: true }).selectOption('groq');

  t.mock.restoreAll();
  installManagedScan(t, 'zero', harness.scannerCalls);
  const responsePromise = page.waitForResponse(response => {
    const url = new URL(response.url());
    return url.pathname === '/api/rescans' && response.request().method() === 'POST';
  });
  const [, rescanResponse] = await Promise.all([
    page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click(), responsePromise,
  ]);
  assert.equal(rescanResponse.status(), 200);
  const responseBody: unknown = await rescanResponse.json();
  assertNoPrivateHandoff(responseBody);
  assert.deepEqual(Object.keys(responseBody as Record<string, unknown>).sort(), ['ok', 'run']);
  await page.getByText('No automated findings in the three supported checks', { exact: true }).waitFor();

  assert.equal(harness.requests.filter(value => value === 'POST /api/runs').length, 1);
  assert.equal(harness.requests.filter(value => value === 'POST /api/rescans').length, 1);
  assert.equal(harness.requests.some(value => value.startsWith('external:')), false);
  assert.equal(harness.scannerCalls.filter(value => value === 'launch').length, 2);
  assert.equal(harness.scannerCalls.filter(value => value.startsWith('target:')).length, 2);
  assert.equal(harness.scannerCalls.some(value => value.startsWith('unexpected:')), false,
    'Both scans remain inside the controlled target boundary and call no model provider');

  const persisted = readRuns(harness.runRoot);
  assert.equal(persisted.length, 2);
  const preserved = persisted.find(entry => entry.run.runId === baseline.run.runId);
  assert.ok(preserved);
  assert.deepEqual(preserved.bytes, baseline.bytes, 'Intentional rescan must not rewrite the retained baseline bytes');
  const later = persisted.find(entry => entry.run.runId !== baseline.run.runId);
  assert.ok(later);
  assert.equal(later.run.status, 'completed');
  assert.ok(later.run.status === 'completed');
  assert.equal(later.run.baselineRunId, baseline.run.runId);
  assert.equal(later.run.requestedUrl, baseline.run.requestedUrl);
  assert.equal(later.run.providerContext.mode, 'groq');
  assert.notEqual(later.run.runId, baseline.run.runId);
  assert.equal(later.run.scan.findings.length, 0);
  assert.equal(later.run.scan.scannerReviewObservations.length, 0);
  assert.deepEqual(responseBody, { ok: true, run: later.run },
    'The closed HTTP response must be the exact validated durable later run');
  assert.deepEqual(Object.keys(later.run.scan.coverage), ['image-alt', 'label', 'color-contrast']);
  for (const rule of ['image-alt', 'label', 'color-contrast'] as const) {
    assert.equal(later.run.scan.coverage[rule].violations, null);
    assert.equal(later.run.scan.coverage[rule].incomplete, null);
    assert.ok(later.run.scan.coverage[rule].passes !== null || later.run.scan.coverage[rule].inapplicable !== null);
  }
  assertNoPrivateHandoff(later.run);
  const visible = await page.getByRole('main').innerText();
  for (const privateWord of ['candidate', 'comparison', 'delta score']) {
    assert.equal(visible.toLowerCase().includes(privateWord), false);
  }
  assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 1);
  assert.equal(path.resolve(harness.runRoot), path.join(repo, 'temp/m105-integration/m501-rescan'));
});

test('six unchanged controlled buffers reach the actual comparison executor as three declared same-target pairs', async t => {
  const fixtures = controlledComparisonFixtures();
  assert.equal(fixtures.length, 6);
  const runRoot = createIntegrationRoot(t, 'm502-comparison');
  const opened = openRunRepository(runRoot); assert.ok(opened.ok); const repository = opened.value;
  const request = prepareScanRequest(targetUrl, 'local'); assert.ok(request.ok);
  const revision = 'c'.repeat(40);
  for (const baseline of fixtures.filter(item => item.stateRole === 'failing')) {
    const later = fixtures.find(item => item.scenario === baseline.scenario && item.ruleId === baseline.ruleId &&
      item.targetKey === baseline.targetKey && item.stateRole === 'corrected');
    assert.ok(later);
    const calls: string[] = [];
    installManagedFixtureScan(t, baseline, calls);
    const baselineRunning = prepareRunningRun(request.value, revision); assert.ok(baselineRunning);
    const created = repository.create(baselineRunning); assert.ok(created.ok);
    const baselineTerminal = await executeScan(created.value, new AbortController().signal);
    assert.equal(baselineTerminal.status, 'completed');
    const baselinePublished = repository.finish(baselineTerminal); assert.ok(baselinePublished.ok);
    const baselineBytes = fs.readFileSync(path.join(runRoot, baselinePublished.value.runId, 'run.json'));
    t.mock.restoreAll();

    installManagedFixtureScan(t, later, calls);
    const selected = baselinePublished.value.status === 'completed' && baselinePublished.value.scan.findings.find(finding =>
      finding.ruleId === baseline.ruleId && 'value' in finding.locator && finding.locator.value === baseline.expectedLocator);
    assert.ok(selected);
    const prepared = prepareRescan({ runId: `later-${baseline.targetKey}`, baselineRunId: baselinePublished.value.runId,
      findingId: selected.findingId, mode: 'local' }, repository, revision, () => false);
    assert.equal(prepared.ok, true); if (!prepared.ok) continue;
    const dependencies = {
      repository,
      isStopping: () => false, deadlineExpired: () => false, markStopFailed: () => assert.fail('stop failure'),
    } as unknown as ScanOperationDependencies;
    let laterEnvelope: Awaited<ReturnType<typeof executeRescanScan>> | undefined;
    const result = await executeRescanComparison(dependencies, prepared, new AbortController().signal,
      async (run: RunningRun, signal: AbortSignal, rule: NativeRule) =>
        (laterEnvelope = await executeRescanScan(run, signal, rule)));
    assert.equal(result.outcome.ok, true);
    assert.equal(result.comparison.ok, true);
    assert.ok(laterEnvelope && 'candidates' in laterEnvelope);
    const controlled = compareControlledScanPair({ definitionVersion: 'm502-comparison-v1',
      baseline: { scenario: baseline.scenario, ruleId: baseline.ruleId, targetKey: baseline.targetKey,
        revision: baseline.revision, stateRole: baseline.stateRole, run: baselinePublished.value },
      later: { scenario: later.scenario, ruleId: later.ruleId, targetKey: later.targetKey,
        revision: later.revision, stateRole: later.stateRole, run: laterEnvelope.run },
      candidates: laterEnvelope.candidates });
    assert.equal(controlled.kind, 'comparison');
    if (controlled.kind === 'comparison') assert.deepEqual(result.comparison, controlled.result);
    if (result.comparison.ok) {
      assert.equal(result.comparison.value.pair, 'comparable');
      if (result.comparison.value.pair === 'comparable') {
        assert.equal(result.comparison.value.match, 'unique-pass');
        assert.equal(result.comparison.value.outcome, 'resolved');
      }
    }
    assert.equal(calls.filter(value => value === 'launch').length, 2);
    assert.equal(calls.filter(value => value.startsWith('target:')).length, 2);
    assert.equal(calls.some(value => value.startsWith('unexpected:')), false);
    assert.deepEqual(fs.readFileSync(path.join(runRoot, baselinePublished.value.runId, 'run.json')), baselineBytes);
    assertNoPrivateHandoff(result.outcome);
    const laterReadback = repository.read(`later-${baseline.targetKey}`);
    assert.ok(laterReadback.ok);
    assertNoPrivateHandoff(laterReadback.value);
    t.mock.restoreAll();
  }
});
