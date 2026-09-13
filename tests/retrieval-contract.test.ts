import assert from 'node:assert/strict';
import { Document } from '@langchain/core/documents';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { createCorpusDocuments, loadCorpusCatalog } from '../src/server/retrieval/corpus-catalog.ts';
import { parseCorpusCatalog } from '../src/server/retrieval/corpus-validation.ts';
import { createFindingQuery } from '../src/server/retrieval/finding-query.ts';
import { validateRetrievalResult } from '../src/server/retrieval/retrieval-contract.ts';
import {
  contrastFinding, expectedCorpusIdentity, fact, finiteInputSha256, imageFinding,
  labelFinding, queryCases, retrievalResult, unavailable,
} from './helpers/m202-retrieval-fixture.ts';

const root = resolve(import.meta.dirname, '..');
const manifestPath = resolve(root, 'corpus/wcag22-mvp-v1/manifest.json');
const passagesPath = resolve(root, 'corpus/wcag22-mvp-v1/passages.json');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const failure = { ok: false, error: 'corpus-integrity' } as const;
const resultFailure = { ok: false, error: 'result-validation' } as const;

const normalizedText = (bytes: Uint8Array) => decoder.decode(bytes).replaceAll('\r\n', '\n');
const bytes = (text: string) => encoder.encode(text);
const digest = (text: string) => createHash('sha256').update(text).digest('hex').toUpperCase();
const replaceJson = (source: string, mutate: (value: any) => void) => {
  const value = JSON.parse(source);
  mutate(value);
  return bytes(`${JSON.stringify(value, null, 2)}\n`);
};
const clone = <T>(value: T): T => structuredClone(value);
const expectDeepFrozen = (value: unknown): void => {
  if (typeof value !== 'object' || value === null) return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
};

const [manifestFile, passagesFile] = await Promise.all([readFile(manifestPath), readFile(passagesPath)]);
const manifestLf = normalizedText(manifestFile);
const passagesLf = normalizedText(passagesFile);
const canonicalManifest = JSON.parse(manifestLf);
const canonicalPassages = JSON.parse(passagesLf);

test('parses only the fixed LF/CRLF corpus and returns its complete detached frozen catalog', () => {
  for (const [manifest, passages] of [
    [bytes(manifestLf), bytes(passagesLf)],
    [bytes(manifestLf.replaceAll('\n', '\r\n')), bytes(passagesLf.replaceAll('\n', '\r\n'))],
  ]) {
    const beforeManifest = manifest.slice();
    const beforePassages = passages.slice();
    const result = parseCorpusCatalog(manifest, passages);
    assert.equal(result.ok, true);
    if (!result.ok) continue;
    assert.deepEqual(result.value.identity, expectedCorpusIdentity);
    assert.deepEqual(result.value.manifest, canonicalManifest);
    assert.deepEqual(result.value.passages, canonicalPassages.passages);
    assert.equal(result.value.passages.length, 16);
    assert.equal(new Set(result.value.passages.map(item => item.passageId)).size, 16);
    expectDeepFrozen(result);
    assert.notEqual(result.value.manifest, canonicalManifest);
    assert.notEqual(result.value.passages, canonicalPassages.passages);
    assert.deepEqual(manifest, beforeManifest);
    assert.deepEqual(passages, beforePassages);
  }
});

