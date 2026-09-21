import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import * as operation from './helpers/m602-operation.ts';
import { readOriginalM602Case } from './helpers/m602-historical-evidence.ts';
import { parseM602Arguments } from './helpers/m602-run-case.ts';

const digest = 'a'.repeat(64);
const otherDigest = 'b'.repeat(64);
const expectedWire = Object.freeze({ sha256: digest, bytes: 17 });
const observation = (outcome: string, validation: 'failed' | 'passed' | 'not-run' = 'not-run') =>
  Object.freeze({ adapterConfiguration: Object.freeze({}), outcome, validation });

function result(overrides: Record<string, unknown> = {}): operation.M602Result {
  return Object.freeze({
    version: 'm602-evidence-v1', caseLabel: 'local-image', enteredSha256: digest,
    dispatchSha256: otherDigest, finishedAt: '2026-09-20T12:00:04.000Z', status: 'failed',
    error: 'response-validation', attempted: true, cleanupFailed: false,
    observation: Object.freeze({ adapterConfiguration: Object.freeze({}), outcome: 'response', validation: 'failed' }),
    wire: expectedWire, requests: Object.freeze({ version: 1, show: 1, tags: 1, chat: 1 }),
    chatWindow: Object.freeze({ startedAt: '2026-09-20T12:00:01.000Z', finishedAt: '2026-09-20T12:00:03.000Z' }),
    proposal: null,
    ...overrides,
  }) as operation.M602Result;
}

test('collector accepts every compatibility row and only the one permitted mixed adapter set', () => {
  const rows = [
    ['adapter-response/body', result()],
    ['adapter-response/envelope', result({ cleanupFailed: true })],
    ['adapter-response/content', result({ error: 'timeout' })],
    ['adapter-response/body', result({ error: 'shutdown', cleanupFailed: true,
      observation: observation('shutdown') })],
    ['adapter-response/envelope', result({ error: 'timeout', cleanupFailed: true,
      observation: observation('network') })],
    ['adapter-response/content', result({ error: 'network', cleanupFailed: true,
      observation: observation('network') })],
    ['adapter-response/unspecified', result()],
    ['adapter-response/unspecified', result({ error: 'shutdown' })],
    ['candidate/contract', result()],
    ['executor/envelope', result({ error: 'provider', cleanupFailed: true,
      observation: observation('provider') })],
    ['executor/envelope', result({ error: 'timeout', cleanupFailed: true,
      observation: observation('provider') })],
    ['executor/envelope', result({ error: 'shutdown', cleanupFailed: true,
      observation: observation('shutdown') })],
    ['caller/correspondence', result({
      observation: observation('response', 'passed'),
      wire: Object.freeze({ sha256: otherDigest, bytes: 17 }),
    })],
  ] as const;
  for (const [code, linked] of rows) {
    const collector = operation.createM602DiagnosticCollector();
    collector.onRejection(Object.freeze({ code }));
    assert.deepEqual(collector.close(linked, expectedWire), { integrity: 'complete', code }, code);
  }

  for (const detailed of ['adapter-response/body', 'adapter-response/envelope', 'adapter-response/content'] as const) {
    for (const order of [[detailed, 'adapter-response/unspecified'], ['adapter-response/unspecified', detailed]] as const) {
      const collector = operation.createM602DiagnosticCollector();
      for (const code of order) collector.onRejection(Object.freeze({ code }));
      collector.onRejection(Object.freeze({ code: detailed }));
      assert.deepEqual(collector.close(result(), expectedWire), { integrity: 'complete', code: detailed });
    }
  }

  const empty = operation.createM602DiagnosticCollector();
  assert.deepEqual(empty.close(result(), expectedWire), { integrity: 'complete', code: null });
});

