import { executeGenerationOperation } from '../src/server/generation/generation-execution.ts';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { buildFindingAnalysis } from '../src/server/domain/finding-analysis.ts';
import { assessFindingEvidence } from '../src/server/domain/finding-sufficiency.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { readFinding } from '../src/server/domain/run-contract/finding-validation.ts';
import { GENERATION_INSTRUCTIONS, GENERATION_SCHEMA } from '../src/server/generation/generation-artifacts.ts';
import { GROQ_CONFIGURATION } from '../src/server/generation/groq-generation-configuration.ts';
import { QWEN_CONFIGURATION } from '../src/server/generation/ollama-generation-model.ts';
import { classifyGuidanceSupport } from '../src/server/retrieval/support-policy.ts';
import { SOURCE_NOTICES } from '../src/server/retrieval/source-notices.ts';
import { buildCheckpointSeed } from './helpers/m204-checkpoint-fixture.ts';
import { retrievalResult } from './helpers/m202-retrieval-fixture.ts';
import { generationFixture } from './helpers/m302-generation-fixture.ts';
import { nativeHarness, ollamaChatBody, validMetadata } from './helpers/m303-ollama-fixture.ts';
import { groqChatBody, groqNativeHarness, virtualCredentialIO } from './helpers/m304-groq-fixture.ts';
import { loadM602Package } from './helpers/m602-package.ts';
import { executeM602Case, readM602Case } from './helpers/m602-operation.ts';
import * as m602Operation from './helpers/m602-operation.ts';
import { parseM602Arguments } from './helpers/m602-run-case.ts';

void executeGenerationOperation;

type JsonRecord = Record<string, any>;
type CaseId = 'G1' | 'G2' | 'G3';
const encoder = new TextEncoder();
const repo = path.resolve(import.meta.dirname, '..');
const revision = 'a'.repeat(40);
const caseIds = ['G1', 'G2', 'G3'] as const;
const caseLabels = ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'] as const;
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

type SyntheticBundle = {
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
  for (const relativePath of publicPaths) files.set(relativePath, fs.readFileSync(path.join(repo, relativePath)));
  const publicManifest = JSON.parse(Buffer.from(files.get(publicPaths[0])!).toString('utf8')) as JsonRecord;
  const publicPassages = JSON.parse(Buffer.from(files.get(publicPaths[1])!).toString('utf8')).passages as JsonRecord[];
  const publicGold = JSON.parse(Buffer.from(files.get(publicPaths[2])!).toString('utf8')) as JsonRecord;
  const publicScan = JSON.parse(Buffer.from(files.get(publicPaths[3])!).toString('utf8')) as JsonRecord;
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, manifestPath), 'utf8')) as JsonRecord;
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

function variantBundle(base: SyntheticBundle, relativePath: string, replacement: Uint8Array, rehash: boolean): SyntheticBundle {
  const files = new Map(base.files);
  files.set(relativePath, replacement);
  const manifest = structuredClone(base.manifest);
  if (rehash) {
    const visit = (value: unknown): void => {
      if (!value || typeof value !== 'object') return;
      const record = value as JsonRecord;
      if (record.path === relativePath && typeof record.sha256 === 'string') record.sha256 = upperSha256(replacement);
      for (const child of Object.values(record)) visit(child);
    };
    visit(manifest);
    const affectedCase = manifest.cases.find((entry: JsonRecord) => entry.input.path === relativePath);
    if (affectedCase) for (const execution of manifest.executions.filter((entry: JsonRecord) => entry.caseId === affectedCase.caseId)) {
      execution.inputSha256 = upperSha256(replacement);
    }
    if (manifest.shared.instructions.path === relativePath) {
      for (const execution of manifest.executions) execution.instructionSha256 = upperSha256(replacement);
    }
    if (manifest.shared.outputSchema.path === relativePath) {
      for (const execution of manifest.executions) execution.outputSchemaSha256 = upperSha256(replacement);
    }
  }
  const manifestBytes = jsonBytes(manifest);
  files.set('evaluation/m301-generation-v1.json', manifestBytes);
  return Object.freeze({ files, manifest, inputText: base.inputText, instructionText: base.instructionText,
    environment: Object.freeze({ manifestSha256: sha256(manifestBytes), readBytes(relative: string) {
      const value = files.get(relative);
      if (!value) throw new Error(`Unexpected synthetic path: ${relative}`);
      return value;
    } }) });
}

function makeRoot(): string {
  const root = path.resolve(repo, 'temp', `m602-test-${randomUUID()}`);
  fs.mkdirSync(root);
  return root;
}

function removeRoot(root: string): void {
  const parent = path.resolve(repo, 'temp');
  assert.equal(path.dirname(root), parent);
  assert.match(path.basename(root), /^m602-test-[0-9a-f-]{36}$/u);
  assert.equal(fs.realpathSync(root).toLowerCase(), root.toLowerCase());
  const inspect = (current: string): void => {
    const stat = fs.lstatSync(current);
    assert.equal(stat.isSymbolicLink(), false);
    assert.equal(stat.nlink, 1);
    if (stat.isDirectory()) for (const child of fs.readdirSync(current)) inspect(path.join(current, child));
  };
  inspect(root);
  fs.rmSync(root, { recursive: true });
}

function localNative(candidate: unknown) {
  const metadata = validMetadata();
  return nativeHarness([{ body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, { body: ollamaChatBody(candidate) }]);
}

function writeAssessment(root: string, result: JsonRecord, manifest: JsonRecord,
  mutate?: (assessment: JsonRecord) => void): void {
  const caseLabel = result.caseLabel as string;
  assert.ok(result.chatWindow);
  const started = Date.parse(result.chatWindow.startedAt);
  const finished = Date.parse(result.chatWindow.finishedAt);
  assert.equal(finished - started >= 4, true);
  const resultBytes = fs.readFileSync(path.join(root, caseLabel, 'result.json'));
  const entered = JSON.parse(fs.readFileSync(path.join(root, caseLabel, 'entered.json'), 'utf8')) as JsonRecord;
  const historicalValue = caseLabel === 'local-image' ? 'fail' : 'not-run';
  const assessment: JsonRecord = {
    version: 'm602-evidence-v1', caseLabel, resultSha256: sha256(resultBytes),
    evaluator: 'primary', assessedAt: new Date(finished + 1).toISOString(),
    dimensions: manifest.rubric.map(({ observation }: JsonRecord) => ({
      observation, value: observation === 'actual retrieval relevance' ? historicalValue : 'pass',
    })),
    uncertainty: 'pass',
    localObservation: {
      ui: { startedAt: new Date(started + 1).toISOString(), finishedAt: new Date(finished - 1).toISOString(), responsive: true },
      runtime: { observedAt: new Date(started + 2).toISOString(), digest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd', contextLength: 32768, sizeBytes: 3000000000, sizeVramBytes: 3000000000 },
      gpuBefore: { observedAt: new Date(Date.parse(entered.enteredAt) - 1).toISOString(), usedMiB: 1000, freeMiB: 7000 },
      gpuDuring: { observedAt: new Date(started + 3).toISOString(), usedMiB: 4000, freeMiB: 4000 },
      oomObserved: false,
    }, accepted: true,
  };
  mutate?.(assessment);
  fs.writeFileSync(path.join(root, caseLabel, 'assessment.json'), Buffer.from(jsonBytes(assessment)), { flag: 'wx' });
}

function advancingLocalNative(candidate: unknown, advance: () => void) {
  const harness = localNative(candidate);
  const request = ((options: unknown, callback: (response: unknown) => void) => harness.request(options as never, response => {
    advance();
    callback(response);
  })) as typeof harness.request;
  return { calls: harness.calls, request };
}

async function executeAcceptedLocalPredecessors(
  root: string, bundle: SyntheticBundle, advance: () => void,
): Promise<void> {
  for (const [label, profile] of [['local-image', 'image-alt'], ['local-label', 'label'],
    ['local-contrast', 'color-contrast']] as const) {
    const native = advancingLocalNative(generationFixture(profile).proposal, advance);
    const executed = await executeM602Case(label, {
      root, packageEnvironment: bundle.environment, requestImplementation: native.request,
    });
    assert.equal(executed.ok, true, label);
    if (!executed.ok) throw new Error(`${label} predecessor failed`);
    assert.equal(executed.result.status, 'proposal', label);
    writeAssessment(root, executed.result as JsonRecord, bundle.manifest);
  }
}

test('accepts only one explicit M6-02 action and case label without side effects on import', () => {
  for (const label of caseLabels) for (const [mode, flag] of [['execute', '--execute'], ['readback', '--readback']] as const) {
    assert.deepEqual(parseM602Arguments([flag, '--case', label]), { ok: true, mode, caseLabel: label });
  }
  for (const args of [[], ['--execute'], ['--execute', '--readback', '--case', 'local-image'],
    ['--execute', '--case', 'local-image', '--extra'], ['--execute', '--case', 'unknown'],
    ['--execute', '--case', 'local-image', '--case', 'local-label']] as const) {
    assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });
  }
});

test('authenticates the complete public canonical synthetic package and preserves exact request identity', () => {
  const bundle = canonicalSyntheticBundle();
  for (const [label, mode, caseId, configuration] of [
    ['local-image', 'local', 'informative-image-alt', QWEN_CONFIGURATION],
    ['groq-image', 'groq', 'informative-image-alt', GROQ_CONFIGURATION],
    ['local-label', 'local', 'form-input-label', QWEN_CONFIGURATION],
    ['groq-label', 'groq', 'form-input-label', GROQ_CONFIGURATION],
    ['local-contrast', 'local', 'text-contrast', QWEN_CONFIGURATION],
    ['groq-contrast', 'groq', 'text-contrast', GROQ_CONFIGURATION],
  ] as const) {
    const loaded = loadM602Package(label, bundle.environment);
    assert.equal(loaded.status, 'ready', label);
    if (loaded.status !== 'ready') throw new Error(`Expected ${label} package`);
    const request = loaded.value.createRequest(configuration);
    assert.equal(request.messages[0]!.content, bundle.instructionText);
    assert.notEqual(request.messages[0]!.content, GENERATION_INSTRUCTIONS);
    assert.equal(request.messages[1]!.content, bundle.inputText.get(caseId));
    assert.equal(request.messages.every(message => message.content.endsWith('\n')), true);
    assert.strictEqual(request.schema, GENERATION_SCHEMA);
    assert.equal(loaded.value.providerContext.mode, mode);
    assert.match(loaded.value.wire.sha256, /^[0-9a-f]{64}$/u);
    assert.equal(loaded.value.wire.bytes > 0, true);
    assert.equal(Object.isFrozen(loaded.value), true);
  }
});

test('rejects raw corruption and recomputed-hash semantic package faults before native work', () => {
  const base = canonicalSyntheticBundle();
  const inputPath = base.manifest.cases[0].input.path as string;
  const provenancePath = base.manifest.cases[0].provenance.path as string;
  const schemaPath = base.manifest.shared.outputSchema.path as string;
  const input = JSON.parse(Buffer.from(base.files.get(inputPath)!).toString('utf8')) as JsonRecord;
  const provenance = JSON.parse(Buffer.from(base.files.get(provenancePath)!).toString('utf8')) as JsonRecord;
  const schema = structuredClone(GENERATION_SCHEMA) as JsonRecord;
  const canonicalPassages = JSON.parse(Buffer.from(base.files.get('corpus/wcag22-mvp-v1/passages.json')!).toString('utf8')).passages;
  const wrongProfile = canonicalPassages.find((passage: JsonRecord) => passage.passageId === 'wcag22-sc412');
  const alteredCanonical = structuredClone(input);
  alteredCanonical.guidance.passages[0].text += ' altered';
  const corruptions = [
    variantBundle(base, inputPath, Buffer.concat([Buffer.from(base.files.get(inputPath)!), Buffer.from(' ')]), false),
    variantBundle(base, inputPath, encoder.encode(Buffer.from(base.files.get(inputPath)!).toString('utf8').trimEnd()), false),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance, passages: input.guidance.passages.slice(0, 2) } }), true),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance,
      passages: [input.guidance.passages[0], input.guidance.passages[0], input.guidance.passages[2]] } }), true),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance,
      passages: [wrongProfile, input.guidance.passages[1], input.guidance.passages[2]] } }), true),
    variantBundle(base, inputPath, jsonBytes(alteredCanonical), true),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance,
      passages: [input.guidance.passages[1], input.guidance.passages[0], input.guidance.passages[2]] } }), true),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance,
      passages: [{ ...input.guidance.passages[0], passageId: 'unknown-passage' }, ...input.guidance.passages.slice(1)] } }), true),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance,
      passages: [...input.guidance.passages, wrongProfile] } }), true),
    variantBundle(base, inputPath, jsonBytes({ ...input, guidance: { ...input.guidance,
      passages: [{ ...input.guidance.passages[0], guidanceRole: 'remediation' }, ...input.guidance.passages.slice(1)] } }), true),
    variantBundle(base, provenancePath, jsonBytes({ ...provenance, targetKey: 'wrong-target' }), true),
    variantBundle(base, schemaPath, jsonBytes({ ...schema, required: schema.required.slice(1) }), true),
  ];
  for (const [index, bundle] of corruptions.entries()) assert.deepEqual(
    loadM602Package('local-image', bundle.environment), { status: 'failed', error: 'input-integrity' }, `${index}`);
  for (const fault of ['case-binding', 'execution-order'] as const) {
    const manifest = structuredClone(base.manifest);
    if (fault === 'case-binding') manifest.executions[0].caseId = manifest.cases[1].caseId;
    else [manifest.executions[0], manifest.executions[1]] = [manifest.executions[1], manifest.executions[0]];
    const bytes = jsonBytes(manifest);
    const environment = { manifestSha256: sha256(bytes), readBytes(relativePath: string) {
      return relativePath === 'evaluation/m301-generation-v1.json' ? bytes : base.environment.readBytes(relativePath);
    } };
    assert.deepEqual(loadM602Package('local-image', environment), { status: 'failed', error: 'input-integrity' }, fault);
  }
});

test('fails closed on all incomplete Local and Groq dependency sets with zero effects', async () => {
  const bundle = canonicalSyntheticBundle();
  for (const label of ['local-image', 'groq-image'] as const) {
    const missingMembers = label === 'groq-image'
      ? (['all', 'root', 'environment', 'request', 'credential'] as const)
      : (['all', 'root', 'environment', 'request'] as const);
    for (const missing of missingMembers) {
      const root = makeRoot();
      let nativeCalls = 0;
      let mkdirCalls = 0;
      const native = (() => { nativeCalls++; throw new Error('native request must not run'); }) as never;
      const credential = virtualCredentialIO();
      const complete: JsonRecord = { root, packageEnvironment: bundle.environment, requestImplementation: native,
        filesystem: { mkdirSync() { mkdirCalls++; throw new Error('mkdir must not run'); } },
        ...(label === 'groq-image' ? { credentialIO: credential.io } : {}) };
      const dependencies: JsonRecord = missing === 'all' ? {} : complete;
      if (missing !== 'all') delete dependencies[missing === 'environment' ? 'packageEnvironment'
        : missing === 'request' ? 'requestImplementation' : missing === 'credential' ? 'credentialIO' : 'root'];
      try {
        assert.deepEqual(await executeM602Case(label, dependencies as never), { ok: false, error: 'evidence-blocked' });
        assert.equal(fs.existsSync(path.join(root, label)), false);
        assert.equal(nativeCalls, 0);
        assert.equal(credential.calls.open.length, 0);
        assert.equal(mkdirCalls, 0);
        assert.deepEqual(await readM602Case(label, { root,
          filesystem: { mkdirSync() { mkdirCalls++; throw new Error('mkdir must not run'); } } } as never),
        { ok: false, error: 'evidence-blocked' });
        assert.equal(mkdirCalls, 0);
      } finally { removeRoot(root); }
    }
  }
});

test('records genuine Local and ordered Groq native-double bodies and readback has no external effects', async t => {
  const bundle = canonicalSyntheticBundle();
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T12:00:00.000Z') });
  const advance = () => { t.mock.timers.tick(20); };
  for (const label of ['local-image', 'groq-image'] as const) {
    const root = makeRoot();
    const proposal = generationFixture().proposal;
    const local = advancingLocalNative(proposal, advance);
    const groqBase = groqNativeHarness([{ body: groqChatBody(proposal) }]);
    const groq = { calls: groqBase.calls, request: ((options: unknown, callback: (response: unknown) => void) =>
      groqBase.request(options as never, response => { advance(); callback(response); })) as typeof groqBase.request };
    const credential = virtualCredentialIO();
    try {
      if (label === 'groq-image') await executeAcceptedLocalPredecessors(root, bundle, advance);
      const dependencies = label === 'local-image'
        ? { root, packageEnvironment: bundle.environment, requestImplementation: local.request }
        : { root, packageEnvironment: bundle.environment, requestImplementation: groq.request as never, credentialIO: credential.io };
      const executed = await executeM602Case(label, dependencies);
      assert.equal(executed.ok, true, label);
      if (!executed.ok) throw new Error(`${label} did not publish`);
      assert.equal(executed.result.status, 'proposal');
      assert.equal(executed.result.attempted, true);
      assert.deepEqual(executed.result.requests, label === 'local-image'
        ? { version: 1, show: 1, tags: 1, chat: 1 } : { version: 0, show: 0, tags: 0, chat: 1 });
      const calls = label === 'local-image' ? local.calls : groq.calls;
      const actualBody = calls.at(-1)!.body;
      const actualBytes = typeof actualBody === 'string' ? Buffer.byteLength(actualBody) : actualBody.byteLength;
      const actualHash = createHash('sha256').update(actualBody).digest('hex');
      assert.deepEqual(executed.result.wire, { sha256: actualHash, bytes: actualBytes });
      const authenticated = loadM602Package(label, bundle.environment);
      assert.equal(authenticated.status, 'ready');
      if (authenticated.status !== 'ready') throw new Error('Authenticated package must remain valid');
      assert.deepEqual({ sha256: actualHash, bytes: actualBytes }, authenticated.value.wire);
      assert.deepEqual(fs.readdirSync(path.join(root, label)).sort(), ['dispatch.json', 'entered.json', 'result.json']);
      const before = { native: calls.length, credential: credential.calls.open.length };
      const read = await readM602Case(label, { root, packageEnvironment: bundle.environment });
      assert.equal(read.ok, true);
      if (!read.ok) throw new Error(`${label} readback failed`);
      assert.deepEqual(read.result, executed.result);
      assert.equal(read.assessment, null);
      assert.deepEqual({ native: calls.length, credential: credential.calls.open.length }, before);
    } finally { removeRoot(root); }
  }
  t.mock.timers.reset();
});

test('preserves publication evidence and blocks occupied or partial case directories', async () => {
  const bundle = canonicalSyntheticBundle();
  for (const occupied of ['empty', 'partial'] as const) {
    const root = makeRoot();
    const caseDirectory = path.join(root, 'local-image');
    fs.mkdirSync(caseDirectory);
    if (occupied === 'partial') fs.writeFileSync(path.join(caseDirectory, 'entered.json'), '{"partial":true}\n');
    let nativeCalls = 0;
    try {
      assert.deepEqual(await executeM602Case('local-image', { root, packageEnvironment: bundle.environment,
        requestImplementation: (() => { nativeCalls++; throw new Error('must not run'); }) as never,
      }), { ok: false, error: 'evidence-blocked' });
      assert.equal(nativeCalls, 0);
      assert.deepEqual(fs.readdirSync(caseDirectory), occupied === 'empty' ? [] : ['entered.json']);
    } finally { removeRoot(root); }
  }
  for (const failure of ['write', 'fsync', 'close'] as const) {
    const root = makeRoot();
    let nativeCalls = 0;
    const filesystem: JsonRecord = failure === 'write' ? { writeSync(fd: number, buffer: Uint8Array, offset: number, length: number, position: number) {
      fs.writeSync(fd, buffer, offset, Math.max(1, length - 1), position); throw new Error('SECRET PARTIAL WRITE');
    } }
      : failure === 'fsync' ? { fsyncSync: () => { throw new Error('SECRET FSYNC'); } }
        : { closeSync(fd: number) { fs.closeSync(fd); throw new Error('SECRET CLOSE'); } };
    try {
      assert.deepEqual(await executeM602Case('local-image', { root, packageEnvironment: bundle.environment, filesystem,
        requestImplementation: (() => { nativeCalls++; throw new Error('must not run'); }) as never,
      }), { ok: false, error: 'evidence-publication' });
      assert.equal(nativeCalls, 0);
      const names = fs.readdirSync(path.join(root, 'local-image'));
      assert.equal(names.length > 0, true);
      for (const name of names) assert.equal(fs.readFileSync(path.join(root, 'local-image', name), 'utf8').includes('SECRET'), false);
    } finally { removeRoot(root); }
  }
});

