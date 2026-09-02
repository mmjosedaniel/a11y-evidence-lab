# Integrate and verify the walking skeleton (M1-05)

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-05 — Integrate and verify the walking skeleton](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton). The owner explicitly selected M1-05 and approved the structural slices described below. The first preserved the existing loopback-service behavior while giving its stateless responsibilities focused modules. The second preserves the existing scanner behavior while extracting stateless request preparation, native capture, value reading, and rule-evidence projection from its two ordering-sensitive coordinators. Neither slice connects the HTTP Analyze path to the real scanner, completes the milestone integration checkpoint, authorizes M2 work, or authorizes a commit or push.

## Progress

- [x] (2026-09-02) Confirmed M1-02, M1-03, and M1-04 are Complete and reconciled M1-04's final umbrella closure from its accepted verification, review, cleanup, and documentation evidence.
- [x] (2026-09-02) Received explicit owner selection of M1-05 and approval of `M105-LOCAL-SERVICE-MODULE-REFACTOR-01` with the named module boundary and behavior-preserving constraints.
- [x] (2026-09-02) Completed R0 repository-local responsibility and consumer analysis. The existing 69-case local-service suite is the proposed passing characterization boundary; no significant architecture decision or new dependency is required.
- [x] (2026-09-02) Accepted read-only test-worker preflight as `EXISTING_AND_COVERED`: all 69 local-service and entry-point cases passed with zero failure, cancellation, skip, or todo and no repository residue.
- [x] (2026-09-02) Extracted the four focused modules under a separate guarded `code_worker` Green/Refactor lease while preserving `service.ts` as the stable public entry point and lifecycle coordinator. The lease closed compliant with exactly the five allowed production paths.
- [x] (2026-09-02) Passed focused, strict, syntax, and complete 290-case backend/scanner verification; received fresh S3 PASS after one documentation-only correction; removed the empty scanner scratch; and completed the structural slice's documentation barrier.
- [x] (2026-09-02) Corrected the external review's P3 dependency-clarity finding by making `service.ts` import only the `Server` type from `node:http`; the unchanged focused and complete regression boundaries passed and bounded correction review returned PASS with no finding.
- [x] (2026-09-02) Received explicit owner approval of `M105-SCANNER-MODULE-REFACTOR-02` with the exact seven-module boundary, stable public entry points, 88-case characterization boundary, and behavior-preserving constraints.
- [x] (2026-09-02) Accepted corrected read-only test-worker preflight as `EXISTING_AND_COVERED`: all 88 leaf scanner cases passed under the required environment, with 108 TAP tests including parent groups, no test/source change, and empty scratch. The first packet stopped before execution because it named an obsolete M1-03 plan path; the corrected packet used the authority linked by `docs/README.md`.
- [x] (2026-09-02) Completed the guarded seven-path scanner Green/Refactor. The lease closed fresh and compliant; focused 88-leaf scanner verification, strict TypeScript, seven syntax checks, and the complete 290-case backend/scanner regression pass with empty scratch and unchanged protected inputs.
- [x] (2026-09-02) Accepted fresh S3 PASS with no Blocker, Major, or Minor finding; the reviewer independently validated reporter serialization, native evidence privacy, precedence, lifecycle placement, stable imports, hashes, and cohesion as `REFACTORED`. Completed scanner-slice cleanup and documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Accepted the owner-supplied external P2 finding that exported policy tuples remained mutable at runtime. A process-isolated probe reproduced rule/bucket profile corruption and message-key allowlist expansion; the prior scanner S3 PASS is superseded for this correction boundary.
- [x] (2026-09-02) Froze all six exported policy tuples under a fresh compliant attempt-2 Green lease. The direct mutation-resistance probe, unchanged 88-leaf scanner boundary, complete 290-case regression, strict TypeScript, and seven syntax checks passed before the correction advanced to renewed S3 review.
- [x] (2026-09-02) Accepted renewed S3 PASS with no Blocker, Major, or Minor finding. The reviewer independently confirmed hostile mutation resistance, exact tuple identity, factory isolation, unknown-message-key withholding, stable exports, and unchanged cohesion; completed correction cleanup and documentation reconciliation while keeping M1-05 In progress.
- [ ] Implement the separately planned HTTP scan integration and complete M1-05's browser/build integration checkpoint before task closure.

## Surprises & Discoveries

