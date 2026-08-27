# ADR-0013: LangChain as the initial RAG integration baseline

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-24

## Context

The portfolio objective is to demonstrate a small, inspectable retrieval-augmented generation workflow rather than a production-scale accessibility platform. The first vertical slice retrieves curated WCAG guidance for one deterministic `image-alt` finding and supplies the retrieved passages to one structured generation call.

The project needs enough framework use to demonstrate practical RAG integration without allowing a framework to own scanner evidence, canonical corpus identity, review decisions, or comparison semantics. LangChain's JavaScript documentation describes a predictable two-step RAG shape in which retrieval precedes generation on an eligible path, plus modular interfaces for embeddings, vector stores, retrievers, models, and structured output. That shape matches the selected portfolio slice and avoids agentic retrieval or workflow infrastructure that the MVP does not need.

### Scope amendment recorded 2026-08-24

The context above preserves the one-`image-alt` scope in effect when this ADR was accepted. The later product decision OD-019 supersedes OD-002's one-scenario scope with exactly three independent, project-owned synthetic controlled profiles: `informative-image-alt` (`image-alt`/SC 1.1.1), `form-input-label` (`label`/SC 4.1.2), and `text-contrast` (`color-contrast`/SC 1.4.3). This ADR is not superseded: its Accepted-for-evaluation status and bounded LangChain role are unchanged. For any operation, LangChain remains limited to retrieval for one selected finding and, only when required finding evidence is complete and the completed retrieval is `supported`, one structured generation call. An `incomplete`, `missing`, or `conflicting` result produces deterministic abstention without a model call. The amendment does not select multi-rule orchestration, LangGraph, LangSmith, an agent, a service, a queue, a workflow engine, or a release dependency.

### Provider and observability amendment recorded 2026-08-25

[ADR-0014](ADR-0014-groq-as-mvp-external-generation-provider.md) brings one Groq adapter into the MVP alongside the selected local adapter. LangChain may compose the same bounded structured-generation step behind either adapter, but the application-owned contract and validation remain authoritative. LangSmith and all hosted tracing, telemetry, and analytics are now explicitly outside the MVP rather than an optional MVP evaluation aid; application-owned content-safe local records and diagnostics are sufficient.

### Authorized public-page amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) allows one page analysis to enumerate a variable number of deterministic findings. This does not expand LangChain's role. The user selects one finding, and LangChain composes retrieval and at most one eligible structured-generation call for that finding under the parent run's immutable `Local` or `Groq` mode. Other findings remain deterministic records until separately selected. Page-wide retrieval, multi-finding prompts, automatic queues, batch generation, synthesis across findings, and agentic iteration remain outside the MVP.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017's production-style URL security boundary for the portfolio MVP without expanding LangChain's role. The trusted-page scan may still enumerate many Findings, but retrieval and structured generation remain a bounded, sequential workflow for one explicitly selected Finding at a time.

### In-process retrieval amendment recorded 2026-08-27

[ADR-0019](ADR-0019-in-process-exact-vector-search.md) supersedes ADR-0007's Chroma baseline for the MVP. LangChain now composes an in-process exact cosine-similarity search over locally generated EmbeddingGemma vectors, using a broad rule/success-criterion filter and fixed `top-k=3`. This removes the persistent vector service and its lifecycle while preserving the bounded LangChain, embedding, ranking, citation, sufficiency, and evaluation path accepted by this ADR.

## Considered options

1. Implement retrieval and model integration directly with provider and vector-store SDKs.
2. Use LangChain across scanning, evidence, retrieval, generation, review, and comparison.
3. Use LangChain only at the replaceable retrieval and generation integration boundaries.
4. Select LangChain, LangGraph, and LangSmith together as one mandatory stack.

## Decision

Use LangChain JavaScript as the initial evaluation baseline for the portfolio RAG slice, limited to replaceable retrieval and generation integration.

