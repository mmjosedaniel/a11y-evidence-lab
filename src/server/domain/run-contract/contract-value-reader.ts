import { ordinaryReasons } from './run-policy.ts';
import type { Available, Unavailable } from './run-types.ts';

export function requireValid(condition: unknown): asserts condition {
  if (!condition) throw new Error('Invalid contract');
}

// Read descriptors once: never invoke accessors or copy values through Proxy get traps.
export function readObject(input: unknown, keys?: readonly string[]): Record<string, unknown> {
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

export function requireKeys(record: Record<string, unknown>, keys: readonly string[]): void {
  requireValid(Object.keys(record).length === keys.length && keys.every(key => Object.hasOwn(record, key)));
}

export function readArray<T>(input: unknown, readItem: (item: unknown) => T): readonly T[] {
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

export function readChoice<const T extends readonly (string | number | boolean)[]>(input: unknown, choices: T): T[number] {
  requireValid(choices.some(choice => Object.is(choice, input)));
  return input as T[number];
}

export function readBoolean(input: unknown): boolean {
  requireValid(typeof input === 'boolean');
  return input;
}

export function readNumber(input: unknown): number {
  requireValid(typeof input === 'number' && Number.isFinite(input) && !Object.is(input, -0));
  return input;
}

export function readInteger(input: unknown, minimum: number): number {
  const value = readNumber(input);
  requireValid(Number.isSafeInteger(value) && value >= minimum);
  return value;
}

export function readPattern(input: unknown, pattern: RegExp, maximum = Infinity): string {
  requireValid(typeof input === 'string' && input.length <= maximum);
  requireValid(pattern.exec(input)?.[0] === input);
  return input;
}

export function readId(input: unknown): string {
  return readPattern(input, /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/);
}

export function readTime(input: unknown): string {
  const value = readPattern(input, /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/);
  requireValid(new Date(value).toISOString() === value);
  return value;
}

export function readUrl(input: unknown): string {
  requireValid(typeof input === 'string');
  const url = new URL(input);
  requireValid(url.href === input && url.protocol === 'https:' && url.hostname !== '' && url.username === '' && url.password === '');
  return input;
}

export function readLocale(input: unknown): string {
  requireValid(typeof input === 'string' && input.length <= 64);
  const locales = Intl.getCanonicalLocales(input);
  requireValid(locales.length === 1 && locales[0] === input);
  return input;
}

export function readFact<T>(input: unknown, readValue: (input: unknown) => T): Available<T> | Unavailable;
export function readFact<T, const R extends readonly string[]>(
  input: unknown, readValue: (input: unknown) => T, reasons: R,
): Available<T> | Unavailable<R[number]>;
export function readFact<T>(
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

export function readUnavailable<const R extends readonly string[]>(input: unknown, reasons: R): Unavailable<R[number]> {
  const record = readObject(input, ['unavailable']);
  return Object.freeze({ unavailable: readChoice(record.unavailable, reasons) });
}
