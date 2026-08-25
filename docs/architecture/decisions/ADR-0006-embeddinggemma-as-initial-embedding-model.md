# ADR-0006: EmbeddingGemma as the initial embedding model

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The local retrieval pipeline needs an embedding model that can index and query the initial accessibility-guidance corpus within the reference PC's capacity. The choice must preserve local-only operation and exact index reproducibility while providing adequate retrieval quality for cited remediation guidance.

The currently published Ollama `embeddinggemma` artifact is a compact, local text-embedding option. Published size and general-purpose retrieval claims do not establish fitness for WCAG, ACT, APG, scanner metadata, or the project's chunking strategy.

### MVP acquisition and qualification amendment recorded 2026-08-25

ADR-0015 and the accepted installation requirements replace the original general “model-provisioning workflow” assumption. For the MVP, acquisition is an explicit user-consented action delegated to the selected local runtime after source, identity, license, transfer/storage information, destination, and network use are disclosed; model files remain outside the repository and any installer. OD-009, OD-010, and OD-017 also replace formal release promotion and broad performance gates with the compact retrieval checks and one practical reference-PC screen. The original release direction remains history but is Deferred.

## Considered options

1. Use a hosted embedding API.
2. Begin with a different small local embedding model.
3. Use `embeddinggemma` as the first local embedding configuration.

## Decision

Use `embeddinggemma` as the initial embedding model for evaluation only.

- Acquire it explicitly through the selected local runtime, outside the repository and any installer, after the user receives the required source, identity, license, transfer/storage, destination, and network disclosure and consents. Record its exact tag, full digest, dimensions, context limit, runtime version, license, and available integrity metadata.
- Apply the reference-PC capacity gate before full retrieval evaluation.
- Evaluate it only on the compact frozen three-scenario retrieval subset and its one representative provider-independent insufficiency control, with descriptive per-case results rather than a statistical or promotion claim.
- Verify that chunk lengths and query construction fit the model's effective input limit without silent truncation.
- Rebuild indexes when the model, digest, preprocessing, chunking, or normalization changes; never reuse an index across incompatible embedding configurations.
- Keep embedding local in the local-only mode. A hosted generation selection does not silently move embeddings to an external API.

Promoting `embeddinggemma` to a release configuration is Deferred. For the MVP it must pass the bounded retrieval checks and practical reference-PC screen; if it fails, replace it with one smaller capacity-screened local candidate while retaining the same retrieval provenance contract.

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
