import assert from 'node:assert/strict';
import test from 'node:test';
import { GENERATION_INSTRUCTIONS, GENERATION_SCHEMA, LOCAL_PARAMETERS } from '../src/server/generation/generation-artifacts.ts';
import type { AttemptTransport, GenerationConfiguration, GenerationRequest, PreparedGeneration } from '../src/server/generation/generation-contract.ts';
import { buildGenerationInput, createGenerationRequest } from '../src/server/generation/generation-input.ts';
import { QWEN_CONFIGURATION, validateOllamaGenerationMetadata } from '../src/server/generation/ollama-generation-model.ts';
import { prepareOllamaGenerationWire } from '../src/server/generation/ollama-generation-fit.ts';
import { dispatchOllamaGeneration, requestOllamaGenerationMetadata } from '../src/server/generation/ollama-generation-http.ts';
import { createOllamaGenerationAdapter } from '../src/server/generation/ollama-generation.ts';
import { readCorpusBytes } from '../src/server/retrieval/corpus-catalog.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import { generationRequest, manuallySettledNativeHarness, nativeHarness, ollamaChatBody, QWEN_DIGEST, validMetadata } from './helpers/m303-ollama-fixture.ts';

function expectDeepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

function cloneRequest(request = generationRequest()): GenerationRequest {
  return { ...request, messages: request.messages.map(message => ({ ...message })) };
}

function mutateMetadata(action: (metadata: ReturnType<typeof validMetadata>) => void) {
  const value = validMetadata();
  action(value);
  return value;
}

function attemptCounter() {
  let count = 0;
  const attempt: AttemptTransport = start => { count++; return start(); };
  return { attempt, count: () => count };
}

