# ADR-0006: EmbeddingGemma as the initial embedding model

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The local retrieval pipeline needs an embedding model that can index and query the initial accessibility-guidance corpus within the reference PC's capacity. The choice must preserve local-only operation and exact index reproducibility while providing adequate retrieval quality for cited remediation guidance.

The currently published Ollama `embeddinggemma` artifact is a compact, local text-embedding option. Published size and general-purpose retrieval claims do not establish fitness for WCAG, ACT, APG, scanner metadata, or the project's chunking strategy.

## Considered options

1. Use a hosted embedding API.
2. Begin with a different small local embedding model.
3. Use `embeddinggemma` as the first local embedding configuration.

## Decision

Use `embeddinggemma` as the initial embedding model for evaluation only.

- Acquire it through the accepted model-provisioning workflow and record its exact tag, full digest, dimensions, context limit, runtime version, license, and integrity metadata.
- Apply the reference-PC capacity gate before full retrieval evaluation.
- Evaluate it on the approved accessibility-guidance gold set using the accepted retrieval metrics and per-scenario reporting.
- Verify that chunk lengths and query construction fit the model's effective input limit without silent truncation.
- Rebuild indexes when the model, digest, preprocessing, chunking, or normalization changes; never reuse an index across incompatible embedding configurations.
- Keep embedding local in the local-only mode. A hosted generation selection does not silently move embeddings to an external API.

Promoting `embeddinggemma` to the release configuration requires passing retrieval-quality, reproducibility, latency, memory, disk, and sustained-workload gates. If it fails, replace it with another capacity-qualified local model and retain the same retrieval provenance contract.

## Consequences

- The initial retrieval baseline uses a small artifact intended for on-device embedding workloads.
- A separate embedding adapter and immutable index identity remain necessary; the generation-provider abstraction does not control embeddings.
- The corpus and evaluation set determine suitability, not the model's general benchmark claims.
- A replacement embedding model requires a new index and regression evaluation but does not change corpus-source lineage.

## Primary reference

- [EmbeddingGemma on Ollama](https://ollama.com/library/embeddinggemma)

## Related decisions and requirements

- [ADR-0004: Reference-PC capacity gate](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-RETR-003`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-003`, `REQ-QUAL-004`, and `REQ-QUAL-009`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-003`
- [Local guidance retrieval execution and evaluation assessment](../candidates/guidance-retrieval/LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) — Proposed embedding profile and evaluation detail; it does not change this ADR's evaluation-only scope.
