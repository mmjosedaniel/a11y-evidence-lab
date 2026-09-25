import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import type { Browser, BrowserContext } from 'playwright';
import { startLocalService } from '../../src/server/service.ts';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import { validateReviewInput } from '../../src/server/domain/review-contract.ts';
import { admitReview } from '../../src/client/review/finding-review-admission.ts';
import { withReviewSandbox } from './m401-review-sandbox.ts';
import { reviewInput, type ReviewAction } from './m401-review-fixture.ts';
import { reviewProfileStages } from './m402-review-fixture.ts';
import type { GenerationMode, GenerationProfile } from './m302-generation-fixture.ts';
import { startHarness } from './m104-ui-harness.ts';

const repo = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const clientRoot = path.join(repo, 'dist/client');
const applicationRevision = '303b7985e2a5e8b65f6522e4480e396c5953703d';

export type BuiltReviewCase = {
  readonly action: ReviewAction;
  readonly mode: GenerationMode;
  readonly profile: GenerationProfile;
  readonly runId: string;
  readonly loseResponse?: boolean;
};

function label(profile: GenerationProfile): RegExp {
  return profile === 'image-alt' ? /Image alternative issue 1/i
    : profile === 'label' ? /Form label issue 1/i : /Color contrast issue 1/i;
}

