# Present accessible target entry and complete results (M1-04)

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-04 — Present accessible target entry and complete results](../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results). The owner selected repository review and plan creation, not implementation. The roadmap records `In progress` for planning; no UI, browser acquisition, worker write, or M1-05 integration is authorized by this document. Obtain an explicit instruction to execute M1-04 before entering the future literal and implementation sequence.

## Progress

- [x] (2026-08-31 16:20Z) Reviewed the current repository, M1-04's routed authorities, dependency readiness, agent workflow, and frontend-quality overlay. Recorded `M104-BASELINE-001` below.
- [x] (2026-08-31 16:20Z) Primary planning synthesis: `DRAFT READY` for this plan's structure and boundaries only. No decision-critical client mechanics or future commands are selected; the pending `M104-LITERALS-001` barrier remains explicit.
- [x] (2026-08-31 16:26Z) Fresh R2 final planning review returned `PASS` with no findings; primary documentation/preservation validation passed and the planning checkpoint/progress summary were accepted. See `M104-PLAN-001` below.
- [ ] Obtain owner authorization to execute this exact task; recheck the tree, permissions, dependencies, runtime, and no active lease.
- [ ] Freeze `M104-LITERALS-001` through its R3 research, synthesis, and separate pre-draft/final checkpoints; accept the reuse and UI evidence capsules.
- [ ] If needed, complete bounded managed-browser/readiness setup under a guarded non-TDD assignment and accept its evidence.
- [ ] Complete `M104-UI-01` through read-only preflight, independent test ownership, minimum frontend Green, real-browser evidence, and S3 review.
- [ ] Complete different fresh integrated review, exact owned-artifact cleanup, all task verification and documentation closure; only then mark M1-04 Complete and archive this plan.

## Surprises & Discoveries

- The checkout advanced to `ae67ea619a0c32a0a383b3b39fcfe89406ab6986`, with M1-03 merged and Complete. Its accepted source content is unchanged: LF-normalized scanner and test hashes match its archived closure. Do not mistake checkout CRLF conversion for source drift, or normalized source hashes for the byte-exact RD-003 fixture contract.
- React, React DOM, Vite, a strict TSX configuration, and a client build command already exist. There is no `src/client/`, root `index.html`, rendered UI, or built `dist/client/`. New UI dependencies or a new build system have no demonstrated need.
- M1-02 exposes only health and run reads over HTTP. Health declares `readRuns: true, scan: false`; no static-file or Analyze route exists. M1-03 adds an internal scanner callback, not the M1-05 join. A production mock cannot fill that gap.
- M1-03 removed its task-local Chromium and both scratch roots after review. The default Playwright executable is also absent. Its accepted 290-test result is historical evidence; only the 202 nonbrowser tests and strict typecheck were freshly repeated for this planning request.
- Existing browser tests and production scanning require exclusive `temp/m103-scan`, including process-start TEMP/TMP and emptiness checks. New UI browser checks must use a separate owned scratch root and run in a separate sequential suite partition.
- The lease guard rejects both an empty allow-scope and ignored allowed roots. An ignored browser cache alone cannot be a valid setup lease. Freeze a narrowly scoped, nonignored task-owned acquisition root if acquisition is required, with ignored scratch effects declared separately; do not change the guard or ignore rules.

## Decision Log

- Decision: Activate only M1-04 for planning, preserving the roadmap graph and all completed evidence.
  Rationale: The exact task was selected; its sole dependency M1-01 is Complete. Planning authorization does not authorize application execution or selecting M1-05.
  Date/Author: 2026-08-31 / primary coordinator.
- Decision: Plan one coherent rendered-UI work slice and only conditional non-behavioral prerequisite setup.
  Rationale: Target entry, run status, complete results, detail selection, and reopen are one projection of the same M1 contract. Per-control slices, a new state subsystem, and a design system would add coordination without a separate outcome.
  Date/Author: 2026-08-31 / primary coordinator.
- Decision: Reuse the pinned toolchain, pure domain validators, existing synthetic test helper where applicable, and Evidence Light guidance. Keep privileged source and canonical schemas unchanged.
  Rationale: These already provide the required platform and evidence vocabulary. Client-only selection and transient busy/error presentation must not become durable Finding states.
  Date/Author: 2026-08-31 / primary coordinator.
- Decision: Keep future exact client-admission and operation-ownership mechanics at an explicit R3 literal barrier, and risk-route the implemented UI S3.
  Rationale: Rendering untrusted values, accepting a reopened run's identity, and preventing stale or overlapping async results from replacing current evidence are named security, identity, and concurrency triggers. This is not an instruction to add a custom engine; the minimum direct implementation remains the criterion.
  Date/Author: 2026-08-31 / primary coordinator.
- Decision: Require one fresh final independent planning review, not an unconditional extra R2 pre-draft review.
  Rationale: This owner-facing plan does not select those critical mechanics. Primary `DRAFT READY` is its untriggered R2 contract checkpoint. The future R3 literal decision has its own mandatory checkpoints.
  Date/Author: 2026-08-31 / primary coordinator.


- Decision: Accept the planning checkpoint after independent review and primary verification; retain every execution gate.
  Rationale: `M104-PLAN-REVIEW-001` returned `PASS` with no findings. Documentation/status checks and preservation evidence support the plan handoff, not UI implementation or closure of the roadmap task.
  Date/Author: 2026-08-31 / primary coordinator.

## Outcomes & Retrospective

Planning is complete after fresh independent review returned `PASS` with no findings and primary documentation/preservation validation passed. Current evidence establishes a stable backend/domain baseline and an absent client, not M1-04 behavior. The smallest intended outcome is an accessible React projection that can be integrated at M1-05 without changing the stored run contract. No production source, tests, dependency, configuration, fixture, browser runtime, or service behavior changed. M1-04 remains In progress for planning only; exact-task execution authorization is the next boundary.

