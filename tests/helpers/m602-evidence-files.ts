import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
export type EvidenceFilesystem = Pick<typeof fs, 'mkdirSync' | 'openSync' | 'writeSync' | 'fsyncSync' | 'closeSync'
  | 'lstatSync' | 'realpathSync' | 'readFileSync' | 'readdirSync'>;
export const hash = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex');
export const json = (value: unknown) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
export function ordinary(target: string, filesystem: EvidenceFilesystem, file: boolean) {
  const absolute = path.resolve(target);
  let current = path.parse(absolute).root;
  const parts = absolute.slice(current.length).split(path.sep);
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    const stat = filesystem.lstatSync(current);
    assert.equal(stat.isSymbolicLink(), false);
    assert.equal(filesystem.realpathSync(current).toLowerCase(), current.toLowerCase());
    if (index === parts.length - 1 && file) assert.ok(stat.isFile() && stat.nlink === 1 && stat.size <= 1048576);
    else assert.ok(stat.isDirectory());
  }
}
export function publish(directory: string, name: string, value: unknown, filesystem: EvidenceFilesystem): string {
  ordinary(directory, filesystem, false);
  const bytes = json(value);
  assert.ok(bytes.length <= 1048576);
  const target = path.join(directory, name);
  let descriptor: number | undefined;
  try {
    descriptor = filesystem.openSync(target, 'wx');
    let offset = 0;
    while (offset < bytes.length) {
      const written = filesystem.writeSync(descriptor, bytes, offset, bytes.length - offset, offset);
      assert.ok(Number.isSafeInteger(written) && written > 0 && written <= bytes.length - offset);
      offset += written;
    }
    filesystem.fsyncSync(descriptor);
    const closing = descriptor;
    descriptor = undefined;
    filesystem.closeSync(closing);
    ordinary(target, filesystem, true);
    assert.deepEqual(filesystem.readFileSync(target), bytes);
    return hash(bytes);
  } finally {
    if (descriptor !== undefined) filesystem.closeSync(descriptor);
  }
}
export function record(directory: string, name: string, filesystem: EvidenceFilesystem) {
  const target = path.join(directory, name);
  ordinary(target, filesystem, true);
  const bytes = filesystem.readFileSync(target);
  assert.ok(bytes instanceof Uint8Array && bytes.length <= 1048576);
  assert.ok(!(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191));
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const value: unknown = JSON.parse(text);
  assert.deepEqual(json(value), bytes);
  return { value, sha256: hash(bytes) };
}

