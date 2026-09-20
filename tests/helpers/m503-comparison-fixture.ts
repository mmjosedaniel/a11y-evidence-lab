import assert from 'node:assert/strict';
import { compareFinding } from '../../src/server/comparison/compare-finding.ts';
import type { ComparisonResult } from '../../src/server/comparison/comparison-contract.ts';
import { validatedCompletedRun, contrastPassCandidate, imagePassCandidate } from './comparison-fixtures.ts';
import { completedRun } from './m102-run-fixture.ts';

export type ComparisonBranch =
  | 'not-comparable'
  | 'baseline-locator-unavailable'
  | 'ambiguous'
  | 'later-locator-unavailable'
  | 'no-exact-match'
  | 'unique-violation'
  | 'unique-incomplete'
  | 'unique-pass';

type MutableRecord = Record<string | number, unknown>;

function record(value: unknown): MutableRecord {
  return value as MutableRecord;
}

function scan(value: unknown): MutableRecord {
  return record(record(value).scan);
}

function coverage(value: unknown): MutableRecord {
  return record(record(scan(value).coverage)['image-alt']);
}

function findings(value: unknown): MutableRecord[] {
  return scan(value).findings as MutableRecord[];
}

function observations(value: unknown): MutableRecord[] {
  return scan(value).scannerReviewObservations as MutableRecord[];
}

function observation(source: MutableRecord): MutableRecord {
  return {
    ruleId: source.ruleId,
    nativeResult: source.nativeResult,
    checks: structuredClone(source.checks),
    locator: structuredClone(source.locator),
    evidence: structuredClone(source.evidence),
    ...(Object.hasOwn(source, 'incompleteReason')
      ? { incompleteReason: structuredClone(source.incompleteReason) }
      : {}),
  };
}

function noRetainedEvidence(run: MutableRecord): void {
  scan(run).findings = [];
  scan(run).scannerReviewObservations = [];
  Object.assign(coverage(run), { violations: null, incomplete: null, passes: null, inapplicable: 0 });
}

export function projectComparison(value: ComparisonResult): MutableRecord {
  const durable: MutableRecord = {
    baseline: {
      findingId: value.baseline.findingId,
      observation: structuredClone(value.baseline.observation),
      requestedUrl: value.context.baseline.requestedUrl,
      scanContext: structuredClone(value.context.baseline.scanContext),
    },
    rationale: value.rationale,
    limitations: [...value.limitations],
    followUp: value.followUp,
  };
  if (value.pair === 'not-comparable') {
    return { ...durable, pair: value.pair, mismatches: [...value.mismatches], reason: value.reason };
  }
  Object.assign(durable, {
    pair: value.pair,
    match: value.match,
    outcome: value.outcome,
    reason: value.reason,
    ...('after' in value ? { after: structuredClone(value.after) } : {}),
    ...(value.delta ? { delta: structuredClone(value.delta) } : {}),
  });
  return durable;
}

export function expectedComparison(input: {
  baselineRun: ReturnType<typeof validatedCompletedRun>;
  baselineFindingId: string;
  laterRun: ReturnType<typeof validatedCompletedRun>;
  candidates: readonly unknown[];
}): MutableRecord {
  const calculated = compareFinding(input);
  assert.ok(calculated.ok, 'Expected comparison fixture must pass the production calculation boundary');
  return projectComparison(calculated.value);
}

