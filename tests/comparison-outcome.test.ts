import assert from 'node:assert/strict';
import { readFileSync as actualReadFileSync } from 'node:fs';
import { after, mock, test } from 'node:test';
import { validateComparisonInput } from '../src/server/comparison/comparison-contract.ts';
import type { ComparisonObservation, ValidatedComparisonInput } from '../src/server/comparison/comparison-contract.ts';
import type { Available, Locator, NativeFinding, ScannerReviewObservation } from '../src/server/domain/run-contract/run-types.ts';
import { completedRun } from './helpers/m102-run-fixture.ts';

let corruptedPath: string | null = null;
mock.module('node:fs', { namedExports: {
  readFileSync(path: Parameters<typeof actualReadFileSync>[0], options?: Parameters<typeof actualReadFileSync>[1]) {
    const value = (actualReadFileSync as any)(path, options);
    if (corruptedPath && String(path).replaceAll('\\', '/').endsWith(corruptedPath)) {
      const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value as string);
      return Buffer.concat([buffer, Buffer.from('\ncorrupted in memory')]);
    }
    return value;
  },
} });

const [{ correlateTarget }, { classifyEvidencePair }, { compareFinding }, fixtures] = await Promise.all([
  import('../src/server/comparison/target-correlation.ts'),
  import('../src/server/comparison/finding-outcome.ts'),
  import('../src/server/comparison/compare-finding.ts'),
  import('./helpers/comparison-fixtures.ts'),
]);
after(() => mock.restoreAll());

const { compareControlledScanPair, contrastPassCandidate, imagePassCandidate,
  labelPassCandidate, validatedCompletedRun } = fixtures;
type Mutable = Record<string, any>;
const clone = <T>(value: T): T => structuredClone(value);
const locator = ':root > :nth-child(2)';
const fact = <const T>(value: T): Available<T> => ({ value });
const unavailable = <const R extends string>(reason: R = 'missing' as R) => ({ unavailable: reason } as const);
const policyObservation = (value: unknown): ComparisonObservation => value as ComparisonObservation;
type ImageFinding = Extract<NativeFinding, { ruleId: 'image-alt' }>;
type LabelFinding = Extract<NativeFinding, { ruleId: 'label' }>;
type ContrastFinding = Extract<NativeFinding, { ruleId: 'color-contrast' }>;
type ContrastObservation = Extract<ComparisonObservation, { ruleId: 'color-contrast' }>;

const imageViolation = (findingId = 'baseline-finding', at: Locator = fact(locator)): ImageFinding => ({
  findingId, ruleId: 'image-alt' as const, nativeResult: 'violation' as const, state: 'unprocessed' as const,
  locator: at, checks: fact({ any: ['has-alt'], all: [], none: [] } as const),
  evidence: { elementKind: fact('img'), altState: fact('absent') },
});
const labelViolation = (findingId = 'baseline-label', at: Locator = fact(locator)): LabelFinding => ({
  findingId, ruleId: 'label' as const, nativeResult: 'violation' as const, state: 'unprocessed' as const,
  locator: at, checks: fact({ any: ['explicit-label'], all: [], none: [] } as const),
  evidence: { elementKind: fact('input'), inputType: fact('text'), nameSources: {
    explicitLabel: fact(false), implicitLabel: fact(false), ariaLabel: fact('absent'),
    ariaLabelledby: fact('absent'), title: fact('absent'), placeholder: fact('absent'),
    presentationalRole: fact(false),
  } },
});
const contrastObservation = (nativeResult: 'violation' | 'pass', ratio = 3.54, expected: 3 | 4.5 = 4.5,
  at: Locator = fact(locator)): ContrastObservation => ({
  ruleId: 'color-contrast' as const, nativeResult, locator: at,
  checks: fact({ any: ['color-contrast'], all: [], none: [] } as const),
  evidence: {
    foregroundColor: fact('#888888'), backgroundColor: fact('#ffffff'), shadowColor: unavailable(),
    contrastRatio: fact(ratio), expectedContrastRatio: fact(expected), fontSize: fact('12.0pt (16px)'),
    fontWeight: fact('normal'), measurementSource: 'axe-core' as const, messageKey: unavailable(),
  },
} as ContrastObservation);
const contrastViolation = (findingId = 'baseline-contrast', ratio = 3.54,
  expected: 3 | 4.5 = 4.5): ContrastFinding => ({
  findingId, state: 'unprocessed' as const, ...contrastObservation('violation', ratio, expected),
} as ContrastFinding);
const incomplete = (rule: 'image-alt' | 'label' | 'color-contrast',
  at: Locator = fact(locator)): ScannerReviewObservation => {
  const source = rule === 'image-alt' ? imageViolation('unused', at)
    : rule === 'label' ? labelViolation('unused', at) : contrastViolation('unused');
  const { findingId: _id, state: _state, ...observation } = source;
  return { ...observation,
    ...(rule === 'color-contrast' ? { evidence: { ...observation.evidence, messageKey: fact('bgImage') } } : {}),
    nativeResult: 'incomplete' as const,
    incompleteReason: rule === 'color-contrast' ? fact('bgImage') : unavailable() } as ScannerReviewObservation;
};

