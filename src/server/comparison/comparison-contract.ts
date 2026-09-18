import { validateRun } from '../domain/run-contract.ts';
import {
  readArray, readChoice, readId, readObject, requireValid,
} from '../domain/run-contract/contract-value-reader.ts';
import { readLocator, readRuleDetails } from '../domain/run-contract/finding-validation.ts';
import type { Rule } from '../domain/run-contract/run-policy.ts';
import type {
  Finding, Locator, PageAnalysisRun, RuleCoverage, RuleDetails, ScannerReviewObservation,
} from '../domain/run-contract/run-types.ts';
import type { PairMismatch } from './scan-pair.ts';

export type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;
export type NativePassObservation = RuleDetails & {
  readonly nativeResult: 'pass';
  readonly locator: Locator;
};
export type ComparisonObservation = NativePassObservation | ScannerReviewObservation | (RuleDetails & {
  readonly nativeResult: 'violation';
  readonly locator: Locator;
});
export type ComparisonRuns = {
  readonly baselineRun: CompletedRun;
  readonly laterRun: CompletedRun;
};
export type ValidatedComparisonInput = ComparisonRuns & {
  readonly baselineFinding: Finding;
  readonly candidates: readonly NativePassObservation[];
};
export type ComparisonInputValidation =
  | { readonly ok: true; readonly value: ValidatedComparisonInput }
  | { readonly ok: false; readonly error: 'invalid-comparison-input' };

export type CorrelationUncertainty =
  | 'baseline-locator-unavailable' | 'later-locator-unavailable' | 'no-exact-match' | 'ambiguous';
export type TargetMatch =
  | { readonly match: CorrelationUncertainty }
  | { readonly match: 'unique-violation'; readonly after: {
    readonly kind: 'finding'; readonly findingId: string; readonly observation: ComparisonObservation;
  } }
  | { readonly match: 'unique-incomplete'; readonly after: {
    readonly kind: 'incomplete'; readonly observation: ComparisonObservation;
  } }
  | { readonly match: 'unique-pass'; readonly after: {
    readonly kind: 'native-pass'; readonly observation: ComparisonObservation;
  } };
export type ComparisonReason = CorrelationUncertainty | 'pair-mismatch' | 'native-incomplete'
  | 'insufficient-evidence' | 'conflicting-evidence' | 'measurement-profile-mismatch'
  | 'native-pass' | 'binary-still-failing' | 'contrast-margin-increased' | 'contrast-margin-equal'
  | 'contrast-margin-decreased' | 'native-failure-after-pass';
export type EvidenceOutcome = {
  readonly outcome: 'resolved' | 'persistent' | 'improved' | 'regressed' | 'inconclusive';
  readonly reason: ComparisonReason;
  readonly delta?: {
    readonly baselineMargin: number; readonly laterMargin: number; readonly change: number;
  };
};
type ComparisonResultBase = {
  readonly baseline: { readonly runId: string; readonly findingId: string; readonly observation: ComparisonObservation };
  readonly laterRunId: string;
  readonly context: {
    readonly baseline: { readonly requestedUrl: string; readonly scanContext: CompletedRun['scan']['context'] };
    readonly later: { readonly requestedUrl: string; readonly scanContext: CompletedRun['scan']['context'] };
  };
  readonly rationale: string;
  readonly limitations: readonly [string];
  readonly followUp: string;
};
export type ComparisonResult = ComparisonResultBase & (
  | { readonly pair: 'not-comparable'; readonly mismatches: readonly PairMismatch[]; readonly reason: 'pair-mismatch' }
  | ({ readonly pair: 'comparable' } & TargetMatch & EvidenceOutcome)
);
export type ComparisonCalculation =
  | { readonly ok: true; readonly value: ComparisonResult }
  | { readonly ok: false; readonly error: 'invalid-comparison-input' };

export function readComparisonRuns(input: unknown): ComparisonRuns {
  try {
    const record = readObject(input, ['baselineRun', 'laterRun']);
    const baseline = validateRun(record.baselineRun);
    const later = validateRun(record.laterRun);
    requireValid(baseline.ok && later.ok);
    const baselineRun = baseline.value;
    const laterRun = later.value;
    requireValid(baselineRun.status === 'completed' && laterRun.status === 'completed');
    requireValid(baselineRun.runId !== laterRun.runId && laterRun.baselineRunId === baselineRun.runId);
    return Object.freeze({ baselineRun, laterRun });
  } catch {
    throw new Error('Invalid contract');
  }
}

export function readComparisonCandidates(
  input: unknown, selectedRule: Rule, coverage: RuleCoverage,
): readonly NativePassObservation[] {
  try {
    const candidates = readArray(input, item => {
      const record = readObject(item, ['ruleId', 'nativeResult', 'locator', 'checks', 'evidence']);
      const details = readRuleDetails(record);
      requireValid(details.ruleId === selectedRule);
      return Object.freeze({
        ...details,
        nativeResult: readChoice(record.nativeResult, ['pass']),
        locator: readLocator(record.locator),
      });
    });
    requireValid(candidates.length === (coverage.passes ?? 0));
    return candidates;
  } catch {
    throw new Error('Invalid contract');
  }
}

export function validateComparisonInput(input: unknown): ComparisonInputValidation {
  try {
    const record = readObject(input, ['baselineRun', 'baselineFindingId', 'laterRun', 'candidates']);
    const runs = readComparisonRuns({ baselineRun: record.baselineRun, laterRun: record.laterRun });
    const baselineFindingId = readId(record.baselineFindingId);
    const baselineFinding = runs.baselineRun.scan.findings.find(finding => finding.findingId === baselineFindingId);
    requireValid(baselineFinding);
    const candidates = readComparisonCandidates(
      record.candidates, baselineFinding.ruleId, runs.laterRun.scan.coverage[baselineFinding.ruleId],
    );
    return Object.freeze({ ok: true, value: Object.freeze({ ...runs, baselineFinding, candidates }) });
  } catch {
    return Object.freeze({ ok: false, error: 'invalid-comparison-input' });
  }
}
