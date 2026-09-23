import { NATIVE_SCHEMA_QWEN_CONFIGURATION, UNCERTAINTY_QWEN_CONFIGURATION, JUDGMENT_QWEN_CONFIGURATION, REASONING_QWEN_CONFIGURATION, configurationDeadlineMs } from './reasoning-generation-configuration.ts';
import { CASE_QWEN_CONFIGURATION, PROMPT_CASE_QWEN_CONFIGURATION } from './generation-case-request.ts';
import { emitGenerationRejection, type GenerationRejectionSink, type OutputValidationDetailSink } from './generation-diagnostics.ts';
import type { GenerationAdapter, GenerationRequest, PreparedGeneration } from './generation-contract.ts';
import { prepareNativeSchemaOllamaGenerationWire, prepareUncertaintyOllamaGenerationWire, prepareJudgmentOllamaGenerationWire, prepareReasoningOllamaGenerationWire, preparePromptCaseOllamaGenerationWire, prepareCaseOllamaGenerationWire, prepareOllamaGenerationWire } from './ollama-generation-fit.ts';
import { dispatchOllamaGeneration, requestOllamaGenerationMetadata } from './ollama-generation-http.ts';
import type { OllamaNativeRequest } from './ollama-generation-http.ts';
import { QWEN_CONFIGURATION, validateOllamaGenerationMetadata } from './ollama-generation-model.ts';

export function createOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink): GenerationAdapter {
  return createAdapter('legacy', requestImplementation, onRejection);
}

export function createCaseOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink): GenerationAdapter {
  return createAdapter('repaired', requestImplementation, onRejection);
}

export function createPromptCaseOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink): GenerationAdapter {
  return createAdapter('prompt', requestImplementation, onRejection);
}

export function createReasoningOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink): GenerationAdapter {
  return createAdapter('reasoning', requestImplementation, onRejection);
}

export function createJudgmentOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink): GenerationAdapter {
  return createAdapter('judgment', requestImplementation, onRejection);
}

export function createUncertaintyOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest,
  onRejection?: GenerationRejectionSink, onDetail?: OutputValidationDetailSink): GenerationAdapter {
  return createAdapter('uncertainty', requestImplementation, onRejection, onDetail);
}

export function createNativeSchemaOllamaGenerationAdapter(requestImplementation?: OllamaNativeRequest,
  onRejection?: GenerationRejectionSink, onDetail?: OutputValidationDetailSink): GenerationAdapter {
  return createAdapter('native', requestImplementation, onRejection, onDetail);
}

function createAdapter(variant: 'legacy' | 'repaired' | 'prompt' | 'reasoning' | 'judgment' | 'uncertainty' | 'native', requestImplementation?: OllamaNativeRequest, onRejection?: GenerationRejectionSink, onDetail?: OutputValidationDetailSink): GenerationAdapter {
  const configuration = variant === 'native' ? NATIVE_SCHEMA_QWEN_CONFIGURATION
      : variant === 'uncertainty' ? UNCERTAINTY_QWEN_CONFIGURATION
      : variant === 'judgment' ? JUDGMENT_QWEN_CONFIGURATION
      : variant === 'reasoning' ? REASONING_QWEN_CONFIGURATION
    : variant === 'prompt' ? PROMPT_CASE_QWEN_CONFIGURATION
    : variant === 'repaired' ? CASE_QWEN_CONFIGURATION : QWEN_CONFIGURATION;
  return Object.freeze({
    configuration,
    async prepare(request: GenerationRequest, signal: AbortSignal, expiresAt = (variant === 'native' || variant === 'reasoning' || variant === 'judgment' || variant === 'uncertainty') ? Date.now() + configurationDeadlineMs(configuration) : undefined): Promise<PreparedGeneration> {
      const wire = (variant === 'native' ? prepareNativeSchemaOllamaGenerationWire
        : variant === 'uncertainty' ? prepareUncertaintyOllamaGenerationWire
        : variant === 'judgment' ? prepareJudgmentOllamaGenerationWire
        : variant === 'reasoning' ? prepareReasoningOllamaGenerationWire
        : variant === 'prompt' ? preparePromptCaseOllamaGenerationWire
        : variant === 'repaired' ? prepareCaseOllamaGenerationWire : prepareOllamaGenerationWire)(request);
      if (!wire.ok) return Object.freeze({ ok: false, error: wire.error, cleanup: 'complete' });

      const version = await requestOllamaGenerationMetadata('version', signal, requestImplementation, expiresAt);
      if (!version.ok) return version;
      const show = await requestOllamaGenerationMetadata('show', signal, requestImplementation, expiresAt);
      if (!show.ok) return show;
      const tags = await requestOllamaGenerationMetadata('tags', signal, requestImplementation, expiresAt);
      if (!tags.ok) return tags;

      const error = validateOllamaGenerationMetadata({ version: version.value, show: show.value, tags: tags.value });
      if (error !== null) return Object.freeze({ ok: false, error, cleanup: 'complete' });
      return Object.freeze({
        ok: true,
        request,
        configuration,
        fit: wire.fit,
        dispatch: (dispatchSignal, attemptTransport) =>
          dispatchOllamaGeneration(wire.body, dispatchSignal, attemptTransport, requestImplementation, onRejection, expiresAt, variant === 'native' || variant === 'reasoning' || variant === 'judgment' || variant === 'uncertainty', onDetail),
        cleanup: 'complete',
      } satisfies PreparedGeneration);
    },
  });
}
