import type { M602InstrumentedDetails } from './m602-instrumented-diagnostics.ts';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hash, json, ordinary, type EvidenceFilesystem } from './m602-evidence-files.ts';
import type { M602Assessment, M602Result, M602FollowupReport } from './m602-operation.ts';
import { loadM602ReasoningPackage, loadM602PromptPackage, loadM602RepairedPackage, type M602CaseLabel, type M602PackageEnvironment } from './m602-package.ts';
import { QWEN_CONFIGURATION } from '../../src/server/generation/ollama-generation-model.ts';

export type M602SuccessorResult = Omit<M602Result, 'version'> & { readonly version: 'm602-successor-evidence-v1' };
export type M602SuccessorAssessment = Omit<M602Assessment, 'version'> & {
  readonly version: 'm602-successor-evidence-v1'; readonly observationSha256: string;
};
export type M602SuccessorCleanup = Readonly<Record<'ui' | 'runtime' | 'gpu' | 'application' | 'browser' | 'scratch',
  'complete' | 'uncertain' | 'not-created'>>;
export type M602SuccessorFailure = Readonly<{ ok: false; error: 'evidence-blocked' | 'evidence-publication' | 'observer-readiness'; cleanup: M602SuccessorCleanup }>;
export type GpuSample = Readonly<{ usedMiB: number; freeMiB: number }>;
export type RuntimeSample = Readonly<{ digest: string; contextLength: number; sizeBytes: number; sizeVramBytes: number }>;
export type RuntimeFailureCode = 'transport-lifecycle' | 'http-metadata' | 'body-limit' | 'encoding-json'
  | 'target-cardinality' | 'digest' | 'context' | 'memory';
export class RuntimeSampleFailure extends Error {
  readonly code: RuntimeFailureCode;
  constructor(code: RuntimeFailureCode) { super('Runtime sample validation failed'); this.code = code; }
}
export type UiSample = Readonly<{ textboxFocused: true; radioChanged: true; radioChecked: true }>;
export type M602SuccessorSamples = Readonly<{ gpuBefore: GpuSample & { readonly observedAt: string };
  ui: UiSample | null; runtime: RuntimeSample | null; gpuDuring: GpuSample | null }> | null;
