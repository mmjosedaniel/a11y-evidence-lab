# Analyze and results presentation

- **Status:** Accepted M1-04 presentation contract through OD-027; implementation in progress
- **Last reviewed:** 2026-09-02
- **Scope:** Analysis input and deterministic scan results only

## Document role

This document defines the required visible content, order, hierarchy, and responsive behavior for the M1-04 Analyze and Results interface. It is based on review of the earlier rendered M1-04 interface and is the presentation contract selected by the project owner through [OD-027](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-027--simplify-analysis-and-results-presentation). Canonical requirements, the roadmap, and the owning ExecPlan remain the implementation and verification authorities.

The contract removes internal execution metadata from the visible results experience and replaces the earlier repeated summary, coverage, and technical-detail regions with one concise overview and an evidence-first finding workspace. Canonical data remains persisted for validation, provenance, downstream work, and diagnostics even when this document says it must not appear in the primary interface.

OD-027 reconciles the earlier requirements that called for a visible trusted-input notice, mode disclosure, persistent provider/model context, lifecycle field, exact scan configuration, complete coverage table, and provider-call announcement in the deterministic scan interface. Those facts remain canonical and available to application logic, validation, later provider-specific workflow stages, and diagnostics. The fixed Groq adapter remains the only remote MVP path: **Groq API URL** below means its application-owned configured endpoint, never a user-entered URL or arbitrary remote profile. Selecting a mode or starting the provider-independent scan performs no availability probe.

## Presentation objective

The page should help a developer answer four questions quickly:

1. Which page was analyzed?
2. How many automated findings and manual-review items were produced?
3. Which elements need attention?
4. What concrete evidence caused each item to appear?

The primary interface should not ask the developer to interpret run-storage metadata, browser execution settings, scanner plumbing, provider configuration, or native engine terminology.

## Page structure

The interface uses one responsive page in this order:

1. **Analyze a page**
2. **Results** after a completed or failed analysis
3. **Results overview** for a completed analysis
4. **Findings** containing automated findings and tagged manual-review items, grouped by the three supported checks
5. **Selected evidence** for either kind of item

There is no separate **Summary**, **Complete coverage**, **Technical run details**, **Run context**, **Scan context**, or **Technical scanner evidence** region.

## Analysis input

### Elements shown before analysis

Show the following elements in this exact order:

| Element | Visible content or behavior |
| --- | --- |
| Page heading | **Analyze a page** |
| URL label | **Target URL** |
| URL input | One required text input. It starts empty and accepts a public HTTPS URL without embedded credentials. Do not use a sample URL as a persisted default value. |
| Mode group label | **Generation mode** |
| Local option | **Local (recommended)** |
| Groq option | **Groq** |
| Mode selection | Neither mode is selected initially. The developer must choose one explicitly. |
| Primary action | **Analyze** |
| Operation message | Show only while an operation starts, completes, or fails. Keep it near the Analyze action and announce it without moving focus. |

Do not show a supported-use notice, mode description, model description, provider description, endpoint explanation, or data-egress explanation during the normal ready state.

### Mode behavior and configuration feedback

Selecting Local or Groq changes only the selected radio state. A valid, usable selection displays no explanatory message.

Show a configuration message only when the selected option has a known missing prerequisite:

- If Local is selected and the required model is known to be absent, show **The Local model is not installed. Install it before using Local generation.**
- If Groq is selected and the required API URL is not defined, show **The Groq API URL is not configured. Define it before using Groq.**

These are concise configuration messages, not general mode explanations. Do not test provider connectivity, start a download, call an API, or send a synthetic request when the user selects a mode or activates Analyze. The messages do not block the provider-independent scan; they explain why a later generation action will be unavailable until setup is corrected.

### Validation and operation states

- If the URL is missing or unsupported, show **Enter a valid HTTPS URL without embedded credentials.** and associate it with the URL input.
- If no mode is selected when the user activates Analyze, show **Choose Local or Groq.** and associate it with the mode group. Do not show this message before the first submission attempt, and remove it immediately after a mode is selected.
- Do not show any message below a valid, configured mode selection.
- During analysis, keep the captured input immutable for the active operation, prevent a second Analyze action, preserve visible focus, and announce **Analysis started.**
- On completion, announce the result count, for example **Analysis completed: 4 findings and 3 items need manual review.**
- On failure, show the failure presentation defined below. Do not replace previously completed evidence with a failed attempt.

