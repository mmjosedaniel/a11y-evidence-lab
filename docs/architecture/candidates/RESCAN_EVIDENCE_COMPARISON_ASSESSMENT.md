# Rescan evidence comparison assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the controlled-fixture MVP as of 2026-08-24, aligned with the accepted MVP boundaries recorded on 2026-08-25. This assessment owns no requirement IDs or statuses, does not override an accepted decision, promotes no evaluation technology to release adoption, selects no additional persistence or workflow technology, enables no live target, and does not authorize development.

The authoritative requirements remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison). This document defines the smallest comparison slice needed to demonstrate the final step of the evidence-grounded RAG workflow across the three accepted controlled scenarios. It must not be interpreted as proof that a page is accessible, conformant, certified, or fixed.

## Recommended minimal approach

Use ordinary deterministic application logic to compare one retained baseline scan with one later scan. Do not use an LLM, LangChain, embeddings, a DOM-diff library, a second scanner, or a separate comparison service. LangChain and the language model belong only in the bounded retrieval and generation steps; comparison should show that a reviewed proposal can be followed by independently observed scanner evidence.

Each comparison stage within the single enclosing workflow operation selects exactly one controlled scenario profile, one baseline scan, one later scan, one axe rule, and one known fixture target. A comparable pair produces exactly one child finding outcome; a `not comparable` pair produces none. The product does not compare the three scenarios in bulk or aggregate them into a page result.

The primary portfolio narrative is repeated independently for each profile:

`one failing synthetic baseline -> one reviewed correction -> one corrected synthetic rescan -> exact comparability check -> exact fixture-target correlation -> resolved scanner-evidence outcome`

Each profile needs only its failing and corrected fixture revisions. Those two states can also be paired independently as failing to failing for `persistent` and corrected to failing for `regressed`. The contrast profile additionally requires one provider-independent deterministic record-level `improved` check using a frozen synthetic comparable pair whose later contrast margin is strictly higher but still failing. This check does not add a third fixture revision or another end-to-end fixture scenario.

## Three controlled comparison profiles

The accepted MVP scope supplies the three synthetic, project-owned scenario families below. OD-008 accepts the minimal correlation identity; OD-012 accepts canonical JSON in one local directory per run; OD-015 accepts small TypeScript records with validation only at actual boundaries; and OD-018 accepts the three-state operation lifecycle. The exact field names, profile digests, comparison procedures, and interaction details below remain Proposed implementation details within those boundaries.

| Profile | Failing and corrected states | Selected rule and direct mapping | Retained comparison evidence | Supported child outcomes |
| --- | --- | --- | --- | --- |
| `informative-image-alt` | The known informative image has no `alt` attribute; the corrected revision gives the same image a reviewed alternative. | axe-core `image-alt`; [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content). | Native bucket, rule/check identity, stable fixture-target key, locator, minimized `img`/`alt` state, and state-appropriate finding evidence or positive target observation. | Binary `resolved`, `persistent`, `regressed`, or `inconclusive`. The scanner does not judge alternative-text quality. |
| `form-input-label` | The known email input has nearby visible text but no programmatic association and no non-empty accessible name; the corrected revision associates the same input with an explicit visible `label`. | axe-core `label`; [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value). | Native bucket, rule/check identity, stable fixture-target key, locator, element/input kind, minimized accessible-name and label-association facts, and state-appropriate finding evidence or positive target observation. | Binary `resolved`, `persistent`, `regressed`, or `inconclusive`. An automated finding or pass does not determine the whole success criterion, label quality, instructions, page conformance, or complete non-conformance. |
| `text-contrast` | The known normal-text target is `#888888` on `#ffffff`; the corrected revision keeps the same target, content, font classification, and background but uses `#767676`. | axe-core `color-contrast`; [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum). | Native bucket plus axe-emitted foreground and background colors, `contrastRatio`, `expectedContrastRatio`, font size, font weight, stable fixture-target key, locator, and state-appropriate finding evidence or positive target observation. | `resolved`, `improved`, `persistent`, `regressed`, or `inconclusive` under the ordered-measure restrictions below. |

The profiles share these material invariants: exact fixture family, declared page-state profile, selected rule, known target key, viewport, locale, browser version, scanner and wrapper versions, rule-profile digest, sanitizer/evidence-profile version, and relevant rule coverage. The fixture revision and bounded target evidence intentionally changed by the reviewed correction are allowed differences.

