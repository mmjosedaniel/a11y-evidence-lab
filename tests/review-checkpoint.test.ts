import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { assessFindingEvidence } from '../src/server/domain/finding-sufficiency.ts';
import { validateRun } from '../src/server/domain/run-contract.ts';
import { reviewInput } from './helpers/m401-review-fixture.ts';
import { withReviewSandbox } from './helpers/m401-review-sandbox.ts';
import { reviewProfileStages } from './helpers/m402-review-fixture.ts';
import {
  authenticateRecoveredCase,
  cleanupCompletedCase,
  executeCheckpointCase,
  inspectBinding,
  preserveOperationAndIntegrityErrors,
  prepareIsolatedCase,
  validateReviewCaptureRegion,
  type CheckpointBinding,
} from './helpers/m403-review-checkpoint.ts';

const sha256 = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex');

function syntheticBinding(root: string, action: 'approve' | 'edit-and-accept' = 'approve') {
  const stages = reviewProfileStages('color-contrast', 'm403-synthetic', 'groq');
  const sourceBytes = Buffer.from(JSON.stringify(stages.pending));
  const binding: CheckpointBinding = {
    caseId: action, sourceBytes, sourceSha256: sha256(sourceBytes),
    runId: stages.pending.runId, findingId: 'finding-0',
  };
  const review = reviewInput(action, 'color-contrast');
  if (action === 'edit-and-accept') {
    const selected = stages.pending.scan.findings.find(finding => finding.findingId === binding.findingId)!;
    assert.ok(selected.state === 'proposal-pending-review' && 'retrieval' in selected && selected.retrieval.status === 'completed');
    const { analysis: _analysis, retrieval, generation: _generation, result: _result, ...native } = selected;
    const references = [...assessFindingEvidence({ ...native, state: 'unprocessed' }).availableReferences];
    assert.ok(review.editedProposal && references.length >= 2 && retrieval.result.passages.length >= 2);
    review.editedProposal.assumptions = ['First reviewer assumption', 'Second reviewer assumption'];
    review.editedProposal.findingSummary.evidenceReferences = references.slice(0, 2).reverse();
    review.editedProposal.userImpact.passageIds = retrieval.result.passages.map(item => item.passageId).reverse();
  }
  const decision = Buffer.from(JSON.stringify({ caseId: binding.caseId, sourceSha256: binding.sourceSha256,
    runId: binding.runId, findingId: binding.findingId, review }));
  const caseDirectory = path.join(root, 'case');
  const runs = path.join(caseDirectory, 'runs');
  const evidence = path.join(root, 'evidence');
  return { binding, decision, evidence, runs, caseDirectory };
}

function createCaseDirectory(caseDirectory: string): void {
  fs.mkdirSync(caseDirectory, { recursive: false });
}

function recoveryEvidence(fixture: ReturnType<typeof syntheticBinding>, decisionBytes = fixture.decision) {
  const decision = JSON.parse(decisionBytes.toString('utf8'));
  const decisionSha256 = sha256(decisionBytes);
  return {
    binding: fixture.binding, decisionBytes, expectedDecisionSha256: decisionSha256,
    attemptBytes: Buffer.from(JSON.stringify({ caseId: fixture.binding.caseId,
      sourceSha256: fixture.binding.sourceSha256, decisionSha256 }) + '\n'),
    requestBytes: Buffer.from(JSON.stringify({ runId: decision.runId,
      findingId: decision.findingId, review: decision.review }, null, 2) + '\n'),
    reviewedRunBytes: fs.readFileSync(path.join(fixture.runs, fixture.binding.runId, 'run.json')),
  };
}

function completeCleanupEvidence(fixture: ReturnType<typeof syntheticBinding>): void {
  const disk = fs.readFileSync(path.join(fixture.runs, fixture.binding.runId, 'run.json'));
  fs.writeFileSync(path.join(fixture.evidence, 'decision-input.json'), fixture.decision, { flag: 'wx' });
  fs.writeFileSync(path.join(fixture.evidence, 'source-run.json'), fixture.binding.sourceBytes, { flag: 'wx' });
  fs.writeFileSync(path.join(fixture.evidence, 'inspection.json'), '{}\n', { flag: 'wx' });
  fs.writeFileSync(path.join(fixture.evidence, 'readback.json'), JSON.stringify(JSON.parse(disk.toString('utf8')), null, 2) + '\n', { flag: 'wx' });
  fs.writeFileSync(path.join(fixture.evidence, 'readback-shutdown.json'),
    JSON.stringify({ serviceStopped: true, portClosed: true }) + '\n', { flag: 'wx' });
}

