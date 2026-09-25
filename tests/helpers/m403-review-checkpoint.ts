import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { admitGeneration } from '../../src/client/findings/finding-generation-admission.ts';
import { admitGuidance } from '../../src/client/findings/finding-guidance-admission.ts';
import { admitReview } from '../../src/client/review/finding-review-admission.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../../src/server/domain/run-contract.ts';
import { validateReviewInput } from '../../src/server/domain/review-contract.ts';
import type { ReviewBody } from '../../src/server/domain/review-contract.ts';
import type { Proposal } from '../../src/server/generation/proposal-contract.ts';
import { loadClientResponses } from '../../src/server/local-service/client-assets.ts';
import { resolveCitations } from '../../src/server/retrieval/citation-resolution.ts';
import { startLocalService } from '../../src/server/service.ts';
import { assessedMissingRetrievalRun } from './m202-retrieval-service-fixture.ts';

const repositoryRoot = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const clientRoot = path.join(repositoryRoot, 'dist/client');
const casesRoot = path.join(repositoryRoot, 'temp/m403-review-checkpoint-cases');
const evidenceRoot = path.join(repositoryRoot, 'temp/m403-review-checkpoint-evidence');
const corpusManifest = path.join(repositoryRoot, 'corpus/wcag22-mvp-v1/manifest.json');
const corpusPassages = path.join(repositoryRoot, 'corpus/wcag22-mvp-v1/passages.json');
const applicationRevision = '303b7985e2a5e8b65f6522e4480e396c5953703d';

export const checkpointCases = ['approve', 'edit-and-accept', 'reject'] as const;
export type CheckpointCase = typeof checkpointCases[number];

const sources = Object.freeze({
  local: Object.freeze({
    path: path.join(repositoryRoot, 'data/runs/run-b785db0b-5ed0-4baa-b62f-9be6181d5e72/run.json'),
    runId: 'run-b785db0b-5ed0-4baa-b62f-9be6181d5e72',
    findingId: '50dcefee-7e74-4253-a373-c5bbf2ab839b',
    sha256: 'df21550331a276095d3d5780eec301d88285af2f91fcc4414a37848a830726aa',
  }),
  groq: Object.freeze({
    path: path.join(repositoryRoot, 'data/runs/run-d4d06856-39d7-4196-b607-8e2f2815b302/run.json'),
    runId: 'run-d4d06856-39d7-4196-b607-8e2f2815b302',
    findingId: 'f0a4f4ff-5beb-4676-9055-0ea763523e70',
    sha256: '61eb5b6fccc59083850ea147838a1049ab42090e75fc82a607c5874663d5960b',
  }),
});

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type CheckpointStages = ReturnType<typeof buildStages>;
type DecisionInput = {
  readonly caseId: CheckpointCase;
  readonly sourceSha256: string;
  readonly runId: string;
  readonly findingId: string;
  readonly review: ReviewBody & { readonly supportConfirmed?: true };
};

export type CheckpointBinding = {
  readonly caseId: CheckpointCase;
  readonly sourceBytes: Buffer;
  readonly sourceSha256: string;
  readonly runId: string;
  readonly findingId: string;
};

export type CheckpointExecution = {
  readonly binding: CheckpointBinding;
  readonly runRoot: string;
  readonly evidenceDirectory: string;
  readonly decisionBytes: Buffer;
  readonly expectedDecisionSha256: string;
  readonly captureScreenshots?: boolean;
  readonly probeBlockedRequests?: boolean;
  readonly characterizationCaptureHeightLimit?: number;
};

export type CheckpointRecovery = {
  readonly binding: CheckpointBinding;
  readonly decisionBytes: Buffer;
  readonly expectedDecisionSha256: string;
  readonly attemptBytes: Buffer;
  readonly requestBytes: Buffer;
  readonly reviewedRunBytes: Buffer;
};

export type CheckpointCleanup = {
  readonly binding: CheckpointBinding;
  readonly caseDirectory: string;
  readonly evidenceDirectory: string;
  readonly captureScreenshots?: boolean;
};