test('publishes the one exact deeply frozen Local generation configuration', () => {
  assert.deepEqual(QWEN_CONFIGURATION, {
    providerContext: { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' },
    adapterId: 'ollama-generation', adapterVersion: 'm303-ollama-chat-v1', endpoint: 'ollama-loopback-chat',
    promptVersion: 'm302-instructions-v2', schemaVersion: 'm302-schema-v1', outputContractVersion: 'm301-proposal-v1',
    parameters: LOCAL_PARAMETERS,
    binding: {
      kind: 'local', runtimeVersion: '0.33.3', modelDigest: QWEN_DIGEST,
      tokenizerIdentity: 'sha256:bc26cd0f6499d5bd69f5f7d1baab46718c56a8d443328edf1de7e58710a8b2f6',
      templateIdentity: 'ollama-qwen35-renderer-v0.33.3', parserIdentity: 'ollama-qwen35-parser-v0.33.3',
      effectiveConfigurationIdentity: 'm303-qwen35-32768-v1',
    },
    accounting: {
      method: 'verified-upper-bound', implementationVersion: 'm303-qwen35-utf8-bound-v1',
      tokenizerIdentity: 'sha256:bc26cd0f6499d5bd69f5f7d1baab46718c56a8d443328edf1de7e58710a8b2f6',
      contextTokenLimit: 32768, outputTokenLimit: 4096,
    },
  });
  expectDeepFrozen(QWEN_CONFIGURATION);
});

test('admits only the exact current version, show profile and unique pinned tag', () => {
  assert.equal(validateOllamaGenerationMetadata(validMetadata()), null);
  const withAbsentBos = validMetadata();
  delete (withAbsentBos.show.model_info as Record<string, unknown>)['tokenizer.ggml.add_bos_token'];
  assert.equal(validateOllamaGenerationMetadata(withAbsentBos), null);

  const missing = mutateMetadata(value => { value.tags.models = []; });
  assert.equal(validateOllamaGenerationMetadata(missing), 'missing-prerequisite');
  const otherModel = mutateMetadata(value => { value.tags.models = [{
    ...value.tags.models[0], name: 'other:latest', model: 'other:latest', digest: '1'.repeat(64),
  }]; });
  assert.equal(validateOllamaGenerationMetadata(otherModel), 'missing-prerequisite');

  const drifts = [
    mutateMetadata(value => { value.version.version = '0.33.4'; }),
    mutateMetadata(value => { value.tags.models.push(structuredClone(value.tags.models[0])); }),
    mutateMetadata(value => { value.tags.models[0].digest = '0'.repeat(64); }),
    mutateMetadata(value => { value.tags.models[0].remote_host = 'remote.example'; }),
    mutateMetadata(value => { value.tags.models[0].details.format = 'safetensors'; }),
    mutateMetadata(value => { value.tags.models[0].details.family = 'qwen2'; }),
    mutateMetadata(value => { value.show.details.quantization_level = 'Q8_0'; }),
    mutateMetadata(value => { value.show.details.format = 'safetensors'; }),
    mutateMetadata(value => { value.show.details.family = 'qwen2'; }),
    mutateMetadata(value => { value.show.details.parent_model = 'parent:latest'; }),
    mutateMetadata(value => { value.show.template = '{{ .Messages }}'; }),
    mutateMetadata(value => { value.show.capabilities = ['vision']; }),
    mutateMetadata(value => { value.show.model_info['general.architecture'] = 'qwen2'; }),
    mutateMetadata(value => { value.show.model_info['qwen35.context_length'] = 32768; }),
    mutateMetadata(value => { value.show.model_info['tokenizer.ggml.model'] = 'sentencepiece'; }),
    mutateMetadata(value => { value.show.model_info['tokenizer.ggml.pre'] = 'qwen2'; }),
    mutateMetadata(value => { value.show.model_info['tokenizer.ggml.add_eos_token'] = true; }),
    mutateMetadata(value => { value.show.model_info['tokenizer.ggml.add_padding_token'] = true; }),
    mutateMetadata(value => { value.show.model_info['tokenizer.ggml.add_bos_token'] = true; }),
    mutateMetadata(value => { value.show.parameters += '\nseed 1'; }),
    mutateMetadata(value => { value.show.parameters += '\ntemperature 1'; }),
  ];
  for (const metadata of drifts) assert.equal(validateOllamaGenerationMetadata(metadata), 'configuration');
});

test('rejects malformed metadata as own data without invoking accessors or coercion', () => {
  let accessed = false;
  const accessor = validMetadata() as unknown as Record<string, unknown>;
  Object.defineProperty(accessor, 'version', { enumerable: true, get() { accessed = true; return { version: '0.33.3' }; } });
  assert.equal(validateOllamaGenerationMetadata(accessor as never), 'configuration');
  assert.equal(accessed, false);
  const nested = validMetadata();
  Object.defineProperty(nested.show, 'details', { enumerable: true, get() { accessed = true; return {}; } });
  assert.equal(validateOllamaGenerationMetadata(nested), 'configuration');
  assert.equal(accessed, false);
  for (const candidate of [null, {}, [], { ...validMetadata(), extra: true }]) {
    assert.equal(validateOllamaGenerationMetadata(candidate as never), 'configuration');
  }
});

test('serializes the exact immutable Ollama body and complete UTF-8 upper-bound fit', () => {
  const request = generationRequest('system 😀 e\u0301 <|im_start|>', 'user\n\t"\\');
  const result = prepareOllamaGenerationWire(request);
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error('Expected admitted wire');
  const schemaBytes = Buffer.byteLength(JSON.stringify(GENERATION_SCHEMA), 'utf8');
  const expectedInput = Buffer.byteLength(request.messages[0].content, 'utf8')
    + Buffer.byteLength(request.messages[1].content, 'utf8') + 99 + schemaBytes;
  assert.deepEqual(result.fit, {
    accounting: QWEN_CONFIGURATION.accounting, inputTokens: expectedInput, reservedOutputTokens: 4096,
    contextTokenLimit: 32768, outputTokenLimit: 4096,
  });
  assert.equal(result.fit.accounting, QWEN_CONFIGURATION.accounting);
  assert.deepEqual(JSON.parse(result.body), {
    model: 'qwen3.5:4b:local', messages: request.messages, format: GENERATION_SCHEMA,
    stream: false, think: false, truncate: false, shift: false, keep_alive: '5m',
    options: { num_ctx: 32768, num_predict: 4096, temperature: 0, top_p: 1 },
  });
  assert.equal(result.body.includes('responses'), false);
  assert.equal(result.body.includes('configuration'), false);
  expectDeepFrozen(result);
});

test('accounts for the complete shared-builder instructions, Finding, passages, notices and schema', async () => {
  const fixture = generationFixture();
  const [manifestBytes, passageBytes] = await readCorpusBytes();
  const built = buildGenerationInput({
    finding: fixture.finding, retrieval: fixture.retrieval,
    analysisStartedAt: '2026-09-09T12:00:00.000Z', analysisFinishedAt: '2026-09-09T12:00:01.000Z',
    manifestBytes, passageBytes,
  });
  assert.equal(built.status, 'ready');
  if (built.status !== 'ready') throw new Error('Expected authenticated supported generation input');
  const request = createGenerationRequest(built.input, QWEN_CONFIGURATION.providerContext, QWEN_CONFIGURATION);
  assert.equal(request.messages[0].content, GENERATION_INSTRUCTIONS);
  const serializedInput = JSON.parse(request.messages[1].content) as Record<string, unknown>;
  const guidance = serializedInput.guidance as Record<string, unknown>;
  assert.ok(Array.isArray(guidance.passages) && guidance.passages.length > 0);
  const notices = guidance.notices as Record<string, unknown>;
  assert.ok(Array.isArray(notices.sources) && notices.sources.length > 0);
  assert.ok(Array.isArray(notices.texts) && notices.texts.length > 0);
  const expectedInput = request.messages.reduce((sum, message) => sum + Buffer.byteLength(message.content, 'utf8'), 0)
    + 99 + Buffer.byteLength(JSON.stringify(GENERATION_SCHEMA), 'utf8');
  const result = prepareOllamaGenerationWire(request);
  assert.equal(result.ok, expectedInput + 4096 <= 32768);
  if (result.ok) assert.equal(result.fit.inputTokens, expectedInput);
  else assert.equal(result.error, 'input-fit');
});

test('counts empty, whitespace, multilingual, non-BMP, combining, control and special-token text independently', () => {
  for (const [system, user] of [
    ['', ''], ['  \n\t', '\r\n'], ['Español 中文 العربية', '😀 e\u0301'],
    ['<|im_start|><|im_end|>', 'quote " slash \\ nul \u0000'],
  ]) {
    const request = generationRequest(system, user);
    const result = prepareOllamaGenerationWire(request);
    assert.equal(result.ok, true);
    if (!result.ok) continue;
    assert.equal(result.fit.inputTokens, Buffer.byteLength(system, 'utf8') + Buffer.byteLength(user, 'utf8')
      + 99 + Buffer.byteLength(JSON.stringify(GENERATION_SCHEMA), 'utf8'));
  }
});

test('accepts the exact fit maximum and rejects one UTF-8 byte over without truncation', () => {
  const fixed = 99 + Buffer.byteLength(JSON.stringify(GENERATION_SCHEMA), 'utf8');
  const maximum = generationRequest('', 'x'.repeat(32768 - 4096 - fixed));
  const admitted = prepareOllamaGenerationWire(maximum);
  assert.equal(admitted.ok, true);
  if (admitted.ok) assert.equal(admitted.fit.inputTokens + admitted.fit.reservedOutputTokens, 32768);
  assert.deepEqual(prepareOllamaGenerationWire(generationRequest('', `${maximum.messages[1].content}x`)),
    Object.freeze({ ok: false, error: 'input-fit' }));
});

test('fails closed on request identity, versions, controls, schema, domain and Unicode substitution', () => {
  const base = generationRequest('system', 'user');
  const configuration = structuredClone(QWEN_CONFIGURATION) as GenerationConfiguration;
  const cases: GenerationRequest[] = [
    { ...cloneRequest(base), configuration },
    { ...cloneRequest(base), promptVersion: 'm302-instructions-v1' as never },
    { ...cloneRequest(base), schemaVersion: 'changed' as never },
    { ...cloneRequest(base), outputContractVersion: 'changed' as never },
    { ...cloneRequest(base), controls: { ...LOCAL_PARAMETERS, temperature: 1 } as never },
    { ...cloneRequest(base), deadlineMs: 119999 as never },
    { ...cloneRequest(base), schema: structuredClone(GENERATION_SCHEMA) },
    { ...cloneRequest(base), messages: [{ role: 'user', content: 'user' }, { role: 'system', content: 'system' }] },
    { ...cloneRequest(base), messages: [...base.messages, { role: 'user', content: 'extra' }] },
    { ...cloneRequest(base), messages: [{ role: 'system', content: 'system', tools: [] } as never, base.messages[1]] },
    { ...cloneRequest(base), messages: [base.messages[0], { role: 'user', content: 'user', images: [] } as never] },
    { ...cloneRequest(base), messages: Array(2) as never },
    generationRequest('\ud800', 'user'), generationRequest('\udc00', 'user'),
  ];
  for (const request of cases) assert.equal(prepareOllamaGenerationWire(request).ok, false);
  assert.deepEqual(prepareOllamaGenerationWire(cases[0]), Object.freeze({ ok: false, error: 'configuration' }));
  assert.deepEqual(prepareOllamaGenerationWire(cases[1]), Object.freeze({ ok: false, error: 'configuration' }));
  assert.deepEqual(prepareOllamaGenerationWire(cases[2]), Object.freeze({ ok: false, error: 'configuration' }));
  assert.deepEqual(prepareOllamaGenerationWire(cases[3]), Object.freeze({ ok: false, error: 'configuration' }));
  assert.deepEqual(prepareOllamaGenerationWire(cases[4]), Object.freeze({ ok: false, error: 'configuration' }));
  assert.deepEqual(prepareOllamaGenerationWire(cases[5]), Object.freeze({ ok: false, error: 'configuration' }));
  assert.deepEqual(prepareOllamaGenerationWire(cases[6]), Object.freeze({ ok: false, error: 'input-fit' }));

  let accessed = false;
  const accessor = cloneRequest(base) as unknown as Record<string, unknown>;
  Object.defineProperty(accessor, 'messages', { enumerable: true, get() { accessed = true; return base.messages; } });
  assert.deepEqual(prepareOllamaGenerationWire(accessor as never), Object.freeze({ ok: false, error: 'input-fit' }));
  assert.equal(accessed, false);
});

test('metadata transport fixes loopback request shapes and returns parsed values with complete cleanup', async () => {
  const values = [{ version: '0.33.3' }, { details: {} }, { models: [] }];
  const harness = nativeHarness(values.map(value => ({ body: JSON.stringify(value) })));
  const controller = new AbortController();
  for (const [index, kind] of (['version', 'show', 'tags'] as const).entries()) {
    assert.deepEqual(await requestOllamaGenerationMetadata(kind, controller.signal, harness.request),
      Object.freeze({ ok: true, value: values[index], cleanup: 'complete' }));
  }
  const expected = [
    { method: 'GET', path: '/api/version', body: '' },
    { method: 'POST', path: '/api/show', body: JSON.stringify({ model: 'qwen3.5:4b', verbose: false }) },
    { method: 'GET', path: '/api/tags', body: '' },
  ];
  harness.calls.forEach((call, index) => {
    assert.equal(call.options.hostname, '127.0.0.1');
    assert.equal(call.options.port, 11434);
    assert.equal(call.options.agent, false);
    assert.equal(call.options.maxHeaderSize, 16384);
    assert.equal(call.options.method, expected[index].method);
    assert.equal(call.options.path, expected[index].path);
    assert.equal(call.body, expected[index].body);
    assert.equal(call.timeout, 10000);
    assert.equal('auth' in call.options || 'proxy' in call.options || 'redirect' in call.options, false);
    if (call.body) {
      assert.equal((call.options.headers as Record<string, unknown>)['content-type'], 'application/json');
      assert.equal((call.options.headers as Record<string, unknown>)['content-length'], Buffer.byteLength(call.body));
    }
  });
});

test('metadata transport bounds status, framing, UTF-8, JSON, size and unavailable runtime', async () => {
  const cases = [
    [{ status: 404, body: '{}' }, 'missing-prerequisite'],
    [{ requestError: Object.assign(new Error('SECRET'), { code: 'ECONNREFUSED' }) }, 'missing-prerequisite'],
    [{ status: 500, body: 'SECRET' }, 'configuration'],
    [{ body: '{' }, 'configuration'],
    [{ body: Buffer.from([0xc3, 0x28]) }, 'configuration'],
    [{ body: '{}', complete: false }, 'configuration'],
    [{ body: ' '.repeat(1024 * 1024 + 1) }, 'configuration'],
  ] as const;
  for (const [reply, error] of cases) {
    const harness = nativeHarness([reply]);
    const result = await requestOllamaGenerationMetadata('tags', new AbortController().signal, harness.request);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, error);
    assert.equal(JSON.stringify(result).includes('SECRET'), false);
  }
});