### Form layout and interaction

- Keep the form compact and left aligned within a readable-width column rather than stretching short labels and controls across the full Results width.
- Place Local and Groq on one row when space permits and stack them at narrow widths.
- Put validation or configuration feedback directly below the control it describes.
- Reserve vertical space only when a message exists; do not leave an empty helper-text gap.
- Keep Analyze as the only high-emphasis action in the form.
- After Results appear, do not repeat the completion total below Analyze. The visible total belongs in the Results overview; the live announcement may remain available to assistive technology.

## Results header and limitations

Show the following elements at the top of a completed result:

| Element | Visible content or behavior |
| --- | --- |
| Section heading | **Results** |
| Analyzed page label | **Analyzed page** |
| Analyzed page value | The normalized final page URL observed by the scan. Render it as inert text unless a later decision explicitly permits an outbound link. |
| Limitation note | **Checks cover image alternatives, form labels, and color contrast in the rendered top-level page. Results are not an accessibility or compliance certification.** |

Do not display a supported-use note, lifecycle status, generation mode, provider, model, ProviderInvocation state, or “No provider call was attempted” in this results header.

## Results overview

Use one prominent overview instead of the current Summary plus coverage tables plus complete-coverage disclosure.

### Elements shown

1. A high-emphasis total such as **4 findings need review**.
2. A secondary total such as **3 items need manual review**. Omit this line when the count is zero.
3. One compact group for each supported check:

| Display label | Counts shown |
| --- | --- |
| **Image alternatives** | Number of findings and number needing manual review |
| **Form labels** | Number of findings and number needing manual review |
| **Color contrast** | Number of findings and number needing manual review |

For example:

| Image alternatives | Form labels | Color contrast |
| --- | --- | --- |
| 2 findings · 1 manual review | 1 finding · 1 manual review | 1 finding · 1 manual review |

### Information not shown in the overview

Do not show separate rows for:

- violations;
- incomplete;
- passes;
- inapplicable;
- not reported;
- native coverage bucket names; or
- a second full coverage table.

The visible overview is derived from the complete canonical collections. It must never omit an item or turn missing coverage into zero.

## Findings list

### Grouping

Show every automated Finding and every ScannerReviewObservation in one list grouped under these user-facing headings:

1. **Image alternatives**
2. **Form labels**
3. **Color contrast**

Keep all three groups in this order. Within a group, show automated Findings first and manual-review items second. If a group has neither kind of item, show **No findings or manual reviews in this check.** Do not remove the group or imply that the entire page passed.

Manual-review items remain ScannerReviewObservations in the canonical data and application state. Presenting them beside Findings must not convert them into Findings or include them in the automated Finding total.

### Finding item content

Each selectable automated Finding shows only:

1. A stable, human-readable label such as **Image alternative issue 1**, **Form label issue 1**, or **Color contrast issue 1**.
2. A concise affected-element summary:
   - image alternative: **Image element**;
   - form label: element and input type, such as **Input · text**;
   - color contrast: foreground color, background color, font size, and weight.
3. A programmatic selected state that does not rely only on color.

The whole card is the evidence-selection button. Do not add **View evidence** or another redundant action label inside the card.

Do not show the internal Finding ID as the main title, the rule ID, `unprocessed`, provider information, model information, or provider-call information in each list item.

Each selectable manual-review item uses the same card and evidence-opening interaction, and shows only:

1. A stable label such as **Image alternative review 1**, **Form label review 1**, or **Color contrast review 1**.
2. The same concise affected-element summary used by a Finding for that check.
3. A visible **Needs manual review** tag. The tag is status text and is included in the item's accessible name; it does not rely on color alone.
4. A programmatic selected state that does not rely only on color.

The whole card is the evidence-selection button. Do not add **View evidence** or another redundant action label inside the card.

Show one concise explanation immediately below the **Findings** heading when at least one manual-review item exists: **Items tagged Needs manual review could not be determined automatically.** Do not create a second manual-review section.

## Selected evidence

The selected detail should make deterministic evidence the main content. It must not place all evidence behind a disclosure named **Technical scanner evidence**.

### Elements shown for every selected item

Show these elements in this order:

