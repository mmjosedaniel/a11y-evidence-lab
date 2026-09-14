import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assessFindingEvidence } from '../../src/server/domain/finding-sufficiency.ts';
import { buildFindingAnalysis } from '../../src/server/domain/finding-analysis.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { validateReviewInput } from '../../src/server/domain/review-contract.ts';
import { resolveCitations } from '../../src/server/retrieval/citation-resolution.ts';
import { classifyGuidanceSupport } from '../../src/server/retrieval/support-policy.ts';
import type { ReviewOutcome } from '../../src/server/service.ts';
import { selectedFinding } from './m202-retrieval-service-fixture.ts';
import {
  durableReview,
  editedProposal,
  reviewFixture,
  reviewInput,
  type MutableReviewInput,
  type ReviewAction,
} from './m401-review-fixture.ts';
import {
  generationFinishedAt,
  generationFixture,
  generationInvocation,
  generationStartedAt,
  proposalGenerationRun,
  type GenerationMode,
  type GenerationProfile,
} from './m302-generation-fixture.ts';
import { completedScanRun, retrievalFinishedAt, retrievalStartedAt } from './m202-retrieval-service-fixture.ts';

export type ReviewIntentFixture = {
  runId: string;
  findingId: string;
  review: MutableReviewInput;
};

export type ReviewTransportFixture = {
  status: number;
  body: unknown;
};

export const reviewBodyLimit = 131072;

function validateCompleted(input: unknown, message: string) {
  const parsed = validateRun(input);
  assert.ok(parsed.ok && parsed.value.status === 'completed', message);
  return parsed.value;
}

function profileCoverage(run: Record<string | number, unknown>, profile: GenerationProfile): void {
  const scan = run.scan as Record<string, any>;
  for (const rule of ['image-alt', 'label', 'color-contrast'] as const) {
    const violations = scan.findings.filter((finding: any) => finding.ruleId === rule).length;
    scan.coverage[rule].violations = violations || null;
    scan.coverage[rule].inapplicable = violations || scan.coverage[rule].incomplete ? null : 0;
  }
  assert.equal(scan.findings[0].ruleId, profile);
}

export function reviewProfileStages(
  profile: GenerationProfile,
  runId = `m402-${profile}`,
  mode: GenerationMode = 'local',
) {
  const fixture = generationFixture(profile);
  const support = classifyGuidanceSupport(fixture.finding, fixture.retrieval);
  assert.ok(support.ok && support.value.state === 'supported', 'Synthetic profile guidance must be supported');
  const decision = buildFindingAnalysis(fixture.finding, retrievalStartedAt, retrievalFinishedAt, support.value);
  assert.equal(decision.state, 'active');

  const scan = structuredClone(completedScanRun(runId)) as unknown as Record<string | number, unknown>;
  scan.providerContext = mode === 'local'
    ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
    : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' };
  const scanFinding = selectedFinding(scan);
  for (const key of Object.keys(scanFinding)) delete scanFinding[key];
  Object.assign(scanFinding, structuredClone(fixture.finding));
  profileCoverage(scan, profile);
  const validatedScan = validateCompleted(scan, 'Synthetic profile scan must be valid');

  const guided = structuredClone(validatedScan) as unknown as Record<string | number, unknown>;
  Object.assign(selectedFinding(guided), {
    state: 'active',
    analysis: decision.analysis,
    retrieval: {
      status: 'completed', startedAt: retrievalStartedAt, finishedAt: retrievalFinishedAt,
      result: fixture.retrieval, support: support.value,
    },
  });
  const validatedGuided = validateCompleted(guided, 'Synthetic profile guidance aggregate must be valid');
  const resolved = resolveCitations(fixture.finding, fixture.retrieval,
    readCorpus('manifest.json'), readCorpus('passages.json'));
  assert.ok(resolved.ok, 'Synthetic profile citations must resolve');
  const guidance = { ok: true as const, run: validatedGuided,
    view: { runId, findingId: fixture.finding.findingId, ...resolved.value } };

  const pending = structuredClone(validatedGuided) as unknown as Record<string | number, unknown>;
  Object.assign(selectedFinding(pending), {
    state: 'proposal-pending-review',
    generation: {
      status: 'completed', startedAt: generationStartedAt, finishedAt: generationFinishedAt,
      invocation: generationInvocation(mode),
    },
    result: fixture.proposal,
  });
  const validatedPending = validateCompleted(pending, 'Synthetic profile pending review must be valid');
  return Object.freeze({ scan: validatedScan, guidance, pending: validatedPending });
}

