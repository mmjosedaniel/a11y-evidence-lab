# ADR-0024: Milestone-slice TDD with independent ownership

- **Status:** Accepted
- **Decision date:** 2026-08-28
- **Clarified:** 2026-08-29 — attempt-2 corrections now carry an enforceable terminal attempt-1 parent identity and single-child guard projection; the correction budget and ownership decision are unchanged.
- **Clarified:** 2026-08-29 — optional metrics are retained only for one bounded first-implementation pilot and must be disabled/deferred rather than expanded if that pilot is unhelpful; metrics remain non-authoritative and fail open.
- **Replaced:** 2026-08-29 — the later project-owner direction recorded below removes that unactivated metrics pilot under YAGNI and clarifies the non-TDD setup route and bounded coordinator test-correction exception.
- **Clarified:** 2026-08-29 — lease evidence covers path containment and only the explicitly sealed Git index, `HEAD` object and symbolic ref, selected settings, and ignore controls; every other Git write operation or metadata mutation remains prohibited by the worker contract but is not claimed as guard-detected.

## Context

A11y Evidence Lab is development ready, but application implementation has not started. Its roadmap contains behavior-bearing slices with deterministic scanner, persistence, retrieval, provider, review, comparison, and accessible-interface boundaries. The repository also uses role-separated Codex agents. Without an explicit implementation method, one worker could define a test after seeing its own implementation, divide one behavior into excessive assertion-sized handoffs, or report a passing command without an independently accepted behavioral boundary.

The project needs a method that demonstrates disciplined implementation without turning this portfolio MVP into a testing platform or workflow engine. Documentation, dependency setup, manual model-capacity screens, corpus preparation, and external evaluation observations do not always have a meaningful failing executable test. The method therefore must apply TDD where production behavior is automatable and use proportional non-TDD evidence elsewhere.

## Considered options

1. Let each implementation worker choose its own testing sequence and ownership.
2. Require test-first development for every repository change, including documentation, setup, and manual evaluations.
3. Use one coherent milestone-slice Red–Green–Refactor cycle for automatable production behavior, with separate test and implementation ownership and explicit exceptions for work that has no meaningful Red.
4. Create a generalized workflow engine, test-generation system, or permanent multi-writer pool.

## Decision

Use option 3 for implementation governed by the accepted [development roadmap](../../DEVELOPMENT_ROADMAP.md).