function sha256(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function exactObject(value: unknown, keys: readonly string[]): Record<string, unknown> {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  const record = value as Record<string, unknown>;
  assert.deepEqual(Object.keys(record).sort(), [...keys].sort());
  return record;
}

function parsedComplete(bytes: Buffer): CompleteRun {
  const parsed = validateRun(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  assert.ok(parsed.ok && parsed.value.status === 'completed', 'Checkpoint source must be a valid completed run');
  return parsed.value;
}

function selectedPending(run: CompleteRun, findingId: string) {
  const selected = run.scan.findings.find(finding => finding.findingId === findingId);
  assert.ok(selected?.state === 'proposal-pending-review', 'Checkpoint source must contain the selected pending proposal');
  return selected;
}

export function inspectBinding(binding: CheckpointBinding): CheckpointStages {
  assert.ok(checkpointCases.includes(binding.caseId));
  assert.equal(sha256(binding.sourceBytes), binding.sourceSha256, 'Checkpoint source hash mismatch');
  const pending = parsedComplete(binding.sourceBytes);
  assert.equal(pending.runId, binding.runId, 'Checkpoint source run mismatch');
  selectedPending(pending, binding.findingId);
  return buildStages(pending, binding.findingId,
    fs.readFileSync(corpusManifest), fs.readFileSync(corpusPassages));
}

function buildStages(pending: CompleteRun, findingId: string, manifestBytes: Buffer, passageBytes: Buffer) {
  const original = selectedPending(pending, findingId);
  const scanCandidate = structuredClone(pending) as CompleteRun;
  const scanSelected = scanCandidate.scan.findings.find(finding => finding.findingId === findingId)! as Record<string, unknown>;
  for (const key of ['analysis', 'retrieval', 'generation', 'result']) delete scanSelected[key];
  scanSelected.state = 'unprocessed';
  const scan = validateRun(scanCandidate);
  assert.ok(scan.ok && scan.value.status === 'completed', 'Authentic scan projection must validate');

  const guidedCandidate = structuredClone(pending) as CompleteRun;
  const guidedSelected = guidedCandidate.scan.findings.find(finding => finding.findingId === findingId)! as Record<string, unknown>;
  delete guidedSelected.generation;
  delete guidedSelected.result;
  guidedSelected.state = 'active';
  const guided = validateRun(guidedCandidate);
  assert.ok(guided.ok && guided.value.status === 'completed', 'Authentic guidance projection must validate');
  assert.ok('retrieval' in original && original.retrieval.status === 'completed');
  const { analysis: _analysis, retrieval: _retrieval, generation: _generation, result: _result, ...native } = original;
  const resolved = resolveCitations({ ...native, state: 'unprocessed' }, original.retrieval.result, manifestBytes, passageBytes);
  assert.ok(resolved.ok, 'Checkpoint citations must authenticate');
  const guidance = { ok: true as const, run: guided.value,
    view: { runId: pending.runId, findingId, ...resolved.value } };
  assert.ok(admitGuidance(guidance, scan.value, findingId)?.ok, 'Guidance projection must admit');
  assert.ok(admitGeneration({ ok: true, run: pending }, guided.value, findingId)?.ok,
    'Pending projection must admit from guidance');
  return Object.freeze({ scan: scan.value, guidance, guided: guided.value, pending });
}

function ordinaryDirectory(directory: string): void {
  const resolved = path.resolve(directory);
  const repositoryPrefix = repositoryRoot.endsWith(path.sep) ? repositoryRoot : repositoryRoot + path.sep;
  assert.ok(resolved.toLowerCase() === repositoryRoot.toLowerCase()
    || resolved.toLowerCase().startsWith(repositoryPrefix.toLowerCase()), 'Checkpoint directory escapes repository');
  let cursor = resolved;
  for (;;) {
    const item = fs.lstatSync(cursor);
    assert.ok(item.isDirectory() && !item.isSymbolicLink(), `Unsafe directory: ${cursor}`);
    assert.equal(fs.realpathSync.native(cursor).toLowerCase(), cursor.toLowerCase());
    if (cursor.toLowerCase() === repositoryRoot.toLowerCase()) break;
    const parent = path.dirname(cursor);
    cursor = parent;
  }
}

function ordinaryInventory(directory: string): void {
  ordinaryDirectory(directory);
  for (const name of fs.readdirSync(directory)) {
    const child = path.join(directory, name);
    const item = fs.lstatSync(child);
    assert.equal(item.isSymbolicLink(), false, 'Checkpoint inventory cannot contain links');
    if (item.isDirectory()) ordinaryInventory(child);
    else assert.ok(item.isFile() && item.nlink === 1, 'Checkpoint inventory files must be ordinary and singly linked');
  }
}

function ordinaryFile(file: string): void {
  ordinaryDirectory(path.dirname(file));
  const item = fs.lstatSync(file);
  assert.ok(item.isFile() && !item.isSymbolicLink() && item.nlink === 1, `Unsafe checkpoint file: ${file}`);
  assert.equal(fs.realpathSync.native(file).toLowerCase(), path.resolve(file).toLowerCase());
}

export function prepareIsolatedCase(binding: CheckpointBinding, runRoot: string): string {
  inspectBinding(binding);
  const parent = path.dirname(runRoot);
  ordinaryDirectory(parent);
  fs.mkdirSync(runRoot, { recursive: false });
  const runDirectory = path.join(runRoot, binding.runId);
  fs.mkdirSync(runDirectory, { recursive: false });
  const destination = path.join(runDirectory, 'run.json');
  fs.writeFileSync(destination, binding.sourceBytes, { flag: 'wx' });
  ordinaryFile(destination);
  assert.equal(sha256(fs.readFileSync(destination)), binding.sourceSha256);
  ordinaryInventory(runRoot);
  return destination;
}

function parseDecisionBytes(binding: CheckpointBinding, decisionBytes: Buffer,
  expectedDecisionSha256: string, stages: CheckpointStages): DecisionInput {
  assert.equal(sha256(decisionBytes), expectedDecisionSha256, 'Decision file hash mismatch');
  const record = exactObject(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(decisionBytes)),
    ['caseId', 'sourceSha256', 'runId', 'findingId', 'review']);
  assert.equal(record.caseId, binding.caseId, 'Decision case mismatch');
  assert.equal(record.sourceSha256, binding.sourceSha256, 'Decision source mismatch');
  assert.equal(record.runId, binding.runId, 'Decision run mismatch');
  assert.equal(record.findingId, binding.findingId, 'Decision Finding mismatch');
  const selected = selectedPending(stages.pending, binding.findingId);
  assert.ok('retrieval' in selected && selected.retrieval.status === 'completed');
  const { analysis: _analysis, retrieval, generation: _generation, result: _result, ...native } = selected;
  const review = validateReviewInput(record.review, { finding: { ...native, state: 'unprocessed' }, retrieval: retrieval.result });
  assert.ok(review.ok && review.value.action === binding.caseId, 'Decision action/body mismatch');
  return record as unknown as DecisionInput;
}

function parseDecision(input: CheckpointExecution, stages: CheckpointStages): DecisionInput {
  return parseDecisionBytes(input.binding, input.decisionBytes, input.expectedDecisionSha256, stages);
}

export function authenticateRecoveredCase(input: CheckpointRecovery): CompleteRun {
  const stages = inspectBinding(input.binding);
  const decision = parseDecisionBytes(input.binding, input.decisionBytes, input.expectedDecisionSha256, stages);
  const attempt = exactObject(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(input.attemptBytes)),
    ['caseId', 'sourceSha256', 'decisionSha256']);
  same(attempt, { caseId: input.binding.caseId, sourceSha256: input.binding.sourceSha256,
    decisionSha256: input.expectedDecisionSha256 }, 'Attempt marker differs from authorized decision');
  const request = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(input.requestBytes));
  same(request, { runId: decision.runId, findingId: decision.findingId, review: decision.review },
    'Captured request differs from authorized decision');
  const reviewed = parsedComplete(input.reviewedRunBytes);
  const selected = reviewed.scan.findings.find(finding => finding.findingId === input.binding.findingId);
  assert.ok(selected && 'review' in selected && selected.review.action === input.binding.caseId,
    'Recovered action differs from fixed case');
  const sourceSelected = selectedPending(stages.pending, input.binding.findingId);
  assert.ok('retrieval' in sourceSelected && sourceSelected.retrieval.status === 'completed');
  const { analysis: _analysis, retrieval, generation: _generation, result: _result, ...native } = sourceSelected;
  const authorized = validateReviewInput(decision.review,
    { finding: { ...native, state: 'unprocessed' }, retrieval: retrieval.result });
  assert.ok(authorized.ok);
  const { decidedAt, ...durableDecision } = selected.review;
  same(durableDecision, authorized.value, 'Recovered decision differs from authorized decision');
  assert.ok(Date.parse(decidedAt) >= Date.parse(sourceSelected.generation.finishedAt));
  const { review: _review, ...withoutReview } = selected;
  const restored = { ...withoutReview, state: 'proposal-pending-review' };
  same(stages.pending, { ...reviewed, scan: { ...reviewed.scan,
    findings: reviewed.scan.findings.map(finding => finding.findingId === input.binding.findingId ? restored : finding) } },
  'Recovered run changed immutable source context');
  return reviewed;
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('Checkpoint service port did not close')); });
    socket.once('connect', () => { socket.destroy(); reject(new Error('Checkpoint service remains reachable')); });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve(); else reject(error);
    });
  });
}

async function stopOwned(service: { readonly url: string; stop(): Promise<unknown> }): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([service.stop(), new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Checkpoint service stop timeout')), 6500);
    })]);
  } finally { clearTimeout(timer); }
  await portClosed(service.url);
}