test('rejects invalid serialization, JSON, identity, shape, duplicate IDs and lineage without partial output', () => {
  const cases: readonly [string, Uint8Array, Uint8Array][] = [
    ['BOM', bytes(`\uFEFF${manifestLf}`), bytes(passagesLf)],
    ['invalid UTF-8', Uint8Array.from([0xc3, 0x28]), bytes(passagesLf)],
    ['bare CR', bytes(manifestLf.replace('\n', '\r')), bytes(passagesLf)],
    ['malformed JSON', bytes('{'), bytes(passagesLf)],
    ['unknown version', replaceJson(manifestLf, x => { x.corpusVersion = 'wcag22-mvp-v2'; }), bytes(passagesLf)],
    ['same-version text change', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[0].text += ' '; })],
    ['missing passage field', bytes(manifestLf), replaceJson(passagesLf, x => { delete x.passages[0].heading; })],
    ['extra passage field', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[0].language = 'en'; })],
    ['duplicate passage ID', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[1].passageId = x.passages[0].passageId; })],
    ['bad source lineage', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[0].sourceTitle = 'Unknown'; })],
    ['bad heading lineage', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[0].heading = 'Unknown'; })],
    ['bad URL lineage', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[0].url = 'https://example.org/'; })],
    ['unsupported rule tag', bytes(manifestLf), replaceJson(passagesLf, x => { x.passages[0].ruleIds = ['other']; })],
    ['incompatible profile reference', replaceJson(manifestLf, x => { x.profiles[0].successCriterion = '9.9.9'; }), bytes(passagesLf)],
  ];
  for (const [name, manifest, passages] of cases) {
    assert.deepEqual(parseCorpusCatalog(manifest, passages), failure, name);
  }
  assert.deepEqual(parseCorpusCatalog(null as never, bytes(passagesLf)), failure);
});

test('loads fixed repository paths independent of caller CWD and maps fresh canonical Documents', async () => {
  const original = process.cwd();
  let loaded;
  try {
    process.chdir(tmpdir());
    loaded = await loadCorpusCatalog();
  } finally {
    process.chdir(original);
  }
  assert.equal(loaded.ok, true);
  if (!loaded.ok) return;
  const first = createCorpusDocuments(loaded.value);
  const second = createCorpusDocuments(loaded.value);
  assert.equal(first.length, 16);
  assert.notEqual(first, second);
  for (let index = 0; index < first.length; index++) {
    const passage = canonicalPassages.passages[index];
    const { text, ...metadata } = passage;
    assert.equal(first[index].id, passage.passageId);
    assert.equal(first[index] instanceof Document, true);
    assert.equal(first[index].pageContent, text);
    assert.deepEqual(first[index].metadata, metadata);
    assert.notEqual(first[index], second[index]);
    assert.notEqual(first[index].metadata, loaded.value.passages[index]);
    assert.notEqual(first[index].metadata.ruleIds, loaded.value.passages[index].ruleIds);
    assert.notEqual(first[index].metadata.successCriteria, loaded.value.passages[index].successCriteria);
    assert.equal('notices' in first[index].metadata, false);
  }
  expectDeepFrozen(first);
  expectDeepFrozen(second);
});

test('module import performs no corpus I/O and denied fixed-file reads return corpus-integrity', () => {
  const moduleUrl = pathToFileURL(resolve(root, 'src/server/retrieval/corpus-catalog.ts')).href;
  const script = [
    `const module = await import(${JSON.stringify(moduleUrl)});`,
    "console.log('IMPORT_OK');",
    'console.log(JSON.stringify(await module.loadCorpusCatalog()));',
  ].join('');
  const child = spawnSync(process.execPath, [
    '--permission',
    `--allow-fs-read=${resolve(root, 'src')}`,
    `--allow-fs-read=${resolve(root, 'node_modules')}`,
    `--allow-fs-read=${resolve(root, 'package.json')}`,
    '--input-type=module', '--eval', script,
  ], { cwd: tmpdir(), encoding: 'utf8' });
  assert.equal(child.status, 0, child.stderr);
  const lines = child.stdout.trim().split(/\r?\n/);
  assert.deepEqual(lines, ['IMPORT_OK', JSON.stringify(failure)]);
});

test('projects all 47 allowlisted Finding queries and the accepted 63 prefixed input hashes', () => {
  assert.equal(queryCases.length, 47);
  const queryHashes: string[] = [];
  for (const entry of queryCases) {
    const before = clone(entry.finding);
    const result = createFindingQuery(entry.finding);
    assert.deepEqual(result, { ok: true, value: entry.expected }, entry.name);
    assert.deepEqual(entry.finding, before, entry.name);
    expectDeepFrozen(result);
    queryHashes.push(digest(`task: search result | query: ${entry.expected.text}`));
    assert.equal(entry.expected.text.endsWith('\n'), false);
  }
  const documentHashes = canonicalPassages.passages.map((passage: any) =>
    digest(`title: none | text: ${passage.text}`));
  assert.deepEqual([...documentHashes, ...queryHashes], finiteInputSha256);
  assert.equal(new Set(finiteInputSha256).size, 63);
});