export function comparisonScenario(branch: ComparisonBranch = 'unique-violation'): {
  baselineRun: ReturnType<typeof validatedCompletedRun>;
  laterRun: ReturnType<typeof validatedCompletedRun>;
  candidates: readonly unknown[];
  comparison: MutableRecord;
} {
  const baseline = structuredClone(completedRun('baseline-run')) as MutableRecord;
  const later = structuredClone(completedRun('later-run')) as MutableRecord;
  later.baselineRunId = 'baseline-run';
  const locator = structuredClone(findings(baseline)[0]!.locator);
  let candidates: readonly unknown[] = [];

  if (branch === 'not-comparable') {
    record(scan(later).context).locale = 'fr-FR';
  } else if (branch === 'baseline-locator-unavailable') {
    findings(baseline)[0]!.locator = { unavailable: 'missing' };
  } else if (branch === 'later-locator-unavailable') {
    for (const source of [...findings(later), ...observations(later)]) {
      source.locator = { unavailable: 'missing' };
    }
  } else if (branch === 'no-exact-match') {
    noRetainedEvidence(later);
    scan(later).findings = [
      { ...structuredClone(findings(baseline)[0]!), findingId: 'finding-other', locator: { value: ':root > :nth-child(9)' } },
    ];
    Object.assign(coverage(later), { violations: 1, inapplicable: null });
  } else if (branch === 'unique-violation') {
    const retained = structuredClone(findings(later)[0]!);
    noRetainedEvidence(later);
    scan(later).findings = [retained];
    Object.assign(coverage(later), { violations: 1, inapplicable: null });
  } else if (branch === 'unique-incomplete') {
    const retained = structuredClone(observations(later)[0]!);
    retained.locator = locator;
    noRetainedEvidence(later);
    scan(later).scannerReviewObservations = [retained];
    Object.assign(coverage(later), { incomplete: 1, inapplicable: null });
  } else if (branch === 'unique-pass') {
    noRetainedEvidence(later);
    Object.assign(coverage(later), { passes: 1, inapplicable: null });
    candidates = [imagePassCandidate(record(locator).value as string)];
  }

  const baselineRun = validatedCompletedRun(baseline);
  const laterRun = validatedCompletedRun(later);
  const calculated = compareFinding({
    baselineRun,
    baselineFindingId: baselineRun.scan.findings[0]!.findingId,
    laterRun,
    candidates,
  });
  assert.ok(calculated.ok, 'M503 fixture must pass the existing transient comparison boundary');
  assert.equal(calculated.value.pair === 'not-comparable' ? calculated.value.pair : calculated.value.match, branch);
  return { baselineRun, laterRun, candidates, comparison: projectComparison(calculated.value) };
}

export function comparisonRun(branch: ComparisonBranch = 'unique-violation'): MutableRecord {
  const scenario = comparisonScenario(branch);
  return { ...structuredClone(scenario.laterRun), comparison: structuredClone(scenario.comparison) };
}

export function comparisonForRuns<T>(baselineInput: unknown, laterInput: T,
  candidates: readonly unknown[] = [], baselineFindingId?: string): T {
  const baselineRun = validatedCompletedRun(structuredClone(baselineInput));
  const laterRun = validatedCompletedRun(structuredClone(laterInput));
  const calculated = compareFinding({
    baselineRun,
    baselineFindingId: baselineFindingId ?? baselineRun.scan.findings[0]!.findingId,
    laterRun,
    candidates,
  });
  assert.ok(calculated.ok, 'UI comparison fixture must pass the production calculation boundary');
  return { ...structuredClone(laterRun), comparison: projectComparison(calculated.value) } as T;
}

export function resolvedZeroComparisonForRuns<T>(baselineInput: unknown, laterInput: T,
  baselineFindingId?: string): T {
  const baselineRun = validatedCompletedRun(structuredClone(baselineInput));
  const finding = baselineRun.scan.findings.find(item => item.findingId === baselineFindingId)
    ?? baselineRun.scan.findings[0]!;
  const locator = finding.locator;
  assert.equal(finding.ruleId, 'image-alt', 'Resolved-zero fixture currently owns the concrete image-alt pass vector');
  assert.ok('value' in locator, 'Resolved-zero fixture requires an available baseline locator');
  const later = structuredClone(laterInput) as MutableRecord;
  const ruleCoverage = record(record(scan(later).coverage)['image-alt']);
  Object.assign(ruleCoverage, { violations: null, incomplete: null, passes: 1, inapplicable: null });
  const result = comparisonForRuns(baselineRun, later, [imagePassCandidate(locator.value)], finding.findingId) as T;
  const comparison = record(result).comparison as MutableRecord;
  assert.equal(comparison.match, 'unique-pass');
  assert.equal(comparison.outcome, 'resolved');
  return result;
}

