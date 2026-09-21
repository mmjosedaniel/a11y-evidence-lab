import { emitGenerationRejection, type GenerationRejectionSink } from './generation-diagnostics.ts';
import { assessFindingEvidence } from '../domain/finding-sufficiency.ts';
import type { EvidencePath } from '../domain/finding-analysis-types.ts';
import { readArray, readChoice, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { readFinding } from '../domain/run-contract/finding-validation.ts';
import type { NativeFinding } from '../domain/run-contract/run-types.ts';
import { validateRetrievalResult } from '../retrieval/retrieval-contract.ts';
import type { RetrievalResult } from '../retrieval/retrieval-contract.ts';
import { classifyGuidanceSupport } from '../retrieval/support-policy.ts';

type SupportedText = {
  readonly text: string;
  readonly evidenceReferences: readonly EvidencePath[];
  readonly passageIds: readonly string[];
};

export type Proposal = {
  readonly type: 'proposal';
  readonly findingId: string;
  readonly findingSummary: SupportedText;
  readonly userImpact: SupportedText;
  readonly remediation: SupportedText;
  readonly evidenceSufficiency: { readonly findingEvidence: 'complete'; readonly guidance: 'supported' };
  readonly confidence: 'high' | 'medium' | 'low';
  readonly uncertainty: string;
  readonly assumptions: readonly string[];
  readonly blockingManualJudgment: string;
  readonly postChangeVerificationReminder: string;
};

export type ProposalValidationResult =
  | { readonly ok: true; readonly value: Proposal }
  | { readonly ok: false; readonly error: 'response-validation' };

const failure = Object.freeze({ ok: false, error: 'response-validation' } as const);

// m301-prohibited-v1: frozen lexical policy, not a semantic-support determination.
const prohibitedClaims = [
  /\b(?:certif[a-z]*|conform[a-z]*|complian[a-z]*)\b/u,
  /\b(?:whole|entire)[ -]+(?:page|site|website)[ -]+(?:is[ -]+)?(?:(?:fully|completely)[ -]+)?accessible\b/u,
  /\b(?:page|site|website)[ -]+(?:is|are)[ -]+(?:(?:fully|completely)[ -]+)?accessible\b/u,
  /\b(?:finding|issue|violation)[ -]+(?:is|was|has been)[ -]+(?:fixed|resolved|remediated)\b/u,
  /\b(?:automated|automatic|scanner|axe(?:-core)?)[ -]+(?:evidence|results?|changes?|checks?|scans?)[ -]+(?:alone[ -]+)?(?:prove|proves|confirm|confirms)[ -]+(?:a[ -]+|the[ -]+)?(?:fix|resolution)\b/u,
];

function readProse(input: unknown, maximum = 1000): string {
  requireValid(typeof input === 'string' && input.length <= maximum && input.trim().length > 0);
  const normalized = input.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
  requireValid(!prohibitedClaims.some(pattern => pattern.test(normalized)));
  return input;
}

function readReferences<T extends string>(input: unknown, available: readonly T[], minimum: number): readonly T[] {
  const seen = new Set<T>();
  const result = readArray(input, item => {
    const reference = readChoice(item, available);
    requireValid(!seen.has(reference));
    seen.add(reference);
    return reference;
  });
  requireValid(result.length >= minimum && result.length <= available.length);
  return result;
}

function readSupportedText(
  input: unknown,
  evidence: readonly EvidencePath[],
  passages: readonly string[],
  evidenceMinimum: number,
  passageMinimum: number,
  maximum = 1000,
): SupportedText {
  const field = readObject(input, ['text', 'evidenceReferences', 'passageIds']);
  return Object.freeze({
    text: readProse(field.text, maximum),
    evidenceReferences: readReferences(field.evidenceReferences, evidence, evidenceMinimum),
    passageIds: readReferences(field.passageIds, passages, passageMinimum),
  });
}

export function validateProposal(
  candidate: unknown,
  context: { finding: NativeFinding; retrieval: RetrievalResult },
): ProposalValidationResult {
  try {
    const finding = readFinding(context.finding);
    const evidence = assessFindingEvidence(finding);
    requireValid(evidence.state === 'complete');
    const retrieval = validateRetrievalResult(context.retrieval, finding);
    if (!retrieval.ok) return failure;
    const support = classifyGuidanceSupport(finding, retrieval.value);
    requireValid(support.ok && support.value.state === 'supported');

    return validateProposalCandidate(candidate, { findingId: finding.findingId,
      availableEvidenceReferences: evidence.availableReferences,
      passageIds: retrieval.value.passages.map(passage => passage.passageId) });
  } catch { return failure; }
}

export function validateProposalCandidate(candidate: unknown, context: {
  readonly findingId: string;
  readonly availableEvidenceReferences: readonly EvidencePath[];
  readonly passageIds: readonly string[];
}, onRejection?: GenerationRejectionSink): ProposalValidationResult {
  try {
    const root = readObject(candidate, [
      'type', 'findingId', 'findingSummary', 'userImpact', 'remediation',
      'evidenceSufficiency', 'confidence', 'uncertainty', 'assumptions',
      'blockingManualJudgment', 'postChangeVerificationReminder',
    ]);
    requireValid(root.type === 'proposal' && root.findingId === context.findingId);
    const sufficiency = readObject(root.evidenceSufficiency, ['findingEvidence', 'guidance']);
    requireValid(sufficiency.findingEvidence === 'complete' && sufficiency.guidance === 'supported');
    const assumptions = readArray(root.assumptions, item => readProse(item, 500));
    requireValid(assumptions.length <= 5);
    const passages = context.passageIds;
    const available = context.availableEvidenceReferences;
    const value: Proposal = Object.freeze({
      type: 'proposal',
      findingId: context.findingId,
      findingSummary: readSupportedText(root.findingSummary, available, passages, 1, 0),
      userImpact: readSupportedText(root.userImpact, available, passages, 0, 1),
      remediation: readSupportedText(root.remediation, available, passages, 0, 1, 2000),
      evidenceSufficiency: Object.freeze({ findingEvidence: 'complete', guidance: 'supported' }),
      confidence: readChoice(root.confidence, ['high', 'medium', 'low']),
      uncertainty: readProse(root.uncertainty),
      assumptions,
      blockingManualJudgment: readProse(root.blockingManualJudgment),
      postChangeVerificationReminder: readProse(root.postChangeVerificationReminder),
    });
    return Object.freeze({ ok: true, value });
  } catch {
    emitGenerationRejection(onRejection, 'candidate/contract');
    return failure;
  }
}
