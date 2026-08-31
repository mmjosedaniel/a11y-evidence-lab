import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import test, { mock } from 'node:test';
import { normalizeNativeScan } from '../src/server/scan/normalize-scan.ts';
import { validateScan } from '../src/server/domain/run-contract.ts';
import type { ScanResult } from '../src/server/domain/run-contract.ts';

// M103-NORMALIZE-01: synthetic native records test projection only. The context
// below is a validator fixture, never evidence of a browser, page, or scan.
type RecordValue = Record<string, unknown>;
type Path = readonly (string | number)[];
type Rule = 'image-alt' | 'label' | 'color-contrast';
type Bucket = 'violations' | 'incomplete' | 'passes' | 'inapplicable';
type Collection = Pick<ScanResult, 'coverage' | 'findings' | 'scannerReviewObservations'>;
const rules: readonly Rule[] = ['image-alt', 'label', 'color-contrast'];
const buckets: readonly Bucket[] = ['violations', 'incomplete', 'passes', 'inapplicable'];
const canary = 'SYNTHETIC_PRIVATE_TEXT_TOKEN_PASSWORD';
const available = (value: unknown): RecordValue => ({ value });
const unavailable = (reason = 'missing'): RecordValue => ({ unavailable: reason });
const record = (value: unknown): RecordValue => value as RecordValue;
const array = (value: unknown): unknown[] => value as unknown[];
function get(value: unknown, path: Path): unknown {
  for (const key of path) value = record(value)[key];
  return value;
}
function put(value: unknown, path: Path, replacement: unknown): void {
  record(get(value, path.slice(0, -1)))[path[path.length - 1]] = replacement;
}
function drop(value: unknown, path: Path): void {
  delete record(get(value, path.slice(0, -1)))[path[path.length - 1]];
}
function options(): RecordValue {
  return {
    runOnly: { type: 'rule', values: [...rules] }, reporter: 'm103-native-dom-v1',
    resultTypes: [...buckets], selectors: true, ancestry: false, xpath: false,
    absolutePaths: false, elementRef: true, iframes: false,
  };
}
function domEvidence(rule: Rule): RecordValue {
  if (rule === 'image-alt') return { elementKind: available('img'), altState: available('absent') };
  return {
    elementKind: available('input'), inputType: available('email'),
    nameSources: {
      explicitLabel: available(false), implicitLabel: available(true),
      ariaLabel: available('empty'), ariaLabelledby: available('partially-resolved'),
      title: available('whitespace-only'), placeholder: available('non-empty'),
      presentationalRole: available(false),
    },
  };
}
function contrastData(): RecordValue {
  return {
    fgColor: '#777777', bgColor: '#ffffff', shadowColor: '#000000',
    contrastRatio: 4.478089453577214, expectedContrastRatio: '4.5:1',
    fontSize: '12.0pt (16px)', fontWeight: 'normal', messageKey: 'shortTextContent',
  };
}
function node(rule: Rule): RecordValue {
  return {
    any: [{ id: rule === 'image-alt' ? 'has-alt' : rule === 'label' ? 'explicit-label' : 'color-contrast',
      ...(rule === 'color-contrast' ? { data: contrastData() } : {}) }],
    all: [], none: [],
    capturedDom: {
      locator: available(':root > :nth-child(2) > :nth-child(1)'),
      ...(rule === 'color-contrast' ? {} : { evidence: domEvidence(rule) }),
    },
  };
}
function entry(rule: Rule, count = 1): RecordValue {
  return { id: rule, nodes: Array.from({ length: count }, () => node(rule)) };
}
function native(): RecordValue {
  return {
    testEngine: { name: 'axe-core', version: '4.13.0' }, toolOptions: options(),
    violations: rules.map(rule => entry(rule)), incomplete: [], passes: [], inapplicable: [],
  };
}
const first: Path = ['violations', 0, 'nodes', 0];
const label: Path = ['violations', 1, 'nodes', 0];
const contrast: Path = ['violations', 2, 'nodes', 0];
function syntheticContext(): RecordValue {
  return {
    finalUrl: available('https://synthetic.invalid/normalization'),
    scannedAt: available('2026-08-31T00:00:00.000Z'), browserVersion: available('151.0.7922.34'),
    scannerVersion: '4.13.0', evidencePolicyVersion: 'm1-public-v1', rules: [...rules],
    scope: 'current-rendered-top-level-document', readiness: 'load', readinessReached: true,
    viewport: { width: 1280, height: 720 }, locale: 'en-US', timeoutMs: 10000,
    freshContext: true, importedState: false, interaction: false, crawling: false,
    iframes: false, cleanup: 'closed', contrastProfile: 'axe-core-4.13.0-default',
  };
}
function project(input: unknown): Collection {
  const result = normalizeNativeScan(input);
  if (!result.ok) assert.fail(`Expected synthetic normalization success; got ${result.error}`);
  assert.deepEqual(Object.keys(result).sort(), ['ok', 'value']);
  assert.deepEqual(Object.keys(result.value).sort(), ['coverage', 'findings', 'scannerReviewObservations']);
  assert.equal(validateScan({ context: syntheticContext(), ...result.value }).ok, true);
  assert.equal(JSON.stringify(result).includes(canary), false);
  return result.value;
}
function reject(input: unknown, error: string): void {
  assert.deepEqual(normalizeNativeScan(input), { ok: false, error });
}
function firstFinding(input: unknown) { return project(input).findings[0]; }
function contrastEvidence(input: unknown): RecordValue { return record(project(input).findings[2].evidence); }
function assertDetached(input: unknown, output: unknown): void {
  const inputs = new Set<object>();
  function collect(value: unknown): void {
    if (value === null || typeof value !== 'object' || inputs.has(value)) return;
    inputs.add(value);
    for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(value))) {
      if ('value' in descriptor) collect(descriptor.value);
    }
  }
  collect(input);
  function inspect(value: unknown): void {
    if (value === null || typeof value !== 'object') return;
    assert.equal(inputs.has(value), false);
    for (const child of Object.values(value)) inspect(child);
  }
  inspect(output);
}