test('recognizes every positive label indicator and gives positive evidence precedence over unavailable siblings', () => {
  const positives: readonly [string, unknown][] = [
    ['explicitLabel', fact(true)], ['implicitLabel', fact(true)],
    ['ariaLabel', fact('non-empty')], ['title', fact('non-empty')],
    ['placeholder', fact('non-empty')], ['ariaLabelledby', fact('resolved')],
    ['ariaLabelledby', fact('partially-resolved')], ['presentationalRole', fact(true)],
  ];
  for (const [key, value] of positives) {
    const finding: any = labelFinding(fact('input'), 'negative');
    finding.evidence.nameSources[key] = value;
    finding.evidence.nameSources.explicitLabel = key === 'explicitLabel' ? value : unavailable();
    const result = createFindingQuery(finding);
    assert.equal(result.ok, true, key);
    if (result.ok) assert.match(result.value.condition, /one or more/);
  }
});

test('retains every unavailable category without inventing label or contrast completeness', () => {
  for (const reason of ['missing', 'invalid', 'withheld'] as const) {
    const label: any = labelFinding(fact('input'), 'negative');
    label.evidence.nameSources.explicitLabel = unavailable(reason);
    const labelResult = createFindingQuery(label);
    assert.equal(labelResult.ok, true);
    if (labelResult.ok) assert.match(labelResult.value.condition, /completeness is unavailable/);

    const contrast: any = contrastFinding('below');
    contrast.evidence.expectedContrastRatio = unavailable(reason);
    const contrastResult = createFindingQuery(contrast);
    assert.equal(contrastResult.ok, true);
    if (contrastResult.ok) assert.equal(contrastResult.value.condition, 'contrast-ratio relation is unavailable');
  }
});

test('uses only retained allowlisted facts and rejects malformed or prohibited native input', () => {
  const baseline: any = imageFinding();
  const changed = clone(baseline);
  changed.findingId = 'different';
  changed.locator = fact(':root > :nth-child(99)');
  changed.checks = fact({ any: ['aria-label'], all: [], none: [] });
  assert.deepEqual(createFindingQuery(changed), createFindingQuery(baseline));

  const contrastA = contrastFinding('below');
  const contrastB: any = clone(contrastA);
  contrastB.evidence.foregroundColor = fact('#123456');
  contrastB.evidence.fontSize = fact('18.0pt (24px)');
  assert.deepEqual(createFindingQuery(contrastB), createFindingQuery(contrastA));

  for (const key of ['url', 'origin', 'elementText', 'imageSource', 'formValue', 'rawHtml', 'reviewHistory']) {
    const invalid: any = clone(baseline);
    invalid[key] = `SECRET-${key}`;
    const result = createFindingQuery(invalid);
    assert.deepEqual(result, resultFailure);
    assert.equal(JSON.stringify(result).includes('SECRET'), false);
  }
  const accessor = clone(baseline) as any;
  Object.defineProperty(accessor, 'locator', { enumerable: true, get() { throw new Error('SECRET'); } });
  assert.doesNotThrow(() => assert.deepEqual(createFindingQuery(accessor), resultFailure));
  assert.deepEqual(createFindingQuery({ ...baseline, state: 'active' }), resultFailure);
  assert.deepEqual(createFindingQuery({ ...baseline, ruleId: 'unknown' }), resultFailure);
});

