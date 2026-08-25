# Accessibility guidance retrieval assessments

## Authority, status, and scope

**Status:** Proposed architecture detail for the third workflow step. Accepted product decisions now bound the source pack, support gate, fixed evaluation manifest, minimal record validation, and manual segmentation. This assessment family does not promote ADR-0006, ADR-0007, or ADR-0013 beyond evaluation; change the reranker deferral in ADR-0010; authorize implementation or corpus acquisition; or claim that retrieval establishes accessibility or conformance.

**Assessment date:** 2026-08-24.

**Decision alignment:** 2026-08-25.

The authoritative requirement IDs, wording, and recorded statuses for this workflow step remain in [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval). These supporting Proposed assessments own no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

The [accepted first portfolio slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) contains exactly three project-owned synthetic controlled scenario profiles. This candidate evaluates the same RAG path across those three narrowly mapped findings:

| Scenario profile | Pinned axe rule | Retrieval scope |
| --- | --- | --- |
| `informative-image-alt` | `image-alt` | WCAG 2.2 SC 1.1.1 |
| `form-input-label` | `label` | WCAG 2.2 SC 4.1.2 only |
| `text-contrast` | `color-contrast` | WCAG 2.2 SC 1.4.3 |

The three scenario profiles are Accepted through OD-019. OD-004 accepts the closed W3C pack under W3C/WAI use conditions, OD-007 accepts the evidence-sufficiency gate, OD-009 accepts the compact fixed non-promotable evaluation manifest, OD-015 accepts minimal TypeScript/runtime record validation, and OD-016 accepts manual heading-aware segmentation. The retrieval technologies below remain Proposed or evaluation-only at their recorded scope. The `label` profile follows the current pinned axe mapping to SC 4.1.2; it does not map this rule itself to SC 3.3.2 or SC 1.3.1 or infer complete non-conformance with any success criterion.

## Smallest sufficient retrieval approach

Evaluate one local dense-retrieval path, processing exactly one finding and one query at a time:

1. After implementation and source acquisition are authorized, manually curate the accepted immutable English micro-corpus containing eight W3C artifacts: one dated WCAG 2.2 source limited to the three selected success-criterion sections and needed definitions, three corresponding Understanding documents, and Techniques H37, H67, H44, and G18. Follow W3C/WAI use, status, copyright, and attribution conditions; do not ingest a whole website or follow links.
2. Keep the pinned axe rule metadata and W3C ACT rule e086e5 outside the embedded guidance corpus as versioned mapping and boundary inputs.
3. Select passages manually by success-criterion, Understanding, and Technique headings under the [corpus assessment](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md). Preserve exact URLs and headings; embeddings vectorize already selected text and never perform segmentation.
4. Accept the exact Step 2 **finding record**, **per-finding source-evidence item**, **normalized finding projection**, **rule manifest**, **approved scenario/rule-to-guidance mapping**, and eligible **scan-run publication record** references. Construct and retain one exact privacy-safe query representation from allowlisted fields; do not use an LLM to rewrite it.
5. Generate document and query vectors locally with the EmbeddingGemma configuration accepted for evaluation in [ADR-0006](../../decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md).
6. Query one local Chroma index accepted for evaluation in [ADR-0007](../../decisions/ADR-0007-chroma-as-initial-local-vector-store.md), using exact corpus and scenario filters, cosine distance, and fixed `top-k=5`. Do not rerank.
7. Resolve returned passage identifiers against the immutable canonical corpus and construct citations from checksum-valid source metadata rather than model output.
8. Return ranked passages and a deterministic guidance-support state. Do not generate an explanation or remediation proposal in this step.

This is sufficient to demonstrate the project's central RAG path across three controlled mappings without broad WCAG coverage, crawling, query generation, hybrid search, reranking, agents, or another mandatory model or store.

### Minimal LangChain role