function same(value: unknown, expected: unknown, message: string): void {
  assert.deepEqual(value, expected, message);
}

function routeBody(request: { postDataJSON(): unknown }, expected: unknown): void {
  same(request.postDataJSON(), expected, 'Checkpoint staged request body mismatch');
}

async function selectFinding(page: Page, stages: CheckpointStages, findingId: string): Promise<void> {
  const selected = stages.pending.scan.findings.find(finding => finding.findingId === findingId)!;
  await page.getByLabel('Target URL').fill(stages.scan.requestedUrl);
  await page.getByRole('radio', { name: stages.scan.providerContext.mode === 'local' ? /Local/ : /Groq/ }).check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  const findings = page.getByRole('region', { name: 'Findings', exact: true });
  const label = selected.ruleId === 'image-alt' ? /Image alternative issue \d+/i
    : selected.ruleId === 'label' ? /Form label issue \d+/i : /Color contrast issue \d+/i;
  const card = findings.getByRole('button', { name: label }).first();
  await card.click();
  await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
  await page.getByRole('button', { name: 'Generate', exact: true }).click();
  await page.getByText('This is the original model-generated proposal. Human review is still required.', { exact: true }).waitFor();
}

async function setReferenceGroup(page: Page, legend: string, expected: readonly string[]): Promise<void> {
  assert.equal(new Set(expected).size, expected.length, 'Authorized reference order cannot contain duplicates');
  const group = page.locator('fieldset.review-reference-options').filter({ has: page.locator('legend', { hasText: legend }) });
  const inputs = group.locator('input[type=checkbox]');
  const count = await inputs.count();
  const positions = new Map<string, number>();
  for (let index = 0; index < count; index++) {
    const input = inputs.nth(index);
    const value = await input.getAttribute('value');
    assert.ok(value);
    assert.equal(positions.has(value), false, 'Reference controls must be unique');
    positions.set(value, index);
    if (await input.isChecked()) await input.click();
  }
  for (const value of expected) {
    const position = positions.get(value);
    assert.notEqual(position, undefined, `Authorized reference is unavailable: ${value}`);
    await inputs.nth(position!).click();
  }
}

async function fillEditedProposal(page: Page, proposal: Proposal, original: Proposal): Promise<void> {
  assert.equal(proposal.type, original.type);
  assert.equal(proposal.findingId, original.findingId);
  assert.deepEqual(proposal.evidenceSufficiency, original.evidenceSufficiency);
  const claimFields = [['findingSummary', 'Finding summary'], ['userImpact', 'User impact'],
    ['remediation', 'Remediation proposal']] as const;
  for (const [key, label] of claimFields) {
    await page.getByLabel(label, { exact: true }).fill(proposal[key].text);
    await setReferenceGroup(page, `${label} evidence references`, proposal[key].evidenceReferences);
    await setReferenceGroup(page, `${label} retrieved guidance references`, proposal[key].passageIds);
  }
  await page.getByLabel('Confidence', { exact: true }).selectOption(proposal.confidence);
  for (const [label, value] of [['Uncertainty', proposal.uncertainty],
    ['Blocking manual judgment', proposal.blockingManualJudgment],
    ['Post-change verification reminder', proposal.postChangeVerificationReminder]] as const) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  assert.ok(proposal.assumptions.length <= 5, 'The current editor supports at most five assumptions');
  for (let index = 0; index < 5; index++) {
    await page.getByLabel(`Assumption ${index + 1}`, { exact: true }).fill(proposal.assumptions[index] ?? '');
  }
}

async function fillDecision(page: Page, decision: DecisionInput, stages: CheckpointStages): Promise<void> {
  const review = decision.review;
  const label = review.action === 'approve' ? 'Approve' : review.action === 'edit-and-accept' ? 'Edit and accept' : 'Reject';
  await page.getByRole('radio', { name: label, exact: true }).check();
  if (review.action === 'edit-and-accept') {
    const selected = selectedPending(stages.pending, decision.findingId);
    assert.ok('result' in selected && selected.result.type === 'proposal');
    await fillEditedProposal(page, review.editedProposal, selected.result);
  }
  await page.getByLabel(/blocking judgment/i).selectOption(review.blockingJudgment.status);
  if (review.blockingJudgment.status === 'not-applicable') {
    await page.getByLabel('Not applicable reason', { exact: true }).fill(review.blockingJudgment.reason);
  }
  if (review.note !== undefined) await page.getByLabel(/reviewer note/i).fill(review.note);
  if (review.action !== 'reject') await page.getByLabel(/confirm.*material claims/i).check();
}

type RouteEvidence = {
  reviewAttempts: number;
  reviewForwards: number;
  staged: Record<string, number>;
  rejected: string[];
  request?: unknown;
  response?: { status: number; body: unknown };
  captures?: Record<string, ReviewCaptureRegion>;
};

export type ReviewCaptureRegion = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export function validateReviewCaptureRegion(region: ReviewCaptureRegion, viewportWidth: number,
  documentHeight: number, maximumHeight = 12000): void {
  assert.ok(Number.isInteger(region.x) && region.x === 0);
  assert.ok(Number.isInteger(region.y) && region.y >= 0);
  assert.ok(Number.isInteger(region.width) && region.width === viewportWidth && region.width > 0);
  assert.ok(Number.isInteger(maximumHeight) && maximumHeight > 0 && maximumHeight <= 12000);
  assert.ok(Number.isInteger(region.height) && region.height > 0 && region.height <= maximumHeight);
  assert.ok(region.y + region.height <= documentHeight + 1, 'Review capture exceeds the rendered document');
}

async function captureReviewRegion(page: Page, directory: string, name: string,
  endingSelector: '.proposal-review' | '.review-decision', maximumHeight = 12000): Promise<ReviewCaptureRegion> {
  const measured = await page.evaluate(endingSelector => {
    const first = document.querySelector('.proposal-detail');
    const last = document.querySelector(endingSelector);
    if (!(first instanceof HTMLElement) || !(last instanceof HTMLElement)) return null;
    const firstBounds = first.getBoundingClientRect();
    const lastBounds = last.getBoundingClientRect();
    const y = Math.floor(window.scrollY + firstBounds.top);
    const bottom = Math.ceil(window.scrollY + lastBounds.bottom);
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    return { region: { x: 0, y, width: document.documentElement.clientWidth, height: bottom - y },
      documentHeight, scrollWidth: document.documentElement.scrollWidth };
  }, endingSelector);
  assert.ok(measured, 'Required review capture elements are missing');
  const viewport = page.viewportSize();
  assert.ok(viewport);
  validateReviewCaptureRegion(measured.region, viewport.width, measured.documentHeight, maximumHeight);
  assert.ok(measured.scrollWidth <= viewport.width, 'Review capture has horizontal document overflow');
  fs.mkdirSync(directory, { recursive: true });
  const destination = path.join(directory, `${name}.png`);
  assert.equal(fs.existsSync(destination), false, 'Checkpoint screenshot already exists');
  await page.screenshot({ path: destination, fullPage: true, clip: measured.region });
  ordinaryFile(destination);
  return measured.region;
}

