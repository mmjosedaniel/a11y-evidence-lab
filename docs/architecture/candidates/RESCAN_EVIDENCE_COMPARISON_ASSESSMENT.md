# Rescan evidence comparison assessment

## Authority, status, and scope

**Status:** Proposed architecture assessment as of 2026-08-24, refined on 2026-08-27 to apply YAGNI to the trusted operator-input portfolio boundary in [ADR-0018](../decisions/ADR-0018-trusted-operator-url-boundary.md), [OD-021](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp), and the exact-locator comparison accepted through OD-022.

The authoritative requirements remain in [Evidence and review workflow requirements — Rescan and comparison](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison). This assessment owns no requirement IDs or statuses and does not authorize development. It elaborates the Accepted exact-locator boundary in `REQ-EVID-010`, `REQ-COMP-007`, and `REQ-COMP-008` without adding a generalized correlation framework.

Controlled fixtures remain the deterministic evaluation baseline. They exercise the same scan and comparison modules as the runtime path, while their gold scenario metadata stays in the evaluation manifest rather than becoming a second product workflow.

## Recommended minimal approach

Use ordinary deterministic application logic to compare one selected baseline Finding with evidence from one later complete scan. Do not use an LLM, LangChain, embeddings, DOM diffing, fuzzy matching, or a generalized element-identity framework.

The minimum public-page comparison requires:

1. the same normalized requested URL and observed final URL;
2. the same exact three-rule scan profile and complete rule coverage;
3. the selected baseline Finding's exact rule;
4. one retained minimized exact locator string; and
5. exactly one later result or narrow positive observation with that same rule and locator.

A URL/profile mismatch is `not comparable`. A missing, changed, or duplicate target match is `inconclusive`. The application never guesses, ranks candidates, or interprets disappearance from the violation list as resolution.

This is sufficient for the portfolio MVP because it demonstrates deterministic before/after evidence without building a general web-page correlation system. The three controlled profiles remain the place where every intended outcome is reproduced under stable, project-owned inputs.

## Minimal scan-pair gate

Both source runs must have completed their exact three-rule scans. The pair-level gate is intentionally short:

| Dimension | Minimum rule |
| --- | --- |
| Page | Normalized requested URLs match and observed final URLs match exactly. |
| Scan | Browser/scanner identity, viewport, locale, exact three-rule profile, and complete per-rule coverage match. |
| Evidence | The same rule-specific evidence format and contrast measurement semantics apply. |

If any row differs, report `not comparable` with the differing values. Do not create a materiality policy, configurable tolerance matrix, URL-equivalence engine, page-readiness taxonomy, or cross-version translation framework for the MVP.

The operator remains responsible for choosing the trusted page. Authorization notices, provider mode, proposal state, reviewer decision, and manual judgments do not affect deterministic scan comparability.

## Exact selected-target matching

The user selects one baseline Finding. The application then looks only for:

`exact rule ID + exact retained minimized locator string`

For a public page, the locator is the one normalized, sanitized string already retained for that Finding. For controlled evaluation, the manifest's stable target key supplies deterministic correlation. Neither is a permanent general web-element identity.

The matching rule is:

- exactly one later match: compare its rule-specific evidence;
- no later match: `inconclusive`;
- more than one later match: `inconclusive`; and
- changed or unavailable locator evidence: `inconclusive`.

Collection order, display index, raw HTML, arbitrary page text, screenshots, full DOM or accessibility-tree captures, hashes of large page fragments, embeddings, and model descriptions are not matching inputs.

### Narrow positive observation

Absence from the later violation list is not enough for `resolved`. When a rescan is initiated for one selected baseline Finding, the scan/evidence path must retain one narrow native non-failing observation for the exact same rule and locator before assigning `resolved`. If that observation cannot be obtained uniquely, the result is `inconclusive`.

Do not persist the scanner's complete pass or inapplicable collections. Controlled fixtures use their stable manifest target to obtain the expected positive observation and demonstrate the full deterministic `resolved` case.

