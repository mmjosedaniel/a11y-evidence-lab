import assert from 'node:assert/strict';
import test from 'node:test';
import { assessFindingEvidence } from '../src/server/domain/finding-sufficiency.ts';
import { validateProposal } from '../src/server/generation/proposal-contract.ts';
import type { Proposal, ProposalValidationResult } from '../src/server/generation/proposal-contract.ts';
import {
  cloneCandidate,
  generationFixture,
} from './helpers/m302-generation-fixture.ts';
import type {
  GenerationProfile,
  MutableProposalCandidate,
  MutableSupportedText,
} from './helpers/m302-generation-fixture.ts';

const failure = Object.freeze({ ok: false, error: 'response-validation' } as const);

function expectDeepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

function expectValid(
  candidate: unknown,
  context = generationFixture(),
): Proposal {
  const result: ProposalValidationResult = validateProposal(candidate, context);
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error('Expected valid proposal');
  return result.value;
}

function expectInvalid(
  candidate: unknown,
  context = generationFixture(),
): void {
  const result: ProposalValidationResult = validateProposal(candidate, context);
  assert.deepEqual(result, failure);
  expectDeepFrozen(result);
}

function eachSupportedText(
  proposal: MutableProposalCandidate,
  action: (field: MutableSupportedText, name: 'findingSummary' | 'userImpact' | 'remediation') => void,
): void {
  for (const name of ['findingSummary', 'userImpact', 'remediation'] as const) action(proposal[name], name);
}

test('admits exact proposals for every profile as detached deeply frozen values with original prose', () => {
  for (const profile of ['image-alt', 'label', 'color-contrast'] as const satisfies readonly GenerationProfile[]) {
    const fixture = generationFixture(profile);
    fixture.proposal.uncertainty = '  Human judgment remains required.  ';
    const original = structuredClone(fixture.proposal);
    const value = expectValid(fixture.proposal, fixture);
    assert.deepEqual(value, original, profile);
    assert.notEqual(value, fixture.proposal);
    assert.notEqual(value.findingSummary, fixture.proposal.findingSummary);
    assert.notEqual(value.assumptions, fixture.proposal.assumptions);
    expectDeepFrozen(value);
    fixture.proposal.findingSummary.text = 'Changed after validation';
    fixture.proposal.assumptions[0] = 'Changed after validation';
    assert.deepEqual(value, original, profile);
  }
});

test('requires the closed eleven-field shape and every closed supported-field shape', () => {
  const fixture = generationFixture();
  for (const key of Object.keys(fixture.proposal)) {
    const missing = cloneCandidate(fixture.proposal) as Record<string, unknown>;
    delete missing[key];
    expectInvalid(missing, fixture);

    const nullValue = cloneCandidate(fixture.proposal) as Record<string, unknown>;
    nullValue[key] = null;
    expectInvalid(nullValue, fixture);
  }
  expectInvalid({ ...cloneCandidate(fixture.proposal), extra: true }, fixture);

  for (const fieldName of ['findingSummary', 'userImpact', 'remediation'] as const) {
    for (const key of ['text', 'evidenceReferences', 'passageIds'] as const) {
      const candidate = cloneCandidate(fixture.proposal);
      delete (candidate[fieldName] as unknown as Record<string, unknown>)[key];
      expectInvalid(candidate, fixture);
    }
    const candidate = cloneCandidate(fixture.proposal);
    (candidate[fieldName] as unknown as Record<string, unknown>).extra = true;
    expectInvalid(candidate, fixture);
  }
  const extraSufficiency = cloneCandidate(fixture.proposal);
  (extraSufficiency.evidenceSufficiency as unknown as Record<string, unknown>).extra = true;
  expectInvalid(extraSufficiency, fixture);
});

test('rejects accessors, unsupported prototypes, sparse arrays, coercion and defaults without invoking getters', () => {
  const fixture = generationFixture();
  let accessed = false;
  const accessor = cloneCandidate(fixture.proposal) as unknown as Record<string, unknown>;
  Object.defineProperty(accessor, 'confidence', {
    enumerable: true,
    get() { accessed = true; return 'high'; },
  });
  expectInvalid(accessor, fixture);
  assert.equal(accessed, false);

  const inherited = Object.assign(Object.create({ inherited: true }), cloneCandidate(fixture.proposal));
  expectInvalid(inherited, fixture);
  const sparse = cloneCandidate(fixture.proposal);
  sparse.assumptions = Array(1);
  expectInvalid(sparse, fixture);
  const coerced = cloneCandidate(fixture.proposal);
  coerced.confidence = { toString: () => 'high' } as never;
  expectInvalid(coerced, fixture);
  const noDefault = cloneCandidate(fixture.proposal) as Record<string, unknown>;
  delete noDefault.uncertainty;
  expectInvalid(noDefault, fixture);
});

