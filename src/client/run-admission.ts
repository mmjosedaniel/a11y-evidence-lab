import { validateRun } from '../server/domain/run-contract.ts';
import type { PageAnalysisRun, ProviderContext } from '../server/domain/run-contract.ts';

type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;

export type AdmittedOutcome =
  | { readonly ok: true; readonly run: CompleteRun }
  | { readonly ok: false; readonly error: string; readonly run: FailedRun | null;
      readonly persisted: boolean; readonly cleanupFailed: boolean };

const analyzeErrors = ['invalid-request', 'busy', 'stopping', 'create-failed', 'scan-failed', 'result-validation', 'initial-persistence', 'shutdown'];

// Snapshot only own data descriptors. All later envelope reads use this local copy.
function snapshotEnvelope(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const prototype = Object.getPrototypeOf(raw);
  if (prototype !== Object.prototype && prototype !== null) return null;
  const copy: Record<string, unknown> = Object.create(null);
  for (const key of Reflect.ownKeys(raw)) {
    if (typeof key !== 'string') return null;
    const descriptor = Object.getOwnPropertyDescriptor(raw, key);
    if (!descriptor?.enumerable || !('value' in descriptor) || descriptor.value === undefined) return null;
    copy[key] = descriptor.value;
  }
  return copy;
}

function exactKeys(record: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(record).length === keys.length && keys.every(key => Object.hasOwn(record, key));
}

export function admit(raw: unknown): AdmittedOutcome | null {
  try {
    const envelope = snapshotEnvelope(raw);
    if (!envelope) return null;
    if (envelope.ok === true) {
      if (!exactKeys(envelope, ['ok', 'run'])) return null;
      const result = validateRun(envelope.run);
      if (!result.ok || result.value.status !== 'completed') return null;
      return { ok: true, run: result.value };
    }
    if (envelope.ok !== false || typeof envelope.error !== 'string') return null;
    if (!exactKeys(envelope, ['ok', 'error', 'run', 'persisted', 'cleanupFailed']) ||
        !analyzeErrors.includes(envelope.error) || typeof envelope.persisted !== 'boolean' ||
        typeof envelope.cleanupFailed !== 'boolean') return null;
    let run: FailedRun | null = null;
    if (envelope.run !== null) {
      const result = validateRun(envelope.run);
      if (!result.ok || result.value.status !== 'failed') return null;
      run = result.value;
      if (run.scanContext.cleanup === 'failed' && !envelope.cleanupFailed) return null;
    } else if (envelope.persisted) return null;
    return { ok: false, error: envelope.error, run, persisted: envelope.persisted, cleanupFailed: envelope.cleanupFailed };
  } catch {
    return null;
  }
}

export function sameProvider(left: ProviderContext, right: ProviderContext): boolean {
  return left.mode === right.mode && left.provider === right.provider && left.model === right.model;
}
