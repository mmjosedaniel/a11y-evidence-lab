import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { createCorpusDocuments, loadCorpusCatalog } from '../src/server/retrieval/corpus-catalog.ts';
import { EMBEDDING_IDENTITY } from '../src/server/retrieval/embedding-profile.ts';
import { EMBEDDING_INPUT_FIT, prepareEmbeddingInput } from '../src/server/retrieval/embedding-input-fit.ts';
import { RetrievalError } from '../src/server/retrieval/retrieval-error.ts';
import { requestOllama } from '../src/server/retrieval/ollama-http.ts';
import { beginOllamaEmbedding } from '../src/server/retrieval/ollama-embedding.ts';
import { buildVectorCollection, rankCanonicalPassages } from '../src/server/retrieval/retrieval-ranking.ts';
import { createExactRetrieval } from '../src/server/retrieval/exact-retrieval.ts';
import { createFindingQuery } from '../src/server/retrieval/finding-query.ts';
import { validateRetrievalResult } from '../src/server/retrieval/retrieval-contract.ts';
import { expectedEmbeddingIdentity, imageFinding, queryCases } from './helpers/m202-retrieval-fixture.ts';
import {
  DOCUMENT_PREFIX, QUERY_PREFIX, deferred, finiteRows, metadata, nativeRequestHarness,
  requesterHarness, vector,
} from './helpers/m202-embedding-fixture.ts';

const hash = (text: string) => createHash('sha256').update(text).digest('hex').toUpperCase();
const controller = () => new AbortController();

async function catalog() {
  const result = await loadCorpusCatalog();
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error('fixture corpus unavailable');
  return result.value;
}

function expectRetrievalError(code: string, cleanupFailed?: boolean) {
  return (error: unknown) => {
    assert.equal(error instanceof RetrievalError, true);
    if (!(error instanceof RetrievalError)) return false;
    assert.equal(error.code, code);
    assert.equal(error.message, code);
    if (cleanupFailed !== undefined) assert.equal(error.cleanupFailed, cleanupFailed);
    assert.equal('cause' in error, false);
    return true;
  };
}

test('exports one deeply frozen fixed embedding profile identical to the accepted result contract', () => {
  assert.deepEqual(EMBEDDING_IDENTITY, expectedEmbeddingIdentity);
  assert.equal(Object.isFrozen(EMBEDDING_IDENTITY), true);
  assert.equal(JSON.stringify(EMBEDDING_IDENTITY).includes('localhost'), false);
});

test('publishes exactly the accepted 63 immutable kind/hash/R/E rows and formats every canonical input once', async () => {
  assert.deepEqual(EMBEDDING_INPUT_FIT, finiteRows);
  assert.equal(Object.isFrozen(EMBEDDING_INPUT_FIT), true);
  assert.equal(EMBEDDING_INPUT_FIT.length, 63);
  assert.equal(new Set(EMBEDDING_INPUT_FIT.map(row => `${row.kind}:${row.sha256}`)).size, 63);
  assert.equal(Math.max(...EMBEDDING_INPUT_FIT.map(row => row.R)), 548);
  assert.equal(Math.max(...EMBEDDING_INPUT_FIT.map(row => row.E)), 550);
  EMBEDDING_INPUT_FIT.forEach(row => {
    assert.deepEqual(Object.keys(row), ['kind', 'sha256', 'R', 'E']);
    assert.equal(Object.isFrozen(row), true);
    assert.ok(row.R <= 2046 && row.E <= 2048);
  });

  const currentCatalog = await catalog();
  const documents = currentCatalog.passages.map(passage => prepareEmbeddingInput('D', passage.text));
  const queries = queryCases.map(entry => prepareEmbeddingInput('Q', entry.expected.text));
  assert.deepEqual(documents.map(hash), finiteRows.filter(row => row.kind === 'D').map(row => row.sha256));
  assert.deepEqual(queries.map(hash).sort(), finiteRows.filter(row => row.kind === 'Q').map(row => row.sha256).sort());
  documents.forEach((text, index) => assert.equal(text, DOCUMENT_PREFIX + currentCatalog.passages[index].text));
  queries.forEach((text, index) => assert.equal(text, QUERY_PREFIX + queryCases[index].expected.text));
});

test('input admission rejects unknown, changed, kind-mismatched, prefixed and non-string values without repair', async () => {
  const currentCatalog = await catalog();
  const document = currentCatalog.passages[0].text;
  const query = queryCases[0].expected.text;
  for (const [kind, value] of [
    ['D', `${document} `], ['D', query], ['Q', document], ['Q', `${query}\n`],
    ['D', DOCUMENT_PREFIX + document], ['Q', QUERY_PREFIX + query], ['D', null], ['Q', 1],
  ] as const) {
    assert.throws(() => prepareEmbeddingInput(kind, value), expectRetrievalError('input-fit', false));
  }
});

