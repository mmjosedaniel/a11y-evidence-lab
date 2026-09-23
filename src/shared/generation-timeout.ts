// Fixed ordinary-operation policy shared by the independent browser and server clocks.
export function generationTimeoutMs(mode: 'local' | 'groq'): 120000 | 300000 {
  return mode === 'local' ? 300000 : 120000;
}
