import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Locator, Page } from 'playwright';
import { startHarness, valid, type Harness } from './helpers/m104-ui-harness.ts';
import {
  reviewProfileStages,
  reviewedProfileRun,
} from './helpers/m402-review-fixture.ts';
import { reviewInput, type ReviewAction } from './helpers/m401-review-fixture.ts';
import type { GenerationMode, GenerationProfile, MutableProposalCandidate } from './helpers/m302-generation-fixture.ts';
import { failedGenerationRun, generationInvocation } from './helpers/m302-generation-fixture.ts';
import { assessedMissingRetrievalRun } from './helpers/m202-retrieval-service-fixture.ts';
import { runBuiltReviewCase } from './helpers/m402-review-browser.ts';

let harness: Harness;
let page: Page;

const results = () => page.getByRole('region', { name: 'Findings', exact: true });
const status = () => page.locator('[role="status"]');
const save = () => page.getByRole('button', { name: 'Save decision', exact: true });
const action = (name: 'Approve' | 'Edit and accept' | 'Reject') => page.getByRole('radio', { name, exact: true });
const judgment = () => page.getByRole('combobox', { name: /blocking.*judgment/i });
const support = () => page.getByLabel(/confirm.*material claims/i);
const reviewCalls = () => page.evaluate(() => window.m104.calls.filter(call => call.stage === 'review').length);

function findingLabel(profile: GenerationProfile): RegExp {
  return profile === 'image-alt' ? /Image alternative issue 1/i
    : profile === 'label' ? /Form label issue 1/i : /Color contrast issue 1/i;
}

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
}

async function openReview(profile: GenerationProfile = 'image-alt', mode: GenerationMode = 'local',
  runId = `review-${profile}-${mode}`, reviewAccessor = false,
  providedStages?: ReturnType<typeof reviewProfileStages>): Promise<ReturnType<typeof reviewProfileStages>> {
  const stages = providedStages ?? reviewProfileStages(profile, runId, mode);
  await page.evaluate(({ stages, mode, reviewAccessor }) => {
    window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(stages.scan) });
    window.m104.guidance = () => Promise.resolve(structuredClone(stages.guidance));
    window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(stages.pending) });
    window.m104.review = () => Promise.resolve({ status: 400,
      body: { ok: false, error: 'invalid-request', run: structuredClone(stages.pending), persisted: false, cleanupFailed: false } });
    window.m104.mount(true, { localModelInstalled: true, groqApiUrlConfigured: true }, true, true, false, true, reviewAccessor);
    window.m104.raw = mode;
  }, { stages, mode, reviewAccessor });
  await page.getByLabel('Target URL').fill(stages.scan.requestedUrl);
  await page.getByRole('radio', { name: mode === 'local' ? /Local/ : /Groq/ }).check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  await results().getByRole('button', { name: findingLabel(profile) }).click();
  await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
  await page.getByRole('button', { name: 'Generate', exact: true }).click();
  await page.getByText('This is the original model-generated proposal. Human review is still required.', { exact: true }).waitFor();
  return stages;
}

async function configureReview(value: unknown | 'hold', accessor = false): Promise<void> {
  await page.evaluate(({ value, accessor }) => {
    window.m104.review = value === 'hold'
      ? () => window.m104.hold('review-late')
      : () => Promise.resolve(structuredClone(value));
    window.m104.rerender(true, { localModelInstalled: true, groqApiUrlConfigured: true },
      true, true, false, true, accessor);
  }, { value, accessor });
  await paint();
}

async function chooseAccepting(name: 'Approve' | 'Edit and accept'): Promise<void> {
  await action(name).check();
  await judgment().selectOption('supports-proposal');
  await support().check();
}

async function assertAccessibleViewports(): Promise<void> {
  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport); await paint();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
  }
}

