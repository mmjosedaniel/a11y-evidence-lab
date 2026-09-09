import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import type { Browser, BrowserContext } from 'playwright';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { openRunRepository } from '../../src/server/persistence/run-repository.ts';
import { resolveFindingCitations } from '../../src/server/retrieval/corpus-catalog.ts';
import { startLocalService } from '../../src/server/service.ts';
import type { LocalService } from '../../src/server/service.ts';
import { completedRun, runningRun } from './m102-run-fixture.ts';

const repo = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const proofRoot = path.join(repo, 'temp/m203-real-01');
const runRoot = path.join(proofRoot, 'runs');
const clientRoot = path.join(repo, 'dist/client');
const uiScratch = path.join(repo, 'temp/m104-ui');
const targetUrl = 'https://m105.test/';
const runId = 'm203-real-01';
const findingId = 'finding-0';

function ordinary(target: string, allowMissing = false): void {
  const full = path.resolve(target);
  assert.ok(full.startsWith(repo + path.sep), 'Owned path must remain inside the repository');
  let current = full;
  let first = true;
  for (;;) {
    if (fs.existsSync(current)) {
      const stat = fs.lstatSync(current);
      assert.equal(stat.isSymbolicLink(), false, 'No reparse traversal is permitted');
      if (first && !allowMissing) assert.ok(stat.isDirectory() || stat.isFile());
      assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase());
    } else if (!allowMissing || !first) {
      assert.fail(`Required ordinary ancestor is missing: ${current}`);
    }
    if (current === repo) return;
    current = path.dirname(current);
    first = false;
  }
}

