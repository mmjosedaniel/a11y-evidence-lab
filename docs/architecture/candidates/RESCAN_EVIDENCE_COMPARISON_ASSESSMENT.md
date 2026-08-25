# Rescan evidence comparison assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the controlled-fixture MVP as of 2026-08-24. This assessment owns no requirement IDs or statuses, accepts no open decision, promotes no evaluation technology to release adoption, selects no persistence or workflow technology, enables no live target, and does not authorize development.

The authoritative requirements remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison). This document defines the smallest comparison slice needed to demonstrate the final step of one evidence-grounded RAG workflow. It must not be interpreted as proof that a page is accessible, conformant, certified, or fixed.

## Recommended minimal approach

Use ordinary deterministic application logic to compare one retained baseline scan with one later scan. Do not use an LLM, LangChain, embeddings, a DOM-diff library, a second scanner, or a separate comparison service. LangChain and the language model belong in the retrieval and generation steps; comparison should show that their reviewed proposal can be followed by independently observed scanner evidence.

The primary portfolio UI narrative is:

`one failing image-alt baseline -> one corrected image-alt rescan -> exact comparability check -> exact fixture-element correlation -> resolved scanner-evidence outcome`

This is sufficient for the visible user story because it completes the chain from a deterministic finding through RAG, generation, review, and independent rescan evidence. The fixed evaluation reuses the same two fixture states in three independent one-pair operations: failing → corrected for `resolved`, failing → failing for `persistent`, and corrected → failing for `regressed`. No third fixture state or multi-pair comparison entity is needed.

## Frozen first comparison profile

OD-002 already accepts the exact scenario below. This assessment proposes its comparison semantics for a later OD-008 disposition:

| Profile part | Proposed first-slice value |
| --- | --- |
| Target | One project-owned `image-alt` controlled-fixture family. |
| Baseline revision | One informative image lacks an `alt` attribute and the pinned axe-core `image-alt` rule reports a violation for the known fixture element. |
| Later revision | The same fixture element has the intended structural alternative and the pinned `image-alt` rule records it as non-failing under the same scan profile. |
| Rule scope | Exactly the axe-core `image-alt` rule; no page-wide score or unrelated finding count enters the comparison. |
| Element identity | One stable, project-owned fixture element key shared by both revisions. A CSS selector may be displayed as supporting evidence but is not the identity. |
| Required target evidence | Each scan retains state-appropriate, privacy-safe evidence with the same fixture element key and rule ID. A failing state uses its finding plus per-finding source-evidence item; a non-failing state uses the separate positive target-observation record required by the comparison profile. |
| Material invariants | Exact equality of fixture family, declared page-state profile, viewport, locale, browser version, scanner and wrapper versions, rule-profile digest, sanitizer/evidence-profile version, and relevant coverage. |
| Allowed difference | The fixture revision and the bounded element evidence intentionally changed by the remediation. |
| Expected first result | `resolved`, limited to “the automated `image-alt` finding is no longer reported for the same observed fixture element under the recorded profile.” |

Both record types are owned by the evidence-capture step. The positive target observation is separate from an evidence item because it has no source finding; it exists only when the non-failing side must prove that the same target and rule scope were exercised.

## Deterministic comparison sequence

1. **Validate the source scans.** Both references must resolve to retained, published scans whose work operations completed and whose required rule and coverage data are complete. A missing, corrupt, failed, unpublished, or scan-incomplete input blocks or fails the comparison operation and produces no comparison outcome; the same applies to a `cancelled` input if a later lifecycle introduces that state.
2. **Evaluate pair comparability.** Compare only the frozen material invariants above. A material mismatch between two otherwise valid and complete scans produces the pair-level result `not comparable`. The intended fixture-revision and bounded evidence changes are allowed and must not themselves make the pair not comparable.
3. **Correlate the selected target.** Only after the pair passes comparability, require the same exact `image-alt` rule and fixture element key across the state-appropriate records: finding evidence for each failing side and a positive target observation for each non-failing side. A missing, duplicate, conflicting, or otherwise ambiguous record produces the child finding outcome `inconclusive`; it is not forced into a match.
4. **Compare the rule evidence.** Compare the baseline and later native rule dispositions and their minimized evidence references using the binary outcome rules below.
5. **Publish one comparison record.** Record one pair-level comparison with its comparability assessment and, when comparable, one identified child finding-outcome entry. A `not comparable` pair has no child entry. Keep any proposal, review action, and manual-check result as linked human context, never as inputs to the automated outcome.

The comparison is a pure transformation of retained evidence. Repeating it with the same scan records and comparison-profile version must produce the same result.

## Separate state dimensions

Do not combine operational progress, source validity, pair comparability, and finding outcome into one status:

