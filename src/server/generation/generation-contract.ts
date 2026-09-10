import type { FindingAnalysisDecision } from '../domain/finding-analysis-types.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { readChoice, readObject, readPattern, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { GROQ_PARAMETERS, LOCAL_PARAMETERS, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import type { Proposal } from './proposal-contract.ts';

export type GenerationErrorCode = 'input-integrity' | 'configuration' | 'missing-prerequisite' | 'input-fit'
  | 'authentication' | 'quota' | 'rate-limit' | 'network' | 'provider' | 'timeout' | 'shutdown' | 'response-validation';
export type GenerationParameters = typeof LOCAL_PARAMETERS | typeof GROQ_PARAMETERS;
export type GenerationAccounting = {
  readonly method: 'exact-tokenizer' | 'verified-upper-bound'; readonly implementationVersion: string;
  readonly tokenizerIdentity: string | null; readonly contextTokenLimit: number; readonly outputTokenLimit: number;
};
export type GenerationBinding = {
  readonly kind: 'local'; readonly runtimeVersion: string; readonly modelDigest: string;
  readonly tokenizerIdentity: string; readonly templateIdentity: string; readonly parserIdentity: string;
  readonly effectiveConfigurationIdentity: string;
} | { readonly kind: 'groq'; readonly exposedDefaultsIdentity: string; readonly serverRevision: string | null };
export type GenerationConfiguration = {
  readonly providerContext: ProviderContext; readonly adapterId: 'ollama-generation' | 'groq-generation';
  readonly adapterVersion: string; readonly endpoint: 'ollama-loopback-chat' | 'groq-chat-completions';
  readonly promptVersion: typeof PROMPT_VERSION; readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
  readonly parameters: GenerationParameters; readonly binding: GenerationBinding; readonly accounting: GenerationAccounting;
};
export type GenerationRequest = {
  readonly messages: readonly { readonly role: 'system' | 'user'; readonly content: string }[];
  readonly schema: Readonly<Record<string, unknown>>;
  readonly promptVersion: typeof PROMPT_VERSION; readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
  readonly controls: GenerationParameters; readonly deadlineMs: 120000; readonly configuration: GenerationConfiguration;
};
export type GenerationFit = {
  readonly accounting: GenerationAccounting; readonly inputTokens: number; readonly reservedOutputTokens: 4096;
  readonly contextTokenLimit: number; readonly outputTokenLimit: number;
};
export type AttemptTransport = <T>(start: () => T) => T;
export type PreparedGeneration = {
  readonly ok: true; readonly request: GenerationRequest; readonly configuration: GenerationConfiguration;
  readonly fit: GenerationFit; readonly dispatch: (signal: AbortSignal, attemptTransport: AttemptTransport) => unknown;
  readonly cleanup: 'complete';
} | { readonly ok: false; readonly error: 'configuration' | 'missing-prerequisite' | 'input-fit'; readonly cleanup: 'complete' | 'uncertain' };
export type GenerationAdapter = {
  readonly configuration: GenerationConfiguration;
  readonly prepare: (request: GenerationRequest, signal: AbortSignal) => unknown;
};
export type InvocationOutcome = 'response' | 'authentication' | 'quota' | 'rate-limit' | 'network' | 'provider' | 'timeout' | 'shutdown';
export type ProviderInvocation = {
  readonly adapterId: 'ollama-generation' | 'groq-generation'; readonly adapterVersion: string;
  readonly endpointIdentity: 'ollama-loopback-chat' | 'groq-chat-completions';
  readonly promptVersion: typeof PROMPT_VERSION; readonly schemaVersion: typeof SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION; readonly parameters: GenerationParameters;
  readonly outcome: InvocationOutcome; readonly validation: 'passed' | 'failed' | 'not-run';
};
export type GenerationOutcome =
  | { readonly status: 'proposal'; readonly proposal: Proposal; readonly invocation: ProviderInvocation; readonly cleanupFailed: false }
  | { readonly status: 'abstained'; readonly decision: Extract<FindingAnalysisDecision, { state: 'abstained' }>; readonly cleanupFailed: false }
  | { readonly status: 'failed'; readonly error: GenerationErrorCode; readonly invocation?: ProviderInvocation; readonly cleanupFailed: boolean };

export function readGenerationIdentity(value: unknown): string {
  return readPattern(value, /^[A-Za-z0-9][A-Za-z0-9._:+/@-]{0,127}$/);
}

export function readGenerationParameters(input: unknown, mode: ProviderContext['mode']): GenerationParameters {
  const expected = mode === 'local' ? LOCAL_PARAMETERS : GROQ_PARAMETERS;
  const actual = readObject(input, Object.keys(expected));
  for (const [key, value] of Object.entries(expected)) requireValid(Object.is(actual[key], value));
  return expected;
}

export function readProviderInvocation(input: unknown): ProviderInvocation {
  const root = readObject(input, ['adapterId', 'adapterVersion', 'endpointIdentity', 'promptVersion', 'schemaVersion',
    'outputContractVersion', 'parameters', 'outcome', 'validation']);
  const adapterId = readChoice(root.adapterId, ['ollama-generation', 'groq-generation']);
  const local = adapterId === 'ollama-generation';
  requireValid(root.endpointIdentity === (local ? 'ollama-loopback-chat' : 'groq-chat-completions'));
  requireValid(root.promptVersion === PROMPT_VERSION && root.schemaVersion === SCHEMA_VERSION
    && root.outputContractVersion === OUTPUT_CONTRACT_VERSION);
  const outcome = readChoice(root.outcome, ['response', 'authentication', 'quota', 'rate-limit', 'network', 'provider', 'timeout', 'shutdown']);
  const validation = readChoice(root.validation, ['passed', 'failed', 'not-run']);
  requireValid(outcome === 'response' ? validation !== 'not-run' : validation === 'not-run');
  return Object.freeze({ adapterId, adapterVersion: readGenerationIdentity(root.adapterVersion),
    endpointIdentity: local ? 'ollama-loopback-chat' : 'groq-chat-completions',
    promptVersion: PROMPT_VERSION, schemaVersion: SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION,
    parameters: readGenerationParameters(root.parameters, local ? 'local' : 'groq'), outcome, validation });
}

export function invocationMatchesProvider(invocation: ProviderInvocation, providerContext: ProviderContext): boolean {
  try {
    const value = readProviderInvocation(invocation);
    const context = readObject(providerContext, ['mode', 'provider', 'model']);
    return value.adapterId === 'ollama-generation'
      ? context.mode === 'local' && context.provider === 'ollama' && context.model === 'qwen3.5:4b'
      : context.mode === 'groq' && context.provider === 'groq' && context.model === 'openai/gpt-oss-20b';
  } catch { return false; }
}
