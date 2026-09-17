import type { ReactElement } from 'react';
import type { Finding, ProviderContext } from '../../../server/domain/run-contract.ts';
import type { FindingGuidanceView } from '../../../server/domain/finding-analysis-types.ts';
import { FindingOutcome } from './FindingOutcome.tsx';
import { GuidancePassages } from './GuidancePassages.tsx';

export type GuidancePresentation = {
  readonly attempted: boolean;
  readonly pending?: boolean;
  readonly view?: FindingGuidanceView;
  readonly error?: string;
  readonly unsaved?: boolean;
  readonly cleanup?: boolean;
};
export interface GuidanceControls {
  readonly available: boolean;
  readonly busy: boolean;
  readonly ownerKnown: boolean;
  readonly presentations: Readonly<Record<string, GuidancePresentation>>;
  readonly onRetrieve: (findingId: string, label: string) => void;
}

export function FindingGuidance({ finding, label, providerContext, controls, generationConsumed = false, readOnly = false }: {
  readonly generationConsumed?: boolean;
  readonly readOnly?: boolean;
  readonly finding: Finding; readonly label: string; readonly providerContext: ProviderContext;
  readonly controls: GuidanceControls;
}): ReactElement {
  const state = controls.presentations[finding.findingId];
  const disabled = !controls.available || controls.busy || controls.ownerKnown ||
    finding.state !== 'unprocessed' || !!state?.attempted;
  return <div className="finding-guidance">
    <h4>Finding guidance</h4>
    {!readOnly && <button type="button" aria-disabled={disabled} onClick={() => {
      if (!disabled) controls.onRetrieve(finding.findingId, label);
    }}>Get guidance</button>}
    {state?.pending && <p>Retrieving guidance…</p>}
    {state?.error && <div className="error">
      <p>Guidance failed: {state.error}.</p>
      {state.unsaved && <p>This guidance attempt was not saved.</p>}
      {state.cleanup && <p>Resource cleanup is uncertain.</p>}
    </div>}
    {!readOnly && !controls.available && <p>Guidance is unavailable in this build.</p>}
    {!readOnly && controls.ownerKnown && !state?.pending && <p>A Finding workflow remains active or resource cleanup is uncertain.</p>}
    {state?.view && <GuidancePassages view={state.view}
      selectionPolicy={'retrieval' in finding && finding.retrieval?.status === 'completed'
        ? finding.retrieval.result.selectionPolicy : undefined} />}
    <FindingOutcome finding={finding} providerContext={providerContext} generationConsumed={generationConsumed || readOnly} />
  </div>;
}