async function installRoutes(context: BrowserContext, serviceUrl: string, stages: CheckpointStages,
  findingId: string, expectedReview: unknown | undefined, recordDirectory?: string): Promise<RouteEvidence> {
  const assets = loadClientResponses(clientRoot);
  const evidence: RouteEvidence = { reviewAttempts: 0, reviewForwards: 0, staged: {}, rejected: [] };
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== serviceUrl || url.search || url.hash) {
      evidence.rejected.push(request.url()); await route.abort('blockedbyclient'); return;
    }
    if (request.method() === 'GET') {
      if (url.pathname === '/favicon.ico') { await route.fulfill({ status: 204 }); return; }
      const asset = assets[url.pathname];
      if (asset) { await route.fulfill({ status: 200, contentType: asset.contentType, body: asset.body }); return; }
      evidence.rejected.push(`${request.method()} ${url.pathname}`); await route.abort('blockedbyclient'); return;
    }
    if (request.method() !== 'POST') {
      evidence.rejected.push(`${request.method()} ${url.pathname}`); await route.abort('blockedbyclient'); return;
    }
    if (url.pathname === '/api/runs') {
      routeBody(request, { requestedUrl: stages.scan.requestedUrl, mode: stages.scan.providerContext.mode });
      evidence.staged[url.pathname] = (evidence.staged[url.pathname] ?? 0) + 1;
      assert.equal(evidence.staged[url.pathname], 1, 'Analyze stage may be replayed once');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, run: stages.scan }) }); return;
    }
    if (url.pathname === '/api/finding-guidance') {
      routeBody(request, { runId: stages.pending.runId, findingId });
      evidence.staged[url.pathname] = (evidence.staged[url.pathname] ?? 0) + 1;
      assert.equal(evidence.staged[url.pathname], 1, 'Guidance stage may be replayed once');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(stages.guidance) }); return;
    }
    if (url.pathname === '/api/finding-generation') {
      routeBody(request, { runId: stages.pending.runId, findingId });
      evidence.staged[url.pathname] = (evidence.staged[url.pathname] ?? 0) + 1;
      assert.equal(evidence.staged[url.pathname], 1, 'Generation stage may be replayed once');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, run: stages.pending }) }); return;
    }
    if (url.pathname === '/api/finding-review') {
      evidence.reviewAttempts++;
      assert.equal(evidence.reviewAttempts, 1, 'Review may be attempted once');
      const intent = request.postDataJSON();
      if (expectedReview === undefined) {
        evidence.rejected.push(`${request.method()} ${url.pathname}`); await route.abort('blockedbyclient'); return;
      }
      same(intent, expectedReview, 'Browser review intent differs from authorized input');
      evidence.request = intent;
      if (recordDirectory) fs.writeFileSync(path.join(recordDirectory, 'request.json'),
        JSON.stringify(intent, null, 2) + '\n', { flag: 'wx' });
      evidence.reviewForwards++;
      assert.equal(evidence.reviewForwards, 1, 'Review may be forwarded once');
      const response = await route.fetch();
      const body = await response.json();
      evidence.response = { status: response.status(), body };
      if (recordDirectory) fs.writeFileSync(path.join(recordDirectory, 'response.json'),
        JSON.stringify(evidence.response, null, 2) + '\n', { flag: 'wx' });
      await route.fulfill({ response, body: JSON.stringify(body) }); return;
    }
    evidence.rejected.push(`${request.method()} ${url.pathname}`);
    await route.abort('blockedbyclient');
  });
  return evidence;
}

async function renderSyntheticAbstention(browser: Browser, serviceUrl: string, directory: string): Promise<void> {
  const run = assessedMissingRetrievalRun('m403-synthetic-abstention');
  const parsed = validateRun(run);
  assert.ok(parsed.ok && parsed.value.status === 'completed');
  const assets = loadClientResponses(clientRoot);
  const calls: string[] = [];
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 },
    acceptDownloads: false, serviceWorkers: 'block' });
  try {
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin !== serviceUrl || url.search || url.hash) {
        calls.push(`${request.method()} ${request.url()}`); await route.abort('blockedbyclient'); return;
      }
      if (request.method() === 'GET' && url.pathname === '/favicon.ico') {
        await route.fulfill({ status: 204 }); return;
      }
      const asset = request.method() === 'GET' ? assets[url.pathname] : undefined;
      if (asset) {
        await route.fulfill({ status: 200, contentType: asset.contentType, body: asset.body }); return;
      }
      if (request.method() === 'POST' && url.pathname === '/api/runs') {
        routeBody(request, { requestedUrl: parsed.value.requestedUrl, mode: parsed.value.providerContext.mode });
        calls.push(url.pathname);
        assert.equal(calls.filter(value => value === url.pathname).length, 1);
        await route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: true, run: parsed.value }) }); return;
      }
      calls.push(`${request.method()} ${url.pathname}`);
      await route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(serviceUrl);
    await page.getByLabel('Target URL').fill(parsed.value.requestedUrl);
    await page.getByRole('radio', { name: /Local/ }).check();
    await page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').first().click();
    assert.equal(await page.getByRole('button', { name: 'Generate', exact: true }).count(), 0);
    assert.equal(await page.getByRole('radio', { name: /Approve|Edit and accept|Reject/ }).count(), 0);
    await capture(page, directory, 'synthetic-abstention');
    assert.deepEqual(calls, ['/api/runs']);
  } finally { await context.close(); }
}

async function capture(page: Page, directory: string, name: string): Promise<void> {
  fs.mkdirSync(directory, { recursive: true });
  const destination = path.join(directory, `${name}.png`);
  assert.equal(fs.existsSync(destination), false, 'Checkpoint screenshot already exists');
  await page.screenshot({ path: destination, fullPage: true });
  ordinaryFile(destination);
}

