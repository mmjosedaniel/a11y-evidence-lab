import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import nodeTest from 'node:test';
import type { TestContext } from 'node:test';
import { loadClientResponses } from '../src/server/local-service/client-assets.ts';
import { createLoopbackApiServer } from '../src/server/local-service/loopback-api.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { startLocalService } from '../src/server/service.ts';
import { failedRun } from './helpers/m102-run-fixture.ts';
import {
  abortPartialRequest, clientRoot, deferred, portClosed, readOnlyRun, repo, requestBytes, requestJson,
  startBrowserHarness, startConfiguredService, targetUrl,
} from './helpers/m105-walking-skeleton-harness.ts';

const test = (name: string, run: (context: TestContext) => void | Promise<void>) =>
  nodeTest(name, { concurrency: false, timeout: 120000 }, run);
const revision = 'a'.repeat(40);

async function assertShutdownStatusProjection(): Promise<void> {
  const candidate = failedRun('run-shutdown-projection');
  const checked = validateRun({ ...candidate, failure: { category: 'shutdown' } });
  assert.ok(checked.ok && checked.value.status === 'failed');
  const outcome = { ok: false as const, error: 'shutdown' as const, run: checked.value,
    persisted: true, cleanupFailed: false };
  const server = createLoopbackApiServer({ isStopping: () => false, isBusy: () => false,
    readRun: () => ({ ok: false, error: 'not-found' }), runScan: async () => outcome });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    const response = await requestJson(origin, 'POST', '/api/runs',
      JSON.stringify({ requestedUrl: targetUrl, mode: 'local' }), 'application/json');
    assert.equal(response.status, 503);
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
    assert.equal(response.headers['content-type'], 'application/json;charset=utf-8');
    assert.deepEqual(response.body, outcome);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await portClosed(origin);
  }
}

async function submit(page: Awaited<ReturnType<typeof startBrowserHarness>>['page'], mode: 'local' | 'groq'): Promise<void> {
  await page.getByLabel('Target URL').fill(targetUrl);
  await page.getByLabel(mode === 'local' ? 'Local (recommended)' : 'Groq').check();
  await page.getByRole('button', { name: 'Analyze' }).click();
  await page.getByRole('heading', { name: 'Results', level: 2 }).waitFor();
}

test('served production client submits Local through same-origin HTTP, real scanning, disk, reread and Results', async t => {
  const harness = await startBrowserHarness(t, 'local-populated', 'populated');
  const { page } = harness;
  assert.equal(await page.getByRole('radio').count(), 2);
  assert.equal(await page.getByRole('radio').first().isChecked(), false);
  assert.equal(await page.getByRole('radio').last().isChecked(), false);
  await page.getByLabel('Target URL').fill(targetUrl);
  await page.getByRole('button', { name: 'Analyze' }).click();
  await page.getByRole('group', { name: 'Generation mode' })
    .getByText('Choose Local or Groq.', { exact: true }).waitFor();
  assert.equal(harness.requests.filter(value => value === 'POST /api/runs').length, 0,
    'Validation-only feedback must send no request');

  await page.getByLabel('Local (recommended)').check();
  await page.getByRole('button', { name: 'Analyze' }).click();
  await page.getByRole('heading', { name: 'Results', level: 2 }).waitFor();
  await page.getByText(/findings? need review/).waitFor();
  await page.getByText(/items? need manual review/).waitFor();
  assert.equal(harness.requests.filter(value => value === 'POST /api/runs').length, 1);
  assert.equal(harness.requests.some(value => value.startsWith('external:')), false);
  assert.equal(harness.scannerCalls.filter(value => value === 'launch').length, 1);
  assert.equal(harness.scannerCalls.filter(value => value.startsWith('target:')).length, 1);
  assert.equal(harness.scannerCalls.some(value => value.startsWith('unexpected:')), false,
    'No provider or unrelated network request is permitted');

  const persisted = readOnlyRun(harness.runRoot);
  assert.equal(persisted.status, 'completed');
  assert.equal(persisted.providerContext.mode, 'local');
  assert.equal(persisted.requestedUrl, targetUrl);
  assert.ok(persisted.status === 'completed' && persisted.scan.findings.length >= 2);
  assert.ok(persisted.status === 'completed' && persisted.scan.scannerReviewObservations.length >= 1);
  const reread = await requestJson(harness.service.url, 'GET', `/api/runs/${persisted.runId}`);
  assert.equal(reread.status, 200);
  assert.deepEqual((reread.body as { run: unknown }).run, persisted);
});

