import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { Finding } from '../../../server/domain/run-contract.ts';
import { assessFindingEvidence } from '../../../server/domain/finding-sufficiency.ts';
import { initialReviewDraft, validateReviewDraft } from '../../review/review-form-validation.ts';
import type { Judgment, ReviewAction, ReviewDraft, ReviewErrors } from '../../review/review-form-validation.ts';
import type { ReviewPresentation } from '../../review/review-request.ts';
import { reviewRefusalText } from '../../review/review-request.ts';
import { ProposalEditor } from './ProposalEditor.tsx';

export interface ReviewControls {
  readonly busy: boolean;
  readonly presentations: Readonly<Record<string, ReviewPresentation>>;
  readonly isBlocked: () => boolean;
  readonly onSubmit: (findingId: string, label: string, review: unknown) => void;
  readonly attachForm: (findingId: string, element: HTMLFormElement) => () => void;
  readonly onAnnounce: (message: string) => void;
  readonly takeSavedFocus: (findingId: string) => boolean;
}

export function ProposalReviewForm({ finding, label, controls }: {
  readonly finding: Extract<Finding, { state: 'proposal-pending-review' }>;
  readonly label: string;
  readonly controls: ReviewControls;
}): ReactElement {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState(() => initialReviewDraft(finding.result));
  const [errors, setErrors] = useState<ReviewErrors>({});
  const focusError = useRef(false);
  const state = controls.presentations[finding.findingId];
  const frozen = controls.busy;
  const { analysis, retrieval, generation, result, ...native } = finding;
  const context = { finding: { ...native, state: 'unprocessed' as const }, retrieval: retrieval.result };
  const evidence = assessFindingEvidence(context.finding).availableReferences;
  const passages = retrieval.result.passages.map(passage => passage.passageId);
  const errorId = (key: string): string => `${id}-${key}-error`;
  const attributes = (key: string) => ({ id: `${id}-${key}`,
    'aria-invalid': errors[key] ? true as const : undefined,
    'aria-describedby': errors[key] ? errorId(key) : undefined });
  const error = (key: string): ReactElement | null => errors[key]
    ? <p className="error" id={errorId(key)}>{errors[key]}</p> : null;

  useLayoutEffect(() => {
    const element = form.current;
    if (element) return controls.attachForm(finding.findingId, element);
  }, [controls.attachForm, finding.findingId]);

  useLayoutEffect(() => {
    if (!focusError.current) return;
    focusError.current = false;
    if (errors.editor) document.getElementById(`${id}-editor`)?.focus();
    else form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors, id]);

  function change(patch: Partial<ReviewDraft>): void {
    if (controls.isBlocked()) return;
    setDraft(previous => ({ ...previous, ...patch, confirmed: false }));
    setErrors({});
  }
  return <form className="proposal-review" ref={form} aria-label={`Review ${label}`} noValidate
    onSubmit={event => {
      event.preventDefault();
      if (controls.isBlocked()) return;
      const validation = validateReviewDraft(draft, context);
      setErrors(validation.errors);
      if (Object.keys(validation.errors).length > 0) {
        focusError.current = true;
        controls.onAnnounce(`${label}. ${Object.values(validation.errors).join(' ')}`);
        return;
      }
      controls.onSubmit(finding.findingId, label, validation.review);
    }}>
    <h4>Human review</h4>
    <fieldset className="review-actions">
      <legend>Review action</legend>
      {([['approve', 'Approve'], ['edit-and-accept', 'Edit and accept'], ['reject', 'Reject']] as const).map(([value, name]) =>
        <label key={value}><input type="radio" name={`${id}-action`} value={value}
          {...attributes('action')} id={`${id}-action-${value}`} checked={draft.action === value} aria-disabled={frozen}
          onChange={() => change({ action: value as ReviewAction })} />{name}</label>)}
      {error('action')}
    </fieldset>
    {draft.action === 'edit-and-accept' && <ProposalEditor id={id} proposal={draft.proposal}
      assumptions={draft.assumptions} evidence={evidence} passages={passages} errors={errors} frozen={frozen}
      onChange={(proposal, assumptions) => change({ proposal, assumptions })} />}
    <div className="review-field">
      <label htmlFor={`${id}-judgment`}>Blocking judgment</label>
      <select {...attributes('judgment')} value={draft.judgment} aria-disabled={frozen}
        onChange={event => change({ judgment: event.currentTarget.value as Judgment })}>
        <option value="unresolved">Unresolved</option>
        <option value="supports-proposal">Supports proposal</option>
        <option value="not-applicable">Not applicable</option>
        <option value="contradicts-proposal">Contradicts proposal</option>
      </select>
      {error('judgment')}
    </div>
    {draft.judgment === 'not-applicable' && <div className="review-field">
      <label htmlFor={`${id}-reason`}>Not applicable reason</label>
      <textarea {...attributes('reason')} value={draft.reason} maxLength={500} readOnly={frozen}
        onChange={event => change({ reason: event.currentTarget.value })} />
      {error('reason')}
    </div>}
    <div className="review-field">
      <label htmlFor={`${id}-note`}>Reviewer note (optional)</label>
      <textarea {...attributes('note')} value={draft.note} maxLength={1000} readOnly={frozen}
        onChange={event => change({ note: event.currentTarget.value })} />
      {error('note')}
    </div>
    {draft.action && draft.action !== 'reject' && <div className="review-confirmation">
      <label><input type="checkbox" {...attributes('confirmed')} checked={draft.confirmed} aria-disabled={frozen}
        onChange={event => {
          const confirmed = event.currentTarget.checked;
          if (!controls.isBlocked()) setDraft(previous => ({ ...previous, confirmed }));
        }} />
        <span>I confirm the resulting proposal’s material claims against cited guidance, recorded scanner evidence or both.</span>
      </label>
      {error('confirmed')}
    </div>}
    <button className="primary" type="submit" aria-disabled={frozen}>Save decision</button>
    {state?.status === 'pending' && <p>Saving decision…</p>}
    {state?.status === 'unknown' && <div className="review-feedback">
      <p className="error">Save outcome unknown</p>
      <p>The decision may have been saved. Further actions are blocked.</p>
    </div>}
    {state?.status === 'refused' && <div className="review-feedback">
      <p className="error">Decision not saved. {reviewRefusalText(state)}</p>
    </div>}
  </form>;
}