test('dispatch enters transport once and sends unchanged bytes to the fixed chat endpoint', async () => {
  const candidate = { type: 'proposal', nested: { preserved: true } };
  const body = '{"prepared":true,"unicode":"😀"}';
  const harness = nativeHarness([{ body: ollamaChatBody(candidate, { total_duration: 12, eval_count: 3 }) }]);
  const counter = attemptCounter();
  const result = await dispatchOllamaGeneration(body, new AbortController().signal, counter.attempt, harness.request);
  assert.deepEqual(result, Object.freeze({ ok: true, candidate, complete: true, cleanup: 'complete' }));
  assert.equal(counter.count(), 1);
  assert.equal(harness.calls.length, 1);
  const call = harness.calls[0];
  assert.deepEqual({ hostname: call.options.hostname, port: call.options.port, method: call.options.method,
    path: call.options.path, agent: call.options.agent, maxHeaderSize: call.options.maxHeaderSize },
  { hostname: '127.0.0.1', port: 11434, method: 'POST', path: '/api/chat', agent: false, maxHeaderSize: 16384 });
  assert.equal(call.body, body);
  assert.equal((call.options.headers as Record<string, unknown>)['content-type'], 'application/json');
  assert.equal((call.options.headers as Record<string, unknown>)['content-length'], Buffer.byteLength(body));
});

