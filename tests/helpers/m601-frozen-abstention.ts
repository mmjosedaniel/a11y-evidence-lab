import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFinding } from '../../src/server/domain/run-contract/finding-validation.ts';

const repo = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const manifestPath = path.join(repo, 'evaluation/m301-generation-v1.json');
const packageRelativePath = 'temp/m301-generation-freeze-v1/no-call.json';
const packagePath = path.join(repo, packageRelativePath);
const manifestSha256 = '63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b';
const packageSha256 = '1b07d5d764ad99bb028db1aef767b9bb9d0685661b5ad761731d60f93394b6dd';

type JsonRecord = Record<string, unknown>;

export type FrozenAbstentionBinding = {
  readonly native: ReturnType<typeof readFinding>;
  readonly passageIds: readonly ['wcag22-sc111', 'understanding111-intent'];
  readonly expected: {
    readonly support: 'incomplete';
    readonly missingRoles: readonly ['remediation'];
    readonly reason: 'incomplete-guidance';
    readonly providerCalled: false;
    readonly providerInvocation: false;
    readonly proposal: false;
    readonly reviewDecision: false;
  };
  readonly explanation: string;
  readonly manualInvestigation: string;
  readonly packageSha256: string;
};

function sha256(bytes: Uint8Array): string {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function record(value: unknown, keys?: readonly string[]): JsonRecord {
  assert.ok(value !== null && typeof value === 'object' && !Array.isArray(value));
  assert.equal(Object.getPrototypeOf(value), Object.prototype);
  const actual = Object.keys(value as JsonRecord).sort();
  if (keys) assert.deepEqual(actual, [...keys].sort());
  for (const key of actual) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    assert.ok(descriptor && 'value' in descriptor && descriptor.enumerable);
  }
  return value as JsonRecord;
}

function json(bytes: Uint8Array): unknown {
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

function ordinaryFile(file: string): void {
  const resolved = path.resolve(file);
  assert.ok(resolved.startsWith(repo + path.sep));
  let current = resolved;
  let first = true;
  for (;;) {
    const item = fs.lstatSync(current);
    assert.equal(item.isSymbolicLink(), false);
    assert.ok(first ? item.isFile() && item.nlink === 1 : item.isDirectory());
    assert.equal(fs.realpathSync.native(current).toLowerCase(), current.toLowerCase());
    if (current === repo) break;
    current = path.dirname(current);
    first = false;
  }
}

export function authenticateFrozenAbstentionBytes(
  manifestBytes: Uint8Array,
  packageBytes: Uint8Array | undefined,
): FrozenAbstentionBinding {
  assert.equal(sha256(manifestBytes), manifestSha256);
  const manifest = record(json(manifestBytes));
  const shared = record(manifest.shared);
  const noCall = record(shared.noCall, ['caseId', 'frequency', 'path', 'sha256']);
  assert.equal(noCall.caseId, 'shared-incomplete-guidance');
  assert.equal(noCall.frequency, 'once-provider-independent');
  assert.equal(noCall.path, packageRelativePath);
  assert.equal(String(noCall.sha256).toLowerCase(), packageSha256);
  assert.ok(packageBytes, 'Frozen no-call package is required');
  assert.equal(sha256(packageBytes), packageSha256);

  const input = record(json(packageBytes), [
    'version', 'caseId', 'native', 'passageIds', 'expected', 'explanation', 'manualInvestigation',
  ]);
  assert.equal(input.version, 'm301-generation-v1');
  assert.equal(input.caseId, 'shared-incomplete-guidance');
  assert.deepEqual(input.passageIds, ['wcag22-sc111', 'understanding111-intent']);
  const expected = record(input.expected, [
    'support', 'missingRoles', 'reason', 'providerCalled', 'providerInvocation', 'proposal', 'reviewDecision',
  ]);
  assert.deepEqual(expected, {
    support: 'incomplete', missingRoles: ['remediation'], reason: 'incomplete-guidance',
    providerCalled: false, providerInvocation: false, proposal: false, reviewDecision: false,
  });
  const explanation = input.explanation;
  const manualInvestigation = input.manualInvestigation;
  assert.ok(typeof explanation === 'string');
  assert.ok(explanation.length > 0);
  assert.match(explanation, /remediation/i);
  assert.ok(typeof manualInvestigation === 'string');
  assert.ok(manualInvestigation.length > 0);
  return Object.freeze({
    native: readFinding(input.native),
    passageIds: Object.freeze(['wcag22-sc111', 'understanding111-intent'] as const),
    expected: Object.freeze({
      support: 'incomplete' as const,
      missingRoles: Object.freeze(['remediation'] as const),
      reason: 'incomplete-guidance' as const,
      providerCalled: false as const,
      providerInvocation: false as const,
      proposal: false as const,
      reviewDecision: false as const,
    }),
    explanation,
    manualInvestigation,
    packageSha256,
  });
}

export function loadOptInFrozenAbstention(): FrozenAbstentionBinding {
  assert.equal(process.env.A11Y_M601_FROZEN_NO_CALL, '1', 'Frozen no-call observation requires exact opt-in');
  ordinaryFile(manifestPath);
  ordinaryFile(packagePath);
  return authenticateFrozenAbstentionBytes(fs.readFileSync(manifestPath), fs.readFileSync(packagePath));
}
