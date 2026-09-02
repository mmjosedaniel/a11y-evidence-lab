import type { StoreError, StoreResult } from './contracts.ts';

export class StoreFailure extends Error {
  readonly code: StoreError;
  constructor(code: StoreError) {
    super(code);
    this.code = code;
  }
}

export function reject(code: StoreError): never { throw new StoreFailure(code); }
export function failure(error: unknown, fallback: StoreError, cleanupFailed = false): StoreResult<never> {
  return { ok: false, error: error instanceof StoreFailure ? error.code : fallback, cleanupFailed };
}
export function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}