export function reviewedProfileRun(
  action: ReviewAction,
  profile: GenerationProfile,
  runId = `m402-${profile}`,
  mode: GenerationMode = 'local',
  submitted: MutableReviewInput = reviewInput(action, profile),
  baseline: ReturnType<typeof reviewProfileStages>['pending'] = reviewProfileStages(profile, runId, mode).pending,
) {
  const original = baseline.scan.findings.find(candidate => candidate.findingId === 'finding-0');
  if (!original || original.state !== 'proposal-pending-review' || original.retrieval.status !== 'completed')
    throw new Error('Synthetic exact baseline must contain the pending reviewed Finding');
  const { retrieval, analysis: _analysis, generation: _generation, result: _result, ...nativeFields } = original;
  const parsed = validateReviewInput(submitted, {
    finding: { ...nativeFields, state: 'unprocessed' }, retrieval: retrieval.result,
  });
  assert.ok(parsed.ok, 'Synthetic submitted review must validate against its exact pending baseline');
  assert.equal(parsed.value.action, action, 'Synthetic reviewed state must match the validated submitted action');
  const run = structuredClone(baseline) as unknown as Record<string | number, unknown>;
  const finding = selectedFinding(run);
  finding.state = ({ approve: 'accepted', 'edit-and-accept': 'edited-and-accepted', reject: 'rejected' } as const)[action];
  finding.review = { ...parsed.value, decidedAt: durableReview(action, profile).decidedAt };
  return validateCompleted(run, 'Synthetic profile reviewed aggregate must be valid');
}

function readCorpus(name: string): Buffer {
  return readFileSync(new URL(`../../corpus/wcag22-mvp-v1/${name}`, import.meta.url));
}

export function pendingReviewRun(runId = 'run-01', mode: GenerationMode = 'local') {
  const parsed = validateRun(proposalGenerationRun(runId, mode));
  assert.ok(parsed.ok && parsed.value.status === 'completed', 'Synthetic pending review run must be valid');
  return parsed.value;
}

export function reviewIntent(
  action: ReviewAction = 'approve',
  runId = 'run-01',
  profile: GenerationProfile = 'image-alt',
): ReviewIntentFixture {
  return { runId, findingId: 'finding-0', review: reviewInput(action, profile) };
}

export function successfulReviewRun(
  action: ReviewAction = 'approve',
  runId = 'run-01',
  mode: GenerationMode = 'local',
) {
  const run = structuredClone(pendingReviewRun(runId, mode));
  const selected = selectedFinding(run as unknown as Record<string | number, unknown>);
  selected.state = ({
    approve: 'accepted',
    'edit-and-accept': 'edited-and-accepted',
    reject: 'rejected',
  } as const)[action];
  selected.review = durableReview(action);
  const parsed = validateRun(run);
  assert.ok(parsed.ok && parsed.value.status === 'completed', 'Synthetic reviewed run must be valid');
  return parsed.value;
}

export function reviewFailure(
  error: Extract<ReviewOutcome, { ok: false }>['error'],
  run: Extract<ReviewOutcome, { ok: false }>['run'] = null,
  cleanupFailed = false,
): Extract<ReviewOutcome, { ok: false }> {
  return { ok: false, error, run, persisted: false, cleanupFailed };
}

export function reviewTransport(status: number, body: unknown): ReviewTransportFixture {
  return { status, body };
}

function repeated(unit: string, length: number): string {
  return unit.repeat(Math.ceil(length / unit.length)).slice(0, length);
}

export function maximumReviewIntent(
  profile: GenerationProfile,
  unit: '\u0001' | 'é' = '\u0001',
): ReviewIntentFixture {
  const review = reviewInput('edit-and-accept', profile, {
    status: 'not-applicable',
    reason: repeated(unit, 500),
  });
  const proposal = editedProposal(profile);
  proposal.findingSummary.text = repeated(unit, 1000);
  proposal.userImpact.text = repeated(unit, 1000);
  proposal.remediation.text = repeated(unit, 2000);
  proposal.uncertainty = repeated(unit, 1000);
  proposal.assumptions = Array.from({ length: 5 }, () => repeated(unit, 500));
  proposal.blockingManualJudgment = repeated(unit, 1000);
  proposal.postChangeVerificationReminder = repeated(unit, 1000);
  const context = maximumReviewContext(profile);
  const evidenceReferences = [...assessFindingEvidence(context.finding).availableReferences];
  const passageIds = context.retrieval.passages.map(passage => passage.passageId);
  for (const field of [proposal.findingSummary, proposal.userImpact, proposal.remediation]) {
    field.evidenceReferences = [...evidenceReferences];
    field.passageIds = [...passageIds];
  }
  review.note = repeated(unit, 1000);
  const findingId = 'f'.repeat(64);
  proposal.findingId = findingId;
  review.editedProposal = proposal;
  return { runId: 'r'.repeat(64), findingId, review };
}

export function maximumReviewContext(profile: GenerationProfile) {
  const context = reviewFixture(profile);
  const finding = structuredClone(context.finding) as typeof context.finding;
  Object.defineProperty(finding, 'findingId', {
    value: 'f'.repeat(64), enumerable: true, writable: true, configurable: true,
  });
  return { finding, retrieval: context.retrieval };
}

export function fullyEscapeJson(value: unknown): string {
  if (typeof value === 'string') {
    let escaped = '"';
    for (let index = 0; index < value.length; index++) {
      escaped += `\\u${value.charCodeAt(index).toString(16).padStart(4, '0')}`;
    }
    return escaped + '"';
  }
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(fullyEscapeJson).join(',')}]`;
  assert.equal(typeof value, 'object');
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).map(key => `${fullyEscapeJson(key)}:${fullyEscapeJson(record[key])}`).join(',')}}`;
}
