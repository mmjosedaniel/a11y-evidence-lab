# ADR-0009: axe-core as the initial accessibility scanner

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs a deterministic accessibility scanning engine that produces inspectable source results and rule identifiers for selected controlled-fixture scenarios. The engine must remain separate from browser automation and model interpretation, and its automated findings must never be presented as accessibility certification or complete conformance coverage.

axe-core is designed for automated web UI accessibility testing and integrates with Playwright through `@axe-core/playwright`. Playwright's official accessibility-testing guidance also states that automated tests detect only some common accessibility problems and should be combined with manual assessment and inclusive user testing.

### MVP evidence and fixture amendment recorded 2026-08-25

OD-003, OD-006, OD-009, and OD-019 narrow the original evaluation design. The native axe payload remains transient in Step 1 and is runtime-validated before handoff; Step 2 alone persists the minimized, allowlisted rule-specific source evidence and scanner provenance required for the selected scenario. The MVP does not persist a full sanitized native axe result.

The fixed physical evidence surface is exactly the three accepted scenario profiles with one failing and one corrected logical revision each. The original 2026-08-23 decision named positive, negative, corrected, regressed, ambiguous, and manual-only fixture cases for every selected scenario. That broader fixture requirement is superseded for the MVP: expected fail/pass observations use the six frozen revisions, existing revisions may be paired to exercise deterministic comparison transitions, and shared bounded record/manual checks cover abstention, ambiguity, and contextual judgment without requiring extra fixture variants. Formal release promotion remains Deferred under OD-017.

### Authorized public-page amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) accepts an additional public-page input and replaces the one-selected-rule/one-retained-violation assumption for that path. One public `PageAnalysisRun` executes exactly `image-alt`, `label`, and `color-contrast` against the same stabilized page state as one atomic scan, validates coverage for all three, and lists every in-bounds violation node. The user selects one normalized finding only after that deterministic enumeration. The three controlled profiles and six revisions remain fixed inputs for the separate controlled evaluation path; they do not enter the user-submitted runtime URL path.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017's hostile-network and numeric-bound requirements without changing scanner cardinality. One trusted-page scan still validates the exact three-rule result and lists every returned violation node as an independent Finding. A timeout, browser or scanner failure, malformed or truncated result, or missing rule coverage remains visible and cannot be presented as a complete scan or a valid zero-finding result.

## Considered options

1. Use axe-core.
2. Use another automated accessibility engine.
3. Combine multiple engines in the initial baseline.
4. Rely on manual assessment without a deterministic scanner.

## Decision

Use a pinned axe-core version, initially through `@axe-core/playwright`, as the deterministic accessibility scanning engine for evaluation only.

- Pin and record the axe-core and integration versions, exact rule set, tags, options, page-state inputs, coverage contract, and browser configuration. The public-page rule set is closed to `image-alt`, `label`, and `color-contrast`.
- Keep the native axe result transient and distinguish it from normalized findings and model-generated interpretation. Step 2 persists only minimized, allowlisted rule-specific source evidence plus exact scanner provenance.
- Runtime-validate the axe result payload before Step 1 hands it to Step 2; TypeScript or integration-package types are not evidence validation. Step 2 alone applies evidence policy and creates canonical domain records.
- For a complete trusted-page scan, create one minimized `Finding` record for every validated violation node returned by the three rules. Do not sample, silently deduplicate distinct nodes, collapse them into a page-level issue, or automatically start downstream work. Retain every allowed native axe `incomplete` node separately as a minimized `ScannerReviewObservation`; it is not a violation, scan failure, evidence-sufficiency state, or proposal-eligible finding. Exclude unrelated passes and inapplicable results from general durable collections while retaining the narrow positive and coverage facts needed for comparison and proof that all three rules completed.
- Keep the synthetic fixture expectations narrow: validate each profile's mapped rule and rule-specific evidence against its frozen failing and corrected revisions, and use those fixtures to exercise the same normalization, coverage, abstention, provider, review, and comparison boundaries without claiming broad page coverage.
- Record exact per-rule coverage and a full collection disposition independently of the violation and `ScannerReviewObservation` counts. A navigation timeout, browser/scanner failure, malformed or truncated result, or missing rule coverage cannot become a complete result. Zero Findings is valid only after all three trusted-page rules and both collections validate.
- Treat rule-description, impact, target, node, and failure-summary fields as scanner output with recorded version provenance, not immutable project semantics.
- Never translate an empty result set, complete scan, or incomplete scan into an accessibility or conformance claim; manual and assistive-technology checks remain separate evidence.

Promoting axe-core to the release stack remains Deferred. The MVP records only the frozen expected rule observations, rule mapping, minimized-evidence behavior, manual-review boundary, and prohibited-claim checks from the six logical revisions and compact shared checks. Formal repeated-run evidence is Deferred, and these observations do not establish release qualification.

## Consequences

- Findings begin with a widely used rule engine and stable rule identifiers that can be evaluated on controlled fixtures.
- axe-core rule or integration updates can change output and require versioned mappings and regression runs.
- The scanner intentionally covers only a subset of accessibility barriers, so the manual-check workflow remains essential.
- A public page can yield a variable number of finding records, but scanner cardinality does not authorize bulk retrieval, generation, or review.
- Native axe `incomplete` observations, incomplete scan coverage, and a valid complete zero-violation result remain visibly distinct.
- The browser driver or scanner can be replaced independently through their separate boundaries.

## Primary references

- [axe-core repository](https://github.com/dequelabs/axe-core)
- [axe-core API documentation](https://www.deque.com/axe/core-documentation/api-documentation/)
- [axe-core 4.13 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)
- [Playwright accessibility-testing guidance](https://playwright.dev/docs/accessibility-testing)

## Related decisions and requirements

- [Authorized deterministic web scan candidate assessments](../candidates/authorized-scan/README.md) — Proposed selection, scanner-profile, and evidence detail; it does not change this ADR's evaluation-only scope.
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-SCAN-*` and `REQ-EVID-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
