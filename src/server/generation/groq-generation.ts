import { UNCERTAINTY_GROQ_CONFIGURATION, JUDGMENT_GROQ_CONFIGURATION, REASONING_GROQ_CONFIGURATION } from './reasoning-generation-configuration.ts';
import { CASE_GROQ_CONFIGURATION, PROMPT_CASE_GROQ_CONFIGURATION } from './generation-case-request.ts';
import { debuglog } from 'node:util';
import type { GenerationAdapter, GenerationRequest, PreparedGeneration } from './generation-contract.ts';
import { readGroqCredential } from './groq-credential.ts';
import type { GroqCredentialIO } from './groq-credential.ts';
import { GROQ_CONFIGURATION } from './groq-generation-configuration.ts';
import { prepareUncertaintyGroqGenerationWire, prepareJudgmentGroqGenerationWire, prepareReasoningGroqGenerationWire, preparePromptCaseGroqGenerationWire, prepareCaseGroqGenerationWire, prepareGroqGenerationWire } from './groq-generation-fit.ts';
import { dispatchGroqGeneration } from './groq-generation-http.ts';
import type { GroqNativeRequest } from './groq-generation-http.ts';

type AdapterOptions = { credentialIO?: GroqCredentialIO; requestImplementation?: GroqNativeRequest };

export function createGroqGenerationAdapter(options: AdapterOptions = {}): GenerationAdapter {
  return createAdapter('legacy', options);
}

export function createCaseGroqGenerationAdapter(options: AdapterOptions = {}): GenerationAdapter {
  return createAdapter('repaired', options);
}

export function createPromptCaseGroqGenerationAdapter(options: AdapterOptions = {}): GenerationAdapter {
  return createAdapter('prompt', options);
}

export function createReasoningGroqGenerationAdapter(options: AdapterOptions = {}): GenerationAdapter {
  return createAdapter('reasoning', options);
}

export function createJudgmentGroqGenerationAdapter(options: AdapterOptions = {}): GenerationAdapter {
  return createAdapter('judgment', options);
}

export function createUncertaintyGroqGenerationAdapter(options: AdapterOptions = {}): GenerationAdapter {
  return createAdapter('uncertainty', options);
}

function createAdapter(variant: 'legacy' | 'repaired' | 'prompt' | 'reasoning' | 'judgment' | 'uncertainty', options: AdapterOptions): GenerationAdapter {
  const configuration = variant === 'uncertainty' ? UNCERTAINTY_GROQ_CONFIGURATION
      : variant === 'judgment' ? JUDGMENT_GROQ_CONFIGURATION
      : variant === 'reasoning' ? REASONING_GROQ_CONFIGURATION
    : variant === 'prompt' ? PROMPT_CASE_GROQ_CONFIGURATION
    : variant === 'repaired' ? CASE_GROQ_CONFIGURATION : GROQ_CONFIGURATION;
  const { credentialIO, requestImplementation } = options;
  const debugEnabled = () => debuglog('http').enabled || debuglog('https').enabled || credentialIO?.debugEnabled() === true;
  return Object.freeze({
    configuration,
    async prepare(request: GenerationRequest, signal: AbortSignal, expiresAt?: number): Promise<PreparedGeneration> {
      const wire = (variant === 'uncertainty' ? prepareUncertaintyGroqGenerationWire
        : variant === 'judgment' ? prepareJudgmentGroqGenerationWire
        : variant === 'reasoning' ? prepareReasoningGroqGenerationWire
        : variant === 'prompt' ? preparePromptCaseGroqGenerationWire
        : variant === 'repaired' ? prepareCaseGroqGenerationWire : prepareGroqGenerationWire)(request);
      if (!wire.ok) return Object.freeze({ ok: false, error: wire.error, cleanup: 'complete' });
      let loaded = await readGroqCredential(signal, credentialIO);
      if (!loaded.ok) return loaded;
      let credential = loaded.credential;
      loaded = { ok: false, error: 'configuration', cleanup: 'complete' };
      const clear = () => { credential = ''; };
      signal.addEventListener('abort', clear, { once: true });
      if (signal.aborted) clear();
      return Object.freeze({
        ok: true, request, configuration, fit: wire.fit, cleanup: 'complete',
        async dispatch(dispatchSignal, attemptTransport) {
          try {
            if (!credential) return { ok: false, error: 'configuration', cleanup: 'complete' };
            if (dispatchSignal.aborted) return { ok: false, error: 'shutdown', cleanup: 'complete' };
            if (debugEnabled()) throw new Error('Groq dispatch configuration rejected');
            const result = dispatchGroqGeneration(wire.body, credential, dispatchSignal, attemptTransport, requestImplementation, expiresAt);
            clear();
            return await result;
          } finally {
            clear();
            signal.removeEventListener('abort', clear);
          }
        },
      } satisfies PreparedGeneration);
    },
  });
}
