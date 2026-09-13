import { readArray, readObject, requireValid } from '../server/domain/run-contract/contract-value-reader.ts';

// Detach every value before validation, including nested views. Accessors are never evaluated.
export function snapshot(value: unknown, ancestors = new Set<object>()): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))) return value;
  requireValid(typeof value === 'object' && value !== null && !ancestors.has(value));
  ancestors.add(value);
  const copy = Array.isArray(value)
    ? readArray(value, item => snapshot(item, ancestors))
    : Object.fromEntries(Object.entries(readObject(value)).map(([key, item]) => [key, snapshot(item, ancestors)]));
  ancestors.delete(value);
  return Object.freeze(copy);
}

export function equal(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object' ||
      Array.isArray(left) !== Array.isArray(right)) return false;
  const a = left as Record<string, unknown>, b = right as Record<string, unknown>;
  return Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every(key => Object.hasOwn(b, key) && equal(a[key], b[key]));
}

