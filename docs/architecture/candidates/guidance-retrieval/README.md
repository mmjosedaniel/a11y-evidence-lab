# Accessibility guidance retrieval assessments

## Authority, status, and scope

**Status:** Proposed architecture detail for the third workflow step within accepted boundaries. [ADR-0022](../../decisions/ADR-0022-closed-versioned-guidance-corpus.md) accepts the closed source pack, versioning, passage identity, and manual deterministic segmentation. [ADR-0019](../../decisions/ADR-0019-in-process-exact-vector-search.md) accepts the in-process exact-search baseline and supersedes ADR-0007's Chroma baseline for the MVP. [ADR-0023](../../decisions/ADR-0023-local-mode-data-boundary.md) accepts local loopback embeddings and disposable in-process vectors in both generation modes, with no hosted embedding or vector service. Exact passage selections, package versions, and implementation mechanics remain Proposed. This family does not promote EmbeddingGemma or LangChain from evaluation baselines to release-qualified dependencies; change ADR-0010's reranker deferral; authorize implementation or corpus acquisition; or treat retrieval as accessibility or conformance proof.

Assessment date: 2026-08-24. Aligned with the trusted operator-input portfolio boundary on 2026-08-27.

Canonical behavior remains in [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval). These assessments own no requirement IDs or statuses.

## Runtime relationship

One scan of the trusted operator-supplied page may produce many independent findings from exactly three axe rules:

| Finding rule | Retrieval scope |
| --- | --- |
| `image-alt` | WCAG 2.2 SC 1.1.1 and the accepted conditional text-alternative guidance |
| `label` | WCAG 2.2 SC 4.1.2 only |
| `color-contrast` | WCAG 2.2 SC 1.4.3 and the accepted contrast guidance |

The interface lists every retained Finding, but retrieval starts only when the user selects one Finding. One Finding creates one privacy-safe query and one nested retrieval result. Findings are never combined, and a result for one target cannot support another target automatically.

The scanned page is untrusted query context, not guidance. It is never downloaded into, segmented for, embedded in, or used to expand the curated corpus. Withheld material evidence or a supported-rule contextual variant that lacks required support leaves the Finding visible and produces an ineligible/abstention handoff instead of web search or corpus mutation. An invalid, unknown, or ambiguous fixed rule-to-guidance mapping is instead a configuration or integrity failure: retrieval assigns no guidance-support state and generation does not treat it as an abstention.

Controlled project-owned cases remain the fixed retrieval evaluation baseline for the three mappings. They do not make a changing public page a gold dataset.

## Smallest sufficient retrieval approach

Evaluate one local dense-retrieval path, one selected finding at a time:

1. After implementation and source acquisition are authorized, manually curate the accepted immutable English eight-artifact W3C micro-corpus. Follow W3C/WAI use, status, copyright, and attribution conditions; do not crawl or follow links.
2. Keep pinned axe rule metadata and ACT rule e086e5 outside the embedded corpus as mapping/boundary inputs.
3. Select passages manually by success-criterion, Understanding, and Technique headings under the [corpus assessment](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md). Embeddings vectorize approved passages and never decide segmentation.
4. Resolve one selected Step 2 Finding, its nested minimized evidence, the run-level scan provenance, and the approved rule mapping. Construct one compact privacy-safe semantic query from that mapping and the allowlisted facts; include no URL, locator, HTML, arbitrary page text, input value, credential, or unrelated Finding.
5. Generate document and query vectors locally with the EmbeddingGemma configuration accepted for evaluation in [ADR-0006](../../decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md).
6. On the first explicit retrieval request, validate the active catalog, lazily construct the in-process store, and build the fixed passage vectors for that required in-process build. Rebuild after process restart or a material corpus, model, dimension, or preprocessing incompatibility. Application startup constructs no `MemoryVectorStore` and performs no corpus or query embedding. Within the validated catalog, filter broadly only by rule and success criterion, then run exact cosine-similarity search with fixed `top-k=3`. Do not persist a vector index, start a vector-database service, preselect exact source IDs or guidance roles, or rerank.
7. Resolve passage IDs against the immutable corpus and construct citations from canonical metadata.
8. Return ranked passages and deterministic guidance support. Do not generate an explanation in this step.

This is enough to demonstrate bounded RAG without broad WCAG coverage, page ingestion, web search, query rewriting, hybrid retrieval, reranking, agents, or automatic collection processing.

### Minimal LangChain role

LangChain may adapt canonical passages to framework documents, invoke EmbeddingGemma, perform the ADR-0019 in-memory exact search, and return ranked passage references. Application code remains authoritative for evidence, query construction, corpus identity, broad filters, ranking metadata, support-state policy, citations, persisted retrieval records, and per-finding isolation. Runtime vectors and framework documents are disposable.

[ADR-0013](../../decisions/ADR-0013-langchain-as-initial-rag-integration.md) accepts this thin role only as an evaluation baseline. LangGraph, agents, memory, framework loaders/splitters, query expansion, and framework-authored citations remain outside the MVP.

### Support-state handoff

| Result | Per-finding handoff |
| --- | --- |
| `supported` | All profile-required guidance roles resolve within the top three and no curator-declared unresolved material conflict applies. Complete required Finding evidence is checked separately before the one permitted generation call. |
| `incomplete` | Some applicable guidance resolves but a profile-required role is absent. Keep the Finding visible and publish a terminal application-authored abstention that names the missing role and provides manual-investigation guidance; no provider call or proposal-review decision. |
| `missing` | Zero applicable passages resolve for the mapped rule and success criterion. Keep the Finding visible and publish a terminal application-authored abstention that explains the missing guidance and provides manual-investigation guidance; no provider call or proposal-review decision. |
| `conflicting` | A curator-declared unresolved material conflict remains after normative precedence. Keep the Finding and conflict references visible and publish a terminal application-authored abstention that explains the conflict and provides manual-investigation guidance; no provider call or proposal-review decision. |
| Retrieval-stage or fixed-mapping integrity error | Fail this Finding's workflow attempt with no support state; preserve the Finding. This includes an invalid, unknown, or ambiguous fixed rule-to-guidance mapping. |

One finding may abstain while another finding from the same page remains eligible. Similarity values are ranking evidence, not confidence, authority, or accessibility scores.

## Assessment map

| Assessment | Responsibility |
| --- | --- |
| [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md) | Accepted source pack, W3C/WAI use boundaries, manual segmentation, passage identity, and corpus risks. |
| [Local retrieval execution and evaluation](LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) | Embeddings, in-process exact vector search, finding-to-query projection, broad filters, ranking, citations, support records, alternatives, and model-free evaluation. |

## Planning acceptance criteria

This step is adequately defined when:

1. any retained finding from the three accepted rules can be selected independently and projected without URL, locator, raw HTML, arbitrary page text, credentials, or unrelated findings;
2. the scanned page never becomes corpus content;
3. the embedded corpus remains the accepted eight-artifact W3C pack and axe/ACT metadata remains external mapping input;
4. rule-specific filters and required guidance roles produce deterministic support states;
5. only `supported` permits generation, while insufficiency preserves just that finding and abstains without a model call;
6. controlled provider-independent cases cover the three supported mappings plus one representative insufficiency case;
7. EmbeddingGemma, the ADR-0019 in-process exact search, and thin LangChain remain replaceable evaluation baselines with no persistent vector service, reranker, crawler, hosted retrieval, or agent; and
8. nothing converts retrieval success into accessibility, conformance, certification, or broad public-page coverage.

## Documentation navigation

- Previous workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
