# M6-03 — Verify application accessibility

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with [PLANS.md](../../PLANS.md).

## Current state

- **Task:** [M6-03](../DEVELOPMENT_ROADMAP.md#m6-03--verify-the-applications-accessible-core-path), roadmap status **Not started**. Existing conditional G/A/B/C execution authorization remains recorded; no routine renewal is needed.
- **Dependency:** [M6-02 is Complete](completed/m6-02-six-fixed-generation-executions.md#m602-native-final--six-case-verification-and-task-closure), including current native capacity, six runtime-valid cases, preserved semantic limitations and confirmed owned cleanup. Its historical failures remain unchanged.
- **Latest checkpoint:** Dependency documentation reconciled on2026-09-23UTC. Planning-preparation PASS and the original blocked readiness check below remain historical. No M6-03 test, implementation, browser or correction allowance is opened by this documentation update; no lease is active.
- **Next action:** Recheck [G](#g--confirm-readiness-and-bind-the-proof), bind the current proof/commands and activate M6-03 under existing authorization when that readiness procedure passes. Preserve current unrelated changes and M6-02 records. No M6-02 recovery or new model call is required here.

## Progress

- [x] (2026-09-21) Review current roadmap, M6-02 stopped handoff, accessibility authorities, UI boundaries and existing evidence surfaces.
- [x] (2026-09-21) Run independent strict TypeScript without browser/runtime effects; confirm clean entry and no active lease.
- [x] (2026-09-21) Prepare this dependency-gated plan without activating M6-03 or creating a progress record.
- [x] (2026-09-21) Independent planning-preparation PASS with no findings; documentation validation accepted. Execution remains blocked.
- [x] (2026-09-21) Receive conditional execution authorization and recheck current roadmap, M6-02 state, HEAD, dirty paths and active-lease absence. Prerequisite remains unmet; retain Not started and reconcile documentation only.
- [ ] G: M6-02 prerequisite resolved, execution authorized, current proof/command contract accepted and task activated.
- [ ] A: worker-first coverage preflight, necessary characterization or bounded corrections, focused verification and risk-routed acceptance.
- [ ] B: one documented core visual path at desktop/narrow sizes plus required automated accessibility, keyboard, focus and announcement evidence.
- [ ] C: current regression, strict/build, fresh final review and documentation closure; archive only after task Verification passes.

## Surprises & Discoveries

- At planning entry, M6-02 had qualified implementation but incomplete fixed-case evaluation. Its then-current acceptance recorded 978 tests across 49 files, strict/build and a final review for a stopped handoff. That historical review did not close the task; the later native continuation and closure now satisfy the dependency.
- The original M6-02 Local image dispatched once and failed response validation; its required in-call observation was missed. The successor consumed one entry but dispatched no generation after a metadata prerequisite failure. Five cases in each campaign remain not-run. The cause and native cleanup state remain unproved; do not diagnose or repair them here.
- The existing synthetic App harness supplies the component collaborators needed for a controlled visual path. Legacy manual launchers are incomplete for M6-03 and include obsolete screen-reader/200% zoom directions or historical revision literals. Reuse the underlying helpers, not their old instructions or evidence claims.
- All 200% zoom testing is Deferred, while accessible zoom behavior remains Accepted. Manual screen-reader speech is not a portfolio gate. Neither a passing axe result nor live-region DOM assertions establish speech or WCAG conformance.

## Decision Log

- **2026-09-21 / Primary — Preparation without activation.** The user authorized this plan, but the roadmap dependency is unmet. Keep M6-03 Not started, register the prepared plan separately, and create no progress record until actual task activation.
- **2026-09-21 / Primary — Verification first.** Reuse current React owners, UI tests, synthetic collaborators and installed Playwright/axe. No production change or new accessibility infrastructure is presumed.
- **2026-09-21 / Primary — Controlled visual evidence.** Plan one bounded synthetic core path using the actual application UI. State explicitly which service outcomes are controlled; do not infer new scan, retrieval, model, durable-review or comparison-calculation evidence from it.
- **2026-09-21 / Primary — Conditional execution authorization.** The owner authorizes G/A/B/C only after existing readiness conditions pass and explicitly preserves the M6-02 dependency. Record the authorization without activating the task, opening leases or renewing any prior operation/correction allowance.

## Outcomes & Retrospective

Planning preparation is complete with independent PASS and documentation validation. M6-02 subsequently completed on2026-09-23UTC; the task can proceed through G under existing conditional authorization. No M6-03 accessibility result is claimed. This document makes the dependency, exact compact verification boundary and reuse route explicit without changing product requirements or earlier results. Roadmap status remains Not started.

At the conditional execution readiness checkpoint, M6-02 remained incomplete with unresolved native metadata cleanup and no scheduling amendment; only readiness inspection and documentation maintenance occurred. The later M6-02 continuation reconciled current resources without rewriting that historical uncertainty. That prerequisite was subsequently satisfied by M6-02 closure; M6-03 remains Not started until its own G activation.

## Purpose / Big Picture

Verify the implemented application's essential interaction: target entry and mode choice, complete results navigation, selected evidence and guidance, generation status and proposal, individual review, and comparison. The deliverable is traceable automated evidence plus one manual visual smoke path, with honest limitations. It is not an accessibility certification, support matrix or new product subsystem.

## Context and Orientation

### Controlling authority and current project state

Start with the [authority map](../README.md#authority-and-status-map), [project requirements](../PROJECT_REQUIREMENTS.md), selected roadmap entry and [application-accessibility requirements](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md). All selected Must rows, REQ-A11Y-001–004, 006, 009 and 010, are Accepted. Their current verification amendments control older specification/launcher wording.

[OD-022](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) and [OD-024](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-024--minimum-complete-mvp-behavior-contracts) own the compact scope; [OD-025](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-025--development-authorization-and-roadmap-governance) preserves dependency-ready activation. [SPEC-001–008](../specs/SPEC.feature) are derived observable examples: intake/results; guidance; proposal/abstention/failure; provider disclosure; review; comparison; preserved work; and source/limitation distinctions. This task verifies their applicable presentation and interaction, not another full backend campaign.

[ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), the [UI index](../ui/README.md) and [Analyze/Results presentation](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md) control UI responsibility and state. Preserve canonical running/completed/failed scan states, evidence-only manual-review observations, supported/abstained/failed Finding outcomes, truthful invocation status and individual human decisions. Do not introduce UI-only domain states or retained-run reopening. [REQ-EVAL-004/005](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#evaluation-requirements) preserve provenance and changed-evidence honesty.

The [agent workflow](../../.codex/README.md), [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [write guard](../../.codex/write-lease-guard.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) and [frontend-quality skill](../../.agents/skills/frontend-quality/SKILL.md) govern implementation if later needed. The skill is presently planning guidance, not development authority.

At entry, 25 tasks through M6-01 are Complete; M6-02 is In progress; M6-03/M6-04 are Not started. M1–M5 implemented the walking skeleton, retrieval, fixed providers, human review and conservative comparison. [M6-01 closure](completed/m6-01-shared-deterministic-evaluation.md#m601-final-01--integrated-review-and-documentation-closure) preserves the informative-image retrieval relevance limitation. [M6-02 current implementation acceptance](completed/m6-02-six-fixed-generation-executions.md#m602-suc-accept-01--complete-s3-and-prequalification-acceptance) and stopped handoff are historical test/effect evidence, not fresh accessibility proof. No prior public, model, review or cleanup grant is renewed.

### Minimum proof and reuse map

| Current responsibility / authority | Reuse surface | Required evidence |
| --- | --- | --- |
| Target/mode/validation, running/completed/failed, complete/zero/coverage failure; A11Y-001/002/004 | AnalyzeForm, AnalyzeSection, App; target-results UI tests | Keyboard reachability and activation, named/associated errors, one shared status pattern, focus preservation and truthful result states |
| Every Finding/manual-review observation, selected item and evidence; A11Y-001/009/010 | FindingsPanel, ResultCard, ResultDetail, ResultsSection | Full collection reachability, named scroll region, visible/programmatic selection, manual-review tags, selection retains focus and announces only the selected item |
| Guidance, abstention, eligible/pending/pre-call/attempted/unknown outcomes; A11Y-002/004 | FindingGuidance, FindingOutcome, FindingGeneration, ProposalDetail; guidance/generation UI tests | Explicit evidence layers, citations and full text, shared announcements, no review for abstention/observations, no fabricated call outcome, stable focus on settlement |
| Proposal-only review and its validation/saved result; A11Y-001–004/006 | ProposalReviewForm, ProposalEditor, ReviewDecision; review UI tests | Operable support/judgment controls, associated validation, original versus edited/human text, saved-decision announcement and predictable focus |
| Intentional rescan, comparison and baseline navigation; A11Y-001–004/006 | IntentionalRescanForm, ComparisonDetail; rescan/comparison UI tests | Keyboard operation, predictable Results focus after replacement/navigation, zero-Finding later result, non-color outcomes and limitations; availability settlement does not steal focus |
| Layout, readability, contrast, overflow and visible focus; A11Y-003/006 | Existing styles and all owners above | Automated applicable axe checks plus actual browser visual observation at desktop 1366×900 and narrow 390×844, 100% zoom; no support-matrix claim |

Initial visual reuse disposition is **REUSE_AS_IS** for each named existing owner, subject to actual preflight. Production responsibility change: **None — no application-source responsibility changes planned**. A confirmed defect needs an exact responsibility/edge/reuse amendment before a writer receives it. Do not assign all changes to App or styles merely because those paths already exist.

Existing automated entry points are `tests/target-results-ui.test.ts`, `tests/finding-guidance-ui.test.ts`, `tests/finding-generation-ui.test.ts`, `tests/finding-review-ui.test.ts`, `tests/intentional-rescan-ui.test.ts` and `tests/comparison-ui.test.ts`. Reuse `tests/helpers/m104-ui-harness.ts` and the review/comparison fixture helpers. The source map is navigation, not a claim of freshly passing or complete coverage. The actual composed visual path and any missing assertions are bound in G/A.

Concrete reuse entry points: `startHarness(manual, entry)` returns the real browser page, source hashes and close boundary; its App bridge injects Analyze/guidance/generation/review/rescan/comparison collaborators and blocks non-origin browser requests. `reviewProfileStages` and `reviewedProfileRun` in `tests/helpers/m402-review-fixture.ts` supply validated proposal/review stages; `comparisonForRuns` and `resolvedZeroComparisonForRuns` in `tests/helpers/m503-comparison-fixture.ts` supply controlled comparison results. Existing comparison/review UI tests show their composition. Do not substitute `runBuiltReviewCase`, which starts a real local service and persists sandbox records, for this synthetic visual route.

Preflight has two concrete evidence gaps to resolve: no existing manual entry covers the full path, and scattered direct focus/click/check calls do not by themselves prove continuous logical Tab order or absence of traps through the core controls. Add only missing characterization/composition, not duplicate scenario suites. The harness also requires prepared scratch, exact environment/browser identity and a recent validation marker; its historical hash map does not cover every later fixture/driver. G must bind those actual inputs and the marker producer/consumer, not assume built-in hashes are complete.

## Scope and Non-Goals

Include only the selected Accepted accessibility checks, a minimal controlled visual path, required test coverage, and bounded correction of a demonstrated task-owned defect after execution authorization. Reconcile instructions/evidence at closure.

Exclude M6-02 recovery, new generation/embedding/runtime/credential requests, public navigation/scans, capacity observations, authentic retained human decisions, production-data mutation/deletion, new evaluation campaigns, UI redesign, dependencies, general runners, screenshot services, accessibility platforms, exhaustive state/browser/assistive-technology combinations, participant studies and release claims. All 200% zoom tests and manual screen-reader testing remain outside this gate. M6-04 stays unselected.

## Plan of Work

### G — Confirm readiness and bind the proof

Do not start executable M6-03 work until M6-02 is Complete with its closure gate and cleanup uncertainty resolved, or the owner explicitly changes the scheduling authority. A generic instruction to execute this plan does not silently amend the dependency. If it remains unmet, finish documentation only and report the blocker. Do not inspect credentials, probe Ollama, reconcile M6-02 transports or retry its cases here.

Once dependency-ready and execution-authorized, read current HEAD/dirty paths, actual prerequisites, relevant source/test/build/config identities, existing leases and owned scratch state. Preserve other work. Record task activation in the roadmap and create its indexed progress record only then. Never require the planning SHA or falsify application revision metadata.

Freeze `M603-G-PROOF-01` here before any affected write or browser command: exact requirement-to-test mapping; controlled fixture/state sequence; current UI/build/browser identity; installed browser/axe settings; exact commands and ports; allowed file mutations; scratch/output ownership; expected effect counters; timeouts; cleanup and evidence capture. Existing helpers and direct browser inspection are the default. Do not introduce a custom observer, integrity framework or new test runner. If a materially new consequential mechanism becomes necessary, stop and apply the workflow's research/Decision Review Contract routing before selecting it.

Bind the synthetic visual path through actual form/actions with controlled collaborators: valid trusted-format HTTPS target and explicit mode → Analyze → complete mixed results and selected Finding → supported guidance → proposal → one controlled review decision → controlled rescan/comparison and baseline navigation. Use known existing fixtures; do not change frozen model/corpus/comparison definitions or execute genuine provider calls. Controlled state may identify a synthetic attempted invocation, but it proves only rendering and interaction. Record which outcomes are injected and which application interactions are real. No saved decision in this harness is an owner decision on an authentic retained proposal.

### A — Verify coverage and correct only demonstrated gaps

Use workflow ID `m603-application-accessibility-verification`. Assign one bounded read-only `test_worker` preflight against the proof map. Existing passing tests are reused under complete evidence identity; missing evidence is not automatically missing behavior. `EXISTING_BUT_UNCOVERED` uses a guarded passing characterization; missing/regressed behavior uses accepted test-worker Red then a separate implementation worker's Green. PARTIAL is narrowed; CONFLICTING/UNKNOWN returns for triage. Never fabricate Red for visual inspection or documentation.

Candidate test-owned paths are the six existing UI tests and their specific fixture/harness helpers; a purpose-named M6-03 test/visual caller is permitted only if existing composition cannot express the current proof. G freezes exact files and symbols, not directory-wide leases. A test-side fixture composition may reuse App collaborators; new substantive production behavior cannot be hidden in a helper. Ordinary production edits remain delegated. Material rendered fixes use `frontend_code_worker`, the frontend-visual packet, accepted reuse dispositions and real-browser evidence; a nonvisual fix uses `code_worker`. Primary owns plans, authority, status and evidence acceptance between leases.

Every worker write turn requires a primary-opened fresh packet/lease, terminal compliant close, actual diff inspection and evidence/cohesion acceptance. One lease per worktree. Accepted tests stay unchanged during Green; workers use Git read-only. Initial turn plus one ordinary correction is the default; a third requires the workflow's recorded progress/new-evidence/changed-action/expected-benefit conditions. One review-correction loop uses remaining budgets. New IDs or workers cannot renew allowances. Consult the [bug index](../bugs/README.md) before investigating a substantive defect.

Route bounded characterization by its actual risk. Cross-UI integrated behavior is S2 with `independent_reviewer`; use `critical_reviewer` only for a real S3 trigger or the workflow's escalation condition. Preserve research roles as read-only. A handoff or passing lease receipt is not proof of behavior or cohesion.

### B — Observe the compact accessible core path

After G/A acceptance, run the six focused UI suites sequentially using current maintained preparation and isolated UI scratch. Reuse still-valid evidence rather than repeat tests at handoff. Map automated assertions to every selected requirement: keyboard order/activation/no trap, names/relationships, full result navigation, selected state, shared live-region semantics, non-disruptive focus and applicable automated contrast/accessibility rules.

Cover important canonical states through existing focused tests, without a Cartesian matrix: invalid input/missing mode; scan start/completion/failure/valid zero/coverage failure; selection and manual-review observation; guidance loading/support/abstention/failure; eligible/pending/pre-call/attempted/unknown generation; review validation/saved decision; rescan and comparison success/failure/unavailable lineage. Existing negative tests can establish these branches; the manual smoke need not repeat each branch at each width.

Perform one documented visual workflow with the desktop and narrow samples in the map. Inspect layout, complete readable evidence/citations/notices, source distinctions, non-color statuses, visible focus and absence of horizontal page overflow through proposal, review and comparison. Use actual browser-rendered observation; screenshots only where decisive. Programmatic viewport/keyboard operations support inspection but are not manual screen-reader speech evidence. Confirm no production run-store, scanner, embedding or generation effect occurred.

The legacy `--manual`, `--m203-manual` and review launcher directions are not an approved M6-03 script: remove reliance on old zoom/Narrator steps, incomplete paths and historical revision literals in the task-owned caller or instructions before use. Bind evidence to the current browser/build and actual observation, not an old hard-coded log field. A structural axe scan, screenshot or overflow number alone cannot prove the whole visual path.

Record pass/fail/not-run per requirement and decisive state, automated command identity and manual observations with limitations. A failed required check remains failed until its bounded correction and affected re-verification pass. Do not weaken assertions, omit difficult states, claim an inaccessible fixture is a product defect, or mislabel controlled observations as actual backend success.

### C — Integrate, review and close

Run the current maintained authoritative suite sequentially, independent strict TypeScript and current build at closure. At entry the historical suite is 49 files/978 tests; counts are descriptive, not assertions to freeze. Keep actual-case/capture flags absent and no concurrent service/browser work. Preserve the workflow's complete evidence-identity rule; rerun only affected/stale/contradictory evidence before the final complete suite where required.

A fresh final `independent_reviewer`, different from a preceding work-slice reviewer, checks integrated requirement coverage, actual visual evidence, controlled/real distinctions, source ownership, preserved data, cleanup and documentation. Escalate only on named critical triggers. Review is not a second exhaustive browser campaign.

Apply the [documentation closure gate](../README.md#task-closure-documentation-gate), including affected UI/developer instructions, requirement/status consistency, links and whitespace. Mark Complete and archive only when every required M6-03 check and that gate pass. Deferred zoom/manual speech remain explicitly unverified. Update the task's progress and navigation at accepted material checkpoints; do not activate M6-04.

## Decision Review Contract

No consequential technology or architecture selection is proposed. Planning uses bounded repository evidence mapping and primary synthesis; no analyst, drafter or R3 panel is required merely to reuse established UI checks. G binds task literals and proof coverage in this plan. If discovery requires a new consequential proof, isolation or recovery mechanism, classify its actual risk and add the required contract before comparative research or implementation; do not smuggle it into test setup.

## Concrete Steps

Work from the repository root in PowerShell 7. Read and dot-source only the definition block under [Development command preparation](../../README.md#development-command-preparation). Do not replay adjacent restore, server, deletion or archived evaluation commands.

### M603-CMD-ENTRY — Read-only planning diagnostic

```powershell
git status --short
git rev-parse HEAD
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') {
  throw 'Reconcile active lease before task maintenance'
}
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) {
    throw 'Pinned Node runtime unavailable'
  }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Independent strict TypeScript failed' }
}
```

Expected: strict check passes, no emitted files or live resource. This does not establish browser accessibility or clear M6-02.

### M603-CMD-UI — Existing focused command, gated until G

After G binds prerequisites, checks capture flags absent and validates empty ordinary UI scratch, this is the existing focused route; it is not authorized by the planning request:

```powershell
foreach ($m603Test in @(
  'tests/target-results-ui.test.ts',
  'tests/finding-guidance-ui.test.ts',
  'tests/finding-generation-ui.test.ts',
  'tests/finding-review-ui.test.ts',
  'tests/intentional-rescan-ui.test.ts',
  'tests/comparison-ui.test.ts'
)) {
  Assert-M105EmptyDirectory $m105UiTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 $m603Test
    if ($LASTEXITCODE -ne 0) { throw 'M6-03 focused UI suite failed' }
  } $m105UiTemp
}
Assert-M105EmptyDirectory $m105UiTemp
```

G must resolve these remaining command bindings before use; no worker invents them after its lease opens:

| Binding | Required resolution |
| --- | --- |
| Readiness/identity | Actual dependency acceptance, current HEAD/dirty paths, source/test/build/browser identity, no active lease/conflicting live work; preserve M6-02 records without replaying its identity-bound inspectors |
| Preparation/build | Exact installed-browser and current build prerequisites, explicit owned ports/scratch/output paths, allowed build mutations and environment restoration; no install/download or broad cleanup |
| Visual caller | Existing helper entry/imports, deterministic state sequence, genuine UI actions, viewport changes, effect counters, local content-safe evidence and exact source/build identity; no obsolete manual launcher contract |
| Gap/fix qualification | Exact files, assertion/expected behavior, worker ownership, focused commands and risk-routed review; no broad path lease |
| Full verification | Current [maintained full-suite and build commands](../../README.md#build-and-verify-the-walking-skeleton), accepted additions and absent capture/actual-case flags; preserve scanner/UI scratch separation |
| Cleanup/documentation | Stop/await only owned resources; validate literal ordinary disposable paths and contents before deletion; preserve retained runs/evidence; links, syntax, status, UTF-8/newline/trailing whitespace and git diff --check plus untracked-file inspection |

## Validation and Acceptance

Planning acceptance requires this plan and its index link, accurate blocked execution state, traceable Accepted/Deferred boundaries and proportional documentation validation. Roadmap status, requirements and prior evidence remain unchanged.

Execution acceptance requires dependency readiness, reviewed exact proof binding, every selected REQ-A11Y row mapped to passing current automated evidence, and the real-browser desktop/narrow visual path including a proposal-bearing Finding, its controlled decision and comparison. Focus and live-region assertions prove their tested DOM/interaction semantics only. No new actual provider or authentic review evidence is required or authorized here.

For the manual visual observation, TDD is Not applicable: direct rendered observation with exact identity and recorded result is replacement evidence. Automatable behavior and test-side characterization retain the worker-first route; no blanket non-TDD exception applies to a new caller or fix. Completion also requires maintained regression, strict/build, fresh final review, preservation/cleanup and documentation closure. Unmet Must checks block completion; no composite accessibility score masks them.

## Idempotence and Recovery

Resume read-only from this section, current state, the bound proof and actual evidence. Reconcile the current checkout; never restore an old SHA or pretend a prior artifact represents the new build. The M6-02 readback revision restriction is recorded in its [documentation review](completed/m6-02-six-fixed-generation-executions.md#m602-doc-01--documentation-review-and-execution-revision); M6-03 must not override that identity to obtain a pass.

Controlled UI checks may repeat after an accepted fix under their bound isolation and cleanup contract; they cannot replay original generation campaigns or human decisions. Preserve original runs, corpus, frozen manifests and ignored historical evidence. Do not use production data to make a visual fixture convenient. A wrong collaborator or unexpected real request stops the affected lane immediately; record effects rather than assuming cancellation.

Stop only owned application/harness/browser resources and await closure before another operation. Do not kill unknown processes, modify the developer-owned runtime, empty shared scratch blindly or recursively remove temp/data roots. Preserve unfamiliar files and uncertain resource state for primary triage. A guard violation stops writes without reverting others' work. Correct within existing scope/budget; ask for a material owner decision when required.

## Artifacts and Notes

### M603-ENTRY-01 — Current project state and planning evidence

2026-09-21: clean `470e5746265ef32f46291d45fa46a4c989e532da`; no active lease. Primary reviewed authority/status, M6-02 current stopped outcomes, requirements and amendments, specifications, UI ownership, maintained command preparation and bug recording rules. One read-only explorer mapped existing UI/test/harness reuse without execution or edits. Fresh pinned-Node independent strict TypeScript passes. No tests, build, browser, local service, runtime request, credential access or provider call ran in this planning turn. Historical 978-test/build acceptance belongs to M6-02 and was not rerun or claimed as M6-03 verification.

### M603-PLAN-REVIEW-01 — Planning readiness

On 2026-09-21, a fresh read-only `independent_reviewer` returned **PASS for planning preparation; execution remains blocked**, with no findings. It reviewed the complete plan/index, controlling requirements and workflow, M6-02 current state, actual harness interfaces and fixture exports. It confirmed dependency honesty, all selected accessibility rows, compact automated/visual coverage, Deferred exclusions, reuse, worker ownership and command gating. It made no edits or executable/browser/provider checks and did not reproduce the primary's strict TypeScript result.

Primary accepted this as documentation readiness only. Separate deterministic validation passes for both changed documents: all local links/anchors, both PowerShell blocks, all sixteen plan sections, UTF-8 without BOM, final newlines, trailing whitespace and `git diff --check`, with direct untracked-plan inspection. Git contains only this plan and its index change. Roadmap counts remain 25 Complete, one In progress and two Not started.

Documentation impact: created the dependency-gated plan and indexed it under prepared plans awaiting prerequisites. No roadmap status, requirement, ADR, product behavior, retained evidence, developer command or progress record changed. The frontend-quality skill informed reuse-first evidence and desktop/narrow visual boundaries; it did not authorize implementation. Dependency resolution, G bindings, coverage qualification and real visual results remain pending.

### M603-READINESS-01 — Conditional authorization and blocked execution

2026-09-21: the owner authorizes execution through G/A/B/C only after existing readiness gates pass, explicitly without amending the M6-02 dependency or authorizing its recovery. Fresh repository inspection confirms HEAD `470e5746265ef32f46291d45fa46a4c989e532da`, the existing modified plan index and untracked M6-03 plan, and absence of `logs/agent-flow-leases/v2/active.json`. Existing planning changes are preserved.

The roadmap still records M6-02 In progress and M6-03 Not started. M6-02's current state and M602-SUC-FINAL-01 retain unmet task Verification, stopped original/successor campaigns and uncertain native metadata transport closure. Its final PASS is for the stopped handoff only. No explicit scheduling amendment exists in the current task authority or this execution request. Execution readiness therefore fails; planning PASS does not clear it.

No tests, build, browser, service, provider/runtime request, credential access, implementation lease, M6-02 diagnostic or cleanup action ran during this readiness check. Prior automated evidence remains historical; all M6-03 automated and visual execution remains not-run. No progress record or later task was activated. The smallest next owner action is to authorize bounded M6-02 prerequisite/cleanup resolution under that task, or explicitly amend M6-03 scheduling with a disposition of the cleanup uncertainty. This record grants neither route.

Documentation impact: reconcile this plan's conditional authorization, current state and next action only. The prepared-plan index remains accurate; roadmap, requirements, commands, prior evidence and M6-02 records remain unchanged.

## Interfaces and Dependencies

Reuse installed React, Playwright, axe and the current application UI and controlled test collaborators. This task selects no dependency, product API, persisted schema, provider, UI subsystem or backend execution mechanism. Preserve client/service direction; test-only bridge collaborators never enter production imports. Any task-owned fixture/caller must stay small, purpose-named and subordinate to the existing test harness.

## Revision Note

2026-09-21: Created at owner request as documentation preparation while M6-02 remains incomplete. Kept M6-03 Not started, preserved the scheduling and cleanup gates, mapped the compact accessibility proof and existing reuse surfaces, excluded Deferred verification and new actual effects, and left exact execution bindings gated before writes/browser work.

2026-09-21: Recorded independent planning-preparation PASS with no findings and two-document validation. No execution gate, authority or allowance changed.

2026-09-21: Recorded conditional G/A/B/C authorization and the failed readiness check. Preserved the prerequisite gate, Not started status, prior allowances and existing planning changes; no executable work began.

2026-09-21: Reconciled the dependency summary with M6-02's separately authorized continuation and current-resource reconciliation. Historical failure/cleanup evidence and M6-03 Not started status remain unchanged; no M6-03 execution allowance opened.

2026-09-23: Reconciled the current dependency summary after M6-02 Verification and documentation closure. Preserved the original blocked-readiness record and conditional execution authorization; M6-03 remains Not started pending its own G readiness procedure.
