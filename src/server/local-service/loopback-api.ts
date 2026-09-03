import http from 'node:http';
import type { ReadResult } from './contracts.ts';

export interface LoopbackApiCallbacks {
  isStopping(): boolean;
  isBusy(): boolean;
  readRun(id: unknown): ReadResult;
}

export function createLoopbackApiServer(callbacks: LoopbackApiCallbacks): http.Server {
  const server = http.createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json;charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status: number, body: unknown) => { response.statusCode = status; response.end(JSON.stringify(body)); };
    const error = (status: number, code: string) => send(status, { ok: false, error: code });
    const target = request.url ?? '';
    if (request.method !== 'GET') return error(405, 'method-not-allowed');
    if (target.includes('?') || target.includes('#')) return error(400, 'invalid-request');
    if (target === '/api/health') return send(200, {
      status: callbacks.isStopping() ? 'stopping' : 'ready', busy: callbacks.isBusy(),
      capabilities: { readRuns: true, scan: false },
    });
    if (callbacks.isStopping()) return error(503, 'stopping');
    if (!target.startsWith('/api/runs/')) return error(404, 'not-found');
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
