import { readLocator, readObservation, readRuleDetails } from '../domain/run-contract/finding-validation.ts';
import type { Finding } from '../domain/run-contract/run-types.ts';
import type { ComparisonObservation, TargetMatch, ValidatedComparisonInput } from './comparison-contract.ts';

export function comparisonObservation(source: Finding | ComparisonObservation): ComparisonObservation {
  const details = readRuleDetails({ ruleId: source.ruleId, checks: source.checks, evidence: source.evidence });
  const locator = readLocator(source.locator);
  if (source.nativeResult === 'incomplete') {
    return readObservation({ ...details, locator, nativeResult: 'incomplete', incompleteReason: source.incompleteReason });
  }
  return Object.freeze({ ...details, locator, nativeResult: source.nativeResult });
}

export function correlateTarget(input: ValidatedComparisonInput): TargetMatch {
  const baseline = input.baselineFinding;
  if (!('value' in baseline.locator)) return Object.freeze({ match: 'baseline-locator-unavailable' });
  const exact: (Finding | ComparisonObservation)[] = [];
  let unavailable = false;
  for (const item of [...input.laterRun.scan.findings, ...input.laterRun.scan.scannerReviewObservations, ...input.candidates]) {
    if (item.ruleId !== baseline.ruleId) continue;
    if (!('value' in item.locator)) unavailable = true;
    else if (item.locator.value === baseline.locator.value) exact.push(item);
  }
  if (exact.length > 1) return Object.freeze({ match: 'ambiguous' });
  if (unavailable) return Object.freeze({ match: 'later-locator-unavailable' });
  const source = exact[0];
  if (!source) return Object.freeze({ match: 'no-exact-match' });
  const observation = comparisonObservation(source);
  if (source.nativeResult === 'violation' && 'findingId' in source) {
    return Object.freeze({ match: 'unique-violation', after: Object.freeze({ kind: 'finding', findingId: source.findingId, observation }) });
  }
  if (source.nativeResult === 'incomplete') {
    return Object.freeze({ match: 'unique-incomplete', after: Object.freeze({ kind: 'incomplete', observation }) });
  }
  return Object.freeze({ match: 'unique-pass', after: Object.freeze({ kind: 'native-pass', observation }) });
}
