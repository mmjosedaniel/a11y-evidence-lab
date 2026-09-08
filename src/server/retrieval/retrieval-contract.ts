import { CORPUS_IDENTITY, findPassageReference } from './corpus-identity.ts';
import { createFindingQuery } from './finding-query.ts';
import type { FindingQuery } from './finding-query.ts';
import { EMBEDDING_IDENTITY } from './embedding-profile.ts';
import { readArray, readObject } from '../domain/run-contract/contract-value-reader.ts';

export type RetrievalPassage = { readonly passageId: string; readonly score: number };
export type RetrievalResult = {
  readonly corpus: typeof CORPUS_IDENTITY;
  readonly query: FindingQuery;
  readonly embedding: typeof EMBEDDING_IDENTITY;
  readonly filter: { readonly ruleId: FindingQuery['ruleId']; readonly successCriterion: FindingQuery['successCriterion'] };
  readonly metric: 'cosine'; readonly topK: 3; readonly tieBreak: 'passageId-ascending';
  readonly passages: readonly RetrievalPassage[];
};
export type RetrievalValidationResult =
  | { readonly ok: true; readonly value: RetrievalResult }
  | { readonly ok: false; readonly error: 'result-validation' };

const failure = Object.freeze({ ok: false, error: 'result-validation' } as const);

function exact(actual: Record<string, unknown>, expected: Readonly<Record<string, unknown>>): void {
  for (const [key, value] of Object.entries(expected)) if (!Object.is(actual[key], value)) throw new Error('Invalid result');
}

function passageArray(input: unknown, query: FindingQuery): readonly RetrievalPassage[] {
  const seen = new Set<string>();
  let previous: RetrievalPassage | undefined;
  const result = readArray(input, value => {
    const item = readObject(value, ['passageId', 'score']);
    if (typeof item.passageId !== 'string' || typeof item.score !== 'number' || !Number.isFinite(item.score)
        || item.score < -1 - 1e-12 || item.score > 1 + 1e-12 || seen.has(item.passageId)) throw new Error('Invalid result');
    const reference = findPassageReference(item.passageId);
    if (!reference || reference.ruleId !== query.ruleId || reference.successCriterion !== query.successCriterion) throw new Error('Invalid result');
    const current = Object.freeze({ passageId: item.passageId, score: item.score });
    if (previous && (current.score > previous.score
        || (current.score === previous.score && current.passageId < previous.passageId))) throw new Error('Invalid result');
    seen.add(current.passageId); previous = current;
    return current;
  });
  if (result.length > 3) throw new Error('Invalid result');
  return result;
}

export function validateRetrievalResult(input: unknown, finding: unknown): RetrievalValidationResult {
  try {
    const queryResult = createFindingQuery(finding);
    if (!queryResult.ok) return failure;
    const root = readObject(input, ['corpus', 'query', 'embedding', 'filter', 'metric', 'topK', 'tieBreak', 'passages']);
    const corpus = readObject(root.corpus, Object.keys(CORPUS_IDENTITY)); exact(corpus, CORPUS_IDENTITY);
    const query = readObject(root.query, ['version', 'ruleId', 'successCriterion', 'element', 'condition', 'text']); exact(query, queryResult.value);
    const embedding = readObject(root.embedding, Object.keys(EMBEDDING_IDENTITY)); exact(embedding, EMBEDDING_IDENTITY);
    const filter = readObject(root.filter, ['ruleId', 'successCriterion']);
    if (filter.ruleId !== queryResult.value.ruleId || filter.successCriterion !== queryResult.value.successCriterion
        || root.metric !== 'cosine' || root.topK !== 3 || root.tieBreak !== 'passageId-ascending') throw new Error('Invalid result');
    const passages = passageArray(root.passages, queryResult.value);
    const value: RetrievalResult = Object.freeze({
      corpus: Object.freeze({ ...CORPUS_IDENTITY }), query: Object.freeze({ ...queryResult.value }),
      embedding: Object.freeze({ ...EMBEDDING_IDENTITY }),
      filter: Object.freeze({ ruleId: queryResult.value.ruleId, successCriterion: queryResult.value.successCriterion }),
      metric: 'cosine', topK: 3, tieBreak: 'passageId-ascending', passages,
    });
    return Object.freeze({ ok: true, value });
  } catch {
    return failure;
  }
}