test('RetrievalError exposes only a bounded code, boolean cleanup flag and content-safe message', () => {
  const codes = ['corpus-integrity','missing-prerequisite','model-identity','input-fit','embedding-failed','embedding-response','timeout','shutdown','result-validation'] as const;
  for (const code of codes) {
    const error = new RetrievalError(code, true);
    assert.equal(error.code, code);
    assert.equal(error.cleanupFailed, true);
    assert.equal(error.message, code);
    assert.equal(JSON.stringify(error).includes('secret'), false);
  }
});

test('native transport fixes loopback endpoint, methods, paths, bodies, agent and deadlines for every request kind', async () => {
  const requests = [
    { request: { kind: 'version' as const }, method: 'GET', path: '/api/version', timeout: 10_000, body: '' },
    { request: { kind: 'tags' as const }, method: 'GET', path: '/api/tags', timeout: 10_000, body: '' },
    { request: { kind: 'show' as const }, method: 'POST', path: '/api/show', timeout: 10_000, body: JSON.stringify({ model: 'embeddinggemma:latest', verbose: false }) },
    { request: { kind: 'ps' as const }, method: 'GET', path: '/api/ps', timeout: 10_000, body: '' },
    { request: { kind: 'embed' as const, input: 'admitted input' }, method: 'POST', path: '/api/embed', timeout: 60_000,
      body: JSON.stringify({ model: 'embeddinggemma:latest', input: ['admitted input'], truncate: false, options: { num_ctx: 2048, num_batch: 2048 }, keep_alive: '5m' }) },
  ];
  const harness = nativeRequestHarness(requests.map(() => ({ body: '{"ok":true}' })));
  for (const entry of requests) assert.deepEqual(await requestOllama(entry.request, controller().signal, harness.request as never), { ok: true });
  harness.calls.forEach((call, index) => {
    const expected = requests[index];
    assert.equal(call.options.hostname ?? call.options.host, '127.0.0.1');
    assert.equal(call.options.port, 11434);
    assert.equal(call.options.method, expected.method);
    assert.equal(call.options.path, expected.path);
    assert.equal(call.options.agent, false);
    assert.equal(call.timeout, expected.timeout);
    assert.equal(call.body, expected.body);
    assert.equal('proxy' in call.options || 'redirect' in call.options, false);
  });
});

test('native transport bounds status, UTF-8, JSON, body size, refusal, timeout and caller abort', async () => {
  const invalid = [
    [{ status: 302, body: '{}' }, 'embedding-failed', false],
    [{ status: 500, body: 'SECRET' }, 'embedding-failed', false],
    [{ body: '{' }, 'model-identity', false],
    [{ body: Buffer.from([0xc3, 0x28]) }, 'model-identity', false],
    [{ body: ' '.repeat(1024 * 1024 + 1) }, 'model-identity', false],
    [{ error: Object.assign(new Error('SECRET'), { code: 'ECONNREFUSED' }) }, 'missing-prerequisite', false],
    [{ error: new Error('SECRET') }, 'embedding-failed', false],
    [{ timeout: true }, 'timeout', true],
  ] as const;
  for (const [reply, code, cleanup] of invalid) {
    const harness = nativeRequestHarness([reply]);
    await assert.rejects(requestOllama({ kind: 'tags' }, controller().signal, harness.request as never), expectRetrievalError(code, cleanup));
    assert.equal(harness.calls[0].destroyed, true);
  }
  const malformedEmbed = nativeRequestHarness([{ body: '{' }]);
  await assert.rejects(requestOllama({ kind: 'embed', input: 'x' }, controller().signal, malformedEmbed.request as never), expectRetrievalError('embedding-response', false));

  const abortHarness = nativeRequestHarness([{ hold: true }]);
  const abort = controller();
  const pending = requestOllama({ kind: 'tags' }, abort.signal, abortHarness.request as never);
  await Promise.resolve();
  abort.abort();
  await assert.rejects(pending, expectRetrievalError('shutdown', true));
  assert.equal(abortHarness.calls[0].destroyed, true);
});

test('native transport enforces total metadata and embed deadlines even while a request remains active', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    for (const entry of [
      { request: { kind: 'tags' as const }, deadline: 10_000 },
      { request: { kind: 'embed' as const, input: 'admitted input' }, deadline: 60_000 },
    ]) {
      const harness = nativeRequestHarness([{ hold: true }]);
      const pending = requestOllama(entry.request, controller().signal, harness.request as never);
      let settled = false;
      void pending.then(() => { settled = true; }, () => { settled = true; });
      await Promise.resolve();
      assert.equal(harness.calls.length, 1);
      t.mock.timers.tick(entry.deadline - 1);
      await Promise.resolve();
      assert.equal(settled, false);
      assert.equal(harness.calls[0].destroyed, false);
      t.mock.timers.tick(1);
      await assert.rejects(pending, expectRetrievalError('timeout', true));
      assert.equal(harness.calls[0].destroyed, true);
    }
  } finally {
    t.mock.timers.reset();
  }
});

