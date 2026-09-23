import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, test } from 'node:test';
import type { Page } from 'playwright';
import { repo, startHarness, type Harness } from './helpers/m104-ui-harness.ts';
import {
  createM603CorePathFixture,
  exerciseM603CorePath,
  m603CorePathViewports,
  type M603CorePathCheckpoint,
} from './helpers/m603-accessible-core-path.ts';

const captureFlag = 'A11Y_M603_CAPTURE_PROOF';
const visualRoot = path.join(repo, 'temp/m603-verification-v1/visual');
const checkpoints: readonly M603CorePathCheckpoint[] = [
  'intake', 'results', 'guidance', 'original-proposal', 'proposal-review', 'comparison',
  'saved-decision-baseline',
];

type CaptureObservation = {
  readonly checkpoint: M603CorePathCheckpoint;
  readonly frame: string;
  readonly viewport: string;
  readonly scrollTarget: string;
  readonly activeControl: string;
  readonly pageOverflow: boolean;
  readonly file: string;
};

const captureObservations: CaptureObservation[] = [];

let harness: Harness;
let page: Page;

function assertOrdinaryInsideRepository(target: string, allowMissing = false): void {
  const full = path.resolve(target);
  assert.ok(full.startsWith(repo + path.sep), 'Evidence path must remain inside the repository');
  let current = full;
  for (;;) {
    if (fs.existsSync(current)) {
      const stat = fs.lstatSync(current);
      assert.equal(stat.isSymbolicLink(), false, `Evidence path must not traverse a link: ${current}`);
      assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase(),
        `Evidence path must not use an alias: ${current}`);
    } else if (!allowMissing) {
      assert.fail(`Required evidence path is missing: ${current}`);
    }
    if (current.toLowerCase() === repo.toLowerCase()) return;
    const parent = path.dirname(current);
    assert.notEqual(parent, current, 'Evidence path escaped the repository');
    current = parent;
    allowMissing = true;
  }
}

async function paint(): Promise<void> {
  await page.evaluate(() => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

async function captureCheckpoint(checkpoint: M603CorePathCheckpoint): Promise<void> {
  if (process.env[captureFlag] !== '1') return;
  const frames = (() => {
    switch (checkpoint) {
      case 'intake': return [{ name: 'form', scrollTarget: 'Analyze form',
        target: page.getByLabel('Target URL', { exact: true }).locator('xpath=ancestor::form') }];
      case 'results': return [{ name: 'native-evidence', scrollTarget: 'Selected Finding evidence',
        target: page.getByRole('region', { name: /Image alternative issue 1 evidence/i }) },
      { name: 'findings-list', scrollTarget: 'Complete Findings list', target: page.locator('.findings-column') }];
      case 'guidance': return [
        { name: 'passage-text', scrollTarget: 'First retrieved passage text',
          target: page.locator('.passage-list .passage-text').first() },
        { name: 'source-notice', scrollTarget: 'First source-notice text',
          target: page.locator('.source-notice-text').first() },
      ];
      case 'original-proposal': return [
        { name: 'proposal', scrollTarget: 'Original proposal', target: page.locator('.proposal-detail') },
        { name: 'blocking-judgment', scrollTarget: 'Proposal blocking manual judgment',
          target: page.getByRole('heading', { name: 'Blocking manual judgment', exact: true }) },
      ];
      case 'proposal-review': return [{ name: 'review', scrollTarget: 'Human review form',
        target: page.getByRole('form', { name: /Review Image alternative issue 1/i }) }];
      case 'comparison': return [
        { name: 'summary', scrollTarget: 'Comparison outcome summary',
          target: page.locator('.comparison-detail > .evidence-facts').first() },
        { name: 'before', scrollTarget: 'Comparison Before evidence',
          target: page.locator('.comparison-evidence > div').nth(0) },
        { name: 'after', scrollTarget: 'Comparison After evidence',
          target: page.locator('.comparison-evidence > div').nth(1) },
        { name: 'limitations', scrollTarget: 'Comparison limitations',
          target: page.getByRole('heading', { name: 'Limitations', exact: true }) },
        { name: 'active-navigation', scrollTarget: 'Active Return to baseline control', target: page.locator(':focus') },
      ];
      case 'saved-decision-baseline': return [
        { name: 'saved-decision', scrollTarget: 'Saved review decision', target: page.locator('.review-decision') },
        { name: 'active-navigation', scrollTarget: 'Active Return to later results control', target: page.locator(':focus') },
      ];
    }
  })();
  for (const viewport of m603CorePathViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const frame of frames) {
      await frame.target.evaluate(element => element.scrollIntoView({ block: 'start' }));
      await paint();
      const file = `${checkpoint}-${frame.name}-${viewport.name}.png`;
      const target = path.join(visualRoot, file);
      assert.equal(fs.existsSync(target), false, `Capture is create-only: ${target}`);
      const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      assert.equal(pageOverflow, false, `${checkpoint}/${frame.name} must not overflow at ${viewport.width}px`);
      const activeControl = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active) return 'none';
        const labels = active instanceof HTMLInputElement || active instanceof HTMLSelectElement
          || active instanceof HTMLTextAreaElement ? active.labels : null;
        const label = labels?.[0]?.textContent ?? active.getAttribute('aria-label') ?? active.textContent ?? '';
        return `${active.tagName.toLowerCase()}:${label.replace(/\s+/g, ' ').trim().slice(0, 120)}`;
      });
      fs.writeFileSync(target, await page.screenshot(), { flag: 'wx' });
      captureObservations.push({ checkpoint, frame: frame.name, viewport: viewport.name,
        scrollTarget: frame.scrollTarget, activeControl, pageOverflow, file });
    }
  }
  const desktop = m603CorePathViewports[0];
  await page.setViewportSize({ width: desktop.width, height: desktop.height });
  await paint();
}

