import assert from 'node:assert/strict';
import { validateRun } from '../../src/server/domain/run-contract.ts';
import type { PageAnalysisRun } from '../../src/server/domain/run-contract.ts';

type RunningRun = Extract<PageAnalysisRun, { status: 'running' }>;
type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
export type FixtureMode = 'local' | 'groq';
export type FixtureScan = 'populated' | 'zero' | 'incomplete' | 'unavailable';

// Synthetic minimized records only: no browser, provider, filesystem or test registration.
const createdAt = '2026-08-30T10:00:00.000Z';
const scannedAt = '2026-08-30T10:00:01.000Z';
const finishedAt = '2026-08-30T10:00:02.000Z';
const rules = ['image-alt', 'label', 'color-contrast'] as const;
const fact = <T>(value: T) => ({ value });
const unavailable = () => ({ unavailable: 'missing' as const });

function context() {
  return {
    finalUrl: fact('https://example.org/final?view=summary#results'),
    scannedAt: fact(scannedAt), browserVersion: fact('145.0.7632.6'),
    scannerVersion: '4.13.0', evidencePolicyVersion: 'm1-public-v1', rules: [...rules],
    scope: 'current-rendered-top-level-document', readiness: 'domcontentloaded',
    readinessReached: true, viewport: { width: 1280, height: 720 }, locale: 'en-US',
    timeoutMs: 30000, freshContext: true, importedState: false, interaction: false,
    crawling: false, iframes: false, cleanup: 'closed',
    contrastProfile: 'axe-core-4.13.0-default',
  };
}

function common(runId: string, mode: FixtureMode) {
  return {
    formatVersion: 1, runId, createdAt, applicationRevision: 'a'.repeat(40),
    requestedUrl: 'https://example.org/start?view=summary#intro',
    providerContext: mode === 'local'
      ? { mode: 'local', provider: 'ollama', model: 'qwen3.5:4b' }
      : { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' },
  };
}

function checked<T extends PageAnalysisRun>(input: unknown, status: T['status']): T {
  const result = validateRun(input);
  assert.ok(result.ok, 'Synthetic fixture must satisfy the unchanged domain validator');
  assert.equal(result.value.status, status);
  return result.value as T;
}

export function runningRun(runId = 'run-01', mode: FixtureMode = 'local'): RunningRun {
  return checked<RunningRun>({
    ...common(runId, mode), status: 'running',
    scanContext: {
      ...context(), finalUrl: unavailable(), scannedAt: unavailable(),
      browserVersion: unavailable(), readinessReached: false, cleanup: 'pending',
    },
  }, 'running');
}

export function completedRun(runId = 'run-01', mode: FixtureMode = 'local', kind: FixtureScan = 'populated'): CompletedRun {
  const findings = kind === 'zero' || kind === 'incomplete' ? [] : [0, 1].map(index => ({
    findingId: `finding-${index}`, ruleId: 'image-alt', nativeResult: 'violation',
    state: 'unprocessed', checks: fact({ any: ['has-alt'], all: [], none: [] }),
    locator: kind === 'unavailable' ? unavailable() : fact(':root > :nth-child(1)'),
    evidence: {
      elementKind: kind === 'unavailable' ? { unavailable: 'withheld' } : fact('img'),
      altState: kind === 'unavailable' ? { unavailable: 'invalid' } : fact('absent'),
    },
  }));
  const observations = kind === 'zero' ? [] : [{
    ruleId: 'image-alt', nativeResult: 'incomplete',
    checks: fact({ any: ['has-alt'], all: [], none: [] }),
    locator: unavailable(), evidence: { elementKind: fact('img'), altState: unavailable() },
    incompleteReason: unavailable(),
  }];
  return checked<CompletedRun>({
    ...common(runId, mode), status: 'completed', finishedAt,
    scan: {
      context: context(), findings, scannerReviewObservations: observations,
      coverage: {
        'image-alt': {
          violations: findings.length || null, incomplete: observations.length || null,
          passes: null, inapplicable: findings.length || observations.length ? null : 0,
        },
        label: { violations: null, incomplete: null, passes: null, inapplicable: 0 },
        'color-contrast': { violations: null, incomplete: null, passes: null, inapplicable: 0 },
      },
    },
  }, 'completed');
}

export function failedRun(runId = 'run-01', mode: FixtureMode = 'local', cleanup: 'closed' | 'failed' = 'closed'): FailedRun {
  return checked<FailedRun>({
    ...runningRun(runId, mode), status: 'failed', finishedAt,
    scanContext: { ...runningRun(runId, mode).scanContext, cleanup },
    failure: { category: cleanup === 'failed' ? 'cleanup' : 'navigation' },
  }, 'failed');
}