test('preserves every node, native order and duplicate locator with exact four-bucket counts', () => {
  const input = native();
  input.violations = [entry('label', 2), entry('image-alt', 3), entry('color-contrast', 2)];
  input.incomplete = [entry('color-contrast', 2), entry('image-alt', 2), entry('label', 1)];
  input.passes = rules.map(rule => entry(rule, 4));
  input.inapplicable = rules.map(rule => entry(rule, 2));
  const before = structuredClone(input);
  const output = project(input);
  assert.deepEqual(output.findings.map(item => item.ruleId), ['label', 'label', 'image-alt', 'image-alt', 'image-alt', 'color-contrast', 'color-contrast']);
  assert.deepEqual(output.scannerReviewObservations.map(item => item.ruleId), ['color-contrast', 'color-contrast', 'image-alt', 'image-alt', 'label']);
  assert.deepEqual(output.coverage, {
    'image-alt': { violations: 3, incomplete: 2, passes: 4, inapplicable: 2 },
    label: { violations: 2, incomplete: 1, passes: 4, inapplicable: 2 },
    'color-contrast': { violations: 2, incomplete: 2, passes: 4, inapplicable: 2 },
  });
  assert.equal(new Set(output.findings.map(item => item.findingId)).size, 7);
  for (const item of output.findings) {
    assert.match(item.findingId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    assert.equal(item.nativeResult, 'violation');
    assert.equal(item.state, 'unprocessed');
    assert.deepEqual(item.locator, available(':root > :nth-child(2) > :nth-child(1)'));
  }
  for (const item of output.scannerReviewObservations) {
    assert.equal(item.nativeResult, 'incomplete');
    assert.equal(Object.hasOwn(item, 'findingId'), false);
    assert.equal(Object.hasOwn(item, 'state'), false);
  }
  assert.deepEqual(input, before);
  assertDetached(input, output);
  const next = project(input);
  const previousIds = new Set(output.findings.map(item => item.findingId));
  assert.ok(next.findings.every(item => !previousIds.has(item.findingId)));
});

test('distinguishes absent buckets, explicit inapplicable zero, pass-only and incomplete-only scans', () => {
  for (const bucket of ['inapplicable', 'passes', 'incomplete'] as const) {
    const input = native();
    input.violations = [];
    input[bucket] = rules.map(rule => entry(rule, bucket === 'inapplicable' ? 0 : 2));
    const output = project(input);
    assert.equal(output.findings.length, 0);
    assert.equal(output.scannerReviewObservations.length, bucket === 'incomplete' ? 6 : 0);
    for (const rule of rules) for (const key of buckets) {
      assert.equal(output.coverage[rule][key], key === bucket ? (bucket === 'inapplicable' ? 0 : 2) : null);
    }
  }
});

test('UUID acquisition errors or collisions fail the whole result without fallback identities', () => {
  const fixed = '12345678-1234-4234-8234-123456789abc';
  for (const fail of [false, true]) {
    let calls = 0;
    const replacement = (): `${string}-${string}-${string}-${string}-${string}` => {
      calls++;
      if (fail) throw new Error(canary);
      return fixed;
    };
    const nodeMock = mock.method(crypto, 'randomUUID', replacement);
    const webMock = mock.method(globalThis.crypto, 'randomUUID', replacement);
    syncBuiltinESMExports();
    try {
      reject(native(), 'result-validation');
      assert.ok(calls > 0);
      assert.ok(calls <= (fail ? 1 : 3), 'No retry-generated identity is permitted');
    } finally {
      nodeMock.mock.restore();
      webMock.mock.restore();
      syncBuiltinESMExports();
    }
  }
});

test('requires the exact consumed engine identity and ordered, closed execution options', () => {
  for (const input of [null, undefined, true, 1, 'native', [], new Date(), Object.create({ testEngine: {} })]) reject(input, 'result-validation');
  const mutations: ((input: RecordValue) => void)[] = [
    input => { delete input.testEngine; },
    input => { input.testEngine = null; },
    input => put(input, ['testEngine', 'name'], 'other'),
    input => put(input, ['testEngine', 'version'], '4.12.0'),
    input => { delete input.toolOptions; },
    input => { input.toolOptions = []; },
    input => put(input, ['toolOptions', 'reporter'], 'v1'),
    input => put(input, ['toolOptions', 'runOnly', 'values'], [...rules].reverse()),
    input => put(input, ['toolOptions', 'resultTypes'], [...buckets].reverse()),
    input => put(input, ['toolOptions', 'extra'], true),
    input => put(input, ['toolOptions', 'runOnly', 'extra'], true),
  ];
  for (const key of ['selectors', 'ancestry', 'xpath', 'absolutePaths', 'elementRef', 'iframes']) {
    mutations.push(input => put(input, ['toolOptions', key], !get(input, ['toolOptions', key])));
    mutations.push(input => drop(input, ['toolOptions', key]));
  }
  for (const mutate of mutations) { const input = native(); mutate(input); reject(input, 'result-validation'); }
  const input = native();
  Object.setPrototypeOf(input, null);
  Object.setPrototypeOf(input.testEngine, null);
  project(input);
});

test('validates every bucket, result and node container before projecting any collection', () => {
  for (const bucket of buckets) {
    for (const replacement of [undefined, null, {}, 'array']) {
      const input = native(); input[bucket] = replacement; reject(input, 'result-validation');
    }
    const missing = native(); delete missing[bucket]; reject(missing, 'result-validation');
    for (const replacement of [null, [], new Date(), { nodes: [] }, { id: 7, nodes: [] }, { id: 'image-alt' }, { id: 'image-alt', nodes: null }, { id: 'image-alt', nodes: [null] }, { id: 'image-alt', nodes: [[]] }]) {
      const input = native(); input[bucket] = [replacement]; reject(input, 'result-validation');
    }
  }
  const arrayPaths: Path[] = [['violations'], ['violations', 0, 'nodes'], ['toolOptions', 'resultTypes'], ['toolOptions', 'runOnly', 'values']];
  for (const path of arrayPaths) {
    const mutations: ((value: unknown[]) => void)[] = [
      value => { delete value[0]; },
      value => { Object.setPrototypeOf(value, null); },
      value => { Object.defineProperty(value, 'extra', { value: canary }); },
      value => { Object.defineProperty(value, Symbol('extra'), { value: canary }); },
      value => { Object.defineProperty(value, '0', { value: value[0], enumerable: false }); },
      value => { Object.defineProperty(value, '0', { get() { throw new Error(canary); } }); },
    ];
    for (const mutate of mutations) {
      const input = native(); mutate(array(get(input, path))); reject(input, 'result-validation');
    }
  }
});

test('rejects consumed accessors and inspection failures without calling getters or disclosing errors', () => {
  for (const path of [['testEngine'], ['testEngine', 'version'], ['violations'], ['violations', 0, 'id'], ['violations', 0, 'nodes'], ['violations', 0, 'error']] as Path[]) {
    const input = native(); let calls = 0;
    Object.defineProperty(get(input, path.slice(0, -1)), path[path.length - 1], {
      enumerable: true, get() { calls++; throw new Error(canary); },
    });
    reject(input, 'result-validation');
    assert.equal(calls, 0);
  }
  const revoked = Proxy.revocable({}, {}); revoked.revoke();
  reject(revoked.proxy, 'result-validation');
  const input = native(); input.violations = new Proxy([], { ownKeys() { throw new Error(canary); } });
  reject(input, 'result-validation');
});

test('native rule errors precede coverage and capture, while structural defects precede errors', () => {
  for (const bucket of buckets) for (const error of [false, 0, '', canary, { message: canary }]) {
    const input = native(); input[bucket] = [{ id: 'unexpected-rule', nodes: [node('image-alt')], error }];
    drop(input, [...first, 'capturedDom']);
    reject(input, 'scanner');
  }
  for (const error of [null, undefined]) {
    const input = native(); put(input, ['violations', 0, 'error'], error); project(input);
  }
  const input = native(); put(input, ['violations', 0, 'error'], canary); input.passes = null;
  reject(input, 'result-validation');
});

test('coverage rejects missing, duplicate, unexpected and contradictory rules without false zero', () => {
  const mutations: ((input: RecordValue) => void)[] = [
    input => { input.violations = []; },
    input => { array(input.violations).pop(); },
    input => { array(input.violations).push(entry('image-alt')); },
    input => put(input, ['violations', 0, 'id'], 'document-title'),
    input => put(input, ['violations', 0, 'nodes'], []),
    input => { input.incomplete = [entry('label', 0)]; },
    input => { input.passes = [entry('label', 0)]; },
    input => { input.inapplicable = [entry('label', 0)]; },
  ];
  for (const bucket of buckets) mutations.push(input => { input[bucket] = [entry('image-alt'), entry('image-alt')]; });
  for (const mutate of mutations) {
    const input = native(); mutate(input); reject(input, 'coverage-validation');
  }
  const input = native(); put(input, ['violations', 0, 'id'], 'unexpected'); drop(input, [...first, 'capturedDom']);
  reject(input, 'coverage-validation');
});

test('the exact capture sentinel and whole-envelope failures are fatal, not missing individual facts', () => {
  reject({ captureFailure: 'evidence-capture' }, 'evidence-capture');
  reject({ captureFailure: 'evidence-capture', extra: canary }, 'result-validation');
  reject({ captureFailure: 'other' }, 'result-validation');
  for (const bucket of ['violations', 'incomplete'] as const) {
    for (const envelope of [undefined, null, [], canary, new Date()]) {
      const input = native(); input[bucket] = [entry('image-alt')];
      // Preserve coverage for other rules when replacing the violation array.
      if (bucket === 'violations') input.passes = [entry('label'), entry('color-contrast')];
      put(input, [bucket, 0, 'nodes', 0, 'capturedDom'], envelope);
      reject(input, 'evidence-capture');
    }
  }
  const input = native(); let calls = 0;
  Object.defineProperty(get(input, first), 'capturedDom', { enumerable: true, get() { calls++; throw new Error(canary); } });
  reject(input, 'evidence-capture'); assert.equal(calls, 0);
  const revoked = Proxy.revocable({}, {}); revoked.revoke();
  const uninspectable = native(); put(uninspectable, [...first, 'capturedDom'], revoked.proxy);
  reject(uninspectable, 'evidence-capture');
});

test('individual locator reasons and malformed facts preserve every parent and valid sibling', () => {
  for (const reason of ['missing', 'invalid', 'withheld', 'unsupported', 'too-long']) {
    const input = native(); put(input, [...first, 'capturedDom', 'locator'], unavailable(reason));
    assert.deepEqual(firstFinding(input).locator, unavailable(reason));
  }
  for (const locator of [':root', ':root > :nth-child(1)', ':root > :nth-child(9007199254740991)']) {
    const input = native(); put(input, [...first, 'capturedDom', 'locator'], available(locator));
    assert.deepEqual(firstFinding(input).locator, available(locator));
  }
  for (const source of [null, available('#private-id'), available(':root > :nth-child(01)'), available(':root > :nth-child(0)'), available(':root > :nth-child(9007199254740992)'), unavailable('other'), available(canary)]) {
    const input = native(); put(input, [...first, 'capturedDom', 'locator'], source);
    assert.deepEqual(firstFinding(input).locator, unavailable('invalid'));
  }
  const missing = native(); drop(missing, [...first, 'capturedDom', 'locator']);
  assert.deepEqual(firstFinding(missing).locator, unavailable());
  const invalid = native(); let calls = 0;
  Object.defineProperty(get(invalid, [...first, 'capturedDom']), 'locator', { enumerable: true, get() { calls++; throw new Error(canary); } });
  const finding = firstFinding(invalid);
  assert.deepEqual(finding.locator, unavailable('invalid'));
  assert.deepEqual(finding.evidence, domEvidence('image-alt')); assert.equal(calls, 0);
});

test('image facts preserve categorical values and ordinary reasons without inferring missing data', () => {
  for (const state of ['absent', 'empty', 'whitespace-only', 'non-empty']) {
    const input = native(); put(input, [...first, 'capturedDom', 'evidence', 'altState'], available(state));
    assert.deepEqual(get(firstFinding(input), ['evidence', 'altState']), available(state));
  }
  for (const field of ['elementKind', 'altState']) {
    for (const reason of ['missing', 'invalid', 'withheld']) {
      const input = native(); put(input, [...first, 'capturedDom', 'evidence', field], unavailable(reason));
      assert.deepEqual(get(firstFinding(input), ['evidence', field]), unavailable(reason));
    }
    for (const value of [null, available(canary), unavailable('unsupported')]) {
      const input = native(); put(input, [...first, 'capturedDom', 'evidence', field], value);
      assert.deepEqual(get(firstFinding(input), ['evidence', field]), unavailable('invalid'));
    }
    const input = native(); drop(input, [...first, 'capturedDom', 'evidence', field]);
    assert.deepEqual(get(firstFinding(input), ['evidence', field]), unavailable());
  }
  for (const source of [undefined, null, []]) {
    const input = native(); put(input, [...first, 'capturedDom', 'evidence'], source);
    const evidence = firstFinding(input).evidence;
    assert.deepEqual(evidence, { elementKind: unavailable(source === undefined ? 'missing' : 'invalid'), altState: unavailable(source === undefined ? 'missing' : 'invalid') });
  }
});

test('label projection preserves input types, textarea relationships and independent name-source facts', () => {
  const types = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];
  for (const type of types) {
    const input = native(); put(input, [...label, 'capturedDom', 'evidence', 'inputType'], available(type));
    assert.deepEqual(get(project(input).findings[1], ['evidence', 'inputType']), available(type));
  }
  const textarea = native();
  put(textarea, [...label, 'capturedDom', 'evidence', 'elementKind'], available('textarea'));
  put(textarea, [...label, 'capturedDom', 'evidence', 'inputType'], unavailable('not-applicable'));
  assert.deepEqual(get(project(textarea).findings[1], ['evidence', 'inputType']), unavailable('not-applicable'));
  for (const value of [undefined, null, available('unknown-type')]) {
    const input = native(); put(input, [...label, 'capturedDom', 'evidence', 'inputType'], value);
    assert.deepEqual(get(project(input).findings[1], ['evidence', 'inputType']), unavailable(value === undefined ? 'missing' : 'invalid'));
  }
  for (const reason of ['missing', 'invalid', 'withheld']) {
    const input = native();
    put(input, [...label, 'capturedDom', 'evidence', 'elementKind'], unavailable(reason));
    put(input, [...label, 'capturedDom', 'evidence', 'inputType'], unavailable(reason));
    const evidence = project(input).findings[1].evidence;
    assert.deepEqual(get(evidence, ['elementKind']), unavailable(reason));
    assert.deepEqual(get(evidence, ['inputType']), unavailable(reason));
  }
  for (const [key, values] of Object.entries({
    explicitLabel: [true, false], implicitLabel: [true, false], presentationalRole: [true, false],
    ariaLabel: ['absent', 'empty', 'whitespace-only', 'non-empty'],
    title: ['absent', 'empty', 'whitespace-only', 'non-empty'],
    placeholder: ['absent', 'empty', 'whitespace-only', 'non-empty'],
    ariaLabelledby: ['absent', 'empty', 'unresolved', 'partially-resolved', 'resolved'],
  })) {
    for (const value of values) {
      const input = native(); put(input, [...label, 'capturedDom', 'evidence', 'nameSources', key], available(value));
      assert.deepEqual(get(project(input).findings[1], ['evidence', 'nameSources', key]), available(value));
    }
    const input = native(); put(input, [...label, 'capturedDom', 'evidence', 'nameSources', key], available(canary));
    assert.deepEqual(get(project(input).findings[1], ['evidence', 'nameSources', key]), unavailable('invalid'));
  }
  for (const source of [undefined, null, []]) {
    const input = native(); put(input, [...label, 'capturedDom', 'evidence', 'nameSources'], source);
    const evidence = project(input).findings[1].evidence;
    assert.deepEqual(get(evidence, ['inputType']), available('email'));
    const names = record(get(evidence, ['nameSources']));
    assert.equal(Object.keys(names).length, 7);
    for (const fact of Object.values(names)) assert.deepEqual(fact, unavailable(source === undefined ? 'missing' : 'invalid'));
  }
  const input = native(); let calls = 0;
  Object.defineProperty(get(input, [...label, 'capturedDom', 'evidence', 'nameSources']), 'explicitLabel', { enumerable: true, get() { calls++; throw new Error(canary); } });
  const names = get(project(input).findings[1], ['evidence', 'nameSources']);
  assert.deepEqual(get(names, ['explicitLabel']), unavailable('invalid'));
  assert.deepEqual(get(names, ['implicitLabel']), available(true)); assert.equal(calls, 0);
});