test('dispatch admits only one complete exact-model assistant stop response and parses content once', async () => {
  const invalidBodies = [
    ollamaChatBody({}, { model: 'qwen3.5:4b' }),
    ollamaChatBody({}, { done: false }),
    ollamaChatBody({}, { done_reason: 'length' }),
    ollamaChatBody({}, { message: { role: 'assistant', content: '{}', thinking: 'reasoning' } }),
    ollamaChatBody({}, { message: { role: 'assistant', content: '{}', tool_calls: [] } }),
    ollamaChatBody({}, { message: { role: 'assistant', content: '{}', images: [] } }),
    ollamaChatBody({}, { message: { role: 'user', content: '{}' } }),
    ollamaChatBody({}, { remote_host: 'remote.example' }),
    JSON.stringify({ model: 'qwen3.5:4b:local', message: { role: 'assistant', content: '```json\n{}\n```' }, done: true, done_reason: 'stop' }),
    '{',
    ollamaChatBody([]), ollamaChatBody(null), ollamaChatBody('{}'), ollamaChatBody(1),
  ];
  for (const responseBody of invalidBodies) {
    const harness = nativeHarness([{ body: responseBody }]);
    const result = await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), harness.request);
    assert.deepEqual(result, Object.freeze({ ok: false, error: 'incomplete-output', cleanup: 'complete' }));
  }
  const allowedEmptyThinking = nativeHarness([{ body: ollamaChatBody({ accepted: true }, {
    message: { role: 'assistant', content: '{"accepted":true}', thinking: '' },
  }) }]);
  assert.deepEqual(await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), allowedEmptyThinking.request),
    Object.freeze({ ok: true, candidate: { accepted: true }, complete: true, cleanup: 'complete' }));
  const chunked = ollamaChatBody({ chunked: true });
  const chunkedHarness = nativeHarness([{ body: [Buffer.from(chunked.slice(0, 17)), Buffer.from(chunked.slice(17))] }]);
  assert.deepEqual(await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), chunkedHarness.request),
    Object.freeze({ ok: true, candidate: { chunked: true }, complete: true, cleanup: 'complete' }));
  for (const reply of [{ body: Buffer.from([0xc3, 0x28]) }, { body: '{}', complete: false }, { body: ' '.repeat(1024 * 1024 + 1) }]) {
    const harness = nativeHarness([reply]);
    const result = await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), harness.request);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, 'incomplete-output');
  }
});

