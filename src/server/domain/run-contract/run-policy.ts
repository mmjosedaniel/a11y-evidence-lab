export const rules = Object.freeze(['image-alt', 'label', 'color-contrast'] as const);
export type Rule = typeof rules[number];

export const ordinaryReasons = Object.freeze(['missing', 'invalid', 'withheld'] as const);
export const observedReasons = Object.freeze(['missing', 'invalid'] as const);
export const locatorReasons = Object.freeze([
  'missing', 'invalid', 'withheld', 'unsupported', 'too-long',
] as const);
export const notApplicableReasons = Object.freeze(['not-applicable'] as const);
export const reviewReasons = Object.freeze(['missing', 'withheld'] as const);

export const attributeStates = Object.freeze(['absent', 'empty', 'whitespace-only', 'non-empty'] as const);
export type AttributeState = typeof attributeStates[number];

export const inputTypes = Object.freeze([
  'button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
  'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search',
  'submit', 'tel', 'text', 'time', 'url', 'week',
] as const);
export type InputType = typeof inputTypes[number];

export const messageKeys = Object.freeze([
  'nonBmp', 'pseudoContent', 'complexTextShadows', 'colorParse', 'equalRatio',
  'shortTextContent', 'shadowOnBgColor', 'fgOnShadowColor', 'imgNode', 'bgGradient',
  'bgImage', 'bgOverlap', 'elmPartiallyObscuring', 'elmPartiallyObscured', 'outsideViewport',
] as const);
export type MessageKey = typeof messageKeys[number];

export const failureCategories = Object.freeze([
  'navigation', 'timeout', 'browser', 'scanner', 'result-validation',
  'coverage-validation', 'evidence-capture', 'initial-persistence', 'shutdown', 'cleanup',
] as const);
export type FailureCategory = typeof failureCategories[number];

export const imageAnyChecks = Object.freeze([
  'has-alt', 'aria-label', 'aria-labelledby', 'non-empty-title', 'presentational-role',
] as const);
export const imageNoneChecks = Object.freeze(['alt-space-value'] as const);

export const labelAnyChecks = Object.freeze([
  'implicit-label', 'explicit-label', 'aria-label', 'aria-labelledby', 'non-empty-title',
  'non-empty-placeholder', 'presentational-role',
] as const);
export const labelNoneChecks = Object.freeze(['hidden-explicit-label'] as const);
export const contrastAnyChecks = Object.freeze(['color-contrast'] as const);
export const emptyChecks = Object.freeze([] as const);