test('checks preserve exact native order and group identity for each rule', () => {
  const allowed: Record<Rule, { any: string[]; none: string[] }> = {
    'image-alt': { any: ['presentational-role', 'has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title'], none: ['alt-space-value'] },
    label: { any: ['non-empty-placeholder', 'implicit-label', 'explicit-label', 'aria-label', 'aria-labelledby', 'non-empty-title', 'presentational-role'], none: ['hidden-explicit-label'] },
    'color-contrast': { any: ['color-contrast'], none: [] },
  };
  const input = native();
  rules.forEach((rule, index) => {
    for (const group of ['any', 'none'] as const) put(input, ['violations', index, 'nodes', 0, group], allowed[rule][group].map(id => ({ id, message: canary })));
  });
  const output = project(input);
  rules.forEach((rule, index) => assert.deepEqual(output.findings[index].checks, available({ ...allowed[rule], all: [] })));
  const noneOnly = native(); put(noneOnly, [...first, 'any'], []); put(noneOnly, [...first, 'none'], [{ id: 'alt-space-value' }]);
  assert.deepEqual(firstFinding(noneOnly).checks, available({ any: [], all: [], none: ['alt-space-value'] }));
});

test('missing and invalid checks remain unavailable, with invalid taking precedence', () => {
  for (const group of ['any', 'all', 'none']) {
    for (const source of [undefined, null]) {
      const input = native(); put(input, [...first, group], source);
      assert.deepEqual(firstFinding(input).checks, unavailable());
    }
    for (const source of [{}, [null], [{ id: 'unknown' }], [{ id: 'has-alt' }, { id: 'has-alt' }]]) {
      const input = native(); put(input, [...first, group], source);
      assert.deepEqual(firstFinding(input).checks, unavailable('invalid'));
    }
  }
  for (const mutate of [
    (value: unknown[]) => { delete value[0]; },
    (value: unknown[]) => { Object.setPrototypeOf(value, null); },
    (value: unknown[]) => { Object.defineProperty(value, 'extra', { value: canary }); },
  ]) {
    const input = native(); mutate(array(get(input, [...first, 'any'])));
    assert.deepEqual(firstFinding(input).checks, unavailable('invalid'));
  }
  for (const [group, id] of [['any', 'alt-space-value'], ['none', 'has-alt'], ['all', 'has-alt']]) {
    const input = native(); put(input, [...first, group], [{ id }]);
    assert.deepEqual(firstFinding(input).checks, unavailable('invalid'));
  }
  const empty = native(); put(empty, [...first, 'any'], []);
  assert.deepEqual(firstFinding(empty).checks, unavailable('invalid'));
  const mixed = native(); put(mixed, [...first, 'any'], null); put(mixed, [...first, 'none'], [{ id: 'unknown' }]);
  assert.deepEqual(firstFinding(mixed).checks, unavailable('invalid'));
  const input = native(); let calls = 0;
  Object.defineProperty(get(input, [...first, 'any', 0]), 'id', { enumerable: true, get() { calls++; throw new Error(canary); } });
  assert.deepEqual(firstFinding(input).checks, unavailable('invalid')); assert.equal(calls, 0);
});