The main planning constraints are an honest pre-integration entry, complete untruncated evidence presentation, safe transient UI ownership, and reproducible browser proof. Exact mechanics and proof commands remain unresolved rather than being delegated for a worker to invent. Keep later checkpoint entries concise and outcome-based.

## Purpose / Big Picture

A developer should be able to choose a trusted public HTTPS target and an explicit Local or Groq mode, understand the disclosure, invoke one Analyze intent, distinguish loading/failure/complete results, inspect every Finding and native incomplete observation, and select or reopen evidence using a keyboard. The screen must expose scope and uncertainty instead of implying an accessibility or compliance verdict.

M1-04 supplies that UI and its browser-verifiable behavior over the accepted M1 interfaces. It does not supply the real scan-to-disk-to-HTTP join: M1-05 connects service, scanner, persistence, and UI and proves the trusted public-page smoke path. Component-level synthetic inputs must exercise the actual production React components; they are not real scanner output, a production demo mode, or proof of durable end-to-end integration.

## Context and Orientation

### Authority and entry checks

Start with [AGENTS.md](../../AGENTS.md), the [documentation router](../README.md), [PLANS.md](../../PLANS.md), the [agent workflow](../../.codex/README.md), [worker-first implementation guide](../../.codex/execplan-implementation-workflow.md), [lease guard](../../.codex/write-lease-guard.md), and [frontend-quality skill](../../.agents/skills/frontend-quality/SKILL.md). Read target documents completely before editing them; load only directly applicable authorities for implementation.

