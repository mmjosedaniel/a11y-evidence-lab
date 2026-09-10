import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Document } from '@langchain/core/documents';
import { parseCorpusCatalog } from './corpus-validation.ts';
import type { CorpusCatalog, CorpusCatalogResult } from './corpus-validation.ts';
import { resolveCitations } from './citation-resolution.ts';
import type { CitationResolutionResult } from '../domain/finding-analysis-types.ts';

const manifestPath = fileURLToPath(new URL('../../../corpus/wcag22-mvp-v1/manifest.json', import.meta.url));
const passagesPath = fileURLToPath(new URL('../../../corpus/wcag22-mvp-v1/passages.json', import.meta.url));

export async function readCorpusBytes(): Promise<readonly [Uint8Array, Uint8Array]> {
  return Promise.all([readFile(manifestPath), readFile(passagesPath)]);
}

export async function loadCorpusCatalog(): Promise<CorpusCatalogResult> {
  try {
    const [manifest, passages] = await readCorpusBytes();
    return parseCorpusCatalog(manifest, passages);
  } catch {
    return Object.freeze({ ok: false, error: 'corpus-integrity' });
  }
}

export async function resolveFindingCitations(finding: unknown, retrieval: unknown): Promise<CitationResolutionResult> {
  try {
    const [manifest, passages] = await readCorpusBytes();
    return resolveCitations(finding, retrieval, manifest, passages);
  } catch {
    return Object.freeze({ ok: false, error: 'corpus-integrity' });
  }
}

export function createCorpusDocuments(catalog: CorpusCatalog): readonly Document[] {
  return Object.freeze(catalog.passages.map(passage => {
    const { text, ...fields } = passage;
    const metadata = Object.freeze({
      ...fields,
      ruleIds: Object.freeze([...fields.ruleIds]),
      successCriteria: Object.freeze([...fields.successCriteria]),
    });
    return Object.freeze(new Document({ id: passage.passageId, pageContent: text, metadata }));
  }));
}
