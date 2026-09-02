import type { Finding } from '../../domain/run-contract.ts';
import {
  attributeStates, available, capturedFact, choice, container, denseArray, field, inputTypes,
  messageKeys, own, pattern, record, requireValid, unavailable,
} from './native-value-reader.ts';
import type { Fact, Source, Unavailable } from './native-value-reader.ts';

export type NativeRule = Finding['ruleId'];
type Details = { [R in NativeRule]: Pick<Extract<Finding, { ruleId: R }>, 'ruleId' | 'checks' | 'evidence'> }[NativeRule];
const imageChecks = ['has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title', 'presentational-role'] as const;
const labelChecks = ['implicit-label', 'explicit-label', 'aria-label', 'aria-labelledby', 'non-empty-title', 'non-empty-placeholder', 'presentational-role'] as const;

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

export function projectNativeNode(ruleId: NativeRule, node: object):
  { details: Details; locator: Finding['locator']; reason: Unavailable<'missing' | 'withheld'> } {
  const captured = record(own(node, 'capturedDom'));
  const capturedSource = available(captured);
  const groups: Groups = { any: checkGroup(node, 'any'), all: checkGroup(node, 'all'), none: checkGroup(node, 'none') };
  let details: Details;
  if (ruleId === 'image-alt') details = { ruleId, checks: checks(groups, imageChecks, ['alt-space-value']), evidence: imageEvidence(container(field(capturedSource, 'evidence'))) };
  else if (ruleId === 'label') details = { ruleId, checks: checks(groups, labelChecks, ['hidden-explicit-label']), evidence: labelEvidence(container(field(capturedSource, 'evidence'))) };
  else details = { ruleId, checks: checks(groups, ['color-contrast'], []), evidence: contrastEvidence(groups) };
  return { details, locator: locator(field(capturedSource, 'locator')), reason: proseReason(node) };
}
