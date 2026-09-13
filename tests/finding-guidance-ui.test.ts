import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Page, Route } from 'playwright';
import { resolveCitations } from '../src/server/retrieval/citation-resolution.ts';
import { SOURCE_NOTICES } from '../src/server/retrieval/source-notices.ts';
import { buildFindingAnalysis } from '../src/server/domain/finding-analysis.ts';
import { RETRIEVAL_SELECTION_POLICY } from '../src/server/retrieval/retrieval-contract.ts';
import { classifyGuidanceSupport } from '../src/server/retrieval/support-policy.ts';
import {
  assessedIncompleteRetrievalRun,
  assessedMissingRetrievalRun,
  assessedSupportedRetrievalRun,
  completedScanRun,
  evidenceAbstainedRun,
  failedRetrievalRun,
  runningRetrievalRun,
  selectedFinding,
} from './helpers/m202-retrieval-service-fixture.ts';
import { repo, startHarness, targetUrl, valid } from './helpers/m104-ui-harness.ts';
import type { Harness } from './helpers/m104-ui-harness.ts';
import { imagePassages, retrievalFor } from './helpers/m203-finding-fixture.ts';

type Mutable = Record<string | number, any>;

let harness: Harness;
let page: Page;

function findingButton(position = 0) {
  return page.getByRole('region', { name: 'Findings', exact: true }).getByRole('button').nth(position);
}

function guidanceButton() {
  return page.getByRole('button', { name: 'Get guidance', exact: true });
}

function selectedEvidence() {
  return page.getByRole('region', { name: / evidence$/i });
}

async function cardText(position: number): Promise<string> {
  return (await findingButton(position).innerText()).replace(/\s+/g, ' ').trim();
}

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
}

async function show(run: unknown, guidance = true): Promise<void> {
  await page.evaluate(({ run, guidance }) => {
    window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(run) });
    window.m104.mount(true, {}, guidance);
  }, { run, guidance });
  await page.getByLabel('Target URL').fill(targetUrl);
  await page.getByLabel('Local (recommended)').check();
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  await findingButton().click();
}

function citationOutcome(
  kind: 'supported' | 'incomplete' | 'missing',
  runId: string,
  markedSelectionPolicy = false,
): unknown {
  const raw = kind === 'supported' ? assessedSupportedRetrievalRun(runId)
    : kind === 'incomplete' ? assessedIncompleteRetrievalRun(runId) : assessedMissingRetrievalRun(runId);
  if (markedSelectionPolicy) {
    const retrieval = selectedFinding(raw).retrieval as Mutable;
    (retrieval.result as Mutable).selectionPolicy = RETRIEVAL_SELECTION_POLICY;
  }
  const run = valid(raw) as Mutable;
  const finding = selectedFinding(run) as Mutable;
  const native = selectedFinding(completedScanRun(runId));
  const retrieval = finding.retrieval.result;
  const corpusRoot = path.join(repo, 'corpus/wcag22-mvp-v1');
  const resolved = resolveCitations(native, retrieval,
    fs.readFileSync(path.join(corpusRoot, 'manifest.json')),
    fs.readFileSync(path.join(corpusRoot, 'passages.json')));
  assert.ok(resolved.ok);
  return { ok: true, run, view: { runId, findingId: finding.findingId, ...resolved.value } };
}

function evidenceOutcome(runId: string): unknown {
  return { ok: true, run: valid(evidenceAbstainedRun(runId)),
    view: { runId, findingId: 'finding-0', corpus: null, passages: [], notices: [] } };
}

function evidenceInitial(runId: string): unknown {
  const run = structuredClone(evidenceAbstainedRun(runId)) as Mutable;
  const finding = selectedFinding(run) as Mutable;
  finding.state = 'unprocessed';
  delete finding.analysis;
  delete finding.result;
  return valid(run);
}

function conflictingFinding(): unknown {
  const native = selectedFinding(completedScanRun('guidance-conflict-boundary')) as Mutable;
  const retrieval = retrievalFor(native, [
    imagePassages.criterion, imagePassages.interpretation, imagePassages.remediation,
  ]);
  const support = classifyGuidanceSupport(native, retrieval, [{
    passageIds: ['h37-text-alternative', 'understanding111-intent'], resolution: 'unresolved',
  }]);
  assert.ok(support.ok && support.value.state === 'conflicting');
  const decision = buildFindingAnalysis(native as never, '2026-08-30T10:00:03.000Z',
    '2026-08-30T10:00:04.000Z', support.value);
  return { ...structuredClone(native), ...decision, retrieval: {
    status: 'completed', startedAt: '2026-08-30T10:00:03.000Z', finishedAt: '2026-08-30T10:00:04.000Z',
    result: retrieval, support: support.value,
  } };
}

