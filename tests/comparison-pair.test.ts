import assert from 'node:assert/strict';
import test from 'node:test';
import {
  readComparisonCandidates,
  readComparisonRuns,
  validateComparisonInput,
} from '../src/server/comparison/comparison-contract.ts';
import {
  compareScanProfiles,
  comparisonProfile,
} from '../src/server/comparison/scan-pair.ts';
import { completedRun, failedRun, runningRun } from './helpers/m102-run-fixture.ts';
import { reviewedRun } from './helpers/m401-review-fixture.ts';
import {
  comparisonRunPair,
  contrastPassCandidate,
  coverage,
  fact,
  imagePassCandidate,
  labelPassCandidate,
  unavailable,
  validatedCompletedRun,
} from './helpers/comparison-fixtures.ts';

type Mutable = Record<string, any>;
const invalidComparison = Object.freeze({ ok: false, error: 'invalid-comparison-input' as const });

function clone<T>(value: T): T {
  return structuredClone(value);
}

function assertInvalidContract(action: () => unknown): void {
  assert.throws(action, error => error instanceof Error && error.message === 'Invalid contract');
}

function acceptedComparison<T>(result: { readonly ok: true; readonly value: T } | { readonly ok: false }): T {
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error('Expected comparison input to be accepted');
  return result.value;
}

function assertFrozenObservation(value: Readonly<Mutable>): void {
  assert.equal(Object.isFrozen(value), true);
  assert.equal(Object.isFrozen(value.locator), true);
  assert.equal(Object.isFrozen(value.checks), true);
  if ('value' in value.checks) {
    assert.equal(Object.isFrozen(value.checks.value), true);
    assert.equal(Object.isFrozen(value.checks.value.any), true);
    assert.equal(Object.isFrozen(value.checks.value.all), true);
    assert.equal(Object.isFrozen(value.checks.value.none), true);
  }
  assert.equal(Object.isFrozen(value.evidence), true);
}

test('readComparisonRuns admits only detached completed baseline-linked sources', () => {
  const source = comparisonRunPair();
  const result = readComparisonRuns(source);
  assert.deepEqual(Object.keys(result).sort(), ['baselineRun', 'laterRun'].sort());
  assert.notStrictEqual(result.baselineRun, source.baselineRun);
  assert.notStrictEqual(result.laterRun, source.laterRun);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.baselineRun), true);
  assert.equal(Object.isFrozen(result.laterRun.scan.context.viewport), true);

  const mutable = clone(source) as unknown as Mutable;
  const detached = readComparisonRuns(mutable);
  mutable.baselineRun.requestedUrl = 'https://example.org/changed';
  mutable.laterRun.scan.context.viewport.width = 1;
  assert.equal(detached.baselineRun.requestedUrl, source.baselineRun.requestedUrl);
  assert.equal(detached.laterRun.scan.context.viewport.width, 1280);

  const same = comparisonRunPair();
  const sameId = { baselineRun: same.baselineRun, laterRun: { ...same.laterRun, runId: same.baselineRun.runId } };
  const wrongLineage = { baselineRun: same.baselineRun, laterRun: { ...same.laterRun, baselineRunId: 'another-run' } };
  for (const invalid of [
    null, [], {}, { ...same, extra: true },
    { baselineRun: runningRun('baseline-run'), laterRun: same.laterRun },
    { baselineRun: same.baselineRun, laterRun: failedRun('later-run') },
    sameId, wrongLineage,
    { baselineRun: same.baselineRun, laterRun: completedRun('unlinked-run') },
  ]) assertInvalidContract(() => readComparisonRuns(invalid));
});

test('run-pair inspection rejects accessors, symbols and hostile objects without invoking getters', () => {
  const pair = comparisonRunPair() as unknown as Mutable;
  let getterCalls = 0;
  Object.defineProperty(pair, 'baselineRun', {
    enumerable: true,
    get() { getterCalls++; return comparisonRunPair().baselineRun; },
  });
  assertInvalidContract(() => readComparisonRuns(pair));
  assert.equal(getterCalls, 0);

  const symbolic = comparisonRunPair() as unknown as Mutable;
  Object.defineProperty(symbolic, Symbol('private'), { value: 'secret', enumerable: true });
  assertInvalidContract(() => readComparisonRuns(symbolic));
  assertInvalidContract(() => readComparisonRuns(new Proxy({}, {
    ownKeys() { throw new Error('private inspection failure'); },
  })));
});