The failing side supplies one finding and its per-finding source-evidence item. A non-failing side supplies the separate positive target observation required to show that the same rule exercised the same known target. Both record types are owned by the evidence-capture step. Absence from a later violation list is not positive evidence.

## Deterministic comparison sequence

1. **Validate the source scans.** Both references must resolve to retained scan results from completed runs whose selected-rule and coverage data are complete. A missing, corrupt, failed, unpublished, or scan-incomplete input fails the enclosing workflow operation and produces no comparison outcome.
2. **Resolve one comparison profile.** The operation must name exactly one of the three scenario profiles, its one selected axe rule, and its one known fixture target. A missing, conflicting, or unsupported profile fails validation rather than widening the rule scope.
3. **Evaluate pair comparability.** Compare the frozen material invariants for that profile. A material mismatch between two otherwise valid scans produces the pair-level result `not comparable`. The intended revision and bounded evidence changes do not themselves make the pair not comparable.
4. **Correlate the selected target.** Require the exact selected rule and stable fixture-target key across the state-appropriate records: finding evidence for each failing side and a positive target observation for each non-failing side. A missing, duplicate, conflicting, or ambiguous record produces child outcome `inconclusive`; it is not forced into a match.
5. **Compare profile evidence.** Apply the binary rules for `image-alt` or `label`, or the contrast rules and ordered measure for `color-contrast`. Preserve native scanner categories; never turn `incomplete` or `inapplicable` into a pass or violation.
6. **Complete one comparison result.** Record one pair-level comparison with its comparability assessment and, only when comparable, one identified child outcome. A `not comparable` pair has no child entry. The enclosing run may become `completed` only after this result and its references validate; failure leaves the run failed rather than partially successful. Proposal, review, and manual-check records remain linked human context, never inputs to the automated outcome.

Comparison is a pure transformation of retained evidence. Repeating it with the same scan records and comparison-profile version must produce the same result.

## Separate state dimensions

Do not combine operational progress, source validity, pair comparability, finding outcome, or manual judgment into one status:

| Dimension | MVP vocabulary and meaning |
| --- | --- |
| Workflow operation | Reuse the accepted first-slice lifecycle: `running`, `completed`, or `failed`. Retry creates a new immutable run with an optional link to the failed run; it never overwrites the earlier directory. The MVP has no created, queued, cancelled, paused, partial-success, checkpoint, worker, or resume state. |
| Source-scan completeness | `complete` or `incomplete`. An incomplete source cannot enter substantive comparison. Do not introduce `partial` as a competing term. |
| Native scanner result | Preserve `violations`, `incomplete`, `passes`, and `inapplicable` under a clearly labeled scanner-result field. Scanner-native `incomplete` is not a workflow-operation state. |
| Pair comparability | `comparable` or `not comparable`. `Not comparable` is a valid completed assessment of two valid scans, not an operation failure. |
| Child finding outcome | `resolved`, `persistent`, `regressed`, or `inconclusive` for each profile; `improved` is additionally available only to the `text-contrast` profile under its `color-contrast` ordered-measure rule. |
| Manual-check execution | Reuse `pending`, `completed`, or `not applicable`, plus a separately recorded observed outcome and `supports`, `contradicts`, or `inconclusive` relationship to the proposal. |

A `not comparable` pair contains no child outcome. An invalid source pair fails the enclosing workflow operation before pair comparability is decided. Ambiguous target correlation can become `inconclusive` only after the source scans pass the comparability gate.

## Binary outcome definitions

These definitions apply independently to the `informative-image-alt` and `form-input-label` profiles:

| Outcome | Minimum evidence rule |
| --- | --- |
| `resolved` | The comparable baseline reports the selected-rule violation for the exact fixture target; the later positive target observation records that the same rule exercised that target without reporting the violation; and later relevant coverage is complete. This proves only disappearance of the selected automated finding under the recorded profile. |
| `persistent` | Both comparable scans report the selected-rule violation for the exact fixture target. Record any material evidence delta, but do not interpret a changed still-failing `alt` or accessible-name state as improvement. |
| `regressed` | A comparable baseline positive target observation is non-failing and the later scan reports the selected-rule violation for that exact target. |
| `inconclusive` | The pair is comparable, but target identity is ambiguous, required evidence is unavailable or conflicting, the native result is `incomplete` or `inapplicable`, or the evidence does not satisfy a definitive binary transition. |

