# Execution-plan convention

An execution plan is a living coordination record for selected development work that is too broad, parallel, externally gated, or interruption-prone to manage safely in one bounded task. It is subordinate to [AGENTS.md](AGENTS.md), the [development roadmap](docs/DEVELOPMENT_ROADMAP.md), requirements, ADRs, and derived specifications.

An execution plan cannot authorize implementation, introduce a new roadmap task hierarchy, change dependencies or status, accept an architecture decision, or prove completion. The roadmap remains the sole owner of task order and progress.

## When to create one

Create a plan only when at least one condition applies:

- the user explicitly requests an execution plan;
- the user selects a complete milestone or multiple dependent roadmap tasks;
- the user selects every task in one of the roadmap's approved parallel groups;
- an external model, provider, capacity, or evaluation gate requires durable observations and a restart point; or
- interruption or recovery risk makes a persistent coordination record materially useful.

Do not create one for a single bounded task that the primary agent or one worker can complete directly. Do not create an empty plan index or archive before the first real plan is needed.

## Ownership and location

One plan owns exactly one existing roadmap task, milestone, or roadmap-approved parallel group. Use its existing ID; do not invent `TASK-*` identifiers or another dependency graph.

Store a needed plan at `docs/plans/<roadmap-id>-<short-slug>.md`. Keep the path stable after completion. If the first plan is created, add a small `docs/plans/README.md` index and link it from `docs/README.md` in the same change.

The primary agent owns the plan. A delegated worker may report progress and discoveries, but it does not approve its own work, change canonical status, or rewrite the plan's authorities.

## Required structure

Use the smallest version of this structure that keeps the selected work resumable:

```markdown
# Execute <roadmap ID>: <observable outcome>

> Living coordination record; subordinate to canonical authorities and not completion evidence by itself.

## Authority and readiness
Selected existing task or milestone, user authorization, dependency and freeze checks, and exact requirement, ADR, roadmap, and specification links.

## Purpose and observable outcome
What changes and how a reviewer can observe the result.

## Scope and non-goals
Allowed paths, decisive boundaries, and forbidden expansion.

## Work slices
Dependency order, ownership, integration point, and stop conditions. Parallel ownership is allowed only where the roadmap already permits it. Concurrent writers require separate worktrees and separate baselines; otherwise the write slices remain serial.

## Validation and evidence
Exact checks and expected evidence. Do not invent commands before the relevant tooling exists, and do not use doubles as sole evidence for required real integrations.

## Progress and next step
Dated checkboxes for completed and remaining work, plus one explicit restart point.

## Discoveries and execution decisions
Facts and reversible execution choices only. Route significant architecture or product decisions to the canonical process before dependent work continues.

## Recovery
Safe repeat or resume steps that preserve unrelated user work.

## Outcome
Observed result, remaining limitations, and required roadmap or documentation reconciliation.
```

Link to canonical authorities instead of copying their contents. Keep only the progress section checklist-based. Update the plan when material facts change so another agent can resume without reconstructing hidden context.

## Completion

A plan may describe an achieved outcome only after the selected task's verification has run and the coordinator has inspected the actual diff and evidence. Plan completion alone never marks a roadmap task Complete. Do not move completed plans into an archive; stable links and a short final outcome are sufficient for this MVP.
