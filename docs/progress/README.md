# Project and agent-workflow progress

## Purpose and authority

This directory provides a concise, public, task-by-task narrative of project progress and the agent workflow actually used. It is a manual summary layer, not another task system.

The [development roadmap](../DEVELOPMENT_ROADMAP.md) remains authoritative for task order, dependencies, and status. A task-scoped [ExecPlan](../plans/README.md) remains authoritative for live coordination, recovery, decisions, and evidence identity. Requirements and Accepted ADRs remain authoritative for product and architecture decisions. A progress record cannot authorize work, change scope or status, approve a decision, prove implementation, satisfy verification, or close a task.

If a progress record disagrees with an authority or ExecPlan, the controlling source wins and the progress summary must be corrected. Change an authority or ExecPlan only when an accepted new fact independently requires that change; update it before, or coherently with, the summary.

## Selected structure

| Strategy | Disposition |
| --- | --- |
| One growing chronological log | Rejected because unrelated tasks would mix and the file would become noisy and conflict-prone. |
| Daily, session, or per-agent files | Rejected because they encourage activity telemetry, fragmented history, and private or low-value detail. |
| One file per milestone | Rejected because milestones are too coarse for task ownership and agent-workflow lessons. |
| Roadmap and ExecPlans only | Retained as the authoritative sources, but they do not provide the concise portfolio narrative requested here. |
| One indexed file per existing roadmap task | Selected because stable roadmap IDs provide bounded ownership, traceability, and a natural place for both project and agent-workflow outcomes. |

Do not create empty files for future tasks. Create a record only after an existing roadmap task is selected, its canonical status becomes `In progress`, and work actually starts. `RD-001` predates this convention and is not reconstructed without contemporaneous evidence.

## Progress index

RD-002 is the first task recorded under this convention and is Complete. Toolchain checks, independent reviews, cleanup, and documentation closure passed. RD-003 is Ready but unselected; application implementation has not started.

Add each new task record to this table in the same change that creates the file:

| Roadmap task | Progress record | ExecPlan | Mirrored roadmap status | Updated |
| --- | --- | --- | --- | --- |
| [RD-002](../DEVELOPMENT_ROADMAP.md#rd-002--select-the-minimum-development-toolchain-literals) | [Minimum development toolchain literals](rd-002-minimum-development-toolchain-literals.md) | [Task plan](../plans/completed/rd-002-minimum-development-toolchain-literals.md) | Complete | 2026-08-30 |

The mirrored status is a convenience snapshot only. The roadmap controls when a task is `Not started`, `In progress`, `Blocked`, or `Complete`.

## Naming and lifecycle

- Use `docs/progress/<roadmap-id>-<short-slug>.md`, for example `RD-002-minimum-development-toolchain-literals.md`.
- Keep one file for the task's lifetime. Append material dated checkpoints rather than creating daily or per-agent files.
- Update the record only after the primary coordinator accepts a material work-slice or integration checkpoint or completes task closure. Include a blocker or next-boundary change only when it is part of that accepted material checkpoint.
- Update the roadmap and ExecPlan or other evidence owner before, or coherently with, the progress record. At closure, prepare the roadmap status change and mirrored `Complete` value in the same final reconciliation only after the task's Verification evidence exists and the candidate closure documentation passes proportional validation. Accept them together through the documentation gate; the mirror neither causes nor independently proves Verification or gate success.
- Keep completed records in this directory. Do not add active/completed subdirectories until volume creates a demonstrated navigation problem.

## Content boundary

Record only:

- the material project outcome that became true or observable;
- the agent roles and TDD, setup, research, or review route actually used when they affected the outcome;
- accepted barriers, correction or review outcomes, and one useful coordination lesson when applicable;
- links to the ExecPlan, authoritative changes, and decisive evidence; and
- the next roadmap boundary or explicit blocker.

Do not copy prompts, conversations, transcripts, raw worker or reviewer reports, ignored lease records, credentials, private evidence, token or cost counters, per-agent activity metrics, or detailed command output. Do not automate these records with hooks or telemetry.

## Minimal task-record template

```markdown
# <ROADMAP-ID> — <Roadmap task title>

> This is a non-authoritative progress narrative. The development roadmap owns
> task status, and the task ExecPlan owns live execution and evidence.

- **Roadmap task:** [<ROADMAP-ID>](../DEVELOPMENT_ROADMAP.md#<task-anchor>)
- **Mirrored roadmap status:** In progress | Blocked | Complete
- **ExecPlan:** [Task plan](../plans/<roadmap-id>-<short-slug>.md) | Not required, with reason
- **Last updated:** YYYY-MM-DD

## YYYY-MM-DD — <Material checkpoint>

- **Project outcome:** What materially became true or observable.
- **Agent-workflow outcome:** Roles and route actually used, accepted review or correction result, and any useful lesson.
- **Evidence:** Links to the ExecPlan, authoritative changes, and decisive validation.
- **Next boundary:** The next dependency, checkpoint, or explicit blocker.
```

## Navigation

- [Development roadmap](../DEVELOPMENT_ROADMAP.md)
- [Execution-plan index](../plans/README.md)
- [Agent coordination workflow](../../.codex/README.md)
- [Project documentation index](../README.md)
