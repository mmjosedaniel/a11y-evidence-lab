# Integrate and verify the walking skeleton (M1-05)

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-05 — Integrate and verify the walking skeleton](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton). The owner explicitly selected M1-05. Preserve the accepted history of its four behavior-preserving module refactors and bounded App dead-state cleanup below. The remaining work is one coherent HTTP/browser integration slice that joins the existing UI, loopback service, real scanner, and single-file repository, followed by one owner-authorized public-page smoke and the task-closure gate. This plan does not authorize M2 work, a provider call, a hostile-target hardening subsystem, a commit, or a push.

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
- [x] (2026-09-02) Received explicit owner approval of `M105-RUN-CONTRACT-MODULE-REFACTOR-03` with the stable public façade, six focused internal modules, 30-case characterization boundary, frozen exported policy tuples, and behavior-preserving constraints.
- [x] (2026-09-02) Completed R0 source, consumer, authority, and test analysis. The 497-line contract contains six separable responsibilities, the existing 30 contract cases are the proposed passing characterization boundary, and no new dependency or significant architecture decision is required.
- [x] (2026-09-02) Accepted independent read-only `EXISTING_AND_COVERED` preflight: the 30 static contract cases execute 58 TAP tests, all passing with no failure, cancellation, skip, todo, snapshot, layout assertion, source/test change, or residue.
- [x] (2026-09-02) Completed the guarded seven-path contract Green/Refactor under a separate `code_worker` lease without changing tests. The lease closed compliant with exactly the seven authorized source paths, and both worker and primary inspection accepted cohesion as `REFACTORED`.
- [x] (2026-09-02) Passed the unchanged 58-test focused boundary, complete 290-case regression, strict TypeScript, seven syntax checks, production build, exact runtime-export check, 16-policy-tuple mutation probe, dependency inspection, protected-input identity checks, and bounded generated-output cleanup.
- [x] (2026-09-02) Accepted fresh S3 PASS with no Blocker, Major, or Minor finding. The reviewer independently validated hostile-value inspection, fixed policy, evidence privacy, validation precedence, immutable output, collection and lifecycle integrity, stable exports, exact behavior against the prior implementation, and cohesion as `REFACTORED`; completed documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Received explicit owner approval of `M105-RUN-REPOSITORY-MODULE-REFACTOR-04` with the stable public entry point, four focused internal modules, 55-case characterization boundary, and behavior-preserving persistence constraints.
- [x] (2026-09-02) Completed R0 source, consumer, authority, and test analysis. The 270-line repository contains separable contract, error, Windows path-safety, transition, and stateful publication responsibilities; the focused suite passes 55/55 and no new dependency or significant architecture decision is required.
- [x] (2026-09-02) Accepted independent read-only `EXISTING_AND_COVERED` preflight: all 55 repository cases passed with no failure, cancellation, skip, todo, source/test change, or retained test-owned residue.
- [x] (2026-09-02) Completed the guarded five-path repository Green/Refactor without changing tests. The lease closed fresh and compliant; focused 55-case, complete 290-case, strict TypeScript, five syntax, stable-export/import, identity, and cleanup checks pass.
- [x] (2026-09-02) Accepted fresh S3 PASS with no Blocker, Major, or Minor finding. The reviewer independently validated Windows path and identity protection, publication and interruption ordering, cleanup truthfulness, error precedence, stable exports, dependency direction, and cohesion as `REFACTORED`; completed documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Accepted the owner-supplied P3 cleanup-evidence correction: independently verified `node_modules/.vite-temp` as an ordinary, non-link, empty directory inside the workspace; removed only that exact directory without recursion; verified both it and repository-root `.vite-temp` are absent; and corrected the overstated earlier evidence without changing production code or tests.
- [x] (2026-09-02) Received explicit owner approval of `M105-APP-DEAD-STATE-CLEANUP-05`. Repository analysis found `App.tsx` already cohesive at its accepted orchestration boundary; the selected cleanup removes only unread `pendingAnalysis` state and its two setter calls without creating a hook, reducer, controller, component, or module.
- [x] (2026-09-02) Accepted independent read-only `EXISTING_AND_COVERED` preflight: all 30 browser cases passed under the pinned Chromium environment with exact baseline identities, no failure, skip, test change, external request, or retained test-owned residue.
- [x] (2026-09-02) Completed the guarded one-file Green, focused and complete verification, exact generated-output cleanup, and fresh S1 PASS with no finding. The production diff is exactly three deletions in `App.tsx`; public interfaces and observable behavior remain unchanged, and cohesion is accepted as `RETAINED`.
- [x] (2026-09-02) Completed the owner-requested documentation follow-up: reconciled the public overview, documentation index, roadmap, plan index, and progress index to include the accepted App cleanup, linked each applicable navigation surface to this owning slice, and confirmed that the unchanged UI contract and historical M1-04 plan need no amendment.
- [x] (2026-09-02) Reconciled the complete current task state at clean HEAD `a9ccb01f19db386e82c5a00f163c6525b66cb9c0`: all three dependencies are Complete, the five earlier M1-05 slices remain accepted, strict TypeScript passes, and the fresh browser-free contract/repository/service baseline passes 182/182.
- [x] (2026-09-02) Accepted fresh final readiness review `M105-REMAINING-WORK-PLAN-REVIEW-05` as PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `6258258BB57F571EE3AD3E2223461963D1A4251F08305E9F803C1D7C902B3797`. The reviewer independently confirmed task routing, authority coverage, worker/lease/TDD ownership, exact commands, evidence continuity through post-archive closure, capability gating, full browser-to-disk lanes, owner-gated smoke, cleanup ordering, and YAGNI/KISS scope. Planning remains R0 repository-local synthesis; no comparative decision or Decision Review Contract is triggered.
- [ ] Execute `M105-WALKING-SKELETON-INTEGRATION-06` through read-only preflight, one guarded test-owned Red, one separate guarded standard-profile Green/Refactor, complete validation, and fresh S3 review.
- [ ] Run `M105-TRUSTED-PUBLIC-SMOKE-07` only after the owner supplies one exact public HTTPS URL they are permitted and willing to trust and declares the generated smoke run disposable.
- [ ] Complete the different fresh integrated critical review, documentation closure, exact task-owned cleanup, and M1-05 roadmap/plan archival updates before marking the task Complete.

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
- Observation: `src/server/domain/run-contract.ts` has 497 lines and six ordered responsibility clusters: public/internal contract types and policy at lines 1–147, descriptor-safe unknown-value reading at 149–260, finding/evidence validation at 262–373, scan validation at 375–431, and parent-run validation at 434–497. Evidence: complete source inspection plus 30 behavior-oriented cases in `tests/run-contract.test.ts` and imports across server, scanner, persistence, and browser code.
- Observation: `src/server/persistence/run-repository.ts` has 270 lines and five responsibility clusters: public contracts, bounded store errors, Windows identifier/path and filesystem-identity checks, immutable transition validation, and the stateful repository/publication coordinator. Evidence: complete source and consumer inspection plus 55 passing repository cases covering real filesystem topology, staged-write faults, cleanup ownership, and process interruption around rename.
- Observation: Atomic publication and cleanup share descriptor, staged-path, directory-identity, canonical-identity, and commit-point state. Evidence: the `publish` closure performs exclusive stage creation, identity checks, short-write completion, flush, close, topology revalidation, rename, and verified cleanup in one sequence; extracting it would require a new one-consumer transaction abstraction and weaken auditability.
- Observation: The first repository-slice cleanup probe checked repository-root `.vite-temp` but not Vite's actual `node_modules/.vite-temp` cache location. Evidence: an owner-supplied read-only review found the latter ordinary empty directory still present, and primary inspection confirmed its resolved workspace path, ordinary directory attributes, absent link type, and zero children before exact non-recursive removal.
- Observation: Current `App.tsx` already delegates form presentation, result presentation, and response-envelope admission; its remaining reservation, settlement, accepted-run, selection, announcement, and focus responsibilities form one cohesive UI coordinator. Evidence: `pendingAnalysis` is the only state value never read, while its setter is called at operation start and settlement solely to cause redundant renders.
- Observation: The remaining product gap is visible at both composition boundaries. Evidence: `src/server/local-service/loopback-api.ts` advertises `scan: false` and accepts only GET health/read requests, while `src/client/main.tsx` renders `<App />` without the `analyze` callback, so the shipped build disables Analyze and reports that service integration is pending.
- Observation: All required product capabilities already exist behind stable entry points. Evidence: `prepareScanRequest` and `executeScan` are exported through `src/server/scan/scan-page.ts`; `startLocalService().service.runScan` already owns reservation, persistence, terminal validation, and shutdown; `App` already owns unknown-response admission and every accepted visible state. No package, second service, UI state model, provider adapter, or persisted field is needed.
- Observation: The current Vite build emits a browser client to `dist/client`, but the production loopback entry does not serve it. Evidence: `vite.config.ts`, root `index.html`, `src/server/main.ts`, and the current developer instructions. The smallest ADR-0015-compliant topology is for the existing service to expose only that built entry and its generated direct assets from the same origin.
- Observation: Exact request, transfer, DOM, and result ceilings are explicitly Deferred for the trusted-input portfolio MVP. Evidence: `REQ-QUAL-014`, `REQ-QUAL-017`, and the deferred-bounds clarification under `REQ-QUAL-020`. The integration must not invent a resource-limit framework or present ordinary JSON parsing as hostile-request hardening.
- Observation: A changing public page cannot be reusable deterministic evidence. Evidence: ADR-0018 keeps synthetic project-owned states as the evaluation baseline and treats public-page results as observations. The public smoke therefore needs an owner-selected target at execution time, records no page content, and cannot substitute for the controlled integration matrix.
- Observation: The first independent review of this remaining-work revision returned `REVISE`, not execution approval. Evidence: it found that the draft did not preserve API-only POST/health behavior explicitly, referred to command variables without defining an executable wrapper, omitted slice-local authority anchors, allowed controlled success cases to bypass the browser form, and deleted the public aggregate before the final reviewer could inspect it. This revision addresses all five findings and the review's residual request-stream and asset-topology questions before seeking a different fresh review.

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
- Decision: Preserve `src/server/domain/run-contract.ts` as the only public contract façade and extract `run-types.ts`, `run-policy.ts`, `contract-value-reader.ts`, `finding-validation.ts`, `scan-validation.ts`, and `run-validation.ts` under `src/server/domain/run-contract/`.
  Rationale: The six modules match proven current responsibilities, retain one-way validation dependencies, and keep every production and test consumer on the existing stable import path.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Freeze every policy tuple exported between internal contract modules and reuse the existing 30 contract cases without a layout test.
  Rationale: Module extraction turns private tuples into internal exports, so runtime immutability must enforce their fixed contract. Existing tests cover observable validation; file-layout assertions would couple tests to private structure.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Preserve `src/server/persistence/run-repository.ts` as the only public repository entry point and extract `contracts.ts`, `store-errors.ts`, `windows-run-paths.ts`, and `run-transition.ts` under `src/server/persistence/run-repository/`.
  Rationale: These modules own four current cohesive responsibilities while every external production and test consumer retains the existing import path.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep root identity, canonical reads, the complete `publish` transaction, `create`/`read`/`finish`, rollback, cleanup, and error precedence together inside `openRunRepository`.
  Rationale: They form one ordering-sensitive integrity boundary whose shared state determines whether canonical bytes were committed and whether cleanup is known to have succeeded.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Reuse the existing 55 repository cases and add no private-layout test if independent preflight returns `EXISTING_AND_COVERED`.
  Rationale: The suite already exercises the observable persistence and failure contract. A file-placement assertion would add coupling without improving data-integrity evidence.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep all current analysis orchestration in `App.tsx` and remove only the unused `pendingAnalysis` state declaration and setter calls.
  Rationale: The owner selected cleanup only. A custom hook, reducer, controller, or further component would move one already cohesive lifecycle without creating a clearer current responsibility boundary.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Implement the remaining product behavior as one coherent standard-profile slice, `M105-WALKING-SKELETON-INTEGRATION-06`, rather than separate route, static-file, client-fetch, and scanner-wiring micro-slices.
  Rationale: Those changes jointly create one falsifiable user outcome and no subset is independently useful. One Red/Green pair keeps the accepted client/server boundary visible without turning M1-05 into another task graph.
  Date/Author: 2026-09-02 / primary coordinator from Accepted authorities and current repository state.
- Decision: Use the existing loopback origin for both the built client and API. Add `POST /api/runs` with the exact JSON input `{ "requestedUrl": string, "mode": "local" | "groq" }`; let the service derive the fixed provider/model and scan context through `prepareScanRequest`, invoke `executeScan` through its existing `runScan` owner, and return the existing `ScanOutcome` JSON envelope.
  Rationale: ADR-0015 selects one local application service and keeps filesystem and managed-browser authority out of browser code. Sending only URL plus mode prevents the client from becoming authoritative for scanner policy, provider identity, run identity, or persistence.
  Date/Author: 2026-09-02 / primary coordinator from ADR-0015, ADR-0018, ADR-0021, and the accepted M1 interfaces.
- Decision: Gate the new scan route and truthful health capability on successful configured-client loading. With no own `clientRoot` field, `startLocalService` remains the existing API-only service: health reports `scan: false`, every POST remains 405, and the existing read behavior is unchanged. A valid configured client root enables the closed client routes, exact scan POST, and `scan: true`; an invalid configured root returns `client-unavailable` before a listener or run repository is opened.
  Rationale: Focused M1-02/service construction intentionally has no client build. Capability gating preserves that accepted contract while making the developer-started production composition truthful; an unconditional POST would silently invalidate the existing 69-case boundary.
  Date/Author: 2026-09-02 / primary coordinator after independent plan review.
- Decision: Map a successful completed outcome to HTTP 200, malformed or rejected input to 400, busy to 409, stopping or shutdown to 503, and scan/create/validation/persistence failure to 500 while preserving the existing bounded outcome body. Keep unsupported methods at 405 and unknown paths at 404 under the current route-precedence contract.
  Rationale: This is the smallest transport projection that preserves the domain outcome consumed by `App`, distinguishes admission conditions, and adds no retry, queue, alternate error model, or framework.
  Date/Author: 2026-09-02 / primary coordinator.
- Decision: Add one focused `client-assets.ts` module that loads the Vite-generated `index.html` and its direct `.js`/`.css` assets from the configured build root into a closed response table at service startup. Serve only `/`, `/index.html`, and those exact table keys; report missing or invalid build output as bounded `client-unavailable` startup failure when a client root is configured.
  Rationale: A closed startup-built map makes readiness truthful and avoids a generic static-file server, traversal resolution, dynamic directory serving, a second Vite process, CORS, or runtime build tooling. One current consumer is sufficient because asset loading is a distinct current responsibility, not a speculative shared abstraction.
  Date/Author: 2026-09-02 / primary coordinator.
- Decision: Extend only `src/client/main.tsx` to provide the same-origin Analyze callback and reuse `App`, every M1-04 component, its admission validator, markup, CSS, copy, focus behavior, and state ownership as-is.
  Rationale: Service calling and composition plumbing are standard-profile nonvisual frontend work under the project workflow. A hook, client API layer, store, router, visual redesign, or component change is not justified by one fixed request.
  Date/Author: 2026-09-02 / primary coordinator with the frontend-quality reuse audit.
- Decision: Treat plan preparation as R0 and omit a Decision Review Contract.
  Rationale: The current task needs no external evidence, candidate ranking, ADR, or owner-controlled architectural choice; Accepted authorities already select the topology and the remaining literals are reversible task-owned implementation details. The owner-controlled public URL remains a later smoke input, not an architecture decision.
  Date/Author: 2026-09-02 / primary coordinator.

## Outcomes & Retrospective

The local-service, scanner, run-contract, and run-repository structural extractions and their verification barriers are complete. The App dead-state cleanup is also complete: the unread state and its two setter calls are gone, while the existing coordinator, public interfaces, rendered behavior, and browser contract remain unchanged. This revision freezes the remaining integration and public-smoke execution boundary; it is planning evidence only. M1-05 remains In progress because no HTTP scan route, same-origin production client, integrated controlled-case evidence, or trusted public-page smoke exists yet.

## Purpose / Big Picture

The remaining outcome is one honest walking skeleton: a developer builds and starts one local service, opens its enumerated URL in Chrome or Edge, enters one trusted public HTTPS target, selects Local or Groq, and receives the accepted complete or failed Analyze/Results presentation. The browser sends only target plus mode to its own loopback origin; the service derives the fixed scan request, executes the real exact-three-rule scanner, durably publishes one validated `run.json`, and returns the existing bounded outcome. Scanning invokes no provider.

The completed first slice made the local service easier to read and review while preserving every external import and runtime result. A reviewer now sees `service.ts` as the lifecycle coordinator plus four focused internal modules, with unchanged behavior across the accepted service and backend/scanner regressions.

The new integration slice connects those already implemented boundaries without changing the run aggregate, scanner policy, Results presentation, or provider lifecycle. Its controlled test matrix proves populated, valid-zero, native-incomplete, malformed-input, failure, one-operation, persistence/read, sibling-preservation, cleanup, and no-provider behavior. A separate public smoke is observational and cannot replace those controlled checks.

The third slice makes the central unknown-data and persisted-aggregate boundary easier to inspect without weakening it. A reviewer should see a small stable `run-contract.ts` façade, focused internal modules with acyclic dependencies, and the same accepted results across all 30 contract cases and every current consumer.

The fourth slice makes the filesystem repository easier to audit without separating its commit protocol. A reviewer should see a stable `run-repository.ts` entry point, four focused internal modules, the complete publication sequence still locally visible, and unchanged results across all 55 repository cases and every current consumer.

The fifth slice removes misleading dead state from the already purpose-composed client. A reviewer should see the same public `App` boundary, rendered tree, asynchronous ownership, focus behavior, and browser results, with no `pendingAnalysis` declaration or setter remaining.

## Context and Orientation

`src/server/service.ts` is the stable service entry point and owns the one-operation lifecycle around `runScan`. `src/server/domain/run-contract.ts`, `src/server/persistence/run-repository.ts`, and `src/server/scan/scan-page.ts` are stable façades over their accepted focused modules. The scanner exports `prepareScanRequest` and `executeScan`, but no production callback joins them to `runScan`. `src/server/local-service/loopback-api.ts` exposes only health and validated run reads and advertises `scan: false`. `src/client/main.tsx` renders `<App />` without its optional `analyze` callback, so the current production build is intentionally unavailable for analysis even though the accepted M1-04 presentation can render every required outcome under its test harness.

The applicable authority boundary is the M1-05 roadmap row and its Accepted requirements: one trusted public HTTPS target, exact-three-rule complete scanning, visible failure, durable validated aggregate reads, one-operation admission, clean stop, and accessible Analyze/Results behavior. ADR-0015 owns the developer-started loopback topology, ADR-0021 owns the single-file aggregate, ADR-0018 owns the trusted-input scan boundary, and ADR-0024 owns this worker-first behavior-preserving implementation method. The fixed RD-003 evaluation boundary remains unchanged.

The current planning baseline is the clean `codex/m1-05-walking-skeleton-integration` worktree at `a9ccb01f19db386e82c5a00f163c6525b66cb9c0`. Node 24.20.0, npm 11.19.0, TypeScript 7.0.2, React 19.2.8, Vite 8.0.16, Playwright 1.62.1, and axe integration 4.13.0 remain pinned by `package-lock.json`. Strict TypeScript and the fresh 182-case browser-free contract/repository/service baseline pass. The prior exact-identity 290 backend/scanner and 30 UI evidence remains historical input, but mutable browser or filesystem evidence must be rerun for the integration barrier. No new dependency, runtime, provider, persisted field, schema version, or product state is needed.

## Scope and Non-Goals

The completed local-service structural slice included:

- re-exporting the existing public service types from `src/server/service.ts`;
- effect-free configuration and initial-running-record validation;
- terminal-record matching, failed-record creation, and rejected scan-outcome construction;
- exact HTTP headers, route precedence, status mapping, health/read responses, and CONNECT/upgrade rejection; and
- the unchanged lifecycle coordinator in `service.ts`.

The remaining integration slice includes:

- one exact same-origin `POST /api/runs` JSON boundary from target-plus-mode input to the existing `ScanOutcome`;
- service-owned preparation and real scanner invocation through the existing `runScan` persistence/lifecycle owner;
- closed serving of the already built Vite entry and its direct generated JavaScript/CSS assets from the loopback origin;
- composition-root wiring that supplies `App`'s existing optional Analyze callback without changing M1-04 components or presentation;
- controlled full-path evidence plus one separately authorized public-page smoke; and
- developer instructions for build, retained managed-browser prerequisite, start, manual Chrome/Edge opening, stop, evidence location, and exact task-owned cleanup.

It excludes:

- any rendered component, CSS, visual hierarchy, copy, focus, ARIA, or accepted M1-04 presentation change;
- retrieval, generation, provider invocation or probing, review, comparison, retained-run reopening, Run ID UI, reload restoration, retry/resume/cancel, or automatic browser launch;
- another server, Vite development/preview process, CORS layer, proxy, router, client store, hook, API framework, dependency container, or generic static-file abstraction;
- a request/transfer/DOM/result limit framework, SSRF defense, DNS/address/redirect classification, egress proxy, or hostile-page claim;
- changes to the accepted run schema, scanner/evidence policy, repository format, runtime pins, dependency graph, controlled fixtures, or evaluation manifest;
- a lifecycle class, generic state machine, event bus, context/dependency container, shared persistence transition abstraction, generic HTTP framework, barrel file, or compatibility wrapper;
- any test change outside the new M1-05 integration test and its one purpose-named helper; and
- M2 work, release claims, commit, or push.

The run-contract slice includes only declaration moves into the six named modules, frozen internal policy tuples, the minimum internal exports needed by the next validation layer, and stable type/function re-exports from `run-contract.ts`. It excludes persistence-format changes, new accepted values, error or precedence changes, scanner-policy consolidation, one-file-per-rule decomposition, generic schema/reader abstractions, JSON Schema, validation libraries, UI behavior, and new public helpers.

