import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import axe from 'axe-core';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import { validateRun, validateScan } from '../domain/run-contract.ts';
import type { ScanResult } from '../domain/run-contract.ts';
import type { RunningRun, TerminalRun } from '../persistence/run-repository.ts';
import { normalizeNativeScan } from './normalize-scan.ts';

type PreparedScan = Pick<RunningRun, 'requestedUrl' | 'providerContext' | 'scanContext'>;
type Observation = RunningRun['scanContext']['finalUrl'];
type Failure = Extract<TerminalRun, { status: 'failed' }>['failure']['category'];
const missing = () => ({ unavailable: 'missing' as const });
const invalid = () => ({ unavailable: 'invalid' as const });
const rules = ['image-alt', 'label', 'color-contrast'] as const;
const buckets = ['violations', 'incomplete', 'passes', 'inapplicable'] as const;

function initialContext(): RunningRun['scanContext'] {
  return {
    finalUrl: missing(), scannedAt: missing(), browserVersion: missing(),
    scannerVersion: '4.13.0', evidencePolicyVersion: 'm1-public-v1', rules: [...rules],
    scope: 'current-rendered-top-level-document', readiness: 'load', readinessReached: false,
    viewport: { width: 1280, height: 720 }, locale: 'en-US', timeoutMs: 10000,
    freshContext: true, importedState: false, interaction: false, crawling: false,
    iframes: false, cleanup: 'pending', contrastProfile: 'axe-core-4.13.0-default',
  };
}

function canonicalUrl(input: unknown): string {
  if (typeof input !== 'string') throw new Error('invalid-url');
  const url = new URL(input);
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) throw new Error('invalid-url');
  return url.href;
}

export function prepareScanRequest(url: unknown, mode: unknown):
  | { readonly ok: true; readonly value: PreparedScan }
  | { readonly ok: false; readonly error: 'invalid-url' | 'invalid-mode' } {
  let requestedUrl: string;
  try { requestedUrl = canonicalUrl(url); } catch { return { ok: false, error: 'invalid-url' }; }
  if (mode !== 'local' && mode !== 'groq') return { ok: false, error: 'invalid-mode' };
  return { ok: true, value: {
    requestedUrl,
    providerContext: mode === 'local'
      ? { mode, provider: 'ollama', model: 'qwen3.5:4b' }
      : { mode, provider: 'groq', model: 'openai/gpt-oss-20b' },
    scanContext: initialContext(),
  } };
}

function nativeOptions(): axe.RunOptions {
  return {
    runOnly: { type: 'rule', values: [...rules] }, reporter: 'm103-native-dom-v1',
    resultTypes: [...buckets], selectors: true, ancestry: false, xpath: false,
    absolutePaths: false, elementRef: true, iframes: false,
  };
}