test('readComparisonCandidates validates every rule and preserves ordered duplicate and unavailable evidence', () => {
  const cases = [
    ['image-alt', imagePassCandidate(), coverage(1)],
    ['label', labelPassCandidate(), coverage(1)],
    ['color-contrast', contrastPassCandidate(), coverage(1)],
  ] as const;
  for (const [rule, candidate, ruleCoverage] of cases) {
    const result = readComparisonCandidates([candidate], rule, ruleCoverage);
    assert.equal(Object.isFrozen(result), true);
    assert.deepEqual(Object.keys(result[0]!).sort(), ['ruleId', 'nativeResult', 'locator', 'checks', 'evidence'].sort());
    assert.deepEqual(result[0], candidate);
    assert.notStrictEqual(result[0], candidate);
    assertFrozenObservation(result[0] as unknown as Mutable);
  }

  const unavailableCandidate = {
    ...imagePassCandidate(), locator: unavailable('withheld'),
    checks: unavailable('withheld'),
    evidence: { elementKind: unavailable('withheld'), altState: unavailable('invalid') },
  };
  const input = [imagePassCandidate(':root > :nth-child(2)'), unavailableCandidate, imagePassCandidate(':root > :nth-child(2)')];
  const result = readComparisonCandidates(input, 'image-alt', coverage(3));
  assert.equal(result.length, 3);
  assert.deepEqual(result.map(item => item.locator), [fact(':root > :nth-child(2)'), unavailable('withheld'), fact(':root > :nth-child(2)')]);
  (input[0] as Mutable).locator.value = ':root > :nth-child(9)';
  input.reverse();
  assert.deepEqual(result.map(item => item.locator), [fact(':root > :nth-child(2)'), unavailable('withheld'), fact(':root > :nth-child(2)')]);
});

test('candidate admission rejects missing, sparse, malformed, wrong-rule and count-mismatched collections', () => {
  const sparse = new Array(1);
  const accessor = [imagePassCandidate()];
  let getterCalls = 0;
  Object.defineProperty(accessor, '0', { enumerable: true, get() { getterCalls++; return imagePassCandidate(); } });
  const cases: Array<[unknown, 'image-alt' | 'label' | 'color-contrast', ReturnType<typeof coverage>]> = [
    [undefined, 'image-alt', coverage(null)],
    [sparse, 'image-alt', coverage(1)],
    [[imagePassCandidate()], 'image-alt', coverage(null)],
    [[], 'image-alt', coverage(1)],
    [[labelPassCandidate()], 'image-alt', coverage(1)],
    [[{ ...imagePassCandidate(), nativeResult: 'violation' }], 'image-alt', coverage(1)],
    [[{ ...imagePassCandidate(), findingId: 'fabricated' }], 'image-alt', coverage(1)],
    [[{ ...imagePassCandidate(), locator: { value: 'body img' } }], 'image-alt', coverage(1)],
    [accessor, 'image-alt', coverage(1)],
  ];
  for (const [input, rule, ruleCoverage] of cases) {
    assertInvalidContract(() => readComparisonCandidates(input, rule, ruleCoverage));
  }
  assert.equal(getterCalls, 0);
});

test('validateComparisonInput selects the actual finding and returns an exact deeply detached result', () => {
  const { baselineRun, laterRun } = comparisonRunPair();
  const input = {
    baselineRun, baselineFindingId: baselineRun.scan.findings[1]!.findingId,
    laterRun, candidates: [],
  };
  const result = validateComparisonInput(input);
  const value = acceptedComparison(result);
  assert.deepEqual(Object.keys(value).sort(), ['baselineRun', 'baselineFinding', 'laterRun', 'candidates'].sort());
  assert.equal(value.baselineFinding.findingId, baselineRun.scan.findings[1]!.findingId);
  assert.deepEqual(value.baselineFinding, value.baselineRun.scan.findings[1]);
  assert.notStrictEqual(value.baselineFinding, baselineRun.scan.findings[1]);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(value), true);
  assert.equal(Object.isFrozen(value.candidates), true);

  const mutable = clone(input) as unknown as Mutable;
  const detached = acceptedComparison(validateComparisonInput(mutable));
  mutable.baselineFindingId = 'changed';
  mutable.baselineRun.scan.findings[1]!.evidence.altState = fact('non-empty');
  assert.equal(detached.baselineFinding.findingId, input.baselineFindingId);
  assert.deepEqual(detached.baselineFinding.evidence, input.baselineRun.scan.findings[1]!.evidence);
});

