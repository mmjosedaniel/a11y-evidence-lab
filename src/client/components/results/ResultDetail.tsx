import type { ReactElement } from 'react';
import { RuleEvidence } from './RuleEvidence.tsx';
import type { PresentedResult } from './resultPresentation.ts';
import type { ProviderContext } from '../../../server/domain/run-contract.ts';
import { FindingGuidance } from './FindingGuidance.tsx';
import type { GuidanceControls } from './FindingGuidance.tsx';

interface ResultDetailProps {
  readonly idPrefix: string;
  readonly result: PresentedResult;
  readonly providerContext: ProviderContext;
  readonly guidance: GuidanceControls;
}

export function ResultDetail({ idPrefix, result, providerContext, guidance }: ResultDetailProps): ReactElement {
  return <section className="finding-detail" role="region" aria-label={`${result.label} evidence`}>
    <h3 id={`${idPrefix}-selected-heading`}>{result.label}</h3>
    {result.kind === 'manual-review' && <p className="manual-review-tag">Needs manual review</p>}
    <RuleEvidence item={result.item} explanation={result.explanation} />
    {result.kind === 'finding' && <FindingGuidance finding={result.item} label={result.label}
      providerContext={providerContext} controls={guidance} />}
  </section>;
}
