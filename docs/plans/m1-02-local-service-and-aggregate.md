# Establish the loopback service and single-file aggregate

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-02](../DEVELOPMENT_ROADMAP.md#m1-02--establish-the-loopback-service-and-single-file-aggregate). The owner selected it for **planning only** on 2026-08-30. Its roadmap status is **In progress**, but implementation has not started. This request does not authorize worker writes, run-data creation, service execution, another roadmap task, a commit, or a push. A later exact-task execution instruction must precede the research and implementation sequence below.

## Progress

- [x] (2026-08-30 21:24Z) Reviewed the clean `a3058fa` baseline, whole-project inventory/status, M1-01 completion and actual contract, M1-02 authorities, and current agent workflow. M102-BASELINE-001 records 58 passing tests and independent strict typechecking.
- [x] (2026-08-30 21:24Z) Created the task-scoped planning contract, two sequential behavior-bearing slices, unresolved literal/command gate, and planning-only activation records.
- [x] (2026-08-30 21:33Z) Accepted fresh independent planning review PASS with no findings and completed documentation validation under M102-PLAN-REVIEW-001. This is not the future R3 literal checkpoint or implementation review.
- [ ] Obtain exact M1-02 execution authorization and recheck the baseline, prerequisites, and absence of an active lease.
- [ ] Complete M102-LITERALS-001 research, mandatory synthesis, fresh pre-draft review, primary authorship, and different fresh final literal review; freeze every binding command and interface before preflight.
- [ ] Establish and verify the Git-ignore boundary before any aggregate write, as primary-owned maintenance between leases.
- [ ] Complete M102-STORE-01 preflight, guarded test-owned Red/characterization, separate Green, validation, and S3 review.
- [ ] Complete M102-SERVICE-01 through the same sequential ownership route and S3 review.
- [ ] Pass full task verification, different fresh integrated critical review, exact test-output cleanup, and the documentation gate; only then mark M1-02 Complete and archive this same plan.

## Surprises & Discoveries

- M1-01 is already Complete, not merely planned. `src/server/domain/run-contract.ts` supplies two pure validators and immutable snapshots; `tests/run-contract.test.ts` has 58 passing tests. Neither a completed snapshot nor its JSON round trip proves disk durability or scanner execution.
- Node 24.20.0, npm 11.19.0, and Python 3.12.10 are available. The earlier M1-01 runtime blocker does not apply to this baseline.
- `.gitignore` does not yet cover `data/runs/`; the `data` directory is absent, and no run is tracked. This is an execution-time pre-write gate, not a reason to create run data during planning.
- The accepted contract permits case-sensitive run IDs and has only `unprocessed` Finding state. Filesystem name handling and collision behavior need explicit M1-02 decisions; adding later workflow fields or changing M1-01's contract is not an implicit solution.
- The source/test checkout uses CRLF while the completed plan recorded LF hashes. LF-normalized hashes match the accepted M1-01 evidence exactly; the current raw hashes are recorded below. RD-003's seven frozen artifacts retain their exact LF bytes. No line-ending policy change is needed.

## Decision Log

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

Planning is complete: the prerequisite contract and current toolchain checks pass, the fresh independent planning review returned PASS without findings, and documentation validation passed. M1-02 remains In progress for planning only; no source, test, data file, service, or executable configuration has been created. The next boundary is exact-task execution authorization followed by the reviewed literal/command freeze, not immediate Green. Future research, worker, and implementation-review outcomes will be added only when they actually occur.

## Purpose / Big Picture

M1-02 makes one developer-started service report its actual loopback address or a bounded startup failure, stop cleanly, and own the local run repository. The repository must write a complete validated aggregate before reporting it as durable, preserve earlier valid data on failure, and validate a retained run when it is reopened. Service-owned configuration must not select a run mode or contact a provider, and overlapping user operations must be refused without a queue.

A reviewer will exercise real filesystem and loopback HTTP boundaries using explicitly synthetic test data. This proves storage and service behavior, not a real scan. M1-03 owns scanning, M1-04 owns rendered UI, and M1-05 owns their end-to-end integration. The final service may expose readiness and retained-run loading before Analyze can be wired to the real scanner; it must never fabricate Findings or advertise an integrated application that does not exist.

## Context and Orientation

### Current project state and readiness

The planning baseline is commit `a3058fa153e3bc96fce361cd301d0e1e1d7b961c` on `codex/m1-02-local-service-and-aggregate`, initially clean. RD-001, RD-002, RD-003, and M1-01 are Complete. Before this activation all remaining 24 application tasks were Not started; afterward only M1-02 is In progress for planning and the other 23 remain Not started. M1 as an observable integrated capability is not complete.

The tracked implementation is one domain module and one test file. `package.json` pins Node 24.20.0/npm 11.19.0, Playwright 1.62.1, `@axe-core/playwright` 4.13.0, React/React DOM 19.2.8, TypeScript 7.0.2, Vite 8.0.16, and the recorded type packages. RD-002 selected `node:http`, `node:test`, and `node:assert/strict`; it did not create a server. `tsconfig.json` already includes server and test TypeScript with strict no-emit checking. `start` points to the absent `src/server/main.ts`; `build` also awaits absent client inputs. No restore, upgrade, browser acquisition, or model setup is currently needed.

Use the [completed M1-01 literal contract](completed/m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1) and actual [domain module](../../src/server/domain/run-contract.ts). `validateRun(unknown)` and `validateScan(unknown)` return either a detached recursively frozen value or a closed invalid result. The aggregate has `formatVersion: 1`, immutable run identity/provenance/provider context, exactly `running`, `completed`, or `failed`, and complete minimized scan data only on completion. `initial-persistence` is the existing failure category for failure to publish the initial **complete** scan aggregate, not an arbitrary directory-creation failure. Do not change this meaning or invent missing browser observations.

The [RD-003 manifest](../../evaluation/rd003-scan-v1.json) and six HTML fixtures are frozen evaluation inputs with accepted native observations. They are not a public scanner, a general run fixture format, or service startup prerequisites. Their readiness/browser/timeout literals must not become public service defaults by accident. Generation inputs and capacity screens remain later-task work.

### Applicable authorities

Read [AGENTS.md](../../AGENTS.md), [the documentation router](../README.md), [PLANS.md](../../PLANS.md), and the exact roadmap row first. These task authorities control:

| Concern | Authority and M1-02 interpretation |
| --- | --- |
| Startup and configuration | [Installation requirements](../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md#mvp-startup-model-setup-and-deferred-packaging): REQ-INST-002/004; [ADR-0015](../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md). Developer startup, ready/failure/clean stop, deferred AI setup, no selection or probe caused by configuration. |
| One aggregate and immutable evidence | [Evidence requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance): REQ-EVID-003/011; [minimal information model](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#accepted-minimal-information-model), its parent lifecycle and retention sections; [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md). One canonical file, existing stable IDs, no overwritten completed evidence or siblings. |
| Safe persistence and one operation | [Reliability requirements](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations): roadmap REQ-QUAL-002/005/008/011–013 plus directly linked REQ-QUAL-001/010/020. Complete durable publication, read validation, preservation, local diagnostics, no orchestration platform. |
| Privacy, deletion, and privilege | [Privacy requirements](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security): REQ-SEC-002/006/012/027, with REQ-SEC-003/007/021 for retained/test evidence. Service-owned filesystem/configuration, content-safe output, exact-directory deletion, no hosted copies, no credentials or raw content. |
| Existing mode and URL boundary | [M1-01 L1.1/L1.2](completed/m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1), [ADR-0018 trusted input](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md#trusted-operator-input), and REQ-INST-004. Keep fixed Local/Groq context and normalized non-sensitive operator-chosen URLs; no new URL classifier or provider adapter. |
| Derived checks | [SPEC-007](../specs/SPEC.feature) and [HS-006](../specs/HARD_SPEC.feature). Apply their preservation, read-validation, minimization, and privilege clauses here; actual downstream workflows and comparison remain their owners' work. These documents are non-executable specifications, not passing tests. |
| Readiness and method | [OD-022/024/025](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md), [evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), and the [agent workflow](../../.codex/README.md). Existing Accepted scope, exact task activation, bounded worker-first TDD and risk-routed review. |

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

Proposed exact ownership, to confirm at the literal freeze: `test_worker` owns `tests/run-repository.test.ts` and, only for the concrete shared synthetic records needed by both new suites, `tests/helpers/m102-run-fixture.ts`; separate `code_worker` owns only `src/server/persistence/run-repository.ts`. Existing `src/server/domain/run-contract.ts` and `tests/run-contract.test.ts` are read-only. New helpers must not import a test file that registers tests or extract/rewrite M1-01 merely for reuse. No blanket `src/` or `tests/` write scope is allowed.

The test worker performs read-only preflight against the frozen imports/callables and actual filesystem boundary. For MISSING, author one coherent set of publication/read/preservation behavioral tests, then stop at accepted Red. For a genuinely absent callable, use ADR-0024's first-module exception exactly as described below. Separate Green implements only the accepted protocol; it cannot choose semantics, weaken a test, add another format version, or edit documentation. Use real temporary files for round trip and failed-write preservation, and only the frozen narrow failure-injection seam for otherwise unreliable faults. Cover a populated multi-Finding aggregate, valid zero, incomplete observations, unavailable facts, and both existing modes without rerunning the whole M1-01 validator matrix in every case.

Accept M102-STORE-PREFLIGHT/RED/GREEN evidence only after actual diff, frozen test boundary, results, and fresh terminal lease inspection. Focused command: `npm.cmd @toolchainOptions run test:focused -- tests/run-repository.test.ts`; task boundary: independent `npm.cmd @toolchainOptions run typecheck`. Both are future commands until that test exists. Audit test relevance and obtain a fresh `critical_reviewer` verdict before the service slice advances.

### 4. Loopback service slice — M102-SERVICE-01

Observable outcome: a real Node HTTP listener reports readiness or bounded startup failure, serves only the selected application endpoints, reopens validated records through the repository, refuses overlapping work without queueing, and stops without publishing a late success or leaving its own listener/operation live. Configuration remains service-owned and neither selects a mode nor probes a provider. **TDD applicable**, **S3** for privilege, concurrency, shutdown, and publication ordering. Authorities are REQ-INST-002/004, REQ-SEC-002/012/027, REQ-QUAL-002/005/008/012/013, ADR-0015/0021, and the existing parent lifecycle.

Proposed ownership: `test_worker` owns only `tests/local-service.test.ts`, reading the accepted synthetic helper unchanged; separate `code_worker` owns only `src/server/service.ts` and `src/server/main.ts`. The accepted store, domain module, and every test/helper are forbidden to Green. A demonstrated prerequisite defect stops the slice for coordinator triage; it does not expand the lease into the earlier store slice. Keep configuration, diagnostic mapping, and the single-operation guard cohesive in the service unless a current repeated concept actually justifies another file; any path change must be reconciled before preflight, not invented under lease.

Freeze a narrow callable handoff that the future real scan can use without implementing it. Exercise service ownership and persistence with test-only inputs/collaborators; the shipped entry point has no fake scanner, arbitrary-run upload route, or development success mode. Its readiness must accurately mean service readiness, not scanner/UI/provider availability. Run-loading is an application-owned API boundary here; rendered reopen navigation belongs to M1-04/M1-05.

The complete suite must use real loopback sockets and the real repository, including occupied-address startup failure, malformed/missing/corrupt run lookup, one-operation contention, operation error, shutdown while work is pending, publication-versus-stop ordering, and repeated clean stop. Test-only fault/delay controls must not become an HTTP route or user setting. Demonstrate no provider/network/model work beyond the named loopback listener/client, no credential/configuration leakage, and no privileged static-file exposure. Do not serve the repository or `data` directory as a static root. Client asset serving, if immediately required, must be explicitly bounded in the literal contract; no UI is created here.

Accept M102-SERVICE-PREFLIGHT/RED/GREEN evidence through the same lease and actual-diff barrier. Focused command: `npm.cmd @toolchainOptions run test:focused -- tests/local-service.test.ts`; task boundary: independent typecheck plus the affected store suite when integration changes its assumptions. Obtain a fresh S3 `critical_reviewer` before final task verification.

### 5. Integrate evidence and close only this task

Run the full explicit three-file product suite once at the final candidate, independent strict typechecking, and the frozen real entry-point startup/ready/stop and exact-directory deletion demonstration. The demonstration uses only a task-created synthetic run, never a user run; prove another run and an isolated corpus sentinel are unchanged. No real corpus needs to be acquired. Any sentinel or synthetic record is test evidence, not scanner or corpus integration evidence.

Audit tests, helpers, failure doubles, skips/focus/todo markers, generated outputs, and current dependency scope. A different fresh `critical_reviewer` reviews the integrated state because critical persistence/shutdown risks remain. Reuse fresh deterministic evidence; filesystem/listener state needs a pinned isolated identity or fresh inspection. Disposition every follow-up and stop on unresolved Blocker/Major. Primary then passes the documentation gate and marks **only M1-02** Complete; archive this same file and repair links. M1-03/M1-04 remain separately selectable; M1-05 remains blocked until all three dependencies complete.

### Ownership, evidence, and budgets

Follow [Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), [the guard](../../.codex/write-lease-guard.md), and the exact role files. Create workflow ID `M1-02-20260830-01` at execution, preserving it on continuation. Each slice receives one read-only preflight, one Red or characterization, one Green with optional same-turn behavior-preserving Refactor, at most one same-contract correction per writer, and one review-correction loop. Retain each writer only within its slice. An attempt-2 lease names its terminal attempt-1 parent; respawning never resets a budget.

The primary opens every exact path lease, inserts its returned digest in the completed packet, then dispatches the worker. Stop the worker before fresh terminal close. Inspect `closed-compliant`, receipt/digest, actual changes, accepted-test hashes, commands, and side effects; the receipt alone proves neither semantics nor ignored-output containment. All tests/helpers are forbidden in Green. All documentation, `.codex/`, `.agents/`, Git metadata, dependencies/configuration, frozen evaluation inputs, and unrelated application paths are outside worker write scope. The primary edits plan/status/ignore controls only between leases. Workers never stage, commit, push, or otherwise mutate Git metadata.

Ordinary test correction stays with `test_worker`. An exceptional direct primary test correction is allowed only between leases, with reason/paths/validation recorded, prior evidence invalidated, and the revised test contract freshly accepted before Green. Every other application/test-fixture/dependency/configuration edit follows the worker route. Stop on a binding-field change, conflicting authority, unexplained overlapping change, repeated decisive failure, two no-diff write handoffs, budget exhaustion, or more than three TDD cycles in a slice. Do not invent a new slice merely to reset corrections.

No rendered UI is selected, so the frontend-quality overlay and `frontend_code_worker` do not apply. Parallel roadmap work is not authorized; only read-only assignments independent of useful primary work may overlap. There is one writer per worktree, and Red, Green, and Refactor remain sequential.

## Decision Review Contract

### M102-LITERALS-001 — publish-or-preserve service contract

**Status:** Not started; execution authorization required. This future decision is **R3** because the safe-write, run identity, interruption, single-operation ownership, and shutdown/publication mechanics are not yet frozen. The target is one authored literal subsection in this plan, not another authority, schema document, decision ledger, or automatic ADR. ADR-0015/0021 and M1-01 already decide the topology and data shape. The primary may select ordinary task literals within them; a significant durable mechanism or changed contract requires the normal ADR/owner route before dependent work.

One bounded, non-ranking discovery pass may identify credible standard-library mechanisms, primary sources, hard disqualifiers, and missing evidence. No candidate is selected or ranked by this planning document. After discovery, freeze the actual minimal candidate set and compare it symmetrically using: preservation and truthful acknowledgment first; conformity with existing identity/schema/privacy; real Windows behavior on the pinned Node version; simple failure/cleanup behavior; and the fewest current dependencies and moving parts. Do not manufacture several viable candidates when only one satisfies hard gates, or reopen database/framework selection already excluded by authority.

Use **one `critical_researcher` report** for the coupled publish-or-preserve operation boundary, with at most one targeted follow-up. It must cover filesystem identity/write/read failure and their ordering against operation ownership/stop; ordinary port/route naming is primary-owned and needs no second researcher. If that evidence cannot cover a new independent critical dimension, stop to reconcile the budget rather than silently adding a report. Use one mandatory `decision_analyst` synthesis plus at most one bounded correction. It returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. `DRAFT READY` then requires one fresh `critical_research_reviewer` pre-draft checkpoint, with at most one supported outline correction. The primary authors the complete literal contract; no drafter is needed. A **different fresh `critical_research_reviewer`** reviews that entire authored contract before worker preflight. The final-artifact ceiling is two supported correction cycles; each R3 correction rechecks the complete invariant packet. Same decisive gap twice, exhausted allowance, or new scope stops for owner direction, without resetting budgets.

Each role receives Research Assignment Capsule v1: exact task/research identity, R3 trigger, dimension/candidates, authority anchors, M102-BASELINE-001 and any newer evidence IDs, common criteria/hard gates, target output, permissions, freshness, budget, stop conditions, peer barrier, follow-up allowance, review stage, and next barrier. Reports are read-only, bounded to evidence and gaps, and cannot accept decisions or implementation. Research must use version-relevant official Node/underlying platform documentation or source for external mechanics, distinguishing facts from inference and runtime proof. No fresh web research or mechanism selection occurred during planning.

### Required artifact-local outputs before preflight

| Literal slot | Decide before implementation; current value |
| --- | --- |
| Storage identity and creation | **Unresolved:** exact generated run-ID form within M1-01's grammar, collision/no-overwrite behavior, case-sensitive identity versus Windows aliases/reserved names, root resolution and owned-path checks, requested-ID versus stored-ID comparison. No global identity registry or browser-supplied path. |
| Write and acknowledgment protocol | **Unresolved:** exact serialization/encoding, temporary-file naming/location if used, exclusive creation, complete write/flush/close/publication order, commit/acknowledgment point, errors at each step, cleanup error treatment, and initial versus replacement behavior. Use ordinary JSON, not a canonical-byte/integrity platform. No success before the required durable boundary and no fallible post-publication step ambiguously reported as a rolled-back write. |
| Run transitions and read recovery | **Unresolved:** exact allowed storage transitions with immutable common context, completed evidence/siblings and terminal-record protection; persisted-running policy; treatment of an interrupted running record, malformed/truncated/unsupported JSON, ID mismatch, and abandoned task-owned temporary file. No implicit resume, invented observations, automatic repair, or success inferred from file existence. |
| Service/operation lifecycle | **Unresolved:** exact bind address/port configuration, readiness/startup-failure results, admitted operations and busy results, acquisition/release points, read-versus-write contention, failure handling, shutdown deadline/settlement, disconnect behavior, and prohibition of late completion after shutdown. State when the last valid aggregate remains authoritative. No user cancellation feature or supervisor. |
| Service/API/configuration contract | **Unresolved:** exact exported paths/signatures, methods/routes, closed request/response/error/diagnostic fields, startup/stop signals supported on Windows, application-revision source, and no-scanner entry-point disposition. Enumerate which configuration is needed now, what remains absent/deferred, and prove no mode default, secret exposure, or provider check. No arbitrary configuration endpoint. |
| Verification commands and effects | **Unresolved:** fill every execution slot below, including isolated directories/ports, failure seams, real-start/read/stop sequence, exact-run deletion and sentinel checks, output inventory and cleanup. No binding value may be left for a worker to invent. |

The contract must explicitly delimit process interruption versus filesystem/OS/power-loss guarantees supported by evidence. A passing rename or Promise is not automatically proof of every durability claim. If the accepted preservation requirement cannot be met with the proposed minimal mechanism, return for research or owner direction; do not silently weaken it or build a recovery platform.

### Cumulative invariant packet

All invariants are pending future proof. The researcher/analyst address each; both R3 reviewers review each applicable item, the named S3 slice reviewer accepts implementation evidence, and the different integrated reviewer checks their interaction. Recheck the complete packet after a material revision.

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

Expected at the reviewed baseline: correct pinned runtime, Python >= 3.10, absent active lease, 58 passing tests with zero skipped/todo, and strict typecheck exit 0. If the active pointer exists, stop and reconcile its exact lease rather than deleting it. A runtime/prerequisite failure is not Red. `node_modules` is currently present; restore only if a fresh execution inspection establishes the need, using the existing [locked developer instructions](../../README.md#development-toolchain). Do not regenerate package metadata or lockfiles.

### Future commands and effect slots

These commands become binding only when execution is authorized and M102-LITERALS-001 freezes their complete invocation context. Exact new test paths above are proposals until then. The primary replaces unresolved slots in this existing plan, never in a worker's ad hoc handoff.

| Slot | Command or unresolved value | Effects and acceptance |
| --- | --- | --- |
| Bootstrap / manifest or lock generation | **None planned.** Reuse existing metadata and installed dependencies. | No package, lock, compiler, Vite, or workflow change. A new dependency or setup need stops for reconciliation. |
| Conditional frozen restore | `npm.cmd @toolchainOptions ci`, only if needed after separate scope/effect reconciliation. | `node_modules/` and scoped npm cache only; lock unchanged; scripts suppressed. No automatic recursive removal of an existing dependency tree in this plan. |
| Data-ignore gate | After primary ignore edit: `git check-ignore -v data/runs/m102-ignore-probe/run.json`; `git ls-files -- data/runs`. | First command exit 0 with exact owning ignore rule; second no tracked paths. Creates no file. |
| Store Red / Green | `node --check tests/run-repository.test.ts`; `npm.cmd @toolchainOptions run test:focused -- tests/run-repository.test.ts`. | Syntax passes; intended Red or qualified first-module failure, then all accepted tests pass unchanged. Exact filesystem side effects still require freeze. |
| Service Red / Green | `node --check tests/local-service.test.ts`; `npm.cmd @toolchainOptions run test:focused -- tests/local-service.test.ts`. | Same test ownership and result rule; exact sockets, subprocesses if needed, files and cleanup still require freeze. |
| Independent typecheck | `npm.cmd @toolchainOptions run typecheck`. | No emitted JavaScript; exit 0 after Green and at closure. |
| Final full product suite | `npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts`. | All three files execute, zero failure/skip/todo/focus. Resolve any isolated-output contention before freezing this command; no ambient test auto-discovery. |
| Real entry-point startup / ready / reopen / stop | **Unresolved:** exact use of existing `npm.cmd @toolchainOptions run start` / native entry, arguments/environment, readiness request, known synthetic run read, bounded stop and process-exit check. | Test only the owned loopback address/process; no browser launch or unavailable UI build. When launching a background helper in PowerShell, use a hidden window and record its exact identity. |
| Test outputs / clean preparation | **Unresolved:** task-owned isolated root(s), unique run-directory identities, reserved loopback ports, initial absence/collision checks, allowed files and sentinel locations. | Prefer unique fresh directories, not deletion to manufacture a clean state. No real run, credential, native browser, model, or corpus acquisition. |
| Failed-write / interruption / shutdown injection | **Unresolved:** exact narrow test-only injection and result matrix at each selected publication phase. | Real happy-path filesystem and HTTP evidence remains mandatory. No production fault knob, skip on Windows, process supervisor, or unbounded sleep. |
| Exact-run deletion / remaining-output cleanup | **Unresolved:** exact created-run removal command and cleanup order, containment/topology checks, other-run/corpus sentinel comparison, final absence/listener/process checks, failure disposition. | Resolve absolute paths inside the named task roots before any recursive operation; no workspace/data-root/corpus-root deletion, globs, hidden cleanup, or provider-erasure claim. Preserve original failure when cleanup also fails. |
| Lease lifecycle | Primary uses existing guard `start`, `close`, and pinned `status` as documented in [the guard guide](../../.codex/write-lease-guard.md#commands). | Fill Packet v2 identity/four exact path lists, preserve returned digest, require fresh compliant close and inspect actual diff. Worker never operates the guard. |

Npm activity remains confined by the existing options to its task cache. Guard state remains under ignored `logs/agent-flow-leases/v2/`. All other ignored/generated effects must be enumerated before a write turn. No cleanup is required or authorized by this planning change.

## Validation and Acceptance

Planning uses **TDD: Not applicable**: it changes only coordination/status documentation, with link/anchor resolution, required-section checks, command syntax inspection, authority consistency, unchanged implementation/frozen inputs, and `git diff --check`. One fresh `independent_reviewer` reviews planning scope/sequencing as M102-PLAN-REVIEW-001 under an R2 capsule; it does not select R3 mechanisms or certify code. Local baseline gathering is R0 primary inspection; no researcher or analyst is needed for those facts.

Execution is complete only with evidence for every M1-02 roadmap Verification clause and M102-I1–I8: verified ignored data root before writes; real startup/ready/failure/stop; narrow API and service-owned configuration; no provider call or credential/privilege leak; one-operation refusal; real durable write and revalidated reopen; no false completed publication; preserved completed evidence/siblings; content-safe local diagnostics; exact task-run deletion preserving another run and corpus boundary; and no out-of-scope feature/dependency.

For each TDD slice record exact preflight classification and source evidence. Existing covered behavior needs no write; existing uncovered behavior gets passing characterization. MISSING/REGRESSION gets Red then separate Green; PARTIAL needs a coordinator-isolated gap; CONFLICTING/UNKNOWN stops. If preflight verifies an absent agreed first module/export, independently verify the environment/runner, freeze its exact static import and callable, and write the complete behavioral suite. The precise expected missing-callable failure may then be accepted as **initial Red — missing production callable**, explicitly identifying unexecuted assertions. No stub, fallback, wrong import, syntax failure, unavailable dependency, existence-only suite, skipped or conditional assertion is valid Red. Separate Green must execute every accepted test unchanged and pass independent strict typechecking.

Evidence records include assignment/worker, path contract/digest and terminal receipt, actual changed-file/test hashes, exact command/cwd, environment and relevant-tree identity, results, side effects/cleanup, primary acceptance, and risk-routed review. Filesystem and socket evidence is non-reusable without an isolated run identity/state. Historical M1-01 lease receipts are not current no-drift proof. Any correction invalidates affected evidence; a changed literal contract returns to the R3 barrier before dependent workers continue.

Before closure, update the existing owners identified by [the documentation gate](../README.md#task-closure-documentation-gate): README developer startup/reopen/stop and deletion instructions; roadmap; plan/progress indexes and task summary; project status statements; lifecycle and architecture implementation notes where materially affected. Requirements/ADR statuses remain unchanged unless separately authorized. Keep build/UI/scanner and later-section claims explicitly future. Run the complete suite and strict typecheck against actual final source, validate documentation/configuration and links, reconcile reviewer findings and generated output, then mark only M1-02 Complete. A reviewer PASS or a valid `run.json` alone cannot close it.

## Idempotence and Recovery

Read-only inspection and the current pure contract suite are safe to repeat. Future filesystem/socket tests must allocate their own isolated state, fail on unexpected pre-existing contents, and clean only paths/processes they demonstrably created. Repeated start/stop and attempted duplicate creation must have frozen, bounded outcomes. No operation may silently overwrite a retained run or treat stale `running` data as a live/resumable operation.

Preserve last valid aggregate bytes and report write/cleanup failure honestly. Never repair corrupted user data, sweep run directories, delete a corpus, kill an unrelated process, or reset the repository to pass verification. Future manual deletion instructions must validate one absolute ordinary run-directory target beneath the application-owned root and explain that local deletion does not erase provider-side records.

On lease violation, unexpected overlap, failed prerequisite, or exhausted budget: stop writes, terminally close when verifiable, preserve user/peer changes and all failure evidence, and let the primary reconcile the last accepted barrier. Do not edit guard JSON, delete its live pointer, continue under a closed lease, or infer permission for broader recovery. Any resumed writer receives a fresh packet/baseline/lease. A genuine external permission blocker requires the smallest applicable approval; a denial is not permission to bypass the control.

## Artifacts and Notes

### Current-state evidence — M102-BASELINE-001

On 2026-08-30, primary inspected the whole tracked file inventory, roadmap/status indexes, completed M1-01 closure and literal contract, actual source and relevant tests, mapped authorities, package/compiler configuration, and current workflow. Git was clean at `a3058fa153e3bc96fce361cd301d0e1e1d7b961c`; there was no active lease or `data` directory. The exact existing focused command above passed **58/58**, zero failures/skips/todo/cancellations; independently invoked strict typecheck exited **0** under Node 24.20.0/npm 11.19.0. No restore or external service/browser work was done.

Current raw SHA-256 identities:

| Artifact | SHA-256 |
| --- | --- |
| `src/server/domain/run-contract.ts` | `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e` |
| `tests/run-contract.test.ts` | `e97aac5b0e77bda74381a44c3052637d4d46e05e166bc9f6be4495df6b4130c4` |
| `evaluation/rd003-scan-v1.json` | `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459` |

The source/test LF-normalized hashes are respectively `9c728164332b50cf22f57a1903a5dda88c146d3174e00fcb3798a51fd5add42c` and `fe0b57fde3ed6af0a04458af4b41fd890435cc2fac60f795b33d75023b222ee2`, matching [M1-01 closure](completed/m1-01-run-and-scan-contracts.md#accepted-s3-review-and-closure-candidate--m101-closure-001). All six fixture hashes and the four package/compiler/build files match their completed-baseline identities. This is prerequisite verification, not M1-02 implementation proof.

### Accepted planning checkpoint — M102-PLAN-REVIEW-001

On 2026-08-30, a fresh independent R2 final planning-artifact review returned **PASS**, with no Blocker, Major, or Minor findings, against the complete eleven-path documentation activation state. The reviewed semantic candidate's SHA-256 was `e68e879aba3d1f48b6f4a08efb71f2316bb70457d7846f79d0cabe2d990b2124`; subsequent plan/progress edits only record this checkpoint. Primary inspected the actual changes and accepted the result. Documentation checks passed for relative links and anchors, all 15 required plan sections, PowerShell syntax without executing the example, JSON configuration, and `git diff --check`. HEAD, index, implementation, tests, dependency pins, configuration, workflow, and evaluation inputs remain unchanged. Roadmap counts are four Complete tasks, M1-02 planning-only In progress, and 23 Not started tasks; no active lease or run-data directory exists.

This checkpoint proves planning readiness only. No future execution capsule, synthesis, literal checkpoint, preflight, lease, Red, Green, service/persistence result, or implementation review exists yet. Record only decisive accepted checkpoints here as execution proceeds; keep raw transcripts and guard state out of tracked documentation.

## Interfaces and Dependencies

Preserve M1-01's exported `PageAnalysisRun`, `ScanResult`, `Finding`, `ScannerReviewObservation`, `ProviderContext`, `Fact`, `ValidationResult`, `validateRun`, and `validateScan`. File parsing treats values as unknown and calls the actual validator before use. Store/service wrappers may express operation outcomes but do not become a second aggregate schema, new parent status, provider invocation, or durable workflow record.

The planned new boundaries are a concrete run repository, a concrete local HTTP service, and the existing package's `src/server/main.ts` entry. Exact callable and route definitions remain M102-LITERALS-001 outputs. Use pinned Node standard-library filesystem/path/HTTP and test/assert capabilities where sufficient. No new npm package or global tool is selected. M1-03 supplies the real scan, M1-04 the React UI, and M1-05 their wiring; none may be inferred from successful service/storage tests.

## Revision note

2026-08-30: Created the M1-02 planning-only ExecPlan after current-state review and fresh M1-01 prerequisite checks. Added a future coupled R3 persistence/service literal gate, two worker-first S3 slices, the accepted first-module Red route, pre-write ignore protection, explicit command/effect slots, and task-only closure. Accepted fresh independent planning review and documentation validation. No product or workflow implementation changed.
