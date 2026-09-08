import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import type { PageAnalysisRun } from '../../src/server/domain/run-contract.ts';
import { openRunRepository } from '../../src/server/persistence/run-repository.ts';
import type { LocalService } from '../../src/server/service.ts';
import { startLocalService } from '../../src/server/service.ts';
import { loadCorpusCatalog } from '../../src/server/retrieval/corpus-catalog.ts';
import { completedRun, runningRun } from '../../tests/helpers/m102-run-fixture.ts';

const runId = 'm202-capacity-01';
const findingId = 'finding-0';
const retrieveCommand = 'retrieve';
const currentFile = path.resolve(fileURLToPath(import.meta.url));
const capacityRoot = path.dirname(currentFile);
const repositoryRoot = path.resolve(capacityRoot, '../..');
const expectedFile = path.join(repositoryRoot, 'temp', runId, 'driver.ts');
const runRoot = path.join(capacityRoot, 'runs');
const clientRoot = path.resolve(repositoryRoot, 'dist', 'client');
const evidencePath = path.join(capacityRoot, 'capacity-evidence.json');

function sha256(file: string): string {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function requireOrdinaryDirectory(directory: string): void {
  const stat = fs.lstatSync(directory);
  assert.ok(stat.isDirectory() && !stat.isSymbolicLink());
  assert.equal(fs.realpathSync(directory).toLowerCase(), path.resolve(directory).toLowerCase());
}

function requireExactEntry(): string {
  assert.equal(currentFile.toLowerCase(), expectedFile.toLowerCase());
  requireOrdinaryDirectory(repositoryRoot);
  requireOrdinaryDirectory(capacityRoot);
  requireOrdinaryDirectory(clientRoot);
  const driverStat = fs.lstatSync(currentFile);
  assert.ok(driverStat.isFile() && !driverStat.isSymbolicLink() && driverStat.nlink === 1);
  assert.equal(fs.existsSync(runRoot), false);
  assert.equal(fs.existsSync(evidencePath), false);
  const revision = process.argv[2];
  assert.equal(process.argv.length, 3);
  assert.match(revision ?? '', /^[0-9a-f]{40}$/);
  return revision!;
}

function successful<T>(result: { readonly ok: true; readonly value: T } | { readonly ok: false }): T {
  assert.ok(result.ok);
  return result.value;
}

function selectedFinding(run: PageAnalysisRun): Record<string, unknown> {
  assert.equal(run.status, 'completed');
  const selected = run.scan.findings.find(finding => finding.findingId === findingId);
  assert.ok(selected);
  return selected as unknown as Record<string, unknown>;
}

function withoutSelectedWorkflow(run: PageAnalysisRun, original: PageAnalysisRun): PageAnalysisRun {
  assert.equal(run.status, 'completed');
  assert.equal(original.status, 'completed');
  const replacement = original.scan.findings.find(finding => finding.findingId === findingId);
  assert.ok(replacement);
  return structuredClone({
    ...run,
    scan: {
      ...run.scan,
      findings: run.scan.findings.map(finding => finding.findingId === findingId ? replacement : finding),
    },
  });
}

function assertSelectedOnly(before: PageAnalysisRun, after: PageAnalysisRun): void {
  const beforeSelected = selectedFinding(before);
  const afterSelected = selectedFinding(after);
  const { state: _afterState, retrieval: _afterRetrieval, ...afterNative } = afterSelected;
  const { state: _beforeState, ...beforeNative } = beforeSelected;
  assert.deepEqual(afterNative, beforeNative);
  assert.deepEqual(withoutSelectedWorkflow(after, before), before);
}

async function performRetrieval(service: LocalService, revision: string, startedAt: bigint): Promise<void> {
  const outcome = await service.retrieveFinding({ runId, findingId });
  const durationMilliseconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  assert.ok(outcome.ok);
  const repository = successful(openRunRepository(runRoot));
  const durable = successful(repository.read(runId));
  const serviceRead = service.readRun(runId);
  assert.ok(serviceRead.ok);
  assert.equal(serviceRead.interrupted, false);
  assert.deepEqual(outcome.run, durable);
  assert.deepEqual(serviceRead.run, durable);

  const baseline = {
    ...completedRun(runId, 'local', 'populated'),
    applicationRevision: revision,
  };
  assertSelectedOnly(baseline, durable);
  const selected = selectedFinding(durable);
  assert.equal(selected.state, 'active');
  const retrieval = selected.retrieval as Record<string, unknown>;
  assert.equal(retrieval.status, 'completed');
  const result = retrieval.result as Record<string, unknown>;
  const passages = result.passages as readonly { readonly passageId: string; readonly score: number }[];

  const catalogResult = await loadCorpusCatalog();
  assert.ok(catalogResult.ok);
  const references = passages.map(({ passageId, score }) => {
    const matches = catalogResult.value.passages.filter(passage => passage.passageId === passageId);
    assert.equal(matches.length, 1);
    const passage = matches[0]!;
    return {
      passageId,
      score,
      sourceTitle: passage.sourceTitle,
      heading: passage.heading,
      url: passage.url,
    };
  });
  assert.equal(new Set(references.map(reference => reference.passageId)).size, references.length);

  const receipt = {
    receiptVersion: 'm202-capacity-v1',
    runId,
    findingId,
    applicationRevision: revision,
    driverSha256: sha256(currentFile),
    packageLockSha256: sha256(path.join(repositoryRoot, 'package-lock.json')),
    durationMilliseconds,
    retrievalCompleted: true,
    durableReadbackMatched: isDeepStrictEqual(outcome.run, durable)
      && isDeepStrictEqual(serviceRead.run, durable),
    selectedNativeFieldsUnchanged: true,
    nonselectedAggregateFieldsUnchanged: true,
    references,
  };
  fs.writeFileSync(evidencePath, JSON.stringify(receipt, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
  process.stdout.write(`M202_CAPACITY_COMPLETE ${JSON.stringify({ durationMilliseconds, resultCount: references.length })}\n`);
}

async function main(): Promise<void> {
  const revision = requireExactEntry();
  fs.mkdirSync(runRoot);
  const repository = successful(openRunRepository(runRoot));
  successful(repository.create({ ...runningRun(runId, 'local'), applicationRevision: revision }));
  successful(repository.finish({ ...completedRun(runId, 'local', 'populated'), applicationRevision: revision }));

  let service: LocalService | undefined;
  let readInterface: ReturnType<typeof createInterface> | undefined;
  let stopPromise: ReturnType<LocalService['stop']> | undefined;
  try {
    const started = await startLocalService({ runRoot, applicationRevision: revision, clientRoot });
    assert.ok(started.ok);
    service = started.service;
    process.stdout.write(`M202_CAPACITY_READY ${JSON.stringify({ url: service.url, command: retrieveCommand })}\n`);

    readInterface = createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
    const requestStop = () => {
      if (service && !stopPromise) stopPromise = service.stop();
    };
    const interrupt = () => {
      requestStop();
      readInterface?.close();
    };
    readInterface.once('close', requestStop);
    process.once('SIGINT', interrupt);
    process.once('SIGTERM', interrupt);
    try {
      let retrievalStarted = false;
      for await (const line of readInterface) {
        if (line.length === 0) continue;
        assert.equal(line, retrieveCommand);
        assert.equal(retrievalStarted, false);
        retrievalStarted = true;
        await performRetrieval(service, revision, process.hrtime.bigint());
      }
    } finally {
      process.off('SIGINT', interrupt);
      process.off('SIGTERM', interrupt);
      readInterface.off('close', requestStop);
    }
  } finally {
    readInterface?.close();
    if (service) {
      stopPromise ??= service.stop();
      const stopped = await stopPromise;
      assert.deepEqual(stopped, { ok: true, status: 'stopped' });
    }
  }
}

main().catch(() => {
  process.stderr.write('M202_CAPACITY_FAILED\n');
  process.exitCode = 1;
});
