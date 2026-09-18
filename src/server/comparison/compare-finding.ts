import { validateComparisonInput } from './comparison-contract.ts';
import type { ComparisonCalculation, ComparisonResult, EvidenceOutcome } from './comparison-contract.ts';
import { classifyEvidencePair, comparisonFollowUp, comparisonLimitations, comparisonRationale } from './finding-outcome.ts';
import { compareScanProfiles, comparisonProfile } from './scan-pair.ts';
import { comparisonObservation, correlateTarget } from './target-correlation.ts';

export function compareFinding(input: unknown): ComparisonCalculation {
  const admitted = validateComparisonInput(input);
  if (!admitted.ok) return admitted;
  const { baselineRun, baselineFinding, laterRun } = admitted.value;
  const mismatches = compareScanProfiles(
    comparisonProfile(baselineRun, baselineFinding.ruleId), comparisonProfile(laterRun, baselineFinding.ruleId),
  );
  const observation = comparisonObservation(baselineFinding);
  const common = {
    baseline: Object.freeze({ runId: baselineRun.runId, findingId: baselineFinding.findingId, observation }),
    laterRunId: laterRun.runId,
    context: Object.freeze({
      baseline: Object.freeze({ requestedUrl: baselineRun.requestedUrl, scanContext: baselineRun.scan.context }),
      later: Object.freeze({ requestedUrl: laterRun.requestedUrl, scanContext: laterRun.scan.context }),
    }),
    limitations: comparisonLimitations,
    followUp: comparisonFollowUp,
  };
  if (mismatches.length > 0) {
    return Object.freeze({ ok: true, value: Object.freeze({ ...common, pair: 'not-comparable',
      mismatches, reason: 'pair-mismatch', rationale: comparisonRationale('pair-mismatch') }) });
  }
  const match = correlateTarget(admitted.value);
  const outcome: EvidenceOutcome = 'after' in match
    ? classifyEvidencePair(observation, match.after.observation)
    : Object.freeze({ outcome: 'inconclusive', reason: match.match });
  const value: ComparisonResult = Object.freeze({ ...common, pair: 'comparable', ...match, ...outcome,
    rationale: comparisonRationale(outcome.reason) });
  return Object.freeze({ ok: true, value });
}
