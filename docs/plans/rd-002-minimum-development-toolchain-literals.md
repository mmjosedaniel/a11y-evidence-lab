# Establish the minimum RD-002 development toolchain

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Progress

- [x] (2026-08-29 21:57Z) The project owner explicitly selected RD-002 by requesting this ExecPlan. Confirmed that RD-001 is Complete, RD-002 is the only dependency-ready roadmap task, every directly named requirement and ADR is Accepted at its recorded scope, and no RD-002 evaluation-freeze condition remains open. Evidence: `docs/DEVELOPMENT_ROADMAP.md`, `docs/PROJECT_REQUIREMENTS.md`, the authorities listed under Context and Orientation, and clean `git status --short --branch` output on `codex/rd-002-toolchain-literals`.
- [x] (2026-08-29 21:57Z) Activated the living plan and its R2 Decision Review Contract before comparative research or package selection. Updated the roadmap, plan index, and task progress index coherently; no application dependency, executable configuration, or product behavior was added.
- [x] (2026-08-29 22:09Z) Received fresh read-only review `RD002-PLAN-REVIEW-001` with verdict `REVISE`. Corrected its Major finding by moving the disposable harness probe's complete lifecycle into the guarded `code_worker` setup assignment, and corrected its Minor finding by separating historical clean-tree evidence from the current activation diff. Fresh re-review remains pending.
- [x] (2026-08-29 22:17Z) Fresh complete-artifact re-review `RD002-PLAN-REVIEW-002` closed both prior findings and returned `PASS WITH FOLLOW-UPS`. Dispositioned its one Minor follow-up by making `INV-ART-01` phase-aware: pre-freeze revisions prove explicit non-selection and complete selection slots; selection-freeze and later revisions prove complete literals and commands.
- [x] (2026-08-29) Accepted the project-owner-supplied independent review with verdict `REVISE`. Corrected all three Major findings: the R2 contract checkpoint is now trigger-dependent, research-derived developer documentation is primary-owned outside the worker lease, and the plan now reserves every binding bootstrap, mutation, clean-state, restore, inspection, and cleanup slot before discovery. Fresh complete-artifact re-review is required because the corrections are normative.
- [x] (2026-08-29) Fresh complete-artifact re-review `RD002-PLAN-REREVIEW-003` closed the three supplied Major findings and returned `REVISE` for one new Major contradiction: ignored generated side effects were both required and included in the semantic forbidden scope. Corrected the setup packet by separating guard-observable write scope from exact ignored/external side effects and cleanup; a new fresh review remains required.
- [x] (2026-08-29) Fresh complete-artifact re-review `RD002-PLAN-REREVIEW-004` returned `PASS` with no findings. It independently closed the three project-owner-supplied Major findings and the generated-side-effect scope correction. The plan may advance to bounded non-ranking discovery; selection and setup barriers remain unchanged.
- [ ] Run the one permitted bounded, non-ranking discovery pass; freeze the candidate set, evidence dimensions, hard gates, and cumulative invariant packet before comparative research.
- [ ] Collect current primary-source evidence for the frozen candidates with at most two concurrent `technology_researcher` reports split by evidence dimension, then reconcile them at one research barrier.
- [ ] Produce the R2 synthesis result: exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`; invoke `decision_analyst` only if its recorded trigger fires.
- [ ] At `DRAFT READY`, audit the R1/R2 checkpoint triggers. Treat `DRAFT READY` itself as the contract checkpoint when none applies; use a fresh `independent_reviewer` only when a listed trigger applies, and resolve supported in-scope findings within the recorded budget.
- [ ] Record the selected ordinary implementation literals and exact versions in this plan. Stop for a new ADR and project-owner direction if evidence reveals a significant durable architecture consequence.
- [ ] Update required ignore controls between worker leases, then complete the single guarded non-TDD setup slice through `code_worker` using an exact Milestone Assignment Packet v2 and fresh write lease.
- [ ] Inspect the actual diff and terminal lease receipt; run clean-install, independent strict type-check, package-resolution, and disposable focused-harness failure/pass evidence; route the S2 slice to a fresh `independent_reviewer`.
- [ ] Run the complete RD-002 Verification, dependency/test relevance audit, documentation-closure gate, and fresh integrated review. Mark RD-002 Complete only after all evidence exists.

## Surprises & Discoveries

- Observation: The tracked repository has no application source, package manifest, lockfile, TypeScript configuration, executable test, or dependency installation. It contains the accepted planning baseline and repository workflow only. Evidence: `rg --files`, the project overview, and `Get-ChildItem -Force` on 2026-08-29.
- Observation: The current host reports Node.js `v24.18.0`, npm `11.16.0`, pnpm `11.15.1`, Python `3.12.10`, and Git `2.53.0.windows.1`. These are environment observations, not selections. The Proposed feasibility seed names Node.js `24.19.0`, so neither the installed host version nor the dated seed may be copied into package metadata without current primary-source and compatibility evidence.
- Observation: `.gitignore` currently covers only `temp/`, `logs/`, and the lease guard's Python cache. Dependency and build output ignores will be required before installation, but the lease guard deliberately seals ignore controls. Any required `.gitignore` edit is therefore a recorded primary-coordinator guard-control change between leases, never part of the worker setup lease.
- Observation: RD-002 is non-behavioral dependency and executable-configuration setup, yet its Verification requires a focused harness to show a real failure and pass. The guarded setup worker will use and remove one explicitly allowed, non-ignored disposable probe so the repository does not retain a meaningless always-passing product test solely to validate the runner.

## Decision Log

- Decision: Classify RD-002 selection as R2 decision work.
  Rationale: It is a consequential cross-boundary choice covering the JavaScript runtime, package manager, build arrangement, service host, focused test harness, and mutually compatible exact package versions. It has several material evidence dimensions and time-sensitive upstream facts, but no current R3 security, integrity, concurrency, recovery, irreversible-data, custom-serialization, or cross-platform-equivalence trigger.
  Date/Author: 2026-08-29 / primary coordinator.
- Decision: Treat the project owner's request as selection and activation of the existing RD-002 roadmap task, not as approval of any not-yet-researched toolchain literal.
  Rationale: `PLANS.md` permits an ExecPlan after the owner selects an existing task. The roadmap defines `In progress` as a concrete user request selecting the task after work starts. Package and framework choices remain open until the Decision Review Contract completes.
  Date/Author: 2026-08-29 / primary coordinator.
- Decision: Keep ordinary literal rationale and evidence in this ExecPlan, package metadata, the lockfile, and existing development documentation; create no separate selection report.
  Rationale: The roadmap explicitly says ordinary implementation literals do not require an ADR. A new document would duplicate the living evidence owner. A significant durable consequence discovered during research still stops the task for the ADR process.
  Date/Author: 2026-08-29 / primary coordinator.
- Decision: Use one non-behavioral setup slice after the selection barrier, with `TDD: Not applicable`, a guarded `code_worker`, and structural, semantic, negative, and disposable harness evidence.
  Rationale: RD-002 creates dependency and tool configuration, not product behavior. ADR-0024 forbids a fabricated Red for declarative setup, while RD-002 still requires an independently executable strict type check and focused harness proof.
  Date/Author: 2026-08-29 / primary coordinator.
- Decision: Route the setup slice and integrated state as S2.
  Rationale: Although the write is bounded setup, the chosen baseline crosses service, React UI, Playwright-managed browser, TypeScript compiler, and test execution boundaries and determines every later M1 task's executable foundation. It is consequential but has no current S3 trigger.
  Date/Author: 2026-08-29 / primary coordinator.
- Decision: Prove the focused harness inside the guarded `code_worker` setup assignment with one explicitly allowed, non-ignored disposable probe that the worker creates, runs failing, corrects, runs passing, and removes before lease closure.
  Rationale: This supplies genuine failure/pass evidence without retaining fake application behavior, keeps initial setup/test-source writes with the assigned worker, and keeps the probe path inside the lease contract. The guard proves terminal net path containment; the exact command outputs and coordinator inspection prove the intermediate failure/pass lifecycle.
  Date/Author: 2026-08-29 / primary coordinator, corrected after `RD002-PLAN-REVIEW-001`.
- Decision: Apply the repository's R2 checkpoint triggers exactly and keep research-derived documentation outside the setup worker lease.
  Rationale: An untriggered R2 `DRAFT READY` result is already the contract checkpoint. Adding an unconditional reviewer would contradict the project workflow and YAGNI. The primary remains the sole authoritative writer for the frozen selection, developer instructions, and evidence, while the worker owns only the exact package and executable-configuration paths needed for setup.
  Date/Author: 2026-08-29 / primary coordinator, corrected after the project-owner-supplied review.
- Decision: Freeze the complete bootstrap and cleanup contract before the setup packet or lease.
  Rationale: Package-manager initialization, manifest and lockfile mutations, generated paths, clean-state preparation, lifecycle side effects, frozen restoration, resolution inspection, and cleanup are binding setup mechanics. Reserving their slots now lets research evaluate them symmetrically and prevents the worker from inventing commands after selection.
  Date/Author: 2026-08-29 / primary coordinator, corrected after the project-owner-supplied review.
- Decision: Represent ignored repository output and external caches as exact known side effects, not lease-guard path scope.
  Rationale: The guard rejects explicitly named ignored scopes and cannot observe ignored descendants or external locations. The packet therefore constrains tracked and non-ignored writes through the guard while constraining exact generated effects through the frozen command contract, command evidence, inspection, and targeted cleanup.
  Date/Author: 2026-08-29 / primary coordinator, corrected after `RD002-PLAN-REREVIEW-003`.

## Outcomes & Retrospective

RD-002 is active, but toolchain execution has not started. The current outcome is a dependency-ready, authority-mapped plan and a frozen workflow for making the selection honestly. No runtime, package manager, service host, build tool, test runner, package version, dependency, or product behavior has been selected or installed yet.

## Purpose / Big Picture

RD-002 establishes the smallest reproducible development baseline that the M1 scan-to-evidence walking skeleton can immediately consume. When the task is complete, a developer can install exactly the pinned material packages, run strict TypeScript checking independently, invoke one focused test command independently, and use a documented build/service arrangement compatible with the already accepted TypeScript, React, localhost-service, Playwright, axe-core, and milestone-slice TDD boundaries.

Success is observable without claiming an application exists: a clean dependency restore succeeds from one selected lockfile; the selected compiler reports a successful strict check through its own command; the selected focused test path reports one intentional failure and then a pass through a disposable probe; package and managed-browser relationships resolve as recorded; and the dependency/configuration diff contains nothing for Deferred, Proposed-only, release, or hypothetical post-M1 work.

## Context and Orientation

The repository is Development ready. RD-001 is Complete, and the project owner selected RD-002 in this request. RD-002 is on the mandatory dependency spine before RD-003 and all M1 work. Application implementation remains absent.

The controlling task is [RD-002](../DEVELOPMENT_ROADMAP.md#rd-002--select-the-minimum-development-toolchain-literals). Its direct authorities are:

- [ADR-0008](../architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md): Playwright with its matching managed Chromium is Accepted only as the initial browser-automation evaluation baseline.
- [ADR-0009](../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md): a pinned axe-core integration is Accepted only for the exact three-rule evaluation baseline.
- [ADR-0011](../architecture/decisions/ADR-0011-typescript-as-initial-application-language.md): TypeScript is the initial application language; strict compiler checking must run independently, runtime trust-boundary validation remains separate, and the ADR selects no runtime, package manager, build tool, service framework, or schema framework.
- [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md): React is the initial client-rendered UI evaluation baseline, not a router, state library, data library, CSS system, component kit, build tool, or full-stack framework decision.
- [ADR-0015](../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md): one developer-started local application service owns privileged behavior and serves an unprivileged loopback UI in Chrome or Edge; the exact host framework and start command remain implementation literals.
- [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md): behavior-bearing work uses independent Red and Green ownership, while dependency selection and declarative setup use the separately justified non-TDD route. RD-002 must choose the smallest focused harness and pin every material version it introduces.
- [`REQ-INST-002`](../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md#mvp-startup-model-setup-and-deferred-packaging): the developer starts the local service, receives readiness or startup failure, has a clean stop path, and opens its loopback URL; launcher, browser launch, desktop wrapper, and duplicate-instance machinery are not required.
- [`REQ-QUAL-010`](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations): compile-time types do not replace minimal runtime validation at the actual unknown-data boundaries, but a schema platform, provider probe, and hostile-target validator are outside scope.
- [`REQ-QUAL-012`](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations): one user operation runs at a time; no queue, resume graph, child-attempt lineage, or workflow engine is required.

Supporting, non-authoritative evidence includes [Local MVP feasibility](../LOCAL_MVP_FEASIBILITY.md), [Candidate architecture](../architecture/CANDIDATE_ARCHITECTURE.md), and the Proposed [scan technology selection assessment](../architecture/candidates/authorized-scan/TECHNOLOGY_SELECTION.md). They supply dated seeds and constraints but cannot make the selection.

The readiness check passes:

- dependency: RD-001 is Complete;
- requirement state: `REQ-INST-002`, `REQ-QUAL-010`, and `REQ-QUAL-012` are Accepted;
- decision state: every named ADR is Accepted or Accepted for evaluation at the scope RD-002 needs;
- freeze state: RD-002 has no separate evaluation-freeze prerequisite; RD-003 intentionally follows it because browser/scanner results are version-sensitive; and
- owner selection: this ExecPlan request names the exact roadmap task.

The installed Windows host and dated Proposed seeds are evidence inputs only. Current version, support, compatibility, lifecycle, and package-resolution claims must be refreshed from primary sources during execution because they are time-sensitive.

## Scope and Non-Goals

RD-002 includes only:

- selecting one JavaScript runtime line and exact development version policy for this repository;
- selecting one package manager and one authoritative lockfile;
- selecting the smallest client build and local-service execution arrangement immediately needed by M1;
- selecting the smallest local-service host, including the standard library if it satisfies the criteria;
- selecting one focused test harness and command compatible with ADR-0024;
- pinning the TypeScript compiler and every material M1 dependency introduced now, including the accepted React, Playwright, and axe-core evaluation baselines when they enter the manifest;
- creating the minimum package metadata and strict TypeScript/test/build configuration needed to prove the baseline; and
- documenting exact install, type-check, focused-test, and future start/build command boundaries without claiming later application behavior.

RD-002 excludes application contracts, UI composition, scan behavior, controlled fixtures, evaluation manifests, actual local-service readiness behavior, target admission, browser/axe execution, corpus or model setup, provider adapters, persistence, product runtime validation logic, installer or desktop packaging, database or vector service, generic provider or plugin registries, queues, workers, workflow engines, component inventories, release locks, CI/CD, hosted services, telemetry, broad testing platforms, and every Deferred or post-MVP capability.

No router, state manager, data-fetching library, component kit, CSS framework, form library, runtime-schema platform, monorepo framework, task orchestrator, release tool, or additional test layer may enter the baseline merely because later work might use it. A dependency enters only when a named M1 requirement or the RD-002 Verification needs it now.

## Plan of Work

### Work slice 1: freeze and complete the R2 literal-selection contract

The primary coordinator will first run one bounded non-ranking discovery pass. It may identify no more than the credible candidates needed for each open literal, primary sources, immediate hard-gate failures, and evidence gaps. It must not score, rank, or recommend. The primary will then update this plan to freeze the candidate set and assign stable evidence identities.

Comparative research will use at most two concurrent read-only `technology_researcher` assignments split by evidence dimension rather than automatically by candidate. One assignment covers runtime lifecycle, Windows support, package-manager bootstrap and frozen-restore semantics, permitted metadata mutations, generated paths and lifecycle side effects, dependency-resolution behavior, and the client/service build arrangement. The second covers local-service host minimality, focused test-harness behavior, strict TypeScript execution, and exact React/Playwright/axe compatibility. Both use current primary sources and the Research Assignment Capsule v1 projected from the Decision Review Contract below. The primary waits at one synchronization barrier and owns synthesis.

No repository write other than maintaining this plan occurs during research. No package is installed, no lockfile is created, and no version is selected before `DRAFT READY` and any checkpoint required by the trigger audit. For untriggered R2 work, the recorded `DRAFT READY` result is the checkpoint. The condition for advancing is a complete, symmetric, source-traceable selection that passes every hard gate without creating an ADR-worthy consequence.

### Work slice 2: establish the reproducible configuration baseline

After selection is frozen, the primary will replace every binding command, mutation, side-effect, and path slot below with exact values. It will update `.gitignore` between leases with only the generated dependency, build, test, browser, and cache paths the selected tools actually create. This guard-control edit is primary-owned and receives focused negative validation before a worker starts.

The primary will then issue one Milestone Assignment Packet v2 for a guarded `code_worker` `setup` assignment:

- Observable contract: the selected package metadata, one lockfile, strict TypeScript configuration, build/service configuration, and focused test command form one reproducible M1-ready baseline and introduce no application behavior.
- TDD: Not applicable. This slice changes dependency and executable configuration only; replacement evidence is clean restore, compiler execution, package-resolution inspection, command isolation, negative dependency/scope inspection, and the disposable failure/pass harness probe.
- Risk: S2.
- Authorities: RD-002 Verification, ADR-0011, ADR-0012, ADR-0015, ADR-0024, `REQ-INST-002`, `REQ-QUAL-010`, and `REQ-QUAL-012`, plus the accepted selections recorded in this plan.
- Guard-observable allowed paths: `package.json`, the one exact selected lockfile path, the minimum exact selected TypeScript/build/test configuration paths, and one exact non-ignored disposable probe path such as `tests/toolchain/rd-002-harness-probe.test.ts` after the selected runner confirms the suffix.
- Guard-observable forbidden paths: `README.md`, every Markdown and documentation path under `docs/`, `.gitignore`, `.codex/`, `.agents/`, application behavior directories, controlled fixtures, corpus/model assets, and every guard-observable path not explicitly allowed.
- Known external side effects and cleanup: copy the exact ignored repository paths and external cache/download locations frozen in `PATH-GENERATED-01` into this packet field. The guard does not constrain those paths. The command contract permits only the named effects, requires their recorded inspection and targeted cleanup disposition, and stops the worker on any other generated or external side effect.
- Budget: one setup turn, at most one same-contract attempt-2 correction, stop on the same decisive failure twice, any second no-diff handoff, a changed selection or command contract, an unexpected path, or any lease violation.

The worker may use Git only for read-only inspection. The Milestone Assignment Packet copies every frozen setup-slot value below verbatim; the worker may not choose a bootstrap, mutation, cleanup, path, or lifecycle policy. The primary starts and closes the exact write lease, inspects the actual diff and commands, and rejects any dependency or file not justified by the frozen selection.

### Work slice 3: validate and close the task

Inside the guarded setup assignment, the `code_worker` will create the exact allowed disposable probe, run the selected focused command to the intended assertion failure, make only the intended probe correction, run the same command to a pass, and remove the probe before handoff and lease closure. This is setup-harness validation, not a product test contract, and no `test_worker` is created for the non-TDD route.

After a compliant setup handoff and terminal lease closure, the primary will inspect the exact bootstrap and failure/pass command evidence and confirm that the allowed probe path is absent, then independently prepare the exact validated clean generated-dependency state, restore dependencies from the selected lockfile using the selected frozen-lock command, run the strict compiler command, and verify material package resolution and exact versions. With no active worker lease, the primary then updates the existing developer instructions from the frozen selection and validated command evidence. No meaningless permanent test remains.

The primary will inspect configuration for strictness, browser/service boundary compatibility, unnecessary packages, duplicate package managers or lockfiles, implicit version ranges, lifecycle scripts with unreviewed side effects, focused-test leakage into a full suite, skipped/focused markers, and generated or ignored tracked output. A fresh `independent_reviewer` will review the S2 slice and evidence. Closure then runs the complete task Verification, documentation-impact review, affected-link check, `git diff --check`, lease-guard self-test, and a fresh integrated review before the roadmap may move to Complete.

There is no parallel write work in this plan. Read-only research reports may run concurrently only within their frozen R2 capsule. All repository writes remain serial in this worktree.

## Decision Review Contract

### Contract identity and routing

- Contract ID: `RD-002-DRC-001`.
- Roadmap task: RD-002 — Select the minimum development toolchain literals.
- Tier: R2.
- Triggers: cross-boundary executable baseline; six open literal categories; time-sensitive exact versions and compatibility; more than one material evidence dimension; and a selection that constrains every M1 work slice.
- Target artifacts: this ExecPlan's primary-owned frozen selection and evidence identities, `package.json`, one lockfile, the minimum compiler/build/test configuration, and primary-owned existing developer instructions. No separate decision report is authorized.
- Approval boundary: the primary may select ordinary RD-002 literals after evidence, `DRAFT READY`, and any trigger-required checkpoint. A new significant durable architecture consequence, scope change, Accepted-baseline conflict, or owner-controlled value choice returns `OWNER DIRECTION` and stops for the project owner and, when required, an ADR.
- Forbidden changes: product requirements or ADR status; M1 behavior; RD-003 fixture or scan-profile literals; Deferred or post-MVP scope; release claims; additional providers/runtimes; product orchestration; or a second task graph.

### Discovery and candidate freeze

One bounded non-ranking discovery pass is permitted. Before that pass, this contract already fixes the task, authority, approval boundary, common criteria, and forbidden changes. Discovery may identify credible candidates and primary sources, reject an option only on a documented hard gate, and propose the smallest evidence-complete comparison set. It cannot score, rank, recommend, install, or write configuration.

After discovery, update this section with:

- the frozen candidates for the runtime, package manager, build/service execution arrangement, local-service host, focused test harness, and exact material dependency set;
- stable source/evidence IDs with retrieval dates;
- any hard-gate rejection and its reversal condition; and
- the final researcher split.

No comparative research begins while those values remain unfrozen.

### Common criteria and evidence classes

Every candidate is evaluated against the same applicable criteria:

1. direct necessity for RD-002 Verification or an immediate M1 dependency;
2. compatibility with the accepted TypeScript, React, localhost-service, Playwright-managed Chromium, and axe-core boundaries;
3. current upstream support and Windows/reference-host compatibility;
4. exact version pinning, deterministic initial manifest and lockfile generation, explicit permitted metadata mutations and lifecycle side effects, named generated paths, and clean frozen dependency restoration;
5. a strict TypeScript compiler command independent of transpilation, build, tests, and editor diagnostics;
6. an independently executable focused test command with clear nonzero failure and zero pass semantics;
7. the smallest dependency and configuration surface, with no duplicate tool responsibility;
8. compatibility with later ADR-0024 Red/Green ownership without adding product runtime orchestration;
9. clear lifecycle-script side effects, especially browser artifacts and generated output; and
10. removal or deferral cost if the evaluation baseline later changes.

Required evidence classes are current official runtime release/lifecycle documentation; official package-manager and lockfile documentation; official compiler, React, Playwright, axe-core, build-tool, service-host, and test-runner documentation; package registry metadata or upstream manifests for exact compatibility and resolved versions; repository authority evidence; and reproducible local command output after selection. Blogs, popularity, download counts, tutorials, and unverified memory are not selection evidence.

### Hard gates

- `HG-01 Scope`: every introduced tool or package is needed by RD-002 or M1 now; no Deferred, release, product-runtime orchestration, generic platform, or hypothetical-later dependency enters.
- `HG-02 Authority compatibility`: the baseline preserves every named ADR and requirement boundary and does not reinterpret an evaluation baseline as release adoption.
- `HG-03 Reproducibility`: exactly one package manager and lockfile are authoritative; all material direct dependency versions are exact; a clean frozen restore succeeds.
- `HG-04 Independent compiler`: the pinned TypeScript compiler runs strict checking through a dedicated command with no build, transpiler, test-runner, or editor substitution.
- `HG-05 Focused harness`: one command can address a coherent future work-slice test independently and reports an intentional disposable failure and subsequent pass correctly.
- `HG-06 M1 compatibility`: the selected arrangement can host the unprivileged React client and privileged localhost service and resolve the pinned Playwright/axe relationship without adding product behavior in RD-002.
- `HG-07 Windows host`: commands and upstream support cover the documented Windows development host without requiring WSL, a container, or a second runtime unless a later accepted decision says otherwise.
- `HG-08 Decision boundary`: no unrecorded significant durable architecture consequence is necessary. If one is necessary, selection stops for an ADR.
- `HG-09 Negative dependency boundary`: no installer, desktop wrapper, database, vector service, hosted service, monorepo/orchestration framework, generalized testing platform, schema platform, router/state/data/component stack, telemetry, or release tooling is introduced without an immediate named authority.

### Decide now versus prove later

Decide in RD-002: runtime line and exact repository policy; package manager and lockfile; client build and service execution arrangement; local-service host; focused test harness; TypeScript compiler version and strict command; exact versions of material M1 dependencies introduced now; initial manifest/lockfile bootstrap, permitted mutation, lifecycle-script, clean-state, frozen-restore, resolution-inspection, and cleanup command surfaces; exact generated paths and ignores; and the boundary between dependencies installed now and packages deferred to their owning task.

Prove in RD-002: clean frozen restore; exact resolved direct versions; strict independent type checking; focused disposable failure/pass behavior; package/config consistency; no duplicate lockfiles; no unneeded dependency; and no tracked generated output.

Prove later in the owning roadmap tasks: actual loopback readiness/start/stop behavior (`M1-02`), pinned managed-browser and exact scan-profile behavior (`RD-003` and `M1-03`), React interaction behavior (`M1-04`), and complete integration (`M1-05`). RD-002 may establish commands and package compatibility but must not claim those later behaviors.

### Cumulative invariant packet

| ID | Trigger or fixture | Expected result | Evidence or actual result | Responsible reviewer |
| --- | --- | --- | --- | --- |
| `INV-ART-01` | Any pre-freeze plan revision; selection freeze and every later artifact revision | Before selection freeze, every required selection slot, criterion, and boundary is present and every unfrozen value is explicitly pending rather than implied. At selection freeze and afterward, every required literal, exact version, rationale, command, and prove-now/prove-later disposition is present; no separate undocumented selection exists. | Pre-freeze contract passes; frozen selection and final diff remain pending. | Primary; trigger-required contract reviewer when applicable; integrated reviewer at closure. |
| `INV-EVD-01` | Every time-sensitive selection claim | Each material version, lifecycle, support, and compatibility claim maps to a current primary source with retrieval date; uncertainty is explicit. | Pending research evidence IDs. | Primary; trigger-required contract reviewer when applicable. |
| `INV-AUTH-01` | Every material revision | Requirement and ADR statuses remain unchanged; RD-002 alone is In progress; later tasks and evaluation claims remain unimplemented. | Current authority review passes. | Primary; trigger-required contract reviewer when applicable; integrated reviewer at closure. |
| `INV-BOOT-01` | Candidate freeze, selection freeze, and setup packet | The manifest-authoring procedure, initial lockfile/bootstrap command, permitted tracked mutations, generated paths, lifecycle and network side effects, safe clean-state preparation, frozen restore, resolved-version inspection, and cleanup checks are all explicit. A slot is `N/A` only with authority-backed rationale; the worker invents none of them. | Required slots are present and explicitly pending before discovery; exact values remain pending selection. | Primary; trigger-required contract reviewer when applicable; setup reviewer. |
| `INV-REP-01` | Candidate selection and final manifest | One package manager, one lockfile, exact direct material versions, frozen restore, and resolved-version inspection agree. | Pending setup and command evidence. | Setup reviewer. |
| `INV-CMD-01` | Strict type-check command | The pinned compiler runs independently in strict mode and exits successfully on the selected baseline. | Pending setup evidence. | Setup reviewer. |
| `INV-CMD-02` | Disposable focused harness probe | The same focused command reports the intended nonzero failure, then zero pass after only the intended probe correction; the probe is removed. | Pending setup evidence. | Setup reviewer. |
| `INV-SCP-01` | Dependency and diff review | Every package and config file is necessary now; every listed non-goal remains absent; no application behavior is smuggled into setup. | Pending final diff. | Setup and integrated reviewers. |
| `INV-OWN-01` | Worker write turn | Guard-observable packet paths, guard projection, terminal receipt, actual diff, and worker role agree; exact ignored/external side effects are separately named and inspected because they are outside guard proof; no active lease remains. | Pending setup lease and side-effect evidence. | Primary; setup reviewer. |
| `INV-DOC-01` | Closure candidate | Roadmap, plan/progress indexes, current-status statements, development instructions, and selected-tool evidence agree; affected links and `git diff --check` pass. | Pending closure. | Integrated reviewer. |

The packet is cumulative. Re-run every applicable invariant after a material selection or artifact revision, not only the item that previously failed.

### Roles, budget, corrections, and stopping

- Discovery: at most one primary-coordinated, non-ranking pass.
- Research: at most two concurrent `technology_researcher` reports, one per unresolved evidence dimension, plus at most one targeted follow-up round using the same live role when available.
- Synthesis: primary-owned unless three or more viable candidates remain materially close, reports conflict, decide-now/prove-later semantics remain unresolved, or an owner-controlled choice blocks an evidence-only result. Any such trigger requires one `decision_analyst` pass and at most one bounded correction.
- Contract checkpoint: after `DRAFT READY`, the primary records whether any checkpoint trigger in `.codex/README.md` applies. With no trigger, `DRAFT READY` is the checkpoint and no reviewer is added. A triggered R1/R2 decision receives one fresh `independent_reviewer` and at most one supported outline correction; failure to pass returns to remaining research budget, tier escalation, or owner direction.
- Drafter: none planned. The primary is the sole authoritative writer because the target is this living plan and small configuration, not a substantial standalone decision artifact.
- Final selection review: the S2 setup and integrated state each receive fresh independent review under the implementation workflow.

Stop and reconcile when the same decisive evidence gap appears twice, two synthesis attempts return `RETURN FOR RESEARCH` without material new evidence, the research or correction budget is exhausted, a hard gate cannot be satisfied, a candidate requires new product scope, a significant durable architecture choice appears, current primary sources materially conflict, or the owner must choose a value not resolved by evidence.

After the research barrier, the synthesis owner returns exactly one of:

- `DRAFT READY`: the comparison is symmetric and complete, every hard gate and invariant is covered, and ordinary literals can be recorded without a new ADR;
- `RETURN FOR RESEARCH`: a named evidence gap remains within budget; or
- `OWNER DIRECTION`: an owner-controlled boundary, ADR need, or exhausted stop prevents selection.

## Concrete Steps

All commands run from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab` in PowerShell unless stated otherwise.

