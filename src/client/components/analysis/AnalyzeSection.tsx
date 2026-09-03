import type { ReactElement } from 'react';
import { AnalyzeForm } from './AnalyzeForm.tsx';
import type { AnalysisConfiguration, AnalysisError, AnalyzeIntent } from './analysisTypes.ts';

interface AnalyzeSectionProps {
  readonly available: boolean;
  readonly busy: boolean;
  readonly capability: string;
  readonly configuration?: AnalysisConfiguration;
  readonly error: AnalysisError | null;
  readonly announcement: string;
  readonly onOperationReserved: () => boolean;
  readonly onAnalyze: (intent: AnalyzeIntent) => void;
  readonly onAnnounce: (message: string) => void;
}

export function AnalyzeSection(props: AnalyzeSectionProps): ReactElement {
  return <section aria-labelledby="setup-heading" className="setup">
    <h1 id="setup-heading">Analyze a page</h1>
    {props.capability && <p id="capability" className="notice">{props.capability}</p>}
    <AnalyzeForm available={props.available} busy={props.busy} configuration={props.configuration}
      error={props.error} onOperationReserved={props.onOperationReserved}
      onAnalyze={props.onAnalyze} onAnnounce={props.onAnnounce} />
    <p role="status" aria-atomic="true" className="status">{props.announcement}</p>
  </section>;
}
