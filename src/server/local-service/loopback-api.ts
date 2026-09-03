import http from 'node:http';
import type { ClientResponseTable } from './client-assets.ts';
import type { ReadResult, ScanOutcome } from './contracts.ts';

export interface LoopbackApiCallbacks {
  isStopping(): boolean;
  isBusy(): boolean;
  readRun(id: unknown): ReadResult;
  clientResponses?: ClientResponseTable;
  runScan?(input: unknown): Promise<ScanOutcome>;
}

export function createLoopbackApiServer(callbacks: LoopbackApiCallbacks): http.Server {
  const server = http.createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status: number, body: unknown) => {
      response.statusCode = status;
      response.setHeader('Content-Type', 'application/json;charset=utf-8');
      response.end(JSON.stringify(body));
    };
    const error = (status: number, code: string) => send(status, { ok: false, error: code });
    const scanError = (status: number, code: 'invalid-request' | 'scan-failed') => send(status,
      { ok: false, error: code, run: null, persisted: false, cleanupFailed: false });
    const target = request.url ?? '';
    if (request.method === 'POST' && callbacks.runScan) {
      if (target.includes('?') || target.includes('#')) return scanError(400, 'invalid-request');
      if (target !== '/api/runs') return error(405, 'method-not-allowed');
      const contentType = request.headers['content-type'];
      if (typeof contentType !== 'string' || contentType.trim().toLowerCase() !== 'application/json') {
        request.resume();
        return scanError(400, 'invalid-request');
      }
      const chunks: Buffer[] = [];
      let settled = false;
      const invalid = () => {
        if (settled) return;
        settled = true;
        if (!response.destroyed && response.writable) scanError(400, 'invalid-request');
      };
      request.on('data', chunk => chunks.push(Buffer.from(chunk)));
      request.once('aborted', invalid);
      request.once('error', invalid);
      request.once('end', () => {
        if (settled) return;
        settled = true;
        let input: unknown;
        try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
        catch { return scanError(400, 'invalid-request'); }
        void callbacks.runScan!(input).then(result => {
          const status = result.ok ? 200 : {
            'invalid-request': 400, busy: 409, stopping: 503, shutdown: 503,
            'create-failed': 500, 'scan-failed': 500, 'result-validation': 500, 'initial-persistence': 500,
          }[result.error];
          send(status, result);
        }, () => scanError(500, 'scan-failed'));
      });
      return;
    }
    if (request.method !== 'GET') return error(405, 'method-not-allowed');
    if (target.includes('?') || target.includes('#')) return error(400, 'invalid-request');
    if (target === '/api/health') return send(200, {
      status: callbacks.isStopping() ? 'stopping' : 'ready', busy: callbacks.isBusy(),
      capabilities: { readRuns: true, scan: callbacks.runScan !== undefined },
    });
    if (callbacks.isStopping()) return error(503, 'stopping');
    if (!target.startsWith('/api/runs/')) {
      const asset = callbacks.clientResponses?.[target];
      if (!asset) return error(404, 'not-found');
      response.statusCode = 200;
      response.setHeader('Content-Type', asset.contentType);
      response.end(asset.body);
      return;
    }
    const result = callbacks.readRun(target.slice('/api/runs/'.length));
    if (result.ok) return send(200, result);
    const status = { 'invalid-id': 400, busy: 409, stopping: 503, 'not-found': 404,
      'invalid-run': 500, 'read-failed': 500, 'stored-run-unavailable': 500 }[result.error];
    return send(status, result);
  });
  server.on('connect', (_request, socket) => socket.destroy());
  server.on('upgrade', (_request, socket) => socket.destroy());
  return server;
}