Current deterministic preflight commands:

    git status --short --branch
    rg --files
    node --version
    npm --version
    pnpm --version
    python --version
    git --version
    python -B .codex\leases\lease_guard.py self-test

Historical baseline `TREE-BASELINE-001`: before task activation, `git status --short --branch` showed a clean `codex/rd-002-toolchain-literals` branch.

Expected current result after plan activation and the first review correction: the same branch with only the accepted RD-002 documentation activation paths modified or untracked—`README.md`, `docs/README.md`, `docs/DEVELOPMENT_ROADMAP.md`, `docs/PROJECT_REQUIREMENTS.md`, `docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md`, `docs/plans/README.md`, `docs/plans/rd-002-minimum-development-toolchain-literals.md`, `docs/progress/README.md`, and `docs/progress/rd-002-minimum-development-toolchain-literals.md`. There is still no package/application baseline or unrelated drift. The environment versions are recorded under Surprises & Discoveries, and the isolated 27-check lease-guard self-test passes.

Research uses the current official primary sources named by the frozen Decision Review Contract. Record exact URLs, relevant version/support facts, retrieval date, and uncertainty in stable evidence IDs; do not use a package install as a substitute for upstream lifecycle or compatibility evidence.

The binding setup slots below are future and explicitly unresolved. They are not authoritative commands or paths until Work slice 1 reaches `DRAFT READY`, completes any trigger-required checkpoint, and the primary replaces every slot with one exact value. Each command entry must include its working directory, exact arguments, expected exit result, permitted tracked mutations, generated or external side effects, and cleanup responsibility. A slot may be recorded as `N/A` only with authority-backed evidence that RD-002 remains complete without it.

