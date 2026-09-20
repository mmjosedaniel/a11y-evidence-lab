import type { StoredComparison } from '../../../server/domain/run-contract/comparison-types.ts';
import type { ComparisonAvailability } from '../../comparison-request.ts';
import { plainReason } from './resultPresentation.ts';

export function availabilityText(availability: ComparisonAvailability): string | null {
  if (availability.status === 'available') return null;
  return availability.status === 'unavailable'
    ? 'The saved comparison remains available, but its baseline cannot be inspected.'
    : 'Baseline availability could not be verified.';
}

export function presentComparison(comparison: StoredComparison) {
  const after = 'after' in comparison ? comparison.after : null;
  return {
    pair: plainReason(comparison.pair),
    match: 'match' in comparison ? plainReason(comparison.match) : null,
    outcome: 'outcome' in comparison ? plainReason(comparison.outcome) : 'not comparable',
    reason: plainReason(comparison.reason),
    after,
    afterLabel: after?.kind === 'native-pass' ? 'Native pass observation'
      : after?.kind === 'incomplete' ? 'Scanner review observation' : 'Finding',
    absentAfter: `After evidence unavailable: ${plainReason(comparison.reason)}.`,
    mismatches: 'mismatches' in comparison ? comparison.mismatches.map(plainReason) : [],
    delta: 'delta' in comparison ? comparison.delta : undefined,
  };
}
