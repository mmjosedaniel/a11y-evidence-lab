# ADR-0005: Ollama as the initial local model runtime

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The provider-neutral generation architecture needs one local runtime for embeddings and structured generation on the Windows reference PC. The runtime must expose a loopback interface, support exact model identification, and remain separable from the application so it can be replaced without changing evidence or review behavior. Model acquisition and proactive capability detection were part of the earlier setup direction and are superseded for the MVP by ADR-0020.

Ollama documents native Windows operation, NVIDIA GPU support, a loopback API, configurable model storage, and a standalone CLI distribution. It also documents JSON and JSON-schema structured outputs. These capabilities make it suitable for the first evaluation, but they do not establish acceptable resource use, lifecycle control, or application control over unrelated system networking.

### Public-page terminology amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) adds bounded public-page target networking without changing this runtime selection. The original phrase **controlled local-only workflow** referred to Ollama generation/embedding and its unrelated egress, not to an offline page scan. The decision wording below is clarified accordingly; its loopback-adapter, privacy, and evaluation-only scope remain unchanged.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017's hostile-network controls for the portfolio MVP without changing the Ollama decision. Ordinary HTTPS traffic used to load the trusted operator-entered page remains separate from Ollama's local generation and embedding traffic. The MVP does not require Ollama to implement a page-network security boundary.

### Manual developer-managed setup amendment recorded 2026-08-27

[ADR-0020](ADR-0020-manual-developer-managed-local-model-setup.md) narrows this record's earlier acquisition and readiness direction for the portfolio MVP. Ollama remains the selected evaluation runtime, but the developer installs it and pulls `qwen3.5:4b` outside A11y Evidence Lab. The application does not invoke or manage installation, model pulls, updates, removal, progress, or download states. It checks the fixed local prerequisite only when the user explicitly starts an eligible local generation attempt; the actual generation response and application validation establish the result. No separate synthetic connection or capability probe is part of the MVP.

### Local-mode data-boundary amendment recorded 2026-08-27

[ADR-0023](ADR-0023-local-mode-data-boundary.md) supersedes this record's earlier implication that the MVP must disable, isolate, or qualify Ollama's unrelated networking or prove system-wide zero egress. The current boundary is application-owned and data-specific: Local-generation prompts are sent only to the approved Ollama loopback endpoint and responses return only through that boundary; the embedding adapter likewise sends corpus and finding-query text only to the locally present embedding model through loopback and receives vectors only from it. A11y Evidence Lab uses no hosted provider for those Local-generation or embedding operations. This does not alter the separately authorized, minimized Groq generation payload, and it is not an offline or machine-wide networking claim. Ordinary HTTPS traffic for the trusted public-page scan remains external under ADR-0018, and Groq remains the only external generation provider under ADR-0014.

## Considered options

1. Load model implementations directly inside the application process.
2. Build around another dedicated local inference server such as llama.cpp server or a Transformers-compatible server.
3. Use Ollama behind the application-owned local provider adapter.

## Decision

Use Ollama as the initial local model runtime for evaluation only.

- Access it only through application-owned integrations: the provider-neutral local generation adapter and a separately versioned embedding adapter, over enumerated loopback endpoints.
- Pin and record the runtime version, model tag and full digest, quantization, context, generation parameters, and material GPU-offload configuration for every evaluated configuration. The developer-managed model-store location is not required evaluation provenance.
- Validate local structured output against the application-owned proposal contract; runtime-level structured-output support does not replace application validation.
- Send Local-generation prompts only to the approved Ollama loopback endpoint and receive responses only through that boundary. The embedding adapter sends corpus and finding-query text only to the locally present embedding model through loopback and receives vectors only from it; it uses no hosted embedding or vector service. This does not alter the separately authorized minimized Groq generation payload. A11y Evidence Lab does not disable, mediate, or qualify unrelated networking by the separately installed Ollama runtime, the operating system, the managed browser, or the trusted target page; ADR-0018 governs external page navigation, and ADR-0014 keeps Groq as the only external generation provider.
- Apply the reference-PC capacity gate to every model/runtime configuration.
- For the MVP, treat Ollama as a separately installed evaluation runtime. The developer follows Ollama's official instructions to install it and pull `qwen3.5:4b` outside A11y Evidence Lab. The application may identify a missing prerequisite and link to those instructions, but it does not invoke or manage installation, model pulls, updates, removal, progress, or download states. Installer ownership, repair, update, and uninstall integration remain deferred under ADR-0015 and ADR-0020.
- At an explicit eligible local generation attempt, check only that the approved Ollama loopback endpoint is reachable and the fixed model is present, then make the real generation request and validate its output. Do not add a separate synthetic connection check, capability-discovery probe, or readiness-report subsystem.
- Only an attempted generation call creates invocation provenance. Its compact record references the run's provider/model context and the owning Finding plus corpus/passage context, and records the adapter identifier and version, non-secret endpoint identity, bounded material generation parameters, prompt/output-contract provenance, non-secret outcome, and validation result. Request time, resolved runtime/model revision, and safe usage metadata are optional when available.

Adopting Ollama as a release dependency requires passing provider conformance, capacity, local-data-boundary, lifecycle, and recovery tests appropriate to that later distribution decision. ADR-0023 does not require system-wide zero-egress qualification. If Ollama fails the applicable evaluation, evaluation pauses until a new recorded runtime-selection decision updates the exact runtime requirements and evaluation configuration. Another runtime is neither pre-approved nor an automatic fallback; the application generation-provider and embedding contracts remain stable across any later decision.

## Consequences

- The initial generation and embedding adapters can use a documented Windows runtime and loopback API instead of embedding model-loading code in the application.
- Runtime/model identity and structured-output behavior still require project-specific verification.
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
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [ADR-0020: Manual developer-managed local model setup](ADR-0020-manual-developer-managed-local-model-setup.md)
- [ADR-0023: Local-mode data boundary](ADR-0023-local-mode-data-boundary.md)
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-004`, `REQ-SEC-014`, and `REQ-SEC-027`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-009`