| Slot | Exact value required before the setup packet | Expected result and boundary |
| --- | --- | --- |
| `PROC-MANIFEST-01` | Exact `apply_patch` manifest-authoring procedure and the selected fields, scripts, runtime/package-manager declarations, and exact direct dependencies it may create or change. | Creates or updates only `package.json` with the frozen selection; no package-manager default or worker preference enters the manifest. |
| `CMD-BOOTSTRAP-01` | Exact initial package-manager command or commands that generate the one authoritative lockfile from the prepared manifest, including lifecycle-script and network policy. | Produces the selected lockfile and only the explicitly permitted generated paths; every permitted `package.json` or lockfile mutation is named in advance. |
| `PATH-GENERATED-01` | Exact repository dependency, build, test, browser, and cache paths plus any relevant external cache or download location created by bootstrap or validation. | Repository-generated paths are covered by the minimal primary-owned ignore update before the worker lease and copied into the packet's known-side-effect field; the guard does not constrain ignored descendants or external locations, so command evidence, status inspection, and targeted cleanup prove this boundary. No generated path is tracked. |
| `CMD-CLEAN-01` | Exact safe clean-state preparation command and exact target paths. | Resolves and verifies each target inside the repository and equal to a selected generated path before targeted removal; preserves `package.json`, the lockfile, configuration, documentation, and unrelated work. |
| `CMD-RESTORE-01` | Exact selected frozen-lock restore command. | Restores from the accepted manifest and one lockfile with zero metadata or lockfile mutation. |
| `CMD-RESOLVE-01` | Exact non-mutating direct-version and package-relationship inspection command or commands. | Reports every material resolved direct version and the selected React, Playwright/browser, and axe-core relationships without updating dependency state. |
| `CMD-TYPECHECK-01` | Exact package-manager-prefixed `typecheck` command. | Runs the pinned TypeScript compiler independently in strict mode and exits successfully. |
| `CMD-FOCUSED-01` | Exact package-manager-prefixed focused-test command and exact non-ignored disposable probe path. | Targets only the probe, produces the recorded assertion failure and corrected pass, and does not run a future complete suite. |
| `CMD-CLEANUP-01` | Exact probe-removal procedure and targeted generated-output/status checks after bootstrap and validation. | Removes the disposable probe, leaves no unexpected generated tracked output or focused marker, and reports the expected final path state. |