describe('selected Finding guidance UI', { concurrency: false, timeout: 120000 }, () => {
  before(async () => { harness = await startHarness(); page = harness.page; });
  after(async () => { await harness.close(); });
  beforeEach(async () => { await page.evaluate(() => window.m104.mount(false)); await paint(); });

  it('requires explicit activation, reserves synchronously and keeps selection and focus stable', async () => {
    const initial = valid(completedScanRun('guidance-explicit'));
    await show(initial);
    assert.equal(await guidanceButton().count(), 1, 'A selected unprocessed Finding exposes one explicit action');
    await page.evaluate(() => { window.m104.guidance = () => window.m104.hold(); window.m104.rerender(true, {}, true); });
    const selected = findingButton();
    await selected.focus();
    await page.keyboard.press('Enter');
    assert.ok(await selected.evaluate(node => node === document.activeElement));
    await guidanceButton().focus();
    await guidanceButton().click();
    assert.deepEqual(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance')
      .map(({ stage, value }) => ({ stage, value }))),
    [{ stage: 'guidance', value: { runId: 'guidance-explicit', findingId: 'finding-0' } }]);
    assert.equal(await guidanceButton().getAttribute('aria-disabled'), 'true');
    await guidanceButton().dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance').length), 1);
    await findingButton(1).focus();
    await page.keyboard.press('Enter');
    await page.evaluate(outcome => window.m104.resolve(outcome), citationOutcome('supported', 'guidance-explicit'));
    await page.waitForFunction(expected => document.querySelector('[role="status"]')?.textContent === expected,
      'Guidance ready for Image alternative issue 1.');
    assert.ok(await findingButton(1).evaluate(node => node === document.activeElement));
    assert.equal(await page.getByRole('status').innerText(), 'Guidance ready for Image alternative issue 1.');
    await findingButton().click();
    await selectedEvidence().getByText('Eligible for generation', { exact: true }).waitFor();
  });

  it('labels processed Finding cards while leaving unprocessed Findings and observations unchanged', async () => {
    await show(valid(completedScanRun('guidance-card-baseline')));
    const baselineFinding = await cardText(0);
    const baselineSibling = await cardText(1);
    const observation = page.getByRole('region', { name: 'Findings', exact: true })
      .getByRole('button', { name: /Image alternative review 1/i });
    const observationText = (await observation.innerText()).replace(/\s+/g, ' ').trim();
    assert.ok(observationText.includes('Needs manual review'));
    for (const workflowText of ['Eligible for generation', 'No proposal generated', 'Guidance failed', 'Guidance unfinished'])
      assert.equal(observationText.includes(workflowText), false, `Observation must not expose ${workflowText}`);

    const stateFailures: unknown[] = [];
    for (const [name, run, expected] of [
      ['supported', assessedSupportedRetrievalRun('guidance-card-supported'), 'Eligible for generation'],
      ['abstained', evidenceAbstainedRun('guidance-card-abstained'), 'No proposal generated'],
      ['failed', failedRetrievalRun('guidance-card-failed'), 'Guidance failed'],
      ['unfinished', runningRetrievalRun('guidance-card-unfinished'), 'Guidance unfinished'],
    ] as const) {
      await show(valid(run));
      await findingButton(1).click();
      const processedText = await cardText(0);
      try {
        assert.ok(processedText.includes(expected), `${name}: missing ${expected}`);
      } catch (error) {
        stateFailures.push(error);
      }
      assert.equal(await cardText(1), baselineSibling, `${name}: unprocessed sibling card name changed`);
    }
    assert.equal(baselineFinding.includes('Image alternative issue 1'), true);
    if (stateFailures.length) throw new AggregateError(stateFailures,
      'Processed Finding cards must expose their guidance workflow state');
  });

  it('admits supported guidance only for the captured identity and renders complete inert citations and notices', async () => {
    const initial = valid(completedScanRun('guidance-supported'));
    const outcome = citationOutcome('supported', 'guidance-supported');
    await show(initial);
    assert.equal(await guidanceButton().count(), 1);
    await page.evaluate(outcome => { window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
      window.m104.rerender(true, {}, true); }, outcome);
    await guidanceButton().click();
    const detail = page.getByRole('region', { name: /Image alternative issue 1 evidence/i });
    await detail.getByText('Eligible for generation', { exact: true }).waitFor();
    for (const text of ['Retrieved guidance', 'Evidence sufficiency', 'Complete', 'criterion', 'interpretation',
      'remediation', 'Similarity', '0.75', 'WCAG 2.2']) assert.ok((await detail.innerText()).includes(text), text);
    for (const notice of Object.values(SOURCE_NOTICES)) assert.equal(await detail.getByText(notice, { exact: true }).count(), 1);
    assert.equal(await detail.locator('script, iframe, object, embed, [onerror]').count(), 0);
    const links = detail.locator('a');
    assert.equal(await links.count(), 3);
    for (let index = 0; index < await links.count(); index++) {
      assert.match((await links.nth(index).getAttribute('href')) ?? '', /^https:\/\/www\.w3\.org\//);
    }
    const firstPassage = ((outcome as Mutable).view as Mutable).passages[0] as Mutable;
    const firstLink = links.first();
    const citationUrl = firstPassage.url as string;
    const citationRequestUrl = new URL(citationUrl);
    citationRequestUrl.hash = '';
    const citationName = `${firstPassage.sourceTitle} (opens in a new tab)`;
    assert.equal(await firstLink.getAttribute('target'), '_blank');
    assert.deepEqual(((await firstLink.getAttribute('rel')) ?? '').split(/\s+/).filter(Boolean).sort(),
      ['noopener', 'noreferrer']);
    assert.equal((await firstLink.innerText()).trim(), citationName);
    assert.equal(await detail.getByRole('link', { name: citationName, exact: true }).count(), 1);

    const appUrl = page.url();
    const fulfillCitation = (route: Route) => route.fulfill({ status: 200, contentType: 'text/html',
      body: '<!doctype html><html lang="en"><title>Citation</title><h1>Synthetic citation target</h1></html>' });
    let popup: Page | undefined;
    await harness.context.route(citationRequestUrl.href, fulfillCitation);
    try {
      const popupPromise = harness.context.waitForEvent('page');
      await firstLink.focus();
      await page.keyboard.press('Enter');
      popup = await popupPromise;
      await popup.getByRole('heading', { name: 'Synthetic citation target', exact: true }).waitFor();
      assert.equal(popup.url(), citationUrl);
      assert.equal(await popup.evaluate(() => window.opener === null), true);
      assert.deepEqual({ url: page.url(), selected: await findingButton().getAttribute('aria-pressed'),
        guidance: await detail.getByText('Eligible for generation', { exact: true }).count() },
      { url: appUrl, selected: 'true', guidance: 1 });
      await findingButton(1).click();
      assert.deepEqual([await findingButton().getAttribute('aria-pressed'),
        await findingButton(1).getAttribute('aria-pressed')], ['false', 'true']);
      await findingButton().click();
      assert.deepEqual({ selected: [await findingButton().getAttribute('aria-pressed'),
        await findingButton(1).getAttribute('aria-pressed')],
      guidance: await detail.getByText('Eligible for generation', { exact: true }).count() },
      { selected: ['true', 'false'], guidance: 1 });
    } finally {
      if (popup && !popup.isClosed()) await popup.close();
      await harness.context.unroute(citationRequestUrl.href, fulfillCitation);
    }
  });

  it('explains marked and historical retrieval selection at desktop and narrow widths', async () => {
    const explanations = {
      marked: 'The highest-ranked passage for each required guidance role is shown.',
      legacy: 'Up to three highest-ranked passages are shown.',
    } as const;
    const evidenceRoot = path.join(repo, 'temp', `m203-ui-${crypto.randomUUID()}`);
    assert.equal(fs.existsSync(evidenceRoot), false);
    fs.mkdirSync(evidenceRoot);
    const stat = fs.lstatSync(evidenceRoot);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
    const failures: unknown[] = [];

    for (const policy of ['marked', 'legacy'] as const) {
      const runId = `guidance-policy-${policy}`;
      await show(valid(completedScanRun(runId)));
      const outcome = citationOutcome('supported', runId, policy === 'marked');
      await page.evaluate(outcome => {
        window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
        window.m104.rerender(true, {}, true);
      }, outcome);
      await guidanceButton().click();
      const detail = page.getByRole('region', { name: /Image alternative issue 1 evidence/i });
      await detail.getByText('Eligible for generation', { exact: true }).waitFor();

      for (const [viewport, width] of [['desktop', 1280], ['narrow', 320]] as const) {
        await page.setViewportSize({ width, height: 800 });
        await paint();
        try {
          assert.equal(await detail.getByText(explanations[policy], { exact: true }).count(), 1,
            `${policy} policy explanation at ${width}x800`);
          const otherPolicy = policy === 'marked' ? 'legacy' : 'marked';
          assert.equal(await detail.getByText(explanations[otherPolicy], { exact: true }).count(), 0,
            `${policy} record must not show the ${otherPolicy} explanation`);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
            `${policy} policy presentation must not overflow at ${width}x800`);
        } catch (error) {
          failures.push(error);
        }
        await detail.getByRole('heading', { name: 'Retrieved guidance', exact: true })
          .evaluate(element => element.scrollIntoView({ block: 'start' }));
        await paint();
        await page.screenshot({ path: path.join(evidenceRoot, `${policy}-${viewport}.png`) });
      }
    }

    assert.deepEqual(fs.readdirSync(evidenceRoot).sort(), [
      'legacy-desktop.png', 'legacy-narrow.png', 'marked-desktop.png', 'marked-narrow.png',
    ]);
    console.log(JSON.stringify({ event: 'm305-policy-ui-evidence',
      root: path.relative(repo, evidenceRoot).replaceAll('\\', '/'), browserSource: 'm104-ui-ready',
      policies: ['marked', 'legacy'], viewports: ['1280x800', '320x800'], retained: true, synthetic: true }));
    if (failures.length) throw new AggregateError(failures,
      'Each persisted retrieval policy must expose its exact explanation without horizontal overflow');
  });

  it('renders evidence and guidance abstentions distinctly and confirms that generation was not called', async () => {
    for (const [runId, outcome, expected] of [
      ['guidance-evidence', evidenceOutcome('guidance-evidence'), ['Required captured evidence is incomplete.', 'Alternative text', 'Unavailable (missing)']],
      ['guidance-missing', citationOutcome('missing', 'guidance-missing', true), ['No applicable guidance was retrieved.', 'criterion', 'interpretation', 'remediation']],
      ['guidance-incomplete', citationOutcome('incomplete', 'guidance-incomplete'), ['does not cover every required role', 'interpretation', 'remediation']],
    ] as const) {
      await show(runId === 'guidance-evidence' ? evidenceInitial(runId) : valid(completedScanRun(runId)));
      assert.equal(await guidanceButton().count(), 1);
      await page.evaluate(outcome => { window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
        window.m104.rerender(true, {}, true); }, outcome);
      await guidanceButton().click();
      const detail = page.getByRole('region', { name: /Image alternative issue 1 evidence/i });
      await detail.getByText('No proposal generated', { exact: true }).waitFor();
      const text = await detail.innerText();
      for (const value of [...expected, 'No generation provider was called', 'Inspect the affected']) assert.ok(text.includes(value), value);
      assert.equal(text.includes('Eligible for generation'), false);
      if (runId === 'guidance-evidence') {
        assert.equal(await detail.getByText('Guidance was not retrieved.', { exact: true }).count(), 1);
        assert.equal(await detail.getByText('wcag22-mvp-v1', { exact: true }).count(), 0,
          'Evidence-only abstention must not fabricate a corpus version');
      }
      if (runId === 'guidance-missing') {
        assert.equal(await detail.getByText('wcag22-mvp-v1', { exact: true }).count(), 1,
          'Zero-passage retrieval must show its exact corpus version once');
        for (const explanation of [
          'The highest-ranked passage for each required guidance role is shown.',
          'Up to three highest-ranked passages are shown.',
        ]) assert.equal(await detail.getByText(explanation, { exact: true }).count(), 0,
          'Zero-passage retrieval must not show a selection-policy explanation');
      }
    }
  });

  it('rejects stale or malformed results, preserves earlier evidence, and keeps failures separate from support', async () => {
    const initial = valid(completedScanRun('guidance-reject'));
    await show(initial);
    assert.equal(await guidanceButton().count(), 1);
    const stale = citationOutcome('supported', 'other-run') as Mutable;
    await page.evaluate(stale => { window.m104.guidance = () => Promise.resolve(structuredClone(stale));
      window.m104.rerender(true, {}, true); }, stale);
    await guidanceButton().click();
    await selectedEvidence().getByText(/Guidance failed: invalid-result/).waitFor();
    assert.equal(await selectedEvidence().getByText('Eligible for generation', { exact: true }).count(), 0);
    assert.equal(await selectedEvidence().getByText('No proposal generated', { exact: true }).count(), 0);

    await show(valid(completedScanRun('guidance-failure')));
    assert.equal(await guidanceButton().count(), 1);
    const progress = valid(runningRetrievalRun('guidance-failure'));
    const failure = { ok: false, error: 'timeout', run: progress, persisted: false, cleanupFailed: true };
    await page.evaluate(failure => { window.m104.guidance = () => Promise.resolve(structuredClone(failure));
      window.m104.rerender(true, {}, true); }, failure);
    await guidanceButton().click();
    const detail = page.getByRole('region', { name: /Image alternative issue 1 evidence/i });
    await detail.getByText(/Guidance failed: timeout/).waitFor();
    for (const value of ['This guidance attempt was not saved.', 'Resource cleanup is uncertain.'])
      assert.ok((await detail.innerText()).includes(value));
    assert.equal((await detail.innerText()).includes('support'), false);
    assert.equal(await guidanceButton().getAttribute('aria-disabled'), 'true');
  });

  it('rejects matching-identity mutation, malformed views and accessors without corrupting native evidence', async () => {
    const cases: [string, (outcome: Mutable) => void][] = [
      ['selected native evidence', outcome => { selectedFinding(outcome.run).locator = { value: ':root > altered' }; }],
      ['sibling Finding', outcome => { selectedFinding(outcome.run, 1).locator = { value: ':root > sibling-altered' }; }],
      ['scanner observation', outcome => { outcome.run.scan.scannerReviewObservations[0].locator = { value: ':root > observation-altered' }; }],
      ['passage metadata', outcome => { outcome.view.passages[0].heading = 'Altered heading'; }],
      ['passage order', outcome => { outcome.view.passages.reverse(); }],
      ['nonfinite similarity', outcome => { outcome.view.passages[0].score = Number.NaN; }],
      ['notice text', outcome => { outcome.view.notices[0].text = 'Altered notice'; }],
      ['extra response field', outcome => { outcome.extra = true; }],
    ];
    for (const [name, mutate] of cases) {
      const runId = `guidance-reject-${name.replaceAll(' ', '-')}`;
      const initial = valid(completedScanRun(runId));
      const before = structuredClone(selectedFinding(initial as unknown as Mutable).evidence);
      const outcome = structuredClone(citationOutcome('supported', runId)) as Mutable;
      mutate(outcome);
      await show(initial);
      assert.equal(await guidanceButton().count(), 1, name);
      await page.evaluate(outcome => { window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
        window.m104.rerender(true, {}, true); }, outcome);
      await guidanceButton().click();
      await selectedEvidence().getByText(/Guidance failed: invalid-result/).waitFor();
      assert.deepEqual((selectedFinding(initial as unknown as Mutable).evidence), before);
      assert.equal(await selectedEvidence().getByText('Eligible for generation', { exact: true }).count(), 0);
    }

    const accessorRun = valid(completedScanRun('guidance-accessor'));
    await show(accessorRun);
    assert.equal(await guidanceButton().count(), 1);
    await page.evaluate(outcome => {
      window.m104.reads = 0;
      window.m104.guidance = () => Promise.resolve(Object.defineProperty({ ok: true }, 'run', {
        enumerable: true, get() { window.m104.reads++; return structuredClone((outcome as any).run); },
      }));
      window.m104.rerender(true, {}, true);
    }, citationOutcome('supported', 'guidance-accessor'));
    await guidanceButton().click();
    await selectedEvidence().getByText(/Guidance failed: invalid-result/).waitFor();
    assert.equal(await page.evaluate(() => window.m104.reads), 0, 'Admission must reject accessors without invoking them');
  });

  it('retains a supported unfinished owner across an independent Analyze run', async () => {
    const first = valid(completedScanRun('guidance-owner-first'));
    await show(first);
    assert.equal(await guidanceButton().count(), 1);
    const outcome = citationOutcome('supported', 'guidance-owner-first');
    await page.evaluate(outcome => { window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
      window.m104.rerender(true, {}, true); }, outcome);
    await guidanceButton().click();
    await selectedEvidence().getByText('Eligible for generation', { exact: true }).waitFor();
    const replacement = valid(completedScanRun('guidance-owner-second'));
    await page.evaluate(replacement => { window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(replacement) });
      window.m104.rerender(true, {}, true); }, replacement);
    await page.getByLabel('Target URL').fill(targetUrl);
    await page.getByLabel('Local (recommended)').check();
    await page.getByRole('button', { name: 'Analyze', exact: true }).click();
    await page.getByText(/findings? need review/).waitFor();
    await findingButton().click();
    assert.equal(await guidanceButton().getAttribute('aria-disabled'), 'true');
    await guidanceButton().dispatchEvent('click');
    assert.equal(await page.evaluate(() => window.m104.calls.filter(call => call.stage === 'guidance').length), 1);
  });

  it('keeps observations evidence-only, disables historical workflow states, and passes the new-region axe check', async () => {
    await show(valid(completedScanRun('guidance-observation')));
    assert.equal(await guidanceButton().count(), 1);
    await page.getByRole('button', { name: /Image alternative review 1/i }).click();
    assert.equal(await guidanceButton().count(), 0);

    for (const run of [runningRetrievalRun('guidance-running'), failedRetrievalRun('guidance-failed')]) {
      await show(valid(run));
      assert.equal(await guidanceButton().count(), 1);
      assert.equal(await guidanceButton().getAttribute('aria-disabled'), 'true');
    }

    await show(valid(completedScanRun('guidance-axe')));
    assert.equal(await guidanceButton().count(), 1);
    const outcome = citationOutcome('supported', 'guidance-axe');
    await page.evaluate(outcome => { window.m104.guidance = () => Promise.resolve(structuredClone(outcome));
      window.m104.rerender(true, {}, true); }, outcome);
    await guidanceButton().click();
    await selectedEvidence().getByText('Eligible for generation', { exact: true }).waitFor();
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })), []);
    await page.setViewportSize({ width: 320, height: 800 });
    await paint();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    const evidenceRoot = path.join(repo, 'temp', `m203-ui-${crypto.randomUUID()}`);
    assert.equal(fs.existsSync(evidenceRoot), false);
    fs.mkdirSync(evidenceRoot);
    const stat = fs.lstatSync(evidenceRoot);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
    await page.screenshot({ path: path.join(evidenceRoot, 'narrow.png') });
    await page.setViewportSize({ width: 1280, height: 800 });
    await paint();
    await page.screenshot({ path: path.join(evidenceRoot, 'desktop.png') });
    assert.deepEqual(fs.readdirSync(evidenceRoot).sort(), ['desktop.png', 'narrow.png']);
    console.log(JSON.stringify({ event: 'm203-ui-evidence', root: path.relative(repo, evidenceRoot).replaceAll('\\', '/'),
      browserSource: 'm104-ui-ready', viewports: ['1280x800', '320x800'], retained: true, synthetic: true }));
  });

  it('renders synthetic conflict policy only through the isolated FindingOutcome display boundary', async () => {
    await show(valid(completedScanRun('guidance-conflict-boundary')));
    assert.equal(await guidanceButton().count(), 1, 'Ordinary App behavior must establish Red before isolated dynamic import');
    const outcomeUrl = '/@fs/' + path.join(repo, 'src/client/components/results/FindingOutcome.tsx').replaceAll('\\', '/');
    const finding = conflictingFinding();
    await page.evaluate(async ({ outcomeUrl, finding }) => {
      const reactUrl = '/@id/react';
      const reactDomUrl = '/@id/react-dom/client';
      const [reactModule, reactDomModule, module] = await Promise.all([
        import(/* @vite-ignore */ reactUrl),
        import(/* @vite-ignore */ reactDomUrl),
        import(/* @vite-ignore */ outcomeUrl),
      ]) as any;
      const { createElement } = reactModule.default ?? reactModule;
      const { createRoot } = reactDomModule.default ?? reactDomModule;
      const host = document.createElement('div');
      host.id = 'isolated-conflict-outcome';
      document.body.append(host);
      createRoot(host).render(createElement(module.FindingOutcome, {
        finding, providerContext: { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' },
      }));
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      window.m104.raw = host.innerText;
    }, { outcomeUrl, finding });
    const text = await page.locator('#isolated-conflict-outcome').innerText();
    for (const value of ['No proposal generated', 'unresolved material conflict', 'understanding111-intent',
      'h37-text-alternative', 'No generation provider was called']) assert.ok(text.includes(value), value);
  });
});
