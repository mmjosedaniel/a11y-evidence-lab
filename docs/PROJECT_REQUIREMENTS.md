# Project requirements

## Document status

- **Repository stage:** Idea exploration
- **Document status:** Planning baseline
- **Main goal status:** Accepted on 2026-08-23
- **Current authorized-public-page MVP scope:** Accepted on 2026-08-25 through OD-020, superseding OD-019's runtime-input and one-profile-at-a-time boundary
- **Fixed three-scenario evaluation baseline:** Retained from OD-019 for deterministic evaluation
- **MVP persona, provider, startup, retention, evaluation, and workflow narrowing:** Accepted or Deferred as recorded on 2026-08-25 through OD-001 and OD-003 through OD-020
- **Implementation status:** Not started
- **Last reviewed:** 2026-08-25

This document is the canonical index and global authority for the current product goal and the modular, stage-scoped requirements baseline. The linked requirement modules collectively define the first portfolio slice and later distributable-product obligations; none describes implemented behavior. Requirement status has the following meaning:

- **Accepted:** approved project decision with a recorded basis and acceptance date.
- **Proposed:** candidate requirement requiring confirmation before development.
- **Deferred:** valid requirement intentionally placed outside the current baseline.
- **Rejected:** considered and declined with a recorded rationale.
- **Superseded:** replaced by another identified requirement; the replacement ID must be recorded.

Candidate technologies remain proposals unless this document or a later decision explicitly accepts them.

### Candidate architecture review status

**Status: Proposed candidate.** The architecture and implementation patterns added from the Voxleaf reference review are inputs for later evaluation only. They do not accept a technology or design, authorize implementation, add a release dependency, qualify a provider or model, or independently change the scope of an accepted ADR. No Voxleaf implementation has been copied into this repository.

Candidate-derived requirements are consolidated in this requirements baseline. Proposed designs and technology assessments remain separately organized under the architecture documentation; the 2026-08-25 resolutions narrow which parts enter the MVP and which remain Deferred. If a candidate later becomes a significant durable architectural decision, it must be recorded in an ADR; accepting a bounded UX, testing, or validation requirement does not automatically require a separate ADR. The MVP has one compact evaluation manifest and no formal support matrix, promotion process, or release-qualification claim.

Within identified requirement rows, **must**, **should**, and **may** express requirement priority:

- **Must:** required before the requirement's applicable delivery stage or claim can be considered complete. A distribution-only Must does not block the local portfolio MVP.
- **Should:** important within its applicable stage, but deferrable when it would prevent completion of that stage's core outcome.
- **May:** optional enhancement.

Outside identified requirement rows, those words are ordinary explanatory language and do not create additional requirements. Requirement IDs are stable and must not be reused if a requirement is retired. Planned verification describes future acceptance evidence, not work that has already occurred. If summary prose conflicts with an identified requirement, the requirement row and its recorded status control.

## Main goal

> Build an evidence-centered web accessibility investigation and remediation-review application that helps a frontend developer turn deterministic findings into traceable, guidance-backed decisions that can be reviewed and verified through rescans, with QA engineers as secondary users.

The application must preserve the evidence behind each finding, retrieve relevant guidance from a curated and versioned corpus, determine evidence sufficiency before model invocation, generate cited remediation proposals with explicit confidence, uncertainty, and required manual checks only when the evidence is eligible, require human review before a proposal is accepted, and compare later scans without overstating what the comparison proves.

The application supports accessibility investigation and engineering decisions. It is not an accessibility certification tool, does not determine legal compliance or whole-site conformance, and does not modify source code automatically.

For the portfolio MVP, one analysis run accepts one user-entered public HTTPS URL only after the user explicitly attests that the page is authorized for analysis. One atomic, provider-independent browser scan executes exactly axe-core `image-alt`, `label`, and `color-contrast` and retains every in-envelope violation node as an independent finding. Native `incomplete` observations remain distinct. Zero findings is valid only after complete three-rule coverage; exceeding a safety or resource bound fails visibly and cannot publish a complete or silently truncated result. The user then processes one selected finding at a time through retrieval, generation or abstention, individual review, and later comparison. [OD-020](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) owns this accepted product scope, and [ADR-0017](architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md) owns its scan trust boundary.

The three project-owned synthetic profiles—`informative-image-alt`, `form-input-label`, and `text-contrast`—remain the fixed, reproducible evaluation baseline for those rules; they are evaluation inputs, not runtime page inputs. Authenticated targets, non-public network destinations, link discovery, crawling, multi-page or batch intake, bulk generation, broader rule coverage, automatic code changes, and compliance or certification claims remain outside the MVP.

