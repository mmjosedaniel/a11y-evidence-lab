# Implement proposal-only review behavior and persistence

> Privacy note: Personal directory prefixes in this archived plan have been replaced with `C:/projects/a11y-evidence-lab` and `C:/Users/developer` (or their backslash equivalents). These are illustrative aliases, including in recorded commands and errors. Artifact names, hashes and outcomes are unchanged; the aliases must not be used to authenticate original path-bound evidence or replay historical operations. For current setup, use the [local startup guide](../../DEVELOPMENT.md).

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M4-01](../../DEVELOPMENT_ROADMAP.md#m4-01--implement-proposal-only-review-behavior-and-persistence), Complete. The owner explicitly authorized G, A, B and C execution, verification, bounded corrections and documentation closure on 2026-09-14 UTC (2026-09-13 local), superseding planning-only authorization without bypassing gates.
- **Latest barrier:** [M401-FINAL-01](#m401-final-01--integrated-review-and-task-closure): renewed strict/build and all 671 tests pass; integrated re-review accepts the cleanup correction with no open findings, and documentation closure is accepted.
- **Pending:** None for M4-01. No retained owner proposal has been reviewed.
- **Allowance:** Task execution is closed. Recorded budgets and consumed grants are historical and cannot authorize further work. No commit, publish, push or other task is selected.
- **Active lease:** None. All worker leases are terminally closed; the separately authorized bounded primary test correction and its renewed verification are accepted.
- **Next:** None within this task. M4-02 and M4-03 remain Not started until separately selected; M3-03 remains independently Blocked on capacity.

## Progress

- [x] (2026-09-14 00:52Z) Review current authority, M3-05 completion, task dependencies, relevant source seams and existing verification; record M401-ENTRY-01. This is 2026-09-13 in the owner's local timezone.
- [x] (2026-09-14 01:00Z) Task-scoped planning draft exists with narrow contract, ownership, risk, command and recovery gates; no implementation literals are accepted by this draft.
- [x] (2026-09-14 01:04Z) Accept independent planning readiness PASS with no findings and proportional documentation checks; record M401-PLAN-01. This does not accept G or implement M4-01.
- [x] (2026-09-14 UTC) Record owner execution authorization and reconcile current identity in M401-EXEC-01.
- [x] (2026-09-14 UTC) Accept M401-G and exact A/B command packets after final R3 PASS; M401-G-ACCEPT-01.
- [x] (2026-09-14 UTC) Accept A: pure review contract and durable-reader extension through separate-owner TDD and fresh S3 PASS; M401-A-ACCEPT-01.
- [x] (2026-09-14 UTC) Accept B: selected-Finding persistence and internal service through separate-owner TDD and fresh S3 PASS; M401-B-ACCEPT-01.
- [x] (2026-09-14 UTC) Accept renewed integrated verification, different fresh critical re-review and documentation closure; mark M4-01 Complete and archive this plan under M401-FINAL-01.

## Surprises & Discoveries

- M3-05 is fully closed, not merely at its earlier implementation checkpoint. Its [final acceptance](m3-05-generation-checkpoint.md#m305-final-06--integrated-review-and-task-closure) records one actual mechanically valid proposal per provider, both pending human review. Earlier invalid responses and semantic limitations remain evidence, not automatic acceptance or quality qualification.
- M3-05 also accepted forward-only role-aware passage selection and runtime generation-instruction corrections. Current code preserves historical retrieval/invocation interpretation. M4-01 must preserve these current contracts, not restore historical global-three selection or rewrite the frozen generation package.
- Successful generation releases its live continuation owner in `src/server/local-service/generation-operation.ts`; durable proposal review cannot depend on retaining that owner. Conversely, an uncertain cleanup can retain ownership and must continue to prevent conflicting operations.
- The existing repository already supplies expected-current comparison, selected-Finding isolation and pre-commit safe publication. Review needs a new transition policy, not another writer or transaction framework.

## Decision Log

- Decision: activate only M4-01 planning. Rationale: the explicit owner request and completed M3-05 satisfy task selection and dependency readiness; there is no authorization to implement in this turn. Date/author: 2026-09-14 UTC / primary.
- Decision: plan two behavior-bearing slices and one closure boundary, reusing the current single-file writer. Rationale: validation and storage/service responsibilities are distinct; the existing publication mechanism already owns filesystem safety. Date/author: 2026-09-14 UTC / primary.
- Decision: route future unresolved review identity, transitions and recovery literals through R3 G, and A/B through S3. Rationale: final-decision integrity, stale writes, reentrancy and last-valid-file recovery are named triggers; ordinary local discovery is R0 and does not need a research team. These classifications do not accept a particular literal design. Date/author: 2026-09-14 UTC / primary.
- Decision: keep browser transport and rendered controls with M4-02. Rationale: M4-01 can prove its service and persistence contract directly; no UI is needed to manufacture a service checkpoint. Nonvisual domain/service work does not invoke the frontend-quality overlay. Date/author: 2026-09-14 UTC / primary.

## Outcomes & Retrospective

G, A and B are accepted. The internal service records one final review decision through the existing aggregate writer; controlled cases cover all three actions and profiles, invalid acceptance, preserved originals and recovery. Fresh B review independently reproduces 191 tests and strict TypeScript, plus 43 memory-only adversarial scenarios. C strict/build and all 671 tests pass; different integrated review accepted the authorized test-cleanup correction, and documentation closure passes. M4-01 is Complete. No retained proposal has been reviewed, and these mechanical checks establish no semantic truth, provider capacity or quality claim. Browser review remains M4-02 work.

## Purpose / Big Picture

Give the existing application-owned service one operation that records a person's final decision for one valid pending proposal. Approval accepts the original; edit-and-accept stores a complete validated edited proposal beside the unchanged original; rejection accepts no remediation plan. Invalid acceptance leaves the last valid aggregate unchanged. A reviewer will observe the result through controlled service calls and validated disk readback in M4-01, then through the accessible interaction in M4-02 and the real-proposal demonstrations in M4-03.

## Context and Orientation

The [authority map](../../README.md#authority-and-status-map) and [task router](../../README.md#read-by-task) lead to [global requirement semantics](../../PROJECT_REQUIREMENTS.md), the [roadmap](../../DEVELOPMENT_ROADMAP.md), and these selected authorities:

| Authority | Binding M4-01 obligation |
| --- | --- |
| [REQ-REV-001, 008, 009](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#human-review-and-manual-checks) | Proposal-only human review; one final decision; support and judgment gates; original and sibling preservation; bounded optional note; edited proposal only for edit-and-accept. |
| [REQ-UX-011](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export) | Only a valid generated proposal is review-eligible; no abstention or bulk review. M4-01 supplies service enforcement; M4-02 owns controls and presentation. |
| [ADR-0021](../../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | One application-owned `run.json`, existing identities, one nested current decision and safe last-valid publication; no database or audit graph. |
| [SPEC-005](../../specs/SPEC.feature), [HS-010](../../specs/HARD_SPEC.feature) | All three actions, support/judgment rejection cases, unchanged original, timestamp, no sibling mutation, non-blocking post-change reminder. |
| [Information and workflow lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) | Pending versus terminal review state; nested failure cannot retrospectively fail a completed scan/run; no retry/resume/history workflow. |

All selected Must requirements are Accepted. OD-026's user-facing retained-run reopening remains Deferred; validated service reads remain required. No unresolved significant architecture decision is assumed resolved here. G resolved the task-owned literals inside the Accepted contract; its accepted record below preserves the decisions and command boundaries.

Entry has sixteen Complete tasks, M3-03 Blocked, and ten tasks still Not started after this M4-01 planning activation. M3-03's separate Qwen capacity gate still controls M6-02; a saved Local proposal is not its substitute. The frozen M3-01 evaluation package and its thirteen references remain protected; M4-01 runs none of the six generation evaluations and does not alter gold, prompts, retrieval policy, model configuration or quality claims.

Current seams, inspected at entry:

- `src/server/domain/run-contract/run-types.ts` represents native, retrieved, assessed and generation Findings, but no reviewed branch. `retrieval-validation.ts` dispatches stored generation to `generation-validation.ts`, which currently permits a completed generation only in `proposal-pending-review` with a validated original `result`.
- `src/server/generation/proposal-contract.ts` already owns the closed structured proposal, source-reference and selected-Finding validation. Reuse this validator for an edited proposal; do not invent a second proposal schema or change provider instructions.
- `src/server/persistence/run-repository.ts` validates candidate and readback representation, compares the expected aggregate, writes an exclusive temporary file, flushes and renames before reporting success. `run-repository/selected-finding-transition.ts` compares one changed Finding and unchanged run, scan and native evidence. `generation-transition.ts` deliberately does not permit review.
- `src/server/service.ts` owns busy/stopping/read reservation and continuation coordination. `local-service/contracts.ts` has no review operation. Generation and retrieval each retain ownership when their cleanup is uncertain. Review must respect these states without invoking either provider or the retrieval engine.
- `tests/helpers/m302-generation-fixture.ts` and existing generation/service/repository tests supply controlled validated proposal inputs and real test-only aggregate patterns. There are twenty-five authoritative test files in the current [verification command](../../../README.md#development-toolchain).
- Existing client result presentation knows pending proposals, not final review states. Do not expose browser review in M4-01; M4-02 must add its final-state rendering together with the review interaction. Independent strict checking and the existing client build still have to pass after the type extension.

## Scope and Non-Goals

Implement only pending-proposal admission; exactly one immutable final action and timestamp; reviewer support confirmation; concise blocking-judgment disposition; optional bounded note; complete validated edited proposal only for edit-and-accept; selected-only durable transition; bounded errors and truthful failure handling. Preserve the original proposal, its post-change reminder, native evidence, generation provenance, retrieval, analysis, siblings and parent run state.

Do not build HTTP/client review routes, rendered controls, reviewer identity/authentication, teams, history, versions, audit trails, per-claim records, manual-check entities, retries, regeneration, bulk actions, schema migration infrastructure, new dependencies, configuration, database, generic workflow engine or speculative shared abstractions. No actual provider calls, scans, retrieval, downloads, credentials, retained owner-proposal mutations, capacity screen, evaluation runs or semantic ground-truth claim is needed for M4-01. M4-02 and M4-03 remain separately selected tasks.

## Plan of Work

Follow [worker-first execution](../../../.codex/execplan-implementation-workflow.md), [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) and the [write guard](../../../.codex/write-lease-guard.md). The primary owns authoritative decisions/documents, packet acceptance, lease open/terminal close, integration and closure; ordinary test and production edits stay delegated. All research/review roles are read-only. No worker receives documentation, authority, plan, workflow or Git-write ownership.

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

The primary applies the [documentation closure gate](../../README.md#task-closure-documentation-gate): update developer command inventory/API documentation for implemented behavior, plan, roadmap and progress coherently, inspect other affected navigation/current-status statements, and run proportional links, consistency, configuration, formatting and `git diff --check`. Requirements/ADRs need no change unless a genuinely new accepted decision arises. Mark Complete and archive only after task Verification and that gate pass; M4-02 stays Not started until selected.

## Decision Review Contract

**Identity:** M401-G, R3 literal freeze. Research, analysis and pre-draft review are complete; the authored artifact below passed final R3 review and primary acceptance in M401-G-ACCEPT-01. **Artifact:** one accepted contract/command subsection in this living plan; no new ADR, policy document, research report or ledger by default. **Approval boundary:** the primary may accept compatible task-owned literals after mandatory workflow checkpoints; contradictions, significant architecture or expanded authority require the owner.

**Discovery and candidates:** at most one bounded non-ranking pass to close exact current-seam questions. Before comparison, freeze the credible minimal representations for the single decision, human confirmation/judgment and safe operation admission. Include direct reuse of the current transition/writer and a small review-specific validator as the baseline; reject database/history/workflow/second-writer options at the scope gate rather than researching them. Do not rank or silently freeze field spellings during discovery.

**Common criteria and hard gates:** all selected authority semantics; complete closed validation; exactly one final decision; original/context/sibling integrity; old-record readability; last-valid-file recovery; honest operation/cleanup state; no new provider activity; cohesive direct implementation and testability. Minimal size cannot trade away one of these gates. Decide the representation now; prove runtime behavior later through A/B. Neither research nor a passing validator proves a person's semantic judgment.

**Evidence and budget:** one `critical_researcher` report for the cohesive decision-to-commit integrity dimension, explicitly covering shape/identity, stale/reentrant admission, serialization compatibility and failure recovery against current source and authorities; one bounded follow-up if a material gap remains. One mandatory `decision_analyst` synthesis/contract audit plus one bounded correction; a fresh `critical_research_reviewer` pre-draft checkpoint, primary-only authoritative drafting, and a different fresh `critical_research_reviewer` final complete-artifact review. No optional drafter is needed. Allow one pre-draft correction and the workflow's maximum two final-artifact correction cycles, without resetting the research or repeated-gap budget. If the single cohesive report cannot cover the named dimensions, stop and revise the capsule before commissioning more work.

Each assignment receives a Research Assignment Capsule projecting this contract, the exact authorities, current source/evidence identity, required outputs and the remaining budget. Synchronize all research before analysis. The analyst returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`; DRAFT READY does not bypass R3 pre-draft review or authorize a worker. Final research review assesses the exact primary-written artifact and complete I1–I10 packet, with each invariant linked to evidence or explicitly pending runtime proof. The primary reconciles all verdicts before accepting G. Two occurrences of the same decisive gap without material new evidence, exhausted correction/report allowance, changed authority or scope stop dependent work; no additional panel or agent can reset those limits.

## Concrete Steps

Working directory for every command: `C:/projects/a11y-evidence-lab`. Use the maintained [README preparation](../../../README.md#development-command-preparation), not an archived task's runtime or lease baseline. Current pinned Node is 24.20.0. No install/restore is needed for planning; if execution prerequisites are missing, stop and freeze an authorized bounded restoration command before changing them.

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

### M401-G-CONTRACT-01 — Authored review contract and commands

**Status:** Primary-authored candidate after the sole critical integrity report returned RESEARCH COMPLETE, mandatory analyst returned DRAFT READY, and fresh pre-draft R3 review returned PASS with no open findings. Different fresh final R3 review and primary acceptance subsequently passed in M401-G-ACCEPT-01. This section supersedes the earlier unresolved G/interface/path/command slots; planning history is retained. No runtime review proof exists yet.

The comparison and synthesis select input-only support confirmation, a tagged judgment, and the existing finding-operation reservation. Both confirmation alternatives can enforce admission and neither proves truth; the persisted bit would add redundant state. Tagged and flat judgment alternatives can enforce the same constraints; the tagged representation keeps the conditional N/A reason local. The existing finding reservation already handles stop and cleanup retention, whereas the read reservation clears in its `finally`. These are compatible task-owned literals under REQ-REV-009 and ADR-0021, not new architecture. The source evidence is the current value/proposal/generation readers, selected-Finding transition, repository publication and service reservation named in Context and Orientation. [ECMAScript String semantics](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type) corroborates UTF-16 counting; [Node synchronous filesystem semantics](https://nodejs.org/docs/latest-v24.x/api/fs.html#synchronous-api) corroborates synchronous publication. The latter rendered as 24.21.0 during research and does not qualify another installed version.

#### Closed decision and validation contract

The service receives exactly `{runId, findingId, review}`, with existing strict `readId` identities. It owns root/ID validation. The pure `validateReviewInput` receives **only the review member**, against the selected pending proposal's validated native Finding and retained retrieval context. Pure body validation does not independently decide run eligibility.

| Input action | Resulting Finding state | Additional required input | Additional durable content |
| --- | --- | --- | --- |
| `approve` | `accepted` | `supportConfirmed: true` | None |
| `edit-and-accept` | `edited-and-accepted` | `supportConfirmed: true`, complete `editedProposal` | Complete validated `editedProposal` |
| `reject` | `rejected` | None; `supportConfirmed` and `editedProposal` are forbidden | None |

Every input body requires `action` and `blockingJudgment`, and may contain `note`. No other keys are accepted. `blockingJudgment` is exactly one of `{status: 'supports-proposal'}`, `{status: 'not-applicable', reason: string}`, `{status: 'unresolved'}`, or `{status: 'contradicts-proposal'}`. Approve/edit accept only the first two; reject permits all four. A reason is required only for N/A and forbidden on the other variants. Note has a maximum of 1000 raw UTF-16 code units; reason has a maximum of 500. Supplied text must be a string with nonempty `trim()`, but its original text is preserved exactly. No trimming, Unicode normalization, truncation, coercion or defaulting occurs. Supplied undefined, null, blank or oversized text fails; omission is the unused-note representation.

The only durable decision is `finding.review`, containing exactly `action`, `decidedAt`, `blockingJudgment`, optional `note`, and `editedProposal` only for edit. Input confirmation is checked and removed, not persisted. There is no decision while pending. The original `result`, its reminder, generation invocation, retrieval, analysis and native evidence remain unchanged. Edited content passes the complete existing Proposal validator with the selected native Finding and retained retrieval; partial objects, foreign Finding/references and prohibited proposal content fail. Both confirmation and disposition concern the resulting proposal. An unsupported or contradictory original requires a complete resolving edit and fresh supporting/N/A disposition plus confirmation, or rejection. No intermediate edits or per-claim records are stored. The generated `blockingManualJudgment` string, including `false`, never supplies a human disposition. The post-change reminder is neither a completed action nor an acceptance gate.

Exact types and callable boundaries:

```typescript
type ReviewContext = { finding: NativeFinding; retrieval: RetrievalResult };
// ReviewBody is the closed, action-discriminated durable body above without decidedAt.
// ReviewDecision adds readonly decidedAt: string to every ReviewBody variant.
validateReviewInput(input: unknown, context: ReviewContext):
  { readonly ok: true; readonly value: ReviewBody } |
  { readonly ok: false; readonly error: 'review-validation' };
readReviewDecision(input: unknown, context: ReviewContext,
  generationFinishedAt: string): ReviewDecision;
readReviewedFinding(record: Record<string, unknown>, native: NativeFinding,
  parentFinishedAt: string): ReviewedFinding;
checkReviewTransition(expected: CompletedRun, current: CompletedRun,
  next: CompletedRun): void;
RunRepository.updateReview(expected: CompletedRun, input: unknown): StoreResult<CompletedRun>;
LocalService.reviewFinding(input: unknown): Promise<ReviewOutcome>;
```

The first validator returns detached deeply frozen bodies and catches invalid input; the two `read*` functions are internal throwing readers bounded by aggregate validation. `readReviewDecision` consumes stored `finding.review`, rejects confirmation and unknown keys, and validates canonical `decidedAt >= generation.finishedAt` with the existing time reader. Equality is legal. The service samples `Date.now()` after valid body admission, requires a finite number **before** `Math.max`, then uses `new Date(Math.max(now, Date.parse(generation.finishedAt))).toISOString()` and canonical time validation. Invalid clock output is `review-validation`; this clamped service-owned chronology does not attest wall-clock accuracy.

`ReviewOutcome` success is `{ok: true, run: CompletedRun}`. Failure is `{ok: false, error, run: CompletedRun | null, persisted: false, cleanupFailed: boolean}`. The complete error union is `invalid-request | busy | stopping | workflow-active | not-found | invalid-run | stored-run-unavailable | read-failed | not-eligible | review-validation | review-persistence | shutdown`. Root/ID errors map to invalid-request, body/clock errors to review-validation. Repository reads map not-found and invalid-run directly, unsafe-path/identity-mismatch to stored-run-unavailable, and other failures to read-failed. A missing selected ID is not-found; a noncompleted parent or nonpending selected Finding is not-eligible. An active sibling is workflow-active. Every update failure maps to review-persistence; stale/invalid-transition returns run:null. Other failures may return only the last validated read, never the attempted final candidate, with persisted:false. Admission failures have run:null and cleanupFailed:false.

#### Durable reader, transition and operation

The reviewed reader checks a terminal state, removes **only** `review`, projects state to `proposal-pending-review`, and calls unchanged `readGenerationFinding`. Every other key remains in the projection so historical strictness is preserved. Require a completed pending result, read the decision and require exact action/state correspondence. Dispatch review before generation. Final states without review, pending states with review, and unknown keys fail. Format version 1 and every previously valid generation tuple remain readable. Native scan admission is unchanged.

The repository's new review transition reuses `selectedFindingTransition`, requires pending-to-final only, and additionally deep-compares unchanged result, generation, analysis and retrieval. It adds no serializer or writer. `updateReview` uses the existing expected/current/candidate validation, serialized validated return representation, exclusive staging, flush/close/identity checks and rename commit. No fallible filesystem operation is added after rename.

Service admission order is closed admission → busy → either retained generation/retrieval owner, all before any caller reflection. It then reserves through existing `reserveFinding`, whose outcome union alone expands. The purpose-named review operation reads the durable aggregate, enforces eligibility, validates/detaches input and constructs exactly one update. Recheck stopping after both successful **and caught failing** caller reflection/body validation and after clock evaluation: a direct stop before publication returns shutdown even if a trap also throws. No await occurs through publication. A microtask queued during reflection runs only after that synchronous operation. Once trusted publication begins, the existing commit point governs; successful rename remains success even if shutdown is requested during the trusted writer call.

Settle once. Clean outcomes release reservation. Failed cleanup closes admission and retains the existing operation/cleanup-uncertain state; stop then fails truthfully. No failed Finding or failed parent is synthesized. Clean durable pending proposals remain reviewable after restart without a live generation owner. A lost response requires a validated canonical read before another action; repeated/final review remains rejected, not replayed. No provider, retrieval executor, transport or new resource owner belongs to review.

#### Exact A/B ownership and binding envelope

Workflow is `M401-20260914`; cycles are `M401-A` and `M401-B`. A/B use S3, Applicable TDD, separate persistent test/code owners, sequential preflight/Red/Green, unchanged accepted tests during Green, fresh critical slice review and different integrated critical review. Existing correction ceilings and repeated-gap stops are unchanged.

| Slice and owner | Exact allowed files, relative to repository root |
| --- | --- |
| A test | `tests/review-contract.test.ts`; `tests/helpers/m401-review-fixture.ts`; `tests/run-contract.test.ts` |
| A code | `src/server/domain/review-contract.ts`; `src/server/domain/run-contract/review-validation.ts`; `src/server/domain/run-contract/run-types.ts`; `src/server/domain/run-contract.ts`; `src/server/domain/run-contract/retrieval-validation.ts` |
| B test | `tests/review-repository.test.ts`; `tests/review-service.test.ts`; `tests/helpers/m401-review-sandbox.ts` |
| B code | `src/server/persistence/run-repository/review-transition.ts`; `src/server/persistence/run-repository/contracts.ts`; `src/server/persistence/run-repository.ts`; `src/server/local-service/review-operation.ts`; `src/server/local-service/contracts.ts`; `src/server/service.ts` |

Allowed directory roots: None. All paths outside the exact list are protected, including configuration, existing helpers, runtime/provider source, frozen inputs and owner data. Explicit forbidden roots for every writer are `docs`, `.codex`, `.agents`, `corpus`, `evaluation`, `fixtures`; Red also forbids `src`, Green also forbids `tests`. Explicit forbidden files: `AGENTS.md`, `PLANS.md`, `README.md`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `.gitattributes`. B reuses A's accepted pure fixture without edits; any necessary test-boundary change returns to primary reconciliation and evidence invalidation before another lease.

A responsibility placement is pure review types/body readers → existing value/Proposal readers; reviewed aggregate reader → generation reader and pure review reader; dispatcher → reviewed reader; run type/barrel exports only. The generation reader stays unchanged. B placement is service entry admission/reservation → purpose-named review operation → pure contract/repository → review transition/aggregate validator and existing writer. Domain/persistence never import service/UI. Permit only the named additive types/exports, dispatch, outcome union, method and transition; no generic extraction or unrelated refactor. Pure fixture composition remains separate from B's shared test-owned filesystem/listener lifecycle. Exact helper-private names are implementation details within these responsibilities, not new public contracts.

#### M401-CMD-PREFLIGHT / RED-A / GREEN-A / RED-B / GREEN-B

Every caller runs from `C:/projects/a11y-evidence-lab` in PowerShell 7.6.5 with Node24.20.0 and Python3.12.10. Load the exact maintained preparation, without running README installation/setup commands:

```powershell
$ErrorActionPreference = 'Stop'
$m401Readme = Get-Content -LiteralPath README.md -Raw
$m401Section = $m401Readme.Substring($m401Readme.IndexOf('### Development command preparation'))
$m401Prep = [regex]::Match($m401Section, '(?s)```powershell\r?\n(.*?)```').Groups[1].Value
if (-not $m401Prep) { throw 'Maintained preparation missing' }
. ([scriptblock]::Create($m401Prep))
```

Preflight is read-only Git/source/test/absence inspection. Optional runner reproduction is exactly the M401-ENTRY-01 106-test command, under this preparation; fresh entry results already exist. Do not run B effects in read-only preflight. The first-module exception is available only for the agreed review callable absence with complete behavior tests and verified environment; mark unexecuted assertions honestly. No stub or existence-only substitute is allowed.

A Red calls the new contract plus existing pure regressions and captures the native failure before any dependent command:

```powershell
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/review-contract.test.ts tests/run-contract.test.ts tests/generation-contract.test.ts
  $m401Exit = $LASTEXITCODE
  if ($m401Exit -eq 0) { throw 'Expected Red did not occur; return classification to primary' }
  Write-Output ('M401 A Red native exit: ' + $m401Exit)
}
```

Green uses that same Node command, requires exit 0, and then runs the independent strict checker below. B Red runs the following two new suites individually so each decisive failure is visible; B Green runs the full named B list sequentially:

```powershell
# RED-B: both exact new suites must report their actual expected failure.
foreach ($m401Test in @('review-repository','review-service')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m401Test + ".test.ts")
    $m401Exit = $LASTEXITCODE
    if ($m401Exit -eq 0) { throw 'Expected B Red did not occur; return classification to primary' }
    Write-Output ($m401Test + ' Red native exit: ' + $m401Exit)
  }
}
# GREEN-B: execute only after accepted Red and a fresh production lease.
foreach ($m401Test in @('review-repository','review-service','review-contract','run-repository','local-service','generation-service')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m401Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw ('M401 B check failed: ' + $m401Test) }
  }
}
```

The RED-B and GREEN-B regions above are separate phase callers, never executed together by a Red worker. Green-A is exactly:

```powershell
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/review-contract.test.ts tests/run-contract.test.ts tests/generation-contract.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M401 A contract checks failed' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
}
```

Green-B and closure independently call:

```powershell
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
}
```

The 120000ms flag is a **per-test** bound. Primary monitors caller budgets: pure A/strict 3 minutes, each B/reproduction file 5 minutes, complete C 30 minutes. On an overrun, stop only the owned tool session, preserve artifacts and triage; these are cooperative workflow ceilings, not OS kill guarantees. Tool sessions may yield/poll within 60 seconds for communication. One successful boundary execution is enough; repeat only for changed/stale evidence, a failure or mandatory independent risk reproduction. Expected Red is not a failed implementation attempt.

#### M401-CMD-PREPARE / CLEANUP / REGRESSION

Before B effects or C, verify ordinary absolute repository/temp/browser/build paths and all ancestors, including repository ancestors up to the drive, against reparse points/aliases. Use the maintained path checker for descendants plus this read-only ancestor check:

```powershell
$m401Cursor = Get-Item -LiteralPath $m105Repo -Force
while ($null -ne $m401Cursor) {
  if (-not ($m401Cursor.Attributes -band [IO.FileAttributes]::Directory) -or ($m401Cursor.Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Nonordinary repository ancestor' }
  if ([IO.Path]::GetFullPath((Resolve-Path -LiteralPath $m401Cursor.FullName).Path) -ine [IO.Path]::GetFullPath($m401Cursor.FullName)) { throw 'Aliased repository ancestor' }
  $m401Cursor = $m401Cursor.Parent
}
$null = Assert-M105OrdinaryPath (Join-Path $m105Repo 'temp')
foreach ($m401Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $m401Scratch
}
$null = Assert-M105OrdinaryPath $m105Browsers
$null = Assert-M105OrdinaryPath $m105Build
if (@(Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object Path -eq 'C:\nvm4w\nodejs\node.exe').Count) {
  throw 'Resolve running pinned Node process before verification'
}
if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')) { throw 'Synthetic capture flag must be absent' }
```

Existing scratch leaves are present and empty, browser revision1234 is retained and ordinary dist/client has only index.html and enumerated assets. No creation/restore/acquisition is currently needed. Before rebuilding, inspect the complete dist/client inventory and reject unexpected or linked files; Vite may replace only this verified generated output. Retain the accepted build afterward. Do not remove developer runtime/browser prerequisites or existing empty scratch parents.

B's shared sandbox uses exclusive `fs.mkdtempSync` prefixes `<repo>/temp/m401-review-repository-` and `<repo>/temp/m401-review-service-`. The returned absolute direct-child leaf is the exact owned target, captured before creating only its own runs/fixture files. Validate ordinary ancestors all the way to the drive, empty new leaf, no links, and ordinary single-link files before recursive removal. Seed only explicitly synthetic validated aggregates derived from existing helpers, never retained proposals. Listeners bind only 127.0.0.1 with port0; capture each returned URL and service. Release test-owned deferred collaborators, await owned stop within6500ms and verify that exact port refuses connections within3000ms. Restore injected failures/mocks before cleanup. On any ownership/topology/close uncertainty preserve that exact leaf, report the failing evidence and do not remove it. Otherwise remove only the verified captured leaf with force:false, then prove absence. Repeated commands create fresh leaves; a prefix is never deletion authority over other leaves. Preserve failure evidence in the handoff before cleanup; no primary blanket cleanup or global process kill is authorized.

Existing full-suite effects remain their current test-owned contracts: exclusive temp prefixes m102-store-, m102-service-, m202-retrieval-, m203-guidance-api-, m302-generation-, m303-generation-, m304-groq-, m305-generation-; scanner/UI/integration leaves above; and existing local-service demonstration's exact exclusive `data/runs/m102-demo-<UUID>` leaves and its temporary synthetic corpus marker. Capture preexisting names and preserve them. The existing entry/walking-skeleton/UI tests own their controlled children/listeners and cleanup. No actual target scan, provider, embedding runtime, credential inspection or model evaluation is part of ordinary regression.

After accepted A/B, closure runs strict then build, then the complete current 28-file suite in this exact order:

```powershell
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node node_modules/vite/bin/vite.js build --configLoader native
  if ($LASTEXITCODE -ne 0) { throw 'Client build failed' }
}
foreach ($m401Test in @('run-contract','run-repository','local-service','scan-normalization','retrieval-contract','embedding-retrieval','retrieval-service','finding-sufficiency','finding-guidance-api','generation-contract','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service','groq-generation-contract','groq-generation','groq-generation-service','finding-generation-admission','review-contract','review-repository','review-service')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m401Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw ('Browser-free suite failed: ' + $m401Test) }
  }
}
Invoke-M105Command {
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/finding-generation-api.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Generation API suite failed' }
}
foreach ($m401Test in @('scan-page','walking-skeleton')) {
  Assert-M105EmptyDirectory $m105ScanTemp
  Assert-M105EmptyDirectory $m105IntegrationTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m401Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'Scanner/integration suite failed' }
  } $m105ScanTemp
}
foreach ($m401Test in @('target-results-ui','finding-guidance-ui','finding-generation-ui')) {
  Assert-M105EmptyDirectory $m105UiTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m401Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'UI suite failed' }
  } $m105UiTemp
}
foreach ($m401Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $m401Scratch
}
```

No concurrent app/browser test is allowed. A command may be split at the exact sequential file boundary into tool sessions loading the same preparation; the file order, arguments, environment and native failure gate cannot change. Partial execution never counts as the complete suite. No new npm scripts or runners are created.

#### M401-CMD-GUARD / CLOSE

Primary projects every complete v2 packet into this exact caller. Bind `m401Cycle` to M401-A or M401-B; `m401Phase` to red or green; `m401Attempt` to the authorized 1,2,3; `m401Role` to test_worker for red or code_worker for green; `m401Owner` to the assigned persistent role instance; `m401Files` to the exact corresponding table above. The unique lease/assignment ID is `<cycle>-<phase>-<two-digit-attempt>`; there are no reused IDs. `m401Parent` is absent for attempt1 and the immediately previous terminal lease for corrections. These are primary-controlled packet bindings, never worker choices.

```powershell
$m401Args = @('-B','.codex/leases/lease_guard.py','start','--workflow-id','M401-20260914',
  '--task-id','M4-01','--cycle-id',$m401Cycle,'--lease-id',$m401Lease,
  '--phase',$m401Phase,'--attempt',"$m401Attempt",'--owner',$m401Owner,'--agent-type',$m401Role)
