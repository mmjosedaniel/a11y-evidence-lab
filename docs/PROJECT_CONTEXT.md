# Project context

## Motivation

Automated accessibility tools can identify deterministic issues, but their output often stops at detection. Engineering teams still need to connect findings to authoritative guidance, understand the available evidence, identify where human judgment is required, and verify whether a change improved the result.

A11y Evidence Lab explores an evidence-centered workflow for that gap. The goal is not to build a generic document chatbot, but to connect browser findings, retrieved guidance, structured remediation proposals, human review, and before-and-after verification.

The primary MVP user is a frontend developer investigating one controlled finding and preparing a remediation decision. A QA engineer is the secondary user who can reproduce the finding and verify the later result. The single-user MVP does not introduce accounts, product roles, permissions, assignments, or collaboration features.

## Direction

The selected direction combines:

- Deterministic browser analysis as the source of findings and page evidence.
- Retrieval from a curated, versioned accessibility corpus.
- Grounded explanations and remediation proposals with citations.
- Explicit evidence-sufficiency, abstention, and manual-check requirements.
- User approval, editing, or rejection before a proposal becomes an accepted remediation plan.
- Rescanning and comparison to evaluate whether observed finding evidence improved, persisted, or regressed.

This structure makes the AI workflow observable and testable. Retrieval quality, answer quality, review outcomes, and regressions can be evaluated independently instead of relying on the apparent quality of a chat response.

The selected first portfolio slice applies that structure independently to three project-owned synthetic controlled profiles: `informative-image-alt` (`image-alt` / WCAG 2.2 SC 1.1.1), `form-input-label` (`label` / SC 4.1.2), and `text-contrast` (`color-contrast` / SC 1.4.3). Each has a failing and corrected revision and retains one stable intended target. One operation selects one profile and finding workflow, so the expansion adds useful evidence variety without bulk scanning or workflow orchestration. The bounded curated corpus covers only those mappings. Binary image and label comparisons demonstrate `resolved`, `persistent`, and inverse `regressed`; contrast also defines a possible still-failing `improved` result through a retained ordered margin. The exact scenario contract and OD-002/OD-019 history are in [Product scope — First vertical slice](requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice).

Live-site input, arbitrary URLs, crawling, and crawler implementation are deliberately excluded from this portfolio MVP. The purpose is to demonstrate the end-to-end integration of deterministic scanning, evidence capture, RAG/LangChain, structured generation, human review, and comparison—not to build production target discovery. Live pages, crawling, and broader rule coverage remain possible later capabilities if a demonstrated product need justifies their additional controls.

## Technical intent

The engineering objective is to demonstrate practical use of retrieval-augmented generation and LangChain in a cohesive, inspectable workflow. ADR-0013 accepts LangChain only as the initial evaluation baseline for two-step retrieval and generation integration. Deterministic scanning, evidence capture, review decisions, and comparison remain ordinary application-owned TypeScript modules. LangGraph is deferred until a demonstrated recovery or resume need makes plain application state insufficient. LangSmith and hosted tracing are deferred outside the MVP; content-safe local records and diagnostics are sufficient. The accepted architecture places structured generation behind an application-owned provider boundary so the evidence and review workflow is not tied to one model vendor, runtime, SDK, or API format. TypeScript and React remain initial application-language and client-interface evaluation baselines. React is a presentation layer over the local application API; durable records, runtime validation, credentials, provider calls, and browser automation remain outside browser-delivered code. Exact implementation packages remain unselected, and release framework or qualification decisions are Deferred.

