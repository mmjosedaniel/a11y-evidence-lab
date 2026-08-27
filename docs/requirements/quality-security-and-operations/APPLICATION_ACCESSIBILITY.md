# Application accessibility requirements

## Authority and use

This document is a focused canonical module within [Quality, security, and operations requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Accessibility of A11y Evidence Lab

WCAG 2.2 Level AA is the proposed design and internal verification target for the application's own web interface. This target does not turn the product into a certification service and must not be presented as third-party certification.

[OD-020](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope), as narrowed by [OD-021](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp), replaces the synthetic single-finding runtime with one trusted operator-supplied public-page scan and a complete variable Finding list. The requirements below therefore apply to URL entry and its limitation notice, scan status, the grouped Findings and ScannerReviewObservations, one selected FindingWorkflow, individual review, and comparison. They do not require rendering the scanned page inside the application.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-A11Y-001 | URL entry and the trusted-input limitation notice, global provider-mode selection, the **Analyze** action, complete-results navigation, one FindingWorkflow selection, evidence/citation inspection, individual review, manual checks, retry, and rescan comparison must be operable with a keyboard, with logical focus order, visible focus, and no keyboard trap. | Must | Proposed | Manual keyboard test |
| REQ-A11Y-002 | Page identity and supported-use limitation, exact three-rule coverage, grouped Findings, distinct ScannerReviewObservations, individual workflow states, review controls, validation, progress, and status changes must be exposed meaningfully to assistive technologies. | Must | Proposed | Screen-reader test |
| REQ-A11Y-003 | Text, evidence layers, citations, tables, differences, and status indicators must meet applicable contrast, reflow, zoom, and non-color requirements. | Must | Proposed | Automated and manual review |
| REQ-A11Y-004 | Dynamic scan progress, valid-zero results, coverage-incomplete/failed scans, FindingWorkflow selection, provider-call state, errors, abstentions, saved decisions, and comparison results must be announced without disrupting focus or causing a user to lose their place in the results list. | Must | Proposed | Screen-reader test |
| REQ-A11Y-005 | Deliberately inaccessible fixture content, if rendered for controlled evaluation, must be isolated and preceded by a clear warning so that it does not make the surrounding application unusable. Runtime public pages are not required to be embedded in the application interface. | Must | Proposed | Manual review |
| REQ-A11Y-006 | MVP interface review should combine automated checks, manual keyboard review, and one documented screen-reader smoke path from trusted public-URL entry through the grouped result list, one selected FindingWorkflow, individual review, and comparison. This remains separate from the compact generation manifest and does not establish a browser, assistive-technology, support, or release matrix. | Must | Proposed | Accessibility smoke-path review |
| REQ-A11Y-007 | MVP usability evaluation should include disabled participants. If it is deferred, the reason, recruitment attempt, residual risk, and planned follow-up must be recorded. | Should | Proposed | User evaluation or approved deferral |
| REQ-A11Y-008 | Interface validation must test the state perceived by users, including accessible names, grouping, selected-item state, announcements, focus, disabled and busy states, progress, valid-zero versus failed-scan meaning, error recovery, provider-invocation availability, and individual action availability. DOM presence, internal React state, a Finding count, or a visual screenshot alone is insufficient evidence. | Must | Proposed | Assistive-technology and interaction-state tests |
| REQ-A11Y-009 | The complete result view must expose an accessible heading and summary, rule-based grouping, stable accessible names for every Finding and ScannerReviewObservation, each item's rule/target summary and individual state, and a programmatically determinable indication of the one selected FindingWorkflow. The interface must not rely on color, position, item count, or visual grouping alone, and it must not silently omit an item from keyboard or assistive-technology navigation. | Must | Proposed | Multi-item keyboard and screen-reader review |
| REQ-A11Y-010 | Moving between the grouped list and one finding-detail workspace must preserve a predictable return location and clearly announce the selected Finding, its global provider context, whether a ProviderInvocation exists, and changes to that Finding's state without implying that sibling findings changed. | Must | Proposed | Focus-return and announcement review |

## Documentation navigation

- Up: [Quality, security, and operations requirements](README.md)
- Next: [Privacy and security requirements](PRIVACY_AND_SECURITY.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