function run(input: {
  runId: string; baselineRunId?: string; findings?: readonly unknown[];
  observations?: readonly unknown[]; passes?: Partial<Record<'image-alt' | 'label' | 'color-contrast', number>>;
  profile?: Record<string, unknown>;
}) {
  const value = clone(completedRun(input.runId)) as Mutable;
  if (input.baselineRunId) value.baselineRunId = input.baselineRunId;
  value.scan.findings = input.findings ?? [];
  value.scan.scannerReviewObservations = input.observations ?? [];
  for (const rule of ['image-alt', 'label', 'color-contrast'] as const) {
    const violations = value.scan.findings.filter((item: Mutable) => item.ruleId === rule).length;
    const incompletes = value.scan.scannerReviewObservations.filter((item: Mutable) => item.ruleId === rule).length;
    const passes = input.passes?.[rule] ?? 0;
    value.scan.coverage[rule] = {
      violations: violations || null, incomplete: incompletes || null, passes: passes || null,
      inapplicable: violations || incompletes || passes ? null : 0,
    };
  }
  if (input.profile) Object.assign(value.scan.context, input.profile);
  return validatedCompletedRun(value);
}

function admitted(options: {
  baseline?: ReturnType<typeof imageViolation>; laterFindings?: readonly unknown[];
  observations?: readonly unknown[]; candidates?: readonly unknown[];
} = {}): ValidatedComparisonInput {
  const baselineFinding = options.baseline ?? imageViolation();
  const baselineRun = run({ runId: 'baseline-run', findings: [baselineFinding] });
  const candidates = options.candidates ?? [];
  const laterRun = run({ runId: 'later-run', baselineRunId: baselineRun.runId,
    findings: options.laterFindings, observations: options.observations,
    passes: { [baselineFinding.ruleId]: candidates.length } });
  const result = validateComparisonInput({ baselineRun, baselineFindingId: baselineFinding.findingId,
    laterRun, candidates });
  assert.ok(result.ok, 'Comparison fixture must pass the real frozen admission boundary');
  return result.value;
}

test('correlation applies exact all-bucket precedence and never chooses by order', () => {
  assert.deepEqual(correlateTarget(admitted({ baseline: imageViolation('base', unavailable()) })),
    { match: 'baseline-locator-unavailable' });
  const exactFinding = imageViolation('later');
  const exactPass = imagePassCandidate(locator);
  assert.deepEqual(correlateTarget(admitted({ laterFindings: [exactFinding], candidates: [exactPass] })),
    { match: 'ambiguous' });
  assert.deepEqual(correlateTarget(admitted({ observations: [incomplete('image-alt')], candidates: [exactPass] })),
    { match: 'ambiguous' });
  assert.deepEqual(correlateTarget(admitted({ candidates: [exactPass, clone(exactPass)] })),
    { match: 'ambiguous' });
  assert.deepEqual(correlateTarget(admitted({
    laterFindings: [imageViolation('unknown', unavailable())], candidates: [exactPass, clone(exactPass)],
  })), { match: 'ambiguous' });
  assert.deepEqual(correlateTarget(admitted({ laterFindings: [exactFinding, imageViolation('duplicate')] })),
    { match: 'ambiguous' });
  assert.deepEqual(correlateTarget(admitted({ laterFindings: [exactFinding, imageViolation('unknown', unavailable())] })),
    { match: 'later-locator-unavailable' });
  assert.deepEqual(correlateTarget(admitted({ laterFindings: [imageViolation('changed', fact(':root > :nth-child(9)'))] })),
    { match: 'no-exact-match' });
});