| Boundary | Controlling authority and task interpretation |
| --- | --- |
| Task authorization and dependency | [Roadmap M1-04](../DEVELOPMENT_ROADMAP.md#m1-04--present-accessible-target-entry-and-complete-results), [requirements index](../PROJECT_REQUIREMENTS.md), and OD-025 in [delivery readiness](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md). M1-01 is the sole declared dependency and is Complete. M1-02/M1-03 are available completed context, not new dependencies. M1-05 stays unselected. |
| Accepted representation | [M1-01 literal block](completed/m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1), [domain source](../../src/server/domain/run-contract.ts), and [workflow lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md). Reuse the implemented closed schema; do not introduce later workflow fields. |
| Mode and disclosure | `REQ-LLM-002`, `REQ-LLM-003`, `REQ-LLM-020` in [provider execution](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md); `REQ-INST-004` in [installation](../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md); `REQ-SEC-005` in [privacy/security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md). No provider readiness check or invocation follows selection, scanning, selection of a Finding, or reopen. |
| Results and error semantics | `REQ-UX-002`–`REQ-UX-005`, `REQ-UX-010`–`REQ-UX-012` in [evidence/workflow](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md); `REQ-QUAL-012` and applicable validation/testing portions of `REQ-QUAL-010`, `REQ-QUAL-011`, `REQ-QUAL-019`, `REQ-QUAL-020` in [reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md). |
| Accessible visible behavior | `REQ-A11Y-001`–`REQ-A11Y-004`, `REQ-A11Y-009`, `REQ-A11Y-010` in [application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md); [UI index](../ui/README.md) and [visual foundations](../ui/VISUAL_FOUNDATIONS.md). M1-04 verifies its own states; it does not close the later full-MVP `REQ-A11Y-006` check owned by M6-03. |
| Unprivileged renderer | [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), [ADR-0015](../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md), `REQ-SEC-027` and the applicable `REQ-SEC-003`/`REQ-SEC-012` constraints in privacy/security. No Node, filesystem, process, scanner, credential, Ollama, or Groq access from the client. |
| Scenarios and frozen evidence | SPEC-001 and SPEC-008, plus the existing-run portion of SPEC-007 in [SPEC.feature](../specs/SPEC.feature); HS-015 in [HARD_SPEC.feature](../specs/HARD_SPEC.feature). [RD-003 manifest](../../evaluation/rd003-scan-v1.json) and six HTML bytes remain unchanged; UI tests do not redefine scan coverage or create a new evaluation package. |
| Test method | [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md): separate Red and Green ownership, proportional evidence and review, narrow first-module exception only after environment verification. |

These directly applicable portions are Accepted or explicitly Deferred under the canonical baseline. No significant architectural decision is authorized here. Ordinary task-owned UI/interface/testing literals may be resolved within M1-04; a newly required durable schema, API, security policy, dependency architecture, or product choice outside this boundary stops dependent work for its authority owner.

### Implemented surfaces and platform

The six production files are `src/server/domain/run-contract.ts`, `src/server/persistence/run-repository.ts`, `src/server/service.ts`, `src/server/main.ts`, `src/server/scan/normalize-scan.ts`, and `src/server/scan/scan-page.ts`. Preserve them. The pure domain module has no privileged imports and exports validation results and immutable records. The scanner module does have privileged imports: never import it into the client to obtain its URL preparation helper.

The service exposes `GET /api/health` and `GET /api/runs/<run-id>`. Its typed read envelope distinguishes validation/read failures and marks a stored historical `running` record `interrupted: true`; it neither repairs nor resumes it. The internal `runScan` collaborator and `executeScan` callback have not been joined in production. No M1-04 worker may change the routes or health capability.

The selected toolchain is Node 24.20.0, npm 11.19.0, TypeScript 7.0.2, React/React DOM 19.2.8, Vite 8.0.16, Playwright 1.62.1, and `@axe-core/playwright` 4.13.0. The three direct type packages are `@types/node` 24.13.3, `@types/react` 19.2.18, and `@types/react-dom` 19.2.5. All nine direct package pins are installed. These are repository-pinned facts, not latest-version recommendations.

`package.json` already declares `test:focused` as `node --test`, `typecheck` as `tsc --project tsconfig.json`, and `build` as `vite build`. `vite.config.ts` emits to `dist/client` without a React plugin. Strict `tsconfig.json` includes client TS/TSX and test `.ts`, not test `.tsx`. Native Node does not execute TSX; the browser-test transport must use the existing Vite boundary, with exact mechanics reviewed before Red.

## Scope and Non-Goals

The bounded UI contract is:

- Target entry is keyboard operable, validates a trusted public HTTPS target, and requires an explicit mode. Local is recommended, not silently selected or substituted. Configuration is separate from selection. Do not add a configuration or model-installation screen.
- The one global disclosure identifies Local's approved loopback generation and avoids an offline/zero-egress claim. Groq is named with `openai/gpt-oss-20b`, remote processing, and the allowed minimized selected-evidence and curated-guidance categories for a later explicit Generate action. Local identifies Ollama and `qwen3.5:4b`. Persist the selected provider/model label in the run presentation, but do not invoke either provider.
- One Analyze action and one ordinary UI operation guard prevent overlapping intents with an accessible explanation. Do not create a queue, cancellation, retry/resume system, extra durable lifecycle, or public task manager. Repeating Analyze intentionally starts a new independent run only through the eventual authorized collaborator.
- Render canonical `running`, `failed`, and `completed` records and separate transient form/request errors honestly. A stored interrupted record is not a live operation. A failure is never complete-zero; malformed/partial/invalid-coverage input cannot publish a partial results list as a completed run.
- Show all Findings grouped under `image-alt`, `label`, and `color-contrast`, with a stable label, rule, target summary, current state, and keyboard-reachable detail. Retain native `incomplete` observations distinctly; never count, merge, or promote them as Findings. No pagination, hidden cap, filtered default, or truncated omission.
- The only current Finding workflow state is `unprocessed`. Selecting one item is transient UI selection, not a persisted `active` state. One detail region exposes that Finding's allowed evidence and uncertainty; sibling records remain unchanged. Observations have no Finding ID, workflow state, or processing eligibility.
- Preserve per-rule coverage, run/configuration/readiness context, unavailable fact reasons and unsupported/too-long locator reasons. `null` coverage means an absent category, not numeric zero; valid zero Findings still requires complete three-rule coverage and may contain incompletes. Missing observed final URL is never replaced with the requested URL as if observed.
- Reopen a retained run through the smallest task-owned action/addressable UI boundary, validate its result and identity, preserve the exact provider context and selected evidence, and expose not-found/read/invalid/interrupted outcomes. This does not add history browsing, browser-side persistence, record repair, or auto-resume.
- Treat all external strings as text, including error-related values. Do not execute markup, HTML fragments, URLs, selectors, or code; add no target preview. State scanner-only scope, top-level/exact-three-rule coverage and limitations prominently enough to prevent accessibility, conformance, or safety interpretations.

Retrieval, support states, abstention UI, Generate, proposals, approve/edit/reject, comparison, rescan workflows, settings, dashboards, chat, bulk operations, authentication, hostile-target guarantees, release packaging, provider setup, and M1-05's real wiring/public-page smoke remain outside this task. No new package, lockfile change, test framework, state library, router, design system, image/font dependency, screenshot service, telemetry, or ADR is justified at entry. An actual new need must be reconciled before a dependent lease, not smuggled into Green.

## Plan of Work

### 1. Re-entry and literal decision

After explicit execution authorization, inspect Git status and runtime/permission state without overwriting this planning diff or unrelated work. Verify all dependency and authority gates again. Reuse `M104-BASELINE-001` only where its fingerprints remain fresh. Do not redownload a browser, start a product listener, or modify source during research.

Complete the Decision Review Contract below. Freeze the exact client callable/entry, result admission and identity rules, operation ownership, display/focus semantics, browser-test transport, command/effect slots, and path ownership as `M104-LITERALS-001`. Its analyst and reviews cannot accept a new ADR, expand scope, or substitute execution permission.

### 2. Conditional environment readiness

`M104-SETUP-01` is a bounded `TDD: Not applicable` prerequisite only if the verified browser or test-transport prerequisites are missing. It acquires/verifies the pinned managed browser and, only if necessary, exercises a disposable TSX/bundler/browser readiness probe. It creates no production module, fake App, persistent probe, behavior test, package selection, or client scaffold. A missing browser or a broken TSX loader is an environment failure, never a valid application Red.

Use `code_worker` under an exact fresh lease, with a proposed nonignored `m104-browser-runtime/` acquisition root and separately enumerated ignored scratch outputs; the literal barrier must accept the exact root and commands first. Existing libraries/configuration are read-only. A cache acquired solely for this task must be identified and later removed with exact owned-root validation; pre-existing shared resources are never assumed disposable. Setup evidence includes versions, package/engine identity, inventory, command exits, environment restoration, owned processes/listeners and residue. Risk S1 uses one fresh `milestone_reviewer` if this slice actually runs. No setup means no empty setup lease or review.

### 3. One coherent target/results UI slice

`M104-UI-01` uses `frontend-visual`. The outcome is the full bounded UI contract above, not an independently designed frontend platform. Primary accepts `M104-REUSE-001` and `M104-VISUAL-001` before the test worker's read-only preflight.

Proposed file ownership, to be narrowed and frozen into the packet before writes:

| Owner | Candidate allowed files | Read-only / forbidden surfaces |
| --- | --- | --- |
| `test_worker` | `tests/target-results-ui.test.ts`; `tests/helpers/m104-ui-harness.ts` only if the reviewed browser transport needs it. Synthetic variants stay in test-owned code. | All production files, dependencies/configuration, existing five test files, `tests/helpers/m102-run-fixture.ts`, frozen fixtures/manifest, documentation and workflow. |
| `frontend_code_worker` | `index.html`, `src/client/main.tsx`, `src/client/App.tsx`, `src/client/styles.css`; `src/client/RunResults.tsx` only if the accepted cohesive list/detail boundary warrants it. | Every test/helper, all `src/server/`, package/lock/configuration, fixtures/evaluation, documentation, workflow and Git state. |
| Primary, between leases only | This plan, roadmap, materially affected current-status/navigation/developer documentation, and the task progress summary. | No ordinary application/test/dependency/configuration edits; only the documented exceptional test-correction route may apply. |

Do not grant a whole repository, `src/`, `tests/`, or `docs/` root. Packet v2 must enumerate all four scope lists with explicit `None` where empty and name generated effects not covered by Git endpoint observation. If a separate nonvisual data-access module or executable-configuration change becomes necessary, stop and reconcile its standard-profile ownership; the visual profile is not blanket permission for backend or tooling work.

The test worker classifies preflight as `EXISTING_AND_COVERED`, `EXISTING_BUT_UNCOVERED`, `MISSING`, `REGRESSION`, `PARTIAL`, `CONFLICTING`, or `UNKNOWN`. At this baseline absence suggests `MISSING`, but the worker must inspect the actual tree. Covered behavior reuses fresh evidence; uncovered existing behavior gets passing characterization; only the confirmed missing/regressed gap gets Red. Conflicting or unknown semantics stop.

For a genuinely missing first App module/export, ADR-0024's first-module exception may accept the exact missing-callable failure only after environment verification and complete bounded behavioral tests. Record which assertions have not executed. Do not accept missing Chromium, TSX syntax failure, a broken harness, or a stub as Red. Primary inspects and accepts the tests, exact failure, command and fingerprints before Green.

A separate `frontend_code_worker` executes those tests unchanged, reaches minimum Green, and may refactor behavior-preservingly within its lease. It implements real React components, not an alternative test-only rendering. Root entry and UI behavior belong to Green, not setup. The exact production entry must be truthful before M1-05: no fixture mode, fake success, demo URL or invented endpoint. Missing production capability remains visibly unavailable or a defined bounded error; test-only collaborators are excluded from the production bundle. M1-05 later supplies the real service join.

Run focused tests, independent strict typechecking, build, and the accepted real-browser capsule. Audit tests, mocks/helpers, fixtures, snapshots, skipped/focused markers and assertions before closing the slice. Risk S3 is triggered by untrusted rendering, reopened record identity and overlapping/stale-result ownership; one fresh `critical_reviewer` reviews those properties and the visual capsule together. Do not add a second visual review panel.

### 4. Integration, preservation and closure

After accepting the slice, perform task-authoritative validation once over the complete applicable suites, with browser partitions sequential and independent. A different fresh `critical_reviewer` reviews the integrated M1-04 state while the named critical properties remain. It may reuse unchanged fresh evidence; rerun stale, missing, contradictory or risk-critical checks, not every historical suite by habit.

Primary reconciles every finding, then authorizes only the exact owned cleanup under the appropriate fresh worker lease. Recheck preserved sources, six fixture bytes, pinned packages, process/environment restoration, residue, documentation and links. Update every materially affected current-state/developer instruction, not just this plan. M1-04 becomes Complete only after its Verification and documentation gate pass; then archive this plan and repair links. Do not mark M1 or M1-05 Complete or select the next task.

Every worker assignment uses one preflight where applicable, one coherent Red/characterization, one Green, at most one same-contract correction per role and one work-slice review correction loop. Stop on the same decisive failure twice, two no-diff write handoffs, exhausted budget, changed contract, conflicting authority, or unexpected overlap. Attempt-2 names its terminal parent lease. More than three TDD cycles requires rescoping, not microcycling. One persistent test worker and the selected Green worker may serve this slice, but only one write lease exists at a time and each write turn has a new packet/lease. Research and review remain read-only; the primary owns acceptance.

## Decision Review Contract

### Current planning contract and future literal boundary

`M104-PLAN-001` is an R2 owner-facing plan artifact: primary R0 inspection, straightforward primary synthesis, no researcher/analyst/drafter, `DRAFT READY` as the untriggered contract checkpoint, and one fresh `independent_reviewer` final review. Its decision is only how to bound later work. Final planning review evaluates this plan and the activation diff; it cannot declare `M104-LITERALS-001` frozen or authorize execution.

`M104-LITERALS-001` is the future decision artifact within this same plan. Its tier is R3 because exact unprivileged-result admission, reopened identity and async result ownership are decision-critical security/integrity/concurrency mechanics not yet frozen. No new serialization or platform-equivalence algorithm is sought. The artifact selects the smallest concrete UI contract over existing types, not an architecture replacement.

The approval boundary is existing Accepted authorities and exact-task execution permission. Significant architecture, changed requirements, new product behavior, authority conflict or exhausted budget returns to the owner. Researchers, analysts and reviewers cannot accept or change those authorities.

### Discovery, criteria and outputs

The candidate set is `UNRESOLVED`. After execution authorization, one bounded non-ranking discovery pass may identify credible minimal client seams and test-transport mechanisms against the installed code and primary documentation where needed. It must not rank them. Freeze the candidate set, critical evidence dimensions, hard gates, and invariant packet before comparative research; do not require three alternatives or one agent per candidate.

Compare requirement completeness, trust-boundary preservation, unchanged aggregate semantics, truthful M1-04/M1-05 separation, testability in the existing stack, browser evidence, recoverability of generated effects, and the smallest maintenance burden. A hard-gate failure disqualifies a candidate; record the evidence and reversal condition without unnecessary candidate-local expansion. Do not introduce numeric scoring without a real decision need.

The primary-written literal block must resolve all these slots before dependent worker preflight or setup:

| Literal | Decide before workers | Later proof, not deferred semantics |
| --- | --- | --- |
| L4.1 Client callable and entry | Exact component inputs/outputs, production bootstrap/capability behavior, Analyze and reopen intent/error envelopes, URL validation boundary, and M1-05 integration handoff. No new service route, real scanner wiring, or production mock. | Actual React components and build exercise the frozen seam; M1-05 separately proves the real end-to-end join. |
| L4.2 Admission and operation ownership | Exact validated/unknown result boundary, reopened ID checks, busy/reentrant/stale completion and interrupted-record behavior, and preservation of earlier completed evidence and immutable provider context. Keep transient UI state separate from durable records. | Controlled delayed/rejected/malformed/overlapping inputs prove those rules without inventing a state framework. |
| L4.3 Evidence presentation | Every displayed M1 field/category, coverage absent-vs-zero and complete-zero meaning, Finding/observation distinction, unavailable reasons, labels, selection/detail/reopen mapping and error/limitation copy. No new IDs or lifecycle. | All retained items/fields required by the UI remain inspectable; siblings unchanged; native values never repaired or recomputed. |
| L4.4 Reuse and accessible presentation | Exact minimal component/style ownership, disclosure and label text, native controls/headings, focus and announcements, wide/narrow/zoom cases, one keyboard and one scoped screen-reader path. | Actual browser layout, operation/focus traces, automated accessibility check and honest manual evidence. |
| L4.5 Test/build/browser boundary | Exact Node-to-TSX/browser transport using existing tools, test-only data/collaborators, generated entry/bundle roots, browser identity/profile, network/listener policy, teardown and suite partitioning. No permanent demonstration product or extra test platform. | Environment preflight, complete behavioral tests, built-bundle inspection, real browser evidence and no residue. |
| L4.6 Commands and effects | Every command slot below, acquisition/restore conditionality, metadata mutation permissions, fresh-root checks, environment/cache policy, generated outputs, allowed nonignored lease scopes and cleanup effects. Use exact `None` for prohibited or unneeded effects. | Command exits, artifact inventories/fingerprints, independent strict typecheck and preservation/cleanup results. |

Required artifact-local outputs are the selected literals with direct evidence/provenance, compact disposition of alternatives and trade-offs, hard-gate results, full invariant packet results, exact command/effect and path contracts, reuse/UI capsules, residual assumptions, decide-now/prove-later boundaries and reviewer findings. Do not create parallel reports, ADRs or a new task graph to host these outputs.

### Cumulative invariants

All invariants are pending for the literal decision. Planning review checks that they are present and correctly deferred; literal pre-draft/final `critical_research_reviewer` instances check the whole packet, and implementation `critical_reviewer` checks the corresponding actual proof. Re-run the complete applicable packet after every material revision and every R3 correction.

| ID | Trigger / case | Required result | Evidence / responsible checkpoint |
| --- | --- | --- | --- |
| I4.1 Completeness | Every L4 slot, path and command/effect slot | No binding semantics delegated as a worker's invention; unresolved decision means no dependent lease. | Pending literal block; pre-draft and final research reviewers. |
| I4.2 Evidence honesty | Historical 290, fresh 202, synthetic UI runs, absent runtime | Explicit freshness and provenance; synthetic browser evidence is not native scan/durable integration, tree inspection is not browser proof. | `M104-BASELINE-001`; all reviewers. |
| I4.3 Authority/state | Exact M1-04 request, M1-01 Complete, M1-05 unselected | No schema/ADR/requirement change or other task activation; `DRAFT READY` and a review do not authorize implementation or closure. | Roadmap and literal/plan diff; all reviewers. |
| I4.4 Untrusted renderer | Markup-like text, invalid URL/data, privileged import or endpoint | Reject invalid records where required; render allowed strings only as text; no execution, privileged module, credential/provider call or target embed. | Pending browser and bundle checks; research and implementation critical reviewers. |
| I4.5 Immutable identity | Mismatched reopen ID, duplicate locator, repeated selection, sibling records | Exact admitted run/provider context; no merging by locator, observation IDs or new Finding state; no mutation/repair. | Pending unchanged-input and identity cases; critical reviewers. |
| I4.6 Operation and recovery | Reentrant Analyze/reopen, delayed completion, rejection, interrupted record | One ordinary operation owner; no stale result misattribution, hidden second invocation or auto-resume; preserve prior completed evidence. | Pending controlled async cases/focus trace; critical reviewers. |
| I4.7 Completeness and uncertainty | Populated, zero, incomplete-only, unavailable, invalid coverage | All Findings and distinct observations retained; null not zero; unavailable not invented; failure not complete or partial-success. | Existing schema plus pending UI assertions; critical reviewers. |
| I4.8 Ownership and repeatability | Browser setup, build output, scratch, leases and cleanup | Exact task-owned roots; no shared deletion, ignored-root guard fiction, overlapping test scratch, fixture byte drift or environment residue. | Pending command/effect inventory and terminal leases; setup/slice/final reviewers. |
| I4.9 Accessible visual contract | Wide/narrow, zoom, keyboard, status/detail/reopen | Names, focus/return, announcements, hierarchy, non-color distinctions and reflow match the accepted capsule; no omitted evidence. | Pending real-browser/manual proof; the same risk-routed implementation reviewers. |

### Roles, budget and stopping

The future critical research dimension is one cohesive boundary: unprivileged immutable run projection and async UI ownership. Assign one `critical_researcher` through Research Assignment Capsule v1. Primary may inspect already pinned local build/tool facts as R0. At most one `technology_researcher` is available only for a distinct unresolved noncritical build/browser evidence gap; it is not automatic. A newly discovered independent critical dimension requires contract/budget reconciliation before further assignments, not silent role expansion.

Wait at one research barrier. Reuse still-fresh evidence, permit at most one bounded follow-up per assigned researcher, and use mandatory `decision_analyst` for one R3 synthesis plus at most one bounded correction. The result must be exactly `DRAFT READY`, `RETURN FOR RESEARCH` or `OWNER DIRECTION`. A fresh `critical_research_reviewer` then performs the pre-draft checkpoint with at most one supported outline correction. Only after it passes may primary write the literal block. No drafter is needed.

A different fresh `critical_research_reviewer` performs the complete final literal/evidence review. The research-artifact ceiling is two supported correction cycles, with complete review and invariant rerun for R3; a material contract change returns to classification/research without resetting the budget. Two repeated decisive gaps, two `RETURN FOR RESEARCH` results without new evidence, unavailable authority, exhausted budget or changed scope stop dependent work for primary reconciliation/owner direction. An untriggered R2 plan correction that changes only links or non-normative trace may use deterministic plus focused review; normative, Major or uncertain changes require whole-artifact review. Do not apply research correction budgets to reset implementation budgets.

## Concrete Steps

All commands run from the repository root in PowerShell. Existing read-only entry checks are:

```powershell
git status --short
git rev-parse HEAD
git branch --show-current
git diff --check
```

The reviewed [M1-03 L3.8 command/environment procedure](completed/m1-03-real-scan-and-evidence.md#l38-exact-commands-environment-and-effects) remains the source for process-local npm/cache controls. Every npm invocation, including version/typecheck/build, must disable Node compilation caching in its wrapper and restore prior absent, empty, and nonempty values exactly. Reject unsupported override variable names without printing values. Browser commands additionally isolate the three reviewed Playwright variables and TEMP/TMP before Node starts. Do not copy an archived lease identity or assume an old cleanup allowance applies now.

For `M104-BASELINE-001`, the already executed inner commands were:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts
npm.cmd @toolchainOptions run typecheck
```

These are transcripts of commands run inside the reviewed nonbrowser wrapper, not bare-shell instructions. The wrapper's frozen options use the repository prefix and `temp/rd002-npm-cache`, disabled lifecycle scripts/audit/funding/notifier/log retention, HTTPS registry with strict TLS, lockfile use, and included development/optional packages. Both commands exited 0; 202 tests passed with no skips/cancellations.

The following are deliberately unresolved future command slots, not executable examples. Before the relevant worker lease, L4.6 must contain exact working directory, shell, command/arguments, permitted inputs/metadata mutations, environment, generated locations, external effects, expected exits, timeout/stop behavior and cleanup for every used slot. A reviewed skeleton alone is not permission to improvise:

| Slot | Required freeze |
| --- | --- |
| `M104-CMD-ENTRY` | Runtime/package/pin/source/browser identities, unsupported override-name screen, guard status, exact initial path/state inventory; no installation during a read-only check. |
| `M104-CMD-BOOTSTRAP` | Manifest creation, lockfile generation, package selection and metadata mutation: `None` at this baseline. If restore is actually needed, freeze the existing locked, script-disabled restore and its exact `node_modules`/cache effects before a setup lease; a dependency change is not an incidental restore. |
| `M104-CMD-SETUP` | Conditional managed-Chromium acquisition, endpoints, executable/revision verification and marker/inventory checks; exact nonignored allowed root, separately declared ignored scratch, optional disposable transport probe and removal. `None` if all prerequisites are verified present. |
| `M104-CMD-ENV` | Exact nonbrowser/browser wrappers; process-start TEMP/TMP, compile-cache disabling, Playwright cache/GC/download controls and exact restoration checks. No startup product download or global environment change. |
| `M104-CMD-CLEAN-STATE` | Initial absence/ownership checks, creation of ordinary empty scratch/generated roots, reparse/realpath checks and safe resume disposition. Never delete pre-existing contents just to make a check pass. |
| `M104-CMD-UI` | Exact `test:focused` invocation for the new test file; actual Vite/TSX transport, test-only entry, loopback listener/network boundary, UI browser launch profile and teardown. No Node execution of TSX or parallel use of scanner scratch. |
| `M104-CMD-TYPECHECK` | Existing independent `typecheck` inside the wrapper, after Green and affected test corrections; expected exit 0 with the strict config unchanged. |
| `M104-CMD-BUILD` | Existing `build` inside the wrapper, exact new HTML/client inputs, output inventory/bundle inspection and ownership of `dist/client`. Protect an existing output before Vite can empty it; do not let a build erase unknown data. |
| `M104-CMD-BROWSER` | Exact wide/narrow/zoom interaction procedure, automated UI accessibility check using the installed axe integration, keyboard and scoped screen-reader steps/tool prerequisites, minimal evidence artifacts and cleanup. UI checking must not inherit the target scan's exact-three-rule restriction. |
| `M104-CMD-FULL` | Sequential partition A: existing five-file 290-test suite under the reviewed M1-03 scan scratch/profile. Partition B: new UI suite under isolated M1-04 scratch/profile. Then independent strict typecheck/build and protection checks. No concurrent glob that shares TEMP/TMP or cleanup assumptions. |
| `M104-CMD-CLEANUP` | Exact owned processes/listeners and generated/browser/scratch roots, containment/ordinary-path and ownership proofs, native PowerShell removal where appropriate, inventories and environment restoration. Existing shared cache, `node_modules`, real `data/runs` and unrelated output are forbidden deletion targets. |

Opening or closing each implementation lease is primary-owned and follows the canonical guard guide with the exact accepted Packet v2. Workers never operate the guard, stage/commit, change refs/branches, stash, or otherwise mutate Git state. Ignored artifacts and external process effects need explicit evidence; an endpoint receipt is not proof of process cleanup.

## Validation and Acceptance

### Planning acceptance now

TDD is not applicable to this documentation-only request. The primary must inspect the actual diff, obtain the fresh R2 final planning verdict, reconcile findings, validate local links/anchors and Markdown/embedded PowerShell syntax, check the exact roadmap status change and all unaffected authorities, compare protected files and six fixture bytes, and run `git diff --check`. Report missing browser proof honestly. No application tests, provider call, runtime acquisition or UI behavior is fabricated as planning evidence.

### Reuse audit — M104-REUSE-001

This inventory is provisional until refreshed and accepted before preflight. A disposition is about an existing owner, not permission to invent a shared abstraction.

| Element | Disposition / concrete owner |
| --- | --- |
| Immutable M1 records and pure validators | `REUSE_AS_IS` from `src/server/domain/run-contract.ts`. No second schema/parser; privileged modules are not runtime client dependencies. |
| React/DOM, Vite build and strict TSX configuration | `REUSE_AS_IS` from package/configuration files. No new UI/test dependency, plugin or dev-server topology. |
| Visual language | `REUSE_AS_IS` as guidance from `docs/ui/VISUAL_FOUNDATIONS.md`. Implement only needed light surfaces, semantic colors, readable type, spacing and focus rules. |
| Page/form/status/disclosure | `CREATE` in the minimal App/entry paths because no client component exists. Native elements first. |
| Complete grouped results and one evidence detail | `CREATE` in App or one cohesive `RunResults.tsx` when justified. Do not extract reusable card, badge, modal, routing or state libraries for hypothetical consumers. |
| Styles | `CREATE` in one small `styles.css`; no global design-system package, theme engine, font/image acquisition, decorative motion or future-state tokens. |
| Synthetic M1 records | `REUSE_AS_IS` from `tests/helpers/m102-run-fixture.ts` in Node-side tests where its populated/zero/incomplete/unavailable/running/failed cases fit. Its metadata is synthetic, not a native current-browser observation. Additional cases remain test-owned. |
| Browser-test transport | `CREATE` only the minimal transport needed to exercise the real production components with the installed tools. No fixture showcase, standalone mock UI, new gold manifest or persistent probe. |

Use `EXTEND` or `EXTRACT_LOCAL` only if execution discovers a real existing owner/repeated concept that warrants it; record the evidence and exact paths before a worker acts.

### UI evidence capsule — M104-VISUAL-001

The visual target is the restrained Evidence Light language: run context first, then coverage/status, complete grouped items, and one selected detail. Use native semantics, system fonts, readable contrast, visible focus, explicit source/state text and wrapping long URLs/locators. No decorative dashboard or AI/proposal controls. Width changes must not hide evidence or reorder keyboard meaning.

Freeze representative desktop (proposed 1280×800) and narrow (proposed 320 CSS-pixel width) samples plus an actual zoom/reflow procedure. A narrow screenshot alone is not proof of browser zoom. These are review samples, not a platform-support matrix. Avoid a Cartesian product of every provider, state and viewport.

| Case | Required behavior and evidence |
| --- | --- |
| Target, mode and disclosure | Empty/invalid URL and missing explicit mode expose associated errors; Local is visibly recommended; selection changes only presentation and performs no probe/call. Persistent exact context and truthful unavailable production capability. |
| Busy, canonical running and interruption | Analyze/reopen cannot overlap; an accessible explanation and shared status announcement communicate progress. Stored interruption is not live busy. No disruptive focus jump or fabricated record. |
| Populated complete result | All three groups, multiple Findings, duplicate locators and distinct native observations remain individually inspectable. Counts and coverage match the record; one selected item is programmatically identified. |
| Valid zero and incomplete-only | Complete-zero is shown only after valid coverage; incompletes remain visible and separate. Limitations prohibit all-clear/compliance claims. |
| Failure or invalid result | Invalid coverage, malformed data, request rejection and read failure never become complete/partial-success or replace earlier evidence under the wrong identity. Show the failed stage/content-safe explanation. |
| Detail and return | All required allowed evidence, check IDs, native measurements and unavailable reasons can be read; long values wrap. Return restores predictable focus to the item. Provider/no-call context and sibling records remain unchanged. |
| Reopen and identity | Exact retained run/provider context is restored through the frozen UI seam; not-found/invalid/mismatched/interrupted results remain honest. No repair, resume or browser persistence. |
| Safe rendering | Markup-like canary text and unusual accepted values remain inert. Inspect built imports and browser requests for privileged modules/provider calls/test fixtures; never use actual private data. |

The test worker proves deterministic component and controlled async behavior in the real browser. The Green handoff adds the accepted wide/narrow/zoom screenshots where useful, actual keyboard/focus/status traces, a scoped automated accessibility result using existing axe, and one manual screen-reader path for the M1-04 core interaction. A DOM/accessibility-tree dump does not establish that a screen reader announced it. If that prerequisite is unavailable, report the exact unverified proof and obtain owner direction before treating it as passed; do not claim the later full-MVP accessibility gate is complete. Evidence uses the actual production React UI with explicitly synthetic test inputs, never screenshots of a duplicate mock.

### Worker and final acceptance

Retain assignment identity, role/profile, accepted packet/fingerprint, terminal lease identity/result, preflight classification, exact Red or characterization and Green commands/results, independent strict typecheck, relevant build/browser proof, primary acceptance and risk-routed review verdict. Record any exceptional primary test correction's reason, paths and validation, invalidate affected evidence, and accept the revised test contract before Green resumes.

Acceptance requires all scoped UI cases, unchanged server/schema/fixture boundaries, no provider invocation, all current Findings/observations preserved, accessible names/focus/status/reflow, the complete suite partitions and build, no skipped/focused tests used to mask failure, accepted S3 and different final review, bounded cleanup and documentation closure. Test doubles remain only where they prove controlled focused cases; no production fake crosses into M1-05 integration.

## Idempotence and Recovery

Read-only status/hash/authority checks may repeat. Test/build/browser commands repeat only under the exact reviewed environment and known ownership of their generated effects; build is not assumed non-destructive. Preserve all pre-existing records, user edits, outputs and caches. Verify resolved absolute roots remain inside the intended task directory before any recursive removal, reject reparse/foreign paths, and use one native shell end to end. Never sweep `data/runs`, shared temp, the workspace, dependencies or a browser cache of unknown ownership.

Only the primary opens/closes leases. No documentation/authority edits occur during an active worker lease. On unexpected overlap or guard failure, stop writes, close/report the lease terminally and inspect actual changes without reverting them. Resume only from the last accepted unchanged barrier with a new packet/lease; never redefine a lease or run Red/Green concurrently.

If command, source/test fingerprint, environment, literal semantics or authority changes, invalidate the affected evidence explicitly. Do not substitute a fresh download, looser assertion, extra correction turn or changed test contract to conceal a failure. Preserve useful failure/residue evidence, then request only the missing owner/permission decision. A reviewer report and a compliant receipt are inputs to primary inspection, not self-validating proof.

## Artifacts and Notes

### M104-BASELINE-001 — current-state review

Recorded on 2026-08-31 UTC before any M1-04 file edit. Git HEAD was `ae67ea619a0c32a0a383b3b39fcfe89406ab6986` on `codex/m1-04-target-and-results-ui`; worktree and index were clean. The reviewed predecessor tree and merged tree have no content difference.

The fresh wrapped nonbrowser command passed 202 tests (58 contract, 55 repository, 69 service, 20 normalization), zero failures/skips/cancellations, exit 0. Independent strict typecheck exited 0. Node/npm and all nine direct package pins matched the existing configuration; Python 3.12.10 was available for the guard. Controlled environment values were restored exactly. No browser, provider or public-target scan ran.

Twenty-five tracked source/test/configuration/fixture/evaluation files were fingerprinted for planning preservation. The six fixture files exactly matched their manifest-embedded UTF-8 content. Representative SHA-256 identities:

| Artifact | SHA-256 / normalization |
| --- | --- |
| `package.json` | `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98`, raw bytes |
| `package-lock.json` | `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`, raw bytes |
| `evaluation/rd003-scan-v1.json` | `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`, raw bytes |
| `src/server/domain/run-contract.ts` | `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e`, raw bytes |
| `src/server/scan/scan-page.ts` | `6afc664b7ed9509ed5a7e62d2939ecb10643827c74ad1eb095a6cbf4baa0926d`, LF-normalized text, matching accepted M1-03 source |

The [M1-03 archive](completed/m1-03-real-scan-and-evidence.md#outcomes--retrospective) retains the accepted historical full 290-test browser/integration result and cleanup. It was not rerun here. Default managed Chromium, `m103-browser-runtime`, `m104-browser-runtime`, M1-03 scratch, proposed M1-04 scratch, `src/client`, root `index.html`, `dist/client` and an active lease were absent. `data/runs` contained no retained run directories. These are planning-time observations, not promises about the execution checkout.

### M104-PLAN-001 — accepted planning checkpoint

Accepted at 2026-08-31 16:26Z after fresh `independent_reviewer` review `M104-PLAN-REVIEW-001` returned `PASS` with no Blocker, Major or Minor findings. The reviewer inspected the complete plan, new progress record, ten-document activation diff, routed authorities, existing interfaces/configuration and Git state. The reviewed plan's raw SHA-256 was `82df41b2a46feaa2a147e116e64607b1795f577f9528e54b6747536c58143c8a`. This identifies the pre-closure draft, not a self-hash of this subsequently updated living document.

Primary verified 605 relative links and 119 Markdown fragments, all 15 required plan sections, UTF-8/formatting and JSON configuration, all seven embedded PowerShell blocks by parsing only, and `git diff --check`. The roadmap still has 28 tasks: six Complete, M1-04 alone In progress, and 21 Not started. Twenty-six other task blocks are unchanged; M1-03 changes only its historical selection qualifier. M1-04's objective, dependency, expected behavior, authorities and verification remain unchanged.

All 25 protected raw-byte fingerprints and six fixture/manifest content comparisons passed. No client/build/runtime/scratch/active-lease/run-data change occurred. The reviewer reused matching current evidence and ran no effectful test, build or download. Its final note listed embedded-PowerShell validation as remaining; the primary completed that syntax check with seven blocks and zero errors and reconciled the note before accepting this checkpoint.

These validation counts describe the reviewed draft; the final documentation-only checkpoint append receives renewed preservation/link/syntax checks. It changes no implementation contract, future literal, role budget or command slot. Documentation impact: create the active task plan and progress record; synchronize the roadmap, indexes and existing current-status summaries while preserving completed history. No requirement, ADR, schema, dependency, fixture, executable configuration or application file changed. No commit or push was made.

### Evidence still to retain

Add only future accepted material results: the literal block and research/checkpoint provenance; accepted reuse/UI capsules; any setup inventory/terminal lease; coherent UI Red/Green/browser/S3 evidence; final suite/integrated review/cleanup and documentation impact. The planning review is recorded above. Do not paste raw agent reports, command logs, lease records, prompts, token counts or a generated progress ledger.

## Interfaces and Dependencies

The durable interface remains `PageAnalysisRun` / `ScanResult` and their validators; run status remains `running | failed | completed` and a current Finding remains `unprocessed`. Provider contexts remain exactly Local/Ollama/`qwen3.5:4b` and Groq/Groq/`openai/gpt-oss-20b`. The frontend must neither amend those records nor reinterpret native `incomplete` as a Finding.

The future client callable and entry are unresolved L4.1/L4.2 ordinary implementation literals, constrained by these immutable contracts and M1-05's ownership. Transport details, exact function/export names, transient view-state representation, test harness and focus procedure must be frozen before tests depend on them. An unresolved significant cross-module decision instead follows the ADR/owner route.

No additional dependency is selected. Use the existing React/Vite/Node test/Playwright/axe stack. The six evaluation fixtures and manifest remain external read-only references, not browser-hosted production content. The frontend-quality overlay affects visible implementation and evidence only; it does not authorize a new task, design system, provider behavior, scanner change or requirement.

## Revision note

2026-08-31: Created the primary-authored M1-04 planning draft after current-state review and fresh nonbrowser verification. Recorded the conditional runtime prerequisite, one frontend-visual TDD slice, immutable M1 boundaries, explicit future literal/command gates, sequential browser-suite isolation and planning-only activation. No implementation or tool selection was performed.

2026-08-31: Accepted the fresh independent planning `PASS` and primary validation, updated the planning outcome/progress record and retained every execution gate. This evidence-only closure update changes no normative implementation contract.
