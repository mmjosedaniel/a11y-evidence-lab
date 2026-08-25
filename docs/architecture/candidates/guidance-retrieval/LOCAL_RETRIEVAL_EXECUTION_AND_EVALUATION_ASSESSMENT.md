# Local guidance retrieval execution and evaluation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the retrieval-execution and evaluation portion of the third workflow step. EmbeddingGemma, Chroma, and the thin LangChain role retain only the initial evaluation scope recorded in ADR-0006, ADR-0007, and ADR-0013; ADR-0010 continues to defer a reranker.

**Assessment date:** 2026-08-24.

**Decision alignment:** 2026-08-25, including the authorized-public-page boundary in [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md).

This focused assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status, selects no release dependency or framework, cannot change the accepted support gate, and does not authorize implementation. Canonical behavior remains in [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval).

The runtime scan may list multiple findings, but retrieval processes one user-selected finding and one query at a time. It accepts only these three rule families:

| Rule family | Pinned axe rule | Approved retrieval mapping |
| --- | --- | --- |
| `informative-image-alt` | `image-alt` | WCAG 2.2 SC 1.1.1 |
| `form-input-label` | `label` | WCAG 2.2 SC 4.1.2 only |
| `text-contrast` | `color-contrast` | WCAG 2.2 SC 1.4.3 |

ADR-0017 accepts the page-level exact-three-rule scan while preserving per-finding downstream isolation. The closed W3C pack, evidence-sufficiency gate, compact evaluation boundary, minimal record-validation boundary, and manual segmentation rule are Accepted through their recorded decisions; the exact retrieval mechanism and technology candidates remain Proposed. The controlled synthetic cases remain the fixed evaluation inputs. The `label` rule itself is not mapped to SC 3.3.2 or SC 1.3.1, and no scanner result establishes complete success-criterion non-conformance.

The scanned public page is never corpus content. Page URLs, safe locators, arbitrary text, HTML, form values, and unrelated findings are excluded from embedding and retrieval. An unsupported rule variant or missing/withheld core fact preserves the finding but makes it ineligible for a supported generation handoff.

## Minimal LangChain role for the portfolio demonstration

The architecture recommendation is to evaluate LangChain only as the visible composition layer around one deterministic retriever:

1. Adapt checksum-valid canonical passages to LangChain document values at the integration boundary while retaining application-owned passage IDs and filter metadata.
2. Invoke the application-owned local embedding and Chroma adapters through one retriever or runnable composition and return fixed top-five results for one query.
3. Hand ranked passage references to application-owned citation resolution and, only when required evidence is complete and retrieval completed as `supported`, later structured generation.

