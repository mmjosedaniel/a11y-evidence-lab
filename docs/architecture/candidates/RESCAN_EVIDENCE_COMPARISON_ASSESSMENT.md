# Rescan evidence comparison assessment

## Authority, status, and scope

**Status:** Proposed architecture assessment as of 2026-08-24, aligned on 2026-08-27 with the trusted operator-input portfolio boundary accepted in [ADR-0018](../decisions/ADR-0018-trusted-operator-url-boundary.md) and [OD-021](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp). It owns no requirement IDs or statuses, accepts no public-page correlation algorithm, promotes no evaluation technology to release adoption, and does not authorize development.

The authoritative requirements remain in [Evidence and review workflow requirements — Rescan and comparison](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison). `REQ-COMP-007`, `REQ-COMP-008`, and the exact public-page correlation descriptor remain Proposed. Controlled fixtures remain the accepted deterministic evaluation baseline and do not enter the user-submitted runtime URL path.

## Recommended minimal approach

Use ordinary deterministic application logic to compare one complete baseline `PageAnalysisRun` with one complete later `PageAnalysisRun` for the same trusted operator-supplied public page. Do not use an LLM, LangChain, embeddings, a DOM-diff library, or a second scanner. The later run repeats the accepted atomic scan of the main document with exactly `image-alt`, `label`, and `color-contrast`, lists every retained violation-node `Finding`, and keeps native axe `incomplete` `ScannerReviewObservation` records separate.

Runtime comparison remains one selected `FindingWorkflow` at a time. The user selects one baseline `Finding`; the service then evaluates only that finding's target lineage against the later scan. It does not automatically compare, retrieve for, generate for, or review the complete findings collection, and it produces no page-level score or combined remediation result. Sibling and later-only findings remain visible in the later run without changing the selected comparison. A predeclared positive-baseline lineage may still be exercised by the controlled evaluation manifest to verify `regressed` record semantics; it is not a second runtime selection path.

This is sufficient for the MVP because it demonstrates the final evidence-first step while preserving the public-page result list, sequential downstream work, and conservative uncertainty boundary. The controlled failing/corrected profiles continue to provide reproducible `resolved`, `persistent`, `regressed`, `inconclusive`, and contrast-only `improved` evaluation cases without being mistaken for runtime page identity.

## Minimum comparable scan pair

Both scans must be complete scans under ADR-0018. A material mismatch makes the pair `not comparable` and produces no finding outcome. The proposed minimum equality gate is:

| Dimension | Minimum comparison rule |
| --- | --- |
| Page identity | The normalized requested page identity and observed final page identity match under the same versioned normalization policy. A materially different final destination is not the same page for comparison. |
| Target scope | Both runs concern the same operator-authorized public HTTPS page under the trusted-input limitation. The operator, rather than an application network-security boundary or required notice confirmation, is responsible for choosing a suitable target. Neither run uses authentication, imported browser state, crawling, interaction scripts, or another page. |
| Document and page state | Both analyze the top-level main document under the same versioned readiness definition. Iframe-document scanning remains Deferred. A material readiness or document-scope change is not comparable. |
| Scan profile | The exact three-rule profile, per-rule coverage, scanner and wrapper versions, browser engine/version, viewport, locale, and material browser settings match. |
| Evidence semantics | Evidence allowlist, sanitizer, correlation-descriptor, and positive-observation profile versions match. |
| Measurement profile | For contrast, font classification, expected-threshold semantics, emitted-value normalization, and other measurement inputs match. |

Exact URL normalization, materiality rules, page-readiness checks, and correlation fields remain Proposed implementation detail to define during implementation planning; this assessment does not silently elevate them to Accepted policy or require a production hostile-network qualification matrix.

## Selected-target correlation

After pair comparability passes, correlate the selected target using:

1. the exact supported axe rule;
2. one versioned, minimized target-correlation descriptor retained by evidence capture; and
3. a unique exact match in the applicable baseline and later records.

The descriptor may contain only the rule-specific, privacy-safe locator and semantic facts approved by the evidence policy. It is a correlation aid, not a permanent cross-page element identity. Collection order, display index, opaque within-run finding ID, raw HTML, arbitrary page text, screenshots, full DOM or accessibility-tree snapshots, and model-generated descriptions are not correlation identity.