- Before a behavior-bearing work slice is edited, a `test_worker` performs read-only preflight and returns exactly one of: `EXISTING_AND_COVERED`, `EXISTING_BUT_UNCOVERED`, `MISSING`, `REGRESSION`, `PARTIAL`, `CONFLICTING`, or `UNKNOWN`.
- Search absence alone is not proof that behavior is missing.
- Existing covered behavior reuses fresh evidence without another test. Existing uncovered behavior receives one passing characterization. Missing or regressed behavior receives one coherent failing Red before production implementation. A confirmed isolated gap from `PARTIAL` follows the same Red–Green route; `CONFLICTING` or `UNKNOWN` stops for coordinator triage.
- One coherent slice may include related assertions that jointly prove one indivisible observable outcome. It must not combine unrelated roadmap behavior or devolve into one agent handoff per assertion.
- The primary coordinator accepts the test boundary. A separate `code_worker`, or `frontend_code_worker` only for an accepted `frontend-visual` slice, implements the minimum Green and may perform a small behavior-preserving Refactor while the accepted test-owned files remain unchanged during that Green assignment.
- Red, Green, and Refactor remain sequential. There is at most one active writer in a worktree. Concurrent independent writers require separate Git worktrees, baselines, ExecPlans, and the roadmap's existing parallel authorization.
- Every implementation-worker write turn uses the repository's [Milestone Assignment Packet v2](../../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) and [automatic write-lease guard](../../../.codex/write-lease-guard.md). The test worker owns ordinary test creation and correction. The primary may make an exceptional direct test correction only between leases, records the reason, paths, and validation in the ExecPlan, and invalidates the affected Red or characterization evidence. The corrected test and fresh result must be accepted before that evidence is reused or Green continues. Other application implementation edits remain worker-owned. A compliant lease proves worker path containment and no drift in the guard's explicitly sealed Git-state invariants, not all Git write operations or metadata, semantic correctness, or direct coordinator activity between leases. Write-capable workers may use Git only for read-only inspection and remain prohibited from every Git write operation and metadata mutation.
- Each role receives at most one same-contract correction using attempt 2. The correction names its terminal attempt-1 parent; the guard requires matching workflow, task, work slice, phase, worker role, and path scope and rejects a second attempt-2 child for that parent. The coordinator remains responsible for semantic same-contract and replacement-instance validation. A changed contract, repeated decisive failure, exhausted budget, or unresolved authority conflict stops automatic continuation.
- The coordinator inspects the actual diff and evidence, runs proportional work-slice validation, routes a fresh review by risk, and alone reconciles canonical status and closure.
- Before a behavior-bearing slice completes, audit affected tests, fixtures, mocks, helpers, snapshots, skipped tests, and focused-test markers for continued relevance.
- Documentation-only changes, declarative setup, dependency selection, corpus preparation, manual capacity screens, and external evaluation observations use structural, semantic, manual, or negative evidence when no meaningful executable Red exists. They record `TDD: Not applicable` and the replacement evidence; a guarded `code_worker` setup may proceed without test-worker preflight. They must not fabricate a failing test.
- The exact test runner and test packages remain RD-002 implementation literals. RD-002 must select the smallest harness needed by M1, pin every material version it introduces, and provide a focused independently executable test command. Later material dependencies are pinned when introduced and checked again at M6-04.

This decision governs the repository development method. It does not add application agents, queues, leases, telemetry, concurrency, workflow orchestration, or runtime behavior to the product.

## Consequences

- Test intent and implementation intent remain in separate role contexts for behavior-bearing work.
- Pre-existing behavior is not forced through an artificial failing test.
- The primary coordinator remains responsible for accepting evidence; worker handoffs, reviews, and lease receipts are supporting inputs only.
- The workflow adds repository coordination overhead, so work slices and validation must remain coarse enough to prove an observable contract and small enough to review independently.
- Python remains an internal dependency-free workflow-tooling prerequisite for automatic leases. It is not an application language, product dependency, installer prerequisite, or user runtime requirement.
- No hook or agent-flow metrics sidecar is part of the current workflow. It produced no runtime evidence, was not required by a gate, and duplicated information that a future small project-progress record can capture if implementation establishes that need.
- A future change to the ownership model, correction budget, or TDD applicability requires an explicit amendment or replacement of this decision.

## Decision history

The earlier 2026-08-29 clarification retained optional hooks and agent-flow metrics for a first-implementation pilot. Before that pilot was activated, review found that the sidecar did not model persistent subagent turns correctly and could not associate all observed reviewer or preflight work with a workflow. The project owner chose the YAGNI outcome: remove the unproven sidecar rather than repair optional telemetry. A future progress folder is Deferred until implementation creates a concrete reporting need; it must not become an automatic evidence or closure authority merely by being added.

The same owner direction confirms the Rick-and-Morty milestone-slice TDD semantics for production behavior and replaces the earlier absolute prohibition on direct coordinator implementation edits with the narrow test-correction exception above. The implementation worker still cannot edit the accepted test contract during Green, and any coordinator or test-worker change to that contract invalidates the prior Red or characterization evidence before it can be reused or Green resumes.

## Related documentation

- [Project-scoped agent workflow](../../../.codex/README.md)
- [Worker-first ExecPlan implementation workflow](../../../.codex/execplan-implementation-workflow.md)
- [ExecPlan convention](../../../PLANS.md)
- [Development roadmap](../../DEVELOPMENT_ROADMAP.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [Documentation-only Gherkin specifications](../../specs/README.md)
