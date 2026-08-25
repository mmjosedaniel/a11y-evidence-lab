# Local guidance retrieval execution and evaluation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the retrieval-execution and evaluation portion of the third workflow step. EmbeddingGemma, Chroma, and the thin LangChain role retain only the initial evaluation scope recorded in ADR-0006, ADR-0007, and ADR-0013; ADR-0010 continues to defer a reranker.

**Assessment date:** 2026-08-24.

This focused assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status, selects no release dependency or framework, and does not authorize implementation. Canonical behavior remains in [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval).

The proposed evaluation is limited to the [accepted first vertical slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice): one project-owned controlled fixture, one pinned axe-core `image-alt` rule, and WCAG 2.2 SC 1.1.1. Other rules and guidance topics are not needed to demonstrate the first RAG path.

## Minimal LangChain role for the portfolio slice

The architecture recommendation is to evaluate LangChain only as the visible composition layer around one deterministic retriever:

1. Adapt checksum-valid canonical passages to LangChain document values at the integration boundary while retaining the application-owned passage ID and filter metadata.
2. Invoke the application-owned local embedding and Chroma adapters through one retriever or runnable composition and return the fixed top-five results.
3. Hand the ranked passage references to application-owned citation resolution and, later, structured generation.

This gives the portfolio a concrete LangChain RAG integration without making the framework the owner of source acquisition, chunking, query construction, passage identity, support-state policy, citations, or persistence. Do not add agents, tools, memory, multi-query expansion, framework loaders or splitters, or LangGraph for this step. The integration must expose the exact filters, ranked passage IDs, raw metric values, and errors required by the retrieval record; a convenience API that hides them is not suitable. [ADR-0013](../../decisions/ADR-0013-langchain-as-initial-rag-integration.md) accepts this role for evaluation only, not as a release dependency. See the official [LangChain JavaScript vector-store integration overview](https://docs.langchain.com/oss/javascript/integrations/vectorstores/index) and [semantic-search tutorial](https://docs.langchain.com/oss/javascript/langchain/knowledge-base).

## Local embedding and vector baseline

### EmbeddingGemma

Use `embeddinggemma:300m` through the separate local embedding adapter, only at the evaluation scope accepted in ADR-0006. The current [Google model card](https://huggingface.co/google/embeddinggemma-300m/blob/main/README.md) documents a 2,048-token maximum input, 768-dimensional output with optional smaller dimensions, and distinct retrieval prompts for queries and documents. The current [Ollama artifact](https://ollama.com/library/embeddinggemma:300m) is approximately 622 MB, BF16, and requires Ollama 0.11.10 or later.

The smallest fixed profile should:

- use the full 768 dimensions, because reducing dimensions adds an unnecessary evaluation variable for this tiny corpus;
- apply the documented `task: search result | query: ...` query prefix and `title: ... | text: ...` document prefix exactly once inside the adapter, without changing canonical passages;
- use the Ollama [`/api/embed`](https://docs.ollama.com/api/embed) operation with truncation disabled so an oversized input fails visibly instead of being shortened silently;
- use the same exact model artifact and compatible preprocessing for corpus and query vectors while recording their different prompt roles;
- validate vector count, dimensions, finite and nonzero values, approximate normalization, processed-token count, and absence of truncation;
- record the full resolved model digest, artifact format/quantization, runtime and adapter versions, dimensions, context limit, prompt templates, preprocessing identity, and applicable license metadata;
- rebuild the index whenever the model digest, dimensions, prompts, preprocessing, chunking, or normalization changes.

The published artifact size does not exclude the candidate on storage-size grounds, but artifact size is not the runtime working set and cannot by itself pass ADR-0004's metadata prefilter or prove practical fit. Context, runtime, storage headroom, working-set evidence, and other required metadata still need review, followed by the ADR-0004 on-device capacity preflight with the application, browser, Chroma, and local generation workload active. EmbeddingGemma uses the [Gemma Terms](https://ai.google.dev/gemma/terms), so acquisition, use, notice, and redistribution treatment remain license-review gates.

### Chroma

Evaluate one local Chroma endpoint and one write-once-by-convention collection for the frozen index identity. The endpoint's ownership and launch mechanism remain unselected. Generate embeddings in the application adapter and send explicit vectors; do not enable an implicit or external embedding function. Chroma remains a derived, disposable index containing passage IDs, vectors, and the minimum filterable metadata. Canonical source artifacts, passage text, citation metadata, and corpus manifests remain outside it.

The minimal profile should record and bind the corpus snapshot, derivation profile, exact embedding digest and preprocessing, 768 dimensions, cosine metric, Chroma client/server versions, collection/index configuration, and filter schema. It should use only dense vector queries, exact metadata filters, and fixed top-5 output. Chroma's [collection configuration](https://docs.trychroma.com/docs/collections/configure) documents configurable distance and HNSW behavior; approximate-search recall and ranked-ID stability across restart and rebuild therefore remain evaluation questions.

Chroma's documented [client path](https://docs.trychroma.com/docs/run-chroma/clients) uses a running local service. Its current [server configuration](https://docs.trychroma.com/reference/server-env-vars) documents `0.0.0.0` as the default listen address and no built-in authentication implementation in Chroma 1.x. For the synthetic portfolio evaluation, configure `127.0.0.1`, keep the public-guidance collection unreachable from browser-delivered UI code, and verify zero non-loopback egress. If that narrow containment cannot be demonstrated, Chroma fails the evaluation. Process ownership, authentication for sensitive data, restart, cleanup, migration, repair, removal, and packaging remain OD-014 or distribution-stage decisions. Chroma's [metadata filtering](https://docs.trychroma.com/docs/querying-collections/metadata-filtering) and [precomputed-vector query path](https://docs.trychroma.com/docs/querying-collections/query-and-get) are sufficient for the proposed slice. The [Chroma repository](https://github.com/chroma-core/chroma) records Apache-2.0 licensing; exact dependency and notice review remains required before distribution.

## Finding-to-query projection

The retrieval boundary consumes the following components and references by the exact names defined in the Step 2 [evidence record and retrieval handoff](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md#handoff-to-retrieval-and-later-steps):

| Step 2 input | Use in retrieval |
| --- | --- |
| **Finding record** | Supplies the finding ID, `image-alt` rule-manifest reference, native result category, and references to the source evidence and normalized projection. |
| **Per-finding source-evidence item** | Supplies only allowlisted failure/check semantics and explicit omitted, withheld, or insufficient markers. Raw HTML and arbitrary check data are not query inputs. |
| **Normalized finding projection** | Supplies the deterministic, privacy-safe element type and selected `image-alt` facts used to form the query. This is the primary semantic input. |
| **Rule manifest** | Supplies the versioned rule identity and scanner context. Scanner help text remains informative mapping metadata, not corpus guidance. |
| **Approved scenario/rule-to-guidance mapping** | Supplies the curator-approved Non-text alternatives and SC 1.1.1 mapping used for query vocabulary and corpus filters. It is not a conformance determination. |
| **Scan-run publication record** | Supplies the exact fixture, scanner, rule-profile, sanitizer, and normalization provenance and confirms that the finding is publication-eligible. These values are lineage and eligibility inputs, not embedded page content. |

Opaque record IDs are retained for lineage but are not embedded. The one versioned query template includes only:

- scanner rule identifier and native result category;
- allowlisted failure/check meaning expressed by a fixed application-owned code or phrase;
- semantic element type, without an accessible name, page text, selector, or user value;
- the approved scenario and SC 1.1.1 mapping; and
- one fixed intent requesting the criterion, contextual distinction, and meaningful-versus-decorative implementation guidance.

For the accepted fixture, the canonical privacy-safe representation can be the following deterministic key/value serialization, with this field order and vocabulary versioned before evaluation:

```text
scenario=non-text-alternatives
standard=WCAG-2.2
success_criterion=1.1.1
scanner_rule=image-alt
result=violation
element_type=img
observed_fact=missing-text-alternative
intent=criterion-context-exceptions-meaningful-and-decorative-guidance
```

The retrieval run retains these exact privacy-safe bytes, their template and policy versions, the included and withheld field categories, and the source record references. It may also retain a digest calculated over those bytes to detect alteration, but the digest is integrity metadata and never substitutes for the reproducible query. A future sensitive live-page query would require the separately accepted data policy; it is unnecessary for this synthetic fixture.

The projection excludes target URLs, selectors, raw HTML, arbitrary page text, accessible names, user values, credentials, non-allowlisted scanner data, and model-authored paraphrases. The SC filter narrows the approved source pack; it does not claim that the scanner established a complete WCAG failure.

## Filtering, ranking, support, and citation

1. Reject an unknown, malformed, privacy-ineligible, or publication-ineligible finding projection before embedding.
2. Require an index whose identity exactly matches the selected immutable corpus snapshot, derivation profile, embedding digest, dimensions, preprocessing, metric, and store configuration.
3. Hard-filter candidates by corpus snapshot, approved source allowlist, English language, WCAG version, selected scenario/success-criterion mapping, and allowed source types.
4. Embed one query and request the five nearest candidates by cosine distance. Do not rewrite the query, combine lexical scores, search the web, or rerank.
5. Apply only a deterministic passage-ID tie-break for equal scores. Record every raw distance and its metric; do not convert it to confidence, authority, correctness, remediation quality, or conformance.
6. Resolve passage IDs from the canonical corpus, verify passage and source checksums, and reject stale, missing, or incompatible results.
7. Preserve the ranked order while labeling each passage's normative or informative authority independently. Similarity rank does not override the source hierarchy.
8. Construct the citation display from canonical metadata: publisher, document title and version, success criterion or technique, exact section heading/fragment, authority label, canonical URL, and immutable versioned URL when one exists. When the publisher exposes only a mutable URL, also show or retain the corpus snapshot, source revision or acquisition identifier, and checksum needed to resolve the exact retained version. The user must be able to inspect the exact retained passage.
9. Apply one versioned, deterministic support rule after passage resolution. Do not derive support from a similarity threshold alone.

The proposed first-slice support rule is intentionally simple:

| Support state | Candidate meaning | Required handoff behavior |
| --- | --- | --- |
| **Supported** | The ranked set contains the mapped normative SC 1.1.1 passage and the informative passages required by the frozen gold mapping for the finding, with no unresolved material conflict. | Proposal-eligible; pass the exact ranked passages and assessment record to generation. |
| **Weak** | Some relevant guidance is present, but one or more required gold passages or contextual branches are absent or only partially supported. | Apply the frozen policy. The proposed first-slice policy routes it to abstention; any later proposal-eligible policy requires acceptance under OD-007 and OD-009. |
| **Missing** | No usable mapped guidance supports the core finding, or the normative basis required by the frozen mapping cannot be resolved. | Mandatory abstention; do not request a remediation proposal. |
| **Conflicting** | Retained passages contain an unresolved material conflict after applying the recorded normative/informative source hierarchy. | Mandatory abstention with conflict references; do not request a remediation proposal. |
| **Unassessed** | The retrieval completed, but no approved support rule was applied. | Evaluation-only; it cannot enter the end-to-end generation workflow. |

A failed retrieval operation has no guidance-support state and produces no generation request. Similarity distances remain ranking observations, not confidence, authority, or support decisions. The exact gold passage set and support rule require OD-009 acceptance before they become an official gate.

## Conceptual retrieval record

This is a documentation-level composition of the existing **Retrieval run**, **Corpus source and snapshot**, and **Guidance passage** records in the [information and workflow lifecycle](../../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), not a database schema or a new canonical record type.

| Component | Minimum retained information |
| --- | --- |
| Identity and operation | Retrieval-run and target-index identifiers; exact input identities; start/completion time; completed or failed status; result or bounded error reference; configuration integrity metadata. |
| Input lineage | Exact Step 2 **finding record**, **per-finding source-evidence item**, **normalized finding projection**, **rule manifest**, **approved scenario/rule-to-guidance mapping**, and eligible **scan-run publication record** references; query-projection version; exact retained privacy-safe query bytes plus their integrity digest; included/withheld categories; query-policy and redaction versions. The digest never replaces the reproducible representation for this fixture. |
| Corpus scope | Corpus-snapshot and derivation-profile IDs; approved source-manifest ID; language, WCAG version, scenario/rule/success-criterion mapping; source-type filters; corpus and passage integrity checks. |
| Embedding configuration | Embedding adapter and runtime versions; exact model tag and full digest; artifact format/quantization and license reference; query prompt/preprocessing identity; dimensions and effective context limit; truncation policy. |
| Index and ranking configuration | Store/client/server and index versions; collection/index identity; document-embedding preprocessing; distance metric; complete filter representation; top-k; index configuration; activation version. |
| Ranked passage reference | Rank; passage and source IDs; raw distance/score and metric; passage checksum; source title, publisher, authority type, standard/version, exact locator, canonical URL, immutable versioned URL when available, and citation display label; otherwise the retained snapshot, source revision or acquisition identifier, and checksum that identify the exact mutable-URL version. Passage text remains in the canonical corpus rather than being copied into every retrieval run. |
| Guidance-support assessment | Supported, weak, missing, conflicting, or unassessed state when the operation completed; assessment-rule and handoff-policy versions; required, present, and absent gold-passage references; reason codes; conflict references; resulting generation eligibility. This state is not the operation status or a model probability. |

Every ranked passage must remain resolvable to the exact text and source version that existed in the recorded corpus snapshot. A later corpus refresh, index rebuild, or evaluation run creates new records and never rewrites historical retrieval lineage.

## Retrieval-quality evaluation before generation

Use the following **six retrieval cases inside the shared non-promotable 5–10-case portfolio suite**, all based on the same `image-alt` / SC 1.1.1 scenario:

1. the complete primary Step 2 input, expected to retrieve the normative criterion, contextual Understanding guidance, and the meaningful/decorative technique paths;
2. the same finding with optional page context explicitly withheld, proving that the privacy-safe query remains useful without private content;
3. a near-miss ranking case using related but non-required passages already present in the small source pack;
4. a controlled ranked-set case with a required passage absent, expected to produce **missing** or **weak** exactly as the frozen rule specifies;
5. a controlled ranked-set case with a material source conflict, expected to produce **conflicting** and mandatory abstention;
6. the primary retrieval result with no support rule applied, expected to remain **unassessed** and evaluation-only.

The first three cases evaluate the embedding, filters, index, and ranking end to end. The last three isolate the deterministic support and handoff policy without requiring more fixtures, rules, corpora, or models. Each case records the exact Step 2 inputs or controlled ranked set, exact retained query, required and acceptable passage IDs, distractors, expected support state and generation eligibility, rationale, and reviewer. The corpus must contain more than five plausible passages so top-five retrieval is not guaranteed by returning every passage. This section invokes no generator; Steps 4–6 reuse the shared case records and may add only stage-specific expected outputs while keeping the complete suite within 5–10 cases.

| Quality dimension | Initial criterion |
| --- | --- |
| Gold coverage | Every case has reviewed acceptable-passage mappings or an explicit missing/conflicting expectation; gold mappings resolve to the frozen corpus snapshot. |
| Relevance | For each of the three end-to-end cases, report whether every required passage appears in the top five and record Recall@5 plus concrete misses as descriptive pilot evidence. Defer Precision@5, nDCG@5, and promotion thresholds until a larger dataset makes them interpretable. |
| Citation integrity | 100% of returned passage IDs resolve to checksum-valid canonical text, exact locators, source versions, URLs, and visible authority/attribution metadata. |
| Filter correctness | 100% of returned passages belong to the requested snapshot, language, WCAG version, source allowlist, and scenario/success-criterion scope. |
| Authority handling | 100% of passages retain the correct normative/informative label; ranking never changes that label or presents a Technique as a requirement. |
| Support-state behavior | All six cases produce the expected supported, weak, missing, conflicting, or unassessed state and the documented generation eligibility; any false proposal-eligible result fails the pilot. |
| Repeatability | Repeating the three end-to-end cases under one pinned configuration returns the same ordered passage IDs, or exposes instability as an index/retrieval failure; raw floating-point values are compared only under an approved tolerance. |
| Local operation | Indexing and retrieval complete with zero non-loopback egress; record cold/warm latency, indexing time, peak RAM/VRAM/disk, and store/model lifecycle failures without setting performance gates before measurement. |

Classify every miss as at least one of: corpus gap, source/version error, chunk-boundary loss, rule-mapping error, query-projection error, privacy withholding, filter error, embedding/prompt/truncation error, index/configuration error, approximate-ranking error, or genuine weak/conflicting guidance. Tune the corpus, mapping, chunks, query, filters, and base ranking before reconsidering the reranker deferred by ADR-0010.

## Meaningful alternatives

These are single-variable replacement candidates, not additional stages and not configurations to combine in the first evaluation:

| Alternative | Trade-offs and trigger |
| --- | --- |
| [`qwen3-embedding:0.6b`](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) through its [Ollama artifact](https://ollama.com/library/qwen3-embedding:0.6b), retaining Chroma | The published candidate is approximately 0.6B parameters and 639 MB, supports a much longer context and up to 1,024 dimensions, and uses Apache-2.0 terms. Its artifact size does not exclude it on storage-size grounds, but the complete metadata prefilter and on-device preflight remain pending; its additional context is unnecessary for short structural passages and it may add compute cost. Evaluate it only if EmbeddingGemma fails the accessibility gold set, runtime support, or Gemma-license review. It requires the same capacity gate, a new exact index, and a later decision; it is not an automatic fallback. |
| [LanceDB OSS embedded local mode](https://lancedb.github.io/lancedb/js/functions/connect/), retaining EmbeddingGemma | It can avoid Chroma's separate service and supports local TypeScript vector search, including [exact brute-force search](https://docs.lancedb.com/search/vector-search) suitable for a tiny corpus. Its repository records an [Apache-2.0 license](https://github.com/lancedb/lancedb/blob/main/LICENSE), but it adds a native Rust-backed dependency, Windows packaging and format-migration work, and a new recovery/reproducibility surface. Consider it only if Chroma fails its topology, isolation, lifecycle, capacity, or packaging gates. A replacement requires a later decision; cloud, full-text, hybrid, and automatic embedding features remain out of scope. |

## Assumptions

- EmbeddingGemma and Chroma are plausible evaluation candidates for the reference PC, not proven capacity fits or release dependencies.
- The accepted `image-alt` / WCAG 2.2 SC 1.1.1 mapping remains fixed during evaluation, and the four-source English corpus pack receives an approved OD-004 disposition first.
- Retrieval quality and support-state behavior can be evaluated without a generative model or hosted service.

## Open questions

- Will the ADR-0013 thin LangChain role preserve inspectable provenance and acceptable local resource use when evaluated against the framework-independent baseline?
- Will OD-015 accept the exact deterministic query serialization, retrieval-record schema, and compatibility rules proposed here?
- Can the local Chroma evaluation endpoint satisfy the synthetic slice's loopback, renderer-separation, and zero-egress checks? Service ownership and distribution lifecycle remain deferred under OD-014.
- What exact required-passage mapping, weak-support policy, repeatability tolerance, and later representative quality thresholds will OD-007, OD-009, and OD-017 accept after the six-case retrieval subset?
- Will EmbeddingGemma's exact artifact, runtime, prompts, license, latency, and concurrent resource use pass the reference-PC and retrieval-quality gates?

## Risks

- Similarity ranking may cause informative material to appear more authoritative than normative text.
- A finding query may leak page content if raw evidence, selectors, URLs, names, or values escape the closed projection.
- Embedding prompts, dimensions, normalization, or silent truncation may differ between indexing and querying and invalidate retrieval.
- A stale or incompatible index may return passages from the wrong corpus or model configuration.
- Chroma's approximate ranking, local-service exposure, lack of built-in authentication, crash recovery, or resource use may fail evaluation.
- A tiny calibration set may overfit one rule and hide failures that appear in another scenario.
- Similarity distance may be mistaken for confidence, correctness, source authority, or accessibility conformance.

## Explicit non-goals

- Agentic retrieval, query generation or rewriting, multi-query retrieval, conversation memory, or an LLM in the retrieval loop.
- Lexical/dense hybrid search, score fusion, reranking, knowledge graphs, hosted embeddings, hosted vector storage, or automatic provider fallback.
- Promoting LangChain to a release dependency, selecting a canonical corpus database, selecting a release Chroma topology, requiring a second embedding model, or creating a multi-provider retrieval abstraction.
- Generating explanations, citation claims, remediation proposals, manual checks, or source-code changes in this step.
- Multi-user operation, distributed ingestion, production-scale indexing, analytics, telemetry, or cloud deployment.
- Accessibility certification, legal-compliance interpretation, whole-page accessibility claims, or treating retrieval success as proof of conformance.

## Planning acceptance criteria

This retrieval-execution portion is adequately defined for the proposed portfolio slice when:

1. One publication-eligible Step 2 finding can be transformed into the exact retained privacy-safe query above, and its digest is treated only as an integrity check.
2. The EmbeddingGemma and Chroma evaluation profiles can return five filtered passage references without web search, query rewriting, hybrid search, or reranking.
3. Every result resolves through the canonical corpus to checksum-valid text, authority type, source version, exact locator, and inspectable citation metadata.
4. Retrieval operation status remains separate from guidance-support state, and the supported, weak, missing, conflicting, and unassessed handoff rules are deterministic and visible.
5. The six-case retrieval subset can evaluate ranking, privacy minimization, citations, filters, authority labels, support behavior, repeatability, zero egress, and reference-PC resource use without invoking a generative model.
6. LangChain remains a replaceable ADR-0013 evaluation layer whose removal would not change canonical inputs, outputs, citations, or evaluation meaning.
7. Failure of EmbeddingGemma, Chroma, or LangChain evaluation can replace only the failed adapter or composition layer without expanding the first scenario.

## Documentation navigation

- Previous within this workflow step: [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md)
- Up: [Accessibility guidance retrieval assessments](README.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