function pngDimensions(file: string): { width: number; height: number } {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test('checkpoint import is inert and source/hash/payload mismatches refuse before dispatch or mutation', { concurrency: false }, async () => {
  await withReviewSandbox('service', async sandbox => {
    const fixture = syntheticBinding(sandbox.root);
    const before = new Set(fs.readdirSync(sandbox.root));
    inspectBinding(fixture.binding);
    assert.deepEqual(new Set(fs.readdirSync(sandbox.root)), before, 'Inspection must be inert');
    assert.throws(() => inspectBinding({ ...fixture.binding, sourceSha256: '0'.repeat(64) }), /hash mismatch/);
    createCaseDirectory(fixture.caseDirectory);
    prepareIsolatedCase(fixture.binding, fixture.runs);
    assert.throws(() => prepareIsolatedCase(fixture.binding, fixture.runs));
    fs.mkdirSync(fixture.evidence, { recursive: false });
    const runFile = path.join(fixture.runs, fixture.binding.runId, 'run.json');
    const sourceBefore = fs.readFileSync(runFile);
    await assert.rejects(executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
      evidenceDirectory: fixture.evidence, decisionBytes: fixture.decision,
      expectedDecisionSha256: '0'.repeat(64) }), /Decision file hash mismatch/);
    const wrong = JSON.parse(fixture.decision.toString('utf8'));
    const { supportConfirmed: _supportConfirmed, ...reject } = wrong.review;
    wrong.review = { ...reject, action: 'reject' };
    const wrongDecision = Buffer.from(JSON.stringify(wrong));
    await assert.rejects(executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
      evidenceDirectory: fixture.evidence, decisionBytes: wrongDecision,
      expectedDecisionSha256: sha256(wrongDecision) }), /Decision action\/body mismatch/);
    assert.deepEqual(fs.readFileSync(runFile), sourceBefore);
    assert.equal(fs.existsSync(path.join(fixture.evidence, 'attempt.json')), false);
    assert.equal(fs.existsSync(path.join(fixture.evidence, 'request.json')), false);
  });
});

test('checkpoint sends one exact review, admits service/disk truth, preserves siblings, and refuses a consumed attempt',
  { concurrency: false, timeout: 120000 }, async () => {
    await withReviewSandbox('service', async sandbox => {
      const fixture = syntheticBinding(sandbox.root);
      createCaseDirectory(fixture.caseDirectory);
      prepareIsolatedCase(fixture.binding, fixture.runs);
      fs.mkdirSync(fixture.evidence, { recursive: false });
      const original = validateRun(JSON.parse(fixture.binding.sourceBytes.toString('utf8')));
      assert.ok(original.ok && original.value.status === 'completed');
      const result = await executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
        evidenceDirectory: fixture.evidence, decisionBytes: fixture.decision,
        expectedDecisionSha256: sha256(fixture.decision), probeBlockedRequests: true });
      assert.equal(result.reviewAttempts, 1);
      assert.equal(result.reviewForwards, 1);
      assert.deepEqual(result.rejected.sort(),
        ['GET /unexpected-checkpoint-path', 'https://checkpoint.invalid/upstream'].sort());
      const disk = validateRun(JSON.parse(fs.readFileSync(path.join(fixture.runs,
        fixture.binding.runId, 'run.json'), 'utf8')));
      assert.ok(disk.ok && disk.value.status === 'completed');
      const selected = disk.value.scan.findings.find(finding => finding.findingId === fixture.binding.findingId);
      assert.ok(selected?.state === 'accepted' && 'review' in selected);
      assert.deepEqual(disk.value.scan.findings.filter(finding => finding.findingId !== fixture.binding.findingId),
        original.value.scan.findings.filter(finding => finding.findingId !== fixture.binding.findingId));
      await assert.rejects(executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
        evidenceDirectory: fixture.evidence, decisionBytes: fixture.decision,
        expectedDecisionSha256: sha256(fixture.decision) }), /attempt already consumed/);
      assert.equal(result.reviewForwards, 1);
    });
  });

test('checkpoint transcribes changed assumption count and ordered references, then authenticates exact recovery',
  { concurrency: false, timeout: 120000 }, async () => {
    await withReviewSandbox('service', async sandbox => {
      const fixture = syntheticBinding(sandbox.root, 'edit-and-accept');
      createCaseDirectory(fixture.caseDirectory);
      prepareIsolatedCase(fixture.binding, fixture.runs);
      fs.mkdirSync(fixture.evidence, { recursive: false });
      const expected = JSON.parse(fixture.decision.toString('utf8'));
      const result = await executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
        evidenceDirectory: fixture.evidence, decisionBytes: fixture.decision,
        expectedDecisionSha256: sha256(fixture.decision), captureScreenshots: true });
      assert.deepEqual(result.request, { runId: expected.runId, findingId: expected.findingId, review: expected.review });
      assert.deepEqual(Object.keys(result.captures ?? {}).sort(),
        ['desktop-final', 'desktop-source-and-editor', 'narrow-final', 'narrow-source-and-editor']);
      for (const [name, region] of Object.entries(result.captures ?? {})) {
        assert.ok(region.height > 0 && region.height <= 12000);
        assert.equal(region.width, name.startsWith('desktop') ? 1366 : 390);
        assert.deepEqual(pngDimensions(path.join(fixture.evidence, `${name}.png`)),
          { width: region.width, height: region.height });
      }
      const recovered = authenticateRecoveredCase(recoveryEvidence(fixture));
      assert.equal(recovered.scan.findings.find(finding => finding.findingId === fixture.binding.findingId)?.state,
        'edited-and-accepted');

      const variants = [
        (value: any) => { value.review.note = 'Changed recovery note'; },
        (value: any) => { value.review.blockingJudgment = { status: 'not-applicable', reason: 'Changed recovery judgment.' }; },
        (value: any) => { value.review.editedProposal.findingSummary.text = 'Changed recovered edit.'; },
      ];
      for (const change of variants) {
        const altered = structuredClone(expected);
        change(altered);
        const alteredBytes = Buffer.from(JSON.stringify(altered));
        assert.throws(() => authenticateRecoveredCase(recoveryEvidence(fixture, alteredBytes)),
          /Recovered decision differs from authorized decision/);
      }
    });
  });