test('contrast maps exact native measurements without rounding, coercion or deriving outcomes', () => {
  const evidence = contrastEvidence(native());
  assert.deepEqual(evidence, {
    foregroundColor: available('#777777'), backgroundColor: available('#ffffff'), shadowColor: available('#000000'),
    contrastRatio: available(4.478089453577214), expectedContrastRatio: available(4.5),
    fontSize: available('12.0pt (16px)'), fontWeight: available('normal'),
    measurementSource: 'axe-core', messageKey: available('shortTextContent'),
  });
  for (const ratio of [1, 21, 4.499999999]) {
    const input = native(); put(input, [...contrast, 'any', 0, 'data', 'contrastRatio'], ratio);
    assert.deepEqual(contrastEvidence(input).contrastRatio, available(ratio));
  }
  const input = native(); put(input, [...contrast, 'any', 0, 'data', 'expectedContrastRatio'], '3:1');
  put(input, [...contrast, 'any', 0, 'data', 'fontSize'], '0.0pt (0.01px)');
  put(input, [...contrast, 'any', 0, 'data', 'fontWeight'], 'bold');
  const output = project(input);
  assert.equal(output.findings[2].nativeResult, 'violation');
  assert.deepEqual(get(output.findings[2], ['evidence', 'expectedContrastRatio']), available(3));
  assert.deepEqual(get(output.findings[2], ['evidence', 'fontSize']), available('0.0pt (0.01px)'));
  assert.deepEqual(get(output.findings[2], ['evidence', 'fontWeight']), available('bold'));
});

