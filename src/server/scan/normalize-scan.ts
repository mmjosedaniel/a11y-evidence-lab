import crypto from 'node:crypto';
import type { Finding, ScanResult, ScannerReviewObservation } from '../domain/run-contract.ts';
import { nativeBuckets, reporterId, scanRules, scannerVersion } from './scan-profile.ts';
import { projectNativeNode } from './normalization/native-rule-evidence.ts';
import { choice, denseArray, exactKeys, own, record, requireValid } from './normalization/native-value-reader.ts';

type ScanCollection = Pick<ScanResult, 'coverage' | 'findings' | 'scannerReviewObservations'>;
export type NormalizationResult =
  | { readonly ok: true; readonly value: ScanCollection }
  | { readonly ok: false; readonly error: 'scanner' | 'result-validation' | 'coverage-validation' | 'evidence-capture' };
function validateOptions(input: unknown): void {
  const options = record(input);
  exactKeys(options, ['runOnly', 'reporter', 'resultTypes', 'selectors', 'ancestry', 'xpath', 'absolutePaths', 'elementRef', 'iframes']);
  const runOnly = record(own(options, 'runOnly'));
  exactKeys(runOnly, ['type', 'values']);
  requireValid(own(runOnly, 'type') === 'rule' && own(options, 'reporter') === reporterId);
  for (const [source, expected] of [[own(runOnly, 'values'), scanRules], [own(options, 'resultTypes'), nativeBuckets]] as const) {
    const values = denseArray(source);
    requireValid(values.length === expected.length && values.every((value, index) => value === expected[index]));
  }
  for (const key of ['selectors', 'elementRef']) requireValid(own(options, key) === true);
  for (const key of ['ancestry', 'xpath', 'absolutePaths', 'iframes']) requireValid(own(options, key) === false);
}

export function normalizeNativeScan(input: unknown): NormalizationResult {
  let failure: Extract<NormalizationResult, { ok: false }>['error'] = 'result-validation';
  try {
    const root = record(input);
    if (own(root, 'captureFailure') === 'evidence-capture') {
      exactKeys(root, ['captureFailure']);
      return Object.freeze({ ok: false, error: 'evidence-capture' });
    }
    const engine = record(own(root, 'testEngine'));
    requireValid(own(engine, 'name') === 'axe-core' && own(engine, 'version') === scannerVersion);
    validateOptions(own(root, 'toolOptions'));
    // Finish all container inspection before applying native-error/coverage precedence.
    const nativeCollections = nativeBuckets.map(bucket => ({ bucket, entries: denseArray(own(root, bucket)).map(value => {
      const entry = record(value);
      const id = own(entry, 'id');
      requireValid(typeof id === 'string');
      const nodes = denseArray(own(entry, 'nodes')).map(record);
      const error = own(entry, 'error');
      return { id, nodes, hasError: error !== undefined && error !== null };
    }) }));
    if (nativeCollections.some(bucket => bucket.entries.some(entry => entry.hasError))) return Object.freeze({ ok: false, error: 'scanner' });

    failure = 'coverage-validation';
    const emptyCoverage = () => ({ violations: null as number | null, incomplete: null as number | null, passes: null as number | null, inapplicable: null as number | null });
    const coverage = { 'image-alt': emptyCoverage(), label: emptyCoverage(), 'color-contrast': emptyCoverage() };
    const validated = nativeCollections.map(({ bucket, entries }) => ({ bucket, entries: entries.map(entry => {
      const rule = choice(entry.id, scanRules);
      requireValid(coverage[rule][bucket] === null && (bucket === 'inapplicable' || entry.nodes.length > 0));
      coverage[rule][bucket] = entry.nodes.length;
      return { rule, nodes: entry.nodes };
    }) }));
    for (const rule of scanRules) {
      const counts = coverage[rule];
      requireValid(nativeBuckets.some(bucket => counts[bucket] !== null));
      requireValid(counts.inapplicable !== 0 || (counts.violations === null && counts.incomplete === null && counts.passes === null));
      Object.freeze(counts);
    }

    const findings: Finding[] = [];
    const scannerReviewObservations: ScannerReviewObservation[] = [];
    const ids = new Set<string>();
    for (const { bucket, entries } of validated) {
      if (bucket !== 'violations' && bucket !== 'incomplete') continue;
      for (const { rule, nodes } of entries) for (const node of nodes) {
        failure = 'evidence-capture';
        const projected = projectNativeNode(rule, node);
        const { details, locator } = projected;
        if (bucket === 'violations') {
          failure = 'result-validation';
          const findingId = crypto.randomUUID();
          requireValid(typeof findingId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(findingId)?.[0] === findingId && !ids.has(findingId));
          ids.add(findingId);
          findings.push(Object.freeze({ ...details, locator, findingId, nativeResult: 'violation', state: 'unprocessed' }));
        } else if (details.ruleId === 'color-contrast') {
          scannerReviewObservations.push(Object.freeze({ ...details, locator, nativeResult: 'incomplete', incompleteReason: details.evidence.messageKey }));
        } else {
          scannerReviewObservations.push(Object.freeze({ ...details, locator, nativeResult: 'incomplete', incompleteReason: projected.reason }));
        }
      }
    }
    return Object.freeze({ ok: true, value: Object.freeze({ coverage: Object.freeze(coverage), findings: Object.freeze(findings), scannerReviewObservations: Object.freeze(scannerReviewObservations) }) });
  } catch {
    return Object.freeze({ ok: false, error: failure });
  }
}