test('checkpoint cleanup refuses changed disk or uncertain teardown, preserves evidence, then removes only a complete case',
  { concurrency: false, timeout: 120000 }, async () => {
    await withReviewSandbox('service', async sandbox => {
      const fixture = syntheticBinding(sandbox.root);
      createCaseDirectory(fixture.caseDirectory);
      prepareIsolatedCase(fixture.binding, fixture.runs);
      fs.mkdirSync(fixture.evidence, { recursive: false });
      await executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
        evidenceDirectory: fixture.evidence, decisionBytes: fixture.decision,
        expectedDecisionSha256: sha256(fixture.decision) });
      completeCleanupEvidence(fixture);
      const runFile = path.join(fixture.runs, fixture.binding.runId, 'run.json');
      const reviewedBytes = fs.readFileSync(runFile);
      const changed = JSON.parse(reviewedBytes.toString('utf8'));
      changed.requestedUrl = 'https://changed.invalid/';
      fs.writeFileSync(runFile, JSON.stringify(changed));
      assert.throws(() => cleanupCompletedCase({ binding: fixture.binding,
        caseDirectory: fixture.caseDirectory, evidenceDirectory: fixture.evidence }));
      assert.equal(fs.existsSync(fixture.caseDirectory), true);
      fs.writeFileSync(runFile, reviewedBytes);
      const shutdownFile = path.join(fixture.evidence, 'shutdown.json');
      const completeShutdown = fs.readFileSync(shutdownFile);
      fs.writeFileSync(shutdownFile, JSON.stringify({ serviceStopped: true, portClosed: true }) + '\n');
      assert.throws(() => cleanupCompletedCase({ binding: fixture.binding,
        caseDirectory: fixture.caseDirectory, evidenceDirectory: fixture.evidence }), /teardown proof incomplete/);
      assert.equal(fs.existsSync(fixture.caseDirectory), true);
      fs.writeFileSync(shutdownFile, completeShutdown);
      cleanupCompletedCase({ binding: fixture.binding,
        caseDirectory: fixture.caseDirectory, evidenceDirectory: fixture.evidence });
      assert.equal(fs.existsSync(fixture.caseDirectory), false);
      assert.equal(fs.existsSync(fixture.evidence), true);
    });
  });

test('checkpoint preserves an operation failure together with a later source-integrity failure', async () => {
  let checks = 0;
  await assert.rejects(preserveOperationAndIntegrityErrors(async () => {
    throw new Error('PRIMARY_OPERATION_FAILURE');
  }, () => {
    checks++;
    if (checks === 2) throw new Error('SOURCE_INTEGRITY_FAILURE');
  }), error => error instanceof AggregateError
    && error.errors.some(item => item instanceof Error && item.message === 'PRIMARY_OPERATION_FAILURE')
    && error.errors.some(item => item instanceof Error && item.message === 'SOURCE_INTEGRITY_FAILURE'));
});

test('checkpoint rejects invalid or oversized capture bounds before an attempt marker or review POST',
  { concurrency: false, timeout: 120000 }, async () => {
    assert.throws(() => validateReviewCaptureRegion({ x: 0, y: 0, width: 390, height: 0 }, 390, 100));
    assert.throws(() => validateReviewCaptureRegion({ x: 0, y: 0, width: 390, height: 12001 }, 390, 12001));
    await withReviewSandbox('service', async sandbox => {
      const fixture = syntheticBinding(sandbox.root, 'edit-and-accept');
      createCaseDirectory(fixture.caseDirectory);
      prepareIsolatedCase(fixture.binding, fixture.runs);
      fs.mkdirSync(fixture.evidence, { recursive: false });
      await assert.rejects(executeCheckpointCase({ binding: fixture.binding, runRoot: fixture.runs,
        evidenceDirectory: fixture.evidence, decisionBytes: fixture.decision,
        expectedDecisionSha256: sha256(fixture.decision), captureScreenshots: true,
        characterizationCaptureHeightLimit: 1 }));
      assert.equal(fs.existsSync(path.join(fixture.evidence, 'attempt.json')), false);
      assert.equal(fs.existsSync(path.join(fixture.evidence, 'request.json')), false);
      assert.deepEqual(fs.readFileSync(path.join(fixture.runs, fixture.binding.runId, 'run.json')),
        fixture.binding.sourceBytes);
    });
  });
