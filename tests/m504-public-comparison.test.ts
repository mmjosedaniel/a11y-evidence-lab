import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import type { Browser, BrowserContext, Page } from 'playwright';
import type { PublicSequence } from './helpers/m504-public-comparison.ts';
import { assertCanonicalComparisonUi, createActualSequenceForTest, publicTarget,
  runPublicComparisonForTest } from './helpers/m504-public-comparison.ts';
import { repo } from './helpers/m105-walking-skeleton-harness.ts';
import { richRun, valid } from './helpers/m104-ui-harness.ts';
import { comparisonForRuns, comparisonRun, comparisonScenario,
  contrastComparisonRun } from './helpers/m503-comparison-fixture.ts';
import { labelPassCandidate } from './helpers/comparison-fixtures.ts';
import type { ComparisonPass, ComparisonViolation, PageAnalysisRun,
  ScannerReviewObservation } from '../src/server/domain/run-contract.ts';

const goodShutdown = { contextClosed: true, browserClosed: true, serviceStopped: true, portClosed: true,
  scanScratchEmpty: true, uiScratchEmpty: true } as const;
const negativeRoot = (name: string): string => path.join(repo, 'temp', `m504-public-negative-${name}`);
const entryHead = '434d7de121472a076a02b6eca6027059480c6995';
type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const turn = (): Promise<void> => new Promise(resolve => setImmediate(resolve));

function exactCleanup(root: string, extraRootFiles: readonly string[] = [], runFiles: readonly string[] = []): void {
  const evidence = path.join(root, 'evidence');
  const runs = path.join(root, 'runs');
  assert.deepEqual(fs.readdirSync(evidence), ['result.json']);
  fs.unlinkSync(path.join(evidence, 'result.json'));
  for (const file of runFiles) fs.unlinkSync(path.join(runs, file));
  assert.deepEqual(fs.readdirSync(runs), []);
  fs.rmdirSync(evidence);
  fs.rmdirSync(runs);
  for (const file of extraRootFiles) fs.unlinkSync(path.join(root, file));
  assert.deepEqual(fs.readdirSync(root), []);
  fs.rmdirSync(root);
}

function publicRun(runId: string): CompletedRun {
  const run = structuredClone(richRun(runId, 'local')) as unknown as Record<string, unknown>;
  run.applicationRevision = entryHead;
  run.requestedUrl = publicTarget;
  const scan = run.scan as { context: { finalUrl: { value: string } } };
  scan.context.finalUrl = { value: publicTarget };
  return valid<CompletedRun>(run);
}

function publicComparison(baseline: CompletedRun, findingId: string): CompletedRun {
  const later = structuredClone(publicRun('later-run')) as unknown as Record<string, unknown>;
  later.baselineRunId = baseline.runId;
  const finding = baseline.scan.findings.find(item => item.findingId === findingId);
  assert.ok(finding);
  const candidates = finding.ruleId === 'label'
    ? [labelPassCandidate(':root > :nth-child(20)'), labelPassCandidate(':root > :nth-child(21)')] : [];
  return comparisonForRuns(baseline, later, candidates, findingId) as CompletedRun;
}

function renderedLocation(locator: { readonly value: string } | { readonly unavailable: string }): string {
  return 'value' in locator ? locator.value : `Page location unavailable (${locator.unavailable.replaceAll('-', ' ')})`;
}

type TestObservation = ComparisonPass | ComparisonViolation | ScannerReviewObservation;
type TestFact = { readonly value: unknown } | { readonly unavailable: string };
const testOrdinary = (fact: TestFact): string => 'value' in fact ? String(fact.value)
  : fact.unavailable === 'not-applicable' ? 'Not applicable' : `Unavailable (${fact.unavailable.replaceAll('-', ' ')})`;
const testAttribute = (fact: TestFact): string => {
  if ('unavailable' in fact) return `Unavailable (${fact.unavailable.replaceAll('-', ' ')})`;
  const labels = { absent: 'Missing', empty: 'Empty', 'whitespace-only': 'Whitespace only',
    'non-empty': 'Present', unresolved: 'Unresolved', 'partially-resolved': 'Partially resolved', resolved: 'Resolved' };
  const value = String(fact.value);
  return value in labels ? labels[value as keyof typeof labels] : value.length ? value[0]!.toUpperCase() + value.slice(1) : value;
};
const testBoolean = (fact: TestFact): string => 'unavailable' in fact
  ? `Unavailable (${fact.unavailable.replaceAll('-', ' ')})` : fact.value ? 'Yes' : 'No';
const testRatio = (fact: TestFact): string => 'unavailable' in fact
  ? `Unavailable (${fact.unavailable.replaceAll('-', ' ')})`
  : `${Number.isInteger(Number(fact.value)) ? Number(fact.value) : Number(Number(fact.value).toFixed(2))}:1`;

