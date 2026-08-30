# Define the minimum run and scan contracts

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

**Owning task:** [M1-01 — Define the minimum run and scan contracts](../../DEVELOPMENT_ROADMAP.md#m1-01--define-the-minimum-run-and-scan-contracts). **Phase:** authorized execution, literal contract frozen; Complete and archived after verification, accepted implementation reviews and documentation closure. The owner's subsequent 2026-08-30 instruction explicitly authorizes this exact task's bounded discovery, research, implementation, verification, and documentation closure. It satisfies the original planning-only boundary, whose history is preserved below. The [first-module Red rule is authorized](#first-module-red-authorization), the owner has [clarified trusted URL provenance](#trusted-url-direction-and-runtime-re-entry), and the pinned runtime and focused runner are verified. The qualified initial Red and separate Green are accepted; all 58 accepted behavioral tests and strict typechecking passed after the bounded correction. Both required R3 checkpoints and all implementation gates passed; the integrated Minor documentation follow-up is resolved. No other task, commit, or push is authorized.

## Progress

- [x] (2026-08-30 17:07Z) Reviewed the clean `47bf64e` baseline, roadmap, applicable authorities, completed RD-003 evidence, frozen-input hashes, and current development prerequisites; see `M101-STATE-001` below.
- [x] (2026-08-30 17:07Z) Defined this task-only plan, its literal-freeze barrier, one coherent behavior-bearing slice, ownership, verification, and exclusions. No application file or dependency was changed.
- [x] (2026-08-30 17:19Z) Accepted fresh independent plan review `M101-PLAN-REVIEW-001`: PASS with no findings. Documentation-only validation passed; see the planning checkpoint below. This does not pass the future literal or implementation gates.
- [x] (2026-08-30) Received explicit M1-01 execution authorization; captured fresh clean HEAD `96fdc0716570508ea8275f2fd19e1596fd1c45f7`, without resetting historical planning state.
- [x] (2026-08-30) Confirmed completed RD-002/RD-003, unchanged frozen/configuration inputs, six fixture byte matches, and 29 installed dependency metadata matches; performed the single non-ranking discovery and reconciled CR1/DA1 at the owner-direction barrier below.
- [x] (2026-08-30) Recorded the consumed URL follow-up and passed documentation-only blocked-handoff validation `M101-EXEC-DOC-001`. This is not M1-01 Verification or completion.
- [x] (2026-08-30) Received owner authorization for ADR-0024's narrow first-module Red exception and reconciled the plan's acceptance rule. This settles the rule only; it is not preflight, executed Red, Green, or a passed literal gate.
- [x] (2026-08-30) Reconciled the owner's trusted-developer URL direction with ADR-0018 and the privacy authority, preserving HTTPS/credential checks and excluding a URL-classification/withholding subsystem.
- [x] (2026-08-30) Installed and selected Node 24.20.0/npm 11.19.0 through existing NVM; verified the official Node checksum, fresh-shell selection, Python, 29 installed dependency identities, five recorded fingerprints, six unchanged fixtures, current-tree strict typecheck, and a stdin native test diagnostic. See `M101-NVM-001`; qualifying focused-runner verification remains due before first-module Red.
- [x] (2026-08-30) Froze the complete public-run literal contract after distinct fresh FINAL1 PASS with no findings; no worker may invent or change its semantics.
- [x] (2026-08-30) Accepted completed synthesis `M101-LITERALS-001-DA1-C1`: DRAFT READY with supported coverage, unavailable-fact, context/chronology, and enumerable-JSON refinements. The same paused correction is now complete; its allowance is consumed. Both fresh R3 checkpoints remain required.
- [x] (2026-08-30) Received the owner's request to pause at a safe boundary for an execution-mode change. No implementation lease is active; stop before any new review or worker dispatch. Preserve the in-flight analyst correction identity and its allowance without resetting research budgets.
- [x] (2026-08-30) Resumed after the owner-requested pause; verified unchanged prerequisite identities and continued the same unfinished DA1-C1 correction without resetting its budget.
- [x] (2026-08-30) Verified the file-based focused npm runner with one disposable TypeScript/assertion diagnostic: one pass, zero skipped/todo, exit 0, followed by verified exact-file/empty-directory cleanup. `M101-RUNNER-001` is environment evidence only, not product Red.
- [x] (2026-08-30) Accepted pre-draft checkpoint `M101-LITERALS-001-PRE1-C1`: PASS across the complete corrected outline and M101-I1–I9, no remaining findings. PRE1's sole supported correction made zero-node inapplicable coverage exclusive; its original REVISE remains recorded below. Primary authored L1 for the different fresh final R3 review.
- [x] (2026-08-30) Accepted MISSING read-only preflight, qualified first-module Red, and separate guarded Green: all 29 unchanged test groups passed and independent strict typechecking exited 0. Both write leases freshly closed compliantly; review and closure remain.
- [x] (2026-08-30) Accepted S3 REVIEW1 findings: one Major closed-array key-membership defect and Minor M101-C1. Reconciled the same-contract gap for the sole test/code attempt-2 correction and review loop; initial passing tests do not close this gap.
- [x] (2026-08-30) Accepted RED2/GREEN2: 28 new malformed-array assertions failed behaviorally, then all 58 tests and strict typechecking passed with original tests preserved. Both attempt-2 leases closed compliantly; both worker correction allowances are consumed.
- [x] (2026-08-30) Accepted complete corrected S3 REVIEW1-C1 PASS with both findings resolved. Primary test-relevance audit and closure-candidate full suite (58/58) plus independent strict typecheck passed; frozen inputs and documentation checks passed.
- [x] (2026-08-30) Accepted different fresh M101-INTEGRATED-001 PASS WITH FOLLOW-UPS: no Blocker/Major or code/test issue. Primary resolved its sole Minor M101-INTEGRATED-M1 by distinguishing current accepted evidence from historical planning/re-entry statements; frozen L1 is unchanged.
- [x] (2026-08-30) Passed the documentation gate after resolving M101-INTEGRATED-M1; marked only M1-01 Complete. All 24 other application tasks remain Not started.
- [x] (2026-08-30) Archived this same plan with its full history; repaired twelve inbound documents and all plan-relative links. Final navigation, frozen-contract semantic equivalence, source/test/configuration identity and status checks passed. Next eligibility is reported without starting another task.

## Surprises & Discoveries

- RD-003's manifest explicitly limits its evidence policy to the six controlled fixtures. Its fixed target selectors, one-target expectations, `email` input, offline loading, and evaluation process supervision are not public-page contract defaults. Evidence: `evaluation/rd003-scan-v1.json`, `evidencePolicy.scope`, and the [accepted native observations](rd-003-scan-evaluation-boundary.md#accepted-setup-and-native-observations--rd003-observations-001).
- Initial discovery found a global-runtime mismatch: Node `v24.18.0` and npm `11.16.0` differed from RD-002's `24.20.0`/`11.19.0` pins. M101-NVM-001 later resolved that mismatch without replaying the removed RD-003 acquisition; M101-RUNNER-001 separately establishes the focused runner. Neither prerequisite check proves product behavior.
- At initial discovery there was no application source or retained product test. Preflight had to establish the missing capability from the actual tree and usable runner, not infer `MISSING` from one failed search or accept a broken environment as Red.
- `M101-LITERALS-001-CR1` and mandatory analyst `DA1` independently identified a first-module testing conflict under the then-current instruction: validator behavioral Red was required before a production callable existed, while missing-module-only evidence and production stubs were excluded. The later [owner-authorized exception](#first-module-red-authorization) resolves only that acceptance-rule conflict, not the remaining URL or runtime gates.

## Decision Log

- Decision: Resume the same unfinished DA1-C1 synthesis correction after the owner's continuation instruction.
  Rationale: HEAD, the selected pinned runtime, frozen/configuration bytes, installed dependency identities, and absent source/tests/active lease match the saved checkpoint. The pause created no new allowance or passing review.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Pause at the owner's request after establishing the pinned runtime and reconciling trusted-URL scope, before research-review or implementation dispatch.
  Rationale: No worker lease or product write is active. Retain the live synthesis checkpoint and current worktree so a later continuation can use the same plan and remaining gates without a reset.
  Date/Author: 2026-08-30 / project-owner pause request recorded by primary coordinator.

- Decision: Resume literal synthesis using the remaining analyst correction after the owner's trusted-developer clarification and successful pinned-runtime setup.
  Rationale: Retain normalized requested/observed-final URLs only as run provenance under ADR-0018's clarified supported-use assumption. Do not introduce component withholding, secret classification, or a URL-approval workflow. The runtime is now available; no research allowance or later gate is reset.
  Date/Author: 2026-08-30 / project-owner direction reconciled by primary coordinator.

- Decision: Apply the owner-authorized [ADR-0024 first-module Red amendment](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception) without starting M1-01 implementation.
  Rationale: Complete behavioral tests may initially fail because the agreed production callable is absent, after independent environment verification. Record capability absence honestly; separate Green must execute the unchanged tests and pass strict typechecking. URL semantics, literal research, runtime readiness, and all budgets remain unchanged.
  Date/Author: 2026-08-30 / project-owner authorization recorded by primary coordinator.

- Decision: Stop dependent drafting and implementation at the analyst's `OWNER DIRECTION` result. Preserve the task's execution authorization and all remaining gates and budgets.
  Rationale: At that historical stop, a missing export could not satisfy the owner's behavioral-Red restriction. The later amendment above supplies the required narrow authority; it does not retroactively turn the stop into an executed test or permit a stub or non-TDD workaround.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Activate only M1-01 planning and preserve completed RD-002/RD-003 evidence and all downstream task statuses.
  Rationale: The request names a concrete eligible task but asks for an ExecPlan, not execution of M1 or its parallel group.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Use one application-owned contract and small runtime checks with the existing pinned tools; add no dependency, schema platform, generated contract, or future workflow section.
  Rationale: `REQ-QUAL-010`, `REQ-QUAL-011`, ADR-0011, ADR-0021, and immediate M1 consumers already determine this boundary.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Separate this R2 execution-plan review from the future R3 public-retention/immutable-record literal decision and S3 implementation review.
  Rationale: Planning chooses scope and sequencing, not new data semantics. Execution must settle the still-open privacy-sensitive public fields and immutable identity boundary before tests or code; the fixture-only freeze cannot answer those choices. Research and implementation tiers are separate, and only the triggered roles below are used.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Plan one coherent contract TDD slice, not one handoff per type or assertion. No production stub or fake behavior is authorized to make a test harness appear ready.
  Rationale: Runtime rejection, preservation, and immutable ownership are observable behavior under ADR-0024. Environment or import failures alone do not prove that behavior.
  Date/Author: 2026-08-30 / primary coordinator.

## Outcomes & Retrospective

M1-01 is Complete. One application-owned source module implements the minimum runtime-validated run/scan record, exact three-rule coverage, independent Findings, separate native incomplete observations, unavailable-fact preservation, closed failures and immutable provider/evidence context. The complete 58-test suite and independent strict typecheck pass under Node 24.20.0/npm 11.19.0. Both R3 checkpoints passed; the corrected S3 review passed; different integrated review passed with a documentation follow-up that primary resolved. All four worker leases closed compliantly and all required documentation owners are reconciled.

The first-module, URL and runtime stops, initial typing diagnostics and array-key defect remain preserved as history. The narrow first-module exception enabled honest initial Red; the later real behavioral regression demonstrated the missing rejection before its minimum correction. Both worker correction allowances are consumed. No service, real scanner, persistence, provider execution or UI was implemented. M1-02, M1-03 and M1-04 are eligible only for separate owner selection; none was started. Source, tests, dependencies and frozen inputs remain unchanged during final navigation closure. No staging, commit or push occurred.

**Historical planning outcome:**

The planning request is complete. The primary created this bounded ExecPlan and synchronized activation/navigation/status records; a fresh independent reviewer passed the complete planning artifact with no findings. Documentation-only validation passed. RD-003 is a completed prerequisite, and M1-01's directly applicable Must requirements and decisions are Accepted at their recorded MVP scopes. No application implementation, literal-contract selection, test execution, or runtime provisioning occurred. M1-01 remains In progress for planning, not Complete. Next: an explicit execution request, then current-tree/prerequisite checks and the public-run literal freeze before worker preflight or writes.

## Purpose / Big Picture

M1-02, M1-03, and M1-04 need one shared meaning for a run, its scan evidence, failure, and selected provider context before service, scanner, and UI work can proceed independently. M1-01 supplies that small contract and executable validation, without implementing those consumers.

After execution, a reviewer can run focused tests and the independent strict compiler check to observe valid nonzero and zero completed records, separate native incomplete observations, failed/running records, preservation of unavailable individual facts, closed content-safe fields, stable Finding addressing, and immutable run/scan values. These are contract-level results, not proof of navigation, actual axe execution, durable disk writes, provider readiness, or a working UI.

## Context and Orientation

### Current project state and readiness

`M101-STATE-001` records the planning baseline: branch `codex/m1-01-run-and-scan-contracts`, HEAD `47bf64e` (`feat: freeze RD-003 scan evaluation boundary (#6)`), clean index/worktree, and 104 tracked files before this change. At that planning checkpoint, the repository contained its accepted planning/architecture baseline, agent workflow, minimal package/compiler/build configuration, the scan-only manifest, and exactly six controlled HTML fixture states. It had no application source, retained product tests, service entry, client entry, corpus snapshot, retrieval, provider adapter, review, or comparison implementation. All 25 application tasks were Not started before this exact planning activation. The current execution baseline is HEAD `d50f62fd2d883e8757b6001a4b4a59b9ba643e03`; the run/scan source and 58-test suite now exist and pass strict verification and both implementation reviews. Only M1-01 may close; all 24 other application tasks remain Not started.

RD-001, RD-002, and RD-003 are Complete in the roadmap. The [RD-003 renewed closure](rd-003-scan-evaluation-boundary.md#reproducibility-cleanup-and-renewed-closure) preserves original six native observations, LF checkout verification, the successful bounded clean-start retry, independent reviews, cleanup, and the earlier failures. Current manifest SHA-256 is `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`; all six current fixture hashes match its accepted observation record. Neither those inputs nor `.gitattributes` changes in M1-01.

The existing toolchain is Node `24.20.0`, npm `11.19.0`, TypeScript `7.0.2`, native erasable TypeScript, `node:test`, and `node:assert/strict`. Follow [Development toolchain](../../../README.md#development-toolchain) and the existing lockfile. `tsconfig.json` already includes `src/server/**/*.ts` and `tests/**/*.ts`; no compiler, package, or build change is planned. Python `3.12.10` is available for the repository's guard, not as an application dependency. No active pointer exists at `logs/agent-flow-leases/v2/active.json`; `temp/rd003-evaluation` is absent. Recheck these facts before execution.

### Applicable authorities

| Authority | Binding M1-01 meaning |
| --- | --- |
| [Roadmap M1-01](../../DEVELOPMENT_ROADMAP.md#m1-01--define-the-minimum-run-and-scan-contracts), [OD-025](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-025--development-authorization-and-roadmap-governance), and [evaluation freeze](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) | Only this selected task; completed RD-003 is its dependency; ordinary task-owned fields may be resolved here; no generation freeze or dependent-task activation. |
| [Target and scanning requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning): `REQ-AUTH-007`, `REQ-SCAN-005`–`REQ-SCAN-007` | Complete page/scan provenance, exact three rules, missing-fact preservation, no truncated success, and provider-independent evidence. |
| [Evidence requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance): `REQ-EVID-003`, `REQ-EVID-007`–`REQ-EVID-011` | Immutable completed evidence, run/Finding identity only, native incomplete separation, minimized per-rule facts, bounded locator or unavailable reason, and one aggregate. |
| [Provider execution](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-002` | Explicit immutable Local/Groq provider/exact-model context; selection creates no ProviderInvocation, probe, or call. |
| [Privacy](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-003`, with directly linked `REQ-SEC-002` | Closed application-owned sections and content-safe failure; no raw scanner/page/provider material, credentials, arbitrary attributes, form values, or hidden content. Public data is not automatically non-sensitive. |
| [Reliability](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-001`, `REQ-QUAL-003`, `REQ-QUAL-010`–`REQ-QUAL-012`, `REQ-QUAL-019`, `REQ-QUAL-020` | Unknown-value validation, one minimal TypeScript definition, complete exact-rule coverage, only three parent states, initial-write failure distinction, provenance, and sibling preservation. |
| [Information and workflow lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), [ADR-0021](../../architecture/decisions/ADR-0021-single-file-run-aggregate.md), [ADR-0011](../../architecture/decisions/ADR-0011-typescript-as-initial-application-language.md) | One top-level aggregate version, independent nested Findings, no vendor types in domain records, and runtime validation separate from strict type checking. |
| [BHV-01/BHV-07](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope), [SPEC-001/SPEC-007](../../specs/SPEC.feature), [HS-004/HS-006](../../specs/HARD_SPEC.feature) | Derived contract examples only: complete versus failed scan, minimized evidence, immutable records, and reopen validation. End-to-end service/browser/UI portions remain M1-02 through M1-05. |
| [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [agent workflow](../../../.codex/README.md), [worker-first workflow](../../../.codex/execplan-implementation-workflow.md), and [write-lease guard](../../../.codex/write-lease-guard.md) | Independent test/implementation ownership, behavior-based Red or the narrow first-module Red exception, exact guarded write turns, bounded correction, risk-routed review, and primary-owned closure. |

Here, a Finding is one native violation node, identified by its owning `runId` and within-run `findingId`. A ScannerReviewObservation is one native `incomplete` node, not a Finding or a generation candidate, and has no new domain ID. A locator supports inspection/correlation; it is not identity. A contract validator checks unknown values before use; it does not establish that a browser ran, a public destination is safe, or a filesystem write became durable.

## Scope and Non-Goals

Implement only the following immediate contract families after the literal barrier:

| Family | Minimum included meaning |
| --- | --- |
| PageAnalysisRun | One format version, immutable run identity/creation context, application revision, requested target identity, provider context, parent execution state, and only the scan/result/failure fields valid for that state. |
| Scan provenance and coverage | Normalized requested and observed final page identities; scan time; observed page-state/readiness; viewport; locale; actual browser/scanner versions; exact `image-alt`, `label`, `color-contrast` configuration; relevant preconditions; one run-level evidence-policy version; complete per-rule coverage. Unobserved provenance on a failed/running run is not fabricated. |
| Findings and observations | Complete variable-length collections; violation-node identity and native rule/check provenance; discriminated minimized facts for the three rules; one valid bounded locator or concise unavailability reason; distinct native-incomplete reason/category and provenance. |
| Lifecycle and failure | Only `running`, `completed`, `failed` for the parent. Findings initially have their own `unprocessed` state. Content-safe closed failure categories distinguish parent failure from an individual unavailable fact. |
| Runtime boundary | Treat aggregate and normalized scan inputs as unknown; check consumed structure, field allowlists, and semantic relationships before returning an application-owned value. Define only the small scanner/local-consumer handoff needed immediately, not a second canonical record family. |

A completed candidate must represent full exact-rule coverage and all declared nodes, including valid zero; running/failed values cannot carry a misleading completed collection. Missing or invalid individual source facts are represented through the permitted unavailability shape rather than dropping the item. Persisted records must themselves match that shape: arbitrary malformed retained values are not accepted merely because source facts may be unavailable. Do not silently filter unknown keys or truncate arrays to make invalid input pass.

Keep provider context at run level, separate from service secrets/configuration and all scan values. Completed evidence and selected context need a tested ownership/immutability boundary, not only TypeScript `readonly` or a cast. Findings remain addressable after list reordering; two distinct nodes may have the same locator and must not be deduplicated. Duplicate within-run Finding IDs are invalid. No observation, evidence, scan, provider-context, or failure ID is added.

The current contract includes no retrieval, sufficiency/abstention engine, ProviderInvocation, proposal, review, comparison, `baselineRunId`, positive-comparison archive, downstream lifecycle implementation, or placeholder containers for those later tasks. Their Accepted obligations are deferred to their roadmap owners, not removed from the MVP. M1-01's tests may prove ownership/isolation with synthetic values without implementing future updates.

M1-02 owns service creation, disk I/O, safe aggregate publication/reopen, busy-operation control, and durable update enforcement. M1-03 owns URL admission/navigation, real axe-output validation and all-node projection, public DOM capture/minimization, browser cleanup, and scan execution. M1-04 owns presentation. M1-01 defines what those consumers must supply and accept; it implements no HTTP server/router, filesystem repository, scanner adapter, network call, browser launch, renderer, or public-page smoke. A valid `completed` value is not evidence of durability: M1-02 must durably publish the complete aggregate before reporting completion, and initial-write failure remains parent failure.

No new package, compiler/build change, generic schema library, generated schema, migration/compatibility framework, custom serializer, event log, ID registry, generic state machine, queue, runtime agent, workflow telemetry, or production hostile-target policy belongs here. Do not change the frozen RD-003 manifest, fixtures, expected outcomes, or checkout policy. No frontend-quality overlay is triggered by this nonvisual contract task.

## Plan of Work

### 1. Re-establish execution authority and prerequisites

On a later execution request, inspect the actual Git tree and completed prerequisites again. Confirm M1-01 is the selected `In progress` task, read this living plan and exact authority anchors, record actual coordinator permissions and available role settings, and preserve unrelated changes. Establish the exact Node/npm binaries from the existing developer-managed setup, the locked dependencies, and Python 3.10 or newer before worker dispatch. The original global-runtime mismatch is resolved by M101-NVM-001 below; verify the selected pinned environment again if it drifts. Do not reinstall the browser or rerun RD-003's evaluation/bootstrap merely to validate pure contracts.

Planning and read-only contract discovery can continue without runtime acquisition. If the pinned runtime cannot be supplied, stop implementation at that prerequisite and report the exact missing setup. Any necessary locked restore is a separately bounded prerequisite operation with its mutation/cleanup inventory frozen before execution; it cannot change package metadata or tool selections.

### 2. Freeze the minimum public-run literal contract

Use the Decision Review Contract below. One bounded non-ranking local discovery may identify gaps between Accepted semantics, RD-003 controlled evidence, and the immediate consumers. Do not compare new libraries or reopen the accepted aggregate/topology. The primary records the exact questions and field-level candidate dispositions, then one `critical_researcher` addresses the combined privacy/record-integrity dimension. Reuse the existing native evidence; no browser or public-target experiment belongs in this research pass.

After the synchronization barrier, the mandatory R3 `decision_analyst` checks completeness and decide-now/prove-later separation. `DRAFT READY` and a passing fresh `critical_research_reviewer` pre-draft checkpoint permit primary authorship of the full literal contract in this plan. A different fresh `critical_research_reviewer` reviews that authored contract before implementation preflight. No drafter or ordinary researcher is planned. These checkpoints settle implementation literals, not ADR or requirement approval; a genuine authority conflict or new durable mechanism stops for the owner/ADR process.

The primary must freeze all retained properties, enum/value meanings, presence rules, public privacy restrictions, numeric/string bounds where needed for minimization, unknown-key handling, error categories, callable signatures, and runtime immutability semantics. Do not leave these decisions to a worker or label unresolved privacy/identity mechanics as future runtime proof. Public evidence values must meet the canonical rule profiles without importing fixture-only assumptions. Preserve native measurements/check identity rather than synthesizing source facts.

### 3. One coherent behavior-bearing slice — M101-CONTRACT-01

The observable outcome is one validated, closed, immutable M1 run/scan contract covering the acceptance matrix below. TDD is Applicable: it has meaningful rejection, state, identity, and preservation behavior. Standard `code_worker` is the implementation role; no frontend worker applies.

Before preflight, create workflow/assignment identities and a complete [Milestone Assignment Packet v2](../../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) projecting the reviewed literal contract, readiness evidence, commands, ownership, environment, and budget. Keep one `test_worker` and one separate `code_worker` context for this slice. Both are Sol medium under their repository role files; neither may spawn agents or mutate Git state.

The test worker first performs read-only preflight with no lease and returns exactly one workflow classification. `EXISTING_AND_COVERED` reuses fresh proof without writing; `EXISTING_BUT_UNCOVERED` receives a passing characterization; `MISSING` or `REGRESSION` takes Red then Green; `PARTIAL` requires primary isolation of the missing gap; `CONFLICTING` or `UNKNOWN` stops. The baseline suggests missing behavior but is not the worker's accepted classification.

For Red, lease only `tests/run-contract.test.ts`. The test worker owns the complete bounded behavioral tests, including representative synthetic valid, privacy-negative, and malformed cases. No test data is represented as a native scan or written to `data/runs/`. Once all other gates pass, use the existing focused runner and ordinary imports of the frozen production path/exports. Under [ADR-0024's first-module exception](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception), primary may accept the exact expected missing-module/export failure after independently verifying the required toolchain and runner. Record **initial Red — missing production callable** and state which behavioral assertions did not execute. An existence-only test, wrong path, broken dependency/runtime, syntax error, unrelated failure, skipped/conditional assertion, fallback, or production stub remains invalid. No loading shim or fake production behavior is required.

After fresh compliant lease closure and primary inspection, freeze the accepted test path/hash and exact Red result. Only then lease `src/server/domain/run-contract.ts` to `code_worker` for minimum Green and optional same-turn behavior-preserving Refactor. Every accepted behavioral test must execute and pass unchanged, and the independent strict typecheck must pass; merely resolving the import is not Green. The file owns the minimal application types and their small runtime checks. Tests and all documentation are forbidden in that lease. If a second cohesive source file is demonstrated necessary, primary must reconcile the path/contract before a new lease; no broad `src/` lease or speculative module hierarchy is allowed.

The primary starts and closes every lease, inserts the guard digest into each fresh packet before dispatch, and verifies the actual diff, unchanged accepted test boundary, exact command results, terminal receipt, and no-drift state before accepting a handoff. No primary documentation or guard-control maintenance overlaps an active worker lease. Worker output uses the workflow's four-section handoff. Ordinary test corrections remain test-worker-owned; the narrow exceptional primary test correction is permitted only as specified in ADR-0024, between leases with reason/paths/validation recorded and prior Red evidence invalidated.

### 4. Review, verification, and task-only closure

This slice is S3 because unknown public-derived/persisted values cross a privacy-sensitive allowlist and an immutable identity/evidence boundary. A fresh `critical_reviewer` (Sol max) reviews the completed slice. After primary integration, test-relevance audit, documentation reconciliation, and closure-candidate validation, a different fresh `critical_reviewer` performs integrated review because that same critical boundary remains. This is not a review of a real scan or durable repository that has not been built.

Reuse evidence only when exact command, working directory, relevant-tree fingerprint, environment fingerprint, and guard-backed no-drift state match. Rerun stale, contradictory, missing, or risk-critical checks, not every historical RD-003 observation. At task closure execute the complete current authoritative test suite once and the independent strict compiler check; while this remains the only product test, the focused and complete task suite are the same command and need not be duplicated at one unchanged checkpoint. Audit helpers, mocks, skips, focused markers, and temporary substitutes; keep no test solely to make the runner pass.

Primary then updates materially affected documentation, records actual contract/test limits, resolves reviews, and applies the documentation gate. Only after M1-01 Verification passes may the roadmap mark M1-01 Complete and this plan move to `completed/`. M1-02/M1-03/M1-04 become eligible for separate owner selection; do not start them or their shared integration checkpoint automatically.

### Ownership, budgets, and stop rules

The initial implementation scope is exactly `tests/run-contract.test.ts` for test leases and `src/server/domain/run-contract.ts` for Green. All other paths are forbidden, including `docs/`, `README.md`, `AGENTS.md`, `PLANS.md`, `.agents/`, `.codex/`, `evaluation/`, `fixtures/`, package/configuration files, and application consumers. The primary alone owns this plan, status/progress/navigation documents, and guard controls between leases. There are no concurrent implementation writers or parallel roadmap branches.

Default slice budget: one read-only preflight, one coherent Red or characterization, one Green, at most one same-contract correction per role, and one review-correction loop. Attempt 2 names its terminal attempt-1 parent and has a fresh packet, baseline, lease, and digest. Stop on a changed binding field, unexpected overlap, guard violation, stale or wrong Red, repeated decisive failure twice, two no-diff write handoffs, conflicting authority, exhausted budget, or a need for more than three TDD cycles. Permission to fix one issue does not reset budgets. The primary reconciles first and requests owner direction when new authority or a larger allowance is required.

## Decision Review Contract

**Identity:** `M101-LITERALS-001`; owner M1-01; target the literal-contract subsection in this plan and then the single application-owned contract. **Current status:** DA1-C1 returned DRAFT READY, PRE1-C1 passed, and distinct fresh FINAL1 passed the complete primary-authored L1 contract with no findings. Primary accepted the literal freeze, MISSING preflight, qualified initial Red, separate Green, bounded behavioral correction, and both implementation review outcomes. The sole integrated documentation follow-up is reconciled in this closure record. CR1 returned `BLOCKED` and mandatory DA1 returned `OWNER DIRECTION`; those historical reports predate the first-module Red authorization and subsequent trusted-URL clarification below. The later exact-task execution authorization satisfied the original planning-only boundary; it does not authorize another task or renew any research/worker budget.

**Tier and scope:** R3 for deciding the privacy-sensitive public retained-field/locator policy and immutable run/Finding boundary. Accepted parent statuses, one aggregate, exact rules, provider-context semantics, no child identities, and later-task boundaries are fixed constraints, not candidates. Alternative field spellings/layouts or availability representations may be compared only when necessary to implement those constraints. One local non-ranking discovery pass first identifies that small candidate set and exact evidence gaps; freeze them here before comparative research. No new architecture/library selection is needed or authorized.

**Criteria and evidence:** Trace every retained field to an immediate M1 consumer and a named authority. Prefer the smallest direct TypeScript representation that preserves complete evidence, excludes prohibited content, expresses honest missing facts, validates unknown JSON, and is usable by service/scanner/UI without duplicate domain definitions. Evidence is the canonical requirement/ADR text, frozen RD-003 manifest and accepted native values, pinned package source/types when a consumed native shape needs checking, and synthetic counterexamples labeled as contract cases. Time-sensitive external mechanics, if needed, require version-matched primary sources; no broad technology survey, new native run, provider call, or model output is authorized.

**Required artifact-local output before any behavior lease:** one exact field/presence/value table for all three parent states and the three rule-specific evidence shapes; provenance and failure definitions; public requested/final-identity and locator minimization rules; unavailable-fact versus invalid-record distinction; exact coverage/cardinality relationships; mode/model consistency; ID validation without generation/registry machinery; runtime ownership/immutability enforcement; callable/export/test-loading boundary; source/test paths; and complete commands with their mutation/cleanup effects. A rejected input produces a bounded application-owned failure, never an echoed raw value or exception payload. The output must explain what an ordinary JSON round-trip preserves without inventing canonical bytes, migrations, or a custom serialization protocol.

**Decide now versus prove later:** Decide those meanings before worker preflight/Red. M1-01 then proves them with pure contract checks, isolated mutation attempts, and strict compilation. Actual URL admission, native node collection/capture/sanitization and browser cleanup are proven by M1-03; durable publication/reopen and later-update preservation are proven by M1-02; the UI by M1-04; their integration by M1-05. This separation does not permit incomplete M1-01 semantics or use a `completed` object as proof of disk durability.

**Routing and budget:** one `critical_researcher` report covering the combined public-record privacy/integrity dimension and at most one targeted follow-up; one `decision_analyst` synthesis with at most one bounded correction; one fresh pre-draft `critical_research_reviewer` checkpoint with at most one supported outline correction; a different fresh final `critical_research_reviewer`, subject to the workflow's two-cycle final-artifact correction ceiling. No `technology_researcher` or `research_drafter` is justified initially. Every role receives Research Assignment Capsule v1, exact anchors, common hard gates, evidence/freshness IDs, read-only permission, no independent spawning, explicit output/stops, and the next synchronization barrier. Stop on repeated decisive gaps, two `RETURN FOR RESEARCH` results without materially new evidence, budget exhaustion, authority conflict, or changed critical mechanics. Do not evade the budget by respawning.

The analyst returns `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. R3 requires both fresh research checkpoints; an R2 plan-review PASS does not satisfy them. Only primary writes authoritative research-derived documentation. Reviews cannot approve an ADR, alter a requirement, authorize a lease, or complete M1-01. Recheck the entire cumulative invariant packet after every material revision, not only the last finding.

### Execution discovery — M101-DISCOVERY-001

The single non-ranking local discovery pass identified these literal questions. This is the frozen research scope, not a selected public contract. The baseline is clean HEAD `96fdc0716570508ea8275f2fd19e1596fd1c45f7` before primary plan maintenance; no `src/` or `tests/` exists. The four package/configuration hashes and manifest hash in `M101-STATE-001` still match. Each of the six fixture files equals its manifest content byte for byte. RD-002/RD-003 remain Complete, and no active lease or RD-003 acquisition exists. Current global Node/npm is still `24.18.0`/`11.16.0`; the bundled workspace Node is `24.19.0`. Neither is authorized for task execution. Python is `3.12.10`. No worker writes may start until the required developer runtime is available.

| Literal question | Bounded candidates / evidence gap, without ranking |
| --- | --- |
| Requested/final page identity | Exact normalized identity versus a minimized structured identity with explicit withheld components. Settle privacy, query/fragment/path handling, and collision honesty without inventing a target registry, hash identity, or URL-admission service. |
| Public comparison locator | A restricted content-free structural CSS string versus an allowlisted native selector with explicit unavailable reasons. Settle validity, bounds, uniqueness/capture responsibility, and why arbitrary attributes or sensitive identifiers cannot be retained. |
| Rule facts and native checks | Closed discriminated per-rule records with explicit unavailable facts. Determine general public element/input kinds, name-association facts, native contrast values/reasons, and check membership from pinned evidence; fixture selectors and email-only expectations are excluded as defaults. |
| Coverage, failures, and partial provenance | Explicit bucket membership/counts versus count-only coverage; exact state presence and chronology; content-safe parent failure; preserve observed provenance without fabricated facts or retained partial success. |
| Identity and runtime ownership | Validated caller-supplied run/Finding IDs, duplicate-ID rejection, no locator identity; detached recursively frozen application values versus another equally small enforceable ownership boundary. No ID generator, registry, serializer, or migration. |
| Callable and first-module loading boundary | Pure unknown-input run/scan validation exports; exact signatures remain to freeze. Initial failure acceptance is now fixed by [first-module Red authorization](#first-module-red-authorization): complete slice tests, verified environment, exact expected missing-module/export failure, and honest non-execution reporting. No existence-only suite, skipped/conditional assertion, fallback, or production stub. |
| Commands and effects | Existing exact focused command and strict typecheck, with pinned executable paths; no browser/bootstrap replay. Resolve prerequisite acquisition/restore only if necessary, with exact effects and cleanup settled before execution. |

One `critical_researcher` covers this combined privacy/integrity dimension under `M101-LITERALS-001`; the mandatory analyst then audits artifact readiness. Hard gates remain M101-I1–I9, the roadmap Verification, all Accepted authority anchors above, sole-primary authorship, no downstream implementation, and the recorded budgets. The research result cannot cure a missing executable prerequisite or authorize a lease.

### Cumulative invariant and acceptance packet

These invariants also form the test/review matrix. Current behavioral evidence is **M101-CONTRACT-01-GREEN2: 58 accepted tests passed and strict typecheck exited 0**, after primary source/test inspection. Corrected S3 review and primary closure-candidate verification pass; the integrated implementation review passes and its documentation follow-up is reconciled; this is not native scan or persistence evidence. Research reviewers assess the frozen semantics; S3 implementation reviewers assess actual behavior.

| ID | Trigger/case | Required result | Evidence / responsible review |
| --- | --- | --- | --- |
| M101-I1 | Contract completeness and scope | Every roadmap Verification clause maps to a field/check/test; only immediate M1 sections exist; dependency/task/authority status remains honest. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I2 | Valid nonzero, valid zero, and zero with native incomplete | Exactly three covered rules; complete violation and incomplete collections agree with coverage; native incomplete remains distinct and never proposal-eligible; no finding-count cap, merge, drop, or invented pass archive. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I3 | Missing/extra rule, malformed collection, invalid state, parent failure | Invalid records fail closed; running/failed cannot masquerade as complete zero/partial success; failure is content-safe; initial persistence failure is representable without claiming persistence implementation. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I4 | Missing/invalid/withheld fact or unavailable locator | Preserve the item and native category through an allowed reason; malformed durable shapes still reject; no invented native fact, discarded sibling, or new identity. Locator unavailability alone is not a generation-sufficiency decision. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I5 | Public provenance and synthetic sensitive-content counterexamples | All `REQ-AUTH-007` provenance is representable when observed; credentials/raw text/HTML/scanner/provider data and unknown fields cannot cross the durable shape, including nested failure and fact objects; target identity stays in permitted run provenance and locator in comparison-support evidence. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I6 | Local/Groq consistency and attempted mutation | One explicit immutable provider/exact-model context; no implicit default mode, ProviderInvocation, per-Finding provider, provider readiness requirement, or side effect. Scan meaning is identical between modes. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I7 | Two Findings, reordered list, duplicate locator/ID, caller alias mutation | Stable within-run IDs address the same Finding regardless of order; distinct nodes sharing a locator survive; duplicate IDs reject; accepted evidence/context and sibling values are unchanged by caller mutation/isolation checks. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I8 | Unknown parsed JSON, wrong format/version, extra nested fields | Small runtime checks validate before use; a plain JSON round-trip preserves the valid contract; no cast-only validation, native-library domain dependency, generic serializer, migration, or compatibility mechanism. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |
| M101-I9 | Worker ownership and evidence honesty | Accepted behavior-based or qualifying first-module Red before Green; first-module Red reports capability absence without claiming executed behavioral coverage; fresh guarded test/code turns; every accepted behavioral test executes unchanged and passes with independent strict typecheck at Green; primary-only documentation; exact commands and fresh fingerprints; no synthetic contract case claimed as browser, disk, or provider evidence. | GREEN2, complete S3 re-review, integrated implementation review and primary closure checks pass. |

### Research barrier — M101-LITERALS-001-CR1

The following research and synthesis checkpoints preserve the original stop under the former first-module restriction. The later [first-module Red authorization](#first-module-red-authorization) supersedes that restriction only; it does not change the reports into passes or settle their URL findings.

The single `critical_researcher` report returned **BLOCKED** on 2026-08-30 after read-only investigation. Its unused allowance is one targeted follow-up; no budget is reset. Primary accepts the following as research inputs, not a literal freeze or implementation evidence:

- `CR-E1`–`CR-E3`: the named privacy, evidence, and reliability authorities require closed minimized records, complete node preservation, unavailable-fact reasons, honest identity, and distinct initial/later persistence failures.
- `CR-E4`: RD003-OBSERVATIONS-001 supplies six controlled native outcomes, no native incomplete case, and copied contrast measurements; its fixture-only policy is not a public default.
- `CR-E5`–`CR-E6`: installed axe-core 4.13.0 `axe.js` lines 33015–33033 includes both input and textarea for `label`; lines 27188–27303 includes partial contrast facts and foreground/shadow/background contributions. Public records must not assume email-only inputs, one paragraph kind, or always-complete contrast values. These source facts are not native public-page verification.
- `CR-E7`: standards-based URL normalization is not content sanitization. Removing components can collapse distinct page identities. Any permitted withholding must remain explicit and must not support an equality-based same-page claim. A content-free structural locator and detached recursively frozen application values are supported candidates, still unselected. Sources: [URL serialization](https://url.spec.whatwg.org/#url-serializing), [structural selectors](https://drafts.csswg.org/selectors/#the-nth-child-pseudo), and [Object.freeze](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.freeze).
- `CR-E8`: no run-contract module or alternative application implementation exists. With the current instruction excluding missing-module-only Red and production stubs, an export-availability assertion does not exercise validator behavior. The first behavioral-Red boundary therefore needs reconciliation before worker preflight; no exception is assumed.

The mandatory analyst received the complete report and this contract to distinguish a resolvable literal gap from an owner-controlled testing conflict. No pre-draft review, authored literal contract, final research review, test preflight, lease, or behavioral validation has occurred. Node 24.20.0/npm 11.19.0 remain a separate prerequisite; no runtime acquisition, restore, or RD-003 bootstrap was run.

### Synthesis stop — M101-LITERALS-001-DA1

On 2026-08-30 the mandatory `decision_analyst` (Sol xhigh, read-only) returned **OWNER DIRECTION**. It independently checked the current HEAD, eleven-document diff, absent application/test roots and active lease, frozen/configuration hashes, six fixture hashes, pinned scanner source identity, and mismatched global runtime. Primary inspected the same actual boundaries and accepts this as a stop disposition, not a review PASS or a completed literal contract.

The decisive conflict is the first-Red acceptance rule. Static loading fails before validator behavior; dynamic loading plus an export assertion establishes availability only; a fallback or production stub supplies prohibited substitute behavior; writing real behavior before Red breaks sequencing. No source-supported implicit exception exists. The owner must specify what initial Red evidence is acceptable for this absent first module. One concrete option for owner consideration is a complete test-owned behavioral suite whose first failure is honestly labeled missing-callable evidence, followed by separate minimum Green that executes every behavioral assertion. That option is **not authorized or adopted**, and no such test was written.

The analyst also confirms that URL retention/withholding is an unresolved literal issue, not a demand for a universal secret detector or deferred hostile-target qualification. Exact field/value/presence tables, bounds, IDs, failures, exports, and commands remain unfrozen. M1-02/M1-03/M1-04 may prove only defined downstream mechanics; they cannot supply these missing meanings retroactively.

At that historical stop, the one discovery, CR1 report, CR1-F1 targeted follow-up, and DA1 synthesis were used, with no further researcher allowance. DA1's bounded correction was then unused; the later DA1-C1 checkpoint below records its subsequent completion. Neither R3 reviewer, worker/preflight/lease, S3 review, integrated review, or implementation correction has run. Their gates remain required after re-entry; no budget is reset and no optional role is added.

### URL follow-up stop — M101-LITERALS-001-CR1-F1

The sole targeted follow-up returned **BLOCKED** on 2026-08-30. This used the remaining permitted read-only research to narrow the independent privacy question while drafting and worker writes stayed stopped. It confirms that the authorities are not inherently contradictory and do not require a universal secret detector. The missing decision is the permitted retention responsibility and unavailable-identity behavior, including an observed redirect destination.

`CR-F1-E1`–`CR-F1-E4` trace this boundary to ADR-0018's operator responsibilities/no-attestation rule, `REQ-AUTH-007` provenance, `REQ-EVID-008` permitted placement, `REQ-SEC-002`/`003` exclusions, and lifecycle page comparability. Trust/public reachability alone is not an explicit guarantee that every requested or final URL component is non-sensitive. A structured identity may distinguish absent, observed, and withheld components, but removing path/query/fragment information cannot establish page equality. Full withholding cannot be silently treated as satisfying mandatory completed-run provenance. Standards-based normalization supplies syntax and equality mechanics, not a privacy disposition.

Supported constraints are retained as research only: reject requested embedded credentials before run creation; never retain credentials from either identity; never replace an unobserved final identity with the requested one; keep absence distinct from withholding; never echo rejected values in reasons; keep target identity out of Finding evidence; and prevent comparison based solely on equal redacted values. No hash, registry, secret classifier, redirect attestation, or new product component is proposed.

Owner direction must settle how permitted identity retention is established and whether a closed unavailable page identity can allow scan completion with comparison unavailable. These are still questions, not accepted semantics. The first-Red rule is now authorized below. After the URL clarification, primary reconciles the affected authority before using the remaining analyst correction and required fresh R3 checkpoints. If the directions require further research beyond the consumed allowance, obtain a specifically renewed budget rather than respawning.

### First-module Red authorization

On 2026-08-30, the project owner authorized only the first-module TDD correction. [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md#first-module-red-exception) now permits complete bounded behavioral tests to fail initially because their agreed production module/export is absent, after independent toolchain/runner verification. That evidence is explicitly capability absence, not executed validator behavior. A separate Green must execute every unchanged behavioral test and pass the independent strict typecheck. No production stub, fallback, test weakening, or new workflow phase is authorized.

This supersedes this plan's former absolute missing-module exclusion and resolves that owner-direction item only. It does not accept an actual Red, settle URL retention, supply the pinned runtime, freeze the literal contract, consume or renew M101-LITERALS-001 research budgets, satisfy its R3 checkpoints, or resume worker writes. M1-01 remains Blocked. The policy amendment is documentation-only; its validation cannot count as M1-01 implementation Verification.

### Paused analyst correction — M101-LITERALS-001-DA1-C1

The owner requested a safe pause while the sole remaining analyst correction was in progress. The analyst stopped read-only work and returned an **incomplete checkpoint, with no synthesis-readiness verdict**. It independently confirmed the first-module and URL authority reconciliation, pinned runtime versions, unchanged fingerprints, and absent source/tests/active lease. No new architecture or research dimension had been identified at that point. No research reviewer may start from this partial checkpoint.

The unfinished audit identifies five supported corrections to the proposed outline, not an accepted literal contract: omitted native shadow color means missing unless non-applicability is affirmatively established; configured browser-policy fields must not claim already executed operations, and scan-time/cleanup events need exact meanings; evidence unavailability reasons require field-specific restrictions; a contrast observation's duplicated native reason must agree, while image/label observations cannot use contrast-only keys; and successful `validateScan` must require complete observed provenance/readiness/cleanup just as a completed run does. Complete the remaining literal-by-literal audit and I1–I9 disposition in this same DA1-C1 assignment before a readiness verdict. This owner-requested pause does not consume a second correction or renew any allowance.

Resume from the current worktree, preserve the installed NVM selection and existing task cache, verify no drift, and continue the same analyst assignment. No worker lease, production module, retained test, pre-draft reviewer, or final reviewer exists. M1-01 remains In progress but paused by the owner; it is not Complete or archived.

## Concrete Steps

### Completed synthesis — M101-LITERALS-001-DA1-C1

The resumed analyst completed the same correction and returned **DRAFT READY**. Primary accepts the corrected complete outline for pre-draft review, not for implementation: explicit native bucket presence/counts (including nonnegative inapplicable counts and coexisting buckets); configured-policy versus observed-context separation; exact scan-time/cleanup/initial-persistence semantics and chronology; field-specific unavailable values; native-reason consistency; preserved native contrast measurements including rounded font values; closed enumerable JSON data; and detached recursively frozen results. The outlined callable, type, path, and command boundary remains confined to M1-01. No further owner direction or research dimension was identified. Primary inspected the cited axe aggregation source and confirmed that an exclusive zero-node inapplicable boolean would have imported an unsupported fixture assumption.

The original report, sole researcher follow-up, and sole analyst correction are now consumed. The fresh pre-draft reviewer receives the complete original outline plus every accepted refinement, the authority/evidence identities, and M101-I1–I9. Only a passing checkpoint permits primary authorship here; a different fresh reviewer must still inspect that authored contract before test-worker preflight. No worker or lease is authorized by DRAFT READY.

### Accepted pre-draft checkpoint — M101-LITERALS-001-PRE1-C1

Fresh Sol-max `critical_research_reviewer` PRE1 reviewed the complete twelve-part outline and cumulative M101-I1–I9. Its original verdict was REVISE with one Major, `M101-PRE1-M1`: zero-node `inapplicable` coverage cannot coexist with another bucket. Primary independently inspected pinned axe-core 4.13.0 `aggregateNodeResults`/`aggregateResult` branches and applied exactly that supported relationship correction. The same checkpoint's sole outline correction returned **PASS**, with no remaining Blocker, Major, or Minor after complete recheck. Positive inapplicable counts may coexist; zero requires the other three slots to be null. The former unrestricted-coexistence statement is superseded, not erased from synthesis history.

PRE1 independently confirmed HEAD `d50f62fd2d883e8757b6001a4b4a59b9ba643e03`, thirteen documentation-only changes, empty index, frozen/configuration and six-fixture identities, 29 installed dependency identities, pinned runtime/Python, absent source/tests/lease, and pinned axe source SHA-256 `138a93a4ce7b7c6c08ed84144e45dcd8cc36d2d4ff8ed673619faf0406906d88`. PRE1-C1 reused those unchanged identities and rechecked decisive aggregation branches. Neither checkpoint executed product behavior. This permits primary authorship only; the distinct final research review remains required before preflight. No research allowance is reset.

### Accepted authored-contract checkpoint — M101-LITERALS-001-FINAL1

The different fresh Sol-max critical research reviewer returned **PASS**, with no Blocker, Major, or Minor after reviewing all twelve L1 parts, the living decision contract, and the complete M101-I1–I9 packet. Reviewed plan SHA-256 was `7c8ccac18dce9094fb68d02320d6d3267e5dc5d0e911a7af43dbfaf7eee11cee`; exact UTF-8 L1 subsection bytes from its heading to before Trusted URL direction had SHA-256 `dace1a36c2a5cf87b3e96efec05d86cd7af3d8e66a62c1c52fecb5573e726578`. Primary verified that subsection unchanged and accepts the full literal freeze. The authoring-time review condition in that frozen text is now satisfied. Later annotations outside that subsection do not change its semantics or reset budgets.

FINAL1 independently verified the matching tree/artifact/configuration/axe identities, inspected native aggregation/check/contrast sources, and reproduced safe grammar, calendar-date, descriptor/JSON, and frozen-copy language checks. It reused still-valid fixture/dependency and runtime/runner evidence. These are semantic and prerequisite observations, not product behavior. No final-artifact correction was needed. The original researcher/follow-up, analyst/correction, and pre-draft/correction allowances remain consumed; no new research is planned.

Primary documentation checks on the reviewed state passed 591 relative links, 142 anchors, all fifteen required plan sections, twelve literal subsections, table structure, both documented PowerShell blocks, and `git diff --check` exit 0. Fresh `M101-PREFLIGHT-BASE-001` confirmed HEAD `d50f62fd2d883e8757b6001a4b4a59b9ba643e03`, empty index, five configuration/manifest fingerprints, six fixture byte matches, 29 installed dependency identities, Node 24.20.0/npm 11.19.0/Python 3.12.10, and absent source/tests/active lease/disposable runner. Relevant-tree SHA-256 is `1709d6fe24cc76509903a3446d3c86399db6a6b4984cc50e22c2bd9560944f26`, over sorted compact JSON containing HEAD, the five path/hash pairs, and absent source/test markers. Worker classification and all execution evidence remain pending.

### Authored literal contract — M101-LITERALS-001-L1

This is the complete task-owned literal contract derived from CR1/CR1-F1, the owner's resolved URL and first-module directions, DA1-C1, and passing PRE1-C1. It remains subject to the distinct final R3 review before implementation. All object tables below specify **exact own keys, all required**; optionality exists only through an expressly stated union. There are no future placeholder sections. Types are application-owned, recursively readonly declarations; runtime acceptance additionally creates detached, recursively frozen values. M101-I1–I9 and the roadmap Verification govern the whole contract.

#### L1.1 Shared values and unavailable facts

| Value | Exact allowed value and meaning |
| --- | --- |
| `formatVersion` | Numeric literal `1`; the single aggregate format version. |
| `runId`, `findingId` | Case-sensitive strings matching `^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`. Supplied by callers; no ID generation, global registry, or order-derived identity. |
| `applicationRevision` | Exactly 40 lowercase hexadecimal characters. A revision identifier, not a claim that the working tree was clean. |
| Time | Exactly canonical 24-character UTC `YYYY-MM-DDTHH:mm:ss.sssZ`, matching `^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$` and a successful identical `Date` ISO round-trip. Reject invalid calendar dates. No current-clock check. |
| Browser version | String matching `^[0-9]+(?:\.[0-9]+){0,3}$`, at most 64 characters. No claim about a browser actually installed. |
| Locale | String at most 64 characters for which `Intl.getCanonicalLocales(value)` returns exactly that one identical string. |
| Numeric values | Finite, never negative zero. Counts/dimensions/timeouts require safe integers with the bounds stated below. |
| URL | String exactly equal to `new URL(value).href`, using `https:`, a nonempty hostname, and empty username/password. Retain normalized path, query, and fragment. Reject noncanonical, malformed, credential-bearing, or other-scheme strings; do not repair them. No DNS check, destination classifier, URL length ceiling, attestation, component withholding, or secret detector. |
| `Fact<T>` | Exactly `{value: T}` or `{unavailable: 'missing' \| 'invalid' \| 'withheld'}`. Only label `inputType` has the additional textarea-only `not-applicable` branch defined below. |

Every named fact field is required. A missing/invalid/withheld **source fact** is represented by its closed reason while preserving the item. A missing fact object, malformed retained value, unknown reason, extra key, or both branches in a **durable input** rejects that record. Validators do not repair, drop, infer, or silently filter. Noncompleted observed provenance has the narrower missing/invalid reasons specified in L1.3. There is no global collection-length ceiling.

URL retention relies on the [trusted operator clarification](../../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md#trusted-operator-input): the developer chooses non-sensitive public HTTPS URLs, including ordinary redirect destinations, suitable for local provenance. Normalized URL syntax does not establish semantic non-sensitivity, public reachability, permission, or hostile-page safety. Never substitute requested URL for an unobserved final URL. URLs occur only in the run provenance fields below, never evidence, failures, or provider context.

#### L1.2 Provider context

`ProviderContext` is exactly one of these objects:

| `mode` | `provider` | `model` |
| --- | --- | --- |
| `local` | `ollama` | `qwen3.5:4b` |
| `groq` | `groq` | `openai/gpt-oss-20b` |

All three keys are required. There is no default selection, per-Finding context, configuration payload, readiness requirement, invocation record, probe, or provider call. These are the accepted exact-model identifiers under REQ-LLM-002/011/015; selection does not assert availability. The validated context is immutable like every other returned container. Scan semantics are identical for both modes.

#### L1.3 Scan context

| Key | Exact value/presence |
| --- | --- |
| `finalUrl` | Exactly `{value: URL}` or `{unavailable: 'missing' \| 'invalid'}`. Independently observed final page identity. |
| `scannedAt` | Exactly `{value: Time}` or `{unavailable: 'missing' \| 'invalid'}`. Successful completion time of the native exact-three-rule collection, not run creation or timeout. Available requires `readinessReached: true`. |
| `browserVersion` | Exactly `{value: BrowserVersion}` or `{unavailable: 'missing' \| 'invalid'}`. Actual observed browser version. |
| `scannerVersion` | Literal `4.13.0`. |
| `evidencePolicyVersion` | Literal `m1-public-v1`, one nested run-level policy, never repeated on items. |
| `rules` | Exact ordered array `['image-alt', 'label', 'color-contrast']`. |
| `scope` | Literal `current-rendered-top-level-document`. |
| `readiness` | `domcontentloaded`, `load`, or `networkidle`; actual configured condition, no default selected here. |
| `readinessReached` | Boolean; true only after the configured readiness condition was observed. |
| `viewport` | Exactly `{width: positive safe integer, height: positive safe integer}`. |
| `locale` | Locale as defined in L1.1. |
| `timeoutMs` | Positive safe integer; actual configured timeout, no default selected here. |
| `freshContext` | Literal `true`. |
| `importedState`, `interaction`, `crawling`, `iframes` | Each literal `false`. |
| `cleanup` | `pending`, `closed`, or `failed`. |
| `contrastProfile` | Literal `axe-core-4.13.0-default`. |

Fixed fields describe configured scan policy; they do not falsely claim that navigation or scanning already executed. Noncompleted context preserves independently available observations and does not fabricate missing ones. `cleanup: pending` means no terminal cleanup disposition yet; `closed` means no managed resources remain, including failure before resource creation; `failed` means closure failed or remaining-resource disposition could not be established.

A **complete scan context** requires all three observed facts available, `readinessReached: true`, and `cleanup: closed`. The contrast profile means pinned default axe measurement options, including native shadow contributions. Public capture must collect full native results without a reporter/resultTypes setting that truncates omitted bucket nodes. M1-03 must prove that capture and projection; this contract does not perform it. RD-003's selectors, email-only input, offline loading, one-target expectations, and process supervision are not public defaults.

#### L1.4 Parent records and failures

Every `PageAnalysisRun` has exactly these common keys plus its branch's keys: `formatVersion`, `runId`, `createdAt`, `applicationRevision`, `requestedUrl`, `providerContext`, `status`. Their values use L1.1/L1.2; `createdAt` is Time and `requestedUrl` is URL.

| `status` | Additional exact keys and relationships |
| --- | --- |
| `running` | `scanContext` using L1.3 with `cleanup: pending`. No `finishedAt`, `failure`, `scan`, coverage, or collections. |
| `failed` | `scanContext`, `finishedAt: Time`, and `failure`. Context cleanup is `closed` or `failed`. No `scan`, coverage, or success collections. |
| `completed` | `finishedAt: Time` and `scan: ScanResult`. No separate `scanContext` or `failure`. |

`failure` is exactly `{category: FailureCategory}`. The complete category enum is `navigation`, `timeout`, `browser`, `scanner`, `result-validation`, `coverage-validation`, `evidence-capture`, `initial-persistence`, `shutdown`, `cleanup`. No free text, raw exception, input echo, code from an external library, or nested diagnostic is retained. `initial-persistence` means failure to publish the initial **complete** scan aggregate, so its failed context must be complete although the failed record retains no success collections. Category `cleanup` requires `cleanup: failed`; another primary category can coexist with cleanup failure except that `initial-persistence` still requires complete context.

`ScanResult` is exactly `{context: CompleteScanContext, coverage: Coverage, findings: Finding[], scannerReviewObservations: ScannerReviewObservation[]}`. Empty collections are allowed when their counts agree. `validateScan` accepts only this complete shape. `validateRun` also requires `createdAt <= scannedAt` whenever available, `createdAt <= finishedAt` on terminal states, and available `scannedAt <= finishedAt`. Canonical times compare by their actual instants. These are snapshot relationships, not a transition API, state machine, persistence implementation, or proof of durable completion.

#### L1.5 Exact rule coverage

Coverage has exactly the keys `image-alt`, `label`, `color-contrast`. Each value has exactly:

| Key | Allowed value |
| --- | --- |
| `violations` | `null` for an absent native bucket, otherwise a positive safe integer. |
| `incomplete` | `null` for an absent native bucket, otherwise a positive safe integer. |
| `passes` | `null` for an absent native bucket, otherwise a positive safe integer. |
| `inapplicable` | `null` for an absent native bucket, otherwise a nonnegative safe integer, including explicit zero. |

At least one bucket per rule is non-null. If `inapplicable === 0`, **all other slots are null**. Positive inapplicable counts may coexist with other positive buckets. `violations` and `incomplete` must equal the corresponding retained per-rule Finding and observation lengths, treating null as zero. No pass/inapplicable node archive is retained. Reject `{violations: 1, incomplete: null, passes: null, inapplicable: 0}` even when one matching Finding exists. Native incomplete-only coverage can support a valid zero-Finding completed scan; every rule still needs coverage. No merge, truncation, item limit, or locator-based deduplication is permitted.

These rules follow pinned native aggregation, not the six fixtures' incidental cardinalities. They establish internal consistency only; complete upstream projection remains M1-03 proof.

#### L1.6 Findings, observations, and native check identity

| Record | Exact keys and values |
| --- | --- |
| `Finding` | `findingId`, `ruleId: 'image-alt' \| 'label' \| 'color-contrast'`, `nativeResult: 'violation'`, `state: 'unprocessed'`, `checks`, `locator`, `evidence`. |
| `ScannerReviewObservation` | `ruleId` with the same enum, `nativeResult: 'incomplete'`, `checks`, `locator`, `evidence`, `incompleteReason`. No Finding ID, other child ID, state, eligibility flag, or future workflow section. |

Evidence and check IDs are discriminated by `ruleId`. Finding IDs must be unique within the scan/run; their case-sensitive values and the owning run ID are identity. Preserve collection order without treating it as identity. Distinct entries with identical locators remain distinct. Observations are never converted into Findings or generation candidates.

`checks` is `Fact<{any: CheckId[], all: [], none: CheckId[]}>`. Available arrays retain their actual native group membership, have no duplicate ID within a group, and contain at least one ID overall. No invented check-result boolean or native message is retained. `all` is always empty for these pinned rule definitions.

| Rule | Allowed `any` IDs | Allowed `none` IDs |
| --- | --- | --- |
| `image-alt` | `has-alt`, `aria-label`, `aria-labelledby`, `non-empty-title`, `presentational-role` | `alt-space-value` |
| `label` | `implicit-label`, `explicit-label`, `aria-label`, `aria-labelledby`, `non-empty-title`, `non-empty-placeholder`, `presentational-role` | `hidden-explicit-label` |
| `color-contrast` | `color-contrast` | Empty array only. |

Unavailable checks preserve the item using the three ordinary Fact reasons. Actual group extraction is capture work, not guessed from absent metadata.

#### L1.7 Minimized locator

`locator` is exactly `{value: string}` or `{unavailable: 'missing' | 'invalid' | 'withheld' | 'unsupported' | 'too-long'}`. An available string is at most 2048 characters and is exactly `:root` followed by zero or more literal ` > :nth-child(N)` segments. Each `N` is a positive safe integer in decimal without leading zeros. The whole-string syntax is `^:root(?: > :nth-child\([1-9][0-9]*\))*$`, plus the safe-integer check for each captured index.

There are no IDs, classes, tags, attributes, authored text, shadow traversals, or native selector alternatives. `invalid` includes malformed or ambiguous/nonunique actual correspondence; `unsupported` includes nonrepresentable/shadow paths; `too-long` preserves no truncated substitute. M1-01 checks syntax; M1-03 must prove unique correspondence in the captured top-level DOM. Later DOM drift can prevent correlation. Locator is supporting evidence, not permanent identity or provider/retrieval payload.

#### L1.8 Image and label evidence

`AttributeState` is exactly `absent`, `empty`, `whitespace-only`, or `non-empty`, preserving no attribute text. Image evidence has exactly `{elementKind: Fact<'img'>, altState: Fact<AttributeState>}`.

Label evidence has exactly:

| Key | Allowed value |
| --- | --- |
| `elementKind` | `Fact<'input' \| 'textarea'>`. |
| `inputType` | `Fact<InputType>`, or exactly `{unavailable: 'not-applicable'}` under the textarea condition below. |
| `nameSources` | The exact seven-key object below. |

`InputType` is `button`, `checkbox`, `color`, `date`, `datetime-local`, `email`, `file`, `hidden`, `image`, `month`, `number`, `password`, `radio`, `range`, `reset`, `search`, `submit`, `tel`, `text`, `time`, `url`, or `week`. Known textarea requires unavailable/not-applicable. Known input permits a listed value or an ordinary unavailable reason. Unavailable element kind requires unavailable input type with an ordinary reason, never a guessed `text` default or not-applicable marker.

| `nameSources` key | Allowed value and meaning |
| --- | --- |
| `explicitLabel` | `Fact<boolean>`; at least one actual explicit DOM label association. |
| `implicitLabel` | `Fact<boolean>`; at least one actual implicit DOM label association. |
| `ariaLabel` | `Fact<AttributeState>`. |
| `ariaLabelledby` | `Fact<'absent' \| 'empty' \| 'unresolved' \| 'partially-resolved' \| 'resolved'>`. |
| `title` | `Fact<AttributeState>`. |
| `placeholder` | `Fact<AttributeState>`. |
| `presentationalRole` | `Fact<boolean>`; observed declared `presentation`/`none` role category, not a computed accessibility-role guarantee. |

Explicit/implicit association cannot be inferred from missing scanner check IDs. For aria-labelledby, absent means no attribute; empty means no nonempty reference tokens; unresolved/partially-resolved/resolved means none/some/all reference targets resolve. Resolution does not assert a nonempty or adequate accessible name. No label text, reference IDs, field values, or arbitrary attributes are retained.

#### L1.9 Native contrast evidence and incomplete reasons

Contrast evidence has exactly these keys:

| Key | Allowed value |
| --- | --- |
| `foregroundColor`, `backgroundColor`, `shadowColor` | Each `Fact<string>` whose available value matches `^#[0-9a-f]{6}$`. |
| `contrastRatio` | `Fact<number>` in inclusive range 1–21. |
| `expectedContrastRatio` | `Fact<3 \| 4.5>`. |
| `fontSize` | `Fact<string>` using the grammar below. |
| `fontWeight` | `Fact<'normal' \| 'bold'>`. |
| `measurementSource` | Literal `axe-core`. |
| `messageKey` | `Fact<MessageKey>` using the complete allowlist below. |

Font size is at most 64 characters and matches `^([0-9]+\.[0-9])pt \(([0-9]+(?:\.[0-9]+)?)px\)$`: exactly one fractional pt digit and an ordinary non-exponent decimal px component, no signs or surrounding whitespace. Numeric components are finite, pt >= 0 and px > 0. `0.0pt` is permitted for native rounding of very small positive px values.

`MessageKey` is exactly `nonBmp`, `pseudoContent`, `complexTextShadows`, `colorParse`, `equalRatio`, `shortTextContent`, `shadowOnBgColor`, `fgOnShadowColor`, `imgNode`, `bgGradient`, `bgImage`, `bgOverlap`, `elmPartiallyObscuring`, `elmPartiallyObscured`, or `outsideViewport`.

Capture retains native values, never recomputes contrast or derives outcome from rounded measurements. Exact native expected-ratio strings `3:1`/`4.5:1` project losslessly to 3/4.5. A missing shadow measurement is unavailable/missing, never not-applicable; an invalid native ratio, including null-derived zero, is unavailable/invalid, never a fabricated ratio of 1. Absent native message key is missing; an unknown native key is withheld upstream instead of echoed. An unknown string in a durable input still rejects. A recognized shadow-contribution key does not permit inventing unavailable shadow measurements. Raw parse details, page text, related-node material, and native messages are excluded.

For a contrast observation, `incompleteReason` is a Fact exactly equal in branch and value to `evidence.messageKey`. For image/label observations it is exactly `{unavailable: 'missing' | 'withheld'}`; no contrast-specific available reason or arbitrary text. These distinctions preserve native incompletes without asserting sufficiency for a later workflow.

#### L1.10 Runtime acceptance, immutable ownership, and exports

The source exports the types `PageAnalysisRun`, `ScanResult`, `Finding`, `ScannerReviewObservation`, `ProviderContext`, `Fact<T>`, `ValidationResult<T>`, and exactly the two callable validators:

```typescript
validateRun(input: unknown): ValidationResult<PageAnalysisRun>
validateScan(input: unknown): ValidationResult<ScanResult>
```

Success is exactly `{ok: true, value: T}` with a detached recursively readonly/frozen validated copy. Failure is exactly `{ok: false, error: 'invalid-run'}` for validateRun or `{ok: false, error: 'invalid-scan'}` for validateScan. Both result wrappers are frozen too. No input value, property path, native exception, diagnostic string, or extra failure key is returned. Both functions are synchronous and pure: no clocks, randomness, browser, filesystem, network, provider, model, or persistent state.

Accept object containers only with `Object.prototype` or null prototype and exact own enumerable **data** properties. Arrays must have `Array.prototype`, dense own enumerable data indices, and the ordinary nonenumerable `length` property; no extra own keys. Reject symbols, nonenumerable declared fields, accessors, extra keys, sparse/extended arrays, unsupported prototypes, undefined, functions, bigints, nonfinite numbers, negative zero, and cycles. Do not require writable/configurable flags: already-frozen valid input remains valid. Catch inspection exceptions as the closed invalid result; no guarantee is made that hostile Proxy traps themselves have no side effects.

Use direct checks and explicit copies, with small cohesive helpers where the same check repeats. Never mutate caller input or retain any caller-owned container alias. Recursively freeze every returned container, including nested context, facts, checks, arrays and wrapper. Validate all entries and preserve collection order, identities, values, and siblings. Ordinary JSON serialization/parsing preserves this contract's data but loses runtime freezing; revalidation creates a newly detached frozen result. No canonical-byte protocol, custom serializer, migration, schema framework, generic state machine, or vendor-domain type is introduced.

#### L1.11 Implementation, loading, commands, and effects

| Boundary | Frozen disposition |
| --- | --- |
| Test owner/path | `test_worker`, only `tests/run-contract.test.ts`. |
| Production owner/path | Separate `code_worker`, only `src/server/domain/run-contract.ts`. |
| Primary ownership | Existing plan, authority/status/navigation/progress documents and guard maintenance, only between worker leases. |
| First-module loading | Ordinary static import of `validateRun`/`validateScan` from `../src/server/domain/run-contract.ts`. Type-only imports may use the same path. No shim, stub, fallback, conditional assertion, existence-only test, skip, todo, or focused-only case. |
| Runner prerequisite | Accepted M101-NVM-001/M101-RUNNER-001 identities; the disposable diagnostic was removed. Recheck relevant environment/tree identity, not historical browser bootstrap. |
| Red syntax check | `node --check tests/run-contract.test.ts`, exit 0. This checks syntax, not behavior or missing imports. |
| Focused and complete current product suite | The exact `npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts` command in the validation section below, from the repository root. These are the same suite while this is the sole product test; run once at an unchanged checkpoint. |
| Initial Red | After test-worker preflight establishes MISSING, complete bounded behavioral tests may fail with expected `ERR_MODULE_NOT_FOUND` for the agreed production module. Report all behavioral assertions as unexecuted, and label initial Red — missing production callable. Other failures are not accepted Red. |
| Green and closure | All accepted tests unchanged, all execute successfully, zero skipped/todo/focused cases, followed by the exact independent `npm.cmd @toolchainOptions run typecheck`, exit 0. No build/start/auto-discovery/real scanner command. |
| Toolchain | Node 24.20.0/npm 11.19.0 via `C:/nvm4w/nodejs`; Python 3.12.10 for guard; all existing locked dependencies. No restore required, no package/configuration/frozen-input changes. |
| Side effects | Only the exact leased source/test path and its ordinary missing parents; permitted npm activity confined by the existing options to `temp/rd002-npm-cache`; primary guard state under ignored `logs/agent-flow-leases/v2/`. Tests are pure in-memory synthetic records. No run data, native acquisition, browser, provider, generated artifact, network work, or cleanup. Preserve cache and guard receipts. |

Guard start/close/status uses the existing CLI documented below and Packet v2 identities: workflow `M1-01-20260830-01`, slice `M101-CONTRACT-01`, unique lease per write turn, phase/attempt/role, exact allowed file, all other paths forbidden, and pinned digest. The primary opens and terminally closes each lease. No worker handles guard state or mutates Git metadata. The existing budget and stop rules remain unchanged.

#### L1.12 Acceptance and evidence limits

The complete test-owned suite must exercise I1–I9: all parent branches and failure categories/relationships; complete nonzero, valid zero, incomplete-only and mixed-bucket cases; absent/extra/contradictory coverage and collection mismatches; all three rule evidence discriminants; permitted unavailable facts versus malformed retained values; both provider contexts; canonical provenance, URL placement and credential rejection; synthetic prohibited-content/unknown-key cases at nested boundaries; stable IDs, duplicate-ID rejection, reordered Findings and retained duplicate locators; caller alias mutation and deep freeze, including sibling preservation; closed unknown input, descriptor/prototype/array rejection, input inspection exceptions and JSON round-trip revalidation. Include representative boundaries for numeric/string grammar and field-dependent relationships. No test may substitute a mock validator or treat import failure as executed behavioral coverage.

Every rule, fact, relationship, path, command and effect above is decided here. Later proof is restricted to actual capture/minimization/DOM correspondence/native completeness/browser cleanup (M1-03), durable publication/reopen and later-update enforcement (M1-02), UI (M1-04), and integration (M1-05). M1-01 cannot certify a page, validate operator trust, or prove a scanner/persistence/provider operation occurred. Those limitations do not excuse a missing validator assertion or worker-selected semantic here.

### Trusted URL direction and runtime re-entry

The owner clarified that this is a developer-operated portfolio project and the developer chooses the URL to process. Primary reconciles that direction with the existing public-HTTPS scope in ADR-0018 and the privacy module: supported URLs, including ordinary redirect destinations, are chosen as non-sensitive local provenance; retain their full standards-normalized identity, with basic HTTPS/credential rejection and no per-component classification, attestation, or withholding subsystem. Page content remains subject to the evidence allowlist, URLs remain excluded from Findings/providers, and semantic detection of a developer's sensitive/private URL mistake is not promised. A completed record still requires an actually observed valid final identity; no unavailable-identity completion exception is adopted. This resolves the responsibility question raised by CR1-F1 without broadening to authenticated/private targets or commercial hostile-target security.

`M101-NVM-001` result: `nvm install 24.20.0 64` and then `nvm use 24.20.0 64` both exited 0. Before selection, the installed Node binary matched the official SHA-256 below and its bundled npm reported 11.19.0. A fresh shell resolves Node/npm through `C:/nvm4w/nodejs` to the new NVM version; Node reports v24.20.0, npm 11.19.0, Python 3.12.10. Both older NVM versions and `settings.txt` remain unchanged. The existing exact `npm.cmd @toolchainOptions run typecheck` exited 0 against the current configuration-only tree. A stdin native-TypeScript diagnostic passed one `node:test` case, including an expected strict-assertion exception; it had zero skipped/todo cases and created no file. It is not the file-based focused contract suite or product Red.

Five recorded package/configuration/manifest fingerprints, all six fixture bytes, and all 29 installed package versions plus installed-lock version/resolved/integrity metadata match the accepted baseline. No dependency restore, npm upgrade, browser bootstrap, cleanup, worker lease, or application write occurred. One Python metadata-check attempt used the Windows default text encoding and failed while reading UTF-8 package metadata; the corrected explicit-UTF-8 diagnostic passed without changing package bytes. No product-test evidence or worker correction allowance was involved. The sole analyst correction was subsequently started and paused unfinished as recorded below. At that historical re-entry, the remaining work was completion of that same correction, both required fresh R3 checkpoints, qualifying focused-runner verification, guarded TDD, and both implementation reviews. The later accepted checkpoints record their completion without resetting any allowance.

All commands run in PowerShell from the repository root. The following read-only discovery commands are usable now:

```powershell
git status --short --branch
git rev-parse HEAD
git diff --stat
git ls-files
node --version
npm.cmd --version
python -B --version
Test-Path logs/agent-flow-leases/v2/active.json
Test-Path temp/rd003-evaluation
Get-FileHash evaluation/rd003-scan-v1.json -Algorithm SHA256
```

Expected planning results are the baseline above, no active lease, absent RD-003 temporary acquisition, and the recorded manifest hash. Changed state requires reconciliation, not reset. Inspect ignored prerequisite locations only as needed; do not copy private temporary material into tracked documents.

### Resumed developer-runtime prerequisite

The owner's continuation instruction authorizes installing the existing pinned Node version through the already installed NVM for Windows and making it the selected developer runtime. Fresh baseline HEAD is `d50f62fd2d883e8757b6001a4b4a59b9ba643e03`, initially clean; the intervening first-module Red amendment is preserved. This external developer prerequisite is not an application installer, dependency selection, repository implementation-worker turn, or permission to bypass the URL/literal gates. No research budget is renewed.

`M101-NVM-001` preflight: NVM 1.2.2 uses `C:/Users/mmjos/AppData/Local/nvm`; `C:/nvm4w/nodejs` is its existing symbolic link to `v24.18.0`. The other installed version is `v20.20.0`. The [version-matched NVM documentation](https://github.com/coreybutler/nvm-windows/blob/1.2.2/README.md#usage) defines `install` and `use`; no NVM upgrade or Unix-style default alias is needed. The official [Node release index](https://nodejs.org/dist/index.json) identifies v24.20.0 with bundled npm 11.19.0, released 2026-08-26. The [release checksums](https://nodejs.org/dist/v24.20.0/SHASUMS256.txt) identify Windows x64 ZIP SHA-256 `6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba` and `win-x64/node.exe` SHA-256 `5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5`. A sandboxed metadata request was denied socket access; the scoped network-enabled read succeeded. No install has run at this preflight checkpoint.

The bounded operation is `& 'C:/Users/mmjos/AppData/Local/nvm/nvm.exe' install 24.20.0 64`, then verification of the new version's binary hash and Node/npm versions, then `& 'C:/Users/mmjos/AppData/Local/nvm/nvm.exe' use 24.20.0 64`, followed by a fresh-shell version/link check. Preserve both older installations and their global packages. Expected effects are the new NVM-owned `v24.20.0` directory, NVM-managed installation staging in the Windows temporary directory, and the existing NVM link/selection metadata when switching. No repository package/configuration, browser, user shell profile, permanent PATH edit, or runtime-manager upgrade is part of the operation. A separate npm upgrade is unnecessary if the bundled version verifies. No locked dependency restore is planned while installed identities remain valid. NVM manages its own installation staging; primary performs no recursive cleanup. Stop on an install/integrity/version failure and inspect residual state before any retry. If post-switch identity validation fails, the sole recovery is switching the existing NVM link back with `nvm use 24.18.0 64`, preserving all installations and failure evidence.

After installation, primary may run the existing `npm.cmd @toolchainOptions run typecheck` against the current tree and an in-memory native-TypeScript `node:test`/`node:assert/strict` diagnostic through `node --input-type=module-typescript -`. These are prerequisite checks, not M101-I1–I9, product Red, or execution of the absent focused contract suite. The stdin diagnostic creates no test file or production callable. The npm options below permit only the already named `temp/rd002-npm-cache` cache and disable scripts, audit, funding, notifications, and retained npm logs; preserve any generated cache, and perform no cleanup or dependency restore. The exact file-based focused runner still needs qualifying verification before first-module Red.

The resumed prerequisite check confirmed that `node --test --input-type=module-typescript -` rejects the literal `-` path (exit 1, `Could not find '-'`); this is an unsupported diagnostic invocation, not product Red. To verify the actual file-based npm runner, primary uses the already permitted disposable runtime diagnostic at exactly `temp/m101-runtime-check/runner.test.ts`. Before creating it, require both file and directory absent and confirm ordinary workspace topology. The file contains only one native TypeScript arithmetic/strict-assertion diagnostic, no product module, callable, substitute, or contract test. Run `npm.cmd @toolchainOptions run test:focused -- temp/m101-runtime-check/runner.test.ts` with the unchanged options below, expecting one pass and no skipped/todo cases. Effects are that one ignored temporary file/directory plus the existing declared npm cache. After observation, verify its exact content hash and remove only that file and its now-empty ordinary parent directory, after absolute workspace-containment checks; never recursively clean or touch other temporary files. This primary prerequisite diagnostic is outside worker preflight and is not a retained application/test implementation. Its runner evidence may support the first-module exception, but it cannot satisfy any product assertion.

### Future validation commands

These commands become executable acceptance steps only after the pinned developer prerequisites are available and the authorized test/source paths exist. They are not results from this planning turn. Use the already documented npm options, without changing tool versions or package metadata:

```powershell
if ((node --version) -ne 'v24.20.0') { throw 'Node 24.20.0 is required.' }
if ((npm.cmd --version) -ne '11.19.0') { throw 'npm 11.19.0 is required.' }
$toolchainOptions = @('--global=false', '--prefix', (Get-Location).Path, '--cache', (Join-Path (Get-Location).Path 'temp/rd002-npm-cache'), '--ignore-scripts=true', '--audit=false', '--fund=false', '--update-notifier=false', '--logs-max=0', '--registry=https://registry.npmjs.org/', '--strict-ssl=true', '--package-lock=true', '--include=dev', '--include=optional')
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts
if ($LASTEXITCODE -ne 0) { throw 'Focused contract tests failed; inspect the phase-specific expected result.' }
npm.cmd @toolchainOptions run typecheck
if ($LASTEXITCODE -ne 0) { throw 'Strict type checking failed.' }
```

The Red packet runs the focused npm command by itself and records its nonzero exit plus the intended behavioral failure or the qualifying first-module missing-callable failure and unexecuted assertions; it must not apply the Green success expectation. Green and closure require every accepted behavioral test to execute, exit 0, no skipped/todo/focused-only cases, and independent strict typecheck success. No `build`, `start`, unscoped test auto-discovery, browser, provider, or model command is justified here. If other tests exist when execution starts, freeze their exact affected and complete-suite command before the relevant packet; do not silently replace this command mid-lease.

Before any worker lease, resolve every applicable command slot in the reviewed contract and packet:

| Slot | Current disposition / required freeze |
| --- | --- |
| Runtime and guard prerequisites | Exact Node/npm/Python executable paths and versions, environment fingerprint, and readable locked package identities. Node/npm are now verified through M101-NVM-001; retain that pinned developer setup and recheck it before worker writes. No application/runtime installer is added. |
| Dependency restore, only if needed | Existing README command `npm.cmd @toolchainOptions ci`; freeze its exact working directory/environment and authorize the bounded prerequisite operation before running. It replaces generated `node_modules/`, may populate only its declared task cache, disables lifecycle scripts, and must leave manifest/lock/configuration bytes unchanged. Do not run it merely for a documentation change. |
| Manifest/lockfile bootstrap | None: already established by completed RD-002; generation, dependency additions, lock updates, and install-script workarounds are forbidden. |
| First Red loading and exact exports | Freeze the production import path/exports and complete behavioral tests. Independently establish toolchain/runner readiness; accept only the exact expected missing-module/export failure under ADR-0024 with explicit unexecuted-assertion reporting. Wrong runtime/path, syntax, dependency, or unrelated failures remain invalid. No dummy production implementation, loading shim, or permanent harness probe. |
| Focused/strict/complete-suite checks | Exact commands above, with the accepted test file and phase-specific exit expectations; no output-producing compiler configuration. |
| Clean-state preparation and generated effects | Pure contract tests need no run directory, browser state, model, network, or cleanup fixture. Freeze any unavoidable runner/npm cache effect explicitly. A read-only preflight must remain read-only; primary handles a needed safe diagnostic outside it. No routine recursive cleanup or deletion of shared dependencies/caches. |
| Guard start/close/status | Primary projects the complete packet into the existing guard CLI, records fresh IDs/digest, and requires fresh `closed-compliant` closure plus actual-diff inspection. Use the [canonical commands](../../../.codex/write-lease-guard.md#commands); never reuse illustrative RD-003/M1-03 IDs. |
| Cleanup | None planned beyond any exactly inventoried M1-01 temporary output introduced by a reconciled prerequisite step. Resolve absolute containment and ordinary non-reparse topology first; preserve unrelated/previous-task caches, dependencies, and lease evidence. Ambiguity stops cleanup. |

## Validation and Acceptance

The original planning-only turn used `TDD: Not applicable` because it changed only the ExecPlan, task activation, navigation, and status/progress documentation. Replacement evidence is actual baseline inspection, complete authority/readiness mapping, independent plan review, relative-link/anchor and Markdown structure checks, unchanged frozen/configuration identities, `git diff --check`, and documentation-only diff inspection. It proves no M1-01 behavior.

Execution must satisfy M101-I1–I9 and the roadmap's exact Verification with accepted preflight classification, test-owner evidence, intended Red when required, minimum Green, strict compilation, terminal lease identities, primary inspection, and both risk-routed implementation reviews. A pure record validator can check consistency and preserve declared counts, but cannot prove that an upstream scanner supplied every native node; M1-03 must compare native results with its complete projection and M1-05 must integrate that evidence. The same honesty boundary applies to disk durability and provider independence in a running application.

The documentation closure inventory initially comprises this plan; [roadmap](../../DEVELOPMENT_ROADMAP.md); [plan index](../README.md); [task progress](../../progress/m1-01-run-and-scan-contracts.md) and [progress index](../../progress/README.md); [root README](../../../README.md); [documentation index](../../README.md); [requirements status](../../PROJECT_REQUIREMENTS.md); [delivery readiness](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md); and the current-status sentences in [concept](../../PROJECT_CONCEPT.md) and [context](../../PROJECT_CONTEXT.md). At execution closure update existing developer instructions with the actual test/import boundary, and update any materially affected owning lifecycle/architecture documentation without duplicating the field definition. Do not rewrite completed RD-003 history or change Accepted requirement/ADR statuses merely because a contract is implemented.

The material execution impact additionally includes [trusted-operator ADR-0018](../../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md), [privacy requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md), [lifecycle implementation scope](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), and [architecture navigation](../../architecture/README.md). These fifteen existing documents own the changed URL assumption, exact command, implementation/status evidence, and links; no additional authority, workflow machinery, or requirement/ADR status change is needed.

Run documentation link/anchor and structural checks on every changed document, verify unchanged dependency/configuration/fixture scope, and run `git diff --check`. End the handoff with an explicit documentation-impact statement. No commit, push, application-support claim, or downstream activation is authorized by this plan.

## Idempotence and Recovery

Read-only inspection and pure deterministic contract checks are repeatable under their recorded environment. Existing accepted evidence is reusable only with unchanged command, working directory, relevant tree, environment, and no-drift identity. Hash drift in the completed scan freeze stops readiness; it does not permit silently rewriting RD-003 expectations.

An interrupted or rejected worker turn stops writing and returns to the primary for pinned guard closure and actual-tree reconciliation. Preserve user/peer work and failed evidence. Do not reset, stash, delete an active pointer, weaken tests, broaden a lease, or create fake data to continue. Resume only from the last accepted barrier using the remaining budget and a fresh packet/lease. A wrong or stale Red cannot authorize Green. A contract change invalidates affected test/evidence acceptance before another write turn.

There is no run-store migration, durable-data cleanup, browser process, or provider request in this task. A missing runtime is a prerequisite failure, not permission to change RD-002 pins or introduce an installer. A new significant mechanism or accepted-scope conflict stops for owner/ADR direction. Completion of this planning request never bypasses the subsequent execution-authorization boundary.

## Artifacts and Notes

### Documentation gate and task completion — M101-CLOSURE-002

Primary resolved the integrated review's sole Minor and passed the documentation gate before marking only M1-01 **Complete**. Checks covered all fifteen affected documentation owners, 646 relative links, 158 anchors, all fifteen required plan sections, four PowerShell blocks parsed without execution, unchanged requirement/decision tables and ADR statuses, five pinned configuration/manifest hashes, six fixture byte matches, unchanged HEAD/empty index, no active lease and git diff --check exit 0. The complete product suite remains 58/58 passing with strict typecheck exit 0 and exact M101-CLOSURE-001 source/test/L1 identities; documentation-only closure adds no reason to repeat those identical executable checks.

Documentation impact is the existing fifteen-owner inventory above: URL responsibility clarification, actual developer command, lifecycle/architecture implementation boundary, roadmap/current status, plan/progress evidence and navigation. No new authority or workflow system was created. After this gate passed and the roadmap marked only M1-01 Complete, the same task plan was moved to completed/ and its relative links repaired. No other task, source/test change, dependency restore, browser bootstrap, staging, commit or push is authorized or performed.

The post-archive check passed **648 relative links and 160 anchors across fifteen affected documents**, all fifteen plan sections, five unchanged configuration/manifest hashes, six unchanged fixture byte comparisons, unchanged HEAD/empty index, absent active lease and git diff --check exit 0. The roadmap has four Complete tasks (RD-001–RD-003 and M1-01) and all 24 remaining application tasks Not started; no task is active. Source and tests retain the exact reviewed hashes. The same filename/history is preserved and twelve inbound documents now resolve to the archived plan.

The initial archive precheck stopped before any mutation because rebasing the ADR-0018 link changes the literal section's bytes. Primary inspected the complete subsection diff: only that relative link changed for the plan's additional archive directory level, resolving to the same authority. The corrected precheck required exactly this link-only difference before the move. Archived L1 SHA-256 is `a17b00486f6823eb4e0d13b930190aa24a4c849a9d3f9d2a05ecd8aef1712bd1`; reversing that one relative-link rebase restores reviewed SHA-256 `dace1a36c2a5cf87b3e96efec05d86cd7af3d8e66a62c1c52fecb5573e726578`. No literal semantics, source, test, authority decision, or budget changed. No further work is required for M1-01.

### Integrated review and documentation reconciliation — M101-INTEGRATED-001

A different fresh Sol-max critical reviewer assessed the complete candidate and returned **PASS WITH FOLLOW-UPS**: no Blocker, no Major, and one Minor `M101-INTEGRATED-M1` concerning four stale status statements in this plan. Primary accepted the implementation verdict and corrected those exact statements: the planning baseline and earlier re-entry work list are explicitly historical; the Decision Review Contract recognizes accepted execution and the satisfied planning-only boundary; the artifact summary recognizes completed freeze, leases and validation. No historical outcome, L1 literal, source, test, command, or scope changed. This resolves the sole follow-up within the planned primary documentation gate, without another worker turn or allowance.

The reviewer independently passed all 58 tests and strict typechecking under the pinned runtime. Its additional in-memory checks covered 104 nested containers, 1,664 malformed-input rejection assertions, 210 positive assertions, 512 coverage assertions and 50 incomplete-reason assertions, including reordered enumeration, descriptor access without property-get traps, detached ownership, freezing and JSON revalidation. It verified the complete source/tests/authority diff, original test prefix, four lease contracts/receipts and all eight payload digests/associations, no active lease, unchanged HEAD/index and whitespace.

Reviewed candidate-tree SHA-256 was `d740711c994af7b99d2b8ed6192e8ffaf521302d8207c5fe15d4e9d6cb50da3a`; plan SHA-256 was `68c6c6f9c9fe07fa3ea9f8a94189b45ca3e350d777fc7db82ed28b0d72779fcc`. Source, test and L1 retain M101-CLOSURE-001's exact hashes. These post-review status/history corrections intentionally change documentation identity only. Primary independently parsed four documented PowerShell blocks without execution and verified all affected requirement/decision table rows and ADR status unchanged. The documentation gate must pass before marking only M1-01 Complete, then moving this same plan and repairing links; source/test command evidence remains valid for these documentation-only changes.

### Accepted S3 review and closure candidate — M101-CLOSURE-001

The same fresh slice reviewer completed its single corrected-surface loop as `M101-CONTRACT-01-REVIEW1-C1`: **PASS**, no remaining Blocker, Major or Minor. It rechecked every L1 subsection and I1–I9; both M101-REVIEW1-M1 and M101-C1 are resolved. Independent evidence passed 58/58 tests and strict typechecking, 4,608 state/provenance combinations, 112 rejection assertions over 56 malformed-array variants, seven valid reordered-enumeration controls, accessor/inspection cases, detached aliases, recursive freezing and JSON revalidation. Source/test/L1/frozen identities and compliant correction lineage matched. The original REVISE and earlier failures remain above/below as historical evidence.

Primary then accepted the full source/test boundary and current authoritative suite. The exact focused command in Concrete Steps is also the complete current product suite because `tests/run-contract.test.ts` is the only product-test file; it ran once at this closure candidate and passed **58/58**, zero failures/skips/todo/cancellations, exit **0**. The independently invoked exact strict typecheck exited **0**. Node **24.20.0**, npm **11.19.0**, Python **3.12.10**, corrected source SHA-256 `9c728164332b50cf22f57a1903a5dda88c146d3174e00fcb3798a51fd5add42c` and unchanged accepted test SHA-256 `fe0b57fde3ed6af0a04458af4b41fd890435cc2fac60f795b33d75023b222ee2` match. No duplicate unscoped test run, build/start command, browser bootstrap, provider operation, or dependency restore was added.

The test-relevance audit retains the original 29 behavioral groups for the complete literal contract, 28 table-generated regression cases for the two validators/string-Symbol/seven-array boundary combinations, and one positive reordered-enumeration case. Helpers construct synthetic data and assert real public results; they do not substitute production behavior. No mock, snapshot, retained test fixture, skip/focus/todo marker, speculative later-task assertion, or new dependency exists. The original test prefix remains byte-identical and every accepted test executed during corrected Green.

The fifteen affected documentation owners now name the actual module, test/import command, current implementation boundaries and owner-clarified URL assumption. Candidate checks passed **645 relative links, 157 anchors, all fifteen plan sections, five unchanged configuration/manifest hashes, six fixture byte matches, empty index/unchanged HEAD, no active lease, and git diff --check exit 0**. All 29 installed package version/resolved/integrity records match the authoritative and hidden lockfiles. A naive inventory diagnostic first attempted an absent optional platform package; the corrected installed-entry inventory passed, confirming all 51 absent lock entries are optional, without restoring or changing anything. That superseded diagnostic is not a product-test failure or worker correction.

These results establish M1-01's pure record contract and scoped evidence only. They do not prove upstream native completeness, DOM correspondence, actual cleanup, durable publication/reopen, provider execution, or UI behavior. No application-source changes remain planned. The different fresh integrated critical review must still assess this complete candidate; the roadmap stays In progress and the plan stays active until that review and documentation closure pass.

### Accepted correction Green — M101-CONTRACT-01-GREEN2

The same code worker used its sole green attempt 2, parent GREEN1, to require the reported array key set to contain exactly length and every canonical index. Reordered enumeration remains valid. It also removed Minor M101-C1's inaccurate comment without changing regex behavior. Primary reconstructed the previous source bytes by reversing exactly those changes and matched GREEN1's SHA-256, confirming no unrelated source edit. Corrected source SHA-256 is `9c728164332b50cf22f57a1903a5dda88c146d3174e00fcb3798a51fd5add42c`; accepted RED2 test SHA-256 remains `fe0b57fde3ed6af0a04458af4b41fd890435cc2fac60f795b33d75023b222ee2`.

Before editing, the exact focused command reproduced RED2: exit 1, 30 passed and 28 intended failures. After the minimum correction, it passed **58/58 tests**, zero failures/skips/todo/cancellations, exit **0**; independent strict typechecking exited **0**. No Refactor, test edit, contract change, dependency, or new mechanism occurred.

Lease `M101-CONTRACT-01-GREEN2`, owner `m101-code-worker`, phase green/attempt 2, parent `M101-CONTRACT-01-GREEN1`, digest `0567ae580bf360a3bd801b46669784b613a8b9a7b909846a5ba451bef17121ce`, freshly closed **closed-compliant**, exit 0; receipt `bc29ea555bb17dd2c2e661e1c9a00e41f6d26388f300a885ee2d559cc83a45b0`. Only the source changed; no forbidden/unleased or index/HEAD/ignore-control drift occurred. Primary accepted the actual source diff, immutable test boundary and decisive evidence. Both worker correction allowances are consumed. The complete corrected S3 review, different fresh integrated review, final verification and documentation closure remain required.

### Accepted correction Red — M101-CONTRACT-01-RED2

The same test worker used its sole red attempt 2, parent RED1, to append 48 lines covering reported array key identity at seven array locations through both validators, plus acceptance of reordered enumeration. Primary inspected every appended line; the original 1,078-line test prefix remains byte-identical at SHA-256 `b33abc20a27422d354d25abb5e51859d0a1d4a4a1eff6ecc20ebcd515b72f945`. New complete test SHA-256 is `fe0b57fde3ed6af0a04458af4b41fd890435cc2fac60f795b33d75023b222ee2`; source remains GREEN1's hash. These tests exercise the public boundary, not a private helper, and contain no skipped/conditional assertion or test weakening.

The exact focused command exited **1: 58 tests, 30 passed, 28 failed, zero skipped/todo/cancelled**. Every malformed string/Symbol case reached the intended closed-rejection assertion and instead received success. All original groups and the reordered-enumeration case passed; strict typechecking exited **0**. This is genuine behavioral Red, not the first-module exception. Primary reconciled the actual diff, unchanged source defect and reviewer reproductions with these decisive results and accepts the corrected test boundary for Green.

Lease `M101-CONTRACT-01-RED2`, owner `m101-test-worker`, phase red/attempt 2, parent `M101-CONTRACT-01-RED1`, digest `fb4fd96300746805d8689d7da7eaac28f486afbe4ef7a1e8de4f4c821e713166`, freshly closed **closed-compliant**, exit 0; receipt `d63d59ecb3d5a5df2dc71928e9c9921bfcd9310308854476091ab79e8959bac2`. Only the test file changed; index/HEAD/ignore controls and all unleased paths were preserved. No active lease remains. The test correction allowance is consumed; no further test write is authorized. Because these primary annotations change the baseline, Green2 must reproduce the accepted 28 behavioral failures before editing source.

### S3 findings and correction — M101-CONTRACT-01-REVIEW1

Fresh Sol-max `critical_reviewer` REVIEW1 reviewed the complete L1/I1–I9 slice and returned **REVISE**, with no Blocker, one Major `M101-REVIEW1-M1`, and Minor `M101-C1`. `readArray` checked only reported key count: a legal Proxy could replace a reported index with an extra string/Symbol key, while descriptor access still read the omitted index. Fourteen malformed scans and their run wrappers were accepted at seven array locations. The copied output omitted the extra value, so this is incorrect acceptance, not observed disclosure. L1.10 already requires exact keys and rejection rather than silent filtering; no new semantics or authority is needed. Valid reordered key enumeration must remain accepted.

The reviewer independently passed all 29 groups and strict typechecking, 4,608 state/provenance combinations, 35 exact regex line-terminator cases, and additional inspection/freeze/alias/JSON checks. It confirmed the source/test/L1/configuration identities and compliant original receipts; declared post-close documentation/source drift is not a worker violation or reusable global no-drift proof. Minor M101-C1 confirms the inaccurate regex comment identified by primary.

Primary accepts the findings and reconciles this isolated uncovered rejection gap. Initial GREEN1 execution remains historical evidence but cannot establish I5/I8 completeness. Use the same test worker's sole red attempt 2 to establish genuine behavioral failure and the same code worker's sole green attempt 2 to fix that accepted regression plus the comment. Preserve all existing tests and frozen L1; freshly open and terminally close each identical path contract. The single review-correction loop rechecks the complete corrected surface. No budget reset, new researcher, contract expansion, or primary source/test edit is authorized.

### Accepted Green — M101-CONTRACT-01-GREEN1

The separate Sol-medium code worker created only `src/server/domain/run-contract.ts` (496 lines), SHA-256 `c1da9a608888086a6428fce484dd1b22fc05d5cf975c5806d6b7c8f612fef30e`. Primary inspected the entire implementation and accepted its scoped Green behavior: direct descriptor-based closed-record checks and explicit detached copies, finite rule/state branches, immutable typed/runtime results, exact coverage and evidence relationships, and content-safe invalid results. It imports no runtime dependency and contains no scanner/service/provider/filesystem work or future sections. Accepted test SHA-256 remains `b33abc20a27422d354d25abb5e51859d0a1d4a4a1eff6ecc20ebcd515b72f945`.

Before source creation, the worker reproduced the exact focused initial Red under its fresh baseline: exit 1, expected missing-module path, no executed assertions. After implementation the focused command passed all 29 groups. The first strict typecheck exited 1 on two generic-helper typing diagnostics; the worker corrected only implementation types within the same Green turn. Final focused execution passed **29/29**, zero failed/skipped/todo, exit 0; the independent strict typecheck exited **0**. No Refactor or attempt-2 correction occurred. Earlier typing-failure evidence is superseded by these final results, not erased; no test was changed or weakened.

Lease `M101-CONTRACT-01-GREEN1`, owner `m101-code-worker`, phase green/attempt 1, contract digest `2be5920cad3d206a4ca3dac768e68a293201483729288c9cb0cdbcb70d0bdfb7`, freshly closed **closed-compliant**, exit 0, receipt digest `dcd1019afb489a09c115c00c53026f8b70fe8b07e23b7e6bc6292c71ee86bd3f`. Only the source file was created; no forbidden/unleased change or index/HEAD/ignore-control drift occurred. Primary verified both actual file hashes after closure and inspected the complete source and tests rather than accepting the receipt alone. No active lease remains.

Primary inspection identified one Minor documentation-in-code issue, `M101-C1`: readPattern's comment incorrectly attributes trailing-newline acceptance to the exact unflagged JavaScript `$` grammars. FINAL1 independently showed those pinned grammars reject such suffixes. The full-match check itself is valid and tests pass; remove or accurately reword the comment without behavior change. Hold this correction until the fresh S3 review finishes so any supported same-contract findings can share the sole remaining code-worker correction and review loop. No primary source edit is permitted.

### Accepted initial Red — M101-CONTRACT-01-RED1

The test worker created only `tests/run-contract.test.ts`. Primary inspected the complete actual test file against L1/I1–I9 and accepted its 29 behavior groups with table-driven positive, rejection, failure, preservation and immutable-ownership cases. Shared helpers only construct/mutate synthetic inputs and assert outputs; the tests statically import the real validators. There is no stub, mock validator, temporary substitute, skip, todo, focused marker, condition on module availability, or downstream behavior. The file's SHA-256 is `b33abc20a27422d354d25abb5e51859d0a1d4a4a1eff6ecc20ebcd515b72f945` (1,078 lines); this exact test boundary is frozen for Green.

`node --check tests/run-contract.test.ts` exited 0. The exact focused npm command exited 1 with `ERR_MODULE_NOT_FOUND` for the agreed absent `src/server/domain/run-contract.ts`. Node reported one failed test-file load, zero passes and zero skipped/todo. **Initial Red — missing production callable: all assertions in all 29 behavior groups were unexecuted.** This is accepted only under ADR-0024 after the established runner/preflight evidence; it is not behavioral failure or passing coverage.

Lease `M101-CONTRACT-01-RED1`, owner `m101-test-worker`, phase red/attempt 1, contract digest `a91a8cf36784ccc30d61056553dadef0de45a21bb468f9dcb1a9f2187643336c`, freshly closed **closed-compliant**, exit 0, receipt digest `5196fd5faea1c155e235ada080c5fd7085344af817e19f452441084243da0a0b`. Only the test file was created; no forbidden/unleased changes, index/HEAD/ignore-control changes, or active pointer remained. Primary independently confirmed the exact file/hash, absent source, all 29 groups, no skip/focus/todo markers, preserved thirteen documentation paths and empty index, and `git diff --check` exit 0. Administrative compliance supplements, not replaces, the inspected test contract and expected failure.

These primary annotations occur after terminal closure. Because they change the repository baseline, the separate Green worker must reproduce the qualified Red under its fresh lease before its first source write, then execute every accepted test unchanged and the independent strict typecheck. This is a freshness check, not another Red cycle or an allowance reset. No test correction was used.

### Accepted test preflight — M101-CONTRACT-01-PREFLIGHT1

The separate Sol-medium test worker returned **MISSING** after read-only inspection with no lease or changes. Primary accepts that classification: root/exact-path checks show no source or tests; Git lists no tracked source/test; package scripts and strict compiler includes support the agreed paths; pinned executables, five configuration/manifest hashes, L1 hash, and M101-PREFLIGHT-BASE-001 identity match. Existing M101-RUNNER-001 establishes the independently verified focused runner. The absent focused test was correctly not executed; no behavioral assertion or Red is claimed.

One read-only Get-FileHash diagnostic guessed a nonexistent manifest location and exited 1; the worker then verified the canonical `evaluation/rd003-scan-v1.json` identity. No mutation, product failure, contract change, or extra preflight allowance resulted. HEAD, empty index, thirteen primary-owned documentation changes, and absent active lease remain reconciled. Next: fresh test-only Red lease and complete bounded behavioral suite, then actual-diff/evidence acceptance before separate Green.

- `M101-RUNNER-001` (2026-08-30): `npm.cmd @toolchainOptions run test:focused -- temp/m101-runtime-check/runner.test.ts` under Node 24.20.0/npm 11.19.0 exited 0 with one pass and zero skipped/todo cases. Disposable file SHA-256 was `46faacc28f1f58e1af3e4bdab08cd886c65f70d574d35ebbf6d543be098a2402`; its content was unchanged after execution, then only that exact file and its empty ordinary parent were removed after containment checks. The existing declared npm cache remains. This proves the configured native-TypeScript test/assert runner, not run-contract behavior. No source or retained product test was created.

- `M101-PAUSE-DOC-001` (2026-08-30): safe-pause documentation checks passed across thirteen existing documentation paths: 587 relative links, 138 anchors, all fifteen plan sections, final-newline/whitespace checks, unchanged HEAD and empty index, absent source/tests/active lease, and unchanged downstream task statuses. RD-001 through RD-003 remain Complete; only M1-01 is In progress, paused by the owner. `git diff --check` exited 0. The task cache created by the permitted npm check is preserved. No task implementation or completion is inferred. Documentation impact: synchronized existing authorities, plan, status/navigation, and progress records for trusted-URL clarification, pinned-runtime evidence, and the precise paused analyst boundary; preserved all earlier history, configuration/frozen bytes, and research allowances. No source, product test, new tracked artifact, archive move, staging, commit, or push occurred.

- `M101-EXEC-STATE-001` (2026-08-30): fresh HEAD `96fdc0716570508ea8275f2fd19e1596fd1c45f7`, initially clean on `codex/m1-01-run-and-scan-contracts`; completed prerequisites and unchanged frozen/configuration hashes; six fixture byte matches; 29 installed package versions and installed-lock version/resolved/integrity fields match the authoritative lock. Global executables are `C:/nvm4w/nodejs/node.exe` and `npm.cmd`, reporting `24.18.0`/`11.16.0`; the bundled workspace Node reports `24.19.0`; neither was substituted. Python at `C:/Users/mmjos/AppData/Local/Programs/Python/Python312/python.exe` reports `3.12.10`. There is no active lease, application source/test, or RD-003 acquisition. Guarded writes never started. Primary retained workspace-scoped documentation ownership; the configured research roles used their exposed Sol high/xhigh settings and read-only assignments.
- `M101-EXEC-DOC-001` (2026-08-30): primary blocked-handoff validation passed across exactly eleven documentation paths: 537 relative links, 119 anchors, all fifteen required plan sections, four JSON parses, four PowerShell blocks parsed without execution, unchanged twelve configuration/frozen paths and six exact fixture contents, unchanged requirement/OD table rows, and `git diff --check` exit 0. HEAD is unchanged, index empty, no active lease/source/test exists, the same plan remains active/unarchived, RD-001–RD-003 remain Complete, and the other 24 application tasks remain Not started. The focused contract command, strict typecheck, test-relevance audit, S3 review, and integrated review were not executed because literal/first-Red and pinned-runtime gates remain unsatisfied. No passing implementation evidence is inferred. Final readback verifies the result annotations without repeating runtime or browser work.

Documentation impact for this execution stop: updated eleven existing plan, status, navigation, and progress owners to record authorization, bounded research evidence, the two unresolved owner boundaries, and Blocked status. Requirement/ADR meanings and statuses, product scope, RD-003 history/inputs, package/configuration bytes, and all downstream task statuses remain unchanged. No source/test, new artifact, lease, restore, provisioning, archive move, staging, commit, or push occurred.

- `M101-STATE-001`: read-only planning baseline and readiness facts recorded above. Source/configuration SHA-256 values: `package.json` `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98`; `package-lock.json` `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`; `tsconfig.json` `3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde`; `vite.config.ts` `8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07`.
- Research reports and synthesis are recorded above; literal freeze/checkpoints, worker assignments, terminal leases, corrected Red/Green, and implementation validation are now complete with the accepted evidence recorded here. Record only concise accepted outcomes and decisive evidence here; no transcripts, copied packet templates, ignored guard JSON, generated ledger, or telemetry.
- The existing [progress record](../../progress/m1-01-run-and-scan-contracts.md) summarizes accepted material checkpoints only. It is not another status authority.

### Accepted planning checkpoint

`M101-PLAN-REVIEW-001` (2026-08-30): a fresh `independent_reviewer` returned PASS with no Blocker, Major, or Minor on plan SHA-256 `e942dc9d150e11efef08d5010fac3ca54593ecbda2ac6247ac0ad58bbcaa880a` at HEAD `47bf64e881dd4577b7bdee1e6e00b4fd1c208c44`. The reviewer inspected the complete artifact, activation/progress diff, authorities, future literal and first-Red gates, scope, ownership, and budgets; independently checked configuration/manifest/six-fixture hashes, current runtime versions, absent application paths and active lease, empty index, and whitespace. Primary reconciled that verdict with the actual tree and accepts it for planning only. No future R3 research or S3 implementation checkpoint is satisfied by this review.

`M101-DOC-001` (2026-08-30 17:19Z): primary validation of the eleven documentation paths passed 532 relative links and 114 anchors outside fenced examples, all fifteen plan sections, both PowerShell blocks' syntax without execution, final newlines/trailing whitespace, and `git diff --check`. The scope is nine modified status/navigation documents plus this plan and its progress record; no application, dependency, configuration, fixture, or frozen-manifest change exists. Required contract tests and strict typechecking were not run under the mismatched global runtime. These numbers identify the pre-handoff-record checkpoint; final readback also checks the review/result annotations added afterward.

`M101-DOC-002` (2026-08-30): final handoff readback passed 533 relative links, 115 anchors, all fifteen required sections, both command blocks' syntax, and whitespace. Twelve package/configuration/frozen-input hashes are unchanged and four JSON files parse. Exact scope remains eleven documentation paths, the index is empty, HEAD is unchanged, no application source/tests or active lease exists, RD-001 through RD-003 remain Complete, and the other 24 application tasks remain Not started. Requirement/decision table rows are unchanged. Only M1-01 planning is active; no runtime or behavioral verification is inferred from these checks.

Documentation impact: updated the existing task/status/navigation owners and added the task-scoped plan/progress record. Requirement and ADR statuses, product behavior, dependencies, and the completed RD-003 freeze/history are unchanged. No commit or push was made.

## Interfaces and Dependencies

The implemented source surface is `src/server/domain/run-contract.ts`, with pure application-owned exports for the minimum run/scan types and unknown-input checks. The complete signatures and serialized fields are frozen in L1 above after both required R3 checkpoints passed. `tests/run-contract.test.ts` is the independently owned focused acceptance boundary. Both paths fit the current strict compiler configuration. Keep framework/vendor runtime types and privileged dependencies outside these domain exports; the future client may import types without gaining service execution authority.

Use native JSON and direct TypeScript checks; the existing Node test/assert libraries are sufficient. There is no new schema library, framework, package, service, or executable configuration. The contract prepares one versioned `run.json` shape; it does not create that file, its directory, or a storage API. Reuse RD-003's actual evidence and rule meanings without importing fixture-only policy or adding public-scan claims.

## Revision note

2026-08-30 / primary coordinator: Created the M1-01 planning-only ExecPlan after full current-state and routed-authority review. Recorded completed prerequisites, the current runtime mismatch, future literal/research and implementation barriers, one coherent TDD slice, exact ownership/command boundaries, critical privacy/immutability review, and YAGNI exclusions. No application implementation was authorized or performed in this turn.

2026-08-30 / primary coordinator: Recorded the independent planning review PASS with no findings and passing documentation validation. Updated only progress, outcome, and evidence annotations after that verdict; the reviewed scope, decision/worker gates, command blocks, and acceptance contract remain unchanged.

2026-08-30 / primary coordinator: Recorded the subsequent explicit execution instruction and fresh clean baseline. The original planning review remains planning-only evidence. No worker write, toolchain substitution, downstream activation, commit, or push is authorized by this annotation.

2026-08-30 / primary coordinator: Recorded the single discovery, CR1/CR1-F1 research stops, mandatory DA1 OWNER DIRECTION, unused review/worker gates, and consumed research allowance. Synchronized only M1-01 to Blocked and preserved the active plan and original planning history. No literal policy, test exception, implementation, runtime provisioning, requirement/ADR amendment, or downstream activation was adopted.

2026-08-30 / primary coordinator: Applied the later owner-authorized first-module Red amendment from ADR-0024. Reconciled the acceptance, command, and evidence language while preserving the earlier stop as history. URL retention, runtime readiness, literal/review gates, and budgets remain unchanged; no worker preflight, lease, test, source, or implementation result was created.

2026-08-30 / primary coordinator: Resumed from clean HEAD `d50f62fd2d883e8757b6001a4b4a59b9ba643e03`, installed and selected the pinned Node/npm through existing NVM, verified prerequisite identities and current-tree typechecking, and reconciled the owner's trusted-developer URL clarification in the existing authorities. Resumed the sole remaining analyst correction without resetting budgets. The owner then requested a safe pause for an execution-mode change; no fresh review, test preflight, lease, source, or product test was started.

2026-08-30 / primary coordinator: Recorded continuation after the mode-change pause and fresh no-drift prerequisite checks. The same unfinished DA1-C1 correction resumes; no new research allowance, reviewer, worker, or lease is implied.

2026-08-30 / primary coordinator: Completed the authorized literal freeze, guarded TDD and bounded correction, accepted both implementation reviews, resolved the integrated documentation follow-up, and closed only M1-01 after full verification and documentation reconciliation. Preserve all previous planning/execution stops and budgets; archive this same plan and repair navigation without changing L1 or application files.
