# ADR-0004: Reference-PC capacity gate for local models

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

The complete local workflow must run on the existing reference computer: Windows, 32 GB RAM, an NVIDIA RTX 5060 Laptop GPU with 8 GB VRAM, and the documented available storage. The project should not spend evaluation effort on, recommend, or provision local models that exceed that computer's practical capacity.

Practical capacity includes more than model-file size. It includes the model working set, configured context, browser, embeddings, retrieval, application services, system-memory fallback, and whether the application remains usable while the representative workflow is active.

### MVP scope amendment recorded 2026-08-25

The original decision anticipated provisional latency and thermal limits followed by accepted numeric budgets under OD-010. The MVP now uses only a practical capacity gate: the representative workflow must complete on the reference PC without out-of-memory failure or an unusable interface. Formal latency percentiles, thermal limits, performance budgets, broad hardware support, and public performance claims are deferred. Observations and limitations may still be recorded, but they are not qualification claims.

### MVP candidate-count clarification recorded 2026-08-25

For the fixed MVP, apply this gate to `qwen3.5:4b` as the single first local configuration. Only if that configuration fails may the project replace it with one smaller configuration that must pass the same gate. The plural candidate-set language in the original decision describes the reusable gate and possible future evaluation, not an active multi-model list, parallel screens, or a local-model comparison in this MVP. This clarification follows ADR-0003 and OD-009 while leaving the capacity gate itself Accepted.

## Considered options

1. Compare current models broadly and reject oversized configurations after full evaluation.
2. Treat published artifact size as the only eligibility check.
3. Use a published-metadata prefilter followed by a short on-device capacity preflight before full evaluation.

## Decision

Use a two-stage capacity gate before a local model configuration becomes an evaluation candidate.

1. **Metadata prefilter:** exclude a configuration without downloading or benchmarking it when published artifact size, estimated runtime/context working set, storage needs, or supported runtime requirements clearly exceed the existing reference PC with a documented safety margin.
2. **On-device capacity preflight:** a configuration that is plausibly within the envelope may run a bounded preflight using its exact model digest, quantization, configured context, and runtime while the representative browser, embedding, retrieval, and application services are active.

A configuration passes only if it completes the bounded preflight on the existing PC without out-of-memory failure, storage exhaustion, or an unusable application interface. Record material paging or fallback, observed duration, memory behavior, UI responsiveness, and thermal limitations as evaluation context without converting them into formal MVP budgets.

Only configurations that pass both stages may enter the compact MVP evaluation or become the documented local evaluation configuration. Passing does not place a model in a supported-model catalog or justify a release, hardware-compatibility, latency, or thermal claim. A failed configuration is removed from the active candidate set; the project records the exclusion reason but performs no further quality evaluation on it. Additional hardware, remote compute, or API inference must not be used to make a local configuration appear eligible.

The capacity gate applies to every local model, including the initial bootstrap. The Groq mode remains a separate user choice and cannot satisfy the local MVP capacity constraint.

## Consequences

- Obviously oversized models do not appear in current candidate lists or consume download and evaluation effort.
- Borderline configurations receive only enough testing to establish whether they fit before quality work begins.
- The candidate set may contain smaller models, different quantizations, or different context profiles, provided each configuration independently passes the gate.
- A future hardware change requires a new recorded reference-machine decision before it broadens local-model eligibility.
- Formal performance and broad compatibility qualification remain deferred; this gate supports only the controlled portfolio workflow on the documented PC.

## Related requirements

- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-006` and `REQ-QUAL-009`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-006`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-011`
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md)
