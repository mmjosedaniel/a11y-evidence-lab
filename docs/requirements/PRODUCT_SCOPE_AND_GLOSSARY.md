# Product scope and glossary

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Product definition

### Intended users

**Status:** Accepted on 2026-08-25 through OD-001.

- **Primary MVP user:** a frontend developer investigating one controlled accessibility finding and preparing a remediation decision.
- **Secondary MVP user:** a QA engineer reproducing the same controlled finding and verifying the later result.

The MVP serves one local human user and one proposal at a time. The labels above describe intended users, not application roles: the product has no user accounts, login or reviewer-identity authentication, permissions, assignments, teams, or collaboration workflow. This does not remove the accepted local-session and request-authentication boundary for the loopback API. Approving the bounded corpus is a project-maintainer responsibility during development, not an in-product curator role.

### Core job to be done

When an authorized page produces an automated accessibility finding, the user needs to understand what was observed, find applicable authoritative guidance, decide what remediation is appropriate, record where human judgment is still needed, and verify how the evidence changes after the page is updated.

### Product principles

**Status:** Accepted product decisions derived from the repeated direction and boundaries in the existing project documentation.

1. **Evidence before interpretation.** Scanner observations, retrieved guidance, model-generated interpretation, and human decisions must remain distinguishable.
2. **Traceability by default.** A user must be able to follow an accepted proposal back to the scan, evidence, corpus passages, generation configuration, and review action that produced it.
3. **Human authority.** Every generated proposal requires review; contextual judgments require explicit manual checks.
4. **Conservative AI behavior.** Unsupported or conflicting evidence must lead to abstention or an inconclusive result, not a plausible invention.
5. **Visible limitations.** The interface, and any export that is provided, states the target, scenario, automated coverage, and comparison limits.
6. **Privacy and authorization.** Only authorized targets may be analyzed, and local/private data must not silently leave the local environment.
7. **Measurable quality.** Retrieval, generation, workflow, comparison, and resource use must be evaluated independently.
8. **Accessible by design.** The application itself must be usable by people with disabilities.
9. **Replaceable generation.** The evidence and review workflow must not be bound to one model vendor or runtime. For every MVP generation run, the user explicitly chooses either the downloaded local model through the selected runtime or Groq as the first and only external provider. Local mode is the recommended initial choice but is never implicit; failure never triggers automatic fallback to the other mode.
10. **Existing-hardware boundary.** Local model candidates must fit the documented reference PC under the representative workload; models that exceed that capacity are excluded rather than accommodated with additional hardware or remote compute.

## Scope

### MVP scope

**Status:** The three-scenario first portfolio slice is Accepted through OD-019. The single-user browser-local startup, explicit local/Groq generation choice, no-fallback behavior, and absence of an MVP installer are Accepted on 2026-08-25. Broader product and distribution scope is Deferred.

The portfolio MVP is a single-user web application served by a local application service on the developer machine and opened at a loopback address in Chrome or Edge. It completes one full evidence lifecycle for one selected controlled scenario and finding at a time. The user explicitly chooses one generation mode per run: a separately downloaded local model through the selected local runtime, or the Groq API using model ID `openai/gpt-oss-20b` for the fixed API evaluation. The two modes execute the same application-owned structured contract and never fall back automatically to each other. The Groq model choice is not a release qualification or permanent availability promise. [ADR-0014](../architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) owns this provider decision.

The MVP has no installer, desktop wrapper, Start menu shortcut, application-controlled webview, accounts, roles, permissions, assignments, or collaboration features. Browser-delivered code is only the unprivileged interface; the local service owns filesystem access, browser automation, model-runtime and Groq calls, and durable local records. The historical Windows-installer direction remains visible in [ADR-0002](../architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md), but [ADR-0015](../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md) supersedes it for the MVP. Packaging and installer work are deferred until there is demonstrated distribution need.

Durable MVP records remain on the local machine in one filesystem run directory per run, with JSON as the canonical machine-readable representation and Markdown optional as a human-readable report. Only minimized synthetic evidence, guidance-passage references, a proposal or abstention, the review decision, and the comparison needed to reopen that run are retained. Deleting that run directory deletes the run. The MVP adds no database, cloud storage, synchronization, telemetry, analytics, backup system, or complex retention policy, and run data stays outside Git. [ADR-0016](../architecture/decisions/ADR-0016-filesystem-run-persistence.md) owns this persistence decision.

