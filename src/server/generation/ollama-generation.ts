import { emitGenerationRejection, type GenerationRejectionSink } from './generation-diagnostics.ts';
import type { GenerationAdapter, GenerationRequest, PreparedGeneration } from './generation-contract.ts';
import { prepareOllamaGenerationWire } from './ollama-generation-fit.ts';
import { dispatchOllamaGeneration, requestOllamaGenerationMetadata } from './ollama-generation-http.ts';
import type { OllamaNativeRequest } from './ollama-generation-http.ts';
import { QWEN_CONFIGURATION, validateOllamaGenerationMetadata } from './ollama-generation-model.ts';

export function createOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink): GenerationAdapter {
  return Object.freeze({
    configuration: QWEN_CONFIGURATION,
    async prepare(request: GenerationRequest, signal: AbortSignal): Promise<PreparedGeneration> {
      const wire = prepareOllamaGenerationWire(request);
      if (!wire.ok) return Object.freeze({ ok: false, error: wire.error, cleanup: 'complete' });

      const version = await requestOllamaGenerationMetadata('version', signal, requestImplementation);
      if (!version.ok) return version;
      const show = await requestOllamaGenerationMetadata('show', signal, requestImplementation);
      if (!show.ok) return show;
      const tags = await requestOllamaGenerationMetadata('tags', signal, requestImplementation);
      if (!tags.ok) return tags;

      const error = validateOllamaGenerationMetadata({ version: version.value, show: show.value, tags: tags.value });
      if (error !== null) return Object.freeze({ ok: false, error, cleanup: 'complete' });
      return Object.freeze({
        ok: true,
        request,
        configuration: QWEN_CONFIGURATION,
        fit: wire.fit,
        dispatch: (dispatchSignal, attemptTransport) =>
          dispatchOllamaGeneration(wire.body, dispatchSignal, attemptTransport, requestImplementation, onRejection),
        cleanup: 'complete',
      } satisfies PreparedGeneration);
    },
  });
}