function addObservationFields(fields: Map<string, string>, section: 'before' | 'after', observation: TestObservation): void {
  const add = (label: string, value: string): void => { fields.set(`${section}|${label}`, value); };
  add('Where on the page', renderedLocation(observation.locator));
  if (observation.ruleId === 'image-alt') {
    add('Affected element', 'Image element'); add('Element', 'Image');
    add('Alternative text', testAttribute(observation.evidence.altState)); return;
  }
  if (observation.ruleId === 'label') {
    const element = 'value' in observation.evidence.elementKind ? observation.evidence.elementKind.value : undefined;
    const input = 'value' in observation.evidence.inputType ? observation.evidence.inputType.value : undefined;
    add('Affected element', element === 'textarea' ? 'Textarea'
      : element === 'input' ? input ? `Input · ${input}` : 'Input' : 'Form control');
    add('Element', testOrdinary(observation.evidence.elementKind));
    add('Input type', testOrdinary(observation.evidence.inputType));
    add('Explicit label', testBoolean(observation.evidence.nameSources.explicitLabel));
    add('Implicit label', testBoolean(observation.evidence.nameSources.implicitLabel));
    add('ARIA label', testAttribute(observation.evidence.nameSources.ariaLabel));
    add('ARIA labelled by', testAttribute(observation.evidence.nameSources.ariaLabelledby));
    add('Title', testAttribute(observation.evidence.nameSources.title));
    add('Placeholder', testAttribute(observation.evidence.nameSources.placeholder));
    if ('value' in observation.evidence.nameSources.presentationalRole &&
        observation.evidence.nameSources.presentationalRole.value === true) add('Presentational role', 'Yes');
    return;
  }
  add('Affected element', [testOrdinary(observation.evidence.foregroundColor),
    testOrdinary(observation.evidence.backgroundColor), testOrdinary(observation.evidence.fontSize),
    testOrdinary(observation.evidence.fontWeight)].join(' · '));
  add('Text color', testOrdinary(observation.evidence.foregroundColor));
  add('Background color', testOrdinary(observation.evidence.backgroundColor));
  add('Measured contrast', testRatio(observation.evidence.contrastRatio));
  add('Required contrast', testRatio(observation.evidence.expectedContrastRatio));
  add('Font size', testOrdinary(observation.evidence.fontSize));
  const weight = testOrdinary(observation.evidence.fontWeight);
  add('Font weight', weight.length ? weight[0]!.toUpperCase() + weight.slice(1) : weight);
  const message = 'value' in observation.evidence.messageKey ? observation.evidence.messageKey.value : undefined;
  if ('value' in observation.evidence.shadowColor && (message === 'shadowOnBgColor' || message === 'fgOnShadowColor')) {
    add('Shadow color', testOrdinary(observation.evidence.shadowColor));
  }
}

function uiFields(run: CompletedRun): Map<string, string> {
  assert.ok(run.comparison);
  const fields = new Map<string, string>();
  const add = (section: 'comparison' | 'before' | 'after', label: string, value: string): void => {
    fields.set(`${section}|${label}`, value);
  };
  add('comparison', 'Pair comparability', run.comparison.pair.replaceAll('-', ' '));
  if ('match' in run.comparison) add('comparison', 'Target match', run.comparison.match.replaceAll('-', ' '));
  add('comparison', 'Outcome', 'outcome' in run.comparison ? run.comparison.outcome.replaceAll('-', ' ') : 'not comparable');
  add('comparison', 'Reason', run.comparison.reason.replaceAll('-', ' '));
  if ('mismatches' in run.comparison) add('comparison', 'Pair differences', run.comparison.mismatches.join(', ').replaceAll('-', ' '));
  add('before', 'Run reference', run.baselineRunId!);
  add('before', 'Requested page', run.comparison.baseline.requestedUrl);
  add('before', 'Analyzed page', run.comparison.baseline.scanContext.finalUrl.value);
  add('before', 'Scan time', run.comparison.baseline.scanContext.scannedAt.value);
  add('before', 'Browser version', run.comparison.baseline.scanContext.browserVersion.value);
  addObservationFields(fields, 'before', run.comparison.baseline.observation);
  add('after', 'Run reference', run.runId); add('after', 'Requested page', run.requestedUrl);
  add('after', 'Analyzed page', run.scan.context.finalUrl.value); add('after', 'Scan time', run.scan.context.scannedAt.value);
  add('after', 'Browser version', run.scan.context.browserVersion.value);
  if ('after' in run.comparison) addObservationFields(fields, 'after', run.comparison.after.observation);
  const delta = 'delta' in run.comparison ? run.comparison.delta : undefined;
  if (delta) {
    add('comparison', 'Before margin', String(delta.baselineMargin));
    add('comparison', 'After margin', String(delta.laterMargin));
    add('comparison', 'Change', String(delta.change));
  }
  return fields;
}

