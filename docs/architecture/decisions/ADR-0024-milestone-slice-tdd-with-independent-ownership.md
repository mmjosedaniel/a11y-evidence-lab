# ADR-0024: Milestone-slice TDD with independent ownership

- **Status:** Accepted
- **Decision date:** 2026-08-28
- **Clarified:** 2026-08-29 — attempt-2 corrections now carry an enforceable terminal attempt-1 parent identity and single-child guard projection; the correction budget and ownership decision are unchanged.
- **Clarified:** 2026-08-29 — optional metrics are retained only for one bounded first-implementation pilot and must be disabled/deferred rather than expanded if that pilot is unhelpful; metrics remain non-authoritative and fail open.

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
- The primary coordinator accepts and freezes the test boundary. A separate `code_worker`, or `frontend_code_worker` only for an accepted `frontend-visual` slice, implements the minimum Green and may perform a small behavior-preserving Refactor while the accepted tests remain unchanged.
- Red, Green, and Refactor remain sequential. There is at most one active writer in a worktree. Concurrent independent writers require separate Git worktrees, baselines, ExecPlans, and the roadmap's existing parallel authorization.
- Every implementation-worker write turn uses the repository's [Milestone Assignment Packet v2](../../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) and [automatic write-lease guard](../../../.codex/write-lease-guard.md). The primary makes no unleased application implementation edit; primary-owned ExecPlan, authority, status, and guard-control maintenance occurs only between leases. A compliant lease proves path and Git-control containment, not semantic correctness.
- Each role receives at most one same-contract correction using attempt 2. The correction names its terminal attempt-1 parent; the guard requires matching workflow, task, work slice, phase, worker role, and path scope and rejects a second attempt-2 child for that parent. The coordinator remains responsible for semantic same-contract and replacement-instance validation. A changed contract, repeated decisive failure, exhausted budget, or unresolved authority conflict stops automatic continuation.
- The coordinator inspects the actual diff and evidence, runs proportional work-slice validation, routes a fresh review by risk, and alone reconciles canonical status and closure.
- Before a behavior-bearing slice completes, audit affected tests, fixtures, mocks, helpers, snapshots, skipped tests, and focused-test markers for continued relevance.
- Documentation-only changes, declarative setup, dependency selection, corpus preparation, manual capacity screens, and external evaluation observations use structural, semantic, manual, or negative evidence when no meaningful executable Red exists. They must record why TDD does not apply; they must not fabricate a failing test.
- The exact test runner and test packages remain RD-002 implementation literals. RD-002 must select the smallest harness needed by M1, pin every material version it introduces, and provide a focused independently executable test command. Later material dependencies are pinned when introduced and checked again at M6-04.

This decision governs the repository development method. It does not add application agents, queues, leases, telemetry, concurrency, workflow orchestration, or runtime behavior to the product.

## Consequences

- Test intent and implementation intent remain in separate role contexts for behavior-bearing work.
- Pre-existing behavior is not forced through an artificial failing test.
- The primary coordinator remains responsible for accepting evidence; worker handoffs, reviews, metrics, and lease receipts are supporting inputs only.
- The workflow adds repository coordination overhead, so work slices and validation must remain coarse enough to prove an observable contract and small enough to review independently.
- Python remains an internal dependency-free workflow-tooling prerequisite for automatic leases and optional metrics. It is not an application language, product dependency, installer prerequisite, or user runtime requirement.
- The optional hook metrics remain local, best effort, fail open, and non-authoritative. They are retained only for the bounded first-implementation pilot defined by the metrics policy; their absence cannot block implementation or closure, and an unhelpful pilot does not justify broader telemetry.
- A future change to the ownership model, correction budget, or TDD applicability requires an explicit amendment or replacement of this decision.

## Related documentation

- [Project-scoped agent workflow](../../../.codex/README.md)
- [Worker-first ExecPlan implementation workflow](../../../.codex/execplan-implementation-workflow.md)
- [ExecPlan convention](../../../PLANS.md)
- [Development roadmap](../../DEVELOPMENT_ROADMAP.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [Documentation-only Gherkin specifications](../../specs/README.md)
