# Execution-plan index

This directory indexes living, roadmap-task-scoped execution plans governed by [PLANS.md](../../PLANS.md). An ExecPlan is a coordination and recovery record subordinate to the [development roadmap](../DEVELOPMENT_ROADMAP.md), requirements, and Accepted ADRs. It cannot authorize implementation, change scope or status, or prove completion.

## Active plans

None. Create a plan only after the project owner selects its existing roadmap task and the activation conditions in `PLANS.md` apply.

## Completed plans

None. Move a plan to `completed/` only after its owning roadmap task is `Complete` and the task-closure documentation gate passes. Create that directory with the first completed plan; do not add an empty archive.

## Naming and maintenance

- Use `docs/plans/<roadmap-id>-<short-slug>.md` while active.
- One plan owns exactly one status-bearing roadmap task.
- A standalone policy decision without a selected roadmap-task owner keeps its Decision Review Contract in the coordinating prompt; do not create a plan or synthetic task ID for it.
- Preserve the filename, stable identities, history, and revision notes when moving it to `docs/plans/completed/`.
- Update this index and repair affected links in the same change.
- Update canonical authorities before reflecting their changed state in a plan.

## Navigation

- [Execution-plan convention](../../PLANS.md)
- [Agent coordination workflow](../../.codex/README.md)
- [Development roadmap](../DEVELOPMENT_ROADMAP.md)
- [Project documentation index](../README.md)