// This function is serialized into the analyzed document, with no Node closure.
function registerReporter(engine: typeof axe): void {
  type Fact = { value: string | boolean } | { unavailable: string };
  type NativeNode = { element?: unknown; capturedDom?: unknown;
    any?: { relatedNodes?: NativeNode[] }[]; all?: { relatedNodes?: NativeNode[] }[];
    none?: { relatedNodes?: NativeNode[] }[] };
  type Report = Record<string, { id: string; nodes: NativeNode[] }[]>;
  const unavailable = (reason: string): Fact => ({ unavailable: reason });
  const read = (operation: () => string | boolean): Fact => {
    try { return { value: operation() }; } catch { return unavailable('invalid'); }
  };
  const attribute = (element: Element, name: string): Fact => read(() => {
    const value = element.getAttribute(name);
    return value === null ? 'absent' : value === '' ? 'empty' : value.trim() === '' ? 'whitespace-only' : 'non-empty';
  });
  function locator(element: Element): Fact {
    try {
      const indices: number[] = [];
      let current = element;
      const visited = new Set<Element>();
      while (current !== document.documentElement) {
        if (visited.has(current)) return unavailable('invalid');
        visited.add(current);
        const parent = current.parentElement;
        if (!parent) return unavailable(current.getRootNode() instanceof ShadowRoot ? 'unsupported' : 'invalid');
        const index = Array.from(parent.children).indexOf(current);
        if (index < 0) return unavailable('invalid');
        indices.unshift(index + 1);
        current = parent;
      }
      const selector = ':root' + indices.map(index => ` > :nth-child(${index})`).join('');
      if (selector.length > 2048) return unavailable('too-long');
      const matches = document.querySelectorAll(selector);
      return matches.length === 1 && matches[0] === element ? { value: selector } : unavailable('invalid');
    } catch { return unavailable('invalid'); }
  }
  function capture(node: NativeNode, rule: string): unknown {
    let element: Element | undefined;
    let reason = 'invalid';
    try {
      const reference = node.element;
      if (reference === undefined || reference === null) reason = 'missing';
      else if (reference instanceof Element && reference.isConnected && reference.ownerDocument === document) element = reference;
    } catch { /* A bad reference never falls back to a native selector. */ }
    const location = element ? locator(element) : unavailable(reason);
    if (rule === 'color-contrast') return { locator: location };
    if (rule === 'image-alt') {
      return { locator: location, evidence: {
        elementKind: element ? (element instanceof HTMLImageElement ? { value: 'img' } : unavailable('invalid')) : unavailable(reason),
        altState: element ? attribute(element, 'alt') : unavailable(reason),
      } };
    }
    let kind: Fact = unavailable(reason);
    let inputType: Fact = unavailable(reason);
    if (element) {
      if (element instanceof HTMLInputElement) {
        kind = { value: 'input' };
        inputType = read(() => {
          const type = (element as HTMLInputElement).type;
          if (!['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
            'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit',
            'tel', 'text', 'time', 'url', 'week'].includes(type)) throw new Error();
          return type;
        });
      } else if (element instanceof HTMLTextAreaElement) {
        kind = { value: 'textarea' }; inputType = unavailable('not-applicable');
      } else { kind = unavailable('invalid'); inputType = unavailable('invalid'); }
    }
    const associatedLabel = (explicit: boolean): Fact => element ? read(() => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) throw new Error();
      return Array.from(element.labels ?? []).some(label => label.control === element &&
        (explicit ? label.hasAttribute('for') : !label.hasAttribute('for') && label.contains(element)));
    }) : unavailable(reason);
    return { locator: location, evidence: { elementKind: kind, inputType, nameSources: {
      explicitLabel: associatedLabel(true), implicitLabel: associatedLabel(false),
      ariaLabel: element ? attribute(element, 'aria-label') : unavailable(reason),
      ariaLabelledby: element ? read(() => {
        const value = element.getAttribute('aria-labelledby');
        if (value === null) return 'absent';
        const ids = value.split(/[\t\n\f\r ]+/).filter(Boolean);
        if (!ids.length) return 'empty';
        const root = element.getRootNode();
        if (!(root instanceof Document || root instanceof ShadowRoot)) throw new Error();
        const count = ids.filter(id => root.getElementById(id) !== null).length;
        return count === 0 ? 'unresolved' : count === ids.length ? 'resolved' : 'partially-resolved';
      }) : unavailable(reason),
      title: element ? attribute(element, 'title') : unavailable(reason),
      placeholder: element ? attribute(element, 'placeholder') : unavailable(reason),
      presentationalRole: element ? read(() => (element.getAttribute('role') ?? '').split(/[\t\n\f\r ]+/)
        .some(token => token === 'presentation' || token === 'none')) : unavailable(reason),
    } } };
  }
  engine.addReporter<unknown>('m103-native-dom-v1', (raw, options, resolve, reject) => {
    engine.getReporter<Report>('v1')(raw, options, report => {
      try {
        for (const bucket of ['violations', 'incomplete', 'passes', 'inapplicable']) {
          for (const rule of report[bucket]) for (const node of rule.nodes) {
            if (bucket === 'violations' || bucket === 'incomplete') node.capturedDom = capture(node, rule.id);
            delete node.element;
            for (const group of ['any', 'all', 'none'] as const) {
              for (const check of node[group] ?? []) for (const related of check.relatedNodes ?? []) delete related.element;
            }
          }
        }
        resolve(report);
      } catch { resolve({ captureFailure: 'evidence-capture' }); }
    }, reject);
  });
}

export async function captureNativeScan(page: Page): Promise<unknown> {
  return new AxeBuilder({ page, axeSource: axe.source + `;(${registerReporter.toString()})(axe);` })
    .setLegacyMode(true).exclude('iframe').exclude('frame').options(nativeOptions()).analyze();
}

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
    return own(engine, 'name') === 'axe-core' && own(engine, 'version') === '4.13.0' &&
      exactData(own(report, 'toolOptions'), nativeOptions());
  } catch { return false; }
}

function observed(read: () => unknown, valid: (value: string) => boolean): Observation {
  try {
    const value = read();
    if (value === undefined) return missing();
    return typeof value === 'string' && valid(value) ? { value } : invalid();
  } catch { return invalid(); }
}
const validUrl = (value: string) => canonicalUrl(value) === value;

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
    else if (!isDeepStrictEqual(run.scanContext, initialContext())) failure = 'result-validation';
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