function uiVisible(run: CompletedRun): Set<string> {
  assert.ok(run.comparison);
  const comparison = run.comparison;
  const values = new Set<string>([comparison.rationale, `Finding reference: ${comparison.baseline.findingId}`]);
  if ('after' in comparison) {
    values.add(comparison.after.kind === 'native-pass' ? 'Native pass observation'
      : comparison.after.kind === 'incomplete' ? 'Scanner review observation' : 'Finding');
    if (comparison.after.kind === 'finding') values.add(`Finding reference: ${comparison.after.findingId}`);
    if (comparison.after.kind === 'incomplete') values.add(`Incomplete reason: ${testOrdinary(comparison.after.observation.incompleteReason)}`);
  } else values.add(`After evidence unavailable: ${comparison.reason.replaceAll('-', ' ')}.`);
  for (const finding of run.scan.findings) {
    const peers = run.scan.findings.filter(item => item.ruleId === finding.ruleId);
    const index = peers.findIndex(item => item.findingId === finding.findingId) + 1;
    const label = finding.ruleId === 'image-alt' ? 'Image alternative issue'
      : finding.ruleId === 'label' ? 'Form label issue' : 'Color contrast issue';
    values.add(`${label} ${index}`);
  }
  return values;
}

function assertionPage(run: CompletedRun,
  overrides: Readonly<Record<string, string | undefined>> = {}): Page {
  const fields = uiFields(run);
  const fieldLabels = new Set([...fields.keys()].map(key => key.slice(key.indexOf('|') + 1)));
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) fields.delete(key); else fields.set(key, value);
  }
  const visible = uiVisible(run);
  const locator = (label = '', failure?: string): Record<string, unknown> => {
    const value: Record<string, unknown> = {
      async waitFor() { if (failure) throw new Error(failure); }, first() { return value; },
      nth() { return value; }, locator(selector: string) { return locator(`${label}/${selector}`, failure); },
      getByText(text: string) {
        if (failure) return locator(`text:${text}`, failure);
        if (label.startsWith('field|') && label.endsWith('/..')) {
          const key = label.slice('field|'.length, -'/..'.length);
          return fields.get(key) === text ? locator(`field-value:${key}:${text}`)
            : locator(`field-value:${key}:${text}`, `missing-associated:${key}:${text}`);
        }
        const section = label.includes('/heading/Before/..') ? 'before'
          : label.includes('/heading/After/..') ? 'after' : 'comparison';
        const key = `${section}|${text}`;
        if (fields.has(key)) return locator(`field|${key}`);
        if (fieldLabels.has(text)) return locator(`missing-field:${key}`, `missing-field:${key}`);
        return visible.has(text) ? locator(`text:${text}`) : locator(`text:${text}`, `missing-visible:${text}`);
      },
      getByRole(role: string, options?: { name?: string }) { return locator(`${label}/${role}/${options?.name ?? ''}`); },
    };
    return value;
  };
  return { getByRole(role: string, options?: { name?: string }) {
    return locator(`${role}:${options?.name ?? ''}`);
  } } as unknown as Page;
}

function writeRun(runRoot: string, run: CompletedRun): void {
  const directory = path.join(runRoot, run.runId);
  fs.mkdirSync(directory, { recursive: false });
  fs.writeFileSync(path.join(directory, 'run.json'), JSON.stringify(run, null, 2) + '\n', { flag: 'wx' });
}

function cleanupSequenceRoot(root: string, runIds: readonly string[]): void {
  const runRoot = path.join(root, 'runs');
  for (const runId of runIds) {
    const directory = path.join(runRoot, runId);
    assert.deepEqual(fs.readdirSync(directory), ['run.json']);
    fs.unlinkSync(path.join(directory, 'run.json'));
    fs.rmdirSync(directory);
  }
  assert.deepEqual(fs.readdirSync(runRoot), []);
  fs.rmdirSync(runRoot);
  fs.rmdirSync(root);
}

function sequence(overrides: Partial<PublicSequence> = {}): { readonly value: PublicSequence;
  readonly calls: string[] } {
  const calls: string[] = [];
  const value: PublicSequence = {
    async start() { calls.push('start'); },
    async baseline() { calls.push('baseline'); return { ok: true, runId: 'baseline-run',
      findingIds: ['finding-one'], sha256: 'a'.repeat(64) }; },
    async rescan(findingId: string) { calls.push(`rescan:${findingId}`); return { ok: true, runId: 'later-run',
      baselineRunId: 'baseline-run', findingId, sha256: 'b'.repeat(64), outcome: 'persistent' }; },
    async close() { calls.push('close'); return goodShutdown; },
    ...overrides,
  };
  return { value, calls };
}