foreach ($m401File in $m401Files) { $m401Args += @('--allow-file',$m401File) }
foreach ($m401Root in @('docs','.codex','.agents','corpus','evaluation','fixtures')) { $m401Args += @('--forbid-dir-root',$m401Root) }
$m401Args += @('--forbid-dir-root',$(if ($m401Phase -eq 'green') { 'tests' } else { 'src' }))
foreach ($m401File in @('AGENTS.md','PLANS.md','README.md','package.json','package-lock.json','tsconfig.json','vite.config.ts','.gitignore','.gitattributes')) { $m401Args += @('--forbid-file',$m401File) }
if ($m401Attempt -gt 1) { $m401Args += @('--correction-parent-lease-id',$m401Parent) }
$m401Raw = & python @m401Args
$m401Exit = $LASTEXITCODE
if ($m401Exit -ne 0) { Write-Output $m401Raw; throw 'Guard start failed; reconcile before dispatch' }
$m401Started = $m401Raw | ConvertFrom-Json
if ($m401Started.status -ne 'started' -or -not $m401Started.contract_digest) { throw 'Ambiguous guard start; do not dispatch' }
$m401Digest = $m401Started.contract_digest
$m401Started | ConvertTo-Json -Depth 10
```

Bind the guard owner to the persistent instance's identifier without its slash-form task path: `m401_a_test`, `m401_a_code`, `m401_b_test`, or `m401_b_code`, with the packet explicitly mapping it to `/root/<identifier>`. The guard accepts only its documented identifier character set. A rejected pre-start argument is not a worker attempt; establish absent contract/directory/active pointer and inspect validation order before preparing a new ID. The reconciled initial A Red ID is `M401-A-red-01-prepared`; it remains attempt1 with no parent, mapped to the same M401-A slice and budget. Never reuse the rejected `M401-A-red-01` ID.

Insert the returned digest unchanged in the packet, verify scope/identity projection and only then authorize the worker. No primary document maintenance occurs during the lease. After the worker stops, consume the exact captured digest:

```powershell
$m401Raw = python -B .codex/leases/lease_guard.py close --lease-id $m401Lease --contract-digest $m401Digest
$m401Exit = $LASTEXITCODE
$m401Closed = $m401Raw | ConvertFrom-Json
if ($m401Exit -ne 0 -or $m401Closed.status -ne 'closed-compliant' -or $m401Closed.already_closed) {
  throw 'Lease did not freshly close compliantly; reconcile before continuation'
}
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') { throw 'Active lease remains' }
$m401Closed | ConvertTo-Json -Depth 10
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
```

The unchanged guard procedure owns replay/ambiguous-state handling. Never delete live metadata, reuse a returned ID, reset correction lineage or infer semantic acceptance from the receipt. Primary inspects actual diffs, accepted-test hashes, commands and cohesion before accepting a handoff. Every phase's new endpoint identity is recorded with case-sensitive POSIX-string tree ordering, exact test/configuration hashes and current HEAD.

#### M401-CMD-DOCS and complete invariant packet

Primary documentation checks run between leases: inspect `git diff --name-status`, `git ls-files --others --exclude-standard`, `git diff --check` and `git diff 24d4565b2e3a04d5cca41a23bea2bd7487c47410 --check`, each with native exit checks. Expected current documentation writes are this plan, roadmap and plans index; closure may additionally update root README, docs/README, progress index/record and the plan archive with repaired inbound links. Read each target completely before non-routine edits. No requirement/ADR change is planned.

For each changed Markdown file, decode strict UTF-8/no BOM, require final newline and no trailing whitespace, resolve every local Markdown target relative to the file and every nonempty anchor against heading slugs (including duplicate heading suffixes), excluding external schemes and illustrative template placeholders. Parse each actual PowerShell fence with `[System.Management.Automation.Language.Parser]::ParseInput`; require no errors. Inspect exact executable block callers for binding, native failure propagation and cleanup; TypeScript interface pseudocode above is documentation, not a compilable module. Compare the root README suite inventory against all `tests/*.test.ts` files; require exactly28 at C and each in the explicit command list, preserving the mock flag and browser scratch routing. Check all four unchanged configuration hashes and frozen manifest plus thirteen references against M401-EXEC-01; compute fresh source/test identities instead of comparing intentional code changes to entry hashes. Inspect final-state/API language, M4-02/M4-03 boundaries, roadmap status and all archive links. No custom validation tool is added; bounded inline PowerShell/Python inspection is sufficient.

The exact read-only caller below runs at G and closure. At G the suite inventory remains25; closure requires28 after the accepted three new files. Source/test fingerprints report intentional current content; protected inputs must match. Manual inspection still owns command/API/status/cohesion meaning.

```powershell
$ErrorActionPreference = 'Stop'
git diff --name-status
if ($LASTEXITCODE -ne 0) { throw 'Diff inventory failed' }
git ls-files --others --exclude-standard
if ($LASTEXITCODE -ne 0) { throw 'Untracked inventory failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Diff whitespace failed' }
git diff 24d4565b2e3a04d5cca41a23bea2bd7487c47410 --check
if ($LASTEXITCODE -ne 0) { throw 'Cumulative whitespace failed' }
@'
import hashlib,json,re,subprocess
from pathlib import Path
from urllib.parse import unquote
root=Path.cwd()
def git(*args):
    return subprocess.check_output(['git',*args],text=True).splitlines()
paths=sorted(set(git('diff','--name-only')+git('ls-files','--others','--exclude-standard')))
def slugs(text):
    counts={}; result=set()
    for heading in re.findall(r'^#{1,6}\s+(.+?)\s*#*$',text,re.M):
        heading=re.sub(r'\[([^]]+)\]\([^)]*\)',r'\1',heading)
        slug=re.sub(r'[^\w\- ]','',heading.lower()).replace(' ','-')
        n=counts.get(slug,0);counts[slug]=n+1
        result.add(slug+(('-'+str(n)) if n else ''))
    return result
for name in paths:
    p=root/name
    if not p.is_file() or p.suffix!='.md': continue
    raw=p.read_bytes();text=raw.decode('utf-8')
    assert not raw.startswith(b'\xef\xbb\xbf') and text.endswith('\n'),name
    assert all(line.rstrip()==line for line in text.splitlines()),name
    for target in re.findall(r'(?<!!)\[[^]\n]+\]\(([^)\n]+)\)',text):
        target=target.strip('<>')
        if re.match(r'[a-zA-Z][a-zA-Z0-9+.-]*:',target) or '<' in target: continue
        filename,_,anchor=unquote(target).partition('#')
        dest=(p.parent/filename).resolve() if filename else p
        assert dest.exists(),(name,target)
        if anchor and dest.is_file() and dest.suffix=='.md':
            assert anchor in slugs(dest.read_text(encoding='utf-8')),(name,target,'anchor')
expected={'package.json':'01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c','package-lock.json':'38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d','tsconfig.json':'3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde','vite.config.ts':'8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07','evaluation/m301-generation-v1.json':'63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b'}
for name,digest in expected.items(): assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
manifest=json.loads((root/'evaluation/m301-generation-v1.json').read_text())
refs=[]
def visit(value):
    if isinstance(value,dict):
        if 'path' in value and 'sha256' in value: refs.append(value)
        for child in value.values(): visit(child)
    elif isinstance(value,list):
        for child in value: visit(child)
visit(manifest); assert len(refs)==13,len(refs)
for ref in refs: assert hashlib.sha256((root/ref['path']).read_bytes()).hexdigest()==ref['sha256'].lower(),ref['path']
for directory in ['src','tests']:
    h=hashlib.sha256();files=sorted((p for p in (root/directory).rglob('*') if p.is_file()),key=lambda p:p.relative_to(root).as_posix())
    for p in files: h.update(p.relative_to(root).as_posix().encode()+b'\0'+p.read_bytes()+b'\0')
    print(directory,len(files),h.hexdigest())
print('Documentation format/links/configuration/frozen inputs PASS')

'@ | python -B -
if ($LASTEXITCODE -ne 0) { throw 'Documentation, identity or frozen-input checks failed' }
$m401Changed = @(git diff --name-only)
if ($LASTEXITCODE -ne 0) { throw 'Changed-document inventory failed' }
$m401Added = @(git ls-files --others --exclude-standard)
if ($LASTEXITCODE -ne 0) { throw 'Added-document inventory failed' }
foreach ($m401Doc in @(($m401Changed + $m401Added) | Sort-Object -Unique)) {
  if ($m401Doc -notlike '*.md' -or -not (Test-Path -LiteralPath $m401Doc -PathType Leaf)) { continue }
  $m401Text = Get-Content -LiteralPath $m401Doc -Raw
  foreach ($m401Fence in [regex]::Matches($m401Text, '(?ms)^```powershell\r?\n(.*?)^```\s*$')) {
    $m401Tokens = $null; $m401Errors = $null
    $null = [System.Management.Automation.Language.Parser]::ParseInput($m401Fence.Groups[1].Value,[ref]$m401Tokens,[ref]$m401Errors)
    if ($m401Errors.Count) { throw ($m401Doc + ': ' + ($m401Errors | Out-String)) }
  }
}
```

Closure additionally runs this exact inventory check after updating the maintained README test command:

```powershell
$m401ExpectedTests = @('run-contract','run-repository','local-service','scan-normalization','retrieval-contract','embedding-retrieval','retrieval-service','finding-sufficiency','finding-guidance-api','generation-contract','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service','groq-generation-contract','groq-generation','groq-generation-service','finding-generation-admission','review-contract','review-repository','review-service','finding-generation-api','scan-page','walking-skeleton','target-results-ui','finding-guidance-ui','finding-generation-ui') | ForEach-Object { 'tests/' + $_ + '.test.ts' }
$m401ActualTests = @(Get-ChildItem -LiteralPath tests -File -Filter '*.test.ts' | ForEach-Object { 'tests/' + $_.Name })
if ($m401ActualTests.Count -ne 28 -or @(Compare-Object $m401ExpectedTests $m401ActualTests).Count) { throw 'Authoritative suite inventory mismatch' }
$m401RootReadme = Get-Content -LiteralPath README.md -Raw
foreach ($m401Test in $m401ExpectedTests) {
  if (-not $m401RootReadme.Contains($m401Test)) { throw ('README omits test: ' + $m401Test) }
}
Write-Output 'Current 28-file inventory matches maintained README'
```

I1–I10 in Validation and Acceptance remain the complete cumulative packet and are carried without omission to every required reviewer. This artifact decides all listed semantics; A/B/C must still execute eligibility/human-gate/shape/history/transition/reentry/failure/readback/cleanup/cohesion/lease/full-suite checks. Existing publication tests are reusable source evidence only until their required B/C execution. A tests I2–I5; B supplies I2/I3/I5–I9 using all three profiles and real exclusive disk; C integrates all ten. Confirmation fields, mechanical reference validation and test fixtures establish no semantic truth, real-proposal human review or capacity result.


### Future command freeze

These historical planning slots are superseded by M401-G-CONTRACT-01 above. They preserve the required categories and grant no permission to improvise commands after review. Use the existing packet/guard procedure, not new command tooling:

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

G carries the cumulative invariant packet below into research and runtime packets. A and B acceptance records prove I1–I9 within their stated controlled scope; M401-C-REGRESSION-01 supplies the complete suite and build evidence. M401-FINAL-01 accepts I1–I10 after integrated re-review and documentation closure. Research reviewers assess contract completeness and evidence honesty; A/B fresh critical reviewers own their runtime rows; the different C reviewer verifies the complete set. Record exact trigger, expected result, command/test identity and actual result under stable acceptance IDs rather than duplicating full outputs.

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

Existing dependencies are sufficient. Reuse the closed Proposal validator, existing run/Finding identities, format-version-1 aggregate validation, selected-Finding transition and safe writer, and service admission/stop handling. Future minimal additions are review input/decision/outcome types, a pure validator, a durable reviewed-Finding branch, one repository review transition/update and one internal service operation. Exact names and shapes are now authored in M401-G-CONTRACT-01 and were accepted in M401-G-ACCEPT-01; workers cannot change them after review.

No outward HTTP/client review interface is delivered here. M4-02 consumes the accepted service contract and supplies accessible controls, transport and final-state presentation. M4-03 proves real-proposal human review. M3-03 capacity and M6 evaluation retain their separate gates and finite authorizations.

### M401-G-ACCEPT-01 — Accepted contract and command freeze

The primary accepts M401-G-CONTRACT-01 after the required sole critical integrity research report (RESEARCH COMPLETE), mandatory decision analysis (DRAFT READY), fresh pre-draft review (PASS), primary authoring and different fresh final R3 review (PASS). Final review correction cycle1 resolved the missing executable documentation caller and unqualified historical-slot wording; no findings remain. The reviewed artifact SHA-256 is `f711f88b1d9272b2ca56e101950410a4d47de19fed8fc01872307ed9cf5965d2`. This living acceptance record changes status/evidence only, not the reviewed contract.

Both primary and final reviewer executed the exact DOCS caller successfully: local links/anchors, formatting, all12 PowerShell fences, native failure gates, configuration/frozen manifest and13 references. Canonical source92 and test40 identities still match M401-EXEC-01. There is no active lease, application change, actual provider/retrieval/scan or retained-proposal mutation. The closure28-file inventory is deliberately pending creation of the three authorized suites and README reconciliation. One final artifact correction cycle was consumed; no research follow-up or analyst correction was needed.

This accepts all compatible task-owned literals, exact A/B responsibility/path/command boundaries and complete I1–I10 proof allocation. Runtime assertions remain pending. A may enter read-only test-worker preflight with the complete v2 packet; no owner decision or expanded scope is needed.

### M401-A-PREFLIGHT-01 — Missing pure review behavior

Primary accepts the read-only test-worker classification MISSING. Source/type/dispatcher inspection and exact path absence confirm no review validator or reviewed aggregate branch. Existing pending-with-review rejection remains covered. Source92/test40 canonical identities match entry; four expected primary documentation paths are dirty and no lease exists. No tests or effects were rerun. The first-module exception applies only to the frozen review module/callables, with complete behavior tests and unexecuted assertions reported honestly.

The A Red packet uses the complete frozen G A test scope and command, all actions/profiles, strict body/stored shape, edited validation, chronology, immutable original/context, historical compatibility and detached deep-freeze cases. The pure helper may compose synthetic complete pending aggregates for later B reuse; it owns no filesystem/listener lifecycle. Initial Red lease is M401-A-red-01, owner `/root/m401_a_test`, attempt1 with no correction parent. Primary opens and closes it before accepting evidence. Implementation and runtime proof remain pending.

### M401-G-COMMAND-02 — Pre-start owner binding correction

The first A Red guard caller rejected owner `/root/m401_a_test` before creating any runtime state. Read-only inspection proved absent exact lease directory and active pointer; isolated invocation of the actual `_validate_identifier` reproduced UsageError for the slash-form name and success for `m401_a_test`. Source inspection confirms identity validation precedes state-directory creation. No digest, lease, write dispatch or worker attempt exists. The attempted status diagnostic also rejected a missing digest and changed nothing.

The primary corrects owner binding to the explicit identifier/instance mapping and makes failed guard JSON visible before throwing. All other packet fields, scope, commands, role/phase and budgets remain unchanged. The fresh prepared lease ID above preserves attempt1 and the same slice; no ID or budget is reset. The existing final R3 reviewer returned PASS with no findings for final-artifact correction cycle2, reviewed SHA-256 `d59447c22bd4450e227db54cd25658f5dd74cdfb3a8a674ff18847e3fa2359bb`. Primary accepts the amendment. Both final-artifact correction cycles are consumed; worker write attempts remain unused. Independent read-only checks of actual guard identifier functions, absent runtime state, all12 PowerShell fences and the complete DOCS caller pass. Primary also checked exact A scope topology/observability successfully before the corrected effect.

### M401-A-RED01 — Accepted initial Red

Primary inspected all three actual test files/diff and accepts the complete behavioral test boundary. The exact RED-A Node command returned1:85 reported tests,80 passes,5 expected failures,0 skips/todo/cancellations. Existing run/generation assertions passed. The missing agreed review module blocks nine pure test bodies; four aggregate acceptance cases fail at unsupported final validation. Later assertions in those bodies are unexecuted. This is the explicit initial first-module Red, not evidence of implemented review behavior.

The primary freshly closed `M401-A-red-01-prepared` as `closed-compliant`, receipt `8edc2bdfb6aebdf9177ef099d65db426b8393899157b20b1b2610aca969e186b`, with exactly three allowed test changes, no forbidden/unleased/Git drift and no active pointer. Verified SHA-256: review-contract test `9fe387efce40f888bd1bd965ea131e3b6050f2e4fd281aa7ce63519eaa18c9e0`; pure fixture `4d24bf5e1abc53b765a409460a257681f98ac262438ea875517006077732d604`; run-contract test `0c873185e2eea396f7115d87dbfe124cb599399549d446eacb34c42623c9b66c`. Canonical tests42 digest `b69a76fdd4fcfee4f6262d8e1cd17fca540e752493e7840696f6d07f2792189d`; source92 unchanged. Same HEAD/configuration/runtime and maintained preparation apply. `git diff --check` passes. No Red correction consumed.

Green attempt1 belongs to `m401_a_code` (`/root/m401_a_code`), exact five G production files only, all tests protected. It must execute every unchanged assertion and pass independent strict TypeScript, then report actual cohesion as RETAINED/REFACTORED/RECONCILE. No generation reader, UI, configuration or dependency edits are permitted.

### M401-A-GREEN01 — Implemented candidate awaiting S3 review

The code worker's initial Green executed the exact GREEN-A caller: all93 tests passed, zero failures/skips/cancellations/todo, then independent strict TypeScript passed. The primary inspected the complete five-file production diff and accepts the RETAINED cohesion disposition: one pure review validator, one contextual aggregate reader, and additive type/export/dispatch integration. Existing generation validation remains unchanged. No test correction or implementation correction was consumed.

Primary freshly closed `M401-A-green-01` as `closed-compliant`, receipt `1227464bcb2e507063bd79b4eab629974dff9675ea9fe0a77d1661d6bd5ccb20`, exactly five allowed production changes and no forbidden/unleased/index/HEAD drift. All accepted tests retain RED01 hashes. Canonical source94 advances to `ff0d5254f5a78db0d592920f104c34d40f8160261faf6fe52acd999180445543`; tests42 remains `b69a76fdd4fcfee4f6262d8e1cd17fca540e752493e7840696f6d07f2792189d`. Same HEAD/configuration/maintained environment applies, no active lease. `git diff --check` passes. Fresh S3 review and its risk-critical reproduction remain required before accepting A or starting B.

### M401-A-ACCEPT-01 — Accepted pure review and durable reader

Primary accepts fresh S3 critical review PASS with no remaining findings. The reviewer independently executed the exact GREEN-A caller:93 passing tests,0 failures/skips and strict TypeScript PASS. Additional bounded in-memory probes passed572 checks across profiles/providers/historical instruction versions, terminal states, unknown fields and timestamp boundaries. The first probe used inconsistent synthetic coverage counts; correcting that probe required no repository edits and does not represent an application defect. Current-state documentation was reconciled during review; no production/test correction was required.

The reviewer independently confirmed source94/test42 and exact accepted-test identities from GREEN01/RED01, configuration/frozen manifest13 references, pinned compliant lease payloads/receipts, absent active pointer/staged changes and `git diff --check`. Primary inspected actual production cohesion and unchanged tests. Same HEAD/runtime/preparation applies. I2–I5 applicable A behavior and I10 ownership/cohesion are accepted; B owns transition/admission/publication/readback and C integrated closure. No actual human decision, semantic-support truth, cross-platform qualification or durable publication follows from A.

B may enter read-only test-worker preflight under G's exact three test and six production paths. Existing safe-writer tests are reused as covered infrastructure; the missing review methods require honest behavior Red. Both A worker chains used one write turn each and no correction. No review correction loop was required for code.

### M401-B-PREPARE-BLOCK-01 — Proposed directory-check correction

Before B effects, the exact frozen PREPARE caller stopped at the first parent ancestor with `Nonordinary repository ancestor`. Read-only inspection established a command defect: `Get-Item` decorates the initial DirectoryInfo with PowerShell `PSIsContainer`, but raw DirectoryInfo parents reached through `.Parent` do not carry that property. Every inspected ancestor through the drive has the Directory filesystem attribute and no ReparsePoint; no unsafe path or source drift was found. No B write lease or runtime test effect occurred.

The concrete proposed correction changes only the directory predicate, preserving the reparse and canonical-path checks:

```diff
-if (-not $m401Cursor.PSIsContainer -or ($m401Cursor.Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Nonordinary repository ancestor' }
+if (-not ($m401Cursor.Attributes -band [IO.FileAttributes]::Directory) -or ($m401Cursor.Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Nonordinary repository ancestor' }
```

Primary constructed the candidate by replacing that exact expression once in the frozen caller, parsed it successfully and executed the complete read-only candidate successfully with the unchanged maintained preparation. Ordinary ancestors, three empty scratch leaves, retained browser/build, pinned-process absence and capture-flag absence all pass. This is verified preparation evidence, not approval of a third artifact correction or B effects.

Both final G artifact correction cycles are consumed (the executable DOCS caller and owner-identifier/error-reporting correction). The Decision Review Contract permits a maximum of two. Applying and reviewing this further frozen-command amendment therefore requires one additional owner-authorized artifact correction cycle; it cannot be relabeled routine recovery to reset that budget. A remains accepted, B read-only preflight can finish, and B writes/effects plus dependent C remain paused. Proposed additional scope is only this one-expression command fix and its existing-reviewer check; product contract, allowlists, implementation correction budgets and all exclusions remain unchanged.

The owner explicitly authorized this one additional G artifact correction-and-review cycle after reviewing the concrete fix and passing preparation evidence. The primary applied only the directory-attribute predicate to the frozen PREPARE caller. This is the sole additional cycle; A/B worker attempts, correction lineages and task exclusions are unchanged. Existing-reviewer verification remains required before B effects resume.

The existing final R3 reviewer returned PASS with no findings for the sole additional cycle, reviewed plan SHA-256 `7a20693a61dbec5f68ab206e785a92d2057c0ad7b983dc4219da8f3a7cb590ef`. Primary accepts the amendment and resumes B. Independent execution of the exact corrected PREPARE and DOCS callers passes, including all12 PowerShell fences, ordinary ancestors/scratch/browser/build and protected hashes. Source94/test42, HEAD and absent active pointer match A acceptance. The superseded predicate is invalidated; product evidence is not. No further additional artifact correction allowance remains.

### M401-B-PREFLIGHT01 — Missing review publication and service methods

Primary accepts read-only MISSING classification: repository/service contracts and returned objects lack `updateReview` and `reviewFinding`; the two G production modules and all three B test paths are absent. Current source94/test42 identities match A acceptance; expected dirty files and unstaged index remain unchanged. No B test effect or write occurred.

Existing selected-Finding isolation, safe publication and service-reservation tests are covered infrastructure, not new Red behavior. B Red exercises the frozen public repository and service methods through their existing modules, with complete behavior assertions and honest missing-method failures. Do not add a private operation import solely to force first-module failure or freeze an unaccepted private operation signature. This clarifies the testing surface without changing G contracts, paths or commands. Real controlled integration owns all three profiles/actions, invalid acceptance, read mappings, stale/repeated/sibling edits, precommit faults, reentry/shutdown/retained owners and exact resource cleanup. B's three-file test scope and six-file production scope remain unchanged. Initial Red remains gated on the authorized PREPARE amendment review and fresh lease.

### M401-B-RED01 — Test boundary returned for correction

The initial B Red caller reports10 repository and12 service tests failing only at the absent public methods, with synthetic setup validation and owned-resource teardown completed and no review scratch residue. Primary freshly closed `M401-B-red-01` as `closed-compliant`, receipt `cad0a16490eba4e5e9b1d5c817fd571e24d39baa2f5f5e51bb585273035c3a7a`, exactly three allowed new test files and no forbidden/unleased/Git drift. Source94 remains A's identity; tests45 is `f495cce7568336009825099673de9760a53b1a0c5ffbb5fd40fd6f0b9d9a3a2c`. These results are not yet an accepted B test boundary.

Actual test inspection found a coherent test-correctness gap: reentry/microtask cases incorrectly expect accessors to execute despite the accepted descriptor reader rejecting accessors; injected mocks/resources are not restored in `finally` on failed assertions; eligibility/finite-clock/retained-generation and service stale-result coverage is incomplete. A targeted independent strict check, justified by the observed unreachable phase comparison, confirms four readonly-to-mutable casts and one impossible `rename` branch in a write/close loop. There is no new production defect or authority change.

The primary returns Red for ordinary correction attempt2 under the same three files, exact public contract and phase. Use Proxy reflection traps for side effects, explicitly prove accessors remain uncalled, protect teardown with `finally` and report exact retained leaves, repair the five strict errors, and complete the named accepted I2/I3/I6/I7 cases without duplicating existing writer mechanics. The frozen RED-B caller remains unchanged; the already-frozen standalone strict caller additionally verifies test-side types before handoff because public method test interfaces are already structural. Red01 evidence is superseded when tests change. No Green is authorized until the corrected boundary is inspected and accepted; remaining Red allowance is this ordinary correction and conditional third only.

### M401-B-RED02 — Corrected tests and conditional final correction

Red attempt2 fixed reflection probes, cleanup restoration, strict types and the missing eligibility, clock, ownership and stale-result cases. The exact corrected PREPARE and RED-B caller reports 10 repository and 16 service failures solely at the absent public methods; standalone strict TypeScript passes. Downstream behavior assertions have not executed. No owned review scratch remains. Primary inspected all three files and freshly closed `M401-B-red-02` compliantly, receipt `03cc2b2d07146eb738b135b87acb5039b512477e584dda676bfb63caadf6df3d`, with no forbidden, unleased or Git drift. Source94 remains unchanged; tests45 is `7b7facbcb6e823f4cec06b4c4d71f02d06b42ae1ebb79b18d4053f2f16b834ec`.

One remaining expectation conflicts with the unchanged accepted contract: the combined eligibility loop expects `not-eligible` for an active sibling, while G requires `workflow-active`. Primary authorizes conditional Red attempt3 under the same three-file scope, owner and contract. Concrete progress is the corrected probes, cleanup, complete case setup and passing strict check; the new evidence is this exact error-mapping mismatch. The different bounded action separates or conditionally maps that one active-sibling expectation, preserving other assertions, then repeats the exact Red and standalone strict callers. This is likely to resolve the remaining test-boundary gap because the fixture is already valid and the authority is explicit. No production edit or G amendment is needed. Attempt3 names Red02 as its terminal parent and consumes the final existing B test correction allowance; it does not renew any budget.

### M401-B-RED03 — Accepted service and persistence test boundary

Primary accepts the corrected initial Red for the two missing public methods. The only attempt3 edit changes the active-sibling expectation to the frozen `workflow-active` mapping. The exact maintained preparation, corrected PREPARE and RED-B caller yields 10 repository and 16 service failures solely at the missing methods, with no skipped or cancelled tests; standalone strict TypeScript and `git diff --check` pass. Valid synthetic setup and owned cleanup complete with zero review scratch leaves. Downstream assertions remain unexecuted until unchanged-test Green.

Source94 retains A's identity. The accepted tests45 identity is `e1b88987f38591947a8bd374aaf7f8f612dd45985dcbe381ec8e53e6499631c6`; repository test `aeff5844ad4eced760e098da283fad88c70a59724f486dfa64e19373e9902bbd`, service test `92df482e463ae83742e723a70e8f24cf2e31b5469da57ce018e35554002c85fa`, sandbox helper `4846e701056d7570b52078fb8da4b2a8a769d4805e30cab6c2684fd2138e9f14`. A tests remain unchanged. Primary inspected all three files across Red02/03, verified the final expectation and freshly closed Red03 compliantly with only the allowed service-test modification and no Git, forbidden or unleased drift. The B test correction allowance is exhausted; B production retains its initial and existing bounded correction allowance.

### M401-B-GREEN01 — Implemented service and persistence candidate

Separate implementation ownership reached Green in the six allowed production files. The exact GREEN-B caller passes 191 tests: review repository 10, review service 16, pure review contract 9, existing repository 75, local service 69 and generation service 12, with no failures, skips or cancellations. Independent strict TypeScript passes. Earlier native-projection runtime/type failures were corrected within the initial production lease; final verification supersedes them. All 26 B behavior tests now execute beyond the missing-method boundary.

Primary inspected the complete six-file production diff and accepts structural disposition RETAINED: the purpose-named review operation owns synchronous admission-to-publication orchestration; the review transition owns pending-to-final isolation and original/provenance comparisons; existing service/repository entry points add wiring and reuse their reservation and writer. No generic layer, new writer or unrelated refactor was introduced. Primary freshly closed `M401-B-green-01` compliantly, receipt `136aba325a3ac81ffc6df8f383328f6361ec967688c14099530d7a35784c34e2`, exactly six allowed paths and no forbidden, unleased or Git drift. Source96 is `da2b3d4dc680b9acfa3d616beadf0529d24bbd0289ecca9b96937bf05c97714e`; accepted tests45 remains `e1b88987f38591947a8bd374aaf7f8f612dd45985dcbe381ec8e53e6499631c6`. Owned review scratch is absent. Fresh S3 review remains required before B acceptance and C.

### M401-B-ACCEPT-01 — Accepted service and persistence

Primary accepts fresh S3 PASS with no Blocker, Major or Minor findings. The independent reviewer inspected all six production files, three B test files, existing seams, complete I1–I10 contract and lease lineage; independently reproduced the exact 191-test GREEN-B caller and strict TypeScript; and passed 43 additional memory-only scenarios for nested reflection shutdown, synchronous commit, detachment, repeated decisions and invalid clocks. I1–I9 pass within the task boundary; I10's complete suite, build, integrated review and final documentation remain C obligations.

Source96 and tests45 retain M401-B-GREEN01 identities. Four configuration hashes, frozen manifest and all thirteen references are unchanged. Original temp/run inventories are preserved; no review scratch, pinned Node process or active lease remains. Post-close guard drift is limited to primary documentation maintenance, with source/tests and Git identity/index/ignore state unchanged. The actual structure remains RETAINED. No B implementation review correction was needed. C may now proceed with its frozen strict/build/full-suite caller and a different fresh critical reviewer.

### M401-C-REGRESSION-01 — Complete integrated verification

The primary executed the exact corrected PREPARE and C caller in its frozen order: independent strict TypeScript, Vite client build, 22 browser-free suites, the generation API suite with its required experimental module-mock flag, two scanner/integration suites and three UI suites with their assigned scratch roots. The complete caller exits 0. All 28 suites pass: 671 tests, zero failures, skips, cancellations or todo. Per-file counts in the frozen order are 73, 75, 69, 20, 13, 29, 20, 21, 5, 11, 27, 12, 34, 10, 6, 22, 17, 6, 10, 9, 10, 16, 5, 88, 15, 30, 10 and 8.

Verification uses the same pinned Windows, PowerShell, Node, TypeScript, dependencies and browser runtime as B. The complete prebuild inventory was the ordinary generated index, assets directory and two assets; the successful build replaces only that generated output. Final scratch checks pass. All thirteen preexisting retained-run aggregate hashes match the primary's pre-regression snapshot; no owner proposal was reviewed. The suite uses controlled synthetic fixtures and owned loopback resources, with no actual provider or evaluation operation. Source96/tests45 retain B identities. These results cover I1–I9 and the runtime portion of I10; they do not substitute for the different fresh integrated review or final documentation gate.

Documentation candidate: root README now describes the internal review API and includes the exact 28-suite inventory, preserving maintained preparation and existing module-mock/browser scratch routing; docs/README adds navigation. The roadmap, plan index and progress record reflect accepted B while keeping M4-01 In progress. Requirements, ADRs and frozen inputs need no amendment. The exact DOCS caller and inventory check pass before integrated review; closure status and archive remain pending its verdict.

### M401-C-REVIEW-01 — Integrated review correction required

The different fresh integrated S3 reviewer returns REVISE with one Minor finding and no production, Major or Blocker finding. Independent exact GREEN-B reproduction passes 191 tests and standalone strict TypeScript; PREPARE, DOCS, 28-file inventory, source/test/configuration/frozen identities, retained-run hashes and lease lineage pass. I1–I8 pass; I9 requires the correction below, and final I10 acceptance remains pending. Full 671-test/build evidence is valid for the current bytes but does not exercise the secondary cleanup-failure branch.

In `tests/review-repository.test.ts`, the controlled fault test's secondary descriptor-close, staging-unlink or identity-restore catch rethrows without setting the sandbox's `preserve` flag. The shared helper subsequently sees an ordinary topology and can attempt recursive removal, violating the accepted preserve-on-cleanup-uncertainty gate. The reviewer reproduced that branch in memory without real filesystem effects and observed `recursiveRemovalAttempted: true`. Primary inspected the actual callback and helper control flow and confirms the finding. The service test already sets its preservation flag in the equivalent catch. The bug index was consulted; this bounded task-contained test correction stays in this plan rather than creating a separate bug record.

The concrete proposed correction is confined to `tests/review-repository.test.ts`: retain the sandbox object in the fault-test callback, derive `runs` from it, set `box.preserve = true` before rethrowing the secondary cleanup error, and report `box.root` as the exact retained leaf. No production or shared-helper edit is needed. This changes the accepted test boundary and requires fresh focused verification and reacceptance, then the complete authoritative closure caller and integrated re-review; existing unchanged production/cohesion evidence remains reusable.

The B test chain has consumed initial plus both authorized corrections. The prior owner extension covered only one G artifact correction and left implementation budgets unchanged. Under AGENTS.md's explicit exhausted-budget rule, primary has not applied this correction or opened another lease. Proposed owner authorization is exactly one additional bounded primary test correction using ADR-0024's between-lease exception, with evidence invalidation/reacceptance and the existing verification/review/closure route. It does not reset a worker chain, amend guard tooling, expand production scope or authorize another task. All unaffected verification and documentation preparation is complete; final status remains In progress.

### M401-C-CORRECTION-01 — Authorized bounded primary test correction

The owner explicitly authorizes exactly one additional bounded primary correction for the repository test's cleanup handling, followed by verification, integrated re-review and M4-01 closure. This extends only the exhausted B test correction allowance and leaves production scope unchanged. No worker lease is active. Primary uses ADR-0024's between-lease test-correction exception because the existing B test chain is exhausted and the named correction is now specifically authorized; no guard or workflow change and no replacement worker chain is introduced.

The sole implementation path is `tests/review-repository.test.ts`, with the exact callback/preservation/error-path correction described in M401-C-REVIEW-01. Prior whole-test-tree and full-suite evidence becomes historical when this file changes. Verify the memory-only secondary-cleanup reproduction and the repository suite plus standalone strict TypeScript, inspect the actual bounded diff and accept a new test identity before the complete C caller and integrated re-review. Unchanged source/A/cohesion/frozen-input evidence remains reusable within its recorded boundaries. This authorization is consumed by this correction and does not grant further test corrections.

### M401-C-TEST-ACCEPT-01 — Corrected cleanup boundary accepted

Primary applied only the authorized repository-test callback correction, inspected its actual diff and confirmed no active lease or production change. The catch now sets preservation before rethrowing and names the exact sandbox root. A bounded Node VM probe extracts the actual catch and helper removal branch, exercises descriptor-close, staging-unlink and identity-restore error labels, and compares the previous flag-omitting branch with the corrected branch entirely in memory: all six scenarios pass, previous removal is attempted and corrected removal is not attempted, with zero filesystem mutations. This is control-flow evidence for secondary cleanup failure; it does not claim a live Windows close failure occurred.

The exact repository suite passes all 10 tests and the standalone strict TypeScript check passes. Primary accepts the revised test boundary: repository test SHA-256 `4483442ddbc4ca1f4ac7a41e01c8dea1bb244663ef0bfc84f650fd41444172b2`; tests45 `73be4111788f5c4952efa4efa7e9ea7511e46f5fe8baf1a43d4789df4e32e45c`. Source96 is unchanged. DOCS, 28-file inventory, configuration and frozen-input checks pass. The named owner extension is consumed; the complete C caller and integrated re-review now operate against this revised identity. Earlier full-suite evidence remains historical for its previous test bytes.

### M401-C-REGRESSION-02 — Renewed complete verification after test correction

After M401-C-TEST-ACCEPT-01, primary repeated the complete unchanged C caller in its exact frozen order. Independent strict TypeScript and Vite build pass; all 28 suites again pass all 671 tests, with zero failures, skips, cancellations or todo and caller exit 0. Per-file counts remain those recorded in M401-C-REGRESSION-01. This is the authoritative complete-suite result for corrected tests45 `73be4111788f5c4952efa4efa7e9ea7511e46f5fe8baf1a43d4789df4e32e45c`; source96 remains `da2b3d4dc680b9acfa3d616beadf0529d24bbd0289ecca9b96937bf05c97714e`.

All three assigned scratch roots are empty after the caller, and all thirteen retained-run aggregate hashes still match the pre-regression snapshot. Configuration and frozen inputs remain unchanged. Earlier source/cohesion evidence remains valid; the original whole-suite result is preserved as history for its former test identity. Integrated re-review of the named Minor and final documentation closure remain the only pending gates.

### M401-FINAL-01 — Integrated review and task closure

The different fresh integrated S3 reviewer accepts the corrected state with no open findings. The original review passed I1–I8 and found one Minor test-cleanup preservation defect; the owner explicitly authorized its bounded primary correction after the B test budget was exhausted. Independent re-review verifies the exact test-only delta, reproduces all six old/current secondary-cleanup scenarios through the shared helper without real filesystem effects, and confirms preservation, original cause and exact-root reporting. The corrected repository suite and standalone strict TypeScript pass independently. Unchanged production, cohesion and earlier review evidence remains valid.

M401-C-REGRESSION-02 is the final full-suite identity: all 671 tests in 28 suites pass, with independent strict TypeScript and the client build, no failures/skips/cancellations/todo, and exact owned cleanup. Source96 remains `da2b3d4dc680b9acfa3d616beadf0529d24bbd0289ecca9b96937bf05c97714e`; corrected tests45 remains `73be4111788f5c4952efa4efa7e9ea7511e46f5fe8baf1a43d4789df4e32e45c`. Four configuration files, the frozen manifest and thirteen references are unchanged. All thirteen preexisting retained-run aggregates retain their hashes. I1–I10 are accepted within the documented Windows and controlled-fixture limits.

Documentation closure reconciles the root README's review API and complete verification command, docs navigation, roadmap status, plan index and progress record/index. The exact DOCS and 28-file inventory callers pass for the closure candidate; the archive move repairs all inbound and relative links and is checked again. Strict UTF-8, final newlines, whitespace, local links/anchors, PowerShell syntax, configuration and frozen-input identities, cumulative `git diff --check`, and unchanged source/test identities pass. No requirement or ADR amendment is needed. No active lease or owned review scratch remains.

M4-01 is Complete and this plan is archived. M4-02/M4-03 remain separately selected future tasks; retained actual proposals remain pending human review, and M3-03's capacity gate is unchanged. Confirmation and mechanical validation do not establish semantic truth, accessibility conformance, provider capacity or cross-platform qualification. No commit, publish or push occurred.

## Revision Note

### M401-EXEC-01 — Execution entry and comparison inputs

Execution begins at intentional clean HEAD `24d4565b2e3a04d5cca41a23bea2bd7487c47410`; no active lease exists. The historical planning HEAD is not an equality gate. The initial expected dirty path after this primary maintenance is this plan only. Node `v24.20.0`, Python `3.12.10`, and the maintained PowerShell preparation are available; independent strict TypeScript passes. Runtime role metadata exposes the configured research, test and implementation roles with their documented pins; no role override or configuration change is requested.

Relevant entry SHA-256 identities (Python `sorted(Path(root).rglob("*"))` WindowsPath ordering; ordinary files only; each `as_posix()` relative path encoded as UTF-8, NUL, exact file bytes, NUL): `src` = `3e3399b346b4cffbf609380e97dbe71140978cce356e66ac8cab474e2ad653dc`; `tests` = `1b91683876fdbc7bbbb0fa496c7d152eaafed708fa8432e21ac25fb616af5644`. Configuration: package metadata `01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c`, lock `38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d`, strict configuration `3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde`, Vite configuration `8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07`. The frozen M3-01 manifest retains M401-ENTRY-01's hash and all thirteen references match exact bytes. An initial diagnostic compared uppercase recorded hex with lowercase calculated hex; inspection established encoding-case mismatch only, with no input drift.

Fresh pre-draft reproduction reconciles the tree ordering: all 92 source files are unchanged. Sorting the same inventory by case-sensitive POSIX path string instead yields `9aed3e8b0067fb68c73272be51234177d49b9b06837bc8e76d0e88f534b7517c`; all 40 test files produce the recorded test digest in either order. Future receipts use explicitly named ordering; this is fingerprint ambiguity, not source drift.

The bounded non-ranking discovery confirms the plan's current validator, selected-Finding writer and service-reservation seams. Freeze these credible comparison inputs before the single critical research report: (1) one discriminated final decision with support confirmation admitted only at input, versus the same compact decision retaining one aggregate-level confirmation bit; (2) one closed tagged judgment disposition with a reason only for N/A, versus a flat disposition plus conditionally required reason; (3) synchronous review inside the existing read reservation, versus the existing finding-operation reservation with a Promise outcome. Both admission candidates must reserve before untrusted reflection, respect stopping and retained owners, and publish through the existing writer. Separate stores, history, schema versions, provider activity, HTTP/UI and generic coordination are scope-gate exclusions, not comparison candidates. The researcher recommends compatible exact literals and an acyclic placement from current source; the analyst and fresh pre-draft reviewer must settle decision semantics before primary authoritative drafting. I1–I10 remain the cumulative packet; all new runtime claims remain pending A/B/C proof.

2026-09-14 UTC: execution authorization supersedes earlier planning-only current instructions. Preserved the planning history and budgets; established current identity and comparison inputs without application edits.

2026-09-14 UTC: created for the owner's 2026-09-13 local-date M4-01 planning request after fresh current-state review. Recorded M3-05 completion, current retrieval/runtime amendments, independent capacity limitation, two delegated TDD slices, future R3 literal/command barrier and bounded nonvisual verification. No implementation or review action was executed.

2026-09-14 01:04 UTC: recorded independent planning readiness PASS, fresh frozen-reference checks and documentation closure; reconciled current state and progress only. No executable contract, product authority or future execution grant changed.
