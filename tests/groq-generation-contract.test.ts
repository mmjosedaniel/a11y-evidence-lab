import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import {
  GENERATION_SCHEMA,
  GROQ_PARAMETERS,
  OUTPUT_CONTRACT_VERSION,
  PROMPT_VERSION,
  SCHEMA_VERSION,
} from '../src/server/generation/generation-artifacts.ts';
import type { GenerationRequest } from '../src/server/generation/generation-contract.ts';
import {
  parseGroqCredential,
  readGroqCredential,
} from '../src/server/generation/groq-credential.ts';
import { GROQ_CONFIGURATION } from '../src/server/generation/groq-generation-configuration.ts';
import { prepareGroqGenerationWire } from '../src/server/generation/groq-generation-fit.ts';
import {
  expectedGroqBody,
  flushAsyncWork,
  GROQ_ENV_PATH,
  GROQ_REPOSITORY_ROOT,
  groqGenerationRequest,
  nodeError,
  requestAtSerializedBytes,
  virtualCredentialIO,
} from './helpers/m304-groq-fixture.ts';

const encode = (value: string) => new TextEncoder().encode(value);
const completeMissing = Object.freeze({ ok: false, error: 'missing-prerequisite', cleanup: 'complete' });
const completeConfiguration = Object.freeze({ ok: false, error: 'configuration', cleanup: 'complete' });
const uncertainConfiguration = Object.freeze({ ok: false, error: 'configuration', cleanup: 'uncertain' });

