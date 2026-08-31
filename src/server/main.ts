import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { startLocalService } from './service.ts';
import type { StartResult } from './service.ts';

const applicationRevision = process.env.A11Y_APPLICATION_REVISION;
const portText = process.env.A11Y_PORT;
let result: StartResult;
if (typeof applicationRevision !== 'string' || applicationRevision.length !== 40 || !/^[0-9a-f]{40}$/.test(applicationRevision)
  || (portText !== undefined && (/^(0|[1-9][0-9]{0,4})$/.exec(portText)?.[0] !== portText || Number(portText) > 65535))) {
  result = { ok: false, error: 'invalid-configuration' };
} else {
  result = await startLocalService({ runRoot: fileURLToPath(new URL('../../data/runs/', import.meta.url)),
    applicationRevision, port: portText === undefined ? 0 : Number(portText) });
}

function diagnostic(stream: NodeJS.WriteStream, event: object, exitCode: number): void {
  stream.write(JSON.stringify(event) + '\n', () => process.exit(exitCode));
}

if (!result.ok) {
  diagnostic(process.stderr, { event: 'service-startup-failed', error: result.error }, 1);
} else {
  const service = result.service;
  process.stdin.setEncoding('utf8');
  const lines = createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
  const requestStop = () => { void service.stop(); };
  const onLine = (line: string) => { if (line === 'stop') requestStop(); };
  let detached = false;
  void service.whenStopping.then(() => {
    if (detached) return;
    detached = true;
    lines.removeListener('line', onLine);
    lines.removeListener('close', requestStop);
    lines.close();
    process.stdin.pause();
    process.removeListener('SIGINT', requestStop);
    process.removeListener('SIGBREAK', requestStop);
  });
  void service.whenStopped.then(outcome => {
    if (outcome.ok) diagnostic(process.stdout, { event: 'service-stopped' }, 0);
    else diagnostic(process.stderr, { event: 'service-stop-failed' }, 1);
  });
  lines.on('line', onLine);
  lines.on('close', requestStop);
  process.on('SIGINT', requestStop);
  process.on('SIGBREAK', requestStop);
  process.stdout.write(JSON.stringify({ event: 'service-ready', url: service.url }) + '\n');
}
