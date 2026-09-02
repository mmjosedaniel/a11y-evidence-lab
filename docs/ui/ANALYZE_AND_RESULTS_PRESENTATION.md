# Analyze and results presentation

- **Status:** Proposed follow-up UI baseline; not implemented
- **Last reviewed:** 2026-09-01
- **Scope:** Analysis input and deterministic scan results only

## Document role

This document defines the intended visible content, order, hierarchy, and responsive behavior for a later revision of the Analyze and Results interface. It is based on review of the current rendered M1-04 interface. It does not change source code, tests, canonical run data, requirements, roadmap status, or implementation authorization.

The proposal deliberately removes internal execution metadata from the visible results experience and replaces the current repeated summary, coverage, and technical-detail regions with one concise overview and an evidence-first finding workspace. Canonical data may remain persisted for validation, provenance, downstream work, and diagnostics even when this document says it should not appear in the primary interface.

Before implementation, the owning task must reconcile this proposal with requirements that currently require a visible trusted-input limitation, mode disclosure, persistent provider/model context, lifecycle state, exact scan configuration, coverage, and provider-call announcements. In particular, `REQ-LLM-002`, `REQ-LLM-020`, `REQ-INST-004`, `REQ-INST-005`, `REQ-INST-017`, `REQ-UX-003`, `REQ-UX-004`, `REQ-UX-011`, `REQ-UX-012`, `REQ-A11Y-002`, `REQ-A11Y-009`, `REQ-A11Y-010`, SPEC-001, and the M1-04 roadmap description must be reviewed together. The proposed Groq API URL message also differs from the current fixed-adapter and credential model, while a user-configurable remote URL remains Deferred. This file records the target presentation; it does not silently override those authorities.

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
4. **Findings** grouped by the three supported checks
5. **Selected finding evidence**
6. **Needs manual review** for incomplete scanner observations

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

Show all Findings in one list grouped under these user-facing headings:

1. **Image alternatives**
2. **Form labels**
3. **Color contrast**

Keep all three groups in this order. If a group has no Findings, show **No findings in this check.** Do not remove the group or imply that the entire page passed.

### Finding item content

Each selectable item shows only:

1. A stable, human-readable label such as **Image alternative issue 1**, **Form label issue 1**, or **Color contrast issue 1**.
2. A concise affected-element summary:
   - image alternative: **Image element**;
   - form label: element and input type, such as **Input · text**;
   - color contrast: foreground color, background color, font size, and weight.
3. The action text **View evidence**, or an equivalent whole-item button with that accessible purpose.
4. A programmatic selected state that does not rely only on color.

Do not show the internal Finding ID as the main title, the rule ID, `unprocessed`, provider information, model information, or provider-call information in each list item.

## Selected finding evidence

The selected detail should make deterministic evidence the main content. It must not place all evidence behind a disclosure named **Technical scanner evidence**.

### Elements shown for every Finding

Show these elements in this order:

1. The same human-readable Finding label used in the list.
2. A one-sentence deterministic explanation of what was detected.
3. **Affected element** with the concise target summary.
4. **Where on the page** with the retained structural locator in code styling when available. If it is unavailable, show **Page location unavailable** with the bounded reason in plain language.
5. **Evidence** with the rule-specific fields below.
6. **Back to findings** on stacked or narrow layouts. It returns focus to the selected list item.

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

Show **Shadow color** only when it is available and materially affects the measurement. The deterministic explanation should compare the measured and required ratios, for example: **Measured contrast is 4.48:1; this text requires 4.5:1.**

Do not show `axe-core`, raw message keys such as `bgImage`, or `Any`, `All`, and `None` check groups in the primary interface.

## Needs manual review

Rename **Scanner-review observations** to **Needs manual review**.

Show a short introduction: **The scanner could not determine these results automatically. Review each item manually.**

Each observation appears as a separate item with:

1. A stable label such as **Image alternative review 1**.
2. The user-facing check name.
3. The affected-element summary.
4. A plain-language reason, such as **Alternative text could not be inspected**, **Label information was withheld**, or **Background imagery prevented a reliable contrast result**.
5. **Where on the page** when a locator is available.
6. The same relevant rule-specific evidence fields defined for Findings.

An observation may use one native disclosure when needed to reduce page length, but its summary must describe the review task in plain language. Do not nest another **Technical scanner evidence** disclosure inside it.

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

## Information omitted from the primary interface

The following data must not appear in the proposed Analysis results interface:

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
- Place the grouped Findings list in a bounded left column and the selected evidence in a flexible right column.
- Keep **Needs manual review** below the Finding workspace.
- Do not make the evidence column narrower merely to preserve equal columns.

### Narrow layout and 200% browser zoom

- Use one column in DOM and visual order: overview, Findings list, selected evidence, manual-review items.
- Stack the three overview groups vertically or in a wrapping row without horizontal scrolling.
- Keep full URLs, locators, colors, ratios, and evidence values readable through wrapping or controlled word breaking.
- Do not truncate evidence, hide it behind hover, or require horizontal page scrolling.
- Preserve a visible **Back to findings** action after selected evidence.

## Accessibility behavior

- Use one page-level heading and a logical heading hierarchy.
- Use semantic groups for each supported check and programmatically associate group labels with their items and counts.
- Make each Finding and manual-review item keyboard reachable with a stable accessible name.
- Announce analysis start, failure, completion totals, valid zero, and Finding selection through one shared live-status pattern without moving focus.
- A visible lifecycle-status field is not required when the completion or failure state is already communicated by the result content and announcement.
- Clearly indicate the selected Finding programmatically and visually.
- Preserve a predictable return location when leaving selected evidence.
- Never rely only on color, position, or item count for meaning.
- Keep external target and scanner strings inert; never render them as executable markup.

## Visual hierarchy

- Use one compact surface for the Analyze form and one visually dominant surface for Results.
- Keep the Analyze heading, controls, and action close enough to scan as one task. Avoid large empty gaps and long explanatory paragraphs.
- Use inline feedback only for validation, a missing Local model, a missing Groq API URL, or operation failure.
- Separate the form from Results with spacing and hierarchy rather than another full-width divider or repeated completion message.
- Give the total Finding count the strongest emphasis inside Results.
- Use restrained group panels for the three rule counts; do not style them as analytics dashboard metrics.
- Use a small scanner-evidence label, a leading evidence-color border, plain definition lists, color samples, and readable units to organize evidence.
- Prefer whitespace and headings over nested cards and repeated full-width blue disclosure borders.
- Reserve Signal Blue for the primary action, links, focus, and selected item.
- Use caution styling for **Needs manual review**, accompanied by its exact text and an icon only when the icon adds meaning.

## Proposed information architecture

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
    Grouped finding list
    Selected finding evidence
  Needs manual review
    Observation list and relevant evidence
```

## Explicit non-goals

This proposal does not add a score, dashboard, chart, filter, sort, search, bulk action, page preview, code editor, remediation action, provider call, run history, Run ID entry, deep link, reload restoration, settings page, model manager, export, dark theme, or new dependency.

It also does not define the later retrieved-guidance, generation, abstention, human-review, or comparison presentations. Those regions remain owned by their future roadmap tasks and must reuse the evidence-first hierarchy without being prebuilt here.

## Related guidance

- [UI design documentation](README.md)
- [UI visual foundations](VISUAL_FOUNDATIONS.md)
- [Evidence-oriented interface requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export)
- [Application accessibility requirements](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md)
- [M1-04 roadmap task](../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results)
