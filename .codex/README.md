# Project-scoped agent coordination

This workflow adapts responsibility-separated research, implementation, and review routing from an external project to A11y Evidence Lab. It is intentionally lighter because this repository already has an accepted [development roadmap](../docs/DEVELOPMENT_ROADMAP.md), a [documentation authority map](../docs/README.md), and a narrow portfolio MVP.

This file is procedural guidance only. It does not authorize implementation, alter a requirement or decision, create a second task hierarchy, or prove that work is complete. [AGENTS.md](../AGENTS.md) and the authorities routed from the selected roadmap task remain controlling.

## Roles

The primary agent is always the coordinator. It owns readiness checks, interpretation of authorities, task boundaries, assignment and risk routing, integration, final verification, documentation and roadmap reconciliation, user communication, and any Git action the user authorizes.

The custom roles preserve separate contexts and select proportionate model cost and reasoning for distinct responsibilities:

| Role | Stable responsibility | Boundary |
| --- | --- | --- |
| [`technology_researcher`](agents/technology-researcher.toml) | Investigate one ordinary external technical question using primary sources | Read only; does not synthesize a final decision or edit the repository |
| [`critical_researcher`](agents/critical-researcher.toml) | Investigate one explicitly critical research dimension and its failure paths | Read only; critical route only |
| [`decision_analyst`](agents/decision-analyst.toml) | Reconcile multiple research reports or consequential options into a traceable recommendation | Read only; does not approve or record the decision |
| [`research_drafter`](agents/research-drafter.toml) | Transform a frozen conclusion into one non-authoritative draft | Read only; performs no new research and makes no decision |
| [`critical_research_reviewer`](agents/critical-research-reviewer.toml) | Adversarially review critical research or a consequential decision artifact | Read only; does not repair or approve the artifact |
| [`test_worker`](agents/test-worker.toml) | Perform behavior preflight and own one focused test-side or characterization change | Workspace write only when assigned; never changes production behavior |
| [`code_worker`](agents/code-worker.toml) | Implement one bounded standard setup or production-code slice | Workspace write; never weakens the accepted test boundary |
| [`frontend_code_worker`](agents/frontend-code-worker.toml) | Implement one bounded rendered-UI slice using the frontend-quality skill | Workspace write; no independent design or product-scope authority |
| [`milestone_reviewer`](agents/milestone-reviewer.toml) | Review one ordinary completed roadmap task proportionately | Read only; does not repair or close the task |
| [`independent_reviewer`](agents/independent-reviewer.toml) | Review a cross-boundary milestone, decision, or integrated state | Read only; does not repair or close the task |
| [`critical_reviewer`](agents/critical-reviewer.toml) | Perform maximum-effort implementation review for a named critical trigger | Read only; critical route only |

Custom agents do not run merely because their files exist. The coordinator invokes only the role justified by the current assignment; a small local fact check or mechanical documentation change normally needs no subagent.

## Model and reasoning policy

The role files explicitly pin model and reasoning effort so a high-effort orchestrator does not make every delegated task equally slow and expensive:

| Role group | Model and effort | Reason |
| --- | --- | --- |
| `technology_researcher`, `research_drafter` | `gpt-5.6-terra`, `medium` | Cost-balanced source gathering and bounded transformation |
| `milestone_reviewer` | `gpt-5.6-terra`, `high` | Strong ordinary review without maximum-cost reasoning |
| `test_worker`, `code_worker` | `gpt-5.6-sol`, `medium` | Reliable bounded test and implementation work |
| `frontend_code_worker` | `gpt-5.6-sol`, `high` | Additional judgment for rendered hierarchy, states, and accessibility |
| `critical_researcher`, `independent_reviewer` | `gpt-5.6-sol`, `high` | Consequential evidence or cross-boundary review |
| `decision_analyst` | `gpt-5.6-sol`, `xhigh` | Difficult multi-report or multi-option synthesis |
| `critical_research_reviewer`, `critical_reviewer` | `gpt-5.6-sol`, `max` | Rare quality-first critical review |

