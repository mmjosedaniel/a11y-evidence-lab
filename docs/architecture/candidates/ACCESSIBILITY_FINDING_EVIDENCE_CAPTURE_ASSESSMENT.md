# Accessibility finding and evidence capture assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the controlled-fixture MVP. This assessment does not change any requirement or architecture-decision status, authorize implementation, select persistence technology, or enable live-target scanning.

**Assessment date:** 2026-08-24.

The authoritative requirement IDs, wording, and recorded statuses for this workflow step remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance). This supporting assessment owns no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

## Exact first portfolio slice

The first slice should use exactly three project-owned controlled scenarios. Each has one failing and one corrected logical state, one axe rule, and one intended target. These six states do not require six projects, pages, or files; physical fixture layout remains an implementation detail:

| Scenario profile | Failing revision | Corrected revision | Direct mapping and limitation |
| --- | --- | --- | --- |
| `informative-image-alt` | One informative product image has no `alt` attribute and produces one `image-alt` violation. | The same image has a manually reviewed alternative and produces one same-target `image-alt` pass. | WCAG 2.2 SC 1.1.1; axe does not judge whether the alternative is contextually appropriate. |
| `form-input-label` | One visible email input has nearby text but no programmatically associated label or other accessible-name mechanism and produces one `label` violation. | The same input uses a visible `label` explicitly associated through matching `for` and `id` values and produces one same-target `label` pass. | WCAG 2.2 SC 4.1.2. The rule is not a direct test of SC 3.3.2, label quality, or the whole success criterion/page. |
| `text-contrast` | One 16 CSS px, weight-400 normal-text target is `#888888` on `#ffffff` and produces one `color-contrast` violation. | The same target retains its typography, changes to `#767676` on `#ffffff`, and produces one same-target `color-contrast` pass under the fixed browser profile. | WCAG 2.2 SC 1.4.3; retained measurements support review, while the native axe result bucket remains the scanner's pass/fail authority. |

This slice is intentionally smaller than a general evidence platform. It is enough to demonstrate the project’s distinguishing path:

`Playwright + axe-core -> deterministic evidence -> retrieval input -> RAG -> structured proposal -> human review -> rescan comparison`

Before evaluation, the content and expected rule result of each state, its stable fixture-target key, and its browser/rule profile are frozen. One scan execution within the single enclosing workflow operation processes only one selected scenario, one state, one rule, and one intended target. The scanner cannot determine alternative-text appropriateness, label accuracy or instruction sufficiency, or readability in every user condition. Those remain explicit manual checks, and disappearance of an automated finding must not be presented as proof that a whole WCAG success criterion or page is accessible or conformant.

## Smallest sufficient boundary

The scan and evidence steps should remain separate ordinary application functions, even if they run sequentially in one TypeScript process:

`Step 1 transient native scan observation in memory -> Step 2 capture and publication record -> Step 3 retrieval-input assembly`

### Step 1 output consumed here

Step 1 owns authorization, browser/scanner execution, declared configuration, coverage, and execution status. It returns one runtime-validated **transient scan observation** containing the native axe result and the minimum provenance needed by Step 2. The unredacted native result is not a durable record and is never sent to the UI, retrieval system, or model.

Step 2 does not run the browser, reinterpret execution success, or independently discover frame coverage. It accepts only a successfully completed transient observation for an allowed scenario/revision and the exact rule mapped by that profile: `image-alt`, `label`, or `color-contrast`. A failed, timed-out, interrupted, partial, stale, or mismatched observation is rejected rather than turned into evidence.

### Step 2 responsibilities

Step 2 is the single logical owner of the evidence transformation:

1. Validate the expected native axe fields and bounds.
2. Apply the versioned evidence allowlist and sanitizer before any durable write.
3. Construct the scan-run publication record and one finding record for the intended affected node of a failing revision.
4. Construct exactly one immutable sanitized source-evidence item for that finding. The first slice does not share or de-duplicate source-evidence items across findings.
5. Derive one versioned normalized finding projection from that source item.
6. Calculate the retained source-evidence digest, normalized-projection digest, and configuration digest using the selected canonical serialization.
7. For a corrected scan, retain only the narrow rule-specific positive same-target observation defined below; do not retain all native pass nodes.
8. Construct one evidence publication bundle for canonical machine-readable JSON in the run's local `data/runs/<timestamp-or-run-id>/` directory. A Markdown report may be derived for people, but it is never the sole source of truth.

Sanitization, normalization, digest creation, and publication-record construction must not also occur in Step 1. Keeping one owner prevents two components from creating different “authoritative” evidence from the same scanner result. No message broker, worker protocol, event store, or separate evidence service is needed for this slice.