The run-repository slice includes only declaration moves into four named modules, the minimum internal exports needed by the coordinator, and stable type/callable re-exports from `run-repository.ts`. It excludes persistence-format or API changes, recovery, locking, retries, staging-file sweeping or promotion, a filesystem adapter, repository class, transaction framework, generic path library, dependency, migration, UI behavior, and changes to completed M1-02 authorities or tests.

The App cleanup includes only deletion of the unread `pendingAnalysis` state declaration and its operation-start and settlement setter calls in `src/client/App.tsx`. It excludes module extraction, hooks, reducers, controllers, components, CSS, markup, copy, ARIA, focus rules, admission behavior, public interfaces, test changes, service integration, dependencies, and any M1-04 authority change.

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

### M105-RUN-CONTRACT-MODULE-REFACTOR-03 — aggregate-contract validation extraction

The observable contract is exact behavior preservation. `Fact`, `ProviderContext`, `Finding`, `ScannerReviewObservation`, `ScanResult`, `PageAnalysisRun`, and `ValidationResult` remain type-importable from `src/server/domain/run-contract.ts`; its only runtime exports remain `validateRun` and `validateScan`. Accepted values, exact-key rules, validation and failure precedence, descriptor-only inspection, accessor avoidance, ordinary-object and dense-array requirements, bounded errors, detachment, freezing, collection ordering, unique finding IDs, coverage reconciliation, chronology, cleanup constraints, and failure-category relationships remain unchanged.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/run-contract.test.ts

Expected result: the 30 static contract cases execute 58 passing TAP tests with zero failures, cancellations, skips, or todos. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/domain/run-contract.ts`
- `src/server/domain/run-contract/run-types.ts`
- `src/server/domain/run-contract/run-policy.ts`
- `src/server/domain/run-contract/contract-value-reader.ts`
- `src/server/domain/run-contract/finding-validation.ts`
- `src/server/domain/run-contract/scan-validation.ts`
- `src/server/domain/run-contract/run-validation.ts`

The accepted test and all other source, documentation, dependency, fixture, executable configuration, generated output, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. An unexpected path, test change, public-export difference, accepted-value difference, validation-precedence change, mutable exported policy tuple, cycle, or attempt to share the scanner native reader stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/domain/run-contract.ts` | Stable public façade for the seven existing public types and two validator functions | Retained entry point. Re-exports no internal reader or policy value. |
| `run-types.ts` | Run, scan, finding, evidence, fact, provider, coverage, and validation-result types | Type-model extraction. Depends only on policy-derived types where necessary. |
| `run-policy.ts` | Frozen exact rules, failure categories, attribute states, input types, message keys, and check identifiers plus their derived literal types | Fixed contract policy. Has no application dependency and exposes no mutable backing value. |
| `contract-value-reader.ts` | Descriptor-safe object inspection, exact keys, dense arrays, primitive values, IDs, times, HTTPS URLs, locales, facts, and unavailable values | Lowest validation layer. Depends on model/policy only and never invokes accessors. |
| `finding-validation.ts` | Locator, check group, rule-specific evidence, Finding, and ScannerReviewObservation validation | Evidence layer. Depends on policy, model, and value readers; owns no collection or parent lifecycle state. |
| `scan-validation.ts` | Scan context, complete-context assertion, coverage reconciliation, unique IDs, collection ordering, internal `readScan`, and public `validateScan` | Scan coordinator. Depends downward on finding validation and readers; exports only required internal seams to run validation. |
| `run-validation.ts` | Provider context, chronology, status-specific key sets, cleanup/failure relationships, internal `readRun`, and public `validateRun` | Parent-run coordinator. Depends on scan validation and lower layers; catches all inspection failures at the public boundary. |

Permitted local structural refactor is limited to declaration moves, type-only imports, frozen policy-tuple construction, intention-revealing internal exports, and stable façade re-exports. Do not introduce a schema framework, generic parser, class, dependency container, per-rule module, scanner-reader reuse, compatibility wrapper, or index barrel. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because the module validates unknown persisted data, enforces privacy allowlists and identity/collection integrity, suppresses hostile inspection errors, and protects lifecycle chronology. A fresh `critical_reviewer` must inspect accessor/prototype/key/array safety, frozen policy values, exact evidence allowlists, validation precedence, detachment/freezing, coverage and identity rules, lifecycle constraints, public compatibility, dependency direction, and decisive evidence.

Post-Green validation includes the exact 30-case contract suite, strict TypeScript, syntax checks for the façade and all six modules, the complete 290-case backend/scanner regression under the required scanner environment, and `npm run build` because browser admission imports `validateRun`. Verification must show unchanged tests, fixtures, dependencies, package metadata and TypeScript configuration; exact stable public exports; empty scanner scratch; and removal of generated `dist/client`, repository-root `.vite-temp`, and `node_modules/.vite-temp` output. The complete 30-case browser suite remains deferred to the real HTTP integration checkpoint because this structural slice changes no rendered or interaction behavior.

### M105-RUN-REPOSITORY-MODULE-REFACTOR-04 — persistence responsibility extraction

The observable contract is exact behavior preservation. `RunningRun`, `CompletedRun`, `FailedRun`, `TerminalRun`, `StoreError`, `StoreResult`, `RunRepository`, and `openRunRepository` remain importable from `src/server/persistence/run-repository.ts`. Synchronous results, validation and error precedence, Windows root and identifier admission, exact spelling, topology and identity checks, aggregate serialization, detached immutable reads, transition rules, staged publication, commit-point semantics, canonical-byte preservation, and cleanup truthfulness remain unchanged.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/run-repository.test.ts

Expected result: 55 passing cases with zero failures, cancellations, skips, or todos and no retained test-owned filesystem residue. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/persistence/run-repository.ts`
- `src/server/persistence/run-repository/contracts.ts`
- `src/server/persistence/run-repository/store-errors.ts`
- `src/server/persistence/run-repository/windows-run-paths.ts`
- `src/server/persistence/run-repository/run-transition.ts`

The accepted test and all other source, documentation, dependency, fixture, executable configuration, generated output, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. An unexpected path, test change, public-export difference, error-precedence change, captured named filesystem callable, publication-state extraction, cleanup difference, or need for another path stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/persistence/run-repository.ts` | Stable public entry point; captured root identity, root/run/canonical revalidation, validated current reads, complete staged publication and cleanup, and `create`/`read`/`finish` coordination | Retained integrity coordinator. Imports the four focused modules and re-exports public contracts; all publication state remains local. |
| `run-repository/contracts.ts` | Existing public run aliases, closed store errors/results, and repository interface | Type-only extraction. Depends on the stable domain contract; external consumers continue through the façade. |
| `run-repository/store-errors.ts` | Internal bounded exception, rejection, failure-result mapping, and native error-code inspection | Lowest operational-error layer. Depends only on public store result/error types and exposes no raw exception content. |
| `run-repository/windows-run-paths.ts` | Run-ID and reserved-name policy, absolute-root validation/establishment, case-insensitive entry discovery, exact-name enforcement, ordinary file/directory checks, real-path comparison, and `dev`/`ino` identity comparison | Focused filesystem-safety layer. Retains the default `node:fs` object so existing fault interception remains effective. |
| `run-repository/run-transition.ts` | Pure compatibility validation from a persisted running record to a proposed terminal record | Focused domain-transition layer. Depends on public run aliases and bounded rejection; owns no filesystem or repository state. |

Keep `checkRoot`, `checkRun`, `checkCanonical`, `readCurrent`, the complete `publish` transaction, directory rollback, and the three repository methods inside `openRunRepository`. Permitted local refactor is limited to declaration moves, intention-revealing internal exports, type-only imports, and stable façade re-exports. Do not introduce a filesystem adapter, repository class, transaction framework, locking, retries, recovery or staging sweep, generic path library, new dependency, compatibility wrapper, or barrel. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because path identity, reparse/hard-link rejection, write atomicity, process interruption, cleanup ownership, and no-partial-publication are critical even though the intended change is structural. A fresh `critical_reviewer` must inspect default filesystem-object use, exact Windows admission, repeated topology checks, descriptor/path identity, short-write and close behavior, rename as the final filesystem operation, failure and cleanup precedence, public compatibility, dependency direction, and decisive evidence.

Post-Green validation includes the exact 55-case repository suite, strict TypeScript, syntax checks for all five resulting modules, stable runtime/type export and external-consumer inspection, and the complete 290-case backend/scanner regression under the required scanner environment. Verification must show unchanged tests, fixtures, dependencies, package metadata, TypeScript configuration, persisted format, retained browser runtime, and absent generated output; scanner scratch must be empty and removed after use. Browser UI and production-build verification remain deferred to the real HTTP integration checkpoint because this slice changes no UI, browser runtime, or client import.

### M105-APP-DEAD-STATE-CLEANUP-05 — retain the App coordinator

The observable contract is exact behavior preservation. `App`, `AppProps`, and the `AnalyzeIntent` type re-export remain unchanged. URL/mode validation, synchronous reservation, busy presentation, stale/unmounted settlement guards, response admission, completed-result retention, failed-run presentation, selection identity, announcements, Results-heading node stability, and conditional focus restoration remain identical. The rendered DOM, text, IDs, classes, semantics, ARIA relationships, CSS, and client/server boundaries do not change.

TDD is applicable because application source changes. Independent read-only `test_worker` preflight must classify the unchanged 30-case `tests/target-results-ui.test.ts` boundary. `EXISTING_AND_COVERED` is expected; any other outcome stops for reconciliation, and no implementation-shaped or dead-state-layout assertion may be added.

The standard nonvisual Green uses one `code_worker` turn under a lease allowing only `src/client/App.tsx`. The worker removes the `pendingAnalysis` state declaration, `setPendingAnalysis(intent)`, and `setPendingAnalysis(null)`, and makes no other source or test change. The accepted cohesion disposition is `RETAINED`; any need for a new path, abstraction, behavior correction, test change, or public-interface adjustment stops the slice.

Risk is `S1`: this is ordinary bounded application cleanup with no rendered or cross-boundary behavior change. A fresh `milestone_reviewer` must confirm exact three-line removal, unchanged public interfaces and lifecycle ownership, absence of the dead symbols, accepted behavior evidence, generated-output cleanup, and documentation truthfulness.

Post-Green validation runs the unchanged 30 browser cases under the retained pinned Chromium and isolated UI scratch environment, strict TypeScript, the native production build, and the complete sequential 290 backend/scanner plus 30 UI regression. The harness's deterministic client inventory must include the changed App identity without harness modification. After verification, remove only verified owned `dist/client`, UI/scanner scratch, repository-root `.vite-temp`, and `node_modules/.vite-temp`; prove both Vite cache locations absent and the pinned browser runtime unchanged. Existing human Chrome 200% and Narrator evidence remains applicable because no rendered node, text, relationship, focus rule, or style changes.

### M105-WALKING-SKELETON-INTEGRATION-06 — one same-origin Analyze-to-disk path

After this slice, the production entry point serves the built React client and its closed generated asset set from the enumerated loopback origin. The ready client posts exactly one normalized target and selected mode to `POST /api/runs`. The service validates that boundary, derives the fixed provider/model plus scan context through `prepareScanRequest`, reserves the existing single operation, calls `executeScan`, publishes the resulting terminal aggregate through the existing repository, and returns the existing `ScanOutcome`. The same response is admitted by `App`; no browser code receives filesystem, managed-browser, scanner, or provider authority. API-only callers remain read-only and do not acquire this production capability implicitly.

The binding authority anchors for this slice are the M1-05 [Objective, Expected output, User-visible outcome, and Verification](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton); `REQ-AUTH-007` and `REQ-AUTH-008`, `REQ-SCAN-001` and `REQ-SCAN-005`–`REQ-SCAN-007`, plus `REQ-EVID-003` and `REQ-EVID-007`–`REQ-EVID-011` in [Target authorization, scanning, evidence, and provenance](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning); `REQ-LLM-002`, `REQ-LLM-003`, and `REQ-LLM-021` in [LLM provider selection and generation execution](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md#llm-provider-selection-and-generation-execution); `REQ-INST-002` and `REQ-INST-004` in [MVP startup and model lifecycle](../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md#mvp-startup-model-setup-and-deferred-packaging); `REQ-SEC-005` and `REQ-SEC-006` in [Privacy and security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security); `REQ-UX-002`–`REQ-UX-005` and `REQ-UX-010`–`REQ-UX-014` in [Evidence-oriented interface and export](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export); and `REQ-QUAL-011`, `REQ-QUAL-012`, and `REQ-QUAL-020` in [Reliability, reproducibility, and operations](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations). The scenario anchors are `BHV-01`/`SPEC-001`, `BHV-07`/`SPEC-007`, `HS-001`, `HS-004`, and `HS-006` in [`SPEC.feature`](../specs/SPEC.feature) and [`HARD_SPEC.feature`](../specs/HARD_SPEC.feature). ADR-0015, ADR-0018, ADR-0021, and ADR-0024 remain controlling, together with [OD-021](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp), [OD-024](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-024--minimum-complete-mvp-behavior-contracts), [OD-026](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-026--defer-user-facing-retained-run-reopening), and [OD-027](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-027--simplify-analysis-and-results-presentation).

The HTTP literal is fixed for this task. Only a configured-client service has this route. It accepts exact `POST /api/runs` with a `Content-Type` value which, after outer whitespace trimming and ASCII case folding, is exactly `application/json`; parameters, comma-separated values, missing values, and alternatives are rejected. The JSON value must be an ordinary parsed object with exactly `requestedUrl` and `mode`, and `mode` is only `local` or `groq`. No quantitative body ceiling is invented because the Accepted trusted-loopback MVP explicitly defers exhaustive request bounds; this is not a hostile-request hardening claim. A request-stream `aborted` or `error` event must settle once, must not prepare, create, persist, or scan a run, and returns the existing invalid-request outcome at 400 only if the response remains writable; otherwise the connection is closed without an unbounded diagnostic.

The service does not accept client-supplied run IDs, revisions, provider/model strings, scan context, scanner options, evidence, file paths, headers, or destinations. Successful completion returns 200; invalid media type, request stream, JSON, keys, URL, embedded credentials, or mode returns the existing rejected `ScanOutcome` at 400; busy returns 409; stopping or shutdown returns 503; and create, scan, result-validation, or initial-persistence failure returns 500. API-only construction preserves the current health value `capabilities.scan: false` and rejects every POST at 405 without consuming its body. Configured-client construction reports `scan: true`. For both modes, all responses retain `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`; API responses retain `application/json;charset=utf-8`. Method selection retains precedence over query checking for unsupported methods. For GET, a literal query or fragment is 400, health precedes the stopping gate, the stopping gate precedes read/static/unknown dispatch, exact API routes precede client routes, and unknown paths remain 404. CONNECT and upgrade sockets remain rejected.

An own `clientRoot` field must be a non-empty absolute string; an accessor, explicit `undefined`, relative path, or extra configuration key is `invalid-configuration`. If the field is absent, startup follows the existing API-only path with no client filesystem read. If present, startup validates and loads the client before opening the run repository or listener. The configured root, `index.html`, and every selected asset must resolve to their literal absolute locations through ordinary non-link ancestors; the root must be an ordinary directory, and every entry must be an ordinary file whose real path remains beneath that root. Startup reads only `index.html`, the one or more root-absolute module-script `src` references matching `/assets/<single-basename>.js`, and any root-absolute stylesheet `href` references matching `/assets/<single-basename>.css`; duplicate, encoded, query-bearing, fragment-bearing, nested, escaping, external, missing, unreadable, linked, non-file, or other script/stylesheet references fail as `client-unavailable`. At least one JavaScript entry is required. The loader reads those finite bytes once and returns a closed immutable table for `/`, `/index.html`, and the exact asset keys, with `text/html;charset=utf-8`, `text/javascript;charset=utf-8`, or `text/css;charset=utf-8` as applicable. No request-derived filesystem join, directory listing, fallback file, SPA rewrite, or runtime reload is permitted. `src/server/main.ts` supplies the absolute repository `dist/client` root, so the production command requires a successful build and reports `client-unavailable` rather than readiness for absent or invalid output.

TDD is applicable because the slice adds missing application behavior. One persistent `test_worker` first performs read-only preflight against the exact current source, existing 182 browser-free cases, 88 scanner cases, and 30 UI cases without a repository edit. The primary—not the test worker—first runs the explicitly recorded no-lease `M105-CMD-PREFLIGHT-SETUP` to create the three empty ignored scratch roots. The test worker may then run only `M105-CMD-PREFLIGHT`; those commands may use the owned roots and managed browser but must leave zero net generated residue. It must not create setup paths, build, start the production listener, or write a tracked file. `MISSING` is expected only after it cites the absent production callback, route, configured-client composition, and static-serving behavior plus the existing seams that will carry them; `PARTIAL` may advance only after the primary records the exact already-covered versus missing boundary. `EXISTING_AND_COVERED`, `EXISTING_BUT_UNCOVERED`, `REGRESSION`, `CONFLICTING`, or `UNKNOWN` stops for reconciliation. Search absence alone is not accepted evidence.

The Red lease permits only `tests/walking-skeleton.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts`. The test file owns behavior-oriented full-path cases; the helper may own only repeated test-side service/UI-browser/managed-scan interception, isolated run-root creation under exact `temp/m105-integration`, request observation, and exact task-owned teardown. Build creation belongs to the frozen command, not the helper. The helper must not duplicate a production validator or normalize a scanner result. It may embed only the minimum project-owned HTML needed for the controlled page; no new fixture or captured external content is created.

The controlled lanes are exact and sequential:

| Lane | Required entry and observable result |
| --- | --- |
| Local populated/incomplete | In the actually served production client, verify no mode is selected; an invalid Analyze attempt shows only the accepted validation and sends no request. Then select Local and submit the target through the browser form. The same-origin fetch must cross exact HTTP intake, service preparation/reservation, real `executeScan` with an intercepted project-owned `https://m105.test/` page, atomic publication, response admission, and the existing Results UI. Assert multiple Findings, at least one distinct native incomplete observation, validated HTTP/disk reread, exact run identity, and zero provider request. |
| Groq valid zero | Submit Groq through the same served browser form and the same complete production path. The exact three-rule native result has zero Findings, complete coverage, no incomplete observation, durable validated publication, truthful zero presentation, and zero provider request or probe. |
| Visible scan failure | Submit one target through the same served browser form; fail navigation inside the real `executeScan` path, persist the bounded failed terminal record when required by the existing service contract, admit the response, and show the existing failure presentation without presenting zero or partial success. |
| Direct transport/lifecycle | Exercise configured health/static and asset closure, exact/invalid content type, malformed JSON, wrong keys, aborted/error request settlement, busy contention, stopping/clean stop, invalid/missing client build startup, validated API read, exact disposable run-directory deletion, and sibling preservation directly at their owning HTTP/service/filesystem boundaries. |
| Existing presentation regression | The unchanged 30-case `tests/target-results-ui.test.ts` remains the authority for both modes, initially unselected state, validation-only feedback, known Local/Groq configuration messages that do not probe or block scanning, response hardening, complete evidence presentation, keyboard operation, announcements, focus retention/replacement, zoom, and default axe checks. The new integration file must not duplicate those permutations. |

The expected Red is the new focused command failing on the current production's missing configured-client static and `POST /api/runs` capabilities—not a broken runtime, wrong import, unconditional assertion, skipped case, unrelated existing failure, or a test that calls the service method instead of traversing each browser lane above.

The separate Green lease uses one `code_worker` and forbids both accepted test paths. Its exact allowed production paths are:

| Path | Current primary responsibility | Slice addition and fit |
| --- | --- | --- |
| `src/server/service.ts` | Public service entry and one-operation lifecycle/persistence coordinator | Reuse the existing reservation owner to prepare one admitted request and call the real scanner; scanner execution must not move into HTTP code. |
| `src/server/main.ts` | Developer-started composition root and bounded lifecycle diagnostics | Supply the fixed built-client root; retain manual browser opening, environment validation, stop handling, and content-safe diagnostics. |
| `src/server/local-service/contracts.ts` | Public local-service types | Add only optional `clientRoot` configuration and bounded `client-unavailable` startup result needed by the current production composition. |
| `src/server/local-service/input-validation.ts` | Descriptor-safe service and run-input preparation | Add exact target-plus-mode admission and delegate fixed scan-policy construction to `prepareScanRequest`; do not create another URL or provider policy. |
| `src/server/local-service/loopback-api.ts` | Loopback HTTP routing, headers, transport parsing, and callback dispatch | Add the one POST route, bounded status projection, and exact closed client-response dispatch while retaining current route and socket precedence. |
| `src/server/local-service/client-assets.ts` | Planned closed startup loading of the current built client | `CREATE` one focused module for exact entry/direct-asset loading and MIME-bearing response-table construction; it is not a generic file server or future packaging layer. |
| `src/client/main.tsx` | Browser composition root | Extend the existing root with one same-origin `fetch` callback that sends only URL plus mode and returns parsed unknown data to `App` admission. |

The dependency direction is `main.ts -> service.ts -> input-validation/client-assets/loopback-api/repository/scan-page`; `input-validation.ts -> scan-page.prepareScanRequest`; `service.ts -> scan-page.executeScan`; `loopback-api.ts -> narrow callback and response-table types`; and `client/main.tsx -> App`. `service.ts` loads the finite client table before repository/listener effects and passes it to the transport; the transport never asks the filesystem to resolve a request. The browser calls only its loopback API. No server module imports client components, no client module imports a server runtime value, and no transport module owns scanner, persistence, or lifecycle state. The reuse disposition is: retain the four stable server façades and all M1-04 UI components; extend the five existing composition/transport/configuration files above; create only `client-assets.ts`; create no other production file. Permitted Refactor is limited to a small purpose-named private function inside an allowed file when the final changed surface otherwise mixes one of these declared responsibilities. A need for another production path, a generic abstraction, or a different dependency edge is `RECONCILE`, not implicit permission.

The standard profile is controlling. Although `main.tsx` changes and Analyze becomes available in the production composition, the accepted UI already implements that state; no rendered component, CSS, hierarchy, copy, focus, or ARIA contract changes. The frontend-quality reuse audit therefore selects no `frontend-visual` capsule and no `frontend_code_worker`. If Green needs any component or style change, close the lease and reclassify the changed contract before writing.

Risk is `S3` because the new boundary joins HTTP parsing, operation admission, managed-browser cleanup, terminal-result identity, atomic publication, and a closed filesystem asset map. A fresh `critical_reviewer` must inspect the actual Red/Green order, terminal lease receipts, status/body mapping, unknown-data validation, same-origin privilege boundary, scanner and provider call graph, one-operation and shutdown behavior, publication/read/deletion evidence, asset path containment, absence of raw content, changed-surface cohesion, and complete validation. One unresolved finding stops advancement.

Use workflow ID `M1-05-20260902-06` and work-slice ID `M105-WALKING-SKELETON-INTEGRATION-06`. Default budget is one preflight, one Red turn, one Green turn, at most one same-contract correction per role using attempt 2 and its terminal parent lease, and one review correction loop. Stop after the same decisive failure twice, two no-diff write handoffs, any changed binding field, unexpected path, active lease ambiguity, dependency/runtime drift, public contract conflict, or need for more than this one coherent TDD cycle. After Green the implementation worker reports exactly `RETAINED`, `REFACTORED`, or `RECONCILE` with path-and-symbol evidence; the primary independently accepts behavior and structure.

No implementation branch is parallelizable in this worktree. Preflight, Red, Green/optional behavior-preserving Refactor, primary inspection, complete verification, slice review, public smoke, final review, and cleanup remain sequential; read-only review never overlaps a writer or an owned browser/service command.

The exact command preparation, entry/preflight identity, focused Red/Green command, accepted evidence tuple, sequential verification barrier, public smoke, generated boundaries, final cleanup, documentation closure, and restoration rules are frozen below under `M105-CMD-*`; a setup packet may copy them but may not invent replacements. Record build and test exit codes separately and record exact final test counts rather than predicting how many cases the new Red will add.

### M105-TRUSTED-PUBLIC-SMOKE-07 — observational public-page checkpoint

This is external verification after the controlled slice passes, not another production change. TDD is not applicable because it observes the already implemented workflow against a mutable external page. No worker or write lease is needed unless the observation exposes a new, separately reconciled product defect. Before execution, the project owner must provide one exact public HTTPS URL they are permitted and willing to trust, confirm that its requested and ordinary redirect destination are non-sensitive enough for local run provenance, and declare the one generated smoke run disposable. Do not choose a target on the owner's behalf, scan more than that one page, or publish its URL, page content, Findings, or evidence in tracked documentation.

The binding anchors for this checkpoint are the M1-05 [Expected output, User-visible outcome, and Verification](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton); `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-001`, `REQ-SCAN-005`–`REQ-SCAN-007`, `REQ-EVID-003`, and `REQ-EVID-007`–`REQ-EVID-011` in [Target authorization, scanning, evidence, and provenance](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning); `REQ-INST-002`, `REQ-INST-004`, `REQ-SEC-005`, `REQ-SEC-006`, `REQ-QUAL-011`, `REQ-QUAL-012`, and `REQ-QUAL-020` in their requirement modules linked above; the Analyze/Results portions of `REQ-LLM-002`, `REQ-LLM-003`, `REQ-LLM-021`, `REQ-UX-002`–`REQ-UX-005`, and `REQ-UX-010`–`REQ-UX-014`; `BHV-01`/`SPEC-001`, the retention/deletion portion of `BHV-07`/`SPEC-007`, and `HS-001`, `HS-004`, and `HS-006`; ADR-0015, ADR-0018, ADR-0021, and the OD-021/OD-024/OD-026/OD-027 boundaries. It is observational corroboration only and cannot qualify the frozen RD-003 evaluation baseline.

Using the exact `M105-CMD-PUBLIC-SMOKE` block below with the already accepted build identity, retained managed-browser identity, and production `npm run start` entry, capture the bounded `service-ready` line. Open only that enumerated loopback URL manually in installed Chrome or Edge, confirm no mode is preselected, select one mode, and activate Analyze once. Acceptance requires a completed exact-three-rule result—not a particular finding count—whose normalized target identity and concise limitation render through the accepted UI; the corresponding one newly created `data/runs/<run-id>/run.json` must validate both through the running application read boundary and the application-owned validator and contain no prohibited raw material. Confirm the service cleanly stops, all managed browser resources close, scanner scratch is empty, and no provider is invoked.

Before the smoke, snapshot the exact immediate child names under `data/runs`; afterward require exactly one new ordinary non-link run directory. Pin its run ID, canonical `run.json` SHA-256, accepted source/build/browser identities, application revision, process-environment name set, selected mode, date, bounded completion/coverage result, validation result, and clean-stop/scratch result. The URL remains a private execution input and no page content, Finding, evidence value, redirect identity, or provider secret enters tracked documentation. Public network evidence remains `Non-reusable`; a mutable-page or network failure does not justify code change or automatic retry, and one owner-directed replacement target is the maximum before stopping for direction.

Keep that exact aggregate intact through the different fresh final integrated `critical_reviewer` inspection. Preserve and fingerprint every pre-existing sibling if any exists, but do not manufacture a durable sibling merely for this smoke; the controlled transport/lifecycle lane owns the mandatory sibling-preservation proof. The reviewer must read the pinned canonical bytes and independently reconcile their identity, minimized shape, publication/read evidence, surrounding directory state, and exact deletion preconditions. Only after that review returns PASS may the primary resolve the literal smoke-run path beneath `data/runs`, recheck ordinary non-link topology and hash, remove only the declared smoke run directory, prove it absent, and confirm every pre-existing sibling identity is unchanged. This final deterministic cleanup does not authorize another scan or source change and does not require another full integrated review; its exact command result belongs to the documentation closure gate. It demonstrates the manual deletion boundary without adding a deletion UI, backup, recycle bin, cascade, tombstone, or provider-erasure claim.

### M105-CMD-PREP — exact shell literals and environment restoration

All commands run in PowerShell from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`. They reuse Node `C:/nvm4w/nodejs/node.exe`, adjacent npm 11.19.0, installed packages, the existing npm cache at `temp/rd002-npm-cache`, and the retained browser at `m104-browser-runtime/browsers`. Bootstrap, dependency restore, package/configuration mutation, browser acquisition, another cache, and a repository helper script are `None`. The generated locations are exactly `dist/client`, `temp/m103-scan`, `temp/m104-ui`, and `temp/m105-integration`; repository-root `.vite-temp` and `node_modules/.vite-temp` must remain absent. Run this preparation text in every new command shell; it defines values and functions but creates or removes nothing.

```powershell
$ErrorActionPreference = 'Stop'
$m105Repo = [IO.Path]::GetFullPath('C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab')
if ((Resolve-Path -LiteralPath '.').Path -ine $m105Repo) { throw 'Wrong M1-05 working directory' }
$m105Node = 'C:/nvm4w/nodejs/node.exe'
$m105Npm = 'C:/nvm4w/nodejs/npm.cmd'
$m105Runtime = Join-Path $m105Repo 'm104-browser-runtime'
$m105Browsers = Join-Path $m105Runtime 'browsers'
$m105ScanTemp = Join-Path $m105Repo 'temp/m103-scan'
$m105UiTemp = Join-Path $m105Repo 'temp/m104-ui'
$m105IntegrationTemp = Join-Path $m105Repo 'temp/m105-integration'
$m105Build = Join-Path $m105Repo 'dist/client'
$m105RunRoot = Join-Path $m105Repo 'data/runs'
$m105ActiveLease = Join-Path $m105Repo 'logs/agent-flow-leases/v2/active.json'
$m105ProductionPaths = @('src/server/service.ts','src/server/main.ts',
  'src/server/local-service/contracts.ts','src/server/local-service/input-validation.ts',
  'src/server/local-service/loopback-api.ts','src/server/local-service/client-assets.ts',
  'src/client/main.tsx')
$m105AcceptedTestPaths = @('tests/walking-skeleton.test.ts',
  'tests/helpers/m105-walking-skeleton-harness.ts')
$m105ProtectedPaths = @('package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html')
$m105PreArchiveDocumentationPaths = @('README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md',
  'docs/PROJECT_CONCEPT.md','docs/PROJECT_CONTEXT.md','docs/architecture/README.md',
  'docs/architecture/CANDIDATE_ARCHITECTURE.md',
  'docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md',
  'docs/requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md','docs/plans/README.md',
  'docs/plans/m1-05-walking-skeleton-integration.md','docs/progress/README.md',
  'docs/progress/m1-05-walking-skeleton-integration.md')
$toolchainOptions = @('--global=false','--prefix',$m105Repo,'--cache',
  (Join-Path $m105Repo 'temp/rd002-npm-cache'),'--ignore-scripts=true',
  '--audit=false','--fund=false','--update-notifier=false','--logs-max=0',
  '--registry=https://registry.npmjs.org/','--strict-ssl=true',
  '--package-lock=true','--include=dev','--include=optional')
$m105FixedReject = @('NODE_OPTIONS','NODE_DEBUG','NODE_DEBUG_NATIVE',
  'NODE_COMPILE_CACHE','NODE_V8_COVERAGE','NODE_REDIRECT_WARNINGS',
  'DEBUG','DEBUG_FILE','PWDEBUG','PWDEBUGIMPL','SELENIUM_REMOTE_URL',
  'SELENIUM_REMOTE_CAPABILITIES','SELENIUM_REMOTE_HEADERS')
$m105Controlled = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_GC',
  'PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT')
