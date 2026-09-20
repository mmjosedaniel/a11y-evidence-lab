# M5-04 — Comparison checkpoint

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with [PLANS.md](../../PLANS.md).

## Current state

- **Task:** [M5-04 — Integrate and verify comparison](../DEVELOPMENT_ROADMAP.md#m5-04--integrate-and-verify-comparison), In progress for planning only. The owner requested project-state review and this plan, not execution.
- **Accepted entry:** [M504-ENTRY-01](#m504-entry-01--planning-evidence). M5-03 is Complete. Twenty-three tasks are Complete; only M5-04 is selected; the four M6 tasks remain Not started.
- **Current barrier:** Independent [planning-readiness PASS](#m504-plan-review-01--planning-readiness-and-documentation) and documentation validation accepted. No M504 execution, worker write, browser observation, public request or deletion has occurred. [G](#g--execution-entry-and-proof-binding) must pass after execution authorization; the public lane also needs an exact owner-authorized target and allowance.
- **Findings and allowances:** No known product defect is selected. G's research allowance and A's worker allowances below are unused. Public scans authorized by this planning request: zero. Active lease: None.
- **Next action:** Owner-authorized execution starts at G. Future execution follows G → A → B → C, with no automatic M6 start.
- **Resumption:** Read the current slice, [commands](#concrete-steps), [acceptance matrix](#validation-and-acceptance), [recovery](#idempotence-and-recovery) and [decision contract](#decision-review-contract) before assignment. Historical Git IDs below are provenance, not executable HEAD constants.

## Progress

- [x] (2026-09-20 UTC) Reviewed project status, prerequisite closure, applicable authorities, current comparison seams and existing proof; strict TypeScript and 117 focused tests pass. See M504-ENTRY-01.
- [x] (2026-09-20 UTC) Created a verification-first plan with bounded characterization, separate controlled/policy/public lanes, guarded ownership and explicit public authorization gate.
- [x] (2026-09-20 UTC) Independent critical planning-readiness PASS, no findings; five-file documentation validation and scope checks pass. See M504-PLAN-REVIEW-01.
- [ ] G: execution authorization, fresh endpoint, reviewed exact proof/command contract and public-lane grant.
- [ ] A: test preflight, only necessary characterization/caller work, primary acceptance and critical review.
- [ ] B: controlled integration, bounded actual public comparison, accessibility observations and preservation/cleanup accepted.
- [ ] C: complete authoritative regression, independent strict/build, different final critical review and documentation closure.

## Surprises & Discoveries

- M5-03 already proves actual image-alt scanner/service/disk/browser publication and exact synthetic baseline deletion. Its separate valid-Finding service case proves refusal after lineage loss. Rebuilding either mechanism is unnecessary. Its actual-state observation is pinned to that execution, not a current live-state guarantee.
- The three frozen native transitions currently stop at `executeRescanComparison` in `tests/rescan-integration.test.ts`; only the separate image-alt case crosses service publication and browser display. The controlled outcome browser matrix uses synthetic callback data. These are useful complementary evidence classes, not interchangeable end-to-end proof.
- The accepted `3.54 → 4.00` contrast vector is arithmetic-only: it must never become a canonical comparison record, third fixture or extra browser scan. The UI's separate `3 → 4/3/2` synthetic examples are not that frozen vector.
- Earlier public scan observations do not authorize a new target or prove a current selectable Finding. A live zero-Finding result is valid scanning but cannot satisfy this selected-Finding comparison checkpoint.

## Decision Log

- **Decision:** Start with existing-behavior characterization, not a planned production rewrite. **Rationale:** M5-01–03 already implement the capability; this checkpoint closes demonstrable integration gaps. **Date/author:** 2026-09-20 / primary.
- **Decision:** Keep controlled native scans, synthetic adverse integration, policy vectors and actual public observation explicitly separate. **Rationale:** REQ-COMP-001–008 and evaluation authority prohibit promoting constructed inputs to scanner evidence. **Date/author:** 2026-09-20 / primary.
- **Decision:** Freeze proof callers, side effects and cleanup before leases or primary-run evaluation. **Rationale:** Public scan provenance and exact-directory deletion require identity and recovery correctness; the guard alone cannot prove those properties. No new product architecture is proposed. **Date/author:** 2026-09-20 / primary.

## Outcomes & Retrospective

Planning establishes the remaining evidence boundary, not an implementation or milestone pass. M5-03's completed behavior is retained. Execution, the public observation and task closure remain pending. The frontend-quality overlay calls for reuse of existing comparison presentation and bounded browser evidence, not redesign or another visual system.

## Purpose / Big Picture

Demonstrate that a developer can select any retained baseline Finding, intentionally scan the same page again, and inspect a conservative saved comparison independently of retrieval, generation or review. A reviewer must be able to distinguish native evidence, deterministic policy tests, uncertainty, durable readback and the limitations of one changing public page. Passing this checkpoint makes M6-01 dependency-ready; it neither executes M6 nor establishes accessibility, remediation causality or release qualification.

## Context and Orientation

The [roadmap](../DEVELOPMENT_ROADMAP.md) owns status. [Requirements](../PROJECT_REQUIREMENTS.md) own semantics; the [documentation router](../README.md#read-by-task) locates controlling modules. Read these exact task authorities before execution:

- [Rescan and comparison](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#rescan-and-comparison): REQ-COMP-001–008; also REQ-EVID-003/008/010/011 and REQ-UX-002/004 for immutable minimized records and source distinctions.
- [Privacy and security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): REQ-SEC-006 exact run-directory deletion; [lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#comparison-lifecycle) and its retention/deletion boundary.
- [Evaluation authority](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): BHV-06, freeze boundary and [comparison-only contrast vector](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#comparison-only-contrast-policy-vector). [SPEC-006/007/008](../specs/SPEC.feature) and [HS-015](../specs/HARD_SPEC.feature) are derived observable views, not executable tests.
- [Application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md): REQ-A11Y-001–004/006/010. All 200% zoom testing remains Deferred; manual verification is visual only, not spoken-screen-reader proof.
- [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), and [OD-025/026/027](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md): trusted operator target, one aggregate, separate test/implementation ownership, exact task selection, no general reopening, existing presentation.
- [Agent workflow](../../.codex/README.md), [worker procedure](../../.codex/execplan-implementation-workflow.md), [write guard](../../.codex/write-lease-guard.md), [frontend-quality](../../.agents/skills/frontend-quality/SKILL.md), and the current [UI contract](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md).

Prerequisites are satisfied for planning: M5-03 and earlier tasks are Complete; applicable Must requirements and decisions are Accepted or explicitly Deferred. No significant product choice is reopened. Runtime evaluation requires fresh frozen-input checks. `evaluation/rd003-scan-v1.json` and its six fixture states define native inputs; `evaluation/m502-comparison-v1.json` binds three directed failing→corrected pairs; `evaluation/m301-generation-v1.json`, its thirteen references and the corpus remain protected, not executed here.

Current ownership is cohesive: `service.ts::rescanFinding` coordinates admission → `executeRescanComparison` → `publishComparison`; comparison modules own profile/correlation/outcome, publication owns durable truth, repository owns JSON writes, lineage inspection owns immediate-parent availability. `POST /api/rescans` and `GET /api/runs/:id` are existing HTTP boundaries. `App.tsx` owns coordination, `ResultsSection.tsx` composition, `ComparisonDetail.tsx` and `comparisonPresentation.ts` presentation. The executor alone returns a private comparison handoff and deliberately does not publish it. Test-only controlled fixture correlation uses stable manifest keys; public runtime correlation uses exact rule and unique locator.

## Scope and Non-Goals

Include only M5-04 evidence preparation, missing integrated characterization, bounded native/policy/public comparison verification, exact synthetic deletion proof, accessible comparison checks, necessary in-contract defect corrections through replanning, and documentation closure. No production edits are presumed necessary.

Exclude new rules, manifests or fixture revisions; policy-vector persistence; arbitrary pair browsing; history/reload restoration; fuzzy matching; hidden backups/cascades; a generic evaluation platform; new dependencies, services, abstractions or storage; provider/model calls, probes or downloads; original retained-run mutation; public-page modification; M6 executions; certification, conformance, scanner-fidelity claims for constructed vectors, or remediation-causality claims. Do not inspect credentials or copy ignored private evidence into tracked files. No Git writes, commit or push is authorized by this request.

## Plan of Work

### G — Execution entry and proof binding

After the owner requests execution, primary records `M504-EXEC-01`: actual HEAD, dirty-path disposition, no active lease, Node/PowerShell/browser/lock identities, source/test fingerprint, build identity, frozen references, all original retained-run path/hash pairs, and scratch inventory. Preserve unrelated work. Never require the plan to remain uncommitted or compare a future lease to the historical planning HEAD. A commit requires endpoint reconciliation, not blindly changing a constant.

Primary compares existing commands plus a bounded direct procedure against a minimal adaptation of the existing test harness. Use the [decision contract](#decision-review-contract) for unresolved proof identity/recovery mechanics; do not research established outcome rules or select new product technology. Freeze one small `M504-G-CONTRACT` here containing acceptance-row-to-caller mapping and every unresolved command slot below. Procedure review can approve controlled work while the public URL remains explicitly gated; no unresolved field may affect the next worker packet or command.

Public grant must name one trusted, non-sensitive, non-authenticated HTTPS target the owner is permitted to analyze and authorize at most two actual scanner activations: one fresh baseline, then one intentional later scan from one real baseline Finding. Record exact immutable mode choices and no retrieval/generation. No historic grant carries forward. Target may be named in the execution request; otherwise ask only for this missing choice while completing unaffected controlled work. Zero Findings, scan failure or external drift is evidence, not permission to choose another target or retry. No public outcome is forced in advance.

G exits only with primary acceptance of exact procedure, commands, effects, budgets, evidence classes and required reviews. Its decisions define how to prove existing behavior; native/public results remain unproved until B.

### A — Small test-only integration characterization and caller preparation

Work-slice ID `M504-A`, S3 for provenance, publication and deletion/recovery. Test owner: one persistent `test_worker`; implementation owner: None unless primary accepts a concrete defect and revised packet. Before preflight issue [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), projecting G and the acceptance matrix. Preflight reads current integration/caller coverage and returns the workflow's exact classification. `EXISTING_AND_COVERED` reuses still-valid evidence without edits; `EXISTING_BUT_UNCOVERED` uses a passing `evidence` lease, not fabricated Red.

Expected test envelope: `tests/rescan-integration.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts` only. The test owns scenarios/assertions; the harness owns real service/browser/scanner setup, controlled interception, owned inventory and teardown. Reuse `tests/helpers/comparison-fixtures.ts` and `tests/helpers/m503-comparison-fixture.ts` read-only initially. Freeze narrower paths per turn. Do not widen the fixture scanner's `https://m105.test` origin policy to smuggle in a public observation. A separate opt-in caller is permitted only after G establishes a demonstrated need, exact path, responsibility and characterization; no unguarded primary script implementation.

Observable contract: extend only the missing crossings in I1–I7 below. Prefer the existing native pair loop plus service publication/readback for label and contrast; retain its executor-only private-handoff assertions separately. For persistent, missing/ambiguous and mismatched-profile branches, drive real service/repository/HTTP/browser composition with explicitly synthetic controlled scanner inputs; do not substitute an already calculated comparison response for the crossing under test. Existing pure outcome and UI matrices remain complementary. Reuse, rather than duplicate, exact deletion and valid-Finding action-refusal tests. Add one bounded actual-service keyboard/announcement/focus witness if still uncovered.

No application-source responsibility or runtime interface changes; no structural refactor is planned. All `src/`, manifests, fixtures, corpus, package/lock/config, original `data/runs`, documentation and Git metadata are forbidden worker writes. Primary owns plan/evidence/status/developer documentation between leases. Generated test outputs are separately bounded in G and the guard projection, never a blanket permission over `temp/` or `data/`.

Every write turn needs a fresh primary-opened lease and terminal close; only one active writer. Inspect actual diff, test relevance, responsibilities, accepted evidence and terminal receipt. Focused commands are G's exact selected integration tests plus independent strict TypeScript; a fresh `critical_reviewer` reviews the complete caller and adverse effects before B's public activation. A different final reviewer is reserved for C. Reviewer roles remain read-only.

`MISSING` or `REGRESSION` stops this characterization assignment. Primary consults the [bug index](../bugs/README.md), reproduces the in-contract defect, updates this plan and the responsibility/command envelope, then delegates genuine Red to the test owner and Green to a separate `code_worker` (or `frontend_code_worker` for a material rendered change). Accepted tests stay unchanged during Green. The primary does not implement the fix. New product behavior or architecture needs owner direction; relabeling a missing capability as evidence is forbidden.

Budget: one read-only preflight; each applicable role/phase has attempt 1, ordinary correction 2, and conditional 3 only with all recorded progress, learning, materially different action, likely benefit and unchanged-authority checks. One review-driven correction loop uses the same remaining role/phase allowance, not a fresh counter. Stop on two identical failures without new evidence, two no-diff outcomes, an exhausted budget or changed binding fields. Preserve the same work-slice identity through correction. Workers retire at acceptance.

### B — Accept controlled evidence and one bounded public observation

Primary runs only the reviewed G/A callers. Controlled proof and actual public proof run sequentially; no leases or another verification process overlap their run store or browser. Automated local test launches are not public scan grants. Observe the actual native three pairs, integrated synthetic adverse branches, policy-only arithmetic, exact owned deletion/readback and separate positive/refusal control; map each result to I1–I7.

For the public lane, use the actual production scanner without response interception, fixture bytes, injected outcomes or provider work. Start the accepted built client and local service against the isolated G-owned run root. Through existing UI/HTTP boundaries obtain one new baseline, choose one retained Finding without changing it, and activate its one intentional later scan. Verify exact response-to-canonical-readback equality, distinct run IDs, selected baseline identity, available before/after evidence, pair/match rationale, later-only Finding preservation, zero provider activity and unchanged baseline bytes. Observe the outcome supported by the data; a conservative inconclusive/not-comparable result is not itself a defect. Failure before a saved comparison does not pass I8.

UI disposition is `REUSE_AS_IS`: existing App/Results/comparison owners, no CSS or composition rewrite. Retain complete browser evidence identity. Automated keyboard, focus and shared-status checks cover selected Finding → rescan → result → immediate baseline/return; manual visual inspection covers comparison evidence, limitations and visible focus at existing comparison-test desktop 1366×900 and narrow 390×844. Reuse M5-03's exact-source visual samples where the complete identity remains valid; capture only missing/current states. No exhaustive matrix, 200% test or speech claim. Material rendered correction first returns to the frontend-quality reuse audit and separate-owner workflow.

Public activation count remains consumed after failures. No automatic retry, new target, target modification, model fallback or silent acceptance waiver. Preserve bounded failure evidence and finish unaffected work; request only the missing new authority if I8 cannot finish. Synthetic deletion is separate from public observation: delete no original or public baseline merely to reuse a cleanup command.

### C — Integrated review and documentation closure

Accept B only after direct evidence inspection, current protected-input/original-record verification and exact teardown. Run the maintained complete authoritative suite once, independent strict TypeScript and build; expand/repeat only for changes, failed prerequisites, stale evidence or unresolved risk. Current suite inventory is 44 files/866 tests before A, not a future hard-coded expected count. Record actual complete counts and any truncated/unavailable evidence honestly.

A different fresh `critical_reviewer` audits I1–I9, the actual cumulative diff, cohesion, primary acceptance, terminal leases, caller identity, negative/deletion paths, public provenance, accessible proof and documentation. Use the same bounded correction rules; review PASS is not owner approval for extra effects. Complete M5-04 only after every task Verification item and the [documentation closure gate](../README.md#task-closure-documentation-gate) pass. Reconcile affected current capability/instructions if changed, roadmap, plan/progress indexes and concise progress; archive this plan and repair links only then. Leave M6 Not started.

## Decision Review Contract

`M504-G` concerns only a small proof/command procedure, not new comparison semantics. R3 is triggered by unresolved proof identity, irreversible exact-directory deletion and recovery in the actual public/isolated-store caller. Local factual inventory is R0. One non-ranking discovery pass may identify existing direct commands and minimal existing-harness adaptation; freeze those viable options and any hard disqualification before comparative research. A generalized runner is out of scope, not a candidate to develop.

One `critical_researcher` covers the single coupled dimension of caller authenticity, owned run-store isolation, finite external effects and teardown. Supply Research Assignment Capsule v1 with this plan, the relevant existing helper/callers and I1–I9. Limit to one report (about 1,200 useful words) and one targeted follow-up; do not duplicate known source collection. Add another dimension only by recorded scope/budget reconciliation, not automatic staffing. The mandatory `decision_analyst` gets one synthesis plus one bounded correction and returns `DRAFT READY`, `RETURN FOR RESEARCH` or `OWNER DIRECTION`. No drafter is needed. Fresh `critical_research_reviewer` pre-draft review permits one supported outline correction; primary alone writes `M504-G-CONTRACT`; a different fresh research reviewer then checks the complete authored artifact. Maximum two final-artifact correction cycles; repeated decisive gaps/exhaustion stop under the workflow, without resetting budgets.

Common criteria/hard gates: smallest reusable implementation, authentic production crossings, no invented native evidence, exact frozen pair identity, no original-data mutation, bounded public target/call allowance, complete cleanup/failure ownership, testability, no new dependency/product surface. Evidence classes are repository facts, controlled native execution, constructed boundary tests, policy-only vectors and live external observation. They cannot substitute for each other. Decide now: callers, literal commands/paths, fail-fast predicates, allowed mutations, per-command evidence and recovery, and test envelope. Prove later: actual outcome, durable identity, keyboard/visual observation and teardown. Target trust/permission and any extra public activation are owner-controlled; research cannot decide them. Significant new architecture returns to the ADR/owner boundary.

Artifact-local outputs: one compact mapping of I1–I9 to exact caller/input/assertion; all command slots below; source/environment identity; mutation/cleanup allowlist; grant disposition; alternatives and rejection reasons; residual limits. The cumulative invariant packet is the acceptance table below: triggers and expected results are fixed, actual result is Pending until evidence is accepted, G research reviewers own procedural coverage, A critical review owns callers, and C's different critical reviewer owns integrated evidence. Every G material revision or R3 correction reruns the whole packet. Planning-readiness review does not replace either G research checkpoint or implementation review.

## Concrete Steps

Working directory for every command: `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`, PowerShell 7. Read and dot-source the first PowerShell block under [current development preparation](../../README.md#development-command-preparation), unchanged. Use its `Invoke-M105Command`; do not replay historical task commands or restore/install dependencies by default.

These read-only planning checks already exist and may be repeated after entry reconciliation:

```powershell
git status --short
git rev-parse HEAD
$m504Readme = Get-Content -LiteralPath README.md -Raw
$m504Section = $m504Readme.Substring($m504Readme.IndexOf('### Development command preparation'))
$m504Prep = [regex]::Match($m504Section, '(?s)```powershell\r?\n(.*?)```').Groups[1].Value
if (-not $m504Prep) { throw 'Development preparation not found' }
. ([scriptblock]::Create($m504Prep))
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/run-contract.test.ts tests/comparison-pair.test.ts tests/comparison-outcome.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Focused comparison checks failed' }
}
git diff --check
```

Expected: independently successful strict check and all focused tests passing (117 at planning), no skipped/cancelled cases, no repository/runtime data change. Hash verification compares SHA-256 case-insensitively; do not compare upper-case manifest text with lower-case output using case-sensitive equality.

**Future command slots — NOT executable authorization.** G must replace each applicable slot with an exact invocation or ordered UI action plus validation/failure/cleanup predicates before the associated packet is issued. Primary-run evaluation has the same command-preparation obligation as workers.

| Slot | Values and effects to freeze |
| --- | --- |
| ENTRY | Actual intentional HEAD/dirty set; relevant source/test/config and environment fingerprints; frozen manifests/references; original retained-run inventory/hashes; no active lease; ordinary non-linked scratch and generated-file inventory. |
| GUARD | Exact current guard start/finish commands, owner, workflow/slice/assignment IDs, phase, allowlisted files/generated roots, baseline/digest, timeout and terminal-receipt checks. No blanket Git metadata permission. |
| BUILD / FOCUSED / FULL | Exact current README strict/build and explicit suite commands, proper mocking flag, scanner/UI scratch, browser profile, all optional capture flags absent unless separately named. Build overwrites only inventoried generated `dist/client` files; fixture tests create/delete only their registered synthetic children. No package metadata mutation or install. |
| CONTROLLED | Exact integration invocation and selected tests; native three-pair input hashes and service/readback/UI assertions; synthetic adverse collaborators; original executor-only assertions; exact owned children and per-case teardown. |
| POLICY / UI | Existing policy-test invocation; bounded UI test/capture invocation, fixture identities, viewports, source/build/browser hashes and content-safe ignored evidence destination. No public-target screenshots or raw payload in tracked artifacts. |
| PUBLIC | Owner-granted URL and two-scan limit; exact caller path/hash, entry point, startup/stop, loopback port, isolated ignored run root, modes, real baseline Finding-selection predicate, one rescan action, actual disk/readback/UI checks, no interceptor/provider/dependency acquisition. Until filled: blocked. |
| DELETION / CLEANUP | Exact generated IDs, absolute child directories, ordinary-path/no-reparse checks, expected files/hashes, live synthetic baseline-deletion timing and assertions, final shutdown/closed-port ordering, remaining-child cleanup and unknown-residue stop. No guessed ID, wildcard deletion or broad-root removal. |
| DOCS | Changed-file/link/anchor/UTF-8/final-newline/trailing-whitespace/PowerShell syntax checks, status consistency, exact diff inventory and `git diff --check`. |

A future helper or modified test command must be labeled future until A creates, tests and reviews it. Its invocation, permission boundaries and negative tests are frozen before its lease; final bytes are pinned before B. Do not invent binding commands inside a worker turn. If preparation requires substantial custom tooling, stop and reconsider the direct procedure under PLANS.md rather than grow a framework.

## Validation and Acceptance

Every row starts Pending for M5-04 execution; M504-ENTRY-01 supplies only planning regression/freeze evidence. Record exact commands, input/source/environment identities, actual results, reviewer and primary disposition with each row at acceptance.

| ID / trigger | Required evidence and result |
| --- | --- |
| I1 — declared native pairs | All three unchanged manifest directions pass stable-key/profile binding and native unique same-rule/locator pass with complete coverage. Actual service publication, validated disk readback and saved presentation cross the production boundaries; no vector or callback-only result is called a native scan. |
| I2 — uncertainty/profile adverse cases | Integrated synthetic persistent, missing/ambiguous match, and materially mismatched profile retain exact rationale; absence without positive observation is inconclusive; mismatch skips correlation; no fabricated after-target/evidence. Existing finer-grained pure/service/UI tests complement this small integrated set. |
| I3 — ordered policy | Exact accepted 3.54→4.00 contrast margins improve while still failing; reversed/equal arithmetic behaves correctly. Binary positive→failure reversal stays policy-only, with no public persisted comparison or invented baseline Finding. No third native fixture. |
| I4 — independence/preservation | Scan-only baseline works with zero retrieval/provider operations; synthetic optional proposal/current-review/manual context cannot gate or change the outcome. Both scan collections, baseline bytes, existing proposal/review and sibling data remain unchanged. Later-only Findings remain visible without new/regressed labels. |
| I5 — deletion/lineage | Exact owned synthetic baseline deletion leaves saved later bytes unchanged and comparison viewable with broken-lineage limitation. Separate selectable-Finding positive control proves subsequent action refusal without new run/scan; zero-Finding UI disabling alone is insufficient. No recomputation, cascade or hidden baseline copy. |
| I6 — publication/identity | Service success equals validated canonical durable state; failed publication is not durable success. Baseline/later/Finding identities, current downstream state and immediate-lineage metadata remain correctly bound through HTTP/client admission. Reuse affected M5-03 adverse-path tests with valid identity. |
| I7 — accessible honest UI | Existing semantic before/after, rationale, source distinctions, limitations and reminders; automated actual-service keyboard/focus/shared-status path; bounded desktop/narrow visual inspection. No accessibility/conformance/certification/causality inference, no speech or zoom proof claim. |
| I8 — actual public lane | Exact authorized target, one authentic completed baseline with selected Finding and one later actual scan; saved comparison and UI/readback agree, baseline preserved, zero provider calls, finite consumed allowance and owned teardown. Record real outcome/limits, not a forced expected improvement. No live observation yet. |
| I9 — complete artifact/closure | G commands/authority/grants align; all leases terminal, actual diff/cohesion inspected, protected inputs/original records preserved, no unknown cleanup loss; complete suite, independent strict/build, different final critical PASS and documentation gate. M5-04 status truthful; M6 unstarted. |

Evidence reuse requires the exact command, cwd, relevant-tree fingerprint, environment fingerprint and guard-backed no-drift state specified in the worker procedure. Mutable browser/filesystem/public observations are Non-reusable unless an isolated run identity/state is pinned; historical public observations never prove current behavior. Handoffs alone do not invalidate valid evidence, and passing receipts alone never prove correctness.

Planning/documentation and G research use structural, semantic and independent-readiness evidence, not TDD. Existing behavior uses accepted coverage or passing characterization. Any genuine production correction records behavioral Red, separate-owner Green, unchanged accepted tests, independent strict and full affected review; it never silently converts this verification plan into feature work.

## Idempotence and Recovery

Read-only inventory, static validators and pure tests may repeat with matching identity. A public call is not idempotent: record consumption at invocation, retain failure facts and never replay it as setup or cleanup. Controlled test invocations use fresh registered synthetic children; unexpected pre-existing state stops the caller rather than deleting it. Preserve all fourteen original retained run directories observed at planning and re-inventory at execution; never hard-code that count as permission to remove extras.

Resolve all destructive targets to exact ordinary children of G's isolated application-owned root; inspect ancestors and contents, reject links/reparse points/unknown files or IDs. The sole live deletion is the deliberately registered synthetic baseline while the test needs to observe lineage loss. Final cleanup first closes owned UI/scanner/service resources and verifies port shutdown, then removes only the registered remaining children with known contents; remove an empty task-only parent only when explicitly listed. Never remove `data/runs`, `temp`, the repository, corpus or a user browser/profile. Public artifacts are preserved by default unless G's owner-accepted retention/cleanup disposition explicitly includes their exact generated directories. Report material removals and recoverability.

On crash, timeout, shutdown uncertainty or unknown residue, preserve it; inspect owned process/path identities read-only. Do not kill unrelated processes, overwrite evidence, force-delete locks, reset Git or count uncertain execution as success. Primary reconciles failed commands and remaining grants, closes any lease terminally and renews only within existing scope/budget. Changed source, authority, command, environment or mutable-state assumptions invalidate the corresponding evidence and review. New authority or exhausted limits pauses dependent work, not unaffected checks.

## Artifacts and Notes

### M504-ENTRY-01 — Planning evidence

2026-09-20: clean initial HEAD `284a1005a6282763e832f85c282febc0d0423f46` (`M5-03: Comparison persistence and UI (#26)`), no active lease. Node `24.20.0`, PowerShell `7.6.5`; package-lock SHA-256 `38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d`. Maintained preparation plus the exact strict/focused command above passes 117 tests, zero failures/skips/cancellations. No service/browser/model was launched.

Frozen SHA-256: RD-003 `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`; M3-01 `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; M5-02 `8a44166b40f700b5dc35a3290b7a4958533c38fc454302d843499c576f43e0a8`. Thirteen M3-01 and eight M5-02 recursive path/hash references pass. An initial ad-hoc checker incorrectly compared differently cased hex strings; corrected case-insensitive comparison passes without any input edit. This was a checker error, not corpus drift.

Primary authority/status review and a bounded read-only code explorer established the coverage map in this plan. [M5-03 final closure](completed/m5-03-comparison-persistence-and-ui.md#m503-final-01--integrated-review-and-task-closure) records its accepted 44-file regression, independent strict/build, native deletion proof, six visual samples and different final critical PASS. Its preceding regression entry preserves an initially failing service-publication assertion, successful unchanged reproduction and unknown cause; do not erase that limitation or pre-authorize retries. Its [native characterization](completed/m5-03-comparison-persistence-and-ui.md#m503-d-evidence-01--native-persistence-and-deletion-characterization) and current actual code, not a summary alone, locate reusable proof. No original retained record was read for content or changed during planning.

Planning documentation scope is this plan, its concise progress record, roadmap and their two indexes only. Requirements, ADRs, runtime instructions and application behavior remain unchanged.

### M504-PLAN-REVIEW-01 — Planning readiness and documentation

2026-09-20: fresh `critical_reviewer` `/root/m504_plan_review` returned PASS for planning readiness, with no Blocker, Major or Minor. It independently inspected the complete plan and activation documents, applicable authorities, current production boundaries and tests. It confirmed the native integration gaps, preserved policy-only vector, valid-Finding refusal witness, guarded ownership, finite effects and future command gates. Reviewed candidate SHA-256 was `314d8e957a6b81be1dfc2baf827b1bd9d6ce04abaa91a0eb09d5613beb7ea5d3` at unchanged planning HEAD; this subsequent status/evidence reconciliation changes no reviewed execution semantics.

The reviewer independently verified the manifest/lock identities and eight comparison references, PowerShell syntax, five-file encoding/formatting and `git diff --check`. Primary validation additionally passed all local links/anchors, sixteen required plan sections, exact five-document change inventory and roadmap counts of 23 Complete / 1 In progress / 4 Not started. The 117-test/strict result remains primary-run evidence; the reviewer did not repeat runtime checks. G procedure acceptance, public target/Finding availability and every actual execution outcome remain pending. No implementation, runtime scan, deletion or model call occurred.

Documentation impact: only this plan, its progress record, roadmap and two indexes changed. The frontend-quality skill constrained reuse and future bounded browser evidence; it introduced no UI or product-scope change. The task remains In progress for planning, with no commit or push.

## Interfaces and Dependencies

Retain the pinned Node/TypeScript/React/Playwright/axe toolchain and existing browser installation. No package/configuration change, acquisition, model or new interface is selected. Existing rescan/read APIs, one validated `run.json`, comparison publication/lineage modules and presentation owners are the boundaries to verify. Any test-only caller must use them without runtime test hooks or a parallel product state model. The only planned new persistent artifact is this task's documentation and any demonstrated minimal test coverage; content-safe ignored verification artifacts are not product records or a new evidence subsystem.

## Revision Note

2026-09-20: Created after M5-03 closure for the owner's planning request. Bounded the remaining integrated/public evidence, separated policy-only vectors from native/runtime records, required fresh execution identity instead of frozen historical HEAD comparisons, and retained guarded worker ownership, exact-command review and YAGNI.

2026-09-20: Reconciled planning-readiness PASS and documentation evidence after independent review. Corrected draft viewport literals to the existing comparison-test samples before review; no execution contract changed after the verdict.
