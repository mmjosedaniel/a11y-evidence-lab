import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import {
  NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION,
  NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER,
  NATIVE_SCHEMA_PROMPT_VERSION,
  NATIVE_SCHEMA_VERSION,
  OUTPUT_CONTRACT_VERSION,
} from '../src/server/generation/generation-artifacts.ts';
import { createCaseGenerationRequest } from '../src/server/generation/generation-case-request.ts';
import type {
  GenerationInitialPromptFit,
  GenerationRequest,
  PreparedGeneration,
} from '../src/server/generation/generation-contract.ts';
import { readProviderInvocation } from '../src/server/generation/generation-contract.ts';
import { validateGenerationConfiguration, validatePreparedGenerationFit } from '../src/server/generation/generation-fit.ts';
import { createGenerationRequest } from '../src/server/generation/generation-input.ts';
import { executeGenerationOperation } from '../src/server/generation/generation-execution.ts';
import { createGroqGenerationAdapter } from '../src/server/generation/groq-generation.ts';
import {
  createNativeSchemaOllamaGenerationAdapter,
  createOllamaGenerationAdapter,
  createUncertaintyOllamaGenerationAdapter,
} from '../src/server/generation/ollama-generation.ts';
import {
  prepareNativeSchemaOllamaGenerationWire,
  prepareUncertaintyOllamaGenerationWire,
} from '../src/server/generation/ollama-generation-fit.ts';
import { prepareUncertaintyGroqGenerationWire } from '../src/server/generation/groq-generation-fit.ts';
import {
  validateNativeSchemaPostChangeVerificationReminder,
  validateProposal,
} from '../src/server/generation/proposal-contract.ts';
import { blockingManualJudgmentForRule } from '../src/server/generation/profile-judgment.ts';
import {
  NATIVE_SCHEMA_QWEN_CONFIGURATION,
  UNCERTAINTY_GROQ_CONFIGURATION,
  UNCERTAINTY_QWEN_CONFIGURATION,
  configurationDeadlineMs,
} from '../src/server/generation/reasoning-generation-configuration.ts';
import {
  nativeSchemaGenerationInstructions,
  uncertaintyGenerationInstructions,
} from '../src/server/generation/reasoning-generation-instructions.ts';
import { resolveGenerationAdapter } from '../src/server/local-service/generation-adapters.ts';
import { cloneCandidate, generationFixture } from './helpers/m302-generation-fixture.ts';
import { nativeHarness, ollamaChatBody, validMetadata } from './helpers/m303-ollama-fixture.ts';
import { loadM602Package, type M602CaseLabel } from './helpers/m602-package.ts';

const serial = { concurrency: false };
const localContext = Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' } as const);
const groqContext = Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' } as const);
const labels = [
  'local-image', 'local-label', 'local-contrast',
  'groq-image', 'groq-label', 'groq-contrast',
] as const satisfies readonly M602CaseLabel[];
const ruleByLabel = Object.freeze({
  'local-image': 'image-alt', 'local-label': 'label', 'local-contrast': 'color-contrast',
  'groq-image': 'image-alt', 'groq-label': 'label', 'groq-contrast': 'color-contrast',
} as const);
const historicalUncertaintyWires = Object.freeze({
  'local-image': [17219, '74b4e38a8842b9584f819b95aba29a8caaa3e177ad459ba699bfb4bf3a8935b9'],
  'local-label': [19438, '41f0d5ae92c4f19c81b8bcce66e01c281a9016cf0f71368d15394e9f68a936cd'],
  'local-contrast': [19793, '6d706aa86a6deca619375be98c6f7fde5efc1321f23540ff2fa9e4e546f19599'],
  'groq-image': [16918, '489747d50e23a9d6b41374a4d7948b7648aeaae4d7814788e9c876105ade5f99'],
  'groq-label': [19095, '022b61b8256aac8419b5222f4a793c9b9436a92a2b13a7d1559f1165288a9050'],
  'groq-contrast': [19462, 'dfe1a12d25b10055da323ac8f8e7f3f797523d45b7eae17d6deb8982f59ed9a7'],
} as const);

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function ready(label: M602CaseLabel) {
  const loaded = loadM602Package(label);
  assert.equal(loaded.status, 'ready');
  if (loaded.status !== 'ready') throw new Error(`M6-02 package ${label} is unavailable`);
  return loaded.value;
}