function actualFixture(root: string, findingId: string, options: {
  readonly omitVisible?: string; readonly baselineClickFailure?: boolean; readonly rescanClickFailure?: boolean;
  readonly inspectScratch?: (target: string) => boolean;
  readonly fieldOverrides?: Readonly<Record<string, string | undefined>>;
} = {}) {
  fs.mkdirSync(root, { recursive: false });
  const runRoot = path.join(root, 'runs');
  fs.mkdirSync(runRoot, { recursive: false });
  const baseline = publicRun('baseline-run');
  const later = publicComparison(baseline, findingId);
  assert.ok(later.comparison);
  const comparison = later.comparison;
  const fields = uiFields(later);
  for (const [key, value] of Object.entries(options.fieldOverrides ?? {})) {
    if (value === undefined) fields.delete(key); else fields.set(key, value);
  }
  const fieldLabels = new Set([...uiFields(later).keys()].map(key => key.slice(key.indexOf('|') + 1)));
  const laterLabels = later.scan.findings.map((finding, position, findings) => {
    const index = findings.slice(0, position + 1).filter(item => item.ruleId === finding.ruleId).length;
    const label = finding.ruleId === 'image-alt' ? 'Image alternative issue'
      : finding.ruleId === 'label' ? 'Form label issue' : 'Color contrast issue';
    return `${label} ${index}`;
  });
  const visible = new Set<string>([
    baseline.runId, later.runId, comparison.baseline.requestedUrl, comparison.baseline.scanContext.finalUrl.value,
    comparison.baseline.scanContext.scannedAt.value, comparison.baseline.scanContext.browserVersion.value,
    later.requestedUrl, later.scan.context.finalUrl.value, later.scan.context.scannedAt.value,
    later.scan.context.browserVersion.value, `Finding reference: ${findingId}`,
    renderedLocation(comparison.baseline.observation.locator), comparison.pair.replaceAll('-', ' '),
    ...('match' in comparison ? [comparison.match.replaceAll('-', ' ')] : []),
    ...('outcome' in comparison ? [comparison.outcome.replaceAll('-', ' ')] : ['not comparable']),
    comparison.reason.replaceAll('-', ' '), comparison.rationale,
    ...('after' in comparison ? [comparison.after.kind === 'native-pass' ? 'Native pass observation'
      : comparison.after.kind === 'incomplete' ? 'Scanner review observation' : 'Finding',
      renderedLocation(comparison.after.observation.locator),
      ...(comparison.after.kind === 'finding' ? [`Finding reference: ${comparison.after.findingId}`] : [])]
      : [`After evidence unavailable: ${comparison.reason.replaceAll('-', ' ')}.`]),
    ...laterLabels,
  ]);
  if (options.omitVisible) visible.delete(options.omitVisible);
  const calls: string[] = [];
  let requestListener: ((request: { url(): string; method(): string }) => void) | undefined;
  const responses = [
    { status: () => 200, json: async () => ({ run: baseline }), request: () => ({ postDataJSON: () => ({}) }) },
    { status: () => 200, json: async () => ({ run: later }), request: () => ({ postDataJSON: () => ({ findingId }) }) },
  ];
  const locator = (label = '', failure?: string): Record<string, unknown> => {
    const value: Record<string, unknown> = {
      async fill(input: string) { calls.push(`fill:${input}`); }, async check() { calls.push(`check:${label}`); },
      async selectOption(input: string) { calls.push(`select:${input}`); }, async waitFor() {
        if (failure) throw new Error(failure); calls.push(`wait:${label}`);
      },
      first() { return value; },
      nth(index: number) { calls.push(`nth:${label}:${index}`); return value; },
      locator(selector: string) { calls.push(`locator:${label}:${selector}`); return locator(`${label}/${selector}`, failure); },
      getByText(text: string) {
        if (failure) return locator(`text:${text}`, failure);
        if (label.startsWith('field|') && label.endsWith('/..')) {
          const key = label.slice('field|'.length, -'/..'.length);
          return fields.get(key) === text ? locator(`field-value:${key}:${text}`)
            : locator(`field-value:${key}:${text}`, `missing-associated:${key}:${text}`);
        }
        const section = label.includes('/heading/Before/..') ? 'before'
          : label.includes('/heading/After/..') ? 'after' : 'comparison';
        const key = `${section}|${text}`;
        if (fields.has(key)) return locator(`field|${key}`);
        if (fieldLabels.has(text)) return locator(`missing-field:${key}`, `missing-field:${key}`);
        if (!visible.has(text)) return locator(`text:${text}`, `missing-visible:${text}`);
        return locator(`text:${text}`);
      },
      getByRole(role: string, roleOptions?: { name?: string }) {
        if (roleOptions?.name) calls.push(`role:${label}:${role}:${roleOptions.name}`);
        return locator(`${label}/${role}/${roleOptions?.name ?? ''}`);
      },
      async click() {
        if (label.includes('Analyze')) {
          if (options.baselineClickFailure) throw new Error('baseline-click');
          writeRun(runRoot, baseline);
          requestListener?.({ url: () => 'http://127.0.0.1:41234/api/runs', method: () => 'POST' });
        } else if (label.includes('Start intentional rescan')) {
          if (options.rescanClickFailure) throw new Error('rescan-click');
          writeRun(runRoot, later);
          requestListener?.({ url: () => 'http://127.0.0.1:41234/api/rescans', method: () => 'POST' });
        }
        calls.push(`click:${label}`);
      },
    };
    return value;
  };
  const page = {
    setDefaultTimeout() {}, on(event: string, listener: typeof requestListener) { if (event === 'request') requestListener = listener; },
    async goto() { return { status: () => 200 }; },
    getByLabel(name: string) { return locator(`label:${name}`); },
    getByRole(role: string, roleOptions?: { name?: string }) {
      return locator(`${role}:${roleOptions?.name ?? ''}`);
    },
    waitForResponse() {
      if ((options.baselineClickFailure && responses.length === 2) || (options.rescanClickFailure && responses.length === 1)) {
        responses.shift();
        return Promise.reject(new Error('response-rejected'));
      }
      return Promise.resolve(responses.shift()!);
    },
  } as unknown as Page;
  let connected = true;
  const context = { async newPage() { return page; }, async close() { calls.push('context.close'); } } as unknown as BrowserContext;
  const browser = { async newContext() { return context; }, async close() { calls.push('browser.close'); connected = false; },
    isConnected() { return connected; } } as unknown as Browser;
  const service = { url: 'http://127.0.0.1:41234', async stop() { calls.push('service.stop');
    return { ok: true, status: 'stopped' }; } };
  const sequence = createActualSequenceForTest(runRoot, {
    readHead: () => entryHead,
    startService: async () => ({ ok: true, service }) as never,
    launchBrowser: async () => browser,
    request: async input => {
      const run = new URL(input instanceof URL ? input.href : input.toString()).pathname.endsWith(later.runId) ? later : baseline;
      return { status: 200, json: async () => ({ run }) } as Response;
    },
    observeClosedPort: async () => true,
    inspectScratch: options.inspectScratch ?? (() => true),
  });
  return { sequence, calls, baseline, later, runRoot };
}

