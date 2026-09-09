import { readArray, readChoice, readObject, requireValid } from '../domain/run-contract/contract-value-reader.ts';
import type { SupportResult } from '../domain/finding-analysis-types.ts';
import { findPassageReference, PROFILE_REQUIRED_ROLES } from './corpus-identity.ts';
import { validateRetrievalResult } from './retrieval-contract.ts';

const failure = Object.freeze({ ok: false, error: 'result-validation' } as const);

export function classifyGuidanceSupport(finding: unknown, retrieval: unknown, conflicts: unknown = []): SupportResult {
  const result = validateRetrievalResult(retrieval, finding);
  if (!result.ok) return failure;
  try {
    const present = new Set(result.value.passages.map(passage => passage.passageId));
    const seen = new Set<string>();
    const unresolved: (readonly [string, string])[] = [];
    readArray(conflicts, input => {
      const conflict = readObject(input, ['passageIds', 'resolution']);
      const ids = readArray(conflict.passageIds, id => {
        requireValid(typeof id === 'string' && findPassageReference(id));
        return id;
      });
      requireValid(ids.length === 2 && ids[0] !== ids[1]);
      const [first, second] = [...ids].sort();
      const a = findPassageReference(first)!;
      const b = findPassageReference(second)!;
      requireValid(a.ruleId === b.ruleId && a.successCriterion === b.successCriterion);
      const key = `${first}\n${second}`;
      requireValid(!seen.has(key));
      seen.add(key);
      const resolution = readChoice(conflict.resolution, ['unresolved', 'normative-precedence']);
      const normativeCount = Number(a.sourceType === 'recommendation') + Number(b.sourceType === 'recommendation');
      requireValid(resolution !== 'normative-precedence' || normativeCount === 1);
      if (normativeCount !== 1 && present.has(first) && present.has(second)) {
        unresolved.push(Object.freeze([first, second] as const));
      }
      return null;
    });
    unresolved.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0);
    const presentRoles = new Set(result.value.passages.map(passage => findPassageReference(passage.passageId)!.guidanceRole));
    const missingRoles = Object.freeze(PROFILE_REQUIRED_ROLES[result.value.filter.ruleId].filter(role => !presentRoles.has(role)));
    const state = unresolved.length ? 'conflicting' : present.size === 0 ? 'missing' : missingRoles.length ? 'incomplete' : 'supported';
    return Object.freeze({ ok: true, value: Object.freeze({ state, missingRoles, conflicts: Object.freeze(unresolved) }) });
  } catch {
    return failure;
  }
}
