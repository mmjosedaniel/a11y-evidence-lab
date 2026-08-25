# Project concept

## Working name

A11y Evidence Lab.

## Status

Idea only, recorded on 2026-08-20. No implementation has started.

## Concept

Build a web accessibility evidence explorer for engineering teams. The product would combine deterministic browser analysis with an AI workflow that retrieves relevant accessibility guidance, explains findings with citations, proposes remediation, presents proposals for user review when judgment is required, and compares results after a page is changed.

The interface should be an evidence-oriented application rather than a generic chatbot.

## Basic implementation flow

```mermaid
flowchart LR
    A[Authorized controlled fixture] --> B[Accessibility scan]
    B --> C[Findings and evidence]
    D[Curated guidance corpus] --> E[RAG retrieval]
    C --> E
    E --> F[Provider-neutral AI generation]
    K[First slice: local LLM provider] --> F
    L[Later: external LLM API provider] -.-> F
    F --> G{User review}
    G -->|Approve or edit| H[Accepted remediation plan]
    G -->|Reject| I[Recorded rejection]
    I -->|User requests regeneration| E
    H --> J[Rescan and compare]
```

## Possible user flow

1. In a later distributable build, the user starts the installed Windows application from its shortcut; the local launcher opens the web interface in an application-controlled window or isolated browser context. On first launch, the user may configure the release-qualified local LLM profile, configure an external LLM API, or defer AI setup. Installer completion is not required to demonstrate the first portfolio slice.
2. The user selects the project-owned `image-alt` fixture and confirms its bounded authorization attestation. Live pages are a later extension.
3. The system collects deterministic accessibility findings and page evidence.
4. A retrieval pipeline finds the most relevant WCAG and implementation guidance.
5. The selected generation provider produces a structured explanation, remediation proposal, citations, evidence-sufficiency indicator, and required manual checks through the same application-owned contract.
6. The application presents the proposal with its evidence, citations, evidence sufficiency, and manual checks so the user can approve, edit, or reject it.
7. A later scan compares finding evidence. The first binary `image-alt` profile can show `resolved`, `persistent`, or inverse-pair `regressed`; `improved` requires a later scenario with an ordered evidence measure.

## Engineering objective

The project objective is to demonstrate the practical use of RAG and LangChain as a complete, evidence-centered portfolio workflow rather than a basic question-answering demonstration:

- RAG grounded in a curated and versioned corpus.
- LangChain for the bounded retrieve-then-generate integration.
- Plain TypeScript state for the first linear workflow and single review decision.
- LangGraph only if a later demonstrated recovery or resume requirement needs it.
- Local traces and a small fixed evaluation set first; LangSmith remains an optional synthetic-data evaluation candidate.
- Measurable retrieval and answer quality instead of relying only on a polished demo.
- Human-in-the-loop decisions and explicit abstention when the evidence is insufficient.
- Conventional engineering quality around the AI workflow.
- A replaceable structured-generation provider so the first local configuration, and a later external-API configuration, can be evaluated without changing evidence, validation, or review semantics.

The provider boundary, later explicit local/API choice, Windows installation direction, and first `image-alt` slice are accepted directions; the bounded LangChain role is Accepted for evaluation only. TypeScript is the initial application-language evaluation baseline, and React is the initial client-interface evaluation baseline. React remains presentation-only over the application-owned local API; durable workflow state and privileged operations remain outside browser-delivered code. These and the other initial technology baselines are recorded in the [architecture decisions](architecture/decisions/README.md), while the exact release model, external API adapter, release vector store, JavaScript runtime, desktop container, runtime ownership, and packaging technology remain open to evaluation.

## Intended boundaries

- It would not certify that a website is accessible or legally compliant.
- It would not automatically modify a user's code.
- It would not crawl arbitrary websites without authorization.
- It would not expose private pages, source code, or sensitive traces in a public demo.
- Chat, if included, would be secondary to the evidence and review workflow.

## Questions to resolve before first-slice development

- Who is the first target user: frontend developers, QA engineers, or accessibility specialists?
- Which exact W3C source snapshots and usage terms should be approved for the small SC 1.1.1 corpus?
- What exact 5–10 synthetic cases, one-reviewer rubric, and non-promotable success criteria will evaluate the first slice?

## Questions to resolve before later distributable stages

- Which capacity-qualified local model configuration should become the release default, and which external API adapter should be supported first?
- Which JavaScript runtime, local-service host, desktop container, Windows packaging technology, and runtime-ownership model satisfy installation, update, signing, offline, isolation, and zero-egress requirements?
- What expanded evaluation evidence and thresholds would justify provider, performance, support, or release claims?

## Documentation navigation

- Previous: [Project context](PROJECT_CONTEXT.md)
- [Documentation index](README.md)
- Next: [Project requirements](PROJECT_REQUIREMENTS.md)
