import { readChoice, readInteger, readObject, readPattern, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
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
    requireValid(root.promptVersion === PROMPT_VERSION && root.schemaVersion === SCHEMA_VERSION
      && root.outputContractVersion === OUTPUT_CONTRACT_VERSION);
    readGenerationParameters(root.parameters, mode);
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
    const report = readObject(fit, ['accounting', 'inputTokens', 'reservedOutputTokens', 'contextTokenLimit', 'outputTokenLimit']);
    requireValid(report.accounting === configuration.accounting);
    const input = readInteger(report.inputTokens, 0);
    const context = readInteger(report.contextTokenLimit, 1);
    const output = readInteger(report.outputTokenLimit, 1);
    return report.reservedOutputTokens === 4096 && context === configuration.accounting.contextTokenLimit
      && output === configuration.accounting.outputTokenLimit && output >= 4096 && input <= context - 4096;
  } catch { return false; }
}
