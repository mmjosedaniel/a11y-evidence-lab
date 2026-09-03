# UI design documentation

- **Status:** M1-04 Analyze/Results presentation is implemented and verified through OD-027; later workflow regions remain planning guidance
- **Last reviewed:** 2026-09-02
- **Analyze and Results contract:** [Analyze and results presentation](ANALYZE_AND_RESULTS_PRESENTATION.md)
- **Visual direction:** [Visual foundations](VISUAL_FOUNDATIONS.md)

## Document role

This directory describes the smallest coherent interface for the accepted portfolio MVP. [Analyze and results presentation](ANALYZE_AND_RESULTS_PRESENTATION.md) is the accepted M1-04 visible contract through OD-027. Other material in this directory remains reversible guidance for information hierarchy, minimum visible regions, and visual foundations. This directory does not select packages or components, define a second workflow state model, or prove that an interface passes its verification gates.

The identified rows in the [project requirements](../PROJECT_REQUIREMENTS.md) and their focused modules remain authoritative. [OD-027](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-027--simplify-analysis-and-results-presentation) reconciles the Analyze/Results presentation contract with those authorities. [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) owns React's presentation-only boundary, the [development roadmap](../DEVELOPMENT_ROADMAP.md) owns implementation order, and the [documentation-only Gherkin specifications](../specs/README.md) provide derived behavior examples.

## UI objective

The interface should make the evidence chain easier to inspect than a generic chatbot would. A developer should be able to answer, in order:

1. Which page and exact rules were analyzed?
2. What did the deterministic scanner observe?
3. Which curated guidance was retrieved, and was it sufficient?
4. Was a model called, and what did it propose or why did the application abstain?
5. What did the reviewer decide?
6. What changed in a later deterministic scan, and what does that comparison not prove?

The design should remain quiet, evidence-dense, and operational. It should not resemble a marketing landing page, chat product, analytics dashboard, or accessibility scorecard.

## Minimum MVP composition

Use one responsive application shell. On wider layouts, the complete results list and one selected-finding detail may appear side by side. On narrower layouts, present them in a logical single-column sequence with a predictable way to return to the selected list item. Exact routes, breakpoints, and component boundaries remain implementation choices.

| Region | Minimum content and behavior | Appears when |
| --- | --- | --- |
| Analysis setup | The compact [Analyze and results presentation](ANALYZE_AND_RESULTS_PRESENTATION.md): one public HTTPS URL field, one initially unselected Local-or-Groq group with Local visibly recommended, validation or an already-known missing-configuration message only when applicable, and one **Analyze** action. Selection and Analyze perform no provider probe or call. | Before a new analysis |
| Results overview | Normalized analyzed page identity, one exact-three-check/non-certification limitation, one prominent Finding total, an optional manual-review total, and complete user-facing counts for Image alternatives, Form labels, and Color contrast. | Only after a complete scan |
| Complete results | Every Finding grouped by the three user-facing checks with a stable human-readable label, concise affected-element summary, selection action, and programmatic selected state. Native `incomplete` ScannerReviewObservations appear under **Needs manual review**. A valid zero appears only after complete three-rule coverage. | Only after a complete scan |
| Selected-finding workspace | Human-readable Finding identity, deterministic explanation, affected element, page location, and direct rule-specific evidence. Retrieved guidance, citations, evidence sufficiency, provider-relevant disclosure/provenance, and proposal, abstention, or failure branches are added only by their later owning tasks. Only one FindingWorkflow is selected at a time; sibling states remain visible and unchanged. | After a Finding is selected |
| Failed analysis | Requested page, **Analysis could not be completed**, one safe stage-specific explanation, and any actionable persistence or cleanup uncertainty. It never presents partial success or a completed-results overview. | Only after failure |
| Human decision | The original AI proposal, confidence and uncertainty, assumptions, blocking pre-acceptance judgment, non-blocking post-change reminder, support confirmation, and one approve, edit-and-accept, or reject path. Reviewer-authored content and the final decision remain distinct from the proposal. | Only for a validated proposal |
| Comparison | Baseline and later references, pair comparability, target-match disposition when applicable, before/after deterministic evidence, outcome, rationale, limitations, and follow-up checks. Proposal or review information may appear only as context. | After an intentional later scan and comparison |

Retained-run navigation is Deferred until after the portfolio MVP through `REQ-UX-014` and OD-026. The MVP provides no manual Run ID field, reload restoration, deep-link loading, run-history dashboard, project browser, or generalized work queue. Durable service-owned evidence remains available to later selected-Finding and comparison work.

## Evidence-layer presentation

Use explicit headings and source labels before color. Preserve this reading order inside a selected Finding whenever the layer exists:

