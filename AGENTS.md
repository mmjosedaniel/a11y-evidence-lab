# Agent instructions

## Language

Everything in this repository must be written in English. This includes documentation, filenames, source code, tests, comments, identifiers, commit messages, logs, and user-facing text.

## Repository stage

This repository is development-ready for the accepted portfolio MVP. The planning baseline and [development roadmap](docs/DEVELOPMENT_ROADMAP.md) are established, but implementation has not started.

Development work is permitted only for a concrete user-requested roadmap task or milestone after its directly applicable Accepted requirements, decisions, prerequisites, and evaluation-freeze conditions are satisfied. Keep each change bounded to that selected slice; do not implement the whole roadmap implicitly or pull Deferred, Proposed, release, or post-MVP work into scope.

Treat all described product behavior and technology choices as proposals unless a document explicitly records them as decisions. An evaluation baseline is not an implemented, release-qualified, or generally supported dependency. Update project status only after the corresponding implementation and verification evidence exists.

## Required context and task routing

Before making changes:

- Inspect Git status and preserve unrelated user changes.
- Read `docs/README.md` as the authority map and task router.
- Read each target document completely and load only the requirements modules, architecture records, feasibility evidence, or product-context documents that the task route identifies as applicable.
- Read `docs/PROJECT_REQUIREMENTS.md` when changing the main goal, shared requirement semantics, requirement status, traceability, module ownership, development authorization, or a decision that affects multiple modules.
- Read `docs/DEVELOPMENT_ROADMAP.md` when preparing an execution plan, starting or completing implementation work, changing milestone order or task status, or assessing dependencies and integration checkpoints. Resolve the selected task's stable IDs through its authority-location key, then read every named requirement row, decision, evaluation boundary, and specification scenario.
- Read `docs/PROJECT_CONCEPT.md` and `docs/PROJECT_CONTEXT.md` when changing product purpose, direction, workflow, boundaries, users, or public positioning.
- Read `docs/architecture/README.md`, `docs/architecture/CANDIDATE_ARCHITECTURE.md`, and the applicable records in `docs/architecture/decisions/` when evaluating or changing architecture. Read a candidate assessment only when its evidence is relevant to the task.
- Read `docs/LOCAL_MVP_FEASIBILITY.md` and the applicable requirement and decision records when evaluating tools, models, runtimes, packaging, hardware, or local capacity.

Do not load every requirements module by default. Follow the task router, then follow direct links to the authorities affected by the change.

Before implementation, confirm that the user selected a concrete roadmap task or milestone, its dependencies are complete, its directly applicable Must requirements and open-decision portions are Accepted or explicitly Deferred, and its stated evaluation-freeze condition is satisfied. Do not mark a roadmap task Complete until its verification evidence exists.

When the selected task materially changes rendered UI, CSS, layout, visual hierarchy, responsive presentation, or visible interaction states, use the repository-local [frontend-quality skill](.agents/skills/frontend-quality/SKILL.md) as a bounded visual-quality overlay. It does not authorize development, change roadmap dependencies, add product behavior, or apply to nonvisual frontend or backend work.

## Agent coordination

For bounded repository research, decisions, implementation, and independent review, follow the full project-scoped [agent coordination workflow](.codex/README.md). Keep the primary agent responsible for authority interpretation, R/S risk and role routing, research synthesis, every authoritative research-derived repository write, implementation integration, evidence acceptance, approvals, roadmap-status changes, final verification, closure, and user communication. Explicit role-level model and reasoning settings prevent a high-effort primary coordinator from making every subagent equally expensive.

