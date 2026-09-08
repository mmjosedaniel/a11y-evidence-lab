import { CORPUS_IDENTITY, PASSAGE_REFERENCES } from './corpus-identity.ts';
import { loadCorpusCatalog } from './corpus-catalog.ts';
import type { CorpusCatalog, CorpusCatalogResult } from './corpus-validation.ts';
import { prepareEmbeddingInput } from './embedding-input-fit.ts';
import { EMBEDDING_IDENTITY, EMBEDDING_SOURCE_IDENTITY } from './embedding-profile.ts';
import { createFindingQuery } from './finding-query.ts';
import { beginOllamaEmbedding } from './ollama-embedding.ts';
import type { OllamaRequester } from './ollama-http.ts';
import { buildVectorCollection, rankCanonicalPassages } from './retrieval-ranking.ts';
import { validateRetrievalResult } from './retrieval-contract.ts';
import type { RetrievalResult } from './retrieval-contract.ts';
import { RetrievalError } from './retrieval-error.ts';
import type { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';

type Dependencies = {
  readonly request?: OllamaRequester;
  readonly loadCatalog?: () => Promise<CorpusCatalogResult>;
};
type Collection = { readonly identity: string; readonly store: MemoryVectorStore };

function catalogIdentity(catalog: CorpusCatalog): string {
  try {
    if (catalog.identity.version !== CORPUS_IDENTITY.version
        || catalog.identity.manifestSha256 !== CORPUS_IDENTITY.manifestSha256
        || catalog.identity.passagesSha256 !== CORPUS_IDENTITY.passagesSha256
        || catalog.passages.length !== PASSAGE_REFERENCES.length) throw new Error('invalid');
    const passages = catalog.passages.map((passage, index) => {
      const reference = PASSAGE_REFERENCES[index];
      if (passage.passageId !== reference.passageId || passage.sourceTitle !== reference.sourceTitle
          || passage.heading !== reference.heading || passage.url !== reference.url
          || passage.ruleIds.length !== 1 || passage.ruleIds[0] !== reference.ruleId
          || passage.successCriteria.length !== 1 || passage.successCriteria[0] !== reference.successCriterion) {
        throw new Error('invalid');
      }
      prepareEmbeddingInput('D', passage.text);
      return [passage.passageId, passage.text];
    });
    return JSON.stringify({
      corpus: catalog.identity, passages, embedding: EMBEDDING_IDENTITY, source: EMBEDDING_SOURCE_IDENTITY,
    });
  } catch {
    throw new RetrievalError('corpus-integrity');
  }
}

export function createExactRetrieval(dependencies: Dependencies = {}) {
  const loadCatalog = dependencies.loadCatalog ?? (() => loadCorpusCatalog());
  let collection: Collection | undefined;
  let active = false;
  let closed = false;

  return async (finding: unknown, callerSignal: AbortSignal): Promise<RetrievalResult> => {
    if (closed || active) throw new RetrievalError('embedding-failed');
    if (callerSignal.aborted) throw new RetrievalError('shutdown');
    active = true;
    const operation = new AbortController();
    let termination!: (error: RetrievalError) => void;
    const terminated = new Promise<never>((_, reject) => { termination = reject; });
    const onAbort = () => {
      operation.abort();
      closed = true;
      termination(new RetrievalError('shutdown', true));
    };
    callerSignal.addEventListener('abort', onAbort, { once: true });
    const timer = setTimeout(() => {
      operation.abort();
      closed = true;
      termination(new RetrievalError('timeout', true));
    }, 300_000);

    const work = (async () => {
      const checked = async <T>(start: () => Promise<T>): Promise<T> => {
        if (operation.signal.aborted) throw new RetrievalError(callerSignal.aborted ? 'shutdown' : 'timeout', true);
        const value = await start();
        if (operation.signal.aborted) throw new RetrievalError(callerSignal.aborted ? 'shutdown' : 'timeout', true);
        return value;
      };
      try {
        const query = createFindingQuery(finding);
        if (!query.ok) throw new RetrievalError('result-validation');
        let loaded: CorpusCatalogResult;
        try {
          loaded = await checked(loadCatalog);
        } catch (error) {
          if (error instanceof RetrievalError && (error.code === 'shutdown' || error.code === 'timeout')) throw error;
          throw new RetrievalError('corpus-integrity');
        }
        if (!loaded.ok) throw new RetrievalError('corpus-integrity');
        const identity = catalogIdentity(loaded.value);
        prepareEmbeddingInput('Q', query.value.text);
        if (collection && collection.identity !== identity) collection = undefined;
        const session = await checked(() => beginOllamaEmbedding(operation.signal, dependencies.request));
        let candidate: MemoryVectorStore | undefined;
        const store = collection?.store ?? await (async () => {
          const vectors: number[][] = [];
          for (const passage of loaded.value.passages) {
            vectors.push([...(await checked(() => session.embedDocument(passage.text)))]);
          }
          return checked(() => buildVectorCollection(loaded.value, vectors));
        })();
        if (!collection) candidate = store;
        const queryVector = await checked(() => session.embedQuery(query.value.text));
        const passages = await checked(() => rankCanonicalPassages(store, loaded.value, query.value, queryVector));
        await checked(() => session.finish());
        const proposed = {
          corpus: { ...CORPUS_IDENTITY }, query: { ...query.value }, embedding: { ...EMBEDDING_IDENTITY },
          filter: { ruleId: query.value.ruleId, successCriterion: query.value.successCriterion },
          metric: 'cosine', topK: 3, tieBreak: 'passageId-ascending', passages,
        } as const;
        const validated = validateRetrievalResult(proposed, finding);
        if (!validated.ok) throw new RetrievalError('result-validation');
        if (operation.signal.aborted) throw new RetrievalError(callerSignal.aborted ? 'shutdown' : 'timeout', true);
        if (candidate) collection = { identity, store: candidate };
        return validated.value;
      } catch (error) {
        if (error instanceof RetrievalError) {
          if (error.cleanupFailed) closed = true;
          if (['corpus-integrity', 'missing-prerequisite', 'model-identity', 'input-fit', 'embedding-response', 'result-validation'].includes(error.code)) {
            collection = undefined;
          }
          throw error;
        }
        throw new RetrievalError('embedding-failed');
      }
    })();
    work.catch(() => undefined);

    try {
      return await Promise.race([work, terminated]);
    } finally {
      clearTimeout(timer);
      callerSignal.removeEventListener('abort', onAbort);
      active = false;
    }
  };
}
