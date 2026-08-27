# Product scope and glossary

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior.

## Product definition

### Intended users

**Status:** Accepted on 2026-08-25 through OD-001.

- **Primary MVP user:** a frontend developer investigating one selected accessibility finding from a trusted developer-input page analysis and preparing a remediation decision.
- **Secondary MVP user:** a QA engineer reproducing the same selected finding and verifying the later result.

The MVP serves one local human user and one proposal at a time. The labels above describe intended users, not application roles: the product has no user accounts, login or reviewer-identity authentication, permissions, assignments, teams, or collaboration workflow. The local service still owns privileged operations under `REQ-SEC-027`; the trusted single-user MVP does not add a production session-authentication or request-forgery-protection system. Approving the bounded corpus is a project-maintainer responsibility during development, not an in-product curator role.

OD-020 changes the runtime scan cardinality, not the intended-user decision: the same person sees a complete supported-rule result list and may work on one selected FindingWorkflow at a time.

### Core job to be done

When a developer-selected page produces automated accessibility findings, the user needs to inspect the complete supported-rule result, understand one selected finding at a time, find applicable authoritative guidance, decide what remediation is appropriate, record where human judgment is still needed, and verify how the evidence changes after the page is updated.

### Product principles

**Status:** Accepted product decisions derived from the repeated direction and boundaries in the existing project documentation.

1. **Evidence before interpretation.** Scanner observations, retrieved guidance, model-generated interpretation, and human decisions must remain distinguishable.
2. **Traceability by default.** A user must be able to follow an accepted proposal back to the scan, evidence, corpus passages, generation configuration, and review action that produced it.
3. **Human authority.** Every generated proposal requires review; contextual judgments require explicit manual checks.
4. **Conservative AI behavior.** Unsupported or conflicting evidence must lead to abstention or an inconclusive result, not a plausible invention.
5. **Visible limitations.** The interface, and any export that is provided, states the target, supported-rule coverage, automation boundary, and comparison limits.
6. **Responsible target and data use.** The developer is responsible for choosing a page they are permitted to analyze, and local/private data must not silently leave the local environment.
7. **Measurable quality.** Retrieval, generation, workflow, comparison, and resource use must be evaluated independently.
8. **Accessible by design.** The application itself must be usable by people with disabilities.
9. **Replaceable generation.** The evidence and review workflow must not be bound to one model vendor or runtime. For every PageAnalysisRun, the user explicitly chooses either the downloaded local model through the selected runtime or Groq as the first and only external provider. Local mode is the recommended initial choice but is never implicit; failure never triggers automatic fallback to the other mode.
10. **Existing-hardware boundary.** Local model candidates must fit the documented reference PC under the representative workload; models that exceed that capacity are excluded rather than accommodated with additional hardware or remote compute.

OD-021 applies these principles to one trusted developer-input analysis: exact three-rule scanner coverage and every retained Finding stay visible; the run has one immutable Local-or-Groq context; and only one selected FindingWorkflow may reach retrieval, generation, and individual review at a time.

## Scope

### MVP scope

**Status:** The one-public-page portfolio interaction remains Accepted through [OD-020](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope), which supersedes OD-019's synthetic-only, one-profile-at-a-time runtime boundary. [OD-021](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) and [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) replace OD-020 and ADR-0017 only where they required a production hostile-target boundary. The single-user localhost application, one global local-or-Groq mode per run, no-fallback behavior, local filesystem persistence, and absence of an MVP installer remain Accepted through their recorded decisions.

The portfolio MVP is a single-user web application served by one local application service and opened at a loopback address in Chrome or Edge. One **PageAnalysisRun** accepts one developer-entered non-authenticated public HTTPS page URL as trusted input, selects one immutable global generation mode, and performs one provider-independent deterministic scan using exactly these axe-core rules. Target authorization and suitability are supported-use assumptions owned by the developer; the application collects no separate attestation, confirmation, or acknowledgement record:

- `image-alt`, mapped narrowly to WCAG 2.2 SC 1.1.1;
- `label`, mapped narrowly to WCAG 2.2 SC 4.1.2; and
- `color-contrast`, mapped narrowly to WCAG 2.2 SC 1.4.3.

