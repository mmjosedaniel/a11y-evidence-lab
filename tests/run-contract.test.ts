import assert from 'node:assert/strict';
import test from 'node:test';
import { validateRun, validateScan } from '../src/server/domain/run-contract.ts';
import type {
  PageAnalysisRun, ScanResult, Finding, ScannerReviewObservation, ProviderContext,
  Fact, ValidationResult,
} from '../src/server/domain/run-contract.ts';

// M101-CONTRACT-01: synthetic records prove the frozen L1 contract only.
// They do not prove native capture, DOM correspondence, persistence, or provider execution.
type RecordValue = Record<string, unknown>;
type Path = readonly (string | number)[];
type Validator = (input: unknown) => ValidationResult<unknown>;
// Green's independent typecheck also verifies the public type-export surface.
type PublicContractTypes = [PageAnalysisRun, ScanResult, Finding, ScannerReviewObservation, ProviderContext, Fact<string>];
type Rule = 'image-alt' | 'label' | 'color-contrast';

const rules: readonly Rule[] = ['image-alt', 'label', 'color-contrast'];
const reasons = ['missing', 'invalid', 'withheld'] as const;
const failureCategories = [
  'navigation', 'timeout', 'browser', 'scanner', 'result-validation',
  'coverage-validation', 'evidence-capture', 'initial-persistence', 'shutdown', 'cleanup',
] as const;
const messageKeys = [
  'nonBmp', 'pseudoContent', 'complexTextShadows', 'colorParse', 'equalRatio',
  'shortTextContent', 'shadowOnBgColor', 'fgOnShadowColor', 'imgNode', 'bgGradient',
  'bgImage', 'bgOverlap', 'elmPartiallyObscuring', 'elmPartiallyObscured', 'outsideViewport',
] as const;
const inputTypes = [
  'button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
  'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search',
  'submit', 'tel', 'text', 'time', 'url', 'week',
] as const;
const attributeStates = ['absent', 'empty', 'whitespace-only', 'non-empty'] as const;
const createdAt = '2026-08-30T10:00:00.000Z';
const scannedAt = '2026-08-30T10:00:01.000Z';
const finishedAt = '2026-08-30T10:00:02.000Z';
const secret = 'SYNTHETIC_SECRET <input value="private">';

function fact(value: unknown): RecordValue { return { value }; }
function unavailable(reason = 'missing'): RecordValue { return { unavailable: reason }; }
function copy<T>(value: T): T { return structuredClone(value); }
function get(value: unknown, path: Path): unknown {
  return path.reduce<unknown>((current, key) => (current as Record<string | number, unknown>)[key], value);
}
function put(value: unknown, path: Path, replacement: unknown): void {
  const parent = get(value, path.slice(0, -1)) as Record<string | number, unknown>;
  parent[path[path.length - 1]!] = replacement;
}
function drop(value: unknown, path: Path): void {
  const parent = get(value, path.slice(0, -1)) as Record<string | number, unknown>;
  delete parent[path[path.length - 1]!];
}

function context(): RecordValue {
  return {
    finalUrl: fact('https://example.org/final?view=summary#results'),
    scannedAt: fact(scannedAt), browserVersion: fact('145.0.7632.6'),
    scannerVersion: '4.13.0', evidencePolicyVersion: 'm1-public-v1', rules: [...rules],
    scope: 'current-rendered-top-level-document', readiness: 'domcontentloaded',
    readinessReached: true, viewport: { width: 1280, height: 720 }, locale: 'en-US',
    timeoutMs: 30000, freshContext: true, importedState: false, interaction: false,
    crawling: false, iframes: false, cleanup: 'closed',
    contrastProfile: 'axe-core-4.13.0-default',
  };
}

function evidence(rule: Rule): RecordValue {
  if (rule === 'image-alt') return { elementKind: fact('img'), altState: fact('absent') };
  if (rule === 'label') return {
    elementKind: fact('input'), inputType: fact('email'),
    nameSources: {
      explicitLabel: fact(false), implicitLabel: fact(false), ariaLabel: fact('absent'),
      ariaLabelledby: fact('unresolved'), title: fact('empty'),
      placeholder: fact('non-empty'), presentationalRole: fact(false),
    },
  };
  return {
    foregroundColor: fact('#777777'), backgroundColor: fact('#ffffff'),
    shadowColor: unavailable(), contrastRatio: fact(4.4), expectedContrastRatio: fact(4.5),
    fontSize: fact('12.0pt (16px)'), fontWeight: fact('normal'), measurementSource: 'axe-core',
    messageKey: fact('bgImage'),
  };
}

function finding(rule: Rule, findingId = `finding-${rule}`): RecordValue {
  const check = { 'image-alt': 'has-alt', label: 'explicit-label', 'color-contrast': 'color-contrast' }[rule];
  return {
    findingId, ruleId: rule, nativeResult: 'violation', state: 'unprocessed',
    checks: fact({ any: [check], all: [], none: [] }),
    locator: fact(':root > :nth-child(1) > :nth-child(2)'), evidence: evidence(rule),
  };
}

function observation(rule: Rule): RecordValue {
  const value = finding(rule);
  delete value.findingId;
  delete value.state;
  value.nativeResult = 'incomplete';
  value.incompleteReason = rule === 'color-contrast' ? fact('bgImage') : unavailable();
  return value;
}

function scanFixture(): RecordValue {
  return {
    context: context(),
    coverage: Object.fromEntries(rules.map(rule => [rule, {
      violations: 1, incomplete: 1, passes: null, inapplicable: null,
    }])),
    findings: rules.map(rule => finding(rule)),
    scannerReviewObservations: rules.map(rule => observation(rule)),
  };
}

function zeroScan(): RecordValue {
  const scan = scanFixture();
  scan.findings = [];
  scan.scannerReviewObservations = [];
  scan.coverage = Object.fromEntries(rules.map(rule => [rule, {
    violations: null, incomplete: null, passes: null, inapplicable: 0,
  }]));
  return scan;
}

function completeRun(scan: unknown = scanFixture(), mode: 'local' | 'groq' = 'local'): RecordValue {
  return {
    formatVersion: 1, runId: 'run-01', createdAt, applicationRevision: 'a'.repeat(40),
    requestedUrl: 'https://example.org/start?view=summary#intro',
    providerContext: mode === 'local'
      ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
      : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' },
    status: 'completed', finishedAt, scan,
  };
}

function runningRun(): RecordValue {
  const run = completeRun();
  delete run.scan;
  delete run.finishedAt;
  run.status = 'running';
  run.scanContext = {
    ...context(), finalUrl: unavailable(), scannedAt: unavailable(),
    browserVersion: unavailable(), readinessReached: false, cleanup: 'pending',
  };
  return run;
}

