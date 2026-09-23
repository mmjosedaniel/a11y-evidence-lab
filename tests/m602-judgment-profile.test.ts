import assert from 'node:assert/strict';
import test from 'node:test';
import {
  JUDGMENT_GROQ_ADAPTER_VERSION,
  JUDGMENT_LOCAL_ADAPTER_VERSION,
  JUDGMENT_PROMPT_VERSION,
  JUDGMENT_SCHEMA_VERSION,
  UNCERTAINTY_GROQ_ADAPTER_VERSION,
  UNCERTAINTY_LOCAL_ADAPTER_VERSION,
  UNCERTAINTY_PROMPT_VERSION,
  UNCERTAINTY_SCHEMA_VERSION,
} from '../src/server/generation/generation-artifacts.ts';
import {
  createCaseGenerationRequest,
  readCaseGenerationRule,
} from '../src/server/generation/generation-case-request.ts';
import type {
  GenerationConfiguration,
  GenerationRequest,
  PreparedGeneration,
} from '../src/server/generation/generation-contract.ts';
import { readProviderInvocation } from '../src/server/generation/generation-contract.ts';
import { validateGenerationConfiguration } from '../src/server/generation/generation-fit.ts';
import { executeGenerationOperation } from '../src/server/generation/generation-execution.ts';
import {
  createJudgmentGroqGenerationAdapter,
  createGroqGenerationAdapter,
  createUncertaintyGroqGenerationAdapter,
} from '../src/server/generation/groq-generation.ts';
import { prepareJudgmentGroqGenerationWire, prepareUncertaintyGroqGenerationWire } from '../src/server/generation/groq-generation-fit.ts';
import {
  createJudgmentOllamaGenerationAdapter,
  createNativeSchemaOllamaGenerationAdapter,
  createOllamaGenerationAdapter,
  createUncertaintyOllamaGenerationAdapter,
} from '../src/server/generation/ollama-generation.ts';
import { prepareJudgmentOllamaGenerationWire, prepareUncertaintyOllamaGenerationWire } from '../src/server/generation/ollama-generation-fit.ts';
import {
  blockingManualJudgmentForRule,
  validateBlockingManualJudgment,
} from '../src/server/generation/profile-judgment.ts';
import { validateProposal } from '../src/server/generation/proposal-contract.ts';
import {
  JUDGMENT_GROQ_CONFIGURATION,
  JUDGMENT_QWEN_CONFIGURATION,
  NATIVE_SCHEMA_QWEN_CONFIGURATION,
  REASONING_GROQ_CONFIGURATION,
  REASONING_QWEN_CONFIGURATION,
  UNCERTAINTY_GROQ_CONFIGURATION,
  UNCERTAINTY_QWEN_CONFIGURATION,
  configurationDeadlineMs,
} from '../src/server/generation/reasoning-generation-configuration.ts';
import {
  judgmentGenerationInstructions,
  reasoningGenerationInstructions,
  uncertaintyGenerationInstructions,
} from '../src/server/generation/reasoning-generation-instructions.ts';
import { resolveGenerationAdapter } from '../src/server/local-service/generation-adapters.ts';
import { cloneCandidate, generationFixture } from './helpers/m302-generation-fixture.ts';
import { nativeHarness, ollamaChatBody, validMetadata } from './helpers/m303-ollama-fixture.ts';
import { loadM602Package, type M602CaseLabel } from './helpers/m602-package.ts';

const serial = { concurrency: false };
const labels = [
  'local-image', 'local-label', 'local-contrast',
  'groq-image', 'groq-label', 'groq-contrast',
] as const satisfies readonly M602CaseLabel[];
const rules = ['image-alt', 'label', 'color-contrast'] as const;
type RuleId = typeof rules[number];

const ruleByLabel: Readonly<Record<M602CaseLabel, RuleId>> = Object.freeze({
  'local-image': 'image-alt',
  'local-label': 'label',
  'local-contrast': 'color-contrast',
  'groq-image': 'image-alt',
  'groq-label': 'label',
  'groq-contrast': 'color-contrast',
});

function ready(label: M602CaseLabel) {
  const loaded = loadM602Package(label);
  assert.equal(loaded.status, 'ready');
  if (loaded.status !== 'ready') throw new Error(`M6-02 package ${label} is unavailable`);
  return loaded.value;
}

