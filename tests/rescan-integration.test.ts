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
import { assertCanonicalComparisonUi } from './helpers/m504-public-comparison.ts';
import {
  createIntegrationRoot, inspectOwnedRunTree, installManagedFixtureScan, installManagedNativeReport, installManagedScan,
  removeOwnedRun, repo,
  requestJson, startBrowserHarness, targetUrl,
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

function approvedComparisonRun(value: unknown): Extract<PageAnalysisRun, { status: 'completed' }> {
  const checked = validateRun(value);
  assert.ok(checked.ok && checked.value.status === 'completed' && checked.value.comparison,
    'Only a validated completed aggregate may carry the approved saved comparison');
  const { comparison: _comparison, ...scanOnly } = checked.value;
  assertNoPrivateHandoff(scanOnly);
  return checked.value;
}

type ControlledFixture = ReturnType<typeof controlledComparisonFixtures>[number];
type AdverseBranch = 'persistent' | 'missing' | 'ambiguous' | 'profile-mismatch';

function nativeOptions(): Record<string, unknown> {
  return {
    runOnly: { type: 'rule', values: ['image-alt', 'label', 'color-contrast'] }, reporter: 'm103-native-dom-v1',
    resultTypes: ['violations', 'incomplete', 'passes', 'inapplicable'], selectors: true, ancestry: false,
    xpath: false, absolutePaths: false, elementRef: true, iframes: false,
  };
}

function labelNode(locator: string): Record<string, unknown> {
  return {
    any: [{ id: 'explicit-label' }], all: [], none: [],
    capturedDom: { locator: { value: locator }, evidence: {
      elementKind: { value: 'input' }, inputType: { value: 'email' }, nameSources: {
        explicitLabel: { value: false }, implicitLabel: { value: false }, ariaLabel: { value: 'absent' },
        ariaLabelledby: { value: 'absent' }, title: { value: 'absent' }, placeholder: { value: 'absent' },
        presentationalRole: { value: false },
      },
    } },
  };
}

function imageNode(locator: string): Record<string, unknown> {
  return {
    any: [{ id: 'has-alt' }], all: [], none: [],
    capturedDom: { locator: { value: locator }, evidence: {
      elementKind: { value: 'img' }, altState: { value: 'absent' },
    } },
  };
}

function adverseNativeReport(branch: AdverseBranch, locator: string): Record<string, unknown> {
  const labelNodes = branch === 'missing' ? [] : branch === 'ambiguous'
    ? [labelNode(locator), labelNode(locator)] : [labelNode(locator)];
  const violations = [
    ...(labelNodes.length ? [{ id: 'label', nodes: labelNodes }] : []),
    ...(branch === 'persistent' ? [{ id: 'image-alt', nodes: [imageNode(':root > :nth-child(2) > :nth-child(9)')] }] : []),
  ];
  const covered = new Set(violations.map(entry => entry.id));
  const inapplicable = ['image-alt', 'label', 'color-contrast']
    .filter(rule => !covered.has(rule)).map(id => ({ id, nodes: [] }));
  return {
    url: targetUrl, timestamp: new Date(Date.now() + 1000).toISOString(),
    testEngine: { name: 'axe-core', version: '4.13.0' }, toolOptions: nativeOptions(),
    violations, incomplete: [], passes: [], inapplicable,
  };
}

function fixture(ruleId: 'label' | 'color-contrast', stateRole: 'failing' | 'corrected'): ControlledFixture {
  const found = controlledComparisonFixtures().find(item => item.ruleId === ruleId && item.stateRole === stateRole);
  assert.ok(found);
  return found;
}

async function activateBaseline(t: TestContext, harness: Awaited<ReturnType<typeof startBrowserHarness>>,
  failing: ControlledFixture): Promise<{ readonly bytes: Buffer; readonly run: Extract<PageAnalysisRun, { status: 'completed' }>;
    readonly findingId: string }> {
  t.mock.restoreAll();
  installManagedFixtureScan(t, failing, harness.scannerCalls);
  await harness.page.getByLabel('Target URL').fill(targetUrl);
  await harness.page.getByLabel('Local (recommended)').check();
  await harness.page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await harness.page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  const runs = readRuns(harness.runRoot);
  assert.equal(runs.length, 1);
  const baseline = runs[0]!;
  assert.ok(baseline.run.status === 'completed');
  const selected = baseline.run.scan.findings.find(item => item.ruleId === failing.ruleId &&
    'value' in item.locator && item.locator.value === failing.expectedLocator);
  assert.ok(selected, `Frozen ${failing.ruleId} baseline must publish the declared Finding`);
  return { bytes: baseline.bytes, run: baseline.run, findingId: selected.findingId };
}

async function openSelectedFindingByKeyboard(harness: Awaited<ReturnType<typeof startBrowserHarness>>): Promise<void> {
  const button = harness.page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first();
  await button.focus();
  assert.equal(await button.evaluate(node => node === document.activeElement), true);
  await harness.page.keyboard.press('Enter');
  await harness.page.getByRole('region', { name: /evidence/i }).waitFor();
}

async function activateRescanByKeyboard(harness: Awaited<ReturnType<typeof startBrowserHarness>>): Promise<Record<string, unknown>> {
  const mode = harness.page.getByLabel('New scan mode', { exact: true });
  await mode.selectOption('local');
  await mode.focus();
  await harness.page.keyboard.press('Tab');
  const button = harness.page.getByRole('button', { name: 'Start intentional rescan', exact: true });
  assert.equal(await button.evaluate(node => node === document.activeElement), true);
  const responsePromise = harness.page.waitForResponse(response => {
    const url = new URL(response.url());
    return url.pathname === '/api/rescans' && response.request().method() === 'POST';
  });
  await harness.page.keyboard.press('Enter');
  const response = await responsePromise;
  assert.equal(response.status(), 200);
  return await response.json() as Record<string, unknown>;
}

async function assertPublishedComparison(harness: Awaited<ReturnType<typeof startBrowserHarness>>,
  baseline: { readonly bytes: Buffer; readonly run: Extract<PageAnalysisRun, { status: 'completed' }> },
  responseBody: Record<string, unknown>): Promise<{ readonly bytes: Buffer; readonly run: Extract<PageAnalysisRun, { status: 'completed' }> }> {
  assert.deepEqual(Object.keys(responseBody).sort(), ['ok', 'run']);
  assert.equal(responseBody.ok, true);
  const responseRun = approvedComparisonRun(responseBody.run);
  const persisted = readRuns(harness.runRoot);
  assert.equal(persisted.length, 2);
  const baselineReadback = persisted.find(item => item.run.runId === baseline.run.runId);
  const later = persisted.find(item => item.run.runId === responseRun.runId);
  assert.ok(baselineReadback && later);
  assert.deepEqual(baselineReadback.bytes, baseline.bytes, 'Comparison must preserve the complete baseline scan bytes');
  assert.deepEqual(later.run, responseRun, 'HTTP success must equal the validated canonical disk aggregate');
  const get = await requestJson(harness.service.url, 'GET', `/api/runs/${later.run.runId}`);
  assert.equal(get.status, 200);
  assert.deepEqual((get.body as { run: unknown }).run, later.run, 'Service GET must return the same canonical aggregate');
  return { bytes: later.bytes, run: later.run };
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
  assert.deepEqual(Object.keys(responseBody as Record<string, unknown>).sort(), ['ok', 'run']);
  const { run: responseRun, ...responseEnvelope } = responseBody as Record<string, unknown>;
  assertNoPrivateHandoff(responseEnvelope);
  approvedComparisonRun(responseRun);
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
  approvedComparisonRun(later.run);
  const visible = await page.getByRole('main').innerText();
  for (const privateWord of ['candidate', 'delta score']) {
    assert.equal(visible.toLowerCase().includes(privateWord), false);
  }
  await page.getByRole('heading', { name: 'Comparison', exact: true }).waitFor();
  await page.getByText('Comparison saved.', { exact: true }).first().waitFor();
  assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 1);
  assert.equal(path.resolve(harness.runRoot), path.join(repo, 'temp/m105-integration/m501-rescan'));
});

