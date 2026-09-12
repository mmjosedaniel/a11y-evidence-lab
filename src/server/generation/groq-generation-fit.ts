import { readArray, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { GENERATION_DEADLINE_MS, GENERATION_SCHEMA, GROQ_PARAMETERS, OUTPUT_CONTRACT_VERSION,
  PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import type { GenerationByteFit, GenerationRequest } from './generation-contract.ts';
import { GROQ_CONFIGURATION } from './groq-generation-configuration.ts';

export function prepareGroqGenerationWire(request: GenerationRequest):
  { readonly ok: true; readonly body: string; readonly fit: GenerationByteFit }
  | { readonly ok: false; readonly error: 'configuration' | 'input-fit' } {
  let error: 'configuration' | 'input-fit' = 'input-fit';
  try {
    const root = readObject(request, ['messages', 'schema', 'promptVersion', 'schemaVersion',
      'outputContractVersion', 'controls', 'deadlineMs', 'configuration']);
    error = 'configuration';
    requireValid(root.configuration === GROQ_CONFIGURATION && root.controls === GROQ_PARAMETERS
      && root.promptVersion === PROMPT_VERSION && root.schemaVersion === SCHEMA_VERSION
      && root.outputContractVersion === OUTPUT_CONTRACT_VERSION && root.deadlineMs === GENERATION_DEADLINE_MS);
    error = 'input-fit';
    requireValid(root.schema === GENERATION_SCHEMA);
    const messages = readArray(root.messages, value => {
      const message = readObject(value, ['role', 'content']);
      requireValid(typeof message.content === 'string' && message.content.isWellFormed());
      return { role: message.role, content: message.content };
    });
    requireValid(messages.length === 2 && messages[0].role === 'system' && messages[1].role === 'user');
    // Serialize detached validated values once; dispatch uses these exact measured bytes.
    const body = JSON.stringify({ model: 'openai/gpt-oss-20b', messages,
      response_format: { type: 'json_schema', json_schema: { name: 'm301_proposal_v1', strict: true, schema: GENERATION_SCHEMA } },
      ...GROQ_PARAMETERS });
    const accounting = GROQ_CONFIGURATION.accounting;
    const serializedRequestBytes = Buffer.byteLength(body, 'utf8');
    requireValid(serializedRequestBytes <= accounting.maxRequestBytes
      && GROQ_PARAMETERS.max_completion_tokens <= accounting.outputTokenLimit);
    const fit: GenerationByteFit = Object.freeze({ accounting, serializedRequestBytes, requestedOutputTokens: 4096,
      contextTokenLimit: accounting.contextTokenLimit, outputTokenLimit: accounting.outputTokenLimit });
    return Object.freeze({ ok: true, body, fit });
  } catch { return Object.freeze({ ok: false, error }); }
}