test('each contrast omission or invalid measurement preserves independently valid native siblings', () => {
  const fields: [string, string, unknown[]][] = [
    ['fgColor', 'foregroundColor', ['#ABCDEF', '#fff', 'red', canary]],
    ['bgColor', 'backgroundColor', ['#FFFFFF', 0]], ['shadowColor', 'shadowColor', ['none', 'transparent']],
    ['contrastRatio', 'contrastRatio', [0, 22, NaN, Infinity, '4.5']],
    ['expectedContrastRatio', 'expectedContrastRatio', [3, 4.5, '4.50:1', '7:1']],
    ['fontSize', 'fontSize', ['12pt (16px)', '12.00pt (16px)', '0.0pt (0px)', '-1.0pt (2px)', '12.0pt (1e2px)', '1'.repeat(65)]],
    ['fontWeight', 'fontWeight', [400, '400', 'NORMAL']],
  ];
  for (const [source, target, invalids] of fields) {
    for (const value of [undefined, null, ...invalids]) {
      const input = native(); put(input, [...contrast, 'any', 0, 'data', source], value);
      const evidence = contrastEvidence(input);
      assert.deepEqual(evidence[target], unavailable(value === undefined ? 'missing' : 'invalid'));
      assert.deepEqual(evidence.messageKey, available('shortTextContent'));
    }
    const input = native(); drop(input, [...contrast, 'any', 0, 'data', source]);
    assert.deepEqual(contrastEvidence(input)[target], unavailable());
  }
  const input = native(); let calls = 0;
  Object.defineProperty(get(input, [...contrast, 'any', 0, 'data']), 'fgColor', { enumerable: true, get() { calls++; throw new Error(canary); } });
  const evidence = contrastEvidence(input);
  assert.deepEqual(evidence.foregroundColor, unavailable('invalid'));
  assert.deepEqual(evidence.backgroundColor, available('#ffffff')); assert.equal(calls, 0);
});

