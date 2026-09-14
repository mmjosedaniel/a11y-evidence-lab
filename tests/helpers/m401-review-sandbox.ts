import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const tempParent = path.join(repositoryRoot, 'temp');
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;

type OwnedService = {
  readonly url: string;
  stop(): Promise<unknown>;
};

export type ReviewSandbox = {
  readonly root: string;
  readonly runs: string;
  readonly services: OwnedService[];
  readonly releases: Array<() => void>;
  preserve: boolean;
};

function retained(root: string, message: string, cause: unknown): Error {
  return new Error(`${message}; retained review sandbox: ${root}`, { cause });
}

function ordinaryAncestors(target: string): void {
  let current = path.resolve(target);
  for (;;) {
    const stat = fs.lstatSync(current);
    assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), 'Review sandbox ancestor must be ordinary');
    assert.equal(fs.realpathSync(current).toLowerCase(), current.toLowerCase());
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function ordinaryInventory(target: string): void {
  for (const name of fs.readdirSync(target)) {
    const child = path.join(target, name);
    const stat = fs.lstatSync(child);
    assert.equal(stat.isSymbolicLink(), false, 'Unexpected link preserves the exact review sandbox');
    if (stat.isDirectory()) ordinaryInventory(child);
    else assert.ok(stat.isFile() && stat.nlink === 1, 'Unexpected file topology preserves the exact review sandbox');
  }
}

async function within<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = nativeSetTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally {
    nativeClearTimeout(timer);
  }
}

async function portClosed(url: string): Promise<void> {
  const address = new URL(url);
  await new Promise<void>((resolve, reject) => {
    const socket = net.connect({ host: address.hostname, port: Number(address.port) });
    socket.setTimeout(3000, () => {
      socket.destroy();
      reject(new Error('Owned review service port did not close'));
    });
    socket.once('connect', () => {
      socket.destroy();
      reject(new Error('Owned review service remains reachable'));
    });
    socket.once('error', (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === 'ECONNREFUSED') resolve();
      else reject(error);
    });
  });
}

export async function withReviewSandbox(
  kind: 'repository' | 'service',
  body: (sandbox: ReviewSandbox) => void | Promise<void>,
): Promise<void> {
  ordinaryAncestors(tempParent);
  const before = new Set(fs.readdirSync(tempParent));
  const root = fs.mkdtempSync(path.join(tempParent, `m401-review-${kind}-`));
  const sandbox: ReviewSandbox = {
    root,
    runs: path.join(root, 'runs'),
    services: [],
    releases: [],
    preserve: false,
  };
  const errors: unknown[] = [];
  try {
    assert.equal(path.dirname(root), path.resolve(tempParent));
    assert.equal(before.has(path.basename(root)), false);
    assert.deepEqual(fs.readdirSync(root), []);
    await body(sandbox);
  } catch (error) {
    errors.push(error);
  }
  for (const release of sandbox.releases) {
    try { release(); }
    catch (error) {
      sandbox.preserve = true;
      errors.push(retained(root, 'Owned review collaborator release failed', error));
    }
  }
  for (const service of sandbox.services) {
    try { await within(service.stop(), 6500, 'Owned review service stop did not settle'); }
    catch (error) {
      sandbox.preserve = true;
      errors.push(retained(root, 'Owned review service stop failed', error));
    }
    try { await portClosed(service.url); }
    catch (error) {
      sandbox.preserve = true;
      errors.push(retained(root, 'Owned review service port remained uncertain', error));
    }
  }
  try {
    assert.equal(path.dirname(root), path.resolve(tempParent));
    assert.match(path.basename(root), new RegExp(`^m401-review-${kind}-`));
    ordinaryAncestors(root);
    ordinaryInventory(root);
    if (!sandbox.preserve) {
      fs.rmSync(root, { recursive: true, force: false });
      assert.equal(fs.existsSync(root), false);
    }
  } catch (error) {
    sandbox.preserve = true;
    errors.push(retained(root, 'Review sandbox topology or removal failed', error));
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Review test or owned cleanup failed');
}