test('embedding session performs exact loaded admission, singleton inputs and final identity checks', async () => {
  const harness = requesterHarness();
  const session = await beginOllamaEmbedding(controller().signal, harness.request);
  assert.deepEqual(harness.calls.map(call => call.kind), ['version', 'tags', 'show', 'ps']);
  const documentVector = await session.embedDocument((await catalog()).passages[0].text);
  const queryVector = await session.embedQuery(queryCases[0].expected.text);
  assert.equal(documentVector.length, 768);
  assert.equal(queryVector.length, 768);
  assert.ok(harness.calls[4].input?.startsWith(DOCUMENT_PREFIX));
  assert.ok(harness.calls[5].input?.startsWith(QUERY_PREFIX));
  await session.finish();
  assert.deepEqual(harness.calls.map(call => call.kind), ['version','tags','show','ps','embed','embed','tags','show','ps']);
  await assert.rejects(session.embedQuery(queryCases[0].expected.text), expectRetrievalError('embedding-failed'));
});

test('unloaded admission verifies ps immediately after the first necessary real input and never synthesizes a probe', async () => {
  let psCount = 0;
  const harness = requesterHarness(request => {
    if (request.kind === 'version') return metadata.version();
    if (request.kind === 'tags') return metadata.tags();
    if (request.kind === 'show') return metadata.show();
    if (request.kind === 'ps') return metadata.ps(++psCount > 1);
    return metadata.embed();
  });
  const session = await beginOllamaEmbedding(controller().signal, harness.request);
  await session.embedQuery(queryCases[0].expected.text);
  assert.deepEqual(harness.calls.map(call => call.kind), ['version','tags','show','ps','embed','ps']);
  assert.equal(harness.calls.filter(call => call.kind === 'embed').length, 1);
  await session.finish();
});

test('model admission rejects missing, duplicate, aliased, remote, wrong-version and drifting metadata', async () => {
  const mutations: readonly (readonly [(request: {kind:string}, good: unknown) => unknown, string])[] = [
    [(request, good) => request.kind === 'version' ? { version: '0.33.2' } : good, 'model-identity'],
    [(request, good) => request.kind === 'tags' ? { models: [] } : good, 'missing-prerequisite'],
    [(request, good) => request.kind === 'tags' ? { models: [metadata.tags().models[0], metadata.tags().models[0]] } : good, 'model-identity'],
    [(request, good) => request.kind === 'tags' ? { models: [{ ...metadata.tags().models[0], model: 'other' }] } : good, 'model-identity'],
    [(request, good) => request.kind === 'tags' ? { models: [{ ...metadata.tags().models[0], remote_host: 'example.test' }] } : good, 'model-identity'],
    [(request, good) => request.kind === 'tags' ? { models: [{ ...metadata.tags().models[0], remote_model: 1 }] } : good, 'model-identity'],
    [(request, good) => request.kind === 'show' ? { ...metadata.show(), model_info: { ...metadata.show().model_info, 'gemma3.context_length': 4096 } } : good, 'model-identity'],
    [(request, good) => request.kind === 'show' ? { ...metadata.show(), details: { quantization_level: 'Q8_0' } } : good, 'model-identity'],
    [(request, good) => request.kind === 'show' ? { ...metadata.show(), remote_host: [] } : good, 'model-identity'],
    [(request, good) => request.kind === 'ps' ? { models: [{ ...metadata.ps().models[0], digest: '0'.repeat(64) }] } : good, 'model-identity'],
  ];
  for (const [mutate, expectedCode] of mutations) {
    const harness = requesterHarness(request => {
      const good = request.kind === 'version' ? metadata.version() : request.kind === 'tags' ? metadata.tags()
        : request.kind === 'show' ? metadata.show() : metadata.ps();
      return mutate(request, good);
    });
    await assert.rejects(beginOllamaEmbedding(controller().signal, harness.request), expectRetrievalError(expectedCode));
  }
});