test('served production client submits Groq through the same path and presents a durable valid zero', async t => {
  const harness = await startBrowserHarness(t, 'groq-zero', 'zero');
  await submit(harness.page, 'groq');
  await harness.page.getByText('No automated findings in the three supported checks').waitFor();
  assert.equal(harness.requests.filter(value => value === 'POST /api/runs').length, 1);
  assert.equal(harness.scannerCalls.some(value => value.startsWith('unexpected:')), false);
  const persisted = readOnlyRun(harness.runRoot);
  assert.equal(persisted.providerContext.mode, 'groq');
  assert.ok(persisted.status === 'completed');
  assert.equal(persisted.scan.findings.length, 0);
  assert.equal(persisted.scan.scannerReviewObservations.length, 0);
  assert.deepEqual(Object.keys(persisted.scan.coverage), ['image-alt', 'label', 'color-contrast']);
  for (const rule of ['image-alt', 'label', 'color-contrast'] as const) {
    assert.equal(persisted.scan.coverage[rule].violations, null);
    assert.equal(persisted.scan.coverage[rule].incomplete, null);
    assert.ok(persisted.scan.coverage[rule].passes !== null || persisted.scan.coverage[rule].inapplicable !== null,
      `${rule} must retain at least one observed native zero bucket`);
  }
});

test('served production client admits a persisted navigation failure without zero or partial success', async t => {
  const harness = await startBrowserHarness(t, 'navigation-failure', 'navigation-failure');
  await submit(harness.page, 'local');
  await harness.page.getByRole('heading', { name: 'Analysis could not be completed', level: 3 }).waitFor();
  await harness.page.getByText('The requested page could not be opened.').waitFor();
  assert.equal(await harness.page.getByText('No automated findings in the three supported checks').count(), 0);
  const persisted = readOnlyRun(harness.runRoot);
  assert.equal(persisted.status, 'failed');
  assert.ok(persisted.status === 'failed');
  assert.deepEqual(persisted.failure, { category: 'navigation' });
  assert.equal(Object.hasOwn(persisted, 'scan'), false);
});