test('enforces discriminator, selected Finding identity, exact sufficiency and categorical confidence', () => {
  const fixture = generationFixture();
  for (const [path, value] of [
    ['type', 'abstention'],
    ['findingId', 'finding-elsewhere'],
    ['confidence', 0.9],
  ] as const) {
    const candidate = cloneCandidate(fixture.proposal) as unknown as Record<string, unknown>;
    candidate[path] = value;
    expectInvalid(candidate, fixture);
  }
  for (const confidence of ['high', 'medium', 'low'] as const) {
    const candidate = cloneCandidate(fixture.proposal);
    candidate.confidence = confidence;
    expectValid(candidate, fixture);
  }
  for (const [key, value] of [['findingEvidence', 'incomplete'], ['guidance', 'missing']] as const) {
    const candidate = cloneCandidate(fixture.proposal);
    candidate.evidenceSufficiency[key] = value;
    expectInvalid(candidate, fixture);
  }
});

test('enforces field minima, unique exact evidence and selected correct-profile passage membership', () => {
  const fixture = generationFixture();
  const missingSummaryEvidence = cloneCandidate(fixture.proposal);
  missingSummaryEvidence.findingSummary.evidenceReferences = [];
  expectInvalid(missingSummaryEvidence, fixture);
  for (const name of ['userImpact', 'remediation'] as const) {
    const candidate = cloneCandidate(fixture.proposal);
    candidate[name].passageIds = [];
    expectInvalid(candidate, fixture);
  }

  const duplicateEvidence = cloneCandidate(fixture.proposal);
  duplicateEvidence.findingSummary.evidenceReferences = ['checks', 'checks'];
  expectInvalid(duplicateEvidence, fixture);
  const inventedEvidence = cloneCandidate(fixture.proposal);
  inventedEvidence.findingSummary.evidenceReferences = ['evidence.unknown'];
  expectInvalid(inventedEvidence, fixture);
  const duplicatePassage = cloneCandidate(fixture.proposal);
  duplicatePassage.userImpact.passageIds = ['wcag22-sc111', 'wcag22-sc111'];
  expectInvalid(duplicatePassage, fixture);
  const inventedPassage = cloneCandidate(fixture.proposal);
  inventedPassage.remediation.passageIds = ['unknown-passage'];
  expectInvalid(inventedPassage, fixture);
  const crossProfilePassage = cloneCandidate(fixture.proposal);
  crossProfilePassage.userImpact.passageIds = ['wcag22-sc412'];
  expectInvalid(crossProfilePassage, fixture);

  const maximum = cloneCandidate(fixture.proposal);
  const allEvidence = [...assessFindingEvidence(fixture.finding).availableReferences];
  const allPassages = fixture.retrieval.passages.map(({ passageId }) => passageId);
  eachSupportedText(maximum, field => {
    field.evidenceReferences = [...allEvidence];
    field.passageIds = [...allPassages];
  });
  expectValid(maximum, fixture);
  const beyondEvidenceSet = cloneCandidate(maximum);
  beyondEvidenceSet.findingSummary.evidenceReferences.push('evidence.unknown');
  expectInvalid(beyondEvidenceSet, fixture);
  const beyondPassageSet = cloneCandidate(maximum);
  beyondPassageSet.remediation.passageIds.push('h67-ignored-image');
  expectInvalid(beyondPassageSet, fixture);
});

