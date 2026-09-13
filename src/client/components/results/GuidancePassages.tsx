import { useId } from 'react';
import type { ReactElement } from 'react';
import type { FindingGuidanceView } from '../../../server/domain/finding-analysis-types.ts';
import type { RetrievalSelectionPolicy } from '../../../server/retrieval/retrieval-contract.ts';

export function GuidancePassages({ view, selectionPolicy }: {
  readonly view: FindingGuidanceView;
  readonly selectionPolicy?: RetrievalSelectionPolicy;
}): ReactElement {
  const id = useId();
  return <div className="guidance-passages">
    <h4>Retrieved guidance</h4>
    {view.corpus && <>
      <p>WCAG 2.2 guidance</p>
      <dl className="evidence-facts">
        <div><dt>Corpus version</dt><dd>{view.corpus.version}</dd></div>
      </dl>
    </>}
    {!view.corpus ? <p>Guidance was not retrieved.</p> : view.passages.length === 0
      ? <p>No applicable guidance was retrieved.</p> : <>
        <p>{selectionPolicy === 'highest-per-required-role-v1'
          ? 'The highest-ranked passage for each required guidance role is shown.'
          : 'Up to three highest-ranked passages are shown.'}</p>
        <p>Similarity describes retrieval ranking, not guidance support or confidence.</p>
        <ol className="passage-list">
          {view.passages.map(passage => <li key={passage.passageId} aria-describedby={`${id}-${passage.noticeKind}`}>
            <h5>{passage.heading}</h5>
            <p><a href={passage.url} target="_blank" rel="noopener noreferrer">{passage.sourceTitle} (opens in a new tab)</a></p>
            <dl className="evidence-facts">
              <div><dt>Passage</dt><dd>{passage.passageId}</dd></div>
              <div><dt>Corpus version</dt><dd>{passage.corpusVersion}</dd></div>
              <div><dt>Rule / criterion</dt><dd>{passage.ruleId} / {passage.successCriterion}</dd></div>
              <div><dt>Guidance role</dt><dd>{passage.guidanceRole}</dd></div>
              <div><dt>Source type</dt><dd>{passage.sourceType}</dd></div>
              <div><dt>Source status</dt><dd>{passage.sourceStatus}</dd></div>
              <div><dt>Similarity</dt><dd>{passage.score}</dd></div>
            </dl>
            <p className="passage-text">{passage.text}</p>
            <p>{passage.copyright}</p>
            <p>{passage.attribution}</p>
            <p>Applicable notice: {passage.noticeKind === 'document' ? 'W3C document notice' : 'W3C software and document notice'} below.</p>
          </li>)}
        </ol>
      </>}
    {view.notices.length > 0 && <div className="source-notices">
      <h5>Source notices</h5>
      {view.notices.map(notice => <details key={notice.kind} open>
        <summary id={`${id}-${notice.kind}`}>{notice.kind === 'document' ? 'W3C document notice' : 'W3C software and document notice'}</summary>
        <p className="source-notice-text">{notice.text}</p>
      </details>)}
    </div>}
  </div>;
}
