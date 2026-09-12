import type { GenerationByteAccounting, GenerationConfiguration } from './generation-contract.ts';
import { GROQ_PARAMETERS, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';

export const GROQ_CONFIGURATION: GenerationConfiguration & { readonly accounting: GenerationByteAccounting } = Object.freeze({
  providerContext: Object.freeze({ mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' }),
  adapterId: 'groq-generation', adapterVersion: 'm304-groq-v1', endpoint: 'groq-chat-completions',
  promptVersion: PROMPT_VERSION, schemaVersion: SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION,
  parameters: GROQ_PARAMETERS,
  binding: Object.freeze({ kind: 'groq', exposedDefaultsIdentity: 'groq-gpt-oss-20b-2026-09-11-v1', serverRevision: null }),
  accounting: Object.freeze({ method: 'serialized-byte-budget', implementationVersion: 'm304-groq-request-bytes-v1',
    tokenizerIdentity: null, maxRequestBytes: 65536, contextTokenLimit: 131072, outputTokenLimit: 65536 }),
});