## Supporting engineering objective

The secondary objective is to demonstrate and evaluate an observable retrieval-augmented generation (RAG) workflow with deterministic scanner evidence, traceable retrieval, structured generation, an individual human decision for each processed finding, content-safe local records, and a compact fixed synthetic evaluation manifest that cannot support broader product or release claims.

RAG is part of the accepted project direction. ADR-0013 accepts LangChain only as the initial evaluation baseline for the bounded retrieve-then-generate integration that the portfolio is intended to demonstrate. Scanning, evidence capture, review, and comparison remain application-owned TypeScript behavior rather than LangChain responsibilities. LangGraph is deferred until a demonstrated resume or recovery requirement makes plain application state insufficient. LangSmith, hosted tracing, telemetry, and analytics are Deferred outside the MVP; content-safe local records and diagnostics are sufficient. TypeScript and React are accepted only as the initial application-language and client-interface evaluation baselines in ADR-0011 and ADR-0012. Every accepted evaluation baseline still requires measurement before any later release adoption, and the product requirements take precedence over framework demonstration.

## Requirements modules and task routing

Each identified requirement, assumption, risk, and open decision is defined in exactly one module. Read this index first, then load only the modules relevant to the task. When a change affects status, scope, release readiness, or development authorization, also read [Delivery readiness and open decisions](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md).

| Task concerns | Read first |
| --- | --- |
| Product purpose, persona, authorized-public-page scope, fixed evaluation scenarios, exclusions, or terminology | [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md) and [OD-020](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) |
| Public-URL authorization; deterministic three-rule scanning; finding and evidence capture; guidance corpus and retrieval; generated proposals or abstentions; human review and manual checks; rescan comparison; or evidence-oriented interface and export | [Evidence and review workflow](requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md) and [ADR-0017](architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md) |
| Global Local/Groq analysis mode, per-finding provider invocation, capability, readiness, isolation, or provider support qualification | [Generation provider execution](requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md) |
| MVP local-service startup, explicit model acquisition, provider setup, or later installation, packaging, update, removal, or uninstall | [Installation and model lifecycle](requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md) |
| Accessibility of A11y Evidence Lab | [Application accessibility](requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md) |
| Privacy, security, credentials, egress, renderer isolation, or untrusted-content boundaries | [Privacy and security](requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md) |
| Reliability, reproducibility, runtime contracts, component-inventory contract, practical resource observations, service ownership, failure, or new-run retry | [Reliability, reproducibility, and operations](requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) |
| MVP behavioral specification, planning-level acceptance examples, evaluation authority, datasets, metrics, qualification, provider comparison, or acceptance targets | [Evaluation and acceptance](requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md) |
| Release-inventory derivation or verification, packaged validation, release evidence, or release claims | [Release inventory, evidence, and claims](requirements/evaluation-and-release/RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md), plus the canonical [component-inventory contract](requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) |
| Minimal canonical run records, provenance, review/comparison lineage, workflow state, failure, or new-run retry semantics | [Information and workflow lifecycle model](requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) |
| Proposed system topology, technology constraints, or implementation patterns | [Candidate architecture](architecture/CANDIDATE_ARCHITECTURE.md) |
| Delivery sequence, assumptions, risks, open decisions, or the pre-development readiness gate | [Delivery readiness and open decisions](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md) |
| Reference-PC capacity, local models, tools, runtime feasibility, or practical capacity-check setup | [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md), plus the applicable requirement and ADR modules |
| Voxleaf-derived reuse candidates, adaptation limits, provenance, or non-adoptions | [Voxleaf implementation pattern assessment](architecture/candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) |

Requirement rows and recorded statuses are authoritative only in the focused canonical requirement modules linked above. Their family indexes route related modules but own no requirement row or status. Candidate architecture and assessment entries are Proposed routing inputs, not requirement authorities or implementation authorization.

