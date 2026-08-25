# Evaluation and acceptance requirements

## Authority and use

This document is a focused canonical module within [Evaluation and release requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Decision history

OD-009 was resolved on 2026-08-25. It replaces the earlier Proposed 9–12-case pilot and formal qualification direction with the Accepted compact, fixed, non-promotable MVP manifest below. The manifest demonstrates integration; it does not produce statistical evidence, a provider leaderboard, a support matrix, a release qualification, or a generalized product-quality claim.

OD-017 defers the formal qualification and release requirements that were previously Proposed. Their stable IDs remain below so that the planning history is explicit.

## Evaluation requirements

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-EVAL-001 | The fixed MVP manifest must contain one happy structured-generation case for each of the three accepted scenarios in local mode and the same three cases in Groq mode: six generation executions total. Scenario-owned deterministic scan, evidence, retrieval, abstention, review-transition, and comparison checks run once and are not duplicated per generation provider. | Must | Accepted | Manifest inspection |
| REQ-EVAL-002 | Scanner fidelity, evidence completeness, retrieval relevance, citation validity and support, generated-answer groundedness, remediation usefulness, abstention, review transitions, comparison accuracy, and prohibited claims must be evaluated as distinct observations. | Must | Accepted | Fixed-case report inspection |
| REQ-EVAL-003 | Each scenario must map its deterministic finding and minimized evidence to at least one directly supporting passage in the accepted curated corpus. Gold passage IDs and locators are fixed before model output is observed. | Must | Accepted | Gold-passage mapping inspection |
| REQ-EVAL-004 | Each recorded case must identify its exact scenario/fixture state, rule/scan profile, corpus snapshot, retrieval configuration, prompt/output contract, provider mode, and selected model/runtime configuration, while keeping traces local and content-safe. | Must | Accepted | Case-provenance inspection |
| REQ-EVAL-005 | A material change to a fixture's controlled content or expected rule result, scanner/rule profile, corpus snapshot, retrieval configuration, prompt/output contract, provider adapter, model configuration, or comparison rule must rerun the affected fixed cases. It creates new evidence and does not rewrite the prior result. | Must | Accepted | Change-to-case traceability inspection |
| REQ-EVAL-006 | The manifest uses one capacity-screened local evaluation candidate and the one exact Groq model selected by the provider decision. Their inclusion validates only the bounded portfolio paths; it does not promote either model, runtime, scanner, retrieval component, or provider to a release-qualified dependency. | Must | Accepted | Candidate/status wording inspection |
| REQ-EVAL-007 | The fixed case inputs, expected deterministic outcomes, acceptable supporting passages, proposal rubric, prohibited claims, and failure interpretation must be frozen before either model's output is reviewed. One reviewer may apply the compact rubric. Statistical confidence, percentages inferred from the small set, multiple reviewers, inter-rater agreement, severity weighting, and broader stratification are excluded. | Must | Accepted | Pre-execution manifest freeze inspection |
| REQ-EVAL-008 | Each provider's three happy cases must return the same application-owned structured proposal contract and pass runtime validation. An invalid or failed response fails that case; it must not trigger automatic fallback. The evidence-sufficiency abstention check is deterministic, occurs before provider invocation, and therefore runs once rather than once per provider. | Must | Accepted | Structured-result, abstention, and no-fallback inspection |
| REQ-EVAL-009 | Local and Groq results must be reported in separate sections against the same three happy case definitions. The report may confirm that each path completed and record its limitations, but it must not rank providers, aggregate them into one score, or claim comparative model quality. | Must | Accepted | Non-comparative report inspection |
| REQ-EVAL-010 | A formal versioned qualification authority with candidate promotion, statistical gates, immutable official-run governance, and generalized interpretation policy is deferred until the project intends to make a support or release claim. | Could | Deferred | Later qualification decision |
| REQ-EVAL-011 | Formal qualification states, conjunctive release gates, multi-reviewer adjudication, and support-selection rules are deferred. A fixed MVP case records only completion/failure and its separate bounded observations. | Could | Deferred | Later qualification decision |
| REQ-EVAL-012 | Release-grade provenance binding full artifact digests, package locks, complete hardware profiles, signed evidence, and qualification authorities is deferred. The minimal MVP provenance required by `REQ-EVAL-004` remains Accepted. | Could | Deferred | Packaging or release decision |
| REQ-EVAL-013 | Provider-profile support qualification, availability commitments, cost qualification, installer inclusion, and signed public publication are deferred and remain separate future decisions. Success in the compact manifest must not imply any of them. | Could | Deferred | Provider support or release decision |

## Accepted fixed MVP manifest

The manifest is deliberately small and must be frozen before model outputs are inspected:

| Manifest group | Fixed content | Execution count or rule |
| --- | --- | --- |
| Scenario definitions | `informative-image-alt`, `form-input-label`, and `text-contrast`, each with its controlled failing state, corrected state, expected exact-rule result, stable target key, browser/rule profile, gold guidance passage, and required manual judgment | Three logical scenarios; physical fixture-file layout is an implementation detail |
| Local happy generation | One evidence-sufficient failing-state package per scenario, using the selected capacity-screened local configuration | Three executions |
| Groq happy generation | The same three evidence-sufficient packages and the same application-owned output contract, using the one selected Groq model | Three executions |
| Evidence-sufficiency abstention | One deliberately missing, incomplete, or conflicting guidance package that leaves the finding visible and blocks provider invocation | Run once; provider-independent |
| Deterministic scan and retrieval | Each scenario's failing/corrected expected exact-rule results, required minimized evidence, and gold passage retrieval | Run once per scenario definition; provider-independent |
| Human review semantics | `approve`, `edit`, and `reject`, including preservation of the original proposal and decision timestamp | One compact transition set; not duplicated per provider |
| Deterministic comparison | Each scenario's failing-to-corrected `resolved` check; contrast `improved` using its ordered measure; and representative `persistent`, `regressed`, and `inconclusive` behavior required by the comparison authority | Run once per owned deterministic check; provider-independent |

Freezing means that controlled content, expected scanner outcome, stable target key, scan profile, gold passage, input package, structured-output contract, and rubric are recorded before generation results. It does not require six fixture projects or files.

## Accepted MVP evaluation criteria

- Every one of the six happy generation executions either returns a runtime-validated structured proposal or is recorded as a failed case; no failure is hidden by fallback.
- Every displayed material proposal claim is traceable to the retained deterministic evidence and an exact retrieved passage. Every displayed citation resolves to its recorded corpus snapshot and directly supports the associated claim.
- Every proposal keeps deterministic evidence, retrieved guidance, model interpretation, confidence/uncertainty, assumptions, and required manual checks distinguishable.
- The deliberately insufficient case leaves the deterministic finding visible, records abstention and its reason, and requires manual review without invoking a model.
- Review checks preserve the original model proposal and record the one reviewer's action, edits or rejection feedback, and timestamp. A reviewer decision is feedback, not automatic ground truth.
- Comparison checks apply only the accepted scenario rules. Absence of an automated finding does not prove complete conformance or accessibility; insufficient or mismatched evidence remains `inconclusive`.
- The local happy cases complete sequentially on the reference PC without out-of-memory failure or an unusable single-reviewer interface, and the report records observed limitations. This is practical capacity evidence only, not a latency, thermal, performance, or support claim.
- No generated, displayed, or reported text claims certification, legal compliance, whole-page or whole-site accessibility, or complete success-criterion conformance or non-conformance.
- Local and Groq sections state their limitations separately. No score, ranking, statistical inference, leaderboard, or generalized provider/model conclusion is calculated from this manifest.

## Proposed planning-level MVP behavioral specification

**Status: Proposed derived planning specification.** This section consolidates the smallest complete behavior needed to exercise the Accepted three-scenario portfolio scope and fixed evaluation manifest. It is a traceability view over the authoritative [product scope](../PRODUCT_SCOPE_AND_GLOSSARY.md), [evidence and review workflow](../EVIDENCE_AND_REVIEW_WORKFLOW.md), [provider requirements](../generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md), [information lifecycle](../INFORMATION_AND_WORKFLOW_LIFECYCLE.md), and [privacy and security requirements](../quality-security-and-operations/PRIVACY_AND_SECURITY.md). It creates no requirement or decision, changes no recorded status, and cannot override those authorities.

The `BHV-*` labels below identify documentation examples only; they are not requirement IDs, test-case IDs, or executable Gherkin. The Given/When/Then wording is human-readable planning notation contained in this Markdown file. No `.feature` file, test, fixture, schema, source code, dependency, or implementation scaffold is authorized or created. A behavior that relies on a Proposed requirement remains Proposed even when summarized here.

### Shared behavioral frame

| Concern | Smallest MVP behavior | Governing status |
| --- | --- | --- |
| Work unit | One local user selects one of the three project-owned scenario profiles, one declared failing or corrected revision, its one rule, and one stable intended target. One operation is current at a time. | Scenario set and single-operation boundary Accepted; exact fixture literals and physical layout remain unselected. |
| Operation and run identity | An operation moves only from `running` to `completed` or `failed`. A baseline scan, later scan, provider retry, or provider change belongs to a distinct immutable run; no run changes its fixture revision or overwrites another run. | Accepted through OD-012, OD-018, ADR-0016, and the information lifecycle. |
| Evidence and retrieval | The deterministic finding remains visible. Only minimized rule-specific evidence crosses the durable boundary, and retrieval returns inspectable passages from the fixed corpus snapshot with a support state. | Evidence minimization, closed corpus, finding visibility, and retrieval gate Accepted; exact field allowlists and positive-observation shape remain Proposed. |
| Generation | Complete required evidence plus a completed `supported` retrieval may invoke exactly the explicitly selected local or Groq path. Every other evidence-sufficiency branch abstains before provider invocation. The application validates the provider result and owns every limitation and prohibited-claim rule. | Provider boundary, eligibility, abstention, explicit selection, and no fallback Accepted; exact proposal and abstention record shapes remain Proposed. |
| Human authority | Only a validated proposal enters pending review. A person approves it, edits and explicitly accepts the edited successor, or rejects it. An abstention never becomes an accepted remediation plan. | Human review gate and compact lifecycle Accepted; detailed history and manual-check occurrence rules remain Proposed. |
| Rescan and comparison | A later run references the immutable baseline and compares the same target only after pair comparability is established. Pair-level `not comparable` is distinct from a comparable pair's child outcome. No outcome proves accessibility or conformance. | Minimal correlation, safe fallbacks, and high-level outcome meanings Accepted; the detailed comparability algorithm and complete persisted comparison shape remain Proposed. |
| Presentation and persistence | The UI distinguishes scanner evidence, retrieved guidance, AI interpretation, manual work, and reviewer decisions. Canonical minimized JSON remains in one local run directory; an optional Markdown report is derived only. | Core evidence/guidance/model/reviewer separation, local persistence, deletion unit, and renderer privilege boundary Accepted; distinct evidence-sufficiency/manual-work and non-color presentation, detailed projection, and interaction behavior remain Proposed. |

### Scenario parameter set

The scenario values below summarize the owning workflow authority. Candidate literals, detailed evidence allowlists, exact positive-observation shapes, and manual-check wording still require validation and freezing before executable evaluation.

| Profile | Controlled states and minimum evidence | Guidance and model boundary | Human judgment and comparison |
| --- | --- | --- | --- |
| `informative-image-alt` — axe `image-alt`, WCAG 2.2 SC 1.1.1 | Failing: the known informative image lacks `alt`. Corrected: the same keyed image has a context-appropriate alternative. Retain the native result/check identity, rule/profile provenance, stable target key, bounded image/`alt` facts, and the required corrected same-target positive observation. | Retrieve the selected SC 1.1.1, Understanding, H37, and H67 passages. The model may explain the observed absence and offer conditional informative, functional, or decorative treatments; it may not infer the image's actual purpose or claim conformance. | A person determines purpose and context and verifies equivalent purpose, intended action, or genuinely decorative treatment. A comparable failing-to-corrected pair may be `resolved`; violation-to-violation is `persistent`; positive-to-violation is `regressed`. `Improved` is unavailable. |
| `form-input-label` — axe `label`, WCAG 2.2 SC 4.1.2 | Failing: the known input has no programmatically associated non-empty name. Corrected: the same keyed input has an explicit visible label associated with the control. Retain the native result/check identity, rule/profile provenance, stable target key, input type, bounded association/name-source facts, and the required corrected positive observation; never retain the input value. | Retrieve the selected SC 4.1.2, Understanding, and H44 passages. The model may explain the missing programmatic name and propose the controlled visible-label association; it may not assert that wording or instructions are adequate or expand the rule mapping to SC 1.3.1 or SC 3.3.2. | A person verifies label clarity, accuracy, association, and whether additional instructions are needed. The binary comparison meanings match the image profile, and `Improved` is unavailable. |
| `text-contrast` — axe `color-contrast`, WCAG 2.2 SC 1.4.3 | Failing: the known normal-text target has a native failing contrast result. Corrected: the same keyed target and measurement profile have a native non-failing result. Retain the native result/check identity, stable key, foreground/background, emitted measured and expected ratios, font size/weight, incomplete reason when present, and exact render/rule/normalization provenance. The native scanner bucket—not independent arithmetic—controls pass and resolution. | Retrieve the selected SC 1.4.3, Understanding, and G18 passages. The model may explain the retained shortfall and propose changing foreground, background, or both; it may not claim that an unmeasured pair passes. | A person verifies meaningful ordinary-text classification, applicable exceptions, background assumptions, design meaning, and omitted interaction states. Failing-to-native-non-failing may be `resolved`. Two determinate failures use the retained contrast margin: higher is `improved`, equal is `persistent`, and lower is `regressed`; positive-to-violation is also `regressed`. |

### Behavioral examples

#### BHV-01 — Start locally and select only controlled work

- **Given** the developer starts the local application service, **then** it reports either readiness with its enumerated loopback URL or a visible startup failure; a ready service also provides a clean stop path.
- **Given** the ready URL is open in Chrome or Edge,
- **when** the user selects one named project-owned fixture revision, confirms its fixture ID and synthetic-only scope, and starts the scan,
- **then** one operation begins for only that profile, revision, rule, and stable target; the scan record retains the attestation time and scope; the target/configuration/coverage limitation is visible; and no live URL, authenticated target, discovery, or crawling path is available.
- An unavailable generation provider does not prevent deterministic scanning, evidence inspection, or reopening existing local records.

#### BHV-02 — Complete one evidence-supported path

- **Given** a valid failing-state scan produced the selected profile's minimized finding evidence, the fixed corpus snapshot returned directly supporting passages with `supported` guidance, and one ready provider was explicitly selected for this run,
- **when** the selected adapter returns a candidate proposal through the application-owned contract,
- **then** the application validates structure, evidence references, passage references, and prohibited claims before exposing a proposal as pending review.
- The review view keeps the finding, evidence, exact passages, AI interpretation, categorical confidence and uncertainty, assumptions, and required manual checks distinguishable.
- **When** the reviewer accepts the original proposal or an explicitly accepted reviewer-edited successor, **then** the accepted plan retains lineage to the immutable source run. **If** the user later starts the corrected-state scan, **then** it occurs in a distinct run and may be compared with that baseline under the scenario parameter set above.

For the fixed manifest, this example is parameterized by the three profiles and executed once through the capacity-screened local configuration and once through Groq. Those are six separate generation executions, not one run changing provider and not a provider comparison.

#### BHV-03 — Abstain before generation when support is insufficient

- **Given** the deterministic finding remains visible,
- **when** required finding evidence is incomplete or completed retrieval is `incomplete`, `missing`, or `conflicting`,
- **then** the application records deterministic abstention and a manual-review direction without invoking either provider and without storing provider-call provenance.
- An abstention contains no remediation conclusion and cannot enter proposal approval.
- A retrieval-stage error is different: it has no guidance-support state, fails the enclosing operation, preserves already durable minimized evidence, and must not be reported as `missing` guidance.

#### BHV-04 — Keep provider choice, egress, failure, and retry explicit

- **Given** the user selects a generation path, **then** the run records the selected mode, provider, and exact model before invocation; any provider connection or readiness probe uses only synthetic non-sensitive content.
- **Given** generation is eligible, **when** local mode is selected, **then** the prompt and response remain on approved loopback boundaries and no hosted fallback is available.
- **Given** Groq mode is selected, **before** invocation the UI identifies Groq, the exact model and destination, the minimized synthetic data categories sent, provider-controlled service/retention conditions, and bounded failure behavior; the credential remains available only to the local service. An invocation records the exact non-secret provider/model/configuration identity and prompt version.
- **Before** either provider is invoked, the application verifies that every required evidence, guidance, citation, and system constraint fits. It blocks an unsafe input rather than silently truncating it; this fails the operation and is not an evidence-sufficiency abstention.
- **When** readiness, authentication, input fit, quota, rate limit, network execution, provider execution, or runtime response validation fails, **then** the failure remains visible and distinguishable, the operation transitions to `failed`, and no automatic resubmission or cross-provider fallback occurs.
- **When** the user retries, **then** a new immutable linked run uses the same explicitly selected mode. Switching providers requires another explicit new-run choice and must not silently alter the scanner, corpus, retrieval, evidence, or validation configuration.

#### BHV-05 — Record exactly one human decision path

The three action names, original-proposal preservation in the compact manifest, and decision timestamp are Accepted. Detailed version history, rejection side effects, abstention triage, and manual-check transitions below remain Proposed where their owning requirements say so.

- **Approve:** the original proposal becomes the accepted remediation plan only after the reviewer confirms its material claims and required contextual judgment.
- **Edit and accept:** the original AI proposal remains preserved; the reviewer-authored successor is visibly distinct and becomes accepted only through an explicit acceptance action.
- **Reject:** the original proposal and rejection feedback remain visible, no accepted plan is created, and rejection triggers neither regeneration nor corpus change.
- **Abstention:** it may be acknowledged or sent to manual triage but cannot use any proposal-approval transition.
- Every proposal decision records the action and decision timestamp, plus reviewer edits or rejection feedback when applicable. It is evaluation feedback, not automatic ground truth.
- The candidate detailed manual-check gate remains Proposed: `completed` plus `supports`, or `not applicable` plus rationale, permits acceptance; `pending`, `contradicts`, or `inconclusive` blocks it. The MVP has no exception workflow.

#### BHV-06 — Compare two immutable runs conservatively

Before classifying a child finding, the comparison verifies the scenario, rule, stable target key, fixture relationship, browser, viewport, locale, scanner/rule/measurement profile, and required coverage. Merely failing to find the rule later is insufficient for `resolved`; the later run needs the scenario-required same-target positive observation.

| Baseline and later evidence | Image and label profiles | Contrast profile |
| --- | --- | --- |
| Violation → uniquely correlated native non-failing observation | `resolved` | `resolved` |
| Violation → violation, otherwise determinate | `persistent`; evidence changes remain visible but cannot become `improved` | Higher margin: `improved`; equal margin: `persistent`; lower margin: `regressed` |
| Uniquely correlated native non-failing observation → violation | `regressed` | `regressed` |
| Pair comparable but correlation or required evidence insufficient | `inconclusive` | `inconclusive` |
| Material target, fixture relationship, profile, semantic, or coverage mismatch between two valid scans | Pair-level `not comparable`; no child outcome | Pair-level `not comparable`; no child outcome |
| Invalid or incomplete source scan | Comparison stage and enclosing operation fail; do not emit a comparison outcome | Comparison stage and enclosing operation fail; do not emit a comparison outcome |

The MVP does not emit `new`. Every displayed outcome includes the correlation rationale, before/after evidence, limitations, and follow-up manual work. Reviewer decisions and manual-check results remain contextual feedback and never change the deterministic outcome. No outcome becomes a claim that the scenario, page, or site is accessible or conformant.

#### BHV-07 — Preserve durable work across completion, failure, reopen, and deletion

- A stage result or human decision becomes durable only after its canonical data is complete and validated. An internal stage completion is not a completed workflow operation.
- A failed or incomplete deterministic scan is visibly labeled as failed or incomplete and never appears as a successful scan with zero findings. This detailed branch remains Proposed under `REQ-SCAN-003`.
- Timeout, shutdown, or later-stage failure moves the operation to `failed` and never publishes partial success. Validated earlier scan evidence remains available for inspection and a new explicit retry.
- Baseline, later, and retry runs use distinct local run directories. On reopen, persisted JSON is treated as unknown and runtime-validated: a valid canonical record can reconstruct the run and its material trace, while malformed data fails visibly and is not used. Optional Markdown is derived only.
- A material change to a fixed fixture expectation, scanner/rule profile, corpus, retrieval, prompt/output contract, provider/model configuration, or comparison rule creates new evidence and reruns the affected fixed cases without rewriting prior results.
- Deleting one run deletes its exact local run directory. It does not delete the shared corpus/index or imply deletion of any provider-controlled record.

#### BHV-08 — Keep the visible and durable boundary safe

- At the point of interpretation, the interface identifies the selected target, scan profile, three-scenario coverage, automated limits, and non-certification boundary.
- Scanner evidence, guidance, evidence sufficiency, AI interpretation, manual work, and reviewer decisions remain distinct without relying only on color.
- Durable records and public portfolio material exclude full HTML, DOM or accessibility snapshots, screenshots, traces, cookies, credentials, input values, private URLs, raw prompts/provider payloads, unrelated content, and personal history.
- The service binds only to an enumerated loopback address, rejects unapproved Host, Origin, cross-site, and DNS-rebinding access, and protects state-changing browser requests with the selected local session and request-forgery controls; bootstrap secrets never appear in URLs or logs.
- Browser-delivered code receives no provider credential and has no direct filesystem, model-runtime, vector-store, browser-automation, or provider access. Generated and persisted values remain untrusted data when displayed.
- The product neither modifies user code automatically nor claims certification, legal compliance, whole-page accessibility, or complete success-criterion conformance or non-conformance.

### Traceability and source-status boundary

| Example | Primary authorities | Status boundary preserved by this specification |
| --- | --- | --- |
| BHV-01 | `REQ-INST-002`, `REQ-INST-005`, `REQ-AUTH-001`, `REQ-AUTH-002`, `REQ-UX-001`, `REQ-UX-003`, `REQ-QUAL-008`, `REQ-QUAL-012`, OD-018, OD-019 | Core startup, scope, and single-operation behavior Accepted; detailed scan metadata and UI pipeline behavior remain Proposed. |
| Scenario parameter set | OD-003, OD-004, OD-019, `REQ-EVID-002`, `REQ-EVID-005`, `REQ-EVAL-003`, `REQ-EVAL-007` | Scenario identities, pairings, logical states, corpus, minimization, and freeze rule Accepted; exact literals, field allowlists, and positive-observation shapes remain Proposed. |
| BHV-02 | `REQ-SCAN-001`, `REQ-EVID-004`, `REQ-EVID-006`, `REQ-RETR-001`, `REQ-RETR-002`, `REQ-RETR-004`, `REQ-GEN-001`–`REQ-GEN-006`, `REQ-REV-001`, `REQ-EVAL-001`–`REQ-EVAL-009` | Eligibility, citations, layer separation, review requirement, and fixed manifest Accepted; exact proposal, lineage record, and manual-check wording remain Proposed. |
| BHV-03 | `REQ-RETR-004`, `REQ-GEN-001`, `REQ-GEN-003`, `REQ-GEN-004`, `REQ-GEN-009`, `REQ-REV-007`, `REQ-QUAL-002` | Finding visibility, support gate, no-call abstention, and durable evidence survival Accepted; detailed abstention record and manual-triage behavior remain Proposed. |
| BHV-04 | `REQ-LLM-001`–`REQ-LLM-010`, `REQ-LLM-015`, `REQ-LLM-016`, `REQ-QUAL-003`, `REQ-QUAL-010`, `REQ-QUAL-011`, `REQ-SEC-004`, `REQ-SEC-005`, `REQ-SEC-011`, `REQ-SEC-013`–`REQ-SEC-016`, `REQ-EVAL-004`, `REQ-EVAL-008`, `REQ-EVAL-009` | Provider choice, disclosure, provenance, input-fit protection, runtime validation, failure visibility, isolation, and no fallback Accepted; generalized provider profiles remain Deferred. |
| BHV-05 | `REQ-REV-001`–`REQ-REV-007` and the accepted information lifecycle | Human review and the three high-level actions are Accepted; detailed history and manual-check transition semantics remain Proposed. |
| BHV-06 | OD-008, OD-019, `REQ-COMP-001`–`REQ-COMP-006`, and the accepted information lifecycle | Minimal identity, rationale visibility, safe fallbacks, non-conformance boundary, and high-level contrast distinction Accepted; detailed comparability and full outcome algorithm remain Proposed. |
| BHV-07 | ADR-0016, `REQ-SCAN-003`, `REQ-EVID-006`, `REQ-EVAL-005`, `REQ-QUAL-001`, `REQ-QUAL-002`, `REQ-QUAL-010`–`REQ-QUAL-012`, `REQ-SEC-003`, `REQ-SEC-006` | Three-state operation, immutable new-run retry, change-triggered new evidence, minimal local JSON persistence, read-boundary validation, and deletion unit Accepted; the zero-finding failure distinction and detailed end-to-end lineage remain Proposed, and exact filenames and TypeScript fields remain unselected. |
| BHV-08 | [Product scope](../PRODUCT_SCOPE_AND_GLOSSARY.md), `REQ-EVID-004`, `REQ-EVID-005`, `REQ-GEN-006`, `REQ-COMP-005`, `REQ-UX-001`–`REQ-UX-005`, `REQ-SEC-002`, `REQ-SEC-003`, `REQ-SEC-007`, `REQ-SEC-018`–`REQ-SEC-021` | Scope/limit visibility, data minimization, loopback protections, unprivileged UI, no automatic code modification, and prohibited claims Accepted; non-color presentation and detailed error/projection behavior remain Proposed. |

### Remaining planning details and explicit non-goals

This specification is behaviorally complete for the bounded portfolio demonstration, but it does not resolve or silently accept:

- exact fixture literals, physical file layout, pinned browser/viewport/page-state values, or detailed evidence allowlists and positive-observation fields;
- exact proposal, abstention, manual-check, UI-view, persisted-record, or filename shapes;
- the full local model digest/runtime configuration that must pass the reference-PC capacity gate;
- the concrete evaluation input for the contrast-only `improved` check. The behavior is defined above, but the accepted six logical failing/corrected revisions do not require a third product fixture. Before executable evaluation, the project must freeze whether a bounded pair of complete, valid synthetic source-scan records satisfying BHV-06's comparison prerequisites, or a separately identified evaluation-only revision, supplies that check; neither choice adds a fourth product scenario;
- exact packages, runtime, service framework, build tooling, or development commands.

The specification deliberately excludes executable `.feature` files, test code, fixtures, schemas, implementation scaffolding, live or authenticated targets, arbitrary URLs, crawling, bulk findings, accounts or collaboration, automatic code modification, provider registries or custom endpoints, fallback, agents or LangGraph orchestration, LangSmith or hosted tracing, databases, backup or synchronization, generalized export, release qualification, provider ranking, statistical claims, and performance or support promises.

Creating executable acceptance assets still requires explicit development authorization, resolution or deferral of every directly applicable Proposed Must requirement, and freezing the applicable values above. This planning section does not satisfy that gate by itself.

## Documentation navigation

- Up: [Evaluation and release requirements](README.md)
- Next: [Release inventory, evidence, and claims requirements](RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