describe('M4-02 accessible individual proposal review', { concurrency: false }, () => {
  before(async () => { harness = await startHarness(); page = harness.page; });
  after(async () => { if (harness) await harness.close(); });
  beforeEach(async () => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.evaluate(async () => {
      await window.m104.settle();
      window.m104.restore();
      window.m104.timerDelay = null;
      window.m104.reviewReads = 0;
      window.m104.canary = 0;
      window.m104.raw = null;
      window.m104.reviewAccessor = callback => callback;
      window.m104.generationAccessor = callback => callback;
    });
  });

  it('uses native controls and enforces action, support, judgment, reason, note and complete-edit gates', async () => {
    await openReview();
    assert.deepEqual(await Promise.all(['Approve', 'Edit and accept', 'Reject'].map(name =>
      action(name as 'Approve' | 'Edit and accept' | 'Reject').isChecked())), [false, false, false]);
    await save().click();
    assert.match(await page.locator('main').innerText(), /choose.*action/i);
    assert.equal(await reviewCalls(), 0);

    await action('Approve').check();
    await save().click();
    assert.match(await page.locator('main').innerText(), /confirm.*material claims/i);
    await support().check();
    await save().click();
    assert.match(await page.locator('main').innerText(), /blocking.*judgment.*unresolved|resolve.*judgment/i);
    await judgment().selectOption('not-applicable');
    const reason = page.getByLabel(/not applicable.*reason/i);
    assert.equal(await reason.getAttribute('maxlength'), '500');
    await save().click();
    assert.equal(await reason.getAttribute('aria-invalid'), 'true');
    await reason.fill('  The controlled judgment does not apply to this proposal.  ');
    const note = page.getByLabel(/reviewer note/i);
    assert.equal(await note.getAttribute('maxlength'), '1000');

    await action('Edit and accept').check();
    assert.equal(await support().isChecked(), false, 'Changing action must reset support confirmation');
    const summary = page.getByLabel('Finding summary', { exact: true });
    assert.equal(await summary.getAttribute('maxlength'), '1000');
    await summary.fill('');
    await save().click();
    assert.equal(await summary.getAttribute('aria-invalid'), 'true');
    assert.equal(await support().isChecked(), false, 'Editing relevant content must reset support confirmation');
    assert.equal(await reviewCalls(), 0);
    const editor = page.getByRole('group', { name: /reviewer-authored proposal/i });
    for (const label of ['Finding summary', 'User impact', 'Remediation proposal', 'Confidence', 'Uncertainty',
      'Blocking manual judgment', 'Post-change verification reminder']) assert.equal(await editor.getByLabel(label, { exact: true }).count(), 1);
    assert.ok((await summary.getAttribute('aria-describedby'))?.length);
    assert.ok(await summary.evaluate(node => node === document.activeElement));
    const editorText = await editor.innerText();
    assert.ok(editorText.includes('proposal') && editorText.includes('finding-0'));
    assert.ok(editorText.includes('complete') && editorText.includes('supported'));
    assert.equal(await editor.getByLabel('User impact', { exact: true }).getAttribute('maxlength'), '1000');
    assert.equal(await editor.getByLabel('Remediation proposal', { exact: true }).getAttribute('maxlength'), '2000');
    for (const label of ['Uncertainty', 'Blocking manual judgment', 'Post-change verification reminder'])
      assert.equal(await editor.getByLabel(label, { exact: true }).getAttribute('maxlength'), '1000');
    const referenceInputs = editor.getByRole('checkbox');
    assert.ok(await referenceInputs.count() >= 3, 'Complete editor must expose evidence and passage reference controls');
    for (let index = 1; index <= 5; index++)
      assert.equal(await editor.getByLabel(new RegExp(`assumption ${index}`, 'i')).getAttribute('maxlength'), '500');

    const requiredReferences = editor.getByRole('group', { name: /finding summary.*evidence references/i }).getByRole('checkbox');
    const initiallyCheckedReferences = await requiredReferences.evaluateAll(inputs => inputs
      .filter(input => (input as HTMLInputElement).checked).map(input => (input as HTMLInputElement).value));
    assert.ok(initiallyCheckedReferences.length > 0);
    await summary.fill('Reviewer-authored bounded summary.');
    for (const input of await requiredReferences.all()) if (await input.isChecked()) await input.uncheck();
    await save().click();
    const firstRequiredReference = requiredReferences.first();
    assert.equal(await firstRequiredReference.getAttribute('aria-invalid'), 'true');
    assert.ok((await firstRequiredReference.getAttribute('aria-describedby'))?.length);
    assert.ok(await firstRequiredReference.evaluate(node => node === document.activeElement));
    for (const input of await requiredReferences.all())
      if (initiallyCheckedReferences.includes(await input.getAttribute('value') ?? '')) await input.check();

    await editor.getByLabel('Remediation proposal', { exact: true }).fill('This certification claims compliance.');
    await judgment().selectOption('supports-proposal');
    await support().check();
    await save().click();
    assert.equal(await reviewCalls(), 0);
    assert.equal(await editor.getByText(/content or reference rules must be corrected/i).count(), 1);
    assert.ok(await editor.evaluate(node => node === document.activeElement));

    const resetCases: Array<readonly [string, () => Promise<void>]> = [
      ['summary', () => summary.fill('A different bounded summary.')],
      ['impact', () => editor.getByLabel('User impact', { exact: true }).fill('A different bounded impact.')],
      ['remediation', () => editor.getByLabel('Remediation proposal', { exact: true }).fill('A bounded remediation.')],
      ['confidence', async () => { await editor.getByLabel('Confidence', { exact: true }).selectOption('low'); }],
      ['uncertainty', () => editor.getByLabel('Uncertainty', { exact: true }).fill('A different uncertainty.')],
      ['manual judgment', () => editor.getByLabel('Blocking manual judgment', { exact: true }).fill('A different manual judgment.')],
      ['reminder', () => editor.getByLabel('Post-change verification reminder', { exact: true }).fill('A different reminder.')],
      ['assumption', () => editor.getByLabel(/assumption 1/i).fill('A different bounded assumption.')],
      ['reference', async () => { await referenceInputs.first().click(); }],
      ['judgment', async () => { await judgment().selectOption('not-applicable'); }],
      ['N/A reason', () => reason.fill('A different exact N/A reason.')],
      ['note', () => note.fill('A changed note.')],
    ];
    for (const [category, change] of resetCases) {
      if (!await support().isChecked()) await support().check();
      await change();
      assert.equal(await support().isChecked(), false, `${category} changes reset support confirmation`);
    }

    await action('Reject').check();
    assert.equal(await support().count(), 0, 'Reject must omit support confirmation');
    assert.equal(await editor.count(), 0, 'Reject must omit edited proposal');
    assert.equal(await page.getByLabel(/post-change.*complete|reminder.*complete/i).count(), 0);
  });

  for (const [name, profile, mode] of [
    ['Approve', 'image-alt', 'local'],
    ['Edit and accept', 'label', 'groq'],
    ['Reject', 'color-contrast', 'local'],
  ] as const) it(`publishes one truthful immutable ${name} decision for ${profile}/${mode}`, async () => {
    const runId = `review-final-${profile}`;
    await openReview(profile, mode, runId);
    const actionCode: ReviewAction = name === 'Approve' ? 'approve' : name === 'Edit and accept' ? 'edit-and-accept' : 'reject';
    const pendingFinding = reviewProfileStages(profile, runId, mode).pending.scan.findings[0]!;
    assert.ok('result' in pendingFinding && pendingFinding.result.type === 'proposal');
    const submitted = actionCode === 'reject'
      ? reviewInput(actionCode, profile, { status: 'unresolved' })
      : reviewInput(actionCode, profile);
    let editedCandidate: MutableProposalCandidate | undefined;
    if (actionCode === 'edit-and-accept') {
      const edited = structuredClone(pendingFinding.result) as unknown as MutableProposalCandidate;
      assert.equal(edited.type, 'proposal');
      edited.findingSummary.text = 'Reviewer-authored summary for the controlled Finding.';
      editedCandidate = edited;
      submitted.editedProposal = edited;
    }
    submitted.note = '  Controlled reviewer note.  ';
    const final = reviewedProfileRun(actionCode, profile, runId, mode, submitted);
    await configureReview({ status: 200, body: { ok: true, run: final } });
    if (name === 'Reject') await action('Reject').check();
    if (name === 'Edit and accept') {
      await action('Edit and accept').check();
      assert.ok(editedCandidate);
      await page.getByLabel('Finding summary', { exact: true }).fill(editedCandidate.findingSummary.text);
    }
    await page.getByLabel(/reviewer note/i).fill('  Controlled reviewer note.  ');
    if (name !== 'Reject') await chooseAccepting(name);
    await save().focus();
    await save().click();
    const decision = page.getByRole('region', { name: /saved review decision/i });
    await decision.waitFor();
    const text = await decision.innerText();
    assert.match(text, new RegExp(name, 'i'));
    assert.match(text, /2026-08-30T10:00:07.000Z|Aug|2026/i);
    assert.ok(text.includes('Controlled reviewer note'));
    assert.ok((await page.locator('main').innerText()).includes('Rescan and perform the relevant human checks after the change.'));
    assert.match(await results().getByRole('button', { name: findingLabel(profile) }).innerText(),
      actionCode === 'approve' ? /accepted/i : actionCode === 'edit-and-accept' ? /edited and accepted/i : /rejected/i);
    assert.equal((await results().getByRole('button', { name: findingLabel(profile) }).innerText()).includes('Proposal pending review'), false);
    assert.equal(await reviewCalls(), 1);
    const captured = await page.evaluate(() => {
      const call = window.m104.calls.find(item => item.stage === 'review');
      return call?.stage === 'review' ? call.value : null;
    });
    assert.deepEqual(captured, { runId, findingId: 'finding-0', review: submitted });
    if (actionCode === 'reject') assert.match(text, /no remediation plan was accepted/i);
    if (actionCode === 'edit-and-accept') assert.match(text, /reviewer-authored/i);
  });

  it('reserves before callback reflection, prevents duplicate dispatch and isolates sibling selection', async () => {
    const stages = await openReview('image-alt', 'local', 'review-reentrant', true);
    await chooseAccepting('Approve');
    await save().evaluate(node => { window.m104.savedNode = node; });
    await page.evaluate(() => {
      window.m104.review = () => window.m104.hold('review-reentrant');
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, true);
      window.m104.reviewAccessor = callback => {
        window.m104.canary++;
        (window.m104.savedNode as HTMLButtonElement).click();
        return callback;
      };
    });
    await save().click();
    await save().dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.reviewReads), 1);
    assert.equal(await page.evaluate(() => window.m104.canary), 1);
    assert.equal(await reviewCalls(), 1);
    const sibling = results().getByRole('button').nth(1);
    await sibling.focus(); await sibling.click();
    const final = reviewedProfileRun('approve', 'image-alt', 'review-reentrant', 'local');
    await page.evaluate(final => window.m104.resolveKey('review-reentrant',
      { status: 200, body: { ok: true, run: structuredClone(final) } }), final);
    await paint();
    assert.ok(await sibling.evaluate(node => node === document.activeElement));
    assert.equal(await reviewCalls(), 1);

    await openReview('image-alt', 'local', 'review-response-reflection', true);
    await chooseAccepting('Approve');
    await page.evaluate(() => {
      window.m104.review = () => Promise.resolve(new Proxy({}, {
        ownKeys() { window.m104.unmount(); return []; },
      }));
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, true);
    });
    await save().click();
    await paint();
    assert.equal(await page.getByRole('main').count(), 0, 'Unmount during admission reflection must prevent publication');
  });

  it('keeps definite refusal distinct from unknown save and never retries automatically', async () => {
    await openReview('image-alt', 'local', 'review-noncallable', true);
    await chooseAccepting('Approve');
    await page.evaluate(() => {
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, true);
      window.m104.reviewAccessor = () => undefined;
    });
    await save().click();
    assert.equal(await reviewCalls(), 0);
    assert.match(await status().innerText(), /unavailable|not saved|could not/i);
    const noncallableFinal = reviewedProfileRun('approve', 'image-alt', 'review-noncallable', 'local');
    await page.evaluate(final => {
      window.m104.review = () => Promise.resolve({ status: 200, body: { ok: true, run: structuredClone(final) } });
      window.m104.reviewAccessor = callback => callback;
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, true);
    }, noncallableFinal);
    if (!await support().isChecked()) await support().check();
    await save().click();
    await page.getByRole('heading', { name: /saved review decision/i }).waitFor();
    assert.equal(await reviewCalls(), 1, 'A non-callable collaborator discovered before dispatch must release');

    const releasable = await openReview('image-alt', 'local', 'review-releasable');
    await chooseAccepting('Approve');
    await configureReview({ status: 400,
      body: { ok: false, error: 'invalid-request', run: structuredClone(releasable.pending), persisted: false, cleanupFailed: false } });
    await save().click();
    await page.getByText(/not saved/i).waitFor();
    assert.equal(await reviewCalls(), 1);
    await support().check();
    const corrected = reviewedProfileRun('approve', 'image-alt', 'review-releasable', 'local');
    await configureReview({ status: 200, body: { ok: true, run: corrected } });
    await save().click();
    await page.getByRole('heading', { name: /saved review decision/i }).waitFor();
    assert.equal(await reviewCalls(), 2, 'An exact-baseline invalid request must release for explicit correction');

    const stages = await openReview('image-alt', 'groq', 'review-outcomes');
    await chooseAccepting('Approve');
    await configureReview({ status: 409,
      body: { ok: false, error: 'workflow-active', run: structuredClone(stages.pending), persisted: false, cleanupFailed: false } });
    await save().click();
    await page.getByText(/not saved/i).waitFor();
    assert.equal(await reviewCalls(), 1);
    await save().dispatchEvent('click');
    assert.equal(await reviewCalls(), 1, 'Retained definite refusal must block resubmission');

    const cleanupStages = await openReview('image-alt', 'local', 'review-cleanup-uncertain');
    await chooseAccepting('Approve');
    await configureReview({ status: 500,
      body: { ok: false, error: 'review-persistence', run: structuredClone(cleanupStages.pending), persisted: false, cleanupFailed: true } });
    await save().click();
    assert.match(await page.locator('main').innerText(), /not saved|cleanup/i);
    await save().dispatchEvent('click');
    assert.equal(await reviewCalls(), 1, 'Cleanup uncertainty must retain ownership');

    await openReview('image-alt', 'local', 'review-null-validation');
    await chooseAccepting('Approve');
    await configureReview({ status: 400,
      body: { ok: false, error: 'review-validation', run: null, persisted: false, cleanupFailed: false } });
    await save().click();
    await save().dispatchEvent('click');
    assert.equal(await reviewCalls(), 1, 'A null-baseline validation refusal cannot prove safe release');

    await openReview('image-alt', 'groq', 'review-unknown');
    await chooseAccepting('Approve');
    await configureReview({ status: 200, body: { malformed: true } });
    await save().click();
    await page.getByText('Save outcome unknown', { exact: true }).waitFor();
    const unknown = await page.locator('main').innerText();
    assert.match(unknown, /may have been saved/i);
    assert.equal(unknown.includes('cleanup'), false);
    assert.equal(await reviewCalls(), 1);
    await save().dispatchEvent('click');
    assert.equal(await reviewCalls(), 1);
    const analyzeBefore = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length);
    await page.getByRole('button', { name: 'Analyze', exact: true }).dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'analyze').length), analyzeBefore,
      'Unknown review ownership must block a new Analyze dispatch');
    const sibling = results().getByRole('button').nth(1);
    await sibling.click();
    const guidanceBefore = await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance').length);
    await page.getByRole('button', { name: 'Get guidance', exact: true }).dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance').length), guidanceBefore,
      'Unknown review ownership must block guidance for an untouched sibling');
  });

  it('omits a whitespace-only optional note from the captured intent', async () => {
    await openReview('label', 'groq', 'review-blank-note');
    await action('Reject').check();
    await page.getByLabel(/reviewer note/i).fill('   ');
    const final = reviewedProfileRun('reject', 'label', 'review-blank-note', 'groq',
      reviewInput('reject', 'label', { status: 'unresolved' }));
    await configureReview({ status: 200, body: { ok: true, run: final } });
    await save().click();
    const captured = await page.evaluate(() => {
      const call = window.m104.calls.find(item => item.stage === 'review');
      return call?.stage === 'review' ? call.value : null;
    });
    assert.deepEqual(captured, { runId: 'review-blank-note', findingId: 'finding-0',
      review: { action: 'reject', blockingJudgment: { status: 'unresolved' } } });
  });

  it('preserves exact raw N/A reason and note text in the captured intent', async () => {
    await openReview('image-alt', 'local', 'review-raw-na');
    await action('Approve').check();
    await judgment().selectOption('not-applicable');
    await page.getByLabel(/not applicable.*reason/i).fill('  Exact bounded N/A reason.  ');
    await page.getByLabel(/reviewer note/i).fill('  Exact optional note.  ');
    await support().check();
    const submitted = reviewInput('approve', 'image-alt', {
      status: 'not-applicable', reason: '  Exact bounded N/A reason.  ',
    });
    submitted.note = '  Exact optional note.  ';
    const final = reviewedProfileRun('approve', 'image-alt', 'review-raw-na', 'local', submitted);
    await configureReview({ status: 200, body: { ok: true, run: final } });
    await save().click();
    const captured = await page.evaluate(() => {
      const call = window.m104.calls.find(item => item.stage === 'review');
      return call?.stage === 'review' ? call.value : null;
    });
    assert.deepEqual(captured, { runId: 'review-raw-na', findingId: 'finding-0', review: submitted });
  });

  it('aborts an actually pending owner on unmount and rejects reflection after the monotonic deadline', async () => {
    await openReview('image-alt', 'local', 'review-unmount');
    await chooseAccepting('Approve');
    await configureReview('hold');
    await save().click();
    assert.equal(await save().getAttribute('aria-disabled'), 'true');
    const aborted = await page.evaluate(() => {
      window.m104.unmount();
      const call = window.m104.calls.find(item => item.stage === 'review');
      return call?.stage === 'review' && call.signal.aborted;
    });
    assert.equal(aborted, true);
    await page.evaluate(() => window.m104.resolveKey('review-late', { status: 200, body: { malformed: true } }));
    assert.equal(await page.getByRole('main').count(), 0);

    await openReview('image-alt', 'local', 'review-monotonic', true);
    await chooseAccepting('Approve');
    await save().evaluate(node => { window.m104.savedNode = node; });
    await page.evaluate(() => {
      const descriptor = Object.getOwnPropertyDescriptor(performance, 'now');
      const original = performance.now.bind(performance);
      window.m104.raw = { descriptor };
      window.m104.review = () => Promise.resolve({ status: 200, body: { malformed: true } });
      window.m104.rerender(true, { localModelInstalled: true }, true, true, false, true, true);
      window.m104.reviewAccessor = callback => {
        Object.defineProperty(performance, 'now', { configurable: true, value: () => original() + 30001 });
        return callback;
      };
    });
    try {
      await save().click();
      assert.equal(await reviewCalls(), 0, 'Elapsed monotonic deadline after reflection must prevent dispatch');
      assert.match(await status().innerText(), /time|unknown|uncertain/i);
    } finally {
      await page.evaluate(() => {
        const descriptor = window.m104.raw?.descriptor;
        if (descriptor) Object.defineProperty(performance, 'now', descriptor);
        else delete (performance as any).now;
      });
    }
  });

  it('applies the 30000 ms deadline, aborts after terminalization and ignores late completion/unmount', async () => {
    await openReview('image-alt', 'local', 'review-deadline');
    await chooseAccepting('Approve');
    await configureReview('hold');
    await page.evaluate(() => {
      const nativeTimeout = window.setTimeout.bind(window);
      window.m104.raw = { nativeTimeout };
      window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: any[]) => {
        if (delay === 30000) { window.m104.timerDelay = delay; return nativeTimeout(handler, 0, ...args); }
        return nativeTimeout(handler, delay, ...args);
      }) as typeof window.setTimeout;
    });
    try {
      await save().click();
      await page.getByText('Save outcome unknown', { exact: true }).waitFor();
      assert.equal(await page.evaluate(() => window.m104.timerDelay), 30000);
      assert.equal(await page.evaluate(() => {
        const call = window.m104.calls.find(item => item.stage === 'review');
        return call?.stage === 'review' && call.signal.aborted;
      }), true);
      await page.evaluate(() => window.m104.resolveKey('review-late', { status: 400,
        body: { ok: false, error: 'invalid-request', run: null, persisted: false, cleanupFailed: false } }));
      await paint();
      assert.equal(await page.getByText('Save outcome unknown', { exact: true }).count(), 1);
      await page.evaluate(() => window.m104.unmount());
      assert.equal(await page.getByRole('main').count(), 0);
    } finally {
      if (!page.isClosed()) await page.evaluate(() => { if (window.m104.raw?.nativeTimeout) window.setTimeout = window.m104.raw.nativeTimeout; });
    }
  });

  it('discards drafts on selection and restores focus only for the replaced selected form', async () => {
    const stages = await openReview('image-alt', 'local', 'review-focus');
    await action('Edit and accept').check();
    await page.getByLabel('Finding summary', { exact: true }).fill('Unsaved reviewer draft');
    const selected = results().getByRole('button', { name: findingLabel('image-alt') });
    const sibling = results().getByRole('button').nth(1);
    await sibling.click(); await selected.click();
    await action('Edit and accept').check();
    const pendingFinding = stages.pending.scan.findings[0]!;
    assert.ok('result' in pendingFinding);
    assert.equal(pendingFinding.result.type, 'proposal');
    assert.equal(await page.getByLabel('Finding summary', { exact: true }).inputValue(), pendingFinding.result.findingSummary.text);
    await chooseAccepting('Approve');
    const final = reviewedProfileRun('approve', 'image-alt', 'review-focus', 'local');
    await configureReview({ status: 200, body: { ok: true, run: final } });
    await save().focus(); await save().click();
    const heading = page.getByRole('heading', { name: /saved review decision/i });
    await heading.waitFor();
    assert.ok(await heading.evaluate(node => node === document.activeElement));
  });

  it('preserves keyboard selection, shared announcements, provenance, axe and reflow', async () => {
    const stages = reviewProfileStages('color-contrast', 'review-a11y', 'groq');
    const pending = structuredClone(stages.pending) as any;
    const proposal = pending.scan.findings.find((finding: any) => finding.findingId === 'finding-0').result;
    proposal.findingSummary.text = 'S'.repeat(1000);
    proposal.userImpact.text = 'I'.repeat(1000);
    proposal.remediation.text = 'R'.repeat(2000);
    proposal.uncertainty = 'U'.repeat(1000);
    proposal.assumptions = Array.from({ length: 5 }, (_, index) => `A${index}`.repeat(250));
    proposal.blockingManualJudgment = 'J'.repeat(1000);
    proposal.postChangeVerificationReminder = 'V'.repeat(1000);
    const longStages = Object.freeze({ ...stages, pending: valid(pending) as typeof stages.pending });
    await openReview('color-contrast', 'groq', 'review-a11y', false, longStages);
    const selected = results().getByRole('button', { name: findingLabel('color-contrast') });
    await selected.focus(); await page.keyboard.press('Enter');
    assert.ok(await selected.evaluate(node => node === document.activeElement));
    assert.equal(await status().getAttribute('aria-atomic'), 'true');
    assert.match(await status().innerText(), /groq.*openai\/gpt-oss-20b/i);
    assert.ok((await page.locator('main').innerText()).includes('V'.repeat(1000)),
      'The original proposal must show its actual long reminder');
    await assertAccessibleViewports();
    await action('Edit and accept').check();
    await assertAccessibleViewports();
    await page.getByLabel('Finding summary', { exact: true }).fill('');
    await save().click();
    await assertAccessibleViewports();
    const submitted = reviewInput('edit-and-accept', 'color-contrast');
    const longEdited = structuredClone(proposal) as MutableProposalCandidate;
    longEdited.findingSummary.text = 'Reviewer corrected the bounded contrast summary.';
    submitted.editedProposal = longEdited;
    const final = reviewedProfileRun('edit-and-accept', 'color-contrast', 'review-a11y', 'groq', submitted, longStages.pending);
    await configureReview({ status: 200, body: { ok: true, run: final } });
    await page.getByLabel('Finding summary', { exact: true }).fill(longEdited.findingSummary.text);
    await judgment().selectOption('supports-proposal');
    await support().check();
    await save().focus();
    assert.ok(await save().evaluate(node => {
      const style = getComputedStyle(node);
      return style.outlineStyle !== 'none' || style.boxShadow !== 'none';
    }), 'Keyboard-focused Save decision must have a visible focus indicator');
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: /saved review decision/i }).waitFor();
    await assertAccessibleViewports();
    const finalText = await page.locator('main').innerText();
    assert.ok(finalText.includes('V'.repeat(1000)), 'Saved edited decision must show the actual long reminder');
    assert.equal(finalText.includes('Rescan and perform the relevant human checks after the change.'), false);
  });

  it('keeps non-reviewable and failed branches action-free', async () => {
    const stages = reviewProfileStages('image-alt', 'review-negative', 'local');
    const runs = [
      valid(assessedMissingRetrievalRun('review-abstention')),
      valid(failedGenerationRun('response-validation', { runId: 'review-generation-failed',
        invocation: generationInvocation('local', 'response', 'failed') })),
      stages.scan,
    ];
    for (const run of runs) {
      await page.evaluate(run => {
        window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
        window.m104.mount(true, { localModelInstalled: true }, true, true, false, true, false);
      }, run);
      await page.getByLabel('Target URL').fill(run.requestedUrl);
      await page.getByRole('radio', { name: /Local/ }).check();
      await page.getByRole('button', { name: 'Analyze', exact: true }).click();
      const card = results().getByRole('button').first();
      await card.click();
      assert.equal(await page.getByRole('radio', { name: /Approve|Edit and accept|Reject/ }).count(), 0);
    }
    await page.evaluate(run => {
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
      window.m104.mount(true, { localModelInstalled: true }, true, true, false, true, false);
    }, stages.scan);
    await page.getByLabel('Target URL').fill(stages.scan.requestedUrl);
    await page.getByRole('radio', { name: /Local/ }).check();
    await page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await page.getByRole('button', { name: /review 1/i }).first().click();
    assert.equal(await page.getByRole('radio', { name: /Approve|Edit and accept|Reject/ }).count(), 0,
      'ScannerReviewObservation must remain non-reviewable even when a review collaborator exists');
  });

  it('supports the explicitly scoped synthetic capture branch only when enabled', async () => {
    if (process.env.A11Y_M402_CAPTURE_PROOF !== '1') return;
    const parent = path.resolve('temp');
    const parentStat = fs.lstatSync(parent);
    assert.ok(parentStat.isDirectory() && !parentStat.isSymbolicLink());
    assert.equal(fs.realpathSync.native(parent).toLowerCase(), parent.toLowerCase());
    const proof = fs.mkdtempSync(path.join(parent, 'm402-review-proof-'));
    assert.ok(proof.startsWith(path.resolve('.') + path.sep));
    assert.deepEqual(fs.readdirSync(proof), []);
    console.log(JSON.stringify({ event: 'm402-review-proof-root', proof }));
    try {
      const stages = await openReview('image-alt', 'local', 'review-capture');
      const capture = async (name: string, region: Locator): Promise<void> => {
        for (const [viewport, size] of [['desktop', { width: 1366, height: 900 }],
          ['narrow', { width: 390, height: 844 }]] as const) {
          await page.setViewportSize(size);
          await region.scrollIntoViewIfNeeded();
          await paint();
          fs.writeFileSync(path.join(proof, `${name}-${viewport}.png`), await page.screenshot(), { flag: 'wx' });
        }
      };
      await capture('original', page.getByText(/original model-generated proposal/i));
      await action('Edit and accept').check();
      const editor = page.getByRole('group', { name: /reviewer-authored proposal/i });
      await capture('editor', editor);
      await page.getByLabel('Finding summary', { exact: true }).fill('');
      await save().click();
      await capture('error', page.getByText('Finding summary is required.', { exact: true }));
      const submitted = reviewInput('edit-and-accept', 'image-alt');
      const original = stages.pending.scan.findings.find(finding => finding.findingId === 'finding-0');
      assert.ok(original && 'result' in original && original.result.type === 'proposal');
      const edited = structuredClone(original.result) as MutableProposalCandidate;
      submitted.editedProposal = edited;
      const final = reviewedProfileRun('edit-and-accept', 'image-alt', 'review-capture', 'local', submitted);
      await configureReview({ status: 200, body: { ok: true, run: final } });
      await page.getByLabel('Finding summary', { exact: true }).fill(edited.findingSummary.text);
      await judgment().selectOption('supports-proposal');
      await support().check();
      await save().click();
      const decision = page.getByRole('region', { name: /saved review decision/i });
      await decision.waitFor();
      await capture('final', decision);
      fs.writeFileSync(path.join(proof, 'identity.json'), JSON.stringify({ sourceRevision: '303b7985e2a5e8b65f6522e4480e396c5953703d',
        sourceHashes: harness.hashes, browser: harness.browserVersion, runId: stages.pending.runId,
        states: ['original', 'editor', 'error', 'final'], viewports: ['1366x900', '390x844'] }, null, 2), { flag: 'wx' });
      assert.deepEqual(fs.readdirSync(proof).sort(), [
        'editor-desktop.png', 'editor-narrow.png', 'error-desktop.png', 'error-narrow.png',
        'final-desktop.png', 'final-narrow.png', 'identity.json', 'original-desktop.png', 'original-narrow.png',
      ]);
    } catch (error) {
      console.error(JSON.stringify({ event: 'm402-review-proof-failed', proof }));
      throw error;
    }
  });
});

describe('M4-02 synthetic browser-to-service-to-disk review', { concurrency: false }, () => {
  for (const testCase of [
    { action: 'approve', profile: 'image-alt', mode: 'local', runId: 'm402-integration-approve' },
    { action: 'edit-and-accept', profile: 'label', mode: 'groq', runId: 'm402-integration-edit' },
    { action: 'reject', profile: 'color-contrast', mode: 'local', runId: 'm402-integration-reject' },
  ] as const) it(`persists ${testCase.action} through the actual review route`, async () => {
    await runBuiltReviewCase(testCase);
  });

  it('reports unknown after a committed review response is deliberately withheld and sends no second POST', async () => {
    await runBuiltReviewCase({ action: 'approve', profile: 'image-alt', mode: 'groq',
      runId: 'm402-integration-lost', loseResponse: true });
  });
});
