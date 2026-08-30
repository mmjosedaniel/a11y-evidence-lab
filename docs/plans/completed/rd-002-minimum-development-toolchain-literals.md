# Establish the minimum RD-002 development toolchain

Completed plan for RD-002. The roadmap owns task status; this archive preserves the original contract, decisions, and verification history.

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Progress

- [x] (2026-08-29 21:57Z) The project owner explicitly selected RD-002 by requesting this ExecPlan. Confirmed that RD-001 is Complete, RD-002 is the only dependency-ready roadmap task, every directly named requirement and ADR is Accepted at its recorded scope, and no RD-002 evaluation-freeze condition remains open. Evidence: `docs/DEVELOPMENT_ROADMAP.md`, `docs/PROJECT_REQUIREMENTS.md`, the authorities listed under Context and Orientation, and clean `git status --short --branch` output on `codex/rd-002-toolchain-literals`.
- [x] (2026-08-29 21:57Z) Activated the living plan and its R2 Decision Review Contract before comparative research or package selection. Updated the roadmap, plan index, and task progress index coherently; no application dependency, executable configuration, or product behavior was added.
- [x] (2026-08-29 22:09Z) Received fresh read-only review `RD002-PLAN-REVIEW-001` with verdict `REVISE`. Corrected its Major finding by moving the disposable harness probe's complete lifecycle into the guarded `code_worker` setup assignment, and corrected its Minor finding by separating historical clean-tree evidence from the current activation diff. Fresh re-review remains pending.
- [x] (2026-08-29 22:17Z) Fresh complete-artifact re-review `RD002-PLAN-REVIEW-002` closed both prior findings and returned `PASS WITH FOLLOW-UPS`. Dispositioned its one Minor follow-up by making `INV-ART-01` phase-aware: pre-freeze revisions prove explicit non-selection and complete selection slots; selection-freeze and later revisions prove complete literals and commands.
- [x] (2026-08-29) Accepted the project-owner-supplied independent review with verdict `REVISE`. Corrected all three Major findings: the R2 contract checkpoint is now trigger-dependent, research-derived developer documentation is primary-owned outside the worker lease, and the plan now reserves every binding bootstrap, mutation, clean-state, restore, inspection, and cleanup slot before discovery. Fresh complete-artifact re-review is required because the corrections are normative.
- [x] (2026-08-29) Fresh complete-artifact re-review `RD002-PLAN-REREVIEW-003` closed the three supplied Major findings and returned `REVISE` for one new Major contradiction: ignored generated side effects were both required and included in the semantic forbidden scope. Corrected the setup packet by separating guard-observable write scope from exact ignored/external side effects and cleanup; a new fresh review remains required.
- [x] (2026-08-29) Fresh complete-artifact re-review `RD002-PLAN-REREVIEW-004` returned `PASS` with no findings. It independently closed the three project-owner-supplied Major findings and the generated-side-effect scope correction. The plan may advance to bounded non-ranking discovery; selection and setup barriers remain unchanged.
- [x] (2026-08-29 23:55Z) Reconfirmed RD-002 readiness and accepted `RD002-PLAN-REREVIEW-004`; completed the single non-ranking discovery pass `RD002-DISC-001` and froze the candidate set, evidence dimensions, hard gates, cumulative invariants, and two-report split below. No package, version, or implementation command was selected or installed.
- [x] (2026-08-30 00:05Z) Received both read-only dimension reports at the single research barrier. `RD002-SYNTH-001` returns `RETURN FOR RESEARCH`: exact bootstrap/package side effects, runtime patch policy, and the source-free compiler configuration need targeted evidence. Issued the one shared follow-up round to the same two researchers; no selection or setup is authorized.
- [x] (2026-08-30) Reconciled both follow-ups. `RD002-SYNTH-002` returns `OWNER DIRECTION`: the research allowance is exhausted while the client-build and lifecycle-side-effect evidence remains incomplete. The empty `files` suggestion is withdrawn, but no selection passes the full contract. No analyst trigger was found; this is an exhausted evidence budget, not an owner tool-preference choice or unresolved allocation of later-task proof.
- [x] (2026-08-30) The project owner explicitly authorized the requested additional bounded research round. This reopens only the recorded build, install-script, and runtime patch-policy gaps within the existing candidate set; it does not reset setup/review correction limits or authorize global environment changes.
- [x] (2026-08-30) Reconciled the owner-authorized round and primary-source verification in `RD002-SYNTH-003: DRAFT READY`. Decided script suppression, optional native packages, and exact temporary-runtime/cache boundaries before implementation; native loading is the existing setup proof, not a deferred decision.
- [x] (2026-08-30) `RD002-CHECKPOINT-TRIGGER-AUDIT-001` finds no R1/R2 review trigger or analyst trigger. `DRAFT READY` is the contract checkpoint; no extra role was added.
- [x] (2026-08-30) Froze the ordinary literals, exact manifest/configs, all required command slots, and generated-output/cleanup policy. No durable architecture consequence or new ADR is required.
- [x] (2026-08-30) Primary updated only the required ignores before the lease. `RD002-SETUP-PACKET-001` completed the non-TDD setup, genuine focused failure/pass, and probe removal; the primary closed `RD002-SETUP-LEASE-001` compliantly and confirmed no post-close drift before accepting its path evidence.
- [x] (2026-08-30) Inspected the actual diff and terminal receipt, independently completed clean restore, package/native resolution, and strict type checking, and accepted the disposable focused failure/pass evidence. Reconciled current developer instructions and selected-literal references without changing requirement or ADR statuses.
- [x] (2026-08-30) Fresh `RD002-SLICE-REVIEW-001` returned `PASS` with no findings. It inspected the original dispatched semantic packet, terminal receipt, actual configuration, all direct pins and lock entries, runtime/archive identity, unchanged hashes, and relevant negative scope. No correction was required.
- [x] (2026-08-30) Complete RD-002 Verification, dependency/test relevance audit, documentation gate, cleanup, and fresh integrated review passed. RD-002 is Complete and this same plan is archived. The permitted final reconciliation readback returned `PASS` with no findings; every closure follow-up is closed and RD-003 remains Not started.

## Surprises & Discoveries

- Observation: The tracked repository has no application source, package manifest, lockfile, TypeScript configuration, executable test, or dependency installation. It contains the accepted planning baseline and repository workflow only. Evidence: `rg --files`, the project overview, and `Get-ChildItem -Force` on 2026-08-29.
- Observation: The current host reports Node.js `v24.18.0`, npm `11.16.0`, pnpm `11.15.1`, Python `3.12.10`, and Git `2.53.0.windows.1`. These are environment observations, not selections. The Proposed feasibility seed names Node.js `24.19.0`, so neither the installed host version nor the dated seed may be copied into package metadata without current primary-source and compatibility evidence.
- Observation: `.gitignore` currently covers only `temp/`, `logs/`, and the lease guard's Python cache. Dependency and build output ignores will be required before installation, but the lease guard deliberately seals ignore controls. Any required `.gitignore` edit is therefore a recorded primary-coordinator guard-control change between leases, never part of the worker setup lease.
- Observation: RD-002 is non-behavioral dependency and executable-configuration setup, yet its Verification requires a focused harness to show a real failure and pass. The guarded setup worker will use and remove one explicitly allowed, non-ignored disposable probe so the repository does not retain a meaningless always-passing product test solely to validate the runner.
- Observation: Execution resumed from a clean `codex/rd-002-toolchain-literals` worktree at `c2d9189468ae034fadb3afcf29875a9f3daf6f99`, not the nine-path uncommitted activation state described by the earlier checkpoint. `git status --short --branch`, `git diff --name-only`, and `git ls-files --others --exclude-standard` showed no changes on 2026-08-29. The existing nine documentation paths are present and preserved; their prior history is not rewritten. Host versions still match the observations above. No active lease pointer was present.
- Observation: Current official discovery pages differ from dated repository seeds: the Node.js release page identifies Node 24 as LTS and Node 26 as Current, and pnpm documents both its default npm-distributed line and a newly released native line. Search snippets for axe packages also lag current branch content. These are discovery observations, not selections; comparative reports must use version-pinned upstream or registry evidence rather than a search snippet or repository seed.
- Observation: The first harness report proposes `files: []` for an empty TypeScript baseline but does not establish that the compiler accepts it. A successful no-input command is not presumed. The targeted follow-up must reconcile the compiler diagnostic and identify a genuinely needed configuration input without adding fake application code.
- Observation: Fresh local lease-guard self-test evidence is now retained: `python -B .codex\leases\lease_guard.py self-test` exited 0 with `self-test-passed`, `ok: true`, and 27 passing checks. The host is Windows 11 Home Single Language, version `10.0.26200`, x64. This proves the current guard preflight, not any future worker lease or selected toolchain.
- Observation: The shared follow-up withdraws `files: []` because of `TS18002`. A genuinely required `vite.config.ts` could supply the initial compiler input, but creating an otherwise unnecessary config solely to avoid an empty program is not accepted. Both researchers still identify plugin-free automatic React JSX handling as an evidence gap. The runtime follow-up supplies Vite `7.1.0` metadata despite discovery using current Vite documentation; it does not reconcile that version's present support or explain its use instead of the current line.
- Observation: The runtime follow-up infers that a declared esbuild `postinstall` makes script suppression impossible and proposes enabling dependency scripts. Script presence alone does not prove that inference or bound every possible script side effect. The primary has not accepted either blanket script execution or a claim that suppression is safe. Likewise, Node release-index `security: false` describes that release entry; it is not proof that an older patch lacks subsequently fixed vulnerabilities.

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
- Decision: Freeze the bounded comparison as runtime support line, package-manager mechanics, client bundling and service execution, host minimality, focused harness, and the already Accepted material package families; use two read-only dimension reports and one synchronization barrier.
  Rationale: `RD002-DISC-001` found current official sources for these independent dimensions. The comparison does not reopen TypeScript, React, Playwright, or axe-core adoption, enumerate every ecosystem alternative, or require one agent per candidate. R2 and the existing hard gates/invariants remain appropriate; no custom cross-platform, security, identity, recovery, or serialization contract is introduced.
  Date/Author: 2026-08-29 / primary coordinator.
