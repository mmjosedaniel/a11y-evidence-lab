# Execution-plan index

This directory indexes living, roadmap-task-scoped execution plans governed by [PLANS.md](../../PLANS.md). An ExecPlan is a detailed coordination, recovery, decision, and evidence-identity record subordinate to the [development roadmap](../DEVELOPMENT_ROADMAP.md), requirements, and Accepted ADRs. The separate [progress index](../progress/README.md) contains only concise task and agent-workflow summaries. Neither document can authorize implementation, change scope or status, or prove completion.

## Active plans

No active task plan.

## Completed plans

- [M2-01 — Closed corpus snapshot](completed/m2-01-closed-corpus-snapshot.md) — **Complete** on 2026-09-03. The frozen `wcag22-mvp-v1` snapshot contains exactly eight sources, 16 canonical passages and three gold mappings. Structural, reconstruction, five-negative and manual checks, fresh S0 and integrated reviews, exact capture cleanup and documentation closure passed. M2-02 remains Not started; no retrieval behavior exists.

- [M1-05 — Walking-skeleton integration](completed/m1-05-walking-skeleton-integration.md) — **Complete** again on 2026-09-03 after both post-closure corrections, 335 passing tests, strict TypeScript, fresh S3 and different final integrated reviews, exact cleanup, and renewed documentation closure. Original implementation, failed evidence, and public-smoke history are preserved.
- [M1-04 — Target and results UI](completed/m1-04-target-and-results-ui.md) — **Complete** on 2026-09-02 (UTC). The accepted OD-027 presentation, purpose-named component extraction, integrated-review correction, complete regression, independent reviews, exact cleanup, and documentation closure passed.
- [M1-03 — Real scan and evidence](completed/m1-03-real-scan-and-evidence.md) — **Complete** on 2026-08-31 (UTC). Both scanner slices and their S3 reviews are accepted. All 290 integrated tests and independent strict typechecking pass, including the failed-launch residue regression. The different final integrated critical review, exact task-owned runtime cleanup and documentation closure passed. At M1-03 closure, M1-04 and M1-05 were unselected.

- [M1-02 — Establish the loopback service and single-file aggregate](completed/m1-02-local-service-and-aggregate.md) — **Complete** on 2026-08-30. Guarded storage/service TDD, 182 passing tests, independent strict typechecking, both R3 checkpoints, both S3 reviews, different final integrated review, exact cleanup and documentation closure. Preserves the service correction and earlier planning history.

- [M1-01 — Define the minimum run and scan contracts](completed/m1-01-run-and-scan-contracts.md) — **Complete** on 2026-08-30 (UTC). Pure runtime validators, 58 passing tests, strict typechecking, both R3 checkpoints, corrected S3 and different integrated reviews, and documentation closure. Original stops and corrections are preserved.

- [RD-003 — Freeze the walking-skeleton evaluation boundary](completed/rd-003-scan-evaluation-boundary.md) — **Complete** on 2026-08-30 (UTC), including verified LF checkout and clean-start corrections, independent reviews, cleanup, and preserved original evidence/failure history.

- [RD-002 — Select the minimum development toolchain literals](completed/rd-002-minimum-development-toolchain-literals.md) — **Complete** on 2026-08-30 (UTC). Preserves its R2 selection, guarded non-TDD setup, independent reviews, and verification/closure evidence.

Move a plan to `completed/` only after its owning roadmap task is `Complete` and the task-closure documentation gate passes. Do not create an empty archive for a future task.

## Naming and maintenance

- Use `docs/plans/<roadmap-id>-<short-slug>.md` while active.
- One plan owns exactly one status-bearing roadmap task.
- A standalone policy decision without a selected roadmap-task owner keeps its Decision Review Contract in the coordinating prompt; do not create a plan or synthetic task ID for it.
- Preserve the filename, stable identities, history, and revision notes when moving it to `docs/plans/completed/`.
- Update this index and repair affected links in the same change.
- Update canonical authorities before reflecting their changed state in a plan.
- Create or update the matching [progress record](../progress/README.md) only at accepted material checkpoints or closure; link here instead of duplicating plan detail.

## Navigation

- [Execution-plan convention](../../PLANS.md)
- [Agent coordination workflow](../../.codex/README.md)
- [Development roadmap](../DEVELOPMENT_ROADMAP.md)
- [Project and agent-workflow progress](../progress/README.md)
- [Project documentation index](../README.md)
