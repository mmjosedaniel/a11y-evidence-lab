# Project requirements

## Document status

- **Repository stage:** Idea exploration
- **Document status:** Planning baseline
- **Main goal status:** Accepted on 2026-08-23
- **Implementation status:** Not started
- **Last reviewed:** 2026-08-24

This document is the canonical index and global authority for the current product goal and the modular, stage-scoped requirements baseline. The linked requirement modules collectively define the first portfolio slice and later distributable-product obligations; none describes implemented behavior. Requirement status has the following meaning:

- **Accepted:** approved project decision with a recorded basis and acceptance date.
- **Proposed:** candidate requirement requiring confirmation before development.
- **Deferred:** valid requirement intentionally placed outside the current baseline.
- **Rejected:** considered and declined with a recorded rationale.
- **Superseded:** replaced by another identified requirement; the replacement ID must be recorded.

Candidate technologies remain proposals unless this document or a later decision explicitly accepts them.

### Candidate architecture review status

**Status: Proposed candidate.** The architecture and implementation patterns added from the Voxleaf reference review are inputs for later evaluation only. They do not accept a technology or design, authorize implementation, add a release dependency, qualify a provider or model, or change the accepted scope of ADRs 0001 through 0013. No Voxleaf implementation has been copied into this repository.

Candidate-derived requirements are consolidated in this requirements baseline. Proposed designs and technology assessments remain separately organized under the architecture documentation and the applicable open decisions, particularly OD-006, OD-010, OD-012, and OD-014 through OD-018. If a candidate later becomes a significant durable architectural decision, it must be recorded in an ADR; accepting a bounded UX, testing, or validation requirement does not automatically require a separate ADR. The project should maintain one current evaluation authority and one current support matrix rather than accumulate overlapping authority documents.

Within identified requirement rows, **must**, **should**, and **may** express requirement priority:

- **Must:** required before the requirement's applicable delivery stage or claim can be considered complete. A distribution-only Must does not block the controlled-fixture portfolio slice.
- **Should:** important within its applicable stage, but deferrable when it would prevent completion of that stage's core outcome.
- **May:** optional enhancement.

Outside identified requirement rows, those words are ordinary explanatory language and do not create additional requirements. Requirement IDs are stable and must not be reused if a requirement is retired. Planned verification describes future acceptance evidence, not work that has already occurred. If summary prose conflicts with an identified requirement, the requirement row and its recorded status control.

## Main goal

> Build an evidence-centered web accessibility investigation and remediation-review application that helps engineering teams turn deterministic findings from authorized web pages into traceable, guidance-backed decisions that people can review and verify through rescans.

The application must preserve the evidence behind each finding, retrieve relevant guidance from a curated and versioned corpus, generate cited remediation proposals with explicit evidence-sufficiency indicators and required manual checks, require human review before a proposal is accepted, and compare later scans without overstating what the comparison proves.

The application supports accessibility investigation and engineering decisions. It is not an accessibility certification tool, does not determine legal compliance or whole-site conformance, and does not modify source code automatically.

## Supporting engineering objective

The secondary objective is to demonstrate and evaluate an observable retrieval-augmented generation (RAG) workflow with deterministic evidence, traceable retrieval, structured generation, one human review decision, local traces, and a small fixed evaluation set.

RAG is part of the accepted project direction. ADR-0013 accepts LangChain only as the initial evaluation baseline for the bounded retrieve-then-generate integration that the portfolio is intended to demonstrate. Scanning, evidence capture, review, and comparison remain application-owned TypeScript behavior rather than LangChain responsibilities. LangGraph is deferred until a demonstrated resume or recovery requirement makes plain application state insufficient. LangSmith remains an optional synthetic-data evaluation candidate; its hosted data handling must be accepted before use, and local traces remain sufficient for local-only operation. TypeScript and React are accepted only as the initial application-language and client-interface evaluation baselines in ADR-0011 and ADR-0012. Every accepted evaluation baseline still requires measurement before release adoption, and the product requirements take precedence over framework demonstration.

## Requirements modules and task routing

Each identified requirement, assumption, risk, and open decision is defined in exactly one module. Read this index first, then load only the modules relevant to the task. When a change affects status, scope, release readiness, or development authorization, also read [Delivery readiness and open decisions](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md).