Neither binary profile has a selected ordered measure between two violations. A changed `alt` value or accessible-name value that still violates the selected rule is therefore `persistent`, with the delta visible, and must not be called improved.

For the `form-input-label` profile, these outcomes describe only the axe `label` observation for the known input. A violation does not independently prove complete SC 4.1.2 or page non-conformance, and a pass does not prove that the label is accurate, clear, visible, or sufficient in context.

## Contrast outcome definitions and ordered measure

For the `text-contrast` profile, retain the exact axe `color-contrast` measurements rather than calculating a second source of scan truth. Define this comparison-only derived measure:

`measured ratio = retained numeric value emitted as contrastRatio`

`expected ratio = validated numeric component of retained expectedContrastRatio`

`contrast margin = measured ratio - expected ratio`

A higher margin is directionally better. The margin is not a WCAG score, confidence value, conformance measure, or alternative pass/fail algorithm. Compare it only when fixture target, comparison profile, axe-core and wrapper versions, browser profile, font classification, and expected threshold are identical and both measurements are determinate.

The raw emitted measured value is numeric, while axe-core 4.13 emits `expectedContrastRatio` as a ratio string; the Step 2 projection preserves both and parses only the expected ratio's numeric component through its versioned deterministic normalizer. The axe-reported measured ratio is version-specific and may be truncated for output. The native axe result bucket is therefore authoritative for whether a transition is failing or non-failing and determines `resolved`; the margin orders only two determinate violations. The application must not round, recalculate, or reinterpret the displayed ratio to manufacture a pass. The [version-pinned axe evaluator](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js) documents the emitted fields and truncation, while the [WCAG Understanding document](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) states that the `3:1` and `4.5:1` thresholds must not be satisfied by rounding.

| Outcome | Minimum evidence rule |
| --- | --- |
| `resolved` | The comparable baseline is a determinate `color-contrast` violation and the later same-target positive observation is a native pass under the identical expected threshold and profile. |
| `improved` | Both comparable scans remain determinate violations, and the later retained contrast margin is strictly higher than the baseline margin. The finding remains unresolved and the result must say so. |
| `persistent` | Both comparable scans remain determinate violations and their retained contrast margins are equal. Preserve the zero delta and do not relabel the still-failing target as resolved. |
| `regressed` | Either the comparable baseline has a determinate same-target native pass and the later scan reports a native violation, or both scans remain determinate violations and the later retained margin is strictly lower. The expected threshold and profile must be identical. |
| `inconclusive` | Either measurement is missing or indeterminate; the native result is `incomplete` or `inapplicable`; the expected threshold, font classification, engine/profile, or target changed; or the retained values cannot support a deterministic calculation. |

No third fixture revision is required to demonstrate `improved`. The selected failing-to-corrected portfolio pair demonstrates `resolved`; one provider-independent deterministic record-level check demonstrates the conservative `improved` classification, and any later real comparison receives that outcome only when it independently satisfies the same evidence rule.

## Manual checks and review context

An accepted or edited remediation plan may explain why the user requested a later scan, but it does not prove that the change was applied or caused the automated result. Approval, rejection, model text, citations, the immutable evidence-sufficiency gate, and model confidence do not enter comparability, target correlation, or outcome calculation.

Reuse the proposal's scenario-specific post-change manual-check definition:

- **`image-alt`:** verify that the implemented alternative communicates the image's purpose in context, exposes the intended action for a functional image, or correctly omits a decorative image without losing information.
- **`label`:** verify that the visible label accurately and clearly communicates the input's purpose in context, remains programmatically associated, and does not rely on the automated rule to judge the sufficiency of instructions.
- **`color-contrast`:** verify that the selected text is meaningful ordinary text in the intended visual state, that no SC 1.4.3 exception changes the interpretation, and that the reviewed color change remains suitable in context. Other themes and interaction states are not inferred from the one controlled state.

After the later scan, create a new **Manual-check result** occurrence referencing the same definition, exact proposal version, later scan, known fixture target, and comparison record. It records its own reviewer, timestamp, execution status, observed outcome, relationship to the proposal, and bounded evidence or note.