$m105Rejected = @(Get-ChildItem Env: | Where-Object {
  $m105Name = $_.Name
  $m105Alias = $m105Name -match '^(?i:npm_config_|npm_package_config_)'
  $m105Base = $m105Name -replace '^(?i:npm_config_|npm_package_config_)',''
  ($m105FixedReject -contains $m105Base) -or
    (($m105Base -match '^(?i:PLAYWRIGHT_|PWTEST_|PW_)') -and
      ($m105Alias -or $m105Controlled -notcontains $m105Base))
} | Select-Object -ExpandProperty Name)
if ($m105Rejected.Count) { throw ('Unsupported environment names: ' + ($m105Rejected -join ', ')) }

function Invoke-M105Command([scriptblock]$Command, [string]$Scratch = '') {
  $m105Names = @('NODE_DISABLE_COMPILE_CACHE')
  if ($Scratch) {
    if (@($m105ScanTemp,$m105UiTemp) -notcontains $Scratch) { throw 'Unknown M1-05 command scratch' }
    $m105Names += @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_GC',
      'PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','TEMP','TMP')
  }
  $m105Saved = @{}
  foreach ($m105Name in $m105Names) {
    $m105Saved[$m105Name] = [Environment]::GetEnvironmentVariable($m105Name,'Process')
  }
  try {
    [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','1','Process')
    if ($Scratch) {
      [Environment]::SetEnvironmentVariable('PLAYWRIGHT_BROWSERS_PATH',$m105Browsers,'Process')
      [Environment]::SetEnvironmentVariable('PLAYWRIGHT_SKIP_BROWSER_GC','1','Process')
      [Environment]::SetEnvironmentVariable('PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','30000','Process')
      [Environment]::SetEnvironmentVariable('TEMP',$Scratch,'Process')
      [Environment]::SetEnvironmentVariable('TMP',$Scratch,'Process')
    }
    & $Command
  } finally {
    foreach ($m105Name in $m105Names) {
      $m105Prior = $m105Saved[$m105Name]
      [Environment]::SetEnvironmentVariable($m105Name,
        $(if ($null -eq $m105Prior) { [NullString]::Value } else { $m105Prior }),'Process')
    }
    foreach ($m105Name in $m105Names) {
      if ([Environment]::GetEnvironmentVariable($m105Name,'Process') -cne $m105Saved[$m105Name]) {
        throw ('Environment restore mismatch: ' + $m105Name)
      }
    }
  }
}