test('public admission retains downstream Finding state and positively binds pass candidates to coverage', () => {
  const baselineRun = validatedCompletedRun(reviewedRun('approve'));
  const laterInput = clone(completedRun('later-run')) as unknown as Mutable;
  laterInput.baselineRunId = baselineRun.runId;
  laterInput.scan.coverage['image-alt'].passes = 1;
  const laterRun = validatedCompletedRun(laterInput);
  const candidate = imagePassCandidate(':root > :nth-child(4)');
  const result = acceptedComparison(validateComparisonInput({
    baselineRun,
    baselineFindingId: baselineRun.scan.findings[0]!.findingId,
    laterRun,
    candidates: [candidate],
  }));
  assert.equal(result.baselineFinding.state, 'accepted');
  assert.deepEqual(result.candidates, [candidate]);
  assert.notStrictEqual(result.candidates[0], candidate);
  assert.deepEqual(
    compareScanProfiles(comparisonProfile(baselineRun, 'image-alt'), comparisonProfile(laterRun, 'image-alt')),
    [],
  );
});

test('public comparison admission closes every invalid input and never evaluates accessors', () => {
  const pair = comparisonRunPair();
  const valid = {
    ...pair, baselineFindingId: pair.baselineRun.scan.findings[0]!.findingId, candidates: [],
  };
  const malformed = [
    undefined, null, [], {}, { ...valid, extra: 'private' },
    { ...valid, baselineFindingId: 'absent-finding' },
    { ...valid, laterRun: { ...pair.laterRun, baselineRunId: 'wrong-run' } },
    { ...valid, candidates: undefined },
    new Proxy({}, { ownKeys() { throw new Error('private inspection failure'); } }),
  ];
  for (const input of malformed) {
    const result = validateComparisonInput(input);
    assert.deepEqual(result, invalidComparison);
    assert.equal(Object.isFrozen(result), true);
  }

  const accessor = { ...valid } as Mutable;
  let getterCalls = 0;
  Object.defineProperty(accessor, 'baselineFindingId', {
    enumerable: true, get() { getterCalls++; throw new Error('private getter'); },
  });
  assert.deepEqual(validateComparisonInput(accessor), invalidComparison);
  assert.equal(getterCalls, 0);
});

test('comparisonProfile projects the exact frozen compatibility profile for binary and contrast rules', () => {
  const { baselineRun } = comparisonRunPair();
  const expected = {
    requestedUrl: baselineRun.requestedUrl,
    finalUrl: baselineRun.scan.context.finalUrl.value,
    rules: baselineRun.scan.context.rules,
    viewport: baselineRun.scan.context.viewport,
    locale: baselineRun.scan.context.locale,
    browserVersion: baselineRun.scan.context.browserVersion.value,
    scannerVersion: baselineRun.scan.context.scannerVersion,
    evidencePolicyVersion: baselineRun.scan.context.evidencePolicyVersion,
    scope: baselineRun.scan.context.scope,
    readiness: baselineRun.scan.context.readiness,
    freshContext: baselineRun.scan.context.freshContext,
    importedState: baselineRun.scan.context.importedState,
    interaction: baselineRun.scan.context.interaction,
    crawling: baselineRun.scan.context.crawling,
    iframes: baselineRun.scan.context.iframes,
    contrastProfile: null,
  };
  const image = comparisonProfile(baselineRun, 'image-alt');
  const label = comparisonProfile(baselineRun, 'label');
  const contrast = comparisonProfile(baselineRun, 'color-contrast');
  assert.deepEqual(Object.keys(image).sort(), Object.keys(expected).sort());
  assert.deepEqual(image, expected);
  assert.deepEqual(label, expected);
  assert.deepEqual(contrast, { ...expected, contrastProfile: 'axe-core-4.13.0-default' });
  for (const profile of [image, label, contrast]) {
    assert.equal(Object.isFrozen(profile), true);
    assert.equal(Object.isFrozen(profile.rules), true);
    assert.equal(Object.isFrozen(profile.viewport), true);
    assert.notStrictEqual(profile.viewport, baselineRun.scan.context.viewport);
  }
});

