import { readFinding } from '../domain/run-contract/finding-validation.ts';
import type { Fact, Finding, NameSources } from '../domain/run-contract/run-types.ts';
import type { RetrievalRuleId, SuccessCriterion } from './corpus-identity.ts';

export type FindingQuery = {
  readonly version: 'm2-retrieval-query-v1';
  readonly ruleId: RetrievalRuleId;
  readonly successCriterion: SuccessCriterion;
  readonly element: string;
  readonly condition: string;
  readonly text: string;
};
export type FindingQueryResult =
  | { readonly ok: true; readonly value: FindingQuery }
  | { readonly ok: false; readonly error: 'result-validation' };

const failure = Object.freeze({ ok: false, error: 'result-validation' } as const);
const factText = <T>(fact: Fact<T>, unavailableLabel: string): string =>
  'value' in fact ? String(fact.value) : `${unavailableLabel}: ${fact.unavailable}`;

function hasPositiveNameSource(sources: NameSources): boolean {
  return ('value' in sources.explicitLabel && sources.explicitLabel.value)
    || ('value' in sources.implicitLabel && sources.implicitLabel.value)
    || ('value' in sources.ariaLabel && sources.ariaLabel.value === 'non-empty')
    || ('value' in sources.title && sources.title.value === 'non-empty')
    || ('value' in sources.placeholder && sources.placeholder.value === 'non-empty')
    || ('value' in sources.ariaLabelledby && ['resolved', 'partially-resolved'].includes(sources.ariaLabelledby.value))
    || ('value' in sources.presentationalRole && sources.presentationalRole.value);
}

function hasUnavailableNameSource(sources: NameSources): boolean {
  return Object.values(sources).some(source => 'unavailable' in source);
}

function project(finding: Finding): Omit<FindingQuery, 'version' | 'text'> {
  switch (finding.ruleId) {
    case 'image-alt':
      return {
        ruleId: finding.ruleId,
        successCriterion: '1.1.1',
        element: factText(finding.evidence.elementKind, 'element kind unavailable'),
        condition: 'value' in finding.evidence.altState
          ? finding.evidence.altState.value === 'absent' ? 'alt attribute absent'
            : finding.evidence.altState.value === 'empty' ? 'alt attribute empty'
              : finding.evidence.altState.value === 'whitespace-only' ? 'alt attribute contains only whitespace'
                : 'non-empty alt attribute was recorded, and axe-core reported an image-alt violation'
          : `alt attribute state unavailable: ${finding.evidence.altState.unavailable}`,
      };
    case 'label': {
      const sources = finding.evidence.nameSources;
      const condition = hasPositiveNameSource(sources)
        ? 'axe-core reported a label violation; one or more label or name-source indicators were recorded'
        : hasUnavailableNameSource(sources)
          ? 'axe-core reported a label violation; label and name-source indicator completeness is unavailable'
          : 'axe-core reported a label violation; no positive label or name-source indicator was recorded';
      return { ruleId: finding.ruleId, successCriterion: '4.1.2', element: factText(finding.evidence.elementKind, 'element kind unavailable'), condition };
    }
    case 'color-contrast': {
      const actual = finding.evidence.contrastRatio;
      const expected = finding.evidence.expectedContrastRatio;
      const condition = 'value' in actual && 'value' in expected
        ? actual.value < expected.value ? 'recorded contrast ratio is below the recorded required ratio'
          : actual.value === expected.value ? 'recorded contrast ratio equals the recorded required ratio'
            : 'recorded contrast ratio is above the recorded required ratio, and axe-core reported a color-contrast violation'
        : 'contrast-ratio relation is unavailable';
      return { ruleId: finding.ruleId, successCriterion: '1.4.3', element: 'color-contrast target', condition };
    }
  }
}

export function createFindingQuery(input: unknown): FindingQueryResult {
  try {
    const fields = project(readFinding(input));
    const text = `Find accessibility guidance for an axe-core ${fields.ruleId} violation mapped to WCAG 2.2 SC ${fields.successCriterion}.\n`
      + `Affected element type: ${fields.element}.\nObserved condition: ${fields.condition}.\n`
      + 'Return guidance that explains the issue, a bounded remediation approach, and what a person must verify.';
    return Object.freeze({ ok: true, value: Object.freeze({ version: 'm2-retrieval-query-v1', ...fields, text }) });
  } catch {
    return failure;
  }
}
