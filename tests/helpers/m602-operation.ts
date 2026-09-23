import { REASONING_QWEN_CONFIGURATION, REASONING_GROQ_CONFIGURATION } from '../../src/server/generation/reasoning-generation-configuration.ts';
import { CASE_QWEN_CONFIGURATION, CASE_GROQ_CONFIGURATION, PROMPT_CASE_QWEN_CONFIGURATION, PROMPT_CASE_GROQ_CONFIGURATION } from '../../src/server/generation/generation-case-request.ts';
import { promptCampaign, promptVersion, loadPromptManifest, promptBuild,
  validatePromptQualification, validatePromptObservation, validatePromptProjection, promptObservationQualified,
  type M602PromptResult, type M602PromptAssessment, type M602PromptObservation,
  type M602PromptQualification } from './m602-successor-evidence.ts';
import { reasoningCampaign, reasoningVersion, loadReasoningManifest, reasoningBuild,
  validateReasoningQualification, validateReasoningObservation, validateReasoningProjection, reasoningObservationQualified,
  type M602ReasoningResult, type M602ReasoningAssessment, type M602ReasoningObservation,
  type M602ReasoningQualification } from './m602-successor-evidence.ts';
import { repairedCampaign, repairedVersion, loadRepairedManifest, repairedBuild,
  validateRepairedQualification, validateRepairedObservation, validateRepairedProjection, repairedObservationQualified,
  type M602RepairedResult, type M602RepairedAssessment, type M602RepairedObservation,
  type M602RepairedQualification } from './m602-successor-evidence.ts';
import { instrumentedCampaign, instrumentedVersion, loadInstrumentedManifest, instrumentedBuild,
  validateInstrumentedQualification, validateInstrumentedObservation, validateInstrumentedProjection, instrumentedObservationQualified,
  type ObservedCampaign, type M602InstrumentedResult, type M602InstrumentedAssessment, type M602InstrumentedObservation,
  type M602InstrumentedQualification } from './m602-successor-evidence.ts';
import { createM602InstrumentedDiagnosticCollector, reconcileInstrumentedDetails, validateInstrumentedDetails } from './m602-instrumented-diagnostics.ts';
import type { CandidateDetailSink } from '../../src/server/generation/generation-diagnostics.ts';
import { completionCampaign, completionVersion, loadCompletionManifest, validateCompletionQualification,
  validateCompletionObservation, validateCompletionProjection, completionObservationQualified,
  type M602CompletionResult, type M602CompletionAssessment, type M602CompletionObservation,
  type M602CompletionQualification } from './m602-successor-evidence.ts';
import { prepareM602SuccessorObservers, completeSuccessorIO, isolatedSuccessorRoot, type M602SuccessorObserverIO, type M602SuccessorObserverSession } from './m602-successor-observers.ts';
import { successorCampaign, successorVersion, noSuccessorResources, loadSuccessorManifest, successorBuild,
  validateSuccessorQualification, validateSuccessorObservation, validateSuccessorProjection, successorObservationQualified,
  type M602SuccessorResult, type M602SuccessorAssessment, type M602SuccessorObservation, type M602SuccessorQualification,
  type M602SuccessorCleanup, type M602SuccessorFailure } from './m602-successor-evidence.ts';
import { emitGenerationRejection, readGenerationRejection, type GenerationRejectionCode, type GenerationRejectionSink } from '../../src/server/generation/generation-diagnostics.ts';
import { createM602Observation, type M602Observers, type M602ObservationSlot } from './m602-observation.ts';
import { hash, ordinary, publish, record, type EvidenceFilesystem } from './m602-evidence-files.ts';
import assert from 'node:assert/strict';
import { types } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import type { ClientRequest } from 'node:http';
import { executeGenerationOperation } from '../../src/server/generation/generation-execution.ts';
import type { GenerationObservation } from '../../src/server/generation/generation-execution.ts';
import { readProviderInvocation } from '../../src/server/generation/generation-contract.ts';
import type { GenerationErrorCode } from '../../src/server/generation/generation-contract.ts';
import type { Proposal } from '../../src/server/generation/proposal-contract.ts';
import { createReasoningOllamaGenerationAdapter, createPromptCaseOllamaGenerationAdapter, createCaseOllamaGenerationAdapter, createOllamaGenerationAdapter } from '../../src/server/generation/ollama-generation.ts';
import { createReasoningGroqGenerationAdapter, createPromptCaseGroqGenerationAdapter, createCaseGroqGenerationAdapter, createGroqGenerationAdapter } from '../../src/server/generation/groq-generation.ts';
import type { GroqCredentialIO } from '../../src/server/generation/groq-credential.ts';
import type { OllamaNativeRequest } from '../../src/server/generation/ollama-generation-http.ts';
import { QWEN_CONFIGURATION } from '../../src/server/generation/ollama-generation-model.ts';
import { GROQ_CONFIGURATION } from '../../src/server/generation/groq-generation-configuration.ts';
import { loadM602Package, loadM602RepairedPackage, loadM602PromptPackage, loadM602ReasoningPackage } from './m602-package.ts';
import type { M602CaseLabel, M602Package, M602PackageEnvironment } from './m602-package.ts';

export type M602OperationDependencies = {
  readonly root?: string; readonly packageEnvironment?: M602PackageEnvironment;
  readonly requestImplementation?: OllamaNativeRequest; readonly credentialIO?: GroqCredentialIO;
  readonly signal?: AbortSignal; readonly filesystem?: Partial<EvidenceFilesystem>;
  readonly followup?: { readonly reportRoot: string; readonly observers?: M602Observers };
};
type EvidenceVersion = 'm602-evidence-v1' | 'm602-successor-evidence-v1' | 'm602-completion-evidence-v1' | 'm602-instrumented-evidence-v1' | 'm602-repaired-evidence-v1' | 'm602-prompt-evidence-v1' | 'm602-reasoning-evidence-v1';
type CommonResult = Omit<M602Result, 'version'> & { readonly version: EvidenceVersion };
type CommonEntered = Omit<Entered, 'version'> & { readonly version: EvidenceVersion };
type CommonDispatch = Omit<Dispatch, 'version'> & { readonly version: EvidenceVersion };
export type M602SuccessorDependencies = Omit<M602OperationDependencies, 'followup'> & {
  readonly successorManifestEnvironment?: M602PackageEnvironment; readonly observerIO?: M602SuccessorObserverIO;
};
export type M602CompletionDependencies = Omit<M602SuccessorDependencies, 'successorManifestEnvironment'> & {
  readonly completionManifestEnvironment?: M602PackageEnvironment;
};
export type M602InstrumentedDependencies = Omit<M602SuccessorDependencies, 'successorManifestEnvironment'> & {
  readonly instrumentedManifestEnvironment?: M602PackageEnvironment;
};
export type M602RepairedDependencies = Omit<M602SuccessorDependencies, 'successorManifestEnvironment'> & {
  readonly repairedManifestEnvironment?: M602PackageEnvironment;
};
export type M602PromptDependencies = Omit<M602SuccessorDependencies, 'successorManifestEnvironment'> & {
  readonly promptManifestEnvironment?: M602PackageEnvironment;
};
export type M602ReasoningDependencies = Omit<M602SuccessorDependencies, 'successorManifestEnvironment'> & {
  readonly reasoningManifestEnvironment?: M602PackageEnvironment;
};
type ObservedDependencies = M602SuccessorDependencies & M602CompletionDependencies & M602InstrumentedDependencies & M602RepairedDependencies & M602PromptDependencies & M602ReasoningDependencies;
type ObservedResult = M602SuccessorResult | M602CompletionResult | M602InstrumentedResult | M602RepairedResult | M602PromptResult | M602ReasoningResult;
type ObservedAssessment = M602SuccessorAssessment | M602CompletionAssessment | M602InstrumentedAssessment | M602RepairedAssessment | M602PromptAssessment | M602ReasoningAssessment;
type ObservedObservation = M602SuccessorObservation | M602CompletionObservation | M602InstrumentedObservation | M602RepairedObservation | M602PromptObservation | M602ReasoningObservation;
type ObservedQualification = M602SuccessorQualification | M602CompletionQualification | M602InstrumentedQualification | M602RepairedQualification | M602PromptQualification | M602ReasoningQualification;
type RecordIdentity = { readonly version: 'm602-evidence-v1'; readonly caseLabel: M602CaseLabel };
type Wire = { readonly sha256: string; readonly bytes: number };
type ChatWindow = { readonly startedAt: string; readonly finishedAt: string };
export type M602Result = RecordIdentity & {
  readonly enteredSha256: string; readonly dispatchSha256: string | null; readonly finishedAt: string;
  readonly status: 'proposal' | 'abstained' | 'failed'; readonly error: GenerationErrorCode | null;
  readonly attempted: boolean; readonly cleanupFailed: boolean; readonly observation: GenerationObservation | null;
  readonly wire: Wire | null; readonly requests: { readonly version: number; readonly show: number; readonly tags: number; readonly chat: number };
  readonly chatWindow: ChatWindow | null; readonly proposal: Proposal | null;
};
type ObservationValue = 'pass' | 'fail' | 'not-run';
type GpuObservation = { readonly observedAt: string; readonly usedMiB: number; readonly freeMiB: number };
export type M602Assessment = RecordIdentity & {
  readonly resultSha256: string; readonly evaluator: 'primary'; readonly assessedAt: string;
  readonly dimensions: readonly { readonly observation: string; readonly value: ObservationValue }[];
  readonly uncertainty: ObservationValue; readonly accepted: boolean;
  readonly localObservation: {
    readonly ui: ChatWindow & { readonly responsive: boolean };
    readonly runtime: { readonly observedAt: string; readonly digest: string; readonly contextLength: number;
      readonly sizeBytes: number; readonly sizeVramBytes: number };
    readonly gpuBefore: GpuObservation; readonly gpuDuring: GpuObservation; readonly oomObserved: boolean;
  } | null;
};
type Entered = RecordIdentity & { readonly enteredAt: string; readonly manifestSha256: string; readonly mode: 'local' | 'groq';
  readonly configurationSha256: string; readonly codeSha256: string };
