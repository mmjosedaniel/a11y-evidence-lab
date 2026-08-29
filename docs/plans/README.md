# Execution-plan index

This directory indexes living, roadmap-task-scoped execution plans governed by [PLANS.md](../../PLANS.md). An ExecPlan is a detailed coordination, recovery, decision, and evidence-identity record subordinate to the [development roadmap](../DEVELOPMENT_ROADMAP.md), requirements, and Accepted ADRs. The separate [progress index](../progress/README.md) contains only concise task and agent-workflow summaries. Neither document can authorize implementation, change scope or status, or prove completion.

## Active plans

- [RD-002 — Select the minimum development toolchain literals](rd-002-minimum-development-toolchain-literals.md) — **In progress**. The project owner selected RD-002 on 2026-08-29; the living plan owns its R2 selection contract, non-TDD setup route, and evidence identities.

## Completed plans

None. Move a plan to `completed/` only after its owning roadmap task is `Complete` and the task-closure documentation gate passes. Create that directory with the first completed plan; do not add an empty archive.

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