test('preserves entered and dispatch bytes when later fsync or close publication fails without redispatch', async () => {
  const bundle = canonicalSyntheticBundle();
  for (const stage of ['dispatch', 'result'] as const) {
    for (const failure of ['write', 'fsync', 'close'] as const) {
      const root = makeRoot();
      const native = localNative(generationFixture().proposal);
      const opened = new Map<number, string>();
      const target = `${stage}.json`;
      const filesystem: JsonRecord = {
        openSync(filePath: fs.PathLike, flags: fs.OpenMode, mode?: fs.Mode) {
          const fd = fs.openSync(filePath, flags, mode);
          opened.set(fd, path.basename(String(filePath)));
          return fd;
        },
        writeSync(fd: number, buffer: Uint8Array, offset: number, length: number, position: number) {
          if (failure === 'write' && opened.get(fd) === target) {
            fs.writeSync(fd, buffer, offset, Math.max(1, length - 1), position);
            throw new Error('SECRET PARTIAL WRITE');
          }
          return fs.writeSync(fd, buffer, offset, length, position);
        },
        fsyncSync(fd: number) {
          if (failure === 'fsync' && opened.get(fd) === target) throw new Error('SECRET FSYNC');
          fs.fsyncSync(fd);
        },
        closeSync(fd: number) {
          const isTarget = opened.get(fd) === target;
          opened.delete(fd);
          fs.closeSync(fd);
          if (failure === 'close' && isTarget) throw new Error('SECRET CLOSE');
        },
      };
      try {
        assert.deepEqual(await executeM602Case('local-image', {
          root, packageEnvironment: bundle.environment, requestImplementation: native.request, filesystem,
        }), { ok: false, error: 'evidence-publication' }, `${stage}-${failure}`);
        assert.equal(native.calls.length, stage === 'dispatch' ? 3 : 4);
        const directory = path.join(root, 'local-image');
        assert.equal(fs.existsSync(path.join(directory, 'entered.json')), true);
        if (stage === 'result') assert.equal(fs.existsSync(path.join(directory, 'dispatch.json')), true);
        for (const name of fs.readdirSync(directory)) {
          assert.equal(fs.readFileSync(path.join(directory, name), 'utf8').includes('SECRET'), false);
        }
        assert.deepEqual(await executeM602Case('local-image', {
          root, packageEnvironment: bundle.environment, requestImplementation: native.request,
        }), { ok: false, error: 'evidence-blocked' });
        assert.equal(native.calls.length, stage === 'dispatch' ? 3 : 4);
      } finally { removeRoot(root); }
    }
  }
});

test('readback rejects tampered records without credential or native effects', async () => {
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  const native = localNative(generationFixture().proposal);
  const credential = virtualCredentialIO();
  try {
    const executed = await executeM602Case('local-image', {
      root, packageEnvironment: bundle.environment, requestImplementation: native.request, credentialIO: credential.io,
    });
    assert.equal(executed.ok, true);
    const before = { native: native.calls.length, credential: credential.calls.open.length };
    const resultPath = path.join(root, 'local-image', 'result.json');
    const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as JsonRecord;
    result.enteredSha256 = 'f'.repeat(64);
    fs.writeFileSync(resultPath, Buffer.from(jsonBytes(result)));
    assert.deepEqual(await readM602Case('local-image', { root, packageEnvironment: bundle.environment }),
      { ok: false, error: 'evidence-blocked' });
    assert.deepEqual({ native: native.calls.length, credential: credential.calls.open.length }, before);
  } finally { removeRoot(root); }
});

test('readback enforces failure coherence while preserving truthful cancellation and marker records', async t => {
  const bundle = canonicalSyntheticBundle();
  const noAttempt = (record: JsonRecord) => {
    record.attempted = false;
    record.observation = null;
    record.wire = null;
    record.chatWindow = null;
    record.requests.chat = 0;
  };
  const vectors: { name: string; accepted: boolean; mutate: (record: JsonRecord) => void }[] = [];
  for (const error of ['input-integrity', 'configuration', 'missing-prerequisite', 'input-fit']) {
    vectors.push({ name: `${error} cannot follow an attempt`, accepted: false,
      mutate(record) { record.error = error; } });
  }
  for (const error of ['authentication', 'quota', 'rate-limit', 'network', 'provider']) {
    vectors.push(
      { name: `${error} requires an attempt`, accepted: false,
        mutate(record) { record.error = error; noAttempt(record); } },
      { name: `${error} rejects a response observation`, accepted: false,
        mutate(record) { record.error = error; } },
      { name: `${error} rejects passed validation`, accepted: false,
        mutate(record) { record.error = error; record.observation.outcome = error; } },
      { name: `${error} preserves its matching unvalidated observation`, accepted: true,
        mutate(record) { record.error = error; record.observation.outcome = error; record.observation.validation = 'not-run'; } },
    );
  }
  for (const error of ['timeout', 'shutdown']) {
    vectors.push({ name: `${error} after response validation remains readable`, accepted: true,
      mutate(record) { record.error = error; } });
  }
  vectors.push(
    { name: 'response-validation requires an attempt', accepted: false,
      mutate(record) { record.error = 'response-validation'; noAttempt(record); } },
    { name: 'failed response validation remains readable', accepted: true,
      mutate(record) { record.error = 'response-validation'; record.observation.validation = 'failed'; } },
    { name: 'caller wire mismatch preserves passed candidate validation', accepted: true,
      mutate(record) { record.error = 'response-validation'; record.wire.sha256 = 'f'.repeat(64); } },
    { name: 'complete marker without dispatch remains readable', accepted: true,
      mutate(record) { record.error = 'configuration'; noAttempt(record); } },
  );
  for (const vector of vectors) await t.test(vector.name, async () => {
    const root = makeRoot();
    const native = localNative(generationFixture().proposal);
    const credential = virtualCredentialIO();
    try {
      const executed = await executeM602Case('local-image', {
        root, packageEnvironment: bundle.environment, requestImplementation: native.request,
      });
      assert.ok(executed.ok && executed.result.status === 'proposal');
      const resultPath = path.join(root, 'local-image', 'result.json');
      const record = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as JsonRecord;
      record.status = 'failed';
      record.proposal = null;
      vector.mutate(record);
      const bytes = Buffer.from(jsonBytes(record));
      fs.writeFileSync(resultPath, bytes);
      const before = { native: native.calls.length, credential: credential.calls.open.length };
      const readback = await readM602Case('local-image', {
        root, packageEnvironment: bundle.environment, requestImplementation: native.request, credentialIO: credential.io,
      });
      if (vector.accepted) {
        assert.ok(readback.ok);
        assert.deepEqual(readback.result, record);
      } else assert.deepEqual(readback, { ok: false, error: 'evidence-blocked' });
      assert.deepEqual({ native: native.calls.length, credential: credential.calls.open.length }, before);
      assert.deepEqual(fs.readFileSync(resultPath), bytes);
    } finally { removeRoot(root); }
  });
});

test('readback rejects unsafe topology and unexpected, oversized or malformed evidence without external effects', async () => {
  const bundle = canonicalSyntheticBundle();
  for (const fault of ['reparse', 'hardlink', 'unexpected-name', 'oversized', 'malformed'] as const) {
    const root = makeRoot();
    const native = localNative(generationFixture().proposal);
    const credential = virtualCredentialIO();
    try {
      const executed = await executeM602Case('local-image', {
        root, packageEnvironment: bundle.environment, requestImplementation: native.request,
      });
      assert.equal(executed.ok, true, fault);
      if (!executed.ok) throw new Error('Expected a complete synthetic record before corruption');
      assert.equal(executed.result.status, 'proposal', fault);
      const directory = path.join(root, 'local-image');
      const resultPath = path.join(directory, 'result.json');
      if (fault === 'unexpected-name') fs.writeFileSync(path.join(directory, 'unexpected.json'), '{}\n', { flag: 'wx' });
      if (fault === 'oversized') fs.writeFileSync(resultPath, Buffer.alloc(1024 * 1024 + 1, 32));
      if (fault === 'malformed') fs.writeFileSync(resultPath, '{\n');
      const filesystem = {
        lstatSync(filePath: fs.PathLike) {
          const stat = fs.lstatSync(filePath);
          if (path.resolve(String(filePath)) === resultPath) {
            if (fault === 'reparse') Object.defineProperty(stat, 'isSymbolicLink', { value: () => true });
            if (fault === 'hardlink') Object.defineProperty(stat, 'nlink', { value: 2 });
          }
          return stat;
        },
      };
      const before = { native: native.calls.length, credential: credential.calls.open.length };
      assert.deepEqual(await readM602Case('local-image', {
        root, packageEnvironment: bundle.environment, filesystem: filesystem as never,
        requestImplementation: native.request, credentialIO: credential.io,
      }), { ok: false, error: 'evidence-blocked' }, fault);
      assert.deepEqual({ native: native.calls.length, credential: credential.calls.open.length }, before, fault);
      assert.equal(fs.existsSync(resultPath), true, fault);
    } finally { removeRoot(root); }
  }
});

test('requires accepted hash-linked assessment and valid Local observation before the next case', async t => {
  const bundle = canonicalSyntheticBundle();
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T13:00:00.000Z') });
  const advance = () => { t.mock.timers.tick(20); };
  for (const disposition of ['missing', 'failed-dimension', 'hash-mismatch', 'invalid-local-observation', 'accepted'] as const) {
    const root = makeRoot();
    const firstNative = advancingLocalNative(generationFixture().proposal, advance);
    try {
      const first = await executeM602Case('local-image', {
        root, packageEnvironment: bundle.environment, requestImplementation: firstNative.request,
      });
      assert.equal(first.ok, true, disposition);
      if (!first.ok) throw new Error('Prior case did not publish');
      if (disposition !== 'missing') writeAssessment(root, first.result as JsonRecord, bundle.manifest, assessment => {
        if (disposition === 'failed-dimension') {
          const required = assessment.dimensions.find((entry: JsonRecord) => entry.observation === 'semantic groundedness');
          assert.ok(required);
          required.value = 'fail';
        }
        if (disposition === 'hash-mismatch') assessment.resultSha256 = 'f'.repeat(64);
        if (disposition === 'invalid-local-observation') assessment.localObservation.ui.startedAt = first.result.chatWindow!.startedAt;
      });
      const nextNative = advancingLocalNative(generationFixture('label').proposal, advance);
      const next = await executeM602Case('local-label', {
        root, packageEnvironment: bundle.environment, requestImplementation: nextNative.request,
      });
      if (disposition === 'accepted') {
        assert.equal(next.ok, true);
        if (!next.ok) throw new Error('Accepted prior case must admit the next fixed case');
        assert.equal(next.result.status, 'proposal');
        assert.equal(nextNative.calls.length, 4);
      } else {
        assert.deepEqual(next, { ok: false, error: 'evidence-blocked' }, disposition);
        assert.equal(nextNative.calls.length, 0, disposition);
        assert.equal(fs.existsSync(path.join(root, 'local-label')), false, disposition);
      }
    } finally { removeRoot(root); }
  }
  t.mock.timers.reset();
});

