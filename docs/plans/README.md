# Execution-plan index

This directory indexes living, roadmap-task-scoped execution plans governed by [PLANS.md](../../PLANS.md). An ExecPlan is a detailed coordination, recovery, decision, and evidence-identity record subordinate to the [development roadmap](../DEVELOPMENT_ROADMAP.md), requirements, and Accepted ADRs. The separate [progress index](../progress/README.md) contains only concise task and agent-workflow summaries. Neither document can authorize implementation, change scope or status, or prove completion.

## Active plans

None.

## Completed plans

These archives preserve each task's execution, review, failures, and closure evidence. The roadmap remains the status authority.

- [M5-02 — Conservative comparison](completed/m5-02-conservative-comparison.md)

- [M5-01 — Intentional rescan](completed/m5-01-intentional-rescan.md)

- [M3-03 — Qwen adapter and capacity screen](completed/m3-03-qwen-adapter-and-capacity-screen.md)

- [M4-03 — Review checkpoint](completed/m4-03-review-checkpoint.md)

- [M4-02 — Accessible review UI](completed/m4-02-accessible-review-ui.md)

- [M4-01 — Review behavior and persistence](completed/m4-01-review-behavior-and-persistence.md)

- [M3-05 — Generation checkpoint](completed/m3-05-generation-checkpoint.md)

- [M3-04 — Groq adapter](completed/m3-04-groq-adapter.md)

- [M3-02 — Shared generation stage](completed/m3-02-shared-generation-stage.md)
- [M3-01 — Freeze generation evaluation package](completed/m3-01-generation-evaluation-package.md)

- [M2-04 — Retrieval checkpoint](completed/m2-04-retrieval-checkpoint.md)
- [M2-03 — Sufficiency, abstention, and detail UI](completed/m2-03-sufficiency-abstention-and-detail-ui.md)
- [M2-02 — Embedding retrieval and capacity gate](completed/m2-02-embedding-retrieval-capacity-gate.md)
- [M2-01 — Closed corpus snapshot](completed/m2-01-closed-corpus-snapshot.md)
- [M1-05 — Walking-skeleton integration](completed/m1-05-walking-skeleton-integration.md)
- [M1-04 — Target and results UI](completed/m1-04-target-and-results-ui.md)
- [M1-03 — Real scan and evidence](completed/m1-03-real-scan-and-evidence.md)
- [M1-02 — Establish the loopback service and single-file aggregate](completed/m1-02-local-service-and-aggregate.md)
- [M1-01 — Define the minimum run and scan contracts](completed/m1-01-run-and-scan-contracts.md)
- [RD-003 — Freeze the walking-skeleton evaluation boundary](completed/rd-003-scan-evaluation-boundary.md)
- [RD-002 — Select the minimum development toolchain literals](completed/rd-002-minimum-development-toolchain-literals.md)

Move a plan to `completed/` only after its owning roadmap task is `Complete` and the task-closure documentation gate passes. Do not create an empty archive for a future task.

## Naming and maintenance

- Use `docs/plans/<roadmap-id>-<short-slug>.md` while active.
- One plan owns exactly one status-bearing roadmap task; use its [current-state route](../../PLANS.md#current-state-and-resumption) for resumption and link historical evidence.
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