This gives the portfolio a concrete LangChain RAG integration without making the framework the owner of source acquisition, passage segmentation, query construction, passage identity, support-state policy, citations, or persistence. Do not add agents, tools, memory, multi-query expansion, framework loaders or splitters, or LangGraph. The integration must expose exact filters, ranked passage IDs, raw metric values, and errors; a convenience API that hides them is unsuitable. [ADR-0013](../../decisions/ADR-0013-langchain-as-initial-rag-integration.md) accepts this role for evaluation only, not as a release dependency. See the official [LangChain JavaScript vector-store integration overview](https://docs.langchain.com/oss/javascript/integrations/vectorstores/index) and [semantic-search tutorial](https://docs.langchain.com/oss/javascript/langchain/knowledge-base).

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

Evaluate one local Chroma endpoint and one write-once-by-convention collection for the frozen index identity. If this candidate is used, only the local application service owns and accesses the endpoint; its exact process-launch mechanism remains Proposed. Generate embeddings in the application adapter and send explicit vectors; do not enable an implicit or external embedding function. Chroma remains a derived, disposable index containing passage IDs, vectors, and minimum filterable metadata. Canonical source artifacts, passage text, citation metadata, mapping inputs, and corpus manifests remain outside it.

The minimal profile binds the corpus snapshot, derivation profile, exact embedding digest and preprocessing, 768 dimensions, cosine metric, Chroma client/server versions, collection/index configuration, and filter schema. It uses only dense vector queries, exact metadata filters, and fixed `top-k=5`; an eligible set with fewer than five passages is not padded. Chroma's [collection configuration](https://docs.trychroma.com/docs/collections/configure) documents configurable distance and HNSW behavior, so approximate-search recall and ranked-ID stability across restart and rebuild remain evaluation questions.

Chroma's documented [client path](https://docs.trychroma.com/docs/run-chroma/clients) uses a running local service. Its current [server configuration](https://docs.trychroma.com/reference/server-env-vars) documents `0.0.0.0` as the default listen address and no built-in authentication implementation in Chroma 1.x. For the bounded MVP evaluation, configure `127.0.0.1`, keep the public-guidance collection unreachable from browser-delivered UI code, and verify zero non-loopback retrieval egress. If that containment cannot be demonstrated, Chroma fails evaluation. Exact launch, restart, cleanup, repair, and removal behavior remain Proposed candidate details; installer and distribution packaging remain Deferred. Chroma's [metadata filtering](https://docs.trychroma.com/docs/querying-collections/metadata-filtering) and [precomputed-vector query path](https://docs.trychroma.com/docs/querying-collections/query-and-get) are sufficient. The [Chroma repository](https://github.com/chroma-core/chroma) records Apache-2.0 licensing; exact dependency and notice review remains required before distribution.

## Finding-to-query projection

The retrieval boundary consumes the following components and references by the exact names defined in the Step 2 [evidence record and retrieval handoff](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md#handoff-to-retrieval-and-later-steps):

| Exact Step 2 input | Use in retrieval |
| --- | --- |
| **Finding record** | Supplies the finding ID, rule-manifest reference, native result category, and references to the source evidence and normalized projection. |
| **Per-finding source-evidence item** | Supplies only allowlisted failure/check semantics and explicit omitted, withheld, or insufficient markers. Raw HTML and arbitrary check data are not query inputs. |
| **Normalized finding projection** | Supplies the deterministic, privacy-safe semantic element type and supported-rule fact code. This is the primary semantic input. |
| **Rule manifest** | Supplies the pinned rule identity and scanner version. Scanner help text is mapping metadata outside the embedded corpus. |
| **Approved rule-to-guidance mapping** | Supplies the curator-approved rule family and single SC mapping, external mapping/boundary references, query vocabulary, corpus filters, and mapping version. It is not a conformance determination. |
| **Page-scan publication record** | Supplies normalized/final-page, scanner, rule-profile, sanitizer, normalization, and coverage provenance and confirms publication eligibility. These values are lineage and eligibility inputs, not embedded page content. |

Opaque record IDs are retained for lineage but are not embedded. The page URL and locator are never embedded. All three rule families use one versioned query template with exactly this field order and no optional free text:

```text
rule_family={approved-rule-family-code}
standard=WCAG-2.2
success_criterion={approved-success-criterion}
scanner_rule={pinned-axe-rule-id}
result={native-result-category}
element_type={allowlisted-semantic-element-type}
observed_fact={allowlisted-fact-code}
guidance_intent={approved-guidance-intent-code}
```

The three deterministic example serializations are:

### `image-alt` / SC 1.1.1

```text
rule_family=image-alt
standard=WCAG-2.2
success_criterion=1.1.1
scanner_rule=image-alt
result=violation
element_type=img
observed_fact=missing-text-alternative
guidance_intent=criterion-context-exceptions-meaningful-and-decorative-guidance
```

### `label` / SC 4.1.2

```text
rule_family=label
standard=WCAG-2.2
success_criterion=4.1.2
scanner_rule=label
result=violation
element_type=input
observed_fact=missing-programmatic-name
guidance_intent=criterion-programmatic-name-and-native-label-association-guidance
```

This serialization requests only SC 4.1.2 guidance. It does not add SC 3.3.2 or SC 1.3.1, infer that a visible label is absent, or claim full SC 4.1.2 non-conformance.

### `color-contrast` / SC 1.4.3

```text
rule_family=color-contrast
standard=WCAG-2.2
success_criterion=1.4.3
scanner_rule=color-contrast
result=violation
element_type=text
observed_fact=contrast-below-rule-threshold
guidance_intent=criterion-thresholds-exceptions-and-contrast-technique
```

The retrieval run retains the exact privacy-safe query bytes, template and vocabulary versions, included and withheld field categories, and all source-record references. It may retain a digest over those bytes to detect alteration, but the digest is integrity metadata and never substitutes for the reproducible query. The runtime uses fixed allowlisted codes; controlled synthetic cases supply the frozen evaluation examples.

The projection excludes target URLs, safe locators, raw HTML, arbitrary page text, accessible names, label text, user values, credentials, non-allowlisted scanner data, and model-authored paraphrases. Allowlisted contrast measurements may be included only when the active contrast mapping needs them; they remain finding facts, not corpus content. A query is rejected if the mapping is unknown, ambiguous, unsupported, or requests more than one rule family or SC.

## Filtering, ranking, support, and citation

1. Reject an unknown, malformed, privacy-ineligible, publication-ineligible, multi-profile, or mapping-incompatible finding projection before embedding.
2. Require an index whose identity exactly matches the immutable corpus snapshot, derivation profile, embedding digest, dimensions, preprocessing, metric, and store configuration.
3. Hard-filter by corpus snapshot, English, WCAG 2.2, selected rule family, exact SC, allowed source IDs, source types, and guidance roles. One query cannot retrieve another rule family's passages.
4. Embed one query and request fixed `top-k=5` candidates by cosine distance. Do not rewrite the query, search the web, combine lexical scores, or rerank.
5. Apply only a deterministic passage-ID tie-break for equal scores. Record every raw distance and metric; never convert similarity into confidence, authority, correctness, remediation quality, or conformance.
6. Resolve passage IDs from the canonical corpus, verify passage and source checksums, and reject stale, missing, or incompatible results.
7. Preserve ranked order while labeling each passage's normative or informative authority independently. Similarity rank never overrides source hierarchy.
8. Construct citations from canonical metadata: publisher, document title and version, SC or Technique, exact heading/fragment, authority label, canonical URL, immutable versioned URL when available, and the recorded copyright/attribution and use-condition metadata. For a mutable URL, retain the corpus snapshot, source revision/acquisition identifier, and checksum needed to inspect the exact retained passage.
9. Apply one versioned deterministic support rule after passage resolution. Do not derive support from a similarity threshold alone.

The exact hard filters and frozen guidance roles are:

| Rule family | Eligible embedded guidance | Required roles for `supported` |
| --- | --- | --- |
| `image-alt` | Dated WCAG SC 1.1.1/definitions, Understanding 1.1.1, H37, H67 | Normative criterion; purpose/exceptions context; meaningful-image path; decorative-image path. |
| `label` | Dated WCAG SC 4.1.2/definitions, Understanding 4.1.2, H44 | Normative programmatic-name requirement; name context; applicable native-label association technique. The pinned axe/ACT mapping boundary must also validate, but it is not a ranked passage. |
| `color-contrast` | Dated WCAG SC 1.4.3/definitions, Understanding 1.4.3, G18 | Normative thresholds/exceptions; interpretation context; technique/calculation context. |

For each role, the frozen gold mapping names one or more acceptable passage IDs. A `supported` result requires all rule-specific roles and a valid external mapping boundary; it does not establish that the technique applies to every page context.

| Support state | Deterministic candidate meaning | Required handoff behavior |
| --- | --- | --- |
| **Supported** | All required roles are present, checksum-valid, correctly scoped, and free of unresolved material conflict, and the selected finding contains the required rule-specific evidence. | Support-sufficient for one structured generation call for that finding using the globally selected analysis mode and exact ranked passages. Keep the deterministic finding visible. |
| **Incomplete** | Some relevant guidance is present, but at least one required role is absent or only partially covered. | Deterministic abstention and manual-review direction; do not request generation and do not hide the finding. |
| **Missing** | No usable mapped guidance supports the core finding, the normative role is absent, or the required mapping boundary cannot be resolved. | Deterministic abstention and manual-review direction; do not request generation and do not hide the finding. |
| **Conflicting** | An unresolved material conflict remains after applying recorded authority and version rules. | Deterministic abstention with conflict references and manual-review direction; do not request generation and do not hide the finding. |

A retrieval-stage error fails only the selected `FindingWorkflow`, has no guidance-support state, and produces no generation request, but the completed parent scan, the finding, and sibling states remain available. A stale or integrity-invalid input is rejected or fails that selected workflow rather than being mislabeled as missing support. Similarity distances remain ranking observations, not authority, sufficiency, confidence, or conformance evidence.

## Conceptual retrieval record

This is a documentation-level composition of the existing **Retrieval run**, **Corpus source and snapshot**, and **Guidance passage** records in the [information and workflow lifecycle](../../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), not a database schema or new canonical record type.

| Component | Minimum retained information |
| --- | --- |
| Identity and execution | Retrieval-stage record ID; enclosing workflow-run reference; start/end time; bounded successful-result or error disposition; configuration version. This is not a second operation lifecycle. |
| Input lineage | Selected finding, minimized source evidence, normalized projection, page scan, rule mapping, rule ID, normalized/final-page identity reference, and safe target-descriptor references; exact privacy-safe query bytes and template version. The page URL and locator remain lineage outside query content. |
| Corpus and retrieval configuration | Accepted corpus snapshot and passage-derivation IDs; embedding model/adapter and index identities; metric; exact filters; fixed `top-k=5`; support-rule version. |
| Ranked passage reference | Rank, passage/source IDs, raw distance and metric, checksum, publisher/title, authority type, version, exact heading/fragment, canonical and immutable URLs when available, and visible attribution/use-condition metadata. Passage text remains in the canonical corpus. |
| Guidance-support assessment | `supported`, `incomplete`, `missing`, or `conflicting`; required, present, and absent role references; conflicts/reason codes; generation eligibility and required manual-review direction. This is not operation status or a model probability. |

Every ranked passage must resolve to the exact text and source version in the recorded snapshot. A corpus refresh, mapping change, index rebuild, or new evaluation creates new records and never rewrites historical lineage.

The future implementation needs only application-owned TypeScript record definitions plus minimal runtime validation when scanner-derived input enters retrieval, when adapter output returns, and before canonical JSON is persisted or reopened. Compile-time types are not runtime validation. The MVP does not require a standalone JSON Schema, code generation, a schema framework, migration machinery, multiple serialization dialects, or a compatibility framework.

## Retrieval-quality evaluation before generation

OD-009 accepts a compact, fixed, non-promotable evaluation manifest. Retrieval is provider-independent, so its checks run once and their frozen results may support both the local-model and Groq generation cases; they are not duplicated per generation provider. Freeze every input, acceptable passage ID, expected support state, and expected handoff before observing model output.

The controlled retrieval subset contains four bounded checks and no statistical sample expansion. These are frozen evaluation packages; a changing public page is not used as retrieval gold:

1. one complete `image-alt` / SC 1.1.1 input, expected to retrieve all four required guidance roles and classify **supported**;
2. one complete `label` / SC 4.1.2 input, expected to retrieve its three required roles, preserve the excluded SC 3.3.2/1.3.1 boundary, and classify **supported**;
3. one complete `color-contrast` / SC 1.4.3 input, expected to retrieve its three required roles and classify **supported**;
4. one frozen representative insufficiency package, selected before execution as **incomplete**, **missing**, or **conflicting**, expected to preserve the finding and abstain without a model call.

Cases 1–3 exercise the proposed embedding, rule-family filter, index, and ranking path. Case 4 is the one provider-independent abstention package accepted by the compact manifest; it introduces no runtime page, corpus source, model, or provider variant. The other insufficiency states remain defined product behavior but are not additional fixed MVP executions. Controlled corrected revisions remain inputs to comparison, not extra retrieval cases. Each check records its exact Step 2 input or controlled ranked set, retained query when applicable, mapping/corpus versions, required and acceptable passage IDs, expected state/handoff, rationale, and reviewer.

| Quality dimension | Initial criterion |
| --- | --- |
| Frozen expectations | All four checks have reviewed inputs, expected passage roles/IDs, support state, and handoff fixed before any generation result is observed. |
| Required-role retrieval | Each primary scenario returns every required role within the fixed top five; concrete misses are recorded descriptively, without a statistical promotion threshold. |
| Citation integrity | Every returned passage ID resolves to checksum-valid canonical text, exact locator, source version, URL, authority label, and attribution/use-condition metadata. |
| Filter correctness | Every return belongs to the selected snapshot, language, WCAG version, rule family, SC, source allowlist, and guidance roles; a cross-profile return fails the check. |
| Mapping boundary | The `label` check records only SC 4.1.2 and never infers SC 3.3.2, SC 1.3.1, a missing visible label, or full non-conformance. |
| Support behavior | The one shared representative insufficiency check preserves the finding and produces its frozen expected abstention/manual-review handoff with no model call. |
| Practical local operation | The proposed local retrieval path completes on the reference PC without out-of-memory failure or making the UI unusable. Record observed limitations only; do not claim p95, thermal, production-performance, or release-support results. |

Classify a miss as a corpus/source-version, passage-boundary, rule-mapping, query-projection, privacy-withholding, filter, embedding/preprocessing, index/configuration, or approximate-ranking issue. Adjust the smallest responsible boundary before reconsidering the reranker deferred by ADR-0010. These controlled checks demonstrate the integration; they are not a leaderboard, statistical qualification, provider comparison, or public support claim.

## Meaningful alternatives

These are single-variable replacement candidates, not additional stages or configurations to combine in the first evaluation:

| Alternative | Trade-offs and trigger |
| --- | --- |
| [`qwen3-embedding:0.6b`](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) through its [Ollama artifact](https://ollama.com/library/qwen3-embedding:0.6b), retaining Chroma | The published candidate is approximately 0.6B parameters and 639 MB, supports a much longer context and up to 1,024 dimensions, and uses Apache-2.0 terms. Its artifact size does not exclude it, but the complete metadata prefilter and on-device preflight remain pending; its extra context is unnecessary for short passages and may add compute cost. Evaluate it only if EmbeddingGemma fails the gold set, runtime support, or license review. It requires the same capacity gate, a new exact index, and a later decision; it is not an automatic fallback. |
| [LanceDB OSS embedded local mode](https://lancedb.github.io/lancedb/js/functions/connect/), retaining EmbeddingGemma | It can avoid Chroma's separate service and supports local TypeScript vector search, including [exact brute-force search](https://docs.lancedb.com/search/vector-search) suitable for a tiny corpus. Its repository records an [Apache-2.0 license](https://github.com/lancedb/lancedb/blob/main/LICENSE), but it adds a native Rust-backed dependency, Windows packaging and format-migration work, and a new recovery/reproducibility surface. Consider it only if Chroma fails topology, isolation, lifecycle, capacity, or packaging gates. Cloud, full-text, hybrid, and automatic embedding features remain out of scope. |

## Assumptions

- EmbeddingGemma and Chroma are plausible evaluation candidates for the reference PC, not proven capacity fits or release dependencies.
- The three pinned axe-to-SC mappings remain fixed during evaluation, and future acquisition of the accepted eight-artifact English pack satisfies its recorded W3C/WAI use conditions first.
- The controlled evaluation packages can supply the exact named Step 2 inputs without private content; runtime public-page findings must pass the same allowlist and mapping boundary independently.
- Retrieval quality and support-state behavior can be evaluated without a generative model or hosted service.

## Open questions

- Will the ADR-0013 thin LangChain role preserve inspectable provenance and acceptable local resource use when evaluated against the framework-independent boundary?
- Can the local Chroma endpoint satisfy loopback, renderer-separation, and zero-retrieval-egress checks under application-service ownership? Its exact process launch remains Proposed and packaging remains Deferred.
- What exact application-owned TypeScript field names and minimal runtime validator will implement the accepted conceptual record without introducing a schema framework?
- What exact acceptable passage IDs will be frozen for each required role before the compact evaluation begins?
- Will EmbeddingGemma's exact artifact, runtime, prompts, license, latency, and concurrent resource use pass the reference-PC and retrieval-quality gates?

## Risks

- Similarity ranking may make informative material appear more authoritative than normative text.
- A query may leak page content if raw evidence, locators, URLs, names, labels, values, or non-required measurements escape the closed projection.
- Embedding prompts, dimensions, normalization, or silent truncation may differ between indexing and querying and invalidate retrieval.
- A stale or incompatible index may return passages from the wrong corpus, scenario, mapping, or model configuration.
- Chroma's approximate ranking, local-service exposure, crash recovery, or resource use may fail evaluation.
- Mutable axe/ACT mappings could cause the `label` profile to regain unsupported criteria or silently change meaning.
- SC 1.4.3 thresholds and exceptions depend on context that a minimal query intentionally omits; retrieval must not turn a scanner measurement into conformance proof.
- Four controlled checks and hard scenario filters can overfit the demonstration and do not predict broad-corpus retrieval quality.
- Similarity distance may be mistaken for confidence, correctness, source authority, or accessibility conformance.

## Explicit non-goals

- Rules beyond the three named families, multiple findings per query, automatic retrieval for the scan collection, broad WCAG coverage, or a complete corpus.
- Ingesting, chunking, embedding, indexing, or searching the scanned page as guidance; web search or automatic corpus expansion.
- Agentic retrieval, query generation/rewrite, multi-query retrieval, conversation memory, or an LLM in the retrieval loop.
- Lexical/dense hybrid search, score fusion, reranking, knowledge graphs, hosted embeddings/storage, or provider fallback.
- Promoting LangChain to a release dependency, selecting a canonical corpus database, selecting a release Chroma topology, requiring a second embedding model, or creating a multi-provider abstraction.
- Generating explanations, citation claims, remediation proposals, manual checks, or source-code changes in this step.
- Multi-user operation, distributed ingestion, production-scale indexing, analytics, telemetry, or cloud deployment.
- Accessibility certification, legal-compliance interpretation, whole-page accessibility claims, or treating retrieval success as conformance proof.

## Planning acceptance criteria

This retrieval-execution portion is adequately defined for the Proposed evaluation when:

1. Any publication-eligible selected finding from the three accepted rules can independently produce the corresponding exact serialization through one shared privacy-safe template; exact query bytes are retained and their digest is integrity-only.
2. Exact rule-family filters restrict each query to its selected passages from the eight-artifact corpus, while axe and ACT mapping inputs remain outside the ranked corpus and the scanned page never becomes corpus content.
3. EmbeddingGemma and Chroma remain evaluation-only baselines that can request fixed `top-k=5` without web search, crawling, query rewriting, hybrid search, or reranking.
4. Every result resolves to checksum-valid text, authority type, source version, exact locator, and inspectable citation metadata.
5. Rule-specific support roles and the `supported`, `incomplete`, `missing`, and `conflicting` semantics are deterministic; only `supported` is proposal-eligible, while every insufficiency state preserves the finding and abstains without a model call.
6. The fixed provider-independent retrieval subset covers three primary supported rule families plus one representative insufficiency control selected as `incomplete`, `missing`, or `conflicting`, with no extra source, generative model, provider duplication, runtime-page dependency, or statistical expansion.
7. LangChain remains a thin, replaceable ADR-0013 evaluation layer whose removal would not change canonical inputs, outputs, citations, support semantics, or evaluation meaning.
8. Application-owned TypeScript records and minimal runtime boundary validation are sufficient; no JSON Schema, code generation, schema framework, migration system, or compatibility layer is required.
9. Nothing in this assessment uses the accepted evaluation manifest to promote an evaluation technology, expands canonical product scope, or claims accessibility, conformance, or certification.

## Documentation navigation

- Previous within this workflow step: [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md)
- Up: [Accessibility guidance retrieval assessments](README.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