The bootstrap mutation contract must enumerate every tracked path and generated directory that `CMD-BOOTSTRAP-01` may touch. If the selected package manager can change manifest fields, run lifecycle scripts, use the network, populate an external cache, or download browser assets, the frozen slot records whether that effect is permitted, suppressed, deferred, or cleaned. Ignored repository descendants and external locations are known side effects outside the lease guard's proof boundary, not guard-allowed or guard-forbidden paths; the packet names them exactly and the primary verifies them through command evidence, status inspection, and targeted cleanup. Any unlisted mutation or side effect stops the worker.

Before the setup packet is issued, `CMD-CLEAN-01` must use exact validated targets rather than globs, unresolved environment variables, or a workspace-wide path. Replace the focused-test placeholders with one exact allowed probe path and record the exact failing assertion, expected nonzero result, passing correction, expected zero result, removal procedure, and final cleanup check. The guarded `code_worker` creates and edits the probe with `apply_patch`, runs both focused commands, removes it with `apply_patch`, and reports the decisive results. After terminal lease closure, the primary confirms that the probe and generated tracked output are absent and inspects the command evidence; the primary does not create or edit the probe.

After setup, run only `CMD-CLEAN-01`, `CMD-RESTORE-01`, `CMD-RESOLVE-01`, `CMD-TYPECHECK-01`, and the recorded cleanup checks needed for independent verification. Do not rerun the bootstrap command as an update operation, run a second package manager, or create a second lockfile for comparison.

