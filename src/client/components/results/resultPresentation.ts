import type { Finding, ScannerReviewObservation } from '../../../server/domain/run-contract.ts';

export type EvidenceItem = Finding | ScannerReviewObservation;
export type RuleId = Finding['ruleId'];

export type ResultSelection =
  | { readonly kind: 'finding'; readonly findingId: string }
  | { readonly kind: 'manual-review'; readonly observationIndex: number };

interface PresentedFinding {
  readonly kind: 'finding';
  readonly item: Finding;
  readonly key: string;
  readonly label: string;
  readonly selection: Extract<ResultSelection, { kind: 'finding' }>;
  readonly summary: string;
  readonly explanation: string;
}

interface PresentedManualReview {
  readonly kind: 'manual-review';
  readonly item: ScannerReviewObservation;
  readonly key: string;
  readonly label: string;
  readonly selection: Extract<ResultSelection, { kind: 'manual-review' }>;
  readonly summary: string;
  readonly explanation: string;
}

export type PresentedResult = PresentedFinding | PresentedManualReview;

export type DisplayFact = { readonly value: unknown } | { readonly unavailable: string };

export const ruleOrder: readonly RuleId[] = ['image-alt', 'label', 'color-contrast'];
export const limitation = 'Checks cover image alternatives, form labels, and color contrast in the rendered top-level page. Results are not an accessibility or compliance certification.';
export const manualIntro = 'Items tagged Needs manual review could not be determined automatically.';

export function availableValue(fact: DisplayFact): unknown | undefined {
  return 'value' in fact ? fact.value : undefined;
}

export function plainReason(reason: string): string {
  return reason.replaceAll('-', ' ');
}

export function unavailableText(fact: DisplayFact): string {
  return 'unavailable' in fact ? `Unavailable (${plainReason(fact.unavailable)})` : '';
}

export function ordinaryText(fact: DisplayFact): string {
  if ('unavailable' in fact) return fact.unavailable === 'not-applicable' ? 'Not applicable' : unavailableText(fact);
  return String(fact.value);
}

export function ratioText(fact: DisplayFact): string {
  if ('unavailable' in fact) return unavailableText(fact);
  const value = Number(fact.value);
  return `${Number.isInteger(value) ? value : Number(value.toFixed(2))}:1`;
}

export function countText(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function ruleDisplayName(ruleId: RuleId): string {
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

function findingExplanation(item: Finding): string {
  switch (item.ruleId) {
    case 'image-alt': return 'The image does not have usable alternative text.';
    case 'label': return 'The form control does not have a usable accessible name.';
    case 'color-contrast':
      return `Measured contrast is ${ratioText(item.evidence.contrastRatio)}; this text requires ${ratioText(item.evidence.expectedContrastRatio)}.`;
  }
}

function manualReviewReason(item: ScannerReviewObservation): string {
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

function findingLabel(finding: Finding, index: number): string {
  switch (finding.ruleId) {
    case 'image-alt': return `Image alternative issue ${index}`;
    case 'label': return `Form label issue ${index}`;
    case 'color-contrast': return `Color contrast issue ${index}`;
  }
}

function manualReviewLabel(observation: ScannerReviewObservation, index: number): string {
  switch (observation.ruleId) {
    case 'image-alt': return `Image alternative review ${index}`;
    case 'label': return `Form label review ${index}`;
    case 'color-contrast': return `Color contrast review ${index}`;
  }
}

export function presentResults(
  findings: readonly Finding[],
  observations: readonly ScannerReviewObservation[],
): readonly PresentedResult[] {
  const presentedFindings: PresentedFinding[] = findings.map(finding => ({
    kind: 'finding',
    item: finding,
    key: `finding-${finding.findingId}`,
    label: findingLabel(finding, findings.filter(candidate => candidate.ruleId === finding.ruleId)
      .findIndex(candidate => candidate.findingId === finding.findingId) + 1),
    selection: { kind: 'finding', findingId: finding.findingId },
    summary: affectedElementText(finding),
    explanation: findingExplanation(finding),
  }));
  const presentedReviews: PresentedManualReview[] = observations.map((observation, observationIndex) => ({
    kind: 'manual-review',
    item: observation,
    key: `review-${observationIndex}`,
    label: manualReviewLabel(observation, observations.filter(candidate => candidate.ruleId === observation.ruleId)
      .findIndex(candidate => candidate === observation) + 1),
    selection: { kind: 'manual-review', observationIndex },
    summary: affectedElementText(observation),
    explanation: manualReviewReason(observation),
  }));
  return [...presentedFindings, ...presentedReviews];
}

export function selectedResult(
  results: readonly PresentedResult[],
  selected: ResultSelection | null,
): PresentedResult | undefined {
  if (!selected) return undefined;
  return results.find(result => result.kind === 'finding'
    ? selected.kind === 'finding' && result.selection.findingId === selected.findingId
    : selected.kind === 'manual-review' && result.selection.observationIndex === selected.observationIndex);
}

export function resultIsSelected(result: PresentedResult, selected: ResultSelection | null): boolean {
  if (!selected) return false;
  return result.kind === 'finding'
    ? selected.kind === 'finding' && result.selection.findingId === selected.findingId
    : selected.kind === 'manual-review' && result.selection.observationIndex === selected.observationIndex;
}