- Observation: `service.ts` combines stateless validation and transport policy with one ordering-sensitive lifecycle protocol. Evidence: `src/server/service.ts` keeps admission, synchronous read ownership, active operation reservation, stop notification, abort, deadline, cleanup uncertainty, listener close, and stop settlement in one closure. Splitting those state transitions would require a shared mutable abstraction and would weaken local reasoning.
- Observation: Existing interception tests replace methods on the default `node:http` object. Evidence: `tests/local-service.test.ts` patches `http.createServer`; the extracted HTTP module must continue importing and using that default object.
- Observation: The local-service suite already characterizes the public API and the critical ordering paths in 69 cases. Evidence: `tests/local-service.test.ts`; the approved change is structural and does not justify file-layout assertions or implementation-shaped tests.
- Observation: The complete scanner regression depends on the M1-03 process environment, including repository-owned `TEMP` and `TMP`. Evidence: an initial invocation without that environment failed only the scan-page temporary-directory assertions; the corrected invocation with the pinned browser path and all required variables passed all 290 cases and left the scratch directory empty.
- Observation: An external independent review found that `service.ts` retained a runtime default `node:http` import solely for the `http.Server` annotation after HTTP construction moved to `loopback-api.ts`. Evidence: `service.ts` line 1 and the server declaration; with `verbatimModuleSyntax`, the import remains in emitted runtime code even though the coordinator does not construct HTTP objects.
- Observation: `scan-page.ts` combines stateless scan-request/profile preparation and serialized in-page capture with an ordering-sensitive browser lifecycle. Evidence: `executeScan` shares browser acquisition, cancellation, operation deadline, late settlement, cleanup, terminal chronology, and failure precedence through one closure, while the request and reporter functions do not share that lifecycle state.
- Observation: `normalize-scan.ts` combines generic safe native-value readers and rule-specific evidence projection with the normalization coordinator. Evidence: envelope validation, failure precedence, exact coverage reconciliation, UUID creation, native ordering, and final collection assembly depend on explicit sequence, while the low-level readers and per-node projections are stateless.
- Observation: The first scanner-preflight packet named a nonexistent historical M1-03 plan path. Evidence: the test worker returned `UNKNOWN` before running tests; `docs/README.md` identifies `docs/plans/completed/m1-03-real-scan-and-evidence.md` as the accepted completed plan. The corrected read-only packet used that authority and produced fresh focused evidence without a write.
- Observation: TypeScript `as const` does not freeze a JavaScript array. Evidence: a process-isolated import of the accepted Green changed `scanRules` with `pop()`, causing later `initialScanContext()` and `nativeScanOptions()` calls to expose only two rules; extending `nativeBuckets` changed later result types, and extending `messageKeys` widened the normalization allowlist. This is an internal policy-integrity defect even though no current production consumer mutates the exports.

## Decision Log

- Decision: Keep admission, `readRun`, scan reservation and settlement, `stop`, listener startup/errors, and their shared state in `service.ts`.
  Rationale: These responsibilities form one concurrency and shutdown protocol. Keeping them together preserves synchronous reservation, notification-before-abort ordering, deadline write suppression, cleanup uncertainty, listener-error precedence, and stable stop-promise identity without adding a state machine, class, event bus, or dependency container.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Extract only `contracts.ts`, `input-validation.ts`, `scan-run-records.ts`, and `loopback-api.ts` under `src/server/local-service/`.
  Rationale: Each module owns one current cohesive responsibility. The boundary is small, purpose-named, dependency-free, and directly authorized by the owner.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Use the existing 69 service/entry-point cases as passing characterization and add no test for file placement.
  Rationale: The accepted observable contract already has deep coverage. A layout assertion would couple tests to private structure and would not improve behavioral confidence.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep `executeScan` and its local `track`, `bounded`, `close`, `active`, and `operation` state together in `scan-page.ts`.
  Rationale: Browser acquisition, abort, deadlines, late resource registration, ordered cleanup, terminal chronology, and cleanup truthfulness form one lifecycle. Extracting that state would add indirection and weaken failure-order reasoning.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep native envelope and option validation, error precedence, coverage reconciliation, UUID creation, native ordering, and final `Finding`/`ScannerReviewObservation` assembly together in `normalize-scan.ts`.
  Rationale: These operations define the canonical normalized collection and depend on explicit ordering. Only the safe readers and rule-specific projections are cohesive stateless extractions.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Preserve `scan-page.ts` and `normalize-scan.ts` as stable public entry points and add no barrel file.
  Rationale: Existing production and test consumers retain the same imports. The new modules are internal responsibility owners, not another public API layer.
  Date/Author: 2026-09-02 / project owner and primary coordinator.

## Outcomes & Retrospective

The local-service and scanner structural extractions and their verification barriers are complete. An owner-supplied external review found mutable exported policy tuples after the scanner's first S3 review; the bounded correction now freezes all six tuples and renewed S3 review returned PASS with no finding. `scan-page.ts` and `normalize-scan.ts` retain their ordering-sensitive coordinators, and the extracted modules retain their focused responsibilities. M1-05 remains In progress because real HTTP scanner integration and the milestone-level end-to-end browser/build checkpoint remain outstanding.

## Purpose / Big Picture

The current local service behavior is well tested, but its public contracts, input parsing, terminal-record construction, HTTP policy, and lifecycle protocol all live in one file. This slice makes the file easier to read and review while preserving every external import and runtime result. A reviewer should see a smaller `service.ts` whose remaining code is the lifecycle coordinator, four focused internal modules, and unchanged behavior across all 69 local-service cases and the complete 290-case backend/scanner regression.

The later M1-05 integration work will connect the already implemented service, scanner, persistence, and UI. This structural slice prepares that work without adding the missing route or changing a public result.

## Context and Orientation

`src/server/service.ts` is the stable public entry point. `src/server/main.ts`, `tests/local-service.test.ts`, and `tests/scan-page.test.ts` import its callable or public types. `src/server/domain/run-contract.ts` owns runtime validation. `src/server/persistence/run-repository.ts` owns aggregate create/read/finish behavior. `src/server/scan/scan-page.ts` owns prepared real scan execution but remains disconnected from the HTTP service until a later M1-05 slice.