function assertDeepFrozen(value: unknown): void {
  if (typeof value !== 'object' || value === null) return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function mutableRequest(request: GenerationRequest): Record<string, unknown> {
  return { ...request };
}

async function settlesBeforeRelease<T>(promise: Promise<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error('Credential cancellation did not settle while native work was pending')), 1000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

test('parses only the selected credential with exact quoting, comments and literal-value grammar', () => {
  const cases = [
    ['plain', 'GROQ_API_KEY=synthetic-key\n', 'synthetic-key'],
    ['horizontal whitespace', '\t GROQ_API_KEY \t=\t synthetic-key \t # ignored\r\n', 'synthetic-key'],
    ['optional export and BOM', '\uFEFF export\tGROQ_API_KEY="synthetic#$key" # ignored\n', 'synthetic#$key'],
    ['single quoted hash', "GROQ_API_KEY='synthetic#key'\n", 'synthetic#key'],
    ['literal dollar', 'OTHER=value\n# comment\nGROQ_API_KEY=$synthetic\nANOTHER="ignored"\n', '$synthetic'],
    ['prefix is unrelated', 'GROQ_API_KEY_EXTRA=ignored\nGROQ_API_KEY=selected\n', 'selected'],
    ['malformed unrelated assignment is ignored', 'OTHER value\nGROQ_API_KEY=selected\n', 'selected'],
  ] as const;
  for (const [name, source, credential] of cases) {
    assert.deepEqual(parseGroqCredential(encode(source)), {
      ok: true, credential, cleanup: 'complete',
    }, name);
  }
});

test('classifies missing and empty selected credentials without treating unrelated names as the key', () => {
  for (const [name, source] of [
    ['empty file', ''],
    ['comments and unrelated assignments', '# GROQ_API_KEY=commented\nOTHER=value\n'],
    ['empty unquoted', 'GROQ_API_KEY= \t # empty\n'],
    ['empty single quoted', "GROQ_API_KEY=''\n"],
    ['empty double quoted', 'GROQ_API_KEY=""\n'],
  ] as const) {
    assert.deepEqual(parseGroqCredential(encode(source)), completeMissing, name);
  }
});

test('rejects duplicate, malformed, unsafe and non-ASCII credential material with closed results', () => {
  const invalidSources: readonly [string, string | Uint8Array][] = [
    ['duplicate valid values', 'GROQ_API_KEY=first\nGROQ_API_KEY=second\n'],
    ['duplicate containing empty value', 'GROQ_API_KEY=\nGROQ_API_KEY=second\n'],
    ['missing selected equals', 'GROQ_API_KEY selected\n'],
    ['unterminated single quote', "GROQ_API_KEY='selected\n"],
    ['unterminated double quote', 'GROQ_API_KEY="selected\n'],
    ['trailing quoted material', "GROQ_API_KEY='selected' trailing\n"],
    ['backslash', 'GROQ_API_KEY=synthetic\\key\n'],
    ['embedded whitespace', 'GROQ_API_KEY=synthetic key\n'],
    ['non-ASCII', 'GROQ_API_KEY=synthetic-é\n'],
    ['remaining carriage return', 'GROQ_API_KEY=selected\rOTHER=value\n'],
    ['NUL', 'GROQ_API_KEY=selected\u0000\n'],
    ['control character', 'GROQ_API_KEY=selected\u0007\n'],
    ['invalid UTF-8', Uint8Array.from([0x47, 0x52, 0x4f, 0x51, 0x3d, 0xc3, 0x28])],
    ['second BOM', '\uFEFFGROQ_API_KEY=selected\n\uFEFF'],
  ];
  for (const [name, source] of invalidSources) {
    const bytes = typeof source === 'string' ? encode(source) : source;
    assert.deepEqual(parseGroqCredential(bytes), completeConfiguration, name);
  }
});

test('treats Unicode line and paragraph separators as physical-line content without hiding selected assignments', () => {
  for (const [separatorName, separator] of [
    ['U+2028 line separator', '\u2028'],
    ['U+2029 paragraph separator', '\u2029'],
  ] as const) {
    const invalidCases = [
      ['sole malformed selected value', `GROQ_API_KEY=synthetic${separator}key\n`],
      ['malformed selected before valid duplicate', `GROQ_API_KEY=bad${separator}value\nGROQ_API_KEY=valid\n`],
      ['valid selected before malformed duplicate', `GROQ_API_KEY=valid\nGROQ_API_KEY=bad${separator}value\n`],
    ] as const;
    for (const [name, source] of invalidCases) {
      assert.deepEqual(parseGroqCredential(encode(source)), completeConfiguration, `${separatorName}: ${name}`);
    }

    const allowedCases = [
      ['quoted trailing comment', `GROQ_API_KEY='selected' # comment${separator}content\n`],
      ['unquoted trailing comment', `GROQ_API_KEY=selected # comment${separator}content\n`],
      ['unrelated value', `OTHER=ignored${separator}content\nGROQ_API_KEY=selected\n`],
      ['full comment', `# ignored${separator}content\nGROQ_API_KEY=selected\n`],
    ] as const;
    for (const [name, source] of allowedCases) {
      assert.deepEqual(parseGroqCredential(encode(source)), {
        ok: true, credential: 'selected', cleanup: 'complete',
      }, `${separatorName}: ${name}`);
    }
  }
});

test('enforces inclusive file and visible-ASCII credential bounds', () => {
  const maximumCredential = 'k'.repeat(4096);
  assert.deepEqual(parseGroqCredential(encode(`GROQ_API_KEY=${maximumCredential}\n`)), {
    ok: true, credential: maximumCredential, cleanup: 'complete',
  });
  assert.deepEqual(parseGroqCredential(encode(`GROQ_API_KEY=${'k'.repeat(4097)}\n`)), completeConfiguration);

  const prefix = 'GROQ_API_KEY=selected\n#';
  const atFileLimit = prefix + 'x'.repeat(65536 - Buffer.byteLength(prefix));
  assert.equal(Buffer.byteLength(atFileLimit), 65536);
  assert.deepEqual(parseGroqCredential(encode(atFileLimit)), {
    ok: true, credential: 'selected', cleanup: 'complete',
  });
  assert.deepEqual(parseGroqCredential(encode(`${atFileLimit}x`)), completeConfiguration);
});

test('loads the fixed root credential through canonical virtual topology and clears owned buffers', async () => {
  const fixture = virtualCredentialIO({
    content: '# unrelated\nGROQ_API_KEY=synthetic-key\n',
    readChunkSize: 3,
  });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, fixture.io), {
    ok: true, credential: 'synthetic-key', cleanup: 'complete',
  });
  assert.deepEqual(fixture.calls.open, [{ path: path.resolve(GROQ_ENV_PATH), flags: 'r' }]);
  assert.equal(fixture.calls.close, 1);
  assert.ok(fixture.calls.lstat.includes(path.resolve(GROQ_REPOSITORY_ROOT)));
  assert.ok(fixture.calls.lstat.includes(path.resolve(GROQ_ENV_PATH)));
  assert.ok(fixture.calls.realpath.includes(path.resolve(GROQ_ENV_PATH)));
  assert.ok(fixture.calls.read.length > 1);
  assert.ok(fixture.calls.buffers.length > 0);
  for (const buffer of fixture.calls.buffers) assert.ok(buffer.every(byte => byte === 0));
});

