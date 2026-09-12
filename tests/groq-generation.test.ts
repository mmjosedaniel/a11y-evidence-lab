import assert from 'node:assert/strict';
import test from 'node:test';
import { executeGeneration } from '../src/server/generation/generation-stage.ts';
import { GROQ_CONFIGURATION } from '../src/server/generation/groq-generation-configuration.ts';
import { GENERATION_SCHEMA } from '../src/server/generation/generation-artifacts.ts';
import { dispatchGroqGeneration } from '../src/server/generation/groq-generation-http.ts';
import { createGroqGenerationAdapter } from '../src/server/generation/groq-generation.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import {
  expectedGroqBody,
  groqChatBody,
  groqGenerationRequest,
  groqNativeHarness,
  manuallySettledGroqNativeHarness,
  requestAtSerializedBytes,
  SYNTHETIC_GROQ_CREDENTIAL,
  virtualCredentialIO,
} from './helpers/m304-groq-fixture.ts';

const serial = { concurrency: false };
const groqContext = Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' } as const);
const localContext = Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' } as const);
const analysisStartedAt = '2026-09-11T12:00:00.000Z';
const analysisFinishedAt = '2026-09-11T12:00:01.000Z';
const nativeSetTimeout = setTimeout;

async function execute(
  adapter: ReturnType<typeof createGroqGenerationAdapter>,
  signal = new AbortController().signal,
  mode: 'groq' | 'local' = 'groq',
  fixture = generationFixture(),
) {
  return executeGeneration({
    finding: fixture.finding,
    retrieval: fixture.retrieval,
    analysisStartedAt,
    analysisFinishedAt,
    providerContext: mode === 'groq' ? groqContext : localContext,
    adapter,
    signal,
  });
}

async function dispatch(body: string, credential: string, reply: Parameters<typeof groqNativeHarness>[0][number]) {
  const native = groqNativeHarness([reply]);
  let attempts = 0;
  const result = await dispatchGroqGeneration(body, credential, new AbortController().signal, start => {
    attempts++;
    return start();
  }, native.request);
  return { result, native, attempts };
}

async function remainsPending(promise: Promise<unknown>): Promise<boolean> {
  const marker = Symbol('pending');
  return await Promise.race([
    promise.then(() => false),
    new Promise<typeof marker>(resolve => setImmediate(() => resolve(marker))),
  ]) === marker;
}

async function waitUntil(predicate: () => boolean, message: string): Promise<void> {
  const deadline = performance.now() + 2000;
  while (performance.now() < deadline) {
    if (predicate()) return;
    await new Promise<void>(resolve => nativeSetTimeout(resolve, 5));
  }
  assert.fail(message);
}

function paddedSuccess(candidate: unknown, bytes: number): string {
  const base = JSON.parse(groqChatBody(candidate)) as Record<string, unknown>;
  base.metadata = '';
  const empty = JSON.stringify(base);
  const padding = bytes - Buffer.byteLength(empty, 'utf8');
  assert.ok(padding >= 0);
  base.metadata = 'x'.repeat(padding);
  const result = JSON.stringify(base);
  assert.equal(Buffer.byteLength(result, 'utf8'), bytes);
  return result;
}