test('rejects arguments and a pre-existing fixed root before starting any effect', async () => {
  let created = false;
  for (const [name, args] of [['missing', []], ['extra', ['--public', 'extra']], ['wrong', ['--wrong']]] as const) {
    const invalidRoot = negativeRoot(`arguments-${name}`);
    const invalid = await runPublicComparisonForTest(args, { root: invalidRoot,
      createSequence: () => { created = true; return sequence().value; } });
    assert.deepEqual(invalid, { ok: false, stage: 'arguments', activations: 0,
      reason: 'exact---public-argument-required' });
    assert.equal(created, false);
    assert.equal(fs.existsSync(invalidRoot), false);
  }

  const occupiedRoot = negativeRoot('occupied');
  fs.mkdirSync(occupiedRoot, { recursive: false });
  fs.writeFileSync(path.join(occupiedRoot, 'owner-marker'), 'preserve\n', { flag: 'wx' });
  const occupied = await runPublicComparisonForTest(['--public'], { root: occupiedRoot,
    createSequence: () => { created = true; return sequence().value; } });
  assert.deepEqual(occupied, { ok: false, stage: 'root', activations: 0, reason: 'root-rejected' });
  assert.equal(created, false);
  assert.equal(fs.readFileSync(path.join(occupiedRoot, 'owner-marker'), 'utf8'), 'preserve\n');
  fs.unlinkSync(path.join(occupiedRoot, 'owner-marker'));
  fs.rmdirSync(occupiedRoot);
});

test('rejects unsafe and aliased roots before sequence creation', async t => {
  let created = false;
  const unsafe = path.join(repo, 'temp', 'nested', 'm504-public-negative-unsafe');
  assert.deepEqual(await runPublicComparisonForTest(['--public'], { root: unsafe,
    createSequence: () => { created = true; return sequence().value; } }),
  { ok: false, stage: 'root', activations: 0, reason: 'root-rejected' });
  assert.equal(created, false);
  assert.equal(fs.existsSync(unsafe), false);

  const original = fs.realpathSync.native;
  t.mock.method(fs.realpathSync, 'native', (target: fs.PathLike) => {
    const resolved = path.resolve(target.toString());
    return resolved === path.join(repo, 'temp') ? resolved + '-alias' : original(target);
  });
  const aliased = negativeRoot('aliased');
  assert.deepEqual(await runPublicComparisonForTest(['--public'], { root: aliased,
    createSequence: () => { created = true; return sequence().value; } }),
  { ok: false, stage: 'root', activations: 0, reason: 'root-rejected' });
  assert.equal(created, false);
  assert.equal(fs.existsSync(aliased), false);
});

test('runs exactly one baseline and one selected-Finding rescan before closing', async () => {
  const root = negativeRoot('finite');
  const controlled = sequence();
  const result = await runPublicComparisonForTest(['--public'], { root, createSequence: () => controlled.value });
  assert.equal(result.ok, true);
  assert.equal(result.stage, 'complete');
  assert.equal(result.activations, 2);
  assert.deepEqual(controlled.calls, ['start', 'baseline', 'rescan:finding-one', 'close']);
  assert.deepEqual(result.shutdown, goodShutdown);
  exactCleanup(root);
});

test('baseline failure or zero Findings stops before the later activation', async () => {
  for (const [name, baseline, reason] of [
    ['baseline-failure', { ok: false, reason: 'controlled-baseline-failure' } as const, 'controlled-baseline-failure'],
    ['zero', { ok: true, runId: 'baseline-run', findingIds: [], sha256: 'a'.repeat(64) } as const,
      'baseline-has-no-findings'],
  ] as const) {
    const root = negativeRoot(name);
    const controlled = sequence({ async baseline() { controlled.calls.push('baseline'); return baseline; } });
    const result = await runPublicComparisonForTest(['--public'], { root, createSequence: () => controlled.value });
    assert.equal(result.ok, false);
    assert.equal(result.activations, 1);
    assert.equal(result.reason, reason);
    assert.deepEqual(controlled.calls, ['start', 'baseline', 'close']);
    exactCleanup(root);
  }
});