test('rejects startup native debug state before topology or credential reads', async () => {
  const fixture = virtualCredentialIO({ debugSequence: [true] });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, fixture.io), completeConfiguration);
  assert.equal(fixture.calls.debug, 1);
  assert.deepEqual(fixture.calls.lstat, []);
  assert.deepEqual(fixture.calls.open, []);
  assert.deepEqual(fixture.calls.read, []);
});

test('distinguishes a missing selected leaf from missing or unreadable topology without native fallback', async () => {
  const missingLeaf = virtualCredentialIO();
  const missingLeafIO = {
    ...missingLeaf.io,
    async lstat(candidate: string) {
      if (path.resolve(candidate) === path.resolve(GROQ_ENV_PATH)) throw nodeError('ENOENT');
      return missingLeaf.io.lstat(candidate);
    },
  };
  assert.deepEqual(await readGroqCredential(new AbortController().signal, missingLeafIO), completeMissing);
  assert.deepEqual(missingLeaf.calls.open, []);

  const missingAncestor = virtualCredentialIO();
  const ancestor = path.dirname(path.resolve(GROQ_REPOSITORY_ROOT));
  const missingAncestorIO = {
    ...missingAncestor.io,
    async lstat(candidate: string) {
      if (path.resolve(candidate) === ancestor) throw nodeError('ENOENT');
      return missingAncestor.io.lstat(candidate);
    },
  };
  assert.deepEqual(await readGroqCredential(new AbortController().signal, missingAncestorIO), completeConfiguration);
  assert.deepEqual(missingAncestor.calls.open, []);

  const unreadable = virtualCredentialIO({ openError: nodeError('EACCES') });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, unreadable.io), completeConfiguration);
  assert.equal(unreadable.calls.open.length, 1);
  assert.deepEqual(unreadable.calls.read, []);
});

test('fails unsafe, linked, aliased and oversized initial credential paths before open', async () => {
  const cases = [
    ['symbolic link', (fixture: ReturnType<typeof virtualCredentialIO>) => {
      fixture.pathStats.set(path.resolve(GROQ_ENV_PATH), fixture.stat({ symbolicLink: true }));
    }],
    ['multiple links', (fixture: ReturnType<typeof virtualCredentialIO>) => {
      fixture.pathStats.set(path.resolve(GROQ_ENV_PATH), fixture.stat({ links: 2 }));
    }],
    ['not a regular file', (fixture: ReturnType<typeof virtualCredentialIO>) => {
      fixture.pathStats.set(path.resolve(GROQ_ENV_PATH), fixture.stat({ file: false, directory: true }));
    }],
    ['oversized stat', (fixture: ReturnType<typeof virtualCredentialIO>) => {
      fixture.pathStats.set(path.resolve(GROQ_ENV_PATH), fixture.stat({ size: 65537 }));
    }],
    ['aliased leaf', (fixture: ReturnType<typeof virtualCredentialIO>) => {
      fixture.realpaths.set(path.resolve(GROQ_ENV_PATH), `${path.resolve(GROQ_ENV_PATH)}-other`);
    }],
    ['non-directory ancestor', (fixture: ReturnType<typeof virtualCredentialIO>) => {
      fixture.pathStats.set(path.resolve(GROQ_REPOSITORY_ROOT), fixture.stat({ file: true, directory: false }));
    }],
  ] as const;
  for (const [name, mutate] of cases) {
    const fixture = virtualCredentialIO();
    mutate(fixture);
    assert.deepEqual(await readGroqCredential(new AbortController().signal, fixture.io), completeConfiguration, name);
    assert.deepEqual(fixture.calls.open, [], name);
    assert.deepEqual(fixture.calls.read, [], name);
  }
});

