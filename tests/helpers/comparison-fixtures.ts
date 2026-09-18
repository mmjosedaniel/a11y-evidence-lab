import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../../src/server/domain/run-contract.ts';
import { readComparisonCandidates, readComparisonRuns } from '../../src/server/comparison/comparison-contract.ts';
import { compareFinding } from '../../src/server/comparison/compare-finding.ts';
import { compareScanProfiles, comparisonProfile } from '../../src/server/comparison/scan-pair.ts';
import { readObject } from '../../src/server/domain/run-contract/contract-value-reader.ts';
import { completedRun } from './m102-run-fixture.ts';

export type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;

export const fact = <T>(value: T) => ({ value });
export const unavailable = <R extends string>(reason: R = 'missing' as R) => ({ unavailable: reason });

export function validatedCompletedRun(input: unknown): CompletedRun {
  const result = validateRun(input);
  assert.ok(result.ok, 'Comparison fixture must satisfy the unchanged run validator');
  assert.equal(result.value.status, 'completed');
  return result.value as CompletedRun;
}

export function comparisonRunPair(): { baselineRun: CompletedRun; laterRun: CompletedRun } {
  const baselineRun = completedRun('baseline-run');
  const laterRun = validatedCompletedRun({
    ...completedRun('later-run'),
    baselineRunId: baselineRun.runId,
  });
  return { baselineRun, laterRun };
}

export function imagePassCandidate(locator = ':root > :nth-child(1)') {
  return {
    ruleId: 'image-alt' as const,
    nativeResult: 'pass' as const,
    locator: fact(locator),
    checks: fact({ any: ['has-alt'] as const, all: [] as const, none: [] as const }),
    evidence: { elementKind: fact('img' as const), altState: fact('non-empty' as const) },
  };
}

export function labelPassCandidate(locator = ':root > :nth-child(2)') {
  return {
    ruleId: 'label' as const,
    nativeResult: 'pass' as const,
    locator: fact(locator),
    checks: fact({ any: ['explicit-label'] as const, all: [] as const, none: [] as const }),
    evidence: {
      elementKind: fact('input' as const), inputType: fact('text' as const),
      nameSources: {
        explicitLabel: fact(true), implicitLabel: fact(false), ariaLabel: fact('absent' as const),
        ariaLabelledby: fact('absent' as const), title: fact('absent' as const),
        placeholder: fact('absent' as const), presentationalRole: fact(false),
      },
    },
  };
}

export function contrastPassCandidate(locator = ':root > :nth-child(3)') {
  return {
    ruleId: 'color-contrast' as const,
    nativeResult: 'pass' as const,
    locator: fact(locator),
    checks: fact({ any: ['color-contrast'] as const, all: [] as const, none: [] as const }),
    evidence: {
      foregroundColor: fact('#111111'), backgroundColor: fact('#ffffff'), shadowColor: unavailable(),
      contrastRatio: fact(18.88), expectedContrastRatio: fact(4.5 as const),
      fontSize: fact('12.0pt (16px)'), fontWeight: fact('normal' as const),
      measurementSource: 'axe-core' as const, messageKey: unavailable(),
    },
  };
}

export function coverage(passes: number | null) {
  return { violations: null, incomplete: null, passes, inapplicable: passes === null ? 0 : null };
}

type ControlledEndpoint = {
  readonly scenario: string;
  readonly ruleId: 'image-alt' | 'label' | 'color-contrast';
  readonly targetKey: string;
  readonly revision: string;
  readonly stateRole: 'failing' | 'corrected';
  readonly run: unknown;
};

export type ControlledDefinition = {
  readonly version: string;
  readonly sources: readonly { readonly path: string; readonly sha256: string }[];
  readonly profile: Record<string, unknown>;
  readonly endpoints: readonly (Omit<ControlledEndpoint, 'run'> & {
    readonly elementKind: string; readonly path: string; readonly sha256: string; readonly expectedLocator: string;
  })[];
  readonly pairs: readonly {
    readonly scenario: string; readonly ruleId: string; readonly targetKey: string;
    readonly baselineRevision: string; readonly laterRevision: string; readonly expectedOutcome: string;
  }[];
};

