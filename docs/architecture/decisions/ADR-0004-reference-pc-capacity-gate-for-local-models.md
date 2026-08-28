# ADR-0004: Reference-PC capacity gate for local models

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

The complete local workflow must run on the existing reference computer: Windows, 32 GB RAM, an NVIDIA RTX 5060 Laptop GPU with 8 GB VRAM, and the documented available storage. The project should not spend evaluation effort on, recommend, or provision local models that exceed that computer's practical capacity.

Practical capacity includes more than model-file size. It includes the model working set, configured context, browser, embeddings, retrieval, application services, system-memory fallback, and whether the application remains usable while the representative workflow is active.

### MVP scope amendment recorded 2026-08-25

The original decision anticipated provisional latency and thermal limits followed by accepted numeric budgets under OD-010. The MVP now uses only a practical capacity gate: the representative workflow must complete on the reference PC without out-of-memory failure or an unusable interface. Formal latency percentiles, thermal limits, performance budgets, broad hardware support, and public performance claims are deferred. Observations and limitations may still be recorded, but they are not qualification claims.

### MVP candidate-count clarification recorded 2026-08-25

For the fixed MVP, apply this gate to `qwen3.5:4b` as the only selected local configuration. If it fails, local evaluation pauses until a new recorded model-selection decision updates the exact-model requirement and evaluation configuration; only that newly selected replacement may then pass through the same gate. The plural candidate-set language in the original decision describes the reusable gate and possible future evaluation, not an active or pre-approved model pool, parallel screens, or a local-model comparison in this MVP. This clarification follows ADR-0003 and OD-009 while leaving the capacity gate itself Accepted.

### Portfolio YAGNI amendment recorded 2026-08-27

[OD-022](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) makes the on-device step one manual representative capacity smoke performed by the developer after the developer-managed Ollama setup in ADR-0020. It is evaluation work, not an in-application preflight, benchmark screen, hardware monitor, or readiness subsystem. The metadata exclusion rule and reference-PC boundary remain Accepted.

### Replacement-procedure clarification recorded 2026-08-27

A failed fixed candidate does not activate another model automatically. Before a smaller replacement is evaluated, the project records a new model-selection decision and updates the exact-model requirement and evaluation configuration. This gate then applies to that one newly selected configuration; it does not create a standing candidate catalog, comparison workflow, model registry, or runtime fallback.

## Considered options

1. Compare current models broadly and reject oversized configurations after full evaluation.
2. Treat published artifact size as the only eligibility check.
3. Use a published-metadata prefilter followed by one manual on-device capacity smoke before full evaluation.

## Decision

Use a two-stage capacity gate before a local model configuration becomes an evaluation candidate.

1. **Metadata prefilter:** exclude a configuration without downloading or benchmarking it when published artifact size, estimated runtime/context working set, storage needs, or supported runtime requirements clearly exceed the existing reference PC with a documented safety margin.
2. **Manual on-device capacity smoke:** after the developer installs the one plausible configuration, run the representative browser, embedding, retrieval, and application workload once using its exact model digest, quantization, configured context, and runtime.

A configuration passes only if the manual smoke completes on the existing PC without out-of-memory failure, storage exhaustion, or an unusable application interface. Record readily observable paging or fallback, duration, and UI responsiveness as evaluation context. No in-app hardware monitoring, repeated benchmark protocol, formal budget, or thermal qualification is required.

Only a configuration that passes both stages may enter the compact MVP evaluation or become the documented local evaluation configuration. Passing does not place a model in a supported-model catalog or justify a release, hardware-compatibility, latency, or thermal claim. When the fixed configuration fails, the project records the exclusion reason and pauses local evaluation; it performs no further quality evaluation until a new model-selection decision updates the exact configuration. Additional hardware, remote compute, or API inference must not be used to make a local configuration appear eligible.

The capacity gate applies to every local model, including the initial bootstrap. The Groq mode remains a separate user choice and cannot satisfy the local MVP capacity constraint.

## Consequences

- An obviously oversized model is not selected or downloaded for the fixed MVP evaluation.
- The one plausible configuration receives one manual representative smoke before quality work begins.
- The fixed MVP has one active local configuration rather than a standing candidate set. If it fails, local evaluation pauses until a new model-selection decision updates the exact-model requirements and frozen evaluation configuration; only then may one smaller replacement configuration pass through this gate.
- A future hardware change requires a new recorded reference-machine decision before it broadens local-model eligibility.
- Formal performance and broad compatibility qualification remain deferred; this gate supports only the controlled portfolio workflow on the documented PC.

## Related requirements

- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-006` and `REQ-QUAL-009`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-006`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-011`
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md)
