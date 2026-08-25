# Quality, security, and operations requirements

## Authority and use

This family index routes the canonical quality, security, and operational requirement modules in the baseline governed by [Project requirements](../../PROJECT_REQUIREMENTS.md). It owns no identified requirement row or status. Each requirement is canonical only in the focused module listed below, and this family describes planned behavior rather than implementation.

## Requirement modules

| Module | Canonical IDs | Responsibility |
| --- | --- | --- |
| [Application accessibility](APPLICATION_ACCESSIBILITY.md) | `REQ-A11Y-001` through `REQ-A11Y-008` | Accessibility requirements for A11y Evidence Lab's own interface and supported workflows. |
| [Privacy and security](PRIVACY_AND_SECURITY.md) | `REQ-SEC-001` through `REQ-SEC-021` | Data minimization, trust boundaries, local-only behavior, credentials, egress, renderer isolation, and security controls. |
| [Reliability, reproducibility, and operations](RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) | `REQ-QUAL-001` through `REQ-QUAL-018` | First-slice reliability and reproducibility, plus trigger-gated concurrency, runtime-contract, lifecycle, inventory, and benchmark controls for later claims. |

Read only the focused module that owns the task. When a concern crosses these boundaries, load each affected module rather than treating this index as a substitute for its requirement rows.

## Documentation navigation

- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
