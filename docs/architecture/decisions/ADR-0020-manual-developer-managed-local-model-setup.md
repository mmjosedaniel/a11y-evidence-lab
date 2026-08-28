# ADR-0020: Manual developer-managed local model setup

- **Status:** Accepted
- **Decision date:** 2026-08-27
- **Narrows for the MVP:** [ADR-0005](ADR-0005-ollama-as-initial-local-model-runtime.md), [ADR-0006](ADR-0006-embeddinggemma-as-initial-embedding-model.md), [ADR-0014](ADR-0014-groq-as-mvp-external-generation-provider.md), and [ADR-0015](ADR-0015-localhost-browser-mvp-execution.md)

## Context

A11y Evidence Lab is a developer-operated portfolio MVP whose main purpose is to demonstrate deterministic accessibility evidence, curated RAG through LangChain, structured Local/Groq generation, human review, and rescan comparison. Earlier planning retained an application-triggered Ollama model pull with detailed disclosure, progress reporting, download states, and bounded readiness or connection probes.

Those behaviors would create a small model manager and provider-diagnostics subsystem without improving the RAG demonstration. The developer already starts the local service manually and can install the separately owned Ollama runtime, the embedding model required for retrieval in either mode, and the generation model required only for Local mode through Ollama's official tools. The fixed Groq adapter likewise does not need a synthetic request before the one explicit real generation request.

This decision changes setup and disclosure mechanics only. It does not change the accepted provider-neutral contract, exact Local/Groq modes, fixed evaluation models, evidence-sufficiency gate, minimized provider input, structured validation, explicit invocation, provider provenance, or prohibition on provider mixing and automatic fallback.

## Considered options

1. Keep an application-triggered model pull, download progress and state, detailed consent UI, and synthetic provider probes.
2. Make Ollama and model acquisition a documented developer prerequisite, check each prerequisite only when its actual retrieval or generation work is requested, and rely on that work plus output validation.
3. Remove local generation from the MVP and keep only Groq.

## Decision

Accept option 2.

### Developer-managed local setup

- The developer installs Ollama outside A11y Evidence Lab by following the official [Ollama Windows instructions](https://docs.ollama.com/windows).
- For retrieval in either generation mode, the developer pulls the fixed embedding model outside the application with `ollama pull embeddinggemma`. Local generation additionally requires `ollama pull qwen3.5:4b`; Groq generation instead requires its configured credential. The applicable model pulls follow the official [Ollama CLI reference](https://docs.ollama.com/cli), [`qwen3.5:4b` model page](https://ollama.com/library/qwen3.5%3A4b), and [`embeddinggemma` model page](https://ollama.com/library/embeddinggemma).
- A11y Evidence Lab does not install or update Ollama, invoke a model pull or removal, choose a model-storage location, report acquisition progress, retain a download state, recover a partial artifact, or expose a model manager.
- The application may show the applicable fixed prerequisite and link to official instructions when retrieval or Local generation cannot start. Completing or repairing that prerequisite remains a developer action outside the application.
- Runtime and model artifacts remain outside Git, the application repository, and any future base installer. Ollama owns its installation and model store.

### Attempt-time availability and validation

- Selecting `Local` or `Groq` for a PageAnalysisRun performs no provider call, connection test, synthetic request, or capability-discovery probe and does not affect deterministic scanning.
- When the user explicitly starts generation for an eligible selected finding in Local mode, the local adapter checks only that the approved Ollama loopback endpoint is reachable and `qwen3.5:4b` is present. It then makes the actual generation request and validates the returned structured value against the application-owned contract.
- Whenever retrieval is requested, the embedding adapter checks only that the approved Ollama loopback endpoint is reachable and `embeddinggemma` is present, then performs the actual query embedding and validates the result. The first retrieval after process start, and a later required rebuild after a material incompatibility, additionally embeds the fixed corpus to construct the disposable in-process vectors. There is no separate readiness probe or persisted index lifecycle.
- When the user explicitly starts generation in Groq mode, the adapter checks only that its fixed configuration and credential are present. It then makes the actual Groq request to the already accepted model configuration and validates the returned structured value.
- Only an attempted Local or Groq generation call creates invocation provenance. Its compact record references the immutable run provider/model context and the owning Finding plus corpus/passage context, and records the adapter identifier and version, non-secret endpoint identity, bounded material generation parameters, prompt/output-contract provenance, non-secret outcome, and validation result. Request time, runtime/model revision, and safe usage metadata are optional when available.
- The bounded context-fit check remains deterministic application behavior before the actual request so required evidence, guidance, citations, or constraints are never silently truncated.
- Missing setup, request failure, or invalid output remains a visible finding-level failure. It preserves the completed scan and evidence and never causes an automatic retry, provider switch, or fallback.

### Minimal provider disclosure

- At global mode selection, show one concise run-level disclosure: Local uses the approved loopback Ollama boundary; Groq uses the external Groq service and may receive only the selected finding's minimized application-owned evidence and required curated guidance after an explicit generation action.
- Keep the selected provider and exact model visibly labeled throughout the run.
- A separate repeated disclosure or confirmation gate before every finding invocation is not required. Each invocation still requires the user's explicit finding-level generation action.
- Groq credential isolation, minimized payload rules, non-secret invocation provenance, provider-controlled service limitations, no batching, no provider mixing, and no fallback remain unchanged.

## Consequences

- The first slice can focus on provider adapters, LangChain composition, structured validation, and evidence-grounded output rather than download and diagnostics workflows.
- Local setup becomes a documented developer prerequisite. A missing runtime or model is discovered only when the corresponding retrieval or Local generation work is requested and is reported without blocking scanning or existing evidence.
- The interface needs no download button, progress view, acquisition state machine, repeated provider-disclosure modal, connection-check action, or readiness report.
- The fixed local and Groq evaluation configurations remain unchanged and unqualified for distribution or general support.
- If a fixed local model, embedding model, local runtime, or Groq model fails its applicable evaluation, that evaluation pauses until a new recorded model- or runtime-selection decision updates the exact requirement and evaluation configuration. This does not create a pre-approved replacement pool, generic selector, or runtime fallback.
- If a future distributable product needs non-developer onboarding, application-managed acquisition, offline import, model administration, or proactive provider diagnostics, it requires a new decision based on that demonstrated need. The superseded MVP mechanics do not reactivate automatically.

## Primary references

- [Ollama on Windows](https://docs.ollama.com/windows)
- [Ollama CLI reference](https://docs.ollama.com/cli)
- [Ollama `qwen3.5:4b` model page](https://ollama.com/library/qwen3.5%3A4b)
- [EmbeddingGemma on Ollama](https://ollama.com/library/embeddinggemma)
- [Groq Structured Outputs](https://console.groq.com/docs/structured-outputs)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [ADR-0004: Reference-PC capacity gate for local models](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-019` and `REQ-LLM-020`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-003`–`REQ-INST-006` and `REQ-INST-017`
