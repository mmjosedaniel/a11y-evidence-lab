# ADR-0006: EmbeddingGemma as the initial embedding model

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The local retrieval pipeline needs an embedding model that can encode and query the initial accessibility-guidance corpus within the reference PC's capacity. The choice must preserve embedding without a hosted API and repeatable retrieval inputs and configuration while providing adequate retrieval quality for cited remediation guidance.

The currently published Ollama `embeddinggemma` artifact is a compact, local text-embedding option. Published size and general-purpose retrieval claims do not establish fitness for WCAG, ACT, APG, scanner metadata, or the project's passage segmentation.

### Public-page terminology amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) adds bounded target-page networking but does not move embedding to a hosted API. The original **local-only operation** wording referred to local embedding, not to an offline page scan. The clarified wording below preserves the original embedding decision and applies it to both global generation modes.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017's hostile-network controls for the portfolio MVP. This does not change the local embedding decision: ordinary HTTPS traffic used for the trusted operator-entered page remains separate from corpus embedding and retrieval.

### MVP acquisition and qualification amendment recorded 2026-08-25

ADR-0015 and the accepted installation requirements replace the original general “model-provisioning workflow” assumption. For the MVP, acquisition is an explicit user-consented action delegated to the selected local runtime after source, identity, license, transfer/storage information, destination, and network use are disclosed; model files remain outside the repository and any installer. OD-009, OD-010, and OD-017 also replace formal release promotion and broad performance gates with the compact retrieval checks and one practical reference-PC screen. The original release direction remains history but is Deferred.

### Manual developer-managed setup amendment recorded 2026-08-27

[ADR-0020](ADR-0020-manual-developer-managed-local-model-setup.md) supersedes the application-triggered, consent-and-progress acquisition mechanics described in the 2026-08-25 amendment while preserving them as history. For the portfolio MVP, the developer installs Ollama and runs `ollama pull embeddinggemma` outside A11y Evidence Lab using official Ollama instructions. The application exposes no embedding-model download action, progress workflow, acquisition state, model manager, or separate readiness probe. When retrieval is actually requested, the embedding adapter checks only that the approved Ollama loopback endpoint is reachable and `embeddinggemma` is present, then validates the actual embedding operation's result.

### In-process vector amendment recorded 2026-08-27

[ADR-0019](ADR-0019-in-process-exact-vector-search.md) supersedes this record's reusable-index and immutable-index-identity assumptions for the MVP. The fixed corpus vectors are disposable in-process values rebuilt from the canonical passages and current embedding configuration. No persisted index, index identifier, index migration, or index lifecycle is required.

## Considered options

1. Use a hosted embedding API.
2. Begin with a different small local embedding model.
3. Use `embeddinggemma` as the first local embedding configuration.

## Decision

Use `embeddinggemma` as the initial embedding model for evaluation only.

- The developer acquires it outside A11y Evidence Lab with `ollama pull embeddinggemma` after installing Ollama through its official developer-managed setup. The application neither invokes nor manages acquisition, update, removal, progress, storage selection, or download state. Record the exact tag, full digest, dimensions, context limit, runtime version, license, and available integrity metadata for evaluation provenance.
- Check the approved Ollama loopback endpoint and presence of `embeddinggemma` only when retrieval is actually requested. Use the actual corpus/query embedding operation and boundary validation to establish success or visible failure; do not add a synthetic connection test, capability probe, or readiness report.
- Apply the reference-PC capacity gate before full retrieval evaluation.
- Evaluate it only on the compact frozen three-scenario retrieval subset and its one representative provider-independent insufficiency control, with descriptive per-case results rather than a statistical or promotion claim.
- Verify that chunk lengths and query construction fit the model's effective input limit without silent truncation.
- Rebuild the disposable in-process vectors when the model, digest, preprocessing, passage segmentation, or normalization changes; never reuse vectors across incompatible embedding configurations.
- Keep embedding local for both global generation modes. Selecting hosted generation does not silently move embeddings to an external API.

Promoting `embeddinggemma` to a release configuration is Deferred. For the MVP it must pass the bounded retrieval checks and practical reference-PC screen; if it fails, replace it with one smaller capacity-screened local candidate while retaining the same retrieval provenance contract.

## Consequences

- The initial retrieval baseline uses a small artifact intended for on-device embedding workloads.
- A missing runtime or `embeddinggemma` artifact fails the requested retrieval visibly without creating an application-owned installation or recovery workflow.
- A separate embedding adapter and recorded embedding configuration remain necessary; the generation-provider abstraction does not control embeddings. No canonical index identity is required.
- The corpus and evaluation set determine suitability, not the model's general benchmark claims.
- A replacement embedding model requires rebuilding the in-process vectors and rerunning the compact retrieval evaluation but does not change corpus-source lineage.

## Primary reference

- [EmbeddingGemma on Ollama](https://ollama.com/library/embeddinggemma)

## Related decisions and requirements

- [ADR-0004: Reference-PC capacity gate](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [ADR-0019: In-process exact vector search](ADR-0019-in-process-exact-vector-search.md)
- [ADR-0020: Manual developer-managed local model setup](ADR-0020-manual-developer-managed-local-model-setup.md)
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-003`–`REQ-INST-006` and `REQ-INST-017`
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-RETR-006`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-003`, `REQ-QUAL-004`, and `REQ-QUAL-009`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-003`
- [Local guidance retrieval execution and evaluation assessment](../candidates/guidance-retrieval/LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) — Proposed embedding profile and evaluation detail; it does not change this ADR's evaluation-only scope.
