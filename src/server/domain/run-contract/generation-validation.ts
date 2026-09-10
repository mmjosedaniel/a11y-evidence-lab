import { readProviderInvocation } from '../../generation/generation-contract.ts';
import { validateProposal } from '../../generation/proposal-contract.ts';
import { readChoice, readObject, readTime, requireKeys, requireValid } from './contract-value-reader.ts';
import { readAssessedFinding } from './finding-analysis-validation.ts';
import type { GenerationFinding, NativeFinding } from './run-types.ts';

export function readGenerationFinding(record: Record<string, unknown>, native: NativeFinding,
  parentFinishedAt: string): GenerationFinding {
  const base = readAssessedFinding({ ...native, state: 'active', retrieval: record.retrieval,
    analysis: record.analysis }, native, parentFinishedAt);
  requireValid(base.state === 'active' && 'retrieval' in base && base.retrieval.status === 'completed'
    && base.analysis.status === 'completed');
  const generation = readObject(record.generation);
  const status = readChoice(generation.status, ['running', 'completed', 'failed']);
  const startedAt = readTime(generation.startedAt);
  requireValid(startedAt >= base.analysis.finishedAt && startedAt >= base.retrieval.finishedAt);
  requireKeys(record, [...Object.keys(base), 'generation', ...(status === 'completed' ? ['result'] : [])]);
  if (status === 'running') {
    requireValid(record.state === 'active');
    requireKeys(generation, ['status', 'startedAt']);
    return Object.freeze({ ...base, generation: Object.freeze({ status, startedAt }) });
  }
  const finishedAt = readTime(generation.finishedAt);
  requireValid(finishedAt >= startedAt);
  if (status === 'completed') {
    requireValid(record.state === 'proposal-pending-review');
    requireKeys(generation, ['status', 'startedAt', 'finishedAt', 'invocation']);
    const invocation = readProviderInvocation(generation.invocation);
    requireValid(invocation.outcome === 'response' && invocation.validation === 'passed');
    const proposal = validateProposal(record.result, { finding: native, retrieval: base.retrieval.result });
    requireValid(proposal.ok);
    return Object.freeze({ ...base, state: 'proposal-pending-review',
      generation: Object.freeze({ status, startedAt, finishedAt, invocation }), result: proposal.value });
  }
  requireValid(record.state === 'failed');
  const attempted = Object.hasOwn(generation, 'invocation');
  requireKeys(generation, ['status', 'startedAt', 'finishedAt', 'error', ...(attempted ? ['invocation'] : [])]);
  const error = readChoice(generation.error, ['input-integrity', 'configuration', 'missing-prerequisite', 'input-fit',
    'authentication', 'quota', 'rate-limit', 'network', 'provider', 'timeout', 'shutdown', 'response-validation']);
  const invocation = attempted ? readProviderInvocation(generation.invocation) : undefined;
  if (invocation) {
    requireValid(!['input-integrity', 'configuration', 'missing-prerequisite', 'input-fit'].includes(error));
    if (error === 'response-validation') requireValid(invocation.outcome === 'response' && invocation.validation === 'failed');
    else if (error !== 'timeout' && error !== 'shutdown') requireValid(invocation.outcome === error);
  } else requireValid(['input-integrity', 'configuration', 'missing-prerequisite', 'input-fit', 'timeout', 'shutdown'].includes(error));
  return Object.freeze({ ...base, state: 'failed', generation: Object.freeze({ status, startedAt, finishedAt,
    error, ...(invocation ? { invocation } : {}) }) });
}