export async function runBuiltReviewCase(testCase: BuiltReviewCase): Promise<void> {
  await withReviewSandbox('service', async sandbox => {
    const stages = reviewProfileStages(testCase.profile, testCase.runId, testCase.mode);
    fs.mkdirSync(sandbox.runs, { recursive: false });
    const runDirectory = path.join(sandbox.runs, testCase.runId);
    fs.mkdirSync(runDirectory, { recursive: false });
    fs.writeFileSync(path.join(runDirectory, 'run.json'), JSON.stringify(stages.pending), { flag: 'wx' });

    const started = await startLocalService({ runRoot: sandbox.runs, port: 0, applicationRevision, clientRoot });
    assert.ok(started.ok, 'Owned built-client review service must start');
    sandbox.services.push(started.service);
    const initial = started.service.readRun(testCase.runId);
    assert.ok(initial.ok && !initial.interrupted);
    assert.deepEqual(initial.run, stages.pending);

    let browser: Browser | undefined;
    let context: BrowserContext | undefined;
    let reviewPosts = 0;
    const external: string[] = [];
    const unexpectedPosts: string[] = [];
    const priorBodies = new Map<string, unknown>();
    const priorCounts = new Map<string, number>();
    let submittedIntent: Record<string, any> | undefined;
    let reviewResponse: { status: number; body: unknown } | undefined;
    const failures: unknown[] = [];
    try {
      browser = await chromium.launch({ channel: 'chromium', headless: true, timeout: 10000 });
      assert.equal(browser.version(), '151.0.7922.34');
      context = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: false,
        serviceWorkers: 'block' });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      await context.route('**/*', async route => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.origin !== started.service.url) { external.push(request.url()); await route.abort('blockedbyclient'); return; }
        if (request.method() !== 'POST') { await route.continue(); return; }
        if (url.pathname === '/api/runs') {
          priorCounts.set(url.pathname, (priorCounts.get(url.pathname) ?? 0) + 1);
          priorBodies.set(url.pathname, request.postDataJSON());
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, run: stages.scan }) });
          return;
        }
        if (url.pathname === '/api/finding-guidance') {
          priorCounts.set(url.pathname, (priorCounts.get(url.pathname) ?? 0) + 1);
          priorBodies.set(url.pathname, request.postDataJSON());
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(stages.guidance) });
          return;
        }
        if (url.pathname === '/api/finding-generation') {
          priorCounts.set(url.pathname, (priorCounts.get(url.pathname) ?? 0) + 1);
          priorBodies.set(url.pathname, request.postDataJSON());
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, run: stages.pending }) });
          return;
        }
        if (url.pathname === '/api/finding-review') {
          reviewPosts++;
          submittedIntent = request.postDataJSON() as Record<string, any>;
          if (testCase.loseResponse) {
            const response = await route.fetch();
            const bodyText = await response.text();
            reviewResponse = { status: response.status(), body: JSON.parse(bodyText) };
            const committed = started.service.readRun(testCase.runId);
            assert.ok(committed.ok);
            await route.abort('failed');
          } else await route.continue();
          return;
        }
        unexpectedPosts.push(url.pathname);
        await route.abort('blockedbyclient');
      });

      await page.goto(started.service.url);
      await page.getByLabel('Target URL').fill(stages.scan.requestedUrl);
      await page.getByRole('radio', { name: testCase.mode === 'local' ? /Local/ : /Groq/ }).check();
      await page.getByRole('button', { name: 'Analyze', exact: true }).click();
      await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
      await page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button', { name: label(testCase.profile) }).click();
      await page.getByRole('button', { name: 'Get guidance', exact: true }).click();
      await page.getByRole('button', { name: 'Generate', exact: true }).click();
      await page.getByRole('radio', { name: testCase.action === 'approve' ? 'Approve'
        : testCase.action === 'edit-and-accept' ? 'Edit and accept' : 'Reject', exact: true }).check();
      if (testCase.action !== 'reject') {
        await page.getByRole('combobox', { name: /blocking.*judgment/i }).selectOption('supports-proposal');
      }
      if (testCase.action === 'edit-and-accept') {
        await page.getByLabel('Finding summary').fill('Reviewer-authored summary for the controlled label Finding.');
      }
      if (testCase.action !== 'reject') await page.getByLabel(/confirm.*material claims/i).check();
      const normalReviewResponse = testCase.loseResponse ? undefined : page.waitForResponse(response => {
        const url = new URL(response.url());
        return url.origin === started.service.url && url.pathname === '/api/finding-review'
          && response.request().method() === 'POST';
      }).then(async response => ({ ok: true as const, value: { status: response.status(), body: await response.json() } }),
        error => ({ ok: false as const, error }));
      try {
        await page.getByRole('button', { name: 'Save decision', exact: true }).click();
      } catch (error) {
        await normalReviewResponse?.catch(() => undefined);
        throw error;
      }

      if (testCase.loseResponse) {
        await page.getByText('Save outcome unknown', { exact: true }).waitFor();
      } else {
        const observed = await normalReviewResponse!;
        if (!observed.ok) throw observed.error;
        reviewResponse = observed.value;
        await page.getByRole('heading', { name: /saved review decision/i }).waitFor();
      }
      assert.equal(reviewPosts, 1);
      assert.deepEqual(priorBodies.get('/api/runs'), { requestedUrl: stages.scan.requestedUrl, mode: testCase.mode });
      assert.deepEqual(priorBodies.get('/api/finding-guidance'), { runId: testCase.runId, findingId: 'finding-0' });
      assert.deepEqual(priorBodies.get('/api/finding-generation'), { runId: testCase.runId, findingId: 'finding-0' });
      assert.deepEqual(Object.fromEntries(priorCounts), {
        '/api/runs': 1, '/api/finding-guidance': 1, '/api/finding-generation': 1,
      });
      assert.deepEqual(unexpectedPosts, []);
      assert.ok(submittedIntent && reviewResponse);
      assert.deepEqual({ runId: submittedIntent.runId, findingId: submittedIntent.findingId },
        { runId: testCase.runId, findingId: 'finding-0' });
      const expectedReview = reviewInput(testCase.action, testCase.profile,
        testCase.action === 'reject' ? { status: 'unresolved' } : { status: 'supports-proposal' });
      if (testCase.action === 'edit-and-accept') {
        const original = stages.pending.scan.findings.find(finding => finding.findingId === 'finding-0');
        assert.ok(original && 'result' in original && original.result.type === 'proposal');
        const edited = structuredClone(original.result) as NonNullable<typeof expectedReview.editedProposal>;
        edited.findingSummary.text = 'Reviewer-authored summary for the controlled label Finding.';
        expectedReview.editedProposal = edited;
      }
      assert.deepEqual(submittedIntent.review, expectedReview, 'Browser must submit the complete exact review intent');
      const admitted = admitReview(reviewResponse, stages.pending, submittedIntent as never);
      assert.ok(admitted?.ok, 'Actual review response must admit against the captured browser intent');
      const stored = started.service.readRun(testCase.runId);
      assert.ok(stored.ok && stored.run.status === 'completed');
      assert.deepEqual(admitted.run, stored.run, 'Admitted response must equal service readback');
      assert.equal(reviewResponse.status, 200);
      assert.deepEqual((reviewResponse.body as { run: unknown }).run, stored.run,
        'Actual review response aggregate must equal service readback');
      const selected = stored.run.scan.findings.find(finding => finding.findingId === 'finding-0');
      assert.ok(selected && 'review' in selected);
      assert.equal(selected.review.action, testCase.action);
      const beforeSelected = stages.pending.scan.findings.find(finding => finding.findingId === 'finding-0')!;
      assert.ok('result' in beforeSelected);
      assert.deepEqual(selected.result, beforeSelected.result, 'Original proposal must remain unchanged');
      assert.deepEqual(stored.run.scan.findings.filter(finding => finding.findingId !== 'finding-0'),
        stages.pending.scan.findings.filter(finding => finding.findingId !== 'finding-0'));
      const { supportConfirmed: _supportConfirmed, ...submittedDecision } = submittedIntent.review;
      const { decidedAt: _decidedAt, ...storedDecision } = selected.review;
      assert.deepEqual(storedDecision, submittedDecision, 'Disk decision content must equal the submitted action content');
      const disk = JSON.parse(fs.readFileSync(path.join(runDirectory, 'run.json'), 'utf8'));
      assert.equal(validateRun(disk).ok, true);
      assert.deepEqual(disk, stored.run, 'Literal disk aggregate must equal service readback');
      assert.deepEqual(external, []);
      await page.close();
    } catch (error) {
      failures.push(error);
    } finally {
      if (context) try { await context.close(); } catch (error) { failures.push(error); }
      if (browser) try { await browser.close(); } catch (error) { failures.push(error); }
    }
    if (failures.length === 1) throw failures[0];
    if (failures.length > 1) throw new AggregateError(failures, 'Built review behavior and browser cleanup failed');
  });
}

