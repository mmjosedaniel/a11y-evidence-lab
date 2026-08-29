# Repository execution plans (ExecPlans)

This document defines the required format for a repository execution plan, or ExecPlan. An ExecPlan is a living, roadmap-task-scoped design and execution document that a person or coding agent can follow from the current working tree without relying on prior conversation. The canonical task graph, dependencies, statuses, and scope remain in the [development roadmap](docs/DEVELOPMENT_ROADMAP.md); an ExecPlan only decomposes one existing roadmap task into concrete work and evidence.

## When to use an ExecPlan

Use an ExecPlan whenever an existing `RD-*` or `M1-*` through `M6-*` roadmap task changes application source, tests, dependencies, fixtures, or executable configuration. Also use one when a task requires staged research, an approval checkpoint, multiple independently verifiable work slices, recovery instructions, or a durable decision record, and whenever the project owner explicitly requests it. Documentation-only work outside those triggers does not need an empty plan.

Store active plans directly under `docs/plans/` as `<roadmap-id>-<short-slug>.md`. Move a plan to `docs/plans/completed/` only after its owning roadmap task is `Complete` and has passed the [task-closure documentation gate](docs/README.md#task-closure-documentation-gate). Register active and completed plans in the [plan index](docs/plans/README.md), preserve the stable filename and execution history, and repair inbound links when moving a plan.

One ExecPlan owns exactly one status-bearing roadmap task. A roadmap-approved parallel group therefore uses one plan per participating task, separate worktrees and baselines for concurrent writers, and the roadmap's named integration checkpoint. A standalone policy decision with no selected roadmap-task owner keeps its Decision Review Contract in the coordinating prompt under the agent workflow; it does not create an ExecPlan or synthetic task ID. An ExecPlan must not create product scope, change roadmap dependencies or status, approve an ADR, change a requirement, or claim implementation evidence. If execution reveals a conflict or consequential choice outside the owning task, update the authoritative owner or stop for the applicable decision before dependent work continues.

## Required operating rules

Every ExecPlan must be self-contained. Explain the relevant repository state, requirements, accepted decisions, readiness gates, and terms in enough detail that a newcomer can execute it. Name repository-relative paths and stable roadmap, requirement, ADR, `BHV-*`, `SPEC-*`, and `HS-*` identifiers wherever they control the work.

Every ExecPlan is a living document. Update it whenever progress is made, evidence changes, a material discovery occurs, or an execution decision is taken. At every stopping point, say what is complete, what remains, and what should happen next. A reader must be able to restart from the plan alone.

Every ExecPlan must lead to an observable, falsifiable outcome. For application work, describe the behavior and how a reviewer exercises it. For internal, documentation, or decision work, describe the authoritative artifact, validator, approval, state transition, and negative checks that prove the intended boundary was preserved.

Follow the [repository instructions](AGENTS.md), [documentation authority map and task router](docs/README.md), exact task in the [development roadmap](docs/DEVELOPMENT_ROADMAP.md), mapped requirements, applicable Accepted ADRs, evaluation-freeze boundary, and only the [derived specifications](docs/specs/README.md) routed by the task. An ExecPlan cannot weaken the repository's language, evidence, preservation, YAGNI, TypeScript, TDD, or closure policies.

For write-authorized implementation, use the [worker-first ExecPlan implementation workflow](.codex/execplan-implementation-workflow.md). The primary coordinator delegates bounded edits sequentially to `test_worker` and exactly one implementation worker, gives each assignment a `Milestone Assignment Packet v2`, and opens and terminally closes its exact path lease through the [automatic write-lease guard](.codex/write-lease-guard.md). The `standard` profile uses `code_worker`; only a work slice that materially changes rendered UI uses the conditional `frontend-visual` profile, [frontend-quality skill](.agents/skills/frontend-quality/SKILL.md), and `frontend_code_worker`. One instance of each selected writer may remain live for bounded follow-ups within the same work slice, but every implementation-worker write turn requires a fresh packet and lease. The coordinator retains integration, evidence acceptance, exception handling, authoritative status, and closure, but delegates any additional application implementation edit through a new bounded worker assignment. Decision work uses the sole-writer topology in the [project-scoped Codex workflow](.codex/README.md).

## Format

Write one Markdown document. Do not surround it with an outer code fence. Use prose first; use tables or lists only when they make traceability or alternatives materially easier to compare.

Begin with a short action-oriented H1 and this statement:

    This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

The following sections are mandatory and remain present for the life of the plan.

## Required living sections

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

At each major work slice and at completion, compare the observed result with the original purpose. Record what was achieved, what remains, unexpected costs, and lessons that should affect later work. When the optional worker-flow metrics sidecar was used, summarize corrections, false Reds, confirmed regressions, time and exact token coverage, and telemetry gaps as operational-learning data rather than implementation evidence. An empty initial entry may state that execution has not started.

## Required execution sections

### Purpose / Big Picture

Explain why the work matters, what becomes possible afterward, and how a reviewer will observe success. Distinguish planning intent from current implementation evidence.

### Context and Orientation

Describe the relevant repository state. Name the authoritative files, explain how they relate, define non-obvious terms, identify prerequisites and freeze conditions, and state every assumption.

### Scope and Non-Goals

State what the owning roadmap task includes and excludes. Preserve Accepted, Proposed, Deferred, evaluation-only, and post-MVP classifications. Identify any work blocked by a readiness or evaluation-freeze condition.

### Plan of Work

Describe the dependency-ordered sequence in prose. For each coherent work slice, state what will exist afterward, the observable contract, the preflight target, test and implementation ownership, risk tier, exact authority anchors, owned and frozen paths, focused and task-level commands, reusable evidence identities, execution budget, expected handoff, and condition for advancing.

The standard route records no profile field. Only `frontend-visual` adds the conditional profile marker, accepted reuse-audit identity, UI/design anchors, state and viewport matrix, and real-browser evidence target required by the conditional packet capsule. Identify read-only or separately worktree-isolated branches that may run in parallel. Red, Green, and Refactor remain sequential within a work slice. Exceptions are stop-and-triage conditions; metrics are optional and never a plan gate.

### Decision Review Contract (decision work only)

When the owning task compares consequential options or prepares an ADR, create a living Decision Review Contract inside the ExecPlan before comparative research starts. It is a workflow contract, not another authority or a substitute for the ADR. Record the objective `R1`, `R2`, or `R3` tier and triggers. R2 or R3 may use one bounded, non-ranking discovery pass after stable scope, authority, basic criteria, approval boundary, and forbidden changes are recorded; then freeze the candidate set, evidence dimensions, hard gates, and triggered invariants.

Identify the exact roadmap task, tier and triggers, proposed artifact, approval boundary, forbidden scope, common criteria, evidence classes, required artifact-local outputs, hard gates, status and recommendation invariants, decide-now versus prove-later semantics, applicable adversarial properties, researcher assignment basis, analyst and single-drafter triggers, correction and escalation rules, budget, and stopping conditions.

Define a compact cumulative invariant packet. Each invariant needs a plan-local ID, trigger or fixture, expected result, evidence or actual result, and responsible reviewer. Every packet covers artifact completeness, evidence honesty, and authority-state consistency. Add triggered invariants for state transitions, concurrency, integrity, identity, deterministic bytes, cross-platform equivalence, recovery, or ownership when the proposed decision contains those properties.

After the research barrier, the synthesis owner returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. The primary may own straightforward R1/R2 synthesis; `decision_analyst` is mandatory for R3 and conditional for R2 under the [routing rules](.codex/README.md#decision-review-contract-and-risk-tier). `DRAFT READY` permits primary drafting or one read-only `research_drafter` transformation after required checkpoints; it does not approve an ADR or authorize the drafter to write.

### Concrete Steps

Give exact commands and working directories. Commands must match current repository evidence or be labeled as future commands that become authoritative only after the applicable task creates them. Include short expected results.

### Validation and Acceptance

Define observable acceptance in terms of behavior, authoritative state, or reproducible validator output. For production behavior, include the preflight classification and exact Red failure, Green pass, and task-level validation required by [ADR-0024](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md). For existing behavior, record existing passing coverage or characterization evidence without fabricating a Red. For declarative, documentation, capacity-screen, or decision work with no production behavior, explain why TDD does not apply and define the structural, semantic, manual, or negative checks that replace it.

For worker-first implementation, record assignment identity, responsible worker, terminal lease result, preflight route, exact Red and Green commands when applicable, task-level validation, coordinator acceptance, evidence reused under an unchanged fingerprint, and the risk-routed reviewer verdict. A packet, worker summary, guard result, or metric cannot replace inspection of the actual diff and task-authoritative validation.

For decision work, record research tier and triggers, capsule/report identities, synthesis owner and result, draft provenance when applicable, contract-checkpoint result, and fresh final evidence-checkpoint result. Re-run the complete applicable invariant packet after every material revision and every R3 correction.

### Idempotence and Recovery

Explain which steps are safe to repeat, how to resume after partial failure, and how unrelated work remains preserved. Prefer additive recovery. Never use destructive recovery when a targeted edit or preserved record is sufficient.

If multiple agents share a worktree, define path ownership, terminal lease closure, and who may resume after a failed handoff. An unexpected path or guard failure stops writes without reverting user or peer work. Reconcile the tree and last accepted barrier before a fresh assignment; never redefine an active lease or run Red and Green writers concurrently.

### Artifacts and Notes

Retain only the short transcripts, path lists, decision matrices, or excerpts needed to prove or resume work. For a worker-first run, retain assignment and terminal-lease identities plus decisive Red, Green, Refactor, and final-validation results. Do not copy the packet schema, ignored guard state, generated metric events, or canonical authority prose into the plan.

### Interfaces and Dependencies

Name every library, service, command boundary, configuration file, interface, or document contract that the completed task establishes. When a choice remains open, describe the required interface and evaluation criteria without presenting a proposal as accepted.

## Work slices, TDD, and task closure

Work slices must be independently verifiable and build toward the owning task's falsifiable outcome. Describe each as a narrative of goal, work, result, and proof. Prototypes are permitted only when they stay in task scope, do not cross an unresolved decision, use disposable or clearly isolated artifacts, and define promotion or removal criteria.

Every production behavior follows one coherent milestone-slice Red-Green-Refactor cycle at a time under ADR-0024. The slice may include related scenarios that jointly prove one indivisible outcome but cannot combine unrelated behavior. `test_worker` performs preflight and returns existing evidence, adds passing characterization coverage, or stops after proving the coherent Red contract. The coordinator accepts and freezes that boundary; `code_worker` or `frontend_code_worker` then performs minimum Green and behavior-preserving Refactor sequentially. Record the classification, focused command and intended failure when Red applies, passing Green command, and affected task-level validation.

Before each behavior-bearing work slice completes, audit affected tests, fixtures, mocks, helpers, snapshots, skipped tests, and focused-test markers. Record why each remains, changes, consolidates, or is removed; then run the affected suite and build or type boundary. Run the complete authoritative suite once at task closure, or earlier only when risk, tree drift, or a failed prerequisite makes narrower evidence insufficient. If a task changes no tests or no executable suite exists yet, record that fact instead of inventing a command.

Finally, apply the [task-closure documentation gate](docs/README.md#task-closure-documentation-gate). Update materially affected authority owners, navigation, and current-status statements; preserve history; run proportional validators; and record one explicit documentation-impact result. The owning roadmap task remains incomplete until this gate and its own Verification pass.

## Revision note

Whenever the plan changes materially, add a dated note at its bottom explaining what changed and why. Reflect the same change in `Progress`, `Decision Log`, and affected work, validation, or recovery sections so the document never contradicts itself.
