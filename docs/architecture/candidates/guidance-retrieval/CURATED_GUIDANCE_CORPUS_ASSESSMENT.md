# Curated accessibility guidance corpus assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the corpus portion of the third workflow step.

**Assessment date:** 2026-08-24.

**Decision alignment:** 2026-08-25.

This focused assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status and does not authorize corpus acquisition or implementation. OD-004 accepts the bounded source pack and its W3C/WAI use-condition boundary in the canonical [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval); the exact future acquisition and passage-construction mechanics assessed here remain Proposed.

The [accepted first vertical slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) contains exactly three project-owned synthetic controlled profiles: `informative-image-alt` (`image-alt` / SC 1.1.1), `form-input-label` (`label` / SC 4.1.2), and `text-contrast` (`color-contrast` / SC 1.4.3). This candidate assesses how to prepare the accepted bounded pack for those scenarios without selecting a release technology or creating any corpus material during planning.

## Accepted closed eight-artifact W3C pack

OD-004 accepts one manually curated English pack containing exactly eight W3C artifacts, subject to the recorded W3C/WAI use conditions. It is only large enough to retrieve the normative basis, essential contextual distinctions, and one or two directly applicable technique paths for the three profiles. Acceptance of the manifest is not a corpus download, copied-source authorization, or dependency selection.

