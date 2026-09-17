import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import { completedRun } from './m102-run-fixture.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import type { PageAnalysisRun, ProviderContext } from '../../src/server/domain/run-contract.ts';
import type { AnalyzeIntent, AppProps } from '../../src/client/App.tsx';
import type { RescanIntent } from '../../src/client/rescan-admission.ts';
import { buildFindingAnalysis } from '../../src/server/domain/finding-analysis.ts';
import { resolveCitations } from '../../src/server/retrieval/citation-resolution.ts';
import { classifyGuidanceSupport } from '../../src/server/retrieval/support-policy.ts';
import { imagePassages, retrievalFor } from './m203-finding-fixture.ts';

export type Intent = AnalyzeIntent;
export interface GuidanceIntent { readonly runId: string; readonly findingId: string }
export interface GenerationIntent { readonly runId: string; readonly findingId: string }
export interface ReviewIntent { readonly runId: string; readonly findingId: string; readonly review: unknown }
export type ClientCollaborators = AppProps & {
  readonly retrieveFinding?: (intent: GuidanceIntent) => Promise<unknown>;
  readonly generateFinding?: (intent: GenerationIntent, signal: AbortSignal) => Promise<unknown>;
  readonly reviewFinding?: (intent: ReviewIntent, signal: AbortSignal) => Promise<unknown>;
  readonly rescanFinding?: (intent: RescanIntent, signal: AbortSignal) => Promise<unknown>;
};
export interface KnownConfiguration {
  readonly localModelInstalled?: boolean;
  readonly groqApiUrlConfigured?: boolean;
}
export interface Bridge {
  calls: ({ stage: 'analyze'; value: Intent; callback: number }
    | { stage: 'guidance'; value: GuidanceIntent; callback: number }
    | { stage: 'generation'; value: GenerationIntent; callback: number; signal: AbortSignal }
    | { stage: 'review'; value: ReviewIntent; callback: number; signal: AbortSignal }
    | { stage: 'rescan'; value: RescanIntent; callback: number; signal: AbortSignal }
    | { stage: 'http'; value: { url: string; method: string; body: string | null; contentType: string | null };
        callback: number; signal: AbortSignal | null })[];
  analyze: (intent: Intent) => unknown;
  guidance: (intent: GuidanceIntent) => unknown;
  generation: (intent: GenerationIntent, signal: AbortSignal) => unknown;
  review: (intent: ReviewIntent, signal: AbortSignal) => unknown;
  rescan: (intent: RescanIntent, signal: AbortSignal) => unknown;
  fetch: (input: RequestInfo | URL, init?: RequestInit) => unknown;
  generationAccessor: (callback: (intent: GenerationIntent, signal: AbortSignal) => Promise<unknown>) => unknown;
  reviewAccessor: (callback: (intent: ReviewIntent, signal: AbortSignal) => Promise<unknown>) => unknown;
  rescanAccessor: (callback: (intent: RescanIntent, signal: AbortSignal) => Promise<unknown>) => unknown;
  generationReads: number;
  reviewReads: number;
  rescanReads: number;
  timerDelay: number | null;
  mount: (analyze?: boolean, configuration?: KnownConfiguration, guidance?: boolean,
    generation?: boolean, accessor?: boolean, review?: boolean, reviewAccessor?: boolean,
    rescan?: boolean, rescanAccessor?: boolean) => void;
  rerender: (analyze?: boolean, configuration?: KnownConfiguration, guidance?: boolean,
    generation?: boolean, accessor?: boolean, review?: boolean, reviewAccessor?: boolean,
    rescan?: boolean, rescanAccessor?: boolean) => void;
  unmount: () => void;
  restore: () => void;
  settle: () => Promise<void>;
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
  resolveKey: (key: string, value: unknown) => void;
  rejectKey: (key: string, value: unknown) => void;
  hold: (key?: string) => Promise<unknown>;
  raw: any;
  reads: number;
  savedNode: Element | null;
  oldNode: Element | null;
  canary: number;
}
declare global { interface Window { m104: Bridge } }

