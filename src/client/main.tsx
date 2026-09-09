/// <reference types="vite/client" />
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import type { AnalyzeIntent } from './App.tsx';
import type { GuidanceIntent } from './finding-guidance-admission.ts';
import './styles.css';

const root = document.getElementById('root');
async function analyze(intent: AnalyzeIntent): Promise<unknown> {
  const response = await fetch('/api/runs', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestedUrl: intent.requestedUrl, mode: intent.providerContext.mode }) });
  return response.json() as Promise<unknown>;
}

async function retrieveFinding(intent: GuidanceIntent): Promise<unknown> {
  const response = await fetch('/api/finding-guidance', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(intent) });
  return response.json() as Promise<unknown>;
}

if (root) createRoot(root).render(<App analyze={analyze} retrieveFinding={retrieveFinding} />);
