import type { ReactElement } from 'react';
import type { PresentedResult, ResultSelection } from './resultPresentation.ts';

interface ResultCardProps {
  readonly result: PresentedResult;
  readonly selected: boolean;
  readonly onSelect?: (selection: ResultSelection, label: string) => void;
}

export function ResultCard({ result, selected, onSelect }: ResultCardProps): ReactElement {
  return <button type="button" aria-pressed={selected}
    onClick={() => onSelect?.(result.selection, result.label)}>
    <strong>{result.label}</strong>
    <span>{result.summary}</span>
    {result.kind === 'manual-review' && <span className="manual-review-tag">Needs manual review</span>}
  </button>;
}
