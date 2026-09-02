import { useId, useLayoutEffect, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Finding, PageAnalysisRun, ScannerReviewObservation } from '../server/domain/run-contract.ts';

interface RunResultsProps {
  readonly run: PageAnalysisRun;
  readonly selectedId?: string | null;
  readonly selectionRequest?: number;
  readonly onSelect?: (findingId: string) => void;
}
type DisplayFact = { readonly value: string | number | boolean } | { readonly unavailable: string };
type EvidenceItem = Finding | ScannerReviewObservation;

function factText(fact: DisplayFact): string {
  return 'value' in fact ? String(fact.value) : `Unavailable: ${fact.unavailable}`;
}

function conciseTargetFacts(item: EvidenceItem): readonly string[] {
  switch (item.ruleId) {
    case 'image-alt':
      return [factText(item.evidence.elementKind)];
    case 'label':
      return [factText(item.evidence.elementKind), factText(item.evidence.inputType)];
    case 'color-contrast':
      return [factText(item.evidence.foregroundColor), factText(item.evidence.backgroundColor),
        factText(item.evidence.fontSize), factText(item.evidence.fontWeight)];
  }
}

function conciseTargetText(item: EvidenceItem): string {
  return conciseTargetFacts(item).join(' · ');
}

function Field({ label, children }: { readonly label: string; readonly children: ReactNode }): ReactElement {
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}

function FactField({ label, fact }: { readonly label: string; readonly fact: DisplayFact }): ReactElement {
  return <Field label={label}>{factText(fact)}</Field>;
}

function Evidence({ item }: { readonly item: EvidenceItem }): ReactElement {
  return <>
    <dl className="facts">
      <Field label="Rule ID">{item.ruleId}</Field>
      <Field label="Native result">{item.nativeResult}</Field>
      <FactField label="Locator" fact={item.locator} />
      {'incompleteReason' in item && <FactField label="Incomplete reason" fact={item.incompleteReason} />}
    </dl>
    <h5>Checks</h5>
    {'value' in item.checks ? <dl className="facts">
      <Field label="Any">{item.checks.value.any.join(', ') || 'None'}</Field>
      <Field label="All">{item.checks.value.all.join(', ') || 'None'}</Field>
      <Field label="None">{item.checks.value.none.join(', ') || 'None'}</Field>
    </dl> : <p>{factText(item.checks)}</p>}
    <h5>Rule evidence</h5>
    {item.ruleId === 'image-alt' && <dl className="facts">
      <FactField label="Element kind" fact={item.evidence.elementKind} />
      <FactField label="Alt state" fact={item.evidence.altState} />
    </dl>}
    {item.ruleId === 'label' && <>
      <dl className="facts">
        <FactField label="Element kind" fact={item.evidence.elementKind} />
        <FactField label="Input type" fact={item.evidence.inputType} />
      </dl>
      <h5>Name sources</h5>
      <dl className="facts">
        <FactField label="Explicit label" fact={item.evidence.nameSources.explicitLabel} />
        <FactField label="Implicit label" fact={item.evidence.nameSources.implicitLabel} />
        <FactField label="Aria label" fact={item.evidence.nameSources.ariaLabel} />
        <FactField label="Aria labelledby" fact={item.evidence.nameSources.ariaLabelledby} />
        <FactField label="Title" fact={item.evidence.nameSources.title} />
        <FactField label="Placeholder" fact={item.evidence.nameSources.placeholder} />
        <FactField label="Presentational role" fact={item.evidence.nameSources.presentationalRole} />
      </dl>
    </>}
    {item.ruleId === 'color-contrast' && <dl className="facts">
      <FactField label="Foreground color" fact={item.evidence.foregroundColor} />
      <FactField label="Background color" fact={item.evidence.backgroundColor} />
      <FactField label="Shadow color" fact={item.evidence.shadowColor} />
      <FactField label="Contrast ratio" fact={item.evidence.contrastRatio} />
      <FactField label="Expected contrast ratio" fact={item.evidence.expectedContrastRatio} />
      <FactField label="Font size" fact={item.evidence.fontSize} />
      <FactField label="Font weight" fact={item.evidence.fontWeight} />
      <Field label="Measurement source">{item.evidence.measurementSource}</Field>
      <FactField label="Message key" fact={item.evidence.messageKey} />
    </dl>}
  </>;
}

