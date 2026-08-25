# Application accessibility requirements

## Authority and use

This document is a focused canonical module within [Quality, security, and operations requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Accessibility of A11y Evidence Lab

WCAG 2.2 Level AA is the proposed design and internal verification target for the application's own web interface. This target does not turn the product into a certification service and must not be presented as third-party certification.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-A11Y-001 | All core workflows must be operable with a keyboard, with logical focus order, visible focus, and no keyboard trap. | Must | Proposed | Manual keyboard test |
| REQ-A11Y-002 | Structure, names, descriptions, review controls, validation, progress, and status changes must be exposed meaningfully to assistive technologies. | Must | Proposed | Screen-reader test |
| REQ-A11Y-003 | Text, evidence layers, citations, tables, differences, and status indicators must meet applicable contrast, reflow, zoom, and non-color requirements. | Must | Proposed | Automated and manual review |
| REQ-A11Y-004 | Dynamic progress, errors, abstentions, saved decisions, and comparison results must be announced without disrupting the user's focus. | Must | Proposed | Screen-reader test |
| REQ-A11Y-005 | Deliberately inaccessible fixture content must be isolated and preceded by a clear warning so that it does not make the surrounding application unusable. | Must | Proposed | Manual review |
| REQ-A11Y-006 | MVP interface review should combine automated checks, manual keyboard review, and one documented screen-reader smoke path through the core review and comparison flow. This check is separate from the compact generation manifest accepted under OD-009 and does not establish a browser, assistive-technology, support, or release matrix. Formal matrix qualification remains deferred under OD-017. | Must | Proposed | Accessibility smoke-path review |
| REQ-A11Y-007 | MVP usability evaluation should include disabled participants. If it is deferred, the reason, recruitment attempt, residual risk, and planned follow-up must be recorded. | Should | Proposed | User evaluation or approved deferral |
| REQ-A11Y-008 | Interface validation must test the state perceived by users, including accessible names, announcements, focus, disabled and busy states, progress, error recovery, and action availability. DOM presence, internal React state, or a visual screenshot alone is insufficient evidence. | Must | Proposed | Assistive-technology and interaction-state tests |

## Documentation navigation

- Up: [Quality, security, and operations requirements](README.md)
- Next: [Privacy and security requirements](PRIVACY_AND_SECURITY.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
