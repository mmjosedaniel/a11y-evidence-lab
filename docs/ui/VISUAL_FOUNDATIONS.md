# UI visual foundations

- **Status:** Defined reversible design intent; not implemented
- **Last reviewed:** 2026-08-29
- **UI documentation index:** [UI design documentation](README.md)

## Document role

This document defines the minimum visual direction for planning and future implementation. It does not create a product requirement, accept an architecture or dependency, define a component library, or prove that these styles have been implemented. The applicable requirements, ADRs, roadmap task, and derived specifications remain controlling.

## Visual direction

Use one restrained light direction named **Evidence Light**. Neutral surfaces keep dense evidence readable; Signal Blue identifies primary interaction; four muted source accents help users distinguish scanner evidence, curated guidance, AI interpretation, and human-authored work. Status colors are secondary cues and never imply that a page is accessible or compliant.

The interface should feel like a focused engineering workbench: clear hierarchy, compact metadata, visible provenance, and generous reading space. Prefer borders and spacing over nested cards. Avoid gradients, glass effects, glow, decorative charts, oversized hero text, pill overload, and motion without a task-specific purpose.

Only this light direction is specified for the MVP. A dark theme and theme switcher require a later demonstrated need and complete contrast validation; they are not implementation prerequisites.

## Color palette

### Core colors

| Token | Visual name | Value | Intended use |
| --- | --- | ---: | --- |
| `canvas` | Field White | `#F5F7FA` | Application background |
| `surface` | Paper | `#FFFFFF` | Forms, result regions, and detail surfaces |
| `surface-muted` | Lab Mist | `#EEF2F6` | Subtle grouped context and read-only metadata |
| `border-subtle` | Trace Line | `#C8D1DC` | Decorative separators only; it does not carry required control or state meaning |
| `border-control` | Instrument Steel | `#68768B` | Required input and control boundaries |
| `text-primary` | Evidence Ink | `#172033` | Headings, body text, labels, and essential values |
| `text-secondary` | Slate Note | `#4A586D` | Helper text, secondary metadata, and limitations |
| `action` | Signal Blue | `#1457C8` | Primary action, links, selected control, and focus ring |
| `action-hover` | Deep Signal | `#0E47A1` | Hover or active primary action |
| `on-action` | Clear White | `#FFFFFF` | Text and icons on action surfaces |

### Information-source colors

Use these pairs for a small leading border, icon, source label, or restrained section tint. Do not place every layer in a large saturated panel.

| Layer | Ink | Surface | Meaning |
| --- | ---: | ---: | --- |
| Deterministic evidence | `#0B5CAD` | `#EAF2FB` | Scanner-observed facts and measurements |
| Curated guidance | `#00695C` | `#E8F5F2` | Retrieved W3C passages and citations |
| AI interpretation | `#5B3DB5` | `#F1EDFF` | Model-generated explanation and proposal |
| Human-authored work | `#8A3F12` | `#FFF0E7` | Reviewer edits, judgment, notes, and decision |

### Outcome and feedback colors

| State family | Ink | Surface | Intended use |
| --- | ---: | ---: | --- |
| Positive completion | `#176B3A` | `#EAF6EE` | Saved decision, completed action, or `resolved` label when accompanied by its exact text and limitation |
| Caution or unresolved | `#7A4A00` | `#FFF4DB` | ScannerReviewObservation, abstention, incomplete support, `inconclusive`, or manual attention |
| Failure or destructive action | `#A52222` | `#FDECEC` | Failed operation, validation error, rejection emphasis, or destructive control |

### Color-use rules

- Keep most screen area in `canvas`, `surface`, and `surface-muted`; semantic colors should orient the user, not decorate the page.
- Use Signal Blue for the highest-emphasis action in a region. Links remain underlined, and selected controls have text or programmatic selection in addition to color.
- Use `border-control` for meaningful form boundaries. `border-subtle` is decorative and must not be the only visible boundary of a control.
- Use a 3-pixel Signal Blue focus ring with a visible offset. Do not remove the browser focus indicator until the replacement is demonstrably visible.
- Pair every source color with its source label. Pair every status color with concise text and, where useful, an icon whose accessible meaning is also available as text.
- Treat abstention as application-authored caution, not AI output. Treat provider failure as failure, not insufficient evidence.
- A `resolved` comparison may use positive styling only with the word `resolved`, its supporting evidence, and the limitation that automated change does not prove accessibility or conformance.
- Recalculate contrast for any new opacity, overlay, disabled state, color combination, or theme. Token validity does not make arbitrary pairings accessible.

## Contrast validation

The documented foreground/background pairs were calculated with the WCAG relative-luminance contrast formula. The review thresholds used here are `4.5:1` for normal text and `3:1` for large text or meaningful non-text control boundaries. These checks support the palette choice; they do not claim that an unimplemented application conforms to WCAG.

| Foreground / background | Contrast | Planned use |
| --- | ---: | --- |
| `text-primary` / `canvas` | `15.16:1` | Primary reading text |
| `text-secondary` / `surface` | `7.22:1` | Secondary text |
| `text-secondary` / `surface-muted` | `6.42:1` | Muted metadata |
| `on-action` / `action` | `6.51:1` | Primary control text |
| `on-action` / `action-hover` | `8.63:1` | Hovered primary control text |
| Deterministic-evidence ink / surface | `5.91:1` | Source label and text |
| Curated-guidance ink / surface | `5.91:1` | Source label and text |
| AI-interpretation ink / surface | `6.58:1` | Source label and text |
| Human-authored ink / surface | `6.74:1` | Source label and text |
| Positive-completion ink / surface | `5.91:1` | Status label and text |
| Caution ink / surface | `6.85:1` | Status label and text |
| Failure ink / surface | `6.45:1` | Status label and text |
| `border-control` / `surface` | `4.61:1` | Meaningful control boundary |
| `action` / `canvas` | `6.06:1` | Focus ring and interactive emphasis |

## Typography

Use the platform system-font stack so the MVP adds no font download, licensing task, or rendering dependency:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

- Default body text should be `1rem` with approximately `1.5` line height.
- Essential labels and controls should not be smaller than `0.875rem`.
- Use a compact three-level heading hierarchy; do not add a decorative display face or oversized hero.
- Prefer weight, spacing, and heading structure before adding another color or container.
- Keep long explanations and guidance passages near `65ch` to `75ch` where layout permits.
- Preserve normal sentence case for headings, labels, statuses, and actions.

Exact type tokens remain task-local implementation literals until a rendered-UI roadmap task needs them.

## Layout and shape

- Use one centered content region with enough width for a results list and readable selected-finding detail; avoid a dashboard grid.
- Let evidence sections grow vertically. Do not truncate citations, evidence, limitations, or reviewer content to preserve a fixed card height.
- On wide layouts, use one bounded results column and one flexible detail column. On narrow layouts, stack them in DOM and reading order rather than hiding either behind hover-only behavior.
- Use a small spacing rhythm based on `0.25rem`, with ordinary gaps of `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, and `2rem`. This is guidance, not a design-token package.
- Use restrained corner radii around `0.375rem` to `0.5rem`. Reserve stronger boundaries for selection, focus, errors, and source separation rather than nesting multiple card shells.
- Use motion only when an applicable interaction requires it, respect reduced-motion preferences, and add no animation dependency for the MVP.

Exact container width, breakpoint, route layout, and component abstractions remain reversible implementation choices. They must be verified in a real browser when the owning roadmap task is implemented.

## References

- [UI design documentation](README.md)
- [Application accessibility requirements](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md)
- [Evidence-oriented interface requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export)
- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [WCAG 2.2: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
