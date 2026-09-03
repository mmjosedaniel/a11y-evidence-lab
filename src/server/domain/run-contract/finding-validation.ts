import {
  attributeStates,
  contrastAnyChecks,
  emptyChecks,
  imageAnyChecks,
  imageNoneChecks,
  inputTypes,
  labelAnyChecks,
  labelNoneChecks,
  locatorReasons,
  messageKeys,
  notApplicableReasons,
  ordinaryReasons,
  reviewReasons,
  rules,
} from './run-policy.ts';
import {
  readArray,
  readBoolean,
  readChoice,
  readFact,
  readId,
  readInteger,
  readNumber,
  readObject,
  readPattern,
  readUnavailable,
  requireValid,
} from './contract-value-reader.ts';
import type {
  Available,
  Checks,
  ContrastEvidence,
  Finding,
  ImageEvidence,
  LabelEvidence,
  Locator,
  RuleDetails,
  ScannerReviewObservation,
  Unavailable,
} from './run-types.ts';

function readLocator(input: unknown): Locator {
  return readFact(input, value => {
    const locator = readPattern(value, /^:root(?: > :nth-child\([1-9][0-9]*\))*$/, 2048);
    for (const match of locator.matchAll(/:nth-child\(([0-9]+)\)/g)) readInteger(Number(match[1]), 1);
    return locator;
  }, locatorReasons);
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
    return Object.freeze({ elementKind: Object.freeze({ value: 'textarea' }), inputType: readUnavailable(record.inputType, notApplicableReasons), nameSources });
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
    case 'image-alt': return { ruleId, checks: readChecks(record.checks, imageAnyChecks, imageNoneChecks), evidence: readImageEvidence(record.evidence) };
    case 'label': return { ruleId, checks: readChecks(record.checks, labelAnyChecks, labelNoneChecks), evidence: readLabelEvidence(record.evidence) };
    case 'color-contrast': return { ruleId, checks: readChecks(record.checks, contrastAnyChecks, emptyChecks), evidence: readContrastEvidence(record.evidence) };
  }
}

export function readFinding(input: unknown): Finding {
  const record = readObject(input, ['findingId', 'ruleId', 'nativeResult', 'state', 'checks', 'locator', 'evidence']);
  return Object.freeze({
    ...readRuleDetails(record), findingId: readId(record.findingId),
    nativeResult: readChoice(record.nativeResult, ['violation']),
    state: readChoice(record.state, ['unprocessed']), locator: readLocator(record.locator),
  });
}

export function readObservation(input: unknown): ScannerReviewObservation {
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
  return Object.freeze({ ...details, nativeResult, locator, incompleteReason: readUnavailable(record.incompleteReason, reviewReasons) });
}
