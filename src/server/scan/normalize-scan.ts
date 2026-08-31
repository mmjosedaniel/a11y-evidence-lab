import crypto from 'node:crypto';
import type { Finding, ScanResult, ScannerReviewObservation } from '../domain/run-contract.ts';

type ScanCollection = Pick<ScanResult, 'coverage' | 'findings' | 'scannerReviewObservations'>;
export type NormalizationResult =
  | { readonly ok: true; readonly value: ScanCollection }
  | { readonly ok: false; readonly error: 'scanner' | 'result-validation' | 'coverage-validation' | 'evidence-capture' };
type Unavailable<R extends string = 'missing' | 'invalid' | 'withheld'> = { readonly unavailable: R };
type Fact<T, R extends string = 'missing' | 'invalid' | 'withheld'> = { readonly value: T } | Unavailable<R>;
type Source<T = unknown> = Fact<T, 'missing' | 'invalid'>;
type Rule = Finding['ruleId'];
type Details = { [R in Rule]: Pick<Extract<Finding, { ruleId: R }>, 'ruleId' | 'checks' | 'evidence'> }[Rule];
const rules = ['image-alt', 'label', 'color-contrast'] as const;
const buckets = ['violations', 'incomplete', 'passes', 'inapplicable'] as const;
const ordinaryReasons = ['missing', 'invalid', 'withheld'] as const;
const attributeStates = ['absent', 'empty', 'whitespace-only', 'non-empty'] as const;
const inputTypes = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
  'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'] as const;
const messageKeys = ['nonBmp', 'pseudoContent', 'complexTextShadows', 'colorParse', 'equalRatio',
  'shortTextContent', 'shadowOnBgColor', 'fgOnShadowColor', 'imgNode', 'bgGradient', 'bgImage',
  'bgOverlap', 'elmPartiallyObscuring', 'elmPartiallyObscured', 'outsideViewport'] as const;
const imageChecks = ['has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title', 'presentational-role'] as const;
const labelChecks = ['implicit-label', 'explicit-label', 'aria-label', 'aria-labelledby', 'non-empty-title', 'non-empty-placeholder', 'presentational-role'] as const;

function requireValid(condition: unknown): asserts condition {
  if (!condition) throw new Error('Invalid native structure');
}

function record(input: unknown): object {
  requireValid(typeof input === 'object' && input !== null && !Array.isArray(input));
  const prototype = Object.getPrototypeOf(input);
  requireValid(prototype === Object.prototype || prototype === null);
  Reflect.ownKeys(input);
  return input;
}

// Only inspect consumed own data properties. Opaque native fields stay untouched.
function own(input: object, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(input, key);
  if (!descriptor) return undefined;
  requireValid(descriptor.enumerable && 'value' in descriptor);
  return descriptor.value;
}

function exactKeys(input: object, expected: readonly string[]): void {
  const keys = Reflect.ownKeys(input);
  requireValid(keys.length === expected.length && expected.every(key => keys.includes(key)));
}

function denseArray(input: unknown): unknown[] {
  requireValid(Array.isArray(input) && Object.getPrototypeOf(input) === Array.prototype);
  const descriptor = Object.getOwnPropertyDescriptor(input, 'length');
  requireValid(descriptor && !descriptor.enumerable && 'value' in descriptor);
  const length: unknown = descriptor.value;
  requireValid(typeof length === 'number' && Number.isSafeInteger(length) && length >= 0);
  const keys = new Set(Reflect.ownKeys(input));
  requireValid(keys.size === length + 1 && keys.has('length'));
  const values: unknown[] = [];
  for (let index = 0; index < length; index++) {
    requireValid(keys.has(String(index)));
    values.push(own(input, String(index)));
  }
  return values;
}

function choice<const T extends readonly (string | number | boolean)[]>(input: unknown, values: T): T[number] {
  requireValid(values.some(value => Object.is(value, input)));
  return input as T[number];
}

function unavailable<const R extends string>(reason: R): Unavailable<R> {
  return Object.freeze({ unavailable: reason });
}

function available<const T>(value: T): { readonly value: T } {
  return Object.freeze({ value });
}

function field(container: Source<object>, key: string): Source {
  if ('unavailable' in container) return container;
  try {
    const value = own(container.value, key);
    return value === undefined ? unavailable('missing') : available(value);
  } catch {
    return unavailable('invalid');
  }
}

function container(source: Source, nullIsMissing = false): Source<object> {
  if ('unavailable' in source) return source;
  if (nullIsMissing && source.value === null) return unavailable('missing');
  try {
    return available(record(source.value));
  } catch {
    return unavailable('invalid');
  }
}

