import { readArray, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { GENERATION_SCHEMA, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import { readGenerationParameters } from './generation-contract.ts';
import type { GenerationTokenFit, GenerationRequest } from './generation-contract.ts';
import { QWEN_CONFIGURATION } from './ollama-generation-model.ts';

export function prepareOllamaGenerationWire(request: GenerationRequest):
  { readonly ok: true; readonly body: string; readonly fit: GenerationTokenFit }
  | { readonly ok: false; readonly error: 'configuration' | 'input-fit' } {
  let error: 'configuration' | 'input-fit' = 'input-fit';
  try {
    const root = readObject(request, ['messages', 'schema', 'promptVersion', 'schemaVersion',
      'outputContractVersion', 'controls', 'deadlineMs', 'configuration']);
    error = 'configuration';
    requireValid(root.configuration === QWEN_CONFIGURATION && root.promptVersion === PROMPT_VERSION
      && root.schemaVersion === SCHEMA_VERSION && root.outputContractVersion === OUTPUT_CONTRACT_VERSION
      && root.deadlineMs === 120000);
    readGenerationParameters(root.controls, 'local');
    error = 'input-fit';
    requireValid(root.schema === GENERATION_SCHEMA);
    const messages = readArray(root.messages, value => {
      const message = readObject(value, ['role', 'content']);
      requireValid(typeof message.content === 'string' && message.content.isWellFormed());
      return Object.freeze({ role: message.role, content: message.content });
    });
    requireValid(messages.length === 2 && messages[0].role === 'system' && messages[1].role === 'user');
    const serializedSchema = JSON.stringify(GENERATION_SCHEMA);
    const inputTokens = Buffer.byteLength(messages[0].content, 'utf8') + Buffer.byteLength(messages[1].content, 'utf8')
      + 99 + Buffer.byteLength(serializedSchema, 'utf8');
    requireValid(Number.isSafeInteger(inputTokens) && inputTokens >= 0 && inputTokens + 4096 <= 32768);
    // Only detached admitted text enters serialization; never revisit caller objects.
    const body = JSON.stringify({ model: 'qwen3.5:4b:local', messages, format: GENERATION_SCHEMA,
      stream: false, think: false, truncate: false, shift: false, keep_alive: '5m',
      options: { num_ctx: 32768, num_predict: 4096, temperature: 0, top_p: 1 } });
    const fit: GenerationTokenFit = Object.freeze({ accounting: QWEN_CONFIGURATION.accounting, inputTokens,
      reservedOutputTokens: 4096, contextTokenLimit: 32768, outputTokenLimit: 4096 });
    return Object.freeze({ ok: true, body, fit });
  } catch { return Object.freeze({ ok: false, error }); }
}
