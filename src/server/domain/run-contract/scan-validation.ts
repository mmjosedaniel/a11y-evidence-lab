import { observedReasons, rules } from './run-policy.ts';
import type { Rule } from './run-policy.ts';
import {
  readArray,
  readBoolean,
  readChoice,
  readFact,
  readInteger,
  readLocale,
  readObject,
  readPattern,
  readTime,
  readUrl,
  requireValid,
} from './contract-value-reader.ts';
import { readFinding, readObservation } from './finding-validation.ts';
import type {
  CompleteScanContext,
  RuleCoverage,
  ScanContext,
  ScanResult,
  ValidationResult,
} from './run-types.ts';

export function readContext(input: unknown): ScanContext {
  const record = readObject(input, ['finalUrl', 'scannedAt', 'browserVersion', 'scannerVersion', 'evidencePolicyVersion', 'rules', 'scope', 'readiness', 'readinessReached', 'viewport', 'locale', 'timeoutMs', 'freshContext', 'importedState', 'interaction', 'crawling', 'iframes', 'cleanup', 'contrastProfile']);
  const scannedAt = readFact(record.scannedAt, readTime, observedReasons);
  const readinessReached = readBoolean(record.readinessReached);
  requireValid(!('value' in scannedAt) || readinessReached);
  const configuredRules = readArray(record.rules, item => readChoice(item, rules));
  requireValid(configuredRules.length === rules.length && configuredRules.every((rule, index) => rule === rules[index]));
  const viewport = readObject(record.viewport, ['width', 'height']);
  return Object.freeze({
    finalUrl: readFact(record.finalUrl, readUrl, observedReasons), scannedAt,
    browserVersion: readFact(record.browserVersion, value => readPattern(value, /^[0-9]+(?:\.[0-9]+){0,3}$/, 64), observedReasons),
    scannerVersion: readChoice(record.scannerVersion, ['4.13.0']),
    evidencePolicyVersion: readChoice(record.evidencePolicyVersion, ['m1-public-v1']),
    rules: Object.freeze([configuredRules[0], configuredRules[1], configuredRules[2]]) as ScanContext['rules'],
    scope: readChoice(record.scope, ['current-rendered-top-level-document']),
    readiness: readChoice(record.readiness, ['domcontentloaded', 'load', 'networkidle']), readinessReached,
    viewport: Object.freeze({ width: readInteger(viewport.width, 1), height: readInteger(viewport.height, 1) }),
    locale: readLocale(record.locale), timeoutMs: readInteger(record.timeoutMs, 1),
    freshContext: readChoice(record.freshContext, [true]), importedState: readChoice(record.importedState, [false]),
    interaction: readChoice(record.interaction, [false]), crawling: readChoice(record.crawling, [false]),
    iframes: readChoice(record.iframes, [false]), cleanup: readChoice(record.cleanup, ['pending', 'closed', 'failed']),
    contrastProfile: readChoice(record.contrastProfile, ['axe-core-4.13.0-default']),
  });
}

export function requireCompleteContext(context: ScanContext): asserts context is CompleteScanContext {
  requireValid('value' in context.finalUrl && 'value' in context.scannedAt && 'value' in context.browserVersion && context.readinessReached && context.cleanup === 'closed');
}

function readRuleCoverage(input: unknown, findingCount: number, observationCount: number): RuleCoverage {
  const record = readObject(input, ['violations', 'incomplete', 'passes', 'inapplicable']);
  const violations = record.violations === null ? null : readInteger(record.violations, 1);
  const incomplete = record.incomplete === null ? null : readInteger(record.incomplete, 1);
  const passes = record.passes === null ? null : readInteger(record.passes, 1);
  const inapplicable = record.inapplicable === null ? null : readInteger(record.inapplicable, 0);
  requireValid(violations !== null || incomplete !== null || passes !== null || inapplicable !== null);
  requireValid(inapplicable !== 0 || (violations === null && incomplete === null && passes === null));
  requireValid((violations ?? 0) === findingCount && (incomplete ?? 0) === observationCount);
  return Object.freeze({ violations, incomplete, passes, inapplicable });
}

export function readScan(input: unknown): ScanResult {
  const record = readObject(input, ['context', 'coverage', 'findings', 'scannerReviewObservations']);
  const context = readContext(record.context);
  requireCompleteContext(context);
  const findings = readArray(record.findings, readFinding);
  const scannerReviewObservations = readArray(record.scannerReviewObservations, readObservation);
  requireValid(new Set(findings.map(finding => finding.findingId)).size === findings.length);
  const coverage = readObject(record.coverage, rules);
  const forRule = (rule: Rule) => readRuleCoverage(coverage[rule],
    findings.filter(finding => finding.ruleId === rule).length,
    scannerReviewObservations.filter(observation => observation.ruleId === rule).length);
  return Object.freeze({
    context, coverage: Object.freeze({ 'image-alt': forRule('image-alt'), label: forRule('label'), 'color-contrast': forRule('color-contrast') }),
    findings, scannerReviewObservations,
  });
}

export function validateScan(input: unknown): ValidationResult<ScanResult> {
  try {
    return Object.freeze({ ok: true, value: readScan(input) });
  } catch {
    return Object.freeze({ ok: false, error: 'invalid-scan' });
  }
}
