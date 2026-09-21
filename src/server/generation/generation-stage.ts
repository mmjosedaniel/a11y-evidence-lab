import { requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { readFinding } from '../domain/run-contract/finding-validation.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { readCorpusBytes } from '../retrieval/corpus-catalog.ts';
import { validateRetrievalResult } from '../retrieval/retrieval-contract.ts';
import type { GenerationOutcome } from './generation-contract.ts';
import { executeGenerationOperation } from './generation-execution.ts';
import { buildGenerationInput, createGenerationRequest } from './generation-input.ts';
import { validateProposal } from './proposal-contract.ts';

type StageInput = {
  readonly finding: unknown; readonly retrieval: unknown;
  readonly analysisStartedAt: string; readonly analysisFinishedAt: string;
  readonly providerContext: ProviderContext; readonly adapter?: unknown; readonly signal: AbortSignal;
};

export async function executeGeneration(options: StageInput): Promise<GenerationOutcome> {
  const outcome = await executeGenerationOperation({
    signal: options.signal, providerContext: options.providerContext, adapter: options.adapter,
    async admit() {
      const bytes = await readCorpusBytes();
      const built = buildGenerationInput({ ...options, manifestBytes: bytes[0], passageBytes: bytes[1] });
      if (built.status === 'failed') return { status: 'failed', error: 'input-integrity' };
      if (built.status === 'abstained') return built;
      const finding = readFinding(options.finding);
      const retrieval = validateRetrievalResult(options.retrieval, finding);
      requireValid(retrieval.ok);
      return { status: 'ready',
        createRequest: configuration => createGenerationRequest(built.input, options.providerContext, configuration),
        validateCandidate: candidate => validateProposal(candidate, { finding, retrieval: retrieval.value }),
      };
    },
  });
  if (outcome.status === 'abstained') return Object.freeze({ status: 'abstained', decision: outcome.decision, cleanupFailed: false });
  const observation = outcome.observation;
  const invocation = observation && Object.freeze({ ...observation.adapterConfiguration,
    outcome: observation.outcome, validation: observation.validation });
  if (outcome.status === 'proposal') return Object.freeze({ status: 'proposal', proposal: outcome.proposal,
    invocation: invocation!, cleanupFailed: false });
  return Object.freeze({ status: 'failed', error: outcome.error, ...(invocation ? { invocation } : {}),
    cleanupFailed: outcome.cleanupFailed });
}
