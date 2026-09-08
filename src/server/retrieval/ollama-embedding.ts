import { prepareEmbeddingInput } from './embedding-input-fit.ts';
import { requestOllama } from './ollama-http.ts';
import type { OllamaRequester } from './ollama-http.ts';
import {
  validateOllamaEmbedding, validateOllamaPs, validateOllamaShow, validateOllamaTags, validateOllamaVersion,
} from './ollama-model.ts';
import { RetrievalError } from './retrieval-error.ts';

export type OllamaEmbeddingSession = {
  embedDocument(text: string): Promise<readonly number[]>;
  embedQuery(text: string): Promise<readonly number[]>;
  finish(): Promise<void>;
};

export async function beginOllamaEmbedding(
  signal: AbortSignal,
  request: OllamaRequester = requestOllama,
): Promise<OllamaEmbeddingSession> {
  if (signal.aborted) throw new RetrievalError('shutdown');
  const checked = async <T>(operation: () => Promise<T>): Promise<T> => {
    if (signal.aborted) throw new RetrievalError('shutdown', true);
    const value = await operation();
    if (signal.aborted) throw new RetrievalError('shutdown', true);
    return value;
  };
  let loaded: boolean;
  try {
    validateOllamaVersion(await checked(() => request({ kind: 'version' }, signal)));
    validateOllamaTags(await checked(() => request({ kind: 'tags' }, signal)));
    validateOllamaShow(await checked(() => request({ kind: 'show' }, signal)));
    loaded = validateOllamaPs(await checked(() => request({ kind: 'ps' }, signal)), true);
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    throw new RetrievalError('embedding-failed');
  }
  let state: 'active' | 'finished' | 'failed' = 'active';
  let operationReserved = false;

  const reserveOperation = (): void => {
    if (state !== 'active' || operationReserved) throw new RetrievalError('embedding-failed');
    if (signal.aborted) {
      state = 'failed';
      throw new RetrievalError('shutdown', true);
    }
    operationReserved = true;
  };

  const checkedOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
    if (state !== 'active' || signal.aborted) throw new RetrievalError('shutdown', true);
    const value = await operation();
    if (state !== 'active' || signal.aborted) throw new RetrievalError('shutdown', true);
    return value;
  };

  const embed = async (kind: 'D' | 'Q', text: string): Promise<readonly number[]> => {
    reserveOperation();
    try {
      const input = prepareEmbeddingInput(kind, text);
      const vector = validateOllamaEmbedding(await checkedOperation(() => request({ kind: 'embed', input }, signal)));
      if (!loaded) {
        validateOllamaPs(await checkedOperation(() => request({ kind: 'ps' }, signal)), false);
        loaded = true;
      }
      if (state !== 'active' || signal.aborted) throw new RetrievalError('shutdown', true);
      return vector;
    } catch (error) {
      state = 'failed';
      if (error instanceof RetrievalError) throw error;
      throw new RetrievalError('embedding-failed');
    } finally {
      operationReserved = false;
    }
  };

  return Object.freeze({
    embedDocument: (text: string) => embed('D', text),
    embedQuery: (text: string) => embed('Q', text),
    finish: async () => {
      reserveOperation();
      try {
        validateOllamaTags(await checkedOperation(() => request({ kind: 'tags' }, signal)));
        validateOllamaShow(await checkedOperation(() => request({ kind: 'show' }, signal)));
        validateOllamaPs(await checkedOperation(() => request({ kind: 'ps' }, signal)), false);
        if (state !== 'active' || signal.aborted) throw new RetrievalError('shutdown', true);
        state = 'finished';
      } catch (error) {
        state = 'failed';
        if (error instanceof RetrievalError) throw error;
        throw new RetrievalError('embedding-failed');
      } finally {
        operationReserved = false;
      }
    },
  });
}