test('never persists rejected raw candidate content and terminal evidence blocks redispatch', async () => {
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  const secret = 'SYNTHETIC_RAW_SECRET_SENTINEL';
  const metadata = validMetadata();
  const native = nativeHarness([{ body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
    { body: JSON.stringify(metadata.tags) }, { body: ollamaChatBody({ secret }) }]);
  try {
    const dependencies = { root, packageEnvironment: bundle.environment, requestImplementation: native.request };
    const first = await executeM602Case('local-image', dependencies);
    assert.equal(first.ok, true);
    if (!first.ok) throw new Error('Expected terminal invalid-response publication');
    assert.equal(first.result.status, 'failed');
    assert.equal(first.result.error, 'response-validation');
    for (const name of fs.readdirSync(path.join(root, 'local-image'))) {
      assert.equal(fs.readFileSync(path.join(root, 'local-image', name), 'utf8').includes(secret), false);
    }
    assert.deepEqual(await executeM602Case('local-image', dependencies), { ok: false, error: 'evidence-blocked' });
    assert.equal(native.calls.length, 4);
  } finally { removeRoot(root); }
});

test('terminal ordered Groq abort clears prepared credential bytes and publishes no proposal', async t => {
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  const native = groqNativeHarness([{ hold: true }]);
  const credential = virtualCredentialIO();
  const controller = new AbortController();
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T14:00:00.000Z') });
  const advance = () => { t.mock.timers.tick(20); };
  try {
    await executeAcceptedLocalPredecessors(root, bundle, advance);
    const pending = executeM602Case('groq-image', {
      root, packageEnvironment: bundle.environment, requestImplementation: native.request as never,
      credentialIO: credential.io, signal: controller.signal,
    });
    for (let index = 0; index < 100 && native.calls.length === 0; index++) await new Promise<void>(resolve => setImmediate(resolve));
    assert.equal(native.calls.length, 1);
    controller.abort();
    const result = await pending;
    assert.equal(result.ok, true);
    if (!result.ok) throw new Error('Expected terminal shutdown publication');
    assert.equal(result.result.status, 'failed');
    assert.equal(result.result.error, 'shutdown');
    assert.equal(result.result.proposal, null);
    assert.equal(credential.calls.buffers.length > 0, true);
    assert.equal(credential.calls.buffers.every(bytes => bytes.every(byte => byte === 0)), true);
    assert.equal(native.calls.length, 1);
  } finally { removeRoot(root); t.mock.timers.reset(); }
});

test('publishes and authenticates integrated follow-up diagnostics and completed Local observer timing', async t => {
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  const reportRoot = path.join(root, 'followup-evidence');
  const native = advancingLocalNative(generationFixture().proposal, () => { t.mock.timers.tick(20); });
  const starts: string[] = [];
  const observers = Object.fromEntries(['ui', 'runtime', 'gpu'].map(kind => [kind, (gate: {
    signal: AbortSignal; start(effect: (signal: AbortSignal) => void | Promise<void>): boolean;
  }) => {
    starts.push(kind);
    assert.equal(gate.signal.aborted, false);
    t.mock.timers.tick(1);
    assert.equal(gate.start(() => { t.mock.timers.tick(1); }), true);
  }]));
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T15:00:00.000Z') });
  try {
    const executed = await executeM602Case('local-image', {
      root, packageEnvironment: bundle.environment, requestImplementation: native.request,
      followup: { reportRoot, observers },
    } as never);
    assert.equal(executed.ok, true);
    if (!executed.ok) throw new Error('Expected follow-up execution publication');
    assert.equal(executed.result.status, 'proposal');
    assert.deepEqual(starts, ['ui', 'runtime', 'gpu']);
    assert.ok(executed.followup);
    assert.deepEqual(executed.followup.report.diagnostic, { integrity: 'complete', code: null });
    assert.deepEqual(executed.followup.report.observation.chatWindow, executed.result.chatWindow);
    assert.equal(executed.followup.report.observation.cleanup, 'complete');
    for (const kind of ['ui', 'runtime', 'gpu'] as const) {
      const slot: { readonly status: string; readonly cleanup: string;
        readonly startedAt: string | null; readonly finishedAt: string | null } = executed.followup.report.observation[kind];
      assert.equal(slot.status, 'completed', kind);
      assert.equal(slot.cleanup, 'complete', kind);
      assert.ok(slot.startedAt && slot.finishedAt, kind);
      assert.ok(Date.parse(slot.startedAt) > Date.parse(executed.result.chatWindow!.startedAt), kind);
      assert.ok(Date.parse(slot.finishedAt) < Date.parse(executed.result.chatWindow!.finishedAt), kind);
    }
    const reportDirectory = path.join(reportRoot, executed.result.enteredSha256);
    assert.deepEqual(fs.readdirSync(reportDirectory), ['report.json']);
    const reportPath = path.join(reportDirectory, 'report.json');
    const reportBytes = fs.readFileSync(reportPath);
    assert.equal(sha256(reportBytes), executed.followup.sha256);
    const before = { calls: native.calls.length, result: fs.readFileSync(path.join(root, 'local-image', 'result.json')) };
    const read = await m602Operation.readM602Followup('local-image', {
      root, packageEnvironment: bundle.environment, followup: { reportRoot },
    });
    assert.deepEqual(read, { ok: true, report: executed.followup.report, sha256: executed.followup.sha256 });
    assert.equal(native.calls.length, before.calls);
    assert.deepEqual(fs.readFileSync(path.join(root, 'local-image', 'result.json')), before.result);
    fs.writeFileSync(path.join(reportDirectory, 'extra.json'), '{}', { flag: 'wx' });
    assert.deepEqual(await m602Operation.readM602Followup('local-image', {
      root, packageEnvironment: bundle.environment, followup: { reportRoot },
    }), { ok: false, error: 'evidence-blocked' });
    fs.rmSync(path.join(reportDirectory, 'extra.json'));
    const forgeries: readonly ((report: JsonRecord) => void)[] = [
      report => { report.extra = 'forged'; },
      report => { report.resultSha256 = 'b'.repeat(64); },
      report => { report.diagnostic = { integrity: 'complete', code: 'candidate/contract' }; },
      report => { report.diagnostic = { integrity: 'failed', code: 'adapter-response/body' }; },
      report => { report.observation.chatWindow = null; },
      report => { report.observation.ui.startedAt = report.observation.chatWindow.startedAt; },
      report => { report.observation.ui.finishedAt = new Date(Date.parse(report.observation.ui.startedAt) - 1).toISOString(); },
      report => { report.observation.ui = { status: 'unavailable', startedAt: report.observation.ui.startedAt,
        finishedAt: report.observation.ui.finishedAt, cleanup: 'complete' }; },
      report => { report.observation.ui.cleanup = 'uncertain'; report.observation.cleanup = 'complete'; },
    ];
    for (const mutate of forgeries) {
      const forged = structuredClone(executed.followup.report) as JsonRecord;
      mutate(forged);
      fs.writeFileSync(reportPath, jsonBytes(forged));
      assert.deepEqual(await m602Operation.readM602Followup('local-image', {
        root, packageEnvironment: bundle.environment, followup: { reportRoot },
      }), { ok: false, error: 'evidence-blocked' });
    }
    fs.writeFileSync(reportPath, reportBytes);
    assert.deepEqual(await executeM602Case('local-image', {
      root, packageEnvironment: bundle.environment, requestImplementation: native.request,
      followup: { reportRoot, observers },
    } as never), { ok: false, error: 'evidence-blocked' });
    assert.equal(native.calls.length, before.calls);
  } finally {
    removeRoot(root);
    t.mock.timers.reset();
  }
});

test('follow-up observers fail closed across unavailable, refused, pending, faulted, equal-time, and Groq paths', async t => {
  const bundle = canonicalSyntheticBundle();
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T16:00:00.000Z') });
  const roots: string[] = [];
  const advance = () => { t.mock.timers.tick(20); };
  try {
    const executeLocal = async (observers?: Record<string, unknown>) => {
      const root = makeRoot(); roots.push(root);
      const native = advancingLocalNative(generationFixture().proposal, advance);
      const reportRoot = path.join(root, 'followup-evidence');
      const outcome = await executeM602Case('local-image', {
        root, packageEnvironment: bundle.environment, requestImplementation: native.request,
        followup: { reportRoot, ...(observers ? { observers } : {}) },
      } as never);
      assert.equal(outcome.ok, true);
      if (!outcome.ok) throw new Error('Expected Local follow-up result');
      return { outcome, native };
    };

    const unavailable = await executeLocal();
    for (const kind of ['ui', 'runtime', 'gpu'] as const) {
      assert.deepEqual(unavailable.outcome.followup!.report.observation[kind], {
        status: 'unavailable', startedAt: null, finishedAt: null, cleanup: 'complete',
      });
    }

    let duplicateResult: boolean | undefined;
    const refused = await executeLocal({
      ui: (gate: { start(effect: () => void): boolean }) => {
        assert.equal(gate.start(() => { t.mock.timers.tick(1); duplicateResult = gate.start(() => undefined); }), true);
      },
    });
    assert.equal(duplicateResult, false);
    assert.equal(refused.outcome.followup!.report.observation.ui.status, 'missed-window');

    const pendingEffect = new Promise<void>(() => undefined);
    const pending = await executeLocal({ ui: (gate: { start(effect: () => Promise<void>): boolean }) => {
      assert.equal(gate.start(() => pendingEffect), true);
    } });
    assert.deepEqual({ status: pending.outcome.followup!.report.observation.ui.status,
      cleanup: pending.outcome.followup!.report.observation.ui.cleanup }, { status: 'aborted', cleanup: 'uncertain' });

    const failed = await executeLocal({ ui: (gate: { start(effect: () => void): boolean }) => {
      assert.equal(gate.start(() => { throw new Error('synthetic observer failure'); }), true);
    } });
    assert.equal(failed.outcome.followup!.report.observation.ui.status, 'failed');

    const equal = await executeLocal({ ui: (gate: { start(effect: () => void): boolean }) => {
      assert.equal(gate.start(() => undefined), true);
    } });
    assert.equal(equal.outcome.followup!.report.observation.ui.status, 'missed-window');

    const groqRoot = makeRoot(); roots.push(groqRoot);
    await executeAcceptedLocalPredecessors(groqRoot, bundle, advance);
    const groq = groqNativeHarness([{ body: groqChatBody(generationFixture().proposal) }]);
    const credential = virtualCredentialIO();
    let groqObserverCalls = 0;
    const groqResult = await executeM602Case('groq-image', {
      root: groqRoot, packageEnvironment: bundle.environment, requestImplementation: groq.request as never,
      credentialIO: credential.io,
      followup: { reportRoot: path.join(groqRoot, 'followup-evidence'), observers: {
        ui: () => { groqObserverCalls++; }, runtime: () => { groqObserverCalls++; }, gpu: () => { groqObserverCalls++; },
      } },
    } as never);
    assert.equal(groqResult.ok, true);
    if (!groqResult.ok) throw new Error('Expected Groq follow-up result');
    assert.equal(groqObserverCalls, 0);
    for (const kind of ['ui', 'runtime', 'gpu'] as const) {
      assert.equal(groqResult.followup!.report.observation[kind].status, 'unavailable');
    }
  } finally {
    for (const root of roots.reverse()) if (fs.existsSync(root)) removeRoot(root);
    t.mock.timers.reset();
  }
});

test('follow-up observer gates reject synchronous-terminal, delayed, abort-reentrant, and late-settlement work', async t => {
  const bundle = canonicalSyntheticBundle();
  const roots: string[] = [];
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T17:00:00.000Z') });
  try {
    const metadata = validMetadata();
    const syncRoot = makeRoot(); roots.push(syncRoot);
    const syncNative = nativeHarness([
      { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
      { body: JSON.stringify(metadata.tags) }, { synchronousError: new Error('synthetic terminal') },
    ]);
    let scheduled = 0;
    const synchronous = await executeM602Case('local-image', {
      root: syncRoot, packageEnvironment: bundle.environment, requestImplementation: syncNative.request,
      followup: { reportRoot: path.join(syncRoot, 'followup-evidence'), observers: {
        ui: () => { scheduled++; }, runtime: () => { scheduled++; }, gpu: () => { scheduled++; },
      } },
    } as never);
    assert.equal(synchronous.ok, true);
    if (!synchronous.ok) throw new Error('Expected synchronous-terminal result publication');
    assert.equal(synchronous.result.status, 'failed');
    assert.equal(scheduled, 0);
    for (const kind of ['ui', 'runtime', 'gpu'] as const) {
      assert.equal(synchronous.followup!.report.observation[kind].status, 'missed-window');
    }

    const delayedRoot = makeRoot(); roots.push(delayedRoot);
    const delayedNative = advancingLocalNative(generationFixture().proposal, () => { t.mock.timers.tick(20); });
    let releaseObserver!: () => void;
    const observerWait = new Promise<void>(resolve => { releaseObserver = resolve; });
    let lateStart: boolean | undefined;
    const delayed = await executeM602Case('local-image', {
      root: delayedRoot, packageEnvironment: bundle.environment, requestImplementation: delayedNative.request,
      followup: { reportRoot: path.join(delayedRoot, 'followup-evidence'), observers: {
        ui: async (gate: { start(effect: () => void): boolean }) => {
          await observerWait;
          lateStart = gate.start(() => { throw new Error('late effect must not execute'); });
        },
      } },
    } as never);
    assert.equal(delayed.ok, true);
    if (!delayed.ok) throw new Error('Expected delayed-observer result publication');
    assert.equal(delayed.followup!.report.observation.ui.status, 'aborted');
    assert.equal(delayed.followup!.report.observation.ui.cleanup, 'uncertain');
    releaseObserver();
    await Promise.resolve(); await Promise.resolve();
    assert.equal(lateStart, false);
    assert.equal(delayed.followup!.report.observation.ui.status, 'aborted');

    const abortRoot = makeRoot(); roots.push(abortRoot);
    const abortNative = nativeHarness([
      { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
      { body: JSON.stringify(metadata.tags) }, { hold: true },
    ]);
    const controller = new AbortController();
    let settleEffect!: () => void;
    const effectWait = new Promise<void>(resolve => { settleEffect = resolve; });
    let reentrantStart: boolean | undefined;
    const aborting = executeM602Case('local-image', {
      root: abortRoot, packageEnvironment: bundle.environment, requestImplementation: abortNative.request,
      signal: controller.signal,
      followup: { reportRoot: path.join(abortRoot, 'followup-evidence'), observers: {
        ui: (gate: { signal: AbortSignal; start(effect: () => Promise<void>): boolean }) => {
          gate.signal.addEventListener('abort', () => { reentrantStart = gate.start(async () => undefined); }, { once: true });
          assert.equal(gate.start(() => effectWait), true);
        },
      } },
    } as never);
    for (let index = 0; index < 100 && abortNative.calls.length < 4; index++) await new Promise<void>(resolve => setImmediate(resolve));
    assert.equal(abortNative.calls.length, 4);
    controller.abort();
    const aborted = await aborting;
    assert.equal(aborted.ok, true);
    if (!aborted.ok) throw new Error('Expected caller-abort result publication');
    assert.equal(reentrantStart, false);
    assert.equal(aborted.followup!.report.observation.ui.status, 'aborted');
    assert.equal(aborted.followup!.report.observation.ui.cleanup, 'uncertain');
    assert.equal(aborted.result.chatWindow, null);
    assert.equal(aborted.followup!.report.observation.chatWindow, null);
    const frozen = structuredClone(aborted.followup!.report.observation.ui);
    settleEffect();
    await Promise.resolve(); await Promise.resolve();
    assert.deepEqual(aborted.followup!.report.observation.ui, frozen);

    const lateTerminalRoot = makeRoot(); roots.push(lateTerminalRoot);
    const lateBase = nativeHarness([
      { body: JSON.stringify(metadata.version) }, { body: JSON.stringify(metadata.show) },
      { body: JSON.stringify(metadata.tags) }, { hold: true },
    ]);
    const lateNative: typeof lateBase.request = (options, callback) => {
      const handle = lateBase.request(options, callback);
      if (options.path === '/api/chat') {
        const destroy = handle.destroy;
        handle.destroy = ((...args: Parameters<typeof destroy>) => {
          const returned = Reflect.apply(destroy, handle, args);
          handle.emit('close');
          return returned;
        }) as typeof handle.destroy;
      }
      return handle;
    };
    const lateController = new AbortController();
    const lateTerminal = executeM602Case('local-image', {
      root: lateTerminalRoot, packageEnvironment: bundle.environment, requestImplementation: lateNative,
      signal: lateController.signal,
      followup: { reportRoot: path.join(lateTerminalRoot, 'followup-evidence'), observers: {
        ui: (gate: { start(effect: () => Promise<void>): boolean }) => {
          assert.equal(gate.start(() => new Promise<void>(() => undefined)), true);
        },
      } },
    } as never);
    for (let index = 0; index < 100 && lateBase.calls.length < 4; index++) await new Promise<void>(resolve => setImmediate(resolve));
    assert.equal(lateBase.calls.length, 4);
    lateController.abort();
    const lateTerminalResult = await lateTerminal;
    assert.equal(lateTerminalResult.ok, true);
    if (!lateTerminalResult.ok) throw new Error('Expected late-terminal result publication');
    assert.ok(lateTerminalResult.result.chatWindow);
    assert.deepEqual(lateTerminalResult.followup!.report.observation.chatWindow, lateTerminalResult.result.chatWindow);
    assert.deepEqual({ status: lateTerminalResult.followup!.report.observation.ui.status,
      cleanup: lateTerminalResult.followup!.report.observation.ui.cleanup }, { status: 'aborted', cleanup: 'uncertain' });
  } finally {
    for (const root of roots.reverse()) if (fs.existsSync(root)) removeRoot(root);
    t.mock.timers.reset();
  }
});

test('follow-up observation keeps observer and effect settlement independent and owns late rejection', async t => {
  const bundle = canonicalSyntheticBundle();
  const roots: string[] = [];
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-20T18:00:00.000Z') });
  const execute = async (observer: (gate: {
    signal: AbortSignal; start(effect: (signal: AbortSignal) => void | Promise<void>): boolean;
  }) => void | Promise<void>) => {
    const root = makeRoot(); roots.push(root);
    const native = advancingLocalNative(generationFixture().proposal, () => { t.mock.timers.tick(20); });
    const outcome = await executeM602Case('local-image', {
      root, packageEnvironment: bundle.environment, requestImplementation: native.request,
      followup: { reportRoot: path.join(root, 'followup-evidence'), observers: { ui: observer } },
    } as never);
    assert.equal(outcome.ok, true);
    if (!outcome.ok) throw new Error('Expected observer settlement result');
    return outcome;
  };
  try {
    const never = new Promise<void>(() => undefined);
    const throwing = await execute(gate => {
      assert.equal(gate.start(() => never), true);
      throw new Error('synthetic observer throw after effect start');
    });
    assert.deepEqual({ status: throwing.followup!.report.observation.ui.status,
      cleanup: throwing.followup!.report.observation.ui.cleanup }, { status: 'aborted', cleanup: 'uncertain' });

    const rejecting = await execute(async gate => {
      assert.equal(gate.start(() => never), true);
      throw new Error('synthetic observer rejection after effect start');
    });
    assert.deepEqual({ status: rejecting.followup!.report.observation.ui.status,
      cleanup: rejecting.followup!.report.observation.ui.cleanup }, { status: 'aborted', cleanup: 'uncertain' });

    const observerPending = await execute(async gate => {
      t.mock.timers.tick(1);
      assert.equal(gate.start(() => undefined), true);
      await never;
    });
    assert.deepEqual({ status: observerPending.followup!.report.observation.ui.status,
      cleanup: observerPending.followup!.report.observation.ui.cleanup }, { status: 'aborted', cleanup: 'uncertain' });

    const settledFault = await execute(gate => {
      t.mock.timers.tick(1);
      assert.equal(gate.start(() => undefined), true);
      throw new Error('synthetic settled observer fault');
    });
    assert.deepEqual({ status: settledFault.followup!.report.observation.ui.status,
      cleanup: settledFault.followup!.report.observation.ui.cleanup }, { status: 'failed', cleanup: 'complete' });

    let rejectLate!: (reason?: unknown) => void;
    const late = new Promise<void>((_resolve, reject) => { rejectLate = reject; });
    const lateOutcome = await execute(async () => { await late; });
    const snapshot = structuredClone(lateOutcome.followup!.report.observation.ui);
    assert.deepEqual({ status: snapshot.status, cleanup: snapshot.cleanup }, { status: 'aborted', cleanup: 'uncertain' });
    rejectLate(new Error('synthetic late observer rejection'));
    await Promise.resolve(); await Promise.resolve();
    assert.deepEqual(lateOutcome.followup!.report.observation.ui, snapshot);
  } finally {
    for (const root of roots.reverse()) if (fs.existsSync(root)) removeRoot(root);
    t.mock.timers.reset();
  }
});

test('rejects mismatched follow-up roots before entry and preserves published result on supplemental failure', async () => {
  const bundle = canonicalSyntheticBundle();
  const roots: string[] = [];
  try {
    const mismatchRoot = makeRoot(); roots.push(mismatchRoot);
    const mismatchNative = localNative(generationFixture().proposal);
    assert.deepEqual(await executeM602Case('local-image', {
      root: mismatchRoot, packageEnvironment: bundle.environment, requestImplementation: mismatchNative.request,
      followup: { reportRoot: path.join(mismatchRoot, 'wrong-followup-root') },
    } as never), { ok: false, error: 'evidence-blocked' });
    assert.deepEqual(fs.readdirSync(mismatchRoot), []);
    assert.equal(mismatchNative.calls.length, 0);

    const failureRoot = makeRoot(); roots.push(failureRoot);
    const failureNative = localNative(generationFixture().proposal);
    const reportRoot = path.join(failureRoot, 'followup-evidence');
    const filesystem = { openSync(target: fs.PathLike, flags: fs.OpenMode) {
      if (path.resolve(String(target)).startsWith(path.resolve(reportRoot))) throw new Error('synthetic supplemental failure');
      return fs.openSync(target, flags);
    } };
    assert.deepEqual(await executeM602Case('local-image', {
      root: failureRoot, packageEnvironment: bundle.environment, requestImplementation: failureNative.request,
      filesystem, followup: { reportRoot },
    } as never), { ok: false, error: 'evidence-publication' });
    assert.deepEqual(fs.readdirSync(path.join(failureRoot, 'local-image')).sort(), ['dispatch.json', 'entered.json', 'result.json']);
    assert.equal(failureNative.calls.length, 4);
    assert.deepEqual(await executeM602Case('local-image', {
      root: failureRoot, packageEnvironment: bundle.environment, requestImplementation: failureNative.request,
      followup: { reportRoot },
    } as never), { ok: false, error: 'evidence-blocked' });
    assert.equal(failureNative.calls.length, 4);

    const occupiedRoot = makeRoot(); roots.push(occupiedRoot);
    const occupiedNative = localNative(generationFixture().proposal);
    const occupiedReportRoot = path.join(occupiedRoot, 'followup-evidence');
    let occupiedIdentity: string | undefined;
    const occupiedFilesystem = { mkdirSync(target: fs.PathLike) {
      const absolute = path.resolve(String(target));
      if (path.dirname(absolute) === path.resolve(occupiedReportRoot) && /^[0-9a-f]{64}$/u.test(path.basename(absolute))) {
        occupiedIdentity = absolute;
        fs.mkdirSync(absolute);
      }
      return fs.mkdirSync(absolute);
    } };
    assert.deepEqual(await executeM602Case('local-image', {
      root: occupiedRoot, packageEnvironment: bundle.environment, requestImplementation: occupiedNative.request,
      filesystem: occupiedFilesystem, followup: { reportRoot: occupiedReportRoot },
    } as never), { ok: false, error: 'evidence-publication' });
    assert.ok(occupiedIdentity);
    assert.deepEqual(fs.readdirSync(path.join(occupiedRoot, 'local-image')).sort(), ['dispatch.json', 'entered.json', 'result.json']);
    assert.equal(occupiedNative.calls.length, 4);
  } finally {
    for (const root of roots.reverse()) if (fs.existsSync(root)) removeRoot(root);
  }
});

test('follow-up dependency binding rejects every incomplete injected combination without fallback', async () => {
  const bundle = canonicalSyntheticBundle();
  for (const label of ['local-image', 'groq-image'] as const) {
    const missingMembers = label === 'groq-image'
      ? (['root', 'environment', 'request', 'credential'] as const)
      : (['root', 'environment', 'request'] as const);
    for (const missing of missingMembers) {
      const root = makeRoot();
      let nativeCalls = 0;
      const credential = virtualCredentialIO();
      const dependencies: JsonRecord = {
        root, packageEnvironment: bundle.environment,
        requestImplementation: (() => { nativeCalls++; throw new Error('native fallback'); }) as never,
        ...(label === 'groq-image' ? { credentialIO: credential.io } : {}),
        followup: { reportRoot: path.join(root, 'followup-evidence'), observers: {
          ui: () => { throw new Error('observer fallback'); },
        } },
      };
      delete dependencies[missing === 'environment' ? 'packageEnvironment'
        : missing === 'request' ? 'requestImplementation' : missing === 'credential' ? 'credentialIO' : 'root'];
      try {
        assert.deepEqual(await executeM602Case(label, dependencies as never), { ok: false, error: 'evidence-blocked' });
        assert.equal(nativeCalls, 0);
        assert.equal(credential.calls.open.length, 0);
        assert.equal(fs.existsSync(path.join(root, label)), false);
        assert.equal(fs.existsSync(path.join(root, 'followup-evidence')), false);
      } finally { removeRoot(root); }
    }
  }
});

// M6-02 successor integration. These tests intentionally import the agreed first module so the
// complete boundary is blocked at module resolution until the separately owned Green creates it.
import { prepareM602SuccessorObservers as successorObserverCallable } from './helpers/m602-successor-observers.ts';
import { EventEmitter as SuccessorEventEmitter } from 'node:events';
import { PassThrough as SuccessorPassThrough } from 'node:stream';
import type { ClientRequest as SuccessorClientRequest, IncomingMessage as SuccessorIncomingMessage, RequestOptions as SuccessorRequestOptions } from 'node:http';
import type { OllamaNativeRequest as SuccessorNativeRequest } from '../src/server/generation/ollama-generation-http.ts';
import type { GroqCredentialIO as SuccessorCredentialIO } from '../src/server/generation/groq-credential.ts';
import type { EvidenceFilesystem as SuccessorEvidenceFilesystem } from './helpers/m602-evidence-files.ts';
import type { M602PackageEnvironment as SuccessorPackageEnvironment } from './helpers/m602-package.ts';
import type { M602SuccessorObserverIO as SuccessorObserverIO } from './helpers/m602-successor-observers.ts';

void successorObserverCallable;

const successorManifestPath = 'evaluation/m602-successor-v1.json';
const successorRevision = 'a'.repeat(40);
type SuccessorDependenciesFixture = {
  root: string;
  packageEnvironment: SuccessorPackageEnvironment;
  successorManifestEnvironment: SuccessorPackageEnvironment;
  requestImplementation: SuccessorNativeRequest;
  observerIO?: SuccessorObserverIO;
  credentialIO?: SuccessorCredentialIO;
  signal?: AbortSignal;
  filesystem?: Partial<SuccessorEvidenceFilesystem>;
};
type SuccessorOperationApi = {
  qualifyM602SuccessorObservers(dependencies?: Partial<SuccessorDependenciesFixture>): Promise<JsonRecord>;
  executeM602SuccessorCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<SuccessorDependenciesFixture>): Promise<JsonRecord>;
  readM602SuccessorCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<SuccessorDependenciesFixture>): Promise<JsonRecord>;
};

function successorManifest(bundle: SyntheticBundle) {
  const value = {
    version: 'm602-successor-v1', status: 'frozen', frozenAt: '2026-09-21T13:35:01.000Z',
    inputDefinition: { path: 'evaluation/m301-generation-v1.json', sha256: bundle.environment.manifestSha256 },
    caseOrder: caseLabels,
    executionPolicy: 'm602-successor-execution-v1',
    observationPolicy: { version: 'm602-successor-observation-v1', startDelayMs: 1000, deadlineMs: 5000,
      cleanupDeadlineMs: 5000, qualificationWindowMs: 7000 },
    groqAdmission: { version: 'm304-groq-request-bytes-v1', maximumBytes: 65536,
      exposedDefaults: 'groq-gpt-oss-20b-2026-09-11-v1' },
    rubric: 'inherit-input-definition', failureInterpretation: 'inherit-input-definition',
    advancement: 'accepted-proposal-and-qualified-observations', consumption: 'exclusive-case-directory',
    maximumEntriesPerCase: 1, maximumDispatchesPerCase: 1,
    stopOn: 'first-failed-invalid-unknown-or-unqualified-case', originalEvidence: 'preserved-separately',
  };
  const bytes = jsonBytes(value);
  return Object.freeze({ value: Object.freeze(value), bytes, environment: Object.freeze({
    manifestSha256: sha256(bytes),
    readBytes(relativePath: string) {
      if (relativePath === successorManifestPath) return bytes;
      return bundle.environment.readBytes(relativePath);
    },
  }) });
}

function prepareSuccessorRoot(root: string): void {
  fs.mkdirSync(path.join(root, 'runs'));
  fs.mkdirSync(path.join(root, 'client', 'assets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'observer-scratch'));
  fs.writeFileSync(path.join(root, 'client', 'index.html'), '<!doctype html><title>synthetic</title>\n', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'client', 'assets', 'index-C6L8S9Ht.css'), 'body{}\n', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'client', 'assets', 'index-C7OtU_Ke.js'), 'export {};\n', { flag: 'wx' });
}

function successorObserverHarness() {
  const calls: string[] = [];
  const delay = () => new Promise<void>(resolve => setTimeout(resolve, 50));
  const io = {
    async startApplication() {
      calls.push('application.start');
      return { ok: true, service: { url: 'http://127.0.0.1:41234',
        async stop() { calls.push('application.stop'); return { ok: true, status: 'stopped' }; } } };
    },
    async launchBrowser() {
      calls.push('browser.launch');
      let focused = false;
      let selectedMode: 'local' | 'groq' | undefined;
      let connected = true;
      let routeHandler: ((route: JsonRecord) => void | Promise<void>) | undefined;
      const target = { async isEnabled() { return true; }, async focus() { calls.push('ui.focus'); await delay(); focused = true; },
        async evaluate() { await delay(); return focused; } };
      const localRadio = { async isEnabled() { return true; }, async isChecked() { await delay(); return selectedMode === 'local'; },
        async check() { calls.push('local.check'); await delay(); selectedMode = 'local'; } };
      const groqRadio = { async isEnabled() { return true; }, async isChecked() { await delay(); return selectedMode === 'groq'; },
        async check() { calls.push('ui.change'); await delay(); selectedMode = 'groq'; } };
      const page = { on() {}, async route(_pattern: string, handler: (route: JsonRecord) => void | Promise<void>) { routeHandler = handler; },
        setDefaultTimeout() {}, async goto(url: string) {
          if (routeHandler) await routeHandler({ request: () => ({ url: () => url, method: () => 'GET' }), async continue() {}, async abort() {} });
          return { status: () => 200 };
        },
        getByLabel(name: string) { return name === 'Target URL' ? target : /Local/u.test(name) ? localRadio : groqRadio; } };
      const context = { async route(_pattern: string, handler: (route: JsonRecord) => void | Promise<void>) { routeHandler = handler; },
        async newPage() { return page; }, async close() { calls.push('context.close'); } };
      return { async newContext() { return context; }, async close() { calls.push('browser.close'); connected = false; },
        isConnected() { return connected; }, version() { return '151.0.7922.34'; } };
    },
    runtimeRequest: ((options: JsonRecord, callback: (response: JsonRecord) => void) => {
      calls.push(`runtime:${options.method}:${options.path}`);
      const handle = new SuccessorEventEmitter() as JsonRecord;
      const socket = new SuccessorEventEmitter() as JsonRecord;
      socket.destroyed = false;
      socket.destroy = () => { socket.destroyed = true; socket.emit('close'); };
      Object.defineProperty(handle, 'socket', { value: socket });
      handle.destroy = () => { handle.emit('close'); socket.destroy(); return handle; };
      handle.setTimeout = () => handle;
      handle.end = () => {
        const response = new SuccessorEventEmitter() as JsonRecord;
        response.statusCode = 200; response.headers = { 'content-type': 'application/json' };
        response.complete = false;
        response.socket = socket;
        response.destroyed = false;
        response.destroy = () => { response.destroyed = true; response.emit('close'); return response; };
        response.resume = () => response;
        setTimeout(() => {
          callback(response);
          response.emit('data', Buffer.from(JSON.stringify({ models: [{ name: 'qwen3.5:4b',
            digest: '2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd', context_length: 32768,
            size: 3_000_000_000, size_vram: 3_000_000_000 }] })));
          response.complete = true;
          response.emit('end'); response.emit('close'); handle.emit('close'); socket.destroy();
        }, 50);
        return handle;
      };
      return handle;
    }),
    spawnGpu: ((command: string, args: readonly string[], options: JsonRecord) => {
      calls.push(`gpu:${command}:${args.join('|')}:${options.shell}:${options.windowsHide}`);
      const child = new SuccessorEventEmitter() as JsonRecord;
      const stdout = new SuccessorPassThrough();
      const stderr = new SuccessorPassThrough();
      Object.assign(child, { stdout, stderr, kill() { child.emit('close', null); return true; } });
      setTimeout(() => { stdout.end('1000, 7000\n'); stderr.end(); child.emit('exit', 0); child.emit('close', 0); }, 50);
      return child;
    }),
    connect: ((..._args: unknown[]) => {
      const socket = new SuccessorEventEmitter() as JsonRecord;
      socket.destroy = () => { socket.emit('close'); return socket; };
      socket.setTimeout = () => socket;
      queueMicrotask(() => socket.emit('error', Object.assign(new Error('closed'), { code: 'ECONNREFUSED' })));
      return socket;
    }),
  };
  return { io, calls };
}

function successorEntryClock(root: string, tick?: () => void): Partial<SuccessorEvidenceFilesystem> | undefined {
  if (!tick) return undefined;
  const advanced = new Set<string>();
  const mkdirSync = ((target: fs.PathLike, options?: fs.MakeDirectoryOptions) => {
    const resolved = path.resolve(String(target));
    const label = path.basename(resolved);
    if (path.dirname(resolved) === root && caseLabels.includes(label as typeof caseLabels[number]) && !advanced.has(label)) {
      advanced.add(label);
      tick();
    }
    return fs.mkdirSync(target, options);
  }) as typeof fs.mkdirSync;
  return { mkdirSync };
}

function successorDependencies(root: string, bundle: SyntheticBundle, observer = successorObserverHarness(), entryTick?: () => void) {
  const manifest = successorManifest(bundle);
  const dependencies: SuccessorDependenciesFixture = {
    root, packageEnvironment: bundle.environment, successorManifestEnvironment: manifest.environment,
    requestImplementation: localNative(generationFixture().proposal).request, observerIO: observer.io as unknown as SuccessorObserverIO,
    filesystem: successorEntryClock(root, entryTick),
  };
  return { manifest, observer, dependencies };
}

async function driveSuccessor<T>(pending: Promise<T>, clock: { mock: { timers: { tick(milliseconds: number): void } } }): Promise<T> {
  let settled = false;
  const tracked = pending.then(value => { settled = true; return value; }, error => { settled = true; throw error; });
  for (let elapsed = 0; elapsed < 13_000 && !settled; elapsed += 250) {
    await new Promise<void>(resolve => setImmediate(resolve));
    clock.mock.timers.tick(250);
    for (let flush = 0; flush < 3; flush++) await Promise.resolve();
  }
  assert.equal(settled, true, 'Synthetic successor operation exceeded qualification plus cleanup bounds');
  return tracked;
}

function controlledSuccessorNative(candidate: unknown) {
  const metadata = validMetadata();
  const replies = [JSON.stringify(metadata.version), JSON.stringify(metadata.show), JSON.stringify(metadata.tags), ollamaChatBody(candidate)];
  const calls: JsonRecord[] = [];
  const request: SuccessorNativeRequest = (options: SuccessorRequestOptions, callback: (response: SuccessorIncomingMessage) => void) => {
    const index = calls.length;
    const call = { options: structuredClone(options), body: '', ended: false, destroyed: false };
    calls.push(call);
    const handle = new SuccessorEventEmitter() as SuccessorClientRequest & JsonRecord;
    const socket = new SuccessorEventEmitter() as JsonRecord;
    socket.destroyed = false;
    socket.destroy = () => { socket.destroyed = true; socket.emit('close'); };
    Object.defineProperty(handle, 'socket', { value: socket });
    handle.write = (chunk: unknown) => { call.body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk); return true; };
    handle.setTimeout = () => handle;
    handle.destroy = () => { call.destroyed = true; handle.emit('close'); socket.destroy(); return handle; };
    handle.end = (chunk?: unknown) => {
      call.ended = true;
      if (chunk !== undefined) call.body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
      const response = new SuccessorEventEmitter() as SuccessorIncomingMessage & JsonRecord;
      response.statusCode = 200; response.headers = { 'content-type': 'application/json' }; response.complete = false;
      Object.defineProperty(response, 'socket', { value: socket }); response.destroyed = false;
      response.destroy = () => { response.destroyed = true; response.emit('close'); return response; };
      response.resume = () => response;
      const startDelay = index === 3 ? 250 : 0;
      setTimeout(() => callback(response), startDelay);
      setTimeout(() => {
        response.emit('data', replies[index]);
        response.complete = true;
        response.emit('end'); response.emit('close'); handle.emit('close'); socket.destroy();
      }, index === 3 ? 3000 : 50);
      return handle;
    };
    return handle;
  };
  return { calls, request };
}

