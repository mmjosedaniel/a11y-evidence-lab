import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { createCorpusDocuments } from './corpus-catalog.ts';
import { findPassageReference, PROFILE_REQUIRED_ROLES } from './corpus-identity.ts';
import type { CorpusCatalog, CorpusPassage } from './corpus-validation.ts';
import { readArray, readObject } from '../domain/run-contract/contract-value-reader.ts';
import type { FindingQuery } from './finding-query.ts';
import type { RetrievalPassage } from './retrieval-contract.ts';
import { RetrievalError } from './retrieval-error.ts';

const suppliedOnly: EmbeddingsInterface = Object.freeze({
  embedDocuments: async () => { throw new RetrievalError('embedding-failed'); },
  embedQuery: async () => { throw new RetrievalError('embedding-failed'); },
});

function matchesPassage(document: { id?: string; pageContent: string; metadata: unknown }, passage: CorpusPassage): boolean {
  const metadata = readObject(document.metadata, [
    'passageId', 'corpusVersion', 'sourceTitle', 'sourceType', 'heading', 'url',
    'ruleIds', 'successCriteria', 'guidanceRole',
  ]);
  const ruleIds = readArray(metadata.ruleIds, value => value);
  const successCriteria = readArray(metadata.successCriteria, value => value);
  return document.id === passage.passageId && document.pageContent === passage.text
    && metadata.passageId === passage.passageId && metadata.corpusVersion === passage.corpusVersion
    && metadata.sourceTitle === passage.sourceTitle && metadata.sourceType === passage.sourceType
    && metadata.heading === passage.heading && metadata.url === passage.url
    && metadata.guidanceRole === passage.guidanceRole
    && ruleIds.length === 1 && ruleIds[0] === passage.ruleIds[0]
    && successCriteria.length === 1 && successCriteria[0] === passage.successCriteria[0];
}

export async function buildVectorCollection(
  catalog: CorpusCatalog,
  vectors: readonly (readonly number[])[],
): Promise<MemoryVectorStore> {
  if (vectors.length !== catalog.passages.length
      || vectors.some(vector => vector.length !== 768 || vector.some(value => !Number.isFinite(value))
        || !Number.isFinite(Math.hypot(...vector)) || Math.hypot(...vector) <= 0)) {
    throw new RetrievalError('result-validation');
  }
  const store = new MemoryVectorStore(suppliedOnly);
  try {
    const copies = vectors.map(vector => [...vector]);
    await store.addVectors(copies, [...createCorpusDocuments(catalog)]);
    return store;
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    throw new RetrievalError('result-validation');
  }
}

export async function rankCanonicalPassages(
  store: MemoryVectorStore,
  catalog: CorpusCatalog,
  query: FindingQuery,
  vector: readonly number[],
): Promise<readonly RetrievalPassage[]> {
  try {
    if (vector.length !== 768 || vector.some(value => !Number.isFinite(value))
        || !Number.isFinite(Math.hypot(...vector)) || Math.hypot(...vector) <= 0) {
      throw new RetrievalError('result-validation');
    }
    const found = await store.similaritySearchVectorWithScore([...vector], catalog.passages.length, document => {
      const rules = document.metadata.ruleIds;
      const criteria = document.metadata.successCriteria;
      return Array.isArray(rules) && rules.includes(query.ruleId)
        && Array.isArray(criteria) && criteria.includes(query.successCriterion);
    });
    if (found.length > catalog.passages.length) throw new RetrievalError('result-validation');
    const seen = new Set<string>();
    const resolved = found.map(([document, score]) => {
      if (typeof score !== 'number' || !Number.isFinite(score)
          || score < -1 - 1e-12 || score > 1 + 1e-12
          || typeof document.id !== 'string' || seen.has(document.id)) throw new RetrievalError('result-validation');
      const passage = catalog.passages.find(candidate => candidate.passageId === document.id);
      if (!passage || passage.ruleIds[0] !== query.ruleId
          || passage.successCriteria[0] !== query.successCriterion || !matchesPassage(document, passage)) {
        throw new RetrievalError('result-validation');
      }
      seen.add(document.id);
      return Object.freeze({ passageId: passage.passageId, score });
    });
    resolved.sort((left, right) => left.score > right.score ? -1 : left.score < right.score ? 1
      : left.passageId < right.passageId ? -1 : left.passageId > right.passageId ? 1 : 0);
    const remainingRoles = new Set(PROFILE_REQUIRED_ROLES[query.ruleId]);
    return Object.freeze(resolved.filter(passage => {
      const reference = findPassageReference(passage.passageId);
      if (!reference) throw new RetrievalError('result-validation');
      return remainingRoles.delete(reference.guidanceRole);
    }));
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    throw new RetrievalError('result-validation');
  }
}
