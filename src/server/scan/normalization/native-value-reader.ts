export type Unavailable<R extends string = 'missing' | 'invalid' | 'withheld'> = { readonly unavailable: R };
export type Fact<T, R extends string = 'missing' | 'invalid' | 'withheld'> = { readonly value: T } | Unavailable<R>;
export type Source<T = unknown> = Fact<T, 'missing' | 'invalid'>;

export const ordinaryReasons = ['missing', 'invalid', 'withheld'] as const;
export const attributeStates = ['absent', 'empty', 'whitespace-only', 'non-empty'] as const;
export const inputTypes = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden',
  'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'] as const;
export const messageKeys = ['nonBmp', 'pseudoContent', 'complexTextShadows', 'colorParse', 'equalRatio',
  'shortTextContent', 'shadowOnBgColor', 'fgOnShadowColor', 'imgNode', 'bgGradient', 'bgImage',
  'bgOverlap', 'elmPartiallyObscuring', 'elmPartiallyObscured', 'outsideViewport'] as const;

export function requireValid(condition: unknown): asserts condition {
  if (!condition) throw new Error('Invalid native structure');
}

export function record(input: unknown): object {
  requireValid(typeof input === 'object' && input !== null && !Array.isArray(input));
  const prototype = Object.getPrototypeOf(input);
  requireValid(prototype === Object.prototype || prototype === null);
  Reflect.ownKeys(input);
  return input;
}

// Only inspect consumed own data properties. Opaque native fields stay untouched.
export function own(input: object, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(input, key);
  if (!descriptor) return undefined;
  requireValid(descriptor.enumerable && 'value' in descriptor);
  return descriptor.value;
}

export function exactKeys(input: object, expected: readonly string[]): void {
  const keys = Reflect.ownKeys(input);
  requireValid(keys.length === expected.length && expected.every(key => keys.includes(key)));
}

export function denseArray(input: unknown): unknown[] {
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

export function choice<const T extends readonly (string | number | boolean)[]>(input: unknown, values: T): T[number] {
  requireValid(values.some(value => Object.is(value, input)));
  return input as T[number];
}

export function unavailable<const R extends string>(reason: R): Unavailable<R> {
  return Object.freeze({ unavailable: reason });
}

export function available<const T>(value: T): { readonly value: T } {
  return Object.freeze({ value });
}

export function field(container: Source<object>, key: string): Source {
  if ('unavailable' in container) return container;
  try {
    const value = own(container.value, key);
    return value === undefined ? unavailable('missing') : available(value);
  } catch {
    return unavailable('invalid');
  }
}

export function container(source: Source, nullIsMissing = false): Source<object> {
  if ('unavailable' in source) return source;
  if (nullIsMissing && source.value === null) return unavailable('missing');
  try {
    return available(record(source.value));
  } catch {
    return unavailable('invalid');
  }
}

export function capturedFact<T>(source: Source, read: (value: unknown) => T): Fact<T>;
export function capturedFact<T, const R extends readonly string[]>(
  source: Source, read: (value: unknown) => T, reasons: R,
): Fact<T, R[number] | 'missing' | 'invalid'>;
export function capturedFact<T>(
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

export function pattern(input: unknown, expression: RegExp, maximum = Infinity): string {
  requireValid(typeof input === 'string' && input.length <= maximum && expression.exec(input)?.[0] === input);
  return input;
}