test('embedding response rejects wrong model, cardinality, dimensions, norm, numbers, prompt count and remote fields', async () => {
  const invalid = [
    { ...metadata.embed(), model: 'other' },
    { ...metadata.embed(), embeddings: [] },
    { ...metadata.embed(), embeddings: [vector(), vector()] },
    { ...metadata.embed(), embeddings: [[1, 2]] },
    { ...metadata.embed(), embeddings: [Array(768).fill(0)] },
    { ...metadata.embed(), embeddings: [[...vector().slice(0, 767), NaN]] },
    { ...metadata.embed(), prompt_eval_count: -1 },
    { ...metadata.embed(), prompt_eval_count: 1.5 },
    { ...metadata.embed(), remote_model: 'remote' },
  ];
  for (const response of invalid) {
    const harness = requesterHarness(request => request.kind === 'version' ? metadata.version()
      : request.kind === 'tags' ? metadata.tags() : request.kind === 'show' ? metadata.show()
        : request.kind === 'ps' ? metadata.ps() : response);
    const session = await beginOllamaEmbedding(controller().signal, harness.request);
    await assert.rejects(session.embedQuery(queryCases[0].expected.text), expectRetrievalError('embedding-response'));
    await assert.rejects(session.embedQuery(queryCases[1].expected.text), expectRetrievalError('embedding-failed'));
  }
  for (const prompt of [undefined, 0, Number.MAX_SAFE_INTEGER]) {
    const harness = requesterHarness(request => request.kind === 'embed' ? metadata.embed(vector(), prompt) : undefined);
    const session = await beginOllamaEmbedding(controller().signal, async (request, signal) => {
      if (request.kind === 'embed') return harness.request(request, signal);
      return requesterHarness().request(request, signal);
    });
    assert.equal((await session.embedQuery(queryCases[0].expected.text)).length, 768);
  }
});

test('final metadata verification rejects tag, model and loaded-state drift after otherwise valid embeddings', async () => {
  const finals = [
    { kind: 'tags', value: { models: [] }, code: 'missing-prerequisite' },
    { kind: 'show', value: { ...metadata.show(), model_info: { ...metadata.show().model_info, 'gemma3.embedding_length': 384 } }, code: 'model-identity' },
    { kind: 'ps', value: metadata.ps(false), code: 'model-identity' },
    { kind: 'ps', value: { models: [{ ...metadata.ps().models[0], remote_model: 'remote' }] }, code: 'model-identity' },
  ] as const;
  for (const scenario of finals) {
    let final = false;
    const harness = requesterHarness(request => {
      if (request.kind === 'version') return metadata.version();
      if (request.kind === 'tags') {
        if (final && scenario.kind === 'tags') return scenario.value;
        return metadata.tags();
      }
      if (request.kind === 'show') {
        if (final && scenario.kind === 'show') return scenario.value;
        return metadata.show();
      }
      if (request.kind === 'ps') {
        if (final && scenario.kind === 'ps') return scenario.value;
        return metadata.ps();
      }
      return metadata.embed();
    });
    const session = await beginOllamaEmbedding(controller().signal, harness.request);
    await session.embedQuery(queryCases[0].expected.text);
    final = true;
    await assert.rejects(session.finish(), expectRetrievalError(scenario.code));
    await assert.rejects(session.embedQuery(queryCases[1].expected.text), expectRetrievalError('embedding-failed'));
  }
});

test('ranking uses actual supplied-vector MemoryVectorStore, broad rule/SC filter and ASCII ties before top three', async () => {
  const currentCatalog = await catalog();
  const documents = createCorpusDocuments(currentCatalog);
  const vectors = documents.map((document, index) => {
    const eligible = document.metadata.ruleIds[0] === 'image-alt';
    return eligible ? vector(0) : vector((index % 7) + 1);
  }).reverse();
  const shuffledCatalog = { ...currentCatalog, passages: [...currentCatalog.passages].reverse() };
  const store = await buildVectorCollection(shuffledCatalog, vectors);
  assert.equal(store instanceof MemoryVectorStore, true);
  const queryResult = createFindingQuery(imageFinding());
  assert.equal(queryResult.ok, true);
  if (!queryResult.ok) return;
  const ranked = await rankCanonicalPassages(store, currentCatalog, queryResult.value, vector(0));
  assert.deepEqual(ranked.map(item => item.passageId), ['h37-text-alternative','h67-ignored-image','understanding111-decoration']);
  assert.deepEqual(ranked.map(item => item.score), [1, 1, 1]);
  assert.equal(Object.isFrozen(ranked), true);
  ranked.forEach(item => assert.equal(Object.isFrozen(item), true));
});

