import type { GenerationRejectionSink } from '../../src/server/generation/generation-diagnostics.ts';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { assessFindingEvidence } from '../../src/server/domain/finding-sufficiency.ts';
import type { EvidencePath } from '../../src/server/domain/finding-analysis-types.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { readFinding } from '../../src/server/domain/run-contract/finding-validation.ts';
import type { ProviderContext } from '../../src/server/domain/run-contract/run-types.ts';
import { parseCorpusCatalog } from '../../src/server/retrieval/corpus-validation.ts';
import type { CorpusPassage } from '../../src/server/retrieval/corpus-validation.ts';
import { SOURCE_NOTICES } from '../../src/server/retrieval/source-notices.ts';
import { GENERATION_SCHEMA, GENERATION_DEADLINE_MS, PROMPT_VERSION, SCHEMA_VERSION, OUTPUT_CONTRACT_VERSION } from '../../src/server/generation/generation-artifacts.ts';
import type { GenerationConfiguration, GenerationRequest } from '../../src/server/generation/generation-contract.ts';
import { validateProposalCandidate } from '../../src/server/generation/proposal-contract.ts';
import type { ProposalValidationResult } from '../../src/server/generation/proposal-contract.ts';
import { QWEN_CONFIGURATION } from '../../src/server/generation/ollama-generation-model.ts';
import { GROQ_CONFIGURATION } from '../../src/server/generation/groq-generation-configuration.ts';
import { prepareOllamaGenerationWire } from '../../src/server/generation/ollama-generation-fit.ts';
import { prepareGroqGenerationWire } from '../../src/server/generation/groq-generation-fit.ts';

export type M602CaseLabel = 'local-image' | 'local-label' | 'local-contrast' | 'groq-image' | 'groq-label' | 'groq-contrast';
export type M602PackageEnvironment = {
  readonly manifestSha256: string; readonly readBytes: (relativePath: string) => Uint8Array;
};
export type M602Package = {
  readonly caseLabel: M602CaseLabel; readonly providerContext: ProviderContext; readonly findingId: string;
  readonly availableEvidenceReferences: readonly EvidencePath[]; readonly passageIds: readonly string[];
  readonly identities: { readonly manifestSha256: string; readonly inputSha256: string;
    readonly instructionsSha256: string; readonly schemaSha256: string; readonly provenanceSha256: string };
  readonly wire: { readonly sha256: string; readonly bytes: number };
  readonly createRequest: (configuration: GenerationConfiguration) => GenerationRequest;
  readonly validateCandidate: (candidate: unknown, onRejection?: GenerationRejectionSink) => ProposalValidationResult;
};

const repository = path.resolve(import.meta.dirname, '../..');
const manifestPath = 'evaluation/m301-generation-v1.json';
const manifestDigest = '63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b';
const profiles = ['informative-image-alt', 'form-input-label', 'text-contrast'] as const;
const suffixes = ['image', 'label', 'contrast'];
const triples = [
  ['wcag22-sc111', 'understanding111-intent', 'h37-text-alternative'],
  ['wcag22-sc412', 'understanding412-intent', 'h44-explicit-label'],
  ['wcag22-sc143', 'understanding143-threshold-measurement', 'g18-contrast-remediation'],
];
const sourcePaths = ['corpus/wcag22-mvp-v1/manifest.json', 'corpus/wcag22-mvp-v1/passages.json',
  'evaluation/m201-corpus-v1.json', 'evaluation/rd003-scan-v1.json'];
const bodyIdentities = [
  [17748, '4c13611115bca2dbf5d6d364a0e00d4bb03f40a5200322ad068bc4726306dfd6'],
  [19141, '4f8f218eaaf948af041fbec3eb119430f72342f53eb2faf2233366818f7ddf5a'],
  [19803, 'b45eca8353459a5177dd4b7d6e83b4f02219d53b83b795c8e39a8c4047f7e2c8'],
  [17823, 'eb1b3dd6c8c9bf818836296fd33f05262eaa92318ac2160ca673dadf2a6c120a'],
  [19216, '4957a37acc68b2b57ab35da25184a697b5358deb6978d8e58701ae2717b0d5c6'],
  [19878, '0b0eda9dfc67cda043f284023fba13e370efa02c410dd8e6848a7c7c52e69c7a'],
] as const;
const hash = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex');
// JSON is authenticated and bounded before these task-local structural projections.
type RecordValue = Record<string, any>;