function sha256(file: string): string {
  ordinary(file);
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function inventory(root: string): Record<string, string> {
  ordinary(root);
  const output: Record<string, string> = {};
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
        output[path.relative(repo, child).replaceAll('\\', '/')] = sha256(child);
      }
    }
  }
  return output;
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(5000, () => { socket.destroy(); reject(new Error('Port closure is uncertain')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned application port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

function seed(revision: string): unknown {
  const repository = openRunRepository(runRoot);
  assert.ok(repository.ok);
  const running = structuredClone(runningRun(runId, 'local')) as any;
  running.applicationRevision = revision;
  running.requestedUrl = targetUrl;
  const created = repository.value.create(running);
  assert.ok(created.ok);
  const complete = structuredClone(completedRun(runId, 'local')) as any;
  complete.applicationRevision = revision;
  complete.requestedUrl = targetUrl;
  const finished = repository.value.finish(complete);
  assert.ok(finished.ok);
  return finished.value;
}

function withoutSelectedDownstream(input: unknown): unknown {
  const projected = structuredClone(input) as any;
  const selected = projected.scan.findings.find((finding: any) => finding.findingId === findingId);
  assert.ok(selected);
  selected.state = 'unprocessed';
  delete selected.retrieval;
  delete selected.analysis;
  delete selected.result;
  return projected;
}

async function run(revision: string): Promise<void> {
  assert.match(revision, /^[0-9a-f]{40}$/);
  assert.equal(process.cwd().toLowerCase(), repo.toLowerCase());
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), revision);
  ordinary(proofRoot, true);
  assert.equal(fs.existsSync(proofRoot), false, 'The single-use proof root must be absent');
  ordinary(clientRoot);
  assert.ok(fs.existsSync(path.join(clientRoot, 'index.html')), 'Accepted client build is required');
  ordinary(uiScratch);
  assert.deepEqual(fs.readdirSync(uiScratch), [], 'UI scratch must begin empty');
  fs.mkdirSync(proofRoot);
  fs.mkdirSync(runRoot);

  const durableSeed = seed(revision);
  fs.writeFileSync(path.join(proofRoot, 'seed.json'), JSON.stringify(durableSeed, null, 2) + '\n', { flag: 'wx' });
  const sourceIdentity = inventory(path.join(repo, 'src'));
  const testIdentity = inventory(path.join(repo, 'tests'));
  const buildIdentity = inventory(clientRoot);
  const corpusIdentity = inventory(path.join(repo, 'corpus/wcag22-mvp-v1'));
  let service: LocalService | undefined;
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let serviceUrl = '';
  const requests: string[] = [];
  const rejectedOrigins: string[] = [];
  let receipt: Record<string, unknown> | undefined;
  let bodyError: unknown;
  const cleanup = { contextClosed: false, browserClosed: false, serviceStopped: false,
    portClosed: false, uiScratchRestored: false, developerRuntimeControlActions: 0 };
  let timedOut = false;
  const deadline = setTimeout(() => {
    timedOut = true;
    void context?.close();
  }, 330000);
  deadline.unref();
  try {
    const started = await startLocalService({ runRoot, applicationRevision: revision, clientRoot });
    assert.ok(started.ok);
    service = started.service;
    serviceUrl = service.url;
    browser = await chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 });
    context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false,
      serviceWorkers: 'block' });
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin !== serviceUrl) {
        rejectedOrigins.push(url.origin);
        await route.abort();
        return;
      }
      if (request.method() === 'POST' && url.pathname === '/api/runs') {
        const body = request.postDataJSON() as Record<string, unknown>;
        assert.deepEqual(body, { requestedUrl: targetUrl, mode: 'local' });
        requests.push('POST /api/runs intercepted');
        await route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: true, run: durableSeed }) });
        return;
      }
      await route.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(300000);
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.origin === serviceUrl && request.method() === 'POST' && url.pathname === '/api/finding-guidance')
        requests.push('POST /api/finding-guidance');
    });
    await page.goto(serviceUrl);
    await page.getByLabel('Target URL').fill(targetUrl);
    await page.getByLabel('Local (recommended)').check();
    await page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
    await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
    const responsePromise = page.waitForResponse(response => {
      const url = new URL(response.url());
      return url.origin === serviceUrl && response.request().method() === 'POST'
        && url.pathname === '/api/finding-guidance';
    });
    await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    const responseBody = await response.json() as { ok: unknown; run: unknown; view: unknown };
    assert.equal(responseBody.ok, true);
    assert.deepEqual(requests, ['POST /api/runs intercepted', 'POST /api/finding-guidance']);
    assert.deepEqual(rejectedOrigins, []);
    const canonicalPath = path.join(runRoot, runId, 'run.json');
    const readback = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as unknown;
    const checked = validateRun(readback);
    assert.ok(checked.ok && checked.value.status === 'completed');
    assert.deepEqual(responseBody.run, readback);
    assert.deepEqual(withoutSelectedDownstream(readback), durableSeed,
      'Guidance may change only the selected Finding downstream workflow fields');
    const selected = checked.value.scan.findings.find(finding => finding.findingId === findingId);
    assert.ok(selected && 'analysis' in selected && selected.analysis.status === 'completed');
    const reopened = openRunRepository(runRoot);
    assert.ok(reopened.ok);
    const repositoryReadback = reopened.value.read(runId);
    assert.ok(repositoryReadback.ok);
    assert.deepEqual(repositoryReadback.value, readback);
    const serviceReadback = service.readRun(runId);
    if (selected.state === 'active') assert.deepEqual(serviceReadback, { ok: false, error: 'busy' });
    else {
      assert.ok(serviceReadback.ok && !serviceReadback.interrupted);
      assert.deepEqual(serviceReadback.run, readback);
    }
    const initialFinding = (durableSeed as any).scan.findings.find((finding: any) => finding.findingId === findingId);
    assert.ok(initialFinding && 'retrieval' in selected && selected.retrieval.status === 'completed');
    const expectedView = await resolveFindingCitations(initialFinding, selected.retrieval.result);
    assert.ok(expectedView.ok);
    assert.deepEqual(responseBody.view, { runId, findingId, ...expectedView.value });
    const supportState = 'support' in selected.retrieval ? selected.retrieval.support.state : null;
    const detail = page.getByRole('region', { name: / evidence$/i });
    if (supportState === 'supported') {
      assert.equal(selected.state, 'active');
      await detail.getByText('Eligible for generation', { exact: true }).waitFor();
    } else {
      assert.equal(selected.state, 'abstained');
      await detail.getByText('No proposal generated', { exact: true }).waitFor();
      assert.ok('result' in selected);
      await detail.getByText(selected.result.explanation, { exact: true }).waitFor();
      await detail.getByText('No generation provider was called', { exact: true }).waitFor();
    }
    for (const passage of expectedView.value.passages)
      await detail.getByText(passage.text, { exact: true }).waitFor();
    const displayedHrefs = await detail.locator('a').evaluateAll(links => links.map(link => (link as HTMLAnchorElement).href));
    for (const passage of expectedView.value.passages) assert.ok(displayedHrefs.includes(passage.url));
    for (const notice of expectedView.value.notices)
      await detail.getByText(notice.text, { exact: true }).waitFor();
    await page.screenshot({ path: path.join(proofRoot, 'desktop.png') });
    await page.setViewportSize({ width: 320, height: 800 });
    await page.screenshot({ path: path.join(proofRoot, 'narrow.png') });
    assert.equal(timedOut, false, 'The single proof exceeded its 330000 ms outer deadline');
    receipt = {
      revision, browser: browser.version(), sourceIdentity, testIdentity, buildIdentity, corpusIdentity,
      input: { runId, findingId, requestedUrl: targetUrl, mode: 'local' },
      outcome: { state: selected.state, support: 'retrieval' in selected && selected.retrieval.status === 'completed'
        && 'support' in selected.retrieval ? selected.retrieval.support.state : null },
      preservation: { returnedRunEqualsDisk: true, repositoryReadEqualsDisk: true,
        serviceRead: selected.state === 'active' ? 'expected-busy-retained-owner' : 'equals-disk',
        parentProviderContextNativeSiblingsAndObservationsComparedByStrippedSelectedDownstreamEquality: true,
        responseViewEqualsFreshCanonicalResolution: true },
      readbackSha256: sha256(canonicalPath), requests,
    };
  } catch (error) {
    bodyError = error;
  } finally {
    clearTimeout(deadline);
    const errors: unknown[] = [];
    const attempt = async (action: () => unknown) => { try { await action(); } catch (error) { errors.push(error); } };
    if (context) await attempt(async () => { await context!.close(); cleanup.contextClosed = true; });
    if (browser) await attempt(async () => { await browser!.close(); cleanup.browserClosed = true; });
    if (service) await attempt(async () => { assert.deepEqual(await service!.stop(), { ok: true, status: 'stopped' });
      cleanup.serviceStopped = true; });
    if (serviceUrl) await attempt(async () => { await portClosed(serviceUrl); cleanup.portClosed = true; });
    await attempt(() => { assert.deepEqual(fs.readdirSync(uiScratch), []); cleanup.uiScratchRestored = true; });
    if (bodyError || errors.length) throw new AggregateError([...(bodyError ? [bodyError] : []), ...errors],
      'Real-guidance proof or cleanup failed; preserve all proof outputs and do not repeat');
  }
  assert.ok(receipt);
  fs.writeFileSync(path.join(proofRoot, 'real-evidence.json'), JSON.stringify({ ...receipt, cleanup }, null, 2) + '\n',
    { flag: 'wx' });
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) {
  assert.deepEqual(process.argv.slice(2, 3), ['--real-guidance-once']);
  assert.equal(process.argv.length, 4);
  await run(process.argv[3]!);
}
