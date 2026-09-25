import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { GENERATION_SCHEMA, OUTPUT_CONTRACT_VERSION, PROMPT_CASE_VERSION, PROMPT_VERSION } from '../src/server/generation/generation-artifacts.ts';
import {
  CASE_GROQ_CONFIGURATION,
  CASE_QWEN_CONFIGURATION,
  CASE_SCHEMA_VERSION,
  PROMPT_CASE_GROQ_CONFIGURATION,
  PROMPT_CASE_QWEN_CONFIGURATION,
  createCaseGenerationRequest,
  readCaseGenerationSchema,
} from '../src/server/generation/generation-case-request.ts';
import { readProviderInvocation } from '../src/server/generation/generation-contract.ts';
import type { GenerationConfiguration, GenerationRequest, PreparedGeneration } from '../src/server/generation/generation-contract.ts';
import { validateGenerationConfiguration } from '../src/server/generation/generation-fit.ts';
import { createCaseGroqGenerationAdapter, createGroqGenerationAdapter, createPromptCaseGroqGenerationAdapter } from '../src/server/generation/groq-generation.ts';
import { GROQ_CONFIGURATION } from '../src/server/generation/groq-generation-configuration.ts';
import { prepareCaseGroqGenerationWire, preparePromptCaseGroqGenerationWire } from '../src/server/generation/groq-generation-fit.ts';
import { createCaseOllamaGenerationAdapter, createOllamaGenerationAdapter, createPromptCaseOllamaGenerationAdapter } from '../src/server/generation/ollama-generation.ts';
import { prepareCaseOllamaGenerationWire, preparePromptCaseOllamaGenerationWire } from '../src/server/generation/ollama-generation-fit.ts';
import { QWEN_CONFIGURATION } from '../src/server/generation/ollama-generation-model.ts';
import { groqChatBody, groqNativeHarness, virtualCredentialIO } from './helpers/m304-groq-fixture.ts';
import { nativeHarness, ollamaChatBody, validMetadata } from './helpers/m303-ollama-fixture.ts';
import { loadM602Package } from './helpers/m602-package.ts';
import type { M602CaseLabel, M602Package } from './helpers/m602-package.ts';
import { canonicalSyntheticBundle } from './helpers/m602-synthetic-package.ts';

const labels = [
  'local-image', 'local-label', 'local-contrast',
  'groq-image', 'groq-label', 'groq-contrast',
] as const satisfies readonly M602CaseLabel[];

const schemaHashes = {
  'local-image': '702cb1dc1e96891bc893246f481c5d5a15805d72da079d53b8d9926bd75e075f',
  'local-label': '6ead6a4fb2e9f7c2f1ae770926cb16bc74878d4ae0a008e1d1c2927a229a0a06',
  'local-contrast': 'de787cfb0f38030867d8d28b87f4acd432f0d27dd3cfab4f9fe70bf372e58572',
  'groq-image': '702cb1dc1e96891bc893246f481c5d5a15805d72da079d53b8d9926bd75e075f',
  'groq-label': '6ead6a4fb2e9f7c2f1ae770926cb16bc74878d4ae0a008e1d1c2927a229a0a06',
  'groq-contrast': 'de787cfb0f38030867d8d28b87f4acd432f0d27dd3cfab4f9fe70bf372e58572',
} as const;

const promptInstructions = fs.readFileSync(path.resolve(import.meta.dirname,
  '../evaluation/m602-grounded-instructions-v1.txt'), 'utf8');
const syntheticPackageEnvironment = canonicalSyntheticBundle().environment;

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function ready(label: M602CaseLabel): M602Package {
  const result = loadM602Package(label, syntheticPackageEnvironment);
  assert.equal(result.status, 'ready');
  if (result.status !== 'ready') throw new Error(`M6-02 package ${label} is unavailable`);
  return result.value;
}

function legacyConfiguration(mode: 'local' | 'groq'): GenerationConfiguration {
  return mode === 'local' ? QWEN_CONFIGURATION : GROQ_CONFIGURATION;
}

