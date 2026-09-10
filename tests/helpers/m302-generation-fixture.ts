import { assessFindingEvidence } from '../../src/server/domain/finding-sufficiency.ts';
import { readFinding } from '../../src/server/domain/run-contract/finding-validation.ts';
import type { NativeFinding } from '../../src/server/domain/run-contract/run-types.ts';
import type {
  AttemptTransport,
  GenerationAdapter,
  GenerationConfiguration,
  GenerationRequest,
  ProviderInvocation,
} from '../../src/server/generation/generation-contract.ts';
import { createFindingQuery } from '../../src/server/retrieval/finding-query.ts';
import type { RetrievalResult } from '../../src/server/retrieval/retrieval-contract.ts';
import {
  contrastFinding,
  fact,
  imageFinding,
  labelFinding,
  retrievalResult,
  unavailable,
} from './m202-retrieval-fixture.ts';
import {
  assessedSupportedRetrievalRun,
  selectedFinding,
} from './m202-retrieval-service-fixture.ts';

export type GenerationProfile = 'image-alt' | 'label' | 'color-contrast';
export type GenerationMode = 'local' | 'groq';

export type MutableGenerationConfiguration = Record<string, unknown> & {
  providerContext: Record<string, unknown>;
  parameters: Record<string, unknown>;
  binding: Record<string, unknown>;
  accounting: Record<string, unknown>;
};

export type MutableSupportedText = {
  text: string;
  evidenceReferences: string[];
  passageIds: string[];
};

export type MutableProposalCandidate = {
  type: string;
  findingId: string;
  findingSummary: MutableSupportedText;
  userImpact: MutableSupportedText;
  remediation: MutableSupportedText;
  evidenceSufficiency: { findingEvidence: string; guidance: string };
  confidence: string | number;
  uncertainty: string;
  assumptions: string[];
  blockingManualJudgment: string;
  postChangeVerificationReminder: string;
};

export const generationStartedAt = '2026-08-30T10:00:05.000Z';
export const generationFinishedAt = '2026-08-30T10:00:06.000Z';

const profilePassages: Readonly<Record<GenerationProfile, readonly string[]>> = Object.freeze({
  'image-alt': Object.freeze(['h37-text-alternative', 'understanding111-intent', 'wcag22-sc111']),
  label: Object.freeze(['h44-explicit-label', 'understanding412-intent', 'wcag22-sc412']),
  'color-contrast': Object.freeze(['g18-contrast-remediation', 'understanding143-intent', 'wcag22-sc143']),
});

function profileFinding(profile: GenerationProfile, incompleteEvidence: boolean): unknown {
  switch (profile) {
    case 'image-alt':
      return imageFinding(fact('img'), incompleteEvidence ? unavailable('missing') : fact('absent'));
    case 'label':
      return labelFinding(fact('input'), incompleteEvidence ? 'unavailable' : 'negative');
    case 'color-contrast':
      return contrastFinding(incompleteEvidence ? 'unavailable' : 'below');
  }
}

export function generationFixture(
  profile: GenerationProfile = 'image-alt',
  options: { readonly incompleteEvidence?: boolean; readonly passageIds?: readonly string[] } = {},
): { finding: NativeFinding; retrieval: RetrievalResult; proposal: MutableProposalCandidate } {
  const finding = readFinding(profileFinding(profile, options.incompleteEvidence ?? false));
  const query = createFindingQuery(finding);
  if (!query.ok) throw new Error('Synthetic generation fixture must produce a valid query');
  const passageIds = options.passageIds ?? profilePassages[profile];
  const retrieval = retrievalResult(query.value, passageIds.map((passageId, index) => ({
    passageId,
    score: 0.9 - index * 0.1,
  }))) as RetrievalResult;
  const assessment = assessFindingEvidence(finding);
  const evidenceReference = assessment.availableReferences[0];
  if (!evidenceReference) throw new Error('Synthetic generation fixture needs available evidence');
  const citation = passageIds[0] ?? profilePassages[profile][0]!;
  return {
    finding,
    retrieval,
    proposal: {
      type: 'proposal',
      findingId: finding.findingId,
      findingSummary: {
        text: 'The scanner recorded a bounded issue for the selected element.',
        evidenceReferences: [evidenceReference],
        passageIds: [],
      },
      userImpact: {
        text: 'Some people may not receive the information conveyed by this element.',
        evidenceReferences: [],
        passageIds: [citation],
      },
      remediation: {
        text: 'Use the cited guidance to choose a bounded change for this element.',
        evidenceReferences: [],
        passageIds: [citation],
      },
      evidenceSufficiency: { findingEvidence: 'complete', guidance: 'supported' },
      confidence: 'medium',
      uncertainty: 'The intended meaning of the element still requires human judgment.',
      assumptions: ['The retained evidence describes the element under review.'],
      blockingManualJudgment: 'Determine the appropriate accessible treatment for this element.',
      postChangeVerificationReminder: 'Rescan and perform the relevant human checks after the change.',
    },
  };
}

