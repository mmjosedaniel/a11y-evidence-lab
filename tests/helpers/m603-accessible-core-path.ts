import assert from 'node:assert/strict';
import type { Locator, Page } from 'playwright';
import type { PageAnalysisRun } from '../../src/server/domain/run-contract.ts';
import { completedRun } from './m102-run-fixture.ts';
import { reviewProfileStages, reviewedProfileRun } from './m402-review-fixture.ts';
import { resolvedZeroComparisonForRuns } from './m503-comparison-fixture.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;

export type M603CorePathCheckpoint =
  | 'intake'
  | 'results'
  | 'guidance'
  | 'original-proposal'
  | 'proposal-review'
  | 'comparison'
  | 'saved-decision-baseline';

export const m603CorePathViewports = Object.freeze([
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'narrow', width: 390, height: 844 },
] as const);

export function createM603CorePathFixture(): {
  readonly scan: CompleteRun;
  readonly guidance: unknown;
  readonly pending: CompleteRun;
  readonly reviewed: CompleteRun;
  readonly later: CompleteRun;
} {
  const stages = reviewProfileStages('image-alt', 'm603-baseline', 'local');
  const reviewed = reviewedProfileRun('approve', 'image-alt', 'm603-baseline', 'local', undefined, stages.pending);
  const laterTemplate = completedRun('m603-later-template', 'groq', 'zero');
  const linked = {
    ...structuredClone(laterTemplate),
    baselineRunId: reviewed.runId,
    requestedUrl: reviewed.requestedUrl,
    scan: {
      ...structuredClone(laterTemplate.scan),
      context: {
        ...structuredClone(laterTemplate.scan.context),
        finalUrl: structuredClone(reviewed.scan.context.finalUrl),
      },
    },
  };
  const later = resolvedZeroComparisonForRuns(reviewed, linked, 'finding-0');
  return Object.freeze({
    scan: stages.scan,
    guidance: stages.guidance,
    pending: stages.pending,
    reviewed,
    later,
  });
}

type FocusPosition = {
  readonly index: number;
  readonly tag: string;
  readonly name: string;
};

async function focusPosition(page: Page): Promise<FocusPosition> {
  return page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    const candidates = [...document.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, summary, textarea, [tabindex]',
    )].filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true'
      && getComputedStyle(element).visibility !== 'hidden');
    return {
      index: active ? candidates.indexOf(active) : -1,
      tag: active?.tagName.toLowerCase() ?? 'none',
      name: active?.getAttribute('aria-label') ?? active?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100) ?? '',
    };
  });
}

async function expectFocused(target: Locator, description: string): Promise<void> {
  await target.waitFor({ state: 'visible' });
  assert.equal(await target.evaluate(element => element === document.activeElement), true,
    `Expected keyboard focus on ${description}`);
}

async function pressTab(page: Page, target: Locator, description: string, reverse = false): Promise<void> {
  const before = await focusPosition(page);
  await page.keyboard.press(reverse ? 'Shift+Tab' : 'Tab');
  await expectFocused(target, description);
  const after = await focusPosition(page);
  assert.ok(after.index >= 0, `${description} must remain inside the document focus order`);
  if (before.index >= 0) {
    assert.ok(reverse ? after.index < before.index : after.index > before.index,
      `${description} must follow the expected ${reverse ? 'reverse' : 'forward'} DOM order without wrapping`);
  }
}