export type M602SuccessorObservation = Readonly<{
  version: 'm602-successor-observation-v1'; campaign: 'm602-successor-v1'; caseLabel: M602CaseLabel;
  campaignManifestSha256: string; qualificationSha256: string; producerCodeSha256: string;
  enteredSha256: string; dispatchSha256: string | null; resultSha256: string;
  diagnostic: M602FollowupReport['diagnostic']; timing: M602FollowupReport['observation'];
  samples: M602SuccessorSamples; cleanup: M602SuccessorCleanup;
}>;
export type M602SuccessorQualification = Readonly<{
  version: 'm602-successor-qualification-v1'; campaign: 'm602-successor-v1'; qualifiedAt: string;
  campaignManifestSha256: string; manifestSha256: string; producerCodeSha256: string;
  applicationRevision: string; nodeVersion: string; browserVersion: string;
  build: readonly Readonly<{ path: string; sha256: string }>[]; ui: true; gpu: true; cleanup: M602SuccessorCleanup;
}>;
export type M602CompletionResult = Omit<M602SuccessorResult, 'version'> & { readonly version: 'm602-completion-evidence-v1' };
export type M602CompletionAssessment = Omit<M602SuccessorAssessment, 'version'> & { readonly version: 'm602-completion-evidence-v1' };
export type M602CompletionObservation = Omit<M602SuccessorObservation, 'version' | 'campaign'> & {
  readonly version: 'm602-completion-observation-v1'; readonly campaign: 'm602-completion-v1';
};
export type M602CompletionQualification = Omit<M602SuccessorQualification, 'version' | 'campaign'> & {
  readonly version: 'm602-completion-qualification-v1'; readonly campaign: 'm602-completion-v1';
};
export type ObservedCampaign = 'successor' | 'completion' | 'instrumented' | 'repaired' | 'prompt' | 'reasoning';
export type M602InstrumentedResult = Omit<M602SuccessorResult, 'version'> & { readonly version: 'm602-instrumented-evidence-v1' };
export type M602InstrumentedAssessment = Omit<M602SuccessorAssessment, 'version'> & { readonly version: 'm602-instrumented-evidence-v1' };
export type M602InstrumentedObservation = Omit<M602SuccessorObservation, 'version' | 'campaign'> & {
  readonly version: 'm602-instrumented-observation-v1'; readonly campaign: 'm602-instrumented-v1';
  readonly details: M602InstrumentedDetails;
};
export type M602InstrumentedQualification = Omit<M602SuccessorQualification, 'version' | 'campaign'> & {
  readonly version: 'm602-instrumented-qualification-v1'; readonly campaign: 'm602-instrumented-v1';
};
export type M602RepairedResult = Omit<M602InstrumentedResult, 'version'> & { readonly version: 'm602-repaired-evidence-v1' };
export type M602RepairedAssessment = Omit<M602InstrumentedAssessment, 'version'> & { readonly version: 'm602-repaired-evidence-v1' };
export type M602RepairedObservation = Omit<M602InstrumentedObservation, 'version' | 'campaign'> & {
  readonly version: 'm602-repaired-observation-v1'; readonly campaign: 'm602-repaired-v1';
};
export type M602RepairedQualification = Omit<M602InstrumentedQualification, 'version' | 'campaign'> & {
  readonly version: 'm602-repaired-qualification-v1'; readonly campaign: 'm602-repaired-v1'; readonly runtime: 'not-exercised';
};
export const repairedCampaign = 'm602-repaired-v1' as const;
export const repairedVersion = 'm602-repaired-evidence-v1' as const;
const repairedManifestHash = '9f8c326fbe2adf26239db4f32796973b9e756bf88f9fa81bb6f8264f809524d1';
export type M602PromptResult = Omit<M602InstrumentedResult, 'version'> & { readonly version: 'm602-prompt-evidence-v1' };
export type M602PromptAssessment = Omit<M602InstrumentedAssessment, 'version'> & { readonly version: 'm602-prompt-evidence-v1' };
export type M602PromptObservation = Omit<M602InstrumentedObservation, 'version' | 'campaign'> & {
  readonly version: 'm602-prompt-observation-v1'; readonly campaign: 'm602-prompt-v1';
};
export type M602PromptQualification = Omit<M602InstrumentedQualification, 'version' | 'campaign'> & {
  readonly version: 'm602-prompt-qualification-v1'; readonly campaign: 'm602-prompt-v1'; readonly runtime: 'not-exercised';
};
export const promptCampaign = 'm602-prompt-v1' as const;
export const promptVersion = 'm602-prompt-evidence-v1' as const;
const promptManifestHash = 'd6e5767e82b51531b9fb1a823d38ac0fa1684c21764cef2eb7cf162e53afa15d';
export type M602ReasoningResult = Omit<M602InstrumentedResult, 'version'> & { readonly version: 'm602-reasoning-evidence-v1' };
export type M602ReasoningAssessment = Omit<M602InstrumentedAssessment, 'version'> & { readonly version: 'm602-reasoning-evidence-v1' };
export type M602ReasoningObservation = Omit<M602InstrumentedObservation, 'version' | 'campaign'> & {
  readonly version: 'm602-reasoning-observation-v1'; readonly campaign: 'm602-reasoning-v1';
};
export type M602ReasoningQualification = Omit<M602InstrumentedQualification, 'version' | 'campaign'> & {
  readonly version: 'm602-reasoning-qualification-v1'; readonly campaign: 'm602-reasoning-v1'; readonly runtime: 'not-exercised';
};
export const reasoningCampaign = 'm602-reasoning-v1' as const;
export const reasoningVersion = 'm602-reasoning-evidence-v1' as const;
const reasoningManifestHash = 'da8aa75e9f59818fb1edcf11e939032070a44b3e5ae4d716a709cc8b3462b388';
export const instrumentedCampaign = 'm602-instrumented-v1' as const;
export const instrumentedVersion = 'm602-instrumented-evidence-v1' as const;
const instrumentedManifestHash = '4c43e9ef29a9e8d1c2400db1eea8ce89218ca6227adb6afde3406d9c160079fa';
export const completionCampaign = 'm602-completion-v1' as const;
export const completionVersion = 'm602-completion-evidence-v1' as const;
const completionManifestHash = 'f3e997cb27d6238673de2a64510268a470f51ca078321cb955bb34b8f429ede2';
export const successorCampaign = 'm602-successor-v1' as const;
export const successorVersion = 'm602-successor-evidence-v1' as const;
export const successorManifestHash = '5ca8c1798647f3b949d016441f30d3c7d1f0055c4a55dabd574836d024513276';
export const noSuccessorResources: M602SuccessorCleanup = Object.freeze({ ui: 'not-created', runtime: 'not-created',
  gpu: 'not-created', application: 'not-created', browser: 'not-created', scratch: 'not-created' });
