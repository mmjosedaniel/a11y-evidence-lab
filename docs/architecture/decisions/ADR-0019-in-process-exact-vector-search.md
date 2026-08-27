# ADR-0019: In-process exact vector search for the MVP

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-27

## Context

The portfolio MVP has one fixed, manually curated guidance corpus covering exactly three accessibility-rule mappings. Its retrieval goal is to demonstrate a genuine, inspectable RAG path with local embeddings and semantic ranking, not to demonstrate vector-database operations.

ADR-0007 selected Chroma for evaluation when durable local vector storage, restart survival, and broader index lifecycle behavior were still assumed. For this small immutable corpus, a persistent vector service adds process startup, loopback configuration, storage ownership, index lifecycle, failure modes, and approximate-search questions without improving the portfolio workflow. At the same time, replacing semantic retrieval with a direct rule-to-passage lookup would make the LangChain and embedding path ceremonial rather than demonstrating retrieval.

LangChain documents an in-memory vector store intended for lightweight and demonstration workloads. It keeps embeddings in process and performs exact linear similarity search; its default similarity measure is cosine similarity. That behavior is proportionate to this corpus and keeps retrieval visible without a separate service.

## Considered options

1. Continue with a persistent Chroma service.
2. Replace vector retrieval with deterministic rule-to-passage lookup.
3. Use an in-process exact vector search over locally generated EmbeddingGemma vectors.

## Decision

Use an in-process exact vector search as the MVP retrieval baseline. Evaluate LangChain JavaScript's documented in-memory vector-store integration for this role.

- Generate canonical passage and query vectors locally with the EmbeddingGemma configuration accepted in ADR-0006. The canonical setup tag is `embeddinggemma`; the 300M designation identifies the model family rather than a second configuration, and evaluation records the resolved full artifact digest.
- Do not embed the corpus, embed a query, or construct `MemoryVectorStore` at application startup. Only after the user explicitly requests retrieval, check the actual-use prerequisite and, when no compatible collection exists in the current process, build the small vector collection from the accepted canonical corpus. Cache it only for that process and rebuild it once per required in-process rebuild after a process restart or material corpus or embedding change. Do not persist the vector collection or run a vector-database service.
- Retrieve for one selected Finding at a time. Construct one privacy-safe semantic query from its accepted rule mapping and normalized allowlisted facts.
- Treat active corpus identity and English as validated catalog preconditions and retained provenance. Within that catalog, use only the exact supported rule family and mapped WCAG success criterion as the broad retrieval filter. Do not preselect exact source IDs or guidance roles before similarity ranking.
- Rank the eligible passages by exact cosine similarity and return fixed `top-k=3`. The cited LangChain contract does not define equal-score ordering, so application code must sort equal scores by passage ID before recording or presenting the ranked result.
- Keep canonical passage identity, source text, citation metadata, corpus lineage, support-state policy, and persisted retrieval records application-owned. Framework document objects and in-memory vectors are disposable runtime values.
- Record the validated catalog preconditions and provenance, EmbeddingGemma tag and resolved full digest, query representation, applied rule/SC filter, cosine metric, `top-k=3`, application-owned tie-break, ranked passage IDs, and scores needed by the accepted retrieval requirements. Do not create vector-service, collection, persistence-path, HNSW, backup, migration, or deletion records.
- Apply the application-owned guidance-sufficiency rule after ranking. If the three results do not provide the required support for the selected finding, preserve the Finding and use the existing insufficient-support and abstention behavior rather than widening the query or adding retrieval stages.
- Keep reranking, hybrid search, query rewriting, hosted embeddings, hosted vector storage, and automatic corpus expansion outside the MVP.

This decision supersedes ADR-0007 for the MVP. Chroma may be reconsidered only after a larger or mutable corpus, a measured first-retrieval/search problem, or an accepted persistence requirement demonstrates that the in-process exact search is insufficient.

## Consequences

- The MVP still demonstrates local embeddings, LangChain retrieval, similarity scores, citations, sufficiency gating, and grounded generation.
- The ranked result is not predetermined by an exact source or guidance-role allowlist; the compact gold cases can therefore exercise meaningful semantic retrieval.
- No second local service, vector-store persistence path, approximate index, or vector-database lifecycle is required.
- The vector collection is built on the first explicit retrieval request after process start and then reused in that process until a material incompatibility requires one rebuild. This avoids startup embedding while accepting a small first-retrieval or rebuild cost, measured only as part of the existing compact retrieval evaluation.
- Exact linear search is intentionally not a production-scale indexing strategy. Corpus growth or performance evidence may require a later ADR.
- LangChain's in-memory integration is an evaluation baseline, not a release-qualified dependency or authorization to implement.

## Primary references

- [LangChain JavaScript MemoryVectorStore integration](https://docs.langchain.com/oss/javascript/integrations/vectorstores/memory)
- [LangChain JavaScript semantic-search guide](https://docs.langchain.com/oss/javascript/langchain/knowledge-base)
- [EmbeddingGemma on Ollama](https://ollama.com/library/embeddinggemma)

## Related decisions and requirements

- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md) — superseded for the MVP
- [ADR-0010: Defer a local reranker](ADR-0010-defer-a-local-reranker.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [ADR-0022: Closed, versioned guidance corpus](ADR-0022-closed-versioned-guidance-corpus.md)
- [ADR-0023: Local-mode data boundary](ADR-0023-local-mode-data-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-CORP-*` and `REQ-RETR-*`
- [Local guidance retrieval execution and evaluation assessment](../candidates/guidance-retrieval/LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md)