test('ranking rejects malformed library results instead of repairing unknown, duplicate, stale or non-finite references', async () => {
  const currentCatalog = await catalog();
  const store = await buildVectorCollection(currentCatalog, currentCatalog.passages.map((_, index) => vector(index % 16)));
  const queryResult = createFindingQuery(imageFinding());
  assert.equal(queryResult.ok, true);
  if (!queryResult.ok) return;
  const original = store.similaritySearchVectorWithScore.bind(store);
  const badResults: unknown[][] = [
    [[{ id: 'unknown', pageContent: 'x', metadata: {} }, 1]],
    [[createCorpusDocuments(currentCatalog)[0], NaN]],
    [[createCorpusDocuments(currentCatalog)[0], 1 + 2e-12]],
    [[createCorpusDocuments(currentCatalog)[0], 1], [createCorpusDocuments(currentCatalog)[0], 0.5]],
    [[{ ...createCorpusDocuments(currentCatalog)[0], pageContent: 'changed' }, 1]],
    [[{ ...createCorpusDocuments(currentCatalog)[0], metadata: { ...createCorpusDocuments(currentCatalog)[0].metadata, successCriteria: ['4.1.2'] } }, 1]],
  ];
  for (const result of badResults) {
    store.similaritySearchVectorWithScore = async () => result as never;
    await assert.rejects(rankCanonicalPassages(store, currentCatalog, queryResult.value, vector()), expectRetrievalError('result-validation'));
  }
  store.similaritySearchVectorWithScore = original;
});

test('ranking preserves signed zero and applies ASCII passage ordering to exact zero ties before cutoff', async () => {
  const currentCatalog = await catalog();
  const documents = createCorpusDocuments(currentCatalog).filter(document => document.metadata.ruleIds[0] === 'image-alt');
  const store = await buildVectorCollection(currentCatalog, currentCatalog.passages.map((_, index) => vector(index % 16)));
  const queryResult = createFindingQuery(imageFinding());
  assert.equal(queryResult.ok, true);
  if (!queryResult.ok) return;
  store.similaritySearchVectorWithScore = async () => [
    [documents[4], -0], [documents[3], 0], [documents[2], -0], [documents[1], 0], [documents[0], -0],
  ];
  const result = await rankCanonicalPassages(store, currentCatalog, queryResult.value, vector());
  assert.deepEqual(result.map(item => item.passageId), ['h37-text-alternative','h67-ignored-image','understanding111-decoration']);
  assert.equal(Object.is(result[0].score, 0), true);
  assert.equal(Object.is(result[1].score, -0), true);
});

function executorRequester(options: { failEmbed?: number; driftAtTags?: number; deferVersion?: ReturnType<typeof deferred<unknown>> } = {}) {
  let embedCount = 0;
  let tagCount = 0;
  return requesterHarness(request => {
    if (request.kind === 'version') return options.deferVersion?.promise ?? metadata.version();
    if (request.kind === 'tags') return ++tagCount === options.driftAtTags ? { models: [] } : metadata.tags();
    if (request.kind === 'show') return metadata.show();
    if (request.kind === 'ps') return metadata.ps();
    embedCount += 1;
    if (embedCount === options.failEmbed) throw new RetrievalError('embedding-failed', false);
    return metadata.embed(vector(embedCount <= 16 ? embedCount % 8 : 0));
  });
}

test('exact retrieval is lazy, builds all 16 vectors once, embeds one query per call and returns validated detached immutable top3', async () => {
  let loads = 0;
  const requests = executorRequester();
  const execute = createExactRetrieval({ request: requests.request, loadCatalog: async () => { loads += 1; return loadCorpusCatalog(); } });
  assert.equal(loads, 0);
  assert.equal(requests.calls.length, 0);
  const finding = imageFinding();
  const first = await execute(finding, controller().signal);
  const firstEmbeds = requests.calls.filter(call => call.kind === 'embed');
  assert.equal(firstEmbeds.length, 17);
  assert.equal(firstEmbeds.filter(call => call.input?.startsWith(DOCUMENT_PREFIX)).length, 16);
  assert.equal(firstEmbeds.filter(call => call.input?.startsWith(QUERY_PREFIX)).length, 1);
  assert.equal(validateRetrievalResult(first, finding).ok, true);
  assert.equal(first.passages.length, 3);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.passages), true);
  const copy = structuredClone(first);
  const second = await execute(finding, controller().signal);
  assert.deepEqual(first, copy);
  assert.equal(loads, 2);
  assert.equal(requests.calls.filter(call => call.kind === 'embed').length, 18);
  assert.notEqual(second, first);
  assert.notEqual(second.passages, first.passages);
});

test('invalid Finding and fresh corpus failure stop before metadata; material corpus drift invalidates a prior collection', async () => {
  const requests = executorRequester();
  let mode: 'valid' | 'failed' | 'changed' = 'valid';
  const execute = createExactRetrieval({
    request: requests.request,
    loadCatalog: async () => {
      const loaded = await loadCorpusCatalog();
      if (mode === 'failed') return { ok: false as const, error: 'corpus-integrity' as const };
      if (mode === 'changed' && loaded.ok) {
        const passages = loaded.value.passages.map((passage, index) => index === 0 ? { ...passage, text: `${passage.text} changed` } : passage);
        return { ok: true as const, value: { ...loaded.value, passages } };
      }
      return loaded;
    },
  });
  await assert.rejects(execute({ ruleId: 'image-alt' }, controller().signal), expectRetrievalError('result-validation'));
  assert.equal(requests.calls.length, 0);
  mode = 'failed';
  await assert.rejects(execute(imageFinding(), controller().signal), expectRetrievalError('corpus-integrity'));
  assert.equal(requests.calls.length, 0);
  mode = 'valid';
  await execute(imageFinding(), controller().signal);
  mode = 'changed';
  await assert.rejects(execute(imageFinding(), controller().signal), expectRetrievalError('corpus-integrity'));
  mode = 'valid';
  const before = requests.calls.length;
  await execute(imageFinding(), controller().signal);
  assert.equal(requests.calls.slice(before).filter(call => call.kind === 'embed' && call.input?.startsWith(DOCUMENT_PREFIX)).length, 16);
});