function capturedFact<T>(source: Source, read: (value: unknown) => T): Fact<T>;
function capturedFact<T, const R extends readonly string[]>(
  source: Source, read: (value: unknown) => T, reasons: R,
): Fact<T, R[number] | 'missing' | 'invalid'>;
function capturedFact<T>(
  source: Source, read: (value: unknown) => T, reasons: readonly string[] = ordinaryReasons,
): Fact<T, string> {
  if ('unavailable' in source) return source;
  try {
    const value = record(source.value);
    const hasValue = Object.hasOwn(value, 'value');
    const hasReason = Object.hasOwn(value, 'unavailable');
    requireValid(hasValue !== hasReason);
    return hasValue ? available(read(own(value, 'value'))) : unavailable(choice(own(value, 'unavailable'), reasons));
  } catch {
    return unavailable('invalid');
  }
}

function pattern(input: unknown, expression: RegExp, maximum = Infinity): string {
  requireValid(typeof input === 'string' && input.length <= maximum && expression.exec(input)?.[0] === input);
  return input;
}

function locator(source: Source): Finding['locator'] {
  return capturedFact(source, value => {
    const text = pattern(value, /^:root(?: > :nth-child\([1-9][0-9]*\))*$/, 2048);
    for (const match of text.matchAll(/:nth-child\(([0-9]+)\)/g)) requireValid(Number.isSafeInteger(Number(match[1])));
    return text;
  }, ['missing', 'invalid', 'withheld', 'unsupported', 'too-long']);
}

type NativeCheck = { readonly id: string; readonly source: object };
type Groups = { readonly any: Source<readonly NativeCheck[]>; readonly all: Source<readonly NativeCheck[]>; readonly none: Source<readonly NativeCheck[]> };

function checkGroup(node: object, key: string): Source<readonly NativeCheck[]> {
  const source = field(available(node), key);
  if ('unavailable' in source) return source;
  if (source.value === null) return unavailable('missing');
  try {
    return available(denseArray(source.value).map(value => {
      const source = record(value);
      const id = own(source, 'id');
      requireValid(typeof id === 'string');
      return { id, source };
    }));
  } catch {
    return unavailable('invalid');
  }
}

function checks<const A extends readonly string[], const N extends readonly string[]>(
  groups: Groups, anyIds: A, noneIds: N,
): Fact<{ readonly any: readonly A[number][]; readonly all: readonly []; readonly none: readonly N[number][] }> {
  let missing = false;
  let invalid = false;
  const read = <const T extends readonly string[]>(group: Source<readonly NativeCheck[]>, ids: T): readonly T[number][] => {
    if ('unavailable' in group) {
      if (group.unavailable === 'invalid') invalid = true;
      else missing = true;
      return [];
    }
    try {
      const values = group.value.map(check => choice(check.id, ids));
      if (new Set(values).size !== values.length) invalid = true;
      return Object.freeze(values);
    } catch {
      invalid = true;
      return [];
    }
  };
  const any = read(groups.any, anyIds);
  read(groups.all, [] as const);
  const none = read(groups.none, noneIds);
  if (invalid || (!missing && any.length + none.length === 0)) return unavailable('invalid');
  if (missing) return unavailable('missing');
  return available(Object.freeze({ any, all: Object.freeze([]) as readonly [], none }));
}

function imageEvidence(source: Source<object>): Extract<Details, { ruleId: 'image-alt' }>['evidence'] {
  return Object.freeze({
    elementKind: capturedFact(field(source, 'elementKind'), value => choice(value, ['img'])),
    altState: capturedFact(field(source, 'altState'), value => choice(value, attributeStates)),
  });
}

function labelEvidence(source: Source<object>): Extract<Details, { ruleId: 'label' }>['evidence'] {
  const names = container(field(source, 'nameSources'));
  const boolean = (value: unknown) => choice(value, [true, false]);
  const attribute = (value: unknown) => choice(value, attributeStates);
  const nameSources = Object.freeze({
    explicitLabel: capturedFact(field(names, 'explicitLabel'), boolean),
    implicitLabel: capturedFact(field(names, 'implicitLabel'), boolean),
    ariaLabel: capturedFact(field(names, 'ariaLabel'), attribute),
    ariaLabelledby: capturedFact(field(names, 'ariaLabelledby'), value => choice(value, ['absent', 'empty', 'unresolved', 'partially-resolved', 'resolved'])),
    title: capturedFact(field(names, 'title'), attribute),
    placeholder: capturedFact(field(names, 'placeholder'), attribute),
    presentationalRole: capturedFact(field(names, 'presentationalRole'), boolean),
  });
  const elementKind = capturedFact(field(source, 'elementKind'), value => choice(value, ['input', 'textarea']));
  const inputType = capturedFact(field(source, 'inputType'), value => choice(value, inputTypes));
  if ('unavailable' in elementKind) {
    return Object.freeze({ elementKind, inputType: 'unavailable' in inputType ? inputType : unavailable('invalid'), nameSources });
  }
  if (elementKind.value === 'textarea') {
    return Object.freeze({ elementKind: available('textarea'), inputType: unavailable('not-applicable'), nameSources });
  }
  return Object.freeze({ elementKind: available('input'), inputType, nameSources });
}

