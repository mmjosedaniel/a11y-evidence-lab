# Agent instructions

## Language

Everything in this repository must be written in English. This includes documentation, filenames, source code, tests, comments, identifiers, commit messages, logs, and user-facing text.

## Repository stage

This repository is development-ready for the accepted portfolio MVP. The planning baseline and [development roadmap](docs/DEVELOPMENT_ROADMAP.md) are established; the roadmap owns current task and implementation status.

Development work is permitted only for a concrete, dependency-ready roadmap task explicitly selected by the user after its directly applicable Accepted requirements, decisions, prerequisites, and evaluation-freeze conditions are satisfied. A milestone-level request must be decomposed into eligible roadmap tasks; activate and track each selected task independently, with its own roadmap status and, when required, its own ExecPlan. Keep each change bounded to its selected task; do not implement a whole milestone or the whole roadmap implicitly or pull Deferred, Proposed, release, or post-MVP work into scope.

Treat all described product behavior and technology choices as proposals unless a document explicitly records them as decisions. An evaluation baseline is not an implemented, release-qualified, or generally supported dependency. Update project status only after the corresponding implementation and verification evidence exists.

## Engineering principles

Apply these principles to application code, tests, configuration, documentation, and repository workflow:

- **YAGNI:** Implement only what the selected roadmap task and the Accepted MVP contract require now. Do not add speculative abstractions, extension points, generic subsystems, services, layers, configuration, dependencies, or workflow machinery for hypothetical future needs. Defer them until a demonstrated requirement and its owning task need them.
- **Do not over-engineer:** Choose the smallest complete solution that delivers the required observable behavior and verification. A future possibility alone is not a requirement. Introduce a generalized or shared abstraction only when current code has a demonstrated variation or repeated concept that it makes clearer. A focused local function, component, or module may instead be extracted for one distinct current responsibility when keeping it inline would make the changed unit materially less cohesive; one current consumer is sufficient, but hypothetical future reuse is not.
- **KISS:** Prefer direct, obvious designs and readable control flow over cleverness, indirection, or unnecessary flexibility. Keep interfaces, data models, modules, and processes as small as the accepted behavior permits.
- **Clean Code:** Use intention-revealing names, focused and cohesive functions and modules, explicit boundaries and error handling, behavior-oriented tests, and comments that explain why rather than restating what the code does. Keep each change locally understandable; remove duplication only when it represents the same proven concept.
- These principles do not authorize skipping an Accepted requirement, accessibility behavior, evidence traceability, validation, error handling, or an explicit privacy or security boundary. Simplify the implementation, not the contract.

### Small, cohesive modules from the start

- Implement the selected task as small, purpose-named modules, functions, and components from the first production change. Do not deliver a monolithic implementation with the expectation that the owner or a later task will split it. Identify the current responsibility boundaries in the existing assignment packet before coding; this is not a new planning artifact or permission to write production code before accepted Red.
- Give each module one coherent primary responsibility. Put independently understandable responsibilities in separate focused files when combining them would mix reasons to change. One current consumer is enough to justify such a module; future reuse is not required. Keep closely related details together when splitting them would add indirection without clarity.
- For React, keep application and page components focused on composition and necessary shared coordination. Implement meaningful forms, result lists, cards, and detail regions as named components when they have distinct current responsibilities. Keep local state with its owner and shared state at the nearest common owner; separate non-rendering logic when it has its own responsibility. Do not extract every wrapper, invent generic components, or add hooks merely to shorten JSX.
- For backend code, keep entry points and request handlers focused on boundary handling and coordination. Separate substantive validation, transformations, domain behavior, and persistence or external I/O when these responsibilities are present; do not invent empty layers, repositories, or services for future use.
- Before handoff, inspect the actual decomposition and resolve material responsibility mixing within the authorized scope. Passing tests alone do not establish clean structure. File length is a review signal, not a limit or an extraction target; never split code solely to satisfy a number or use a generic `utils` file as a catch-all.

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

Before implementation, confirm that the user explicitly selected the exact roadmap task, its dependencies are complete, its directly applicable Must requirements and open-decision portions are Accepted or explicitly Deferred, and its stated evaluation-freeze condition is satisfied. If the request names a milestone, perform this check separately for each eligible task; a milestone itself never receives task status or an ExecPlan. Ordinary implementation literals that the roadmap explicitly assigns to the selected task may remain open at entry and must be resolved inside that task; an unresolved significant or durable architecture decision still blocks dependent implementation and follows the ADR process. Do not mark a roadmap task Complete until its verification evidence exists.

When the selected task materially changes rendered UI, CSS, layout, visual hierarchy, responsive presentation, or visible interaction states, use the repository-local [frontend-quality skill](.agents/skills/frontend-quality/SKILL.md) as a bounded visual-quality overlay. It does not authorize development, change roadmap dependencies, add product behavior, or apply to nonvisual frontend or backend work.

## Agent coordination