test('accepts only exact immutable results with zero through three canonical mapped references', () => {
  const entry = queryCases[0];
  const validPassages = [
    { passageId: 'h37-text-alternative', score: 0.75 },
    { passageId: 'understanding111-intent', score: 0.5 },
    { passageId: 'wcag22-sc111', score: -0 },
  ];
  for (const passages of [[], validPassages.slice(0, 1), validPassages.slice(0, 2), validPassages]) {
    const input = retrievalResult(entry.expected, passages);
    const before = clone(input);
    const result = validateRetrievalResult(input, entry.finding);
    assert.equal(result.ok, true);
    if (!result.ok) continue;
    assert.deepEqual(result.value, input);
    assert.deepEqual(input, before);
    expectDeepFrozen(result);
    assert.notEqual(result.value, input);
    assert.notEqual(result.value.passages, input.passages);
  }
  const negativeZero = validateRetrievalResult(
    retrievalResult(entry.expected, [{ passageId: 'wcag22-sc111', score: -0 }]), entry.finding,
  );
  assert.equal(negativeZero.ok, true);
  if (negativeZero.ok) assert.equal(Object.is(negativeZero.value.passages[0].score, -0), true);
});

test('accepts only the finite role-selection policy while preserving unmarked historical results', () => {
  const entry = queryCases[0];
  const passages = [
    { passageId: 'h37-text-alternative', score: 0.75 },
    { passageId: 'understanding111-intent', score: 0.5 },
    { passageId: 'wcag22-sc111', score: 0.25 },
  ];
  const historical = retrievalResult(entry.expected, [
    { passageId: 'h37-text-alternative', score: 0.75 },
    { passageId: 'h67-ignored-image', score: 0.5 },
  ]);
  const historicalResult = validateRetrievalResult(historical, entry.finding);
  assert.equal(historicalResult.ok, true);
  if (historicalResult.ok) assert.equal(Object.hasOwn(historicalResult.value, 'selectionPolicy'), false);

  const marked = { ...retrievalResult(entry.expected, passages),
    selectionPolicy: 'highest-per-required-role-v1' };
  const markedResult = validateRetrievalResult(marked, entry.finding);
  assert.equal(markedResult.ok, true);
  if (markedResult.ok) {
    assert.deepEqual(markedResult.value, marked);
    assert.equal(markedResult.value.selectionPolicy, 'highest-per-required-role-v1');
    expectDeepFrozen(markedResult);
  }

  for (const partial of [[], passages.slice(0, 1), passages.slice(0, 2)]) {
    const result = validateRetrievalResult({ ...retrievalResult(entry.expected, partial),
      selectionPolicy: 'highest-per-required-role-v1' }, entry.finding);
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.value.passages, partial);
  }

  for (const policy of [undefined, null, 'global-three-v1', 'highest-per-required-role-v2']) {
    assert.deepEqual(validateRetrievalResult({ ...retrievalResult(entry.expected, passages),
      selectionPolicy: policy }, entry.finding), resultFailure);
  }
  const duplicateRole = { ...retrievalResult(entry.expected, [
    { passageId: 'h37-text-alternative', score: 0.75 },
    { passageId: 'h67-ignored-image', score: 0.5 },
  ]), selectionPolicy: 'highest-per-required-role-v1' };
  assert.deepEqual(validateRetrievalResult(duplicateRole, entry.finding), resultFailure);

  const malformed = [
    { ...marked, extra: true },
    { ...marked, passages: marked.passages.map((passage, index) => index === 0
      ? { ...passage, extra: true } : passage) },
    { ...marked, passages: marked.passages.map((passage, index) => index === 0
      ? { ...passage, score: Number.NaN } : passage) },
  ];
  for (const input of malformed) assert.deepEqual(validateRetrievalResult(input, entry.finding), resultFailure);
});