test('unique violation, incomplete and pass return only their bounded after projection', () => {
  const cases = [
    [admitted({ laterFindings: [imageViolation('later')] }), 'unique-violation', 'finding'],
    [admitted({ observations: [incomplete('image-alt')] }), 'unique-incomplete', 'incomplete'],
    [admitted({ candidates: [imagePassCandidate(locator)] }), 'unique-pass', 'native-pass'],
  ] as const;
  for (const [input, match, kind] of cases) {
    const before = clone(input);
    const result = correlateTarget(input);
    assert.equal(result.match, match);
    assert.ok('after' in result, 'Unique match must carry bounded after evidence');
    assert.equal(result.after.kind, kind);
    assert.deepEqual(input, before);
    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result.after), true);
    assert.equal(Object.hasOwn(result.after, 'findingId'), kind === 'finding');
    assert.equal(Object.hasOwn(result.after.observation, 'findingId'), false);
    assert.equal(Object.hasOwn(result.after.observation, 'state'), false);
    assert.deepEqual(Object.keys(result.after.observation).sort(),
      [...(kind === 'incomplete' ? ['incompleteReason'] : []), 'ruleId', 'nativeResult', 'locator', 'checks', 'evidence'].sort());
  }
});

test('binary evidence remains conservative for failures, sufficient passes and policy-only reversal', () => {
  const failingPairs: readonly (readonly [ComparisonObservation, ComparisonObservation])[] = [
    [imageViolation(), { ...imageViolation('later'), checks: unavailable(), evidence: {
      elementKind: unavailable(), altState: unavailable() } }],
    [labelViolation(), { ...labelViolation('later'), checks: unavailable() }],
  ];
  for (const [baseline, later] of failingPairs) assert.deepEqual(classifyEvidencePair(baseline, later),
    { outcome: 'persistent', reason: 'binary-still-failing' });

  const resolvedPairs: readonly (readonly [ComparisonObservation, ComparisonObservation])[] = [
    [imageViolation(), imagePassCandidate(locator)],
    [labelViolation(), labelPassCandidate(locator)],
  ];
  for (const [baseline, later] of resolvedPairs) assert.deepEqual(classifyEvidencePair(baseline, later),
    { outcome: 'resolved', reason: 'native-pass' });

  const positiveImage = imagePassCandidate(locator);
  assert.deepEqual(classifyEvidencePair(positiveImage, imageViolation()),
    { outcome: 'regressed', reason: 'native-failure-after-pass' });
  assert.deepEqual(classifyEvidencePair(imageViolation(), labelPassCandidate(locator)),
    { outcome: 'inconclusive', reason: 'conflicting-evidence' });
});