For bounded repository research, decisions, implementation, and independent review, follow the full project-scoped [agent coordination workflow](.codex/README.md). Keep the primary agent responsible for authority interpretation, R/S risk and role routing, research synthesis, every authoritative research-derived repository write, implementation integration, evidence acceptance, approvals, roadmap-status changes, final verification, closure, and user communication. Explicit role-level model and reasoning settings prevent a high-effort primary coordinator from making every subagent equally expensive.

Use the objective `R0` through `R3` research route and issue [Research Assignment Capsule v1](.codex/README.md#research-assignment-capsule-v1) whenever a research role is needed. Consequential decision work uses the sole-writer topology and a living Decision Review Contract: keep it in the owning ExecPlan when the decision belongs to a selected roadmap task, or in the coordinating prompt when a standalone policy decision has no roadmap-task owner. Do not invent a plan or task ID solely to host that contract. Research, analysis, drafting, and review roles remain read-only. Their reports cannot accept an ADR, change a requirement or open-decision status, authorize implementation, or close a roadmap task.

For any roadmap task that changes application source, tests, dependencies, fixtures, or executable configuration—and for other substantial work when the owner requests it—maintain one living, task-scoped ExecPlan under `docs/plans/` according to [PLANS.md](PLANS.md). An ExecPlan is subordinate to the roadmap and canonical authorities; it cannot create another task graph, change dependencies or status, accept a decision, or prove completion. Move it to `docs/plans/completed/` only after its owning existing roadmap task is Complete and the documentation closure gate passes.

For an owner-authorized implementation ExecPlan whose existing roadmap task is `In progress`, use the [worker-first implementation workflow](.codex/execplan-implementation-workflow.md) and [ADR-0024](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md). Production behavior follows this repository's accepted milestone-slice TDD semantics: `test_worker` performs read-only preflight, writes one coherent Red or passing characterization when required, and a separate `code_worker` or, only for a rendered-UI slice, `frontend_code_worker` reaches minimum Green and may perform a behavior-preserving Refactor. Red, Green, and Refactor remain sequential. Documentation, declarative setup, corpus preparation, capacity screens, and external evaluations with no meaningful executable behavior use a separately recorded non-TDD route with structural, semantic, manual, or negative evidence instead of a fabricated Red.

For every application-source work slice, declare the current or planned production responsibility placement, dependency direction, reuse or bounded-creation disposition, and permitted local structural refactor in the common assignment packet. After behavioral Green, the implementation worker records the actual changed surface's cohesion disposition as `RETAINED`, `REFACTORED`, or `RECONCILE`; pre-Green and non-application-source outcomes use `None`. The coordinator and risk-routed reviewer inspect that fit independently. An allowed path contains writes but does not prove that the path is the right cohesive placement.

Every implementation-worker write turn requires a fresh path contract opened and terminally closed by the primary through the [automatic write-lease guard](.codex/write-lease-guard.md). A worker never manages its own lease. The test worker owns ordinary test creation and correction; the selected implementation worker never edits the accepted test contract during Green. The primary may make an exceptional direct test correction only between worker leases, must record the reason, paths, and validation in the ExecPlan, and must invalidate the affected Red or characterization evidence. The corrected test and fresh result must be accepted before that evidence is reused or Green continues. Other application source, dependency, fixture, or executable-configuration edits remain delegated through a bounded worker assignment. Primary-owned ExecPlan, authority, status, and guard-control maintenance occurs only between leases and is not an implementation-worker turn. Only one write lease may be active in one worktree; concurrent independent writers require separate worktrees, baselines, task-scoped ExecPlans, and an already authorized roadmap parallel group.

For a genuinely absent first production module/export, apply only the [first-module Red exception](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception): verify the environment, write the complete bounded behavioral tests, and identify the expected missing-callable failure honestly. Separate Green must execute every accepted test unchanged and pass the independent strict typecheck. This does not authorize a stub or bypass another readiness gate.

Write-capable workers may use Git only for read-only inspection. They must not stage, commit, push, create or change tags, refs, or branches, stash, alter worktrees, remotes, repository configuration, hooks, or otherwise mutate `.git` state.

Delegate only bounded work with exact authority anchors, permissions, expected output, execution budget, stop conditions, and—when writes are possible—selected roadmap scope, readiness evidence, accepted test boundary, paths, commands, and validation. Keep the source workflow's one bounded correction per role and stop on a changed contract, repeated decisive failure, two no-diff write handoffs, exhausted budget, conflicting authority, or unexpected overlapping change. The primary must inspect the actual worktree and cannot treat a worker report, reviewer verdict, or lease receipt as self-validating proof.

Apply the [engineering principles](#engineering-principles) to repository workflow as well as product code. Use only the roles, reviews, plan sections, abstractions, or parallelism triggered by the current work. The existence of eleven role definitions is capacity, not a requirement to invoke them all. Use the manual [progress index](docs/progress/README.md) for concise task-by-task project and agent-workflow summaries: create one record only after an existing roadmap task enters `In progress`, and update it only after accepted material checkpoints or closure. The roadmap, ExecPlan, authorities, and evidence remain controlling. Do not log every agent turn, prompt, transcript, token count, or cost, and do not add workflow telemetry or a generated progress ledger.

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
