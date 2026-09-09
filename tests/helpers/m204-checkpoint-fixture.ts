import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { createFindingQuery } from '../../src/server/retrieval/finding-query.ts';
import { prepareEmbeddingInput } from '../../src/server/retrieval/embedding-input-fit.ts';
import { completedRun, runningRun } from './m102-run-fixture.ts';
import { contrastFinding, imageFinding, labelFinding } from './m202-retrieval-fixture.ts';

export const checkpointTargetUrl = 'https://m204.test/';
export const checkpointFindingId = 'finding-0';
export const realCaseIds = ['G1', 'G2', 'G3'] as const;
export const controlledCaseIds = ['S', 'A', 'Z', 'F', 'I'] as const;
export type RealCaseId = typeof realCaseIds[number];
export type ControlledCaseId = typeof controlledCaseIds[number];
export type CheckpointCaseId = RealCaseId | ControlledCaseId;

type Mutable = Record<string | number, any>;
const fact = <T>(value: T) => ({ value });
const unavailable = () => ({ unavailable: 'missing' as const });

export const realCases = Object.freeze({
  G1: Object.freeze({
    runId: 'm204-g1', profile: 'informative-image-alt', fixtureRevision: 'informative-image-alt-v1-failing',
    targetKey: 'rd3-image', selector: '#rd3-image',
    goldPassageIds: Object.freeze(['wcag22-sc111', 'understanding111-intent', 'h37-text-alternative']),
  }),
  G2: Object.freeze({
    runId: 'm204-g2', profile: 'form-input-label', fixtureRevision: 'form-input-label-v1-failing',
    targetKey: 'rd3-email', selector: '#rd3-email',
    goldPassageIds: Object.freeze(['wcag22-sc412', 'wcag22-name-definition', 'understanding412-intent',
      'h44-explicit-label', 'h44-label-applicability']),
  }),
  G3: Object.freeze({
    runId: 'm204-g3', profile: 'text-contrast', fixtureRevision: 'text-contrast-v1-failing',
    targetKey: 'rd3-text', selector: '#rd3-text',
    goldPassageIds: Object.freeze(['wcag22-sc143', 'wcag22-large-scale-definition',
      'wcag22-contrast-ratio-definition', 'understanding143-intent',
      'understanding143-threshold-measurement', 'g18-contrast-remediation']),
  }),
} as const);

export const controlledCases = Object.freeze({
  S: Object.freeze({ runId: 'm204-s', passages: Object.freeze([
    Object.freeze({ passageId: 'wcag22-sc111', score: 0.9 }),
    Object.freeze({ passageId: 'understanding111-intent', score: 0.8 }),
    Object.freeze({ passageId: 'h37-text-alternative', score: 0.7 }),
  ]) }),
  A: Object.freeze({ runId: 'm204-a', passages: Object.freeze([
    Object.freeze({ passageId: 'wcag22-sc111', score: 0.9 }),
  ]) }),
  Z: Object.freeze({ runId: 'm204-z', passages: Object.freeze([]) }),
  F: Object.freeze({ runId: 'm204-f', passages: null }),
  I: Object.freeze({ runId: 'm204-i', passages: Object.freeze([
    Object.freeze({ passageId: 'wcag22-sc111', score: 0.9 }),
    Object.freeze({ passageId: 'understanding111-intent', score: 0.8 }),
    Object.freeze({ passageId: 'h37-text-alternative', score: 0.7 }),
  ]) }),
} as const);

function selectedFinding(caseId: CheckpointCaseId): Mutable {
  if (caseId === 'G2') {
    const finding = structuredClone(labelFinding()) as Mutable;
    finding.evidence.inputType = fact('email');
    return finding;
  }
  if (caseId === 'G3') {
    const finding = structuredClone(contrastFinding()) as Mutable;
    Object.assign(finding.evidence, {
      foregroundColor: fact('#888888'), backgroundColor: fact('#ffffff'),
      contrastRatio: fact(3.54), expectedContrastRatio: fact(4.5),
      fontSize: fact('12.0pt (16px)'), fontWeight: fact('normal'),
      measurementSource: 'axe-core', shadowColor: unavailable(), messageKey: unavailable(),
    });
    return finding;
  }
  return structuredClone(imageFinding()) as Mutable;
}

function runIdFor(caseId: CheckpointCaseId): string {
  return caseId in realCases
    ? realCases[caseId as RealCaseId].runId
    : controlledCases[caseId as ControlledCaseId].runId;
}

function selectorFor(caseId: CheckpointCaseId): string {
  if (caseId === 'G2') return ':root > :nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(2)';
  if (caseId === 'G3') return ':root > :nth-child(2) > :nth-child(1) > :nth-child(2)';
  return ':root > :nth-child(2) > :nth-child(1) > :nth-child(3)';
}

function coverage(findings: readonly Mutable[], observations: readonly Mutable[]) {
  const row = (rule: string) => {
    const violations = findings.filter(finding => finding.ruleId === rule).length;
    const incomplete = observations.filter(observation => observation.ruleId === rule).length;
    return violations || incomplete
      ? { violations: violations || null, incomplete: incomplete || null, passes: null, inapplicable: null }
      : { violations: null, incomplete: null, passes: null, inapplicable: 0 };
  };
  return { 'image-alt': row('image-alt'), label: row('label'), 'color-contrast': row('color-contrast') };
}

function alignCommon(run: Mutable, revision: string): void {
  run.applicationRevision = revision;
  run.requestedUrl = checkpointTargetUrl;
}

export function buildCheckpointSeed(caseId: CheckpointCaseId, revision: string) {
  assert.match(revision, /^[0-9a-f]{40}$/);
  const runId = runIdFor(caseId);
  const running = structuredClone(runningRun(runId, 'local')) as unknown as Mutable;
  alignCommon(running, revision);
  const completed = structuredClone(completedRun(runId, 'local')) as unknown as Mutable;
  alignCommon(completed, revision);
  completed.scan.context.finalUrl = fact(checkpointTargetUrl);
  const finding = selectedFinding(caseId);
  finding.findingId = checkpointFindingId;
  finding.locator = fact(selectorFor(caseId));
  completed.scan.findings[0] = finding;
  completed.scan.coverage = coverage(completed.scan.findings, completed.scan.scannerReviewObservations);
  const checked = validateRun(completed);
  assert.ok(checked.ok, `M204 ${caseId} completed seed must satisfy the production run validator`);
  assert.equal(checked.value.status, 'completed');
  if (checked.value.status !== 'completed') throw new Error(`M204 ${caseId} seed must be completed`);
  const query = createFindingQuery(checked.value.scan.findings[0]);
  assert.ok(query.ok, `M204 ${caseId} selected Finding must create a query`);
  const admittedQueryInput = prepareEmbeddingInput('Q', query.value.text);
  return Object.freeze({ running, completed: checked.value, query: query.value, admittedQueryInput });
}

export function sha256Json(input: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(input, null, 2) + '\n').digest('hex').toUpperCase();
}
