type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
type Unavailable<R extends string = 'missing' | 'invalid' | 'withheld'> = {
  readonly unavailable: R;
};
type Available<T> = { readonly value: T };
export type Fact<T> = Available<DeepReadonly<T>> | Unavailable;

export type ProviderContext =
  | { readonly mode: 'local'; readonly provider: 'ollama'; readonly model: 'qwen3.5:4b' }
  | { readonly mode: 'groq'; readonly provider: 'groq'; readonly model: 'openai/gpt-oss-20b' };

const rules = ['image-alt', 'label', 'color-contrast'] as const;
type Rule = typeof rules[number];
const ordinaryReasons = ['missing', 'invalid', 'withheld'] as const;
const attributeStates = ['absent', 'empty', 'whitespace-only', 'non-empty'] as const;
type AttributeState = typeof attributeStates[number];
const inputTypes = [
  'button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
  'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search',
  'submit', 'tel', 'text', 'time', 'url', 'week',
] as const;
type InputType = typeof inputTypes[number];
const messageKeys = [
  'nonBmp', 'pseudoContent', 'complexTextShadows', 'colorParse', 'equalRatio',
  'shortTextContent', 'shadowOnBgColor', 'fgOnShadowColor', 'imgNode', 'bgGradient',
  'bgImage', 'bgOverlap', 'elmPartiallyObscuring', 'elmPartiallyObscured', 'outsideViewport',
] as const;
type MessageKey = typeof messageKeys[number];
const failureCategories = [
  'navigation', 'timeout', 'browser', 'scanner', 'result-validation',
  'coverage-validation', 'evidence-capture', 'initial-persistence', 'shutdown', 'cleanup',
] as const;
type FailureCategory = typeof failureCategories[number];