Do not use fuzzy selectors, weighted fingerprints, embeddings, AI matching, or “nearest” candidates. A missing target, changed descriptor, duplicate candidate, unavailable locator, conflicting evidence, native `incomplete` result, or uncertain match yields `inconclusive`; it is never forced into `resolved` or `regressed`.

### Required positive observation

Disappearance from the later violation list is insufficient for `resolved`. The later scan must have complete coverage for the exact rule and retain one narrow, target-specific native non-failing observation showing that the uniquely correlated target was exercised. Target removal, a failed locator, missing pass evidence, collection truncation, or a changed page structure therefore yields `inconclusive` rather than resolution.

Positive observations are retained only for an identified comparison target. The product does not persist the scanner's entire pass or inapplicable collection.

## Independent outcome definitions

Pair comparability and finding outcome are separate dimensions:

| Result | Minimum deterministic evidence |
| --- | --- |
| `resolved` | The comparable baseline has the selected-rule violation, the later scan has complete relevant coverage, and a unique exact same-target native non-failing observation is retained. This means only that the selected automated finding was not reproduced under the recorded conditions. |
| `persistent` | Both comparable scans have a uniquely correlated violation for the same rule and target. For `image-alt` and `label`, a changed still-failing attribute or name remains `persistent`; no ordered improvement measure is defined. |
| `improved` | `color-contrast` only: both comparable scans remain determinate violations and the later contrast margin is strictly higher under identical measurement semantics. The finding remains unresolved. |
| `regressed` | A uniquely correlated native non-failing baseline becomes a violation, or, for two determinate `color-contrast` violations, the later contrast margin is strictly lower. This does not prove that a reviewed change caused the result. |
| `inconclusive` | Pair comparability passed, but exact unique target correlation, required evidence, positive observation, or a determinate native result is missing, changed, ambiguous, or conflicting. |
| `not comparable` | The scans are valid individually but fail a material pair-level identity or configuration gate. It has no child finding outcome. |

A later-only unmatched finding remains visible in the later run. It is not a regression of the selected baseline finding and receives no `new` comparison outcome in the MVP; `new` remains Deferred until explicitly accepted.

### Ordered contrast measure

For `color-contrast`, preserve the scanner-emitted foreground color, background color, `contrastRatio`, `expectedContrastRatio`, font size, font weight, native bucket, and applicable check identity. Define only this comparison measure:

`contrast margin = retained measured contrast ratio - normalized expected contrast ratio`

A higher margin is directionally better. The native axe result bucket remains authoritative for failing versus non-failing status; the application must not recalculate colors, round a displayed ratio into a pass, or treat the margin as a WCAG score, confidence, or conformance measure. Compare margins only when the rule, target descriptor, scanner/browser profile, font classification, expected threshold, and normalization version are identical and both values are determinate.

Two violations with a higher, equal, or lower later margin are `improved`, `persistent`, or `regressed`, respectively. A native baseline violation followed by the required native non-failing observation is `resolved`, regardless of a separately displayed rounded value.

## Deterministic sequence

1. Resolve the complete baseline and later page-scan records and validate their exact source references.
2. Apply the pair-level page, target-scope, main-document, scan-profile, coverage, evidence, and measurement gates.
3. If a material gate differs, complete the assessment as `not comparable` with bounded reasons and no finding outcome.
4. Resolve the one selected baseline `FindingWorkflow` and seek one exact same-rule, same-descriptor match in the later evidence. A controlled record-level regression check may instead use its frozen positive-baseline lineage.
5. Apply the rule-specific outcome table. Preserve native `incomplete` and missing evidence as uncertainty rather than treating them as non-failing.
6. Record one comparison entry, evidence deltas, limitations, and follow-up manual checks. Leave every sibling workflow unchanged.

Repeating this transformation with the same immutable records and comparison-profile version must produce the same result. A provider is never invoked by comparison.

## Manual checks and reviewer context