test('an unloaded compatible cache hit embeds only its real query, verifies ps immediately, and restart rebuilds', async () => {
  let operation = 0;
  let psWithinSecond = 0;
  const requests = requesterHarness(request => {
    if (request.kind === 'version') { operation += 1; return metadata.version(); }
    if (request.kind === 'tags') return metadata.tags();
    if (request.kind === 'show') return metadata.show();
    if (request.kind === 'ps') {
      if (operation === 2 && ++psWithinSecond === 1) return metadata.ps(false);
      return metadata.ps();
    }
    return metadata.embed(vector(request.input?.startsWith(QUERY_PREFIX) ? 0 : 1));
  });
  const execute = createExactRetrieval({ request: requests.request, loadCatalog: loadCorpusCatalog });
  await execute(imageFinding(), controller().signal);
  const beforeHit = requests.calls.length;
  await execute(imageFinding(), controller().signal);
  const hitCalls = requests.calls.slice(beforeHit);
  assert.deepEqual(hitCalls.filter(call => call.kind === 'embed').map(call => call.input?.startsWith(QUERY_PREFIX)), [true]);
  assert.deepEqual(hitCalls.map(call => call.kind).slice(0, 6), ['version','tags','show','ps','embed','ps']);

  const restartedRequests = executorRequester();
  const restarted = createExactRetrieval({ request: restartedRequests.request, loadCatalog: loadCorpusCatalog });
  await restarted(imageFinding(), controller().signal);
  assert.equal(restartedRequests.calls.filter(call => call.kind === 'embed' && call.input?.startsWith(DOCUMENT_PREFIX)).length, 16);
});

test('failed document build publishes no partial collection and the next call rebuilds all documents', async () => {
  const firstRequests = executorRequester({ failEmbed: 5 });
  const execute = createExactRetrieval({ request: firstRequests.request, loadCatalog: loadCorpusCatalog });
  await assert.rejects(execute(imageFinding(), controller().signal), expectRetrievalError('embedding-failed'));
  assert.equal(firstRequests.calls.filter(call => call.kind === 'embed').length, 5);
  const before = firstRequests.calls.length;
  await execute(imageFinding(), controller().signal);
  const retry = firstRequests.calls.slice(before).filter(call => call.kind === 'embed');
  assert.equal(retry.filter(call => call.input?.startsWith(DOCUMENT_PREFIX)).length, 16);
  assert.equal(retry.filter(call => call.input?.startsWith(QUERY_PREFIX)).length, 1);
});

test('clean query failure retains a verified collection, while identity drift discards it before later reuse', async () => {
  const clean = executorRequester({ failEmbed: 18 });
  const executeClean = createExactRetrieval({ request: clean.request, loadCatalog: loadCorpusCatalog });
  await executeClean(imageFinding(), controller().signal);
  await assert.rejects(executeClean(imageFinding(), controller().signal), expectRetrievalError('embedding-failed'));
  const beforeCleanRetry = clean.calls.length;
  await executeClean(imageFinding(), controller().signal);
  assert.equal(clean.calls.slice(beforeCleanRetry).filter(call => call.kind === 'embed' && call.input?.startsWith(DOCUMENT_PREFIX)).length, 0);

  const drift = executorRequester({ driftAtTags: 3 });
  const executeDrift = createExactRetrieval({ request: drift.request, loadCatalog: loadCorpusCatalog });
  await executeDrift(imageFinding(), controller().signal);
  await assert.rejects(executeDrift(imageFinding(), controller().signal), expectRetrievalError('missing-prerequisite'));
  const beforeDriftRetry = drift.calls.length;
  await executeDrift(imageFinding(), controller().signal);
  assert.equal(drift.calls.slice(beforeDriftRetry).filter(call => call.kind === 'embed' && call.input?.startsWith(DOCUMENT_PREFIX)).length, 16);
});

