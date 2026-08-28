# Quality, security, and operations requirements

## Authority and use

This family index routes the canonical quality, security, and operational requirement modules in the baseline governed by [Project requirements](../../PROJECT_REQUIREMENTS.md). It owns no identified requirement row or status. Each requirement is canonical only in the focused module listed below, and this family describes planned behavior rather than implementation.

## Requirement modules

| Module | Canonical IDs | Responsibility |
| --- | --- | --- |
| [Application accessibility](APPLICATION_ACCESSIBILITY.md) | `REQ-A11Y-001` through `REQ-A11Y-010` | Accessible interaction for URL entry, the complete result list, and the selected-finding workflow, with compact automated, keyboard, and screen-reader smoke coverage rather than an exhaustive matrix. |
| [Privacy and security](PRIVACY_AND_SECURITY.md) | `REQ-SEC-001` through `REQ-SEC-027` | Data minimization, trusted developer-input limitations, provider credentials and egress, the role-specific Local-generation and embedding data boundary, the minimal loopback/renderer boundary, and explicitly Deferred production hostile-target controls. |
| [Reliability, reproducibility, and operations](RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) | `REQ-QUAL-001` through `REQ-QUAL-020` | One canonical `run.json` aggregate, local diagnostics, proportional runtime validation, practical capacity, complete scan collection, simple timeout/cleanup, and sequential selected-finding behavior, plus explicitly Deferred production controls. |

Read only the focused module that owns the task. When a concern crosses these boundaries, load each affected module rather than treating this index as a substitute for its requirement rows.

[OD-022](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) records the cross-cutting portfolio simplification, [ADR-0021](../../architecture/decisions/ADR-0021-single-file-run-aggregate.md) owns the accepted MVP persistence boundary, and [ADR-0023](../../architecture/decisions/ADR-0023-local-mode-data-boundary.md) owns the Local-mode data boundary.

## Documentation navigation

- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
