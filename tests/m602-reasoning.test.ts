import assert from 'node:assert/strict';
import test from 'node:test';
import { executeGenerationOperation } from '../src/server/generation/generation-execution.ts';
import { createCaseGenerationRequest } from '../src/server/generation/generation-case-request.ts';
import { resolveGenerationAdapter } from '../src/server/local-service/generation-adapters.ts';
import { createGenerationOperation } from '../src/server/local-service/generation-operation.ts';
import { assessFindingEvidence } from '../src/server/domain/finding-sufficiency.ts';
import { validateProposal } from '../src/server/generation/proposal-contract.ts';
import { readProviderInvocation, type GenerationConfiguration } from '../src/server/generation/generation-contract.ts';
import { prepareReasoningOllamaGenerationWire } from '../src/server/generation/ollama-generation-fit.ts';
import {
  JUDGMENT_GROQ_CONFIGURATION,
  JUDGMENT_QWEN_CONFIGURATION,
  NATIVE_SCHEMA_QWEN_CONFIGURATION,
  REASONING_GROQ_CONFIGURATION,
  REASONING_QWEN_CONFIGURATION,
  UNCERTAINTY_GROQ_CONFIGURATION,
  UNCERTAINTY_QWEN_CONFIGURATION,
} from '../src/server/generation/reasoning-generation-configuration.ts';
import { reasoningGenerationInstructions } from '../src/server/generation/reasoning-generation-instructions.ts';
import {
  createOllamaGenerationAdapter,
  createReasoningOllamaGenerationAdapter,
} from '../src/server/generation/ollama-generation.ts';
import {
  createGroqGenerationAdapter,
  createReasoningGroqGenerationAdapter,
} from '../src/server/generation/groq-generation.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import { assessedSupportedRetrievalRun } from './helpers/m202-retrieval-service-fixture.ts';
import { nativeHarness, ollamaChatBody, validMetadata } from './helpers/m303-ollama-fixture.ts';
import {
  groqChatBody,
  groqNativeHarness,
  SYNTHETIC_GROQ_CREDENTIAL,
  virtualCredentialIO,
} from './helpers/m304-groq-fixture.ts';

const serial = { concurrency: false };
const localContext = Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' } as const);
const groqContext = Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' } as const);
const evidenceReference = assessFindingEvidence(generationFixture().finding).availableReferences[0]!;
const passageId = 'image-alt-purpose-v1';

function controlledMessages(ruleId: 'image-alt' | 'label' | 'color-contrast' = 'image-alt', padding = '') {
  return Object.freeze([
    Object.freeze({ role: 'system' as const, content: reasoningGenerationInstructions(ruleId) }),
    Object.freeze({ role: 'user' as const, content: JSON.stringify({
      finding: { findingId: 'finding-0', ruleId, facts: [{ reference: evidenceReference, value: `controlled${padding}` }] },
      guidance: { corpusVersion: 'm201-corpus-v1', passages: [{ passageId, text: 'Controlled guidance.' }],
        notices: { sources: [], texts: [] } },
    }) }),
  ]);
}

function reasoningRequest(configuration: GenerationConfiguration = REASONING_QWEN_CONFIGURATION, padding = '') {
  return createCaseGenerationRequest(controlledMessages('image-alt', padding), {
    findingId: 'finding-0', availableEvidenceReferences: [evidenceReference], passageIds: [passageId],
  }, configuration);
}

function metadataReplies(candidate: unknown, thinking = 'private reasoning that must be discarded') {
  const metadata = validMetadata();
  return [
    { body: JSON.stringify(metadata.version) },
    { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) },
    { body: ollamaChatBody(candidate, {
      message: { role: 'assistant', content: JSON.stringify(candidate), thinking },
    }) },
  ] as const;
}

function count(text: string, fragment: string): number {
  return text.split(fragment).length - 1;
}

