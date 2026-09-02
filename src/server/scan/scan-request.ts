import type { RunningRun } from '../persistence/run-repository.ts';
import { initialScanContext } from './scan-profile.ts';

type PreparedScan = Pick<RunningRun, 'requestedUrl' | 'providerContext' | 'scanContext'>;

export function canonicalPublicHttpsUrl(input: unknown): string {
  if (typeof input !== 'string') throw new Error('invalid-url');
  const url = new URL(input);
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) throw new Error('invalid-url');
  return url.href;
}

export function prepareScanRequest(url: unknown, mode: unknown):
  | { readonly ok: true; readonly value: PreparedScan }
  | { readonly ok: false; readonly error: 'invalid-url' | 'invalid-mode' } {
  let requestedUrl: string;
  try { requestedUrl = canonicalPublicHttpsUrl(url); } catch { return { ok: false, error: 'invalid-url' }; }
  if (mode !== 'local' && mode !== 'groq') return { ok: false, error: 'invalid-mode' };
  return { ok: true, value: {
    requestedUrl,
    providerContext: mode === 'local'
      ? { mode, provider: 'ollama', model: 'qwen3.5:4b' }
      : { mode, provider: 'groq', model: 'openai/gpt-oss-20b' },
    scanContext: initialScanContext(),
  } };
}