The applicable authority boundary is the M1-05 roadmap row and its Accepted requirements: one trusted public HTTPS target, exact-three-rule complete scanning, visible failure, durable validated aggregate reads, one-operation admission, clean stop, and accessible Analyze/Results behavior. ADR-0015 owns the developer-started loopback topology, ADR-0021 owns the single-file aggregate, ADR-0018 owns the trusted-input scan boundary, and ADR-0024 owns this worker-first behavior-preserving implementation method. The fixed RD-003 evaluation boundary remains unchanged.

The baseline is the clean `codex/m1-04-target-and-results-ui` worktree at `696042e664d27de83f65a7d8a680f0388b541486`. Node 24.20.0, npm 11.19.0, TypeScript 7.0.2, and the existing package graph remain controlling. No new dependency, runtime, route, field, or stored-data shape is needed.

## Scope and Non-Goals

This structural slice includes:

- re-exporting the existing public service types from `src/server/service.ts`;
- effect-free configuration and initial-running-record validation;
- terminal-record matching, failed-record creation, and rejected scan-outcome construction;
- exact HTTP headers, route precedence, status mapping, health/read responses, and CONNECT/upgrade rejection; and
- the unchanged lifecycle coordinator in `service.ts`.

It excludes:

- an HTTP scan route or wiring `executeScan` into the service;
- UI, CSS, browser behavior, or provider changes;
- changes to public unions, error text, routes, headers, response bodies, persisted records, or method signatures;
- a lifecycle class, generic state machine, event bus, context/dependency container, shared persistence transition abstraction, generic HTTP framework, barrel file, or compatibility wrapper;
- test changes unless read-only preflight discovers a real uncovered observable behavior and the coordinator reconciles the slice before any write; and
- M1-05 completion, M2 work, commit, or push.

## Plan of Work

### M105-LOCAL-SERVICE-MODULE-REFACTOR-01 — conservative service extraction

The observable contract is exact behavior preservation. `startLocalService` and every existing type remain importable from `src/server/service.ts`. Configuration and malformed scan input remain effect free. A scan reserves admission before collaborator execution. Reads remain synchronous owners of the single-operation boundary. `whenStopping` resolves before abort, repeated `stop()` calls retain one promise, deadline expiry suppresses late writes, cleanup uncertainty closes admission, runtime listener errors retain precedence, and terminal results cannot mutate immutable run context. HTTP headers, routes, response bodies, status codes, CONNECT rejection, and upgrade rejection remain byte-for-byte equivalent at the JSON value boundary.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/local-service.test.ts

Expected result: 69 passing cases, zero failures, skips, todos, or cancellations, with owned test resources cleaned up. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/service.ts`
- `src/server/local-service/contracts.ts`
- `src/server/local-service/input-validation.ts`
- `src/server/local-service/scan-run-records.ts`
- `src/server/local-service/loopback-api.ts`

The accepted test file and all other source, documentation, dependency, fixture, executable configuration, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. Two identical decisive failures, two no-diff handoffs, an unexpected path, a test change, an API difference, or a need to split lifecycle state stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/service.ts` | Stable public entry point; repository opening; admission, reads, scan execution, stop, deadlines, cleanup uncertainty, listener startup/error handling, and shared state | Retained lifecycle coordinator. Imports focused stateless helpers and re-exports contracts. |
| `src/server/local-service/contracts.ts` | Existing public result unions and service/options interfaces | Bounded creation. Type-only dependencies point to domain and persistence contracts; `service.ts` re-exports it. |
| `src/server/local-service/input-validation.ts` | Safe own-data inspection, normalized service configuration, and validated initial running-record preparation | Local extraction. May depend on domain validation and contract input types; causes no storage or network effect. |
| `src/server/local-service/scan-run-records.ts` | Terminal-result identity matching, immutable context checks, authored failed records, and rejected scan outcomes | Local extraction. Depends on domain/persistence contracts and service result types; owns no lifecycle state. |
| `src/server/local-service/loopback-api.ts` | Default-`node:http` request listener, headers, route precedence, health/read status mapping, CONNECT and upgrade rejection | Local extraction. Receives narrow callbacks for stopping, busy, and reads; owns no repository or lifecycle transition. |

Permitted local structural refactor is limited to function moves, imports/exports, and the smallest callback interface needed by `loopback-api.ts`. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because concurrency, shutdown, cleanup, persistence ordering, and listener-error semantics are critical even though the intended change is structural. A fresh `critical_reviewer` must inspect the actual diff, dependency direction, public API, default HTTP import, and decisive validation evidence.

The complete backend/scanner command is:

    node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts

Expected result: 290 passing cases. Strict typechecking uses `node node_modules/typescript/bin/tsc --project tsconfig.json`. Syntax verification uses `node --check` on `service.ts` and every `.ts` file in `src/server/local-service/`. The later M1-05 integration checkpoint, after HTTP scan wiring exists, must also run the complete 30-case browser suite and the native Vite production build; those results are not evidence for this structural slice or M1-05 completion.

### M105-SCANNER-MODULE-REFACTOR-02 — scanner composition extraction

The observable contract is exact behavior preservation. `prepareScanRequest`, `captureNativeScan`, and `executeScan` remain importable from `src/server/scan/scan-page.ts`; `NormalizationResult` and `normalizeNativeScan` remain importable from `src/server/scan/normalize-scan.ts`. Canonical HTTPS and generation-mode validation, validation and failure precedence, exact rules and native bucket order, provider context, report metadata, evidence minimization, UUID creation, timeouts, browser options, response records, and cleanup results remain unchanged.

