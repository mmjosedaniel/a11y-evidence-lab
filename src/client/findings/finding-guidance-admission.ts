import { snapshot, equal } from '../responses/finding-response-snapshot.ts';
import { validateRun } from '../../server/domain/run-contract.ts';
import type { Finding, PageAnalysisRun } from '../../server/domain/run-contract.ts';
import type { Citation, FindingGuidanceView, NoticeKind } from '../../server/domain/finding-analysis-types.ts';
import { readArray, readObject, requireKeys, requireValid } from '../../server/domain/run-contract/contract-value-reader.ts';
import { CORPUS_IDENTITY, findPassageReference } from '../../server/retrieval/corpus-identity.ts';
import { SOURCE_NOTICES } from '../../server/retrieval/source-notices.ts';

export type GuidanceIntent = { readonly runId: string; readonly findingId: string };
type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
export type GuidanceOutcome =
  | { readonly ok: true; readonly run: CompleteRun; readonly view: FindingGuidanceView }
  | { readonly ok: false; readonly run: CompleteRun | null; readonly error: string;
      readonly persisted: boolean; readonly cleanupFailed: boolean };

const errors = ['invalid-request', 'busy', 'stopping', 'not-found', 'invalid-run',
  'stored-run-unavailable', 'read-failed', 'not-eligible', 'workflow-active', 'retrieval-persistence',
  'corpus-integrity', 'missing-prerequisite', 'model-identity', 'input-fit', 'embedding-failed',
  'embedding-response', 'timeout', 'shutdown', 'result-validation'];

function preservesRun(before: CompleteRun, after: CompleteRun, findingId: string): boolean {
  const original = before.scan.findings.find(item => item.findingId === findingId);
  const selected = after.scan.findings.find(item => item.findingId === findingId);
  if (!original || !selected) return false;
  for (const key of ['findingId', 'ruleId', 'nativeResult', 'checks', 'locator', 'evidence'] as const) {
    if (!equal(original[key], selected[key])) return false;
  }
  return equal(before, { ...after, scan: { ...after.scan,
    findings: after.scan.findings.map(item => item.findingId === findingId ? original : item) } });
}

function readView(raw: unknown, run: CompleteRun, finding: Finding): FindingGuidanceView {
  const view = readObject(raw, ['runId', 'findingId', 'corpus', 'passages', 'notices']);
  requireValid(view.runId === run.runId && view.findingId === finding.findingId);
  const retrieval = 'retrieval' in finding && finding.retrieval.status === 'completed' ? finding.retrieval.result : null;
  requireValid(equal(view.corpus, retrieval ? CORPUS_IDENTITY : null));
  const noticeKinds: NoticeKind[] = [];
  const passages = readArray(view.passages, value => {
    const passage = readObject(value);
    requireKeys(passage, ['passageId', 'corpusVersion', 'sourceTitle', 'sourceType', 'heading', 'url',
      'ruleId', 'successCriterion', 'guidanceRole', 'text', 'score', 'sourceStatus', 'copyright', 'attribution', 'noticeKind']);
    requireValid(typeof passage.passageId === 'string');
    const reference = findPassageReference(passage.passageId);
    requireValid(reference && Object.entries(reference).every(([key, expected]) => passage[key] === expected));
    const kind = reference.sourceType === 'recommendation' ? 'document' : 'software-document';
    const status = reference.sourceType === 'recommendation' ? 'W3C Recommendation'
      : reference.sourceType === 'understanding' ? 'Informative Understanding document'
      : 'Informative technique; examples are not required for WCAG conformance';
    requireValid(passage.corpusVersion === CORPUS_IDENTITY.version && passage.noticeKind === kind &&
      passage.sourceStatus === status &&
      passage.copyright === `Copyright © ${kind === 'document' ? '2020-2024' : '2026'} World Wide Web Consortium.` &&
      passage.attribution === 'W3C Accessibility Guidelines Working Group (AG WG) and contributors; source title and original URL above.' &&
      typeof passage.text === 'string' && passage.text.trim().length > 0);
    if (!noticeKinds.includes(kind)) noticeKinds.push(kind);
    return Object.freeze(passage) as Citation;
  });
  requireValid(passages.length === (retrieval?.passages.length ?? 0));
  passages.forEach((passage, index) => {
    const ranked = retrieval?.passages[index];
    requireValid(ranked && ranked.passageId === passage.passageId && ranked.score === passage.score);
  });
  const notices = readArray(view.notices, value => {
    const notice = readObject(value, ['kind', 'text']);
    requireValid(notice.kind === 'document' || notice.kind === 'software-document');
    const kind: NoticeKind = notice.kind;
    requireValid(notice.text === SOURCE_NOTICES[kind]);
    return Object.freeze({ kind, text: SOURCE_NOTICES[kind] });
  });
  requireValid(equal(notices.map(notice => notice.kind), noticeKinds));
  return Object.freeze({ runId: run.runId, findingId: finding.findingId,
    corpus: retrieval ? CORPUS_IDENTITY : null, passages, notices });
}

export function admitGuidance(raw: unknown, before: CompleteRun, findingId: string): GuidanceOutcome | null {
  try {
    const envelope = readObject(snapshot(raw));
    requireValid(envelope.ok === true || envelope.ok === false);
    requireKeys(envelope, envelope.ok ? ['ok', 'run', 'view'] : ['ok', 'run', 'error', 'persisted', 'cleanupFailed']);
    let run: CompleteRun | null = null;
    if (envelope.run !== null) {
      const parsed = validateRun(envelope.run);
      requireValid(parsed.ok && parsed.value.status === 'completed');
      run = parsed.value;
      requireValid(preservesRun(before, run, findingId));
    }
    if (envelope.ok) {
      requireValid(run);
      const finding = run.scan.findings.find(item => item.findingId === findingId);
      requireValid(finding && 'analysis' in finding && finding.analysis.status === 'completed');
      return { ok: true, run, view: readView(envelope.view, run, finding) };
    }
    requireValid(typeof envelope.error === 'string' && errors.includes(envelope.error) &&
      typeof envelope.persisted === 'boolean' && typeof envelope.cleanupFailed === 'boolean');
    requireValid(run !== null || !envelope.persisted);
    if (run) {
      const finding = run.scan.findings.find(item => item.findingId === findingId);
      // A failed attempt may expose its last durable progress, never a successful outcome.
      requireValid(finding && !(('analysis' in finding && finding.analysis.status === 'completed') ||
        ('retrieval' in finding && finding.retrieval.status === 'completed')));
    }
    return { ok: false, run, error: envelope.error, persisted: envelope.persisted, cleanupFailed: envelope.cleanupFailed };
  } catch { return null; }
}
