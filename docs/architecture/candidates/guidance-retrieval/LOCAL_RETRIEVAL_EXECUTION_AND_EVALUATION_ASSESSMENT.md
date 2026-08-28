# Local guidance retrieval execution and evaluation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the retrieval-execution and evaluation portion of the third workflow step. EmbeddingGemma and the thin LangChain role retain only the evaluation scope recorded in ADR-0006 and ADR-0013. [ADR-0019](../../decisions/ADR-0019-in-process-exact-vector-search.md) accepts an in-process exact-search baseline and supersedes ADR-0007's Chroma baseline for the MVP. [ADR-0022](../../decisions/ADR-0022-closed-versioned-guidance-corpus.md) owns the canonical corpus boundary, and [ADR-0023](../../decisions/ADR-0023-local-mode-data-boundary.md) requires local embedding and local disposable vectors without a hosted embedding or vector service. ADR-0010 continues to defer a reranker.

**Assessment date:** 2026-08-24. **YAGNI revision:** 2026-08-27.

This assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status, selects no release dependency, and does not authorize implementation or corpus acquisition. Canonical behavior remains in [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval).

Retrieval processes one user-selected Finding and one query at a time for exactly these mappings:

| Rule family | Pinned axe rule | Approved retrieval mapping |
| --- | --- | --- |
| `informative-image-alt` | `image-alt` | WCAG 2.2 SC 1.1.1 |
| `form-input-label` | `label` | WCAG 2.2 SC 4.1.2 only |
| `text-contrast` | `color-contrast` | WCAG 2.2 SC 1.4.3 |

The scanned page is never corpus content. The query excludes the page URL, locator, raw HTML, arbitrary page text, form values, credentials, and sibling findings. An invalid, unknown, or ambiguous fixed rule-to-guidance mapping is a configuration or integrity failure with no support state. Only incomplete required Finding evidence under a valid mapping, or a completed valid retrieval with an `incomplete`, `missing`, or `conflicting` support state, follows the terminal pre-call abstention path.

## Recommendation: one in-process exact vector search

Use the smallest retrieval path that still demonstrates genuine RAG:

1. When the user explicitly requests retrieval for one selected Finding, validate that the active catalog has the expected corpus version and English-language precondition.
2. If no compatible collection exists in the current process, perform the actual EmbeddingGemma availability and embedding work, adapt the accepted canonical passages to LangChain documents, and hold their vectors only in that process.
3. Build one privacy-safe semantic query from the Finding's mapped rule, WCAG success criterion, semantic element type, and normalized observed fact, then generate its query vector locally.
4. Within the validated catalog, apply only the exact supported rule family and mapped WCAG success criterion as the broad retrieval filter.
5. Rank the remaining passages by exact cosine similarity and request fixed `top-k=3`. The cited LangChain contract does not define equal-score ordering, so application code sorts equal scores by passage ID before recording or presenting the result.
6. Resolve up to three passage IDs against the canonical corpus, construct citations, and apply the application-owned support rule.

Do not start or manage Chroma or another vector-database service. Do not persist vectors or an index, and do not embed the corpus, embed a query, or construct `MemoryVectorStore` at application startup. The fixed corpus is small enough to build its disposable vectors once per required in-process rebuild, beginning with the first explicit retrieval request after process start and repeating only after restart or a material corpus or embedding change. This removes service lifecycle and approximate-index complexity while preserving local embeddings, semantic ranking, citations, LangChain integration, deterministic sufficiency, and model-free evaluation.

LangChain's current JavaScript [MemoryVectorStore documentation](https://docs.langchain.com/oss/javascript/integrations/vectorstores/memory) describes an in-memory, ephemeral store with exact linear search and cosine similarity by default. It is the initial evaluation mechanism under ADR-0019. Canonical passage and retrieval records remain application-owned; framework documents and vectors are disposable runtime values.

## Embedding and search profile

### EmbeddingGemma

