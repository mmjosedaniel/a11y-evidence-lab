import type { ProviderContext } from '../domain/run-contract.ts';
import type { GenerationAdapter } from '../generation/generation-contract.ts';
import { createGroqGenerationAdapter } from '../generation/groq-generation.ts';
import { createOllamaGenerationAdapter } from '../generation/ollama-generation.ts';

export function resolveGenerationAdapter(context: ProviderContext): GenerationAdapter {
  return context.mode === 'local' ? createOllamaGenerationAdapter() : createGroqGenerationAdapter();
}
