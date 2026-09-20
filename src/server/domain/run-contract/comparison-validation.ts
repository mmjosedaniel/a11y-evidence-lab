import { classifyEvidencePair, comparisonFollowUp, comparisonLimitations, comparisonRationale } from '../../comparison/finding-outcome.ts';
import { compareScanProfiles, comparisonProfile } from '../../comparison/scan-pair.ts';
import type { ComparisonObservation, EvidenceOutcome } from '../../comparison/comparison-contract.ts';
import { readArray, readChoice, readId, readNumber, readObject, readUrl, requireKeys, requireValid } from './contract-value-reader.ts';
import { readLocator, readObservation, readRuleDetails } from './finding-validation.ts';
import { readContext, requireCompleteContext } from './scan-validation.ts';
import type { ComparisonPass, ComparisonViolation, StoredComparison } from './comparison-types.ts';
import type { Finding, ScanResult } from './run-types.ts';

function readNativeEvidence(input: unknown, result: 'violation'): ComparisonViolation;
function readNativeEvidence(input: unknown, result: 'pass'): ComparisonPass;
function readNativeEvidence(input: unknown, result: 'violation' | 'pass'): ComparisonViolation | ComparisonPass {
  const record = readObject(input, ['ruleId', 'nativeResult', 'checks', 'locator', 'evidence']);
  return Object.freeze({ ...readRuleDetails(record), nativeResult: readChoice(record.nativeResult, [result]),
    locator: readLocator(record.locator) });
}

function findingEvidence(finding: Finding): ComparisonViolation {
  return readNativeEvidence({ ruleId: finding.ruleId, nativeResult: finding.nativeResult,
    checks: finding.checks, locator: finding.locator, evidence: finding.evidence }, 'violation');
}

export function readStoredComparison(input: unknown, later: { readonly requestedUrl: string; readonly scan: ScanResult }): StoredComparison {
  const record = readObject(input);
  const base = readObject(record.baseline, ['findingId', 'observation', 'requestedUrl', 'scanContext']);
  const observation = readNativeEvidence(base.observation, 'violation');
  const scanContext = readContext(base.scanContext);
  requireCompleteContext(scanContext);
  const baseline = Object.freeze({ findingId: readId(base.findingId), observation,
    requestedUrl: readUrl(base.requestedUrl), scanContext });
  const limitations = readArray(record.limitations, item => readChoice(item, comparisonLimitations));
  requireValid(limitations.length === 1);
  requireValid(record.followUp === comparisonFollowUp);
  const commonKeys = ['baseline', 'rationale', 'limitations', 'followUp', 'pair', 'reason'];
  const common = { baseline, limitations: comparisonLimitations, followUp: comparisonFollowUp };
  const mismatches = compareScanProfiles(
    comparisonProfile({ requestedUrl: baseline.requestedUrl, scan: { context: scanContext } }, observation.ruleId),
    comparisonProfile(later, observation.ruleId),
  );
  if (record.pair === 'not-comparable') {
    requireKeys(record, [...commonKeys, 'mismatches']);
    const supplied = readArray(record.mismatches, item => readChoice(item, mismatches));
    requireValid(mismatches.length > 0 && supplied.length === mismatches.length
      && supplied.every((item, index) => item === mismatches[index]));
    requireValid(record.reason === 'pair-mismatch' && record.rationale === comparisonRationale('pair-mismatch'));
    return Object.freeze({ ...common, pair: 'not-comparable', mismatches, reason: 'pair-mismatch', rationale: record.rationale });
  }
  requireValid(record.pair === 'comparable' && mismatches.length === 0);
  const match = readChoice(record.match, ['baseline-locator-unavailable', 'ambiguous', 'later-locator-unavailable',
    'no-exact-match', 'unique-violation', 'unique-incomplete', 'unique-pass']);
  const retained = [...later.scan.findings, ...later.scan.scannerReviewObservations]
    .filter(item => item.ruleId === observation.ruleId);
  const locator = observation.locator;
  const available = 'value' in locator;
  const exact = retained.filter(item => available && 'value' in item.locator && item.locator.value === locator.value);
  const unavailable = retained.filter(item => 'unavailable' in item.locator).length;
  const passes = later.scan.coverage[observation.ruleId].passes ?? 0;
  let after: Extract<StoredComparison, { after: unknown }>['after'] | undefined;
  let outcome: EvidenceOutcome;
  if (match === 'unique-violation' || match === 'unique-incomplete' || match === 'unique-pass') {
    requireValid(available && unavailable === 0);
    const value = readObject(record.after, match === 'unique-violation' ? ['kind', 'findingId', 'observation'] : ['kind', 'observation']);
    let next: ComparisonObservation;
    if (match === 'unique-violation') {
      requireValid(exact.length === 1 && exact[0]!.nativeResult === 'violation');
      const source = exact[0] as Finding;
      const native = readNativeEvidence(value.observation, 'violation');
      const findingId = readId(value.findingId);
      requireValid(value.kind === 'finding' && findingId === source.findingId
        && JSON.stringify(native) === JSON.stringify(findingEvidence(source)));
      after = Object.freeze({ kind: 'finding', findingId, observation: native });
      next = native;
    } else if (match === 'unique-incomplete') {
      requireValid(exact.length === 1 && exact[0]!.nativeResult === 'incomplete');
      const native = readObservation(value.observation);
      requireValid(value.kind === 'incomplete' && JSON.stringify(native) === JSON.stringify(readObservation(exact[0])));
      after = Object.freeze({ kind: 'incomplete', observation: native });
      next = native;
    } else {
      requireValid(exact.length === 0 && passes >= 1);
      const native = readNativeEvidence(value.observation, 'pass');
      requireValid(value.kind === 'native-pass' && native.ruleId === observation.ruleId
        && 'value' in native.locator && native.locator.value === locator.value);
      after = Object.freeze({ kind: 'native-pass', observation: native });
      next = native;
    }
    outcome = classifyEvidencePair(observation, next);
  } else {
    const admissible = match === 'baseline-locator-unavailable' ? !available
      : match === 'ambiguous' ? available && exact.length + passes >= 2
      : match === 'later-locator-unavailable' ? available && exact.length <= 1 && (unavailable > 0 || passes > 0)
      : available && exact.length === 0 && unavailable === 0;
    requireValid(admissible);
    outcome = { outcome: 'inconclusive', reason: match };
  }
  requireKeys(record, [...commonKeys, 'match', 'outcome', ...(after ? ['after'] : []), ...(outcome.delta ? ['delta'] : [])]);
  requireValid(record.outcome === outcome.outcome && record.reason === outcome.reason
    && record.rationale === comparisonRationale(outcome.reason));
  if (outcome.delta) {
    const delta = readObject(record.delta, ['baselineMargin', 'laterMargin', 'change']);
    for (const key of ['baselineMargin', 'laterMargin', 'change'] as const) {
      requireValid(Object.is(readNumber(delta[key]), outcome.delta[key]));
    }
  }
  return Object.freeze({ ...common, pair: 'comparable', match, ...outcome,
    ...(after ? { after } : {}), rationale: record.rationale }) as StoredComparison;
}