test('reports only frozen content-free Local rejection codes without changing dispatch behavior', async () => {
  const vectors = [
    [{ body: '{' }, 'adapter-response/body'],
    [{ body: ollamaChatBody({}, { model: 'SECRET-model' }) }, 'adapter-response/envelope'],
    [{ body: ollamaChatBody('SECRET-content') }, 'adapter-response/content'],
    [{ body: Buffer.from([0xc3, 0x28]) }, 'adapter-response/body'],
    [{ body: '{}', complete: false }, 'adapter-response/body'],
  ] as const;
  for (const [reply, code] of vectors) {
    const events: unknown[] = [];
    const harness = nativeHarness([reply]);
    const result = await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), harness.request,
      (event: unknown) => { events.push(event); });
    assert.deepEqual(result, { ok: false, error: 'incomplete-output', cleanup: 'complete' });
    assert.equal(events.length, 1, code);
    assert.deepEqual(events[0], { code }, code);
    assert.equal(Object.isFrozen(events[0]), true, code);
    assert.deepEqual(Object.keys(events[0] as object), ['code'], code);
    assert.equal(JSON.stringify(events).includes('SECRET'), false, code);
  }

  for (const sink of [
    () => { throw new Error('SECRET synchronous sink failure'); },
    () => Promise.reject(new Error('SECRET asynchronous sink failure')),
    () => Object.defineProperty({}, 'then', { get() { throw new Error('SECRET thenable failure'); } }),
  ]) {
    const harness = nativeHarness([{ body: '{' }]);
    assert.deepEqual(await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), harness.request, sink),
      { ok: false, error: 'incomplete-output', cleanup: 'complete' });
    await Promise.resolve();
  }

  const successfulEvents: unknown[] = [];
  const successful = nativeHarness([{ body: ollamaChatBody({ accepted: true }) }]);
  assert.deepEqual(await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), successful.request,
    (event: unknown) => { successfulEvents.push(event); }),
  { ok: true, candidate: { accepted: true }, complete: true, cleanup: 'complete' });
  const unrelated = nativeHarness([{ status: 500, body: 'SECRET provider body' }]);
  assert.deepEqual(await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), unrelated.request,
    (event: unknown) => { successfulEvents.push(event); }),
  { ok: false, error: 'provider', cleanup: 'complete' });
  assert.deepEqual(successfulEvents, []);

  const metadata = validMetadata();
  const forwarded: unknown[] = [];
  const adapterNative = nativeHarness([
    { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, { body: ollamaChatBody({}, { model: 'SECRET-model' }) },
  ]);
  const adapter = createOllamaGenerationAdapter(adapterNative.request, (event: unknown) => { forwarded.push(event); });
  const unknownPrepared = await adapter.prepare(generationRequest(), new AbortController().signal);
  assert.ok(unknownPrepared !== null && typeof unknownPrepared === 'object' && Object.hasOwn(unknownPrepared, 'ok'));
  const prepared = unknownPrepared as PreparedGeneration;
  assert.equal(prepared.ok, true);
  if (!prepared.ok) throw new Error('Expected prepared Local adapter');
  assert.deepEqual(await prepared.dispatch(new AbortController().signal, <T>(start: () => T) => start()),
    { ok: false, error: 'incomplete-output', cleanup: 'complete' });
  assert.deepEqual(forwarded, [{ code: 'adapter-response/envelope' }]);
});

