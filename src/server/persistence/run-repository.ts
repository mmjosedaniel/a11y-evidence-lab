import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { validateRun } from '../domain/run-contract.ts';
import type { PageAnalysisRun } from '../domain/run-contract.ts';

export type RunningRun = Extract<PageAnalysisRun, { status: 'running' }>;
export type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;
export type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
export type TerminalRun = CompletedRun | FailedRun;
export type StoreError =
  | 'invalid-id' | 'unsafe-path' | 'collision' | 'not-found'
  | 'invalid-run' | 'identity-mismatch' | 'invalid-transition'
  | 'read-failed' | 'write-failed';
export type StoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: StoreError; cleanupFailed: boolean };
export interface RunRepository {
  create(input: unknown): StoreResult<RunningRun>;
  read(runId: unknown): StoreResult<PageAnalysisRun>;
  finish(input: unknown): StoreResult<TerminalRun>;
}

class StoreFailure extends Error {
  readonly code: StoreError;
  constructor(code: StoreError) {
    super(code);
    this.code = code;
  }
}

function reject(code: StoreError): never { throw new StoreFailure(code); }
function failure(error: unknown, fallback: StoreError, cleanupFailed = false): StoreResult<never> {
  return { ok: false, error: error instanceof StoreFailure ? error.code : fallback, cleanupFailed };
}
function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}
const deviceName = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i;
function validId(input: unknown): input is string {
  return typeof input === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.exec(input)?.[0] === input
    && !deviceName.test(input);
}
function samePath(left: string, right: string): boolean { return left.toLowerCase() === right.toLowerCase(); }
function sameIdentity(left: fs.Stats, right: fs.Stats): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}
function statEntry(target: string): fs.Stats {
  try { return fs.lstatSync(target); }
  catch (error) {
    if (hasCode(error, 'ENOENT')) reject('not-found');
    throw error;
  }
}
function ordinaryDirectory(target: string): fs.Stats {
  const stat = statEntry(target);
  if (!stat.isDirectory() || stat.isSymbolicLink() || !samePath(fs.realpathSync(target), target)) reject('unsafe-path');
  return stat;
}
function ordinaryFile(target: string): fs.Stats {
  const stat = statEntry(target);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 || !samePath(fs.realpathSync(target), target)) reject('unsafe-path');
  return stat;
}
function walkRoot(root: string, establish: boolean): fs.Stats {
  const volume = path.parse(root).root;
  let current = volume;
  let stat = ordinaryDirectory(current);
  for (const component of root.slice(volume.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, component);
    if (establish) {
      try { fs.lstatSync(current); }
      catch (error) {
        if (!hasCode(error, 'ENOENT')) throw error;
        try { fs.mkdirSync(current); }
        catch (mkdirError) { if (!hasCode(mkdirError, 'EEXIST')) throw mkdirError; }
      }
    }
    stat = ordinaryDirectory(current);
  }
  return stat;
}
function entryName(directory: string, expected: string): string | undefined {
  try { return fs.readdirSync(directory).find(name => samePath(name, expected)); }
  catch { return reject('read-failed'); }
}
function requireExactEntry(directory: string, expected: string): void {
  const found = entryName(directory, expected);
  if (found === undefined) reject('not-found');
  if (found !== expected) reject('identity-mismatch');
}
function checkTransition(previous: PageAnalysisRun, next: TerminalRun): void {
  if (previous.status !== 'running') reject('invalid-transition');
  for (const key of ['formatVersion', 'runId', 'createdAt', 'applicationRevision', 'requestedUrl', 'providerContext'] as const) {
    if (!isDeepStrictEqual(previous[key], next[key])) reject('invalid-transition');
  }
  const before = previous.scanContext;
  const after = next.status === 'completed' ? next.scan.context : next.scanContext;
  for (const key of ['scannerVersion', 'evidencePolicyVersion', 'rules', 'scope', 'readiness', 'viewport',
    'locale', 'timeoutMs', 'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'contrastProfile'] as const) {
    if (!isDeepStrictEqual(before[key], after[key])) reject('invalid-transition');
  }
  for (const key of ['finalUrl', 'scannedAt', 'browserVersion'] as const) {
    if ('value' in before[key] && !isDeepStrictEqual(before[key], after[key])) reject('invalid-transition');
  }
  if (before.readinessReached && !after.readinessReached) reject('invalid-transition');
}

export function openRunRepository(rootDirectory: string): StoreResult<RunRepository> {
  let root: string;
  let rootIdentity: fs.Stats;
  try {
    if (typeof rootDirectory !== 'string' || !/^[A-Za-z]:[\\/]/.test(rootDirectory)
      || rootDirectory.includes('\0') || rootDirectory.slice(2).includes(':')) reject('unsafe-path');
    for (const component of rootDirectory.slice(3).split(/[\\/]/)) {
      if (component === '.' || component === '..') continue;
      if (deviceName.test(component) || /[. ]$/.test(component)) reject('unsafe-path');
    }
    root = path.resolve(rootDirectory);
    rootIdentity = walkRoot(root, true);
  } catch (error) { return failure(error, 'write-failed'); }

  function checkRoot(): void {
    if (!sameIdentity(rootIdentity, walkRoot(root, false))) reject('unsafe-path');
  }
  function checkRun(runId: string, expected?: fs.Stats): fs.Stats {
    checkRoot();
    requireExactEntry(root, runId);
    const stat = ordinaryDirectory(path.join(root, runId));
    if (expected && !sameIdentity(expected, stat)) reject('unsafe-path');
    return stat;
  }
  function checkCanonical(runId: string, expected?: fs.Stats): fs.Stats {
    const directory = path.join(root, runId);
    requireExactEntry(directory, 'run.json');
    const stat = ordinaryFile(path.join(directory, 'run.json'));
    if (expected && !sameIdentity(expected, stat)) reject('unsafe-path');
    return stat;
  }
  function readCurrent(runId: string): { value: PageAnalysisRun; directory: fs.Stats; canonical: fs.Stats } {
    const directory = checkRun(runId);
    const canonical = checkCanonical(runId);
    let text: string;
    try { text = fs.readFileSync(path.join(root, runId, 'run.json'), 'utf8'); }
    catch { return reject('read-failed'); }
    let parsed: unknown;
    try { parsed = JSON.parse(text); }
    catch { return reject('invalid-run'); }
    const validated = validateRun(parsed);
    if (!validated.ok) reject('invalid-run');
    if (validated.value.runId !== runId) reject('identity-mismatch');
    return { value: validated.value, directory, canonical };
  }

  function publish<T extends RunningRun | TerminalRun>(success: { ok: true; value: T }, buffer: Buffer,
    directoryIdentity: fs.Stats, createdDirectory: boolean, canonicalIdentity?: fs.Stats): StoreResult<T> {
    const { value } = success;
    const directory = path.join(root, value.runId);
    let staged: string | undefined;
    let descriptor: number | undefined;
    let closeAttempted = false;
    let closed = false;
    try {
      staged = path.join(directory, `run.json.tmp-${randomUUID()}`);
      descriptor = fs.openSync(staged, 'wx');
      const stageIdentity = fs.fstatSync(descriptor);
      if (!stageIdentity.isFile() || stageIdentity.nlink !== 1) reject('unsafe-path');
      const checkedStage = ordinaryFile(staged);
      if (!sameIdentity(stageIdentity, checkedStage)) reject('unsafe-path');
      let offset = 0;
      while (offset < buffer.length) {
        const remaining = buffer.length - offset;
        const written = fs.writeSync(descriptor, buffer, offset, remaining, null);
        if (!Number.isInteger(written) || written < 1 || written > remaining) reject('write-failed');
        offset += written;
      }
      fs.fsyncSync(descriptor);
      closeAttempted = true;
      fs.closeSync(descriptor);
      closed = true;
      checkRun(value.runId, directoryIdentity);
      if (createdDirectory) {
        if (entryName(directory, 'run.json') !== undefined) reject('identity-mismatch');
      } else {
        checkCanonical(value.runId, canonicalIdentity);
      }
      requireExactEntry(directory, path.basename(staged));
      if (!sameIdentity(stageIdentity, ordinaryFile(staged))) reject('unsafe-path');
      fs.renameSync(staged, path.join(directory, 'run.json'));
      // Rename commits the record. No filesystem work belongs after this point.
      return success;
    } catch (error) {
      let cleanupFailed = false;
      if (descriptor !== undefined) {
        if (!closeAttempted) {
          closeAttempted = true;
          try { fs.closeSync(descriptor); closed = true; }
          catch { cleanupFailed = true; }
        }
        if (!closed) cleanupFailed = true;
        else {
          try {
            checkRun(value.runId, directoryIdentity);
            fs.unlinkSync(staged!);
          } catch { cleanupFailed = true; }
        }
      }
      if (createdDirectory) {
        try {
          checkRun(value.runId, directoryIdentity);
          fs.rmdirSync(directory);
        } catch { cleanupFailed = true; }
      }
      return failure(error, 'write-failed', cleanupFailed);
    }
  }

  const repository: RunRepository = {
    create(input) {
      const validated = validateRun(input);
      if (!validated.ok) return failure(new StoreFailure('invalid-run'), 'invalid-run');
      const value = validated.value;
      if (!validId(value.runId)) return failure(new StoreFailure('invalid-id'), 'invalid-id');
      if (value.status !== 'running') return failure(new StoreFailure('invalid-transition'), 'invalid-transition');
      let created = false;
      let directoryIdentity: fs.Stats | undefined;
      const directory = path.join(root, value.runId);
      try {
        const buffer = Buffer.from(JSON.stringify(value, null, 2) + '\n');
        const success = { ok: true as const, value };
        checkRoot();
        if (entryName(root, value.runId) !== undefined) reject('collision');
        try { fs.mkdirSync(directory); }
        catch (error) { if (hasCode(error, 'EEXIST')) reject('collision'); throw error; }
        created = true;
        directoryIdentity = checkRun(value.runId);
        if (entryName(directory, 'run.json') !== undefined) reject('identity-mismatch');
        return publish(success, buffer, directoryIdentity, true);
      } catch (error) {
        let cleanupFailed = created;
        if (created && directoryIdentity) {
          try { checkRun(value.runId, directoryIdentity); fs.rmdirSync(directory); cleanupFailed = false; }
          catch { cleanupFailed = true; }
        }
        return failure(error, 'write-failed', cleanupFailed);
      }
    },
    read(runId) {
      if (!validId(runId)) return failure(new StoreFailure('invalid-id'), 'invalid-id');
      try { return { ok: true, value: readCurrent(runId).value }; }
      catch (error) { return failure(error, 'read-failed'); }
    },
    finish(input) {
      const validated = validateRun(input);
      if (!validated.ok) return failure(new StoreFailure('invalid-run'), 'invalid-run');
      const value = validated.value;
      if (!validId(value.runId)) return failure(new StoreFailure('invalid-id'), 'invalid-id');
      if (value.status === 'running') return failure(new StoreFailure('invalid-transition'), 'invalid-transition');
      try {
        const current = readCurrent(value.runId);
        checkTransition(current.value, value);
        const buffer = Buffer.from(JSON.stringify(value, null, 2) + '\n');
        const success = { ok: true as const, value };
        return publish(success, buffer, current.directory, false, current.canonical);
      } catch (error) { return failure(error, 'read-failed'); }
    },
  };
  return { ok: true, value: repository };
}
