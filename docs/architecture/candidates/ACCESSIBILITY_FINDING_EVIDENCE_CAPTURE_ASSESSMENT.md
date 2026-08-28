# Accessibility finding and evidence capture assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the second workflow step, aligned on 2026-08-27 with [OD-022](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) and [ADR-0021](../decisions/ADR-0021-single-file-run-aggregate.md). This assessment owns no requirement IDs or statuses, authorizes no implementation, and selects no schema library.

Canonical behavior remains in [Evidence and review workflow requirements — Evidence and provenance](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance). Accepted policy controls if it conflicts with this assessment.

## Recommendation: minimize directly into the run aggregate

Step 1 supplies one complete, runtime-validated, transient axe result for one trusted operator-entered public HTTPS page and exactly `image-alt`, `label`, and `color-contrast`. Step 2 should validate and minimize that result directly into the current `run.json`:

- one run-level scan section with target, tool, profile, time, coverage, and completion provenance;
- one nested Finding for every returned violation node;
- one nested minimized evidence object inside each Finding;
- a distinct list of minimized native `incomplete` observations; and
- only the narrow same-target positive observation needed by an intentional later comparison.

The product lists every Finding but processes none automatically. One selected Finding at a time may later enter retrieval and sufficiency evaluation. Insufficiency ends that FindingWorkflow in a terminal application-authored abstention with explanation and manual-investigation guidance but no model call or proposal-review decision; eligibility may produce one proposal that alone enters review. Findings never share a combined prompt, proposal, confidence, review decision, or comparison result.

If required allowlisted evidence is missing, invalid, or contradictory, keep the deterministic Finding visible and mark its evidence insufficient. This blocks only that Finding's generation path.

## Step boundary

`complete transient axe result -> minimized scan and Findings in run.json -> one selected Finding -> retrieval`

Step 1 owns navigation, fresh browser execution, exact rule configuration, native collection, runtime validation, timeout, and cleanup. Step 2 owns rule-specific allowlisting, sanitization, the durable Finding list, distinct incomplete observations, and evidence-sufficiency inputs.

Step 2 must reject a failed, truncated, malformed, or coverage-incomplete handoff. It must not publish fewer Findings as a successful scan. The unredacted native result remains transient and is discarded after minimization succeeds or fails.

## Minimum finding identity and evidence

One application Finding corresponds to one axe violation node under one supported rule. Its minimum nested record needs:

- a `findingId` unique within the enclosing run; the aggregate supplies the run's `runId`;
- the exact rule ID, native result category, impact when reported, and check identifiers;
- one bounded, sanitized locator string for conservative later comparison when valid and available, otherwise one concise unavailability reason;
- the rule-specific facts below;
- an evidence-sufficiency value and concise reason when insufficient; and
- the run-level scanner, browser, target, profile, coverage, and evidence-policy provenance.

No separate scan ID, evidence ID, projection ID, policy ID, target fingerprint, occurrence identity, digest, or independently versioned child record is required. Multiple Findings may retain the same locator. They remain independently addressable by `findingId`, while duplicate locator matches make later public-page correlation `inconclusive`.

The locator is minimized evidence, not a universal element identity. It must not contain credentials, form values, raw HTML, arbitrary text, executable URLs, or an unbounded DOM path.

## Rule-specific evidence

Common retained facts are limited to the rule/category, native check identities, scanner-reported impact, a safe locator when valid and available or its concise unavailability reason, rule-specific facts, and explicit missing or invalid categories. Locator unavailability makes exact correlation unavailable and, if the scan pair otherwise passes the comparability gate, makes a requested comparison `inconclusive`; it does not by itself make generation evidence insufficient because the locator never enters retrieval or provider input. Exact scanner and adapter versions, page identity, viewport, locale, scan time, rule set, and coverage belong once at run level.

Exclude native `node.html`, full HTML, arbitrary page or element text, page source, DOM or accessibility-tree snapshots, screenshots, browser traces, network bodies or logs, cookies, storage, credentials, headers, input values, image URLs, and unrelated attributes.

### `image-alt`

Retain element kind `img`, native check identities, and bounded facts describing whether a text-alternative mechanism was present according to the scanner. Do not retain `src`, filenames, surrounding text, or a model-inferred image purpose.

The automated result cannot establish whether the image is informative, functional, or decorative, or what alternative wording is appropriate. Those are manual judgments.

### `label`

Retain the element kind, safe input type, native check identities, and bounded facts about programmatic accessible-name or label-association mechanisms reported for the target. Do not retain the current value, arbitrary placeholder text, submission data, or a person's name.

The product's rule mapping is SC 4.1.2. This evidence alone does not prove complete success-criterion non-conformance or label quality.

### `color-contrast`

Retain these scanner-emitted values when present and valid:

- `fgColor`;
- `bgColor`;
- `contrastRatio`;
- `expectedContrastRatio`;
- `fontSize`; and
- `fontWeight`.

Preserve the measured ratio and expected threshold used by the scanner. Capture does not recompute contrast or override the native result. Missing or inconsistent material measurements keep the Finding visible but make its evidence insufficient for generation.