const definitionPath = 'evaluation/m502-comparison-v1.json';
const definitionHash = '8a44166b40f700b5dc35a3290b7a4958533c38fc454302d843499c576f43e0a8';
const fixedPaths = Object.freeze([
  'evaluation/rd003-scan-v1.json', 'evaluation/m301-generation-v1.json',
  'fixtures/rd003/informative-image-alt/failing.html',
  'fixtures/rd003/informative-image-alt/corrected.html',
  'fixtures/rd003/form-input-label/failing.html', 'fixtures/rd003/form-input-label/corrected.html',
  'fixtures/rd003/text-contrast/failing.html', 'fixtures/rd003/text-contrast/corrected.html',
] as const);
const mismatchOrder = Object.freeze([
  'requested-url', 'final-url', 'rule-profile', 'viewport', 'locale', 'browser-version',
  'scanner-version', 'evidence-policy', 'document-scope', 'readiness', 'scan-context', 'contrast-profile',
] as const);

function ownRecord(input: unknown, keys: readonly string[]): Record<string, unknown> | null {
  try {
    return readObject(input, keys);
  } catch {
    return null;
  }
}

function bytes(path: string): Buffer {
  const value = readFileSync(path);
  return Buffer.isBuffer(value) ? value : Buffer.from(value);
}

function hash(value: Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}

function loadDefinition(): ControlledDefinition | null {
  try {
    const value = bytes(definitionPath);
    if (hash(value) !== definitionHash) return null;
    return JSON.parse(value.toString('utf8')) as ControlledDefinition;
  } catch {
    return null;
  }
}

export type ControlledFixture = ControlledDefinition['endpoints'][number] & { readonly bytes: Buffer };

export function controlledComparisonFixtures(): readonly ControlledFixture[] {
  const definition = loadDefinition();
  assert.ok(definition, 'Controlled comparison definition and hash must remain valid');
  for (const source of definition.sources) {
    assert.equal(hash(bytes(source.path)), source.sha256, `Original manifest changed: ${source.path}`);
  }
  return Object.freeze(definition.endpoints.map(endpoint => {
    const value = bytes(endpoint.path);
    assert.equal(hash(value), endpoint.sha256, `Controlled fixture changed: ${endpoint.path}`);
    return Object.freeze({ ...endpoint, bytes: value });
  }));
}

function endpointMetadata(input: unknown): ControlledEndpoint | null {
  const value = ownRecord(input, ['scenario', 'ruleId', 'targetKey', 'revision', 'stateRole', 'run']);
  if (!value || typeof value.scenario !== 'string' || typeof value.targetKey !== 'string' ||
      typeof value.revision !== 'string' || typeof value.ruleId !== 'string' ||
      !['image-alt', 'label', 'color-contrast'].includes(value.ruleId) || typeof value.stateRole !== 'string' ||
      !['failing', 'corrected'].includes(value.stateRole)) return null;
  return value as unknown as ControlledEndpoint;
}