test('image and label resolution require every minimized fact and recognized nonempty checks', () => {
  const image = imagePassCandidate(locator) as Mutable;
  for (const [change, reason] of [
    [{ checks: unavailable() }, 'insufficient-evidence'],
    [{ checks: fact({ any: [], all: [], none: [] }) }, 'insufficient-evidence'],
    [{ checks: fact({ any: ['unknown'], all: [], none: [] }) }, 'conflicting-evidence'],
    [{ evidence: { ...image.evidence, elementKind: unavailable() } }, 'insufficient-evidence'],
    [{ evidence: { ...image.evidence, altState: unavailable() } }, 'insufficient-evidence'],
  ] as const) assert.deepEqual(classifyEvidencePair(imageViolation(), policyObservation({ ...image, ...change })),
    { outcome: 'inconclusive', reason });

  const label = labelPassCandidate(locator) as Mutable;
  const sourceKeys = Object.keys(label.evidence.nameSources);
  for (const key of sourceKeys) {
    const later = clone(label) as Mutable;
    later.evidence.nameSources[key] = unavailable();
    assert.deepEqual(classifyEvidencePair(labelViolation(), policyObservation(later)),
      { outcome: 'inconclusive', reason: 'insufficient-evidence' });
  }
  assert.deepEqual(classifyEvidencePair(labelViolation(), policyObservation({
    ...label, evidence: { ...label.evidence, elementKind: fact('textarea'), inputType: { unavailable: 'not-applicable' } },
  })), { outcome: 'resolved', reason: 'native-pass' });
  assert.deepEqual(classifyEvidencePair(labelViolation(), policyObservation({
    ...label, evidence: { ...label.evidence, inputType: unavailable() },
  })), { outcome: 'inconclusive', reason: 'insufficient-evidence' });
});

test('contrast violation margins use exact arithmetic and the policy vector in both directions', () => {
  const baseline = contrastObservation('violation', 3.54);
  const improved = classifyEvidencePair(baseline, contrastObservation('violation', 4));
  assert.deepEqual(improved, { outcome: 'improved', reason: 'contrast-margin-increased',
    delta: { baselineMargin: 3.54 - 4.5, laterMargin: 4 - 4.5, change: (4 - 4.5) - (3.54 - 4.5) } });
  assert.deepEqual(classifyEvidencePair(contrastObservation('violation', 4), baseline), {
    outcome: 'regressed', reason: 'contrast-margin-decreased',
    delta: { baselineMargin: -0.5, laterMargin: 3.54 - 4.5, change: (3.54 - 4.5) - -0.5 },
  });
  assert.deepEqual(classifyEvidencePair(baseline, clone(baseline)), {
    outcome: 'persistent', reason: 'contrast-margin-equal',
    delta: { baselineMargin: 3.54 - 4.5, laterMargin: 3.54 - 4.5, change: 0 },
  });
});