| Task concerns | Read first |
| --- | --- |
| Product purpose, persona, scope, scenario set, exclusions, or terminology | [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md) |
| Target authorization; deterministic scanning; finding and evidence capture; guidance corpus and retrieval; generated proposals or abstentions; human review and manual checks; rescan comparison; or evidence-oriented interface and export | [Evidence and review workflow](requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md) |
| Local/API generation providers, capability, readiness, isolation, or provider support qualification | [Generation provider execution](requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md) |
| Windows installation, first-run setup, runtime or model acquisition, activation, update, removal, or uninstall | [Installation and model lifecycle](requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md) |
| Accessibility of A11y Evidence Lab | [Application accessibility](requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md) |
| Privacy, security, credentials, egress, renderer isolation, or untrusted-content boundaries | [Privacy and security](requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md) |
| Reliability, reproducibility, runtime contracts, component-inventory contract, resource budgets, service ownership, cancellation, or benchmark protocol | [Reliability, reproducibility, and operations](requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) |
| Evaluation authority, datasets, metrics, qualification, provider comparison, or acceptance targets | [Evaluation and acceptance](requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md) |
| Release-inventory derivation or verification, packaged validation, release evidence, or release claims | [Release inventory, evidence, and claims](requirements/evaluation-and-release/RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md), plus the canonical [component-inventory contract](requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) |
| Domain records, provenance records, workflow state, recovery, readiness, acquisition, work, or evaluation lifecycle semantics | [Information and workflow lifecycle model](requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) |
| Proposed system topology, technology constraints, or implementation patterns | [Candidate architecture](architecture/CANDIDATE_ARCHITECTURE.md) |
| Delivery sequence, assumptions, risks, open decisions, or the pre-development readiness gate | [Delivery readiness and open decisions](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md) |
| Reference-PC capacity, local models, tools, runtime feasibility, or benchmark setup | [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md), plus the applicable requirement and ADR modules |
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
| OD-015 through OD-018 | Preserve later decision topics for serialized contracts, corpus derivation, evaluation/support authority, and advanced work lifecycle. They apply only when the authorized delivery stage needs them and do not block the single-process controlled-fixture portfolio slice by default. ADR numbers will be assigned only after a topic is accepted. |

### Accepted requirement decisions

The requirements-definition request and the subsequent user directions on provider choice, Windows delivery, existing-PC capacity, and technology evaluation baselines are the acceptance authority for the main goal and accepted decisions recorded here on 2026-08-23. Earlier accepted requirement rows restate directions or boundaries repeated in the existing documentation; ADR-mapped rows record provider, distribution, model-capacity, application-stack, and evaluation-baseline decisions. Detailed mechanisms not accepted by those records remain Proposed.

| Accepted requirement IDs | Basis |
| --- | --- |
| `REQ-AUTH-001`, `REQ-AUTH-002`, `REQ-SCAN-001` | [Project overview — Planned workflow and boundaries](../README.md), [Product scope — First vertical slice](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice), and [Project concept — Possible user flow and intended boundaries](PROJECT_CONCEPT.md) |
| `REQ-EVID-004`, `REQ-GEN-005` | [Project context — Direction and product boundaries](PROJECT_CONTEXT.md) |
| `REQ-RETR-002`, `REQ-RETR-004`, `REQ-GEN-002` | [Project concept — Engineering objective and possible user flow](PROJECT_CONCEPT.md) |
| `REQ-GEN-006`, `REQ-COMP-005`, `REQ-UX-003`, `REQ-SEC-007` | [Project concept — Intended boundaries](PROJECT_CONCEPT.md) and [Project context — Product boundaries](PROJECT_CONTEXT.md) |
| `REQ-REV-001` | [Project overview — Overview and planned workflow](../README.md) and [Project concept — Basic implementation flow](PROJECT_CONCEPT.md) |
| `REQ-COMP-004` | [Project context — Direction](PROJECT_CONTEXT.md) and [Project concept — Possible user flow](PROJECT_CONCEPT.md) |
| `REQ-EVAL-002` | [Project concept — Engineering objective](PROJECT_CONCEPT.md) and [Project context — Direction](PROJECT_CONTEXT.md) |
| `REQ-LLM-001`, `REQ-LLM-002`, `REQ-LLM-003`, `REQ-LLM-004`, `REQ-LLM-005`, `REQ-LLM-006`, `REQ-LLM-007`, `REQ-SEC-005` | [ADR-0001 — Interchangeable generation providers](architecture/decisions/ADR-0001-interchangeable-generation-providers.md), accepted from the provider-selection direction confirmed on 2026-08-23 |
| `REQ-LLM-011` | [ADR-0003 — Initial local generation capacity-screen configuration](architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md), [ADR-0004 — Reference-PC capacity gate](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), and [ADR-0005 — Ollama as the initial local model runtime](architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md), accepted as evaluation bootstrap decisions rather than release-qualified user recommendations |
| `REQ-QUAL-009` | [ADR-0004 — Reference-PC capacity gate](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), accepted from the existing-hardware constraint confirmed on 2026-08-23 |
| `REQ-INST-001`, `REQ-INST-002`, `REQ-INST-003`, `REQ-INST-004`, `REQ-INST-007`, `REQ-SEC-017` | [ADR-0002 — Windows installation and model acquisition](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md), accepted from the installation and first-run direction confirmed on 2026-08-23 |
| `REQ-QUAL-010` | [ADR-0011 — TypeScript as the initial application language](architecture/decisions/ADR-0011-typescript-as-initial-application-language.md), accepted to keep compile-time types distinct from runtime trust-boundary validation |
| `REQ-SEC-019` | [ADR-0012 — React as the initial user-interface library](architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), accepted to keep the browser renderer unprivileged and untrusted content isolated from application authority |