The scan preserves the complete variable list of axe violation nodes for those three rules. Each node is one independently addressable **Finding**. Native axe `incomplete` results are preserved separately as **ScannerReviewObservations** and never become proposal-eligible findings. A valid zero-finding result is possible only after complete validated execution of all three rules. Missing, invalid, incomplete, or silently truncated scanner coverage must never be presented as a successful zero-finding run.

The interface lists every retained finding, grouped by rule, and lets the user select one FindingWorkflow at a time. Selection does not combine findings, authorize automatic processing of the collection, or create a queue. Every finding already has its independently addressable minimized evidence; only the selected finding proceeds from that evidence through rule-specific retrieval, evidence-sufficiency gating, one structured generation call when eligible, individual human review, and later conservative comparison. An ineligible finding abstains without a provider call. Other findings retain their own visible states.

The PageAnalysisRun records one global local-or-Groq mode, exact provider, and exact model context before downstream analysis. The deterministic scan never depends on that mode. A ProviderInvocation exists only when an eligible selected finding is explicitly sent to the selected adapter; an abstention or unprocessed finding inherits the visible run context but has no call provenance. Neither provider mixing nor automatic fallback is permitted within a run. Retrying requires a new PageAnalysisRun and a new explicit mode selection.

Durable records remain local in one application-owned filesystem run directory per PageAnalysisRun, with JSON as canonical machine-readable data and an optional derived Markdown report. The run graph retains the minimized target and scan provenance, complete finding and scanner-review-observation collections, per-finding evidence and downstream state, proposal or abstention when one exists, individual review decisions, and comparison references needed to reopen the run. It retains no raw page, full DOM, screenshot, accessibility-tree snapshot, browser trace, credential, form value, or raw provider payload. Deleting the run directory deletes the application's run copy. The MVP adds no database, cloud store, synchronization, telemetry, analytics, backup system, or complex retention policy. [ADR-0016](../architecture/decisions/ADR-0016-filesystem-run-persistence.md) owns the filesystem decision.

The smallest runtime workflow is:

1. Enter one non-authenticated public HTTPS page URL that the developer is responsible for choosing and is permitted to analyze.
2. Select one global local or Groq generation mode for the new PageAnalysisRun.
3. Activate **Analyze** once; the local service performs basic URL parsing, opens a fresh non-persistent browser context without imported state, and runs one provider-independent scan with exactly the three supported rules under a simple timeout and cleanup path.
4. Preserve and show every finding plus each distinct ScannerReviewObservation; show a valid zero only after complete coverage.
5. Select one finding and process only its minimized evidence through retrieval and the evidence-sufficiency gate.
6. Produce either one structured cited proposal through the run's selected provider or one deterministic abstention with no provider call.
7. Record manual checks and one individual approve, edit-and-accept, or reject decision.
8. Start a new run to retry or rescan; compare only evidence that satisfies the conservative same-page, same-rule, and same-target prerequisites.

The page input does not authorize crawling or general website analysis. The MVP accepts no authenticated page, cookie, credential, custom authorization header, uploaded HTML, filesystem path, link-discovery request, multi-page target set, or broader rule set. The developer owns target authorization. The application performs only basic URL-shape validation and deliberately does not claim to prove that a URL is public, safe, or non-hostile. The fresh browser context, no-imported-state boundary, no-crawl/no-interaction behavior, simple timeout and cleanup, and minimized evidence are the proportional safeguards recorded in ADR-0018 and the owning requirements.

### First vertical slice

The first vertical slice combines the accepted public-page runtime boundary with the same three narrowly supported rule profiles and their project-owned controlled evaluation fixtures described below. This heading preserves the stable documentation target used by OD-019 while OD-020 owns the current runtime scope.

### Supported rule profiles

**Status:** OD-020 retains exactly the three rule/WCAG mappings and their evidence-first downstream behavior while superseding OD-019's runtime assumption that one project-owned synthetic scenario, one rule, and one intended target are selected per operation. A public-page scan may produce zero, one, or many findings for each supported rule.