type Dispatch = RecordIdentity & { readonly enteredSha256: string; readonly markedAt: string;
  readonly meaning: 'dispatch-may-have-started' };
const repository = path.resolve(import.meta.dirname, '../..');
const defaultRoot = path.join(repository, 'temp/m602-generation-evidence');
const manifestDigest = '63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b';
const labels: readonly M602CaseLabel[] = ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'];
const errors: readonly GenerationErrorCode[] = ['input-integrity', 'configuration', 'missing-prerequisite', 'input-fit',
  'authentication', 'quota', 'rate-limit', 'network', 'provider', 'timeout', 'shutdown', 'response-validation'];
const dimensions = ['scanner provenance', 'evidence completeness', 'actual retrieval relevance',
  'controlled support and citations', 'structural validity', 'semantic groundedness', 'remediation usefulness',
  'human judgment and reminder', 'prohibited claims', 'provider completion'];
const values = ['pass', 'fail', 'not-run'];
const timestamp = () => new Date().toISOString();
type RecordValue = Record<string, any>;

function closed(value: unknown, keys: readonly string[]): asserts value is RecordValue {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort());
}
function digest(value: unknown): asserts value is string { assert.ok(typeof value === 'string' && /^[0-9a-f]{64}$/u.test(value)); }
function instant(value: unknown): number {
  assert.equal(typeof value, 'string');
  const time = Date.parse(value as string);
  assert.ok(Number.isFinite(time) && new Date(time).toISOString() === value);
  return time;
}
function natural(value: unknown): asserts value is number { assert.ok(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0); }
function boolean(value: unknown): asserts value is boolean { assert.equal(typeof value, 'boolean'); }
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
function identity(value: RecordValue, label: M602CaseLabel, version: EvidenceVersion = 'm602-evidence-v1') {
  assert.equal(value.version, version);
  assert.equal(value.caseLabel, label);
}
function context(label: M602CaseLabel, dependencies: M602OperationDependencies | undefined, execute: boolean) {
  assert.ok(labels.includes(label));
  if (dependencies !== undefined) {
    assert.ok(dependencies.root && dependencies.packageEnvironment);
    digest(dependencies.packageEnvironment.manifestSha256);
    assert.equal(typeof dependencies.packageEnvironment.readBytes, 'function');
    if (execute) {
      assert.equal(typeof dependencies.requestImplementation, 'function');
      if (label.startsWith('groq-')) assert.ok(dependencies.credentialIO);
    }
    const root = path.resolve(dependencies.root);
    assert.equal(path.dirname(root).toLowerCase(), path.join(repository, 'temp').toLowerCase());
    assert.match(path.basename(root), /^m602-test-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u);
  }
  const root = dependencies === undefined ? defaultRoot : path.resolve(dependencies.root!);
  const filesystem: EvidenceFilesystem = { mkdirSync: fs.mkdirSync, openSync: fs.openSync, writeSync: fs.writeSync,
    fsyncSync: fs.fsyncSync, closeSync: fs.closeSync, lstatSync: fs.lstatSync, realpathSync: fs.realpathSync,
    readFileSync: fs.readFileSync, readdirSync: fs.readdirSync, ...dependencies?.filesystem };
  ordinary(root, filesystem, false);
  const reportRoot = dependencies === undefined ? path.join(repository, 'temp/m602-followup-evidence-v1')
    : dependencies.followup === undefined ? undefined : path.resolve(dependencies.followup.reportRoot);
  if (dependencies?.followup) assert.equal(reportRoot, path.join(root, 'followup-evidence'));
  return { root, filesystem, reportRoot, configuration: label.startsWith('local-') ? QWEN_CONFIGURATION : GROQ_CONFIGURATION };
}
function codeHash(version: EvidenceVersion = 'm602-evidence-v1', filesystem: EvidenceFilesystem = fs): string {
  const paths: string[] = [];
  const visit = (relative: string) => {
    const absolute = path.join(repository, relative);
    ordinary(absolute, fs, false);
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const child = `${relative}/${entry.name}`;
      assert.equal(entry.isSymbolicLink(), false);
      if (entry.isDirectory()) visit(child);
      else if (entry.name.endsWith('.ts')) { ordinary(path.join(repository, child), fs, true); paths.push(child); }
    }
  };
  visit('src');
  paths.push('tests/helpers/m602-package.ts', 'tests/helpers/m602-operation.ts', 'tests/helpers/m602-run-case.ts',
    'tests/helpers/m602-observation.ts', 'tests/helpers/m602-historical-evidence.ts', 'tests/helpers/m602-evidence-files.ts',
    'package.json', 'package-lock.json', 'tsconfig.json');
  if (version !== 'm602-evidence-v1') paths.push('tests/helpers/m602-successor-observers.ts', 'tests/helpers/m602-successor-evidence.ts',
    version === reasoningVersion ? 'evaluation/m602-reasoning-v1.json' : version === promptVersion ? 'evaluation/m602-prompt-v1.json' : version === repairedVersion ? 'evaluation/m602-repaired-v1.json' : version === instrumentedVersion ? 'evaluation/m602-instrumented-v1.json' : version === completionVersion ? 'evaluation/m602-completion-v1.json' : 'evaluation/m602-successor-v1.json');
  if (version === instrumentedVersion || version === repairedVersion || version === promptVersion || version === reasoningVersion) paths.push('tests/helpers/m602-instrumented-diagnostics.ts');
  if (version === promptVersion) paths.push('evaluation/m602-grounded-instructions-v1.txt');
  return hash(JSON.stringify(paths.sort().map(relative => {
    ordinary(path.join(repository, relative), fs, true);
    return { path: relative, sha256: hash(filesystem.readFileSync(path.join(repository, relative))) };
  })));
}
function validateAssessment(value: unknown, label: M602CaseLabel, result: CommonResult, resultSha256: string, entered: CommonEntered, version: EvidenceVersion = 'm602-evidence-v1'): M602Assessment | ObservedAssessment {
  closed(value, ['version', 'caseLabel', 'resultSha256', 'evaluator', 'assessedAt', 'dimensions', 'uncertainty', 'localObservation', 'accepted', ...(version !== 'm602-evidence-v1' ? ['observationSha256'] : [])]);
  identity(value, label, version);
  if (version !== 'm602-evidence-v1') digest(value.observationSha256);
  assert.equal(value.resultSha256, resultSha256);
  assert.equal(value.evaluator, 'primary');
  assert.ok(instant(value.assessedAt) >= instant(result.finishedAt));
  assert.ok(Array.isArray(value.dimensions) && value.dimensions.length === dimensions.length);
  for (const [index, dimension] of value.dimensions.entries()) {
    closed(dimension, ['observation', 'value']);
    assert.equal(dimension.observation, dimensions[index]);
    assert.ok(values.includes(dimension.value));
  }
  assert.ok(values.includes(value.uncertainty));
  boolean(value.accepted);
  let localPassed = true;
  if (label.startsWith('groq-')) assert.equal(value.localObservation, null);
  else if (value.localObservation === null) localPassed = false;
  else {
    const local = value.localObservation;
    closed(local, ['ui', 'runtime', 'gpuBefore', 'gpuDuring', 'oomObserved']);
    closed(local.ui, ['startedAt', 'finishedAt', 'responsive']);
    closed(local.runtime, ['observedAt', 'digest', 'contextLength', 'sizeBytes', 'sizeVramBytes']);
    assert.ok(result.chatWindow);
    const start = instant(result.chatWindow.startedAt), end = instant(result.chatWindow.finishedAt);
    const within = (time: unknown) => { const moment = instant(time); assert.ok(moment > start && moment < end); return moment; };
    assert.ok(within(local.ui.startedAt) <= within(local.ui.finishedAt));
    boolean(local.ui.responsive);
    within(local.runtime.observedAt);
    assert.equal(QWEN_CONFIGURATION.binding.kind, 'local');
    if (QWEN_CONFIGURATION.binding.kind !== 'local') throw new Error('Local binding required');
    assert.equal(local.runtime.digest, QWEN_CONFIGURATION.binding.modelDigest);
    assert.equal(local.runtime.contextLength, 32768);
    natural(local.runtime.sizeBytes); natural(local.runtime.sizeVramBytes);
    assert.ok(local.runtime.sizeBytes > 0 && local.runtime.sizeVramBytes <= local.runtime.sizeBytes);
    for (const gpu of [local.gpuBefore, local.gpuDuring]) {
      closed(gpu, ['observedAt', 'usedMiB', 'freeMiB']);
      natural(gpu.usedMiB); natural(gpu.freeMiB);
    }
    assert.ok(instant(local.gpuBefore.observedAt) < instant(entered.enteredAt));
    within(local.gpuDuring.observedAt);
    boolean(local.oomObserved);
    localPassed = local.ui.responsive && !local.oomObserved;
  }
  const retrieval = value.dimensions[2].value;
  assert.equal(retrieval, label.endsWith('-image') ? 'fail' : 'not-run');
  if (value.accepted) {
    assert.equal(result.status, 'proposal');
    assert.equal(value.uncertainty, 'pass');
    assert.ok(localPassed);
    for (const [index, dimension] of value.dimensions.entries()) if (index !== 0 && index !== 2) assert.equal(dimension.value, 'pass');
  }
  return freeze(value as M602Assessment);
}