The custom roles follow the project-scoped file format and override behavior documented in the official [Codex subagents guide](https://learn.chatgpt.com/docs/agent-configuration/subagents). If a pinned model or effort becomes unavailable, update this table and every affected role file together rather than silently inheriting the orchestrator setting.

## Proportional routing

Research is routed by consequence, not by the number of available agents:

- `R0`: repository-local facts; the coordinator handles them directly.
- `R1`: one ordinary external question; use at most one `technology_researcher`.
- `R2`: a consequential or cross-boundary choice; use only the independent evidence assignments needed, then `decision_analyst` when synthesis is genuinely difficult and `independent_reviewer` when a decision artifact needs fresh review.
- `R3`: a named security, integrity, irreversible-data, concurrency, recovery, serialization, or cross-platform risk; assign each critical dimension to `critical_researcher`, use `decision_analyst` for decision synthesis, and require fresh `critical_research_reviewer` review.

Implementation review is similarly risk-routed:

- `S0`: small documentation or deterministic mechanical work; coordinator review is sufficient.
- `S1`: ordinary bounded implementation; use `milestone_reviewer`.
- `S2`: cross-boundary integration or a materially consequential change; use `independent_reviewer`.
- `S3`: a named critical trigger matching the R3 categories; use `critical_reviewer`.

Higher tiers do not authorize broader scope. The coordinator records the highest actual trigger in the assignment and does not escalate merely because a stronger agent exists.

## Entry gate

Before any implementation write, the coordinator must confirm all of the following:

1. The user selected a concrete existing roadmap task or milestone.
2. Its dependencies are complete.
3. Its applicable Must requirements and open-decision portions are Accepted or explicitly Deferred.
4. Its stated evaluation-freeze condition is satisfied.
5. Git status and unrelated user changes are understood and preserved.

If any condition fails, stop at analysis or report the blocker. Delegation cannot bypass the gate.

## Bounded assignment capsule

Every delegated task must state, in its prompt:

- the exact research question, decision boundary, or selected roadmap task or milestone ID;
- the objective and observable outcome;
- the R/S tier and trigger when tiered routing applies;
- dependency and freeze-gate results for implementation;
- exact requirement, ADR, specification, and roadmap anchors to apply;
- the permission boundary and allowed or forbidden paths when writes are possible;
- explicit non-goals and forbidden scope;
- required evidence, output structure, validation, and real-integration boundary as applicable;
- execution or follow-up budget;
- known unrelated working-tree changes;
- whether the frontend-quality skill applies to an implementation assignment; and
- success and stop conditions.

Keep this capsule in the active task or handoff. Do not create another tracked task-ID system, lease record, or evidence ledger for it.

## Research and decision flow

1. **Classify.** The coordinator records `R0` through `R3`, the trigger, exact question, authorities, evidence dimensions, output, budget, and stop conditions.
2. **Investigate.** Assign independent dimensions to the minimum justified researcher roles. Parallel research is allowed only where the questions do not depend on one another.
3. **Synchronize.** The coordinator waits for the selected reports and reconciles facts, contradictions, unknowns, and owner-controlled choices.
4. **Analyze only when needed.** Invoke `decision_analyst` for a genuinely difficult R2 synthesis and every R3 decision. The analyst recommends but does not decide.
5. **Draft once.** If a substantial target document is needed after the conclusion is frozen, either the coordinator drafts it or one `research_drafter` returns a non-authoritative draft.
6. **Review proportionately.** Use the applicable fresh reviewer for a consequential decision artifact. The coordinator alone writes authoritative documentation and requests any required owner approval.

## Implementation flow

1. **Route and scope.** The coordinator reads the router and selected task authorities, checks readiness, and defines the capsule.
2. **Preflight.** The coordinator or `test_worker` inspects the current implementation and tests before editing. Classify behavior as already present and covered, present but uncovered, missing or regressed, partial, conflicting, unknown, or blocked. Search absence alone is not proof.
3. **Establish the test boundary when applicable.** For automatable missing or regressed behavior, `test_worker` owns the focused failing test; for existing uncovered behavior it may add a passing characterization. Do not force test-first sequencing onto documentation, declarative setup, manual capacity screens, or external evaluation evidence.
4. **Implement proportionately.** Use `code_worker` for standard setup or production behavior and `frontend_code_worker` only for a rendered-UI slice. Keep test and production ownership separate for the assigned behavior-bearing slice; do not run them as concurrent writers.
5. **Verify locally.** Each worker runs the focused checks named by the task, inspects its diff, and returns its explicit outcome with changed paths, commands, results, limitations, and documentation impact. It does not commit or change roadmap status.
6. **Integrate authoritatively.** The coordinator inspects the actual worktree and diff, reruns the task-level checks needed for authoritative evidence, and checks that no unrelated work or Deferred scope entered the change.
7. **Review by risk.** Route `S1` to `milestone_reviewer`, `S2` to `independent_reviewer`, and `S3` to `critical_reviewer`; use direct coordinator review for `S0`.
8. **Correct once.** If review requires a bounded correction and the accepted contract is unchanged, use the same responsible worker once and reverify. If correction would change scope, authority, architecture, or dependencies, stop and reconcile with the user or canonical documents.
9. **Close with evidence.** Only the coordinator may update task status, and only after the roadmap's verification evidence exists. Report the changed paths, exact verification, remaining limitations, and any status or documentation impact.

## Parallelism

Prefer parallel agents for independent read-heavy exploration, test-log analysis, or review. Use only one active writer at a time in a worktree.

Roadmap-approved parallel write groups may run concurrently only in separate worktrees after the user selects every participating task and a focused [execution plan](../PLANS.md) establishes non-overlapping ownership, separate baselines, and the named integration checkpoint. Without separate worktrees, execute those tasks serially. A shared contract, aggregate mutation, lifecycle, UI composition, or integration boundary remains serial in every case.

## Stop conditions

Stop the delegated work and return `BLOCKED` when any of these occurs:

- a dependency, Accepted decision, or freeze gate is missing;
- the assignment conflicts with a canonical authority;
- completing it requires paths or product scope outside the capsule;
- unexpected user changes overlap the assigned write surface;
- a focused test fails for a reason outside the selected behavior;
- required real integration is unavailable and a test double would become the sole evidence; or
- a significant architecture decision is discovered.

Do not silently broaden scope, invent a substitute, revert user work, or mark partial work complete.

## Validation

Parse all role files after changing them and confirm that every `name`, model, effort, and sandbox value is present and unique. TOML parsing proves configuration syntax only. Before relying on a new or renamed role, open a fresh trusted Codex task or session and confirm that the exact role name is discoverable; an already-open session may not reflect newly added project-scoped definitions.

## Deliberate omissions

This project preserves the source flow's responsibility separation and cost-aware model routing. It does not import source-specific issue IDs, mandatory per-task ExecPlans, assignment-packet bureaucracy, write-lease scripts, hooks, metrics, token accounting, automatic retry machinery, or a parallel writer pool. Those mechanisms would duplicate the accepted roadmap or add coordination infrastructure that this portfolio MVP does not currently need.