test('reasoning instructions select one frozen judgment and configurations bind the new fixed controls', serial, () => {
  const judgments = {
    'image-alt': 'Determine image purpose, informative versus decorative treatment and suitable equivalent wording; the minimized evidence does not reveal image meaning.',
    label: 'Determine understandable appropriate visible label wording and verify the actual programmatic association; naming-source absence alone does not determine suitable wording.',
    'color-contrast': 'Determine meaningful text, applicable threshold or exception and visual context; preserve native measurements without inventing new measurements.',
  } as const;
  for (const [ruleId, expected] of Object.entries(judgments) as Array<[keyof typeof judgments, string]>) {
    const instructions = reasoningGenerationInstructions(ruleId);
    assert.match(instructions, /exactly one proposal JSON object/i);
    assert.match(instructions, /human (judgment|verification)/i);
    assert.ok(instructions.includes(expected));
    for (const other of Object.values(judgments)) assert.equal(instructions.includes(other), other === expected);
  }
  assert.equal(Object.isFrozen(REASONING_QWEN_CONFIGURATION), true);
  assert.equal(Object.isFrozen(REASONING_GROQ_CONFIGURATION), true);
  assert.deepEqual(REASONING_QWEN_CONFIGURATION.parameters, {
    temperature: 1, top_p: 0.95, num_predict: 12288, think: true, stream: false, responses: 1,
  });
  assert.equal(REASONING_QWEN_CONFIGURATION.accounting.contextTokenLimit, 32768);
  assert.equal(REASONING_QWEN_CONFIGURATION.accounting.outputTokenLimit, 12288);
  assert.notEqual(REASONING_QWEN_CONFIGURATION.promptVersion,
    createOllamaGenerationAdapter().configuration.promptVersion);
  assert.notEqual(REASONING_GROQ_CONFIGURATION.promptVersion,
    createGroqGenerationAdapter().configuration.promptVersion);
  const invocation = readProviderInvocation({
    adapterId: REASONING_QWEN_CONFIGURATION.adapterId,
    adapterVersion: REASONING_QWEN_CONFIGURATION.adapterVersion,
    endpointIdentity: REASONING_QWEN_CONFIGURATION.endpoint,
    promptVersion: REASONING_QWEN_CONFIGURATION.promptVersion,
    schemaVersion: REASONING_QWEN_CONFIGURATION.schemaVersion,
    outputContractVersion: REASONING_QWEN_CONFIGURATION.outputContractVersion,
    parameters: REASONING_QWEN_CONFIGURATION.parameters,
    outcome: 'response', validation: 'passed',
  });
  assert.equal(invocation.promptVersion, REASONING_QWEN_CONFIGURATION.promptVersion);
  assert.throws(() => readProviderInvocation({ ...invocation,
    promptVersion: createOllamaGenerationAdapter().configuration.promptVersion }));
  for (const [legacy, wrongVersion] of [
    [createOllamaGenerationAdapter().configuration, REASONING_GROQ_CONFIGURATION.adapterVersion],
    [createGroqGenerationAdapter().configuration, REASONING_QWEN_CONFIGURATION.adapterVersion],
  ] as const) {
    assert.throws(() => readProviderInvocation({
      adapterId: legacy.adapterId, adapterVersion: wrongVersion,
      endpointIdentity: legacy.endpoint, promptVersion: legacy.promptVersion,
      schemaVersion: legacy.schemaVersion, outputContractVersion: legacy.outputContractVersion,
      parameters: legacy.parameters, outcome: 'response', validation: 'passed',
    }), 'A reserved reasoning version must not be accepted as the other provider legacy profile');
  }
});

