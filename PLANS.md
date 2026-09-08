# Repository execution plans (ExecPlans)

This document defines the required format for a repository execution plan, or ExecPlan. An ExecPlan is a living, roadmap-task-scoped design and execution document that a person or coding agent can follow from the current working tree without relying on prior conversation. The canonical task graph, dependencies, statuses, and scope remain in the [development roadmap](docs/DEVELOPMENT_ROADMAP.md); an ExecPlan only decomposes one existing roadmap task into concrete work and evidence.

## When to use an ExecPlan

Use an ExecPlan whenever an existing `RD-*` or `M1-*` through `M6-*` roadmap task changes application source, tests, dependencies, fixtures, or executable configuration. Also use one when a task requires staged research, an approval checkpoint, multiple independently verifiable work slices, recovery instructions, or a durable decision record, and whenever the project owner explicitly requests it. Documentation-only work outside those triggers does not need an empty plan.

Store active plans directly under `docs/plans/` as `<roadmap-id>-<short-slug>.md`. Move a plan to `docs/plans/completed/` only after its owning roadmap task is `Complete` and has passed the [task-closure documentation gate](docs/README.md#task-closure-documentation-gate). Register active and completed plans in the [plan index](docs/plans/README.md), preserve the stable filename and execution history, and repair inbound links when moving a plan.

One ExecPlan owns exactly one status-bearing roadmap task. A roadmap-approved parallel group therefore uses one plan per participating task, separate worktrees and baselines for concurrent writers, and the roadmap's named integration checkpoint. A standalone policy decision with no selected roadmap-task owner keeps its Decision Review Contract in the coordinating prompt under the agent workflow; it does not create an ExecPlan or synthetic task ID. An ExecPlan must not create product scope, change roadmap dependencies or status, approve an ADR, change a requirement, or claim implementation evidence. If execution reveals a conflict or consequential choice outside the owning task, update the authoritative owner or stop for the applicable decision before dependent work continues.

## Required operating rules

Every ExecPlan must be self-contained as a resumption guide: a newcomer can find its current contract and all required evidence without prior conversation. Summarize the relevant state and terms, and link exact repository-relative paths and stable roadmap, requirement, ADR, `BHV-*`, `SPEC-*`, and `HS-*` identifiers instead of copying their authoritative prose. Self-contained does not mean duplicating the workflow or every past command.

Every ExecPlan is a living document. Update it whenever progress is made, evidence changes, a material discovery occurs, or an execution decision is taken. At every stopping point, say what is complete, what remains, and what should happen next. A reader must be able to restart from the plan alone.

Every ExecPlan must lead to an observable, falsifiable outcome. For application work, describe the behavior and how a reviewer exercises it. For internal, documentation, or decision work, describe the authoritative artifact, validator, approval, state transition, and negative checks that prove the intended boundary was preserved.

Follow the [repository instructions](AGENTS.md), [documentation authority map and task router](docs/README.md), exact task in the [development roadmap](docs/DEVELOPMENT_ROADMAP.md), mapped requirements, applicable Accepted ADRs, evaluation-freeze boundary, and only the [derived specifications](docs/specs/README.md) routed by the task. An ExecPlan cannot weaken the repository's language, evidence, preservation, [YAGNI, KISS, Clean Code, and anti-over-engineering principles](AGENTS.md#engineering-principles), TypeScript, TDD, or closure policies.

For write-authorized production behavior, use the [worker-first ExecPlan implementation workflow](.codex/execplan-implementation-workflow.md). The primary coordinator delegates bounded edits sequentially to `test_worker` and exactly one implementation worker, gives each assignment a `Milestone Assignment Packet v2`, and opens and terminally closes its exact path lease through the [automatic write-lease guard](.codex/write-lease-guard.md). The `standard` profile uses `code_worker`; only a work slice that materially changes rendered UI uses the conditional `frontend-visual` profile, [frontend-quality skill](.agents/skills/frontend-quality/SKILL.md), and `frontend_code_worker`. A non-behavioral setup assignment uses a separately justified `TDD: Not applicable` route directly to guarded `code_worker` setup, structural validation, and proportional review. One instance of each selected writer may remain live for bounded follow-ups within the same work slice, but every worker write turn requires a fresh packet and lease. The coordinator retains integration, evidence acceptance, exception handling, authoritative status, and closure. The test worker owns ordinary test edits; an exceptional direct coordinator test correction may occur only between leases, records its reason, paths, and validation, and invalidates the affected test evidence. The revised test and fresh result must be accepted before that evidence is reused or Green resumes. Decision work uses the sole-writer topology in the [project-scoped Codex workflow](.codex/README.md).

## Format

Write one Markdown document. Do not surround it with an outer code fence. Use prose first; use tables or lists only when they make traceability or alternatives materially easier to compare.

Begin with a short action-oriented H1 and this statement:

    This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

The following sections are mandatory and remain present for the life of the plan.

## Required living sections

### Current state and resumption

Place a compact `Current state` section immediately after the opening statement. Keep only the owning task and roadmap link, current authorized scope and applicable gates, latest accepted barrier and evidence links, unresolved findings or blockers, remaining correction/attempt allowance, active lease or `None`, and next action with its controlling section. Link the current work-slice contract, commands, validation, recovery instructions, and relevant decision records. This section summarizes those owners; it cannot authorize an effect, renew a grant, accept evidence, or change task status.

For a routine checkpoint or current-state update that changes no scope, binding contract, authority, command, or recovery semantics, read this section, the complete current task/work-slice contract and applicable authorities, affected living sections, and every evidence or history section the update relies on. Search the whole plan for affected IDs and superseding entries; expand reading to resolve conflicts or uncertain dependencies. Only then may unchanged, unrelated historical bodies be left unread. If the current route is missing or ambiguous, or the change alters those semantics or reorganizes history, read the complete plan before editing. This exception changes no required reviewer coverage or evidence-freshness rule.

Keep superseded command packages and detailed execution history under clearly labeled historical subsections in the same plan, with stable headings, IDs, source bodies, and evidence identities preserved. The current route must identify what supersedes them; historical commands and consumed grants are not execution permission. Link history from living sections instead of repeating it in each one. Preserve completed plans as historical evidence; this convention does not require retrofitting every archive or creating a second plan, summary file, or telemetry ledger.

### Progress

Use timestamped checkboxes. This is the only section where checklists are mandatory. Record completed, remaining, and split partial work accurately; never mark approval, validation, implementation, or acceptance complete without evidence.

    - [x] (2026-08-28 00:00Z) Example completed step with its evidence location.
    - [ ] Example remaining step.
    - [ ] Example partial step (completed: exact portion; remaining: exact portion).

### Surprises & Discoveries

Record facts that changed or constrained the approach. Pair each observation with concise evidence such as a path, command, or short output. Do not record ordinary planned work here.

### Decision Log

Record every material execution-plan decision and why it was made:

    - Decision: The execution choice.
      Rationale: The evidence and trade-off.
      Date/Author: 2026-08-28 / role.

An ExecPlan decision is not architectural approval. A significant architectural choice still follows the ADR process and any required project-owner approval.

### Outcomes & Retrospective

At each major work slice and at completion, compare the observed result with the original purpose. Record what was achieved, what remains, unexpected costs, and lessons that should affect later work. An empty initial entry may state that execution has not started. The manual [project-progress directory](docs/progress/README.md) may summarize only coordinator-accepted task and agent-workflow outcomes; this ExecPlan remains the detailed execution and evidence record. Update the task summary only at material checkpoints or closure, and do not add telemetry or a generated progress ledger.

## Required execution sections

### Purpose / Big Picture

Explain why the work matters, what becomes possible afterward, and how a reviewer will observe success. Distinguish planning intent from current implementation evidence.

### Context and Orientation

Describe the relevant repository state. Name the authoritative files, explain how they relate, define non-obvious terms, identify prerequisites and freeze conditions, and state every assumption.

### Scope and Non-Goals

State what the owning roadmap task includes and excludes. Preserve Accepted, Proposed, Deferred, evaluation-only, and post-MVP classifications. Identify any work blocked by a readiness or evaluation-freeze condition.

### Plan of Work

Before proposing substantial custom setup or evaluation tooling, identify the smallest proof that satisfies each applicable Accepted contract and its adverse cases. Reuse existing tools and fresh evidence; compare a bounded direct or developer-managed procedure when it can satisfy the same boundary. If preparation or recovery starts requiring a separate substantial tool, reconsider its necessity and remaining budget before another attempt. Record that reasoning here, without a new planning phase or artifact. Changing an Accepted proof or safety boundary still follows its authority and risk route; simplicity never authorizes skipping it.

Describe the dependency-ordered sequence in prose. For each coherent work slice, state what will exist afterward, the observable contract, the preflight target when TDD applies, current test and implementation ownership, risk tier, exact authority anchors, allowed and forbidden paths, focused and task-level commands, reusable evidence identities, execution budget, expected handoff, and condition for advancing. For a slice that changes application source, also record the compact responsibility-and-cohesion contract projected into Milestone Assignment Packet v2: each existing or planned production path or symbol and its primary responsibility, the responsibility added by the slice and why that placement fits, dependency, runtime-call, or interface-edge changes, the reuse, justified separation, bounded creation, or local-extraction disposition, and any permitted bounded structural refactor. Use `None — no application-source responsibility changes` for setup or other slices that change no application-source responsibility.

The standard route records no profile field. Only `frontend-visual` adds the conditional profile marker, accepted reuse-audit identity, UI/design anchors, state and viewport matrix, and real-browser evidence target required by the conditional packet capsule. Identify read-only or separately worktree-isolated branches that may run in parallel. Red, Green, and Refactor remain sequential within a behavior-bearing work slice. Record `TDD: Not applicable` and the replacement evidence for a non-behavioral setup; other exceptions are stop-and-triage conditions.

### Decision Review Contract (decision work only)

When the owning task compares consequential options or prepares an ADR, create a living Decision Review Contract inside the ExecPlan before comparative research starts. It is a workflow contract, not another authority or a substitute for the ADR. Record the objective `R1`, `R2`, or `R3` tier and triggers. R2 or R3 may use one bounded, non-ranking discovery pass after stable scope, authority, basic criteria, approval boundary, and forbidden changes are recorded; then freeze the candidate set, evidence dimensions, hard gates, and triggered invariants.

Identify the exact roadmap task, tier and triggers, proposed artifact, approval boundary, forbidden scope, common criteria, evidence classes, required artifact-local outputs, hard gates, status and recommendation invariants, decide-now versus prove-later semantics, applicable adversarial properties, researcher assignment basis, analyst and single-drafter triggers, correction and escalation rules, budget, and stopping conditions.

Define a compact cumulative invariant packet. Each invariant needs a plan-local ID, trigger or fixture, expected result, evidence or actual result, and responsible reviewer. Every packet covers artifact completeness, evidence honesty, and authority-state consistency. Add triggered invariants for state transitions, concurrency, integrity, identity, deterministic bytes, cross-platform equivalence, recovery, or ownership when the proposed decision contains those properties.

After the research barrier, the synthesis owner returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. The primary may own straightforward R1/R2 synthesis; `decision_analyst` is mandatory for R3 and conditional for R2 under the [routing rules](.codex/README.md#decision-review-contract-and-risk-tier). `DRAFT READY` permits primary drafting or one read-only `research_drafter` transformation after required checkpoints; it does not approve an ADR or authorize the drafter to write.

### Concrete Steps

Give exact commands and working directories, linking maintained developer preparation from the [current README](README.md#development-command-preparation). Commands must match current repository evidence or be labeled as future commands that become authoritative only after the applicable task creates them. Include short expected results. Apply the implementation workflow's [command preparation](.codex/execplan-implementation-workflow.md#command-preparation) to the actual caller and failure boundaries, including primary-run evaluation commands.

### Validation and Acceptance

Define observable acceptance in terms of behavior, authoritative state, or reproducible validator output. For production behavior, include the preflight classification and exact Red failure, Green pass, and task-level validation required by [ADR-0024](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md). For existing behavior, record existing passing coverage or characterization evidence without fabricating a Red. For declarative, documentation, capacity-screen, or decision work with no production behavior, explain why TDD does not apply and define the structural, semantic, manual, or negative checks that replace it.

For worker-first implementation, record assignment identity, responsible worker, terminal lease result, preflight route or justified `TDD: Not applicable` setup route, exact Red and Green commands when applicable, task-level validation, the implementation worker's changed-surface cohesion disposition, coordinator acceptance, any exceptional direct coordinator test correction, evidence invalidation or reuse under an unchanged fingerprint, and the risk-routed reviewer verdict. A packet, worker summary, passing test, or guard result cannot replace inspection of the actual diff, its responsibility fit, and task-authoritative validation.

For decision work, record research tier and triggers, capsule/report identities, synthesis owner and result, draft provenance when applicable, contract-checkpoint result, and fresh final evidence-checkpoint result. Re-run the complete applicable invariant packet after every material revision and every R3 correction.

### Idempotence and Recovery

Explain which steps are safe to repeat, how to resume after partial failure, and how unrelated work remains preserved. Prefer additive recovery. Never use destructive recovery when a targeted edit or preserved record is sufficient.

If multiple agents share a worktree, define path ownership, terminal lease closure, and who may resume after a failed handoff. An unexpected path or guard failure stops writes without reverting user or peer work. Reconcile the tree and last accepted barrier before a fresh assignment; never redefine an active lease or run Red and Green writers concurrently.

### Artifacts and Notes

Retain only the short transcripts, path lists, decision matrices, or excerpts needed to prove or resume work. For a worker-first run, retain assignment and terminal-lease identities plus decisive Red, Green, Refactor, and final-validation results. Do not copy the packet schema, ignored guard state, or canonical authority prose into the plan.

### Interfaces and Dependencies

Name every library, service, command boundary, configuration file, interface, or document contract that the completed task establishes. When a choice remains open, describe the required interface and evaluation criteria without presenting a proposal as accepted.

## Work slices, TDD, and task closure

For a genuinely absent first production module/export, record [ADR-0024's first-module Red exception](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception) in the existing work-slice contract and validation section: verified environment, exact expected missing-callable failure, complete bounded behavioral tests, and which assertions have not executed. This remains TDD, not setup; separate Green must execute every accepted test unchanged and pass the independent strict typecheck. No additional plan section or workflow phase is required.

Work slices must be independently verifiable and build toward the owning task's falsifiable outcome. Describe each as a narrative of goal, work, result, and proof. Prototypes are permitted only when they stay in task scope, do not cross an unresolved decision, use disposable or clearly isolated artifacts, and define promotion or removal criteria.

Every production behavior follows one coherent milestone-slice Red-Green-Refactor cycle at a time under ADR-0024. The slice may include related scenarios that jointly prove one indivisible outcome but cannot combine unrelated behavior. `test_worker` performs preflight and returns existing evidence, adds passing characterization coverage, or stops after proving the coherent Red contract. The coordinator accepts that test boundary; during Green its test-owned files remain unchanged by the implementation worker. A test-worker correction or exceptional direct coordinator correction ends any current Green attempt and invalidates the affected Red or characterization evidence. The revised test and fresh result must be accepted before that evidence is reused or `code_worker` or `frontend_code_worker` resumes minimum Green and behavior-preserving Refactor. Record the classification, focused command and intended failure when Red applies, passing Green command, and affected task-level validation.

Before each behavior-bearing work slice completes, audit affected tests, fixtures, mocks, helpers, snapshots, skipped tests, and focused-test markers. Record why each remains, changes, consolidates, or is removed; then run the affected suite and build or type boundary. Run the complete authoritative suite once at task closure, or earlier only when risk, tree drift, or a failed prerequisite makes narrower evidence insufficient. If a task changes no tests or no executable suite exists yet, record that fact instead of inventing a command.

Finally, apply the [task-closure documentation gate](docs/README.md#task-closure-documentation-gate). Update materially affected authority owners, navigation, current-status statements, and the task's indexed [progress summary](docs/progress/README.md); preserve history; run proportional validators; and record one explicit documentation-impact result. The owning roadmap task remains incomplete until this gate and its own Verification pass.

## Revision note

Whenever the plan changes materially, add a concise dated note at its bottom explaining what changed and why. Reconcile `Current state` and affected living, work, validation, or recovery sections; add a Decision Log entry only for a material execution decision. State each detailed result once in its owning section and link it from the others instead of copying the narrative.