- Use a deterministic bounded flow for one user-selected finding: construct one privacy-safe query from minimized application-owned facts and retrieve a bounded set of passages; perform at most one structured generation call only after application-owned policy confirms complete required evidence and a completed `supported` retrieval. Otherwise record deterministic abstention without invoking a model.
- Do not place the public target URL or origin, locator or selector, element text, image source, form value, arbitrary attribute, raw HTML, arbitrary page text, hidden content, redirect or network data, unrelated findings, prior review history, or browser artifacts in a retrieval query or model request. The application-owned evidence policy controls the exact rule-specific facts admitted at each boundary; if the remaining facts are insufficient, the workflow abstains rather than widening either boundary.
- Evaluate LangChain only where useful for the accepted EmbeddingGemma, in-process exact vector-search, selected local-generation, and Groq MVP boundaries. Direct adapter code remains allowed when it is smaller or makes the application contract clearer.
- Use LangChain model integration and structured-output support only behind the application-owned generation-provider contract.
- Keep source acquisition approval, canonical corpus text, stable `passageId` values with their corpus version and citation metadata, finding evidence, review state, validation policy, and comparison outcomes in application-owned records.
- Do not use page-wide or multi-finding prompts, agentic retrieval, tools, query rewriting, self-correction, autonomous loops, provider batches, or multi-agent behavior in the first slice.
- Do not use LangChain for Playwright or axe-core execution, evidence sanitization, durable persistence, human decisions, or deterministic comparison.
- Keep plain TypeScript module boundaries so LangChain can be replaced without changing persisted domain meaning or the six-step workflow.

LangGraph is not selected for the first slice. The linear workflow and one review decision should use ordinary application state until a demonstrated recovery or resume requirement justifies graph orchestration. LangSmith, hosted tracing, telemetry, and analytics are outside the MVP. Content-safe local records and diagnostics are sufficient for both generation modes; reconsidering a hosted observability service requires a later decision.

Except for ADR-0019's bounded in-memory evaluation mechanism, this decision does not select exact LangChain packages or versions, a JavaScript runtime, a persistent vector-store topology, a generation provider, LangGraph, LangSmith, a prompt-management service, or a release dependency. It does not authorize implementation. Any future release adoption requires a separate decision based on the scope and evidence then accepted.

## Consequences

- The portfolio can demonstrate recognizable LangChain RAG integration without expanding the deterministic browser and evidence stages.
- The first implementation remains a small two-step RAG pipeline rather than an agent or distributed workflow.
- Retrieval requires no persistent vector service; the fixed small vector collection is rebuilt in process and searched exactly.
- A public page may have many findings without creating a bulk RAG path; only one explicitly selected finding enters the sequential pipeline at a time.
- Framework objects terminate at adapters; application records retain stable evidence, source, citation, review, and comparison meaning.
- LangGraph and hosted tracing add no initial dependency or data-egress requirement.
- Replacing LangChain later may change integration code but must not change the provider-neutral contract or persisted provenance.

## Primary references

- [LangChain retrieval and two-step RAG](https://docs.langchain.com/oss/javascript/deepagents/retrieval)
- [LangChain JavaScript model structured output](https://docs.langchain.com/oss/javascript/langchain/models)
- [LangChain JavaScript Ollama embeddings integration](https://docs.langchain.com/oss/javascript/integrations/embeddings/ollama)
- [LangChain JavaScript MemoryVectorStore integration](https://docs.langchain.com/oss/javascript/integrations/vectorstores/memory)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md) — superseded for the MVP
- [ADR-0019: In-process exact vector search for the MVP](ADR-0019-in-process-exact-vector-search.md)
- [ADR-0010: Defer a local reranker](ADR-0010-defer-a-local-reranker.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-CORP-*`, `REQ-RETR-*`, and `REQ-GEN-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
- [Delivery readiness and open decisions](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md): OD-002 and OD-019
