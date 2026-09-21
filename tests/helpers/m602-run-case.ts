import { readOriginalM602Case } from './m602-historical-evidence.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { executeM602Case, readM602Case, executeM602SuccessorCase, readM602SuccessorCase, qualifyM602SuccessorObservers } from './m602-operation.ts';
import { successorObservationQualified } from './m602-successor-evidence.ts';
import type { M602SuccessorFailure } from './m602-successor-evidence.ts';
import type { M602CaseLabel } from './m602-package.ts';

export function parseM602Arguments(args: readonly string[]):
  { readonly ok: true; readonly mode: 'execute' | 'readback' | 'inspect-original' | 'execute-successor' | 'readback-successor'; readonly caseLabel: M602CaseLabel }
  | { readonly ok: true; readonly mode: 'qualify-successor-observers' }
  | { readonly ok: false; readonly error: 'arguments' } {
  if (args.length === 1 && args[0] === '--qualify-successor-observers') return Object.freeze({ ok: true, mode: 'qualify-successor-observers' });
  if (args.length === 3 && args[0] === '--inspect-original' && args[1] === '--case' && args[2] === 'local-image') {
    return Object.freeze({ ok: true, mode: 'inspect-original', caseLabel: 'local-image' });
  }
  const labels: readonly string[] = ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'];
  if (args.length !== 3 || !['--execute', '--readback', '--execute-successor', '--readback-successor'].includes(args[0]) || args[1] !== '--case' || !labels.includes(args[2])) {
    return Object.freeze({ ok: false, error: 'arguments' });
  }
  return Object.freeze({ ok: true, mode: args[0].slice(2) as 'execute' | 'readback' | 'execute-successor' | 'readback-successor', caseLabel: args[2] as M602CaseLabel });
}

export function formatM602SuccessorFailure(failure: M602SuccessorFailure): string {
  const cleanup = failure.cleanup;
  return `${JSON.stringify({ ok: false, error: failure.error, cleanup: { ui: cleanup.ui, runtime: cleanup.runtime,
    gpu: cleanup.gpu, application: cleanup.application, browser: cleanup.browser, scratch: cleanup.scratch } })}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const parsed = parseM602Arguments(process.argv.slice(2));
  if (!parsed.ok) { process.stdout.write(`${JSON.stringify(parsed)}\n`); process.exitCode = 1; }
  else if (parsed.mode === 'inspect-original') {
    const historical = readOriginalM602Case();
    process.stdout.write(`${JSON.stringify(historical)}\n`);
    process.exitCode = historical.ok ? 0 : 1;
  } else if (parsed.mode === 'qualify-successor-observers') {
    const outcome = await qualifyM602SuccessorObservers();
    if (!outcome.ok) { process.stdout.write(formatM602SuccessorFailure(outcome)); process.exitCode = 1; }
    else { process.stdout.write(`${JSON.stringify({ ok: true, sha256: outcome.sha256, cleanup: outcome.qualification.cleanup })}\n`); process.exitCode = 0; }
  } else if (parsed.mode === 'execute-successor' || parsed.mode === 'readback-successor') {
    if (parsed.mode === 'execute-successor') {
      const outcome = await executeM602SuccessorCase(parsed.caseLabel);
      if (!outcome.ok) { process.stdout.write(formatM602SuccessorFailure(outcome)); process.exitCode = 1; }
      else {
        process.stdout.write(`${JSON.stringify({ caseLabel: outcome.result.caseLabel, status: outcome.result.status,
          error: outcome.result.error, attempted: outcome.result.attempted, requests: outcome.result.requests,
          observationSha256: outcome.observationSha256, cleanup: outcome.observation.cleanup,
          qualified: successorObservationQualified(outcome.observation) })}\n`);
        process.exitCode = outcome.result.status === 'proposal' && successorObservationQualified(outcome.observation) ? 0 : 1;
      }
    } else {
      const outcome = await readM602SuccessorCase(parsed.caseLabel);
      if (!outcome.ok) { process.stdout.write(`${JSON.stringify(outcome)}\n`); process.exitCode = 1; }
      else {
        process.stdout.write(`${JSON.stringify({ caseLabel: outcome.result.caseLabel, status: outcome.result.status,
          error: outcome.result.error, attempted: outcome.result.attempted, requests: outcome.result.requests,
          observationSha256: outcome.observationSha256, cleanup: outcome.observation.cleanup,
          accepted: outcome.assessment?.accepted ?? false })}\n`); process.exitCode = 0;
      }
    }
  } else {
    const outcome = await (parsed.mode === 'execute' ? executeM602Case(parsed.caseLabel) : readM602Case(parsed.caseLabel));
    if (!outcome.ok) { process.stdout.write(`${JSON.stringify(outcome)}\n`); process.exitCode = 1; }
    else {
      const result = outcome.result;
      process.stdout.write(`${JSON.stringify({ caseLabel: result.caseLabel, status: result.status, error: result.error,
        attempted: result.attempted, cleanupFailed: result.cleanupFailed, requests: result.requests,
        enteredSha256: result.enteredSha256, dispatchSha256: result.dispatchSha256, wire: result.wire })}\n`);
      process.exitCode = parsed.mode === 'execute' && result.status !== 'proposal' ? 1 : 0;
    }
  }
}