test('configured transport is closed, exact and lifecycle-safe while API-only construction stays read-only', async t => {
  const responses = loadClientResponses(clientRoot);
  const responseSnapshot = Buffer.from(responses['/']!.body);
  const exposedBody = responses['/index.html']!.body;
  exposedBody[0] = exposedBody[0]! ^ 0xff;
  const mutationIsolation = responses['/']!.body.equals(responseSnapshot);

  const integrationRoot = path.join(repo, 'temp/m105-integration');
  const fixtureRoot = path.join(integrationRoot, 'linked-assets');
  const realAssets = path.join(fixtureRoot, 'real-assets');
  const linkedAssets = path.join(fixtureRoot, 'assets');
  const linkedRunRoot = path.join(fixtureRoot, 'runs');
  let linkedStarted: Awaited<ReturnType<typeof startLocalService>> | undefined;
  let linkedRejectionNoStorage = false;
  try {
    fs.mkdirSync(realAssets, { recursive: true });
    fs.writeFileSync(path.join(fixtureRoot, 'index.html'),
      '<!doctype html><script type="module" src="/assets/app.js"></script>');
    fs.writeFileSync(path.join(realAssets, 'app.js'), 'export {};');
    fs.symlinkSync(realAssets, linkedAssets, 'junction');
    linkedStarted = await startLocalService({ runRoot: linkedRunRoot, applicationRevision: revision,
      clientRoot: fixtureRoot });
    linkedRejectionNoStorage = !linkedStarted.ok && linkedStarted.error === 'client-unavailable' &&
      !fs.existsSync(linkedRunRoot);
    if (linkedStarted.ok) {
      await linkedStarted.service.stop();
      linkedStarted = undefined;
    }
  } finally {
    if (linkedStarted?.ok) await linkedStarted.service.stop();
    if (fs.existsSync(linkedAssets)) fs.unlinkSync(linkedAssets);
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
    assert.deepEqual(fs.readdirSync(integrationRoot), []);
  }
  assert.deepEqual({ mutationIsolation, linkedRejectionNoStorage },
    { mutationIsolation: true, linkedRejectionNoStorage: true },
    'Client responses must isolate body mutations and reject linked asset ancestors before storage');

  const apiRoot = path.join(repo, 'temp/m105-integration/api-only');
  fs.mkdirSync(apiRoot);
  const apiStarted = await startLocalService({ runRoot: apiRoot, applicationRevision: revision });
  assert.ok(apiStarted.ok);
  t.after(async () => {
    if (apiStarted.ok) await apiStarted.service.stop();
    fs.rmSync(apiRoot, { recursive: true, force: true });
  });
  const apiHealth = await requestJson(apiStarted.service.url, 'GET', '/api/health');
  assert.deepEqual((apiHealth.body as { capabilities: unknown }).capabilities, { readRuns: true, scan: false });
  const apiPost = await requestJson(apiStarted.service.url, 'POST', '/api/runs', '{}', 'application/json');
  assert.equal(apiPost.status, 405);

  await apiStarted.service.stop();
  fs.rmSync(apiRoot, { recursive: true });
  const release = deferred();
  const calls: string[] = [];
  const harness = await startConfiguredService(t, 'direct-transport', 'blocked', calls, release.promise);
  fs.writeFileSync(path.join(harness.runRoot, 'sibling.canary'), 'preserve');
  const health = await requestJson(harness.service.url, 'GET', '/api/health');
  assert.deepEqual((health.body as { capabilities: unknown }).capabilities, { readRuns: true, scan: true });
  for (const response of [health]) {
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
    assert.equal(response.headers['content-type'], 'application/json;charset=utf-8');
  }

  const index = await requestBytes(harness.service.url, '/');
  assert.equal(index.status, 200);
  assert.equal(index.headers['content-type'], 'text/html;charset=utf-8');
  assert.deepEqual(index.body, fs.readFileSync(path.join(clientRoot, 'index.html')));
  const html = index.body.toString('utf8');
  const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#/]+\.(?:js|css))"/g)].map(match => match[1]!);
  assert.ok(assetPaths.some(asset => asset.endsWith('.js')));
  for (const asset of assetPaths) {
    const response = await requestBytes(harness.service.url, asset);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, fs.readFileSync(path.join(clientRoot, asset.slice(1))));
  }
  assert.equal((await requestJson(harness.service.url, 'GET', '/assets/missing.js')).status, 404);
  assert.equal((await requestJson(harness.service.url, 'GET', '/unknown')).status, 404);

  for (const [contentType, body] of [[undefined, '{}'], ['application/json; charset=utf-8', '{}'],
    ['text/plain', '{}'], ['application/json', '{'], ['application/json', '{}'],
    ['application/json', JSON.stringify({ requestedUrl: targetUrl, mode: 'local', extra: true })]] as const) {
    const response = await requestJson(harness.service.url, 'POST', '/api/runs', body, contentType);
    assert.equal(response.status, 400);
  }
  const beforeAbortCalls = [...calls];
  await abortPartialRequest(t, harness.service.url);
  assert.deepEqual(calls, beforeAbortCalls, 'Aborted intake must not launch a scanner or contact a provider');
  assert.deepEqual(fs.readdirSync(harness.runRoot), ['sibling.canary']);
  assert.equal(fs.readFileSync(path.join(harness.runRoot, 'sibling.canary'), 'utf8'), 'preserve');
  const afterAbortHealth = await requestJson(harness.service.url, 'GET', '/api/health');
  assert.equal(afterAbortHealth.status, 200);
  assert.deepEqual(afterAbortHealth.body, { status: 'ready', busy: false,
    capabilities: { readRuns: true, scan: true } });

  const first = requestJson(harness.service.url, 'POST', '/api/runs',
    JSON.stringify({ requestedUrl: targetUrl, mode: 'local' }), ' Application/JSON ')
    .then(response => ({ response }), error => ({ error }));
  while (!calls.some(value => value.startsWith('target:'))) await new Promise(resolve => setImmediate(resolve));
  const busy = await requestJson(harness.service.url, 'POST', '/api/runs',
    JSON.stringify({ requestedUrl: targetUrl, mode: 'groq' }), 'application/json');
  assert.equal(busy.status, 409);
  const stopping = harness.service.stop();
  release.resolve();
  const disconnected = await first;
  assert.ok('error' in disconnected && (disconnected.error as NodeJS.ErrnoException).code === 'ECONNRESET',
    'Immediate stop must disconnect the admitted HTTP request');
  assert.deepEqual(await stopping, { ok: true, status: 'stopped' });
  await portClosed(harness.service.url);
  const stoppedRun = readOnlyRun(harness.runRoot, ['sibling.canary']);
  assert.equal(stoppedRun.status, 'failed');
  assert.ok(stoppedRun.status === 'failed');
  assert.deepEqual(stoppedRun.failure, { category: 'shutdown' });
  assert.equal(stoppedRun.scanContext.cleanup, 'closed');
  assert.equal(fs.readFileSync(path.join(harness.runRoot, 'sibling.canary'), 'utf8'), 'preserve');

  await assertShutdownStatusProjection();

  const missing = await startLocalService({ runRoot: harness.runRoot, applicationRevision: revision,
    clientRoot: path.join(repo, 'temp/m105-integration/missing-client') });
  assert.deepEqual(missing, { ok: false, error: 'client-unavailable' });
});

