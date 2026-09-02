import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type { Finding, ScannerReviewObservation } from '../server/domain/run-contract.ts';

export type EvidenceItem = Finding | ScannerReviewObservation;
type DisplayFact = { readonly value: unknown } | { readonly unavailable: string };

function availableValue(fact: DisplayFact): unknown | undefined {
  return 'value' in fact ? fact.value : undefined;
}

function plainReason(reason: string): string {
  return reason.replaceAll('-', ' ');
}

function titleCase(value: string): string {
  return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}

function unavailableText(fact: DisplayFact): string {
  return 'unavailable' in fact ? `Unavailable (${plainReason(fact.unavailable)})` : '';
}

function attributeText(fact: DisplayFact): string {
  if ('unavailable' in fact) return unavailableText(fact);
  switch (fact.value) {
    case 'absent': return 'Missing';
    case 'empty': return 'Empty';
    case 'whitespace-only': return 'Whitespace only';
    case 'non-empty': return 'Present';
    case 'unresolved': return 'Unresolved';
    case 'partially-resolved': return 'Partially resolved';
    case 'resolved': return 'Resolved';
    default: return titleCase(String(fact.value));
  }
}

function booleanText(fact: DisplayFact): string {
  if ('unavailable' in fact) return unavailableText(fact);
  return fact.value ? 'Yes' : 'No';
}

function ordinaryText(fact: DisplayFact): string {
  if ('unavailable' in fact) return fact.unavailable === 'not-applicable' ? 'Not applicable' : unavailableText(fact);
  return String(fact.value);
}

function ratioText(fact: DisplayFact): string {
  if ('unavailable' in fact) return unavailableText(fact);
  const value = Number(fact.value);
  return `${Number.isInteger(value) ? value : Number(value.toFixed(2))}:1`;
}

function Field({ label, children }: { readonly label: string; readonly children: ReactNode }): ReactElement {
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}

function ColorValue({ fact }: { readonly fact: DisplayFact }): ReactElement {
  if ('unavailable' in fact) return <>{unavailableText(fact)}</>;
  const value = String(fact.value);
  const safeColor = /^#[0-9a-f]{6}$/i.test(value);
  const style = safeColor ? { backgroundColor: value } as CSSProperties : undefined;
  return <span className="color-value">
    {safeColor && <span className="color-sample" style={style} aria-hidden="true" />}
    <code>{value}</code>
  </span>;
}

export function ruleDisplayName(ruleId: EvidenceItem['ruleId']): string {
  switch (ruleId) {
    case 'image-alt': return 'Image alternatives';
    case 'label': return 'Form labels';
    case 'color-contrast': return 'Color contrast';
  }
}

export function affectedElementText(item: EvidenceItem): string {
  switch (item.ruleId) {
    case 'image-alt': return 'Image element';
    case 'label': {
      const element = availableValue(item.evidence.elementKind);
      const inputType = availableValue(item.evidence.inputType);
      if (element === 'textarea') return 'Textarea';
      if (element === 'input') return inputType ? `Input · ${inputType}` : 'Input';
      return 'Form control';
    }
    case 'color-contrast':
      return [ordinaryText(item.evidence.foregroundColor), ordinaryText(item.evidence.backgroundColor),
        ordinaryText(item.evidence.fontSize), ordinaryText(item.evidence.fontWeight)].join(' · ');
  }
}

export function findingExplanation(item: Finding): string {
  switch (item.ruleId) {
    case 'image-alt': return 'The image does not have usable alternative text.';
    case 'label': return 'The form control does not have a usable accessible name.';
    case 'color-contrast':
      return `Measured contrast is ${ratioText(item.evidence.contrastRatio)}; this text requires ${ratioText(item.evidence.expectedContrastRatio)}.`;
  }
}