export async function executeCheckpointCase(input: CheckpointExecution): Promise<RouteEvidence> {
  const stages = inspectBinding(input.binding);
  const decision = parseDecision(input, stages);
  ordinaryDirectory(input.evidenceDirectory);
  const marker = path.join(input.evidenceDirectory, 'attempt.json');
  assert.equal(fs.existsSync(marker), false, 'Checkpoint attempt already consumed');
  const runFile = path.join(input.runRoot, input.binding.runId, 'run.json');
  ordinaryFile(runFile);
  assert.equal(sha256(fs.readFileSync(runFile)), input.binding.sourceSha256, 'Prepared case source drift');
  const started = await startLocalService({ runRoot: input.runRoot, port: 0, applicationRevision, clientRoot });
  assert.ok(started.ok, 'Checkpoint service must start');
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let result: RouteEvidence | undefined;
  let callStartedAt = 0;
  let callFinishedAt = 0;
  let contextClosed = false;
  let browserClosed = false;
  let serviceStopped = false;
  const failures: unknown[] = [];
  try {
    const initial = started.service.readRun(input.binding.runId);
    assert.ok(initial.ok && !initial.interrupted);
    same(initial.run, stages.pending, 'Service baseline differs from prepared source');
    browser = await chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 });
    assert.equal(browser.version(), '151.0.7922.34');
    context = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: false, serviceWorkers: 'block' });
    const expectedIntent = { runId: decision.runId, findingId: decision.findingId, review: decision.review };
    result = await installRoutes(context, started.service.url, stages, input.binding.findingId,
      expectedIntent, input.evidenceDirectory);
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(started.service.url);
    await selectFinding(page, stages, input.binding.findingId);
    if (input.probeBlockedRequests) {
      await page.evaluate(async () => {
        await Promise.allSettled([fetch('/unexpected-checkpoint-path'), fetch('https://checkpoint.invalid/upstream')]);
      });
    }
    await fillDecision(page, decision, stages);
    if (input.captureScreenshots) {
      result.captures = {};
      result.captures['desktop-source-and-editor'] = await captureReviewRegion(page,
        input.evidenceDirectory, 'desktop-source-and-editor', '.proposal-review',
        input.characterizationCaptureHeightLimit);
      await page.setViewportSize({ width: 390, height: 844 });
      result.captures['narrow-source-and-editor'] = await captureReviewRegion(page,
        input.evidenceDirectory, 'narrow-source-and-editor', '.proposal-review',
        input.characterizationCaptureHeightLimit);
      await page.setViewportSize({ width: 1366, height: 900 });
    }
    callStartedAt = Date.now();
    fs.writeFileSync(marker, JSON.stringify({ caseId: input.binding.caseId,
      sourceSha256: input.binding.sourceSha256, decisionSha256: input.expectedDecisionSha256 }) + '\n', { flag: 'wx' });
    ordinaryFile(marker);
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    await page.getByRole('heading', { name: /saved review decision/i }).waitFor();
    callFinishedAt = Date.now();
    if (input.captureScreenshots) {
      result.captures!['desktop-final'] = await captureReviewRegion(page,
        input.evidenceDirectory, 'desktop-final', '.review-decision');
      await page.setViewportSize({ width: 390, height: 844 });
      result.captures!['narrow-final'] = await captureReviewRegion(page,
        input.evidenceDirectory, 'narrow-final', '.review-decision');
    }
    assert.equal(result.reviewAttempts, 1);
    assert.equal(result.reviewForwards, 1);
    same(result.staged, { '/api/runs': 1, '/api/finding-guidance': 1, '/api/finding-generation': 1 },
      'Each pre-review stage must be replayed exactly once');
    if (input.probeBlockedRequests) {
      assert.deepEqual(result.rejected.sort(),
        ['GET /unexpected-checkpoint-path', 'https://checkpoint.invalid/upstream'].sort());
    } else assert.deepEqual(result.rejected, []);
    assert.ok(result.request && result.response);
    const admitted = admitReview(result.response, stages.pending, result.request as never);
    assert.ok(admitted?.ok, 'Actual endpoint result must admit');
    const readback = started.service.readRun(input.binding.runId);
    assert.ok(readback.ok && !readback.interrupted);
    same(readback.run, admitted.run, 'Service readback differs from admitted response');
    const disk = parsedComplete(fs.readFileSync(runFile));
    same(disk, admitted.run, 'Disk readback differs from admitted response');
    const selected = disk.scan.findings.find(finding => finding.findingId === input.binding.findingId);
    assert.ok(selected && 'review' in selected);
    const decidedAt = Date.parse(selected.review.decidedAt);
    assert.ok(Number.isFinite(decidedAt) && decidedAt >= callStartedAt && decidedAt <= callFinishedAt,
      'Service decision time must fall within the captured call interval');
    assert.ok('generation' in selected && selected.generation.status === 'completed'
      && decidedAt >= Date.parse(selected.generation.finishedAt));
    fs.writeFileSync(path.join(input.evidenceDirectory, 'case-result.json'), JSON.stringify({
      caseId: input.binding.caseId, sourceSha256: input.binding.sourceSha256,
      reviewedRunSha256: sha256(fs.readFileSync(runFile)), callStartedAt: new Date(callStartedAt).toISOString(),
      callFinishedAt: new Date(callFinishedAt).toISOString(), staged: result.staged,
      reviewAttempts: result.reviewAttempts, reviewForwards: result.reviewForwards,
      ...(result.captures ? { captures: result.captures } : {}),
    }, null, 2) + '\n', { flag: 'wx' });
  } catch (error) {
    failures.push(error);
    try {
      const errorFile = path.join(input.evidenceDirectory, 'error.json');
      if (!fs.existsSync(errorFile)) fs.writeFileSync(errorFile, JSON.stringify({
        caseId: input.binding.caseId, error: error instanceof Error ? error.message : String(error),
      }, null, 2) + '\n', { flag: 'wx' });
    } catch (recordError) { failures.push(recordError); }
  }
  finally {
    if (context) try { await context.close(); contextClosed = true; } catch (error) { failures.push(error); }
    if (browser) try { await browser.close(); browserClosed = true; } catch (error) { failures.push(error); }
    try {
      await stopOwned(started.service);
      serviceStopped = true;
    } catch (error) { failures.push(error); }
    if (contextClosed && browserClosed && serviceStopped) {
      try {
        fs.writeFileSync(path.join(input.evidenceDirectory, 'shutdown.json'), JSON.stringify({
          contextClosed: true, browserClosed: true, serviceStopped: true, portClosed: true,
        }) + '\n', { flag: 'wx' });
      } catch (error) { failures.push(error); }
    }
  }
  if (failures.length === 1) throw failures[0];
  if (failures.length > 1) throw new AggregateError(failures, 'Checkpoint case or cleanup failed');
  return result!;
}

async function inspectActual(): Promise<void> {
  for (const [name, source] of Object.entries(sources)) {
    const binding = { caseId: 'approve' as const, sourceBytes: fs.readFileSync(source.path),
      sourceSha256: source.sha256, runId: source.runId, findingId: source.findingId };
    const stages = inspectBinding(binding);
    console.log(JSON.stringify({ source: name, runId: source.runId, findingId: source.findingId,
      sha256: source.sha256, findings: stages.pending.scan.findings.length, state: 'proposal-pending-review' }));
  }
}

function assertActualSources(): void {
  for (const source of Object.values(sources)) {
    ordinaryFile(source.path);
    assert.equal(sha256(fs.readFileSync(source.path)), source.sha256, `Retained source changed: ${source.path}`);
  }
}