test('compares descriptor and path identity before and after the bounded read', async () => {
  const before = virtualCredentialIO();
  before.descriptorStats[0] = before.stat({ inode: 9002 });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, before.io), completeConfiguration);
  assert.deepEqual(before.calls.read, []);
  assert.equal(before.calls.close, 1);

  const afterDescriptor = virtualCredentialIO();
  afterDescriptor.descriptorStats[1] = afterDescriptor.stat({ inode: 9002 });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, afterDescriptor.io), completeConfiguration);
  assert.ok(afterDescriptor.calls.read.length > 0);
  assert.equal(afterDescriptor.calls.close, 1);

  const afterPath = virtualCredentialIO({ holdRead: true });
  const pending = readGroqCredential(new AbortController().signal, afterPath.io);
  await flushAsyncWork();
  assert.equal(afterPath.calls.read.length, 1);
  afterPath.pathStats.set(path.resolve(GROQ_ENV_PATH), afterPath.stat({ inode: 9002 }));
  afterPath.control.releaseRead();
  assert.deepEqual(await pending, completeConfiguration);
  assert.equal(afterPath.calls.close, 1);
});

test('reports failed close honestly and never returns a usable credential', async () => {
  const fixture = virtualCredentialIO({ closeError: nodeError('EIO') });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, fixture.io), uncertainConfiguration);
  assert.equal(fixture.calls.close, 1);
  for (const buffer of fixture.calls.buffers) assert.ok(buffer.every(byte => byte === 0));
});

test('bounds a credential file that grows during reading and clears the entire owned read capacity', async () => {
  const fixture = virtualCredentialIO({
    content: Uint8Array.from({ length: 70000 }, () => 0x61),
    readChunkSize: 8192,
  });
  const admittedStat = fixture.stat({ size: 65536 });
  fixture.pathStats.set(path.resolve(GROQ_ENV_PATH), admittedStat);
  fixture.descriptorStats[0] = admittedStat;
  fixture.descriptorStats[1] = admittedStat;

  assert.deepEqual(await readGroqCredential(new AbortController().signal, fixture.io), completeConfiguration);
  assert.equal(fixture.calls.close, 1);
  assert.ok(fixture.calls.read.length > 1);
  assert.equal(fixture.calls.read.reduce((total, call) => total + (call.bytesRead ?? 0), 0), 65537);
  assert.ok(fixture.calls.read.every(call => call.offset >= 0 && call.length >= 0
    && call.offset + call.length <= 65537 && call.position <= 65537));
  assert.ok(fixture.calls.buffers.every(buffer => buffer.byteLength <= 65537));
  for (const buffer of fixture.calls.buffers) assert.ok(buffer.every(byte => byte === 0));
});

test('closes and clears owned buffers after a virtual credential read failure', async () => {
  const fixture = virtualCredentialIO({ readError: nodeError('EIO') });
  assert.deepEqual(await readGroqCredential(new AbortController().signal, fixture.io), completeConfiguration);
  assert.equal(fixture.calls.read.length, 1);
  assert.equal(fixture.calls.close, 1);
  for (const buffer of fixture.calls.buffers) assert.ok(buffer.every(byte => byte === 0));
});

test('bounds cancellation before open and closes a handle that arrives after cancellation', async () => {
  const before = new AbortController();
  before.abort();
  const beforeFixture = virtualCredentialIO();
  assert.deepEqual(await readGroqCredential(before.signal, beforeFixture.io), completeConfiguration);
  assert.deepEqual(beforeFixture.calls.open, []);

  const during = new AbortController();
  const fixture = virtualCredentialIO({ holdOpen: true });
  const pending = readGroqCredential(during.signal, fixture.io);
  await flushAsyncWork();
  assert.equal(fixture.calls.open.length, 1);
  during.abort();
  assert.deepEqual(await settlesBeforeRelease(pending), uncertainConfiguration);
  fixture.control.releaseOpen();
  await flushAsyncWork();
  assert.equal(fixture.calls.close, 1);
  assert.deepEqual(fixture.calls.read, []);
});

