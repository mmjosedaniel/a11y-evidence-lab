# Local guidance retrieval execution and evaluation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the retrieval-execution and evaluation portion of the third workflow step. EmbeddingGemma, Chroma, and the thin LangChain role retain only the initial evaluation scope recorded in ADR-0006, ADR-0007, and ADR-0013; ADR-0010 continues to defer a reranker.

**Assessment date:** 2026-08-24.

This focused assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status, selects no release dependency or framework, accepts no support gate, and does not authorize implementation. Canonical behavior remains in [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval).

The proposed retrieval evaluation contains exactly three project-owned synthetic scenario profiles, processed independently one finding and one query at a time:

| Scenario profile | Pinned axe rule | Approved retrieval mapping |
| --- | --- | --- |
| `informative-image-alt` | `image-alt` | WCAG 2.2 SC 1.1.1 |
| `form-input-label` | `label` | WCAG 2.2 SC 4.1.2 only |
| `text-contrast` | `color-contrast` | WCAG 2.2 SC 1.4.3 |

All three profiles are part of the [accepted first vertical slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) through OD-019. Their exact retrieval mechanism and support policy remain Proposed. The `label` rule itself is not mapped to SC 3.3.2 or SC 1.3.1, and no scanner result establishes complete success-criterion non-conformance.

## Minimal LangChain role for the portfolio demonstration

The architecture recommendation is to evaluate LangChain only as the visible composition layer around one deterministic retriever:

1. Adapt checksum-valid canonical passages to LangChain document values at the integration boundary while retaining application-owned passage IDs and filter metadata.
2. Invoke the application-owned local embedding and Chroma adapters through one retriever or runnable composition and return fixed top-five results for one query.
3. Hand ranked passage references to application-owned citation resolution and, for an accepted scenario with sufficient support, later structured generation.

