# Integrate and verify the walking skeleton (M1-05)

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-05 — Integrate and verify the walking skeleton](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton). The owner explicitly selected M1-05 and approved the first structural slice described below. That slice preserves the existing loopback-service behavior while giving its stateless responsibilities focused modules. It does not yet connect the HTTP Analyze path to the real scanner, complete the milestone integration checkpoint, authorize M2 work, or authorize a commit or push.

## Progress

- [x] (2026-09-02) Confirmed M1-02, M1-03, and M1-04 are Complete and reconciled M1-04's final umbrella closure from its accepted verification, review, cleanup, and documentation evidence.
- [x] (2026-09-02) Received explicit owner selection of M1-05 and approval of `M105-LOCAL-SERVICE-MODULE-REFACTOR-01` with the named module boundary and behavior-preserving constraints.
- [x] (2026-09-02) Completed R0 repository-local responsibility and consumer analysis. The existing 69-case local-service suite is the proposed passing characterization boundary; no significant architecture decision or new dependency is required.
- [x] (2026-09-02) Accepted read-only test-worker preflight as `EXISTING_AND_COVERED`: all 69 local-service and entry-point cases passed with zero failure, cancellation, skip, or todo and no repository residue.
- [x] (2026-09-02) Extracted the four focused modules under a separate guarded `code_worker` Green/Refactor lease while preserving `service.ts` as the stable public entry point and lifecycle coordinator. The lease closed compliant with exactly the five allowed production paths.
- [x] (2026-09-02) Passed focused, strict, syntax, and complete 290-case backend/scanner verification; received fresh S3 PASS after one documentation-only correction; removed the empty scanner scratch; and completed the structural slice's documentation barrier.
- [ ] Implement the separately planned HTTP scan integration and complete M1-05's browser/build integration checkpoint before task closure.

## Surprises & Discoveries

- Observation: `service.ts` combines stateless validation and transport policy with one ordering-sensitive lifecycle protocol. Evidence: `src/server/service.ts` keeps admission, synchronous read ownership, active operation reservation, stop notification, abort, deadline, cleanup uncertainty, listener close, and stop settlement in one closure. Splitting those state transitions would require a shared mutable abstraction and would weaken local reasoning.
- Observation: Existing interception tests replace methods on the default `node:http` object. Evidence: `tests/local-service.test.ts` patches `http.createServer`; the extracted HTTP module must continue importing and using that default object.
- Observation: The local-service suite already characterizes the public API and the critical ordering paths in 69 cases. Evidence: `tests/local-service.test.ts`; the approved change is structural and does not justify file-layout assertions or implementation-shaped tests.
- Observation: The complete scanner regression depends on the M1-03 process environment, including repository-owned `TEMP` and `TMP`. Evidence: an initial invocation without that environment failed only the scan-page temporary-directory assertions; the corrected invocation with the pinned browser path and all required variables passed all 290 cases and left the scratch directory empty.

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

## Outcomes & Retrospective

The behavior-preserving extraction and its verification barrier are complete. `service.ts` remains the stable public entry point and keeps the complete ordering-sensitive lifecycle; four focused internal modules now own public contracts, effect-free input preparation, terminal run-record construction, and loopback HTTP policy. The focused 69-case suite, strict TypeScript check, five syntax checks, and corrected complete 290-case backend/scanner regression pass. Fresh S3 review passed after correction of two stale M1-04 UI-document status lines, changed-document links and formatting pass, and the empty scanner scratch was removed. M1-05 remains In progress because real HTTP scanner integration and the milestone-level end-to-end checkpoint remain outstanding.

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

## Concrete Steps