export const repo = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const scratch = path.join(repo, 'temp/m104-ui');
const runtime = path.join(repo, 'm104-browser-runtime');
const generated = ['m104-test-entry.html', 'm104-test-entry.tsx', 'vite-cache'];
export const targetUrl = 'https://example.org/start?view=summary#intro';

// Supplemental invocation safeguards only. The frozen outer PowerShell Assert/Get
// inventory procedures remain the canonical before/after ownership proof.
function ordinary(target: string, directory = true): void {
  const full = path.resolve(target);
  assert.ok(full.startsWith(repo + path.sep), 'Owned path must stay inside the repository');
  let current = full;
  let first = true;
  for (;;) {
    if (fs.existsSync(current)) {
      const stat = fs.lstatSync(current);
      assert.ok(!stat.isSymbolicLink(), 'No reparse traversal');
      assert.ok(first && !directory ? stat.isFile() : stat.isDirectory(), 'Ordinary path required');
      assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase(), 'No path alias');
    }
    if (current === repo) break;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
    first = false;
  }
}

function tree(root: string): string {
  ordinary(root);
  const queue = [root];
  const entries: { path: string; length: number; hash: string | null }[] = [];
  while (queue.length) {
    const directory = queue.shift()!;
    for (const name of fs.readdirSync(directory)) {
      const file = path.join(directory, name);
      const stat = fs.lstatSync(file);
      assert.ok(!stat.isSymbolicLink(), 'Unexpected reparse point');
      if (stat.isDirectory()) {
        entries.push({ path: file, length: 0, hash: null });
        queue.push(file);
      } else {
        assert.ok(stat.isFile(), 'Unexpected nonordinary file');
        entries.push({ path: file, length: stat.size, hash: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
      }
    }
  }
  return JSON.stringify(entries.sort((a, b) => a.path.localeCompare(b.path)));
}

export function valid<T extends PageAnalysisRun = PageAnalysisRun>(input: unknown): T {
  const result = validateRun(input);
  assert.ok(result.ok, 'Synthetic browser input must satisfy the unchanged aggregate contract');
  return result.value as T;
}

export function richRun(id = 'm104-complete-01', mode: 'local' | 'groq' = 'local'): Extract<PageAnalysisRun, { status: 'completed' }> {
  const run = structuredClone(completedRun(id, mode)) as any;
  const fact = (value: unknown) => ({ value });
  run.scan.findings.push({
    findingId: 'finding-label', ruleId: 'label', nativeResult: 'violation', state: 'unprocessed',
    locator: fact(':root > :nth-child(2)'), checks: fact({ any: ['explicit-label', 'implicit-label'], all: [], none: ['hidden-explicit-label'] }),
    evidence: { elementKind: fact('input'), inputType: fact('text'), nameSources: {
      explicitLabel: fact(false), implicitLabel: fact(true), ariaLabel: fact('empty'),
      ariaLabelledby: fact('partially-resolved'), title: fact('non-empty'), placeholder: fact('absent'), presentationalRole: fact(false),
    } },
  }, {
    findingId: 'finding-contrast', ruleId: 'color-contrast', nativeResult: 'violation', state: 'unprocessed',
    locator: fact(':root' + ' > :nth-child(1)'.repeat(24)), checks: fact({ any: ['color-contrast'], all: [], none: [] }),
    evidence: { foregroundColor: fact('#777777'), backgroundColor: fact('#ffffff'), shadowColor: fact('#000000'),
      contrastRatio: fact(4.478089453577214), expectedContrastRatio: fact(4.5), fontSize: fact('12.0pt (16px)'),
      fontWeight: fact('normal'), measurementSource: 'axe-core', messageKey: fact('bgImage') },
  });
  run.scan.scannerReviewObservations.push({
    ...structuredClone(run.scan.findings[2]), findingId: undefined, state: undefined,
    nativeResult: 'incomplete', incompleteReason: { unavailable: 'withheld' },
  }, {
    ...structuredClone(run.scan.findings[3]), findingId: undefined, state: undefined,
    nativeResult: 'incomplete', incompleteReason: fact('bgImage'),
  });
  for (const observation of run.scan.scannerReviewObservations) {
    delete observation.findingId;
    delete observation.state;
  }
  run.scan.coverage.label = { violations: 1, incomplete: 1, passes: 2, inapplicable: null };
  run.scan.coverage['color-contrast'] = { violations: 1, incomplete: 1, passes: null, inapplicable: null };
  return valid(run);
}

function appEntrySource(): string {
  const app = '/@fs/' + path.join(repo, 'src/client/App.tsx').replaceAll('\\', '/');
  const styles = '/@fs/' + path.join(repo, 'src/client/styles.css').replaceAll('\\', '/');
  return `import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from ${JSON.stringify(app)};
import ${JSON.stringify(styles)};
let root = createRoot(document.getElementById('root'));
let version = 0;
let pendingSequence = 0;
const pending = new Map();
let accessorProps = {};
let accessorMode = false;
function AccessorApp() {
  const proxied = new Proxy(accessorProps, { get(target,key,receiver) {
    if (key === 'generateFinding') {
      bridge.generationReads++;
      return bridge.generationAccessor(target.generateFinding);
    }
    if (key === 'reviewFinding') {
      bridge.reviewReads++;
      return bridge.reviewAccessor(target.reviewFinding);
    }
    if (key === 'rescanFinding') {
      bridge.rescanReads++;
      return bridge.rescanAccessor(target.rescanFinding);
    }
    return Reflect.get(target,key,receiver);
  } });
  return App(proxied);
}
const bridge = window.m104 = {
  calls: [], reads: 0, generationReads: 0, reviewReads: 0, rescanReads: 0, timerDelay: null, canary: 0, raw: null, savedNode: null, oldNode: null,
  analyze: () => Promise.resolve({ok:false,error:'create-failed',run:null,persisted:false,cleanupFailed:false}),
  guidance: () => Promise.resolve({ok:false,error:'not-found',run:null,persisted:false,cleanupFailed:false}),
  generation: () => Promise.resolve({ok:false,error:'not-eligible',run:null,persisted:false,cleanupFailed:false,invocationPersisted:false}),
  review: () => Promise.resolve({status:400,body:{ok:false,error:'invalid-request',run:null,persisted:false,cleanupFailed:false}}),
  rescan: () => Promise.resolve({status:400,body:{ok:false,error:'invalid-request',run:null,persisted:false,cleanupFailed:false}}),
  fetch: () => Promise.reject(new Error('Fetch is unavailable in the App harness')),
  generationAccessor: callback => callback,
  reviewAccessor: callback => callback,
  rescanAccessor: callback => callback,
  resolve: () => {}, reject: () => {},
  resolveKey(key,value) { pending.get(key)?.resolve(value); },
  rejectKey(key,value) { pending.get(key)?.reject(value); },
  hold(key = 'pending-' + (++pendingSequence)) { return new Promise((resolve,reject) => {
    if (pending.has(key)) throw new Error('Duplicate controlled pending key');
    const release = () => pending.delete(key);
    const record = {
      resolve: value => { release(); resolve(value); },
      reject: value => { release(); reject(value); },
      cancel: () => { release(); resolve({ok:false,error:'busy'}); },
    };
    pending.set(key,record);
    bridge.resolve = record.resolve;
    bridge.reject = record.reject;
  }); },
  async settle() { for (const record of [...pending.values()]) record.cancel(); await Promise.resolve(); },
  rerender(analyze = true, configuration = {}, guidance = false, generation = false, accessor = accessorMode, review = false, reviewAccessor = false, rescan = false, rescanAccessor = false) {
    const callback = ++version;
    const analyzeHandler = bridge.analyze;
    const guidanceHandler = bridge.guidance;
    const generationHandler = bridge.generation;
    const reviewHandler = bridge.review;
    const rescanHandler = bridge.rescan;
    const props = { configuration };
    if (analyze) props.analyze = intent => {
      bridge.calls.push({stage:'analyze',value:structuredClone(intent),callback});
      return analyzeHandler(intent);
    };
    if (guidance) props.retrieveFinding = intent => {
      bridge.calls.push({stage:'guidance',value:structuredClone(intent),callback});
      return guidanceHandler(intent);
    };
    const generationCallback = (intent,signal) => {
      bridge.calls.push({stage:'generation',value:structuredClone(intent),callback,signal});
      return generationHandler(intent,signal);
    };
    if (generation && !accessor) props.generateFinding = generationCallback;
    if (generation && accessor) props.generateFinding = generationCallback;
    const reviewCallback = (intent,signal) => {
      bridge.calls.push({stage:'review',value:structuredClone(intent),callback,signal});
      return reviewHandler(intent,signal);
    };
    if (review) props.reviewFinding = reviewCallback;
    const rescanCallback = (intent,signal) => {
      bridge.calls.push({stage:'rescan',value:structuredClone(intent),callback,signal});
      return rescanHandler(intent,signal);
    };
    if (rescan) props.rescanFinding = rescanCallback;
    accessorMode = accessor || reviewAccessor || rescanAccessor;
    accessorProps = props;
    root.render((accessor || reviewAccessor || rescanAccessor) ? <AccessorApp/> : <App {...props}/>);
  },
  mount(analyze = true, configuration = {}, guidance = false, generation = false, accessor = false, review = false, reviewAccessor = false, rescan = false, rescanAccessor = false) {
    root.unmount(); root = createRoot(document.getElementById('root'));
    accessorMode = accessor || reviewAccessor || rescanAccessor;
    bridge.calls = []; bridge.rerender(analyze, configuration, guidance, generation, accessor, review, reviewAccessor, rescan, rescanAccessor);
  },
  unmount() { root.unmount(); },
  restore() {},
};
bridge.rerender(false);
`;
}

function mainEntrySource(): string {
  const main = '/@fs/' + path.join(repo, 'src/client/main.tsx').replaceAll('\\', '/');
  return `const nativeFetch = window.fetch.bind(window);
let pendingSequence = 0;
const pending = new Map();
let version = 0;
const bridge = window.m104 = {
  calls: [], reads: 0, generationReads: 0, reviewReads: 0, rescanReads: 0, timerDelay: null, canary: 0, raw: null, savedNode: null, oldNode: null,
  analyze: () => Promise.reject(new Error('Analyze collaborator is unavailable in the main harness')),
  guidance: () => Promise.reject(new Error('Guidance collaborator is unavailable in the main harness')),
  generation: () => Promise.reject(new Error('Generation collaborator is unavailable in the main harness')),
  review: () => Promise.reject(new Error('Review collaborator is unavailable in the main harness')),
  rescan: () => Promise.reject(new Error('Rescan collaborator is unavailable in the main harness')),
  fetch: () => Promise.reject(new Error('Controlled fetch response is not configured')),
  generationAccessor: callback => callback,
  reviewAccessor: callback => callback,
  rescanAccessor: callback => callback,
  resolve: () => {}, reject: () => {},
  resolveKey(key,value) { pending.get(key)?.resolve(value); },
  rejectKey(key,value) { pending.get(key)?.reject(value); },
  hold(key = 'pending-' + (++pendingSequence)) { return new Promise((resolve,reject) => {
    if (pending.has(key)) throw new Error('Duplicate controlled pending key');
    const release = () => pending.delete(key);
    const record = {
      resolve: value => { release(); resolve(value); },
      reject: value => { release(); reject(value); },
      cancel: () => { release(); resolve({ok:false,error:'busy'}); },
    };
    pending.set(key,record);
    bridge.resolve = record.resolve;
    bridge.reject = record.reject;
  }); },
  async settle() { for (const record of [...pending.values()]) record.cancel(); await Promise.resolve(); },
  mount() {}, rerender() {}, unmount() {}, restore() { window.fetch = nativeFetch; },
};
window.fetch = (input,init = {}) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const headers = new Headers(init.headers);
  const callback = ++version;
  bridge.calls.push({stage:'http',value:{url,method:init.method ?? 'GET',body:typeof init.body === 'string' ? init.body : null,
    contentType:headers.get('content-type')},callback,signal:init.signal ?? null});
  return bridge.fetch(input,init);
};
await import(${JSON.stringify(main)});
`;
}

export interface Harness {
  page: Page;
  context: BrowserContext;
  origin: string;
  browserVersion: string;
  hashes: Readonly<Record<string, string>>;
  close: () => Promise<void>;
}

async function listenerClosed(port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: '127.0.0.1', port });
    socket.setTimeout(1000);
    socket.once('connect', () => { socket.destroy(); reject(new Error('Owned Vite listener remains open')); });
    socket.once('timeout', () => { socket.destroy(); reject(new Error('Listener closure is uncertain')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

export async function startHarness(manual = false, entry: 'app' | 'main' = 'app'): Promise<Harness> {
  assert.equal(process.cwd().toLowerCase(), repo.toLowerCase());
  assert.equal(process.env.NODE_DISABLE_COMPILE_CACHE, '1');
  assert.equal(path.resolve(process.env.TEMP ?? ''), scratch);
  assert.equal(path.resolve(process.env.TMP ?? ''), scratch);
  assert.equal(path.resolve(process.env.PLAYWRIGHT_BROWSERS_PATH ?? ''), path.join(runtime, 'browsers'));
  assert.equal(process.env.PLAYWRIGHT_SKIP_BROWSER_GC, '1');
  assert.equal(process.env.PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT, '30000');
  for (const name of ['m104-setup', 'm104-ui', 'm103-scan']) {
    const root = path.join(repo, 'temp', name);
    ordinary(root);
    assert.deepEqual(fs.readdirSync(root), [], 'Scratch must begin empty');
  }
  const beforeRuntime = tree(runtime);
  const marker = path.join(runtime, 'browsers/chromium-1234/DEPENDENCIES_VALIDATED');
  ordinary(marker, false);
  const markerTime = fs.statSync(marker).mtimeMs;
  assert.ok(markerTime <= Date.now() && markerTime > Date.now() - 30 * 86400000);
  assert.ok(!fs.existsSync(path.join(repo, 'node_modules/.vite-temp')));
  let server: ViteDevServer | undefined;
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page | undefined;
  let port: number | undefined;
  let origin = '';
  let closed = false;
  let ready = false;
  const requests: { path: string; status: number }[] = [];
  const external: string[] = [];
  const pageErrors: string[] = [];
  async function close(): Promise<void> {
    if (closed) return;
    closed = true;
    const errors: unknown[] = [];
    const attempt = async (action: () => unknown) => { try { await action(); } catch (error) { errors.push(error); } };
    if (page && !page.isClosed()) await attempt(() => page!.evaluate(async () => {
      if (window.m104) { await window.m104.settle(); window.m104.restore(); }
    }));
    if (context) await attempt(() => context!.close());
    if (browser) await attempt(() => browser!.close());
    if (server) await attempt(() => server!.close());
    if (port !== undefined) await attempt(() => listenerClosed(port!));
    if (!errors.length) {
      await attempt(() => {
        ordinary(scratch);
        const children = fs.readdirSync(scratch);
        assert.ok(children.every(name => generated.includes(name)), 'Preserve unexpected scratch residue');
        for (const name of children) {
          const target = path.join(scratch, name);
          ordinary(target, name === 'vite-cache');
          if (name === 'vite-cache') tree(target);
          fs.rmSync(target, { recursive: name === 'vite-cache' });
        }
        assert.deepEqual(fs.readdirSync(scratch), []);
        assert.equal(tree(runtime), beforeRuntime, 'Browser runtime changed');
        assert.equal(fs.statSync(marker).mtimeMs, markerTime, 'Validation marker changed');
        assert.ok(!fs.existsSync(path.join(repo, 'node_modules/.vite-temp')));
      });
    }
    console.log(JSON.stringify({ event: 'm104-ui-teardown', origin, requests, external, pageErrors, settled: errors.length === 0 }));
    assert.deepEqual(external, [], 'No external browser request is allowed');
    if (errors.length) throw new AggregateError(errors, 'UI teardown failed; preserve owned roots');
    if (ready) assert.deepEqual(pageErrors, [], 'Unexpected application page errors invalidate UI evidence');
  }
  try {
    fs.writeFileSync(path.join(scratch, generated[0]), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>M1-04 UI contract</title></head><body><div id="root"></div><script type="module" src="/m104-test-entry.tsx"></script></body></html>', { flag: 'wx' });
    fs.writeFileSync(path.join(scratch, generated[1]), entry === 'app' ? appEntrySource() : mainEntrySource(), { flag: 'wx' });
    server = await createServer({
      configFile: false, root: scratch, publicDir: false,
      cacheDir: path.join(scratch, 'vite-cache'), appType: 'mpa',
      logLevel: 'error', clearScreen: false,
      optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'] },
      server: { host: '127.0.0.1', port: 0, strictPort: true, hmr: false, ws: false, watch: null,
        fs: { strict: true, allow: [scratch, path.join(repo, 'src/client'), path.join(repo, 'src/server/domain'), path.join(repo, 'node_modules')],
          deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**'] } },
    });
    await server.listen();
    const address = server.httpServer!.address();
    assert.ok(address && typeof address !== 'string');
    port = address.port;
    origin = `http://127.0.0.1:${port}`;
    browser = await chromium.launch({ channel: 'chromium', headless: !manual, timeout: 10000 });
    assert.equal(browser.version(), '151.0.7922.34');
    context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: false, serviceWorkers: 'block' });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      external.push(url.origin);
      return route.abort();
    });
    page = await context.newPage();
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(10000);
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('response', response => requests.push({ path: new URL(response.url()).pathname, status: response.status() }));
    const entryResponse = page.waitForResponse(response => new URL(response.url()).pathname === '/m104-test-entry.tsx');
    const appPath = path.join(repo, 'src/client/App.tsx').replaceAll('\\', '/');
    const appResponse = page.waitForResponse(response => {
      const url = new URL(response.url());
      return url.origin === origin && [`/@fs/${appPath}`, `/@id/${appPath}`].includes(url.pathname);
    }).then(response => ({ response }), error => ({ error }));
    // Observe both imports before navigation. Keep the App waiter handled even
    // when entry loading fails first and teardown closes the page.
    const [, response] = await Promise.all([page.goto(origin + '/m104-test-entry.html'), entryResponse]);
    if (response.status() !== 200) {
      const body = await response.text();
      // Preserve Vite's actual diagnostic: no guessed missing-module failure or bridge timeout.
      throw new Error(`Generated TSX HTTP ${response.status()}: ${body}`);
    }
    const app = await appResponse;
    if ('error' in app) throw app.error;
    if (app.response.status() !== 200) {
      throw new Error(`App import HTTP ${app.response.status()} at ${app.response.url()}: ${await app.response.text()}`);
    }
    await page.waitForFunction(() => !!window.m104);
    await page.getByRole('main').waitFor();
    assert.deepEqual(pageErrors, []);
    ready = true;
    const clientHashes = (JSON.parse(tree(path.join(repo, 'src/client'))) as { path: string; hash: string | null }[])
      .filter(entry => entry.hash !== null && ['.ts', '.tsx', '.css'].includes(path.extname(entry.path)))
      .map(entry => [path.relative(repo, entry.path).replaceAll('\\', '/'), entry.hash!] as const);
    const evidenceHashes = ['tests/target-results-ui.test.ts', 'tests/helpers/m104-ui-harness.ts']
      .map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex')] as const);
    const hashes = Object.fromEntries([...clientHashes, ...evidenceHashes]
      .sort(([left], [right]) => left.localeCompare(right)));
    console.log(JSON.stringify({ event: 'm104-ui-ready', browser: browser.version(), origin, hashes, synthetic: true }));
    return { page, context, origin, browserVersion: browser.version(), hashes, close };
  } catch (error) {
    try { await close(); } catch (cleanup) { throw new AggregateError([error, cleanup], 'UI setup and cleanup failed'); }
    throw error;
  }
}

async function manual(): Promise<void> {
  const harness = await startHarness(true);
  const template = richRun('m104-manual-01');
  try {
    await harness.page.evaluate(template => {
      window.m104.analyze = intent => new Promise(resolve => setTimeout(() => {
        resolve({ ok: true, run: { ...structuredClone(template), requestedUrl: intent.requestedUrl, providerContext: structuredClone(intent.providerContext) } });
      }, 1500));
      window.m104.mount();
    }, template);
    console.log('Synthetic manual input: actual App, run m104-manual-01, 1500 ms collaborators. Observe Narrator and actual browser-menu zoom; close this page or press Ctrl+C to finish.');
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { dispose(); reject(new Error('Manual session reached its 15-minute ceiling')); }, 15 * 60 * 1000);
      const done = () => { dispose(); resolve(); };
      function dispose() { clearTimeout(timer); process.removeListener('SIGINT', done); harness.page.removeListener('close', done); }
      process.once('SIGINT', done);
      harness.page.once('close', done);
    });
  } finally { await harness.close(); }
}

