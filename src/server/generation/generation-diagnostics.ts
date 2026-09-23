import { readObject, readChoice } from '../domain/run-contract/contract-value-reader.ts';

const codes = ['adapter-response/body', 'adapter-response/envelope', 'adapter-response/content',
  'candidate/contract', 'executor/envelope', 'caller/correspondence', 'adapter-response/unspecified'] as const;
export type GenerationRejectionCode = typeof codes[number];
export type GenerationRejectionSink = (event: Readonly<{ code: GenerationRejectionCode }>) => unknown;
export type CandidateDetailField =
  | 'candidate' | 'type' | 'findingId' | 'evidenceSufficiency'
  | 'evidenceSufficiency.findingEvidence' | 'evidenceSufficiency.guidance'
  | 'assumptions' | 'assumptions[]'
  | 'findingSummary' | 'findingSummary.text' | 'findingSummary.evidenceReferences' | 'findingSummary.passageIds'
  | 'userImpact' | 'userImpact.text' | 'userImpact.evidenceReferences' | 'userImpact.passageIds'
  | 'remediation' | 'remediation.text' | 'remediation.evidenceReferences' | 'remediation.passageIds'
  | 'confidence' | 'uncertainty' | 'blockingManualJudgment' | 'postChangeVerificationReminder';
export type CandidateDetailReason = 'structure' | 'fixed-value' | 'finding-mismatch'
  | 'prose-type' | 'prose-length' | 'prose-blank' | 'prohibited-claim'
  | 'reference-value' | 'reference-duplicate' | 'reference-count' | 'assumption-count' | 'choice';
export type CandidateDetail = Readonly<{ field: CandidateDetailField; reason: CandidateDetailReason }>;
export type CandidateDetailSink = (detail: CandidateDetail) => unknown;

export function emitCandidateDetail(sink: CandidateDetailSink | undefined, detail: CandidateDetail): void {
  if (sink === undefined) return;
  // Detached await contains rejection without calling replaceable methods on a returned Promise.
  void (async () => {
    try { await sink(Object.freeze({ field: detail.field, reason: detail.reason })); }
    catch { /* A diagnostic callback cannot change generation behavior. */ }
  })();
}

export function readGenerationRejection(value: unknown): GenerationRejectionCode {
  return readChoice(readObject(value, ['code']).code, codes);
}
export function emitGenerationRejection(sink: GenerationRejectionSink | undefined, code: GenerationRejectionCode): void {
  if (sink === undefined) return;
  try { void Promise.resolve(sink(Object.freeze({ code }))).catch(() => undefined); }
  catch { /* A diagnostic callback cannot change generation behavior. */ }
}

export type ProhibitedClaimRule =
  | 'certification-conformance-compliance' | 'whole-page-site-accessible' | 'page-site-accessible'
  | 'finding-fixed-resolved-remediated' | 'automated-evidence-proves-fix';
export type OutputValidationDetail = Readonly<
  | { kind: 'content'; reason: 'json-syntax' | 'non-object' }
  | { kind: 'prohibited-claim'; field: CandidateDetailField; rule: ProhibitedClaimRule }
>;
export type OutputValidationDetailSink = (detail: OutputValidationDetail) => unknown;

export function emitOutputValidationDetail(sink: OutputValidationDetailSink | undefined,
  detail: OutputValidationDetail): void {
  if (sink === undefined) return;
  void (async () => {
    try {
      await sink(Object.freeze(detail.kind === 'content'
        ? { kind: detail.kind, reason: detail.reason }
        : { kind: detail.kind, field: detail.field, rule: detail.rule }));
    } catch { /* A diagnostic callback cannot change generation behavior. */ }
  })();
}
