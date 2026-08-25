# ADR-0007: Chroma as the initial local vector store

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The MVP needs local vector storage for a small, immutable accessibility-guidance corpus. The store must preserve passage identifiers and source metadata, support reproducible filtered retrieval, survive restarts, and participate in atomic rebuild, deletion, backup, and migration behavior without requiring cloud access.

Chroma documents local in-memory and persistent clients, a local server mode, collections, metadata, and vector queries. Its documented TypeScript getting-started path connects the client to a running Chroma service; it does not establish an embedded TypeScript persistence mode for this project. These capabilities make Chroma a plausible evaluation baseline, but they do not by themselves prove deterministic index behavior, safe recovery, or compatibility with the project's retention and zero-egress requirements.

## Considered options

1. Use a hosted vector database.
2. Use PostgreSQL with pgvector.
3. Use a lower-level vector index plus a separate metadata database.
4. Use Chroma in a local persistent configuration.

## Decision

Use Chroma as the initial local vector-store technology for evaluation only.

- Run it locally with an application-controlled persistence path and no Chroma Cloud dependency.
- Treat it as a derived, rebuildable index; canonical corpus snapshots, source passages, evidence, and audit records remain outside Chroma.
- Supply versioned embeddings and explicit passage/corpus metadata from the application rather than allowing an implicit external embedding function.
- Record the Chroma version, client/server mode, collection and index configuration, distance metric, embedding dimensions, persistence path identity, and corpus snapshot for each evaluation.
- Validate exact passage lookup, metadata filtering, deterministic rebuild behavior, index/corpus compatibility checks, cascading deletion, backup/restore, migration, corruption recovery, disk and memory use, and zero-egress operation.
- Build a new versioned index beside the last valid index and activate it atomically only after validation.
- Protect destructive reset or collection-deletion operations behind application policy; they must not be exposed as an ordinary user shortcut.

Promoting Chroma to the release architecture requires passing those gates. A failure replaces the store behind the retrieval boundary without changing corpus, passage, or retrieval-run identifiers.

## Consequences

- The first retrieval implementation has a local persistence path and documented collection/query API.
- With TypeScript as the initial application-language baseline, Chroma's documented TypeScript setup expects a running Chroma service. Whether the application owns that loopback service, uses an approved helper, selects another compatible mode, or replaces Chroma remains an implementation and packaging decision; this ADR does not accept a server topology.
- Index migration, atomic activation, and backup behavior remain application responsibilities even when Chroma persists data automatically.
- Chroma-specific identifiers or distance semantics must be normalized before they enter domain records.

## Primary references

- [Chroma clients and local persistence](https://docs.trychroma.com/docs/run-chroma/clients)
- [Chroma collection operations](https://docs.trychroma.com/docs/collections/manage-collections)
- [Chroma TypeScript getting started](https://docs.trychroma.com/docs/overview/getting-started)

## Related decisions and requirements

- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-CORP-*` and `REQ-RETR-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-003`, `REQ-QUAL-004`, and `REQ-QUAL-010`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-006` and `REQ-SEC-018`
- [Local guidance retrieval execution and evaluation assessment](../candidates/guidance-retrieval/LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) — Proposed store profile and evaluation detail; it does not change this ADR's evaluation-only scope.
