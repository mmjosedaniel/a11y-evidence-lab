import { readOriginalM602Case } from './m602-historical-evidence.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { qualifyM602ReasoningObservers, executeM602ReasoningCase, readM602ReasoningCase, executeM602Case, readM602Case, executeM602SuccessorCase, readM602SuccessorCase, qualifyM602SuccessorObservers, qualifyM602CompletionObservers, executeM602CompletionCase, readM602CompletionCase, qualifyM602InstrumentedObservers, executeM602InstrumentedCase, readM602InstrumentedCase, qualifyM602PromptObservers, executeM602PromptCase, readM602PromptCase, qualifyM602RepairedObservers, executeM602RepairedCase, readM602RepairedCase } from './m602-operation.ts';
import { reasoningObservationQualified, type M602ReasoningObservation, successorObservationQualified, completionObservationQualified, instrumentedObservationQualified, promptObservationQualified, type M602PromptObservation, repairedObservationQualified, type M602RepairedObservation, type M602InstrumentedObservation, type M602CompletionObservation, type M602SuccessorObservation } from './m602-successor-evidence.ts';
import type { M602SuccessorFailure } from './m602-successor-evidence.ts';
import type { M602CaseLabel } from './m602-package.ts';

export function parseM602Arguments(args: readonly string[]):
  { readonly ok: true; readonly mode: 'execute' | 'readback' | 'inspect-original' | 'execute-successor' | 'readback-successor' | 'execute-completion' | 'readback-completion' | 'execute-instrumented' | 'readback-instrumented' | 'execute-repaired' | 'readback-repaired' | 'execute-prompt' | 'readback-prompt' | 'execute-reasoning' | 'readback-reasoning'; readonly caseLabel: M602CaseLabel }
  | { readonly ok: true; readonly mode: 'qualify-successor-observers' }
  | { readonly ok: true; readonly mode: 'qualify-completion-observers' }
  | { readonly ok: true; readonly mode: 'qualify-instrumented-observers' }
  | { readonly ok: true; readonly mode: 'qualify-prompt-observers' }
  | { readonly ok: true; readonly mode: 'qualify-reasoning-observers' }
  | { readonly ok: true; readonly mode: 'qualify-repaired-observers' }
  | { readonly ok: false; readonly error: 'arguments' } {
  if (args.length === 1 && args[0] === '--qualify-reasoning-observers') return Object.freeze({ ok: true, mode: 'qualify-reasoning-observers' });
  if (args.length === 1 && args[0] === '--qualify-prompt-observers') return Object.freeze({ ok: true, mode: 'qualify-prompt-observers' });
  if (args.length === 1 && args[0] === '--qualify-repaired-observers') return Object.freeze({ ok: true, mode: 'qualify-repaired-observers' });
  if (args.length === 1 && args[0] === '--qualify-instrumented-observers') return Object.freeze({ ok: true, mode: 'qualify-instrumented-observers' });
  if (args.length === 1 && args[0] === '--qualify-completion-observers') return Object.freeze({ ok: true, mode: 'qualify-completion-observers' });
  if (args.length === 1 && args[0] === '--qualify-successor-observers') return Object.freeze({ ok: true, mode: 'qualify-successor-observers' });
  if (args.length === 3 && args[0] === '--inspect-original' && args[1] === '--case' && args[2] === 'local-image') {
    return Object.freeze({ ok: true, mode: 'inspect-original', caseLabel: 'local-image' });
  }
  const labels: readonly string[] = ['local-image', 'local-label', 'local-contrast', 'groq-image', 'groq-label', 'groq-contrast'];
  if (args.length !== 3 || !['--execute', '--readback', '--execute-successor', '--readback-successor', '--execute-completion', '--readback-completion', '--execute-instrumented', '--readback-instrumented', '--execute-repaired', '--readback-repaired', '--execute-prompt', '--readback-prompt', '--execute-reasoning', '--readback-reasoning'].includes(args[0]) || args[1] !== '--case' || !labels.includes(args[2])) {
    return Object.freeze({ ok: false, error: 'arguments' });
  }
  return Object.freeze({ ok: true, mode: args[0].slice(2) as 'execute' | 'readback' | 'execute-successor' | 'readback-successor' | 'execute-completion' | 'readback-completion' | 'execute-instrumented' | 'readback-instrumented' | 'execute-repaired' | 'readback-repaired' | 'execute-prompt' | 'readback-prompt' | 'execute-reasoning' | 'readback-reasoning', caseLabel: args[2] as M602CaseLabel });
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
  } else if (parsed.mode === 'qualify-successor-observers' || parsed.mode === 'qualify-completion-observers' || parsed.mode === 'qualify-instrumented-observers' || parsed.mode === 'qualify-repaired-observers' || parsed.mode === 'qualify-prompt-observers' || parsed.mode === 'qualify-reasoning-observers') {
    const outcome = await (parsed.mode === 'qualify-reasoning-observers' ? qualifyM602ReasoningObservers() : parsed.mode === 'qualify-prompt-observers' ? qualifyM602PromptObservers() : parsed.mode === 'qualify-repaired-observers' ? qualifyM602RepairedObservers() : parsed.mode === 'qualify-instrumented-observers' ? qualifyM602InstrumentedObservers() : parsed.mode === 'qualify-completion-observers' ? qualifyM602CompletionObservers() : qualifyM602SuccessorObservers());
    if (!outcome.ok) { process.stdout.write(formatM602SuccessorFailure(outcome)); process.exitCode = 1; }
    else { process.stdout.write(`${JSON.stringify({ ok: true, sha256: outcome.sha256, cleanup: outcome.qualification.cleanup })}\n`); process.exitCode = 0; }
  } else if (parsed.mode === 'execute-successor' || parsed.mode === 'readback-successor' || parsed.mode === 'execute-completion' || parsed.mode === 'readback-completion' || parsed.mode === 'execute-instrumented' || parsed.mode === 'readback-instrumented' || parsed.mode === 'execute-repaired' || parsed.mode === 'readback-repaired' || parsed.mode === 'execute-prompt' || parsed.mode === 'readback-prompt' || parsed.mode === 'execute-reasoning' || parsed.mode === 'readback-reasoning') {
    const reasoning = parsed.mode === 'execute-reasoning' || parsed.mode === 'readback-reasoning';
    const prompt = parsed.mode === 'execute-prompt' || parsed.mode === 'readback-prompt';
    const repaired = parsed.mode === 'execute-repaired' || parsed.mode === 'readback-repaired';
    const instrumented = parsed.mode === 'execute-instrumented' || parsed.mode === 'readback-instrumented';
    const completion = parsed.mode === 'execute-completion' || parsed.mode === 'readback-completion';
    const qualified = (observation: M602SuccessorObservation | M602CompletionObservation | M602InstrumentedObservation | M602RepairedObservation | M602PromptObservation | M602ReasoningObservation) => reasoning
      ? reasoningObservationQualified(observation as M602ReasoningObservation) : prompt
      ? promptObservationQualified(observation as M602PromptObservation) : repaired
      ? repairedObservationQualified(observation as M602RepairedObservation) : instrumented
      ? instrumentedObservationQualified(observation as M602InstrumentedObservation) : completion
      ? completionObservationQualified(observation as M602CompletionObservation) : successorObservationQualified(observation as M602SuccessorObservation);
    if (parsed.mode === 'execute-successor' || parsed.mode === 'execute-completion' || parsed.mode === 'execute-instrumented' || parsed.mode === 'execute-repaired' || parsed.mode === 'execute-prompt' || parsed.mode === 'execute-reasoning') {
      const outcome = await (reasoning ? executeM602ReasoningCase : prompt ? executeM602PromptCase : repaired ? executeM602RepairedCase : instrumented ? executeM602InstrumentedCase : completion ? executeM602CompletionCase : executeM602SuccessorCase)(parsed.caseLabel);
      if (!outcome.ok) { process.stdout.write(formatM602SuccessorFailure(outcome)); process.exitCode = 1; }
      else {
        process.stdout.write(`${JSON.stringify({ caseLabel: outcome.result.caseLabel, status: outcome.result.status,
          error: outcome.result.error, attempted: outcome.result.attempted, requests: outcome.result.requests,
          observationSha256: outcome.observationSha256, cleanup: outcome.observation.cleanup,
          ...('details' in outcome.observation ? { details: outcome.observation.details } : {}),
          qualified: qualified(outcome.observation) })}\n`);
        process.exitCode = outcome.result.status === 'proposal' && qualified(outcome.observation) ? 0 : 1;
      }
    } else {
      const outcome = await (reasoning ? readM602ReasoningCase : prompt ? readM602PromptCase : repaired ? readM602RepairedCase : instrumented ? readM602InstrumentedCase : completion ? readM602CompletionCase : readM602SuccessorCase)(parsed.caseLabel);
      if (!outcome.ok) { process.stdout.write(`${JSON.stringify(outcome)}\n`); process.exitCode = 1; }
      else {
        process.stdout.write(`${JSON.stringify({ caseLabel: outcome.result.caseLabel, status: outcome.result.status,
          error: outcome.result.error, attempted: outcome.result.attempted, requests: outcome.result.requests,
          observationSha256: outcome.observationSha256, cleanup: outcome.observation.cleanup,
          ...('details' in outcome.observation ? { details: outcome.observation.details } : {}),
          ...('eligibleForContinuation' in outcome ? { eligibleForContinuation: outcome.eligibleForContinuation } : {}),
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
