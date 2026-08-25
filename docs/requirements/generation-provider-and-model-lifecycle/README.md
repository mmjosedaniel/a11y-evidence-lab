# Generation provider and model lifecycle requirements

## Authority and use

This family index routes the canonical provider-execution and installed-product lifecycle requirement modules in the baseline governed by [Project requirements](../../PROJECT_REQUIREMENTS.md). It owns no identified requirement row or status. Each requirement is canonical only in the focused module listed below, and this family describes planned behavior rather than implementation.

## Requirement modules

| Module | Canonical IDs | Responsibility |
| --- | --- | --- |
| [Generation provider execution](GENERATION_PROVIDER_EXECUTION.md) | `REQ-LLM-001` through `REQ-LLM-016` | Provider-neutral generation, explicit per-run local/Groq selection, no-fallback behavior, bounded readiness, structured-output configuration, and deferred support qualification. |
| [Installation and model lifecycle](INSTALLATION_AND_MODEL_LIFECYCLE.md) | `REQ-INST-001` through `REQ-INST-016` | Local-service startup in Chrome or Edge, explicit runtime-managed model acquisition, and deferred installer, packaging, and expanded artifact lifecycle. |

Read only the focused module that owns the task. Provider execution and artifact installation remain distinct authorities even when a workflow change affects both.

## Documentation navigation

- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
