import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateRun } from '../domain/run-contract.ts';
import type { PageAnalysisRun } from '../domain/run-contract.ts';
import type { RunRepository, RunningRun, StoreResult, TerminalRun } from './run-repository/contracts.ts';
import { StoreFailure, failure, hasCode, reject } from './run-repository/store-errors.ts';
import { checkTransition } from './run-repository/run-transition.ts';
import {
  entryName,
  establishRunRoot,
  ordinaryDirectory,
  ordinaryFile,
  requireExactEntry,
  sameIdentity,
  validId,
  walkRoot,
} from './run-repository/windows-run-paths.ts';

export type {
  CompletedRun,
  FailedRun,
  RunRepository,
  RunningRun,
  StoreError,
  StoreResult,
  TerminalRun,
} from './run-repository/contracts.ts';

export function openRunRepository(rootDirectory: string): StoreResult<RunRepository> {
  let root: string;
  let rootIdentity: fs.Stats;
  try {
    ({ root, identity: rootIdentity } = establishRunRoot(rootDirectory));
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
