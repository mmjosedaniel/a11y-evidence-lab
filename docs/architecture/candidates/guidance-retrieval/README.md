# Accessibility guidance retrieval assessments

## Authority, status, and scope

**Status:** Proposed architecture detail for the third workflow step. This assessment family does not accept any referenced open decision, including OD-004, OD-006, OD-009, OD-010, OD-012, or OD-014 through OD-016; promote ADR-0006, ADR-0007, or ADR-0013 beyond evaluation; change the reranker deferral in ADR-0010; authorize implementation; or claim that retrieval establishes accessibility or conformance.

**Assessment date:** 2026-08-24.

The authoritative requirement IDs, wording, and recorded statuses for this workflow step remain in [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval). These are supporting Proposed architecture assessments: they own no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

## Smallest sufficient retrieval slice

The [accepted first portfolio slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) is one project-owned controlled fixture containing one informative `img` element for which the pinned axe-core `image-alt` rule reports a missing text alternative. The only initial guidance topic is WCAG 2.2 SC 1.1.1, **Non-text Content**. The retrieval mechanism, corpus disposition, and technology profiles below remain Proposed or evaluation-only at their recorded scope.

The MVP should evaluate one local, single-query dense-retrieval path:

1. Manually curate one immutable English micro-corpus containing only WCAG 2.2 SC 1.1.1, the directly useful portions of its Understanding document, and Techniques H37 and H67. Do not ingest a whole website or follow links.
2. Derive a small set of deterministic, traceable passages under the corpus-owned profile described in the [corpus assessment](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md).
3. Accept the exact Step 2 **finding record**, **per-finding source-evidence item**, **normalized finding projection**, **rule manifest**, **approved scenario/rule-to-guidance mapping**, and eligible **scan-run publication record** references. Construct and retain one exact privacy-safe query representation from their allowlisted fields; do not use an LLM to rewrite it.
4. Generate document and query vectors locally with the EmbeddingGemma configuration accepted for evaluation in [ADR-0006](../../decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md).
5. Query one local Chroma index accepted for evaluation in [ADR-0007](../../decisions/ADR-0007-chroma-as-initial-local-vector-store.md), using exact corpus/version filters, cosine distance, and a fixed `top-k` of 5. Do not rerank.
6. Resolve returned passage identifiers against the immutable canonical corpus and construct citations from checksum-valid source metadata rather than model output.
7. Return ranked passages and a deterministic guidance-support state. Do not generate an explanation or remediation proposal in this step.

This is sufficient to demonstrate the project's central RAG path—deterministic evidence becoming traceable retrieval context for later structured generation—without adding broad WCAG coverage, crawling, query generation, hybrid search, agents, or another mandatory model or store.

### Minimal LangChain role

Because demonstrating RAG and LangChain is a supporting project objective, the architecture recommendation is to evaluate LangChain as a thin TypeScript composition layer for this one retrieval path. It may adapt canonical passages to framework documents, invoke the application-owned embedding and Chroma retrieval adapters, and assemble the ranked passages for the later generation input. The application, not LangChain, remains authoritative for evidence, query construction, corpus passage identity, filters, ranking metadata, support-state policy, citation resolution, and retained retrieval records.

[ADR-0013](../../decisions/ADR-0013-langchain-as-initial-rag-integration.md) accepts this thin LangChain role only as the initial evaluation baseline. This assessment proposes the exact retrieval use without making LangChain a release dependency. LangGraph, agents, memory, framework-owned chunking, and framework-owned citation generation are unnecessary for this step. The current [LangChain JavaScript vector-store documentation](https://docs.langchain.com/oss/javascript/integrations/vectorstores/index) demonstrates the integration surface being evaluated.

### Generation handoff

Retrieval operation status and guidance-support state are separate dimensions. A store or embedding error is a **failed retrieval**, not “no guidance.” For the proposed handoff:

| Retrieval result | Generation eligibility |
| --- | --- |
| **Supported** | May enter structured proposal generation with the exact ranked passages and support assessment. |
| **Weak** | Follows one frozen, versioned policy. The proposed first-slice policy requires abstention; a later policy may permit proposal generation only after OD-007 and OD-009 accept its evidence and safeguards. |
| **Missing** | Must produce or route to abstention; it is not proposal-eligible. |
| **Conflicting** | Must produce or route to abstention with the conflict references; it is not proposal-eligible. |
| **Unassessed** | Evaluation-only. It must not enter the end-to-end generation workflow or be presented as supported. |
| **Failed operation** | Produces no guidance-support conclusion and no generation request; retry is an explicit later action. |

Similarity values remain ranking evidence, not confidence or support thresholds. The exact support rule remains subject to OD-009.

## Assessment map

| Assessment | Responsibility |
| --- | --- |
| [Curated accessibility guidance corpus](CURATED_GUIDANCE_CORPUS_ASSESSMENT.md) | Initial source pack, authority and licensing boundaries, immutable acquisition, deterministic normalization, structural segmentation, passage identity, and corpus-specific assumptions and risks. |
| [Local retrieval execution and evaluation](LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md) | Embeddings, vector storage, finding-to-query projection, filtering, ranking, citations, retrieval records, alternatives, and model-free retrieval-quality evaluation. |

## Planning acceptance criteria

This workflow step is adequately defined for the proposed portfolio slice when:

1. The exact `image-alt` fixture, Step 2 input references, WCAG 2.2 SC 1.1.1 mapping, and four-source corpus pack are identified without implying conformance.
2. One exact privacy-safe query representation can be reproduced and retained; its digest is used only to verify integrity.
3. Every ranked passage resolves to checksum-valid text, authority metadata, an exact locator, and the recorded corpus snapshot.
4. Supported, weak, missing, conflicting, and unassessed support states remain separate from completed or failed operation status and follow the handoff rules above.
5. The fixed retrieval pilot can measure relevance, citation integrity, filtering, support behavior, repeatability, and local resource use before generation quality is considered.
6. LangChain's ADR-0013 evaluation role is limited to replaceable RAG composition and does not take ownership of canonical evidence or provenance.

## Documentation navigation

- Previous workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- Next workflow step: [Evidence-grounded remediation generation assessment](../EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