function contrastSource(group: Groups['any']): Source<object> {
  if ('unavailable' in group) return group;
  const matching = group.value.filter(check => check.id === 'color-contrast');
  if (matching.length === 0) return unavailable('missing');
  if (matching.length !== 1) return unavailable('invalid');
  return container(field(available(matching[0].source), 'data'), true);
}

function measurement<T>(data: Source<object>, key: string, read: (value: unknown) => T): Fact<T> {
  const source = field(data, key);
  if ('unavailable' in source) return source;
  try {
    return available(read(source.value));
  } catch {
    return unavailable('invalid');
  }
}

function contrastEvidence(groups: Groups): Extract<Details, { ruleId: 'color-contrast' }>['evidence'] {
  const data = contrastSource(groups.any);
  const color = (value: unknown) => pattern(value, /^#[0-9a-f]{6}$/);
  const keySource = field(data, 'messageKey');
  let messageKey: Extract<Details, { ruleId: 'color-contrast' }>['evidence']['messageKey'];
  if ('unavailable' in keySource) messageKey = keySource;
  else if (keySource.value === null) messageKey = unavailable('missing');
  else if (typeof keySource.value !== 'string') messageKey = unavailable('invalid');
  else {
    try { messageKey = available(choice(keySource.value, messageKeys)); }
    catch { messageKey = unavailable('withheld'); }
  }
  return Object.freeze({
    foregroundColor: measurement(data, 'fgColor', color),
    backgroundColor: measurement(data, 'bgColor', color),
    shadowColor: measurement(data, 'shadowColor', color),
    contrastRatio: measurement(data, 'contrastRatio', value => {
      requireValid(typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 21);
      return value;
    }),
    expectedContrastRatio: measurement(data, 'expectedContrastRatio', value => choice(value, ['3:1', '4.5:1']) === '3:1' ? 3 : 4.5),
    fontSize: measurement(data, 'fontSize', value => {
      const text = pattern(value, /^([0-9]+\.[0-9])pt \(([0-9]+(?:\.[0-9]+)?)px\)$/, 64);
      const parts = /^([0-9]+\.[0-9])pt \(([0-9]+(?:\.[0-9]+)?)px\)$/.exec(text)!;
      requireValid(Number.isFinite(Number(parts[1])) && Number(parts[1]) >= 0 && Number.isFinite(Number(parts[2])) && Number(parts[2]) > 0);
      return text;
    }),
    fontWeight: measurement(data, 'fontWeight', value => choice(value, ['normal', 'bold'])),
    measurementSource: 'axe-core', messageKey,
  });
}

function proseReason(node: object): Unavailable<'missing' | 'withheld'> {
  const nonempty = (source: Source) => 'value' in source && typeof source.value === 'string' && source.value.length > 0;
  if (nonempty(field(available(node), 'failureSummary'))) return unavailable('withheld');
  // Message presence is independent of the check's ID validity.
  for (const key of ['any', 'all', 'none']) {
    const group = field(available(node), key);
    if ('unavailable' in group) continue;
    let entries: unknown[];
    try { entries = denseArray(group.value); }
    catch { continue; }
    if (entries.some(check => nonempty(field(container(available(check)), 'message')))) return unavailable('withheld');
  }
  return unavailable('missing');
}

function projectNode(ruleId: Rule, node: object): { details: Details; locator: Finding['locator']; reason: Unavailable<'missing' | 'withheld'> } {
  const captured = record(own(node, 'capturedDom'));
  const capturedSource = available(captured);
  const groups: Groups = { any: checkGroup(node, 'any'), all: checkGroup(node, 'all'), none: checkGroup(node, 'none') };
  let details: Details;
  if (ruleId === 'image-alt') details = { ruleId, checks: checks(groups, imageChecks, ['alt-space-value']), evidence: imageEvidence(container(field(capturedSource, 'evidence'))) };
  else if (ruleId === 'label') details = { ruleId, checks: checks(groups, labelChecks, ['hidden-explicit-label']), evidence: labelEvidence(container(field(capturedSource, 'evidence'))) };
  else details = { ruleId, checks: checks(groups, ['color-contrast'], []), evidence: contrastEvidence(groups) };
  return { details, locator: locator(field(capturedSource, 'locator')), reason: proseReason(node) };
}

function validateOptions(input: unknown): void {
  const options = record(input);
  exactKeys(options, ['runOnly', 'reporter', 'resultTypes', 'selectors', 'ancestry', 'xpath', 'absolutePaths', 'elementRef', 'iframes']);
  const runOnly = record(own(options, 'runOnly'));
  exactKeys(runOnly, ['type', 'values']);
  requireValid(own(runOnly, 'type') === 'rule' && own(options, 'reporter') === 'm103-native-dom-v1');
  for (const [source, expected] of [[own(runOnly, 'values'), rules], [own(options, 'resultTypes'), buckets]] as const) {
    const values = denseArray(source);
    requireValid(values.length === expected.length && values.every((value, index) => value === expected[index]));
  }
  for (const key of ['selectors', 'elementRef']) requireValid(own(options, key) === true);
  for (const key of ['ancestry', 'xpath', 'absolutePaths', 'iframes']) requireValid(own(options, key) === false);
}

export function normalizeNativeScan(input: unknown): NormalizationResult {
  let failure: Extract<NormalizationResult, { ok: false }>['error'] = 'result-validation';
  try {
    const root = record(input);
    if (own(root, 'captureFailure') === 'evidence-capture') {
      exactKeys(root, ['captureFailure']);
      return Object.freeze({ ok: false, error: 'evidence-capture' });
    }
    const engine = record(own(root, 'testEngine'));
    requireValid(own(engine, 'name') === 'axe-core' && own(engine, 'version') === '4.13.0');
    validateOptions(own(root, 'toolOptions'));
    // Finish all container inspection before applying native-error/coverage precedence.
    const nativeBuckets = buckets.map(bucket => ({ bucket, entries: denseArray(own(root, bucket)).map(value => {
      const entry = record(value);
      const id = own(entry, 'id');
      requireValid(typeof id === 'string');
      const nodes = denseArray(own(entry, 'nodes')).map(record);
      const error = own(entry, 'error');
      return { id, nodes, hasError: error !== undefined && error !== null };
    }) }));
    if (nativeBuckets.some(bucket => bucket.entries.some(entry => entry.hasError))) return Object.freeze({ ok: false, error: 'scanner' });

    failure = 'coverage-validation';
    const emptyCoverage = () => ({ violations: null as number | null, incomplete: null as number | null, passes: null as number | null, inapplicable: null as number | null });
    const coverage = { 'image-alt': emptyCoverage(), label: emptyCoverage(), 'color-contrast': emptyCoverage() };
    const validated = nativeBuckets.map(({ bucket, entries }) => ({ bucket, entries: entries.map(entry => {
      const rule = choice(entry.id, rules);
      requireValid(coverage[rule][bucket] === null && (bucket === 'inapplicable' || entry.nodes.length > 0));
      coverage[rule][bucket] = entry.nodes.length;
      return { rule, nodes: entry.nodes };
    }) }));
    for (const rule of rules) {
      const counts = coverage[rule];
      requireValid(buckets.some(bucket => counts[bucket] !== null));
      requireValid(counts.inapplicable !== 0 || (counts.violations === null && counts.incomplete === null && counts.passes === null));
      Object.freeze(counts);
    }

    const findings: Finding[] = [];
    const scannerReviewObservations: ScannerReviewObservation[] = [];
    const ids = new Set<string>();
    for (const { bucket, entries } of validated) {
      if (bucket !== 'violations' && bucket !== 'incomplete') continue;
      for (const { rule, nodes } of entries) for (const node of nodes) {
        failure = 'evidence-capture';
        const projected = projectNode(rule, node);
        const { details, locator } = projected;
        if (bucket === 'violations') {
          failure = 'result-validation';
          const findingId = crypto.randomUUID();
          requireValid(typeof findingId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(findingId)?.[0] === findingId && !ids.has(findingId));
          ids.add(findingId);
          findings.push(Object.freeze({ ...details, locator, findingId, nativeResult: 'violation', state: 'unprocessed' }));
        } else if (details.ruleId === 'color-contrast') {
          scannerReviewObservations.push(Object.freeze({ ...details, locator, nativeResult: 'incomplete', incompleteReason: details.evidence.messageKey }));
        } else {
          scannerReviewObservations.push(Object.freeze({ ...details, locator, nativeResult: 'incomplete', incompleteReason: projected.reason }));
        }
      }
    }
    return Object.freeze({ ok: true, value: Object.freeze({ coverage: Object.freeze(coverage), findings: Object.freeze(findings), scannerReviewObservations: Object.freeze(scannerReviewObservations) }) });
  } catch {
    return Object.freeze({ ok: false, error: failure });
  }
}
