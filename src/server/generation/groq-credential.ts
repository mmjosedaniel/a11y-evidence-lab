import type { Stats } from 'node:fs';
import { lstat, realpath, open } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { debuglog } from 'node:util';

export type GroqCredentialResult = { readonly ok: true; readonly credential: string; readonly cleanup: 'complete' }
  | { readonly ok: false; readonly error: 'configuration' | 'missing-prerequisite'; readonly cleanup: 'complete' | 'uncertain' };
export type GroqCredentialStat = Pick<Stats, 'dev' | 'ino' | 'nlink' | 'size' | 'isDirectory' | 'isFile' | 'isSymbolicLink'>;
export type GroqCredentialHandle = {
  stat(): Promise<GroqCredentialStat>;
  read(buffer: Uint8Array, offset: number, length: number, position: number): Promise<{ bytesRead: number }>;
  close(): Promise<void>;
};
export type GroqCredentialIO = {
  lstat(path: string): Promise<GroqCredentialStat>;
  realpath(path: string): Promise<string>;
  open(path: string, flags: 'r'): Promise<GroqCredentialHandle>;
  debugEnabled(): boolean;
};

const maxFileBytes = 65536;
const credentialPath = path.join(fileURLToPath(new URL('../../../', import.meta.url)), '.env');
const nativeIO: GroqCredentialIO = {
  lstat, realpath, open,
  debugEnabled: () => debuglog('http').enabled || debuglog('https').enabled,
};
function failure(error: 'configuration' | 'missing-prerequisite' = 'configuration',
  cleanup: 'complete' | 'uncertain' = 'complete'): GroqCredentialResult {
  return { ok: false, error, cleanup };
}

export function parseGroqCredential(bytes: Uint8Array): GroqCredentialResult {
  try {
    if (bytes.byteLength > maxFileBytes) return failure();
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/\r\n/g, '\n');
    if (/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\ufeff]/u.test(text)) return failure();
    let selected: string | undefined;
    let assignments = 0;
    for (const line of text.split('\n')) {
      // LF splitting owns physical lines; Unicode separators remain value or comment content.
      const match = /^[ \t]*(?:export[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)(.*)$/s.exec(line);
      if (!match || match[1] !== 'GROQ_API_KEY') continue;
      if (++assignments > 1) return failure();
      const assignment = /^[ \t]*=[ \t]*(.*)$/s.exec(match[2]);
      if (!assignment) return failure();
      const raw = assignment[1];
      if (raw.startsWith("'") || raw.startsWith('"')) {
        const closing = raw.indexOf(raw[0], 1);
        if (closing < 0 || !/^[ \t]*(?:#.*)?$/s.test(raw.slice(closing + 1))) return failure();
        selected = raw.slice(1, closing);
      } else {
        selected = raw.split('#', 1)[0].replace(/^[ \t]+|[ \t]+$/g, '');
      }
      if (selected.length > 4096 || /[^\x21-\x7e]|['"\\]/.test(selected)) return failure();
    }
    return selected ? { ok: true, credential: selected, cleanup: 'complete' } : failure('missing-prerequisite');
  } catch { return failure(); }
}

function ordinaryFile(stat: GroqCredentialStat): boolean {
  return stat.isFile() && !stat.isDirectory() && !stat.isSymbolicLink() && stat.nlink === 1
    && Number.isSafeInteger(stat.size) && stat.size >= 0 && stat.size <= maxFileBytes;
}
function sameFile(left: GroqCredentialStat, right: GroqCredentialStat): boolean {
  return ordinaryFile(left) && ordinaryFile(right) && left.dev === right.dev && left.ino === right.ino
    && left.size === right.size;
}
const invalidTopology = new Error('Invalid credential topology');
const cancelled = new Error('Credential preparation cancelled');

export async function readGroqCredential(signal: AbortSignal, io: GroqCredentialIO = nativeIO): Promise<GroqCredentialResult> {
  if (signal.aborted) return failure();
  let handle: GroqCredentialHandle | undefined;
  let openStarted = false;
  let closed = false;
  let buffer: Uint8Array | undefined;
  let result: GroqCredentialResult = failure();
  let resolveAbort!: (value: GroqCredentialResult) => void;
  const aborted = new Promise<GroqCredentialResult>(resolve => { resolveAbort = resolve; });
  const onAbort = () => {
    result = failure();
    buffer?.fill(0);
    resolveAbort(failure('configuration', openStarted && !closed ? 'uncertain' : 'complete'));
  };
  signal.addEventListener('abort', onAbort, { once: true });
  function checkAbort(): void { if (signal.aborted) throw cancelled; }
  async function checked<T>(operation: () => Promise<T>): Promise<T> {
    checkAbort();
    const value = await operation();
    checkAbort();
    return value;
  }
  async function topology(): Promise<GroqCredentialStat | undefined> {
    const lineage = [credentialPath];
    while (path.dirname(lineage[0]) !== lineage[0]) lineage.unshift(path.dirname(lineage[0]));
    let leaf: GroqCredentialStat | undefined;
    for (const candidate of lineage) {
      let stat: GroqCredentialStat;
      try { stat = await checked(() => io.lstat(candidate)); }
      catch (error) {
        if (!signal.aborted && candidate === credentialPath && (error as NodeJS.ErrnoException)?.code === 'ENOENT') return undefined;
        throw error;
      }
      const isLeaf = candidate === credentialPath;
      if (stat.isSymbolicLink() || (isLeaf ? !ordinaryFile(stat) : !stat.isDirectory() || stat.isFile())) throw invalidTopology;
      if (await checked(() => io.realpath(candidate)) !== candidate) throw invalidTopology;
      if (isLeaf) leaf = stat;
    }
    return leaf;
  }
  async function load(): Promise<GroqCredentialResult> {
    try {
      checkAbort();
      if (io.debugEnabled()) return failure();
      const before = await topology();
      if (!before) return failure('missing-prerequisite');
      checkAbort();
      openStarted = true;
      // Assign a late handle before checking cancellation so finally still owns its close.
      handle = await io.open(credentialPath, 'r');
      checkAbort();
      if (!sameFile(before, await checked(() => handle!.stat()))) throw invalidTopology;
      buffer = new Uint8Array(maxFileBytes + 1);
      let count = 0;
      while (count < buffer.byteLength) {
        const remaining = buffer.byteLength - count;
        const { bytesRead } = await checked(() => handle!.read(buffer!, count, remaining, count));
        if (!Number.isSafeInteger(bytesRead) || bytesRead < 0 || bytesRead > remaining) throw invalidTopology;
        count += bytesRead;
        if (bytesRead === 0) break;
      }
      if (count > maxFileBytes || count !== before.size
        || !sameFile(before, await checked(() => handle!.stat()))) throw invalidTopology;
      const after = await topology();
      if (!after || !sameFile(before, after)) throw invalidTopology;
      checkAbort();
      result = parseGroqCredential(buffer.subarray(0, count));
    } catch { result = failure(); }
    finally {
      buffer?.fill(0);
      if (handle) {
        try { await handle.close(); closed = true; }
        catch { result = failure('configuration', 'uncertain'); }
        handle = undefined;
      }
    }
    if (signal.aborted) return failure('configuration', openStarted && !closed ? 'uncertain' : 'complete');
    return result;
  }
  try { return await Promise.race([load(), aborted]); }
  finally { signal.removeEventListener('abort', onAbort); }
}
