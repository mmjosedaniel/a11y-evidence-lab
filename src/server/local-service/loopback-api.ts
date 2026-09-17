import { receiveRescan } from './rescan-api.ts';
import http from 'node:http';
import type { ClientResponseTable } from './client-assets.ts';
import type { GenerationServiceOutcome, ReadResult, RetrievalOutcome, ReviewOutcome, ScanOutcome, RescanOutcome } from './contracts.ts';
import { receiveGeneration } from './generation-api.ts';
import { receiveReview } from './review-api.ts';

export interface LoopbackApiCallbacks {
  isStopping(): boolean;
  isBusy(): boolean;
  readRun(id: unknown): ReadResult;
  clientResponses?: ClientResponseTable;
  runScan?(input: unknown): Promise<ScanOutcome>;
  retrieveFinding?(input: unknown): Promise<RetrievalOutcome>;
  generateFinding?(input: unknown): Promise<GenerationServiceOutcome>;
  rescanFinding?(input: unknown): Promise<RescanOutcome>;
  reviewFinding?(input: unknown): Promise<ReviewOutcome>;
}

export function createLoopbackApiServer(callbacks: LoopbackApiCallbacks): http.Server {
  const server = http.createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status: number, body: unknown) => {
      if (response.destroyed || !response.writable || response.writableEnded) return;
      response.statusCode = status;
      response.setHeader('Content-Type', 'application/json;charset=utf-8');
      response.end(JSON.stringify(body));
    };
    const error = (status: number, code: string) => send(status, { ok: false, error: code });
    const scanError = (status: number, code: 'invalid-request' | 'scan-failed') => send(status,
      { ok: false, error: code, run: null, persisted: false, cleanupFailed: false });
    const target = request.url ?? '';
    if (request.method === 'POST' && callbacks.rescanFinding
        && target.split(/[?#]/, 1)[0] === '/api/rescans') {
      receiveRescan(request, input => callbacks.rescanFinding!(input), send);
      return;
    }
    if (request.method === 'POST' && callbacks.reviewFinding
        && target.split(/[?#]/, 1)[0] === '/api/finding-review') {
      receiveReview(request, input => callbacks.reviewFinding!(input), send);
      return;
    }
    if (request.method === 'POST' && callbacks.generateFinding
        && target.split(/[?#]/, 1)[0] === '/api/finding-generation') {
      receiveGeneration(request, input => callbacks.generateFinding!(input), send);
      return;
    }
    if (request.method === 'POST' && callbacks.retrieveFinding
        && target.split(/[?#]/, 1)[0] === '/api/finding-guidance') {
      const guidanceError = (status: number, code: 'invalid-request' | 'result-validation') => send(status,
        { ok: false, error: code, run: null, persisted: false, cleanupFailed: false });
      if (target.includes('?') || target.includes('#')) return guidanceError(400, 'invalid-request');
      const contentType = request.headers['content-type'];
      if (typeof contentType !== 'string' || contentType.trim().toLowerCase() !== 'application/json') {
        request.resume();
        return guidanceError(400, 'invalid-request');
      }
      const chunks: Buffer[] = [];
      let accepted = false;
      const invalid = () => {
        if (accepted) return;
        accepted = true;
        guidanceError(400, 'invalid-request');
      };
      request.on('data', chunk => chunks.push(Buffer.from(chunk)));
      request.once('aborted', invalid);
      request.once('error', invalid);
      request.once('end', () => {
        if (accepted) return;
        accepted = true;
        let input: unknown;
        try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
        catch { return guidanceError(400, 'invalid-request'); }
        void Promise.resolve().then(() => callbacks.retrieveFinding!(input)).then(result => {
          const status = result.ok ? 200 : {
            'invalid-request': 400, 'not-found': 404, busy: 409, 'workflow-active': 409, 'not-eligible': 409,
            stopping: 503, shutdown: 503, 'missing-prerequisite': 503, 'invalid-run': 500,
            'stored-run-unavailable': 500, 'read-failed': 500, 'retrieval-persistence': 500,
            'corpus-integrity': 500, 'model-identity': 500, 'input-fit': 500, 'embedding-failed': 500,
            'embedding-response': 500, timeout: 500, 'result-validation': 500,
          }[result.error];
          send(status, result);
        }, () => guidanceError(500, 'result-validation'));
      });
      return;
    }
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
      capabilities: { readRuns: true, scan: callbacks.runScan !== undefined, guidance: callbacks.retrieveFinding !== undefined },
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