function failedRun(category: string = 'navigation'): RecordValue {
  const run = runningRun();
  run.status = 'failed';
  run.finishedAt = finishedAt;
  run.failure = { category };
  put(run, ['scanContext', 'cleanup'], category === 'cleanup' ? 'failed' : 'closed');
  if (category === 'initial-persistence') run.scanContext = context();
  return run;
}

function assertDeepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.equal(Object.isFrozen(value), true);
  for (const key of Reflect.ownKeys(value)) {
    assertDeepFrozen(Object.getOwnPropertyDescriptor(value, key)!.value);
  }
}

function assertDetached(input: unknown, output: unknown): void {
  if (typeof input !== 'object' || input === null) return;
  assert.notStrictEqual(output, input);
  for (const key of Object.keys(input)) {
    assertDetached((input as RecordValue)[key], (output as RecordValue)[key]);
  }
}

function accept(validator: Validator, input: unknown): unknown {
  const result = validator(input);
  assert.equal(result.ok, true);
  assert.deepEqual(Reflect.ownKeys(result).sort(), ['ok', 'value']);
  assertDeepFrozen(result);
  assert.ok(result.ok);
  assert.deepEqual(JSON.parse(JSON.stringify(result.value)), JSON.parse(JSON.stringify(input)));
  assertDetached(input, result.value);
  return result.value;
}

function reject(validator: Validator, input: unknown, error: string): void {
  const result = validator(input);
  assert.deepEqual(result, { ok: false, error });
  assert.deepEqual(Reflect.ownKeys(result).sort(), ['error', 'ok']);
  assert.equal(Object.isFrozen(result), true);
}

function acceptScan(scan: unknown): unknown {
  const result = accept(validateScan, scan);
  accept(validateRun, completeRun(scan));
  return result;
}
function rejectScan(scan: unknown): void {
  reject(validateScan, scan, 'invalid-scan');
  reject(validateRun, completeRun(scan), 'invalid-run');
}
function rejectRun(run: unknown): void { reject(validateRun, run, 'invalid-run'); }

// I1-I3, I6: parent status, provider independence, complete collections and failures.
test('accepts exactly the three parent shapes and every content-safe failure category', () => {
  accept(validateRun, runningRun());
  accept(validateRun, completeRun());
  for (const category of failureCategories) accept(validateRun, failedRun(category));
  for (const status of ['created', 'queued', 'paused', 'cancelled', 'partial', 'complete', '', null]) {
    const run = completeRun();
    run.status = status;
    rejectRun(run);
  }
});

