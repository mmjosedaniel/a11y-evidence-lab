import type { ReactElement } from 'react';
import { RuleEvidence } from './RuleEvidence.tsx';
import type { PresentedResult } from './resultPresentation.ts';

interface ResultDetailProps {
  readonly idPrefix: string;
  readonly result: PresentedResult;
}

export function ResultDetail({ idPrefix, result }: ResultDetailProps): ReactElement {
  return <section className="finding-detail" role="region" aria-label={`${result.label} evidence`}>
    <h3 id={`${idPrefix}-selected-heading`}>{result.label}</h3>
    {result.kind === 'manual-review' && <p className="manual-review-tag">Needs manual review</p>}
    <RuleEvidence item={result.item} explanation={result.explanation} />
  </section>;
}