`executeScan` retains browser lifecycle, scratch admission, report-metadata acceptance, operation deadline, abort handling, late resource registration, ordered cleanup, terminal chronology, and completed/failed result construction. Its local `track`, `bounded`, `close`, `active`, and `operation` state must not move. `normalizeNativeScan` retains native envelope and option validation, error precedence, exact coverage reconciliation, UUID creation, native ordering, and final `Finding`/`ScannerReviewObservation` assembly.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts

Run it with `PLAYWRIGHT_BROWSERS_PATH` set to the retained `m104-browser-runtime/browsers` directory, `PLAYWRIGHT_SKIP_BROWSER_GC=1`, `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=30000`, `TEMP` and `TMP` set to the repository-owned empty `temp/m103-scan` directory, and `NODE_DISABLE_COMPILE_CACHE=1`. Expected result: 88 passing cases—20 normalization and 68 scan execution—with zero failures, cancellations, skips, or todos and empty post-run scratch. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/scan/scan-page.ts`
- `src/server/scan/scan-profile.ts`
- `src/server/scan/scan-request.ts`
- `src/server/scan/native-scan-capture.ts`
- `src/server/scan/normalize-scan.ts`
- `src/server/scan/normalization/native-value-reader.ts`
- `src/server/scan/normalization/native-rule-evidence.ts`

The accepted tests and all other source, documentation, dependency, fixture, executable configuration, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. Two identical decisive failures, two no-diff handoffs, an unexpected path, a test change, an API difference, reporter serialization that depends on a Node closure, or movement of lifecycle state stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/scan/scan-profile.ts` | Exact rule and native-bucket order, scanner/reporter identifiers, fresh initial scan context, and fresh axe options | Bounded stateless extraction. Exposes fresh values to request, capture, and normalization owners without lifecycle state. |
| `src/server/scan/scan-request.ts` | Canonical public-HTTPS URL validation, generation-mode validation, provider-context preparation, and `prepareScanRequest` | Focused preparation boundary. Depends on domain contracts and scan profile; causes no browser, storage, or network effect. |
| `src/server/scan/native-scan-capture.ts` | `registerReporter` and `captureNativeScan` | Focused capture boundary. All reporter helpers remain nested in `registerReporter` so serialization into the analyzed document has no Node closure. |
| `src/server/scan/normalization/native-value-reader.ts` | Safe unknown-value inspection, exact own-property reading, dense arrays, categorical values, and available/unavailable fact construction | Low-level stateless normalization dependency. Owns no rule policy, ordering, UUID, or final collection state. |
| `src/server/scan/normalization/native-rule-evidence.ts` | Locator, native check-group, image, label, contrast, incomplete-reason, and per-node evidence projection | Rule-specific projection. Depends only on domain evidence shapes and native-value readers; owns no collection ordering or identifiers. |
| `src/server/scan/normalize-scan.ts` | Stable normalization entry point; envelope/options validation, failure precedence, coverage reconciliation, UUID creation, native ordering, and final collection assembly | Retained normalization coordinator. Imports profile, readers, and rule projections. |
| `src/server/scan/scan-page.ts` | Stable scan entry point and re-export boundary; complete `executeScan` browser/deadline/abort/cleanup lifecycle | Retained lifecycle coordinator. Imports focused preparation, profile, capture, and normalization functions. |

Permitted local structural refactor is limited to declaration moves, intention-revealing internal exports, imports/re-exports, and the smallest type movement needed by those exact responsibilities. Do not add a lifecycle class, generic parser, adapter, dependency container, barrel file, dependency, or public helper. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because native evidence privacy, browser cancellation, late acquisition, cleanup truthfulness, and terminal precedence are critical even though the intended change is structural. A fresh `critical_reviewer` must inspect reporter serialization self-containment, exact native evidence projection and minimization, validation precedence, browser lifecycle placement, late settlement, cleanup/failure truthfulness, public compatibility, dependency direction, and decisive validation evidence.

Post-Green validation includes the complete normalization suite, complete scan-page suite under the stated M1-03 environment, strict TypeScript checking, and `node --check` for all seven resulting scan modules. The complete backend/scanner command remains:

    node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts

Expected result: 290 passing cases. Verification must also show empty scanner scratch, unchanged retained downloads, absent generated client output, unchanged fixtures, manifests, dependencies, and executable configuration, and stable public imports. Browser UI and production-build verification remain deferred to the real HTTP integration checkpoint because this slice changes no UI or HTTP integration behavior.

## Concrete Steps