function judgmentConfiguration(label: M602CaseLabel): GenerationConfiguration {
  return label.startsWith('local-') ? JUDGMENT_QWEN_CONFIGURATION : JUDGMENT_GROQ_CONFIGURATION;
}

function historicalConfiguration(label: M602CaseLabel): GenerationConfiguration {
  return label.startsWith('local-') ? REASONING_QWEN_CONFIGURATION : REASONING_GROQ_CONFIGURATION;
}

function judgmentRequest(label: M602CaseLabel): GenerationRequest {
  const packageValue = ready(label);
  const historical = packageValue.createRequest(
    label.startsWith('local-')
      ? createOllamaGenerationAdapter().configuration
      : createGroqGenerationAdapter().configuration,
  );
  return createCaseGenerationRequest([
    { role: 'system', content: judgmentGenerationInstructions(ruleByLabel[label]) },
    historical.messages[1]!,
  ], {
    findingId: packageValue.findingId,
    availableEvidenceReferences: packageValue.availableEvidenceReferences,
    passageIds: packageValue.passageIds,
  }, judgmentConfiguration(label));
}

function uncertaintyConfiguration(label: M602CaseLabel): GenerationConfiguration {
  return label.startsWith('local-') ? UNCERTAINTY_QWEN_CONFIGURATION : UNCERTAINTY_GROQ_CONFIGURATION;
}

function uncertaintyRequest(label: M602CaseLabel): GenerationRequest {
  const packageValue = ready(label);
  const judgment = judgmentRequest(label);
  return createCaseGenerationRequest([
    { role: 'system', content: uncertaintyGenerationInstructions(ruleByLabel[label]) },
    judgment.messages[1]!,
  ], {
    findingId: packageValue.findingId,
    availableEvidenceReferences: packageValue.availableEvidenceReferences,
    passageIds: packageValue.passageIds,
  }, uncertaintyConfiguration(label));
}

function schemaJudgmentEnum(request: GenerationRequest): readonly string[] | undefined {
  const schema = request.schema as {
    properties?: { blockingManualJudgment?: { enum?: readonly string[] } };
  };
  return schema.properties?.blockingManualJudgment?.enum;
}

test('owns one exact profile judgment used by the fresh prompt, issued schema and validator', serial, () => {
  const expected = rules.map(ruleId => blockingManualJudgmentForRule(ruleId));
  assert.equal(new Set(expected).size, rules.length);
  assert.match(expected[0]!, /purpose.*informative.*decorative.*(?:wording|meaning)/i);
  assert.match(expected[1]!, /visible.*(?:wording|label).*programmatic association/i);
  assert.match(expected[2]!, /(?:threshold|exception).*visual context.*measurements/i);

  for (const ruleId of rules) {
    const judgment = blockingManualJudgmentForRule(ruleId);
    assert.ok(judgment.trim().length > 0);
    const instructions = judgmentGenerationInstructions(ruleId);
    assert.match(instructions, /blockingManualJudgment/);
    assert.match(instructions, /(?:each|every) material claim.*(?:same|own) field.*references/i);
    assert.match(instructions, /unknown.*conditional|conditional.*unknown/i);
    assert.match(instructions, /meaningful.*uncertainty|uncertainty.*meaningful/i);
    assert.match(instructions, /assumptions.*empty|empty.*assumptions/i);
    if (ruleId === 'image-alt') assert.match(instructions, /do not invent.*(?:alt|alternative).*wording/i);
    if (ruleId === 'label') assert.match(instructions, /do not invent.*label.*wording/i);
    if (ruleId === 'color-contrast') assert.match(instructions, /do not invent.*(?:color|measurement|ratio)/i);
    assert.equal(instructions.split(judgment).length - 1, 1);
    for (const other of expected) assert.equal(instructions.includes(other), other === judgment);

    const request = judgmentRequest(`local-${ruleId === 'image-alt' ? 'image' : ruleId === 'color-contrast' ? 'contrast' : 'label'}`);
    assert.deepEqual(schemaJudgmentEnum(request), [judgment]);
    assert.equal(readCaseGenerationRule(request, JUDGMENT_QWEN_CONFIGURATION), ruleId);

    const proposal = cloneCandidate(generationFixture(ruleId).proposal);
    proposal.blockingManualJudgment = judgment;
    assert.equal(validateBlockingManualJudgment(proposal, ruleId), true);
    for (const invalid of ['', 'Determine the appropriate accessible treatment.', 'no', 'false', 'None']) {
      proposal.blockingManualJudgment = invalid;
      assert.equal(validateBlockingManualJudgment(proposal, ruleId), false);
    }
  }
});

