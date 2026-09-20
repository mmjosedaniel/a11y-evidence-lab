import type { CorrelationUncertainty, EvidenceOutcome } from '../../comparison/comparison-contract.ts';
import type { PairMismatch } from '../../comparison/scan-pair.ts';
import type { CompleteScanContext, Locator, RuleDetails, ScannerReviewObservation } from './run-types.ts';

export type ComparisonViolation = RuleDetails & {
  readonly nativeResult: 'violation';
  readonly locator: Locator;
};
export type ComparisonPass = RuleDetails & {
  readonly nativeResult: 'pass';
  readonly locator: Locator;
};
type ComparisonBase = {
  readonly baseline: {
    readonly findingId: string;
    readonly observation: ComparisonViolation;
    readonly requestedUrl: string;
    readonly scanContext: CompleteScanContext;
  };
  readonly rationale: string;
  readonly limitations: readonly [string];
  readonly followUp: string;
};
export type StoredComparison = ComparisonBase & (
  | { readonly pair: 'not-comparable'; readonly mismatches: readonly PairMismatch[]; readonly reason: 'pair-mismatch' }
  | { readonly pair: 'comparable'; readonly match: CorrelationUncertainty;
      readonly outcome: 'inconclusive'; readonly reason: CorrelationUncertainty }
  | ({ readonly pair: 'comparable' } & EvidenceOutcome & (
    | { readonly match: 'unique-violation'; readonly after: {
        readonly kind: 'finding'; readonly findingId: string; readonly observation: ComparisonViolation } }
    | { readonly match: 'unique-incomplete'; readonly after: {
        readonly kind: 'incomplete'; readonly observation: ScannerReviewObservation } }
    | { readonly match: 'unique-pass'; readonly after: {
        readonly kind: 'native-pass'; readonly observation: ComparisonPass } }
  ))
);