test('retains a detailed envelope event when a later response error wins terminal precedence', async () => {
  const secret = 'SECRET invalid envelope';
  const base = nativeHarness([{ body: ollamaChatBody({}, { model: secret }) }]);
  const request: typeof base.request = (options, callback) => base.request(options, response => {
    callback(response);
    response.once('end', () => { response.emit('error', new Error('later response failure')); });
  });
  const events: unknown[] = [];
  const result = await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), request,
    (event: unknown) => { events.push(event); });
  assert.deepEqual(result, { ok: false, error: 'network', cleanup: 'uncertain' });
  assert.deepEqual(events, [{ code: 'adapter-response/envelope' }]);
  assert.equal(JSON.stringify(events).includes(secret), false);
  assert.equal(base.calls.length, 1);
});

test('dispatch normalizes HTTP and terminal transport failures without retaining diagnostics', async () => {
  const cases = [
    [{ status: 429, body: 'SECRET' }, 'rate-limit'],
    [{ status: 404, body: 'SECRET' }, 'provider'],
    [{ status: 500, body: 'SECRET' }, 'provider'],
    [{ requestError: Object.assign(new Error('SECRET'), { code: 'ECONNRESET' }) }, 'network'],
    [{ synchronousError: new Error('SECRET synchronous failure') }, 'network'],
  ] as const;
  for (const [reply, error] of cases) {
    const harness = nativeHarness([reply]);
    const counter = attemptCounter();
    const result = await dispatchOllamaGeneration('{}', new AbortController().signal, counter.attempt, harness.request);
    assert.equal(counter.count(), 1);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, error);
    assert.equal(JSON.stringify(result).includes('SECRET'), false);
  }
});