test('binds the rule to the issued request identity and leaves historical requests and proposal validation unchanged', serial, () => {
  const request = judgmentRequest('local-image');
  assert.equal(readCaseGenerationRule({ ...request } as GenerationRequest, JUDGMENT_QWEN_CONFIGURATION), null);
  assert.equal(readCaseGenerationRule(request, JUDGMENT_GROQ_CONFIGURATION), null);

  const packageValue = ready('local-image');
  const historicalRequest = createCaseGenerationRequest([
    { role: 'system', content: reasoningGenerationInstructions('image-alt') },
    packageValue.createRequest(createOllamaGenerationAdapter().configuration).messages[1]!,
  ], {
    findingId: packageValue.findingId,
    availableEvidenceReferences: packageValue.availableEvidenceReferences,
    passageIds: packageValue.passageIds,
  }, REASONING_QWEN_CONFIGURATION);
  assert.equal(readCaseGenerationRule(historicalRequest, REASONING_QWEN_CONFIGURATION), null);
  assert.equal(schemaJudgmentEnum(historicalRequest), undefined);

  const fixture = generationFixture('image-alt');
  assert.equal(validateProposal(fixture.proposal, {
    finding: fixture.finding,
    retrieval: fixture.retrieval,
  }).ok, true, 'Durable and review validation must retain the generic proposal contract');
});

test('uses additive identities while preserving the accepted models, reasoning controls and deadlines', serial, () => {
  assert.equal(JUDGMENT_PROMPT_VERSION, 'm602-judgment-instructions-v1');
  assert.equal(JUDGMENT_SCHEMA_VERSION, 'm602-judgment-schema-v1');
  assert.equal(JUDGMENT_LOCAL_ADAPTER_VERSION, 'm602-ollama-judgment-v1');
  assert.equal(JUDGMENT_GROQ_ADAPTER_VERSION, 'm602-groq-judgment-v1');

  for (const [fresh, historical] of [
    [JUDGMENT_QWEN_CONFIGURATION, REASONING_QWEN_CONFIGURATION],
    [JUDGMENT_GROQ_CONFIGURATION, REASONING_GROQ_CONFIGURATION],
  ] as const) {
    assert.notEqual(fresh.promptVersion, historical.promptVersion);
    assert.notEqual(fresh.schemaVersion, historical.schemaVersion);
    assert.notEqual(fresh.adapterVersion, historical.adapterVersion);
    assert.deepEqual(fresh.providerContext, historical.providerContext);
    assert.deepEqual(fresh.parameters, historical.parameters);
    assert.deepEqual(validateGenerationConfiguration(fresh, fresh.providerContext), { ok: true, value: fresh });
    assert.deepEqual(validateGenerationConfiguration(historical, historical.providerContext), { ok: true, value: historical });
    const freshInvocation = readProviderInvocation({
      adapterId: fresh.adapterId,
      adapterVersion: fresh.adapterVersion,
      endpointIdentity: fresh.endpoint,
      promptVersion: fresh.promptVersion,
      schemaVersion: fresh.schemaVersion,
      outputContractVersion: fresh.outputContractVersion,
      parameters: fresh.parameters,
      outcome: 'response',
      validation: 'passed',
    });
    const historicalInvocation = readProviderInvocation({
      adapterId: historical.adapterId,
      adapterVersion: historical.adapterVersion,
      endpointIdentity: historical.endpoint,
      promptVersion: historical.promptVersion,
      schemaVersion: historical.schemaVersion,
      outputContractVersion: historical.outputContractVersion,
      parameters: historical.parameters,
      outcome: 'response',
      validation: 'passed',
    });
    assert.equal(freshInvocation.promptVersion, fresh.promptVersion);
    assert.equal(historicalInvocation.promptVersion, historical.promptVersion);
    assert.throws(() => readProviderInvocation({ ...freshInvocation,
      adapterVersion: historical.adapterVersion }));
    assert.throws(() => readProviderInvocation({ ...freshInvocation,
      schemaVersion: historical.schemaVersion }));
  }
  assert.equal(configurationDeadlineMs(JUDGMENT_QWEN_CONFIGURATION), 300000);
  assert.equal(configurationDeadlineMs(JUDGMENT_GROQ_CONFIGURATION), 120000);
});

