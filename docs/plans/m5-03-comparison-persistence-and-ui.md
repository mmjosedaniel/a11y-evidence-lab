# Persist and present comparison evidence — M5-03

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Owner:** [M5-03](../DEVELOPMENT_ROADMAP.md#m5-03--persist-and-present-comparison-evidence), In progress for owner-requested current-state review and planning only. Implementation, actual scans, model calls and retained-run changes are not authorized by this request.
- **Prerequisite:** M5-02 is Complete at [M502-FINAL-01](completed/m5-02-conservative-comparison.md#m502-final-01--integrated-review-and-task-closure). Twenty-two tasks are Complete; M5-04 and M6 remain unselected.
- **Latest evidence:** [M503-ENTRY-01](#m503-entry-01--planning-evidence) and [M503-PLAN-01](#m503-plan-01--accepted-planning-readiness). Independent planning readiness review passed without findings. No unresolved requirement or architecture decision was found; task-owned storage, publication, response and presentation literals remain unresolved at G.
- **Active lease:** None. No implementation attempt or G research allowance consumed. Planning review permits one supported correction and complete re-review; future budgets are in [Plan of Work](#plan-of-work) and the [Decision Review Contract](#decision-review-contract).
- **Next:** After separate execution authorization, refresh the intentional Git/runtime/frozen-input baseline, complete G, then enter A preflight. Use the [commands](#concrete-steps), [acceptance](#validation-and-acceptance), and [recovery](#idempotence-and-recovery) below. A planning PASS is not G acceptance or implementation proof.

## Progress

- [x] (2026-09-19 14:14Z) Reviewed roadmap-wide status, current M5-02 closure, applicable authorities and actual backend/client seams; verified strict TypeScript, 111 focused tests and protected inputs in M503-ENTRY-01.
- [x] (2026-09-19 14:26Z) Independent critical planning PASS without findings; primary accepted the readiness review and five-document reconciliation in M503-PLAN-01.
- [ ] Execution authorization and fresh entry identity; G literal/command acceptance.
- [ ] A — Closed durable comparison contract and aggregate update.
- [ ] B — Service publication, validated readback and client admission.
- [ ] C — Accessible comparison presentation and navigation.
- [ ] D — Controlled integrated proof, full regression, different final critical review and documentation closure.

## Surprises & Discoveries

- M5-02 computes a bounded `ComparisonResult` in `src/server/local-service/rescan-comparison.ts`, but `service.ts::rescanFinding` deliberately discards it. Existing schemas and integration assertions reject comparison fields. M5-03 must intentionally supersede only those task-boundary exclusions; native candidate archives remain forbidden.
- A resolved later run may have zero Findings. Mounting comparison only inside a selected later `ResultDetail` would hide a valid result. The later-run Results composition needs a comparison owner independent of later selection.
- Existing single-file publication and selected-Finding transitions already protect completed evidence. New comparison data must survive later guidance/generation/review writes, without creating a second storage mechanism or invalidating old records.
- The first planning test invocation omitted `--experimental-test-module-mocks`: `comparison-outcome.test.ts` stopped at `mock.module`, not a product assertion. The corrected prepared command passed all 111 tests. This is command-preparation evidence, not a product regression or a TDD Red.

## Decision Log

- Decision: Plan only M5-03; preserve M5-02 calculation semantics and M5-04's separate checkpoint. Rationale: the missing capability is durable, truthful presentation, not another comparator or evaluation system. Date/author: 2026-09-19 / primary.
- Decision: Reserve G for exact persistence/publication/readback literals before behavioral preflight. Rationale: serialization, identity, failed writes and late completion cross existing integrity boundaries; guessing these inside Green would bypass the workflow. No option is selected here. Date/author: 2026-09-19 / primary.
- Decision: Reuse the current Results hierarchy and rule-evidence components, with a purpose-named comparison detail owner. Rationale: a run-level comparison remains visible for zero later Findings; proposal/review remain separate context. The frontend-quality skill supplies reuse and browser-proof discipline, not new product scope. Date/author: 2026-09-19 / primary.

## Outcomes & Retrospective

Planning is complete with independent readiness PASS. The project has a verified internal comparison engine but no persisted or visible comparison. No M5-03 runtime outcome is claimed. The existing scan, retrieval, generation and review implementations and their bounded historical evidence remain unchanged; no provider or capacity observation was repeated. M5-03 remains In progress, awaiting separate execution authorization and G acceptance.

## Purpose / Big Picture

After implementation, a user who intentionally rescans any retained baseline Finding can inspect the saved comparison in the later Results: pair comparability, baseline evidence, a uniquely matched later target when available, the conservative outcome, rationale, limitations and non-blocking follow-up. Failure to calculate or save comparison is distinguishable from scan failure and cannot masquerade as a saved result. Already persisted comparison evidence remains inspectable with a broken-lineage limitation after baseline deletion, without recomputation or a hidden baseline copy.

This task implements that storage/API/UI capability and verifies its own boundaries. M5-04 separately demonstrates the complete milestone matrix and bounded public-page behavior; it is not selected or completed here.

## Context and Orientation

### Readiness and authority

The [authority map](../README.md#authority-and-status-map), [project requirements](../PROJECT_REQUIREMENTS.md#document-status), and [roadmap authority-location key](../DEVELOPMENT_ROADMAP.md#authority-location-key) control interpretation. Applicable Must rows are Accepted; [OD-025](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-025--development-authorization-and-roadmap-governance) permits exact-task development only after selection. [OD-026](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-026--defer-user-facing-retained-run-reopening) still defers reload restoration, deep links and retained-run browsing. [OD-027](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-027--simplify-analysis-and-results-presentation) preserves the concise Results hierarchy.

| Controlling source | Exact task obligation |
| --- | --- |
| [Rescan and comparison](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison), REQ-COMP-004–008 | Baseline reference/evidence; conditional after-evidence; conservative result; independent scan-only calculation; durable later aggregate; deletion limitation; no broad claims. REQ-COMP-001–003 continue to control any reused controlled cases. |
| [Evidence and provenance](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance), REQ-EVID-003/008/010/011 | Preserve immutable sources and siblings, minimized evidence, exact locator limitations, one versioned aggregate and no new domain IDs. |
| [Interface](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export), REQ-UX-002/004 | Distinct source layers and truthful canonical outcomes, not a second UI workflow. |
| [Application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#accessibility-of-a11y-evidence-lab), REQ-A11Y-001–004/010 and verification REQ-A11Y-006 | Keyboard, semantics, non-color distinctions, shared announcements and focus retention; desktop/narrow visual inspection. All 200% zoom tests remain Deferred; no manual screen-reader claim. |
| [Lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#accepted-minimal-information-model), parent execution, comparison and retention sections | Completed scan survives a downstream save failure; no unsaved-success claim; persisted comparison remains readable without its baseline; no reopen/history feature. |
| [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md#decision), [ADR-0011](../architecture/decisions/ADR-0011-typescript-as-initial-application-language.md#decision), [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md) | Single-file safe updates, closed runtime validation, strict typing, unprivileged React presentation. |
| [SPEC-006, SPEC-008](../specs/SPEC.feature), [HS-015](../specs/HARD_SPEC.feature), [BHV-06](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope) | Before/after evidence, context-only human work, visible limitations/reminders, no accessibility/conformance/causality claim. SPEC-007 also constrains aggregate preservation. |
| [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [worker procedure](../../.codex/execplan-implementation-workflow.md), [guard](../../.codex/write-lease-guard.md) | Independent test/code ownership, preflight, sequential guarded writes, fresh risk review, honest evidence and closure. |

The [evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) preserves RD-003's six states, M3-01's definition and references, and the [M5-02 companion](../../evaluation/m502-comparison-v1.json). No frozen content, expectations, directed pair or profile is revised. Arithmetic contrast vectors and reverse binary evaluation remain policy-only, never genuine scans or persisted public binary regression. M2-02 and M3-03 capacity gates are Complete; their observations are configuration-specific and not repeated here.

### Current implementation and responsibility map

`src/server/comparison/comparison-contract.ts` owns the internal result and input readers; `compare-finding.ts`, `scan-pair.ts`, `target-correlation.ts` and `finding-outcome.ts` own deterministic policy. `local-service/rescan-operation.ts::prepareRescan` captures the validated baseline. `rescan-comparison.ts::executeRescanComparison` consumes operation-local candidates, releases them and suppresses comparison success on failed publication/stop. `service.ts` owns composition and reservation. `scan-operation.ts` owns terminal scan publication, not a second downstream lifecycle.

`domain/run-contract/run-types.ts` and `run-validation.ts` own the closed aggregate. `persistence/run-repository.ts` owns staged safe writes and the rename commit point; its `run-transition.ts` and `selected-finding-transition.ts` constrain updates. `local-service/rescan-api.ts` frames rescan responses; `loopback-api.ts` and `service.ts::readRun` serve validated reads. No comparison update method or persisted-result reader exists.

The browser uses `rescan-transport.ts`, `rescan-request.ts` and `rescan-admission.ts` to correlate one submitted intent. `App.tsx` owns shared run/selection, immediate baseline preview, request ownership and one live-status region. `components/results/ResultsSection.tsx` composes Results; `ResultDetail.tsx` owns selected evidence; `RuleEvidence.tsx` and `resultPresentation.ts` format retained facts. `IntentionalRescanForm.tsx` owns admission controls and status. `main.tsx` is composition only. Preserve these boundaries rather than placing validation, persistence or a new detail region inside App.

## Scope and Non-Goals

Include one intentional rescan's comparison in its later aggregate, strict read/update validation, truthful service/client transport, missing-baseline inspection, and a bounded comparison region with before/after evidence and accessible feedback. Old runs without comparison stay readable without migration. Preserve baseline and later source collections and every existing downstream Finding value; an unchanged comparison must survive later selected-Finding updates.

Exclude new comparison rules, fuzzy correlation, additional positive archives, page/DOM diff, independent comparison IDs/files, history/version graphs, schema frameworks, generic transactions, databases, polling/monitoring, auto-retry, reload restoration, arbitrary pair selection, charts, scores, batch actions, exports, new dependencies and broad structural refactors. No provider invocation, retrieval, model acquisition, actual public target scan, mutation/deletion of original retained runs, commit or push is part of this planning request or the proposed controlled verification route. Do not relabel AI proposals or human decisions as evidence of remediation success.

## Plan of Work

### G — Freeze task-owned literals and command effects

After execution authorization, refresh current HEAD, status, active-lease absence, runtime, protected inputs and the actual affected source/test/configuration identities. Historical HEAD in M503-ENTRY-01 is provenance, never a mandatory future checkout or dirty-path condition. An intentional plan commit does not invalidate execution; unexplained drift still requires reconciliation.

Complete the R3 contract below before A preflight. Freeze the smallest closed persisted representation, cardinality, allowed historical variant, baseline/later relationship checks, permissible copied baseline facts, unique-incomplete representation, non-failing observation, delta/reason/limitation validation and exact mutation rules. Preserve old format readability; choose no migration framework. Resolve the acyclic dependency boundary: `validateRun` must not import a comparator/input reader that calls `validateRun` recursively. Any shared extraction is a leaf value/reader responsibility with demonstrated consumers, not a generic utilities layer.

Freeze publication sequencing, failure categories, commit truth, service reservation/release, postcommit abort/shutdown, and compare-save failure handling. Explicitly distinguish a saved completed scan, a saved comparison, an unsaved comparison and unknown transport outcome. Resolve baseline availability at read/action boundaries, including not-found versus invalid/unreadable, stale captured previews, deletion during execution, and preventing use of a broken-lineage comparison as a new baseline. Do not make baseline availability a new deterministic outcome or recompute saved classification during display.

Freeze exact HTTP/readback and client contracts, unchanged intent correlation, state ownership, error/announcement wording, source-layer context and the accepted C reuse audit. Determine how a completed result with zero later Findings exposes comparison and how legitimate later downstream updates preserve it. Complete the command/effects slots before any dependent lease; no worker invents binding commands or schema decisions.

### Shared ownership, attempts and acceptance

A–C are behavior-bearing, TDD Applicable. Each uses one read-only `test_worker` preflight, then existing covered evidence, a passing characterization, or one coherent Red for the confirmed missing/regressed contract. PARTIAL is narrowed by the primary; UNKNOWN/CONFLICTING stops. Apply ADR-0024's first-module exception only to the exact absent callable after proving the runner: all behavioral tests still must execute unchanged in Green. Never fabricate Red from a missing flag or setup failure.

Primary projects each slice into [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), freezes exact filenames within the envelopes below, and opens/closes one exact [lease](../../.codex/write-lease-guard.md) for every worker write turn. Only one writer is active; test and Green roles remain separate. Primary documentation/authority/guard maintenance occurs between leases. All accepted tests are forbidden to Green; all production paths are forbidden to Red. Workers cannot edit documentation/evaluation authorities or Git metadata.

Each unchanged role/phase chain allows attempt 1, ordinary correction 2 and conditional final correction 3 only with the recorded evidence and predecessor required by the procedure. One review correction loop per slice; two repeated identical failures without new evidence, two no-diff write handoffs, unsuccessful attempt 3, binding-field changes or exhausted allowance stop for triage. New IDs/agents never reset budgets. Retire writers at the slice barrier. Evidence reuse requires exact command, cwd, relevant-tree and environment identity plus guard-backed no drift; mutable external checks are Non-reusable unless isolated state is pinned. Inspect actual diff, terminal receipt, test relevance and `RETAINED`/`REFACTORED`/`RECONCILE` cohesion before acceptance.

### A — Closed durable comparison and aggregate transition

One indivisible outcome: the repository can validate, save and read a permitted comparison on the already completed later run, preserving both source records and every sibling/downstream field, or retain the last valid aggregate on failure. Prerequisite G accepted. Test owner `test_worker`; implementation owner `code_worker`; S3 for custom serialization, integrity and recovery. Authorities: REQ-COMP-004/006–008, REQ-EVID-003/008/010/011, lifecycle and ADR-0021/0011.

Production envelope: extend `src/server/domain/run-contract/run-types.ts`, `run-validation.ts`, `src/server/persistence/run-repository.ts`, its `contracts.ts`, `run-transition.ts`, `selected-finding-transition.ts`; bounded CREATE of purpose-named comparison reader/transition modules under those existing roots. Reuse existing descriptor/value readers and safe-write/expected-current checks. A leaf separation from `src/server/comparison/comparison-contract.ts` is permitted only as frozen by G to avoid a dependency cycle; calculation semantics are protected. Domain readers have no filesystem/browser dependency; repository depends on domain validation, never client code. No transaction service, unsafe cast or loose optional-object escape hatch.

Test envelope: `tests/run-contract.test.ts`, `tests/run-repository.test.ts`, `tests/review-repository.test.ts`, bounded new `tests/comparison-persistence.test.ts` and task-specific helper only if current fixtures cannot express the contract. Cover closed unions, references, invalid numeric/delta/evidence combinations, malformed keys/getters, baseline snapshot minimization, old-record reads, one permitted append and rejection of overwrite, downstream preservation, stale expected record, failed write/rename and truthful commit boundary. G freezes exact focused command. Advance after unchanged Green tests, independent strict check, relevant transition regressions and fresh critical PASS.

### B — Truthful service publication, readback and client admission

One indivisible outcome: the intentional rescan returns a truthful durable comparison or bounded comparison failure through the existing application boundary, and the client admits only its captured run/Finding intent. Prerequisite A accepted. Test owner `test_worker`; implementation owner `code_worker`; S3 for lifetime, identity and late publication. Authorities: A plus REQ-UX-004, lifecycle parent execution and deletion boundary, ADR-0012.

Production envelope: extend `src/server/service.ts`, `local-service/rescan-comparison.ts`, `rescan-operation.ts`, `rescan-api.ts`, `contracts.ts`, `loopback-api.ts`, `scan-operation.ts`/`scan-run-records.ts` only if G identifies a required terminal handoff, and `src/client/rescan-admission.ts`, `rescan-request.ts`, `rescan-transport.ts`, `run-admission.ts`. Bounded CREATE of purpose-named service comparison-publication/lineage and client comparison-admission modules when needed; service coordinates domain result → repository → response; client validates response, never calculates or writes comparison. `main.tsx` may wire a callback, not absorb domain behavior. Exact paths must be frozen in G and the packet.

Test envelope: `tests/rescan-service.test.ts`, `rescan-api.test.ts`, `rescan-comparison.test.ts`, `rescan-admission.test.ts`, `local-service.test.ts`, and bounded new `tests/comparison-service.test.ts` / `comparison-admission.test.ts` only for distinct current contracts. Verify save failure after scan success, response/disk identity, stopped/aborted/late completions, concurrent rejection, selected identity, wrong/foreign/stale/malformed responses, historical no-comparison reads, baseline missing/invalid/unreadable and disabled recomputation/new-comparison use. Preserve no-call behavior and transient candidate disposal. Update old comparison-exclusion assertions only to the accepted nested field, not to allow candidate or raw payload leakage. Advance after focused tests, strict/client build, preserved A evidence and fresh critical PASS.

### C — Accessible comparison in the active Results

One indivisible outcome: the user can inspect the active later run's truthful comparison independent of later Finding selection, with all task-owned evidence/context and predictable navigation. Prerequisite B accepted. Test owner `test_worker`; implementation owner `frontend_code_worker`; `frontend-visual` profile; S2 unless actual identity/concurrency changes trigger S3. Use the same risk reviewer for visual evidence, not an extra panel. Authorities: REQ-COMP-004–008, REQ-UX-002/004, REQ-A11Y-001–004/010/006, SPEC-006/008, HS-015, accepted presentation and [frontend-quality](../../.agents/skills/frontend-quality/SKILL.md).

Planning reuse audit `M503-UI-01` (primary must refresh/accept in G before preflight): EXTEND `App.tsx` only for shared coordination and existing live announcements; EXTEND `ResultsSection.tsx` to compose a distinct comparison region outside selected `ResultDetail`; REUSE_AS_IS `FindingsPanel.tsx`, existing list semantics and baseline/later navigation where the new contract requires no change; EXTEND `IntentionalRescanForm.tsx` status/availability only as B's contract requires. CREATE `components/results/ComparisonDetail.tsx` for outcome/rationale/limitations and `comparisonPresentation.ts` for a pure view projection. REUSE `RuleEvidence.tsx` and formatting; EXTRACT_LOCAL a narrow evidence-only projection only if positive observations cannot fit without falsely becoming Findings. Freeze its exact path before C. EXTEND `styles.css` only for wrapping, evidence layout and focus using existing tokens. No new hook solely to shorten App, generic component kit, new theme or dependency. `ResultDetail.tsx` may expose existing context through bounded composition, not own comparison lifetime.

Use a named comparison heading, labeled Before/After facts and explicit unavailable-after explanation. Show pair mismatch without target correlation; render a saved unique pass as observation, not a Finding. Keep rule-specific delta distinct from a page score. Existing AI originals, edited proposals and human decisions remain independently labeled context when available; do not copy them into comparison or require them to exist. Follow-up and limitations stay visible and non-blocking. No checked-off manual-check record or remediation-causality wording.

Required state matrix: absent historical comparison; saved resolved including zero later Findings; persistent; contrast improved/regressed; inconclusive unavailable/ambiguous/native-incomplete; not comparable; calculation/save failure with completed scan; transport-unknown; broken lineage; immediate baseline preview and return. Use component/contract tests for the full semantic matrix, not a Cartesian browser matrix. Real-browser inspection covers a saved comparison with Before/After, unavailable-after/broken-lineage limitation, and focus during settlement/navigation at 1366×900 and 390×844. Automate keyboard, labels/headings, live-status semantics, no focus theft, predictable return, inert strings and non-color distinctions. No 200% tests or spoken-output claims.

Test envelope: `tests/intentional-rescan-ui.test.ts`, bounded new `tests/comparison-ui.test.ts`, existing UI helpers only where directly reused. G/C packet freezes exact automation states, ports, build/browser identities, screenshots of synthetic app states only, and cleanup. Advance after tests, strict/build, actual-browser evidence, primary cohesion/reuse acceptance and fresh S2 or triggered S3 review.

### D — Bounded real integration and closure

Use the smallest existing scanner/service/disk/browser harness to prove one directed frozen failing→corrected case through real scan normalization, rescan, saved comparison, validated readback and browser presentation. Prefer extending `tests/rescan-integration.test.ts` with its actual-service lane, plus C's real-browser lane; a mocked HTTP reply alone cannot prove new persistence wiring. G freezes the exact case from the M5-02 companion and the actual source/build/run identities. Distinguish policy-only state fixtures from native observations. No real provider or internet target is necessary.

Verify broken-lineage handling using only exact task-owned synthetic directories/read fixtures; originals are never deleted. The later comparison remains unchanged and viewable, limitations become truthful, and attempts to recompute/use that broken-lineage comparison are rejected. M5-04 retains its separate full milestone/deletion/public-page checkpoint; no claim that this bounded proof closes it.

If new executable verification is needed, `test_worker` owns it under an evidence lease after read-only preflight; already implemented behavior receives characterization, not fabricated Red. No production scope is assigned to D: defects return to the owning slice within remaining budgets. TDD Not applicable to read-only/manual inspection and documentation; replacement evidence is hashes, validated disk reads, browser observations and deterministic document checks. One evidence assignment chain uses the shared attempts ceiling. Final review is by a fresh `critical_reviewer` different from slice reviewers, with one supported integrated correction loop subject to remaining implementation budgets.

Run the complete authoritative suite once at closure, independent strict checking and the client build; audit all affected helpers/mocks/skips/focused markers. Reconcile README capability/API/commands, lifecycle's internal-only comparison statement, the accepted presentation extension and UI index, documentation task routing when changed, roadmap, this plan and progress/index owners. Read complete target documents before material edits. No requirement or ADR semantic change is expected. Archive only after Verification and the documentation gate pass; otherwise M5-03 stays In progress with an exact next boundary.

## Decision Review Contract

`M503-G` is future decision-oriented R3: custom serialized comparison identity, immutable data, publication/recovery and asynchronous response ownership. The artifact is the primary-authored literal/command section in this plan, not another report or ADR. Primary owns ordinary implementation literals; changed requirements, new durable architecture or expanded external effects require the owner before dependent work. Planning merely reserves this barrier and selects no option.

One bounded non-ranking discovery may identify the existing implementation alternatives. Then freeze the candidate set and dimensions before comparison: minimally extending the internal result versus a narrow durable projection; staged comparison publication after scan completion versus a bounded coordinated publication arrangement compatible with lifecycle failure truth; extending existing rescan/read responses versus a narrowly necessary active-run comparison-read boundary. These are candidate categories, not accepted designs. Exclude any candidate requiring hidden copies, a history API, new transaction service, candidate archives or changed M5-02 classification. Compare direct reuse/placement, invariant preservation, failure truth, deletion behavior and observable UI support—not speculative flexibility.

Budget: two `critical_researcher` reports, one for durable representation/update integrity and one for operation/readback/lineage/client ownership; each one bounded follow-up only if needed. Primary supplies [Research Assignment Capsule v1](../../.codex/README.md#research-assignment-capsule-v1) with exact authorities and shared evidence. One mandatory `decision_analyst` synthesis plus one supported correction returns DRAFT READY, RETURN FOR RESEARCH or OWNER DIRECTION. Fresh `critical_research_reviewer` pre-draft checkpoint, at most one supported outline correction; then primary authors literals and a different fresh `critical_research_reviewer` reviews the complete artifact. At most two final-artifact correction cycles, with the entire invariant packet rerun after every R3 correction. No optional drafter or extra research panel is planned. Same decisive gap twice, two unsupported RETURN FOR RESEARCH results, exhausted budget or material scope change stops at the existing reconciliation/owner boundary.

Each invariant starts NOT RUN for M5-03; G records decide-now literals separately from later implementation proof. Both G reviewers own decision coverage, slice reviewers own relevant execution coverage, and the different D reviewer owns integrated coverage.

| ID | Trigger / witness | Required result and proof owner |
| --- | --- | --- |
| I1 | Artifact, task status, all command slots | Complete contract, honest unexecuted states, unchanged authority; G reviews and primary closure. |
| I2 | Closed JSON and foreign/malformed relationship vectors | Exact baseline/later/Finding binding, minimized evidence, no independent identity or hidden copy, old records readable; A critical review. |
| I3 | All pair/match branches, absent locator/ambiguous target | No invented after target; no correlation for mismatch; one real minimized positive only for unique pass; public binary regression rejected; A/B reviews. |
| I4 | Stale update, failed write/rename, success then shutdown | Last valid scan/aggregate preserved, durable response matches commit, no unsaved success or owner overlap; A/B critical reviews. |
| I5 | Later guidance/generation/review update and any baseline downstream state | Comparison and both scan collections unchanged; originals/reviews/siblings preserved; human work cannot gate/calibrate comparison; A/B reviews. |
| I6 | Missing/invalid/unreadable/deleted baseline and stale preview | Saved comparison remains inspectable with truthful limitation; no hidden reconstruction, recomputation or new comparison from broken lineage; B/D critical reviews. |
| I7 | Late/foreign response, unknown outcome, duplicate activation | Captured identity, truthful failure, no unsafe release/retry or overwrite of active results; B/C reviews. |
| I8 | Zero later Findings, before/after and context states, keyboard/navigation | Comparison still visible; distinct sources; shared announcements without focus loss; readable desktop/narrow evidence; C reviewer. |
| I9 | Frozen manifests/fixtures, native versus policy-only tests | Original bytes/profiles preserved, no provider/public call, exact isolated proof and cleanup; D critical review. |
| I10 | Diff/leases, test relevance, documentation and prohibitions | Cohesive modules, unchanged accepted tests during Green, full suite/strict/build, truthful limitations and status; all slice reviewers and D. |

## Concrete Steps

All commands run from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab` in PowerShell 7. Use the complete current [README preparation](../../README.md#development-command-preparation), dot-sourced in each new session. It defines `$m105Node`, `Invoke-M105Command` and ordinary-path/scratch checks. Do not replay archived acquisition or cleanup commands. No dependency restore, lock mutation or installation is planned.

Read-only entry:

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'Git status failed' }
git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'HEAD inspection failed' }
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') { throw 'Reconcile active lease first' }
Get-FileHash -Algorithm SHA256 -LiteralPath 'evaluation/rd003-scan-v1.json','evaluation/m301-generation-v1.json','evaluation/m502-comparison-v1.json'
```

After maintained preparation, current pure baseline command:

```powershell
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Pinned Node required' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/run-contract.test.ts tests/comparison-pair.test.ts tests/comparison-outcome.test.ts tests/rescan-admission.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Focused baseline failed' }
}
```

Expected at planning: strict success, 111 tests pass. Counts may grow during implementation; they are not hard-coded future gates. Preparation disables compilation caching and restores environment. These tests use controlled in-memory/module-mock inputs, not live public scans or model operations.

Future commands become executable only when G records exact values and primary verifies the complete caller, syntax, failure propagation and path/effect containment. Slots cannot be left implicit in a worker packet:

| Slot | Must freeze before dependent lease or verification |
| --- | --- |
| A/B/C focused commands | Exact test list, module-mock/timeout flags, cwd, scratch/cache effects, expected Red/characterization and Green, strict compiler command; new filenames are future until created. |
| Build / full suite | Existing Vite `node_modules/vite/bin/vite.js build --configLoader native` through prepared Node; exact current README test inventories plus new tests exactly once; independent strict; build writes only current `dist/client`. |
| Real integration / browser | Existing pinned Chromium, exact test/caller, controlled companion pair/input hashes, build identity, local service/port ownership, allowed intercepted origin, no unintended outbound traffic, synthetic run IDs/root, browser profile/temp roots and completion conditions. |
| Baseline availability / deletion proof | Exact task-owned isolated baseline/later paths, before/after hashes, validated readback and refusal command, no original-run target, ordinary-path and containment checks immediately before deletion; whether evidence is retained or removed. |
| Preparation / cleanup | Fresh child directory names, ordinary/non-reparse ancestors, Git-ignore/untracked check before write, expected existing/empty inventory, generated dependency location None (no acquisition), generated build/test outputs, owned process/tab handles, shutdown-before-cleanup and exact removal targets. Shared scratch parents, installed runtimes and original data are preserved. |
| Packet / evidence | Exact worker path lease, accepted/protected test hashes, command/environment fingerprints, baseline HEAD plus expected current dirty paths, expected structured results and stop-before-next-effect behavior. Never compare receipts to the historical planning HEAD unconditionally. |

No cleanup command may recursively target a workspace, `data/runs`, shared temp parent or runtime root. A permission denial stops the affected effect; use the permitted approval route, never repeated identical acquisition attempts or another tool to bypass it.

## Validation and Acceptance

M5-03 passes only when A–C's accepted preflight/Red-or-characterization, separate Green, unchanged test boundary, terminal leases and risk reviews are recorded, plus D's current integration and closure proof. The primary independently accepts actual diffs and evidence, not only worker reports. No implementation check is complete at planning.

Acceptance covers I1–I10 and every roadmap Verification clause. Inspect actual persisted JSON, runtime-validated readback and rendered result; a type assertion, screenshot alone, successful rename alone or internal comparison return alone is insufficient. Non-matching and not-comparable variants cannot fabricate after evidence. Completed scan counts and valid-zero presentation survive comparison failure. Existing original proposal, edited human work and decisions remain context, and limitations/follow-up remain visible even without them. Saved comparison is preserved by later workflow updates and baseline loss does not erase it.

The smallest real proof is the directed controlled scan→service→single-file comparison→validated API→browser lane in D, with separate semantic adverse tests. Automated UI checks cover accessibility, keyboard, focus and live-status semantics; manual inspection covers readable desktop/narrow layout and visible focus. Keep exact source, command, runtime/browser/build, run identities, state and viewport with the evidence. This is neither spoken-output proof nor public-site qualification.

At closure run the complete authoritative suite, independent strict typecheck, production build, test relevance/cohesion audit and [documentation gate](../README.md#task-closure-documentation-gate), including `git diff --check`. Do not mark Complete or archive until the different final critical review and all task gates pass. The final report states remaining limitations and explicit documentation impact.

## Idempotence and Recovery

Read-only identity/format checks are repeatable. Tests may be repeated only against their prepared isolated state; real browser/filesystem evidence is otherwise Non-reusable. Never retry an unknown save or intentional rescan automatically. Inspect the last validated aggregate through the service boundary, reconcile the operation owner and record what is known without restoring a consumed capability. A failure after completed scan publication cannot rewrite that parent as failed or remove its evidence.

After an unexpected diff, guard failure or worker stop, close the affected lease, preserve all user/peer work and retained evidence, inspect actual changed paths and remaining allowance, and issue a fresh packet only when reconciled. Primary documentation changes wait until no lease is active. A revised test invalidates its accepted Red/characterization; reaccept before Green. A material G change invalidates its decision review and affected implementation evidence. No hard reset, broad deletion, status laundering or new ID to reset an attempt is allowed.

Clean up only named task-owned processes, browser contexts and isolated outputs after retaining decisive content-safe evidence. Resolve every absolute deletion target inside the named workspace child and reject aliases/reparse points. Never remove original data, installed browser/model resources, frozen packages or shared scratch parents. Baseline-deletion proof is an explicit synthetic effect, not permission to delete user evidence. If a new architectural/authority choice or exhausted budget blocks dependent work, finish unaffected authorized work and request the exact missing direction.

## Artifacts and Notes

### M503-ENTRY-01 — Planning evidence

2026-09-19: initial worktree clean at `b4f76885a4e146bd6c977866847e61dd7d759869`, with no active lease. Roadmap and M502-FINAL-01 agree: 22 Complete, 6 Not started before this planning selection. M5-02's 805-test/40-file strict/build/native integration and final critical PASS are historical closure evidence, not rerun claims. Current prepared Node is v24.20.0; fresh independent strict TypeScript and the corrected four-file baseline command above pass all 111 tests, zero failures/skips. The initial missing-module-mock-flag failure is preserved in Surprises & Discoveries. No source changes were needed.

Current SHA-256: RD-003 manifest `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`; M3-01 manifest `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; M5-02 companion `8a44166b40f700b5dc35a3290b7a4958533c38fc454302d843499c576f43e0a8`. Read-only recursive path/SHA validation passes all 13 generation references and all 8 companion references; all six fixture files exactly equal RD-003's frozen content. The focused comparison tests also validate the companion and controlled binding.

Primary reviewed roadmap-wide status and routed authorities, frontend owners and the reuse audit. Read-only explorer `/root/m503_seams` mapped existing backend publication, schema, transition, API and test boundaries; no option selection or write was delegated. No dependency, browser, scan, model, original aggregate or Git metadata mutation occurred. Planning artifacts are only this plan, its progress summary, roadmap and the two indexes. Preserve this entry as historical identity when execution refreshes HEAD.

### M503-PLAN-01 — Accepted planning readiness

Fresh `critical_reviewer` `/root/m503_plan_review` reviewed the complete plan, five-path documentation diff and actual schema, repository, service, client-admission and Results seams. Verdict: **PASS**, with no Blocker, Major or Minor. Its independently checked HEAD, active-lease absence, unchanged executable/configuration surfaces and three manifest identities agree with M503-ENTRY-01. The reviewed semantic plan SHA-256 was `3e38ec95528113e1f1ee64d2eb6ba4c4ff2a66c3f9519fb552b46a61669cacbf`; subsequent edits only record this verdict and reconcile pending-review statements, without changing the contract. The downstream-consumer check confirms existing guidance/generation/review client admission preserves the rest of the aggregate while permitting only the selected Finding change.

Primary accepts planning readiness, not implementation or G decisions. Exact serialized/publication/lineage/response literals and runtime/browser correctness remain unproved. Documentation validation passes the five changed/new documents: local links/anchors, all sixteen required sections, two parsed PowerShell blocks, UTF-8 without BOM, final newlines, no trailing whitespace, consistent 22 Complete / 1 In progress / 5 Not started statuses and `git diff --check`. No application or evaluation input changed, and no commit or push occurred.

Documentation impact: Added this ExecPlan and its concise progress record; updated the roadmap, plan index and progress index for planning-only activation. Requirements, ADRs, current implementation summaries and frozen evidence remain unchanged. The frontend-quality skill shaped the reuse audit and bounded accessible browser-proof obligations without introducing a new UI system.

## Interfaces and Dependencies

Retain the current pinned Node/TypeScript/React/Playwright/axe/Vite stack and single-file repository. Reuse M5-02's internal `ComparisonResult` semantics and comparison policy; it is not yet a validated persisted or HTTP contract. G owns the exact nested representation, update/read interface, service outcome and browser admission extension. No new package, service, provider, public endpoint family or standalone comparison artifact is assumed. Browser code may share pure types/readers, never privileged I/O. Evidence-only leaf extraction may remove a real dependency cycle; hypothetical generalization is excluded.

## Revision Note

2026-09-19: created for owner-requested M5-03 planning after Complete M5-02. Recorded fresh verification, the transient-to-durable gap, gated literals/commands, three sequential worker-owned behavior slices, reuse-first accessible comparison and bounded integration. No implementation or later task selected.

2026-09-19: recorded fresh independent critical planning PASS without findings and reconciled living state, progress and documentation validation. Future execution authorization, G and all implementation gates remain required.