An accepted or edited remediation plan may explain why a later scan was requested, but proposal text, citations, either run's immutable global provider mode, per-call provider provenance, model confidence, review decision, and manual-check result do not enter page comparability, target correlation, or automated outcome calculation. They remain linked context only; comparison invokes no provider and cannot change either run's mode.

After the later scan, a new manual-check result may reference the original immutable check definition, selected proposal version, later scan, target descriptor, and comparison. It records its own execution status, observed outcome, relationship, reviewer, timestamp, and bounded evidence or note. It begins `pending`; neither `resolved` nor `improved` marks it complete.

The manual judgment remains profile-specific:

- `image-alt`: whether the implemented alternative is appropriate for the image's purpose and context;
- `label`: whether the label accurately communicates the control's purpose and has an appropriate programmatic association; and
- `color-contrast`: whether the retained measurement applies to the intended text/state and whether an exception or untested visual state limits the conclusion.

A completed manual check may support, contradict, or remain inconclusive about the reviewed proposal without rewriting the deterministic comparison.

## Conceptual comparison record

One selected-finding **Comparison** record contains:

| Part | Minimum conceptual information |
| --- | --- |
| Identity | Comparison ID, selected `FindingWorkflow` and baseline `Finding`, comparison-profile version, start/completion time, and operation status. A controlled regression check may reference its frozen positive-baseline lineage instead. |
| Scan pair | Baseline and later run/scan IDs; normalized requested and observed final page identities; trusted-input limitation-notice version when retained; main-document/readiness, exact rule-profile, coverage, browser, viewport, locale, scanner, evidence, sanitizer, correlation, and measurement identities. Notice display or confirmation is not a comparability gate. |
| Comparability | Each material gate's baseline/later identity, disposition and bounded reason; overall `comparable` or `not comparable`. |
| Correlation | Exact rule, baseline and later minimized descriptor references, unique-match result, and explicit ambiguity or missing-evidence reasons. |
| Evidence comparison | Baseline/later finding or positive-observation references, rule-specific before/after values, minimized delta, and native categories. |
| Result | One of the supported finding outcomes when comparable; no child outcome when `not comparable`; explicit limitations and required follow-up checks. |
| Contrast detail | When applicable, retained emitted colors, ratios, font inputs, normalized expected values, margins and delta, with confirmation that equality gates passed. |
| Human context | Optional proposal, review-action, manual-check definition and later-result references, labeled as non-determinative context. |

Later-only unmatched findings are referenced through the later page-scan result list, not converted into children of this comparison record. Prefer references over duplicating page content; if source records are deleted, expose broken lineage rather than retaining a hidden copy.

## Privacy and public-demo boundary

Before-and-after public-page evidence can reveal page content and changes even when either scan appears harmless alone. Retain only the normalized/final page identity required by the accepted run boundary, versioned configuration identities, minimized rule-specific evidence, exact privacy-safe descriptor, outcome rationale, and bounded reviewer notes. Do not persist screenshots, full HTML, DOM or accessibility-tree snapshots, browser/network traces, credentials, form values, hidden content, arbitrary page text, or raw provider payloads.

Public demonstrations should default to the project-owned controlled evaluation cases. Demonstrating an authorized public page requires an explicit safe content choice and a separate allowlist/redaction review; authorization to scan does not imply permission to publish retained evidence or review history.

## Meaningful alternatives

| Alternative | Benefit | Why it is not the MVP recommendation |
| --- | --- | --- |
| Treat absence from the later violation list as resolution | Retains less positive evidence. | It can mistake target removal, changed structure, missing coverage, or scanner failure for a fix. |
| Fuzzy matching or full DOM/accessibility-tree diff | May correlate targets after broad page changes. | It adds false-match risk, private content, thresholds, storage, and complexity. Conservative `inconclusive` is safer for the portfolio MVP. |

## Assumptions and open questions

### Assumptions

- Both scans independently satisfy ADR-0018, analyze the same trusted operator-supplied public HTTPS page's main document, and retain complete three-rule coverage.
- Page changes occur outside the product; no comparison claims that the product applied or caused them.
- Controlled fixture target keys remain the deterministic evaluation baseline and do not become runtime public-page identity.
- The later scan may contain any number of validated findings from the exact three supported rules; only the selected baseline `FindingWorkflow` is compared at runtime.

