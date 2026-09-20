import type { Rule } from '../domain/run-contract/run-policy.ts';
import type { CompleteScanContext } from '../domain/run-contract/run-types.ts';

export type ComparisonProfile = {
  readonly requestedUrl: string;
  readonly finalUrl: string;
  readonly rules: readonly Rule[];
  readonly viewport: { readonly width: number; readonly height: number };
  readonly locale: string;
  readonly browserVersion: string;
  readonly scannerVersion: string;
  readonly evidencePolicyVersion: string;
  readonly scope: string;
  readonly readiness: string;
  readonly freshContext: boolean;
  readonly importedState: boolean;
  readonly interaction: boolean;
  readonly crawling: boolean;
  readonly iframes: boolean;
  readonly contrastProfile: string | null;
};
export type PairMismatch =
  | 'requested-url' | 'final-url' | 'rule-profile' | 'viewport' | 'locale'
  | 'browser-version' | 'scanner-version' | 'evidence-policy' | 'document-scope'
  | 'readiness' | 'scan-context' | 'contrast-profile';

export function comparisonProfile(run: { readonly requestedUrl: string; readonly scan: { readonly context: CompleteScanContext } }, selectedRule: Rule): ComparisonProfile {
  const context = run.scan.context;
  return Object.freeze({
    requestedUrl: run.requestedUrl,
    finalUrl: context.finalUrl.value,
    rules: Object.freeze([...context.rules]),
    viewport: Object.freeze({ width: context.viewport.width, height: context.viewport.height }),
    locale: context.locale,
    browserVersion: context.browserVersion.value,
    scannerVersion: context.scannerVersion,
    evidencePolicyVersion: context.evidencePolicyVersion,
    scope: context.scope,
    readiness: context.readiness,
    freshContext: context.freshContext,
    importedState: context.importedState,
    interaction: context.interaction,
    crawling: context.crawling,
    iframes: context.iframes,
    contrastProfile: selectedRule === 'color-contrast' ? context.contrastProfile : null,
  });
}

export function compareScanProfiles(baseline: ComparisonProfile, later: ComparisonProfile): readonly PairMismatch[] {
  const mismatches: PairMismatch[] = [];
  if (baseline.requestedUrl !== later.requestedUrl) mismatches.push('requested-url');
  if (baseline.finalUrl !== later.finalUrl) mismatches.push('final-url');
  if (baseline.rules.length !== later.rules.length || baseline.rules.some((rule, index) => rule !== later.rules[index])) {
    mismatches.push('rule-profile');
  }
  if (baseline.viewport.width !== later.viewport.width || baseline.viewport.height !== later.viewport.height) mismatches.push('viewport');
  if (baseline.locale !== later.locale) mismatches.push('locale');
  if (baseline.browserVersion !== later.browserVersion) mismatches.push('browser-version');
  if (baseline.scannerVersion !== later.scannerVersion) mismatches.push('scanner-version');
  if (baseline.evidencePolicyVersion !== later.evidencePolicyVersion) mismatches.push('evidence-policy');
  if (baseline.scope !== later.scope) mismatches.push('document-scope');
  if (baseline.readiness !== later.readiness) mismatches.push('readiness');
  if (baseline.freshContext !== later.freshContext || baseline.importedState !== later.importedState
    || baseline.interaction !== later.interaction || baseline.crawling !== later.crawling || baseline.iframes !== later.iframes) {
    mismatches.push('scan-context');
  }
  if (baseline.contrastProfile !== later.contrastProfile) mismatches.push('contrast-profile');
  return Object.freeze(mismatches);
}
