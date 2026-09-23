import { NATIVE_SCHEMA_QWEN_CONFIGURATION, UNCERTAINTY_QWEN_CONFIGURATION, JUDGMENT_QWEN_CONFIGURATION, REASONING_QWEN_CONFIGURATION, configurationDeadlineMs } from './reasoning-generation-configuration.ts';
import { CASE_QWEN_CONFIGURATION, PROMPT_CASE_QWEN_CONFIGURATION, readCaseGenerationSchema } from './generation-case-request.ts';
import { readArray, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { GENERATION_SCHEMA, OUTPUT_CONTRACT_VERSION } from './generation-artifacts.ts';
import { readGenerationParameters } from './generation-contract.ts';
import type { GenerationInitialPromptFit, GenerationTokenFit, GenerationRequest } from './generation-contract.ts';
import { QWEN_CONFIGURATION } from './ollama-generation-model.ts';

export function prepareOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'legacy');
}

export function prepareCaseOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'repaired');
}

export function preparePromptCaseOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'prompt');
}

export function prepareReasoningOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'reasoning');
}

export function prepareJudgmentOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'judgment');
}

export function prepareUncertaintyOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'uncertainty');
}

export function prepareNativeSchemaOllamaGenerationWire(request: GenerationRequest) {
  return prepareWire(request, 'native');
}

type HistoricalVariant = 'legacy' | 'repaired' | 'prompt' | 'reasoning' | 'judgment' | 'uncertainty';
type WireResult<T> = { readonly ok: true; readonly body: string; readonly fit: T }
  | { readonly ok: false; readonly error: 'configuration' | 'input-fit' };
function prepareWire(request: GenerationRequest, variant: 'native'): WireResult<GenerationInitialPromptFit>;
function prepareWire(request: GenerationRequest, variant: HistoricalVariant): WireResult<GenerationTokenFit>;
function prepareWire(request: GenerationRequest, variant: HistoricalVariant | 'native'):
  WireResult<GenerationTokenFit | GenerationInitialPromptFit> {
  let error: 'configuration' | 'input-fit' = 'input-fit';
  try {
    const configuration = variant === 'native' ? NATIVE_SCHEMA_QWEN_CONFIGURATION
      : variant === 'uncertainty' ? UNCERTAINTY_QWEN_CONFIGURATION
      : variant === 'judgment' ? JUDGMENT_QWEN_CONFIGURATION
      : variant === 'reasoning' ? REASONING_QWEN_CONFIGURATION
      : variant === 'prompt' ? PROMPT_CASE_QWEN_CONFIGURATION
      : variant === 'repaired' ? CASE_QWEN_CONFIGURATION : QWEN_CONFIGURATION;
    const schema = variant !== 'legacy' ? readCaseGenerationSchema(request, configuration) : GENERATION_SCHEMA;
    requireValid(schema !== null);
    const root = readObject(request, ['messages', 'schema', 'promptVersion', 'schemaVersion',
      'outputContractVersion', 'controls', 'deadlineMs', 'configuration']);
    error = 'configuration';
    requireValid(root.configuration === configuration && root.promptVersion === configuration.promptVersion
      && root.schemaVersion === configuration.schemaVersion && root.outputContractVersion === OUTPUT_CONTRACT_VERSION
      && root.deadlineMs === configurationDeadlineMs(configuration));
    readGenerationParameters(root.controls, 'local', (variant === 'native' || variant === 'reasoning' || variant === 'judgment' || variant === 'uncertainty'));
    error = 'input-fit';
    requireValid(root.schema === schema);
    const detached = readArray(root.messages, value => {
      const message = readObject(value, ['role', 'content']);
      requireValid(typeof message.content === 'string' && message.content.isWellFormed());
      return Object.freeze({ role: message.role, content: message.content });
    });
    requireValid(detached.length === 2 && detached[0].role === 'system' && detached[1].role === 'user');
    const serializedSchema = JSON.stringify(schema);
    const reasoning = variant === 'native' || variant === 'reasoning' || variant === 'judgment' || variant === 'uncertainty';
    const messages = reasoning ? [Object.freeze({ role: 'system',
      content: `${detached[0].content}\n<proposal-schema>\n${serializedSchema}\n</proposal-schema>\n` }), detached[1]] : detached;
    const reserve = reasoning ? 12288 : 4096;
    const inputTokens = Buffer.byteLength(messages[0].content, 'utf8') + Buffer.byteLength(messages[1].content, 'utf8')
      + (reasoning ? 88 : 99 + Buffer.byteLength(serializedSchema, 'utf8'));
    requireValid(Number.isSafeInteger(inputTokens) && inputTokens >= 0 && inputTokens + reserve + (reasoning ? 32 : 0) <= 32768);
    // Only detached admitted text enters serialization; never revisit caller objects.
    const body = JSON.stringify({ model: 'qwen3.5:4b:local', messages, ...(reasoning && variant !== 'native' ? {} : { format: schema }),
      stream: false, think: reasoning, truncate: false, shift: false, keep_alive: '5m',
      options: { num_ctx: 32768, num_predict: reserve, temperature: reasoning ? 1 : 0, top_p: reasoning ? 0.95 : 1 } });
    if (configuration.accounting.method === 'initial-prompt-upper-bound') {
      // This reserve admits only the first prompt, not the reasoning-prefixed native second prompt.
      const fit: GenerationInitialPromptFit = Object.freeze({ accounting: configuration.accounting,
        initialInputTokens: inputTokens, firstCompletionReservedTokens: 12288, contextTokenLimit: 32768,
        perCompletionOutputTokenLimit: 12288, maximumNativeCompletions: 2, maximumAggregateGeneratedTokens: 24576 });
      return Object.freeze({ ok: true, body, fit });
    }
    const fit: GenerationTokenFit = Object.freeze({ accounting: configuration.accounting, inputTokens,
      reservedOutputTokens: reserve, contextTokenLimit: 32768, outputTokenLimit: reserve });
    return Object.freeze({ ok: true, body, fit });
  } catch { return Object.freeze({ ok: false, error }); }
}