export async function preserveOperationAndIntegrityErrors(
  operation: () => Promise<void>, verifyIntegrity: () => void,
): Promise<void> {
  const errors: unknown[] = [];
  try { verifyIntegrity(); } catch (error) { errors.push(error); }
  if (errors.length === 0) {
    try { await operation(); } catch (error) { errors.push(error); }
  }
  try { verifyIntegrity(); } catch (error) { errors.push(error); }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Checkpoint operation and retained-source integrity failed');
}

async function withActualSourceIntegrity(operation: () => Promise<void>): Promise<void> {
  await preserveOperationAndIntegrityErrors(operation, assertActualSources);
}

function actualBinding(caseId: CheckpointCase): CheckpointBinding {
  const source = sources.groq;
  return { caseId, sourceBytes: fs.readFileSync(source.path), sourceSha256: source.sha256,
    runId: source.runId, findingId: source.findingId };
}

function inspectionPacket(binding: CheckpointBinding): unknown {
  const stages = inspectBinding(binding);
  const selected = selectedPending(stages.pending, binding.findingId);
  assert.ok('result' in selected && selected.result.type === 'proposal'
    && 'retrieval' in selected && selected.retrieval.status === 'completed');
  const { analysis: _analysis, retrieval: _retrieval, generation: _generation, result, ...native } = selected;
  return {
    caseId: binding.caseId,
    source: { sha256: binding.sourceSha256, runId: binding.runId, findingId: binding.findingId,
      interpretation: 'Controlled review branch copied byte-for-byte from retained authentic proposal; no upstream execution.' },
    nativeEvidence: { ...native, state: 'unprocessed' },
    proposal: result,
    authenticatedGuidance: stages.guidance.view,
    guidanceSupport: selected.retrieval.support,
    limitations: {
      uncertainty: result.uncertainty,
      assumptions: result.assumptions,
      blockingManualJudgment: result.blockingManualJudgment,
      postChangeVerificationReminder: result.postChangeVerificationReminder,
      semanticDecision: 'No action or support judgment is supplied by this inspection packet.',
    },
  };
}

function prepareActual(): void {
  assertActualSources();
  ordinaryDirectory(path.dirname(casesRoot));
  fs.mkdirSync(casesRoot, { recursive: false });
  fs.mkdirSync(evidenceRoot, { recursive: false });
  for (const caseId of checkpointCases) {
    const binding = actualBinding(caseId);
    const caseDirectory = path.join(casesRoot, caseId);
    const runRoot = path.join(caseDirectory, 'runs');
    fs.mkdirSync(caseDirectory, { recursive: false });
    prepareIsolatedCase(binding, runRoot);
    const evidenceDirectory = path.join(evidenceRoot, caseId);
    fs.mkdirSync(evidenceDirectory, { recursive: false });
    fs.writeFileSync(path.join(evidenceDirectory, 'source-run.json'), binding.sourceBytes, { flag: 'wx' });
    fs.writeFileSync(path.join(evidenceDirectory, 'inspection.json'),
      JSON.stringify(inspectionPacket(binding), null, 2) + '\n', { flag: 'wx' });
    ordinaryFile(path.join(evidenceDirectory, 'source-run.json'));
    ordinaryFile(path.join(evidenceDirectory, 'inspection.json'));
  }
  ordinaryInventory(casesRoot);
  ordinaryInventory(evidenceRoot);
  assertActualSources();
}

async function observeActualOperation(): Promise<void> {
  const binding = actualBinding('approve');
  const stages = inspectBinding(binding);
  const runRoot = path.join(casesRoot, 'approve/runs');
  assert.equal(sha256(fs.readFileSync(path.join(runRoot, binding.runId, 'run.json'))), binding.sourceSha256);
  const started = await startLocalService({ runRoot, port: 0, applicationRevision, clientRoot });
  assert.ok(started.ok);
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  const failures: unknown[] = [];
  try {
    browser = await chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 });
    context = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: false, serviceWorkers: 'block' });
    const routed = await installRoutes(context, started.service.url, stages, binding.findingId, undefined);
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(started.service.url);
    await selectFinding(page, stages, binding.findingId);
    await capture(page, path.join(evidenceRoot, 'observe'), 'desktop-pending');
    await page.setViewportSize({ width: 390, height: 844 });
    await capture(page, path.join(evidenceRoot, 'observe'), 'narrow-pending');
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.getByRole('radio', { name: 'Edit and accept', exact: true }).check();
    await capture(page, path.join(evidenceRoot, 'observe'), 'desktop-editor');
    await page.setViewportSize({ width: 390, height: 844 });
    await capture(page, path.join(evidenceRoot, 'observe'), 'narrow-editor');
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.getByRole('radio', { name: 'Approve', exact: true }).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    assert.ok(await page.locator('[aria-invalid="true"]').count() > 0);
    await capture(page, path.join(evidenceRoot, 'observe'), 'desktop-error-missing-confirmation');
    await page.getByLabel(/confirm.*material claims/i).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    assert.ok(await page.locator('[aria-invalid="true"]').count() > 0);
    await capture(page, path.join(evidenceRoot, 'observe'), 'desktop-error-unresolved-judgment');
    await page.getByLabel(/blocking judgment/i).selectOption('not-applicable');
    await page.getByLabel(/confirm.*material claims/i).check();
    await page.getByRole('button', { name: 'Save decision', exact: true }).click();
    assert.ok(await page.locator('[aria-invalid="true"]').count() > 0);
    await page.setViewportSize({ width: 390, height: 844 });
    await capture(page, path.join(evidenceRoot, 'observe'), 'narrow-error-blank-not-applicable-reason');
    assert.equal(routed.reviewAttempts, 0);
    assert.equal(routed.reviewForwards, 0);
    const before = fs.readFileSync(path.join(runRoot, binding.runId, 'run.json'));
    assert.equal(sha256(before), binding.sourceSha256);
    await renderSyntheticAbstention(browser, started.service.url, path.join(evidenceRoot, 'observe'));
    fs.writeFileSync(path.join(evidenceRoot, 'observe', 'negative-summary.json'), JSON.stringify({
      blockedAttempts: ['missing-confirmation', 'unresolved-judgment', 'blank-not-applicable-reason'],
      reviewPosts: 0, syntheticAbstention: { reviewAction: false, providerInvocation: false },
    }, null, 2) + '\n', { flag: 'wx' });
  } catch (error) { failures.push(error); }
  finally {
    if (context) try { await context.close(); } catch (error) { failures.push(error); }
    if (browser) try { await browser.close(); } catch (error) { failures.push(error); }
    try { await stopOwned(started.service); } catch (error) { failures.push(error); }
  }
  if (failures.length === 1) throw failures[0];
  if (failures.length > 1) throw new AggregateError(failures, 'Checkpoint observation or cleanup failed');
}

async function observeActual(): Promise<void> {
  await withActualSourceIntegrity(observeActualOperation);
}