function context(packageValue: M602Package) {
  return {
    findingId: packageValue.findingId,
    availableEvidenceReferences: [...packageValue.availableEvidenceReferences],
    passageIds: [...packageValue.passageIds],
  };
}

function createCaseRequest(packageValue: M602Package): GenerationRequest {
  const configuration = packageValue.caseLabel.startsWith('local-')
    ? CASE_QWEN_CONFIGURATION : CASE_GROQ_CONFIGURATION;
  const legacyConfiguration = packageValue.caseLabel.startsWith('local-')
    ? QWEN_CONFIGURATION : GROQ_CONFIGURATION;
  const legacy = packageValue.createRequest(legacyConfiguration);
  return createCaseGenerationRequest(legacy.messages, context(packageValue), configuration);
}

function createPromptCaseRequest(packageValue: M602Package): GenerationRequest {
  const configuration = packageValue.caseLabel.startsWith('local-')
    ? PROMPT_CASE_QWEN_CONFIGURATION : PROMPT_CASE_GROQ_CONFIGURATION;
  const legacy = packageValue.createRequest(legacyConfiguration(
    packageValue.caseLabel.startsWith('local-') ? 'local' : 'groq'));
  return createCaseGenerationRequest([
    { role: 'system', content: promptInstructions }, legacy.messages[1]!,
  ], context(packageValue), configuration);
}

function expectedSchema(packageValue: M602Package): Record<string, unknown> {
  const expected = JSON.parse(JSON.stringify(GENERATION_SCHEMA)) as {
    properties: Record<string, { enum?: readonly string[]; properties?: Record<string, { items?: { enum?: readonly string[] } }> }>;
  };
  expected.properties.findingId!.enum = [packageValue.findingId];
  for (const field of ['findingSummary', 'userImpact', 'remediation']) {
    const properties = expected.properties[field]!.properties!;
    properties.evidenceReferences!.items!.enum = [...packageValue.availableEvidenceReferences];
    properties.passageIds!.items!.enum = [...packageValue.passageIds];
  }
  return expected as unknown as Record<string, unknown>;
}

function assertDeepFrozen(value: unknown, seen = new Set<unknown>()): void {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  seen.add(value);
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child, seen);
}

test('issues exact detached case schemas for all three contexts in both provider modes without alias leakage', () => {
  for (const label of labels) {
    const packageValue = ready(label);
    const legacyConfiguration = label.startsWith('local-')
      ? QWEN_CONFIGURATION : GROQ_CONFIGURATION;
    const legacy = packageValue.createRequest(legacyConfiguration);
    const mutableMessages = legacy.messages.map(message => ({ ...message }));
    const mutableContext = context(packageValue);
    const configuration = label.startsWith('local-') ? CASE_QWEN_CONFIGURATION : CASE_GROQ_CONFIGURATION;
    const request = createCaseGenerationRequest(mutableMessages, mutableContext, configuration);
    const schema = readCaseGenerationSchema(request, configuration);

    assert.ok(schema);
    assert.deepEqual(schema, expectedSchema(packageValue));
    assert.equal(sha256(JSON.stringify(schema)), schemaHashes[label]);
    const schemaProperties = (schema as { properties: Record<string, Record<string, unknown>> }).properties;
    assert.deepEqual(Object.keys(schemaProperties.findingId!), ['type', 'enum']);
    assert.equal(Object.hasOwn(schemaProperties.uncertainty!, 'enum'), false);
    assert.equal(Object.hasOwn(schemaProperties.assumptions!.items as object, 'enum'), false);
    for (const field of ['findingSummary', 'userImpact', 'remediation']) {
      const fieldProperties = (schemaProperties[field] as unknown as { properties: Record<string, Record<string, unknown>> }).properties;
      assert.equal(Object.hasOwn(fieldProperties.text!, 'enum'), false);
    }
    assert.equal(request.schemaVersion, CASE_SCHEMA_VERSION);
    assert.equal(request.configuration, configuration);
    assert.equal(request.schema, schema);
    assert.deepEqual(request.messages, legacy.messages);
    assertDeepFrozen(request);

    mutableMessages[0]!.content = 'changed after issuance';
    mutableContext.availableEvidenceReferences.reverse();
    mutableContext.passageIds.reverse();
    assert.deepEqual(request.messages, legacy.messages);
    assert.deepEqual(schema, expectedSchema(packageValue));
  }
  assert.deepEqual(GENERATION_SCHEMA, JSON.parse(JSON.stringify(GENERATION_SCHEMA)));
});

