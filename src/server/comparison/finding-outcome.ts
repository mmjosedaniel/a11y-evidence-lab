import { readRuleDetails } from '../domain/run-contract/finding-validation.ts';
import type { ComparisonObservation, ComparisonReason, EvidenceOutcome } from './comparison-contract.ts';

type EvidenceIssue = 'insufficient-evidence' | 'conflicting-evidence' | null;

function evidenceIssue(observation: ComparisonObservation): EvidenceIssue {
  const { checks, evidence } = observation;
  if (!('value' in checks) || checks.value.any.length === 0) return 'insufficient-evidence';
  if (observation.ruleId === 'image-alt') {
    if (!('value' in observation.evidence.elementKind) || !('value' in observation.evidence.altState)) {
      return 'insufficient-evidence';
    }
  } else if (observation.ruleId === 'label') {
    const label = observation.evidence;
    if (!('value' in label.elementKind) || Object.values(label.nameSources).some(fact => !('value' in fact))) {
      return 'insufficient-evidence';
    }
    if (!('value' in label.inputType)
      && !(label.elementKind.value === 'textarea' && label.inputType.unavailable === 'not-applicable')) {
      return 'insufficient-evidence';
    }
  } else {
    const contrast = observation.evidence;
    if ([contrast.foregroundColor, contrast.backgroundColor, contrast.contrastRatio,
      contrast.expectedContrastRatio, contrast.fontSize, contrast.fontWeight].some(fact => !('value' in fact))
      || ('unavailable' in contrast.shadowColor && contrast.shadowColor.unavailable !== 'missing')
      || ('unavailable' in contrast.messageKey && contrast.messageKey.unavailable !== 'missing')) {
      return 'insufficient-evidence';
    }
  }
  // Reuse the admitted fact vocabulary for separately typed adverse policy vectors.
  try {
    readRuleDetails({ ruleId: observation.ruleId, checks, evidence });
  } catch {
    return 'conflicting-evidence';
  }
  if (observation.ruleId !== 'color-contrast') return null;
  const contrast = observation.evidence;
  if (!('value' in contrast.contrastRatio) || !('value' in contrast.expectedContrastRatio)
    || !('value' in contrast.fontSize) || !('value' in contrast.fontWeight)) return 'insufficient-evidence';
  if (checks.value.any.length !== 1 || checks.value.any[0] !== 'color-contrast'
    || checks.value.all.length !== 0 || checks.value.none.length !== 0
    || 'value' in contrast.messageKey) return 'conflicting-evidence';
  const font = /^([0-9]+\.[0-9])pt \(([0-9]+(?:\.[0-9]+)?)px\)$/.exec(contrast.fontSize.value);
  if (!font) return 'conflicting-evidence';
  const px = Number(font[2]);
  const points = Math.ceil(px * 72) / 96;
  const expected = points >= (contrast.fontWeight.value === 'bold' ? 14 : 18) ? 3 : 4.5;
  if (!Number.isFinite(points) || font[1] !== (px * 72 / 96).toFixed(1)
    || contrast.expectedContrastRatio.value !== expected) return 'conflicting-evidence';
  const ratio = contrast.contrastRatio.value;
  if ((observation.nativeResult === 'pass' && ratio < expected)
    || (observation.nativeResult === 'violation' && ratio > expected)) return 'conflicting-evidence';
  return null;
}

function inconclusive(reason: ComparisonReason): EvidenceOutcome {
  return Object.freeze({ outcome: 'inconclusive', reason });
}

export function classifyEvidencePair(baseline: ComparisonObservation, later: ComparisonObservation): EvidenceOutcome {
  if (baseline.ruleId !== later.ruleId) return inconclusive('conflicting-evidence');
  if (baseline.nativeResult === 'pass' && later.nativeResult === 'violation' && baseline.ruleId !== 'color-contrast') {
    const issue = evidenceIssue(baseline);
    return issue ? inconclusive(issue) : Object.freeze({ outcome: 'regressed', reason: 'native-failure-after-pass' });
  }
  if (baseline.nativeResult !== 'violation') return inconclusive('conflicting-evidence');
  if (later.nativeResult === 'incomplete') return inconclusive('native-incomplete');
  if (later.nativeResult === 'pass') {
    const issue = evidenceIssue(later);
    return issue ? inconclusive(issue) : Object.freeze({ outcome: 'resolved', reason: 'native-pass' });
  }
  if (later.nativeResult !== 'violation') return inconclusive('conflicting-evidence');
  if (baseline.ruleId !== 'color-contrast') {
    return Object.freeze({ outcome: 'persistent', reason: 'binary-still-failing' });
  }
  if (later.ruleId !== 'color-contrast') return inconclusive('conflicting-evidence');
  const issues = [evidenceIssue(baseline), evidenceIssue(later)];
  if (issues.includes('insufficient-evidence')) return inconclusive('insufficient-evidence');
  if (issues.includes('conflicting-evidence')) return inconclusive('conflicting-evidence');
  const before = baseline.evidence;
  const after = later.evidence;
  if (!('value' in before.contrastRatio) || !('value' in before.expectedContrastRatio)
    || !('value' in after.contrastRatio) || !('value' in after.expectedContrastRatio)) {
    return inconclusive('insufficient-evidence');
  }
  if (before.expectedContrastRatio.value !== after.expectedContrastRatio.value) {
    return inconclusive('measurement-profile-mismatch');
  }
  const baselineMargin = before.contrastRatio.value - before.expectedContrastRatio.value;
  const laterMargin = after.contrastRatio.value - after.expectedContrastRatio.value;
  const change = laterMargin - baselineMargin;
  if (![baselineMargin, laterMargin, change].every(Number.isFinite)) return inconclusive('conflicting-evidence');
  const delta = Object.freeze({ baselineMargin, laterMargin, change });
  if (change > 0) return Object.freeze({ outcome: 'improved', reason: 'contrast-margin-increased', delta });
  if (change === 0) return Object.freeze({ outcome: 'persistent', reason: 'contrast-margin-equal', delta });
  return Object.freeze({ outcome: 'regressed', reason: 'contrast-margin-decreased', delta });
}

const rationale: Readonly<Record<ComparisonReason, string>> = Object.freeze({
  'pair-mismatch': 'The scan pair has differing comparison profiles.',
  'baseline-locator-unavailable': 'The baseline target locator is unavailable.',
  'later-locator-unavailable': 'A later target locator is unavailable.',
  'no-exact-match': 'No exact target match was found.',
  ambiguous: 'Multiple possible target matches were found.',
  'native-incomplete': 'The native scanner reported incomplete evidence for the target.',
  'insufficient-evidence': 'Required evidence is unavailable.',
  'conflicting-evidence': 'The retained evidence conflicts.',
  'measurement-profile-mismatch': 'The retained measurement profiles differ.',
  'native-pass': 'A unique native pass supplies sufficient evidence for the target.',
  'binary-still-failing': 'The binary rule still reports a failure for the target.',
  'contrast-margin-increased': 'The failing contrast margin increased.',
  'contrast-margin-equal': 'The failing contrast margin stayed equal.',
  'contrast-margin-decreased': 'The failing contrast margin decreased.',
  'native-failure-after-pass': 'The policy-only evidence reports a native failure after a pass.',
});

export function comparisonRationale(reason: ComparisonReason): string {
  return rationale[reason];
}

export const comparisonLimitations: readonly [string] = Object.freeze([
  'This comparison describes automated evidence for one target; it does not establish accessibility, conformance, or remediation causality.',
]);
export const comparisonFollowUp = 'Review the target and relevant manual checks before drawing a broader conclusion.';
