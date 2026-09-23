import { NATIVE_SCHEMA_PROMPT_VERSION, NATIVE_SCHEMA_VERSION, NATIVE_SCHEMA_LOCAL_ADAPTER_VERSION } from './generation-artifacts.ts';
import { UNCERTAINTY_PROMPT_VERSION, JUDGMENT_PROMPT_VERSION, REASONING_PROMPT_VERSION } from './generation-artifacts.ts';
import { createCaseGenerationRequest } from './generation-case-request.ts';
import { nativeSchemaGenerationInstructions, uncertaintyGenerationInstructions, judgmentGenerationInstructions, reasoningGenerationInstructions } from './reasoning-generation-instructions.ts';
import { buildFindingAnalysis } from '../domain/finding-analysis.ts';
import type { EvidencePath, FindingAnalysisDecision } from '../domain/finding-analysis-types.ts';
import { assessFindingEvidence } from '../domain/finding-sufficiency.ts';
import { readFinding } from '../domain/run-contract/finding-validation.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { readChoice, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { parseCorpusCatalog } from '../retrieval/corpus-validation.ts';
import type { CorpusPassage } from '../retrieval/corpus-validation.ts';
import { validateRetrievalResult } from '../retrieval/retrieval-contract.ts';
import { classifyGuidanceSupport } from '../retrieval/support-policy.ts';
import { SOURCE_NOTICES } from '../retrieval/source-notices.ts';
import { GENERATION_DEADLINE_MS, GENERATION_INSTRUCTIONS, GENERATION_SCHEMA, OUTPUT_CONTRACT_VERSION, PROMPT_VERSION, SCHEMA_VERSION } from './generation-artifacts.ts';
import type { GenerationConfiguration, GenerationRequest } from './generation-contract.ts';
import { readGenerationParameters } from './generation-contract.ts';
import { validateGenerationConfiguration } from './generation-fit.ts';

export type GenerationInput = {
  readonly finding: { readonly findingId: string; readonly ruleId: string; readonly nativeResult: 'violation';
    readonly facts: readonly { readonly reference: EvidencePath; readonly value: unknown }[] };
  readonly guidance: { readonly corpusVersion: string; readonly passages: readonly CorpusPassage[];
    readonly notices: { readonly sources: readonly Readonly<Record<string, unknown>>[];
      readonly texts: readonly { readonly kind: 'document' | 'software-document'; readonly text: string }[] } };
};
export type GenerationInputResult =
  | { readonly status: 'failed'; readonly error: 'corpus-integrity' | 'result-validation' }
  | { readonly status: 'abstained'; readonly decision: Extract<FindingAnalysisDecision, { state: 'abstained' }> }
  | { readonly status: 'ready'; readonly input: GenerationInput; readonly decision: Extract<FindingAnalysisDecision, { state: 'active' }> };

