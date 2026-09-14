import type { ReactElement } from 'react';
import { RuleEvidence } from './RuleEvidence.tsx';
import type { PresentedResult } from './resultPresentation.ts';
import type { ProviderContext } from '../../../server/domain/run-contract.ts';
import { FindingGuidance } from './FindingGuidance.tsx';
import type { GuidanceControls } from './FindingGuidance.tsx';
import { FindingGeneration } from './FindingGeneration.tsx';
import type { GenerationControls } from './FindingGeneration.tsx';
import { ProposalDetail } from './ProposalDetail.tsx';
import { ProposalReviewForm } from './ProposalReviewForm.tsx';
import type { ReviewControls } from './ProposalReviewForm.tsx';
import { ReviewDecision } from './ReviewDecision.tsx';

interface ResultDetailProps {
  readonly review: ReviewControls;
  readonly generation: GenerationControls;
  readonly idPrefix: string;
  readonly result: PresentedResult;
  readonly providerContext: ProviderContext;
  readonly guidance: GuidanceControls;
}

export function ResultDetail({ idPrefix, result, providerContext, guidance, generation, review }: ResultDetailProps): ReactElement {
  const view = result.kind === 'finding' ? guidance.presentations[result.item.findingId]?.view : undefined;
  return <section className="finding-detail" role="region" aria-label={`${result.label} evidence`}>
    <h3 id={`${idPrefix}-selected-heading`}>{result.label}</h3>
    {result.kind === 'manual-review' && <p className="manual-review-tag">Needs manual review</p>}
    <RuleEvidence item={result.item} explanation={result.explanation} />
    {result.kind === 'finding' && <FindingGuidance finding={result.item} label={result.label}
      providerContext={providerContext} controls={guidance} generationConsumed={!!generation.presentations[result.item.findingId]} />}
    {result.kind === 'finding' && <FindingGeneration finding={result.item} label={result.label}
      providerContext={providerContext} controls={generation} />}
    {result.kind === 'finding' && 'result' in result.item && result.item.result.type === 'proposal' && view &&
      <ProposalDetail proposal={result.item.result} view={view} reviewed={'review' in result.item} />}
    {result.kind === 'finding' && result.item.state === 'proposal-pending-review' && view &&
      <ProposalReviewForm key={result.item.findingId} finding={result.item} label={result.label} controls={review} />}
    {result.kind === 'finding' && 'review' in result.item && view &&
      <ReviewDecision decision={result.item.review} view={view} findingId={result.item.findingId} takeFocus={review.takeSavedFocus} />}
  </section>;
}
