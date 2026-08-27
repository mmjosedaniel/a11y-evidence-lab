# ADR-0022: Closed, versioned guidance corpus

- **Status:** Accepted for the MVP
- **Decision date:** 2026-08-27

## Context

The portfolio MVP needs a canonical guidance source for traceable retrieval, citations, evidence-sufficiency decisions, and grounded generation across exactly three supported rule mappings. The authoritative requirements already accept an eight-artifact W3C source pack and manual heading-aware segmentation. Because those choices define the RAG system's knowledge boundary and citation identity, they require an architecture record rather than remaining only in requirements and Proposed assessment material.

Automatic ingestion, crawling, generic chunking, and live upstream refresh would add lifecycle machinery and permit the corpus to change without a reviewed product decision. A direct rule-to-answer table would be smaller, but it would not exercise the semantic retrieval path that the portfolio is intended to demonstrate.

## Considered options

1. Crawl or recursively load W3C guidance and split it automatically.
2. Replace retrieval with a fixed rule-to-answer lookup.
3. Use one closed, versioned W3C source manifest and manually defined deterministic passages.

## Decision

Accept option 3 for the MVP.

### Closed source boundary

The corpus contains exactly these eight official W3C artifacts and only the sections required for the three accepted rule mappings:

1. The dated [WCAG 2.2 Recommendation of 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/): SC 1.1.1, SC 4.1.2, SC 1.4.3, and directly required definitions.
2. [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html).
3. [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37).
4. [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67).
5. [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html).
6. [Technique H44](https://www.w3.org/WAI/WCAG22/Techniques/html/H44).
7. [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
8. [Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18).

WCAG success-criterion text is normative. Understanding documents and Techniques are informative and must not be presented as independent conformance requirements or as the only valid remediation methods. axe-core and ACT metadata remain mapping evidence outside the embedded corpus. Target-page content, scanner help text, model output, and user-supplied documents cannot become corpus input.

### Version and passage boundary

- Use one immutable corpus snapshot identified by one corpus version and one versioned source manifest. The manifest records the eight source identities, direct URLs, document type and status, selected headings, and W3C attribution and use-condition information.
- Select passages manually before embedding. Segmentation must be deterministic and heading-aware, preserve complete paragraph or list units, and retain the success-criterion, Understanding-section, or Technique identity.
- Each canonical passage needs only a stable `passageId`, corpus version, source title and type, exact heading, direct URL, accepted rule and success-criterion tags, and selected text.
- An unchanged rebuild must preserve passage IDs and selected text. A change to selected source text, headings, passage boundaries, or canonical passage text creates a new corpus version rather than silently mutating the existing snapshot.
- The embedding adapter may apply model-required input formatting and vectorize an already selected passage. It must not select, split, overlap, merge, summarize, or rewrite canonical passages.
- Use no crawler, recursive loader, generic splitter, sliding-window overlap, automatic refresh, web search, or query-dependent corpus construction in the MVP.
- When normative and informative material conflict, normative WCAG text takes precedence. An unresolved material conflict produces the accepted `conflicting` support state and deterministic abstention.

Corpus acquisition and local copies remain blocked until development and source acquisition are explicitly authorized and the planned use is reviewed against WAI's use guidance and the W3C Document License. This decision selects a planning boundary only; it does not create the corpus, authorize implementation, or qualify it for distribution.

## Consequences

- Retrieval and citations can resolve to stable, reviewable source passages without an ingestion service or corpus crawler.
- The corpus is intentionally too narrow for broad WCAG coverage. A supported axe rule can still yield `incomplete`, `missing`, or `conflicting` guidance and therefore abstention.
- Corpus maintenance is manual, but the eight-artifact scope keeps that work proportionate and makes upstream changes explicit.
- Disposable in-process vectors can be rebuilt from the canonical snapshot under ADR-0019; vectors never become the corpus authority.
- Physical file layout, serialization format, and exact paragraph boundaries remain implementation-stage choices within this decision.

## Primary references

- [Using WAI Material](https://www.w3.org/WAI/about/using-wai-material/)
- [W3C Document License](https://www.w3.org/copyright/document-license-2023/)
- [WCAG 2.2 Recommendation dated 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/)

## Related decisions and requirements

- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [ADR-0019: In-process exact vector search for the MVP](ADR-0019-in-process-exact-vector-search.md)
- [ADR-0021: Single-file run aggregate](ADR-0021-single-file-run-aggregate.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-CORP-*` and `REQ-RETR-*`
- [Delivery readiness and open decisions](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md): OD-004, OD-016, and OD-022
- [Curated accessibility guidance corpus assessment](../candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md) — supporting Proposed detail; it does not override this decision
