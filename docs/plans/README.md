# Execution-plan index

This directory indexes living, roadmap-task-scoped execution plans governed by [PLANS.md](../../PLANS.md). An ExecPlan is a detailed coordination, recovery, decision, and evidence-identity record subordinate to the [development roadmap](../DEVELOPMENT_ROADMAP.md), requirements, and Accepted ADRs. The separate [progress index](../progress/README.md) contains only concise task and agent-workflow summaries. Neither document can authorize implementation, change scope or status, or prove completion.

## Active plans

- [M1-02 — Establish the loopback service and single-file aggregate](m1-02-local-service-and-aggregate.md) — **In progress, planning only**. M1-01 is verified Complete. The plan bounds safe storage and the local service; exact persistence/lifecycle literals, commands, and side effects must pass the future R3 gate before guarded implementation. No service or persistence exists yet.

## Completed plans

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
