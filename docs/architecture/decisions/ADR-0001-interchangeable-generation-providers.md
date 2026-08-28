# ADR-0001: Interchangeable generation providers

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

A11y Evidence Lab needs generated explanations and remediation proposals, but its evidence, review, and comparison workflow must not depend on one model vendor or runtime. The product must also preserve a complete local-generation path with no hosted inference while allowing a user to deliberately choose an external LLM API when its privacy, cost, and operational tradeoffs are acceptable. Runtime public-page network access remains separate from generation-provider choice, so local generation does not mean an offline scan.

The provider decision applies to structured text generation. Embedding and reranking providers remain separate architecture decisions.

### MVP scope amendment recorded 2026-08-25

The 2026-08-23 decision put the external adapter in a later distributable-product stage and made the first portfolio slice local-generation-only. [ADR-0014](ADR-0014-groq-as-mvp-external-generation-provider.md) replaces only that timing and provider-selection part: the MVP now has two explicit per-`PageAnalysisRun` generation modes, the selected local adapter and one Groq adapter. The provider-neutral boundary, no-hosted-inference local capability, explicit egress choice, provenance, validation, and no-fallback rules remain Accepted. This amendment does not create a general provider registry or authorize additional hosted providers.

### Public-page mode-context amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) adds one authorized public-page workflow that may enumerate a variable number of findings. For that workflow, one explicit `Local` or `Groq` generation-mode context belongs to the `PageAnalysisRun` and applies to every nested selected-Finding workflow. This replaces the narrower assumption that provider mode is chosen independently for every finding, but it does not make mode selection a provider call or authorize automatic work across all findings. The user still selects one finding at a time, evidence sufficiency still runs before invocation, and each eligible generation action makes at most one call. Changing the global mode requires a new page-analysis context; no Finding silently switches provider. [ADR-0021](ADR-0021-single-file-run-aggregate.md) later removes the child-record representation without changing these semantics.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017's production-style hostile-network boundary for the portfolio MVP. The run-level `Local` or `Groq` choice and all provider controls in this record remain Accepted. A trusted operator-entered public HTTPS page still requires ordinary network access for the deterministic scan, but that traffic is separate from hosted model inference and does not add a provider fallback or another adapter.

## Considered options

1. Bind the workflow directly to one local model and runtime.
2. Bind the workflow to one hosted API.
3. Put local and API-backed generation behind one application-owned provider contract.

## Decision

Use an application-owned structured-generation contract with replaceable provider adapters.

- The MVP has exactly two generation adapters: the selected local provider and the Groq provider accepted in ADR-0014. This is a fixed pair, not a provider registry or a promise of arbitrary OpenAI-compatible endpoints.
- One explicit `Local` or `Groq` mode is immutable within a `PageAnalysisRun`; the fixed synthetic evaluation records the equivalent selected mode for each evaluated path. The mode and non-secret provider/model provenance never rewrite completed output.
- The complete local-generation/no-hosted-inference workflow remains available. Fetching the trusted operator-entered page still uses ordinary HTTPS network access under ADR-0018, so this is not an offline workflow. Groq mode is an explicit generation-data egress choice, not an automatic fallback.
- Any transition that changes data egress requires an informed user action. A failed local request must not be silently retried through an external API, and a failed API request must not silently switch providers.
- Every adapter must accept the same eligible application-level generation request for one selected finding and return the same normalized outcome: one candidate-proposal value or one bounded error. The application-owned generation stage, not the adapters, exposes the `proposal` or deterministic `abstention` result branches. An evidence-sufficiency abstention bypasses every provider adapter. Provider-specific objects must not leak into the page-analysis, evidence, review, or comparison domains.
- Every adapter must preserve citation validation, manual-check, provenance, privacy, error, and evaluation behavior. Application-owned evidence-sufficiency, configuration-presence, and context-fit checks run before invocation. Under [ADR-0020](ADR-0020-manual-developer-managed-local-model-setup.md), the actual requested call and validation of its returned structure establish provider behavior; there is no separate synthetic probe or readiness subsystem.
- Non-secret adapter configuration remains separate from credentials. Selecting or inspecting the configured mode must not invoke it. Only an attempted call creates a `ProviderInvocation`: it inherits or references the run's immutable provider/model context and the owning Finding's corpus/passage context, and records the adapter identifier and version, non-secret endpoint identity, bounded material generation parameters, prompt/output-contract provenance, non-secret outcome, and validation result. Runtime/model revision, request time, and safe usage metadata are optional when available. Credentials, reconstructable secrets, and raw provider request or response payloads are never part of this provenance. A deterministic abstention instead records the application-policy reason and that no provider call occurred.
- Do not create an automatic all-findings generation path, provider batch, retry loop, or cross-provider fallback. A run may contain nested results from several independently requested selected-Finding actions, but each proceeds sequentially under the same global mode.
- ADR-0014 selects the exact external adapter and MVP evaluation model. OpenAI-compatible request syntax is not provider identity or automatic compatibility; accepting an arbitrary base URL is out of scope.

## Consequences

- The workflow can adopt a better local model or a different external provider without redesigning evidence and review behavior.
- The MVP needs two small adapters, actual-call boundary validation, and normalized failures. It does not need a probe subsystem, provider registry, dynamic discovery, provider leaderboard, or generalized multi-provider conformance infrastructure.
- External API mode introduces data-egress, credential, retention, availability, rate-limit, and cost risks that local mode does not have.
- Model recommendations can change without redesigning the application. Evaluation results, not recency or artifact size alone, determine the release configuration.

## Related requirements

- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0020: Manual developer-managed local model setup](ADR-0020-manual-developer-managed-local-model-setup.md)
- [ADR-0021: Single-file run aggregate](ADR-0021-single-file-run-aggregate.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