test('contrast source availability is independent of unusable unrelated check groups', () => {
  for (const source of [undefined, null, []]) {
    const input = native(); put(input, [...contrast, 'any'], source);
    const evidence = contrastEvidence(input);
    for (const [key, value] of Object.entries(evidence)) if (key !== 'measurementSource') assert.deepEqual(value, unavailable());
  }
  for (const source of [[{ id: 'color-contrast' }, { id: 'color-contrast', data: contrastData() }], {}, [null]]) {
    const input = native(); put(input, [...contrast, 'any'], source);
    const evidence = contrastEvidence(input);
    for (const [key, value] of Object.entries(evidence)) if (key !== 'measurementSource') assert.deepEqual(value, unavailable('invalid'));
  }
  for (const data of [undefined, null, [], canary]) {
    const input = native(); put(input, [...contrast, 'any', 0, 'data'], data);
    const evidence = contrastEvidence(input);
    for (const [key, value] of Object.entries(evidence)) if (key !== 'measurementSource') assert.deepEqual(value, unavailable(data === undefined || data === null ? 'missing' : 'invalid'));
  }
  const input = native(); put(input, [...contrast, 'all'], [{ id: 'unknown' }]); put(input, [...contrast, 'none'], null);
  const finding = project(input).findings[2];
  assert.deepEqual(finding.checks, unavailable('invalid'));
  assert.deepEqual(get(finding, ['evidence', 'contrastRatio']), available(4.478089453577214));
});

