# Evidence and review workflow requirements

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Workflow-step technical assessments

The requirement rows and recorded statuses in this module are canonical. The linked assessments contain Proposed technical research for one workflow step each. They own no requirement IDs or statuses, cannot override an identified requirement or accepted ADR, and do not authorize development. Read only the assessment relevant to the task.

| Planned workflow step | Canonical requirements | Proposed technical assessment |
| --- | --- | --- |
| Scan the authorized controlled fixture with deterministic browser checks | [Target authorization and scanning](#target-authorization-and-scanning) | [Authorized deterministic web scan assessments](../architecture/candidates/authorized-scan/README.md) |
| Capture accessibility findings and the evidence behind them | [Evidence and provenance](#evidence-and-provenance) | [Accessibility finding evidence-capture assessment](../architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) |
| Retrieve relevant accessibility guidance from the curated corpus | [Corpus and retrieval](#corpus-and-retrieval) | [Accessibility guidance retrieval assessments](../architecture/candidates/guidance-retrieval/README.md) |
| Generate a structured, evidence-grounded explanation and remediation proposal | [Generated explanations and remediation proposals](#generated-explanations-and-remediation-proposals) | [Evidence-grounded remediation-generation assessment](../architecture/candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md) |
| Present each proposal for human review | [Human review and manual checks](#human-review-and-manual-checks) | [Human remediation-review assessment](../architecture/candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md) |
| Rescan and compare the evidence | [Rescan and comparison](#rescan-and-comparison) | [Rescan evidence-comparison assessment](../architecture/candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md) |

### First-slice handoff boundaries

The `image-alt` scenario is Accepted; each detailed handoff retains the status of its governing requirement rows below. The table defines the coherent minimum boundary proposed for the first portfolio slice and does not promote a Proposed requirement by summary prose. Adjacent steps may later execute in the same TypeScript process:

| From | To | Minimum handoff |
| --- | --- | --- |
| Scan | Evidence capture | One transient in-memory native axe result plus scan execution and coverage metadata; no durable or normalized evidence is created by the scan step. |
| Evidence capture | Retrieval | One eligible scan record, one finding, its per-finding sanitized source evidence, normalized projection, exact rule metadata, and approved scenario mapping. |
| Retrieval | Generation | One completed retrieval record containing the exact privacy-safe query representation, corpus snapshot, ranked passages, citation metadata, and support state. |
| Generation | Review | One structurally valid, clearly AI-generated proposal with inspectable references, or one abstention. Mechanical validation does not replace the reviewer's semantic judgment. |
| Review | Comparison | The immutable review action, accepted plan when one exists, reusable manual-check definitions, and any completed result occurrences; none is automated proof. |
| Rescan | Comparison | One comparable scan pair, the same-target evidence required by the `image-alt` profile, and one identified finding-comparison entry. |

### First-slice eligibility gates

| Gate | Minimum rule |
| --- | --- |
| Retrieval → generation | Only a completed `supported` retrieval record may invoke the model. The first `weak`, `missing`, `conflicting`, or `unassessed` result produces a deterministic abstention without a model call. |
| Generation → proposal review | Only the `proposal` branch with valid structure, resolvable supplied references, and no prohibited claim enters `pending_review`. An abstention follows its separate acknowledgement or manual-triage path. Semantic support remains a reviewer decision, not a model or string-matching decision. |
| Proposal → accepted remediation plan | Every material claim and remediation step must be confirmed by the reviewer as supported within the displayed evidence and guidance, and every blocking manual check must satisfy REQ-REV-006. Otherwise the reviewer must edit from the same support or reject. |
| Scan pair → finding comparison | The pair must match the accepted fixture identity, declared state role, browser/viewport/locale, scanner and rule profile, and relevant coverage. The same stable fixture-element key must appear in finding plus per-finding source evidence for each failing side and in a positive target observation for each non-failing side. Material mismatch is `not comparable`, while invalid or incomplete source scans fail the operation. |

## Target authorization and scanning

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-AUTH-001 | Before the project-owned fixture is scanned, the user must explicitly confirm the fixture ID and that the run is limited to that local synthetic fixture. The scan record must retain the attestation time and scope; no legal-ownership workflow or credential is required for this slice. | Must | Accepted | Demonstration |
| REQ-AUTH-002 | The MVP must accept a controlled fixture and must not crawl links or discover additional targets automatically. A live page may be enabled only through the gated requirements for live-target support. | Must | Accepted | Deterministic test |
| REQ-AUTH-003 | The product must record the target identifier, declared scope, time, page-state description, viewport, locale, browser version, scanner version, rule configuration, and relevant preconditions for every scan. | Must | Proposed | Inspection and deterministic test |
| REQ-AUTH-004 | Any later live-target support must restrict URL schemes, redirects, network destinations, resource use, and browser capabilities according to an approved threat model. | Should | Deferred | Security test before live-target enablement |
| REQ-SCAN-001 | The product must run a versioned deterministic accessibility scanner and preserve its source evidence separately from any model alteration. | Must | Accepted | Deterministic test |
| REQ-SCAN-002 | The product must preserve violations and results requiring manual review. For the first `image-alt` slice it must also retain the one minimal positive same-target observation required to correlate the corrected scan; broader pass and inapplicable retention is deferred until another scenario needs it. | Must | Proposed | Deterministic test |
| REQ-SCAN-003 | A failed or incomplete scan must be labeled as such and must never appear as a successful run with zero findings. | Must | Proposed | Failure-injection test |
| REQ-SCAN-004 | The same controlled target state and pinned configuration must produce repeatable normalized findings; sources of nondeterminism must be recorded. | Must | Proposed | Repeatability evaluation |
| REQ-SCAN-005 | Scanner output must be deterministically allowlisted and sanitized before persistence. The record must identify the policy version and any omitted, transformed, or withheld field categories; a separate detailed redaction artifact is required only when content-bearing evidence is actually transformed or withheld. Unredacted output may exist only transiently unless the accepted data policy explicitly permits protected retention. | Must | Proposed | Privacy and data-integrity test |

## Evidence and provenance

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-EVID-001 | Each scan, finding, evidence item, positive target observation, corpus snapshot, retrieval run, generation run, proposal version, review action, manual check, and comparison must have a stable identifier. | Must | Proposed | Schema inspection |
| REQ-EVID-002 | Each finding must retain one per-finding sanitized source-evidence item containing its scanner rule identifier, result type, stable fixture-element key, affected target locator, minimal rule-allowlisted DOM evidence, sanitization record, and scan provenance. The accepted `image-alt` comparison profile must also retain exactly one separate positive same-target observation from the corrected scan; unrelated passing results remain excluded. | Must | Proposed | Fixture and privacy demonstration |
| REQ-EVID-003 | Persisted source evidence must be immutable while retained. Normalized or human-authored descriptions may be versioned but must not overwrite their source evidence; policy-authorized deletion is governed by REQ-SEC-006 and REQ-SEC-010. | Must | Proposed | Data-integrity and deletion test |
| REQ-EVID-004 | The interface, and any export that is provided, must label page evidence, guidance, model interpretation, and reviewer-authored content as separate layers. | Must | Accepted | Inspection and user review |
| REQ-EVID-005 | Evidence collection must minimize captured page content. Full HTML, screenshots, accessibility trees, or network logs may be retained only when an approved evidence and retention policy requires them. | Must | Proposed | Privacy inspection |
| REQ-EVID-006 | The product must preserve end-to-end lineage from an accepted remediation plan or comparison outcome back to all material inputs and versions. | Must | Proposed | Traceability audit |

## Corpus and retrieval

**Source hierarchy status:** Proposed until OD-004 is accepted.

The first slice proposes a four-artifact W3C guidance corpus that directly supports `image-alt` and WCAG 2.2 SC 1.1.1:

1. Normative [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) text.
2. [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html).
3. [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37).
4. [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67).

WCAG success criteria are the normative accessibility baseline. Understanding documents and Techniques are informative and must not be presented as independent conformance requirements. Versioned axe-core `image-alt` metadata remains deterministic scanner-mapping input carried from Step 2; it is not embedded or presented as guidance from this W3C corpus. ACT Rules, APG material, other success criteria, and broader sources require a demonstrated scenario need and a later corpus decision.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-CORP-001 | The product must retrieve only from an approved source allowlist and an identified, immutable corpus snapshot. | Must | Proposed | Corpus inspection |
| REQ-CORP-002 | Every source must record title, publisher, canonical URL, source type, relevant standard/version, publication or revision date when available, access date, license or usage notes, content checksum, and corpus version. | Must | Proposed | Metadata validation |
| REQ-CORP-003 | Every chunk must retain its exact source locator and derivation lineage; corpus refreshes must create a new version rather than silently changing an existing snapshot. | Must | Proposed | Rebuild and integrity test |
| REQ-CORP-004 | Source conflicts must be surfaced. Normative text takes precedence over informative guidance, while unresolved conflicts require abstention or human review. | Must | Proposed | Evaluation cases |
| REQ-CORP-005 | Corpus normalization, structural segmentation, chunk identity, source locators, and continuation rules must be deterministic and owned by the corpus domain. They must not change because of the embedding model, vector store, generation provider, query, viewport, or request batch size. Model-specific preprocessing must remain inside its adapter and must not rewrite canonical source ranges. | Must | Proposed | Rebuild, cross-adapter, and provenance tests |
| REQ-CORP-006 | The first corpus build must be bounded to the four approved artifacts and must not publish a partial snapshot after validation or indexing failure. Configurable traversal, concurrency, cancellation, and temporary-retention controls are required only if later automated or larger corpus builds introduce those risks. | Must | Proposed | Boundary and failed-build test |
| REQ-RETR-001 | Retrieval must use the finding and its evidence as structured input and return passages with source metadata, locators, relevance data, and corpus version. | Must | Proposed | Retrieval evaluation |
| REQ-RETR-002 | The user must be able to open or inspect the exact passage supporting each material citation. | Must | Accepted | Demonstration |
| REQ-RETR-003 | Retrieval configuration, embedding model/version, index version, filters, the exact privacy-safe query representation or complete immutable inputs and deterministic reconstruction recipe, its integrity digest, and ranked result identifiers must be recorded for an evaluation run. A digest alone is not reproducible. An exact sensitive query may be retained only under the accepted data policy. | Must | Proposed | Trace and privacy inspection |
| REQ-RETR-004 | Missing, weak, or conflicting retrieval support must be visible to generation and must be eligible to trigger abstention. | Must | Accepted | Adversarial evaluation |

Retrieval operation status and guidance-support state are separate. The closed first-slice support states are `supported`, `weak`, `missing`, `conflicting`, and `unassessed`. A `supported` record is eligible for generation. `Missing` and `conflicting` records must abstain without a model call. `Weak` follows a frozen scenario policy; the first `image-alt` policy abstains. `Unassessed` is reserved for evaluation or incomplete adjudication and is never eligible for generation.

## Generated explanations and remediation proposals

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-GEN-001 | Generated output must use a validated discriminated structure whose result type is either **proposal** or **abstention**. A proposal contains the finding summary, evidence references, user-impact explanation, remediation proposal, material citations, evidence sufficiency, assumptions, and required manual checks. | Must | Proposed | Schema test |
| REQ-GEN-002 | Before a proposal enters review, every material guidance claim must reference a resolvable retrieved passage and every scanner-observation claim must reference recorded evidence. Mechanical validation must reject missing or invented references and prohibited claims. The reviewer is the MVP semantic-support authority: an unsupported claim must be removed through edit-and-accept or the proposal must be rejected; if the available inputs cannot support a core conclusion, generation must abstain. | Must | Accepted | Citation validation and reviewer evaluation |
| REQ-GEN-003 | Proposal results must use the categories **high**, **medium**, and **low** for evidence sufficiency. **Abstention** is a separate result type, not a confidence level. The product must not show an uncalibrated model probability as confidence. | Must | Proposed | Inspection and calibration review |
| REQ-GEN-004 | A high rating requires direct support for all material claims. Medium or low ratings must identify assumptions and manual checks. A missing basis for the core conclusion must result in abstention. | Must | Proposed | Evaluation rubric |
| REQ-GEN-005 | The product must distinguish what the scanner observed from what the model inferred and from what a person must verify. | Must | Accepted | User review |
| REQ-GEN-006 | Generated content must not claim certification, legal compliance, whole-page accessibility, or that a finding is fixed solely because automated evidence changed. | Must | Accepted | Prohibited-claim evaluation |
| REQ-GEN-007 | Page content and retrieved content must be treated as untrusted data and must not be allowed to override system rules, invoke tools, or alter the approved workflow. | Must | Proposed | Prompt-injection evaluation |
| REQ-GEN-008 | Model, prompt template, generation parameters, structured-output schema, corpus snapshot, and exact input identifiers must be recorded without exposing hidden model reasoning. | Must | Proposed | Trace inspection |
| REQ-GEN-009 | An abstention result must contain the finding and evidence summary, retrieved support or conflict, missing information, abstention reason, and recommended manual escalation; it must not contain a remediation conclusion. | Must | Proposed | Schema and workflow test |

## Human review and manual checks

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-REV-001 | Every generated remediation proposal must enter a pending-review state and must be approved, edited and accepted, or rejected by a person before it becomes an accepted remediation plan. | Must | Accepted | Workflow demonstration |
| REQ-REV-002 | Review history must preserve the original output, every human edit, decision, actor, timestamp, reason or note, and superseding version. | Must | Proposed | Audit test |
| REQ-REV-003 | Rejected proposals must remain in the audit record but must never appear as accepted remediation plans. | Must | Proposed | Workflow test |
| REQ-REV-004 | Rejection must not silently trigger regeneration or change the corpus. Regeneration, if offered, must be an explicit action that creates a new version linked to the feedback. | Must | Proposed | Workflow test |
| REQ-REV-005 | A manual-check result must reference one immutable check definition and separately record execution status, reviewer, time, and evidence or notes. `pending` has no observed outcome or proposal relationship; `completed` requires an observed outcome and exactly one relationship from `supports`, `contradicts`, or `inconclusive`; `not applicable` requires a rationale and has neither an observed outcome nor a relationship. A post-change result may also reference its later scan and comparison. | Must | Proposed | Workflow demonstration |
| REQ-REV-006 | A blocking manual check is complete only when `completed` with a `supports` relationship, or `not applicable` with a rationale. `contradicts` or `inconclusive` blocks acceptance. The first-slice review has no exception workflow; the proposal must be edited when existing evidence supports the correction or rejected when new evidence or a new blocking check is needed. | Must | Proposed | State-transition test |
| REQ-REV-007 | An abstention may be acknowledged, routed to manual triage, or explicitly retried after inputs change. It must never enter an accepted-remediation-plan state. | Must | Proposed | Workflow test |

## Rescan and comparison

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-COMP-001 | The product must determine whether two scans are comparable by examining target identity, declared state, viewport, browser, scanner, rule set, and other material configuration. | Must | Proposed | Fixture evaluation |
| REQ-COMP-002 | Finding correlation must use a documented strategy that can consider rule identity, semantic element identity, DOM context, and evidence; a CSS selector alone must not be treated as durable identity. | Must | Proposed | Matching evaluation |
| REQ-COMP-003 | The supported outcomes must include **new**, **resolved**, **improved**, **persistent**, **regressed**, **inconclusive**, and **not comparable**, using the scanner-evidence meanings below. Each scenario must define the evidence needed for its applicable outcomes. | Must | Proposed | Gold comparison dataset |
| REQ-COMP-004 | Every outcome must show its matching rationale and before-and-after evidence. Ambiguous matches must be inconclusive rather than forced. | Must | Accepted | User review |
| REQ-COMP-005 | A resolved or improved automated finding must not be translated into a claim that the page, scenario, or site is accessible or conformant. | Must | Accepted | Prohibited-claim evaluation |
| REQ-COMP-006 | Comparison history must retain both source scans and must not overwrite prior review or manual-check results. | Must | Proposed | Data-integrity test |

For the first `image-alt` slice, `resolved`, `persistent`, and inverse-pair `regressed` are the applicable definitive outcomes. `inconclusive` and pair-level `not comparable` remain safe fallbacks. `improved` is deliberately unavailable because this rule has no accepted ordered evidence measure, and `new` is outside the selected one-target demonstration. Later scenarios may activate those outcomes only after defining their required evidence.

Comparison outcomes describe scanner evidence, not accessibility conformance:

| Outcome | Meaning |
| --- | --- |
| New | A finding appears in the later comparable scan, relevant baseline coverage is complete, and no supported or ambiguous baseline correlation exists. |
| Resolved | A baseline finding is not reported later, relevant later coverage is complete, and an accepted unique same-target observation shows that the rule/subject scope was exercised. This means only that the automated finding is no longer reported under the recorded profile; it does not prove that the underlying issue is fixed. |
| Improved | A correlated finding remains, but a scenario-defined evidence measure improves without meeting the resolved condition. |
| Persistent | A correlated finding and its material evidence are unchanged within the scenario's tolerance. |
| Regressed | A correlated finding's scenario-defined evidence worsens, or a uniquely correlated previously non-failing condition becomes reportable. |
| Inconclusive | The scans are generally comparable, but correlation or evidence is too ambiguous for a definitive outcome. |
| Not comparable | Two valid, complete source scans differ in a material target, state, configuration, rule, evidence-semantic, or coverage prerequisite. An invalid source pair instead blocks or fails the comparison operation. |

## Evidence-oriented interface and export

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-UX-001 | The primary interface must provide target setup, scan status, a findings list, an evidence-and-proposal review view, review history, manual checks, and a before-and-after comparison view. | Must | Proposed | Demonstration |
| REQ-UX-002 | Evidence, guidance, AI interpretation, evidence sufficiency, manual work, and human decisions must be recognizable without relying only on color. | Must | Proposed | Accessibility review |
| REQ-UX-003 | The interface must show the analyzed target, scan configuration, supported scenario coverage, and non-certification limitation at the point where results are interpreted. | Must | Accepted | User review |
| REQ-UX-004 | Pipeline states must distinguish scanning, retrieval, generation, awaiting review, incomplete manual checks, failure, abstention, and completion. | Must | Proposed | Workflow demonstration |
| REQ-UX-005 | Errors must identify the failed stage and provide a safe restart or retry without overwriting completed evidence or reviewed work. Resume and active cancellation are required only for a later stage that introduces resumable or long-running work. | Must | Proposed | Failure-injection test |
| REQ-UX-006 | Search, filtering, and sorting by scan, rule, review state, comparison outcome, and evidence sufficiency should be supported once the initial dataset makes them necessary. | Should | Proposed | User evaluation |
| REQ-UX-007 | The MVP should export a schema-versioned JSON evidence record and an accessible human-readable report containing provenance, review state, citations, comparison scope, and limitations. | Should | Proposed | Export validation |
| REQ-UX-008 | Opening or closing settings, provider, runtime, or model-management views must be side-effect free. Inspection alone must not probe hardware, start a service, download or activate an artifact, change a selected provider, transmit data, or mutate durable state; each such action requires an explicit control and visible outcome. | Must | Proposed | Side-effect and network tests |
| REQ-UX-009 | Progress and readiness interfaces must report measured bytes or completed stages when those facts are available and must not fabricate percentages, countdowns, or completion estimates for opaque work. Passive updates must preserve keyboard focus, and validation must verify the state perceived through text and assistive technology rather than DOM presence alone. | Must | Proposed | Progress, focus, and screen-reader tests |

## Documentation navigation

- [Workflow-step technical assessments](#workflow-step-technical-assessments)
- [Architecture index](../architecture/README.md)
- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
