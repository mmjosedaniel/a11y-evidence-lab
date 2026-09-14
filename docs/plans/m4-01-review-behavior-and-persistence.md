# Implement proposal-only review behavior and persistence

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M4-01](../DEVELOPMENT_ROADMAP.md#m4-01--implement-proposal-only-review-behavior-and-persistence), In progress for owner-requested current-state review and planning only. Application execution has not been requested.
- **Latest barrier:** [M401-PLAN-01](#m401-plan-01--accepted-planning-readiness), independent planning readiness PASS with no findings and accepted documentation checks, following [M401-ENTRY-01](#m401-entry-01--planning-evidence). M3-05 is Complete; M3-03 remains independently Blocked on full-stack capacity. This plan selects neither task again.
- **Pending:** owner execution request, then [G](#g--freeze-the-minimum-review-contract) must resolve the literal and command slots before A preflight. No review implementation or final decision exists yet.
- **Allowance:** no implementation attempt or actual scan, retrieval, generation, credential inspection, acquisition, or human review of retained proposals is authorized by this planning request. Future workflow budgets are in [Plan of Work](#plan-of-work).
- **Active lease:** None. No implementation worker has been dispatched.
- **Next:** owner execution request. Future execution resumes through G, then [A/B](#a--pure-review-contract-and-durable-reader), the [command freeze](#concrete-steps), [acceptance](#validation-and-acceptance), and [recovery](#idempotence-and-recovery).

## Progress

- [x] (2026-09-14 00:52Z) Review current authority, M3-05 completion, task dependencies, relevant source seams and existing verification; record M401-ENTRY-01. This is 2026-09-13 in the owner's local timezone.
- [x] (2026-09-14 01:00Z) Task-scoped planning draft exists with narrow contract, ownership, risk, command and recovery gates; no implementation literals are accepted by this draft.
- [x] (2026-09-14 01:04Z) Accept independent planning readiness PASS with no findings and proportional documentation checks; record M401-PLAN-01. This does not accept G or implement M4-01.
- [ ] After owner execution authorization, accept M401-G and exact A/B command packets.
- [ ] Accept A: pure review contract and durable-reader extension through separate-owner TDD and fresh S3 review.
- [ ] Accept B: selected-Finding persistence and internal service through separate-owner TDD and fresh S3 review.
- [ ] Accept integrated verification, different fresh critical review and documentation closure; only then mark M4-01 Complete and archive this plan.

## Surprises & Discoveries

- M3-05 is fully closed, not merely at its earlier implementation checkpoint. Its [final acceptance](completed/m3-05-generation-checkpoint.md#m305-final-06--integrated-review-and-task-closure) records one actual mechanically valid proposal per provider, both pending human review. Earlier invalid responses and semantic limitations remain evidence, not automatic acceptance or quality qualification.
- M3-05 also accepted forward-only role-aware passage selection and runtime generation-instruction corrections. Current code preserves historical retrieval/invocation interpretation. M4-01 must preserve these current contracts, not restore historical global-three selection or rewrite the frozen generation package.
- Successful generation releases its live continuation owner in `src/server/local-service/generation-operation.ts`; durable proposal review cannot depend on retaining that owner. Conversely, an uncertain cleanup can retain ownership and must continue to prevent conflicting operations.
- The existing repository already supplies expected-current comparison, selected-Finding isolation and pre-commit safe publication. Review needs a new transition policy, not another writer or transaction framework.

## Decision Log

- Decision: activate only M4-01 planning. Rationale: the explicit owner request and completed M3-05 satisfy task selection and dependency readiness; there is no authorization to implement in this turn. Date/author: 2026-09-14 UTC / primary.
- Decision: plan two behavior-bearing slices and one closure boundary, reusing the current single-file writer. Rationale: validation and storage/service responsibilities are distinct; the existing publication mechanism already owns filesystem safety. Date/author: 2026-09-14 UTC / primary.
- Decision: route future unresolved review identity, transitions and recovery literals through R3 G, and A/B through S3. Rationale: final-decision integrity, stale writes, reentrancy and last-valid-file recovery are named triggers; ordinary local discovery is R0 and does not need a research team. These classifications do not accept a particular literal design. Date/author: 2026-09-14 UTC / primary.
- Decision: keep browser transport and rendered controls with M4-02. Rationale: M4-01 can prove its service and persistence contract directly; no UI is needed to manufacture a service checkpoint. Nonvisual domain/service work does not invoke the frontend-quality overlay. Date/author: 2026-09-14 UTC / primary.

## Outcomes & Retrospective

Planning is complete with independent readiness PASS and documentation checks. The current application can generate and display original proposals but cannot record a review decision. No task verification, semantic review, persistence success, capacity result or provider quality claim is created by this plan. Execution and its lessons remain pending. The plan reuses current publication safeguards and keeps UI work in its existing downstream task instead of adding another persistence or workflow mechanism.

## Purpose / Big Picture

Give the existing application-owned service one operation that records a person's final decision for one valid pending proposal. Approval accepts the original; edit-and-accept stores a complete validated edited proposal beside the unchanged original; rejection accepts no remediation plan. Invalid acceptance leaves the last valid aggregate unchanged. A reviewer will observe the result through controlled service calls and validated disk readback in M4-01, then through the accessible interaction in M4-02 and the real-proposal demonstrations in M4-03.

## Context and Orientation

The [authority map](../README.md#authority-and-status-map) and [task router](../README.md#read-by-task) lead to [global requirement semantics](../PROJECT_REQUIREMENTS.md), the [roadmap](../DEVELOPMENT_ROADMAP.md), and these selected authorities:

| Authority | Binding M4-01 obligation |
| --- | --- |
| [REQ-REV-001, 008, 009](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#human-review-and-manual-checks) | Proposal-only human review; one final decision; support and judgment gates; original and sibling preservation; bounded optional note; edited proposal only for edit-and-accept. |
| [REQ-UX-011](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export) | Only a valid generated proposal is review-eligible; no abstention or bulk review. M4-01 supplies service enforcement; M4-02 owns controls and presentation. |
| [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | One application-owned `run.json`, existing identities, one nested current decision and safe last-valid publication; no database or audit graph. |
| [SPEC-005](../specs/SPEC.feature), [HS-010](../specs/HARD_SPEC.feature) | All three actions, support/judgment rejection cases, unchanged original, timestamp, no sibling mutation, non-blocking post-change reminder. |
| [Information and workflow lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) | Pending versus terminal review state; nested failure cannot retrospectively fail a completed scan/run; no retry/resume/history workflow. |

All selected Must requirements are Accepted. OD-026's user-facing retained-run reopening remains Deferred; validated service reads remain required. No unresolved significant architecture decision is assumed resolved here. The pending G choices are task-owned literals inside the Accepted contract; an incompatible architecture or scope change goes to the owner before dependent work.

Entry has sixteen Complete tasks, M3-03 Blocked, and ten tasks still Not started after this M4-01 planning activation. M3-03's separate Qwen capacity gate still controls M6-02; a saved Local proposal is not its substitute. The frozen M3-01 evaluation package and its thirteen references remain protected; M4-01 runs none of the six generation evaluations and does not alter gold, prompts, retrieval policy, model configuration or quality claims.

Current seams, inspected at entry:

- `src/server/domain/run-contract/run-types.ts` represents native, retrieved, assessed and generation Findings, but no reviewed branch. `retrieval-validation.ts` dispatches stored generation to `generation-validation.ts`, which currently permits a completed generation only in `proposal-pending-review` with a validated original `result`.
- `src/server/generation/proposal-contract.ts` already owns the closed structured proposal, source-reference and selected-Finding validation. Reuse this validator for an edited proposal; do not invent a second proposal schema or change provider instructions.
- `src/server/persistence/run-repository.ts` validates candidate and readback representation, compares the expected aggregate, writes an exclusive temporary file, flushes and renames before reporting success. `run-repository/selected-finding-transition.ts` compares one changed Finding and unchanged run, scan and native evidence. `generation-transition.ts` deliberately does not permit review.
- `src/server/service.ts` owns busy/stopping/read reservation and continuation coordination. `local-service/contracts.ts` has no review operation. Generation and retrieval each retain ownership when their cleanup is uncertain. Review must respect these states without invoking either provider or the retrieval engine.
- `tests/helpers/m302-generation-fixture.ts` and existing generation/service/repository tests supply controlled validated proposal inputs and real test-only aggregate patterns. There are twenty-five authoritative test files in the current [verification command](../../README.md#development-toolchain).
- Existing client result presentation knows pending proposals, not final review states. Do not expose browser review in M4-01; M4-02 must add its final-state rendering together with the review interaction. Independent strict checking and the existing client build still have to pass after the type extension.

## Scope and Non-Goals

Implement only pending-proposal admission; exactly one immutable final action and timestamp; reviewer support confirmation; concise blocking-judgment disposition; optional bounded note; complete validated edited proposal only for edit-and-accept; selected-only durable transition; bounded errors and truthful failure handling. Preserve the original proposal, its post-change reminder, native evidence, generation provenance, retrieval, analysis, siblings and parent run state.

Do not build HTTP/client review routes, rendered controls, reviewer identity/authentication, teams, history, versions, audit trails, per-claim records, manual-check entities, retries, regeneration, bulk actions, schema migration infrastructure, new dependencies, configuration, database, generic workflow engine or speculative shared abstractions. No actual provider calls, scans, retrieval, downloads, credentials, retained owner-proposal mutations, capacity screen, evaluation runs or semantic ground-truth claim is needed for M4-01. M4-02 and M4-03 remain separately selected tasks.

## Plan of Work

Follow [worker-first execution](../../.codex/execplan-implementation-workflow.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) and the [write guard](../../.codex/write-lease-guard.md). The primary owns authoritative decisions/documents, packet acceptance, lease open/terminal close, integration and closure; ordinary test and production edits stay delegated. All research/review roles are read-only. No worker receives documentation, authority, plan, workflow or Git-write ownership.

For each A/B slice, project the accepted G contract into one complete Milestone Assignment Packet v2 before read-only `test_worker` preflight. Resolve `EXISTING_AND_COVERED`, characterization, missing behavior or the explicit missing part of `PARTIAL` honestly. `UNKNOWN`/`CONFLICTING` stop for primary triage. A missing module/export can be initial Red only under the documented first-module exception, with complete behavior tests and verified environment; a load failure is capability absence, not proof that assertions ran.

Use one persistent `test_worker` and one `code_worker` per slice, sequential Red then Green/optional bounded Refactor. Every write turn gets a fresh primary-opened lease and terminal close; accepted tests are immutable during Green. Only one lease may be active per worktree, and primary documentation work happens between leases. Inspect the actual diff, evidence identity, cohesion and terminal receipt before accepting any handoff. No parallel writers are planned; independent read-only review may overlap primary non-conflicting documentation checks.

Budgets follow the existing workflow: one preflight and coherent Red/characterization then Green, at most three write attempts per unchanged role/phase chain (initial, ordinary correction, conditional final correction with its required learning record), and one review correction loop. No fresh agent or slice ID resets a consumed budget. Two repeated decisive gaps without new evidence, two no-diff handoffs, changed binding fields or an exhausted budget stop dependent work for primary triage. An owner decision is needed only where the remaining authority cannot resolve the issue.

### G — Freeze the minimum review contract

**M401-G; R3; TDD: Not applicable.** This is future primary-owned decision/command work, not a worker lease. Replacement evidence is traced authority, current-seam analysis, a complete adverse-case contract and the required independent research checkpoints. Responsibility changes: None — no application-source responsibility changes.

Use the [Decision Review Contract](#decision-review-contract) to choose the smallest compatible request, decision and outcome representation and freeze its exact validators. In particular resolve action/state spellings, mandatory/optional keys, note and reason bounds/counting/normalization, judgment dispositions for each action, support-confirmation input and whether any compact persisted confirmation is necessary, full edited-proposal validation, timestamp ownership/chronology, immutable fields, error mapping, stale/repeated submission behavior and operation reservation/cleanup semantics. A model's `blockingManualJudgment` prose (including the observed string `false`) is not a human disposition. Mechanical citation validation is not a finding that a claim is true.

Freeze how an edit resolves unsupported claims or contradictory judgment without retaining intermediate edits or per-claim records. Approval/edit require support confirmation for the resulting proposal and supporting judgment or explicit not-applicable reason; rejection must remain possible without asserting support or a successful judgment. A post-change reminder is not a pre-acceptance checklist or completed action. Reject partial edited objects and edits attached to other actions.

Keep format-version-1 historical records readable while adding strict final branches; do not add a migration unless an actual incompatibility requires owner reconsideration. Choose one non-cyclic validator dependency path. Freeze the exact internal service signature, safe reservation before untrusted input reflection, handling of existing retained owners/stopping/reentrancy, and authoritative reread/expected-current publication. A validated pending proposal can be reviewed without a live generation continuation, including after a service restart; this supplies no user-facing reopen feature.

Before accepting G, complete the [command slots](#future-command-freeze) and exact A/B path sets. A reference to a future test file is not an executable command packet. Acceptance requires required research verdicts, primary reconciliation, and no unresolved owner-controlled choice. It grants no broader task or actual operation.

### A — Pure review contract and durable reader

**M401-A; TDD; S3.** Authorities: REQ-REV-001/008/009, REQ-UX-011, ADR-0021, SPEC-005 and HS-010 as mapped above. Preflight target: no review request/decision validator or stored reviewed-Finding branch currently exists; validate that finding before Red.

Test-owner candidate paths: `tests/review-contract.test.ts`, `tests/helpers/m401-review-fixture.ts`, and necessary focused cases in `tests/run-contract.test.ts`. Green never edits them. Production candidate paths and responsibility placement:

| Path/symbol | Responsibility and bounded change |
| --- | --- |
| `src/server/domain/review-contract.ts` (new) | Pure final-decision/input validation and minimal types; reuse proposal validation, existing value readers and identities. No storage, clock, service or provider calls. |
| `src/server/domain/run-contract/review-validation.ts` (new) | Strict durable reviewed-Finding branch and timestamp/context validation, preserving the original generation branch. |
| `src/server/domain/run-contract/run-types.ts`, `src/server/domain/run-contract.ts` | Add/export only the required reviewed-Finding types and validator surface; do not duplicate native or proposal contracts. |
| `src/server/domain/run-contract/retrieval-validation.ts`, `src/server/domain/run-contract/generation-validation.ts` | Minimal dispatch or local extraction needed to reuse completed-generation validation without permitting illegal original generation transitions. G freezes which files actually need edits and the acyclic edge. |

Pure validation depends on existing value/proposal contracts; durable validation composes it, never the reverse through a cycle. A local extraction of completed-generation validation is allowed only if needed by both current pending and new reviewed branches; no generic state machine or unrelated splitting.

Prove the A acceptance cases in [I2–I5](#validation-and-acceptance), old-record compatibility and no newly permissive keys/states. Focused commands cover the new pure suite, run-contract and generation-contract regressions plus independent strict TypeScript. Advance only with accepted unchanged-test Green, complete evidence identity and fresh `critical_reviewer` PASS or explicitly reconciled non-blocking follow-ups; Major/Blocker findings block B.

### B — Selected-Finding persistence and internal service

**M401-B; TDD; S3.** Same selected authorities, with ADR-0021 and lifecycle failure rules controlling durable truth. Preflight target: repository and service currently lack a review operation; characterize existing publication/isolation behavior rather than recreating its tests as fabricated Red.

Test-owner candidate paths: `tests/review-repository.test.ts`, `tests/review-service.test.ts`, `tests/helpers/m401-review-fixture.ts`; necessary focused additions to `tests/run-repository.test.ts` or `tests/local-service.test.ts` must be named at G. Production ownership:

| Path/symbol | Responsibility and bounded change |
| --- | --- |
| `src/server/persistence/run-repository/review-transition.ts` (new) | Permit only valid pending-to-final selected-Finding transition; reuse expected-current and selected-Finding isolation; preserve original/context and disallow later replacement. |
| `src/server/persistence/run-repository/contracts.ts`, `src/server/persistence/run-repository.ts` | Add typed review update and route it through the existing validated publication path. No new serializer, filesystem protocol or post-commit fallible filesystem check. |
| `src/server/local-service/review-operation.ts` (new) | Coordinate one explicit review request, durable eligibility read, service-owned decision time and exactly one update; no retrieval/generation or transport implementation. |
| `src/server/local-service/contracts.ts`, `src/server/service.ts` | Expose the minimal internal operation/outcome and reuse shared busy/stop/reservation and retained-owner checks. Entry point coordinates; substantive review validation remains outside it. |

Dependency direction is service coordination → pure review contract and repository → transition/aggregate validators; domain and persistence never import service or UI. Existing publication, selected-Finding transition and shared service reservation are reused, with only the local extraction/signature adjustment necessary for review. G must name any changed edge and exact allowlist before preflight; discovering required UI or broader production edits stops for replanning, not silent Green expansion.

Focused checks cover new repository/service suites, A coverage and affected run-repository/local-service/generation-service regressions. Controlled valid proposal fixtures may seed exclusive test-owned aggregates; a provider fake demonstrates only no-call or deterministic setup, never real provider success. Service-to-real-disk readback, stale/repeated request rejection, sibling preservation and injected pre-commit failure are required. Fresh S3 review accepts B only after [I1–I10](#validation-and-acceptance) have applicable evidence and compliant terminal leases.

### C — Integrated verification and documentation closure

**M401-C; no production write slice; TDD: Not applicable.** The primary integrates accepted A/B evidence, runs the complete maintained authoritative suite (currently twenty-five files, plus accepted review suites), independent strict TypeScript and the client build, and validates test-owned durable results through the real repository/service boundary. Do not add another implementation module just to administer this proof. Any missing behavior returns to the owning slice within its remaining budget.

Use a different fresh `critical_reviewer` for the complete integrated candidate, accepted invariants, actual diff and evidence. No browser observation is required for a nonvisual M4-01 change, and no manual test may finalize a retained owner proposal. Historical M3-05 real-provider evidence is preserved, not rerun. Review is not capacity, accessibility certification or semantic ground truth.

The primary applies the [documentation closure gate](../README.md#task-closure-documentation-gate): update developer command inventory/API documentation for implemented behavior, plan, roadmap and progress coherently, inspect other affected navigation/current-status statements, and run proportional links, consistency, configuration, formatting and `git diff --check`. Requirements/ADRs need no change unless a genuinely new accepted decision arises. Mark Complete and archive only after task Verification and that gate pass; M4-02 stays Not started until selected.

## Decision Review Contract

**Identity:** M401-G, future R3 literal freeze, not yet researched or accepted. **Artifact:** one accepted contract/command subsection in this living plan; no new ADR, policy document, research report or ledger by default. **Approval boundary:** the primary may accept compatible task-owned literals after mandatory workflow checkpoints; contradictions, significant architecture or expanded authority require the owner.

**Discovery and candidates:** at most one bounded non-ranking pass to close exact current-seam questions. Before comparison, freeze the credible minimal representations for the single decision, human confirmation/judgment and safe operation admission. Include direct reuse of the current transition/writer and a small review-specific validator as the baseline; reject database/history/workflow/second-writer options at the scope gate rather than researching them. Do not rank or silently freeze field spellings during discovery.

**Common criteria and hard gates:** all selected authority semantics; complete closed validation; exactly one final decision; original/context/sibling integrity; old-record readability; last-valid-file recovery; honest operation/cleanup state; no new provider activity; cohesive direct implementation and testability. Minimal size cannot trade away one of these gates. Decide the representation now; prove runtime behavior later through A/B. Neither research nor a passing validator proves a person's semantic judgment.

**Evidence and budget:** one `critical_researcher` report for the cohesive decision-to-commit integrity dimension, explicitly covering shape/identity, stale/reentrant admission, serialization compatibility and failure recovery against current source and authorities; one bounded follow-up if a material gap remains. One mandatory `decision_analyst` synthesis/contract audit plus one bounded correction; a fresh `critical_research_reviewer` pre-draft checkpoint, primary-only authoritative drafting, and a different fresh `critical_research_reviewer` final complete-artifact review. No optional drafter is needed. Allow one pre-draft correction and the workflow's maximum two final-artifact correction cycles, without resetting the research or repeated-gap budget. If the single cohesive report cannot cover the named dimensions, stop and revise the capsule before commissioning more work.

Each assignment receives a Research Assignment Capsule projecting this contract, the exact authorities, current source/evidence identity, required outputs and the remaining budget. Synchronize all research before analysis. The analyst returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`; DRAFT READY does not bypass R3 pre-draft review or authorize a worker. Final research review assesses the exact primary-written artifact and complete I1–I10 packet, with each invariant linked to evidence or explicitly pending runtime proof. The primary reconciles all verdicts before accepting G. Two occurrences of the same decisive gap without material new evidence, exhausted correction/report allowance, changed authority or scope stop dependent work; no additional panel or agent can reset those limits.

## Concrete Steps

Working directory for every command: `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Use the maintained [README preparation](../../README.md#development-command-preparation), not an archived task's runtime or lease baseline. Current pinned Node is 24.20.0. No install/restore is needed for planning; if execution prerequisites are missing, stop and freeze an authorized bounded restoration command before changing them.

### M401-ENTRY-01 — Planning evidence

At clean HEAD `ee19c4bcabbdc84b4377f5b28f19f468fd0aca87`, current-state inspection found no active `logs/agent-flow-leases/v2/active.json`. On 2026-09-14 00:52 UTC, independent strict TypeScript and all **106** tests across run-contract, generation-contract and generation-stage passed, with no skips or failures. This is focused planning evidence, not a full-suite rerun or task Verification. The M3-01 manifest SHA-256 is `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`, matching its frozen identity; all thirteen `path`/`sha256` references also pass fresh exact-byte hash checks. No actual model, scan, retrieval or review action was performed.

The following read-only/pure checks can be repeated after reading and dot-sourcing the current README preparation:

```powershell
git status --short
git rev-parse HEAD
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') { throw 'Resolve existing lease before continuing' }
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/generation-contract.test.ts tests/generation-stage.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Planning contract checks failed' }
}
git diff --check
```

The recorded HEAD is historical evidence, **not an executable equality gate**. At execution entry, record then-current intentional HEAD, expected dirty paths, relevant source/test/configuration hashes, frozen-input identities, runtime/environment, command and working directory; preserve unrelated changes. Compare leases and reuse evidence to that accepted execution identity. If the plan was committed or edited, reconcile the new state and revalidate affected bindings instead of requiring an uncommitted plan or replacing a hash mechanically. Never use an old parent's HEAD in receipts or final closure.

### Future command freeze

These are intentionally unresolved **slots**, not permission to improvise a command after review. G fills them before the affected preflight, worker lease or primary effect. Use the existing packet/guard procedure, not new command tooling:

| Slot | Required frozen contents and effects |
| --- | --- |
| M401-CMD-PREFLIGHT / RED-A / GREEN-A | Exact pure callers, selected new/existing test files, expected initial absence versus behavioral failure, strict checker, working directory and environment; no provider, listener, persistent run or acquisition effects. |
| M401-CMD-RED-B / GREEN-B | Exact focused callers and test-owned filesystem operations, exclusive scratch leaf names/parents, seeded synthetic proposal provenance, environment and bounded runtime; any controlled service listener's loopback scope, owner and stop proof. No existing owner run root. |
| M401-CMD-REGRESSION | Current full README suite plus every new accepted test file, required mock flag, strict checker and client build; exact order, maximum caller durations, prerequisite absence of running app/concurrent browser test, known build output and scanner/UI/integration scratch effects. No actual provider calls. |
| M401-CMD-PREPARE / CLEANUP | Validate absolute paths and every ancestor against aliases/reparse points; reject unexpected or nonempty leaves; create only exclusive task-owned test leaves, preserve evidence before cleanup, close owned service/handles before removal, enumerate exact removable targets, report cleanup effects and verify final state. No broad recursive delete, global process kill or user-data cleanup. |
| M401-CMD-GUARD / CLOSE | Exact current guard callers, packet digest, allowlist, protected tests/authorities, baseline/relevant-tree identities, attempt parent and terminal receipt checks. Primary alone opens/closes and maintains guard metadata between worker leases. |
| M401-CMD-DOCS | Exact changed-document checks, relative links/anchors, UTF-8/newline/trailing whitespace, command parsing, suite inventory consistency, expected dirty paths, frozen inputs unchanged and `git diff --check`. No Git metadata mutation. |

Freeze budgets for any primary-run proof too. Dependency/bootstrap/model installation is not planned; an absent prerequisite creates an explicit unresolved preparation boundary, not a hidden permission to install. Existing README command preparation owns environment restoration. Add no npm scripts, external packages or configuration unless a demonstrated accepted requirement forces primary replanning first.

## Validation and Acceptance

G carries the cumulative invariant packet below into research and runtime packets. Each row's current actual result is **pending** except the authority/current-state facts in M401-ENTRY-01. Research reviewers assess contract completeness and evidence honesty; A/B fresh critical reviewers own their runtime rows; the different C reviewer verifies the complete set. Record exact trigger, expected result, command/test identity and actual result under stable acceptance IDs rather than duplicating full outputs.

| ID | Trigger and expected result | Proof owner |
| --- | --- | --- |
| I1 | Current task/authority and frozen-input check: only M4-01 changes, accepted original evaluation bytes/provenance retained; no implementation, semantic or capacity claim without its evidence. | Primary; G and C reviewers |
| I2 | Native, active, abstained, failed, invalid, wrong-ID and already-reviewed inputs: bounded rejection, no final decision or mutation. Only a valid pending generated proposal is eligible. | A/B tests; A/B reviewers |
| I3 | Approve/edit with absent or false material-support confirmation, unresolved/contradictory blocking judgment, or N/A without a reason: blocked. Supporting judgment or explicit reasoned N/A plus confirmed supported resulting claims permits acceptance; reject needs no success assertion. Test every supported profile. | A/B tests; A/B reviewers |
| I4 | Approve, edit-and-accept and reject: exactly one action/time/disposition; bounded optional note; complete validated edited proposal only for edit-and-accept. Unknown fields, malformed/oversized/non-finite values, partial edits, wrong finding/references and invalid chronology fail. Post-change reminder is preserved and non-blocking. | A tests; A reviewer |
| I5 | Pending and historical valid records remain readable; final records round-trip through the strict aggregate validator with action/state consistency. Original proposal, native evidence, generation invocation, retrieval/analysis and parent metadata stay unchanged. No automatic claim that mechanical references establish semantic support. | A/B tests; G/A/B reviewers |
| I6 | Selected final update plus stale expected aggregate, duplicate/repeated action, wrong identity or sibling mutation: only the valid single pending-to-final update commits. No later decision replacement or synthesized history; unrelated Findings remain unchanged. | B tests; B reviewer |
| I7 | Busy/stopping service, active or retained continuation, reentrant input reflection and shutdown boundary: no conflicting operation or provider call, no premature success, and owned reservations released or retained according to the accepted cleanup outcome. A clean durable pending proposal remains reviewable without a live generation owner. | B tests; B reviewer |
| I8 | Controlled write/flush/close/identity/rename failures before commit: last valid run remains readable and no saved-decision success is returned. After the existing commit point, no new fallible filesystem operation reverses reported durable truth. Cleanup uncertainty remains visible and follows existing service/repository recovery. | Existing fresh publication evidence plus B tests; B/C reviewers |
| I9 | Controlled service-to-real-disk approve/edit/reject and blocked acceptance: validated readback proves final decision or unchanged pending state; no generation/retrieval/network/owner-proposal mutation, and exact test leaves/owned services are cleaned or honestly retained. | B integration tests; C reviewer |
| I10 | Actual diff/cohesion, accepted unchanged tests, compliant leases, current full suite, independent strict/build and documentation checks: all pass with complete evidence identity; UI behavior remains outside M4-01 and M4-02's boundary is explicit. | Primary; C reviewer |

Tests can prove a required human-confirmation field and validation gate, not the truthfulness of a human judgment or model claim. Preserve M3-05's limitations and leave actual human review demonstrations to M4-03. No actual provider result is needed for M4-01's controlled service contract, and fixtures are never relabeled real output.

## Idempotence and Recovery

Read-only planning checks are repeatable. Before any future effect, inspect current status, active guard state, expected path identity and remaining allowance. Do not overwrite unrelated changes, delete an unknown scratch leaf, or replay historical commands/grants.

One final review is not an editable record. A repeated or stale submission must follow the G-frozen bounded rejection behavior and preserve the existing decision, not silently replay as a new action. If a caller loses the result around commit, use a validated service/repository read to determine canonical state before considering another request; do not assume a failed response proves no write occurred.

Reuse the current writer's last-valid-file and cleanup contract. A failed review publication leaves the prior pending proposal and completed parent authoritative; it does not manufacture a failed Finding or accepted plan. Uncertain cleanup/retained ownership blocks conflicting work until primary triage establishes the existing recovery route. Preserve failing test evidence before deleting only validated, exact, test-owned paths. No provider restart, model pull, real run deletion, blanket process kill or Git reset is a recovery step.

Any lease stop returns control to the primary. Close/inspect the terminal lease before edits or another writer. Correct in the existing role/phase budget, invalidate changed test/evidence identities and reaccept before Green/review; otherwise stop dependent work and report the precise missing authority or prerequisite. No new harness or budget reset is implied by persistence toward completion.

## Artifacts and Notes

M401-ENTRY-01 is the planning baseline, not implementation proof. Future stable records are M401-G-ACCEPT-01, M401-A-ACCEPT-01, M401-B-ACCEPT-01 and M401-FINAL-01, created only when the corresponding evidence exists. Each records commands, environment, relevant-tree identity, frozen/protected input checks, accepted tests, lease terminal result where applicable, review verdict and limitations. Ignore/private runtime records remain local; tracked notes contain no credentials, actual owner proposal contents, raw reviewer transcripts or generated telemetry.

Planning documentation impact: this plan, the M4-01 roadmap activation, plan index, progress index and one concise M4-01 progress record. No product authority, dependency, implementation, model configuration or release scope changes. Execution documentation impact is determined from the actual accepted diff at C.

### M401-PLAN-01 — Accepted planning readiness

On 2026-09-14 01:04 UTC, the primary accepted the fresh read-only `critical_reviewer` planning verdict **PASS**, with no Blocker, Major or Minor findings. The review covered the complete selected authority and five-path planning activation, future R3/S3 boundaries, I1–I10, action semantics, ownership/cohesion, command gating, stale/reentrant admission, publication/recovery, evidence honesty and downstream UI/capacity boundaries. The reviewer independently reproduced strict TypeScript, the 106-test planning command, current HEAD/dirty paths, absent active lease and `git diff --check`.

The reviewed plan's SHA-256 before this living-record reconciliation was `803b1cc7e90b3358d5f6a9c2e612df430cf9a4acfd59b0bbf1571990fae69b2e`; the primary verified that identity. Subsequent changes only record this verdict, reconcile pending planning statements and update the progress summary; no binding contract or command changed. Primary documentation validation covers all five changed documents, their local links/anchors, the single PowerShell block, sixteen mandatory sections, strict UTF-8/no BOM, final newline/trailing whitespace and `git diff --check`. All thirteen frozen generation references pass exact-byte hash checks. Current HEAD remains the entry HEAD and there is no active lease or application-source change.

This accepts readiness to enter G after an execution request, not G literals, a worker packet or runtime behavior. Persistence failures, final decisions and integration remain unexecuted. No planning correction loop was consumed; future research/implementation allowances have not begun. M4-01 remains In progress, M3-03 Blocked and M4-02/M4-03 Not started.

## Interfaces and Dependencies

Existing dependencies are sufficient. Reuse the closed Proposal validator, existing run/Finding identities, format-version-1 aggregate validation, selected-Finding transition and safe writer, and service admission/stop handling. Future minimal additions are review input/decision/outcome types, a pure validator, a durable reviewed-Finding branch, one repository review transition/update and one internal service operation. Exact names and shapes remain G-owned unresolved literals, not an invitation for workers to select them after review.

No outward HTTP/client review interface is delivered here. M4-02 consumes the accepted service contract and supplies accessible controls, transport and final-state presentation. M4-03 proves real-proposal human review. M3-03 capacity and M6 evaluation retain their separate gates and finite authorizations.

## Revision Note

2026-09-14 UTC: created for the owner's 2026-09-13 local-date M4-01 planning request after fresh current-state review. Recorded M3-05 completion, current retrieval/runtime amendments, independent capacity limitation, two delegated TDD slices, future R3 literal/command barrier and bounded nonvisual verification. No implementation or review action was executed.

2026-09-14 01:04 UTC: recorded independent planning readiness PASS, fresh frozen-reference checks and documentation closure; reconciled current state and progress only. No executable contract, product authority or future execution grant changed.
