import { NATIVE_SCHEMA_PROMPT_VERSION, NATIVE_SCHEMA_VERSION, NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION } from './generation-artifacts.ts';
import { UNCERTAINTY_PROMPT_VERSION, UNCERTAINTY_SCHEMA_VERSION, UNCERTAINTY_LOCAL_ADAPTER_VERSION, UNCERTAINTY_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import { JUDGMENT_PROMPT_VERSION, JUDGMENT_SCHEMA_VERSION, JUDGMENT_LOCAL_ADAPTER_VERSION, JUDGMENT_GROQ_ADAPTER_VERSION } from './generation-artifacts.ts';
import type { FindingAnalysisDecision } from '../domain/finding-analysis-types.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { readChoice, readObject, readPattern, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { REASONING_PROMPT_VERSION, REASONING_LOCAL_PARAMETERS, REASONING_LOCAL_ADAPTER_VERSION, REASONING_GROQ_ADAPTER_VERSION, CASE_SCHEMA_VERSION, PROMPT_CASE_VERSION, GROQ_PARAMETERS, LOCAL_PARAMETERS, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import type { Proposal } from './proposal-contract.ts';

export type GenerationErrorCode = 'input-integrity' | 'configuration' | 'missing-prerequisite' | 'input-fit'
  | 'authentication' | 'quota' | 'rate-limit' | 'network' | 'provider' | 'timeout' | 'shutdown' | 'response-validation';
export type GenerationParameters = typeof LOCAL_PARAMETERS | typeof REASONING_LOCAL_PARAMETERS | typeof GROQ_PARAMETERS;
export type GenerationTokenAccounting = {
  readonly method: 'exact-tokenizer' | 'verified-upper-bound'; readonly implementationVersion: string;
  readonly tokenizerIdentity: string | null; readonly contextTokenLimit: number; readonly outputTokenLimit: number;
};
export type GenerationByteAccounting = {
  readonly method: 'serialized-byte-budget'; readonly implementationVersion: 'm304-groq-request-bytes-v1';
  readonly tokenizerIdentity: null; readonly maxRequestBytes: 65536;
  readonly contextTokenLimit: 131072; readonly outputTokenLimit: 65536;
};
export type GenerationInitialPromptAccounting = {
  readonly method: 'initial-prompt-upper-bound';
  readonly implementationVersion: 'm602-qwen35-initial-prompt-bound-v1';
  readonly tokenizerIdentity: null; readonly contextTokenLimit: 32768;
  readonly perCompletionOutputTokenLimit: 12288; readonly maximumNativeCompletions: 2;
  readonly maximumAggregateGeneratedTokens: 24576;
};
export type GenerationAccounting = GenerationInitialPromptAccounting | GenerationTokenAccounting | GenerationByteAccounting;
export type GenerationBinding = {
  readonly kind: 'local'; readonly runtimeVersion: string; readonly modelDigest: string;
  readonly tokenizerIdentity: string; readonly templateIdentity: string; readonly parserIdentity: string;
  readonly effectiveConfigurationIdentity: string;
} | { readonly kind: 'groq'; readonly exposedDefaultsIdentity: string; readonly serverRevision: string | null };
export type GenerationConfiguration = {
  readonly providerContext: ProviderContext; readonly adapterId: 'ollama-generation' | 'groq-generation';
  readonly adapterVersion: string; readonly endpoint: 'ollama-loopback-chat' | 'groq-chat-completions';
  readonly promptVersion: typeof PROMPT_VERSION | typeof PROMPT_CASE_VERSION | typeof REASONING_PROMPT_VERSION | typeof JUDGMENT_PROMPT_VERSION | typeof UNCERTAINTY_PROMPT_VERSION | typeof NATIVE_SCHEMA_PROMPT_VERSION; readonly schemaVersion: typeof SCHEMA_VERSION | typeof CASE_SCHEMA_VERSION | typeof JUDGMENT_SCHEMA_VERSION | typeof UNCERTAINTY_SCHEMA_VERSION | typeof NATIVE_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
  readonly parameters: GenerationParameters; readonly binding: GenerationBinding; readonly accounting: GenerationAccounting;
};
export type GenerationRequest = {
  readonly messages: readonly { readonly role: 'system' | 'user'; readonly content: string }[];
  readonly schema: Readonly<Record<string, unknown>>;
  readonly promptVersion: typeof PROMPT_VERSION | typeof PROMPT_CASE_VERSION | typeof REASONING_PROMPT_VERSION | typeof JUDGMENT_PROMPT_VERSION | typeof UNCERTAINTY_PROMPT_VERSION | typeof NATIVE_SCHEMA_PROMPT_VERSION; readonly schemaVersion: typeof SCHEMA_VERSION | typeof CASE_SCHEMA_VERSION | typeof JUDGMENT_SCHEMA_VERSION | typeof UNCERTAINTY_SCHEMA_VERSION | typeof NATIVE_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
  readonly controls: GenerationParameters; readonly deadlineMs: 120000 | 300000; readonly configuration: GenerationConfiguration;
};
export type GenerationTokenFit = {
  readonly accounting: GenerationTokenAccounting; readonly inputTokens: number; readonly reservedOutputTokens: 4096 | 12288;
  readonly contextTokenLimit: number; readonly outputTokenLimit: number;
};
export type GenerationByteFit = {
  readonly accounting: GenerationByteAccounting; readonly serializedRequestBytes: number; readonly requestedOutputTokens: 4096;
  readonly contextTokenLimit: 131072; readonly outputTokenLimit: 65536;
};
export type GenerationInitialPromptFit = {
  readonly accounting: GenerationInitialPromptAccounting; readonly initialInputTokens: number;
  readonly firstCompletionReservedTokens: 12288; readonly contextTokenLimit: 32768;
  readonly perCompletionOutputTokenLimit: 12288; readonly maximumNativeCompletions: 2;
  readonly maximumAggregateGeneratedTokens: 24576;
};
export type GenerationFit = GenerationInitialPromptFit | GenerationTokenFit | GenerationByteFit;
export type AttemptTransport = <T>(start: () => T) => T;
export type PreparedGeneration = {
  readonly ok: true; readonly request: GenerationRequest; readonly configuration: GenerationConfiguration;
  readonly fit: GenerationFit; readonly dispatch: (signal: AbortSignal, attemptTransport: AttemptTransport) => unknown;
  readonly cleanup: 'complete';
} | { readonly ok: false; readonly error: 'configuration' | 'missing-prerequisite' | 'input-fit'; readonly cleanup: 'complete' | 'uncertain' };
export type GenerationAdapter = {
  readonly configuration: GenerationConfiguration;
  readonly prepare: (request: GenerationRequest, signal: AbortSignal, expiresAt?: number) => unknown;
};
export type InvocationOutcome = 'response' | 'authentication' | 'quota' | 'rate-limit' | 'network' | 'provider' | 'timeout' | 'shutdown';
type InvocationVersions = {
  readonly promptVersion: typeof NATIVE_SCHEMA_PROMPT_VERSION; readonly schemaVersion: typeof NATIVE_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
} | {
  readonly promptVersion: typeof UNCERTAINTY_PROMPT_VERSION; readonly schemaVersion: typeof UNCERTAINTY_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
} | {
  readonly promptVersion: typeof JUDGMENT_PROMPT_VERSION; readonly schemaVersion: typeof JUDGMENT_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
} | {
  readonly promptVersion: 'm302-instructions-v1'; readonly schemaVersion: 'm302-schema-v1';
  readonly outputContractVersion: 'm301-proposal-v1';
} | {
  readonly promptVersion: typeof PROMPT_VERSION; readonly schemaVersion: typeof SCHEMA_VERSION | typeof CASE_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
} | {
  readonly promptVersion: typeof PROMPT_CASE_VERSION | typeof REASONING_PROMPT_VERSION; readonly schemaVersion: typeof CASE_SCHEMA_VERSION;
  readonly outputContractVersion: typeof OUTPUT_CONTRACT_VERSION;
};
export type ProviderInvocation = {
  readonly adapterId: 'ollama-generation' | 'groq-generation'; readonly adapterVersion: string;
  readonly endpointIdentity: 'ollama-loopback-chat' | 'groq-chat-completions';
  readonly parameters: GenerationParameters;
  readonly outcome: InvocationOutcome; readonly validation: 'passed' | 'failed' | 'not-run';
} & InvocationVersions;
export type GenerationOutcome =
  | { readonly status: 'proposal'; readonly proposal: Proposal; readonly invocation: ProviderInvocation; readonly cleanupFailed: false }
  | { readonly status: 'abstained'; readonly decision: Extract<FindingAnalysisDecision, { state: 'abstained' }>; readonly cleanupFailed: false }
  | { readonly status: 'failed'; readonly error: GenerationErrorCode; readonly invocation?: ProviderInvocation; readonly cleanupFailed: boolean };

export function readGenerationIdentity(value: unknown): string {
  return readPattern(value, /^[A-Za-z0-9][A-Za-z0-9._:+/@-]{0,127}$/);
}

export function readGenerationParameters(input: unknown, mode: ProviderContext['mode'], reasoning = false): GenerationParameters {
  const expected = mode === 'local' ? reasoning ? REASONING_LOCAL_PARAMETERS : LOCAL_PARAMETERS : GROQ_PARAMETERS;
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
  const native = root.promptVersion === NATIVE_SCHEMA_PROMPT_VERSION;
  requireValid(native === (root.adapterVersion === NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION));
  if (native) requireValid(local);
  const uncertainty = root.promptVersion === UNCERTAINTY_PROMPT_VERSION;
  requireValid(uncertainty === (root.adapterVersion === UNCERTAINTY_LOCAL_ADAPTER_VERSION || root.adapterVersion === UNCERTAINTY_GROQ_ADAPTER_VERSION));
  if (uncertainty) requireValid(root.adapterVersion === (local ? UNCERTAINTY_LOCAL_ADAPTER_VERSION : UNCERTAINTY_GROQ_ADAPTER_VERSION));
  const judgment = root.promptVersion === JUDGMENT_PROMPT_VERSION;
  requireValid(judgment === (root.adapterVersion === JUDGMENT_LOCAL_ADAPTER_VERSION || root.adapterVersion === JUDGMENT_GROQ_ADAPTER_VERSION));
  if (judgment) requireValid(root.adapterVersion === (local ? JUDGMENT_LOCAL_ADAPTER_VERSION : JUDGMENT_GROQ_ADAPTER_VERSION));
  const reasoning = root.promptVersion === REASONING_PROMPT_VERSION;
  const reasoningAdapter = local ? REASONING_LOCAL_ADAPTER_VERSION : REASONING_GROQ_ADAPTER_VERSION;
  requireValid(reasoning === (root.adapterVersion === REASONING_LOCAL_ADAPTER_VERSION
    || root.adapterVersion === REASONING_GROQ_ADAPTER_VERSION));
  requireValid(reasoning === (root.adapterVersion === reasoningAdapter));
  requireValid((native && root.schemaVersion === NATIVE_SCHEMA_VERSION && root.outputContractVersion === OUTPUT_CONTRACT_VERSION)
    || (uncertainty && root.schemaVersion === UNCERTAINTY_SCHEMA_VERSION && root.outputContractVersion === OUTPUT_CONTRACT_VERSION)
    || (judgment && root.schemaVersion === JUDGMENT_SCHEMA_VERSION && root.outputContractVersion === OUTPUT_CONTRACT_VERSION)
    || (reasoning && root.schemaVersion === CASE_SCHEMA_VERSION && root.outputContractVersion === OUTPUT_CONTRACT_VERSION)
    || (root.promptVersion === PROMPT_VERSION && (root.schemaVersion === SCHEMA_VERSION || root.schemaVersion === CASE_SCHEMA_VERSION)
    && root.outputContractVersion === OUTPUT_CONTRACT_VERSION)
    || (root.promptVersion === PROMPT_CASE_VERSION && root.schemaVersion === CASE_SCHEMA_VERSION
      && root.outputContractVersion === OUTPUT_CONTRACT_VERSION)
    || (root.promptVersion === 'm302-instructions-v1' && root.schemaVersion === 'm302-schema-v1'
      && root.outputContractVersion === 'm301-proposal-v1'));
  const versions: InvocationVersions = native
    ? { promptVersion: NATIVE_SCHEMA_PROMPT_VERSION, schemaVersion: NATIVE_SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION }
    : uncertainty
    ? { promptVersion: UNCERTAINTY_PROMPT_VERSION, schemaVersion: UNCERTAINTY_SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION }
    : judgment
    ? { promptVersion: JUDGMENT_PROMPT_VERSION, schemaVersion: JUDGMENT_SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION }
    : reasoning
    ? { promptVersion: REASONING_PROMPT_VERSION, schemaVersion: CASE_SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION }
    : root.promptVersion === PROMPT_CASE_VERSION
    ? { promptVersion: PROMPT_CASE_VERSION, schemaVersion: CASE_SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION }
    : root.promptVersion === PROMPT_VERSION
    ? { promptVersion: PROMPT_VERSION,
      schemaVersion: root.schemaVersion === CASE_SCHEMA_VERSION ? CASE_SCHEMA_VERSION : SCHEMA_VERSION,
      outputContractVersion: OUTPUT_CONTRACT_VERSION }
    : { promptVersion: 'm302-instructions-v1', schemaVersion: 'm302-schema-v1',
      outputContractVersion: 'm301-proposal-v1' };
  const outcome = readChoice(root.outcome, ['response', 'authentication', 'quota', 'rate-limit', 'network', 'provider', 'timeout', 'shutdown']);
  const validation = readChoice(root.validation, ['passed', 'failed', 'not-run']);
  requireValid(outcome === 'response' ? validation !== 'not-run' : validation === 'not-run');
  return Object.freeze({ adapterId, adapterVersion: readGenerationIdentity(root.adapterVersion),
    endpointIdentity: local ? 'ollama-loopback-chat' : 'groq-chat-completions',
    ...versions,
    parameters: readGenerationParameters(root.parameters, local ? 'local' : 'groq', reasoning || judgment || uncertainty || native), outcome, validation });
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