Work from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`.

The first eight steps below are complete for the local-service slice. Repeat the same barriers for the scanner slice with its distinct identities and scope.

1. Confirm the task is In progress, the worktree/index baseline, no active lease, and the exact allowed Green paths.
2. Send Milestone Assignment Packet v2 for read-only preflight to one persistent `test_worker`.
3. If preflight returns `EXISTING_AND_COVERED`, record the focused evidence and add no test. Any other classification stops for coordinator reconciliation.
4. Start a Green lease for the allowed production paths, insert its digest into the packet, and assign one `code_worker` to perform the extraction and focused validation without touching tests.
5. Terminally close the lease. Inspect the actual diff, exports, import graph, lifecycle placement, and focused result before accepting Green.
6. Run strict typechecking, syntax checks, and the complete 290-case backend/scanner regression under the required scanner environment.
7. Obtain fresh S3 critical review. Any finding routes through the one bounded correction allowance only when the contract remains unchanged.
8. Update this plan and the M1-05 progress record with accepted evidence and documentation impact. Keep M1-05 In progress for its later integration slices.

## Validation and Acceptance

Accept the slice only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and the exact 69 cases pass;
- `src/server/service.ts` still exports `startLocalService`, `ReadResult`, `ScanOutcome`, `StopResult`, `LocalService`, `StartResult`, and `ServiceOptions` with unchanged signatures and discriminants;
- malformed configuration and malformed scan input cause no storage or network effects;
- all ordering-sensitive behaviors listed in the slice contract remain covered and passing;
- only the five allowed production paths change;
- strict TypeScript, every extracted-module syntax check, and all 290 backend/scanner cases pass;
- the implementation worker reports cohesion `REFACTORED`, primary inspection accepts it, and fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves public behavior, and does not complete M1-05.

Tests, fixtures, mocks, helpers, skipped tests, and focused markers receive a relevance audit at the slice barrier. The expected outcome is no change: the 69-case service suite remains behavioral, all collaborator fakes still exercise public seams, and there are no layout assertions, snapshots, skipped cases, or focused-only markers to add or remove.

Accept `M105-SCANNER-MODULE-REFACTOR-02` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and the exact 88 scanner cases pass under the required M1-03 environment;
- `scan-page.ts` still exports `prepareScanRequest`, `captureNativeScan`, and `executeScan`, while `normalize-scan.ts` still exports `NormalizationResult` and `normalizeNativeScan`;
- native rules, buckets, validation and failure precedence, evidence minimization, UUID and item ordering, browser options, timeouts, terminal results, late acquisition, cleanup, and failure truthfulness are behaviorally unchanged;
- reporter helpers remain inside the serialized reporter and every named lifecycle local remains inside `executeScan`;
- only the seven allowed production paths change;
- strict TypeScript, every resulting-module syntax check, all 88 scanner cases, and all 290 backend/scanner cases pass;
- scanner scratch is empty, downloads and generated output are unchanged or absent as required, and fixtures, manifests, dependencies, and executable configuration are unchanged;
- the implementation worker reports cohesion `REFACTORED`, primary inspection accepts it, and fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves public behavior, does not reopen M1-03, and does not complete M1-05.

The scanner tests receive the same relevance audit. The expected outcome is no change: the 20 normalization cases and 68 scan-execution cases remain the behavior boundary, with no file-layout assertions, implementation snapshots, skipped cases, or focused-only markers added.

## Idempotence and Recovery

Read-only inspection and verification commands are safe to repeat after confirming no owned processes or test residue remain. The extraction is additive except for moved declarations inside `service.ts`; a stopped worker must not be reset or reverted automatically. Close the lease, inspect the actual five-path state, preserve unrelated work, and issue at most one fresh attempt-2 packet with the same scope and terminal attempt-1 parent when the correction remains inside the frozen contract.

An unexpected file, changed test, Git mutation, public API drift, behavior difference, active-resource leak, or need for shared lifecycle state outside `service.ts` freezes writes. The primary reconciles the tree and this plan before any new assignment. No worker stages, commits, pushes, changes refs, stashes, worktrees, remotes, repository configuration, or hooks.

## Artifacts and Notes

Retain in this plan only the accepted preflight identity and result, Green lease/digest/receipt, exact changed paths, focused/strict/syntax/full results, cohesion disposition, reviewer verdict, and any bounded correction lineage. Guard runtime records remain ignored workflow state and are not copied into tracked documentation.

Accepted preflight `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/local-service.test.ts` under Node 24.20.0 at HEAD `696042e664d27de83f65a7d8a680f0388b541486`: 69 passed, zero failed/cancelled/skipped/todo. Frozen source/test identities are `service.ts` `3502789d6edea78d93e2659f8731e7ff060f9c897b77bc667be45a0127a78c1f`, `local-service.test.ts` `b9aa1dc1fb6ec5c9dba3e5937de761eb91edeb913cdc93a5989e934ef79aab89`, `main.ts` `854b90af5dd4f94c0144ab8a96369f28f360aa48661c5be044b831b13782ee39`, and `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`. No file changed and no test resource remained.

Accepted Green/Refactor assignment `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-01` used lease `M1-05-20260902-01-service-refactor-green-01`, guard digest `9efe09e53ddad00e848930856bcd30e5efff3b38c41a7cccb2d4c6bea3d517d8`, and compliant close receipt `d2f2a365f842d6c609ad961267342bdc96010791e98bb5732d7df8731a638d25`. It changed only `src/server/service.ts` and created `src/server/local-service/contracts.ts`, `input-validation.ts`, `scan-run-records.ts`, and `loopback-api.ts`. The implementation worker reported cohesion `REFACTORED`, and primary inspection accepted the responsibility placement, stable exports, default `node:http` seam, and retained lifecycle state. Current production identities are `service.ts` `a4fd340de25670c9f76042a66100c999e0eea0702d71dcfa9b712782619e66b2`, `contracts.ts` `543a5ed78f99f05bb74f40bdf8d2d9b600742bf0d6a4fea6d35da67555203139`, `input-validation.ts` `dce646e7c3796b7dade9422688373b7acda32c6d06e805966b5c810e20312273`, `scan-run-records.ts` `27b9f7df773202a4e6be52ce771114169ed127399a649bb0a20c620f630111f2`, and `loopback-api.ts` `f9df82120e09eb81a3c3fb64c72f1d33907d182cbd107a10a6b5d2bc836e0f13`.

Post-Green validation passed the unchanged 69-case local-service command, strict TypeScript checking, and `node --check` for all five production modules. The complete backend/scanner command passed 290 of 290 cases with zero failure, cancellation, skip, or todo after applying the required M1-03 environment: retained `m104-browser-runtime/browsers`, `PLAYWRIGHT_SKIP_BROWSER_GC=1`, `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=30000`, repository-owned `TEMP` and `TMP`, and `NODE_DISABLE_COMPILE_CACHE=1`. The scanner scratch directory contained zero entries after the run. An earlier full-suite invocation omitted `TEMP` and `TMP`; its temporary-directory assertion failures were rejected as invalid environment evidence and were not attributed to the implementation.

Fresh S3 review found no production defect and accepted cohesion as `REFACTORED`. Its sole Minor finding identified stale M1-04 status text in `docs/ui/README.md` and `docs/ui/ANALYZE_AND_RESULTS_PRESENTATION.md`. The primary corrected only those authority-owned status lines, and the bounded correction review returned PASS with no Blocker, Major, or Minor finding. Exact cleanup removed the verified ordinary empty `temp/m103-scan` directory; `dist/client` and `.vite-temp` are absent, the retained pinned browser runtime is unchanged, and the Git index is empty. Changed-document file-link validation passed for 14 documents, `git diff --check` passed, and no current document reports M1-04 implementation as still in progress. No architecture, product behavior, dependency, public API, test, or executable configuration changed, so no ADR or further product-authority update is required. M1-05 remains In progress.

Owner-supplied external review later reported one P3 dependency-clarity finding: the lifecycle coordinator retained a runtime default `node:http` import solely for its `http.Server` annotation. Same-contract correction `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-02` used attempt-2 lease `M1-05-20260902-01-service-refactor-green-02`, parent `M1-05-20260902-01-service-refactor-green-01`, guard digest `9c49fbfc40e7ad1958f27eb6a6dc5431941118b8b5576d5e327149f31b1d86ed`, and compliant receipt `78741912904518259422b69258ee2dfd4f03dcc0beabd96b0d19b73daef84e5d`. Only `src/server/service.ts` changed: it now imports the `Server` type and declares `let server: Server`, leaving `loopback-api.ts` as the sole runtime owner of the default HTTP object. The corrected `service.ts` identity is `48f2fa46433fc7b529f9b27ab30216660143d5d923846032991ed8fa1cb3f604`; the other four production identities and all accepted tests remain unchanged. Focused service validation passed 69/69, strict TypeScript and all five syntax checks passed, the complete backend/scanner regression passed 290/290 under the required M1-03 environment, and exact cleanup removed the empty scanner scratch. Bounded correction review returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`.