export function withComparison<T>(input: T, expectedBranch: ComparisonBranch = 'ambiguous'): T {
  const scenario = comparisonScenario();
  const value = structuredClone(input) as MutableRecord;
  const baselineRunId = typeof value.baselineRunId === 'string'
    ? value.baselineRunId
    : scenario.baselineRun.runId;
  value.baselineRunId = baselineRunId;
  const baselineRun = validatedCompletedRun({ ...scenario.baselineRun, runId: baselineRunId });
  const laterRun = validatedCompletedRun(value);
  const calculated = compareFinding({
    baselineRun,
    baselineFindingId: baselineRun.scan.findings[0]!.findingId,
    laterRun,
    candidates: [],
  });
  assert.ok(calculated.ok, 'Downstream fixture must pass the actual transient comparison boundary');
  assert.equal(calculated.value.pair === 'not-comparable' ? calculated.value.pair : calculated.value.match,
    expectedBranch);
  value.comparison = projectComparison(calculated.value);
  return value as T;
}

export function contrastComparisonRun(direction: 'improved' | 'persistent' | 'regressed'): MutableRecord {
  const baseline = structuredClone(completedRun('baseline-run')) as MutableRecord;
  const later = structuredClone(completedRun('later-run')) as MutableRecord;
  later.baselineRunId = 'baseline-run';
  const locator = ':root > :nth-child(3)';
  const violation = (findingId: string, ratio: number): MutableRecord => {
    const pass = contrastPassCandidate(locator) as unknown as MutableRecord;
    return {
      ...structuredClone(pass),
      findingId,
      nativeResult: 'violation',
      state: 'unprocessed',
      evidence: { ...structuredClone(record(pass.evidence)), contrastRatio: { value: ratio } },
    };
  };
  const laterRatio = { improved: 4, persistent: 3, regressed: 2 }[direction];
  for (const [run, finding] of [
    [baseline, violation('finding-contrast-baseline', 3)],
    [later, violation('finding-contrast-later', laterRatio)],
  ] as const) {
    scan(run).findings = [finding];
    scan(run).scannerReviewObservations = [];
    Object.assign(record(scan(run).coverage), {
      'image-alt': { violations: null, incomplete: null, passes: null, inapplicable: 0 },
      label: { violations: null, incomplete: null, passes: null, inapplicable: 0 },
      'color-contrast': { violations: 1, incomplete: null, passes: null, inapplicable: null },
    });
  }
  const baselineRun = validatedCompletedRun(baseline);
  const laterRun = validatedCompletedRun(later);
  const calculated = compareFinding({
    baselineRun,
    baselineFindingId: baselineRun.scan.findings[0]!.findingId,
    laterRun,
    candidates: [],
  });
  assert.ok(calculated.ok && calculated.value.pair === 'comparable');
  assert.equal(calculated.value.outcome, direction === 'persistent' ? 'persistent' : direction);
  assert.ok(calculated.value.delta, 'Contrast fixture must retain an arithmetic delta');
  return { ...structuredClone(laterRun), comparison: projectComparison(calculated.value) };
}

export function mutate(input: unknown, path: readonly (string | number)[], value: unknown): unknown {
  const clone = structuredClone(input);
  let current = clone as MutableRecord;
  for (const key of path.slice(0, -1)) current = current[key] as MutableRecord;
  current[path[path.length - 1]!] = value;
  return clone;
}

export function remove(input: unknown, path: readonly (string | number)[]): unknown {
  const clone = structuredClone(input);
  let current = clone as MutableRecord;
  for (const key of path.slice(0, -1)) current = current[key] as MutableRecord;
  delete current[path[path.length - 1]!];
  return clone;
}
