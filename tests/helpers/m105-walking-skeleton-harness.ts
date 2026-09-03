import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TestContext } from 'node:test';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, LaunchOptions, Page } from 'playwright';
import { startLocalService } from '../../src/server/service.ts';
import type { LocalService } from '../../src/server/service.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../../src/server/domain/run-contract.ts';

export const repo = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const clientRoot = path.join(repo, 'dist/client');
export const integrationScratch = path.join(repo, 'temp/m105-integration');
export const targetUrl = 'https://m105.test/';
const runtime = path.join(repo, 'm104-browser-runtime');
const uiScratch = path.join(repo, 'temp/m104-ui');
const originalLaunch = chromium.launch.bind(chromium);
const revision = 'a'.repeat(40);

export type Scenario = 'populated' | 'zero' | 'navigation-failure' | 'blocked';

const populatedHtml = '<!doctype html><html lang="en"><head><title>Controlled findings</title><style>body{background:#fff;color:#111}.uncertain{font-size:16px;color:#777;background-image:linear-gradient(#fff,#eee)}</style></head><body><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22/%3E"><input><p class="uncertain">Controlled gradient.</p></body></html>';
const zeroHtml = '<!doctype html><html lang="en"><head><title>Controlled zero</title><style>body{background:#fff;color:#000}</style></head><body><img alt="Controlled" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22/%3E"><label>Name <input></label><p>Readable control.</p></body></html>';

function ordinaryDirectory(target: string): void {
  const full = path.resolve(target);
  assert.ok(full.startsWith(integrationScratch + path.sep), 'Owned integration path required');
  let current = full;
  while (current.startsWith(repo + path.sep)) {
    if (fs.existsSync(current)) {
      const stat = fs.lstatSync(current);
      assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Ordinary directory required');
    }
    if (current === repo) break;
    current = path.dirname(current);
  }
}

function uniqueRunRoot(name: string): string {
  assert.deepEqual(fs.readdirSync(integrationScratch), [], 'Integration scratch must begin empty');
  const root = path.join(integrationScratch, name);
  ordinaryDirectory(root);
  fs.mkdirSync(root, { recursive: false });
  return root;
}

async function launchUiBrowser(): Promise<Browser> {
  assert.deepEqual(fs.readdirSync(uiScratch), [], 'UI scratch must begin empty');
  const previousTemp = process.env.TEMP;
  const previousTmp = process.env.TMP;
  try {
    process.env.TEMP = uiScratch;
    process.env.TMP = uiScratch;
    return await originalLaunch({ channel: 'chromium', headless: true, timeout: 10000 });
  } finally {
    if (previousTemp === undefined) delete process.env.TEMP; else process.env.TEMP = previousTemp;
    if (previousTmp === undefined) delete process.env.TMP; else process.env.TMP = previousTmp;
  }
}

export async function portClosed(serviceUrl: string): Promise<void> {
  const address = new URL(serviceUrl);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(5000, () => { socket.destroy(); reject(new Error('Port closure check timed out')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned service port remains open')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

export interface JsonResponse {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: unknown;
}

export async function requestJson(origin: string, method: string, requestPath: string,
  body?: string, contentType?: string): Promise<JsonResponse> {
  const url = new URL(requestPath, origin);
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method, headers: {
      ...(contentType === undefined ? {} : { 'Content-Type': contentType }),
      ...(body === undefined ? {} : { 'Content-Length': Buffer.byteLength(body) }),
    } }, response => {
      const chunks: Buffer[] = [];
      response.on('data', chunk => chunks.push(Buffer.from(chunk)));
      response.once('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        try { resolve({ status: response.statusCode ?? 0, headers: response.headers, body: JSON.parse(text) }); }
        catch (error) { reject(error); }
      });
    });
    request.once('error', reject);
    request.end(body);
  });
}

export async function requestBytes(origin: string, requestPath: string): Promise<{
  status: number; headers: http.IncomingHttpHeaders; body: Buffer;
}> {
  return new Promise((resolve, reject) => {
    http.get(new URL(requestPath, origin), response => {
      const chunks: Buffer[] = [];
      response.on('data', chunk => chunks.push(Buffer.from(chunk)));
      response.once('end', () => resolve({ status: response.statusCode ?? 0, headers: response.headers,
        body: Buffer.concat(chunks) }));
    }).once('error', reject);
  });
}