function Coverage({ run, complete }: { readonly run: Extract<PageAnalysisRun, { status: 'completed' }>;
  readonly complete: boolean }): ReactElement {
  const buckets = ['violations', 'incomplete', 'passes', 'inapplicable'] as const;
  return <div className="coverage">
    {run.scan.context.rules.map(rule => {
      const facts = <dl className="facts">
        {buckets.map(bucket => {
          const value = run.scan.coverage[rule][bucket];
          return (complete || value !== null) && <Field key={bucket} label={bucket[0].toUpperCase() + bucket.slice(1)}>
            {value ?? 'Not reported'}
          </Field>;
        })}
      </dl>;
      return <table key={rule}>
        <tbody><tr><th scope="row">{rule}</th><td>{facts}</td></tr></tbody>
      </table>;
    })}
  </div>;
}

function TechnicalRunDetails({ run }: { readonly run: PageAnalysisRun }): ReactElement {
  const context = run.status === 'completed' ? run.scan.context : run.scanContext;
  return <details className="technical-disclosure">
    <summary>Technical run details</summary>
    <div className="disclosure-content">
      <h3>Run context</h3>
      <dl className="facts context-facts">
        <Field label="Run ID">{run.runId}</Field>
        <Field label="Status">{run.status}</Field>
        <Field label="Format version">{run.formatVersion}</Field>
        <Field label="Created at">{run.createdAt}</Field>
        {'finishedAt' in run && <Field label="Finished at">{run.finishedAt}</Field>}
        <Field label="Application revision">{run.applicationRevision}</Field>
        <Field label="Requested URL">{run.requestedUrl}</Field>
        <Field label="Mode">{run.providerContext.mode}</Field>
        <Field label="Provider">{run.providerContext.provider}</Field>
        <Field label="Model">{run.providerContext.model}</Field>
        {run.status === 'failed' && <Field label="Failure category">{run.failure.category}</Field>}
      </dl>
      <p>No provider call was attempted.</p>
      <h3>Scan context</h3>
      <dl className="facts context-facts">
        <FactField label="Final URL" fact={context.finalUrl} />
        <FactField label="Scanned at" fact={context.scannedAt} />
        <FactField label="Browser version" fact={context.browserVersion} />
        <Field label="Scanner version">{context.scannerVersion}</Field>
        <Field label="Evidence policy version">{context.evidencePolicyVersion}</Field>
        <Field label="Rules">{context.rules.join(', ')}</Field>
        <Field label="Scope">{context.scope}</Field>
        <Field label="Readiness">{context.readiness}</Field>
        <Field label="Readiness reached">{String(context.readinessReached)}</Field>
        <Field label="Viewport width">{context.viewport.width}</Field>
        <Field label="Viewport height">{context.viewport.height}</Field>
        <Field label="Locale">{context.locale}</Field>
        <Field label="Timeout ms">{context.timeoutMs}</Field>
        <Field label="Fresh context">{String(context.freshContext)}</Field>
        <Field label="Imported state">{String(context.importedState)}</Field>
        <Field label="Interaction">{String(context.interaction)}</Field>
        <Field label="Crawling">{String(context.crawling)}</Field>
        <Field label="Iframes">{String(context.iframes)}</Field>
        <Field label="Cleanup">{context.cleanup}</Field>
        <Field label="Contrast profile">{context.contrastProfile}</Field>
      </dl>
      {run.status === 'completed' && <>
        <h3>Complete coverage</h3>
        <Coverage run={run} complete />
      </>}
    </div>
  </details>;
}

function RunSummary({ run }: { readonly run: PageAnalysisRun }): ReactElement {
  return <div className="run-summary">
    <dl className="facts summary-facts">
      <Field label={run.status === 'completed' ? 'Analyzed page' : 'Requested page'}>
        {run.status === 'completed' ? run.scan.context.finalUrl.value : run.requestedUrl}
      </Field>
      <Field label="Status">{run.status}</Field>
      <Field label="Mode">{run.providerContext.mode}</Field>
      <Field label="Provider">{run.providerContext.provider}</Field>
      <Field label="Model">{run.providerContext.model}</Field>
    </dl>
    <p>No provider call was attempted.</p>
  </div>;
}