test('incomplete reasons preserve all native contrast keys and withhold image or label prose', () => {
  const keys = ['nonBmp', 'pseudoContent', 'complexTextShadows', 'colorParse', 'equalRatio', 'shortTextContent', 'shadowOnBgColor', 'fgOnShadowColor', 'imgNode', 'bgGradient', 'bgImage', 'bgOverlap', 'elmPartiallyObscuring', 'elmPartiallyObscured', 'outsideViewport'];
  for (const key of [...keys, undefined, null, canary, 7]) {
    const input = native(); input.incomplete = [entry('color-contrast')];
    put(input, ['incomplete', 0, 'nodes', 0, 'any', 0, 'data', 'messageKey'], key);
    const observation = project(input).scannerReviewObservations[0];
    const expected = key === undefined || key === null ? unavailable() : key === canary ? unavailable('withheld') : key === 7 ? unavailable('invalid') : available(key);
    assert.deepEqual(observation.incompleteReason, expected);
    assert.deepEqual(get(observation, ['evidence', 'messageKey']), expected);
  }
  for (const rule of ['image-alt', 'label'] as const) {
    for (const path of [['failureSummary'], ['any', 0, 'message']] as Path[]) {
      for (const prose of [undefined, '', canary]) {
        const input = native(); input.incomplete = [entry(rule)];
        put(input, ['incomplete', 0, 'nodes', 0, ...path], prose);
        assert.deepEqual(project(input).scannerReviewObservations[0].incompleteReason, unavailable(prose === canary ? 'withheld' : 'missing'));
      }
    }
  }
});