export function compareControlledScanPair(input: unknown):
  | { readonly kind: 'invalid-input'; readonly reason: 'invalid-metadata' | 'source-integrity' | 'invalid-scan-input' }
  | { readonly kind: 'not-comparable'; readonly reason: 'undeclared-direction' }
  | { readonly kind: 'not-comparable'; readonly reason: 'profile-mismatch'; readonly mismatches: readonly string[] }
  | { readonly kind: 'inconclusive'; readonly reason: 'missing-target' | 'ambiguous-target'; readonly side: 'baseline' }
  | { readonly kind: 'comparison'; readonly result: ReturnType<typeof compareFinding> } {
  const record = ownRecord(input, ['definitionVersion', 'baseline', 'later', 'candidates']);
  const baseline = record && endpointMetadata(record.baseline);
  const later = record && endpointMetadata(record.later);
  if (!record || record.definitionVersion !== 'm502-comparison-v1' || !baseline || !later) {
    return Object.freeze({ kind: 'invalid-input', reason: 'invalid-metadata' });
  }

  const definition = loadDefinition();
  if (!definition || definition.version !== 'm502-comparison-v1') {
    return Object.freeze({ kind: 'invalid-input', reason: 'source-integrity' });
  }
  const baselineDeclaration = definition.endpoints.find(item => item.scenario === baseline.scenario &&
    item.ruleId === baseline.ruleId && item.targetKey === baseline.targetKey && item.revision === baseline.revision &&
    item.stateRole === baseline.stateRole);
  const laterDeclaration = definition.endpoints.find(item => item.scenario === later.scenario &&
    item.ruleId === later.ruleId && item.targetKey === later.targetKey && item.revision === later.revision &&
    item.stateRole === later.stateRole);
  if (!baselineDeclaration || !laterDeclaration) {
    return Object.freeze({ kind: 'invalid-input', reason: 'invalid-metadata' });
  }

  try {
    const fixed = [...definition.sources, ...definition.endpoints.map(item => ({ path: item.path, sha256: item.sha256 }))];
    if (fixed.length !== fixedPaths.length || fixed.some(item => !fixedPaths.includes(item.path as typeof fixedPaths[number])) ||
        new Set(fixed.map(item => item.path)).size !== fixedPaths.length) {
      return Object.freeze({ kind: 'invalid-input', reason: 'source-integrity' });
    }
    if (fixed.some(item => hash(bytes(item.path)) !== item.sha256)) {
      return Object.freeze({ kind: 'invalid-input', reason: 'source-integrity' });
    }
  } catch {
    return Object.freeze({ kind: 'invalid-input', reason: 'source-integrity' });
  }

  let runs: ReturnType<typeof readComparisonRuns>;
  let candidates: ReturnType<typeof readComparisonCandidates>;
  try {
    runs = readComparisonRuns({ baselineRun: baseline.run, laterRun: later.run });
    candidates = readComparisonCandidates(record.candidates, baseline.ruleId,
      runs.laterRun.scan.coverage[baseline.ruleId]);
  } catch {
    return Object.freeze({ kind: 'invalid-input', reason: 'invalid-scan-input' });
  }

  const pair = definition.pairs.find(item => item.scenario === baseline.scenario && item.ruleId === baseline.ruleId &&
    item.targetKey === baseline.targetKey && item.baselineRevision === baseline.revision &&
    item.laterRevision === later.revision && later.scenario === baseline.scenario && later.ruleId === baseline.ruleId &&
    later.targetKey === baseline.targetKey);
  if (!pair) return Object.freeze({ kind: 'not-comparable', reason: 'undeclared-direction' });

  const baselineProfile = comparisonProfile(runs.baselineRun, baseline.ruleId);
  const laterProfile = comparisonProfile(runs.laterRun, baseline.ruleId);
  const declaredProfile = { ...definition.profile, contrastProfile: baseline.ruleId === 'color-contrast'
    ? definition.profile.contrastProfile : null } as unknown as Parameters<typeof compareScanProfiles>[0];
  const mismatchSet = new Set([
    ...compareScanProfiles(baselineProfile, laterProfile),
    ...compareScanProfiles(declaredProfile, baselineProfile),
    ...compareScanProfiles(declaredProfile, laterProfile),
  ]);
  const mismatches = Object.freeze(mismatchOrder.filter(code => mismatchSet.has(code)));
  if (mismatches.length) return Object.freeze({ kind: 'not-comparable', reason: 'profile-mismatch', mismatches });

  const matches = runs.baselineRun.scan.findings.filter(finding => finding.ruleId === baseline.ruleId &&
    'value' in finding.locator && finding.locator.value === baselineDeclaration.expectedLocator);
  if (matches.length !== 1) return Object.freeze({ kind: 'inconclusive',
    reason: matches.length ? 'ambiguous-target' : 'missing-target', side: 'baseline' });
  return Object.freeze({ kind: 'comparison', result: compareFinding({
    baselineRun: runs.baselineRun, baselineFindingId: matches[0]!.findingId,
    laterRun: runs.laterRun, candidates,
  }) });
}
