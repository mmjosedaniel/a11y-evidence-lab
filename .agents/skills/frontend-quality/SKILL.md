---
name: frontend-quality
description: Plan, implement, or review visible A11y Evidence Lab UI changes with reuse-first decisions, restrained evidence-oriented presentation, accessible states, and proportional real-browser evidence. Use for rendered React components, CSS, layout, visual hierarchy, responsive behavior, or visible interaction states; do not use for backend work or nonvisual frontend setup, types, data access, or routing logic.
---

# Frontend Quality

Use this skill as a narrow visual-quality overlay for a concrete, user-requested roadmap task whose prerequisites are satisfied. It does not authorize development, change task status, expand scope, or select a dependency. `AGENTS.md`, Accepted requirements and ADRs, the selected roadmap task, and its routed `SPEC-*` and `HS-*` examples always control.

## Decide whether the skill applies

Apply it only when the selected work materially changes rendered components, CSS, layout, visual hierarchy, responsive presentation, or visible interaction states. Do not activate it merely because a file belongs to the frontend. Frontend setup, generated types, service contracts, data access, routing logic without a visual contract, and backend work stay on the ordinary route.

For a task that mixes visual and nonvisual work, apply this guidance only to the visual portion without changing the Accepted roadmap boundary merely to fit the skill.

## Establish the bounded visual contract

Before material UI edits, identify in the working plan or task commentary:

- the exact roadmap task and applicable UI, accessibility, ADR, `SPEC-*`, and `HS-*` authorities;
- explicit non-goals and Deferred behavior that must remain absent;
- the canonical parent-run states (`running`, `completed`, and `failed`), applicable Finding states, and exact valid-zero, coverage-incomplete, scanner-review observation, abstention, provider-failure, review, or comparison cases owned by this task—not generic UI-only aliases or every possible future state;
- the viewport and interaction samples needed to evaluate this task without claiming a support matrix;
- the real-browser evidence needed for layout, reflow, focus, or overflow claims; and
- any prohibited new dependency, field, action, theme, effect, animation, preview, or generalized abstraction.

Ordinary layout and copy details may remain task-local implementation literals. Stop for clarification only when an unresolved choice would change product direction, an Accepted behavior, or the selected task's scope.

## Audit reuse before creating UI owners

Inspect only the relevant component, route, style, token, fixture, and test boundaries. Give every required visual element one disposition:

| Disposition | Use when |
| --- | --- |
| `REUSE_AS_IS` | An existing owner satisfies the task without modification. |
| `EXTEND` | One existing owner can satisfy it through a bounded change. |
| `EXTRACT_LOCAL` | Concrete duplication in the current task justifies one local shared artifact. |
| `CREATE` | No existing owner can satisfy the task within its responsibility. |

Search absence alone does not justify a new shared abstraction. Do not add a design system, component package, primitive layer, generalized variant API, or theme framework for hypothetical consumers. If implementation evidence invalidates a reuse disposition, reassess that disposition rather than silently expanding scope.

## Preserve an evidence-oriented visual hierarchy

- Keep analyzed-page context, scan coverage and status, the grouped results list, and one selected Finding detail easy to locate.
- Within Finding detail, keep deterministic evidence, retrieved guidance and citations, evidence sufficiency, model-generated interpretation, application-authored abstention, actual provider-call provenance, manual checks or judgments, reviewer-authored content and decision, and comparison results visually and semantically distinct.
- Prefer native landmarks, headings, lists, tables where tabular comparison is useful, restrained typography, spacing, borders, and one purposeful accent over decorative containers.
- Avoid repeated nested cards, decorative gradients, glass effects, glow, badge or pill overload, oversized hero headings, arbitrary asymmetry, floating controls, fake dashboards or metrics, decorative charts, and motion without a task-specific purpose.
- Do not invent content, data fields, controls, search, sorting, filtering, bulk actions, status categories, avatars, activity feeds, or settings merely to make a screen look complete.
- Use concise product language rather than marketing copy. Never imply certification, compliance, whole-page accessibility, automatic remediation, or provider superiority.
- Do not embed the analyzed page or deliberately inaccessible fixture content in the MVP UI.

## Implement accessible task-owned states

- Prefer semantic HTML and explicit accessible names and relationships.
- Preserve logical keyboard order, visible focus, predictable focus return, operable target sizes, sufficient contrast, text reflow and zoom, and non-color status cues where the routed requirements apply.
- Use the shared status-announcement behavior required by `REQ-A11Y-004` without moving focus or creating a progress subsystem.
- Render target, scanner, corpus, and model content as untrusted text rather than executable markup.
- Add motion only when the selected task requires it. Keep it functional, respect reduced-motion preferences, and add no animation dependency without separate authority.
- Implement every state owned by the task, but do not prebuild states or controls owned by a later milestone.

## Produce proportional evidence

Use component or route checks for observable semantics and state transitions. Use a real browser for claims that a non-browser environment cannot establish, including layout, responsive reflow, visible focus, browser navigation, rendering fallback, and horizontal overflow.

For browser evidence, record the application source or build identity, browser, viewport, deterministic state or input, interaction, and decisive result. Capture a screenshot only when it materially helps review; a screenshot is supporting point-in-time evidence, not a golden specification or substitute for behavior checks.

Follow the compact application-accessibility boundary: one automated check, one keyboard smoke path, and one screen-reader smoke path at the milestones that own them. Do not create a browser, viewport, assistive-technology, or exhaustive state matrix unless a later Accepted requirement introduces one.

## Review without expanding scope

For a material UI change, obtain an independent visual-quality review when available. Review against the accepted reuse dispositions, information hierarchy, task-owned states, accessibility authorities, named browser evidence, and explicit non-goals. Findings must cite an authority, exact path, or reproducible browser observation.

This skill does not require Storybook, a visual-regression service, a screenshot archive, image generation, a mockup pipeline, a component library, a CSS framework, or another design dependency. Add one only when the selected task and an applicable decision independently justify it.