test('reasoning Local emits one complete bounded request and discards hidden thinking before validation', serial, async () => {
  const fixture = generationFixture();
  const native = nativeHarness(metadataReplies(fixture.proposal));
  const adapter = createReasoningOllamaGenerationAdapter(native.request);
  const request = reasoningRequest();
  const prepared = await adapter.prepare(request, new AbortController().signal) as {
    ok: true; fit: { inputTokens: number; reservedOutputTokens: number; contextTokenLimit: number; outputTokenLimit: number };
    dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown>;
  };
  assert.equal(prepared.ok, true);
  assert.equal(native.calls.length, 3);
  const dispatched = await prepared.dispatch(new AbortController().signal, start => start()) as Record<string, unknown>;
  assert.equal(dispatched.ok, true);
  assert.equal(JSON.stringify(dispatched).includes('private reasoning'), false);

  const body = JSON.parse(native.calls[3]!.body) as Record<string, any>;
  const pure = prepareReasoningOllamaGenerationWire(request);
  assert.equal(pure.ok, true);
  if (!pure.ok) return;
  assert.deepEqual(body, JSON.parse(pure.body));
  assert.deepEqual(prepared.fit, pure.fit);
  assert.deepEqual(Object.keys(body).sort(), ['keep_alive', 'messages', 'model', 'options', 'shift', 'stream', 'think', 'truncate'].sort());
  assert.deepEqual(body.messages.map((message: Record<string, unknown>) => message.role), ['system', 'user']);
  assert.equal(body.stream, false);
  assert.equal(body.think, true);
  assert.equal(body.truncate, false);
  assert.equal(body.shift, false);
  assert.equal(body.keep_alive, '5m');
  assert.deepEqual(body.options, {
    num_ctx: 32768, num_predict: 12288, temperature: 1, top_p: 0.95,
  });
  const schema = JSON.stringify(request.schema);
  assert.equal(count(body.messages[0].content, schema), 1, 'The issued schema must be counted and sent exactly once');
  assert.equal(Object.hasOwn(body, 'format'), false, 'Reasoning Local must not use native format placement');
  const expectedInput = Buffer.byteLength(body.messages[0].content, 'utf8')
    + Buffer.byteLength(body.messages[1].content, 'utf8') + 88;
  assert.equal(pure.fit.inputTokens, expectedInput);
  assert.equal(pure.fit.reservedOutputTokens, 12288);
  assert.equal(pure.fit.contextTokenLimit, 32768);
  assert.equal(pure.fit.outputTokenLimit, 12288);
  assert.ok(expectedInput + 12288 + 32 <= 32768);
  assert.ok((native.calls[3]!.timeout ?? 0) > 0 && (native.calls[3]!.timeout ?? Infinity) <= 300000);
});

test('reasoning Local admits the exact complete bound and rejects one excess byte before metadata', serial, async () => {
  const base = reasoningRequest();
  const baseline = prepareReasoningOllamaGenerationWire(base);
  assert.equal(baseline.ok, true);
  if (!baseline.ok) return;
  const remaining = 32768 - baseline.fit.inputTokens - 12288 - 32;
  assert.ok(remaining > 0);

  const exact = prepareReasoningOllamaGenerationWire(
    reasoningRequest(REASONING_QWEN_CONFIGURATION, 'x'.repeat(remaining)));
  assert.equal(exact.ok, true);
  if (!exact.ok) return;
  assert.equal(exact.fit.inputTokens + 12288 + 32, 32768);

  assert.deepEqual(prepareReasoningOllamaGenerationWire(
    reasoningRequest(REASONING_QWEN_CONFIGURATION, 'x'.repeat(remaining + 1))),
  { ok: false, error: 'input-fit' });
  assert.throws(() => createCaseGenerationRequest([
    { role: 'system', content: reasoningGenerationInstructions('image-alt') },
    { role: 'user', content: '\ud800' },
  ], { findingId: 'finding-0', availableEvidenceReferences: [evidenceReference], passageIds: [passageId] },
  REASONING_QWEN_CONFIGURATION));
});

test('reasoning adapters reject mixed tuples and malformed terminal responses without fallback', serial, async () => {
  const localRequest = reasoningRequest();
  const legacy = createOllamaGenerationAdapter(nativeHarness([]).request);
  assert.deepEqual(await legacy.prepare(localRequest, new AbortController().signal),
    { ok: false, error: 'configuration', cleanup: 'complete' });

  const fixture = generationFixture();
  for (const overrides of [
    { done: false },
    { done_reason: 'length' },
    { model: 'other' },
    { message: { role: 'assistant', content: JSON.stringify(fixture.proposal), thinking: { private: true } } },
    { message: { role: 'assistant', content: `${JSON.stringify(fixture.proposal)} trailing`, thinking: 'private' } },
  ]) {
    const native = nativeHarness(metadataReplies(fixture.proposal, '').map((reply, index) => index === 3
      ? { body: ollamaChatBody(fixture.proposal, overrides) } : reply));
    const adapter = createReasoningOllamaGenerationAdapter(native.request);
    const prepared = await adapter.prepare(localRequest, new AbortController().signal) as {
      ok: true; dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown>;
    };
    assert.equal(prepared.ok, true);
    assert.deepEqual(await prepared.dispatch(new AbortController().signal, start => start()),
      { ok: false, error: 'incomplete-output', cleanup: 'complete' });
    assert.equal(native.calls.filter(call => call.options.path === '/api/chat').length, 1);
  }
});