test('preserves an established non-200 category across every premature post-header native failure', async t => {
  const failures = ['response-error', 'response-aborted', 'response-close', 'socket-error', 'request-error'] as const;
  for (const failure of failures) {
    await t.test(`metadata 404 retains missing-prerequisite after ${failure}`, async () => {
      const metadataHarness = nativeHarness([{
        status: 404, headers: { 'content-length': '1000' }, body: '{', afterHeadersFailure: failure,
      }]);
      const metadata = await requestOllamaGenerationMetadata('tags', new AbortController().signal, metadataHarness.request);
      assert.equal(metadataHarness.calls.length, 1);
      assert.deepEqual(metadata, Object.freeze({ ok: false, error: 'missing-prerequisite', cleanup: 'uncertain' }));
    });

    for (const [status, expected] of [[429, 'rate-limit'], [503, 'provider']] as const) {
      await t.test(`chat ${status} retains ${expected} after ${failure}`, async () => {
        const harness = nativeHarness([{
          status, headers: { 'content-length': '1000' }, body: '{', afterHeadersFailure: failure,
        }]);
        const counter = attemptCounter();
        const result = await dispatchOllamaGeneration('{}', new AbortController().signal, counter.attempt, harness.request);
        assert.equal(counter.count(), 1);
        assert.equal(harness.calls.length, 1);
        assert.deepEqual(result, Object.freeze({ ok: false, error: expected, cleanup: 'uncertain' }));
      });
    }
  }
});