### Open questions

- Which privacy-safe locator and rule-specific semantic fields form the exact versioned public-page correlation descriptor?
- Which page-readiness, normalized/final-identity, and configuration changes are material enough to make a pair `not comparable`?
- How should the UI request the targeted positive observation without retaining unrelated native passes?
- Which controlled and trusted public-page pairs are sufficient to exercise descriptor ambiguity, target removal, and dynamic restructuring before implementation is authorized?

## Risks

- A dynamic page may present a different structure or state despite matching URL and configuration; exact correlation can still be inconclusive.
- A minimized descriptor may be too weak and collide or too content-rich and disclose private context.
- A missing violation can be overstated as a fix if complete coverage and the positive observation are bypassed.
- A structurally acceptable label or alternative can remain contextually poor; automated comparison cannot replace the manual check.
- Scanner-emitted contrast ratios can be misread as a second conformance calculation or rounded into a pass.
- Before-and-after public-page evidence or review notes may be published without the page owner's permission.

## Explicit non-goals

- Multi-page comparison, crawling, authentication, iframe-document scanning, scheduled monitoring, CI integration, alerts, dashboards, trends, release tracking, or long-term analytics.
- Automatic comparison-to-generation loops, collection-wide processing, combined page remediation, bulk review, provider calls, agents, queues, workers, or workflow engines.
- A `new` outcome, automatic processing of later-only findings, page-level scores, aggregate improvement claims, broad WCAG coverage, conformance, certification, or causal proof.
- Fuzzy or AI element matching, generalized fingerprints, DOM/accessibility-tree diffs, screenshots, visual comparison, or cross-version translation.
- Automatic code modification, remediation application, deployment verification, or treating reviewer decisions as automated ground truth.
- A database, event store, hosted service, backup, export service, telemetry, or production-scale persistence.

## Acceptance criteria for this planning definition

This step is adequately defined when:

1. comparison accepts only two complete scans of the same normalized requested and observed final public page under materially identical target scope, main-document, readiness, three-rule, coverage, browser, scanner, evidence, and measurement profiles;
2. one selected baseline `FindingWorkflow` is compared independently at runtime, while all sibling and later-only findings remain visible and unchanged; any positive-baseline regression check stays confined to the controlled evaluation manifest;
3. exact same-rule, unique privacy-safe descriptor matching is required, with missing, changed, duplicate, or ambiguous correlation classified `inconclusive`;
4. `resolved` requires complete later coverage plus a unique same-target positive observation and never follows from absence alone;
5. binary and contrast outcomes follow the deterministic rules above, with `improved` limited to two still-failing contrast observations and clearly labeled unresolved;
6. pair-level `not comparable`, child `inconclusive`, native `incomplete`, and workflow failure remain distinct;
7. later-only findings are visible but are not labeled `regressed` or `new`;
8. reviewer decisions and manual checks remain linked, separately labeled context and do not alter the automated outcome;
9. retained before/after evidence is rule-specific and minimized, and a public demo does not infer publication permission from scan authorization; and
10. the result explicitly disclaims whole-page accessibility, full WCAG conformance or non-conformance, certification, legal compliance, remediation causality, and code modification.

## Primary sources

The exact axe release remains an evaluation pin rather than a release dependency; records must retain the version actually used.

- [axe-core 4.13.0 API and result categories](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 `image-alt` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json)
- [axe-core 4.13.0 `label` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json)
- [axe-core 4.13.0 `color-contrast` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json)
- [axe-core 4.13.0 contrast evidence fields](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [WCAG 2.2 SC 1.1.1: Non-text Content](https://www.w3.org/TR/WCAG22/#non-text-content)
- [WCAG 2.2 SC 4.1.2: Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [WCAG 2.2 SC 1.4.3: Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## Documentation navigation

- Previous workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Accessibility finding and evidence-capture assessment](ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [ADR-0018: Trusted operator URL boundary](../decisions/ADR-0018-trusted-operator-url-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Information and workflow lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
