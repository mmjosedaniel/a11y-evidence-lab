import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { validateRun } from '../domain/run-contract.ts';
import type { RunningRun } from '../persistence/run-repository.ts';
import { prepareScanRequest } from '../scan/scan-page.ts';

export interface ServiceConfiguration {
  runRoot: string;
  applicationRevision: string;
  port: number;
  stopTimeoutMs: number;
  clientRoot?: string;
}

function ownData(input: unknown, required: readonly string[], optional: readonly string[] = []): Record<string, unknown> | undefined {
  try {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) return;
    const prototype = Object.getPrototypeOf(input);
    if (prototype !== Object.prototype && prototype !== null) return;
    const value: Record<string, unknown> = Object.create(null);
    for (const key of Reflect.ownKeys(input)) {
      if (typeof key !== 'string' || (!required.includes(key) && !optional.includes(key))) return;
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor) || descriptor.value === undefined) return;
      value[key] = descriptor.value;
    }
    if (required.some(key => !Object.hasOwn(value, key))) return;
    return value;
  } catch { return; }
}

export function parseServiceConfiguration(input: unknown): ServiceConfiguration | undefined {
  const config = ownData(input, ['runRoot', 'applicationRevision'], ['clientRoot', 'port', 'stopTimeoutMs']);
  if (!config || typeof config.runRoot !== 'string' || typeof config.applicationRevision !== 'string'
    || !/^[0-9a-f]{40}$/.test(config.applicationRevision) || config.applicationRevision.length !== 40) return;
  const port = Object.hasOwn(config, 'port') ? config.port : 0;
  const stopTimeoutMs = Object.hasOwn(config, 'stopTimeoutMs') ? config.stopTimeoutMs : 5000;
  if (typeof port !== 'number' || !Number.isInteger(port) || port < 0 || port > 65535
    || typeof stopTimeoutMs !== 'number' || !Number.isInteger(stopTimeoutMs) || stopTimeoutMs < 1 || stopTimeoutMs > 2147483647) return;
  const clientRoot = Object.hasOwn(config, 'clientRoot') ? config.clientRoot : undefined;
  if (clientRoot !== undefined && (typeof clientRoot !== 'string' || clientRoot.length === 0 || !path.isAbsolute(clientRoot))) return;
  return { runRoot: config.runRoot, applicationRevision: config.applicationRevision, port, stopTimeoutMs,
    ...(clientRoot === undefined ? {} : { clientRoot }) };
}

export function prepareServiceScan(input: unknown): Pick<RunningRun, 'requestedUrl' | 'providerContext' | 'scanContext'> | undefined {
  const request = ownData(input, ['requestedUrl', 'mode']);
  if (!request) return;
  const prepared = prepareScanRequest(request.requestedUrl, request.mode);
  return prepared.ok ? prepared.value : undefined;
}

export function prepareRunningRun(input: unknown, applicationRevision: string): RunningRun | undefined {
  const request = ownData(input, ['requestedUrl', 'providerContext', 'scanContext']);
  if (!request) return;
  const checked = validateRun({ ...request, formatVersion: 1, runId: `run-${randomUUID()}`,
    createdAt: new Date().toISOString(), applicationRevision, status: 'running' });
  if (!checked.ok || checked.value.status !== 'running') return;
  const initial = checked.value;
  if (initial.scanContext.readinessReached || ['finalUrl', 'scannedAt', 'browserVersion'].some(key => {
    const fact = initial.scanContext[key as 'finalUrl' | 'scannedAt' | 'browserVersion'];
    return !('unavailable' in fact) || fact.unavailable !== 'missing';
  })) return;
  return initial;
}
