# ADR-0001: Interchangeable generation providers

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

A11y Evidence Lab needs generated explanations and remediation proposals, but its evidence, review, and comparison workflow must not depend on one model vendor or runtime. The product must also preserve a complete local-only path while allowing a user to deliberately choose an external LLM API when its privacy, cost, and operational tradeoffs are acceptable.

The provider decision applies to structured text generation. Embedding and reranking providers remain separate architecture decisions.

### MVP scope amendment recorded 2026-08-25

The 2026-08-23 decision put the external adapter in a later distributable-product stage and made the first portfolio slice local-only. [ADR-0014](ADR-0014-groq-as-mvp-external-generation-provider.md) replaces only that timing and provider-selection part: the MVP now has two explicit per-run generation modes, the selected local adapter and one Groq adapter. The provider-neutral boundary, local-only capability, explicit egress choice, provenance, validation, and no-fallback rules remain Accepted. This amendment does not create a general provider registry or authorize additional hosted providers.

## Considered options

1. Bind the workflow directly to one local model and runtime.
2. Bind the workflow to one hosted API.
3. Put local and API-backed generation behind one application-owned provider contract.

## Decision

Use an application-owned structured-generation contract with replaceable provider adapters.

- The MVP has exactly two generation adapters: the selected local provider and the Groq provider accepted in ADR-0014. This is a fixed pair, not a provider registry or a promise of arbitrary OpenAI-compatible endpoints.
- The user selects local or Groq explicitly for each new generation run. The choice and non-secret provider/model provenance are immutable for that run and never rewrite completed output.
- The complete local-only workflow remains available. Groq mode is an explicit egress choice, not an automatic fallback.
- Any transition that changes data egress requires an informed user action. A failed local request must not be silently retried through an external API, and a failed API request must not silently switch providers.
- Every adapter must accept the same eligible application-level generation request and return the same normalized candidate-proposal result. The application-owned generation stage, not the adapters, exposes the `proposal` or deterministic `abstention` result branches. An evidence-sufficiency abstention bypasses every provider adapter. Provider-specific objects must not leak into the evidence, review, or comparison domains.
- Every adapter must preserve citation validation, manual-check, provenance, privacy, error, and evaluation behavior. Application-owned evidence-sufficiency and abstention policy runs before adapter invocation. Unsupported required capabilities must be detected before a provider call and reported clearly.
- Provider profiles will separate non-secret configuration from credentials. When a provider is invoked, generation provenance will record provider type, adapter version, endpoint identity without credentials, model identifier and immutable version or digest when available, generation parameters, and usage metadata returned by the provider. A deterministic abstention instead records the application policy reason and that no provider call occurred.
- ADR-0014 selects the exact external adapter and MVP evaluation model. OpenAI-compatible request syntax is not provider identity or automatic compatibility; accepting an arbitrary base URL is out of scope.

## Consequences

- The workflow can adopt a better local model or a different external provider without redesigning evidence and review behavior.
- The MVP needs two small adapters, boundary validation, capability checks, and normalized failures. It does not need a provider registry, dynamic discovery, a provider leaderboard, or generalized multi-provider conformance infrastructure.
- External API mode introduces data-egress, credential, retention, availability, rate-limit, and cost risks that local mode does not have.
- Model recommendations can change without redesigning the application. Evaluation results, not recency or artifact size alone, determine the release configuration.

## Related requirements

- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-001` through `REQ-LLM-010`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-004` and `REQ-SEC-005`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-008`
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
