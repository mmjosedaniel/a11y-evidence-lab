import type { GenerationConfiguration } from './generation-contract.ts';
import { LOCAL_PARAMETERS, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import { readArray, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';

const tokenizerIdentity = 'sha256:bc26cd0f6499d5bd69f5f7d1baab46718c56a8d443328edf1de7e58710a8b2f6';
const profile = Object.freeze({
  runtimeVersion: '0.33.3', modelDigest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd',
  format: 'gguf', family: 'qwen35', quantization: 'Q4_K_M', context: 32768, sequences: 1,
  renderer: 'ollama-qwen35-renderer-v0.33.3', parser: 'ollama-qwen35-parser-v0.33.3',
  addBos: false, addEos: false, stream: false, think: false, truncate: false, shift: false, keepAlive: '5m',
  inherited: Object.freeze({ presence_penalty: 1.5, temperature: 1, top_k: 20, top_p: 0.95 }),
  defaults: Object.freeze({ num_keep: 4, typical_p: 1, repeat_last_n: 64, repeat_penalty: 1,
    frequency_penalty: 0, seed: -1, num_batch: 512, num_gpu: -1, num_thread: 0,
    draft_num_predict: 4, use_mmap: undefined }),
});

export const QWEN_CONFIGURATION: GenerationConfiguration = Object.freeze({
  providerContext: Object.freeze({ mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }),
  adapterId: 'ollama-generation', adapterVersion: 'm303-ollama-chat-v1', endpoint: 'ollama-loopback-chat',
  promptVersion: PROMPT_VERSION, schemaVersion: SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION,
  parameters: LOCAL_PARAMETERS,
  binding: Object.freeze({ kind: 'local', runtimeVersion: profile.runtimeVersion, modelDigest: profile.modelDigest,
    tokenizerIdentity, templateIdentity: profile.renderer, parserIdentity: profile.parser,
    effectiveConfigurationIdentity: 'm303-qwen35-32768-v1' }),
  accounting: Object.freeze({ method: 'verified-upper-bound', implementationVersion: 'm303-qwen35-utf8-bound-v1',
    tokenizerIdentity, contextTokenLimit: profile.context, outputTokenLimit: 4096 }),
});

function requireLocal(record: Record<string, unknown>): void {
  for (const key of ['remote_host', 'remote_model']) {
    requireValid(!Object.hasOwn(record, key) || record[key] === '');
  }
}

function requireDetails(value: unknown): Record<string, unknown> {
  const details = readObject(value);
  requireValid(details.format === profile.format && details.family === profile.family
    && details.quantization_level === profile.quantization);
  return details;
}

export function validateOllamaGenerationMetadata(
  metadata: { version: unknown; show: unknown; tags: unknown },
): 'missing-prerequisite' | 'configuration' | null {
  try {
    const root = readObject(metadata, ['version', 'show', 'tags']);
    const version = readObject(root.version);
    requireLocal(version);
    requireValid(version.version === profile.runtimeVersion);
    const show = readObject(root.show);
    requireLocal(show);
    requireValid(requireDetails(show.details).parent_model === '');
    requireValid(show.template === '{{ .Prompt }}');
    const capabilities = readArray(show.capabilities, value => {
      requireValid(typeof value === 'string');
      return value;
    });
    requireValid(capabilities.includes('completion'));
    const info = readObject(show.model_info);
    requireValid(info['general.architecture'] === 'qwen35' && info['qwen35.context_length'] === 262144
      && info['tokenizer.ggml.model'] === 'gpt2' && info['tokenizer.ggml.pre'] === 'qwen35'
      && info['tokenizer.ggml.add_eos_token'] === false && info['tokenizer.ggml.add_padding_token'] === false
      && (!Object.hasOwn(info, 'tokenizer.ggml.add_bos_token') || info['tokenizer.ggml.add_bos_token'] === false));
    requireValid(typeof show.parameters === 'string');
    const lines = show.parameters.trim().split(/\r?\n/);
    requireValid(lines.length === 4);
    const seen = new Set<string>();
    for (const line of lines) {
      const match = /^\s*(presence_penalty|temperature|top_k|top_p)\s+([0-9]+(?:\.[0-9]+)?)\s*$/.exec(line);
      requireValid(match && !seen.has(match[1]));
      seen.add(match[1]);
      requireValid(Number(match[2]) === profile.inherited[match[1] as keyof typeof profile.inherited]);
    }
    const tags = readObject(root.tags);
    requireLocal(tags);
    const models = readArray(tags.models, value => {
      const model = readObject(value);
      requireLocal(model);
      requireValid(typeof model.name === 'string' && model.name.length > 0
        && typeof model.model === 'string' && model.model === model.name
        && typeof model.digest === 'string' && /^[0-9a-f]{64}$/.test(model.digest));
      const details = readObject(model.details);
      requireValid(typeof details.format === 'string' && typeof details.family === 'string'
        && typeof details.quantization_level === 'string');
      return { name: model.name, digest: model.digest, details };
    });
    const selected = models.filter(model => model.name === 'qwen3.5:4b');
    requireValid(selected.length <= 1);
    if (selected.length === 0) return 'missing-prerequisite';
    requireValid(selected[0].digest === profile.modelDigest);
    requireDetails(selected[0].details);
    return null;
  } catch { return 'configuration'; }
}
