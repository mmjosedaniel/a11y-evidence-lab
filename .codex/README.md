# Project-Scoped Codex Agents

This directory contains reusable Codex agent definitions and operational workflow tooling versioned with A11y Evidence Lab as portfolio artifacts. They define stable working roles; a coordinating prompt still supplies the existing roadmap task or policy owner, research tier, question or work slice, target artifact, criteria, write lease when applicable, output contract, budget, and stopping condition for each instance. Read-only research roles receive the [Research Assignment Capsule v1](#research-assignment-capsule-v1). Write-capable implementation workers receive the separate canonical [Milestone Assignment Packet v2](./execplan-implementation-workflow.md#milestone-assignment-packet-v2), whose compact capsule supplies exact authority anchors and accepted evidence for one coherent work slice.

These agents support repository work. They do not change product scope, approve architecture, resolve an open decision, replace an ExecPlan, or count as implementation or acceptance evidence. All agents remain subject to the root [repository instructions](../AGENTS.md) and must begin repository work from the [documentation authority map and task router](../docs/README.md).

## Start Here

| Need | Start with | Continue with |
|---|---|---|
| Persistent repository rules and authority | [Repository instructions](../AGENTS.md) | [Documentation authority map and task router](../docs/README.md) and its task-specific reading order |
| Repeatable ADR, planning, acceptance, or verification procedure | [Read by task](../docs/README.md#read-by-task) | The applicable workflow guide, skill, authority, and only the supporting resources it routes to |
| Any bounded repository research | [Research work](#research-work) | Objective `R0` through `R3` classification and a Research Assignment Capsule when an agent is needed |
| Consequential decision work | [Decision work](#decision-work) | Decision Review Contract in the owning ExecPlan when roadmap-task-backed, or in the coordinating prompt for a standalone policy decision, plus the applicable research tier |
| Owner-authorized implementation ExecPlan | [Implementation workflow](./execplan-implementation-workflow.md) | [Write-lease guard](./write-lease-guard.md) and owning ExecPlan |
| Visible frontend implementation work slice | [Frontend quality skill](../.agents/skills/frontend-quality/SKILL.md) | Conditional `frontend-visual` profile in the implementation workflow; standard slices remain unchanged |
| Task-level project and agent-workflow progress | [Progress index](../docs/progress/README.md) | Existing roadmap task, owning ExecPlan when applicable, and accepted checkpoint evidence |
| Custom role selection | [Agent registry](#agent-registry) | Exact role TOML and bounded instance assignment |
| Operator-managed runtime concurrency | [Runtime concurrency capacity](#runtime-concurrency-capacity) | [Collaboration topology](#collaboration-topology), [implementation workflow](./execplan-implementation-workflow.md), and [write-lease guard](./write-lease-guard.md) |

Keep `AGENTS.md` concise and durable; put task-specific procedures in the linked ExecPlan, workflow, or repository skill. Codex discovers repository skills under `.agents/skills` using progressive disclosure: it first sees skill metadata, then loads a selected `SKILL.md` and only the supporting resources needed for the task. Project-scoped custom agents live under `.codex/agents`; their definitions do not execute merely because the files exist.

Project-scoped `.codex` configuration loads only for a trusted project. A role file being present or syntactically valid does not by itself prove runtime discovery in the current session.

## Agent Registry

| Agent | Permission boundary | Stable responsibility | Not responsible for |
|---|---|---|---|
| [`technology_researcher`](./agents/technology-researcher.toml) | Read only | Investigate one ordinary R1/R2 question or one non-critical dimension inside R3 and return source-traceable evidence plus optional artifact-ready fragments | Complete target-artifact drafting, repository edits, final synthesis, architecture approval, or task and gate status changes |
| [`critical_researcher`](./agents/critical-researcher.toml) | Read only | Investigate one R3 critical evidence dimension with the explicit Sol-high quality route and failure-path coverage | Ordinary research, complete target-artifact drafting, repository edits, final synthesis, approval, or closure |
| [`decision_analyst`](./agents/decision-analyst.toml) | Read only | When routing triggers it, audit research completeness and synthesis readiness; for decisions, also audit the Decision Review Contract, compare options, and return a traceable recommendation | Routine single-report synthesis, repository edits, artifact numbering or approval, owner-controlled choices, or task and gate status changes |
| [`research_drafter`](./agents/research-drafter.toml) | Read only | After synthesis and any required pre-draft checkpoint, transform one frozen conclusion into one non-authoritative target-artifact draft with provenance | New research, competing drafts, recommendation changes, repository edits, artifact lifecycle, approval, or closure |
| [`critical_research_reviewer`](./agents/critical-research-reviewer.toml) | Read only | Perform maximum-effort fresh review of an R3 contract checkpoint, final answer, or final decision artifact | Ordinary R0-R2 review, implementation review, editing, approval, or closure |
| [`independent_reviewer`](./agents/independent-reviewer.toml) | Read only | Try to falsify an ordinary higher-risk decision contract, work slice, or integrated final artifact against repository authorities and reproducible evidence | Editing the reviewed work, approving owner-controlled decisions, or taking closure ownership |
| [`milestone_reviewer`](./agents/milestone-reviewer.toml) | Read only | Review one ordinary completed implementation work slice proportionally and reuse fresh evidence | Critical-risk review, editing, or closure ownership |
| [`critical_reviewer`](./agents/critical-reviewer.toml) | Read only | Perform maximum-effort adversarial review when a named critical trigger applies | Routine work-slice review, editing, or closure ownership |
| [`test_worker`](./agents/test-worker.toml) | Workspace write under an explicit lease | Perform read-only preflight, then own one coherent work-slice Red or passing characterization | Production behavior, evidence-document edits, architecture decisions, status changes, Green authorization, or task closure |
| [`code_worker`](./agents/code-worker.toml) | Workspace write under an explicit lease | Perform bounded setup or work-slice Green with optional same-turn behavior-preserving Refactor | Changing an accepted test, evidence-document edits, selecting architecture, status changes, or task closure |
| [`frontend_code_worker`](./agents/frontend-code-worker.toml) | Workspace write under an explicit lease | Perform Green with optional same-turn behavior-preserving Refactor only for an accepted `frontend-visual` work slice, reuse audit, and visual contract | Standard-profile work, test changes, independent design authority, evidence-document edits, architecture or scope decisions, status changes, or task closure |

Codex identifies each custom agent by the `name` field inside its TOML file. The filenames follow the same names in kebab case for navigation only.

## Model and Reasoning Policy

The workflow routes model and reasoning effort by responsibility and risk:

| Execution role | Model and effort | Rationale |
|---|---|---|
| Primary coordinating thread | `gpt-5.6-sol`, `xhigh` as the current operator practice; another explicit owner-selected setting may be used | Owns research routing, synthesis, write-lease routing, integration, state reconciliation, approval handling, and final closure. It is the sole authoritative writer for research-derived repository artifacts and delegates ordinary application source, test, dependency, fixture, or executable-configuration edits through the worker lease route. The only implementation-side exception is a bounded direct test correction between leases, with recorded reason and validation, evidence invalidation, and test-boundary re-acceptance. Primary-owned plan, authority, status, and guard-control maintenance also occurs only between leases. The parent-session setting is selected by the operator and cannot be enforced by these project-scoped agent files; the explicitly pinned subagent settings below prevent automatic inheritance of its cost. |
| `technology_researcher` | `gpt-5.6-terra`, `medium` | Each ordinary R1/R2 assignment, or non-critical R3 dimension, uses the cost-balanced baseline. Escalate the critical dimension rather than assuming that higher effort improves every question. |
| `critical_researcher` | `gpt-5.6-sol`, `high` | Covers one R3 critical dimension whose security, integrity, identity, concurrency, recovery, irreversible-data, serialization, or cross-platform risk justifies the stronger route. |
| `decision_analyst` | `gpt-5.6-sol`, `xhigh` | Reconciles difficult multi-report synthesis; for decisions, also audits contract coverage, ranking, and decide-now versus prove-later boundaries. |
| `research_drafter` | `gpt-5.6-terra`, `medium` | Performs bounded transformation after the decision or conclusion is frozen; it does not research or decide. |
| `critical_research_reviewer` | `gpt-5.6-sol`, `max` | Preserves the strict quality-first review route for R3 without changing the separate implementation-critical reviewer. |
| `milestone_reviewer` | `gpt-5.6-terra`, `high` | Reviews an ordinary completed work slice proportionally without paying maximum-effort cost. |
| `independent_reviewer` | `gpt-5.6-sol`, `high` | Reviews ordinary higher-risk work slices, decision checkpoints, and integrated final states. |
| `critical_reviewer` | `gpt-5.6-sol`, `max` | Performs quality-first adversarial review only for named critical triggers. |
| `test_worker` | `gpt-5.6-sol`, `medium` | Performs preflight and owns one coherent work-slice test contract while preserving a separate test context. |
| `code_worker` | `gpt-5.6-sol`, `medium` | Owns bounded setup or work-slice Green with an optional same-turn Refactor while preserving a separate code context. |
| `frontend_code_worker` | `gpt-5.6-sol`, `high` | Owns only a rendered-UI Green whose accepted reuse and visual contracts require additional layout, hierarchy, accessibility, and presentation judgment. The stronger route grants no extra design or scope authority. |

Each custom-agent file's explicit `model` and `model_reasoning_effort` values take precedence. Before that file is applied, model and effort resolve from an explicit spawn override, then project `[agents]` defaults, then the parent session; other omitted session settings inherit from the parent. Current-turn runtime overrides can still supersede agent-file sandbox and approval defaults. The primary coordinator must confirm its actual model, reasoning, permissions, and working-tree state at the start of a consequential decision or implementation run. `Ultra` is not a substitute for these topologies: proactive delegation may help independent work, but the repository still requires named barriers, explicit write ownership, fresh review, bounded correction, and owner approval where applicable.

Role instructions remain necessary. More reasoning does not replace primary-source requirements, common criteria, explicit uncertainty, artifact-local completeness, read-only boundaries or write leases, or executable validation. If the configured model or effort becomes unavailable in a target Codex environment, update this policy and the affected agent files together rather than allowing silent drift. Compare policy changes on representative repository work instead of assuming that a higher effort alone improves the workflow.

The model IDs, supported reasoning levels, custom-agent precedence, and parallel-work guidance are documented in the [official GPT-5.6 Sol model reference](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [official GPT-5.6 Terra model reference](https://developers.openai.com/api/docs/models/gpt-5.6-terra), [GPT-5.6 model guidance](https://developers.openai.com/api/docs/guides/latest-model), and [Codex subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).

## Runtime Concurrency Capacity

The spawned-agent ceiling belongs to each operator's untracked `~/.codex/config.toml`; this repository neither versions nor requires a numeric value. The current operator profile uses:

```toml
[agents]
max_concurrent_threads_per_session = 6
```

The [official Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) defines this key as the maximum number of spawned-agent threads and excludes the primary thread. This value therefore permits up to six spawned agents alongside the primary coordinator, or seven active threads in total. It is a ceiling, not a workload target or guaranteed allocation; the coordinator must use the capacity actually available in the current session, and another operator may select a lower value without creating repository drift. The [official subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents) owns the runtime feature semantics.

Additional slots are useful for bounded, independent work, especially read-only research and review. They do not expand task scope, grant write authority, increase correction budgets, replace fresh review, or relax closure ownership. Write-capable implementation still follows the [serial work-slice flow](./execplan-implementation-workflow.md) and permits only one active [write lease](./write-lease-guard.md) per worktree; Red and Green writers never run concurrently for the same slice. Truly independent concurrent writers require separate worktrees and separate baselines.

## Collaboration Topology

### Research work

Every bounded repository research request receives one objective research tier before agents are assigned. The tiers are routing classifications, not a menu to choose opportunistically. The primary records the highest triggered tier and its evidence; uncertainty selects the higher tier, an owner may escalate, and a tier may be lowered only after evidence disproves the triggering condition. Research tiers do not replace the separate `S0` through `S3` implementation review tiers.

| Tier | Trigger | Default route |
|---|---|---|
| `R0` | Repository-local fact gathering, deterministic inspection, or no unresolved external evidence | Primary only; no researcher, analyst, drafter, or LLM reviewer by default |
| `R1` | One bounded, reversible question with one material evidence dimension and no owner-controlled or critical semantics | At most one `technology_researcher`; primary synthesis; optional single `research_drafter` only for a substantial target artifact; review only when the target's authority requires it |
| `R2` | Cross-boundary or consequential choice, multiple material evidence dimensions, three or more viable candidates, conflicting current sources, or an owner-approval artifact | Up to two `technology_researcher` instances when unresolved evidence requires them, assigned by evidence gap rather than automatically by candidate; conditional `decision_analyst`; optional single drafter after synthesis; fresh final semantic review for an ADR or other owner-controlled decision artifact |
| `R3` | Custom serialization, integrity, identity, concurrency, recovery, cross-platform equivalence, irreversible data, security, closely ranked contradictory candidates, or decision-critical mechanics outside the frozen contract | Enough ordinary or `critical_researcher` reports to cover every critical dimension under an explicit capsule budget; every dimension carrying the named R3 trigger uses `critical_researcher`. Decision-oriented R3 requires `decision_analyst` and a fresh `critical_research_reviewer` pre-draft checkpoint. Answer-only R3 uses primary synthesis unless an analyst trigger remains and always receives complete fresh `critical_research_reviewer` final review. Drafting and repository writing apply only when a target artifact exists. |

Research cost grows with unresolved evidence and consequence, not with the raw number of candidates. A requirement to compare three strategies does not require three agents. Prefer one researcher per independent evidence dimension when that produces a symmetric comparison, and assign by candidate only when candidate-specific evidence cannot be compared credibly in one dimension report. A hard-gate failure ends candidate-local expansion after the failure and reversal condition are evidenced.

For R2 or R3, the primary may run one bounded discovery pass before comparative research. Discovery may identify credible candidates, primary sources, hard disqualifiers, evidence dimensions, and triggered invariants; it must not rank candidates or recommend an option. Freeze the comparison contract after discovery. Later evidence may reopen it only through the recorded material-change and stopping rules.

Independent assignments may run concurrently. The primary waits at one research synchronization barrier, reuses still-fresh evidence IDs instead of paying for duplicate source collection, and sends only the compact capsule plus directly linked authority fragments. A researcher or analyst may remain alive for one bounded follow-up in the same research run; freshness is reserved for independent review.

### Research Assignment Capsule v1

Every spawned researcher, analyst, drafter, or research reviewer receives a compact capsule containing:

- stable research identity, `R0` through `R3` tier, trigger rationale, and budget;
- exact question or evidence dimension, candidate set when applicable, and target artifact or answer;
- authority anchors, known repository facts, shared evidence IDs, and freshness conditions;
- common criteria, hard gates, forbidden scope, and owner-controlled boundaries;
- required output structure, maximum useful detail, success result, and stopping conditions; and
- permission boundary, peer synchronization rule, follow-up allowance, review stage and fresh-instance requirement when applicable, and next barrier.

The capsule is an assignment projection, not a new authority document. For a decision-oriented ExecPlan, it projects the living Decision Review Contract. For research without an ExecPlan, it may live only in the coordinating prompt or final research record. Do not create a tracked plan, report, or ledger solely to administer R0 or R1 work.

### Research budgets and stops

| Tier | Default execution budget |
|---|---|
| `R0` | No spawned research role |
| `R1` | One researcher and at most one targeted follow-up; zero analysts; at most one drafter when a substantial artifact is already selected |
| `R2` | At most one discovery pass, two concurrent research reports, one bounded follow-up round, one triggered analyst pass plus one bounded correction, at most one drafter, and the authority-required final review |
| `R3` | The Research Assignment Capsule states the justified report count, critical evidence dimensions, analyst and review budget; a Decision Review Contract additionally owns these fields for decision-oriented work. The existing two-cycle correction ceiling applies when a final artifact exists. |

Stop and reconcile instead of spawning more work when the same decisive evidence gap appears twice, two synthesis attempts return `RETURN FOR RESEARCH` without materially new evidence, the capsule budget is exhausted, or a new finding changes scope or triggers a higher tier. Reuse the same non-review agent for its one bounded follow-up when available. Use role counts and stopping conditions as the workflow budget controls; do not record token or cost counters, invent estimates, or treat lower agent count alone as proof of lower cost.

Role results route explicitly. `RESEARCH COMPLETE` enters the synchronization barrier. `FOLLOW-UP REQUIRED` permits only the capsule's one bounded follow-up; when its budget is absent or exhausted, the primary reconciles or escalates instead of respawning. `BLOCKED` stops dependent synthesis until the primary supplies the missing authority, evidence, scope, or owner direction. `SYNTHESIS READY` ends answer-only analysis; `DRAFT READY` freezes an artifact conclusion without approving it. `RETURN FOR RESEARCH` uses only the remaining recorded evidence budget, and `OWNER DIRECTION` stops at the owner boundary. `DRAFT BLOCKED` never authorizes a partial repository write: the primary returns to the missing evidence or decision boundary, while `DRAFT COMPLETE` supplies one provenance-mapped input for primary reconciliation.

Research routing ends at an evidence-backed answer, recommendation, or primary-written authoritative artifact. It never opens a write lease or authorizes production behavior. If an approved research result leads to implementation, start from the exact existing roadmap task, its dependencies and readiness or evaluation-freeze gates, and the preflight boundary. Enter the separate worker-first implementation workflow without carrying an `R` tier, research capsule, or drafter permission forward.

### Decision work

Decision-oriented work uses the generic research tiers with a contract-first, sole-writer graph:

```text
Primary Codex thread (coordinator, sole decision-artifact writer, final closure owner)
  |
  +-- objective R tier + living Decision Review Contract
  |      +-- owning ExecPlan when roadmap-task-backed
  |      +-- coordinating prompt when a standalone policy decision has no roadmap task
  |
  +-- optional bounded discovery for R2/R3; then freeze comparative contract
  |
  +-- zero, one, two, or strict-path ordinary/critical researchers by unresolved evidence dimension
  +-- research synchronization barrier and shared-evidence reconciliation
  |
  +-- primary synthesis, or decision_analyst when the tier/trigger requires it
  |      +-- DRAFT READY
  |      +-- RETURN FOR RESEARCH
  |      +-- OWNER DIRECTION
  |
  +-- if R3: fresh critical_research_reviewer instance A
  +-- if an R1/R2 contract trigger applies: fresh independent_reviewer instance A
  |      +-- contract checkpoint before drafting
  |
  +-- optional one read-only research_drafter creates one non-authoritative draft
  +-- primary reconciles and writes the only authoritative decision artifact
  |
  +-- fresh final reviewer when the tier or artifact authority requires it
  |      +-- critical_research_reviewer for R3; independent_reviewer otherwise
  |      +-- evidence checkpoint on the complete artifact and exact diff
  |      +-- findings -> risk-proportional correction and re-review
  |
  +-- primary post-verdict reconciliation barrier
  |
  +-- project-owner approval checkpoint
```

The contract and evidence checkpoints are agent-workflow controls, not product requirements, ADRs, open-decision resolutions, or the task-closure documentation gate. The reviewer labels belong to instances, not permanent definitions. When both pre-draft and final review are required, use separate fresh instances: `critical_research_reviewer` for R3 and `independent_reviewer` for an ordinary triggered R1/R2 decision. No permanent panel is required.

For decision work, the primary thread is deliberately not duplicated as a custom `coordinator` agent. It owns tier classification, orchestration, synthesis when no analyst is triggered, every authoritative repository write, approval handling, integration, and final closure. The `research_drafter` writes no file and makes no decision; `DRAFT COMPLETE` only gives the primary a provenance-mapped input to reconcile. The final reviewer receives the authoritative inputs, living contract, cumulative invariant packet, exact artifact, and diff, and independently reproduces material evidence instead of treating the prior review or primary summary as proof.

### Implementation work

Write-authorized implementation ExecPlans use the complementary [worker-first ExecPlan implementation workflow](./execplan-implementation-workflow.md). For executable production behavior, the primary delegates bounded edits through this repository's accepted milestone-slice sequence: read-only test preflight, test-owned characterization or Red when required, then Green and optional Refactor by exactly one selected implementation context. A separately justified non-behavioral setup records `TDD: Not applicable` and goes directly to guarded `code_worker` setup with replacement evidence. The primary retains integration, evidence acceptance, bounded test-correction exception handling, approvals, authoritative status, and closure. The default `standard` profile uses the unchanged `code_worker`; only a work slice that materially changes rendered UI uses the conditional `frontend-visual` profile and `frontend_code_worker`.

For each coherent work slice, the primary creates one compact `Milestone Assignment Packet v2`. The packet name is retained for compatibility; its Work-slice ID is runtime correlation inside one existing roadmap task, not another project milestone. The standard route keeps the pre-existing packet shape; only a rendered-UI slice adds the conditional `frontend-visual` marker and capsule before preflight. The primary keeps one test-worker instance and only the applicable implementation-worker instance alive for that slice, then retires them after the work-slice barrier. Agent persistence reduces repeated context loading but never persists write authority: every implementation-worker write turn has a fresh packet, baseline, digest, lease ID, and terminal close. If a live instance is unavailable, the primary respawns it from the same capsule.

The [frontend-quality skill](../.agents/skills/frontend-quality/SKILL.md) owns profile classification, the preflight reuse audit, and the visual-evidence boundary. A future UI-source path does not select the visual profile by itself: setup, types, data access, service calls, state plumbing, and nonvisual routing remain standard. A frontend-visual work slice adds no new test owner, reviewer, risk tier, correction loop, or closure gate; it substitutes the specialized Green worker and gives the existing risk-routed reviewer the accepted reuse and browser evidence.

When TDD applies, the test worker first performs read-only preflight and returns `EXISTING_AND_COVERED`, `EXISTING_BUT_UNCOVERED`, `MISSING`, `REGRESSION`, `PARTIAL`, `CONFLICTING`, or `UNKNOWN`. Existing covered behavior needs no write. Existing uncovered behavior receives a guarded passing characterization. Missing or regressed behavior follows serial Red then Green. For `PARTIAL`, the coordinator confirms and isolates the explicit missing gap before only that gap follows Red then Green. `CONFLICTING` or `UNKNOWN` stops for triage.

The primary opens and terminally closes the [automatic write-lease guard](./write-lease-guard.md), then inspects the receipt, actual diff, command results, and handoff. Red precedes Green when behavior is missing or regressed; accepted Red evidence can be reused without duplicate execution only while its command, working directory, relevant-tree fingerprint, environment fingerprint, and no-drift condition still match. Accepted test-owned files remain unchanged only during the implementation worker's Green turn. The test worker may revise tests under its own lease, and the primary may make one bounded exceptional test correction between leases; either path invalidates the prior evidence and requires the test boundary to be accepted again before Green resumes.

Default work-slice limits are one preflight, one coherent Red or characterization, one Green, at most one same-contract correction per role, one review correction loop, stop after the same decisive failure twice, and stop after two no-diff write handoffs. An attempt-2 correction names its terminal attempt-1 parent; the guard rejects a second child for that parent while the coordinator retains responsibility for semantic same-contract validation. More than three TDD cycles in one slice requires rescoping instead of silent microcycling.

Review is risk-routed:

| Tier | Typical surface | Review route |
|---|---|---|
| `S0` | Documentation-only or deterministic mechanical work inside an implementation ExecPlan work slice | Fresh `milestone_reviewer` at Terra high, reusing deterministic evidence; S0 work outside an implementation ExecPlan needs no LLM reviewer unless another trigger applies |
| `S1` | Ordinary bounded application work slice | Fresh `milestone_reviewer` at Terra high |
| `S2` | Cross-boundary service, persistence, browser, retrieval, provider, UI integration, or equivalent consequential work slice | Fresh `independent_reviewer` at Sol high |
| `S3` | Security, irreversible data, concurrency, locking, recovery, custom integrity or identity, or cross-platform byte equivalence | Fresh `critical_reviewer` at Sol max |

An unresolved Blocker or Major from an ordinary reviewer, or explicit project-owner direction, also triggers critical review. Final ordinary integration uses a fresh `independent_reviewer`; use `critical_reviewer` only when a critical trigger remains. Reviewers reuse fresh evidence and rerun missing, stale, contradictory, externally mutable, or risk-critical checks rather than reflexively repeating every suite.

The implementation topology above remains unchanged by research-tier routing: write-capable implementation workers do not perform research assignments, draft ADRs, resolve gates, or replace the primary decision writer. Research roles never receive implementation write leases, and Research Assignment Capsules never authorize repository edits.

### Progress summaries

The primary coordinator maintains the manual [project and agent-workflow progress index](../docs/progress/README.md). Create one living summary only after an existing roadmap task enters `In progress`; update it after an accepted material work-slice or integration checkpoint and at task closure. Include a reconciled blocker or next-boundary change only when it is part of that accepted checkpoint. Record outcomes, roles and routes actually used, accepted review or correction results, decisive evidence links, and the next boundary. Do not record every turn, duplicate the ExecPlan, copy raw reports or lease state, or add hooks, token/cost tracking, or generated telemetry. The roadmap remains the status authority, and the ExecPlan remains the detailed coordination and evidence record.

## Decision Review Contract and Risk Tier

For a roadmap-task-backed ExecPlan that compares consequential options or prepares an ADR, the primary coordinator creates a living Decision Review Contract inside that ExecPlan before comparative option research. A standalone policy decision with no selected roadmap-task owner keeps the same contract in the coordinating prompt and passes it to every assigned role and reviewer; do not invent a tracked ExecPlan, task ID, or separate contract document solely to host it. Before any bounded discovery pass, record the stable scope, authority, approval boundary, basic criteria, and forbidden changes; discovery cannot rank or recommend. After discovery, freeze the candidate set, evidence dimensions, hard gates, triggered invariants, and routing tier before comparative research. Link to authority owners and record:

- exact roadmap task or policy owner, relevant decision boundary, `R1` through `R3` classification and triggers, target artifact, approval boundary, and forbidden scope;
- common criteria, evidence classes, and required artifact-local sections or outputs;
- hard gates and score, recommendation, artifact-status, task-state, and gate-state invariants;
- a decide-now versus prove-later disposition so downstream implementation proves defined semantics rather than inventing them;
- a cumulative invariant packet with a plan-local ID, trigger or fixture, expected result, evidence or actual result, and responsible reviewer; and
- researcher assignment basis, analyst and drafter triggers, correction, escalation, re-entry, budget, and stopping conditions.

Every invariant packet covers artifact completeness, evidence honesty, and authority-state consistency. Add triggered invariants when the decision defines state transitions or concurrency, integrity or identity, deterministic or canonical bytes, cross-platform equivalence, recovery, or ownership. Re-run every applicable invariant after a material revision, not only the invariant that previously failed.

The synthesis barrier returns one readiness result. The primary may own this result for R1 and straightforward R2 work. A `decision_analyst` is mandatory for R3 and is triggered for R2 when three or more viable candidates remain materially close, reports contradict each other, decide-now versus prove-later semantics remain unresolved, or an owner-controlled choice prevents evidence-only synthesis. The analyst is not added merely because three candidates were listed. The result is:

- `DRAFT READY`: research is comparable, every required contract item is covered, decision semantics are complete enough to draft, and remaining unknowns are explicitly assigned to downstream proof. This does not approve the decision.
- `RETURN FOR RESEARCH`: evidence is missing, asymmetric, stale, or contradictory, or decision semantics remain unresolved.
- `OWNER DIRECTION`: an owner-controlled value choice, scope boundary, or exhausted stopping condition prevents an evidence-only recommendation.

A fresh contract checkpoint is required before drafting for R3 and whenever any of these risk triggers applies. Use `critical_research_reviewer` for R3 and `independent_reviewer` for a triggered R1/R2 decision:

- the decision defines a custom serialization, integrity, identity, concurrency, recovery, or cross-platform contract;
- a decision-semantic uncertainty is proposed for deferral as downstream runtime proof;
- candidates remain closely ranked or materially contradictory; or
- a correction introduces decision-critical mechanics outside the reviewed contract.

For R1 or R2 decisions without a trigger, the recorded `DRAFT READY` synthesis result is the contract checkpoint, whether issued by the primary or analyst. A triggered independent checkpoint permits one supported outline correction; if it still does not pass, return to research, analysis, tier escalation, or project-owner direction instead of drafting. Only after `DRAFT READY` and every required checkpoint may one `research_drafter` transform the frozen synthesis into one non-authoritative draft. The primary may instead draft directly and remains the sole authoritative writer in either case.

## How to Invoke the Workflow

Custom agents do not run automatically merely because their files exist. The coordinating request must name the roles, barriers, and stopping conditions. For example:

### Research and decision workflow prompt

```text
Act as the primary coordinator for the exact bounded research question. Classify
it R0, R1, R2, or R3 from objective triggers and record the highest trigger. Do not
spawn agents for R0. For R1 through R3, issue Research Assignment Capsule v1 with
exact authority anchors, evidence dimensions, budget, permissions, and stops.

For consequential decision work, create or verify the living Decision Review
Contract in the owning ExecPlan when roadmap-task-backed, or in the coordinating
prompt for a standalone policy decision. R2 or R3 may use one non-ranking discovery pass;
freeze the comparative contract afterward. Assign researchers by unresolved
evidence dimension unless candidate-specific research is necessary. Wait at one
barrier and reconcile shared evidence without duplicate collection.

Use technology_researcher for ordinary R1/R2 evidence and non-critical R3
dimensions, and critical_researcher for every dimension carrying an R3 trigger.
For answer-only research, use primary synthesis unless
an R2/R3 contradiction or complexity trigger requires decision_analyst; accept
SYNTHESIS READY, RETURN FOR RESEARCH, or OWNER DIRECTION, and give every R3 final
answer a complete fresh critical_research_reviewer evidence review.

For decision-oriented research, use primary synthesis for R1 and straightforward
R2, invoke decision_analyst for an R2 trigger and always for R3, and require DRAFT
READY, RETURN FOR RESEARCH, or OWNER DIRECTION. For R3 use a fresh pre-draft
critical_research_reviewer; for a triggered R1/R2 decision use a fresh
independent_reviewer. Draft only after the applicable checkpoint passes.

After the conclusion is frozen, either have the primary draft directly or invoke
one read-only research_drafter for one non-authoritative, provenance-mapped draft.
The primary reconciles it and performs the only repository write. Use fresh final
semantic review when the tier or target authority requires it, apply the bounded
risk-proportional correction protocol, reconcile authority state, and stop at every
project-owner approval boundary.
```

A good instance assignment states:

- the research identity, exact task or policy owner, `R` tier and trigger, target artifact, question or evidence dimension, and review stage;
- the authoritative repository inputs, Research Assignment Capsule, and Decision Review Contract when one applies;
- common comparison criteria, evidence IDs, freshness conditions, hard gates, or invariant IDs;
- whether repository writes are allowed;
- the required output structure and evidence;
- whether the coordinator must wait for peer results or use a fresh instance; and
- the success, budget, follow-up, escalation, re-entry, and stopping conditions.

### Implementation workflow prompt

Use the concise copy-paste prompt, canonical assignment packet, and lease contract in the [worker-first ExecPlan implementation workflow](./execplan-implementation-workflow.md#copy-paste-prompt-example). It defines the serial normal path and deliberately returns exceptions to coordinator triage.

## Review, Correction, and Approval Protocol

When a tier or target authority requires a final evidence checkpoint, the fresh reviewer returns `PASS`, `PASS WITH FOLLOW-UPS`, `REVISE`, or `BLOCKED` with evidence. Every R3 final answer, every Proposed ADR, and every other owner-controlled R2 or R3 decision artifact receives this checkpoint; an R0 or ordinary R1 research answer with no authoritative repository mutation does not receive an LLM reviewer by default. A `PASS WITH FOLLOW-UPS` may advance only after the primary dispositions every item and confirms that none conflicts with a definition of done, hard gate, required validation result, or documentation gate. The bounded decision-artifact review loop below remains specific to research-derived decision artifacts. Implementation exceptions continue to return to coordinator triage under the unchanged implementation guide.

For an answer-only R3 result, `REVISE` permits one supported, in-scope primary correction followed by complete fresh `critical_research_reviewer` review within the capsule's recorded correction budget. `BLOCKED` returns to the exact missing evidence, unavailable prerequisite, or owner-direction boundary. A material scope or conclusion change invalidates the prior review and returns to tier classification and research; exhausting the correction or evidence budget stops for owner direction. This answer-only loop authorizes no repository write and does not reset a researcher follow-up allowance.

1. The primary coordinator applies only supported, in-scope corrections.
2. For R1 or R2, a trace-only, formatting, link, or explicitly non-normative documentation correction may use deterministic validation plus focused review of the exact diff. A normative correction, any Blocker or Major, or any uncertain classification requires complete revised-artifact review and the full applicable invariant packet. R3 always receives complete revised-artifact review and the full packet.
3. A correction that introduces a new normative subsystem or other decision-critical mechanics invalidates the prior contract checkpoint and may escalate the R tier. Update the living contract and repeat the applicable research, synthesis, and fresh checkpoint without silently resetting the final correction count.
4. After two unsuccessful final-artifact correction cycles, or after the same decisive research gap appears twice without new evidence, freeze the proposal and ask the project owner for direction.

After cycle exhaustion, the project owner may reject the proposal, authorize named fixes plus one fresh review, or authorize a new two-cycle budget. A newly discovered Blocker or Major outside the authorized remediation returns to the owner. Do not infer a new budget from permission to make one named correction.

Before presenting any proposal for approval, the primary coordinator performs a post-verdict reconciliation barrier. It verifies the exact reviewed artifact against the Decision Review Contract and aligns the reviewer verdict, open findings, hard gates, score, recommendation, artifact status, task and gate states, documentation impact, and next action. `REVISE` or `BLOCKED` permits correction or owner direction, never an acceptance-ready presentation.

Human-controlled decisions remain human controlled. A researcher report, analyst verdict, or `DRAFT COMPLETE` result cannot accept an ADR, change a requirement or open-decision status, or close the owning roadmap task. Decisions already at an explicit owner-approval checkpoint when this policy is adopted retain their completed review evidence; do not fabricate a retrospective tier, contract checkpoint, or drafting pass. Any later material change to such a proposal activates the current material-change invalidation rule before a new approval request.

## Validation

Run the smallest checks that cover the changed Codex surface; do not run optional tooling merely because it exists.

| Changed surface | Proportional repository check |
|---|---|
| Any local documentation or navigation | Resolve every affected relative Markdown link, review changed authority/status language, and run `git diff --check`; use a repository-provided validator if the selected development task later adds one |
| Agent definitions | `python -c "import pathlib,tomllib; files=sorted(pathlib.Path('.codex/agents').glob('*.toml')); [tomllib.loads(path.read_text(encoding='utf-8')) for path in files]; print(f'Parsed {len(files)} agent TOML files.')"` |
| New or changed agent role | In a fresh trusted project session, confirm that the exact TOML `name` is discoverable before relying on the role. A successful parse or an already-open session does not prove that a newly added definition is active. |
| New or changed skill | Run the installed `$skill-creator` structural validator, confirm discovery in a fresh trusted project session, and exercise representative direct, indirect, incomplete, non-activating, and unsupported-scope requests. If the validator cannot start because its own dependency is unavailable, report that check as blocked and use an independent YAML/frontmatter parse only as supplemental evidence. |
| Conditional frontend profile | Confirm that the common packet and standard ExecPlan shape contain no profile marker or frontend evidence fields; confirm that only the conditional capsule contains `Implementation profile: frontend-visual`; parse the specialized agent and skill; then run the write-lease check below. |
| Write-lease guard | `python -B .codex/leases/lease_guard.py self-test` |
| Any changed text | `git diff --check` |

TOML parsing validates syntax only. A fresh trusted Codex project session establishes project-layer discovery; parsing does not prove runtime activation.

Apply the [task-closure documentation gate](../docs/README.md#task-closure-documentation-gate) after the component checks. When architecture or ADR semantics change, also verify the ADR index, related authority links, and decision-history consistency.

## Permission and Evidence Boundaries

The custom definitions route model and effort by role: ordinary R1/R2 research and non-critical R3 dimensions use Terra medium; R3 critical dimensions use the separate Sol-high `critical_researcher`; analysis remains Sol xhigh; non-authoritative drafting uses Terra medium; ordinary independent review remains Sol high; R3 research review and implementation-critical review use separate Sol-max roles; milestone review is Terra high; test and standard code workers remain Sol medium; and the conditional frontend code worker uses Sol high. Research, drafting, and review roles are read-only. Test and implementation workers use `workspace-write`, but only an explicit coordinator-issued path lease with a pinned automatic-guard contract authorizes a particular edit. Test-worker preflight is read-only by workflow contract and has no lease; the configured sandbox does not itself enforce that narrower phase, so any write is a violation. Current-session permission overrides may still be applied by the Codex client, so the primary thread must inspect permissions and the working tree before relying on isolation.

All authoritative repository writes derived from research remain centralized in the primary thread. A research drafter returns text only and never receives a write lease. During write-authorized implementation, ordinary application source, test, dependency, fixture, or executable-configuration edits are delegated to the work-slice-local test worker or profile-selected implementation worker in the serial order defined by the implementation guide. Persistence retains role context, not leases or authority. The primary may maintain the ExecPlan, canonical authorities, status, or guard controls only between worker leases. Its only direct implementation-side exception is a bounded test correction between leases; it must record the reason, paths, and validation, invalidate the earlier test evidence, and re-accept the boundary before Green resumes. Any other implementation correction receives a new bounded worker packet and lease.

Agent output is a supporting observation, not self-validating proof. A terminal compliant lease receipt proves only that net non-ignored repository changes stayed within the pinned path contract and that the guard's explicitly sealed Git index, `HEAD` object and symbolic ref, selected settings, and ignore controls did not drift. It does not cover all Git write operations or metadata and does not prove semantic correctness. Write-capable workers therefore remain contractually prohibited from Git write operations and metadata mutations and may use Git only for read-only inspection. The primary agent must inspect the final repository state, run the task's authoritative validators, perform the documentation-impact review, and own the handoff. A lease-guard failure freezes the affected write branch.

Repository instruction discovery follows the official OpenAI documentation for [custom instructions with `AGENTS.md`](https://learn.chatgpt.com/docs/agent-configuration/agents-md). Repository skill location and progressive disclosure follow [Build skills](https://learn.chatgpt.com/docs/build-skills). The file schema and project-scoped `.codex/agents/` location follow the [Codex subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents). Project-layer trust and configuration follow the [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).
