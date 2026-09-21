import { readObject, readChoice } from '../domain/run-contract/contract-value-reader.ts';

const codes = ['adapter-response/body', 'adapter-response/envelope', 'adapter-response/content',
  'candidate/contract', 'executor/envelope', 'caller/correspondence', 'adapter-response/unspecified'] as const;
export type GenerationRejectionCode = typeof codes[number];
export type GenerationRejectionSink = (event: Readonly<{ code: GenerationRejectionCode }>) => unknown;
export function readGenerationRejection(value: unknown): GenerationRejectionCode {
  return readChoice(readObject(value, ['code']).code, codes);
}
export function emitGenerationRejection(sink: GenerationRejectionSink | undefined, code: GenerationRejectionCode): void {
  if (sink === undefined) return;
  try { void Promise.resolve(sink(Object.freeze({ code }))).catch(() => undefined); }
  catch { /* A diagnostic callback cannot change generation behavior. */ }
}