function currentBuildIdentity(): Record<string, string> {
  const assets = loadClientResponses(clientRoot);
  const result: Record<string, string> = {};
  for (const [assetPath, response] of Object.entries(assets)) {
    if (assetPath !== '/') result[assetPath] = sha256(response.body);
  }
  return result;
}

async function observeCaptureOperation(): Promise<void> {
  const directory = path.join(evidenceRoot, 'observe-capture');
  ordinaryDirectory(evidenceRoot);
  fs.mkdirSync(directory, { recursive: false });
  const binding = actualBinding('approve');
  const stages = inspectBinding(binding);
  const runRoot = path.join(casesRoot, 'approve/runs');
  const runFile = path.join(runRoot, binding.runId, 'run.json');
  ordinaryFile(runFile);
  const copyHashBefore = sha256(fs.readFileSync(runFile));
  assert.equal(copyHashBefore, binding.sourceSha256, 'Observe-capture branch is not untouched');
  const started = await startLocalService({ runRoot, port: 0, applicationRevision, clientRoot });
  assert.ok(started.ok);
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let routed: RouteEvidence | undefined;
  let browserVersion = '';
  const regions: Record<string, ReviewCaptureRegion> = {};
  let contextClosed = false;
  let browserClosed = false;
  let serviceStopped = false;
  const errors: unknown[] = [];
  try {
    browser = await chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 });
    browserVersion = browser.version();
    assert.equal(browserVersion, '151.0.7922.34');
    context = await browser.newContext({ viewport: { width: 1366, height: 900 },
      acceptDownloads: false, serviceWorkers: 'block' });
    routed = await installRoutes(context, started.service.url, stages, binding.findingId, undefined);
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(started.service.url);
    await selectFinding(page, stages, binding.findingId);
    await page.getByRole('radio', { name: 'Edit and accept', exact: true }).check();
    regions['desktop-source-and-editor'] = await captureReviewRegion(page, directory,
      'desktop-source-and-editor', '.proposal-review');
    await page.setViewportSize({ width: 390, height: 844 });
    regions['narrow-source-and-editor'] = await captureReviewRegion(page, directory,
      'narrow-source-and-editor', '.proposal-review');
    same(routed.staged, { '/api/runs': 1, '/api/finding-guidance': 1, '/api/finding-generation': 1 },
      'Capture observation must replay each stage once');
    assert.equal(routed.reviewAttempts, 0);
    assert.equal(routed.reviewForwards, 0);
    assert.deepEqual(routed.rejected, []);
    assert.equal(sha256(fs.readFileSync(runFile)), copyHashBefore, 'Capture observation changed its branch');
  } catch (error) { errors.push(error); }
  finally {
    if (context) try { await context.close(); contextClosed = true; } catch (error) { errors.push(error); }
    if (browser) try { await browser.close(); browserClosed = true; } catch (error) { errors.push(error); }
    try { await stopOwned(started.service); serviceStopped = true; } catch (error) { errors.push(error); }
  }
  if (errors.length === 0 && routed && contextClosed && browserClosed && serviceStopped) {
    try {
      fs.writeFileSync(path.join(directory, 'capture-summary.json'), JSON.stringify({
        source: { runId: binding.runId, findingId: binding.findingId, sha256: binding.sourceSha256 },
        build: currentBuildIdentity(), browser: { version: browserVersion },
        viewports: { desktop: { width: 1366, height: 900 }, narrow: { width: 390, height: 844 } },
        regions, staged: routed.staged, reviewAttempts: routed.reviewAttempts,
        reviewForwards: routed.reviewForwards, rejectedRequests: routed.rejected,
        copySha256Before: copyHashBefore, copySha256After: sha256(fs.readFileSync(runFile)),
        teardown: { contextClosed: true, browserClosed: true, serviceStopped: true, portClosed: true },
      }, null, 2) + '\n', { flag: 'wx' });
      ordinaryInventory(directory);
      assert.deepEqual(fs.readdirSync(directory).sort(),
        ['capture-summary.json', 'desktop-source-and-editor.png', 'narrow-source-and-editor.png']);
    } catch (error) { errors.push(error); }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Capture observation or owned teardown failed');
}

async function observeCaptureActual(): Promise<void> {
  await withActualSourceIntegrity(observeCaptureOperation);
}

async function runActualCase(caseId: CheckpointCase, decisionFile: string, expectedHash: string): Promise<void> {
  await withActualSourceIntegrity(async () => {
    const expectedDecisionFile = path.join(evidenceRoot, caseId, 'decision-input.json');
    assert.equal(path.resolve(decisionFile).toLowerCase(), expectedDecisionFile.toLowerCase(), 'Decision path mismatch');
    ordinaryFile(expectedDecisionFile);
    await executeCheckpointCase({ binding: actualBinding(caseId), runRoot: path.join(casesRoot, caseId, 'runs'),
      evidenceDirectory: path.join(evidenceRoot, caseId), decisionBytes: fs.readFileSync(expectedDecisionFile),
      expectedDecisionSha256: expectedHash.toLowerCase(), captureScreenshots: caseId === 'edit-and-accept' });
  });
}

async function readbackActual(caseId: CheckpointCase): Promise<void> {
  await withActualSourceIntegrity(async () => {
    const binding = actualBinding(caseId);
    const runRoot = path.join(casesRoot, caseId, 'runs');
    const caseEvidence = path.join(evidenceRoot, caseId);
    for (const name of ['decision-input.json', 'attempt.json', 'request.json']) ordinaryFile(path.join(caseEvidence, name));
    const started = await startLocalService({ runRoot, port: 0, applicationRevision, clientRoot });
    assert.ok(started.ok);
    try {
      const readback = started.service.readRun(binding.runId);
      assert.ok(readback.ok && !readback.interrupted);
      const validatedReadback = validateRun(readback.run);
      assert.ok(validatedReadback.ok && validatedReadback.value.status === 'completed');
      const reviewed = validatedReadback.value;
      const diskBytes = fs.readFileSync(path.join(runRoot, binding.runId, 'run.json'));
      const authenticated = authenticateRecoveredCase({ binding,
        decisionBytes: fs.readFileSync(path.join(caseEvidence, 'decision-input.json')),
        expectedDecisionSha256: sha256(fs.readFileSync(path.join(caseEvidence, 'decision-input.json'))),
        attemptBytes: fs.readFileSync(path.join(caseEvidence, 'attempt.json')),
        requestBytes: fs.readFileSync(path.join(caseEvidence, 'request.json')),
        reviewedRunBytes: diskBytes });
      same(reviewed, authenticated, 'Restart readback differs from authenticated disk');
      fs.writeFileSync(path.join(evidenceRoot, caseId, 'readback.json'), JSON.stringify(reviewed, null, 2) + '\n', { flag: 'wx' });
    } finally { await stopOwned(started.service); }
    fs.writeFileSync(path.join(evidenceRoot, caseId, 'readback-shutdown.json'),
      JSON.stringify({ serviceStopped: true, portClosed: true }) + '\n', { flag: 'wx' });
  });
}

