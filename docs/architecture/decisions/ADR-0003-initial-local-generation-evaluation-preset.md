# ADR-0003: Initial local generation capacity-screen configuration

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

The provider-neutral architecture needs one concrete local configuration with which to begin integration and evaluation on the reference machine: Windows, 32 GB RAM, and an NVIDIA RTX 5060 Laptop GPU with 8 GB VRAM. The choice must balance current model availability with enough nominal headroom for the browser, retrieval, embedding, context, and application services.

This decision selects the first model configuration to put through the capacity gate. It does not qualify a model for full evaluation or end users. The initial runtime is selected separately in [ADR-0005](ADR-0005-ollama-as-initial-local-model-runtime.md).

## Considered options

1. Begin capacity screening with Qwen3.5 9B as the larger quality-oriented option.
2. Begin capacity screening with Qwen3.5 4B to preserve more nominal headroom.
3. Defer a concrete bootstrap until after implementation starts.

## Decision

Use [`qwen3.5:4b`](https://ollama.com/library/qwen3.5%3A4b), through the initial local runtime selected in ADR-0005, as the first local capacity-screen configuration. On the decision date, Ollama listed a 3.4 GB, 4.66B-parameter Q4_K_M artifact, which leaves materially more nominal headroom on the reference GPU than the 9B option.

Apply [ADR-0004](ADR-0004-reference-pc-capacity-gate-for-local-models.md) before treating the 4B configuration as an evaluation candidate. If it fails, exclude it and select a smaller configuration within the reference PC's capacity.

[`qwen3.5:9b`](https://ollama.com/library/qwen3.5%3A9b), listed at 6.6 GB and 9.65B parameters in Q4_K_M, is only a later capacity-screen option. It enters the quality comparison only if it passes the capacity gate; otherwise it is excluded and replaced by another smaller, capacity-qualified configuration.

Floating tags and displayed digest prefixes are insufficient for release integrity. Provisioning and evaluation must record the exact full digest, quantization, context, runtime version, generation parameters, and license.

## Consequences

- Integration can begin with the lower-resource capacity screen without committing to an oversized comparison.
- The release-qualified local profile may be 4B, a capacity-qualified 9B configuration, another smaller model, or no candidate until the gates are met.
- A model recommendation shown during first-run setup is derived from accepted evaluation results, not from this dated bootstrap choice alone.

## Related requirements

- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-011`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-006`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-006` and `REQ-QUAL-009`
- [ADR-0004: Reference-PC capacity gate for local models](ADR-0004-reference-pc-capacity-gate-for-local-models.md)
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md)