test('contrast validates retained provenance, bucket consistency and measurement classes', () => {
  const violation = contrastObservation('violation', 3.54);
  const mutableViolation = clone(violation) as Mutable;
  assert.deepEqual(classifyEvidencePair(violation, contrastObservation('pass', 4.5)),
    { outcome: 'resolved', reason: 'native-pass' });
  assert.deepEqual(classifyEvidencePair(policyObservation({ ...violation, evidence: {
    ...violation.evidence, contrastRatio: unavailable(), expectedContrastRatio: unavailable(),
    fontSize: unavailable(), fontWeight: unavailable(), foregroundColor: unavailable(), backgroundColor: unavailable(),
  } }), contrastObservation('pass', 4.5)), { outcome: 'resolved', reason: 'native-pass' });

  const cases: readonly [Mutable, string][] = [
    [{ checks: unavailable() }, 'insufficient-evidence'],
    [{ checks: fact({ any: [], all: [], none: [] }) }, 'insufficient-evidence'],
    [{ evidence: { ...mutableViolation.evidence, foregroundColor: unavailable() } }, 'insufficient-evidence'],
    [{ evidence: { ...mutableViolation.evidence, shadowColor: { unavailable: 'withheld' } } }, 'insufficient-evidence'],
    [{ evidence: { ...mutableViolation.evidence, messageKey: fact('bgImage') } }, 'conflicting-evidence'],
    [{ evidence: { ...mutableViolation.evidence, fontSize: fact('11.9pt (16px)') } }, 'conflicting-evidence'],
    [{ evidence: { ...mutableViolation.evidence, expectedContrastRatio: fact(3) } }, 'conflicting-evidence'],
  ];
  for (const [change, reason] of cases) assert.deepEqual(classifyEvidencePair(violation,
    policyObservation({ ...violation, ...change })), { outcome: 'inconclusive', reason });

  for (const field of ['foregroundColor', 'backgroundColor', 'contrastRatio', 'expectedContrastRatio',
    'fontSize', 'fontWeight'] as const) {
    const later = clone(violation) as Mutable;
    later.evidence[field] = unavailable();
    assert.deepEqual(classifyEvidencePair(violation, policyObservation(later)),
      { outcome: 'inconclusive', reason: 'insufficient-evidence' });
  }
  for (const reason of ['invalid', 'withheld'] as const) {
    const later = clone(violation) as Mutable;
    later.evidence.messageKey = unavailable(reason);
    assert.deepEqual(classifyEvidencePair(violation, policyObservation(later)),
      { outcome: 'inconclusive', reason: 'insufficient-evidence' });
    later.evidence.messageKey = unavailable();
    later.evidence.shadowColor = unavailable(reason);
    assert.deepEqual(classifyEvidencePair(violation, policyObservation(later)),
      { outcome: 'inconclusive', reason: 'insufficient-evidence' });
  }

  const both = clone(violation) as Mutable;
  both.checks = fact({ any: [], all: [], none: [] });
  both.evidence.expectedContrastRatio = fact(3);
  assert.deepEqual(classifyEvidencePair(violation, policyObservation(both)),
    { outcome: 'inconclusive', reason: 'insufficient-evidence' });

  for (const [size, weight, expected] of [
    ['14.0pt (18.666666666666668px)', 'bold', 3],
    ['18.0pt (24px)', 'normal', 3],
  ] as const) {
    const later = clone(violation) as Mutable;
    later.evidence.fontSize = fact(size); later.evidence.fontWeight = fact(weight);
    later.evidence.expectedContrastRatio = fact(expected); later.evidence.contrastRatio = fact(2.5);
    assert.equal(classifyEvidencePair(policyObservation(later), policyObservation(clone(later))).outcome, 'persistent');
  }
  const differentClass = clone(violation) as Mutable;
  differentClass.evidence.fontSize = fact('18.0pt (24px)'); differentClass.evidence.expectedContrastRatio = fact(3);
  differentClass.evidence.contrastRatio = fact(2.5);
  assert.deepEqual(classifyEvidencePair(violation, policyObservation(differentClass)),
    { outcome: 'inconclusive', reason: 'measurement-profile-mismatch' });
  const sameClass = clone(violation) as Mutable;
  sameClass.evidence.foregroundColor = fact('#777777'); sameClass.evidence.backgroundColor = fact('#eeeeee');
  sameClass.evidence.fontSize = fact('13.5pt (18px)'); sameClass.evidence.fontWeight = fact('bold');
  sameClass.evidence.contrastRatio = fact(4);
  assert.equal(classifyEvidencePair(violation, policyObservation(sameClass)).outcome, 'improved');
  assert.equal(classifyEvidencePair(contrastObservation('violation', 4.5),
    contrastObservation('violation', 4.5)).outcome, 'persistent');
  assert.deepEqual(classifyEvidencePair(violation, contrastObservation('pass', 4.49)),
    { outcome: 'inconclusive', reason: 'conflicting-evidence' });
  assert.deepEqual(classifyEvidencePair(violation, contrastObservation('violation', 4.51)),
    { outcome: 'inconclusive', reason: 'conflicting-evidence' });
});

test('native incomplete and unsupported bucket combinations stay inconclusive without delta', () => {
  assert.deepEqual(classifyEvidencePair(imageViolation(), incomplete('image-alt')),
    { outcome: 'inconclusive', reason: 'native-incomplete' });
  for (const unsupportedBaseline of [imagePassCandidate(locator), incomplete('image-alt')]) {
    assert.deepEqual(classifyEvidencePair(unsupportedBaseline, incomplete('image-alt')),
      { outcome: 'inconclusive', reason: 'conflicting-evidence' });
  }
  const result = classifyEvidencePair(contrastObservation('pass', 4.5), contrastObservation('pass', 4.5));
  assert.deepEqual(result, { outcome: 'inconclusive', reason: 'conflicting-evidence' });
  assert.equal(Object.hasOwn(result, 'delta'), false);
});

