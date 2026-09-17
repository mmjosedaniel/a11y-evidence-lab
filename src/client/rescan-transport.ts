import type { RescanIntent } from './rescan-admission.ts';

export async function postRescan(intent: RescanIntent, signal: AbortSignal): Promise<unknown> {
  const response = await fetch('/api/rescans', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ runId: intent.runId, baselineRunId: intent.baselineRunId,
      findingId: intent.findingId, mode: intent.mode }), signal,
  });
  return { status: response.status, body: await response.json() };
}