function withSuccessorRevision<T>(work: () => Promise<T>): Promise<T> {
  const previous = process.env.A11Y_APPLICATION_REVISION;
  process.env.A11Y_APPLICATION_REVISION = successorRevision;
  return work().finally(() => {
    if (previous === undefined) delete process.env.A11Y_APPLICATION_REVISION;
    else process.env.A11Y_APPLICATION_REVISION = previous;
  });
}

function writeSuccessorAssessment(root: string, bundle: SyntheticBundle, result: JsonRecord, observation: JsonRecord, accepted = true,
  mutate?: (assessment: JsonRecord) => void): void {
  const resultBytes = fs.readFileSync(path.join(root, result.caseLabel, 'result.json'));
  const observationBytes = fs.readFileSync(path.join(root, result.caseLabel, 'observation.json'));
  const finished = Date.parse(result.finishedAt);
  const localObservation = observation.samples === null ? null : {
    ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
    runtime: { observedAt: observation.timing.runtime.finishedAt, ...observation.samples.runtime },
    gpuBefore: observation.samples.gpuBefore,
    gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...observation.samples.gpuDuring },
    oomObserved: false,
  };
  const assessment: JsonRecord = {
    version: 'm602-successor-evidence-v1', caseLabel: result.caseLabel,
    resultSha256: sha256(resultBytes), observationSha256: sha256(observationBytes), evaluator: 'primary',
    assessedAt: new Date(finished + 60_000).toISOString(),
    dimensions: bundle.manifest.rubric.map(({ observation: observationName }: JsonRecord, index: number) => ({
      observation: observationName,
      value: index === 2 ? (result.caseLabel.endsWith('-image') ? 'fail' : 'not-run') : 'pass',
    })),
    uncertainty: 'pass', localObservation, accepted,
  };
  mutate?.(assessment);
  fs.writeFileSync(path.join(root, result.caseLabel, 'assessment.json'), jsonBytes(assessment), { flag: 'wx' });
}

test('successor operations reject every incomplete injected dependency set before entry or fallback', async () => {
  const operation = m602Operation as unknown as SuccessorOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const label of ['local-image', 'groq-image'] as const) {
    for (const missing of ['root', 'packageEnvironment', 'successorManifestEnvironment', 'requestImplementation',
      ...(label === 'local-image' ? ['observerIO'] : ['credentialIO'])] as (keyof SuccessorDependenciesFixture)[]) {
      const root = makeRoot();
      try {
        prepareSuccessorRoot(root);
        const fixture = successorDependencies(root, bundle);
        const complete: Partial<SuccessorDependenciesFixture> = { ...fixture.dependencies };
        if (label === 'groq-image') {
          complete.requestImplementation = groqNativeHarness([{ body: groqChatBody(generationFixture().proposal) }]).request;
          complete.credentialIO = virtualCredentialIO().io;
          delete complete.observerIO;
        }
        delete complete[missing];
        const outcome = await operation.executeM602SuccessorCase(label, complete);
        assert.equal(outcome.ok, false, `${label}:${missing}`);
        assert.deepEqual(outcome.cleanup, { ui: 'not-created', runtime: 'not-created', gpu: 'not-created',
          application: 'not-created', browser: 'not-created', scratch: 'not-created' });
        assert.deepEqual(fs.readdirSync(root).sort(), ['client', 'observer-scratch', 'runs']);
        assert.deepEqual(fixture.observer.calls, []);
      } finally { removeRoot(root); }
    }
  }
});

test('qualification authenticates synthetic manifest/build identity and reuses only exact immutable evidence', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T15:00:00.000Z') });
  const operation = m602Operation as unknown as SuccessorOperationApi;
  const root = makeRoot();
  try {
    prepareSuccessorRoot(root);
    const bundle = canonicalSyntheticBundle();
    const fixture = successorDependencies(root, bundle, successorObserverHarness());
    const first = await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies)), t);
    assert.equal(first.ok, true);
    assert.equal(first.qualification.version, 'm602-successor-qualification-v1');
    assert.equal(first.qualification.campaign, 'm602-successor-v1');
    assert.equal(first.qualification.applicationRevision, successorRevision);
    assert.equal(first.qualification.nodeVersion, 'v24.20.0');
    assert.equal(first.qualification.browserVersion, '151.0.7922.34');
    assert.deepEqual(first.qualification.build.map((entry: JsonRecord) => entry.path),
      ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-C7OtU_Ke.js']);
    assert.deepEqual(first.qualification.cleanup, { ui: 'complete', runtime: 'not-created', gpu: 'complete',
      application: 'complete', browser: 'complete', scratch: 'complete' });
    const bytes = fs.readFileSync(path.join(root, 'qualification.json'));
    assert.equal(sha256(bytes), first.sha256);
    const callCount = fixture.observer.calls.length;
    const reused = await withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies));
    assert.deepEqual(reused, first);
    assert.equal(fixture.observer.calls.length, callCount);
    fs.writeFileSync(path.join(root, 'client', 'index.html'), '<!doctype html><title>drift</title>\n');
    assert.equal((await withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies))).ok, false);
    assert.deepEqual(fs.readFileSync(path.join(root, 'qualification.json')), bytes);
  } finally { removeRoot(root); }
});

test('successor Local execution publishes one closed observation and immutable readback without original follow-up output', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T16:00:00.000Z') });
  const operation = m602Operation as unknown as SuccessorOperationApi;
  const root = makeRoot();
  try {
    prepareSuccessorRoot(root);
    const bundle = canonicalSyntheticBundle();
    const fixture = successorDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const native = controlledSuccessorNative(generationFixture().proposal);
    fixture.dependencies.requestImplementation = native.request;
    const qualified = await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies)), t);
    assert.equal(qualified.ok, true);
    const execution = await driveSuccessor(withSuccessorRevision(() => operation.executeM602SuccessorCase('local-image', fixture.dependencies)), t);
    assert.equal(execution.ok, true);
    assert.equal(execution.result.version, 'm602-successor-evidence-v1');
    assert.equal(execution.observation.version, 'm602-successor-observation-v1');
    assert.equal(execution.observation.campaign, 'm602-successor-v1');
    assert.equal(execution.observation.qualificationSha256, qualified.sha256);
    assert.equal(native.calls.length, 4);
    assert.deepEqual(execution.observation.cleanup, { ui: 'complete', runtime: 'complete', gpu: 'complete',
      application: 'complete', browser: 'complete', scratch: 'complete' });
    assert.equal(fs.existsSync(path.join(root, 'followup-evidence')), false);
    assert.deepEqual(fs.readdirSync(path.join(root, 'local-image')).sort(),
      ['dispatch.json', 'entered.json', 'observation.json', 'result.json']);
    const calls = fixture.observer.calls.length;
    const read = await operation.readM602SuccessorCase('local-image', {
      root, packageEnvironment: bundle.environment, successorManifestEnvironment: fixture.manifest.environment,
      filesystem: { mkdirSync() { throw new Error('readback must not write'); } },
    });
    assert.equal(read.ok, true);
    assert.equal(read.assessment, null);
    assert.deepEqual(read.result, execution.result);
    assert.deepEqual(read.observation, execution.observation);
    assert.equal(fixture.observer.calls.length, calls);
    assert.equal((await operation.executeM602SuccessorCase('local-image', fixture.dependencies)).ok, false);
  } finally { removeRoot(root); }
});

test('successor identity, occupancy, partial publication, and original predecessor evidence all fail closed', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T16:30:00.000Z') });
  const operation = m602Operation as unknown as SuccessorOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const fault of ['manifest', 'occupied-qualification', 'partial-case', 'original-predecessor', 'code-drift'] as const) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      const fixture = successorDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      if (fault === 'occupied-qualification') {
        const witnessRoot = makeRoot();
        try {
          prepareSuccessorRoot(witnessRoot);
          const witness = successorDependencies(witnessRoot, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
          assert.equal((await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(witness.dependencies)), t)).ok,
            true, `${fault}: positive qualification witness`);
        } finally { removeRoot(witnessRoot); }
      } else {
        const qualified = await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies)), t);
        assert.equal(qualified.ok, true, `${fault}: positive qualification witness`);
      }
      const baselineCalls = fixture.observer.calls.length;
      if (fault === 'manifest') fixture.dependencies.successorManifestEnvironment = {
        ...fixture.manifest.environment, manifestSha256: '0'.repeat(64),
      };
      if (fault === 'occupied-qualification') fs.writeFileSync(path.join(root, 'qualification.json'), '{}\n', { flag: 'wx' });
      if (fault === 'partial-case') { fs.mkdirSync(path.join(root, 'local-image')); fs.writeFileSync(path.join(root, 'local-image', 'entered.json'), '{}\n'); }
      if (fault === 'original-predecessor') {
        fs.mkdirSync(path.join(root, 'local-image'));
        fs.writeFileSync(path.join(root, 'local-image', 'result.json'), jsonBytes({ version: 'm602-evidence-v1', caseLabel: 'local-image' }));
      }
      if (fault === 'code-drift') {
        const readFileSync = ((target: fs.PathOrFileDescriptor,
          options?: BufferEncoding | { encoding?: BufferEncoding | null; flag?: string } | null) => {
          const bytes = fs.readFileSync(target, options as never);
          if (!String(target).endsWith('m602-successor-observers.ts')) return bytes;
          return Buffer.isBuffer(bytes) ? Buffer.from(`${bytes.toString()}\n`) : `${bytes}\n`;
        }) as typeof fs.readFileSync;
        fixture.dependencies.filesystem = { ...fixture.dependencies.filesystem, readFileSync };
      }
      const outcome = await withSuccessorRevision(() => operation.executeM602SuccessorCase(
        fault === 'original-predecessor' ? 'local-label' : 'local-image', fixture.dependencies));
      assert.equal(outcome.ok, false, fault);
      assert.equal(fixture.observer.calls.length, baselineCalls, fault);
    } finally { removeRoot(root); }
  }
});

test('advancement requires exact linked qualified observation and accepted assessment projection', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T17:00:00.000Z') });
  const operation = m602Operation as unknown as SuccessorOperationApi;
  for (const fault of ['missing', 'rejected', 'projection', 'oom', 'observation-hash'] as const) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      const bundle = canonicalSyntheticBundle();
      const fixture = successorDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      fixture.dependencies.requestImplementation = controlledSuccessorNative(generationFixture().proposal).request;
      assert.equal((await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies)), t)).ok, true);
      const first = await driveSuccessor(withSuccessorRevision(() => operation.executeM602SuccessorCase('local-image', fixture.dependencies)), t);
      assert.equal(first.ok, true);
      if (!first.ok) continue;
      if (fault !== 'missing') writeSuccessorAssessment(root, bundle, first.result, first.observation, fault !== 'rejected', assessment => {
        if (fault === 'projection') assessment.localObservation.runtime.contextLength++;
        if (fault === 'oom') assessment.localObservation.oomObserved = true;
        if (fault === 'observation-hash') assessment.observationSha256 = '0'.repeat(64);
      });
      const nextCalls = localNative(generationFixture('label').proposal);
      const next = await withSuccessorRevision(() => operation.executeM602SuccessorCase('local-label', {
        ...fixture.dependencies, requestImplementation: nextCalls.request,
      }));
      assert.equal(next.ok, false, fault);
      assert.equal(nextCalls.calls.length, 0, fault);
      assert.equal(fs.existsSync(path.join(root, 'local-label')), false, fault);
    } finally { removeRoot(root); }
  }
});

test('Groq successor uses no observer primitive and cannot mix original or Local qualification evidence', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T18:00:00.000Z') });
  const operation = m602Operation as unknown as SuccessorOperationApi;
  const root = makeRoot();
  try {
    prepareSuccessorRoot(root);
    const bundle = canonicalSyntheticBundle();
    const fixture = successorDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    fixture.dependencies.requestImplementation = controlledSuccessorNative(generationFixture().proposal).request;
    assert.equal((await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies)), t)).ok, true);
    for (const label of ['local-image', 'local-label', 'local-contrast'] as const) {
      const native = controlledSuccessorNative(generationFixture(label === 'local-image' ? 'image-alt' : label === 'local-label' ? 'label' : 'color-contrast').proposal);
      const executed = await driveSuccessor(withSuccessorRevision(() => operation.executeM602SuccessorCase(label,
        { ...fixture.dependencies, requestImplementation: native.request })), t);
      assert.equal(executed.ok, true, label);
      writeSuccessorAssessment(root, bundle, executed.result, executed.observation);
    }
    const observerCalls = fixture.observer.calls.length;
    const native = groqNativeHarness([{ body: groqChatBody(generationFixture().proposal) }]);
    const credential = virtualCredentialIO();
    const groq = await withSuccessorRevision(() => operation.executeM602SuccessorCase('groq-image', {
      root, packageEnvironment: bundle.environment, successorManifestEnvironment: fixture.manifest.environment,
      requestImplementation: native.request, credentialIO: credential.io,
    }));
    assert.equal(groq.ok, true);
    assert.equal(fixture.observer.calls.length, observerCalls);
    assert.equal(groq.observation.samples, null);
    assert.deepEqual(groq.observation.cleanup, { ui: 'not-created', runtime: 'not-created', gpu: 'not-created',
      application: 'not-created', browser: 'not-created', scratch: 'not-created' });
  } finally { removeRoot(root); }
});

test('pre-entry, partial source, observation, and qualification publication failures preserve exact cleanup receipts', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T19:00:00.000Z') });
  const operation = m602Operation as unknown as SuccessorOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const failure of ['pre-entry', 'qualification-write', 'source-write', 'observation-write'] as const) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      const fixture = successorDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      fixture.dependencies.requestImplementation = controlledSuccessorNative(generationFixture().proposal).request;
      let openCount = 0;
      fixture.dependencies.filesystem = { ...fixture.dependencies.filesystem, openSync(target: fs.PathLike, flags: fs.OpenMode) {
        openCount++;
        const name = path.basename(String(target));
        if ((failure === 'qualification-write' && name === 'qualification.json') ||
          (failure === 'source-write' && name === 'result.json') ||
          (failure === 'observation-write' && name === 'observation.json')) throw new Error('controlled publication failure');
        return fs.openSync(target, flags);
      } };
      if (failure === 'pre-entry') fixture.observer.io.startApplication = async () => ({ ok: false, error: 'storage-unavailable' }) as never;
      const qualified = await driveSuccessor(withSuccessorRevision(() => operation.qualifyM602SuccessorObservers(fixture.dependencies)), t);
      if (failure === 'qualification-write' || failure === 'pre-entry') {
        assert.equal(qualified.ok, false, failure);
        if (!qualified.ok) assert.ok(['observer-readiness', 'evidence-publication'].includes(qualified.error));
        assert.equal(fs.existsSync(path.join(root, 'local-image')), false);
        continue;
      }
      assert.equal(qualified.ok, true);
      const executed = await driveSuccessor(withSuccessorRevision(() => operation.executeM602SuccessorCase('local-image', fixture.dependencies)), t);
      assert.equal(executed.ok, false, failure);
      if (!executed.ok) {
        assert.equal(executed.error, 'evidence-publication');
        assert.equal(executed.cleanup.application, 'complete');
        assert.equal(executed.cleanup.browser, 'complete');
        assert.equal(Object.isFrozen(executed.cleanup), true);
      }
      assert.equal(openCount > 0, true);
    } finally { removeRoot(root); }
  }
});

// M6-02 completion integration. The named import is the contracted first-module Red: every
// behavioral assertion below remains blocked until the separately owned Green adds the callable.
import { qualifyM602CompletionObservers } from './helpers/m602-operation.ts';

void qualifyM602CompletionObservers;

const completionManifestPath = 'evaluation/m602-completion-v1.json';
type CompletionDependenciesFixture = Omit<SuccessorDependenciesFixture, 'successorManifestEnvironment'> & {
  completionManifestEnvironment: SuccessorPackageEnvironment;
};
type CompletionOperationApi = {
  qualifyM602CompletionObservers(dependencies?: Partial<CompletionDependenciesFixture>): Promise<JsonRecord>;
  executeM602CompletionCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<CompletionDependenciesFixture>): Promise<JsonRecord>;
  readM602CompletionCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<CompletionDependenciesFixture>): Promise<JsonRecord>;
};

function completionManifest(bundle: SyntheticBundle) {
  const value = {
    version: 'm602-completion-v1', status: 'frozen', frozenAt: '2026-09-21T19:02:40.166Z',
    inputDefinition: { path: 'evaluation/m301-generation-v1.json', sha256: bundle.environment.manifestSha256 },
    caseOrder: caseLabels,
    executionPolicy: 'm602-successor-execution-v1',
    observationPolicy: { version: 'm602-successor-observation-v1', startDelayMs: 1000, deadlineMs: 5000,
      cleanupDeadlineMs: 5000, qualificationWindowMs: 7000 },
    groqAdmission: { version: 'm304-groq-request-bytes-v1', maximumBytes: 65536,
      exposedDefaults: 'groq-gpt-oss-20b-2026-09-11-v1' },
    rubric: 'inherit-input-definition', failureInterpretation: 'inherit-input-definition',
    advancement: 'accepted-proposal-and-qualified-observations', consumption: 'exclusive-case-directory',
    maximumEntriesPerCase: 1, maximumDispatchesPerCase: 1,
    stopOn: 'first-failed-invalid-unknown-or-unqualified-case', originalEvidence: 'preserved-separately',
  };
  const bytes = jsonBytes(value);
  return Object.freeze({ value: Object.freeze(value), bytes, environment: Object.freeze({
    manifestSha256: sha256(bytes),
    readBytes(relativePath: string) {
      if (relativePath === completionManifestPath) return bytes;
      return bundle.environment.readBytes(relativePath);
    },
  }) });
}

