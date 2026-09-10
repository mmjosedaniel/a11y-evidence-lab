import assert from 'node:assert/strict';
import test from 'node:test';
import { executeGeneration } from '../src/server/generation/generation-stage.ts';
import { createOllamaGenerationAdapter } from '../src/server/generation/ollama-generation.ts';
import { QWEN_CONFIGURATION } from '../src/server/generation/ollama-generation-model.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import {
  generationRequest,
  manuallySettledNativeHarness,
  nativeHarness,
  ollamaChatBody,
  validMetadata,
} from './helpers/m303-ollama-fixture.ts';

const serial = { concurrency: false };
const localContext = Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' } as const);
const groqContext = Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' } as const);
const analysisStartedAt = '2026-09-09T12:00:00.000Z';
const analysisFinishedAt = '2026-09-09T12:00:01.000Z';
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;

async function waitUntil(predicate: () => boolean, message: string): Promise<void> {
  const expires = performance.now() + 2000;
  while (performance.now() < expires) {
    if (predicate()) return;
    await new Promise<void>(resolve => nativeSetTimeout(resolve, 5));
  }
  assert.fail(message);
}

function replies(candidate: unknown) {
  const metadata = validMetadata();
  return [
    { body: JSON.stringify(metadata.version) },
    { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) },
    { body: ollamaChatBody(candidate) },
  ] as const;
}

async function prepare(adapter: ReturnType<typeof createOllamaGenerationAdapter>, request = generationRequest('system', 'user'), signal = new AbortController().signal) {
  return await adapter.prepare(request, signal) as Record<string, unknown>;
}

async function execute(adapter: ReturnType<typeof createOllamaGenerationAdapter>, signal = new AbortController().signal,
  mode: 'local' | 'groq' = 'local', fixture = generationFixture()) {
  return executeGeneration({
    finding: fixture.finding,
    retrieval: fixture.retrieval,
    analysisStartedAt,
    analysisFinishedAt,
    providerContext: mode === 'local' ? localContext : groqContext,
    adapter,
    signal,
  });
}

test('factory is frozen, stable, and performs no native I/O during import or construction', serial, () => {
  const native = nativeHarness([]);
  const adapter = createOllamaGenerationAdapter(native.request);
  assert.equal(Object.isFrozen(adapter), true);
  assert.deepEqual(Object.keys(adapter).sort(), ['configuration', 'prepare']);
  assert.strictEqual(adapter.configuration, QWEN_CONFIGURATION);
  assert.equal(native.calls.length, 0);
});

test('pure request fit rejects before metadata and leaves no provider attempt', serial, async () => {
  const native = nativeHarness([]);
  const adapter = createOllamaGenerationAdapter(native.request);
  const oversized = generationRequest('system', 'x'.repeat(32768));
  assert.deepEqual(await prepare(adapter, oversized), { ok: false, error: 'input-fit', cleanup: 'complete' });
  assert.deepEqual(await prepare(adapter, { ...generationRequest(), configuration: Object.freeze({}) } as never),
    { ok: false, error: 'configuration', cleanup: 'complete' });
  assert.equal(native.calls.length, 0);
});

test('preparation requests version, show, and tags sequentially and captures the admitted body', serial, async () => {
  const native = nativeHarness(replies({ unused: true }));
  const adapter = createOllamaGenerationAdapter(native.request);
  const request = generationRequest('fixed system', 'fixed user');
  const result = await prepare(adapter, request);
  assert.equal(result.ok, true);
  assert.equal(Object.isFrozen(result), true);
  assert.strictEqual(result.request, request);
  assert.strictEqual(result.configuration, QWEN_CONFIGURATION);
  assert.equal(result.cleanup, 'complete');
  assert.equal(typeof result.dispatch, 'function');
  assert.deepEqual(native.calls.map(call => [call.options.method, call.options.path]), [
    ['GET', '/api/version'], ['POST', '/api/show'], ['GET', '/api/tags'],
  ]);
  assert.deepEqual(JSON.parse(native.calls[1]!.body), { model: 'qwen3.5:4b', verbose: false });
  assert.equal(native.calls.some(call => call.options.path === '/api/chat'), false);

  const admittedBody = JSON.stringify({
    model: 'qwen3.5:4b:local',
    messages: [{ role: 'system', content: 'fixed system' }, { role: 'user', content: 'fixed user' }],
    format: request.schema,
    stream: false, think: false, truncate: false, shift: false, keep_alive: '5m',
    options: { num_ctx: 32768, num_predict: 4096, temperature: 0, top_p: 1 },
  });
  const preparedWithDispatch = result as { dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown> };
  const dispatch = await preparedWithDispatch.dispatch(new AbortController().signal, start => start());
  assert.equal((dispatch as { ok: boolean }).ok, true);
  assert.equal(native.calls[3]!.body, admittedBody);
});

