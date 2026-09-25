import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createCaseGenerationRequest } from '../../src/server/generation/generation-case-request.ts';
import type { GenerationRequest } from '../../src/server/generation/generation-contract.ts';
import { createGroqGenerationAdapter } from '../../src/server/generation/groq-generation.ts';
import { prepareUncertaintyGroqGenerationWire } from '../../src/server/generation/groq-generation-fit.ts';
import { createOllamaGenerationAdapter } from '../../src/server/generation/ollama-generation.ts';
import { prepareUncertaintyOllamaGenerationWire } from '../../src/server/generation/ollama-generation-fit.ts';
import {
  UNCERTAINTY_GROQ_CONFIGURATION,
  UNCERTAINTY_QWEN_CONFIGURATION,
} from '../../src/server/generation/reasoning-generation-configuration.ts';
import { uncertaintyGenerationInstructions } from '../../src/server/generation/reasoning-generation-instructions.ts';
import {
  loadM602Package,
  loadM602PromptPackage,
  loadM602ReasoningPackage,
  loadM602RepairedPackage,
  type M602CaseLabel,
} from '../helpers/m602-package.ts';

type JsonRecord = Record<string, any>;

const repository = path.resolve(import.meta.dirname, '../..');
const labels = [
  'local-image', 'local-label', 'local-contrast',
  'groq-image', 'groq-label', 'groq-contrast',
] as const satisfies readonly M602CaseLabel[];
const ruleByLabel = Object.freeze({
  'local-image': 'image-alt', 'local-label': 'label', 'local-contrast': 'color-contrast',
  'groq-image': 'image-alt', 'groq-label': 'label', 'groq-contrast': 'color-contrast',
} as const);
const historicalUncertaintyWires = Object.freeze({
  'local-image': [17219, '74b4e38a8842b9584f819b95aba29a8caaa3e177ad459ba699bfb4bf3a8935b9'],
  'local-label': [19438, '41f0d5ae92c4f19c81b8bcce66e01c281a9016cf0f71368d15394e9f68a936cd'],
  'local-contrast': [19793, '6d706aa86a6deca619375be98c6f7fde5efc1321f23540ff2fa9e4e546f19599'],
  'groq-image': [16918, '489747d50e23a9d6b41374a4d7948b7648aeaae4d7814788e9c876105ade5f99'],
  'groq-label': [19095, '022b61b8256aac8419b5222f4a793c9b9436a92a2b13a7d1559f1165288a9050'],
  'groq-contrast': [19462, 'dfe1a12d25b10055da323ac8f8e7f3f797523d45b7eae17d6deb8982f59ed9a7'],
} as const);

const sha256 = (value: Uint8Array | string) => createHash('sha256').update(value).digest('hex');

function retainedInputPaths(): readonly string[] {
  const manifest = JSON.parse(fs.readFileSync(path.join(repository,
    'evaluation/m301-generation-v1.json'), 'utf8')) as JsonRecord;
  const packageInputs = manifest.cases.flatMap((entry: JsonRecord) => [entry.input.path, entry.provenance.path]);
  const sharedInputs = [manifest.shared.instructions.path, manifest.shared.outputSchema.path, manifest.shared.noCall.path];
  const checkpointInputs = manifest.cases.flatMap((entry: JsonRecord) => {
    const runPath = entry.actualRetrievalObservation.sourcePath as string;
    const seedPath = runPath.replace(/\/runs\/[^/]+\/run\.json$/u, '/seed.json');
    assert.notEqual(seedPath, runPath, `Unexpected retained run path: ${runPath}`);
    return [seedPath, runPath];
  });
  const retained = [...packageInputs, ...sharedInputs, ...checkpointInputs];
  assert.equal(retained.length, 15);
  return retained;
}

function requireRetainedInputs(): void {
  for (const relativePath of retainedInputPaths()) {
    if (!fs.existsSync(path.join(repository, relativePath))) {
      throw new Error(`Missing retained M6-02 input required by test:evidence:m602: ${relativePath}`);
    }
  }
}

function requireReady<T extends { readonly status: 'ready'; readonly value: unknown }
  | { readonly status: 'failed'; readonly error: string }>(result: T, description: string): asserts result is Extract<T, { status: 'ready' }> {
  assert.equal(result.status, 'ready', description);
}

function historicalUncertaintyRequest(label: M602CaseLabel): GenerationRequest {
  const loaded = loadM602Package(label);
  requireReady(loaded, `${label} base package`);
  const packageValue = loaded.value;
  const configuration = label.startsWith('local-') ? UNCERTAINTY_QWEN_CONFIGURATION : UNCERTAINTY_GROQ_CONFIGURATION;
  const legacyConfiguration = label.startsWith('local-')
    ? createOllamaGenerationAdapter().configuration
    : createGroqGenerationAdapter().configuration;
  const legacy = packageValue.createRequest(legacyConfiguration);
  return createCaseGenerationRequest([
    { role: 'system', content: uncertaintyGenerationInstructions(ruleByLabel[label]) }, legacy.messages[1]!,
  ], {
    findingId: packageValue.findingId,
    availableEvidenceReferences: packageValue.availableEvidenceReferences,
    passageIds: packageValue.passageIds,
  }, configuration);
}

test('authenticates every retained M6-02 package identity', () => {
  requireRetainedInputs();
  const promptManifestBytes = fs.readFileSync(path.join(repository, 'evaluation/m602-prompt-v1.json'));
  const promptManifest = JSON.parse(promptManifestBytes.toString('utf8')) as JsonRecord;
  assert.equal(sha256(promptManifestBytes), 'd6e5767e82b51531b9fb1a823d38ac0fa1684c21764cef2eb7cf162e53afa15d');
  assert.deepEqual(promptManifest.promptPolicy, {
    version: 'm602-grounded-instructions-v1',
    path: 'evaluation/m602-grounded-instructions-v1.txt',
    sha256: 'b04d25f49a35a1dea4b12abb30e0cf3b1ee47f48e5208f6efed5fdfe05b36aa6',
  });
  const reasoningManifestBytes = fs.readFileSync(path.join(repository, 'evaluation/m602-reasoning-v1.json'));
  assert.equal(sha256(reasoningManifestBytes), 'da8aa75e9f59818fb1edcf11e939032070a44b3e5ae4d716a709cc8b3462b388');

  for (const label of labels) {
    requireReady(loadM602Package(label), `${label} base package`);
    requireReady(loadM602RepairedPackage(label), `${label} repaired package`);
    requireReady(loadM602PromptPackage(label), `${label} prompt package`);
    requireReady(loadM602ReasoningPackage(label), `${label} reasoning package`);
  }
});

test('authenticates all six retained uncertainty wires', () => {
  requireRetainedInputs();
  for (const label of labels) {
    const request = historicalUncertaintyRequest(label);
    const prepared = label.startsWith('local-')
      ? prepareUncertaintyOllamaGenerationWire(request)
      : prepareUncertaintyGroqGenerationWire(request);
    assert.equal(prepared.ok, true, label);
    if (!prepared.ok) continue;
    assert.deepEqual([Buffer.byteLength(prepared.body, 'utf8'), sha256(prepared.body)],
      historicalUncertaintyWires[label], label);
  }
});