The later result begins `pending`; do not clone the definition, copy a baseline result forward, or imply completion from `resolved` or `improved`. A completed result may support, contradict, or remain inconclusive about the proposal while leaving the automated comparison outcome unchanged. The interface presents both observations separately.

## Conceptual comparison record

Use one canonical **Scan-pair comparison** record. It contains one identified child outcome rather than creating a second pair entity per finding. It is application-owned canonical JSON within the relevant local run directory. Exact filenames and TypeScript field shapes remain implementation details within OD-012 and OD-015; this assessment selects no schema framework.

| Record part | Minimum conceptual information |
| --- | --- |
| Identity and operation | Comparison ID and profile version; enclosing run/operation reference and its `running`, `completed`, or `failed` status; start and completion or failure times. |
| Selected profile | Exactly one scenario-profile ID, one selected rule, one known fixture-target key, and the profile's evidence-semantics version. |
| Source pair | Baseline and later scan IDs; fixture-family and revision references; authorization references; exact scan, rule, browser, evidence, sanitizer, page-state, viewport, locale, and coverage-profile identities. |
| Pair comparability | Each material invariant's baseline and later identity, pass or mismatch disposition, bounded reason code, and overall `comparable` or `not comparable` result. |
| Child outcome | For a comparable pair, the two state-appropriate source records, exact rule and target key, before/after evidence references, correlation rationale, outcome, limitations, and one evidence delta. A `not comparable` pair has no child entry. |
| Contrast-only delta | Raw axe-emitted foreground/background colors, measured ratio, expected-ratio string, font size/weight, and the normalized expected-ratio component and font classification for both scans; derived margins and delta; and explicit confirmation that the required engine, evidence-normalization, classification, and threshold versions match. Omit this part for the binary profiles. |
| Human context | Optional accepted-proposal and review-action references; reused manual-check definition; and later manual-check result occurrence. These references do not enter deterministic calculation. |
| Limitations and follow-up | Fixed no-certification and no-whole-page conclusion; scenario-specific manual-verification limitation; unresolved statement for `improved`; and separate manual-check state. |

Prefer references over duplicate page content. If a referenced run directory is deleted, expose broken lineage; do not reconstruct or preserve a hidden copy.

## Privacy and public-demo boundary

Comparison uses only project-owned synthetic fixture content. Retain only the scenario and fixture identities, bounded sanitized target evidence, exact configuration identities, and outcome rationale required above. Do not retain screenshots, full HTML, accessibility-tree or DOM snapshots, network traces, credentials, private URLs, or private review notes.

Before-and-after evidence can reveal changes even when each scan looks harmless in isolation. Keep each minimized comparison and its references only in the applicable local run directories; deleting a run directory deletes the application's MVP copy. Any separately prepared public demonstration material must use a closed allowlist and synthetic reviewer information. The MVP adds no export service, cloud storage, backup, telemetry, analytics, full-page capture, hash-based anonymization, or generalized element fingerprint.

## Meaningful alternatives

| Alternative | Benefit | Why it is not the MVP recommendation |
| --- | --- | --- |
| Treat absence from the later violation list as resolution | Requires less retained evidence. | It cannot show that the same target and rule were exercised, so it can mistake removal, missing coverage, or scan failure for resolution. |
| Fuzzy matching or full DOM/accessibility-tree diff | May correlate targets after broad structural change. | It adds thresholds, false-match risk, private content, storage, and noise that stable project-owned target keys make unnecessary. |

## Primary sources

The exact axe release remains an evaluation pin rather than a release dependency; evidence and comparison records must retain the version actually used.