| Dimension | MVP vocabulary and meaning |
| --- | --- |
| Comparison work operation | Reuse the first-slice canonical work lifecycle: `created`, `running`, `completed`, or `failed`. The sequential first slice exposes no interactive cancellation; a later cancellable stage may add `cancelled`. |
| Source-scan completeness | `complete` or `incomplete`. An incomplete source cannot enter substantive comparison. Do not introduce `partial` as a competing term. |
| Native scanner result | Preserve the scanner's own `violations`, `incomplete`, `passes`, and `inapplicable` categories under a clearly labeled scanner-result field. Scanner-native `incomplete` is not a comparison operation state. |
| Pair comparability | `comparable` or `not comparable`. `Not comparable` is a valid completed assessment of two valid scans, not an operation failure. |
| Child finding outcome | For this scenario: `resolved`, `persistent`, `regressed`, or `inconclusive` when applicable. |
| Manual-check execution | Reuse `pending`, `completed`, or `not applicable`, plus its separately recorded observed outcome and `supports`, `contradicts`, or `inconclusive` relationship to the proposal. |

A `not comparable` pair contains no child finding outcome. An invalid source pair fails or blocks the operation before pair comparability is decided. An ambiguous element match can become `inconclusive` only after the two source scans have passed the comparability gate.

## Outcome definitions for the `image-alt` slice

| Outcome | Minimum evidence rule |
| --- | --- |
| `resolved` | The comparable baseline reports an `image-alt` violation for the exact fixture element, the later same-target observation records that the same rule exercised the same element without reporting the violation, and later relevant coverage is complete. This is only disappearance of the automated finding under the recorded profile. |
| `persistent` | Both comparable scans report the `image-alt` violation for the exact fixture element and the material binary failure evidence is unchanged. |
| `regressed` | A comparable baseline same-target observation is non-failing and a later scan reports an `image-alt` violation for that exact element. This inverse transition is defined for the scenario but is not produced by the selected failing-to-corrected demonstration pair. |
| `inconclusive` | The pair is comparable, but same-target identity is ambiguous, required evidence was withheld or is unavailable, the relevant native result is `incomplete`, or the evidence does not satisfy one of the definitive binary transitions. |
| `not comparable` | Both source scans are valid and complete, but at least one frozen material invariant differs. This result applies to the pair and contains no child finding outcome. |

`Improved` is not applicable to this first rule. The `image-alt` slice has no accepted ordered measurement between failing and non-failing, so a changed value that still violates the rule must not be called improved. The canonical outcome remains available for a later scenario, such as contrast, that defines an evidence measure and direction.

`New` also remains part of the canonical product vocabulary, but this one-known-element slice does not discover or compare additional targets. The MVP demonstration therefore does not produce a `new` outcome. This bounded assessment does not remove either outcome from the authoritative requirements.

## Manual checks and review context

The accepted or edited remediation plan may explain why the user requested the later scan, but it does not prove that the change was applied or caused the automated result. Approval, rejection, model text, citations, and evidence-sufficiency labels do not enter comparability, target correlation, or outcome calculation.

Reuse the exact post-change verification definition already attached to the proposal: verify whether the implemented alternative communicates the image's purpose in context, exposes the intended action for a functional image, or correctly removes a decorative image from text alternatives without losing information. After the later scan, create a new **Manual-check result** occurrence that references:

- the same manual-check definition;
- the exact proposal version to which the check relates;
- the later scan and the known fixture element;
- the comparison record; and
- its own reviewer, timestamp, execution status, observed outcome, relationship to the proposal, and bounded evidence or note.

The later result begins `pending`; do not clone the definition, copy a baseline result forward, or imply completion from the automated `resolved` outcome. A completed result may support, contradict, or remain inconclusive about the proposal while leaving the automated comparison outcome unchanged. The interface should present both observations separately, for example:

> Automated result: resolved under the recorded `image-alt` profile. Manual verification of alternative-text appropriateness: pending.

## Conceptual comparison record

Use one canonical **Scan-pair comparison** record. It contains identified child finding outcomes rather than creating a second pair-level entity per finding. Exact serialization remains under OD-015.

| Record part | Minimum conceptual information |
| --- | --- |
| Identity and operation | Comparison ID and profile version; comparison work-operation reference and separate operation status; start and completion times. |
| Source pair | Baseline and later scan IDs; fixture-family and revision references; authorization references; exact scan, rule, browser, evidence, sanitizer, page-state, viewport, locale, and coverage profile identities. |
| Pair comparability | Each frozen invariant's baseline and later identity, pass or mismatch disposition, bounded reason code, and overall `comparable` or `not comparable` result. |
| Child finding outcomes | For a comparable MVP pair, one entry containing the relevant state-specific records: two findings for `persistent`, baseline finding plus later positive target observation for `resolved`, or baseline positive target observation plus later finding for `regressed`; plus the exact rule and fixture element key, before/after evidence references, correlation rationale, outcome, and limitations. No child entry is created when the pair is not comparable. |
| Human context | Optional accepted-proposal and review-action references; the reused manual-check definition; and the later manual-check result occurrence. These references do not enter deterministic calculation. |
| Limitations and follow-up | Fixed no-certification and no-whole-page conclusion; statement that automated disappearance does not judge alternative-text quality; required manual verification and its separate state. |

