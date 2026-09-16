# Start an intentional later scan

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M5-01](../DEVELOPMENT_ROADMAP.md#m5-01--start-an-intentional-later-scan), selected for current-state review and planning only. Implementation, browser execution, run creation and external calls are not authorized by this planning request.
- **Latest evidence:** [M501-PLAN-01](#m501-plan-01--accepted-planning-readiness): independent critical planning PASS with no findings and five-document checks. M4-03 and M3-03 are Complete; no prerequisite task is Blocked.
- **Active lease:** None. Future research and implementation budgets are unused; see [workflow and budgets](#plan-of-work).
- **Next:** await owner execution authorization, then enter [G](#g--freeze-rescan-literals-and-command-effects), sequential A–D and integrated E. Bind [commands](#concrete-steps), [invariants](#validation-and-acceptance) and [recovery](#idempotence-and-recovery) before effects. No M5-02 comparison work is selected.

## Progress

- [x] (2026-09-16 15:23Z) Review roadmap-wide status, prerequisite closures, selected requirements, frontend reuse and backend seams. Independent strict TypeScript and 73 run-contract tests pass; frozen inputs unchanged, M501-ENTRY-01.
- [x] (2026-09-16 15:35Z) Accept independent critical planning PASS without findings and five-document validation; M501-PLAN-01. No implementation or target operation occurred.
- [ ] On execution authorization, accept G's complete literal/command contract through its required R3 route.
- [ ] A: implement and verify independent linked-run creation through the application service/API.
- [ ] B: implement and verify the scoped transient scanner handoff without comparison.
- [ ] C: implement and verify request-correlated client rescan admission.
- [ ] D: implement and verify the accessible intentional-rescan interaction.
- [ ] E: accept integrated real-browser/service/disk proof, full verification, different fresh final review and documentation closure; only then Complete/archive.

## Surprises & Discoveries

- The previous capacity blocker has closed. [M3-03 final acceptance](completed/m3-03-qwen-adapter-and-capacity-screen.md#m303-final-02--integrated-review-and-task-closure) records the sole full-stack observation and fresh strict/712-test verification. This is exact-configuration capacity evidence, not general model quality or support.
- `RunContext` has no `baselineRunId`; `readRun` and `tests/run-contract.test.ts` explicitly reject it. Three field-by-field preservation checks also need the new provenance: terminal scan identity, repository parent transition and selected-Finding transition. Merely adding an optional type would not preserve it.
- The scanner already validates/counts four native buckets, but captures DOM facts only for violations/incomplete and discards pass nodes after coverage validation. M5-01 needs a bounded pre-discard handoff, not a persisted positive-results collection.
- Rescan eligibility is independent of a Finding's downstream state. Existing proposal/retrieval eligibility checks must not be reused as rescan gates; the genuine shared operation lock and uncertain-save safety remain applicable.
- [REQ-A11Y-006](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#200-zoom-verification-deferral--2026-09-15-utc) now defers every 200% zoom test until after MVP. Desktop/narrow, automated keyboard/focus/announcement and visual evidence remain required.

## Decision Log

- Decision: select only M5-01 planning after Complete M4-03. Rationale: the owner's exact request selects this dependency-ready task, not all M5. Date/author: 2026-09-16 / primary.
- Decision: reuse the existing scanner, repository and service reservation; add only task-owned provenance, admission and transient handoff. Rationale: no queue, cache, alternate writer or comparison engine is necessary to start one independent scan. Exact literals remain G decisions. Date/author: 2026-09-16 / primary.
- Decision: use controlled real-browser integration and existing frozen fixtures for this task's default proof. Rationale: M5-01 needs scanner/service/disk fidelity, not another actual public-page or model evaluation. New public targets or retained-run mutations need separate explicit authority. Date/author: 2026-09-16 / primary.

## Outcomes & Retrospective

Planning is complete with independent critical readiness PASS and documentation checks; no rescan is implemented. The frontend-quality skill supplies the reuse audit and bounded visual contract below. The existing scanner-to-review workflow and capacity closure are preserved. Remaining consequential implementation literals belong to G; passing planning checks does not accept them or establish runtime behavior.

## Purpose / Big Picture

From a Finding in the current completed Results view, the operator explicitly chooses a mode for a later scan of the same trusted page. The application creates a distinct run with `baselineRunId`, performs the complete provider-independent three-rule scan, and shows truthful new results or failure while preserving the baseline. The scanner makes selected-rule native non-failing candidates available only within the current operation for the later M5-02 consumer. M5-01 never matches a target, constructs a canonical positive observation or reports a comparison outcome.

## Context and Orientation

The [authority map and task router](../README.md#authority-and-status-map), [project requirement semantics](../PROJECT_REQUIREMENTS.md) and [roadmap authority-location key](../DEVELOPMENT_ROADMAP.md#authority-location-key) control interpretation. At entry all twenty RD/M1–M4 tasks are Complete; eight M5/M6 tasks are Not started. M5-01 planning makes the split twenty Complete, one In progress and seven Not started.

| Controlling source | Selected obligation and task boundary |
| --- | --- |
| [Evidence and review workflow](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md), REQ-SCAN-005, REQ-EVID-008/010/011 | Minimize before persistence; keep all violation/incomplete records; locator is evidence, not identity; one versioned aggregate with optional baseline reference, no raw archives. Existing REQ-SCAN-006/007 coverage and source-preservation behavior remains unchanged. |
| [Rescan and comparison](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison), REQ-COMP-004/006/007/008 | Any retained baseline Finding, no downstream prerequisite; preserve both source scans and original/human work. Pair gate, correlation, positive-observation construction and outcomes are M5-02/M5-03, not this task. |
| [ADR-0009](../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | Existing pinned exact-three-rule scanner and one safe-written aggregate. Native material is transient; baseline linkage is not retry lineage. Scanner remains accepted for evaluation, not release-qualified. |
| [Lifecycle: repeated analysis](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#repeated-analysis-provider-change-and-rescan), [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) | Independent run/mode, same trusted developer-supplied page, fresh context, no hidden provider activity, no resume. Validated service reads are retained; user-facing run reopening remains Deferred through OD-026. |
| [SPEC-006 and SPEC-007](../specs/SPEC.feature) | Preserve source evidence, independent identifier and optional baseline linkage; never imply that later comparison examples already work. BHV-06/07 are derived through the evaluation authority. |
| [Application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md), REQ-A11Y-001/002/004/010 with 003/006/009 as applicable | Keyboard-operable explicit action, meaningful semantic status, selection/focus preservation, readable desktop/narrow controls and bounded visual proof. No 200% test or speech/support matrix. |
| [UI presentation](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md), [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) | Keep complete results and source distinctions. Add only rescan controls/status and minimum current-workflow coordination, not a new layout or history browser. |
| [Evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), REQ-EVAL-004/005 | Preserve six fixture revisions and prior results; bind changed capture behavior to new verification. Material profile/input changes require their authoritative version/evidence route, never an edited historical result. |

Applicable Must semantics are Accepted and the explicit deferrals remain outside MVP. Ordinary endpoint, record and interaction literals may be resolved within this task; a significant architecture change or authority conflict requires owner direction before dependent work.

### Current implementation

`src/server/service.ts::runScan` reserves the operation, prepares/creates the running run, invokes its executor, validates terminal identity and finishes publication. `local-service/input-validation.ts` accepts only ordinary scan input; `loopback-api.ts` has POST `/api/runs`, but no rescan route. The repository already supports independent create/read/finish; do not add a second writer merely for rescan.

`src/server/scan/native-scan-capture.ts`, `normalize-scan.ts` and `scan-page.ts` own native capture, minimization and execution/cleanup. `src/server/scan/normalization/native-rule-evidence.ts::projectNativeNode` is the existing allowlisted projection boundary. Actual-node capture, report URL/time correlation, all-node collection and cleanup/deadline rejection are existing invariants, not optional rescan conveniences.

`src/client/App.tsx` coordinates one current run/selection and shared announcements. `AnalyzeForm.tsx` owns fresh mode input. `ResultsSection.tsx` and `ResultDetail.tsx` own complete results and selected evidence. Existing `run-admission.ts::admit` validates ordinary Analyze envelopes but does not bind a rescan result to its requested baseline. `main.tsx` owns same-origin transport composition. No current rescan control, request or admission exists.

## Scope and Non-Goals

Include independent later-run identity, immutable baseline reference, explicit fresh mode selection, service-owned baseline/Finding validation, source preservation, complete scanning, transient selected-rule candidate access, request-correlated browser admission, accessible rescan controls and real controlled integration.

Exclude all target matching, comparability classification, canonical positive observations, comparison results/persistence/UI, source-page remediation, page-level success claims, general pass/inapplicable storage, raw HTTP candidate payloads, caches/registries/queues, retry/resume, automatic provider switching, model operations/probes/acquisition, new dependencies, evaluation-manifest rewrites, user-facing retained-run loading/history and later roadmap tasks. Missing/withheld/ambiguous locators do not prohibit starting this scan; M5-02 owns their comparison meaning.

## Plan of Work

Use the [agent workflow](../../.codex/README.md), [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) and [write guard](../../.codex/write-lease-guard.md). The primary owns authority, G's authoritative writes, assignment packets, integration, evidence acceptance, status and documentation. Research/review are read-only. Each implementation slice has a separate persistent `test_worker` and implementation owner, sequential preflight/Red/Green/optional Refactor and a fresh review. Primary documentation occurs between terminally closed leases; one active lease per worktree. No ordinary primary production edits.

Per unchanged writer role/phase chain: one preflight, initial write, one ordinary correction and at most one conditional final correction under the workflow's learning/new-evidence requirement; one review correction loop. Two repeated decisive gaps without material new evidence, two no-diff handoffs, exhausted budget or changed binding fields require primary triage. Agents and IDs never reset allowances. Expected missing behavior still requires preflight; existing-covered work reuses evidence, existing-uncovered behavior uses passing characterization, and no fake Red is allowed. The narrow first-module exception applies only when its exact missing export/environment/complete behavioral-test conditions are frozen.

The smallest proof uses current native fixture tests, repository/service tests and the existing built-client browser pattern. No standalone evaluation runner or evidence framework is planned. Freeze only missing tests/helper capability; prefer direct existing callers. No actual public scan, original-run write or model operation is part of default verification. Owned controlled fixtures and disposable roots remain isolated, with exact cleanup.

### G — Freeze rescan literals and command effects

**M501-G; R3; TDD: Not applicable.** Replacement evidence is authority/source inspection, a complete primary-written literal contract and required research checkpoints. No application-source responsibility changes or worker lease.

Resolve the following before implementation preflight; unresolved decision semantics cannot be deferred to a worker as runtime proof:

- Exact rescan input/service method/HTTP route and closed response/errors. Bind baseline run and selected Finding, with explicit new mode; derive page/rule from the validated retained baseline instead of trusting client-supplied copies. Resolve requested-versus-observed-final page choice against the lifecycle and trusted-input authority. The response must identify the newly created run without mutating or returning a substituted baseline as success.
- Optional `baselineRunId` shape, self-reference/invalid-ID rejection, historical run compatibility and immutable propagation through creation, completion, failure and every existing nested update. Cross-record existence/selection validation belongs in the service, not filesystem reads from the pure validator. Do not add a format migration unless a demonstrated compatibility conflict requires it.
- Single-operation reservation before asynchronous baseline admission; rejection of missing/malformed/noncompleted baseline or nonexistent Finding without navigation/new run; preserve baseline on every later failure. Distinguish an actual active/uncertain operation from a historical downstream Finding state, which is not an eligibility gate.
- Minimal transient candidate contract for only the selected baseline rule, sourced from actual native nodes before their references are removed. Resolve which native non-failing categories can supply candidates and what structural/provenance validation is necessary, without implementing semantic matching. Preserve all duplicate candidates and unavailable-locator reasons; do not select a winner, assign Finding IDs or let pass nodes enter violation collections.
- Explicit operation-local ownership/lifetime and future consumer boundary. Candidates become usable only with complete valid scan context and successful required cleanup; error/timeout/abort cannot expose usable comparison inputs. They never cross aggregate, HTTP, client, diagnostics or durable-evidence boundaries. A narrow scoped consumer or operation-local return is a candidate, not an accepted cache API. Until M5-02, production discards them when the operation ends; tests may inspect the handoff. There is no fake comparator/no-op success result or future recovery promise.
- Minimal client intent/admission, deadline and unknown-outcome handling. Capture baseline/Finding/new mode at submission, refuse stale/wrong-run/wrong-mode/wrong-baseline replies, preserve the baseline while pending or failed, and do not auto-retry or claim the service cancelled after a lost reply.
- Exact visible action placement, fresh mode control, pending/failure/completion semantics and focus/return behavior. Preserve only the current workflow's necessary baseline/selection context; no history list, deep link, reload restoration or saved-run chooser follows. Existing shared locks, including review-save uncertainty, must cover rescan without turning proposal status into a gate.
- Exact focused/full/browser commands and resource effects listed below, along with compatibility/freeze checks. Reuse installed runtime, existing fixtures and test mechanisms; resolve source-file paths before the lease.

### A — Create an independent linked run

**M501-A; standard; S3; TDD applicable.** One observable contract: a valid explicit service/API rescan request creates and publishes an independent baseline-linked run through the existing scanner lifecycle, preserving the baseline. Preflight targets `run-contract.test.ts`, `run-repository.test.ts`, `local-service.test.ts` and current API tests. `test_worker` owns the accepted test boundary; `code_worker` owns production Green. Candidate new focused test: `tests/rescan-service.test.ts`; reuse existing fixtures and safe repository sandbox.

Responsibility placement: extend `domain/run-contract/run-types.ts` and `run-validation.ts` for pure optional provenance; extend `local-service/scan-run-records.ts`, `persistence/run-repository/run-transition.ts` and `selected-finding-transition.ts` to preserve it. Reuse repository create/read/finish. A bounded new `local-service/rescan-operation.ts` owns baseline admission and rescan preparation. `service.ts` retains reservation/shutdown composition; if shared scan lifecycle needs extraction, use a purpose-owned `local-service/scan-operation.ts`, without copying it into a second path. `local-service/loopback-api.ts` dispatches to a bounded rescan request handler if substantive validation warrants separation. `main.ts`/production composition wires only the existing executor. Exact paths are frozen by G and the packet; no broad directory lease.

The dependency remains HTTP → service reservation/admission → validated repository/baseline → current scan executor → terminal identity/finish. No domain-to-filesystem, browser-to-repository or provider call edge. Permitted structural refactor is only cohesive extraction of the existing scan lifecycle required by its two immediate entry paths, with existing behavior protected.

Acceptance includes old ordinary runs, new linked running/completed/failed runs, immutable reference across all downstream transitions, mode independence, unprocessed and terminal downstream baseline Findings, missing/invalid baseline and selection, contention/reentry, duplicate creation, publication failure, shutdown and lost-response truth. S3 review accepts actual diff/cohesion, focused checks, independent strict checking and terminal leases before B.

### B — Expose only operation-local selected-rule candidates

**M501-B; standard; S3; TDD applicable.** One observable contract: the complete later scan supplies G's selected-rule transient candidates to the scoped internal boundary and discards them without changing durable collection semantics. `test_worker` owns Red in `tests/scan-normalization.test.ts`, `tests/scan-page.test.ts` and narrowly relevant helpers; separate `code_worker` implements Green.

Extend `src/server/scan/native-scan-capture.ts` to capture only the selected rule's necessary actual-reference non-failing facts, `src/server/scan/normalize-scan.ts`/`normalization/native-rule-evidence.ts` for validated bounded projection and `src/server/scan/scan-page.ts` for operation-local lifetime/cleanup. Create a purpose-named scanner candidate module only if its validation is a distinct current responsibility. Adjust A's executor/rescan wiring only to pass the selected rule and scoped result; keep ordinary scanner output and repository responsibilities unchanged. No generic callback framework, candidate registry, new endpoint or durable candidate field.

Prove ordinary scans do not retain candidates, only the selected rule is exposed on rescans, duplicates are preserved, malformed/partial/late report data cannot be usable, actual node capture does not re-query a replacement element, complete coverage is unchanged and raw material cannot escape any durable/wire/log path. Reuse all six frozen native states for affected capture fidelity; no new fixture revision or comparison policy. A test consumer observes the boundary without matching. Fresh S3 review and independent strict/focused checks gate C.

### C — Bind client requests to later-run responses

**M501-C; standard; S3; TDD applicable.** `test_worker` owns a focused `tests/rescan-admission.test.ts` and required transport witnesses; `code_worker` owns new purpose-named `src/client/rescan-admission.ts`/`rescan-request.ts` as needed. `main.tsx` remains transport composition. Existing `run-admission.ts` validation is reused where compatible; do not duplicate run validation or absorb rescan-specific request binding into unrelated review logic.

The new edge is current UI intent → same-origin rescan endpoint → exact response admission; no filesystem, credentials, raw candidates or provider access. Freeze all exact literals in G. Prove request/body/status correlation, fresh run ID, baseline identity and new mode; reject malformed/stale/mismatched replies, preserve known baseline and distinguish definite refusal from unknown publication. Prove no automatic retry/readback/cancellation claim. Focused tests, strict and fresh S3 integrity review gate D. No rendered UI change occurs in this slice.

### D — Present the intentional-rescan interaction

**M501-D; frontend-visual; S3 for shared ownership/unknown-state integration; TDD applicable.** `test_worker` owns `tests/intentional-rescan-ui.test.ts` and only necessary existing UI harness changes; `frontend_code_worker` owns Green. Primary accepts M501-UI-01 and its exact state/viewport capsule before preflight. The same critical reviewer covers behavior, cohesion and visual evidence; no second visual panel.

**M501-UI-01 reuse audit:** `ResultsSection.tsx`/`ResultDetail.tsx` EXTEND only composition to expose the selected Finding's rescan action, never for a ScannerReviewObservation. CREATE one named `IntentionalRescanForm.tsx` (exact location frozen by G) for new mode input, validation and explicit submit. `AnalyzeForm.tsx`'s native mode pattern is reusable; EXTRACT_LOCAL a shared mode control only if actual two-consumer duplication warrants it. Do not generalize unrelated form behavior. `App.tsx` EXTEND only necessary current-run/selection/reservation coordination using C's request owner; form fields and response-validation policy do not belong there. Existing Findings list, overview, native evidence, guidance, generation, review, styles and shared status region are REUSE_AS_IS except exact composition/status hooks needed by this action.

Required states: selected unprocessed Finding ready; a terminal downstream Finding also ready; no action for manual-review observations; missing new mode; in-flight rescan with baseline preserved; definite refusal/scan failure; unknown outcome with no misleading success/retry; complete nonzero and valid-zero later runs. Check active/uncertain review and competing Analyze/rescan mutations against the single-operation guard. Mode starts unselected for each new intent and cannot silently inherit baseline provider context. Do not prebuild comparison labels, score/delta views or a baseline history UI.

Automate keyboard activation, labels, validation, shared announcements, focus preservation and predictable return through the existing browser/axe harness. Freeze one desktop 1366×900 and narrow 390×844 visual path showing action, pending/error and later result; sample additional states only for a concrete risk. Observe actual visible focus; never claim screen-reader speech. All 200% testing stays Deferred. Preserve current source distinctions and non-certification language. Fresh critical visual/integration review, strict/build and accepted focused tests gate E.

### E — Integrate, verify and close

**M501-E; primary integration; TDD: Not applicable.** No application-source responsibility changes; replacement evidence is integrated execution and artifact/readback inspection. Exercise a controlled baseline scan and an explicitly selected later scan through the built UI, real service, scanner and disposable run store. Reuse existing frozen fixture interception at the test boundary; call it controlled real-scanner integration, not a fresh public-page observation. The baseline can be unprocessed; changing new mode proves no inherited provider state without invoking either provider.

Verify distinct run IDs, correct baseline reference, all three rules, real disk readback, unchanged baseline bytes, no candidate/raw material in persisted/HTTP results and no comparison output. Pair this with current negative/zero/failure tests and B's native capture proof; do not repeat a provider/state matrix. Exact proof commands and cleanup freeze in G, refined to accepted test artifacts before execution without changing their contract. Never replay M3/M4 consumed actual-call commands.

Run the complete maintained suite (entry: 32 files/712 historical tests) plus new accepted tests, independent strict TypeScript and client build. Audit actual diff and test relevance. Obtain a different fresh integrated `critical_reviewer` over I1–I10, current visual proof, complete evidence identity and cleanup. Reconcile README capabilities/commands, lifecycle and UI implementation descriptions when materially affected, roadmap, plan/progress indexes and task progress. Requirements/ADRs change only for an explicit accepted decision, not by implementation convenience. Pass the [documentation closure gate](../README.md#task-closure-documentation-gate), then mark Complete/archive and repair links. M5-02 remains unselected.

## Decision Review Contract

**M501-G; R3.** Triggers: new persisted lineage identity, source-preserving admission/concurrency/recovery, transient native-content lifetime and wire/publication correlation. Target: primary-written literals and exact command bindings in this plan. Criteria: accepted semantics, minimal compatible change, immutable baseline, complete scanner fidelity, bounded transient data, honest failure, accessible intent and existing ownership. Product behavior and technology choices are fixed by authority; G selects compatible implementation details, not new comparison architecture.

One bounded non-ranking discovery pass may identify the minimum reuse/scoped-handoff alternatives. Freeze candidate set and evidence dimensions before comparison. Budget two focused `critical_researcher` reports (lineage/service/client publication identity; native-candidate minimization/lifetime), each with at most one bounded follow-up; one mandatory `decision_analyst` plus one correction; fresh `critical_research_reviewer` pre-draft checkpoint and a different fresh final artifact reviewer. Primary drafts; no drafter or optional extra panel. One pre-draft correction and at most two final-artifact correction cycles within the recorded budget. Parallel read-only dimensions may overlap; synchronize before synthesis.

Research Assignment Capsules project this contract and I1–I10. Synthesis returns `DRAFT READY`, `RETURN FOR RESEARCH` or `OWNER DIRECTION`; DRAFT READY is not final acceptance. Freeze exact schema/API, lifetime and failure semantics now; implementation proves them later. Native test outcomes and runtime visual behavior are downstream proof, not excuses to defer identity/ownership decisions. Repeat the complete invariant packet after material revisions. Stop dependent work for exhausted allowances, repeated decisive gap twice, changed authority or an owner-controlled choice. Routine correction within remaining scope needs no extra permission; no ID resets a budget.

## Concrete Steps

Working directory: `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Dot-source the first PowerShell block in the current [README command preparation](../../README.md#development-command-preparation) in every new command session; it defines the existing runtime/environment wrapper without effects. Do not execute its dependency restore or archived acquisition commands merely to prepare a shell.

### M501-ENTRY-01 — Planning baseline

Clean HEAD `d72797e55883f58544af1c74da9f80d15e1afd75`, no active lease. On 2026-09-16 15:23 UTC, independent strict TypeScript and all 73 tests in `tests/run-contract.test.ts` passed with no failures/skips. This is fresh focused planning evidence, not a new full-suite, browser or rescan result. The latest historical closure records 712 tests across 32 files.

The M3-01 generation manifest remains `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`, all thirteen referenced file hashes pass, and the RD-003 scanner manifest remains `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`. No input/result changed. Primary reviewed authority/UI boundaries; a bounded read-only explorer identified backend seams without execution or writes.

Repeatable focused planning check after README preparation:

```powershell
git status --short
git rev-parse HEAD
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') { throw 'Resolve the active lease before proceeding' }
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Run contract checks failed' }
}
git diff --check
```

The entry commit is historical evidence, not a future hardcoded HEAD gate. At execution bind current intentional HEAD, dirty paths, relevant source/test/configuration/build hashes, environment/runtime, frozen inputs and exact commands. Committing this plan must not invalidate future leases by requiring an old parent or an uncommitted plan. Revalidate affected evidence on genuine drift.

### Future command/effect freeze

| Slot | Required exact binding before the applicable preflight/lease/effect |
| --- | --- |
| A preflight/Red/Green | Current contract/repository/service/API subsets and new rescan service cases; strict command, expected behavioral failure, fixture roots, native exit propagation and allowed/forbidden files. |
| B preflight/Red/Green | Native normalization/capture tests, all six existing fixture states, selected-rule candidate and failure witnesses, installed browser identity, scratch/environment and no raw output capture. |
| C preflight/Red/Green | Exact client request/admission cases, response fixtures, bounded local transport deadline and no-call/retry counters; no actual target operation. |
| D preflight/Red/Green | Exact UI tests/helpers, source/build identity, desktop/narrow states, keyboard/axe/announcement checks, local screenshots and ownership. |
| Integration/full regression | Maintained suite inventory plus new accepted tests, current test flags, sequential browser/service ordering, build preparation/output effects, controlled input/interception identity and validated run readback. No public network/model call. |
| Resource preparation/cleanup | Exclusive task-owned scratch/run/evidence roots, baseline before/after hashes, create-only fixtures, owned ports/processes/contexts, generated build outputs, allowed retention and exact-path cleanup with ancestor/alias checks. Never clean retained user runs, other task evidence or developer-owned Ollama. |
| Guard/documentation | Exact packet projection, protected tests, fresh lease/attempt lineage and terminal calls; command parsing, UTF-8/newline/whitespace, links/status consistency and `git diff --check`. |

Future filenames above are bounded candidates, not commands assumed to exist. G binds current callers; each packet freezes the resulting exact test/source path set before writes. A missing prerequisite or changed command/effect returns to primary reconciliation; no worker invents binding scope after review. Test-only helpers remain with test_worker; primary owns this plan, developer instructions and all authoritative/status documents.

## Validation and Acceptance

All future runtime results are pending. Bind exact fixture, command, tree/environment identity, expected versus observed outcome and review disposition for each invariant at the owning checkpoint.

| ID | Fixture/trigger and expected result | Evidence/review owner |
| --- | --- | --- |
| I1 | Authority and frozen-input check: only M5-01; M4-03 prerequisite Complete; no evaluation rewrite, later outcome or support claim. | Primary/G/E |
| I2 | Ordinary and linked running/completed/failed records: closed shape, valid non-self baseline reference, historic ordinary records readable; all parent/nested updates preserve linkage. | A tests; fresh critical A/E |
| I3 | Missing/noncompleted/malformed baseline, observation/nonexistent Finding, valid Finding in downstream states: service validates selection under reservation; accepted scan does not depend on proposal/review or locator availability. | A service/API; critical A/E |
| I4 | Distinct new run/new explicit mode, both modes under identical scan fixture: correct linkage and unchanged baseline; no inherited downstream state or model call. | A/C/D/E; critical reviewers |
| I5 | Six native fixture states, selected-rule non-failing candidates, duplicate/unavailable facts: actual-reference provenance, complete coverage, no selected target matching or canonical positive observation. | B tests; critical B/E |
| I6 | Malformed/partial/stale report, timeout and cleanup failure: no usable candidate handoff; ordinary scans have no retained candidates; no raw data in aggregate, wire, logs or provider payloads. | B negative/structural proof; critical B/E |
| I7 | Busy/reentry, creation/write/scan/shutdown failures and lost reply: baseline unchanged, last valid later record remains truthful, no automatic retry/resume or invented completion. | A/C and existing risk tests; critical A/C/E |
| I8 | Wrong baseline/run/mode/stale response and selection changes: client rejects substitution, binds submitted intent, preserves baseline and correct mutation lock without false cancellation. | C/D tests; critical C/D/E |
| I9 | Keyboard/mode/error/pending/completed/zero path: semantic explicit rescan, shared announcements, visible focus and predictable return; bounded desktop/narrow proof and no comparison UI. | D browser/visual; critical D/E |
| I10 | Built UI → real controlled scan/service → disposable disk: both runs validate, baseline bytes preserved, no comparison/candidate leakage; full current suite, strict/build, actual diff/cohesion, compliant leases and documentation closure. | Primary E; different integrated critical reviewer |

Test-worker preflight and accepted Red/characterization precede every Green. Record exact failure cause and which assertions ran, protected test identities, final lease, post-Refactor checks where applicable and test relevance. No screenshot, summary or lease receipt replaces behavioral evidence or actual diff inspection.

## Idempotence and Recovery

Read-only checks repeat safely under their evidence identity. A rescan is new explicit work, never an in-place retry; an ordinary Analyze remains unlinked. Failure must not alter the baseline, resurrect interrupted work or make a persisted running/failed record look complete. A lost reply may hide a committed later run: preserve uncertainty, use validated service-owned inspection for diagnosis and never auto-submit another run or promise user-facing recovery.

Keep candidate references within their bounded operation; release them on success, rejection, timeout and shutdown. Do not persist them to bridge M5-01 and M5-02 or after restart. Future comparison uses a future invocation while candidates are live, not a retroactive result derived from absence.

Close only task-owned browser/context/service handles before exact disposable cleanup. Resolve absolute descendants, reject linked/unexpected paths and preserve retained evidence or uncertain artifacts when removal cannot be proven safe. Report retained paths and cleanup failures; never kill unrelated processes, delete originals, use Git reset or replay consumed historical grants.

A worker stop returns to primary triage and terminal lease inspection. Reconcile changed binding fields before another assignment; invalidate affected evidence and reuse only complete matching identities. Exhausted budgets, missing owner choices or expanded architecture/target authority require a concise evidence-backed owner question after unaffected work is complete.

## Artifacts and Notes

Keep planning and future G/A/B/C/D/E acceptance evidence in this one plan, with concise manual progress checkpoints. Do not add another schema, decision ledger, telemetry record or generated report. Full target content, private runs, credentials and ignored historical material do not enter tracked fixtures or documentation.

Planning documentation impact: this plan, roadmap planning activation, plan index, progress index and one concise M5-01 progress record. No source, test, dependency, runtime, requirement or ADR change is made by planning. Future closure updates only materially affected owners.

### M501-PLAN-01 — Accepted planning readiness

On 2026-09-16 15:35 UTC, a fresh independent `critical_reviewer` returned **PASS** for readiness to enter G after execution authorization, with no Blocker, Major or Minor finding. It reviewed the complete plan, all five planning paths, controlling authorities and critical service/transition/scanner/UI seams against HEAD `d72797e55883f58544af1c74da9f80d15e1afd75`. Reviewed plan SHA-256 was `7a525a0361fab5690b110aeb8746e5423a56ae24ec348a08906431b76f2573ce`, before this living-state/verdict maintenance.

The reviewer independently confirmed no active lease, only the five intended paths changed and `git diff --check` passed. Primary accepted the actual documentation diff and verified sixteen required sections, one PowerShell command block, local Markdown paths/anchors, strict UTF-8/no BOM, final newline and trailing whitespace; final record/link maintenance receives the same checks. Fresh strict TypeScript, 73 passing contract tests and unchanged manifest/reference evidence remain in M501-ENTRY-01; the reviewer did not rerun those tests, and no new full-suite or browser proof is claimed.

Exact schema/API, candidate categories/lifetime mechanics, deadlines and interaction literals remain G obligations. M5-01 remains In progress for planning only; twenty tasks remain Complete and seven later tasks Not started. No runtime implementation, target/model call, retained-data mutation, commit or later-task selection occurred. Documentation impact is limited to the five named planning/status/navigation files.

## Interfaces and Dependencies

Retain Node/TypeScript, React, Playwright/axe, the loopback service and single-file repository at current pins. New interfaces are limited to optional immutable baseline provenance, one service/API rescan intent, its client admission/control and a scoped scanner-internal candidate handoff. Exact signatures and result/error literals are unresolved until G. Existing public scan collections and provider boundaries remain unchanged; no comparison result type is introduced here.

## Revision Note

2026-09-16: created for owner-requested M5-01 planning after M4-03 and M3-03 completion. Recorded current verification, missing rescan seams, immutable lineage and transient-only candidate gates, separate worker ownership, reuse-first UI and proportional proof. No execution or later milestone is selected.

2026-09-16: corrected scanner path references and recorded independent critical planning PASS, living-state reconciliation and five-document validation without changing future execution authority.