test('compareScanProfiles reports every differing dimension once in canonical order', () => {
  const { baselineRun } = comparisonRunPair();
  const baseline = comparisonProfile(baselineRun, 'color-contrast');
  assert.deepEqual(compareScanProfiles(baseline, baseline), []);
  assert.equal(Object.isFrozen(compareScanProfiles(baseline, baseline)), true);

  const dimensions = [
    ['requestedUrl', 'https://example.org/other', 'requested-url'],
    ['finalUrl', 'https://example.org/other-final', 'final-url'],
    ['rules', ['color-contrast', 'label', 'image-alt'], 'rule-profile'],
    ['viewport', { width: 800, height: 600 }, 'viewport'],
    ['locale', 'es-CO', 'locale'],
    ['browserVersion', '151.0.7922.34', 'browser-version'],
    ['scannerVersion', 'other', 'scanner-version'],
    ['evidencePolicyVersion', 'other', 'evidence-policy'],
    ['scope', 'other', 'document-scope'],
    ['readiness', 'load', 'readiness'],
    ['contrastProfile', 'other', 'contrast-profile'],
  ] as const;
  for (const [key, value, code] of dimensions) {
    const later = { ...baseline, [key]: value } as unknown as Parameters<typeof compareScanProfiles>[1];
    assert.deepEqual(compareScanProfiles(baseline, later), [code]);
  }
  for (const [key, value] of [
    ['freshContext', false], ['importedState', true], ['interaction', true],
    ['crawling', true], ['iframes', true],
  ] as const) {
    const later = { ...baseline, [key]: value } as unknown as Parameters<typeof compareScanProfiles>[1];
    assert.deepEqual(compareScanProfiles(baseline, later), ['scan-context']);
  }

  const allDifferent = {
    ...baseline,
    requestedUrl: 'https://example.org/other', finalUrl: 'https://example.org/other-final',
    rules: ['color-contrast', 'label', 'image-alt'], viewport: { width: 800, height: 600 },
    locale: 'es-CO', browserVersion: '151.0.7922.34', scannerVersion: 'other',
    evidencePolicyVersion: 'other', scope: 'other', readiness: 'load', freshContext: false,
    importedState: true, interaction: true, crawling: true, iframes: true,
    contrastProfile: 'other',
  } as unknown as Parameters<typeof compareScanProfiles>[1];
  assert.deepEqual(compareScanProfiles(baseline, allDifferent), [
    'requested-url', 'final-url', 'rule-profile', 'viewport', 'locale', 'browser-version',
    'scanner-version', 'evidence-policy', 'document-scope', 'readiness', 'scan-context',
    'contrast-profile',
  ]);
});

test('profile compatibility ignores identities, chronology, provider, timeout, counts and evidence', () => {
  const baseline = completedRun('baseline-run', 'local', 'populated');
  const changed = clone(completedRun('different-run', 'groq', 'unavailable')) as Mutable;
  changed.createdAt = '2026-08-30T09:59:59.000Z';
  changed.finishedAt = '2026-08-30T10:00:03.000Z';
  changed.applicationRevision = 'b'.repeat(40);
  changed.scan.context.timeoutMs = 1;
  changed.scan.coverage['image-alt'].passes = 1;
  changed.baselineRunId = baseline.runId;
  const admitted = validatedCompletedRun(changed);
  const baselineProfile = comparisonProfile(baseline, 'image-alt');
  const laterProfile = comparisonProfile(admitted, 'image-alt');
  assert.deepEqual(laterProfile, baselineProfile);
  assert.deepEqual(compareScanProfiles(baselineProfile, laterProfile), []);
});

test('invalid required source provenance is rejected before profile comparison', () => {
  const { baselineRun, laterRun } = comparisonRunPair();
  for (const path of ['finalUrl', 'browserVersion'] as const) {
    const invalid = clone(laterRun) as Mutable;
    invalid.scan.context[path] = unavailable('missing');
    assertInvalidContract(() => readComparisonRuns({ baselineRun, laterRun: invalid }));
    assert.deepEqual(validateComparisonInput({
      baselineRun, baselineFindingId: baselineRun.scan.findings[0]!.findingId,
      laterRun: invalid, candidates: [],
    }), invalidComparison);
  }
});
