import { readArray, readChoice, readObject, readTime, requireValid } from './run-contract/contract-value-reader.ts';
import { readFinding } from './run-contract/finding-validation.ts';
import type { NativeFinding } from './run-contract/run-types.ts';
import type { AbstentionReason, FindingAnalysisDecision, GuidanceSupport } from './finding-analysis-types.ts';
import { assessFindingEvidence } from './finding-sufficiency.ts';

const roles = ['criterion', 'interpretation', 'remediation'] as const;
const explanations = {
  'incomplete-evidence': 'Required captured evidence is incomplete.',
  'conflicting-guidance': 'The retrieved guidance contains an unresolved material conflict.',
  'missing-guidance': 'No applicable guidance was retrieved.',
  'incomplete-guidance': 'The retrieved guidance does not cover every required role.',
} as const;
const investigations = {
  'image-alt': 'Inspect the affected image and verify its purpose and alternative-text state. Capture the unavailable required facts before requesting guidance in a new analysis.',
  label: 'Inspect the affected control and verify its element type and naming relationships. Capture the unavailable required facts before requesting guidance in a new analysis.',
  'color-contrast': 'Inspect the affected text and verify its foreground, background, font properties and contrast measurements. Capture the unavailable required facts before requesting guidance in a new analysis.',
} as const;

function readSupport(input: GuidanceSupport): GuidanceSupport {
  const record = readObject(input, ['state', 'missingRoles', 'conflicts']);
  const state = readChoice(record.state, ['conflicting', 'missing', 'incomplete', 'supported']);
  const missingRoles = readArray(record.missingRoles, role => readChoice(role, roles));
  requireValid(missingRoles.every((role, index) => index === 0 || roles.indexOf(missingRoles[index - 1]) < roles.indexOf(role)));
  let previous = '';
  const conflicts = readArray(record.conflicts, value => {
    const pair = readArray(value, id => {
      requireValid(typeof id === 'string' && id.length > 0);
      return id;
    });
    requireValid(pair.length === 2 && pair[0] < pair[1]);
    const key = `${pair[0]}\n${pair[1]}`;
    requireValid(key > previous);
    previous = key;
    return Object.freeze([pair[0], pair[1]] as const);
  });
  requireValid(state === 'conflicting' ? conflicts.length > 0 : conflicts.length === 0);
  requireValid(state !== 'missing' || missingRoles.length === roles.length);
  requireValid(state !== 'incomplete' || (missingRoles.length > 0 && missingRoles.length < roles.length));
  requireValid(state !== 'supported' || missingRoles.length === 0);
  return Object.freeze({ state, missingRoles, conflicts });
}

export function buildFindingAnalysis(
  native: NativeFinding, startedAt: string, finishedAt: string, support: GuidanceSupport | null,
): FindingAnalysisDecision {
  const finding = readFinding(native);
  const start = readTime(startedAt);
  const finish = readTime(finishedAt);
  requireValid(start <= finish);
  const evidence = assessFindingEvidence(finding);
  const checkedSupport = support === null ? null : readSupport(support);
  requireValid(evidence.state === 'incomplete' ? checkedSupport === null : checkedSupport !== null);
  const analysis = Object.freeze({ status: 'completed', startedAt: start, finishedAt: finish, evidence } as const);
  if (checkedSupport?.state === 'supported') return Object.freeze({ state: 'active', analysis });
  const reason: AbstentionReason = checkedSupport === null ? 'incomplete-evidence' : `${checkedSupport.state}-guidance`;
  let manualInvestigation: string = checkedSupport === null ? investigations[finding.ruleId]
    : 'Inspect the affected element and the cited sources. Investigate the missing or conflicting guidance before proceeding in a new analysis.';
  if (evidence.blockers.some(blocker => blocker.reference === 'evidence.shadowColor')) {
    manualInvestigation += ' The recorded measurement identifies a shadow contribution; inspect and capture that shadow color.';
  }
  return Object.freeze({ state: 'abstained', analysis, result: Object.freeze({
    type: 'abstention', findingId: finding.findingId, evidenceReferences: evidence.availableReferences,
    retrievalReference: checkedSupport === null ? null : 'retrieval', reason, explanation: explanations[reason],
    providerCalled: false, manualInvestigation,
  }) });
}
