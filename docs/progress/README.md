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

RD-002 is the first task recorded under this convention and is Complete. Toolchain checks, independent reviews, cleanup, and documentation closure passed. RD-003 reached a synthesis stop for cleanup visibility, then received owner allowance for one additional correction and analyst recheck. The recheck and fresh pre-draft review passed, and its primary-authored manifest passed the separate final research review. The first guarded bootstrap then failed at its frozen dependency-inspection command after task-local downloads. Its lease closed compliantly without fixture writes. The owner authorized that bounded correction and reuse; the fresh correction review passed with no findings. The resumed setup and six native observations then passed. S3 and different fresh integrated reviews passed, the documentation follow-up was resolved, and cleanup/documentation closure passed. RD-003 was subsequently reopened for owner-requested LF checkout and clean-start corrections after independent review and primary verification. LF checkout verification passed, but clean-start acquisition stopped at a network-permission denial. The single authorized network-enabled retry passed acquisition, strict typechecking, and structural validation. Independent S3/integrated reviews, final cleanup, and renewed documentation closure then passed. RD-003 is Complete again. Original native outcomes, budgets, and failures are preserved. Six fixtures and a scan-only manifest exist. M1-01 contract execution initially stopped on first-module Red acceptance and URL retention. The owner has since authorized ADR-0024's narrow first-module Red exception and reaffirmed trusted-developer URL choice. Pinned Node/npm setup passed; M1-01 is Complete after both R3 checkpoints, guarded TDD, corrected S3 review, integrated review and documentation closure. The pure contract module and 58 tests pass strict verification; integrated review and documentation closure passed. The subsequent M1-02 service/storage task is Complete after verification and closure; at its closure no scanner or UI existed.

M1-02 is Complete. Its [archived ExecPlan](../plans/completed/m1-02-local-service-and-aggregate.md) preserves planning, both R3 checkpoints, the pre-write ignore gate, separate guarded TDD slices and the service notification correction. All 182 product tests, independent strict typechecking, actual startup/reopen/stop and exact synthetic-run deletion passed. Both slice S3 reviews and the different final integrated critical review passed; documentation closure is accepted.

M1-03 is Complete. Both scanner slices and their S3 reviews are accepted. All 290 integrated tests and independent strict typechecking pass, including the failed-launch residue regression. The different final integrated critical review, exact task-owned runtime cleanup and documentation closure passed. At M1-03 closure, M1-04 and M1-05 were unselected. No lease or owned runtime operation remains. The task-local browser runtime and both scratch roots were removed after review; shared caches and dependencies remain untouched.

[M1-04](../plans/completed/m1-04-target-and-results-ui.md) is Complete after the accepted OD-027 presentation, purpose-named component extraction, integrated-review correction, complete regression, independent reviews, exact cleanup, and documentation closure. [M1-05](../plans/m1-05-walking-skeleton-integration.md) is In progress after accepted internal local-service and scanner structural slices; HTTP integration remains unimplemented.

Add each new task record to this table in the same change that creates the file:

| Roadmap task | Progress record | ExecPlan | Mirrored roadmap status | Updated |
| --- | --- | --- | --- | --- |
| [RD-002](../DEVELOPMENT_ROADMAP.md#rd-002--select-the-minimum-development-toolchain-literals) | [Minimum development toolchain literals](rd-002-minimum-development-toolchain-literals.md) | [Task plan](../plans/completed/rd-002-minimum-development-toolchain-literals.md) | Complete | 2026-08-30 |
| [RD-003](../DEVELOPMENT_ROADMAP.md#rd-003--freeze-the-walking-skeleton-evaluation-boundary) | [Scan evaluation boundary](rd-003-scan-evaluation-boundary.md) | [Task plan](../plans/completed/rd-003-scan-evaluation-boundary.md) | Complete | 2026-08-30 |
| [M1-01](../DEVELOPMENT_ROADMAP.md#m1-01--define-the-minimum-run-and-scan-contracts) | [Minimum run and scan contracts](m1-01-run-and-scan-contracts.md) | [Task plan](../plans/completed/m1-01-run-and-scan-contracts.md) | Complete | 2026-08-30 |
| [M1-02](../DEVELOPMENT_ROADMAP.md#m1-02--establish-the-loopback-service-and-single-file-aggregate) | [Local service and aggregate](m1-02-local-service-and-aggregate.md) | [Task plan](../plans/completed/m1-02-local-service-and-aggregate.md) | Complete | 2026-08-30 |
| [M1-03](../DEVELOPMENT_ROADMAP.md#m1-03--implement-the-real-exact-three-rule-scan-and-minimized-evidence) | [Real scan and evidence](m1-03-real-scan-and-evidence.md) | [Task plan](../plans/completed/m1-03-real-scan-and-evidence.md) | Complete | 2026-08-31 |
| [M1-04](../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results) | [Target and results UI](m1-04-target-and-results-ui.md) | [Task plan](../plans/completed/m1-04-target-and-results-ui.md) | Complete | 2026-09-02 |
| [M1-05](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton) | [Walking-skeleton integration](m1-05-walking-skeleton-integration.md) | [Task plan](../plans/m1-05-walking-skeleton-integration.md) | In progress | 2026-09-02 |

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