| Supported rule profile | Minimum deterministic meaning | Model and human boundary | Conservative comparison boundary |
| --- | --- | --- | --- |
| `informative-image-alt` — axe `image-alt`, WCAG 2.2 SC 1.1.1 | Each retained violation node describes one affected image target under the recorded scanner profile. Preserve the rule/check identity, minimized target descriptor, bounded `img`/`alt` state, and exact evidence provenance. | The model may explain the observed missing text alternative and present conditional treatments from retrieved guidance. A person determines the image's purpose and whether the final treatment communicates equivalent purpose. | A matched violation-to-violation result is `persistent`; `resolved` requires a later unique same-target non-failing observation and complete rule coverage. No `improved` outcome exists. |
| `form-input-label` — axe `label`, WCAG 2.2 SC 4.1.2 | Each retained violation node describes one affected form-control target. Preserve rule/check identity, minimized target descriptor, input type, bounded name-source and label-association facts, and never the input value. | The model may explain the missing programmatic name and propose applicable association patterns. A person judges label clarity, accuracy, association, and any additional instructions. The automated rule is not expanded here to SC 1.3.1 or SC 3.3.2. | The binary outcome boundary matches `image-alt`; changed but still-failing evidence remains `persistent`, not `improved`. |
| `text-contrast` — axe `color-contrast`, WCAG 2.2 SC 1.4.3 | Each retained violation node preserves the native result/check identity, minimized target descriptor, axe-emitted colors, measured and expected ratios, font size/weight, and exact measurement provenance. The native bucket controls pass/fail; any native `incomplete` result remains a separate ScannerReviewObservation. | The model may explain the retained shortfall and propose adjusting foreground, background, or both. A person verifies text classification, exceptions, background assumptions, design meaning, and omitted visual states. | A matched failing-to-native-non-failing target may be `resolved`. For two determinate matched failures under an identical measurement profile, a higher contrast margin is `improved`, equal is `persistent`, and lower is `regressed`; otherwise use `inconclusive` or pair-level `not comparable`. |

The mappings are deliberately narrow. One axe finding is evidence about one rule node under one recorded scan profile; it does not prove complete success-criterion, page, or site non-conformance. Likewise, zero findings from the three rules proves only that those rules reported no violation nodes under the recorded complete scan; it does not prove accessibility or conformance.

### Controlled evaluation fixtures

**Status:** OD-003's six logical failing/corrected revisions and OD-019's three scenario identities, rule/WCAG pairings, project-owned synthetic boundary, contrast-measurement retention, and high-level comparison meanings remain Accepted as the canonical evaluation baseline. OD-020 supersedes only their former runtime-input exclusivity and one-profile-per-operation behavior.

Project-owned synthetic fixtures remain deterministic evaluation inputs, not the runtime target model. Each of the three controlled scenario profiles has one failing and one corrected revision with one stable intended target. Before evaluation, each revision's synthetic content, expected native rule result, scenario ID, stable fixture-target key, browser profile, and rule profile must be frozen independently of model output. The physical fixture-file arrangement remains an implementation detail. Stable fixture keys, known intended targets, and gold context must never be presented as facts about an arbitrary public page.

