import type { Citation, CitationResolutionResult, Notice, NoticeKind } from '../domain/finding-analysis-types.ts';
import { parseCorpusCatalog } from './corpus-validation.ts';
import { validateRetrievalResult } from './retrieval-contract.ts';
import { classifyGuidanceSupport } from './support-policy.ts';
import { SOURCE_NOTICES } from './source-notices.ts';

const corpusFailure = Object.freeze({ ok: false, error: 'corpus-integrity' } as const);

export function resolveCitations(
  finding: unknown, retrieval: unknown, manifestBytes: Uint8Array, passageBytes: Uint8Array,
): CitationResolutionResult {
  const catalog = parseCorpusCatalog(manifestBytes, passageBytes);
  if (!catalog.ok) return corpusFailure;
  const result = validateRetrievalResult(retrieval, finding);
  if (!result.ok) return result;
  const support = classifyGuidanceSupport(finding, result.value, catalog.value.manifest.unresolvedConflicts);
  if (!support.ok) return support;
  // The parser authenticates every byte before these source records are projected.
  const sources = catalog.value.manifest.sources as readonly Readonly<Record<string, unknown>>[];
  const notices: Notice[] = [];
  const seenNotices = new Set<NoticeKind>();
  const passages: Citation[] = [];
  for (const ranked of result.value.passages) {
    const passage = catalog.value.passages.find(item => item.passageId === ranked.passageId);
    const source = passage && sources.find(item => item.title === passage.sourceTitle);
    if (!passage || !source || typeof source.status !== 'string'
        || typeof source.copyright !== 'string' || typeof source.attribution !== 'string') return corpusFailure;
    const noticeKind = passage.sourceType === 'recommendation' ? 'document' : 'software-document';
    passages.push(Object.freeze({
      passageId: passage.passageId, corpusVersion: passage.corpusVersion,
      sourceTitle: passage.sourceTitle, sourceType: passage.sourceType,
      heading: passage.heading, url: passage.url, ruleId: passage.ruleIds[0],
      successCriterion: passage.successCriteria[0], guidanceRole: passage.guidanceRole,
      text: passage.text, score: ranked.score, sourceStatus: source.status,
      copyright: source.copyright, attribution: source.attribution, noticeKind,
    }));
    if (!seenNotices.has(noticeKind)) {
      seenNotices.add(noticeKind);
      notices.push(Object.freeze({ kind: noticeKind, text: SOURCE_NOTICES[noticeKind] }));
    }
  }
  return Object.freeze({ ok: true, value: Object.freeze({ corpus: catalog.value.identity,
    passages: Object.freeze(passages), notices: Object.freeze(notices) }), support: support.value });
}
