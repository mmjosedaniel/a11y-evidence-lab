import type { ReactElement } from 'react';
import type { Proposal } from '../../../server/generation/proposal-contract.ts';
import type { EvidencePath } from '../../../server/domain/finding-analysis-types.ts';
import { claimFields, proseFields } from '../../review/review-form-validation.ts';
import type { ReviewErrors } from '../../review/review-form-validation.ts';

export function ProposalEditor({ id, proposal, assumptions, evidence, passages, frozen, errors, onChange }: {
  readonly id: string;
  readonly proposal: Proposal;
  readonly assumptions: readonly string[];
  readonly evidence: readonly EvidencePath[];
  readonly passages: readonly string[];
  readonly frozen: boolean;
  readonly errors: ReviewErrors;
  readonly onChange: (proposal: Proposal, assumptions: readonly string[]) => void;
}): ReactElement {
  const errorId = (key: string): string => `${id}-${key}-error`;
  const attributes = (key: string) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] || errors.editor ? true as const : undefined,
    'aria-describedby': [errors[key] ? errorId(key) : '', errors.editor ? errorId('editor') : ''].filter(Boolean).join(' ') || undefined,
  });
  const error = (key: string): ReactElement | null => errors[key]
    ? <p className="error" id={errorId(key)}>{errors[key]}</p> : null;
  const change = (next: Proposal, nextAssumptions = assumptions): void => { if (!frozen) onChange(next, nextAssumptions); };
  function references(key: typeof claimFields[number][0], label: string,
    kind: 'evidenceReferences' | 'passageIds'): ReactElement {
    const options = kind === 'evidenceReferences' ? evidence : passages;
    const name = `${key}-${kind}`;
    const values: readonly string[] = proposal[key][kind];
    return <fieldset className="review-reference-options">
      <legend>{label} {kind === 'evidenceReferences' ? 'evidence references' : 'retrieved guidance references'}</legend>
      {options.map((value, index) => <label key={value}>
        <input type="checkbox" value={value} checked={values.includes(value)}
          {...attributes(name)} id={`${id}-${name}-${index}`} aria-disabled={frozen}
          onChange={event => {
            if (frozen) return;
            const selected = event.currentTarget.checked ? [...values, value] : values.filter(item => item !== value);
            const claim = kind === 'evidenceReferences'
              ? { ...proposal[key], evidenceReferences: selected as EvidencePath[] }
              : { ...proposal[key], passageIds: selected };
            change({ ...proposal, [key]: claim });
          }} />
        <span>{value}</span>
      </label>)}
      {error(name)}
    </fieldset>;
  }
  return <fieldset className="proposal-editor" id={`${id}-editor`} tabIndex={-1}
    aria-describedby={errors.editor ? errorId('editor') : undefined}>
    <legend>Reviewer-authored proposal</legend>
    {error('editor')}
    <dl className="evidence-facts">
      <div><dt>Output type</dt><dd>{proposal.type}</dd></div>
      <div><dt>Selected Finding reference</dt><dd>{proposal.findingId}</dd></div>
      <div><dt>Finding evidence</dt><dd>{proposal.evidenceSufficiency.findingEvidence}</dd></div>
      <div><dt>Retrieved guidance</dt><dd>{proposal.evidenceSufficiency.guidance}</dd></div>
    </dl>
    {claimFields.map(([key, label, maximum]) => <div key={key} className="review-field">
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <textarea {...attributes(key)} value={proposal[key].text} maxLength={maximum} readOnly={frozen}
        onChange={event => change({ ...proposal, [key]: { ...proposal[key], text: event.currentTarget.value } })} />
      {error(key)}
      {references(key, label, 'evidenceReferences')}
      {references(key, label, 'passageIds')}
    </div>)}
    <div className="review-field">
      <label htmlFor={`${id}-confidence`}>Confidence</label>
      <select id={`${id}-confidence`} value={proposal.confidence} aria-disabled={frozen}
        aria-describedby={errors.editor ? errorId('editor') : undefined}
        aria-invalid={errors.editor ? true : undefined}
        onChange={event => change({ ...proposal, confidence: event.currentTarget.value as Proposal['confidence'] })}>
        <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
      </select>
    </div>
    {proseFields.map(([key, label]) => <div key={key} className="review-field">
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <textarea {...attributes(key)} value={proposal[key]} maxLength={1000} readOnly={frozen}
        onChange={event => change({ ...proposal, [key]: event.currentTarget.value })} />
      {error(key)}
    </div>)}
    {assumptions.map((value, index) => <div key={index} className="review-field">
      <label htmlFor={`${id}-assumption-${index}`}>Assumption {index + 1}</label>
      <textarea {...attributes(`assumption-${index}`)} value={value} maxLength={500} readOnly={frozen}
        onChange={event => change(proposal, assumptions.map((item, position) => position === index ? event.currentTarget.value : item))} />
      {error(`assumption-${index}`)}
    </div>)}
  </fieldset>;
}