test('recomputes native evidence, retrieval identity and guidance support instead of trusting candidate labels', () => {
  const incompleteEvidence = generationFixture('image-alt', { incompleteEvidence: true });
  expectInvalid(incompleteEvidence.proposal, incompleteEvidence);
  const missingGuidance = generationFixture('image-alt', { passageIds: [] });
  expectInvalid(missingGuidance.proposal, missingGuidance);
  const incompleteGuidance = generationFixture('image-alt', { passageIds: ['wcag22-sc111'] });
  expectInvalid(incompleteGuidance.proposal, incompleteGuidance);

  const fixture = generationFixture();
  const driftedRetrieval = structuredClone(fixture.retrieval) as unknown as Record<string, unknown>;
  ((driftedRetrieval.query as Record<string, unknown>).text as string) += ' drift';
  expectInvalid(fixture.proposal, { ...fixture, retrieval: driftedRetrieval as never });
  const wrongProfile = generationFixture('label');
  expectInvalid(fixture.proposal, { ...fixture, retrieval: wrongProfile.retrieval });
  expectInvalid(fixture.proposal, { ...fixture, finding: { ...fixture.finding, extra: true } as never });
});

test('enforces nonblank prose, original UTF-16 bounds and assumption limits', () => {
  const fixture = generationFixture();
  const proseLeaves: readonly ((candidate: MutableProposalCandidate, value: string) => void)[] = [
    (candidate, value) => { candidate.findingSummary.text = value; },
    (candidate, value) => { candidate.userImpact.text = value; },
    (candidate, value) => { candidate.uncertainty = value; },
    (candidate, value) => { candidate.blockingManualJudgment = value; },
    (candidate, value) => { candidate.postChangeVerificationReminder = value; },
  ];
  for (const assign of proseLeaves) {
    const blank = cloneCandidate(fixture.proposal);
    assign(blank, ' \t\n ');
    expectInvalid(blank, fixture);
    const boundary = cloneCandidate(fixture.proposal);
    assign(boundary, `${'a'.repeat(998)}😀`);
    expectValid(boundary, fixture);
    const excessive = cloneCandidate(fixture.proposal);
    assign(excessive, `${'a'.repeat(999)}😀`);
    expectInvalid(excessive, fixture);
  }
  const remediationBoundary = cloneCandidate(fixture.proposal);
  remediationBoundary.remediation.text = 'a'.repeat(2000);
  expectValid(remediationBoundary, fixture);
  remediationBoundary.remediation.text += 'a';
  expectInvalid(remediationBoundary, fixture);

  const fiveAssumptions = cloneCandidate(fixture.proposal);
  fiveAssumptions.assumptions = Array.from({ length: 5 }, () => 'a'.repeat(500));
  expectValid(fiveAssumptions, fixture);
  const sixAssumptions = cloneCandidate(fiveAssumptions);
  sixAssumptions.assumptions.push('sixth');
  expectInvalid(sixAssumptions, fixture);
  const longAssumption = cloneCandidate(fixture.proposal);
  longAssumption.assumptions = ['a'.repeat(501)];
  expectInvalid(longAssumption, fixture);
  const blankAssumption = cloneCandidate(fixture.proposal);
  blankAssumption.assumptions = ['  '];
  expectInvalid(blankAssumption, fixture);
});

test('applies all frozen lexical patterns to every listed prose leaf after exact normalization', () => {
  const fixture = generationFixture();
  const prohibited = [
    'This certification claims compliance.',
    'The whole page is fully accessible.',
    'The site is accessible.',
    'The finding has been fixed.',
    'Scanner evidence alone confirms the fix.',
  ] as const;
  const leaves: readonly ((candidate: MutableProposalCandidate, value: string) => void)[] = [
    (candidate, value) => { candidate.findingSummary.text = value; },
    (candidate, value) => { candidate.userImpact.text = value; },
    (candidate, value) => { candidate.remediation.text = value; },
    (candidate, value) => { candidate.uncertainty = value; },
    (candidate, value) => { candidate.assumptions[0] = value; },
    (candidate, value) => { candidate.blockingManualJudgment = value; },
    (candidate, value) => { candidate.postChangeVerificationReminder = value; },
  ];
  for (const phrase of prohibited) {
    for (const assign of leaves) {
      const candidate = cloneCandidate(fixture.proposal);
      assign(candidate, phrase);
      expectInvalid(candidate, fixture);
    }
  }
  const normalized = cloneCandidate(fixture.proposal);
  normalized.uncertainty = '  ＴＨＥ\tＦＩＮＤＩＮＧ\nＨＡＳ  ＢＥＥＮ  ＦＩＸＥＤ  ';
  expectInvalid(normalized, fixture);
});
