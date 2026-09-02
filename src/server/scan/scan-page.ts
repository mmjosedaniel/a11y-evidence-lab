import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import { validateRun, validateScan } from '../domain/run-contract.ts';
import type { ScanResult } from '../domain/run-contract.ts';
import type { RunningRun, TerminalRun } from '../persistence/run-repository.ts';
import { captureNativeScan } from './native-scan-capture.ts';
import { normalizeNativeScan } from './normalize-scan.ts';
import { initialScanContext, nativeScanOptions, scannerVersion } from './scan-profile.ts';
import { canonicalPublicHttpsUrl } from './scan-request.ts';

export { captureNativeScan } from './native-scan-capture.ts';
export { prepareScanRequest } from './scan-request.ts';

type Observation = RunningRun['scanContext']['finalUrl'];
type Failure = Extract<TerminalRun, { status: 'failed' }>['failure']['category'];
const missing = () => ({ unavailable: 'missing' as const });
const invalid = () => ({ unavailable: 'invalid' as const });
function own(input: unknown, key: string): unknown {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new Error();
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) throw new Error();
  const property = Object.getOwnPropertyDescriptor(input, key);
  if (!property) return undefined;
  if (!property.enumerable || !('value' in property)) throw new Error();
  return property.value;
}

function exactData(input: unknown, expected: unknown): boolean {
  if (expected === null || typeof expected !== 'object') return Object.is(input, expected);
  if (Array.isArray(expected)) {
    if (!Array.isArray(input) || Object.getPrototypeOf(input) !== Array.prototype || input.length !== expected.length ||
      Reflect.ownKeys(input).length !== expected.length + 1) return false;
    return expected.every((value, index) => {
      const descriptor = Object.getOwnPropertyDescriptor(input, String(index));
      return descriptor?.enumerable && 'value' in descriptor && exactData(descriptor.value, value);
    });
  }
  if (typeof input !== 'object' || input === null || Reflect.ownKeys(input).length !== Object.keys(expected).length) return false;
  return Object.entries(expected).every(([key, value]) => exactData(own(input, key), value));
}

function reportBoundary(report: unknown): boolean {
  try {
    const engine = own(report, 'testEngine');
    return own(engine, 'name') === 'axe-core' && own(engine, 'version') === scannerVersion &&
      exactData(own(report, 'toolOptions'), nativeScanOptions());
  } catch { return false; }
}

function observed(read: () => unknown, valid: (value: string) => boolean): Observation {
  try {
    const value = read();
    if (value === undefined) return missing();
    return typeof value === 'string' && valid(value) ? { value } : invalid();
  } catch { return invalid(); }
}
const validUrl = (value: string) => canonicalPublicHttpsUrl(value) === value;