test('rejects context drift, duplicate identifier domains, accessors, copies and schema transplants', () => {
  const image = ready('local-image');
  const label = ready('local-label');
  const imageLegacy = image.createRequest(legacyConfiguration('local'));
  const labelLegacy = label.createRequest(legacyConfiguration('local'));
  const imageRequest = createCaseGenerationRequest(imageLegacy.messages, context(image), CASE_QWEN_CONFIGURATION);
  const labelRequest = createCaseGenerationRequest(labelLegacy.messages, context(label), CASE_QWEN_CONFIGURATION);

  assert.equal(readCaseGenerationSchema({ ...imageRequest } as GenerationRequest, CASE_QWEN_CONFIGURATION), null);
  assert.equal(readCaseGenerationSchema({ ...imageRequest, schema: labelRequest.schema } as GenerationRequest, CASE_QWEN_CONFIGURATION), null);
  assert.equal(readCaseGenerationSchema(imageRequest, CASE_GROQ_CONFIGURATION), null);

  const drifted = context(image);
  drifted.findingId = 'finding-1';
  assert.notEqual(drifted.findingId, image.findingId);
  assert.throws(() => createCaseGenerationRequest(imageLegacy.messages, drifted, CASE_QWEN_CONFIGURATION));
  const duplicates = context(image);
  duplicates.passageIds[1] = duplicates.passageIds[0]!;
  assert.throws(() => createCaseGenerationRequest(imageLegacy.messages, duplicates, CASE_QWEN_CONFIGURATION));
  const empty = context(image);
  empty.availableEvidenceReferences = [];
  assert.throws(() => createCaseGenerationRequest(imageLegacy.messages, empty, CASE_QWEN_CONFIGURATION));

  let accessed = false;
  const accessor = context(image) as unknown as Record<string, unknown>;
  Object.defineProperty(accessor, 'findingId', { enumerable: true, get() { accessed = true; return image.findingId; } });
  assert.throws(() => createCaseGenerationRequest(imageLegacy.messages, accessor as never, CASE_QWEN_CONFIGURATION));
  assert.equal(accessed, false);
  assert.throws(() => createCaseGenerationRequest([
    { role: 'system', content: '\ud800' }, imageLegacy.messages[1]!,
  ], context(image), CASE_QWEN_CONFIGURATION));
});

test('binds the new invocation tuple and prepares all six case wires', () => {
  for (const configuration of [CASE_QWEN_CONFIGURATION, CASE_GROQ_CONFIGURATION]) {
    assert.deepEqual(validateGenerationConfiguration(configuration, configuration.providerContext), {
      ok: true, value: configuration,
    });
    const invocation = readProviderInvocation({
      adapterId: configuration.adapterId,
      adapterVersion: configuration.adapterVersion,
      endpointIdentity: configuration.endpoint,
      promptVersion: PROMPT_VERSION,
      schemaVersion: CASE_SCHEMA_VERSION,
      outputContractVersion: OUTPUT_CONTRACT_VERSION,
      parameters: configuration.parameters,
      outcome: 'response',
      validation: 'passed',
    });
    assert.equal(invocation.schemaVersion, CASE_SCHEMA_VERSION);
    assert.throws(() => readProviderInvocation({ ...invocation, promptVersion: 'm302-instructions-v1' }));
  }

  for (const label of labels) {
    const request = createCaseRequest(ready(label));
    const prepared = label.startsWith('local-')
      ? prepareCaseOllamaGenerationWire(request)
      : prepareCaseGroqGenerationWire(request);
    assert.ok(prepared.ok, label);
    if (!prepared.ok) continue;
    assert.ok(Buffer.byteLength(prepared.body, 'utf8') > 0, label);
    const parsed = JSON.parse(prepared.body) as Record<string, unknown>;
    const wireSchema = label.startsWith('local-')
      ? parsed.format
      : (((parsed.response_format as { json_schema: { schema: unknown } }).json_schema).schema);
    assert.deepEqual(wireSchema, request.schema, label);
  }
});