test('later failure consumes the second activation and cannot trigger a third action', async () => {
  const root = negativeRoot('later-failure');
  const controlled = sequence({ async rescan(findingId: string) {
    controlled.calls.push(`rescan:${findingId}`); return { ok: false, reason: 'controlled-later-failure' };
  } });
  const result = await runPublicComparisonForTest(['--public'], { root, createSequence: () => controlled.value });
  assert.equal(result.ok, false);
  assert.equal(result.activations, 2);
  assert.equal(result.reason, 'controlled-later-failure');
  assert.deepEqual(controlled.calls, ['start', 'baseline', 'rescan:finding-one', 'close']);
  exactCleanup(root);
});

test('timeout, changed paths and close failure each preserve isolated state', async () => {
  const timeoutRoot = negativeRoot('timeout');
  const timeout = sequence({ async baseline() { timeout.calls.push('baseline'); return new Promise(() => {}); } });
  const timed = await runPublicComparisonForTest(['--public'], { root: timeoutRoot,
    createSequence: () => timeout.value, timeoutMs: 10 });
  assert.equal(timed.ok, false);
  assert.equal(timed.reason, 'baseline-timeout');
  assert.equal(timed.activations, 1);
  assert.deepEqual(timeout.calls, ['start', 'baseline', 'close']);
  exactCleanup(timeoutRoot);

  const changedRoot = negativeRoot('changed');
  const changed = sequence({
    async baseline() {
      changed.calls.push('baseline');
      fs.writeFileSync(path.join(changedRoot, 'unknown-owner-state'), 'preserve\n', { flag: 'wx' });
      fs.writeFileSync(path.join(changedRoot, 'runs', 'changed-run-state'), 'preserve\n', { flag: 'wx' });
      return { ok: false, reason: 'controlled-changed-state' };
    },
  });
  const preserved = await runPublicComparisonForTest(['--public'], { root: changedRoot,
    createSequence: () => changed.value });
  assert.equal(preserved.ok, false);
  assert.equal(preserved.stage, 'baseline');
  assert.equal(preserved.reason, 'controlled-changed-state');
  assert.equal(fs.readFileSync(path.join(changedRoot, 'unknown-owner-state'), 'utf8'), 'preserve\n');
  assert.equal(fs.readFileSync(path.join(changedRoot, 'runs', 'changed-run-state'), 'utf8'), 'preserve\n');
  exactCleanup(changedRoot, ['unknown-owner-state'], ['changed-run-state']);

  const closeRoot = negativeRoot('close-failure');
  const closeFailure = sequence({ async baseline() { closeFailure.calls.push('baseline');
    return { ok: false, reason: 'controlled-stop' }; }, async close() { closeFailure.calls.push('close');
    return { contextClosed: false, browserClosed: true, serviceStopped: false, portClosed: false,
      scanScratchEmpty: true, uiScratchEmpty: true }; } });
  const uncertain = await runPublicComparisonForTest(['--public'], { root: closeRoot,
    createSequence: () => closeFailure.value });
  assert.equal(uncertain.stage, 'shutdown');
  assert.equal(uncertain.reason, 'controlled-stop');
  exactCleanup(closeRoot);
});

test('actual sequence owns service, browser and context acquired after shutdown returns', async () => {
  for (const delayed of ['service', 'browser', 'context'] as const) {
    const calls: string[] = [];
    const serviceGate = deferred<unknown>();
    const browserGate = deferred<Browser>();
    const contextGate = deferred<BrowserContext>();
    let connected = true;
    const page = { setDefaultTimeout() {}, on() {}, async goto() { calls.push('goto'); return { status: () => 200 }; } };
    const context = { async newPage() { calls.push('newPage'); return page as unknown as Page; },
      async close() { calls.push('context.close'); } } as unknown as BrowserContext;
    const browser = { async newContext() { calls.push('newContext'); return delayed === 'context' ? contextGate.promise : context; },
      async close() { calls.push('browser.close'); connected = false; }, isConnected() { return connected; } } as unknown as Browser;
    const service = { url: 'http://127.0.0.1:41234', async stop() { calls.push('service.stop'); return { ok: true, status: 'stopped' }; } };
    const sequence = createActualSequenceForTest(negativeRoot(`late-${delayed}`), {
      readHead: () => entryHead,
      startService: async () => {
        calls.push('service.start');
        return (delayed === 'service' ? await serviceGate.promise : { ok: true, service }) as never;
      },
      launchBrowser: async () => { calls.push('browser.launch'); return delayed === 'browser' ? browserGate.promise : browser; },
      observeClosedPort: async () => { calls.push('port.closed'); return true; },
      inspectScratch: () => true,
    });
    const starting = sequence.start();
    await turn();
    const shutdown = await sequence.close();
    assert.equal(shutdown.scanScratchEmpty, true);
    assert.equal(shutdown.uiScratchEmpty, true);
    assert.equal(shutdown.contextClosed, false);
    assert.equal(shutdown.browserClosed, delayed === 'context');
    assert.equal(shutdown.serviceStopped, delayed !== 'service');
    assert.equal(shutdown.portClosed, delayed !== 'service');
    assert.deepEqual(shutdown.methodPathCounts, {});
    if (delayed === 'service') assert.equal('servicePort' in shutdown, false);
    else assert.equal(shutdown.servicePort, 41234);
    if (delayed === 'service') serviceGate.resolve({ ok: true, service });
    if (delayed === 'browser') browserGate.resolve(browser);
    if (delayed === 'context') contextGate.resolve(context);
    const startResult = await starting.then(() => 'fulfilled', () => 'rejected');
    assert.equal(startResult, 'rejected');
    assert.equal(calls.filter(value => value === 'service.stop').length, 1);
    assert.equal(calls.includes('goto'), false, 'Late acquisition must not advance startup');
    if (delayed !== 'service') assert.equal(calls.filter(value => value === 'browser.close').length, 1);
    if (delayed === 'context') assert.equal(calls.filter(value => value === 'context.close').length, 1);
  }
});