test('explicit shutdown and deadline retain precedence after non-200 response headers', async t => {
  const shutdown = manuallySettledNativeHarness();
  const controller = new AbortController();
  const shutdownPending = dispatchOllamaGeneration('{}', controller.signal, start => start(), shutdown.request);
  shutdown.control.respond(429);
  controller.abort();
  assert.deepEqual(await shutdownPending, Object.freeze({ ok: false, error: 'shutdown', cleanup: 'uncertain' }));
  assert.equal(shutdown.calls.length, 1);

  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const timeout = manuallySettledNativeHarness();
    const timeoutPending = dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), timeout.request);
    timeout.control.respond(503);
    t.mock.timers.tick(120000);
    assert.deepEqual(await timeoutPending, Object.freeze({ ok: false, error: 'timeout', cleanup: 'uncertain' }));
    assert.equal(timeout.calls.length, 1);
  } finally {
    t.mock.timers.reset();
  }
});

test('dispatch observes caller abort before start and reports uncertain cleanup for active I/O', async () => {
  const before = new AbortController();
  before.abort();
  const unused = nativeHarness([{ hold: true }]);
  const counter = attemptCounter();
  assert.deepEqual(await dispatchOllamaGeneration('{}', before.signal, counter.attempt, unused.request),
    Object.freeze({ ok: false, error: 'shutdown', cleanup: 'complete' }));
  assert.equal(counter.count(), 0);
  assert.equal(unused.calls.length, 0);

  const active = new AbortController();
  const harness = nativeHarness([{ hold: true }]);
  const pending = dispatchOllamaGeneration('{}', active.signal, start => start(), harness.request);
  await Promise.resolve();
  active.abort();
  assert.deepEqual(await pending, Object.freeze({ ok: false, error: 'shutdown', cleanup: 'uncertain' }));
  assert.equal(harness.calls[0].destroyed, true);
});

test('does not claim success or complete cleanup until request, response and socket reach terminal state', async () => {
  const harness = manuallySettledNativeHarness();
  const pending = dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), harness.request);
  let settled = false;
  void pending.then(() => { settled = true; }, () => { settled = true; });
  harness.control.respond();
  harness.control.data(ollamaChatBody({ terminal: true }));
  harness.control.end(true);
  await Promise.resolve();
  assert.equal(settled, false);
  harness.control.closeResponse();
  harness.control.closeRequest();
  await Promise.resolve();
  assert.equal(settled, false);
  harness.control.closeSocket();
  const result = await pending;
  assert.deepEqual(result, Object.freeze({ ok: true, candidate: { terminal: true }, complete: true, cleanup: 'complete' }));
  harness.control.repeatCallback();
  harness.control.duplicateTerminalEvents();
  await Promise.resolve();
  assert.deepEqual(await pending, result);
  assert.equal(harness.calls.length, 1);
  assert.equal(harness.control.lateResponseDestroyed, true);
});

test('response failure or close before complete framing cannot become successful complete cleanup', async () => {
  for (const reply of [{ responseError: true }, { closeBeforeEnd: true }]) {
    const harness = nativeHarness([reply]);
    const result = await dispatchOllamaGeneration('{}', new AbortController().signal, start => start(), harness.request);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.cleanup, 'uncertain');
  }
});

test('metadata requests enforce their owned deadline and release the active request', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const metadataHarness = nativeHarness([{ hold: true }]);
    const metadata = requestOllamaGenerationMetadata('version', new AbortController().signal, metadataHarness.request);
    t.mock.timers.tick(9999);
    await Promise.resolve();
    t.mock.timers.tick(1);
    assert.deepEqual(await metadata, Object.freeze({ ok: false, error: 'configuration', cleanup: 'uncertain' }));
    assert.equal(metadataHarness.calls[0].destroyed, true);
  } finally {
    t.mock.timers.reset();
  }
});
