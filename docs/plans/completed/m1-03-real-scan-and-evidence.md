# Implement M1-03 real scanning and minimized evidence

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

**Owning task:** [M1-03 — Implement the real exact-three-rule scan and minimized evidence](../../DEVELOPMENT_ROADMAP.md#m1-03--implement-the-real-exact-three-rule-scan-and-minimized-evidence). **Roadmap status:** Complete. The subsequent owner instruction explicitly authorizes this exact task's research, bounded implementation, verification and documentation closure. The original planning-only checkpoint remains history; the R3 literal barrier, both S3 reviews, different final integrated review, exact runtime removal and documentation closure passed. M1-04 and M1-05 remain unselected, and M1 is not complete.

Read [AGENTS.md](../../../AGENTS.md), the [authority map](../../README.md), [PLANS.md](../../../PLANS.md), the [agent workflow](../../../.codex/README.md), [worker-first workflow](../../../.codex/execplan-implementation-workflow.md), [write-lease guard](../../../.codex/write-lease-guard.md), and [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) before executing. The primary owns this plan, authority interpretation, all research-derived documentation, evidence acceptance, status and closure. Research/review roles are read-only. Test and production edits use separate guarded workers; no lease is open for planning.

## Progress

Dated entries preserve the state at each checkpoint, including earlier pending gates; Outcomes and the final closure record describe the completed task.

- [x] (2026-08-31 02:05Z) Reviewed the current repository, completed prerequisites, routed M1-03 authorities, existing service handoff and frozen evaluation inputs. `M103-BASELINE-001` records 182 passing existing tests, independent strict typechecking, matching installed pins and fixture bytes, clean Git state and no active lease.
- [x] (2026-08-31 02:05Z) Bounded this plan to M1-03 with two future behavior-bearing slices, a conditional non-TDD browser prerequisite, and an explicit pre-worker literal barrier. No implementation or browser acquisition has begun.
- [x] (2026-08-31 02:17Z) Fresh independent planning review returned PASS with no findings. Primary reconciled the reviewed candidate and passed the planning documentation checks; `M103-PLAN-REVIEW-001` and `M103-PLAN-DOC-001` record this planning-only checkpoint.
- [x] (2026-08-31 02:38Z) Received exact-task execution authorization and verified current readiness as `M103-BASELINE-002`: clean HEAD `815b4dca7960bce09e0cf208fb4e4c4a3573421a`, 182/182 tests, independent typecheck exit 0, all nine installed direct pins and six exact fixture bytes, no active lease. Managed Chromium remains absent. Historical baseline was not restored.
- [x] (2026-08-31 UTC) Completed `M103-LITERALS-001`: two critical research reports, mandatory DRAFT READY synthesis, corrected fresh pre-draft PASS, primary-authored L3.1–L3.9 and a different fresh complete-artifact PASS after one correction cycle. Primary reconciled all findings, exact commands/effects, protected state and I1–I8 before preflight; runtime proof remains pending.
- [x] (2026-08-31 UTC) Accepted normalization Red/Green and the bounded test/code correction for S3 finding F1: all 20 current focused tests and independent strict typechecking pass. At the owner's request, stopped after fresh compliant lease closure; affected-suite revalidation and consolidated S3 re-review remain pending before this slice can close.
- [x] (2026-08-31 UTC) Complete `M103-NORMALIZE-01` preflight, independently owned Red/Green, bounded F1 correction and consolidated S3 PASS; primary accepted fresh 78-test/typecheck evidence and unchanged protected state.
- [x] (2026-08-31 UTC) Complete the guarded managed-browser prerequisite after the recorded command and permission failures: exact runtime/inventory/marker and empty scratch verified, final lease closed compliant, fresh S1 review PASS accepted. Earlier failed attempts and owner-authorized exceptions remain recorded below.
- [x] (2026-08-31 UTC) Accepted scan preflight and the unchanged 36-group Red boundary after C4 complete-artifact PASS, exact compile-cache recovery and M103-SCAN-RED-REPLAY-001. Syntax passed; focused exit 1 is solely the absent module. Cache/marker remained unchanged, scratch empty and environment restored. Assertions remain unexecuted until Green.
- [x] (2026-08-31 UTC) Completed `M103-SCAN-01` preflight, independently owned Red/Green, real-browser evidence and consolidated S3 PASS. F1 is remedied by the owner-authorized extra regression and separate code correction.
- [x] (2026-08-31 UTC) Completed 290-test integrated verification, independent strict typechecking, different final critical review, exact runtime/scratch removal and documentation closure. M1-03 is Complete; this same plan is archived with repaired links.

- [x] (2026-08-31 UTC) Accepted the three-line test-control correction, unchanged production and full Green: 85 scan tests pass with strict typechecking. Primary integrated verification passes all 287 tests; exact cache/marker/scratch/environment and fixture checks pass. S3 returned REVISE for M103-SCAN-F1; the bounded regression needs an additional test-owner allowance before code correction and the remaining reviews.

- [x] (2026-08-31 UTC) Resolved M103-SCAN-F1: 88 scan tests pass, consolidated S3 re-review PASS accepted, and fresh integrated verification passes 290 tests plus independent strict typechecking. Correction allowances remain consumed.

## Surprises & Discoveries

- The baseline already contains a real local service and filesystem repository, not just types. [service.ts](../../../src/server/service.ts) exposes an internal `runScan(input, execute)` collaborator receiving a validated running record and `AbortSignal`. Its HTTP interface deliberately exposes only health and read operations; scanning is still unavailable. M1-03 can satisfy that collaborator without changing service routes, persistence or the entry point.
- RD-003's [manifest](../../../evaluation/rd003-scan-v1.json) loads exact authored HTML with offline `page.setContent`. Its fixture selectors, one-target expectations, evidence-policy label and evaluation-process supervision are not public scanner defaults. A fixture page's `about:blank` identity must not be replaced with an invented HTTPS observation to manufacture a completed public run.
- [M1-01's literal contract](m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1) already freezes the public evidence representation. It uses structural locators, supports input/textarea label facts, and distinguishes absent buckets from explicit inapplicable zero. The older Proposed assessments cannot override those fields or RD-003's exact corrected contrast content.
- The currently resolved Playwright managed Chromium executable is absent (`managedChromiumPresent:false`). The selected packages are installed. This is an execution prerequisite to recheck, not a reason to repeat RD-002, change versions, attach the user's browser, or download anything during planning.
- Fresh baseline tests cleaned their own synthetic records and temporary roots successfully. `data/runs` is empty and ignored; no M1-02 temporary root or active lease remains. Six M1-02 source/test/helper hashes match accepted closure after LF normalization; checkout CRLF bytes are not semantic drift.
- The installed npm CLI calls Node's `enableCompileCache()` without a directory. Unsetting `NODE_COMPILE_CACHE` does not prevent this programmatic activation: the first scan Red command left `node-compile-cache` under its process temporary root. The required scratch postcondition correctly stopped advancement before any browser execution.

## Decision Log

- Decision: Accept the reviewed implementation and close only M1-03 after integrated verification, exact runtime removal and documentation checks. Rationale: every task Verification has evidence; the unchanged shared contract still leaves UI and end-to-end integration to M1-04/M1-05. Date/Author: 2026-08-31 / primary.

- Decision: Activate only M1-03 planning and preserve all other task statuses and dependencies. Rationale: the owner selected this plan, prerequisites are Complete, and plan creation is not execution authorization. Date/Author: 2026-08-31 / primary.
- Decision: Use two coherent TDD slices: complete native-result normalization, then URL/browser execution and evidence capture using that result boundary. Rationale: these have distinct falsifiable contracts and ownership boundaries; a separate module, service or slice for every validation helper would add unnecessary machinery. Date/Author: 2026-08-31 / primary.
- Decision: Protect the M1-01 contract, M1-02 implementation and RD-003 gold inputs. Rationale: the roadmap permits implementation against that shared contract, not independent changes to it; HTTP Analyze integration and the trusted public-page smoke belong to M1-05. Date/Author: 2026-08-31 / primary.
- Decision: Current repository inspection is R0; this owner-facing planning artifact is R2. The primary supplies its planning synthesis and one fresh independent final planning review. Future native identity/minimization and browser ownership decisions require R3 and are not selected here. Rationale: avoid unnecessary R0 agents or an unconditional R2 pre-draft review while retaining the triggered critical execution barriers. Date/Author: 2026-08-31 / primary.
- Decision: Reuse the existing exact package/toolchain pins. Browser acquisition, if needed, is a separately recorded non-TDD prerequisite with exact commands, paths, mutations and cleanup frozen before a lease. Rationale: no new dependency, package/lockfile generation, tool selection or runtime manager is needed for M1-03. Date/Author: 2026-08-31 / primary.
- Decision: Accept the independently reviewed planning artifact only. Rationale: the fresh R2 review found no Blocker, Major or Minor, and primary validation confirms exact task scope, documentation consistency and protected baseline preservation. Every execution authorization, R3 literal, setup and S3 implementation gate remains pending. Date/Author: 2026-08-31 / primary.
- Decision: Proceed with the owner's subsequent explicit M1-03 execution instruction at the actual current baseline. Rationale: the authorization covers required research, bounded implementation, verification and closure, but does not waive the literal, ownership or evidence gates. Date/Author: 2026-08-31 / primary.
- Decision: Reject the scan Red handoff as incomplete after the scratch postcondition failed, preserve the exact residue, and stop before Green. Rationale: an expected missing-module failure and a compliant source-path lease do not validate undeclared command effects; changing the reviewed environment contract requires an owner exception because both complete-artifact correction cycles are consumed. The command-only proposal below is not yet an accepted literal. Date/Author: 2026-08-31 / primary.

## Outcomes & Retrospective

M1-03 is Complete. The real exact-three-rule scanner and minimized native evidence normalizer meet the bounded task contract. Both slices passed S3 review; the different final integrated critical review passed and primary reconciliation found no outstanding implementation issue. All 290 tests and independent strict typechecking pass. Gold inputs, dependency pins, domain contract and existing service/storage implementation remain unchanged. Task-local browser runtime and scratch roots were removed after all owned operations settled; documentation closure passed.

The npm compilation-cache surprise required explicit command corrections and showed why a source-path lease alone cannot prove scratch cleanup. Failed launch also needs final scratch proof even without a returned handle. Separate regression/correction ownership preserved those failures and all accepted assertions instead of hiding residue. Browser reruns require the documented developer setup and process-start environment; no application installer is added. The result remains limited to the reference host and cooperative cleanup for trusted pages. UI/HTTP scan-to-disk wiring, the public-page smoke, retrieval, providers and comparison remain later work. M1-04/M1-05 are unselected and M1 is not complete.

## Purpose / Big Picture

M1-03 supplies the missing real scanner behind the established run contract. After execution, application-owned modules will reject unsupported input before a run is created, use one fresh managed browser context to inspect one trusted HTTPS page, run exactly `image-alt`, `label` and `color-contrast`, and return either a complete minimized terminal result or a bounded failure with truthful cleanup disposition. Every violation node remains independently addressable; native incomplete nodes remain separate observations.

A reviewer will exercise the real browser/scanner path on the frozen synthetic states and inspect focused negative tests for URL admission, full coverage, privacy, native-node correspondence and failure cleanup. These checks establish a backend capability, not a rendered Analyze workflow or durable end-to-end milestone. M1-02 owns durable publication; M1-04 owns the UI; M1-05 joins those capabilities and owns the single trusted public-page smoke. Neither a completed scan nor a zero count proves accessibility, WCAG conformance, certification or legal compliance.

## Context and Orientation

### Current project state and readiness

The following entry snapshot explains the starting conditions; it is historical. Current completion, runtime removal and reproducibility limits are recorded in Outcomes and the final closure evidence below.

The historical planning baseline was clean commit `149466b7499ab3dc954c591721c51fefd352e541`, `feat: implement M1-02 local service and aggregate (#8)`, on `codex/m1-03-real-scan-and-evidence`. Execution starts from `M103-BASELINE-002` below, without restoring that historical tree. RD-001, RD-002, RD-003, M1-01 and M1-02 are Complete. M1-03 alone is authorized for execution; the other 22 application tasks remain Not started. The milestone's integrated outcome remains unimplemented.

| Existing boundary | Evidence and consequence for this task |
| --- | --- |
| Toolchain | [RD-002](rd-002-minimum-development-toolchain-literals.md) and [developer instructions](../../../README.md#development-toolchain) select Node 24.20.0, npm 11.19.0, native erasable TypeScript, strict `tsc`, and `node:test`/`node:assert/strict`. Current versions and all nine installed direct pins match. No framework or test-runner selection is open. |
| Browser/scanner inputs | RD-003 is Complete. [The scan-only manifest](../../../evaluation/rd003-scan-v1.json) and six LF fixture files match exactly. Selected Playwright is 1.62.1, `@axe-core/playwright` and resolved axe-core are 4.13.0; the installed Playwright browser manifest identifies Chromium revision 1234/version 151.0.7922.34. These are local pinned records, not release/support claims. |
| Run and scan contract | [run-contract.ts](../../../src/server/domain/run-contract.ts) defines application-owned readonly types plus `validateRun(unknown)` and `validateScan(unknown)`. The [58 contract tests](../../../tests/run-contract.test.ts) pass. Its literal contract controls fields, facts, coverage, chronology and terminal states. No schema extension is planned. |
| Local host and aggregate | [service.ts](../../../src/server/service.ts), [run-repository.ts](../../../src/server/persistence/run-repository.ts), [main.ts](../../../src/server/main.ts), and the [M1-02 evidence](m1-02-local-service-and-aggregate.md#accepted-final-integrated-review--m102-integrated-review-01) establish guarded admission, create/read/finish, bounded shutdown and disk/loopback behavior. The full current suite passes 182/182. |
| Missing capabilities | There is no production scanner, evidence normalizer or scanner test. Client entry/UI, retrieval, models/providers, review and comparison are absent. `build` remains a future client command; service start is real but does not scan. |

M1-03's actual dependencies are M1-01 and RD-003, both Complete. M1-02 is useful existing integration context, not a new dependency added by this plan. All directly applicable Must requirements and open-decision portions are Accepted or explicitly Deferred. The accepted product boundary and failing/corrected scanner expectations are frozen. Remaining public execution, extraction, identity and command literals are ordinary choices owned by M1-03, but must be fully resolved before dependent workers. The absent managed browser blocks browser execution until restored, not planning or unrelated pure normalization checks.

### Applicable authorities and vocabulary

| Authority | Exact portions to apply |
| --- | --- |
| [Roadmap M1-03](../../DEVELOPMENT_ROADMAP.md#m1-03--implement-the-real-exact-three-rule-scan-and-minimized-evidence) | Objective, unchanged dependencies, Expected output, Verification and exclusions; [M1-04](../../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results) and [M1-05](../../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton) identify the adjacent ownership limits. |
| [Target authorization and scanning](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning) | `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-001`, `REQ-SCAN-005`–`REQ-SCAN-007`: basic HTTPS input, passive top-level exact-three-rule scan, complete collections and individual unavailable facts. |
| [Evidence and provenance](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance) | `REQ-EVID-007`–`REQ-EVID-010`: each returned node, minimized facts, all-rule coverage and exact-locator evidence. Capture the locator now; comparison and targeted positive retention remain M5 work. `REQ-EVID-002` and `REQ-SCAN-002` govern the existing controlled same-target evidence, not a general pass archive. |
| [Privacy and security](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security) | `REQ-SEC-026`, plus the directly affected retention/diagnostic constraints in `REQ-SEC-002`, `REQ-SEC-003`, `REQ-SEC-007`, `REQ-SEC-012` and `REQ-SEC-021`. Trusted non-sensitive public URLs may be normalized and retained only in run provenance; there is no secret-classification or URL-approval subsystem. |
| [Reliability](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations) and [lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#pageanalysisrun-lifecycle) | `REQ-QUAL-001`, `REQ-QUAL-010`–`REQ-QUAL-013`, `REQ-QUAL-019` and `REQ-QUAL-020`: unknown-input checks, atomic collection, failure versus individual missing facts, immutable scan evidence and ownership of persistence. No queue, automatic retry or supervisor. |
| [ADR-0008](../../architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md), [ADR-0009](../../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md), [ADR-0018](../../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) | Accepted Playwright/axe evaluation baselines and current trusted-operator browser boundary, including ordinary redirects/subresources, downloads disabled and cleanup. ADR-0017 and superseded hostile-target rows are history, not requirements to implement. |
| [Evaluation freeze](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), [fixed checks](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#fixed-executions-and-shared-checks) and RD-003 | `REQ-EVAL-001`, `REQ-EVAL-004`, `REQ-EVAL-005`, `REQ-EVAL-007`; exact existing six-state inputs and non-promotable scan-only observations. Preserve old results and keep new implementation evidence distinct. |
| [SPEC](../../specs/SPEC.feature) and [HARD_SPEC](../../specs/HARD_SPEC.feature) | Backend portions of `SPEC-001`/`BHV-01`, all applicable scan portions of `HS-001` and `HS-004`; `HS-006` supports minimization. These are non-executable planning scenarios. UI/disclosure and scan-to-disk integration remain adjacent tasks. |
| Existing literal authorities | [M1-01 L1.1–L1.11](m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1), especially L1.3–L1.9; [M1-02 L1.4–L1.6](m1-02-local-service-and-aggregate.md#l14--service-interfaces-and-admission) for the available callback, immutable input, failure and shutdown handoff. |

The [architecture map](../../architecture/README.md), [candidate architecture](../../architecture/CANDIDATE_ARCHITECTURE.md), [scan assessment router](../../architecture/candidates/authorized-scan/README.md), [controlled-fixture assessment](../../architecture/candidates/authorized-scan/CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md), [evidence-capture assessment](../../architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md), and [local feasibility](../../LOCAL_MVP_FEASIBILITY.md) supply context only. Dated proposed selectors, impact/sufficiency fields, timeout suggestions and fixture colors cannot supersede later frozen literals. No unrelated model or retrieval assessment is needed.

A **native result** is the complete transient axe output, including all four arrays `violations`, `incomplete`, `passes` and `inapplicable`. A **Finding** represents one violation node, not one rule or one locator. A **ScannerReviewObservation** represents one native incomplete node and has no Finding ID or downstream workflow. **Coverage** accounts for every rule and bucket; it is not an accessibility verdict. **Unavailable evidence** is a required closed fact with a reason, not permission to drop its parent item. A **terminal callback result** is a validated completed or failed aggregate candidate; only M1-02 can make it durable.

## Scope and Non-Goals

Implement basic standards-based HTTPS normalization/admission, fresh non-persistent managed browser ownership, one finite navigation/scan timeout, exact top-level three-rule execution, unknown native-result validation, full all-node normalization, public-policy evidence capture, structural locator correspondence, native contrast measurements, honest provenance and bounded terminal failures. Scanning must not depend on provider availability or invoke a model in either selected mode.

The public result uses only the existing `m1-public-v1` fields and failure categories. Retain every violation and incomplete node even when an individual fact or locator is unavailable. Validate every required native bucket and rule before accepting complete or zero output. Keep native passes/inapplicable transient except their coverage counts; controlled same-target positives may be asserted as evaluation evidence without extending `run.json`. Do not build M5's positive-observation retention or comparator now.

Do not modify the domain contract, existing service/store/entry point, previous test contracts, package/lock/compiler/build configuration, frozen manifest or fixtures, or agent machinery. Do not wire Analyze, change health capability flags or add an HTTP scan endpoint. A test may consume the existing internal service callback to check admission ordering and compatibility, but that does not authorize production integration or close M1-05.

Excluded: UI/CSS, component libraries, fixture-selector UI/API, another product domain, schema libraries, scanner plug-ins, generic browser adapters, new services/process supervisors, queues, retries, cancellation UI, worker pools, crawling, link discovery, authentication/imported state, private-target handling, iframe scanning, intentional page interaction, uploads/download workflows, broad axe rules, screenshots/traces/raw HTML or native archives, raw exception logging, provider/RAG/model work, generalized SSRF/egress/DNS/redirect defenses, resource-limit qualification, performance/support/release claims, and the M1-05 real public-page smoke. Public redirects and subresources retain ordinary managed-browser behavior; a closed provenance validation failure is not a new redirect firewall.

## Plan of Work

### 1. Re-enter at the actual boundary

After explicit execution authorization, inspect Git status, HEAD, protected paths, current runtime/package identities, fixture bytes and any active lease. Preserve user work. Re-read changed authorities and this plan in full. Record authorization and current evidence between leases; reuse `M103-BASELINE-001` only if command, working directory, relevant-tree/environment fingerprints and no-drift conditions still hold. Never use the illustrative M1-03 IDs in the guard guide as an active lease.

Create one execution workflow ID derived from M1-03 and keep the slice IDs below stable. Research does not acquire a write lease. No implementation preflight or setup may cross the unresolved literal barrier. If a significant architectural or shared-contract change is required, stop for its authority owner instead of allowing a worker to decide it.

### 2. Resolve the literal contract before implementation

Execute `M103-LITERALS-001` below. At most one non-ranking discovery pass may identify relevant pinned sources and compatibility constraints. Then freeze the specific options/questions, evidence dimensions, commands, effects and invariant packet before comparative research. Complete the two bounded critical reports, mandatory analyst synthesis, fresh pre-draft checkpoint, primary-authored literal section and different fresh final critical research review. Record all exact callables, inputs, failure mappings, profile values and command/effect slots in this same plan; do not create a separate report or second manifest solely for workflow administration.

### 3. Native normalization slice — M103-NORMALIZE-01

**TDD applies. Risk: S3**, because the slice establishes native collection integrity, within-run identity and the privacy-preserving projection. Its observable contract is one complete unknown native result becoming all and only the allowed minimized items and exact coverage, or a closed fatal failure without partial success. Missing/invalid individual fields remain explicit unavailable facts. A test-owned synthetic native input may exercise malformed structures and canaries, but must never be labeled a real browser observation.

Use [M1-01 L1.5–L1.9](m1-01-run-and-scan-contracts.md#l15-exact-rule-coverage), `REQ-SCAN-005`–`007`, `REQ-EVID-007`–`010`, `REQ-SEC-003`, `REQ-QUAL-010`/`019` and HS-004/HS-006 as the capsule anchors. The `test_worker` first performs read-only preflight against the agreed normalizer export and existing domain checks. If missing, write one coherent behavioral suite, stop at Red, and have the primary accept the complete test boundary before the separate `code_worker` reaches minimum Green. No provisional production stub is permitted.

The planned production file is `src/server/scan/normalize-scan.ts`; test ownership is `tests/scan-normalization.test.ts`. Native boundary checking, coverage and per-rule projection stay together unless a demonstrated present need requires a reconciled scope change. Freeze the exact split between native facts and DOM-derived facts before Red; the browser slice proves actual DOM association. Focused command is the normalization command in Concrete Steps; affected validation adds the unchanged domain suite and independent strict typecheck. Evidence IDs use `M103-NORMALIZE-01-PREFLIGHT`, `-RED`, `-GREEN` and `-REVIEW`, with explicit attempt suffixes when needed. Advance only after primary diff/test acceptance and a fresh `critical_reviewer` pass or fully dispositioned nonblocking follow-ups.

### 4. Conditional managed-browser prerequisite — M103-BROWSER-SETUP-01

First inspect the selected executable and version under the frozen environment. If the exact browser is already available, record fresh prerequisite evidence and omit this slice entirely. Otherwise use **TDD: Not applicable; S1**: acquiring an already selected development browser is non-behavioral setup, not production scanning. A guarded `code_worker` setup packet owns only the exact task-local browser acquisition root and declared download/cache effects. No test worker, fabricated Red, package manifest, lockfile or configuration edit is needed. All allowed/forbidden path lists, exact acquisition/inspection commands and cleanup are filled before its lease; ignored output is outside the guard's proof and needs explicit inventory/ownership verification.

Replace Red with selected-package/browser-identity checks, exact executable existence, expected acquisition inventory, unchanged protected-file hashes and permission/effect checks. A browser version query needed for readiness must be explicitly permitted, close its own browser, and not navigate or scan. Use one setup turn and at most one same-contract correction under a fresh attempt-2 lease. The primary inspects effects and receipt; a fresh `milestone_reviewer` performs the proportional setup review. A failure or denied acquisition stops the dependent browser branch without changing versions or using a personal Chrome/Edge profile.

### 5. Real scan and evidence slice — M103-SCAN-01

**TDD applies. Risk: S3**, because native-to-DOM correspondence, evidence privacy, resource ownership, timeout and shutdown behavior remain critical. Use the roadmap Verification, ADR-0008/0009/0018, REQ-AUTH-007/008, REQ-SEC-026, REQ-QUAL-012/019, SPEC-001, HS-001/004 and `M103-I2`–`I7` below as exact capsule anchors.

The planned production file is `src/server/scan/scan-page.ts`, containing only the cohesive admission, browser/capture and terminal-result boundary. `tests/scan-page.test.ts` owns behavioral tests; `tests/helpers/m103-browser-fixtures.ts` may exist only if the concrete frozen-content loader and real-browser assertions need a shared helper. It must not implement a second scanner. The earlier normalizer and all M1-01/M1-02 source/tests are read-only. Any necessary change to an accepted earlier boundary returns to the primary for contract/scope reconciliation before a new assignment.

The read-only test preflight checks the frozen callable, browser prerequisite, fixture identity and current seams. Red must cover rejection before creation/navigation, fresh state, downloads disabled and not retained, passive top-level scope, exact rule coverage, all-node/incomplete separation, truthful provenance, timeout/fatal failure, shutdown and closure. Green implements that accepted contract using the first slice and selected Playwright/axe packages. Do not add production fault flags, fixture URL intake, injected provider machinery or a generic adapter registry merely to facilitate tests.

Exercise the actual scan/evidence functions on the six unchanged RD-003 states. Keep their offline loading, profile and manifest-case lineage explicit; do not fabricate a public `PageAnalysisRun` from `setContent`. Freeze a separate narrowly bounded navigation-test arrangement for the public execution path before Red, using project-owned content and observed browser URLs rather than an external public target. Native incomplete, unavailable evidence, iframe exclusion, download denial and failure controls may use small test-only synthetic inputs, distinct from the six gold states. They add neither a fixture family nor a new evaluation-gold version.

The browser command below and strict typecheck are the focused checks; affected validation includes both new suites and unchanged domain/service boundaries when consumed. Evidence IDs use `M103-SCAN-01-PREFLIGHT`, `-RED`, `-GREEN` and `-REVIEW`. Inspect real browser closure and cleanup, not just the absence of a process name. A fresh `critical_reviewer` assesses the complete slice after primary acceptance; browser doubles alone cannot satisfy the real-execution gate.

### 6. Integrate evidence and close only M1-03

Run the complete then-current authoritative test suite once at closure and the strict typecheck independently. Inspect the actual callable compatibility with the existing service, test relevance, raw-content exclusions, all six fixture identities and truthful completed/failed outputs. Reuse fresh accepted browser evidence for review rather than re-running a batch merely because another role is invoked. Do not duplicate tests per generation mode or claim statistical repeatability.

A different fresh `critical_reviewer` performs final integrated review of cross-slice handoffs, remaining findings, failure/resource ownership and closure. It does not repeat every administrative check. The primary reconciles every follow-up and the actual worktree, completes the documentation gate, and updates only M1-03 to Complete after its Verification passes. Move this same plan to `completed/`, repair affected links and update the manual progress record. Do not activate M1-04/M1-05 or claim the M1 milestone complete.

### Write ownership, evidence and stops

| Assignment | Allowed files / directory roots | Forbidden boundary |
| --- | --- | --- |
| Primary planning/literal/status maintenance | This plan and materially affected existing documentation/navigation; no worker lease active | Application source, ordinary test creation, dependencies, fixtures and executable configuration; only the documented between-lease exceptional test-correction rule can permit a bounded test correction during execution. |
| Normalization Red | File `tests/scan-normalization.test.ts`; directory roots None | All `src`, existing tests/helpers, other tests, `docs`, `fixtures`, `evaluation`, workflow/agent controls and package/configuration files. |
| Normalization Green | File `src/server/scan/normalize-scan.ts`; directory roots None | All tests, other source, `docs`, `fixtures`, `evaluation`, workflow/agent controls and package/configuration files. |
| Conditional setup | Files None; exact new task-local browser root frozen in `M103-CMD-SETUP` | All tracked files, user/global browser/runtime installations, unrelated ignored paths and all existing run data. No mutation of package metadata. |
| Scan Red | Files `tests/scan-page.test.ts` and, only if justified before the lease, `tests/helpers/m103-browser-fixtures.ts`; directory roots None | All `src`, every existing/accepted test including normalization, `docs`, `fixtures`, `evaluation`, workflow/agent controls and package/configuration files. |
| Scan Green | File `src/server/scan/scan-page.ts`; directory roots None | All tests, normalizer and other existing source, `docs`, `fixtures`, `evaluation`, workflow/agent controls and package/configuration files. |

These are planned scopes, not active packets. The primary projects each into all four exact lists in [Milestone Assignment Packet v2](../../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), including explicit `None`, chosen optional-helper disposition and precise protected files. No wildcard write scope or repo-root permission is an assignment. Workers are not alone in the repository, must preserve peer/user changes, and may use Git only for inspection. They never operate the guard or stage, commit, push, stash, modify refs/config/hooks or otherwise mutate Git state.

Only one lease may be active in this worktree. The primary opens it immediately before each write turn, inserts the exact digest into the packet, terminally closes it after the worker stops and inspects the actual diff, commands, effects and fresh compliant receipt before acceptance. Documentation and guard-control maintenance occur between leases. A receipt proves only the guard's endpoint scope, not behavior, ignored output, OS cleanup or attribution. No parallel writers or worktrees are needed for this task; only independent read-only evidence gathering/review may overlap useful primary work.

Each behavioral slice gets one read-only preflight, one coherent Red or passing characterization, one Green with optional behavior-preserving Refactor, at most one same-contract correction per role and one review correction loop. Keep one test worker and one selected code worker for that slice; persistence of an agent never persists a lease. Attempt 2 names its terminal attempt-1 parent and gets a fresh packet, digest and baseline. Stop on the same decisive failure twice, a second unsuccessful correction, two no-diff write handoffs, more than three TDD cycles, exhausted budget, rejected or wrong-failure Red, a binding-field change, conflicting authority, unexpected overlap or any noncompliant/unverifiable guard result. Do not reset allowances by respawning.

`EXISTING_AND_COVERED` reuses fresh coverage without new tests or Green; `EXISTING_BUT_UNCOVERED` gets test-owned passing characterization without Green; `MISSING`/`REGRESSION` gets Red then Green. For `PARTIAL`, the primary isolates the explicit missing gap and reconciles any changed binding field before writes; `UNKNOWN`/`CONFLICTING` stops for evidence or authority reconciliation. Search absence alone is not preflight proof. For a genuinely absent first export, use only [ADR-0024's first-module Red exception](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception): verified environment, frozen import/callable, complete tests, honest expected missing-callable failure and explicit unexecuted assertions. Green must execute every accepted test unchanged and pass independent strict typechecking. No missing-import skip or placeholder implementation is allowed.

Evidence is reusable only with its exact command, working directory, relevant-tree fingerprint, environment fingerprint and no-drift check. Browser artifacts/profile, fixture bytes, native capture or test changes invalidate affected browser evidence. An ordinary test correction belongs to `test_worker`; an exceptional direct primary test correction must occur between leases, record its reason/paths/validation, invalidate prior Red/characterization and establish a fresh accepted test boundary before Green resumes.

## Decision Review Contract

### M103-LITERALS-001 — native collection and browser ownership

**State: C4 complete-artifact PASS and primary acceptance; exact recovery and unchanged Red replay accepted.** This task-owned R3 decision record is not a new ADR. Its question and selected product literals remain unchanged. Both original research checkpoints, all eight invariants and primary reconciliation passed. Both original complete-artifact corrections and the additional C3/C4 cycles are consumed. C4 closed the uncovered nonbrowser npm path. The separately authorized exact cleanup and single replay are now consumed successfully. No implementation-role allowance is renewed. Both implementation slices, corrected S3 reviews, different final integrated review and documentation closure are accepted. No implementation allowance remains active.

#### Frozen research capsule basis — M103-R3-FREEZE-001

The sole non-ranking discovery pass inspected installed `@axe-core/playwright` 4.13.0, axe-core declarations, Playwright 1.62.1 metadata, the domain validators and service callback. The builder exposes `analyze`, `axeSource`, and `setLegacyMode`; default analysis uses partial results and a temporary blank page, while legacy analysis uses `axe.run`. This is an API inventory, not a recommendation. No browser ran and no package was acquired.

Research compares only these concrete mechanism families, without changing selected packages: (N1) full integration-package analysis followed by selector resolution with an explicit correspondence/drift check; (N2) integration-package execution with a page-local native-element capture/projection at completion, using only supported pinned seams. Each report must establish whether a family actually satisfies the hard gates; unsupported mechanics disqualify it. A required direct axe execution that cannot honor the accepted integration boundary is an explicit reconciliation issue, not a worker choice. Native collection checking and minimized projection remain one normalizer; native payloads remain transient. No additional candidate family may be silently introduced.

For lifecycle, compare (B1) direct owned Playwright resources with one operation deadline, bounded ordered closes and observed late settlement; (B2) cancellation raced against work with explicit late-acquisition disposal and the same bounded close contract. Neither may treat a race winner as cleanup proof. Process supervisors, broad process killing, generic adapters and public fault flags are disqualified by scope. Compare a narrow real navigation test using browser request interception of project-owned HTTPS content against an owned loopback TLS transport; both must preserve observed URL identity and forbid external target traffic. Offline gold states retain `about:blank` provenance separately.

Research questions are frozen to the eight rows in Decide before workers; evidence dimensions are native shape/check/contrast integrity, actual-element correspondence and minimization (report `M103-R-NATIVE`), and admission/profile/service compatibility, timeout/abort/late work/cleanup plus exact command and acquisition effects (report `M103-R-BROWSER`). Both share M103-I1 through I8, the common criteria and hard gates above. Source evidence is the actual installed pinned code plus current official upstream API documentation. Runtime proof is deferred only for already-defined semantics, never for an unresolved contract.

The current environment is Windows PowerShell; Node 24.20.0/npm 11.19.0 resolve through `C:/nvm4w/nodejs`; Python 3.12.10 resolves through `C:/Users/mmjos/AppData/Local/Programs/Python/Python312/python.exe`. Repository root is `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. The default `C:/Users/mmjos/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe` is absent and must not be acquired globally. Research must resolve a task-owned acquisition root compatible with the guard, which rejects ignored scope roots; no ignore-control change or guard bypass is authorized. Existing `temp/CONVERSATION.md`, `temp/rd002-npm-cache`, all dependencies and prior lease history are preserved.

Budget: the two critical reports may run concurrently, each at most one initial report and one targeted follow-up; mandatory analyst one synthesis and one correction; fresh pre-draft critical research reviewer one checkpoint and one supported correction; a different fresh final critical research reviewer with at most two artifact-correction cycles. The primary drafts directly only after DRAFT READY and the pre-draft PASS. Every assignment is read-only, capsule-scoped, and stops on repeated decisive gaps, unsupported mechanics, exhausted allowance or changed authority. Reports do not authorize execution. Expected output is source-linked disposition, exact implementable recommendations, failure cases, unknowns/reversal conditions and readiness, bounded to the assigned dimension.

R3 is triggered by native identity and collection integrity, privacy-sensitive projection, and timeout/AbortSignal/resource-ownership mechanics not yet frozen. Before any ranking, record the candidate set actually supported by pinned primary evidence; do not manufacture three alternatives or reconsider the accepted scanner/toolchain. The common criteria are complete Accepted behavior, truthful identity/provenance, no result loss or secret retention, bounded owned cleanup, compatibility with the existing callback and tests, and the smallest direct implementation. Hard gates dominate preference; this is not a scored product/tool leaderboard.

After execution authorization, permit at most one non-ranking discovery pass. Assign **two bounded `critical_researcher` reports**, one for native-result integrity/DOM correspondence/minimization and one for browser admission/lifecycle/cleanup and the service handoff. They may run concurrently against the same frozen anchors, report dependencies and wait for primary reconciliation rather than revising each other's assumptions. Use installed version-pinned sources and applicable official documentation; verify uncertain/time-sensitive API facts against primary sources. No research role installs a browser, edits files or runs an unapproved live target. No ordinary researcher, drafter or standing panel is needed.

Every research/analyst/review assignment receives [Research Assignment Capsule v1](../../../.codex/README.md#research-assignment-capsule-v1), projected from this contract: exact identity/tier/trigger, question, options and evidence dimensions, target, authority anchors, shared evidence IDs/freshness, criteria/hard gates, forbidden scope/owner boundary, bounded output, budget/stops, read-only permissions, peer synchronization/follow-up and next barrier. Require concise source-linked findings, failure cases, candidate disqualifiers and reversal conditions, remaining unknowns and a role-appropriate readiness result; no raw page data or complete duplicate reports in Git.

Wait at one research barrier. Allow one bounded follow-up round, at most one follow-up for each report's assigned gap. A `decision_analyst` is mandatory, with one synthesis and at most one supported correction; it returns exactly `DRAFT READY`, `RETURN FOR RESEARCH` or `OWNER DIRECTION`. `DRAFT READY` alone does not clear R3: a fresh `critical_research_reviewer` must pass the pre-draft contract checkpoint, with at most one supported outline correction. Then the primary writes the complete literal section and a **different fresh** `critical_research_reviewer` reviews the whole artifact and cumulative invariant packet. There is no drafter. At most two final-artifact correction cycles are permitted; every R3 revision receives the complete review, not just review of the fixed lines. Material changes invalidate the affected earlier checkpoint without resetting any allowance.

Stop for primary reconciliation or owner direction on repeated decisive gaps, two `RETURN FOR RESEARCH` results without material new evidence, exhausted allowance, a changed shared contract or requirement, unsupported evidence, a new normative subsystem or unresolved owner-controlled choice. Research/reviewer output cannot accept an ADR, change status or authorize a worker. The post-verdict barrier must align reviewed literals, unresolved findings, hard gates, command effects, recommendation, approval and next action. Only a complete accepted literal contract with no blocking findings permits packets/preflight.

### Decide before workers; prove afterward

All entries were **UNRESOLVED** at planning. The reviewed authored section below supplies their explicit literals and justified None dispositions. Complete-artifact review and primary reconciliation passed; unknown decision semantics cannot be relabeled downstream proof.

| Required decision | Freeze before workers | Later proof, not permission to invent semantics |
| --- | --- | --- |
| Native consumed boundary | Required array/result/node structure, malformed/duplicate/unexpected-rule and native-error handling, complete reporter/options, coverage mapping including null versus inapplicable zero, fatal-versus-individual-fact distinction | Multi-node and all-bucket cases, missing rules, malformed/interrupted output and complete-zero rejection; every retained count reconciles through `validateScan`. |
| Minimal projection | Exact native check-group extraction, allowed image/label facts, lossless contrast fields/reasons, per-fact unavailable mapping and raw-value exclusions under unchanged `m1-public-v1` | Canaries, missing/invalid/withheld facts and native measurements survive or are excluded exactly as specified; no raw exceptions or scanner payload escapes. |
| Native node correspondence and identity | How the actual native target is resolved uniquely in the captured top-level DOM; unsupported/shadow/ambiguous/drift disposition; exact structural-locator derivation/verification; Finding ID generation independent of locator and collection position | Real DOM correspondence, duplicate locators, unsupported/missing targets and collection-preservation tests. Never resolve a different element or fabricate a locator. |
| URL and public profile | Exact admission callable and closed rejection shape; standard normalization with no credentials/non-HTTPS; explicit mode input; initial ScanContext; exact headless/Chromium, readiness, viewport/locale and other material default values | Unsupported input starts no run, browser or provider. Fresh context imports no personal state. Actual requested/final URLs and observed versions/readiness/time have truthful provenance. |
| Execution/callback lifecycle | Exact callable compatible with `execute(run, signal)`, collection/observation timing, terminal validation, closed failure categories/precedence and chronology; preservation of every immutable common/policy field | The existing service accepts complete/failed candidates without changing its contract. No completed output with invalid/unobserved final identity, lost collection, pending cleanup or fabricated facts. |
| Timeout, downloads, shutdown, cleanup | One simple finite navigation/scan deadline, exact abort/late-work handling, page/context/browser close order and failure disposition, download refusal and temporary-resource ownership; relation to the existing service's bounded stop without changing it | Timeout/abort/fatal/cleanup failure cannot publish success; attempted resources close on terminal paths and uncertainty remains failure. No generic supervisor, global process kill, retry or hostile-page guarantee. |
| Real-browser test boundary | Exact import/callables, permissible test seams, six-state loader sharing the production capture/projection, separate navigation-test transport/profile, native-positive assertions and failure controls; no fabricated public run for offline fixtures | Actual pinned execution, all frozen expected nodes and corrected same-target positives; explicit fixture versus navigation provenance; doubles never substitute for the browser happy path. |
| Commands and ownership | Every `M103-CMD-*` slot below, absolute resolved runtime roots, network/permission needs, allowed metadata changes (normally None), artifact locations and safe cleanup | Exact executable checks and tests; inventories/receipts plus primary inspection show only authorized effects. No post-review invention of commands or lease scope. |

### Cumulative invariant packet

The expectations remain binding. Research and slice reviews have accepted the evidence below; the different final integrated review and closure have also passed. Baseline evidence alone does not prove implementation. Re-run the entire applicable packet after material revisions and all R3 corrections.

| ID / trigger | Required invariant and decisive case | Evidence / responsible reviewer |
| --- | --- | --- |
| M103-I1 — artifact completeness and authority | Explicit authorization, dependencies, frozen inputs, all literal/command slots and scopes; no shared-contract/ADR/status change or future task implied. Planning, decisions and runtime proof remain distinct. | Both research checkpoints and primary reconciliation PASS; final integrated review PASS. |
| M103-I2 — input and provider boundary | Malformed/credential/scheme rejection precedes run creation/navigation. Fresh state, no deliberate interaction/crawl, no accepted/retained download or app download path; provider mode is context only. | Scan S3 PASS; integrated review PASS; basic admission plus real-browser/source evidence. |
| M103-I3 — exact collection integrity | Four native arrays and exactly three rules validate; every violation/incomplete node preserved, missing coverage/unexpected rules/native errors fail, null/zero counts truthful; zero with native incompletes is not all-clear. | Both S3 reviews PASS; integrated review PASS; complete/malformed/multi-node/incomplete/zero cases. |
| M103-I4 — minimization and native measurements | Only existing public facts leave capture; source omissions keep items, fatal collection failure does not. Native checks and contrast provenance retained without recomputation; credentials, text, values, arbitrary attributes/HTML/native payload absent. | Both S3 reviews PASS; integrated review PASS; synthetic canaries plus real frozen evidence. |
| M103-I5 — stable identity and correspondence | Within-run IDs unique and not display indices/locators; identical locators do not merge items. Structural locator has unique actual correspondence or an exact unavailability reason, including unsupported shadow/drift cases. | Both S3 reviews PASS; integrated review PASS; unit and real DOM evidence. |
| M103-I6 — terminal ownership and failure | Immutable running context preserved; final URL/version/readiness/scan time actually observed. Success only after complete validation and confirmed closure. Timeout/shutdown/late work or uncertain cleanup never becomes completed/partial success. | Scan S3 PASS; integrated review PASS; lifecycle/failure tests and actual owned-resource checks. |
| M103-I7 — fixed evidence and honest scope | All six exact fixture states unchanged; same production capture/projection, native corrected positives, no gold metadata leakage or invented public provenance; separate navigation-test identity; no public smoke or comparison implementation. | Scan S3 PASS; integrated review PASS; manifest/byte checks and native assertions. |
| M103-I8 — execution ownership and recovery | Fresh guarded sequential Red/Green, fixed test ownership, exact commands/effects, bounded corrections, no unleased implementation, safe owned cleanup and consistent documentation/status. | Setup/slice reviews and primary acceptance PASS; final review, exact cleanup and documentation gate PASS. |

The historical R2 planning artifact selected none of those critical literals. Primary planning synthesis was `DRAFT READY` for structure and gates only; one fresh `independent_reviewer` reviewed that planning artifact. The subsequent execution instruction activated the separately required R3 route, whose evidence and authored artifact follow. The planning review is not reused as either critical research checkpoint.

## Authored literal contract — M103-LITERALS-001

**Artifact state: product and C4 command literals accepted after complete-artifact PASS and primary reconciliation; recovery and unchanged Red replay accepted.** These ordinary task literals implement the existing Accepted contract; they accept no ADR, extend no public schema and prove no runtime behavior. The primary selects the supported N2 native-reference route, B2 cancellation/late-disposal route and intercepted owned HTTPS test transport from the corrected synthesis. N1 needs additional conservative mutation tracking; B1 without cancellation cannot meet shutdown ownership; a TLS listener adds unnecessary certificate/trust ownership. No other candidate is selected. Reversal conditions and evidence sources are recorded in Research synchronization below.

### L3.1 Files, callables and public boundaries

Only these new files are authorized through their respective worker leases:

| Slice | Test-owned file | Production-owned file |
| --- | --- | --- |
| M103-NORMALIZE-01 | `tests/scan-normalization.test.ts` | `src/server/scan/normalize-scan.ts` |
| M103-SCAN-01 | `tests/scan-page.test.ts` | `src/server/scan/scan-page.ts` |

Optional browser helper: **None**. Package/configuration/fixture/manifest changes: **None**. Existing domain, persistence, service, entry point and tests remain protected. The source exports these concrete callables; type-only aliases may name their existing shapes:

```typescript
type ScanCollection = Pick<ScanResult,
  'coverage' | 'findings' | 'scannerReviewObservations'>;
type NormalizationResult =
  | { readonly ok: true; readonly value: ScanCollection }
  | { readonly ok: false; readonly error:
      'scanner' | 'result-validation' | 'coverage-validation' | 'evidence-capture' };
normalizeNativeScan(input: unknown): NormalizationResult;

type PreparedScan = Pick<RunningRun,
  'requestedUrl' | 'providerContext' | 'scanContext'>;
prepareScanRequest(url: unknown, mode: unknown):
  | { readonly ok: true; readonly value: PreparedScan }
  | { readonly ok: false; readonly error: 'invalid-url' | 'invalid-mode' };
captureNativeScan(page: Page): Promise<unknown>;
executeScan(run: RunningRun, signal: AbortSignal): Promise<TerminalRun>;
```

`ScanResult` comes from the unchanged domain module; `RunningRun` and `TerminalRun` already come from the persistence module; `Page` is the selected Playwright type. The normalizer returns a detached allowlisted collection, not a public complete ScanResult with invented context. `captureNativeScan` is the one internal production/test seam: its full native payload is transient solely for normalization and controlled test assertions. It is never a terminal record, provider payload, diagnostic, snapshot or archive. No generic transport/scanner adapter, public fixture parameter, production fault flag or additional callable is needed.

Only successful preparation may later be passed to the existing service's `runScan(prepared.value, executeScan)`. M1-03 does not wire that call into HTTP or the entry point. New service execution/storage effects are **None**: callback assignability plus actual terminal/domain validation and assertions covering every immutable/monotonic field in `service.ts` establish this task's compatibility, while unchanged M1-02 execution evidence proves service behavior. Static typing alone is insufficient. M1-05 owns production integration and the trusted public-page smoke.

### L3.2 Exact native execution and consumed structure

Use public `AxeBuilder({page, axeSource})`, `setLegacyMode(true)`, separate `.exclude('iframe')` and `.exclude('frame')`, and these exact options:

```typescript
{
  runOnly: { type: 'rule', values: ['image-alt', 'label', 'color-contrast'] },
  reporter: 'm103-native-dom-v1',
  resultTypes: ['violations', 'incomplete', 'passes', 'inapplicable'],
  selectors: true,
  ancestry: false,
  xpath: false,
  absolutePaths: false,
  elementRef: true,
  iframes: false
}
```

Append the application reporter registration to the installed axe source through the supported constructor. Register with public `axe.addReporter`; obtain `axe.getReporter('v1')` when the named reporter is invoked and delegate the native aggregation to it. Inside its completion callback, synchronously project the actual native `node.element` into each violation/incomplete node's application-owned `capturedDom`, then remove element references from every native bucket's nodes and check-related nodes before integration serialization. Do not invoke application-direct `axe.run`, override a private builder method, replace rule/check implementations or change contrast defaults.

The legacy integration injects source into frame documents before analyzing the main page. `iframes:false` and exclusions govern rule execution/collection; this contract does **not** claim zero frame injection. The required real test must show no child-frame rule results. The supported integration's documented legacy limitations remain disclosed. The capture is completion-time evidence, not an immutable DOM snapshot during asynchronous scanning.

| Consumed boundary | Exact disposition |
| --- | --- |
| Root and metadata | Ordinary object (Object.prototype or null), `testEngine.name === 'axe-core'`, `testEngine.version === '4.13.0'`, and `toolOptions` exactly equal the object above, including ordered arrays and no extra option keys. Missing/malformed identity/options are `result-validation`. Unused native root/engine metadata is ignored, never copied. |
| Four buckets | Require all four arrays. Each has Array.prototype, ordinary length and dense own enumerable data indices with no extra keys. Each entry is an ordinary record with a string `id` and a dense `nodes` array of ordinary node records. Missing/malformed consumed containers are `result-validation`. |
| Native errors | After safe container inspection and before interpreting ordinary incomplete nodes or coverage, an emitted non-null/non-undefined native rule `error` in any bucket fails as `scanner`. Do not inspect or return error prose. An uninspectable consumed error property is a structure defect, not a clean incomplete. |
| Rules and coverage | Only image-alt, label and color-contrast. A rule may appear in several different buckets but never twice within one bucket. Unexpected/duplicate rules, missing all-bucket coverage, non-inapplicable zero-node entries, or inapplicable zero alongside another bucket for that rule are `coverage-validation`. |
| Counts and collections | Absent rule in a bucket becomes null; present rule becomes exact nodes.length. Inapplicable zero is explicit and valid only when that rule's other buckets are absent. Preserve every violation and incomplete node, in bucket/rule/node order, without limits, merging, filtering or locator deduplication. Retain other bucket nodes only transiently. |
| Capture envelope | Image/label: `capturedDom:{locator,evidence}`; contrast: `capturedDom:{locator}`. Missing, non-record or uninspectable whole envelope fails `evidence-capture`. A missing/malformed individual fact or evidence/nameSources subcontainer produces its applicable missing/invalid facts and preserves the node and valid siblings. Unknown keys never enter output. |
| Fatal application capture | Exact internal sentinel `{captureFailure:'evidence-capture'}` contains no other property and maps to `evidence-capture`. A fatal application reporter-projection failure may return that sentinel. Other integration rejection is `scanner`; never classify arbitrary exception messages. |

Read consumed properties through own enumerable data descriptors; do not invoke getters or retain caller aliases. Ignore opaque fields outside the consumed allowlist rather than recursively validating native HTML/messages/metadata. Catch inspection exceptions as the corresponding closed failure or per-fact invalid disposition. No claim is made that hostile Proxy traps have no side effects. Root/profile/container failure precedes projection; native rule errors precede coverage; coverage precedes individual projection. These rules never convert collection loss into unavailable individual evidence.

Each Finding receives one `crypto.randomUUID()` independent of rule, locator and position; verify uniqueness before returning success. UUID acquisition failure or collision fails `result-validation`; do not repair it with an index or retry-generated identity. Observations have no generated ID. Existing M1-01 L1.5–L1.10 shapes, allowed reasons and final validators remain controlling.

### L3.3 Check groups and minimized evidence

Read actual native `any`, `all`, and `none` arrays. Keep their ID order and group membership. Allowed image `any` IDs are `has-alt`, `aria-label`, `aria-labelledby`, `non-empty-title`, `presentational-role`; its `none` allows only `alt-space-value`. Label `any` allows `implicit-label`, `explicit-label`, `aria-label`, `aria-labelledby`, `non-empty-title`, `non-empty-placeholder`, `presentational-role`; its `none` allows only `hidden-explicit-label`. Contrast `any` allows only `color-contrast`, and `none` must be empty. Every `all` group must be empty.

Absent/undefined/null group gives checks unavailable/missing. Malformed groups/entries/IDs, wrong-group or unknown IDs, duplicates within a group, nonempty all, or collectively empty available groups give unavailable/invalid. Invalid dominates missing when both occur. Native booleans, messages, HTML and check-data prose are not retained in checks. Missing native target/check/measurement facts never remove the parent node.

Contrast measurements use exactly one safely identifiable `color-contrast` check from native `any`, independently of unusable unrelated groups. An absent check/source gives missing measurements; malformed or ambiguous source gives invalid measurements, never an arbitrary first match. Absent/undefined/null whole `data` gives missing measurements; a non-record/uninspectable data container gives invalid measurements. Within a valid data record, preserve valid siblings independently:

| Native field | Public field and exact mapping |
| --- | --- |
| fgColor, bgColor, shadowColor | foregroundColor, backgroundColor, shadowColor; available only for the existing lowercase six-digit `^#[0-9a-f]{6}$` grammar. |
| contrastRatio | Exact finite native number in [1,21]; no coercion, rounding, clamp, recomputation or null arithmetic. |
| expectedContrastRatio | Exact native strings `3:1` and `4.5:1` map losslessly to 3 and 4.5; other values invalid. |
| fontSize | Exact M1-01 L1.9 grammar, at most 64 characters: one fractional pt digit, ordinary decimal px, finite pt >=0 and px >0. |
| fontWeight | Exact normal or bold. |
| messageKey | Existing fifteen-key M1-01 L1.9 allowlist only. Absent/undefined/null is missing; unknown string is withheld; other malformed value is invalid. |
| Measurement omission | Absent/undefined individual measurement is missing; explicit null is invalid. Missing shadow is not not-applicable. |

`measurementSource` is axe-core. A contrast observation's incompleteReason exactly equals its messageKey fact. For image/label incomplete observations, nonempty native failure-summary/check-message prose produces unavailable/withheld; otherwise missing. Never retain the prose itself. Invalid unrelated check-group metadata does not erase a uniquely sourced valid measurement.

The captured DOM fields use the existing exact M1-01 image/label shapes. Copy only their allowed fact values/reasons. An unavailable label element kind requires unavailable input type; known textarea requires not-applicable; known input permits only the existing input-type enum or ordinary unavailable. Missing/malformed individual source facts remain missing/invalid without invented defaults. Raw target selectors, IDs, attribute values, names, form values, page text, URLs, HTML, related nodes and exception material never enter Finding/observation evidence.

### L3.4 Actual-element capture and structural locator

Require an actual connected Element whose ownerDocument is the analyzed document. Missing native reference yields missing DOM facts; wrong or detached reference yields invalid facts. Never substitute a selector match for the native reference. For a valid reference:

- Walk actual parentElement links to document.documentElement. Count each element's one-based index among element siblings and construct exactly `:root > :nth-child(N)...`, with `:root` alone for the document element. Require one document match and reference equality. Shadow-root paths are unsupported; mismatch/nonuniqueness/malformed ancestry is invalid; length above 2048 is too-long without truncation. Unsupported shadow locators do not discard independently available direct facts.
- Image kind is an actual HTML img. Classify `getAttribute('alt')` as absent, empty, whitespace-only or non-empty, using ECMAScript trim only to classify whitespace. Do not retain its text.
- Label kind is an actual HTML input or textarea. For input read actual browser-normalized `.type` and validate the existing 22-value enum; never infer a text default from a missing reference. Textarea inputType is not-applicable.
- Explicit/implicit label booleans use actual associated labels with `label.control === element`: explicit has a `for` attribute; implicit has no `for` and contains the element. `labels:null` means no associated labels. Do not derive these facts from missing axe check IDs.
- For aria-labelledby, absent attribute means absent; tokenize ASCII whitespace (`tab`, LF, form feed, CR, space). No nonempty token means empty; none/some/all referenced IDs resolving within the element's actual tree means unresolved/partially-resolved/resolved. Keep no ID or target text and claim no naming adequacy.
- aria-label, title and placeholder use the same four attribute states. Declared presentationalRole is true when an ASCII-whitespace-separated role token is exactly presentation or none, false otherwise; this is not a computed-role assertion.
- Per-field DOM read failure gives invalid, retaining independently valid siblings. Unsupported element kind does not authorize guessed kind/type values. No raw DOM exception leaves capture.

### L3.5 Admission and fixed browser profile

Preparation is synchronous and has no run creation, clock, ID, browser, filesystem, network or provider effect. Reject a non-string URL without coercion. Use standard `new URL`; require HTTPS, nonempty host and empty parsed username/password, then return canonical href. URL error takes precedence over mode error. Accept exactly local and groq: local/ollama/qwen3.5:4b or groq/groq/openai/gpt-oss-20b. Mode is immutable configuration only; no provider probe/default/fallback/call occurs.

Initial scanContext has finalUrl/scannedAt/browserVersion unavailable/missing; scannerVersion 4.13.0; evidencePolicyVersion m1-public-v1; ordered exact rules; scope current-rendered-top-level-document; readiness load; readinessReached false; viewport 1280x720; locale en-US; timeoutMs 10000; freshContext true; importedState/interaction/crawling/iframes false; cleanup pending; contrastProfile axe-core-4.13.0-default.

| Boundary | Exact settings |
| --- | --- |
| Launch | `chromium.launch({headless:true,channel:'chromium',timeout:10000,args:[],handleSIGINT:false,handleSIGTERM:false,handleSIGHUP:false})`; pinned default arguments unchanged. |
| Context | viewport 1280x720, locale en-US, timezoneId UTC, deviceScaleFactor 1, colorScheme light, forcedColors none, reducedMotion no-preference, acceptDownloads false, permissions [], serviceWorkers block, offline false, javaScriptEnabled true, ignoreHTTPSErrors false, bypassCSP false. |
| Excluded options/effects | No persistent context, imported state, authentication, client certificates, custom headers, proxy, user agent, executable override, browser logger, tracing, HAR, video, app download path, download save/path call, interaction, crawling or provider invocation. |
| Backend scratch prerequisite | Derive repository-relative `temp/m103-scan` from the source location. Before acquisition require process os.tmpdir() to equal that ordinary empty directory, with ordinary real ancestors and no alias/reparse ambiguity. Setup creates it before Node starts; production does not create the root, change environment, require the task browser-cache name or hardcode a user path. The existing service's serialization and exclusive test-process ownership permit sequential reuse only after confirmed closure/emptiness. |

Missing/unsafe/nonempty scratch is browser failure with cleanup failed: ownership cannot be established, so do not clear it. This backend prerequisite must be carried into M1-05's integration/developer setup. It is not an installer or general product configuration subsystem.

### L3.6 Observation sources and terminal ownership

`executeScan` validates input with unchanged validateRun before effects. Malformed/non-running input rejects fixed `Error('invalid-run')`; invalid AbortSignal rejects fixed `Error('invalid-signal')`, with no input/exception echo. A valid RunningRun with unsupported initial/profile fields returns a validated result-validation failure preserving its common/policy fields; with no resources owned, cleanup is closed. An already-aborted valid initial input returns shutdown without acquisition and with closed cleanup. Observed abort has terminal category priority.

| Observation point | Exact source and availability |
| --- | --- |
| Before acquisition | All three observations missing; readiness false. |
| Browser acquired and registered, before context | Read browser.version() synchronously once. Preserve the actual string only if existing BrowserVersion grammar (`^[0-9]+(?:\.[0-9]+){0,3}$`, <=64) passes. Malformed/read failure is invalid and browser failure; unacquired browser remains missing. Do not substitute manifest version. |
| Navigation | `page.goto(requestedUrl,{waitUntil:'load',timeout:remainingWorkMs})`. Readiness becomes true only after fulfillment while active and before deadline/abort. Navigation rejection/timeout/abort before fulfillment leaves false; later failure does not regress true. |
| Completed native report, while work remains active | Immediately after capture fulfills, before normalization/terminal assembly, read own-data `url` and `timestamp` from that **same** native v1 report. Ordinary root, axe-core 4.13.0 identity and exact toolOptions establish its report boundary. Validate URL against existing canonical credential-free HTTPS grammar and timestamp against existing canonical millisecond UTC Time and >=createdAt. Valid native values remain unchanged as finalUrl/scannedAt. Later page.url() never replaces report identity, including during cleanup or later navigation. |
| Missing/invalid native metadata | Absent/undefined is missing; null, wrong type, accessor, inspection failure, noncanonical value or timestamp before createdAt is invalid. Either unavailable fact prevents completion and gives result-validation unless an earlier phase failure already controls. Preserve valid siblings. Never use requestedUrl, current Node time or a clamped value to fill those facts. |
| Invalid native collections after report completion | Preserve independently valid report URL/time, observed version and readiness. Normalization's closed failure category remains the first phase failure; no collection escapes. Malformed report envelope or captureFailure sentinel establishes no available report timestamp. |
| Navigation/scanner failure, malformed envelope, sentinel, timeout or abort before accepted report | scannedAt remains missing. If Page was acquired, take one best-effort synchronous page.url() at failure disposition before closure, retaining actual valid href or missing/invalid by the same grammar. This is failed-context last-observed page identity only, never collection provenance. No Page means missing. Retain only already observed version/readiness. No asynchronous probe or substitution. |
| Timeout/abort after accepted report | Preserve the report's paired URL/time. A fulfillment after cancellation is observed only for settlement/disposal; it never updates retained observations or publishes a collection. |
| Terminal time | After cleanup, finishedAt is the canonical maximum of finite Date.now(), createdAt and retained valid scannedAt. If current wall-clock input is invalid, only legitimate existing times may supply terminal chronology. This does not create a scannedAt observation. |

One cooperative **10000 ms work deadline** covers browser/context/page acquisition, navigation, capture and normalization. Navigation receives remaining time, never zero (Playwright zero would disable its timeout). Check cancellation/deadline at every continuation and after synchronous normalization. Observe all operation promises. Store acquired resources before cancellation checks; late acquisition starts no scan work and receives observed idempotent disposal.

Once work settles, fails, times out or aborts, stop its timer and enter one **4000 ms cleanup deadline**, with the AbortSignal still effective through terminal construction. Close page, context and browser in order, capping each wait by both its allowance and remaining total: page 500 ms, context 1000 ms, browser 1500 ms. Attempt later closes despite earlier rejection/timeout. The remaining total observes pending acquisitions/work/close settlement and checks scratch. Closed requires fulfilled owned closes, closed page when acquired, browser disconnected when acquired, no unsettled operation and empty ordinary scratch. Empty directories or disappearance of a process name alone are insufficient.

Any close rejection/deadline, unsettled acquisition/work/close, missing ownership proof or residue permanently makes cleanup failed. Later settlement cannot upgrade a returned disposition. Observe best-effort disposal of resources acquired after the terminal deadline without publishing results or logging raw errors. Preserve uncertain residue; no supervisor, global process kill, retry or cleanup sweep is authorized. Cooperative timers do not guarantee OS-level termination or protect against event-loop stalls/hostile pages. The 4000 ms budget fits the service's existing 5000 ms stop budget under those stated limits, without changing service behavior.

Failure precedence is observed shutdown, otherwise the first phase failure, otherwise cleanup when cleanup failed. Browser acquisition/version/scratch failures map to browser; navigation rejection to navigation; deadline to timeout; integration rejection/native rule error to scanner; application sentinel to evidence-capture; normalization to its closed category; invalid final provenance/chronology/terminal validation to result-validation. Never author initial-persistence. Failed records have no success collections. Build completion only after all collection/provenance/closure conditions pass, call unchanged validateScan and validateRun, preserve every common/fixed policy field, and return only their validated terminal shape. An inability to construct any valid terminal from the validated input rejects fixed `Error('invalid-run')`, never a raw object or partial success.

### L3.7 Real evidence and permitted test controls

Run the six unchanged manifest states once per accepted browser evidence batch through actual `captureNativeScan` and `normalizeNativeScan`. Load exact manifest-equal fixture bytes with offline setContent/waitUntil load, the manifest readiness marker/target/image assertions and manifest context profile. Abort every routed request and fail a gold case on any request. Keep actual about:blank identity; do not assemble a public ScanResult/Run from these pages. Assert every expected native failing node and corrected same-target native pass, including actual target correspondence; an empty violation list alone is insufficient. Keep native passes transient.

Label this **M1-03 implementation capture profile m103-native-dom-v1**: reporter wrapper and elementRef true differ from historical RD-003 reporter v1/elementRef false. Underlying native v1 aggregation, exact rules, default contrast, fixture bytes and expected outcomes remain unchanged. No manifest/gold metadata is substituted for observations. This is new implementation evidence, not an identical RD-003 run or a statistical repeatability claim.

For public execution tests, use serial test-local `mock.method` wrappers around actual chromium.launch/browser.newContext. Install context.route before page creation, fulfill only test-authored content with status 200 at `https://m103.test/...`, and abort every other request. **HTTP 3xx responses and Location headers are forbidden in these intercepted tests:** Chromium redirect continuations can bypass user routing. Never route.continue/fetch or contact an external target. Keep production profile values, including offline false and strict HTTPS settings; intercepted transport does not establish public DNS/TLS reachability or HTTP-redirect behavior. Production's ordinary navigation/redirect behavior remains unchanged.

For direct-reference correspondence cases, a test-local wrapper around actual page.evaluate may append a wrapper around the public native v1 reporter to the injected source. It still delegates native v1 and preserves collection, but can detach/replace the actual reported element immediately before the production reporter projects it. Production obtains getReporter('v1') at invocation. No new export, second scanner, private override or production fault flag is permitted. Restore all wrappers serially. Shadow/duplicate/missing/ambiguous/overlength targets and privacy canaries are small synthetic controls, not new gold families.

The provenance counterexample obtains actual report A and permits a **separate intercepted navigation** to owned page B before execution receives that report, without an HTTP redirect: output must retain A's paired native URL/time or fail safely, never associate A's collection with B's page URL. Browser doubles may cover finite failure/late-settlement paths but never replace the real six-state, navigation, fresh-state, iframe-exclusion or download-denial evidence. Test ordinary missing facts separately from fatal collection/capture loss. No raw native/error logging, snapshots, screenshots, traces or archives are permitted.

Required proof includes before-effect URL/mode rejection; both exact provider contexts with no calls; full/malformed/multi-node/zero/incomplete collections; independent IDs and duplicate locators; each unavailable mapping and canary exclusion; real DOM correspondence; fresh state and download denial; actual provenance; browser/navigation/scanner/capture failure; deadline; abort before/during/after native work; late acquisition; close rejection/timeout; swallowed temporary-delete failure; invalid report time/URL and the A-to-B counterexample. Use a coherent set of tests, not a provider/rule/failure Cartesian matrix.

### L3.8 Exact commands, environment and effects

All commands run from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. The selected Node executable is `C:/nvm4w/nodejs/node.exe`; npm.cmd resolves beside it; Python is `C:/Users/mmjos/AppData/Local/Programs/Python/Python312/python.exe`. Expected versions are 24.20.0, 11.19.0 and 3.12.10. No dependency restore is needed or authorized. Reuse the exact `$toolchainOptions` array in Concrete Steps; it confines npm's declared cache to existing `temp/rd002-npm-cache` and disables lifecycle/install/audit/funding/update behavior for these run commands.

**M103-CMD-ENV.** Before Node/npm commands, run this name-only environment check. It is a developer-command prerequisite, not production configuration machinery:

```powershell
$m103FixedReject = @(
  'NODE_OPTIONS','NODE_DEBUG','NODE_DEBUG_NATIVE','NODE_COMPILE_CACHE',
  'NODE_V8_COVERAGE','NODE_REDIRECT_WARNINGS','DEBUG','DEBUG_FILE',
  'PWDEBUG','PWDEBUGIMPL','SELENIUM_REMOTE_URL',
  'SELENIUM_REMOTE_CAPABILITIES','SELENIUM_REMOTE_HEADERS'
)
$m103Controlled = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_GC',
  'PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT')
$m103Rejected = @(Get-ChildItem Env: -ErrorAction Stop | Where-Object {
  $m103Name = $_.Name
  $m103Alias = $m103Name -match '^(?i:npm_config_|npm_package_config_)'
  $m103Base = $m103Name -replace '^(?i:npm_config_|npm_package_config_)',''
  ($m103FixedReject -contains $m103Base) -or
    (($m103Base -match '^(?i:PLAYWRIGHT_|PWTEST_|PW_)') -and
      ($m103Alias -or $m103Controlled -notcontains $m103Base))
} | Select-Object -ExpandProperty Name)
if ($m103Rejected.Count -ne 0) {
  throw ('Unsupported command environment names: ' + ($m103Rejected -join ', '))
}
$m103Repo = (Resolve-Path -LiteralPath '.' -ErrorAction Stop).Path
if ($m103Repo -ine 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab') {
  throw 'Wrong M1-03 working directory'
}
$m103Runtime = Join-Path $m103Repo 'm103-browser-runtime'
$m103Browsers = Join-Path $m103Runtime 'browsers'
$m103SetupTemp = Join-Path $m103Repo 'temp/m103-setup'
$m103ScanTemp = Join-Path $m103Repo 'temp/m103-scan'
$m103Node = 'C:/nvm4w/nodejs/node.exe'
```

**Every npm invocation in this plan requires process-local compilation-cache disabling before npm starts.** This includes `npm.cmd --version`, baseline and normalization tests, independent typechecking, scan tests and the full suite. The npm lines in later examples are the inner invocations to place inside the applicable wrapper, never standalone permission to bypass it. Keep their arguments unchanged. The six-variable wrapper below governs setup/browser commands; all other npm invocations use this nonbrowser wrapper:

```powershell
$m103SavedCompileCache = [Environment]::GetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','Process')
try {
  [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','1','Process')
  # Execute only the applicable exact nonbrowser command; inspect LASTEXITCODE.
} finally {
  if ($null -eq $m103SavedCompileCache) {
    [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE',[NullString]::Value,'Process')
  } else {
    [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE',$m103SavedCompileCache,'Process')
  }
}
if ([Environment]::GetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','Process') -cne $m103SavedCompileCache) {
  throw 'Process environment restore mismatch: NODE_DISABLE_COMPILE_CACHE'
}
```

The nonbrowser wrapper assigns only `NODE_DISABLE_COMPILE_CACHE`, preserving absent/empty/nonempty prior values. It does not assign TEMP/TMP or any browser variable, create a temporary root or enable browser execution. Run the no-write disabling diagnostic below once under this wrapper before accepting the C4 correction; compare the process TEMP/TMP and three controlled browser variables before/after without printing their values, and require the recorded scratch/browser inventories unchanged. The existing version command may then run once under the same wrapper with the same restoration/inventory checks to verify the actual npm path; expected output is 11.19.0. Bare npm is not a read-only preflight command.

For setup or a browser command, preserve and restore exactly these six process values. Set `$m103CommandTemp` to `$m103SetupTemp` for acquisition or `$m103ScanTemp` for browser tests **before** starting Node. Normalization-only commands use the nonbrowser wrapper above; they do not change TEMP/TMP or launch a browser.

```powershell
$m103EnvNames = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_GC',
  'PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','TEMP','TMP','NODE_DISABLE_COMPILE_CACHE')
$m103SavedEnv = @{}
foreach ($m103Name in $m103EnvNames) {
  $m103SavedEnv[$m103Name] = [Environment]::GetEnvironmentVariable($m103Name,'Process')
}
try {
  [Environment]::SetEnvironmentVariable('PLAYWRIGHT_BROWSERS_PATH',$m103Browsers,'Process')
  [Environment]::SetEnvironmentVariable('PLAYWRIGHT_SKIP_BROWSER_GC','1','Process')
  [Environment]::SetEnvironmentVariable('PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','30000','Process')
  [Environment]::SetEnvironmentVariable('TEMP',$m103CommandTemp,'Process')
  [Environment]::SetEnvironmentVariable('TMP',$m103CommandTemp,'Process')
  [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','1','Process')
  # Execute only the applicable exact command below; inspect LASTEXITCODE.
} finally {
  foreach ($m103Name in $m103EnvNames) {
    if ($null -eq $m103SavedEnv[$m103Name]) {
      [Environment]::SetEnvironmentVariable($m103Name,[NullString]::Value,'Process')
    } else {
      [Environment]::SetEnvironmentVariable($m103Name,$m103SavedEnv[$m103Name],'Process')
    }
  }
}
foreach ($m103Name in $m103EnvNames) {
  if ([Environment]::GetEnvironmentVariable($m103Name,'Process') -cne $m103SavedEnv[$m103Name]) {
    throw ('Process environment restore mismatch: ' + $m103Name)
  }
}
```

`[NullString]::Value` preserves an originally absent variable when calling the .NET string overload from PowerShell; an empty saved string remains empty. The postcondition reports only a variable name, never its value. The selected managed executable is `$m103Browsers/chromium-1234/chrome-win64/chrome.exe`; manifest revision 1234/version 151.0.7922.34. Browser setup may skip only when fresh identity/inventory/ownership evidence proves this exact selected runtime available. The global cache is never acquired into or cleared.

The sixth saved process variable disables Node's compilation cache before npm starts: the installed npm CLI otherwise calls `enableCompileCache()` and creates `node-compile-cache` under the process temporary root. This control changes neither npm's declared content-cache path nor the scratch-emptiness requirement. Before the owner-authorized replay, run this no-write diagnostic once under the same wrapper with m103CommandTemp=m103ScanTemp, comparing the preserved scratch/browser inventories before and after. The environment check precedes the API call, so missing disabling configuration cannot enable a cache accidentally. An unexpected result stops recovery; never retry by permitting cache residue.

```powershell
& $m103Node --input-type=module --eval "import { constants, enableCompileCache, getCompileCacheDir } from 'node:module'; if(process.env.NODE_DISABLE_COMPILE_CACHE!=='1')throw Error('Compile-cache disabling prerequisite missing'); if(enableCompileCache().status!==constants.compileCacheStatus.DISABLED || getCompileCacheDir()!==undefined)throw Error('Compile cache unexpectedly enabled'); console.log('Compile cache disabled');"
if ($LASTEXITCODE -ne 0) { throw 'Compile-cache diagnostic failed' }
```

**M103-CMD-PREFLIGHT.** Safe commands are `git status --short`, `git rev-parse HEAD`, the version commands in Concrete Steps with `npm.cmd --version` inside the nonbrowser wrapper above, and the following exact protected-path hashes and read-only identities/import checks. Bare npm is excluded from this read-only allowance. A later slice additionally fingerprints its already accepted new source/test files by their exact L3.1 paths.

```powershell
$m103Protected = @(
  'src/server/domain/run-contract.ts','src/server/persistence/run-repository.ts',
  'src/server/service.ts','src/server/main.ts','tests/run-contract.test.ts',
  'tests/run-repository.test.ts','tests/local-service.test.ts',
  'tests/helpers/m102-run-fixture.ts','package.json','package-lock.json',
  'tsconfig.json','vite.config.ts','evaluation/rd003-scan-v1.json',
  'fixtures/rd003/form-input-label/corrected.html',
  'fixtures/rd003/form-input-label/failing.html',
  'fixtures/rd003/informative-image-alt/corrected.html',
  'fixtures/rd003/informative-image-alt/failing.html',
  'fixtures/rd003/text-contrast/corrected.html',
  'fixtures/rd003/text-contrast/failing.html'
)
Get-FileHash -Algorithm SHA256 -LiteralPath $m103Protected -ErrorAction Stop
& $m103Node --input-type=module --eval "import fs from 'node:fs'; const p=JSON.parse(fs.readFileSync('package.json','utf8')); for(const [name,version] of Object.entries({...p.dependencies,...p.devDependencies})){const actual=JSON.parse(fs.readFileSync('node_modules/'+name+'/package.json','utf8')).version;if(actual!==version)throw Error('Pinned package mismatch');console.log(name+' '+actual)}; const b=JSON.parse(fs.readFileSync('node_modules/playwright-core/browsers.json','utf8')).browsers.find(x=>x.name==='chromium'); console.log(JSON.stringify({revision:b.revision,version:b.browserVersion,axe:JSON.parse(fs.readFileSync('node_modules/axe-core/package.json','utf8')).version}));"
& $m103Node --input-type=module --eval "import fs from 'node:fs';const m=JSON.parse(fs.readFileSync('evaluation/rd003-scan-v1.json','utf8'));if(!m.cases.every(c=>fs.readFileSync(c.path).equals(Buffer.from(c.content,'utf8'))))throw Error('Frozen fixture mismatch');console.log('Six fixture byte sequences match');"
& $m103Node --input-type=module --eval "await import('./src/server/scan/normalize-scan.ts');"
& $m103Node --input-type=module --eval "await import('./src/server/scan/scan-page.ts');"
```

Use only the selected slice's import check after static inspection confirms a side-effect-free import. The absent first module is expected to fail with ERR_MODULE_NOT_FOUND at that exact path; any dependency/runtime failure is not Red. Read-only preflight never creates the source/test or cache/root; its npm version check requires the nonbrowser wrapper. After a test-owned Red write, independently parse its exact file with `& $m103Node --check tests/scan-normalization.test.ts` or `& $m103Node --check tests/scan-page.test.ts`; then run the selected focused command inside its applicable wrapper. First-module Red requires complete assertions and explicitly records them unexecuted until Green. No skip/only/todo or placeholder production file is permitted.

**M103-CMD-CLEAN-STATE.** Before first setup require the three exact task roots absent. Verify containment and ordinary ancestors/contents with these read-only helpers; they may be reused immediately before exact cleanup. Never traverse a detected link/reparse point. An interrupted existing attempt requires reconciliation with its recorded ownership, not automatic deletion.

```powershell
function Assert-M103OwnedPath([string]$m103Target) {
  $ErrorActionPreference = 'Stop'
  $m103Full = [IO.Path]::GetFullPath($m103Target)
  $m103Prefix = $m103Repo.TrimEnd('\') + '\'
  if (-not $m103Full.StartsWith($m103Prefix,[StringComparison]::OrdinalIgnoreCase)) {
    throw 'M1-03 target escapes repository'
  }
  $m103Current = $m103Full
  while ($m103Current) {
    if (Test-Path -LiteralPath $m103Current -ErrorAction Stop) {
      $m103Item = Get-Item -LiteralPath $m103Current -Force -ErrorAction Stop
      if (-not $m103Item.PSIsContainer -or
        ($m103Item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
        throw 'Nonordinary M1-03 target or ancestor'
      }
      if ((Resolve-Path -LiteralPath $m103Current -ErrorAction Stop).Path -ine $m103Current) {
        throw 'M1-03 path alias'
      }
    }
    $m103Parent = [IO.Directory]::GetParent($m103Current)
    if ($null -eq $m103Parent) { break }
    $m103Current = $m103Parent.FullName
  }
}
function Get-M103Inventory([string]$m103Target) {
  $ErrorActionPreference = 'Stop'
  Assert-M103OwnedPath $m103Target
  if (-not (Test-Path -LiteralPath $m103Target -PathType Container -ErrorAction Stop)) {
    throw 'M1-03 inventory root must exist as an ordinary directory'
  }
  $m103Queue = [Collections.Generic.Queue[string]]::new()
  $m103Queue.Enqueue($m103Target)
  while ($m103Queue.Count -gt 0) {
    foreach ($m103Item in Get-ChildItem -LiteralPath $m103Queue.Dequeue() -Force -ErrorAction Stop) {
      if ($m103Item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw 'Unexpected M1-03 reparse point'
      }
      if ($m103Item.PSIsContainer) {
        [pscustomobject]@{ Path=$m103Item.FullName; Kind='directory'; Length=0; Hash=$null }
        $m103Queue.Enqueue($m103Item.FullName)
      }
      else {
        $m103FileHash = Get-FileHash -Algorithm SHA256 -LiteralPath $m103Item.FullName -ErrorAction Stop
        if ($null -eq $m103FileHash -or $m103FileHash.Hash -notmatch '^[0-9A-Fa-f]{64}$') {
          throw 'M1-03 inventory hash is unavailable'
        }
        [pscustomobject]@{ Path=$m103Item.FullName; Kind='file'; Length=$m103Item.Length;
          Hash=$m103FileHash.Hash }
      }
    }
  }
}
foreach ($m103Target in @($m103Runtime,$m103SetupTemp,$m103ScanTemp)) {
  Assert-M103OwnedPath $m103Target
  if (Test-Path -LiteralPath $m103Target -ErrorAction Stop) { throw 'Existing M1-03 root needs ownership reconciliation' }
}
```

**M103-CMD-SETUP.** Under only the setup code_worker's guarded root `m103-browser-runtime`, create that root and its browsers child; separately declare exact ignored effects `temp/m103-setup` and `temp/m103-scan`, never as guard allow-roots. All tracked files stay forbidden. After ownership checks:

```powershell
New-Item -ItemType Directory -Path $m103Runtime -ErrorAction Stop | Out-Null
New-Item -ItemType Directory -Path $m103Browsers,$m103SetupTemp,$m103ScanTemp -ErrorAction Stop | Out-Null
# Within the environment wrapper, m103CommandTemp = m103SetupTemp:
& $m103Node node_modules/playwright/cli.js install chromium --no-shell --dry-run
if ($LASTEXITCODE -ne 0) { throw 'Managed-browser dry-run failed' }
& $m103Node node_modules/playwright/cli.js install chromium --no-shell --no-progress
if ($LASTEXITCODE -ne 0) { throw 'Managed-browser acquisition failed' }
```

Inspect a successful dry-run before the one acquisition invocation. Expected artifacts are full Chromium 1234, ffmpeg 1011, winldd 1007, CLI .links/locks/install and dependency-validation markers, plus transient installer archives under setup scratch. Expected network is the installed official Playwright installer: Chromium `https://cdn.playwright.dev/builds/cft/151.0.7922.34/win64/chrome-win64.zip`; ffmpeg `https://cdn.playwright.dev/dbazure/download/playwright/builds/ffmpeg/1011/ffmpeg-win64.zip`; winldd `https://cdn.playwright.dev/dbazure/download/playwright/builds/winldd/1007/winldd-win64.zip`; documented fallback prefixes `https://playwright.download.prss.microsoft.com/dbazure/download/playwright/` and `https://cdn.playwright.dev/builds/`, with ordinary official CDN redirects. No custom host override is allowed. The CLI follows redirects; this is **not** an enforced destination allowlist. If environment permission requires such enforcement, stop rather than create network machinery. Normal network permission/escalation for this already authorized bounded acquisition remains applicable.

Connection timeout is 30000 ms and the pinned installer has five internal attempts. Additional retry invocation: None except the single authorized same-contract setup correction if needed. Installer total wall timeout: **None**; no supervisor or new termination machinery is added. Poll an ongoing command no less frequently than every 60 seconds; polling is not a timeout. Require installer/download children settled before accepting setup. Interruption or uncertain settlement preserves roots and blocks dependent browser work.

After setup inspect exact executable, package/browser identities, full cache file-path/length/SHA-256 inventory, and the ordinary empty scratch roots. Record Chromium `DEPENDENCIES_VALIDATED` identity/mtime; it must exist and stay under 30 days old before every browser command, with unchanged accepted cache inventory/content afterward. Missing/stale/changed marker returns to setup instead of skipping validation or allowing incidental cache mutation during scan work. No launch-only version query is authorized here; actual browser.version evidence belongs to bounded real scan tests. Record protected-file hashes and fresh compliant setup receipt, then obtain the S1 review.

Use these read-only commands after setup and before/after every browser command. Record the observed inventory digest and marker modification time as setup evidence; later invocations must equal that accepted record, not silently establish a replacement baseline. The in-memory inventory contains only task-owned file metadata/hashes, not file contents, and need not be written to disk.

```powershell
$m103Exe = Join-Path $m103Browsers 'chromium-1234/chrome-win64/chrome.exe'
$m103Marker = Join-Path $m103Browsers 'chromium-1234/DEPENDENCIES_VALIDATED'
if (-not (Test-Path -LiteralPath $m103Exe -PathType Leaf -ErrorAction Stop)) { throw 'Selected Chromium is absent' }
if (-not (Test-Path -LiteralPath $m103Marker -PathType Leaf -ErrorAction Stop)) { throw 'Browser validation marker is absent' }
$m103MarkerInfo = Get-Item -LiteralPath $m103Marker -Force -ErrorAction Stop
if ($m103MarkerInfo.LastWriteTimeUtc -le [DateTime]::UtcNow.AddDays(-30) -or
  $m103MarkerInfo.LastWriteTimeUtc -gt [DateTime]::UtcNow) {
  throw 'Browser validation marker freshness is invalid'
}
foreach ($m103Target in @($m103SetupTemp,$m103ScanTemp)) {
  Assert-M103OwnedPath $m103Target
  if (-not (Test-Path -LiteralPath $m103Target -PathType Container -ErrorAction Stop) -or
    @(Get-ChildItem -LiteralPath $m103Target -Force -ErrorAction Stop).Count -ne 0) {
    throw 'M1-03 scratch is absent or not empty'
  }
}
$m103Inventory = @(Get-M103Inventory $m103Runtime | Sort-Object Path)
$m103InventoryJson = ConvertTo-Json -InputObject $m103Inventory -Depth 3 -Compress -ErrorAction Stop
$m103InventoryDigest = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData(
  [Text.Encoding]::UTF8.GetBytes($m103InventoryJson)))
[pscustomobject]@{ InventoryDigest=$m103InventoryDigest; Entries=$m103Inventory.Count;
  MarkerTime=$m103MarkerInfo.LastWriteTimeUtc.ToString('o') }
```

The owner-authorized C3 recovery is a one-time primary operation between leases, after the revised artifact review passes and the diagnostic above confirms no writes. The original npm/test command exited and all test assertions were blocked at module resolution; no browser or test-owned asynchronous work began. Reconfirm that settlement evidence and unchanged browser inventory/marker, then use the helpers above to validate the exact preserved scan-scratch inventory before deleting only its compile-cache child. Preserve the scratch root, installed runtime, existing npm content cache and unrelated material. Missing or changed inventory, topology or settlement stops recovery without deletion.

```powershell
$m103CompileCache = Join-Path $m103ScanTemp 'node-compile-cache'
Assert-M103OwnedPath $m103ScanTemp
Assert-M103OwnedPath $m103CompileCache
$m103RecoveryInventory = @(Get-M103Inventory $m103ScanTemp | Sort-Object Path)
$m103RecoveryJson = ConvertTo-Json -InputObject $m103RecoveryInventory -Depth 3 -Compress -ErrorAction Stop
$m103RecoveryDigest = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData(
  [Text.Encoding]::UTF8.GetBytes($m103RecoveryJson)))
if ($m103RecoveryDigest -cne '1989BC1F606E5AFD39EBC88E653F3E7A47EB67BDA3CCCC9BF6123F72A78E2AB9') {
  throw 'Compile-cache recovery inventory changed'
}
if (@(Get-ChildItem -LiteralPath $m103ScanTemp -Force -ErrorAction Stop).Count -ne 1 -or
  -not (Test-Path -LiteralPath $m103CompileCache -PathType Container -ErrorAction Stop)) {
  throw 'Compile-cache recovery scope changed'
}
Remove-Item -LiteralPath $m103CompileCache -Recurse -ErrorAction Stop
if (Test-Path -LiteralPath $m103CompileCache -ErrorAction Stop) { throw 'Compile-cache recovery incomplete' }
if (@(Get-ChildItem -LiteralPath $m103ScanTemp -Force -ErrorAction Stop).Count -ne 0) {
  throw 'Scan scratch is not empty after recovery'
}
```

**M103-CMD-BROWSER.** Under the environment wrapper with m103CommandTemp=m103ScanTemp, run the exact existing script:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/scan-page.test.ts
npm.cmd @toolchainOptions run typecheck
```

The full authoritative closure command is the five-file command in Concrete Steps under the same browser environment; its existing M1-02 suites retain only their previously accepted synthetic-root, loopback/listener/entry-child effects and cleanup. The new scan suite adds no service root/listener/provider or external page. Browser scratch/profile effects are restricted to exact `temp/m103-scan` and separately inspected outside the source/test-only guard. Require ordinary empty scratch and unchanged cache before each command, sequential exclusive browser-suite ownership, fulfilled browser closure and empty scratch plus unchanged cache afterward. Reuse an isolated evidence batch only with exact command, tree, environment, fixture, inventory and closure identity; otherwise rerun the affected check. Output consists of content-safe test results/counters, not native payloads.

**M103-CMD-CLEANUP.** After final accepted browser evidence and confirmed owned process/resource settlement, the primary performs operational removal of only these task-created artifacts between leases. Revalidate exact ownership/topology and inspect inventory immediately before deletion. This is artifact cleanup, not a source/dependency-metadata edit or a worker turn. On uncertainty preserve the roots and report it; never use process names alone or force closure by deleting profiles.

```powershell
foreach ($m103Target in @($m103SetupTemp,$m103ScanTemp,$m103Runtime)) {
  Assert-M103OwnedPath $m103Target
  if (-not (Test-Path -LiteralPath $m103Target -ErrorAction Stop)) { throw 'Expected owned M1-03 root is absent' }
  Get-M103Inventory $m103Target | Out-Null
}
# Only after the recorded inventory and settlement checks above pass:
Remove-Item -LiteralPath $m103SetupTemp -Recurse -ErrorAction Stop
Remove-Item -LiteralPath $m103ScanTemp -Recurse -ErrorAction Stop
Remove-Item -LiteralPath $m103Runtime -Recurse -ErrorAction Stop
foreach ($m103Target in @($m103SetupTemp,$m103ScanTemp,$m103Runtime)) {
  if (Test-Path -LiteralPath $m103Target -ErrorAction Stop) { throw 'M1-03 artifact cleanup incomplete' }
}
```

Restore prior process environment in finally on every setup/browser command. Preserve all of temp outside the exact two owned scratch roots, especially pre-existing CONVERSATION.md and rd002-npm-cache; preserve dependencies, run data, prior lease history, global caches and user browsers. Inventory establishes topology/content but does not establish process settlement by itself. No application download path or retained downloaded content is introduced.

### L3.9 Evidence, review and reversal boundary

The primary accepts corrected synthesis `M103-A-001` plus pre-draft `M103-RP-001-C1` for authorship only. F1 binds native URL/time to one report and adds the A-to-B case; F2 rejects three Node artifact destinations; F3 fixes compatibility evidence with new service effects None. The pre-draft correction allowance is consumed. Native research retains at most its original one follow-up, browser research has consumed its one follow-up, analyst retains at most one correction; no allowance is reset. A different fresh critical_research_reviewer now reviews this entire artifact and all I1–I8, with at most two artifact correction cycles. Every runtime invariant remains Pending until its named implementation evidence exists.

Complete-artifact initial review `M103-RF-001` returned REVISE with two Major findings and no Blocker/Minor. First correction `M103-RF-001-C1` makes gate-bearing filesystem commands terminate on error, requires a present ordinary inventory root and valid file hashes, and forbids HTTP 3xx/Location responses in intercepted tests while retaining separate A-to-B navigations. Function-local ErrorActionPreference is used only for its normal terminating-error purpose and does not change the caller's process preference. Pinned Chromium source and [routing documentation](https://playwright.dev/docs/api/class-page#page-route) invalidate the earlier blanket redirect-interception assumption; no browser request occurred. These corrections implement the existing ownership/no-external-test-traffic contract without another transport or subsystem. Complete revised-artifact review remains pending; one of two artifact correction cycles is now used.

Primary correction verification parsed all 13 PowerShell blocks, loaded only the exact authored inventory helpers into an isolated PowerShell scope, and confirmed rejection for an absent root, synthetic enumeration denial, synthetic hash denial and null hash. A read-only positive control inventoried all six existing fixture files with valid SHA-256 hashes. No setup, deletion or browser execution occurred. `git diff --check` passed; this is command-contract evidence, not M1-03 scan evidence.

`M103-RF-001-C1` returned **PASS**, with no remaining Blocker, Major or Minor, on full plan SHA-256 `7a3d4ab379bad2de1b8b60f6382d370ceb23ba5bf0d4070f3b23c626cd92ba06`. The different fresh reviewer assessed all I1–I8, independently reproduced five inventory rejection cases (including a file as root), six valid fixture hashes, unchanged caller preference, 13 script parses, protected fingerprints and absent browser/source/lease state. Primary inspected the actual matching artifact/tree, accepts that verdict, and closes the R3 barrier. No source, test, dependency, configuration, fixture, browser or lease changed. Subsequent status/evidence maintenance does not alter reviewed L3.1–L3.8. Only normalization preflight may begin next; setup and every runtime/review/closure gate remain pending.

Required downstream evidence is the planned normalization Red/Green/S3 review, conditional guarded setup/S1 review, real scan Red/Green/S3 review, complete authoritative suite and independent typecheck, different integrated critical review, exact cleanup and documentation closure. Reopen the affected contract if the pinned integration loses references/nodes, changes gold native outcomes, scans iframe documents, cannot preserve allowlisted evidence or bounded ownership, or if identities/authority drift. Do not silently switch candidate, change fixture/profile expectations, alter accepted tests during Green or label unresolved mechanics as runtime proof.

## Concrete Steps

### Current safe inspection and existing baseline commands

Run from the repository root, the directory containing `AGENTS.md`. These commands already exist; they create no M1-03 source or browser behavior. Separately execute `npm.cmd --version` inside L3.8's nonbrowser wrapper; it is not a standalone read-only command and is deliberately excluded from this bare inspection block:

```powershell
git status --short
git rev-parse HEAD
node --version
python --version
git check-ignore -v data/runs/m103-ignore-probe/run.json
git ls-files -- data/runs
```

The ignore probe is a path argument only; do not create a record. Expected selected baseline: Node `v24.20.0`, npm `11.19.0`, Python at least 3.10, ignored/untracked run data, and a reconciled tree. Inspect the managed executable without launching it:

```powershell
node --input-type=module --eval "import { chromium } from 'playwright'; import { existsSync } from 'node:fs'; console.log(JSON.stringify({managedChromiumPresent:existsSync(chromium.executablePath())}));"
```

Use the same existing npm options for every named test/typecheck command. Each npm line below executes inside L3.8's nonbrowser wrapper, preserving TEMP/TMP; a browser-containing suite instead requires the six-variable browser wrapper:

```powershell
$toolchainOptions = @(
  '--global=false', '--prefix', (Get-Location).Path,
  '--cache', (Join-Path (Get-Location).Path 'temp/rd002-npm-cache'),
  '--ignore-scripts=true', '--audit=false', '--fund=false',
  '--update-notifier=false', '--logs-max=0',
  '--registry=https://registry.npmjs.org/', '--strict-ssl=true',
  '--package-lock=true', '--include=dev', '--include=optional'
)
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts
npm.cmd @toolchainOptions run typecheck
```

`M103-BASELINE-001` already records a fresh pass. The test command uses synthetic test-owned disk directories, loopback listeners and owned entry children, then exact cleanup. The typecheck emits no files. The shared ignored npm cache may be touched; no restore, install, model/provider request or browser launch is implied. Reuse this evidence during planning while executable/environment state is unchanged.

### Commands to freeze before execution writes

The slots below are resolved by the exact scripts and effect boundaries in **L3.8**. They are not worker discretion. The complete-artifact review and primary reconciliation must accept them before a dependent lease; each packet projects only its applicable commands and effects.

| Slot | Required exact command/effect record |
| --- | --- |
| M103-CMD-PREFLIGHT | Exact callable imports and safe preflight checks for each slice; selected environment/version inspections and expected missing-export versus runtime failures. A preflight that would mutate caches/state returns to the primary rather than writing without a lease. |
| M103-CMD-SETUP | Conditional installed-Playwright browser acquisition command; exact managed-browser identity, package source/CLI path, download destination, permitted network access/approval and cache/temp inventory. Bootstrap manifest/lock generation and package/config metadata mutations: **None permitted**. No global install, PATH or user browser change. |
| M103-CMD-ENV | Exact process-local wrappers: compilation caching disabled for every npm command, nonbrowser TEMP/TMP preserved, and task-owned browser/cache/root values only for setup/browser tests. Preserve/restore prior values, check installed identity, and permit only explicitly scoped prerequisites. Resolve roots inside the workspace and reject unsafe/nonordinary or pre-existing unowned targets. |
| M103-CMD-CLEAN-STATE | Read-only inventory plus safe preparation of an exact fresh owned test/acquisition directory; how an interrupted prior attempt is identified without erasing it. No clearing `temp`, `node_modules`, `data/runs`, user caches or an unresolved/glob target. |
| M103-CMD-BROWSER | Exact browser-suite command below plus the frozen environment, six-case and navigation-test transports, timeout expectations, allowed loopback/intercepted requests, output restrictions and actual browser/temporary-file cleanup evidence. No external public page or provider request. |
| M103-CMD-CLEANUP | Exact commands/owners for removing only proven task-created browser/cache/test artifacts and restoring process-local settings. Explicit preservation of the existing npm cache, dependencies, prior records and unrelated files; partial failure and unverified-process handling. |

If dependencies cease to match, stop and reconcile against the existing [locked restore instructions](../../../README.md#development-toolchain); record that command and its `node_modules`/cache effects before any setup lease. Do not regenerate package metadata or silently add a restore to a test assignment. No dependency restoration is currently needed.

### Future focused and task-level commands

All four source/test paths are implemented and verified. No S3 finding remains; reproducing browser evidence after final cleanup requires the setup and environment gates below. Commands become executable only when their literal barrier, path packet and environment/effect gates pass. Each npm line must be placed inside the applicable L3.8 wrapper: nonbrowser for normalization/standalone typecheck; browser for the scan suite. They use the existing npm script, not a new runner:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/scan-normalization.test.ts
npm.cmd @toolchainOptions run test:focused -- tests/scan-page.test.ts
npm.cmd @toolchainOptions run typecheck
```

The complete task-closure command, if those paths remain the frozen contract, is below. Run the test command inside the L3.8 browser wrapper with unchanged-cache/empty-scratch checks. Run standalone typecheck separately inside the L3.8 nonbrowser wrapper; the Git check needs no environment mutation:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts
npm.cmd @toolchainOptions run typecheck
git diff --check
```

Do not execute a future path during planning. Expected initial Red is the frozen missing callable or a genuine assertion failure, not a browser-not-installed, network, dependency or TypeScript environment error. Expected Green/closure is all accepted tests executed and passing, no skip/todo/only markers, independently passing strict typechecking and verified owned-resource closure. No client `build`, HTTP Analyze request, external smoke, model setup or generation command belongs here.

Use the [guard's actual start/close protocol](../../../.codex/write-lease-guard.md#commands) with the exact active packet. The primary records workflow/slice/assignment/lease IDs, digest, terminal receipt and accepted evidence in this plan between leases. A guard self-test may establish a missing/stale tooling prerequisite; it is not scanner evidence and need not be rerun for unchanged documentation.

## Validation and Acceptance

Planning is non-TDD documentation work. Its checkpoint requires the complete plan, correct activation and links, protected implementation/configuration/evaluation bytes, unchanged unrelated task and requirement/ADR statuses, independent R2 planning review and primary reconciliation. This does not satisfy a future research, implementation or completion gate.

Execution is acceptable only when every M103 invariant and the roadmap Verification has decisive evidence. The literal contract and both R3 reviews must predate dependent worker assignments. Record real preflight classification, test owner and hash, exact accepted Red failure, unchanged-test Green and strict typecheck, terminal lease identities, primary acceptance, slice review and final integrated review. Do not invent completed observations or backfill a successful route over a failed attempt.

The minimum meaningful cases are: rejection before side effects; both provider configurations without calls; complete multi-node, zero and incomplete collections; missing/unexpected rule and malformed native output; individual unavailable facts versus fatal capture; original native contrast/check groups; duplicate/unsupported/ambiguous locator preservation; credential/text/value canaries excluded from returned values and diagnostics; fresh isolated contexts with downloads disabled/no retained download path; no frame scan or deliberate interaction; truthful observed URL/version/readiness/time; navigation/scan timeout, browser/scanner/fatal collection failure, abort before/during work, failed cleanup and late settlement; unchanged six fixture outcomes including native same-target positives. Use the smallest set of tests covering these distinct boundaries, not a Cartesian provider/rule/failure matrix.

Every positive browser claim requires real pinned browser evidence. Test doubles may prove a bounded failure branch when the production path remains exercised and the limitation is recorded. Missing individual source facts are not test failures by themselves: assert preserved nodes with the precise existing unavailable representation. No generated IDs from list positions, native output snapshots, entire raw scanner archives, fixture gold values substituted as actual data, recomputed contrast or conditional test passes are accepted.

Before each slice handoff, audit changed tests/helpers/mocks/fixtures and skipped/focused markers for necessity and behavioral relevance. At closure, run the complete authoritative suite and independent typecheck, verify no protected drift or active lease, verify cleanup and content-safe artifacts, and compare actual scope with the authority map. Update materially affected developer instructions, architecture/lifecycle implementation notes, roadmap/current-status owners and plan/progress navigation. Requirement and ADR statuses remain unchanged unless separately authorized. Archive only after M1-03 Verification, final review and documentation closure all pass; planning never archives this file.

## Idempotence and Recovery

Read-only inspection, byte checks and documentation validation can repeat. Tests may repeat only under their declared effect/cleanup contract; do not repeat the six cases merely to inflate evidence or per provider. Preserve original RD-003 observations and record new implementation results under new evidence IDs. A material fixture/profile or expectation change requires the owning evaluation process and new evidence, not editing gold until a test passes.

After an interrupted run, first inspect Git, active/terminal guard state and the last accepted evidence. Stop any still-authorized worker before terminal closure; never reopen or edit an old lease. A nonzero guard result stops advancement. The primary reconciles actual user/peer changes and effects without automatic reverts, then decides whether a remaining same-contract correction or owner direction is needed. Do not remove ignored lease history or manufacture a receipt.

Browser cleanup must use the resources owned by the actual invocation and await the frozen close/disposition protocol. Never kill processes by broad names or touch personal browser profiles. A timeout or `Promise.race` winner alone is not cleanup proof; observe late rejection and prevent late success/publication. Preserve uncertainty as failed cleanup and stop the dependent branch. The existing service's stop behavior is a constraint, not permission to add a supervisor or claim cleanup after its deadline.

Before any recursive cleanup, resolve the exact absolute target, verify it is an ordinary task-owned descendant of the frozen root, inspect contents and reject unexpected links/reparse points, aliases or ownership ambiguity. Use native PowerShell end-to-end. Never delete a workspace root, all of `temp`, all runs, a shared npm cache, a global Playwright cache or a path derived only from an unchecked environment variable. Clean only explicitly acquired/test-owned artifacts, preserve unrelated and pre-existing data, restore prior process-local settings and report any material removal and recovery limitations. If ownership/closure is uncertain, preserve the residue and ask for direction; do not sweep it away to make verification pass.

## Artifacts and Notes

### Final review and cleanup accepted — M103-CLOSURE-001

The different fresh critical reviewer completed M103-INTEGRATED-REVIEW-01. Primary reconciled its verdict with the actual reviewed source/test hashes, accepted 290-test/strict-typecheck result, all I1–I8 obligations, protected paths and the test-relevance audit. No implementation finding remains. The verdict was PASS WITH FOLLOW-UPS: no Blocker/Major and one Minor M103-INTEGRATED-D1. Primary corrected all stale status/command summaries in existing owners, independently passed 668 relative-link/164-anchor checks and 21 PowerShell example parses, preserved the frozen literal and implementation hashes, and accepts D1 as resolved. The original review and precise corrections remain in M103-INTEGRATED-REVIEW-01 below.

After that acceptance, primary revalidated the unchanged fixed runtime inventory (332 entries, 318 files, 14 directories, 451193922 bytes; SHA-256 F5482572C7CD0A1A33682CE965F5609AE5E68AB5EB78365DDC453C37A1B89C82), exact marker and empty ordinary scratch roots. No lease, worker command or owned browser operation remained active. The reviewed source/test identities still matched. Every resolved target and ancestor was an ordinary descendant of this checkout with no reparse point or alias. Native PowerShell removed only temp/m103-setup, temp/m103-scan and m103-browser-runtime using the frozen literal-path cleanup, then verified all three absent. No browser/test execution or acquisition follows this cleanup.

The accepted code hashes remain: scan-page.ts 6afc664b7ed9509ed5a7e62d2939ecb10643827c74ad1eb095a6cbf4baa0926d; scan-page.test.ts 428202e20371416b1e12fcc79c79edca54c90ba917488c84053964a5d8304604; normalize-scan.ts 2c940b31a8fdd40326702c1d3e62a412da40e5273ed69caa8ee20e9688c985a0; scan-normalization.test.ts 1c8a4b43bcf24744470ed45d4764d29682768a9021715760bf51da39f52b8d89. L3.1–L3.8 remains bd3b07d942dda7bfe18ee31b6fa485d159d75899766e99249c055829be151709 after LF normalization. No pin, fixture, shared contract, service/storage source/test, requirement or ADR status changed.

Documentation impact: reconciled the 14 existing status, navigation, developer-instruction, architecture and lifecycle owners; documented the startup/setup prerequisite and exact evidence limits; preserved original failures and decisions. After successful candidate checks and cleanup, only M1-03 becomes Complete, and this same plan moves to completed with all affected links repaired. No new documentation subsystem, adjacent-task activation, staging, commit, push or publication occurs. Final archive validation is recorded below; all other 27 task blocks remain unchanged and M1-03 scope/dependencies/Verification remain unchanged.


### Final archive validation — M103-DOC-CLOSE-001

Primary final checks after the exact cleanup and archive move pass **14 Markdown owners, 669 relative links, 165 anchors, 21 PowerShell example parses, three JSON configurations, strict UTF-8/final-newline checks and git diff --check**. All 28 task blocks preserve the accepted baseline except M1-03's status/readiness/plan link; totals are six Complete and 22 Not started, with no active task. M1-03's objective, dependencies, Verification and exclusions are unchanged. Requirement tables, ADR/workflow paths, all protected implementation/configuration hashes, nine installed direct pins, six frozen fixture byte sequences and L3.1–L3.8 remain unchanged.

The old active-plan path is absent and all affected inbound/internal links resolve to this same archived plan. The three task-owned runtime/scratch roots and active lease are absent; run data remains empty. HEAD and branch are unchanged and the index remains empty. No browser command ran after cleanup. M103-INTEGRATED-D1 is fully dispositioned, all task Verification and documentation gates pass, and no further implementation, review or documentation work remains for M1-03. Reproduction requires the documented developer setup; no runtime binary is retained or committed.

### Final integrated review accepted — M103-INTEGRATED-REVIEW-01

A different fresh critical reviewer returned **PASS WITH FOLLOW-UPS**, with no Blocker or Major and one Minor M103-INTEGRATED-D1. It checked all I1–I8, the complete source/tests, cross-slice and service joins, all 14 changed documents, routed authorities, 13 compliant lease contracts/receipts and correction history. It independently reproduced all four implementation hashes, unchanged L3.1–L3.8, all nine installed direct pins, six fixture byte sequences, exact runtime inventory/executable/marker, empty ordinary scratch/run-data roots, empty index and absent active lease. It independently passed UTF-8/newline, 21 PowerShell parses, three JSON parses and whitespace checks. It reused fresh 290-test/strict-typecheck and focused 88/20 evidence without effectful reruns.

Primary accepts the implementation verdict against the actual unchanged tree. D1 requires only stale status and command-summary reconciliation: concept/context/requirements and navigation must acknowledge the internal scanner; the three-file suite is a core subset of five; the closed S3 stop is historical; standalone typecheck uses its nonbrowser wrapper; delivery readiness distinguishes internal implementation from M1-05 integration and M5 comparison. The primary made those exact corrections, plus clarified that evaluation acceptance alone is not implementation or release evidence. No source/test/frozen-literal or authority-status change was needed. Follow-up D1 is accepted as resolved subject to the proportional documentation checks below. Final exact runtime cleanup, documentation gate and archival remain pending.


### Closure candidate — M103-INTEGRATED-002

Primary accepts M103-SCAN-01-REVIEW-C1: the retained critical reviewer returned PASS with no remaining Blocker, Major or Minor after reviewing the complete I1–I8 packet and F1 correction. It independently matched source/test and frozen-literal hashes, reproduced the prior source by reversing only the correction, and reproduced the accepted prior test from its byte prefix. F1 is closed; no new source or test change followed Green. The one consolidated review correction is consumed.

The freshly executed full five-file command from L3.8 passed **290 tests, zero failed/cancelled/skipped/todo**, exit 0, 20.336 seconds. Separate strict typechecking exited 0. Before/after checks matched the fixed 332-entry browser inventory, executable and dependency-marker identity; both ordinary scratch roots were empty and each wrapper restored the environment exactly. All invocations settled. The browser cache is still preserved pending final review and cleanup. Evidence is reusable only with these exact source/test/pin/fixture identities.

| Roadmap Verification / invariant | Accepted evidence and limit |
| --- | --- |
| Input rejected before creation/navigation; no provider | Pure preparation tests reject malformed, credentialed and non-HTTPS input; both closed provider contexts normalize without calls. The scanner consumes a validated running record; HTTP creation wiring remains M1-05. I1/I2. |
| Fresh context, no imported state, downloads disabled, passive top-level scope | Fixed launch/context/navigation arguments, real iframe-exclusion and controlled navigation tests; no interaction, crawling, download workflow or provider seam. I2/I7. |
| Every node, exact coverage and truthful zero | 20 normalization tests and real capture checks cover multi-node violations, separate native incompletes, all four buckets, exact rules and missing/malformed/fatal results. I3. |
| Minimized facts and actual identity | Native check/contrast and all six unchanged gold-state outcomes, independent unavailable fields, unique structural correspondence and text/value/attribute canaries. The application reporter profile differs explicitly from RD-003. I4/I5/I7. |
| Failure and closure cannot become partial success | 88 scan tests cover browser/navigation/scanner/collection errors, provenance, timeout/abort, late resources, cleanup rejection/uncertainty and F1 launch rejection with residue plus shutdown priority. Cooperative deadline/trusted-page limits remain. I6. |
| Ownership, preservation and integration | Separate guarded test/code ownership and accepted reviews; fresh 290-test/strict-typecheck integration; protected bytes and six fixtures unchanged. Final reviewer and exact cleanup/documentation gate remain pending. I8. |

Test-relevance audit: retain the 20 normalization and 88 scan tests because they exercise distinct observable collection, evidence, identity, provenance and lifecycle requirements. Local doubles model bounded failures/late settlement; real pinned browser tests establish production capture and gold outcomes. The only added F1 group covers the previously missing launch-rejection-plus-residue combination and shutdown precedence. All 85 prior scan assertions remain unchanged. No snapshots, new fixture/helper files, skipped/focused-only markers, conditional passes or implementation-mirroring probe are retained. The 182 existing contract/storage/service tests remain unchanged and pass in the integrated run.

Primary closure-candidate checks pass: 14 Markdown owners, 668 relative links, 164 anchors, 21 PowerShell examples, UTF-8/final-newline checks, three JSON configurations, six exact fixture byte sequences and git diff --check. All 28 task blocks match the accepted baseline after excluding only M1-03 status/readiness/plan-link fields; protected tracked executable/configuration/workflow paths and the index show no diff. No skipped/focused-only test markers or active lease remain. Final post-cleanup and archive checks are still required.

Documentation candidate: update the existing 14 status, navigation, lifecycle, architecture and developer-instruction owners, without changing requirement/ADR status or another task. README now distinguishes browser-free tests from the full suite and links the frozen process-start environment/setup/cleanup contract for every npm invocation. Runtime removal and archival must follow accepted final review and the documentation gate; no application installer or M1-05 integration is added.


### Normalization preflight — M103-NORMALIZE-PREFLIGHT-01

The persistent `test_worker` completed read-only preflight on 2026-08-31 UTC and classified the slice **MISSING**. The agreed production/test files are absent. The exact L3.8 import command exited 1 with `ERR_MODULE_NOT_FOUND` for `src/server/scan/normalize-scan.ts`, not a dependency failure. Existing domain exports validate already-normalized records; they do not perform native normalization. The environment check, nine pins, six fixture byte sequences and protected hashes match `M103-BASELINE-002`; its unchanged 182-test/strict-typecheck evidence remains reusable. Primary inspected current Git state and the frozen L3.1–L3.8 hash `e8867361a2893056f59dad3df6ca0e08f75119751fe89648991989d020f8cd64`; no implementation or effect drift exists.

Primary accepts this classification for ADR-0024's first-module Red route. `normalization_test` owns only the future `tests/scan-normalization.test.ts`; no accepted test boundary exists yet. The complete behavioral assertions must be written before the expected missing-callable Red is accepted. No browser/setup effects, writes or lease occurred in preflight. One preflight is consumed; Red, Green, their single same-contract role corrections and S3 review remain pending.

### Normalization Red — M103-NORMALIZE-01-RED

Primary accepted the complete 19-test synthetic suite in `tests/scan-normalization.test.ts`, SHA-256 `884037bf4c96114c247513b594bc27b4274e1df479b0d0797d973f3083550fcf`, after inspecting the entire file, its exact public projection assertions, relevant negative boundaries and absence of skipped/focused tests or undeclared effects. The exact L3.8 syntax command exited 0; the focused normalization command exited 1 solely because the agreed production module is absent. This is **initial Red — missing production callable**: all 19 behavioral tests remain unexecuted until separate Green. Synthetic validator context is explicitly not browser provenance.

Lease `M103-NORMALIZE-RED-01` (workflow `M1-03-20260831-01`, slice `M103-NORMALIZE-01`, owner `normalization_test`, role `test_worker`, phase red, attempt 1) used contract digest `6d9f7e2f10e1fa78e497c47329c5b099c89034386c6f78cbd95dccd86c4a9288`. Primary freshly closed it compliant: only the allowed test was created; no forbidden/unleased/index/HEAD/ref/ignore change. Receipt digest: `9247001e6a503deda80c94360da2daeb518afd17c8ec01fe51710afc42dc4236`; pinned post-close status showed no drift before evidence acceptance. The test hash and all protected paths match inspection. No browser or filesystem fixture ran. This accepted test boundary is forbidden to Green; one initial Red is consumed, no correction has been used.

### Normalization Green — M103-NORMALIZE-01-GREEN

The separate `code_worker` created only `src/server/scan/normalize-scan.ts`, SHA-256 `c9ee26f2ca44b004a92e4fd1473edfd34a1a51396ae3051eb540841af810fed8`. All 19 accepted tests executed unchanged and passed; the worker's independent strict typecheck exited 0. No Refactor or correction was used. Primary inspected the entire implementation and test boundary, confirmed the source/test hashes and protected state, and independently ran the exact affected command `npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/scan-normalization.test.ts`: **77 passed, zero failed/cancelled/skipped/todo**, exit 0 (434 ms). A separately invoked strict typecheck exited 0. These synthetic tests establish normalization/domain compatibility, not actual DOM capture or browser behavior.

Lease `M103-NORMALIZE-GREEN-01` (same workflow/slice, owner `normalization_code`, role `code_worker`, phase green, attempt 1) used digest `6fd0e16c4ee3b5d9291606550ee70313ead11513425ab415a960b752797b6151`. Fresh closure was compliant with only the new production file created and no forbidden/unleased/Git invariant change; receipt digest `9cc120ea59b623cdff11545021e0ab355e9c0961cafd85102efe8397785deac0`. Post-close status showed no drift before primary acceptance. No task browser/scratch root exists, no browser/provider ran, and existing tests/fixtures/configuration remain unchanged. Fresh S3 review is pending. Each role retains its one same-contract correction allowance.

### Normalization review correction — M103-NORMALIZE-01-REVIEW

The fresh critical reviewer reproduced one L3.3 per-fact defect: a native image/label incomplete check with malformed ID but readable nonempty message is retained with invalid checks, yet its incompleteReason becomes missing instead of withheld. `checkGroup` discards the ID-invalid group before `proseReason` can inspect the independent message. A valid-ID control returns withheld. No raw content leakage, lost node or authority change was found. Primary accepts the finding for the single bounded correction loop, with test-owned attempt-2 Red followed by separate code-owned attempt-2 Green. The literal contract, paths and commands remain unchanged. Supplemental test edits will invalidate the original accepted test hash/Red for future Green; fresh actual behavioral Red and a new test hash must be accepted first. Browser setup remains gated on corrected S3 acceptance.

`M103-NORMALIZE-01-RED-C1`: the original test worker added one regression with both rules and readable/empty/absent/accessor message controls. Primary inspected the exact addition and independently removed it in memory to reproduce the original 19-test hash. New accepted test SHA-256 is `1c8a4b43bcf24744470ed45d4764d29682768a9021715760bf51da39f52b8d89`; original test-hash/Red evidence is superseded for future Green. Syntax exited 0; the exact focused command exited 1 with **19 passed, one failed**, no skipped/cancelled/todo. The decisive assertion is expected withheld versus actual missing for the two readable-message observations; other preservation/privacy assertions pass. Production SHA-256 remains `c9ee26f2ca44b004a92e4fd1473edfd34a1a51396ae3051eb540841af810fed8`.

Attempt-2 lease `M103-NORMALIZE-RED-02`, parent `M103-NORMALIZE-RED-01`, digest `0b5c9eb1225dfe38c1e1b409198e487c91c700b1b10e611a681527ea43eecb95`, freshly closed compliant with only the allowed test modified. Receipt `8a608b672459d6a6bd7b2ba23783fb9372e63fbc8726f3cb2490de65c5e958d3`; pinned status had no drift before acceptance. The test-role correction allowance is consumed. Primary accepts this actual behavioral Red for the separate code correction; no first-module exception is reused.

`M103-NORMALIZE-01-GREEN-C1`: the separate original code worker changed only independent prose-presence inspection. The exact focused command now passes **20/20**, zero failed/cancelled/skipped/todo, exit 0; independent strict typecheck exits 0. No Refactor occurred. Current source SHA-256 is `2c940b31a8fdd40326702c1d3e62a412da40e5273ed69caa8ee20e9688c985a0`; accepted test SHA-256 remains `1c8a4b43bcf24744470ed45d4764d29682768a9021715760bf51da39f52b8d89`. Primary inspected the actual bounded correction and matching hashes, verified protected paths, and accepts Green evidence without declaring the review finding closed. Initial critical verdict was **REVISE**, one Major `M103-NORMALIZE-01-REVIEW-F1`, no Blocker or Minor; consolidated re-review remains pending.

Attempt-2 lease `M103-NORMALIZE-GREEN-02`, parent `M103-NORMALIZE-GREEN-01`, digest `026b7e80e3f83af319ecea520c6870d0bbc547c7dcf957ed32cdbb86a3928560`, freshly closed compliant with only the allowed production file modified. Receipt `029f392185a187566aaca3a1fe81fe8c24559bb58931284f26950103d5e2507a`; pinned status showed no drift before primary acceptance and subsequent documentation maintenance. The sole code-role correction is consumed, as is the test-role correction; the single review correction loop awaits its re-review. No role budget resets on resumption.

### Owner-requested safe stop and resume boundary

The owner requested a safe stop to continue another day. The code worker finished only its already authorized small correction and checks, then stopped. Primary closed the lease, inspected actual source/test hashes and the correction, confirmed no active lease and no `m103-browser-runtime`, `temp/m103-setup` or `temp/m103-scan` root. No browser acquisition, browser execution, provider call, service publication, commit or push occurred. Both normalization workers and its critical reviewer have completed their current turns; no background work is scheduled. The roadmap status stays In progress and this plan stays in the active directory.

On resumption, inspect actual Git/lease state, protected source/test hashes, runtime/pins/environment and frozen fixtures before reusing evidence; preserve the current uncommitted work and unrelated ignored files. Do not replay completed R3 research or reopen consumed leases. Run the affected domain/normalization command and independent strict typecheck as needed for current evidence, then request the existing `normalization_review` critical reviewer to complete the one consolidated correction re-review against the full slice. Only after primary S3 acceptance may the conditional S1 browser setup start, using the unchanged exact L3.8 protocol and a fresh setup lease. Real scan preflight/Red/Green/S3 review, full five-file verification, different final integrated review, runtime cleanup and documentation/task closure remain pending. M1-04 and M1-05 remain unselected.

Documentation impact of this pause: updated this existing plan, the manual progress record and current selection/navigation statements to record the verified correction, unused browser branch and exact restart gate. No requirement/ADR status, source beyond the guarded normalizer correction, dependency, fixture or executable configuration was changed by primary maintenance.

Pause verification passed: 577 relative local links across the 11 changed Markdown files resolve; the new resume anchors resolve; all 13 PowerShell examples parse; UTF-8/final-newline checks and `git diff --check` pass. L3.1–L3.8 retain their accepted hash. The index remains empty, the four task write leases are terminally compliant, no active lease or task runtime/scratch root exists, and source/test hashes match the corrected Green record. This validates a safe pause, not M1-03 completion.

### Resumed validation — M103-RESUME-001

At 2026-08-31 12:59Z, the owner requested continuation. Primary inspected actual HEAD `815b4dca7960bce09e0cf208fb4e4c4a3573421a`, the expected eleven documentation modifications and two new normalization files, empty index, no active lease and absent three task runtime/scratch roots. The corrected source/test hashes, package/lock/manifest hashes, all nine installed pins, six exact fixture bytes and L3.1–L3.8 literal hash match the safe-stop record. Protected source/tests/configuration/evaluation/workflow paths show no drift. Runtime remains Node 24.20.0, npm 11.19.0 and Python 3.12.10; the name-only command environment check passed.

The exact affected command `npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/scan-normalization.test.ts` freshly exited 0 with **78 passed, zero failed/cancelled/skipped/todo** (423 ms). Separately, `npm.cmd @toolchainOptions run typecheck` exited 0. Primary rechecked the current source/test hashes afterward. This is fresh corrected normalization evidence, not browser proof. The single consolidated normalization re-review may now proceed; consumed test/code correction budgets and completed R3 evidence remain unchanged.

`M103-NORMALIZE-01-REVIEW-C1` returned **PASS**, no Blocker/Major/Minor, on the complete current normalization slice and applicable I1/I3/I4/I5/I8. The existing critical reviewer confirmed F1 is remedied, independently matched source/test/literal hashes and original-test preservation, and reused the fresh 78-test/typecheck evidence without duplicate execution. Primary reconciles the verdict with its full source/test inspection, bounded correction and current hashes, accepts F1 closure and the normalization slice, and preserves all consumed correction allowances. Actual browser/DOM/lifecycle proof remains pending; this is not M1-03 completion. No active lease or task browser/scratch root exists before the next setup assignment.

### Browser setup correction boundary — M103-BROWSER-SETUP-01

Setup attempt 1 created only the ordinary task runtime directory with its empty `browsers` child and the two empty task scratch roots. Its dry-run printed the expected pinned destinations and URLs, but an incorrectly constructed PowerShell wrapper expanded the exit-code variable, so the native result is not accepted. The acquisition command was never invoked; no download child or browser was launched. The worker stopped without retrying and restored its process environment. No runtime evidence is established.

Primary freshly closed lease `M103-BROWSER-SETUP-01` compliant with receipt `c005dffff57c50cb09583ea371727fe5c222cfcd13d2646869186efa87ca458c`, then confirmed pinned no-drift status and independently inspected exact containment, ordinary ancestors and inventories: runtime contains only its empty browser directory; both scratch roots contain zero entries. The guard records no endpoint changes because empty directories are outside its proof boundary. Protected implementation and accepted normalization content remain unchanged.

Authorize the one same-contract setup correction under a fresh attempt-2 lease: preserve and reuse these verified task-owned empty directories, repeat the unchanged dry-run with a literal exit-code check, inspect its success, then invoke the unchanged acquisition command once. This reconciles the already-created setup directories; it does not alter L3.1–L3.8, browser selection, destinations, network behavior or evidence requirements. No removal or automatic retry is authorized. A further decisive failure stops this setup route for primary reconciliation; this correction consumes its sole allowance. Browser tests remain blocked until setup evidence and S1 review pass.

Attempt 2 used lease `M103-BROWSER-SETUP-02`, parent `M103-BROWSER-SETUP-01`, contract digest `9238009ad7437f5560ca85fd92e9a25b26b26a561157dc1f87de338e3b63a6a7`. The parsed literal wrapper's dry-run returned native exit 0 and expected destinations, but a worker-added equality assertion after the five environment restoration calls threw `Process environment restore mismatch`; the overall shell exited 1. The acquisition command was never invoked. The failing variable was not recorded, so the required same-process restoration cannot be inferred from a later process. This is an unsuccessful setup correction, not browser evidence.

Primary freshly closed attempt 2 compliant, receipt `c8d601e87f669aef7bcd6512db9c1205c03095960b1888e3739ee211d5247235`, and confirmed pinned no-drift status. Independent exact-path inventory again found only the empty browsers child and two empty scratch roots; accepted normalization and package/lock/manifest hashes match, index is empty, and there is no active lease. No installer or browser was launched, no download or cleanup occurred, and no network permission was denied. The sole setup correction is consumed; no fresh lease or worker respawn may silently reset it. Preserve this safe state while diagnosing the assertion and obtaining any required owner exception. Setup S1 review and all real-scan gates remain pending.

The read-only worker clarification identified PowerShell's null-to-empty conversion at a .NET string argument as a concrete explanation; the individual variable from the failed command remains unknown. Primary corrected only the L3.8 restoration wrapper to pass `[NullString]::Value` for saved null, retain saved empty/nonempty values, and assert exact restoration with name-only failure output. A bounded diagnostic in an isolated shell passed all three states (absent, empty, fixed nonsensitive value) and removed its single process-only diagnostic variable. It launched no Node, installer or browser and had no network/filesystem effects. This command correction changes the reviewed literal fingerprint and requires the remaining complete-artifact correction review before reuse. It does not renew the exhausted setup allowance or establish acquisition evidence.

`M103-RF-001-C2` returned **PASS**, with no Blocker, Major or Minor, on full artifact SHA-256 `c9e6501f9fbfe21b1417e55a15b33b077cffbbcb7d32e1c04882ef76eae8d3ac` and current L3.1–L3.8 SHA-256 `2535d6b7ef63c567cba9a03a68ac53d042267779a5808a0995dd8e21453944fb`. A fresh replacement reviewer assessed the complete artifact and all I1–I8 within the existing second/final artifact-correction allowance. It independently verified that reversing only this command correction in memory reproduces the prior literal hash, plus all 13 PowerShell parses, package pins, six exact fixture bytes, protected content, no active lease and expected empty directories. Primary confirmed the reviewed artifact hash, inspected the correction and diagnostic, and accepts the revised command contract. Both final-artifact correction cycles are now consumed; the original restoration construction is superseded, without rewriting historical results.

Safe-stop documentation checks pass 590 relative links and 140 anchors across the eleven changed Markdown files, 13 PowerShell parses, UTF-8/final-newline checks, three JSON configurations, six fixture byte sequences and `git diff --check`. Accepted normalization source/test and package/lock/manifest fingerprints remain unchanged. No application code, test, dependency or fixture changed in this setup sequence; no installer acquisition or browser execution occurred. Documentation impact: updated this plan, the progress record and eight existing current-status/navigation owners with the accepted normalization checkpoint, failed setup history, verified command repair and owner-exception boundary. This is a safe partial handoff, not M1-03 closure.

### Owner-authorized additional setup attempt — M103-BROWSER-SETUP-03

The owner approved the concrete request for one additional guarded browser-setup attempt using the corrected command. This is an explicit exception to the exhausted setup allowance, not a new task, implicit reset or renewed research budget. Primary rechecked actual HEAD, expected uncommitted paths, accepted source/test/package/lock/manifest hashes, current literal hash and absence of an active lease. The runtime still contains only its empty browsers child; both task scratch roots are ordinary and empty. Reuse these verified directories without deletion or recreation.

Use the same workflow and work-slice identities, with fresh lease `M103-BROWSER-SETUP-03`. The guard's attempt field is 1 for this single newly authorized allowance, correction parent None; this is the third setup write turn in the task's recorded history. The guard supports only attempt 1 or 2 and earlier contracts/receipts remain immutable. This turn grants no further correction, no changed command/profile/path/effect, no browser launch and no package/fixture edits. A decisive failure stops the dependent branch. On success, primary acceptance and a fresh S1 review must precede scan preflight. The consumed research and normalization correction allowances are unchanged.

The authorized turn used contract digest `06c5e3c4f1e39b78b3149e0b1e654dca60c918cf7e24fa8b2a3599093d4ef22b`. The current literal dry-run returned native exit 0, expected identities/URLs and a passing exact restoration postcondition. The single acquisition invocation exited 1 after its five built-in connection attempts returned EACCES to the official Chromium CDN. No escalation retry, alternate host, package change or browser launch occurred. The required corrected finally ran on failure; the thrown acquisition error prevented the subsequent restoration assertion, so that postcondition is not claimed for the failed invocation.

Awaited CLI termination and its observed download-child exit establish settlement. Primary freshly closed the lease compliant with receipt `9cc7a9d3b5ad01cf3d9ac7274949c728920934e2c7bbf0cc6d6ec81f179d4ef3`, then verified pinned no-drift status and actual ordinary topology. Only `m103-browser-runtime/browsers/.links/38ec6dfd654b5c8f329733f1c9ec6b9b95feded6` was created: 80 bytes, SHA-256 `1994529160def049218affece8403eea8bee5ced558e19be99be9a75c5aa06d3`. The complete residue inventory contains three entries and has digest `86771257a6be076631ad74daa867e13b9f1b8591bcdaf57be27483d2edb49ba8`. Both task scratch roots remain empty; the Chromium executable and validation marker are absent. This residue is preserved and is not an accepted runtime baseline.

The additional turn is consumed. No active lease remains. Do not retry under the exhausted allowance; a further owner-authorized setup attempt should request the normal network escalation already contemplated by L3.8 before invoking the unchanged acquisition command. No network escalation has yet been requested or denied by the approval reviewer. Setup S1 review and scan preflight remain pending. The accepted normalization and reviewed command contract remain unchanged. Updated pause documentation passes 591 relative links, 141 anchors, UTF-8/newline, protected hashes, six fixture byte sequences, three JSON configurations and whitespace checks; the current literal fingerprint remains unchanged.

### Owner-authorized network-permission retry — M103-BROWSER-SETUP-04

The owner approved retrying the same installation with network permission requested first. This grants exactly one additional setup turn, with no correction, under fresh lease `M103-BROWSER-SETUP-04`, same workflow/work-slice/owner/role, guard attempt 1 and correction parent None. It is the fourth setup turn overall; all earlier failures, receipts and consumed allowances remain recorded. No research, source, test or adjacent-task budget is renewed.

Primary rechecked unchanged HEAD and protected hashes, the current reviewed literal fingerprint, absent active lease, the exact three-entry residue inventory and both ordinary empty scratch roots. Retain the verified `.links` metadata and directories. The worker must request `require_escalated` for the acquisition invocation before executing it, using the unchanged reviewed Node/CLI command and process-local wrapper. This is the normal network-permission path already contemplated by L3.8, not a command/profile/host change. No unprivileged acquisition retry, browser launch, alternate download mechanism, cache sweep or metadata edit is authorized. Setup evidence and fresh S1 review remain prerequisites for scan preflight.

Acquisition succeeded under the requested network permission. The current literal dry-run and single installation invocation each exited 0, and both exact five-variable restoration postconditions passed. The awaited CLI/download-child/dependency-validation sequence settled without a browser launch. `M103-BROWSER-SETUP-04-EVIDENCE` records Chromium 1234/version 151.0.7922.34, ffmpeg 1011 and winldd 1007 installed under the task cache; only expected `.links`, `chromium-1234`, `ffmpeg-1011` and `winldd-1007` children exist.

Primary freshly closed lease `M103-BROWSER-SETUP-04`, contract digest `904de019df5b86c309434cce0997584ac46deb87b2e9b7b0c07ac6b6f8767f5d`, compliant with receipt `187a0e28c83e25b42ddee526dc270b8d79363c57376ebf24be592d1e01b153be`. Only 317 expected files under the allowed cache were added; no protected/unleased/Git-invariant change occurred. Pinned status showed no post-close drift. Primary independently revalidated exact topology, cache inventory, executable and marker, both empty ordinary scratch roots and accepted normalization hashes; it accepts setup evidence for the fresh S1 review, not as scan proof.

The installed inventory has **332 entries: 318 files and 14 directories**, totaling 451,193,922 file bytes. SHA-256 inventory digest: `F5482572C7CD0A1A33682CE965F5609AE5E68AB5EB78365DDC453C37A1B89C82`. Chromium executable SHA-256: `409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2`. Chromium `DEPENDENCIES_VALIDATED` modification time: `2026-08-31T13:28:22.1375937Z`. These exact values, marker freshness and empty scratch are required before and after each browser command; do not replace this baseline silently. No browser/provider/product test ran during setup. Protected source/tests/pins/fixture bytes remain unchanged. S1 review remains pending.

`M103-BROWSER-SETUP-REVIEW-01` returned **PASS**, no Blocker/Major/Minor. The fresh S1 reviewer reproduced the exact topology/inventory/executable/marker, empty scratch, toolchain/pins, protected hashes and no active lease, while reusing the accepted installation and settlement evidence. Primary reconciles this verdict with its independent inspection and accepts the browser prerequisite. The next permitted work is the scan test worker's read-only preflight; no scan behavior, real browser execution or task completion is claimed.

### Scan preflight — M103-SCAN-01-PREFLIGHT

The persistent scan test worker completed read-only preflight and returned **MISSING**. The agreed source and test paths are absent; the exact selected-Node import exited 1 with ERR_MODULE_NOT_FOUND for `src/server/scan/scan-page.ts`, not a package/runtime defect. Existing validators, run types, normalizer and service callback do not implement these callables. Installed public AxeBuilder and axe reporter declarations support the frozen injection/capture and test controls. The existing M1-02 helper's different readiness/timeout profile remains protected; scan tests must construct their own L3-compatible input.

Primary accepts this classification against the actual absent files and current unchanged boundaries. Preflight matched all protected hashes/pins, six fixture bytes, current literal hash, full accepted browser inventory/executable/marker and empty scratch; no browser, provider, filesystem fixture, environment wrapper or write occurred. This permits one complete test-owned Red under the first-module exception, but is not itself Red evidence. Separate Green must execute every accepted assertion unchanged and pass strict typechecking.

### Scan Red command stop — M103-SCAN-01-RED

The test worker authored only `tests/scan-page.test.ts`, SHA-256 `677f08271f2fbdbcc06b07704ca2f115ef2e232ed9cf942ba08bb107ba86b286`, with 36 top-level groups and nested assertions covering the complete scan slice. The selected Node syntax check exited 0. The exact L3.8 focused npm command, under the reviewed scan environment, exited 1 solely with ERR_MODULE_NOT_FOUND for `src/server/scan/scan-page.ts`. The runner reported one failed file and zero passed/skipped/todo tests. All behavioral assertions remain unexecuted; no browser launched. The worker completed the five-variable restoration checks, then stopped when the required scratch postcondition failed. No retry or deletion occurred.

Lease `M103-SCAN-RED-01` (workflow `M1-03-20260831-01`, slice `M103-SCAN-01`, owner `scan_test`, role `test_worker`, phase red, attempt 1) used contract digest `6d222b2374d393d5f2c5c44ad978b7bf2ad10efa3c917a020c01278c37cf8333`. Primary freshly closed it compliant with receipt digest `98a65a3ff0eeee6df1a3c067231d0f89b87032595a4ee19a530bcf956c87704f`: only the allowed test file was created, with no forbidden/unleased/protected/Git-invariant change. Pinned status showed no post-close drift before primary documentation maintenance. This receipt does not cover ignored scratch effects and does not accept Red.

Primary inspected the test file, reproduced syntax exit 0 and matched the test/normalizer hashes. Read-only inventory confirmed ordinary preserved residue under `temp/m103-scan/node-compile-cache/v24.20.0-x64-964aae3f`: **95 entries, 93 files, 2 directories, 306,284 bytes**. The complete scan-scratch inventory digest is `1989BC1F606E5AFD39EBC88E653F3E7A47EB67BDA3CCCC9BF6123F72A78E2AB9`. Setup scratch remains empty; the accepted browser inventory and marker are unchanged. `scan-page.ts` remains absent, the index is empty, and no lease is active. The initial Red write turn is consumed; no test correction or Green turn has been used. Red remains **not accepted** because its command/effect postcondition failed.

Read-only diagnosis on 2026-08-31 found that the installed npm `lib/cli.js` lines 2–5 invokes `enableCompileCache()` without a directory. Installed Node type documentation specifies the fallback to `os.tmpdir()/node-compile-cache` and the disabling control; the [official Node module documentation](https://nodejs.org/api/module.html#module-compile-cache) confirms both. This explains the residue without attributing it to browser execution. The existing npm content cache option does not govern this separate compilation cache.

**Proposed owner exception; not accepted or executed:** allow one additional command-artifact correction and its complete-artifact critical review, followed by one replay of the unchanged scan test file. The smallest repair adds `NODE_DISABLE_COMPILE_CACHE` to the wrapper's saved/restored process variables, sets it to `1` before npm/Node starts, and preserves absent/empty/nonempty restoration and name-only checks. Keep every package, test, source, fixture, command argument, browser profile and product literal unchanged. Extend the effect contract only for this explicit control and exact recovery: after reconfirming command settlement and the recorded ordinary inventory, remove only `temp/m103-scan/node-compile-cache`, then verify the scan root is empty. Do not weaken scratch checks or permit a retained cache inside production scratch. Before the replay, verify disabled status without enabling a cache and pass the revised artifact review. No reinstallation, broader deletion, research restart, changed tests or new implementation slice is proposed.

Both original complete-artifact correction cycles are exhausted; the earlier owner exception authorized browser acquisition, not this new command correction. Under the explicit workflow stop rule, the primary requests this bounded exception before changing L3.8, deleting residue or rerunning Red. The current L3.1–L3.8 hash remains `2535d6b7ef63c567cba9a03a68ac53d042267779a5808a0995dd8e21453944fb`. On authorization, keep the test boundary unchanged, re-establish full Red evidence, then proceed through separate guarded Green, S3 review and the remaining task closure gates. No success collection or real-browser proof exists yet.

Safe-stop documentation validation passes **593 relative links, 143 anchors, 13 PowerShell parses**, UTF-8/final-newline checks, three JSON configurations, six unchanged fixture byte sequences, accepted source/test/package/manifest hashes and `git diff --check`. No protected tracked implementation/configuration diff, index entry or active lease remains. The new scan test is preserved without claiming typecheck or browser success. Documentation impact: updated this plan, its progress record/index and existing status/navigation owners with the failed command gate and reviewable recovery proposal; no Accepted requirement, ADR, roadmap dependency or adjacent task status changed. This is a safe partial handoff, not task closure.

### Owner-authorized compile-cache correction — M103-RF-001-C3

The owner approved the proposed single additional command-correction/review cycle, exact residue removal and unchanged-test replay. Primary fresh inspection confirmed HEAD `815b4dca7960bce09e0cf208fb4e4c4a3573421a`, no active lease, the unchanged scan-test and accepted normalizer/test hashes, the exact preserved 95-entry compile-cache inventory and accepted browser-cache inventory. No source, test, dependency, fixture or cache was changed during this inspection.

Primary revised only L3.8 command effects: save/set/restore `NODE_DISABLE_COMPILE_CACHE=1` alongside the existing five process variables, specify a guarded no-write disabling diagnostic, and bind one-time residue removal to its exact ordinary-path inventory after review. The original npm test arguments, every product/native/lifecycle literal and all test contents remain unchanged. The permission is one additional C3 artifact correction and review plus one primary replay, not a research restart or reset of implementation-role budgets. Complete-artifact review and primary acceptance still precede cleanup, replay and Green. The prior rejected Red and original literal fingerprints remain history.

The exact disabling diagnostic exited 0 on the selected Node: `enableCompileCache()` reported DISABLED and `getCompileCacheDir()` remained undefined, after the environment prerequisite check. The wrapper restored all six saved process variables exactly. Primary reproduced identical preserved-scratch and accepted-browser inventory digests before and after; no file, browser, npm invocation or cleanup occurred. Current L3.1–L3.8 SHA-256 is `00b297d0b730dedca93b5232c81c397211985d31d7b51ec41e4014dd907584b7`. This establishes the bounded command control, not Red acceptance or scan behavior; the complete C3 review is still pending.

C3 complete-artifact review returned **REVISE**, one Major F1 and no Blocker/Minor, against full artifact SHA-256 `e1bc8a2a46c4a0258b61ffb515cc6bb2aec300c50957861c1b35a4bd7e36c9de`. I2–I7 passed unchanged; I1/I8 require the command correction below. The reviewer independently matched both inventories, executable/marker and protected hashes, checked all 15 PowerShell parses, and reproduced the prior C2 literal hash by removing only the C3 additions in memory. No npm, browser, diagnostic, cleanup or replay ran during review. Primary independently reproduced the same literal-preservation result and accepts F1 as a command-contract defect, not a scanner/test defect.

**F1:** L3.8 limits its disabling wrapper to setup/browser commands, yet M103-CMD-PREFLIGHT and Concrete Steps still classify `npm.cmd --version` as safe/read-only without the wrapper. The installed launcher reaches `lib/cli.js` and `enableCompileCache()` before handling arguments. An otherwise permitted absent `NODE_DISABLE_COMPILE_CACHE` therefore still allows compilation-cache writes during nonbrowser npm inspection. The browser diagnostic cannot establish safety for that uncovered command. The same source mechanism applies to normalization/typecheck npm invocations outside the browser wrapper.

**Proposed bounded follow-up; not an accepted literal or executed command:** retain the corrected six-variable setup/browser wrapper and add a one-variable process wrapper for every nonbrowser npm invocation, including version preflight, normalization and typecheck. Save `NODE_DISABLE_COMPILE_CACHE`; set it to `1` before invoking the unchanged npm arguments; restore absence with `[NullString]::Value` and empty/nonempty values unchanged in finally; check exact restoration with name-only failure output. This nonbrowser wrapper must not assign TEMP/TMP, browser-cache variables or other environment values. Make the wrapper requirement explicit at every applicable command/example and remove the unqualified read-only claim for bare npm. Verify disabled status under that wrapper without enabling a cache, check current inventories remain unchanged, and obtain complete-artifact re-review of all I1–I8. No package, test, product literal, process supervisor, extra cache destination or weaker scratch check is proposed.

The single additional C3 correction/review cycle is exhausted. Primary stops before authoring this further literal correction or rerunning review. Owner direction is needed only for that follow-up correction/review; existing authorization for exact residue removal and the one unchanged-test replay remains unused, with their review/ownership gates intact. There is no active lease or implementation worker, and preserved residue/browser/test hashes remain the resume boundary. Do not treat C3's successful diagnostic as acceptance of the whole command contract or reset any test/code/setup budget.

Final pause checks reproduce the exact scratch/browser inventories and accepted source/test hashes, no active lease, empty index, all six unchanged fixture byte sequences, three valid JSON configurations, **594 relative links and 144 anchors**, UTF-8/final-newline checks and `git diff --check`. The 15 parsed PowerShell blocks remain unchanged. Documentation impact: updated the existing plan, progress record/index and status owners with the C3 diagnostic, accepted review finding, exhausted allowance and concrete nonbrowser-wrapper proposal. No product behavior, task dependency, requirement/ADR status or adjacent task changed.

### Owner-authorized nonbrowser npm correction — M103-RF-001-C4

The owner authorized the proposed follow-up correction/review covering every npm command. Original/C3 budgets remain consumed; exact cleanup and one unchanged-test replay remain separately authorized but unused. Primary fresh inspection confirmed the unchanged test/normalizer and exact scratch/browser inventories, reconciled worktree and no active lease. No new implementation or setup task is introduced.

Primary added the nonbrowser one-variable wrapper in L3.8 and made its use explicit for npm version preflight, baseline/normalization tests and independent typecheck. Browser/setup commands retain the C3 six-variable wrapper. All npm arguments, TEMP/TMP behavior, browser profile, product/native/lifecycle literals, test bytes and exact cleanup scopes remain unchanged. Bare npm is no longer described as read-only. The existing installed npm `lib/npm.js` lines 127–131 returns early for `--version` before its own caches/logfiles/timers; disabling the earlier Node compilation cache therefore addresses the observed source path without a new cache destination. The C4 diagnostic and complete-artifact review precede recovery/replay acceptance.

Primary ran the exact no-write diagnostic once under the new nonbrowser wrapper: exit 0, DISABLED status and undefined compile-cache directory. The subsequent unchanged `npm.cmd --version` also exited 0 and reported 11.19.0. Each invocation restored the saved cache-disable value exactly; TEMP/TMP and all three controlled browser variables were compared before/after without exposing values and remained unchanged. The exact preserved scratch and accepted browser inventories matched before, between and after the two commands. No browser, product test or cleanup ran. Current L3.1–L3.8 SHA-256: `bd3b07d942dda7bfe18ee31b6fa485d159d75899766e99249c055829be151709`. This addresses the missing command path with bounded evidence; complete-artifact C4 review and primary acceptance remain pending.

C4 complete-artifact review returned **PASS**, no Blocker/Major/Minor, against full artifact SHA-256 `8e5e2ea597df5196eeb94175337852f4e335ee4225ada3bfd748126a58abc84a`. The retained critical reviewer inspected all 970 lines and all I1–I8; reproduced all 16 PowerShell parses, exact inventories/executable/marker/protected hashes, six fixture bytes, empty index and no active lease; and confirmed C3-F1 is remedied. Primary independently matched the actual reviewed artifact and test/cache/residue identities, reconciles the source-backed finding and diagnostic evidence, and accepts C4 and F1 closure. C4's additional correction/review allowance is consumed, without renewing any original or implementation budget. The already-authorized exact recovery and single unchanged-test replay may proceed; no scan behavior is yet proved.

### Scan Red replay accepted — M103-SCAN-RED-REPLAY-001

Primary verified the settled original invocation, no active lease, unchanged test SHA-256 677f08271f2fbdbcc06b07704ca2f115ef2e232ed9cf942ba08bb107ba86b286 and the exact preserved residue/browser inventories. M103-RECOVERY-001 removed only temp/m103-scan/node-compile-cache using the accepted L3.8 scope/path/inventory checks; scratch became empty and the browser baseline/marker stayed unchanged.

The single authorized unchanged-test replay used the accepted six-variable browser wrapper and exact focused command. Node syntax checking exited 0. Focused testing exited 1 solely with ERR_MODULE_NOT_FOUND for src/server/scan/scan-page.ts; the runner reports one failed file, zero passed/cancelled/skipped/todo. All 36 authored behavioral groups and assertions remain unexecuted. No browser or asynchronous test-module work began. Both scratch roots remained empty; the 332-entry browser inventory and marker matched before/after, and all six process variables restored exactly. Primary accepts this complete first-module Red under ADR-0024, with the existing compliant M103-SCAN-RED-01 receipt and unchanged test boundary. No test correction was used.

The next bounded assignment is M103-SCAN-GREEN-01, code_worker scan_code, allowed only src/server/scan/scan-page.ts. It must execute every accepted test unchanged and separately pass strict typechecking. The command includes controlled local browser processes; normal tool escalation may be requested for those exact process effects before invocation if required by the host sandbox, without authorizing an external target, additional command, retry, dependency or contract change. Runtime evidence remains non-reusable outside its isolated identity. No lease is active at this checkpoint.

### Initial scan implementation and test reconciliation — M103-SCAN-GREEN-001

The separate code worker authored only src/server/scan/scan-page.ts (SHA-256 bcbe3539cd65c26956cd7284d57960d3f73ca48e1b3a832dc02b6697a118207e). Its one focused command executed actual Chromium and returned exit 1: 85 tests, 67 passed, 18 failed, zero cancelled/skipped/todo, 21.4 seconds. Passing controls include all six unchanged gold states and corrected native positives, lifecycle/failure/late-disposal cases, native contrast incomplete, duplicate identities, intercepted provenance/iframe exclusion, fresh contexts, download denial and A-to-B separation. This is partial execution evidence, not accepted Green. No retry, Refactor or worker typecheck ran.

Primary freshly closed M103-SCAN-GREEN-01 compliant: digest 790480bbf5ce2bfc1cf692b90e5fc3ec996200c5039a4e6cf6f301615714ee4a; receipt 4e4144351c81031fb19dae88b553cb090cc4cd338f757a471d686f815158e6ad. The actual source is the sole created endpoint; no forbidden/unleased/Git drift exists. Primary read the full source and reproduced its hash, unchanged tests/normalizer, fixed cache/marker and empty scratch. The worker's command settled with exact six-variable restoration. Primary then ran the separate strict typecheck under the one-variable nonbrowser wrapper: exit 0 and exact restoration.

Primary identified two test-setup defects against unchanged authorities. The unsupported-profile case supplies an available scannedAt with readinessReached false, which readContext rejects before executeScan. The direct-reference controls decorate v1 on the first Page.evaluate injection, but pinned AxeBuilder.runLegacy reinjects the same source through frames before the final Page.evaluate analysis call, replacing the test decoration. Original native facts are therefore expected from that broken control. This is not evidence to weaken production capture or change native expectations.

The existing test owner receives its sole same-contract correction, M103-SCAN-RED-02 (attempt 2, parent M103-SCAN-RED-01), allowed only tests/scan-page.test.ts. Correct the scannedAt fixture's required readiness and install the same public native-v1 delegate at the final analysis invocation through the already-permitted Page.evaluate wrapper, after integration reinjection. Preserve native v1, test assertions, all 36 behavioral groups, six fixture bytes and all production files. This repairs control timing within L3.7's public test seam; it adds no private override, scanner/export, product flag, test transport or literal change. Prior scan Red/Green evidence is invalidated for the changed test boundary; require a fresh complete focused result plus strict typecheck. A passing characterization of existing production is acceptable; do not fabricate another missing-module Red. Code correction and S3 review allowances remain unused. Stop on a changed contract or decisive failure; no extra role budget is created.

### Scan test correction and Green evidence accepted — M103-SCAN-RED-02-CORRECTION

The test owner changed only three setup lines: required readiness for the available timestamp and the public-v1 decoration timing in the existing Page.evaluate wrapper. All 36 groups, assertions and expected facts remain unchanged. Primary reversed those three lines in memory and reproduced the original test hash exactly. Revised test SHA-256 is 44e6e55785c2273d83c415fee4fdfdb3d486369db3dccdd024d0d5a54d548075; production remains bcbe3539cd65c26956cd7284d57960d3f73ca48e1b3a832dc02b6697a118207e.

Syntax exited 0. The single exact focused command under C4's browser wrapper executed **85 tests, all passed; zero failed/cancelled/skipped/todo**, in 22.62 seconds. Actual repaired reference/attribute controls, six frozen states with corrected native positives, lifecycle/late acquisition, fresh contexts, frame exclusion, download refusal and paired provenance passed. The separately invoked strict typecheck under the nonbrowser wrapper exited 0. Owned closure assertions passed, both scratch roots were empty, browser inventory/marker unchanged and controlled environments restored exactly; no external target/provider/service ran.

Primary freshly closed M103-SCAN-RED-02 compliant (digest c5fb2f30c35cd0f82b896237d1d09b564566dc04d000e30ac316ddf0c732bde3; receipt d5ae041397ca4393eca9d520f315ac341dc76b9a78d43e6ffb0347a35f73051e), inspected the actual three-line diff and source, and independently reproduced hashes, cache/marker and empty scratch. The prior Red is superseded by a passing characterization of the unchanged separately authored production. Primary accepts this corrected boundary and Green execution evidence; no new Red is fabricated and no code correction was needed. The test-role correction is consumed; code and S3 review correction allowances remain unused.

Fresh M103-SCAN-01-REVIEW is next. Primary flags one unconfirmed cleanup question for independent inspection: final scratch checking is conditional on an acquired handle, potentially missing residue when launch rejects before returning a handle. Passing tests do not close this concern. Integrated verification and the different final review/cleanup/documentation gates remain pending.

### Integrated validation — M103-INTEGRATED-001

Primary ran the exact five-file authoritative suite once under the C4 browser wrapper at source SHA bcbe3539cd65c26956cd7284d57960d3f73ca48e1b3a832dc02b6697a118207e and corrected scan-test SHA 44e6e55785c2273d83c415fee4fdfdb3d486369db3dccdd024d0d5a54d548075: **287 passed, zero failed/cancelled/skipped/todo**, exit 0, 20.164 seconds. Separate strict typechecking under the nonbrowser wrapper exited 0. This is integrated execution evidence while S3 review is pending, not task closure.

The command settled, fulfilled owned closure assertions, restored process values exactly and left both ordinary scratch roots empty. The fixed 332-entry browser inventory and marker matched before/after. Existing M1-02 synthetic records/listeners/entry children settled through their unchanged tests; data/runs is empty and no m102 temporary root remains. Primary checks also pass three JSON configurations, six exact fixture byte sequences, protected hashes, UTF-8/final newlines, 595 relative links/146 anchors and git diff --check. No source/test/dependency/configuration/fixture or Git-state change followed the accepted test correction.

### Scan S3 review and bounded stop — M103-SCAN-01-REVIEW

The fresh critical reviewer returned **REVISE**, one Major M103-SCAN-F1, no Blocker or Minor, against source bcbe3539cd65c26956cd7284d57960d3f73ca48e1b3a832dc02b6697a118207e and test 44e6e55785c2273d83c415fee4fdfdb3d486369db3dccdd024d0d5a54d548075. It read the complete runner/tests and consumed contracts, checked all I1–I8, inspected pinned launcher behavior and compliant leases, and reused the 85/287 passing results plus strict typechecking without new execution. No other actionable finding was identified.

**F1 accepted by primary:** scan-page.ts line 357 checks final scratch only when a browser/context/page handle was returned. Pinned Playwright creates artifact/profile directories before executable validation and before returning a Browser; its deletion helper can swallow removal errors. Therefore launch rejection with residue and no returned handle can publish browser failure with cleanup closed. The existing launch failure and residue controls cover those conditions separately, missing their combination. Primary independently inspected the same source branch and pinned creation/deletion paths. Closed cleanup must prove empty ordinary scratch after attempted acquisition, even when launch rejects. Unsupported/already-aborted inputs that never attempt acquisition retain their existing no-resource behavior.

**Concrete correction prepared, not yet executed:** add one controlled rejection-with-residue case in the existing scan test using its owned scratch-residue path and public launch double. Require browser failure, cleanup failed, no success collection and byte-preserved residue until the test's exact cleanup; retain shutdown priority. Then let the separate code owner track attempted acquisition and apply final scratch proof to that path, without a sweep, new export, dependency, literal or authority change. Use the same focused command and strict typecheck with C4 wrappers and exact cache/marker/scratch checks. The expected initial regression fails only because cleanup is closed; the separate minimum code correction must make it pass with every accepted test unchanged.

The scan test owner's sole same-contract correction has been consumed by the three-line fixture/control repair. The user explicitly required honoring every correction budget; using the primary exception or another agent merely to evade that limit would not be justified. Primary therefore stops affected writes and requests one explicit additional bounded test-owner correction for this finding. The code owner's one correction and the S3 review's one consolidated re-review remain unused; they require no renewed allowance. After authorization, issue fresh full packets and leases, accept the regression before code correction, rerun integrated verification, obtain the retained S3 review and different final integrated review, then perform final cleanup/documentation closure. Do not reset prior budgets or activate another task.

There is no active lease, pending test command, implementation worker or owned browser operation. All completed commands settled; both scratch roots remain ordinary and empty, and the accepted runtime cache is preserved for the remaining verification. Historical 85/287 passing evidence remains truthful but does not cover F1 or close the task. Final cache/root removal, archival and M1-03 completion remain intentionally unperformed. This is an explicit correction-budget stop, not an authority/architecture conflict. No requirement or ADR change is needed.

Final checkpoint validation confirms the source/test hashes, empty index, absent active lease, fixed cache/marker and empty scratch. Documentation checks pass 663 relative links, 161 anchors, 16 PowerShell example parses, UTF-8/final-newline checks, three JSON configurations, six unchanged fixture byte sequences and git diff --check. Documentation impact: synchronized 14 existing status, navigation, architecture and lifecycle owners with the actual internal implementation and open finding, while preserving HTTP integration as M1-05 and all requirement/ADR statuses. No new documentation artifact, plan archive, commit or push was created.

### Owner-authorized F1 regression exception — M103-SCAN-RED-03

The owner authorized the requested one additional bounded test-owner correction for M103-SCAN-F1. Primary rechecked the actual source/test hashes, all frozen fixture bytes and pins, unchanged 332-entry browser cache/marker, empty scratch and index, and absent active lease. Existing authorizations and completed prerequisites remain valid; no research literal or task scope changes.

The retained test owner receives one additional Red write turn, M103-SCAN-RED-03, only tests/scan-page.test.ts. Preserve all accepted tests and add one coherent launch-rejection-with-residue regression, including shutdown precedence in that same failure combination. Use only the existing controlled launch double, exact owned residue path and finally cleanup. Expect failure solely because cleanup is closed; no source edits or new transport/helper. The same focused command, independent strict typecheck, C4 wrappers and full effect checks apply.

Because the guard accepts attempts 1/2 and the original Red parent already has its consumed child, this explicitly authorized extra turn uses a new immutable lease ID with attempt 1 and no correction parent, as did earlier owner-authorized extra setup turns. This is not a renewed default allowance: RED-01/02 remain consumed and this extra grant permits no follow-up test correction. After accepted Red, the existing unused code correction uses GREEN-02, attempt 2 with parent GREEN-01, then the retained reviewer's unused consolidated re-review. No guard policy, runtime record or task graph is modified.

### F1 regression accepted — M103-SCAN-F1-RED

The owner-authorized extra test turn appended one group with browser-failure and shutdown-priority subcases. Primary independently verified the prior accepted test file is an exact byte prefix; no existing assertion changed. Expanded test SHA-256: 428202e20371416b1e12fcc79c79edca54c90ba917488c84053964a5d8304604. Source remains bcbe3539cd65c26956cd7284d57960d3f73ca48e1b3a832dc02b6697a118207e.

The exact focused command returned exit 1: 88 tests, 85 passed, 3 failed (two new subcases and their parent), zero cancelled/skipped/todo, 23.01 seconds. Both subcases fail solely on cleanup closed versus expected failed. Their earlier assertions establish valid immutable failed terminals, correct browser/shutdown priority, no success collection or later acquisition, and byte-preserved residue. Finally removed only the exact test-owned file. Syntax and independent strict typecheck each exited 0.

Primary freshly closed RED-03 compliant (digest d2789ba5a6e1998501fef43d41575c1ff1faf1c9cc7bb4fed02d7b35e7f2b273; receipt e6634f647957cd1b462a915a399feb245c946b7cd5771861ce2191150d43ca65), inspected the full additive test and actual source, and reproduced hashes, empty scratch and unchanged cache/marker. The invocation settled with exact wrapper restoration; no forbidden/unleased/Git drift occurred. Primary accepts F1 Red and the expanded test boundary. The extra test allowance is consumed; no further test correction is authorized.

The next assignment is the previously unused code correction GREEN-02, attempt 2, parent GREEN-01, allowed only scan-page.ts. It must require final scratch proof after attempted acquisition, including rejection without a handle, preserve no-acquisition behavior and shutdown priority, and pass the expanded tests unchanged plus independent strict typecheck. No cleanup sweep or broader source change is authorized.

### F1 code correction accepted — M103-SCAN-F1-GREEN

The separate code owner added acquisition-attempt tracking immediately before chromium.launch and changed final scratch proof to depend on that attempt rather than a returned handle. Unsupported/already-aborted inputs still perform no acquisition; no deletion/sweep was added. Primary reversed these three small source changes in memory and reproduced the original source hash exactly. Corrected source SHA-256: 6afc664b7ed9509ed5a7e62d2939ecb10643827c74ad1eb095a6cbf4baa0926d. Expanded test SHA remains 428202e20371416b1e12fcc79c79edca54c90ba917488c84053964a5d8304604 unchanged.

The exact focused command passed **88 tests, zero failed/cancelled/skipped/todo**, exit 0, 19.79 seconds. Independent strict typechecking exited 0. Both F1 subcases now prove failed cleanup, browser/shutdown priority and preserved residue. Every prior real-browser/lifecycle assertion passed unchanged. Commands settled, wrappers restored exactly, both scratch roots remained ordinary and empty, and fixed cache/marker/executable identities matched.

Primary freshly closed GREEN-02 compliant (digest 567c5444f570031781f228eb934d275dabc1cc7ec1f3ba4a0fb6b281442e0a11; receipt 39bd3238bb4b0c625b2a7c94cdfd61ffb40f73a96a59e7b29138c82e1a4c6158), inspected the exact source change and regression, and independently reproduced hashes and filesystem checks. No test, protected source/config/fixture or Git-state change occurred. Primary accepts the correction and Green evidence for the retained reviewer's one consolidated S3 re-review. Code correction and extra test allowances are consumed; no further write correction is assumed.

### Research synchronization — M103-R-SYNC-001

Both required read-only `critical_researcher` reports returned **RESEARCH COMPLETE** on 2026-08-31 UTC. `M103-R-NATIVE` established supported pinned API evidence for the two native-capture candidates; `M103-R-BROWSER` established the lifecycle, service and command-effect evidence. Its single follow-up, `M103-R-BROWSER-F1`, corrected scratch ownership to the already ignored exact roots `temp/m103-setup` and `temp/m103-scan`, separately inspected outside guard proof, and confirmed installed CLI support for `--no-progress`. The browser cache itself remains a proposed nonignored task root. No installation, browser launch, executable edit or lease occurred. Native research retains one targeted follow-up allowance; the browser report's allowance is exhausted.

The reports distinguish supported API mechanics from pending browser proof. Default integration partial execution removes native element references; the alternative named-reporter route uses the public integration's legacy mode and delegates to native v1 reporting. That route would be a distinct M1-03 capture profile, not an identical replay of RD-003's reporter options. Both preserve the requirement for unchanged fixture bytes, native corrected positives and truthful offline provenance. Playwright close fulfillment alone does not establish empty temporary storage; directory deletion failures can be swallowed. The official installer follows redirects and does not enforce a fixed destination-host allowlist. Those limitations enter synthesis rather than being hidden as runtime success claims.

The mandatory `decision_analyst` assignment `M103-A-001` returned **DRAFT READY**. It recommends N2 completion-local native-reference capture, B2 cancellation with late-acquisition disposal, and intercepted owned HTTPS navigation tests. It reconciles the exact named reporter/options, capture-envelope and content-safe failure boundary, unsupported initial-policy behavior, scratch precondition, test-only public reporter wrappers and command environment. Installer total wall timeout is explicitly None: the pinned connection timeout and internal retries are not a total deadline, and no supervisor is added. The primary accepts that outline for fresh pre-draft checkpoint `M103-RP-001`, not as implementation authorization. No final literal has been drafted and no worker preflight is permitted yet.

Evidence was inspected on 2026-08-31 UTC. Native evidence `N-E01`–`N-E08` uses pinned integration declarations/source, axe native reporter/aggregation/measurement source, M1-01 and the frozen manifest, supported by the [public integration API](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md), [versioned axe API](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md), [DOM Standard](https://dom.spec.whatwg.org/#interface-mutationobserver) and [HTML label semantics](https://html.spec.whatwg.org/multipage/forms.html#category-label). Browser evidence `B-E01`–`B-E09` and corrected `B-F01`–`B-F05` uses the unchanged service and pinned Playwright source, supported by [launch](https://playwright.dev/docs/api/class-browsertype#browser-type-launch), [browser closure](https://playwright.dev/docs/api/class-browser#browser-close), [managed binaries](https://playwright.dev/docs/browsers#managing-browser-binaries), [routing](https://playwright.dev/docs/api/class-browsercontext#browser-context-route), [downloads](https://playwright.dev/docs/downloads) and [Node temporary-directory behavior](https://nodejs.org/api/os.html#ostmpdir). Analyst `A-E01` confirms reported `toolOptions` normalization; `A-E02` confirms environment aliases/overrides; `A-E03` reconciles actual domain/service chronology and immutable fields. Installed pinned source governs version-specific claims; upstream documentation is supporting evidence, not a replacement for those pins.

### Execution readiness — M103-BASELINE-002

Primary inspection at 2026-08-31 02:38Z used actual HEAD `815b4dca7960bce09e0cf208fb4e4c4a3573421a`, branch `codex/m1-03-real-scan-and-evidence`, initially clean index/worktree. No historical baseline was restored. The exact existing three-file test command in Concrete Steps freshly exited 0 with **182 passed, zero failed/cancelled/skipped/todo** (3985 ms), and the separately executed strict typecheck exited 0. Runtime versions are Node 24.20.0, npm 11.19.0 and Python 3.12.10; all nine installed direct package versions match package.json. The installed browser manifest still selects Chromium 1234 / 151.0.7922.34. Default executable inspection is false and `PLAYWRIGHT_BROWSERS_PATH` is absent.

All six files equal their manifest UTF-8 contents byte-for-byte. Manifest SHA-256 remains `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`; domain source/test hashes still equal M103-BASELINE-001. Package and lock SHA-256 are respectively `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98` and `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`. Existing source/test/config/fixture state is unchanged from this HEAD. The evidence applies only while those paths and installed/runtime identities do not drift. The tests cleaned their own records and processes; `data/runs` is empty, `temp` contains only preserved pre-existing `CONVERSATION.md` and `rd002-npm-cache`, and `logs/agent-flow-leases/v2/active.json` is absent. No browser or provider ran.

The primary records the owner's subsequent exact-task execution instruction, accepts readiness, and uses workflow ID `M1-03-20260831-01`. Status/navigation wording now distinguishes execution authorization from the pending R3, browser and implementation barriers. This checkpoint authorizes no adjacent task and changes no requirement, ADR, package, fixture or executable file.

### Baseline verification — M103-BASELINE-001

Primary inspection on 2026-08-31 (UTC) began and remained at clean HEAD `149466b7499ab3dc954c591721c51fefd352e541`, with an empty index, no active lease and no scanner paths. The exact existing three-file command in Concrete Steps exited **0: 182 tests passed, zero failed/skipped/todo/cancelled**. The separately invoked strict typecheck exited **0**. Runtime fingerprint: Windows/PowerShell, Node **24.20.0**, npm **11.19.0**, Python **3.12.10**; all nine installed direct pins and the installed axe/browser manifest identities match selected records.

The six fixture files equal their manifest UTF-8 contents byte-for-byte. Manifest SHA-256 is `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`. Domain source/test SHA-256 values are `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e` and `e97aac5b0e77bda74381a44c3052637d4d46e05e166bc9f6be4495df6b4130c4`. All six M1-02 source/test/helper LF-normalized hashes match its accepted closure evidence. No source, package, lockfile, configuration, fixture or manifest changed during inspection.

The existing suite removed only its owned synthetic test records/temporary roots and stopped its owned children/listeners; `data/runs` is empty, Git-ignored and untracked, and no `temp/m102-*` root remains. The existing npm cache is preserved. Managed-browser existence inspection returned false; no browser was installed or launched, no live page or provider contacted, and no M1-03 behavior was tested. Working-tree and environment changes invalidate affected evidence; documentation-only edits do not turn this baseline into implementation proof.

### Planning checkpoint

`M103-PLAN-REVIEW-001` (2026-08-31): a fresh `independent_reviewer` returned **PASS**, with no Blocker, Major or Minor, on plan SHA-256 `ba733c50a849706277944ac9aa75e3b89534d8001086b233f519d4fa5f9e27fe` at the baseline HEAD. It inspected the full plan, companion diff, routed authorities, M1-01 literals, M1-02 callback/lifecycle, scope, ownership, command/effect gates, budgets and evidence distinctions. It independently confirmed the candidate identity, expected changed paths, empty index, domain/manifest hashes and `git diff --check`, reusing the fresh 182-test/typecheck baseline without effectful re-execution. Primary reconciled the verdict against the actual candidate and accepts it for planning only. There is no unresolved review finding and no future R3 or S3 checkpoint has passed.

`M103-PLAN-DOC-001` (2026-08-31): primary checks passed **580 relative links, 130 anchors, all 15 required plan sections, nine PowerShell example parses, UTF-8/final-newline/whitespace validation, three JSON configurations, nine installed direct pins and six exact fixture byte matches** across the eleven changed Markdown paths. All 27 other task blocks and milestone statuses are unchanged; M1-03's objective, dependencies, Verification and exclusions are unchanged. Requirement/decision tables, protected implementation/configuration/workflow files, HEAD and branch remain unchanged. The index is empty, no lease or scanner path exists, and run data remains empty/ignored. Roadmap totals are five Complete, one In progress for planning only and 22 Not started. `git diff --check` passes. Recording this verdict changes only plan/progress checkpoint prose, not the reviewed execution contract; final documentation checks cover that maintenance too.

Documentation impact: created this plan and its concise progress record and synchronized nine existing status/navigation owners so the selected task and next gate are discoverable. No source, test, package, configuration, fixture, manifest, requirement/ADR status, browser acquisition, archive move, staging, commit or push occurred. Do not pre-mark the future `M103-LITERALS-001`, setup, Red/Green, browser, slice-review or final-review results.

The only new planning artifacts are this ExecPlan and its [manual progress summary](../../progress/m1-03-real-scan-and-evidence.md). Existing status/navigation owners mirror planning activation. Future production/test paths are listed in Plan of Work; no packet dump, tracked raw report, generated progress ledger, prototype, new manifest or browser harness is created now.

## Interfaces and Dependencies

Preserve `PageAnalysisRun`, `ScanResult`, `Finding`, `ScannerReviewObservation`, `validateRun` and `validateScan` from the domain module exactly. M1-01's contract has closed running/completed/failed branches, exact coverage and allowlisted facts; it does not execute a scanner or promise durability. The normalizer must feed those shapes without an extra schema, general native-record persistence or a new evidence identity.

The existing local service owns run ID, creation time, revision, admission, persistence and shutdown. Its collaborator is `(run: RunningRun, signal: AbortSignal) => Promise<unknown>`. The new scanner must return a valid identity/policy-preserving terminal aggregate, with no direct repository writes. A small admission/preparation boundary must normalize/reject the user's unknown URL before invoking service run creation; exact exports are frozen in `M103-LITERALS-001`. Merely validating an already-created run does not satisfy pre-creation rejection. Application wiring remains M1-05.

Use only the installed standard Node APIs and selected Playwright/axe packages needed by the two scanner modules. TypeScript's current strict include paths already cover the planned files. Keep the minimum concrete shared native-capture/projection seam needed by real execution and the controlled tests; no public fixture argument, generic transport registry, configurable scanner plug-in, extra service or new package is justified. Browser acquisition is developer/test setup only, never an application download capability. No UI, corpus, Ollama, Groq credential or provider SDK is a prerequisite for M1-03.

## Revision note

2026-08-31: Completed the two critical research dimensions, mandatory DRAFT READY synthesis and fresh pre-draft review. Its one consolidated correction resolved paired report provenance, Node artifact environment controls and service-test effects; M103-RP-001-C1 passed all eight invariants. The primary authored L3.1–L3.9 and all six command slots. A different fresh complete-artifact review remains required before workers; no implementation, browser acquisition or lease has begun.

2026-08-31: Recorded exact-task execution authorization and current readiness at the actual clean HEAD, reconciled status/navigation wording, and froze M103-R3-FREEZE-001 after one non-ranking installed-source discovery pass. Started only the two required read-only critical research dimensions. All implementation barriers remain pending.

2026-08-31: Created the task-scoped planning ExecPlan after reviewing the implemented M1-01/M1-02 baseline, fresh verification and frozen RD-003 evidence. Recorded planning-only activation, two bounded future TDD slices, the conditional browser prerequisite, pre-worker R3 literals and command/effect slots, independent review routes and task-only closure. No implementation, dependency, fixture, browser or Git publication change was made.

2026-08-31: Recorded the fresh independent planning PASS and primary documentation/state validation. This checkpoint completes the requested plan preparation only; execution authorization and all implementation gates remain pending. No reviewed execution semantics or protected baseline changed.

2026-08-31: Accepted the owner-authorized F1 regression, separate minimum source correction, complete S3 re-review and fresh 290-test/strict-typecheck integration. Updated current outcomes and the closure candidate while preserving failed attempts, literal bytes and consumed budgets. Final independent review, exact cleanup and documentation closure remain.

2026-08-31: Accepted the different final integrated review, verified and removed only the three task-owned runtime/scratch roots, passed documentation closure and marked only M1-03 Complete. Archived the same plan with repaired navigation and preserved all original evidence, literal bytes, failures and correction budgets.