The application remains local on the developer machine and must provide the complete path for curated-corpus preparation, embeddings, vector search, retrieval, review, comparison, and content-safe run records. Generation has exactly two MVP modes selected explicitly for each new run: a separately downloaded local model through the selected runtime, or the Groq API as the first and only external provider. Local mode is the recommended initial choice but is not selected implicitly. ADR-0014 fixes Groq model ID `openai/gpt-oss-20b` for MVP API evaluation without making it a release-qualified dependency or availability promise. Local model configurations must pass the reference-PC capacity gate before quality evaluation; models outside the existing computer's practical capacity are excluded rather than accommodated with more hardware or remote compute. Groq mode is an explicit data-egress choice with separate disclosure and consent. Neither mode automatically falls back to the other, and Groq mode does not move scanning, evidence capture, corpus storage, retrieval, validation, review, or comparison out of the local application.

## Candidate architecture refinements

**Status: Proposed research input; unaccepted.** A read-only review of the separate Voxleaf reference project identified candidate patterns for versioned serialized contracts, deterministic corpus derivation, identity-first cancellation, exact-profile evaluation and support states, optional-artifact acquisition, safe React projection, service ownership, component inventory, and release evidence. The proposed shapes and adoption gates are organized in [Candidate architecture](architecture/CANDIDATE_ARCHITECTURE.md), with implementation references and limitations in the [Voxleaf implementation-pattern assessment](architecture/candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md).

This research does not change an accepted architecture decision, select Tauri, Rust, NSIS, pnpm, Vite, or another runtime or packaging technology, qualify a model or provider, authorize implementation, or copy Voxleaf code. Its advanced worker, supervision, acquisition, and release patterns are deferred until the small portfolio slice demonstrates a concrete need. Only an open decision implicated by the next authorized stage can block that stage.

## MVP startup and deferred distribution

The portfolio MVP is a browser-delivered local application, not an installed desktop product. The developer starts one local application service and opens its loopback address in Chrome or Edge. Browser-delivered code remains an unprivileged interface; the service owns local files, model-runtime and Groq calls, deterministic browser automation, and other privileged operations.

The MVP has no Windows installer, Start menu shortcut, desktop wrapper, embedded webview, or packaged model. Local model acquisition is an explicit download outside the repository after model size and storage impact are disclosed. The earlier Windows-installer direction in [ADR-0002](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md) remains visible as decision history but is superseded for the MVP by [ADR-0015](architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md); packaging may be reconsidered only after a demonstrated distribution need. [ADR-0014](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) owns the fixed Groq evaluation path, and [ADR-0016](architecture/decisions/ADR-0016-filesystem-run-persistence.md) owns the local run store.

## Product boundaries

- The product would support investigation and review; it would not certify accessibility or legal compliance.
- Deterministic evidence and cited guidance would remain distinguishable from model-generated interpretation.
- Every generated proposal would require human review, and findings that require contextual or subjective judgment would also require explicit manual checks.
- The system would operate only on authorized pages or controlled fixtures.
- The portfolio MVP would accept only the three selected synthetic controlled profiles; it would not accept live-site input, arbitrary URLs, or implement crawling.
- The MVP would serve one local user at a time and would not include accounts, roles, permissions, assignments, or collaboration workflows.
- Private pages, source code, and sensitive traces would not be exposed in a public demonstration.
- Automated source-code modification is outside the current concept.

## Current status

The project remains in idea exploration. No implementation has started. OD-019 accepts the three-scenario portfolio boundary and supersedes OD-002's earlier one-scenario scope in the [product decision register](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#resolved-decisions-for-the-first-portfolio-slice). The primary and secondary users, two explicit MVP generation modes, Groq as the only external provider, no-fallback behavior, local browser startup, and no-installer boundary are now accepted at their recorded scopes. The initial technology baselines—including TypeScript, React, and the bounded LangChain role—remain evaluation choices rather than release-qualified dependencies. LangGraph, LangSmith, hosted tracing, formal release qualification, desktop packaging, and installer work are deferred. Exact implementation commands, package versions, and the capacity-screened local model configuration still require evaluation before development claims can be made.

## Documentation navigation

- [Documentation index](README.md)
- Next: [Project concept](PROJECT_CONCEPT.md)
