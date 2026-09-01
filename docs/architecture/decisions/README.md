# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for significant technical and architectural decisions made for A11y Evidence Lab.

## Status

The following current decisions have been accepted at the scope stated in each record:

1. [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
2. [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
3. [ADR-0004: Reference-PC capacity gate for local models](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
4. [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
5. [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
6. [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
7. [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
8. [ADR-0010: Defer a local reranker](ADR-0010-defer-a-local-reranker.md)
9. [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
10. [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
11. [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
12. [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
13. [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
14. [ADR-0018: Trusted operator URL boundary for the portfolio MVP](ADR-0018-trusted-operator-url-boundary.md)
15. [ADR-0019: In-process exact vector search for the MVP](ADR-0019-in-process-exact-vector-search.md)
16. [ADR-0020: Manual developer-managed local model setup](ADR-0020-manual-developer-managed-local-model-setup.md)
17. [ADR-0021: Single-file run aggregate](ADR-0021-single-file-run-aggregate.md)
18. [ADR-0022: Closed, versioned guidance corpus](ADR-0022-closed-versioned-guidance-corpus.md)
19. [ADR-0023: Local-mode data boundary](ADR-0023-local-mode-data-boundary.md)
20. [ADR-0024: Milestone-slice TDD with independent ownership](ADR-0024-milestone-slice-tdd-with-independent-ownership.md)

`Accepted for evaluation` selects a bounded configuration to measure after development is authorized; it does not mean implemented, bundled, generally supported, or release-qualified. `Accepted` records a binding project direction or, for ADR-0010, an explicit deferral. ADR-0014 deliberately splits these scopes: Groq and the explicit dual-mode/no-fallback boundary are binding MVP decisions, while its exact model is only a fixed evaluation configuration. ADR-0018 accepts the trusted single-page scan boundary. ADR-0019, ADR-0020, and ADR-0021 apply the portfolio YAGNI boundary to retrieval, model setup, and persistence. ADR-0022 accepts the closed, manually segmented corpus boundary, and ADR-0023 accepts a local-inference data boundary without a system-wide zero-egress claim. ADR-0024 governs the repository development method and does not add agents, queues, leases, telemetry, or orchestration to the product runtime. Release adoption remains subject to a later decision.

Candidate technologies and architecture options not covered by these records remain proposals until an ADR or another authoritative project document explicitly records a decision.

## Partial amendments to current decisions

ADR-0024's [2026-08-30 first-module Red amendment](ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception) permits an intentional missing production module/export as initial Red under a verified environment and complete bounded behavioral tests. It preserves separate Green, strict typechecking, write ownership, and all other readiness gates; it adds no production stub or workflow phase.

ADR-0020 narrows ADR-0005, ADR-0006, ADR-0014, and ADR-0015 only for MVP setup and attempt-time availability: the developer installs Ollama and pulls `embeddinggemma` before retrieval in either mode, additionally pulls `qwen3.5:4b` only for Local generation, and configures the Groq credential only for Groq generation. A11y Evidence Lab does not manage those artifacts or run separate provider preflights. The earlier records otherwise remain current within their stated evaluation scope.

ADR-0023 supersedes only ADR-0005's requirement to disable or isolate unrelated runtime networking and its system-wide zero-egress release gate, plus ADR-0012's requirement that all Local-mode operations show no unapproved non-loopback egress and its description of Groq as the only external operation. ADR-0005 and ADR-0012 otherwise remain current. Groq remains the only external generation path; trusted-page navigation and developer-managed model acquisition are separate network operations.

OD-026 narrows ADR-0012 and ADR-0021 only for portfolio-MVP navigation: manual Run ID entry, reload restoration, deep-link loading, and recent-run history are Deferred. The local service and single `run.json` remain the durable authority, and validated aggregate reads still support safe downstream updates and comparison. Neither amendment restores browser storage as authority or changes the persistence mechanism.

ADR-0018 replaces ADR-0017's amendments to ADR-0001, ADR-0005, ADR-0006, ADR-0008, ADR-0009, ADR-0010, and ADRs 0013 through 0016 wherever those amendments imposed the former hostile-network boundary. The current runtime boundary is one trusted, operator-entered and authorized public HTTPS page; the three synthetic profiles remain the separate fixed evaluation baseline.

## Superseded decision history

[ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) was Accepted on 2026-08-23 and superseded for the MVP by ADR-0015 on 2026-08-25. It is preserved as history; an installer, launcher, Start menu entry, desktop container, signing, repair, update, and uninstall remain deferred and require a future decision.

[ADR-0017: Authorized public-page scan boundary](ADR-0017-authorized-public-page-scan-boundary.md) was Accepted on 2026-08-25 and superseded for the portfolio MVP by ADR-0018 on 2026-08-27. It is preserved as history and as possible input to later production hardening; its egress gate, address classification, redirect and subresource revalidation, resource-limit manifest, and adversarial qualification are not current MVP requirements.

[ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md) was Accepted for evaluation on 2026-08-23 and superseded for the MVP by [ADR-0019](ADR-0019-in-process-exact-vector-search.md) on 2026-08-27. Chroma is deferred until corpus size, mutability, persistence, or measured performance demonstrates a vector-database need.

[ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md) was Accepted on 2026-08-25 and superseded for the MVP by [ADR-0021](ADR-0021-single-file-run-aggregate.md) on 2026-08-27. Its local-directory/no-database direction remains, while independently versioned child records and an optional Markdown report are not current MVP work.

## Trusted-input portfolio boundary

ADR-0018 deliberately treats the local developer's authorized page URL as trusted input. A fresh non-persistent managed browser context, no imported state, one finite navigation timeout, cleanup, exact three-rule scanning, and visible scan failure are sufficient for this portfolio scope. SSRF defenses, DNS and IP classification, connection-level egress mediation, redirect re-attestation, quantitative resource-limit qualification, and adversarial URL testing are deferred until a demonstrated product need justifies a new threat model and decision. The MVP therefore must not claim safe handling of arbitrary or untrusted URLs.

## Deferred decision topics

The following topics are intentionally outside the portfolio MVP and have no reserved ADR numbers:

- Distributable packaging and non-developer startup.
- Formal release qualification, support matrix, and public performance claims.
- Broader hardware compatibility and production retention, backup, migration, or synchronization.
- Additional hosted providers, provider comparison, and generalized provider discovery.
- Hosted tracing, telemetry, and analytics.
- Product-runtime workflow orchestration, concurrency, cancellation, checkpoints, and resume. Repository-local Codex coordination under ADR-0024 is development tooling, not product scope.

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