function completionDependencies(root: string, bundle: SyntheticBundle, observer = successorObserverHarness(), entryTick?: () => void) {
  const manifest = completionManifest(bundle);
  const dependencies: CompletionDependenciesFixture = {
    root, packageEnvironment: bundle.environment, completionManifestEnvironment: manifest.environment,
    requestImplementation: localNative(generationFixture().proposal).request,
    observerIO: observer.io as unknown as SuccessorObserverIO,
    filesystem: successorEntryClock(root, entryTick),
  };
  return { manifest, observer, dependencies };
}

function completionProposal(label: typeof caseLabels[number]) {
  return generationFixture(label.endsWith('-image') ? 'image-alt'
    : label.endsWith('-label') ? 'label' : 'color-contrast').proposal;
}

function writeCompletionAssessment(root: string, bundle: SyntheticBundle, result: JsonRecord, observation: JsonRecord,
  accepted = true, mutate?: (assessment: JsonRecord) => void): void {
  const resultBytes = fs.readFileSync(path.join(root, result.caseLabel, 'result.json'));
  const observationBytes = fs.readFileSync(path.join(root, result.caseLabel, 'observation.json'));
  const finished = Date.parse(result.finishedAt);
  const localObservation = observation.samples === null ? null : {
    ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
    runtime: { observedAt: observation.timing.runtime.finishedAt, ...observation.samples.runtime },
    gpuBefore: observation.samples.gpuBefore,
    gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...observation.samples.gpuDuring },
    oomObserved: false,
  };
  const assessment: JsonRecord = {
    version: 'm602-completion-evidence-v1', caseLabel: result.caseLabel,
    resultSha256: sha256(resultBytes), observationSha256: sha256(observationBytes), evaluator: 'primary',
    assessedAt: new Date(finished + 60_000).toISOString(),
    dimensions: bundle.manifest.rubric.map(({ observation: observationName }: JsonRecord, index: number) => ({
      observation: observationName,
      value: index === 2 ? (result.caseLabel.endsWith('-image') ? 'fail' : 'not-run') : 'pass',
    })),
    uncertainty: 'pass', localObservation, accepted,
  };
  mutate?.(assessment);
  fs.writeFileSync(path.join(root, result.caseLabel, 'assessment.json'), jsonBytes(assessment), { flag: 'wx' });
}

async function qualifyCompletion(root: string, bundle: SyntheticBundle,
  clock: { mock: { timers: { tick(milliseconds: number): void } } }, tick?: () => void) {
  const operation = m602Operation as unknown as CompletionOperationApi;
  const fixture = completionDependencies(root, bundle, successorObserverHarness(), tick);
  const dependencies: Partial<CompletionDependenciesFixture> = { ...fixture.dependencies };
  delete dependencies.requestImplementation;
  const outcome = await driveSuccessor(withSuccessorRevision(() =>
    operation.qualifyM602CompletionObservers(dependencies)), clock);
  assert.equal(outcome.ok, true);
  return { outcome, fixture };
}

test('completion qualification and execution reject every incomplete injected dependency before effects or fallback', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T20:00:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const missing of ['root', 'packageEnvironment', 'completionManifestEnvironment',
    'observerIO'] as (keyof CompletionDependenciesFixture)[]) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      const fixture = completionDependencies(root, bundle);
      const incomplete: Partial<CompletionDependenciesFixture> = { ...fixture.dependencies };
      delete incomplete.requestImplementation;
      delete incomplete[missing];
      const outcome = await withSuccessorRevision(() => operation.qualifyM602CompletionObservers(incomplete));
      assert.equal(outcome.ok, false, `qualification:${missing}`);
      assert.deepEqual(outcome.cleanup, { ui: 'not-created', runtime: 'not-created', gpu: 'not-created',
        application: 'not-created', browser: 'not-created', scratch: 'not-created' });
      assert.deepEqual(fixture.observer.calls, []);
      assert.equal(fs.existsSync(path.join(root, 'qualification.json')), false);
    } finally { removeRoot(root); }
  }
  for (const missing of ['root', 'packageEnvironment', 'completionManifestEnvironment', 'requestImplementation',
    'observerIO'] as (keyof CompletionDependenciesFixture)[]) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
      const fixture = completionDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const native = controlledSuccessorNative(completionProposal('local-image'));
      fixture.dependencies.requestImplementation = native.request;
      const incomplete: Partial<CompletionDependenciesFixture> = { ...fixture.dependencies };
      delete incomplete[missing];
      const outcome = await withSuccessorRevision(() => operation.executeM602CompletionCase('local-image', incomplete));
      assert.equal(outcome.ok, false, `execution:${missing}`);
      assert.equal(native.calls.length, 0, `execution:${missing}`);
      assert.deepEqual(fixture.observer.calls, [], `execution:${missing}`);
      assert.equal(fs.existsSync(path.join(root, 'local-image')), false, `execution:${missing}`);
    } finally { removeRoot(root); }
  }
});

test('completion qualification binds only its manifest, current code, build, and application revision', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T20:30:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const bundle = canonicalSyntheticBundle();
  const previousRevision = process.env.A11Y_APPLICATION_REVISION;
  for (const fault of ['manifest', 'code', 'build', 'revision'] as const) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      const qualified = await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
      assert.equal(qualified.outcome.qualification.version, 'm602-completion-qualification-v1');
      assert.equal(qualified.outcome.qualification.campaign, 'm602-completion-v1');
      assert.equal(qualified.outcome.qualification.applicationRevision, successorRevision);
      assert.equal(sha256(fs.readFileSync(path.join(root, 'qualification.json'))), qualified.outcome.sha256);
      const fixture = completionDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const native = controlledSuccessorNative(completionProposal('local-image'));
      fixture.dependencies.requestImplementation = native.request;
      if (fault === 'manifest') fixture.dependencies.completionManifestEnvironment = {
        ...fixture.manifest.environment, manifestSha256: '0'.repeat(64),
      };
      if (fault === 'build') fs.writeFileSync(path.join(root, 'client', 'index.html'), '<!doctype html><title>drift</title>\n');
      if (fault === 'revision') process.env.A11Y_APPLICATION_REVISION = 'b'.repeat(40);
      if (fault === 'code') {
        const readFileSync = ((target: fs.PathOrFileDescriptor,
          options?: BufferEncoding | { encoding?: BufferEncoding | null; flag?: string } | null) => {
          const bytes = fs.readFileSync(target, options as never);
          if (!String(target).endsWith('m602-operation.ts')) return bytes;
          return Buffer.isBuffer(bytes) ? Buffer.from(`${bytes.toString()}\n`) : `${bytes}\n`;
        }) as typeof fs.readFileSync;
        fixture.dependencies.filesystem = { ...fixture.dependencies.filesystem, readFileSync };
      }
      const outcome = fault === 'revision'
        ? await operation.executeM602CompletionCase('local-image', fixture.dependencies)
        : await withSuccessorRevision(() => operation.executeM602CompletionCase('local-image', fixture.dependencies));
      assert.equal(outcome.ok, false, fault);
      assert.equal(native.calls.length, 0, fault);
      assert.deepEqual(fixture.observer.calls, [], fault);
    } finally {
      if (previousRevision === undefined) delete process.env.A11Y_APPLICATION_REVISION;
      else process.env.A11Y_APPLICATION_REVISION = previousRevision;
      removeRoot(root);
    }
  }
});

test('completion executes and reads back exactly six ordered cases with fresh Local observers and no Groq observers', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T21:00:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const root = makeRoot();
  try {
    prepareSuccessorRoot(root);
    const bundle = canonicalSyntheticBundle();
    const qualified = await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
    const manifest = completionManifest(bundle);
    const observedOrder: string[] = [];
    for (const label of caseLabels) {
      const isLocal = label.startsWith('local-');
      const observer = successorObserverHarness();
      const fixture = completionDependencies(root, bundle, observer, () => t.mock.timers.tick(1));
      const credential = virtualCredentialIO();
      const local = controlledSuccessorNative(completionProposal(label));
      const groq = groqNativeHarness([{ body: groqChatBody(completionProposal(label)) }]);
      if (isLocal) fixture.dependencies.requestImplementation = local.request;
      else {
        fixture.dependencies.requestImplementation = groq.request;
        fixture.dependencies.credentialIO = credential.io;
        delete fixture.dependencies.observerIO;
      }
      if (label === 'groq-image') {
        const missingCredential = { ...fixture.dependencies };
        delete missingCredential.credentialIO;
        const blocked = await withSuccessorRevision(() => operation.executeM602CompletionCase(label, missingCredential));
        assert.equal(blocked.ok, false);
        assert.equal(groq.calls.length, 0);
        assert.equal(credential.calls.open.length, 0);
        assert.equal(fs.existsSync(path.join(root, label)), false);
      }
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602CompletionCase(label, fixture.dependencies)), t);
      assert.equal(executed.ok, true, label);
      assert.equal(executed.result.status, 'proposal', label);
      assert.equal(executed.result.version, 'm602-completion-evidence-v1', label);
      assert.equal(executed.observation.version, 'm602-completion-observation-v1', label);
      assert.equal(executed.observation.campaign, 'm602-completion-v1', label);
      assert.equal(executed.observation.qualificationSha256, qualified.outcome.sha256, label);
      assert.equal(executed.observationSha256,
        sha256(fs.readFileSync(path.join(root, label, 'observation.json'))), label);
      if (isLocal) {
        assert.equal(local.calls.length, 4, label);
        assert.equal(observer.calls.includes('application.start'), true, label);
        assert.deepEqual(executed.observation.cleanup, { ui: 'complete', runtime: 'complete', gpu: 'complete',
          application: 'complete', browser: 'complete', scratch: 'complete' });
      } else {
        assert.equal(observer.calls.length, 0, label);
        assert.equal(groq.calls.length, 1, label);
        assert.equal(credential.calls.open.length, 1, label);
        assert.equal(credential.calls.buffers.every(bytes => bytes.every(byte => byte === 0)), true, label);
        assert.equal(executed.observation.samples, null, label);
      }
      observedOrder.push(label);
      writeCompletionAssessment(root, bundle, executed.result, executed.observation);
      const read = await operation.readM602CompletionCase(label, {
        root, packageEnvironment: bundle.environment, completionManifestEnvironment: manifest.environment,
        filesystem: { mkdirSync() { throw new Error('completion readback must not write'); } },
      });
      assert.equal(read.ok, true, label);
      assert.deepEqual(read.result, executed.result, label);
      assert.deepEqual(read.observation, executed.observation, label);
      assert.equal(read.assessment.accepted, true, label);
    }
    assert.deepEqual(observedOrder, caseLabels);
    assert.deepEqual(fs.readdirSync(root).filter(name => caseLabels.includes(name as typeof caseLabels[number])).sort(),
      [...caseLabels].sort());
    const duplicate = completionDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const duplicateNative = controlledSuccessorNative(completionProposal('local-image'));
    duplicate.dependencies.requestImplementation = duplicateNative.request;
    assert.equal((await withSuccessorRevision(() =>
      operation.executeM602CompletionCase('local-image', duplicate.dependencies))).ok, false);
    assert.equal(duplicateNative.calls.length, 0);
    assert.deepEqual(duplicate.observer.calls, []);
    for (const missing of ['root', 'packageEnvironment', 'completionManifestEnvironment'] as const) {
      const dependencies: JsonRecord = { root, packageEnvironment: bundle.environment,
        completionManifestEnvironment: manifest.environment };
      delete dependencies[missing];
      assert.deepEqual(await operation.readM602CompletionCase('local-image', dependencies),
        { ok: false, error: 'evidence-blocked' }, `readback:${missing}`);
    }
  } finally { removeRoot(root); }
});

test('completion rejects valid original and successor evidence and preserves occupied, partial, and concurrent one-use records', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T22:00:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const successorOperation = m602Operation as unknown as SuccessorOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const campaign of ['original', 'successor'] as const) {
    const completionRoot = makeRoot();
    const witnessRoot = makeRoot();
    try {
      prepareSuccessorRoot(completionRoot);
      await qualifyCompletion(completionRoot, bundle, t, () => t.mock.timers.tick(1));
      if (campaign === 'original') {
        const native = advancingLocalNative(completionProposal('local-image'), () => t.mock.timers.tick(20));
        const witness = await executeM602Case('local-image', {
          root: witnessRoot, packageEnvironment: bundle.environment, requestImplementation: native.request,
        });
        assert.equal(witness.ok, true);
        writeAssessment(witnessRoot, witness.result, bundle.manifest);
        const read = await readM602Case('local-image', { root: witnessRoot, packageEnvironment: bundle.environment });
        assert.ok(read.ok && read.assessment?.accepted);
      } else {
        prepareSuccessorRoot(witnessRoot);
        const qualificationFixture = successorDependencies(witnessRoot, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
        assert.equal((await driveSuccessor(withSuccessorRevision(() =>
          successorOperation.qualifyM602SuccessorObservers(qualificationFixture.dependencies)), t)).ok, true);
        const fixture = successorDependencies(witnessRoot, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
        fixture.dependencies.requestImplementation = controlledSuccessorNative(completionProposal('local-image')).request;
        const witness = await driveSuccessor(withSuccessorRevision(() =>
          successorOperation.executeM602SuccessorCase('local-image', fixture.dependencies)), t);
        assert.equal(witness.ok, true);
        writeSuccessorAssessment(witnessRoot, bundle, witness.result, witness.observation);
        const read = await successorOperation.readM602SuccessorCase('local-image', {
          root: witnessRoot, packageEnvironment: bundle.environment,
          successorManifestEnvironment: fixture.manifest.environment,
        });
        assert.ok(read.ok && read.assessment?.accepted);
      }
      fs.cpSync(path.join(witnessRoot, 'local-image'), path.join(completionRoot, 'local-image'), { recursive: true });
      const next = completionDependencies(completionRoot, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const native = controlledSuccessorNative(completionProposal('local-label'));
      next.dependencies.requestImplementation = native.request;
      assert.equal((await withSuccessorRevision(() =>
        operation.executeM602CompletionCase('local-label', next.dependencies))).ok, false, campaign);
      assert.equal(native.calls.length, 0, campaign);
      assert.deepEqual(next.observer.calls, [], campaign);
    } finally { removeRoot(witnessRoot); removeRoot(completionRoot); }
  }
  for (const occupied of ['empty', 'partial'] as const) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
      const directory = path.join(root, 'local-image');
      fs.mkdirSync(directory);
      if (occupied === 'partial') fs.writeFileSync(path.join(directory, 'entered.json'), '{"partial":true}\n', { flag: 'wx' });
      const before = fs.readdirSync(directory).map(name => [name, fs.readFileSync(path.join(directory, name))] as const);
      const fixture = completionDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const native = controlledSuccessorNative(completionProposal('local-image'));
      fixture.dependencies.requestImplementation = native.request;
      assert.equal((await withSuccessorRevision(() =>
        operation.executeM602CompletionCase('local-image', fixture.dependencies))).ok, false, occupied);
      assert.equal(native.calls.length, 0, occupied);
      assert.deepEqual(fixture.observer.calls, [], occupied);
      assert.deepEqual(fs.readdirSync(directory), before.map(([name]) => name));
      for (const [name, bytes] of before) assert.deepEqual(fs.readFileSync(path.join(directory, name)), bytes);
    } finally { removeRoot(root); }
  }
  const concurrentRoot = makeRoot();
  try {
    prepareSuccessorRoot(concurrentRoot);
    await qualifyCompletion(concurrentRoot, bundle, t, () => t.mock.timers.tick(1));
    const left = completionDependencies(concurrentRoot, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const right = completionDependencies(concurrentRoot, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const leftNative = controlledSuccessorNative(completionProposal('local-image'));
    const rightNative = controlledSuccessorNative(completionProposal('local-image'));
    left.dependencies.requestImplementation = leftNative.request;
    right.dependencies.requestImplementation = rightNative.request;
    const outcomes = await driveSuccessor(withSuccessorRevision(() => Promise.all([
      operation.executeM602CompletionCase('local-image', left.dependencies),
      operation.executeM602CompletionCase('local-image', right.dependencies),
    ])), t);
    assert.equal(outcomes.filter(outcome => outcome.ok).length, 1);
    assert.equal(outcomes.filter(outcome => !outcome.ok).length, 1);
    assert.equal(leftNative.calls.length + rightNative.calls.length, 4);
    assert.deepEqual(fs.readdirSync(path.join(concurrentRoot, 'local-image')).sort(),
      ['dispatch.json', 'entered.json', 'observation.json', 'result.json']);
  } finally { removeRoot(concurrentRoot); }
});

test('completion stops before the next case for failed, unknown, unqualified, or invalid predecessor evidence', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T23:00:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const fault of ['missing-assessment', 'malformed-assessment', 'rejected', 'projection', 'oom',
    'assessment-observation-link', 'observation-result-link', 'uncertain-cleanup', 'failed', 'unknown'] as const) {
    const root = makeRoot();
    try {
      prepareSuccessorRoot(root);
      await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
      const firstFixture = completionDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const firstNative = controlledSuccessorNative(fault === 'failed' ? { invalid: true } : completionProposal('local-image'));
      firstFixture.dependencies.requestImplementation = firstNative.request;
      const first = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602CompletionCase('local-image', firstFixture.dependencies)), t);
      assert.equal(first.ok, true, fault);
      if (!first.ok) continue;
      let assessmentObservation = first.observation;
      if (fault === 'malformed-assessment') {
        fs.writeFileSync(path.join(root, 'local-image', 'assessment.json'), '{}\n', { flag: 'wx' });
      } else if (!['missing-assessment', 'failed', 'unknown'].includes(fault)) {
        if (fault === 'observation-result-link' || fault === 'uncertain-cleanup') {
          const observationPath = path.join(root, 'local-image', 'observation.json');
          const observation = JSON.parse(fs.readFileSync(observationPath, 'utf8')) as JsonRecord;
          if (fault === 'observation-result-link') observation.resultSha256 = '0'.repeat(64);
          else observation.cleanup.application = 'uncertain';
          fs.writeFileSync(observationPath, jsonBytes(observation));
          assessmentObservation = observation;
        }
        writeCompletionAssessment(root, bundle, first.result, assessmentObservation, fault !== 'rejected', assessment => {
          if (fault === 'projection') assessment.localObservation.runtime.contextLength++;
          if (fault === 'oom') assessment.localObservation.oomObserved = true;
          if (fault === 'assessment-observation-link') assessment.observationSha256 = '0'.repeat(64);
        });
      }
      if (fault === 'unknown') {
        const resultPath = path.join(root, 'local-image', 'result.json');
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as JsonRecord;
        result.status = 'unknown';
        fs.writeFileSync(resultPath, jsonBytes(result));
      }
      const nextFixture = completionDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const nextNative = controlledSuccessorNative(completionProposal('local-label'));
      nextFixture.dependencies.requestImplementation = nextNative.request;
      const next = await withSuccessorRevision(() =>
        operation.executeM602CompletionCase('local-label', nextFixture.dependencies));
      assert.equal(next.ok, false, fault);
      assert.equal(nextNative.calls.length, 0, fault);
      assert.deepEqual(nextFixture.observer.calls, [], fault);
      assert.equal(fs.existsSync(path.join(root, 'local-label')), false, fault);
    } finally { removeRoot(root); }
  }
});

test('completion blocks producer-code drift introduced during awaited observer preparation before entry', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T23:30:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const root = makeRoot();
  try {
    prepareSuccessorRoot(root);
    const bundle = canonicalSyntheticBundle();
    await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
    const qualificationBytes = fs.readFileSync(path.join(root, 'qualification.json'));
    const observer = successorObserverHarness();
    const fixture = completionDependencies(root, bundle, observer, () => t.mock.timers.tick(1));
    const native = controlledSuccessorNative(completionProposal('local-image'));
    fixture.dependencies.requestImplementation = native.request;
    let drifted = false;
    const startApplication = observer.io.startApplication;
    fixture.dependencies.observerIO = { ...observer.io, async startApplication() {
      const service = await startApplication();
      drifted = true;
      return service;
    } } as unknown as SuccessorObserverIO;
    const readFileSync = ((target: fs.PathOrFileDescriptor,
      options?: BufferEncoding | { encoding?: BufferEncoding | null; flag?: string } | null) => {
      const bytes = fs.readFileSync(target, options as never);
      if (!drifted || !String(target).endsWith('m602-operation.ts')) return bytes;
      return Buffer.isBuffer(bytes) ? Buffer.concat([bytes, Buffer.from('\n')]) : `${bytes}\n`;
    }) as typeof fs.readFileSync;
    fixture.dependencies.filesystem = { ...fixture.dependencies.filesystem, readFileSync };
    const outcome = await driveSuccessor(withSuccessorRevision(() =>
      operation.executeM602CompletionCase('local-image', fixture.dependencies)), t);
    assert.equal(outcome.ok, false, 'producer drift after preparation must invalidate admission');
    if (outcome.ok) return;
    assert.equal(outcome.error, 'evidence-publication');
    assert.equal(native.calls.length, 0);
    assert.equal(fs.existsSync(path.join(root, 'local-image')), false);
    assert.deepEqual(fs.readFileSync(path.join(root, 'qualification.json')), qualificationBytes);
    assert.equal(Object.isFrozen(outcome.cleanup), true);
    assert.equal(Object.values(outcome.cleanup).every(value => value === 'complete' || value === 'not-created'), true);
  } finally { removeRoot(root); t.mock.timers.reset(); }
});