test('composition admits, gates profiles, correlates and returns a frozen bounded result in that order', () => {
  assert.deepEqual(compareFinding({}), { ok: false, error: 'invalid-comparison-input' });
  const input = admitted({ laterFindings: [imageViolation('one'), imageViolation('two')] });
  const mismatched = clone(input.laterRun) as Mutable;
  mismatched.scan.context.locale = 'es-CO';
  const pairResult = compareFinding({ baselineRun: input.baselineRun,
    baselineFindingId: input.baselineFinding.findingId, laterRun: validatedCompletedRun(mismatched), candidates: [] });
  assert.ok(pairResult.ok, 'Expected pair result');
  assert.ok(pairResult.value.pair === 'not-comparable');
  assert.deepEqual(pairResult.value.mismatches, ['locale']);
  for (const key of ['match', 'outcome', 'after', 'delta']) assert.equal(Object.hasOwn(pairResult.value, key), false);

  const comparable = admitted({ candidates: [imagePassCandidate(locator)] });
  const before = clone(comparable);
  const result = compareFinding({ baselineRun: comparable.baselineRun,
    baselineFindingId: comparable.baselineFinding.findingId, laterRun: comparable.laterRun,
    candidates: comparable.candidates });
  assert.ok(result.ok, 'Expected comparison result');
  assert.ok(result.value.pair === 'comparable');
  assert.ok(result.value.match === 'unique-pass');
  assert.equal(result.value.outcome, 'resolved');
  assert.equal(result.value.after.kind, 'native-pass');
  assert.equal(result.value.baseline.runId, comparable.baselineRun.runId);
  assert.equal(result.value.baseline.findingId, comparable.baselineFinding.findingId);
  assert.equal(Object.hasOwn(result.value.baseline.observation, 'findingId'), false);
  assert.equal(Object.hasOwn(result.value.baseline.observation, 'state'), false);
  assert.deepEqual(Object.keys(result.value.baseline.observation).sort(),
    ['ruleId', 'nativeResult', 'locator', 'checks', 'evidence'].sort());
  assert.equal(result.value.laterRunId, comparable.laterRun.runId);
  assert.deepEqual(comparable, before);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.value), true);
  assert.deepEqual(result.value.limitations, [
    'This comparison describes automated evidence for one target; it does not establish accessibility, conformance, or remediation causality.',
  ]);
  assert.equal(result.value.followUp,
    'Review the target and relevant manual checks before drawing a broader conclusion.');
});

test('observed public reasons map to deterministic input-safe rationale', () => {
  const canary = 'PRIVATE-LOCATOR-AND-URL-CANARY';
  const reasons = [
    'pair-mismatch', 'baseline-locator-unavailable', 'later-locator-unavailable', 'no-exact-match', 'ambiguous',
    'native-incomplete', 'insufficient-evidence', 'conflicting-evidence', 'measurement-profile-mismatch',
    'native-pass', 'binary-still-failing', 'contrast-margin-increased', 'contrast-margin-equal',
    'contrast-margin-decreased', 'native-failure-after-pass',
  ];
  const observed = new Map<string, string>();
  const inputs = [
    admitted({ baseline: imageViolation('base', unavailable()) }),
    admitted({ baseline: imageViolation(canary), laterFindings: [imageViolation('later', fact(':root > :nth-child(9)'))] }),
    admitted({ candidates: [imagePassCandidate(locator)] }),
  ];
  for (const input of inputs) {
    const calculation = compareFinding({ baselineRun: input.baselineRun,
      baselineFindingId: input.baselineFinding.findingId, laterRun: input.laterRun, candidates: input.candidates });
    assert.ok(calculation.ok);
    assert.ok(reasons.includes(calculation.value.reason));
    assert.ok(calculation.value.rationale.trim().length > 0);
    assert.equal(calculation.value.rationale.includes(canary), false);
    const prior = observed.get(calculation.value.reason);
    if (prior) assert.equal(calculation.value.rationale, prior);
    observed.set(calculation.value.reason, calculation.value.rationale);
  }
});

