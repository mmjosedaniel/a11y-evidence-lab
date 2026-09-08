# Agent instructions

## Language

Write all repository content in English, including filenames, code, identifiers, comments, tests, logs, documentation, commit messages, and user-facing text.

## Repository stage

The repository is development-ready for the Accepted portfolio MVP. The [development roadmap](docs/DEVELOPMENT_ROADMAP.md) owns application task order and status.

Application development requires an explicitly selected, dependency-ready roadmap task. Verify its applicable Must requirements and open-decision portions are Accepted or explicitly Deferred, its decisions and prerequisites are satisfied, and its evaluation-freeze condition passes. Decompose a milestone request into eligible tasks and track each independently; never start the entire roadmap implicitly. Resolve task-owned implementation literals inside the selected task; unresolved significant architecture decisions still block dependent work. Keep Proposed, Deferred, release, and post-MVP work outside scope.

Read-only reviews and owner-requested standalone workflow or documentation maintenance follow their own authority route; they do not select application work or require a synthetic roadmap task. They cannot change product requirements, decisions, or development authorization implicitly.

Treat product behavior and technology choices as proposals unless explicitly decided. An evaluation baseline is not implementation, qualification, or general support. Update status only after corresponding verification exists.

## Authorized autonomy

Within authorized scope, continue through routine choices, required verification, corrections within existing budgets, and documentation closure without asking for authorization again. Preserve the task and accepted work when the user adds clarification or asks a side question, unless they cancel or replace it.

A worker stop returns control to the primary for triage. Resolve issues within existing authority and budgets; pause dependent work and ask the owner only for missing information that materially determines the outcome, a required owner decision, expanded scope, or an exhausted authorized budget. Complete unaffected authorized work first. Never bypass a gate or reset a budget by calling it routine recovery.

Explicit user direction controls repository and skill guidance, subject to higher-priority runtime instructions and permissions. If a rule blocks progress, cite its exact file and instruction and explain its applicability; distinguish an explicit requirement from an inferred restriction. Keep updates and handoffs concise, with outcomes, decisive evidence, limitations, and the next required action.

## Engineering principles

- **YAGNI and proportionality:** Build only the selected task's Accepted contract. Add no speculative dependencies, abstractions, services, configuration, or workflow machinery. Generalize only a demonstrated repeated concept or variation.
- **KISS and Clean Code:** Prefer direct control flow, intention-revealing names, explicit boundaries and error handling, behavior-oriented tests, and comments explaining why. Keep interfaces and processes small.
- Preserve every applicable accessibility, traceability, validation, privacy, and security requirement. Simplify implementation and procedure without weakening the contract.

### Small, cohesive modules from the start

Place distinct current responsibilities in purpose-named modules from the first production change. One current consumer can justify a cohesive extraction; hypothetical reuse and file length cannot. Keep related details together when splitting adds indirection. Never deliver a monolith with a promise to split it later or use a generic `utils` file as a catch-all.

React application/page components own composition and necessary shared coordination; distinct forms, lists, cards, and detail regions have named owners. Keep state with its owner or nearest shared owner. Backend entry points coordinate boundaries; separate substantive validation, transformations, domain behavior, and external I/O when present. Avoid empty layers, wrapper-only components, and hooks created merely to shorten code.

Declare responsibility placement, dependency direction, reuse or bounded creation, and permitted structural refactor in the [existing assignment packet](.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) before coding. Inspect actual cohesion before handoff and resolve material responsibility mixing. Passing tests and path authorization alone do not prove good structure.

## Required context and task routing

