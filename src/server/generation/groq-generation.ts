import { debuglog } from 'node:util';
import type { GenerationAdapter, GenerationRequest, PreparedGeneration } from './generation-contract.ts';
import { readGroqCredential } from './groq-credential.ts';
import type { GroqCredentialIO } from './groq-credential.ts';
import { GROQ_CONFIGURATION } from './groq-generation-configuration.ts';
import { prepareGroqGenerationWire } from './groq-generation-fit.ts';
import { dispatchGroqGeneration } from './groq-generation-http.ts';
import type { GroqNativeRequest } from './groq-generation-http.ts';

export function createGroqGenerationAdapter(options: {
  credentialIO?: GroqCredentialIO; requestImplementation?: GroqNativeRequest;
} = {}): GenerationAdapter {
  const { credentialIO, requestImplementation } = options;
  const debugEnabled = () => debuglog('http').enabled || debuglog('https').enabled || credentialIO?.debugEnabled() === true;
  return Object.freeze({
    configuration: GROQ_CONFIGURATION,
    async prepare(request: GenerationRequest, signal: AbortSignal): Promise<PreparedGeneration> {
      const wire = prepareGroqGenerationWire(request);
      if (!wire.ok) return Object.freeze({ ok: false, error: wire.error, cleanup: 'complete' });
      let loaded = await readGroqCredential(signal, credentialIO);
      if (!loaded.ok) return loaded;
      let credential = loaded.credential;
      loaded = { ok: false, error: 'configuration', cleanup: 'complete' };
      const clear = () => { credential = ''; };
      signal.addEventListener('abort', clear, { once: true });
      if (signal.aborted) clear();
      return Object.freeze({
        ok: true, request, configuration: GROQ_CONFIGURATION, fit: wire.fit, cleanup: 'complete',
        async dispatch(dispatchSignal, attemptTransport) {
          try {
            if (!credential) return { ok: false, error: 'configuration', cleanup: 'complete' };
            if (dispatchSignal.aborted) return { ok: false, error: 'shutdown', cleanup: 'complete' };
            if (debugEnabled()) throw new Error('Groq dispatch configuration rejected');
            const result = dispatchGroqGeneration(wire.body, credential, dispatchSignal, attemptTransport, requestImplementation);
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