- [axe-core 4.13.0 API and result categories](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 `image-alt` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json)
- [axe-core 4.13.0 `label` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json)
- [axe-core 4.13.0 `color-contrast` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json)
- [axe-core 4.13.0 contrast evidence fields and reported-ratio handling](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [WCAG 2.2 SC 1.1.1: Non-text Content](https://www.w3.org/TR/WCAG22/#non-text-content)
- [WCAG 2.2 SC 4.1.2: Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [W3C ACT rule: Form field has non-empty accessible name](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/)
- [WCAG 2.2 SC 1.4.3: Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## Assumptions and remaining implementation questions

### Assumptions

- The authoritative MVP scope accepts the three project-owned scenario families above; this assessment proposes only their comparison mechanics.
- Evidence capture retains one finding and per-finding source-evidence item for a failing side and one narrow positive same-target observation for a non-failing side under each selected profile.
- Each fixture target key is synthetic, stable across its two revisions, and not derived only from a CSS selector.
- The exact pinned tool and profile versions will be recorded when an evaluation authority is frozen; this assessment does not promote them to release support.
- Page changes happen outside the product; the product neither edits code nor verifies deployment causality.

### Remaining implementation questions

- What exact three fixture-family identifiers, target-key convention, profile digests, and scenario-specific sanitized evidence field names best implement the accepted minimal identity?
- What exact JSON filenames and TypeScript record fields best fit the accepted run-directory and boundary-validation decisions?
- What exact wording and compact interaction best present each scenario's post-change manual check without implying that it changes the automated outcome?

## Risks

- A missing later violation could be overstated as a fix if the same-target positive observation or complete coverage is bypassed.
- A structurally acceptable alternative or accessible name can pass its automated rule while remaining contextually poor; only the separate manual check addresses that question.
- A truncated reported contrast ratio could be misused as a second pass/fail calculation unless the native bucket remains authoritative.
- Fixture identity, expected contrast threshold, font classification, or profile drift could create a misleading comparison if treated as an allowed change.
- Before-and-after evidence or review notes could expose private changes if the synthetic-only boundary is later relaxed.
- A portfolio presentation could overstate three controlled scenarios as broad WCAG or accessibility coverage.

## Explicit non-goals

- Comparing more than one baseline and one later scan, selected rule, known target, or child outcome in one operation; bulk comparison across the three profiles; multiple pages; crawling; live or authenticated pages; scheduled monitoring; CI integration; alerts; dashboards; trends; or long-term analytics.
- A third contrast fixture revision or additional end-to-end fixture scenario solely to demonstrate `improved`, or an `improved` result for the binary `image-alt` and `label` profiles. The accepted provider-independent record-level `improved` check remains in scope.
- General-purpose element matching, fuzzy or weighted correlation, AI matching, embeddings, DOM or accessibility-tree diffing, screenshots, visual comparison, or cross-version translation.
- Page-level scores, aggregate finding counts, broad WCAG coverage, accessibility conclusions, certification, conformance, complete non-conformance, or causal proof.
- Automatic source-code modification, remediation application, deployment verification, regeneration, retrieval, or re-review after the rescan.
- Adding a database, event store, workflow engine, comparison package, hosted service, backup, export service, or production infrastructure.

## Acceptance criteria for this planning definition

This workflow step is adequately defined for the three-scenario portfolio slice when:

1. Each operation selects exactly one of the three project-owned profiles, one baseline scan, one later scan, one rule, and one stable fixture target; a comparable pair contains exactly one child outcome and a `not comparable` pair contains none.
2. Each scan retains its required state-specific target evidence; absence from a later violations list is never sufficient to claim resolution.
3. Invalid or incomplete source scans fail the enclosing workflow operation; a material invariant mismatch produces pair-level `not comparable`; and ambiguous target correlation produces child-level `inconclusive` only after comparability passes.
4. The binary evidence rules deterministically define `resolved`, `persistent`, and `regressed` for `image-alt` and `label`, with no `improved` inference and with their manual-quality limitations visible.
5. Contrast evidence retains axe-emitted colors, reported and expected ratios, and font inputs; margin comparison is allowed only under the exact equality gates; the native bucket determines `resolved`; two violations with a higher, equal, or lower later margin produce `improved`, `persistent`, or `regressed` respectively; and `improved` remains explicitly unresolved.
6. One pair-level record contains the comparability result and, when comparable, exactly one identified child outcome; a `not comparable` pair contains none.
7. A later manual-check result reuses the proposal's scenario-specific definition and records its own execution and relationship without modifying the automated outcome.
8. The visible result traces to both scan and evidence records and states that the finding transition does not establish label or alternative-text quality, whole-page accessibility, compliance, certification, complete non-conformance, or causal remediation success.
9. The public demonstration uses only the bounded project-owned synthetic scenario, configuration, reviewer, and comparison material described here.
10. The enclosing operation uses only `running`, `completed`, or `failed`; retry creates a new run; canonical comparison data is JSON in the local run boundary; and no partial-success, queue, cancellation, checkpoint, worker, resume, database, backup, or export mechanism is required.

## Documentation navigation

- Previous workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Accessibility finding and evidence-capture assessment](ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Information and workflow lifecycle model](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