test('bounds cancellation during read, clears a late buffer and closes the late handle', async () => {
  const controller = new AbortController();
  const fixture = virtualCredentialIO({ holdRead: true });
  const pending = readGroqCredential(controller.signal, fixture.io);
  await flushAsyncWork();
  assert.equal(fixture.calls.read.length, 1);
  controller.abort();
  assert.deepEqual(await settlesBeforeRelease(pending), uncertainConfiguration);
  fixture.control.releaseRead();
  await flushAsyncWork();
  assert.equal(fixture.calls.close, 1);
  for (const buffer of fixture.calls.buffers) assert.ok(buffer.every(byte => byte === 0));
});

test('does not claim complete cleanup while descriptor close remains pending', async () => {
  const controller = new AbortController();
  const fixture = virtualCredentialIO({ holdClose: true });
  const pending = readGroqCredential(controller.signal, fixture.io);
  await flushAsyncWork();
  assert.equal(fixture.calls.close, 1);
  controller.abort();
  assert.deepEqual(await settlesBeforeRelease(pending), uncertainConfiguration);
  fixture.control.releaseClose();
  await flushAsyncWork();
});

test('absorbs late rejected open, read and close work after bounded cancellation', async () => {
  const openController = new AbortController();
  const lateOpen = virtualCredentialIO({ holdOpen: true });
  const openPending = readGroqCredential(openController.signal, lateOpen.io);
  await flushAsyncWork();
  openController.abort();
  assert.deepEqual(await settlesBeforeRelease(openPending), uncertainConfiguration);
  lateOpen.control.rejectOpen(nodeError('EIO'));
  await flushAsyncWork();
  assert.equal(lateOpen.calls.close, 0);

  const readController = new AbortController();
  const lateRead = virtualCredentialIO({ holdRead: true });
  const readPending = readGroqCredential(readController.signal, lateRead.io);
  await flushAsyncWork();
  readController.abort();
  assert.deepEqual(await settlesBeforeRelease(readPending), uncertainConfiguration);
  lateRead.control.rejectRead(nodeError('EIO'));
  await flushAsyncWork();
  assert.equal(lateRead.calls.close, 1);
  for (const buffer of lateRead.calls.buffers) assert.ok(buffer.every(byte => byte === 0));

  const closeController = new AbortController();
  const lateClose = virtualCredentialIO({ holdClose: true });
  const closePending = readGroqCredential(closeController.signal, lateClose.io);
  await flushAsyncWork();
  closeController.abort();
  assert.deepEqual(await settlesBeforeRelease(closePending), uncertainConfiguration);
  lateClose.control.rejectClose(nodeError('EIO'));
  await flushAsyncWork();
  assert.equal(lateClose.calls.close, 1);
});

test('publishes the one exact deeply frozen Groq configuration profile', () => {
  assert.deepEqual(GROQ_CONFIGURATION, {
    providerContext: { mode: 'groq', provider: 'groq', model: 'openai/gpt-oss-20b' },
    adapterId: 'groq-generation',
    adapterVersion: 'm304-groq-v1',
    endpoint: 'groq-chat-completions',
    promptVersion: PROMPT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    outputContractVersion: OUTPUT_CONTRACT_VERSION,
    parameters: GROQ_PARAMETERS,
    binding: {
      kind: 'groq',
      exposedDefaultsIdentity: 'groq-gpt-oss-20b-2026-09-11-v1',
      serverRevision: null,
    },
    accounting: {
      method: 'serialized-byte-budget',
      implementationVersion: 'm304-groq-request-bytes-v1',
      tokenizerIdentity: null,
      maxRequestBytes: 65536,
      contextTokenLimit: 131072,
      outputTokenLimit: 65536,
    },
  });
  assert.equal(GROQ_CONFIGURATION.parameters, GROQ_PARAMETERS);
  assertDeepFrozen(GROQ_CONFIGURATION);
});