1. The same human-readable item label used in the list.
2. The visible **Needs manual review** tag when the selected item is a ScannerReviewObservation.
3. A one-sentence deterministic explanation of what was detected or why manual review is required.
4. **Affected element** with the concise target summary.
5. **Where on the page** with the retained structural locator in code styling when available. If it is unavailable, show **Page location unavailable** with the bounded reason in plain language.
6. **Evidence** with the rule-specific fields below.

Do not show a **Back to findings** control. Selecting either kind of item updates the adjacent or following evidence detail while keyboard focus remains on the selected item.

Do not show lifecycle status, mode, provider, model, Run ID, native result, native check-group names, or provider-call text in this detail.

### Image alternative evidence

Show:

| Label | Value |
| --- | --- |
| **Element** | Image |
| **Alternative text** | Missing, empty, whitespace only, or present, based on the retained categorical evidence |

The deterministic explanation should describe the retained category, for example: **The image does not have usable alternative text.**

### Form label evidence

Show:

| Label | Value |
| --- | --- |
| **Element** | Input or textarea |
| **Input type** | The retained input type, or **Not applicable** for a textarea |
| **Explicit label** | Yes, no, or unavailable |
| **Implicit label** | Yes, no, or unavailable |
| **ARIA label** | Missing, empty, whitespace only, present, or unavailable |
| **ARIA labelled by** | Missing, empty, unresolved, partially resolved, resolved, or unavailable |
| **Title** | Missing, empty, whitespace only, present, or unavailable |
| **Placeholder** | Missing, empty, whitespace only, present, or unavailable |

Show **Presentational role** only when it materially explains the result. The deterministic explanation should be **The form control does not have a usable accessible name.**

### Color contrast evidence

Show:

| Label | Value |
| --- | --- |
| **Text color** | Color sample and retained foreground value |
| **Background color** | Color sample and retained background value |
| **Measured contrast** | Ratio rounded for display without changing the retained value |
| **Required contrast** | Retained expected ratio |
| **Font size** | Retained size |
| **Font weight** | Retained weight |

Show **Shadow color** only when it is available and the retained native reason is `shadowOnBgColor` or `fgOnShadowColor`, which identifies a material shadow contribution. The deterministic explanation should compare the measured and required ratios, for example: **Measured contrast is 4.48:1; this text requires 4.5:1.**

Do not show `axe-core`, raw message keys such as `bgImage`, or `Any`, `All`, and `None` check groups in the primary interface.

## Manual-review evidence

A selected manual-review item uses the shared selected-evidence area. Its one-sentence explanation uses a plain-language reason such as **Alternative text could not be inspected**, **Label information was not available**, **Label information was withheld**, or **Background imagery prevented a reliable contrast result**. A retained `missing` label reason must not be presented as `withheld`.

Show **Where on the page** when a locator is available and the same relevant rule-specific evidence fields defined for Findings. Do not add a native or **Technical scanner evidence** disclosure.

## Complete-zero result

When all three supported checks complete with no Findings:

- show **No automated findings in the three supported checks** as the prominent result;
- show the manual-review total and items when observations exist;
- retain the analyzed page and limitation notes; and
- state **This does not prove that the page is accessible or compliant.**

Do not show an empty Finding detail pane or use a success score, certification symbol, or whole-page pass statement.

## Failed result

When analysis fails, show only:

1. **Results**
2. **Requested page** and the normalized requested URL
3. **Analysis could not be completed**
4. A concise, safe stage-specific explanation
5. Any persistence or cleanup uncertainty that requires developer action

Do not show a completed-results overview, Findings, manual-review items, Run context, Scan context, coverage tables, or partial success. The ordinary input form remains available for a new independent analysis; do not add a dedicated Retry action.

When a new independent analysis begins while an older failed result is displayed, remove that older failed result. If the new attempt fails before producing a run, show the new operation error and any persistence or cleanup uncertainty with the form; do not attach it to the older failed run or hide it behind that result. A previously completed result remains preserved by the separate retained-evidence rule.

## Information omitted from the primary interface

The following data must not appear in the accepted Analysis results interface:

- supported-use or trusted-input notices;
- selected-mode explanations when configuration is available;
- run lifecycle status field;
- generation mode in Results;
- provider name in Results;
- model name in Results;
- “No provider call was attempted” in scan Results;
- Run ID;
- format version;
- creation and completion timestamps;
- application revision;
- requested URL after a completed redirect, except in retained internal provenance;
- browser and scanner versions;
- evidence-policy version;
- readiness mode and readiness flag;
- viewport dimensions;
- locale;
- timeout;
- fresh-context, imported-state, interaction, crawling, iframe, and cleanup flags;
- contrast-profile identifier;
- raw native result labels;
- raw native check-group arrays;
- measurement-source identifiers;
- raw scanner message keys; and
- duplicate complete-coverage tables.

Removing these elements from the visible UI does not authorize deleting them from `run.json`, validators, tests of canonical completeness, or future diagnostic tooling.

## Responsive behavior

### Wide layout

- Keep the overview above the workspace.
- Place the unified grouped item list in a bounded left column and the selected evidence in a flexible right column.
- Do not make the evidence column narrower merely to preserve equal columns.

### Narrow layout and 200% browser zoom

- Use one column in DOM and visual order: overview, unified Findings list, selected evidence.
- Stack the three overview groups vertically or in a wrapping row without horizontal scrolling.
- Keep full URLs, locators, colors, ratios, and evidence values readable through wrapping or controlled word breaking.
- Do not truncate evidence, hide it behind hover, or require horizontal page scrolling.
- Keep the selected item and its evidence in the same sequential page flow without adding a return action.

## Accessibility behavior

- Use one page-level heading and a logical heading hierarchy.
- Use semantic groups for each supported check and programmatically associate group labels with their items and counts.
- Make each Finding and manual-review item keyboard reachable with a stable accessible name. Each button name includes its human label, affected-element summary, and **Needs manual review** when applicable. The native button semantics communicate that the whole card is actionable; do not add a redundant action phrase to the name.
- Announce analysis start, failure, completion totals, valid zero, and item selection through one shared live-status pattern without moving focus.
- A visible lifecycle-status field is not required when the completion or failure state is already communicated by the result content and announcement.
- Clearly indicate the selected item programmatically and visually.
- Keep keyboard focus on the selected item when its evidence appears so the user retains their place in the list.
- Never rely only on color, position, or item count for meaning.
- Keep external target and scanner strings inert; never render them as executable markup.

## Visual hierarchy

- Use one compact surface for the Analyze form and one visually dominant surface for Results.
- Keep the Analyze heading, controls, and action close enough to scan as one task. Avoid large empty gaps and long explanatory paragraphs.
- Use inline feedback only for validation, a missing Local model, a missing Groq API URL, or operation failure.
- Separate the form from Results with spacing and hierarchy rather than another full-width divider or repeated completion message.
- Give the total Finding count the strongest emphasis inside Results.
- Use restrained group panels for the three rule counts; do not style them as analytics dashboard metrics.
- Use a small scanner-evidence label, plain definition lists, color samples, and readable units to organize evidence.
- Do not use leading accent borders on the Results overview, selected evidence content, or **Needs manual review** tag. Use background, spacing, headings, text weight, and the card boundary to establish hierarchy.
- Prefer whitespace and headings over nested cards and repeated full-width blue disclosure borders.
- Reserve Signal Blue for the primary action, links, focus, and selected item.
- Use caution styling for **Needs manual review**, accompanied by its exact text and an icon only when the icon adds meaning.

## Information architecture

```text
Analyze a page
  Target URL
  Generation mode
  Validation or missing-configuration message, only when needed
  Analyze
  Operation message, when present

Results
  Analyzed page
  Scope and non-certification limitation
  Results overview
    Total findings
    Total manual reviews
    Image alternatives
    Form labels
    Color contrast
  Findings
    Grouped automated findings and tagged manual-review items
    Selected evidence
```

## Explicit non-goals

This contract does not add a score, dashboard, chart, filter, sort, search, bulk action, page preview, code editor, remediation action, provider call, run history, Run ID entry, deep link, reload restoration, settings page, model manager, export, dark theme, or new dependency.

It also does not define the later retrieved-guidance, generation, abstention, human-review, or comparison presentations. Those regions remain owned by their future roadmap tasks and must reuse the evidence-first hierarchy without being prebuilt here.

## Related guidance

- [UI design documentation](README.md)
- [UI visual foundations](VISUAL_FOUNDATIONS.md)
- [Evidence-oriented interface requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export)
- [Application accessibility requirements](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md)
- [M1-04 roadmap task](../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results)