export function installManagedScan(t: TestContext, scenario: Scenario, calls: string[], release?: Promise<void>): void {
  t.mock.method(chromium, 'launch', async (options: LaunchOptions) => {
    calls.push('launch');
    const browser = await originalLaunch(options);
    const wrapped = {
      version: () => browser.version(),
      isConnected: () => browser.isConnected(),
      close: () => browser.close(),
      newContext: async (contextOptions: Parameters<Browser['newContext']>[0]) => {
        const context = await browser.newContext(contextOptions);
        await context.route('**/*', async route => {
          const url = new URL(route.request().url());
          if (url.origin !== 'https://m105.test') {
            calls.push(`unexpected:${url.origin}`);
            await route.abort();
            return;
          }
          calls.push(`target:${url.pathname}`);
          if (scenario === 'navigation-failure') { await route.abort('failed'); return; }
          if (scenario === 'blocked') await release;
          await route.fulfill({ status: 200, contentType: 'text/html', body: scenario === 'zero' ? zeroHtml : populatedHtml });
        });
        return context;
      },
    };
    return wrapped as unknown as Browser;
  });
}

export interface ServiceHarness {
  service: LocalService;
  runRoot: string;
  close(): Promise<void>;
}

export async function startConfiguredService(t: TestContext, name: string, scenario: Scenario,
  calls: string[] = [], release?: Promise<void>): Promise<ServiceHarness> {
  assert.equal(path.resolve(process.env.TEMP ?? ''), path.join(repo, 'temp/m103-scan'));
  assert.equal(path.resolve(process.env.PLAYWRIGHT_BROWSERS_PATH ?? ''), path.join(runtime, 'browsers'));
  const runRoot = uniqueRunRoot(name);
  let service: LocalService | undefined;
  let closed = false;
  async function close(): Promise<void> {
    if (closed) return;
    closed = true;
    const errors: unknown[] = [];
    const attempt = async (action: () => unknown) => { try { await action(); } catch (error) { errors.push(error); } };
    if (service) {
      await attempt(async () => assert.deepEqual(await service!.stop(), { ok: true, status: 'stopped' }));
      await attempt(() => portClosed(service!.url));
    }
    await attempt(() => { ordinaryDirectory(runRoot); fs.rmSync(runRoot, { recursive: true }); });
    await attempt(() => assert.deepEqual(fs.readdirSync(integrationScratch), []));
    await attempt(() => assert.deepEqual(fs.readdirSync(path.join(repo, 'temp/m103-scan')), []));
    await attempt(() => assert.deepEqual(fs.readdirSync(uiScratch), []));
    if (errors.length) throw new AggregateError(errors, 'Configured-service teardown failed');
  }
  t.after(close);
  installManagedScan(t, scenario, calls, release);
  const started = await startLocalService({ runRoot, applicationRevision: revision, clientRoot });
  assert.ok(started.ok, 'Configured-client service must start');
  service = started.service;
  return { service, runRoot, close };
}

export interface BrowserHarness extends ServiceHarness {
  page: Page;
  requests: string[];
  scannerCalls: string[];
}

export async function startBrowserHarness(t: TestContext, name: string, scenario: Scenario): Promise<BrowserHarness> {
  const scannerCalls: string[] = [];
  const runRoot = uniqueRunRoot(name);
  let service: LocalService | undefined;
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  const requests: string[] = [];
  let closed = false;
  async function close(): Promise<void> {
    if (closed) return;
    closed = true;
    const errors: unknown[] = [];
    const attempt = async (action: () => unknown) => { try { await action(); } catch (error) { errors.push(error); } };
    if (context) await attempt(() => context!.close());
    if (browser) await attempt(() => browser!.close());
    await attempt(() => assert.deepEqual(fs.readdirSync(uiScratch), []));
    if (service) {
      await attempt(async () => assert.deepEqual(await service!.stop(), { ok: true, status: 'stopped' }));
      await attempt(() => portClosed(service!.url));
    }
    await attempt(() => { ordinaryDirectory(runRoot); fs.rmSync(runRoot, { recursive: true }); });
    await attempt(() => assert.deepEqual(fs.readdirSync(integrationScratch), []));
    await attempt(() => assert.deepEqual(fs.readdirSync(path.join(repo, 'temp/m103-scan')), []));
    if (errors.length) throw new AggregateError(errors, 'Browser harness teardown failed');
  }
  t.after(close);
  const started = await startLocalService({ runRoot, applicationRevision: revision, clientRoot });
  assert.ok(started.ok, 'Configured-client service must start');
  service = started.service;
  browser = await launchUiBrowser();
  assert.equal(browser.version(), '151.0.7922.34');
  context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false,
    serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === service!.url) return route.continue();
    requests.push(`external:${url.origin}`);
    return route.abort();
  });
  const page = await context.newPage();
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin === service!.url) requests.push(`${request.method()} ${url.pathname}`);
  });
  page.setDefaultTimeout(15000);
  installManagedScan(t, scenario, scannerCalls);
  const response = await page.goto(service.url + '/');
  assert.equal(response?.status(), 200, 'Production client entry must be served');
  await page.getByRole('main').waitFor();
  return { service, runRoot, page, requests, scannerCalls, close };
}