test('accepts explicit Local and Groq context without changing scan meaning or requiring readiness', () => {
  const scan = scanFixture();
  const local = accept(validateRun, completeRun(scan, 'local'));
  const groq = accept(validateRun, completeRun(scan, 'groq'));
  assert.deepEqual(get(local, ['scan']), get(groq, ['scan']));
  assert.deepEqual(get(local, ['providerContext']), { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' });
  assert.deepEqual(get(groq, ['providerContext']), { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' });
  for (const providerContext of [
    null, {}, { mode: 'local' },
    { mode: 'local', provider: 'groq', model: 'qwen3.5:4b' },
    { mode: 'groq', provider: 'groq', model: 'qwen3.5:4b' },
    { mode: 'local', provider: 'ollama', model: 'qwen3.5:9b' },
    { mode: 'Local', provider: 'ollama', model: 'qwen3.5:4b' },
    { mode: 'groq', provider: 'openai', model: 'openai/gpt-oss-20b' },
  ]) {
    const run = completeRun();
    run.providerContext = providerContext;
    rejectRun(run);
  }
  const missing = completeRun();
  delete missing.providerContext;
  rejectRun(missing);
});

test('running and failed parents cannot carry successful collections or incompatible branch keys', () => {
  for (const make of [runningRun, failedRun]) {
    for (const [key, value] of Object.entries({ scan: scanFixture(), coverage: {}, findings: [], scannerReviewObservations: [] })) {
      const run = make();
      run[key] = value;
      rejectRun(run);
    }
    for (const key of Object.keys(context())) {
      const run = make();
      drop(run, ['scanContext', key]);
      rejectRun(run);
    }
  }
  const extraRunning = runningRun();
  extraRunning.finishedAt = finishedAt;
  rejectRun(extraRunning);
  const runningFailure = runningRun();
  runningFailure.failure = { category: 'timeout' };
  rejectRun(runningFailure);
  for (const key of ['scanContext', 'failure']) {
    const run = completeRun();
    run[key] = key === 'scanContext' ? context() : { category: 'scanner' };
    rejectRun(run);
  }
  for (const [make, key] of [[runningRun, 'scanContext'], [failedRun, 'failure'], [failedRun, 'finishedAt'], [completeRun, 'scan']] as const) {
    const run = make();
    delete run[key];
    rejectRun(run);
  }
});

test('cleanup and initial-persistence failures enforce their precise context relationships', () => {
  for (const cleanup of ['closed', 'failed']) {
    const run = runningRun();
    put(run, ['scanContext', 'cleanup'], cleanup);
    rejectRun(run);
  }
  const pendingFailure = failedRun();
  put(pendingFailure, ['scanContext', 'cleanup'], 'pending');
  rejectRun(pendingFailure);
  const primaryWithCleanupFailure = failedRun('scanner');
  put(primaryWithCleanupFailure, ['scanContext', 'cleanup'], 'failed');
  accept(validateRun, primaryWithCleanupFailure);
  const falseCleanup = failedRun('cleanup');
  put(falseCleanup, ['scanContext', 'cleanup'], 'closed');
  rejectRun(falseCleanup);
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion']) {
    const run = failedRun('initial-persistence');
    put(run, ['scanContext', key], unavailable());
    rejectRun(run);
  }
  for (const [key, value] of [['readinessReached', false], ['cleanup', 'failed']] as const) {
    const run = failedRun('initial-persistence');
    put(run, ['scanContext', key], value);
    rejectRun(run);
  }
  for (const failure of [{ category: 'other' }, {}, { category: 'scanner', message: secret }, { category: { value: secret } }, secret]) {
    const run = failedRun();
    run.failure = failure;
    rejectRun(run);
  }
});

test('noncompleted provenance preserves independent observations without inventing final URL or scan time', () => {
  for (const reason of ['missing', 'invalid']) {
    for (const make of [runningRun, failedRun]) {
      const run = make();
      for (const key of ['finalUrl', 'scannedAt', 'browserVersion']) put(run, ['scanContext', key], unavailable(reason));
      const output = accept(validateRun, run);
      assert.deepEqual(get(output, ['scanContext', 'finalUrl']), unavailable(reason));
    }
  }
  const observedBeforeScan = runningRun();
  put(observedBeforeScan, ['scanContext', 'finalUrl'], fact('https://example.org/redirected'));
  put(observedBeforeScan, ['scanContext', 'browserVersion'], fact('145'));
  accept(validateRun, observedBeforeScan);
  const collectedBeforePublication = runningRun();
  collectedBeforePublication.scanContext = { ...context(), cleanup: 'pending' };
  accept(validateRun, collectedBeforePublication);
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion']) {
    const run = runningRun();
    put(run, ['scanContext', key], unavailable('withheld'));
    rejectRun(run);
  }
  const prematureTime = runningRun();
  put(prematureTime, ['scanContext', 'scannedAt'], fact(scannedAt));
  rejectRun(prematureTime);
});

test('requires complete observed provenance and terminal cleanup for validateScan', () => {
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion']) {
    for (const reason of ['missing', 'invalid']) {
      const scan = scanFixture();
      put(scan, ['context', key], unavailable(reason));
      rejectScan(scan);
    }
  }
  for (const [key, value] of [['readinessReached', false], ['cleanup', 'pending'], ['cleanup', 'failed']] as const) {
    const scan = scanFixture();
    put(scan, ['context', key], value);
    rejectScan(scan);
  }
});

test('accepts nonzero, valid zero, native incomplete-only, passes-only, and mixed coverage', () => {
  acceptScan(scanFixture());
  acceptScan(zeroScan());
  const incompleteOnly = scanFixture();
  incompleteOnly.findings = [];
  for (const rule of rules) put(incompleteOnly, ['coverage', rule, 'violations'], null);
  const output = acceptScan(incompleteOnly);
  assert.deepEqual(get(output, ['findings']), []);
  assert.equal((get(output, ['scannerReviewObservations']) as unknown[]).length, 3);
  const passed = zeroScan();
  for (const rule of rules) put(passed, ['coverage', rule], { violations: null, incomplete: null, passes: 2, inapplicable: null });
  acceptScan(passed);
  const mixed = scanFixture();
  for (const rule of rules) {
    put(mixed, ['coverage', rule, 'passes'], 2);
    put(mixed, ['coverage', rule, 'inapplicable'], 3);
  }
  acceptScan(mixed);
});

test('rejects absent, extra, all-null, contradictory, unsafe, and count-mismatched coverage', () => {
  for (const rule of rules) {
    const missing = scanFixture();
    drop(missing, ['coverage', rule]);
    rejectScan(missing);
    const blank = zeroScan();
    put(blank, ['coverage', rule], { violations: null, incomplete: null, passes: null, inapplicable: null });
    rejectScan(blank);
    const contradiction = scanFixture();
    put(contradiction, ['coverage', rule, 'inapplicable'], 0);
    rejectScan(contradiction);
    for (const bucket of ['violations', 'incomplete', 'passes']) {
      const zeroWithAnotherBucket = zeroScan();
      put(zeroWithAnotherBucket, ['coverage', rule, bucket], 1);
      if (bucket === 'violations') zeroWithAnotherBucket.findings = [finding(rule)];
      if (bucket === 'incomplete') zeroWithAnotherBucket.scannerReviewObservations = [observation(rule)];
      rejectScan(zeroWithAnotherBucket);
    }
    for (const key of ['violations', 'incomplete']) {
      for (const count of [null, 2]) {
        const mismatch = scanFixture();
        put(mismatch, ['coverage', rule, key], count);
        rejectScan(mismatch);
      }
    }
    for (const key of ['violations', 'incomplete', 'passes', 'inapplicable']) {
      for (const count of [-1, -0, 0.5, Number.MAX_SAFE_INTEGER + 1, Infinity, NaN, '1']) {
        const invalid = scanFixture();
        put(invalid, ['coverage', rule, key], count);
        rejectScan(invalid);
      }
    }
    for (const key of ['violations', 'incomplete', 'passes']) {
      const invalid = scanFixture();
      put(invalid, ['coverage', rule, key], 0);
      rejectScan(invalid);
    }
  }
  const extra = scanFixture();
  put(extra, ['coverage', 'heading-order'], { violations: null, incomplete: null, passes: 1, inapplicable: null });
  rejectScan(extra);
  const swappedCounts = scanFixture();
  (swappedCounts.findings as RecordValue[])[0] = finding('label', 'second-label');
  rejectScan(swappedCounts);
  const hugePassCount = zeroScan();
  put(hugePassCount, ['coverage', 'label'], { violations: null, incomplete: null, passes: Number.MAX_SAFE_INTEGER, inapplicable: null });
  acceptScan(hugePassCount);
});

test('retains every item, duplicate locator, case-sensitive ID, order, and native incomplete category', () => {
  const scan = zeroScan();
  const findings = Array.from({ length: 257 }, (_, i) => finding('image-alt', `node-${i}`));
  findings.push(finding('image-alt', 'Node-0'));
  scan.findings = findings;
  put(scan, ['coverage', 'image-alt'], { violations: findings.length, incomplete: null, passes: null, inapplicable: null });
  const output = acceptScan(scan);
  assert.equal((get(output, ['findings']) as unknown[]).length, 258);
  assert.deepEqual(get(output, ['findings']), findings);
  findings.reverse();
  const reordered = acceptScan(scan);
  assert.deepEqual((get(reordered, ['findings']) as RecordValue[]).map(item => item.findingId), findings.map(item => item.findingId));
  const duplicate = copy(scan);
  put(duplicate, ['findings', 1, 'findingId'], get(duplicate, ['findings', 0, 'findingId']));
  rejectScan(duplicate);
  const duplicateAcrossRules = scanFixture();
  put(duplicateAcrossRules, ['findings', 1, 'findingId'], get(duplicateAcrossRules, ['findings', 0, 'findingId']));
  rejectScan(duplicateAcrossRules);
  const observations = scanFixture();
  (observations.scannerReviewObservations as unknown[]).push(observation('image-alt'));
  put(observations, ['coverage', 'image-alt', 'incomplete'], 2);
  acceptScan(observations);
  for (const [collection, key, value] of [
    ['findings', 'nativeResult', 'incomplete'], ['findings', 'state', 'accepted'],
    ['findings', 'ruleId', 'heading-order'], ['scannerReviewObservations', 'nativeResult', 'violation'],
    ['scannerReviewObservations', 'findingId', 'observation-1'], ['scannerReviewObservations', 'state', 'unprocessed'],
    ['scannerReviewObservations', 'eligible', true], ['scannerReviewObservations', 'observationId', 'extra-id'],
  ] as const) {
    const invalid = scanFixture();
    put(invalid, [collection, 0, key], value);
    rejectScan(invalid);
  }
});

// I4: unavailable facts preserve items; malformed durable values reject rather than repair.
const ordinaryFactPaths: readonly Path[] = [
  ['findings', 0, 'checks'], ['findings', 0, 'evidence', 'elementKind'], ['findings', 0, 'evidence', 'altState'],
  ['findings', 1, 'checks'], ['findings', 1, 'evidence', 'inputType'],
  ...['explicitLabel', 'implicitLabel', 'ariaLabel', 'ariaLabelledby', 'title', 'placeholder', 'presentationalRole']
    .map(key => ['findings', 1, 'evidence', 'nameSources', key] as Path),
  ['findings', 2, 'checks'],
  ...['foregroundColor', 'backgroundColor', 'shadowColor', 'contrastRatio', 'expectedContrastRatio', 'fontSize', 'fontWeight', 'messageKey']
    .map(key => ['findings', 2, 'evidence', key] as Path),
];
const observationFactPaths: readonly Path[] = ordinaryFactPaths.map(path => ['scannerReviewObservations', ...path.slice(1)]);

test('preserves missing, invalid, and withheld facts and siblings without dropping or inventing evidence', () => {
  for (const path of ordinaryFactPaths) {
    for (const reason of reasons) {
      const scan = scanFixture();
      put(scan, path, unavailable(reason));
      const output = acceptScan(scan);
      assert.deepEqual(get(output, path), unavailable(reason));
      assert.deepEqual(get(output, ['findings']), get(scan, ['findings']));
      assert.deepEqual(get(output, ['scannerReviewObservations']), get(scan, ['scannerReviewObservations']));
    }
  }
  for (const reason of reasons) {
    const scan = scanFixture();
    put(scan, ['findings', 1, 'evidence', 'elementKind'], unavailable(reason));
    put(scan, ['findings', 1, 'evidence', 'inputType'], unavailable(reason));
    acceptScan(scan);
    for (const index of [0, 1, 2]) put(scan, ['scannerReviewObservations', index, 'checks'], unavailable(reason));
    put(scan, ['scannerReviewObservations', 2, 'evidence', 'messageKey'], unavailable(reason));
    put(scan, ['scannerReviewObservations', 2, 'incompleteReason'], unavailable(reason));
    acceptScan(scan);
  }
  for (const path of observationFactPaths) {
    for (const reason of reasons) {
      const scan = scanFixture();
      put(scan, path, unavailable(reason));
      // Contrast observation reason is the same native fact, not an independent diagnosis.
      put(scan, ['scannerReviewObservations', 2, 'incompleteReason'], copy(get(scan, ['scannerReviewObservations', 2, 'evidence', 'messageKey'])));
      const output = acceptScan(scan);
      assert.deepEqual(get(output, path), unavailable(reason));
    }
  }
});

test('rejects absent or malformed fact objects rather than converting them to unavailable', () => {
  for (const path of [...ordinaryFactPaths, ...observationFactPaths]) {
    for (const malformed of [null, undefined, {}, { unavailable: 'other' }, { unavailable: 'not-applicable' }, { value: null }, { value: 'x', unavailable: 'missing' }, { unavailable: 'missing', detail: secret }]) {
      const scan = scanFixture();
      put(scan, path, malformed);
      rejectScan(scan);
    }
    const missing = scanFixture();
    drop(missing, path);
    rejectScan(missing);
  }
});

test('accepts exact image attribute states and rejects cross-rule or raw evidence', () => {
  for (const state of attributeStates) {
    const scan = scanFixture();
    put(scan, ['findings', 0, 'evidence', 'altState'], fact(state));
    acceptScan(scan);
  }
  for (const [path, value] of [
    [['findings', 0, 'evidence', 'elementKind'], fact('svg')],
    [['findings', 0, 'evidence', 'altState'], fact('A descriptive alt text')],
    [['findings', 0, 'evidence'], evidence('label')],
    [['findings', 1, 'evidence'], evidence('color-contrast')],
    [['findings', 2, 'evidence'], evidence('image-alt')],
  ] as const) {
    const scan = scanFixture();
    put(scan, path, value);
    rejectScan(scan);
  }
});

test('label evidence retains association categories, all input types, and textarea-dependent unavailability', () => {
  for (const inputType of inputTypes) {
    const scan = scanFixture();
    put(scan, ['findings', 1, 'evidence', 'inputType'], fact(inputType));
    acceptScan(scan);
  }
  const textarea = scanFixture();
  put(textarea, ['findings', 1, 'evidence', 'elementKind'], fact('textarea'));
  put(textarea, ['findings', 1, 'evidence', 'inputType'], unavailable('not-applicable'));
  acceptScan(textarea);
  for (const [kind, inputType] of [
    [fact('textarea'), fact('text')], [fact('textarea'), unavailable('missing')],
    [fact('input'), unavailable('not-applicable')], [fact('select'), fact('text')],
    [unavailable(), fact('text')], [unavailable(), unavailable('not-applicable')],
    [fact('input'), fact('EMAIL')],
  ]) {
    const scan = scanFixture();
    put(scan, ['findings', 1, 'evidence', 'elementKind'], kind);
    put(scan, ['findings', 1, 'evidence', 'inputType'], inputType);
    rejectScan(scan);
  }
  for (const key of ['explicitLabel', 'implicitLabel', 'presentationalRole']) {
    for (const value of [true, false]) {
      const scan = scanFixture();
      put(scan, ['findings', 1, 'evidence', 'nameSources', key], fact(value));
      acceptScan(scan);
    }
    const scan = scanFixture();
    put(scan, ['findings', 1, 'evidence', 'nameSources', key], fact('true'));
    rejectScan(scan);
  }
  for (const key of ['ariaLabel', 'title', 'placeholder']) {
    for (const value of attributeStates) {
      const scan = scanFixture();
      put(scan, ['findings', 1, 'evidence', 'nameSources', key], fact(value));
      acceptScan(scan);
    }
  }
  for (const value of ['absent', 'empty', 'unresolved', 'partially-resolved', 'resolved']) {
    const scan = scanFixture();
    put(scan, ['findings', 1, 'evidence', 'nameSources', 'ariaLabelledby'], fact(value));
    acceptScan(scan);
  }
  const rawReference = scanFixture();
  put(rawReference, ['findings', 1, 'evidence', 'nameSources', 'ariaLabelledby'], fact('field-label-id'));
  rejectScan(rawReference);
});

test('native contrast fields preserve measurements without recomputing outcomes or inventing shadow data', () => {
  for (const ratio of [1, 3, 4.5, 21]) {
    const scan = scanFixture();
    put(scan, ['findings', 2, 'evidence', 'contrastRatio'], fact(ratio));
    acceptScan(scan);
  }
  for (const expected of [3, 4.5]) {
    const scan = scanFixture();
    put(scan, ['findings', 2, 'evidence', 'expectedContrastRatio'], fact(expected));
    acceptScan(scan);
  }
  for (const value of ['0.0pt (0.01px)', '12.0pt (16px)', '0012.0pt (0016.00px)']) {
    const scan = scanFixture();
    put(scan, ['findings', 2, 'evidence', 'fontSize'], fact(value));
    acceptScan(scan);
  }
  for (const value of ['normal', 'bold']) {
    const scan = scanFixture();
    put(scan, ['findings', 2, 'evidence', 'fontWeight'], fact(value));
    acceptScan(scan);
  }
  for (const key of ['foregroundColor', 'backgroundColor', 'shadowColor']) {
    for (const color of ['#000000', '#abcdef', '#ffffff']) {
      const scan = scanFixture();
      put(scan, ['findings', 2, 'evidence', key], fact(color));
      acceptScan(scan);
    }
  }
  for (const key of messageKeys) {
    const scan = scanFixture();
    put(scan, ['findings', 2, 'evidence', 'messageKey'], fact(key));
    put(scan, ['scannerReviewObservations', 2, 'evidence', 'messageKey'], fact(key));
    put(scan, ['scannerReviewObservations', 2, 'incompleteReason'], fact(key));
    const output = acceptScan(scan);
    assert.deepEqual(get(output, ['findings', 2, 'evidence', 'shadowColor']), unavailable());
  }
});

test('rejects malformed native contrast representations and mismatched incomplete reasons', () => {
  const invalidByField: Record<string, unknown[]> = {
    contrastRatio: [0, -0, 0.99, 21.01, NaN, Infinity, '4.4'],
    expectedContrastRatio: [3.1, '3:1', '4.5:1'],
    foregroundColor: ['#ABCDEF', '#fff', 'rgb(0,0,0)', '#000000\n'],
    backgroundColor: ['transparent', '#12345678'], shadowColor: ['none', ''],
    fontSize: ['12pt (16px)', '12.00pt (16px)', '12.0pt (0px)', '-1.0pt (1px)', '1.0pt (1e2px)', ' 12.0pt (16px)', '12.0pt (16px)\n', `${'9'.repeat(60)}.0pt (1px)`],
    fontWeight: [400, '400', 'bolder'], messageKey: ['unknown-native-message', secret],
  };
  for (const [field, values] of Object.entries(invalidByField)) {
    for (const value of values) {
      const scan = scanFixture();
      put(scan, ['findings', 2, 'evidence', field], fact(value));
      rejectScan(scan);
    }
  }
  const invalidSource = scanFixture();
  put(invalidSource, ['findings', 2, 'evidence', 'measurementSource'], 'recomputed');
  rejectScan(invalidSource);
  for (const reason of [fact('bgGradient'), unavailable('missing'), { value: 'bgImage', detail: secret }]) {
    const scan = scanFixture();
    put(scan, ['scannerReviewObservations', 2, 'incompleteReason'], reason);
    rejectScan(scan);
  }
  const wrongUnavailableBranch = scanFixture();
  put(wrongUnavailableBranch, ['scannerReviewObservations', 2, 'evidence', 'messageKey'], unavailable('invalid'));
  put(wrongUnavailableBranch, ['scannerReviewObservations', 2, 'incompleteReason'], unavailable('missing'));
  rejectScan(wrongUnavailableBranch);
  for (const index of [0, 1]) {
    const withheld = scanFixture();
    put(withheld, ['scannerReviewObservations', index, 'incompleteReason'], unavailable('withheld'));
    acceptScan(withheld);
    for (const reason of [unavailable('invalid'), fact('bgImage'), fact(secret)]) {
      const scan = scanFixture();
      put(scan, ['scannerReviewObservations', index, 'incompleteReason'], reason);
      rejectScan(scan);
    }
  }
});

test('check identity accepts only each rule native group membership, without guessed results', () => {
  const anyIds = [
    ['has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title', 'presentational-role'],
    ['implicit-label', 'explicit-label', 'aria-label', 'aria-labelledby', 'non-empty-title', 'non-empty-placeholder', 'presentational-role'],
    ['color-contrast'],
  ];
  const noneIds = [['alt-space-value'], ['hidden-explicit-label'], []];
  for (const [index, ids] of anyIds.entries()) {
    for (const id of ids) {
      const scan = scanFixture();
      put(scan, ['findings', index, 'checks'], fact({ any: [id], all: [], none: [] }));
      acceptScan(scan);
    }
    const allGroups = scanFixture();
    put(allGroups, ['findings', index, 'checks'], fact({ any: ids, all: [], none: noneIds[index] }));
    acceptScan(allGroups);
    for (const groups of [
      { any: [], all: [], none: [] }, { any: [ids[0], ids[0]], all: [], none: [] },
      { any: ids, all: [ids[0]], none: [] }, { any: ['unknown-check'], all: [], none: [] },
      { any: ids, all: [], none: ['unknown-check'] }, { any: ids, all: [], none: [], result: false },
    ]) {
      const scan = scanFixture();
      put(scan, ['findings', index, 'checks'], fact(groups));
      rejectScan(scan);
    }
  }
  for (const [index, id] of [[0, 'alt-space-value'], [1, 'hidden-explicit-label']] as const) {
    const noneOnly = scanFixture();
    put(noneOnly, ['findings', index, 'checks'], fact({ any: [], all: [], none: [id] }));
    acceptScan(noneOnly);
    for (const groups of [
      { any: [id], all: [], none: [] }, { any: [], all: [], none: [id, id] },
    ]) {
      const scan = scanFixture();
      put(scan, ['findings', index, 'checks'], fact(groups));
      rejectScan(scan);
    }
  }
  const wrongContrastGroup = scanFixture();
  put(wrongContrastGroup, ['findings', 2, 'checks'], fact({ any: [], all: [], none: ['color-contrast'] }));
  rejectScan(wrongContrastGroup);
});

test('locator syntax permits only bounded structural paths or explicit unavailability', () => {
  const atLimit = ':root' + ' > :nth-child(1)'.repeat(126) + ' > :nth-child(123456789012)';
  assert.equal(atLimit.length, 2048);
  for (const locator of [':root', ':root > :nth-child(9007199254740991)', atLimit]) {
    const scan = scanFixture();
    put(scan, ['findings', 0, 'locator'], fact(locator));
    acceptScan(scan);
  }
  for (const reason of [...reasons, 'unsupported', 'too-long']) {
    const scan = scanFixture();
    put(scan, ['findings', 0, 'locator'], unavailable(reason));
    put(scan, ['scannerReviewObservations', 0, 'locator'], unavailable(reason));
    acceptScan(scan);
  }
  for (const locator of [
    '', '#private-id', '.class', 'img', '[value="private"]', ':root > img',
    ':root > :nth-child(0)', ':root > :nth-child(01)', ':root > :nth-child(-1)',
    ':root > :nth-child(1.5)', ':root > :nth-child(9007199254740992)',
    ':root>:nth-child(1)', ':root\n', `${atLimit} `, `${atLimit} > :nth-child(1)`,
  ]) {
    const scan = scanFixture();
    put(scan, ['findings', 0, 'locator'], fact(locator));
    rejectScan(scan);
  }
  const unknownReason = scanFixture();
  put(unknownReason, ['findings', 0, 'locator'], unavailable('ambiguous'));
  rejectScan(unknownReason);
});

// I3, I5, I8: exact provenance values and closed aggregate sections.
test('validates IDs, format version, revision and canonical UTC instants at their boundaries', () => {
  for (const id of ['A', '0', 'a'.repeat(64), 'A_b-9']) {
    const run = completeRun();
    run.runId = id;
    put(run, ['scan', 'findings', 0, 'findingId'], id);
    accept(validateRun, run);
  }
  for (const id of ['', '-a', '_a', 'a'.repeat(65), 'with space', 'é', 'a\n']) {
    const run = completeRun();
    run.runId = id;
    rejectRun(run);
    const scan = scanFixture();
    put(scan, ['findings', 0, 'findingId'], id);
    rejectScan(scan);
  }
  for (const version of [0, 2, '1', null]) {
    const run = completeRun();
    run.formatVersion = version;
    rejectRun(run);
  }
  for (const revision of ['A'.repeat(40), 'a'.repeat(39), 'a'.repeat(41), 'g'.repeat(40), `${'a'.repeat(39)}\n`]) {
    const run = completeRun();
    run.applicationRevision = revision;
    rejectRun(run);
  }
  for (const time of [
    '2026-02-29T10:00:00.000Z', '2026-13-01T10:00:00.000Z', '2026-08-30T24:00:00.000Z',
    '2026-08-30T10:00:00Z', '2026-08-30T10:00:00.000+00:00', '2026-08-30T10:00:00.000Z\n',
  ]) {
    for (const path of [['createdAt'], ['finishedAt'], ['scan', 'context', 'scannedAt', 'value']] as const) {
      const run = completeRun();
      put(run, path, time);
      rejectRun(run);
    }
  }
  for (const time of ['0000-01-01T00:00:00.000Z', '2024-02-29T00:00:00.000Z', '9999-12-31T23:59:59.999Z']) {
    const run = completeRun();
    run.createdAt = time;
    run.finishedAt = time;
    put(run, ['scan', 'context', 'scannedAt'], fact(time));
    accept(validateRun, run);
  }
});

test('enforces chronology in completed, failed and observed running snapshots without reading the clock', () => {
  const beforeCreation = runningRun();
  beforeCreation.scanContext = { ...context(), cleanup: 'pending' };
  put(beforeCreation, ['scanContext', 'scannedAt'], fact('2026-08-30T09:59:59.999Z'));
  rejectRun(beforeCreation);
  for (const make of [completeRun, failedRun]) {
    const run = make();
    run.finishedAt = '2026-08-30T09:59:59.999Z';
    rejectRun(run);
  }
  const scanBeforeCreation = completeRun();
  put(scanBeforeCreation, ['scan', 'context', 'scannedAt'], fact('2026-08-30T09:59:59.999Z'));
  rejectRun(scanBeforeCreation);
  const scanAfterFinish = completeRun();
  put(scanAfterFinish, ['scan', 'context', 'scannedAt'], fact('2026-08-30T10:00:03.000Z'));
  rejectRun(scanAfterFinish);
  const failedAfterScan = failedRun('scanner');
  failedAfterScan.scanContext = context();
  failedAfterScan.finishedAt = createdAt;
  rejectRun(failedAfterScan);
  const equal = completeRun();
  equal.finishedAt = createdAt;
  put(equal, ['scan', 'context', 'scannedAt'], fact(createdAt));
  accept(validateRun, equal);
});

test('preserves canonical HTTPS path, query and fragment only in requested and observed final provenance', () => {
  for (const url of ['https://example.org/', 'https://example.org/a%20b?q=hello%20world#part', `https://example.org/${'a'.repeat(4096)}`]) {
    const run = completeRun();
    run.requestedUrl = url;
    put(run, ['scan', 'context', 'finalUrl'], fact(url));
    const output = accept(validateRun, run);
    assert.equal(get(output, ['requestedUrl']), url);
    assert.deepEqual(get(output, ['scan', 'context', 'finalUrl']), fact(url));
  }
  for (const url of [
    'https://example.org', 'HTTPS://EXAMPLE.ORG/', 'https://example.org:443/', 'https://example.org/a/../b',
    ' http://example.org/', 'http://example.org/', 'file:///tmp/page.html', 'data:text/html,private',
    'https://user:password@example.org/', 'https://user@example.org/', 'https://', 'not a URL',
  ]) {
    const run = completeRun();
    run.requestedUrl = url;
    rejectRun(run);
    const scan = scanFixture();
    put(scan, ['context', 'finalUrl'], fact(url));
    rejectScan(scan);
    const failed = failedRun();
    put(failed, ['scanContext', 'finalUrl'], fact(url));
    rejectRun(failed);
  }
});

test('enforces pinned scan policy while accepting explicit readiness, locale and numeric boundaries', () => {
  for (const readiness of ['domcontentloaded', 'load', 'networkidle']) {
    const scan = scanFixture();
    put(scan, ['context', 'readiness'], readiness);
    acceptScan(scan);
  }
  for (const locale of ['en', 'en-US', 'es-CO']) {
    const scan = scanFixture();
    put(scan, ['context', 'locale'], locale);
    acceptScan(scan);
  }
  for (const version of ['1', '1.2', '1.2.3', '1.2.3.4', '1'.repeat(64)]) {
    const scan = scanFixture();
    put(scan, ['context', 'browserVersion'], fact(version));
    acceptScan(scan);
  }
  for (const path of [['timeoutMs'], ['viewport', 'width'], ['viewport', 'height']] as const) {
    for (const value of [1, Number.MAX_SAFE_INTEGER]) {
      const scan = scanFixture();
      put(scan, ['context', ...path], value);
      acceptScan(scan);
    }
    for (const value of [0, -0, -1, 1.1, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, '1']) {
      const scan = scanFixture();
      put(scan, ['context', ...path], value);
      rejectScan(scan);
    }
  }
  const invalidFields: Record<string, unknown[]> = {
    scannerVersion: ['4.12.0'], evidencePolicyVersion: ['rd003-scan-v1'],
    scope: ['all-documents'], readiness: ['default', 'DOMContentLoaded'], readinessReached: ['true'],
    freshContext: [false], importedState: [true], interaction: [true], crawling: [true], iframes: [true],
    cleanup: ['complete'], contrastProfile: ['custom'],
    locale: ['', 'en-us', 'en_US', 'x'.repeat(65)],
    rules: [['label', 'image-alt', 'color-contrast'], ['image-alt', 'label'], [...rules, 'heading-order'], ['image-alt', 'label', 'label']],
    browserVersion: [fact('1.2.3.4.5'), fact('v145'), fact('1.'), fact('1\n'), fact('1'.repeat(65))],
  };
  for (const [key, values] of Object.entries(invalidFields)) {
    for (const value of values) {
      const scan = scanFixture();
      put(scan, ['context', key], value);
      rejectScan(scan);
      const running = runningRun();
      put(running, ['scanContext', key], value);
      rejectRun(running);
    }
  }
});

const objectPaths: readonly Path[] = [
  [], ['providerContext'], ['scan'], ['scan', 'context'], ['scan', 'context', 'viewport'],
  ['scan', 'context', 'finalUrl'], ['scan', 'coverage'], ...rules.map(rule => ['scan', 'coverage', rule] as Path),
  ...[0, 1, 2].flatMap(index => [
    ['scan', 'findings', index], ['scan', 'findings', index, 'checks'],
    ['scan', 'findings', index, 'checks', 'value'], ['scan', 'findings', index, 'locator'],
    ['scan', 'findings', index, 'evidence'], ['scan', 'scannerReviewObservations', index],
    ['scan', 'scannerReviewObservations', index, 'incompleteReason'],
  ] as Path[]),
  ['scan', 'findings', 1, 'evidence', 'nameSources'],
  ...ordinaryFactPaths.map(path => ['scan', ...path] as Path),
  ...observationFactPaths.map(path => ['scan', ...path] as Path),
];

test('every declared object key is required and synthetic prohibited content cannot enter nested sections', () => {
  for (const path of objectPaths) {
    const original = get(completeRun(), path) as RecordValue;
    for (const key of Object.keys(original)) {
      const run = completeRun();
      drop(run, [...path, key]);
      rejectRun(run);
    }
    for (const key of ['rawHtml', 'rawScannerPayload', 'pageText', 'credentials', 'providerPayload', 'url', 'unexpected']) {
      const run = completeRun();
      put(run, [...path, key], secret);
      rejectRun(run);
    }
  }
  for (const key of ['scanId', 'evidenceId', 'providerInvocation', 'retrieval', 'proposal', 'review', 'comparison', 'baselineRunId']) {
    const run = completeRun();
    run[key] = { secret };
    rejectRun(run);
  }
  for (const path of [['failure'], ['scanContext'], ['providerContext']] as const) {
    const run = failedRun();
    put(run, [...path, 'rawException'], secret);
    rejectRun(run);
  }
  const selectedProvider = scanFixture();
  put(selectedProvider, ['findings', 0, 'providerContext'], completeRun().providerContext);
  rejectScan(selectedProvider);
});

// I7-I8: readonly ownership, JSON boundaries and non-JSON object rejection.
test('detaches all returned containers, freezes wrappers and preserves caller and sibling values', () => {
  const input = completeRun();
  const original = copy(input);
  const output = accept(validateRun, input);
  assert.deepEqual(input, original);
  assert.equal(Object.isFrozen(input), false);
  put(input, ['providerContext', 'model'], 'caller-change');
  put(input, ['scan', 'context', 'viewport', 'width'], 2);
  put(input, ['scan', 'findings', 0, 'evidence', 'altState', 'value'], 'non-empty');
  (get(input, ['scan', 'findings', 0, 'checks', 'value', 'any']) as unknown[]).push('caller-change');
  (get(input, ['scan', 'findings']) as unknown[]).reverse();
  assert.deepEqual(output, original);
  assert.throws(() => put(output, ['providerContext', 'model'], 'mutation'), TypeError);
  assert.throws(() => put(output, ['scan', 'findings', 0, 'evidence', 'altState', 'value'], 'mutation'), TypeError);
  assert.throws(() => (get(output, ['scan', 'findings']) as unknown[]).pop(), TypeError);
  assert.deepEqual(get(output, ['scan', 'findings', 1]), get(original, ['scan', 'findings', 1]));
  const second = accept(validateRun, original);
  assert.notStrictEqual(second, output);
  assertDetached(output, second);
});

test('shared input aliases, already-frozen records and JSON round trips remain valid and newly detached', () => {
  const scan = scanFixture();
  const sharedFact = unavailable('withheld');
  put(scan, ['findings', 0, 'evidence', 'altState'], sharedFact);
  put(scan, ['findings', 1, 'evidence', 'inputType'], sharedFact);
  const output = acceptScan(scan);
  sharedFact.unavailable = 'invalid';
  assert.deepEqual(get(output, ['findings', 0, 'evidence', 'altState']), unavailable('withheld'));
  assert.deepEqual(get(output, ['findings', 1, 'evidence', 'inputType']), unavailable('withheld'));
  acceptScan(output);
  const run = accept(validateRun, completeRun());
  accept(validateRun, run);
  const parsed: unknown = JSON.parse(JSON.stringify(run));
  assert.equal(Object.isFrozen(parsed), false);
  const revalidated = accept(validateRun, parsed);
  assert.deepEqual(revalidated, run);
  const invalidParsed: unknown = JSON.parse('{"formatVersion":1,"status":"completed"}');
  rejectRun(invalidParsed);
  const poisoned = completeRun();
  Object.defineProperty(poisoned, '__proto__', { value: { rawHtml: secret }, enumerable: true });
  const parsedPoisoned: unknown = JSON.parse(JSON.stringify(poisoned));
  rejectRun(parsedPoisoned);
});

test('accepts null-prototype objects and nonwritable data properties without accepting inherited fields', () => {
  for (const path of objectPaths) {
    const run = completeRun();
    Object.setPrototypeOf(get(run, path), null);
    accept(validateRun, run);
  }
  const nonwritable = completeRun();
  Object.defineProperty(nonwritable, 'runId', { value: 'run-01', enumerable: true, writable: false, configurable: false });
  accept(validateRun, nonwritable);
  const inherited = completeRun();
  delete inherited.runId;
  Object.setPrototypeOf(inherited, { runId: 'run-01' });
  rejectRun(inherited);
});

test('rejects non-JSON values, wrong container types, cycles and unsupported prototypes with closed failures', () => {
  const cycle: RecordValue = {};
  cycle.self = cycle;
  for (const input of [undefined, null, true, false, 1, -0, NaN, Infinity, 1n, Symbol('private'), secret, () => secret, [], new Date(), new Map(), new Set(), cycle]) {
    rejectRun(input);
    reject(validateScan, input, 'invalid-scan');
  }
  for (const path of objectPaths) {
    for (const invalid of [undefined, [], new Date(), new Map(), () => secret, 1n]) {
      const run = completeRun();
      put(run, path.length === 0 ? ['scan'] : path, invalid);
      rejectRun(run);
    }
    const customPrototype = completeRun();
    Object.setPrototypeOf(get(customPrototype, path), { inherited: true });
    rejectRun(customPrototype);
  }
  const nestedCycle = scanFixture();
  put(nestedCycle, ['findings', 0, 'evidence', 'elementKind', 'value'], nestedCycle);
  rejectScan(nestedCycle);
});

test('rejects symbols, nonenumerable keys and accessor properties at nested object boundaries', () => {
  for (const path of objectPaths) {
    const symbolic = completeRun();
    Object.defineProperty(get(symbolic, path), Symbol('secret'), { value: secret, enumerable: true });
    rejectRun(symbolic);
    const hiddenExtra = completeRun();
    Object.defineProperty(get(hiddenExtra, path), 'hiddenSecret', { value: secret, enumerable: false });
    rejectRun(hiddenExtra);
    const hiddenDeclared = completeRun();
    const target = get(hiddenDeclared, path) as RecordValue;
    const key = Object.keys(target)[0]!;
    Object.defineProperty(target, key, { value: target[key], enumerable: false });
    rejectRun(hiddenDeclared);
    const accessor = completeRun();
    const accessorTarget = get(accessor, path) as RecordValue;
    const accessorKey = Object.keys(accessorTarget)[0]!;
    const original = accessorTarget[accessorKey];
    Object.defineProperty(accessorTarget, accessorKey, { get: () => original, enumerable: true, configurable: true });
    rejectRun(accessor);
  }
});

const arrayPaths: readonly Path[] = [
  ['context', 'rules'], ['findings'], ['scannerReviewObservations'],
  ...[0, 1, 2].flatMap(index => ['any', 'all', 'none'].map(group => ['findings', index, 'checks', 'value', group] as Path)),
];

test('requires ordinary dense arrays with data indices and no extensions, symbols or custom prototypes', () => {
  for (const path of arrayPaths) {
    const extra = scanFixture();
    Object.defineProperty(get(extra, path), 'secret', { value: secret, enumerable: true });
    rejectScan(extra);
    const hidden = scanFixture();
    Object.defineProperty(get(hidden, path), 'secret', { value: secret, enumerable: false });
    rejectScan(hidden);
    const symbolic = scanFixture();
    Object.defineProperty(get(symbolic, path), Symbol('secret'), { value: secret });
    rejectScan(symbolic);
    const prototype = scanFixture();
    Object.setPrototypeOf(get(prototype, path), null);
    rejectScan(prototype);
    const sparse = scanFixture();
    const array = get(sparse, path) as unknown[];
    array.length += 1;
    rejectScan(sparse);
    const object = scanFixture();
    put(object, path, { ...(get(object, path) as unknown[]), length: (get(object, path) as unknown[]).length });
    rejectScan(object);
  }
  for (const path of [['context', 'rules'], ['findings'], ['scannerReviewObservations'], ['findings', 0, 'checks', 'value', 'any']] as const) {
    const accessor = scanFixture();
    const array = get(accessor, path) as unknown[];
    const item = array[0];
    Object.defineProperty(array, '0', { get: () => item, enumerable: true, configurable: true });
    rejectScan(accessor);
    const hiddenIndex = scanFixture();
    const hiddenArray = get(hiddenIndex, path) as unknown[];
    Object.defineProperty(hiddenArray, '0', { value: hiddenArray[0], enumerable: false });
    rejectScan(hiddenIndex);
    const hole = scanFixture();
    delete (get(hole, path) as unknown[])[0];
    rejectScan(hole);
  }
});

test('inspection exceptions never escape or disclose a path, input value, or native exception', () => {
  const traps: ProxyHandler<RecordValue>[] = [
    { ownKeys() { throw new Error(secret); } },
    { getPrototypeOf() { throw new Error(secret); } },
    { getOwnPropertyDescriptor() { throw new Error(secret); } },
  ];
  for (const handler of traps) {
    rejectRun(new Proxy(completeRun(), handler));
    reject(validateScan, new Proxy(scanFixture(), handler), 'invalid-scan');
    const nested = scanFixture();
    put(nested, ['findings', 0, 'evidence'], new Proxy(evidence('image-alt'), handler));
    rejectScan(nested);
  }
  const revoked = Proxy.revocable({}, {});
  revoked.revoke();
  rejectRun(revoked.proxy);
  reject(validateScan, revoked.proxy, 'invalid-scan');
  const throwingAccessor = completeRun();
  Object.defineProperty(throwingAccessor, 'runId', { get() { throw new Error(secret); }, enumerable: true });
  rejectRun(throwingAccessor);
});

// REVIEW1-M1: enumerable key identity matters even when a Proxy reports the expected count.
const reportedArrayCases: readonly Path[] = [
  ['context', 'rules'], ['findings'], ['scannerReviewObservations'],
  ['findings', 0, 'checks', 'value', 'any'], ['findings', 0, 'checks', 'value', 'none'],
  ['scannerReviewObservations', 0, 'checks', 'value', 'any'],
  ['scannerReviewObservations', 0, 'checks', 'value', 'none'],
];

function scanWithNativeNoneChecks(): RecordValue {
  const scan = scanFixture();
  put(scan, ['findings', 0, 'checks', 'value', 'none'], ['alt-space-value']);
  put(scan, ['scannerReviewObservations', 0, 'checks', 'value', 'none'], ['alt-space-value']);
  return scan;
}

test('accepts reordered array own-key enumeration without reordering retained values', () => {
  for (const path of [...arrayPaths, ...reportedArrayCases]) {
    const scan = scanWithNativeNoneChecks();
    const expected = copy(scan);
    const array = get(scan, path) as unknown[];
    put(scan, path, new Proxy(array, {
      ownKeys(target) { return Reflect.ownKeys(target).reverse(); },
    }));
    const output = acceptScan(scan);
    assert.deepEqual(output, expected);
  }
});

for (const path of reportedArrayCases) {
  for (const extraKey of ['rawHtml', Symbol('rawHtml')]) {
    for (const boundary of ['scan', 'run'] as const) {
      test(`${boundary} rejects a concealed ${typeof extraKey} array extension at ${path.join('.')}`, () => {
        const scan = scanWithNativeNoneChecks();
        const array = get(scan, path) as unknown[];
        Object.defineProperty(array, extraKey, {
          value: 'SYNTHETIC_PRIVATE', enumerable: true, configurable: true,
        });
        put(scan, path, new Proxy(array, {
          ownKeys(target) { return Reflect.ownKeys(target).filter(key => key !== '0'); },
        }));
        const validator = boundary === 'scan' ? validateScan : validateRun;
        const input = boundary === 'scan' ? scan : completeRun(scan);
        reject(validator, input, boundary === 'scan' ? 'invalid-scan' : 'invalid-run');
      });
    }
  }
}