test('prepares all six unchanged controlled inputs within the existing provider limits without dispatch', serial, () => {
  for (const label of labels) {
    const request = judgmentRequest(label);
    const prepared = label.startsWith('local-')
      ? prepareJudgmentOllamaGenerationWire(request)
      : prepareJudgmentGroqGenerationWire(request);
    assert.equal(prepared.ok, true, label);
    if (!prepared.ok) continue;
    assert.ok(Buffer.byteLength(prepared.body, 'utf8') > 0, label);
    if (label.startsWith('local-')) {
      const body = JSON.parse(prepared.body) as { format?: unknown; messages: Array<{ content: string }> };
      assert.equal(Object.hasOwn(body, 'format'), false, label);
      assert.equal(body.messages[0]!.content.split(JSON.stringify(request.schema)).length - 1, 1, label);
      assert.ok('inputTokens' in prepared.fit);
      const fit = prepared.fit as { inputTokens: number; reservedOutputTokens: number; contextTokenLimit: number };
      assert.ok(fit.inputTokens + fit.reservedOutputTokens + 32 <= fit.contextTokenLimit, label);
    } else {
      const body = JSON.parse(prepared.body) as {
        messages: Array<{ content: string }>;
        response_format: { type: string; json_schema: { strict: boolean; schema: unknown } };
      };
      assert.equal(body.response_format.type, 'json_schema', label);
      assert.equal(body.response_format.json_schema.strict, true, label);
      assert.deepEqual(body.response_format.json_schema.schema, request.schema, label);
      assert.equal(body.messages[0]!.content.includes(JSON.stringify(request.schema)), false, label);
    }
  }
});

async function executeWithSubstitution(rawCandidate: unknown, returnedCandidate: unknown,
  profile: 'judgment' | 'uncertainty' = 'judgment') {
  const configuration = profile === 'uncertainty' ? UNCERTAINTY_QWEN_CONFIGURATION : JUDGMENT_QWEN_CONFIGURATION;
  const request = profile === 'uncertainty' ? uncertaintyRequest('local-image') : judgmentRequest('local-image');
  const prepared = profile === 'uncertainty'
    ? prepareUncertaintyOllamaGenerationWire(request) : prepareJudgmentOllamaGenerationWire(request);
  assert.equal(prepared.ok, true);
  if (!prepared.ok) throw new Error('Judgment request must fit before the synthetic execution');
  let validations = 0;
  let transports = 0;
  const adapter = Object.freeze({
    configuration,
    prepare(supplied: GenerationRequest): PreparedGeneration {
      assert.strictEqual(supplied, request);
      return Object.freeze({
        ok: true as const,
        request,
        configuration,
        fit: prepared.fit,
        cleanup: 'complete' as const,
        dispatch(_signal: AbortSignal, attempt: <T>(start: () => T) => T) {
          return attempt(() => {
            transports++;
            return Object.freeze({ ok: true as const, candidate: rawCandidate,
              complete: true as const, cleanup: 'complete' as const });
          });
        },
      });
    },
  });
  const outcome = await executeGenerationOperation({
    signal: new AbortController().signal,
    providerContext: configuration.providerContext,
    adapter,
    admit: () => ({
      status: 'ready' as const,
      createRequest: () => request,
      validateCandidate: () => {
        validations++;
        return Object.freeze({ ok: true as const, value: returnedCandidate as never });
      },
    }),
  });
  assert.equal(transports, 1);
  assert.ok(validations <= 1, 'The admission validator must never receive a retry');
  return outcome;
}

test('shared execution rejects wrong raw and substituted judgments without repair or validator retry', serial, async () => {
  const exact = cloneCandidate(generationFixture('image-alt').proposal);
  exact.blockingManualJudgment = blockingManualJudgmentForRule('image-alt');
  const wrong = cloneCandidate(exact);
  wrong.blockingManualJudgment = 'None';

  for (const [raw, returned] of [[wrong, exact], [exact, wrong]] as const) {
    const outcome = await executeWithSubstitution(raw, returned);
    assert.equal(outcome.status, 'failed');
    if (outcome.status === 'failed') {
      assert.equal(outcome.error, 'response-validation');
      assert.equal(outcome.attempted, true);
    }
  }
  const accepted = await executeWithSubstitution(exact, exact);
  assert.equal(accepted.status, 'proposal');
});

