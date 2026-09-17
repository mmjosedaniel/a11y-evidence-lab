# Compare one baseline Finding conservatively

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task and authority:** [M5-02](../DEVELOPMENT_ROADMAP.md#m5-02--apply-comparability-correlation-and-outcome-rules), selected for project-state review and planning only. Implementation, browser execution, run creation and external calls await separate execution authorization.
- **Latest evidence:** [M502-PLAN-01](#m502-plan-01--accepted-planning-readiness): independent critical PASS with no findings and five-document validation. M5-01 is Complete; no prerequisite is Blocked.
- **Gates and allowances:** [G](#g--freeze-comparison-and-handoff-literals) is unresolved; its research and all implementation budgets are unused. No execution acceptance is implied by planning checks.
- **Active lease:** None.
- **Next:** await owner execution authorization, then accept G, followed by sequential A–C and D closure. Use [commands](#concrete-steps), [invariants](#validation-and-acceptance) and [recovery](#idempotence-and-recovery). M5-03 is unselected.

## Progress

- [x] (2026-09-17 15:12Z) Review roadmap-wide status, M5-01 closure, comparison authorities and current service/scanner seams; strict TypeScript and 96 focused tests pass, with frozen inputs unchanged. See M502-ENTRY-01.
- [x] (2026-09-17 15:25Z) Accept independent critical planning PASS with no findings and five-document validation; M502-PLAN-01. No implementation or target/model operation occurred.
- [ ] On execution authorization, accept G's complete literal, comparison-input and command contract.
- [ ] A: validate comparison inputs and apply the pair gate before correlation.
- [ ] B: correlate one target and produce the bounded evidence outcome.
- [ ] C: consume the real rescan handoff within its operation lifetime.
- [ ] D: accept complete verification, different fresh integrated review and documentation closure; only then Complete/archive.

## Surprises & Discoveries

- [M5-01 closure](completed/m5-01-intentional-rescan.md#m501-final-01--integrated-review-and-task-closure) records 776 passing tests across 37 files, real controlled scanner/service/disk integration, fresh critical PASS and cleanup. The current clean checkout is committed at `3053b049e43ca22d161f954d81ff4505ca4711d7`; its archive's uncommitted-at-closure statement remains historical.
- `service.ts::rescanFinding` currently unwraps `(await executeRescanScan(...)).run`, discarding candidates. `prepareRescan` returns only the running run and selected rule, not the validated baseline selection/context needed by comparison.
- Native candidates contain selected-rule **passes only**. Normalization preserves duplicate locators in violations, incomplete observations and passes. Uniqueness must be established across the relevant later collections, not by counting passes alone.
- The RD-003 manifest freezes six states and their native expectations, not a directed comparison-pair table. Its limitations deliberately leave the comparison-only vector with its requirement authority. G must freeze a minimal comparison definition without silently rewriting the evaluated scan or generation manifests.
- The common synthetic repository fixture contains duplicate image locators and a different scan profile from production defaults. It is useful adverse evidence, not automatically a unique comparable success case.

## Decision Log

- Decision: select M5-02 planning after Complete M5-01. Rationale: the exact owner request selects one dependency-ready task, not all M5. Date/author: 2026-09-17 / primary.
- Decision: keep this task at service/pure-calculation and transient integration boundaries. Rationale: [M5-03](../DEVELOPMENT_ROADMAP.md#m5-03--persist-and-present-comparison-evidence) explicitly owns durable comparison fields and visible presentation. Date/author: 2026-09-17 / primary.
- Decision: use existing normalized evidence, native fixtures and focused test mechanisms. Rationale: the accepted exact-match policy needs no dependency, registry, fuzzy matcher or new evaluation platform. Exact signatures and failure handling remain G decisions. Date/author: 2026-09-17 / primary.

## Outcomes & Retrospective

Planning is complete with independent critical readiness PASS and documentation validation; no comparison implementation or new scanner observation exists. Current prerequisite and focused checks pass. The plan separates malformed-source failure, pair mismatch and uncertain target evidence, and keeps scanner-fidelity evidence distinct from policy-only vectors. G acceptance and all implementation remain pending separate execution authorization.

## Purpose / Big Picture

The service will calculate a conservative comparison for the selected baseline Finding during its intentional later scan. It first establishes whether the complete source scans are comparable, then correlates at most one exact target, then returns bounded rationale and evidence. A missing later violation is never itself proof of resolution. A reviewer can observe the result through the internal comparison boundary and controlled tests; public display and persistence wait for M5-03. The M5 milestone's full user-visible outcome is not claimed by this task alone.

## Context and Orientation

The [authority map](../README.md#authority-and-status-map), [requirements semantics](../PROJECT_REQUIREMENTS.md), and [roadmap authority-location key](../DEVELOPMENT_ROADMAP.md#authority-location-key) control interpretation. Twenty-one RD/M1–M4/M5-01 tasks are Complete; activating this plan leaves one In progress and six Not started. Both capacity tasks are closed; their exact-configuration observations are not general support or model-quality evidence. The six fixed generation executions remain M6 work, not permission to repeat previous calls.

| Authority | M5-02 obligation |
| --- | --- |
| [Evidence and provenance](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance), REQ-EVID-008/010; [scanning](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), REQ-SCAN-005 | Reuse minimized allowlisted evidence; preserve unavailable facts and source collections; locator is correlation evidence, not identity. REQ-EVID-002 supplies controlled-fixture provenance. |
| [Rescan and comparison](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison), REQ-COMP-001–008 | Directed manifest-bound controlled pairs, public pair gate, exact unique correlation, native positive evidence, ordered contrast outcomes, downstream independence and prohibited-claim limits. Persistence/deletion presentation portions of 004/006 are M5-03/M5-04, not waived. |
| [Comparison lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#comparison-lifecycle), [repeated analysis](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#repeated-analysis-provider-change-and-rescan) | Two complete scans, separate pair and Finding dispositions, independent linked later run; proposal/review/manual judgment never determine the outcome. |
| [Evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), REQ-EVAL-004/005; [contrast vector](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#comparison-only-contrast-policy-vector); [BHV-06](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope) and [SPEC-006](../specs/SPEC.feature) | Preserve frozen observations; distinguish native scan cases from arithmetic and reversed binary policy-only evidence. Rerun affected cases against changed comparison code without relabeling history. |
| [ADR-0009](../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md), [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | Existing scanner, trusted developer target and one aggregate; no raw archive, new target-security system or alternate writer. |
| [M5-01 accepted contract and evidence](completed/m5-01-intentional-rescan.md) | Successful cleanup precedes candidate exposure; baseline linkage, reservations, terminal publication and response identity remain protected. |

All applicable MVP Must requirements and decisions are Accepted or explicitly Deferred. Ordinary task-owned literals may be resolved in G; a significant new architectural mechanism or changed requirement needs owner direction. The [comparison assessment](../architecture/candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md) is Proposed input, not authority for adopting every suggested field or rule.

Current boundaries: `src/server/local-service/rescan-operation.ts::prepareRescan` validates the retained baseline/Finding under service reservation; `src/server/scan/scan-page.ts::executeRescanScan` returns a frozen successful `{ run, candidates }` envelope after cleanup; `normalization/native-rule-evidence.ts::NativeCandidate` contains detached minimized pass facts with no Finding ID. `local-service/scan-operation.ts::startScanOperation` validates/publishes the terminal run. `domain/run-contract` readers validate durable records, but do not validate the transient candidate array or establish cross-run comparability. There is no comparison owner yet.

## Scope and Non-Goals

Include validated internal inputs/result, pair comparability, exact selected-target correlation, at most one constructed minimized positive observation, conservative outcome/rationale/limitations, a bounded controlled-evaluation binding and consumption of M5-01's live candidates. Keep a public-runtime baseline Finding contract separate from evaluation-only positive-baseline vectors.

Exclude comparison fields in `run.json`, repository comparison updates, HTTP comparison payloads/routes, client/UI changes, broken-lineage presentation, arbitrary retained-pair selection, history, fuzzy/AI matching, fingerprints, DOM diff, page-level scores, materiality/tolerance engines, `new` classification, remediation causality, independent comparison IDs, general pass archives, callbacks/registries for hypothetical consumers, new dependencies and M5-03/M5-04/M6 execution. No actual public scan, model call, acquisition or original-run mutation is selected. This nonvisual task does not use the frontend-quality overlay; a material rendered change requires replanning into its owning task.

## Plan of Work

Follow the [agent workflow](../../.codex/README.md), [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) and [write guard](../../.codex/write-lease-guard.md). Primary owns authority, G's research-derived writes, exact assignment packets, evidence acceptance, integration, status and closure. Research/review remain read-only. No ordinary production edits by the primary.

For each A–C slice use a separate persistent `test_worker` and `code_worker`, read-only preflight and sequential guarded Red/Green/optional Refactor. One active lease per worktree; all accepted test-owned paths are forbidden during Green. Primary plan/status maintenance occurs between terminally closed leases. Inspect actual diff, cohesion, command evidence and terminal receipt, not just reports. Each S3 slice needs fresh `critical_reviewer` acceptance before advancing. Record RETAINED, REFACTORED or RECONCILE after Green; rerun focused checks after actual refactor. No visual reviewer or frontend worker is needed.

Budget each unchanged writer role/phase chain at initial attempt plus one ordinary correction and one conditional final correction only with documented progress/new evidence under the procedure. One read-only preflight and one coherent Red/characterization boundary per slice; one review correction loop. Repeated decisive failure twice without new evidence, two no-diff handoffs, changed binding fields or exhausted allowances return to primary triage. Agents and IDs never renew budgets. Covered behavior reuses valid evidence; uncovered existing behavior receives passing characterization; missing/regressed behavior receives honest Red. The first-module exception requires its exact environment/missing-callable/complete-test conditions; no production stub or fake Red.

The smallest proof combines pure comparison tests with the existing scanner/rescan integration mechanism. Add only missing bounded tests and static input bindings; no separate runner or reporting framework. Read-only G dimensions may overlap; all source/test writes and browser/service verification remain sequential.

### G — Freeze comparison and handoff literals

**M502-G; R3; TDD: Not applicable.** None — no application-source responsibility changes. Replacement evidence: complete authority/source mapping, frozen literal and input contract, required research reviews and exact command/effect preparation. Resolve these before A preflight:

1. **Admitted sources and ordering.** Exact internal signatures, closed input/result/error shapes, selected baseline/Finding and later-run linkage, candidate envelope ownership, selected-rule/count/coverage consistency and reflection-safe validation. Invalid or noncompleted sources fail with no comparison, not `not comparable` or `inconclusive`. Required individual unavailable facts remain valid evidence and follow conservative classification. Do not weaken `validateRun` to admit policy vectors or unsupported profiles; profile mismatch witnesses must themselves be valid inputs or explicitly isolated policy-boundary tests.
2. **Pair key.** Map normalized requested and observed final page identity, exact rule profile, viewport, locale, browser/scanner, evidence policy, coverage prerequisites and applicable contrast measurement profile to existing fields and exact equality rules. Resolve readiness/timeout/other context relevance from authority; do not compare entire runs or include mode, timestamps, run/Finding IDs, application revision, proposal/review state or evidence values merely because they differ. Complete bucket counts may change between scans; completeness is not equality of violation/pass counts. Mismatched valid profiles produce a bounded pair-only rationale without invoking correlation. Unknown required provenance cannot become silent compatibility.
3. **Correlation and evidence.** Exact public rule/locator equality across later Findings, native incomplete observations and selected-rule passes; no order-based winner or deduplication. Freeze disposition for unavailable baseline locator, no match, duplicate/cross-bucket conflict and unique incomplete evidence. Do not claim a target was relocated when the data establish only no exact match. A unique incomplete match remains inconclusive, never a positive observation. Unmatched/ambiguous cases have no fabricated current target/after-evidence. Freeze the minimum rule-specific facts needed for a valid native pass observation, its context provenance and one-object maximum; no ID, generic pass archive or raw native payload.
4. **Outcome and result contract.** Pair mismatch has no per-Finding outcome or match section. Comparable binary failure-to-failure is persistent; binary runtime improved/regressed are impossible. Native pass plus unique match and complete coverage may resolve; absence or ratio arithmetic alone cannot. Contrast ordering uses retained measured minus expected ratio only for exact matched failures with identical measurement semantics and sufficient finite evidence. Freeze required measurements/checks, expected-threshold/font-profile relationships, numeric representation/equality and missing/conflicting evidence handling without inventing thresholds, rounding tolerances, color recomputation or an accessibility score. Result carries baseline references/evidence, only uniquely matched later evidence, bounded rationale, limitations and non-blocking follow-up wording; context never affects calculation.
5. **Controlled definition.** Freeze the exact three directed failing-to-corrected pairs using RD-003 scenario/rule/stable key/revision/state roles and input identities; reject undeclared directions or profile mismatches before controlled correlation. Stable keys stay in test/evaluation metadata, not product identities or locator substitutes. Define reused-failure persistence, missing/duplicate and drift witnesses explicitly. Reversed binary positive-to-violation and the accepted 3.54/4.00, expected-4.50 contrast vector are policy-only inputs, not scans, persisted runs or baseline Finding records. Share production classification logic; add no duplicate evaluation comparator. Select the smallest versioned task-owned companion definition necessary for REQ-COMP-001, with exact location and provenance before tests. Preserve both existing manifests, six fixture bytes and original observations; never retrofit directions into their historical bytes. Any material baseline change follows the evaluation authority and needs owner direction where its boundary is exceeded.
6. **Service/lifetime/failure boundary.** Freeze the minimal internal handoff carrying validated baseline selection and successful later envelope into comparison before candidates are discarded. Return a bounded internal calculation result for M5-03 to consume later; keep current HTTP/run outputs unchanged and do not add a debug endpoint, retained service cache or test-only production observer. Define when this internal result is authoritative relative to terminal run validation, publication, shutdown and failed writes. A failed/late/cancelled/cleanup-uncertain operation exposes no successful comparison. A comparison validation/implementation exception must not invent scanner failure or cleanup uncertainty; bind exact existing-compatible outward failure behavior and truthful preserved scan state before coding. If that requires changing an Accepted lifecycle or M5-03 scope, stop for owner direction rather than hiding it as a literal.
7. **Commands/effects.** Freeze precise A/B/C focused commands, current full suite/build/strict commands, controlled browser inputs, finite deadlines, scratch/evidence paths, allowed generated outputs and cleanup before their applicable effect. Future filenames below are candidates until exact packets bind them; workers cannot invent scope after review.

### A — Validate inputs and gate the scan pair

**M502-A; S3; TDD applicable.** Observable contract: admitted complete sources produce either comparable context for downstream correlation or a pair-only mismatch; malformed/noncompleted sources fail. Preflight targets existing `tests/run-contract.test.ts`, `tests/scan-normalization.test.ts` and a candidate `tests/comparison-pair.test.ts`.

Bounded creation under `src/server/comparison/`: purpose-owned input/result types and validation plus `scan-pair.ts` (exact filenames frozen by G). Reuse domain readers and validated scan/fact types. If access to an existing private evidence reader is necessary, permit only its cohesive export/local extraction in `src/server/domain/run-contract/`, with unchanged behavior and regression coverage; no new general validation layer. Dependency: comparison → existing pure domain readers/types; never domain → scanner/service/filesystem. Pair gate owns context equality, not correlation or I/O. Test-owned helpers belong under `tests/helpers/` only as immediately needed.

Prove every material dimension, valid count differences, provider/downstream independence, unavailable-versus-malformed facts, closed input validation and zero correlation calls on mismatch. Protect source/test baselines and forbid client, repository mutation, dependencies and frozen artifacts. Accept strict/focused results, cohesive diff and fresh critical PASS before B.

### B — Correlate and classify one selected target

**M502-B; S3; TDD applicable.** Observable contract: A's comparable pair yields one conservative evidence result without mutating either source. `test_worker` owns candidate `tests/comparison-outcome.test.ts`, the declared controlled input bindings and necessary pure helpers; `code_worker` owns exact correlation, native-positive projection, rule-specific outcome and bounded rationale modules in `src/server/comparison/`. Primary owns research-derived companion definition/documentation, between leases; workers consume it, not choose its meaning.

Separate current responsibilities: `target-correlation.ts` counts exact matches over the complete relevant later collections; `finding-outcome.ts` classifies native binary/contrast evidence; `compare-finding.ts` composes A → correlation → outcome/result. Keep a small positive-observation projection with its evidence owner rather than a generic registry. Exact module names may be reconciled in G for actual cohesion; no per-field wrappers or one giant comparison utility. The same classification functions serve policy-only tests; their positive-baseline adapters remain test-only and cannot mint public runtime Finding IDs.

Tests cover unique pass resolution, unique failing binary persistence, higher/equal/lower failing contrast margins, missing required evidence, incomparable profiles before correlation, missing/withheld/changed locators, duplicate pass/failure/incomplete conflicts, unique incomplete, target removal, unrelated later Findings and source immutability. Use frozen state provenance for native evidence and clearly labeled policy vectors for arithmetic/reversed binary regression. No inference of native buckets from ratios. Keep rationale deterministic, bounded, content-safe and free of certification/causality claims. Fresh S3 review, focused cases and independent strict gate C.

### C — Consume the real transient rescan boundary

**M502-C; S3; TDD applicable.** Observable contract: the production rescan path invokes the accepted comparison policy for its selected baseline and complete later scan while candidates are live, without leaking the candidate collection or persisting/publishing comparison data in M5-02.

Extend `local-service/rescan-operation.ts::prepareRescan` only for the bounded internal validated baseline selection. Create a cohesive `local-service/rescan-comparison.ts` if needed to own scanner-envelope admission and comparison invocation; `service.ts` remains reservation/composition. `local-service/scan-operation.ts` retains terminal validation/publication and settled-capability retirement. Permit only the exact internal executor/type adaptations G requires; do not put classification in those coordination modules or modify scanner capture/profile merely to fit comparisons. Direction: reserved service → admitted baseline → real scanner → pure comparison → existing terminal publication. No provider, client or second writer edge.

Preflight targets `tests/rescan-service.test.ts`, `tests/scan-page.test.ts`, `tests/rescan-integration.test.ts` and candidate `tests/rescan-comparison.test.ts`. Reuse current harnesses for controlled real Playwright/axe evidence from the six frozen states; assert actual production comparison results at the internal boundary without a production instrumentation framework. Preserve existing recursive HTTP/disk no-candidate/no-comparison witnesses. Test failed/invalid envelopes, selected-rule/coverage mismatch, comparison exceptions, reentrant stop, deadlines, cleanup uncertainty and failed terminal publication; no stale success escapes, source bytes stay identical and successful durable rescan remains usable as before. A test double alone cannot prove real scanner-to-comparison integration. Obtain fresh critical review before D.

### D — Verify and close the task

**M502-D; primary integration; TDD: Not applicable.** None — no application-source responsibility changes. Replacement evidence is complete accepted implementation and controlled integration proof plus task-wide regression, invariant review and documentation reconciliation.

Run the current complete authoritative suite including new accepted tests, independent strict TypeScript and client build. Reuse identity-matched C integration evidence; repeat only on drift or missing/contradictory/risk-critical coverage. Inspect test relevance, skipped/focused markers, all source changes and owned resource cleanup. Obtain a different fresh integrated `critical_reviewer` over I1–I10 and the changed-surface quality baseline. Reconcile README capabilities/commands, lifecycle's now-implemented calculation description, task routing where useful, roadmap, plan/progress indexes and the task summary. Do not announce public comparison UI or persistence. Pass the [documentation closure gate](../README.md#task-closure-documentation-gate), then Complete/archive with repaired links. M5-03 remains unselected.

## Decision Review Contract

**M502-G, R3:** identity/correlation, evidence integrity, transient lifetime and failure/publication semantics trigger this route. Target is the primary-written literal and controlled-input contract in this plan plus only its necessary static comparison definition. Criteria: exact Accepted behavior, source preservation, honest uncertainty, minimal current-consumer interfaces, no wider persistence/UI scope and traceable native versus policy-only proof.

One bounded non-ranking discovery pass may identify existing reuse and minimal handoff alternatives. Freeze candidate set, critical dimensions and I1–I10 before comparative research. Budget two `critical_researcher` reports: pair/correlation/outcome and controlled-input identity; service envelope/lifetime/publication compatibility. Each has at most one bounded follow-up. Mandatory `decision_analyst` receives both reports and has one correction. Require DRAFT READY and a fresh `critical_research_reviewer` pre-draft checkpoint before primary drafting, then a different fresh final artifact reviewer. No drafter or extra panel is planned. Permit one pre-draft correction and at most two final-artifact correction cycles; repeat the complete invariant packet after material revisions.

Capsules link exact authorities, current evidence identity, question, hard gates, forbidden effects, report scope and remaining allowance. DRAFT READY is not approval; RETURN FOR RESEARCH consumes only remaining evidence budget, and OWNER DIRECTION stops at the owner boundary. Decide semantics now; later tests prove them, not invent them. Significant authority/scope change, two repeated decisive gaps without new evidence or exhausted budgets stop dependent work. Review cannot accept changed product requirements or reset a budget. This future literal route is not consumed by current planning fact gathering/readiness review.

## Concrete Steps

Working directory: `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Use the current [README command preparation](../../README.md#development-command-preparation) in each PowerShell 7 session. Dot-source its first preparation block; do not run restore/acquisition or archived task commands simply to prepare a shell.

### M502-ENTRY-01 — Planning baseline

On 2026-09-17, initial HEAD `3053b049e43ca22d161f954d81ff4505ca4711d7` is clean and no active lease exists. Primary reviewed current roadmap/task closures, requirements/evaluation, source seams and status/navigation; a bounded read-only explorer inspected scanner/service ownership without effects. At 15:12 UTC, Node `24.20.0`, independent strict TypeScript and 96 tests across the two pure files below pass, with zero failures/skips. The 776-test/37-file result is historical M5-01 closure evidence, not a fresh full-suite run in this turn.

RD-003 SHA-256 remains `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`; all six fixture files equal their frozen inline content. M3-01 SHA-256 remains `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; all thirteen referenced file hashes pass. No comparison input has yet been authored or evaluated. The entry commit is historical, not a hardcoded future HEAD/dirty-path gate; bind then-current intentional HEAD and tree/environment identity before execution and leases.

After README preparation, the repeatable focused check is:

```powershell
git status --short
git rev-parse HEAD
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') { throw 'Resolve the active lease before continuing' }
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Focused comparison-prerequisite checks failed' }
}
git diff --check
```

### Future command and effect bindings

| Slot | Exact binding required before applicable preflight, lease or effect |
| --- | --- |
| G definition | Companion location/format/version, directed pairs, vector interpretation, original manifest/file hashes, validation command and permitted static metadata writes; no overwrite of frozen files or native observations. |
| A/B | Exact existing/new test files, commands and expected Red or characterization, pure input fixtures, strict command, accepted test protection and no filesystem/network/provider effects. |
| C | Exact real-scanner/service tests and internal-result assertion seam, six-state input identity, installed browser/runtime, controlled request interception, finite test deadlines and failure witnesses. No actual public navigation. |
| Full closure | Current README suite inventory plus new tests, browser/service execution order, strict/build commands and exact generated build paths. Historical test counts are not an expected-count gate. |
| Resources | Exclusive task-owned scratch/run/evidence roots, create-only fixtures, baseline hashes, owned process/port/context lifecycle, environment restoration, retention and exact cleanup. Check absolute descendants and links/aliases before deletion; no original run, shared scratch root, other task evidence or developer-owned runtime cleanup. |
| Guard/docs | Exact packet path lists/digest and terminal lease commands; current source/test/configuration/runtime/frozen-input fingerprints; UTF-8/newline/whitespace, command parsing, affected links/status and `git diff --check`. |

Future filenames are not existing commands. G and each packet must resolve actual callers and exit propagation before dispatch. A command/effect change returns to primary reconciliation; it cannot bypass a reviewed gate. Primary owns developer instructions and authoritative evidence/status documents between leases, not implementation workers.

## Validation and Acceptance

Future implementation evidence is pending. Record fixture, exact command, relevant tree/environment identity, expected/actual result and reviewer disposition for each invariant. Differentiate an invalid scan from a valid noncomparable pair, a comparable uncertain match and a classified Finding outcome.

| ID | Required witness and expected result | Owning review |
| --- | --- | --- |
| I1 | Only M5-02 selected; Accepted requirements preserved; original manifests/fixtures/results unchanged; new directed definition is explicitly versioned and reviewed, with native and policy-only evidence distinct. | Primary/G/D |
| I2 | Invalid, noncompleted, wrong-lineage or malformed envelope fails with no comparison; individual unavailable facts remain preserved. Complete valid profile mismatch is pair-only not comparable with zero correlation. | A/C critical |
| I3 | Every named page/profile dimension and coverage prerequisite checked; count changes, mode and downstream changes alone do not reject a pair or alter outcomes. | A critical |
| I4 | Public exact rule/locator match counts all relevant later buckets; duplicate/conflicting/changed/unavailable matches cannot force a winner. Controlled scan pairs require declared direction and stable key. | A/B critical |
| I5 | Resolved requires one unique native pass observation, complete coverage and required minimized evidence; absence/removal/ratio-only/incomplete cannot resolve. At most one positive object, no new identity or candidate collection leak. | B/C critical |
| I6 | Binary runtime failure stays persistent; no public binary improved/regressed. Failing contrast higher/equal/lower margins classify only with compatible sufficient evidence; unavailable/conflicting facts stay inconclusive. Policy-only binary reversal and contrast vector never become runtime records. | B critical |
| I7 | Baseline/later source data and nonselected Findings remain unchanged. Rationale/evidence presence respects pair and match disposition; later-only Findings have no new/regressed label; no conformance/causality claim or provider dependency. | B/C/D critical |
| I8 | Real successful scanner envelope is consumed before discard; no successful comparison after abort/cleanup uncertainty/validation or publication failure. Exceptions preserve truthful scan and cleanup state; no cache, delayed candidate reuse or HTTP/disk comparison data. | C critical |
| I9 | Controlled six-state native evidence and declared policy cases pass through shared production comparison logic; tests observe the actual internal result, not a duplicated oracle or fake callback. Original manifests/history remain separate. | B/C/D critical |
| I10 | All accepted tests unchanged during Green; compliant terminal leases, actual cohesion/relevance audit, full suite/strict/build, owned cleanup, different final critical PASS and documentation closure. M5-03 remains unselected. | Primary/D critical |

Record preflight classification, honest Red failure and assertions executed, protected test identity, Green and post-refactor results, terminal lease identity and acceptance. Reuse evidence only when command, working directory, relevant-tree/environment fingerprints and no-drift state all match. A lease receipt or summary proves neither semantic correctness nor real integration.

## Idempotence and Recovery

Read-only planning checks and pure deterministic comparison tests repeat safely under their evidence identity. Real scanner/service tests use exclusive disposable roots and finite owned resources; do not replay historical public/model grants. Preserve both source records and all original observations; no comparison can repair or overwrite them. Candidates are not recoverable after an operation; future comparison requires a new authorized rescan, never a disk cache or inference from absence.

A worker stop returns to primary inspection and terminal lease closure. Reconcile changed binding fields and invalidate affected evidence before another bounded assignment. Unexpected paths or guard failures freeze the affected write branch without reverting user changes. Cleanup uncertainty remains explicit; close only owned handles, validate exact descendant paths and preserve uncertain artifacts for diagnosis. Never reset Git, delete shared roots or stop developer-owned processes. Missing authority, significant architecture change or exhausted budgets require owner direction after unaffected work is complete.

## Artifacts and Notes

Keep G/A/B/C/D decisions and accepted evidence in this plan, with concise checkpoints in the [progress record](../progress/m5-02-conservative-comparison.md). No new ledger, telemetry, report generator or duplicate policy document. Retain only content-safe bounded evidence; private/ignored runs, raw page/native/provider data and historical transcripts do not enter tracked files.

Planning documentation impact: this plan, roadmap planning activation, plan index, progress index and one task summary. No source, test, dependency, runtime, requirement or ADR change. Future controlled-definition creation is gated by G, not performed by this planning request.

## Interfaces and Dependencies

Retain pinned Node/TypeScript, existing runtime validators, Playwright/axe and the single-file service. New interfaces are limited to pure validated comparison input/result and its scoped rescan invocation; exact fields and error behavior await G. No durable comparison schema, HTTP/client contract, provider call, configurable policy or new library is established here.

### M502-PLAN-01 — Accepted planning readiness

On 2026-09-17 a fresh independent `critical_reviewer` returned **PASS — planning readiness only**, with no Blocker, Major or Minor, over I1–I10 and the common responsibility/cohesion baseline. It reviewed the complete plan and four accompanying planning changes against HEAD `3053b049e43ca22d161f954d81ff4505ca4711d7`. The reviewed plan SHA-256 was `3d4e6ba82a6bcd1a985eb73f36ad4f1edb3e9a2d27a0a5c249030ad1506ff1eb`, before this verdict/living-state maintenance.

The reviewer independently inspected controlling authority and critical source seams, confirmed exactly five planning paths dirty, no active lease, no source/test/configuration/frozen-input changes and passing `git diff --check`. It reused primary's fresh strict/96-test and frozen-input checks in M502-ENTRY-01; neither review nor planning reran the historical 776-test suite or browser/service integration. Primary documentation validation passed five documents, sixteen required sections, one parsed PowerShell block, 282 local links/anchors, strict UTF-8/no BOM/final newline and trailing-whitespace checks. Final verdict/link maintenance receives the same validation.

Primary accepts the actual planning diff and complete verdict. Remaining exact input/result, measurement, directed-definition and publication/failure mechanics are G obligations, not accepted implementation decisions. M5-02 remains In progress for planning only: twenty-one tasks Complete, one In progress, six Not started. Documentation impact is limited to the five named planning/status/navigation documents. No implementation, target/model call, retained-data mutation, commit or later-task selection occurred.

## Revision Note

2026-09-17: created for owner-requested M5-02 planning after Complete M5-01. Recorded current verification, pair-definition gap, conservative native-evidence rules, separate guarded owners, transient integration and M5-03 boundary. No implementation or later task is selected.

2026-09-17: recorded independent critical planning PASS without findings and reconciled living state, progress and documentation validation. Future G and execution authority remain unchanged.