function TechnicalScannerEvidence({ item }: { readonly item: EvidenceItem }): ReactElement {
  return <details className="technical-disclosure scanner-disclosure">
    <summary>Technical scanner evidence</summary>
    <div className="disclosure-content">
      <h4 className="source-label">Scanner evidence</h4>
      <Evidence item={item} />
    </div>
  </details>;
}

export function RunResults({ run, selectedId = null, selectionRequest = 0, onSelect }: RunResultsProps): ReactElement {
  const prefix = useId();
  const detailId = `${prefix}-detail`;
  const detailHeadingId = `${prefix}-detail-heading`;
  const heading = useRef<HTMLHeadingElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const selected = run.status === 'completed' ? run.scan.findings.find(item => item.findingId === selectedId) : undefined;

  useLayoutEffect(() => {
    if (selectedId !== null) heading.current?.focus();
  }, [selectedId, selectionRequest]);

  return <div className="run-evidence">
    <RunSummary run={run} />
    {run.status === 'completed' && <>
      <h3>Summary</h3>
      <p className="result-summary">Completed scan: {run.scan.findings.length} Findings.</p>
      <p>{run.scan.scannerReviewObservations.length} scanner-review observations.</p>
      <Coverage run={run} complete={false} />
      <TechnicalRunDetails run={run} />
      <div className="finding-workspace">
        <section aria-labelledby={`${prefix}-findings`}>
          <h3 id={`${prefix}-findings`}>Findings</h3>
          {run.scan.context.rules.map(rule => <section key={rule} aria-labelledby={`${prefix}-${rule}`}>
            <h4 id={`${prefix}-${rule}`}>{rule}</h4>
            <ul className="finding-list">
              {run.scan.findings.filter(finding => finding.ruleId === rule).map(finding => <li key={finding.findingId}>
                <button type="button" aria-pressed={selectedId === finding.findingId} aria-controls={detailId}
                  aria-label={`${finding.findingId}, ${finding.ruleId}, ${conciseTargetText(finding)}, ${finding.state}`}
                  ref={node => { if (node) buttons.current.set(finding.findingId, node); else buttons.current.delete(finding.findingId); }}
                  onClick={() => onSelect?.(finding.findingId)}>
                  <strong>{finding.findingId}</strong>
                  <span>{finding.ruleId} · {finding.state}</span>
                  <span className="target-summary">Target: {conciseTargetText(finding)}</span>
                </button>
              </li>)}
            </ul>
            {!run.scan.findings.some(finding => finding.ruleId === rule) && <p>No Findings.</p>}
          </section>)}
        </section>
        <section id={detailId} aria-labelledby={selected ? detailHeadingId : `${prefix}-detail-empty`} className="finding-detail">
          {selected ? <>
            <h3 id={detailHeadingId} ref={heading} tabIndex={-1}
              aria-describedby={`${prefix}-detail-state ${prefix}-detail-context ${prefix}-detail-provider-call`}>Finding {selected.findingId}</h3>
            <p id={`${prefix}-detail-state`}><strong>State:</strong> {selected.state}</p>
            <p><strong>Target:</strong> {conciseTargetText(selected)}</p>
            <p id={`${prefix}-detail-context`}>{run.providerContext.mode} · {run.providerContext.provider} · {run.providerContext.model}</p>
            <p id={`${prefix}-detail-provider-call`}>No provider call was attempted.</p>
            <TechnicalScannerEvidence key={selected.findingId} item={selected} />
            <button type="button" onClick={() => buttons.current.get(selected.findingId)?.focus()}>Back to finding</button>
          </> : <h3 id={`${prefix}-detail-empty`}>Finding detail</h3>}
        </section>
      </div>
      <section aria-labelledby={`${prefix}-observations`} className="observations">
        <h3 id={`${prefix}-observations`}>Scanner-review observations</h3>
        {run.scan.scannerReviewObservations.length === 0 && <p>No scanner-review observations.</p>}
        {run.scan.scannerReviewObservations.map((observation, index) => <details key={index}>
          <summary>Scanner-review observation {index + 1} — {observation.ruleId} — incomplete — {conciseTargetText(observation)} — {factText(observation.incompleteReason)}</summary>
          <TechnicalScannerEvidence item={observation} />
        </details>)}
      </section>
    </>}
    {run.status === 'failed' && <TechnicalRunDetails run={run} />}
  </div>;
}