function ordinaryRead(relative: string): Uint8Array {
  const target = path.resolve(repository, relative);
  assert.equal(path.relative(repository, target).replaceAll('\\', '/'), relative);
  let current = path.parse(target).root;
  const parts = target.slice(current.length).split(path.sep);
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    assert.equal(stat.isSymbolicLink(), false);
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    if (index === parts.length - 1) {
      assert.ok(stat.isFile() && stat.nlink === 1 && stat.size <= 1048576);
    } else assert.ok(stat.isDirectory());
  }
  return fs.readFileSync(target);
}

function textBytes(bytes: Uint8Array, relative: string): string {
  assert.ok(bytes instanceof Uint8Array && bytes.byteLength <= 1048576);
  assert.ok(!(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191));
  const value = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  // Public sources retain their raw hash-fixed representation, including CRLF.
  if (!sourcePaths.includes(relative)) assert.ok(!value.includes('\r') && value.endsWith('\n') && !value.endsWith('\n\n'));
  return value;
}

function projection(finding: RecordValue) {
  return readFinding({ findingId: finding.findingId, ruleId: finding.ruleId, nativeResult: finding.nativeResult,
    state: 'unprocessed', checks: finding.checks, locator: finding.locator, evidence: finding.evidence });
}

export function loadM602Package(caseLabel: M602CaseLabel, environment?: M602PackageEnvironment):
  { readonly status: 'ready'; readonly value: M602Package } | { readonly status: 'failed'; readonly error: 'input-integrity' } {
  try {
    const index = suffixes.findIndex(suffix => caseLabel === `local-${suffix}` || caseLabel === `groq-${suffix}`);
    assert.ok(index >= 0);
    const local = caseLabel.startsWith('local-');
    const configuration = local ? QWEN_CONFIGURATION : GROQ_CONFIGURATION;
    const reader = environment === undefined ? ordinaryRead : environment.readBytes;
    const trust = environment === undefined ? manifestDigest : environment.manifestSha256;
    assert.match(trust, /^[0-9a-f]{64}$/u);
    assert.equal(typeof reader, 'function');
    const manifestBytes = reader(manifestPath);
    const manifestText = textBytes(manifestBytes, manifestPath);
    assert.equal(hash(manifestBytes), trust);
    const manifest = JSON.parse(manifestText) as RecordValue;
    assert.equal(manifest.version, 'm301-generation-v1');
    assert.equal(manifest.status, 'frozen-before-model-output');
    assert.deepEqual(manifest.cases.map((c: RecordValue) => c.caseId), profiles);
    assert.deepEqual(manifest.sources.map((s: RecordValue) => s.path), sourcePaths);
    const references = [...manifest.cases.flatMap((c: RecordValue) => [c.input, c.provenance]),
      manifest.shared.instructions, manifest.shared.outputSchema, manifest.shared.noCall, ...manifest.sources];
    const expectedPaths = [...profiles.flatMap(profile => [`${profile}.input.json`, `${profile}.provenance.json`]),
      'instructions.txt', 'output-schema.json', 'no-call.json'].map(name => `temp/m301-generation-freeze-v1/${name}`);
    assert.deepEqual(references.map((r: RecordValue) => r.path), [...expectedPaths, ...sourcePaths]);
    const texts = new Map<string, string>();
    const bytes = new Map<string, Uint8Array>();
    for (const reference of references) {
      assert.match(reference.sha256, /^[0-9A-F]{64}$/u);
      const content = reader(reference.path);
      const text = textBytes(content, reference.path);
      assert.equal(hash(content).toUpperCase(), reference.sha256);
      texts.set(reference.path, text);
      bytes.set(reference.path, content);
    }
    const parsed = (relative: string): RecordValue => JSON.parse(texts.get(relative)!);
    const catalog = parseCorpusCatalog(bytes.get(sourcePaths[0])!, bytes.get(sourcePaths[1])!);
    assert.ok(catalog.ok);
    assert.deepEqual(catalog.value.manifest.unresolvedConflicts, []);
    assert.deepEqual(manifest.corpusIdentity, catalog.value.identity);
    const gold = parsed(sourcePaths[2]);
    const scan = parsed(sourcePaths[3]);
    assert.deepEqual(parsed(manifest.shared.outputSchema.path), GENERATION_SCHEMA);
    assert.deepEqual(manifest.executions, manifest.cases.flatMap((c: RecordValue) => ['local', 'groq'].map(mode => ({
      caseId: c.caseId, mode, inputSha256: c.input.sha256,
      instructionSha256: manifest.shared.instructions.sha256, outputSchemaSha256: manifest.shared.outputSchema.sha256,
    }))));

    const natives = [];
    for (const [caseIndex, definition] of (manifest.cases as RecordValue[]).entries()) {
      const expectedProfile = profiles[caseIndex];
      const goldCase = gold.cases.find((c: RecordValue) => c.profile === expectedProfile);
      const scanCase = scan.cases.find((c: RecordValue) => c.profile === expectedProfile);
      assert.ok(goldCase && scanCase);
      for (const key of ['fixtureRevision', 'targetKey', 'ruleId', 'successCriterion']) assert.equal(definition[key], goldCase[key]);
      assert.equal(definition.fixtureRevision, scanCase.revision);
      assert.equal(definition.targetKey, scanCase.targetKey);
      assert.equal(definition.evidenceOrigin, 'synthetic-seeded-native-evidence');
      assert.equal(definition.guidanceOrigin, 'independently-assembled-canonical-evaluation-only');
      assert.deepEqual(definition.passageIds, triples[caseIndex]);
      assert.deepEqual(definition.passageOrder, ['criterion', 'interpretation', 'remediation']);
      assert.equal(definition.expectedEvidence, 'complete');
      assert.equal(definition.expectedSupport, 'supported');
      const sourcePath = `temp/m204-retrieval-checkpoint/g${caseIndex + 1}/runs/m204-g${caseIndex + 1}/run.json`;
      const seedPath = `temp/m204-retrieval-checkpoint/g${caseIndex + 1}/seed.json`;
      assert.equal(definition.actualRetrievalObservation.sourcePath, sourcePath);
      const sourceBytes = reader(sourcePath);
      const sourceText = textBytes(sourceBytes, sourcePath);
      assert.equal(hash(sourceBytes).toUpperCase(), definition.actualRetrievalObservation.sourceSha256);
      const source = JSON.parse(sourceText) as RecordValue;
      const seed = JSON.parse(textBytes(reader(seedPath), seedPath)) as RecordValue;
      assert.ok(validateRun(source).ok && validateRun(seed).ok);
      assert.equal(source.runId, `m204-g${caseIndex + 1}`);
      assert.equal(source.runId, seed.runId);
      assert.deepEqual(source.scan.context, seed.scan.context);
      // The original scan may contain siblings; only the selected first Finding is projected.
      assert.ok(source.scan.findings.length > 0 && seed.scan.findings.length > 0);
      const finding = source.scan.findings[0];
      const native = projection(finding);
      assert.deepEqual(native, projection(seed.scan.findings[0]));
      assert.equal(seed.scan.findings[0].state, 'unprocessed');
      assert.equal(finding.state, 'abstained');
      assert.equal(finding.result.providerCalled, false);
      assert.equal(finding.providerInvocation, undefined);
      assert.deepEqual(definition.actualRetrievalObservation, { state: 'abstained',
        missingRoles: finding.retrieval.support.missingRoles, providerCalled: false, sourcePath,
        sourceSha256: hash(sourceBytes).toUpperCase() });
      const assessment = assessFindingEvidence(native);
      assert.equal(assessment.state, 'complete');
      assert.deepEqual(assessment.availableReferences, definition.availableEvidenceReferences);
      const passages: CorpusPassage[] = triples[caseIndex].map((id): CorpusPassage => {
        const passage: CorpusPassage | undefined = catalog.value.passages.find(p => p.passageId === id);
        assert.ok(passage && goldCase.goldPassageIds.includes(id));
        assert.deepEqual(passage.ruleIds, [definition.ruleId]);
        assert.deepEqual(passage.successCriteria, [definition.successCriterion]);
        return passage;
      });
      assert.deepEqual(passages.map(p => p.guidanceRole), definition.passageOrder);
      const sources: RecordValue[] = [...new Set(passages.map(p => p.sourceTitle))].map((title): RecordValue => {
        const source: RecordValue | undefined = (catalog.value.manifest.sources as RecordValue[]).find(s => s.title === title);
        assert.ok(source);
        return Object.fromEntries(['title', 'type', 'url', 'status', 'version', 'copyright', 'attribution'].map(k => [k, source[k]]));
      });
      const facts = assessment.availableReferences.map(reference => {
        let value: any = native;
        for (const part of reference.split('.')) value = value[part];
        if (value && typeof value === 'object' && Object.hasOwn(value, 'value')) value = value.value;
        return { reference, value };
      });
      assert.deepEqual(parsed(definition.input.path), {
        finding: { findingId: native.findingId, ruleId: native.ruleId, nativeResult: native.nativeResult, facts },
        guidance: { corpusVersion: catalog.value.identity.version, passages, notices: { sources, full: SOURCE_NOTICES } },
      });
      assert.deepEqual(parsed(definition.provenance.path), {
        version: 'm301-generation-v1', caseId: expectedProfile, evidenceOrigin: definition.evidenceOrigin,
        fixtureRevision: definition.fixtureRevision, targetKey: definition.targetKey, sourcePath,
        sourceSha256: hash(sourceBytes).toUpperCase(), sourceRunId: source.runId, sourceWorkflowState: 'abstained',
        sourceProviderCalled: false, scanContext: source.scan.context, native, assessment,
        guidanceOrigin: definition.guidanceOrigin, support: 'supported',
      });
      natives.push({ native, assessment });
    }
    const noCall = parsed(manifest.shared.noCall.path);
    assert.equal(noCall.version, 'm301-generation-v1');
    assert.equal(noCall.caseId, 'shared-incomplete-guidance');
    assert.deepEqual(readFinding(noCall.native), natives[0].native);
    assert.deepEqual(noCall.passageIds, triples[0].slice(0, 2));
    assert.deepEqual(noCall.expected, { support: 'incomplete', missingRoles: ['remediation'], reason: 'incomplete-guidance',
      providerCalled: false, providerInvocation: false, proposal: false, reviewDecision: false });
    const selected = manifest.cases[index];
    const messages = Object.freeze([
      Object.freeze({ role: 'system' as const, content: texts.get(manifest.shared.instructions.path)! }),
      Object.freeze({ role: 'user' as const, content: texts.get(selected.input.path)! }),
    ]);
    const createRequest = (supplied: GenerationConfiguration): GenerationRequest => {
      assert.equal(supplied, configuration);
      return Object.freeze({ messages, schema: GENERATION_SCHEMA, promptVersion: PROMPT_VERSION,
        schemaVersion: SCHEMA_VERSION, outputContractVersion: OUTPUT_CONTRACT_VERSION,
        controls: configuration.parameters, deadlineMs: GENERATION_DEADLINE_MS, configuration });
    };
    const prepared = (local ? prepareOllamaGenerationWire : prepareGroqGenerationWire)(createRequest(configuration));
    assert.ok(prepared.ok);
    const wire = Object.freeze({ sha256: hash(prepared.body), bytes: Buffer.byteLength(prepared.body) });
    if (environment === undefined) {
      const expected = bodyIdentities[index + (local ? 0 : 3)];
      assert.deepEqual(wire, { bytes: expected[0], sha256: expected[1] });
    }
    const availableEvidenceReferences = Object.freeze([...natives[index].assessment.availableReferences]);
    const passageIds = Object.freeze([...triples[index]]);
    const findingId = natives[index].native.findingId;
    return Object.freeze({ status: 'ready', value: Object.freeze({ caseLabel, providerContext: configuration.providerContext,
      findingId, availableEvidenceReferences, passageIds, wire, createRequest,
      identities: Object.freeze({ manifestSha256: trust, inputSha256: selected.input.sha256.toLowerCase(),
        instructionsSha256: manifest.shared.instructions.sha256.toLowerCase(), schemaSha256: manifest.shared.outputSchema.sha256.toLowerCase(),
        provenanceSha256: selected.provenance.sha256.toLowerCase() }),
      validateCandidate: (candidate: unknown, onRejection?: GenerationRejectionSink) => validateProposalCandidate(candidate, { findingId, availableEvidenceReferences, passageIds }, onRejection),
    }) });
  } catch { return Object.freeze({ status: 'failed', error: 'input-integrity' }); }
}