test('service entry owns one Local deadline across admission, genuine input construction and publication', serial, async t => {
  const base = Date.parse('2026-09-22T12:00:00.000Z');
  for (const [name, admissionElapsed, terminalElapsed, expected] of [
    ['success after 180 seconds', 0, 180000, 'success'],
    ['pre-admission time is charged', 180000, 299999, 'success'],
    ['expiry at 300 seconds', 180000, 300000, 'timeout'],
  ] as const) await t.test(name, async child => {
    let now = base;
    child.mock.method(Date, 'now', () => now);
    let durable = assessedSupportedRetrievalRun() as any;
    let updates = 0;
    let capturedRequest: any;
    let capturedWire: ReturnType<typeof prepareReasoningOllamaGenerationWire> | undefined;
    const fixture = generationFixture();
    const adapter = Object.freeze({
      configuration: REASONING_QWEN_CONFIGURATION,
      prepare(request: any) {
        capturedRequest = request;
        const wire = prepareReasoningOllamaGenerationWire(request);
        assert.equal(wire.ok, true);
        if (!wire.ok) throw new Error('Synthetic reasoning request must prepare');
        capturedWire = wire;
        return Object.freeze({
          ok: true as const, request, configuration: REASONING_QWEN_CONFIGURATION,
          fit: wire.fit,
          dispatch(_signal: AbortSignal, attempt: <T>(start: () => T) => T) {
            return attempt(() => {
              now = base + terminalElapsed;
              return Object.freeze({ ok: true as const, candidate: fixture.proposal,
                complete: true as const, cleanup: 'complete' as const });
            });
          },
          cleanup: 'complete' as const,
        });
      },
    });
    const operation = createGenerationOperation({
      repository: {
        read: () => ({ ok: true, value: durable }),
        updateGeneration: (_expected: unknown, replacement: unknown) => {
          updates++;
          durable = replacement;
          if (updates === 1) now = base + admissionElapsed;
          return { ok: true, value: durable };
        },
      },
      retrieval: { takeOwner: () => true },
      isStopping: () => false,
      deadlineExpired: () => false,
      closeAdmission: () => assert.fail('Clean synthetic settlement must not close admission'),
      markStopFailed: () => assert.fail('Clean synthetic settlement must not mark stop failure'),
    } as never);
    let settle!: (value: any) => void;
    const promise = new Promise<any>(resolve => { settle = resolve; });
    const result = await operation.start({ runId: 'run-01', findingId: 'finding-0' }, adapter as never, {
      controller: new AbortController(), promise, settle, onDeadline: () => undefined,
    });
    assert.equal(result.ok, expected === 'success');
    if (!result.ok) assert.equal(result.error, 'timeout');
    assert.equal(capturedRequest.configuration, REASONING_QWEN_CONFIGURATION);
    assert.equal(capturedRequest.deadlineMs, 300000);
    const user = JSON.parse(capturedRequest.messages[1].content);
    assert.equal(user.finding.findingId, 'finding-0');
    assert.deepEqual(capturedRequest.schema.properties.findingId.enum, ['finding-0']);
    assert.ok(capturedWire?.ok);
    if (capturedWire?.ok) {
      const wire = JSON.parse(capturedWire.body);
      assert.equal(count(wire.messages[0].content, JSON.stringify(capturedRequest.schema)), 1);
    }
  });
});