This approach reuses the Playwright and axe-core evaluation baselines recorded in [ADR-0008](../decisions/ADR-0008-playwright-as-initial-browser-automation.md) and [ADR-0009](../decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md). It does not promote either candidate to release adoption. The tagged [`axe-core` result definitions](https://github.com/dequelabs/axe-core/blob/v4.13.0/axe.d.ts) expose native result categories, rules, nodes, checks, targets, URL, timestamp, and engine metadata. The tagged [`axe-core` API documentation](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md) states that `incomplete` results require further review. Those fields are source material, not a trusted persistence schema.

## First-slice evidence allowlists

All three profiles retain only the common facts needed by the six-step demonstration:

- native rule ID, exact axe-core version, and native result bucket (`violations`, `passes`, `incomplete`, or `inapplicable`) without changing its semantics;
- scanner-reported impact without inventing an order;
- scenario ID, fixture revision, rule ID, one fixture-owned stable target key, and a supporting structured locator; the locator alone never establishes identity;
- allowlisted axe check identifiers and a bounded failure or pass summary;
- exact scenario, fixture revision, page-state, browser/rule profile, scanner, sanitizer, and projection identities; and
- explicit omitted, truncated, withheld, or insufficient markers.

Native `node.html` is excluded by default. A portfolio excerpt, if needed, is a bounded sanitized representation defined by the selected rule profile. It removes URLs, arbitrary IDs and classes, unrelated attributes or text, event handlers, executable markup, and private values. The evidence policies do not retain the whole page, full HTML, React virtual DOM, general DOM fingerprint, DOM or accessibility-tree snapshot, screenshot, browser trace, network log, cookie, storage, credential, input value, or arbitrary/private URL. Arbitrary axe check `data` is rejected; only the contrast fields named below are allowed.

### `image-alt` evidence profile

The failing finding retains element kind `img`, the scanner result and allowlisted checks, and the normalized fact `alt attribute missing`. An optional excerpt contains only the `img` element kind and `alt` presence or absence; it excludes `src` and URL data.

The corrected positive target observation retains the same target/correlation inputs, native `pass`, and the normalized fact `alt attribute present and non-empty`. Its limitation states that the scanner did not judge whether the wording is contextually appropriate.

### `label` evidence profile

The failing finding retains element kind and input type, the scanner result and allowlisted accessible-name check identifiers, and the normalized fact `no accepted accessible-name mechanism reported for the target`. A bounded synthetic excerpt may represent the input kind and the presence or absence of label-related mechanisms without retaining arbitrary attribute values. It may retain the fixture-approved visible text `Email address` and the derived fact that it is not programmatically associated; it does not retain an entered value.

The corrected positive target observation retains the same target/correlation inputs, native `pass`, input kind/type, fixture-approved visible label text, and the derived fact `explicit label association present`. Its limitation states that the `label` rule establishes a non-empty accessible-name mechanism only under the recorded profile. The reviewer must still judge whether the visible label is accurate, clear, persistent, and accompanied by any necessary instructions. The direct rule mapping is WCAG 2.2 SC 4.1.2; neither the finding nor the pass is presented as an automated determination of SC 3.3.2 or page conformance.

### `color-contrast` evidence profile

The failing finding and corrected positive target observation retain the same target/correlation inputs, text element kind, exact axe-core version, native result bucket, and these allowlisted native axe values exactly as emitted:

- `fgColor`;
- `bgColor`;
- `contrastRatio`;
- `expectedContrastRatio`;
- `fontSize`; and
- `fontWeight`.

The failing revision is controlled 16 CSS px, weight-400 normal text with `#888888` foreground on `#ffffff`; the corrected revision uses `#767676` on `#ffffff` for the same target and fixed font/profile. In axe-core 4.13, the version-pinned [contrast evaluator](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js) emits `contrastRatio` as a number and `expectedContrastRatio` as a ratio string such as `4.5:1`. Step 2 preserves both raw values exactly, validates their types and bounds, and deterministically parses only the expected ratio's numeric component into the failing finding projection or the corrected positive observation, as applicable. It does not recompute contrast or override the native result bucket.

The failing projection and corrected positive observation therefore each retain the emitted numeric `contrastRatio`, the raw emitted `expectedContrastRatio`, its validated numeric component, and the deterministic normalizer version. Step 6 alone derives the comparison-only ordered **contrast margin** (retained emitted numeric measured ratio minus the validated expected-ratio numeric component) under a comparable profile and classifies `improved`, `persistent`, `regressed`, or `resolved`; capture does not calculate a margin or override the native bucket. A pass under the selected rule remains a narrow positive observation, not proof of readability in every condition or page conformance.

## Narrow corrected-scan observations

Every corrected revision needs exactly one **positive target observation** so comparison does not infer resolution merely because a violation disappeared. It contains the common positive-observation facts and only the rule-specific facts above. This is an allowlisted component of the corrected scan publication record, not a general pass-retention feature or accessibility verdict. All unrelated pass and inapplicable nodes remain unpersisted.

## Conceptual evidence record

This is a documentation-level composition of the existing **Scan run**, **Finding**, **Evidence item**, and **Positive target observation** concepts in the [information and workflow lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), not a database schema or programming-language contract. Identifiers provide references, retained-content digests identify stored content, and correlation inputs only support later matching; they are not interchangeable.

| Component | Minimum retained information | Purpose |
| --- | --- | --- |
| Scan-run publication record | Schema version; scan-run, target, authorization, scenario/fixture/revision, page-state, time, viewport, browser, scanner, selected rule profile, coverage, sanitizer, and configuration references; execution and publication eligibility; configuration digest. | Establishes which logical state of the three authorized scenarios was scanned and what actually ran. |
| Finding record | Finding, scan-run, rule-manifest, source-evidence, and normalized-projection references; native `violation` category; scanner impact; affected target; correlation-profile version and inputs. | Represents the one intended target reported by the selected rule in a failing revision. |
| Per-finding source-evidence item | Evidence, scan, and finding references; common and rule-specific allowlisted native fields; structured target; sanitizer version; retained-content digest; omission markers. | Preserves what axe reported without storing the native payload or sharing one source item across findings. |
| Normalized finding projection | Projection version; finding and source-evidence references; selected rule and `violation` category; element kind; one scenario fact (`missing text alternative`, `missing accessible name`, or `insufficient color contrast`); rule-specific values; deterministic ordering; projection digest. | Supplies stable, privacy-safe facts for display and retrieval while remaining traceable to source evidence. Contrast values remain measurements, not an independently calculated verdict. |
| Positive target observation | Corrected scan and rule references; native `pass`; same-target correlation inputs; rule-specific positive facts and allowed values; sanitizer identity; retained-content digest; limitation. For `text-contrast`, this includes raw numeric `contrastRatio`, raw string `expectedContrastRatio`, the parsed expected-ratio numeric component, and normalizer version. | Distinguishes a reported same-target pass from silence or missing coverage. It is separate from a finding-owned evidence item and does not establish whole-SC or page conformance. |
| Redaction summary | Evidence-policy and sanitizer versions; removed or transformed field categories; reason codes; retained-content digest. | Makes minimization inspectable without copying removed values. |

The minimum trace path is:

`finding -> per-finding source evidence -> scan run -> authorized fixture revision and declared state`

and:

`finding -> rule manifest -> exact scanner release and scanner guidance metadata`

Scanner metadata remains informative source context. It is not a substitute for retrieved W3C guidance.

## Handoff to retrieval and later steps

Step 2 publishes named references, not one flattened “RAG document.” Every valid deterministic finding remains available for display and local review regardless of later retrieval support; evidence sufficiency gates only whether Step 4 may call an LLM. Step 3 should assemble its privacy-safe retrieval input by resolving the **finding record**, **per-finding source-evidence item**, **normalized finding projection**, **rule manifest**, **approved scenario/rule-to-guidance mapping**, and the eligible **scan-run publication record**. The normalized projection supplies stable facts, but it is not sufficient lineage by itself. Step 3 owns the deterministic query representation and retrieval-run record.

The same records support the remaining steps without mutation:

- Generation cites the exact finding/evidence and retrieved passage references it receives; it cannot rewrite scanner evidence.
- Human review displays deterministic evidence, retrieved guidance, AI interpretation, and reviewer content as separate layers.
- Comparison uses a failing finding and corrected positive target observation for the same scenario only after the scan pair passes its prerequisites. A valid pair with ambiguous same-target correlation is `inconclusive`; a material target, state, configuration, rule, evidence-semantic, or coverage mismatch is `not comparable`. Missing, failed, partial, or invalid source scans block comparison rather than becoming either classification. For contrast only, the retained ratio provides an ordered input; the later comparison module owns any material-change margin and outcome classification.

## Privacy and public-demo boundary

The unredacted native result exists only in memory during Step 2 and is not written to logs, diagnostics, exports, temporary artifacts, vector storage, or traces. The evidence allowlist is applied before local persistence.

A public demo must use only the project-owned synthetic fixture and synthetic review history. Private sessions, real customer pages, credentials, proprietary markup, and personal data must never become demo evidence. Digests and fixture keys are not anonymization and must not be derived from sensitive raw values. MVP data remains on the developer's machine; deleting one run means deleting that run's local directory. The MVP adds no cloud storage, backup, sync, telemetry, analytics, database, or migration system.

When the policy removes material evidence, record `withheld` or `insufficient`; do not reconstruct it with an LLM or weaken the policy to force a conclusion.

## Meaningful alternatives

| Alternative | Trade-off | Proposed disposition |
| --- | --- | --- |
| Store the complete native axe result | Simplifies initial extraction but retains unnecessary page content and couples persistence to an external tool schema. | Reject for the MVP. |
| Store only the normalized projection | Is very small but loses inspectable source evidence and weakens provenance. | Reject as the canonical evidence record; retain the small per-finding source item as well. |

## Assumptions and open questions

Assumptions:

- The first evaluation uses exactly the three project-owned scenarios and their failing/corrected logical states described above, one main frame, one selected rule, and one intended target per scan.
- Each scenario has a synthetic, non-sensitive target key stable across its two states. Correlation also requires the same scenario ID, rule ID, fixture revision relationship, browser/rule profile, and minimized evidence; the selector is supporting evidence only.
- The image alternative, form-label meaning and instructions, and contrast readability remain manually reviewed because scanner output is narrower than those contextual judgments.
- The contrast fixture uses the same normal-text target and fixed typography in both revisions; only the declared foreground changes from `#888888` to `#767676` against `#ffffff`.

Remaining Proposed implementation details are limited to:

- the physical fixture layout, exact state content, target-key values, and scenario-specific manual-check wording;
- the small TypeScript record shapes, canonical JSON serialization details, digest algorithm, and atomic-write mechanics; and
- the exact three rule-to-guidance corpus manifest entries and small evaluation examples.

## Explicit non-goals

- Live or authenticated pages, arbitrary URLs or local files, crawling or a crawler implementation, any fourth fixture family or rule, broad WCAG coverage, multiple scanners, or cross-browser equivalence.
- General DOM snapshots, screenshots, accessibility trees, HAR files, browser traces, or network capture.
- Shared evidence de-duplication, a universal DOM evidence model, generalized pass retention, fuzzy matching, general fingerprints, or historical analytics.
- A worker service, queue, event-sourcing system, distributed pipeline, or production-scale storage design.
- Using LangChain, an LLM, embedding model, or vector store for deterministic capture, sanitization, correlation, or comparison.
- Automatic remediation, certification, compliance determination, or treating a passed rule as proof that a target, success criterion, or page is accessible.

## Acceptance criteria for this planning definition

This workflow step is defined adequately for later evaluation when:

1. Step 1 ends with one transient native observation, and Step 2 is the only owner of allowlisting, sanitization, source-evidence construction, normalization, digests, and publication-record construction.
2. Each failing revision creates exactly one selected-rule finding and one minimal immutable source-evidence item, with traceability to the authorized scenario/revision, declared state, scan time, exact tool/profile versions, affected target, and redaction summary.
3. The common and rule-specific allowlists exclude the native payload and raw HTML. Any displayed excerpt is bounded to the selected profile and contains no URL, credential, entered form value, private value, or executable markup.
4. Each corrected scan retains exactly one narrow same-target `pass` observation with its scenario limitation rather than all passing nodes; `label` remains mapped directly to SC 4.1.2 only.
5. Contrast source evidence and its projection preserve axe's emitted `fgColor`, `bgColor`, `contrastRatio`, `expectedContrastRatio`, `fontSize`, `fontWeight`, result bucket, and version. Capture does not override the bucket or select a later comparison margin.
6. Step 3 can construct a privacy-safe reproducible query from the named record references without embedding opaque IDs or requiring raw page content.
7. A same-scenario failing finding and corrected observation provide the evidence needed for later conservative comparison when all pair prerequisites and unique correlation pass; ambiguity produces `inconclusive`, while material pair mismatch produces `not comparable`.
8. Evidence, guidance, generated interpretation, manual checks, and reviewer content remain separate and no record makes an accessibility, compliance, certification, or automatic-fix claim.
9. Canonical JSON is confined to one local run directory and validates at the persisted-JSON boundary; optional Markdown is derived. This Proposed assessment still selects no implementation library and promotes no evaluation technology to a release dependency.

## Primary sources

- [WCAG 2.2 SC 1.1.1: Non-text Content](https://www.w3.org/TR/WCAG22/#non-text-content)
- [W3C Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [WCAG 2.2 SC 4.1.2: Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [W3C ACT rule: Form field has non-empty accessible name](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/)
- [W3C HTML technique H44: Associate labels with form controls](https://www.w3.org/WAI/WCAG22/Techniques/html/H44)
- [WCAG 2.2 SC 1.4.3: Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [W3C Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [axe-core 4.13.0 result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 contrast evaluator and emitted measurement fields](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)

## Documentation navigation

- Previous workflow step: [Authorized deterministic web scan assessments](authorized-scan/README.md)
- Next workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
