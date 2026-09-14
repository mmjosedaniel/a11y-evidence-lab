# Present the accessible review interaction

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M4-02](../DEVELOPMENT_ROADMAP.md#m4-02--present-the-accessible-review-interaction), In progress for owner-requested current-state review and planning only. No application implementation is authorized by this request.
- **Latest barrier:** [M402-PLAN-01](#m402-plan-01--accepted-planning-readiness), independent readiness PASS with no findings and documentation checks, following [M402-ENTRY-01](#m402-entry-01--planning-evidence). M4-01 is Complete, including its internal review API and persistence; no browser review exists. M3-03 remains independently Blocked on capacity.
- **Pending:** execution requires an owner request, then [G](#g--freeze-transport-admission-and-interaction-literals) before A/B preflight. No transport, UI literal or browser evidence is accepted by this planning checkpoint.
- **Active lease:** None. No implementation worker has been dispatched.
- **Allowance:** no actual scan, retrieval, generation, credential inspection, acquisition or mutation of retained owner proposals. Future research and implementation limits are in [Plan of Work](#plan-of-work) and the [Decision Review Contract](#decision-review-contract); none has begun.
- **Next:** owner execution request. Execution resumes through G, [A/B](#a--same-origin-review-transport-and-response-admission), [command preparation](#concrete-steps), [acceptance](#validation-and-acceptance) and [recovery](#idempotence-and-recovery).

## Progress

- [x] (2026-09-14 15:26Z) Inspect current roadmap, M4-01 closure, selected authorities, frontend skill and relevant service/UI/test seams. Fresh strict TypeScript and 92 pure tests pass; M402-ENTRY-01.
- [x] (2026-09-14 15:37Z) Accept the complete planning draft, independent readiness PASS with no findings and documentation checks; M402-PLAN-01. G and implementation remain unstarted.
- [ ] After execution authorization, accept G's exact contract, reuse audit and command/path packets.
- [ ] Accept A: same-origin review transport and response admission through separate-owner TDD and fresh critical review.
- [ ] Accept B: accessible review interaction and final-state presentation through frontend-visual TDD, browser evidence and fresh critical/visual review.
- [ ] Accept integrated verification, different fresh integrated review and documentation closure; only then mark M4-02 Complete and archive this plan.

## Surprises & Discoveries

- [M4-01 final closure](completed/m4-01-review-behavior-and-persistence.md#m401-final-01--integrated-review-and-task-closure) accepts 671 tests in 28 suites, strict/build, integrated re-review and exact cleanup. Its prior Minor test-cleanup finding and owner-authorized correction are preserved there. Production review semantics are implemented, not open design questions for M4-02.
- `ProposalDetail.tsx` labels every proposal as pending, `ResultDetail.tsx` renders it only for `proposal-pending-review`, and `resultPresentation.ts` gives cached generation presentation precedence over the durable state. M4-02 must reconcile all three when displaying a saved decision; adding a form alone would leave contradictory labels or hide the original.
- `ReviewOutcome` success contains a validated durable run; failures contain `persisted: false` and possible cleanup uncertainty. A lost HTTP response is different: the synchronous service may already have committed. UI timeout or abort cannot prove the decision was not saved and cannot authorize automatic resubmission.
- Existing `generation-api.ts` caps its small ID-only request at 1024 bytes. A complete edited proposal needs a separately derived finite request bound; copying that cap would reject valid review content. No shared HTTP framework is required.

## Decision Log

- Decision: activate only M4-02 planning. Rationale: explicit owner request and Complete M4-01 satisfy selection and prerequisites; application work awaits execution authorization. Date/author: 2026-09-14 / primary.
- Decision: plan a nonvisual transport/admission slice and a frontend-visual interaction slice, followed by integrated closure. Rationale: each has a coherent independent proof and the appropriate implementation owner. Date/author: 2026-09-14 / primary.
- Decision: reuse M4-01's accepted review contract and writer without redesigning persistence. Rationale: only exposing that contract is needed; its representation, irreversible finality and failure behavior are already implemented. Date/author: 2026-09-14 / primary.
- Decision: use R3 for unresolved client/transport identity and lost-response recovery choices, and S3 for A/B review. Rationale: response correlation, stale/reentrant interaction and irreversible final-decision integrity remain critical even though the writer is reused. Visual review is included in B's existing review, not a separate panel. Date/author: 2026-09-14 / primary.

## Outcomes & Retrospective

Planning is complete with independent readiness PASS and documentation checks. M4-01 provides internal review; the current browser still provides generation and original proposal inspection. No review UI, browser accessibility result or human decision on an actual retained proposal is claimed. The frontend-quality skill shaped reuse, named responsibility placement and proportional browser evidence; it creates no additional product requirement. Execution remains pending.

## Purpose / Big Picture

Allow the developer to review one valid generated proposal in the existing selected-Finding workspace: approve the original, edit and accept a complete validated proposal, or reject it. Keep evidence, guidance, AI-authored original, reviewer-authored content and saved decision distinguishable. A final action becomes visible as saved only after a trustworthy service response or the explicitly frozen recovery check confirms canonical state. Users retain their place in the result list and can inspect the post-change reminder without being asked to complete it during review.

## Context and Orientation

Start from the [authority map/task router](../README.md#read-by-task), [global requirement semantics](../PROJECT_REQUIREMENTS.md) and the owning roadmap row. Selected authorities are all Accepted at their applicable MVP scope:

| Authority | M4-02 obligation |
| --- | --- |
| [REQ-REV-001, 008, 009](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#human-review-and-manual-checks) | Only valid proposals enter individual human review; original preserved; exactly one final action; support and blocking-judgment gates; bounded note; full edited proposal only for edit-and-accept. |
| [REQ-UX-002](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export) | Distinguish evidence, guidance, AI interpretation, sufficiency and human work without color alone. REQ-UX-011 controls the existing selected-Finding/no-abstention-review interface. |
| [REQ-A11Y-001–004, 009, 010](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md) | Keyboard operation, semantics, accessible relationships, visible focus, contrast/reflow, one shared announcement pattern, complete results and selection-focus preservation. REQ-A11Y-006 governs the proportional verification method. |
| [SPEC-005, SPEC-008](../specs/SPEC.feature), [HS-010](../specs/HARD_SPEC.feature) | Three individual review branches; support/judgment gates; distinguish original/edited content; non-blocking reminder; no whole-page or automatic-remediation claim. |
| [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | React is presentation/transient interaction over the application-owned service; the validated single-file aggregate owns durable decisions. Preserve each ADR's recorded status and amendments. |
| [Lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), [existing presentation](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md), [visual foundations](../ui/VISUAL_FOUNDATIONS.md) | Canonical states and evidence hierarchy; no competing lifecycle, lost evidence, extra panels or decorative redesign. UI guidance remains subordinate to requirements. |

Entry is clean HEAD `5f1de30ee1aad85a4d1ecf99fca9beab6065794d`. Seventeen tasks are Complete; M3-03 is Blocked. This planning activation makes M4-02 In progress and leaves nine later tasks Not started. M4-01's 671-test closure is historical accepted evidence, not a fresh full-suite run in this turn. Actual Local/Groq proposals remain pending human review. M3-03 capacity and M6 evaluation retain independent gates.

M3-05's role-aware retrieval selection, corrected runtime instruction version and historical-read compatibility remain unchanged. The frozen M3-01 manifest and its thirteen referenced inputs remain protected. This task does not run the six fixed generation evaluations. OD-026's run reopening/history UI stays Deferred; a narrowly scoped response-recovery check is not general reload restoration.

### Accepted M4-01 interface to consume

`LocalService.reviewFinding(input: unknown): Promise<ReviewOutcome>` accepts exactly `{ runId, findingId, review }`. `src/server/domain/review-contract.ts` owns these existing literals:

- Actions are `approve`, `edit-and-accept`, `reject`; terminal Finding states are `accepted`, `edited-and-accepted`, `rejected`.
- Approval/edit input requires `supportConfirmed: true`; that transient confirmation is not persisted. Rejection must omit it. The UI cannot automatically set it merely because generation validation passed.
- `blockingJudgment` is `supports-proposal`, `not-applicable` with a reason, `unresolved`, or `contradicts-proposal`. Only the first two permit acceptance. Rejection permits all four. Only N/A carries a reason.
- Optional note is nonblank and at most 1000 JavaScript UTF-16 code units when present; N/A reason is nonblank and at most 500. The validator preserves submitted text rather than trimming it. Empty optional controls must map to omission, not an invalid empty property.
- Only edit-and-accept carries a complete `editedProposal`, validated by the existing closed eleven-field Proposal contract with the original Finding/retrieval context. The original `result` and generation provenance remain unchanged. Server-owned `decidedAt` is not a form field or browser-supplied timestamp.
- Success returns `{ ok: true, run }`. Failure uses the existing bounded `ReviewOutcome` error union with `run`, `persisted: false`, `cleanupFailed`. M4-01 already controls duplicate/stale transition refusal, admission and atomic publication. Do not alter it to make UI tests pass.

### Current seams and reuse audit

This is a planning audit, not the implementation preflight's accepted reuse-audit identity. Revalidate actual cohesion at G/B and name any changed disposition before coding. Source paths below are repository-relative.

| Current responsibility / path | Disposition and bounded change |
| --- | --- |
| M4-01 validator, service operation and repository transition | `REUSE_AS_IS`: canonical review semantics and durable truth. No new decision entity, serializer or writer. |
| `src/server/local-service/loopback-api.ts`, `src/server/service.ts` | `EXTEND`: dispatch one same-origin review endpoint to the existing service method. The endpoint body reader is a distinct new owner, not another substantial branch embedded in the router. |
| `src/client/finding-response-snapshot.ts`, run/proposal validators | `REUSE_AS_IS`: inert detached response inspection and structural validation; reuse without importing filesystem/service implementation into the browser. |
| `src/client/main.tsx`, `src/client/App.tsx` | `EXTEND`: callback composition and necessary shared run/reservation/announcement coordination. Substantive request/admission mechanics have named owners; do not append a monolithic review subsystem to App. |
| `ResultsSection.tsx`, `ResultDetail.tsx` under `src/client/components/results/` | `EXTEND`: pass review controls and compose original, review form and final decision for the selected Finding. No new page or routing framework. |
| `ProposalDetail.tsx` claim/reference presentation | `REUSE_AS_IS` for existing claim/reference semantics; `EXTEND` labels for original versus reviewer-authored full content and final state. `EXTRACT_LOCAL` the structured body only if necessary for these two actual consumers; no generic renderer. |
| `resultPresentation.ts`, `FindingGeneration.tsx`, App selection announcement | `EXTEND`: durable final review state takes precedence over obsolete pending-generation labels while preserving actual provider-call provenance. |
| Review form, complete plain-field editor, saved decision | `CREATE` named task-local owners: `ProposalReviewForm.tsx`, `ProposalEditor.tsx`, `ReviewDecision.tsx`. Form owns current draft/confirmation/errors, editor owns complete proposal fields and references, decision owns immutable human-authored projection. No wrapper-only review container. |
| `styles.css`, existing shared status, results list, scanner evidence and authenticated guidance | `EXTEND` only necessary review control/error layout styles; `REUSE_AS_IS` shared announcement mechanism, list/evidence/citation owners and existing light direction. |
| `tests/helpers/m104-ui-harness.ts`, M305 generation fixtures, M401 review fixtures/sandbox | `EXTEND` only named review callbacks/controlled cases; reuse existing build/browser and exact-root cleanup patterns. New review fixtures must stay visibly synthetic and test-owned. |

## Scope and Non-Goals

Include the minimal same-origin HTTP/client admission needed to invoke the existing internal service, accessible proposal-only controls, complete plain-form edit-and-accept, support and judgment confirmation, optional bounded note, safe validation/operation errors, saved-decision projection, truthful provider/original labels, shared announcements and focus behavior. Preserve all prior evidence and the reminder after each final action.

Exclude actual provider calls, scans, retrieval/model acquisition, credentials, changing retained owner runs, review of actual generated proposals, generation evaluation, capacity work, comparison, source-code remediation, new domain decisions, persistence changes, authentication, reviewer profiles, comments/history, versions, queues, bulk review, automatic retry/regeneration, run reopening, rich-text/JSON code-editor tooling, dependencies, form/component frameworks, design systems, animations, screenshot infrastructure or telemetry. Controlled proposals and disposable runs prove this UI contract; M4-03 remains the real-proposal review checkpoint.

## Plan of Work

Apply the [worker-first workflow](../../.codex/execplan-implementation-workflow.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [write guard](../../.codex/write-lease-guard.md) and the [frontend-quality skill](../../.agents/skills/frontend-quality/SKILL.md) for B. The primary owns authority, authoritative documentation, acceptance, leases, integration and closure. Research/review roles are read-only. No worker owns the plan, requirements, developer documentation, status or Git mutations.

Each implementation slice receives a complete Milestone Assignment Packet v2 before read-only `test_worker` preflight. Classify existing coverage, characterization and the explicit missing portion accurately. `UNKNOWN`/`CONFLICTING` stops for primary triage; do not manufacture Red. The first-module missing-export exception applies only with verified environment, full behavioral tests and honest capability-absence evidence. Separate Green must execute every accepted test unchanged and pass independent strict TypeScript.

Keep one test owner and the selected implementation owner per slice; Red and Green/optional behavior-preserving Refactor are sequential. Every write turn has a fresh primary-opened and terminally closed lease. Only one lease is active per worktree. Inspect actual diff, complete evidence identity, cohesion, commands and terminal receipt before acceptance. Primary documents between leases; only the existing bounded primary test-correction exception can permit direct test edits with evidence invalidation/reacceptance.

Budget: one preflight, one coherent Red/characterization and Green sequence per slice, at most three writes per unchanged role/phase chain (initial, ordinary correction, conditional final correction with recorded learning), and one review correction loop. No agent/packet/lease ID resets a consumed allowance. Stop dependent work after exhausted budget, changed binding fields, two same decisive gaps without new evidence or two no-diff handoffs. Resolve routine stops within remaining authority and complete unaffected work; ask the owner only at the actual decision/authority boundary. Only useful independent read-only work may run in parallel.

### G — Freeze transport, admission and interaction literals

**M402-G; R3; TDD: Not applicable.** Primary-owned contract work, no production writes or worker lease. Replacement evidence: traced current authority/source, complete cumulative invariants and mandatory research reviews. Production responsibility change: None.

Keep the M4-01 interface fixed. Freeze the exact route/method/content type, finite body limit derived from every valid complete edit including UTF-8/JSON escaping, strict request parsing, error/status envelope and abort/duplicate-dispatch behavior. Freeze how an unexpected transport failure is distinguished from a definite M4-01 refusal; never forge a known-unsaved result after a possible commit.

Freeze client response admission against a captured immutable run, Finding and submitted action/body: valid run shape alone cannot prove the server saved the intended edit or action. Require unchanged original, siblings, parent and invocation; tolerate only the permitted selected final transition and server decision time. Freeze failure envelopes, stale/reentrant/unmount handling, pending ownership, finite local deadline/abort effects and late-response handling. A missing or malformed reply remains unknown unless a specifically authorized, finite current-run read proves canonical state. Choose conservative unknown-state blocking or that minimal read, not a polling/retry/reopen subsystem. Never resend the final decision automatically.

Freeze the UI's complete editor mapping: preserve fixed identity/type/sufficiency context; allow the current complete proposal's editable prose, categorical confidence, assumptions and allowed per-claim evidence/passage references through native controls. Retain all eleven fields in the submitted candidate, validate against existing reference rules, and make unsupported edits resolvable. Define omission of blank optional note, exact existing bounds, N/A reason display, inline validation relationships, and the action-specific request shape. Confirmation must refer to the submitted resulting proposal; changing relevant draft content must invalidate a prior confirmation. Rejection must remain available without a false support assertion or a passing judgment.

Freeze local draft lifetime keyed to run/Finding, selection during submission, pending/final button behavior, and safe handling of a focused form when it is replaced by the decision. Preserve focus on a selected list item; asynchronous completion must not steal focus from a sibling. Reuse the one shared status region to announce the captured Finding's saved/error/unknown outcome with existing provider provenance and without implying sibling changes.

Complete the B frontend-visual capsule: accepted reuse-audit identity, named form/editor/decision owners, source labeling and final-state precedence, bounded state/viewport samples below, exact native-zoom mechanism and browser/cleanup callers. Freeze exact A/B allowlists, command/effect slots, prerequisite identities and protected inputs before preflight. No new product architecture is being selected; an incompatible requirement or broader change requires owner direction.

### A — Same-origin review transport and response admission

**M402-A; TDD; S3; `test_worker` then `code_worker`.** Authorities: REQ-REV-001/008/009, ADR-0012/0021, SPEC-005, HS-010 and G's accepted identity/recovery contract. Preflight target: no review HTTP dispatch or browser response-admission function exists at entry.

Test-owner candidate paths: `tests/finding-review-api.test.ts`, `tests/finding-review-admission.test.ts`, `tests/helpers/m402-review-fixture.ts`; use existing M401 fixtures read-only. Any required existing service test addition must be named before preflight. Production candidate paths:

- `src/server/local-service/review-api.ts` (new): bounded review request/body parsing, one dispatch and honest transport outcome. Reuse the local route pattern without changing generation/retrieval readers or introducing a common HTTP framework.
- `src/server/local-service/loopback-api.ts`, `src/server/service.ts`: minimal callback/route wiring only; the existing review service remains the decision/persistence owner.
- `src/client/finding-review-admission.ts` (new): detached request-correlated response validation, selected-transition checks and bounded failure admission. Depends on browser-safe validators and snapshot/equality; no React, service implementation or filesystem dependency.
- `src/client/main.tsx`: minimal same-origin callback wiring when its consumer exists; if an unused callback would fail strict checking, freeze this wiring in B rather than adding a stub.

No rendered changes in A. Tests prove exact parsing/no dispatch on malformed/oversize/aborted input, single dispatch, service delegation, response/body/action matching, immutable context/siblings, forged/unknown failures, accessor/prototype hazards and no provider execution. Use controlled callback tests and a bounded real loopback test where required; service-owned integration can reuse synthetic M401 pending proposals in exclusive test roots. Commands cover new A suites, affected generation API/admission regression, review-contract/run-contract and independent strict TypeScript. Advance only after accepted Green, terminal leases, actual cohesion inspection and fresh critical PASS or reconciled non-blocking follow-ups.

### B — Accessible review interaction and saved decision

**M402-B; TDD; S3; profile `frontend-visual`; `test_worker` then `frontend_code_worker`.** All M4-02 authorities apply, with the skill's accepted reuse/visual capsule required before preflight. A must be accepted. Preflight isolates missing review controls/final-state presentation without rewriting already-covered generation/list behavior.

Test-owner candidate paths: `tests/finding-review-ui.test.ts`, `tests/helpers/m402-review-fixture.ts`, `tests/helpers/m104-ui-harness.ts`, and necessary focused assertions in `tests/finding-generation-ui.test.ts`. Name any additional existing test/harness entry path at G. Green never edits tests. Production candidate paths are App/main composition; `src/client/review-request.ts` for substantive transient request ownership/deadline/admission mechanics if needed; the three named new form/editor/decision components in the reuse audit; bounded `ProposalDetail.tsx`/local structured-content extraction; `ResultsSection.tsx`, `ResultDetail.tsx`, `FindingGeneration.tsx`, `resultPresentation.ts` and `styles.css`.

Responsibility direction: App owns shared run/selection/reservation and the one announcement setter; the review request owner coordinates the bounded async transport and admission, not domain decisions; the form owns transient fields/confirmation/errors for one run/Finding; the editor owns complete proposal-input controls; the decision owns immutable saved human-authored output. Detail composes them with existing scanner/guidance/original presentation. Rendering and pure mechanics stay outside App when substantively distinct. No generic hook, reducer, form schema engine or wrapper component is justified merely by file size.

Render original content explicitly as AI-authored whether pending or reviewed. Edited content is reviewer-authored and must not be labeled original model output; its confidence and wording cannot be attributed to a new model call. Keep original and accepted edited content inspectable with their references and distinguish which was accepted. Reject displays no accepted plan. Show action, service decision time, judgment/reason and optional note, without actor/history fields. All reviewer/model/target text stays inert.

The form uses native labeled controls and concise support/judgment instructions. Keep the post-change reminder visible for pending and every final branch, without a completion checkbox or acceptance gate. Use final durable state for list/detail/selection announcements instead of stale cached pending-generation text. Do not hide deterministic evidence or guidance while editing. Preserve keyboard order, selected list focus, non-color final labels and submission/error/unknown feedback under G's frozen focus contract.

Focused proof uses the actual rendered application in the existing browser harness, controlled Local/Groq proposal fixtures, automated axe/keyboard/focus/announcement checks and the bounded manual visual samples below. A final decision shown in a fixture is not evidence that a real owner proposal was reviewed. Include a synthetic browser-to-service-to-disk flow through A's real endpoint; freeze seed/build/readback/cleanup in the packet rather than shipping a production test backdoor. Fresh critical review covers B's integrity and visual-quality obligations in one review.

### C — Integrated verification and documentation closure

**M402-C; no new production slice; TDD: Not applicable.** The primary integrates accepted A/B and reuses current evidence identities. Run independent strict TypeScript, the client build and the complete maintained authoritative suite (entry: 28 suites, plus accepted M4-02 suites). Repeat broader tests only for changed/stale evidence, failures or unresolved risk; perform required independent risk-critical reproduction. Audit test fixtures/mocks/skips and actual responsibility placement before handoff.

Obtain a different fresh integrated `critical_reviewer`, including accepted visual evidence and cumulative I1–I10. No separate visual panel, full browser matrix, real provider call or actual-proposal review is required. M4-03 and M3-03 retain their respective real-human-review and capacity obligations.

Apply the [documentation closure gate](../README.md#task-closure-documentation-gate). Primary updates the implemented UI extension and instructions in the existing UI documentation, current capability/API/developer test inventory, this plan, roadmap/progress and affected navigation. Do not change requirement/ADR semantics merely to reflect implementation. Verify links/anchors, command/configuration consistency, encoding/whitespace and `git diff --check`; close owned resources. Mark Complete/archive only after task Verification and documentation closure pass. M4-03 stays Not started until selected.

## Decision Review Contract

**Identity:** M402-G, future R3 transport/client decision-integrity contract, not yet researched or accepted. **Artifact:** one accepted contract and exact packet/command subsection in this plan; no extra ADR, ledger or research document by default. **Approval boundary:** primary accepts task-owned literals compatible with existing authorities after required checkpoints; owner decides architecture/scope conflicts.

**Discovery/candidates:** at most one bounded non-ranking pass for exact current transport, browser harness and visual mechanism gaps. Freeze candidates, hard gates and evidence dimensions before comparison. Compare only minimal compatible admission/recovery and local ownership options. Existing M4-01 shape, writer, reference rules and finality are fixed inputs, not candidates. Reject a new backend, generic form framework or workflow/retry engine at the scope gate.

**Criteria:** preserve the exact intended human action and submitted content, original/sibling identity, durable truth despite lost/late replies, bounded transport, no unauthorized call, accessible source distinctions, current-state honesty, cohesive minimal owners and executable controlled proof. Decide literals now; prove runtime/visual behavior in A/B. A confirmation field or valid citation is not proof of semantic truth.

**Budget/topology:** one `critical_researcher` report for the cohesive request-to-visible-decision integrity dimension, covering parsing/serialization, action/body correlation, stale/reentrant ownership, lost-response recovery and failure presentation; one bounded follow-up. Primary supplies routed UI authorities and current reuse evidence. One mandatory `decision_analyst` synthesis/contract audit plus one bounded correction; fresh `critical_research_reviewer` pre-draft checkpoint; primary-only authoritative drafting; different fresh `critical_research_reviewer` final review. No drafter or optional visual research report is planned. Allow one pre-draft correction and the workflow's maximum two final-artifact correction cycles within the existing research budget. If the report cannot cover the critical dimension, stop/reconcile its capsule before adding work.

Use Research Assignment Capsules projecting this contract, current source/evidence identities, exact authorities, required outputs and remaining allowance. Synchronize research before analysis. Synthesis returns exactly `DRAFT READY`, `RETURN FOR RESEARCH` or `OWNER DIRECTION`; DRAFT READY does not bypass either R3 checkpoint or open a lease. Review the exact primary artifact and complete I1–I10 packet, separating evidenced contract facts from pending runtime claims. The primary reconciles findings before accepting G. Repeated decisive gaps twice without material new evidence, exhausted budget, changed scope/authority or unresolved owner choices stop dependent work; new agent IDs never reset limits.

## Concrete Steps

All commands run from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab` after reading and dot-sourcing the current [README preparation](../../README.md#development-command-preparation). Do not replay historical M4-01 leases, cleanup roots or Git comparisons. Planning needs no install, application launch or browser capture.

### M402-ENTRY-01 — Planning evidence

On 2026-09-14 15:26 UTC, clean HEAD `5f1de30ee1aad85a4d1ecf99fca9beab6065794d` had no active `logs/agent-flow-leases/v2/active.json`. Node 24.20.0, independent strict TypeScript and all **92** tests across run-contract, review-contract and finding-generation-admission passed, with no failure/skip. This is focused planning verification, not a rerun of M4-01's full 671-test closure or evidence of a review UI. The M3-01 manifest SHA-256 remains `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; all thirteen `path`/`sha256` references also pass fresh exact-byte hash checks.

```powershell
git status --short
git rev-parse HEAD
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') { throw 'Resolve existing lease before continuing' }
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/review-contract.test.ts tests/finding-generation-admission.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Planning checks failed' }
}
git diff --check
```

The entry HEAD is historical evidence, not a future executable equality gate. Execution records the then-current intentional HEAD, expected dirty paths, relevant source/test/configuration hashes, frozen/protected inputs, command/cwd and runtime/environment. Reuse evidence only under the workflow's complete identity/no-drift rule. A committed plan need not be dirty; reconcile changed bindings instead of mechanically replacing an old hash or requiring the old parent in lease/closure comparisons.

### Future command and effect slots

These unresolved slots must be completed and reviewed in G before the affected preflight, lease or primary effect. They are not permission to improvise commands during a worker turn.

| Slot | Exact freeze required |
| --- | --- |
| M402-CMD-A | Preflight/Red/Green callers, new API/admission test paths and existing regressions, strict command, expected initial capability absence versus behavioral failure, flags, runtime and timeout; controlled loopback ownership where used. |
| M402-CMD-B | Browser harness callback/entry wiring, focused UI suite, pinned build/browser identity, synthetic proposal/guidance provenance, deterministic fixtures, environment, viewport/deadline and accessibility/keyboard/focus checks; no actual scan, retrieval or generation. |
| M402-CMD-INTEGRATION | Exact synthetic seed through existing valid aggregate boundary, exclusive run root, owned service/listener, built UI/driver, one finite set of actions/readbacks, no production backdoor and no retained owner root. Seeded controlled input is labeled synthetic at every evidence boundary. |
| M402-CMD-VISUAL | Reuse existing harness/app build for the bounded samples below; exact browser/tab/process owner, viewport and genuine browser zoom mechanism, permitted screenshot paths and source identity. A screenshot/DOM assertion alone cannot prove native zoom or contrast. |
| M402-CMD-REGRESSION | Current complete README inventory plus every new accepted suite, flags/order/maximum durations, strict/build callers and known build/browser/scanner scratch effects. No parallel browser suite or running application service. |
| M402-CMD-PREPARE / CLEANUP | Exact absolute scratch and generated paths, safe empty/absent preparation, ancestor/reparse/alias checks, exclusive creation, permitted files/build effects, owned service/driver shutdown before cleanup, evidence preservation, exact removals and final state checks. Unexpected contents stop cleanup. |
| M402-CMD-GUARD / DOCS | Current guard and terminal-receipt callers, packet digest/path sets/protected tests/authority files/attempt lineage; primary-only metadata maintenance between leases; documentation links/anchors, UTF-8/newline/whitespace, command parsing, suite inventory, frozen-input checks and `git diff --check`. |

Use the maintained preparation for scoped environment restoration and pinned Node/browser assets; do not install packages or models to fix a missing prerequisite without an explicit bounded preparation decision and authority. Test helpers must preserve original failures and exact-root context if secondary cleanup fails, incorporating M4-01's corrected cleanup contract. Add no new harness framework, shell wrapper system or telemetry to administer this task.

## Validation and Acceptance

The cumulative packet below is pending runtime evidence. G reviewers check contract completeness and honest pending status; A/B reviewers accept applicable runtime/visual rows, and the different C reviewer checks the full set. For each record exact input/state, command/build/environment identity, expected/actual result and owner under stable acceptance IDs.

| ID | Trigger and expected result | Proof owner |
| --- | --- | --- |
| I1 | Current task and protected-input check: only M4-02, unchanged M4-01 semantics/evaluation/generation bindings; no actual owner proposal/capacity/quality claim. | Primary, G/C reviewers |
| I2 | Malformed, unknown-key, invalid UTF-8, oversized, aborted and duplicate transport events: bounded refusal, no unintended dispatch; valid complete maximum-sized edited input fits the frozen finite limit. Review calls only the existing service method. | A tests, A reviewer |
| I3 | Wrong run/Finding/provider, sibling/original mutation, substituted action/edit/note/judgment, malformed decision time or forged success: client admission refuses without publishing false success. Accept only the captured request's valid selected final transition. | A tests, A reviewer |
| I4 | Absent/false support confirmation, unresolved/contradictory acceptance judgment, N/A without reason, blank/oversized fields or invalid references: accessible errors, no false acceptance. Rejection needs no success assertion; editing relevant content requires renewed support confirmation. | B tests, B reviewer |
| I5 | Each final action: original remains inspectable and distinct; only edit-and-accept supplies the complete accepted reviewer proposal; reject accepts no plan. Decision action/time/judgment/note and post-change reminder are visible, not color-only; no reminder-completion gate. | B tests and visual evidence, B reviewer |
| I6 | Pending, repeated activation, sibling selection, changed run, callback reflection/reentrancy, unmount and late response: only the captured operation may publish, no duplicate final request, draft/confirmation never leaks to another Finding; selected list focus and sibling state remain intact. | A/B tests, B reviewer |
| I7 | Definite refusal versus response lost after possible commit, local timeout or malformed response: truthful distinct error/unknown state, no optimistic save or automatic retry. Exact G recovery/retained-admission behavior applies; cleanup is never inferred from browser abort. | A/B tests, A/B reviewers |
| I8 | Native controls, all three actions and validation states: automated axe, keyboard, accessible names/relationships, logical order, shared announcements and focus preservation pass. List/selection remains complete; saved review supersedes cached pending labels without inventing a new provider invocation. | B browser tests, B reviewer |
| I9 | Bounded desktop/narrow/native-zoom samples: complete original/edit/decision text, citations, reason/note, readable controls, non-color source labels and visible focus; no clipped required content or unintended horizontal page scroll. No manual screen-reader speech claim. | Primary/worker browser evidence, B/C reviewers |
| I10 | Synthetic actual browser-to-service-to-disk proof, relevant fixture/mock audit, compliant leases, actual diff/cohesion, current full suite, strict/build, exact cleanup and documentation closure pass. M4-03 real-proposal review and M3-03 capacity remain independent. | Primary, C reviewer |

### Bounded visual and interaction samples

Use one installed supported browser, not a browser/assistive-technology matrix. Planning targets are desktop 1366×900 and narrow 390×844 CSS-pixel viewports, plus actual 200% browser zoom on the desktop review path; G binds the runnable mechanism and exact sample identity before execution. These are task evidence samples, not a support claim. Do not equate resized viewport, device scale factor or CSS zoom with native browser zoom.

Automated cases cover pending proposal, missing confirmation, invalid N/A reason, invalid complete edit/reference, submission pending, definite refusal, unknown save and each final decision; use both Local/Groq provenance and all applicable review profiles without crossing every visual/state combination. Negative cases preserve abstention, failed/invalid generation and ScannerReviewObservation as non-reviewable. Existing parent `running`/`failed`, complete-zero and scan-only states remain unchanged regression cases, not new UI designs.

Manual visual review follows one controlled selected-proposal path through original inspection, edit form, inline error and saved edited decision; sample approve/reject labels in automated checks. At narrow width and genuine 200% zoom inspect long valid content, references, note/reason, visible focus and reflow. Reuse screenshots only when they materially support the review. Record source/build/browser/viewport/zoom/fixture/interaction identity and observed result. No current visual result is claimed by this plan; M2-03's separately deferred full-guidance/detail zoom item remains with M6-03, not silently closed by this bounded review sample.

## Idempotence and Recovery

Planning checks are repeatable and read-only apart from this documentation change. Before future effects, inspect Git/lease state, expected path identities and remaining allowance. A worker stop returns to primary triage; do not reopen a closed lease, hide a failure, reset a budget or overwrite unrelated changes.

The server permits only one final review. Local timeout, connection loss or abort does not imply the server did not commit. Follow G's frozen unknown-outcome behavior; preserve prior validated evidence and never resubmit automatically. A canonical validated read, if included in G, is limited to the captured run/operation and does not introduce run history or a recovery subsystem. Invalid input can be corrected only where service outcome/admission establishes that doing so cannot duplicate an unknown final decision.

Clean only exact, verified, task-owned test paths after owned listeners/browser contexts/drivers close; keep evidence needed to diagnose a failure before removing disposable artifacts. Report uncertain cleanup and the exact retained root. Never delete owner runs, stop unrelated applications/Ollama, reset Git, broaden recursive targets, or install prerequisites as routine recovery. If native zoom or another required browser mechanism is unavailable, report the missing evidence and preserve task status; do not fabricate a pass or silently defer an Accepted check.

## Artifacts and Notes

M402-ENTRY-01 owns planning evidence. Future acceptance records M402-G-ACCEPT-01, M402-A-ACCEPT-01, M402-B-ACCEPT-01 and M402-FINAL-01 are created only when their evidence exists. Keep commands, relevant-tree/environment identities, protected-input checks, accepted tests, terminal leases and decisive review/visual outcomes in this living plan; no new ledger or raw reviewer transcripts. Private retained-run contents, credentials and ignored operational material are not copied into tracked documentation.

Planning documentation impact is five paths: this plan, roadmap activation, plan index, progress index and one M4-02 progress record. No implementation, requirement or ADR change is needed to create it. Execution reconciles the actual affected UI/API/developer documentation at C.

### M402-PLAN-01 — Accepted planning readiness

On 2026-09-14 15:37 UTC, the primary accepted the fresh read-only `critical_reviewer` verdict **PASS** for planning readiness, with no Blocker, Major or Minor findings. The review covered the full five-path activation, selected authorities, existing M4-01 literals, future R3/S3 boundaries, I1–I10, frontend-quality reuse/ownership, native browser/focus proof, command gating, unknown-save integrity and scope/closure honesty. The reviewer directly inspected current transport/service/validator/UI seams, confirmed HEAD/dirty paths and no active lease, and ran `git diff --check`; it reused the primary's fresh strict/92-test evidence rather than repeating it. No browser, provider, retained-run inspection or write occurred in review.

The reviewed plan SHA-256 was `28e9bb1002246e33f88f4f2d5853702d2560f7656783d83fe01a8a660d8fcacc`, independently checked by the primary before this living-record update. Subsequent changes record the verdict, frozen-reference check and current-state/progress reconciliation only; no binding contract or command changed. Primary checks cover five documents, local links/anchors, one parseable PowerShell block, sixteen required plan sections, strict UTF-8/no BOM, final newline/trailing whitespace, frozen references and `git diff --check`. Only the five planned documentation paths are changed and no active lease exists.

This accepts readiness to enter G after execution authorization, not G literals, worker packets, UI implementation or browser behavior. No planning correction loop was consumed. M4-02 remains In progress; M3-03 remains Blocked and M4-03 Not started.

## Interfaces and Dependencies

Use current React/TypeScript, native controls, existing CSS, pinned build/browser/axe tests, the application-owned same-origin service and M4-01's accepted review validator/outcome. New task-local interfaces are a bounded review HTTP handler, browser request-correlated admission, minimal callback/request coordinator, form/editor and immutable decision view. Exact transport/error/deadline and UI literals remain G-owned until frozen.

Browser code has no direct filesystem, provider, process or credential authority. Service owns durable decisions. The UI owns only transient drafts and faithful presentation. M4-03 consumes the completed review interaction; this task neither selects it nor makes a real-human-review or capacity claim.

## Revision Note

2026-09-14: created for the owner's M4-02 current-state review and planning request after M4-01 completion. The frontend-quality skill shaped the granular reuse audit, named visual owners and bounded native-browser evidence. Recorded two delegated TDD slices, a future R3 transport/admission gate, current fixed review semantics and strict separation from actual-proposal review, capacity and evaluation. No implementation or browser review action occurred.

2026-09-14 15:37 UTC: recorded independent planning readiness PASS with no findings, fresh frozen-reference checks and documentation closure; reconciled current state and progress without changing contract, commands or execution authority.