Accepted scanner preflight `M105-SCANNER-MODULE-REFACTOR-02-PREFLIGHT-01R` ran `node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts` under the exact retained-browser and repository-owned scratch environment at the current production/test baseline. It passed all 88 leaf cases—20 normalization and 68 scan execution—with 108 TAP tests including parent groups, zero failures, cancellations, skips, or todos, and 21.676 seconds TAP duration. Scratch contained zero entries before and after; production and test hashes remained `scan-page.ts` `fcd9cbb6e2f632c70a717155ae172ce210ce757ccb24f1d53071f21e05585b33`, `normalize-scan.ts` `8dbb14cbc42845e27ef2193b274fe21da31261e5df0c6edcfbd1e4a84bac9d05`, `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`, and `scan-normalization.test.ts` `c7712f21238949c3873e399c0d380cfe37e25ab5ec98ad5e37ed5010cd4a994e`. The earlier `PREFLIGHT-01` returned `UNKNOWN` without execution because the coordinator supplied a nonexistent historical plan filename; the corrected packet used `docs/plans/completed/m1-03-real-scan-and-evidence.md`. No test write or artificial Red is needed.

Accepted Green/Refactor assignment `M105-SCANNER-MODULE-REFACTOR-02-GREEN-01` used lease `M1-05-20260902-02-scanner-refactor-green-01`, guard digest `d348dbb9c756c270bd0b65b45ec4080a564c5d9e4c0c1486040ad1b81b67496a`, and fresh compliant receipt `b9b0b3b32c810ce06519ee25955866ba35020ee16899823ea5cc6ea4291b509c`. It modified only `scan-page.ts` and `normalize-scan.ts` and created the five approved focused modules; no forbidden, unleased, index, HEAD, branch, or ignore-control drift occurred. The worker and primary accepted cohesion as `REFACTORED`: `executeScan` retains `track`, `bounded`, `close`, `active`, `operation`, browser/deadline/abort/cleanup state and terminal construction; `normalizeNativeScan` retains envelope/options validation, failure precedence, coverage, UUIDs, native order and final assembly. `scan-page.ts` preserves its three public imports through direct re-exports, `normalize-scan.ts` preserves both public exports, and the serialized reporter receives only JSON-literal profile arguments while keeping every helper nested.