Documentation validation at each material write and closure:

    git diff --check
    git status --short

Resolve every changed relative Markdown link with the repository's proportional link check recorded during execution. If no repository validator exists yet, use one read-only PowerShell link-resolution command and retain only its summary, not a new validation subsystem.

## Validation and Acceptance

TDD is not applicable to RD-002 setup because no production behavior is being implemented. ADR-0024 explicitly routes dependency selection and declarative configuration through non-TDD evidence. The task must not invent a domain function or permanent vacuous test to manufacture Red.

RD-002 is accepted only when all of the following are true:

1. `RD-002-DRC-001` reaches `DRAFT READY`; the trigger audit records either that `DRAFT READY` is the untriggered R2 checkpoint or that the required fresh contract review passes; and the plan records the selected literals, current primary-source evidence, and every hard-gate disposition.
2. Any selected literal with a significant durable consequence has an owner-approved Accepted ADR before dependent setup; otherwise ordinary implementation-literal status is stated explicitly.
3. The setup assignment has one exact Milestone Assignment Packet v2, one fresh terminal `closed-compliant` lease receipt, no post-close drift at acceptance, a matching actual diff, and no unexpected paths.
4. The frozen manifest-authoring and bootstrap procedures create only the permitted package metadata, one authoritative lockfile, and named generated paths. Their actual mutations and side effects match the frozen contract exactly.
5. The selected clean-state preparation targets only validated generated paths. The selected frozen dependency restore then succeeds using one lockfile and does not mutate package metadata or the lockfile.
6. Every material direct dependency in the final manifest is pinned exactly and resolves to the recorded version. Transitive versions are recorded through the selected lockfile, not duplicated manually.
7. The pinned TypeScript compiler runs through the dedicated strict `typecheck` command successfully and independently of build, transpilation, tests, or editor diagnostics.
8. During the guarded setup lease, the focused test command targets only the requested probe/work-slice scope. It produces the expected nonzero assertion failure for the disposable failing probe and a zero pass after the intended correction, without requiring a complete future suite.
9. The disposable probe is removed. No focused/only marker, skipped test, snapshot, mock, helper, fake application behavior, second test framework, or generated test output remains.
10. The selected arrangement resolves the accepted React, Playwright, matching managed-browser, and axe-core package relationship needed by M1 without claiming the RD-003 scan profile or M1 runtime behavior is implemented.
11. The dependency and configuration audit finds no package or tool for an excluded surface. No installer, desktop wrapper, database, hosted service, vector service, generalized testing platform, product worker/queue/orchestrator, schema platform, router/state/component stack, release tooling, telemetry, or speculative framework is present.
12. Required ignore controls cover only actual generated paths; generated dependencies, build output, caches, browser artifacts, run data, and temporary probes are untracked. No unrelated user change is overwritten.
13. The S2 work-slice reviewer and fresh integrated reviewer return `PASS`, or `PASS WITH FOLLOW-UPS` whose every item is dispositioned without conflicting with a hard gate, task Verification, or documentation gate.
14. Roadmap Verification is reproduced verbatim against actual evidence, the documentation-impact review is complete, affected relative links resolve, and `git diff --check` passes.