The current axe-core 4.13 rule metadata maps `image-alt` to `wcag111`, `label` to `wcag412`, and `color-contrast` to `wcag143` in the official [versioned rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md). The evaluation profiles use the primary mappings to [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#non-text-content), [SC 4.1.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#name-role-value), and [SC 1.4.3](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#contrast-minimum), respectively. A scanner-to-criterion mapping supplies scope and retrieval vocabulary; one automated result never proves complete success-criterion or page-level non-conformance.

Where the scenario descriptions below name exact synthetic literals or values, they are candidate manifest values to validate and freeze before evaluation, not accepted fixture implementations.

#### Scenario 1: missing text alternative for an informative image (`informative-image-alt`)

- **Controlled states:** the failing revision contains one intended informative `img` without an `alt` attribute. The corrected revision retains the target and context and adds the fixture author's context-appropriate text alternative. “Informative” and “appropriate” are evaluation-gold facts, not scanner facts or model inputs.
- **Deterministic evidence:** retain the native `image-alt` result bucket, rule and check identity, pinned engine and scan profile, stable fixture-target key, minimized locator and sanitized element facts, `img` element type, and the missing or present text-alternative state. The corrected scan retains one narrow native positive target observation instead of a page-wide pass set.
- **Minimum guidance:** the selected sections of WCAG 2.2 SC 1.1.1, [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content), [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37), and [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67).
- **Permitted model contribution:** explain the observed missing alternative, describe possible user impact with qualified language, and propose conditional informative, functional, or decorative treatment grounded in retrieved guidance. It may not assert the image's purpose, create an applied patch, or claim that the page fails or satisfies SC 1.1.1 as a whole.
- **Required human judgment:** before plan acceptance, determine the image's actual purpose and context and choose the applicable conditional branch. After a change, verify that the alternative communicates equivalent purpose, exposes an intended action, or removes genuinely decorative content without information loss.
- **Conservative comparison:** `resolved` requires a comparable baseline violation and corrected same-target positive observation; `persistent` requires the same violation on both sides; `regressed` requires a positive baseline and later violation; ambiguous or insufficient evidence is `inconclusive`. This binary rule has no `improved` outcome.

#### Scenario 2: form input without an accessible label (`form-input-label`)

- **Controlled states:** the failing revision contains one visible “Email address” text beside a stable email input but no `label` association or other accessible-name source. The corrected revision replaces that text with an explicit visible `label` whose `for` value matches the unchanged input `id`.
- **Deterministic evidence:** retain the native `label` result bucket, rule and check identity, pinned engine and profile, stable target key, minimized locator and sanitized element/association facts, input type, and the absence or presence of an accessible-name source. Never retain the input value. The corrected scan retains one narrow native positive observation for the same input.
- **Minimum guidance:** WCAG 2.2 SC 4.1.2, [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value), and [Technique H44](https://www.w3.org/WAI/WCAG22/Techniques/html/H44). The official W3C [ACT rule e086e5](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/) is mapping and test-boundary input rather than embedded remediation guidance.
- **Permitted model contribution:** explain that the retained evidence shows no non-empty programmatically determinable name and propose the explicit visible `label` association used by this controlled profile. It may not claim that the label wording is adequate, that all form instructions are sufficient, or that the automated result proves complete SC 4.1.2 or page non-conformance.
- **Required human judgment:** confirm that the visible label accurately and clearly identifies the intended input, remains available to users, and is associated with the correct control; separately determine whether format, required-field, or other instructions are needed. H44 can support other criteria, but this axe rule is mapped here only to SC 4.1.2—not to SC 1.3.1 or SC 3.3.2.
- **Conservative comparison:** use the same binary `resolved`, `persistent`, `regressed`, and `inconclusive` definitions as the image scenario. A partial change that still fails is `persistent`, not `improved`.

#### Scenario 3: text with insufficient color contrast (`text-contrast`)

- **Controlled states:** the failing revision uses meaningful normal text at 16 CSS pixels and weight 400, with `#888888` foreground on `#FFFFFF` background, for a formula-derived ratio of approximately `3.5449:1`. The corrected revision retains the same target, content, background, font classification, and scan profile but uses `#767676` foreground, approximately `4.5422:1`. The exact native axe result remains authoritative; these planning calculations do not replace it.
- **Deterministic evidence:** retain the native `color-contrast` result bucket, rule and check identity, stable target and profile, and axe-emitted foreground color, background color, contrast ratio, expected ratio, font size, and font weight. Retain the same applicable fields in the corrected positive target observation. A native `incomplete` result and its reason belong to a separate ScannerReviewObservation. Do not independently turn a rounded or displayed number into a pass.
- **Minimum guidance:** WCAG 2.2 SC 1.4.3 and its contrast definitions, [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), and [Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18). G145 is unnecessary for this deliberately normal-text profile.
- **Permitted model contribution:** explain the retained measurement and applicable threshold, describe possible readability impact, and propose changing the foreground, background, or both subject to reviewer constraints. Any candidate color is a proposal that requires a rescan; the model may not state that an unmeasured pair passes.
- **Required human judgment:** confirm that the target is meaningful ordinary text rather than incidental content or a logotype; confirm its rendered size/weight classification and the controlled opaque-background assumptions; review design meaning and other visual states that this one profile does not exercise.
- **Conservative comparison:** define the comparison-only ordered measure as `contrast margin = retained numeric measured ratio - validated numeric component of the retained expected-ratio string`; higher is better only when target, engine, browser/profile, evidence-normalization version, font classification, threshold, and retained precision are identical. `resolved` requires a baseline violation and later native pass. Among two determinate violations, a strictly higher later margin is `improved` but remains unresolved, an equal retained margin is `persistent`, and a strictly lower margin is `regressed`; a native pass followed by a violation is also `regressed`. Incomplete or non-comparable measurements are `inconclusive`. No third fixture revision is required merely to define the possible `improved` outcome.

The version-pinned axe [contrast evaluation source](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js) exposes the retained measurement fields and reports a truncated ratio, which is why the scanner bucket—not comparison arithmetic—controls pass or resolution.

### Scope-decision history

- **OD-002 (Superseded by OD-019):** accepted only the `image-alt` controlled scenario.
- **OD-019 (Superseded for runtime scope by OD-020):** expanded the portfolio to three project-owned synthetic controlled profiles processed one at a time. Its three rule/WCAG mappings, controlled evaluation profiles, and comparison evidence remain evaluation history where current requirements still reference them.
- **OD-020 (Accepted on 2026-08-25; attestation and hostile-target controls superseded by OD-021):** replaced the runtime boundary with one user-attested public HTTPS page per PageAnalysisRun, exactly the three supported rules in one provider-independent scan, a complete variable finding list, one global local-or-Groq mode context, and one selected finding workflow at a time. Its one-page, scan-cardinality, provider, and no-crawl decisions remain current; its separate attestation and production public-target enforcement clauses are preserved only as history. See the [decision register](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) and superseded [ADR-0017](../architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md).
- **OD-021 (current, Accepted):** retains OD-020's one-page, exact-three-rule, complete-finding-list, global-provider, and selected-finding workflow while replacing its attestation and hostile-target enforcement model with a trusted developer-input portfolio boundary. The application provides no production isolation claim for hostile, private, redirecting, or resource-abusive targets. See the [decision register](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) and [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md).

### Out of scope for the MVP

**Status:** The non-certification, no-automatic-modification, trusted public-HTTPS-only single-page input, exactly-three-rule coverage, no-authentication/no-crawler, single-user, global-provider-mode, and one-selected-finding-workflow boundaries are Accepted through their recorded decisions. Production hostile-target protection is Deferred through OD-021. Other deferrals remain governed by their owning requirements.

- Accessibility certification, compliance badges, legal advice, or whole-page/whole-site conformance claims.
- Claims that zero supported-rule findings means a page is accessible.
- Automatic source-code edits, pull requests, deployments, or unsupervised remediation.
- Authenticated, intentionally hostile, private-network, non-public, or credentialed pages; cookies, custom authorization headers, stored browser sessions, or user-entered form state. The MVP documents these as unsupported and does not claim to detect them reliably.
- Multiple input URLs, link following, target discovery, site crawling, crawler specifications, or crawler implementation.
- Any accessibility rule beyond `image-alt`, `label`, and `color-contrast`; cross-browser equivalence or mobile-device coverage.
- Automatic processing, combined retrieval, combined prompts, combined proposals, approve-all/reject-all actions, background queues, parallel finding workflows, or production-scale batch processing.
- Accounts, roles, permissions, assignments, notifications, teams, or collaboration workflows.
- A generic chatbot as the primary interface. Chat, if later included, remains secondary.
- Automatic learning from rejected proposals or unreviewed page content.
- Public exposure of target evidence, source code, prompts, provider payloads, private reviewer notes, or traces.
- Local model configurations that exceed the documented reference PC or require remote compute to complete the representative workflow.

## Terminology

Terms prefixed with **Candidate** below are proposed or Deferred vocabulary. Their definitions make those ideas precise without adding them to the MVP.

| Term | Definition |
| --- | --- |
| Authorized target | A page or controlled fixture the user is permitted to analyze. The developer owns that determination; the MVP performs no ownership-verification workflow. Controlled fixtures are evaluation inputs. |
| Trusted developer-input page | One developer-entered non-authenticated public HTTPS page treated as benign input for one PageAnalysisRun. The application performs basic URL parsing but does not prove public reachability, authorization, or hostile-page safety. The scope does not include links as targets, authenticated state, another URL, or a site. |
| Controlled fixture | A project-owned synthetic page state with frozen expected evidence, retained only for deterministic evaluation rather than runtime target intake. |
| Controlled scenario profile | One of the three accepted evaluation scenario identities and rule/WCAG pairings, with project-owned synthetic failing and corrected states and one stable intended target. Its content, expected native result, stable target key, fixture revision, browser profile, and rule profile are frozen before evaluation; physical fixture-file layout is an implementation detail. |
| Supported rule profile | One of the three accepted axe rule/WCAG mappings plus its rule-specific minimized evidence, retrieval vocabulary, manual judgment, and comparison constraints. All three profiles run in every public-page scan. |
| PageAnalysisRun | The parent record and local persistence unit for one trusted developer-supplied URL, one immutable global generation-mode context, one complete three-rule scan, a variable finding collection, distinct scanner-review observations, and any finding-specific downstream records created through explicit selection. |
| Transient scan observation | The in-memory native scanner result and execution metadata produced for immediate evidence capture; it is not durable evidence. |
| Scan run | One execution of a versioned scanner configuration against a recorded target state. For the public-page MVP, its durable Scan record belongs to one PageAnalysisRun. |
| Scan record | The provider-independent record of one complete or failed three-rule scanner execution against the PageAnalysisRun target. |
| Finding | Exactly one retained axe violation node for one supported rule and one affected target. It is independently addressable and is not automatically a confirmed accessibility issue. |
| ScannerReviewObservation | One retained native axe `incomplete` observation. It remains distinct from a Finding, requires human investigation, and is not proposal-eligible. |
| FindingWorkflow | The downstream state and records for one selected Finding: minimized evidence, retrieval, sufficiency, optional provider invocation, proposal or abstention, review, and comparison references. Only one FindingWorkflow is active at a time. |
| Page evidence | The minimal allowlisted facts needed to inspect one Finding or ScannerReviewObservation, such as rule/check output, a sanitized target descriptor, association facts, or scanner-emitted measurements. Raw page or DOM capture is not page evidence. |
| Positive target observation | A narrow later non-failing observation retained only when comparison must establish that the same uniquely correlated target and rule scope were exercised. It is not a page-wide pass collection. |
| Target correlation descriptor | A versioned, minimized, sanitized public-page target description used with the exact rule and page identity for conservative rescan matching. It is not a claim of permanent identity; missing, duplicate, changed, or ambiguous correlation cannot be forced. |
| Corpus snapshot | An immutable, identified collection of approved and versioned guidance sources and derived passages. |
| Guidance passage | A traceable excerpt retrieved from a corpus source. |
| Model interpretation | Generated explanation, impact analysis, or remediation text; it is never deterministic evidence. |
| Generation provider | A replaceable adapter that executes the structured-generation contract without changing evidence, retrieval, review, or comparison meaning. |
| Global generation-mode context | The immutable Local or Groq provider/model selection recorded for one PageAnalysisRun. It constrains every optional invocation in that run but does not itself invoke a provider or authorize automatic processing. |
| ProviderInvocation | An optional, finding-specific record created only when an eligible selected FindingWorkflow actually attempts one provider call. An abstention or unprocessed finding has no ProviderInvocation. |
| Provider profile | The non-secret configuration identifying either the selected local runtime and model or Groq model ID `openai/gpt-oss-20b` for the fixed MVP API evaluation. A credential reference may exist only on the local-service side; one profile is selected in the immutable global context for each PageAnalysisRun. |
| Candidate: readiness dimensions | Separately observed facts covering host compatibility, runtime availability, exact artifact installation, adapter health, and eligibility for the requested workload. Passing one dimension does not imply another passed. |
| Candidate: support state | A state attached to one exact provider, model, runtime, context, and hardware profile, proposed as **evaluation-only**, **capacity-qualified**, **development-supported**, **release-qualified**, **excluded**, or **unknown**. Capacity qualification alone does not imply release qualification. |
| Candidate: work identity | An immutable identifier and revision that determine whether an asynchronous operation still owns its inputs and is eligible to publish a result. |
| Candidate: acquisition manifest | An application-owned, versioned record of an optional runtime or model artifact's exact identity, source, license, sizes, integrity data, allowed network origins, staging rules, compatibility profile, and install/removal ownership. |
| Candidate: activated provider profile | The configured and readiness-verified provider profile selected for future generation. Installing a local artifact does not by itself activate or select its profile; an external-API profile is configured rather than installed. |
| Candidate: release evidence set | Content-safe, immutable evidence binding a particular build or package to its exact component inventory, validation environment, applicable support claims, known blind spots, and distribution status. |
| Local LLM mode | Generation through the selected, configured, and readiness-checked runtime on the user's computer, with no model prompt or response sent to an external inference service. Explicit model acquisition is a separate setup action. |
| Groq API mode | Generation through Groq, the MVP's first and only external provider, after data-egress, privacy, retention, rate-limit, and failure behavior are disclosed and accepted. Use of an OpenAI-compatible API shape does not make Groq an OpenAI service. |
| Model artifact | A separately acquired model file or set of files with a recorded source, identifier, immutable digest, quantization or format, license, size, storage location, and verification state. |
| Provider setup | A local-service workflow that validates the chosen generation mode and acquires or configures only what the user explicitly authorizes. Local model acquisition is separate from the repository; Groq credentials never enter browser-delivered code or durable run records. |
| Remediation proposal | The generated proposal version awaiting an individual review decision. A reviewer-edited successor remains a proposal version but is explicitly reviewer-authored rather than AI-generated. |
| Accepted remediation plan | A proposal explicitly approved, or edited and accepted, by a reviewer. It applies only to its Finding. |
| Manual-check definition | Immutable instructions, purpose, timing, and blocking classification for one human evaluation. |
| Manual-check result | One execution occurrence referencing a manual-check definition, proposal, reviewer, time, status, and—when completed—observed outcome and relationship to that proposal. A post-change occurrence may also reference its later scan and comparison. |
| Evidence sufficiency | The deterministic per-finding pre-generation gate over required finding evidence and retrieved guidance. Guidance support is `supported`, `incomplete`, `missing`, or `conflicting`; only complete required evidence plus a completed `supported` retrieval is proposal-eligible. This is not model confidence or an accessibility score. |
| Material claim | A statement that changes the interpretation of a finding, its user impact, the recommended remediation, or the meaning of a comparison. Material claims require direct evidence and citation support. |
| High-impact remediation claim | A material recommendation that could create or preserve a serious accessibility barrier, remove content or functionality, weaken security or privacy, or materially change user interaction. |
| Unsafe proposal | A proposal that could introduce a barrier or harmful side effect, relies on a prohibited claim, or recommends a material change without adequate evidence and guidance. |
| Reviewer | The frontend developer making the current individual remediation decision. A QA user may reproduce the finding, inspect evidence, and verify the later change without creating a separate application role or assignment. A review decision is useful evaluation feedback, not automatic ground truth or a compliance determination. |
| Candidate: critical blocker | A possible future application-accessibility severity term for a defect that prevents a core workflow. The MVP has no formal support or qualification matrix. |
| Candidate: screen-reader scenario | A possible future versioned test procedure for a specific operating system, browser, screen reader, workflow, expected announcements, and pass rule. Formal matrix qualification is Deferred. |
| Abstention | A per-finding structured result with no remediation conclusion because required evidence or guidance is insufficient, missing, incomplete, or conflicting. It has no ProviderInvocation and cannot become an accepted plan. |
| Comparable scans | Scan runs whose target state and material configuration are sufficiently aligned for a supported comparison. Public-page exact target-correlation details remain Proposed. |
| Scan comparison outcome | An evidence-backed relationship between findings from two comparable runs; distinct from an AI evaluation regression. |
| Scan-pair comparison | One record for a baseline and later scan containing pair comparability, limitations, and zero or more finding-comparison entries. It has no page-level accessibility outcome. |
| Finding-comparison entry | One independently addressable comparison containing exact correlation rationale, before/after evidence references, one applicable outcome, limitations, and manual follow-up. |
| MVP finding identity | For controlled evaluation, the scenario ID, rule ID, stable fixture-target key, fixture revision, and minimized rule evidence used to correlate before-and-after observations. For a public page, within-run Finding identity is Accepted while exact cross-scan target correlation remains Proposed. A selector is supporting evidence only. |
| Contrast margin | A comparison-only value equal to the retained numeric axe-reported measured ratio minus the validated numeric component of the retained axe-reported expected-ratio string. It is ordered only under an identical contrast and evidence-normalization profile, is not a WCAG or confidence score, and never overrides the scanner's native pass/fail bucket. |
| Local run record | The content-safe canonical PageAnalysisRun graph in one local directory. It is not a compliance audit record and does not retain raw page or provider payloads. |

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
