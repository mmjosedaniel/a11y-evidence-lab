import type { ReactElement } from 'react';
import { ResultCard } from './ResultCard.tsx';
import { manualIntro, resultIsSelected, ruleDisplayName, ruleOrder } from './resultPresentation.ts';
import type { PresentedResult, ResultSelection } from './resultPresentation.ts';

interface FindingsPanelProps {
  readonly idPrefix: string;
  readonly results: readonly PresentedResult[];
  readonly selectedResult: ResultSelection | null;
  readonly onSelect?: (selection: ResultSelection, label: string) => void;
}

export function FindingsPanel({ idPrefix, results, selectedResult, onSelect }: FindingsPanelProps): ReactElement {
  const manualReviews = results.filter(result => result.kind === 'manual-review');

  return <section aria-labelledby={`${idPrefix}-findings`} className="findings-column" tabIndex={0}>
    <h3 id={`${idPrefix}-findings`}>Findings</h3>
    {manualReviews.length > 0 && <p>{manualIntro}</p>}
    {ruleOrder.map(rule => {
      const group = results.filter(result => result.item.ruleId === rule);
      const headingId = `${idPrefix}-${rule}-findings`;
      return <div key={rule} role="group" aria-labelledby={headingId} className="finding-group">
        <h4 id={headingId}>{ruleDisplayName(rule)}</h4>
        {group.length === 0 ? <p>No findings or manual reviews in this check.</p> : <ul className="finding-list">
          {group.map(result => <li key={result.key}>
            <ResultCard result={result} selected={resultIsSelected(result, selectedResult)} onSelect={onSelect} />
          </li>)}
        </ul>}
      </div>;
    })}
  </section>;
}
