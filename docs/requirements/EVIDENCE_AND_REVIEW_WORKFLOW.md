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

The closed first-slice scenario set contains the `informative-image-alt`, `form-input-label`, and `text-contrast` scenarios Accepted through [OD-019](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#resolved-decisions-for-the-first-portfolio-slice). Later decisions accept the bounded W3C source pack, evidence-sufficiency gate, minimal target correlation, fixed evaluation manifest, record-validation boundary, and manual structural segmentation described below. Those decisions do not accept a Proposed retention detail, implementation dependency, or release-support claim. One operation processes one selected fixture revision, one scenario profile, one axe-core rule, one target finding or positive observation, one proposal, one review decision, and one comparison entry at a time. Adjacent steps may later execute in the same TypeScript process:

| From | To | Minimum handoff |
| --- | --- | --- |
| Scan | Evidence capture | One transient in-memory native axe result plus scan execution and coverage metadata; no durable or normalized evidence is created by the scan step. |
| Evidence capture | Retrieval | One eligible scan record, one finding, its per-finding sanitized source evidence, normalized projection, exact rule metadata, and approved scenario mapping. |
| Retrieval | Generation | One completed retrieval record containing the exact privacy-safe query representation, corpus snapshot, ranked passages, citation metadata, and support state. |
| Generation | Review | One structurally valid, clearly AI-generated proposal with inspectable references, or one deterministic application abstention with its manual-review direction. Mechanical validation does not replace the reviewer's semantic judgment. |
| Review | Comparison | The immutable review action, accepted plan when one exists, reusable manual-check definitions, and any completed result occurrences; none is automated proof. |
| Rescan | Comparison | One comparable scan pair, the same-target evidence and any rule-specific measured values required by the selected scenario profile, and one identified finding-comparison entry. |

### First-slice eligibility gates

| Gate | Minimum rule |
| --- | --- |
| Retrieval → generation | Only a completed retrieval record with `supported` guidance may invoke the model. `incomplete`, `missing`, or `conflicting` guidance leaves the deterministic finding visible and produces an abstention with a manual-review direction without a model call. A failed retrieval also leaves the finding visible but has no guidance-support conclusion. |
| Generation → proposal review | Only the `proposal` branch with valid structure, resolvable supplied references, and no prohibited claim enters `pending_review`. An abstention follows its separate acknowledgement or manual-triage path. Semantic support remains a reviewer decision, not a model or string-matching decision. |
| Proposal → accepted remediation plan | Every material claim and remediation step must be confirmed by the reviewer as supported within the displayed evidence and guidance, and every blocking manual check must satisfy REQ-REV-006. Otherwise the reviewer must edit from the same support or reject. |
| Scan pair → finding comparison | The pair must match the accepted scenario and fixture identity, browser/viewport/locale, scanner and rule profile, measurement profile when applicable, and relevant coverage. Each scan must match its own declared baseline or later state role and a profile-permitted transition; the two roles and fixture revisions may intentionally differ. The same stable fixture-target key must appear in finding plus per-finding source evidence for each failing side and in a positive target observation for each non-failing side. Material mismatch is `not comparable`, while invalid or incomplete source scans fail the comparison stage and enclosing workflow operation. |

## Target authorization and scanning

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-AUTH-001 | Before the project-owned fixture is scanned, the user must explicitly confirm the fixture ID and that the run is limited to that local synthetic fixture. The scan record must retain the attestation time and scope; no legal-ownership workflow or credential is required for this slice. | Must | Accepted | Demonstration |
| REQ-AUTH-002 | The MVP must accept only a selected project-owned synthetic controlled fixture revision and must not accept a live target or arbitrary URL, crawl links, discover additional targets, or contain a crawler implementation. Live-target work requires a later explicit scope decision and the gated requirements for that distinct capability. | Must | Accepted | Deterministic test and scope inspection |
| REQ-AUTH-003 | The product must record the scenario identifier, fixture and revision identifiers, target identifier, declared scope, time, page-state description, viewport, locale, browser version, scanner version, exact rule configuration, and relevant preconditions for every scan. | Must | Proposed | Inspection and deterministic test |
| REQ-AUTH-004 | Any later live-target support must restrict URL schemes, redirects, network destinations, resource use, and browser capabilities according to an approved threat model. | Should | Deferred | Security test before live-target enablement |
| REQ-SCAN-001 | The product must run a versioned deterministic accessibility scanner and preserve its source evidence separately from any model alteration. | Must | Accepted | Deterministic test |
| REQ-SCAN-002 | The product must preserve violations and results requiring manual review. For each first-slice scenario it must also retain exactly the minimal positive same-target observation and rule-specific scanner-emitted values required to correlate the corrected scan; unrelated passes and inapplicable results remain excluded. | Must | Proposed | Deterministic test |
| REQ-SCAN-003 | A failed or incomplete scan must be labeled as such and must never appear as a successful run with zero findings. | Must | Proposed | Failure-injection test |
| REQ-SCAN-004 | Before evaluation, each scenario's failing and corrected content, expected native rule result, stable fixture-target key, viewport/browser profile, and scanner/rule profile must be frozen in a versioned manifest. A change creates a new manifest version rather than silently changing an evaluated case. | Must | Accepted | Manifest inspection |
| REQ-SCAN-005 | Scanner output must be deterministically allowlisted and sanitized before persistence. The record must identify the policy version and any omitted, transformed, or withheld field categories; a separate detailed redaction artifact is required only when content-bearing evidence is actually transformed or withheld. Unredacted output may exist only transiently unless the accepted data policy explicitly permits protected retention. | Must | Proposed | Privacy and data-integrity test |

## Evidence and provenance

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-EVID-001 | Each scan, finding, evidence item, positive target observation, corpus snapshot, retrieval run, generation run, proposal version, review action, manual check, and comparison must have a stable identifier. | Must | Proposed | Schema inspection |
| REQ-EVID-002 | Each retained finding or corrected-state evidence record must carry its scenario ID, scanner-rule ID, fixture revision and state role, stable fixture-target key, native result type, and only the minimized rule evidence and scanner-emitted values needed for that scenario. A locator or selector may support inspection but is not identity. This Accepted identity and minimization boundary does not select the exact Proposed positive-observation shape or field allowlist owned by REQ-SCAN-002. | Must | Accepted | Fixture, identity, and privacy demonstration |
| REQ-EVID-003 | Persisted source evidence must be immutable while retained. Normalized or human-authored descriptions may be versioned but must not overwrite their source evidence; MVP run deletion is governed by REQ-SEC-006. Deferred tombstones, ledgers, and recoverable deletion history remain governed separately by REQ-SEC-010. | Must | Proposed | Data-integrity and deletion test |
| REQ-EVID-004 | The interface, and any export that is provided, must label page evidence, guidance, model interpretation, and reviewer-authored content as separate layers. | Must | Accepted | Inspection and user review |
| REQ-EVID-005 | The synthetic-only MVP must minimize page evidence and must not retain full HTML, screenshots, accessibility trees, browser traces, cookies, credentials, entered values, arbitrary DOM snapshots, network logs, or private URLs. Only evidence permitted by the applicable minimized-evidence policy may cross the durable boundary; the exact rule-specific field allowlist remains Proposed under REQ-SCAN-002 and REQ-SCAN-005. | Must | Accepted | Privacy and negative-content inspection |
| REQ-EVID-006 | The product must preserve end-to-end lineage from an accepted remediation plan or comparison outcome back to all material inputs and versions. | Must | Proposed | Traceability audit |

### First-slice scenario profiles

OD-019 accepts the three project-owned synthetic scenario identities, rule/WCAG mappings, failing/corrected-state obligation, one-profile-at-a-time boundary, deterministic contrast-measurement retention, high-level distinction between native non-failing `resolved` and possible still-failing `improved`, and the stated target/coverage/crawler exclusions.

OD-003 accepts a controlled manifest with exactly six **logical fixture revisions**: one failing and one corrected revision for each of the three scenarios. This does not require six projects, pages, or physical files; physical fixture layout remains an implementation detail. Before any evaluation result is observed, the manifest must freeze each revision's project-owned content, expected native axe result, stable fixture-target key, and browser/rule profile. The accepted evidence, source-pack, sufficiency, and correlation boundaries below remain independent of Proposed field names, storage layout, prompt wording, and technology candidates.

The table combines those Accepted scope boundaries with planning-level Proposed detail. Exact fixture literals, rule-specific field allowlists, corrected positive-observation shapes, manual-check wording, and comparison calculations remain Proposed under their identified requirement rows and candidate assessments; the table does not silently accept them.

| Scenario | Controlled failing and corrected states | Minimum deterministic evidence | Minimum curated guidance | Model and human boundary | Conservative comparison |
| --- | --- | --- | --- | --- | --- |
| `informative-image-alt` | Failing: one known informative `img` lacks an `alt` attribute. Corrected: the same keyed image has a context-appropriate alternative confirmed by the reviewer. | Native `image-alt` result bucket and check metadata, stable fixture-target key and locator, element kind, bounded sanitized `img`/`alt` state, exact rule/profile provenance, and one corrected-state same-target positive observation. | The normative SC 1.1.1 section, Understanding SC 1.1.1, H37, and H67 from the accepted pack below. | The model may explain the observed missing text alternative and propose conditional informative, functional, or decorative treatments from retrieved guidance. A person must determine the image's purpose in context and whether the final alternative conveys the needed information. | `resolved`, `persistent`, inverse-pair `regressed`, `inconclusive`, or pair-level `not comparable`. No ordered evidence measure exists, so `improved` is unavailable. |
| `form-input-label` | Failing: one known input has no programmatically associated non-empty accessible name. Corrected: the same keyed input uses an explicit visible `label` associated by matching `for` and `id` values. | Native `label` result bucket and check metadata, stable fixture-target key and locator, input type, bounded sanitized input/label association facts, exact rule/profile provenance, and one corrected-state same-target positive observation. | The normative SC 4.1.2 section, Understanding SC 4.1.2, and H44 from the accepted pack below. | The model may explain the observed missing programmatic name and propose the explicit visible-label association used by the controlled correction. A person must judge whether the visible label is clear and accurately describes the control's purpose and whether additional instructions are needed. | `resolved`, `persistent`, inverse-pair `regressed`, `inconclusive`, or pair-level `not comparable`. The binary profile has no `improved` outcome. |
| `text-contrast` | Failing: one known normal-text target is rendered as `#888888` on `#ffffff`. Corrected: the same keyed target is rendered as `#767676` on `#ffffff` and is recorded by the native scanner as non-failing. | Native `color-contrast` result bucket and check metadata, stable fixture-target key and locator, raw scanner-emitted measured ratio, expected-ratio string, foreground and background colors, font size and weight, a deterministically parsed expected-ratio numeric component, exact render/rule/normalization provenance, and the same fields in the corrected-state positive observation. | The normative SC 1.4.3 section, Understanding SC 1.4.3, and G18 from the accepted pack below. | The model may explain the measured shortfall and propose adjusting a foreground/background token while preserving the recorded assumptions. A person must verify the applicable text classification and exceptions, visual and brand context, and relevant interaction states not represented by the controlled target. | Native failing/non-failing status determines `resolved`. For a correlated still-failing pair, the ordered measure is the **contrast margin**: retained emitted numeric measured ratio minus the validated numeric component of the retained emitted expected-ratio string, using their recorded precision without recomputing the native bucket. A strictly higher later margin is `improved`; an equal margin is `persistent`; a lower margin is `regressed`. Missing or non-comparable measurement facts are `inconclusive` or pair-level `not comparable`. |

The mappings are deliberately narrow: axe-core [`image-alt`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json) maps this scenario to [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content), axe-core [`label`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json) maps this scenario to [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value), and axe-core [`color-contrast`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json) maps this scenario to [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum). The `label` rule metadata does not directly map that automated rule to SC 3.3.2 or SC 1.3.1. In every scenario, an automated finding is evidence about the selected rule and target under the recorded profile; it is not proof of complete success-criterion, page, or site non-conformance.

## Corpus and retrieval

**Source-pack decision:** Accepted through OD-004, subject to the W3C/WAI use conditions and artifact-specific attribution and status records described below. This decision selects the bounded sources; it does not authorize acquisition or implementation.

The first slice uses one bounded eight-artifact W3C guidance pack shared by the three scenarios:

1. Normative [WCAG 2.2 Recommendation dated 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) text, manually segmented to preserve the exact SC 1.1.1, SC 4.1.2, and SC 1.4.3 identities and needed definitions.
2. [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html).
3. [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37).
4. [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67).
5. [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html).
6. [Technique H44](https://www.w3.org/WAI/WCAG22/Techniques/html/H44) for the controlled explicit `label` association.
7. [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
8. [Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18).

WCAG success criteria are the normative accessibility baseline. Understanding documents and Techniques are informative and must not be presented as independent conformance requirements. A technique's applicability to multiple criteria does not expand the deliberately narrow axe-rule mappings recorded above. Versioned axe-core rule metadata remains deterministic scanner-mapping input carried from Step 2; it is not embedded or presented as guidance from this W3C corpus. ACT Rules, APG material, other success criteria, and broader sources require a demonstrated scenario need and a later corpus decision.

Use of the selected material must follow WAI's [Using WAI Material](https://www.w3.org/WAI/about/using-wai-material/) guidance and the applicable [W3C Document License](https://www.w3.org/copyright/document-license-2023/). For every selected artifact, the future corpus manifest must record its exact URL, publisher, normative or informative status, snapshot or version identity, access date, copyright/attribution notice, license or use-condition URI, and modification/derivation notes. Public availability does not waive these obligations or imply W3C endorsement. No corpus directory, download, copied source text, or derived passage is created during planning; after development is explicitly authorized, implementation may acquire only these approved sources under the recorded conditions.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-CORP-001 | The product must retrieve only from the accepted eight-artifact source manifest and an identified immutable corpus snapshot. | Must | Accepted | Corpus inspection |
| REQ-CORP-002 | Every source must record title, publisher, exact and canonical URLs, source type and status, relevant standard/version or dated snapshot, publication or revision date when available, access date, copyright/attribution notice, license or use-condition URI, modification notes, content checksum, and corpus version. | Must | Accepted | Metadata validation |
| REQ-CORP-003 | Every passage must retain its exact heading/section locator and derivation lineage; a source or segmentation change must create a new version rather than silently changing an existing snapshot. | Must | Accepted | Rebuild and integrity test |
| REQ-CORP-004 | Source conflicts must be surfaced. Normative text takes precedence over informative guidance, while an unresolved material conflict makes guidance `conflicting` and requires abstention with a manual-review direction. | Must | Accepted | Evaluation cases |
| REQ-CORP-005 | Passage selection and segmentation must be manual, deterministic, and heading-aware, preserving success-criterion, Understanding-section, and Technique identity plus exact URLs and headings. The embedding adapter may vectorize selected passage text but must not select, split, overlap, merge, or rewrite canonical passages. | Must | Accepted | Rebuild and provenance inspection |
| REQ-CORP-006 | The first corpus build must remain closed to the eight accepted artifacts, use no crawling or recursive loader, and occur only after development and source acquisition are authorized. A failed validation or index build must not be represented as a usable snapshot. | Must | Accepted | Boundary and failed-build test |
| REQ-RETR-001 | Retrieval must use the finding and its minimized evidence as structured input and return passages with source metadata, locators, relevance data, corpus version, and visible support state. | Must | Accepted | Retrieval evaluation |
| REQ-RETR-002 | The user must be able to open or inspect the exact passage supporting each material citation. | Must | Accepted | Demonstration |
| REQ-RETR-003 | An evaluation run must record the corpus/index identity, embedding configuration, filters, exact privacy-safe query representation, ranked passage identifiers and metrics, support rule, and result. Future TypeScript record definitions must be runtime-validated at the retrieval and persisted-JSON boundaries; a digest alone is not reproducible, and no JSON-Schema/code-generation framework is required for the MVP. | Must | Accepted | Trace, boundary, and privacy inspection |
| REQ-RETR-004 | A deterministic finding must remain visible regardless of retrieval outcome. Only a completed `supported` result is proposal-eligible; `incomplete`, `missing`, or `conflicting` support must produce abstention and a manual-review direction without calling the model. | Must | Accepted | Adversarial evaluation |

The enclosing workflow-operation state, retrieval-stage disposition, and guidance-support state are separate. The closed first-slice support states are `supported`, `incomplete`, `missing`, and `conflicting`. Only a successfully validated retrieval-stage result with `supported` guidance is eligible for generation while the workflow remains `running`. Every other support state preserves the finding and produces a deterministic abstention/manual-review handoff without a model call. A retrieval-stage error fails the workflow operation, has no support state, and must not be misreported as missing guidance.

## Generated explanations and remediation proposals

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-GEN-001 | The application generation-stage output must use a validated discriminated structure whose result type is either **proposal** or deterministic **abstention**. A proposal contains the finding summary, evidence references, user-impact explanation, remediation proposal, material citations, evidence sufficiency, assumptions, and required manual checks. An evidence-sufficiency abstention is application-authored before provider invocation. | Must | Proposed | Schema test |
| REQ-GEN-002 | Before a proposal enters review, every material guidance claim must reference a resolvable retrieved passage and every scanner-observation claim must reference recorded evidence. Mechanical validation must reject missing or invented references and prohibited claims. The reviewer is the MVP semantic-support authority: an unsupported claim must be removed through edit-and-accept or the proposal must be rejected; if the available inputs cannot support a core conclusion, generation must abstain. | Must | Accepted | Citation validation and reviewer evaluation |
| REQ-GEN-003 | A proposal may be generated only from complete required finding evidence and a completed `supported` retrieval. Its separate model-confidence label must use the categories **high**, **medium**, or **low** with stated uncertainty; the product must not display an uncalibrated model probability. **Abstention** is a separate result type, not a confidence level. | Must | Accepted | Eligibility, structure, and labeling review |
| REQ-GEN-004 | Confidence describes the bounded model interpretation, not evidence sufficiency or accessibility status. Every confidence level must preserve assumptions and required manual checks; medium or low confidence must state the material uncertainty. Missing, incomplete, or conflicting core evidence or guidance must block the model call and produce abstention under REQ-RETR-004. | Must | Accepted | Evaluation rubric |
| REQ-GEN-005 | The product must distinguish what the scanner observed from what the model inferred and from what a person must verify. | Must | Accepted | User review |
| REQ-GEN-006 | Generated content must not claim certification, legal compliance, whole-page accessibility, complete success-criterion conformance or non-conformance, or that a finding is fixed solely because automated evidence changed. | Must | Accepted | Prohibited-claim evaluation |
| REQ-GEN-007 | Page content and retrieved content must be treated as untrusted data and must not be allowed to override system rules, invoke tools, or alter the approved workflow. | Must | Proposed | Prompt-injection evaluation |
| REQ-GEN-008 | Model, prompt template, generation parameters, structured-output schema, corpus snapshot, and exact input identifiers must be recorded without exposing hidden model reasoning. | Must | Proposed | Trace inspection |
| REQ-GEN-009 | An abstention result must contain the finding and evidence summary, retrieved support or conflict, missing information, abstention reason, and recommended manual escalation; it must not contain a remediation conclusion. | Must | Proposed | Schema and workflow test |

## Human review and manual checks

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-REV-001 | Every generated remediation proposal must enter a pending-review state and must be approved, edited and accepted, or rejected by a person before it becomes an accepted remediation plan. | Must | Accepted | Workflow demonstration |
| REQ-REV-002 | Review history must preserve the original output, every human edit, decision, actor, timestamp, reason or note, and superseding version. | Must | Proposed | Audit test |
| REQ-REV-003 | Rejected proposals must remain in the audit record but must never appear as accepted remediation plans. | Must | Proposed | Workflow test |
| REQ-REV-004 | Rejection must not silently trigger regeneration or change the corpus. Regeneration, if later offered, must be an explicit action that creates a new workflow run and proposal version linked to the prior feedback without overwriting either record. | Must | Proposed | Workflow test |
| REQ-REV-005 | A manual-check result must reference one immutable check definition and separately record execution status, reviewer, time, and evidence or notes. `pending` has no observed outcome or proposal relationship; `completed` requires an observed outcome and exactly one relationship from `supports`, `contradicts`, or `inconclusive`; `not applicable` requires a rationale and has neither an observed outcome nor a relationship. A post-change result may also reference its later scan and comparison. | Must | Proposed | Workflow demonstration |
| REQ-REV-006 | A blocking manual check is complete only when `completed` with a `supports` relationship, or `not applicable` with a rationale. `contradicts` or `inconclusive` blocks acceptance. The first-slice review has no exception workflow; the proposal must be edited when existing evidence supports the correction or rejected when new evidence or a new blocking check is needed. | Must | Proposed | State-transition test |
| REQ-REV-007 | An abstention may be acknowledged, routed to manual triage, or explicitly retried in a new workflow run after inputs change. It must never enter an accepted-remediation-plan state. | Must | Proposed | Workflow test |

## Rescan and comparison

OD-008 accepts only the minimal first-slice target-correlation identity in REQ-COMP-002. It does not accept general DOM fingerprinting, full HTML or virtual-DOM snapshots, or a forced match when the controlled keys and evidence are insufficient.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-COMP-001 | The product must determine whether two scans are comparable by examining scenario/profile, target and fixture-family identity, whether each revision and declared state is valid for its assigned baseline/later role and permitted transition, viewport, browser, scanner, exact rule, measurement profile when applicable, and other material configuration. The two revision identities and state roles need not be equal. | Must | Proposed | Fixture evaluation |
| REQ-COMP-002 | First-slice target correlation must use the scenario ID, exact rule ID, stable fixture-target key, fixture revision/state role, and minimized rule evidence. A selector or locator may support inspection but must not replace the stable project-owned key. Missing or ambiguous identity must produce `inconclusive` or pair-level `not comparable`, never a forced match. | Must | Accepted | Matching evaluation |
| REQ-COMP-003 | The first-slice supported outcomes must include **resolved**, **improved**, **persistent**, **regressed**, **inconclusive**, and **not comparable** where applicable to the selected scenario, using the scanner-evidence meanings below. **New** is deferred because each selected demonstration compares one known stable target and does not discover findings. | Must | Proposed | Gold comparison dataset |
| REQ-COMP-004 | Every outcome must show its matching rationale and before-and-after evidence. Ambiguous matches must be inconclusive rather than forced. | Must | Accepted | User review |
| REQ-COMP-005 | A resolved or improved automated finding must not be translated into a claim that the page, scenario, or site is accessible or conformant. | Must | Accepted | Prohibited-claim evaluation |
| REQ-COMP-006 | Comparison history must retain both source scans and must not overwrite prior review or manual-check results. | Must | Proposed | Data-integrity test |

For the binary `informative-image-alt` and `form-input-label` profiles, `resolved`, `persistent`, and inverse-pair `regressed` are the applicable definitive outcomes; neither profile may report `improved`. Any determinate same-target violation-to-violation transition in a binary profile is `persistent`, with its evidence delta recorded but not interpreted as improvement. The `text-contrast` profile adds the ordered contrast margin defined above. Native result status takes precedence: a comparable failing-to-non-failing transition with the required positive target observation is `resolved`, not merely `improved`. Only a correlated pair that remains natively failing and has a strictly higher later contrast margin is `improved`. `Inconclusive` and pair-level `not comparable` remain safe fallbacks for every profile, while `new` is deferred and unsupported in each selected one-target first-slice demonstration.

Comparison outcomes describe scanner evidence, not accessibility conformance:

| Outcome | Meaning |
| --- | --- |
| New (Deferred) | A possible later product-wide outcome for a finding that first appears in a comparable later scan. The controlled first slice performs no finding discovery and must not emit this outcome. |
| Resolved | A baseline finding is not reported later, relevant later coverage is complete, and an accepted unique same-target observation shows that the rule/subject scope was exercised. This means only that the automated finding is no longer reported under the recorded profile; it does not prove that the underlying issue is fixed. |
| Improved | A correlated `text-contrast` finding remains natively failing, but its later margin between the retained numeric measured ratio and validated numeric component of the retained expected-ratio string is strictly higher under an otherwise comparable profile. This outcome is unavailable to the two binary profiles. |
| Persistent | A correlated finding remains reportable in both scans and the scenario supplies no worsening or improvement classification. For either binary profile, every determinate same-target violation-to-violation transition is persistent and any evidence delta remains visible. For contrast, two determinate violations are persistent only when their retained margins are equal. |
| Regressed | A correlated finding's scenario-defined evidence worsens, or a uniquely correlated previously non-failing condition becomes reportable. |
| Inconclusive | The scans are generally comparable, but correlation or evidence is too ambiguous for a definitive outcome. |
| Not comparable | Two valid, complete source scans differ in a material target, state, configuration, rule, evidence-semantic, or coverage prerequisite. An invalid source pair instead fails the comparison stage and enclosing workflow operation. |

## Evidence-oriented interface and export

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-UX-001 | The primary interface must provide controlled-scenario selection, scan status, the selected finding and evidence, one proposal-or-abstention review view, the applicable review decision and manual checks, and one baseline/later comparison view. A bulk findings list or generic finding-management interface is not required. | Must | Accepted | Demonstration |
| REQ-UX-002 | Evidence, guidance, AI interpretation, evidence sufficiency, manual work, and human decisions must be recognizable without relying only on color. | Must | Proposed | Accessibility review |
| REQ-UX-003 | The interface must show the analyzed target, scan configuration, supported scenario coverage, and non-certification limitation at the point where results are interpreted. | Must | Accepted | User review |
| REQ-UX-004 | Pipeline states must distinguish scanning, retrieval, generation, awaiting review, incomplete manual checks, failure, abstention, and completion. | Must | Proposed | Workflow demonstration |
| REQ-UX-005 | Errors must identify the failed stage and provide an explicit safe retry as a new workflow run without overwriting completed evidence or reviewed work. Resume and active cancellation are required only for a later stage that introduces resumable or long-running work. | Must | Proposed | Failure-injection test |
| REQ-UX-006 | Search, bulk filtering, sorting, and generic finding management are Deferred until a larger accepted dataset demonstrates a need. | Could | Deferred | Later scope decision |
| REQ-UX-007 | General export is Deferred. The local service may derive an optional human-readable Markdown report from canonical run JSON, but the report is not a separate source of truth and no export service or tracker integration is required. | Could | Deferred | Later export decision |
| REQ-UX-008 | Opening or closing settings, provider, runtime, or model-management views must be side-effect free. Inspection alone must not probe hardware, start a service, download or activate an artifact, change a selected provider, transmit data, or mutate durable state; each such action requires an explicit control and visible outcome. | Must | Proposed | Side-effect and network tests |
| REQ-UX-009 | Progress and readiness interfaces must report measured bytes or validated stage results when those facts are available and must not fabricate percentages, countdowns, or completion estimates for opaque work. Internal stage results are not separate workflow-operation states. Passive updates must preserve keyboard focus, and validation must verify the state perceived through text and assistive technology rather than DOM presence alone. | Must | Proposed | Progress, focus, and screen-reader tests |

## Documentation navigation

- [Workflow-step technical assessments](#workflow-step-technical-assessments)
- [Architecture index](../architecture/README.md)
- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
