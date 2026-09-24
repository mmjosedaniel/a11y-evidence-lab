# Closed guidance corpus and source notices

[Documentation index](README.md) · [Project overview](../README.md)

This guide accompanies the frozen corpus with its selection, verification and attribution information. It does not replace the canonical catalog or manifest. For runtime behavior, see the [retrieval API reference](APPLICATION_GUIDE.md#retrieval-apis); for observations, see the [evaluation guide](EVALUATION_GUIDE.md).

In this guide: [Corpus snapshot](#closed-corpus-snapshot) · [Attribution and full notices](#closed-corpus-notices).

## Closed corpus snapshot

The accepted M2-01 snapshot consists of the [source manifest](../corpus/wcag22-mvp-v1/manifest.json), [canonical passages](../corpus/wcag22-mvp-v1/passages.json), and [three-profile gold mappings](../evaluation/m201-corpus-v1.json). It contains 16 manually selected, complete paragraph/list units from exactly eight W3C artifacts for `image-alt` / 1.1.1, `label` / 4.1.2, and `color-contrast` / 1.4.3. The dated 12 December 2024 Recommendation is normative; Understanding and Techniques are informative. Techniques are examples, not mandatory methods. No unresolved material conflict remains in the selected units after curator review with normative precedence.

Read the manifest, catalog, gold mappings and these notices together. Paragraph/list line breaks represent HTML layout; entities are decoded and wording is preserved. Definition terms retain their exact glossary locator. Source references inside quoted units do not expand the closed source pack or its supported profile tags. Stable passage IDs are manual labels, not ranks. Required roles and conflict declarations are inputs for deterministic support evaluation; gold IDs are acceptable direct-support targets for the fixed cases, not a required ordering or instruction to return all targets.

The catalog is the sole canonical selected-text snapshot. Reconstruct it from its existing JSON without refetching sources or changing IDs, headings, boundaries, text, roles or mappings. A source or passage change needs a new corpus version and affected gold/evaluation evidence. The [M2-01 plan](plans/completed/m2-01-closed-corpus-snapshot.md#m201-cmd-validate--future-static-candidate-read-only) records the read-only structural, reconstruction, negative and semantic checks. The [internal retrieval APIs](APPLICATION_GUIDE.md#retrieval-apis) consume this frozen snapshot. See the [retrieval evidence guide](EVALUATION_GUIDE.md#inspecting-m2-02-retrieval-evidence) for the accepted observation and the [application guide](APPLICATION_GUIDE.md#getting-guidance-for-one-finding) for current UI use. Gold evidence is an expected subset grounded in frozen RD-003 fixtures and historical observations, not a newly scanned Finding or a model result.

To repeat the static checks in the documented development environment, run the plan's read-only PREP block and then VALIDATE in the same PowerShell session from the repository root. PREP initializes the fixed source table and scan manifest used by VALIDATE. Do not run ACQUIRE or CLEANUP: the eight temporary full-page captures were verified and removed at closure. Source-semantic review is preserved in the [curation record](plans/completed/m2-01-closed-corpus-snapshot.md#m201-corpus-candidate-01--primary-curation-and-verification), and accepted artifact identities and final status are in the [freeze record](plans/completed/m2-01-closed-corpus-snapshot.md#m201-closure-01--final-freeze-and-documentation-impact).

## Closed corpus notices

The manifest identifies every original title, URL, status, observed version, copyright and attribution. This catalog includes material copied from **Web Content Accessibility Guidelines (WCAG) 2.2**, [W3C Recommendation, 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/), Copyright © 2020-2024 World Wide Web Consortium. It also includes material copied from the seven informative Understanding/Technique documents individually identified and linked in the [manifest](../corpus/wcag22-mvp-v1/manifest.json), Copyright © 2026 World Wide Web Consortium. Authorship is attributed to the W3C Accessibility Guidelines Working Group and contributors. Selection and plain-text layout are described above; quoted wording is unchanged. No W3C endorsement is implied.

The actual Recommendation footer links to the [W3C Document License](https://www.w3.org/copyright/document-license/), [liability](https://www.w3.org/policies/#Legal_Disclaimer) and [trademark](https://www.w3.org/policies/#W3C_Trademarks) notices. The seven supporting-page footers link to the [W3C Software and Document License](https://www.w3.org/copyright/software-license/), [liability](https://www.w3.org/policies/#disclaimers) and [trademark](https://www.w3.org/policies/#trademarks) notices. Both license links resolved to their 2023 versions when reviewed on 2026-09-03. These are accompanying source notices, not additional retrieval sources. Keep the source metadata and applicable full notice viewable with every later copied or displayed portion; a later UI, package or public distribution requires its own presentation review. M2-01 authorizes local preparation only.

### W3C Document License — 2023

The following license and disclaimers are reproduced from the [2023 Document License](https://www.w3.org/copyright/document-license-2023/), in effect since 1 January 2023.

> By using and/or copying this document, or the W3C document from which this statement is linked, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions:
>
> Permission to copy, and distribute the contents of this document, or the W3C document from which this statement is linked, in any medium for any purpose and without fee or royalty is hereby granted, provided that you include the following on ALL copies of the document, or portions thereof, that you use:
>
> - A link or URL to the original W3C document.
> - The pre-existing copyright notice of the original author, or if it doesn't exist, a notice (hypertext is preferred, but a textual representation is permitted) of the form: "Copyright © [$date-of-document] World Wide Web Consortium. https://www.w3.org/copyright/document-license-2023/"
> - If it exists, the STATUS of the W3C document.
>
> When space permits, inclusion of the full text of this NOTICE should be provided. We request that authorship attribution be provided in any software, documents, or other items or products that you create pursuant to the implementation of the contents of this document, or any portion thereof.
>
> No right to create modifications or derivatives of W3C documents is granted pursuant to this license, except as follows: To facilitate implementation of the technical specifications set forth in this document, anyone may prepare and distribute derivative works and portions of this document in software, in supporting materials accompanying software, and in documentation of software, PROVIDED that all such works include the notice below.
>
> HOWEVER, the publication of derivative works of this document for use as a technical specification is expressly prohibited.
>
> In addition, "Code Components" —Web IDL in sections clearly marked as Web IDL; and W3C-defined markup (HTML, CSS, etc.) and computer programming language code clearly marked as code examples— are licensed under the W3C Software License.
>
> The notice is:
>
> "Copyright © 2023 W3C®. This software or document includes material copied from or derived from [title and URI of the W3C document]."
>
> THIS DOCUMENT IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR TITLE; THAT THE CONTENTS OF THE DOCUMENT ARE SUITABLE FOR ANY PURPOSE; NOR THAT THE IMPLEMENTATION OF SUCH CONTENTS WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.
>
> COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE DOCUMENT OR THE PERFORMANCE OR IMPLEMENTATION OF THE CONTENTS THEREOF.
>
> The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to this document or its contents without specific, written prior permission. Title to copyright in this document will at all times remain with copyright holders.

### W3C Software and Document License — 2023

The following license and disclaimers are reproduced from the [2023 Software and Document License](https://www.w3.org/copyright/software-license-2023/), in effect since 1 January 2023.

> By obtaining and/or copying this work, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions.
>
> Permission to copy, modify, and distribute this work, with or without modification, for any purpose and without fee or royalty is hereby granted, provided that you include the following on ALL copies of the work or portions thereof, including modifications:
>
> - The full text of this NOTICE in a location viewable to users of the redistributed or derivative work.
> - Any pre-existing intellectual property disclaimers, notices, or terms and conditions. If none exist, the W3C software and document short notice should be included.
> - Notice of any changes or modifications, through a copyright statement on the new code or document such as "This software or document includes material copied from or derived from [title and URI of the W3C document]. Copyright © [$year-of-document] World Wide Web Consortium. https://www.w3.org/copyright/software-license-2023/"
>
> THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.
>
> COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
>
> The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to the work without specific, written prior permission. Title to copyright in this work will at all times remain with copyright holders.
