# Establish the loopback service and single-file aggregate

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-02](../../DEVELOPMENT_ROADMAP.md#m1-02--establish-the-loopback-service-and-single-file-aggregate). The owner first selected it for **planning only** on 2026-08-30, then explicitly authorized exact-task execution, bounded research, guarded implementation, verification, task-owned cleanup, and documentation closure. Its roadmap status is **Complete** after verified implementation, independent reviews, cleanup and documentation closure. The earlier planning authorization did not permit implementation; the later execution instruction does, subject to the research and implementation gates below. No other task, commit, push, or publication is authorized.

## Progress

- [x] (2026-08-30 21:24Z) Reviewed the clean `a3058fa` baseline, whole-project inventory/status, M1-01 completion and actual contract, M1-02 authorities, and current agent workflow. M102-BASELINE-001 records 58 passing tests and independent strict typechecking.
- [x] (2026-08-30 21:24Z) Created the task-scoped planning contract, two sequential behavior-bearing slices, unresolved literal/command gate, and planning-only activation records.
- [x] (2026-08-30 21:33Z) Accepted fresh independent planning review PASS with no findings and completed documentation validation under M102-PLAN-REVIEW-001. This is not the future R3 literal checkpoint or implementation review.
- [x] (2026-08-30) Recorded exact M1-02 execution authorization and fresh M102-BASELINE-002: clean `207a620`, pinned runtime, 58 passing prerequisite tests, strict typecheck exit 0, no active lease or data directory.
- [x] (2026-08-30) Accepted R1 research and corrected DA1 synthesis **DRAFT READY**. The single analyst correction is exhausted. No implementation evidence is claimed.
- [x] (2026-08-30) Accepted PRE1 PASS after its one supported outline correction and authored the complete L1 contract and commands in this same plan.
- [x] (2026-08-30) Accepted different fresh FINAL1 PASS after supported correction 1 of 2; froze M102-LITERALS-001-L1 at the reviewed semantic candidate. All runtime proof remains pending.
- [x] (2026-08-30) Passed M102-IGNORE-001 before any aggregate write: exact /data/runs/ rule, representative path ignored, no tracked run data, absent data directory and active lease.
- [x] (2026-08-30) Completed M102-STORE-01: accepted missing-callable Red, separate Green, primary 113/113 combined tests and strict typecheck, fresh S3 PASS with no findings, and verified owned cleanup.
- [x] (2026-08-30) Completed M102-SERVICE-01: accepted initial Red/Green and F01 regression corrections, 69/69 tests and strict typecheck, full affected-surface S3 PASS, unchanged test/production boundaries and owned cleanup.
- [x] (2026-08-30) Passed 182/182 full-suite tests, independent strict typecheck, separate 1/1 actual demonstration, different integrated critical PASS, owned cleanup and documentation gate; marked only M1-02 Complete and archived this same plan.

## Surprises & Discoveries

- M1-01 is already Complete, not merely planned. `src/server/domain/run-contract.ts` supplies two pure validators and immutable snapshots; `tests/run-contract.test.ts` has 58 passing tests. Neither a completed snapshot nor its JSON round trip proves disk durability or scanner execution.
- Node 24.20.0, npm 11.19.0, and Python 3.12.10 are available. The earlier M1-01 runtime blocker does not apply to this baseline.
- Initial inspection found no `data/runs/` ignore rule, data directory, or tracked run. M102-IGNORE-001 subsequently established the exact rule before test writes; subsequent synthetic application-run demonstrations preserve other data and remove their exact owned run directories.
- The accepted contract permits case-sensitive run IDs and has only `unprocessed` Finding state. Filesystem name handling and collision behavior need explicit M1-02 decisions; adding later workflow fields or changing M1-01's contract is not an implicit solution.
- The source/test checkout uses CRLF while the completed plan recorded LF hashes. LF-normalized hashes match the accepted M1-01 evidence exactly; the current raw hashes are recorded below. RD-003's seven frozen artifacts retain their exact LF bytes. No line-ending policy change is needed.

## Decision Log

- Decision: Correct M102-SERVICE-F01 under the unchanged L1.5/6/8 contract.
  Rationale: Admission closure and actual stop initiation have different notification behavior; the implementation conflated them. Same-role bounded Red/Green corrections preserve every existing test, use no new seam, and require complete S3 re-review. Both service writer correction budgets are consumed.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Execute only M1-02 under workflow `M1-02-20260830-01`, preserving the planning-only history.
  Rationale: The later explicit owner instruction authorizes bounded research, guarded implementation, verification, task-owned cleanup, and documentation closure. Fresh prerequisite evidence passes; the literal gate still precedes implementation preflight.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Activate only M1-02 planning and leave implementation pending an exact-task execution request.
  Rationale: The owner requested an ExecPlan, not service implementation. M1-01 is a verified completed dependency; M1-03 and M1-04 still require separate selection.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Reuse the existing run/scan contract, pinned Node standard-library host and test harness, and strict TypeScript configuration.
  Rationale: RD-002 and M1-01 already supply these boundaries. No new dependency, framework, schema system, or package/configuration rewrite is justified.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Plan two observable slices: safe run storage, then the service that owns and exposes it.
  Rationale: Each has an independently testable outcome. Keeping shutdown, one-operation ownership, API errors, and publication ordering together avoids assertion-sized handoffs or a separate orchestration subsystem.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Leave exact persistence/lifecycle mechanics behind a future R3 gate; use S3 implementation review for both slices.
  Rationale: Publication, preservation, filesystem identity, interruption, and shutdown ordering are consequential unresolved mechanics. R3 decision review and S3 implementation review have different purposes; neither is satisfied by this planning review.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Keep `.gitignore`, developer instructions, authorities, status, and evidence documentation primary-owned between leases.
  Rationale: Ignore controls are sealed by the guard, and workers cannot edit evidence documents. An aggregate's ignored runtime output requires separately bounded side-effect inspection.
  Date/Author: 2026-08-30 / primary coordinator.

## Outcomes & Retrospective

M1-02 is Complete. The loopback service, narrow retained-run API, service-owned admission/shutdown and single-file repository are implemented. The full suite passes 182/182 tests (58 domain, 55 storage, 69 service), independent strict typechecking passes, and the separate actual entry/reopen/exact-deletion demonstration passes 1/1. Both slice S3 reviews and the different final critical review passed; owned cleanup and documentation closure passed.

The same plan preserves the planning-only activation, R3 corrections, qualified first-module Reds and M102-SERVICE-F01. The service test/code workers used their sole corrections, and its complete review correction loop passed; no budget was reset. The two new behavioral regressions caught premature shutdown notification that the initial 67 tests missed. Final review also corrected documentation mapping, stale wording and a progress-encoding defect. No unresolved finding remains.

Evidence covers pinned Windows/NTFS and one service writer, not universal power-loss durability, malicious same-user races or stalled OS calls. Console signals, clock regression and exceptional listener-close failures received source review. No scanner, UI, provider calls, downstream fields, dependency changes or other task were implemented. Data/runs is empty, no m102 temporary root or active lease remains, and no staging, commit, push or publication occurred.

## Purpose / Big Picture

M1-02 makes one developer-started service report its actual loopback address or a bounded startup failure, stop cleanly, and own the local run repository. The repository must write a complete validated aggregate before reporting it as durable, preserve earlier valid data on failure, and validate a retained run when it is reopened. Service-owned configuration must not select a run mode or contact a provider, and overlapping user operations must be refused without a queue.

A reviewer will exercise real filesystem and loopback HTTP boundaries using explicitly synthetic test data. This proves storage and service behavior, not a real scan. M1-03 owns scanning, M1-04 owns rendered UI, and M1-05 owns their end-to-end integration. The final service may expose readiness and retained-run loading before Analyze can be wired to the real scanner; it must never fabricate Findings or advertise an integrated application that does not exist.

## Context and Orientation

### Current project state and readiness

The planning baseline is commit `a3058fa153e3bc96fce361cd301d0e1e1d7b961c` on `codex/m1-02-local-service-and-aggregate`, initially clean. RD-001, RD-002, RD-003, and M1-01 are Complete. Before this activation all remaining 24 application tasks were Not started; planning then activated M1-02 alone, followed by explicit execution authorization. Its final status is Complete and the other 23 remain Not started. M1 as an observable integrated capability is not complete.

At the planning baseline, tracked implementation comprised one domain module and one test file. The execution checkout now also contains the new repository, service, entry point, two focused suites and shared synthetic helper. `package.json` pins Node 24.20.0/npm 11.19.0, Playwright 1.62.1, `@axe-core/playwright` 4.13.0, React/React DOM 19.2.8, TypeScript 7.0.2, Vite 8.0.16, and the recorded type packages. RD-002 selected `node:http`, `node:test`, and `node:assert/strict`; it did not create a server. `tsconfig.json` already includes server and test TypeScript with strict no-emit checking. `start` originally pointed to the absent `src/server/main.ts`; that entry is now implemented. `build` still awaits absent client inputs. No restore, upgrade, browser acquisition, or model setup is currently needed.

Use the [completed M1-01 literal contract](m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1) and actual [domain module](../../../src/server/domain/run-contract.ts). `validateRun(unknown)` and `validateScan(unknown)` return either a detached recursively frozen value or a closed invalid result. The aggregate has `formatVersion: 1`, immutable run identity/provenance/provider context, exactly `running`, `completed`, or `failed`, and complete minimized scan data only on completion. `initial-persistence` is the existing failure category for failure to publish the initial **complete** scan aggregate, not an arbitrary directory-creation failure. Do not change this meaning or invent missing browser observations.

The [RD-003 manifest](../../../evaluation/rd003-scan-v1.json) and six HTML fixtures are frozen evaluation inputs with accepted native observations. They are not a public scanner, a general run fixture format, or service startup prerequisites. Their readiness/browser/timeout literals must not become public service defaults by accident. Generation inputs and capacity screens remain later-task work.

### Applicable authorities

Read [AGENTS.md](../../../AGENTS.md), [the documentation router](../../README.md), [PLANS.md](../../../PLANS.md), and the exact roadmap row first. These task authorities control:

| Concern | Authority and M1-02 interpretation |
| --- | --- |
| Startup and configuration | [Installation requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md#mvp-startup-model-setup-and-deferred-packaging): REQ-INST-002/004; [ADR-0015](../../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md). Developer startup, ready/failure/clean stop, deferred AI setup, no selection or probe caused by configuration. |
| One aggregate and immutable evidence | [Evidence requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance): REQ-EVID-003/011; [minimal information model](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#accepted-minimal-information-model), its parent lifecycle and retention sections; [ADR-0021](../../architecture/decisions/ADR-0021-single-file-run-aggregate.md). One canonical file, existing stable IDs, no overwritten completed evidence or siblings. |
| Safe persistence and one operation | [Reliability requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations): roadmap REQ-QUAL-002/005/008/011–013 plus directly linked REQ-QUAL-001/010/020. Complete durable publication, read validation, preservation, local diagnostics, no orchestration platform. |
| Privacy, deletion, and privilege | [Privacy requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security): REQ-SEC-002/006/012/027, with REQ-SEC-003/007/021 for retained/test evidence. Service-owned filesystem/configuration, content-safe output, exact-directory deletion, no hosted copies, no credentials or raw content. |
| Existing mode and URL boundary | [M1-01 L1.1/L1.2](m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1), [ADR-0018 trusted input](../../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md#trusted-operator-input), and REQ-INST-004. Keep fixed Local/Groq context and normalized non-sensitive operator-chosen URLs; no new URL classifier or provider adapter. |
| Derived checks | [SPEC-007](../../specs/SPEC.feature) and [HS-006](../../specs/HARD_SPEC.feature). Apply their preservation, read-validation, minimization, and privilege clauses here; actual downstream workflows and comparison remain their owners' work. These documents are non-executable specifications, not passing tests. |
| Readiness and method | [OD-022/024/025](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md), [evaluation freeze](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), and the [agent workflow](../../../.codex/README.md). Existing Accepted scope, exact task activation, bounded worker-first TDD and risk-routed review. |

All directly applicable Must requirements have Accepted dispositions. A not-yet-selected ordinary service/persistence literal is resolved inside M1-02; a significant architecture change, weakening of a requirement, or shared M1-01 contract change instead stops for the applicable owner decision. This plan accepts none of those changes.

## Scope and Non-Goals

Include only local service startup/stop, minimal service-owned configuration separation, narrow application API/read errors, one-operation ownership, run creation/persistence/read validation, existing parent transition enforcement, immutable completed evidence, content-safe diagnostics, and an exact test-run deletion demonstration. Real filesystem writes and loopback requests are required during execution; all evaluation run inputs must be visibly synthetic and isolated from user data.

The current aggregate contains no retrieval, proposal, review, or comparison section. M1-02 must reject unauthorized changes to a completed record and demonstrate that attempted evidence/sibling mutation and failed writes preserve its earlier valid bytes. It must not add a generic patch API, placeholder nested fields, or an unvalidated extension bag to simulate future updates. Positive writes for real downstream sections belong to M2/M3/M4/M5 when those fields are selected; their tests must preserve this task's protection boundary. If the proposed storage API cannot satisfy the current roadmap Verification without changing the shared contract, stop and reconcile before worker assignment.

Run creation is service-owned and can consume an already admitted target and explicit provider context; actual raw URL admission and native scan production remain M1-03. Browser requests must not submit authoritative run aggregates, filesystem paths, executable commands, arbitrary endpoints, or credentials. Freeze the smallest integration handoff now, but expose no fake Analyze success or temporary production scanner. Test doubles exist only inside focused tests; real disk/HTTP evidence cannot be replaced by mocks.

Exclude React components, CSS, client routing/rendering, a target preview, real public navigation, browser installation, retrieval, generation, provider probes, real secrets, model configuration/setup systems, corpus preparation, comparison, release work, and other roadmap tasks. M3-04 owns the real Groq-secret mechanism before credentials are configured. No provider registry, router framework, database, lock service, transaction platform, journal, queue, cancellation/resume API, duplicate-instance manager, automatic restart, history dashboard, backup, sync, report, telemetry, or new dependency is planned. Session authentication, CSRF, DNS-rebinding qualification, formal CSP, hostile-target hardening, and exhaustive resource ceilings retain their Deferred status under REQ-SEC-027/ADR-0018. Narrow path ownership does not claim protection against malicious same-user filesystem races.

## Plan of Work

### 1. Re-establish authority, then freeze the execution contract

On an exact execution request, inspect fresh Git state, user changes, runtime identities, current authorities, and `logs/agent-flow-leases/v2/active.json`. Reuse only still-fresh evidence; do not reopen M1-01 or replay RD-003's browser bootstrap. Confirm only M1-02 is selected. Record the actual session's available roles/permissions rather than claiming an unobserved coordinator model setting.

Complete M102-LITERALS-001 below before any implementation-worker assignment. The primary writes the final ordinary literals in this plan only after the R3 research/synthesis checkpoints. No bootstrap source, production stub, test harness package, or executable diagnostic is authorized to evade the gate. A safe disposable probe, if evidence requires it, needs a separately specified path/command/effect and worker route; it is not assumed or budgeted here.

### 2. Protect the data root before storage execution

After authorization and the literal freeze, the primary adds only the exact `/data/runs/` ignore rule to the existing `.gitignore`, between leases. Verify a representative canonical run path is ignored and `git ls-files -- data/runs` is empty **before the first test or application aggregate write**. Do not untrack or delete pre-existing data automatically. This guard-control maintenance is non-behavioral, `TDD: Not applicable`; ignore matching, no tracked run data, exact diff, and the subsequent slice review replace Red. It needs no empty worker setup phase.

Test-owned disposable filesystem outputs and any retained demonstration run must have separate named roots, creation provenance, and cleanup rules in the frozen packet. Their ignored status excludes them from guard proof; independently inspect those outputs and cleanup. Do not grant a worker an ignored path as if it were a guard-verifiable source lease.

### 3. Durable repository slice — M102-STORE-01

Observable outcome: the real repository can create an independent run, publish and reopen a valid complete aggregate, reject invalid reads/writes and identity mismatches, enforce the accepted parent/immutable boundaries, and preserve prior valid bytes across failed or interrupted writes. This slice is **TDD applicable**, **S3** for data-loss, identity, and recovery risk. Authorities are REQ-EVID-003/011, REQ-QUAL-001/002/010/011/020, REQ-SEC-002/003/006, ADR-0021, the lifecycle model, and the relevant SPEC-007/HS-006 clauses.

Exact ownership in L1.9, pending the full-contract gate: `test_worker` owns `tests/run-repository.test.ts` and, only for the concrete shared synthetic records needed by both new suites, `tests/helpers/m102-run-fixture.ts`; separate `code_worker` owns only `src/server/persistence/run-repository.ts`. Existing `src/server/domain/run-contract.ts` and `tests/run-contract.test.ts` are read-only. New helpers must not import a test file that registers tests or extract/rewrite M1-01 merely for reuse. No blanket `src/` or `tests/` write scope is allowed.

The test worker performs read-only preflight against the frozen imports/callables and actual filesystem boundary. For MISSING, author one coherent set of publication/read/preservation behavioral tests, then stop at accepted Red. For a genuinely absent callable, use ADR-0024's first-module exception exactly as described below. Separate Green implements only the accepted protocol; it cannot choose semantics, weaken a test, add another format version, or edit documentation. Use real temporary files for round trip and failed-write preservation, and only the frozen narrow failure-injection seam for otherwise unreliable faults. Cover a populated multi-Finding aggregate, valid zero, incomplete observations, unavailable facts, and both existing modes without rerunning the whole M1-01 validator matrix in every case.

Accept M102-STORE-PREFLIGHT/RED/GREEN evidence only after actual diff, frozen test boundary, results, and fresh terminal lease inspection. Focused command: `npm.cmd @toolchainOptions run test:focused -- tests/run-repository.test.ts`; task boundary: independent `npm.cmd @toolchainOptions run typecheck`. Both are future commands until that test exists. Audit test relevance and obtain a fresh `critical_reviewer` verdict before the service slice advances.

### 4. Loopback service slice — M102-SERVICE-01

Observable outcome: a real Node HTTP listener reports readiness or bounded startup failure, serves only the selected application endpoints, reopens validated records through the repository, refuses overlapping work without queueing, and stops without publishing a late success or leaving its own listener/operation live. Configuration remains service-owned and neither selects a mode nor probes a provider. **TDD applicable**, **S3** for privilege, concurrency, shutdown, and publication ordering. Authorities are REQ-INST-002/004, REQ-SEC-002/012/027, REQ-QUAL-002/005/008/012/013, ADR-0015/0021, and the existing parent lifecycle.

Exact ownership in L1.9: `test_worker` owns only `tests/local-service.test.ts`, reading the accepted synthetic helper unchanged; separate `code_worker` owns only `src/server/service.ts` and `src/server/main.ts`. The accepted store, domain module, and every test/helper are forbidden to Green. A demonstrated prerequisite defect stops the slice for coordinator triage; it does not expand the lease into the earlier store slice. Keep configuration, diagnostic mapping, and the single-operation guard cohesive in the service unless a current repeated concept actually justifies another file; any path change must be reconciled before preflight, not invented under lease.

Freeze a narrow callable handoff that the future real scan can use without implementing it. Exercise service ownership and persistence with test-only inputs/collaborators; the shipped entry point has no fake scanner, arbitrary-run upload route, or development success mode. Its readiness must accurately mean service readiness, not scanner/UI/provider availability. Run-loading is an application-owned API boundary here; rendered reopen navigation belongs to M1-04/M1-05.

The complete suite must use real loopback sockets and the real repository, including occupied-address startup failure, malformed/missing/corrupt run lookup, one-operation contention, operation error, shutdown while work is pending, publication-versus-stop ordering, and repeated clean stop. Test-only fault/delay controls must not become an HTTP route or user setting. Demonstrate no provider/network/model work beyond the named loopback listener/client, no credential/configuration leakage, and no privileged static-file exposure. Do not serve the repository or `data` directory as a static root. Client asset serving, if immediately required, must be explicitly bounded in the literal contract; no UI is created here.

Accept M102-SERVICE-PREFLIGHT/RED/GREEN evidence through the same lease and actual-diff barrier. Focused command: `npm.cmd @toolchainOptions run test:focused -- tests/local-service.test.ts`; task boundary: independent typecheck plus the affected store suite when integration changes its assumptions. Obtain a fresh S3 `critical_reviewer` before final task verification.

### 5. Integrate evidence and close only this task

Run the full explicit three-file product suite once at the final candidate, independent strict typechecking, and the frozen real entry-point startup/ready/stop and exact-directory deletion demonstration. The demonstration uses only a task-created synthetic run, never a user run; prove another run and an isolated corpus sentinel are unchanged. No real corpus needs to be acquired. Any sentinel or synthetic record is test evidence, not scanner or corpus integration evidence.

Audit tests, helpers, failure doubles, skips/focus/todo markers, generated outputs, and current dependency scope. A different fresh `critical_reviewer` reviews the integrated state because critical persistence/shutdown risks remain. Reuse fresh deterministic evidence; filesystem/listener state needs a pinned isolated identity or fresh inspection. Disposition every follow-up and stop on unresolved Blocker/Major. Primary then passes the documentation gate and marks **only M1-02** Complete; archive this same file and repair links. M1-03/M1-04 remain separately selectable; M1-05 remains blocked until all three dependencies complete.

### Ownership, evidence, and budgets

Follow [Packet v2](../../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), [the guard](../../../.codex/write-lease-guard.md), and the exact role files. Create workflow ID `M1-02-20260830-01` at execution, preserving it on continuation. Each slice receives one read-only preflight, one Red or characterization, one Green with optional same-turn behavior-preserving Refactor, at most one same-contract correction per writer, and one review-correction loop. Retain each writer only within its slice. An attempt-2 lease names its terminal attempt-1 parent; respawning never resets a budget.

The primary opens every exact path lease, inserts its returned digest in the completed packet, then dispatches the worker. Stop the worker before fresh terminal close. Inspect `closed-compliant`, receipt/digest, actual changes, accepted-test hashes, commands, and side effects; the receipt alone proves neither semantics nor ignored-output containment. All tests/helpers are forbidden in Green. All documentation, `.codex/`, `.agents/`, Git metadata, dependencies/configuration, frozen evaluation inputs, and unrelated application paths are outside worker write scope. The primary edits plan/status/ignore controls only between leases. Workers never stage, commit, push, or otherwise mutate Git metadata.

Ordinary test correction stays with `test_worker`. An exceptional direct primary test correction is allowed only between leases, with reason/paths/validation recorded, prior evidence invalidated, and the revised test contract freshly accepted before Green. Every other application/test-fixture/dependency/configuration edit follows the worker route. Stop on a binding-field change, conflicting authority, unexplained overlapping change, repeated decisive failure, two no-diff write handoffs, budget exhaustion, or more than three TDD cycles in a slice. Do not invent a new slice merely to reset corrections.

No rendered UI is selected, so the frontend-quality overlay and `frontend_code_worker` do not apply. Parallel roadmap work is not authorized; only read-only assignments independent of useful primary work may overlap. There is one writer per worktree, and Red, Green, and Refactor remain sequential.

## Decision Review Contract

### M102-LITERALS-001 — publish-or-preserve service contract

**Status:** R1 complete, corrected DA1 DRAFT READY, corrected PRE1 PASS, and FINAL1 PASS and frozen L1 contract. Execution is authorized; the accepted implementation checkpoints below follow this frozen contract. This decision was **R3** because safe-write, run identity, interruption, single-operation ownership, and shutdown/publication mechanics required a consequential freeze. The target is one authored literal subsection in this plan, not another authority, schema document, decision ledger, or automatic ADR. ADR-0015/0021 and M1-01 already decide the topology and data shape. The primary may select ordinary task literals within them; a significant durable mechanism or changed contract requires the normal ADR/owner route before dependent work.

The execution comparison uses a frozen minimal candidate set without a separate discovery pass: (A) a same-directory exclusive temporary file, complete write, file flush, close, then rename publication; (B) direct canonical-file write. Compare both against the same preservation, truthful acknowledgment, existing identity/schema/privacy, pinned Windows/Node behavior, bounded shutdown/cleanup, and simplicity gates. For A, evaluate synchronous versus asynchronous publication ordering as mechanics of the same candidate, not a new subsystem. A hard-gate failure ends expansion of that candidate. No database, journal, backup copy, dependency, shared-schema change, or broader recovery guarantee may be introduced. All M102-I1–I8 remain applicable; external claims need version-relevant primary sources and runtime proof remains pending.

The execution used the frozen A/B candidate set without a separate discovery pass. R1 and DA1 compared the same gates and disqualified B; L1 selects A subject to the final R3 checkpoint and actual runtime verification. No additional candidate expansion or discovery is authorized by this history.

Use **one `critical_researcher` report** for the coupled publish-or-preserve operation boundary, with at most one targeted follow-up. It must cover filesystem identity/write/read failure and their ordering against operation ownership/stop; ordinary port/route naming is primary-owned and needs no second researcher. If that evidence cannot cover a new independent critical dimension, stop to reconcile the budget rather than silently adding a report. Use one mandatory `decision_analyst` synthesis plus at most one bounded correction. It returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. `DRAFT READY` then requires one fresh `critical_research_reviewer` pre-draft checkpoint, with at most one supported outline correction. The primary authors the complete literal contract; no drafter is needed. A **different fresh `critical_research_reviewer`** reviews that entire authored contract before worker preflight. The final-artifact ceiling is two supported correction cycles; each R3 correction rechecks the complete invariant packet. Same decisive gap twice, exhausted allowance, or new scope stops for owner direction, without resetting budgets.

Each role receives Research Assignment Capsule v1: exact task/research identity, R3 trigger, dimension/candidates, authority anchors, M102-BASELINE-001 and any newer evidence IDs, common criteria/hard gates, target output, permissions, freshness, budget, stop conditions, peer barrier, follow-up allowance, review stage, and next barrier. Reports are read-only, bounded to evidence and gaps, and cannot accept decisions or implementation. Research must use version-relevant official Node/underlying platform documentation or source for external mechanics, distinguishing facts from inference and runtime proof. No fresh web research or mechanism selection occurred during planning.

### Research barrier — M102-LITERALS-001-R1

The single `critical_researcher` returned **RESEARCH COMPLETE** on 2026-08-30. No follow-up allowance has been consumed. The primary accepted the evidence as input to mandatory synthesis, not as a frozen implementation contract. Candidate B fails the preservation gate because direct canonical writing can truncate or mix earlier valid bytes. Candidate A remains the sole eligible candidate, conditional on the complete literal contract and runtime proof. A small synchronous publication section is the supported recommendation; asynchronous rename cannot safely be raced against stop and then described as rolled back.

| Evidence | Source and decisive supported claim |
| --- | --- |
| M102-R1-E01 | Actual M1-01 source and literal contract: validators own the schema; storage must separately enforce identity/transitions. `initial-persistence` requires complete observed scan context. |
| M102-R1-E02–E05 | [Node 24.20.0 bundled Windows filesystem source](https://raw.githubusercontent.com/nodejs/node/v24.20.0/deps/uv/src/win/fs.c), [CreateFileW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew), [MoveFileExW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw), [FlushFileBuffers](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-flushfilebuffers), and [file caching](https://learn.microsoft.com/en-us/windows/win32/fileio/file-caching): exclusive creation, file flush, and replacement primitives exist, but the rename call does not request write-through. These sources do not prove post-rename OS/power-loss durability. |
| M102-R1-E06–E07 | [Node filesystem documentation](https://nodejs.org/docs/latest-v24.x/api/fs.html), [Windows naming](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file), and [reparse points](https://learn.microsoft.com/en-us/windows/win32/fileio/reparse-points): synchronous calls block JavaScript; names may alias, hard links exist, and ordinary symlink/junction checks do not qualify every filesystem filter/reparse tag. |
| M102-R1-E08–E11 | [Node 24.20.0 HTTP documentation](https://raw.githubusercontent.com/nodejs/node/v24.20.0/doc/api/http.md), [net](https://nodejs.org/docs/latest-v24.x/api/net.html), [process](https://nodejs.org/docs/latest-v24.x/api/process.html), and [timers](https://nodejs.org/docs/latest-v24.x/api/timers.html): bind the host explicitly, read port zero's actual address after listening, distinguish connection closure from collaborator settlement, and do not use Windows process-kill signals as evidence of graceful stop. Timers do not promise a hard deadline during blocked execution. |

Sources were accessed 2026-08-30; the mutable v24 documentation identified itself as 24.20.0 and must be version-rechecked on later reuse. The primary independently opened the exact bundled source and HTTP document and the version-labelled process document. Local `.NET DriveInfo` reports the workspace drive as NTFS; `Get-Volume` was unavailable through its management permission boundary and was not used as evidence. The current workspace root reports ordinary directory attributes. This is host context, not filesystem qualification.

The proposed guarantee is complete publication after staged write, file flush, close and successful rename, with process-interruption preservation to be verified on this local filesystem. Universal power-loss/OS-crash survival, arbitrary filter support, malicious same-user races, multi-instance writers, and hard interruption of stalled OS calls are unsupported. Clean stop must await admitted work and owned resources; timeout is stop failure, never cleanup proof. Interrupted running records and abandoned staging files must not be resumed, repaired, promoted, or swept. Failed staging cleanup preserves the original failure and reports separate uncertainty. All M102-I1–I8 now have passed authored-contract review but remain pending implementation proof; the later sections record the completed checkpoints.

### Synthesis barrier — M102-LITERALS-001-DA1

The initial `decision_analyst` pass returned **RETURN FOR RESEARCH**. Candidate A remains supported, but exact result types, error and cleanup matrices, filesystem name/topology checks, observation progression, failure chronology, timeout settlement, HTTP precedence, and executable verification effects were incomplete in the proposed outline. These were target semantics to resolve before drafting; no new critical research dimension or owner-controlled architecture choice was identified.

The primary issued the **single permitted analyst correction** against the cumulative outline. Proposed resolutions include closed public result unions; one failed-record publication attempt without retry; explicit cleanup uncertainty that prevents further admission; exact canonical spelling and repeated topology checks; monotonic available observations; chronology-preserving failure timestamps; identical reentrant stop promises; no writes after deadline expiry; bounded child-process cleanup; and exact synthetic-directory deletion with other-run and corpus sentinels. These were synthesis-input proposals, now transcribed into L1 after PRE1 PASS; they remain subject to final review and are not implementation evidence.

The analyst also checked the [version-exact Node 24.20.0 timer documentation](https://github.com/nodejs/node/blob/v24.20.0/doc/api/timers.md): delays above 2,147,483,647 are coerced to 1 ms. The correction therefore proposes an integer range of 1 through 2,147,483,647 for `stopTimeoutMs`. Runtime behavior remains unverified. Research follow-up allowance is unused; the analyst correction is now consumed. No preflight, source/test write, aggregate output, service process, or lease has been started.

The corrected analyst pass returned **DRAFT READY**, with no blocking outline gap or owner-controlled choice. All six slots and M102-I1–I8 were reconciled. The primary accepted this as readiness for the fresh **M102-LITERALS-001-PRE1** review recorded next, not permission for implementation preflight.

### Pre-draft barrier — M102-LITERALS-001-PRE1

The fresh `critical_research_reviewer` returned **REVISE**, with no blocker and two supported outline findings: **F01 (Major)** limits application JSON guarantees to ordinary request handling, accounting for HEAD and protocol-level connection behavior; **F02 (Minor)** gives interruption probes their own exit/termination procedure because their stdin is ignored. The reviewer independently reproduced the domain/test/manifest hashes, documentation-only worktree, absent data/lease, pinned Windows write primitives, HTTP shutdown behavior, and timer range. All M102-I1–I8 were reviewed; runtime evidence remains pending.

The primary submitted the **single permitted pre-draft correction**: HEAD returns 405 with application headers and no body; CONNECT/upgrade sockets close without an application JSON response; Node-managed protocol responses remain outside the application JSON guarantee without permitting input echo or raw-error output. Interruption probes have no readiness or stdin-stop channel: require exit 86/87 within 10 seconds, otherwise fail, terminate only the owned child, and confirm exit within 5 seconds; preserve artifacts if exit is unconfirmed. Timeout termination is not passing phase-interruption evidence. The service-child graceful-stop procedure is unchanged. The corrected PRE1 review returned **PASS**, with no remaining Blocker/Major/Minor and all eight outline invariants checked. The primary accepted it and authored L1 and the complete command/effect boundary. The outline correction allowance is exhausted; a different fresh full-contract reviewer is next.

### Full-contract barrier — M102-LITERALS-001-FINAL1

The different fresh final-artifact reviewer returned **REVISE** on the initial authored contract, SHA-256 2693d1bbb26004cd206cc88884359c7d1a991c569ff729b31783dce31824f7b2. It found no blocker and two Major semantic gaps: **F01**, an absent service-to-entry notification for internally initiated shutdown; and **F02**, ambiguity between late valid closed context and deadline-related cleanup uncertainty. It independently checked the complete artifact, source/test/manifest hashes, HEAD/index, absence of implementation/data/lease, pinned filesystem/HTTP/timer sources, and diff formatting. No prerequisite evidence was invalidated.

The primary authored **final-artifact correction 1 of 2**: passive whenStopping/whenStopped promises with explicit service versus entry-point ownership, runtime-error failure precedence and bounded listener-error tests; and validity-based late-context selection with separate closed versus rejected/malformed outcomes. The complete corrected artifact, SHA-256 5da29c13bb6d0c8f419ff9c7dd5878a6b1a5d0ff0c4d4f44327b2adc87e81965, received **PASS** with no remaining Blocker/Major/Minor and all eight invariants reviewed. The primary independently inspected the correction and accepted this freeze. One final-artifact correction was used; no budget resets. Subsequent plan edits record checkpoint/status only. Runtime proof and S3 reviews remain pending; changed binding contracts or repeated decisive gaps still stop dependent work.

### Authored literal contract — M102-LITERALS-001-L1

**Review state:** Primary-authored after PRE1 PASS, then accepted after different fresh FINAL1 PASS; frozen for M1-02 execution. This section replaces the unresolved slots. It selects candidate A's synchronous standard-library protocol within ADR-0015/0021 and the unchanged M1-01 schema. It is not implementation evidence. The final R3 checkpoint and primary ignore gate have passed; worker-first preflight and guarded writes remain separately required.

#### L1.1 — Interfaces and operational errors

The repository module is `src/server/persistence/run-repository.ts`. Derive and export these aliases from the existing `PageAnalysisRun`; do not change the domain module:

```typescript
type RunningRun = Extract<PageAnalysisRun, { status: 'running' }>;
type CompletedRun = Extract<PageAnalysisRun, { status: 'completed' }>;
type FailedRun = Extract<PageAnalysisRun, { status: 'failed' }>;
type TerminalRun = CompletedRun | FailedRun;
type StoreError =
  | 'invalid-id' | 'unsafe-path' | 'collision' | 'not-found'
  | 'invalid-run' | 'identity-mismatch' | 'invalid-transition'
  | 'read-failed' | 'write-failed';
type StoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: StoreError; cleanupFailed: boolean };
interface RunRepository {
  create(input: unknown): StoreResult<RunningRun>;
  read(runId: unknown): StoreResult<PageAnalysisRun>;
  finish(input: unknown): StoreResult<TerminalRun>;
}
function openRunRepository(rootDirectory: string): StoreResult<RunRepository>;
```

Export the result/interface types and callable. Repository methods are synchronous. Every successful record is the actual validator's detached, deeply frozen value; result wrappers need not be frozen. Operational input, filesystem, callback, and listener failures use closed result unions rather than exposing raw exceptions or rejecting public service promises. Process termination, resource exhaustion, and adversarial same-process sabotage are outside this guarantee. Shape validation reads own data properties without invoking accessors. No public error contains a path, raw input, exception text, secret, or diagnostic object.

#### L1.2 — Storage identity, topology, and transitions

Run IDs retain M1-01's exact case-sensitive grammar. Storage additionally rejects case-insensitive CON, PRN, AUX, NUL, COM1 through COM9, and LPT1 through LPT9. It never normalizes an ID into another identity. The service generates `run-` followed by a lowercase `crypto.randomUUID()`; a collision is an error, with no retry.

The supported root is an ordinary absolute local Windows volume path beginning with a drive letter and separator. Reject UNC/device paths, drive-relative paths, NUL, a colon beyond the drive prefix, reserved device components, and components ending in a dot or space. Resolve/normalize the privileged caller's root once. Dot segments may resolve within that explicitly selected root value; a browser never supplies it. Walk every ancestor with `lstatSync`, requiring an ordinary directory rather than a symbolic link/junction, and confirm `realpathSync` matches the normalized absolute path case-insensitively on this Windows boundary. Create missing components with exclusive `mkdirSync`; recheck an EEXIST result instead of overwriting. Empty root/ancestor directories created during open remain after open/listen failure; no root rollback deletion occurs.

Recheck ancestors, root, and the stored resolved root identity before every create/read/finish. After exclusively creating a run directory, recheck it. Before reading, before finish preparation, and immediately before rename, verify the exact run-directory entry spelling, ordinary contained directory, and canonical file. The only canonical filename is exact `run.json`; a Windows `RUN.JSON` alias is not accepted. Existing canonical data must be an ordinary regular file with `nlink === 1`, not a link/junction or redirected path. Finish requires the canonical file to remain present; create requires it absent, including case aliases. After exclusive staging creation, verify its descriptor is a regular single-link file and recheck the exact staged path and resolved containment before publication.

These checks support ordinary local paths. They do not qualify every Windows reparse/filter tag or defend malicious same-user filesystem races. No concurrent writer or multi-instance coordination is introduced.

Create accepts only a domain-valid running record and claims its directory exclusively. Finish accepts only a domain-valid terminal record replacing a validated running record. Preserve exact deep equality of formatVersion, runId, createdAt, applicationRevision, requestedUrl, providerContext, and every configured scan-policy field. Extract terminal context from `scan.context` for completed or `scanContext` for failed. An available finalUrl, scannedAt, or browserVersion must retain its exact value and cannot become unavailable. A missing/invalid observation may remain unavailable with either reason or become a valid value. Readiness cannot regress from true to false. Cleanup progresses from pending to closed/failed under the existing validator. No running-to-running update or replacement of any terminal record, even identical, is allowed. There are no later-action fields, extension bags, or generic patches.

| Condition | Closed repository error |
| --- | --- |
| Invalid read ID or domain-valid record with unsupported storage ID | invalid-id |
| Invalid aggregate schema; malformed, truncated, or unsupported JSON | invalid-run |
| Valid but wrong create/finish status; old terminal; common/policy/observation mutation | invalid-transition |
| Any existing case-insensitive run name during create, before inspecting its contents | collision |
| Missing root/run/canonical on read or finish | not-found |
| Requested/stored ID mismatch, run-directory case alias, canonical filename alias | identity-mismatch; never return the other record |
| Wrong type, link/junction, canonical multiple hard links, changed root identity, containment failure | unsafe-path |
| Listing or read I/O failure | read-failed |
| Root/run creation or write-phase failure; staging collision | write-failed, except run-directory collision above |

Opening an invalid/unsafe root returns unsafe-path; root establishment I/O failure returns write-failed. Before effects, validate/detach the proposed record, enforce transition/identity, and serialize it. Read always validates actual canonical JSON and compares its runId exactly. A retained running record is historical interrupted data, never resumed or repaired. Staging residue is noncanonical and is never promoted or swept at startup.

#### L1.3 — Publication, acknowledgment, and cleanup

Use the actual default `node:fs` object so focused tests can temporarily intercept its methods without a production injection API. Serialize ordinary UTF-8 JSON as `JSON.stringify(validated, null, 2) + '\n'`. Preconstruct the success result before effects. The exact protocol is:

1. Exclusively open a same-directory `run.json.tmp-<lowercase UUID>` with `wx`.
2. Write the entire Buffer with `writeSync`; each result must be an integer from 1 through the remaining byte count. Zero or invalid progress fails rather than loops.
3. Successfully `fsyncSync`, then successfully `closeSync`.
4. Recheck the required topology, then `renameSync` the staging file to the canonical path.
5. Successful rename is the application commit point. Return the prepared success result without a fallible post-commit action that could be misreported as rollback.

Never unlink the canonical file to enable replacement. Never retry publication, create a backup/journal, or infer completion from existence. Response loss or process death after commit but before acknowledgment leaves delivery unknown; reopening the validated canonical record resolves retained state, without automatic retry.

Each acquired descriptor gets one close attempt total. On failure before successful close, attempt that close once; only after a successful close may the exact owned temporary file be unlinked. A close throw means uncertain ownership: do not retry close or unlink the uncertain handle's file; leave residue and set cleanupFailed. A failure after successful close permits unlink of the exact owned temporary file; unlink failure leaves residue and sets cleanupFailed. Exclusive-open failure grants no temporary-file ownership, so a colliding file is never deleted.

After failed create, remove only its exclusively created, rechecked, now-empty run directory using `rmdirSync`. Nonempty residue or rmdir failure retains the directory and sets cleanupFailed. Replacement never removes its run directory. Root ancestors are never removed. Preserve the original failure code when cleanup also fails.

| Fault | Canonical state and cleanup outcome |
| --- | --- |
| Exclusive open, actual partial write, zero progress, flush, or pre-rename failure; cleanup succeeds | Earlier canonical bytes unchanged; no new canonical on initial create; cleanupFailed false |
| Close throws | No rename; old bytes retained; staging residue retained; cleanupFailed true |
| Owned-temp unlink fails after successful close | Old bytes retained; residue retained; cleanupFailed true |
| Initial-create empty-directory rmdir fails | No canonical; owned empty directory retained; cleanupFailed true |
| Staging name collision | Colliding file untouched; write-failed; initial owned directory remains nonempty and cleanupFailed true |
| Rename succeeds, then acknowledgment is lost | New valid canonical is committed; never describe as failed publication preserving old bytes |

The evidence-backed guarantee is complete staged writing, file flush, close, and rename, with process-interruption preservation to be verified on this host's ordinary local filesystem. It does not certify OS crash, power loss, storage failure, arbitrary filesystem filters, or hard interruption of a stalled synchronous OS call.

#### L1.4 — Service interfaces and admission

The module is `src/server/service.ts`. Export these interfaces, result types, and callable, using repository/domain types unchanged:

```typescript
type ReadResult =
  | { ok: true; run: PageAnalysisRun; interrupted: boolean }
  | { ok: false; error: 'invalid-id' | 'busy' | 'stopping' | 'not-found'
      | 'invalid-run' | 'stored-run-unavailable' | 'read-failed' };
type ScanOutcome =
  | { ok: true; run: CompletedRun }
  | { ok: false; error: 'invalid-request' | 'busy' | 'stopping'
      | 'create-failed' | 'scan-failed' | 'result-validation'
      | 'initial-persistence' | 'shutdown';
      run: FailedRun | null; persisted: boolean; cleanupFailed: boolean };
type StopResult =
  | { ok: true; status: 'stopped' }
  | { ok: false; error: 'stop-failed' };
interface LocalService {
  readonly url: string;
  readonly whenStopping: Promise<void>;
  readonly whenStopped: Promise<StopResult>;
  readRun(id: unknown): ReadResult;
  runScan(input: unknown,
    execute: (run: RunningRun, signal: AbortSignal) => Promise<unknown>
  ): Promise<ScanOutcome>;
  stop(): Promise<StopResult>;
}
type StartResult =
  | { ok: true; service: LocalService }
  | { ok: false; error: 'invalid-configuration' | 'storage-unavailable' | 'listen-failed' };
interface ServiceOptions {
  runRoot: string;
  applicationRevision: string;
  port?: number;
  stopTimeoutMs?: number;
}
function startLocalService(options: ServiceOptions): Promise<StartResult>;
```

Validate configuration before filesystem/socket effects. Reject unknown keys, accessors, and explicitly undefined optional properties. Revision is exactly 40 lowercase hexadecimal characters. Port is integer 0 through 65535, default 0; stopTimeoutMs is integer 1 through 2,147,483,647, default 5000. Bind only 127.0.0.1 and return the actual HTTP URL after listening, including port zero's assigned port. Root opening failure maps to storage-unavailable; listen failure maps to listen-failed. Configuration neither chooses a run mode nor contacts any provider.

runScan input is exactly own-data fields requestedUrl, providerContext, and scanContext, with an actual execute function. The service supplies formatVersion 1, generated runId, createdAt, applicationRevision, and running status. Initial observations must each be missing, readinessReached false, cleanup pending. All scan policy is explicit caller input under the existing validator; no scanner or provider defaults are added. The collaborator receives a detached running record and AbortSignal and returns an unknown terminal aggregate for validation. This is an internal future-scanner handoff, not a shipped fake scanner or browser aggregate-upload API.

Acquire the one-operation reservation and register its completion promise synchronously before callback invocation or the first await. Persist running before invoking the collaborator. readRun is synchronous and shares admission; health does not. Refuse overlap immediately without a queue, replacement, or disconnect-triggered release. Direct readRun precedence is stopping, busy, then ID validation. Its interrupted flag is true exactly for retained running records.

#### L1.5 — Failure records, chronology, and uncertainty

For a failed ScanOutcome, persisted means the exact returned FailedRun was committed. False after successful creation means the original valid running record remains, not that no bytes exist. run is null before successful creation; afterward it is the validated detached attempted failure record even if not retained. cleanupFailed is the OR of every attempted repository write's cleanup uncertainty and the selected failure context having cleanup failed. Persistence failure or deadline expiry alone is not cleanup failure.

Service-created createdAt is `new Date().toISOString()`. Service-authored failure finishedAt is ISO time at the maximum of Date.now(), createdAt, an available valid scannedAt, and a valid matching returned terminal finishedAt when reused. This preserves lifecycle chronology after clock movement without inventing observed facts.

| Situation | Outcome and permitted writes |
| --- | --- |
| Invalid request, busy, or stopping before admission | Corresponding error; run null, persisted false, cleanupFailed false |
| Running create fails | create-failed, run null, persisted false, repository cleanup flag; no callback |
| Callback throws/rejects | scan-failed; category scanner; original running observations, cleanup failed; no exception echo |
| Nonterminal, malformed, common/policy/observation-mutating return | result-validation; category result-validation; original context, cleanup failed; no rejected details reused |
| Valid failed terminal | scan-failed with exact validated returned category/context/record |
| Valid completed terminal commits | Success with committed CompletedRun |
| Valid completed terminal publication fails | initial-persistence; author FailedRun from its complete context and chronology rule; make one distinct failed-record finish attempt |

For each scanner/result-validation/valid-failed outcome, make exactly one finish attempt. If that attempt fails, preserve the original service error and failure category, return persisted false, and OR cleanup flags. There is no fallback after failed-record publication. The completed-publication path permits only its one distinct failed-record attempt; if both writes fail, retain the original running record. No scan, identity, storage, or provider retry occurs.

Any cleanupFailed true permanently closes service admission as stopping, retains the uncertain reservation, makes health report stopping, and prevents a clean stop even after listener closure. It does not automatically start a recovery/stop subsystem. Explicit stop still closes the owned listener. A settled ordinary failure with cleanup closed and no cleanup uncertainty may release admission even if terminal persistence failed; its retained running record is historical. Never admit replacement work over uncertain owned resources.

#### L1.6 — Shutdown and publication ordering

The service allocates two passive promises before listening: whenStopping and whenStopped. Observing either never initiates shutdown. stop is a non-async method returning the identical whenStopped promise on every repeated/reentrant call. The first call synchronously and permanently closes admission and resolves whenStopping before abort events or collaborator code can reenter it, then aborts the owned signal, calls server.close, and calls closeAllConnections. Promise observers run with normal microtask timing; late observers still receive the retained notification/result. Reject/destroy CONNECT and upgrade sockets throughout the service lifetime.

An unexpected listener error before startup has resolved successfully maps to listen-failed. After successful startup it marks shutdown as failed before invoking the same stop path. This failure takes precedence over otherwise successful listener closure, callback settlement, or persistence. An error arriving during stop but before whenStopped settles also forces stop-failed. A settled whenStopped result is immutable; later stale events cannot emit another notification or change the result. The service never owns process-global stdin, diagnostics, signals, or exit. Use the actual default node:http object so tests can intercept createServer and retain the real server for this bounded event verification, without a production fault hook.

Wait for listener closure and active collaborator settlement/terminal disposition. A listener-close error, except already closed following an earlier successful close, permanently fails stop. Clean stop requires settled work, known closed resources, no cleanup uncertainty, the required shutdown failure record committed when a run exists, and listener closure. With no active run, only listener closure and absence of prior uncertainty are required.

If stop begins before terminal commit, the eventual runScan result is shutdown, never completion. For collaborator settlement either before or after deadline, select context solely by validity: use a validated identity/policy/progression-matching terminal context, including complete context from a completed result; rejection, malformed/nonterminal return, or context mutation instead uses the original running context with cleanup failed. Author category shutdown with the chronology rule. Only settlement before deadline permits exactly one failed-record finish attempt. Failed publication or cleanup uncertainty makes stop fail. Do not insert completed scan evidence into the failed schema or make another fallback attempt.

Deadline expiry permanently resolves whenStopped to stop-failed and suppresses every subsequent repository write, including failure-record writes. runScan remains pending until its collaborator settles, then returns shutdown with the validity-based context rule and persisted false. A late valid closed context remains closed and cleanupFailed is false when no earlier repository cleanup uncertainty exists. A late valid failed-cleanup context, rejection, malformed/nonterminal return, or context mutation yields cleanupFailed true; rejected data is never reused. Earlier repository cleanup uncertainty is always ORed into the flag. Retain the reservation permanently regardless of a late closed context because the deadline abandoned timely closure proof. Observe late rejection without reopening admission or publication authority. Continue observing attempted listener closure, but never turn the failed stop into a later clean result.

A completion committed before the stop callback remains success. Synchronous publication prevents ordinary JavaScript stop callbacks from interleaving its commit section. The deadline is cooperative; a blocked OS call can delay its callback. An already admitted synchronous read completes before a JavaScript stop callback can interleave, but its HTTP response may be disconnected after preparation. Disconnect never releases an active operation or proves delivery.

#### L1.7 — Application HTTP boundary

Apply this precedence in the ordinary application request listener:

1. Non-GET method: 405, method-not-allowed.
2. Any literal query marker ? or fragment marker #: 400, invalid-request.
3. Exact /api/health: 200 with status ready or stopping, busy indicating an existing reservation, and capabilities readRuns true and scan false.
4. Closed admission: 503, stopping.
5. /api/runs/<literal ID>: readRun, without URL-decoding the ID. Empty ID or an extra slash is invalid-id.
6. Every other path: 404, not-found.

All application error bodies are exactly `{ok:false,error:<closed code>}`. Successful run read is `{ok:true,run,interrupted}`. Health is exactly `{status:'ready'|'stopping',busy:boolean,capabilities:{readRuns:true,scan:false}}`. Map invalid-id to 400, busy to 409, stopping to 503, not-found to 404, and invalid-run/read-failed/stored-run-unavailable to 500. Store unsafe-path and identity-mismatch become stored-run-unavailable. Application headers are Content-Type application/json;charset=utf-8, Cache-Control no-store, and X-Content-Type-Options nosniff. No CORS headers or cookies are added.

HEAD gets application 405 and those headers with an empty body under Node's HEAD semantics. CONNECT/upgrade socket destruction is outside the method matrix and sends no application JSON response. Node-managed protocol responses/rejections, including expectations or malformed transport, are outside the application JSON guarantee. Standard Node handling remains; no custom parser, exhaustive transport suite, or new hardening/resource policy is required. None of these exceptions authorizes input echo or raw exception diagnostics.

There is no static repository/data serving, POST Analyze, arbitrary aggregate upload, configuration, or shutdown route. Never reflect rejected inputs, query text, exceptions, environment values, or secrets. Legitimate validated non-sensitive requested/final URL provenance and minimized evidence are allowed returned record contents; privacy canaries belong to rejected/extra fields or error/environment material, not those accepted facts.

#### L1.8 — Real developer entry point

`src/server/main.ts` uses the fixed root `fileURLToPath(new URL('../../data/runs/', import.meta.url))`. Read only required A11Y_APPLICATION_REVISION (40 lowercase hex) and optional A11Y_PORT. An absent port means 0; an existing port must match `^(0|[1-9][0-9]{0,4})$` and be at most 65535, without whitespace/sign/leading zeros. No arbitrary root, AI, credential, or provider configuration is read.

Use the existing developer command, with toolchainOptions defined below:

```powershell
$env:A11Y_APPLICATION_REVISION = (git rev-parse HEAD).Trim()
npm.cmd @toolchainOptions run start
```

After successful startup, main registers observers of both passive service promises before emitting ready. The whenStopping observer detaches/closes the line reader, pauses stdin, and removes owned signal handlers exactly once at the first observable shutdown notification, preventing recursive EOF handling. The whenStopped observer alone owns the one terminal diagnostic and process exit. This also covers listener-error-initiated shutdown without another cross-module channel or process-global service behavior.

Read UTF-8 stdin lines framed by LF or CRLF. Exact stop requests shutdown; ignore every other line without echo. EOF, terminal SIGINT, and SIGBREAK invoke service.stop; these handlers do not independently print terminal diagnostics or exit. Reentrant notifications remain harmless under the shared promise contract. Windows process-kill signals do not prove this graceful path.

Emit one newline-delimited stdout JSON ready event `{event:'service-ready',url}`. Clean stop emits `{event:'service-stopped'}` to stdout and exits 0. Failed stop emits `{event:'service-stop-failed'}` to stderr and exits 1 after the failed outcome; process exit on this path is not cleanup proof. Startup failure emits only `{event:'service-startup-failed',error:<closed startup code>}` to stderr and exits 1. Invalid configuration has no filesystem/socket effects. Unexpected listener runtime error initiates stop and forces the failed-stop diagnostic without raw error text. Empty created root directories may remain after storage/listen failure. No scanner, browser, model, or provider executes at entry.

#### L1.9 — Test ownership, faults, and isolated effects

Store test ownership is exactly tests/run-repository.test.ts and tests/helpers/m102-run-fixture.ts; production ownership is only src/server/persistence/run-repository.ts. Service test ownership is only tests/local-service.test.ts, reading the accepted helper unchanged; production ownership is only src/server/service.ts and src/server/main.ts. Existing domain/tests, dependencies/configuration, documentation, and unrelated paths remain outside implementation leases. Test-created synthetic records do not import another test file that registers tests.

Use serial filesystem mock cases with concurrency false, restore each mock in finally, and intercept the actual fs object. No production fault knob is added. Allocate fresh roots using fs.mkdtempSync(path.join(repo,'temp','m102-store-')) or m102-service-. Allowed layouts inside the allocated root are:

- runs/<test-id>/run.json and owned run.json.tmp-UUID.
- cases/<case>/runs/... for independent cases.
- outside-sentinel/marker.txt and corpus/marker.txt.
- Owned junction entries under cases pointing only to owned sibling directories inside this allocated root.
- cases/<case>/hardlink-target.json for a canonical-file hard-link refusal.

Malformed/schema/identity/case-alias records exist only in these owned runs. No external user data or real corpus is acquired. Before recursive cleanup, confirm the resolved path equals the exact allocated root, its parent is repo/temp, ancestors and root remain ordinary, and the inventory has no unexpected links. Unlink only owned junction entries before recursive cleanup; never follow them to delete targets. Cleanup failure fails the test while preserving the original failure and bounded cleanup uncertainty; do not skip unsupported evidence.

Exercise every L1.3 phase with real canonical files. The partial-write fault must write a real prefix before throwing. Include zero progress; close/unlink/rmdir cleanup failure; temporary collision; initial and replacement publication; complete/zero/incomplete/unavailable-fact records and both modes; invalid JSON/version; common/policy/observed-state regression; terminal/sibling mutation; exact filename/ID aliases; reserved/path names; junction and hard-link rejection. For real Windows rename refusal, chmod only the owned existing canonical file to 0444, require failed replacement and byte preservation, then restore 0666 in finally. Inability to prove the required refusal is a failure, never a skip.

Interruption probes use:

```typescript
spawn(process.execPath,
  ['--input-type=module', '--eval', source, root, runId, phase],
  { cwd: repo, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: childEnv });
```

The test-owned source imports the actual repository, fs, and synthetic fixture helper. It intercepts only renameSync: exit 86 immediately before the real rename, or call the real rename then exit 87 immediately after. It invokes finish on a seeded running record and fixture terminal. Before-publication interruption must retain old canonical bytes and one noncanonical temporary file; after-publication interruption must retain the new valid completed canonical without a success acknowledgment. No extra executable file is created.

Probe children have no readiness or stdin-stop channel. Register exit observation before action; require expected 86/87 within 10 seconds from spawn. Timeout fails the test and kills only that exact still-owned child, then confirms exit within 5 seconds. Forced timeout termination never counts as passing phase-interruption evidence. If exit remains unconfirmed, stop dependent execution and preserve owned artifacts; do not delete with uncertain process ownership. Captured stdout/stderr are bounded to 64 KiB; overflow uses the same failed termination/confirmation route. Confirmed expected exit proceeds to state assertions and exact owned-root cleanup.

Child environment copies only existing SystemRoot, WINDIR, TEMP, and TMP; service children add only the specified revision/port. Exclude NODE_OPTIONS, NODE_PATH, provider values, and secrets. Use no shell and always windowsHide true.

#### L1.10 — Entry-point, deletion, and full evidence

The exact test name is `M102 entry-point reopen and exact deletion`. After the primary's ignore gate, create exactly two exclusive, clearly synthetic data/runs/m102-demo-<UUID> directories through repository create then finish. Allocate one fresh m102-service- temporary root containing corpus/marker.txt. Record pre-existing run-root entry names without reading their records; do not reuse or overwrite any existing name.

Spawn the real entry point with:

```typescript
spawn(process.execPath, ['src/server/main.ts'], {
  cwd: repo, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...allowedWindowsEnv, A11Y_APPLICATION_REVISION: testRevision40Hex, A11Y_PORT: '0' }
});
```

Require ready within 10 seconds, then health and the known synthetic run read within 5 seconds each using AbortSignal.timeout(5000). Write exact `stop\n` to its stdin, require stopped event and exit 0 within 10 seconds, and verify the old loopback port refuses connection. Start a second actual child with the same environment, reopen the same record, and repeat clean stop.

A readiness/request/exit failure fails the test. If its owned service child is alive, try its stdin stop once and wait 10 seconds; if still alive, kill only that child and confirm exit within 5 seconds. Register exit listeners before termination. Forced termination is failed-stop evidence. If exit cannot be confirmed, preserve artifacts and stop dependent execution. Bound captured output to 64 KiB; overflow uses that same cleanup failure route. Never kill an unrelated process or delete while child identity is unsettled.

After two clean starts/stops, verify both canonical byte strings. Remove only the first created directory using `rmSync(first,{recursive:true,force:false})`, after confirming exact data/runs parent, exact directory entry spelling, ordinary lstat/ancestors, realpath containment, expected files, and no links. Prove the second canonical bytes and corpus sentinel are unchanged and the pre-existing inventory is preserved. Apply the same exact checks to remove the second created run, then clean only the owned temporary root. Never delete data/runs, its parents, or a corpus root; an empty application run root may remain. On test failure, cleanup is limited to the created IDs after owned-child exit is confirmed.

Service tests additionally cover held callbacks, direct/HTTP read contention, disconnect without release, thrown operations, failed-record write failure, complete-publication fallback failure, shutdown before commit, committed success before stop, timeout followed by late callback with every later write suppressed, repeated/reentrant stop from synchronous callback and abort handler, timer-range rejection, occupied port, HEAD's bodyless error, CONNECT/upgrade closure, safe canaries, and absent out-of-scope capabilities. Distinguish late valid closed settlement (attempted shutdown context closed, persisted false, cleanupFailed false absent prior repository uncertainty) from late rejection/malformed settlement (original context cleanup failed, persisted false, cleanupFailed true). Both retain permanent stop failure and closed admission.

For runtime listener errors, temporarily intercept the actual http.createServer in a serial test, retain the real server, restore the method in finally, and emit one synthetic error only after successful startup. Verify passive promises do not initiate stop, notification precedes the terminal result, stop returns whenStopped identically, the error forces stop-failed, the listener closes, canary error text is absent from application output, and repeated events cannot change the terminal result. This uses a real listener and no production injection API.

One additional service-suite child verifies the entry-point observer path: spawn process.execPath with ['--input-type=module','--eval',source], the same cwd/hidden-window/stdio/environment as the real entry child. Test-only source wraps the actual http.createServer, schedules server.emit('error', new Error(syntheticCanary)) with setImmediate from its listening event, then dynamically imports the actual src/server/main.ts by file URL. It creates no aggregate or executable file; only the fixed empty run-root directories may be established. Require the ready event, one service-stop-failed event with no canary, exit 1, and closed former port within the same ready/exit deadlines. Keep stdin open so shutdown must come from the listener error. Register exit observation before action; timeout/output overflow uses the existing service-child failed cleanup procedure and never counts as passing error-stop evidence. Real files and sockets remain mandatory. Every M102-I1–I8 assertion is pending execution; filtered demonstration runs cannot substitute for the unfiltered three-file suite.

### Cumulative invariant packet

At the literal freeze, all invariants required future implementation proof. The researcher/analyst address each; both R3 reviewers review each applicable item, the named S3 slice reviewer accepts implementation evidence, and the different integrated reviewer checks their interaction. The accepted evidence is now recorded under Artifacts and Notes. Recheck the complete packet after a material revision.

| ID | Trigger / fixture | Required result and eventual evidence owner |
| --- | --- | --- |
| M102-I1 | Whole authored contract and task state | Every slot, command, path, effect, and decisive expected result is explicit; evidence, proposals and limitations stay distinct; only M1-02 is selected. Primary and both R3 checkpoints; final documentation gate. |
| M102-I2 | Real valid populated/zero/incomplete run round trip; malformed/unsupported JSON | All accepted records reopen through `validateRun`, with complete collections, context and immutable detached values; invalid data is not repaired or exposed as completed evidence. Store suite and S3 reviewer. |
| M102-I3 | Fault/interruption at each selected write phase, including near publication | Earlier valid bytes survive an unsuccessful update; initial complete publication failure cannot report parent completion; acknowledgment and ambiguous failure semantics are truthful. Real disk proof plus frozen fault controls; store and integrated reviewers. |
| M102-I4 | Run-ID collision, mismatched stored ID, invalid/aliasing path, exact synthetic run deletion | No other run, corpus, source, or external path is overwritten/read/deleted through an unintended name; no wildcard deletion, hidden copy or fabricated identity equivalence. Store tests, deletion demonstration, S3 review. |
| M102-I5 | Two overlapping requests; thrown operation; shutdown during pending write/work | At most one admitted operation, no queue/replacement, no premature release or late success, no abandoned owned listener; prior durable data stays valid. Service tests and integrated review. |
| M102-I6 | Attempted completed-evidence/common-context/sibling mutation; later-action write failure boundary | Reject forbidden mutation and retain prior completed data. No current-schema extension bag or fictional downstream result; later owners inherit protection obligations. Store/service negative tests and scope review. |
| M102-I7 | Startup/configuration/read/error paths with synthetic prohibited-content canaries | Loopback only; no direct renderer authority, secrets/raw input/exception leakage, provider call, model work, hosted diagnostics or data-root static serving. Service suite, source/diagnostic inspection, S3 review. |
| M102-I8 | Missing/corrupt record, occupied port, interrupted record/temp residue, repeated stop, rerun after cleanup | Bounded understandable failure and explicit recovery without overwriting user data, automatic resume/retry, invented cleanup success, or new system. Real filesystem/listener tests, frozen cleanup inventory, primary acceptance. |

## Concrete Steps

### Current safe inspection and prerequisite commands

Run from the repository root in PowerShell. These inspect the current contract, not future service behavior:

```powershell
git status --short --branch
git log -5 --oneline
if ((node --version) -ne 'v24.20.0') { throw 'Node 24.20.0 is required.' }
if ((npm.cmd --version) -ne '11.19.0') { throw 'npm 11.19.0 is required.' }
python --version
Test-Path -LiteralPath logs/agent-flow-leases/v2/active.json
$toolchainOptions = @('--global=false', '--prefix', (Get-Location).Path, '--cache', (Join-Path (Get-Location).Path 'temp/rd002-npm-cache'), '--ignore-scripts=true', '--audit=false', '--fund=false', '--update-notifier=false', '--logs-max=0', '--registry=https://registry.npmjs.org/', '--strict-ssl=true', '--package-lock=true', '--include=dev', '--include=optional')
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts
if ($LASTEXITCODE -ne 0) { throw 'Existing contract tests failed.' }
npm.cmd @toolchainOptions run typecheck
if ($LASTEXITCODE -ne 0) { throw 'Strict typecheck failed.' }
```

Expected at the reviewed baseline: correct pinned runtime, Python >= 3.10, absent active lease, 58 passing tests with zero skipped/todo, and strict typecheck exit 0. If the active pointer exists, stop and reconcile its exact lease rather than deleting it. A runtime/prerequisite failure is not Red. `node_modules` is currently present; restore only if a fresh execution inspection establishes the need, using the existing [locked developer instructions](../../../README.md#development-toolchain). Do not regenerate package metadata or lockfiles.

### Authored commands and effect boundaries

Run from the repository root with the exact toolchainOptions in the prerequisite block. The different fresh full-contract review has passed; execute only within the corresponding authorized worker/validation boundary. There is no bootstrap, package/lock generation, restore, build, browser acquisition, dependency upgrade, or provider/model command in this task. An unexpected prerequisite need stops for reconciliation.

| Purpose | Exact invocation | Decisive result / effect owner |
| --- | --- | --- |
| Ignore gate, before the first aggregate write | `git check-ignore -v data/runs/m102-ignore-probe/run.json`; `git ls-files -- data/runs` | First exits 0 for exact /data/runs/ rule; second returns no paths. No file created. |
| Store syntax and Red/Green | `node --check tests/helpers/m102-run-fixture.ts`; `node --check tests/run-repository.test.ts`; `npm.cmd @toolchainOptions run test:focused -- tests/run-repository.test.ts` | Syntax passes; qualified first-module Red or passing accepted behavior. L1.9 effects only. |
| Service syntax and Red/Green | `node --check tests/local-service.test.ts`; `npm.cmd @toolchainOptions run test:focused -- tests/local-service.test.ts` | Same rule; L1.9/L1.10 files, sockets and children only. |
| Production syntax after each Green | Store: `node --check src/server/persistence/run-repository.ts`. Service: `node --check src/server/service.ts`; `node --check src/server/main.ts`. | Exit 0; no service is started by syntax checking. |
| Independent strict typecheck | `npm.cmd @toolchainOptions run typecheck` | Exit 0 after each Green and at integration; no emitted JavaScript. |
| Full product suite | `npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts` | All three files execute; zero failure, skipped, todo, cancelled, or source focus markers. Isolated roots avoid cross-file contention. |
| Focused real entry-point/reopen/deletion evidence | `npm.cmd @toolchainOptions run test:focused -- --test-name-pattern='M102 entry-point reopen and exact deletion' tests/local-service.test.ts` | Exact L1.10 actual children, two owned runs, clean stops, reopen and deletion/sentinels. Filtered results do not establish whole-suite coverage. |
| Developer startup | Set revision using the exact L1.8 PowerShell command, then `npm.cmd @toolchainOptions run start`. | Real entry emits its actual loopback URL; exact stop line/EOF/SIGINT/SIGBREAK are L1.8. Automated verification uses the native child invocation in L1.10. |
| Fault and interruption evidence | Store focused/full suite above, with exact L1.3/L1.9 test-only seams and child argv/environment | Real bytes and expected 86/87 exits; timeout kills are failures, not proof. No production fault configuration. |
| Exact run removal and other cleanup | L1.9/L1.10 test-owned `rmdirSync`, exact owned-junction unlink, and `rmSync(exactOwnedPath,{recursive:true,force:false})` after the specified checks | Only created paths; compare other-run/corpus bytes and prior inventory; preserve artifacts if owned-child exit is unconfirmed. No run-root or corpus-root deletion. |
| Guard lifecycle | Existing `python -B .codex/leases/lease_guard.py start`, `verify`, `close`, and pinned `status`, with the complete Packet v2 projection | Primary supplies unique workflow/task/slice/lease/role/attempt, exact four path lists, and returned digest; requires fresh compliant closure and actual diff/effect inspection. Worker never controls guard. |

Npm effects remain within the already scoped temp/rd002-npm-cache. Guard effects remain within ignored logs/agent-flow-leases/v2. L1.9/L1.10 enumerate every test-owned filesystem/socket/child effect. The primary edits the exact ignore control between leases; ignored outputs remain outside guard proof and require separate inspection. Accepted storage and service validation created and cleaned isolated temporary records, actual listeners/children and exactly owned synthetic application runs. Final integration repeated these effects with fresh ownership and verified cleanup.

## Validation and Acceptance

Planning uses **TDD: Not applicable**: it changes only coordination/status documentation, with link/anchor resolution, required-section checks, command syntax inspection, authority consistency, unchanged implementation/frozen inputs, and `git diff --check`. One fresh `independent_reviewer` reviews planning scope/sequencing as M102-PLAN-REVIEW-001 under an R2 capsule; it does not select R3 mechanisms or certify code. Local baseline gathering is R0 primary inspection; no researcher or analyst is needed for those facts.

Execution is complete only with evidence for every M1-02 roadmap Verification clause and M102-I1–I8: verified ignored data root before writes; real startup/ready/failure/stop; narrow API and service-owned configuration; no provider call or credential/privilege leak; one-operation refusal; real durable write and revalidated reopen; no false completed publication; preserved completed evidence/siblings; content-safe local diagnostics; exact task-run deletion preserving another run and corpus boundary; and no out-of-scope feature/dependency.

For each TDD slice record exact preflight classification and source evidence. Existing covered behavior needs no write; existing uncovered behavior gets passing characterization. MISSING/REGRESSION gets Red then separate Green; PARTIAL needs a coordinator-isolated gap; CONFLICTING/UNKNOWN stops. If preflight verifies an absent agreed first module/export, independently verify the environment/runner, freeze its exact static import and callable, and write the complete behavioral suite. The precise expected missing-callable failure may then be accepted as **initial Red — missing production callable**, explicitly identifying unexecuted assertions. No stub, fallback, wrong import, syntax failure, unavailable dependency, existence-only suite, skipped or conditional assertion is valid Red. Separate Green must execute every accepted test unchanged and pass independent strict typechecking.

Evidence records include assignment/worker, path contract/digest and terminal receipt, actual changed-file/test hashes, exact command/cwd, environment and relevant-tree identity, results, side effects/cleanup, primary acceptance, and risk-routed review. Filesystem and socket evidence is non-reusable without an isolated run identity/state. Historical M1-01 lease receipts are not current no-drift proof. Any correction invalidates affected evidence; a changed literal contract returns to the R3 barrier before dependent workers continue.

Before closure, update the existing owners identified by [the documentation gate](../../README.md#task-closure-documentation-gate): README developer startup/reopen/stop and deletion instructions; roadmap; plan/progress indexes and task summary; project status statements; lifecycle and architecture implementation notes where materially affected. Requirements/ADR statuses remain unchanged unless separately authorized. Keep build/UI/scanner and later-section claims explicitly future. Run the complete suite and strict typecheck against actual final source, validate documentation/configuration and links, reconcile reviewer findings and generated output, then mark only M1-02 Complete. A reviewer PASS or a valid `run.json` alone cannot close it.

## Idempotence and Recovery

Read-only inspection and the pure contract suite are safe to repeat. Filesystem/socket tests must allocate their own isolated state, fail on unexpected pre-existing contents, and clean only paths/processes they demonstrably created. Repeated start/stop and attempted duplicate creation must have frozen, bounded outcomes. No operation may silently overwrite a retained run or treat stale `running` data as a live/resumable operation.

Preserve last valid aggregate bytes and report write/cleanup failure honestly. Never repair corrupted user data, sweep run directories, delete a corpus, kill an unrelated process, or reset the repository to pass verification. Manual deletion instructions must validate one absolute ordinary run-directory target beneath the application-owned root and explain that local deletion does not erase provider-side records.

On lease violation, unexpected overlap, failed prerequisite, or exhausted budget: stop writes, terminally close when verifiable, preserve user/peer changes and all failure evidence, and let the primary reconcile the last accepted barrier. Do not edit guard JSON, delete its live pointer, continue under a closed lease, or infer permission for broader recovery. Any resumed writer receives a fresh packet/baseline/lease. A genuine external permission blocker requires the smallest applicable approval; a denial is not permission to bypass the control.

## Artifacts and Notes

Task closure is the final state. Earlier entries preserve the evidence and pending boundaries as they stood at each accepted checkpoint.

### Task closure — M102-CLOSURE-001

Primary compared the accepted implementation, changed paths and verification matrix with the documentation authority map. Developer startup/read/stop/deletion instructions, current project status, architecture/lifecycle implementation notes, delivery readiness, roadmap, plan index and progress records now agree. Requirements, OD/ADR statuses, task dependencies/order and frozen evaluation inputs remain unchanged. Candidate documentation checks and all implementation/review/cleanup gates passed before marking only M1-02 Complete. The same plan was moved to completed/ with resolved-target link repair.

Final relocation validation passed **617 relative links/anchors across 14 changed Markdown files**, three JSON configurations, all 15 plan sections, six PowerShell example parses, UTF-8/heading checks, git diff --check and explicit whitespace checks on all seven new files including this relocated plan. Roadmap status is **five Complete and 23 Not started**, with no active task. All 27 other task blocks remain byte-equivalent as text; requirement/decision status rows and protected configuration/workflow files are unchanged. The nine pinned artifact hashes and all six exact fixture bytes still match. Only the expected three source modules, three test/helper files and relocated plan are untracked. HEAD/branch are unchanged, nothing is staged, data/runs is empty, no m102 temporary root or active lease remains, and no commit, push or publication occurred. Final documentation maintenance changed no validated implementation bytes, so accepted 182-test and strict-typecheck evidence remains applicable.

Documentation impact is required because the service and repository now exist, developer operations are runnable, and M1-02 status/evidence must be discoverable. No release or whole-milestone claim is made. No other task is selected.

### Accepted final integrated review — M102-INTEGRATED-REVIEW-01

A different fresh critical_reviewer returned **PASS**, with no remaining Blocker, Major or Minor findings, after reviewing the full integration against L1.1–10, M102-I1–I8 and M1-02 Verification. Independent execution passed **182/182** with zero failure/skip/todo/cancelled and strict typecheck exit **0**, including actual Windows rename refusal, interruption exits 86/87, F01 regressions, normal entry-child exits and exact two-run deletion. The separate primary 1/1 demonstration result was reviewed, not independently repeated as a separate command. All nine pinned artifact hashes remained unchanged; the six lease contracts, compliant receipts, correction parents and budgets reconcile.

The reviewer identified documentation-only corrections during its initial review: I1/I3 evidence mapping, stale latest revision wording, historical proof framing, and progress-record UTF-8 punctuation/duplicate Navigation. The primary corrected them and the reviewer verified resolution. No production or test change followed integration. The primary independently rechecked the candidate and accepted PASS. No unresolved finding, active lease, staged change, run entry or m102 temporary root remains. Console SIGINT/SIGBREAK delivery, clock regression and exceptional listener-close failures have source-review evidence rather than additional runtime probes. Windows/NTFS, single-writer and cooperative-OS-call limits remain explicit.

The pre-closure documentation audit covers developer operations, roadmap, current project status, architecture implementation notes, lifecycle and delivery-readiness status, plan/progress indexes and this same plan. Requirement/OD status rows, task IDs/order, ADRs, source/test contracts, dependencies, configuration and frozen inputs are unchanged. Candidate checks pass 615 relative links/anchors across 14 changed Markdown files, three JSON configurations, all 15 required plan sections, six PowerShell example parses and git diff --check. Final status/archive reconciliation is the remaining primary-owned closure action and receives fresh validation after relocation.

### Integrated verification candidate — M102-INTEGRATION-001

After both slice reviews passed, the primary ran the exact full three-file command from Concrete Steps: **182/182 pass** (58 domain, 55 storage, 69 service), zero failure/skip/todo/cancelled. Independent strict typechecking exited **0**. The separately invoked exact-name entry-point demonstration passed **1/1**. It used two fresh exclusively owned synthetic runs, started and normally stopped the actual main entry twice, reopened the first completed record through real HTTP, then deleted its exact directory while preserving the second run's bytes, an isolated corpus sentinel and prior directory names. Final cleanup removed only the remaining owned run and test root. Normal child exits and closed ports were asserted; no forced termination occurred.

The primary inspected failure controls, child ownership, deletion checks and test relevance. Tests assert observable disk/HTTP/state behavior; no skip, only, todo or conditional-success escape is present. Test doubles are confined to frozen fault/collaborator boundaries; real writes, listeners, entry children and interruption exits remain required. M1-01 source/test, evaluation manifest/fixtures, all accepted source/test/helper hashes, package/lock/compiler/build configuration and agent workflow are unchanged. The exact ignore check still passes, no run data is tracked, data/runs is empty, no m102 temporary root or active lease remains, and nothing is staged.

| Invariant / roadmap verification boundary | Accepted candidate evidence |
| --- | --- |
| M102-I1 — complete contract, task state and evidence distinction | Both R3 checkpoints accepted the explicit interfaces, commands, paths, effects and decisive outcomes before worker preflight. Only M1-02 is selected; the plan preserves failure history, evidence identities and limits. Documentation validation, final review and task closure pass. |
| M102-I2 — validated reopening | Both modes and populated/zero/incomplete/unavailable records round-trip through actual validation; corrupt/unsupported/mismatched data is refused; actual entry reopens retained completed data. |
| M102-I3 — publication, interruption and failed-write preservation | Real short writes, flush/close/rename ordering, no post-commit filesystem action, full fault matrix, real Windows read-only rename refusal and child exits 86/87 preserve truthful canonical bytes and completion outcomes. Service success follows repository success; complete-publication failure/fallback tests pass. |
| M102-I4 — identity and exact deletion | Reserved IDs, case aliases, root/run/canonical junction and hard-link rejection; two-run deletion demonstrates exact ownership and preserved corpus/sibling boundary. |
| M102-I5 — one operation and shutdown | Reentrant/overlapping requests refused; stop-before/after-commit, deadline/late-settlement, F01 passive notifications, listener errors and repeated stop pass. |
| M102-I6 — immutable evidence and siblings | Actual terminal/context/policy/sibling mutation attempts fail while prior bytes remain unchanged. Current schema permits no downstream section writes; those remain later tasks. |
| M102-I7 — privilege and safe local output | Loopback-only actual address; two service-owned environment inputs; no scan/upload/config/static route or provider/model work; canaries absent from closed diagnostics. |
| M102-I8 — bounded failure, cleanup and recovery | Occupied port/invalid startup, corrupt or absent records, inert staging residue, interrupted read labels, normal entry stops and repeatable owned cleanup pass; no repair/resume/sweep occurs. |

Candidate documentation validation passes: 547 relative links/anchors in 13 changed Markdown files, three JSON configuration files, all 15 required plan sections, six PowerShell blocks parsed without execution, and git diff --check. Current roadmap counts remain four Complete, one In progress and 23 Not started. Different fresh integrated critical review and the final documentation/status/archive reconciliation are still pending.

### Accepted service S3 correction review — M102-SERVICE-REVIEW-02

The original fresh critical_reviewer used its one correction loop to review the complete affected service surface and returned **PASS**, with no remaining Blocker, Major or Minor findings. M102-SERVICE-F01 is resolved: admission-only uncertainty retains pending notifications and host stop controls until first actual stop; notification precedes abort. Independent execution passed **69/69**, strict typechecking, three syntax checks and diff checks. Source/test reconstruction confirmed only the notification relocation and 49-line regression addition. Both correction leases have compliant receipts and correct parents; subsequent primary documentation drift is explained, with no sealed Git/index/ignore drift.

The primary rechecked actual candidate hashes, absent active lease, empty data/runs and absent m102 temporary roots, accepted the complete review and closed this slice. Clock regression and exceptional listener-close failures received source review without new seams. Both service writer corrections and the slice review correction loop are consumed. Full three-file verification, the separate real demonstration, different final critical review and task documentation gate remain required.

### Accepted service correction Green — M102-SERVICE-GREEN-02

The same code_worker used its sole correction to move stopping.resolve from admission closure to the first actual stop, before abort. Only src/server/service.ts changed; reversing those two line placements reconstructs its original accepted hash. Main, all accepted tests, helper, store and domain remain unchanged. No Refactor occurred. The worker and primary independently passed **69/69** service tests, zero failure/skip/todo/cancelled, plus independent strict typechecking; both production syntax checks pass. The two F01 regressions now prove that admission-only uncertainty retains pending notifications until explicit stop, with notification-before-abort ordering and eventual failed stop/listener closure. Existing actual entry/reopen/deletion and all owned cleanup pass; data/runs is empty, no m102 temporary roots or active lease remain.

Lease M102-SERVICE-01-green-02 freshly closed **closed-compliant**, only the allowed service modification and no forbidden/unleased/Git/ignore change. Pinned status confirmed post_close_drift false before this evidence update. Contract digest: 78438139dbdb71c87c99f29bbbade0da4ff072431f60fc1ef3438ef5b4edf203. Receipt digest: e8b8282702f446b48efcaba5cd5abfb0bbbebb66ccd2af47953bf32d9164602b. Current service SHA-256: 50a244f6c1105f30c8a14204567fd32f4d64aa532308f4163c3b37fe865b67e5. Current test SHA-256 remains 6f991b94184f8e71ecaa9bb400731cf15943b5591bba8821055310ed62f810b0. Both service writer correction budgets are consumed. The original S3 reviewer must now perform its one complete affected-surface correction review before the slice is accepted.

### Accepted service regression Red — M102-SERVICE-RED-02

The same test_worker used its sole correction to add two regressions for M102-SERVICE-F01: creation cleanup uncertainty and settled collaborator cleanup uncertainty. The original 67 tests and assertions remain byte-for-byte unchanged; removing the added 49-line block reconstructs the accepted original test hash. Both worker and primary independently executed the revised focused suite: **69 tests, 67 pass and two intended failures**, zero skipped/todo/cancelled. Each failure is the premature stopping notification while health still reports the open, admission-closed listener. Syntax and strict typechecking pass. The added assertions also require notification-before-abort ordering, identical stop promises, permanent failed stop, and eventual listener closure after explicit stop; those assertions await Green.

The primary read the complete addition, accepted this behavioral Red under unchanged L1.5/6/8, and confirmed cleanup and all original tests passed. No m102 temporary roots or run entries remain. Current test SHA-256: 6f991b94184f8e71ecaa9bb400731cf15943b5591bba8821055310ed62f810b0. Lease M102-SERVICE-01-red-02 freshly closed **closed-compliant**, only the permitted test modification, with no forbidden/unleased/Git/ignore change. Pinned status confirmed post_close_drift false before this documentation update. Contract digest: 60c6fc6b8559da6c8b32fcbcd9e1fbddada4cffd37b0135129d601d3052c0a5d. Receipt digest: 9ff9a8ffa1612ff8c4ae5286cf87afec300341c0ed3f7a446d5577b2eb75006a. The test correction budget is consumed; the same implementation worker may now receive its sole Green correction against this immutable 69-test boundary.

### Service S3 finding — M102-SERVICE-REVIEW-01

The fresh critical_reviewer returned **REVISE**, with one supported Major finding, M102-SERVICE-F01, and no other findings. service.ts closeAdmission resolves whenStopping both for actual stop and for cleanup uncertainty. The latter is only an admission-closed state under L1.5, leaving the listener open until explicit stop, whereas L1.8's host observer detaches stdin/EOF/SIGINT/SIGBREAK controls on that notification. Current uncertainty tests call stop directly and omit the notification distinction. The shipped API has no scan route; this concerns the implemented internal service/entry contract, not an externally exposed scan action.

The primary inspected and accepted this finding as a correction under the unchanged L1.5/6/8 contract. No R3, ADR, shared schema or scope change is needed. Same service test_worker receives its sole attempt-2 Red correction for the existing cleanup-failure boundary; only after accepted behavioral Red may the same code_worker receive its sole attempt-2 Green correction. The original reviewer then performs its one complete affected-surface correction review. Original 67-test success remains evidence of the earlier test boundary, not proof that F01 was absent.

Independent review repeated **67/67**, strict typechecking, three syntax checks and diff checks; all pinned source/test/prerequisite identities matched. Clock-regression chronology and exceptional listener-close errors received source review without extra seams. Both compliant lease receipts and expected later primary documentation drift were reconciled; no active lease, owned temporary roots or run entries remained. No writer or review correction budget is reset.

### Accepted service Green — M102-SERVICE-GREEN

The separate code_worker created only src/server/service.ts and src/server/main.ts. The accepted service suite passed **67/67**, zero failure/skip/todo/cancelled. An initial captured-timeout TypeScript narrowing diagnostic was corrected inside the original Green turn; final strict typechecking and both production syntax checks pass. No post-Green refactor occurred. The primary inspected both complete source files and independently reran the exact focused service suite against the final hashes: **67/67 pass**, followed by independent strict typecheck exit **0**. This fresh execution supersedes any earlier pre-correction runtime result.

The actual entry children reported readiness, clean stdin/EOF stops, validated reopen, occupied-port/invalid-configuration failures and listener-error failed stop. The exact two-run demonstration preserved the other canonical bytes, isolated corpus sentinel and prior inventory. All child exits and cleanup were confirmed, no forced termination was reported, no m102 temporary root remains, and data/runs is empty and untracked. No active lease remains. All accepted test/helper/store/domain hashes are unchanged.

Green lease M102-SERVICE-01-green-01 freshly closed **closed-compliant**, with only the two allowed creations and no forbidden/unleased/Git/ignore change. Pinned status confirmed post_close_drift false before primary evidence maintenance. Contract digest: eca1bae4b014170304b312728168d89c255b79718131d4a0ea0beda3cd28d5e8. Receipt digest: bcfe77cd4060d1972574fb444dca85324f4dfdf3b3a0b44862046eebfe78f69f. Service SHA-256: 41c4570b055ef910dbbdab8dcbd3d1a09e40aa00e1ec191470294c9b51af1249. Main SHA-256: 7e5adf97c1d230d0b2d8126a8409f0b4de6e11d525c0db23bceb0c3b2ab5fdef.

Before dispatch, one primary verify invocation was rejected for a malformed placeholder digest argument. It performed no verification or worker authorization; the subsequent exact returned digest verified successfully with no changes before dispatch. This was an input error, not a lease violation or permission bypass. S3 still must inspect clock-regression chronology and exceptional close-error behavior, together with the full admission/notification/entry-point interaction. No writer correction or review loop has been used after handoff.

### Accepted service Red — M102-SERVICE-RED

M102-SERVICE-RED-01 created only tests/local-service.test.ts, SHA-256 5855fdc31e498f2646394beae2e509d858cf5e9307ce810ce585bf745ba9453a. The primary read the complete test boundary, including real HTTP/disk behavior, failure matrices, reentrancy, passive promises, deadline/late-settlement rules, child ownership and exact deletion. Syntax exits 0. The primary independently reproduced the exact focused command: exit 1, ERR_MODULE_NOT_FOUND for the agreed src/server/service.ts, one failed file load, zero pass/skip/todo/cancelled. Final worker strict diagnostics contain only two TS2307 imports for that absent module. This is accepted **initial Red — missing production callable**; every behavioral assertion, including entry/reopen/deletion, remains unexecuted. No data/runs or m102 temporary root exists; accepted prerequisite hashes are unchanged.

Before acceptance and execution, primary boundary inspection removed two unaccepted draft controls: Date.now mutation and replacement of server.close callbacks. The frozen fs/http.createServer/event controls remain unchanged. Valid future terminal timestamps exercise chronology; S3 must additionally inspect clock-regression max-time logic and exceptional listener-close-error handling in source. Initial readonly test-construction diagnostics were corrected before final Red. No accepted test contract was invalidated and no post-handoff correction was used.

Lease M102-SERVICE-01-red-01 freshly closed **closed-compliant**, only the one allowed creation, no forbidden/unleased/Git/ignore change. Pinned status confirmed post_close_drift false before primary evidence maintenance. Contract digest: 8a0078729a24eb6f81a8c8e4df929199c8b49152bc3f534644d844cd17940320. Receipt digest: 692313cd6fcf3588e9a674e79290f7e061a0f5c74827f82e31e72ea1375e04b7. Separate Green may edit only src/server/service.ts and src/server/main.ts; all accepted tests/helpers and the store/domain are forbidden.

### Service preflight — M102-SERVICE-PREFLIGHT

The fresh service test_worker returned **MISSING**, with no lease or changes. The actual production inventory contains only the accepted domain and storage modules; package scripts provide the runner and future main entry, but no alternate listener, service admission, shutdown, or entry behavior. The agreed src/server/service.ts, src/server/main.ts, and tests/local-service.test.ts are absent. All six supplied artifact hashes, HEAD, branch and pinned runtime match; data/runs, owned m102 temporary roots, and active lease are absent. The primary independently checked actual paths and status and accepted the classification.

The runner and strict prerequisite evidence remain matched and reusable for first-module readiness. Future Red must contain the complete L1.4–10 behavior tests with the static ../src/server/service.ts import and startLocalService callable. Only the precise missing-callable failure qualifies; behavioral assertions remain unexecuted until separate Green. No production stub or test/helper rewrite is permitted.

### Accepted storage S3 review — M102-STORE-REVIEW-01

The fresh critical_reviewer returned **PASS**, with no actionable Blocker, Major, or Minor findings, after inspecting the complete storage surface, accepted tests, applicable authorities/invariants, actual worktree, and pinned lease records. Independent execution passed **55/55** storage tests, all three syntax checks, strict typechecking, and git diff --check. It repeated actual Windows rename refusal and both interruption probes; all candidate/prerequisite hashes matched before and after, and owned temporary roots, data/runs, tracked run data, and active lease were absent. Later source creation and primary documentation maintenance explain historical receipt drift; no sealed Git/index/ignore drift was found.

The primary rechecked the actual candidate hashes and owned-output state, accepted the verdict and Green evidence, and completed only this storage slice. Single-writer Windows, cooperative OS calls, and no universal power-loss or malicious-race guarantee remain explicit limitations. Service admission/shutdown and exact application-run deletion still require M102-SERVICE-01 and final integration. No storage writer correction or review-correction loop was used.

### Accepted store Green — M102-STORE-GREEN

The separate code_worker created only src/server/persistence/run-repository.ts under M102-STORE-01-green-01. After reproducing the accepted missing-module Red, initial Green and the behavior-preserving refactor each passed all 55 accepted storage tests and strict typechecking. The refactor constructs the successful result before create effects. Accepted tests and helper bytes remain unchanged; no test correction was used. Production syntax checking exits 0.

The primary inspected the complete implementation and actual worktree, then independently ran the exact combined contract/store focused command from the repository root: **113/113 pass**, zero failure/cancellation/skip/todo, followed by an independent strict typecheck exit **0**. This includes actual Windows canonical-file rename refusal and the bounded before/after-rename child exits 86/87. Each invocation created and cleaned its own isolated filesystem state. No data/runs or m102-store/service temporary root remains, and no active lease exists. Domain, prerequisite test, manifest, accepted storage test, and helper hashes remain unchanged.

The fresh Green lease closed **closed-compliant**, with only the allowed module creation and no forbidden/unleased/Git/ignore change. Pinned status confirmed post_close_drift false before primary documentation maintenance. Contract digest: 07373f55e291074b603b2654c89d2e299863a7eb2f223cb2cf71086156c26351. Receipt digest: 29416467e02a1de229c90aa0b73670a56099050fdcad2a675fab97b17328c470. Production SHA-256: 201e1310ef3390284d5ace79539e2b452399de7d9eabb317e1e795eb399f3952. This accepts Green evidence; the slice remains pending fresh S3 review and primary reconciliation.

### Accepted store Red — M102-STORE-RED

M102-STORE-RED-01 created only tests/run-repository.test.ts and tests/helpers/m102-run-fixture.ts. The primary inspected the complete behavioral boundary, actual worktree, helper validation, serial fault controls, child deadlines, and owned cleanup. Both syntax checks pass. The primary independently reproduced the exact focused command: exit 1, ERR_MODULE_NOT_FOUND for the agreed src/server/persistence/run-repository.ts, one failed test-file load, zero pass/skip/todo/cancelled. The worker's strict diagnostic reports only two TS2307 imports for that absent module. This is accepted **initial Red — missing production callable**, not passing storage behavior; all behavioral assertions remain unexecuted. No data or m102-store temporary directory exists.

The fresh lease M102-STORE-01-red-01 closed **closed-compliant**, with only the two allowed creations and no forbidden/unleased/Git/ignore change. Pinned status confirmed post_close_drift false before primary evidence maintenance. Contract digest: dd369243a4f44c7401a9f7353b0819f2f2e7dcc5c3153e7eaebe187601ac5dc4. Receipt digest: b095132e396bfb1b0ec135f8481312dbab0eb3742742d1cf362394ba2f0669b2. Accepted test SHA-256: 847bef76c239cc567783c3d70f67b2937e8161ea7c172ecd16e8a3c2a7c71099. Helper SHA-256: 92b1fac26106438c324de8a861799eaa308016b1d4c91ab3f32cf1ac15a57d52. Existing domain/test/evaluation identities remain unchanged. No test correction was used.

Separate Green may edit only the new repository module. Every accepted test/helper remains forbidden. It must execute all accepted tests unchanged and pass independent strict typechecking; import success alone cannot satisfy Green.

### Store preflight — M102-STORE-PREFLIGHT

The test_worker returned **MISSING** under M102-STORE-PREFLIGHT-01 with no lease or changes. Actual source/test inventory contains only the domain module and its contract tests; package configuration supplies node --test, not a hidden persistence implementation. The agreed production module and new test file are absent. Domain/test/manifest hashes and Node/npm/Python identities match M102-BASELINE-002, whose 58 passing tests and strict typecheck result remain reusable. The primary inspected actual changed paths and absence state and accepted the classification. Eleven primary-owned documentation/ignore paths are changed; no source/test or active lease exists.

The next turn is one guarded coherent store Red. Its static import is ../src/server/persistence/run-repository.ts. If the precise agreed module remains absent, accept only ADR-0024's initial Red — missing production callable, explicitly recording that behavioral assertions have not executed. No production stub, unrelated error, or skipped test can satisfy this gate.

### Pre-write ignore gate — M102-IGNORE-001

After FINAL1 PASS and with no active lease, the primary added only /data/runs/ to .gitignore. The exact representative check exited 0 and reported .gitignore line 6 as owner; git ls-files -- data/runs returned no paths. The data directory and active lease pointer were absent. The exact diff contains one added ignore line. This is primary-owned non-TDD guard-control maintenance, not aggregate or service evidence. It precedes every test/application aggregate write.

### Execution readiness — M102-BASELINE-002

On 2026-08-30 the primary rechecked the actual execution checkout: clean HEAD `207a620` on `codex/m1-02-local-service-and-aggregate`, not a reset to historical `a3058fa`. Node is `v24.20.0`, npm `11.19.0`, and Python `3.12.10`. The exact prerequisite focused command passed **58/58**, zero failure/cancellation/skip/todo; independently invoked strict typechecking exited **0**. The source, contract-test, and manifest raw SHA-256 values match M102-BASELINE-001. No `data` directory, tracked run data, or active lease exists. No restore or browser/model acquisition was needed.

The session exposes the required `critical_researcher`, `decision_analyst`, `critical_research_reviewer`, `test_worker`, `code_worker`, and `critical_reviewer` roles with the configured role-level model/effort routes. The primary's exact model/effort setting is not independently observable and is not asserted. Actual permissions are workspace-write with restricted network; `.git`, `.agents`, and `.codex` are read-only, while ignored guard runtime state is under the writable workspace. Research and review remain contractually read-only; every future worker write still requires the pinned lease. The existing seven-thread capacity is a ceiling, not a parallel implementation authorization.

### Current-state evidence — M102-BASELINE-001

On 2026-08-30, primary inspected the whole tracked file inventory, roadmap/status indexes, completed M1-01 closure and literal contract, actual source and relevant tests, mapped authorities, package/compiler configuration, and current workflow. Git was clean at `a3058fa153e3bc96fce361cd301d0e1e1d7b961c`; there was no active lease or `data` directory. The exact existing focused command above passed **58/58**, zero failures/skips/todo/cancellations; independently invoked strict typecheck exited **0** under Node 24.20.0/npm 11.19.0. No restore or external service/browser work was done.

Current raw SHA-256 identities:

| Artifact | SHA-256 |
| --- | --- |
| `src/server/domain/run-contract.ts` | `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e` |
| `tests/run-contract.test.ts` | `e97aac5b0e77bda74381a44c3052637d4d46e05e166bc9f6be4495df6b4130c4` |
| `evaluation/rd003-scan-v1.json` | `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459` |

The source/test LF-normalized hashes are respectively `9c728164332b50cf22f57a1903a5dda88c146d3174e00fcb3798a51fd5add42c` and `fe0b57fde3ed6af0a04458af4b41fd890435cc2fac60f795b33d75023b222ee2`, matching [M1-01 closure](m1-01-run-and-scan-contracts.md#accepted-s3-review-and-closure-candidate--m101-closure-001). All six fixture hashes and the four package/compiler/build files match their completed-baseline identities. This is prerequisite verification, not M1-02 implementation proof.

### Accepted planning checkpoint — M102-PLAN-REVIEW-001

On 2026-08-30, a fresh independent R2 final planning-artifact review returned **PASS**, with no Blocker, Major, or Minor findings, against the complete eleven-path documentation activation state. The reviewed semantic candidate's SHA-256 was `e68e879aba3d1f48b6f4a08efb71f2316bb70457d7846f79d0cabe2d990b2124`; subsequent plan/progress edits only record this checkpoint. Primary inspected the actual changes and accepted the result. Documentation checks passed for relative links and anchors, all 15 required plan sections, PowerShell syntax without executing the example, JSON configuration, and `git diff --check`. HEAD, index, implementation, tests, dependency pins, configuration, workflow, and evaluation inputs remain unchanged. Roadmap counts are four Complete tasks, M1-02 planning-only In progress, and 23 Not started tasks; no active lease or run-data directory exists.

This historical checkpoint proves planning readiness only. At that checkpoint no execution capsule, synthesis, literal checkpoint, preflight, lease, Red, Green, service/persistence result, or implementation review existed. Record only decisive accepted checkpoints here as execution proceeds; keep raw transcripts and guard state out of tracked documentation.

## Interfaces and Dependencies

Preserve M1-01's exported `PageAnalysisRun`, `ScanResult`, `Finding`, `ScannerReviewObservation`, `ProviderContext`, `Fact`, `ValidationResult`, `validateRun`, and `validateScan`. File parsing treats values as unknown and calls the actual validator before use. Store/service wrappers may express operation outcomes but do not become a second aggregate schema, new parent status, provider invocation, or durable workflow record.

The implemented boundaries are a concrete run repository, a concrete local HTTP service, and the existing package's `src/server/main.ts` entry. Exact callables, routes, outcomes, and effects are frozen in M102-LITERALS-001-L1 after the final R3 checkpoint. Use pinned Node standard-library filesystem/path/HTTP and test/assert capabilities where sufficient. No new npm package or global tool is selected. M1-03 supplies the real scan, M1-04 the React UI, and M1-05 their wiring; none may be inferred from successful service/storage tests.

## Revision note

2026-08-30: Accepted different integrated critical PASS and final documentation/cleanup checks, marked only M1-02 Complete and archived this same plan. Preserved original planning and failure history; repaired archive links and revalidated status/configuration/documentation. No other task or Git publication was started.

2026-08-30: Recorded the passed full R3 and ignore gates, both guarded implementation slices and S3 reviews, and the service F01 regression correction. Full integration passes 182 tests, independent strict typechecking and the separate actual entry/reopen/deletion demonstration. Different final review and documentation closure remain pending. Historical checkpoint wording below describes the state at each checkpoint.

2026-08-30: Completed bounded research, mandatory synthesis and fresh pre-draft review, each correction within its recorded allowance. Authored the complete ten-part L1 contract and executable command/effect boundary. Final R3 review, ignore maintenance, worker preflight, and all implementation evidence remain pending.

2026-08-30: Recorded the later exact-task execution authorization, fresh `207a620` readiness evidence, actual role/permission boundary, and minimal frozen research candidate set. Preserved the original planning checkpoint and budgets. Implementation remains gated by M102-LITERALS-001.

2026-08-30: Created the M1-02 planning-only ExecPlan after current-state review and fresh M1-01 prerequisite checks. Added a future coupled R3 persistence/service literal gate, two worker-first S3 slices, the accepted first-module Red route, pre-write ignore protection, explicit command/effect slots, and task-only closure. Accepted fresh independent planning review and documentation validation. No product or workflow implementation changed.