Use the canonical MVP setup tag `embeddinggemma` through the local embedding integration accepted in ADR-0006. `EmbeddingGemma 300M` identifies the selected model family; it is not a second evaluation configuration or competing setup tag. The current [Google model card](https://huggingface.co/google/embeddinggemma-300m/blob/main/README.md) documents distinct query and document retrieval prompts, and ADR-0006 accepts the current [Ollama `embeddinggemma` artifact](https://ollama.com/library/embeddinggemma) as the source for evaluation. Exact package versions and release qualification remain Proposed. At evaluation time, capture the configured tag and its resolved full artifact digest rather than relying on a mutable tag or family label alone.

For the bounded evaluation:

- use the same exact model artifact and compatible preprocessing for passage and query vectors;
- apply the documented query and document retrieval prefixes exactly once;
- disable silent input truncation;
- retain the configured tag, resolved full artifact digest, dimensions, prompt roles, and runtime version needed to reproduce the vector set; and
- rebuild the in-process vectors when the corpus, model identity, dimensions, or preprocessing changes.

ADR-0004 still governs practical fit on the reference PC. This assessment adds no second embedding model or comparison track.

### In-process exact search

The evaluation profile is fixed:

- one ephemeral in-process vector collection;
- exact linear search;
- cosine similarity;
- active corpus identity/version and English validated as catalog preconditions and retained as provenance;
- broad filtering only by accepted rule family and mapped WCAG success criterion within that catalog;
- fixed `top-k=3`;
- application-owned passage-ID sorting for equal scores, rather than reliance on framework ordering; and
- no persisted vectors, vector-service endpoint, collection administration, HNSW or other approximate index, deletion workflow, backup, migration, or recovery procedure.

The application retains passage IDs in document metadata and resolves all visible citation data from the canonical corpus. Each canonical passage has one application-owned guidance role for support evaluation, kept distinct from its normative or informative source authority. A similarity score is ranking evidence only; it is not confidence, source authority, correctness, accessibility status, or proof of conformance.

## Finding-to-query projection

The retrieval boundary consumes the Step 2 Finding's nested minimized evidence, the run-level scan provenance, and the approved rule-to-guidance mapping. Only the existing `runId`, `findingId`, and returned `passageId` values are needed for traceability, and none is embedded as query content.

One shared query template uses short natural-language labels from an allowlist rather than an exact source or guidance-role request:

```text
Find accessibility guidance for an axe-core {rule_id} violation mapped to WCAG 2.2 SC {success_criterion}.
Affected element type: {semantic_element_type}.
Observed condition: {normalized_observed_fact}.
Return guidance that explains the issue, a bounded remediation approach, and what a person must verify.
```

Examples of `normalized_observed_fact` are `missing text alternative`, `missing programmatic name`, and `contrast ratio below the recorded threshold`. A contrast query may include the allowlisted measured ratio and threshold only when the accepted evidence policy requires them. It does not include colors, surrounding text, names, labels, values, or other page content merely to improve ranking.

The exact query text, query-template version, included fact categories, and withheld categories remain inspectable. A query is rejected before embedding when its mapping is unknown, ambiguous, unsupported, or combines more than one Finding or success criterion.

## Filtering, ranking, support, and citation

1. Validate that the selected Finding and its nested minimized evidence are retrieval-eligible.
2. Validate the active catalog's corpus version and English-language precondition. On the first explicit retrieval request after process start, or when a material incompatibility requires a rebuild, build the disposable in-process vectors with the configured EmbeddingGemma tag, resolved full digest, and preprocessing.
3. Apply only the broad rule/success-criterion filter within the validated catalog. Do not filter to exact source IDs, source types, or guidance roles before ranking.
4. Run one exact cosine search with `top-k=3`, then apply the application-owned passage-ID sort for equal scores.
5. Resolve each passage ID against the canonical corpus and reject a stale, missing, or incompatible passage.
6. Preserve ranked order while showing each passage's application-owned guidance role separately from its normative or informative authority.
7. Construct citations from the canonical publisher, document title/version, section or Technique, exact heading/fragment, authority label, and URL.
8. Apply the accepted deterministic support policy after passage resolution. Similarity alone never establishes support.

Apply the accepted deterministic policy across mapping validation and passage resolution in this order: an execution or integrity failure has no state; this includes an invalid, unknown, or ambiguous fixed mapping rejected before retrieval. A curator-declared unresolved material conflict after normative precedence is `conflicting`; zero applicable resolved passages is `missing`; some applicable guidance with a profile-required role absent is `incomplete`; and all required roles in the resolved top three with no conflict is `supported`. Required Finding-evidence completeness is a separate generation-gate input. Similarity never determines support.

For the `image-alt` case, the top three must preserve the normative basis and purpose-dependent context plus enough technique guidance for a conditional proposal; the application must not claim that retrieval established whether the image is informative, functional, or decorative. For `label` and `color-contrast`, the expected normative, contextual, and remediation categories fit within the three-result boundary. Exact acceptable passage IDs are frozen before evaluation.

## Conceptual retrieval record

This is a documentation-level view of the planned conceptual nested retrieval record, not a database schema or implemented record.

| Component | Minimum retained information |
| --- | --- |
| Placement and lineage | Nested under the selected `findingId` in `run.json`; start/end time and successful or error disposition. No retrieval ID is required. |
| Query | Exact privacy-safe query text, template version, included/withheld fact categories, and approved rule mapping. |
| Retrieval configuration | Catalog preconditions and provenance (corpus version and English), configured EmbeddingGemma tag and resolved full digest, relevant preprocessing, exact cosine metric, applied rule/SC filter, application-owned equal-score ordering, and `top-k=3`. The disposable vectors require no identity or persisted record. |
| Ranked passages | Rank, canonical passage ID, exact cosine score, and resolvable citation reference. Passage text, application-owned guidance role, normative-or-informative authority, and full citation metadata remain in the canonical corpus. |
| Support | `supported`, `incomplete`, `missing`, or `conflicting`, with the deterministic reason and generation eligibility. An insufficient result supplies the terminal abstention's explanation and manual-investigation guidance; it creates no provider call or proposal-review decision. |

Application-owned TypeScript records need runtime validation at the finding input, embedding/search output, and persisted-JSON boundaries. No JSON Schema, code generation, schema framework, vector-database record model, migration system, or compatibility layer is required.

## Retrieval-quality evaluation before generation

Run retrieval once, independently of Local or Groq generation. Freeze the input Finding package, acceptable passage IDs, expected support state, and handoff before model output is observed.

The compact set remains four checks:

1. one complete `image-alt` / SC 1.1.1 input expected to return its accepted normative, purpose-context, and remediation categories within the top three and classify `supported`;
2. one complete `label` / SC 4.1.2 input expected to return its normative, programmatic-name context, and H44 remediation categories within the top three and classify `supported`;
3. one complete `color-contrast` / SC 1.4.3 input expected to return its normative threshold, interpretation context, and G18 remediation categories within the top three and classify `supported`; and
4. one frozen `incomplete` package in which at least one applicable passage resolves but the required remediation-guidance role is absent, expected to preserve the Finding and abstain without a model call.

At least one supported case must have more than three passages eligible after the broad filter. Its expected passages must earn their top-three positions through similarity ranking rather than an exact source or guidance-role allowlist. This prevents the vector path from becoming a disguised deterministic lookup.

| Quality dimension | Initial criterion |
| --- | --- |
| Ranked relevance | Every supported case returns its frozen directly relevant categories and acceptable passage IDs within the top three. |
| Genuine retrieval | At least one case ranks a gold passage above an eligible non-gold passage under the same broad filter. |
| Citation integrity | Every returned passage ID resolves to the exact canonical text, locator, source version, application-owned guidance role, authority label, and URL; the guidance role remains distinct from normative-or-informative authority. |
| Filter correctness | The active corpus/version and English preconditions are validated and retained as provenance; every result matches the applied rule family and exact success-criterion filter, and no exact source or role allowlist predetermines the result. |
| Mapping boundary | The `label` case remains restricted to SC 4.1.2 and never implies SC 3.3.2, SC 1.3.1, or complete non-conformance. |
| Support behavior | The insufficiency case preserves the Finding and records its expected support state, terminal application-authored abstention explanation, and manual-investigation guidance; it invokes no model and creates no proposal-review decision. |
| Practical operation | Corpus embedding and all four exact searches complete on the reference PC without making the interface unusable. Record observations without making performance or support claims. |

A concrete miss should first be assigned to corpus boundaries, mapping, query projection, privacy withholding, embedding/preprocessing, broad filtering, or base similarity ranking. Adjust only the smallest responsible boundary before reconsidering the reranker deferred by ADR-0010.

## Meaningful alternatives

| Alternative | Trade-off and trigger |
| --- | --- |
| Chroma persistent vector service | Provides durable indexing and broader vector-database operations but reintroduces a second service, persistence ownership, approximate-index behavior, and lifecycle work. Reconsider only when corpus growth, a measured first-retrieval/search problem, or an accepted persistence requirement makes the in-process exact path insufficient. ADR-0007 remains history, not the MVP baseline. |
| Direct rule-to-passage lookup | Is even smaller and fully deterministic, but it would not demonstrate semantic retrieval, embeddings, or a meaningful LangChain retriever. Use it only if the project explicitly removes RAG from the portfolio objective. |

## Assumptions and open questions

- The accepted eight-artifact pack produces a small enough passage collection for exact in-process search on the reference PC.
- The frozen broad rule/SC filters leave meaningful ranking choice while preventing cross-rule guidance; catalog identity/version and English remain validated preconditions rather than query-time retrieval filters.
- EmbeddingGemma passes the existing capacity and retrieval checks.
- Exact LangChain package/version and the final passage count remain implementation-stage details.
- The evaluation must confirm that the `image-alt` top three provide enough guidance for a conditional proposal; otherwise that case must abstain or the corpus/query boundary must be corrected without increasing architecture scope.

## Risks

- Three narrow gold queries can overfit the demonstration and do not predict broad-corpus retrieval quality.
- Broad rule/SC filtering can still leave too little ranking choice if the corpus is segmented too coarsely.
- An in-memory build adds first-retrieval time, and a material incompatibility can add a later rebuild cost, although the fixed corpus is deliberately small.
- Embedding prompt or model changes can alter ranking and require rerunning the compact retrieval checks.
- A similarity score may be mistaken for source authority, confidence, correctness, or conformance.
- A privacy defect in query projection could expose unnecessary page content even though the vector store is local.

## Explicit non-goals

- Persistent vector storage, Chroma or another vector-database service, approximate indexes, collection administration, backup, migration, repair, or recovery.
- Rules beyond the three named families, multiple findings per query, automatic retrieval for the finding collection, or broad WCAG coverage.
- Page ingestion, web search, automatic corpus expansion, framework loaders/splitters, or automatic source refresh.
- Query rewriting, multi-query retrieval, hybrid search, reranking, knowledge graphs, agents, memory, or an LLM in the retrieval loop.
- Hosted embeddings or vector storage, generation-provider fallback, analytics, telemetry, or cloud deployment.
- Generating explanations or remediation proposals in this step, modifying source code, or making accessibility, conformance, certification, or legal claims.

## Planning acceptance criteria

This retrieval-execution portion is adequately defined when:

1. one selected Finding can produce one exact privacy-safe semantic query without page URL, locator, raw HTML, arbitrary page text, credentials, or sibling content;
2. only an explicit retrieval request can trigger EmbeddingGemma work or `MemoryVectorStore` construction; the fixed passage vectors are built once per required in-process rebuild, query vectors are created locally, and one exact cosine search returns `top-k=3` with application-owned passage-ID ordering for equal scores;
3. the active corpus/version and English are validated catalog preconditions and retained provenance, while the search applies only the broad rule/success-criterion filter and no exact source or guidance-role allowlist;
4. every result resolves to inspectable canonical text and citation metadata, including one application-owned guidance role kept distinct from normative-or-informative authority;
5. the accepted support states and abstention behavior remain deterministic and separate from similarity scores or execution and integrity errors, including invalid, unknown, or ambiguous fixed mappings;
6. the compact evaluation covers the three supported mappings plus one insufficiency case, and at least one supported case demonstrates ranking among more than three eligible passages;
7. LangChain remains a thin, replaceable retrieval composition layer and no persistent vector service or index lifecycle is introduced; and
8. the evaluation makes no claim of broad retrieval quality, accessibility, conformance, certification, or release support.

## Documentation navigation

- Previous within this workflow step: [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md)
- Up: [Accessibility guidance retrieval assessments](README.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [ADR-0019: In-process exact vector search for the MVP](../../decisions/ADR-0019-in-process-exact-vector-search.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
