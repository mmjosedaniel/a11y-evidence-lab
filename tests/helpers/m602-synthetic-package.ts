import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { buildFindingAnalysis } from '../../src/server/domain/finding-analysis.ts';
import { assessFindingEvidence } from '../../src/server/domain/finding-sufficiency.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { readFinding } from '../../src/server/domain/run-contract/finding-validation.ts';
import { GENERATION_INSTRUCTIONS, GENERATION_SCHEMA } from '../../src/server/generation/generation-artifacts.ts';
import { classifyGuidanceSupport } from '../../src/server/retrieval/support-policy.ts';
import { SOURCE_NOTICES } from '../../src/server/retrieval/source-notices.ts';
import { buildCheckpointSeed } from './m204-checkpoint-fixture.ts';
import { retrievalResult } from './m202-retrieval-fixture.ts';

type JsonRecord = Record<string, any>;
type CaseId = 'G1' | 'G2' | 'G3';

const encoder = new TextEncoder();
const repository = path.resolve(import.meta.dirname, '../..');
const revision = 'a'.repeat(40);
const caseIds = ['G1', 'G2', 'G3'] as const;
const profiles = {
  G1: { suffix: 'informative-image-alt', missing: ['interpretation'], sourcePassages: ['wcag22-sc111', 'h37-text-alternative'] },
  G2: { suffix: 'form-input-label', missing: ['criterion'], sourcePassages: ['understanding412-intent', 'h44-explicit-label'] },
  G3: { suffix: 'text-contrast', missing: ['criterion'], sourcePassages: ['understanding143-threshold-measurement', 'g18-contrast-remediation'] },
} as const;

const jsonBytes = (value: unknown) => encoder.encode(`${JSON.stringify(value, null, 2)}\n`);
const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const upperSha256 = (bytes: Uint8Array) => sha256(bytes).toUpperCase();

function resolveReference(input: unknown, reference: string): unknown {
  let value = input as any;
  for (const part of reference.split('.')) value = value[part];
  return value && typeof value === 'object' && Object.keys(value).length === 1 && Object.hasOwn(value, 'value')
    ? value.value : value;
}

function nativeProjection(input: JsonRecord) {
  return readFinding({
    findingId: input.findingId,
    ruleId: input.ruleId,
    nativeResult: input.nativeResult,
    state: 'unprocessed',
    checks: input.checks,
    locator: input.locator,
    evidence: input.evidence,
  });
}

function canonicalSources(passages: readonly JsonRecord[], manifest: JsonRecord) {
  const selected: JsonRecord[] = [];
  for (const passage of passages) {
    if (selected.some(source => source.title === passage.sourceTitle)) continue;
    const source = manifest.sources.find((candidate: JsonRecord) => candidate.title === passage.sourceTitle);
    assert.ok(source, `Missing public source ${passage.sourceTitle}`);
    selected.push(Object.freeze({ title: source.title, type: source.type, url: source.url, status: source.status,
      version: source.version, copyright: source.copyright, attribution: source.attribution }));
  }
  return selected;
}

function sourceRun(caseId: CaseId, seed: ReturnType<typeof buildCheckpointSeed>, passageIds: readonly string[]) {
  const initial = seed.completed.scan.findings[0];
  assert.ok(initial.state === 'unprocessed');
  const retrieval = retrievalResult(seed.query, passageIds.map((passageId, index) => ({ passageId, score: 0.9 - index * 0.1 })));
  const support = classifyGuidanceSupport(initial, retrieval);
  assert.equal(support.ok, true);
  if (!support.ok) throw new Error(`${caseId} support fixture is invalid`);
  const startedAt = '2026-09-20T10:00:03.000Z';
  const finishedAt = '2026-09-20T10:00:04.000Z';
  const decision = buildFindingAnalysis(initial, startedAt, finishedAt, support.value);
  assert.equal(decision.state, 'abstained');
  const run = structuredClone(seed.completed) as JsonRecord;
  Object.assign(run.scan.findings[0], decision, { retrieval: {
    status: 'completed', startedAt, finishedAt, result: retrieval, support: support.value,
  } });
  const checked = validateRun(run);
  assert.equal(checked.ok, true);
  if (!checked.ok) throw new Error(`${caseId} source run is invalid`);
  return { run: checked.value as JsonRecord, support: support.value as JsonRecord };
}

