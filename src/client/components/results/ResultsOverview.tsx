import type { ReactElement } from 'react';
import type { PageAnalysisRun } from '../../../server/domain/run-contract.ts';
import { countText, ruleDisplayName, ruleOrder } from './resultPresentation.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;

export function ResultsOverview({ run }: { readonly run: CompleteRun }): ReactElement {
  const findings = run.scan.findings.length;
  const reviews = run.scan.scannerReviewObservations.length;
  return <section aria-labelledby="results-overview-heading" className="results-overview">
    <h3 id="results-overview-heading">Results overview</h3>
    <p className="finding-total">{findings === 0 ? 'No automated findings in the three supported checks' : `${countText(findings, 'finding')} ${findings === 1 ? 'needs' : 'need'} review`}</p>
    {reviews > 0 && <p className="review-total">{countText(reviews, 'item')} {reviews === 1 ? 'needs' : 'need'} manual review</p>}
    <div className="overview-groups">
      {ruleOrder.map(rule => {
        const findingCount = run.scan.findings.filter(item => item.ruleId === rule).length;
        const reviewCount = run.scan.scannerReviewObservations.filter(item => item.ruleId === rule).length;
        const headingId = `${rule}-overview-heading`;
        return <div aria-labelledby={headingId} className="overview-group" key={rule} role="group">
          <h4 id={headingId}>{ruleDisplayName(rule)}</h4>
          <p>{countText(findingCount, 'finding')} · {countText(reviewCount, 'manual review', 'manual reviews')}</p>
        </div>;
      })}
    </div>
    {findings === 0 && <p className="zero-limitation">This does not prove that the page is accessible or compliant.</p>}
  </section>;
}