1. Select one project-owned controlled scenario and one of its fixed revisions.
2. Run deterministic browser accessibility checks.
3. Keep the native scanner payload transient and preserve only minimized, allowlisted rule-specific source evidence, normalized finding evidence, and scanner provenance.
4. Retrieve relevant passages from an approved corpus snapshot.
5. Keep the deterministic finding visible and use evidence sufficiency only to gate generation: produce a structured cited proposal only when required evidence is complete and retrieval is `supported`, or an explicit abstention and manual-review requirement when support is `missing`, `incomplete`, or `conflicting`.
6. Record manual checks and an approve, edit with explicit acceptance of the edited version, or reject decision.
7. Rescan a comparable target state.
8. Show an evidence-backed scan comparison outcome.

The MVP accepts only the three named project-owned synthetic scenarios below. It has no live-site input, arbitrary-URL input, crawling, or crawler implementation. Those capabilities are deferred until a demonstrated product need justifies their target-authorization, isolation, network-safety, privacy, and product-design cost. This is an MVP portfolio boundary, not a claim that live-page analysis, crawling, or broader accessibility coverage is unimportant. Authenticated private pages and multi-user hosting also remain outside the MVP.

### First vertical slice

**Status:** The three scenario identities, rule/WCAG pairings, project-owned synthetic boundary, requirement for failing and corrected states, one-profile-at-a-time scope, contrast-measurement retention, and high-level `resolved` versus possible still-failing `improved` distinction are Accepted on 2026-08-24 through OD-019.

The first slice supports exactly three logical fixture profiles. Each profile is project-owned, synthetic, controlled, and has one failing and one corrected revision with one stable intended target. One workflow operation selects one profile, one revision, and its one axe-core rule; the scan execution and downstream retrieval, generation, review, and comparison stages process that same one finding. Supporting three profiles therefore does not introduce crawling, bulk review, multi-finding orchestration, or a generalized workflow engine. The physical fixture-file arrangement remains a later implementation detail.