const imageAnyChecks = ['has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title', 'presentational-role'] as const;
const labelAnyChecks = ['implicit-label', 'explicit-label', 'aria-label', 'aria-labelledby', 'non-empty-title', 'non-empty-placeholder', 'presentational-role'] as const;
type Checks<A extends string, N extends string> = {
  readonly any: readonly A[];
  readonly all: readonly [];
  readonly none: readonly N[];
};
type Locator = Available<string> | Unavailable<'missing' | 'invalid' | 'withheld' | 'unsupported' | 'too-long'>;
type ImageEvidence = {
  readonly elementKind: Fact<'img'>;
  readonly altState: Fact<AttributeState>;
};
type NameSources = {
  readonly explicitLabel: Fact<boolean>;
  readonly implicitLabel: Fact<boolean>;
  readonly ariaLabel: Fact<AttributeState>;
  readonly ariaLabelledby: Fact<'absent' | 'empty' | 'unresolved' | 'partially-resolved' | 'resolved'>;
  readonly title: Fact<AttributeState>;
  readonly placeholder: Fact<AttributeState>;
  readonly presentationalRole: Fact<boolean>;
};
type LabelEvidence = { readonly nameSources: NameSources } & (
  | { readonly elementKind: Available<'input'>; readonly inputType: Fact<InputType> }
  | { readonly elementKind: Available<'textarea'>; readonly inputType: Unavailable<'not-applicable'> }
  | { readonly elementKind: Unavailable; readonly inputType: Unavailable }
);
type ContrastEvidence = {
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
type RuleDetails =
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

type ObservedFact = Available<string> | Unavailable<'missing' | 'invalid'>;
type ScanContext = {
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
type CompleteScanContext = ScanContext & {
  readonly finalUrl: Available<string>;
  readonly scannedAt: Available<string>;
  readonly browserVersion: Available<string>;
  readonly readinessReached: true;
  readonly cleanup: 'closed';
};
type RuleCoverage = {
  readonly violations: number | null;
  readonly incomplete: number | null;
  readonly passes: number | null;
  readonly inapplicable: number | null;
};
type Coverage = { readonly [R in Rule]: RuleCoverage };
export type ScanResult = {
  readonly context: CompleteScanContext;
  readonly coverage: Coverage;
  readonly findings: readonly Finding[];
  readonly scannerReviewObservations: readonly ScannerReviewObservation[];
};
type RunContext = {
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

function requireValid(condition: unknown): asserts condition {
  if (!condition) throw new Error('Invalid contract');
}

// Read descriptors once: never invoke accessors or copy values through Proxy get traps.
function readObject(input: unknown, keys?: readonly string[]): Record<string, unknown> {
  requireValid(typeof input === 'object' && input !== null && !Array.isArray(input));
  const prototype = Object.getPrototypeOf(input);
  requireValid(prototype === Object.prototype || prototype === null);
  const result: Record<string, unknown> = Object.create(null);
  for (const key of Reflect.ownKeys(input)) {
    requireValid(typeof key === 'string');
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    requireValid(descriptor && descriptor.enumerable && 'value' in descriptor);
    result[key] = descriptor.value;
  }
  if (keys) requireKeys(result, keys);
  return result;
}

function requireKeys(record: Record<string, unknown>, keys: readonly string[]): void {
  requireValid(Object.keys(record).length === keys.length && keys.every(key => Object.hasOwn(record, key)));
}

function readArray<T>(input: unknown, readItem: (item: unknown) => T): readonly T[] {
  requireValid(Array.isArray(input) && Object.getPrototypeOf(input) === Array.prototype);
  const length = Object.getOwnPropertyDescriptor(input, 'length');
  requireValid(length && !length.enumerable && 'value' in length);
  const count = readInteger(length.value, 0);
  const keys = new Set(Reflect.ownKeys(input));
  requireValid(keys.size === count + 1 && keys.has('length'));
  const result: T[] = [];
  for (let index = 0; index < count; index++) {
    requireValid(keys.has(String(index)));
    const descriptor = Object.getOwnPropertyDescriptor(input, String(index));
    requireValid(descriptor && descriptor.enumerable && 'value' in descriptor);
    result.push(readItem(descriptor.value));
  }
  return Object.freeze(result);
}

function readChoice<const T extends readonly (string | number | boolean)[]>(input: unknown, choices: T): T[number] {
  requireValid(choices.some(choice => Object.is(choice, input)));
  return input as T[number];
}

function readBoolean(input: unknown): boolean {
  requireValid(typeof input === 'boolean');
  return input;
}

function readNumber(input: unknown): number {
  requireValid(typeof input === 'number' && Number.isFinite(input) && !Object.is(input, -0));
  return input;
}

function readInteger(input: unknown, minimum: number): number {
  const value = readNumber(input);
  requireValid(Number.isSafeInteger(value) && value >= minimum);
  return value;
}

function readPattern(input: unknown, pattern: RegExp, maximum = Infinity): string {
  requireValid(typeof input === 'string' && input.length <= maximum);
  requireValid(pattern.exec(input)?.[0] === input);
  return input;
}

function readId(input: unknown): string {
  return readPattern(input, /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/);
}

function readTime(input: unknown): string {
  const value = readPattern(input, /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/);
  requireValid(new Date(value).toISOString() === value);
  return value;
}

function readUrl(input: unknown): string {
  requireValid(typeof input === 'string');
  const url = new URL(input);
  requireValid(url.href === input && url.protocol === 'https:' && url.hostname !== '' && url.username === '' && url.password === '');
  return input;
}

function readLocale(input: unknown): string {
  requireValid(typeof input === 'string' && input.length <= 64);
  const locales = Intl.getCanonicalLocales(input);
  requireValid(locales.length === 1 && locales[0] === input);
  return input;
}

function readFact<T>(input: unknown, readValue: (input: unknown) => T): Available<T> | Unavailable;
function readFact<T, const R extends readonly string[]>(
  input: unknown, readValue: (input: unknown) => T, reasons: R,
): Available<T> | Unavailable<R[number]>;
function readFact<T>(
  input: unknown, readValue: (input: unknown) => T, reasons: readonly string[] = ordinaryReasons,
): Available<T> | Unavailable<string> {
  const record = readObject(input);
  if (Object.hasOwn(record, 'value')) {
    requireKeys(record, ['value']);
    return Object.freeze({ value: readValue(record.value) });
  }
  requireKeys(record, ['unavailable']);
  return Object.freeze({ unavailable: readChoice(record.unavailable, reasons) });
}

function readUnavailable<const R extends readonly string[]>(input: unknown, reasons: R): Unavailable<R[number]> {
  const record = readObject(input, ['unavailable']);
  return Object.freeze({ unavailable: readChoice(record.unavailable, reasons) });
}

function readLocator(input: unknown): Locator {
  return readFact(input, value => {
    const locator = readPattern(value, /^:root(?: > :nth-child\([1-9][0-9]*\))*$/, 2048);
    for (const match of locator.matchAll(/:nth-child\(([0-9]+)\)/g)) readInteger(Number(match[1]), 1);
    return locator;
  }, ['missing', 'invalid', 'withheld', 'unsupported', 'too-long']);
}

function readChecks<const A extends readonly string[], const N extends readonly string[]>(
  input: unknown, anyIds: A, noneIds: N,
): Available<Checks<A[number], N[number]>> | Unavailable {
  return readFact(input, value => {
    const record = readObject(value, ['any', 'all', 'none']);
    const any = readArray(record.any, item => readChoice(item, anyIds));
    const all = readArray(record.all, () => { throw new Error('Invalid contract'); });
    const none = readArray(record.none, item => readChoice(item, noneIds));
    requireValid(any.length + none.length > 0 && new Set(any).size === any.length && new Set(none).size === none.length);
    requireValid(all.length === 0);
    return Object.freeze({ any, all: Object.freeze([]) as readonly [], none });
  });
}

function readImageEvidence(input: unknown): ImageEvidence {
  const record = readObject(input, ['elementKind', 'altState']);
  return Object.freeze({
    elementKind: readFact(record.elementKind, value => readChoice(value, ['img'])),
    altState: readFact(record.altState, value => readChoice(value, attributeStates)),
  });
}

function readLabelEvidence(input: unknown): LabelEvidence {
  const record = readObject(input, ['elementKind', 'inputType', 'nameSources']);
  const sources = readObject(record.nameSources, ['explicitLabel', 'implicitLabel', 'ariaLabel', 'ariaLabelledby', 'title', 'placeholder', 'presentationalRole']);
  const nameSources = Object.freeze({
    explicitLabel: readFact(sources.explicitLabel, readBoolean),
    implicitLabel: readFact(sources.implicitLabel, readBoolean),
    ariaLabel: readFact(sources.ariaLabel, value => readChoice(value, attributeStates)),
    ariaLabelledby: readFact(sources.ariaLabelledby, value => readChoice(value, ['absent', 'empty', 'unresolved', 'partially-resolved', 'resolved'])),
    title: readFact(sources.title, value => readChoice(value, attributeStates)),
    placeholder: readFact(sources.placeholder, value => readChoice(value, attributeStates)),
    presentationalRole: readFact(sources.presentationalRole, readBoolean),
  });
  const elementKind = readFact(record.elementKind, value => readChoice(value, ['input', 'textarea']));
  if ('unavailable' in elementKind) {
    return Object.freeze({ elementKind, inputType: readUnavailable(record.inputType, ordinaryReasons), nameSources });
  }
  if (elementKind.value === 'textarea') {
    return Object.freeze({ elementKind: Object.freeze({ value: 'textarea' }), inputType: readUnavailable(record.inputType, ['not-applicable']), nameSources });
  }
  return Object.freeze({ elementKind: Object.freeze({ value: 'input' }), inputType: readFact(record.inputType, value => readChoice(value, inputTypes)), nameSources });
}

function readFontSize(input: unknown): string {
  const value = readPattern(input, /^([0-9]+\.[0-9])pt \(([0-9]+(?:\.[0-9]+)?)px\)$/, 64);
  const components = /^([0-9]+\.[0-9])pt \(([0-9]+(?:\.[0-9]+)?)px\)$/.exec(value)!;
  requireValid(readNumber(Number(components[1])) >= 0 && readNumber(Number(components[2])) > 0);
  return value;
}

function readContrastEvidence(input: unknown): ContrastEvidence {
  const record = readObject(input, ['foregroundColor', 'backgroundColor', 'shadowColor', 'contrastRatio', 'expectedContrastRatio', 'fontSize', 'fontWeight', 'measurementSource', 'messageKey']);
  const color = (value: unknown) => readPattern(value, /^#[0-9a-f]{6}$/);
  return Object.freeze({
    foregroundColor: readFact(record.foregroundColor, color),
    backgroundColor: readFact(record.backgroundColor, color),
    shadowColor: readFact(record.shadowColor, color),
    contrastRatio: readFact(record.contrastRatio, value => {
      const ratio = readNumber(value);
      requireValid(ratio >= 1 && ratio <= 21);
      return ratio;
    }),
    expectedContrastRatio: readFact(record.expectedContrastRatio, value => readChoice(value, [3, 4.5])),
    fontSize: readFact(record.fontSize, readFontSize),
    fontWeight: readFact(record.fontWeight, value => readChoice(value, ['normal', 'bold'])),
    measurementSource: readChoice(record.measurementSource, ['axe-core']),
    messageKey: readFact(record.messageKey, value => readChoice(value, messageKeys)),
  });
}

function readRuleDetails(record: Record<string, unknown>): RuleDetails {
  const ruleId = readChoice(record.ruleId, rules);
  switch (ruleId) {
    case 'image-alt': return { ruleId, checks: readChecks(record.checks, imageAnyChecks, ['alt-space-value']), evidence: readImageEvidence(record.evidence) };
    case 'label': return { ruleId, checks: readChecks(record.checks, labelAnyChecks, ['hidden-explicit-label']), evidence: readLabelEvidence(record.evidence) };
    case 'color-contrast': return { ruleId, checks: readChecks(record.checks, ['color-contrast'], []), evidence: readContrastEvidence(record.evidence) };
  }
}

function readFinding(input: unknown): Finding {
  const record = readObject(input, ['findingId', 'ruleId', 'nativeResult', 'state', 'checks', 'locator', 'evidence']);
  return Object.freeze({
    ...readRuleDetails(record), findingId: readId(record.findingId),
    nativeResult: readChoice(record.nativeResult, ['violation']),
    state: readChoice(record.state, ['unprocessed']), locator: readLocator(record.locator),
  });
}

function readObservation(input: unknown): ScannerReviewObservation {
  const record = readObject(input, ['ruleId', 'nativeResult', 'checks', 'locator', 'evidence', 'incompleteReason']);
  const details = readRuleDetails(record);
  const nativeResult = readChoice(record.nativeResult, ['incomplete']);
  const locator = readLocator(record.locator);
  if (details.ruleId === 'color-contrast') {
    const incompleteReason = readFact(record.incompleteReason, value => readChoice(value, messageKeys));
    const messageKey = details.evidence.messageKey;
    requireValid('value' in incompleteReason
      ? 'value' in messageKey && incompleteReason.value === messageKey.value
      : 'unavailable' in messageKey && incompleteReason.unavailable === messageKey.unavailable);
    return Object.freeze({ ...details, nativeResult, locator, incompleteReason });
  }
  return Object.freeze({ ...details, nativeResult, locator, incompleteReason: readUnavailable(record.incompleteReason, ['missing', 'withheld']) });
}

function readContext(input: unknown): ScanContext {
  const record = readObject(input, ['finalUrl', 'scannedAt', 'browserVersion', 'scannerVersion', 'evidencePolicyVersion', 'rules', 'scope', 'readiness', 'readinessReached', 'viewport', 'locale', 'timeoutMs', 'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'cleanup', 'contrastProfile']);
  const observedReasons = ['missing', 'invalid'] as const;
  const scannedAt = readFact(record.scannedAt, readTime, observedReasons);
  const readinessReached = readBoolean(record.readinessReached);
  requireValid(!('value' in scannedAt) || readinessReached);
  const configuredRules = readArray(record.rules, item => readChoice(item, rules));
  requireValid(configuredRules.length === rules.length && configuredRules.every((rule, index) => rule === rules[index]));
  const viewport = readObject(record.viewport, ['width', 'height']);
  return Object.freeze({
    finalUrl: readFact(record.finalUrl, readUrl, observedReasons), scannedAt,
    browserVersion: readFact(record.browserVersion, value => readPattern(value, /^[0-9]+(?:\.[0-9]+){0,3}$/, 64), observedReasons),
    scannerVersion: readChoice(record.scannerVersion, ['4.13.0']),
    evidencePolicyVersion: readChoice(record.evidencePolicyVersion, ['m1-public-v1']),
    rules: Object.freeze([configuredRules[0], configuredRules[1], configuredRules[2]]) as ScanContext['rules'],
    scope: readChoice(record.scope, ['current-rendered-top-level-document']),
    readiness: readChoice(record.readiness, ['domcontentloaded', 'load', 'networkidle']), readinessReached,
    viewport: Object.freeze({ width: readInteger(viewport.width, 1), height: readInteger(viewport.height, 1) }),
    locale: readLocale(record.locale), timeoutMs: readInteger(record.timeoutMs, 1),
    freshContext: readChoice(record.freshContext, [true]), importedState: readChoice(record.importedState, [false]),
    interaction: readChoice(record.interaction, [false]), crawling: readChoice(record.crawling, [false]),
    iframes: readChoice(record.iframes, [false]), cleanup: readChoice(record.cleanup, ['pending', 'closed', 'failed']),
    contrastProfile: readChoice(record.contrastProfile, ['axe-core-4.13.0-default']),
  });
}

function requireCompleteContext(context: ScanContext): asserts context is CompleteScanContext {
  requireValid('value' in context.finalUrl && 'value' in context.scannedAt && 'value' in context.browserVersion && context.readinessReached && context.cleanup === 'closed');
}

function readRuleCoverage(input: unknown, findingCount: number, observationCount: number): RuleCoverage {
  const record = readObject(input, ['violations', 'incomplete', 'passes', 'inapplicable']);
  const violations = record.violations === null ? null : readInteger(record.violations, 1);
  const incomplete = record.incomplete === null ? null : readInteger(record.incomplete, 1);
  const passes = record.passes === null ? null : readInteger(record.passes, 1);
  const inapplicable = record.inapplicable === null ? null : readInteger(record.inapplicable, 0);
  requireValid(violations !== null || incomplete !== null || passes !== null || inapplicable !== null);
  requireValid(inapplicable !== 0 || (violations === null && incomplete === null && passes === null));
  requireValid((violations ?? 0) === findingCount && (incomplete ?? 0) === observationCount);
  return Object.freeze({ violations, incomplete, passes, inapplicable });
}

function readScan(input: unknown): ScanResult {
  const record = readObject(input, ['context', 'coverage', 'findings', 'scannerReviewObservations']);
  const context = readContext(record.context);
  requireCompleteContext(context);
  const findings = readArray(record.findings, readFinding);
  const scannerReviewObservations = readArray(record.scannerReviewObservations, readObservation);
  requireValid(new Set(findings.map(finding => finding.findingId)).size === findings.length);
  const coverage = readObject(record.coverage, rules);
  const forRule = (rule: Rule) => readRuleCoverage(coverage[rule],
    findings.filter(finding => finding.ruleId === rule).length,
    scannerReviewObservations.filter(observation => observation.ruleId === rule).length);
  return Object.freeze({
    context, coverage: Object.freeze({ 'image-alt': forRule('image-alt'), label: forRule('label'), 'color-contrast': forRule('color-contrast') }),
    findings, scannerReviewObservations,
  });
}

function readProvider(input: unknown): ProviderContext {
  const record = readObject(input, ['mode', 'provider', 'model']);
  if (record.mode === 'local') {
    return Object.freeze({ mode: 'local', provider: readChoice(record.provider, ['ollama']), model: readChoice(record.model, ['qwen3.5:4b']) });
  }
  return Object.freeze({ mode: readChoice(record.mode, ['groq']), provider: readChoice(record.provider, ['groq']), model: readChoice(record.model, ['openai/gpt-oss-20b']) });
}

function requireChronology(createdAt: string, context: ScanContext, finishedAt?: string): void {
  // Canonical four-digit UTC timestamps sort in instant order, including year zero.
  if (finishedAt !== undefined) requireValid(createdAt <= finishedAt);
  if ('value' in context.scannedAt) {
    requireValid(createdAt <= context.scannedAt.value);
    if (finishedAt !== undefined) requireValid(context.scannedAt.value <= finishedAt);
  }
}

function readRun(input: unknown): PageAnalysisRun {
  const record = readObject(input);
  const commonKeys = ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl', 'providerContext', 'status'];
  const status = readChoice(record.status, ['running', 'completed', 'failed']);
  requireKeys(record, [...commonKeys, ...(status === 'running' ? ['scanContext'] : status === 'completed' ? ['finishedAt', 'scan'] : ['scanContext', 'finishedAt', 'failure'])]);
  const common: RunContext = {
    formatVersion: readChoice(record.formatVersion, [1]), runId: readId(record.runId),
    createdAt: readTime(record.createdAt), applicationRevision: readPattern(record.applicationRevision, /^[0-9a-f]{40}$/),
    requestedUrl: readUrl(record.requestedUrl), providerContext: readProvider(record.providerContext),
  };
  if (status === 'completed') {
    const finishedAt = readTime(record.finishedAt);
    const scan = readScan(record.scan);
    requireChronology(common.createdAt, scan.context, finishedAt);
    return Object.freeze({ ...common, status, finishedAt, scan });
  }
  const context = readContext(record.scanContext);
  if (status === 'running') {
    requireValid(context.cleanup === 'pending');
    requireChronology(common.createdAt, context);
    return Object.freeze({ ...common, status, scanContext: Object.freeze({ ...context, cleanup: context.cleanup }) });
  }
  requireValid(context.cleanup === 'closed' || context.cleanup === 'failed');
  const finishedAt = readTime(record.finishedAt);
  const failure = readObject(record.failure, ['category']);
  const category = readChoice(failure.category, failureCategories);
  if (category === 'cleanup') requireValid(context.cleanup === 'failed');
  if (category === 'initial-persistence') requireCompleteContext(context);
  requireChronology(common.createdAt, context, finishedAt);
  return Object.freeze({ ...common, status, finishedAt, scanContext: Object.freeze({ ...context, cleanup: context.cleanup }), failure: Object.freeze({ category }) });
}

export function validateRun(input: unknown): ValidationResult<PageAnalysisRun> {
  try {
    return Object.freeze({ ok: true, value: readRun(input) });
  } catch {
    return Object.freeze({ ok: false, error: 'invalid-run' });
  }
}

export function validateScan(input: unknown): ValidationResult<ScanResult> {
  try {
    return Object.freeze({ ok: true, value: readScan(input) });
  } catch {
    return Object.freeze({ ok: false, error: 'invalid-scan' });
  }
}