test('enforces finite score bounds, descending score order and exact ASCII tie ordering without repair', () => {
  const entry = queryCases[0];
  const accepted = [
    [{ passageId: 'h37-text-alternative', score: 1 + 1e-12 }],
    [{ passageId: 'wcag22-sc111', score: -1 - 1e-12 }],
    [{ passageId: 'wcag22-sc111', score: 0.5000000000000001 }, { passageId: 'h37-text-alternative', score: 0.5 }],
    [{ passageId: 'h37-text-alternative', score: 0.5 }, { passageId: 'understanding111-intent', score: 0.5 }],
  ];
  for (const passages of accepted) {
    const result = validateRetrievalResult(retrievalResult(entry.expected, passages), entry.finding);
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.value.passages.map(item => item.score), passages.map(item => item.score));
  }
  const rejected = [
    [{ passageId: 'h37-text-alternative', score: 1 + 2e-12 }],
    [{ passageId: 'h37-text-alternative', score: -1 - 2e-12 }],
    [{ passageId: 'h37-text-alternative', score: NaN }],
    [{ passageId: 'h37-text-alternative', score: Infinity }],
    [{ passageId: 'wcag22-sc111', score: 0.5 }, { passageId: 'h37-text-alternative', score: 0.5 }],
    [{ passageId: 'wcag22-sc111', score: 0.5 }, { passageId: 'h37-text-alternative', score: 0.6 }],
  ];
  for (const passages of rejected) assert.deepEqual(validateRetrievalResult(retrievalResult(entry.expected, passages), entry.finding), resultFailure);
});

test('rejects wrong identities, mappings, keys, references, duplicates, excess results and query drift', () => {
  const entry = queryCases[0];
  const base: any = retrievalResult(entry.expected, [{ passageId: 'wcag22-sc111', score: 0.5 }]);
  const mutations: ((value: any) => void)[] = [
    x => { x.corpus.version = 'other'; }, x => { x.corpus.manifestSha256 = '0'.repeat(64); },
    x => { x.embedding.tag = 'other'; }, x => { x.embedding.dimensions = 384; },
    x => { x.filter.ruleId = 'label'; }, x => { x.metric = 'dot'; }, x => { x.topK = 4; },
    x => { x.tieBreak = 'locale'; }, x => { x.extra = true; }, x => { delete x.query.text; },
    x => { x.query.condition = 'invented'; }, x => { x.passages[0].passageId = 'unknown'; },
    x => { x.passages[0].passageId = 'wcag22-sc412'; }, x => { x.passages[0].extra = true; },
    x => { x.passages.push({ ...x.passages[0] }); },
    x => { x.passages = ['wcag22-sc111', 'understanding111-intent', 'h37-text-alternative', 'h67-ignored-image'].map((passageId: string) => ({ passageId, score: 0 })); },
  ];
  for (const mutate of mutations) {
    const input = clone(base);
    mutate(input);
    assert.deepEqual(validateRetrievalResult(input, entry.finding), resultFailure);
  }
  for (const key of Object.keys(base.corpus)) {
    const input = clone(base);
    input.corpus[key] = key === 'version' ? 'other' : '0'.repeat(64);
    assert.deepEqual(validateRetrievalResult(input, entry.finding), resultFailure, `corpus.${key}`);
  }
  for (const key of Object.keys(base.embedding)) {
    const input = clone(base);
    input.embedding[key] = typeof input.embedding[key] === 'number' ? input.embedding[key] + 1 : `${input.embedding[key]}-other`;
    assert.deepEqual(validateRetrievalResult(input, entry.finding), resultFailure, `embedding.${key}`);
  }
  for (const key of Object.keys(base.query)) {
    const input = clone(base);
    input.query[key] = `${input.query[key]}-other`;
    assert.deepEqual(validateRetrievalResult(input, entry.finding), resultFailure, `query.${key}`);
  }
  assert.deepEqual(validateRetrievalResult(base, labelFinding()), resultFailure);
});

test('fails closed for malformed containers, accessors, unsupported prototypes and inspection errors', () => {
  const entry = queryCases[0];
  const base: any = retrievalResult(entry.expected);
  const cases: unknown[] = [null, [], Object.assign(Object.create({ inherited: true }), base), { ...base, passages: {} }];
  const accessor = clone(base);
  Object.defineProperty(accessor, 'query', { enumerable: true, get() { throw new Error('SECRET'); } });
  cases.push(accessor, new Proxy(base, { getPrototypeOf() { throw new Error('SECRET'); } }));
  for (const input of cases) {
    assert.doesNotThrow(() => {
      const result = validateRetrievalResult(input, entry.finding);
      assert.deepEqual(result, resultFailure);
      assert.equal(JSON.stringify(result).includes('SECRET'), false);
    });
  }
});