Because demonstrating RAG and LangChain is a supporting portfolio objective, the architecture recommendation is to evaluate LangChain as a thin TypeScript composition layer for this single-query path. It may adapt canonical passages to framework documents, invoke the application-owned embedding and Chroma retrieval adapters, and assemble ranked passages for later generation. The application, not LangChain, remains authoritative for evidence, query construction, corpus passage identity, filters, ranking metadata, support-state policy, citation resolution, and retained retrieval records.

[ADR-0013](../../decisions/ADR-0013-langchain-as-initial-rag-integration.md) accepts this thin LangChain role only as the initial evaluation baseline. This assessment proposes its minimal useful retrieval role without making LangChain a release dependency. LangGraph, agents, memory, framework-owned passage segmentation, and framework-owned citation generation remain unnecessary. The official [LangChain JavaScript vector-store documentation](https://docs.langchain.com/oss/javascript/integrations/vectorstores/index) describes the integration surface being evaluated.

### Support-state handoff

The enclosing workflow-operation state, retrieval-stage disposition, and guidance-support state are separate dimensions. A store or embedding error fails the workflow operation; it is not “no guidance.” For each scenario, a versioned rule defines required guidance roles and applies this handoff:

| Retrieval result | Handoff behavior |
| --- | --- |
| **Supported** | A completed retrieval may enter one structured proposal-generation call with the exact ranked passages and support assessment for the selected accepted scenario. The deterministic finding remains visible. |
| **Incomplete** | At least one required guidance role or required passage is absent or only partially represented. Keep the finding visible and produce a deterministic abstention/manual-review handoff without a model call. |
| **Missing** | No usable mapped guidance or normative basis supports the core finding. Keep the finding visible and produce a deterministic abstention/manual-review handoff without a model call. |
| **Conflicting** | A material conflict remains unresolved under the recorded source hierarchy. Keep the finding visible and produce a deterministic abstention/manual-review handoff with conflict references and no model call. |
| **Retrieval-stage error** | Fails the enclosing workflow operation and produces no guidance-support conclusion or generation request; the retained finding remains available. An explicit retry creates a new workflow run. |

Similarity values remain ranking evidence, not confidence or support thresholds. The support gate applies only to model invocation; it never suppresses, downgrades, or deletes a deterministic finding.

## Assessment map

| Assessment | Responsibility |
| --- | --- |
| [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md) | Accepted closed source pack, external mapping inputs, W3C/WAI use boundaries, future acquisition metadata, manual structural segmentation, passage identity, and corpus-specific risks. |
| [Local retrieval execution and evaluation](LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) | Embeddings, vector storage, exact Step 2 handoff, finding-to-query projection, scenario filters, ranking, citations, support rules, records, alternatives, and model-free evaluation. |

## Planning acceptance criteria

This workflow step is adequately defined for the Proposed retrieval evaluation when:

1. Exactly the three accepted synthetic scenario profiles above are mapped and processed independently one finding and one query at a time.
2. The embedded corpus is limited to the eight-artifact W3C pack, with axe metadata and ACT e086e5 retained only as external mapping and boundary inputs.
3. One versioned privacy-safe query template has three deterministic example serializations, and every run retains the exact query bytes; a digest is used only for integrity.
4. Each scenario has an exact source filter and required guidance-role rule; only `supported` is proposal-eligible, while `incomplete`, `missing`, and `conflicting` preserve the finding and abstain without a model call.
5. The fixed provider-independent retrieval checks cover the three scenario queries plus one representative deterministic insufficiency control selected as `incomplete`, `missing`, or `conflicting`; they are frozen before any generation result, are not duplicated per provider, and do not create statistical, comparative, or release-support claims.
6. EmbeddingGemma, Chroma, and thin LangChain remain replaceable evaluation baselines; no reranker, web search, crawler, hybrid retrieval, or agent is introduced.
7. Nothing in these assessments expands beyond the three-profile canonical product scope, turns the fixed evaluation manifest into a promotion gate, or treats retrieval as accessibility or conformance proof.

## Documentation navigation

- Previous workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