Post-Refactor focused verification passed all 88 leaf scanner cases with 108 TAP tests including parents, zero failures/cancellations/skips/todos, and 21.022 seconds duration. Independent primary verification passed the complete 290-case backend/scanner regression in 20.643 seconds, strict TypeScript, and `node --check` for all seven modules. Current production identities are `scan-page.ts` `6b119170612b3a8b90b941f3cd34fb1feb0b6480421043ab02adc873031001be`, `scan-profile.ts` `f089ef8db27a770c265d87b63a4c5af633ac24976f2eaa48e946c69b09edff91`, `scan-request.ts` `56652dd47dd8883fa1810c027a45dc39958c67c7377475326b1eba82e589580a`, `native-scan-capture.ts` `c466f0174c3bd03421b2b0f2515bf15653788c200e00195de2cfe36c8dca6ae1`, `normalize-scan.ts` `af6aabd4c008711e68d4bc06e5b865babe0a0268d999f63bfdeffdc135f005d3`, `native-value-reader.ts` `00affae65054866812719832ae6ec34ea6ae027495a1df41babd883bb7cbfcc7`, and `native-rule-evidence.ts` `2d30bef5d9b117296d8900f44571d84b4cbe14b5074ebeb30cbefb2415dcb3d7`. Accepted test, package, lockfile, and TypeScript-config hashes remain unchanged. Scanner scratch is empty, the retained browser runtime still has 331 descendants, and `dist/client` and `.vite-temp` are absent. The accepted S3 review and closure are recorded below.

Fresh S3 review `M105-SCANNER-MODULE-REFACTOR-02-S3-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and independently accepted cohesion as `REFACTORED`. It reproduced exact production/test/config identities, strict TypeScript, seven syntax checks, diff validation, public import and factory-freshness checks, dependency-cycle analysis, isolated `registerReporter.toString()` execution without Node globals, and the pure 20-case normalizer suite. It reused the exact-identity fresh browser and complete-regression evidence because browser execution writes controlled scratch and conflicted with its read-only boundary. The reviewer confirmed all nine critical checks: authorized moves, self-contained reporter serialization, native-value privacy, rule evidence, normalization precedence, browser lifecycle, public imports/dependencies, behavioral tests, and status honesty. Exact cleanup removed the verified ordinary empty scanner scratch; the retained runtime remains unchanged and generated client output remains absent. Final documentation validation passes 529 relative links and 116 Markdown fragments across ten changed documents, UTF-8/final-newline/trailing-whitespace checks, current-status reconciliation, and `git diff --check`. A first naive link diagnostic counted fenced template placeholders as links; its two false positives were rejected, and the corrected fence-aware validator passed. No requirement, ADR, product, API, dependency, M1-03, fixture, or executable-configuration change is needed. M1-05 remains In progress.

Owner-supplied external review later returned one P2 correction for runtime-mutable exported policy arrays. Primary reproduced it without a repository write: `scanRules.pop()` changed later contexts and native options from three rules to two, `nativeBuckets.push()` changed later result types, and `messageKeys.push()` expanded the evidence allowlist. The prior scanner S3 PASS remains valid for the lifecycle, normalization, serialization, dependency, and cohesion dimensions it inspected but is superseded as final slice acceptance until this integrity correction receives new evidence and review. The smallest correction freezes `scanRules`, `nativeBuckets`, `ordinaryReasons`, `attributeStates`, `inputTypes`, and `messageKeys` at construction. A new tracked layout test is not justified: these are scan-feature-internal exports and the accepted tests should remain coupled to stable behavior rather than private file placement. The correction instead requires an isolated direct mutation-resistance probe, unchanged focused and complete regressions, strict typechecking, syntax checks, exact cleanup, and fresh S3 review.

Correction assignment `M105-SCANNER-MODULE-REFACTOR-02-GREEN-02` used attempt-2 lease `M1-05-20260902-02-scanner-refactor-green-02`, parent `M1-05-20260902-02-scanner-refactor-green-01`, guard digest `6d18592be5f4906f9e0f4f462c36cc5e13cefb4d6cdf6ab386e12982e591a76b`, and fresh compliant receipt `b1a69ec6f8820f6cc8b3e1a064899ba9ae073c62aeb80b89fd9ccf3d70867519`. It changed only `scan-profile.ts` and `native-value-reader.ts`, wrapping the six existing tuples with `Object.freeze()` without changing a literal, order, consumer, or type. A process-isolated probe confirmed all six values are frozen, generic array mutation fails without state change, and fresh scan contexts/options still expose the exact three rules and four buckets. The unchanged focused scanner boundary passed all 88 leaf cases with 108 TAP tests in 20.507 seconds, the complete backend/scanner regression passed 290/290 in 20.612 seconds, strict TypeScript and all seven syntax checks passed, and scanner scratch remained empty. Test identities remain `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84` and `scan-normalization.test.ts` `c7712f21238949c3873e399c0d380cfe37e25ab5ec98ad5e37ed5010cd4a994e`. Corrected production identities are `scan-profile.ts` `acd6db3b14c616411d5a55c5d9dd2f2d7df3387d6d62502e4ac9bf3c55953d69` and `native-value-reader.ts` `af735b3dcbc6960ddb82ddd5a4e4879eda9bd57a96404cb248d21b1f5ebb7c36`; the other five production identities remain exact. The renewed S3 review result is recorded below.

Renewed review `M105-SCANNER-MODULE-REFACTOR-02-S3-REVIEW-02` returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`. It independently verified frozen descriptors and rejection of generic `push`, `pop`, `splice`, `fill`, and `reverse` calls for all six tuples, exact values and readonly tuple inference, detached factory results after hostile mutation attempts, and end-to-end withholding of an injected unknown native message key. It also confirmed unchanged hashes for the five untouched scanner modules and both tests, stable public exports, strict TypeScript, seven syntax checks, the pure 20-case normalization suite, compliant lease scope, and documentation truthfulness. The earlier scanner S3 review remains historical evidence for the original extraction and is superseded by this renewed review as the final correction acceptance. No requirement, ADR, product, public contract, dependency, or M1-03 authority changed. M1-05 remains In progress for HTTP integration and its browser/build checkpoint.