test('actual sequence selects all rule groups, within-rule index and submitted Finding ID', async () => {
  for (const [name, findingId, group, index] of [
    ['image', 'finding-1', 'Image alternatives', 1],
    ['label', 'finding-label', 'Form labels', 0],
    ['contrast', 'finding-contrast', 'Color contrast', 0],
  ] as const) {
    const root = negativeRoot(`actual-${name}`);
    const fixture = actualFixture(root, findingId);
    await fixture.sequence.start();
    const baseline = await fixture.sequence.baseline();
    assert.ok(baseline.ok && baseline.findingIds.includes(findingId));
    const later = await fixture.sequence.rescan(findingId);
    assert.ok(later.ok && later.findingId === findingId);
    assert.equal(fixture.calls.includes(`nth:group:${group}/button/:${index}`), true);
    const shutdown = await fixture.sequence.close();
    assert.deepEqual(shutdown, {
      contextClosed: true, browserClosed: true, serviceStopped: true, portClosed: true, servicePort: 41234,
      methodPathCounts: {
        'GET /api/runs/baseline-run': 1, 'GET /api/runs/later-run': 1,
        'POST /api/rescans': 1, 'POST /api/runs': 1,
      },
      scanScratchEmpty: true, uiScratchEmpty: true,
    });
    cleanupSequenceRoot(root, [fixture.baseline.runId, fixture.later.runId]);
  }
});

test('actual sequence rejects wrong displayed run identity and outcome', async () => {
  const canonical = publicComparison(publicRun('baseline-run'), 'finding-label');
  assert.ok(canonical.comparison && 'outcome' in canonical.comparison);
  for (const [name, options, expected] of [
    ['identity', { fieldOverrides: { 'after|Run reference': 'wrong-run' } },
      'missing-associated:after|Run reference:later-run'],
    ['finding', { omitVisible: 'Finding reference: finding-label' },
      'missing-visible:Finding reference: finding-label'],
    ['outcome', { fieldOverrides: { 'comparison|Outcome': 'wrong outcome' } },
      `missing-associated:comparison|Outcome:${canonical.comparison.outcome.replaceAll('-', ' ')}`],
  ] as const) {
    const root = negativeRoot(`ui-${name}`);
    const fixture = actualFixture(root, 'finding-label', options);
    await fixture.sequence.start();
    assert.equal((await fixture.sequence.baseline()).ok, true);
    await assert.rejects(fixture.sequence.rescan('finding-label'), error => {
      assert.equal((error as Error).message, expected);
      return true;
    });
    await fixture.sequence.close();
    cleanupSequenceRoot(root, [fixture.baseline.runId, fixture.later.runId]);
  }
});