Evidence identities to populate during execution include `RD002-DISC-001`, `RD002-RES-RUNTIME-001`, `RD002-RES-HARNESS-001`, `RD002-SYNTH-001`, `RD002-CHECKPOINT-TRIGGER-AUDIT-001`, conditional `RD002-CONTRACT-REVIEW-001`, `RD002-SETUP-PACKET-001`, `RD002-SETUP-LEASE-001`, `RD002-BOOTSTRAP-001`, `RD002-CLEAN-PREP-001`, `RD002-RESTORE-001`, `RD002-RESOLUTION-001`, `RD002-TYPECHECK-001`, `RD002-FOCUSED-RED-001`, `RD002-FOCUSED-GREEN-001`, `RD002-CLEANUP-001`, `RD002-SLICE-REVIEW-001`, `RD002-CLOSURE-001`, and `RD002-INTEGRATED-REVIEW-001`. `RD002-CONTRACT-REVIEW-001` is populated only when the trigger audit requires it; otherwise the audit records why `DRAFT READY` is the checkpoint. A name is not evidence until the plan records its exact command/source, result, relevant-tree and environment identity when reusable, and coordinator acceptance.

## Idempotence and Recovery

Research and source inspection are read-only and safe to repeat, but current-version facts must be refreshed when their source or retrieval date is stale. Reuse a research result only while its source and compared candidate remain unchanged.

