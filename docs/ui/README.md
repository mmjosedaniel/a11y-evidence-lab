# UI design documentation

- **Status:** Reversible design intent; M1-04 candidate implementation under verification
- **Last reviewed:** 2026-08-31
- **Visual direction:** [Visual foundations](VISUAL_FOUNDATIONS.md)

## Document role

This directory describes the smallest coherent interface for the accepted portfolio MVP. It owns reversible presentation guidance only: information hierarchy, minimum visible regions, and visual foundations. It does not create product scope, accept architecture, select packages or components, define a second workflow state model, authorize implementation, or prove that any interface exists.

The identified rows in the [project requirements](../PROJECT_REQUIREMENTS.md) and their focused modules remain authoritative. [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) owns React's presentation-only boundary, the [development roadmap](../DEVELOPMENT_ROADMAP.md) owns implementation order, and the [documentation-only Gherkin specifications](../specs/README.md) provide derived behavior examples. If this guidance conflicts with one of those sources, the authoritative source controls and this document must be reconciled.

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
| Analysis setup | One non-authenticated public HTTPS URL field, a concise notice that the developer is responsible for choosing a permitted target they are willing to trust and that hostile, private, and authenticated targets are unsupported, one explicit Local-or-Groq selection, Local visibly recommended, the applicable run-level provider disclosure, and one **Analyze** action. Selection alone performs no probe or provider call. | Before a new analysis |
| Run context and status | Normalized analyzed page identity, immutable selected provider and exact model, exact `image-alt`, `label`, and `color-contrast` coverage, parent state, trusted-input limitation, and the non-certification limitation. | During and after a run |
| Complete results | Every Finding grouped by supported rule, with stable label, target summary, individual state, and detail action. Native `incomplete` ScannerReviewObservations use a separate, explicitly named group. A valid zero appears only after complete three-rule coverage. A failed or coverage-incomplete scan remains in the run-status region and never publishes this region as a complete result. | Only after a complete scan |
| Selected-finding workspace | Finding identity and state followed by deterministic evidence, retrieved guidance and citations, evidence sufficiency, actual provider-call provenance when one exists, and the applicable proposal, abstention, or failure branch. Only one FindingWorkflow is selected at a time; sibling states remain visible and unchanged. | After a Finding is selected |
| Human decision | The original AI proposal, confidence and uncertainty, assumptions, blocking pre-acceptance judgment, non-blocking post-change reminder, support confirmation, and one approve, edit-and-accept, or reject path. Reviewer-authored content and the final decision remain distinct from the proposal. | Only for a validated proposal |
| Comparison | Baseline and later references, pair comparability, target-match disposition when applicable, before/after deterministic evidence, outcome, rationale, limitations, and follow-up checks. Proposal or review information may appear only as context. | After an intentional later scan and comparison |

A retained run may be reopened through the smallest route owned by the applicable implementation task. A run-history dashboard, project browser, or generalized work queue is not required.

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
