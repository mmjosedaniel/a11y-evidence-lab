import type { ProviderContext } from '../domain/run-contract.ts';
import type { GenerationAdapter } from '../generation/generation-contract.ts';
import { createUncertaintyGroqGenerationAdapter } from '../generation/groq-generation.ts';
import { createNativeSchemaOllamaGenerationAdapter } from '../generation/ollama-generation.ts';

export function resolveGenerationAdapter(context: ProviderContext): GenerationAdapter {
  return context.mode === 'local' ? createNativeSchemaOllamaGenerationAdapter() : createUncertaintyGroqGenerationAdapter();
}