This gives the portfolio a concrete LangChain RAG integration without making the framework the owner of source acquisition, chunking, query construction, passage identity, support-state policy, citations, or persistence. Do not add agents, tools, memory, multi-query expansion, framework loaders or splitters, or LangGraph. The integration must expose exact filters, ranked passage IDs, raw metric values, and errors; a convenience API that hides them is unsuitable. [ADR-0013](../../decisions/ADR-0013-langchain-as-initial-rag-integration.md) accepts this role for evaluation only, not as a release dependency. See the official [LangChain JavaScript vector-store integration overview](https://docs.langchain.com/oss/javascript/integrations/vectorstores/index) and [semantic-search tutorial](https://docs.langchain.com/oss/javascript/langchain/knowledge-base).

## Local embedding and vector baseline

### EmbeddingGemma

Use `embeddinggemma:300m` through the separate local embedding adapter, only at the evaluation scope accepted in ADR-0006. The current [Google model card](https://huggingface.co/google/embeddinggemma-300m/blob/main/README.md) documents a 2,048-token maximum input, 768-dimensional output with optional smaller dimensions, and distinct retrieval prompts for queries and documents. The current [Ollama artifact](https://ollama.com/library/embeddinggemma:300m) is approximately 622 MB, BF16, and requires Ollama 0.11.10 or later.

The smallest fixed profile should:

- use the full 768 dimensions, because reducing dimensions adds an unnecessary variable for this tiny corpus;
- apply the documented `task: search result | query: ...` query prefix and `title: ... | text: ...` document prefix exactly once inside the adapter, without changing canonical passages;
- use the Ollama [`/api/embed`](https://docs.ollama.com/api/embed) operation with truncation disabled so an oversized input fails visibly instead of being shortened silently;
- use the same exact model artifact and compatible preprocessing for corpus and query vectors while recording their different prompt roles;
- validate vector count, dimensions, finite and nonzero values, approximate normalization, processed-token count, and absence of truncation;
- record the full resolved model digest, artifact format/quantization, runtime and adapter versions, dimensions, context limit, prompt templates, preprocessing identity, and applicable license metadata;
- rebuild the index whenever the model digest, dimensions, prompts, preprocessing, chunking, or normalization changes.

The published artifact size does not exclude the candidate on storage-size grounds, but artifact size is not the runtime working set and cannot by itself pass ADR-0004's metadata prefilter or prove practical fit. Context, runtime, storage headroom, working-set evidence, and other required metadata still need review, followed by the ADR-0004 on-device capacity preflight with the application, browser, Chroma, and local generation workload active. EmbeddingGemma uses the [Gemma Terms](https://ai.google.dev/gemma/terms), so acquisition, use, notice, and redistribution treatment remain license-review gates.

### Chroma

Evaluate one local Chroma endpoint and one write-once-by-convention collection for the frozen index identity. The endpoint's ownership and launch mechanism remain unselected. Generate embeddings in the application adapter and send explicit vectors; do not enable an implicit or external embedding function. Chroma remains a derived, disposable index containing passage IDs, vectors, and minimum filterable metadata. Canonical source artifacts, passage text, citation metadata, mapping inputs, and corpus manifests remain outside it.

The minimal profile binds the corpus snapshot, derivation profile, exact embedding digest and preprocessing, 768 dimensions, cosine metric, Chroma client/server versions, collection/index configuration, and filter schema. It uses only dense vector queries, exact metadata filters, and fixed `top-k=5`; an eligible set with fewer than five passages is not padded. Chroma's [collection configuration](https://docs.trychroma.com/docs/collections/configure) documents configurable distance and HNSW behavior, so approximate-search recall and ranked-ID stability across restart and rebuild remain evaluation questions.

Chroma's documented [client path](https://docs.trychroma.com/docs/run-chroma/clients) uses a running local service. Its current [server configuration](https://docs.trychroma.com/reference/server-env-vars) documents `0.0.0.0` as the default listen address and no built-in authentication implementation in Chroma 1.x. For synthetic evaluation, configure `127.0.0.1`, keep the public-guidance collection unreachable from browser-delivered UI code, and verify zero non-loopback egress. If that containment cannot be demonstrated, Chroma fails evaluation. Process ownership, authentication for sensitive data, restart, cleanup, migration, repair, removal, and packaging remain OD-014 or distribution-stage decisions. Chroma's [metadata filtering](https://docs.trychroma.com/docs/querying-collections/metadata-filtering) and [precomputed-vector query path](https://docs.trychroma.com/docs/querying-collections/query-and-get) are sufficient. The [Chroma repository](https://github.com/chroma-core/chroma) records Apache-2.0 licensing; exact dependency and notice review remains required before distribution.

## Finding-to-query projection

The retrieval boundary consumes the following components and references by the exact names defined in the Step 2 [evidence record and retrieval handoff](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md#handoff-to-retrieval-and-later-steps):

| Exact Step 2 input | Use in retrieval |
| --- | --- |
| **Finding record** | Supplies the finding ID, rule-manifest reference, native result category, and references to the source evidence and normalized projection. |
| **Per-finding source-evidence item** | Supplies only allowlisted failure/check semantics and explicit omitted, withheld, or insufficient markers. Raw HTML and arbitrary check data are not query inputs. |
| **Normalized finding projection** | Supplies the deterministic, privacy-safe semantic element type and selected scenario fact code. This is the primary semantic input. |
| **Rule manifest** | Supplies the pinned rule identity and scanner version. Scanner help text is mapping metadata outside the embedded corpus. |
| **Approved scenario/rule-to-guidance mapping** | Supplies the curator-approved scenario and single SC mapping, external mapping/boundary references, query vocabulary, corpus filters, and mapping version. It is not a conformance determination. |
| **Scan-run publication record** | Supplies fixture, scanner, rule-profile, sanitizer, and normalization provenance and confirms publication eligibility. These values are lineage and eligibility inputs, not embedded page content. |

Opaque record IDs are retained for lineage but are not embedded. All three profiles use one versioned query template with exactly this field order and no optional free text:

```text
scenario={approved-scenario-code}
standard=WCAG-2.2
success_criterion={approved-success-criterion}
scanner_rule={pinned-axe-rule-id}
result={native-result-category}
element_type={allowlisted-semantic-element-type}
observed_fact={allowlisted-fact-code}
intent={scenario-owned-fixed-intent-code}
```

The three deterministic example serializations are:

### `image-alt` / SC 1.1.1

```text
scenario=informative-image-alt
standard=WCAG-2.2
success_criterion=1.1.1
scanner_rule=image-alt
result=violation
element_type=img
observed_fact=missing-text-alternative
intent=criterion-context-exceptions-meaningful-and-decorative-guidance
```

### `label` / SC 4.1.2

```text
scenario=form-input-label
standard=WCAG-2.2
success_criterion=4.1.2
scanner_rule=label
result=violation
element_type=input
observed_fact=missing-programmatic-name
intent=criterion-programmatic-name-and-native-label-association-guidance
```

This serialization requests only SC 4.1.2 guidance. It does not add SC 3.3.2 or SC 1.3.1, infer that a visible label is absent, or claim full SC 4.1.2 non-conformance.

### `color-contrast` / SC 1.4.3

```text
scenario=text-contrast
standard=WCAG-2.2
success_criterion=1.4.3
scanner_rule=color-contrast
result=violation
element_type=text
observed_fact=contrast-below-rule-threshold
intent=criterion-thresholds-exceptions-and-contrast-technique
```

The retrieval run retains the exact privacy-safe query bytes, template and vocabulary versions, included and withheld field categories, and all six source-record references. It may retain a digest over those bytes to detect alteration, but the digest is integrity metadata and never substitutes for the reproducible query. Each project-owned synthetic profile uses fixed allowlisted codes; no private context is necessary.

The projection excludes target URLs, selectors, raw HTML, arbitrary page text, accessible names, label text, user values, credentials, colors copied from a private target, non-allowlisted scanner data, and model-authored paraphrases. A query is rejected if the mapping is unknown, ambiguous, or requests more than one profile or SC.

## Filtering, ranking, support, and citation

1. Reject an unknown, malformed, privacy-ineligible, publication-ineligible, multi-profile, or mapping-incompatible finding projection before embedding.
2. Require an index whose identity exactly matches the immutable corpus snapshot, derivation profile, embedding digest, dimensions, preprocessing, metric, and store configuration.
3. Hard-filter by corpus snapshot, English, WCAG 2.2, selected scenario profile, exact SC, allowed source IDs, source types, and guidance roles. One query cannot retrieve another profile's passages.
4. Embed one query and request fixed `top-k=5` candidates by cosine distance. Do not rewrite the query, search the web, combine lexical scores, or rerank.
5. Apply only a deterministic passage-ID tie-break for equal scores. Record every raw distance and metric; never convert similarity into confidence, authority, correctness, remediation quality, or conformance.
6. Resolve passage IDs from the canonical corpus, verify passage and source checksums, and reject stale, missing, or incompatible results.
7. Preserve ranked order while labeling each passage's normative or informative authority independently. Similarity rank never overrides source hierarchy.
8. Construct citations from canonical metadata: publisher, document title and version, SC or Technique, exact heading/fragment, authority label, canonical URL, and immutable versioned URL when available. For a mutable URL, retain the corpus snapshot, source revision/acquisition identifier, and checksum needed to inspect the exact retained passage.
9. Apply one versioned deterministic support rule after passage resolution. Do not derive support from a similarity threshold alone.

The exact hard filters and frozen guidance roles are:

| Scenario | Eligible embedded guidance | Required roles for `supported` |
| --- | --- | --- |
| `image-alt` | Dated WCAG SC 1.1.1/definitions, Understanding 1.1.1, H37, H67 | Normative criterion; purpose/exceptions context; meaningful-image path; decorative-image path. |
| `label` | Dated WCAG SC 4.1.2/definitions, Understanding 4.1.2, H44 | Normative programmatic-name requirement; name context; applicable native-label association technique. The pinned axe/ACT mapping boundary must also validate, but it is not a ranked passage. |
| `color-contrast` | Dated WCAG SC 1.4.3/definitions, Understanding 1.4.3, G18 | Normative thresholds/exceptions; interpretation context; technique/calculation context. |

For each role, the frozen gold mapping names one or more acceptable passage IDs. A `supported` result requires all scenario roles and a valid external mapping boundary; it does not establish that the technique applies to every page context.

| Support state | Deterministic candidate meaning | Required handoff behavior |
| --- | --- | --- |
| **Supported** | All required roles are present, checksum-valid, correctly scoped, and free of unresolved material conflict. | Support-sufficient for one structured generation call using the selected accepted scenario and exact ranked passages. |
| **Weak** | Some relevant guidance is present, but at least one required role is absent or only partially covered. | Policy-controlled. The frozen Proposed pilot policy requires abstention; a proposal-eligible weak policy requires a later accepted decision. |
| **Missing** | No usable mapped guidance supports the core finding, the normative role is absent, or the required mapping boundary cannot be resolved. | Mandatory abstention; do not request generation. |
| **Conflicting** | An unresolved material conflict remains after applying recorded authority and version rules. | Mandatory abstention with conflict references; do not request generation. |
| **Unassessed** | Retrieval completed, but no approved support rule was applied. | Evaluation-only; make no product generation request and do not present it as supported. |

A failed operation has no guidance-support state and produces no generation request. A stale or integrity-invalid input is rejected or fails the operation rather than creating another first-slice lifecycle state. Similarity distances remain ranking observations. This Proposed rule does not accept OD-009.

## Conceptual retrieval record

This is a documentation-level composition of the existing **Retrieval run**, **Corpus source and snapshot**, and **Guidance passage** records in the [information and workflow lifecycle](../../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), not a database schema or new canonical record type.

| Component | Minimum retained information |
| --- | --- |
| Identity and operation | Retrieval-run and target-index IDs; start/completion time; first-slice `completed` or `failed` status; result or bounded error reference; configuration integrity metadata. The first slice has no interactive cancellation or separate stale state. |
| Input lineage | Exact Step 2 **finding record**, **per-finding source-evidence item**, **normalized finding projection**, **rule manifest**, **approved scenario/rule-to-guidance mapping**, and eligible **scan-run publication record** references; query-projection version; exact privacy-safe query bytes and integrity digest; included/withheld categories; query-policy and redaction versions. |
| Mapping boundary | Scenario-profile and mapping IDs/version; one selected SC; pinned axe and ACT mapping/boundary references with version, locator, acquisition/checksum, and review provenance; explicit excluded mappings. These are not ranked citations. |
| Corpus scope | Corpus-snapshot and derivation-profile IDs; approved eight-artifact manifest; language, WCAG version, scenario/SC mapping; source and guidance-role filters; corpus/passage integrity checks. |
| Embedding configuration | Embedding adapter and runtime versions; exact model tag and digest; artifact format/quantization and license reference; query prompt/preprocessing identity; dimensions and effective context limit; truncation policy. |
| Index and ranking configuration | Store/client/server/index versions; collection identity; document preprocessing; cosine metric; complete filter representation; `top-k=5`; index configuration and activation version. |
| Ranked passage reference | Rank; passage/source IDs; raw distance and metric; passage checksum; source title, publisher, authority type, standard/version, locator, canonical and immutable URLs, and citation display label. Passage text remains in the canonical corpus. |
| Guidance-support assessment | Supported, weak, missing, conflicting, or unassessed state after a completed operation; assessment-rule and handoff-policy versions; required/present/absent role and passage references; reason codes; conflicts; resulting generation eligibility. This is not operation status or a model probability. |

Every ranked passage must resolve to the exact text and source version in the recorded snapshot. A corpus refresh, mapping change, index rebuild, or new evaluation creates new records and never rewrites historical lineage.

## Retrieval-quality evaluation before generation

Use exactly these **six retrieval cases as the retrieval subset of the bounded shared Proposed evaluation suite**. They do not accept OD-009 or expand the accepted first vertical slice:

1. one complete `image-alt` / SC 1.1.1 Step 2 input, expected to retrieve all four required guidance roles and classify **supported**;
2. one complete `label` / SC 4.1.2 Step 2 input, expected to retrieve its three required roles, preserve the excluded SC 3.3.2/1.3.1 boundary, and classify **supported**;
3. one complete `color-contrast` / SC 1.4.3 Step 2 input, expected to retrieve its three required roles and classify **supported**;
4. one controlled `image-alt` ranked set with the H67/decorative role withheld while the other required roles remain, expected to classify **weak** and abstain under the frozen pilot policy;
5. one controlled ranked set with a deliberately documented material conflict that the authority/version rules cannot resolve, expected to classify **conflicting** and abstain; the conflict control is not an added corpus artifact or page fixture;
6. one otherwise complete primary ranked set with no support rule applied, expected to remain **unassessed**, evaluation-only, and absent from product generation.

Cases 1–3 evaluate the embedding, exact scenario filter, index, and ranking end to end. Cases 4–6 isolate deterministic support and handoff behavior without additional pages, sources, models, or retrieval variants. There is one failing finding/query per scenario in this retrieval subset. The accepted corrected contrast revision remains available to the later comparison step; retrieval adds no third contrast revision. Every case records the exact Step 2 inputs or controlled ranked set, exact retained query when applicable, mapping and corpus versions, required/acceptable passage IDs, distractors, expected support state and generation eligibility, rationale, and reviewer.

| Quality dimension | Initial criterion |
| --- | --- |
| Gold coverage | Every case has reviewed acceptable-passage mappings or an explicit weak/conflicting/unassessed expectation; all referenced passages resolve to the frozen snapshot. |
| Relevance | For each of the three primary cases, report whether every required role appears in the top five and record Recall@5 plus concrete misses as descriptive pilot evidence. Defer Precision@5, nDCG@5, and promotion thresholds until a larger dataset makes them meaningful. |
| Citation integrity | 100% of returned passage IDs resolve to checksum-valid canonical text, exact locators, source versions, URLs, and visible authority/attribution metadata. |
| Filter correctness | 100% of returned passages belong to the selected snapshot, language, WCAG version, scenario, SC, source allowlist, and guidance roles; cross-profile returns fail the pilot. |
| Mapping boundary | The `label` case records only SC 4.1.2 and never infers SC 3.3.2, SC 1.3.1, a missing visible label, or full non-conformance. |
| Authority handling | 100% of passages retain correct normative/informative labels; ranking never changes authority or presents a Technique as a requirement. |
| Support behavior | All six cases produce their expected states and handoff behavior; any false proposal-eligible weak, conflicting, or unassessed result fails the pilot. |
| Repeatability | Repeating cases 1–3 under one pinned configuration returns the same ordered passage IDs, or exposes instability as an evaluation failure; floating-point values use an accepted comparison tolerance. |
| Local operation | Indexing and retrieval complete with zero non-loopback egress; record cold/warm latency, indexing time, peak RAM/VRAM/disk, and lifecycle failures without setting performance gates before measurement. |

Classify every miss as at least one of: corpus gap, source/version error, chunk-boundary loss, rule-mapping error, query-projection error, privacy withholding, filter error, embedding/prompt/truncation error, index/configuration error, approximate-ranking error, or genuine weak/conflicting guidance. Tune the corpus, mapping, chunks, query, filters, and base ranking before reconsidering the reranker deferred by ADR-0010.

## Meaningful alternatives

These are single-variable replacement candidates, not additional stages or configurations to combine in the first evaluation:

| Alternative | Trade-offs and trigger |
| --- | --- |
| [`qwen3-embedding:0.6b`](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) through its [Ollama artifact](https://ollama.com/library/qwen3-embedding:0.6b), retaining Chroma | The published candidate is approximately 0.6B parameters and 639 MB, supports a much longer context and up to 1,024 dimensions, and uses Apache-2.0 terms. Its artifact size does not exclude it, but the complete metadata prefilter and on-device preflight remain pending; its extra context is unnecessary for short passages and may add compute cost. Evaluate it only if EmbeddingGemma fails the gold set, runtime support, or license review. It requires the same capacity gate, a new exact index, and a later decision; it is not an automatic fallback. |
| [LanceDB OSS embedded local mode](https://lancedb.github.io/lancedb/js/functions/connect/), retaining EmbeddingGemma | It can avoid Chroma's separate service and supports local TypeScript vector search, including [exact brute-force search](https://docs.lancedb.com/search/vector-search) suitable for a tiny corpus. Its repository records an [Apache-2.0 license](https://github.com/lancedb/lancedb/blob/main/LICENSE), but it adds a native Rust-backed dependency, Windows packaging and format-migration work, and a new recovery/reproducibility surface. Consider it only if Chroma fails topology, isolation, lifecycle, capacity, or packaging gates. Cloud, full-text, hybrid, and automatic embedding features remain out of scope. |

## Assumptions

- EmbeddingGemma and Chroma are plausible evaluation candidates for the reference PC, not proven capacity fits or release dependencies.
- The three pinned axe-to-SC mappings remain fixed during evaluation, and the eight-artifact English corpus receives an approved OD-004 disposition first.
- Each accepted synthetic profile can supply the exact named Step 2 inputs without private content.
- Retrieval quality and support-state behavior can be evaluated without a generative model or hosted service.

## Open questions

- Will the ADR-0013 thin LangChain role preserve inspectable provenance and acceptable local resource use when evaluated against the framework-independent boundary?
- Will OD-015 accept the deterministic query template, three vocabularies, retrieval-record shape, and compatibility rules proposed here?
- Can the local Chroma endpoint satisfy loopback, renderer-separation, and zero-egress checks? Service ownership and distribution lifecycle remain deferred under OD-014.
- What required-passage mappings, weak-support policy, repeatability tolerance, and later representative quality thresholds will OD-007, OD-009, and OD-017 accept after the six-case retrieval subset?
- Will EmbeddingGemma's exact artifact, runtime, prompts, license, latency, and concurrent resource use pass the reference-PC and retrieval-quality gates?

## Risks

- Similarity ranking may make informative material appear more authoritative than normative text.
- A query may leak page content if raw evidence, selectors, URLs, names, labels, values, or colors escape the closed projection.
- Embedding prompts, dimensions, normalization, or silent truncation may differ between indexing and querying and invalidate retrieval.
- A stale or incompatible index may return passages from the wrong corpus, scenario, mapping, or model configuration.
- Chroma's approximate ranking, local-service exposure, crash recovery, or resource use may fail evaluation.
- Mutable axe/ACT mappings could cause the `label` profile to regain unsupported criteria or silently change meaning.
- SC 1.4.3 thresholds and exceptions depend on context that a minimal query intentionally omits; retrieval must not turn a scanner measurement into conformance proof.
- Six controlled cases and hard scenario filters can overfit the demonstration and do not predict broad-corpus retrieval quality.
- Similarity distance may be mistaken for confidence, correctness, source authority, or accessibility conformance.

## Explicit non-goals

- More than the three named profiles, multiple findings per query, contrast revisions beyond the accepted failing/corrected pair, broad WCAG coverage, or a complete corpus.
- Agentic retrieval, query generation/rewrite, multi-query retrieval, conversation memory, or an LLM in the retrieval loop.
- Lexical/dense hybrid search, score fusion, reranking, knowledge graphs, hosted embeddings/storage, or provider fallback.
- Promoting LangChain to a release dependency, selecting a canonical corpus database, selecting a release Chroma topology, requiring a second embedding model, or creating a multi-provider abstraction.
- Generating explanations, citation claims, remediation proposals, manual checks, or source-code changes in this step.
- Multi-user operation, distributed ingestion, production-scale indexing, analytics, telemetry, or cloud deployment.
- Accessibility certification, legal-compliance interpretation, whole-page accessibility claims, or treating retrieval success as conformance proof.

## Planning acceptance criteria

This retrieval-execution portion is adequately defined for the Proposed evaluation when:

1. Each of the three publication-eligible Step 2 findings can independently produce the corresponding exact serialization through one shared privacy-safe template; exact query bytes are retained and their digest is integrity-only.
2. Exact scenario filters restrict each query to its selected passages from the eight-artifact corpus, while axe and ACT mapping inputs remain outside the ranked corpus.
3. EmbeddingGemma and Chroma remain evaluation-only baselines that can request fixed `top-k=5` without web search, crawling, query rewriting, hybrid search, or reranking.
4. Every result resolves to checksum-valid text, authority type, source version, exact locator, and inspectable citation metadata.
5. Scenario-specific support roles and the supported, weak, missing, conflicting, and unassessed semantics are deterministic; weak follows a frozen abstention policy, missing/conflicting abstain, and unassessed is evaluation-only.
6. The six-case retrieval subset covers three primary supported profiles plus one weak, one conflicting, and one unassessed control, with no extra contrast fixture or generative model.
7. LangChain remains a thin, replaceable ADR-0013 evaluation layer whose removal would not change canonical inputs, outputs, citations, support semantics, or evaluation meaning.
8. Nothing in this assessment accepts OD-009, promotes an evaluation technology, expands canonical product scope, or claims accessibility, conformance, or certification.

## Documentation navigation

- Previous within this workflow step: [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md)
- Up: [Accessibility guidance retrieval assessments](README.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