export function buildGenerationInput(options: {
  readonly finding: unknown; readonly retrieval: unknown; readonly analysisStartedAt: string; readonly analysisFinishedAt: string;
  readonly manifestBytes: Uint8Array; readonly passageBytes: Uint8Array;
}): GenerationInputResult {
  const catalog = parseCorpusCatalog(options.manifestBytes, options.passageBytes);
  if (!catalog.ok) return Object.freeze({ status: 'failed', error: 'corpus-integrity' });
  try {
    const finding = readFinding(options.finding);
    const evidence = assessFindingEvidence(finding);
    const retrieval = options.retrieval === null ? null : validateRetrievalResult(options.retrieval, finding);
    requireValid(retrieval === null || retrieval.ok);
    requireValid(evidence.state === 'incomplete' || retrieval !== null);
    const support = evidence.state === 'incomplete' ? null
      : classifyGuidanceSupport(finding, retrieval && retrieval.ok ? retrieval.value : null, catalog.value.manifest.unresolvedConflicts);
    requireValid(support === null || support.ok);
    const decision = buildFindingAnalysis(finding, options.analysisStartedAt, options.analysisFinishedAt,
      support && support.ok ? support.value : null);
    if (decision.state === 'abstained') return Object.freeze({ status: 'abstained', decision });
    const facts = Object.freeze(evidence.availableReferences.map(reference => {
      let value: unknown = finding;
      for (const part of reference.split('.')) value = readObject(value)[part];
      return Object.freeze({ reference, value: typeof value === 'string' ? value : readObject(value, ['value']).value });
    }));
    requireValid(retrieval?.ok);
    const selected = new Set(retrieval.value.passages.map(passage => passage.passageId));
    const roles = ['criterion', 'interpretation', 'remediation'];
    const passages = Object.freeze(catalog.value.passages.filter(passage => selected.has(passage.passageId))
      .sort((a, b) => roles.indexOf(a.guidanceRole) - roles.indexOf(b.guidanceRole)));
    requireValid(passages.length === 3);
    const sources: Readonly<Record<string, unknown>>[] = [];
    const seenSources = new Set<string>();
    const noticeKinds = new Set<'document' | 'software-document'>();
    const manifestSources = catalog.value.manifest.sources as readonly Readonly<Record<string, unknown>>[];
    for (const passage of passages) {
      noticeKinds.add(passage.sourceType === 'recommendation' ? 'document' : 'software-document');
      if (seenSources.has(passage.sourceTitle)) continue;
      seenSources.add(passage.sourceTitle);
      const source = manifestSources.find(item => item.title === passage.sourceTitle);
      requireValid(source);
      sources.push(Object.freeze({ title: source.title, type: source.type, url: source.url, status: source.status,
        version: source.version, copyright: source.copyright, attribution: source.attribution }));
    }
    const texts = Object.freeze((['document', 'software-document'] as const).filter(kind => noticeKinds.has(kind))
      .map(kind => Object.freeze({ kind, text: SOURCE_NOTICES[kind] })));
    const input: GenerationInput = Object.freeze({
      finding: Object.freeze({ findingId: finding.findingId, ruleId: finding.ruleId, nativeResult: finding.nativeResult, facts }),
      guidance: Object.freeze({ corpusVersion: catalog.value.identity.version, passages,
        notices: Object.freeze({ sources: Object.freeze(sources), texts }) }),
    });
    return Object.freeze({ status: 'ready', input, decision });
  } catch { return Object.freeze({ status: 'failed', error: 'result-validation' }); }
}

export function createGenerationRequest(input: GenerationInput, providerContext: ProviderContext, configuration: GenerationConfiguration): GenerationRequest {
  requireValid(validateGenerationConfiguration(configuration, providerContext).ok);
  if (configuration.promptVersion === NATIVE_SCHEMA_PROMPT_VERSION || configuration.promptVersion === UNCERTAINTY_PROMPT_VERSION || configuration.promptVersion === REASONING_PROMPT_VERSION || configuration.promptVersion === JUDGMENT_PROMPT_VERSION) {
    return createCaseGenerationRequest([
      { role: 'system', content: (configuration.promptVersion === NATIVE_SCHEMA_PROMPT_VERSION ? nativeSchemaGenerationInstructions
        : configuration.promptVersion === UNCERTAINTY_PROMPT_VERSION ? uncertaintyGenerationInstructions
        : configuration.promptVersion === JUDGMENT_PROMPT_VERSION
        ? judgmentGenerationInstructions : reasoningGenerationInstructions)(input.finding.ruleId) },
      { role: 'user', content: `${JSON.stringify(input, null, 2)}\n` },
    ], { findingId: input.finding.findingId,
      availableEvidenceReferences: input.finding.facts.map(fact => fact.reference),
      passageIds: input.guidance.passages.map(passage => passage.passageId) }, configuration);
  }
  const admitted = readObject(configuration);
  const context = readObject(admitted.providerContext, ['mode', 'provider', 'model']);
  const controls = readGenerationParameters(admitted.parameters, readChoice(context.mode, ['local', 'groq']));
  return Object.freeze({
    messages: Object.freeze([
      Object.freeze({ role: 'system', content: GENERATION_INSTRUCTIONS } as const),
      Object.freeze({ role: 'user', content: `${JSON.stringify(input, null, 2)}\n` } as const),
    ]),
    schema: GENERATION_SCHEMA, promptVersion: PROMPT_VERSION, schemaVersion: SCHEMA_VERSION,
    outputContractVersion: OUTPUT_CONTRACT_VERSION, controls,
    deadlineMs: GENERATION_DEADLINE_MS, configuration,
  });
}