test('reasoning Groq preserves strict schema output, fixed 120 second policy and credential boundaries', serial, async () => {
  const credential = virtualCredentialIO({ content: `GROQ_API_KEY=${SYNTHETIC_GROQ_CREDENTIAL}\n` });
  const fixture = generationFixture();
  const native = groqNativeHarness([{ body: groqChatBody(fixture.proposal) }]);
  const adapter = createReasoningGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: native.request });
  const request = reasoningRequest(REASONING_GROQ_CONFIGURATION);
  const prepared = await adapter.prepare(request, new AbortController().signal) as {
    ok: true; dispatch(signal: AbortSignal, attempt: <T>(start: () => T) => T): Promise<unknown>;
  };
  assert.equal(prepared.ok, true);
  assert.equal(native.calls.length, 0);
  assert.equal((await prepared.dispatch(new AbortController().signal, start => start()) as { ok: boolean }).ok, true);
  const body = JSON.parse(native.calls[0]!.body.toString('utf8')) as Record<string, any>;
  assert.deepEqual(body.response_format, {
    type: 'json_schema', json_schema: { name: 'm301_proposal_v1', strict: true, schema: request.schema },
  });
  assert.equal(body.messages[0].content.includes(JSON.stringify(request.schema)), false,
    'Groq keeps its strict schema field instead of duplicating it in instructions');
  assert.ok((native.calls[0]!.timeout ?? 0) > 0 && (native.calls[0]!.timeout ?? Infinity) <= 120000);
  assert.equal(native.calls[0]!.body.includes(SYNTHETIC_GROQ_CREDENTIAL), false);
});

test('ordinary resolution selects native-schema Local and uncertainty Groq while historical reasoning and judgment remain distinct', serial, async t => {
  assert.strictEqual(resolveGenerationAdapter(localContext).configuration, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  assert.strictEqual(resolveGenerationAdapter(groqContext).configuration, UNCERTAINTY_GROQ_CONFIGURATION);
  assert.notStrictEqual(UNCERTAINTY_QWEN_CONFIGURATION, JUDGMENT_QWEN_CONFIGURATION);
  assert.notStrictEqual(UNCERTAINTY_GROQ_CONFIGURATION, JUDGMENT_GROQ_CONFIGURATION);

  const fixture = generationFixture();
  const native = nativeHarness([
    ...metadataReplies(fixture.proposal).slice(0, 3),
    { hold: true },
  ]);
  const adapter = createReasoningOllamaGenerationAdapter(native.request);
  let release!: (value: ReturnType<typeof admission>) => void;
  const gate = new Promise<ReturnType<typeof admission>>(resolve => { release = resolve; });
  function admission() {
    return {
      status: 'ready' as const,
      createRequest: () => reasoningRequest(),
      validateCandidate: (candidate: unknown) => validateProposal(candidate, { finding: fixture.finding, retrieval: fixture.retrieval }),
    };
  }
  const base = Date.parse('2026-09-22T12:00:00.000Z');
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: base });
  try {
    const pending = executeGenerationOperation({
      signal: new AbortController().signal,
      providerContext: localContext,
      adapter,
      expiresAt: base + 300000,
      admit: () => gate,
    });
    t.mock.timers.tick(180001);
    release(admission());
    for (let attempt = 0; attempt < 20 && native.calls.length < 4; attempt++) await Promise.resolve();
    assert.equal(native.calls.length, 4);
    assert.ok((native.calls[3]!.timeout ?? Infinity) <= 119999,
      'Transport must receive only the service-entry budget that remains after admission');
    t.mock.timers.tick(119999);
    assert.deepEqual(await pending, {
      status: 'failed', error: 'timeout', attempted: true,
      observation: {
        adapterConfiguration: {
          adapterId: REASONING_QWEN_CONFIGURATION.adapterId,
          adapterVersion: REASONING_QWEN_CONFIGURATION.adapterVersion,
          endpointIdentity: REASONING_QWEN_CONFIGURATION.endpoint,
          promptVersion: REASONING_QWEN_CONFIGURATION.promptVersion,
          schemaVersion: REASONING_QWEN_CONFIGURATION.schemaVersion,
          outputContractVersion: REASONING_QWEN_CONFIGURATION.outputContractVersion,
          parameters: REASONING_QWEN_CONFIGURATION.parameters,
        },
        outcome: 'timeout', validation: 'not-run',
      },
      cleanupFailed: true,
    });
  } finally {
    t.mock.timers.reset();
  }
});
