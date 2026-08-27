# ADR-0023: Local-mode data boundary

- **Status:** Accepted for the MVP
- **Decision date:** 2026-08-27
- **Amends for the MVP:** [ADR-0005](ADR-0005-ollama-as-initial-local-model-runtime.md) and [ADR-0012](ADR-0012-react-as-initial-user-interface-library.md)

## Context

A11y Evidence Lab needs a truthful meaning for `Local` mode. Local generation and local embeddings must not silently become hosted inference, but the portfolio MVP also scans one trusted public HTTPS page and optionally offers an explicitly selected Groq generation path. The separately installed Ollama runtime, operating system, managed browser, and target page may also have network behavior outside the application's inference calls.

Earlier wording in ADR-0005 called for disabling or isolating update checks, analytics, cloud features, and unrelated networking during local inference. ADR-0012 required verification that Local-mode operations produced no unapproved non-loopback egress and described Groq generation as the one external operation. Read literally, those clauses require system-wide network control or a zero-egress proof that conflicts with the trusted-page workflow and adds security infrastructure unrelated to the portfolio goal.

## Considered options

1. Enforce and qualify system-wide zero egress during Local-mode analysis.
2. Define a narrow application-owned boundary for inference data while acknowledging separate authorized network operations.
3. Make no promise that Local-mode inference data stays local.

## Decision

Accept option 2 for the MVP.

### Local inference data

- The application-owned Local generation adapter sends prompts only to the approved Ollama loopback endpoint and receives responses only through that boundary. A11y Evidence Lab must not send Local-generation prompts or responses to hosted inference.
- The embedding adapter sends selected corpus text and privacy-safe finding-query text only to the approved Ollama loopback endpoint and locally present `embeddinggemma` model in both generation modes. Returned vectors remain in the local application process. A11y Evidence Lab must not use a hosted embedding or vector service.
- In-process retrieval keeps vectors local and disposable under ADR-0019. Selecting Groq for later generation does not move embedding or retrieval to Groq.
- The separately authorized Groq generation payload may include the required curated guidance passages as application-level grounding under ADR-0014 and `REQ-SEC-015`. That later use is not hosted embedding or vector storage and does not widen the accepted Groq payload.
- Browser-delivered UI code has no direct provider, model-runtime, filesystem, Playwright, or credential authority. The local application service owns both loopback inference calls and any explicitly permitted external provider call.
- Evidence minimization, sufficiency gating, deterministic abstention, provider provenance, explicit invocation, and no automatic fallback remain unchanged. An abstaining finding invokes no generation provider.

### Separate network operations and claim boundary

- Loading the one trusted operator-entered public HTTPS page uses ordinary external page, redirect, and subresource traffic under ADR-0018. It is not hosted inference and is not evidence that a generation provider was called.
- An explicitly selected Groq-mode generation action may send only the accepted minimized one-finding payload to Groq under ADR-0014. Groq remains the first and only external generation provider; it is not a fallback.
- Developer-managed Ollama installation and model pulls occur outside A11y Evidence Lab under ADR-0020 and may use external network access. They are setup operations, not application inference calls.
- The MVP does not claim an offline workflow, system-wide zero egress, or control over unrelated networking by Ollama, the operating system, the managed browser, or the trusted target page. It adds no firewall, egress proxy, telemetry blocker, runtime-update controller, or machine-wide network monitor.
- Future evaluation may inspect configured application endpoints and controlled data flow to verify that Local-generation prompts and responses use only loopback and that embedding operations use no hosted embedding or vector service. It must not report that evidence as proof that the machine or separately installed runtime had no other network activity.

### Effect on previous decisions

- This record supersedes only ADR-0005's MVP clause requiring update checks, analytics, cloud features, and unrelated networking to be disabled or isolated during the controlled local inference workflow, plus its system-wide zero-egress release gate. Ollama's approved loopback adapters, local structured-output validation, evaluation status, capacity gate, and developer-managed setup remain unchanged.
- This record supersedes only ADR-0012's clause requiring all Local-mode operations to produce no unapproved non-loopback egress and its description of Groq as the one external operation. Pinned local UI assets, the unprivileged presentation boundary, text rendering, and the prohibition on browser-originated provider calls remain unchanged. Groq is still the only external **generation** path, while trusted-page navigation is a separate external browser operation.

This is a planning decision. It does not authorize implementation, prove that any adapter satisfies the boundary, or qualify a runtime, model, browser, or provider for release.

## Consequences

- `Local` has a precise, testable product meaning: generation prompts and responses use only the approved loopback runtime, while embedding computation and vectors remain local in either generation mode.
- The MVP avoids building a system-wide egress-control or runtime-telemetry qualification subsystem that does not demonstrate RAG.
- A local analysis can still make external page requests, so documentation and the interface must not use `Local`, `local-first`, and `offline` as synonyms.
- Groq's egress, privacy, credential, and failure requirements remain separate and visible.
- A future distribution, hostile-target, or strict offline requirement would need a new threat model and architecture decision.

## Primary references

- [Ollama API introduction](https://docs.ollama.com/api/introduction)
- [Ollama embeddings capability](https://docs.ollama.com/capabilities/embeddings)
- [Ollama on Windows](https://docs.ollama.com/windows)
- [Groq data handling](https://console.groq.com/docs/your-data)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0006: EmbeddingGemma as the initial embedding model](ADR-0006-embeddinggemma-as-initial-embedding-model.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [ADR-0019: In-process exact vector search](ADR-0019-in-process-exact-vector-search.md)
- [ADR-0020: Manual developer-managed local model setup](ADR-0020-manual-developer-managed-local-model-setup.md)
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