const repository = path.resolve(import.meta.dirname, '../..');
const buildPaths = ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-C7OtU_Ke.js'];
const buildHashes = ['d9e773ca23458f1bd97d6e1604ab2a01e706d06c730d84c214e130682f9de5ab',
  '4962722f0d6585b7c3e2c0b232e6617161829991988b859d12f8f8c10c48cbfa',
  '7f0e352a8563423b7f4485599192ba63adc5a812fb8f1f744ddca0c09e7a085d'];
type RecordValue = Record<string, any>;
export function successorClosed(value: unknown, keys: readonly string[]): asserts value is RecordValue {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort());
}
export function successorFreeze<T>(value: T): T {
  if (value && typeof value === 'object') { for (const child of Object.values(value)) successorFreeze(child); Object.freeze(value); }
  return value;
}
export function successorInstant(value: unknown): number {
  assert.equal(typeof value, 'string'); const time = Date.parse(value as string);
  assert.ok(Number.isFinite(time) && new Date(time).toISOString() === value); return time;
}
export function successorNatural(value: unknown): asserts value is number {
  assert.ok(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0);
}
export function validateRuntimeSample(value: unknown): asserts value is RuntimeSample {
  let code: RuntimeFailureCode = 'encoding-json';
  try {
    successorClosed(value, ['digest', 'contextLength', 'sizeBytes', 'sizeVramBytes']);
    code = 'digest';
    assert.equal(QWEN_CONFIGURATION.binding.kind, 'local');
    if (QWEN_CONFIGURATION.binding.kind !== 'local') throw new Error('Local binding');
    assert.equal(value.digest, QWEN_CONFIGURATION.binding.modelDigest);
    code = 'context'; assert.equal(value.contextLength, 32768);
    code = 'memory';
    successorNatural(value.sizeBytes); successorNatural(value.sizeVramBytes);
    assert.ok(value.sizeBytes > 0 && value.sizeVramBytes <= value.sizeBytes);
  } catch { throw new RuntimeSampleFailure(code); }
}
export function validateGpuSample(value: unknown): asserts value is GpuSample {
  successorClosed(value, ['usedMiB', 'freeMiB']); successorNatural(value.usedMiB); successorNatural(value.freeMiB);
}
export function validateSuccessorCleanup(value: unknown): asserts value is M602SuccessorCleanup {
  successorClosed(value, Object.keys(noSuccessorResources));
  for (const state of Object.values(value)) assert.ok(['complete', 'uncertain', 'not-created'].includes(state));
}
export function successorBuild(root: string | undefined, filesystem: EvidenceFilesystem) {
  return observedBuild(root, filesystem, 'successor');
}
export function instrumentedBuild(root: string | undefined, filesystem: EvidenceFilesystem) {
  return observedBuild(root, filesystem, 'instrumented');
}
export function repairedBuild(root: string | undefined, filesystem: EvidenceFilesystem) {
  return observedBuild(root, filesystem, 'repaired');
}
export function promptBuild(root: string | undefined, filesystem: EvidenceFilesystem) {
  return observedBuild(root, filesystem, 'prompt');
}
export function reasoningBuild(root: string | undefined, filesystem: EvidenceFilesystem) {
  return observedBuild(root, filesystem, 'reasoning');
}
function observedBuild(root: string | undefined, filesystem: EvidenceFilesystem, campaign: ObservedCampaign) {
  const paths = campaign === 'reasoning' ? ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-HAXqw7F5.js'] : campaign === 'prompt' ? ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-BT7UcryN.js'] : campaign === 'repaired' ? ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-Bdo3BCH2.js'] : campaign === 'instrumented' ? ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-BRf9Pkds.js'] : buildPaths;
  const hashes = campaign === 'reasoning' ? ['bedf97b3deb9a5578038f22738e71153d42241e4765738527155e19b1236ff73', '4962722f0d6585b7c3e2c0b232e6617161829991988b859d12f8f8c10c48cbfa', '49f6a89f21d02a570be784c383e18f8caf436c2e124789ef7c2a2dc8920df134'] : campaign === 'prompt' ? ['9ae3d4fc9dc8c93102bf36421a082ff11a4aede70ec36559692d44feb4f68fa5', '4962722f0d6585b7c3e2c0b232e6617161829991988b859d12f8f8c10c48cbfa', '5e39a36cd25ce65441e9efde98486d930f491ce96e1e3f6c17cb9648709409e8'] : campaign === 'repaired' ? ['72a74e3dfd921f4c8baebe97b1c03f116eb23e267476012e895c75e13a701cec',
    '4962722f0d6585b7c3e2c0b232e6617161829991988b859d12f8f8c10c48cbfa',
    '87fbfb1e6cef25f21aaa7c2983b719fdf69677f1b30931b4eb5e15e34d8731fe'] : campaign === 'instrumented' ? ['760427ef49b0076e87904e6958939b036dd4214fb015f7a5faba0f925684f45b',
    '4962722f0d6585b7c3e2c0b232e6617161829991988b859d12f8f8c10c48cbfa',
    'fd41f2e6973d0b8004e7e9c393747fbca386a6f56fb890a215fc3767ab435480'] : buildHashes;
  return paths.map((relative, index) => {
    const target = path.join(root === undefined ? path.join(repository, 'dist/client') : path.join(root, 'client'), relative);
    ordinary(target, filesystem, true); const sha256 = hash(filesystem.readFileSync(target));
    if (root === undefined) assert.equal(sha256, hashes[index]);
    return Object.freeze({ path: relative, sha256 });
  });
}
function loadObservedManifest(campaign: ObservedCampaign, inputHash: string, environment?: M602PackageEnvironment, packageEnvironment?: M602PackageEnvironment): string {
  const relative = `evaluation/m602-${campaign}-v1.json`;
  const expectedHash = campaign === 'reasoning' ? reasoningManifestHash : campaign === 'prompt' ? promptManifestHash : campaign === 'repaired' ? repairedManifestHash : campaign === 'instrumented' ? instrumentedManifestHash : campaign === 'completion' ? completionManifestHash : successorManifestHash;
  const target = path.join(repository, relative); ordinary(target, fs, true);
  const fixed = fs.readFileSync(target); assert.equal(hash(fixed), expectedHash);
  const expected = JSON.parse(fixed.toString('utf8'));
  expected.inputDefinition.sha256 = inputHash;
  if (campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') {
    assert.equal(environment === undefined, packageEnvironment === undefined);
    const labels: M602CaseLabel[] = ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'];
    const packages = labels.map(label => {
      const loaded = (campaign === 'reasoning' ? loadM602ReasoningPackage : campaign === 'prompt' ? loadM602PromptPackage : loadM602RepairedPackage)(label, packageEnvironment);
      assert.ok(loaded.status === 'ready');
      assert.equal(loaded.value.identities.manifestSha256, inputHash);
      return loaded.value;
    });
    expected.schemaPolicy.schemas = ['informative-image-alt', 'form-input-label', 'text-contrast'].map((profile, index) =>
      ({ profile, sha256: packages[index].caseSchemaSha256 }));
    expected.schemaPolicy.wireBindings = packages.map(pkg => ({ caseLabel: pkg.caseLabel, bytes: pkg.wire.bytes, sha256: pkg.wire.sha256 }));
  }
  const bytes = environment === undefined ? fixed : environment.readBytes(relative);
  assert.deepEqual(Buffer.from(bytes), json(expected));
  const sha256 = hash(bytes); assert.equal(sha256, environment?.manifestSha256 ?? expectedHash);
  return sha256;
}
function validateObservedQualification(campaign: ObservedCampaign, value: unknown, identities: {
  campaignManifestSha256: string; manifestSha256: string; producerCodeSha256: string;
  applicationRevision?: string; build: M602SuccessorQualification['build'];
}): M602SuccessorQualification | M602CompletionQualification | M602InstrumentedQualification | M602RepairedQualification | M602PromptQualification | M602ReasoningQualification {
  successorClosed(value, ['version', 'campaign', 'qualifiedAt', 'campaignManifestSha256', 'manifestSha256', 'producerCodeSha256',
    'applicationRevision', 'nodeVersion', 'browserVersion', 'build', 'ui', 'gpu', 'cleanup', ...((campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') ? ['runtime'] : [])]);
  if (campaign === 'repaired' || campaign === 'prompt' || campaign === 'reasoning') assert.equal(value.runtime, 'not-exercised');
  assert.equal(value.version, `m602-${campaign}-qualification-v1`);
  assert.equal(value.campaign, `m602-${campaign}-v1`);
  successorInstant(value.qualifiedAt);
  for (const key of ['campaignManifestSha256', 'manifestSha256', 'producerCodeSha256'] as const) assert.equal(value[key], identities[key]);
  assert.match(value.applicationRevision, /^[0-9a-f]{40}$/u);
  if (identities.applicationRevision !== undefined) assert.equal(value.applicationRevision, identities.applicationRevision);
  assert.equal(value.nodeVersion, 'v24.20.0'); assert.equal(value.browserVersion, '151.0.7922.34');
  assert.deepEqual(value.build, identities.build); assert.equal(value.ui, true); assert.equal(value.gpu, true);
  assert.deepEqual(value.cleanup, { ui: 'complete', runtime: 'not-created', gpu: 'complete', application: 'complete', browser: 'complete', scratch: 'complete' });
  return successorFreeze(value as M602SuccessorQualification);
}
function validateObservedObservation(campaign: ObservedCampaign, value: unknown, expected: Omit<M602SuccessorObservation, 'version' | 'campaign' | 'samples' | 'cleanup' | 'diagnostic' | 'timing'>,
  enteredAt: string): M602SuccessorObservation | M602CompletionObservation | M602InstrumentedObservation | M602RepairedObservation | M602PromptObservation | M602ReasoningObservation {
  successorClosed(value, ['version', 'campaign', 'caseLabel', 'campaignManifestSha256', 'qualificationSha256', 'producerCodeSha256',
    'enteredSha256', 'dispatchSha256', 'resultSha256', 'diagnostic', 'timing', 'samples', 'cleanup', ...(['instrumented', 'repaired', 'prompt', 'reasoning'].includes(campaign) ? ['details'] : [])]);
  assert.equal(value.version, `m602-${campaign}-observation-v1`);
  assert.equal(value.campaign, `m602-${campaign}-v1`);
  for (const [key, wanted] of Object.entries(expected)) assert.equal(value[key], wanted);
  validateSuccessorCleanup(value.cleanup);
  if (value.caseLabel.startsWith('groq-')) { assert.equal(value.samples, null); assert.deepEqual(value.cleanup, noSuccessorResources); }
  else {
    successorClosed(value.samples, ['gpuBefore', 'ui', 'runtime', 'gpuDuring']);
    successorClosed(value.samples.gpuBefore, ['observedAt', 'usedMiB', 'freeMiB']);
    assert.ok(successorInstant(value.samples.gpuBefore.observedAt) < successorInstant(enteredAt));
    validateGpuSample({ usedMiB: value.samples.gpuBefore.usedMiB, freeMiB: value.samples.gpuBefore.freeMiB });
    for (const [kind, key] of [['ui', 'ui'], ['runtime', 'runtime'], ['gpu', 'gpuDuring']] as const) {
      const sample: unknown = value.samples[key]; assert.equal(sample !== null, value.timing[kind].status === 'completed');
      if (sample === null) continue;
      if (kind === 'ui') assert.deepEqual(sample, { textboxFocused: true, radioChanged: true, radioChecked: true });
      else if (kind === 'runtime') validateRuntimeSample(sample); else validateGpuSample(sample);
    }
  }
  return successorFreeze(value as M602SuccessorObservation);
}
function observationQualified(value: M602SuccessorObservation | M602CompletionObservation | M602InstrumentedObservation | M602RepairedObservation | M602PromptObservation | M602ReasoningObservation): boolean {
  if (value.diagnostic.integrity !== 'complete' || ('details' in value && value.details.integrity !== 'complete')) return false;
  if (value.samples === null) return Object.values(value.cleanup).every(state => state === 'not-created');
  return ['ui', 'runtime', 'gpu'].every(kind => value.timing[kind as 'ui'].status === 'completed')
    && Object.values(value.cleanup).every(state => state === 'complete');
}
function validateObservedProjection(assessment: M602SuccessorAssessment | M602CompletionAssessment | M602InstrumentedAssessment | M602RepairedAssessment | M602PromptAssessment | M602ReasoningAssessment, observation: M602SuccessorObservation | M602CompletionObservation | M602InstrumentedObservation | M602RepairedObservation | M602PromptObservation | M602ReasoningObservation, sha256: string): void {
  assert.equal(assessment.observationSha256, sha256);
  if (observation.samples === null) assert.equal(assessment.localObservation, null);
  else if (assessment.localObservation !== null) {
    const samples = observation.samples, local = assessment.localObservation;
    assert.ok(samples.ui && samples.runtime && samples.gpuDuring);
    assert.deepEqual(local, { ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
      runtime: { observedAt: observation.timing.runtime.finishedAt, ...samples.runtime }, gpuBefore: samples.gpuBefore,
      gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...samples.gpuDuring }, oomObserved: local.oomObserved });
  }
  if (assessment.accepted) assert.ok(observationQualified(observation));
}

export function loadSuccessorManifest(inputHash: string, environment?: M602PackageEnvironment): string {
  return loadObservedManifest('successor', inputHash, environment);
}
export function loadCompletionManifest(inputHash: string, environment?: M602PackageEnvironment): string {
  return loadObservedManifest('completion', inputHash, environment);
}
export function validateSuccessorQualification(value: unknown, identities: Parameters<typeof validateObservedQualification>[2]): M602SuccessorQualification {
  return validateObservedQualification('successor', value, identities) as M602SuccessorQualification;
}
export function validateCompletionQualification(value: unknown, identities: Parameters<typeof validateObservedQualification>[2]): M602CompletionQualification {
  return validateObservedQualification('completion', value, identities) as M602CompletionQualification;
}
export function validateSuccessorObservation(value: unknown, expected: Parameters<typeof validateObservedObservation>[2], enteredAt: string): M602SuccessorObservation {
  return validateObservedObservation('successor', value, expected, enteredAt) as M602SuccessorObservation;
}
export function validateCompletionObservation(value: unknown, expected: Parameters<typeof validateObservedObservation>[2], enteredAt: string): M602CompletionObservation {
  return validateObservedObservation('completion', value, expected, enteredAt) as M602CompletionObservation;
}
export function successorObservationQualified(value: M602SuccessorObservation): boolean { return observationQualified(value); }
export function completionObservationQualified(value: M602CompletionObservation): boolean { return observationQualified(value); }
export function validateSuccessorProjection(assessment: M602SuccessorAssessment, observation: M602SuccessorObservation, sha256: string): void {
  validateObservedProjection(assessment, observation, sha256);
}
export function validateCompletionProjection(assessment: M602CompletionAssessment, observation: M602CompletionObservation, sha256: string): void {
  validateObservedProjection(assessment, observation, sha256);
}

export function loadInstrumentedManifest(inputHash: string, environment?: M602PackageEnvironment): string {
  return loadObservedManifest('instrumented', inputHash, environment);
}
export function validateInstrumentedQualification(value: unknown, identities: Parameters<typeof validateObservedQualification>[2]): M602InstrumentedQualification {
  return validateObservedQualification('instrumented', value, identities) as M602InstrumentedQualification;
}
export function validateInstrumentedObservation(value: unknown, expected: Parameters<typeof validateObservedObservation>[2], enteredAt: string): M602InstrumentedObservation {
  return validateObservedObservation('instrumented', value, expected, enteredAt) as M602InstrumentedObservation;
}
export function instrumentedObservationQualified(value: M602InstrumentedObservation): boolean { return observationQualified(value); }
export function validateInstrumentedProjection(assessment: M602InstrumentedAssessment, observation: M602InstrumentedObservation, sha256: string): void {
  validateObservedProjection(assessment, observation, sha256);
}

export function loadRepairedManifest(inputHash: string, environment?: M602PackageEnvironment, packageEnvironment?: M602PackageEnvironment): string {
  return loadObservedManifest('repaired', inputHash, environment, packageEnvironment);
}
export function validateRepairedQualification(value: unknown, identities: Parameters<typeof validateObservedQualification>[2]): M602RepairedQualification {
  return validateObservedQualification('repaired', value, identities) as M602RepairedQualification;
}
export function validateRepairedObservation(value: unknown, expected: Parameters<typeof validateObservedObservation>[2], enteredAt: string): M602RepairedObservation {
  return validateObservedObservation('repaired', value, expected, enteredAt) as M602RepairedObservation;
}
export function repairedObservationQualified(value: M602RepairedObservation): boolean { return observationQualified(value); }
export function validateRepairedProjection(assessment: M602RepairedAssessment, observation: M602RepairedObservation, sha256: string): void {
  validateObservedProjection(assessment, observation, sha256);
}

export function loadPromptManifest(inputHash: string, environment?: M602PackageEnvironment, packageEnvironment?: M602PackageEnvironment): string {
  return loadObservedManifest('prompt', inputHash, environment, packageEnvironment);
}
export function validatePromptQualification(value: unknown, identities: Parameters<typeof validateObservedQualification>[2]): M602PromptQualification {
  return validateObservedQualification('prompt', value, identities) as M602PromptQualification;
}
export function validatePromptObservation(value: unknown, expected: Parameters<typeof validateObservedObservation>[2], enteredAt: string): M602PromptObservation {
  return validateObservedObservation('prompt', value, expected, enteredAt) as M602PromptObservation;
}
export function promptObservationQualified(value: M602PromptObservation): boolean { return observationQualified(value); }
export function validatePromptProjection(assessment: M602PromptAssessment, observation: M602PromptObservation, sha256: string): void {
  validateObservedProjection(assessment, observation, sha256);
}

export function loadReasoningManifest(inputHash: string, environment?: M602PackageEnvironment, packageEnvironment?: M602PackageEnvironment): string {
  return loadObservedManifest('reasoning', inputHash, environment, packageEnvironment);
}
export function validateReasoningQualification(value: unknown, identities: Parameters<typeof validateObservedQualification>[2]): M602ReasoningQualification {
  return validateObservedQualification('reasoning', value, identities) as M602ReasoningQualification;
}
export function validateReasoningObservation(value: unknown, expected: Parameters<typeof validateObservedObservation>[2], enteredAt: string): M602ReasoningObservation {
  return validateObservedObservation('reasoning', value, expected, enteredAt) as M602ReasoningObservation;
}
export function reasoningObservationQualified(value: M602ReasoningObservation): boolean { return observationQualified(value); }
export function validateReasoningProjection(assessment: M602ReasoningAssessment, observation: M602ReasoningObservation, sha256: string): void {
  validateObservedProjection(assessment, observation, sha256);
}