Inspect Git status and preserve unrelated changes. Start with the [authority map](docs/README.md#authority-and-status-map) and applicable [task-router entry](docs/README.md#read-by-task); these sections suffice for initial navigation. Load controlling requirements, decisions, prerequisites, and specifications through that route rather than reading every module.

Read a target document completely before editing it. For read-only investigation, begin with controlling sections and expand to resolve uncertainty. Read [PROJECT_REQUIREMENTS.md](docs/PROJECT_REQUIREMENTS.md) for shared requirement semantics, status, traceability, development authorization, or cross-module decisions. For implementation, resolve every selected task identifier through the roadmap's authority-location key and read each named authority and scenario.

For substantive repository defects, consult the [bug index and recording rules](docs/bugs/README.md) before new investigation. Use its primary-maintained records for durable evidence and agent handoff context while retaining the existing task authorization and execution workflow.

Product-model, runtime, and hardware evaluation follows [local MVP feasibility](docs/LOCAL_MVP_FEASIBILITY.md). Codex model selection follows the [agent model policy](.codex/README.md#model-and-reasoning-policy) and current official Codex documentation. Material rendered UI work uses the [frontend-quality skill](.agents/skills/frontend-quality/SKILL.md); nonvisual frontend work does not trigger that overlay.

## Agent coordination

Apply the task-relevant route in the [agent workflow](.codex/README.md). The primary owns authority interpretation, risk routing, research synthesis and authoritative research-derived writes, integration, evidence acceptance, approvals, status, and closure. Research, analysis, drafting, and review roles remain read-only.

Use R0-R3 research routing and the [research capsule](.codex/README.md#research-assignment-capsule-v1) when delegating. Consequential decisions use the workflow's Decision Review Contract in the owning ExecPlan, or in the coordinating prompt for standalone policy. Invoke required roles without requesting permission again; optional agents require a bounded independent subtask or unresolved evidence dimension. Role capacity is not a staffing target. Explicit model pins live in agent TOMLs and the model policy, not here.

Maintain one [ExecPlan](PLANS.md) per qualifying roadmap task. For an authorized task already `In progress`, follow the [worker-first workflow](.codex/execplan-implementation-workflow.md) and [ADR-0024](docs/architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md): separate test and implementation owners, sequential preflight and applicable Red-Green-Refactor, accepted tests unchanged during Green, risk-routed fresh review, and justified non-TDD replacement evidence. The linked procedure owns the narrow first-module exception, correction budgets, evidence invalidation, and cohesion handoffs.

Every implementation-worker write turn requires a primary-opened and terminally closed [write lease](.codex/write-lease-guard.md). Only one lease may be active per worktree; concurrent independent writers require separate worktrees, baselines, task-scoped plans, and roadmap parallel authorization. Primary plan, authority, status, and guard maintenance occurs between leases. Ordinary implementation edits remain delegated; the only direct primary implementation exception is ADR-0024's bounded test correction with evidence invalidation and re-acceptance. Workers may use Git only for read-only inspection; all Git writes and metadata mutations are prohibited.

Inspect the actual diff, evidence, and terminal lease result before accepting a handoff. Reports and receipts are supporting inputs, not proof of correctness. Maintain the [manual progress index](docs/progress/README.md) only for started roadmap tasks and accepted material checkpoints or closure; add no turn logs, token/cost counters, telemetry, or generated ledger.

## Verification

For implementation, run focused checks at work-slice boundaries and the complete authoritative suite at task closure. Broaden or repeat checks only for changed code, stale or contradictory evidence, failed prerequisites, or unresolved risk. An agent handoff alone does not invalidate evidence; follow the workflow's complete evidence-identity rule. Preserve required independent strict typechecking, risk-critical reproduction, and task-specific checks. Use structural, semantic, manual, or negative evidence where TDD does not apply; never fabricate Red.

## Documentation rules

Keep each rule in its existing authority and link to its procedure. Add a document only for a distinct responsibility. Distinguish ideas, decisions, assumptions, and implemented behavior. Keep architecture under `docs/architecture/`, with accepted significant decisions in its ADR directory and both indexes current. Preserve superseded history and stable identifiers.

## Task-closure documentation gate

Before completion or handoff, apply the [documentation closure gate](docs/README.md#task-closure-documentation-gate): reconcile every materially affected authority, current-status statement, instruction, command, and navigation link; run proportional configuration, link, consistency, formatting, and task-specific checks, including `git diff --check`; and state the documentation impact explicitly. Read-only work reports follow-ups without edits. No roadmap task is Complete until its Verification and this gate pass; archive its ExecPlan only afterward.

## Public content

Keep tracked content professional and project-focused. Do not copy private or ignored working material into tracked files without explicit authorization, or include credentials, private data, proprietary material, or personal conversation history. Never position the product as an accessibility certification tool. Verify time-sensitive technical claims against primary sources and link them directly.

## Git operations

Do not commit, publish, or push without explicit user authorization.