test('pre-abort and overlap fail before effects; caller abort fences a pending collaborator and closes after uncertain cleanup', async () => {
  const pre = controller();
  pre.abort();
  let loads = 0;
  const unused = executorRequester();
  const executePre = createExactRetrieval({ request: unused.request, loadCatalog: async () => { loads += 1; return loadCorpusCatalog(); } });
  await assert.rejects(executePre(imageFinding(), pre.signal), expectRetrievalError('shutdown', false));
  assert.equal(loads, 0);
  assert.equal(unused.calls.length, 0);

  const gate = deferred<unknown>();
  const pendingRequests = executorRequester({ deferVersion: gate });
  const execute = createExactRetrieval({ request: pendingRequests.request, loadCatalog: loadCorpusCatalog });
  const abort = controller();
  const first = execute(imageFinding(), abort.signal);
  while (pendingRequests.calls.length === 0) await new Promise<void>(resolve => setImmediate(resolve));
  await assert.rejects(execute(imageFinding(), controller().signal), expectRetrievalError('embedding-failed', false));
  abort.abort();
  await assert.rejects(first, expectRetrievalError('shutdown'));
  gate.resolve(metadata.version());
  await Promise.resolve();
  await assert.rejects(execute(imageFinding(), controller().signal));
});

test('abort during the pending final identity check prevents late result/cache publication', async () => {
  const finalGate = deferred<unknown>();
  let tagCount = 0;
  const requests = requesterHarness(request => {
    if (request.kind === 'version') return metadata.version();
    if (request.kind === 'tags') return ++tagCount === 2 ? finalGate.promise : metadata.tags();
    if (request.kind === 'show') return metadata.show();
    if (request.kind === 'ps') return metadata.ps();
    return metadata.embed(vector(request.input?.startsWith(QUERY_PREFIX) ? 0 : 1));
  });
  const execute = createExactRetrieval({ request: requests.request, loadCatalog: loadCorpusCatalog });
  const abort = controller();
  const pending = execute(imageFinding(), abort.signal);
  while (tagCount < 2) await new Promise<void>(resolve => setImmediate(resolve));
  abort.abort();
  await assert.rejects(pending, expectRetrievalError('shutdown'));
  finalGate.resolve(metadata.tags());
  await new Promise<void>(resolve => setImmediate(resolve));
  const embeds = requests.calls.filter(call => call.kind === 'embed').length;
  assert.equal(embeds, 17);
  await assert.rejects(execute(imageFinding(), controller().signal));
  assert.equal(requests.calls.filter(call => call.kind === 'embed').length, embeds);
});

test('wrong-model cache-hit response invalidates document vectors before the next explicit retrieval', async () => {
  let operation = 0;
  const requests = requesterHarness(request => {
    if (request.kind === 'version') { operation += 1; return metadata.version(); }
    if (request.kind === 'tags') return metadata.tags();
    if (request.kind === 'show') return metadata.show();
    if (request.kind === 'ps') return metadata.ps();
    return operation === 2 ? { ...metadata.embed(), model: 'wrong-model' } : metadata.embed();
  });
  const execute = createExactRetrieval({ request: requests.request, loadCatalog: loadCorpusCatalog });
  await execute(imageFinding(), controller().signal);
  await assert.rejects(execute(imageFinding(), controller().signal), expectRetrievalError('embedding-response'));
  const before = requests.calls.length;
  await execute(imageFinding(), controller().signal);
  const posts = requests.calls.slice(before).filter(request => request.kind === 'embed');
  assert.equal(posts.filter(request => request.input?.startsWith(DOCUMENT_PREFIX)).length, 16);
  assert.equal(posts.filter(request => request.input?.startsWith(QUERY_PREFIX)).length, 1);
});

test('canonical ranking rejects additional keys, accessors, prototypes and extended metadata arrays', async () => {
  const currentCatalog = await catalog();
  const store = await buildVectorCollection(currentCatalog, currentCatalog.passages.map(() => vector()));
  const queryResult = createFindingQuery(imageFinding());
  assert.equal(queryResult.ok, true);
  if (!queryResult.ok) throw new Error('fixture query unavailable');
  const document = createCorpusDocuments(currentCatalog)[0];
  let getters = 0;
  const accessor = Object.defineProperty({ ...document.metadata }, 'heading', {
    enumerable: true, get: () => { getters += 1; return document.metadata.heading; },
  });
  const invalidMetadata = [
    { ...document.metadata, extra: 'unexpected' },
    { ...document.metadata, [Symbol('extra')]: 'unexpected' },
    accessor,
    Object.create(document.metadata),
    { ...document.metadata, ruleIds: Object.assign([...document.metadata.ruleIds], { extra: 'unexpected' }) },
    { ...document.metadata, successCriteria: Object.assign([...document.metadata.successCriteria], { [Symbol('extra')]: true }) },
  ];
  const original = store.similaritySearchVectorWithScore;
  try {
    for (const candidate of invalidMetadata) {
      store.similaritySearchVectorWithScore = async () => [[{ ...document, metadata: candidate }, 1]] as never;
      await assert.rejects(rankCanonicalPassages(store, currentCatalog, queryResult.value, vector()), expectRetrievalError('result-validation'));
    }
    assert.equal(getters, 0);
  } finally {
    store.similaritySearchVectorWithScore = original;
  }
});

