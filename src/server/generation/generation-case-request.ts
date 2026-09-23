import { NATIVE_SCHEMA_QWEN_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER } from './generation-artifacts.ts';
import { UNCERTAINTY_QWEN_CONFIGURATION, UNCERTAINTY_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { uncertaintyDescription } from './reasoning-generation-instructions.ts';
import { blockingManualJudgmentForRule } from './profile-judgment.ts';
import { JUDGMENT_QWEN_CONFIGURATION, JUDGMENT_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { configurationDeadlineMs, REASONING_QWEN_CONFIGURATION, REASONING_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { readArray, readId, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { CASE_SCHEMA_VERSION, GENERATION_SCHEMA, OUTPUT_CONTRACT_VERSION,
  PROMPT_CASE_VERSION } from './generation-artifacts.ts';
import type { GenerationConfiguration, GenerationRequest } from './generation-contract.ts';
import { GROQ_CONFIGURATION } from './groq-generation-configuration.ts';
import { QWEN_CONFIGURATION } from './ollama-generation-model.ts';
import type { validateProposalCandidate } from './proposal-contract.ts';

export { CASE_SCHEMA_VERSION } from './generation-artifacts.ts';
export const CASE_QWEN_CONFIGURATION = Object.freeze({ ...QWEN_CONFIGURATION, schemaVersion: CASE_SCHEMA_VERSION });
export const CASE_GROQ_CONFIGURATION = Object.freeze({ ...GROQ_CONFIGURATION, schemaVersion: CASE_SCHEMA_VERSION });

export const PROMPT_CASE_QWEN_CONFIGURATION = Object.freeze({ ...CASE_QWEN_CONFIGURATION, promptVersion: PROMPT_CASE_VERSION });
export const PROMPT_CASE_GROQ_CONFIGURATION = Object.freeze({ ...CASE_GROQ_CONFIGURATION, promptVersion: PROMPT_CASE_VERSION });

function admittedConfiguration(configuration: GenerationConfiguration): boolean {
  return configuration === NATIVE_SCHEMA_QWEN_CONFIGURATION || configuration === UNCERTAINTY_QWEN_CONFIGURATION || configuration === UNCERTAINTY_GROQ_CONFIGURATION
    || configuration === JUDGMENT_QWEN_CONFIGURATION || configuration === JUDGMENT_GROQ_CONFIGURATION
    || configuration === REASONING_QWEN_CONFIGURATION || configuration === REASONING_GROQ_CONFIGURATION
    || configuration === CASE_QWEN_CONFIGURATION || configuration === CASE_GROQ_CONFIGURATION
    || configuration === PROMPT_CASE_QWEN_CONFIGURATION || configuration === PROMPT_CASE_GROQ_CONFIGURATION;
}

const issued = new WeakMap<GenerationRequest, { configuration: GenerationConfiguration; rule: string | null }>();
// No admitted request can exceed the largest existing serialized request budget.
const maximumTextLength = 65536;

function text(value: unknown): string {
  requireValid(typeof value === 'string' && value.length > 0 && value.length <= maximumTextLength
    && value.isWellFormed() && value.trim().length > 0);
  return value;
}

function boundedArray<T>(value: unknown, maximum: number, read: (item: unknown) => T): readonly T[] {
  requireValid(Array.isArray(value));
  const length = Object.getOwnPropertyDescriptor(value, 'length');
  requireValid(length && 'value' in length && Number.isSafeInteger(length.value)
    && length.value > 0 && length.value <= maximum);
  return readArray(value, read);
}

function identifiers(value: unknown): readonly string[] {
  const values = boundedArray(value, maximumTextLength, text);
  requireValid(new Set(values).size === values.length);
  return values;
}

function sameIdentifiers(actual: readonly string[], expected: readonly string[]): void {
  requireValid(actual.length === expected.length && actual.every((value, index) => value === expected[index]));
}

function freezeSchema(value: Record<string, unknown>): Readonly<Record<string, unknown>> {
  for (const child of Object.values(value)) {
    if (child !== null && typeof child === 'object') freezeSchema(child as Record<string, unknown>);
  }
  return Object.freeze(value);
}

export function createCaseGenerationRequest(
  messages: GenerationRequest['messages'], context: Parameters<typeof validateProposalCandidate>[1],
  configuration: GenerationConfiguration,
): GenerationRequest {
  requireValid(admittedConfiguration(configuration));
  const detachedMessages = boundedArray(messages, 2, value => {
    const message = readObject(value, ['role', 'content']);
    requireValid(message.role === 'system' || message.role === 'user');
    return Object.freeze({ role: message.role, content: text(message.content) });
  });
  requireValid(detachedMessages.length === 2 && detachedMessages[0].role === 'system'
    && detachedMessages[1].role === 'user');
  const source = readObject(context, ['findingId', 'availableEvidenceReferences', 'passageIds']);
  const findingId = readId(source.findingId);
  const evidence = identifiers(source.availableEvidenceReferences);
  const passages = identifiers(source.passageIds);
  const input = readObject(JSON.parse(detachedMessages[1].content));
  const finding = readObject(input.finding);
  const guidance = readObject(input.guidance);
  requireValid(finding.findingId === findingId);
  sameIdentifiers(boundedArray(finding.facts, maximumTextLength, value => text(readObject(value).reference)), evidence);
  sameIdentifiers(boundedArray(guidance.passages, maximumTextLength, value => text(readObject(value).passageId)), passages);

  // JSON cloning intentionally separates the shared leaf schemas in the frozen legacy shape.
  const schema = JSON.parse(JSON.stringify(GENERATION_SCHEMA));
  schema.properties.findingId.enum = [findingId];
  for (const field of ['findingSummary', 'userImpact', 'remediation']) {
    schema.properties[field].properties.evidenceReferences.items.enum = [...evidence];
    schema.properties[field].properties.passageIds.items.enum = [...passages];
  }
  const native = configuration === NATIVE_SCHEMA_QWEN_CONFIGURATION;
  const uncertainty = native || configuration === UNCERTAINTY_QWEN_CONFIGURATION || configuration === UNCERTAINTY_GROQ_CONFIGURATION;
  const judgment = uncertainty || configuration === JUDGMENT_QWEN_CONFIGURATION || configuration === JUDGMENT_GROQ_CONFIGURATION;
  const rule = judgment ? text(finding.ruleId) : null;
  if (rule !== null) {
    schema.properties.blockingManualJudgment.enum = [blockingManualJudgmentForRule(rule)];
    if (uncertainty) schema.properties.uncertainty = { type: 'string', minLength: 1,
      pattern: '\\S', description: uncertaintyDescription(rule) };
  }
  if (native) schema.properties.postChangeVerificationReminder.enum = [NATIVE_SCHEMA_POST_CHANGE_VERIFICATION_REMINDER];
  const request: GenerationRequest = Object.freeze({ messages: detachedMessages, schema: freezeSchema(schema),
    promptVersion: configuration.promptVersion, schemaVersion: configuration.schemaVersion, outputContractVersion: OUTPUT_CONTRACT_VERSION,
    controls: configuration.parameters, deadlineMs: configurationDeadlineMs(configuration), configuration });
  issued.set(request, { configuration, rule });
  return request;
}

export function readCaseGenerationSchema(request: GenerationRequest, configuration: GenerationConfiguration):
Readonly<Record<string, unknown>> | null {
  if (!admittedConfiguration(configuration)
    || issued.get(request)?.configuration !== configuration) return null;
  return request.schema;
}

export function readCaseGenerationRule(request: GenerationRequest, configuration: GenerationConfiguration): string | null {
  const binding = issued.get(request);
  return binding?.configuration === configuration ? binding.rule : null;
}