test('native corrected image-alt persists a resolved comparison and remains inspectable after exact baseline deletion', async t => {
  assert.equal(process.env.A11Y_M503_CAPTURE_PROOF, undefined);
  const fixtures = controlledComparisonFixtures();
  const failing = fixtures.find(item => item.scenario === 'informative-image-alt' && item.ruleId === 'image-alt'
    && item.targetKey === 'rd3-image' && item.stateRole === 'failing');
  const corrected = fixtures.find(item => item.scenario === 'informative-image-alt' && item.ruleId === 'image-alt'
    && item.targetKey === 'rd3-image' && item.stateRole === 'corrected');
  assert.ok(failing && corrected);
  assert.equal(failing.sha256, 'bc54dd14df90931d8a5c75544e97a61f15d070550aa8602e850d1255749c308e');
  assert.equal(corrected.sha256, 'e6b9aea2773848540ac247063860690298dc05c886ae29f8627d4e6be93246e1');
  assert.equal(failing.expectedLocator, ':root > :nth-child(2) > :nth-child(1) > :nth-child(3)');
  assert.equal(corrected.expectedLocator, failing.expectedLocator);

  let cleanupRunIds: readonly string[] = [];
  const harness = await startBrowserHarness(t, 'm503-comparison', 'populated', () => cleanupRunIds);
  const { page } = harness;
  t.mock.restoreAll();
  installManagedFixtureScan(t, failing, harness.scannerCalls);
  await page.getByLabel('Target URL').fill(targetUrl);
  await page.getByLabel('Local (recommended)').check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();

  const initial = readRuns(harness.runRoot);
  assert.equal(initial.length, 1);
  const baseline = initial[0]!;
  assert.ok(baseline.run.status === 'completed');
  cleanupRunIds = [baseline.run.runId];
  const selected = baseline.run.scan.findings.find(finding => finding.ruleId === 'image-alt'
    && 'value' in finding.locator && finding.locator.value === failing.expectedLocator);
  assert.ok(selected, 'Frozen failing scan must publish the exact selectable image-alt Finding');
  await page.getByRole('group', { name: 'Image alternatives', exact: true }).getByRole('button').click();
  await page.getByRole('region', { name: /evidence/i }).waitFor();
  await page.getByLabel('New scan mode', { exact: true }).selectOption('local');

  t.mock.restoreAll();
  installManagedFixtureScan(t, corrected, harness.scannerCalls);
  const responsePromise = page.waitForResponse(response => {
    const url = new URL(response.url());
    return url.pathname === '/api/rescans' && response.request().method() === 'POST';
  });
  const [, rescanResponse] = await Promise.all([
    page.getByRole('button', { name: 'Start intentional rescan', exact: true }).click(), responsePromise,
  ]);
  assert.equal(rescanResponse.status(), 200);
  const responseBody = await rescanResponse.json() as Record<string, unknown>;
  assert.deepEqual(Object.keys(responseBody).sort(), ['ok', 'run']);
  assert.equal(responseBody.ok, true);
  const laterResponse = approvedComparisonRun(responseBody.run);
  assert.equal(laterResponse.scan.findings.length, 0);
  assert.ok(laterResponse.comparison && laterResponse.comparison.pair === 'comparable');
  assert.equal(laterResponse.comparison.match, 'unique-pass');
  assert.equal(laterResponse.comparison.outcome, 'resolved');
  assert.equal(laterResponse.comparison.baseline.findingId, selected.findingId);

  await page.getByRole('heading', { name: 'Comparison', exact: true }).waitFor();
  await page.getByText('Comparison saved.', { exact: true }).first().waitFor();
  await page.getByText('No automated findings in the three supported checks', { exact: true }).waitFor();
  await page.getByText('resolved', { exact: true }).waitFor();
  assert.equal(harness.requests.filter(value => value === 'POST /api/runs').length, 1);
  assert.equal(harness.requests.filter(value => value === 'POST /api/rescans').length, 1);
  assert.equal(harness.requests.some(value => value.startsWith('external:')), false);
  assert.equal(harness.scannerCalls.filter(value => value === 'launch').length, 2);
  assert.equal(harness.scannerCalls.filter(value => value.startsWith('target:')).length, 2);
  assert.equal(harness.scannerCalls.some(value => value.startsWith('unexpected:')), false);

  const persisted = readRuns(harness.runRoot);
  assert.equal(persisted.length, 2);
  const baselineReadback = persisted.find(entry => entry.run.runId === baseline.run.runId);
  const later = persisted.find(entry => entry.run.runId === laterResponse.runId);
  assert.ok(baselineReadback && later);
  assert.notEqual(baseline.run.runId, later.run.runId);
  assert.deepEqual(baselineReadback.bytes, baseline.bytes, 'Comparison publication must not rewrite baseline bytes');
  assert.deepEqual(later.run, laterResponse, 'HTTP success must equal the validated canonical disk aggregate');
  cleanupRunIds = [baseline.run.runId, later.run.runId];
  const beforeDeletion = await requestJson(harness.service.url, 'GET', `/api/runs/${later.run.runId}`);
  assert.equal(beforeDeletion.status, 200);
  assert.deepEqual((beforeDeletion.body as Record<string, unknown>).comparisonLineage, { status: 'available' });
  const availableRefresh = page.waitForResponse(response => {
    const url = new URL(response.url());
    return url.pathname === `/api/runs/${later.run.runId}` && response.request().method() === 'GET';
  });
  await page.getByRole('button', { name: 'Return to baseline', exact: true }).click();
  assert.equal((await availableRefresh).status(), 200);
  await page.getByRole('region', { name: 'Results', exact: true })
    .getByText('Baseline evidence — read-only. Return to later results to continue.', { exact: true }).waitFor();

  const owned = inspectOwnedRunTree(harness.runRoot, [baseline.run.runId, later.run.runId]);
  const ownedBaseline = owned.find(item => item.runId === baseline.run.runId);
  const ownedLater = owned.find(item => item.runId === later.run.runId);
  assert.ok(ownedBaseline && ownedLater);
  assert.deepEqual(ownedBaseline.bytes, baseline.bytes);
  assert.deepEqual(ownedLater.bytes, later.bytes);
  t.diagnostic(JSON.stringify({ baseline: { runId: ownedBaseline.runId, path: ownedBaseline.directory,
    sha256: ownedBaseline.sha256 }, later: { runId: ownedLater.runId, path: ownedLater.directory,
    sha256: ownedLater.sha256 } }));
  removeOwnedRun(harness.runRoot, ownedBaseline, [baseline.run.runId, later.run.runId]);
  cleanupRunIds = [later.run.runId];
  assert.deepEqual(inspectOwnedRunTree(harness.runRoot, [later.run.runId])[0]!.bytes, later.bytes,
    'Exact baseline deletion must not change the later comparison bytes');

  const afterDeletion = await requestJson(harness.service.url, 'GET', `/api/runs/${later.run.runId}`);
  assert.equal(afterDeletion.status, 200);
  const afterBody = afterDeletion.body as Record<string, unknown>;
  assert.deepEqual(afterBody.run, later.run);
  assert.deepEqual(afterBody.comparisonLineage, { status: 'unavailable', reason: 'not-found' });
  await page.getByRole('button', { name: 'Return to later results', exact: true }).click();
  await page.getByText('The saved comparison remains available, but its baseline cannot be inspected.',
    { exact: true }).first().waitFor();
  assert.equal(await page.getByRole('button', { name: 'Return to baseline', exact: true }).count(), 0,
    'Broken lineage must remove stale baseline preview navigation');
  assert.equal(await page.getByRole('heading', { name: 'Comparison', exact: true }).count(), 1);
  assert.equal(await page.getByText('Comparison saved.', { exact: true }).count() > 0, true);
  assert.equal(await page.getByText('resolved', { exact: true }).count() > 0, true);
  assert.deepEqual(fs.readFileSync(ownedLater.file), later.bytes);
  await harness.close();
});

