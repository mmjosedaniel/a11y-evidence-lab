# ADR-0001: Interchangeable generation providers

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

A11y Evidence Lab needs generated explanations and remediation proposals, but its evidence, review, and comparison workflow must not depend on one model vendor or runtime. The product must also preserve a complete local-only path while allowing a user to deliberately choose an external LLM API when its privacy, cost, and operational tradeoffs are acceptable.

The provider decision applies to structured text generation. Embedding and reranking providers remain separate architecture decisions.

## Considered options

1. Bind the workflow directly to one local model and runtime.
2. Bind the workflow to one hosted API.
3. Put local and API-backed generation behind one application-owned provider contract.

## Decision

Use an application-owned structured-generation contract with replaceable provider adapters.

- The first portfolio slice will use one **local LLM provider** behind the provider-neutral contract. A later distributable provider-support stage will support at least one local provider and at least one **external API LLM provider** before the product claims both modes.
- When the distributable provider-support stage is introduced, the user will choose a default provider profile during first-run setup and may change the default later. A provider change applies only to new generation runs and never rewrites completed output or provenance.
- Local generation is the recommended initial mode and the complete local-only workflow remains available. API mode is an explicit opt-in mode, not an automatic fallback.
- Any transition that changes data egress requires an informed user action. A failed local request must not be silently retried through an external API, and a failed API request must not silently switch providers.
- Every adapter must accept the same application-level generation request and return the same validated proposal-or-abstention structure. Provider-specific objects must not leak into the evidence, review, or comparison domains.
- Every adapter must preserve citation validation, abstention, manual-check, provenance, privacy, error, and evaluation behavior, plus cancellation behavior if interactive cancellation is later introduced. Unsupported provider capabilities must be detected before a run and reported clearly.
- Provider profiles will separate non-secret configuration from credentials. Generation provenance will record provider type, adapter version, endpoint identity without credentials, model identifier and immutable version or digest when available, generation parameters, and usage metadata returned by the provider.
- The exact external API adapter or adapters must be selected before dual-mode implementation or support is claimed; they do not block the local-only first slice. Claiming compatibility requires a provider-specific conformance test; accepting an arbitrary base URL is not sufficient.

## Consequences

- The workflow can adopt a better local model or a different external provider without redesigning evidence and review behavior.
- The first slice needs one local adapter, capability checks, and normalized failures. A provider registry and shared multi-adapter conformance suite become necessary when the second provider mode is introduced.
- External API mode introduces data-egress, credential, retention, availability, rate-limit, and cost risks that local mode does not have.
- Model recommendations can change without redesigning the application. Evaluation results, not recency or artifact size alone, determine the release configuration.

## Related requirements

- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-001` through `REQ-LLM-010`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-004` and `REQ-SEC-005`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-008`
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