test('completion blocks client-build drift introduced during awaited observer preparation before entry', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-21T23:45:00.000Z') });
  const operation = m602Operation as unknown as CompletionOperationApi;
  const root = makeRoot();
  try {
    prepareSuccessorRoot(root);
    const bundle = canonicalSyntheticBundle();
    await qualifyCompletion(root, bundle, t, () => t.mock.timers.tick(1));
    const qualificationBytes = fs.readFileSync(path.join(root, 'qualification.json'));
    const observer = successorObserverHarness();
    const fixture = completionDependencies(root, bundle, observer, () => t.mock.timers.tick(1));
    const native = controlledSuccessorNative(completionProposal('local-image'));
    fixture.dependencies.requestImplementation = native.request;
    const startApplication = observer.io.startApplication;
    fixture.dependencies.observerIO = { ...observer.io, async startApplication() {
      const service = await startApplication();
      fs.appendFileSync(path.join(root, 'client', 'index.html'), '<!-- synthetic post-admission drift -->');
      return service;
    } } as unknown as SuccessorObserverIO;
    const outcome = await driveSuccessor(withSuccessorRevision(() =>
      operation.executeM602CompletionCase('local-image', fixture.dependencies)), t);
    assert.equal(outcome.ok, false, 'build drift after preparation must invalidate admission');
    if (outcome.ok) return;
    assert.equal(outcome.error, 'evidence-publication');
    assert.equal(native.calls.length, 0);
    assert.equal(fs.existsSync(path.join(root, 'local-image')), false);
    assert.deepEqual(fs.readFileSync(path.join(root, 'qualification.json')), qualificationBytes);
    assert.equal(Object.isFrozen(outcome.cleanup), true);
    assert.equal(Object.values(outcome.cleanup).every(value => value === 'complete' || value === 'not-created'), true);
  } finally { removeRoot(root); t.mock.timers.reset(); }
});

// M6-02 instrumented continuation. This named import is the contracted first-module Red:
// the behavioral assertions below remain blocked until Green adds the public callable.
import { qualifyM602InstrumentedObservers } from './helpers/m602-operation.ts';

void qualifyM602InstrumentedObservers;

const instrumentedManifestPath = 'evaluation/m602-instrumented-v1.json';
type InstrumentedDependenciesFixture = Omit<CompletionDependenciesFixture, 'completionManifestEnvironment'> & {
  instrumentedManifestEnvironment: SuccessorPackageEnvironment;
};
type InstrumentedOperationApi = {
  qualifyM602InstrumentedObservers(dependencies?: Partial<InstrumentedDependenciesFixture>): Promise<JsonRecord>;
  executeM602InstrumentedCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<InstrumentedDependenciesFixture>): Promise<JsonRecord>;
  readM602InstrumentedCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<InstrumentedDependenciesFixture>): Promise<JsonRecord>;
};

function instrumentedManifest(bundle: SyntheticBundle) {
  const value = {
    ...completionManifest(bundle).value,
    version: 'm602-instrumented-v1',
    frozenAt: '2026-09-22T01:14:13.000Z',
  };
  const bytes = jsonBytes(value);
  return Object.freeze({ value: Object.freeze(value), bytes, environment: Object.freeze({
    manifestSha256: sha256(bytes),
    readBytes(relativePath: string) {
      if (relativePath === instrumentedManifestPath) return bytes;
      return bundle.environment.readBytes(relativePath);
    },
  }) });
}

function prepareInstrumentedRoot(root: string): void {
  prepareSuccessorRoot(root);
  fs.renameSync(path.join(root, 'client', 'assets', 'index-C7OtU_Ke.js'),
    path.join(root, 'client', 'assets', 'index-BRf9Pkds.js'));
}

function instrumentedDependencies(root: string, bundle: SyntheticBundle,
  observer = successorObserverHarness(), entryTick?: () => void) {
  const manifest = instrumentedManifest(bundle);
  const dependencies: InstrumentedDependenciesFixture = {
    root, packageEnvironment: bundle.environment, instrumentedManifestEnvironment: manifest.environment,
    requestImplementation: localNative(generationFixture().proposal).request,
    observerIO: observer.io as unknown as SuccessorObserverIO,
    filesystem: successorEntryClock(root, entryTick),
  };
  return { manifest, observer, dependencies };
}

async function qualifyInstrumented(root: string, bundle: SyntheticBundle,
  clock: { mock: { timers: { tick(milliseconds: number): void } } }, tick?: () => void) {
  const operation = m602Operation as unknown as InstrumentedOperationApi;
  const fixture = instrumentedDependencies(root, bundle, successorObserverHarness(), tick);
  const dependencies: Partial<InstrumentedDependenciesFixture> = { ...fixture.dependencies };
  delete dependencies.requestImplementation;
  const outcome = await driveSuccessor(withSuccessorRevision(() =>
    operation.qualifyM602InstrumentedObservers(dependencies)), clock);
  assert.equal(outcome.ok, true);
  return { outcome, fixture };
}

function writeInstrumentedAssessment(root: string, bundle: SyntheticBundle, result: JsonRecord,
  observation: JsonRecord): void {
  const resultBytes = fs.readFileSync(path.join(root, result.caseLabel, 'result.json'));
  const observationBytes = fs.readFileSync(path.join(root, result.caseLabel, 'observation.json'));
  const finished = Date.parse(result.finishedAt);
  const localObservation = observation.samples === null ? null : {
    ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
    runtime: { observedAt: observation.timing.runtime.finishedAt, ...observation.samples.runtime },
    gpuBefore: observation.samples.gpuBefore,
    gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...observation.samples.gpuDuring },
    oomObserved: false,
  };
  const assessment = {
    version: 'm602-instrumented-evidence-v1', caseLabel: result.caseLabel,
    resultSha256: sha256(resultBytes), observationSha256: sha256(observationBytes), evaluator: 'primary',
    assessedAt: new Date(finished + 60_000).toISOString(),
    dimensions: bundle.manifest.rubric.map(({ observation: observationName }: JsonRecord, index: number) => ({
      observation: observationName,
      value: index === 2 ? (result.caseLabel.endsWith('-image') ? 'fail' : 'not-run') : 'pass',
    })),
    uncertainty: 'pass', localObservation, accepted: true,
  };
  fs.writeFileSync(path.join(root, result.caseLabel, 'assessment.json'), jsonBytes(assessment), { flag: 'wx' });
}

test('instrumented CLI and qualification bind the finite campaign without fallback', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T02:00:00.000Z') });
  assert.deepEqual(parseM602Arguments(['--qualify-instrumented-observers']),
    { ok: true, mode: 'qualify-instrumented-observers' });
  for (const label of caseLabels) {
    assert.deepEqual(parseM602Arguments(['--execute-instrumented', '--case', label]),
      { ok: true, mode: 'execute-instrumented', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback-instrumented', '--case', label]),
      { ok: true, mode: 'readback-instrumented', caseLabel: label });
  }
  for (const args of [
    ['--execute-instrumented'],
    ['--execute-instrumented', '--case', 'local-image', '--readback-instrumented'],
    ['--qualify-instrumented-observers', '--case', 'local-image'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });

  const operation = m602Operation as unknown as InstrumentedOperationApi;
  const bundle = canonicalSyntheticBundle();
  const missingRoot = makeRoot();
  try {
    prepareInstrumentedRoot(missingRoot);
    const fixture = instrumentedDependencies(missingRoot, bundle);
    const incomplete: Partial<InstrumentedDependenciesFixture> = { ...fixture.dependencies };
    delete incomplete.requestImplementation;
    delete incomplete.instrumentedManifestEnvironment;
    const blocked = await withSuccessorRevision(() => operation.qualifyM602InstrumentedObservers(incomplete));
    assert.equal(blocked.ok, false);
    assert.deepEqual(fixture.observer.calls, []);
    assert.equal(fs.existsSync(path.join(missingRoot, 'qualification.json')), false);
  } finally { removeRoot(missingRoot); }

  for (const fault of ['manifest', 'build'] as const) {
    const root = makeRoot();
    try {
      prepareInstrumentedRoot(root);
      const qualified = await qualifyInstrumented(root, bundle, t, () => t.mock.timers.tick(1));
      assert.equal(qualified.outcome.qualification.version, 'm602-instrumented-qualification-v1');
      assert.equal(qualified.outcome.qualification.campaign, 'm602-instrumented-v1');
      assert.deepEqual(qualified.outcome.qualification.build.map(({ path: buildPath }: JsonRecord) => buildPath),
        ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-BRf9Pkds.js']);
      const fixture = instrumentedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const native = controlledSuccessorNative(completionProposal('local-image'));
      fixture.dependencies.requestImplementation = native.request;
      if (fault === 'manifest') fixture.dependencies.instrumentedManifestEnvironment = {
        ...fixture.manifest.environment, manifestSha256: '0'.repeat(64),
      };
      else fs.appendFileSync(path.join(root, 'client', 'assets', 'index-BRf9Pkds.js'), '// drift\n');
      const outcome = await withSuccessorRevision(() =>
        operation.executeM602InstrumentedCase('local-image', fixture.dependencies));
      assert.equal(outcome.ok, false, fault);
      assert.equal(native.calls.length, 0, fault);
      assert.deepEqual(fixture.observer.calls, [], fault);
      assert.equal(fs.existsSync(path.join(root, 'local-image')), false, fault);
    } finally { removeRoot(root); }
  }
});

test('instrumented campaign executes six ordered cases with null details and rejects replay', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T03:00:00.000Z') });
  const operation = m602Operation as unknown as InstrumentedOperationApi;
  const root = makeRoot();
  try {
    prepareInstrumentedRoot(root);
    const bundle = canonicalSyntheticBundle();
    const qualified = await qualifyInstrumented(root, bundle, t, () => t.mock.timers.tick(1));
    const manifest = instrumentedManifest(bundle);
    const order: string[] = [];
    for (const label of caseLabels) {
      const localCase = label.startsWith('local-');
      const fixture = instrumentedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const local = controlledSuccessorNative(completionProposal(label));
      const hosted = groqNativeHarness([{ body: groqChatBody(completionProposal(label)) }]);
      if (localCase) fixture.dependencies.requestImplementation = local.request;
      else {
        fixture.dependencies.requestImplementation = hosted.request;
        fixture.dependencies.credentialIO = virtualCredentialIO().io;
        delete fixture.dependencies.observerIO;
      }
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602InstrumentedCase(label, fixture.dependencies)), t);
      assert.equal(executed.ok, true, label);
      assert.equal(executed.result.status, 'proposal', label);
      assert.equal(executed.result.version, 'm602-instrumented-evidence-v1', label);
      assert.equal(executed.observation.version, 'm602-instrumented-observation-v1', label);
      assert.equal(executed.observation.campaign, 'm602-instrumented-v1', label);
      assert.equal(executed.observation.qualificationSha256, qualified.outcome.sha256, label);
      assert.deepEqual(executed.observation.details,
        { integrity: 'complete', candidate: null, runtime: null }, label);
      order.push(label);
      writeInstrumentedAssessment(root, bundle, executed.result, executed.observation);
      const read = await operation.readM602InstrumentedCase(label, {
        root, packageEnvironment: bundle.environment, instrumentedManifestEnvironment: manifest.environment,
        filesystem: { mkdirSync() { throw new Error('instrumented readback must not write'); } },
      });
      assert.equal(read.ok, true, label);
      assert.deepEqual(read.observation, executed.observation, label);
      assert.equal(read.assessment.accepted, true, label);
    }
    assert.deepEqual(order, caseLabels);
    const replay = instrumentedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const native = controlledSuccessorNative(completionProposal('local-image'));
    replay.dependencies.requestImplementation = native.request;
    assert.equal((await withSuccessorRevision(() =>
      operation.executeM602InstrumentedCase('local-image', replay.dependencies))).ok, false);
    assert.equal(native.calls.length, 0);
    assert.deepEqual(replay.observer.calls, []);
  } finally { removeRoot(root); }
});

test('instrumented execution captures candidate and runtime failures without retaining supplied content', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T04:00:00.000Z') });
  const operation = m602Operation as unknown as InstrumentedOperationApi;
  const bundle = canonicalSyntheticBundle();
  for (const mode of ['local-candidate', 'local-runtime'] as const) {
    const root = makeRoot();
    try {
      prepareInstrumentedRoot(root);
      await qualifyInstrumented(root, bundle, t, () => t.mock.timers.tick(1));
      const observer = successorObserverHarness();
      if (mode === 'local-runtime') {
        const runtimeRequest = observer.io.runtimeRequest;
        observer.io.runtimeRequest = ((options: JsonRecord, callback: (response: JsonRecord) => void) =>
          runtimeRequest(options, response => { response.statusCode = 503; callback(response); })) as typeof observer.io.runtimeRequest;
      }
      const fixture = instrumentedDependencies(root, bundle, observer, () => t.mock.timers.tick(1));
      const label = 'local-image';
      fixture.dependencies.requestImplementation = controlledSuccessorNative(
        mode === 'local-candidate' ? { private: 'must-not-survive' } : completionProposal(label)).request;
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602InstrumentedCase(label, fixture.dependencies)), t);
      assert.equal(executed.ok, true, mode);
      if (mode.endsWith('candidate')) {
        assert.equal(executed.result.status, 'failed', mode);
        assert.equal(executed.result.error, 'response-validation', mode);
        assert.deepEqual(executed.observation.details,
          { integrity: 'complete', candidate: { field: 'candidate', reason: 'structure' }, runtime: null }, mode);
      } else {
        assert.equal(executed.result.status, 'proposal', mode);
        assert.equal(executed.observation.timing.runtime.status, 'failed', mode);
        assert.deepEqual(executed.observation.details,
          { integrity: 'complete', candidate: null, runtime: 'http-metadata' }, mode);
      }
      assert.equal(JSON.stringify(executed.observation).includes('must-not-survive'), false, mode);
      const next = instrumentedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const nextNative = controlledSuccessorNative(completionProposal('local-label'));
      next.dependencies.requestImplementation = nextNative.request;
      const blocked = await withSuccessorRevision(() =>
        operation.executeM602InstrumentedCase('local-label', next.dependencies));
      assert.equal(blocked.ok, false, `${mode}:first-failure-stop`);
      assert.equal(nextNative.calls.length, 0, `${mode}:first-failure-stop`);
      assert.deepEqual(next.observer.calls, [], `${mode}:first-failure-stop`);
      assert.equal(fs.existsSync(path.join(root, 'local-label')), false, `${mode}:first-failure-stop`);
    } finally { removeRoot(root); }
  }
});

test('instrumented detail collector closes duplicates and readback rejects detail tampering', async t => {
  const diagnosticModulePath: string = './helpers/m602-instrumented-diagnostics.ts';
  const diagnostics = await import(diagnosticModulePath) as JsonRecord;
  const accepted = diagnostics.createM602InstrumentedDiagnosticCollector();
  accepted.onCandidate({ field: 'candidate', reason: 'structure' });
  accepted.onCandidate({ field: 'candidate', reason: 'structure' });
  accepted.onRuntime('http-metadata');
  accepted.onRuntime('http-metadata');
  const acceptedDetails = accepted.close();
  assert.deepEqual(acceptedDetails, { integrity: 'complete', candidate: { field: 'candidate', reason: 'structure' },
    runtime: 'http-metadata' });
  assert.equal(Object.isFrozen(acceptedDetails), true);
  assert.equal(Object.isFrozen(acceptedDetails.candidate), true);

  for (const apply of [
    (collector: JsonRecord) => { collector.onCandidate({ field: 'candidate', reason: 'structure' }); collector.onCandidate({ field: 'type', reason: 'fixed-value' }); },
    (collector: JsonRecord) => { collector.onRuntime('http-metadata'); collector.onRuntime('body-limit'); },
    (collector: JsonRecord) => collector.onCandidate({ field: 'private-field', reason: 'private-reason' }),
    (collector: JsonRecord) => collector.onRuntime('private-runtime-code'),
  ]) {
    const collector = diagnostics.createM602InstrumentedDiagnosticCollector();
    apply(collector);
    assert.deepEqual(collector.close(), { integrity: 'failed', candidate: null, runtime: null });
  }

  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T05:00:00.000Z') });
  const operation = m602Operation as unknown as InstrumentedOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    prepareInstrumentedRoot(root);
    await qualifyInstrumented(root, bundle, t, () => t.mock.timers.tick(1));
    const fixture = instrumentedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    fixture.dependencies.requestImplementation = controlledSuccessorNative(completionProposal('local-image')).request;
    const executed = await driveSuccessor(withSuccessorRevision(() =>
      operation.executeM602InstrumentedCase('local-image', fixture.dependencies)), t);
    assert.equal(executed.ok, true);
    const observationPath = path.join(root, 'local-image', 'observation.json');
    const tampered = JSON.parse(fs.readFileSync(observationPath, 'utf8')) as JsonRecord;
    tampered.details.candidate = { field: 'private-field', reason: 'private-reason' };
    fs.writeFileSync(observationPath, jsonBytes(tampered));
    assert.deepEqual(await operation.readM602InstrumentedCase('local-image', {
      root, packageEnvironment: bundle.environment,
      instrumentedManifestEnvironment: instrumentedManifest(bundle).environment,
    }), { ok: false, error: 'evidence-blocked' });
  } finally { removeRoot(root); }
});

test('instrumented aborted runtime sample preserves its durable observation and stop', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T06:00:00.000Z') });
  const operation = m602Operation as unknown as InstrumentedOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    prepareInstrumentedRoot(root);
    await qualifyInstrumented(root, bundle, t, () => t.mock.timers.tick(1));
    const observer = successorObserverHarness();
    let runtimeRequests = 0;
    let runtimeDestroys = 0;
    observer.io.runtimeRequest = ((_options: JsonRecord, _callback: (response: JsonRecord) => void) => {
      runtimeRequests++;
      const handle = new SuccessorEventEmitter() as JsonRecord;
      const socket = new SuccessorEventEmitter() as JsonRecord;
      socket.destroyed = false;
      socket.destroy = () => { if (!socket.destroyed) { socket.destroyed = true; socket.emit('close'); } return socket; };
      Object.defineProperty(handle, 'socket', { value: socket });
      handle.setTimeout = () => handle;
      handle.end = () => handle;
      handle.destroy = () => {
        runtimeDestroys++;
        handle.emit('close');
        socket.destroy();
        return handle;
      };
      return handle;
    }) as typeof observer.io.runtimeRequest;
    const fixture = instrumentedDependencies(root, bundle, observer, () => t.mock.timers.tick(1));
    const native = controlledSuccessorNative(completionProposal('local-image'));
    fixture.dependencies.requestImplementation = native.request;
    const executed = await driveSuccessor(withSuccessorRevision(() =>
      operation.executeM602InstrumentedCase('local-image', fixture.dependencies)), t);

    assert.equal(runtimeRequests, 1, 'runtime sample must start before generation settles');
    assert.equal(runtimeDestroys, 1, 'pending runtime request must be owned and destroyed once');
    const storedResult = JSON.parse(fs.readFileSync(path.join(root, 'local-image', 'result.json'), 'utf8')) as JsonRecord;
    assert.equal(storedResult.status, 'proposal', 'fixture must complete valid generation before observation publication');
    assert.equal(executed.ok, true, 'aborted runtime timing must still publish a durable observation');
    assert.equal(executed.result.status, 'proposal');
    assert.equal(executed.observation.timing.runtime.status, 'aborted');
    assert.equal(executed.observation.samples.runtime, null);
    assert.deepEqual(executed.observation.details,
      { integrity: 'complete', candidate: null, runtime: null });
    assert.deepEqual(executed.observation.cleanup, {
      ui: 'complete', runtime: 'complete', gpu: 'complete', application: 'complete', browser: 'complete', scratch: 'complete',
    });
    const evidence = await import('./helpers/m602-successor-evidence.ts');
    assert.equal(evidence.instrumentedObservationQualified(executed.observation), false);
    const read = await operation.readM602InstrumentedCase('local-image', {
      root, packageEnvironment: bundle.environment,
      instrumentedManifestEnvironment: instrumentedManifest(bundle).environment,
    });
    assert.equal(read.ok, true);
    assert.deepEqual(read.observation, executed.observation);
    assert.equal(read.assessment, null);

    const next = instrumentedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const nextNative = controlledSuccessorNative(completionProposal('local-label'));
    next.dependencies.requestImplementation = nextNative.request;
    const blocked = await withSuccessorRevision(() =>
      operation.executeM602InstrumentedCase('local-label', next.dependencies));
    assert.equal(blocked.ok, false);
    assert.equal(nextNative.calls.length, 0);
    assert.deepEqual(next.observer.calls, []);
    assert.equal(fs.existsSync(path.join(root, 'local-label')), false);
  } finally { removeRoot(root); }
});

// M6-02 repaired campaign. These named exports are the accepted S2 public boundary;
// the complete assertions remain blocked until Green adds them to the existing finite owners.
import { loadM602RepairedPackage } from './helpers/m602-package.ts';
import { qualifyM602RepairedObservers } from './helpers/m602-operation.ts';
import { repairedObservationQualified } from './helpers/m602-successor-evidence.ts';
import { loadM602PromptPackage } from './helpers/m602-package.ts';
import { qualifyM602PromptObservers } from './helpers/m602-operation.ts';
import { promptObservationQualified } from './helpers/m602-successor-evidence.ts';
import { PROMPT_CASE_GROQ_CONFIGURATION, PROMPT_CASE_QWEN_CONFIGURATION } from '../src/server/generation/generation-case-request.ts';

void qualifyM602RepairedObservers;
void qualifyM602PromptObservers;

const repairedManifestPath = 'evaluation/m602-repaired-v1.json';
type RepairedDependenciesFixture = Omit<InstrumentedDependenciesFixture, 'instrumentedManifestEnvironment'> & {
  repairedManifestEnvironment: SuccessorPackageEnvironment;
};
type RepairedOperationApi = {
  qualifyM602RepairedObservers(dependencies?: Partial<RepairedDependenciesFixture>): Promise<JsonRecord>;
  executeM602RepairedCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<RepairedDependenciesFixture>): Promise<JsonRecord>;
  readM602RepairedCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<RepairedDependenciesFixture>): Promise<JsonRecord>;
};