function scratchEmpty(): boolean {
  try {
    const scratch = fileURLToPath(new URL('../../../temp/m103-scan', import.meta.url));
    if (path.resolve(os.tmpdir()).toLowerCase() !== scratch.toLowerCase()) return false;
    let current = scratch;
    while (true) {
      const stat = fs.lstatSync(current);
      if (!stat.isDirectory() || stat.isSymbolicLink() || fs.realpathSync(current).toLowerCase() !== current.toLowerCase()) return false;
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
    return fs.readdirSync(scratch).length === 0;
  } catch { return false; }
}

export async function executeScan(input: RunningRun, signal: AbortSignal): Promise<TerminalRun> {
  const checked = validateRun(input);
  if (!checked.ok || checked.value.status !== 'running') throw new Error('invalid-run');
  if (!(signal instanceof AbortSignal)) throw new Error('invalid-signal');
  const run = checked.value;
  const context = { ...run.scanContext, cleanup: 'closed' as 'closed' | 'failed' };
  let failure: Failure | undefined;
  let collection: Pick<ScanResult, 'coverage' | 'findings' | 'scannerReviewObservations'> | undefined;
  let browser: Browser | undefined;
  let browserContext: BrowserContext | undefined;
  let page: Page | undefined;
  let acceptedReport = false;
  let acquisitionAttempted = false;
  let cleaning = false;
  let cleanupFailed = false;
  let cleanupEnd = Infinity;
  const pending = new Set<Promise<unknown>>();
  const closes = new Map<object, Promise<void>>();
  let changed: (() => void) | undefined;
  function track<T>(operation: Promise<T>): Promise<T> {
    pending.add(operation);
    void operation.then(() => { pending.delete(operation); changed?.(); }, () => { pending.delete(operation); changed?.(); });
    return operation;
  }
  async function bounded(operation: Promise<unknown>, milliseconds: number): Promise<boolean> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        operation.then(() => true, () => false),
        new Promise<false>(resolve => { timer = setTimeout(() => resolve(false), Math.max(0, milliseconds)); }),
      ]);
    } finally { clearTimeout(timer); }
  }
  async function close(resource: Page | BrowserContext | Browser, allowance: number): Promise<void> {
    if (closes.has(resource)) return closes.get(resource);
    const closure = track((async () => {
      const operation = track(Promise.resolve().then(() => resource.close()));
      if (!await bounded(operation, Math.min(allowance, cleanupEnd - performance.now()))) cleanupFailed = true;
    })());
    closes.set(resource, closure);
    return closure;
  }
  const workEnd = performance.now() + 10000;
  let cancelWork!: () => void;
  const cancelled = new Promise<never>((_resolve, reject) => { cancelWork = () => reject(new Error('cancelled')); });
  // The cancellation promise is observed even for an input rejected before work.
  void cancelled.catch(() => {});
  const onAbort = () => { failure = 'shutdown'; cancelWork(); };
  signal.addEventListener('abort', onAbort);
  let workTimer: ReturnType<typeof setTimeout> | undefined;
  function active(): void {
    if (signal.aborted) { failure = 'shutdown'; throw new Error('cancelled'); }
    if (performance.now() >= workEnd) { failure ??= 'timeout'; throw new Error('cancelled'); }
  }
  async function operation<T>(start: () => Promise<T>, register?: (resource: T) => void): Promise<T> {
    active();
    const work = track(Promise.resolve().then(start).then(value => { register?.(value); return value; }));
    const value = await Promise.race([work, cancelled]);
    active();
    return value;
  }
  let phase: Failure = 'browser';
  try {
    if (signal.aborted) failure = 'shutdown';
    else if (!isDeepStrictEqual(run.scanContext, initialScanContext())) failure = 'result-validation';
    else if (!scratchEmpty()) { failure = 'browser'; cleanupFailed = true; }
    else {
      workTimer = setTimeout(() => { failure ??= 'timeout'; cancelWork(); }, Math.max(0, workEnd - performance.now()));
      try {
        await operation(() => {
          acquisitionAttempted = true;
          return chromium.launch({ headless: true, channel: 'chromium', timeout: 10000, args: [],
            handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false });
        }, acquired => {
          browser = acquired;
          if (cleaning) void close(acquired, 1500);
        });
        context.browserVersion = observed(() => browser!.version(), value => value.length <= 64 && /^[0-9]+(?:\.[0-9]+){0,3}$/.exec(value)?.[0] === value);
        if (!('value' in context.browserVersion)) throw new Error();
        await operation(() => browser!.newContext({ viewport: { width: 1280, height: 720 }, locale: 'en-US',
          timezoneId: 'UTC', deviceScaleFactor: 1, colorScheme: 'light', forcedColors: 'none', reducedMotion: 'no-preference',
          acceptDownloads: false, permissions: [], serviceWorkers: 'block', offline: false, javaScriptEnabled: true,
          ignoreHTTPSErrors: false, bypassCSP: false }), acquired => {
          browserContext = acquired;
          if (cleaning) void close(acquired, 1000);
        });
        await operation(() => browserContext!.newPage(), acquired => {
          page = acquired;
          if (cleaning) void close(acquired, 500);
        });
        phase = 'navigation';
        await operation(() => page!.goto(run.requestedUrl, { waitUntil: 'load', timeout: Math.max(1, workEnd - performance.now()) }));
        context.readinessReached = true;
        phase = 'scanner';
        const native = await operation(() => captureNativeScan(page!));
        if (reportBoundary(native)) {
          acceptedReport = true;
          context.finalUrl = observed(() => own(native, 'url'), validUrl);
          context.scannedAt = observed(() => own(native, 'timestamp'), value =>
            /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/.exec(value)?.[0] === value &&
            new Date(value).toISOString() === value && Date.parse(value) >= Date.parse(run.createdAt));
        }
        const normalized = normalizeNativeScan(native);
        if (!normalized.ok) failure ??= normalized.error;
        else collection = normalized.value;
        active();
        if (!acceptedReport || !('value' in context.finalUrl) || !('value' in context.scannedAt)) failure ??= 'result-validation';
      } catch { failure ??= phase; }
    }
    if (!acceptedReport && page) context.finalUrl = observed(() => page!.url(), validUrl);
    clearTimeout(workTimer);
    cleaning = true;
    cleanupEnd = performance.now() + 4000;
    if (page) await close(page, 500);
    if (browserContext) await close(browserContext, 1000);
    if (browser) await close(browser, 1500);
    while (pending.size && performance.now() < cleanupEnd) {
      const notification = new Promise<void>(resolve => { changed = resolve; });
      if (!await bounded(notification, cleanupEnd - performance.now())) break;
    }
    changed = undefined;
    if (pending.size) cleanupFailed = true;
    try {
      if (page && !page.isClosed() || browser && browser.isConnected()) cleanupFailed = true;
    } catch { cleanupFailed = true; }
    if (acquisitionAttempted && !scratchEmpty()) cleanupFailed = true;
    context.cleanup = cleanupFailed ? 'failed' : 'closed';
    if (signal.aborted) failure = 'shutdown';
    else if (cleanupFailed) failure ??= 'cleanup';
    const now = Date.now();
    const finishedAt = new Date(Math.max(Number.isFinite(now) ? now : -Infinity, Date.parse(run.createdAt),
      'value' in context.scannedAt ? Date.parse(context.scannedAt.value) : -Infinity)).toISOString();
    const { scanContext: _initial, status: _status, ...common } = run;
    if (!failure && collection) {
      const scan = validateScan({ context, ...collection });
      if (scan.ok) {
        const terminal = validateRun({ ...common, status: 'completed', finishedAt, scan: scan.value });
        if (terminal.ok && terminal.value.status === 'completed') return terminal.value;
      }
      failure = 'result-validation';
    }
    const terminal = validateRun({ ...common, status: 'failed', finishedAt, scanContext: context,
      failure: { category: failure ?? 'result-validation' } });
    if (!terminal.ok || terminal.value.status !== 'failed') throw new Error('invalid-run');
    return terminal.value;
  } finally {
    clearTimeout(workTimer);
    signal.removeEventListener('abort', onAbort);
  }
}