test('collector permanently fails closed for malformed, conflicting, or incompatible evidence', () => {
  const cases: readonly [readonly unknown[], operation.M602Result, Readonly<{ sha256: string; bytes: number }> | null][] = [
    [[null], result(), expectedWire],
    [[{}], result(), expectedWire],
    [[{ code: 'unknown' }], result(), expectedWire],
    [[{ code: 'candidate/contract', extra: true }], result(), expectedWire],
    [[{ code: 'candidate/contract' }, { code: 'executor/envelope' }], result(), expectedWire],
    [[{ code: 'adapter-response/body' }, { code: 'adapter-response/content' }], result(), expectedWire],
    [[{ code: 'candidate/contract' }], result({ cleanupFailed: true }), expectedWire],
    [[{ code: 'candidate/contract' }], result({ attempted: false, dispatchSha256: null, observation: null,
      wire: null, chatWindow: null, requests: Object.freeze({ version: 0, show: 0, tags: 0, chat: 0 }) }), expectedWire],
    [[{ code: 'candidate/contract' }], result({ error: 'provider', cleanupFailed: true,
      observation: observation('provider') }), expectedWire],
    [[{ code: 'executor/envelope' }], result(), expectedWire],
    [[{ code: 'executor/envelope' }], result({ error: 'timeout', cleanupFailed: false,
      observation: observation('provider') }), expectedWire],
    [[{ code: 'adapter-response/unspecified' }], result({ error: 'network', cleanupFailed: true,
      observation: observation('network') }), expectedWire],
    [[{ code: 'adapter-response/unspecified' }], result({ error: 'timeout', cleanupFailed: true,
      observation: observation('timeout') }), expectedWire],
    [[{ code: 'caller/correspondence' }], result({
      observation: observation('response', 'passed'),
    }), expectedWire],
    [[{ code: 'caller/correspondence' }], result({ error: 'timeout', cleanupFailed: true,
      observation: observation('timeout') }), expectedWire],
    [[{ code: 'caller/correspondence' }], result({ status: 'proposal', error: null,
      observation: observation('response', 'passed'), proposal: Object.freeze({}) }), expectedWire],
    [[{ code: 'caller/correspondence' }], result({ observation: observation('response', 'passed') }), null],
  ];
  for (const [events, linked, wire] of cases) {
    const collector = operation.createM602DiagnosticCollector();
    for (const event of events) collector.onRejection(event as never);
    assert.deepEqual(collector.close(linked, wire), { integrity: 'failed', code: null });
  }

  for (const hostile of [
    Object.defineProperty({}, 'code', { enumerable: true, get() { throw new Error('SECRET accessor'); } }),
    new Proxy({ code: 'candidate/contract' }, { ownKeys() { throw new Error('SECRET keys'); } }),
  ]) {
    const collector = operation.createM602DiagnosticCollector();
    collector.onRejection(hostile as never);
    assert.deepEqual(collector.close(result(), expectedWire), { integrity: 'failed', code: null });
  }

  const latched = operation.createM602DiagnosticCollector();
  latched.onRejection(Object.freeze({ code: 'candidate/contract' }));
  latched.onRejection(Object.freeze({ code: 'executor/envelope' }));
  latched.onRejection(Object.freeze({ code: 'candidate/contract' }));
  assert.deepEqual(latched.close(result(), expectedWire), { integrity: 'failed', code: null });
});

test('collector freezes the first close and ignores all later events and result changes', () => {
  const collector = operation.createM602DiagnosticCollector();
  collector.onRejection(Object.freeze({ code: 'candidate/contract' }));
  const first = collector.close(result(), expectedWire);
  collector.onRejection(Object.freeze({ code: 'executor/envelope' }));
  const second = collector.close(result({ cleanupFailed: true }), null);
  assert.strictEqual(second, first);
  assert.deepEqual(first, { integrity: 'complete', code: 'candidate/contract' });
  assert.equal(Object.isFrozen(first), true);
});

test('original-only reader fails closed through mocked filesystem faults without accepting overrides', async t => {
  let reads = 0;
  t.mock.method(fs, 'lstatSync', () => { throw new Error('synthetic historical failure'); });
  t.mock.method(fs, 'readFileSync', () => { reads++; throw new Error('must not read after topology failure'); });
  assert.deepEqual(await Promise.resolve(readOriginalM602Case()), { ok: false, error: 'evidence-blocked' });
  assert.equal(reads, 0);
  t.mock.restoreAll();
});

test('CLI admits only exact original inspection and never turns it into execution eligibility', () => {
  assert.deepEqual(parseM602Arguments(['--inspect-original', '--case', 'local-image']), {
    ok: true, mode: 'inspect-original', caseLabel: 'local-image',
  });
  for (const args of [
    ['--inspect-original', '--case', 'local-label'], ['--inspect-original', '--case', 'groq-image'],
    ['--inspect-original'], ['--inspect-original', '--case', 'local-image', '--execute'],
  ]) assert.deepEqual(parseM602Arguments(args), { ok: false, error: 'arguments' });
});