## Outcome definitions

| Result | Minimum deterministic evidence |
| --- | --- |
| `resolved` | The selected baseline violation has one exact later same-rule/same-locator native non-failing observation under a comparable scan. This means only that the automated Finding was not reproduced under those conditions. |
| `persistent` | Both scans contain one exact same-rule/same-locator violation. For `image-alt` and `label`, any still-failing change remains persistent. |
| `improved` | `color-contrast` only: both exact matched observations remain violations and the later retained contrast margin is higher under identical measurement semantics. The Finding remains unresolved. |
| `regressed` | A retained positive baseline becomes a same-target violation, or two exact matched `color-contrast` violations have a lower later margin. This does not prove causation. |
| `inconclusive` | The pair passed the URL/profile gate, but the selected target has no exact unique match or lacks required evidence. |
| `not comparable` | The URL or exact scan/evidence profile differs, or either scan is incomplete. No Finding outcome is assigned. |

A later-only unmatched Finding remains visible in the later scan but receives no `new` or `regressed` label. The MVP does not automatically compare every Finding.

### Ordered contrast measure

For `color-contrast`, retain the scanner-emitted foreground/background colors, measured ratio, expected ratio, font size/weight, native bucket, and check identity. Use only:

`contrast margin = retained measured ratio - retained expected ratio`

Compare margins only for an exact same-rule/same-locator match under identical measurement semantics. A higher, equal, or lower later margin means `improved`, `persistent`, or `regressed`. The native axe result controls failing versus non-failing status; the margin is not a WCAG, confidence, accessibility, or conformance score.

## Deterministic sequence

1. Load the selected baseline run/Finding and the later completed run.
2. Compare the exact normalized requested/final URLs and scan/evidence profile.
3. If they differ, record `not comparable`.
4. Match the exact rule and minimized locator.
5. If the match is not unique, record `inconclusive`.
6. Otherwise compare the rule-specific evidence and assign the applicable outcome.
7. Store the before/after references, result, limitation, and required manual follow-up.

The same records must produce the same result. Comparison invokes no provider and changes no proposal or review decision.

## Controlled evaluation use

The three project-owned profiles supply the deterministic comparison demonstration without adding product scenarios:

| Profile | Frozen evaluation evidence |
| --- | --- |
| `informative-image-alt` | Failing and corrected observations support `resolved`; reusing the failing observation on both sides supports `persistent`, and reversing the pair supports the controlled `regressed` case. |
| `form-input-label` | The same failing/corrected pairings support the binary outcomes. A deliberately missing or duplicate match can be an evaluation-record case for `inconclusive` without another page revision. |
| `text-contrast` | Failing/corrected observations retain the comparison measurements. A small record-level still-failing ratio case may verify `improved` arithmetic without adding a third runtime fixture revision. |

The evaluation harness supplies scenario identity, revision role, expected result, and stable fixture key. The product scan and comparison modules receive ordinary scan records and do not expose a fixture-selector UI or a second fixture-specific product model.

## Manual judgment

Comparison reports scanner evidence only:

- `image-alt`: a person decides whether the implemented alternative fits the image's purpose and context;
- `label`: a person decides whether the rendered label is clear, visible, and associated with the intended control; and
- `color-contrast`: a person confirms the measurement applies to the intended text and relevant visual state.

The comparison may show the accepted plan and the reviewer's earlier notes as context. A later manual judgment may be recorded as a simple note or disposition with the comparison; no immutable check-definition, occurrence-history, or relationship graph is needed for the MVP.

## Conceptual comparison record

Store one small comparison object in the later run, addressed by its `baselineRunId` and the selected baseline `findingId`:

| Part | Minimum information |
| --- | --- |
| Source references | Baseline and later `runId` values and the selected baseline `findingId`; no separate scan or comparison ID. |
| Pair gate | Requested/final URL equality and exact scan/evidence profile equality, with a bounded mismatch reason. |
| Match | Exact rule, minimized locator, and `unique`, `missing`, or `duplicate` disposition. |
| Evidence | Baseline and later Finding or narrow positive-observation references and the relevant rule-specific values. |
| Result | One outcome, limitations, and optional manual-follow-up note. |