function m203ManualOutcome(template: unknown): unknown {
  const run = structuredClone(template) as any;
  const native = structuredClone(run.scan.findings[0]);
  const retrieval = retrievalFor(native, [
    { passageId: imagePassages.criterion.passageId, score: 0.8 },
    { passageId: imagePassages.remediation.passageId, score: 0.7 },
  ]);
  const support = classifyGuidanceSupport(native, retrieval);
  assert.ok(support.ok);
  const decision = buildFindingAnalysis(native, '2026-08-30T10:00:03.000Z', '2026-08-30T10:00:04.000Z', support.value);
  Object.assign(run.scan.findings[0], decision, { retrieval: {
    status: 'completed', startedAt: '2026-08-30T10:00:03.000Z', finishedAt: '2026-08-30T10:00:04.000Z',
    result: retrieval, support: support.value,
  } });
  const corpusRoot = path.join(repo, 'corpus/wcag22-mvp-v1');
  const citations = resolveCitations(native, retrieval,
    fs.readFileSync(path.join(corpusRoot, 'manifest.json')), fs.readFileSync(path.join(corpusRoot, 'passages.json')));
  assert.ok(citations.ok);
  return { ok: true, run: valid(run), view: {
    runId: run.runId, findingId: native.findingId, ...citations.value,
  } };
}