### Source contributions

| Source | Contribution to this baseline |
| --- | --- |
| [Project overview](../README.md) | Product purpose, planned workflow, engineering objective, current status, and public boundaries. |
| [Project context](PROJECT_CONTEXT.md) | Evidence-centered direction, separation of deterministic and generated information, human judgment, local-first feasibility, and product limits. |
| [Project concept](PROJECT_CONCEPT.md) | Workflow stages, user review, rescanning, intended framework roles, and original open questions. |
| [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md) | Reference hardware, published feasibility evidence, initial technology evaluation baselines, and their validation needs; all feasibility conclusions remain subject to representative benchmarks. |
| [ADR-0001](architecture/decisions/ADR-0001-interchangeable-generation-providers.md) | Accepted provider-neutral generation boundary, explicit local/API selection, shared provider contract, and no automatic fallback. |
| [ADR-0002](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md) | Accepted Windows installer and launcher direction, post-install model acquisition, and first-run provider choice. |
| [ADR-0003](architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md) | Accepted Qwen3.5 4B as the first capacity-screen configuration and 9B only as a later conditional option, explicitly separated from the release-qualified user recommendation. |
| [ADR-0004](architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md) | Accepted two-stage capacity gate that excludes oversized models before full evaluation and recommendation. |
| [ADR-0005](architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md) | Accepted Ollama only as the initial local runtime to evaluate behind the provider-neutral boundary; release dependency and ownership remain open. |
| [ADR-0006](architecture/decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md) | Accepted EmbeddingGemma only as the initial local embedding model to evaluate under retrieval-quality, capacity, reproducibility, and provenance gates. |
| [ADR-0007](architecture/decisions/ADR-0007-chroma-as-initial-local-vector-store.md) | Accepted Chroma only as the initial local persistent vector-store technology to evaluate under index lifecycle, recovery, provenance, resource, and zero-egress gates. |
| [ADR-0008](architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md) | Accepted Playwright with pinned Chromium only as the initial controlled-fixture browser-automation technology to evaluate. |
| [ADR-0009](architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md) | Accepted axe-core only as the initial deterministic accessibility scanner to evaluate, without implying complete coverage or certification. |
| [ADR-0010](architecture/decisions/ADR-0010-defer-a-local-reranker.md) | Accepted omission of a reranker from the initial baseline until fixed retrieval evidence demonstrates a material ranking need. |
| [ADR-0011](architecture/decisions/ADR-0011-typescript-as-initial-application-language.md) | Accepted TypeScript only as the initial application-language evaluation baseline with independent type checking, mandatory runtime schemas, adapter isolation, and no implied runtime or framework selection. |
| [ADR-0012](architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) | Accepted React only as the initial client-interface evaluation baseline, with durable and privileged behavior kept behind the application-owned local API. |
| [ADR-0013](architecture/decisions/ADR-0013-langchain-as-initial-rag-integration.md) | Accepted LangChain only as the initial two-step RAG integration baseline; deterministic stages, human decisions, domain records, LangGraph, and LangSmith remain outside that acceptance scope. |

The requirements also reflect the W3C distinction between normative WCAG success criteria and informative supporting guidance, and the documented limitation that accessibility evaluation requires both automated and human evaluation. The official sources linked in the [curated accessibility guidance corpus assessment](architecture/candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md#initial-w3c-micro-corpus) retain their recorded verification dates.

## Documentation navigation

- Previous: [Project concept](PROJECT_CONCEPT.md)
- [Project documentation index](README.md)
- Start with: [Product scope and glossary](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md)
- Related evidence: [Local MVP feasibility](LOCAL_MVP_FEASIBILITY.md)
