# Project requirements

## Document status

- **Repository stage:** Idea exploration
- **Document status:** Planning baseline
- **Main goal status:** Accepted on 2026-08-23
- **Current trusted developer-input MVP scope:** Accepted on 2026-08-27 through OD-021, narrowing OD-020's production-style public-target security boundary while retaining its one-page, exact-three-rule interaction
- **Portfolio YAGNI boundary:** Accepted on 2026-08-27 through OD-022, removing infrastructure and lifecycle machinery that does not demonstrate the end-to-end RAG slice
- **Fixed three-scenario evaluation baseline:** Retained from OD-019 for deterministic evaluation
- **MVP persona, provider, startup, retention, evaluation, and workflow narrowing:** Accepted or Deferred as recorded through OD-022
- **Implementation status:** Not started
- **Last reviewed:** 2026-08-27

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

For the portfolio MVP, one analysis run accepts one developer-entered non-authenticated public HTTPS URL as trusted input. The user is responsible for choosing a page they are permitted to analyze; the application does not independently prove public reachability, ownership, or safety. One atomic, provider-independent browser scan executes exactly axe-core `image-alt`, `label`, and `color-contrast` and retains every returned violation node as an independent finding. Native `incomplete` observations remain distinct. Zero findings is valid only after complete three-rule coverage, and a navigation, scanner, validation, or persistence failure must remain visible rather than becoming a complete or silently truncated result. The user then processes one selected finding at a time through retrieval, generation or abstention, individual review, and later comparison. [OD-021](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) owns this narrowed product scope, and [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) owns its proportional scan boundary.

The three project-owned synthetic profiles—`informative-image-alt`, `form-input-label`, and `text-contrast`—remain the fixed, reproducible evaluation baseline for those rules; they are evaluation inputs, not runtime page inputs. Authenticated targets, non-public network destinations, link discovery, crawling, multi-page or batch intake, bulk generation, broader rule coverage, automatic code changes, and compliance or certification claims remain outside the MVP.

## Supporting engineering objective

The secondary objective is to demonstrate and evaluate an observable retrieval-augmented generation (RAG) workflow with deterministic scanner evidence, traceable retrieval, structured generation, an individual human decision for each processed finding, content-safe local records, and a compact fixed synthetic evaluation manifest that cannot support broader product or release claims.

RAG is part of the accepted project direction. ADR-0013 accepts LangChain only as the initial evaluation baseline for the bounded retrieve-then-generate integration that the portfolio is intended to demonstrate. Scanning, evidence capture, review, and comparison remain application-owned TypeScript behavior rather than LangChain responsibilities. LangGraph is deferred until a demonstrated resume or recovery requirement makes plain application state insufficient. LangSmith, hosted tracing, telemetry, and analytics are Deferred outside the MVP; content-safe local records and diagnostics are sufficient. TypeScript and React are accepted only as the initial application-language and client-interface evaluation baselines in ADR-0011 and ADR-0012. Every accepted evaluation baseline still requires measurement before any later release adoption, and the product requirements take precedence over framework demonstration.

## Requirements modules and task routing

Each identified requirement, assumption, risk, and open decision is defined in exactly one module. Read this index first, then load only the modules relevant to the task. When a change affects status, scope, release readiness, or development authorization, also read [Delivery readiness and open decisions](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md).

| Task concerns | Read first |
| --- | --- |
| Product purpose, persona, trusted developer-input scope, fixed evaluation scenarios, exclusions, or terminology | [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md) and [OD-021](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) |
| Trusted page intake; deterministic three-rule scanning; finding and evidence capture; guidance corpus and retrieval; generated proposals or abstentions; human review and manual checks; rescan comparison; or evidence-oriented interface and export | [Evidence and review workflow](requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md) and [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) |
| Global Local/Groq analysis mode, per-finding provider invocation, actual-call validation, isolation, or provider support qualification | [Generation provider execution](requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md) |
| MVP local-service startup, manual developer-managed Ollama/model setup, or later installation, packaging, update, removal, or uninstall | [Installation and model lifecycle](requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md) |
| Accessibility of A11y Evidence Lab | [Application accessibility](requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md) |
| Privacy, security, credentials, egress, renderer isolation, or untrusted-content boundaries | [Privacy and security](requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md) |
| Reliability, reproducibility, runtime contracts, deferred component-inventory work, practical resource observations, service ownership, failure, or starting a new independent run | [Reliability, reproducibility, and operations](requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) |
| MVP behavioral or hard-boundary specification, planning-level acceptance examples, evaluation authority, datasets, metrics, qualification, provider comparison, or acceptance targets | [Evaluation and acceptance](requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md) is authoritative; [documentation-only Gherkin specifications](specs/README.md) provide derived, non-executable observable-behavior and hard-boundary views. |
| Release-inventory derivation or verification, packaged validation, release evidence, or release claims | [Release inventory, evidence, and claims](requirements/evaluation-and-release/RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md), plus the canonical [component-inventory contract](requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) |
| The single `run.json` aggregate, provenance, current review/comparison data, workflow state, or failure semantics | [Information and workflow lifecycle model](requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) |
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
| OD-015 through OD-018, as narrowed by OD-020 and OD-022 | The resolutions retain minimal TypeScript validation at actual external and persisted boundaries, manual heading-aware corpus segmentation, and a simple single-analysis lifecycle. OD-022 fixes one `run.json` aggregate and removes child-version, audit, preflight, and duplicated-specification machinery. Candidate documents remain non-authoritative implementation inputs. |

