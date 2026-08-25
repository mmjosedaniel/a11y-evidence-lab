# ADR-0005: Ollama as the initial local model runtime

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The provider-neutral generation architecture needs one local runtime for model acquisition, capability detection, embeddings, and structured generation on the Windows reference PC. The runtime must expose a loopback interface, support exact model identification, and remain separable from the application so it can be replaced without changing evidence or review behavior.

Ollama documents native Windows operation, NVIDIA GPU support, a loopback API, configurable model storage, and a standalone CLI distribution. It also documents JSON and JSON-schema structured outputs. These capabilities make it suitable for the first evaluation, but they do not establish acceptable resource use, lifecycle control, or zero-egress behavior for this project.

## Considered options

1. Load model implementations directly inside the application process.
2. Build around another dedicated local inference server such as llama.cpp server or a Transformers-compatible server.
3. Use Ollama behind the application-owned local provider adapter.

## Decision

Use Ollama as the initial local model runtime for evaluation only.

- Access it only through application-owned integrations: the provider-neutral local generation adapter and a separately versioned embedding adapter, over enumerated loopback endpoints.
- Pin and record the runtime version, model tag and full digest, quantization, context, generation parameters, GPU offload, and storage location for every evaluated configuration.
- Validate local structured output against the application-owned proposal contract; runtime-level structured-output support does not replace application validation.
- Disable or isolate update checks, analytics, cloud features, and unrelated networking during the controlled local-only workflow.
- Apply the reference-PC capacity gate to every model/runtime configuration.
- For the MVP, treat Ollama as a separately installed evaluation runtime. Any selected model download is explicit, occurs outside the repository, and follows the disclosure and consent rules in the installation and model-lifecycle requirements. Installer ownership, repair, update, and uninstall integration remain deferred under ADR-0015.

Adopting Ollama as a release dependency requires passing provider conformance, capacity, privacy, lifecycle, recovery, and zero-egress tests. Failure replaces Ollama without changing the application generation-provider or embedding contracts.

## Consequences

- The initial generation and embedding adapters can use a documented Windows runtime and loopback API instead of embedding model-loading code in the application.
- Model management and structured-output behavior still require project-specific verification.
- The installed Ollama application has its own storage, logs, and update lifecycle, which may conflict with a strictly controlled distribution unless runtime ownership is resolved.
- No other domain component may depend directly on Ollama-specific request or response types.

## Primary references

- [Ollama on Windows](https://docs.ollama.com/windows)
- [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) — historical, superseded for the MVP
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [ADR-0004: Reference-PC capacity gate](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-011`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-009`