function validateResult(value: unknown, label: M602CaseLabel, pkg: M602Package, entered: CommonEntered,
  enteredSha256: string, dispatch: CommonDispatch | null, dispatchSha256: string | null, version: EvidenceVersion = 'm602-evidence-v1'): CommonResult {
  closed(value, ['version', 'caseLabel', 'enteredSha256', 'dispatchSha256', 'finishedAt', 'status', 'error',
    'attempted', 'cleanupFailed', 'observation', 'wire', 'requests', 'chatWindow', 'proposal']);
  identity(value, label, version);
  assert.equal(value.enteredSha256, enteredSha256);
  assert.equal(value.dispatchSha256, dispatchSha256);
  const finished = instant(value.finishedAt);
  assert.ok(finished >= instant(entered.enteredAt));
  if (dispatch) assert.ok(finished >= instant(dispatch.markedAt));
  assert.ok(['proposal', 'abstained', 'failed'].includes(value.status));
  boolean(value.attempted); boolean(value.cleanupFailed);
  assert.ok(value.status === 'failed' ? errors.includes(value.error) : value.error === null);
  closed(value.requests, ['version', 'show', 'tags', 'chat']);
  for (const count of Object.values(value.requests)) { natural(count); assert.ok(count <= 1); }
  if (label.startsWith('groq-')) assert.deepEqual(value.requests, { version: 0, show: 0, tags: 0, chat: value.requests.chat });
  else {
    assert.ok(value.requests.version >= value.requests.show && value.requests.show >= value.requests.tags
      && value.requests.tags >= value.requests.chat);
  }
  if (!value.attempted) {
    assert.equal(value.observation, null); assert.equal(value.requests.chat, 0);
    assert.equal(value.wire, null); assert.equal(value.chatWindow, null);
  } else assert.ok(dispatch);
  if (value.observation !== null) {
    assert.ok(value.attempted);
    closed(value.observation, ['adapterConfiguration', 'outcome', 'validation']);
    const observation = value.observation;
    const invocation = readProviderInvocation({ ...observation.adapterConfiguration, outcome: observation.outcome, validation: observation.validation });
    const configuration = version === reasoningVersion
      ? (label.startsWith('local-') ? REASONING_QWEN_CONFIGURATION : REASONING_GROQ_CONFIGURATION)
      : version === promptVersion
      ? (label.startsWith('local-') ? PROMPT_CASE_QWEN_CONFIGURATION : PROMPT_CASE_GROQ_CONFIGURATION)
      : version === repairedVersion
      ? (label.startsWith('local-') ? CASE_QWEN_CONFIGURATION : CASE_GROQ_CONFIGURATION)
      : (label.startsWith('local-') ? QWEN_CONFIGURATION : GROQ_CONFIGURATION);
    const { outcome: _outcome, validation: _validation, ...metadata } = invocation;
    assert.deepEqual(observation.adapterConfiguration, metadata);
    assert.deepEqual(metadata, { adapterId: configuration.adapterId, adapterVersion: configuration.adapterVersion,
      endpointIdentity: configuration.endpoint, promptVersion: configuration.promptVersion, schemaVersion: configuration.schemaVersion,
      outputContractVersion: configuration.outputContractVersion, parameters: configuration.parameters });
    if (value.status === 'proposal') assert.ok(observation.outcome === 'response' && observation.validation === 'passed');
  }
  if (value.status === 'failed') {
    const observation = value.observation;
    if (['input-integrity', 'configuration', 'missing-prerequisite', 'input-fit'].includes(value.error)) {
      assert.ok(!value.attempted && observation === null);
    } else if (['authentication', 'quota', 'rate-limit', 'network', 'provider'].includes(value.error)) {
      assert.ok(value.attempted && observation !== null
        && observation.outcome === value.error && observation.validation === 'not-run');
    } else if (value.error === 'response-validation') {
      assert.ok(value.attempted && observation !== null && observation.outcome === 'response');
      // Candidate validation can pass while the caller rejects native correspondence.
      assert.ok(observation.validation === 'failed' || (observation.validation === 'passed'
        && (value.requests.chat !== 1 || value.chatWindow === null
          || value.wire?.sha256 !== pkg.wire.sha256 || value.wire?.bytes !== pkg.wire.bytes)));
    } else {
      // Cancellation may follow an already observed response; retain that observation.
      assert.ok(value.error === 'timeout' || value.error === 'shutdown');
      assert.ok(value.attempted ? observation !== null : observation === null);
    }
  }
  if (value.wire !== null) {
    closed(value.wire, ['sha256', 'bytes']); digest(value.wire.sha256); natural(value.wire.bytes);
    assert.ok(value.requests.chat === 1 && value.wire.bytes > 0);
  }
  if (value.chatWindow !== null) {
    closed(value.chatWindow, ['startedAt', 'finishedAt']);
    assert.ok(value.requests.chat === 1 && dispatch);
    const start = instant(value.chatWindow.startedAt), end = instant(value.chatWindow.finishedAt);
    assert.ok(start >= instant(dispatch.markedAt) && end >= start && end <= finished);
  }
  if (value.status === 'proposal') {
    assert.ok(value.attempted && !value.cleanupFailed && value.requests.chat === 1 && value.chatWindow && value.observation);
    assert.deepEqual(value.wire, pkg.wire);
    const validated = pkg.validateCandidate(value.proposal);
    assert.ok(validated.ok);
    assert.deepEqual(value.proposal, validated.value);
  } else assert.equal(value.proposal, null);
  if (value.status === 'abstained') assert.ok(!value.attempted && !value.cleanupFailed && dispatch === null);
  return freeze(value as M602Result);
}

function currentSnapshot(caseLabel: M602CaseLabel, dependencies?: M602OperationDependencies) {
  const { root, filesystem, configuration } = context(caseLabel, dependencies, false);
  const loaded = loadM602Package(caseLabel, dependencies?.packageEnvironment);
  assert.equal(loaded.status, 'ready');
  if (loaded.status !== 'ready') throw new Error('Package rejected');
  const directory = path.join(root, caseLabel);
  ordinary(directory, filesystem, false);
  const names = filesystem.readdirSync(directory);
  assert.ok(names.includes('entered.json') && names.includes('result.json'));
  assert.ok(names.every(name => ['entered.json', 'dispatch.json', 'result.json', 'assessment.json'].includes(name)));
  const enteredRecord = record(directory, 'entered.json', filesystem);
  const entered = enteredRecord.value;
  closed(entered, ['version', 'caseLabel', 'enteredAt', 'manifestSha256', 'mode', 'configurationSha256', 'codeSha256']);
  identity(entered, caseLabel); instant(entered.enteredAt);
  digest(entered.manifestSha256); digest(entered.configurationSha256); digest(entered.codeSha256);
  assert.equal(entered.manifestSha256, loaded.value.identities.manifestSha256);
  assert.equal(entered.mode, configuration.providerContext.mode);
  assert.equal(entered.configurationSha256, hash(JSON.stringify(configuration)));
  assert.equal(entered.codeSha256, codeHash());
  let dispatch: Dispatch | null = null, dispatchSha256: string | null = null;
  if (names.includes('dispatch.json')) {
    const dispatchRecord = record(directory, 'dispatch.json', filesystem);
    const value = dispatchRecord.value;
    closed(value, ['version', 'caseLabel', 'enteredSha256', 'markedAt', 'meaning']);
    identity(value, caseLabel);
    assert.equal(value.enteredSha256, enteredRecord.sha256);
    assert.equal(value.meaning, 'dispatch-may-have-started');
    assert.ok(instant(value.markedAt) >= instant(entered.enteredAt));
    dispatch = value as Dispatch; dispatchSha256 = dispatchRecord.sha256;
  }
  const resultRecord = record(directory, 'result.json', filesystem);
  const result = validateResult(resultRecord.value, caseLabel, loaded.value, entered as Entered,
    enteredRecord.sha256, dispatch, dispatchSha256);
  const assessment = names.includes('assessment.json') ? validateAssessment(record(directory, 'assessment.json', filesystem).value,
    caseLabel, result, resultRecord.sha256, entered as Entered) : null;
  return { result, assessment, pkg: loaded.value, entered: entered as Entered, enteredSha256: enteredRecord.sha256,
    dispatchSha256, resultSha256: resultRecord.sha256 };
}
export async function readM602Case(caseLabel: M602CaseLabel, dependencies?: M602OperationDependencies):
  Promise<{ readonly ok: true; readonly result: M602Result; readonly assessment: M602Assessment | null }
    | { readonly ok: false; readonly error: 'evidence-blocked' }> {
  try {
    const { result, assessment } = currentSnapshot(caseLabel, dependencies);
    return Object.freeze({ ok: true, result: result as M602Result, assessment: assessment as M602Assessment | null });
  } catch { return Object.freeze({ ok: false, error: 'evidence-blocked' }); }
}