| # | Accepted guidance artifact | Selected content boundary | Authority, version, and update treatment |
| --- | --- | --- | --- |
| 1 | [WCAG 2.2 Recommendation dated 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) | Only SC 1.1.1, SC 4.1.2, SC 1.4.3, and the normative definitions those selected sections directly require. | Normative baseline. Retain the dated Recommendation URI, latest-version URI, publication status/date, exact section locators, source checksum, license data, and a separately versioned [errata](https://www.w3.org/WAI/WCAG22/errata/) disposition. Do not silently merge later errata. |
| 2 | [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) | Intent, exceptions, and contextual material needed to distinguish meaningful from decorative images. | Informative, not required for conformance. Snapshot its independent revision state, exact headings, acquisition time, and checksum. |
| 3 | [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) | Intent and the selected passages explaining programmatically determinable names for standard form controls. | Informative. Preserve the distinction between a programmatic name and a visible label; do not broaden the scanner-rule mapping. |
| 4 | [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) | Intent, normal/large-text thresholds, and listed exceptions needed to interpret one deterministic contrast finding. | Informative. Retain qualifications and definitions with the selected passages so a threshold is not presented without its conditions. |
| 5 | [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37) | Structural passages needed for the meaningful-image `alt` path. | Informative example, not a required or universal method. Retain applicability, source identity, revision metadata, locator, and checksum. |
| 6 | [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67) | Structural passages needed for the decorative-image path. | Informative example. Cite separately from H37 because selecting the correct path requires contextual human judgment. |
| 7 | [Technique H44](https://www.w3.org/WAI/WCAG22/Techniques/html/H44) | Structural passages for associating a `label` element with an applicable native form control. | Informative example. Its inclusion supplies one remediation technique for the SC 4.1.2 profile; it does not add SC 1.3.1 or SC 3.3.2 to the `label` rule mapping. |
| 8 | [Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18) | Structural passages describing the SC 1.4.3 contrast technique and calculation context. | Informative example. It supports a proposal and manual verification but does not make one automated result conformance proof. |

The dated WCAG artifact counts once even though three selected success-criterion sections become separately addressable passages. No other WCAG section, linked technique, example page, or definition is admitted unless this closed manifest is explicitly revised through the applicable decision process.

### Scenario source filters and guidance roles

Each retrieval run uses exactly one profile and may retrieve only its selected passages:

| Scenario profile | Embedded source filter | Guidance roles needed for a supported result |
| --- | --- | --- |
| `informative-image-alt` / SC 1.1.1 | Artifact 1 SC 1.1.1 and needed definitions; artifacts 2, 5, and 6 | Normative criterion; contextual purpose/exceptions; meaningful-image technique; decorative-image technique. |
| `form-input-label` / SC 4.1.2 | Artifact 1 SC 4.1.2 and needed definitions; artifacts 3 and 7 | Normative criterion; programmatic-name context; applicable native-label association technique. |
| `text-contrast` / SC 1.4.3 | Artifact 1 SC 1.4.3 and needed definitions; artifacts 4 and 8 | Normative criterion and thresholds/exceptions; interpretive context; contrast technique/calculation context. |

These filters prevent a single query from searching the other profiles. Technique inclusion never implies that it is the only sufficient method or that its preconditions have been established automatically.

## Mapping and boundary inputs outside the corpus

The Step 2 **rule manifest** and **approved scenario/rule-to-guidance mapping** must pin the scanner release and source evidence used for each mapping. Candidate primary references are the axe-core 4.13 [`image-alt` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json), Deque's axe-core 4.13 [`label` rule page](https://dequeuniversity.com/rules/axe/4.13/label), and Deque's axe-core 4.13 [`color-contrast` rule page](https://dequeuniversity.com/rules/axe/4.13/color-contrast). These records are mapping and provenance input, not embedded guidance and not proof that a complete success criterion failed.

The W3C ACT rule [Form field has non-empty accessible name (e086e5)](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/) is also retained outside the embedded corpus as an official mapping/boundary reference. It maps that atomic check to SC 4.1.2 and explicitly does not map it to SC 3.3.2. The proposed `label` profile likewise does not infer SC 1.3.1. ACT e086e5 may validate the mapping boundary and record its own version, locator, acquisition time, and checksum, but its text is not chunked, embedded, ranked, or cited as retrieved guidance in this evaluation.

This separation ensures that scanner and ACT metadata determine the permitted guidance scope without being mistaken for normative WCAG text or retrieved remediation guidance.

## W3C/WAI use and public-attribution boundary

OD-004 accepts this bounded pack only under WAI's [Using WAI Material](https://www.w3.org/WAI/about/using-wai-material/) guidance and the applicable [W3C Document License](https://www.w3.org/copyright/document-license-2023/). Those primary sources describe source, copyright, status, attribution, and modification considerations. Public availability alone does not waive those conditions, authorize every derived or redistributed representation, or imply W3C endorsement.

The future source manifest must therefore record, per artifact, its exact URL, publisher, normative or informative status, dated or independently snapshotted version, access date, copyright and attribution notice, license or use-condition URI, and any modification/derivation notes. Before source text is acquired, an implementation review must confirm that its planned local use, segmentation, excerpt display, and any public-demo distribution follow those recorded conditions. Product-authored summaries remain separate from exact W3C text. No corpus directory, download, copied source, or derived passage is created in this planning phase; after development is explicitly authorized, the implementation may download only the eight approved artifacts. This is a planning constraint, not legal advice.

## Proposed deterministic source preparation

When implementation is later authorized, the canonical corpus should remain independent of Chroma, EmbeddingGemma, LangChain, and generation:

1. **Acquire only from the closed manifest.** Each approved entry records its exact source URL, publisher, status, language, use conditions, acquisition time, and checksum. There is no recursive traversal, link following, or automatic refresh.
2. **Select sections manually.** The manifest names each accepted success criterion, required definition, Understanding heading, or Technique heading. This manual selection occurs before embedding.
3. **Segment by document structure.** Preserve the selected heading path and complete paragraph/list units. If one selected section must be divided to meet the evaluated embedding input limit, split only at a paragraph or list boundary and record continuation order. Do not use sliding-window overlap, a generic splitter, or query-dependent chunks.
4. **Attach source and scenario identity.** Each passage retains its exact URL/heading, source status, snapshot identity, checksum, accepted scenario/SC eligibility, and guidance role. A source or selected-boundary change creates a new snapshot.
5. **Embed only after segmentation.** The embedding adapter vectorizes the already selected canonical text. It may apply model-required query/document prefixes inside the adapter, but it does not decide passage boundaries, rewrite source ranges, or change canonical identity.

This is deliberately a small manual content-preparation path. It needs no crawler, framework loader, generic chunker, overlap strategy, concurrency control, refresh service, or automated ingestion pipeline.

Each canonical passage needs, at minimum:

- corpus-snapshot, source, passage, and derivation-profile identifiers;
- publisher, title, canonical URL, immutable/versioned URL when available, exact fragment or heading path, and language;
- source type and visible authority label such as **normative WCAG**, **informative Understanding**, or **informative Technique**;
- WCAG version, success-criterion or technique identifier, scenario-profile eligibility, and guidance-role code;
- publication/revision date, acquisition date, source status, license URI, attribution/copyright notice, and usage notes;
- exact source range or structural locator, continuation metadata, normalized-text checksum, source-artifact checksum, and transformation lineage.

Passage identifiers must bind source identity/version, exact locator, continuation part, normalized-text checksum, and derivation-profile version. They must not be assigned by array position, Chroma, LangChain, or an embedding model.

The external mapping manifest separately retains the pinned axe and ACT identities, versions, locators, checksums, approved rule-to-scenario/SC boundary, and review provenance. No external mapping text is copied into a canonical guidance passage.

## Assumptions

- The three accepted project-owned synthetic scenario profiles and their selected scanner results can be expressed without private page content.
- The pinned axe mappings remain `image-alt` to SC 1.1.1, `label` to SC 4.1.2 only, and `color-contrast` to SC 1.4.3 during the evaluation.
- A curator can approve exact mappings and guidance roles without treating them as conformance determinations.
- The accepted OD-004 boundary is sufficient to begin artifact-specific use-condition verification after development is authorized; it is not a conclusion that every future packaging or public-display choice is permitted.

## Open questions

- What exact excerpt and attribution presentation will be used in the local interface and any later public demo after artifact-specific use-condition review?
- What exact paragraph/list boundaries and continuation representation will the implementation select if an approved heading exceeds the evaluated embedding input limit?
- What exact immutable identifiers and review cadence should the external axe and ACT mapping manifest use when their published pages change?

## Risks

- Publicly readable W3C content may still be packaged, segmented, excerpted, attributed, or displayed in a way its license does not permit.
- Mutable Understanding, Technique, axe, ACT, or errata content may cause citation or mapping drift unless each input is snapshotted independently.
- A scanner-to-WCAG mapping may be presented as proof that the complete success criterion failed.
- H44 can relate to criteria beyond SC 4.1.2; careless metadata could incorrectly restore obsolete or broader `label` mappings to SC 1.3.1 or SC 3.3.2.
- Contrast thresholds and exceptions require contextual facts; retrieval of SC 1.4.3 and G18 cannot prove that the scanner classified every condition correctly.
- Manual selection or passage boundaries may omit an exception, definition, or qualification and change the apparent meaning.
- Three narrow hard-filtered profiles can make a small evaluation look stronger than broader retrieval would be.

## Explicit non-goals

- Broad WCAG coverage, a third or additional contrast fixture, the complete supporting library, other ACT rules, APG, multilingual retrieval, or user-supplied corpora.
- Embedding axe help text, ACT e086e5, scanner metadata, or product-authored summaries as guidance.
- Web search, automatic crawling, link following, automatic corpus refresh, or automatic acceptance of upstream changes.
- Embedding or indexing raw page evidence, private target content, credentials, proprietary documents, or generated text as guidance.
- Accessibility certification, full-success-criterion determination, or legal-compliance interpretation.

## Planning acceptance criteria

This corpus portion is adequately defined for the Proposed retrieval evaluation when:

1. The closed manifest contains exactly the eight W3C artifacts listed above and only the selected sections; artifact-specific use, status, copyright, attribution, modification, and public-display checks are completed before any authorized acquisition.
2. Each of the three scenario profiles has one exact source allowlist and required guidance-role mapping; the `label` profile is restricted to SC 4.1.2.
3. Pinned axe metadata and ACT e086e5 remain versioned mapping/boundary inputs outside the embedded corpus and cannot appear as ranked guidance passages.
4. Every passage has a visible authority label, exact locator, immutable snapshot identity, checksum, scenario eligibility, guidance role, and deterministic derivation path.
5. Manual heading-aware selection and paragraph/list segmentation occur before embedding; no crawler, generic splitter, sliding-window overlap, or embedding-owned segmentation is introduced.
6. Rebuilding an unchanged manifest produces the same passage identities and normalized text, while a source, selected boundary, or mapping change creates a new version rather than rewriting history.
7. No retrieved source or mapping record is presented as proof of complete WCAG failure, accessibility, conformance, or certification.

## Documentation navigation

- Up: [Accessibility guidance retrieval assessments](README.md)
- Next within this workflow step: [Local retrieval execution and evaluation](LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