async function manual(): Promise<void> {
  const stages = reviewProfileStages('image-alt', 'm402-manual-review', 'local');
  let harness: Awaited<ReturnType<typeof startHarness>> | undefined;
  const failures: unknown[] = [];
  try {
    harness = await startHarness(true);
    const manualPage = harness.page;
    await manualPage.setViewportSize({ width: 1366, height: 900 });
    await manualPage.exposeFunction('m402ReviewOutcome', (intent: { runId: string; findingId: string; review: unknown }) => {
      assert.deepEqual({ runId: intent.runId, findingId: intent.findingId },
        { runId: stages.pending.runId, findingId: 'finding-0' });
      const selected = stages.pending.scan.findings.find(finding => finding.findingId === intent.findingId);
      if (!selected || selected.state !== 'proposal-pending-review' || selected.retrieval.status !== 'completed')
        throw new Error('Manual review requires the exact pending Finding baseline');
      const { retrieval, analysis: _analysis, generation: _generation, result: _result, ...nativeFields } = selected;
      const parsed = validateReviewInput(intent.review, {
        finding: { ...nativeFields, state: 'unprocessed' }, retrieval: retrieval.result,
      });
      assert.ok(parsed.ok, 'Manual callback accepts only a validated captured review intent');
      const run = structuredClone(stages.pending) as any;
      const finding = run.scan.findings.find((item: any) => item.findingId === intent.findingId);
      finding.state = parsed.value.action === 'approve' ? 'accepted'
        : parsed.value.action === 'edit-and-accept' ? 'edited-and-accepted' : 'rejected';
      finding.review = { ...parsed.value, decidedAt: '2026-08-30T10:00:07.000Z' };
      assert.ok(validateRun(run).ok, 'Manual callback must return a valid reviewed aggregate');
      return { status: 200, body: { ok: true, run } };
    });
    await manualPage.evaluate(stages => {
      document.title = 'M4-02 synthetic review';
      window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(stages.scan) });
      window.m104.guidance = () => Promise.resolve(structuredClone(stages.guidance));
      window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(stages.pending) });
      window.m104.review = intent => (window as any).m402ReviewOutcome(structuredClone(intent));
      window.m104.raw = null;
      window.m104.mount(true, { localModelInstalled: true }, true, true, false, true, false);
    }, stages);
    assert.equal(await manualPage.title(), 'M4-02 synthetic review');
    assert.deepEqual(manualPage.viewportSize(), { width: 1366, height: 900 });
    await manualPage.getByLabel('Target URL').fill(stages.scan.requestedUrl);
    await manualPage.getByRole('radio', { name: /Local/ }).check();
    await manualPage.getByRole('button', { name: 'Analyze', exact: true }).click();
    await manualPage.getByRole('heading', { name: 'Results', exact: true }).waitFor();
    await manualPage.getByRole('region', { name: 'Findings', exact: true }).getByRole('button', { name: label('image-alt') }).click();
    await manualPage.getByRole('button', { name: 'Get guidance', exact: true }).click();
    await manualPage.getByRole('button', { name: 'Generate', exact: true }).click();
    await manualPage.getByText('This is the original model-generated proposal. Human review is still required.', { exact: true }).waitFor();
    console.log(JSON.stringify({ title: 'M4-02 synthetic review', source: applicationRevision,
      browser: harness.browserVersion, fixture: stages.pending.runId, hashes: harness.hashes,
      viewport: manualPage.viewportSize(), state: 'proposal-pending-review' }));
    console.log('Inspect original, editor errors, corrected edit, saved decision, narrow layout and native 200% browser zoom; then close only this page.');
    await new Promise<void>(resolve => {
      const timer = setTimeout(resolve, 15 * 60 * 1000);
      manualPage.once('close', () => { clearTimeout(timer); resolve(); });
    });
  } catch (error) {
    failures.push(error);
  } finally {
    if (harness) try { await harness.close(); } catch (error) { failures.push(error); }
  }
  if (failures.length === 1) throw failures[0];
  if (failures.length > 1) throw new AggregateError(failures, 'Manual review behavior and cleanup failed');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--manual')) {
  await manual();
}