function accountNative(native: OllamaNativeRequest, local: boolean, observation: ReturnType<typeof createM602Observation>) {
  const counts = { version: 0, show: 0, tags: 0, chat: 0 };
  let wire: Wire | null = null;
  let start: string | undefined, end: string | undefined;
  const removals: (() => void)[] = [];
  const detach = () => { for (const remove of removals.splice(0)) remove(); };
  const request: OllamaNativeRequest = (options, callback) => {
    const route = local ? ({ '/api/version': 'version', '/api/show': 'show', '/api/tags': 'tags', '/api/chat': 'chat' } as const)[options.path as '/api/chat']
      : options.path === '/openai/v1/chat/completions' ? 'chat' : undefined;
    assert.ok(route && counts[route] === 0);
    counts[route]++;
    const chat = route === 'chat';
    const finish = () => { if (chat && end === undefined) { end = timestamp(); detach(); observation.close(end); } };
    let handle: ClientRequest;
    if (chat) start = timestamp();
    try {
      handle = native(options, response => {
        if (chat) {
          response.once('end', finish); response.once('close', finish);
          removals.push(() => { response.removeListener('end', finish); response.removeListener('close', finish); });
        }
        callback(response);
      });
    } catch (error) { finish(); throw error; }
    if (chat) {
      if (end === undefined) {
        handle.once('error', finish); handle.once('close', finish);
        removals.push(() => { handle.removeListener('error', finish); handle.removeListener('close', finish); });
      }
      const original = handle.end;
      handle.end = function (this: ClientRequest, ...args: unknown[]) {
        const body = args[0];
        assert.ok(typeof body === 'string' || body instanceof Uint8Array);
        wire = Object.freeze({ sha256: hash(body), bytes: typeof body === 'string' ? Buffer.byteLength(body) : body.byteLength });
        return Reflect.apply(original, this, args);
      } as typeof handle.end;
      if (local && end === undefined) observation.schedule(start!);
    }
    return handle;
  };
  return { request, counts, detach, get wire() { return wire; },
    get chatWindow(): ChatWindow | null { return start !== undefined && end !== undefined ? Object.freeze({ startedAt: start, finishedAt: end }) : null; } };
}

