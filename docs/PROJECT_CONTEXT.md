# Project context

## Motivation

Automated accessibility tools can identify deterministic issues, but their output often stops at detection. Engineering teams still need to connect findings to authoritative guidance, understand the available evidence, identify where human judgment is required, and verify whether a change improved the result.

A11y Evidence Lab explores an evidence-centered workflow for that gap. The goal is not to build a generic document chatbot, but to connect browser findings, retrieved guidance, structured remediation proposals, human review, and before-and-after verification.

## Direction

The selected direction combines:

- Deterministic browser analysis as the source of findings and page evidence.
- Retrieval from a curated, versioned accessibility corpus.
- Grounded explanations and remediation proposals with citations.
- Explicit evidence-sufficiency, abstention, and manual-check requirements.
- User approval, editing, or rejection before a proposal becomes an accepted remediation plan.
- Rescanning and comparison to evaluate whether observed finding evidence improved, persisted, or regressed.

This structure makes the AI workflow observable and testable. Retrieval quality, answer quality, review outcomes, and regressions can be evaluated independently instead of relying on the apparent quality of a chat response.

The selected first portfolio slice applies that structure to one project-owned fixture containing one informative image without an `alt` attribute and one corrected state. The pinned axe-core `image-alt` result supplies the finding. A small WCAG 2.2 SC 1.1.1 corpus supplies the retrieval context. The visible user story demonstrates one proposal, one review decision, and the failing-to-corrected `resolved` comparison; the fixed pilot reuses the same two states in separate operations for `persistent` and inverse `regressed`. Broader rules and live-page support are not prerequisites.

## Technical intent

The engineering objective is to demonstrate practical use of retrieval-augmented generation and LangChain in a cohesive, inspectable workflow. ADR-0013 accepts LangChain only as the initial evaluation baseline for two-step retrieval and generation integration. Deterministic scanning, evidence capture, review decisions, and comparison remain ordinary application-owned TypeScript modules. LangGraph is deferred until a demonstrated recovery or resume need makes plain application state insufficient. LangSmith is optional for evaluation with synthetic, publicly shareable data after its egress and retention behavior is accepted; local traces remain the required fallback. The accepted architecture places structured generation behind an application-owned provider boundary so the evidence and review workflow is not tied to one model vendor, runtime, SDK, or API format. TypeScript and React remain initial application-language and client-interface evaluation baselines. React is a presentation layer over the local application API; durable records, runtime validation, credentials, provider calls, and browser automation remain outside browser-delivered code. Exact release framework and component configurations remain open decisions.

A local-first configuration remains the recommended default and must provide the complete path for curated-corpus preparation, embeddings, vector search, retrieval, generation, review, and evaluation, subject to representative end-to-end benchmarks. Local model configurations must pass the reference-PC capacity gate before quality evaluation or recommendation; models outside the existing computer's practical capacity are excluded rather than accommodated with more hardware or remote compute. The user may instead select a supported external LLM API for generation. That choice is an explicit data-egress mode with separate disclosure and consent; it never activates as an automatic fallback and does not move scanning, evidence, corpus, retrieval, validation, review, or audit out of the local application.

## Candidate architecture refinements

**Status: Proposed research input; unaccepted.** A read-only review of the separate Voxleaf reference project identified candidate patterns for versioned serialized contracts, deterministic corpus derivation, identity-first cancellation, exact-profile evaluation and support states, optional-artifact acquisition, safe React projection, service ownership, component inventory, and release evidence. The proposed shapes and adoption gates are organized in [Candidate architecture](architecture/CANDIDATE_ARCHITECTURE.md), with implementation references and limitations in the [Voxleaf implementation-pattern assessment](architecture/candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md).

This research does not change an accepted architecture decision, select Tauri, Rust, NSIS, pnpm, Vite, or another runtime or packaging technology, qualify a model or provider, authorize implementation, or copy Voxleaf code. Its advanced worker, supervision, acquisition, and release patterns are deferred until the small portfolio slice demonstrates a concrete need. Only an open decision implicated by the next authorized stage can block that stage.

## Distribution and startup direction

The distributable MVP will use a Windows installer. A Start menu shortcut will launch the local application services and open the web interface in an application-controlled window or isolated browser context on a loopback address. Large model weights will remain outside the installer. On first launch, the user can configure the release-qualified local provider profile, configure an external LLM API, or defer AI setup while retaining deterministic scanning and evidence access. These accepted directions are recorded in [ADR-0001](architecture/decisions/ADR-0001-interchangeable-generation-providers.md) and [ADR-0002](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md).

## Product boundaries

- The product would support investigation and review; it would not certify accessibility or legal compliance.
- Deterministic evidence and cited guidance would remain distinguishable from model-generated interpretation.
- Every generated proposal would require human review, and findings that require contextual or subjective judgment would also require explicit manual checks.
- The system would operate only on authorized pages or controlled fixtures.
- Private pages, source code, and sensitive traces would not be exposed in a public demonstration.
- Automated source-code modification is outside the current concept.

## Current status

The project remains in idea exploration. No implementation has started. The generation-provider boundary, Windows distribution direction, first `image-alt` portfolio scenario, and initial technology evaluation baselines—including TypeScript, React, and the bounded LangChain role—in the [architecture decisions](architecture/decisions/README.md) are accepted. LangGraph is deferred pending a demonstrated orchestration need, and LangSmith remains optional. Release technologies, JavaScript runtime, desktop container, packaging technology, local runtime ownership, external API provider, persistence, evaluation details, release model, and success thresholds remain open decisions.

## Documentation navigation

- [Documentation index](README.md)
- Next: [Project concept](PROJECT_CONCEPT.md)
