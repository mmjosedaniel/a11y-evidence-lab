import { readObject } from '../domain/run-contract/contract-value-reader.ts';

const judgments: Readonly<Record<string, string>> = Object.freeze({
  'image-alt': 'Determine image purpose, informative versus decorative treatment and suitable equivalent wording; image meaning remains unresolved.',
  label: 'Determine appropriate visible label wording and verify the actual programmatic association; suitable wording remains unresolved.',
  'color-contrast': 'Determine meaningful text, applicable threshold or exception and visual context; verify native measurements without inventing new measurements.',
});

export function blockingManualJudgmentForRule(ruleId: string): string {
  if (!Object.hasOwn(judgments, ruleId)) throw new Error('Unsupported generation rule');
  return judgments[ruleId];
}

export function validateBlockingManualJudgment(proposal: unknown, ruleId: string): boolean {
  try {
    return readObject(proposal).blockingManualJudgment === blockingManualJudgmentForRule(ruleId);
  } catch { return false; }
}
