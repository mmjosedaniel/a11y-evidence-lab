# ADR-0003: Initial local generation capacity-screen configuration

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

The provider-neutral architecture needs one concrete local configuration with which to begin integration and evaluation on the reference machine: Windows, 32 GB RAM, and an NVIDIA RTX 5060 Laptop GPU with 8 GB VRAM. The choice must balance current model availability with enough nominal headroom for the browser, retrieval, embedding, context, and application services.

This decision selects the first model configuration to put through the capacity gate. It does not qualify a model for full evaluation or end users. The initial runtime is selected separately in [ADR-0005](ADR-0005-ollama-as-initial-local-model-runtime.md).

### MVP narrowing amendment recorded 2026-08-25

The original decision below preserved Qwen3.5 9B as a possible later capacity screen and quality-comparison participant and discussed a future release-qualified recommendation. OD-009, OD-010, OD-013, and OD-017 narrow the current portfolio MVP to one practical local configuration plus the fixed Groq evaluation path, with no local-model comparison, formal qualification, or release recommendation. Therefore `qwen3.5:9b` and any second local-model screen are Deferred for this MVP. The `qwen3.5:4b` configuration remains only the first model to put through the practical reference-PC screen; if it fails, select one smaller replacement rather than adding a comparison candidate. This amendment controls the original 9B and release-profile statements while preserving them as decision history.

### Portfolio YAGNI amendment recorded 2026-08-27

[OD-022](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification), the current form of [ADR-0004](ADR-0004-reference-pc-capacity-gate-for-local-models.md), and [ADR-0020](ADR-0020-manual-developer-managed-local-model-setup.md) make the capacity screen developer-run evaluation work. The developer installs Ollama, pulls `qwen3.5:4b`, and performs one manual representative smoke on the reference PC. A11y Evidence Lab does not implement a capacity-preflight feature, model downloader, hardware monitor, connection probe, or readiness subsystem. This amendment controls any earlier wording below that could imply application-managed provisioning or preflight while retaining `qwen3.5:4b` as the one initial configuration.

## Considered options

1. Begin capacity screening with Qwen3.5 9B as the larger quality-oriented option.
2. Begin capacity screening with Qwen3.5 4B to preserve more nominal headroom.
3. Defer a concrete bootstrap until after implementation starts.

## Decision

Use [`qwen3.5:4b`](https://ollama.com/library/qwen3.5%3A4b), through the initial local runtime selected in ADR-0005, as the first local capacity-screen configuration. On the decision date, Ollama listed a 3.4 GB, 4.66B-parameter Q4_K_M artifact, which leaves materially more nominal headroom on the reference GPU than the 9B option.

Apply [ADR-0004](ADR-0004-reference-pc-capacity-gate-for-local-models.md) before treating the 4B configuration as an evaluation candidate. If it fails, exclude it and select a smaller configuration within the reference PC's capacity.

[`qwen3.5:9b`](https://ollama.com/library/qwen3.5%3A9b), listed at 6.6 GB and 9.65B parameters in Q4_K_M, was originally retained as a later capacity-screen option that could enter quality comparison after passing the gate. The 2026-08-25 amendment Defers that option and any local-model comparison outside the MVP.

Floating tags and displayed digest prefixes are insufficient for reproducible evaluation. The developer's manual evaluation note records the exact full digest, quantization, context, runtime version, material generation parameters, and license; the application does not need a provisioning or model-lifecycle record.

## Consequences

- Integration can begin with the lower-resource capacity screen without committing to an oversized comparison.
- The original future direction allowed a release-qualified local profile to be 4B, a screened 9B configuration, another smaller model, or no candidate. Release qualification and the 9B option are Deferred for the MVP.
- A future distributable product's model recommendation would require a later accepted evaluation and setup decision; the localhost portfolio MVP has no installer-managed first-run recommendation workflow.

## Related requirements

- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-011`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-006`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-006` and `REQ-QUAL-009`
- [ADR-0004: Reference-PC capacity gate for local models](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0020: Manual developer-managed local model setup](ADR-0020-manual-developer-managed-local-model-setup.md)
- [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md)