test('metadata failure and drift stop before generation with truthful cleanup', serial, async () => {
  const metadata = validMetadata();
  const cases = [
    [[{ requestError: Object.assign(new Error('offline'), { code: 'ECONNREFUSED' }) }], 'missing-prerequisite', 1],
    [[{ body: JSON.stringify(metadata.version) }, { body: JSON.stringify({ ...metadata.show, remote_host: 'remote' }) },
      { body: JSON.stringify(metadata.tags) }], 'configuration', 3],
    [[{ body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
      { body: JSON.stringify({ models: [] }) }], 'missing-prerequisite', 3],
  ] as const;
  for (const [fixtureReplies, error, calls] of cases) {
    const native = nativeHarness(fixtureReplies);
    const result = await prepare(createOllamaGenerationAdapter(native.request));
    assert.equal(result.ok, false);
    assert.equal(result.error, error);
    assert.ok(['complete', 'uncertain'].includes(String(result.cleanup)));
    assert.equal(native.calls.length, calls);
    assert.equal(native.calls.some(call => call.options.path === '/api/chat'), false);
  }
});

test('actual stage uses one captured native chat attempt and validates a proposal', serial, async () => {
  const fixture = generationFixture();
  const native = nativeHarness(replies(fixture.proposal));
  const result = await execute(createOllamaGenerationAdapter(native.request), new AbortController().signal, 'local', fixture);
  assert.equal(result.status, 'proposal');
  if (result.status !== 'proposal') return;
  assert.deepEqual(result.proposal, fixture.proposal);
  assert.deepEqual(result.invocation, {
    adapterId: QWEN_CONFIGURATION.adapterId,
    adapterVersion: QWEN_CONFIGURATION.adapterVersion,
    endpointIdentity: QWEN_CONFIGURATION.endpoint,
    promptVersion: QWEN_CONFIGURATION.promptVersion,
    schemaVersion: QWEN_CONFIGURATION.schemaVersion,
    outputContractVersion: QWEN_CONFIGURATION.outputContractVersion,
    parameters: QWEN_CONFIGURATION.parameters,
    outcome: 'response', validation: 'passed',
  });
  assert.deepEqual(native.calls.map(call => call.options.path), ['/api/version', '/api/show', '/api/tags', '/api/chat']);
  assert.equal(native.calls.filter(call => call.options.path === '/api/chat').length, 1);
});

test('wrong mode and abstention never prepare or dispatch the real adapter', serial, async () => {
  const wrongNative = nativeHarness([]);
  const wrong = await execute(createOllamaGenerationAdapter(wrongNative.request), new AbortController().signal, 'groq');
  assert.equal(wrong.status, 'failed');
  assert.equal(wrongNative.calls.length, 0);

  const abstainedNative = nativeHarness([]);
  const abstained = await execute(createOllamaGenerationAdapter(abstainedNative.request), new AbortController().signal,
    'local', generationFixture('image-alt', { incompleteEvidence: true }));
  assert.equal(abstained.status, 'abstained');
  assert.equal(abstainedNative.calls.length, 0);
});

test('native status, malformed output, and synchronous transport failures retain exact attempt provenance', serial, async () => {
  const fixture = generationFixture();
  const vectors = [
    [{ status: 429, body: '{}' }, 'rate-limit', 'rate-limit'],
    [{ status: 503, body: '{}' }, 'provider', 'provider'],
    [{ body: '{' }, 'response-validation', 'response'],
    [{ body: ollamaChatBody(fixture.proposal, { thinking: 'secret' }) }, 'response-validation', 'response'],
    [{ synchronousError: new Error('SECRET transport') }, 'network', 'network'],
  ] as const;
  for (const [chat, error, outcome] of vectors) {
    const native = nativeHarness([...replies(fixture.proposal).slice(0, 3), chat]);
    const result = await execute(createOllamaGenerationAdapter(native.request), new AbortController().signal, 'local', fixture);
    assert.equal(result.status, 'failed');
    if (result.status !== 'failed') continue;
    assert.equal(result.error, error);
    assert.equal(result.invocation?.outcome, outcome);
    assert.equal(JSON.stringify(result).includes('SECRET'), false);
    assert.equal(native.calls.filter(call => call.options.path === '/api/chat').length, outcome === 'network' ? 0 : 1);
  }
});

test('abort before entry, during metadata, or during active chat prevents late success and preserves call bounds', serial, async () => {
  const before = new AbortController();
  before.abort();
  const preNative = nativeHarness([]);
  const pre = await execute(createOllamaGenerationAdapter(preNative.request), before.signal);
  assert.equal(pre.status, 'failed');
  assert.equal(preNative.calls.length, 0);

  const metadataNative = nativeHarness([{ hold: true }]);
  const metadataController = new AbortController();
  const metadataPending = execute(createOllamaGenerationAdapter(metadataNative.request), metadataController.signal);
  await waitUntil(() => metadataNative.calls.length === 1, 'Metadata request did not become active');
  assert.equal(metadataNative.calls[0]!.options.path, '/api/version');
  metadataController.abort();
  const metadataResult = await metadataPending;
  assert.equal(metadataResult.status, 'failed');
  if (metadataResult.status === 'failed') {
    assert.equal(metadataResult.error, 'shutdown');
    assert.equal(metadataResult.cleanupFailed, true);
  }
  assert.equal(metadataNative.calls.some(call => call.options.path === '/api/chat'), false);

  const metadata = validMetadata();
  const activeNative = nativeHarness([
    { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, { hold: true },
  ]);
  const activeController = new AbortController();
  const pending = execute(createOllamaGenerationAdapter(activeNative.request), activeController.signal);
  await waitUntil(() => activeNative.calls.some(call => call.options.path === '/api/chat'), 'Chat request did not become active');
  activeController.abort();
  const active = await pending;
  assert.equal(active.status, 'failed');
  if (active.status === 'failed') assert.equal(active.error, 'shutdown');
  assert.equal(activeNative.calls.filter(call => call.options.path === '/api/chat').length, 1);
});

test('shared stage deadline includes unresolved metadata and starts no chat', serial, async t => {
  const native = nativeHarness([{ hold: true }]);
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const pending = execute(createOllamaGenerationAdapter(native.request));
    await waitUntil(() => native.calls.length === 1, 'Metadata request did not become active before deadline');
    assert.equal(native.calls[0]!.options.path, '/api/version');
    t.mock.timers.tick(120000);
    const result = await Promise.race([pending, new Promise<never>((_, reject) => {
      watchdog = nativeSetTimeout(() => reject(new Error('deadline did not settle')), 2000);
    })]);
    assert.equal(result.status, 'failed');
    if (result.status === 'failed') assert.equal(result.error, 'timeout');
    assert.equal(native.calls.some(call => call.options.path === '/api/chat'), false);
  } finally {
    if (watchdog !== undefined) nativeClearTimeout(watchdog);
    t.mock.timers.reset();
  }
});

test('prepared dispatch is inert until called and cannot bypass a one-use stage capability', serial, async () => {
  const fixture = generationFixture();
  const native = nativeHarness(replies(fixture.proposal));
  const adapter = createOllamaGenerationAdapter(native.request);
  const prepared = await prepare(adapter) as { ok: true; dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown> };
  assert.equal(prepared.ok, true);
  assert.equal(native.calls.length, 3);
  let capabilityUses = 0;
  const result = await prepared.dispatch(new AbortController().signal, start => {
    capabilityUses++;
    assert.equal(capabilityUses, 1);
    return start();
  });
  assert.equal((result as { ok: boolean }).ok, true);
  assert.equal(native.calls.filter(call => call.options.path === '/api/chat').length, 1);
  const duplicate = await prepared.dispatch(new AbortController().signal, start => {
    capabilityUses++;
    if (capabilityUses > 1) throw new Error('stage capability already consumed');
    return start();
  });
  assert.equal((duplicate as { ok: boolean }).ok, false);
  assert.equal(native.calls.filter(call => call.options.path === '/api/chat').length, 1);
});
