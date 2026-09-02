import type {
  AttributeState,
  FailureCategory,
  InputType,
  MessageKey,
  Rule,
  imageAnyChecks,
  labelAnyChecks,
} from './run-policy.ts';

export type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
export type Unavailable<R extends string = 'missing' | 'invalid' | 'withheld'> = {
  readonly unavailable: R;
};
export type Available<T> = { readonly value: T };
export type Fact<T> = Available<DeepReadonly<T>> | Unavailable;

export type ProviderContext =
  | { readonly mode: 'local'; readonly provider: 'ollama'; readonly model: 'qwen3.5:4b' }
  | { readonly mode: 'groq'; readonly provider: 'groq'; readonly model: 'openai/gpt-oss-20b' };

export type Checks<A extends string, N extends string> = {
  readonly any: readonly A[];
  readonly all: readonly [];
  readonly none: readonly N[];
};
export type Locator = Available<string> | Unavailable<'missing' | 'invalid' | 'withheld' | 'unsupported' | 'too-long'>;
export type ImageEvidence = {
  readonly elementKind: Fact<'img'>;
  readonly altState: Fact<AttributeState>;
};
export type NameSources = {
  readonly explicitLabel: Fact<boolean>;
  readonly implicitLabel: Fact<boolean>;
  readonly ariaLabel: Fact<AttributeState>;
  readonly ariaLabelledby: Fact<'absent' | 'empty' | 'unresolved' | 'partially-resolved' | 'resolved'>;
  readonly title: Fact<AttributeState>;
  readonly placeholder: Fact<AttributeState>;
  readonly presentationalRole: Fact<boolean>;
};
export type LabelEvidence = { readonly nameSources: NameSources } & (
  | { readonly elementKind: Available<'input'>; readonly inputType: Fact<InputType> }
  | { readonly elementKind: Available<'textarea'>; readonly inputType: Unavailable<'not-applicable'> }
  | { readonly elementKind: Unavailable; readonly inputType: Unavailable }
);
export type ContrastEvidence = {
  readonly foregroundColor: Fact<string>;
  readonly backgroundColor: Fact<string>;
  readonly shadowColor: Fact<string>;
  readonly contrastRatio: Fact<number>;
  readonly expectedContrastRatio: Fact<3 | 4.5>;
  readonly fontSize: Fact<string>;
  readonly fontWeight: Fact<'normal' | 'bold'>;
  readonly measurementSource: 'axe-core';
  readonly messageKey: Fact<MessageKey>;
};
export type RuleDetails =
  | { readonly ruleId: 'image-alt'; readonly checks: Fact<Checks<typeof imageAnyChecks[number], 'alt-space-value'>>; readonly evidence: ImageEvidence }
  | { readonly ruleId: 'label'; readonly checks: Fact<Checks<typeof labelAnyChecks[number], 'hidden-explicit-label'>>; readonly evidence: LabelEvidence }
  | { readonly ruleId: 'color-contrast'; readonly checks: Fact<Checks<'color-contrast', never>>; readonly evidence: ContrastEvidence };

export type Finding = RuleDetails & {
  readonly findingId: string;
  readonly nativeResult: 'violation';
  readonly state: 'unprocessed';
  readonly locator: Locator;
};
export type ScannerReviewObservation = { readonly nativeResult: 'incomplete'; readonly locator: Locator } & (
  | (Extract<RuleDetails, { ruleId: 'color-contrast' }> & { readonly incompleteReason: Fact<MessageKey> })
  | (Exclude<RuleDetails, { ruleId: 'color-contrast' }> & { readonly incompleteReason: Unavailable<'missing' | 'withheld'> })
);

export type ObservedFact = Available<string> | Unavailable<'missing' | 'invalid'>;
export type ScanContext = {
  readonly finalUrl: ObservedFact;
  readonly scannedAt: ObservedFact;
  readonly browserVersion: ObservedFact;
  readonly scannerVersion: '4.13.0';
  readonly evidencePolicyVersion: 'm1-public-v1';
  readonly rules: readonly ['image-alt', 'label', 'color-contrast'];
  readonly scope: 'current-rendered-top-level-document';
  readonly readiness: 'domcontentloaded' | 'load' | 'networkidle';
  readonly readinessReached: boolean;
  readonly viewport: { readonly width: number; readonly height: number };
  readonly locale: string;
  readonly timeoutMs: number;
  readonly freshContext: true;
  readonly importedState: false;
  readonly interaction: false;
  readonly crawling: false;
  readonly iframes: false;
  readonly cleanup: 'pending' | 'closed' | 'failed';
  readonly contrastProfile: 'axe-core-4.13.0-default';
};
export type CompleteScanContext = ScanContext & {
  readonly finalUrl: Available<string>;
  readonly scannedAt: Available<string>;
  readonly browserVersion: Available<string>;
  readonly readinessReached: true;
  readonly cleanup: 'closed';
};
export type RuleCoverage = {
  readonly violations: number | null;
  readonly incomplete: number | null;
  readonly passes: number | null;
  readonly inapplicable: number | null;
};
export type Coverage = { readonly [R in Rule]: RuleCoverage };
export type ScanResult = {
  readonly context: CompleteScanContext;
  readonly coverage: Coverage;
  readonly findings: readonly Finding[];
  readonly scannerReviewObservations: readonly ScannerReviewObservation[];
};
export type RunContext = {
  readonly formatVersion: 1;
  readonly runId: string;
  readonly createdAt: string;
  readonly applicationRevision: string;
  readonly requestedUrl: string;
  readonly providerContext: ProviderContext;
};
export type PageAnalysisRun = RunContext & (
  | { readonly status: 'running'; readonly scanContext: ScanContext & { readonly cleanup: 'pending' } }
  | { readonly status: 'failed'; readonly scanContext: ScanContext & { readonly cleanup: 'closed' | 'failed' }; readonly finishedAt: string; readonly failure: { readonly category: FailureCategory } }
  | { readonly status: 'completed'; readonly finishedAt: string; readonly scan: ScanResult }
);
export type ValidationResult<T> =
  | { readonly ok: true; readonly value: DeepReadonly<T> }
  | { readonly ok: false; readonly error: 'invalid-run' | 'invalid-scan' };