export function cleanupCompletedCase(input: CheckpointCleanup): void {
  const required = ['attempt.json', 'case-result.json', 'decision-input.json', 'inspection.json',
    'readback-shutdown.json', 'readback.json', 'request.json', 'response.json', 'shutdown.json', 'source-run.json'];
  const screenshots = input.captureScreenshots
    ? ['desktop-final.png', 'desktop-source-and-editor.png', 'narrow-final.png', 'narrow-source-and-editor.png'] : [];
  const expected = [...required, ...screenshots].sort();
  ordinaryInventory(input.evidenceDirectory);
  assert.deepEqual(fs.readdirSync(input.evidenceDirectory).sort(), expected, 'Completed case evidence inventory mismatch');
  for (const name of expected) ordinaryFile(path.join(input.evidenceDirectory, name));
  assert.equal(sha256(fs.readFileSync(path.join(input.evidenceDirectory, 'source-run.json'))), input.binding.sourceSha256);
  const shutdown = JSON.parse(fs.readFileSync(path.join(input.evidenceDirectory, 'shutdown.json'), 'utf8'));
  const readbackShutdown = JSON.parse(fs.readFileSync(path.join(input.evidenceDirectory, 'readback-shutdown.json'), 'utf8'));
  same(shutdown, { contextClosed: true, browserClosed: true, serviceStopped: true, portClosed: true },
    'Case teardown proof incomplete');
  same(readbackShutdown, { serviceStopped: true, portClosed: true }, 'Readback teardown proof incomplete');
  const runFile = path.join(input.caseDirectory, 'runs', input.binding.runId, 'run.json');
  ordinaryInventory(input.caseDirectory);
  ordinaryFile(runFile);
  assert.deepEqual(fs.readdirSync(input.caseDirectory), ['runs']);
  assert.deepEqual(fs.readdirSync(path.join(input.caseDirectory, 'runs')), [input.binding.runId]);
  assert.deepEqual(fs.readdirSync(path.dirname(runFile)), ['run.json']);
  const diskBytes = fs.readFileSync(runFile);
  const marker = exactObject(JSON.parse(fs.readFileSync(path.join(input.evidenceDirectory, 'attempt.json'), 'utf8')),
    ['caseId', 'sourceSha256', 'decisionSha256']);
  const decisionSha256 = marker.decisionSha256;
  assert.ok(typeof decisionSha256 === 'string');
  const recovered = authenticateRecoveredCase({ binding: input.binding,
    decisionBytes: fs.readFileSync(path.join(input.evidenceDirectory, 'decision-input.json')),
    expectedDecisionSha256: decisionSha256,
    attemptBytes: fs.readFileSync(path.join(input.evidenceDirectory, 'attempt.json')),
    requestBytes: fs.readFileSync(path.join(input.evidenceDirectory, 'request.json')),
    reviewedRunBytes: diskBytes });
  const retainedReadback = parsedComplete(fs.readFileSync(path.join(input.evidenceDirectory, 'readback.json')));
  same(retainedReadback, recovered, 'Retained readback differs from current disk');
  const caseResult = exactObject(JSON.parse(fs.readFileSync(path.join(input.evidenceDirectory, 'case-result.json'), 'utf8')),
    ['caseId', 'sourceSha256', 'reviewedRunSha256', 'callStartedAt', 'callFinishedAt', 'staged',
      'reviewAttempts', 'reviewForwards', ...(input.captureScreenshots ? ['captures'] : [])]);
  assert.equal(caseResult.caseId, input.binding.caseId);
  assert.equal(caseResult.sourceSha256, input.binding.sourceSha256);
  assert.equal(caseResult.reviewedRunSha256, sha256(diskBytes), 'Current disk differs from completed case evidence');
  assert.equal(caseResult.reviewAttempts, 1);
  assert.equal(caseResult.reviewForwards, 1);
  const request = JSON.parse(fs.readFileSync(path.join(input.evidenceDirectory, 'request.json'), 'utf8'));
  const response = JSON.parse(fs.readFileSync(path.join(input.evidenceDirectory, 'response.json'), 'utf8'));
  const admitted = admitReview(response, parsedComplete(input.binding.sourceBytes), request);
  assert.ok(admitted?.ok);
  same(admitted.run, recovered, 'Retained response differs from authenticated current disk');
  fs.rmSync(input.caseDirectory, { recursive: true, force: false });
  assert.equal(fs.existsSync(input.caseDirectory), false);
}

function cleanupActual(): void {
  assertActualSources();
  ordinaryInventory(casesRoot);
  ordinaryInventory(evidenceRoot);
  for (const caseId of checkpointCases) {
    const evidence = path.join(evidenceRoot, caseId);
    const required = ['attempt.json', 'case-result.json', 'decision-input.json', 'inspection.json',
      'readback-shutdown.json', 'readback.json', 'request.json', 'response.json', 'shutdown.json', 'source-run.json'];
    if (!fs.existsSync(evidence) || !required.every(name => fs.existsSync(path.join(evidence, name)))) continue;
    const directory = path.join(casesRoot, caseId);
    cleanupCompletedCase({ binding: actualBinding(caseId), caseDirectory: directory,
      evidenceDirectory: evidence, captureScreenshots: caseId === 'edit-and-accept' });
  }
  if (fs.readdirSync(casesRoot).length === 0) fs.rmdirSync(casesRoot);
  assertActualSources();
}

function readCase(value: string | undefined): CheckpointCase {
  assert.ok(value && checkpointCases.includes(value as CheckpointCase), 'Expected fixed checkpoint case');
  return value as CheckpointCase;
}

async function main(argv: readonly string[]): Promise<void> {
  const mode = argv[0];
  if (mode === '--inspect' && argv.length === 1) return inspectActual();
  if (mode === '--prepare' && argv.length === 1) { prepareActual(); return; }
  if (mode === '--observe' && argv.length === 1) return observeActual();
  if (mode === '--observe-capture' && argv.length === 1) return observeCaptureActual();
  if (mode === '--cleanup' && argv.length === 1) { cleanupActual(); return; }
  if (mode === '--readback' && argv.length === 2) return readbackActual(readCase(argv[1]));
  if (mode === '--case') {
    const caseId = readCase(argv[1]);
    assert.deepEqual([argv[2], argv[4]], ['--decision-file', '--decision-sha256']);
    assert.ok(argv[3] && argv[5] && argv.length === 6);
    return runActualCase(caseId, argv[3], argv[5]);
  }
  throw new Error('Usage: --inspect | --prepare | --observe | --observe-capture | --case <case> --decision-file <path> --decision-sha256 <sha256> | --readback <case> | --cleanup');
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invoked) await main(process.argv.slice(2));