Use the objective `R0` through `R3` research route and issue [Research Assignment Capsule v1](.codex/README.md#research-assignment-capsule-v1) whenever a research role is needed. Consequential decision work uses the sole-writer topology and a living Decision Review Contract: keep it in the owning ExecPlan when the decision belongs to a selected roadmap task, or in the coordinating prompt when a standalone policy decision has no roadmap-task owner. Do not invent a plan or task ID solely to host that contract. Research, analysis, drafting, and review roles remain read-only. Their reports cannot accept an ADR, change a requirement or open-decision status, authorize implementation, or close a roadmap task.

For any roadmap task that changes application source, tests, dependencies, fixtures, or executable configuration—and for other substantial work when the owner requests it—maintain one living, task-scoped ExecPlan under `docs/plans/` according to [PLANS.md](PLANS.md). An ExecPlan is subordinate to the roadmap and canonical authorities; it cannot create another task graph, change dependencies or status, accept a decision, or prove completion. Move it to `docs/plans/completed/` only after its owning existing roadmap task is Complete and the documentation closure gate passes.

For an owner-authorized implementation ExecPlan whose existing roadmap task is `In progress`, use the [worker-first implementation workflow](.codex/execplan-implementation-workflow.md) and [ADR-0024](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md). Production behavior follows the same milestone-slice TDD semantics used by the Rick and Morty reference workflow: `test_worker` performs read-only preflight, writes one coherent Red or passing characterization when required, and a separate `code_worker` or, only for a rendered-UI slice, `frontend_code_worker` reaches minimum Green and may perform a behavior-preserving Refactor. Red, Green, and Refactor remain sequential. Documentation, declarative setup, corpus preparation, capacity screens, and external evaluations with no meaningful executable behavior use a separately recorded non-TDD route with structural, semantic, manual, or negative evidence instead of a fabricated Red.

Every implementation-worker write turn requires a fresh path contract opened and terminally closed by the primary through the [automatic write-lease guard](.codex/write-lease-guard.md). A worker never manages its own lease. The test worker owns ordinary test creation and correction; the selected implementation worker never edits the accepted test contract during Green. The primary may make an exceptional direct test correction only between worker leases, must record the reason, paths, and validation in the ExecPlan, and must invalidate the affected Red or characterization evidence. The corrected test and fresh result must be accepted before that evidence is reused or Green continues. Other application source, dependency, fixture, or executable-configuration edits remain delegated through a bounded worker assignment. Primary-owned ExecPlan, authority, status, and guard-control maintenance occurs only between leases and is not an implementation-worker turn. Only one write lease may be active in one worktree; concurrent independent writers require separate worktrees, baselines, task-scoped ExecPlans, and an already authorized roadmap parallel group.

Write-capable workers may use Git only for read-only inspection. They must not stage, commit, push, create or change tags, refs, or branches, stash, alter worktrees, remotes, repository configuration, hooks, or otherwise mutate `.git` state.

Delegate only bounded work with exact authority anchors, permissions, expected output, execution budget, stop conditions, and—when writes are possible—selected roadmap scope, readiness evidence, accepted test boundary, paths, commands, and validation. Keep the source workflow's one bounded correction per role and stop on a changed contract, repeated decisive failure, two no-diff write handoffs, exhausted budget, conflicting authority, or unexpected overlapping change. The primary must inspect the actual worktree and cannot treat a worker report, reviewer verdict, or lease receipt as self-validating proof.

Apply YAGNI to repository workflow as well as product code. Use only the roles, reviews, plan sections, or parallelism triggered by the current work. The existence of eleven role definitions is capacity, not a requirement to invoke them all. Use the manual [progress index](docs/progress/README.md) for concise task-by-task project and agent-workflow summaries: create one record only after an existing roadmap task enters `In progress`, and update it only after accepted material checkpoints or closure. The roadmap, ExecPlan, authorities, and evidence remain controlling. Do not log every agent turn, prompt, transcript, token count, or cost, and do not add workflow telemetry or a generated progress ledger.

## Documentation rules

- Keep the repository minimal. Update the existing document or module whose declared responsibility owns the information; create another document only for a distinct responsibility that cannot remain coherent in an existing authority.
- Clearly distinguish ideas, decisions, assumptions, and implemented behavior.
- Keep architecture documentation under `docs/architecture/` and index it from `docs/architecture/README.md`.
- Record accepted significant architectural decisions in `docs/architecture/decisions/` and link each record from its `README.md`; keep speculative alternatives in explicitly Proposed candidate documents.
- Do not present the future product as an accessibility certification tool.
- After moving or renaming documents, update affected indexes and references and verify that relative links resolve.

## Task-closure documentation gate

Before marking any repository task Complete or presenting a final implementation handoff:

1. Compare the completed scope, changed paths, decisions, and new evidence with the documentation authority map.
2. Update every materially affected authority, navigation link, roadmap status, development instruction, and current-status statement; preserve superseded decision history.
3. For read-only work, report required documentation follow-ups without modifying files.
4. Run proportional configuration, link, authority-consistency, formatting, and task-specific validators.
5. End the handoff with an explicit documentation-impact statement, including a concrete reason when no documentation change was needed.

The primary coordinator owns this gate. A roadmap task is not Complete until the gate and the task's own Verification both pass.

## Public content

- Keep tracked documentation professional and project-focused.
- Do not copy private or ignored working material into tracked files unless explicitly requested.
- Do not include credentials, private data, proprietary material, or personal conversation history.
- Verify time-sensitive technical claims against primary sources and include direct links.

## Git operations

- Do not commit, publish, or push changes without explicit user authorization.
