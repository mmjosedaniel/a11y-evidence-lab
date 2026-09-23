import { NATIVE_SCHEMA_PROMPT_VERSION } from './generation-artifacts.ts';
import { validateNativeSchemaPostChangeVerificationReminder } from './proposal-contract.ts';
import { UNCERTAINTY_PROMPT_VERSION, JUDGMENT_PROMPT_VERSION } from './generation-artifacts.ts';
import { readCaseGenerationRule } from './generation-case-request.ts';
import { validateBlockingManualJudgment } from './profile-judgment.ts';
import { configurationDeadlineMs } from './reasoning-generation-configuration.ts';
import { emitGenerationRejection, type GenerationRejectionSink } from './generation-diagnostics.ts';
import type { Proposal, ProposalValidationResult } from './proposal-contract.ts';
import { types } from 'node:util';
import { readChoice, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { ProviderContext } from '../domain/run-contract/run-types.ts';
import { GENERATION_DEADLINE_MS } from './generation-artifacts.ts';
import type { AttemptTransport, GenerationConfiguration, GenerationRequest, GenerationErrorCode, GenerationOutcome, InvocationOutcome, ProviderInvocation } from './generation-contract.ts';
import { readProviderInvocation } from './generation-contract.ts';
import { validateGenerationConfiguration, validatePreparedGenerationFit } from './generation-fit.ts';

export type GenerationAdmission =
  | { readonly status: 'failed'; readonly error: 'input-integrity' }
  | { readonly status: 'abstained'; readonly decision: Extract<GenerationOutcome, { status: 'abstained' }>['decision'] }
  | { readonly status: 'ready'; readonly createRequest: (configuration: GenerationConfiguration) => GenerationRequest;
      readonly validateCandidate: (candidate: unknown, onRejection?: GenerationRejectionSink) => ProposalValidationResult };
export type GenerationObservation = {
  readonly adapterConfiguration: Omit<ProviderInvocation, 'outcome' | 'validation'>;
  readonly outcome: InvocationOutcome; readonly validation: ProviderInvocation['validation'];
};
export type GenerationOperationOutcome =
  | { readonly status: 'proposal'; readonly proposal: Proposal; readonly attempted: true;
      readonly observation: GenerationObservation; readonly cleanupFailed: false }
  | { readonly status: 'abstained'; readonly decision: Extract<GenerationAdmission, { status: 'abstained' }>['decision'];
      readonly attempted: false; readonly cleanupFailed: false }
  | { readonly status: 'failed'; readonly error: GenerationErrorCode; readonly attempted: boolean;
      readonly observation?: GenerationObservation; readonly cleanupFailed: boolean };

export function adapterDeadlineMs(candidate: unknown, context: ProviderContext): 120000 | 300000 {
  try {
    requireValid(!types.isProxy(candidate));
    const adapter = readObject(candidate, ['configuration', 'prepare']);
    const admitted = validateGenerationConfiguration(adapter.configuration, context);
    return admitted.ok ? configurationDeadlineMs(admitted.value) : GENERATION_DEADLINE_MS;
  } catch { return GENERATION_DEADLINE_MS; }
}

export async function executeGenerationOperation(options: {
  readonly signal: AbortSignal; readonly providerContext: ProviderContext; readonly adapter?: unknown;
  readonly admit: (signal: AbortSignal) => GenerationAdmission | PromiseLike<GenerationAdmission>;
  readonly expiresAt?: number;
  readonly beforeTransport?: () => void;
  readonly onRejection?: GenerationRejectionSink;
}): Promise<GenerationOperationOutcome> {
  const enteredAt = Date.now();
  const ownExpiry = enteredAt + adapterDeadlineMs(options.adapter, options.providerContext);
  const expiresAt = options.expiresAt === undefined ? ownExpiry : Math.min(ownExpiry, options.expiresAt);
  const controller = new AbortController();
  const interrupted = Symbol('generation-interrupted');
  let stop: 'shutdown' | 'timeout' | undefined;
  let active = true;
  let capabilityUsed = false;
  let attempted = false;
  let duplicate = false;
  let cleanupFailed = false;
  let observation: GenerationObservation | undefined;
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
  const timer = setTimeout(() => interrupt('timeout'), Math.max(0, expiresAt - Date.now()));

  function checkStop(): void {
    if (options.signal.aborted) interrupt('shutdown');
    else if (Date.now() >= expiresAt) interrupt('timeout');
    if (stop || duplicate) throw interrupted;
  }
  function observe(outcome: InvocationOutcome, validation: ProviderInvocation['validation'] = 'not-run'): void {
    requireValid(invocationMetadata);
    observation = Object.freeze({ adapterConfiguration: invocationMetadata, outcome, validation });
  }
  function failed(error: GenerationErrorCode): GenerationOperationOutcome {
    // Reentrant envelope/candidate inspection cannot erase a latched violation.
    if (duplicate) {
      if (attempted) observe('provider');
      cleanupFailed = true;
      error = stop ?? (attempted ? 'provider' : 'configuration');
    }
    return Object.freeze({ status: 'failed', error, attempted, ...(observation ? { observation } : {}), cleanupFailed });
  }
  async function bounded<T>(work: PromiseLike<T> | T): Promise<T> {
    return Promise.race([Promise.resolve(work), stopped]);
  }

  try {
    requireValid(Number.isFinite(expiresAt));
    checkStop();
    let built: GenerationAdmission;
    try {
      built = await bounded(options.admit(controller.signal));
      checkStop();
    } catch (error) {
      if (error === interrupted) { cleanupFailed = true; throw error; }
      checkStop();
      return failed('input-integrity');
    }
    if (built.status === 'failed') return failed('input-integrity');
    if (built.status === 'abstained') return Object.freeze({ status: 'abstained', decision: built.decision,
      attempted: false, cleanupFailed: false });
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
    const request = built.createRequest(configuration);
    const native = configuration.promptVersion === NATIVE_SCHEMA_PROMPT_VERSION;
    const judgmentRule = readCaseGenerationRule(request, configuration);
    if ((native || configuration.promptVersion === UNCERTAINTY_PROMPT_VERSION || configuration.promptVersion === JUDGMENT_PROMPT_VERSION) && judgmentRule === null) return failed('configuration');
    checkStop();
    let prepared: Record<string, unknown>;
    // Until an explicit, valid cleanup declaration arrives, collaborator resources are uncertain.
    cleanupFailed = true;
    try {
      const raw = await bounded((adapter.prepare as (request: unknown, signal: AbortSignal, expiresAt: number) => unknown)(request, controller.signal, expiresAt));
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
      if (options.beforeTransport !== undefined) {
        try {
          if (typeof options.beforeTransport !== 'function') throw interrupted;
          const returned: unknown = options.beforeTransport();
          if (returned !== undefined) {
            // Async hooks are rejected, but their eventual rejection is still owned.
            void Promise.resolve(returned).catch(() => undefined);
            gateError = 'configuration';
            throw interrupted;
          }
        } catch {
          gateError = 'configuration';
          throw interrupted;
        }
      }
      checkStop();
      gateError = checkBindings();
      checkStop();
      if (gateError) throw interrupted;
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
      try {
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
      } catch (error) {
        emitGenerationRejection(options.onRejection, 'executor/envelope');
        throw error;
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
      if (error === 'incomplete-output') emitGenerationRejection(options.onRejection, 'adapter-response/unspecified');
      checkStop();
      return failed(error === 'incomplete-output' ? 'response-validation' : error);
    }
    if ((judgmentRule !== null && !validateBlockingManualJudgment(envelope.candidate, judgmentRule))
      || (native && !validateNativeSchemaPostChangeVerificationReminder(envelope.candidate))) {
      observe('response', 'failed');
      emitGenerationRejection(options.onRejection, 'candidate/contract');
      checkStop();
      return failed('response-validation');
    }
    const result = built.validateCandidate(envelope.candidate, options.onRejection);
    if (result.ok && ((judgmentRule !== null && !validateBlockingManualJudgment(result.value, judgmentRule))
      || (native && !validateNativeSchemaPostChangeVerificationReminder(result.value)))) {
      observe('response', 'failed');
      emitGenerationRejection(options.onRejection, 'candidate/contract');
      checkStop();
      return failed('response-validation');
    }
    observe('response', result.ok ? 'passed' : 'failed');
    if (!result.ok) emitGenerationRejection(options.onRejection, 'candidate/contract');
    checkStop();
    if (!result.ok) return failed('response-validation');
    return Object.freeze({ status: 'proposal', proposal: result.value, attempted: true, observation: observation!, cleanupFailed: false });
  } catch {
    if (stop) {
      if (attempted && !observation) observe(stop);
      return failed(stop);
    }
    if (attempted) observe('provider');
    return failed(attempted ? 'provider' : 'configuration');
  } finally {
    active = false;
    controller.abort();
    clearTimeout(timer);
    options.signal.removeEventListener('abort', onAbort);
  }
}
