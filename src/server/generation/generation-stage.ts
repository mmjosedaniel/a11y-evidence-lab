import { types } from 'node:util';
import { readChoice, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import { readFinding } from '../domain/run-contract/finding-validation.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { readCorpusBytes } from '../retrieval/corpus-catalog.ts';
import { validateRetrievalResult } from '../retrieval/retrieval-contract.ts';
import { GENERATION_DEADLINE_MS } from './generation-artifacts.ts';
import type { AttemptTransport, GenerationConfiguration, GenerationErrorCode, GenerationOutcome, InvocationOutcome, ProviderInvocation } from './generation-contract.ts';
import { readProviderInvocation } from './generation-contract.ts';
import { validateGenerationConfiguration, validatePreparedGenerationFit } from './generation-fit.ts';
import { buildGenerationInput, createGenerationRequest } from './generation-input.ts';
import { validateProposal } from './proposal-contract.ts';

type StageInput = {
  readonly finding: unknown; readonly retrieval: unknown;
  readonly analysisStartedAt: string; readonly analysisFinishedAt: string;
  readonly providerContext: ProviderContext; readonly adapter?: unknown; readonly signal: AbortSignal;
};

export async function executeGeneration(options: StageInput): Promise<GenerationOutcome> {
  const expiresAt = Date.now() + GENERATION_DEADLINE_MS;
  const controller = new AbortController();
  const interrupted = Symbol('generation-interrupted');
  let stop: 'shutdown' | 'timeout' | undefined;
  let active = true;
  let capabilityUsed = false;
  let attempted = false;
  let duplicate = false;
  let cleanupFailed = false;
  let invocation: ProviderInvocation | undefined;
  let configuration: GenerationConfiguration | undefined;
  let invocationMetadata: Omit<ProviderInvocation, 'outcome' | 'validation'> | undefined;
  let gateError: 'configuration' | 'input-fit' | undefined;
  let rejectStop!: (reason: unknown) => void;
  const stopped = new Promise<never>((_resolve, reject) => { rejectStop = reject; });
  // The stop promise can reject before the first asynchronous boundary.
  void stopped.catch(() => undefined);
  function interrupt(reason: 'shutdown' | 'timeout'): void {
    if (!active) return;
    if (reason === 'shutdown' || stop === undefined) stop = reason;
    controller.abort();
    rejectStop(interrupted);
  }
  const onAbort = () => interrupt('shutdown');
  options.signal.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(() => interrupt('timeout'), GENERATION_DEADLINE_MS);

  function checkStop(): void {
    if (options.signal.aborted) interrupt('shutdown');
    else if (Date.now() >= expiresAt) interrupt('timeout');
    if (stop || duplicate) throw interrupted;
  }
  function observe(outcome: InvocationOutcome, validation: ProviderInvocation['validation'] = 'not-run'): void {
    requireValid(invocationMetadata);
    invocation = Object.freeze({ ...invocationMetadata, outcome, validation });
  }
  function failed(error: GenerationErrorCode): GenerationOutcome {
    // Reentrant envelope/candidate inspection cannot erase a latched violation.
    if (duplicate) {
      if (attempted) observe('provider');
      cleanupFailed = true;
      error = stop ?? (attempted ? 'provider' : 'configuration');
    }
    return Object.freeze({ status: 'failed', error, ...(invocation ? { invocation } : {}), cleanupFailed });
  }
  async function bounded<T>(work: PromiseLike<T> | T): Promise<T> {
    return Promise.race([Promise.resolve(work), stopped]);
  }

  try {
    checkStop();
    let bytes: readonly [Uint8Array, Uint8Array];
    try {
      bytes = await bounded(readCorpusBytes());
      checkStop();
    } catch (error) {
      if (error === interrupted) { cleanupFailed = true; throw error; }
      checkStop();
      return failed('input-integrity');
    }
    const built = buildGenerationInput({ ...options, manifestBytes: bytes[0], passageBytes: bytes[1] });
    checkStop();
    if (built.status === 'failed') return failed('input-integrity');
    if (built.status === 'abstained') return Object.freeze({ status: 'abstained', decision: built.decision, cleanupFailed: false });
    const finding = readFinding(options.finding);
    const retrieval = validateRetrievalResult(options.retrieval, finding);
    requireValid(retrieval.ok);
    if (options.adapter === undefined) return failed('missing-prerequisite');

    const adapterCandidate = options.adapter;
    let adapter: Record<string, unknown>;
    try {
      // Final entry identity must be readable without invoking a Proxy trap.
      requireValid(!types.isProxy(adapterCandidate));
      adapter = readObject(adapterCandidate, ['configuration', 'prepare']);
      requireValid(typeof adapter.prepare === 'function');
    } catch { return failed('configuration'); }
    const admitted = validateGenerationConfiguration(adapter.configuration, options.providerContext);
    if (!admitted.ok) return failed(admitted.error);
    configuration = admitted.value;
    // Detach descriptor-admitted metadata before transport. The reader validates
    // fixed parameters too; no collaborator-owned value is observed after entry.
    const metadata = readObject(configuration);
    const { outcome: _outcome, validation: _validation, ...safeMetadata } = readProviderInvocation({
      adapterId: metadata.adapterId, adapterVersion: metadata.adapterVersion,
      endpointIdentity: metadata.endpoint, promptVersion: metadata.promptVersion,
      schemaVersion: metadata.schemaVersion, outputContractVersion: metadata.outputContractVersion,
      parameters: metadata.parameters, outcome: 'provider', validation: 'not-run',
    });
    invocationMetadata = Object.freeze(safeMetadata);
    const request = createGenerationRequest(built.input, options.providerContext, configuration);
    checkStop();
    let prepared: Record<string, unknown>;
    // Until an explicit, valid cleanup declaration arrives, collaborator resources are uncertain.
    cleanupFailed = true;
    try {
      const raw = await bounded((adapter.prepare as (request: unknown, signal: AbortSignal) => unknown)(request, controller.signal));
      prepared = readObject(raw);
      if (prepared.ok === false) {
        prepared = readObject(raw, ['ok', 'error', 'cleanup']);
        const error = readChoice(prepared.error, ['configuration', 'missing-prerequisite', 'input-fit']);
        cleanupFailed = readChoice(prepared.cleanup, ['complete', 'uncertain']) === 'uncertain';
        checkStop();
        return failed(error);
      }
      const keys = ['ok', 'request', 'configuration', 'dispatch', 'cleanup'];
      requireValid(Object.isFrozen(raw) && prepared.ok === true && prepared.cleanup === 'complete'
        && typeof prepared.dispatch === 'function'
        && keys.every(key => Object.hasOwn(prepared, key))
        && Object.keys(prepared).every(key => keys.includes(key) || key === 'fit'));
      cleanupFailed = false;
      checkStop();
    } catch (error) {
      if (error === interrupted) throw error;
      cleanupFailed = true;
      checkStop();
      return failed('configuration');
    }

    function checkBindings(): 'configuration' | 'input-fit' | undefined {
      try {
        const current = readObject(adapterCandidate, ['configuration', 'prepare']);
        if (current.configuration !== configuration || prepared.request !== request || prepared.configuration !== configuration) return 'configuration';
        const currentConfiguration = validateGenerationConfiguration(configuration, options.providerContext);
        if (!currentConfiguration.ok) return currentConfiguration.error;
        if (!validatePreparedGenerationFit(prepared.fit, configuration!)) return 'input-fit';
        return undefined;
      } catch { return 'configuration'; }
    }
    const invalidBinding = checkBindings();
    if (invalidBinding) return failed(invalidBinding);
    checkStop();

    const attemptTransport: AttemptTransport = <T>(start: () => T): T => {
      if (!active) throw interrupted;
      if (capabilityUsed) {
        duplicate = true;
        cleanupFailed = true;
        throw interrupted;
      }
      // Consume the capability even if a gate fails; nested inspection cannot retry it.
      capabilityUsed = true;
      checkStop();
      gateError = checkBindings();
      checkStop();
      if (gateError || typeof start !== 'function') {
        gateError ??= 'configuration';
        throw interrupted;
      }
      // All callback-capable validation is complete. This ordinary-object own-data
      // read is the final identity check, with no callback before transport entry.
      const current = Object.getOwnPropertyDescriptor(adapterCandidate, 'configuration');
      if (!current || !current.enumerable || !('value' in current) || current.value !== configuration) {
        gateError = 'configuration';
        throw interrupted;
      }
      attempted = true;
      return start();
    };

    cleanupFailed = true;
    let envelope: Record<string, unknown>;
    try {
      const raw = await bounded((prepared.dispatch as (signal: AbortSignal, attempt: AttemptTransport) => unknown)(controller.signal, attemptTransport));
      if (duplicate) {
        if (attempted) observe('provider');
        checkStop();
        return failed('provider');
      }
      if (!attempted) {
        checkStop();
        return failed(gateError ?? 'configuration');
      }
      envelope = readObject(raw);
      if (envelope.ok === true) {
        envelope = readObject(raw, ['ok', 'candidate', 'complete', 'cleanup']);
        requireValid(envelope.complete === true && envelope.cleanup === 'complete');
      } else {
        envelope = readObject(raw, ['ok', 'error', 'cleanup']);
        requireValid(envelope.ok === false);
        readChoice(envelope.error, ['incomplete-output', 'authentication', 'quota', 'rate-limit', 'network', 'provider', 'timeout', 'shutdown']);
        readChoice(envelope.cleanup, ['complete', 'uncertain']);
      }
      cleanupFailed = envelope.cleanup !== 'complete';
    } catch {
      if (attempted) observe(duplicate ? 'provider' : stop ?? 'provider');
      cleanupFailed = true;
      checkStop();
      return failed(attempted ? 'provider' : gateError ?? 'configuration');
    }
    if (envelope.ok === false) {
      const error = envelope.error as Exclude<InvocationOutcome, 'response'> | 'incomplete-output';
      observe(error === 'incomplete-output' ? 'response' : error, error === 'incomplete-output' ? 'failed' : 'not-run');
      checkStop();
      return failed(error === 'incomplete-output' ? 'response-validation' : error);
    }
    const result = validateProposal(envelope.candidate, { finding, retrieval: retrieval.value });
    observe('response', result.ok ? 'passed' : 'failed');
    checkStop();
    if (!result.ok) return failed('response-validation');
    return Object.freeze({ status: 'proposal', proposal: result.value, invocation: invocation!, cleanupFailed: false });
  } catch {
    if (stop) {
      if (attempted && !invocation) observe(stop);
      return failed(stop);
    }
    if (attempted) observe('provider');
    return failed(attempted ? 'provider' : 'configuration');
  } finally {
    active = false;
    clearTimeout(timer);
    options.signal.removeEventListener('abort', onAbort);
  }
}