function repairedManifest(bundle: SyntheticBundle) {
  const packages = caseLabels.map(caseLabel => {
    const loaded = loadM602RepairedPackage(caseLabel, bundle.environment);
    assert.equal(loaded.status, 'ready', caseLabel);
    if (loaded.status !== 'ready') throw new Error(`Synthetic repaired package rejected: ${caseLabel}`);
    return loaded.value;
  });
  const profiles = ['informative-image-alt', 'form-input-label', 'text-contrast'] as const;
  const value = {
    ...instrumentedManifest(bundle).value,
    version: 'm602-repaired-v1',
    frozenAt: '2026-09-22T02:37:31.000Z',
    observationPolicy: {
      version: 'm602-loading-observation-v2', startDelayMs: 1, deadlineMs: 5000,
      cleanupDeadlineMs: 5000, qualificationWindowMs: 7000,
      runtimeMaximumAttempts: 120, runtimeIntervalMs: 1000, runtimeAcquisitionDeadlineMs: 120000,
    },
    schemaPolicy: {
      version: 'm602-case-schema-v2', serialization: 'compact-json-utf8',
      schemas: profiles.map((profile, index) => ({ profile, sha256: packages[index]!.caseSchemaSha256 })),
      wireBindings: packages.map((packageValue, index) => ({
        caseLabel: caseLabels[index], bytes: packageValue.wire.bytes, sha256: packageValue.wire.sha256,
      })),
    },
  };
  const bytes = jsonBytes(value);
  return Object.freeze({ value: Object.freeze(value), bytes, packages: Object.freeze(packages), environment: Object.freeze({
    manifestSha256: sha256(bytes),
    readBytes(relativePath: string) {
      if (relativePath === repairedManifestPath) return bytes;
      return bundle.environment.readBytes(relativePath);
    },
  }) });
}

function prepareRepairedRoot(root: string): void {
  prepareSuccessorRoot(root);
  fs.renameSync(path.join(root, 'client', 'assets', 'index-C7OtU_Ke.js'),
    path.join(root, 'client', 'assets', 'index-Bdo3BCH2.js'));
}

function preparePromptRoot(root: string): void {
  prepareRepairedRoot(root);
  fs.renameSync(path.join(root, 'client', 'assets', 'index-Bdo3BCH2.js'),
    path.join(root, 'client', 'assets', 'index-BT7UcryN.js'));
}

function repairedDependencies(root: string, bundle: SyntheticBundle,
  observer = successorObserverHarness(), entryTick?: () => void) {
  const manifest = repairedManifest(bundle);
  const dependencies: RepairedDependenciesFixture = {
    root, packageEnvironment: bundle.environment, repairedManifestEnvironment: manifest.environment,
    requestImplementation: localNative(generationFixture().proposal).request,
    observerIO: observer.io as unknown as SuccessorObserverIO,
    filesystem: successorEntryClock(root, entryTick),
  };
  return { manifest, observer, dependencies };
}

async function qualifyRepaired(root: string, bundle: SyntheticBundle,
  clock: { mock: { timers: { tick(milliseconds: number): void } }, }, tick?: () => void) {
  const operation = m602Operation as unknown as RepairedOperationApi;
  const fixture = repairedDependencies(root, bundle, successorObserverHarness(), tick);
  const dependencies: Partial<RepairedDependenciesFixture> = { ...fixture.dependencies };
  delete dependencies.requestImplementation;
  const outcome = await driveSuccessor(withSuccessorRevision(() =>
    operation.qualifyM602RepairedObservers(dependencies)), clock);
  assert.equal(outcome.ok, true);
  return { outcome, fixture };
}

function writeRepairedAssessment(root: string, bundle: SyntheticBundle, result: JsonRecord,
  observation: JsonRecord): void {
  const resultBytes = fs.readFileSync(path.join(root, result.caseLabel, 'result.json'));
  const observationBytes = fs.readFileSync(path.join(root, result.caseLabel, 'observation.json'));
  const finished = Date.parse(result.finishedAt);
  const localObservation = observation.samples === null ? null : {
    ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
    runtime: { observedAt: observation.timing.runtime.finishedAt, ...observation.samples.runtime },
    gpuBefore: observation.samples.gpuBefore,
    gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...observation.samples.gpuDuring },
    oomObserved: false,
  };
  const assessment = {
    version: 'm602-repaired-evidence-v1', caseLabel: result.caseLabel,
    resultSha256: sha256(resultBytes), observationSha256: sha256(observationBytes), evaluator: 'primary',
    assessedAt: new Date(finished + 60_000).toISOString(),
    dimensions: bundle.manifest.rubric.map(({ observation: observationName }: JsonRecord, index: number) => ({
      observation: observationName,
      value: index === 2 ? (result.caseLabel.endsWith('-image') ? 'fail' : 'not-run') : 'pass',
    })),
    uncertainty: 'pass', localObservation, accepted: true,
  };
  fs.writeFileSync(path.join(root, result.caseLabel, 'assessment.json'), jsonBytes(assessment), { flag: 'wx' });
}

test('repaired package tables, CLI and qualification bind derived identities without fallback', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T07:00:00.000Z') });
  assert.deepEqual(parseM602Arguments(['--qualify-repaired-observers']),
    { ok: true, mode: 'qualify-repaired-observers' });
  for (const label of caseLabels) {
    assert.deepEqual(parseM602Arguments(['--execute-repaired', '--case', label]),
      { ok: true, mode: 'execute-repaired', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback-repaired', '--case', label]),
      { ok: true, mode: 'readback-repaired', caseLabel: label });
  }
  for (const args of [
    ['--execute-repaired'],
    ['--execute-repaired', '--case', 'local-image', '--readback-repaired'],
    ['--qualify-repaired-observers', '--case', 'local-image'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });

  const operation = m602Operation as unknown as RepairedOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    prepareRepairedRoot(root);
    const qualified = await qualifyRepaired(root, bundle, t, () => t.mock.timers.tick(1));
    assert.equal(qualified.outcome.qualification.version, 'm602-repaired-qualification-v1');
    assert.equal(qualified.outcome.qualification.campaign, 'm602-repaired-v1');
    assert.equal(qualified.outcome.qualification.runtime, 'not-exercised');
    assert.deepEqual(qualified.outcome.qualification.build.map(({ path: buildPath }: JsonRecord) => buildPath),
      ['index.html', 'assets/index-C6L8S9Ht.css', 'assets/index-Bdo3BCH2.js']);
    assert.deepEqual(qualified.fixture.manifest.value.schemaPolicy.schemas,
      qualified.fixture.manifest.packages.slice(0, 3).map((packageValue, index) => ({
        profile: ['informative-image-alt', 'form-input-label', 'text-contrast'][index],
        sha256: packageValue.caseSchemaSha256,
      })));
    assert.deepEqual(qualified.fixture.manifest.value.schemaPolicy.wireBindings,
      qualified.fixture.manifest.packages.map((packageValue, index) => ({
        caseLabel: caseLabels[index], bytes: packageValue.wire.bytes, sha256: packageValue.wire.sha256,
      })));
  } finally { removeRoot(root); }

  const rejectedRoot = makeRoot();
  try {
    prepareRepairedRoot(rejectedRoot);
    const fixture = repairedDependencies(rejectedRoot, bundle);
    const tampered = structuredClone(fixture.manifest.value) as JsonRecord;
    tampered.schemaPolicy.wireBindings[0].sha256 = '0'.repeat(64);
    const bytes = jsonBytes(tampered);
    const environment = { manifestSha256: sha256(bytes), readBytes(relativePath: string) {
      if (relativePath === repairedManifestPath) return bytes;
      return bundle.environment.readBytes(relativePath);
    } };
    const dependencies: Partial<RepairedDependenciesFixture> = {
      ...fixture.dependencies, repairedManifestEnvironment: environment,
    };
    delete dependencies.requestImplementation;
    const blocked = await withSuccessorRevision(() => operation.qualifyM602RepairedObservers(dependencies));
    assert.equal(blocked.ok, false);
    assert.deepEqual(fixture.observer.calls, []);
    assert.equal(fs.existsSync(path.join(rejectedRoot, 'qualification.json')), false);
  } finally { removeRoot(rejectedRoot); }
});

test('repaired campaign executes and reads six ordered cases with the same authenticated package and wire', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T08:00:00.000Z') });
  const operation = m602Operation as unknown as RepairedOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    prepareRepairedRoot(root);
    const qualified = await qualifyRepaired(root, bundle, t, () => t.mock.timers.tick(1));
    const manifest = repairedManifest(bundle);
    const order: string[] = [];
    for (const label of caseLabels) {
      const fixture = repairedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const local = controlledSuccessorNative(completionProposal(label));
      const hosted = groqNativeHarness([{ body: groqChatBody(completionProposal(label)) }]);
      if (label.startsWith('local-')) fixture.dependencies.requestImplementation = local.request;
      else {
        fixture.dependencies.requestImplementation = hosted.request;
        fixture.dependencies.credentialIO = virtualCredentialIO().io;
        delete fixture.dependencies.observerIO;
      }
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602RepairedCase(label, fixture.dependencies)), t);
      assert.equal(executed.ok, true, label);
      assert.equal(executed.result.status, 'proposal', label);
      assert.equal(executed.result.version, 'm602-repaired-evidence-v1', label);
      assert.equal(executed.observation.version, 'm602-repaired-observation-v1', label);
      assert.equal(executed.observation.campaign, 'm602-repaired-v1', label);
      assert.equal(executed.observation.qualificationSha256, qualified.outcome.sha256, label);
      assert.deepEqual(executed.observation.details,
        { integrity: 'complete', candidate: null, runtime: null }, label);
      assert.equal(repairedObservationQualified(executed.observation), true, label);
      order.push(label);
      writeRepairedAssessment(root, bundle, executed.result, executed.observation);
      const read = await operation.readM602RepairedCase(label, {
        root, packageEnvironment: bundle.environment, repairedManifestEnvironment: manifest.environment,
        filesystem: { mkdirSync() { throw new Error('repaired readback must not write'); } },
      });
      assert.equal(read.ok, true, label);
      assert.deepEqual(read.observation, executed.observation, label);
      assert.equal(read.assessment.accepted, true, label);
    }
    assert.deepEqual(order, caseLabels);
  } finally { removeRoot(root); }
});

test('repaired campaign stops before the second case after the first invalid generation', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T09:00:00.000Z') });
  const operation = m602Operation as unknown as RepairedOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    prepareRepairedRoot(root);
    await qualifyRepaired(root, bundle, t, () => t.mock.timers.tick(1));
    const first = repairedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    first.dependencies.requestImplementation = controlledSuccessorNative({ private: 'invalid candidate' }).request;
    const failed = await driveSuccessor(withSuccessorRevision(() =>
      operation.executeM602RepairedCase('local-image', first.dependencies)), t);
    assert.equal(failed.ok, true);
    assert.equal(failed.result.status, 'failed');
    assert.equal(failed.result.error, 'response-validation');

    const next = repairedDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const nextNative = controlledSuccessorNative(completionProposal('local-label'));
    next.dependencies.requestImplementation = nextNative.request;
    const blocked = await withSuccessorRevision(() =>
      operation.executeM602RepairedCase('local-label', next.dependencies));
    assert.equal(blocked.ok, false);
    assert.equal(nextNative.calls.length, 0);
    assert.deepEqual(next.observer.calls, []);
    assert.equal(fs.existsSync(path.join(root, 'local-label')), false);
  } finally { removeRoot(root); }
});

// M6-02 prompt campaign. These imports intentionally establish the first-module Red boundary;
// the assertions below remain blocked until Green adds the exact finite prompt owners.
const promptManifestPath = 'evaluation/m602-prompt-v1.json';
const promptInstructionsPath = 'evaluation/m602-grounded-instructions-v1.txt';
const promptInstructionsBytes = fs.readFileSync(path.join(repo, promptInstructionsPath));
const promptInstructionsText = promptInstructionsBytes.toString('utf8');
const promptInstructionsSha256 = 'b04d25f49a35a1dea4b12abb30e0cf3b1ee47f48e5208f6efed5fdfe05b36aa6';
const promptManifestSha256 = 'd6e5767e82b51531b9fb1a823d38ac0fa1684c21764cef2eb7cf162e53afa15d';
type PromptDependenciesFixture = Omit<InstrumentedDependenciesFixture, 'instrumentedManifestEnvironment'> & {
  promptManifestEnvironment: SuccessorPackageEnvironment;
};
type PromptOperationApi = {
  qualifyM602PromptObservers(dependencies?: Partial<PromptDependenciesFixture>): Promise<JsonRecord>;
  executeM602PromptCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<PromptDependenciesFixture>): Promise<JsonRecord>;
  readM602PromptCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<PromptDependenciesFixture>): Promise<JsonRecord>;
};

function promptPackageEnvironment(bundle: SyntheticBundle): SuccessorPackageEnvironment {
  return Object.freeze({
    manifestSha256: bundle.environment.manifestSha256,
    readBytes(relativePath: string) {
      if (relativePath === promptInstructionsPath) return promptInstructionsBytes;
      return bundle.environment.readBytes(relativePath);
    },
  });
}

function promptManifest(bundle: SyntheticBundle) {
  const packageEnvironment = promptPackageEnvironment(bundle);
  const packages = caseLabels.map(caseLabel => {
    const loaded = loadM602PromptPackage(caseLabel, packageEnvironment);
    assert.equal(loaded.status, 'ready', caseLabel);
    if (loaded.status !== 'ready') throw new Error(`Synthetic prompt package rejected: ${caseLabel}`);
    return loaded.value;
  });
  const repaired = repairedManifest(bundle).value;
  const profiles = ['informative-image-alt', 'form-input-label', 'text-contrast'] as const;
  const value = {
    ...repaired,
    version: 'm602-prompt-v1',
    frozenAt: '2026-09-22T14:56:45.922Z',
    schemaPolicy: {
      version: 'm602-case-schema-v2', serialization: 'compact-json-utf8',
      schemas: profiles.map((profile, index) => ({ profile, sha256: packages[index]!.caseSchemaSha256 })),
      wireBindings: packages.map((packageValue, index) => ({
        caseLabel: caseLabels[index], bytes: packageValue.wire.bytes, sha256: packageValue.wire.sha256,
      })),
    },
    promptPolicy: {
      version: 'm602-grounded-instructions-v1', path: promptInstructionsPath,
      sha256: promptInstructionsSha256,
    },
  };
  const bytes = jsonBytes(value);
  return Object.freeze({ value: Object.freeze(value), bytes, packages: Object.freeze(packages), packageEnvironment,
    environment: Object.freeze({
      manifestSha256: sha256(bytes),
      readBytes(relativePath: string) {
        if (relativePath === promptManifestPath) return bytes;
        return packageEnvironment.readBytes(relativePath);
      },
    }) });
}

function promptDependencies(root: string, bundle: SyntheticBundle,
  observer = successorObserverHarness(), entryTick?: () => void) {
  const manifest = promptManifest(bundle);
  const dependencies: PromptDependenciesFixture = {
    root, packageEnvironment: manifest.packageEnvironment, promptManifestEnvironment: manifest.environment,
    requestImplementation: localNative(generationFixture().proposal).request,
    observerIO: observer.io as unknown as SuccessorObserverIO,
    filesystem: successorEntryClock(root, entryTick),
  };
  return { manifest, observer, dependencies };
}

async function qualifyPrompt(root: string, bundle: SyntheticBundle,
  clock: { mock: { timers: { tick(milliseconds: number): void } }, }, tick?: () => void) {
  const operation = m602Operation as unknown as PromptOperationApi;
  const fixture = promptDependencies(root, bundle, successorObserverHarness(), tick);
  const dependencies: Partial<PromptDependenciesFixture> = { ...fixture.dependencies };
  delete dependencies.requestImplementation;
  const outcome = await driveSuccessor(withSuccessorRevision(() =>
    operation.qualifyM602PromptObservers(dependencies)), clock);
  assert.equal(outcome.ok, true);
  return { outcome, fixture };
}

function writePromptAssessment(root: string, bundle: SyntheticBundle, result: JsonRecord,
  observation: JsonRecord): void {
  const resultBytes = fs.readFileSync(path.join(root, result.caseLabel, 'result.json'));
  const observationBytes = fs.readFileSync(path.join(root, result.caseLabel, 'observation.json'));
  const finished = Date.parse(result.finishedAt);
  const localObservation = observation.samples === null ? null : {
    ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
    runtime: { observedAt: observation.timing.runtime.finishedAt, ...observation.samples.runtime },
    gpuBefore: observation.samples.gpuBefore,
    gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...observation.samples.gpuDuring },
    oomObserved: false,
  };
  const assessment = {
    version: 'm602-prompt-evidence-v1', caseLabel: result.caseLabel,
    resultSha256: sha256(resultBytes), observationSha256: sha256(observationBytes), evaluator: 'primary',
    assessedAt: new Date(finished + 60_000).toISOString(),
    dimensions: bundle.manifest.rubric.map(({ observation: observationName }: JsonRecord, index: number) => ({
      observation: observationName,
      value: index === 2 ? (result.caseLabel.endsWith('-image') ? 'fail' : 'not-run') : 'pass',
    })),
    uncertainty: 'pass', localObservation, accepted: true,
  };
  fs.writeFileSync(path.join(root, result.caseLabel, 'assessment.json'), jsonBytes(assessment), { flag: 'wx' });
}

test('prompt package, manifest, CLI and qualification authenticate exact frozen identities', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T15:00:00.000Z') });
  assert.equal(sha256(promptInstructionsBytes), promptInstructionsSha256);
  const frozenManifestBytes = fs.readFileSync(path.join(repo, promptManifestPath));
  const frozenManifest = JSON.parse(frozenManifestBytes.toString('utf8')) as JsonRecord;
  assert.equal(sha256(frozenManifestBytes), promptManifestSha256);
  assert.deepEqual(frozenManifest.promptPolicy, {
    version: 'm602-grounded-instructions-v1', path: promptInstructionsPath, sha256: promptInstructionsSha256,
  });
  assert.deepEqual(parseM602Arguments(['--qualify-prompt-observers']),
    { ok: true, mode: 'qualify-prompt-observers' });
  for (const label of caseLabels) {
    assert.deepEqual(parseM602Arguments(['--execute-prompt', '--case', label]),
      { ok: true, mode: 'execute-prompt', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback-prompt', '--case', label]),
      { ok: true, mode: 'readback-prompt', caseLabel: label });
    const defaultPackage = loadM602PromptPackage(label);
    assert.equal(defaultPackage.status, 'ready', label);
    if (defaultPackage.status === 'ready') {
      assert.equal(defaultPackage.value.identities.promptInstructionsSha256, promptInstructionsSha256, label);
      assert.notEqual(defaultPackage.value.identities.instructionsSha256,
        defaultPackage.value.identities.promptInstructionsSha256, label);
      const configuration = label.startsWith('local-')
        ? PROMPT_CASE_QWEN_CONFIGURATION : PROMPT_CASE_GROQ_CONFIGURATION;
      assert.equal(defaultPackage.value.createRequest(configuration).messages[0]!.content,
        promptInstructionsText, label);
      const binding = frozenManifest.schemaPolicy.wireBindings.find((entry: JsonRecord) => entry.caseLabel === label);
      assert.deepEqual(defaultPackage.value.wire, { bytes: binding.bytes, sha256: binding.sha256 }, label);
    }
  }
  for (const args of [
    ['--execute-prompt'],
    ['--execute-prompt', '--case', 'local-image', '--readback-prompt'],
    ['--qualify-prompt-observers', '--case', 'local-image'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });

  const operation = m602Operation as unknown as PromptOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    preparePromptRoot(root);
    const qualified = await qualifyPrompt(root, bundle, t, () => t.mock.timers.tick(1));
    assert.equal(qualified.outcome.qualification.version, 'm602-prompt-qualification-v1');
    assert.equal(qualified.outcome.qualification.campaign, 'm602-prompt-v1');
    assert.equal(qualified.outcome.qualification.runtime, 'not-exercised');
    assert.deepEqual(qualified.fixture.manifest.value.schemaPolicy.wireBindings,
      qualified.fixture.manifest.packages.map((packageValue, index) => ({
        caseLabel: caseLabels[index], bytes: packageValue.wire.bytes, sha256: packageValue.wire.sha256,
      })));
  } finally { removeRoot(root); }

  const packageEnvironment = promptPackageEnvironment(bundle);
  const changedInstructions = Uint8Array.from(promptInstructionsBytes);
  changedInstructions[0] = changedInstructions[0]! ^ 1;
  const tamperedPackage = loadM602PromptPackage('local-image', {
    ...packageEnvironment,
    readBytes(relativePath: string) {
      if (relativePath === promptInstructionsPath) return changedInstructions;
      return bundle.environment.readBytes(relativePath);
    },
  });
  assert.notEqual(tamperedPackage.status, 'ready');

  const rejectedRoot = makeRoot();
  try {
    preparePromptRoot(rejectedRoot);
    const fixture = promptDependencies(rejectedRoot, bundle);
    const tampered = structuredClone(fixture.manifest.value) as JsonRecord;
    tampered.promptPolicy.sha256 = '0'.repeat(64);
    const bytes = jsonBytes(tampered);
    const environment = { manifestSha256: sha256(bytes), readBytes(relativePath: string) {
      if (relativePath === promptManifestPath) return bytes;
      return fixture.manifest.packageEnvironment.readBytes(relativePath);
    } };
    const dependencies: Partial<PromptDependenciesFixture> = {
      ...fixture.dependencies, promptManifestEnvironment: environment,
    };
    delete dependencies.requestImplementation;
    const blocked = await withSuccessorRevision(() => operation.qualifyM602PromptObservers(dependencies));
    assert.equal(blocked.ok, false);
    assert.deepEqual(fixture.observer.calls, []);
    assert.equal(fs.existsSync(path.join(rejectedRoot, 'qualification.json')), false);
  } finally { removeRoot(rejectedRoot); }
});