- Decision: Return the first synthesis for the single permitted targeted research follow-up, without selecting a candidate or invoking an analyst yet.
  Rationale: The reports supply useful lifecycle and package-family evidence but omit binding exact install mechanics and leave the empty compiler configuration unresolved. These are named evidence gaps, not contradictory reports, closely ranked alternatives, an owner value choice, or an unresolved allocation of proof to a later task. Both gaps must be resolved before a second synthesis; repeated decisive gaps or exhausted budget stop selection.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Stop at `OWNER DIRECTION` after the one targeted research round; retain RD-002 as In progress and leave all setup slots unresolved.
  Rationale: The build contract and dependency lifecycle effects remain decision-critical missing evidence. Deferring them to an attempted install or future M1 build would violate the freeze boundary. The existing research budget is exhausted, and neither an additional agent nor primary source collection may silently reset it. No setup lease, dependency, configuration, source, browser download, global-runtime mutation, or later-task work is authorized by these reports.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Use the owner's explicit additional research allowance for the existing named gaps, with the same two read-only researcher instances and one final shared barrier.
  Rationale: The owner answered the specific re-entry request affirmatively. One additional report per dimension is authorized, with no further follow-up implied. The existing criteria, candidates, hard gates, later-task boundaries, and implementation/review budgets remain unchanged.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Select Node 24.20.0 with bundled npm 11.19.0, Vite 8.0.16 without a React plugin, native erasable TypeScript, node:http, and node:test; freeze the exact package and command contract below.
  Rationale: The reconciled primary sources support the smallest complete M1 arrangement. A temporary official runtime avoids modifying the older global installation. Suppressed lifecycle scripts and retained platform packages define the policy before setup; native loading and strict compiler execution then prove it. This is ordinary RD-002 literal selection with no product, ADR, or release-status change.
  Date/Author: 2026-08-30 / primary coordinator.

## Outcomes & Retrospective

RD-002 is Complete after its Verification, accepted S2/integrated reviews, and documentation gate. The pinned baseline restores reproducibly, native package loading and independent strict checking pass, and the disposable harness demonstrated the genuine failure/pass exits before removal. Temporary verification runtime/cache artifacts are removed; global Node/npm are unchanged. No application behavior, browser execution, or later-task implementation is claimed. RD-003 is dependency-ready but Not started and requires separate owner selection. The final reconciliation readback returned `PASS` with no findings; all closure follow-ups are complete. The owner-authorized extra research round closed concrete evidence gaps, and the worker-first setup needed no correction or Refactor.

## Purpose / Big Picture

RD-002 establishes the smallest reproducible development baseline that the M1 scan-to-evidence walking skeleton can immediately consume. When the task is complete, a developer can install exactly the pinned material packages, run strict TypeScript checking independently, invoke one focused test command independently, and use a documented build/service arrangement compatible with the already accepted TypeScript, React, localhost-service, Playwright, axe-core, and milestone-slice TDD boundaries.

Success is observable without claiming an application exists: a clean dependency restore succeeds from one selected lockfile; the selected compiler reports a successful strict check through its own command; the selected focused test path reports one intentional failure and then a pass through a disposable probe; package and managed-browser relationships resolve as recorded; and the dependency/configuration diff contains nothing for Deferred, Proposed-only, release, or hypothetical post-M1 work.

## Context and Orientation

The repository is Development ready. RD-001 is Complete, and the project owner selected RD-002 in this request. RD-002 is on the mandatory dependency spine before RD-003 and all M1 work. Application implementation remains absent.

