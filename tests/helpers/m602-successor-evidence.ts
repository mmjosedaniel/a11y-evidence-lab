import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hash, json, ordinary, type EvidenceFilesystem } from './m602-evidence-files.ts';
import type { M602Assessment, M602Result, M602FollowupReport } from './m602-operation.ts';
import type { M602CaseLabel, M602PackageEnvironment } from './m602-package.ts';
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
  successorClosed(value, ['digest', 'contextLength', 'sizeBytes', 'sizeVramBytes']);
  assert.equal(QWEN_CONFIGURATION.binding.kind, 'local');
  if (QWEN_CONFIGURATION.binding.kind !== 'local') throw new Error('Local binding');
  assert.equal(value.digest, QWEN_CONFIGURATION.binding.modelDigest); assert.equal(value.contextLength, 32768);
  successorNatural(value.sizeBytes); successorNatural(value.sizeVramBytes);
  assert.ok(value.sizeBytes > 0 && value.sizeVramBytes <= value.sizeBytes);
}
export function validateGpuSample(value: unknown): asserts value is GpuSample {
  successorClosed(value, ['usedMiB', 'freeMiB']); successorNatural(value.usedMiB); successorNatural(value.freeMiB);
}
export function validateSuccessorCleanup(value: unknown): asserts value is M602SuccessorCleanup {
  successorClosed(value, Object.keys(noSuccessorResources));
  for (const state of Object.values(value)) assert.ok(['complete', 'uncertain', 'not-created'].includes(state));
}
export function successorBuild(root: string | undefined, filesystem: EvidenceFilesystem) {
  return buildPaths.map((relative, index) => {
    const target = path.join(root === undefined ? path.join(repository, 'dist/client') : path.join(root, 'client'), relative);
    ordinary(target, filesystem, true); const sha256 = hash(filesystem.readFileSync(target));
    if (root === undefined) assert.equal(sha256, buildHashes[index]);
    return Object.freeze({ path: relative, sha256 });
  });
}
export function loadSuccessorManifest(inputHash: string, environment?: M602PackageEnvironment): string {
  const target = path.join(repository, 'evaluation/m602-successor-v1.json'); ordinary(target, fs, true);
  const fixed = fs.readFileSync(target); assert.equal(hash(fixed), successorManifestHash);
  const expected = JSON.parse(fixed.toString('utf8'));
  expected.inputDefinition.sha256 = inputHash;
  const bytes = environment === undefined ? fixed : environment.readBytes('evaluation/m602-successor-v1.json');
  assert.deepEqual(Buffer.from(bytes), json(expected));
  const sha256 = hash(bytes); assert.equal(sha256, environment?.manifestSha256 ?? successorManifestHash);
  return sha256;
}
export function validateSuccessorQualification(value: unknown, identities: {
  campaignManifestSha256: string; manifestSha256: string; producerCodeSha256: string;
  applicationRevision?: string; build: M602SuccessorQualification['build'];
}): M602SuccessorQualification {
  successorClosed(value, ['version', 'campaign', 'qualifiedAt', 'campaignManifestSha256', 'manifestSha256', 'producerCodeSha256',
    'applicationRevision', 'nodeVersion', 'browserVersion', 'build', 'ui', 'gpu', 'cleanup']);
  assert.equal(value.version, 'm602-successor-qualification-v1'); assert.equal(value.campaign, successorCampaign);
  successorInstant(value.qualifiedAt);
  for (const key of ['campaignManifestSha256', 'manifestSha256', 'producerCodeSha256'] as const) assert.equal(value[key], identities[key]);
  assert.match(value.applicationRevision, /^[0-9a-f]{40}$/u);
  if (identities.applicationRevision !== undefined) assert.equal(value.applicationRevision, identities.applicationRevision);
  assert.equal(value.nodeVersion, 'v24.20.0'); assert.equal(value.browserVersion, '151.0.7922.34');
  assert.deepEqual(value.build, identities.build); assert.equal(value.ui, true); assert.equal(value.gpu, true);
  assert.deepEqual(value.cleanup, { ui: 'complete', runtime: 'not-created', gpu: 'complete', application: 'complete', browser: 'complete', scratch: 'complete' });
  return successorFreeze(value as M602SuccessorQualification);
}
export function validateSuccessorObservation(value: unknown, expected: Omit<M602SuccessorObservation, 'version' | 'campaign' | 'samples' | 'cleanup' | 'diagnostic' | 'timing'>,
  enteredAt: string): M602SuccessorObservation {
  successorClosed(value, ['version', 'campaign', 'caseLabel', 'campaignManifestSha256', 'qualificationSha256', 'producerCodeSha256',
    'enteredSha256', 'dispatchSha256', 'resultSha256', 'diagnostic', 'timing', 'samples', 'cleanup']);
  assert.equal(value.version, 'm602-successor-observation-v1'); assert.equal(value.campaign, successorCampaign);
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
export function successorObservationQualified(value: M602SuccessorObservation): boolean {
  if (value.diagnostic.integrity !== 'complete') return false;
  if (value.samples === null) return Object.values(value.cleanup).every(state => state === 'not-created');
  return ['ui', 'runtime', 'gpu'].every(kind => value.timing[kind as 'ui'].status === 'completed')
    && Object.values(value.cleanup).every(state => state === 'complete');
}
export function validateSuccessorProjection(assessment: M602SuccessorAssessment, observation: M602SuccessorObservation, sha256: string): void {
  assert.equal(assessment.observationSha256, sha256);
  if (observation.samples === null) assert.equal(assessment.localObservation, null);
  else if (assessment.localObservation !== null) {
    const samples = observation.samples, local = assessment.localObservation;
    assert.ok(samples.ui && samples.runtime && samples.gpuDuring);
    assert.deepEqual(local, { ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
      runtime: { observedAt: observation.timing.runtime.finishedAt, ...samples.runtime }, gpuBefore: samples.gpuBefore,
      gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...samples.gpuDuring }, oomObserved: local.oomObserved });
  }
  if (assessment.accepted) assert.ok(successorObservationQualified(observation));
}