test('native corrected label and contrast cross the actual service, HTTP, disk and built comparison UI', async t => {
  assert.equal(process.env.A11Y_M504_CAPTURE_PROOF === undefined || process.env.A11Y_M504_CAPTURE_PROOF === '1', true);
  for (const ruleId of ['label', 'color-contrast'] as const) {
    let cleanupRunIds: readonly string[] = [];
    const harness = await startBrowserHarness(t, `m504-${ruleId === 'label' ? 'label' : 'contrast'}`, 'populated',
      () => cleanupRunIds);
    const failing = fixture(ruleId, 'failing');
    const corrected = fixture(ruleId, 'corrected');
    const baseline = await activateBaseline(t, harness, failing);
    cleanupRunIds = [baseline.run.runId];
    await openSelectedFindingByKeyboard(harness);
    t.mock.restoreAll();
    installManagedFixtureScan(t, corrected, harness.scannerCalls);
    const responseBody = await activateRescanByKeyboard(harness);
    const later = await assertPublishedComparison(harness, baseline, responseBody);
    cleanupRunIds = [baseline.run.runId, later.run.runId];
    assert.equal(later.run.baselineRunId, baseline.run.runId);
    assert.ok(later.run.comparison && later.run.comparison.pair === 'comparable');
    assert.equal(later.run.comparison.baseline.findingId, baseline.findingId);
    assert.equal(later.run.comparison.match, 'unique-pass');
    assert.equal(later.run.comparison.outcome, 'resolved');
    assert.equal(later.run.scan.findings.length, 0);
    await assertCanonicalComparisonUi(harness.page, later.run);
    await harness.page.getByRole('status').getByText('Comparison saved.', { exact: true }).waitFor();
    const returnBaseline = harness.page.getByRole('button', { name: 'Return to baseline', exact: true });
    await returnBaseline.focus();
    await harness.page.keyboard.press('Enter');
    await harness.page.getByRole('region', { name: 'Results', exact: true })
      .getByText('Baseline evidence — read-only. Return to later results to continue.', { exact: true }).waitFor();
    const returnLater = harness.page.getByRole('button', { name: 'Return to later results', exact: true });
    await returnLater.focus();
    await harness.page.keyboard.press('Enter');
    await harness.page.getByRole('heading', { name: 'Comparison', exact: true }).waitFor();
    if (ruleId === 'label' && process.env.A11Y_M504_CAPTURE_PROOF === '1') {
      const proofRoot = path.join(repo, 'temp/m504-ui-proof-02');
      assert.equal(fs.existsSync(proofRoot), false, 'M504 proof output must be fresh');
      fs.mkdirSync(proofRoot, { recursive: false });
      await harness.page.setViewportSize({ width: 1366, height: 900 });
      await harness.page.getByRole('heading', { name: 'Comparison', exact: true }).scrollIntoViewIfNeeded();
      await returnBaseline.focus();
      assert.equal(await returnBaseline.evaluate(node => node === document.activeElement), true);
      await harness.page.screenshot({ path: path.join(proofRoot, 'comparison-desktop.png'), fullPage: true });
      await harness.page.setViewportSize({ width: 390, height: 844 });
      await harness.page.getByRole('heading', { name: 'Comparison', exact: true }).scrollIntoViewIfNeeded();
      await returnBaseline.focus();
      assert.equal(await returnBaseline.evaluate(node => node === document.activeElement), true);
      await harness.page.screenshot({ path: path.join(proofRoot, 'comparison-narrow.png'), fullPage: true });
    }
    assert.equal(harness.requests.some(value => /retriev|generat|review/i.test(value)), false,
      'Comparison proof must not activate downstream provider work');
    const owned = inspectOwnedRunTree(harness.runRoot, cleanupRunIds);
    const ownedBaseline = owned.find(item => item.runId === baseline.run.runId);
    const ownedLater = owned.find(item => item.runId === later.run.runId);
    assert.ok(ownedBaseline && ownedLater);
    t.diagnostic(JSON.stringify({ ruleId, baseline: { runId: ownedBaseline.runId, sha256: ownedBaseline.sha256 },
      later: { runId: ownedLater.runId, sha256: ownedLater.sha256 } }));
    await harness.close();
    t.mock.restoreAll();
  }
});

