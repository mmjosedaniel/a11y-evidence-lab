# Generation provider and model lifecycle requirements

## Authority and use

This family index routes the canonical provider-execution, developer-managed local runtime/model prerequisite, and deferred installed-product lifecycle modules in the baseline governed by [Project requirements](../../PROJECT_REQUIREMENTS.md). It owns no identified requirement row or status. Each requirement is canonical only in the focused module listed below, and this family describes planned behavior rather than implementation.

## Requirement modules

| Module | Canonical IDs | Responsibility |
| --- | --- | --- |
| [Generation provider execution](GENERATION_PROVIDER_EXECUTION.md) | `REQ-LLM-001` through `REQ-LLM-021` | Provider-neutral Local/Groq execution, explicit global mode selection with validation-only initial feedback, provider-relevant later disclosure, per-finding calls, role-specific Local data flow, attempt-time validation, structured output, no fallback, and deferred provider expansion or qualification. |
| [Installation and model lifecycle](INSTALLATION_AND_MODEL_LIFECYCLE.md) | `REQ-INST-001` through `REQ-INST-017` | Developer-run local service, developer-managed Ollama/model prerequisites, attempt-time availability checks, and deferred application-managed acquisition, installer, packaging, and artifact lifecycle. |

Read only the focused module that owns the task. Provider execution and developer-managed runtime/model prerequisites remain distinct authorities even when a workflow change affects both.

[OD-022](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) records the cross-cutting portfolio simplification, [ADR-0020](../../architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md) owns the accepted MVP setup and provider-check boundary, and [ADR-0023](../../architecture/decisions/ADR-0023-local-mode-data-boundary.md) owns the Local-mode data boundary.

## Documentation navigation

- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
