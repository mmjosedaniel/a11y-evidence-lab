# ADR-0013: LangChain as the initial RAG integration baseline

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-24

## Context

The portfolio objective is to demonstrate a small, inspectable retrieval-augmented generation workflow rather than a production-scale accessibility platform. The first vertical slice retrieves curated WCAG guidance for one deterministic `image-alt` finding and supplies the retrieved passages to one structured generation call.

The project needs enough framework use to demonstrate practical RAG integration without allowing a framework to own scanner evidence, canonical corpus identity, review decisions, or comparison semantics. LangChain's JavaScript documentation describes a predictable two-step RAG shape in which retrieval always precedes generation, plus modular interfaces for embeddings, vector stores, retrievers, models, and structured output. That shape matches the selected portfolio slice and avoids agentic retrieval or workflow infrastructure that the MVP does not need.

## Considered options

1. Implement retrieval and model integration directly with provider and vector-store SDKs.
2. Use LangChain across scanning, evidence, retrieval, generation, review, and comparison.
3. Use LangChain only at the replaceable retrieval and generation integration boundaries.
4. Select LangChain, LangGraph, and LangSmith together as one mandatory stack.

## Decision

Use LangChain JavaScript as the initial evaluation baseline for the portfolio RAG slice, limited to replaceable retrieval and generation integration.

- Use a deterministic two-step flow: construct one privacy-safe query, retrieve a bounded set of passages, and then perform one structured generation call.
- Evaluate LangChain adapters for the accepted embedding, vector-store, local-generation, and future external-API baselines where an applicable integration exists.
- Use LangChain model integration and structured-output support only behind the application-owned generation-provider contract.
- Keep source acquisition approval, canonical corpus text, chunk identity, source locators, finding evidence, review state, citations, validation policy, and comparison outcomes in application-owned records.
- Do not use agentic retrieval, tools, query rewriting, self-correction, autonomous loops, or multi-agent behavior in the first slice.
- Do not use LangChain for Playwright or axe-core execution, evidence sanitization, durable persistence, human decisions, or deterministic comparison.
- Keep plain TypeScript module boundaries so LangChain can be replaced without changing persisted domain meaning or the six-step workflow.

LangGraph is not selected for the first slice. The linear workflow and one review decision should use ordinary application state until a demonstrated recovery or resume requirement justifies graph orchestration. LangSmith is also not selected as a product dependency: a later evaluation may use it with synthetic, publicly shareable fixture data only after its egress, retention, credential, and cost behavior is accepted. Local traces and evaluation records remain sufficient for the local-only path.

This decision does not select exact LangChain packages or versions, a JavaScript runtime, a vector-store deployment topology, a generation provider, LangGraph, LangSmith, a prompt-management service, or a release dependency. It does not authorize implementation. Release adoption requires the applicable provenance, determinism, privacy, capacity, packaging, and evaluation gates.

## Consequences

- The portfolio can demonstrate recognizable LangChain RAG integration without expanding the deterministic browser and evidence stages.
- The first implementation remains a small two-step RAG pipeline rather than an agent or distributed workflow.
- Framework objects terminate at adapters; application records retain stable evidence, source, citation, review, and comparison meaning.
- LangGraph and hosted tracing add no initial dependency or data-egress requirement.
- Replacing LangChain later may change integration code but must not change the provider-neutral contract or persisted provenance.

## Primary references

- [LangChain retrieval and two-step RAG](https://docs.langchain.com/oss/javascript/deepagents/retrieval)
- [LangChain JavaScript model structured output](https://docs.langchain.com/oss/javascript/langchain/models)
- [LangChain JavaScript Ollama embeddings integration](https://docs.langchain.com/oss/javascript/integrations/embeddings/ollama)
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md)
- [ADR-0010: Defer a local reranker](ADR-0010-defer-a-local-reranker.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-CORP-*`, `REQ-RETR-*`, and `REQ-GEN-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
