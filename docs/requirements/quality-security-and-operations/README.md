# Quality, security, and operations requirements

## Authority and use

This family index routes the canonical quality, security, and operational requirement modules in the baseline governed by [Project requirements](../../PROJECT_REQUIREMENTS.md). It owns no identified requirement row or status. Each requirement is canonical only in the focused module listed below, and this family describes planned behavior rather than implementation.

## Requirement modules

| Module | Canonical IDs | Responsibility |
| --- | --- | --- |
| [Application accessibility](APPLICATION_ACCESSIBILITY.md) | `REQ-A11Y-001` through `REQ-A11Y-010` | Accessibility requirements for A11y Evidence Lab's own interface, complete result list, and supported workflows. |
| [Privacy and security](PRIVACY_AND_SECURITY.md) | `REQ-SEC-001` through `REQ-SEC-027` | Data minimization, trusted developer-input limitations, provider credentials and egress, the minimal loopback/renderer boundary, and explicitly Deferred production hostile-target controls. |
| [Reliability, reproducibility, and operations](RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) | `REQ-QUAL-001` through `REQ-QUAL-020` | Accepted minimal persistence, local diagnostics, proportional runtime validation, practical capacity, complete scan collection, simple timeout/cleanup, and sequential selected-finding behavior, plus explicitly Deferred hostile-target, performance, support, packaging, and release controls. |

Read only the focused module that owns the task. When a concern crosses these boundaries, load each affected module rather than treating this index as a substitute for its requirement rows.

## Documentation navigation

- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