async function waitForPaint(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

export async function exerciseM603CorePath(
  page: Page,
  onCheckpoint: (checkpoint: M603CorePathCheckpoint, page: Page) => Promise<void> = async () => {},
): Promise<Readonly<Record<'analyze' | 'guidance' | 'generation' | 'review' | 'rescan' | 'comparison' | 'http', number>>> {
  const target = page.getByLabel('Target URL', { exact: true });
  await pressTab(page, target, 'Target URL');
  await page.keyboard.type('https://example.org/start?view=summary#intro');

  const localMode = page.getByLabel('Local (recommended)', { exact: true });
  await pressTab(page, localMode, 'Local mode');
  await page.keyboard.press('Space');
  assert.equal(await localMode.isChecked(), true);

  const analyze = page.getByRole('button', { name: 'Analyze', exact: true });
  await pressTab(page, analyze, 'Analyze');
  await onCheckpoint('intake', page);
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Results', exact: true }).waitFor();
  assert.equal(await page.getByRole('status').innerText(),
    'Analysis completed: 2 findings and 1 item need manual review.');

  const findingsRegion = page.getByRole('region', { name: 'Findings', exact: true });
  const firstFinding = page.getByRole('region', { name: 'Findings', exact: true })
    .getByRole('button', { name: /Image alternative issue 1/i });
  await pressTab(page, findingsRegion, 'Findings scroll region');
  await pressTab(page, firstFinding, 'proposal-bearing Finding');
  await page.keyboard.press('Enter');
  assert.equal(await firstFinding.getAttribute('aria-pressed'), 'true');
  assert.equal(await firstFinding.evaluate(element => element === document.activeElement), true);
  assert.match(await page.getByRole('status').innerText(), /^Selected Image alternative issue 1\./);
  await onCheckpoint('results', page);

  const guidance = page.getByRole('button', { name: 'Get guidance', exact: true });
  const secondFinding = findingsRegion.getByRole('button', { name: /Image alternative issue 2/i });
  const observation = findingsRegion.getByRole('button', { name: /Image alternative review 1/i });
  await pressTab(page, secondFinding, 'second Finding');
  await pressTab(page, observation, 'manual-review observation');
  await pressTab(page, guidance, 'Get guidance');
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Retrieved guidance', exact: true }).waitFor();
  assert.equal(await page.getByRole('status').innerText(), 'Guidance ready for Image alternative issue 1.');
  const citations = page.getByRole('region', { name: /Image alternative issue 1 evidence/i }).getByRole('link');
  assert.equal(await citations.count(), 3);
  await pressTab(page, citations.nth(0), 'first guidance citation');
  assert.match((await citations.nth(0).getAttribute('href')) ?? '', /^https:\/\/www\.w3\.org\//);
  await pressTab(page, guidance, 'Get guidance by reverse traversal', true);
  await pressTab(page, citations.nth(0), 'first guidance citation after reverse traversal');
  await pressTab(page, citations.nth(1), 'second guidance citation');
  await pressTab(page, citations.nth(2), 'third guidance citation');
  const sourceNotices = page.locator('.source-notices summary');
  assert.equal(await sourceNotices.count(), 2);
  await pressTab(page, sourceNotices.nth(0), 'first source-notice disclosure');
  await pressTab(page, sourceNotices.nth(1), 'second source-notice disclosure');
  await onCheckpoint('guidance', page);

  const generate = page.getByRole('button', { name: 'Generate', exact: true });
  await pressTab(page, generate, 'Generate');
  await page.keyboard.press('Enter');
  await page.getByText('This is the original model-generated proposal. Human review is still required.',
    { exact: true }).waitFor();

  const proposalLinks = page.locator('.proposal-detail a');
  assert.equal(await proposalLinks.count(), 2);
  await pressTab(page, proposalLinks.nth(0), 'proposal user-impact citation');
  await pressTab(page, proposalLinks.nth(1), 'proposal remediation citation');
  const approve = page.getByRole('radio', { name: 'Approve', exact: true });
  await pressTab(page, approve, 'Approve review action');
  await onCheckpoint('original-proposal', page);
  await page.keyboard.press('Space');
  const judgment = page.getByRole('combobox', { name: /blocking judgment/i });
  await pressTab(page, judgment, 'Blocking judgment');
  await page.keyboard.press('ArrowDown');
  assert.equal(await judgment.inputValue(), 'supports-proposal');
  const note = page.getByLabel('Reviewer note (optional)', { exact: true });
  await pressTab(page, note, 'optional reviewer note');
  const confirmation = page.getByLabel(/confirm the resulting proposal/i);
  await pressTab(page, confirmation, 'review support confirmation');
  await page.keyboard.press('Space');
  assert.equal(await confirmation.isChecked(), true);
  const save = page.getByRole('button', { name: 'Save decision', exact: true });
  await pressTab(page, save, 'Save decision');
  await onCheckpoint('proposal-review', page);
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Saved review decision', exact: true }).waitFor();
  await expectFocused(page.getByRole('heading', { name: 'Saved review decision', exact: true }),
    'saved review decision heading');
  assert.match(await page.getByRole('status').innerText(), /Saved review decision\./);

  const rescanMode = page.getByLabel('New scan mode', { exact: true });
  await pressTab(page, rescanMode, 'New scan mode');
  await page.keyboard.press('End');
  assert.equal(await rescanMode.inputValue(), 'groq');
  const rescan = page.getByRole('button', { name: 'Start intentional rescan', exact: true });
  await pressTab(page, rescan, 'Start intentional rescan');
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Comparison', exact: true }).waitFor();
  assert.match(await page.getByRole('status').innerText(), /Comparison saved\./);
  const resultsHeading = page.getByRole('heading', { name: 'Results', exact: true });
  await expectFocused(resultsHeading, 'Results heading after replacement');

  const baseline = page.getByRole('button', { name: 'Return to baseline', exact: true });
  await pressTab(page, baseline, 'Return to baseline');
  await onCheckpoint('comparison', page);
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Saved review decision', exact: true }).waitFor();
  await expectFocused(resultsHeading, 'Results heading after baseline navigation');

  const later = page.getByRole('button', { name: 'Return to later results', exact: true });
  await pressTab(page, later, 'Return to later results');
  await onCheckpoint('saved-decision-baseline', page);
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Comparison', exact: true }).waitFor();
  await expectFocused(resultsHeading, 'Results heading after later-results navigation');
  await waitForPaint(page);

  return page.evaluate(() => {
    const stages = ['analyze', 'guidance', 'generation', 'review', 'rescan', 'comparison', 'http'] as const;
    return Object.fromEntries(stages.map(stage => [stage,
      window.m104.calls.filter(call => call.stage === stage).length])) as Record<typeof stages[number], number>;
  });
}
