import fs from 'node:fs';
import path from 'node:path';
import { hasCode, reject } from './store-errors.ts';

const deviceName = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i;

export function validId(input: unknown): input is string {
  return typeof input === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.exec(input)?.[0] === input
    && !deviceName.test(input);
}
function samePath(left: string, right: string): boolean { return left.toLowerCase() === right.toLowerCase(); }
export function sameIdentity(left: fs.Stats, right: fs.Stats): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}
function statEntry(target: string): fs.Stats {
  try { return fs.lstatSync(target); }
  catch (error) {
    if (hasCode(error, 'ENOENT')) reject('not-found');
    throw error;
  }
}
export function ordinaryDirectory(target: string): fs.Stats {
  const stat = statEntry(target);
  if (!stat.isDirectory() || stat.isSymbolicLink() || !samePath(fs.realpathSync(target), target)) reject('unsafe-path');
  return stat;
}
export function ordinaryFile(target: string): fs.Stats {
  const stat = statEntry(target);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 || !samePath(fs.realpathSync(target), target)) reject('unsafe-path');
  return stat;
}
export function walkRoot(root: string, establish: boolean): fs.Stats {
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
export function establishRunRoot(rootDirectory: string): { root: string; identity: fs.Stats } {
  if (typeof rootDirectory !== 'string' || !/^[A-Za-z]:[\\/]/.test(rootDirectory)
    || rootDirectory.includes('\0') || rootDirectory.slice(2).includes(':')) reject('unsafe-path');
  for (const component of rootDirectory.slice(3).split(/[\\/]/)) {
    if (component === '.' || component === '..') continue;
    if (deviceName.test(component) || /[. ]$/.test(component)) reject('unsafe-path');
  }
  const root = path.resolve(rootDirectory);
  return { root, identity: walkRoot(root, true) };
}
export function entryName(directory: string, expected: string): string | undefined {
  try { return fs.readdirSync(directory).find(name => samePath(name, expected)); }
  catch { return reject('read-failed'); }
}
export function requireExactEntry(directory: string, expected: string): void {
  const found = entryName(directory, expected);
  if (found === undefined) reject('not-found');
  if (found !== expected) reject('identity-mismatch');
}