The current axe-core 4.13 rule metadata maps `image-alt` to `wcag111`, `label` to `wcag412`, and `color-contrast` to `wcag143` in the official [versioned rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md). For this slice, those tags are recorded as the primary mappings to [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#non-text-content), [SC 4.1.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#name-role-value), and [SC 1.4.3](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#contrast-minimum), respectively. A scanner-to-criterion mapping supplies scope and retrieval vocabulary; one automated result never proves complete success-criterion or page-level non-conformance.

OD-003 accepts that the three logical scenarios require exactly six logical revisions: one failing state and one corrected state per scenario. This does not require six projects or six physical files; layout is an implementation detail. Before evaluation, each revision's synthetic content, expected native rule result, scenario ID, stable fixture-target key, fixture revision, browser profile, and rule profile must be frozen independently of model output. The exact literals and physical file arrangement remain unselected implementation details.

OD-004, OD-007, and OD-008 accept the bounded source-pack, finding-visibility, and same-target correlation constraints summarized below. Exact evidence field allowlists and normalization, retrieved passage text, model wording, and manual-check wording remain planning or implementation detail unless an owning requirement records them as Accepted. Accepting these bounds does not authorize implementation or promote a scanner, browser, model, embedding model, vector store, or framework to a release dependency.

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
- **Deterministic evidence:** retain the native `color-contrast` result bucket, rule and check identity, stable target and profile, and axe-emitted foreground color, background color, contrast ratio, expected ratio, font size, font weight, and incomplete reason when present. Retain the same fields in the corrected positive target observation. Do not independently turn a rounded or displayed number into a pass.
- **Minimum guidance:** WCAG 2.2 SC 1.4.3 and its contrast definitions, [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), and [Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18). G145 is unnecessary for this deliberately normal-text profile.
- **Permitted model contribution:** explain the retained measurement and applicable threshold, describe possible readability impact, and propose changing the foreground, background, or both subject to reviewer constraints. Any candidate color is a proposal that requires a rescan; the model may not state that an unmeasured pair passes.
- **Required human judgment:** confirm that the target is meaningful ordinary text rather than incidental content or a logotype; confirm its rendered size/weight classification and the controlled opaque-background assumptions; review design meaning and other visual states that this one profile does not exercise.
- **Conservative comparison:** define the comparison-only ordered measure as `contrast margin = retained numeric measured ratio - validated numeric component of the retained expected-ratio string`; higher is better only when target, engine, browser/profile, evidence-normalization version, font classification, threshold, and retained precision are identical. `resolved` requires a baseline violation and later native pass. Among two determinate violations, a strictly higher later margin is `improved` but remains unresolved, an equal retained margin is `persistent`, and a strictly lower margin is `regressed`; a native pass followed by a violation is also `regressed`. Incomplete or non-comparable measurements are `inconclusive`. No third fixture revision is required merely to define the possible `improved` outcome.

The version-pinned axe [contrast evaluation source](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js) exposes the retained measurement fields and reports a truncated ratio, which is why the scanner bucket—not comparison arithmetic—controls pass or resolution.

#### Scope-decision history

- **OD-002 (superseded):** earlier on 2026-08-24, the portfolio slice accepted only the `image-alt` scenario and deferred the other families. Its original resolution remains preserved in the [decision register](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#resolved-decisions-for-the-first-portfolio-slice).
- **OD-019 (current, Accepted):** later on 2026-08-24, explicit product direction replaced that one-scenario boundary with exactly the three profiles above. This replacement does not authorize implementation, select release dependencies, expand scanning to live pages, or alter the evaluation-only scope of the applicable ADRs.

### Out of scope for the MVP

**Status:** The non-certification, no-automatic-modification, authorization, public-data, exactly-three-scenario coverage, no-live-site/arbitrary-URL/authenticated-target/crawler, and single-user/no-account boundaries are Accepted. The remaining deferrals in this list stay Proposed until their owning decision records state otherwise.

- Accessibility certification, compliance badges, legal advice, or whole-page/whole-site conformance claims.
- Claims that the absence of automated findings means a page is accessible.
- Automatic source-code edits, pull requests, or deployments.
- Live-site scanning, arbitrary-URL input, site crawling, target discovery, or any crawler specification or implementation.
- Authenticated production pages or persistence of browser credentials.
- Accounts, roles, permissions, assignments, notifications, teams, or collaboration workflows.
- Any accessibility-rule coverage beyond the three selected profiles, cross-browser equivalence, mobile-device coverage, or production-scale concurrency.
- A generic chatbot as the primary interface. Chat, if later included, remains secondary.
- Automatic learning from rejected proposals or unreviewed page content.
- Public exposure of private page content, source code, evidence, prompts, or traces.
- Local model configurations that require hardware beyond the documented reference PC or remote compute to complete the representative workflow.

## Terminology

Terms prefixed with **Candidate** below are proposed or Deferred vocabulary from the architecture review. Their definitions make those ideas precise without adding them to the MVP. Formal support, promotion, release-evidence, generalized acquisition, and advanced work-ownership machinery remain Deferred.

| Term | Definition |
| --- | --- |
| Authorized target | A single page or controlled fixture the user is permitted to analyze, with the declared scope recorded. The MVP target set contains only the three project-owned controlled scenario profiles. |
| Controlled fixture | A deliberately constructed local page state with known expected accessibility evidence. |
| Controlled scenario profile | One of the three accepted MVP scenario identities and rule/WCAG pairings, with project-owned synthetic failing and corrected states and one stable intended target. One operation selects one profile. The scenario content, expected native rule result, scenario ID, stable target key, fixture revision, browser profile, and rule profile are frozen before evaluation; their physical fixture-file layout is an implementation detail. |
| Transient scan observation | The in-memory native scanner result and execution metadata produced by Step 1 for immediate consumption by Step 2; it is not a durable finding or evidence record. |
| Scan run | One execution of a versioned scanner configuration against a recorded target state. |
| Finding | A scanner observation. A finding is not automatically a confirmed accessibility issue. |
| Page evidence | The minimal captured data needed to inspect and reproduce one finding, such as rule output, locator, allowlisted DOM facts, check data, or measured values. The first slice retains one rule-specific source-evidence item per selected finding. |
| Positive target observation | A narrow, non-failing observation retained only when the selected comparison profile needs to prove that the same target and rule scope were exercised in a corrected scan. It retains the profile's required association or measurement facts, not a page-wide pass set. |
| Corpus snapshot | An immutable, identified collection of approved and versioned guidance sources and derived chunks. |
| Guidance passage | A traceable excerpt retrieved from a corpus source. |
| Model interpretation | Generated explanation, impact analysis, or remediation text; it is never deterministic evidence. |
| Generation provider | A replaceable adapter that executes the structured-generation contract without changing the evidence, retrieval, review, or comparison domains. |
| Provider profile | The non-secret configuration identifying either the selected local runtime and model or Groq model ID `openai/gpt-oss-20b` for the fixed MVP API evaluation. A credential reference may exist only on the local-service side; provider selection remains explicit per run. |
| Candidate: readiness dimensions | Separately observed facts covering host compatibility, runtime availability, exact artifact installation, adapter health, and eligibility for the requested workload. Passing one dimension does not imply that another passed. |
| Candidate: support state | A state attached to one exact provider, model, runtime, context, and hardware profile, proposed as **evaluation-only**, **capacity-qualified**, **development-supported**, **release-qualified**, **excluded**, or **unknown**. Capacity qualification alone does not imply release qualification. |
| Candidate: work identity | An immutable identifier and revision that determine whether an asynchronous operation still owns its inputs and is eligible to publish a result. |
| Candidate: acquisition manifest | An application-owned, versioned record of an optional runtime or model artifact's exact identity, source, license, sizes, integrity data, allowed network origins, staging rules, compatibility profile, and install/removal ownership. |
| Candidate: activated provider profile | The configured and readiness-verified provider profile selected for future generation. Installing a local artifact does not by itself activate or select its profile; an external-API profile is configured rather than installed. |
| Candidate: release evidence set | Content-safe, immutable evidence binding a particular build or package to its exact component inventory, validation environment, applicable support claims, known blind spots, and distribution status. |
| Local LLM mode | Generation through the selected, configured, and readiness-checked runtime on the user's computer, with no model prompt or response sent to an external inference service. Explicit model acquisition is a separate setup action. |
| Groq API mode | Generation through Groq, the MVP's first and only external provider, after data-egress, privacy, retention, rate-limit, and failure behavior are disclosed and accepted. Use of an OpenAI-compatible API shape does not make Groq an OpenAI service. |
| Model artifact | A separately acquired model file or set of files with a recorded source, identifier, immutable digest, quantization or format, license, size, storage location, and verification state. |
| Provider setup | A local-service workflow that validates the chosen generation mode and acquires or configures only what the user explicitly authorizes. Local model acquisition is separate from the repository; Groq credentials never enter browser-delivered code or durable run records. |
| Remediation proposal | The generated proposal version awaiting a review decision. A reviewer-edited successor remains a proposal version but is explicitly reviewer-authored rather than AI-generated. |
| Accepted remediation plan | A proposal explicitly approved, or edited and accepted, by a reviewer. |
| Manual-check definition | Immutable instructions, purpose, timing, and blocking classification for a human evaluation. |
| Manual-check result | One execution occurrence referencing a manual-check definition, proposal, reviewer, time, status, and—when completed—observed outcome and relationship to that proposal. A post-change occurrence may also reference its later scan and comparison. |
| Evidence sufficiency | The deterministic pre-generation gate over the required finding evidence and retrieved guidance. Guidance support is `supported`, `incomplete`, `missing`, or `conflicting`; only complete required evidence plus a completed `supported` retrieval is proposal-eligible. This is not model confidence or an accessibility score. |
| Material claim | A statement that changes the interpretation of a finding, its user impact, the recommended remediation, or the meaning of a comparison. Material claims require direct evidence and citation support. |
| High-impact remediation claim | A material recommendation that could create or preserve a serious accessibility barrier, remove content or functionality, weaken security or privacy, or materially change user interaction. |
| Unsafe proposal | A proposal that could introduce a barrier or harmful side effect, relies on a prohibited claim, or recommends a material change without adequate evidence and guidance. |
| Reviewer | The frontend developer making the one current remediation decision. A QA user may reproduce the finding, inspect evidence, and verify the later change without creating a separate application role or assignment. A review decision is useful evaluation feedback, not automatic ground truth or a compliance determination. |
| Candidate: critical blocker | A possible future application-accessibility severity term for a defect that prevents a core workflow. The MVP has no formal support or qualification matrix. |
| Candidate: screen-reader scenario | A possible future versioned test procedure for a specific operating system, browser, screen reader, workflow, expected announcements, and pass rule. Formal matrix qualification is Deferred. |
| Abstention | A structured result with no remediation conclusion because support is insufficient, conflicting, or invalid. It cannot become an accepted remediation plan. |
| Comparable scans | Scan runs whose target state and material configuration are sufficiently aligned for a supported comparison. |
| Scan comparison outcome | An evidence-backed relationship between findings from two comparable runs; distinct from an AI evaluation regression. |
| Scan-pair comparison | One comparison record for a baseline scan and later scan, containing comparability, an enclosing workflow-run reference, limitations, and identified finding-comparison entries. It does not introduce a second operation lifecycle. |
| Finding-comparison entry | One addressable child of a scan-pair comparison containing a correlation rationale, before-and-after evidence references, and one applicable finding outcome. |
| MVP finding identity | The scenario ID, rule ID, stable fixture-target key, fixture revision, and minimized rule evidence used to correlate controlled before-and-after observations. A selector is supporting evidence only; the MVP does not retain a general DOM fingerprint, full HTML, or a virtual-DOM snapshot. |
| Contrast margin | A comparison-only value equal to the retained numeric axe-reported measured ratio minus the validated numeric component of the retained axe-reported expected-ratio string. It is ordered only under an identical contrast and evidence-normalization profile, is not a WCAG or confidence score, and never overrides the scanner's native pass/fail bucket. |
| Local run record | The content-safe, canonical machine-readable record for one local run. It retains only the minimized evidence, guidance-passage references, proposal or abstention, review decision, and comparison needed to reopen that controlled run; it is not a compliance audit record. |

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