before(async () => {
  const capture = process.env[captureFlag];
  assert.ok(capture === undefined || capture === '1', `${captureFlag} must be absent or exactly 1`);
  if (capture === '1') {
    assertOrdinaryInsideRepository(path.dirname(visualRoot));
    assertOrdinaryInsideRepository(visualRoot, true);
    assert.equal(fs.existsSync(visualRoot), false, 'Visual evidence root must be absent');
    fs.mkdirSync(visualRoot);
  }
  harness = await startHarness(false, 'app');
  page = harness.page;
  await page.setViewportSize({ width: m603CorePathViewports[0].width, height: m603CorePathViewports[0].height });
});

after(async () => {
  if (harness) await harness.close();
});

test('characterizes one continuous keyboard-accessible application path', { timeout: 120000 }, async () => {
  const fixture = createM603CorePathFixture();
  await page.evaluate(fixture => {
    window.m104.raw = structuredClone(fixture.later);
    window.m104.analyze = () => Promise.resolve({ ok: true, run: structuredClone(fixture.scan) });
    window.m104.guidance = () => Promise.resolve(structuredClone(fixture.guidance));
    window.m104.generation = () => Promise.resolve({ ok: true, run: structuredClone(fixture.pending) });
    window.m104.review = () => Promise.resolve({ status: 200,
      body: { ok: true, run: structuredClone(fixture.reviewed) } });
    window.m104.rescan = intent => {
      const run = { ...structuredClone(fixture.later), runId: intent.runId,
        baselineRunId: intent.baselineRunId };
      window.m104.raw = structuredClone(run);
      return Promise.resolve({ status: 200, body: { ok: true, run } });
    };
    window.m104.comparison = () => Promise.resolve({ status: 200,
      body: { ok: true, run: structuredClone(window.m104.raw), interrupted: false,
        comparisonLineage: { status: 'available' } } });
    window.m104.mount(true, { localModelInstalled: true, groqApiUrlConfigured: true },
      true, true, false, true, false, true, false, true, false);
  }, fixture);

  const counts = await exerciseM603CorePath(page, async checkpoint => {
    assert.ok(checkpoints.includes(checkpoint));
    await captureCheckpoint(checkpoint);
  });
  assert.deepEqual(counts, {
    analyze: 1,
    guidance: 1,
    generation: 1,
    review: 1,
    rescan: 1,
    comparison: 3,
    http: 0,
  });
  console.log(JSON.stringify({ event: 'm603-accessible-core-path', counts,
    checkpoints, viewports: m603CorePathViewports, synthetic: true,
    captured: process.env[captureFlag] === '1' }));

  if (process.env[captureFlag] === '1') {
    const files = captureObservations.map(observation => observation.file).sort();
    assert.deepEqual(fs.readdirSync(visualRoot).sort(), files);
    fs.writeFileSync(path.join(visualRoot, 'observations.json'), JSON.stringify({
      synthetic: true,
      browserVersion: harness.browserVersion,
      checkpoints,
      viewports: m603CorePathViewports,
      counts,
      frames: captureObservations,
    }, null, 2) + '\n', { flag: 'wx' });
  }
});
