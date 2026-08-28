# Curated accessibility guidance corpus assessment

## Authority, status, and scope

**Status:** Proposed supporting assessment. It documents candidate implementation detail within the closed source, versioning, identity, and deterministic passage boundaries accepted by [ADR-0022](../../decisions/ADR-0022-closed-versioned-guidance-corpus.md). Exact acquisition, physical layout, and paragraph/list selections remain Proposed implementation-stage detail.

**Assessment date:** 2026-08-24.

**Decision alignment:** 2026-08-27, including the trusted operator-input portfolio scope recorded by [OD-021](../../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) and [ADR-0018](../../decisions/ADR-0018-trusted-operator-url-boundary.md), plus the corpus, retrieval, and record simplifications accepted by [OD-022](../../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification), [ADR-0019](../../decisions/ADR-0019-in-process-exact-vector-search.md), [ADR-0021](../../decisions/ADR-0021-single-file-run-aggregate.md), and [ADR-0022](../../decisions/ADR-0022-closed-versioned-guidance-corpus.md).

This focused assessment belongs to the [Accessibility guidance retrieval assessment family](README.md). It owns no requirement ID or status and does not authorize corpus acquisition or implementation. OD-004 and ADR-0022 accept the bounded source pack and its W3C/WAI use-condition boundary in the canonical [Evidence and review workflow requirements — Corpus and retrieval](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval). ADR-0022 also accepts manual deterministic heading-aware passage construction; exact copied text, paragraph/list boundaries, serialization, and physical layout remain Proposed until the implementation slice is authorized.

The [accepted first vertical slice](../../../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) scans one trusted operator-supplied, explicitly authorized public HTTPS page with exactly three rule mappings: `image-alt` / SC 1.1.1, `label` / SC 4.1.2, and `color-contrast` / SC 1.4.3. Choosing a suitable public target is the operator's responsibility; the application does not independently prove authorization or public reachability. The project-owned `informative-image-alt`, `form-input-label`, and `text-contrast` failing/corrected profiles remain the reproducible evaluation baseline for those mappings. This candidate assesses how to prepare the same bounded pack for independently selected findings from either source without selecting a release technology or creating corpus material during planning.

The live page is evidence, never guidance-corpus input. No page text, page link, scanner help text, or model output is admitted to the corpus. The eight-artifact pack is intentionally not guaranteed to support every real-world variant of an allowed rule: when a selected finding cannot be grounded in its allowlisted passages, retrieval records the applicable canonical state—`incomplete`, `missing`, or `conflicting`—and generation abstains. Only `supported` is generation-eligible. Observed abstentions may justify a later reviewed corpus decision; they do not expand this manifest automatically.

## Accepted closed eight-artifact W3C pack

OD-004 and ADR-0022 accept one manually curated English pack containing exactly eight W3C artifacts, subject to the recorded W3C/WAI use conditions. It is only large enough to retrieve the normative basis, essential contextual distinctions, and one or two directly applicable technique paths for the three profiles. Acceptance of the manifest is not a corpus download, copied-source authorization, or dependency selection.

