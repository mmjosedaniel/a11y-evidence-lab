# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for significant technical and architectural decisions made for A11y Evidence Lab.

## Status

The following current decisions have been accepted at the scope stated in each record:

1. [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
2. [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
3. [ADR-0004: Reference-PC capacity gate for local models](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
4. [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
5. [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
6. [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md)
7. [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
8. [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
9. [ADR-0010: Defer a local reranker](ADR-0010-defer-a-local-reranker.md)
10. [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
11. [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
12. [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
13. [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
14. [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
15. [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
16. [ADR-0017: Authorized public-page scan boundary](ADR-0017-authorized-public-page-scan-boundary.md)

`Accepted for evaluation` selects a bounded configuration to measure after development is authorized; it does not mean implemented, bundled, generally supported, or release-qualified. `Accepted` records a binding project direction or, for ADR-0010, an explicit deferral. ADR-0014 deliberately splits these scopes: Groq and the explicit dual-mode/no-fallback boundary are binding MVP decisions, while its exact model is only a fixed evaluation configuration. ADR-0017 accepts the one-page authorization, network-containment, exact three-rule coverage, selected-finding, and fail-closed safety properties; it does not qualify their unselected numeric limits or implementation mechanism. Release adoption remains subject to a later decision.

Candidate technologies and architecture options not covered by these records remain proposals until an ADR or another authoritative project document explicitly records a decision.

## Superseded decision history

[ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) was Accepted on 2026-08-23 and superseded for the MVP by ADR-0015 on 2026-08-25. It is preserved as history; an installer, launcher, Start menu entry, desktop container, signing, repair, update, and uninstall remain deferred and require a future decision.

ADR-0017 amends or clarifies, rather than supersedes, ADR-0001, ADR-0005, ADR-0006, ADR-0008, ADR-0009, ADR-0010, and ADRs 0013 through 0016. Their earlier local-only or synthetic-only wording remains visible through dated amendment notes as decision history. The current runtime boundary is one attested public HTTPS page; the three synthetic profiles remain the separate fixed evaluation baseline.

## Public-page pre-development qualification

ADR-0017 intentionally leaves the exact numeric network, browser, page, scanner, storage, and duration ceilings and the concrete non-bypassable loopback egress-gate mechanism open. Before public-page development is authorized, the project must freeze those values and the redirect, bounded-subresource, DNS-pinning, cleanup, and adversarial qualification cases for the already accepted main-document-only scan. This is unresolved qualification work under an accepted safety boundary, not permission to weaken or omit the boundary and not a general-support commitment.

## Deferred decision topics

The following topics are intentionally outside the portfolio MVP and have no reserved ADR numbers:

- Distributable packaging and non-developer startup.
- Formal release qualification, support matrix, and public performance claims.
- Broader hardware compatibility and production retention, backup, migration, or synchronization.
- Additional hosted providers, provider comparison, and generalized provider discovery.
- Hosted tracing, telemetry, and analytics.
- Workflow orchestration, concurrency, cancellation, checkpoints, and resume.

The detailed [candidate architecture patterns](../CANDIDATE_ARCHITECTURE.md) and [Voxleaf implementation references](../candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) are **Proposed** planning inputs only. They do not modify the accepted scope or status of any ADR. If a deferred topic is accepted later, create the next sequential ADR at that time and update requirements traceability; do not reinterpret candidate material as a decision.

## Conventions

- Use one decision per file.
- Name records `ADR-NNNN-short-title.md`, beginning with `ADR-0001`.
- Record the decision status, context, considered options, decision, consequences, and date.
- Preserve superseded records and link them to their replacements.

## Documentation navigation

- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
- [Project overview](../../../README.md)
