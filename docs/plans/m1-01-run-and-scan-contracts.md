# Define the minimum run and scan contracts

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

**Owning task:** [M1-01 — Define the minimum run and scan contracts](../DEVELOPMENT_ROADMAP.md#m1-01--define-the-minimum-run-and-scan-contracts). **Phase:** planning only. The owner's 2026-08-30 request selects this exact dependency-ready task and authorizes this plan and its activation records; it does not request implementation in this turn. M1-01 is `In progress` for planning, not Complete. Execution requires a subsequent owner instruction to execute M1-01. M1-02 through M1-05 and all later tasks remain unselected.

## Progress

- [x] (2026-08-30 17:07Z) Reviewed the clean `47bf64e` baseline, roadmap, applicable authorities, completed RD-003 evidence, frozen-input hashes, and current development prerequisites; see `M101-STATE-001` below.
- [x] (2026-08-30 17:07Z) Defined this task-only plan, its literal-freeze barrier, one coherent behavior-bearing slice, ownership, verification, and exclusions. No application file or dependency was changed.
- [x] (2026-08-30 17:19Z) Accepted fresh independent plan review `M101-PLAN-REVIEW-001`: PASS with no findings. Documentation-only validation passed; see the planning checkpoint below. This does not pass the future literal or implementation gates.
- [ ] Receive owner authorization to execute M1-01 and re-establish current-tree readiness and the pinned runtime.
- [ ] Freeze the complete public-run literal contract through the bounded research/decision route below; no worker may invent its semantics.
- [ ] Accept read-only test-worker preflight, then the applicable guarded Red/characterization and separate Green evidence.
- [ ] Accept S3 work-slice review, different fresh integrated review, test-relevance audit, and final verification.
- [ ] Pass documentation closure, mark only M1-01 Complete, archive this same plan, and report the next eligible tasks without starting them.

## Surprises & Discoveries

- RD-003's manifest explicitly limits its evidence policy to the six controlled fixtures. Its fixed target selectors, one-target expectations, `email` input, offline loading, and evaluation process supervision are not public-page contract defaults. Evidence: `evaluation/rd003-scan-v1.json`, `evidencePolicy.scope`, and the [accepted native observations](completed/rd-003-scan-evaluation-boundary.md#accepted-setup-and-native-observations--rd003-observations-001).
- The required runtime is not the current global runtime: read-only commands returned Node `v24.18.0` and npm `11.16.0`, while RD-002 pins `24.20.0` and `11.19.0`. The reviewed RD-003 temporary acquisition has been removed. Installed dependencies exist, but this does not prove that a fresh strict compiler or test command passes under the required runtime.
- There is no application source or retained product test. Preflight must establish the missing capability from the actual tree and usable runner, not infer `MISSING` from one failed search or accept a broken environment as Red.

## Decision Log

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

The planning request is complete. The primary created this bounded ExecPlan and synchronized activation/navigation/status records; a fresh independent reviewer passed the complete planning artifact with no findings. Documentation-only validation passed. RD-003 is a completed prerequisite, and M1-01's directly applicable Must requirements and decisions are Accepted at their recorded MVP scopes. No application implementation, literal-contract selection, test execution, or runtime provisioning occurred. M1-01 remains In progress for planning, not Complete. Next: an explicit execution request, then current-tree/prerequisite checks and the public-run literal freeze before worker preflight or writes.

## Purpose / Big Picture

M1-02, M1-03, and M1-04 need one shared meaning for a run, its scan evidence, failure, and selected provider context before service, scanner, and UI work can proceed independently. M1-01 supplies that small contract and executable validation, without implementing those consumers.

After execution, a reviewer can run focused tests and the independent strict compiler check to observe valid nonzero and zero completed records, separate native incomplete observations, failed/running records, preservation of unavailable individual facts, closed content-safe fields, stable Finding addressing, and immutable run/scan values. These are contract-level results, not proof of navigation, actual axe execution, durable disk writes, provider readiness, or a working UI.

## Context and Orientation

### Current project state and readiness

`M101-STATE-001` records the planning baseline: branch `codex/m1-01-run-and-scan-contracts`, HEAD `47bf64e` (`feat: freeze RD-003 scan evaluation boundary (#6)`), clean index/worktree, and 104 tracked files before this change. The repository contains its accepted planning/architecture baseline, agent workflow, minimal package/compiler/build configuration, the scan-only manifest, and exactly six controlled HTML fixture states. It contains no application source, retained product tests, service entry, client entry, corpus snapshot, retrieval, provider adapter, review, or comparison implementation. All 25 application tasks were Not started before this exact planning activation.

RD-001, RD-002, and RD-003 are Complete in the roadmap. The [RD-003 renewed closure](completed/rd-003-scan-evaluation-boundary.md#reproducibility-cleanup-and-renewed-closure) preserves original six native observations, LF checkout verification, the successful bounded clean-start retry, independent reviews, cleanup, and the earlier failures. Current manifest SHA-256 is `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`; all six current fixture hashes match its accepted observation record. Neither those inputs nor `.gitattributes` changes in M1-01.

The existing toolchain is Node `24.20.0`, npm `11.19.0`, TypeScript `7.0.2`, native erasable TypeScript, `node:test`, and `node:assert/strict`. Follow [Development toolchain](../../README.md#development-toolchain) and the existing lockfile. `tsconfig.json` already includes `src/server/**/*.ts` and `tests/**/*.ts`; no compiler, package, or build change is planned. Python `3.12.10` is available for the repository's guard, not as an application dependency. No active pointer exists at `logs/agent-flow-leases/v2/active.json`; `temp/rd003-evaluation` is absent. Recheck these facts before execution.

### Applicable authorities

| Authority | Binding M1-01 meaning |
| --- | --- |
| [Roadmap M1-01](../DEVELOPMENT_ROADMAP.md#m1-01--define-the-minimum-run-and-scan-contracts), [OD-025](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-025--development-authorization-and-roadmap-governance), and [evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) | Only this selected task; completed RD-003 is its dependency; ordinary task-owned fields may be resolved here; no generation freeze or dependent-task activation. |
| [Target and scanning requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning): `REQ-AUTH-007`, `REQ-SCAN-005`–`REQ-SCAN-007` | Complete page/scan provenance, exact three rules, missing-fact preservation, no truncated success, and provider-independent evidence. |
| [Evidence requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance): `REQ-EVID-003`, `REQ-EVID-007`–`REQ-EVID-011` | Immutable completed evidence, run/Finding identity only, native incomplete separation, minimized per-rule facts, bounded locator or unavailable reason, and one aggregate. |
| [Provider execution](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-002` | Explicit immutable Local/Groq provider/exact-model context; selection creates no ProviderInvocation, probe, or call. |
| [Privacy](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-003`, with directly linked `REQ-SEC-002` | Closed application-owned sections and content-safe failure; no raw scanner/page/provider material, credentials, arbitrary attributes, form values, or hidden content. Public data is not automatically non-sensitive. |
| [Reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-001`, `REQ-QUAL-003`, `REQ-QUAL-010`–`REQ-QUAL-012`, `REQ-QUAL-019`, `REQ-QUAL-020` | Unknown-value validation, one minimal TypeScript definition, complete exact-rule coverage, only three parent states, initial-write failure distinction, provenance, and sibling preservation. |
| [Information and workflow lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md), [ADR-0011](../architecture/decisions/ADR-0011-typescript-as-initial-application-language.md) | One top-level aggregate version, independent nested Findings, no vendor types in domain records, and runtime validation separate from strict type checking. |
| [BHV-01/BHV-07](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope), [SPEC-001/SPEC-007](../specs/SPEC.feature), [HS-004/HS-006](../specs/HARD_SPEC.feature) | Derived contract examples only: complete versus failed scan, minimized evidence, immutable records, and reopen validation. End-to-end service/browser/UI portions remain M1-02 through M1-05. |
| [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [agent workflow](../../.codex/README.md), [worker-first workflow](../../.codex/execplan-implementation-workflow.md), and [write-lease guard](../../.codex/write-lease-guard.md) | Independent test/implementation ownership, genuine behavioral Red, exact guarded write turns, bounded correction, risk-routed review, and primary-owned closure. |

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

On a later execution request, inspect the actual Git tree and completed prerequisites again. Confirm M1-01 is the selected `In progress` task, read this living plan and exact authority anchors, record actual coordinator permissions and available role settings, and preserve unrelated changes. Establish the exact Node/npm binaries from the existing developer-managed setup, the locked dependencies, and Python 3.10 or newer before worker dispatch. The observed global runtime currently fails this gate. Do not silently use it, reinstall the browser, or rerun RD-003's evaluation/bootstrap merely to validate pure contracts.

Planning and read-only contract discovery can continue without runtime acquisition. If the pinned runtime cannot be supplied, stop implementation at that prerequisite and report the exact missing setup. Any necessary locked restore is a separately bounded prerequisite operation with its mutation/cleanup inventory frozen before execution; it cannot change package metadata or tool selections.

### 2. Freeze the minimum public-run literal contract

Use the Decision Review Contract below. One bounded non-ranking local discovery may identify gaps between Accepted semantics, RD-003 controlled evidence, and the immediate consumers. Do not compare new libraries or reopen the accepted aggregate/topology. The primary records the exact questions and field-level candidate dispositions, then one `critical_researcher` addresses the combined privacy/record-integrity dimension. Reuse the existing native evidence; no browser or public-target experiment belongs in this research pass.

After the synchronization barrier, the mandatory R3 `decision_analyst` checks completeness and decide-now/prove-later separation. `DRAFT READY` and a passing fresh `critical_research_reviewer` pre-draft checkpoint permit primary authorship of the full literal contract in this plan. A different fresh `critical_research_reviewer` reviews that authored contract before implementation preflight. No drafter or ordinary researcher is planned. These checkpoints settle implementation literals, not ADR or requirement approval; a genuine authority conflict or new durable mechanism stops for the owner/ADR process.

The primary must freeze all retained properties, enum/value meanings, presence rules, public privacy restrictions, numeric/string bounds where needed for minimization, unknown-key handling, error categories, callable signatures, and runtime immutability semantics. Do not leave these decisions to a worker or label unresolved privacy/identity mechanics as future runtime proof. Public evidence values must meet the canonical rule profiles without importing fixture-only assumptions. Preserve native measurements/check identity rather than synthesizing source facts.

### 3. One coherent behavior-bearing slice — M101-CONTRACT-01

The observable outcome is one validated, closed, immutable M1 run/scan contract covering the acceptance matrix below. TDD is Applicable: it has meaningful rejection, state, identity, and preservation behavior. Standard `code_worker` is the implementation role; no frontend worker applies.

Before preflight, create workflow/assignment identities and a complete [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) projecting the reviewed literal contract, readiness evidence, commands, ownership, environment, and budget. Keep one `test_worker` and one separate `code_worker` context for this slice. Both are Sol medium under their repository role files; neither may spawn agents or mutate Git state.

The test worker first performs read-only preflight with no lease and returns exactly one workflow classification. `EXISTING_AND_COVERED` reuses fresh proof without writing; `EXISTING_BUT_UNCOVERED` receives a passing characterization; `MISSING` or `REGRESSION` takes Red then Green; `PARTIAL` requires primary isolation of the missing gap; `CONFLICTING` or `UNKNOWN` stops. The baseline suggests missing behavior but is not the worker's accepted classification.

For Red, lease only `tests/run-contract.test.ts`. The test worker owns representative synthetic inputs and assertions in that file, including privacy-negative and malformed cases. No test data is represented as a native scan or written to `data/runs/`. Use the existing focused runner; keep the contract's related cases together. Primary accepts a decisive failure caused by the absent/incorrect contracted behavior, not a broken dependency, wrong runtime, syntax error, or unexplained module-load failure. Resolve the first-module test-loading approach before accepting Red; if it cannot exercise the agreed capability without a production stub, stop and reconcile rather than fabricate Red or implement behavior under setup.

After fresh compliant lease closure and primary inspection, freeze the accepted test path/hash and exact Red result. Only then lease `src/server/domain/run-contract.ts` to `code_worker` for minimum Green and optional same-turn behavior-preserving Refactor. The file owns the minimal application types and their small runtime checks. Tests and all documentation are forbidden in that lease. If a second cohesive source file is demonstrated necessary, primary must reconcile the path/contract before a new lease; no broad `src/` lease or speculative module hierarchy is allowed.

The primary starts and closes every lease, inserts the guard digest into each fresh packet before dispatch, and verifies the actual diff, unchanged accepted test boundary, exact command results, terminal receipt, and no-drift state before accepting a handoff. No primary documentation or guard-control maintenance overlaps an active worker lease. Worker output uses the workflow's four-section handoff. Ordinary test corrections remain test-worker-owned; the narrow exceptional primary test correction is permitted only as specified in ADR-0024, between leases with reason/paths/validation recorded and prior Red evidence invalidated.

### 4. Review, verification, and task-only closure

This slice is S3 because unknown public-derived/persisted values cross a privacy-sensitive allowlist and an immutable identity/evidence boundary. A fresh `critical_reviewer` (Sol max) reviews the completed slice. After primary integration, test-relevance audit, documentation reconciliation, and closure-candidate validation, a different fresh `critical_reviewer` performs integrated review because that same critical boundary remains. This is not a review of a real scan or durable repository that has not been built.

Reuse evidence only when exact command, working directory, relevant-tree fingerprint, environment fingerprint, and guard-backed no-drift state match. Rerun stale, contradictory, missing, or risk-critical checks, not every historical RD-003 observation. At task closure execute the complete current authoritative test suite once and the independent strict compiler check; while this remains the only product test, the focused and complete task suite are the same command and need not be duplicated at one unchanged checkpoint. Audit helpers, mocks, skips, focused markers, and temporary substitutes; keep no test solely to make the runner pass.

Primary then updates materially affected documentation, records actual contract/test limits, resolves reviews, and applies the documentation gate. Only after M1-01 Verification passes may the roadmap mark M1-01 Complete and this plan move to `completed/`. M1-02/M1-03/M1-04 become eligible for separate owner selection; do not start them or their shared integration checkpoint automatically.

### Ownership, budgets, and stop rules

The initial implementation scope is exactly `tests/run-contract.test.ts` for test leases and `src/server/domain/run-contract.ts` for Green. All other paths are forbidden, including `docs/`, `README.md`, `AGENTS.md`, `PLANS.md`, `.agents/`, `.codex/`, `evaluation/`, `fixtures/`, package/configuration files, and application consumers. The primary alone owns this plan, status/progress/navigation documents, and guard controls between leases. There are no concurrent implementation writers or parallel roadmap branches.

Default slice budget: one read-only preflight, one coherent Red or characterization, one Green, at most one same-contract correction per role, and one review-correction loop. Attempt 2 names its terminal attempt-1 parent and has a fresh packet, baseline, lease, and digest. Stop on a changed binding field, unexpected overlap, guard violation, stale or wrong Red, repeated decisive failure twice, two no-diff write handoffs, conflicting authority, exhausted budget, or a need for more than three TDD cycles. Permission to fix one issue does not reset budgets. The primary reconciles first and requests owner direction when new authority or a larger allowance is required.

## Decision Review Contract

**Identity:** `M101-LITERALS-001`; owner M1-01; target the literal-contract subsection to be authored in this plan and then implemented in the single application-owned contract. **Current status:** NOT FROZEN; no research/selection or implementation result is claimed. This planning artifact defines the future barrier, not its outcome.

**Tier and scope:** R3 for deciding the privacy-sensitive public retained-field/locator policy and immutable run/Finding boundary. Accepted parent statuses, one aggregate, exact rules, provider-context semantics, no child identities, and later-task boundaries are fixed constraints, not candidates. Alternative field spellings/layouts or availability representations may be compared only when necessary to implement those constraints. One local non-ranking discovery pass first identifies that small candidate set and exact evidence gaps; freeze them here before comparative research. No new architecture/library selection is needed or authorized.

**Criteria and evidence:** Trace every retained field to an immediate M1 consumer and a named authority. Prefer the smallest direct TypeScript representation that preserves complete evidence, excludes prohibited content, expresses honest missing facts, validates unknown JSON, and is usable by service/scanner/UI without duplicate domain definitions. Evidence is the canonical requirement/ADR text, frozen RD-003 manifest and accepted native values, pinned package source/types when a consumed native shape needs checking, and synthetic counterexamples labeled as contract cases. Time-sensitive external mechanics, if needed, require version-matched primary sources; no broad technology survey, new native run, provider call, or model output is authorized.

**Required artifact-local output before any behavior lease:** one exact field/presence/value table for all three parent states and the three rule-specific evidence shapes; provenance and failure definitions; public requested/final-identity and locator minimization rules; unavailable-fact versus invalid-record distinction; exact coverage/cardinality relationships; mode/model consistency; ID validation without generation/registry machinery; runtime ownership/immutability enforcement; callable/export/test-loading boundary; source/test paths; and complete commands with their mutation/cleanup effects. A rejected input produces a bounded application-owned failure, never an echoed raw value or exception payload. The output must explain what an ordinary JSON round-trip preserves without inventing canonical bytes, migrations, or a custom serialization protocol.

**Decide now versus prove later:** Decide those meanings before worker preflight/Red. M1-01 then proves them with pure contract checks, isolated mutation attempts, and strict compilation. Actual URL admission, native node collection/capture/sanitization and browser cleanup are proven by M1-03; durable publication/reopen and later-update preservation are proven by M1-02; the UI by M1-04; their integration by M1-05. This separation does not permit incomplete M1-01 semantics or use a `completed` object as proof of disk durability.

**Routing and budget:** one `critical_researcher` report covering the combined public-record privacy/integrity dimension and at most one targeted follow-up; one `decision_analyst` synthesis with at most one bounded correction; one fresh pre-draft `critical_research_reviewer` checkpoint with at most one supported outline correction; a different fresh final `critical_research_reviewer`, subject to the workflow's two-cycle final-artifact correction ceiling. No `technology_researcher` or `research_drafter` is justified initially. Every role receives Research Assignment Capsule v1, exact anchors, common hard gates, evidence/freshness IDs, read-only permission, no independent spawning, explicit output/stops, and the next synchronization barrier. Stop on repeated decisive gaps, two `RETURN FOR RESEARCH` results without materially new evidence, budget exhaustion, authority conflict, or changed critical mechanics. Do not evade the budget by respawning.

The analyst returns `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. R3 requires both fresh research checkpoints; an R2 plan-review PASS does not satisfy them. Only primary writes authoritative research-derived documentation. Reviews cannot approve an ADR, alter a requirement, authorize a lease, or complete M1-01. Recheck the entire cumulative invariant packet after every material revision, not only the last finding.

### Cumulative invariant and acceptance packet

These invariants also form the test/review matrix. Current actual result is **Not executed** for every behavior row. The primary records exact evidence IDs here during execution. Research reviewers assess the frozen semantics; S3 implementation reviewers assess actual behavior.

| ID | Trigger/case | Required result | Evidence / responsible review |
| --- | --- | --- | --- |
| M101-I1 | Contract completeness and scope | Every roadmap Verification clause maps to a field/check/test; only immediate M1 sections exist; dependency/task/authority status remains honest. | Pending literal freeze; research and final integration reviewers. |
| M101-I2 | Valid nonzero, valid zero, and zero with native incomplete | Exactly three covered rules; complete violation and incomplete collections agree with coverage; native incomplete remains distinct and never proposal-eligible; no finding-count cap, merge, drop, or invented pass archive. | Not executed; test worker and S3 reviewer. |
| M101-I3 | Missing/extra rule, malformed collection, invalid state, parent failure | Invalid records fail closed; running/failed cannot masquerade as complete zero/partial success; failure is content-safe; initial persistence failure is representable without claiming persistence implementation. | Not executed; test worker and S3 reviewer. |
| M101-I4 | Missing/invalid/withheld fact or unavailable locator | Preserve the item and native category through an allowed reason; malformed durable shapes still reject; no invented native fact, discarded sibling, or new identity. Locator unavailability alone is not a generation-sufficiency decision. | Not executed; research and S3 reviewers. |
| M101-I5 | Public provenance and synthetic sensitive-content counterexamples | All `REQ-AUTH-007` provenance is representable when observed; credentials/raw text/HTML/scanner/provider data and unknown fields cannot cross the durable shape, including nested failure and fact objects; target identity stays in permitted run provenance and locator in comparison-support evidence. | Not executed; critical research and S3 reviewers. |
| M101-I6 | Local/Groq consistency and attempted mutation | One explicit immutable provider/exact-model context; no implicit default mode, ProviderInvocation, per-Finding provider, provider readiness requirement, or side effect. Scan meaning is identical between modes. | Not executed; test worker and S3 reviewer. |
| M101-I7 | Two Findings, reordered list, duplicate locator/ID, caller alias mutation | Stable within-run IDs address the same Finding regardless of order; distinct nodes sharing a locator survive; duplicate IDs reject; accepted evidence/context and sibling values are unchanged by caller mutation/isolation checks. | Not executed; critical research and S3 reviewers. |
| M101-I8 | Unknown parsed JSON, wrong format/version, extra nested fields | Small runtime checks validate before use; a plain JSON round-trip preserves the valid contract; no cast-only validation, native-library domain dependency, generic serializer, migration, or compatibility mechanism. | Not executed; test worker and S3 reviewer. |
| M101-I9 | Worker ownership and evidence honesty | Genuine accepted Red before Green; fresh guarded test/code turns; unchanged accepted tests during Green; primary-only documentation; exact commands and fresh fingerprints; no synthetic contract case claimed as browser, disk, or provider evidence. | Pending execution; primary and final integration reviewer. |

## Concrete Steps

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

The Red packet runs the focused npm command by itself and records its nonzero exit plus intended failing assertions; it must not apply the Green success expectation. Green and closure require exit 0, no skipped/todo/focused-only cases, and independent strict typecheck success. No `build`, `start`, unscoped test auto-discovery, browser, provider, or model command is justified here. If other tests exist when execution starts, freeze their exact affected and complete-suite command before the relevant packet; do not silently replace this command mid-lease.

Before any worker lease, resolve every applicable command slot in the reviewed contract and packet:

| Slot | Current disposition / required freeze |
| --- | --- |
| Runtime and guard prerequisites | Exact Node/npm/Python executable paths and versions, environment fingerprint, and readable locked package identities. Global Node/npm currently mismatch; obtain the existing developer prerequisites, not another toolchain selection. No application/runtime installer is added. |
| Dependency restore, only if needed | Existing README command `npm.cmd @toolchainOptions ci`; freeze its exact working directory/environment and authorize the bounded prerequisite operation before running. It replaces generated `node_modules/`, may populate only its declared task cache, disables lifecycle scripts, and must leave manifest/lock/configuration bytes unchanged. Do not run it merely for a documentation change. |
| Manifest/lockfile bootstrap | None: already established by completed RD-002; generation, dependency additions, lock updates, and install-script workarounds are forbidden. |
| First Red loading and exact exports | Freeze a viable test boundary for the not-yet-existing module and the expected behavioral failure. Missing-module/toolchain errors alone are not accepted Red; no dummy production implementation or permanent harness probe. |
| Focused/strict/complete-suite checks | Exact commands above, with the accepted test file and phase-specific exit expectations; no output-producing compiler configuration. |
| Clean-state preparation and generated effects | Pure contract tests need no run directory, browser state, model, network, or cleanup fixture. Freeze any unavoidable runner/npm cache effect explicitly. A read-only preflight must remain read-only; primary handles a needed safe diagnostic outside it. No routine recursive cleanup or deletion of shared dependencies/caches. |
| Guard start/close/status | Primary projects the complete packet into the existing guard CLI, records fresh IDs/digest, and requires fresh `closed-compliant` closure plus actual-diff inspection. Use the [canonical commands](../../.codex/write-lease-guard.md#commands); never reuse illustrative RD-003/M1-03 IDs. |
| Cleanup | None planned beyond any exactly inventoried M1-01 temporary output introduced by a reconciled prerequisite step. Resolve absolute containment and ordinary non-reparse topology first; preserve unrelated/previous-task caches, dependencies, and lease evidence. Ambiguity stops cleanup. |

## Validation and Acceptance

Planning uses `TDD: Not applicable` because this turn changes only the ExecPlan, task activation, navigation, and status/progress documentation. Replacement evidence is actual baseline inspection, complete authority/readiness mapping, independent plan review, relative-link/anchor and Markdown structure checks, unchanged frozen/configuration identities, `git diff --check`, and documentation-only diff inspection. It proves no M1-01 behavior.

Execution must satisfy M101-I1–I9 and the roadmap's exact Verification with accepted preflight classification, test-owner evidence, intended Red when required, minimum Green, strict compilation, terminal lease identities, primary inspection, and both risk-routed implementation reviews. A pure record validator can check consistency and preserve declared counts, but cannot prove that an upstream scanner supplied every native node; M1-03 must compare native results with its complete projection and M1-05 must integrate that evidence. The same honesty boundary applies to disk durability and provider independence in a running application.

The documentation closure inventory initially comprises this plan; [roadmap](../DEVELOPMENT_ROADMAP.md); [plan index](README.md); [task progress](../progress/m1-01-run-and-scan-contracts.md) and [progress index](../progress/README.md); [root README](../../README.md); [documentation index](../README.md); [requirements status](../PROJECT_REQUIREMENTS.md); [delivery readiness](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md); and the current-status sentences in [concept](../PROJECT_CONCEPT.md) and [context](../PROJECT_CONTEXT.md). At execution closure update existing developer instructions with the actual test/import boundary, and update any materially affected owning lifecycle/architecture documentation without duplicating the field definition. Do not rewrite completed RD-003 history or change Accepted requirement/ADR statuses merely because a contract is implemented.

Run documentation link/anchor and structural checks on every changed document, verify unchanged dependency/configuration/fixture scope, and run `git diff --check`. End the handoff with an explicit documentation-impact statement. No commit, push, application-support claim, or downstream activation is authorized by this plan.

## Idempotence and Recovery

Read-only inspection and pure deterministic contract checks are repeatable under their recorded environment. Existing accepted evidence is reusable only with unchanged command, working directory, relevant tree, environment, and no-drift identity. Hash drift in the completed scan freeze stops readiness; it does not permit silently rewriting RD-003 expectations.

An interrupted or rejected worker turn stops writing and returns to the primary for pinned guard closure and actual-tree reconciliation. Preserve user/peer work and failed evidence. Do not reset, stash, delete an active pointer, weaken tests, broaden a lease, or create fake data to continue. Resume only from the last accepted barrier using the remaining budget and a fresh packet/lease. A wrong or stale Red cannot authorize Green. A contract change invalidates affected test/evidence acceptance before another write turn.

There is no run-store migration, durable-data cleanup, browser process, or provider request in this task. A missing runtime is a prerequisite failure, not permission to change RD-002 pins or introduce an installer. A new significant mechanism or accepted-scope conflict stops for owner/ADR direction. Completion of this planning request never bypasses the subsequent execution-authorization boundary.

## Artifacts and Notes

- `M101-STATE-001`: read-only planning baseline and readiness facts recorded above. Source/configuration SHA-256 values: `package.json` `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98`; `package-lock.json` `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`; `tsconfig.json` `3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde`; `vite.config.ts` `8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07`.
- Literal report/synthesis/checkpoints, worker assignments, terminal leases, Red/Green, and implementation validation: pending. Record only concise accepted outcomes and decisive evidence here; no transcripts, copied packet templates, ignored guard JSON, generated ledger, or telemetry.
- The existing [progress record](../progress/m1-01-run-and-scan-contracts.md) summarizes accepted material checkpoints only. It is not another status authority.

### Accepted planning checkpoint

`M101-PLAN-REVIEW-001` (2026-08-30): a fresh `independent_reviewer` returned PASS with no Blocker, Major, or Minor on plan SHA-256 `e942dc9d150e11efef08d5010fac3ca54593ecbda2ac6247ac0ad58bbcaa880a` at HEAD `47bf64e881dd4577b7bdee1e6e00b4fd1c208c44`. The reviewer inspected the complete artifact, activation/progress diff, authorities, future literal and first-Red gates, scope, ownership, and budgets; independently checked configuration/manifest/six-fixture hashes, current runtime versions, absent application paths and active lease, empty index, and whitespace. Primary reconciled that verdict with the actual tree and accepts it for planning only. No future R3 research or S3 implementation checkpoint is satisfied by this review.

`M101-DOC-001` (2026-08-30 17:19Z): primary validation of the eleven documentation paths passed 532 relative links and 114 anchors outside fenced examples, all fifteen plan sections, both PowerShell blocks' syntax without execution, final newlines/trailing whitespace, and `git diff --check`. The scope is nine modified status/navigation documents plus this plan and its progress record; no application, dependency, configuration, fixture, or frozen-manifest change exists. Required contract tests and strict typechecking were not run under the mismatched global runtime. These numbers identify the pre-handoff-record checkpoint; final readback also checks the review/result annotations added afterward.

`M101-DOC-002` (2026-08-30): final handoff readback passed 533 relative links, 115 anchors, all fifteen required sections, both command blocks' syntax, and whitespace. Twelve package/configuration/frozen-input hashes are unchanged and four JSON files parse. Exact scope remains eleven documentation paths, the index is empty, HEAD is unchanged, no application source/tests or active lease exists, RD-001 through RD-003 remain Complete, and the other 24 application tasks remain Not started. Requirement/decision table rows are unchanged. Only M1-01 planning is active; no runtime or behavioral verification is inferred from these checks.

Documentation impact: updated the existing task/status/navigation owners and added the task-scoped plan/progress record. Requirement and ADR statuses, product behavior, dependencies, and the completed RD-003 freeze/history are unchanged. No commit or push was made.

## Interfaces and Dependencies

The intended source surface is `src/server/domain/run-contract.ts`, with pure application-owned exports for the minimum run/scan types and unknown-input checks. Exact signatures and serialized fields remain task-owned literals until the reviewed freeze above. `tests/run-contract.test.ts` is the independently owned focused acceptance boundary. Both paths fit the current strict compiler configuration. Keep framework/vendor runtime types and privileged dependencies outside these domain exports; the future client may import types without gaining service execution authority.

Use native JSON and direct TypeScript checks; the existing Node test/assert libraries are sufficient. There is no new schema library, framework, package, service, or executable configuration. The contract prepares one versioned `run.json` shape; it does not create that file, its directory, or a storage API. Reuse RD-003's actual evidence and rule meanings without importing fixture-only policy or adding public-scan claims.

## Revision note

2026-08-30 / primary coordinator: Created the M1-01 planning-only ExecPlan after full current-state and routed-authority review. Recorded completed prerequisites, the current runtime mismatch, future literal/research and implementation barriers, one coherent TDD slice, exact ownership/command boundaries, critical privacy/immutability review, and YAGNI exclusions. No application implementation was authorized or performed in this turn.

2026-08-30 / primary coordinator: Recorded the independent planning review PASS with no findings and passing documentation validation. Updated only progress, outcome, and evidence annotations after that verdict; the reviewed scope, decision/worker gates, command blocks, and acceptance contract remain unchanged.