function Assert-M105OrdinaryPath([string]$Candidate, [switch]$AllowMissing) {
  $m105Full = [IO.Path]::GetFullPath($Candidate)
  $m105Prefix = $m105Repo.TrimEnd([IO.Path]::DirectorySeparatorChar,[IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  if (-not $m105Full.StartsWith($m105Prefix,[StringComparison]::OrdinalIgnoreCase)) { throw 'M1-05 path escapes repository' }
  $m105Parts = [IO.Path]::GetRelativePath($m105Repo,$m105Full) -split '[\\/]'
  $m105Cursor = $m105Repo
  for ($m105Index = 0; $m105Index -lt $m105Parts.Count; $m105Index++) {
    $m105Cursor = Join-Path $m105Cursor $m105Parts[$m105Index]
    if (-not (Test-Path -LiteralPath $m105Cursor)) {
      if ($AllowMissing) { return $m105Full }
      throw ('Missing M1-05 path: ' + $m105Cursor)
    }
    $m105Item = Get-Item -LiteralPath $m105Cursor -Force
    if (($m105Item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw ('Linked M1-05 path: ' + $m105Cursor) }
    if ($m105Index -lt $m105Parts.Count - 1 -and -not $m105Item.PSIsContainer) { throw 'Non-directory M1-05 ancestor' }
    if ([IO.Path]::GetFullPath((Resolve-Path -LiteralPath $m105Cursor).Path) -ine [IO.Path]::GetFullPath($m105Cursor)) {
      throw ('Aliased M1-05 path: ' + $m105Cursor)
    }
  }
  return $m105Full
}

function Assert-M105EmptyDirectory([string]$Candidate) {
  $m105Full = Assert-M105OrdinaryPath $Candidate
  if (-not (Get-Item -LiteralPath $m105Full -Force).PSIsContainer) { throw 'M1-05 scratch is not a directory' }
  if (@(Get-ChildItem -LiteralPath $m105Full -Force).Count -ne 0) { throw ('M1-05 scratch is not empty: ' + $m105Full) }
}

function Get-M105TreeIdentity([string]$Candidate) {
  $m105Root = Assert-M105OrdinaryPath $Candidate
  if (-not (Get-Item -LiteralPath $m105Root -Force).PSIsContainer) { throw 'M1-05 tree root is not a directory' }
  $m105Rows = [Collections.Generic.List[string]]::new()
  $m105Queue = [Collections.Generic.Queue[string]]::new()
  $m105Queue.Enqueue($m105Root)
  [int]$m105Files = 0; [int]$m105Directories = 0; [long]$m105Bytes = 0
  while ($m105Queue.Count) {
    $m105Current = $m105Queue.Dequeue()
    foreach ($m105Child in @(Get-ChildItem -LiteralPath $m105Current -Force | Sort-Object Name)) {
      if (($m105Child.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Linked M1-05 tree entry' }
      $m105Relative = [IO.Path]::GetRelativePath($m105Root,$m105Child.FullName).Replace('\','/')
      if ($m105Child.PSIsContainer) {
        $m105Directories++; $m105Rows.Add("D`t$m105Relative"); $m105Queue.Enqueue($m105Child.FullName)
      } elseif ($m105Child -is [IO.FileInfo]) {
        $m105Files++; $m105Bytes += $m105Child.Length
        $m105Hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $m105Child.FullName).Hash
        $m105Rows.Add("F`t$m105Relative`t$($m105Child.Length)`t$m105Hash")
      } else { throw 'Unsupported M1-05 tree entry' }
    }
  }
  $m105Payload = [Text.Encoding]::UTF8.GetBytes(($m105Rows -join "`n"))
  [pscustomobject]@{ Entries = $m105Files + $m105Directories; Files = $m105Files;
    Directories = $m105Directories; Bytes = $m105Bytes;
    Digest = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($m105Payload)) }
}

function Get-M105FileHashes([string[]]$RelativePaths) {
  $m105Hashes = [ordered]@{}
  foreach ($m105Relative in $RelativePaths) {
    $m105File = Assert-M105OrdinaryPath (Join-Path $m105Repo $m105Relative)
    $m105Item = Get-Item -LiteralPath $m105File -Force
    if ($m105Item.PSIsContainer -or $m105Item -isnot [IO.FileInfo]) { throw ('Expected ordinary file: ' + $m105Relative) }
    $m105Hashes[$m105Relative] = (Get-FileHash -Algorithm SHA256 -LiteralPath $m105File).Hash
  }
  return $m105Hashes
}

function Assert-M105FileHashes($Expected, [string]$Label) {
  $m105Actual = Get-M105FileHashes @($Expected.Keys)
  if ($m105Actual.Count -ne $Expected.Count) { throw ($Label + ' file-set count changed') }
  foreach ($m105Relative in $Expected.Keys) {
    if ($m105Actual[$m105Relative] -cne $Expected[$m105Relative]) {
      throw ($Label + ' changed: ' + $m105Relative)
    }
  }
}

function Assert-M105TreeRecord([string]$Candidate, $Expected, [string]$Label) {
  $m105Actual = Get-M105TreeIdentity $Candidate
  foreach ($m105Field in @('Entries','Files','Directories','Bytes','Digest')) {
    if ($m105Actual.$m105Field -cne $Expected.$m105Field) { throw ($Label + ' changed at ' + $m105Field) }
  }
}

function Assert-M105GitEndpoint([string[]]$RequiredPaths, [string[]]$AllowedPaths = @()) {
  $m105Head = (& git rev-parse HEAD).Trim()
  if ($LASTEXITCODE -ne 0 -or $m105Head -cne 'a9ccb01f19db386e82c5a00f163c6525b66cb9c0') { throw 'M1-05 HEAD changed' }
  $m105Branch = (& git branch --show-current).Trim()
  if ($LASTEXITCODE -ne 0 -or $m105Branch -cne 'codex/m1-05-walking-skeleton-integration') { throw 'M1-05 branch changed' }
  $m105Staged = @(& git diff --cached --name-only)
  if ($LASTEXITCODE -ne 0 -or $m105Staged.Count -ne 0) { throw 'M1-05 Git index is not empty' }
  $m105Status = @(& git -c status.renames=false status --porcelain=v1 --untracked-files=all)
  if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect M1-05 worktree state' }
  $m105ActualPaths = @($m105Status | ForEach-Object {
    if ($_.Length -lt 4) { throw 'Malformed Git status row' }
    $_.Substring(3).Replace('\','/')
  } | Sort-Object)
  if ($AllowedPaths.Count -eq 0) {
    $m105ExpectedPaths = @($RequiredPaths | Sort-Object)
    if (($m105ActualPaths -join "`n") -cne ($m105ExpectedPaths -join "`n")) {
      throw ('Unexpected M1-05 worktree paths: ' + ($m105ActualPaths -join ', '))
    }
  } else {
    foreach ($m105ActualPath in $m105ActualPaths) {
      if ($AllowedPaths -notcontains $m105ActualPath) { throw ('Unexpected M1-05 worktree path: ' + $m105ActualPath) }
    }
    foreach ($m105RequiredPath in $RequiredPaths) {
      if ($m105ActualPaths -notcontains $m105RequiredPath) { throw ('Missing required M1-05 worktree path: ' + $m105RequiredPath) }
    }
  }
  $null = Assert-M105OrdinaryPath $m105ActiveLease -AllowMissing
  if (Test-Path -LiteralPath $m105ActiveLease) { throw 'A write lease is active' }
}

function Assert-M105PlanningIdentity {
  Assert-M105GitEndpoint @('docs/plans/m1-05-walking-skeleton-integration.md')
  Assert-M105TreeRecord (Join-Path $m105Repo 'src') ([pscustomobject]@{
    Entries=51; Files=39; Directories=12; Bytes=147831;
    Digest='8960366EC4E34C2C3649C44D7FDED9077AA28EFA90E456FE350988FA735C7A21'
  }) 'Planning source tree'
  Assert-M105TreeRecord (Join-Path $m105Repo 'tests') ([pscustomobject]@{
    Entries=9; Files=8; Directories=1; Bytes=317970;
    Digest='B96EC7A3DB35396475C5485180D880BB5F36DCC3F19DA475E9D811BFE1216840'
  }) 'Planning test tree'
  Assert-M105FileHashes ([ordered]@{
    'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98'
    'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553'
    'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE'
    'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07'
    'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
  }) 'Planning protected input'
  Assert-M105TreeRecord $m105Runtime ([pscustomobject]@{
    Entries=332; Files=318; Directories=14; Bytes=451193922;
    Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC'
  }) 'Planning retained browser'
  $m105PlanningMarker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
  if ($m105PlanningMarker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or
      $m105PlanningMarker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath $m105PlanningMarker.FullName).Hash -cne
        'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
        '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2') {
    throw 'Planning browser executable or marker drifted'
  }
}

function Get-M105LeaseReceiptEvidence([string]$LeaseId, [string]$ContractDigest, [string[]]$ExpectedPaths) {
  if ($ContractDigest -notmatch '^[0-9a-f]{64}$') { throw ('Invalid guard digest slot for ' + $LeaseId) }
  $m105ReceiptPath = Assert-M105OrdinaryPath (Join-Path $m105Repo ('logs/agent-flow-leases/v2/' + $LeaseId + '/receipt.json'))
  $m105Receipt = Get-Content -Raw -LiteralPath $m105ReceiptPath | ConvertFrom-Json
  if ($m105Receipt.schema_version -ne 2 -or $m105Receipt.lease_id -cne $LeaseId -or
      $m105Receipt.contract_digest -cne $ContractDigest -or $m105Receipt.outcome -cne 'compliant' -or
      $m105Receipt.verified_head -cne 'a9ccb01f19db386e82c5a00f163c6525b66cb9c0' -or
      $m105Receipt.verified_head_ref -cne 'refs/heads/codex/m1-05-walking-skeleton-integration' -or
      @($m105Receipt.changes.forbidden).Count -ne 0 -or @($m105Receipt.changes.unleased).Count -ne 0) {
    throw ('Noncompliant terminal receipt: ' + $LeaseId)
  }
  $m105ActualPaths = @($m105Receipt.changes.allowed.path | ForEach-Object { $_.ToLowerInvariant() } | Sort-Object)
  $m105ExpectedPaths = @($ExpectedPaths | ForEach-Object { $_.ToLowerInvariant() } | Sort-Object)
  if (($m105ActualPaths -join "`n") -cne ($m105ExpectedPaths -join "`n")) {
    throw ('Terminal receipt path mismatch: ' + $LeaseId)
  }
  return [pscustomobject]@{ Digest=$m105Receipt.digest;
    FileHash=(Get-FileHash -Algorithm SHA256 -LiteralPath $m105ReceiptPath).Hash }
}

function Get-M105RunSetDigest([string]$ExcludeRunId = '') {
  $null = Assert-M105OrdinaryPath $m105RunRoot
  $m105Rows = [Collections.Generic.List[string]]::new()
  foreach ($m105Entry in @(Get-ChildItem -LiteralPath $m105RunRoot -Force | Sort-Object Name)) {
    if ($ExcludeRunId -and $m105Entry.Name -ceq $ExcludeRunId) { continue }
    if (-not $m105Entry.PSIsContainer -or ($m105Entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
      throw 'Unsafe run-root sibling'
    }
    $m105Identity = Get-M105TreeIdentity $m105Entry.FullName
    $m105Rows.Add("$($m105Entry.Name)`t$($m105Identity.Entries)`t$($m105Identity.Bytes)`t$($m105Identity.Digest)")
  }
  $m105Payload = [Text.Encoding]::UTF8.GetBytes(($m105Rows -join "`n"))
  return [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($m105Payload))
}
```

### M105-CMD-PREFLIGHT-SETUP — retained runtime and clean generated state

At the current baseline the retained runtime identity under the exact function above is 332 entries, 318 files, 14 directories, 451,193,922 bytes, digest `4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC`; `chromium-1234/chrome-win64/chrome.exe` is SHA-256 `409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2`; and `chromium-1234/DEPENDENCIES_VALIDATED` is the empty-file SHA-256 `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855`, UTC mtime `2026-09-01T19:46:51.6545663Z`. Require the same tree identity before and after every managed-browser command and a marker no more than 30 days old and not future-dated. Drift, a stale marker, a missing runtime, or a reparse point stops for explicit setup reconciliation; it never triggers incidental download or deletion.

With no active lease and before the read-only test-worker turn, the primary runs this one explicitly safe coordinator setup. Require `dist/client`, repository-root `.vite-temp`, `node_modules/.vite-temp`, `temp/m103-scan`, `temp/m104-ui`, and `temp/m105-integration` absent, then create only the three scratch directories as declared ignored diagnostic effects and require them empty. This is not application source, a test contract, setup behavior, or a worker write turn. Record the created paths and keep them as empty owned roots through Red, Green, verification, smoke, and final cleanup. A pre-existing path is preserved and stops execution until its ownership is reconciled; it is not deleted to satisfy this check.

Vite never runs over an existing `dist/client` in this plan. Each build requires that path absent. After Red evidence and its generated build identity are inspected, the primary removes only that exact recognized Red build before Green. The accepted Green build is retained unchanged through complete verification, both reviews, and the public smoke; a same-contract Green correction must first reconcile and remove only its recorded failed-attempt build. Before and after each test/start command, require its named scratch and `temp/m105-integration` empty. The integration helper may create descendants only under `temp/m105-integration` and must remove them before returning.

```powershell
Assert-M105PlanningIdentity
$m105RuntimeIdentity = Get-M105TreeIdentity $m105Runtime
if ($m105RuntimeIdentity.Entries -ne 332 -or $m105RuntimeIdentity.Files -ne 318 -or
    $m105RuntimeIdentity.Directories -ne 14 -or $m105RuntimeIdentity.Bytes -ne 451193922 -or
    $m105RuntimeIdentity.Digest -cne '4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC') {
  throw 'Retained browser identity drifted'
}
$m105Marker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
if ($m105Marker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or $m105Marker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath $m105Marker.FullName).Hash -cne 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
      '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2') { throw 'Retained browser prerequisite is invalid' }
foreach ($m105Absent in @($m105Build,(Join-Path $m105Repo '.vite-temp'),
    (Join-Path $m105Repo 'node_modules/.vite-temp'),$m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  $null = Assert-M105OrdinaryPath $m105Absent -AllowMissing
  if (Test-Path -LiteralPath $m105Absent) { throw ('Expected absent at M1-05 entry: ' + $m105Absent) }
}
New-Item -ItemType Directory -Path $m105ScanTemp,$m105UiTemp,$m105IntegrationTemp | Out-Null
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

### M105-CMD-PREFLIGHT — exact no-lease characterization commands

After the coordinator setup above, the persistent `test_worker` runs this block without a lease or repository edit. It records each invocation's exit and TAP counts separately, verifies all scratch roots empty after the applicable process, and compares the runtime with the entry identity. The browser-free boundary must pass 182/182. The scanner boundary must retain its accepted 20 normalization and 68 execution leaf cases, with its existing TAP parent groups; the UI boundary must pass 30/30. Strict TypeScript must exit 0. Any source/test/configuration hash drift, generated residue, external UI request, browser/runtime mutation, failed command, or different case inventory returns `UNKNOWN` or `REGRESSION` as applicable rather than advancing to Red.

```powershell
Assert-M105PlanningIdentity
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight browser-free exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 browser-free preflight failed' }
}
Assert-M105EmptyDirectory $m105ScanTemp
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight scanner exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 scanner preflight failed' }
} $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/target-results-ui.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight UI exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 UI preflight failed' }
} $m105UiTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight typecheck exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 preflight typecheck failed' }
}
if (Test-Path -LiteralPath $m105Build) { throw 'Preflight created unexpected client build output' }
if (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) { throw 'Preflight created unexpected repository Vite cache' }
if (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp')) { throw 'Preflight created unexpected node_modules Vite cache' }
$m105PreflightRuntimeIdentity = Get-M105TreeIdentity $m105Runtime
if ($m105PreflightRuntimeIdentity.Entries -ne 332 -or $m105PreflightRuntimeIdentity.Files -ne 318 -or
    $m105PreflightRuntimeIdentity.Directories -ne 14 -or $m105PreflightRuntimeIdentity.Bytes -ne 451193922 -or
    $m105PreflightRuntimeIdentity.Digest -cne '4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC') {
  throw 'Retained browser changed during preflight'
}
Assert-M105PlanningIdentity
```

### M105-CMD-FOCUSED — exact Red and Green commands

Red and Green use the same frozen preparation and effects. Run the syntax checks and native build first. For Red, the focused test command must exit nonzero only on the absent configured-client/static/POST behavior described above; an exit 0, environment/runtime failure, or unrelated failure is rejected. After the accepted Red file identities are frozen, Green reruns the same build and test command without changing either test path and requires exit 0.

```powershell
# Run this common prefix once immediately before Red and again immediately before Green.
if (Test-Path -LiteralPath $m105Build) { throw 'M1-05 build must be absent before Vite runs' }
Invoke-M105Command {
  & $m105Node --check tests/walking-skeleton.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Walking-skeleton test syntax failed' }
  & $m105Node --check tests/helpers/m105-walking-skeleton-harness.ts
  if ($LASTEXITCODE -ne 0) { throw 'Walking-skeleton helper syntax failed' }
}
Invoke-M105Command {
  & $m105Node node_modules/vite/bin/vite.js build --configLoader native
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 focused build exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 focused build failed' }
}
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

The exact Red invocation is:

```powershell
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 focused test exit: $m105Exit"
  if ($m105Exit -eq 0) { throw 'M1-05 Red unexpectedly passed' }
} $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

The Red lease ID is exactly `M1-05-20260902-06-integration-red-01`. The primary records the exit and decisive assertion names, terminally closes that lease, replaces the digest slot below with the returned contract digest, and runs this exact identity check before any plan maintenance or Green lease. The two emitted hashes become the accepted Red boundary; a wrong receipt, path set, HEAD/ref, staged change, active lease, or other worktree path stops.

```powershell
$m105RedLeaseId = 'M1-05-20260902-06-integration-red-01'
$m105RedContractDigest = '<M105-RED-CONTRACT-DIGEST returned by guard start>'
Assert-M105GitEndpoint @('docs/plans/m1-05-walking-skeleton-integration.md',
  'tests/walking-skeleton.test.ts','tests/helpers/m105-walking-skeleton-harness.ts')
$m105RedReceipt = Get-M105LeaseReceiptEvidence $m105RedLeaseId $m105RedContractDigest $m105AcceptedTestPaths
$m105RedTestHashes = Get-M105FileHashes $m105AcceptedTestPaths
[pscustomobject]@{ LeaseId=$m105RedLeaseId; ContractDigest=$m105RedContractDigest;
  ReceiptDigest=$m105RedReceipt.Digest; ReceiptFileHash=$m105RedReceipt.FileHash;
  TestHashes=$m105RedTestHashes } | ConvertTo-Json -Depth 5
```

After freezing those literal values in this living plan, the primary fingerprints the recognized Red build and removes only that exact generated directory before the Green lease:

```powershell
$m105RedBuildIdentity = Get-M105TreeIdentity $m105Build
if ($m105RedBuildIdentity.Files -lt 2 -or $m105RedBuildIdentity.Bytes -lt 1) { throw 'Unexpected Red build inventory' }
Remove-Item -LiteralPath (Assert-M105OrdinaryPath $m105Build) -Recurse -Force -ErrorAction Stop
if (Test-Path -LiteralPath $m105Build) { throw 'Red build cleanup failed' }
```

The Green lease ID is exactly `M1-05-20260902-06-integration-green-01`. After the separate Green lease starts, rerun the common prefix above and then run the exact Green invocation:

```powershell
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 focused test exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 focused Green failed' }
} $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
$m105AcceptedGreenBuildIdentity = Get-M105TreeIdentity $m105Build
```

The test invocation and arguments are byte-for-byte identical between phases; only the expected exit assertion differs. Green requires zero failure, cancellation, skip, todo, or focused-only marker. Do not rebuild or delete it unless a same-contract Green correction is accepted; in that case fingerprint and remove only the exact failed-attempt build before attempt 2.

### M105-CMD-GREEN-EVIDENCE — one frozen source/test/build/runtime/guard tuple

Immediately after the primary terminally closes the Green lease—and before changing this plan or running complete verification—replace the Red and Green guard slots below with the already accepted Red literals and the fresh Green closure values. Run this block once. It requires fresh `closed-compliant` Green status with no post-close drift, unchanged accepted Red tests, exact protected inputs, the expected ten worktree paths, no active lease, and one simultaneous snapshot of the whole source tree, whole test tree, seven production paths, two accepted tests, five protected build inputs, retained build, retained browser, and both terminal receipts. Record the emitted object in this plan as `M105-ACCEPTED-GREEN-TUPLE-001`.

```powershell
$m105RedLeaseId = 'M1-05-20260902-06-integration-red-01'
$m105RedContractDigest = '<M105-RED-CONTRACT-DIGEST>'
$m105AcceptedRedReceiptDigest = '<M105-RED-RECEIPT-DIGEST>'
$m105AcceptedRedReceiptFileHash = '<M105-RED-RECEIPT-FILE-SHA256>'
$m105AcceptedRedTestHashes = [ordered]@{
  'tests/walking-skeleton.test.ts'='<M105-ACCEPTED-RED-TEST-SHA256>'
  'tests/helpers/m105-walking-skeleton-harness.ts'='<M105-ACCEPTED-RED-HELPER-SHA256>'
}
$m105GreenLeaseId = 'M1-05-20260902-06-integration-green-01'
$m105GreenContractDigest = '<M105-GREEN-CONTRACT-DIGEST returned by guard start>'
$m105GreenStatusText = (& python -B .codex/leases/lease_guard.py status `
  --lease-id $m105GreenLeaseId --contract-digest $m105GreenContractDigest) -join "`n"
$m105GreenStatusExit = $LASTEXITCODE
$m105GreenStatus = $m105GreenStatusText | ConvertFrom-Json
if ($m105GreenStatusExit -ne 0 -or $m105GreenStatus.status -cne 'closed-compliant' -or
    $m105GreenStatus.post_close_drift -ne $false) { throw 'Green lease is not freshly closed and stable' }
Assert-M105GitEndpoint (@('docs/plans/m1-05-walking-skeleton-integration.md') + $m105AcceptedTestPaths + $m105ProductionPaths)
Assert-M105FileHashes $m105AcceptedRedTestHashes 'Accepted Red boundary'
$m105RedReceipt = Get-M105LeaseReceiptEvidence $m105RedLeaseId $m105RedContractDigest $m105AcceptedTestPaths
if ($m105RedReceipt.Digest -cne $m105AcceptedRedReceiptDigest -or
    $m105RedReceipt.FileHash -cne $m105AcceptedRedReceiptFileHash) { throw 'Accepted Red receipt changed' }
$m105GreenReceipt = Get-M105LeaseReceiptEvidence $m105GreenLeaseId $m105GreenContractDigest $m105ProductionPaths
$m105GreenTuple = [ordered]@{
  ProductionHashes=(Get-M105FileHashes $m105ProductionPaths)
  AcceptedTestHashes=(Get-M105FileHashes $m105AcceptedTestPaths)
  ProtectedHashes=(Get-M105FileHashes $m105ProtectedPaths)
  SourceTree=(Get-M105TreeIdentity (Join-Path $m105Repo 'src'))
  TestTree=(Get-M105TreeIdentity (Join-Path $m105Repo 'tests'))
  Build=(Get-M105TreeIdentity $m105Build)
  Runtime=(Get-M105TreeIdentity $m105Runtime)
  RedLease=[ordered]@{ Id=$m105RedLeaseId; ContractDigest=$m105RedContractDigest;
    ReceiptDigest=$m105RedReceipt.Digest; ReceiptFileHash=$m105RedReceipt.FileHash }
  GreenLease=[ordered]@{ Id=$m105GreenLeaseId; ContractDigest=$m105GreenContractDigest;
    ReceiptDigest=$m105GreenReceipt.Digest; ReceiptFileHash=$m105GreenReceipt.FileHash }
}
$m105GreenTuple | ConvertTo-Json -Depth 7
```

Before complete verification, replace every slot in the following block with that single emitted object. Thereafter run `M105-CMD-PREP`, this entire block, and its final assertion in every new complete-verification, review-evidence, public-smoke, or pre-cleanup shell. The block is the one reusable tuple; later recapture is forbidden. Its slots are primary-accepted evidence, not worker discretion.

```powershell
$m105AcceptedProductionHashes = [ordered]@{
  'src/server/service.ts'='<M105-ACCEPTED-GREEN-SHA256>'
  'src/server/main.ts'='<M105-ACCEPTED-GREEN-SHA256>'
  'src/server/local-service/contracts.ts'='<M105-ACCEPTED-GREEN-SHA256>'
  'src/server/local-service/input-validation.ts'='<M105-ACCEPTED-GREEN-SHA256>'
  'src/server/local-service/loopback-api.ts'='<M105-ACCEPTED-GREEN-SHA256>'
  'src/server/local-service/client-assets.ts'='<M105-ACCEPTED-GREEN-SHA256>'
  'src/client/main.tsx'='<M105-ACCEPTED-GREEN-SHA256>'
}
$m105AcceptedTestHashes = [ordered]@{
  'tests/walking-skeleton.test.ts'='<M105-ACCEPTED-RED-TEST-SHA256>'
  'tests/helpers/m105-walking-skeleton-harness.ts'='<M105-ACCEPTED-RED-HELPER-SHA256>'
}
$m105AcceptedProtectedHashes = [ordered]@{
  'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98'
  'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553'
  'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE'
  'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07'
  'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
}
$m105AcceptedSourceTree = [pscustomobject]@{ Entries=[int]'<M105-SOURCE-ENTRIES>'; Files=[int]'<M105-SOURCE-FILES>';
  Directories=[int]'<M105-SOURCE-DIRECTORIES>'; Bytes=[long]'<M105-SOURCE-BYTES>'; Digest='<M105-SOURCE-DIGEST>' }
$m105AcceptedTestTree = [pscustomobject]@{ Entries=[int]'<M105-TEST-ENTRIES>'; Files=[int]'<M105-TEST-FILES>';
  Directories=[int]'<M105-TEST-DIRECTORIES>'; Bytes=[long]'<M105-TEST-BYTES>'; Digest='<M105-TEST-DIGEST>' }
$m105AcceptedBuild = [pscustomobject]@{ Entries=[int]'<M105-BUILD-ENTRIES>'; Files=[int]'<M105-BUILD-FILES>';
  Directories=[int]'<M105-BUILD-DIRECTORIES>'; Bytes=[long]'<M105-BUILD-BYTES>'; Digest='<M105-BUILD-DIGEST>' }
$m105AcceptedRuntime = [pscustomobject]@{ Entries=332; Files=318; Directories=14; Bytes=451193922;
  Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC' }
$m105AcceptedRedLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-red-01';
  ContractDigest='<M105-RED-CONTRACT-DIGEST>'; ReceiptDigest='<M105-RED-RECEIPT-DIGEST>';
  ReceiptFileHash='<M105-RED-RECEIPT-FILE-SHA256>' }
$m105AcceptedGreenLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-green-01';
  ContractDigest='<M105-GREEN-CONTRACT-DIGEST>'; ReceiptDigest='<M105-GREEN-RECEIPT-DIGEST>';
  ReceiptFileHash='<M105-GREEN-RECEIPT-FILE-SHA256>' }
function Assert-M105AcceptedGreenTuple {
  $m105RequiredGreenPaths = @('docs/plans/m1-05-walking-skeleton-integration.md') +
    $m105AcceptedTestPaths + $m105ProductionPaths
  $m105AllowedGreenPaths = $m105PreArchiveDocumentationPaths + $m105AcceptedTestPaths + $m105ProductionPaths
  Assert-M105GitEndpoint $m105RequiredGreenPaths $m105AllowedGreenPaths
  Assert-M105FileHashes $m105AcceptedProductionHashes 'Accepted Green production'
  Assert-M105FileHashes $m105AcceptedTestHashes 'Accepted Red tests'
  Assert-M105FileHashes $m105AcceptedProtectedHashes 'Accepted protected input'
  Assert-M105TreeRecord (Join-Path $m105Repo 'src') $m105AcceptedSourceTree 'Accepted source tree'
  Assert-M105TreeRecord (Join-Path $m105Repo 'tests') $m105AcceptedTestTree 'Accepted test tree'
  Assert-M105TreeRecord $m105Build $m105AcceptedBuild 'Accepted Green build'
  Assert-M105TreeRecord $m105Runtime $m105AcceptedRuntime 'Accepted retained browser'
  $m105RedReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedRedLease.Id `
    $m105AcceptedRedLease.ContractDigest $m105AcceptedTestPaths
  $m105GreenReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedGreenLease.Id `
    $m105AcceptedGreenLease.ContractDigest $m105ProductionPaths
  if ($m105RedReceipt.Digest -cne $m105AcceptedRedLease.ReceiptDigest -or
      $m105RedReceipt.FileHash -cne $m105AcceptedRedLease.ReceiptFileHash -or
      $m105GreenReceipt.Digest -cne $m105AcceptedGreenLease.ReceiptDigest -or
      $m105GreenReceipt.FileHash -cne $m105AcceptedGreenLease.ReceiptFileHash) {
    throw 'Accepted terminal lease identity changed'
  }
  $m105Marker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
  if ($m105Marker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or $m105Marker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath $m105Marker.FullName).Hash -cne
        'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
        '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2' -or
      (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) -or
      (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp'))) {
    throw 'Accepted browser/build environment changed'
  }
}
Assert-M105AcceptedGreenTuple
```

### M105-CMD-COMPLETE — exact sequential verification barrier

Each of the six backend/scanner/integration files runs in its own process and in the listed order; do not combine or parallelize them. The unchanged UI file then runs separately with its own scratch. Strict TypeScript and all changed server-file syntax checks are separate checks; the native production build was created by the exact Green common prefix and is accepted here only if its frozen identity is unchanged. Require the retained runtime identity unchanged, all three scratch roots empty, both `.vite-temp` paths absent, and the exact accepted build identity afterward.

```powershell
Assert-M105AcceptedGreenTuple
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'run-contract suite failed' } }
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/run-repository.test.ts; if ($LASTEXITCODE -ne 0) { throw 'run-repository suite failed' } }
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/local-service.test.ts; if ($LASTEXITCODE -ne 0) { throw 'local-service suite failed' } }
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/scan-normalization.test.ts; if ($LASTEXITCODE -ne 0) { throw 'scan-normalization suite failed' } }
Assert-M105EmptyDirectory $m105ScanTemp
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/scan-page.test.ts; if ($LASTEXITCODE -ne 0) { throw 'scan-page suite failed' } } $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts; if ($LASTEXITCODE -ne 0) { throw 'walking-skeleton suite failed' } } $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/target-results-ui.test.ts; if ($LASTEXITCODE -ne 0) { throw 'target/results UI suite failed' } } $m105UiTemp
Assert-M105EmptyDirectory $m105UiTemp
Invoke-M105Command { & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' } }
Invoke-M105Command {
  foreach ($m105Source in @('src/server/service.ts','src/server/main.ts','src/server/local-service/contracts.ts',
      'src/server/local-service/input-validation.ts','src/server/local-service/loopback-api.ts',
      'src/server/local-service/client-assets.ts')) {
    & $m105Node --check $m105Source
    if ($LASTEXITCODE -ne 0) { throw ('Syntax failed: ' + $m105Source) }
  }
}
if (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) { throw 'Unexpected repository Vite cache' }
if (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp')) { throw 'Unexpected node_modules Vite cache' }
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Assert-M105AcceptedGreenTuple
```

### M105-CMD-PUBLIC-SMOKE — exact start, observation, validation, and stop

This command has two PowerShell shells because the production entry intentionally waits for `stop` on stdin. In both shells run `M105-CMD-PREP`, the populated `M105-CMD-GREEN-EVIDENCE` reusable-tuple block, and its final assertion before continuing. This proves that the exact accepted source, tests, protected inputs, build, runtime, browser executable/marker, terminal receipts, Git endpoint, and Vite-cache state still match; no later source recapture may replace that tuple. Then run the following scratch check. No write lease may be active.

```powershell
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

In shell A, run the following block; copy only the emitted loopback `service-ready` URL. Do not use `Start-Process`, background the service, redirect output to a tracked file, or launch the user browser automatically.

```powershell
$m105ApplicationRevision = (& git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $m105ApplicationRevision -notmatch '^[0-9a-f]{40}$') { throw 'Invalid application revision' }
$m105SavedRevision = [Environment]::GetEnvironmentVariable('A11Y_APPLICATION_REVISION','Process')
$m105SavedPort = [Environment]::GetEnvironmentVariable('A11Y_PORT','Process')
try {
  [Environment]::SetEnvironmentVariable('A11Y_APPLICATION_REVISION',$m105ApplicationRevision,'Process')
  [Environment]::SetEnvironmentVariable('A11Y_PORT','0','Process')
  Invoke-M105Command {
    $m105ServerEnvironmentNames = @((Get-ChildItem Env: | Select-Object -ExpandProperty Name | Sort-Object))
    $m105ServerEnvironmentNameDigest = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData(
      [Text.Encoding]::UTF8.GetBytes(($m105ServerEnvironmentNames -join "`n"))))
    Write-Output "M1-05 server environment-name digest: $m105ServerEnvironmentNameDigest"
    & $m105Npm @toolchainOptions run start
    $m105Exit = $LASTEXITCODE; Write-Output "M1-05 production service exit: $m105Exit"
    if ($m105Exit -ne 0) { throw 'M1-05 production service failed' }
  } $m105ScanTemp
} finally {
  [Environment]::SetEnvironmentVariable('A11Y_APPLICATION_REVISION',
    $(if ($null -eq $m105SavedRevision) { [NullString]::Value } else { $m105SavedRevision }),'Process')
  [Environment]::SetEnvironmentVariable('A11Y_PORT',
    $(if ($null -eq $m105SavedPort) { [NullString]::Value } else { $m105SavedPort }),'Process')
  if ([Environment]::GetEnvironmentVariable('A11Y_APPLICATION_REVISION','Process') -cne $m105SavedRevision -or
      [Environment]::GetEnvironmentVariable('A11Y_PORT','Process') -cne $m105SavedPort) { throw 'Production environment restore mismatch' }
}
```

In shell B, take the before snapshot before touching the browser, enter the owner-approved URL only at the private prompt, and type `DISPOSABLE` only if the owner has made that declaration. The script does not persist or print the target. Supply the exact service-ready URL and selected mode. Open that URL manually in Chrome or Edge, enter the same approved target, select the same mode, activate Analyze once, inspect the result, and then continue the script.

```powershell
$m105ServiceUrl = Read-Host 'Exact emitted loopback service URL'
try { $m105ServiceUri = [Uri]$m105ServiceUrl } catch { throw 'Invalid enumerated service URL' }
if ($m105ServiceUrl -notmatch '^http://127\.0\.0\.1:[1-9][0-9]{0,4}$' -or
    $m105ServiceUri.Scheme -cne 'http' -or $m105ServiceUri.Host -cne '127.0.0.1' -or
    $m105ServiceUri.Port -lt 1 -or $m105ServiceUri.Port -gt 65535 -or $m105ServiceUri.AbsolutePath -cne '/') {
  throw 'Invalid enumerated service URL'
}
$m105Mode = Read-Host 'Selected mode: local or groq'
if ($m105Mode -cne 'local' -and $m105Mode -cne 'groq') { throw 'Invalid selected mode' }
$m105ApprovedTarget = Read-Host 'Owner-approved trusted public HTTPS target'
try { $m105TargetUri = [Uri]$m105ApprovedTarget } catch { throw 'Invalid approved target' }
if ($m105TargetUri.Scheme -cne 'https' -or -not $m105TargetUri.Host -or $m105TargetUri.UserInfo) { throw 'Target is outside trusted HTTPS admission' }
if ((Read-Host 'Type DISPOSABLE to authorize deletion after final review') -cne 'DISPOSABLE') { throw 'Disposable-run declaration missing' }
$null = Assert-M105OrdinaryPath $m105RunRoot
$m105SiblingSetDigest = Get-M105RunSetDigest
$m105Before = @{}
foreach ($m105Entry in @(Get-ChildItem -LiteralPath $m105RunRoot -Force)) {
  if (-not $m105Entry.PSIsContainer -or ($m105Entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Unsafe pre-smoke run-root entry' }
  $m105Before[$m105Entry.Name] = Get-M105TreeIdentity $m105Entry.FullName
}
$null = Read-Host 'After the one browser Analyze action has visibly completed, press ENTER'
$m105After = @(Get-ChildItem -LiteralPath $m105RunRoot -Force)
$m105New = @($m105After | Where-Object { -not $m105Before.ContainsKey($_.Name) })
if ($m105New.Count -ne 1 -or -not $m105New[0].PSIsContainer -or
    ($m105New[0].Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Expected exactly one new ordinary smoke run' }
$m105SmokeRunId = $m105New[0].Name
if ((Get-M105RunSetDigest $m105SmokeRunId) -cne $m105SiblingSetDigest) { throw 'Pre-existing run set changed during smoke' }
$m105SmokeRunPath = Assert-M105OrdinaryPath $m105New[0].FullName
$m105SmokeChildren = @(Get-ChildItem -LiteralPath $m105SmokeRunPath -Force)
if ($m105SmokeChildren.Count -ne 1 -or $m105SmokeChildren[0].Name -cne 'run.json' -or
    $m105SmokeChildren[0].PSIsContainer -or ($m105SmokeChildren[0].Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
  throw 'Smoke run is not the one-file aggregate'
}
$m105RunJson = $m105SmokeChildren[0].FullName
$m105Validation = @'
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { validateRun } from './src/server/domain/run-contract.ts';
const [serviceUrl, runId, file, mode] = process.argv.slice(1);
const disk = validateRun(JSON.parse(fs.readFileSync(file, 'utf8')));
if (!disk.ok || disk.value.status !== 'completed' || disk.value.providerContext.mode !== mode) throw Error('invalid disk aggregate');
const response = await fetch(`${serviceUrl}/api/runs/${runId}`);
const envelope = await response.json();
const read = validateRun(envelope?.run);
if (!response.ok || envelope?.ok !== true || !read.ok || !isDeepStrictEqual(read.value, disk.value)) throw Error('validated application read mismatch');
console.log(JSON.stringify({ status: disk.value.status, rules: disk.value.scan.coverage.rules,
  findings: disk.value.scan.findings.length, scannerReviewObservations: disk.value.scan.scannerReviewObservations.length }));
'@
Invoke-M105Command { & $m105Node --input-type=module --eval $m105Validation $m105ServiceUrl $m105SmokeRunId $m105RunJson $m105Mode; if ($LASTEXITCODE -ne 0) { throw 'Smoke aggregate validation failed' } }
$m105SmokeHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $m105RunJson).Hash
$m105BuildIdentity = Get-M105TreeIdentity $m105Build
$m105BrowserIdentity = Get-M105TreeIdentity $m105Runtime
[pscustomobject]@{ RunId=$m105SmokeRunId; RunJsonSha256=$m105SmokeHash; Mode=$m105Mode;
  BuildDigest=$m105BuildIdentity.Digest; BrowserDigest=$m105BrowserIdentity.Digest;
  SiblingSetDigest=$m105SiblingSetDigest }
```

Now type `stop` followed by Enter in shell A. Require exactly one `service-stopped` event and exit 0, then in shell B run `Assert-M105EmptyDirectory $m105ScanTemp`, `Assert-M105EmptyDirectory $m105IntegrationTemp`, and `Assert-M105AcceptedGreenTuple`. Rehash the smoke aggregate and all pre-existing run directories, freeze the content-safe values in this living plan as `M105-SMOKE-RETAINED-001`, and retain them through the final integrated review. This post-stop tuple assertion proves that the source, accepted tests, protected inputs, build, runtime, and receipts remain the same as Green rather than merely recapturing a new state. Do not retain `$m105ApprovedTarget` or terminal history in tracked evidence.

### M105-CMD-FINAL-CLEANUP — post-review deletion and generated-output cleanup

Before final integrated review, the plan must replace the following execution-populated slots with literal values: `M105-SMOKE-RUN-ID`, `M105-SMOKE-RUN.JSON-SHA256`, `M105-SMOKE-BUILD-DIGEST`, `M105-SMOKE-BROWSER-DIGEST`, and `M105-SMOKE-SIBLING-SET-DIGEST`. The reviewer verifies those values while the aggregate and build still exist. After PASS, a new shell runs `M105-CMD-PREP`, the populated reusable Green-tuple block, and then the frozen smoke literals below before performing this deterministic cleanup. Any mismatch preserves the tree and stops.

```powershell
Assert-M105AcceptedGreenTuple
$m105SmokeRunId = '<M105-SMOKE-RUN-ID frozen before final review>'
$m105SmokeHash = '<M105-SMOKE-RUN.JSON-SHA256 frozen before final review>'
$m105SiblingSetDigest = '<M105-SMOKE-SIBLING-SET-DIGEST frozen before final review>'
$m105SmokeBuildDigest = '<M105-SMOKE-BUILD-DIGEST frozen before final review>'
$m105SmokeBrowserDigest = '<M105-SMOKE-BROWSER-DIGEST frozen before final review>'
if ($m105SmokeBuildDigest -cne $m105AcceptedBuild.Digest -or
    $m105SmokeBrowserDigest -cne $m105AcceptedRuntime.Digest) { throw 'Smoke identity differs from accepted Green tuple' }
$m105SmokeRunPath = Assert-M105OrdinaryPath (Join-Path $m105RunRoot $m105SmokeRunId)
$m105RunJson = Assert-M105OrdinaryPath (Join-Path $m105SmokeRunPath 'run.json')
if (@(Get-ChildItem -LiteralPath $m105SmokeRunPath -Force).Count -ne 1 -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath $m105RunJson).Hash -cne $m105SmokeHash) { throw 'Smoke aggregate changed before deletion' }
Remove-Item -LiteralPath $m105SmokeRunPath -Recurse -Force -ErrorAction Stop
if (Test-Path -LiteralPath $m105SmokeRunPath) { throw 'Smoke run deletion failed' }
if ((Get-M105RunSetDigest) -cne $m105SiblingSetDigest) { throw 'Pre-existing run set changed during smoke cleanup' }
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $m105Scratch
  Remove-Item -LiteralPath $m105Scratch -ErrorAction Stop
  if (Test-Path -LiteralPath $m105Scratch) { throw ('Scratch cleanup failed: ' + $m105Scratch) }
}
$m105OwnedBuildIdentity = Get-M105TreeIdentity $m105Build
if ($m105OwnedBuildIdentity.Digest -cne $m105SmokeBuildDigest) { throw 'Build changed before cleanup' }
Remove-Item -LiteralPath $m105Build -Recurse -Force -ErrorAction Stop
if (Test-Path -LiteralPath $m105Build) { throw 'Build cleanup failed' }
if (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) { throw 'Unexpected repository Vite cache' }
if (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp')) { throw 'Unexpected node_modules Vite cache' }
if ((Get-M105TreeIdentity $m105Runtime).Digest -cne $m105SmokeBrowserDigest) {
  throw 'Retained browser changed during cleanup'
}
```

The angle-bracket slots are not worker discretion: they can be filled only from the single accepted smoke execution and must be frozen before the final review. No parent root, shared npm cache, dependency tree, retained browser, unrelated run, or user data may be removed.

### M105-CMD-DOCUMENTATION-CLOSURE — exact post-mutation validation

Before the final integrated review, replace the smoke slots below from `M105-SMOKE-RETAINED-001` and replace every executable-identity slot by byte-for-byte copying the corresponding value from `M105-ACCEPTED-GREEN-TUPLE-001`; recapturing later state is forbidden. The reviewer checks those duplicates against the retained tuple while the build still exists. Run this command only after that review passes, `M105-CMD-FINAL-CLEANUP` deletes the reviewed build and smoke run, all authority/status/developer-instruction updates are made, and the plan moves. In a fresh PowerShell shell, first run `M105-CMD-PREP` from the archived plan to define its read-only helpers and then run this whole block. It is intentionally after every documentation mutation. It reasserts the frozen executable state without requiring the intentionally deleted build, and it neither repairs nor stages anything; any failure leaves M1-05 visibly incomplete for correction.

```powershell
$m105ArchivedPlan = Join-Path $m105Repo 'docs/plans/completed/m1-05-walking-skeleton-integration.md'
$m105ActivePlan = Join-Path $m105Repo 'docs/plans/m1-05-walking-skeleton-integration.md'
$m105FinalSmokeRunId = '<M105-SMOKE-RUN-ID frozen before final review>'
$m105FinalSiblingSetDigest = '<M105-SMOKE-SIBLING-SET-DIGEST frozen before final review>'
if (Test-Path -LiteralPath $m105ActivePlan) { throw 'Active M1-05 plan still exists after archive move' }
$null = Assert-M105OrdinaryPath $m105ArchivedPlan
if ((Get-Item -LiteralPath $m105ArchivedPlan -Force).PSIsContainer) { throw 'Archived M1-05 plan is not a file' }
$null = Assert-M105OrdinaryPath $m105ActiveLease -AllowMissing
if (Test-Path -LiteralPath $m105ActiveLease) { throw 'A write lease remains active at closure' }
foreach ($m105Absent in @($m105Build,$m105ScanTemp,$m105UiTemp,$m105IntegrationTemp,
    (Join-Path $m105Repo '.vite-temp'),(Join-Path $m105Repo 'node_modules/.vite-temp'),
    (Join-Path $m105RunRoot $m105FinalSmokeRunId))) {
  $null = Assert-M105OrdinaryPath $m105Absent -AllowMissing
  if (Test-Path -LiteralPath $m105Absent) { throw ('Unexpected M1-05 closure residue: ' + $m105Absent) }
}
if ((Get-M105RunSetDigest) -cne $m105FinalSiblingSetDigest) { throw 'Run siblings changed after final cleanup' }
Assert-M105TreeRecord $m105Runtime ([pscustomobject]@{
  Entries=332; Files=318; Directories=14; Bytes=451193922;
  Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC'
}) 'Closure retained browser'
$m105ClosureMarker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
if ($m105ClosureMarker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or
    $m105ClosureMarker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath $m105ClosureMarker.FullName).Hash -cne
      'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
      '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2') {
  throw 'Closure browser executable or marker changed'
}

$m105ClosureProductionHashes = [ordered]@{
  'src/server/service.ts'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
  'src/server/main.ts'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
  'src/server/local-service/contracts.ts'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
  'src/server/local-service/input-validation.ts'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
  'src/server/local-service/loopback-api.ts'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
  'src/server/local-service/client-assets.ts'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
  'src/client/main.tsx'='<M105-ACCEPTED-GREEN-SHA256 copied from tuple>'
}
$m105ClosureTestHashes = [ordered]@{
  'tests/walking-skeleton.test.ts'='<M105-ACCEPTED-RED-TEST-SHA256 copied from tuple>'
  'tests/helpers/m105-walking-skeleton-harness.ts'='<M105-ACCEPTED-RED-HELPER-SHA256 copied from tuple>'
}
$m105ClosureProtectedHashes = [ordered]@{
  'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98'
  'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553'
  'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE'
  'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07'
  'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
}
$m105ClosureSourceTree = [pscustomobject]@{
  Entries=[int]'<M105-SOURCE-ENTRIES copied from tuple>'; Files=[int]'<M105-SOURCE-FILES copied from tuple>';
  Directories=[int]'<M105-SOURCE-DIRECTORIES copied from tuple>'; Bytes=[long]'<M105-SOURCE-BYTES copied from tuple>';
  Digest='<M105-SOURCE-DIGEST copied from tuple>'
}
$m105ClosureTestTree = [pscustomobject]@{
  Entries=[int]'<M105-TEST-ENTRIES copied from tuple>'; Files=[int]'<M105-TEST-FILES copied from tuple>';
  Directories=[int]'<M105-TEST-DIRECTORIES copied from tuple>'; Bytes=[long]'<M105-TEST-BYTES copied from tuple>';
  Digest='<M105-TEST-DIGEST copied from tuple>'
}
$m105ClosureRedLease = [pscustomobject]@{
  Id='M1-05-20260902-06-integration-red-01'; ContractDigest='<M105-RED-CONTRACT-DIGEST copied from tuple>';
  ReceiptDigest='<M105-RED-RECEIPT-DIGEST copied from tuple>';
  ReceiptFileHash='<M105-RED-RECEIPT-FILE-SHA256 copied from tuple>'
}
$m105ClosureGreenLease = [pscustomobject]@{
  Id='M1-05-20260902-06-integration-green-01'; ContractDigest='<M105-GREEN-CONTRACT-DIGEST copied from tuple>';
  ReceiptDigest='<M105-GREEN-RECEIPT-DIGEST copied from tuple>';
  ReceiptFileHash='<M105-GREEN-RECEIPT-FILE-SHA256 copied from tuple>'
}
Assert-M105FileHashes $m105ClosureProductionHashes 'Post-archive production'
Assert-M105FileHashes $m105ClosureTestHashes 'Post-archive accepted tests'
Assert-M105FileHashes $m105ClosureProtectedHashes 'Post-archive protected inputs'
Assert-M105TreeRecord (Join-Path $m105Repo 'src') $m105ClosureSourceTree 'Post-archive source tree'
Assert-M105TreeRecord (Join-Path $m105Repo 'tests') $m105ClosureTestTree 'Post-archive test tree'
$m105ClosureRedReceipt = Get-M105LeaseReceiptEvidence $m105ClosureRedLease.Id `
  $m105ClosureRedLease.ContractDigest $m105AcceptedTestPaths
$m105ClosureGreenReceipt = Get-M105LeaseReceiptEvidence $m105ClosureGreenLease.Id `
  $m105ClosureGreenLease.ContractDigest $m105ProductionPaths
if ($m105ClosureRedReceipt.Digest -cne $m105ClosureRedLease.ReceiptDigest -or
    $m105ClosureRedReceipt.FileHash -cne $m105ClosureRedLease.ReceiptFileHash -or
    $m105ClosureGreenReceipt.Digest -cne $m105ClosureGreenLease.ReceiptDigest -or
    $m105ClosureGreenReceipt.FileHash -cne $m105ClosureGreenLease.ReceiptFileHash) {
  throw 'Post-archive terminal receipt identity changed'
}

$m105ClosureAllowedPaths = @(
  'README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md','docs/PROJECT_CONCEPT.md',
  'docs/PROJECT_CONTEXT.md','docs/architecture/README.md','docs/architecture/CANDIDATE_ARCHITECTURE.md',
  'docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md',
  'docs/requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md','docs/plans/README.md',
  'docs/plans/m1-05-walking-skeleton-integration.md',
  'docs/plans/completed/m1-05-walking-skeleton-integration.md','docs/progress/README.md',
  'docs/progress/m1-05-walking-skeleton-integration.md'
) + $m105ProductionPaths + $m105AcceptedTestPaths
$m105ClosureRequiredPaths = @(
  'README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md','docs/plans/README.md',
  'docs/plans/m1-05-walking-skeleton-integration.md',
  'docs/plans/completed/m1-05-walking-skeleton-integration.md','docs/progress/README.md',
  'docs/progress/m1-05-walking-skeleton-integration.md'
) + $m105ProductionPaths + $m105AcceptedTestPaths
$m105Head = (& git rev-parse HEAD).Trim()
$m105Branch = (& git branch --show-current).Trim()
if ($m105Head -cne 'a9ccb01f19db386e82c5a00f163c6525b66cb9c0' -or
    $m105Branch -cne 'codex/m1-05-walking-skeleton-integration') { throw 'Closure Git endpoint changed' }
$m105Staged = @(& git diff --cached --name-only)
if ($LASTEXITCODE -ne 0 -or $m105Staged.Count -ne 0) { throw 'Closure Git index is not empty' }
$m105Status = @(& git -c status.renames=false status --porcelain=v1 --untracked-files=all)
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect closure worktree' }
$m105ChangedPaths = @($m105Status | ForEach-Object {
  if ($_.Length -lt 4) { throw 'Malformed closure Git status row' }
  $_.Substring(3).Replace('\','/')
} | Sort-Object -Unique)
foreach ($m105Changed in $m105ChangedPaths) {
  if ($m105ClosureAllowedPaths -notcontains $m105Changed) { throw ('Unexpected closure path: ' + $m105Changed) }
}
foreach ($m105Required in $m105ClosureRequiredPaths) {
  if ($m105ChangedPaths -notcontains $m105Required) { throw ('Missing required closure path: ' + $m105Required) }
}

$m105RoadmapText = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/DEVELOPMENT_ROADMAP.md'))
$m105TaskStatuses = @([regex]::Matches($m105RoadmapText,
  '(?m)^- \*\*Parent (?:milestone|gate) / role / status:\*\* [^\r\n]* / \*\*(Not started|In progress|Blocked|Complete)\*\*\.\r?$') |
  ForEach-Object { $_.Groups[1].Value })
if ($m105TaskStatuses.Count -ne 28 -or @($m105TaskStatuses | Where-Object { $_ -ceq 'Complete' }).Count -ne 8 -or
    @($m105TaskStatuses | Where-Object { $_ -ceq 'Not started' }).Count -ne 20 -or
    @($m105TaskStatuses | Where-Object { $_ -ceq 'In progress' -or $_ -ceq 'Blocked' }).Count -ne 0) {
  throw 'Roadmap task-status totals are not the M1-05 closure state'
}
$m105M105Block = [regex]::Match($m105RoadmapText,
  '(?ms)^### M1-05 — Integrate and verify the walking skeleton\r?\n.*?(?=^### |\z)').Value
if ($m105M105Block -notmatch '(?m)^- \*\*Parent milestone / role / status:\*\* M1 / integration and verification / \*\*Complete\*\*\.\r?$' -or
    $m105M105Block -notmatch 'plans/completed/m1-05-walking-skeleton-integration\.md') {
  throw 'Roadmap M1-05 block is not Complete with the archived plan'
}
$m105PlanIndex = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/plans/README.md'))
if ($m105PlanIndex -notmatch '\(completed/m1-05-walking-skeleton-integration\.md\).*\*\*Complete\*\*' -or
    $m105PlanIndex -match '\]\(m1-05-walking-skeleton-integration\.md\)') { throw 'Plan index is not archived/Complete' }
$m105ProgressIndex = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/progress/README.md'))
if ($m105ProgressIndex -notmatch '\.\./plans/completed/m1-05-walking-skeleton-integration\.md\) \| Complete \|') {
  throw 'Progress index does not mirror M1-05 Complete'
}
$m105ProgressRecord = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/progress/m1-05-walking-skeleton-integration.md'))
if ($m105ProgressRecord -notmatch '(?m)^- \*\*Mirrored roadmap status:\*\* Complete$' -or
    $m105ProgressRecord -notmatch '\.\./plans/completed/m1-05-walking-skeleton-integration\.md') {
  throw 'M1-05 progress record is not closed against the archived plan'
}
$m105CurrentOwners = @('README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md',
  'docs/PROJECT_CONCEPT.md','docs/PROJECT_CONTEXT.md','docs/architecture/README.md',
  'docs/architecture/CANDIDATE_ARCHITECTURE.md',
  'docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md',
  'docs/requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md','docs/plans/README.md','docs/progress/README.md')
$m105StalePattern = '(?i)M1-05 is In progress|HTTP (?:scan )?integration remains unimplemented|' +
  'service/scanner/UI wiring remains unimplemented|durable scan-to-disk integration; that remains M1-05|' +
  'Public HTTP/scan-to-disk integration and the public-page smoke remain M1-05|' +
  'wiring this callback into the service remains M1-05|M1-05 must preserve'
foreach ($m105Owner in $m105CurrentOwners) {
  $m105OwnerText = [IO.File]::ReadAllText((Join-Path $m105Repo $m105Owner))
  if ($m105OwnerText -match $m105StalePattern) { throw ('Stale M1-05 current-status text: ' + $m105Owner) }
}

function Get-M105MarkdownAnchors([string]$Path) {
  $m105Anchors = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
  $m105Counts = @{}; $m105Fence = ''
  foreach ($m105Line in [IO.File]::ReadAllLines($Path)) {
    if ($m105Line -match '^\s*(```+|~~~+)') {
      $m105Mark = $Matches[1].Substring(0,3)
      if (-not $m105Fence) { $m105Fence = $m105Mark } elseif ($m105Fence -eq $m105Mark) { $m105Fence = '' }
      continue
    }
    if ($m105Fence) { continue }
    foreach ($m105IdMatch in [regex]::Matches($m105Line,
        '<a\s+(?:[^>]*?\s)?(?:id|name)=["'']([^"'']+)["'']','IgnoreCase')) {
      [void]$m105Anchors.Add($m105IdMatch.Groups[1].Value)
    }
    if ($m105Line -notmatch '^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$') { continue }
    $m105Heading = [regex]::Replace($Matches[1],'!\[([^\]]*)\]\([^)]*\)','$1')
    $m105Heading = [regex]::Replace($m105Heading,'\[([^\]]+)\]\([^)]*\)','$1')
    $m105Heading = [regex]::Replace($m105Heading,'<[^>]+>','').ToLowerInvariant()
    $m105Slug = ([regex]::Replace($m105Heading,'[^\p{L}\p{M}\p{Nd}_\- ]','') -replace ' ','-')
    if (-not $m105Counts.ContainsKey($m105Slug)) { $m105Counts[$m105Slug]=0; $m105Anchor=$m105Slug }
    else { $m105Counts[$m105Slug]++; $m105Anchor="$m105Slug-$($m105Counts[$m105Slug])" }
    [void]$m105Anchors.Add($m105Anchor)
  }
  return ,$m105Anchors
}
$m105Markdown = @(@(& git ls-files -- '*.md') + @(& git ls-files --others --exclude-standard -- '*.md') |
  Sort-Object -Unique | Where-Object { Test-Path -LiteralPath (Join-Path $m105Repo $_) })
$m105AnchorCache = @{}; $m105Broken = [Collections.Generic.List[string]]::new()
[int]$m105LinkCount=0; [int]$m105FragmentCount=0; [int]$m105PowerShellCount=0
$m105StrictUtf8 = [Text.UTF8Encoding]::new($false,$true)
foreach ($m105Relative in $m105Markdown) {
  $m105Source = Join-Path $m105Repo $m105Relative
  $m105Bytes = [IO.File]::ReadAllBytes($m105Source)
  try { $m105Text = $m105StrictUtf8.GetString($m105Bytes) } catch { throw ('Invalid UTF-8: ' + $m105Relative) }
  if (-not $m105Text.EndsWith("`n") -or $m105Text -match '(?m)[ \t]+\r?$') {
    throw ('Markdown newline or trailing-whitespace failure: ' + $m105Relative)
  }
  if ($m105ChangedPaths -contains $m105Relative) {
    foreach ($m105Block in [regex]::Matches($m105Text,'(?ms)^```powershell[^\r\n]*\r?\n(.*?)^```\s*$')) {
      $m105Tokens=$null; $m105Errors=$null
      [void][Management.Automation.Language.Parser]::ParseInput($m105Block.Groups[1].Value,
        [ref]$m105Tokens,[ref]$m105Errors)
      if ($m105Errors.Count) { throw ('PowerShell example parse failure: ' + $m105Relative) }
      $m105PowerShellCount++
    }
  }
  $m105Fence=''; $m105LineNumber=0
  foreach ($m105Line in [IO.File]::ReadAllLines($m105Source)) {
    $m105LineNumber++
    if ($m105Line -match '^\s*(```+|~~~+)') {
      $m105Mark=$Matches[1].Substring(0,3)
      if (-not $m105Fence) { $m105Fence=$m105Mark } elseif ($m105Fence -eq $m105Mark) { $m105Fence='' }
      continue
    }
    if ($m105Fence) { continue }
    foreach ($m105Link in [regex]::Matches($m105Line,
        '!?\[[^\]]*\]\((?<target><[^>]+>|[^)\s]+)(?:\s+["''][^"'']*["''])?\)')) {
      $m105Target=$m105Link.Groups['target'].Value.Trim('<','>')
      if ($m105Target -match '^[A-Za-z][A-Za-z0-9+.-]*:') { continue }
      $m105LinkCount++; $m105Parts=$m105Target -split '#',2
      $m105PathPart=[Uri]::UnescapeDataString($m105Parts[0])
      $m105Fragment=$(if($m105Parts.Count -eq 2){[Uri]::UnescapeDataString($m105Parts[1])}else{''})
      $m105TargetPath=$(if([string]::IsNullOrEmpty($m105PathPart)){$m105Source}else{
        [IO.Path]::GetFullPath((Join-Path (Split-Path $m105Source -Parent) $m105PathPart))})
      $m105RepoPrefix=$m105Repo.TrimEnd('\')+'\'
      if (-not $m105TargetPath.StartsWith($m105RepoPrefix,[StringComparison]::OrdinalIgnoreCase) -or
          -not (Test-Path -LiteralPath $m105TargetPath)) {
        $m105Broken.Add("$m105Relative`:$m105LineNumber missing $m105Target"); continue
      }
      if ($m105Fragment) {
        $m105FragmentCount++; $m105Key=$m105TargetPath.ToLowerInvariant()
        if (-not $m105AnchorCache.ContainsKey($m105Key)) {
          $m105AnchorCache[$m105Key]=Get-M105MarkdownAnchors $m105TargetPath
        }
        if (-not $m105AnchorCache[$m105Key].Contains($m105Fragment)) {
          $m105Broken.Add("$m105Relative`:$m105LineNumber fragment $m105Target")
        }
      }
    }
  }
}
if ($m105Broken.Count) { throw ('Broken Markdown targets: ' + ($m105Broken -join '; ')) }
$m105RequiredSections = @('Progress','Surprises & Discoveries','Decision Log','Outcomes & Retrospective',
  'Purpose / Big Picture','Context and Orientation','Scope and Non-Goals','Plan of Work','Concrete Steps',
  'Validation and Acceptance','Idempotence and Recovery','Artifacts and Notes','Interfaces and Dependencies','Revision Note')
$m105ArchivedText = [IO.File]::ReadAllText($m105ArchivedPlan)
foreach ($m105Section in $m105RequiredSections) {
  if ($m105ArchivedText -notmatch ('(?m)^## ' + [regex]::Escape($m105Section) + '$')) {
    throw ('Archived plan missing section: ' + $m105Section)
  }
}
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'git diff --check failed at documentation closure' }
[pscustomobject]@{ MarkdownFiles=$m105Markdown.Count; Links=$m105LinkCount;
  Fragments=$m105FragmentCount; ParsedPowerShellBlocks=$m105PowerShellCount;
  ChangedPaths=$m105ChangedPaths.Count; RoadmapComplete=8; RoadmapNotStarted=20 }
```

## Concrete Steps

Work from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`.

The four structural slices, their corrections, and the App dead-state cleanup are complete. Execute only the two remaining checkpoints above.

1. Recheck M1-05 `In progress`, M1-02/M1-03/M1-04 `Complete`, and the plan-review verdict. After PASS only, the primary runs `M105-CMD-PREP` and `Assert-M105PlanningIdentity`; that executable gate requires the exact HEAD, branch, plan-only worktree path, empty index, absent active lease, whole source/test tree identities, five protected build inputs, retained runtime/executable/marker identities, and generated-path absence. The primary then runs `M105-CMD-PREFLIGHT-SETUP`, records the three created ignored empty roots, and stops on drift or an unresolved finding.
2. Create Milestone Assignment Packet v2 for `M105-WALKING-SKELETON-INTEGRATION-06`, filling every field including the responsibility/cohesion map, exact two-file Red scope, exact seven-file Green scope, forbidden test/component/style/configuration paths, commands, side effects, evidence identities, budget, and stops.
3. Send the packet with `Lease ID: None` to one persistent `test_worker` for read-only preflight. In a fresh shell it runs `M105-CMD-PREP` and exactly `M105-CMD-PREFLIGHT`; the block asserts the planning identity before and after, records separate counts/exits/identities, and proves zero net build/cache/scratch residue. Accept only `MISSING`, or a primary-reconciled `PARTIAL` whose missing boundary remains exactly the frozen same-origin integration outcome.
4. Start attempt-1 Red lease `M1-05-20260902-06-integration-red-01` for only `tests/walking-skeleton.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts`, insert and verify the guard digest, and let the same test worker add the smallest complete controlled matrix. Terminally close the lease and accept Red only when the failure is caused by the absent production route/static/client wiring and all existing environment checks pass. Before any other write, run the exact Red receipt/path/test-hash block, freeze its literals in this plan, fingerprint the Red build, and remove only that recognized build.
5. Freeze the accepted two-file test boundary. Start separate attempt-1 Green lease `M1-05-20260902-06-integration-green-01` for only the seven named production paths, explicitly forbid the accepted tests plus all UI components/styles and executable configuration, insert and verify the digest, and assign one `code_worker` to reach minimum Green. The worker may perform only the permitted local Refactor and must return a cohesion disposition.
6. Terminally close the Green lease. Inspect the actual diff, request/result boundaries, static response table, imports, runtime calls, lifecycle and persistence ownership, unchanged tests, absence of provider paths, focused result, and cohesion disposition before accepting Green. Before plan maintenance or another command, run `M105-CMD-GREEN-EVIDENCE`; require fresh guard status and freeze its single source/test/protected-input/build/runtime/receipt object as `M105-ACCEPTED-GREEN-TUPLE-001`. Populate the one reusable assertion block from that object without recapturing later state.
7. In a fresh shell run `M105-CMD-PREP`, the populated reusable tuple block, and `M105-CMD-COMPLETE`: strict TypeScript, changed-file syntax, each of the six backend/scanner/integration files sequentially, the unchanged 30-case UI suite separately, asset-route checks, test-relevance audit, and the same tuple assertion before and after. Record exact commands and counts. Retain the identity-frozen build and empty scratch roots for the later smoke; any failure or stale/mutable evidence stops.
8. Obtain a fresh S3 `critical_reviewer` verdict for the slice. Apply at most one supported same-contract correction through the original role, scope, phase, and attempt-2 lineage; a changed contract or unresolved finding stops.
9. Update this plan and the M1-05 progress record only after the controlled integration checkpoint is accepted. Copy the already frozen tuple literals; do not recapture or replace its seven production, two test, protected-input, build, runtime, or receipt identities. Primary-owned documentation changes occur between leases; no worker edits evidence or authority documents.
10. Obtain the exact owner-authorized public target and disposable-run declaration, then run `M105-TRUSTED-PUBLIC-SMOKE-07` once through `M105-CMD-PUBLIC-SMOKE`. Both shells assert the same accepted Green tuple before execution; after clean stop, assert it again. Record only content-safe observational evidence, validate the aggregate through HTTP and disk, freeze the exact smoke/build/runtime/sibling-set identities, and retain the aggregate and build.
11. Audit every test/helper/mock/fixture/skip/focus marker; reconcile README developer instructions and every affected authority/status/navigation statement into a review-ready, still-`In progress` state; and recheck source, build, aggregate, sibling-set, browser, scratch, Git, and guard identities. Populate the documentation-closure production, test, protected-input, source-tree, test-tree, and Red/Green receipt literals by byte-for-byte copy from `M105-ACCEPTED-GREEN-TUPLE-001`, and populate its smoke literals from `M105-SMOKE-RETAINED-001`; do not recapture later state. Do not remove any reviewed artifact yet.
12. Obtain a different fresh integrated `critical_reviewer` verdict because critical HTTP/persistence/identity/deletion surfaces remain in the final state. The reviewer must inspect the actual retained smoke aggregate, controlled evidence, build, current worktree, documentation, and exact final-cleanup literals. An unresolved finding stops; a source/test correction invalidates the affected evidence and requires the applicable workflow replay.
13. Only after PASS, run the accepted Green tuple assertion and `M105-CMD-FINAL-CLEANUP`: delete the one declared smoke run, verify all pre-existing run identities unchanged, remove only the exact owned build and empty scratch roots, and verify the retained browser and both forbidden Vite-cache paths. Next update every affected README/developer instruction and authority/status statement, set the roadmap row to Complete, move this plan to `docs/plans/completed/`, repair the plan/progress/documentation links, and record the final progress closure. Only after those mutations, run `M105-CMD-PREP` from the archived plan and exact `M105-CMD-DOCUMENTATION-CLOSURE`; it reasserts the frozen seven production files, two accepted test files, whole source/test trees, five protected inputs, and both terminal receipt identities while requiring the reviewed build to remain absent, then validates the archived path, generated state, sibling/runtime identity, allowed/required Git paths, empty index, 8/20 roadmap totals, status mirrors, stale current prose, all current Markdown links/fragments/UTF-8/newlines/whitespace, every changed PowerShell example, required plan sections, and `git diff --check`. Declare M1-05 closed only when that post-change block passes; otherwise preserve the visible incomplete closure diff for correction. Commit and push remain separate owner-authorized actions.

## Validation and Acceptance

Accept `M105-LOCAL-SERVICE-MODULE-REFACTOR-01` only when:

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

Accept `M105-RUN-CONTRACT-MODULE-REFACTOR-03` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and the 30 static contract cases execute 58 passing TAP tests unchanged;
- the public façade exports exactly the current seven public types and two runtime validators, and every current consumer continues importing from the same path;
- exact values, key requirements, safe-inspection behavior, bounded errors, immutability, ordering, coverage, identity, chronology, cleanup, and failure semantics remain unchanged;
- every policy tuple exported between internal modules is frozen and has no mutable backing alias;
- only the seven allowed production paths change and the internal import graph is acyclic and points from coordinators to lower validation layers;
- strict TypeScript, seven syntax checks, the 30 focused cases, all 290 backend/scanner cases, and the production build pass;
- scanner scratch and generated build output are removed, protected inputs are unchanged, and the implementation worker reports cohesion `REFACTORED` with primary acceptance;
- fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves the canonical aggregate and public behavior, and does not complete M1-05.

The 30 static contract cases and their 28 generated concealed-array-extension cases receive the same relevance audit. The expected outcome is no change: all 58 TAP tests remain behavior-oriented through the stable façade, with no file-layout assertions, snapshots, skipped cases, todos, or focused-only markers added.

Accept `M105-RUN-REPOSITORY-MODULE-REFACTOR-04` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and all 55 repository cases pass unchanged;
- the façade preserves the current seven public types and `openRunRepository`, and every current production/test consumer continues importing through it;
- Windows path admission, exact spelling, collision handling, topology and filesystem identity, validation and error precedence, transition rules, serialization, publication ordering, interruption behavior, canonical-byte preservation, and cleanup truthfulness remain unchanged;
- the default `node:fs` value object remains the call surface in every module that performs filesystem operations, and staged publication state remains inside `openRunRepository`;
- only the five allowed production paths change, with no test, fixture, dependency, configuration, persisted-format, generated-output, or Git-state drift;
- strict TypeScript, five syntax checks, all 55 focused cases, and all 290 backend/scanner cases pass, with empty scanner scratch and unchanged retained browser runtime;
- the implementation worker reports cohesion `REFACTORED`, primary inspection accepts it, and fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves ADR-0021 and completed M1-02 semantics, and does not complete M1-05.

The repository tests receive the same relevance audit. The expected outcome is no change: all 55 cases remain behavior-oriented through the stable façade, with real filesystem and process-interruption coverage and no file-layout assertions, snapshots, skipped cases, todos, or focused-only markers added.

Accept `M105-APP-DEAD-STATE-CLEANUP-05` only when:

- independent preflight returns `EXISTING_AND_COVERED` for all 30 unchanged browser cases;
- the only production diff removes the declaration and two setter calls for `pendingAnalysis`;
- `App`, `AppProps`, `AnalyzeIntent`, orchestration state, lifecycle ordering, rendered output, focus, announcements, and accessibility behavior remain unchanged;
- all 30 focused browser cases, strict TypeScript, production build, and the complete sequential 290 plus 30 regression pass;
- tests, harness, components, admission, styles, dependencies, configuration, and retained browser runtime remain unchanged;
- scanner/UI scratch, `dist/client`, repository-root `.vite-temp`, and `node_modules/.vite-temp` are absent after exact cleanup;
- the worker and primary report cohesion `RETAINED`, fresh S1 review returns PASS with no unresolved finding, and documentation records that M1-05 remains In progress.

Accept `M105-WALKING-SKELETON-INTEGRATION-06` only when:

- read-only preflight returns `MISSING`, or primary-reconciled `PARTIAL`, for exactly the absent same-origin production integration while the current toolchain, existing source, 182 browser-free cases, scanner boundary, and UI boundary remain healthy;
- the guarded two-file Red proves the complete controlled matrix and fails specifically on missing production behavior before any Green write;
- the guarded Green changes only the seven named production paths, leaves the accepted test boundary byte-identical, and introduces no dependency, executable-configuration, fixture, schema, scanner-policy, repository-format, component, style, or product-copy change;
- API-only construction preserves the current read-only behavior byte-for-byte at the JSON value boundary—health `scan: false`, every POST 405, no body consumption, and unchanged read routing—while only a successfully loaded configured client enables `POST /api/runs` and truthful health `scan: true`;
- configured `POST /api/runs` admits only the exact media type and target-plus-mode JSON, settles aborted/error streams once without a run effect, derives all other context on the service side, maps the frozen statuses and existing outcome body, and preserves method/query/health/stopping/API/static/socket precedence;
- the production start path validates the absolute ordinary closed client root before repository/listener effects, reports `client-unavailable` rather than readiness for every frozen invalid build topology, and serves only the exact built entry and finite direct asset table with fixed MIME types and no request-path filesystem access;
- the built client enables the existing Analyze path through same-origin fetch while every M1-04 component, visible state, focus rule, announcement, validation message, omission, and responsive/accessibility contract remains unchanged;
- controlled Local nonzero/multi-finding/native-incomplete, Groq valid-zero, and visible navigation-failure lanes each traverse the actually served browser form, same-origin fetch, exact HTTP intake, real intercepted `executeScan`, service-owned persistence, response admission, and the existing Results/failure presentation; representative malformed input, request-stream failure, contention, startup failure, stop, validated reads, cleanup, sibling preservation, and exact deletion pass at their direct owning boundaries;
- scan execution makes no provider request, browser code gains no privileged authority, raw page/native/network content enters neither the aggregate nor tracked evidence, and the exact-three-rule/fresh-context/top-level/no-interaction/no-download boundaries remain true;
- strict TypeScript, changed-file syntax, native production build, the complete backend/scanner/integration suite, and all 30 unchanged UI cases pass with zero failure, cancellation, skip, todo, or focused-only marker; final exact counts are recorded;
- the implementation worker reports `RETAINED` or `REFACTORED` with exact responsibility-fit evidence, primary inspection accepts both behavior and placement, and a fresh S3 review returns PASS with no unresolved finding; and
- scanner/UI/integration scratch is empty, both `.vite-temp` paths remain absent, and exact build/runtime identities are retained unchanged through the slice review and public smoke; final task cleanup later removes only the reviewed build and empty scratch while preserving the retained browser runtime, dependencies, fixtures, manifests, unrelated data, and user work; and
- after every final authority, status, navigation, progress, and archive mutation, the closure command reasserts the frozen production/test/protected-input/tree/lease-receipt identities without the intentionally deleted build before M1-05 may be marked closed.

The test-relevance audit must confirm that the new integration tests prove only cross-boundary behavior, while the existing contract, repository, service, scanner, and UI suites continue owning their lower-level matrices. Do not duplicate all validation permutations in the browser, assert private module layout, snapshot native payloads, weaken existing cases, or retain a helper that merely wraps one call.

Accept `M105-TRUSTED-PUBLIC-SMOKE-07` only when:

- the owner supplied exactly one permitted, trusted, non-sensitive public HTTPS target and declared the generated smoke run disposable before execution;
- the native production build and developer-started service report readiness, the developer opens the enumerated loopback URL manually in installed Chrome or Edge, and one Analyze action completes through the real managed scanner with all three rules covered;
- the accepted UI visibly presents normalized page identity, result overview/details as applicable, native incomplete items separately when present, and the non-certification limitation without exposing run/scanner/provider internals, a Run ID, or reopen control;
- the canonical `run.json` validates through the application-owned boundary, contains the complete minimized result and no prohibited raw material, and no provider is invoked;
- the service and managed browser resources stop cleanly and all owned scratch is empty;
- the exact aggregate, build, browser, application-revision, environment-name, and pre-existing-run-set identities are frozen and remain present and unchanged through the different final integrated review; and
- only after that review returns PASS, the exact declared run directory is removed and absent, every pre-existing run identity remains unchanged, and the controlled integration lane remains the mandatory sibling-preservation proof. No target content or private result is copied into tracked documentation.

Mark M1-05 Complete only when both remaining checkpoints pass, every earlier accepted slice remains valid, the full closure suite passes from clean owned state, a different fresh integrated critical review inspects the retained aggregate/build and returns PASS, post-review exact deletion/generated cleanup passes, and the documentation gate reconciles the roadmap, README developer instructions and status, plan/progress indexes, this plan, and affected authority navigation. M2-01 remains blocked until that exact closure.

## Idempotence and Recovery

Read-only inspection and verification commands are safe to repeat after confirming no owned processes or test residue remain. The extraction is additive except for moved declarations inside `service.ts`; a stopped worker must not be reset or reverted automatically. Close the lease, inspect the actual five-path state, preserve unrelated work, and issue at most one fresh attempt-2 packet with the same scope and terminal attempt-1 parent when the correction remains inside the frozen contract.

For the run-contract slice, the extraction is additive except for declarations moved from the façade. A stopped worker must preserve the seven-path state; the primary closes the lease, inspects exact exports and dependencies, and may issue one attempt-2 packet only for the same frozen contract. A cycle, public-boundary drift, validation change, mutable policy, or need for another path requires reconciliation rather than automatic continuation.

For the run-repository slice, the extraction is additive except for declarations moved from the façade. A stopped worker must preserve the five-path state; the primary closes the lease, inspects exact exports, filesystem imports, publication placement, and focused behavior, and may issue one attempt-2 packet only for the same frozen contract. Public-boundary drift, changed error or cleanup precedence, movement of publication state, or need for another path requires reconciliation rather than automatic continuation.

For `M105-WALKING-SKELETON-INTEGRATION-06`, every Red or Green write stops at lease closure. Preserve a compliant partial tree and inspect it; never reset or revert user or worker changes automatically. A same-contract correction is permitted once per role only with the identical work-slice contract, phase, path scope, commands, responsibility map, and terminal attempt-1 parent. A new route, status model, component/style change, dependency, asset-serving strategy, request-bound framework, persisted field, scanner policy, or production path changes a binding field and requires a reconciled packet before any write.

Build output and integration scratch are disposable, but cleanup is exact and evidence-backed. Before removing anything, resolve its absolute path inside this workspace, verify ordinary non-link topology and task ownership, and use the narrowest target. Never remove `node_modules`, `m104-browser-runtime`, a shared Playwright cache, `data/runs` as a root, an unrecognized run, or any pre-existing sibling. If a test or smoke leaves a browser/service process, uncertain cleanup, staged file, active lease pointer, or unclassified run directory, stop; preserve the evidence and obtain owner direction rather than hiding it.

The public smoke is not retried automatically. A target/network mutation failure is recorded as non-reusable observation, the service is stopped and task-owned residue is reconciled, and the primary requests one owner-directed target replacement at most. A product defect returns to the already bounded implementation correction route only if the accepted contract and path scope remain unchanged; otherwise execution stops for replanning.

An unexpected file, changed accepted test during Green, Git mutation, public API drift outside the frozen additions, behavior difference, active-resource leak, or need for shared lifecycle state outside `service.ts` freezes writes. The primary reconciles the tree and this plan before any new assignment. No worker stages, commits, pushes, changes refs, stashes, worktrees, remotes, repository configuration, or hooks.

## Artifacts and Notes

Retain in this plan only the accepted preflight identity and result, Red and Green lease/digest/receipt identities, the single accepted Green tuple, exact changed paths, focused/strict/syntax/full results, cohesion disposition, reviewer verdict, and any bounded correction lineage. Guard runtime records remain ignored workflow state and are not copied into tracked documentation.

For the controlled integration checkpoint, retain the exact two test hashes, seven production hashes, complete source/test-tree identities, five protected inputs, both terminal receipt identities, focused and sequential command/count results, build/runtime identities, request/asset boundary audit, empty-scratch proof, cohesion disposition, and S3 verdict as the single `M105-ACCEPTED-GREEN-TUPLE-001`. For `M105-SMOKE-RETAINED-001`, retain only the content-safe run ID and `run.json` hash, application/source/build/browser/environment-name identities, mode, date, terminal status, exact rule-coverage names, item counts, validator/read/stop/cleanup results, pre-existing-run-set digest, and final-review verdict. Never retain the public target, redirect, page title/content, Finding/evidence values, raw response, terminal transcript, or secret. The aggregate itself remains local and reviewable only until the post-review exact deletion.

Planning baseline `M105-INTEGRATION-PLAN-BASELINE-002` was captured before this documentation edit at clean HEAD `a9ccb01f19db386e82c5a00f163c6525b66cb9c0` on branch `codex/m1-05-walking-skeleton-integration`. Node reported `v24.20.0`; independent strict TypeScript passed; and `node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts` passed 182/182 with zero failure, cancellation, skip, or todo. The whole source tree was 51 entries / 147,831 bytes / `8960366EC4E34C2C3649C44D7FDED9077AA28EFA90E456FE350988FA735C7A21`; the whole test tree was nine entries / 317,970 bytes / `B96EC7A3DB35396475C5485180D880BB5F36DCC3F19DA475E9D811BFE1216840`. `dist/client`, `temp/m103-scan`, `temp/m104-ui`, `temp/m105-integration`, repository-root `.vite-temp`, and `node_modules/.vite-temp` were absent; `data/runs` was an ordinary empty directory. The retained `m104-browser-runtime` exact command identity was 332 entries, 318 files, 14 directories, 451,193,922 bytes, digest `4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC`, with the marker and executable identities frozen under `M105-CMD-PREFLIGHT-SETUP`. Protected identities were `package.json` `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98`, `package-lock.json` `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`, `tsconfig.json` `3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde`, `vite.config.ts` `8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07`, and `index.html` `91bef948d015f0e084708fdecfb79f765437b439d76b1ed70af55580d815dc88`. This proves planning readiness only; it is not Red, Green, browser, public-network, or task-completion evidence.

Current integration-surface identities at that baseline were `service.ts` `5f36e64d1abd7605625778599e05bff1291c72f624652f4ab093b2244a262bdf`, `contracts.ts` `11658bf1dfb290aebb7badb5de4e2fd1c720799e58663705040db999dbc9a017`, `input-validation.ts` `797f39aad74860cc4b8e4ce632ca7e90ff3d629b5a744ece376cd50b599fb8ee`, `loopback-api.ts` `d8a7f50102a992fa5a9d3847d87563f2f213e3aa005cde24934f27c35b5a73d1`, `scan-page.ts` `ae5a1885f2fbe3579ca8fb5172d43f0543e849bd662747f0e0fa9c4a52307e1d`, `main.tsx` `e06da9c28bcb3c3a27254a21031d312ef217c10c53bb152edeea7975a27a666a`, `App.tsx` `ccad5872446bdcc9099b9e527ee6c162c3c52a6bf87e26eb766db557fc1ff7be`, `local-service.test.ts` `b9aa1dc1fb6ec5c9dba3e5937de761eb91edeb913cdc93a5989e934ef79aab89`, and `target-results-ui.test.ts` `997f1fcce1c51ca74637ae74ff84dbe4b05786a26c897dc0cbef687c5c48914e`. Preflight must reassert the exact relevant tree and environment before and after its commands; the planning hashes do not waive fresh evidence.

Accepted preflight `M105-RUN-REPOSITORY-MODULE-REFACTOR-04-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/run-repository.test.ts` at HEAD `d30c5616342cb92999772250b36f31fb0341f657`: 55 tests passed with zero failures, cancellations, skips, or todos. Source and test identities remained `run-repository.ts` `58ced192be1386e8052f370a12d0bd3b68858dab7127a2843b1652cda74c0625` and `run-repository.test.ts` `20629f51635028cad097831e2d653c41a25aaadfd79458232d8b2dea45263e73`; the domain façade, service, package, lockfile, and TypeScript configuration also retained their recorded identities. The worker independently mapped stable exports and consumers, immutable round trips, schema/ID/transition/error precedence, Windows root and topology protection, repeated identity checks, short-write and flush/close/rename ordering, every staged-write and cleanup fault, canonical-byte preservation, commit-point behavior, and actual child interruption immediately before and after rename. No test write or artificial Red is needed. Two initial fingerprint probes guessed absent paths and exited without changing repository state; corrected inspection used the actual domain façade and npm lockfile.

Accepted Green/Refactor assignment `M105-RUN-REPOSITORY-MODULE-REFACTOR-04-GREEN-01` used lease `M1-05-20260902-04-run-repository-refactor-green-01`, guard digest `f1a8f7d4dbf3884ba66c11f61387c3ac8065f2148dd8b35a032071e8190e2c41`, and fresh compliant receipt `0026f50a4464d7eb23e0c4ed7f56598baa090613a7f60a7c04e33f82bd3e468c`. It modified only `src/server/persistence/run-repository.ts` and created the four approved files under `src/server/persistence/run-repository/`; no test, fixture, dependency, configuration, unrelated source, index, HEAD, branch, or ignore-control drift occurred. The first focused Green run passed 3 and failed 52 because the initial extraction omitted the `ordinaryDirectory` façade import; the worker corrected that same-scope extraction defect within the same lease, and the final focused run passed all 55. Both worker and primary inspection accept cohesion as `REFACTORED`: the façade retains all captured repository/publication/cleanup state, while the four modules own only their declared responsibilities. Current production identities are `run-repository.ts` `0440ac6ed5ede1445b4ffaeeea3b525ef0fe63fc9f4b88cf69bd136d9f41816a`, `contracts.ts` `7b0511655d8b7b20e97823b6a10fdf5aa567bb9320fe9c7fd9ae9215f178394d`, `store-errors.ts` `4c0b21dccc864df7c59fe0f13f4380e67ba5f9632bba6cedebac220ef8bf987d`, `windows-run-paths.ts` `391cfd03d57e82ecdada07d5c0c398a9f14d17a0ed2fe9d14a827b9896e360d0`, and `run-transition.ts` `b844ddfce3c52e9848376c3f9bbec06b676dfe4897987e183186eea9d9807466`.

Post-Green verification passed all 55 focused repository tests and all 290 complete backend/scanner tests with zero failure, cancellation, skip, or todo. Strict TypeScript and five syntax checks passed. Runtime façade inspection found exactly `openRunRepository`; static consumer inspection found no external deep import. Both filesystem-calling modules retain the shared default `node:fs` object, the complete publication state remains inside `openRunRepository`, and no filesystem operation follows successful rename. The test, package, lockfile, and TypeScript-configuration hashes remain unchanged. Scanner scratch was empty and removed, the retained Chromium inventory remained at 331 entries, and `dist/client` and repository-root `.vite-temp` were absent. That cleanup probe did not inspect `node_modules/.vite-temp`; the corrected generated-output evidence is recorded below.

Fresh review `M105-RUN-REPOSITORY-MODULE-REFACTOR-04-REVIEW-01` returned PASS with no Blocker, Major, or Minor production finding and accepted cohesion as `REFACTORED`. The reviewer independently passed all 55 focused repository tests, strict TypeScript, five syntax checks, exact runtime-export inspection, and external-import inspection. It confirmed Windows drive-absolute and reserved-name admission, exact spelling and collision handling, repeated real-path and filesystem-identity checks, link/junction/hard-link rejection, short-write/flush/close/rename ordering, canonical-byte preservation, bounded cleanup ownership, truthful `cleanupFailed`, error precedence, shared default-`node:fs` interception, and the retained stateful publication coordinator. Reviewed production identities matched the accepted Green and exact-identity 290-case regression evidence; the lease receipt remained compliant and the retained Chromium runtime remained intact. Its generated-output conclusion relied on the incomplete cleanup probe above and was superseded by the owner-supplied P3 cleanup review. Final documentation validation resolved 517 relative-link targets across ten changed documents with zero broken target, reconciled every current task-status statement, and passed `git diff --check`. Accepted limitations remain ordinary local Windows filesystem operation without guarantees against malicious same-user races, concurrent writers, operating-system or power loss, storage-filter stalls, or abandoned-stage recovery. No requirement, ADR, public contract, persistence format, test, dependency, or product-authority change is required because this slice preserves the accepted behavior and boundary.

Owner-supplied follow-up review returned REVISE for cleanup evidence only after finding the ordinary empty directory `node_modules/.vite-temp`; it found no persistence source defect, and strict TypeScript, five syntax checks, runtime exports, diff checks, and production/test identities remained accepted. Primary correction resolved the exact absolute target inside the workspace, verified it was an ordinary directory with no link type and zero children, removed only that directory without recursion, and then verified `Test-Path` returned `False` for both `node_modules/.vite-temp` and repository-root `.vite-temp`. Correction documentation validation resolved seven relative-link targets across the two changed documents with zero broken target and passed `git diff --check`. No source, test, dependency, fixture, configuration, persistence, browser-runtime, or Git metadata changed. This exact cleanup and corrected evidence supersede every earlier unqualified `.vite-temp`-absence claim in this plan.

Accepted preflight `M105-RUN-CONTRACT-MODULE-REFACTOR-03-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/run-contract.test.ts` at HEAD `eb408882fad215b72ca6f6cbc9f8730a3050f145`: the 30 static cases and 28 generated concealed-array-extension cases produced 58 passes, zero failures/cancellations/skips/todos, and 415.943 milliseconds duration. Source and test identities remained `run-contract.ts` `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e` and `run-contract.test.ts` `e97aac5b0e77bda74381a44c3052637d4d46e05e166bc9f6be4495df6b4130c4`. The worker classified `EXISTING_AND_COVERED`; no test write or artificial Red is needed.

Accepted Green/Refactor assignment `M105-RUN-CONTRACT-MODULE-REFACTOR-03-GREEN-01` used lease `M1-05-20260902-03-run-contract-refactor-green-01`, guard digest `b6dfb54651215e5772038e2b0214fc7dad52fde22acfac9180c3bb896872ad26`, and compliant close receipt `88f5727fc0dbb38105ec90811ac8a8e5ae9251780b690213b032257e2857979a`. It modified only `src/server/domain/run-contract.ts` and created the six approved files under `src/server/domain/run-contract/`; no test, dependency, fixture, executable configuration, unrelated source, index, or Git reference changed. The implementation worker reported cohesion `REFACTORED`, and primary inspection accepted the façade, responsibility placement, and acyclic import direction. Current production identities are `run-contract.ts` `0546bd5586145fc3a5e653e189630559ac6399477a7f28bc1ff7a5a9acee8707`, `run-types.ts` `ca5cf83a234d814cd59bdac14058aa8d6ce25d51c201c2576f3c91aa87bc2131`, `run-policy.ts` `0123e4118cc424b3cdb3e58138e1b9eef24cfeee92e6d4399e75f4e7c1e4b969`, `contract-value-reader.ts` `1ffd1c19fda7cd17fc8cb942e16c2dbdbc5fa93403ea9746f8cb59438ceb51b9`, `finding-validation.ts` `a7e693ea43a0557ea2c75937ec90a3fee9ac96f2e1b822f40f1618ce548ae6fe`, `scan-validation.ts` `7bf5dab81ca4a9f1f7d530d47fb40e9dc0c768b167b2eb5ddba3578894b9f648`, and `run-validation.ts` `3491f707d4932106df0f3124f2a9dfc47fac14bf44928536ec6e338369083004`.

Post-Green verification passed 58 of 58 focused TAP tests and 290 of 290 complete backend/scanner tests with zero failure, cancellation, skip, or todo. Strict TypeScript, syntax checks for all seven production modules, and the native Vite production build passed. Runtime inspection found exactly `validateRun` and `validateScan` on the public façade. A process-isolated probe found all 16 exported internal policy arrays frozen, rejected mutation of each, and retained every value. Static import inspection found no dependency cycle. `tests/run-contract.test.ts`, `package.json`, `package-lock.json`, and `tsconfig.json` retained their accepted identities. Repository-owned scanner scratch and generated `dist/client` output were removed after verification; the contemporaneous check found repository-root `.vite-temp` absent but did not inspect `node_modules/.vite-temp`. The exact cleanup correction above supersedes that incomplete cache-location evidence. Fresh S3 review remains the acceptance barrier at this historical checkpoint.

Fresh review `M105-RUN-CONTRACT-MODULE-REFACTOR-03-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`. The reviewer independently passed all 58 focused tests, strict TypeScript, seven syntax checks, exact runtime-export inspection, frozen-policy and privacy probes, a deep walk of 92 frozen returned containers, 1,076 deterministic old-monolith versus extracted-validator comparisons, and an exact 216-event proxy inspection-order comparison with zero property-get traps. The reviewed production and protected-input identities matched the accepted Green and complete-regression/build evidence; the lease remained compliant, scanner scratch and `dist/client` were absent, the retained browser runtime remained intact, and M1-05 remained In progress. Its `.vite-temp` conclusion depended on the root-only probe and is superseded by the exact cleanup correction above. No requirement, ADR, public-contract, persistence-format, test, dependency, or product-authority change is required because this slice preserves the accepted behavior and boundary.

Accepted preflight `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/local-service.test.ts` under Node 24.20.0 at HEAD `696042e664d27de83f65a7d8a680f0388b541486`: 69 passed, zero failed/cancelled/skipped/todo. Frozen source/test identities are `service.ts` `3502789d6edea78d93e2659f8731e7ff060f9c897b77bc667be45a0127a78c1f`, `local-service.test.ts` `b9aa1dc1fb6ec5c9dba3e5937de761eb91edeb913cdc93a5989e934ef79aab89`, `main.ts` `854b90af5dd4f94c0144ab8a96369f28f360aa48661c5be044b831b13782ee39`, and `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`. No file changed and no test resource remained.

Accepted Green/Refactor assignment `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-01` used lease `M1-05-20260902-01-service-refactor-green-01`, guard digest `9efe09e53ddad00e848930856bcd30e5efff3b38c41a7cccb2d4c6bea3d517d8`, and compliant close receipt `d2f2a365f842d6c609ad961267342bdc96010791e98bb5732d7df8731a638d25`. It changed only `src/server/service.ts` and created `src/server/local-service/contracts.ts`, `input-validation.ts`, `scan-run-records.ts`, and `loopback-api.ts`. The implementation worker reported cohesion `REFACTORED`, and primary inspection accepted the responsibility placement, stable exports, default `node:http` seam, and retained lifecycle state. Current production identities are `service.ts` `a4fd340de25670c9f76042a66100c999e0eea0702d71dcfa9b712782619e66b2`, `contracts.ts` `543a5ed78f99f05bb74f40bdf8d2d9b600742bf0d6a4fea6d35da67555203139`, `input-validation.ts` `dce646e7c3796b7dade9422688373b7acda32c6d06e805966b5c810e20312273`, `scan-run-records.ts` `27b9f7df773202a4e6be52ce771114169ed127399a649bb0a20c620f630111f2`, and `loopback-api.ts` `f9df82120e09eb81a3c3fb64c72f1d33907d182cbd107a10a6b5d2bc836e0f13`.

Post-Green validation passed the unchanged 69-case local-service command, strict TypeScript checking, and `node --check` for all five production modules. The complete backend/scanner command passed 290 of 290 cases with zero failure, cancellation, skip, or todo after applying the required M1-03 environment: retained `m104-browser-runtime/browsers`, `PLAYWRIGHT_SKIP_BROWSER_GC=1`, `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=30000`, repository-owned `TEMP` and `TMP`, and `NODE_DISABLE_COMPILE_CACHE=1`. The scanner scratch directory contained zero entries after the run. An earlier full-suite invocation omitted `TEMP` and `TMP`; its temporary-directory assertion failures were rejected as invalid environment evidence and were not attributed to the implementation.

Fresh S3 review found no production defect and accepted cohesion as `REFACTORED`. Its sole Minor finding identified stale M1-04 status text in `docs/ui/README.md` and `docs/ui/ANALYZE_AND_RESULTS_PRESENTATION.md`. The primary corrected only those authority-owned status lines, and the bounded correction review returned PASS with no Blocker, Major, or Minor finding. Exact cleanup removed the verified ordinary empty `temp/m103-scan` directory; `dist/client` and repository-root `.vite-temp` were absent at that check, the retained pinned browser runtime was unchanged, and the Git index was empty. The later exact cleanup correction above covers `node_modules/.vite-temp`. Changed-document file-link validation passed for 14 documents, `git diff --check` passed, and no current document reports M1-04 implementation as still in progress. No architecture, product behavior, dependency, public API, test, or executable configuration changed, so no ADR or further product-authority update is required. M1-05 remains In progress.

Owner-supplied external review later reported one P3 dependency-clarity finding: the lifecycle coordinator retained a runtime default `node:http` import solely for its `http.Server` annotation. Same-contract correction `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-02` used attempt-2 lease `M1-05-20260902-01-service-refactor-green-02`, parent `M1-05-20260902-01-service-refactor-green-01`, guard digest `9c49fbfc40e7ad1958f27eb6a6dc5431941118b8b5576d5e327149f31b1d86ed`, and compliant receipt `78741912904518259422b69258ee2dfd4f03dcc0beabd96b0d19b73daef84e5d`. Only `src/server/service.ts` changed: it now imports the `Server` type and declares `let server: Server`, leaving `loopback-api.ts` as the sole runtime owner of the default HTTP object. The corrected `service.ts` identity is `48f2fa46433fc7b529f9b27ab30216660143d5d923846032991ed8fa1cb3f604`; the other four production identities and all accepted tests remain unchanged. Focused service validation passed 69/69, strict TypeScript and all five syntax checks passed, the complete backend/scanner regression passed 290/290 under the required M1-03 environment, and exact cleanup removed the empty scanner scratch. Bounded correction review returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`.

Accepted scanner preflight `M105-SCANNER-MODULE-REFACTOR-02-PREFLIGHT-01R` ran `node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts` under the exact retained-browser and repository-owned scratch environment at the current production/test baseline. It passed all 88 leaf cases—20 normalization and 68 scan execution—with 108 TAP tests including parent groups, zero failures, cancellations, skips, or todos, and 21.676 seconds TAP duration. Scratch contained zero entries before and after; production and test hashes remained `scan-page.ts` `fcd9cbb6e2f632c70a717155ae172ce210ce757ccb24f1d53071f21e05585b33`, `normalize-scan.ts` `8dbb14cbc42845e27ef2193b274fe21da31261e5df0c6edcfbd1e4a84bac9d05`, `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`, and `scan-normalization.test.ts` `c7712f21238949c3873e399c0d380cfe37e25ab5ec98ad5e37ed5010cd4a994e`. The earlier `PREFLIGHT-01` returned `UNKNOWN` without execution because the coordinator supplied a nonexistent historical plan filename; the corrected packet used `docs/plans/completed/m1-03-real-scan-and-evidence.md`. No test write or artificial Red is needed.

Accepted Green/Refactor assignment `M105-SCANNER-MODULE-REFACTOR-02-GREEN-01` used lease `M1-05-20260902-02-scanner-refactor-green-01`, guard digest `d348dbb9c756c270bd0b65b45ec4080a564c5d9e4c0c1486040ad1b81b67496a`, and fresh compliant receipt `b9b0b3b32c810ce06519ee25955866ba35020ee16899823ea5cc6ea4291b509c`. It modified only `scan-page.ts` and `normalize-scan.ts` and created the five approved focused modules; no forbidden, unleased, index, HEAD, branch, or ignore-control drift occurred. The worker and primary accepted cohesion as `REFACTORED`: `executeScan` retains `track`, `bounded`, `close`, `active`, `operation`, browser/deadline/abort/cleanup state and terminal construction; `normalizeNativeScan` retains envelope/options validation, failure precedence, coverage, UUIDs, native order and final assembly. `scan-page.ts` preserves its three public imports through direct re-exports, `normalize-scan.ts` preserves both public exports, and the serialized reporter receives only JSON-literal profile arguments while keeping every helper nested.

Post-Refactor focused verification passed all 88 leaf scanner cases with 108 TAP tests including parents, zero failures/cancellations/skips/todos, and 21.022 seconds duration. Independent primary verification passed the complete 290-case backend/scanner regression in 20.643 seconds, strict TypeScript, and `node --check` for all seven modules. Current production identities are `scan-page.ts` `6b119170612b3a8b90b941f3cd34fb1feb0b6480421043ab02adc873031001be`, `scan-profile.ts` `f089ef8db27a770c265d87b63a4c5af633ac24976f2eaa48e946c69b09edff91`, `scan-request.ts` `56652dd47dd8883fa1810c027a45dc39958c67c7377475326b1eba82e589580a`, `native-scan-capture.ts` `c466f0174c3bd03421b2b0f2515bf15653788c200e00195de2cfe36c8dca6ae1`, `normalize-scan.ts` `af6aabd4c008711e68d4bc06e5b865babe0a0268d999f63bfdeffdc135f005d3`, `native-value-reader.ts` `00affae65054866812719832ae6ec34ea6ae027495a1df41babd883bb7cbfcc7`, and `native-rule-evidence.ts` `2d30bef5d9b117296d8900f44571d84b4cbe14b5074ebeb30cbefb2415dcb3d7`. Accepted test, package, lockfile, and TypeScript-config hashes remain unchanged. Scanner scratch was empty, the retained browser runtime still had 331 descendants, and `dist/client` and repository-root `.vite-temp` were absent at that check. The later exact cleanup correction above covers `node_modules/.vite-temp`. The accepted S3 review and closure are recorded below.

Fresh S3 review `M105-SCANNER-MODULE-REFACTOR-02-S3-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and independently accepted cohesion as `REFACTORED`. It reproduced exact production/test/config identities, strict TypeScript, seven syntax checks, diff validation, public import and factory-freshness checks, dependency-cycle analysis, isolated `registerReporter.toString()` execution without Node globals, and the pure 20-case normalizer suite. It reused the exact-identity fresh browser and complete-regression evidence because browser execution writes controlled scratch and conflicted with its read-only boundary. The reviewer confirmed all nine critical checks: authorized moves, self-contained reporter serialization, native-value privacy, rule evidence, normalization precedence, browser lifecycle, public imports/dependencies, behavioral tests, and status honesty. Exact cleanup removed the verified ordinary empty scanner scratch; the retained runtime remains unchanged and generated client output remains absent. Final documentation validation passes 529 relative links and 116 Markdown fragments across ten changed documents, UTF-8/final-newline/trailing-whitespace checks, current-status reconciliation, and `git diff --check`. A first naive link diagnostic counted fenced template placeholders as links; its two false positives were rejected, and the corrected fence-aware validator passed. No requirement, ADR, product, API, dependency, M1-03, fixture, or executable-configuration change is needed. M1-05 remains In progress.

Owner-supplied external review later returned one P2 correction for runtime-mutable exported policy arrays. Primary reproduced it without a repository write: `scanRules.pop()` changed later contexts and native options from three rules to two, `nativeBuckets.push()` changed later result types, and `messageKeys.push()` expanded the evidence allowlist. The prior scanner S3 PASS remains valid for the lifecycle, normalization, serialization, dependency, and cohesion dimensions it inspected but is superseded as final slice acceptance until this integrity correction receives new evidence and review. The smallest correction freezes `scanRules`, `nativeBuckets`, `ordinaryReasons`, `attributeStates`, `inputTypes`, and `messageKeys` at construction. A new tracked layout test is not justified: these are scan-feature-internal exports and the accepted tests should remain coupled to stable behavior rather than private file placement. The correction instead requires an isolated direct mutation-resistance probe, unchanged focused and complete regressions, strict typechecking, syntax checks, exact cleanup, and fresh S3 review.

Correction assignment `M105-SCANNER-MODULE-REFACTOR-02-GREEN-02` used attempt-2 lease `M1-05-20260902-02-scanner-refactor-green-02`, parent `M1-05-20260902-02-scanner-refactor-green-01`, guard digest `6d18592be5f4906f9e0f4f462c36cc5e13cefb4d6cdf6ab386e12982e591a76b`, and fresh compliant receipt `b1a69ec6f8820f6cc8b3e1a064899ba9ae073c62aeb80b89fd9ccf3d70867519`. It changed only `scan-profile.ts` and `native-value-reader.ts`, wrapping the six existing tuples with `Object.freeze()` without changing a literal, order, consumer, or type. A process-isolated probe confirmed all six values are frozen, generic array mutation fails without state change, and fresh scan contexts/options still expose the exact three rules and four buckets. The unchanged focused scanner boundary passed all 88 leaf cases with 108 TAP tests in 20.507 seconds, the complete backend/scanner regression passed 290/290 in 20.612 seconds, strict TypeScript and all seven syntax checks passed, and scanner scratch remained empty. Test identities remain `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84` and `scan-normalization.test.ts` `c7712f21238949c3873e399c0d380cfe37e25ab5ec98ad5e37ed5010cd4a994e`. Corrected production identities are `scan-profile.ts` `acd6db3b14c616411d5a55c5d9dd2f2d7df3387d6d62502e4ac9bf3c55953d69` and `native-value-reader.ts` `af735b3dcbc6960ddb82ddd5a4e4879eda9bd57a96404cb248d21b1f5ebb7c36`; the other five production identities remain exact. The renewed S3 review result is recorded below.

Renewed review `M105-SCANNER-MODULE-REFACTOR-02-S3-REVIEW-02` returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`. It independently verified frozen descriptors and rejection of generic `push`, `pop`, `splice`, `fill`, and `reverse` calls for all six tuples, exact values and readonly tuple inference, detached factory results after hostile mutation attempts, and end-to-end withholding of an injected unknown native message key. It also confirmed unchanged hashes for the five untouched scanner modules and both tests, stable public exports, strict TypeScript, seven syntax checks, the pure 20-case normalization suite, compliant lease scope, and documentation truthfulness. The earlier scanner S3 review remains historical evidence for the original extraction and is superseded by this renewed review as the final correction acceptance. No requirement, ADR, product, public contract, dependency, or M1-03 authority changed. M1-05 remains In progress for HTTP integration and its browser/build checkpoint.

Accepted preflight `M105-APP-DEAD-STATE-CLEANUP-05-PREFLIGHT-01` ran the unchanged `tests/target-results-ui.test.ts` boundary under pinned Chromium `151.0.7922.34` at HEAD `7353f986bf27d56a8a5d4ce5e91d1c318b4f71fe`: all 30 cases passed with zero failure, cancellation, skip, or todo. It classified `EXISTING_AND_COVERED` after confirming that the suite exercises reservation, duplicate admission, captured intent, stale-response rejection, unmount ownership, announcements, and conditional focus replacement without asserting private hook layout. Baseline identities were `App.tsx` `00db6d28f84f3dab9b533a32ffa177db97b58bb99111312a161079fbc0e2c0e2`, UI test `44097b9b35e8c46ad7cf6d64af91489c8884044c1c5ecd008ce19ba811916e39`, harness `6d6809f8647c9bfa48b6c7dfbd46fb7a4a027f5ea51fcd195c1032e9fe9d1357`, and admission helper `8fb8ebdebf0ee90aa2163876042878ec585b37d37a863748252c60f1fcfd89a1`. Browser teardown settled, no external request or page error occurred, and no test-owned residue remained.

Green assignment `M105-APP-DEAD-STATE-CLEANUP-05-GREEN-01` used lease `M1-05-20260902-05-app-dead-state-green-01`, guard digest `2931c96eb4e335b58646e2ac201ef5831bb763cc2390a0d4aec7677f6dc1de9c`, and fresh compliant receipt `764e8ca2141b89e67aa6a0fdf3965580559785b95aae5699668ce72afbf499f5`. It modified only `src/client/App.tsx`, with zero additions and exactly three deletions: the unread `pendingAnalysis` state declaration and its two setter calls. No forbidden, unleased, generated, index, HEAD, reference, or ignore-control drift occurred. Worker and primary accepted cohesion as `RETAINED`; all existing orchestration responsibilities and public exports remain in `App.tsx`. Its new identity is `59c53fd9ced217c4b432f94ef8fbccafd4294f34494e00e8768f1c567acd4ca5`, while the UI test, harness, and admission helper retain their preflight identities.

Post-Green verification passed the focused browser boundary twice—once under the worker and once under primary coordination—with 30 of 30 cases each. The complete backend/scanner regression passed 290 of 290, strict TypeScript passed, and the native Vite production build transformed 32 modules successfully. The primary browser run reported the new App identity through the deterministic full client inventory, owned-origin requests only, no page errors, and settled teardown. Exact cleanup verified `dist/client`, `temp/m103-scan`, `temp/m104-ui`, repository-root `.vite-temp`, and `node_modules/.vite-temp` absent; `temp/m104-setup` remains ordinary and empty, and the retained pinned browser runtime remains at 331 descendants.

Fresh review `M105-APP-DEAD-STATE-CLEANUP-05-S1-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and independently accepted cohesion as `RETAINED`. The reviewer reproduced strict TypeScript and exact diff, export, hash, guard, cleanup, and dependency inspection; it accepted the exact-identity browser, complete-regression, and build evidence. No requirement, ADR, roadmap status, public interface, UI contract, test, dependency, fixture, or executable-configuration change is required because this slice removes only unread state and preserves observable behavior. M1-05 remains In progress for HTTP integration and its browser/build checkpoint.

## Interfaces and Dependencies

The completed slice preserves the public `src/server/service.ts` import boundary. `contracts.ts` contains types only. `input-validation.ts` depends on domain validation and Node UUID generation only as needed to prepare a running record. `scan-run-records.ts` depends on domain validation, deep equality, and persistence record types. `loopback-api.ts` depends on the default `node:http` object and narrow lifecycle/read callbacks. `service.ts` depends on those internal modules plus the existing repository. No new package, route, environment variable, stored field, build setting, browser runtime, or external service is introduced.

The run-contract slice preserves `src/server/domain/run-contract.ts` as the sole public import boundary. Internally, fixed policy and model types are the lowest layers; hostile-value readers depend on them; finding validation depends on readers; scan validation depends on finding validation; and parent-run validation depends on scan validation. The browser receives only the existing validator through the façade. Scanner-native readers and policies remain separate trust-boundary implementations. No public export, persisted field, package, schema dialect, code generator, or runtime service is introduced.

The run-repository slice preserves `src/server/persistence/run-repository.ts` as the sole public import boundary. Internally, contracts are the type foundation; bounded store errors depend on those contracts; Windows path protection depends on bounded rejection; transition validation depends on contracts and bounded rejection; and the façade/coordinator depends on all four. Filesystem-calling modules use the shared default `node:fs` object. No public export, route, persisted field, format version, package, recovery mechanism, or runtime service is introduced.

The App cleanup preserves `src/client/App.tsx` as the stateful client coordinator and public owner of `App`, `AppProps`, and the `AnalyzeIntent` re-export. It continues to depend on the analysis and results feature components plus `run-admission.ts`; no dependency direction changes. The deletion removes an unread state value and redundant state updates without adding a module, hook, controller, route, package, interface, rendered node, or client/server interaction.

The remaining integration extends the existing service rather than adding a second runtime. `ServiceOptions.clientRoot` is the only new configuration field and is optional for API-only focused construction; production `main.ts` supplies the fixed `dist/client` path. `StartResult` adds only `client-unavailable`. `POST /api/runs` accepts URL plus mode and returns the existing `ScanOutcome`; it creates no second domain DTO or persisted contract. `service.ts` calls the stable scan façade, while `loopback-api.ts` sees only narrow callbacks and a closed client-response table. `client/main.tsx` uses same-origin fetch and passes unknown response data to the existing `App` admission boundary. No new package, environment variable, provider interface, browser-to-filesystem edge, or public scan-policy control is introduced.

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

2026-09-02: Added owner-approved `M105-RUN-CONTRACT-MODULE-REFACTOR-03` as the third behavior-preserving M1-05 structural slice. Recorded the stable façade, six-module responsibility boundary, frozen internal policy, existing 30-case characterization route, acyclic dependencies, S3 triggers, guarded ownership, build and regression verification, cleanup criteria, and unchanged later integration work.

2026-09-02: Accepted independent run-contract preflight as `EXISTING_AND_COVERED`. Corrected the evidence wording to distinguish 30 static cases from 58 executed TAP tests; source/tests remain unchanged and the guarded seven-path Green/Refactor is next.

2026-09-02: Accepted the compliant seven-path run-contract Green/Refactor, complete focused/regression/type/syntax/build/mutation/export/cleanup evidence, and fresh S3 PASS with no finding. The third structural slice is complete and documentation is reconciled; M1-05 remains In progress for HTTP scan integration and its browser checkpoint.

2026-09-02: Added owner-approved `M105-RUN-REPOSITORY-MODULE-REFACTOR-04` as the fourth behavior-preserving M1-05 structural slice. Recorded the stable façade, four-module responsibility boundary, retained atomic publication coordinator, existing 55-case characterization route, default-filesystem interception constraint, S3 triggers, guarded ownership, verification commands, cleanup criteria, and unchanged later integration work.

2026-09-02: Accepted independent run-repository preflight as `EXISTING_AND_COVERED`. All 55 cases pass with unchanged source/tests and no retained residue; no test write is needed and the guarded five-path Green/Refactor is next.

2026-09-02: Accepted the fresh compliant five-path run-repository Green/Refactor and focused, complete-regression, strict, syntax, export/import, identity, and cleanup evidence. The publication coordinator remains intact and cohesion is `REFACTORED`; fresh S3 review is next.

2026-09-02: Closed the run-repository structural slice after fresh S3 PASS with no finding, exact cleanup, status/navigation reconciliation, formatting validation, and documentation closure. All four approved M1-05 structural slices are accepted; M1-05 remains In progress for real HTTP scan integration and its browser/build checkpoint.

2026-09-02: Corrected the owner-supplied P3 generated-output evidence finding without changing production code. Verified and removed only the ordinary empty `node_modules/.vite-temp` directory, confirmed both cache paths are absent, and superseded the earlier incomplete cleanup claims. M1-05 remains In progress for real HTTP scan integration and its browser/build checkpoint.

2026-09-02: Added and completed owner-approved `M105-APP-DEAD-STATE-CLEANUP-05`. Independent preflight returned `EXISTING_AND_COVERED`; the compliant one-file lease removed exactly the unread state declaration and two setter calls; focused and complete regressions, strict TypeScript, production build, cleanup, and fresh S1 review passed. `App.tsx` remains the orchestration coordinator with cohesion `RETAINED`, and M1-05 remains In progress for HTTP integration.

2026-09-02: Completed the owner-requested post-implementation documentation audit. Updated the public overview, documentation authority index, roadmap status, plan index, and progress index to include and link the accepted App cleanup. The accepted Analyze/Results presentation and completed M1-04 plan remain unchanged because rendered behavior and the historical deferral record are still accurate.

2026-09-02: Reconciled the full current M1-05 state and revised this living plan in place for the remaining walking-skeleton outcome. Recorded clean HEAD and fresh 182-case/typecheck planning evidence; one coherent standard-profile HTTP/browser integration Red-Green slice; exact request, response, asset, responsibility, path, dependency, command, risk, review, recovery, and closure boundaries; and a separate owner-gated public smoke. Preserved all five accepted prior slices. No Decision Review Contract, dependency, product authority, source, test, or task-status change is introduced by this planning revision.

2026-09-02: The first independent remaining-work review returned `REVISE` with five Major findings. This correction preserves API-only health/POST behavior through configured-client capability gating; freezes exact request-stream, media-type, asset-topology, environment, build, sequential-test, production-start/stop, and cleanup literals; adds slice-local authority anchors; requires Local, Groq-zero, and visible-failure browser-form paths; and retains the public aggregate and build through the different final integrated review before exact deletion. The review checkpoint remains open until a different fresh reviewer returns PASS.

2026-09-02: The different fresh re-review accepted the product boundary, workflow ownership, authority mapping, full browser lanes, public-evidence retention, and YAGNI scope but returned `REVISE` on three command/closure gaps. This correction adds primary-owned no-lease scratch preparation and an exact no-write preflight command; makes every Vite build require an absent owned output, removes the recognized Red build before Green, retains one hash-frozen Green build, and asserts all seven production, build, runtime, executable, marker, and protected-input identities before public startup; and moves terminal documentation validation after status, archive, navigation, and progress mutations. The review checkpoint remains open for another fresh verdict.

2026-09-02: The third fresh reviewer again accepted readiness, authorities, capability gating, ownership, full browser paths, public-smoke boundaries, and YAGNI scope but returned `REVISE` on three remaining mechanical gaps. This correction adds an exact plan-only Git/lease/source/test/configuration/runtime identity gate before and after preflight; freezes Red receipt and test identities, then one inseparable Green source/test/protected-input/build/runtime/receipt tuple before plan maintenance and reasserts it through complete verification, smoke, review, and pre-cleanup; and adds a self-contained post-archive documentation command covering status totals/mirrors, allowed and required paths, generated state, links, fragments, encoding, whitespace, PowerShell syntax, required sections, and `git diff --check`. No product, dependency, path scope, test behavior, or architecture boundary changed. A new fresh verdict remains required.

2026-09-02: Primary command validation interrupted the next review before verdict after finding that the new roadmap-total expression targeted a nonexistent standalone `Status` field. The corrected literal parses both existing `Parent milestone / role / status` and `Parent gate / role / status` rows and reproduces the current 28-task baseline as seven Complete, one In progress, and 20 Not started; closure requires exactly eight Complete and 20 Not started. This command-only correction changed no execution scope or product contract, so a fresh review starts against the stable corrected candidate.

2026-09-02: The next fresh reviewer accepted readiness, authorities, scope, capability gating, browser and smoke paths, the preflight gate, the Red/Green evidence tuple, YAGNI boundaries, PowerShell syntax, and the corrected roadmap parser, but returned `REVISE` on one remaining closure-integrity gap. The post-archive command now reasserts byte-for-byte copied values for all seven production files, both accepted tests, the whole source and test trees, five protected inputs, and both terminal lease receipts after every documentation mutation, while deliberately requiring the already reviewed build to be absent. This command-only correction prevents a second edit to an already dirty executable path from escaping closure validation and changes no product contract, path scope, dependency, test behavior, or architecture boundary. A different fresh verdict remains required.

2026-09-02: Fresh final readiness review `M105-REMAINING-WORK-PLAN-REVIEW-05` returned PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `6258258BB57F571EE3AD3E2223461963D1A4251F08305E9F803C1D7C902B3797`. It independently confirmed the closure-integrity correction and regression-checked readiness, routed authorities, exact commands, Red/Green and lease ownership, evidence continuity, capability gating, controlled browser-to-disk lanes, owner-gated public smoke, cleanup/recovery, documentation timing, and YAGNI/KISS scope. Only this result record changed after the reviewed candidate; implementation remains pending.
