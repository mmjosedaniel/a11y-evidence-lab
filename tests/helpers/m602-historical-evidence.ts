import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hash, ordinary, record } from './m602-evidence-files.ts';

const repository = path.resolve(import.meta.dirname, '../..');
const pins = Object.freeze({
  manifestSha256: '63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b',
  producerCodeSha256: 'a069571f11959ba95670be9142169962262e834d5c9c81791ed90bae191522b4',
  enteredSha256: '1bc66fd5cb9f437b83c13403da7872392893871e19ad7478f6a53d50e51c272f',
  dispatchSha256: '4d2b186092c95a1b35ca8f9bf9c748386a5b117ddb08b6e1a4dfc0fcb4544320',
  resultSha256: '05e6b16b86f676b090d9cdc06d3a4a151c2cfc8bc36fb9fcd788f558ae48d989',
});
export function readOriginalM602Case() {
  try {
    const directory = path.join(repository, 'temp/m602-generation-evidence/local-image');
    ordinary(directory, fs, false);
    assert.deepEqual(fs.readdirSync(directory).sort(), ['dispatch.json', 'entered.json', 'result.json']);
    const manifest = path.join(repository, 'evaluation/m301-generation-v1.json');
    ordinary(manifest, fs, true);
    assert.equal(hash(fs.readFileSync(manifest)), pins.manifestSha256);
    const entered = record(directory, 'entered.json', fs);
    const dispatch = record(directory, 'dispatch.json', fs);
    const result = record(directory, 'result.json', fs);
    assert.equal(entered.sha256, pins.enteredSha256);
    assert.equal(dispatch.sha256, pins.dispatchSha256);
    assert.equal(result.sha256, pins.resultSha256);
    // Exact byte pins authenticate the closed original schemas; check their links too.
    const entryValue = entered.value as Record<string, unknown>;
    const dispatchValue = dispatch.value as Record<string, unknown>;
    const resultValue = result.value as Record<string, unknown>;
    assert.equal(entryValue.manifestSha256, pins.manifestSha256);
    assert.equal(entryValue.codeSha256, pins.producerCodeSha256);
    assert.equal(dispatchValue.enteredSha256, pins.enteredSha256);
    assert.equal(resultValue.enteredSha256, pins.enteredSha256);
    assert.equal(resultValue.dispatchSha256, pins.dispatchSha256);
    assert.equal(resultValue.caseLabel, 'local-image');
    assert.equal(resultValue.status, 'failed');
    assert.equal(resultValue.error, 'response-validation');
    assert.equal(resultValue.attempted, true);
    return Object.freeze({ ok: true as const, kind: 'historical-only' as const, eligibleForContinuation: false as const,
      caseLabel: 'local-image' as const, status: 'failed' as const, error: 'response-validation' as const,
      attempted: true as const, ...pins });
  } catch { return Object.freeze({ ok: false as const, error: 'evidence-blocked' as const }); }
}
