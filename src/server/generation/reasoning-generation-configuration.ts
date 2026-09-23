import { NATIVE_SCHEMA_PROMPT_VERSION, NATIVE_SCHEMA_VERSION, NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION } from './generation-artifacts.ts';
import { UNCERTAINTY_PROMPT_VERSION, UNCERTAINTY_SCHEMA_VERSION, UNCERTAINTY_LOCAL_ADAPTER_VERSION, UNCERTAINTY_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import { JUDGMENT_PROMPT_VERSION, JUDGMENT_SCHEMA_VERSION, JUDGMENT_LOCAL_ADAPTER_VERSION, JUDGMENT_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import { CASE_SCHEMA_VERSION, REASONING_PROMPT_VERSION, REASONING_LOCAL_PARAMETERS,
  REASONING_LOCAL_ADAPTER_VERSION, REASONING_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import { QWEN_CONFIGURATION } from './ollama-generation-model.ts';
import { GROQ_CONFIGURATION } from './groq-generation-configuration.ts';
import { generationTimeoutMs } from '../../shared/generation-timeout.ts';
import type { GenerationConfiguration } from './generation-contract.ts';

export const REASONING_QWEN_CONFIGURATION = Object.freeze({
  ...QWEN_CONFIGURATION, adapterVersion: REASONING_LOCAL_ADAPTER_VERSION,
  promptVersion: REASONING_PROMPT_VERSION, schemaVersion: CASE_SCHEMA_VERSION,
  parameters: REASONING_LOCAL_PARAMETERS,
  binding: Object.freeze({ ...QWEN_CONFIGURATION.binding,
    effectiveConfigurationIdentity: 'm602-qwen35-reasoning-32768-v1' }),
  accounting: Object.freeze({ ...QWEN_CONFIGURATION.accounting,
    implementationVersion: 'm602-qwen35-reasoning-utf8-bound-v1', outputTokenLimit: 12288 }),
});
export const REASONING_GROQ_CONFIGURATION = Object.freeze({
  ...GROQ_CONFIGURATION, adapterVersion: REASONING_GROQ_ADAPTER_VERSION,
  promptVersion: REASONING_PROMPT_VERSION, schemaVersion: CASE_SCHEMA_VERSION,
});

export const JUDGMENT_QWEN_CONFIGURATION = Object.freeze({
  ...REASONING_QWEN_CONFIGURATION, adapterVersion: JUDGMENT_LOCAL_ADAPTER_VERSION,
  promptVersion: JUDGMENT_PROMPT_VERSION, schemaVersion: JUDGMENT_SCHEMA_VERSION,
});
export const JUDGMENT_GROQ_CONFIGURATION = Object.freeze({
  ...REASONING_GROQ_CONFIGURATION, adapterVersion: JUDGMENT_GROQ_ADAPTER_VERSION,
  promptVersion: JUDGMENT_PROMPT_VERSION, schemaVersion: JUDGMENT_SCHEMA_VERSION,
});

export const UNCERTAINTY_QWEN_CONFIGURATION = Object.freeze({
  ...JUDGMENT_QWEN_CONFIGURATION, adapterVersion: UNCERTAINTY_LOCAL_ADAPTER_VERSION,
  promptVersion: UNCERTAINTY_PROMPT_VERSION, schemaVersion: UNCERTAINTY_SCHEMA_VERSION,
});
export const UNCERTAINTY_GROQ_CONFIGURATION = Object.freeze({
  ...JUDGMENT_GROQ_CONFIGURATION, adapterVersion: UNCERTAINTY_GROQ_ADAPTER_VERSION,
  promptVersion: UNCERTAINTY_PROMPT_VERSION, schemaVersion: UNCERTAINTY_SCHEMA_VERSION,
});

export const NATIVE_SCHEMA_QWEN_CONFIGURATION = Object.freeze({
  ...UNCERTAINTY_QWEN_CONFIGURATION, adapterVersion: NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION,
  promptVersion: NATIVE_SCHEMA_PROMPT_VERSION, schemaVersion: NATIVE_SCHEMA_VERSION,
  binding: Object.freeze({ ...UNCERTAINTY_QWEN_CONFIGURATION.binding,
    effectiveConfigurationIdentity: 'm602-qwen35-native-schema-32768-v1' }),
  accounting: Object.freeze({ method: 'initial-prompt-upper-bound',
    implementationVersion: 'm602-qwen35-initial-prompt-bound-v1', tokenizerIdentity: null,
    contextTokenLimit: 32768, perCompletionOutputTokenLimit: 12288,
    maximumNativeCompletions: 2, maximumAggregateGeneratedTokens: 24576 } as const),
});

export function configurationDeadlineMs(configuration: GenerationConfiguration): 120000 | 300000 {
  return (configuration.promptVersion === NATIVE_SCHEMA_PROMPT_VERSION || configuration.promptVersion === UNCERTAINTY_PROMPT_VERSION || configuration.promptVersion === REASONING_PROMPT_VERSION || configuration.promptVersion === JUDGMENT_PROMPT_VERSION)
    ? generationTimeoutMs(configuration.providerContext.mode) : 120000;
}
