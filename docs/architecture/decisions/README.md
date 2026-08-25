# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for significant technical and architectural decisions made for A11y Evidence Lab.

## Status

The following decisions have been accepted at the scope stated in each record:

1. [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
2. [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md)
3. [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
4. [ADR-0004: Reference-PC capacity gate for local models](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
5. [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
6. [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
7. [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md)
8. [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
9. [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
10. [ADR-0010: Defer a local reranker](ADR-0010-defer-a-local-reranker.md)
11. [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
12. [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
13. [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)

`Accepted for evaluation` selects the first technology to measure after development is authorized; it does not mean implemented, bundled, supported, or release-qualified. `Accepted` records a binding project direction or, for ADR-0010, an explicit deferral. Release adoption remains subject to the gates and open decisions named by each record.

Candidate technologies and architecture options not covered by these records remain proposals until an ADR or another authoritative project document explicitly records a decision.

## Candidate decision topics — not accepted ADRs

The Voxleaf reference review produced four future decision topics. They remain Proposed under [OD-015 through OD-018](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#decisions-required-before-development), have no reserved ADR numbers, and must not be treated as evaluation or implementation authority:

- Versioned serialized-contract authority.
- Deterministic corpus derivation and source-locator authority.
- Exact-profile evaluation and support qualification authority.
- Work identity, cancellation, and stale-result containment.

The detailed [candidate architecture patterns](../CANDIDATE_ARCHITECTURE.md) and [Voxleaf implementation references](../candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) are **Proposed** planning inputs only. They do not modify the accepted scope or status of any ADR. If a topic is accepted later, create the next sequential ADR at that time and update the requirements traceability; do not reinterpret these candidate documents or this topic list as decisions.

## Conventions

- Use one decision per file.
- Name records `ADR-NNNN-short-title.md`, beginning with `ADR-0001`.
- Record the decision status, context, considered options, decision, consequences, and date.
- Preserve superseded records and link them to their replacements.

## Documentation navigation

- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
- [Project overview](../../../README.md)
