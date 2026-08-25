# ADR-0010: Defer a local reranker

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

A reranker could improve the ordering of passages returned by dense retrieval, but it would add another model artifact, capacity load, latency stage, provenance surface, and evaluation variable. The initial corpus is intentionally small, and no retrieval baseline has yet demonstrated a ranking problem that requires a reranker.

## Considered options

1. Include a local reranker in the initial retrieval baseline.
2. Use a hosted reranking API.
3. Defer reranking until fixed retrieval evaluation demonstrates a material need.

## Decision

Do not include a reranker in the initial MVP evaluation baseline.

Reconsider a reranker only when all of the following are true:

- the embedding and vector-store baseline has been tuned and evaluated on the approved fixed dataset;
- error analysis shows that candidate passages are retrieved but materially misordered;
- the accepted retrieval gate cannot be met through corpus, chunking, metadata, query, or base-ranking corrections alone; and
- a proposed local reranker passes the reference-PC capacity gate and can preserve passage-level provenance, deterministic configuration, and local-only operation.

A hosted reranker must not become an automatic substitute for the local-only path. Adding any reranker requires a new ADR identifying the exact model, runtime, insertion point, evaluation gain, resource cost, and failure behavior.

## Consequences

- The initial retrieval baseline remains smaller, faster to diagnose, and easier to reproduce.
- Retrieval quality may be lower until the evidence justifies an added ranking stage.
- The fixed evaluation set must preserve ranked results and error categories so the decision can be revisited objectively.
- No installer, model-management, or capacity budget is reserved for a reranker in the initial baseline.

## Related decisions and requirements

- [ADR-0004: Reference-PC capacity gate](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-RETR-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-003`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-009`
- [Local guidance retrieval execution and evaluation assessment](../candidates/guidance-retrieval/LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) — Proposed retrieval-quality evidence path; it preserves this ADR's initial reranker deferral.
