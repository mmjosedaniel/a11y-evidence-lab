# ADR-0004: Reference-PC capacity gate for local models

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

The complete local workflow must run on the existing reference computer: Windows, 32 GB RAM, an NVIDIA RTX 5060 Laptop GPU with 8 GB VRAM, and the documented available storage. The project should not spend evaluation effort on, recommend, or provision local models that exceed that computer's practical capacity.

Practical capacity includes more than model-file size. It includes the model working set, configured context, browser, embeddings, retrieval, application services, system-memory fallback, sustained latency, and thermal stability while the representative workflow is active.

## Considered options

1. Compare current models broadly and reject oversized configurations after full evaluation.
2. Treat published artifact size as the only eligibility check.
3. Use a published-metadata prefilter followed by a short on-device capacity preflight before full evaluation.

## Decision

Use a two-stage capacity gate before a local model configuration becomes an evaluation candidate.

1. **Metadata prefilter:** exclude a configuration without downloading or benchmarking it when published artifact size, estimated runtime/context working set, storage needs, or supported runtime requirements clearly exceed the existing reference PC with a documented safety margin.
2. **On-device capacity preflight:** a configuration that is plausibly within the envelope may run a bounded preflight using its exact model digest, quantization, configured context, and runtime while the representative browser, embedding, retrieval, and application services are active.

A configuration passes only if it completes the approved preflight on the existing PC without out-of-memory failure, storage exhaustion, unacceptable system paging or fallback, loss of application responsiveness, or violation of the provisional latency and thermal limits. OD-010 will replace provisional limits with accepted numeric budgets.

Only configurations that pass both stages may enter the full quality comparison, appear in the supported model catalog, or become a first-run recommendation. A failed configuration is removed from the active candidate set; the project records the exclusion reason but performs no further quality evaluation on it. Additional hardware, remote compute, or API inference must not be used to make a local configuration appear eligible.

The capacity gate applies to every local model, including the initial bootstrap. The external-API mode remains a separate user choice and cannot satisfy the local release constraint.

## Consequences

- Obviously oversized models do not appear in current candidate lists or consume download and evaluation effort.
- Borderline configurations receive only enough testing to establish whether they fit before quality work begins.
- The candidate set may contain smaller models, different quantizations, or different context profiles, provided each configuration independently passes the gate.
- A future hardware change requires a new recorded reference-machine decision before it broadens local-model eligibility.

## Related requirements

- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-006` and `REQ-QUAL-009`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-006`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-011`
- [ADR-0003: Initial local generation capacity-screen configuration](ADR-0003-initial-local-generation-evaluation-preset.md)
- [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md)
