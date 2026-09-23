import { NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER } from './generation-artifacts.ts';
import { emitCandidateDetail, emitGenerationRejection, emitOutputValidationDetail, type OutputValidationDetail,
  type OutputValidationDetailSink, type ProhibitedClaimRule, type CandidateDetail, type CandidateDetailField,
  type CandidateDetailReason, type CandidateDetailSink, type GenerationRejectionSink } from './generation-diagnostics.ts';
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

const prohibitedClaimRules: readonly ProhibitedClaimRule[] = [
  'certification-conformance-compliance', 'whole-page-site-accessible', 'page-site-accessible',
  'finding-fixed-resolved-remediated', 'automated-evidence-proves-fix',
];
type CaptureProhibitedClaim = (field: CandidateDetailField, rule: ProhibitedClaimRule) => void;

type ReadCandidateField = <T>(field: CandidateDetailField, reason: CandidateDetailReason, read: () => T) => T;
const supportedTextFields = {
  findingSummary: ['findingSummary.text', 'findingSummary.evidenceReferences', 'findingSummary.passageIds'],
  userImpact: ['userImpact.text', 'userImpact.evidenceReferences', 'userImpact.passageIds'],
  remediation: ['remediation.text', 'remediation.evidenceReferences', 'remediation.passageIds'],
} as const;

function readProse(input: unknown, field: CandidateDetailField, read: ReadCandidateField, maximum = 1000, capture?: CaptureProhibitedClaim): string {
  const text = read(field, 'prose-type', () => {
    requireValid(typeof input === 'string');
    return input;
  });
  read(field, 'prose-length', () => requireValid(text.length <= maximum));
  read(field, 'prose-blank', () => requireValid(text.trim().length > 0));
  const normalized = text.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
  read(field, 'prohibited-claim', () => {
    const index = prohibitedClaims.findIndex(pattern => pattern.test(normalized));
    if (index !== -1) capture?.(field, prohibitedClaimRules[index]);
    requireValid(index === -1);
  });
  return text;
}

function readReferences<T extends string>(input: unknown, available: readonly T[], minimum: number,
  field: CandidateDetailField, read: ReadCandidateField): readonly T[] {
  const seen = new Set<T>();
  const result = read(field, 'structure', () => readArray(input, item => {
    const reference = read(field, 'reference-value', () => readChoice(item, available));
    read(field, 'reference-duplicate', () => requireValid(!seen.has(reference)));
    seen.add(reference);
    return reference;
  }));
  read(field, 'reference-count', () => requireValid(result.length >= minimum && result.length <= available.length));
  return result;
}

function readSupportedText(
  input: unknown,
  evidence: readonly EvidencePath[],
  passages: readonly string[],
  evidenceMinimum: number,
  passageMinimum: number,
  position: 'findingSummary' | 'userImpact' | 'remediation',
  read: ReadCandidateField,
  maximum = 1000,
  capture?: CaptureProhibitedClaim,
): SupportedText {
  const field = read(position, 'structure', () => readObject(input, ['text', 'evidenceReferences', 'passageIds']));
  const [textField, evidenceField, passageField] = supportedTextFields[position];
  return Object.freeze({
    text: readProse(field.text, textField, read, maximum, capture),
    evidenceReferences: readReferences(field.evidenceReferences, evidence, evidenceMinimum, evidenceField, read),
    passageIds: readReferences(field.passageIds, passages, passageMinimum, passageField, read),
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
}, onRejection?: GenerationRejectionSink, onDetail?: CandidateDetailSink, onOutputDetail?: OutputValidationDetailSink): ProposalValidationResult {
  let detail: CandidateDetail | undefined;
  let outputDetail: OutputValidationDetail | undefined;
  const capture: CaptureProhibitedClaim = (field, rule) => {
    outputDetail = { kind: 'prohibited-claim', field, rule };
  };
  // Capture the innermost failed boundary, without inspecting the thrown value or rereading input.
  const read: ReadCandidateField = (field, reason, readValue) => {
    try { return readValue(); }
    catch (error) {
      detail ??= { field, reason };
      throw error;
    }
  };
  try {
    const root = read('candidate', 'structure', () => readObject(candidate, [
      'type', 'findingId', 'findingSummary', 'userImpact', 'remediation',
      'evidenceSufficiency', 'confidence', 'uncertainty', 'assumptions',
      'blockingManualJudgment', 'postChangeVerificationReminder',
    ]));
    read('type', 'fixed-value', () => requireValid(root.type === 'proposal'));
    read('findingId', 'finding-mismatch', () => requireValid(root.findingId === context.findingId));
    const sufficiency = read('evidenceSufficiency', 'structure', () =>
      readObject(root.evidenceSufficiency, ['findingEvidence', 'guidance']));
    read('evidenceSufficiency.findingEvidence', 'fixed-value', () => requireValid(sufficiency.findingEvidence === 'complete'));
    read('evidenceSufficiency.guidance', 'fixed-value', () => requireValid(sufficiency.guidance === 'supported'));
    const assumptions = read('assumptions', 'structure', () =>
      readArray(root.assumptions, item => readProse(item, 'assumptions[]', read, 500, capture)));
    read('assumptions', 'assumption-count', () => requireValid(assumptions.length <= 5));
    const passages = context.passageIds;
    const available = context.availableEvidenceReferences;
    const value: Proposal = Object.freeze({
      type: 'proposal',
      findingId: context.findingId,
      findingSummary: readSupportedText(root.findingSummary, available, passages, 1, 0, 'findingSummary', read, 1000, capture),
      userImpact: readSupportedText(root.userImpact, available, passages, 0, 1, 'userImpact', read, 1000, capture),
      remediation: readSupportedText(root.remediation, available, passages, 0, 1, 'remediation', read, 2000, capture),
      evidenceSufficiency: Object.freeze({ findingEvidence: 'complete', guidance: 'supported' }),
      confidence: read('confidence', 'choice', () => readChoice(root.confidence, ['high', 'medium', 'low'])),
      uncertainty: readProse(root.uncertainty, 'uncertainty', read, 1000, capture),
      assumptions,
      blockingManualJudgment: readProse(root.blockingManualJudgment, 'blockingManualJudgment', read, 1000, capture),
      postChangeVerificationReminder: readProse(root.postChangeVerificationReminder, 'postChangeVerificationReminder', read, 1000, capture),
    });
    return Object.freeze({ ok: true, value });
  } catch {
    emitGenerationRejection(onRejection, 'candidate/contract');
    emitCandidateDetail(onDetail, detail ?? { field: 'candidate', reason: 'structure' });
    if (outputDetail !== undefined) emitOutputValidationDetail(onOutputDetail, outputDetail);
    return failure;
  }
}

export function validateNativeSchemaPostChangeVerificationReminder(proposal: unknown): boolean {
  try {
    return readObject(proposal).postChangeVerificationReminder === NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER;
  } catch { return false; }
}