async function m203Manual(): Promise<void> {
  const template = completedRun('m203-manual-01');
  const outcome = m203ManualOutcome(template);
  const harness = await startHarness(true);
  try {
    await harness.page.evaluate(({ template, outcome }) => {
      window.m104.analyze = intent => new Promise(resolve => setTimeout(() => resolve(
        intent.requestedUrl === template.requestedUrl
          && JSON.stringify(intent.providerContext) === JSON.stringify(template.providerContext)
          ? { ok: true, run: structuredClone(template) }
          : { ok: false, error: 'invalid-request', run: null, persisted: false, cleanupFailed: false },
      ), 1500));
      window.m104.guidance = () => new Promise(resolve => setTimeout(() => resolve(structuredClone(outcome)), 1500));
      window.m104.mount(true, {}, true);
    }, { template, outcome });
    await harness.page.getByLabel('Target URL').fill(template.requestedUrl);
    await harness.page.getByLabel('Local (recommended)').check();
    await harness.page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await harness.page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
    console.log('Synthetic M2-03 manual input: actual App, controlled run m203-manual-01, 1500 ms guidance collaborator. Observe Narrator and actual browser-menu 200% zoom; close this page or press Ctrl+C to finish.');
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { dispose(); reject(new Error('Manual session reached its 15-minute ceiling')); }, 15 * 60 * 1000);
      const done = () => { dispose(); resolve(); };
      function dispose() { clearTimeout(timer); process.removeListener('SIGINT', done); harness.page.removeListener('close', done); }
      process.once('SIGINT', done);
      harness.page.once('close', done);
    });
  } finally { await harness.close(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--m203-manual')) await m203Manual();
  else if (process.argv.includes('--manual')) await manual();
}