The Evidence and review workflow module owns the requirement IDs and recorded statuses for these workflow topics. Its six [workflow-step technical assessments](architecture/README.md#workflow-step-technical-assessments) are Proposed research inputs only. Use the documentation task router to load only the assessment for the affected step; an assessment cannot override an identified requirement or accepted ADR.

The status vocabulary, priority meanings, ID rules, and precedence defined above apply to every module. A module summary, diagram, candidate assessment, or historical plan cannot override an identified requirement row or an accepted ADR within its scope.

## Traceability to existing documentation

### Proposed candidate inputs

The following inputs explain Proposed requirements or candidate architecture detail. They are not acceptance authority and do not modify the accepted ADRs.

| Candidate input | Contribution and status |
| --- | --- |
| Six [workflow-step technical assessments](architecture/README.md#workflow-step-technical-assessments) | Propose focused technical approaches for authorized scanning, finding and evidence capture, guidance retrieval, evidence-grounded generation, human review, and rescan comparison. They own no requirements, accept no open decision, authorize no implementation, and preserve the evaluation-only scope of referenced technologies. |
| Voxleaf documentation and implementation-reference review, summarized in [Voxleaf implementation pattern assessment](architecture/candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) | Provides reference patterns for contracts, deterministic processing, work ownership, evaluation, readiness, acquisition, renderer projection, recovery, inventory, packaging validation, and documentation discipline. No code or threshold is adopted. |
| [Candidate architecture first-slice and deferred patterns](architecture/CANDIDATE_ARCHITECTURE.md#first-slice-candidate-patterns) | Consolidates the minimal proposed implementation shape and separates later candidates by their evidence trigger without authorizing development. |
| OD-015 through OD-018, as narrowed by OD-020 | The 2026-08-25 resolutions accept minimal TypeScript records with runtime validation at trust boundaries, simple manual heading-aware corpus segmentation, and a three-state single-analysis lifecycle. OD-020 replaces only the former one-scenario work-unit cardinality; it does not add queues, workers, orchestration, or promotion machinery. Candidate documents remain non-authoritative implementation inputs. |

### Accepted requirement decisions

The requirements-definition request and the subsequent user directions on provider choice, the historical Windows-delivery direction, existing-PC capacity, and technology evaluation baselines are the acceptance authority for decisions recorded on 2026-08-23. OD-019's 2026-08-24 three-scenario direction superseded OD-002 and now remains the fixed evaluation baseline. On 2026-08-25, explicit product direction accepted the primary frontend-developer and secondary-QA personas; local-browser startup; two generation modes using a downloaded local model or Groq; no automatic fallback; bounded local retention; and the other narrowed MVP behaviors recorded through OD-003 to OD-018. OD-020 subsequently accepted one authorized public HTTPS page per analysis, the exact three-rule variable-finding scan, global immutable generation mode, and one-finding-at-a-time downstream work. It supersedes OD-019 only where that record limited runtime input to synthetic profiles and limited a scan to one profile/finding. The historical decisions remain visible rather than silently rewritten.

| Accepted requirement IDs or product decision | Basis |
| --- | --- |
| `OD-001` | [Product scope — Intended users](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#intended-users) accepts a frontend developer as the primary user and QA as the secondary user, without accounts, roles, permissions, assignments, or collaboration features. |
| MVP dual-generation decision | [ADR-0014](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) accepts Groq as the first and only external MVP provider and `openai/gpt-oss-20b` as its fixed structured-output evaluation model. OD-020 applies one explicit immutable Local/Groq choice to an analysis and forbids provider mixing or automatic fallback. |
| MVP startup decision | [ADR-0015](architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md) accepts a developer-started local service with a Chrome or Edge loopback UI and supersedes ADR-0002's installer direction for the MVP. |
| MVP persistence decision | [ADR-0016](architecture/decisions/ADR-0016-filesystem-run-persistence.md) accepts one local run directory with canonical JSON and an optional Markdown report, without a database, backup, synchronization, telemetry, or audit platform. |
| `OD-019` | Historical predecessor and current evaluation-baseline authority. It retains the three project-owned synthetic profiles, their rule/WCAG pairings and failing/corrected states, deterministic contrast-measurement retention, and fixed evaluation role. OD-020 supersedes its synthetic-only runtime-input and one-profile-at-a-time clauses without rewriting them. |
| `OD-020` | [Authorized public page analysis scope](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) accepts one user-attested public HTTPS URL per analysis, exactly the three accepted axe rules, all in-envelope violation-node findings, distinct incomplete observations, fail-visible bounds, one selected finding at a time downstream, one global immutable Local/Groq mode, and the continued exclusion of authentication, crawling, batch generation, broader rules, and compliance claims. |
| `REQ-AUTH-005`, `REQ-AUTH-006`, `REQ-SCAN-006`, `REQ-SCAN-007`, `REQ-EVID-001`, `REQ-EVID-007`–`REQ-EVID-009`, `REQ-RETR-005`, `REQ-GEN-010`, `REQ-REV-008`, and `REQ-UX-010`–`REQ-UX-012` | [OD-020](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope), [ADR-0017](architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md), [Project overview — Planned workflow and boundaries](../README.md), and [Project concept — Possible user flow and intended boundaries](PROJECT_CONCEPT.md) |
| `REQ-EVID-004`, `REQ-GEN-005` | [Project context — Direction and product boundaries](PROJECT_CONTEXT.md) |
| `REQ-RETR-002`, `REQ-RETR-004`, `REQ-GEN-002` | [Project concept — Engineering objective and possible user flow](PROJECT_CONCEPT.md) |
| `REQ-GEN-006`, `REQ-COMP-005`, `REQ-UX-003`, `REQ-SEC-007` | [Project concept — Intended boundaries](PROJECT_CONCEPT.md) and [Project context — Product boundaries](PROJECT_CONTEXT.md) |
| `REQ-REV-001` | [Project overview — Overview and planned workflow](../README.md) and [Project concept — Basic implementation flow](PROJECT_CONCEPT.md) |
| `REQ-COMP-004` | [Project context — Direction](PROJECT_CONTEXT.md) and [Project concept — Possible user flow](PROJECT_CONCEPT.md) |
| `REQ-EVAL-002` | [Project concept — Engineering objective](PROJECT_CONCEPT.md) and [Project context — Direction](PROJECT_CONTEXT.md) |
| `REQ-LLM-001`–`REQ-LLM-010`, `REQ-LLM-015`, `REQ-LLM-016`, `REQ-LLM-018`, and `REQ-SEC-005` | [ADR-0001 — Interchangeable generation providers](architecture/decisions/ADR-0001-interchangeable-generation-providers.md), [ADR-0014 — Groq as the MVP external provider](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md), and [ADR-0017 — Authorized public-page scan boundary](architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md): provider-neutrality, one global explicit Local/Groq mode, finding-specific invocation, disclosed minimized egress, and no fallback are binding MVP scope; `openai/gpt-oss-20b` is the fixed evaluation configuration only |
| `REQ-LLM-011` | [ADR-0003 — Initial local generation capacity-screen configuration](architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md), [ADR-0004 — Reference-PC capacity gate](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), and [ADR-0005 — Ollama as the initial local model runtime](architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md), accepted as evaluation bootstrap decisions rather than release-qualified user recommendations |
| `REQ-QUAL-009` | [ADR-0004 — Reference-PC capacity gate](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), accepted from the existing-hardware constraint confirmed on 2026-08-23 |
| `REQ-QUAL-010` | [ADR-0011 — TypeScript as the initial application language](architecture/decisions/ADR-0011-typescript-as-initial-application-language.md), accepted to keep compile-time types distinct from runtime trust-boundary validation |
| `REQ-SEC-019` | [ADR-0012 — React as the initial user-interface library](architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), accepted to keep the browser renderer unprivileged and untrusted content isolated from application authority |

The earlier installer-specific `REQ-INST-001`, `REQ-INST-002`, `REQ-INST-003`, `REQ-INST-004`, `REQ-INST-007`, and `REQ-SEC-017` acceptance remains historical. Their current status is governed by the [Installation and model lifecycle](requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md) and [Privacy and security](requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md) authorities after the 2026-08-25 no-installer MVP decision.

### Source contributions

| Source | Contribution to this baseline |
| --- | --- |
| [Project overview](../README.md) | Product purpose, planned workflow, engineering objective, current status, and public boundaries. |
| [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md) | Current authorized-public-page MVP boundary, fixed three-scenario evaluation baseline, and preserved OD-002/OD-019/OD-020 decision history. |
| [Project context](PROJECT_CONTEXT.md) | Evidence-centered direction, separation of deterministic and generated information, human judgment, local-first feasibility, and product limits. |
| [Project concept](PROJECT_CONCEPT.md) | Workflow stages, user review, rescanning, intended framework roles, fixed evaluation inputs, and Deferred distribution questions. |
| [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md) | Reference hardware, published feasibility evidence, initial technology evaluation baselines, and their validation needs; local feasibility remains subject to the representative practical capacity check. |
| [ADR-0001](architecture/decisions/ADR-0001-interchangeable-generation-providers.md) | Accepted provider-neutral generation boundary, explicit local/API selection, shared provider contract, and no automatic fallback. |
| [ADR-0002](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md) | Preserves the historical 2026-08-23 Windows-installer direction; the 2026-08-25 local-browser MVP decision supersedes that direction for the current slice while keeping model acquisition explicit and outside the repository. |
| [ADR-0003](architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md) | Accepted Qwen3.5 4B as the first practical capacity-screen configuration. Its 2026-08-25 amendment Defers Qwen3.5 9B, a second local-model comparison, and any release-qualified recommendation outside the MVP. |
| [ADR-0004](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md) | Accepted the metadata prefilter and practical on-device capacity screen that exclude oversized models before the compact MVP evaluation, without creating performance, support, or recommendation claims. |
| [ADR-0005](architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md) | Accepted Ollama only as the initial local runtime to evaluate behind the provider-neutral boundary; release dependency and ownership remain open. |
| [ADR-0006](architecture/decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md) | Accepted EmbeddingGemma only as the initial local embedding model to evaluate under retrieval-quality, capacity, reproducibility, and provenance gates. |
| [ADR-0007](architecture/decisions/ADR-0007-chroma-as-initial-local-vector-store.md) | Accepted Chroma only as the initial local derived-index technology to evaluate under bounded lookup, filtering, deterministic rebuild, identity, deletion, failure-visibility, resource, and zero-egress checks. Backup, migration, cascading deletion, atomic activation, corruption recovery, packaging, and release qualification are Deferred. |
| [ADR-0008](architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md) | Accepted Playwright with pinned Chromium only as the initial browser-automation technology to evaluate; ADR-0017 governs its mandatory authorized-public-page network and isolation boundary. |
| [ADR-0009](architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md) | Accepted axe-core only as the initial deterministic accessibility scanner to evaluate for the exact three-rule MVP, without implying complete coverage or certification. |
| [ADR-0010](architecture/decisions/ADR-0010-defer-a-local-reranker.md) | Accepted omission of a reranker from the initial baseline until fixed retrieval evidence demonstrates a material ranking need. |
| [ADR-0011](architecture/decisions/ADR-0011-typescript-as-initial-application-language.md) | Accepted TypeScript only as the initial application-language evaluation baseline with independent type checking, minimal runtime validation at actual MVP trust boundaries—including the public-target boundary added by ADR-0017—adapter isolation, no schema framework, and no implied runtime or framework selection. |
| [ADR-0012](architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) | Accepted React only as the initial client-interface evaluation baseline, with durable and privileged behavior kept behind the application-owned local API. |
| [ADR-0013](architecture/decisions/ADR-0013-langchain-as-initial-rag-integration.md) | Accepted LangChain only as the initial two-step RAG integration baseline applied to one selected finding at a time; scan execution, human decisions, domain records, LangGraph, and LangSmith remain outside that acceptance scope. |
| [ADR-0014](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) | Accepted Groq as the first and only external MVP provider, behind the global Local/Groq analysis choice and shared application contract, with minimized disclosed per-finding egress and no automatic fallback; fixed model ID `openai/gpt-oss-20b` is Accepted only for the MVP evaluation. |
| [ADR-0015](architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md) | Accepted the developer-started local application service and ordinary Chrome or Edge loopback UI, with installer, desktop wrapper, Start menu, and packaging work Deferred; ADR-0017 supersedes only its synthetic-target prohibition. |
| [ADR-0016](architecture/decisions/ADR-0016-filesystem-run-persistence.md) | Accepted a minimal local filesystem run store with one analysis run and its finding-level records in canonical JSON, optional Markdown, run-directory deletion, and no database, backup, synchronization, or audit system. |
| [ADR-0017](architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md) | Accepts the public-HTTPS target, public-address and redirect validation, ephemeral browser isolation, constrained scan egress, exact three-rule coverage, and fail-visible scan-completeness boundary for OD-020. Exact numeric resource limits remain Proposed. |

The requirements also reflect the W3C distinction between normative WCAG success criteria and informative supporting guidance, and the documented limitation that accessibility evaluation requires both automated and human evaluation. The official sources linked in the [curated accessibility guidance corpus assessment](architecture/candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md#accepted-closed-eight-artifact-w3c-pack) retain their recorded verification dates.

## Documentation navigation

- Previous: [Project concept](PROJECT_CONCEPT.md)
- [Project documentation index](README.md)
- Start with: [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md)
- Related evidence: [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md)
