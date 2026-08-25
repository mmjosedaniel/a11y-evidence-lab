# ADR-0009: axe-core as the initial accessibility scanner

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs a deterministic accessibility scanning engine that produces inspectable source results and rule identifiers for selected controlled-fixture scenarios. The engine must remain separate from browser automation and model interpretation, and its automated findings must never be presented as accessibility certification or complete conformance coverage.

axe-core is designed for automated web UI accessibility testing and integrates with Playwright through `@axe-core/playwright`. Playwright's official accessibility-testing guidance also states that automated tests detect only some common accessibility problems and should be combined with manual assessment and inclusive user testing.

### MVP evidence and fixture amendment recorded 2026-08-25

OD-003, OD-006, OD-009, and OD-019 narrow the original evaluation design. The native axe payload remains transient in Step 1 and is runtime-validated before handoff; Step 2 alone persists the minimized, allowlisted rule-specific source evidence and scanner provenance required for the selected scenario. The MVP does not persist a full sanitized native axe result.

The fixed physical evidence surface is exactly the three accepted scenario profiles with one failing and one corrected logical revision each. The original 2026-08-23 decision named positive, negative, corrected, regressed, ambiguous, and manual-only fixture cases for every selected scenario. That broader fixture requirement is superseded for the MVP: expected fail/pass observations use the six frozen revisions, existing revisions may be paired to exercise deterministic comparison transitions, and shared bounded record/manual checks cover abstention, ambiguity, and contextual judgment without requiring extra fixture variants. Formal release promotion remains Deferred under OD-017.

## Considered options

1. Use axe-core.
2. Use another automated accessibility engine.
3. Combine multiple engines in the initial baseline.
4. Rely on manual assessment without a deterministic scanner.

## Decision

Use a pinned axe-core version, initially through `@axe-core/playwright`, as the deterministic accessibility scanning engine for evaluation only.

- Pin and record the axe-core and integration versions, selected rules, tags, options, page-state inputs, and browser configuration.
- Keep the native axe result transient and distinguish it from normalized findings and model-generated interpretation. Step 2 persists only minimized, allowlisted rule-specific source evidence plus exact scanner provenance.
- Runtime-validate the axe result payload before Step 1 hands it to Step 2; TypeScript or integration-package types are not evidence validation. Step 2 alone applies evidence policy and creates canonical domain records.
- Retain the one selected violation and results requiring manual review, plus only the narrow corrected-state positive target observation required for comparison. Exclude unrelated passes and inapplicable results from durable MVP records.
- Validate each selected scenario's exact rule mapping and evidence fields against its one frozen failing and one frozen corrected logical revision. Exercise regression, ambiguity, abstention, and manual judgment through permitted pairings and shared deterministic records/checks rather than additional fixture variants.
- Treat rule-description, impact, target, node, and failure-summary fields as scanner output with recorded version provenance, not immutable project semantics.
- Never translate an empty result set into an accessibility or conformance claim; manual and assistive-technology checks remain separate evidence.

Promoting axe-core to the release stack remains Deferred. The MVP records only the frozen expected rule observations, rule mapping, minimized-evidence behavior, manual-review boundary, and prohibited-claim checks from the six logical revisions and compact shared checks. Formal repeated-run evidence is Deferred, and these observations do not establish release qualification.

## Consequences

- Findings begin with a widely used rule engine and stable rule identifiers that can be evaluated on controlled fixtures.
- axe-core rule or integration updates can change output and require versioned mappings and regression runs.
- The scanner intentionally covers only a subset of accessibility barriers, so the manual-check workflow remains essential.
- The browser driver or scanner can be replaced independently through their separate boundaries.

## Primary references

- [axe-core repository](https://github.com/dequelabs/axe-core)
- [Playwright accessibility-testing guidance](https://playwright.dev/docs/accessibility-testing)

## Related decisions and requirements

- [Authorized deterministic web scan candidate assessments](../candidates/authorized-scan/README.md) — Proposed selection, scanner-profile, and evidence detail; it does not change this ADR's evaluation-only scope.
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-SCAN-001`, `REQ-SCAN-002`, `REQ-SCAN-004`, and `REQ-EVID-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-001`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-010`