test('canonical UI assertion binds native fields and covers incomplete uncertainty and contrast delta', async () => {
  const canonical = publicComparison(publicRun('baseline-run'), 'finding-label');
  assert.ok(canonical.comparison && canonical.comparison.baseline.observation.ruleId === 'label');
  const expectedInput = testOrdinary(canonical.comparison.baseline.observation.evidence.inputType);
  await assert.rejects(assertCanonicalComparisonUi(assertionPage(canonical,
    { 'before|Input type': 'wrong-native-value' }), canonical),
  error => {
    assert.equal((error as Error).message, `missing-associated:before|Input type:${expectedInput}`);
    return true;
  });
  await assert.rejects(assertCanonicalComparisonUi(assertionPage(canonical,
    { 'before|Explicit label': undefined }), canonical), /missing-field:before\|Explicit label/);

  const incomplete = valid<CompletedRun>(comparisonRun('unique-incomplete'));
  await assertCanonicalComparisonUi(assertionPage(incomplete), incomplete);
  assert.ok(incomplete.comparison && 'after' in incomplete.comparison && incomplete.comparison.after.kind === 'incomplete');
  const incompleteObservation = incomplete.comparison.after.observation;
  const incompleteReason = testOrdinary(incompleteObservation.incompleteReason);
  const unavailableField = incompleteObservation.ruleId === 'image-alt' ? 'Alternative text'
    : incompleteObservation.ruleId === 'label' ? 'Input type' : 'Measured contrast';
  await assert.rejects(assertCanonicalComparisonUi(assertionPage(incomplete,
    { [`after|${unavailableField}`]: 'wrong-unavailable-value' }), incomplete),
  new RegExp(`missing-associated:after\\|${unavailableField}:`));
  assert.equal(uiVisible(incomplete).has(`Incomplete reason: ${incompleteReason}`), true);

  const contrast = valid<CompletedRun>(contrastComparisonRun('improved'));
  await assertCanonicalComparisonUi(assertionPage(contrast), contrast);
  assert.ok(contrast.comparison && 'delta' in contrast.comparison);
  await assert.rejects(assertCanonicalComparisonUi(assertionPage(contrast,
    { 'comparison|Change': 'wrong-delta' }), contrast), /missing-associated:comparison\|Change:/);
});

test('canonical UI assertion accepts unavailable image element kind before and after', async () => {
  const scenario = comparisonScenario('unique-violation');
  const baseline = structuredClone(scenario.baselineRun);
  const later = structuredClone(scenario.laterRun);
  const before = baseline.scan.findings.find(item => item.ruleId === 'image-alt');
  const after = later.scan.findings.find(item => item.ruleId === 'image-alt');
  assert.ok(before && after);
  Object.assign(before.evidence, { elementKind: { unavailable: 'missing' } });
  Object.assign(after.evidence, { elementKind: { unavailable: 'missing' } });
  const run = valid<CompletedRun>(comparisonForRuns(baseline, later, [], before.findingId));
  await assertCanonicalComparisonUi(assertionPage(run), run);
  await assert.rejects(assertCanonicalComparisonUi(assertionPage(run,
    { 'before|Alternative text': 'wrong-alternative-text' }), run),
  /missing-associated:before\|Alternative text:/);
  await assert.rejects(assertCanonicalComparisonUi(assertionPage(run,
    { 'after|Alternative text': undefined }), run), /missing-field:after\|Alternative text/);
});

test('actual sequence observes failed click and rejected response together without unhandled rejection', async () => {
  const unhandled: unknown[] = [];
  const listener = (reason: unknown) => unhandled.push(reason);
  process.on('unhandledRejection', listener);
  try {
    const baselineRoot = negativeRoot('baseline-click');
    const baselineFixture = actualFixture(baselineRoot, 'finding-label', { baselineClickFailure: true });
    await baselineFixture.sequence.start();
    await assert.rejects(baselineFixture.sequence.baseline(), /response-rejected|baseline-click/);
    await baselineFixture.sequence.close();
    cleanupSequenceRoot(baselineRoot, []);

    const rescanRoot = negativeRoot('rescan-click');
    const rescanFixture = actualFixture(rescanRoot, 'finding-label', { rescanClickFailure: true });
    await rescanFixture.sequence.start();
    assert.equal((await rescanFixture.sequence.baseline()).ok, true);
    await assert.rejects(rescanFixture.sequence.rescan('finding-label'), /response-rejected|rescan-click/);
    await rescanFixture.sequence.close();
    cleanupSequenceRoot(rescanRoot, [rescanFixture.baseline.runId]);
    await turn();
    await turn();
    assert.deepEqual(unhandled, []);
  } finally { process.off('unhandledRejection', listener); }
});

test('scratch residue or inspection failure prevents successful completion', async () => {
  for (const [name, affected, throws] of [
    ['scan-residue', 'm103-scan', false],
    ['ui-residue', 'm104-ui', false],
    ['scan-inspection', 'm103-scan', true],
    ['ui-inspection', 'm104-ui', true],
  ] as const) {
    const root = negativeRoot(name);
    const fixture = actualFixture(root, 'finding-label', { inspectScratch: target => {
      if (target.endsWith(affected)) {
        if (throws) throw new Error('inspection-failed');
        return false;
      }
      return true;
    } });
    await fixture.sequence.start();
    await fixture.sequence.baseline();
    await fixture.sequence.rescan('finding-label');
    const shutdown = await fixture.sequence.close();
    assert.equal(affected === 'm103-scan' ? shutdown.scanScratchEmpty : shutdown.uiScratchEmpty, false);
    cleanupSequenceRoot(root, [fixture.baseline.runId, fixture.later.runId]);
    const gateRoot = negativeRoot(`${name}-gate`);
    const controlled = sequence({ async close() { controlled.calls.push('close'); return shutdown; } });
    const result = await runPublicComparisonForTest(['--public'], { root: gateRoot,
      createSequence: () => controlled.value });
    assert.equal(result.ok, false);
    assert.equal(result.stage, 'shutdown');
    assert.deepEqual(result.shutdown, shutdown);
    exactCleanup(gateRoot);
  }
});