test('constructed scanner inputs publish persistent, missing, ambiguous and profile-mismatch comparisons', async t => {
  const failing = fixture('label', 'failing');
  for (const branch of ['persistent', 'missing', 'ambiguous', 'profile-mismatch'] as const) {
    let cleanupRunIds: readonly string[] = [];
    const harness = await startBrowserHarness(t, `m504-${branch === 'profile-mismatch' ? 'profile' : branch}`,
      'populated', () => cleanupRunIds);
    const baseline = await activateBaseline(t, harness, failing);
    cleanupRunIds = [baseline.run.runId];
    await openSelectedFindingByKeyboard(harness);
    t.mock.restoreAll();
    installManagedNativeReport(t, failing, adverseNativeReport(branch, failing.expectedLocator), harness.scannerCalls,
      branch === 'profile-mismatch' ? '150.0.0.0' : '151.0.7922.34');
    const responseBody = await activateRescanByKeyboard(harness);
    const later = await assertPublishedComparison(harness, baseline, responseBody);
    cleanupRunIds = [baseline.run.runId, later.run.runId];
    const comparison = later.run.comparison;
    assert.ok(comparison);
    assert.equal(comparison.baseline.findingId, baseline.findingId);
    if (branch === 'profile-mismatch') {
      assert.equal(comparison.pair, 'not-comparable');
      if (comparison.pair === 'not-comparable') {
        assert.deepEqual(comparison.mismatches, ['browser-version']);
        assert.equal(comparison.reason, 'pair-mismatch');
        assert.equal(Object.hasOwn(comparison, 'match'), false, 'Profile mismatch must skip target correlation');
      }
    } else {
      assert.equal(comparison.pair, 'comparable');
      if (comparison.pair === 'comparable') {
        const expectedMatch = branch === 'persistent' ? 'unique-violation'
          : branch === 'missing' ? 'no-exact-match' : 'ambiguous';
        assert.equal(comparison.match, expectedMatch);
        assert.equal(comparison.outcome, branch === 'persistent' ? 'persistent' : 'inconclusive');
        assert.equal(comparison.reason, branch === 'persistent' ? 'binary-still-failing' : expectedMatch);
        assert.equal(Object.hasOwn(comparison, 'after'), branch === 'persistent',
          'Only the positive persistent observation may publish after-evidence');
      }
    }
    if (branch === 'persistent') {
      assert.equal(later.run.scan.findings.some(item => item.ruleId === 'image-alt'), true,
        'A later-only Finding must remain in the canonical scan alongside the comparison');
      const imageGroup = harness.page.getByRole('group', { name: 'Image alternatives', exact: true });
      await imageGroup.getByRole('button').waitFor();
      assert.equal(await imageGroup.getByText(/new|regressed/i).count(), 0,
        'Later-only Findings remain Findings and are not relabeled as comparison outcomes');
    }
    await assertCanonicalComparisonUi(harness.page, later.run);
    assert.equal(harness.requests.some(value => /retriev|generat|review/i.test(value)), false);
    const owned = inspectOwnedRunTree(harness.runRoot, cleanupRunIds);
    const ownedBaseline = owned.find(item => item.runId === baseline.run.runId);
    const ownedLater = owned.find(item => item.runId === later.run.runId);
    assert.ok(ownedBaseline && ownedLater);
    t.diagnostic(JSON.stringify({ branch, baseline: { runId: ownedBaseline.runId, sha256: ownedBaseline.sha256 },
      later: { runId: ownedLater.runId, sha256: ownedLater.sha256 } }));
    await harness.close();
    t.mock.restoreAll();
  }
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
