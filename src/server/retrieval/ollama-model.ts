import { readArray, readObject } from '../domain/run-contract/contract-value-reader.ts';
import {
  EMBEDDING_ARCHITECTURE, EMBEDDING_IDENTITY, EMBEDDING_QUANTIZATION,
} from './embedding-profile.ts';
import { RetrievalError } from './retrieval-error.ts';

function fail(code: 'missing-prerequisite' | 'model-identity' | 'embedding-response'): never {
  throw new RetrievalError(code);
}

function optionalLocal(record: Record<string, unknown>): void {
  for (const key of ['remote_model', 'remote_host']) {
    if (Object.hasOwn(record, key) && record[key] !== '') fail('model-identity');
  }
}

function exactAlias(record: Record<string, unknown>): boolean {
  return record.name === EMBEDDING_IDENTITY.resolvedModel || record.model === EMBEDDING_IDENTITY.resolvedModel;
}

function consumedAliases(record: Record<string, unknown>): void {
  if (typeof record.name !== 'string' || typeof record.model !== 'string' || record.name !== record.model) {
    fail('model-identity');
  }
}

function validateTarget(record: Record<string, unknown>): void {
  optionalLocal(record);
  if (record.name !== EMBEDDING_IDENTITY.resolvedModel
      || record.model !== EMBEDDING_IDENTITY.resolvedModel
      || record.digest !== EMBEDDING_IDENTITY.manifestDigest) fail('model-identity');
}

export function validateOllamaVersion(input: unknown): void {
  try {
    const value = readObject(input);
    if (value.version !== EMBEDDING_IDENTITY.runtimeVersion) fail('model-identity');
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    fail('model-identity');
  }
}

export function validateOllamaTags(input: unknown): void {
  try {
    const value = readObject(input);
    let targets = 0;
    for (const item of readArray(value.models, readObject)) {
      consumedAliases(item);
      if (exactAlias(item)) {
        targets += 1;
        validateTarget(item);
      }
    }
    if (targets === 0) fail('missing-prerequisite');
    if (targets !== 1) fail('model-identity');
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    fail('model-identity');
  }
}

export function validateOllamaShow(input: unknown): void {
  try {
    const value = readObject(input);
    optionalLocal(value);
    const details = readObject(value.details);
    const info = readObject(value.model_info);
    if (details.quantization_level !== EMBEDDING_QUANTIZATION
        || info['general.architecture'] !== EMBEDDING_ARCHITECTURE
        || info['gemma3.context_length'] !== EMBEDDING_IDENTITY.context
        || info['gemma3.embedding_length'] !== EMBEDDING_IDENTITY.dimensions) fail('model-identity');
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    fail('model-identity');
  }
}

export function validateOllamaPs(input: unknown, allowUnloaded: boolean): boolean {
  try {
    const value = readObject(input);
    const models = readArray(value.models, readObject);
    models.forEach(consumedAliases);
    const targets = models.filter(exactAlias);
    if (targets.length === 0) {
      if (allowUnloaded) return false;
      fail('model-identity');
    }
    if (targets.length !== 1) fail('model-identity');
    validateTarget(targets[0]);
    if (targets[0].context_length !== EMBEDDING_IDENTITY.context) fail('model-identity');
    return true;
  } catch (error) {
    if (error instanceof RetrievalError) throw error;
    fail('model-identity');
  }
}

export function validateOllamaEmbedding(input: unknown): readonly number[] {
  try {
    const value = readObject(input);
    optionalLocal(value);
    if (value.model !== EMBEDDING_IDENTITY.resolvedModel) throw new Error('invalid');
    const embeddings = readArray(value.embeddings, item => readArray(item, number => {
      if (typeof number !== 'number' || !Number.isFinite(number)) throw new Error('invalid');
      return number;
    }));
    if (embeddings.length !== 1 || embeddings[0].length !== EMBEDDING_IDENTITY.dimensions) throw new Error('invalid');
    const norm = Math.hypot(...embeddings[0]);
    if (!Number.isFinite(norm) || norm <= 0) throw new Error('invalid');
    if (Object.hasOwn(value, 'prompt_eval_count')
        && (typeof value.prompt_eval_count !== 'number'
          || !Number.isSafeInteger(value.prompt_eval_count) || value.prompt_eval_count < 0)) throw new Error('invalid');
    return Object.freeze([...embeddings[0]]);
  } catch (error) {
    if (error instanceof RetrievalError && error.code === 'embedding-response') throw error;
    throw new RetrievalError('embedding-response');
  }
}