| # | Accepted guidance artifact | Selected content boundary | Authority, version, and update treatment |
| --- | --- | --- | --- |
| 1 | [WCAG 2.2 Recommendation dated 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/) | Only SC 1.1.1, SC 4.1.2, SC 1.4.3, and the normative definitions those selected sections directly require. | Normative baseline. Retain the dated Recommendation URL, latest-version URL, publication status/date, selected headings, attribution/use-condition information, and a reviewed [errata](https://www.w3.org/WAI/WCAG22/errata/) disposition in the versioned source manifest. An errata-driven source or selected-text change creates a new corpus version; do not silently merge it. |
| 2 | [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) | Intent, exceptions, and contextual material needed to distinguish meaningful from decorative images. | Informative, not required for conformance. Freeze its selected headings and text through the corpus version. |
| 3 | [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) | Intent and the selected passages explaining programmatically determinable names for standard form controls. | Informative. Preserve the distinction between a programmatic name and a visible label; do not broaden the scanner-rule mapping. |
| 4 | [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) | Intent, normal/large-text thresholds, and listed exceptions needed to interpret one deterministic contrast finding. | Informative. Retain qualifications and definitions with the selected passages so a threshold is not presented without its conditions. |
| 5 | [Technique H37](https://www.w3.org/WAI/WCAG22/Techniques/html/H37) | Structural passages needed for the meaningful-image `alt` path. | Informative example, not a required or universal method. Retain applicability and the selected heading and text in the versioned source manifest. |
| 6 | [Technique H67](https://www.w3.org/WAI/WCAG22/Techniques/html/H67) | Structural passages needed for the decorative-image path. | Informative example. Cite separately from H37 because selecting the correct path requires contextual human judgment. |
| 7 | [Technique H44](https://www.w3.org/WAI/WCAG22/Techniques/html/H44) | Structural passages for associating a `label` element with an applicable native form control. | Informative example. Its inclusion supplies one remediation technique for the SC 4.1.2 profile; it does not add SC 1.3.1 or SC 3.3.2 to the `label` rule mapping. |
| 8 | [Technique G18](https://www.w3.org/WAI/WCAG22/Techniques/general/G18) | Structural passages describing the SC 1.4.3 contrast technique and calculation context. | Informative example. It supports a proposal and manual verification but does not make one automated result conformance proof. |

The dated WCAG artifact counts once even though three selected success-criterion sections become separately addressable passages. No other WCAG section, linked technique, example page, or definition is admitted unless this closed manifest is explicitly revised through the applicable decision process.

### Rule/SC tagging and guidance roles

Each retrieval run starts from one selected finding and resolves exactly one accepted rule mapping. Every passage carries its rule and success-criterion tags plus one application-owned guidance role declared by the manifest. That role describes the passage's retrieval function and remains distinct from its normative or informative source authority. Retrieval filters on rule and success-criterion tags only; it does not preselect source IDs or guidance roles before similarity ranking. The table defines the tagged eligible passages and the roles that the returned passages must collectively support:

| Supported rule and evaluation profile | Rule/SC-tagged eligible passages | Guidance roles needed for a supported result |
| --- | --- | --- |
| `informative-image-alt` / SC 1.1.1 | WCAG 2.2 Recommendation: SC 1.1.1 and needed definitions; Understanding SC 1.1.1; Techniques H37 and H67 | Normative criterion and contextual purpose/exceptions, plus at least one applicable technique passage for the profile's conditional proposal contract. A proposal must not make a technique-specific claim for a branch whose passage was not returned. |
| `form-input-label` / SC 4.1.2 | WCAG 2.2 Recommendation: SC 4.1.2 and needed definitions; Understanding SC 4.1.2; Technique H44 | Normative criterion; programmatic-name context; applicable native-label association technique. |
| `text-contrast` / SC 1.4.3 | WCAG 2.2 Recommendation: SC 1.4.3 and needed definitions; Understanding SC 1.4.3; Technique G18 | Normative criterion and thresholds/exceptions; interpretive context; contrast technique/calculation context. |

These rule/SC tags prevent a single finding query from searching the other rule mappings. Multiple findings from the same page are never combined into one query. Technique inclusion never implies that it is the only sufficient method or that its preconditions have been established automatically.

## Mapping and boundary inputs outside the corpus

The Step 2 **rule manifest** and **approved rule-to-guidance mapping** must pin the scanner release and source evidence used for each mapping. Candidate primary references are the axe-core 4.13 [`image-alt` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json), Deque's axe-core 4.13 [`label` rule page](https://dequeuniversity.com/rules/axe/4.13/label), and Deque's axe-core 4.13 [`color-contrast` rule page](https://dequeuniversity.com/rules/axe/4.13/color-contrast). These records are mapping and provenance input, not embedded guidance and not proof that a complete success criterion failed.

The W3C ACT rule [Form field has non-empty accessible name (e086e5)](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/) is also retained outside the embedded corpus as an official mapping/boundary reference. It maps that atomic check to SC 4.1.2 and explicitly does not map it to SC 3.3.2. The proposed `label` profile likewise does not infer SC 1.3.1. The existing Step 2 rule manifest may retain the reviewed ACT version and direct locator; its text is not chunked, embedded, ranked, or cited as retrieved guidance in this evaluation. No second corpus-specific mapping manifest is required.

This separation ensures that scanner and ACT metadata determine the permitted guidance scope without being mistaken for normative WCAG text or retrieved remediation guidance.

## W3C/WAI use and public-attribution boundary

OD-004 accepts this bounded pack only under WAI's [Using WAI Material](https://www.w3.org/WAI/about/using-wai-material/) guidance and the applicable [W3C Document License](https://www.w3.org/copyright/document-license-2023/). Those primary sources describe source, copyright, status, attribution, and modification considerations. Public availability alone does not waive those conditions, authorize every derived or redistributed representation, or imply W3C endorsement.

The future source manifest must have one corpus version and, for each artifact, its source title and type, direct URL, publisher, applicable publication/version status, selected headings, copyright and attribution notice, and license or use-condition URI. Before source text is acquired, an implementation review must confirm that its planned local use, segmentation, excerpt display, and any public-demo distribution follow those recorded conditions. Product-authored summaries remain separate from exact W3C text. No corpus directory, download, copied source, or derived passage is created in this planning phase; after development is explicitly authorized, the implementation may download only the eight approved artifacts. This is a planning constraint, not legal advice.

## Accepted source-preparation boundary and Proposed exact selections

ADR-0022 requires the canonical corpus to remain independent of the embedding, retrieval, and generation runtimes. When implementation is later authorized, exact passage selections must stay inside this accepted boundary:

1. **Acquire only from the closed manifest.** One versioned source manifest records the eight approved entries, their selected headings, direct URLs, source types, and attribution/use-condition information. There is no recursive traversal, link following, or automatic refresh.
2. **Select sections manually.** The manifest names each accepted success criterion, required definition, Understanding heading, or Technique heading. This manual selection occurs before embedding.
3. **Segment by document structure.** Preserve the selected heading and complete paragraph/list units. If one selected section must be divided to meet the evaluated embedding input limit, split only at a paragraph or list boundary and assign each selected unit a stable passage ID. Do not use sliding-window overlap, a generic splitter, or query-dependent chunks.
4. **Attach only the needed identity, retrieval-role, and citation fields.** Each passage records its stable `passageId`, corpus version, source title and type, exact heading, direct URL, rule and success-criterion tags, one application-owned guidance role from the manifest, and selected text. The guidance role remains separate from the normative-or-informative authority label. A source or selected-text change creates a new corpus version.
5. **Make segmentation a prerequisite for embedding.** The embedding adapter may vectorize only already selected canonical text. Actual vectorization and in-process store construction wait for the first explicit retrieval request and repeat only for a required rebuild under ADR-0019 and ADR-0020; corpus preparation itself does not trigger them. The adapter may apply model-required query/document prefixes, but it does not decide passage boundaries, rewrite source ranges, or change canonical identity.

This is deliberately a small manual content-preparation path. It needs no crawler, framework loader, generic chunker, overlap strategy, concurrency control, refresh service, or automated ingestion pipeline.

The curator assigns stable, readable passage IDs; a framework, embedding model, or array position does not assign them. The pair `corpus version + passageId` resolves the exact selected text used by a run and is sufficient for citation and retrieval traceability. Passage checksums, independent passage versions, derivation-profile versions, transformation lineage, and a passage-version graph are not required for this closed MVP corpus.

The existing Step 2 rule manifest retains the pinned axe and ACT mapping references and the approved rule-to-scenario/SC boundary. No axe or ACT text is copied into a canonical guidance passage.

## Assumptions

- Each allowed live finding can be projected to its rule mapping without placing the page URL, locator, page text, or other target content in the retrieval query.
- The three project-owned synthetic profiles remain sufficient to freeze and evaluate the canonical supported retrieval cases.
- The pinned axe mappings remain `image-alt` to SC 1.1.1, `label` to SC 4.1.2 only, and `color-contrast` to SC 1.4.3 during the evaluation.
- A curator can approve exact mappings and guidance roles without treating them as conformance determinations.
- The accepted OD-004 boundary is sufficient to begin artifact-specific use-condition verification after development is authorized; it is not a conclusion that every future packaging or public-display choice is permitted.

## Open questions

- What exact excerpt and attribution presentation will be used in the local interface and any later public demo after artifact-specific use-condition review?
- What exact paragraph/list boundaries will the implementation select if an approved heading exceeds the evaluated embedding input limit?
- When should a reviewed upstream axe or ACT change require an update to the existing Step 2 rule manifest?
- Which observed, safely minimized live-finding abstentions would demonstrate a product need to review the closed corpus after the MVP?

## Risks

- Publicly readable W3C content may still be packaged, segmented, excerpted, attributed, or displayed in a way its license does not permit.
- Mutable Understanding, Technique, axe, ACT, or errata content may cause citation or mapping drift unless reviewed source/text changes create a new corpus version and mapping changes update the Step 2 rule manifest.
- A scanner-to-WCAG mapping may be presented as proof that the complete success criterion failed.
- H44 can relate to criteria beyond SC 4.1.2; careless metadata could incorrectly restore obsolete or broader `label` mappings to SC 1.3.1 or SC 3.3.2.
- Contrast thresholds and exceptions require contextual facts; retrieval of SC 1.4.3 and G18 cannot prove that the scanner classified every condition correctly.
- Manual selection or passage boundaries may omit an exception, definition, or qualification and change the apparent meaning.
- Three narrow hard-filtered profiles can make a small evaluation look stronger than broader retrieval would be.
- A supported axe rule can produce a live variant whose context or remediation path is not covered by the closed pack; treating rule identity alone as sufficient support would overstate retrieval quality.

## Explicit non-goals

- Broad WCAG coverage, a third or additional contrast fixture, the complete supporting library, other ACT rules, APG, multilingual retrieval, or user-supplied corpora.
- Embedding axe help text, ACT e086e5, scanner metadata, or product-authored summaries as guidance.
- Web search, automatic crawling, link following, automatic corpus refresh, or automatic acceptance of upstream changes.
- Embedding or indexing raw page evidence, private target content, credentials, proprietary documents, or generated text as guidance.
- Expanding the corpus automatically from a scanned page, its links, a model suggestion, or an unsupported finding.
- Accessibility certification, full-success-criterion determination, or legal-compliance interpretation.

## Planning acceptance criteria

This corpus portion is adequately defined for the Proposed retrieval evaluation when:

1. The closed manifest contains exactly the eight W3C artifacts listed above and only the selected sections; artifact-specific use, status, copyright, attribution, modification, and public-display checks are completed before any authorized acquisition.
2. Each of the three accepted rule mappings has one explicit rule/SC-tagged passage set and required guidance-role mapping; retrieval filters by rule/SC rather than source ID, the `label` mapping is restricted to SC 4.1.2, and each selected finding is queried independently.
3. Pinned axe metadata and ACT e086e5 remain versioned mapping/boundary inputs outside the embedded corpus and cannot appear as ranked guidance passages.
4. Every passage has a stable `passageId`, corpus version, source title and type, exact heading, direct URL, rule/success-criterion tags, one application-owned guidance role, selected text, and a visible normative-or-informative authority label; the guidance role and source authority remain distinct.
5. Manual heading-aware selection and paragraph/list segmentation occur before embedding; no crawler, generic splitter, sliding-window overlap, or embedding-owned segmentation is introduced.
6. Rebuilding an unchanged manifest produces the same passage IDs and selected text. A source or selected-text change creates a new corpus version; no per-passage checksum ledger, independent version graph, or derivation-profile history is required.
7. No retrieved source or mapping record is presented as proof of complete WCAG failure, accessibility, conformance, or certification.
8. Live page content cannot enter the corpus or retrieval query, and an allowed-rule finding outside the pack's supported context causes a recorded `incomplete`, `missing`, or `conflicting` result and deterministic abstention rather than corpus expansion.

## Documentation navigation

- Up: [Accessibility guidance retrieval assessments](README.md)
- Next within this workflow step: [Local retrieval execution and evaluation](LOCAL_RETRIEVAL_EXECUTION_AND_EVALUATION_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [ADR-0022: Closed, versioned guidance corpus](../../decisions/ADR-0022-closed-versioned-guidance-corpus.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