export function readOnlyRun(runRoot: string, siblings: readonly string[] = []): PageAnalysisRun {
  const children = fs.readdirSync(runRoot).sort();
  const runDirectories = children.filter(name => !siblings.includes(name));
  assert.deepEqual(children.filter(name => siblings.includes(name)), [...siblings].sort(), 'Every sibling must remain');
  assert.equal(runDirectories.length, 1, 'Exactly one run directory must be published');
  const bytes = fs.readFileSync(path.join(runRoot, runDirectories[0]!, 'run.json'), 'utf8');
  const checked = validateRun(JSON.parse(bytes));
  assert.ok(checked.ok, 'Persisted run must pass the production validator');
  return checked.value;
}

export async function abortPartialRequest(t: TestContext, origin: string): Promise<void> {
  const originalEmit = http.Server.prototype.emit;
  const received = deferred();
  const closed = deferred();
  const clientClosed = deferred();
  const events: string[] = [];
  const chunks: Buffer[] = [];
  let incoming: http.IncomingMessage | undefined;
  let intakeDispatches = 0;
  let responseEnds = 0;
  let restoreIntake: (() => void) | undefined;
  let restoreResponse: (() => void) | undefined;
  const onData = (chunk: Buffer) => { chunks.push(Buffer.from(chunk)); received.resolve(); };
  const onAborted = () => { events.push('aborted'); };
  const onError = () => { events.push('error'); };
  const onClose = () => { events.push('close'); closed.resolve(); };
  const interception = t.mock.method(http.Server.prototype, 'emit', function (this: http.Server,
    event: string | symbol, ...args: unknown[]): boolean {
    if (event !== 'request') return Reflect.apply(originalEmit, this, [event, ...args]);
    const request = args[0] as http.IncomingMessage;
    const response = args[1] as http.ServerResponse;
    if (request.url !== '/api/runs' || request.socket.localPort !== Number(new URL(origin).port)) {
      return Reflect.apply(originalEmit, this, [event, ...args]);
    }
    assert.equal(incoming, undefined, 'Exactly one partial request reaches the owned server');
    incoming = request;
    const originalOnce = request.once;
    const intake = t.mock.method(request, 'once', function (this: http.IncomingMessage,
      name: string | symbol, listener: (...values: unknown[]) => void) {
      const observed = name === 'end' ? (...values: unknown[]) => {
        intakeDispatches++;
        Reflect.apply(listener, this, values);
      } : listener;
      return Reflect.apply(originalOnce, this, [name, observed]);
    });
    restoreIntake = () => intake.mock.restore();
    const originalEnd = response.end;
    const ending = t.mock.method(response, 'end', function (this: http.ServerResponse, ...values: unknown[]) {
      responseEnds++;
      return Reflect.apply(originalEnd, this, values);
    });
    restoreResponse = () => ending.mock.restore();
    const result = Reflect.apply(originalEmit, this, [event, ...args]);
    request.on('data', onData);
    request.on('aborted', onAborted);
    request.on('error', onError);
    request.on('close', onClose);
    return result;
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('Real partial-request settlement timed out')), 5000);
  });
  const request = http.request(new URL('/api/runs', origin), { method: 'POST', agent: false, headers: {
    'Content-Type': 'application/json', 'Content-Length': '1024',
  } });
  request.on('error', () => { /* Expected client reset is not server-settlement evidence. */ });
  request.once('close', clientClosed.resolve);
  try {
    request.write('{');
    await Promise.race([received.promise, deadline]);
    assert.equal(Buffer.concat(chunks).toString('utf8'), '{');
    assert.ok(incoming && !incoming.complete, 'The server has received an incomplete body');
    request.destroy();
    await Promise.race([Promise.all([closed.promise, clientClosed.promise]), deadline]);
    assert.ok(events.includes('aborted') && events.includes('error'), 'Real server abort and error must settle');
    assert.equal(events.filter(event => event === 'close').length, 1);
    assert.equal(intakeDispatches, 0, 'No real completed-body intake callback may prepare or scan a run');
    assert.ok(responseEnds <= 1, 'Abort and error must not send duplicate outcomes');
  } finally {
    if (timer) clearTimeout(timer);
    request.destroy();
    incoming?.destroy();
    incoming?.removeListener('data', onData);
    incoming?.removeListener('aborted', onAborted);
    incoming?.removeListener('error', onError);
    incoming?.removeListener('close', onClose);
    restoreIntake?.();
    restoreResponse?.();
    interception.mock.restore();
  }
}

export function deferred(): { promise: Promise<void>; resolve(): void } {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}