## Interfaces and Dependencies

The completed slice preserves the public `src/server/service.ts` import boundary. `contracts.ts` contains types only. `input-validation.ts` depends on domain validation and Node UUID generation only as needed to prepare a running record. `scan-run-records.ts` depends on domain validation, deep equality, and persistence record types. `loopback-api.ts` depends on the default `node:http` object and narrow lifecycle/read callbacks. `service.ts` depends on those internal modules plus the existing repository. No new package, route, environment variable, stored field, build setting, browser runtime, or external service is introduced.

## Revision Note

2026-09-02: Created the M1-05 ExecPlan after the owner explicitly selected the task and its first structural slice. Recorded completed dependencies, the conservative module boundary, existing characterization route, S3 risk, guarded worker ownership, exact verification commands, and the later integration work that remains before task completion.

2026-09-02: Accepted the independent `EXISTING_AND_COVERED` preflight and exact 69-case characterization identity. No test write or artificial Red is needed; the separate five-path Green/Refactor lease is next.

2026-09-02: Accepted the compliant five-path Green/Refactor and focused, strict, syntax, and corrected complete-regression evidence. Recorded the invalid initial full-suite environment and its successful corrected rerun. Fresh S3 review is next.

2026-09-02: Closed the first M1-05 structural slice after fresh S3 PASS, exact scanner-scratch cleanup, stale M1-04 UI-status correction, link and formatting validation, and documentation closure. M1-05 remains In progress for HTTP scan integration and its later browser/build checkpoint.

2026-09-02: Reopened the structural slice for one owner-supplied P3 dependency-clarity follow-up. The same observable contract and test boundary remain controlling; only `service.ts` may replace the runtime default HTTP import with a type-only `Server` import before renewed verification and review.

2026-09-02: Accepted the fresh compliant attempt-2 correction lease and renewed focused, strict, syntax, complete-regression, and cleanup evidence. Only the type import and annotation changed; bounded correction review is next.

2026-09-02: Closed the owner-supplied P3 follow-up after bounded correction review returned PASS with no finding. The structural slice is accepted again; M1-05 remains In progress for HTTP scan integration and its browser/build checkpoint.

2026-09-02: Added owner-approved `M105-SCANNER-MODULE-REFACTOR-02` as the second behavior-preserving M1-05 structural slice. Recorded the seven-module responsibility boundary, stable public entry points, retained ordering-sensitive coordinators, existing 88-case characterization route, exact scanner environment, S3 triggers, guarded ownership, verification commands, cleanup criteria, and later integration work that remains outside this slice.

2026-09-02: Accepted corrected independent scanner preflight as `EXISTING_AND_COVERED` after the first packet safely stopped on an obsolete authority filename before test execution. The exact 88 leaf cases pass under the required environment with unchanged production/tests and empty scratch; no test write is needed, and the guarded seven-path Green/Refactor is next.

2026-09-02: Accepted the fresh compliant seven-path Green/Refactor lease and independent focused, strict, syntax, complete-regression, identity, and cleanup evidence. The public entry points and both ordering-sensitive coordinators remain stable; five focused stateless modules now own the approved responsibilities. Fresh S3 review is next.

2026-09-02: Closed the scanner structural slice after fresh S3 PASS with no finding, exact scratch cleanup, status/navigation reconciliation, link and formatting validation, and documentation closure. Both M1-05 structural refactors are accepted; M1-05 remains In progress for real HTTP scan integration and its browser/build checkpoint.

2026-09-02: Reopened the scanner slice for the owner-supplied P2 policy-integrity finding. A direct runtime probe reproduced mutation of exported rules, buckets, and message keys; the previous scanner S3 PASS is superseded as final acceptance. The same public behavior, seven-path scope, test boundary, and attempt-2 Green lineage remain controlling.

2026-09-02: Accepted the fresh compliant attempt-2 policy-integrity correction and renewed mutation, focused, complete-regression, strict, syntax, identity, and scratch evidence. Only the six policy tuple constructions changed; renewed S3 review is next.

2026-09-02: Closed the scanner policy-integrity follow-up after renewed S3 review returned PASS with no finding, independently confirmed unknown-key withholding, and accepted cohesion as `REFACTORED`. The scanner structural slice is accepted again; M1-05 remains In progress for HTTP scan integration and its browser/build checkpoint.
