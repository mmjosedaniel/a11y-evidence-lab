import type axe from 'axe-core';
import type { RunningRun } from '../persistence/run-repository.ts';

export const scanRules = Object.freeze(['image-alt', 'label', 'color-contrast'] as const);
export const nativeBuckets = Object.freeze(['violations', 'incomplete', 'passes', 'inapplicable'] as const);
export const scannerVersion = '4.13.0';
export const reporterId = 'm103-native-dom-v1';

const missing = () => ({ unavailable: 'missing' as const });

export function initialScanContext(): RunningRun['scanContext'] {
  return {
    finalUrl: missing(), scannedAt: missing(), browserVersion: missing(),
    scannerVersion, evidencePolicyVersion: 'm1-public-v1', rules: [...scanRules],
    scope: 'current-rendered-top-level-document', readiness: 'load', readinessReached: false,
    viewport: { width: 1280, height: 720 }, locale: 'en-US', timeoutMs: 10000,
    freshContext: true, importedState: false, interaction: false, crawling: false,
    iframes: false, cleanup: 'pending', contrastProfile: 'axe-core-4.13.0-default',
  };
}

export function nativeScanOptions(): axe.RunOptions {
  return {
    runOnly: { type: 'rule', values: [...scanRules] }, reporter: reporterId,
    resultTypes: [...nativeBuckets], selectors: true, ancestry: false, xpath: false,
    absolutePaths: false, elementRef: true, iframes: false,
  };
}