const stylesheetCases = [
  { name: 'quoted with boolean Vite attributes', link: '<link rel="stylesheet" crossorigin href="/assets/app.css">', accepted: true },
  { name: 'unquoted relation', link: '<link rel=stylesheet href="/assets/app.css">', accepted: true },
  { name: 'unquoted href', link: '<link rel="stylesheet" href=/assets/app.css>', accepted: true },
  { name: 'fully unquoted with boolean Vite attributes', link: '<link rel=stylesheet crossorigin href=/assets/app.css>', accepted: true },
  { name: 'external unquoted stylesheet', link: '<link rel=stylesheet href=https://example.invalid/app.css>', accepted: false },
  { name: 'missing unquoted stylesheet', link: '<link rel=stylesheet href=/assets/missing.css>', accepted: false },
  { name: 'absent stylesheet href', link: '<link rel=stylesheet>', accepted: false },
  { name: 'malformed nested stylesheet', link: '<link rel=stylesheet href=/assets/nested/app.css>', accepted: false },
  { name: 'duplicate mixed relation attribute', link: '<link rel=alternate rel="stylesheet" href="/assets/app.css">', accepted: false },
  { name: 'duplicate mixed href attribute', link: '<link rel="stylesheet" href=/assets/app.css href="/assets/app.css">', accepted: false },
  { name: 'duplicate stylesheet references', link: '<link rel=stylesheet href=/assets/app.css><link rel="stylesheet" href="/assets/app.css">', accepted: false },
] as const;

for (const [index, scenario] of stylesheetCases.entries()) {
  test(`configured startup validates ${scenario.name}`, async t => {
    const scratch = path.join(repo, 'temp/m105-integration');
    assert.deepEqual(fs.readdirSync(scratch), []);
    const fixture = path.join(scratch, `stylesheet-${index}`);
    const root = path.join(fixture, 'client');
    const runRoot = path.join(fixture, 'runs');
    const css = Buffer.from('body { color: rgb(1, 2, 3); }\n');
    let started: Awaited<ReturnType<typeof startLocalService>> | undefined;
    let listenerConstructions = 0;
    const originalCreateServer = http.createServer;
    const listener = t.mock.method(http, 'createServer', (...args: unknown[]) => {
      listenerConstructions++;
      return Reflect.apply(originalCreateServer, http, args);
    });
    try {
      fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
      fs.writeFileSync(path.join(root, 'index.html'),
        '<!doctype html><script type="module" crossorigin src="/assets/app.js"></script>' + scenario.link);
      fs.writeFileSync(path.join(root, 'assets/app.js'), 'export {};');
      fs.writeFileSync(path.join(root, 'assets/app.css'), css);
      fs.writeFileSync(path.join(fixture, 'sibling.canary'), 'preserve');
      started = await startLocalService({ runRoot, applicationRevision: revision, clientRoot: root });
      if (scenario.accepted) {
        assert.ok(started.ok, 'Ordinary local stylesheet syntax must start');
        const response = await requestBytes(started.service.url, '/assets/app.css');
        assert.equal(response.status, 200);
        assert.equal(response.headers['content-type'], 'text/css;charset=utf-8');
        assert.deepEqual(response.body, css);
        assert.deepEqual(Object.keys(loadClientResponses(root)).sort(),
          ['/', '/assets/app.css', '/assets/app.js', '/index.html']);
        assert.equal((await requestJson(started.service.url, 'GET', '/assets/unlisted.css')).status, 404);
      } else {
        assert.deepEqual({ result: started.ok ? 'ready' : started.error,
          storageCreated: fs.existsSync(runRoot), listenerConstructions },
        { result: 'client-unavailable', storageCreated: false, listenerConstructions: 0 });
      }
      assert.equal(fs.readFileSync(path.join(fixture, 'sibling.canary'), 'utf8'), 'preserve');
    } finally {
      if (started?.ok) {
        assert.deepEqual(await started.service.stop(), { ok: true, status: 'stopped' });
        await portClosed(started.service.url);
      }
      listener.mock.restore();
      if (fs.existsSync(fixture)) {
        assert.equal(path.dirname(fixture), scratch);
        assert.ok(fs.lstatSync(fixture).isDirectory() && !fs.lstatSync(fixture).isSymbolicLink());
        fs.rmSync(fixture, { recursive: true });
      }
      assert.deepEqual(fs.readdirSync(scratch), []);
    }
  });
}