| Layer | Required distinction |
| --- | --- |
| Deterministic evidence | Label as scanner evidence. Show rule/check identity and minimized facts as data observed by the scanner, not as an AI conclusion. |
| Curated guidance | Label as retrieved guidance. Keep passage title or section, source, version, direct citation, and retrieval status inspectable. |
| Evidence sufficiency | Show the deterministic support state separately from model confidence. A retrieval execution or integrity failure has no support state. |
| Application-authored abstention | Use an explicit “no proposal generated” treatment that explains the blocking information, confirms that no provider was called, and offers manual-investigation guidance. Do not show review controls. |
| AI proposal | Label as model-generated interpretation. Keep citations adjacent to the material claims they support and show confidence, uncertainty, assumptions, and required judgment. |
| Provider invocation | Show actual-call provenance only after a call was attempted. The run's provider label alone is configuration, not invocation evidence. |
| Human decision | Label reviewer edits, notes, judgment disposition, action, and decision time as human-authored content. Do not aggregate finding decisions into a page-level approval. |
| Comparison | Label outcomes as deterministic evidence comparison. Keep limitations visible and never translate an outcome into accessibility, compliance, certification, or remediation-causality claims. |

The semantic source colors in [Visual foundations](VISUAL_FOUNDATIONS.md) may reinforce these layers, but a heading, text label, icon, border treatment, or other non-color cue must carry the distinction.

## Essential interaction and state rules

- Project only the canonical parent states `running`, `completed`, and `failed`; do not invent a competing UI lifecycle or a progress subsystem.
- Project the canonical Finding paths: `unprocessed`, `active`, `abstained`, `proposal pending review`, `accepted`, `edited and accepted`, `rejected`, and `failed`.
- Keep ScannerReviewObservations outside the Finding lifecycle and proposal flow.
- Let the user work on one selected Finding at a time. Do not add automatic fan-out, generate-all, combined proposals, bulk decisions, queues, or parallel-workflow controls.
- Show an explicit Generate action only for an eligible selected Finding. A provider or validation failure remains visible and never produces automatic retry, mode switching, or fallback.
- Offer approve, edit-and-accept, and reject only for a validated proposal. An abstention is terminal and explanatory, not reviewable.
- Use the ordinary **Analyze** flow for a new independent run. Do not add dedicated retry, resume, cancellation, or regeneration controls.
- Make an intentional rescan available from a retained baseline Finding without requiring retrieval, generation, abstention, or review first.
- Render target, scanner, corpus, model, and reviewer strings as text rather than executable markup. Do not embed the analyzed page in the MVP interface.

## Accessibility and responsive behavior

- Use native landmarks, headings, form controls, lists, and tables where their semantics fit the content.
- Keep the URL, provider selection, Analyze action, results navigation, finding detail, review actions, and comparison operable by keyboard with visible focus and no trap.
- Use the one shared announcement pattern required by `REQ-A11Y-004` for meaningful run and finding changes without moving focus or causing the user to lose their place.
- Give the results view an accessible heading and summary, expose rule grouping programmatically, identify the selected Finding, and preserve a predictable return location.
- Support text zoom and narrow reflow without hiding, clipping, or horizontally truncating required evidence, citations, decisions, or differences.
- Never use color, position, or item count as the only way to communicate a source, state, selection, or comparison outcome.

The complete MVP verification boundary remains the automated check, keyboard smoke path, and screen-reader smoke path in [`REQ-A11Y-006`](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#accessibility-of-a11y-evidence-lab); this document adds no support matrix.

## Explicit non-goals

The MVP UI description does not add:

- chat as the primary interface;
- a score, certification badge, compliance verdict, or whole-page approval;
- a dashboard, chart, trend view, metrics panel, notifications, or activity feed;
- search, filtering, sorting, bulk actions, or generic finding management;
- an embedded page or fixture preview;
- settings, provider profiles, a model manager, model downloads, or readiness probes;
- accounts, roles, reviewer identities, assignments, comments, or audit history;
- a rich-text editor, automatic remediation, or source-code editing;
- a dark theme, theme switcher, animation system, design-system package, component catalog, Storybook workflow, mockup archive, or visual-regression service.

Add one of these only when an applicable Accepted requirement and roadmap task creates a demonstrated need.

## Documentation navigation

- [Visual foundations](VISUAL_FOUNDATIONS.md)
- [Evidence-oriented interface requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export)
- [Application accessibility requirements](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md)
- [Information and workflow lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [React UI decision](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md)
- [Development roadmap](../DEVELOPMENT_ROADMAP.md)
- [Project documentation index](../README.md)
