import { readFinding } from './run-contract/finding-validation.ts';
import type { NativeFinding, Unavailable } from './run-contract/run-types.ts';
import type { EvidenceAssessment, EvidencePath } from './finding-analysis-types.ts';

export function assessFindingEvidence(native: NativeFinding): EvidenceAssessment {
  const finding = readFinding(native);
  const availableReferences: EvidencePath[] = [];
  const blockers: { readonly reference: EvidencePath; readonly reason: Unavailable['unavailable'] }[] = [];
  const add = (reference: EvidencePath, fact: { readonly value: unknown } | Unavailable | string, required = true): void => {
    if (typeof fact === 'string' || 'value' in fact) availableReferences.push(reference);
    else if (required) blockers.push(Object.freeze({ reference, reason: fact.unavailable }));
  };
  add('checks', finding.checks);
  switch (finding.ruleId) {
    case 'image-alt':
      add('evidence.elementKind', finding.evidence.elementKind);
      add('evidence.altState', finding.evidence.altState);
      break;
    case 'label': {
      const evidence = finding.evidence;
      add('evidence.elementKind', evidence.elementKind);
      if ('value' in evidence.elementKind && evidence.elementKind.value === 'input') {
        add('evidence.inputType', evidence.inputType as { readonly value: unknown } | Unavailable);
      }
      for (const name of ['explicitLabel', 'implicitLabel', 'ariaLabel', 'ariaLabelledby', 'title', 'placeholder', 'presentationalRole'] as const) {
        add(`evidence.nameSources.${name}`, evidence.nameSources[name]);
      }
      break;
    }
    case 'color-contrast': {
      const evidence = finding.evidence;
      for (const name of ['foregroundColor', 'backgroundColor', 'contrastRatio', 'expectedContrastRatio', 'fontSize', 'fontWeight', 'measurementSource'] as const) {
        add(`evidence.${name}`, evidence[name]);
      }
      const requiresShadow = 'value' in evidence.messageKey
        && (evidence.messageKey.value === 'shadowOnBgColor' || evidence.messageKey.value === 'fgOnShadowColor');
      if (requiresShadow) add('evidence.shadowColor', evidence.shadowColor);
      add('evidence.messageKey', evidence.messageKey, false);
      if (!requiresShadow) add('evidence.shadowColor', evidence.shadowColor, false);
      break;
    }
  }
  return Object.freeze({ state: blockers.length ? 'incomplete' : 'complete',
    availableReferences: Object.freeze(availableReferences), blockers: Object.freeze(blockers) });
}