function unicodeEscaped(value: string): string {
  return [...value].map(character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`).join('');
}

test('factory is frozen and construction performs no credential or native I/O', serial, () => {
  const credential = virtualCredentialIO();
  const native = groqNativeHarness([]);
  const adapter = createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
  assert.equal(Object.isFrozen(adapter), true);
  assert.deepEqual(Object.keys(adapter).sort(), ['configuration', 'prepare']);
  assert.strictEqual(adapter.configuration, GROQ_CONFIGURATION);
  assert.equal(credential.calls.debug, 0);
  assert.deepEqual(credential.calls.open, []);
  assert.equal(native.calls.length, 0);
});

test('factory prepares the admitted body and dispatches one exact fixed HTTPS request inside the capability', serial, async () => {
  const fixture = generationFixture();
  const credential = virtualCredentialIO({ content: `GROQ_API_KEY=${SYNTHETIC_GROQ_CREDENTIAL}\n` });
  const native = groqNativeHarness([{ body: groqChatBody(fixture.proposal) }]);
  const adapter = createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
  const request = groqGenerationRequest('fixed system', 'fixed user');
  const prepared = await adapter.prepare(request, new AbortController().signal) as {
    ok: true; request: unknown; configuration: unknown; fit: unknown; cleanup: string;
    dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown>;
  };
  assert.equal(prepared.ok, true);
  assert.strictEqual(prepared.request, request);
  assert.strictEqual(prepared.configuration, GROQ_CONFIGURATION);
  assert.equal(prepared.cleanup, 'complete');
  assert.equal(native.calls.length, 0);
  let capabilities = 0;
  const result = await prepared.dispatch(new AbortController().signal, start => {
    capabilities++;
    assert.equal(native.calls.length, 0);
    return start();
  }) as { ok: boolean };
  assert.equal(result.ok, true);
  assert.equal(capabilities, 1);
  assert.equal(native.calls.length, 1);
  const call = native.calls[0]!;
  assert.deepEqual(call.options, {
    hostname: 'api.groq.com', port: 443, path: '/openai/v1/chat/completions', method: 'POST',
    agent: false, maxHeaderSize: 16384, rejectUnauthorized: true,
    headers: {
      authorization: `Bearer ${SYNTHETIC_GROQ_CREDENTIAL}`,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(expectedGroqBody(request), 'utf8'),
    },
  });
  assert.equal(call.body.toString('utf8'), expectedGroqBody(request));
  assert.equal(call.timeout, 120000);
});

test('fit, credential, debug, outbound collision, wrong mode and abstention all stop before transport', serial, async () => {
  const vectors = [
    ['oversized body', virtualCredentialIO(), requestAtSerializedBytes(65537), 'input-fit'],
    ['missing credential', virtualCredentialIO({ content: 'OTHER=value\n' }), groqGenerationRequest('system', 'user'), 'missing-prerequisite'],
    ['malformed credential', virtualCredentialIO({ content: 'GROQ_API_KEY=bad key\n' }), groqGenerationRequest('system', 'user'), 'configuration'],
    ['startup debug', virtualCredentialIO({ debugSequence: [true] }), groqGenerationRequest('system', 'user'), 'configuration'],
  ] as const;
  for (const [name, credential, request, error] of vectors) {
    const native = groqNativeHarness([]);
    const adapter = createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
    const prepared = await adapter.prepare(request, new AbortController().signal) as Record<string, unknown>;
    if (prepared.ok === true && typeof prepared.dispatch === 'function') {
      const result = await (prepared.dispatch as Function)(new AbortController().signal, (start: () => unknown) => start());
      assert.deepEqual(result, { ok: false, error, cleanup: (result as { cleanup: string }).cleanup }, name);
    } else {
      assert.deepEqual(prepared, { ok: false, error, cleanup: (prepared as { cleanup: string }).cleanup }, name);
    }
    assert.equal(native.calls.length, 0, name);
  }

  const invalidConfiguration = groqGenerationRequest('system', 'user', request => {
    request.configuration = Object.freeze({ ...GROQ_CONFIGURATION });
  });
  const invalidCredential = virtualCredentialIO();
  const invalidNative = groqNativeHarness([]);
  const invalid = await createGroqGenerationAdapter({ credentialIO: invalidCredential.io,
    requestImplementation: invalidNative.request }).prepare(invalidConfiguration, new AbortController().signal);
  assert.deepEqual(invalid, { ok: false, error: 'configuration', cleanup: 'complete' });
  assert.equal(invalidCredential.calls.debug, 0);
  assert.equal(invalidNative.calls.length, 0);

  for (const [name, credential] of [
    ['pretransport debug', virtualCredentialIO({ debugSequence: [false, true] })],
    ['outbound property-name collision', virtualCredentialIO({ content: 'GROQ_API_KEY=model\n' })],
    ['outbound decoded-string collision', virtualCredentialIO({ content: 'GROQ_API_KEY=image-alt\n' })],
  ] as const) {
    const gateNative = groqNativeHarness([]);
    const gated = await execute(createGroqGenerationAdapter({ credentialIO: credential.io,
      requestImplementation: gateNative.request }));
    assert.equal(gated.status, 'failed', name);
    if (gated.status !== 'failed') continue;
    assert.equal(gated.error, 'configuration', name);
    assert.equal('invocation' in gated, false, name);
    assert.equal(typeof gated.cleanupFailed, 'boolean', name);
    assert.equal(gateNative.calls.length, 0, name);
  }

  for (const [name, mode, fixture] of [
    ['wrong mode', 'local', generationFixture()],
    ['abstention', 'groq', generationFixture('image-alt', { incompleteEvidence: true })],
  ] as const) {
    const credential = virtualCredentialIO();
    const native = groqNativeHarness([]);
    const result = await execute(createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request }),
      new AbortController().signal, mode, fixture);
    assert.notEqual(result.status, 'proposal', name);
    assert.equal(result.status === 'failed' ? result.error : 'abstained', name === 'wrong mode' ? 'configuration' : 'abstained');
    assert.equal(credential.calls.debug, 0, name);
    assert.equal(native.calls.length, 0, name);
  }
});

test('actual stage validates a proposal and records one truthful Groq invocation', serial, async () => {
  const fixture = generationFixture();
  const credential = virtualCredentialIO();
  const native = groqNativeHarness([{ body: groqChatBody(fixture.proposal) }]);
  const result = await execute(createGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request }),
    new AbortController().signal, 'groq', fixture);
  assert.equal(result.status, 'proposal');
  if (result.status !== 'proposal') return;
  assert.deepEqual(result.proposal, fixture.proposal);
  assert.deepEqual(result.invocation, {
    adapterId: 'groq-generation', adapterVersion: 'm304-groq-v1', endpointIdentity: 'groq-chat-completions',
    promptVersion: GROQ_CONFIGURATION.promptVersion, schemaVersion: GROQ_CONFIGURATION.schemaVersion,
    outputContractVersion: GROQ_CONFIGURATION.outputContractVersion, parameters: GROQ_CONFIGURATION.parameters,
    outcome: 'response', validation: 'passed',
  });
  assert.equal(native.calls.length, 1);
  const outbound = native.calls[0]!.body.toString('utf8');
  const decoded = JSON.parse(outbound) as Record<string, any>;
  assert.deepEqual(Object.keys(decoded), ['model', 'messages', 'response_format', 'temperature', 'top_p',
    'max_completion_tokens', 'reasoning_effort', 'include_reasoning', 'stream', 'n']);
  assert.deepEqual(decoded.messages.map((message: Record<string, unknown>) => message.role), ['system', 'user']);
  assert.deepEqual(decoded.response_format, {
    type: 'json_schema', json_schema: { name: 'm301_proposal_v1', strict: true, schema: GENERATION_SCHEMA },
  });
  for (const excluded of [
    'https://example.org/start?view=summary#intro', ':root > :nth-child(1)', 'finding-1',
    SYNTHETIC_GROQ_CREDENTIAL,
  ]) assert.equal(outbound.includes(excluded), false, `Outbound body exposed ${excluded}`);
});

test('native response validation rejects every non-closed success shape and never returns diagnostics', serial, async () => {
  const fixture = generationFixture();
  const valid = JSON.parse(groqChatBody(fixture.proposal)) as Record<string, any>;
  const vectors: readonly [string, string | Buffer, boolean?][] = [
    ['malformed JSON', '{'],
    ['fatal UTF-8', Buffer.from([0xc3, 0x28])],
    ['incomplete HTTP', groqChatBody(fixture.proposal), false],
    ['wrong object', JSON.stringify({ ...valid, object: 'completion' })],
    ['wrong model', JSON.stringify({ ...valid, model: 'other' })],
    ['multiple choices', JSON.stringify({ ...valid, choices: [...valid.choices, valid.choices[0]] })],
    ['wrong index', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], index: 1 }] })],
    ['wrong role', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], message: { ...valid.choices[0].message, role: 'tool' } }] })],
    ['non-stop', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], finish_reason: 'length' }] })],
    ['refusal', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], message: { ...valid.choices[0].message, refusal: 'SECRET' } }] })],
    ['reasoning', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], message: { ...valid.choices[0].message, reasoning: 'SECRET' } }] })],
    ['tool call', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], message: { ...valid.choices[0].message, tool_calls: [] } }] })],
    ['function call', JSON.stringify({ ...valid, choices: [{ ...valid.choices[0], message: { ...valid.choices[0].message, function_call: {} } }] })],
    ['non-object candidate', groqChatBody('not an object')],
    ...(['envelope', 'choice'] as const).flatMap(location =>
      (['tool_calls', 'function_call', 'refusal', 'reasoning'] as const).map(field => {
        const envelope = structuredClone(valid);
        const target = location === 'envelope' ? envelope : envelope.choices[0];
        target[field] = field === 'tool_calls' ? [] : field === 'function_call' ? {} : 'SECRET';
        return [`${location} ${field}`, JSON.stringify(envelope)] as [string, string];
      })),
  ];
  for (const [name, body, complete = true] of vectors) {
    const { result, attempts } = await dispatch('{}'.repeat(1), SYNTHETIC_GROQ_CREDENTIAL, { body, complete });
    assert.deepEqual(result, { ok: false, error: 'incomplete-output', cleanup: result.cleanup }, name);
    assert.ok(['complete', 'uncertain'].includes(result.cleanup), name);
    assert.equal(attempts, 1, name);
    assert.equal(JSON.stringify(result).includes('SECRET'), false, name);
  }
});

test('only the permitted refusal and reasoning extension states preserve a valid candidate', serial, async () => {
  const fixture = generationFixture();
  const bodyWith = (refusal: 'absent' | unknown, reasoning: 'absent' | unknown) => {
    const envelope = JSON.parse(groqChatBody(fixture.proposal)) as Record<string, any>;
    const message = envelope.choices[0].message as Record<string, unknown>;
    if (refusal === 'absent') delete message.refusal;
    else message.refusal = refusal;
    if (reasoning === 'absent') delete message.reasoning;
    else message.reasoning = reasoning;
    return JSON.stringify(envelope);
  };
  for (const [refusal, reasoning] of [
    ['absent', 'absent'], [null, null], [null, ''], ['absent', ''],
  ] as const) {
    const { result } = await dispatch('{}', SYNTHETIC_GROQ_CREDENTIAL, { body: bodyWith(refusal, reasoning) });
    assert.equal(result.ok, true, `${String(refusal)}/${String(reasoning)}`);
  }
  for (const [name, refusal, reasoning] of [
    ['nonempty refusal', 'no', 'absent'], ['boolean refusal', false, 'absent'], ['object refusal', {}, 'absent'],
    ['nonempty reasoning', null, 'hidden'], ['numeric reasoning', null, 0], ['boolean reasoning', null, false],
    ['object reasoning', null, {}], ['array reasoning', null, []],
  ] as const) {
    const { result } = await dispatch('{}', SYNTHETIC_GROQ_CREDENTIAL, { body: bodyWith(refusal, reasoning) });
    assert.equal(result.ok, false, name);
    if (!result.ok) assert.equal(result.error, 'incomplete-output', name);
  }
});

test('status classification is closed and qualifying quota takes precedence over discarded credential echoes', serial, async () => {
  const vectors = [
    [401, '{}', 'authentication'],
    [429, '{}', 'rate-limit'],
    [400, JSON.stringify({ error: { code: 'blocked_api_access' }, echoed: SYNTHETIC_GROQ_CREDENTIAL }), 'quota'],
    [400, JSON.stringify({ error: { code: 'other' } }), 'provider'],
    [400, '{', 'provider'],
    [302, '{}', 'provider'],
    [413, '{}', 'provider'],
    [503, JSON.stringify({ diagnostic: SYNTHETIC_GROQ_CREDENTIAL }), 'provider'],
  ] as const;
  for (const [status, body, error] of vectors) {
    const { result, native, attempts } = await dispatch('{}', SYNTHETIC_GROQ_CREDENTIAL, { status, body });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, error);
    assert.equal(attempts, 1);
    assert.equal(native.calls.length, 1);
    assert.equal(JSON.stringify(result).includes(SYNTHETIC_GROQ_CREDENTIAL), false);
  }
});

test('network and synchronous failures remain distinct while observed non-200 status takes precedence', serial, async () => {
  for (const [name, reply, error] of [
    ['request network error', { requestError: Object.assign(new Error('SYNTHETIC_SECRET_REQUEST'), { code: 'ECONNRESET' }) }, 'network'],
    ['response error after 401', { status: 401, responseFailure: 'error' }, 'authentication'],
    ['response abort after 429', { status: 429, responseFailure: 'aborted' }, 'rate-limit'],
    ['response close after 503', { status: 503, responseFailure: 'close' }, 'provider'],
    ['socket error after 400', { status: 400, socketFailure: true }, 'provider'],
    ['incomplete quota-shaped 400', { status: 400, complete: false, body: JSON.stringify({ error: { code: 'blocked_api_access' } }) }, 'provider'],
  ] as const) {
    const { result, attempts } = await dispatch('{}', SYNTHETIC_GROQ_CREDENTIAL, reply);
    assert.equal(result.ok, false, name);
    if (!result.ok) assert.equal(result.error, error, name);
    assert.equal(attempts, 1, name);
    assert.equal(JSON.stringify(result).includes('SYNTHETIC_SECRET'), false, name);
  }

  const fixture = generationFixture();
  const synchronous = groqNativeHarness([{ synchronousError: new Error('SYNTHETIC_SECRET_SYNCHRONOUS') }]);
  const result = await execute(createGroqGenerationAdapter({ credentialIO: virtualCredentialIO().io,
    requestImplementation: synchronous.request }), new AbortController().signal, 'groq', fixture);
  assert.equal(result.status, 'failed');
  if (result.status === 'failed') {
    assert.equal(result.error, 'network');
    assert.equal(result.invocation?.outcome, 'network');
  }
  assert.equal(JSON.stringify(result).includes('SYNTHETIC_SECRET'), false);
});

test('credential echoes in decoded inbound strings and property names reject escaped and literal forms', serial, async () => {
  const fixture = generationFixture();
  const escapedCredential = unicodeEscaped(SYNTHETIC_GROQ_CREDENTIAL);
  const envelopeString = groqChatBody(fixture.proposal, { metadata: SYNTHETIC_GROQ_CREDENTIAL })
    .replaceAll(SYNTHETIC_GROQ_CREDENTIAL, escapedCredential);
  const envelopeProperty = groqChatBody(fixture.proposal, { [SYNTHETIC_GROQ_CREDENTIAL]: true })
    .replaceAll(SYNTHETIC_GROQ_CREDENTIAL, escapedCredential);
  assert.equal(envelopeString.includes(SYNTHETIC_GROQ_CREDENTIAL), false);
  assert.equal(envelopeProperty.includes(SYNTHETIC_GROQ_CREDENTIAL), false);
  assert.equal((JSON.parse(envelopeString) as { metadata: string }).metadata, SYNTHETIC_GROQ_CREDENTIAL);
  assert.equal(Object.hasOwn(JSON.parse(envelopeProperty), SYNTHETIC_GROQ_CREDENTIAL), true);

  const candidateCredential = 'uncertainty';
  const candidatePropertySource = JSON.stringify(fixture.proposal).replace('"uncertainty"', `"${unicodeEscaped(candidateCredential)}"`);
  const candidateStringCredential = 'judgment';
  const candidateStringSource = JSON.stringify(fixture.proposal)
    .replace(candidateStringCredential, unicodeEscaped(candidateStringCredential));
  const nested = (candidateSource: string, credential: string) => {
    const envelope = JSON.parse(groqChatBody(fixture.proposal)) as Record<string, any>;
    envelope.choices[0].message.content = candidateSource;
    const raw = JSON.stringify(envelope);
    const decodedContent = (JSON.parse(raw) as Record<string, any>).choices[0].message.content as string;
    assert.equal(raw.includes(credential), false);
    assert.equal(decodedContent.includes(credential), false);
    assert.equal(decodedContent.includes('\\u'), true);
    assert.equal(JSON.stringify(JSON.parse(decodedContent)).includes(credential), true);
    return raw;
  };

  for (const [name, credential, body] of [
    ['envelope string', SYNTHETIC_GROQ_CREDENTIAL, envelopeString],
    ['envelope property', SYNTHETIC_GROQ_CREDENTIAL, envelopeProperty],
    ['candidate property', candidateCredential, nested(candidatePropertySource, candidateCredential)],
    ['candidate string', candidateStringCredential, nested(candidateStringSource, candidateStringCredential)],
  ] as const) {
    const { result } = await dispatch('{}', credential, { body });
    assert.equal(result.ok, false, name);
    if (!result.ok) assert.equal(result.error, 'incomplete-output', name);
  }
});

test('response bytes admit the exact 1 MiB boundary and reject one byte over', serial, async () => {
  const fixture = generationFixture();
  const admitted = await dispatch('{}', SYNTHETIC_GROQ_CREDENTIAL, { body: paddedSuccess(fixture.proposal, 1048576) });
  assert.equal(admitted.result.ok, true);
  const rejected = await dispatch('{}', SYNTHETIC_GROQ_CREDENTIAL, { body: paddedSuccess(fixture.proposal, 1048577) });
  assert.equal(rejected.result.ok, false);
  if (!rejected.result.ok) assert.equal(rejected.result.error, 'incomplete-output');
});

test('success waits for request, response and every observed socket close', serial, async () => {
  const fixture = generationFixture();
  const native = manuallySettledGroqNativeHarness();
  const pending = dispatchGroqGeneration('{}', SYNTHETIC_GROQ_CREDENTIAL, new AbortController().signal,
    start => start(), native.request);
  assert.equal(native.calls.length, 1);
  native.control.assignSocket();
  native.control.respond();
  native.control.data(groqChatBody(fixture.proposal));
  native.control.end();
  assert.equal(await remainsPending(pending), true);
  native.control.closeResponse();
  native.control.closeRequest();
  native.control.closeSocket(0);
  assert.equal(await remainsPending(pending), true);
  native.control.closeSocket(1);
  const result = await pending;
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.cleanup, 'complete');
});

test('an unclosed active duplicate response prevents successful publication', serial, async () => {
  const controller = new AbortController();
  const native = manuallySettledGroqNativeHarness();
  const pending = dispatchGroqGeneration('{}', SYNTHETIC_GROQ_CREDENTIAL, controller.signal,
    start => start(), native.request);
  try {
    native.control.respond();
    native.control.repeatCallback();
    assert.equal(native.control.lateResponseDestroyed, true);
    native.control.data(groqChatBody(generationFixture().proposal));
    native.control.end();
    native.control.closeResponse();
    native.control.closeRequest();
    native.control.closeSocket();
    const observed = await Promise.race([
      pending,
      new Promise<undefined>(resolve => setImmediate(() => resolve(undefined))),
    ]);
    assert.notEqual(observed?.ok, true, 'The duplicate response has never emitted close');
    controller.abort();
    const result = await pending;
    assert.equal(result.ok, false);
    assert.equal(result.cleanup, 'uncertain');
    assert.equal(native.calls.length, 1);
  } finally {
    controller.abort();
    await pending;
  }
});

test('abort, timeout and post-status failures destroy owned resources with bounded truthful settlement', serial, async () => {
  const cases = ['abort', 'timeout', 'status-error'] as const;
  for (const kind of cases) {
    const controller = new AbortController();
    const native = manuallySettledGroqNativeHarness();
    const pending = dispatchGroqGeneration('{}', SYNTHETIC_GROQ_CREDENTIAL, controller.signal, start => start(), native.request);
    if (kind === 'status-error') native.control.respond(429);
    if (kind === 'abort') controller.abort();
    else if (kind === 'timeout') native.control.timeout();
    else native.control.errorRequest();
    const result = await pending;
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, kind === 'abort' ? 'shutdown' : kind === 'timeout' ? 'timeout' : 'rate-limit');
    assert.equal(result.cleanup, 'uncertain');
    assert.equal(native.calls[0]!.requestDestroyed, true);
    assert.equal(JSON.stringify(result).includes('SYNTHETIC_SECRET'), false);
  }
});

test('late and duplicate callbacks cannot publish success or create a second request', serial, async () => {
  const controller = new AbortController();
  const native = manuallySettledGroqNativeHarness();
  const pending = dispatchGroqGeneration('{}', SYNTHETIC_GROQ_CREDENTIAL, controller.signal, start => start(), native.request);
  controller.abort();
  const result = await pending;
  assert.equal(result.ok, false);
  native.control.assignSocket();
  assert.equal(native.calls[0]!.sockets[1]!.destroyed, true);
  assert.doesNotThrow(() => native.control.errorSocket(1));
  native.control.closeSocket(1);
  native.control.respond();
  assert.equal(native.control.responseDestroyed, true);
  native.control.repeatCallback();
  assert.equal(native.control.lateResponseDestroyed, true);
  native.control.duplicateTerminalEvents();
  await new Promise<void>(resolve => nativeSetTimeout(resolve, 0));
  assert.equal(native.calls.length, 1);
});

test('credential preparation obeys caller abort and the shared whole-operation deadline', serial, async t => {
  const abortCredential = virtualCredentialIO({ holdRead: true });
  const abortNative = groqNativeHarness([]);
  const abortController = new AbortController();
  const abortPending = execute(createGroqGenerationAdapter({ credentialIO: abortCredential.io,
    requestImplementation: abortNative.request }), abortController.signal);
  await waitUntil(() => abortCredential.calls.read.length === 1, 'Credential read did not become active before abort');
  abortController.abort();
  const aborted = await abortPending;
  assert.deepEqual(aborted, { status: 'failed', error: 'shutdown', cleanupFailed: true });
  assert.equal(abortNative.calls.length, 0);
  abortCredential.control.releaseRead();
  await new Promise<void>(resolve => setImmediate(resolve));

  t.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const deadlineCredential = virtualCredentialIO({ holdRead: true });
    const deadlineNative = groqNativeHarness([]);
    const deadlinePending = execute(createGroqGenerationAdapter({ credentialIO: deadlineCredential.io,
      requestImplementation: deadlineNative.request }));
    await waitUntil(() => deadlineCredential.calls.read.length === 1, 'Credential read did not become active before deadline');
    t.mock.timers.tick(120000);
    assert.deepEqual(await deadlinePending, { status: 'failed', error: 'timeout', cleanupFailed: true });
    assert.equal(deadlineNative.calls.length, 0);
    deadlineCredential.control.releaseRead();
    await new Promise<void>(resolve => setImmediate(resolve));
  } finally {
    t.mock.timers.reset();
  }
});

test('post-prepare abort clears the credential and prevents replay with a fresh capability', serial, async () => {
  const originalSignal = new AbortController();
  const originalNative = groqNativeHarness([]);
  const originalPrepared = await createGroqGenerationAdapter({ credentialIO: virtualCredentialIO().io,
    requestImplementation: originalNative.request }).prepare(groqGenerationRequest(), originalSignal.signal) as {
    ok: true; dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown>;
  };
  assert.equal(originalPrepared.ok, true);
  originalSignal.abort();
  let originalReplay: Record<string, unknown> | undefined;
  let originalRejected = false;
  try {
    originalReplay = await originalPrepared.dispatch(new AbortController().signal, start => start()) as Record<string, unknown>;
  } catch {
    originalRejected = true;
  }
  if (!originalRejected) {
    assert.equal(originalReplay?.ok, false);
    assert.ok(['configuration', 'shutdown'].includes(String(originalReplay?.error)));
    assert.ok(['complete', 'uncertain'].includes(String(originalReplay?.cleanup)));
  }
  assert.equal(originalNative.calls.length, 0);

  const directNative = groqNativeHarness([]);
  const directPrepared = await createGroqGenerationAdapter({ credentialIO: virtualCredentialIO().io,
    requestImplementation: directNative.request }).prepare(groqGenerationRequest(), new AbortController().signal) as {
    ok: true; dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown>;
  };
  assert.equal(directPrepared.ok, true);
  const aborted = new AbortController();
  aborted.abort();
  assert.deepEqual(await directPrepared.dispatch(aborted.signal, start => start()), {
    ok: false, error: 'shutdown', cleanup: 'complete',
  });
  const replay = await directPrepared.dispatch(new AbortController().signal, start => start()) as Record<string, unknown>;
  assert.deepEqual(replay, { ok: false, error: 'configuration', cleanup: 'complete' });
  assert.equal(directNative.calls.length, 0);
});

test('a prepared dispatch is inert and terminal success clears the credential before fresh-capability replay', serial, async () => {
  const fixture = generationFixture();
  const native = groqNativeHarness([{ body: groqChatBody(fixture.proposal) }]);
  const adapter = createGroqGenerationAdapter({ credentialIO: virtualCredentialIO().io, requestImplementation: native.request });
  const prepared = await adapter.prepare(groqGenerationRequest(), new AbortController().signal) as {
    ok: true; dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<{ ok: boolean }>;
  };
  assert.equal(prepared.ok, true);
  assert.equal(native.calls.length, 0);
  const first = await prepared.dispatch(new AbortController().signal, start => start());
  assert.equal(first.ok, true);
  const second = await prepared.dispatch(new AbortController().signal, start => start()) as Record<string, unknown>;
  assert.deepEqual(second, { ok: false, error: 'configuration', cleanup: 'complete' });
  assert.equal(native.calls.length, 1);
});
