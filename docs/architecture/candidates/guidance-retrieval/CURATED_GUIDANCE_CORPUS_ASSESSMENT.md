# Curated accessibility guidance corpus assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the corpus portion of the third workflow step.

**Assessment date:** 2026-08-24.

This focused assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status, accepts no source or licensing decision, and does not authorize corpus acquisition or implementation. Canonical behavior remains in [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval).

## Initial W3C micro-corpus

The [accepted first vertical slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) is one project-owned fixture with one informative `img` element that has no text alternative, the axe-core `image-alt` rule, and its WCAG 2.2 SC 1.1.1 mapping. This assessment proposes only the smallest corpus treatment for that accepted scenario; it does not accept source acquisition, licensing, or retrieval technology.

The first corpus is a manually curated four-artifact W3C pack. It is intentionally only large enough to retrieve the criterion, explain why image purpose matters, and distinguish the meaningful-image and decorative-image remediation paths.

| Candidate source | Proposed MVP treatment | Authority, version, attribution, and update considerations |
| --- | --- | --- |
| [WCAG 2.2 Recommendation dated 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) | Include only SC 1.1.1 and the normative definitions it directly references. | Normative baseline. Retain the dated Recommendation URI, latest-version URI, publication status/date, exact section locator, acquired-content checksum, copyright, license link, and separately versioned errata state. Do not silently merge later [errata](https://www.w3.org/WAI/WCAG22/errata/) into this source version. |
| [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) | Manually include only the structural sections needed to explain intent, contextual judgment, and the meaningful-versus-decorative distinction. Do not ingest unrelated examples or linked pages. | Informative, not required for WCAG conformance. The page was updated 12 June 2026, independently of the Recommendation; retain its revision date/history, acquisition time, checksum, authority label, and exact heading locator. |
| [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37) | Include the structural passages needed for the meaningful-image remediation path. | Informative example, not a required method. Retain its own source identity, applicability, revision metadata, exact locator, and checksum. |
| [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67) | Include the structural passages needed to explain the decorative-image alternative and why purpose requires human judgment. | Informative example, not a required method. Snapshot and cite it separately from H37 so neither path is presented as universally correct. |

The Step 2 **rule manifest**, together with the approved **scenario/rule-to-guidance mapping**, supplies the versioned axe rule metadata used to select this source pack. It is mapping input, not a fifth guidance source and not proof that the whole success criterion failed. ACT Rules, APG, other WCAG criteria, scanner help text, web search results, and product-authored summaries remain outside the first corpus.

WAI's [material-use guidance](https://www.w3.org/WAI/about/using-wai-material/) states that most WAI material uses the [W3C Document License](https://www.w3.org/copyright/document-license-2023/), requires the source URL, copyright, and status, and generally permits copying and distributing complete documents without modification rather than creating derivative works. Because segmentation produces a derived retrieval representation, OD-004 must approve the exact acquisition, internal derivation, excerpt display, attribution, and public-distribution method for every source. Public availability alone is not a license decision. Until that review confirms that the source and its proposed corpus representation are authorized, attributable, and publicly shareable, neither the source nor a derived passage may enter an evaluation or approved corpus snapshot. Product-authored summaries must remain separate from exact W3C source text, and the product must not imply W3C endorsement. This is a planning constraint, not legal advice.

## Deterministic source preparation

The canonical corpus is independent of Chroma, EmbeddingGemma, LangChain, query batching, and generation:

1. **Acquire from a closed manifest.** Each manually approved entry identifies the exact source URL, expected publisher and status, allowed language, license/attribution record, acquisition method, and integrity expectation. No recursive traversal, automatic refresh, or linked-resource ingestion occurs.
2. **Preserve source identity.** Retain the exact acquired artifact or other accepted immutable representation, source checksum, acquisition time, source revision/publication date, and snapshot manifest. A source change creates a new source and corpus snapshot rather than mutating the previous one.
3. **Select and segment manually by structure.** The closed manifest names the approved SC, definition, Understanding subsection, or Technique subsection boundaries. A passage preserves its heading and complete paragraph/list units; it is not summarized, paraphrased, or created with sliding-window overlap. If one selected section exceeds the accepted bound, split only at a paragraph or list boundary and record explicit continuation links.
4. **Normalize deterministically.** Remove navigation and presentation boilerplate through one versioned source-aware rule while preserving heading order, inline technical text, normative wording, exceptions, and derivation measurements.
5. **Validate and publish as one snapshot.** Enforce the closed four-source limit and accepted byte/passage limits. A missing source, failed checksum, invalid locator, or oversize unhandled passage publishes nothing and preserves the last valid snapshot. Passage identity remains independent of model and store configuration.

Each canonical passage needs, at minimum:

- corpus-snapshot, source, passage, and derivation-profile identifiers;
- publisher, title, canonical URL, versioned URL when available, exact fragment or heading path, and language;
- source type and visible authority label such as **normative WCAG**, **informative Understanding**, or **informative Technique**;
- WCAG version, success-criterion and technique identifiers, and approved scenario/rule mappings;
- publication or revision date, acquisition date, source status, license URI, attribution/copyright notice, and usage notes;
- exact source range or structural locator, part/continuation metadata, normalized-text checksum, source-artifact checksum, and transformation lineage.

Chunk identifiers must bind source identity/version, exact locator, continuation part, normalized-text checksum, and derivation-profile version. They must not be assigned by array position or by Chroma.

## Assumptions

- The accepted English `image-alt` controlled-fixture scenario and SC 1.1.1 mapping remain stable during the first retrieval evaluation.
- A curator can approve exact rule-to-scenario, success-criterion, and source mappings without treating them as a conformance determination.
- The W3C source pack can receive an accepted acquisition, attribution, derivation, and public-sharing disposition under OD-004.
- Canonical corpus storage and derived vector storage remain separate; the canonical persistence technology is still open.

## Open questions

- Will OD-004 approve the proposed W3C source pack and the exact treatment of complete source artifacts, internal chunks, displayed excerpts, attribution, errata, and public distribution?
- What small character/byte and passage limits, source-aware normalization rules, locator form, and continuation behavior will OD-016 accept for these four artifacts?

## Risks

- W3C content that is publicly readable may still be packaged, segmented, excerpted, attributed, or displayed in a way its license does not permit.
- Mutable Understanding, Technique, ACT, APG, errata, or scanner-mapping content may cause silent citation drift unless every input is snapshotted independently.
- A scanner-to-WCAG mapping may be presented as proof that the complete success criterion failed.
- Structural normalization or chunk boundaries may omit an exception, definition, or qualification and change the apparent meaning.

## Explicit non-goals

- The complete WCAG supporting library, broad WCAG coverage, APG or ACT ingestion for the first scenario, multilingual retrieval, or user-supplied corpora.
- Web search, automatic crawling, link following, automatic corpus refresh, or automatic acceptance of upstream changes.
- Embedding or indexing raw page evidence, private target content, credentials, proprietary documents, or generated text as guidance.

## Planning acceptance criteria

This corpus portion is adequately defined for the proposed portfolio slice when:

1. The closed manifest contains exactly the dated WCAG 2.2 source, Understanding SC 1.1.1, H37, and H67, each with an OD-004-approved use and attribution disposition.
2. Every selected passage has a visible normative or informative label, exact source locator, immutable snapshot identity, checksum, and deterministic derivation path.
3. Rebuilding the unchanged four-source manifest produces the same passage identities and normalized text, while a source change produces a new snapshot.
4. Scanner metadata remains mapping input outside the guidance corpus, and no retrieved passage is presented as proof of full WCAG failure or conformance.
5. A failed, incompatible, or over-limit build cannot publish a partial snapshot or index.

## Documentation navigation

- Up: [Accessibility guidance retrieval assessments](README.md)
- Next within this workflow step: [Local retrieval execution and evaluation](LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