The initial bootstrap is not a repeatable update command. Run it only from the exact precondition frozen in `CMD-BOOTSTRAP-01`. After a partial bootstrap failure, preserve and inspect every permitted tracked mutation, close the lease, and use only the validated targets in `CMD-CLEAN-01` for generated-state cleanup before a same-contract correction. Never rerun bootstrap to absorb unexplained changes, delete the workspace, or remove an unresolved or broad path.

Package installation is repeatable only through the selected frozen-lock command after the manifest and lockfile are accepted. Do not use an update command during validation. If restore mutates the lockfile or metadata, stop and reconcile rather than accepting the new state implicitly.

Every worker write turn has a fresh lease. A violation, ambiguous start, unexpected path, closed-lease replay, post-close drift, or noncompliant receipt freezes writes. Preserve the tree, inspect the exact state, and issue a new assignment only after reconciliation; never delete lease state, reset the worktree, or revert user/peer changes automatically.

If the setup worker's first attempt fails without changing the contract, one attempt-2 correction may use the same role, phase, path scope, and terminal parent lease. A changed package selection, command, configuration topology, authority, or expected result is not a correction; return to the selection barrier and issue a new work-slice contract if still authorized.

The primary's `.gitignore` maintenance occurs only with no active lease. If the selected tools change before setup, revise ignores before starting the next lease and record why. Do not let a worker change ignore controls.