function controlledProfile(runValue: Mutable) {
  runValue.requestedUrl = 'https://m105.test/';
  Object.assign(runValue.scan.context, {
    finalUrl: fact('https://m105.test/'), browserVersion: fact('151.0.7922.34'), scannerVersion: '4.13.0',
    evidencePolicyVersion: 'm1-public-v1', rules: ['image-alt', 'label', 'color-contrast'],
    viewport: { width: 1280, height: 720 }, locale: 'en-US', scope: 'current-rendered-top-level-document',
    readiness: 'load', freshContext: true, importedState: false, interaction: false, crawling: false,
    iframes: false, contrastProfile: 'axe-core-4.13.0-default',
  });
}

function controlledPair(ruleId: 'image-alt' | 'label' | 'color-contrast') {
  const declarations = {
    'image-alt': ['informative-image-alt', 'rd3-image', 'informative-image-alt-v1-failing',
      'informative-image-alt-v1-corrected', ':root > :nth-child(2) > :nth-child(1) > :nth-child(3)'],
    label: ['form-input-label', 'rd3-email', 'form-input-label-v1-failing',
      'form-input-label-v1-corrected', ':root > :nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(2)'],
    'color-contrast': ['text-contrast', 'rd3-text', 'text-contrast-v1-failing',
      'text-contrast-v1-corrected', ':root > :nth-child(2) > :nth-child(1) > :nth-child(2)'],
  } as const;
  const [scenario, targetKey, baselineRevision, laterRevision, expectedLocator] = declarations[ruleId];
  const baselineFinding = ruleId === 'image-alt' ? imageViolation('controlled-baseline', fact(expectedLocator))
    : ruleId === 'label' ? labelViolation('controlled-baseline', fact(expectedLocator))
      : { ...contrastViolation('controlled-baseline'), locator: fact(expectedLocator) };
  const candidate = ruleId === 'image-alt' ? imagePassCandidate(expectedLocator)
    : ruleId === 'label' ? labelPassCandidate(expectedLocator) : contrastPassCandidate(expectedLocator);
  const baseline = clone(completedRun('controlled-baseline')) as Mutable;
  baseline.scan.findings = [baselineFinding]; baseline.scan.scannerReviewObservations = [];
  const later = clone(completedRun('controlled-later')) as Mutable;
  later.baselineRunId = baseline.runId; later.scan.findings = []; later.scan.scannerReviewObservations = [];
  for (const current of ['image-alt', 'label', 'color-contrast']) {
    baseline.scan.coverage[current] = current === ruleId
      ? { violations: 1, incomplete: null, passes: null, inapplicable: null }
      : { violations: null, incomplete: null, passes: null, inapplicable: 0 };
    later.scan.coverage[current] = current === ruleId
      ? { violations: null, incomplete: null, passes: 1, inapplicable: null }
      : { violations: null, incomplete: null, passes: null, inapplicable: 0 };
  }
  controlledProfile(baseline); controlledProfile(later);
  return {
    input: { definitionVersion: 'm502-comparison-v1',
      baseline: { scenario, ruleId, targetKey, revision: baselineRevision, stateRole: 'failing', run: baseline },
      later: { scenario, ruleId, targetKey, revision: laterRevision, stateRole: 'corrected', run: later },
      candidates: [candidate] },
    expectedLocator,
  };
}

test('controlled binding verifies exact files and delegates all three declared directions to production', () => {
  for (const rule of ['image-alt', 'label', 'color-contrast'] as const) {
    const { input } = controlledPair(rule);
    const result = compareControlledScanPair(input);
    assert.ok(result.kind === 'comparison');
    assert.ok(result.result.ok);
    assert.ok(result.result.value.pair === 'comparable');
    assert.equal(result.result.value.outcome, 'resolved');
  }
});

