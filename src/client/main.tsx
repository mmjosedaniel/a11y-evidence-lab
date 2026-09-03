/// <reference types="vite/client" />
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import type { AnalyzeIntent } from './App.tsx';
import './styles.css';

const root = document.getElementById('root');
async function analyze(intent: AnalyzeIntent): Promise<unknown> {
  const response = await fetch('/api/runs', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestedUrl: intent.requestedUrl, mode: intent.providerContext.mode }) });
  return response.json() as Promise<unknown>;
}

if (root) createRoot(root).render(<App analyze={analyze} />);