The disposable test probe is recoverable by a fresh guarded `code_worker` setup assignment using the exact content recorded with its evidence identity. If the first assignment stops after the failing run, close and inspect that lease, then either issue the one permitted same-contract correction or stop; never have the primary repair the probe or leave it as a tracked/default-suite failure. Confirm cleanup with `git status --short` and the chosen test runner's focused discovery output.

Unrelated changes are preserved. If the worktree becomes dirty outside the accepted RD-002 paths, stop, attribute the overlap if possible, and ask for direction when path ownership cannot be reconciled safely.

## Artifacts and Notes

Retain only:

- the frozen candidate/evidence table and hard-gate dispositions in this plan;
- concise researcher report identities and the synthesis/checkpoint results;
- exact selected package/configuration paths, versions, bootstrap and clean-state slots, permitted mutations, and side-effect dispositions;
- the setup assignment and terminal lease identities;
- decisive bootstrap, cleanup, clean-restore, type-check, focused failure/pass, package-resolution, review, and closure summaries; and
- the final documentation-impact result.

Do not retain raw browsing transcripts, package-registry dumps, full agent reports, prompts, ignored lease runtime state, package caches, `node_modules`, browser downloads copied into the repository, the disposable probe, or generated telemetry. The lockfile is the transitive dependency record; do not duplicate it as a hand-maintained inventory.

## Interfaces and Dependencies

RD-002 will establish these development contracts, with exact values filled only after the R2 barrier:

- one selected JavaScript runtime support line and repository version declaration;
- one selected package-manager command surface and lockfile, including exact manifest authoring, initial bootstrap, permitted mutations, lifecycle/network side effects, generated paths, safe clean-state preparation, frozen restore, resolved-version inspection, and cleanup contracts;
- `typecheck`: a dedicated strict TypeScript compiler command;
- `test:focused`: a command that accepts one coherent test target without executing the complete future suite;
- the smallest build/service command arrangement required to scaffold M1 without giving browser code privileged authority;
- exact direct versions for TypeScript and every material M1 package introduced now;
- one accepted React client dependency pair;
- one accepted Playwright Library and matching managed-browser relationship;
- one accepted axe-core Playwright integration and resolved axe-core relationship; and
- a local-service host dependency only if the runtime standard library fails the frozen criteria.

No application API, domain record, URL validator, provider interface, persistence format, browser scan adapter, or UI component contract is created by RD-002. Those belong to later roadmap tasks.

## Revision Note

- 2026-08-29: Initial ExecPlan created after project-owner selection. It activates RD-002, records the R2 contract and S2 non-TDD setup route, and deliberately leaves every tool/package literal unfrozen until current primary-source research and review complete.
- 2026-08-29: Corrected after fresh review `RD002-PLAN-REVIEW-001`. The disposable harness probe is now wholly owned by the guarded non-TDD setup worker at an exact non-ignored path, and Concrete Steps now distinguish the historical clean baseline from the accepted current activation diff.
- 2026-08-29: Dispositioned the only follow-up from fresh re-review `RD002-PLAN-REVIEW-002` by making artifact completeness phase-aware, so legitimate preselection revisions cannot be mistaken for missing frozen decisions.
- 2026-08-29: Corrected all three Major findings from the project-owner-supplied independent review. The pre-draft R2 checkpoint now follows the repository's risk triggers, documentation is excluded from the worker lease and remains primary-owned, and complete unresolved bootstrap/mutation/generated-path/clean/restore/inspection/cleanup slots must be frozen before setup. No tool or command was selected by this correction.
- 2026-08-29: Corrected the new Major from fresh re-review `RD002-PLAN-REREVIEW-003`. The packet now distinguishes guard-observable allowed/forbidden paths from exact ignored repository and external side effects, which remain outside guard proof and require command evidence, inspection, and cleanup. No tool or generated path was selected by this correction.
- 2026-08-29: Accepted fresh complete-artifact re-review `RD002-PLAN-REREVIEW-004` with verdict `PASS` and no findings. All four Major corrections are closed, so bounded non-ranking discovery is the next permitted action; no selection or setup work was authorized by the review.