export async function executeM602Case(caseLabel: M602CaseLabel, dependencies?: M602OperationDependencies):
  Promise<{ readonly ok: true; readonly result: M602Result; readonly followup?: { readonly report: M602FollowupReport; readonly sha256: string } } | { readonly ok: false; readonly error: 'evidence-blocked' | 'evidence-publication' }> {
  let execution: ReturnType<typeof context>;
  try {
    execution = context(caseLabel, dependencies, true);
    for (const previous of labels.slice(0, labels.indexOf(caseLabel))) {
      const prior = await readM602Case(previous, dependencies);
      assert.ok(prior.ok && prior.result.status === 'proposal' && prior.assessment?.accepted);
    }
    assert.ok(!execution.filesystem.readdirSync(execution.root).includes(caseLabel));
  } catch { return Object.freeze({ ok: false, error: 'evidence-blocked' }); }
  try {
    const source = await executeSource(caseLabel, dependencies, execution, 'm602-evidence-v1', dependencies?.followup?.observers);
    const result = source.result as M602Result;
    const { reportRoot, filesystem } = execution;
    if (reportRoot === undefined) return Object.freeze({ ok: true, result });
    const report: M602FollowupReport = freeze({ version: 'm602-followup-v1', caseLabel,
      producerCodeSha256: source.entered.codeSha256, manifestSha256: source.entered.manifestSha256,
      enteredSha256: source.enteredSha256, dispatchSha256: source.dispatchSha256, resultSha256: source.resultSha256,
      diagnostic: source.diagnostic, observation: source.timing });
    validateFollowup(report, result, source.expectedWire);
    try { filesystem.mkdirSync(reportRoot); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
    ordinary(reportRoot, filesystem, false);
    const reportDirectory = path.join(reportRoot, source.enteredSha256); filesystem.mkdirSync(reportDirectory);
    const sha256 = publish(reportDirectory, 'report.json', report, filesystem);
    return Object.freeze({ ok: true, result, followup: Object.freeze({ report, sha256 }) });
  } catch { return Object.freeze({ ok: false, error: 'evidence-publication' }); }
}

async function executeSource(caseLabel: M602CaseLabel, dependencies: M602OperationDependencies | undefined,
  execution: Pick<ReturnType<typeof context>, 'root' | 'filesystem' | 'configuration'>, version: EvidenceVersion,
  observers?: M602Observers, extension: Record<string, string> = {}, onDetail?: CandidateDetailSink) {
  const { root, filesystem, configuration } = execution;
  filesystem.mkdirSync(path.join(root, caseLabel));
  const directory = path.join(root, caseLabel);
  const signal = dependencies?.signal ?? new AbortController().signal;
  const observation = createM602Observation(caseLabel.startsWith('local-') ? observers : undefined, signal);
  const diagnostic = createM602DiagnosticCollector();
  try {
    const entered = { version, caseLabel, enteredAt: timestamp(),
      manifestSha256: dependencies?.packageEnvironment?.manifestSha256 ?? manifestDigest,
      mode: configuration.providerContext.mode, configurationSha256: hash(JSON.stringify(configuration)), codeSha256: codeHash(version, filesystem), ...extension };
    const enteredSha256 = publish(directory, 'entered.json', entered, filesystem);
    const local = configuration.providerContext.mode === 'local';
    const native = dependencies === undefined ? (local ? httpRequest : httpsRequest) : dependencies.requestImplementation!;
    const accounting = accountNative(native, local, observation);
    const adapter = local ? (version === reasoningVersion ? createReasoningOllamaGenerationAdapter : version === promptVersion ? createPromptCaseOllamaGenerationAdapter : version === repairedVersion ? createCaseOllamaGenerationAdapter : createOllamaGenerationAdapter)(accounting.request, diagnostic.onRejection)
      : (version === reasoningVersion ? createReasoningGroqGenerationAdapter : version === promptVersion ? createPromptCaseGroqGenerationAdapter : version === repairedVersion ? createCaseGroqGenerationAdapter : createGroqGenerationAdapter)({ requestImplementation: accounting.request, credentialIO: dependencies?.credentialIO });
    let pkg: M602Package | undefined;
    let dispatchSha256: string | null = null;
    let publicationFailed = false;
    const outcome = await executeGenerationOperation({ signal, onRejection: diagnostic.onRejection,
      providerContext: configuration.providerContext, adapter,
      admit() {
        const loaded = (version === reasoningVersion ? loadM602ReasoningPackage : version === promptVersion ? loadM602PromptPackage : version === repairedVersion ? loadM602RepairedPackage : loadM602Package)(caseLabel, dependencies?.packageEnvironment);
        if (loaded.status !== 'ready') return loaded;
        pkg = loaded.value;
        return { status: 'ready', createRequest: pkg.createRequest, validateCandidate: (candidate, onRejection) => pkg!.validateCandidate(candidate, onRejection, onDetail) };
      },
      beforeTransport() {
        try {
          dispatchSha256 = publish(directory, 'dispatch.json', { version, caseLabel,
            enteredSha256, markedAt: timestamp(), meaning: 'dispatch-may-have-started' } satisfies CommonDispatch, filesystem);
        } catch { publicationFailed = true; throw new Error('Evidence publication rejected'); }
      },
    });
    observation.close();
    accounting.detach();
    if (publicationFailed) throw new Error('Evidence publication rejected');
    const validProposal = outcome.status === 'proposal' && pkg && accounting.counts.chat === 1 && accounting.chatWindow
      && accounting.wire?.sha256 === pkg.wire.sha256 && accounting.wire?.bytes === pkg.wire.bytes;
    if (outcome.status === 'proposal' && !validProposal) emitGenerationRejection(diagnostic.onRejection, 'caller/correspondence');
    const status = outcome.status === 'proposal' && !validProposal ? 'failed' : outcome.status;
    const result: CommonResult = freeze({ version, caseLabel, enteredSha256, dispatchSha256,
      finishedAt: timestamp(), status,
      error: outcome.status === 'failed' ? outcome.error : status === 'failed' ? 'response-validation' : null,
      attempted: outcome.attempted, cleanupFailed: outcome.cleanupFailed,
      observation: outcome.status === 'abstained' ? null : outcome.observation ?? null,
      wire: accounting.wire, requests: { ...accounting.counts }, chatWindow: accounting.chatWindow,
      proposal: outcome.status === 'proposal' && validProposal ? outcome.proposal : null });
    const resultSha256 = publish(directory, 'result.json', result, filesystem);
    return freeze({ result, entered, enteredSha256, dispatchSha256, resultSha256,
      diagnostic: diagnostic.close(result, pkg?.wire ?? null), timing: observation.report(result.chatWindow), expectedWire: pkg?.wire ?? null });
  } finally { observation.close(); }
}

export type M602FollowupReport = Readonly<{
  version: 'm602-followup-v1'; caseLabel: M602CaseLabel; producerCodeSha256: string; manifestSha256: string;
  enteredSha256: string; dispatchSha256: string | null; resultSha256: string;
  diagnostic: Readonly<{ integrity: 'complete' | 'failed'; code: GenerationRejectionCode | null }>;
  observation: Readonly<{ chatWindow: ChatWindow | null; ui: M602ObservationSlot; runtime: M602ObservationSlot;
    gpu: M602ObservationSlot; cleanup: 'complete' | 'uncertain' }>;
}>;
function diagnosticCompatible(code: GenerationRejectionCode, result: CommonResult, expectedWire: Wire | null): boolean {
  const o = result.observation;
  if (!result.attempted || result.status !== 'failed' || result.proposal !== null || o === null) return false;
  const cancelled = result.error === 'timeout' || result.error === 'shutdown';
  const responseFailure = o.outcome === 'response' && o.validation === 'failed';
  const cancellationObservation = cancelled && o.outcome === result.error && o.validation === 'not-run';
  const networkObservation = o.outcome === 'network' && o.validation === 'not-run';
  if (['adapter-response/body', 'adapter-response/envelope', 'adapter-response/content'].includes(code)) {
    return ((result.error === 'response-validation' || cancelled) && responseFailure)
      || (result.cleanupFailed && ((cancelled && (cancellationObservation || networkObservation))
        || (result.error === 'network' && networkObservation)));
  }
  if (code === 'adapter-response/unspecified' || code === 'candidate/contract') {
    return (result.error === 'response-validation' || cancelled) && responseFailure
      && (code !== 'candidate/contract' || !result.cleanupFailed);
  }
  if (code === 'executor/envelope') return result.cleanupFailed
    && ((o.outcome === 'provider' && o.validation === 'not-run' && (result.error === 'provider' || cancelled))
      || cancellationObservation);
  return code === 'caller/correspondence' && expectedWire !== null && result.error === 'response-validation'
    && !result.cleanupFailed && o.outcome === 'response' && o.validation === 'passed'
    && (result.requests.chat !== 1 || result.chatWindow === null || result.wire?.sha256 !== expectedWire.sha256
      || result.wire?.bytes !== expectedWire.bytes);
}
export function createM602DiagnosticCollector(): {
  onRejection: GenerationRejectionSink;
  close(result: CommonResult, expectedWire: Wire | null): M602FollowupReport['diagnostic'];
} {
  let failed = false;
  let code: GenerationRejectionCode | null = null;
  let snapshot: M602FollowupReport['diagnostic'] | undefined;
  const detailed = (value: GenerationRejectionCode) => ['adapter-response/body', 'adapter-response/envelope', 'adapter-response/content'].includes(value);
  return Object.freeze({ onRejection(event: unknown) {
    if (snapshot || failed) return;
    try {
      assert.ok(!types.isProxy(event));
      const next = readGenerationRejection(event);
      if (code === null || next === code) code = next;
      else if (code === 'adapter-response/unspecified' && detailed(next)) code = next;
      else if (!(next === 'adapter-response/unspecified' && detailed(code))) failed = true;
    } catch { failed = true; }
  }, close(result: CommonResult, expectedWire: Wire | null) {
    if (snapshot) return snapshot;
    try { if (code !== null && !diagnosticCompatible(code, result, expectedWire)) failed = true; }
    catch { failed = true; }
    snapshot = Object.freeze({ integrity: failed ? 'failed' : 'complete', code: failed ? null : code });
    return snapshot;
  } });
}
function validateFollowup(value: unknown, result: CommonResult, expectedWire: Wire | null): M602FollowupReport {
  closed(value, ['version', 'caseLabel', 'producerCodeSha256', 'manifestSha256', 'enteredSha256', 'dispatchSha256',
    'resultSha256', 'diagnostic', 'observation']);
  assert.equal(value.version, 'm602-followup-v1');
  assert.equal(value.caseLabel, result.caseLabel);
  for (const key of ['producerCodeSha256', 'manifestSha256', 'enteredSha256', 'resultSha256']) digest(value[key]);
  if (value.dispatchSha256 !== null) digest(value.dispatchSha256);
  assert.equal(value.enteredSha256, result.enteredSha256);
  assert.equal(value.dispatchSha256, result.dispatchSha256);
  closed(value.diagnostic, ['integrity', 'code']);
  assert.ok(['complete', 'failed'].includes(value.diagnostic.integrity));
  if (value.diagnostic.integrity === 'failed') assert.equal(value.diagnostic.code, null);
  if (value.diagnostic.code !== null) {
    const code = readGenerationRejection({ code: value.diagnostic.code });
    assert.ok(diagnosticCompatible(code, result, expectedWire));
  }
  const observation = value.observation;
  closed(observation, ['chatWindow', 'ui', 'runtime', 'gpu', 'cleanup']);
  assert.deepEqual(observation.chatWindow, result.chatWindow);
  let uncertain = false;
  for (const kind of ['ui', 'runtime', 'gpu']) {
    const slot: RecordValue = observation[kind];
    closed(slot, ['status', 'startedAt', 'finishedAt', 'cleanup']);
    assert.ok(['unavailable', 'missed-window', 'failed', 'aborted', 'completed'].includes(slot.status));
    const start = slot.startedAt === null ? null : instant(slot.startedAt);
    const end = slot.finishedAt === null ? null : instant(slot.finishedAt);
    assert.ok(end === null || (start !== null && end >= start));
    assert.equal(slot.cleanup, slot.status === 'aborted' ? 'uncertain' : 'complete');
    uncertain ||= slot.cleanup === 'uncertain';
    if (slot.status === 'unavailable') assert.ok(start === null && end === null);
    if (slot.status === 'failed' || slot.status === 'missed-window') assert.equal(start === null, end === null);
    if (slot.status === 'completed') {
      assert.ok(result.chatWindow && start !== null && end !== null);
      assert.ok(start > instant(result.chatWindow.startedAt) && end < instant(result.chatWindow.finishedAt));
    }
    if (result.caseLabel.startsWith('groq-')) assert.equal(slot.status, 'unavailable');
  }
  assert.equal(observation.cleanup, uncertain ? 'uncertain' : 'complete');
  return freeze(value as M602FollowupReport);
}
export async function readM602Followup(caseLabel: M602CaseLabel, dependencies?: M602OperationDependencies):
  Promise<{ readonly ok: true; readonly report: M602FollowupReport; readonly sha256: string }
    | { readonly ok: false; readonly error: 'evidence-blocked' }> {
  try {
    if (dependencies !== undefined) assert.ok(dependencies.followup);
    const { reportRoot, filesystem } = context(caseLabel, dependencies, false);
    assert.ok(reportRoot);
    const source = currentSnapshot(caseLabel, dependencies);
    const directory = path.join(reportRoot, source.enteredSha256);
    ordinary(directory, filesystem, false);
    assert.deepEqual(filesystem.readdirSync(directory), ['report.json']);
    const stored = record(directory, 'report.json', filesystem);
    const report = validateFollowup(stored.value, source.result, source.pkg.wire);
    assert.equal(report.producerCodeSha256, source.entered.codeSha256);
    assert.equal(report.manifestSha256, source.entered.manifestSha256);
    assert.equal(report.enteredSha256, source.enteredSha256);
    assert.equal(report.dispatchSha256, source.dispatchSha256);
    assert.equal(report.resultSha256, source.resultSha256);
    return Object.freeze({ ok: true, report, sha256: stored.sha256 });
  } catch { return Object.freeze({ ok: false, error: 'evidence-blocked' }); }
}

function observedContext(caseLabel: M602CaseLabel, campaign: ObservedCampaign, dependencies: ObservedDependencies | undefined,
  mode: 'read' | 'execute' | 'qualify') {
  assert.ok(labels.includes(caseLabel));
  const manifestEnvironment = campaign === 'reasoning' ? dependencies?.reasoningManifestEnvironment : campaign === 'prompt' ? dependencies?.promptManifestEnvironment : campaign === 'repaired' ? dependencies?.repairedManifestEnvironment : campaign === 'instrumented' ? dependencies?.instrumentedManifestEnvironment : campaign === 'completion' ? dependencies?.completionManifestEnvironment : dependencies?.successorManifestEnvironment;
  if (dependencies !== undefined) {
    assert.ok(dependencies.root && dependencies.packageEnvironment && manifestEnvironment);
    isolatedSuccessorRoot(dependencies.root);
    assert.equal(typeof dependencies.packageEnvironment.readBytes, 'function');
    assert.equal(typeof manifestEnvironment.readBytes, 'function');
    if (mode === 'execute') {
      assert.equal(typeof dependencies.requestImplementation, 'function');
      if (caseLabel.startsWith('groq-')) assert.ok(dependencies.credentialIO);
    }
    if (mode === 'qualify' || (mode === 'execute' && caseLabel.startsWith('local-'))) completeSuccessorIO(dependencies.observerIO);
  }
  if (mode !== 'read') assert.ok(!dependencies?.signal?.aborted);
  const root = dependencies === undefined ? path.join(repository, `temp/m602-${campaign}-v1`) : path.resolve(dependencies.root!);
  const filesystem: EvidenceFilesystem = { mkdirSync: fs.mkdirSync, openSync: fs.openSync, writeSync: fs.writeSync,
    fsyncSync: fs.fsyncSync, closeSync: fs.closeSync, lstatSync: fs.lstatSync, realpathSync: fs.realpathSync,
    readFileSync: fs.readFileSync, readdirSync: fs.readdirSync, ...dependencies?.filesystem };
  ordinary(root, filesystem, false);
  const allowed = ['qualification.json', ...labels, ...(dependencies === undefined ? [] : ['runs', 'client', 'observer-scratch'])];
  assert.ok(filesystem.readdirSync(root).every(name => allowed.includes(name)));
  const loaded = (campaign === 'reasoning' ? loadM602ReasoningPackage : campaign === 'prompt' ? loadM602PromptPackage : campaign === 'repaired' ? loadM602RepairedPackage : loadM602Package)(caseLabel, dependencies?.packageEnvironment);
  assert.equal(loaded.status, 'ready'); if (loaded.status !== 'ready') throw new Error('Package rejected');
  const campaignManifestSha256 = campaign === 'reasoning' || campaign === 'prompt' || campaign === 'repaired'
    ? (campaign === 'reasoning' ? loadReasoningManifest : campaign === 'prompt' ? loadPromptManifest : loadRepairedManifest)(loaded.value.identities.manifestSha256, manifestEnvironment, dependencies?.packageEnvironment)
    : (campaign === 'instrumented' ? loadInstrumentedManifest : campaign === 'completion' ? loadCompletionManifest : loadSuccessorManifest)(loaded.value.identities.manifestSha256, manifestEnvironment);
  const applicationRevision = process.env.A11Y_APPLICATION_REVISION;
  if (mode !== 'read' || dependencies === undefined) assert.ok(applicationRevision && /^[0-9a-f]{40}$/u.test(applicationRevision));
  return { kind: campaign, version: campaign === 'reasoning' ? reasoningVersion : campaign === 'prompt' ? promptVersion : campaign === 'repaired' ? repairedVersion : campaign === 'instrumented' ? instrumentedVersion : campaign === 'completion' ? completionVersion : successorVersion,
    campaign: campaign === 'reasoning' ? reasoningCampaign : campaign === 'prompt' ? promptCampaign : campaign === 'repaired' ? repairedCampaign : campaign === 'instrumented' ? instrumentedCampaign : campaign === 'completion' ? completionCampaign : successorCampaign,
    root, filesystem, configuration: campaign === 'reasoning'
      ? (caseLabel.startsWith('local-') ? REASONING_QWEN_CONFIGURATION : REASONING_GROQ_CONFIGURATION)
      : campaign === 'prompt'
      ? (caseLabel.startsWith('local-') ? PROMPT_CASE_QWEN_CONFIGURATION : PROMPT_CASE_GROQ_CONFIGURATION)
      : campaign === 'repaired'
      ? (caseLabel.startsWith('local-') ? CASE_QWEN_CONFIGURATION : CASE_GROQ_CONFIGURATION)
      : (caseLabel.startsWith('local-') ? QWEN_CONFIGURATION : GROQ_CONFIGURATION),
    pkg: loaded.value, campaignManifestSha256, manifestSha256: loaded.value.identities.manifestSha256,
    producerCodeSha256: codeHash(campaign === 'reasoning' ? reasoningVersion : campaign === 'prompt' ? promptVersion : campaign === 'repaired' ? repairedVersion : campaign === 'instrumented' ? instrumentedVersion : campaign === 'completion' ? completionVersion : successorVersion, filesystem), build: (campaign === 'reasoning' ? reasoningBuild : campaign === 'prompt' ? promptBuild : campaign === 'repaired' ? repairedBuild : campaign === 'instrumented' ? instrumentedBuild : successorBuild)(dependencies?.root, filesystem),
    applicationRevision: mode === 'read' && dependencies !== undefined ? undefined : applicationRevision };
}
type ObservedContext = ReturnType<typeof observedContext>;
function observedQualification(execution: ObservedContext) {
  const stored = record(execution.root, 'qualification.json', execution.filesystem);
  return { qualification: (execution.kind === 'reasoning' ? validateReasoningQualification : execution.kind === 'prompt' ? validatePromptQualification : execution.kind === 'repaired' ? validateRepairedQualification : execution.kind === 'instrumented' ? validateInstrumentedQualification : execution.kind === 'completion' ? validateCompletionQualification : validateSuccessorQualification)(stored.value, execution), sha256: stored.sha256 };
}
function successorFailure(error: M602SuccessorFailure['error'], cleanup = noSuccessorResources): M602SuccessorFailure {
  return freeze({ ok: false, error, cleanup });
}
function observerEnvironment(dependencies: ObservedDependencies | undefined, revision: string) {
  return dependencies === undefined ? undefined : { root: dependencies.root!, applicationRevision: revision, io: dependencies.observerIO! };
}
async function qualifyObserved(campaign: ObservedCampaign, dependencies?: ObservedDependencies):
  Promise<{ readonly ok: true; readonly qualification: ObservedQualification; readonly sha256: string } | M602SuccessorFailure> {
  let execution: ObservedContext;
  try {
    execution = observedContext('local-image', campaign, dependencies, 'qualify');
    if (execution.filesystem.readdirSync(execution.root).includes('qualification.json')) {
      return freeze({ ok: true, ...observedQualification(execution) });
    }
    assert.ok(!execution.filesystem.readdirSync(execution.root).some(name => labels.includes(name as M602CaseLabel)));
  } catch { return successorFailure('evidence-blocked'); }
  const prepared = await prepareM602SuccessorObservers(observerEnvironment(dependencies, execution.applicationRevision!), dependencies?.signal, undefined, (campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') ? 'm602-loading-observation-v2' : undefined);
  if (!prepared.ok) return prepared;
  const session = prepared.session;
  const signal = dependencies?.signal ?? new AbortController().signal;
  const synthetic: NonNullable<M602Observers['runtime']> = gate => {
    const cancel = () => { clearTimeout(timer); gate.signal.removeEventListener('abort', cancel); };
    const timer = setTimeout(() => { cancel(); gate.start(active => { assert.ok(!active.aborted); }); }, 1000);
    gate.signal.addEventListener('abort', cancel, { once: true }); if (gate.signal.aborted) cancel();
  };
  const coordinator = createM602Observation({ ui: session.observers.ui, runtime: synthetic, gpu: synthetic }, signal);
  let cleanup: M602SuccessorCleanup = noSuccessorResources;
  try {
    const startedAt = timestamp(); coordinator.schedule(startedAt);
    await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(new Error('Qualification aborted')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 7000);
      signal.addEventListener('abort', abort, { once: true }); if (signal.aborted) abort();
    });
    const finishedAt = timestamp(); coordinator.close(finishedAt);
    const timing = coordinator.report({ startedAt, finishedAt });
    assert.ok(['ui', 'runtime', 'gpu'].every(kind => timing[kind as 'ui'].status === 'completed'));
    cleanup = await session.close();
    const qualification = (campaign === 'reasoning' ? validateReasoningQualification : campaign === 'prompt' ? validatePromptQualification : campaign === 'repaired' ? validateRepairedQualification : campaign === 'instrumented' ? validateInstrumentedQualification : campaign === 'completion' ? validateCompletionQualification : validateSuccessorQualification)({ version: `m602-${campaign}-qualification-v1`, campaign: execution.campaign,
      qualifiedAt: timestamp(), campaignManifestSha256: execution.campaignManifestSha256, manifestSha256: execution.manifestSha256,
      producerCodeSha256: execution.producerCodeSha256, applicationRevision: execution.applicationRevision,
      nodeVersion: process.version, browserVersion: '151.0.7922.34', build: execution.build, ui: true, gpu: true, cleanup, ...((campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') ? { runtime: 'not-exercised' } : {}) }, execution);
    try { return freeze({ ok: true, qualification, sha256: publish(execution.root, 'qualification.json', qualification, execution.filesystem) }); }
    catch { return successorFailure('evidence-publication', cleanup); }
  } catch { return successorFailure('observer-readiness', await session.close()); }
  finally { coordinator.close(); await session.close(); }
}

function observedSnapshot(caseLabel: M602CaseLabel, campaign: ObservedCampaign, dependencies?: ObservedDependencies) {
  const execution = observedContext(caseLabel, campaign, dependencies, 'read');
  const qualified = observedQualification(execution);
  const { root, filesystem, configuration } = execution;
  const directory = path.join(root, caseLabel); ordinary(directory, filesystem, false);
  const names = filesystem.readdirSync(directory);
  assert.ok(['entered.json', 'result.json', 'observation.json'].every(name => names.includes(name)));
  assert.ok(names.every(name => ['entered.json', 'dispatch.json', 'result.json', 'observation.json', 'assessment.json'].includes(name)));
  const enteredRecord = record(directory, 'entered.json', filesystem), entered = enteredRecord.value;
  closed(entered, ['version', 'caseLabel', 'enteredAt', 'manifestSha256', 'mode', 'configurationSha256', 'codeSha256',
    'campaign', 'campaignManifestSha256', 'qualificationSha256']);
  identity(entered, caseLabel, execution.version); instant(entered.enteredAt);
  assert.equal(entered.campaign, execution.campaign); assert.equal(entered.campaignManifestSha256, execution.campaignManifestSha256);
  assert.equal(entered.qualificationSha256, qualified.sha256); assert.equal(entered.manifestSha256, execution.manifestSha256);
  assert.equal(entered.codeSha256, execution.producerCodeSha256); assert.equal(entered.mode, configuration.providerContext.mode);
  assert.equal(entered.configurationSha256, hash(JSON.stringify(configuration)));
  assert.ok(instant(entered.enteredAt) >= instant(qualified.qualification.qualifiedAt));
  let dispatch: CommonDispatch | null = null, dispatchSha256: string | null = null;
  if (names.includes('dispatch.json')) {
    const stored = record(directory, 'dispatch.json', filesystem), value = stored.value;
    closed(value, ['version', 'caseLabel', 'enteredSha256', 'markedAt', 'meaning']); identity(value, caseLabel, execution.version);
    assert.equal(value.enteredSha256, enteredRecord.sha256); assert.equal(value.meaning, 'dispatch-may-have-started');
    assert.ok(instant(value.markedAt) >= instant(entered.enteredAt)); dispatch = value as CommonDispatch; dispatchSha256 = stored.sha256;
  }
  const resultRecord = record(directory, 'result.json', filesystem);
  const result = validateResult(resultRecord.value, caseLabel, execution.pkg, entered as CommonEntered, enteredRecord.sha256,
    dispatch, dispatchSha256, execution.version) as ObservedResult;
  const stored = record(directory, 'observation.json', filesystem);
  const observation = (campaign === 'reasoning' ? validateReasoningObservation : campaign === 'prompt' ? validatePromptObservation : campaign === 'repaired' ? validateRepairedObservation : campaign === 'instrumented' ? validateInstrumentedObservation : campaign === 'completion' ? validateCompletionObservation : validateSuccessorObservation)(stored.value, { caseLabel, campaignManifestSha256: execution.campaignManifestSha256,
    qualificationSha256: qualified.sha256, producerCodeSha256: entered.codeSha256, enteredSha256: enteredRecord.sha256,
    dispatchSha256, resultSha256: resultRecord.sha256 }, entered.enteredAt);
  validateFollowup({ version: 'm602-followup-v1', caseLabel, producerCodeSha256: entered.codeSha256, manifestSha256: entered.manifestSha256,
    enteredSha256: enteredRecord.sha256, dispatchSha256, resultSha256: resultRecord.sha256,
    diagnostic: observation.diagnostic, observation: observation.timing }, result, execution.pkg.wire);
  if ('details' in observation) validateInstrumentedDetails(observation.details, observation, result);
  let assessment: ObservedAssessment | null = null;
  if (names.includes('assessment.json')) {
    assessment = validateAssessment(record(directory, 'assessment.json', filesystem).value, caseLabel, result, resultRecord.sha256,
      entered as CommonEntered, execution.version) as ObservedAssessment;
    if (campaign === 'reasoning') validateReasoningProjection(assessment as M602ReasoningAssessment, observation as M602ReasoningObservation, stored.sha256);
    else if (campaign === 'prompt') validatePromptProjection(assessment as M602PromptAssessment, observation as M602PromptObservation, stored.sha256);
    else if (campaign === 'repaired') validateRepairedProjection(assessment as M602RepairedAssessment, observation as M602RepairedObservation, stored.sha256);
    else if (campaign === 'instrumented') validateInstrumentedProjection(assessment as M602InstrumentedAssessment, observation as M602InstrumentedObservation, stored.sha256);
    else if (campaign === 'completion') validateCompletionProjection(assessment as M602CompletionAssessment, observation as M602CompletionObservation, stored.sha256);
    else validateSuccessorProjection(assessment as M602SuccessorAssessment, observation as M602SuccessorObservation, stored.sha256);
  }
  return freeze({ ok: true as const, result, observation, observationSha256: stored.sha256, assessment,
    ...(campaign === 'reasoning' ? { eligibleForContinuation: reasoningContinuation(result, observation, assessment, execution.pkg.wire) } : {}) });
}
function reasoningContinuation(result: ObservedResult, observation: ObservedObservation,
  assessment: ObservedAssessment | null, expectedWire: Wire): boolean {
  if (!assessment || !result.attempted || result.cleanupFailed || result.requests.chat !== 1
    || result.dispatchSha256 === null || result.chatWindow === null
    || result.wire?.sha256 !== expectedWire.sha256 || result.wire.bytes !== expectedWire.bytes
    || !reasoningObservationQualified(observation as M602ReasoningObservation)) return false;
  const dimension = (name: string) => assessment.dimensions.find(item => item.observation === name)?.value;
  if (dimension('evidence completeness') !== 'pass') return false;
  if (result.caseLabel.startsWith('local-')) {
    if (!observation.samples || !observation.samples.ui || !observation.samples.runtime || !observation.samples.gpuDuring
      || !assessment.localObservation?.ui.responsive || assessment.localObservation.oomObserved) return false;
  } else if (observation.samples !== null || assessment.localObservation !== null) return false;
  if (result.status === 'proposal' && assessment.accepted) return true;
  if (assessment.accepted) return false;
  if (result.status === 'failed') return result.error === 'response-validation' && dimension('structural validity') === 'fail';
  if (result.status !== 'proposal' || dimension('structural validity') !== 'pass' || dimension('provider completion') !== 'pass') return false;
  const semantics = ['controlled support and citations', 'semantic groundedness', 'remediation usefulness',
    'human judgment and reminder', 'prohibited claims'].map(dimension).concat(assessment.uncertainty);
  return semantics.every(value => value === 'pass' || value === 'fail') && semantics.includes('fail');
}

async function readObserved(caseLabel: M602CaseLabel, campaign: ObservedCampaign, dependencies?: ObservedDependencies):
  Promise<ReturnType<typeof observedSnapshot> | { readonly ok: false; readonly error: 'evidence-blocked' }> {
  try { return observedSnapshot(caseLabel, campaign, dependencies); }
  catch { return freeze({ ok: false, error: 'evidence-blocked' }); }
}
async function executeObserved(caseLabel: M602CaseLabel, campaign: ObservedCampaign, dependencies?: ObservedDependencies):
  Promise<{ readonly ok: true; readonly result: ObservedResult; readonly observation: ObservedObservation;
    readonly observationSha256: string } | M602SuccessorFailure> {
  let execution: ObservedContext, qualified: ReturnType<typeof observedQualification>;
  try {
    execution = observedContext(caseLabel, campaign, dependencies, 'execute'); qualified = observedQualification(execution);
    assert.ok(!execution.filesystem.readdirSync(execution.root).includes(caseLabel));
    for (const previous of labels.slice(0, labels.indexOf(caseLabel))) {
      const prior = observedSnapshot(previous, campaign, dependencies);
      assert.ok(campaign === 'reasoning' ? prior.eligibleForContinuation : prior.result.status === 'proposal' && prior.assessment?.accepted && (campaign === 'prompt' ? promptObservationQualified(prior.observation as M602PromptObservation) : campaign === 'repaired' ? repairedObservationQualified(prior.observation as M602RepairedObservation) : campaign === 'instrumented' ? instrumentedObservationQualified(prior.observation as M602InstrumentedObservation) : campaign === 'completion' ? completionObservationQualified(prior.observation as M602CompletionObservation) : successorObservationQualified(prior.observation as M602SuccessorObservation)));
    }
  } catch { return successorFailure('evidence-blocked'); }
  const details = (campaign === 'instrumented' || campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') ? createM602InstrumentedDiagnosticCollector() : undefined;
  let session: M602SuccessorObserverSession | undefined;
  if (caseLabel.startsWith('local-')) {
    const prepared = await prepareM602SuccessorObservers(observerEnvironment(dependencies, execution.applicationRevision!), dependencies?.signal, details?.onRuntime, (campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') ? 'm602-loading-observation-v2' : undefined);
    if (!prepared.ok) return prepared; session = prepared.session;
  }
  let cleanup = noSuccessorResources;
  try {
    // Baseline must precede exclusive entry even when both occur in the same clock millisecond.
    if (session && Date.now() <= Date.parse(session.gpuBefore.observedAt)) await new Promise<void>(resolve => setTimeout(resolve, 1));
    assert.ok(!dependencies?.signal?.aborted);
    // Awaited observer preparation must not carry stale qualification into case consumption.
    const current = observedContext(caseLabel, campaign, dependencies, 'execute');
    assert.equal(observedQualification(current).sha256, qualified.sha256);
    const source = await executeSource(caseLabel, dependencies, execution, execution.version, session?.observers,
      { campaign: execution.campaign, campaignManifestSha256: execution.campaignManifestSha256, qualificationSha256: qualified.sha256 }, details?.onCandidate);
    cleanup = session ? await session.close() : noSuccessorResources;
    const result = source.result as ObservedResult;
    const observation = (campaign === 'reasoning' ? validateReasoningObservation : campaign === 'prompt' ? validatePromptObservation : campaign === 'repaired' ? validateRepairedObservation : campaign === 'instrumented' ? validateInstrumentedObservation : campaign === 'completion' ? validateCompletionObservation : validateSuccessorObservation)({ version: `m602-${campaign}-observation-v1`, campaign: execution.campaign,
      caseLabel, campaignManifestSha256: execution.campaignManifestSha256, qualificationSha256: qualified.sha256,
      producerCodeSha256: source.entered.codeSha256, enteredSha256: source.enteredSha256, dispatchSha256: source.dispatchSha256,
      resultSha256: source.resultSha256, diagnostic: source.diagnostic, timing: source.timing,
      samples: session ? session.samples(source.timing) : null, cleanup,
      ...(details ? { details: reconcileInstrumentedDetails(details.close(), source.timing) } : {}) }, {
      caseLabel, campaignManifestSha256: execution.campaignManifestSha256, qualificationSha256: qualified.sha256,
      producerCodeSha256: source.entered.codeSha256, enteredSha256: source.enteredSha256,
      dispatchSha256: source.dispatchSha256, resultSha256: source.resultSha256 }, source.entered.enteredAt);
    validateFollowup({ version: 'm602-followup-v1', caseLabel, producerCodeSha256: source.entered.codeSha256,
      manifestSha256: source.entered.manifestSha256, enteredSha256: source.enteredSha256, dispatchSha256: source.dispatchSha256,
      resultSha256: source.resultSha256, diagnostic: source.diagnostic, observation: source.timing }, result, source.expectedWire);
    if ('details' in observation) validateInstrumentedDetails(observation.details, observation, result);
    const observationSha256 = publish(path.join(execution.root, caseLabel), 'observation.json', observation, execution.filesystem);
    return freeze({ ok: true, result, observation, observationSha256 });
  } catch { return successorFailure('evidence-publication', session ? await session.close() : cleanup); }
  finally { if (session) await session.close(); }
}

type ObservedSuccess<R, O> = { readonly ok: true; readonly result: R; readonly observation: O; readonly observationSha256: string };
type ObservedRead<R, O, A> = (ObservedSuccess<R, O> & { readonly assessment: A | null }) | { readonly ok: false; readonly error: 'evidence-blocked' };

export async function qualifyM602SuccessorObservers(dependencies?: M602SuccessorDependencies):
  Promise<{ readonly ok: true; readonly qualification: M602SuccessorQualification; readonly sha256: string } | M602SuccessorFailure> {
  return qualifyObserved('successor', dependencies) as ReturnType<typeof qualifyM602SuccessorObservers>;
}
export async function qualifyM602CompletionObservers(dependencies?: M602CompletionDependencies):
  Promise<{ readonly ok: true; readonly qualification: M602CompletionQualification; readonly sha256: string } | M602SuccessorFailure> {
  return qualifyObserved('completion', dependencies) as ReturnType<typeof qualifyM602CompletionObservers>;
}
export async function readM602SuccessorCase(caseLabel: M602CaseLabel, dependencies?: M602SuccessorDependencies):
  Promise<ObservedRead<M602SuccessorResult, M602SuccessorObservation, M602SuccessorAssessment>> {
  return readObserved(caseLabel, 'successor', dependencies) as ReturnType<typeof readM602SuccessorCase>;
}
export async function readM602CompletionCase(caseLabel: M602CaseLabel, dependencies?: M602CompletionDependencies):
  Promise<ObservedRead<M602CompletionResult, M602CompletionObservation, M602CompletionAssessment>> {
  return readObserved(caseLabel, 'completion', dependencies) as ReturnType<typeof readM602CompletionCase>;
}
export async function executeM602SuccessorCase(caseLabel: M602CaseLabel, dependencies?: M602SuccessorDependencies):
  Promise<ObservedSuccess<M602SuccessorResult, M602SuccessorObservation> | M602SuccessorFailure> {
  return executeObserved(caseLabel, 'successor', dependencies) as ReturnType<typeof executeM602SuccessorCase>;
}
export async function executeM602CompletionCase(caseLabel: M602CaseLabel, dependencies?: M602CompletionDependencies):
  Promise<ObservedSuccess<M602CompletionResult, M602CompletionObservation> | M602SuccessorFailure> {
  return executeObserved(caseLabel, 'completion', dependencies) as ReturnType<typeof executeM602CompletionCase>;
}

export async function qualifyM602InstrumentedObservers(dependencies?: M602InstrumentedDependencies):
  Promise<{ readonly ok: true; readonly qualification: M602InstrumentedQualification; readonly sha256: string } | M602SuccessorFailure> {
  return qualifyObserved('instrumented', dependencies) as ReturnType<typeof qualifyM602InstrumentedObservers>;
}
export async function readM602InstrumentedCase(caseLabel: M602CaseLabel, dependencies?: M602InstrumentedDependencies):
  Promise<ObservedRead<M602InstrumentedResult, M602InstrumentedObservation, M602InstrumentedAssessment>> {
  return readObserved(caseLabel, 'instrumented', dependencies) as ReturnType<typeof readM602InstrumentedCase>;
}
export async function executeM602InstrumentedCase(caseLabel: M602CaseLabel, dependencies?: M602InstrumentedDependencies):
  Promise<ObservedSuccess<M602InstrumentedResult, M602InstrumentedObservation> | M602SuccessorFailure> {
  return executeObserved(caseLabel, 'instrumented', dependencies) as ReturnType<typeof executeM602InstrumentedCase>;
}

export async function qualifyM602RepairedObservers(dependencies?: M602RepairedDependencies):
  Promise<{ readonly ok: true; readonly qualification: M602RepairedQualification; readonly sha256: string } | M602SuccessorFailure> {
  return qualifyObserved('repaired', dependencies) as ReturnType<typeof qualifyM602RepairedObservers>;
}
export async function readM602RepairedCase(caseLabel: M602CaseLabel, dependencies?: M602RepairedDependencies):
  Promise<ObservedRead<M602RepairedResult, M602RepairedObservation, M602RepairedAssessment>> {
  return readObserved(caseLabel, 'repaired', dependencies) as ReturnType<typeof readM602RepairedCase>;
}
export async function executeM602RepairedCase(caseLabel: M602CaseLabel, dependencies?: M602RepairedDependencies):
  Promise<ObservedSuccess<M602RepairedResult, M602RepairedObservation> | M602SuccessorFailure> {
  return executeObserved(caseLabel, 'repaired', dependencies) as ReturnType<typeof executeM602RepairedCase>;
}

export async function qualifyM602PromptObservers(dependencies?: M602PromptDependencies):
  Promise<{ readonly ok: true; readonly qualification: M602PromptQualification; readonly sha256: string } | M602SuccessorFailure> {
  return qualifyObserved('prompt', dependencies) as ReturnType<typeof qualifyM602PromptObservers>;
}
export async function readM602PromptCase(caseLabel: M602CaseLabel, dependencies?: M602PromptDependencies):
  Promise<ObservedRead<M602PromptResult, M602PromptObservation, M602PromptAssessment>> {
  return readObserved(caseLabel, 'prompt', dependencies) as ReturnType<typeof readM602PromptCase>;
}
export async function executeM602PromptCase(caseLabel: M602CaseLabel, dependencies?: M602PromptDependencies):
  Promise<ObservedSuccess<M602PromptResult, M602PromptObservation> | M602SuccessorFailure> {
  return executeObserved(caseLabel, 'prompt', dependencies) as ReturnType<typeof executeM602PromptCase>;
}

export async function qualifyM602ReasoningObservers(dependencies?: M602ReasoningDependencies):
  Promise<{ readonly ok: true; readonly qualification: M602ReasoningQualification; readonly sha256: string } | M602SuccessorFailure> {
  return qualifyObserved('reasoning', dependencies) as ReturnType<typeof qualifyM602ReasoningObservers>;
}
export async function readM602ReasoningCase(caseLabel: M602CaseLabel, dependencies?: M602ReasoningDependencies):
  Promise<(ObservedSuccess<M602ReasoningResult, M602ReasoningObservation> & { readonly assessment: M602ReasoningAssessment | null; readonly eligibleForContinuation: boolean }) | { readonly ok: false; readonly error: 'evidence-blocked' }> {
  return readObserved(caseLabel, 'reasoning', dependencies) as ReturnType<typeof readM602ReasoningCase>;
}
export async function executeM602ReasoningCase(caseLabel: M602CaseLabel, dependencies?: M602ReasoningDependencies):
  Promise<ObservedSuccess<M602ReasoningResult, M602ReasoningObservation> | M602SuccessorFailure> {
  return executeObserved(caseLabel, 'reasoning', dependencies) as ReturnType<typeof executeM602ReasoningCase>;
}