export function cloneCandidate(candidate: MutableProposalCandidate): MutableProposalCandidate {
  return structuredClone(candidate);
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export function generationConfiguration(
  mode: GenerationMode = 'local',
  mutate?: (configuration: MutableGenerationConfiguration) => void,
): Readonly<MutableGenerationConfiguration> {
  const configuration: MutableGenerationConfiguration = mode === 'local' ? {
    providerContext: { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' },
    adapterId: 'ollama-generation',
    adapterVersion: 'adapter-v1',
    endpoint: 'ollama-loopback-chat',
    promptVersion: 'm302-instructions-v1',
    schemaVersion: 'm302-schema-v1',
    outputContractVersion: 'm301-proposal-v1',
    parameters: { temperature: 0, top_p: 1, num_predict: 4096, think: false, stream: false, responses: 1 },
    binding: {
      kind: 'local', runtimeVersion: 'ollama-1', modelDigest: 'a'.repeat(64),
      tokenizerIdentity: 'qwen-tokenizer-v1', templateIdentity: 'ollama-template-v1',
      parserIdentity: 'ollama-parser-v1', effectiveConfigurationIdentity: 'local-effective-v1',
    },
    accounting: {
      method: 'exact-tokenizer', implementationVersion: 'counter-v1',
      tokenizerIdentity: 'qwen-tokenizer-v1', contextTokenLimit: 8192, outputTokenLimit: 4096,
    },
  } : {
    providerContext: { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' },
    adapterId: 'groq-generation',
    adapterVersion: 'adapter-v1',
    endpoint: 'groq-chat-completions',
    promptVersion: 'm302-instructions-v1',
    schemaVersion: 'm302-schema-v1',
    outputContractVersion: 'm301-proposal-v1',
    parameters: {
      temperature: 0, top_p: 1, max_completion_tokens: 4096, reasoning_effort: 'low',
      include_reasoning: false, stream: false, n: 1,
    },
    binding: { kind: 'groq', exposedDefaultsIdentity: 'groq-defaults-v1', serverRevision: null },
    accounting: {
      method: 'verified-upper-bound', implementationVersion: 'counter-v1',
      tokenizerIdentity: null, contextTokenLimit: 8192, outputTokenLimit: 4096,
    },
  };
  mutate?.(configuration);
  return deepFreeze(configuration);
}

export function generationInvocation(
  mode: GenerationMode = 'local',
  outcome: ProviderInvocation['outcome'] = 'response',
  validation: ProviderInvocation['validation'] = outcome === 'response' ? 'passed' : 'not-run',
): ProviderInvocation {
  const configuration = generationConfiguration(mode);
  return structuredClone({
    adapterId: configuration.adapterId,
    adapterVersion: configuration.adapterVersion,
    endpointIdentity: configuration.endpoint,
    promptVersion: configuration.promptVersion,
    schemaVersion: configuration.schemaVersion,
    outputContractVersion: configuration.outputContractVersion,
    parameters: configuration.parameters,
    outcome,
    validation,
  }) as ProviderInvocation;
}

function supportedGenerationBase(runId: string, mode: GenerationMode): Record<string | number, unknown> {
  const run = assessedSupportedRetrievalRun(runId);
  run.providerContext = mode === 'local'
    ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
    : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' };
  return run;
}

export function runningGenerationRun(
  runId = 'run-01', mode: GenerationMode = 'local',
): Record<string | number, unknown> {
  const run = supportedGenerationBase(runId, mode);
  Object.assign(selectedFinding(run), {
    state: 'active',
    generation: { status: 'running', startedAt: generationStartedAt },
  });
  return run;
}

export function proposalGenerationRun(
  runId = 'run-01', mode: GenerationMode = 'local',
): Record<string | number, unknown> {
  const run = supportedGenerationBase(runId, mode);
  const proposal = generationFixture('image-alt').proposal;
  Object.assign(selectedFinding(run), {
    state: 'proposal-pending-review',
    generation: {
      status: 'completed', startedAt: generationStartedAt, finishedAt: generationFinishedAt,
      invocation: generationInvocation(mode),
    },
    result: proposal,
  });
  return run;
}

export function failedGenerationRun(
  error: string = 'missing-prerequisite',
  options: {
    readonly runId?: string;
    readonly mode?: GenerationMode;
    readonly invocation?: ProviderInvocation;
  } = {},
): Record<string | number, unknown> {
  const mode = options.mode ?? 'local';
  const run = supportedGenerationBase(options.runId ?? 'run-01', mode);
  Object.assign(selectedFinding(run), {
    state: 'failed',
    generation: {
      status: 'failed', startedAt: generationStartedAt, finishedAt: generationFinishedAt,
      error,
      ...(options.invocation ? { invocation: options.invocation } : {}),
    },
  });
  return run;
}

export function generationAdapterHarness(options: {
  readonly mode?: GenerationMode;
  readonly candidate?: unknown;
  readonly envelope?: unknown;
  readonly dispatch?: (signal: AbortSignal, attempt: AttemptTransport) => unknown;
  readonly inputTokens?: number;
} = {}): { readonly adapter: GenerationAdapter; readonly calls: { prepare: number; dispatch: number; transport: number } } {
  const mode = options.mode ?? 'local';
  const configuration = generationConfiguration(mode) as GenerationConfiguration;
  const calls = { prepare: 0, dispatch: 0, transport: 0 };
  const envelope = options.envelope ?? Object.freeze({
    ok: true,
    candidate: options.candidate ?? generationFixture('image-alt').proposal,
    complete: true,
    cleanup: 'complete',
  });
  const adapter: GenerationAdapter = Object.freeze({
    configuration,
    prepare(request: GenerationRequest) {
      calls.prepare++;
      return Object.freeze({
        ok: true as const,
        request,
        configuration,
        fit: Object.freeze({
          accounting: configuration.accounting,
          inputTokens: options.inputTokens ?? 4096,
          reservedOutputTokens: 4096 as const,
          contextTokenLimit: configuration.accounting.contextTokenLimit,
          outputTokenLimit: configuration.accounting.outputTokenLimit,
        }),
        dispatch: (signal: AbortSignal, attempt: AttemptTransport) => {
          calls.dispatch++;
          if (options.dispatch) return options.dispatch(signal, attempt);
          return attempt(() => {
            calls.transport++;
            if (signal.aborted) throw new Error('Synthetic adapter observed an aborted transport');
            return envelope;
          });
        },
        cleanup: 'complete' as const,
      });
    },
  });
  return { adapter, calls };
}