test('serializes the exact closed Groq body once and returns its immutable private byte fit', () => {
  const request = groqGenerationRequest('System café 😀\n', 'User e\u0301 and $ literal\n');
  const result = prepareGroqGenerationWire(request);
  const expectedBody = expectedGroqBody(request);
  assert.deepEqual(result, {
    ok: true,
    body: expectedBody,
    fit: {
      accounting: GROQ_CONFIGURATION.accounting,
      serializedRequestBytes: Buffer.byteLength(expectedBody, 'utf8'),
      requestedOutputTokens: 4096,
      contextTokenLimit: 131072,
      outputTokenLimit: 65536,
    },
  });
  assertDeepFrozen(result);
  assert.ok(result.ok);
  assert.equal(result.body, expectedBody);
  assert.equal(result.fit.accounting, GROQ_CONFIGURATION.accounting);
  assert.equal(JSON.parse(result.body).messages[0].content, 'System café 😀\n');
  assert.equal(JSON.parse(result.body).messages[1].content, 'User e\u0301 and $ literal\n');
});

test('admits the exact inclusive serialized-byte cap and rejects one byte over without truncation', () => {
  const atLimit = requestAtSerializedBytes(65536);
  const admitted = prepareGroqGenerationWire(atLimit);
  assert.ok(admitted.ok);
  assert.equal(admitted.body, expectedGroqBody(atLimit));
  assert.equal(Buffer.byteLength(admitted.body, 'utf8'), 65536);
  assert.equal(admitted.fit.serializedRequestBytes, 65536);

  const over = requestAtSerializedBytes(65537);
  assert.deepEqual(prepareGroqGenerationWire(over), { ok: false, error: 'input-fit' });
});

test('fails closed on request shape, identity, controls, schema, roles and Unicode substitution', () => {
  const base = groqGenerationRequest('system', 'user');
  const cases: readonly [string, Record<string, unknown>, 'configuration' | 'input-fit'][] = [
    ['copied configuration', { ...base, configuration: Object.freeze({ ...GROQ_CONFIGURATION }) }, 'configuration'],
    ['wrong adapter version', { ...base, configuration: Object.freeze({ ...GROQ_CONFIGURATION, adapterVersion: 'm304-groq-v2' }) }, 'configuration'],
    ['historical prompt version', { ...base, promptVersion: 'm302-instructions-v1' }, 'configuration'],
    ['copied equivalent controls', { ...base, controls: Object.freeze({ ...GROQ_PARAMETERS }) }, 'configuration'],
    ['wrong controls', { ...base, controls: Object.freeze({ ...GROQ_PARAMETERS, temperature: 1 }) }, 'configuration'],
    ['copied schema', { ...base, schema: structuredClone(GENERATION_SCHEMA) }, 'input-fit'],
    ['wrong message order', { ...base, messages: Object.freeze([...base.messages].reverse()) }, 'input-fit'],
    ['extra message', { ...base, messages: Object.freeze([...base.messages, { role: 'user', content: 'extra' }]) }, 'input-fit'],
    ['ill-formed system string', { ...base, messages: Object.freeze([{ role: 'system', content: '\uD800' }, base.messages[1]]) }, 'input-fit'],
    ['wrong deadline', { ...base, deadlineMs: 119999 }, 'configuration'],
    ['extra request field', { ...base, extra: true }, 'input-fit'],
  ];
  for (const [name, request, error] of cases) {
    assert.deepEqual(prepareGroqGenerationWire(request as unknown as GenerationRequest), { ok: false, error }, name);
  }
});

test('gives invalid configuration precedence over an oversized serialized body', () => {
  const request = requestAtSerializedBytes(65537);
  const copied = mutableRequest(request);
  copied.configuration = Object.freeze({ ...GROQ_CONFIGURATION });
  assert.deepEqual(prepareGroqGenerationWire(copied as unknown as GenerationRequest), {
    ok: false, error: 'configuration',
  });
});