function historicalUncertaintyRequest(label: M602CaseLabel): GenerationRequest {
  const pkg = ready(label);
  const configuration = label.startsWith('local-') ? UNCERTAINTY_QWEN_CONFIGURATION : UNCERTAINTY_GROQ_CONFIGURATION;
  const legacyConfiguration = label.startsWith('local-')
    ? createOllamaGenerationAdapter().configuration
    : createGroqGenerationAdapter().configuration;
  const legacy = pkg.createRequest(legacyConfiguration);
  return createCaseGenerationRequest([
    { role: 'system', content: uncertaintyGenerationInstructions(ruleByLabel[label]) }, legacy.messages[1]!,
  ], {
    findingId: pkg.findingId,
    availableEvidenceReferences: pkg.availableEvidenceReferences,
    passageIds: pkg.passageIds,
  }, configuration);
}

function nativeRequest(label: Extract<M602CaseLabel, `local-${string}`>, padding = 0): GenerationRequest {
  const pkg = ready(label);
  const legacy = pkg.createRequest(createOllamaGenerationAdapter().configuration);
  const input = JSON.parse(legacy.messages[1]!.content) as Parameters<typeof createGenerationRequest>[0];
  const admitted = createGenerationRequest(input, localContext, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  if (padding === 0) return admitted;
  return createCaseGenerationRequest([
    { role: 'system', content: `${admitted.messages[0]!.content}${'x'.repeat(padding)}` },
    admitted.messages[1]!,
  ], {
    findingId: pkg.findingId,
    availableEvidenceReferences: pkg.availableEvidenceReferences,
    passageIds: pkg.passageIds,
  }, NATIVE_SCHEMA_QWEN_CONFIGURATION);
}

test('publishes one exact immutable native Local configuration and invocation tuple', serial, () => {
  assert.equal(NATIVE_SCHEMA_PROMPT_VERSION, 'm602-native-schema-instructions-v1');
  assert.equal(NATIVE_SCHEMA_VERSION, 'm602-native-schema-v1');
  assert.equal(NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION, 'm602-ollama-native-schema-v1');
  assert.equal(NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER,
    'After changes, rescan and perform relevant human verification.');
  assert.equal(NATIVE_SCHEMA_QWEN_CONFIGURATION.binding.effectiveConfigurationIdentity,
    'm602-qwen35-native-schema-32768-v1');
  assert.deepEqual(NATIVE_SCHEMA_QWEN_CONFIGURATION.parameters, UNCERTAINTY_QWEN_CONFIGURATION.parameters);
  assert.equal(configurationDeadlineMs(NATIVE_SCHEMA_QWEN_CONFIGURATION), 300000);
  assert.deepEqual(NATIVE_SCHEMA_QWEN_CONFIGURATION.accounting, {
    method: 'initial-prompt-upper-bound', implementationVersion: 'm602-qwen35-initial-prompt-bound-v1',
    tokenizerIdentity: null, contextTokenLimit: 32768, perCompletionOutputTokenLimit: 12288,
    maximumNativeCompletions: 2, maximumAggregateGeneratedTokens: 24576,
  });
  assert.ok(Object.isFrozen(NATIVE_SCHEMA_QWEN_CONFIGURATION));
  assert.ok(Object.isFrozen(NATIVE_SCHEMA_QWEN_CONFIGURATION.accounting));
  assert.deepEqual(validateGenerationConfiguration(NATIVE_SCHEMA_QWEN_CONFIGURATION, localContext),
    { ok: true, value: NATIVE_SCHEMA_QWEN_CONFIGURATION });
  assert.deepEqual(validateGenerationConfiguration(NATIVE_SCHEMA_QWEN_CONFIGURATION, groqContext),
    { ok: false, error: 'configuration' });
  const invocation = readProviderInvocation({
    adapterId: 'ollama-generation', adapterVersion: NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION,
    endpointIdentity: 'ollama-loopback-chat', promptVersion: NATIVE_SCHEMA_PROMPT_VERSION,
    schemaVersion: NATIVE_SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION,
    parameters: NATIVE_SCHEMA_QWEN_CONFIGURATION.parameters, outcome: 'response', validation: 'passed',
  });
  assert.equal(invocation.promptVersion, NATIVE_SCHEMA_PROMPT_VERSION);
  assert.throws(() => readProviderInvocation({ ...invocation, adapterVersion: UNCERTAINTY_QWEN_CONFIGURATION.adapterVersion }));
  assert.throws(() => readProviderInvocation({ ...invocation, schemaVersion: UNCERTAINTY_QWEN_CONFIGURATION.schemaVersion }));
});

test('builds the complete native request and exact format wire from real admitted inputs', serial, async () => {
  for (const label of ['local-image', 'local-label', 'local-contrast'] as const) {
    const request = nativeRequest(label);
    const legacy = ready(label).createRequest(createOllamaGenerationAdapter().configuration);
    assert.equal(request.messages.length, 2, label);
    assert.equal(request.messages[0]!.role, 'system', label);
    assert.equal(request.messages[1]!.role, 'user', label);
    assert.equal(request.messages[0]!.content, nativeSchemaGenerationInstructions(ruleByLabel[label]), label);
    assert.equal(request.messages[1]!.content, legacy.messages[1]!.content, label);
    const reminder = (request.schema as { properties: { postChangeVerificationReminder: Record<string, unknown> } })
      .properties.postChangeVerificationReminder;
    assert.deepEqual(reminder.enum, [NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER], label);
    const wire = prepareNativeSchemaOllamaGenerationWire(request);
    assert.equal(wire.ok, true, label);
    if (!wire.ok) continue;
    const body = JSON.parse(wire.body) as Record<string, any>;
    assert.deepEqual(body.format, request.schema, label);
    assert.equal(body.messages.length, 2, label);
    assert.equal(body.messages[0].content.split(JSON.stringify(request.schema)).length - 1, 1, label);
    assert.deepEqual({ stream: body.stream, think: body.think, truncate: body.truncate,
      shift: body.shift, keep_alive: body.keep_alive },
    { stream: false, think: true, truncate: false, shift: false, keep_alive: '5m' }, label);
    assert.deepEqual(body.options,
      { num_ctx: 32768, num_predict: 12288, temperature: 1, top_p: 0.95 }, label);
    const expectedInput = Buffer.byteLength(body.messages[0].content, 'utf8')
      + Buffer.byteLength(body.messages[1].content, 'utf8') + 88;
    assert.deepEqual(wire.fit, {
      accounting: NATIVE_SCHEMA_QWEN_CONFIGURATION.accounting,
      initialInputTokens: expectedInput, firstCompletionReservedTokens: 12288,
      contextTokenLimit: 32768, perCompletionOutputTokenLimit: 12288,
      maximumNativeCompletions: 2, maximumAggregateGeneratedTokens: 24576,
    } satisfies GenerationInitialPromptFit, label);
  }

  const fixture = generationFixture('image-alt');
  const candidate = cloneCandidate(fixture.proposal);
  candidate.blockingManualJudgment = blockingManualJudgmentForRule('image-alt');
  candidate.postChangeVerificationReminder = NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER;
  const metadata = validMetadata();
  const native = nativeHarness([
    { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) },
    { body: ollamaChatBody(candidate, { message: { role: 'assistant', content: JSON.stringify(candidate),
      thinking: 'private reasoning that must be discarded' } }) },
  ]);
  const prepared = await createNativeSchemaOllamaGenerationAdapter(native.request)
    .prepare(nativeRequest('local-image'), new AbortController().signal) as PreparedGeneration;
  assert.equal(prepared.ok, true);
  if (!prepared.ok) throw new Error('Native request must prepare with synthetic metadata');
  const dispatchedUnknown = await prepared.dispatch(new AbortController().signal, start => start());
  assert.ok(typeof dispatchedUnknown === 'object' && dispatchedUnknown !== null);
  const dispatched = dispatchedUnknown as { readonly ok: boolean };
  assert.equal(dispatched.ok, true);
  assert.equal(JSON.stringify(dispatched).includes('private reasoning'), false);
  const body = JSON.parse(native.calls.at(-1)!.body) as Record<string, any>;
  assert.deepEqual(body.format, nativeRequest('local-image').schema);
  assert.equal(body.think, true);
  assert.ok((native.calls.at(-1)!.timeout ?? 0) > 0 && (native.calls.at(-1)!.timeout ?? Infinity) <= 300000);
});