test('prompt campaign executes and reads six ordered cases with exact authenticated system bytes', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T16:00:00.000Z') });
  const operation = m602Operation as unknown as PromptOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    preparePromptRoot(root);
    const qualified = await qualifyPrompt(root, bundle, t, () => t.mock.timers.tick(1));
    const manifest = promptManifest(bundle);
    const order: string[] = [];
    for (const label of caseLabels) {
      const fixture = promptDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const local = controlledSuccessorNative(completionProposal(label));
      const hosted = groqNativeHarness([{ body: groqChatBody(completionProposal(label)) }]);
      if (label.startsWith('local-')) fixture.dependencies.requestImplementation = local.request;
      else {
        fixture.dependencies.requestImplementation = hosted.request;
        fixture.dependencies.credentialIO = virtualCredentialIO().io;
        delete fixture.dependencies.observerIO;
      }
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602PromptCase(label, fixture.dependencies)), t);
      assert.equal(executed.ok, true, label);
      assert.equal(executed.result.status, 'proposal', label);
      assert.equal(executed.result.version, 'm602-prompt-evidence-v1', label);
      assert.equal(executed.observation.version, 'm602-prompt-observation-v1', label);
      assert.equal(executed.observation.campaign, 'm602-prompt-v1', label);
      assert.equal(executed.observation.qualificationSha256, qualified.outcome.sha256, label);
      assert.deepEqual(executed.observation.details,
        { integrity: 'complete', candidate: null, runtime: null }, label);
      assert.equal(promptObservationQualified(executed.observation), true, label);
      const nativeBody = label.startsWith('local-')
        ? local.calls[3]!.body
        : hosted.calls[0]!.body.toString('utf8');
      assert.equal(JSON.parse(nativeBody).messages[0].content, promptInstructionsText, label);
      const packageValue = manifest.packages[caseLabels.indexOf(label)]!;
      assert.deepEqual(executed.result.wire, packageValue.wire, label);
      order.push(label);
      writePromptAssessment(root, bundle, executed.result, executed.observation);
      const read = await operation.readM602PromptCase(label, {
        root, packageEnvironment: manifest.packageEnvironment, promptManifestEnvironment: manifest.environment,
        filesystem: { mkdirSync() { throw new Error('prompt readback must not write'); } },
      });
      assert.equal(read.ok, true, label);
      assert.deepEqual(read.observation, executed.observation, label);
      assert.equal(read.assessment.accepted, true, label);
    }
    assert.deepEqual(order, caseLabels);
  } finally { removeRoot(root); }
});

test('prompt campaign stops before the second case after the first invalid generation', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T17:00:00.000Z') });
  const operation = m602Operation as unknown as PromptOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    preparePromptRoot(root);
    await qualifyPrompt(root, bundle, t, () => t.mock.timers.tick(1));
    const first = promptDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    first.dependencies.requestImplementation = controlledSuccessorNative({ private: 'invalid candidate' }).request;
    const failed = await driveSuccessor(withSuccessorRevision(() =>
      operation.executeM602PromptCase('local-image', first.dependencies)), t);
    assert.equal(failed.ok, true);
    assert.equal(failed.result.status, 'failed');
    assert.equal(failed.result.error, 'response-validation');

    const next = promptDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const nextNative = controlledSuccessorNative(completionProposal('local-label'));
    next.dependencies.requestImplementation = nextNative.request;
    const blocked = await withSuccessorRevision(() =>
      operation.executeM602PromptCase('local-label', next.dependencies));
    assert.equal(blocked.ok, false);
    assert.equal(nextNative.calls.length, 0);
    assert.deepEqual(next.observer.calls, []);
    assert.equal(fs.existsSync(path.join(root, 'local-label')), false);
  } finally { removeRoot(root); }
});

// M6-02 reasoning campaign. These named imports establish the accepted first-module Red;
// Green must execute every behavioral assertion below unchanged through the finite public seams.
import { loadM602ReasoningPackage } from './helpers/m602-package.ts';
import { qualifyM602ReasoningObservers } from './helpers/m602-operation.ts';
import { reasoningObservationQualified } from './helpers/m602-successor-evidence.ts';
import { REASONING_GROQ_CONFIGURATION, REASONING_QWEN_CONFIGURATION } from '../src/server/generation/reasoning-generation-configuration.ts';

void qualifyM602ReasoningObservers;

const reasoningManifestPath = 'evaluation/m602-reasoning-v1.json';
const reasoningManifestSha256 = 'da8aa75e9f59818fb1edcf11e939032070a44b3e5ae4d716a709cc8b3462b388';
type ReasoningDependenciesFixture = Omit<PromptDependenciesFixture, 'promptManifestEnvironment'> & {
  reasoningManifestEnvironment: SuccessorPackageEnvironment;
};
type ReasoningOperationApi = {
  qualifyM602ReasoningObservers(dependencies?: Partial<ReasoningDependenciesFixture>): Promise<JsonRecord>;
  executeM602ReasoningCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<ReasoningDependenciesFixture>): Promise<JsonRecord>;
  readM602ReasoningCase(caseLabel: typeof caseLabels[number], dependencies?: Partial<ReasoningDependenciesFixture>): Promise<JsonRecord>;
};

function reasoningManifest(bundle: SyntheticBundle) {
  const packages = caseLabels.map(caseLabel => {
    const loaded = loadM602ReasoningPackage(caseLabel, bundle.environment);
    assert.equal(loaded.status, 'ready', caseLabel);
    if (loaded.status !== 'ready') throw new Error(`Synthetic reasoning package rejected: ${caseLabel}`);
    return loaded.value;
  });
  const value = JSON.parse(fs.readFileSync(path.join(repo, reasoningManifestPath), 'utf8')) as JsonRecord;
  value.inputDefinition.sha256 = bundle.environment.manifestSha256;
  value.schemaPolicy.schemas = ['informative-image-alt', 'form-input-label', 'text-contrast'].map((profile, index) =>
    ({ profile, sha256: packages[index]!.caseSchemaSha256 }));
  value.schemaPolicy.wireBindings = packages.map(packageValue => ({
    caseLabel: packageValue.caseLabel, bytes: packageValue.wire.bytes, sha256: packageValue.wire.sha256,
  }));
  const bytes = jsonBytes(value);
  return Object.freeze({ value: Object.freeze(value), bytes, packages: Object.freeze(packages), environment: Object.freeze({
    manifestSha256: sha256(bytes),
    readBytes(relativePath: string) {
      if (relativePath === reasoningManifestPath) return bytes;
      return bundle.environment.readBytes(relativePath);
    },
  }) });
}

function prepareReasoningRoot(root: string): void {
  prepareSuccessorRoot(root);
  fs.renameSync(path.join(root, 'client', 'assets', 'index-C7OtU_Ke.js'),
    path.join(root, 'client', 'assets', 'index-HAXqw7F5.js'));
}

function reasoningDependencies(root: string, bundle: SyntheticBundle,
  observer = successorObserverHarness(), entryTick?: () => void) {
  const manifest = reasoningManifest(bundle);
  const dependencies: ReasoningDependenciesFixture = {
    root, packageEnvironment: bundle.environment, reasoningManifestEnvironment: manifest.environment,
    requestImplementation: localNative(generationFixture().proposal).request,
    observerIO: observer.io as unknown as SuccessorObserverIO,
    filesystem: successorEntryClock(root, entryTick),
  };
  return { manifest, observer, dependencies };
}

async function qualifyReasoning(root: string, bundle: SyntheticBundle,
  clock: { mock: { timers: { tick(milliseconds: number): void } } }, tick?: () => void) {
  const operation = m602Operation as unknown as ReasoningOperationApi;
  const fixture = reasoningDependencies(root, bundle, successorObserverHarness(), tick);
  const dependencies: Partial<ReasoningDependenciesFixture> = { ...fixture.dependencies };
  delete dependencies.requestImplementation;
  const outcome = await driveSuccessor(withSuccessorRevision(() =>
    operation.qualifyM602ReasoningObservers(dependencies)), clock);
  assert.equal(outcome.ok, true);
  return { outcome, fixture };
}

const semanticDimensions = new Set([
  'controlled support and citations', 'semantic groundedness', 'remediation usefulness',
  'human judgment and reminder', 'prohibited claims',
]);

function writeReasoningAssessment(root: string, bundle: SyntheticBundle, result: JsonRecord,
  observation: JsonRecord, options: { accepted: boolean; structural?: 'pass' | 'fail' | 'not-run';
    provider?: 'pass' | 'fail' | 'not-run'; semantic?: 'pass' | 'fail' | 'not-run';
    uncertainty?: 'pass' | 'fail' | 'not-run'; localSafety?: 'missing' | 'oom' }): void {
  const resultBytes = fs.readFileSync(path.join(root, result.caseLabel, 'result.json'));
  const observationBytes = fs.readFileSync(path.join(root, result.caseLabel, 'observation.json'));
  let localObservation: JsonRecord | null = observation.samples === null ? null : {
    ui: { startedAt: observation.timing.ui.startedAt, finishedAt: observation.timing.ui.finishedAt, responsive: true },
    runtime: { observedAt: observation.timing.runtime.finishedAt, ...observation.samples.runtime },
    gpuBefore: observation.samples.gpuBefore,
    gpuDuring: { observedAt: observation.timing.gpu.finishedAt, ...observation.samples.gpuDuring },
    oomObserved: false,
  };
  if (options.localSafety === 'missing') localObservation = null;
  else if (options.localSafety === 'oom' && localObservation !== null) localObservation.oomObserved = true;
  const assessment = {
    version: 'm602-reasoning-evidence-v1', caseLabel: result.caseLabel,
    resultSha256: sha256(resultBytes), observationSha256: sha256(observationBytes), evaluator: 'primary',
    assessedAt: new Date(Date.parse(result.finishedAt) + 60_000).toISOString(),
    dimensions: bundle.manifest.rubric.map(({ observation: name }: JsonRecord, index: number) => ({
      observation: name,
      value: name === 'structural validity' ? (options.structural ?? 'pass')
        : name === 'provider completion' ? (options.provider ?? 'pass')
        : semanticDimensions.has(name) ? (options.semantic ?? 'pass')
        : index === 2 ? (result.caseLabel.endsWith('-image') ? 'fail' : 'not-run') : 'pass',
    })),
    uncertainty: options.uncertainty ?? 'pass', localObservation, accepted: options.accepted,
  };
  fs.writeFileSync(path.join(root, result.caseLabel, 'assessment.json'), jsonBytes(assessment), { flag: 'wx' });
}

test('reasoning package, CLI and qualification authenticate the frozen manifest, instructions, wires and build', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T22:00:00.000Z') });
  const frozenBytes = fs.readFileSync(path.join(repo, reasoningManifestPath));
  const frozen = JSON.parse(frozenBytes.toString('utf8')) as JsonRecord;
  assert.equal(sha256(frozenBytes), reasoningManifestSha256);
  assert.equal(frozen.version, 'm602-reasoning-v1');
  assert.equal(frozen.executionPolicy, 'm602-reasoning-execution-v1');
  assert.deepEqual(parseM602Arguments(['--qualify-reasoning-observers']),
    { ok: true, mode: 'qualify-reasoning-observers' });
  for (const label of caseLabels) {
    assert.deepEqual(parseM602Arguments(['--execute-reasoning', '--case', label]),
      { ok: true, mode: 'execute-reasoning', caseLabel: label });
    assert.deepEqual(parseM602Arguments(['--readback-reasoning', '--case', label]),
      { ok: true, mode: 'readback-reasoning', caseLabel: label });
    const loaded = loadM602ReasoningPackage(label);
    assert.equal(loaded.status, 'ready', label);
    if (loaded.status !== 'ready') continue;
    const binding = frozen.schemaPolicy.wireBindings.find((entry: JsonRecord) => entry.caseLabel === label);
    assert.deepEqual(loaded.value.wire, { bytes: binding.bytes, sha256: binding.sha256 }, label);
    const rule = frozen.promptPolicy.rules[caseLabels.indexOf(label) % 3];
    assert.equal(loaded.value.identities.reasoningInstructionsSha256, rule.sha256, label);
    const configuration = label.startsWith('local-') ? REASONING_QWEN_CONFIGURATION : REASONING_GROQ_CONFIGURATION;
    const request = loaded.value.createRequest(configuration);
    assert.equal(request.messages.length, 2, label);
    assert.equal(typeof request.messages[0]!.content, 'string', label);
  }
  for (const args of [
    ['--execute-reasoning'], ['--execute-reasoning', '--case', 'local-image', '--readback-reasoning'],
    ['--qualify-reasoning-observers', '--case', 'local-image'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });

  const root = makeRoot();
  try {
    prepareReasoningRoot(root);
    const bundle = canonicalSyntheticBundle();
    const qualified = await qualifyReasoning(root, bundle, t, () => t.mock.timers.tick(1));
    assert.equal(qualified.outcome.qualification.version, 'm602-reasoning-qualification-v1');
    assert.equal(qualified.outcome.qualification.campaign, 'm602-reasoning-v1');
    assert.equal(qualified.outcome.qualification.runtime, 'not-exercised');
    assert.deepEqual(qualified.outcome.qualification.build, frozen.clientBuild.map((file: JsonRecord) => ({
      path: file.path, sha256: sha256(fs.readFileSync(path.join(root, 'client', file.path))),
    })));
  } finally { removeRoot(root); }

  const rejectedRoot = makeRoot();
  try {
    prepareReasoningRoot(rejectedRoot);
    const bundle = canonicalSyntheticBundle();
    const fixture = reasoningDependencies(rejectedRoot, bundle);
    const tampered = structuredClone(fixture.manifest.value) as JsonRecord;
    tampered.schemaPolicy.wireBindings[0].sha256 = '0'.repeat(64);
    const bytes = jsonBytes(tampered);
    const dependencies: Partial<ReasoningDependenciesFixture> = { ...fixture.dependencies,
      reasoningManifestEnvironment: { manifestSha256: sha256(bytes), readBytes(relativePath: string) {
        return relativePath === reasoningManifestPath ? bytes : bundle.environment.readBytes(relativePath);
      } } };
    delete dependencies.requestImplementation;
    const blocked = await withSuccessorRevision(() =>
      (m602Operation as unknown as ReasoningOperationApi).qualifyM602ReasoningObservers(dependencies));
    assert.equal(blocked.ok, false);
    assert.deepEqual(fixture.observer.calls, []);
    assert.equal(fs.existsSync(path.join(rejectedRoot, 'qualification.json')), false);
  } finally { removeRoot(rejectedRoot); }
});

test('reasoning executes and reads six ordered one-use cases with authenticated wire and explicit eligibility', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-22T23:00:00.000Z') });
  const operation = m602Operation as unknown as ReasoningOperationApi;
  const bundle = canonicalSyntheticBundle();
  const root = makeRoot();
  try {
    prepareReasoningRoot(root);
    await qualifyReasoning(root, bundle, t, () => t.mock.timers.tick(1));
    const manifest = reasoningManifest(bundle);
    const order: string[] = [];
    for (const label of caseLabels) {
      const fixture = reasoningDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const local = controlledSuccessorNative(completionProposal(label));
      const hosted = groqNativeHarness([{ body: groqChatBody(completionProposal(label)) }]);
      if (label.startsWith('local-')) fixture.dependencies.requestImplementation = local.request;
      else {
        fixture.dependencies.requestImplementation = hosted.request;
        fixture.dependencies.credentialIO = virtualCredentialIO().io;
        delete fixture.dependencies.observerIO;
      }
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602ReasoningCase(label, fixture.dependencies)), t);
      assert.equal(executed.ok, true, label);
      assert.equal(executed.result.version, 'm602-reasoning-evidence-v1', label);
      assert.equal(executed.result.status, 'proposal', label);
      assert.deepEqual(executed.result.wire, manifest.packages[caseLabels.indexOf(label)]!.wire, label);
      assert.equal(executed.observation.version, 'm602-reasoning-observation-v1', label);
      assert.equal(executed.observation.campaign, 'm602-reasoning-v1', label);
      assert.equal(reasoningObservationQualified(executed.observation), true, label);
      writeReasoningAssessment(root, bundle, executed.result, executed.observation, { accepted: true });
      const read = await operation.readM602ReasoningCase(label, {
        root, packageEnvironment: bundle.environment, reasoningManifestEnvironment: manifest.environment,
        filesystem: { mkdirSync() { throw new Error('reasoning readback must not write'); } },
      });
      assert.equal(read.ok, true, label);
      assert.equal(read.assessment.accepted, true, label);
      assert.equal(read.eligibleForContinuation, true, label);
      order.push(label);
    }
    assert.deepEqual(order, caseLabels);
    const duplicate = reasoningDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
    const native = controlledSuccessorNative(completionProposal('local-image'));
    duplicate.dependencies.requestImplementation = native.request;
    assert.equal((await withSuccessorRevision(() =>
      operation.executeM602ReasoningCase('local-image', duplicate.dependencies))).ok, false);
    assert.equal(native.calls.length, 0);
    assert.deepEqual(duplicate.observer.calls, []);
  } finally { removeRoot(root); }
});

test('reasoning continuation preserves negative outcomes and requires complete safe authenticated evidence', async t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-09-23T00:00:00.000Z') });
  const operation = m602Operation as unknown as ReasoningOperationApi;
  const bundle = canonicalSyntheticBundle();
  const scenarios = [
    { name: 'semantic rejection', candidate: completionProposal('local-image'), assessment: { accepted: false, semantic: 'fail' }, eligible: true },
    { name: 'invalid response', candidate: { private: 'invalid candidate' }, assessment: { accepted: false, structural: 'fail', semantic: 'not-run', uncertainty: 'not-run' }, eligible: true },
    { name: 'mere rejection', candidate: completionProposal('local-image'), assessment: { accepted: false }, eligible: false },
    { name: 'unevaluated semantics', candidate: completionProposal('local-image'), assessment: { accepted: false, semantic: 'not-run' }, eligible: false },
    { name: 'provider failure', candidate: completionProposal('local-image'), assessment: { accepted: false, semantic: 'fail', provider: 'fail' }, eligible: false },
    { name: 'missing local projection', candidate: completionProposal('local-image'), assessment: { accepted: false, semantic: 'fail', localSafety: 'missing' }, eligible: false },
    { name: 'local oom observed', candidate: completionProposal('local-image'), assessment: { accepted: false, semantic: 'fail', localSafety: 'oom' }, eligible: false },
  ] as const;
  for (const scenario of scenarios) {
    const root = makeRoot();
    try {
      prepareReasoningRoot(root);
      await qualifyReasoning(root, bundle, t, () => t.mock.timers.tick(1));
      const first = reasoningDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      first.dependencies.requestImplementation = controlledSuccessorNative(scenario.candidate).request;
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602ReasoningCase('local-image', first.dependencies)), t);
      assert.equal(executed.ok, true, scenario.name);
      assert.equal(executed.result.status, scenario.name === 'invalid response' ? 'failed' : 'proposal', scenario.name);
      if (scenario.name === 'invalid response') assert.equal(executed.result.error, 'response-validation');
      writeReasoningAssessment(root, bundle, executed.result, executed.observation, scenario.assessment);
      const manifest = reasoningManifest(bundle);
      const read = await operation.readM602ReasoningCase('local-image', {
        root, packageEnvironment: bundle.environment, reasoningManifestEnvironment: manifest.environment,
      });
      assert.equal(read.ok, true, scenario.name);
      assert.equal(read.assessment.accepted, false, scenario.name);
      assert.equal(read.eligibleForContinuation, scenario.eligible, scenario.name);
      const next = reasoningDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const nextNative = controlledSuccessorNative(completionProposal('local-label'));
      next.dependencies.requestImplementation = nextNative.request;
      const continuation = scenario.eligible
        ? await driveSuccessor(withSuccessorRevision(() =>
          operation.executeM602ReasoningCase('local-label', next.dependencies)), t)
        : await withSuccessorRevision(() => operation.executeM602ReasoningCase('local-label', next.dependencies));
      assert.equal(continuation.ok, scenario.eligible, scenario.name);
      assert.equal(nextNative.calls.length, scenario.eligible ? 4 : 0, scenario.name);
    } finally { removeRoot(root); }
  }

  for (const fault of ['missing-assessment', 'wire-drift'] as const) {
    const root = makeRoot();
    try {
      prepareReasoningRoot(root);
      await qualifyReasoning(root, bundle, t, () => t.mock.timers.tick(1));
      const first = reasoningDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      first.dependencies.requestImplementation = controlledSuccessorNative(completionProposal('local-image')).request;
      const executed = await driveSuccessor(withSuccessorRevision(() =>
        operation.executeM602ReasoningCase('local-image', first.dependencies)), t);
      assert.equal(executed.ok, true, fault);
      if (fault !== 'missing-assessment') writeReasoningAssessment(root, bundle, executed.result, executed.observation, { accepted: true });
      if (fault === 'wire-drift') {
        const resultPath = path.join(root, 'local-image', 'result.json');
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as JsonRecord;
        result.wire.sha256 = '0'.repeat(64);
        fs.writeFileSync(resultPath, jsonBytes(result));
      }
      const next = reasoningDependencies(root, bundle, successorObserverHarness(), () => t.mock.timers.tick(1));
      const native = controlledSuccessorNative(completionProposal('local-label'));
      next.dependencies.requestImplementation = native.request;
      assert.equal((await withSuccessorRevision(() =>
        operation.executeM602ReasoningCase('local-label', next.dependencies))).ok, false, fault);
      assert.equal(native.calls.length, 0, fault);
      assert.equal(fs.existsSync(path.join(root, 'local-label')), false, fault);
    } finally { removeRoot(root); }
  }
});