export function manualReviewReason(item: ScannerReviewObservation): string {
  switch (item.ruleId) {
    case 'image-alt': return 'Alternative text could not be inspected';
    case 'label': return 'unavailable' in item.incompleteReason && item.incompleteReason.unavailable === 'missing'
      ? 'Label information was not available'
      : 'Label information was withheld';
    case 'color-contrast': return availableValue(item.incompleteReason) === 'bgImage'
      ? 'Background imagery prevented a reliable contrast result'
      : 'Color contrast could not be measured reliably';
  }
}

function Location({ locator }: { readonly locator: EvidenceItem['locator'] }): ReactElement {
  if ('value' in locator) return <code>{locator.value}</code>;
  return <>Page location unavailable ({plainReason(locator.unavailable)})</>;
}

function ImageEvidence({ item }: { readonly item: Extract<EvidenceItem, { ruleId: 'image-alt' }> }): ReactElement {
  return <dl className="evidence-facts">
    <Field label="Element">Image</Field>
    <Field label="Alternative text">{attributeText(item.evidence.altState)}</Field>
  </dl>;
}

function LabelEvidence({ item }: { readonly item: Extract<EvidenceItem, { ruleId: 'label' }> }): ReactElement {
  const presentationalRole = availableValue(item.evidence.nameSources.presentationalRole);
  return <dl className="evidence-facts">
    <Field label="Element">{ordinaryText(item.evidence.elementKind)}</Field>
    <Field label="Input type">{ordinaryText(item.evidence.inputType)}</Field>
    <Field label="Explicit label">{booleanText(item.evidence.nameSources.explicitLabel)}</Field>
    <Field label="Implicit label">{booleanText(item.evidence.nameSources.implicitLabel)}</Field>
    <Field label="ARIA label">{attributeText(item.evidence.nameSources.ariaLabel)}</Field>
    <Field label="ARIA labelled by">{attributeText(item.evidence.nameSources.ariaLabelledby)}</Field>
    <Field label="Title">{attributeText(item.evidence.nameSources.title)}</Field>
    <Field label="Placeholder">{attributeText(item.evidence.nameSources.placeholder)}</Field>
    {presentationalRole === true && <Field label="Presentational role">Yes</Field>}
  </dl>;
}

function ContrastEvidence({ item }: { readonly item: Extract<EvidenceItem, { ruleId: 'color-contrast' }> }): ReactElement {
  const messageKey = availableValue(item.evidence.messageKey);
  const showShadow = availableValue(item.evidence.shadowColor) !== undefined &&
    (messageKey === 'shadowOnBgColor' || messageKey === 'fgOnShadowColor');
  return <dl className="evidence-facts">
    <Field label="Text color"><ColorValue fact={item.evidence.foregroundColor} /></Field>
    <Field label="Background color"><ColorValue fact={item.evidence.backgroundColor} /></Field>
    {showShadow && <Field label="Shadow color"><ColorValue fact={item.evidence.shadowColor} /></Field>}
    <Field label="Measured contrast">{ratioText(item.evidence.contrastRatio)}</Field>
    <Field label="Required contrast">{ratioText(item.evidence.expectedContrastRatio)}</Field>
    <Field label="Font size">{ordinaryText(item.evidence.fontSize)}</Field>
    <Field label="Font weight">{titleCase(ordinaryText(item.evidence.fontWeight))}</Field>
  </dl>;
}

export function RuleEvidence({ item, explanation }: {
  readonly item: EvidenceItem;
  readonly explanation: string;
}): ReactElement {
  return <div className="rule-evidence">
    <p className="evidence-explanation">{explanation}</p>
    <dl className="evidence-context">
      <Field label="Affected element">{affectedElementText(item)}</Field>
      <Field label="Where on the page"><Location locator={item.locator} /></Field>
    </dl>
    <h4>Evidence</h4>
    {item.ruleId === 'image-alt' && <ImageEvidence item={item} />}
    {item.ruleId === 'label' && <LabelEvidence item={item} />}
    {item.ruleId === 'color-contrast' && <ContrastEvidence item={item} />}
  </div>;
}