test('malformed check IDs preserve independently readable image and label incomplete reasons', () => {
  const input = native();
  let messageReads = 0;
  input.incomplete = (['image-alt', 'label'] as const).map(rule => {
    const result = entry(rule, 4);
    const nodes = array(result.nodes);
    const checks: RecordValue[] = [
      { id: 7, message: canary },
      { id: 7, message: '' },
      { id: 7 },
      { id: 7 },
    ];
    Object.defineProperty(checks[3], 'message', {
      enumerable: true,
      get() { messageReads++; throw new Error(canary); },
    });
    nodes.forEach((item, index) => { record(item).any = [checks[index]]; });
    return result;
  });
  const output = project(input);
  assert.equal(output.findings.length, 3);
  assert.equal(output.scannerReviewObservations.length, 8);
  assert.equal(messageReads, 0);
  for (const observation of output.scannerReviewObservations) {
    assert.equal(observation.nativeResult, 'incomplete');
    assert.deepEqual(observation.checks, unavailable('invalid'));
    assert.deepEqual(observation.evidence, domEvidence(observation.ruleId));
    assert.deepEqual(observation.locator, available(':root > :nth-child(2) > :nth-child(1)'));
  }
  assert.deepEqual(output.scannerReviewObservations.map(item => item.incompleteReason), [
    unavailable('withheld'), unavailable(), unavailable(), unavailable(),
    unavailable('withheld'), unavailable(), unavailable(), unavailable(),
  ]);
});

test('opaque native content is ignored, allowlisted output is detached, and raw values never escape', () => {
  const input = native(); let reads = 0;
  input.url = `https://user:${canary}@synthetic.invalid/${canary}`;
  input.timestamp = canary;
  input.extra = { raw: canary }; record(input.extra).cycle = input;
  Object.defineProperty(input, 'opaqueGetter', { enumerable: true, get() { reads++; throw new Error(canary); } });
  record(input.testEngine).extra = canary;
  for (const bucket of buckets) {
    if (bucket !== 'violations') input[bucket] = rules.map(rule => entry(rule));
    for (const result of array(input[bucket])) {
      Object.assign(record(result), { description: canary, help: canary, helpUrl: canary, tags: [canary] });
      for (const item of array(record(result).nodes)) {
        Object.assign(record(item), { html: canary, target: [canary], impact: canary, failureSummary: canary, element: { textContent: canary } });
        Object.assign(record(get(item, ['any', 0])), { message: canary, relatedNodes: [{ html: canary }] });
        const captured = record(record(item).capturedDom);
        captured.extra = canary;
        if (captured.evidence) record(captured.evidence).extra = canary;
      }
    }
  }
  const output = project(input);
  assert.equal(reads, 0);
  assertDetached(input, output);
  const before = JSON.stringify(output);
  put(input, [...first, 'capturedDom', 'evidence', 'altState', 'value'], 'non-empty');
  put(input, [...first, 'any', 0, 'id'], 'aria-label');
  assert.equal(JSON.stringify(output), before);
  for (const finding of output.findings) assert.deepEqual(Object.keys(finding).sort(), ['checks', 'evidence', 'findingId', 'locator', 'nativeResult', 'ruleId', 'state']);
  for (const observation of output.scannerReviewObservations) assert.deepEqual(Object.keys(observation).sort(), ['checks', 'evidence', 'incompleteReason', 'locator', 'nativeResult', 'ruleId']);
});