The controlling task is [RD-002](../../DEVELOPMENT_ROADMAP.md#rd-002--select-the-minimum-development-toolchain-literals). Its direct authorities are:

- [ADR-0008](../../architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md): Playwright with its matching managed Chromium is Accepted only as the initial browser-automation evaluation baseline.
- [ADR-0009](../../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md): a pinned axe-core integration is Accepted only for the exact three-rule evaluation baseline.
- [ADR-0011](../../architecture/decisions/ADR-0011-typescript-as-initial-application-language.md): TypeScript is the initial application language; strict compiler checking must run independently, runtime trust-boundary validation remains separate, and the ADR selects no runtime, package manager, build tool, service framework, or schema framework.
- [ADR-0012](../../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md): React is the initial client-rendered UI evaluation baseline, not a router, state library, data library, CSS system, component kit, build tool, or full-stack framework decision.
- [ADR-0015](../../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md): one developer-started local application service owns privileged behavior and serves an unprivileged loopback UI in Chrome or Edge; the exact host framework and start command remain implementation literals.
- [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md): behavior-bearing work uses independent Red and Green ownership, while dependency selection and declarative setup use the separately justified non-TDD route. RD-002 must choose the smallest focused harness and pin every material version it introduces.
- [`REQ-INST-002`](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md#mvp-startup-model-setup-and-deferred-packaging): the developer starts the local service, receives readiness or startup failure, has a clean stop path, and opens its loopback URL; launcher, browser launch, desktop wrapper, and duplicate-instance machinery are not required.
- [`REQ-QUAL-010`](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations): compile-time types do not replace minimal runtime validation at the actual unknown-data boundaries, but a schema platform, provider probe, and hostile-target validator are outside scope.
- [`REQ-QUAL-012`](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations): one user operation runs at a time; no queue, resume graph, child-attempt lineage, or workflow engine is required.

Supporting, non-authoritative evidence includes [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md), [Candidate architecture](../../architecture/CANDIDATE_ARCHITECTURE.md), and the Proposed [scan technology selection assessment](../../architecture/candidates/authorized-scan/TECHNOLOGY_SELECTION.md). They supply dated seeds and constraints but cannot make the selection.

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

`RD002-DISC-001` is complete and coordinator-accepted on 2026-08-29. It identified candidates and evidence locations without scores, ranking, recommendation, installation, lockfile generation, or version selection. The frozen comparison is:

| Literal / evidence axis | Frozen candidates | Exact boundary and unresolved evidence |
| --- | --- | --- |
| Runtime | Node.js 24 LTS; Node.js 26 Current | Compare current support/lifecycle, Windows x64, Accepted-package compatibility, native TypeScript limitations, and exact patch policy. The installed `24.18.0` and dated `24.19.0` seed are observations only. Other runtimes are not needed to test the documented Node-hosted Playwright shape and are not claimed disqualified. |
| Package manager | npm; pnpm's documented default stable distribution | Compare the exact supported release for the candidate runtime, bootstrap and frozen restore, manifest/lockfile mutation, script policy, caches, network effects, and cleanup. Do not silently switch to pnpm's newly separate native delivery line; evidence that this is required reopens the contract. |
| Client build | Vite; direct esbuild | Compare a local static React client bundle, TypeScript/JSX handling, Windows support, minimum config, generated output and install side effects. No template generator, full-stack framework, dev-server topology, HMR requirement, or plugin is presumed. `@vitejs/plugin-react` is a conditional candidate only if current evidence proves it necessary for the named M1 build rather than optional refresh behavior. |
| Service execution | Native Node TypeScript execution with explicit supported-syntax constraints; compiler-emitted JavaScript executed by Node | Compare exact commands, import/module semantics, independent strict checking, minimum config, and generated output. Neither candidate creates service behavior in RD-002. |
| Local-service host | Node `node:http` standard library; Fastify | Compare the capabilities needed for the one loopback service, shutdown, simple API/static assets, and dependency/configuration cost. No host package enters unless the standard library fails a current criterion. No schema platform is authorized. |
| Focused harness | Node `node:test` and `node:assert/strict`; Vitest | Compare exact single-file TypeScript execution, genuine assertion failure/pass exits, compiler independence, minimum configuration, Windows support, and compatibility with later browser-driven M1 checks. No DOM emulator, second runner, coverage platform, or permanent vacuous test enters. |
| Material package families | `typescript`, `react`, `react-dom`, `@types/node`, `@types/react`, `@types/react-dom`, `playwright`, `@axe-core/playwright`, and its resolved `axe-core`; only the selected conditional build/host/harness packages above | Exact versions and direct/transitive placement remain pending current registry and upstream-manifest evidence. Direct `axe-core` is permitted only if a named immediate M1 use requires it; otherwise its exact resolved version belongs to the one lockfile and evidence. LangChain, model/provider packages, corpus assets, and all later-task dependencies remain deferred to their owners. |

No candidate was hard-gate-rejected during discovery. `HG-01` through `HG-09` and `INV-ART-01` through `INV-DOC-01` remain the complete cumulative packet. Reversal of a later hard-gate rejection requires new primary evidence that the named failing condition is no longer true; a new candidate, new delivery line, or changed decision boundary first returns to coordinator reconciliation within the remaining budget.

Discovery source identities, all retrieved 2026-08-29, are source locations and bounded observations rather than final compatibility/version evidence:

| ID | Official primary source | Discovery contribution |
| --- | --- | --- |
| `DISC-SRC-01` | [Node.js releases](https://nodejs.org/en/about/previous-releases) | Node 24 LTS and Node 26 Current are documented support-line candidates; exact release and support evidence belongs to the runtime report. |
| `DISC-SRC-02` | [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/) and [package lock](https://docs.npmjs.com/files/package-lock.json/) | npm documents frozen restoration and one generated dependency-tree record; the versioned command contract remains to be verified. |
| `DISC-SRC-03` | [pnpm installation](https://pnpm.io/installation) | Documents Windows installation, runtime compatibility, default distribution, and the separate new native line; no installation is authorized. |
| `DISC-SRC-04` | [Vite guide](https://vite.dev/guide/), [esbuild](https://esbuild.github.io/), and [React from scratch](https://react.dev/learn/build-a-react-app-from-scratch) | Identifies client-build candidates and their official configuration sources. |
| `DISC-SRC-05` | [Node test runner](https://nodejs.org/api/test.html), [Vitest guide](https://vitest.dev/guide/), and [TypeScript config reference](https://www.typescriptlang.org/tsconfig/) | Identifies focused-harness and independent compiler evidence; unversioned Node documentation currently describes Node 26 and must not be used to infer Node 24 behavior. |
| `DISC-SRC-06` | [Node HTTP](https://nodejs.org/api/http.html) and [Fastify LTS](https://fastify.dev/docs/latest/Reference/LTS/) | Identifies standard-library and framework host evidence; support tables and exact manifests need reconciliation. |
| `DISC-SRC-07` | [Playwright Library](https://playwright.dev/docs/library), [browser management](https://playwright.dev/docs/browsers), and [Deque Playwright package](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/package.json) | Identifies package/browser and axe integration relationships; mutable branch/search version observations are not selected versions. |

The final split is `RD002-RES-RUNTIME-001` for runtime lifecycle/Windows, npm-versus-pnpm mechanics, client bundling/service execution, all corresponding exact commands/mutations/generated paths; and `RD002-RES-HARNESS-001` for service-host minimality, focused harness, compiler strictness, and exact TypeScript/React/Playwright/axe versions and relationships. Both received Research Assignment Capsule v1, remain read-only, may not spawn agents, and reported to one barrier. Each reuses the other's assigned evidence rather than recollecting it. The single shared targeted follow-up round has now been issued. Neither report makes the final selection.

### Research barrier and synthesis evidence

`RD002-SYNTH-001` (2026-08-30): `RETURN FOR RESEARCH`. Both first reports are received, but their unverified suggestions are not accepted selection facts. The runtime report establishes support-line and install/restore semantics but does not freeze exact manager/build versions, runtime patch handling, script policy, or cache containment. The harness report supplies exact package-version claims and standard-library capability evidence, but the empty compiler configuration, current compiler packaging, browser-install side effects, and version-pinned metadata need reconciliation. No hard-gate rejection or final recommendation is accepted at this barrier.

`RD002-RES-RUNTIME-001-F1` and `RD002-RES-HARNESS-001-F1` are the one shared follow-up round. They must provide exact primary-source metadata and binding-mechanics evidence; resolve the no-source compiler issue without fabricated product code; distinguish native TypeScript execution from independent checking; and keep browser execution, service behavior, and UI proof in their owning later tasks. They cannot install packages, change the candidate set, update the global runtime, write repository files, or select a winner. The next synthesis must accept material new evidence or stop under the existing budget.

`RD002-SYNTH-002` (2026-08-30): `OWNER DIRECTION`. Both follow-ups are received. The compiler-input defect is reconciled by withdrawing `files: []`; the alternative remains conditional on a necessary executable config. The reports also provide version-pinned package metadata and a typed disposable probe candidate. Those contributions do not close the following selection gaps:

| Gap | Evidence and required reconciliation | Contract impact |
| --- | --- | --- |
| `RD002-GAP-BUILD-01` | `RUNTIME-SRC-17` uses [Vite 7.1.0 metadata](https://registry.npmjs.org/vite/7.1.0), while discovery uses current [Vite guidance](https://vite.dev/guide/). Neither follow-up reconciles version-specific React automatic JSX support, plugin necessity, or current support for the proposed older build version. The direct esbuild alternative also needs a complete exact build/config and maintained-version rationale before selection. | Criteria 2, 3, 7; `HG-06`; `INV-EVD-01`, `INV-ART-01`. No build configuration is frozen. |
| `RD002-GAP-INSTALL-01` | `RUNTIME-SRC-18` identifies [esbuild 0.25.0's lifecycle declaration](https://registry.npmjs.org/esbuild/0.25.0), but does not prove that suppression is inoperable or bound the fallback download/cache behavior when scripts run. `--ignore-scripts=false` is a candidate, not an accepted policy. Exact script and native-package effects must be established for the actual selected versions before all bootstrap/restore/generated-path slots can be frozen. | Criteria 4, 9; `HG-03`; `INV-BOOT-01`. No bootstrap or restore command is authorized. |

Runtime patch support also needs an evidence-honest rationale in any eventual synthesis: [Node's release index](https://nodejs.org/dist/index.json) and archive metadata are not a standalone patch-vulnerability assessment. Neither the host patch nor a newer patch has been selected. No global runtime update is implied.

All sources above were collected in the existing reports on 2026-08-29; they are trace links for the incomplete evidence, not new research or accepted package choices. No final hard-gate rejection is recorded. `HG-01`, `HG-02`, `HG-08`, and `HG-09` remain respected by the no-change boundary; evidence for `HG-03` through `HG-07` is not complete and cannot be replaced by a report verdict.

Routing audit: no three-way close ranking, inter-report contradiction requiring comparative synthesis, owner-controlled tool preference, or unresolved decide-now/prove-later allocation was found. The missing build/install evidence belongs in RD-002 before selection. No `decision_analyst` is added. Because `DRAFT READY` was not reached, its checkpoint-trigger audit and any conditional contract review have not occurred; no checkpoint is claimed.

Re-entry requires explicit owner authorization for a narrowly scoped additional evidence allowance covering `RD002-GAP-BUILD-01`, `RD002-GAP-INSTALL-01`, and the runtime patch-policy rationale, using the existing candidate set and plan. Such permission would not approve a package selection, broaden product scope, reset setup/review correction limits, or authorize global environment changes. Until then, remaining research allowance is zero and every binding setup slot stays unresolved.

Owner-authorized re-entry (2026-08-30) supersedes only the preceding zero remaining research allowance: one additional bounded round is now available. `RD002-RES-RUNTIME-002` owns the runtime patch policy, exact npm/build-package version and lifecycle/cache mechanics; `RD002-RES-BUILD-002` uses the existing harness researcher for version-specific React JSX and the minimum real build/compiler configuration. They share build-version evidence, do not duplicate collection, and remain read-only. Each may issue one report, with no extra follow-up allowance. The primary reconciles both at one barrier and owns the next synthesis. All setup slots remain unresolved until that synthesis and the applicable checkpoint succeed.

Stopped-state documentation validation (2026-08-30): `git diff --check` passes; a read-only PowerShell check resolves all 30 relative link targets across this plan and the two changed progress documents, excluding fenced template examples; the new synthesis heading and existing RD-002 roadmap anchor are present. Actual status contains only those three documentation paths. The manifest, lockfiles, dependency tree, compiler/build configs, and disposable probe are absent. No roadmap, requirement, ADR, developer command, or ignore-control change is needed because neither canonical status nor selected/implemented behavior changed. This is a reconciled research stop, not RD-002 closure or implementation verification.

### Accepted synthesis and ordinary literal freeze

`RD002-SYNTH-003` (2026-08-30): `DRAFT READY`. The owner-authorized round supplies material new evidence and closes the named decision gaps. The primary also verified the reported Node archive/checksum, security-release history, TypeScript native package metadata, and published Rolldown/Lightning CSS platform packages through read-only primary-source requests. No dependency installation was used as research.

The runtime report's request to prove a locked installation *before* accepting any bootstrap command is not adopted: it would be circular. The policy is decided now—exact direct versions, one npm lockfile, all lifecycle hooks suppressed, optional platform packages retained, cache paths fixed, no browser installation. Successful native-module loading and compiler execution are precisely the existing RD-002 setup proof, not an unresolved decision delegated to implementation. A failure stops the worker; it does not permit scripts, package substitution, or changed configuration. The Vite report's default automatic JSX behavior and the explicit `jsx: react-jsx` compiler setting agree; no additional Oxc override or React plugin is needed.

| Axis | Selected literal and reason | Disposition of the alternative |
| --- | --- | --- |
| Runtime | Node.js `24.20.0`, Node 24 LTS, Windows x64 reference verification. Latest supported patch at this freeze, with bundled npm `11.19.0`. Future updates require a scoped baseline change and revalidation, not an automatic range. | Node 26 Current is technically compatible but supplies no named M1 need over LTS. Host `24.18.0` is not selected because `24.18.1` documents intervening security fixes. |
| Manager | npm `11.19.0` and only `package-lock.json`; bundled with the chosen runtime, documented frozen `ci` restore, one scoped cache. | pnpm 11 is viable but adds a manager acquisition/store configuration with no required benefit for this one-package repository. No pnpm/native-line experiment or second lockfile. |
| Client build | Vite `8.0.16`; conventional HTML/asset processing and TSX/Oxc transformation, with `dist/client` as the service-owned static output. | Direct esbuild `0.28.2` can transform automatic JSX, including with optional binaries and suppressed scripts, but requires a separate HTML/static copy/rewrite arrangement. It is not added. |
| Service execution and host | Native Node erasable TypeScript, ESM, explicit `.ts` imports; `node:http` for the later one loopback service. | Compiler-emitted service JS adds an unnecessary output/build step. Fastify has no demonstrated necessity under the standard-library-first constraint. |
| Focused harness | `node:test` plus `node:assert/strict`, exact single-file target through `test:focused`. | Vitest adds a second transformation/runner surface without a named M1 requirement; this is a present-scope exclusion, not a universal prohibition. |
| Compiler and package families | Exact direct versions in `PROC-MANIFEST-01` below; native TypeScript CLI with independent strict `tsc`. React is the client pair; Playwright Library and axe wrapper are service dependencies. | No direct axe-core duplicate, `@playwright/test`, React plugin, schema package, provider/model package, or hypothetical application library. |

Current source trace (retrieved 2026-08-29 local date; reconciled 2026-08-30 UTC):

| Evidence ID | Primary source and accepted contribution |
| --- | --- |
| `SEL-SRC-01` | [Node 24.18.1 security release](https://nodejs.org/en/blog/release/v24.18.1), [24.20 archive](https://nodejs.org/en/download/archive/v24.20.0), [official checksums](https://nodejs.org/dist/v24.20.0/SHASUMS256.txt), and [LTS policy](https://nodejs.org/en/about/previous-releases): patch rationale, exact runtime/npm pair, Windows archive and SHA-256. A checksum over HTTPS is not a claim of independent signature verification. |
| `SEL-SRC-02` | [npm 11.19 metadata](https://registry.npmjs.org/npm/11.19.0), [npm v11 configuration](https://docs.npmjs.com/cli/v11/using-npm/config/), [install](https://docs.npmjs.com/cli/v11/commands/npm-install/), and [ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/): runtime range, explicit script/cache/optional flags, initial lock generation versus non-mutating frozen restoration. |
| `SEL-SRC-03` | [Vite 8.0.16 manifest](https://raw.githubusercontent.com/vitejs/vite/v8.0.16/packages/vite/package.json), [Vite features](https://vite.dev/guide/features.html), [Oxc JSX](https://oxc.rs/docs/guide/usage/transformer/jsx), and [Vite releases](https://github.com/vitejs/vite/blob/main/docs/releases.md): current line, Oxc/automatic JSX, HTML processing, separate checking, and required isolated-module discipline. |
| `SEL-SRC-04` | [Rolldown 1.0.3](https://registry.npmjs.org/rolldown/1.0.3), [Lightning CSS 1.32.0](https://registry.npmjs.org/lightningcss/1.32.0), and [TypeScript 7.0.2](https://registry.npmjs.org/typescript/7.0.2): published optional Windows x64 native packages. Their runtime loading remains setup proof; suppressing scripts prevents lifecycle fallback downloads. Transitive ranges remain owned by the lockfile. |
| `SEL-SRC-05` | [React 19.2.8](https://registry.npmjs.org/react/19.2.8), [React DOM 19.2.8](https://registry.npmjs.org/react-dom/19.2.8), [Node types 24.13.3](https://registry.npmjs.org/%40types%2Fnode/24.13.3), [React types 19.2.18](https://registry.npmjs.org/%40types%2Freact/19.2.18), and [DOM types 19.2.5](https://registry.npmjs.org/%40types%2Freact-dom/19.2.5): exact compatible pair/type metadata from the harness report. |
| `SEL-SRC-06` | [Playwright 1.62.1](https://registry.npmjs.org/playwright/1.62.1), [axe wrapper 4.13.0](https://registry.npmjs.org/%40axe-core%2Fplaywright/4.13.0), [axe-core 4.13.0](https://registry.npmjs.org/axe-core/4.13.0), and [browser catalog](https://raw.githubusercontent.com/microsoft/playwright/v1.62.1/packages/playwright-core/browsers.json): exact Playwright/core pair, wrapper-to-core dependency, Chromium catalog revision `1234` / `151.0.7922.34`. Catalog inspection is not browser installation, launch, or RD-003 profile acceptance. |
| `SEL-SRC-07` | [Node 24 TypeScript](https://nodejs.org/docs/latest-v24.x/api/typescript.html), [test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), [HTTP](https://nodejs.org/docs/latest-v24.x/api/http.html), and [TSConfig](https://www.typescriptlang.org/tsconfig/): native erasable execution, independent checking, focused exits, host primitives, and exact compiler-option meanings. |

`RD002-CHECKPOINT-TRIGGER-AUDIT-001`: no custom serialization, identity, integrity, concurrency, recovery, or cross-platform-equivalence contract is introduced; the official archive's ordinary published hash is not a custom integrity system. No decision-semantic uncertainty is deferred to runtime proof, no candidates remain closely ranked or materially contradictory, and filling the reserved bootstrap/path slots introduces no mechanism outside the reviewed contract. The two reports are reconciled without an unresolved comparison or owner value choice. No analyst or separate contract reviewer is triggered. `DRAFT READY` is the R2 checkpoint; `RD002-CONTRACT-REVIEW-001` is not applicable. Fresh S2 setup and integrated reviews remain mandatory.

Hard gates: `HG-01/02/08/09` pass selection scope/authority review; `HG-03` has one exact manager/manifest/lock policy with restore proof pending; `HG-04` has the independent strict compiler contract with execution pending; `HG-05` has the exact typed failure/pass/removal contract with execution pending; `HG-06` is supported by the package/build/service boundaries, with package/native-loading proof pending and product behavior explicitly later; `HG-07` has official Windows x64 distributions and exact invocation, with reference-host execution pending. No pending execution gate is marked implemented or passed.

The cumulative invariants are dispositioned at this freeze: `INV-ART-01` and `INV-BOOT-01` are covered by the exact configuration and command contract below; `INV-EVD-01` by the source table and explicit operational-proof boundary; `INV-AUTH-01` remains unchanged; `INV-REP-01`, `INV-CMD-01/02`, `INV-SCP-01`, `INV-OWN-01`, and `INV-DOC-01` remain the named setup/review/closure proof obligations. No permanent product test or application source is authorized.

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
| `INV-ART-01` | Any pre-freeze plan revision; selection freeze and every later artifact revision | Before selection freeze, every required selection slot, criterion, and boundary is present and every unfrozen value is explicitly pending rather than implied. At selection freeze and afterward, every required literal, exact version, rationale, command, and prove-now/prove-later disposition is present; no separate undocumented selection exists. | `RD002-SYNTH-003` and exact command/config sections cover the freeze; actual configuration and S2 review agree. | Primary; trigger-required contract reviewer when applicable; integrated reviewer at closure. |
| `INV-EVD-01` | Every time-sensitive selection claim | Each material version, lifecycle, support, and compatibility claim maps to a current primary source with retrieval date; uncertainty is explicit. | `SEL-SRC-01` through `SEL-SRC-07` plus accepted resolution/type-check/harness evidence; browser and application execution remain later-task proof. | Primary; trigger-required contract reviewer when applicable. |
| `INV-AUTH-01` | Every material revision | Requirement and ADR statuses remain unchanged; only RD-002 is active until its verified closure; later tasks and evaluation claims remain unimplemented. | Current authority review passes. | Primary; trigger-required contract reviewer when applicable; integrated reviewer at closure. |
| `INV-BOOT-01` | Candidate freeze, selection freeze, and setup packet | The manifest-authoring procedure, initial lockfile/bootstrap command, permitted tracked mutations, generated paths, lifecycle and network side effects, safe clean-state preparation, frozen restore, resolved-version inspection, and cleanup checks are all explicit. A slot is `N/A` only with authority-backed rationale; the worker invents none of them. | Every named slot is frozen in Concrete Steps; accepted command and S2 inspection evidence confirms setup effects. | Primary; trigger-required contract reviewer when applicable; setup reviewer. |
| `INV-REP-01` | Candidate selection and final manifest | One package manager, one lockfile, exact direct material versions, frozen restore, and resolved-version inspection agree. | `RD002-RESTORE-001`, `RD002-RESOLUTION-002`, unchanged hashes, and S2 review pass. | Setup reviewer. |
| `INV-CMD-01` | Strict type-check command | The pinned compiler runs independently in strict mode and exits successfully on the selected baseline. | `RD002-TYPECHECK-002` passes independently. | Setup reviewer. |
| `INV-CMD-02` | Disposable focused harness probe | The same focused command reports the intended nonzero failure, then zero pass after only the intended probe correction; the probe is removed. | `RD002-FOCUSED-RED-001`, `RD002-FOCUSED-GREEN-001`, and probe removal pass. | Setup reviewer. |
| `INV-SCP-01` | Dependency and diff review | Every package and config file is necessary now; every listed non-goal remains absent; no application behavior is smuggled into setup. | `RD002-SCOPE-AUDIT-001` and S2 actual-tree/lock inspection pass. | Setup and integrated reviewers. |
| `INV-OWN-01` | Worker write turn | Guard-observable packet paths, guard projection, terminal receipt, actual diff, and worker role agree; exact ignored/external side effects are separately named and inspected because they are outside guard proof; no active lease remains. | Fresh compliant receipt, immediate no-drift acceptance, actual diff, command/side-effect inspection, and S2 packet review pass; no active lease. | Primary; setup reviewer. |
| `INV-DOC-01` | Closure candidate | Roadmap, plan/progress indexes, current-status statements, development instructions, and selected-tool evidence agree; affected links and `git diff --check` pass. | S2 and integrated reviews pass; cleanup and archival validation pass (547 relative targets, 111 anchors). Final reconciliation readback is `PASS`; all follow-ups are closed. | Integrated reviewer. |

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

Resumed execution baseline `TREE-BASELINE-002` supersedes only that expected current worktree state: on 2026-08-29, the branch was clean at `c2d9189468ae034fadb3afcf29875a9f3daf6f99`, the nine documentation paths were already present, and `rg --files` still showed no application/package baseline. The six reported host versions match the earlier observations. The current session exposes the required role types with their pinned role settings and a workspace-write primary boundary; the primary's actual model/effort is not independently exposed by the available tools, so the configured practice is not presented as observed runtime proof. `RD002-GUARD-PREFLIGHT-001` is the subsequently captured self-test invocation: exit 0, `self-test-passed`, 27 checks, all passed. The earlier invocation whose terminal output was not retained is not acceptance evidence. Windows x64 identity is recorded under Surprises & Discoveries.

Research uses the current official primary sources named by the frozen Decision Review Contract. Record exact URLs, relevant version/support facts, retrieval date, and uncertainty in stable evidence IDs; do not use a package install as a substitute for upstream lifecycle or compatibility evidence.

The following contract is frozen by `RD002-SYNTH-003` and its untriggered R2 checkpoint. The worker copies it verbatim; no shell preference may replace a command, version, path, or side-effect policy. Working directory for every command is `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`. Ordinary nonzero exits stop the assignment; only the designated failing probe expects exit 1.

#### PROC-MANIFEST-01 and exact executable configuration

Use `apply_patch` to create only `package.json` with the following content. Bootstrap may create `package-lock.json` but must not change this manifest. No `npm init` or `npm add/install <package>` invocation is permitted.

~~~json
{
  "name": "a11y-evidence-lab",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "license": "MIT",
  "engines": {
    "node": "24.20.0",
    "npm": "11.19.0"
  },
  "packageManager": "npm@11.19.0",
  "scripts": {
    "typecheck": "tsc --project tsconfig.json",
    "test:focused": "node --test",
    "build": "vite build",
    "start": "node src/server/main.ts"
  },
  "dependencies": {
    "@axe-core/playwright": "4.13.0",
    "playwright": "1.62.1",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "24.13.3",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.5",
    "typescript": "7.0.2",
    "vite": "8.0.16"
  }
}
~~~

Use `apply_patch` to create `tsconfig.json` exactly as follows. It checks the real build configuration now; future source patterns establish no source or behavior. It does not promise separate client/server type sandboxes.

~~~json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx",
    "types": [
      "node",
      "react",
      "react-dom"
    ]
  },
  "include": [
    "vite.config.ts",
    "src/client/**/*.ts",
    "src/client/**/*.tsx",
    "src/server/**/*.ts",
    "tests/**/*.ts"
  ]
}
~~~

Use `apply_patch` to create `vite.config.ts` exactly as follows. The non-default output is required so the later service serves only the client bundle, not dependency/runtime material. No `index.html`, client entry, or service entry is created now.

~~~ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
});
~~~

The `build` and `start` script literals are deliberately future boundaries. They cannot succeed before the owning M1 tasks create `index.html` / client source and `src/server/main.ts`; do not execute or claim those product behaviors in RD-002.

#### Shared command prelude

Run this exact prelude in each fresh PowerShell command cell that invokes the selected toolchain. It changes only that shell process's PATH and uses the bundled CLI by absolute path; it does not alter global Node, npm, NVM, user configuration, or persistent environment variables.

~~~powershell
$rd002NodeDirectory = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-node-runtime\node-v24.20.0-win-x64'
$rd002Node = Join-Path $rd002NodeDirectory 'node.exe'
$rd002Npm = Join-Path $rd002NodeDirectory 'node_modules\npm\bin\npm-cli.js'
$env:Path = $rd002NodeDirectory + ';' + $env:Path
$rd002NpmFlags = @('--global=false', '--prefix', 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab', '--cache', 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-npm-cache', '--ignore-scripts=true', '--audit=false', '--fund=false', '--update-notifier=false', '--logs-max=0', '--registry=https://registry.npmjs.org/', '--strict-ssl=true', '--package-lock=true', '--include=dev', '--include=optional')
if ((& $rd002Node --version) -ne 'v24.20.0') { throw 'Unexpected Node version.' }
if ((& $rd002Node $rd002Npm @rd002NpmFlags --version) -ne '11.19.0') { throw 'Unexpected npm version.' }
~~~

#### CMD-BOOTSTRAP-01

Preconditions: prepared exact manifest/config files; no `package-lock.json` or `node_modules`; the three task-specific temporary targets below are absent (confirmed before this freeze). The worker first obtains the official portable runtime:

~~~powershell
$rd002Archive = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-node-v24.20.0-win-x64.zip'
$rd002RuntimeRoot = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-node-runtime'
if ((Test-Path -LiteralPath $rd002Archive) -or (Test-Path -LiteralPath $rd002RuntimeRoot)) { throw 'Runtime bootstrap target already exists.' }
New-Item -ItemType Directory -Path 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp' -Force | Out-Null
Invoke-WebRequest -UseBasicParsing -Uri 'https://nodejs.org/dist/v24.20.0/node-v24.20.0-win-x64.zip' -OutFile $rd002Archive -ErrorAction Stop
if ((Get-FileHash -LiteralPath $rd002Archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne '6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba') { throw 'Node archive checksum mismatch.' }
Expand-Archive -LiteralPath $rd002Archive -DestinationPath $rd002RuntimeRoot -ErrorAction Stop
~~~

Then run the shared prelude and:

~~~powershell
& $rd002Node $rd002Npm @rd002NpmFlags install
if ($LASTEXITCODE -ne 0) { throw 'Bootstrap failed.' }
~~~

Expected exit 0. Permitted non-ignored mutation: only `package-lock.json`. The authoring procedure, not npm, owns the manifest/configs. HTTPS retrieval of the official runtime and public registry packages is permitted. All dependency lifecycle hooks, audit submission, and update notification are suppressed; optional prebuilt platform packages are retained. No browser download, native compilation, global package install, alternative manager, or fallback script enablement is permitted. A blocked network request may be repeated only through the normal approval mechanism with the identical command; an actual partial-bootstrap failure follows the existing lease/correction recovery rule.

#### PATH-GENERATED-01

| Exact path (relative to the working directory) | Effect and disposition |
| --- | --- |
| `node_modules/`, including `.bin/` and `.package-lock.json` | npm dependency tree; primary adds `/node_modules/` to ignores before the lease. Clean/recreate once for frozen restoration; retain the final verified tree untracked. Native platform packages are descendants, not direct dependencies. |
| `temp/rd002-node-v24.20.0-win-x64.zip` | Official runtime download, verified before extraction; remove after integrated verification. |
| `temp/rd002-node-runtime/`, containing `node-v24.20.0-win-x64/` | Temporary runtime/npm extraction; retain through reviews, then remove. Existing `temp/` ignore covers it. |
| `temp/rd002-npm-cache/` | Only permitted npm cache root for every selected npm command, including log/cache bookkeeping; no log files requested. Remove after integrated verification. |
| `dist/client/` | Frozen future build output; primary adds only `/dist/client/` to ignores. Must remain absent during RD-002. |
| `node_modules/.vite/` and `node_modules/.vite-temp/` | Vite-generated caches/config material, if module loading creates any; inside the ignored dependency tree. No dev server or client build runs now. |
| `tests/toolchain/rd-002-harness-probe.test.ts` | Non-ignored, guard-allowed disposable source; create/fail/correct/pass/remove in the same setup lease. Empty ancestor directories may be removed only by the empty-directory check below. |
| Browser downloads, OS temporary build directories, external npm caches, emitted JS, test output files | Not permitted or expected: no browser installation, dependency scripts, compiler emission, or file reporter. Unexpected effects stop the assignment. |

Ignored outputs are outside guard proof. The primary separately inspects them and the frozen cleanup results. No existing user cache or unrelated temporary path is removed.

#### CMD-CLEAN-01

After compliant setup closure, the primary records manifest/lock/config hashes, then establishes the clean dependency state using only:

~~~powershell
$rd002DependencyPath = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\node_modules'
if (Test-Path -LiteralPath $rd002DependencyPath) {
  $rd002DependencyItem = Get-Item -LiteralPath $rd002DependencyPath -Force
  if (($rd002DependencyItem.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Dependency root must not be a reparse point.' }
  if ((Resolve-Path -LiteralPath $rd002DependencyPath).Path -ne 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\node_modules') { throw 'Unexpected clean target.' }
  Remove-Item -LiteralPath 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\node_modules' -Recurse -Force -ErrorAction Stop
}
if (Test-Path -LiteralPath $rd002DependencyPath) { throw 'Clean dependency state was not reached.' }
~~~

Expected success and `node_modules` absent; no manifest/lock/config/documentation mutation.

#### CMD-RESTORE-01

Run the shared prelude and:

~~~powershell
& $rd002Node $rd002Npm @rd002NpmFlags ci
if ($LASTEXITCODE -ne 0) { throw 'Frozen restore failed.' }
~~~

Expected exit 0, dependency tree restored, and all four manifest/lock/config hashes unchanged. No bootstrap/update command is substituted.

#### CMD-RESOLVE-01

Run the shared prelude and the following read-only inspection. It verifies actual direct versions, package relationships, required native modules, and the package-supplied browser catalog without launching a browser or creating product source.

~~~powershell
& $rd002Node $rd002Npm @rd002NpmFlags ls --depth=0
if ($LASTEXITCODE -ne 0) { throw 'Direct resolution check failed.' }
& $rd002Node $rd002Npm @rd002NpmFlags ls --all playwright playwright-core '@axe-core/playwright' axe-core rolldown '@rolldown/binding-win32-x64-msvc' '@typescript/typescript-win32-x64' lightningcss lightningcss-win32-x64-msvc
if ($LASTEXITCODE -ne 0) { throw 'Relationship resolution check failed.' }
$rd002Inspection = @'
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const manifest = readJson("package.json");
const lock = readJson("package-lock.json");
for (const [name, expected] of Object.entries({ ...manifest.dependencies, ...manifest.devDependencies })) {
  assert.equal(readJson("node_modules/" + name + "/package.json").version, expected);
  assert.equal(lock.packages["node_modules/" + name].version, expected);
}
assert.equal(readJson("node_modules/playwright-core/package.json").version, "1.62.1");
assert.equal(readJson("node_modules/axe-core/package.json").version, "4.13.0");
assert.equal(readJson("node_modules/rolldown/package.json").version, "1.0.3");
assert.equal(readJson("node_modules/@rolldown/binding-win32-x64-msvc/package.json").version, "1.0.3");
assert.equal(readJson("node_modules/@typescript/typescript-win32-x64/package.json").version, "7.0.2");
require("@rolldown/binding-win32-x64-msvc");
require("lightningcss-win32-x64-msvc");
await import("vite");
await import("playwright");
await import("@axe-core/playwright");
const browsers = readJson("node_modules/playwright-core/browsers.json").browsers
  .filter((entry) => ["chromium", "chromium-headless-shell"].includes(entry.name));
assert.equal(browsers.length, 2);
assert.ok(browsers.every((entry) => entry.revision === "1234" && entry.browserVersion === "151.0.7922.34"));
console.log(JSON.stringify({ directVersions: "matched", nativeBindings: "loaded", browsers }, null, 2));
'@
& $rd002Node --input-type=module -e $rd002Inspection
if ($LASTEXITCODE -ne 0) { throw 'Package/native metadata inspection failed.' }
~~~

Expected exit 0. Importing the installed native modules is the operational proof for the frozen script-suppressed policy, not permission to change that policy if loading fails. This command writes no project source or output file.

#### CMD-TYPECHECK-01

Run the shared prelude and:

~~~powershell
& $rd002Node $rd002Npm @rd002NpmFlags run typecheck
if ($LASTEXITCODE -ne 0) { throw 'Independent strict typecheck failed.' }
~~~

Expected exit 0 from the pinned `tsc`, not from Vite/Node transpilation or tests. No compiler output is emitted.

#### CMD-FOCUSED-01

The worker uses `apply_patch` to create only this exact probe at `tests/toolchain/rd-002-harness-probe.test.ts`:

~~~ts
import assert from "node:assert/strict";
import test from "node:test";

const expectedValue: number = 1;

test("RD-002 harness reports an assertion failure", () => {
  assert.equal(expectedValue, 2);
});
~~~

Run the shared prelude and this identical command for both results:

~~~powershell
& $rd002Node $rd002Npm @rd002NpmFlags run test:focused -- tests/toolchain/rd-002-harness-probe.test.ts
~~~

First expected exit: 1, specifically the `expectedValue` versus `2` assertion. The sole correction is `assert.equal(expectedValue, 1);`. Second expected exit: 0, exactly one passing test. Preserve both decisive command outputs and codes. Then remove that exact probe with `apply_patch`. The primary never authors or repairs this probe.

#### CMD-CLEANUP-01

Worker cleanup after `apply_patch` probe removal, and primary readback after lease closure:

~~~powershell
if (Test-Path -LiteralPath 'tests/toolchain/rd-002-harness-probe.test.ts') { throw 'Disposable probe remains.' }
foreach ($rd002EmptyDirectory in @('tests/toolchain', 'tests')) {
  if ((Test-Path -LiteralPath $rd002EmptyDirectory -PathType Container) -and @(Get-ChildItem -LiteralPath $rd002EmptyDirectory -Force).Count -eq 0) {
    Remove-Item -LiteralPath $rd002EmptyDirectory -ErrorAction Stop
  }
}
foreach ($rd002UnexpectedPath in @('pnpm-lock.yaml', 'yarn.lock', 'npm-shrinkwrap.json', 'dist/client')) {
  if (Test-Path -LiteralPath $rd002UnexpectedPath) { throw ('Unexpected setup output: ' + $rd002UnexpectedPath) }
}
git status --short
git diff --check
~~~

Expected success, no probe, alternate lockfile, or build output, and only the known task paths. Final temporary-runtime/cache cleanup is primary-owned after the integrated review has consumed the selected environment:

~~~powershell
foreach ($rd002TemporaryPath in @('C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-node-v24.20.0-win-x64.zip', 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-node-runtime', 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd002-npm-cache')) {
  if (Test-Path -LiteralPath $rd002TemporaryPath) {
    $rd002TemporaryItem = Get-Item -LiteralPath $rd002TemporaryPath -Force
    if (($rd002TemporaryItem.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Temporary cleanup target must not be a reparse point.' }
    if ((Resolve-Path -LiteralPath $rd002TemporaryPath).Path -ne $rd002TemporaryPath -or -not $rd002TemporaryPath.StartsWith('C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Unexpected temporary cleanup target.' }
    Remove-Item -LiteralPath $rd002TemporaryPath -Recurse -Force -ErrorAction Stop
  }
}
node --version
npm.cmd --version
git status --short
git diff --check
~~~

Expected success; only those three generated task-specific temporary targets are removed. The final global version observations must still be Node `24.18.0` and npm `11.16.0`. Developers must provision the documented `24.20.0` / `11.19.0` prerequisites themselves before using the retained baseline; no global update is implied.

The earlier slot definitions remain below as the contract checklist; the named sections above now supply each binding value.

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

### Accepted setup and independent command evidence

`RD002-SETUP-LEASE-001` used contract digest `351a6e6a23dc9dd26aa9f8009c679d8ced122df7bbddc31e71b03b2812bf3ba0`. After the worker stopped, primary closure returned fresh `closed-compliant` (exit 0), receipt digest `655df8be39bd38e188f83151f8690243bd0714f8bf51949b06b76eaaa482b398`. Immediate `status` returned exit 0 and `post_close_drift: false`. The only net worker changes were creation of `package.json`, `package-lock.json`, `tsconfig.json`, and `vite.config.ts`; no forbidden/unleased/index/HEAD/ignore-control change occurred. Primary inspected all three authored files and the parsed complete lockfile, not just the report/receipt. Subsequent primary documentation maintenance is outside this completed lease and does not authorize implementation drift.

| Evidence | Exact contract command and accepted result |
| --- | --- |
| `RD002-BOOTSTRAP-001` | Worker `CMD-BOOTSTRAP-01`: official archive hash matched; extraction and script-suppressed install exited 0, adding 29 packages. No global runtime change or browser command. |
| `RD002-RESOLUTION-001` / `RD002-TYPECHECK-001` | Worker exact resolution/native catalog inspection and independent `tsc` both exited 0. |
| `RD002-FOCUSED-RED-001` | Exact focused command exited 1 with `AssertionError`, `1 !== 2`, one test, zero passes, one failure. |
| `RD002-FOCUSED-GREEN-001` | The identical command after only the frozen assertion correction exited 0: one test, one pass, zero failures/skips. The typed constant exercises native TypeScript stripping. This is harness proof, not product Red/Green. |
| `RD002-CLEANUP-001` | Worker removed the probe with `apply_patch`; primary confirmed no probe/test files, alternate lockfile, client build output, or application source. |
| `RD002-CLEAN-PREP-001` | Primary independently rechecked the archive SHA-256, then exact `CMD-CLEAN-01` removed only the validated ordinary dependency directory; exit 0. |
| `RD002-RESTORE-001` | Primary exact `CMD-RESTORE-01` exited 0, restoring 29 packages; all four retained hashes below are unchanged. |
| `RD002-RESOLUTION-002` | Primary exact `CMD-RESOLVE-01` exited 0. Nine direct pins match installed files and lock; required native bindings load; Playwright/core, axe, and Chromium catalog match the frozen values. Lightning CSS and its Windows binding resolve to `1.33.0` through the permitted transitive range and are pinned by the lock, not promoted to direct dependencies. |
| `RD002-TYPECHECK-002` | Primary exact independent compiler command exited 0: `tsc --project tsconfig.json`; no build, test runner, or transpilation substituted for checking. |
| `RD002-SCOPE-AUDIT-001` | Parsed lock version 3 with 81 entries; all resolved URLs use the public npm registry. No unselected framework/runner/provider/schema families; no tracked or non-ignored generated output. The only `hasInstallScript` entries are optional macOS fsevents packages, absent on this Windows tree; scripts were suppressed regardless. `git diff --check` passes. |

Reusable local evidence identity: Windows 11 `10.0.26200`, x64, official temporary Node `24.20.0` / npm `11.19.0`, the pinned archive SHA-256, and these unchanged file hashes. Initial network bootstrap is non-reusable. The removed probe's historical tool-output evidence is retained concisely above; reproducing it requires a fresh authorized lease, not a primary source edit.

| Retained file | SHA-256 after setup and independent restore |
| --- | --- |
| `package.json` | `B95D2071DB55E574840643E5AC0C7EFDBC7B4C313DDA62DBAC97282147C024AF` |
| `package-lock.json` | `04D34B2A97E8958636E5F78F6E15BA996D152F5E49A429B4DD5B9EE5D567EB91` |
| `tsconfig.json` | `C128AB23EBC300EE5AA6444F1A4A2A79661CB81D60425F9BB2D1943655320CC1` |
| `vite.config.ts` | `DC5A4DE4B0A9C65EC19F27FBBB25FCA727184BD16F2CC5A4E725293E68306BC8` |

All observed generated changes are inside the frozen dependency/runtime/cache paths. The unrelated pre-existing temporary material is untouched. After both reviewers consumed the verification environment, the frozen final cleanup removed the task-specific runtime ZIP/extraction/cache, with exit 0; global Node 24.18.0/npm 11.16.0 and all four retained hashes remained unchanged. The ignored dependency tree remains available; temporary distribution/cache artifacts can be reacquired through the recorded commands. No setup correction or Refactor was needed.

### Closure candidate and verification mapping

`RD002-SLICE-REVIEW-001` is a fresh S2 implementation-only review by `independent_reviewer` (configured Sol/high): `PASS`, no findings. The reviewer inspected the original `RD002-SETUP-PACKET-001` message, not an inferred packet. Its retained conversation reference is the first assignment to `rd002_setup_worker`, beginning “Milestone Assignment Packet v2”; the worker supplied that original text read-only, with no new lease or implementation write. The reviewer accepted criteria 1–12 and reused fresh command evidence while independently checking the four fingerprints, all nine pins, all 81 lock entries, archive/runtime identity, exact config/README diff, and negative scope. No implementation correction, test exception, or Refactor occurred.

The roadmap's RD-002 Verification is reproduced verbatim:

> Every selected tool is needed by M1 and its material versions are pinned; the strict TypeScript compiler check executes successfully on its own rather than being inferred from transpilation, a build, a test runner, or editor diagnostics; one focused test command executes independently and can demonstrate a genuine failing and passing behavior slice without requiring the complete future suite; and no installer, desktop wrapper, database, hosted service, generalized testing platform, or speculative framework enters scope.

| Verification clause | Actual evidence and disposition |
| --- | --- |
| Every tool is needed by M1; material versions pinned | Frozen rationale plus manifest/lock resolution; all nine direct pins match; no duplicate manager, lock, runner, or unnecessary host/UI platform. Standard-library host/test functions avoid added packages. |
| Independent strict compiler succeeds | `RD002-TYPECHECK-002` exits 0 through only the dedicated `typecheck` command; real Vite configuration is its current source input. |
| Focused genuine failure/pass without a future suite | `RD002-FOCUSED-RED-001` and `RD002-FOCUSED-GREEN-001` use the identical single-file command and the one intended assertion correction. The probe is removed. This is harness evidence, not an implemented product slice. |
| Excluded platform remains absent | `RD002-SCOPE-AUDIT-001` and fresh S2 complete-lock/actual-tree inspection pass. No source, product tests, fixtures, browser download/launch, service, provider, installer, or release behavior enters. |

`RD002-CLOSURE-001` candidate validation (2026-08-30): independent PowerShell checks resolve 542 relative targets across 14 affected/navigation documents and 106 Markdown anchor references; manifest/lock identity, strict compiler flags, retained-file whitespace/final newlines, unchanged four hashes, and `git diff --check` pass. A first link-check expression mistakenly counted a CRLF-fenced template example; correcting the read-only check's fence handling produced the passing result without changing that template. `RD002-GUARD-CLOSURE-001`: `python -B .codex\leases\lease_guard.py self-test` exits 0 with all 27 checks passing. No validator subsystem was added.

Documentation-impact reconciliation covers root developer instructions; roadmap and requirements/delivery current status; context/concept stale non-selection statements; candidate architecture and feasibility current-literal references; the scan assessment's explicitly historical seed table; and this plan and progress record/index. Existing ADRs, requirement rows, product contracts, specifications, architecture index, and working instructions need no semantic change: this is ordinary toolchain setup, not an architecture or product decision. The scan assessment's old seeds remain historical rather than silently rewritten. Plan/navigation archival changes are the pending closure transaction below.

Reviewed closure protocol (preserved as the pre-transaction contract): a different fresh `independent_reviewer` reviews the complete candidate and this mapping. After a passing verdict with any follow-ups dispositioned, run only the frozen final cleanup of the task-specific ZIP, extracted runtime, and npm cache; verify the unchanged four hashes and global Node 24.18.0/npm 11.16.0. Once Verification and the documentation gate pass, set only RD-002 to Complete; record RD-003 as dependency-ready but Not started and requiring separate owner selection. Move this same plan to `docs/plans/completed/`, repair its relative links and all incoming links, update current status and plan/progress indexes, then rerun link/anchor/config/whitespace and negative-state checks. Any unexpected drift or substantive finding stops closure; no final status or archive move is permission for RD-003 or M1 work. The final reviewer must inspect the completed reconciliation/readback before handoff.

Closure transaction result (2026-08-30): fresh `RD002-INTEGRATED-REVIEW-001` returned `PASS WITH FOLLOW-UPS`, with no Blocker, Major, or Minor findings; its only follow-up was the transaction described above and one reconciliation readback. The primary accepted its full candidate review, ran the exact final cleanup (exit 0), confirmed absence of all three temporary targets and all excluded product paths, unchanged four hashes, unchanged global Node/npm, unchanged HEAD/branch, and an empty index. Post-cleanup documentation validation again passed 543 relative targets, 107 anchors, strict-config/manifest/whitespace checks, and `git diff --check`. On that evidence the primary accepted the documentation gate and marked only RD-002 Complete, then archived this same plan and synchronized navigation/status summaries. Final archival validation and the passing confirmatory reviewer readback are recorded below; no new implementation or decision is authorized.

`RD002-CLOSURE-002` final archival validation: 547 relative targets across 14 documents and 111 Markdown anchors resolve; the old active plan and all incoming links to it are absent, the completed plan exists, the four hashes and global versions are unchanged, JSON/strict-config/whitespace and `git diff --check` pass, the Git index is empty, and RD-003 remains Not started. Only the ignored dependency tree is retained as generated setup output. Final Git status contains the expected RD-002 documentation/ignore changes, the active-plan deletion plus completed-plan addition (an unstaged move), and the four new toolchain files; no other non-ignored path, staged change, commit, or push was introduced.

Final `RD002-INTEGRATED-REVIEW-001` reconciliation readback: `PASS`, no Blocker/Major/Minor findings. The reviewer independently confirmed the four hashes, removed temporary targets and active plan, completed plan identity, unchanged global versions, all 547 relative links, original HEAD/branch, empty index, negative product scope, and `git diff --check`; it reused the fresh 111-anchor/configuration and unchanged implementation evidence. The sole declared follow-up is closed. Primary result-only bookkeeping changes this verdict/Progress record and the progress summary only; no substantive correction or implementation write remains.

### Setup dispatch history and acceptance checklist

Setup dispatch checkpoint (2026-08-30): `RD002-GUARD-PREFLIGHT-002` reran the isolated guard suite after the primary-owned ignore update: exit 0, all 27 checks passed. `git check-ignore -v` confirms the exact dependency, client-output, and temporary paths are ignored; checking the five proposed guard-allowed files returns exit 1 with no matches, as required. `git diff --check` passes. No active lease exists before dispatch.

The single setup identity is workflow `RD002-20260830`, work slice `RD002-SETUP-01`, assignment `RD002-SETUP-PACKET-001`, lease `RD002-SETUP-LEASE-001`, phase `setup`, attempt `1`, owner `rd002_setup_worker`, role `code_worker`. Its allowed files are exactly `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, and `tests/toolchain/rd-002-harness-probe.test.ts`; it has no allowed directory root. Every other non-ignored path is outside scope. Explicit forbidden files are `README.md`, `AGENTS.md`, `PLANS.md`, `LICENSE`, and `.gitignore`; explicit forbidden roots are `docs`, `.codex`, `.agents`, `src`, `fixtures`, `data`, `corpus`, `models`, and `.openai`. All Git writes remain prohibited. The command contract above separately constrains ignored side effects. The primary will insert the fresh guard digest into the dispatched packet and record the terminal evidence here only after worker writes stop and the lease closes.

Guard-input reconciliation: the first start request used a slash-containing canonical agent path as the owner and was rejected by input validation before creating a lease. Inspection confirmed only the pre-existing `gitmeta-1` runtime directory. The owner token above now uses the guard's documented character set; the agent mapping, scope, phase, attempt, and semantic contract are unchanged. No worker was dispatched under the rejected request.

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

RD-002 establishes these development contracts; the exact values were frozen after the R2 barrier and verified above:

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
- 2026-08-29: Resumed from the clean `TREE-BASELINE-002`, preserved the existing activation documents, and accepted `RD002-DISC-001`. Froze the bounded candidate/evidence set and two-report R2 split without selecting any literal, exact version, command, or dependency. The existing hard gates, cumulative invariants, selection barrier, and setup limits are unchanged.
- 2026-08-30: Recorded the single research barrier and `RD002-SYNTH-001: RETURN FOR RESEARCH`, issued the one targeted follow-up round, and retained the fresh 27-check guard preflight. Unverified empty-compiler and install-side-effect suggestions remain explicitly unresolved; no setup or selection was authorized.
- 2026-08-30: Reconciled the follow-up reports and recorded `RD002-SYNTH-002: OWNER DIRECTION`. Withdrew the invalid empty-program suggestion, rejected unsupported lifecycle/security inferences, and named the remaining build/install evidence gaps. The research budget is exhausted; the task stays In progress, the plan stays active, and no selection or setup is claimed. Documentation impact is limited to this plan and its existing progress record/index because requirements, ADRs, developer commands, and canonical task status have not changed.
- 2026-08-30: Recorded explicit owner authorization for one additional bounded research round on the existing named gaps. Reused the same candidate set and researcher instances; no setup, review, or scope allowance was reset.
- 2026-08-30: Accepted `RD002-SYNTH-003: DRAFT READY`, completed the untriggered R2 checkpoint audit, and froze the exact package/configuration, official temporary-runtime acquisition, script-suppressed bootstrap/restore, validation, and cleanup contract. Implementation proof remains pending and no application behavior was added.
- 2026-08-30: Accepted the compliant setup lease and independently verified exact clean restore, native resolution, strict checking, removal, and dependency scope against unchanged retained-file hashes. Recorded the worker's decisive focused failure/pass evidence. Primary developer-documentation reconciliation and fresh S2/integrated reviews follow; RD-002 remains In progress.
- 2026-08-30: Accepted fresh S2 review with no findings, refreshed the cumulative setup evidence, reconciled current developer/authority summaries while preserving historical assessment seeds, and recorded verbatim roadmap Verification with passing proportional validation. Final integrated review and the explicit cleanup/status/archive transaction remain pending.
- 2026-08-30: Accepted fresh integrated review with no substantive findings and completed its declared cleanup/status/archive transaction after revalidation. RD-002 is Complete, RD-003 is Ready but Not started, global runtime versions and implementation hashes are unchanged, and the same plan is archived. Final link/state validation and the permitted confirmatory readback close the handoff record.
- 2026-08-30: Accepted the final `RD002-INTEGRATED-REVIEW-001` reconciliation readback with verdict `PASS`, no findings, and no remaining follow-up. Closed the final Progress item and result-only documentation entries; implementation, authority semantics, and scope are unchanged.