Work from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`.

1. Confirm the task is In progress, the worktree/index baseline, no active lease, and the exact five-path Green scope.
2. Send Milestone Assignment Packet v2 for read-only preflight to one persistent `test_worker`.
3. If preflight returns `EXISTING_AND_COVERED`, record the 69-case evidence and add no test. Any other classification stops for coordinator reconciliation.
4. Start a Green lease for the five production paths, insert its digest into the packet, and assign one `code_worker` to perform the extraction and focused validation without touching tests.
5. Terminally close the lease. Inspect the actual diff, exports, import graph, lifecycle placement, and focused result before accepting Green.
6. Run strict typechecking, syntax checks, and the complete 290-case backend/scanner regression.
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

## Idempotence and Recovery

Read-only inspection and verification commands are safe to repeat after confirming no owned processes or test residue remain. The extraction is additive except for moved declarations inside `service.ts`; a stopped worker must not be reset or reverted automatically. Close the lease, inspect the actual five-path state, preserve unrelated work, and issue at most one fresh attempt-2 packet with the same scope and terminal attempt-1 parent when the correction remains inside the frozen contract.

An unexpected file, changed test, Git mutation, public API drift, behavior difference, active-resource leak, or need for shared lifecycle state outside `service.ts` freezes writes. The primary reconciles the tree and this plan before any new assignment. No worker stages, commits, pushes, changes refs, stashes, worktrees, remotes, repository configuration, or hooks.

## Artifacts and Notes

Retain in this plan only the accepted preflight identity and result, Green lease/digest/receipt, exact changed paths, focused/strict/syntax/full results, cohesion disposition, reviewer verdict, and any bounded correction lineage. Guard runtime records remain ignored workflow state and are not copied into tracked documentation.

Accepted preflight `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/local-service.test.ts` under Node 24.20.0 at HEAD `696042e664d27de83f65a7d8a680f0388b541486`: 69 passed, zero failed/cancelled/skipped/todo. Frozen source/test identities are `service.ts` `3502789d6edea78d93e2659f8731e7ff060f9c897b77bc667be45a0127a78c1f`, `local-service.test.ts` `b9aa1dc1fb6ec5c9dba3e5937de761eb91edeb913cdc93a5989e934ef79aab89`, `main.ts` `854b90af5dd4f94c0144ab8a96369f28f360aa48661c5be044b831b13782ee39`, and `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`. No file changed and no test resource remained.

Accepted Green/Refactor assignment `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-01` used lease `M1-05-20260902-01-service-refactor-green-01`, guard digest `9efe09e53ddad00e848930856bcd30e5efff3b38c41a7cccb2d4c6bea3d517d8`, and compliant close receipt `d2f2a365f842d6c609ad961267342bdc96010791e98bb5732d7df8731a638d25`. It changed only `src/server/service.ts` and created `src/server/local-service/contracts.ts`, `input-validation.ts`, `scan-run-records.ts`, and `loopback-api.ts`. The implementation worker reported cohesion `REFACTORED`, and primary inspection accepted the responsibility placement, stable exports, default `node:http` seam, and retained lifecycle state. Current production identities are `service.ts` `a4fd340de25670c9f76042a66100c999e0eea0702d71dcfa9b712782619e66b2`, `contracts.ts` `543a5ed78f99f05bb74f40bdf8d2d9b600742bf0d6a4fea6d35da67555203139`, `input-validation.ts` `dce646e7c3796b7dade9422688373b7acda32c6d06e805966b5c810e20312273`, `scan-run-records.ts` `27b9f7df773202a4e6be52ce771114169ed127399a649bb0a20c620f630111f2`, and `loopback-api.ts` `f9df82120e09eb81a3c3fb64c72f1d33907d182cbd107a10a6b5d2bc836e0f13`.

Post-Green validation passed the unchanged 69-case local-service command, strict TypeScript checking, and `node --check` for all five production modules. The complete backend/scanner command passed 290 of 290 cases with zero failure, cancellation, skip, or todo after applying the required M1-03 environment: retained `m104-browser-runtime/browsers`, `PLAYWRIGHT_SKIP_BROWSER_GC=1`, `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=30000`, repository-owned `TEMP` and `TMP`, and `NODE_DISABLE_COMPILE_CACHE=1`. The scanner scratch directory contained zero entries after the run. An earlier full-suite invocation omitted `TEMP` and `TMP`; its temporary-directory assertion failures were rejected as invalid environment evidence and were not attributed to the implementation.

Fresh S3 review found no production defect and accepted cohesion as `REFACTORED`. Its sole Minor finding identified stale M1-04 status text in `docs/ui/README.md` and `docs/ui/ANALYZE_AND_RESULTS_PRESENTATION.md`. The primary corrected only those authority-owned status lines, and the bounded correction review returned PASS with no Blocker, Major, or Minor finding. Exact cleanup removed the verified ordinary empty `temp/m103-scan` directory; `dist/client` and `.vite-temp` are absent, the retained pinned browser runtime is unchanged, and the Git index is empty. Changed-document file-link validation passed for 14 documents, `git diff --check` passed, and no current document reports M1-04 implementation as still in progress. No architecture, product behavior, dependency, public API, test, or executable configuration changed, so no ADR or further product-authority update is required. M1-05 remains In progress.

## Interfaces and Dependencies

The completed slice preserves the public `src/server/service.ts` import boundary. `contracts.ts` contains types only. `input-validation.ts` depends on domain validation and Node UUID generation only as needed to prepare a running record. `scan-run-records.ts` depends on domain validation, deep equality, and persistence record types. `loopback-api.ts` depends on the default `node:http` object and narrow lifecycle/read callbacks. `service.ts` depends on those internal modules plus the existing repository. No new package, route, environment variable, stored field, build setting, browser runtime, or external service is introduced.

## Revision Note

2026-09-02: Created the M1-05 ExecPlan after the owner explicitly selected the task and its first structural slice. Recorded completed dependencies, the conservative module boundary, existing characterization route, S3 risk, guarded worker ownership, exact verification commands, and the later integration work that remains before task completion.

2026-09-02: Accepted the independent `EXISTING_AND_COVERED` preflight and exact 69-case characterization identity. No test write or artificial Red is needed; the separate five-path Green/Refactor lease is next.

2026-09-02: Accepted the compliant five-path Green/Refactor and focused, strict, syntax, and corrected complete-regression evidence. Recorded the invalid initial full-suite environment and its successful corrected rerun. Fresh S3 review is next.

2026-09-02: Closed the first M1-05 structural slice after fresh S3 PASS, exact scanner-scratch cleanup, stale M1-04 UI-status correction, link and formatting validation, and documentation closure. M1-05 remains In progress for HTTP scan integration and its later browser/build checkpoint.
