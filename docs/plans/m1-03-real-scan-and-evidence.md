# Implement M1-03 real scanning and minimized evidence

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

**Owning task:** [M1-03 — Implement the real exact-three-rule scan and minimized evidence](../DEVELOPMENT_ROADMAP.md#m1-03--implement-the-real-exact-three-rule-scan-and-minimized-evidence). **Roadmap status:** In progress, planning only. The owner's plan-creation request selects this exact dependency-ready task; it does not authorize executing it. No application, test, configuration, dependency, fixture, or browser-installation work is authorized by this planning checkpoint. Obtain the owner's exact-task execution instruction before the execution steps below. M1-04 and M1-05 remain unselected, and M1 is not complete.

Read [AGENTS.md](../../AGENTS.md), the [authority map](../README.md), [PLANS.md](../../PLANS.md), the [agent workflow](../../.codex/README.md), [worker-first workflow](../../.codex/execplan-implementation-workflow.md), [write-lease guard](../../.codex/write-lease-guard.md), and [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) before executing. The primary owns this plan, authority interpretation, all research-derived documentation, evidence acceptance, status and closure. Research/review roles are read-only. Test and production edits use separate guarded workers; no lease is open for planning.

## Progress

- [x] (2026-08-31 02:05Z) Reviewed the current repository, completed prerequisites, routed M1-03 authorities, existing service handoff and frozen evaluation inputs. `M103-BASELINE-001` records 182 passing existing tests, independent strict typechecking, matching installed pins and fixture bytes, clean Git state and no active lease.
- [x] (2026-08-31 02:05Z) Bounded this plan to M1-03 with two future behavior-bearing slices, a conditional non-TDD browser prerequisite, and an explicit pre-worker literal barrier. No implementation or browser acquisition has begun.
- [x] (2026-08-31 02:17Z) Fresh independent planning review returned PASS with no findings. Primary reconciled the reviewed candidate and passed the planning documentation checks; `M103-PLAN-REVIEW-001` and `M103-PLAN-DOC-001` record this planning-only checkpoint.
- [ ] Obtain exact-task execution authorization and recheck readiness and evidence freshness.
- [ ] Complete `M103-LITERALS-001` research, mandatory synthesis, fresh pre-draft review, primary-authored literals and a different fresh final research review; freeze commands and effects before workers.
- [ ] Complete `M103-NORMALIZE-01` preflight, independently owned Red/Green and S3 review.
- [ ] Verify the matching managed browser; if absent, complete the separately guarded `M103-BROWSER-SETUP-01` prerequisite and its proportional review.
- [ ] Complete `M103-SCAN-01` preflight, independently owned Red/Green, real-browser evidence and S3 review.
- [ ] Complete integrated verification, a different fresh integrated critical review, cleanup and documentation closure; only then mark M1-03 Complete and archive this plan.

## Surprises & Discoveries

- The baseline already contains a real local service and filesystem repository, not just types. [service.ts](../../src/server/service.ts) exposes an internal `runScan(input, execute)` collaborator receiving a validated running record and `AbortSignal`. Its HTTP interface deliberately exposes only health and read operations; scanning is still unavailable. M1-03 can satisfy that collaborator without changing service routes, persistence or the entry point.
- RD-003's [manifest](../../evaluation/rd003-scan-v1.json) loads exact authored HTML with offline `page.setContent`. Its fixture selectors, one-target expectations, evidence-policy label and evaluation-process supervision are not public scanner defaults. A fixture page's `about:blank` identity must not be replaced with an invented HTTPS observation to manufacture a completed public run.
- [M1-01's literal contract](completed/m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1) already freezes the public evidence representation. It uses structural locators, supports input/textarea label facts, and distinguishes absent buckets from explicit inapplicable zero. The older Proposed assessments cannot override those fields or RD-003's exact corrected contrast content.
- The currently resolved Playwright managed Chromium executable is absent (`managedChromiumPresent:false`). The selected packages are installed. This is an execution prerequisite to recheck, not a reason to repeat RD-002, change versions, attach the user's browser, or download anything during planning.
- Fresh baseline tests cleaned their own synthetic records and temporary roots successfully. `data/runs` is empty and ignored; no M1-02 temporary root or active lease remains. Six M1-02 source/test/helper hashes match accepted closure after LF normalization; checkout CRLF bytes are not semantic drift.

## Decision Log

- Decision: Activate only M1-03 planning and preserve all other task statuses and dependencies. Rationale: the owner selected this plan, prerequisites are Complete, and plan creation is not execution authorization. Date/Author: 2026-08-31 / primary.
- Decision: Use two coherent TDD slices: complete native-result normalization, then URL/browser execution and evidence capture using that result boundary. Rationale: these have distinct falsifiable contracts and ownership boundaries; a separate module, service or slice for every validation helper would add unnecessary machinery. Date/Author: 2026-08-31 / primary.
- Decision: Protect the M1-01 contract, M1-02 implementation and RD-003 gold inputs. Rationale: the roadmap permits implementation against that shared contract, not independent changes to it; HTTP Analyze integration and the trusted public-page smoke belong to M1-05. Date/Author: 2026-08-31 / primary.
- Decision: Current repository inspection is R0; this owner-facing planning artifact is R2. The primary supplies its planning synthesis and one fresh independent final planning review. Future native identity/minimization and browser ownership decisions require R3 and are not selected here. Rationale: avoid unnecessary R0 agents or an unconditional R2 pre-draft review while retaining the triggered critical execution barriers. Date/Author: 2026-08-31 / primary.
- Decision: Reuse the existing exact package/toolchain pins. Browser acquisition, if needed, is a separately recorded non-TDD prerequisite with exact commands, paths, mutations and cleanup frozen before a lease. Rationale: no new dependency, package/lockfile generation, tool selection or runtime manager is needed for M1-03. Date/Author: 2026-08-31 / primary.
- Decision: Accept the independently reviewed planning artifact only. Rationale: the fresh R2 review found no Blocker, Major or Minor, and primary validation confirms exact task scope, documentation consistency and protected baseline preservation. Every execution authorization, R3 literal, setup and S3 implementation gate remains pending. Date/Author: 2026-08-31 / primary.

## Outcomes & Retrospective

Planning is complete: M1-03 is dependency-ready, the bounded implementation and verification plan passed fresh independent review with no findings, and documentation validation passed. The existing 182-test baseline passes; that is evidence for already completed work, not proof of real scanning. All M1-03 research-selection, setup, TDD and implementation-review evidence remains future work. The next boundary is an owner instruction to execute this exact task, followed by the literal barrier below. The roadmap remains In progress for planning only, and this plan stays active.

## Purpose / Big Picture

M1-03 supplies the missing real scanner behind the established run contract. After execution, application-owned modules will reject unsupported input before a run is created, use one fresh managed browser context to inspect one trusted HTTPS page, run exactly `image-alt`, `label` and `color-contrast`, and return either a complete minimized terminal result or a bounded failure with truthful cleanup disposition. Every violation node remains independently addressable; native incomplete nodes remain separate observations.

A reviewer will exercise the real browser/scanner path on the frozen synthetic states and inspect focused negative tests for URL admission, full coverage, privacy, native-node correspondence and failure cleanup. These checks establish a backend capability, not a rendered Analyze workflow or durable end-to-end milestone. M1-02 owns durable publication; M1-04 owns the UI; M1-05 joins those capabilities and owns the single trusted public-page smoke. Neither a completed scan nor a zero count proves accessibility, WCAG conformance, certification or legal compliance.

## Context and Orientation

### Current project state and readiness

The planning baseline is clean commit `149466b7499ab3dc954c591721c51fefd352e541`, `feat: implement M1-02 local service and aggregate (#8)`, on `codex/m1-03-real-scan-and-evidence`. RD-001, RD-002, RD-003, M1-01 and M1-02 are Complete. M1-03 is now selected for planning; the other 22 application tasks remain Not started. The milestone's integrated outcome remains unimplemented.

| Existing boundary | Evidence and consequence for this task |
| --- | --- |
| Toolchain | [RD-002](completed/rd-002-minimum-development-toolchain-literals.md) and [developer instructions](../../README.md#development-toolchain) select Node 24.20.0, npm 11.19.0, native erasable TypeScript, strict `tsc`, and `node:test`/`node:assert/strict`. Current versions and all nine installed direct pins match. No framework or test-runner selection is open. |
| Browser/scanner inputs | RD-003 is Complete. [The scan-only manifest](../../evaluation/rd003-scan-v1.json) and six LF fixture files match exactly. Selected Playwright is 1.62.1, `@axe-core/playwright` and resolved axe-core are 4.13.0; the installed Playwright browser manifest identifies Chromium revision 1234/version 151.0.7922.34. These are local pinned records, not release/support claims. |
| Run and scan contract | [run-contract.ts](../../src/server/domain/run-contract.ts) defines application-owned readonly types plus `validateRun(unknown)` and `validateScan(unknown)`. The [58 contract tests](../../tests/run-contract.test.ts) pass. Its literal contract controls fields, facts, coverage, chronology and terminal states. No schema extension is planned. |
| Local host and aggregate | [service.ts](../../src/server/service.ts), [run-repository.ts](../../src/server/persistence/run-repository.ts), [main.ts](../../src/server/main.ts), and the [M1-02 evidence](completed/m1-02-local-service-and-aggregate.md#accepted-final-integrated-review--m102-integrated-review-01) establish guarded admission, create/read/finish, bounded shutdown and disk/loopback behavior. The full current suite passes 182/182. |
| Missing capabilities | There is no production scanner, evidence normalizer or scanner test. Client entry/UI, retrieval, models/providers, review and comparison are absent. `build` remains a future client command; service start is real but does not scan. |

M1-03's actual dependencies are M1-01 and RD-003, both Complete. M1-02 is useful existing integration context, not a new dependency added by this plan. All directly applicable Must requirements and open-decision portions are Accepted or explicitly Deferred. The accepted product boundary and failing/corrected scanner expectations are frozen. Remaining public execution, extraction, identity and command literals are ordinary choices owned by M1-03, but must be fully resolved before dependent workers. The absent managed browser blocks browser execution until restored, not planning or unrelated pure normalization checks.

### Applicable authorities and vocabulary

| Authority | Exact portions to apply |
| --- | --- |
| [Roadmap M1-03](../DEVELOPMENT_ROADMAP.md#m1-03--implement-the-real-exact-three-rule-scan-and-minimized-evidence) | Objective, unchanged dependencies, Expected output, Verification and exclusions; [M1-04](../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results) and [M1-05](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton) identify the adjacent ownership limits. |
| [Target authorization and scanning](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning) | `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-001`, `REQ-SCAN-005`–`REQ-SCAN-007`: basic HTTPS input, passive top-level exact-three-rule scan, complete collections and individual unavailable facts. |
| [Evidence and provenance](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance) | `REQ-EVID-007`–`REQ-EVID-010`: each returned node, minimized facts, all-rule coverage and exact-locator evidence. Capture the locator now; comparison and targeted positive retention remain M5 work. `REQ-EVID-002` and `REQ-SCAN-002` govern the existing controlled same-target evidence, not a general pass archive. |
| [Privacy and security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security) | `REQ-SEC-026`, plus the directly affected retention/diagnostic constraints in `REQ-SEC-002`, `REQ-SEC-003`, `REQ-SEC-007`, `REQ-SEC-012` and `REQ-SEC-021`. Trusted non-sensitive public URLs may be normalized and retained only in run provenance; there is no secret-classification or URL-approval subsystem. |
| [Reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations) and [lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#pageanalysisrun-lifecycle) | `REQ-QUAL-001`, `REQ-QUAL-010`–`REQ-QUAL-013`, `REQ-QUAL-019` and `REQ-QUAL-020`: unknown-input checks, atomic collection, failure versus individual missing facts, immutable scan evidence and ownership of persistence. No queue, automatic retry or supervisor. |
| [ADR-0008](../architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md), [ADR-0009](../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md), [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) | Accepted Playwright/axe evaluation baselines and current trusted-operator browser boundary, including ordinary redirects/subresources, downloads disabled and cleanup. ADR-0017 and superseded hostile-target rows are history, not requirements to implement. |
| [Evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), [fixed checks](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#fixed-executions-and-shared-checks) and RD-003 | `REQ-EVAL-001`, `REQ-EVAL-004`, `REQ-EVAL-005`, `REQ-EVAL-007`; exact existing six-state inputs and non-promotable scan-only observations. Preserve old results and keep new implementation evidence distinct. |
| [SPEC](../specs/SPEC.feature) and [HARD_SPEC](../specs/HARD_SPEC.feature) | Backend portions of `SPEC-001`/`BHV-01`, all applicable scan portions of `HS-001` and `HS-004`; `HS-006` supports minimization. These are non-executable planning scenarios. UI/disclosure and scan-to-disk integration remain adjacent tasks. |
| Existing literal authorities | [M1-01 L1.1–L1.11](completed/m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1), especially L1.3–L1.9; [M1-02 L1.4–L1.6](completed/m1-02-local-service-and-aggregate.md#l14--service-interfaces-and-admission) for the available callback, immutable input, failure and shutdown handoff. |

The [architecture map](../architecture/README.md), [candidate architecture](../architecture/CANDIDATE_ARCHITECTURE.md), [scan assessment router](../architecture/candidates/authorized-scan/README.md), [controlled-fixture assessment](../architecture/candidates/authorized-scan/CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md), [evidence-capture assessment](../architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md), and [local feasibility](../LOCAL_MVP_FEASIBILITY.md) supply context only. Dated proposed selectors, impact/sufficiency fields, timeout suggestions and fixture colors cannot supersede later frozen literals. No unrelated model or retrieval assessment is needed.

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

Use [M1-01 L1.5–L1.9](completed/m1-01-run-and-scan-contracts.md#l15-exact-rule-coverage), `REQ-SCAN-005`–`007`, `REQ-EVID-007`–`010`, `REQ-SEC-003`, `REQ-QUAL-010`/`019` and HS-004/HS-006 as the capsule anchors. The `test_worker` first performs read-only preflight against the agreed normalizer export and existing domain checks. If missing, write one coherent behavioral suite, stop at Red, and have the primary accept the complete test boundary before the separate `code_worker` reaches minimum Green. No provisional production stub is permitted.

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

These are planned scopes, not active packets. The primary projects each into all four exact lists in [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), including explicit `None`, chosen optional-helper disposition and precise protected files. No wildcard write scope or repo-root permission is an assignment. Workers are not alone in the repository, must preserve peer/user changes, and may use Git only for inspection. They never operate the guard or stage, commit, push, stash, modify refs/config/hooks or otherwise mutate Git state.

Only one lease may be active in this worktree. The primary opens it immediately before each write turn, inserts the exact digest into the packet, terminally closes it after the worker stops and inspects the actual diff, commands, effects and fresh compliant receipt before acceptance. Documentation and guard-control maintenance occur between leases. A receipt proves only the guard's endpoint scope, not behavior, ignored output, OS cleanup or attribution. No parallel writers or worktrees are needed for this task; only independent read-only evidence gathering/review may overlap useful primary work.

Each behavioral slice gets one read-only preflight, one coherent Red or passing characterization, one Green with optional behavior-preserving Refactor, at most one same-contract correction per role and one review correction loop. Keep one test worker and one selected code worker for that slice; persistence of an agent never persists a lease. Attempt 2 names its terminal attempt-1 parent and gets a fresh packet, digest and baseline. Stop on the same decisive failure twice, a second unsuccessful correction, two no-diff write handoffs, more than three TDD cycles, exhausted budget, rejected or wrong-failure Red, a binding-field change, conflicting authority, unexpected overlap or any noncompliant/unverifiable guard result. Do not reset allowances by respawning.

`EXISTING_AND_COVERED` reuses fresh coverage without new tests or Green; `EXISTING_BUT_UNCOVERED` gets test-owned passing characterization without Green; `MISSING`/`REGRESSION` gets Red then Green. For `PARTIAL`, the primary isolates the explicit missing gap and reconciles any changed binding field before writes; `UNKNOWN`/`CONFLICTING` stops for evidence or authority reconciliation. Search absence alone is not preflight proof. For a genuinely absent first export, use only [ADR-0024's first-module Red exception](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception): verified environment, frozen import/callable, complete tests, honest expected missing-callable failure and explicit unexecuted assertions. Green must execute every accepted test unchanged and pass independent strict typechecking. No missing-import skip or placeholder implementation is allowed.

Evidence is reusable only with its exact command, working directory, relevant-tree fingerprint, environment fingerprint and no-drift check. Browser artifacts/profile, fixture bytes, native capture or test changes invalidate affected browser evidence. An ordinary test correction belongs to `test_worker`; an exceptional direct primary test correction must occur between leases, record its reason/paths/validation, invalidate prior Red/characterization and establish a fresh accepted test boundary before Green resumes.

## Decision Review Contract

### M103-LITERALS-001 — native collection and browser ownership

**State: not executed; no options selected.** This is a future task-owned R3 decision record, not a new ADR or implementation authorization. Its target artifact is one primary-authored literal section in this plan. The exact question is: what is the smallest complete native-data/DOM projection and managed-browser execution protocol that implements the existing M1-01 fields and M1-03 Verification without changing the shared contract, fixed evaluation or service topology?

R3 is triggered by native identity and collection integrity, privacy-sensitive projection, and timeout/AbortSignal/resource-ownership mechanics not yet frozen. Before any ranking, record the candidate set actually supported by pinned primary evidence; do not manufacture three alternatives or reconsider the accepted scanner/toolchain. The common criteria are complete Accepted behavior, truthful identity/provenance, no result loss or secret retention, bounded owned cleanup, compatibility with the existing callback and tests, and the smallest direct implementation. Hard gates dominate preference; this is not a scored product/tool leaderboard.

After execution authorization, permit at most one non-ranking discovery pass. Assign **two bounded `critical_researcher` reports**, one for native-result integrity/DOM correspondence/minimization and one for browser admission/lifecycle/cleanup and the service handoff. They may run concurrently against the same frozen anchors, report dependencies and wait for primary reconciliation rather than revising each other's assumptions. Use installed version-pinned sources and applicable official documentation; verify uncertain/time-sensitive API facts against primary sources. No research role installs a browser, edits files or runs an unapproved live target. No ordinary researcher, drafter or standing panel is needed.

Every research/analyst/review assignment receives [Research Assignment Capsule v1](../../.codex/README.md#research-assignment-capsule-v1), projected from this contract: exact identity/tier/trigger, question, options and evidence dimensions, target, authority anchors, shared evidence IDs/freshness, criteria/hard gates, forbidden scope/owner boundary, bounded output, budget/stops, read-only permissions, peer synchronization/follow-up and next barrier. Require concise source-linked findings, failure cases, candidate disqualifiers and reversal conditions, remaining unknowns and a role-appropriate readiness result; no raw page data or complete duplicate reports in Git.

Wait at one research barrier. Allow one bounded follow-up round, at most one follow-up for each report's assigned gap. A `decision_analyst` is mandatory, with one synthesis and at most one supported correction; it returns exactly `DRAFT READY`, `RETURN FOR RESEARCH` or `OWNER DIRECTION`. `DRAFT READY` alone does not clear R3: a fresh `critical_research_reviewer` must pass the pre-draft contract checkpoint, with at most one supported outline correction. Then the primary writes the complete literal section and a **different fresh** `critical_research_reviewer` reviews the whole artifact and cumulative invariant packet. There is no drafter. At most two final-artifact correction cycles are permitted; every R3 revision receives the complete review, not just review of the fixed lines. Material changes invalidate the affected earlier checkpoint without resetting any allowance.

Stop for primary reconciliation or owner direction on repeated decisive gaps, two `RETURN FOR RESEARCH` results without material new evidence, exhausted allowance, a changed shared contract or requirement, unsupported evidence, a new normative subsystem or unresolved owner-controlled choice. Research/reviewer output cannot accept an ADR, change status or authorize a worker. The post-verdict barrier must align reviewed literals, unresolved findings, hard gates, command effects, recommendation, approval and next action. Only a complete accepted literal contract with no blocking findings permits packets/preflight.

### Decide before workers; prove afterward

All entries are **UNRESOLVED** at planning. They must become explicit exact literals, or a justified `None`, in the primary-authored contract before the affected worker lease; unknown decision semantics cannot be relabeled downstream proof.

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

The expectation is binding now; execution evidence is **Pending** for every row. Current baseline evidence proves only the unchanged starting state. The research reviewers own contract completeness; the named implementation reviewers later assess proof. Re-run the entire applicable packet after material revisions and all R3 corrections.

| ID / trigger | Required invariant and decisive case | Evidence / responsible reviewer |
| --- | --- | --- |
| M103-I1 — artifact completeness and authority | Explicit authorization, dependencies, frozen inputs, all literal/command slots and scopes; no shared-contract/ADR/status change or future task implied. Planning, decisions and runtime proof remain distinct. | Pending; both research checkpoints, primary and final integrated reviewer. |
| M103-I2 — input and provider boundary | Malformed/credential/scheme rejection precedes run creation/navigation. Fresh state, no deliberate interaction/crawl, no accepted/retained download or app download path; provider mode is context only. | Pending; scan S3 and integrated reviewer; basic admission plus real-browser/source evidence. |
| M103-I3 — exact collection integrity | Four native arrays and exactly three rules validate; every violation/incomplete node preserved, missing coverage/unexpected rules/native errors fail, null/zero counts truthful; zero with native incompletes is not all-clear. | Pending; normalization and scan S3 reviewers; complete/malformed/multi-node/incomplete/zero cases. |
| M103-I4 — minimization and native measurements | Only existing public facts leave capture; source omissions keep items, fatal collection failure does not. Native checks and contrast provenance retained without recomputation; credentials, text, values, arbitrary attributes/HTML/native payload absent. | Pending; both S3 reviewers; synthetic canaries plus real frozen evidence. |
| M103-I5 — stable identity and correspondence | Within-run IDs unique and not display indices/locators; identical locators do not merge items. Structural locator has unique actual correspondence or an exact unavailability reason, including unsupported shadow/drift cases. | Pending; both S3 reviewers; unit and real DOM evidence. |
| M103-I6 — terminal ownership and failure | Immutable running context preserved; final URL/version/readiness/scan time actually observed. Success only after complete validation and confirmed closure. Timeout/shutdown/late work or uncertain cleanup never becomes completed/partial success. | Pending; scan S3 and integrated reviewer; lifecycle/failure tests and actual owned-resource checks. |
| M103-I7 — fixed evidence and honest scope | All six exact fixture states unchanged; same production capture/projection, native corrected positives, no gold metadata leakage or invented public provenance; separate navigation-test identity; no public smoke or comparison implementation. | Pending; scan S3 and integrated reviewer; manifest/byte checks and native assertions. |
| M103-I8 — execution ownership and recovery | Fresh guarded sequential Red/Green, fixed test ownership, exact commands/effects, bounded corrections, no unleased implementation, safe owned cleanup and consistent documentation/status. | Pending; primary, setup/slice reviewers and different integrated reviewer. |

The current R2 planning artifact selects none of those critical literals. Primary planning synthesis is `DRAFT READY` for the structure and gates only; that is its untriggered R2 contract checkpoint. One fresh `independent_reviewer` reviews this owner-facing plan and activation diff. No analyst or pre-draft review is added to planning simply because R3 will be required during execution. A planning correction that actually selects critical mechanics must stop and be rerouted rather than smuggled into R2.

## Concrete Steps

### Current safe inspection and existing baseline commands

Run from the repository root, the directory containing `AGENTS.md`. These commands already exist; they create no M1-03 source or browser behavior:

```powershell
git status --short
git rev-parse HEAD
node --version
npm.cmd --version
python --version
git check-ignore -v data/runs/m103-ignore-probe/run.json
git ls-files -- data/runs
```

The ignore probe is a path argument only; do not create a record. Expected selected baseline: Node `v24.20.0`, npm `11.19.0`, Python at least 3.10, ignored/untracked run data, and a reconciled tree. Inspect the managed executable without launching it:

```powershell
node --input-type=module --eval "import { chromium } from 'playwright'; import { existsSync } from 'node:fs'; console.log(JSON.stringify({managedChromiumPresent:existsSync(chromium.executablePath())}));"
```

Use the same existing npm options for every named test/typecheck command:

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

These are explicit **unresolved slots**, not commands to run or authority for a worker to improvise. Complete them in `M103-LITERALS-001`, record fingerprints and review their effects before the dependent lease.

| Slot | Required exact command/effect record |
| --- | --- |
| M103-CMD-PREFLIGHT | Exact callable imports and safe preflight checks for each slice; selected environment/version inspections and expected missing-export versus runtime failures. A preflight that would mutate caches/state returns to the primary rather than writing without a lease. |
| M103-CMD-SETUP | Conditional installed-Playwright browser acquisition command; exact managed-browser identity, package source/CLI path, download destination, permitted network access/approval and cache/temp inventory. Bootstrap manifest/lock generation and package/config metadata mutations: **None permitted**. No global install, PATH or user browser change. |
| M103-CMD-ENV | Exact process-local browser environment and task-owned cache/root values for setup and tests, prior-value preservation/restoration, installed-version check and any allowed launch/close-only prerequisite. Resolve roots inside the workspace and reject unsafe/nonordinary or pre-existing unowned targets. |
| M103-CMD-CLEAN-STATE | Read-only inventory plus safe preparation of an exact fresh owned test/acquisition directory; how an interrupted prior attempt is identified without erasing it. No clearing `temp`, `node_modules`, `data/runs`, user caches or an unresolved/glob target. |
| M103-CMD-BROWSER | Exact browser-suite command below plus the frozen environment, six-case and navigation-test transports, timeout expectations, allowed loopback/intercepted requests, output restrictions and actual browser/temporary-file cleanup evidence. No external public page or provider request. |
| M103-CMD-CLEANUP | Exact commands/owners for removing only proven task-created browser/cache/test artifacts and restoring process-local settings. Explicit preservation of the existing npm cache, dependencies, prior records and unrelated files; partial failure and unverified-process handling. |

If dependencies cease to match, stop and reconcile against the existing [locked restore instructions](../../README.md#development-toolchain); record that command and its `node_modules`/cache effects before any setup lease. Do not regenerate package metadata or silently add a restore to a test assignment. No dependency restoration is currently needed.

### Future focused and task-level commands

The following paths are planned and **do not exist yet**. They become authoritative only when the literal barrier, path packet and environment/effect slots above are accepted. They use the existing npm script, not a new runner:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/scan-normalization.test.ts
npm.cmd @toolchainOptions run test:focused -- tests/scan-page.test.ts
npm.cmd @toolchainOptions run typecheck
```

The complete task-closure command, if those paths remain the frozen contract, is:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts
npm.cmd @toolchainOptions run typecheck
git diff --check
```

Do not execute a future path during planning. Expected initial Red is the frozen missing callable or a genuine assertion failure, not a browser-not-installed, network, dependency or TypeScript environment error. Expected Green/closure is all accepted tests executed and passing, no skip/todo/only markers, independently passing strict typechecking and verified owned-resource closure. No client `build`, HTTP Analyze request, external smoke, model setup or generation command belongs here.

Use the [guard's actual start/close protocol](../../.codex/write-lease-guard.md#commands) with the exact active packet. The primary records workflow/slice/assignment/lease IDs, digest, terminal receipt and accepted evidence in this plan between leases. A guard self-test may establish a missing/stale tooling prerequisite; it is not scanner evidence and need not be rerun for unchanged documentation.

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

### Baseline verification — M103-BASELINE-001

Primary inspection on 2026-08-31 (UTC) began and remained at clean HEAD `149466b7499ab3dc954c591721c51fefd352e541`, with an empty index, no active lease and no scanner paths. The exact existing three-file command in Concrete Steps exited **0: 182 tests passed, zero failed/skipped/todo/cancelled**. The separately invoked strict typecheck exited **0**. Runtime fingerprint: Windows/PowerShell, Node **24.20.0**, npm **11.19.0**, Python **3.12.10**; all nine installed direct pins and the installed axe/browser manifest identities match selected records.

The six fixture files equal their manifest UTF-8 contents byte-for-byte. Manifest SHA-256 is `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`. Domain source/test SHA-256 values are `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e` and `e97aac5b0e77bda74381a44c3052637d4d46e05e166bc9f6be4495df6b4130c4`. All six M1-02 source/test/helper LF-normalized hashes match its accepted closure evidence. No source, package, lockfile, configuration, fixture or manifest changed during inspection.

The existing suite removed only its owned synthetic test records/temporary roots and stopped its owned children/listeners; `data/runs` is empty, Git-ignored and untracked, and no `temp/m102-*` root remains. The existing npm cache is preserved. Managed-browser existence inspection returned false; no browser was installed or launched, no live page or provider contacted, and no M1-03 behavior was tested. Working-tree and environment changes invalidate affected evidence; documentation-only edits do not turn this baseline into implementation proof.

### Planning checkpoint

`M103-PLAN-REVIEW-001` (2026-08-31): a fresh `independent_reviewer` returned **PASS**, with no Blocker, Major or Minor, on plan SHA-256 `ba733c50a849706277944ac9aa75e3b89534d8001086b233f519d4fa5f9e27fe` at the baseline HEAD. It inspected the full plan, companion diff, routed authorities, M1-01 literals, M1-02 callback/lifecycle, scope, ownership, command/effect gates, budgets and evidence distinctions. It independently confirmed the candidate identity, expected changed paths, empty index, domain/manifest hashes and `git diff --check`, reusing the fresh 182-test/typecheck baseline without effectful re-execution. Primary reconciled the verdict against the actual candidate and accepts it for planning only. There is no unresolved review finding and no future R3 or S3 checkpoint has passed.

`M103-PLAN-DOC-001` (2026-08-31): primary checks passed **580 relative links, 130 anchors, all 15 required plan sections, nine PowerShell example parses, UTF-8/final-newline/whitespace validation, three JSON configurations, nine installed direct pins and six exact fixture byte matches** across the eleven changed Markdown paths. All 27 other task blocks and milestone statuses are unchanged; M1-03's objective, dependencies, Verification and exclusions are unchanged. Requirement/decision tables, protected implementation/configuration/workflow files, HEAD and branch remain unchanged. The index is empty, no lease or scanner path exists, and run data remains empty/ignored. Roadmap totals are five Complete, one In progress for planning only and 22 Not started. `git diff --check` passes. Recording this verdict changes only plan/progress checkpoint prose, not the reviewed execution contract; final documentation checks cover that maintenance too.

Documentation impact: created this plan and its concise progress record and synchronized nine existing status/navigation owners so the selected task and next gate are discoverable. No source, test, package, configuration, fixture, manifest, requirement/ADR status, browser acquisition, archive move, staging, commit or push occurred. Do not pre-mark the future `M103-LITERALS-001`, setup, Red/Green, browser, slice-review or final-review results.

The only new planning artifacts are this ExecPlan and its [manual progress summary](../progress/m1-03-real-scan-and-evidence.md). Existing status/navigation owners mirror planning activation. Future production/test paths are listed in Plan of Work; no packet dump, tracked raw report, generated progress ledger, prototype, new manifest or browser harness is created now.

## Interfaces and Dependencies

Preserve `PageAnalysisRun`, `ScanResult`, `Finding`, `ScannerReviewObservation`, `validateRun` and `validateScan` from the domain module exactly. M1-01's contract has closed running/completed/failed branches, exact coverage and allowlisted facts; it does not execute a scanner or promise durability. The normalizer must feed those shapes without an extra schema, general native-record persistence or a new evidence identity.

The existing local service owns run ID, creation time, revision, admission, persistence and shutdown. Its collaborator is `(run: RunningRun, signal: AbortSignal) => Promise<unknown>`. The new scanner must return a valid identity/policy-preserving terminal aggregate, with no direct repository writes. A small admission/preparation boundary must normalize/reject the user's unknown URL before invoking service run creation; exact exports are frozen in `M103-LITERALS-001`. Merely validating an already-created run does not satisfy pre-creation rejection. Application wiring remains M1-05.

Use only the installed standard Node APIs and selected Playwright/axe packages needed by the two scanner modules. TypeScript's current strict include paths already cover the planned files. Keep the minimum concrete shared native-capture/projection seam needed by real execution and the controlled tests; no public fixture argument, generic transport registry, configurable scanner plug-in, extra service or new package is justified. Browser acquisition is developer/test setup only, never an application download capability. No UI, corpus, Ollama, Groq credential or provider SDK is a prerequisite for M1-03.

## Revision note

2026-08-31: Created the task-scoped planning ExecPlan after reviewing the implemented M1-01/M1-02 baseline, fresh verification and frozen RD-003 evidence. Recorded planning-only activation, two bounded future TDD slices, the conditional browser prerequisite, pre-worker R3 literals and command/effect slots, independent review routes and task-only closure. No implementation, dependency, fixture, browser or Git publication change was made.

2026-08-31: Recorded the fresh independent planning PASS and primary documentation/state validation. This checkpoint completes the requested plan preparation only; execution authorization and all implementation gates remain pending. No reviewed execution semantics or protected baseline changed.