test('admits the exact initial prompt boundary and rejects one byte over before effects', serial, async () => {
  const baseline = prepareNativeSchemaOllamaGenerationWire(nativeRequest('local-image'));
  assert.equal(baseline.ok, true);
  if (!baseline.ok) throw new Error('Native baseline must fit');
  const remaining = 32768 - baseline.fit.initialInputTokens - 12288 - 32;
  assert.ok(remaining >= 0);
  const exact = prepareNativeSchemaOllamaGenerationWire(nativeRequest('local-image', remaining));
  assert.equal(exact.ok, true);
  if (exact.ok) assert.equal(exact.fit.initialInputTokens + exact.fit.firstCompletionReservedTokens + 32, 32768);
  assert.deepEqual(prepareNativeSchemaOllamaGenerationWire(nativeRequest('local-image', remaining + 1)),
    { ok: false, error: 'input-fit' });

  const native = nativeHarness([]);
  const adapter = createNativeSchemaOllamaGenerationAdapter(native.request);
  const rejected = await adapter.prepare(nativeRequest('local-image', remaining + 1), new AbortController().signal);
  assert.deepEqual(rejected, { ok: false, error: 'input-fit', cleanup: 'complete' });
  assert.equal(native.calls.length, 0);
});

test('rejects mixed requests, configurations and fit variants before effects', serial, async () => {
  const request = nativeRequest('local-image');
  const nativePrepared = prepareNativeSchemaOllamaGenerationWire(request);
  const historicalRequest = historicalUncertaintyRequest('local-image');
  const historicalPrepared = prepareUncertaintyOllamaGenerationWire(historicalRequest);
  assert.equal(nativePrepared.ok, true);
  assert.equal(historicalPrepared.ok, true);
  if (!nativePrepared.ok || !historicalPrepared.ok) throw new Error('Both fit variants must prepare');
  assert.equal(validatePreparedGenerationFit(nativePrepared.fit, NATIVE_SCHEMA_QWEN_CONFIGURATION), true);
  assert.equal(validatePreparedGenerationFit(nativePrepared.fit, UNCERTAINTY_QWEN_CONFIGURATION), false);
  assert.equal(validatePreparedGenerationFit(historicalPrepared.fit, NATIVE_SCHEMA_QWEN_CONFIGURATION), false);
  assert.equal(validatePreparedGenerationFit(historicalPrepared.fit, UNCERTAINTY_QWEN_CONFIGURATION), true);
  assert.equal(validatePreparedGenerationFit({ ...nativePrepared.fit,
    accounting: { ...NATIVE_SCHEMA_QWEN_CONFIGURATION.accounting } }, NATIVE_SCHEMA_QWEN_CONFIGURATION), false);
  assert.deepEqual(validateGenerationConfiguration(Object.freeze({ ...NATIVE_SCHEMA_QWEN_CONFIGURATION,
    accounting: UNCERTAINTY_QWEN_CONFIGURATION.accounting }), localContext), { ok: false, error: 'configuration' });

  const native = nativeHarness([]);
  assert.equal((await createNativeSchemaOllamaGenerationAdapter(native.request)
    .prepare(historicalRequest, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal((await createUncertaintyOllamaGenerationAdapter(native.request)
    .prepare(request, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal(native.calls.length, 0);
});

async function executeReminder(rawReminder: string, returnedReminder: string) {
  const request = nativeRequest('local-image');
  const prepared = prepareNativeSchemaOllamaGenerationWire(request);
  assert.equal(prepared.ok, true);
  if (!prepared.ok) throw new Error('Native request must fit');
  const raw = cloneCandidate(generationFixture('image-alt').proposal);
  raw.blockingManualJudgment = blockingManualJudgmentForRule('image-alt');
  raw.postChangeVerificationReminder = rawReminder;
  const returned = cloneCandidate(raw);
  returned.postChangeVerificationReminder = returnedReminder;
  let transports = 0;
  let validations = 0;
  const adapter = Object.freeze({
    configuration: NATIVE_SCHEMA_QWEN_CONFIGURATION,
    prepare(): PreparedGeneration {
      return Object.freeze({ ok: true as const, request, configuration: NATIVE_SCHEMA_QWEN_CONFIGURATION,
        fit: prepared.fit, cleanup: 'complete' as const,
        dispatch(_signal: AbortSignal, attempt: <T>(start: () => T) => T) {
          return attempt(() => { transports++; return Object.freeze({ ok: true as const,
            candidate: raw, complete: true as const, cleanup: 'complete' as const }); });
        } });
    },
  });
  const outcome = await executeGenerationOperation({
    signal: new AbortController().signal, providerContext: localContext, adapter,
    admit: () => ({ status: 'ready' as const, createRequest: () => request,
      validateCandidate: () => { validations++; return Object.freeze({ ok: true as const, value: returned as never }); } }),
  });
  return { outcome, transports, validations };
}

test('enforces the fixed reminder before and after normalization without repair or retry', serial, async () => {
  const exact = NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER;
  assert.equal(validateNativeSchemaPostChangeVerificationReminder({ postChangeVerificationReminder: exact }), true);
  assert.equal(validateNativeSchemaPostChangeVerificationReminder({ postChangeVerificationReminder: 'Rescan later.' }), false);
  for (const [raw, returned, validations] of [
    ['Rescan later.', exact, 0], [exact, 'Rescan later.', 1],
  ] as const) {
    const result = await executeReminder(raw, returned);
    assert.equal(result.outcome.status, 'failed');
    if (result.outcome.status === 'failed') {
      assert.equal(result.outcome.error, 'response-validation');
      assert.equal(result.outcome.attempted, true);
    }
    assert.equal(result.transports, 1);
    assert.equal(result.validations, validations);
  }
  const accepted = await executeReminder(exact, exact);
  assert.equal(accepted.outcome.status, 'proposal');
  assert.deepEqual({ transports: accepted.transports, validations: accepted.validations }, { transports: 1, validations: 1 });

  const fixture = generationFixture('image-alt');
  const edited = cloneCandidate(fixture.proposal);
  edited.postChangeVerificationReminder = 'A reviewer may choose an appropriate follow-up after editing.';
  assert.equal(validateProposal(edited, { finding: fixture.finding, retrieval: fixture.retrieval }).ok, true,
    'Generic durable and human-edit validation remains unchanged');
});

test('selects the native Local default and preserves Groq uncertainty plus all six historical wires', serial, () => {
  assert.strictEqual(resolveGenerationAdapter(localContext).configuration, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  assert.strictEqual(resolveGenerationAdapter(groqContext).configuration, UNCERTAINTY_GROQ_CONFIGURATION);
  assert.strictEqual(createNativeSchemaOllamaGenerationAdapter().configuration, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  assert.notStrictEqual(createUncertaintyOllamaGenerationAdapter().configuration, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  for (const label of labels) {
    const request = historicalUncertaintyRequest(label);
    const prepared = label.startsWith('local-')
      ? prepareUncertaintyOllamaGenerationWire(request)
      : prepareUncertaintyGroqGenerationWire(request);
    assert.equal(prepared.ok, true, label);
    if (!prepared.ok) continue;
    assert.deepEqual([Buffer.byteLength(prepared.body, 'utf8'), sha256(prepared.body)],
      historicalUncertaintyWires[label], label);
  }
});