## Incomplete and positive observations

Native axe `incomplete` nodes remain separate scanner-review observations. Retain only the rule/check identity, a safe locator when valid and available or its concise unavailability reason, and the available scanner reason needed to explain the limitation. They are not Findings, do not enter retrieval or proposal review, and do not become workflow failures.

For an intentional rescan, the application may request one narrow native non-failing observation for a baseline Finding's exact locator under the same rule. Retain only the evidence needed to show that exact target was evaluated. Absence from the later violation list is not enough. A missing, changed, duplicate, or ambiguous locator produces `inconclusive` rather than a fabricated positive observation.

## Conceptual `run.json` placement

This is documentation, not a TypeScript schema.

| Location | Minimum content |
| --- | --- |
| Run scan section | Normalized requested and observed final page; scan time; browser, scanner, viewport, locale, exact rule profile, evidence-policy version, coverage, and completion status. |
| Finding entry | `findingId`; rule/category; impact and checks; safe locator when valid and available or its concise unavailability reason; nested rule-specific evidence; sufficiency and limitation reason. |
| Incomplete-observation entry | Rule/check identity; safe locator when valid and available or its concise unavailability reason; available scanner reason; clear scanner-review classification. |
| Targeted positive observation | Baseline finding reference; exact rule and locator; later non-failing evidence or an inconclusive reason. |

The aggregate itself supplies lineage:

`Finding -> nested evidence -> run scan provenance`

and, for retrieval:

`Finding -> rule mapping -> retrieved passage IDs`

No separate evidence graph or child-file layout is needed.

## Handoff to later steps

Retrieval receives one selected Finding's rule, native checks, and allowlisted rule-specific facts. It does not receive the page URL, locator, raw HTML, arbitrary text, sibling Findings, or excluded evidence. Opaque identifiers remain traceability fields and are not embedded.

The scanned page never enters the curated guidance corpus. Missing core facts or a supported-rule contextual variant that lacks required support causes deterministic ineligibility or abstention. An invalid, unknown, or ambiguous fixed rule-to-guidance mapping instead fails configuration or integrity processing with no guidance-support state. Neither path triggers web search, corpus expansion, raw-page prompting, or a generic proposal.

Generation and review refer to the same nested Finding without modifying its source evidence. Comparison uses the two complete runs and the exact rule-plus-locator policy accepted for public pages. Controlled fixtures continue to use their stable project-owned target keys.

## Privacy and portfolio boundary

Persist only the minimized facts needed to inspect the three-rule workflow. Public reachability does not make page content safe to retain, send, or publish. Groq may receive only the selected eligible Finding's permitted facts and retrieved guidance after the explicit Generate action; it receives no URL, locator, raw page, sibling Finding, or review history.

A public portfolio demonstration should use the project-owned synthetic evaluation material or separately approved non-sensitive minimized evidence. The application makes no certification, compliance, or hostile-page-safety claim.

## Alternatives

| Alternative | Disposition |
| --- | --- |
| Persist the complete native axe result | Reject: it retains unnecessary content and couples durable data to the scanner payload. |
| Create separate scan, evidence, projection, and policy records with their own identities and versions | Defer: the one-run portfolio workflow can preserve traceability through nesting. |
| Merge every node for one rule into one Finding | Reject: separate targets require separate evidence and review. |

## Assumptions, open questions, and non-goals

Assumptions:

- the operator supplies one trusted, authorized public HTTPS page;
- the scan covers exactly the three accepted rules; and
- one local user processes one retained Finding at a time.

The exact bounded locator syntax, rule-specific field names, evidence-policy version label, and targeted-positive-observation procedure remain implementation details.

Explicit non-goals are raw-page storage or prompting, screenshots, DOM or accessibility-tree capture, fuzzy or AI element matching, automatic all-finding processing, authenticated pages, crawling, broader rule coverage, multiple scanners, automatic remediation, and certification or compliance determination.

## Planning acceptance criteria

This step is adequately defined when:

1. one complete transient scan produces every returned violation node as an independent nested Finding;
2. incomplete observations remain separate and visible;
3. the allowlist retains the minimum facts for the three rules and excludes raw page/browser payloads;
4. insufficient evidence keeps the Finding visible and blocks only its generation path;
5. retrieval can build a privacy-safe query without URL, locator, arbitrary text, or HTML;
6. one `run.json` preserves traceability without separate evidence identities or files; and
7. later comparison can request a narrow exact-target positive observation and otherwise remains conservative.

## Primary sources

- [axe-core 4.13.0 API and result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 TypeScript result definitions](https://github.com/dequelabs/axe-core/blob/v4.13.0/axe.d.ts)
- [axe-core 4.13.0 contrast evaluator](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)
- [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value)
- [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)

## Documentation navigation

- Previous workflow step: [Authorized deterministic web scan assessments](authorized-scan/README.md)
- Next workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- [ADR-0021: Single-file run aggregate](../decisions/ADR-0021-single-file-run-aggregate.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
