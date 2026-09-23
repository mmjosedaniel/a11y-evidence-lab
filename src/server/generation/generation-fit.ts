import { NATIVE_SCHEMA_PROMPT_VERSION, NATIVE_SCHEMA_VERSION, NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION } from './generation-artifacts.ts';
import { NATIVE_SCHEMA_QWEN_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { UNCERTAINTY_QWEN_CONFIGURATION, UNCERTAINTY_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { UNCERTAINTY_PROMPT_VERSION, UNCERTAINTY_SCHEMA_VERSION, UNCERTAINTY_LOCAL_ADAPTER_VERSION, UNCERTAINTY_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import { JUDGMENT_PROMPT_VERSION, JUDGMENT_SCHEMA_VERSION, JUDGMENT_LOCAL_ADAPTER_VERSION, JUDGMENT_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import { JUDGMENT_QWEN_CONFIGURATION, JUDGMENT_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { readChoice, readInteger, readObject, readPattern, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { REASONING_QWEN_CONFIGURATION, REASONING_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { REASONING_PROMPT_VERSION, REASONING_LOCAL_ADAPTER_VERSION, REASONING_GROQ_ADAPTER_VERSION, CASE_SCHEMA_VERSION, PROMPT_CASE_VERSION, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import { readGenerationIdentity, readGenerationParameters } from './generation-contract.ts';
import type { GenerationConfiguration } from './generation-contract.ts';

function frozenRecord(value: unknown, keys: readonly string[]): Record<string, unknown> {
  const record = readObject(value, keys);
  requireValid(Object.isFrozen(value));
  return record;
}

export function validateGenerationConfiguration(candidate: unknown, providerContext: ProviderContext):
  { readonly ok: true; readonly value: GenerationConfiguration } | { readonly ok: false; readonly error: 'configuration' | 'input-fit' } {
  let error: 'configuration' | 'input-fit' = 'configuration';
  try {
    // Accounting omission is classified separately after all other configuration fields.
    const root = readObject(candidate);
    requireValid(Object.isFrozen(candidate));
    const keys = ['providerContext', 'adapterId', 'adapterVersion', 'endpoint', 'promptVersion', 'schemaVersion',
      'outputContractVersion', 'parameters', 'binding'];
    requireValid(Object.keys(root).every(key => keys.includes(key) || key === 'accounting') && keys.every(key => Object.hasOwn(root, key)));
    const parent = readObject(providerContext, ['mode', 'provider', 'model']);
    const context = frozenRecord(root.providerContext, ['mode', 'provider', 'model']);
    const mode = readChoice(context.mode, ['local', 'groq']);
    requireValid(Object.keys(parent).every(key => parent[key] === context[key]));
    requireValid(context.provider === (mode === 'local' ? 'ollama' : 'groq')
      && context.model === (mode === 'local' ? 'qwen3.5:4b' : 'openai/gpt-oss-20b'));
    requireValid(root.adapterId === (mode === 'local' ? 'ollama-generation' : 'groq-generation')
      && root.endpoint === (mode === 'local' ? 'ollama-loopback-chat' : 'groq-chat-completions'));
    readGenerationIdentity(root.adapterVersion);
    const native = root.promptVersion === NATIVE_SCHEMA_PROMPT_VERSION;
    requireValid(native === (root.adapterVersion === NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION));
    if (native) requireValid(mode === 'local' && candidate === NATIVE_SCHEMA_QWEN_CONFIGURATION);
    const uncertainty = root.promptVersion === UNCERTAINTY_PROMPT_VERSION;
    const uncertaintyExpected = mode === 'local' ? UNCERTAINTY_QWEN_CONFIGURATION : UNCERTAINTY_GROQ_CONFIGURATION;
    requireValid(uncertainty === (root.adapterVersion === UNCERTAINTY_LOCAL_ADAPTER_VERSION || root.adapterVersion === UNCERTAINTY_GROQ_ADAPTER_VERSION));
    if (uncertainty) requireValid(root.adapterVersion === uncertaintyExpected.adapterVersion
      && root.binding === uncertaintyExpected.binding && root.accounting === uncertaintyExpected.accounting);
    const judgment = root.promptVersion === JUDGMENT_PROMPT_VERSION;
    const judgmentExpected = mode === 'local' ? JUDGMENT_QWEN_CONFIGURATION : JUDGMENT_GROQ_CONFIGURATION;
    requireValid(judgment === (root.adapterVersion === JUDGMENT_LOCAL_ADAPTER_VERSION || root.adapterVersion === JUDGMENT_GROQ_ADAPTER_VERSION));
    if (judgment) requireValid(root.adapterVersion === judgmentExpected.adapterVersion
      && root.binding === judgmentExpected.binding && root.accounting === judgmentExpected.accounting);
    const reasoning = root.promptVersion === REASONING_PROMPT_VERSION;
    const expected = mode === 'local' ? REASONING_QWEN_CONFIGURATION : REASONING_GROQ_CONFIGURATION;
    requireValid(reasoning === (root.adapterVersion === REASONING_LOCAL_ADAPTER_VERSION || root.adapterVersion === REASONING_GROQ_ADAPTER_VERSION));
    if (reasoning) requireValid(root.adapterVersion === expected.adapterVersion
      && root.binding === expected.binding && root.accounting === expected.accounting);
    requireValid(((native && root.schemaVersion === NATIVE_SCHEMA_VERSION)
      || (uncertainty && root.schemaVersion === UNCERTAINTY_SCHEMA_VERSION)
      || (judgment && root.schemaVersion === JUDGMENT_SCHEMA_VERSION)
      || (reasoning && root.schemaVersion === CASE_SCHEMA_VERSION)
      || (root.promptVersion === PROMPT_VERSION && (root.schemaVersion === SCHEMA_VERSION || root.schemaVersion === CASE_SCHEMA_VERSION))
      || (root.promptVersion === PROMPT_CASE_VERSION && root.schemaVersion === CASE_SCHEMA_VERSION))
      && root.outputContractVersion === OUTPUT_CONTRACT_VERSION);
    readGenerationParameters(root.parameters, mode, reasoning || judgment || uncertainty || native);
    requireValid(Object.isFrozen(root.parameters));
    let tokenizer: unknown;
    if (mode === 'local') {
      const binding = frozenRecord(root.binding, ['kind', 'runtimeVersion', 'modelDigest', 'tokenizerIdentity', 'templateIdentity', 'parserIdentity', 'effectiveConfigurationIdentity']);
      requireValid(binding.kind === 'local');
      readPattern(binding.modelDigest, /^[a-f0-9]{64}$/);
      for (const key of ['runtimeVersion', 'tokenizerIdentity', 'templateIdentity', 'parserIdentity', 'effectiveConfigurationIdentity']) readGenerationIdentity(binding[key]);
      tokenizer = binding.tokenizerIdentity;
    } else {
      const binding = frozenRecord(root.binding, ['kind', 'exposedDefaultsIdentity', 'serverRevision']);
      requireValid(binding.kind === 'groq');
      readGenerationIdentity(binding.exposedDefaultsIdentity);
      if (binding.serverRevision !== null) readGenerationIdentity(binding.serverRevision);
    }
    error = 'input-fit';
    const method = readObject(root.accounting).method;
    if (method === 'initial-prompt-upper-bound') {
      requireValid(native && root.accounting === NATIVE_SCHEMA_QWEN_CONFIGURATION.accounting);
      return Object.freeze({ ok: true, value: candidate as GenerationConfiguration });
    }
    if (method === 'serialized-byte-budget') {
      const accounting = frozenRecord(root.accounting, ['method', 'implementationVersion', 'tokenizerIdentity',
        'maxRequestBytes', 'contextTokenLimit', 'outputTokenLimit']);
      requireValid(mode === 'groq' && accounting.implementationVersion === 'm304-groq-request-bytes-v1'
        && accounting.tokenizerIdentity === null && accounting.maxRequestBytes === 65536
        && accounting.contextTokenLimit === 131072 && accounting.outputTokenLimit === 65536);
      return Object.freeze({ ok: true, value: candidate as GenerationConfiguration });
    }
    const accounting = frozenRecord(root.accounting, ['method', 'implementationVersion', 'tokenizerIdentity', 'contextTokenLimit', 'outputTokenLimit']);
    readChoice(accounting.method, ['exact-tokenizer', 'verified-upper-bound']);
    readGenerationIdentity(accounting.implementationVersion);
    if (accounting.tokenizerIdentity !== null) readGenerationIdentity(accounting.tokenizerIdentity);
    requireValid(accounting.method !== 'exact-tokenizer' || accounting.tokenizerIdentity !== null);
    requireValid(mode !== 'local' || accounting.tokenizerIdentity === null || accounting.tokenizerIdentity === tokenizer);
    readInteger(accounting.contextTokenLimit, 1);
    readInteger(accounting.outputTokenLimit, 1);
    return Object.freeze({ ok: true, value: candidate as GenerationConfiguration });
  } catch { return Object.freeze({ ok: false, error }); }
}

export function validatePreparedGenerationFit(fit: unknown, configuration: GenerationConfiguration): boolean {
  try {
    if (configuration.accounting.method === 'initial-prompt-upper-bound') {
      requireValid(configuration === NATIVE_SCHEMA_QWEN_CONFIGURATION);
      const report = frozenRecord(fit, ['accounting', 'initialInputTokens', 'firstCompletionReservedTokens',
        'contextTokenLimit', 'perCompletionOutputTokenLimit', 'maximumNativeCompletions', 'maximumAggregateGeneratedTokens']);
      requireValid(report.accounting === configuration.accounting);
      const input = readInteger(report.initialInputTokens, 0);
      return report.firstCompletionReservedTokens === 12288 && report.contextTokenLimit === 32768
        && report.perCompletionOutputTokenLimit === 12288 && report.maximumNativeCompletions === 2
        && report.maximumAggregateGeneratedTokens === 24576 && input <= 32768 - 12288 - 32;
    }
    if (configuration.accounting.method === 'serialized-byte-budget') {
      const report = frozenRecord(fit, ['accounting', 'serializedRequestBytes', 'requestedOutputTokens',
        'contextTokenLimit', 'outputTokenLimit']);
      requireValid(report.accounting === configuration.accounting);
      const bytes = readInteger(report.serializedRequestBytes, 1);
      const context = readInteger(report.contextTokenLimit, 1);
      const output = readInteger(report.outputTokenLimit, 1);
      return bytes <= configuration.accounting.maxRequestBytes && report.requestedOutputTokens === 4096
        && context === configuration.accounting.contextTokenLimit
        && output === configuration.accounting.outputTokenLimit && output >= 4096;
    }
    const report = readObject(fit, ['accounting', 'inputTokens', 'reservedOutputTokens', 'contextTokenLimit', 'outputTokenLimit']);
    requireValid(report.accounting === configuration.accounting);
    const input = readInteger(report.inputTokens, 0);
    const context = readInteger(report.contextTokenLimit, 1);
    const output = readInteger(report.outputTokenLimit, 1);
    const reserve = (configuration.promptVersion === UNCERTAINTY_PROMPT_VERSION || configuration.promptVersion === REASONING_PROMPT_VERSION || configuration.promptVersion === JUDGMENT_PROMPT_VERSION) ? 12288 : 4096;
    const guard = reserve === 12288 ? 32 : 0;
    return report.reservedOutputTokens === reserve && context === configuration.accounting.contextTokenLimit
      && output === configuration.accounting.outputTokenLimit && output >= reserve && input <= context - reserve - guard;
  } catch { return false; }
}
