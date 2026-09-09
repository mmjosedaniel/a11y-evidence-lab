import type { CorpusIdentity, PassageReference } from '../retrieval/corpus-identity.ts';

export type GuidanceRole = 'criterion' | 'interpretation' | 'remediation';
export type EvidencePath = 'checks' | `evidence.${
  'elementKind' | 'altState' | 'inputType' | 'foregroundColor' | 'backgroundColor'
  | 'contrastRatio' | 'expectedContrastRatio' | 'fontSize' | 'fontWeight'
  | 'measurementSource' | 'shadowColor' | 'messageKey'
  | `nameSources.${'explicitLabel' | 'implicitLabel' | 'ariaLabel' | 'ariaLabelledby' | 'title' | 'placeholder' | 'presentationalRole'}`}`;
export type EvidenceAssessment = {
  readonly state: 'complete' | 'incomplete';
  readonly availableReferences: readonly EvidencePath[];
  readonly blockers: readonly { readonly reference: EvidencePath; readonly reason: 'missing' | 'invalid' | 'withheld' }[];
};
export type GuidanceSupport = {
  readonly state: 'conflicting' | 'missing' | 'incomplete' | 'supported';
  readonly missingRoles: readonly GuidanceRole[];
  readonly conflicts: readonly (readonly [string, string])[];
};
export type SupportResult = { readonly ok: true; readonly value: GuidanceSupport }
  | { readonly ok: false; readonly error: 'result-validation' };
export type AbstentionReason = 'incomplete-evidence' | 'conflicting-guidance' | 'missing-guidance' | 'incomplete-guidance';
export type AbstentionResult = {
  readonly type: 'abstention'; readonly findingId: string;
  readonly evidenceReferences: readonly EvidencePath[];
  readonly retrievalReference: 'retrieval' | null;
  readonly reason: AbstentionReason; readonly explanation: string;
  readonly providerCalled: false; readonly manualInvestigation: string;
};
export type CompletedFindingAnalysis = {
  readonly status: 'completed'; readonly startedAt: string; readonly finishedAt: string;
  readonly evidence: EvidenceAssessment;
};
export type FindingAnalysisDecision =
  | { readonly state: 'active'; readonly analysis: CompletedFindingAnalysis }
  | { readonly state: 'abstained'; readonly analysis: CompletedFindingAnalysis; readonly result: AbstentionResult };
export type NoticeKind = 'document' | 'software-document';
export type Notice = { readonly kind: NoticeKind; readonly text: string };
export type Citation = PassageReference & {
  readonly corpusVersion: CorpusIdentity['version']; readonly text: string; readonly score: number;
  readonly sourceStatus: string; readonly copyright: string; readonly attribution: string;
  readonly noticeKind: NoticeKind;
};
export type CitationView = {
  readonly corpus: CorpusIdentity; readonly passages: readonly Citation[]; readonly notices: readonly Notice[];
};
export type FindingGuidanceView = Omit<CitationView, 'corpus'> & {
  readonly runId: string; readonly findingId: string; readonly corpus: CorpusIdentity | null;
};
export type CitationResolutionResult =
  | { readonly ok: true; readonly value: CitationView; readonly support: GuidanceSupport }
  | { readonly ok: false; readonly error: 'corpus-integrity' | 'result-validation' };