test('session reserves one embedding method and rejects overlap before dispatch without failing admitted work', async () => {
  const gate = deferred<unknown>();
  let psCount = 0;
  let embedCount = 0;
  const requests = requesterHarness(request => {
    if (request.kind === 'version') return metadata.version();
    if (request.kind === 'tags') return metadata.tags();
    if (request.kind === 'show') return metadata.show();
    if (request.kind === 'ps') return metadata.ps(++psCount > 1);
    return ++embedCount === 1 ? gate.promise : { ...metadata.embed(), model: 'wrong-model' };
  });
  const session = await beginOllamaEmbedding(controller().signal, requests.request);
  const pending = session.embedQuery(queryCases[0].expected.text);
  void pending.catch(() => undefined);
  try {
    await assert.rejects(session.embedQuery(queryCases[1].expected.text), expectRetrievalError('embedding-failed', false));
    assert.equal(embedCount, 1);
  } finally {
    gate.resolve(metadata.embed());
  }
  assert.equal((await pending).length, 768);
  assert.deepEqual(requests.calls.map(request => request.kind), ['version','tags','show','ps','embed','ps']);
  await session.finish();
});

test('session rejects overlapping finish before metadata and permits finish after admitted embedding settles', async () => {
  const gate = deferred<unknown>();
  const requests = requesterHarness(request => request.kind === 'version' ? metadata.version()
    : request.kind === 'tags' ? metadata.tags() : request.kind === 'show' ? metadata.show()
      : request.kind === 'ps' ? metadata.ps() : gate.promise);
  const session = await beginOllamaEmbedding(controller().signal, requests.request);
  const pending = session.embedQuery(queryCases[0].expected.text);
  void pending.catch(() => undefined);
  const beforeFinish = requests.calls.length;
  try {
    await assert.rejects(session.finish(), expectRetrievalError('embedding-failed', false));
    assert.equal(requests.calls.length, beforeFinish);
  } finally {
    gate.resolve(metadata.embed());
  }
  assert.equal((await pending).length, 768);
  await session.finish();
  const finishedCalls = requests.calls.length;
  await assert.rejects(session.embedQuery(queryCases[1].expected.text), expectRetrievalError('embedding-failed'));
  assert.equal(requests.calls.length, finishedCalls);
});

test('every consumed model alias must agree during admission and final tags or ps verification', async () => {
  for (const kind of ['tags', 'ps'] as const) {
    for (const phase of ['admission', 'final'] as const) {
      let final = false;
      const requests = requesterHarness(request => {
        if (request.kind === 'version') return metadata.version();
        if (request.kind === 'show') return metadata.show();
        if (request.kind === 'embed') return metadata.embed();
        const good = request.kind === 'tags' ? metadata.tags() : metadata.ps();
        if (request.kind === kind && (phase === 'admission' || final)) {
          return { models: [...good.models, { name: 'other:latest', model: 'conflicting:latest', digest: 'a'.repeat(64) }] };
        }
        return good;
      });
      if (phase === 'admission') {
        await assert.rejects(beginOllamaEmbedding(controller().signal, requests.request), expectRetrievalError('model-identity'));
      } else {
        const session = await beginOllamaEmbedding(controller().signal, requests.request);
        await session.embedQuery(queryCases[0].expected.text);
        final = true;
        await assert.rejects(session.finish(), expectRetrievalError('model-identity'));
      }
    }
  }
});

test('whole-call deadline settles without waiting for late success or rejection and consumes both late outcomes', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    for (const late of ['resolve', 'reject'] as const) {
      const gate = deferred<unknown>();
      const requests = executorRequester({ deferVersion: gate });
      const execute = createExactRetrieval({ request: requests.request, loadCatalog: loadCorpusCatalog });
      const pending = execute(imageFinding(), controller().signal);
      while (requests.calls.length === 0) await new Promise<void>(resolve => setImmediate(resolve));
      t.mock.timers.tick(300_000);
      await assert.rejects(pending, expectRetrievalError('timeout', true));
      const callsAtTimeout = requests.calls.length;
      if (late === 'resolve') gate.resolve(metadata.version()); else gate.reject(new Error('SECRET LATE FAILURE'));
      await new Promise<void>(resolve => setImmediate(resolve));
      assert.equal(requests.calls.length, callsAtTimeout);
      await assert.rejects(execute(imageFinding(), controller().signal), expectRetrievalError('embedding-failed'));
      assert.equal(requests.calls.length, callsAtTimeout);
    }
  } finally {
    t.mock.timers.reset();
  }
});