Prefer references over duplicate page content. If a referenced source record is deleted under an accepted policy, the comparison must expose broken lineage and must not reconstruct or preserve a hidden copy.

## Privacy and public-demo boundary

The first comparison uses only project-owned synthetic fixture content. Retain only the fixture identity, bounded sanitized element evidence, exact configuration identities, and outcome rationale required above. Do not retain screenshots, full HTML, accessibility-tree or DOM snapshots, network traces, credentials, private URLs, or private review notes.

Before-and-after evidence can reveal changes even when each scan looks harmless in isolation. Public views and exports therefore use a closed allowlist and synthetic reviewer information. Hashes and element fingerprints are integrity or correlation material, not anonymization.

## Meaningful alternatives

| Alternative | Benefit | Why it is not the MVP recommendation |
| --- | --- | --- |
| Treat absence from the later violations list as resolution | Requires less retained evidence. | It cannot show that the same target and rule were exercised, so it can mistake removal, missing coverage, or scan failure for resolution. |
| Fuzzy matching or full DOM/accessibility-tree diff | May correlate targets after broad structural change. | It adds thresholds, false-match risk, private content, storage, and noise that the stable controlled-fixture key makes unnecessary. |

## Assumptions and open questions

### Assumptions

- OD-002 accepts the project-owned `image-alt` fixture as the first complete portfolio scenario.
- The evidence-capture assessment retains the failing finding evidence for the baseline and the narrow positive same-target observation for the corrected scan.
- The fixture-controlled element key is stable across the two revisions and is not derived only from a CSS selector.
- The exact pinned tool and profile versions will be recorded when an evaluation authority is frozen; this assessment does not promote them to release support.
- The page change happens outside the product; the product does not edit code or verify deployment causality.

### Open questions

- What exact fixture-family identifier, element-key convention, profile digest, and sanitized element fields will OD-008 and OD-015 accept for the already-selected scenario?
- What retention and deletion behavior will OD-006 and OD-012 accept for the two source scans and their linked comparison?
- What reviewer rubric will OD-007 and OD-009 accept for the already-defined post-change alternative-text check?

## Risks

- A missing later violation could be overstated as a fix if the required same-target observation or complete coverage is bypassed.
- A structurally present alternative can pass the automated rule while still being contextually poor; only the separate manual check can address that question.
- Fixture identity or profile drift could create a misleading comparison if treated as an allowed content change.
- Before-and-after evidence or review notes could expose private changes if the synthetic-only demo boundary is later relaxed.
- A portfolio presentation could overstate the single scenario as broad WCAG or accessibility coverage.

## Explicit non-goals

- More than two fixture states, more than one baseline and one later scan per comparison operation, multiple findings, multiple pages, crawling, scheduled monitoring, CI integration, alerts, dashboards, trends, or long-term analytics. The three fixed evaluation pairings remain separate one-pair operations over the same two states.
- General-purpose element matching, fuzzy or weighted correlation, AI matching, embeddings, DOM or accessibility-tree diffing, screenshots, visual comparison, or cross-version translation.
- An `improved` result for `image-alt`, page-level scores, finding-count comparisons, aggregate accessibility conclusions, certification, conformance, or causal proof.
- Automatic source-code modification, remediation application, deployment verification, regeneration, retrieval, or re-review after the rescan.
- Selecting a database, event store, workflow engine, comparison package, hosted service, or production infrastructure.

## Acceptance criteria for this planning definition

This workflow step is adequately defined for the first portfolio slice when:

1. The baseline and later scan are limited to the selected project-owned `image-alt` fixture revisions, exact rule, known element, and one frozen comparison profile.
2. Each scan retains the required state-specific target evidence, and the selected failing-to-corrected pair deterministically produces `resolved` only when the baseline finding evidence, later positive target observation, exact identity, coverage, and evidence gates pass.
3. The same binary rules define `persistent` and the inverse `regressed` transition without inventing an `improved` state, while `new` is explicitly outside this single-target demonstration.
4. Invalid or incomplete source scans fail or block the operation; a material invariant mismatch produces pair-level `not comparable`; and an ambiguous correlation produces child-level `inconclusive` only after comparability passes.
5. One pair-level comparison record contains the comparability result and, when comparable, one identified child finding-outcome entry, with operation state kept separate.
6. A later manual-check result reuses the proposal's check definition and records its own execution and relationship without modifying the automated outcome.
7. The visible result traces to both scan and evidence records and states that disappearance of the automated finding does not establish appropriate alternative text, page accessibility, compliance, certification, or causal remediation success.
8. The public demonstration can use only the bounded project-owned synthetic fixture, configuration, reviewer, and comparison material described here.

## Documentation navigation

- Previous workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Accessibility finding and evidence-capture assessment](ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Information and workflow lifecycle model](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
