import { createHash } from 'node:crypto';
import { CORPUS_IDENTITY, findPassageReference, PASSAGE_REFERENCES } from './corpus-identity.ts';
import type { CorpusIdentity, RetrievalRuleId, SuccessCriterion } from './corpus-identity.ts';

export type CorpusManifest = Readonly<Record<string, unknown>>;
export type CorpusPassage = {
  readonly passageId: string;
  readonly corpusVersion: CorpusIdentity['version'];
  readonly sourceTitle: string;
  readonly sourceType: 'recommendation' | 'understanding' | 'technique';
  readonly heading: string;
  readonly url: string;
  readonly ruleIds: readonly RetrievalRuleId[];
  readonly successCriteria: readonly SuccessCriterion[];
  readonly guidanceRole: 'criterion' | 'interpretation' | 'remediation';
  readonly text: string;
};
export type CorpusCatalog = {
  readonly identity: CorpusIdentity;
  readonly manifest: CorpusManifest;
  readonly passages: readonly CorpusPassage[];
};
export type CorpusCatalogResult =
  | { readonly ok: true; readonly value: CorpusCatalog }
  | { readonly ok: false; readonly error: 'corpus-integrity' };

const failure = Object.freeze({ ok: false, error: 'corpus-integrity' } as const);
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: false });

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function decodeCanonical(bytes: Uint8Array): string {
  if (!(bytes instanceof Uint8Array)) throw new Error('Invalid corpus');
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    throw new Error('Invalid corpus');
  }
  const text = decoder.decode(bytes);
  if (text.startsWith('\uFEFF') || /\r(?!\n)/.test(text)) throw new Error('Invalid corpus');
  return text.replaceAll('\r\n', '\n');
}

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex').toUpperCase();
}

function assertPlainRecord(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)
      || Object.getPrototypeOf(value) !== Object.prototype) throw new Error('Invalid corpus');
}

function assertPassages(value: unknown): asserts value is {
  corpusVersion: CorpusIdentity['version']; passages: CorpusPassage[];
} {
  assertPlainRecord(value);
  if (Object.keys(value).length !== 2 || value.corpusVersion !== CORPUS_IDENTITY.version
      || !Array.isArray(value.passages)
      || value.passages.length !== PASSAGE_REFERENCES.length) throw new Error('Invalid corpus');
  const ids = new Set<string>();
  value.passages.forEach((passage, index) => {
    assertPlainRecord(passage);
    const keys = ['passageId', 'corpusVersion', 'sourceTitle', 'sourceType', 'heading', 'url', 'ruleIds', 'successCriteria', 'guidanceRole', 'text'];
    if (Object.keys(passage).length !== keys.length || !keys.every(key => Object.hasOwn(passage, key))) throw new Error('Invalid corpus');
    const reference = PASSAGE_REFERENCES[index];
    if (passage.passageId !== reference.passageId || ids.has(reference.passageId)
        || passage.corpusVersion !== CORPUS_IDENTITY.version || passage.sourceTitle !== reference.sourceTitle
        || passage.heading !== reference.heading || passage.url !== reference.url
        || !Array.isArray(passage.ruleIds) || passage.ruleIds.length !== 1 || passage.ruleIds[0] !== reference.ruleId
        || !Array.isArray(passage.successCriteria) || passage.successCriteria.length !== 1
        || passage.successCriteria[0] !== reference.successCriterion || typeof passage.text !== 'string') throw new Error('Invalid corpus');
    ids.add(reference.passageId);
  });
}

function assertManifest(value: unknown): asserts value is CorpusManifest {
  assertPlainRecord(value);
  if (value.corpusVersion !== CORPUS_IDENTITY.version || !Array.isArray(value.sources)
      || value.sources.length !== 8 || !Array.isArray(value.profiles) || value.profiles.length !== 3
      || !Array.isArray(value.unresolvedConflicts) || value.unresolvedConflicts.length !== 0) throw new Error('Invalid corpus');
  for (const profile of value.profiles) {
    assertPlainRecord(profile);
    if (typeof profile.ruleId !== 'string' || typeof profile.successCriterion !== 'string') throw new Error('Invalid corpus');
    const references = PASSAGE_REFERENCES.filter(item => item.ruleId === profile.ruleId);
    if (references.length === 0 || references[0].successCriterion !== profile.successCriterion) throw new Error('Invalid corpus');
  }
}

export function parseCorpusCatalog(manifestBytes: Uint8Array, passageBytes: Uint8Array): CorpusCatalogResult {
  try {
    const manifestText = decodeCanonical(manifestBytes);
    const passageText = decodeCanonical(passageBytes);
    if (sha256(manifestText) !== CORPUS_IDENTITY.manifestSha256
        || sha256(passageText) !== CORPUS_IDENTITY.passagesSha256) return failure;
    const manifest: unknown = JSON.parse(manifestText);
    const passages: unknown = JSON.parse(passageText);
    assertManifest(manifest);
    assertPassages(passages);
    for (const passage of passages.passages) {
      if (!findPassageReference(passage.passageId)) throw new Error('Invalid corpus');
    }
    return deepFreeze({ ok: true, value: { identity: { ...CORPUS_IDENTITY }, manifest, passages: passages.passages } });
  } catch {
    return failure;
  }
}