test('uncertainty execution preserves exact profile judgment validation without repair or retry', serial, async () => {
  const exact = cloneCandidate(generationFixture('image-alt').proposal);
  exact.blockingManualJudgment = blockingManualJudgmentForRule('image-alt');
  const wrong = cloneCandidate(exact);
  wrong.blockingManualJudgment = 'None';
  for (const [raw, returned] of [[wrong, exact], [exact, wrong]] as const) {
    const outcome = await executeWithSubstitution(raw, returned, 'uncertainty');
    assert.equal(outcome.status, 'failed');
    if (outcome.status === 'failed') assert.equal(outcome.error, 'response-validation');
  }
  assert.equal((await executeWithSubstitution(exact, exact, 'uncertainty')).status, 'proposal');
});

test('ordinary resolution selects the corrected Local and Groq adapters while historical factories remain distinct', serial, () => {
  const local = Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' } as const);
  const groq = Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' } as const);
  assert.strictEqual(resolveGenerationAdapter(local).configuration, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  assert.strictEqual(resolveGenerationAdapter(groq).configuration, UNCERTAINTY_GROQ_CONFIGURATION);
  assert.strictEqual(createJudgmentOllamaGenerationAdapter().configuration, JUDGMENT_QWEN_CONFIGURATION);
  assert.strictEqual(createJudgmentGroqGenerationAdapter().configuration, JUDGMENT_GROQ_CONFIGURATION);
  assert.strictEqual(createUncertaintyOllamaGenerationAdapter().configuration, UNCERTAINTY_QWEN_CONFIGURATION);
  assert.strictEqual(createNativeSchemaOllamaGenerationAdapter().configuration, NATIVE_SCHEMA_QWEN_CONFIGURATION);
  assert.strictEqual(createUncertaintyGroqGenerationAdapter().configuration, UNCERTAINTY_GROQ_CONFIGURATION);
  assert.notStrictEqual(createOllamaGenerationAdapter().configuration, JUDGMENT_QWEN_CONFIGURATION);
  assert.notStrictEqual(createGroqGenerationAdapter().configuration, JUDGMENT_GROQ_CONFIGURATION);
});

test('adds one profile-specific uncertainty schema and instruction while preserving judgment requests', serial, () => {
  const expectedContext = {
    'image-alt': /image.*(?:purpose|wording)|(?:purpose|wording).*image/i,
    label: /label.*(?:wording|association)|(?:wording|association).*label/i,
    'color-contrast': /(?:meaningful text|threshold|exception|visual context)/i,
  } as const;
  for (const label of labels) {
    const ruleId = ruleByLabel[label];
    const historical = judgmentRequest(label);
    const request = uncertaintyRequest(label);
    const leaf = (request.schema as { properties: { uncertainty: Record<string, unknown> } })
      .properties.uncertainty;
    assert.deepEqual(Object.keys(leaf).sort(), ['description', 'minLength', 'pattern', 'type'], label);
    assert.equal(leaf.type, 'string', label);
    assert.equal(leaf.minLength, 1, label);
    assert.equal(leaf.pattern, '\\S', label);
    const nonWhitespace = new RegExp(leaf.pattern as string, 'u');
    for (const blank of ['', ' \t\r\n', '\u00a0\u2003']) assert.equal(nonWhitespace.test(blank), false, label);
    assert.equal(nonWhitespace.test('Image purpose and suitable wording remain unresolved.'), true, label);
    assert.equal(typeof leaf.description, 'string', label);
    assert.match(leaf.description as string, /sentence/i, label);
    assert.match(leaf.description as string, expectedContext[ruleId], label);
    assert.match(request.messages[0]!.content, /uncertainty.*sentence|sentence.*uncertainty/i, label);
    assert.match(request.messages[0]!.content, expectedContext[ruleId], label);
    assert.equal(request.messages[0]!.content.includes('generic confidence'), true, label);
    const historicalLeaf = (historical.schema as { properties: { uncertainty: Record<string, unknown> } })
      .properties.uncertainty;
    assert.deepEqual(historicalLeaf, { type: 'string' }, label);
  }
});

test('binds additive uncertainty tuples and exact provider wires without changing controls or deadlines', serial, () => {
  assert.equal(UNCERTAINTY_PROMPT_VERSION, 'm602-uncertainty-instructions-v1');
  assert.equal(UNCERTAINTY_SCHEMA_VERSION, 'm602-uncertainty-schema-v1');
  assert.equal(UNCERTAINTY_LOCAL_ADAPTER_VERSION, 'm602-ollama-uncertainty-v1');
  assert.equal(UNCERTAINTY_GROQ_ADAPTER_VERSION, 'm602-groq-uncertainty-v1');
  for (const [current, historical] of [
    [UNCERTAINTY_QWEN_CONFIGURATION, JUDGMENT_QWEN_CONFIGURATION],
    [UNCERTAINTY_GROQ_CONFIGURATION, JUDGMENT_GROQ_CONFIGURATION],
  ] as const) {
    assert.notEqual(current.promptVersion, historical.promptVersion);
    assert.notEqual(current.schemaVersion, historical.schemaVersion);
    assert.notEqual(current.adapterVersion, historical.adapterVersion);
    assert.deepEqual(current.providerContext, historical.providerContext);
    assert.strictEqual(current.parameters, historical.parameters);
    assert.equal(configurationDeadlineMs(current), configurationDeadlineMs(historical));
    assert.deepEqual(validateGenerationConfiguration(current, current.providerContext), { ok: true, value: current });
    const invocation = readProviderInvocation({
      adapterId: current.adapterId, adapterVersion: current.adapterVersion,
      endpointIdentity: current.endpoint, promptVersion: current.promptVersion,
      schemaVersion: current.schemaVersion, outputContractVersion: current.outputContractVersion,
      parameters: current.parameters, outcome: 'response', validation: 'passed',
    });
    assert.equal(invocation.adapterVersion, current.adapterVersion);
    assert.throws(() => readProviderInvocation({ ...invocation, promptVersion: historical.promptVersion }));
    assert.throws(() => readProviderInvocation({ ...invocation, schemaVersion: historical.schemaVersion }));
  }
  for (const label of labels) {
    const request = uncertaintyRequest(label);
    const prepared = label.startsWith('local-')
      ? prepareUncertaintyOllamaGenerationWire(request)
      : prepareUncertaintyGroqGenerationWire(request);
    assert.equal(prepared.ok, true, label);
    if (!prepared.ok) continue;
    const body = JSON.parse(prepared.body) as Record<string, any>;
    if (label.startsWith('local-')) {
      assert.equal(Object.hasOwn(body, 'format'), false, label);
      assert.equal(body.messages[0].content.split(JSON.stringify(request.schema)).length - 1, 1, label);
    } else {
      assert.deepEqual(body.response_format.json_schema.schema, request.schema, label);
      assert.equal(body.response_format.json_schema.strict, true, label);
    }
  }
});

test('new Local factory forwards only the opt-in content detail while preserving the coarse rejection', serial, async () => {
  const metadata = validMetadata();
  const native = nativeHarness([
    { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) },
    { body: ollamaChatBody({}, {
      message: { role: 'assistant', content: 'SECRET {', thinking: 'SECRET hidden reasoning' },
    }) },
  ]);
  const coarse: unknown[] = [];
  const details: unknown[] = [];
  const adapter = createUncertaintyOllamaGenerationAdapter(native.request,
    event => { coarse.push(event); }, detail => { details.push(detail); });
  const prepared = await adapter.prepare(uncertaintyRequest('local-image'), new AbortController().signal) as PreparedGeneration;
  assert.equal(prepared.ok, true);
  if (!prepared.ok) throw new Error('Uncertainty Local request must prepare with synthetic metadata');
  assert.deepEqual(await prepared.dispatch(new AbortController().signal, start => start()),
    { ok: false, error: 'incomplete-output', cleanup: 'complete' });
  assert.deepEqual(coarse, [{ code: 'adapter-response/content' }]);
  assert.deepEqual(details, [{ kind: 'content', reason: 'json-syntax' }]);
  assert.equal(JSON.stringify({ coarse, details }).includes('SECRET'), false);
});