test('separates legacy and case adapters before effects and dispatches the exact prepared case body', async () => {
  const localPackage = ready('local-image');
  const localCase = createCaseRequest(localPackage);
  const localLegacy = localPackage.createRequest(legacyConfiguration('local'));
  const unusedLocal = nativeHarness([]);
  assert.equal((await createOllamaGenerationAdapter(unusedLocal.request).prepare(localCase, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal((await createCaseOllamaGenerationAdapter(unusedLocal.request).prepare(localLegacy, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal((await createCaseOllamaGenerationAdapter(unusedLocal.request).prepare({ ...localCase } as GenerationRequest, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal(unusedLocal.calls.length, 0);

  const localWire = prepareCaseOllamaGenerationWire(localCase);
  assert.ok(localWire.ok);
  const metadata = validMetadata();
  const localNative = nativeHarness([
    { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, { body: ollamaChatBody({ accepted: true }) },
  ]);
  const localPrepared = await createCaseOllamaGenerationAdapter(localNative.request)
    .prepare(localCase, new AbortController().signal) as PreparedGeneration;
  assert.ok(localPrepared.ok);
  if (localPrepared.ok && localWire.ok) {
    await localPrepared.dispatch(new AbortController().signal, start => start());
    assert.equal(localNative.calls[3]!.body, localWire.body);
  }

  const groqPackage = ready('groq-image');
  const groqCase = createCaseRequest(groqPackage);
  const groqLegacy = groqPackage.createRequest(legacyConfiguration('groq'));
  for (const [adapter, request] of [
    [createGroqGenerationAdapter, groqCase],
    [createCaseGroqGenerationAdapter, groqLegacy],
    [createCaseGroqGenerationAdapter, { ...groqCase } as GenerationRequest],
  ] as const) {
    const credential = virtualCredentialIO();
    const native = groqNativeHarness([]);
    const result = await adapter({ credentialIO: credential.io, requestImplementation: native.request })
      .prepare(request, new AbortController().signal) as { ok: boolean };
    assert.equal(result.ok, false);
    assert.equal(credential.calls.open.length, 0);
    assert.equal(native.calls.length, 0);
  }

  const groqWire = prepareCaseGroqGenerationWire(groqCase);
  assert.ok(groqWire.ok);
  const credential = virtualCredentialIO();
  const groqNative = groqNativeHarness([{ body: groqChatBody({ accepted: true }) }]);
  const groqPrepared = await createCaseGroqGenerationAdapter({ credentialIO: credential.io, requestImplementation: groqNative.request })
    .prepare(groqCase, new AbortController().signal) as PreparedGeneration;
  assert.ok(groqPrepared.ok);
  if (groqPrepared.ok && groqWire.ok) {
    await groqPrepared.dispatch(new AbortController().signal, start => start());
    assert.equal(groqNative.calls[0]!.body.toString('utf8'), groqWire.body);
  }
});

test('binds the frozen prompt revision to an exact tuple, six wires, and separate adapters before effects', async () => {
  for (const configuration of [PROMPT_CASE_QWEN_CONFIGURATION, PROMPT_CASE_GROQ_CONFIGURATION]) {
    assert.equal(configuration.promptVersion, PROMPT_CASE_VERSION);
    assert.equal(configuration.schemaVersion, CASE_SCHEMA_VERSION);
    assert.deepEqual(validateGenerationConfiguration(configuration, configuration.providerContext), {
      ok: true, value: configuration,
    });
    const invocation = readProviderInvocation({
      adapterId: configuration.adapterId,
      adapterVersion: configuration.adapterVersion,
      endpointIdentity: configuration.endpoint,
      promptVersion: PROMPT_CASE_VERSION,
      schemaVersion: CASE_SCHEMA_VERSION,
      outputContractVersion: OUTPUT_CONTRACT_VERSION,
      parameters: configuration.parameters,
      outcome: 'response',
      validation: 'passed',
    });
    assert.equal(invocation.promptVersion, PROMPT_CASE_VERSION);
    assert.throws(() => readProviderInvocation({ ...invocation, schemaVersion: 'm302-schema-v1' }));
  }

  for (const label of labels) {
    const packageValue = ready(label);
    const repaired = createCaseRequest(packageValue);
    const request = createPromptCaseRequest(packageValue);
    const configuration = label.startsWith('local-')
      ? PROMPT_CASE_QWEN_CONFIGURATION : PROMPT_CASE_GROQ_CONFIGURATION;
    const repairedConfiguration = label.startsWith('local-')
      ? CASE_QWEN_CONFIGURATION : CASE_GROQ_CONFIGURATION;
    assert.equal(request.promptVersion, PROMPT_CASE_VERSION, label);
    assert.equal(request.messages[0]!.content, promptInstructions, label);
    assert.equal(request.messages[1]!.content, repaired.messages[1]!.content, label);
    assert.deepEqual(request.schema, repaired.schema, label);
    assert.equal(sha256(JSON.stringify(request.schema)), schemaHashes[label], label);
    assert.equal(readCaseGenerationSchema(request, repairedConfiguration), null, label);
    assert.equal(readCaseGenerationSchema(repaired, configuration), null, label);
    assert.equal(readCaseGenerationSchema({ ...request } as GenerationRequest, configuration), null, label);

    const prepared = label.startsWith('local-')
      ? preparePromptCaseOllamaGenerationWire(request)
      : preparePromptCaseGroqGenerationWire(request);
    assert.ok(prepared.ok, label);
    if (!prepared.ok) continue;
    assert.ok(Buffer.byteLength(prepared.body, 'utf8') > 0, label);
  }

  const localRequest = createPromptCaseRequest(ready('local-image'));
  const localNative = nativeHarness([]);
  assert.equal((await createOllamaGenerationAdapter(localNative.request)
    .prepare(localRequest, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal((await createCaseOllamaGenerationAdapter(localNative.request)
    .prepare(localRequest, new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal((await createPromptCaseOllamaGenerationAdapter(localNative.request)
    .prepare(createCaseRequest(ready('local-image')), new AbortController().signal) as { ok: boolean }).ok, false);
  assert.equal(localNative.calls.length, 0);

  const localWire = preparePromptCaseOllamaGenerationWire(localRequest);
  assert.ok(localWire.ok);
  const metadata = validMetadata();
  const dispatchingLocal = nativeHarness([
    { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, { body: ollamaChatBody({ accepted: true }) },
  ]);
  const localPrepared = await createPromptCaseOllamaGenerationAdapter(dispatchingLocal.request)
    .prepare(localRequest, new AbortController().signal) as PreparedGeneration;
  assert.ok(localPrepared.ok);
  if (localPrepared.ok && localWire.ok) {
    await localPrepared.dispatch(new AbortController().signal, start => start());
    assert.equal(dispatchingLocal.calls[3]!.body, localWire.body);
  }

  const groqRequest = createPromptCaseRequest(ready('groq-image'));
  for (const adapter of [createGroqGenerationAdapter, createCaseGroqGenerationAdapter]) {
    const credential = virtualCredentialIO();
    const native = groqNativeHarness([]);
    const result = await adapter({ credentialIO: credential.io, requestImplementation: native.request })
      .prepare(groqRequest, new AbortController().signal) as { ok: boolean };
    assert.equal(result.ok, false);
    assert.equal(credential.calls.open.length, 0);
    assert.equal(native.calls.length, 0);
  }
  const promptCredential = virtualCredentialIO();
  const promptNative = groqNativeHarness([]);
  const wrongPrompt = await createPromptCaseGroqGenerationAdapter({
    credentialIO: promptCredential.io, requestImplementation: promptNative.request,
  }).prepare(createCaseRequest(ready('groq-image')), new AbortController().signal) as { ok: boolean };
  assert.equal(wrongPrompt.ok, false);
  assert.equal(promptCredential.calls.open.length, 0);
  assert.equal(promptNative.calls.length, 0);
});