export type SyntheticBundle = {
  readonly environment: { readonly manifestSha256: string; readonly readBytes: (relativePath: string) => Uint8Array };
  readonly files: ReadonlyMap<string, Uint8Array>;
  readonly manifest: JsonRecord;
  readonly inputText: ReadonlyMap<string, string>;
  readonly instructionText: string;
};

export function canonicalSyntheticBundle(): SyntheticBundle {
  const files = new Map<string, Uint8Array>();
  const manifestPath = 'evaluation/m301-generation-v1.json';
  const publicPaths = ['corpus/wcag22-mvp-v1/manifest.json', 'corpus/wcag22-mvp-v1/passages.json',
    'evaluation/m201-corpus-v1.json', 'evaluation/rd003-scan-v1.json'] as const;
  for (const relativePath of publicPaths) files.set(relativePath, fs.readFileSync(path.join(repository, relativePath)));
  const publicManifest = JSON.parse(Buffer.from(files.get(publicPaths[0])!).toString('utf8')) as JsonRecord;
  const publicPassages = JSON.parse(Buffer.from(files.get(publicPaths[1])!).toString('utf8')).passages as JsonRecord[];
  const publicGold = JSON.parse(Buffer.from(files.get(publicPaths[2])!).toString('utf8')) as JsonRecord;
  const publicScan = JSON.parse(Buffer.from(files.get(publicPaths[3])!).toString('utf8')) as JsonRecord;
  const manifest = JSON.parse(fs.readFileSync(path.join(repository, manifestPath), 'utf8')) as JsonRecord;
  const inputText = new Map<string, string>();
  for (const caseId of caseIds) {
    const definition = profiles[caseId];
    const caseDefinition = manifest.cases.find((entry: JsonRecord) => entry.caseId === definition.suffix);
    assert.ok(caseDefinition, caseId);
    const goldCase = publicGold.cases.find((entry: JsonRecord) => entry.profile === caseDefinition.caseId);
    const scanCase = publicScan.cases.find((entry: JsonRecord) => entry.profile === caseDefinition.caseId);
    assert.ok(goldCase && scanCase, caseId);
    assert.deepEqual({ fixtureRevision: goldCase.fixtureRevision, targetKey: goldCase.targetKey,
      ruleId: goldCase.ruleId, successCriterion: goldCase.successCriterion },
    { fixtureRevision: caseDefinition.fixtureRevision, targetKey: caseDefinition.targetKey,
      ruleId: caseDefinition.ruleId, successCriterion: caseDefinition.successCriterion }, caseId);
    assert.equal(caseDefinition.passageIds.every((passageId: string) => goldCase.goldPassageIds.includes(passageId)), true, caseId);
    assert.equal(scanCase.revision, caseDefinition.fixtureRevision, caseId);
    assert.equal(scanCase.targetKey, caseDefinition.targetKey, caseId);
    const seed = buildCheckpointSeed(caseId, revision);
    const seedPath = `temp/m204-retrieval-checkpoint/${caseId.toLowerCase()}/seed.json`;
    const seedBytes = jsonBytes(seed.completed);
    files.set(seedPath, seedBytes);
    const source = sourceRun(caseId, seed, definition.sourcePassages);
    assert.deepEqual(source.support.missingRoles, definition.missing, caseId);
    const sourcePath = caseDefinition.actualRetrievalObservation.sourcePath as string;
    const sourceBytes = jsonBytes(source.run);
    files.set(sourcePath, sourceBytes);
    const native = readFinding(seed.completed.scan.findings[0]);
    assert.deepEqual(nativeProjection(source.run.scan.findings[0]), native, `${caseId} source/native seed equality`);
    const assessment = assessFindingEvidence(native);
    assert.equal(assessment.state, 'complete', caseId);
    assert.deepEqual(assessment.availableReferences, caseDefinition.availableEvidenceReferences, caseId);
    const passages = caseDefinition.passageIds.map((passageId: string) => {
      const passage = publicPassages.find(entry => entry.passageId === passageId);
      assert.ok(passage, passageId);
      return passage;
    });
    assert.deepEqual(passages.map((entry: JsonRecord) => entry.guidanceRole), caseDefinition.passageOrder, caseId);
    const input = Object.freeze({ finding: Object.freeze({
      findingId: native.findingId, ruleId: native.ruleId, nativeResult: native.nativeResult,
      facts: Object.freeze(assessment.availableReferences.map(reference => Object.freeze({
        reference, value: resolveReference(native, reference),
      }))),
    }), guidance: Object.freeze({ corpusVersion: publicManifest.corpusVersion, passages: Object.freeze(passages),
      notices: Object.freeze({ sources: Object.freeze(canonicalSources(passages, publicManifest)), full: SOURCE_NOTICES }) }) });
    const inputBytes = jsonBytes(input);
    files.set(caseDefinition.input.path, inputBytes);
    inputText.set(definition.suffix, Buffer.from(inputBytes).toString('utf8'));
    caseDefinition.input.sha256 = upperSha256(inputBytes);
    const provenance = { version: 'm301-generation-v1', caseId: definition.suffix,
      evidenceOrigin: caseDefinition.evidenceOrigin, fixtureRevision: caseDefinition.fixtureRevision,
      targetKey: caseDefinition.targetKey, sourcePath, sourceSha256: upperSha256(sourceBytes),
      sourceRunId: source.run.runId, sourceWorkflowState: 'abstained', sourceProviderCalled: false,
      scanContext: source.run.scan.context, native, assessment,
      guidanceOrigin: caseDefinition.guidanceOrigin, support: 'supported' };
    const provenanceBytes = jsonBytes(provenance);
    files.set(caseDefinition.provenance.path, provenanceBytes);
    caseDefinition.provenance.sha256 = upperSha256(provenanceBytes);
    caseDefinition.actualRetrievalObservation = { state: 'abstained', missingRoles: source.support.missingRoles,
      providerCalled: false, sourcePath, sourceSha256: upperSha256(sourceBytes) };
  }
  const instructionText = `${GENERATION_INSTRUCTIONS}Synthetic authenticated evaluation instruction; preserve every supplied byte.\n`;
  const instructionBytes = encoder.encode(instructionText);
  const schemaBytes = jsonBytes(GENERATION_SCHEMA);
  const g1 = buildCheckpointSeed('G1', revision);
  const noCall = { version: 'm301-generation-v1', caseId: 'shared-incomplete-guidance',
    native: readFinding(g1.completed.scan.findings[0]), passageIds: ['wcag22-sc111', 'understanding111-intent'],
    expected: { support: 'incomplete', missingRoles: ['remediation'], reason: 'incomplete-guidance', providerCalled: false,
      providerInvocation: false, proposal: false, reviewDecision: false },
    explanation: 'Guidance is incomplete because the required remediation role is missing. No provider was called.',
    manualInvestigation: 'Inspect the available Finding evidence and canonical passages before generation.' };
  const noCallBytes = jsonBytes(noCall);
  for (const [binding, bytes] of [[manifest.shared.instructions, instructionBytes],
    [manifest.shared.outputSchema, schemaBytes], [manifest.shared.noCall, noCallBytes]] as const) {
    files.set(binding.path, bytes);
    binding.sha256 = upperSha256(bytes);
  }
  for (const execution of manifest.executions) {
    const caseDefinition = manifest.cases.find((entry: JsonRecord) => entry.caseId === execution.caseId);
    execution.inputSha256 = caseDefinition.input.sha256;
    execution.instructionSha256 = manifest.shared.instructions.sha256;
    execution.outputSchemaSha256 = manifest.shared.outputSchema.sha256;
  }
  assert.equal(manifest.cases.length, 3);
  assert.equal(manifest.executions.length, 6);
  assert.deepEqual(manifest.executions.map((entry: JsonRecord) => `${entry.mode}-${entry.caseId}`), [
    'local-informative-image-alt', 'groq-informative-image-alt', 'local-form-input-label',
    'groq-form-input-label', 'local-text-contrast', 'groq-text-contrast',
  ]);
  for (const source of manifest.sources) assert.equal(upperSha256(files.get(source.path)!), source.sha256);
  const manifestBytes = jsonBytes(manifest);
  files.set(manifestPath, manifestBytes);
  const environment = Object.freeze({ manifestSha256: sha256(manifestBytes), readBytes(relativePath: string) {
    const value = files.get(relativePath);
    if (!value) throw new Error(`Unexpected synthetic path: ${relativePath}`);
    return value;
  } });
  return Object.freeze({ environment, files, manifest, inputText, instructionText });
}