test('controlled binding rejects metadata, reversed directions, profile drift and baseline cardinality', () => {
  const { input } = controlledPair('image-alt');
  assert.deepEqual(compareControlledScanPair({ ...input, callerLocator: locator }),
    { kind: 'invalid-input', reason: 'invalid-metadata' });
  assert.deepEqual(compareControlledScanPair({ ...input, definitionVersion: 'other' }),
    { kind: 'invalid-input', reason: 'invalid-metadata' });
  const hidden = { ...input } as Mutable;
  Object.defineProperty(hidden, 'privatePath', { value: 'fixtures/private.html', enumerable: false });
  assert.deepEqual(compareControlledScanPair(hidden), { kind: 'invalid-input', reason: 'invalid-metadata' });
  assert.deepEqual(compareControlledScanPair(Object.assign(Object.create({ inherited: true }), input)),
    { kind: 'invalid-input', reason: 'invalid-metadata' });
  let coercions = 0;
  assert.deepEqual(compareControlledScanPair({ ...input, baseline: { ...input.baseline,
    ruleId: { toString() { coercions++; return 'image-alt'; } } } }),
  { kind: 'invalid-input', reason: 'invalid-metadata' });
  assert.equal(coercions, 0);
  assert.deepEqual(compareControlledScanPair({
    ...input,
    baseline: { ...input.baseline, revision: input.later.revision, stateRole: 'corrected' },
    later: { ...input.later, revision: input.baseline.revision, stateRole: 'failing' },
  }),
    { kind: 'not-comparable', reason: 'undeclared-direction' });
  const drift = clone(input) as Mutable;
  drift.later.run.scan.context.locale = 'es-CO';
  assert.deepEqual(compareControlledScanPair(drift),
    { kind: 'not-comparable', reason: 'profile-mismatch', mismatches: ['locale'] });
  const missing = clone(input) as Mutable;
  missing.baseline.run.scan.findings = [];
  missing.baseline.run.scan.coverage['image-alt'] = { violations: null, incomplete: null, passes: null, inapplicable: 0 };
  assert.deepEqual(compareControlledScanPair(missing),
    { kind: 'inconclusive', reason: 'missing-target', side: 'baseline' });
  const duplicate = clone(input) as Mutable;
  duplicate.baseline.run.scan.findings.push({ ...duplicate.baseline.run.scan.findings[0], findingId: 'duplicate' });
  duplicate.baseline.run.scan.coverage['image-alt'].violations = 2;
  assert.deepEqual(compareControlledScanPair(duplicate),
    { kind: 'inconclusive', reason: 'ambiguous-target', side: 'baseline' });
});

test('controlled binding reports read-only corruption and invalid scans without touching frozen files', () => {
  const { input } = controlledPair('image-alt');
  corruptedPath = 'fixtures/rd003/informative-image-alt/failing.html';
  try {
    assert.deepEqual(compareControlledScanPair(input), { kind: 'invalid-input', reason: 'source-integrity' });
  } finally {
    corruptedPath = null;
  }
  assert.deepEqual(compareControlledScanPair({ ...input, candidates: undefined }),
    { kind: 'invalid-input', reason: 'invalid-scan-input' });
  const invalid = clone(input) as Mutable;
  invalid.later.run.baselineRunId = 'wrong';
  assert.deepEqual(compareControlledScanPair(invalid),
    { kind: 'invalid-input', reason: 'invalid-scan-input' });
});

test('controlled admission snapshots descriptor values and does not reread the effectful original', () => {
  const { input } = controlledPair('image-alt');
  let reads = 0;
  const baseline = new Proxy(input.baseline, {
    ownKeys: target => Reflect.ownKeys(target),
    getOwnPropertyDescriptor(target, key) {
      reads++;
      if (reads > 12) throw new Error('original metadata reread');
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });
  const result = compareControlledScanPair({ ...input, baseline });
  assert.equal(result.kind, 'comparison');
  assert.ok(reads > 0);
});