### Accepted requirement decisions

The requirements-definition request and subsequent user directions are the acceptance authority for the recorded decisions. OD-019's three-scenario direction remains the fixed evaluation baseline. The 2026-08-25 decisions accepted the personas, local-browser startup, Local/Groq generation, no fallback, bounded local retention, and the other narrowed MVP behaviors. OD-020 accepted one public HTTPS page, the exact three-rule variable-finding scan, global immutable generation mode, and one-finding-at-a-time downstream work. OD-021 replaced the hostile-public-target security model with a trusted developer-input boundary. On 2026-08-27, OD-022 further narrowed retrieval, local setup, persistence, review, provider disclosure, comparison, application-accessibility evaluation, and planning specifications under YAGNI. Superseded decisions remain visible rather than silently rewritten.

| Accepted requirement IDs or product decision | Basis |
| --- | --- |
| `OD-001` | [Product scope — Intended users](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#intended-users) accepts a frontend developer as the primary user and QA as the secondary user, without accounts, roles, permissions, assignments, or collaboration features. |
| MVP dual-generation decision | [ADR-0014](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) accepts Groq as the first and only external MVP provider and `openai/gpt-oss-20b` as its fixed structured-output evaluation model. OD-020 applies one explicit immutable Local/Groq choice to an analysis and forbids provider mixing or automatic fallback. |
| MVP startup decision | [ADR-0015](architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md) accepts a developer-started local service with a Chrome or Edge loopback UI and supersedes ADR-0002's installer direction for the MVP. |
| MVP persistence decision | [ADR-0021](architecture/decisions/ADR-0021-single-file-run-aggregate.md) accepts one local run directory containing one versioned `run.json`, without child files, Markdown reports, a database, backup, synchronization, telemetry, or audit platform. ADR-0016 remains superseded history. |
| `OD-019` | Historical predecessor and current evaluation-baseline authority. It retains the three project-owned synthetic profiles, their rule/WCAG pairings and failing/corrected states, deterministic contrast-measurement retention, and fixed evaluation role. OD-020 supersedes its synthetic-only runtime-input and one-profile-at-a-time clauses without rewriting them. |
| `OD-020` | [Authorized public page analysis scope](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) remains the authority for one public HTTPS page per analysis, exactly the three accepted axe rules, a complete violation-node finding collection, distinct incomplete observations, one selected finding at a time downstream, one global immutable Local/Groq mode, and the continued exclusion of authentication, crawling, batch generation, broader rules, and compliance claims. Its hostile-target enforcement clauses are superseded by OD-021. |
| `OD-021` | [Trusted operator URL boundary for the portfolio MVP](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) accepts the submitted public HTTPS URL as trusted developer input, makes target authorization the user's responsibility, retains only proportional single-page browser safeguards and visible scan failure, and defers production hostile-target isolation and exhaustive resource-bound qualification. |
| `OD-022` | [Portfolio MVP YAGNI simplification](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) accepts in-process exact vector retrieval, manual developer-managed local-model setup, one `run.json`, one current review decision, one run-level provider disclosure, exact-locator public comparison, compact application-accessibility smoke coverage, and slim planning specifications. |
| `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-006`, `REQ-SCAN-007`, `REQ-EVID-007`–`REQ-EVID-011`, `REQ-RETR-005`, `REQ-GEN-010`, `REQ-REV-008`, and `REQ-UX-010`–`REQ-UX-012` | [OD-020](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope), [OD-021](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp), [OD-022](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification), [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md), [Project overview — Planned workflow](../README.md#planned-workflow), and [Project concept — Possible user flow](PROJECT_CONCEPT.md#possible-user-flow). `REQ-EVID-001` remains superseded history. |
| `REQ-CORP-007`, `REQ-RETR-006`, and `REQ-REV-009` | [OD-022](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification), [ADR-0019](architecture/decisions/ADR-0019-in-process-exact-vector-search.md), and [ADR-0021](architecture/decisions/ADR-0021-single-file-run-aggregate.md) accept the minimal manifest, exact in-process retrieval, and one-current-decision representations. Their superseded predecessors remain decision history. |
| `REQ-EVID-004`, `REQ-GEN-005` | [Project context — Direction and product boundaries](PROJECT_CONTEXT.md) |
| `REQ-RETR-002`, `REQ-RETR-004`, `REQ-GEN-002` | [Project concept — Engineering objective and possible user flow](PROJECT_CONCEPT.md) |
| `REQ-GEN-006`, `REQ-COMP-005`, `REQ-UX-003`, `REQ-SEC-007` | [Project concept — Intended boundaries](PROJECT_CONCEPT.md) and [Project context — Product boundaries](PROJECT_CONTEXT.md) |
| `REQ-REV-001` | [Project overview — Overview and planned workflow](../README.md) and [Project concept — Basic implementation flow](PROJECT_CONCEPT.md) |
| `REQ-COMP-004` | [Project context — Direction](PROJECT_CONTEXT.md) and [Project concept — Possible user flow](PROJECT_CONCEPT.md) |
| `REQ-EVAL-002` | [Project concept — Engineering objective](PROJECT_CONCEPT.md) and [Project context — Direction](PROJECT_CONTEXT.md) |
| `REQ-LLM-001`–`REQ-LLM-005`, `REQ-LLM-007`–`REQ-LLM-009`, `REQ-LLM-015`, `REQ-LLM-016`, `REQ-LLM-019`, `REQ-LLM-020`, and `REQ-SEC-005` | [ADR-0001 — Interchangeable generation providers](architecture/decisions/ADR-0001-interchangeable-generation-providers.md), [ADR-0014 — Groq as the MVP external provider](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md), and OD-022: provider-neutrality, one global explicit Local/Groq mode, one run-level disclosure, finding-specific invocation, actual-call validation, minimized egress, and no fallback are binding MVP scope; `openai/gpt-oss-20b` is the fixed evaluation configuration only. |
| `REQ-LLM-011` | [ADR-0003 — Initial local generation capacity-screen configuration](architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md), [ADR-0004 — Reference-PC capacity gate](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), and [ADR-0005 — Ollama as the initial local model runtime](architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md), accepted as evaluation bootstrap decisions rather than release-qualified user recommendations |
| `REQ-QUAL-009` | [ADR-0004 — Reference-PC capacity gate](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), accepted from the existing-hardware constraint confirmed on 2026-08-23 |
| `REQ-QUAL-010` | [ADR-0011 — TypeScript as the initial application language](architecture/decisions/ADR-0011-typescript-as-initial-application-language.md), accepted to keep compile-time types distinct from runtime trust-boundary validation |
| `REQ-SEC-026` | [OD-021](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) and [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md), accepted for the proportional trusted-input browser boundary and explicit unsupported-use limitations |
| `REQ-SEC-027` | [ADR-0012 — React as the initial user-interface library](architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) and [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md), accepted to keep the browser renderer unprivileged, credentials outside browser code, and external strings rendered as text |

The earlier installer and application-managed acquisition requirements remain historical. Current MVP setup is governed by `REQ-INST-017`, `REQ-SEC-017`, [ADR-0020](architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md), and the owning requirement modules: the developer installs Ollama and pulls the fixed models outside the application.

### Source contributions

| Source | Contribution to this baseline |
| --- | --- |
| [Project overview](../README.md) | Product purpose, planned workflow, engineering objective, current status, and public boundaries. |
| [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md) | Current trusted developer-input MVP boundary, fixed three-scenario evaluation baseline, and preserved OD-002/OD-019/OD-020/OD-021 decision history. |
| [Project context](PROJECT_CONTEXT.md) | Evidence-centered direction, separation of deterministic and generated information, human judgment, local-first feasibility, and product limits. |
| [Project concept](PROJECT_CONCEPT.md) | Workflow stages, user review, rescanning, intended framework roles, fixed evaluation inputs, and Deferred distribution questions. |
| [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md) | Reference hardware, published feasibility evidence, initial technology evaluation baselines, and their validation needs; local feasibility remains subject to the representative practical capacity check. |
| [ADR-0001](architecture/decisions/ADR-0001-interchangeable-generation-providers.md) | Accepted provider-neutral generation boundary, explicit local/API selection, shared provider contract, and no automatic fallback. |
| [ADR-0002](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md) | Preserves the historical 2026-08-23 Windows-installer direction; the 2026-08-25 local-browser MVP decision supersedes that direction for the current slice while keeping model acquisition explicit and outside the repository. |
| [ADR-0003](architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md) | Accepted Qwen3.5 4B as the first practical capacity-screen configuration. Its 2026-08-25 amendment Defers Qwen3.5 9B, a second local-model comparison, and any release-qualified recommendation outside the MVP. |
| [ADR-0004](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md) | Accepts a metadata plausibility check plus one developer-run reference-PC smoke for the fixed local configuration, without an application preflight, hardware monitor, benchmark suite, or performance/support claim. |
| [ADR-0005](architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md) | Accepted Ollama only as the initial local runtime to evaluate behind the provider-neutral boundary; release dependency and ownership remain open. |
| [ADR-0006](architecture/decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md) | Accepted EmbeddingGemma only as the initial local embedding model to evaluate under retrieval-quality, capacity, reproducibility, and provenance gates. |
| [ADR-0007](architecture/decisions/ADR-0007-chroma-as-initial-local-vector-store.md) | Preserves the former Chroma evaluation decision, superseded for the MVP by ADR-0019 because the fixed small corpus does not justify a separate persistent vector service. |
| [ADR-0008](architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md) | Accepted Playwright with pinned Chromium only as the initial browser-automation technology to evaluate; ADR-0018 governs its proportional trusted-input portfolio boundary. |
| [ADR-0009](architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md) | Accepted axe-core only as the initial deterministic accessibility scanner to evaluate for the exact three-rule MVP, without implying complete coverage or certification. |
| [ADR-0010](architecture/decisions/ADR-0010-defer-a-local-reranker.md) | Accepted omission of a reranker from the initial baseline until fixed retrieval evidence demonstrates a material ranking need. |
| [ADR-0011](architecture/decisions/ADR-0011-typescript-as-initial-application-language.md) | Accepted TypeScript only as the initial application-language evaluation baseline with independent type checking, minimal runtime validation at the actual scanner, provider, local-runtime, and persisted-record boundaries, adapter isolation, no schema framework, and no implied runtime or framework selection. |
| [ADR-0012](architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) | Accepted React only as the initial client-interface evaluation baseline, with durable and privileged behavior kept behind the application-owned local API. |
| [ADR-0013](architecture/decisions/ADR-0013-langchain-as-initial-rag-integration.md) | Accepted LangChain only as the initial two-step RAG integration baseline applied to one selected finding at a time; scan execution, human decisions, domain records, LangGraph, and LangSmith remain outside that acceptance scope. |
| [ADR-0014](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) | Accepted Groq as the first and only external MVP provider, behind the global Local/Groq analysis choice and shared application contract, with minimized disclosed per-finding egress and no automatic fallback; fixed model ID `openai/gpt-oss-20b` is Accepted only for the MVP evaluation. |
| [ADR-0015](architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md) | Accepted the developer-started local application service and ordinary Chrome or Edge loopback UI, with installer, desktop wrapper, Start menu, and packaging work Deferred; ADR-0018 permits only the bounded trusted developer-input scan path. |
| [ADR-0016](architecture/decisions/ADR-0016-filesystem-run-persistence.md) | Preserves the former parent/child filesystem design, superseded for the MVP by ADR-0021's single `run.json` aggregate. |
| [ADR-0017](architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md) | Preserves the superseded production-style hostile-target proposal and its public-address, redirect, connection-gate, and exhaustive-bound history. It no longer governs the portfolio MVP. |
| [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) | Accepts the proportional portfolio boundary: trusted developer-supplied public HTTPS input, a fresh non-persistent context without imported state, main-document-only exact-three-rule scanning, no crawling or interaction, a simple timeout and cleanup, and no hostile-target security claim. |
| [ADR-0019](architecture/decisions/ADR-0019-in-process-exact-vector-search.md) | Accepts LangChain `MemoryVectorStore` with EmbeddingGemma, exact cosine similarity, broad rule/success-criterion filtering, and `k = 3` for the fixed corpus; no persistent vector service is included. |
| [ADR-0020](architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md) | Accepts developer-managed Ollama installation and CLI model pulls outside the application; the MVP provides instructions and checks availability only during actual use. |
| [ADR-0021](architecture/decisions/ADR-0021-single-file-run-aggregate.md) | Accepts one versioned `run.json` aggregate per run directory, with nested finding workflows and one current review decision, no child files, Markdown report, database, or audit graph. |

The requirements also reflect the W3C distinction between normative WCAG success criteria and informative supporting guidance, and the documented limitation that accessibility evaluation requires both automated and human evaluation. The official sources linked in the [curated accessibility guidance corpus assessment](architecture/candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md#accepted-closed-eight-artifact-w3c-pack) retain their recorded verification dates.

## Documentation navigation

- Previous: [Project concept](PROJECT_CONCEPT.md)
- [Project documentation index](README.md)
- Start with: [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md)
- Related evidence: [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md)