No separate correlation-policy registry, child-comparison graph, event history, or copied page payload is required. If a referenced run is deleted, expose broken lineage instead of retaining a hidden duplicate.

## Privacy and public-demo boundary

Retain only the target identity already allowed by the run record, the exact scan profile, the minimized locator, rule-specific evidence, outcome, and bounded notes. Do not persist screenshots, full HTML, DOM or accessibility-tree snapshots, browser/network traces, credentials, form values, arbitrary page text, or raw provider payloads.

Public demonstrations should use the project-owned controlled cases. A non-sensitive public-page example requires an explicit content choice; permission to scan does not imply permission to publish evidence.

## Meaningful alternatives

| Alternative | Benefit | Why it is not the MVP recommendation |
| --- | --- | --- |
| Treat later violation absence as resolution | Requires no positive observation. | It can mistake target removal or changed structure for a fix. Use `inconclusive` instead. |
| Generalized descriptor, fuzzy matching, or DOM diff | May correlate heavily changed pages. | It adds private data, tuning thresholds, false matches, and a new subsystem unrelated to the RAG demonstration. |

## Assumptions and open questions

- Both scans use the same trusted public URL and complete exact three-rule profile.
- Page changes happen outside the product.
- One privacy-safe normalized locator string can be retained for each supported Finding before implementation.
- Exact locator normalization remains a small per-rule implementation choice, not a framework.
- If real pages frequently produce `inconclusive`, evidence may justify a later correlation decision; the MVP does not anticipate it.

## Risks

- Dynamic page structure may make an exact locator unavailable.
- A locator may contain more page context than intended if minimization fails.
- A missing violation may be overstated as resolution if the positive-observation rule is bypassed.
- Scanner-emitted contrast ratios may be mistaken for a second conformance calculation.
- Before/after evidence may be published without permission.

## Explicit non-goals

- Automatic correlation of every Finding, later-only `new` classification, fuzzy matching, weighted fingerprints, generalized descriptor policies, DOM/accessibility-tree diffing, visual comparison, or AI matching.
- Multi-page comparison, crawling, authentication, scheduled monitoring, CI integration, alerts, dashboards, trends, or long-term analytics.
- Automatic comparison-to-generation loops, bulk review, provider calls, agents, queues, workers, or workflow engines.
- Automatic code modification, remediation application, deployment verification, causality, accessibility, compliance, or certification claims.

## Acceptance criteria for this planning definition

This step is adequately defined when:

1. comparison accepts only two complete scans with identical normalized requested/final URLs and exact scan/evidence profiles;
2. only one selected baseline Finding is compared;
3. one exact unique same-rule/minimized-locator match is required;
4. missing, changed, or duplicate matches are `inconclusive`;
5. `resolved` requires a narrow same-target native non-failing observation and never follows from absence alone;
6. contrast outcomes use only exact matched scanner-emitted measurements;
7. controlled fixtures exercise the full deterministic outcome set through the same modules without a fixture-selector product workflow;
8. reviewer context cannot alter the deterministic outcome; and
9. no result claims whole-page accessibility, conformance, certification, legal compliance, causation, or code modification.

## Primary sources

The exact axe release remains an evaluation pin rather than a release dependency.

- [axe-core 4.13.0 API and result categories](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 `image-alt` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json)
- [axe-core 4.13.0 `label` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json)
- [axe-core 4.13.0 `color-contrast` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json)
- [axe-core 4.13.0 contrast evidence fields](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)
- [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value)
- [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)

## Documentation navigation

- Previous workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Accessibility finding and evidence-capture assessment](ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [ADR-0018: Trusted operator URL boundary](../decisions/ADR-0018-trusted-operator-url-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Information and workflow lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
