# M6-01 — Shared deterministic evaluation

This ExecPlan is a living document. Maintain Current state, Progress, Surprises & Discoveries, Decision Log, and Outcomes & Retrospective as work proceeds. Follow [PLANS.md](../../PLANS.md), the [agent workflow](../../.codex/README.md), the [implementation workflow](../../.codex/execplan-implementation-workflow.md), and the [write-lease guard](../../.codex/write-lease-guard.md).

## Current state

- **Task:** [M6-01](../DEVELOPMENT_ROADMAP.md#m6-01--run-shared-deterministic-and-workflow-checks), In progress for owner-requested current-state review and planning only, 2026-09-20. Evaluation execution is not authorized by this planning request.
- **Prerequisites:** M5-04 is Complete; the scan, corpus/gold, generation/no-call and comparison definitions exist and pass the planning identity checks below. Applicable task requirements and decisions are Accepted; later generation and accessibility gates remain separate.
- **Planning baseline:** clean HEAD `97d1e9e135c242ee49c6f5ea18514ba7c32364f4`. This is historical planning evidence, not a future executable HEAD constant. No worker lease was opened.
- **Latest accepted evidence:** [M601-ENTRY-01](#m601-entry-01--planning-evidence) and [M601-PLAN-REVIEW-01](#m601-plan-review-01--planning-readiness-and-documentation). Independent planning-readiness review returned PASS; documentation validation passes.
- **Next action:** await owner-authorized execution. Then perform G and read-only A preflight, bind the exact proof packet, and accept its review before any worker write or opt-in evaluation.
- **Execution not performed:** no browser, public navigation, embedding, generation, retained human review, deletion, dependency acquisition, or full-suite run in this planning turn. No M6-02–M6-04 activation, commit or push.

## Progress

- [x] (2026-09-20) Review current authorities, roadmap, completed checkpoints, current source/test seams, preserved inputs and verification commands.
- [x] (2026-09-20) Verify strict TypeScript, 162 focused tests, frozen artifact references and clean planning baseline.
- [x] (2026-09-20) Draft the bounded verification plan and activate only M6-01 planning.
- [x] (2026-09-20) Independent planning-readiness PASS and documentation checks accepted after two draft corrections.
- [ ] Owner authorizes execution; G records current identity, frequency map and exact commands.
- [ ] A preflight and any guarded test-only characterization accepted.
- [ ] B shared observations and explicit limitations accepted.
- [ ] C complete authoritative regression, different final review and documentation closure; only then Complete/archive.

## Surprises & Discoveries

- Existing tests already execute all six frozen scanner states with managed Chromium, check native buckets and corrected positive observations, and cover review/comparison/persistence failures. A new general evaluation runner would duplicate those responsibilities.
- The frozen no-call package is present, but no existing test explicitly binds its exact path/hash. Synthetic no-call tests alone do not prove that particular vector or its rendered abstention.
- Current role-based retrieval returns supported guidance for all three historical M3-05 profiles, but informative-image G1 has only one gold match and unsuitable decorative-image interpretation/remediation. Role coverage and caller exit zero are not semantic relevance.
- The old retrieval caller writes historical, occupied roots. Its zero-gold-hit failure threshold does not reject G1's semantic problem. It is reference material, not a replayable M6 command.
- M5-04's public target allowances and M4-03's human-review allowances are closed. Historical evidence can be assessed without repeating those external or human actions.

## Decision Log

- **2026-09-20 — Verification-first scope.** Primary selects a documented execution path over existing maintained checks, not a new framework, manifest format or production feature. Add test-side code only for a demonstrated gap.
- **2026-09-20 — Natural frequency.** Execute controlled shared checks once per applicable case, not per generation provider. Reuse admissible historical actual observations only after complete evidence-identity assessment; never describe them as fresh M6 executions.
- **2026-09-20 — Frozen no-call binding.** Plan one explicit frozen-package observation through existing application seams, including rendered terminal abstention and no review entry. Any bridge is test-only, honestly synthetic where needed, and cannot authenticate independently assembled guidance as actual embedding retrieval.
- **2026-09-20 — Preserve adverse evidence.** Report relevance, support, citation integrity, persistence and cleanup separately. Do not tune ranking, change gold or replace a failed observation to obtain a passing summary.

## Outcomes & Retrospective

Planning is complete with independent readiness PASS. M6-01 remains In progress for planning only; no M6 evaluation result or task completion is claimed. Implementation, actual observation acceptance and lessons belong here only after verification.

## Purpose / Big Picture

Produce one compact, traceable provider-independent evidence set for the existing scan-to-review/comparison workflow. A reader should distinguish real native scanning, constructed boundary inputs, genuine historical retrieval, frozen no-call evaluation, human-authored decisions and actual public observations. This task does not evaluate Local or Groq generated output: the fixed six generation executions belong to M6-02.

## Context and Orientation

### Authority and current project state

Start with the [authority map and task router](../README.md#authority-and-status-map), [shared requirement semantics](../PROJECT_REQUIREMENTS.md), and the selected roadmap entry. Resolve all selected IDs through the roadmap's authority-location key. Controlling scope is:

- [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): REQ-EVAL-001–005 and 007; shared checks, rubric, comparison policy vector, generation-only exception and amendments.
- [Evidence and review requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): REQ-SCAN-002 and 004, REQ-EVID-002.
- [Quality requirements](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): REQ-QUAL-020.
- [Specifications](../specs/README.md): SPEC-001, SPEC-002, SPEC-003 abstention/retrieval-failure scenarios, SPEC-005–008; HS-001, 004, 006, HS-008 no-call boundary, HS-010 and 015. These are derived expectations, not execution evidence.
- Accepted ADR-0018 trusted input, ADR-0019 exact retrieval with its role-selection amendment, ADR-0021 aggregate, ADR-0022 corpus, ADR-0023 local boundary and [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) ownership. Follow [local feasibility](../LOCAL_MVP_FEASIBILITY.md) only if actual retrieval renewal becomes necessary.

Twenty-four tasks are Complete at entry. M1–M5 implement the application, including real scanner, retrieval, both adapters, review, rescan and comparison. [M5-04 closure](completed/m5-04-comparison-checkpoint.md#m504-final-01--integrated-review-and-task-closure) records 881 passing tests across 45 files, independent strict/build, controlled comparison, one actual public comparison and final critical PASS. Those are historical observations, not a fresh full-suite run here. M6-02, M6-03 and M6-04 remain Not started.

Actual Local/Groq integration and exact-configuration capacity observations exist; they are not the six fixed generation evaluations. Full application-accessibility verification belongs to M6-03; 200% zoom is Deferred, and semantic announcement tests do not prove speech output. Existing native, retrieval, review and comparison claims remain bounded to their recorded contexts.

### Frozen and protected inputs

Preserve exact bytes, source notices, versioned semantics and private/public distinctions:

| Input | Planning SHA-256 or identity |
| --- | --- |
| `evaluation/rd003-scan-v1.json` | `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459` |
| `evaluation/m301-generation-v1.json` | `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b` |
| `evaluation/m502-comparison-v1.json` | `8a44166b40f700b5dc35a3290b7a4958533c38fc454302d843499c576f43e0a8` |
| `package-lock.json` | `38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d` |
| Frozen no-call package | Manifest `shared.noCall`; `temp/m301-generation-freeze-v1/no-call.json`; `1b07d5d764ad99bb028db1aef767b9bb9d0685661b5ad761731d60f93394b6dd` |

The generation manifest's 13 path/hash references and comparison companion's eight references include the corpus/gold, six controlled HTML states and private frozen packages. Hash file bytes case-insensitively against hexadecimal declarations; do not confuse file hashes with normalized corpus identities. Reject missing/mismatched artifacts; no regeneration or refetch to pass a gate.

Preserve the 14 pre-existing `data/runs` directories and all historical `temp/m204-*`, `temp/m301-*`, `temp/m305-*`, M4-03 and M5-04 retained evidence, developer runtime/model assets and credentials. G inventories exact ordinary paths and hashes without copying raw contents into tracked documentation. Existing unknown scratch contents are not disposable.

### Shared evidence and frequency map

This is the minimum matrix, not a new scorecard. B records a result, origin, exact identity, decisive assertion, limitation and disposition for every row.

| Check and authority | Existing evidence / intended execution | Frequency and acceptance |
| --- | --- | --- |
| Native scanner and evidence: SPEC-001/002, HS-001/004/006, REQ-SCAN-002/004, REQ-EVID-002 | `tests/scan-page.test.ts`, `scan-normalization.test.ts`, frozen RD-003 | All six fixed failing/corrected states once in the authoritative suite; exact rule coverage, all violation nodes, incomplete distinction, native minimized facts and corrected same-target positive observations. Synthetic projection tests are separately labeled. |
| Zero, failure and trusted input: SPEC-001/002/008, HS-001/006/015 | Scanner, run-contract, local-service and walking-skeleton suites; M5-04 actual public witness | Malformed/credentialed/non-HTTPS rejection before creation/navigation; complete zero distinct from failure; fresh top-level-only contexts, finite navigation and cleanup. Intercepted HTTPS is not public proof. Historical authorized public observation is dated, not current reachability or hostile-target safety. |
| Actual retrieval, gold and citations: SPEC-003 subset, HS-008 boundary, REQ-EVAL-003/004 | M3-05 G1/G2/G3 observations; retrieval-contract, embedding-retrieval, retrieval-service suites | Assess each of the three profiles once against frozen gold and canonical source identity. Fake embeddings prove policy, not relevance. Historical actual evidence is reusable only under G's identity rule; renewal is a separately bound branch below. |
| Support and frozen abstention: SPEC-003, HS-008, REQ-EVAL-001/007 | finding-sufficiency, generation-stage, retrieval-service and guidance UI suites; exact frozen no-call binding in A | One frozen incomplete-guidance observation, not once per provider. Selected Finding remains visible; missing remediation role/reason/no-call/manual guidance render; no adapter preparation, transport, ProviderInvocation, proposal or review decision. Separately verify missing/conflicting/evidence-incomplete states and retrieval execution/integrity failure without conflating them with abstention. |
| Human review: SPEC-005, HS-010 | review-contract/repository/service, finding-review UI and review-checkpoint suites; M4-03 historical actual decisions | Once per action on synthetic validated proposals: approve, edit-and-accept, reject; support and blocking judgment gates, exact edit/time, preserved original, non-blocking reminder. Historical owner decisions are not replayed or fabricated. |
| Conservative comparison: SPEC-006/007, HS-015 | comparison-pair/outcome/persistence/service and rescan integration/UI suites; frozen M5-02 companion | Three native controlled pairs, uncertainty and compatibility cases; 3.54→4 contrast vector is policy-only improved while still failing; reversed binary regression is non-persisted evaluation-only. No causality or whole-page claim. |
| Durability, failure and cleanup: SPEC-008, REQ-QUAL-020, HS-015 | run-repository, local-service, retrieval/review/comparison persistence/service and integrated tests | Evidence/siblings/original decisions survive downstream failure, restart and permitted updates; exact synthetic deletion and failed-cleanup truth. No pre-existing retained run deletion; no recovery retry masquerading as a new case. |

### Retrieval interpretation retained at entry

[M3-05 actual retrieval](completed/m3-05-generation-checkpoint.md#m305-d-observation-01--three-actual-controlled-retrievals) used the accepted highest-per-required-role selection: G1 gold matches 1/3, G2 3/3 and G3 3/3, all structurally supported. G1's decorative-image interpretation and H67 remediation are unsuitable for the informative-image scenario. Record that relevance failure explicitly even if the existing caller exits zero. At least one direct-support gold passage is the stated REQ-EVAL-003 minimum; do not invent an all-gold threshold or turn that minimum into a blanket semantic pass. The earlier M2-04 global-three results all abstained and cannot stand in for current role-selection behavior.

## Scope and Non-Goals

In scope: assess existing evidence identity, execute the shared controlled checks at natural frequency, close the exact frozen no-call binding gap, record separate outcomes and limitations, and reconcile documentation.

No new production feature, dependency, model, corpus, fixture/gold version, ranking policy, manifest schema, generic evaluation runner, dashboard, telemetry, benchmark, automatic retry or history UI. No generation request, credential access, model acquisition, capacity rerun, fresh public scan or retained human decision is selected. No new rendered design; existing UI tests may verify this task's frozen abstention. If rendered production changes become necessary, replan the slice under the frontend-quality skill before writes. M6-02's six runs, M6-03's broad accessible path and M6-04's portfolio synthesis remain outside scope.

## Plan of Work

### G — Reconcile identity and freeze the minimum proof contract

After execution authorization, primary rereads current state/authorities and records the intentional current HEAD, complete dirty set, source/test bytes, commands, runtime, frozen inputs and protected endpoints. A plan commit or unrelated intentional HEAD movement does not invalidate history automatically; explain the diff and bind a fresh execution baseline consistently. No command compares future HEAD with the historical planning SHA.

For each reusable observation, compare the complete relevant evidence identity: executable source and transitive dependencies, test/caller, exact inputs, configuration, runtime/command and evaluated assertions. Cite the original revision and actual retained files. Unchanged paths alone or passing hashes of output alone are insufficient. A changed client does not erase an unchanged backend observation, but it cannot inherit the old client's visual proof. Missing original identity makes the affected proof pending, not implicitly passed.

Prefer existing commands and archived evidence inspection. Do not run archived preparation/actual-case/cleanup procedures. The primary and read-only test-worker preflight bind the frozen no-call bytes through existing canonical citation, sufficiency, service and UI seams. The frozen package is an evaluation vector: any necessary synthetic retrieval envelope is explicitly test-only, uses canonical passages and does not claim authentic ranking or score provenance. Verify actual application-authored output, not merely the package's expected fields.

Before the first write, add `M601-G-CONTRACT-01` here with exact files/symbols, observable assertions, fixture provenance, UI/disk crossings, commands, expected mutations, protected paths, cleanup, frequency and stop conditions. No production change is presumed. Use a fresh critical reviewer for the no-call integrity and preservation contract; a review may accept the exact packet together with its subsequent proof only if no unreviewed effectful execution precedes acceptance.

**Conditional actual retrieval renewal:** if historical G1/G2/G3 cannot satisfy the complete identity rule, renew only affected profiles. Freeze a current M6-only caller/root contract first; never replay the occupied M2-04/M3-05 caller unchanged. A future authorization to execute this plan includes at most one explicit local embedding retrieval per affected profile, at most three total, after this gate. This is real EmbeddingGemma work, not generation. Bind the fixed model/runtime/corpus/ranking, cold/warm collection state, corpus/query request bounds, distinct exclusive case roots and observed request accounting. No retry, tuning, acquisition or new capacity screen. Existing callers are reuse candidates, not mandatory infrastructure. If a new integrity/recovery mechanism must be selected rather than reused, apply the conditional R3 route below before freezing it. If fresh retrieval is unnecessary, omit this entire caller branch.

No fresh public target is authorized. Reuse the scoped historical public observation only for the assertion it established and after identity assessment. If that assertion cannot be supported, finish unaffected work and request a named target and finite allowance; do not silently use W3C or Ollama again.

### A — Worker-first preflight and bounded characterization

Use workflow ID `m601-shared-deterministic-evaluation`, work-slice ID `A-frozen-abstention`. Primary issues the complete Milestone Assignment Packet v2 to a persistent `test_worker` for read-only preflight. It must identify the missing assertion, existing seam, least change and current focused command. Preflight may run only commands already bound by G; no lease, writes, live inference or private-case execution.

Normal route: **TDD applicable — behavior preflight**, with `EXISTING_BUT_UNCOVERED` expected but not pre-decided. If confirmed, use the workflow's guarded `evidence` phase for passing characterization plus negative tests of the test-side binding; no Red/Green turn is needed for already implemented behavior. `EXISTING_AND_COVERED` instead reuses exact evidence without a new test or Green. Do not fabricate Red or classify this as non-behavioral setup. Candidate envelope is `tests/m601-frozen-abstention.test.ts`, a purpose-named `tests/helpers/m601-frozen-abstention.ts` only if needed for the opt-in private vector, and narrowly selected existing guidance UI fixture/test seams. These are candidates, not a blanket lease. Freeze the smallest exact subset in G; default tests use project-owned synthetic inputs and must not depend on ignored private files. The explicit frozen-case command fails closed if its required package is absent; it cannot skip and report success.

Responsibility direction: test binding reads/authenticates the frozen definition and delegates to existing canonical guidance/sufficiency/service/UI behavior; no application import of evaluation files, no duplicate support algorithm, no wrapper framework. Keep existing browser harness ownership and teardown. A separate helper is justified only by the distinct opt-in file-binding responsibility, not file length.

Primary opens one exact guarded lease per write turn, verifies the digest/packet projection, then delegates. Workers may not edit plans, README, authorities, frozen inputs, credentials, historic evidence or Git metadata. Close the lease terminally; inspect actual diff, tests, assertions, responsibility fit and protected identities before accepting the handoff. Primary documentation changes occur only between leases.

If preflight exposes missing/regressed production behavior, consult the [bug recording rules](../bugs/README.md), revise the exact packet, and use separate test-worker Red → primary acceptance → code-worker Green/optional same-turn Refactor. Accepted tests stay byte-unchanged during Green. No production path is authorized until that revised packet names it. A significant behavior/architecture change or expanded scope needs the controlling decision/owner, not a workaround test.

Review this integrity-sensitive slice with `critical_reviewer` before using a new opt-in caller or accepting its proof. One ordinary preflight correction; write attempts 1 and 2, with attempt 3 only under the workflow's documented progress/new-learning/different-action/likely-benefit conditions. One review-correction loop uses remaining phase budget, not a new allowance. Two failed attempts without new facts, two no-diff turns or exhaustion stop the worker for primary triage. Do not reset budgets by renaming a slice or caller.

### B — Execute and interpret the shared checks

Primary accepts the exact commands and artifact identity, then executes the frequency map sequentially. The full maintained suite may supply most rows; do not first run it as B and repeat it unchanged as C. Focused A checks are development evidence, not additional fixed evaluation cases.

Perform the explicit frozen no-call observation once. It must link exact package bytes to selected-Finding/application/disk/UI assertions and zero-effect counters. If any layer is not exercised, record that missing proof rather than substituting an adjacent synthetic test. Browser text/semantics can prove this narrow existing state without a new design or screenshot program.

Inspect/reuse the authentic retrieval and public/human observations under G, or run only the specifically activated renewal branch. Record ordered passage IDs and separate gold, relevance, support and citation judgments without publishing private payloads. No generation provider availability check or credential read is needed.

Retain one compact result table here: case ID; actual execution or historical reuse; command/evidence identity; native/synthetic/policy/public origin; observed outcome; separate failed dimensions; persisted/readback/cleanup evidence; limitation and rerun trigger. Aggregate suite counts are development verification, not product success percentages. Preserve failed attempts and unknowns.

A failed quality dimension is an evaluation result, not permission to tune inputs. Record G1 honestly. An unmet applicable Must, failed required check or unverified mandatory case prevents task completion and dependent advancement; distinguish this from a recorded semantic limitation where the controlling contract's explicit minimum still passes. Obtain owner disposition only when authority or scope actually needs to change, never erase the failure.

### C — Integrated verification and documentation closure

After the last accepted test/source change, run the complete authoritative suite (45 files at planning entry, plus any accepted additions), independent strict TypeScript and current client build under the maintained README procedure. Reuse a B run only when its full evidence identity remains current. A reviewer handoff alone does not invalidate it; material changes do.

A different fresh `critical_reviewer` reviews integrated evidence, no-call identity, data preservation/recovery, honest provenance, scope and documentation. Reproduce risk-critical checks where useful; reuse ordinary current evidence. Correct only within remaining budgets.

Primary applies the [documentation closure gate](../README.md#task-closure-documentation-gate), records limitations and exact retained/disposable artifacts, and updates the roadmap/progress/navigation. Archive this plan only after all M6-01 verification and closure gates pass. Do not activate M6-02 automatically.

## Decision Review Contract

No new product, technology, ranking or persistence decision is proposed. Current planning is bounded repository evidence mapping (one independent read-only code-seam inspection); it is not competitive research. R0 administrative facts remain primary-owned. No research panel or drafting agent is required merely to run existing checks.

If G reveals a consequential proof-mechanism choice, record its question, authorities, options (reuse existing commands first), hard constraints, common criteria, evidence gaps, smallest scope, decide-now/prove-later boundary and stopping rule here before selection. Use objective R0–R3 routing from the agent workflow. A new custom integrity/identity/recovery mechanism triggers R3: bounded critical researcher for each independent critical evidence dimension, mandatory decision analyst, fresh pre-draft critical research reviewer, primary-authored freeze and a different final critical research reviewer. Research/drafting/review remain read-only. Budget one bounded discovery per unresolved dimension and one correction pass; escalate unresolved material uncertainty without inventing evidence. Optional R2 review remains conditional on its listed triggers, not mandatory after every DRAFT READY.

No R3 contract may silently authorize a new application feature, model call budget, target, data deletion or manifest amendment. A routine same-contract caller literal resolved from existing evidence is not automatically a new architecture decision.

## Concrete Steps

All commands run from the repository root in PowerShell 7. First load only the unchanged definition block under [Development command preparation](../../README.md#development-command-preparation). It defines `Invoke-M105Command`, ordinary-path guards and exact environment restoration without installing or executing anything. Do not execute the adjacent npm-ci block unless a separate locked restoration is actually needed and authorized.

### M601-CMD-ENTRY — Read-only re-entry

```powershell
git status --short
git rev-parse HEAD
git diff --stat
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') {
  throw 'Reconcile active lease before M6-01 maintenance or execution'
}
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) {
    throw 'Pinned Node runtime unavailable'
  }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Independent strict TypeScript failed' }
}
```

The primary binds the observed intentional HEAD and exact dirty paths into G and each later lease packet. Clean and plan-only-dirty worktrees are both valid after inspection; no test requires this plan to remain untracked. Any changed binding field stops advancement until reconciled consistently.

### M601-CMD-FOCUSED — Planning/pure policy checks

```powershell
Invoke-M105Command {
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts tests/retrieval-contract.test.ts tests/finding-sufficiency.test.ts tests/comparison-outcome.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M6-01 focused contract checks failed' }
}
```

These checks neither launch Chromium nor contact embeddings/providers. They do not replace the closure suite or the frozen observation.

### G command slots — Must be resolved before the affected lease or execution

| Slot | Required binding and side effects |
| --- | --- |
| `M601-CMD-IDENTITY` | Current HEAD/dirty set; source/test/caller and frozen recursive hashes; retained-run and historical proof inventories; ordinary-path checks; runtime/lock identities. Read-only, content-safe output. |
| `M601-CMD-A` | Exact test paths/name filters, Node flags, per-test deadline, required existing build and scanner/UI scratch, expected exit/assertions and restoration. No inference. |
| `M601-CMD-NO-CALL` | Exact opt-in frozen package invocation, binding/negative-validation command, selected case, isolated run root if needed, loopback/browser ownership, fixed invocation/provider-effect counters, persisted/UI assertions, finite work/stop deadlines and cleanup order. No raw package copy to tracked tests. |
| `M601-CMD-RETRIEVAL` (conditional) | Only affected G1/G2/G3, caller source hash, exact new exclusive roots, fixed local runtime/model digest and fit configuration, maximum embedding requests, explicit operation allowance, failure/stop/retention rules. Never an old occupied root or generation call. |
| `M601-CMD-FULL` | Maintained README complete sequential suite, any accepted new suite, independent strict/build, no running app/concurrent test, capture flags absent, exact exit checks and evidence identity. |
| `M601-CMD-CLEANUP` | Owned processes and normal-stop evidence first; exact validated disposable child paths/inventory, exclusions, expected before/after effects and environment restoration. Unknown content or uncertain cleanup means preserve and report, not sweep. |
| `M601-CMD-DOCS` | Affected-authority/status/link/anchor/UTF-8/final-newline/whitespace/PowerShell checks and `git diff --check`; include explicit inspection of untracked new documents. |

Unresolved slots are deliberate gates, not executable placeholders or permission for workers to invent commands. Bind only slots actually needed; mark unused renewal/setup slots Not applicable with reasons. No dependency install, bootstrap, lock regeneration or general cleanup is planned. If prerequisites are absent, document the bounded recovery before any setup lease rather than improvising acquisition.

## Validation and Acceptance

Acceptance requires the complete evidence/frequency matrix with explicit provenance and limits; all task-required assertions verified; exact frozen no-call application/rendered outcome with zero provider effects; adequate authentic retrieval evidence distinguished from synthetic role-policy proof; retained native evidence and human work unchanged; truthful failure/cleanup behavior; current full regression and independent strict/build; different final review; and documentation closure.

Scanner/retrieval/review/comparison success cannot be inferred from a test count, worker report, guard receipt or suite exit alone. Inspect actual assertions and outputs. Do not award a semantic pass to G1, reinterpret non-failing native observations as general accessibility, or count a generation invocation where none occurred. Follow REQ-EVAL-005: material fixture/scanner/corpus/retrieval/adapter/comparison changes require affected new evidence without rewriting history.

## Idempotence and Recovery

Re-entry is read-only first. Never relaunch an actual case because a caller timed out or returned ambiguous output; inspect durable evidence and normal-stop state without treating absence of a response as absence of an effect. Attempt budgets and actual-call allowances are independent and never reset through a new session.

Default suite fixtures are disposable only under their existing exact ownership contracts. Reject occupied opt-in case roots. Stop owned processes before manual cleanup; keep developer Ollama running if it was already running. Remove only explicitly bound ordinary task-created child paths after checking resolved containment, ancestors, contents and relevant link constraints. Never delete `temp`, `data/runs`, browser/model roots, historical evidence or unknown files. Preserve uncertain residue and fail the affected cleanup claim. Retained private evidence stays ignored; documentation records only content-safe identity and conclusions.

A missing frozen private file is a blocker for its case, not permission to reconstruct prompts/guidance from memory. Follow the owning freeze recovery contract and owner authority. Missing runtime, drift, unavailable model or exhausted allowances stop only dependent work; finish safe unaffected checks. No automatic fallback or new model/provider.

## Artifacts and Notes

### M601-ENTRY-01 — Planning evidence

On 2026-09-20, the worktree was clean at `97d1e9e135c242ee49c6f5ea18514ba7c32364f4`. Primary reviewed the authority/status route, M5-04 closure, M6 contract, evaluation amendments, relevant specifications/hard invariants, current development commands and protected artifacts. A bounded read-only explorer mapped current test/caller seams; it performed no writes or execution.

Fresh independent strict TypeScript passed. M601-CMD-FOCUSED passed **162 tests**, zero failures/skips. PowerShell 7.6.5 and Node v24.20.0 were observed. Both manifests' 13 and eight path/hash references matched; the frozen and lock hashes above matched; 14 retained run directories were observed. This does not replace execution-time inventories or establish current model/provider availability. No browser/model/public call, dependency mutation or deletion occurred.

### M601-PLAN-REVIEW-01 — Planning readiness and documentation

On 2026-09-20, a fresh independent critical reviewer returned **PASS for planning readiness**, with no unresolved Blocker, Major or Minor. Named triggers were frozen no-call identity/provenance, retained-data preservation and cleanup/recovery. Two initial draft findings were corrected and the complete revised artifact re-reviewed: the manifest property is `shared.noCall`, and behavior preflight uses the conditional `EXISTING_BUT_UNCOVERED` characterization route rather than non-behavioral setup. The reviewed plan SHA-256 was `f7c988a1933c08c476d037ce12bd2e145b69297253a4e37e690a612d01ec0f21`; subsequent changes only record this verdict and planning status, not execution bindings.

The reviewer independently inspected the six-document change, current HEAD, exact dirty set, absence of an active lease, 14 retained run directories, all 13 generation/eight comparison references and recorded hashes, existing proof seams and historical evidence. Both plan PowerShell blocks parse and diff whitespace passes. It ran no tests, browser, model or network operations; the 162 tests remain primary-observed planning evidence and 881 tests remain historical M5-04 evidence.

Primary documentation validation passes for six documents, 429 local links/anchors, eight PowerShell blocks, all sixteen required plan sections, UTF-8/final-newline/trailing-whitespace checks and `git diff --check`. Roadmap counts are 24 Complete, one In progress and three Not started. The exact changed scope is this plan and its progress record, both indexes, the roadmap and the root README status sentence; no source, tests, packages, frozen inputs, requirements or ADRs changed. Execution-time evidence reuse, exact frozen rendered proof and runtime availability remain unverified. This acceptance permits handoff of the plan, not evaluation execution.

## Interfaces and Dependencies

No production interface change is planned. Existing scanner/native normalization, canonical corpus/query/result validation, evidence sufficiency, shared generation no-call branch, local service, aggregate repository and React guidance/review/comparison regions remain their current owners. Test callers depend inward on those boundaries; production must not depend on test helpers or evaluation manifests.

Reuse the pinned toolchain, Playwright-managed Chromium and maintained test harnesses. Actual embeddings, if renewed, use the existing approved local EmbeddingGemma path, never a new service or library. No Groq access or Qwen generation is required. Test-side additions belong to the test worker; primary owns authoritative evidence, instructions, status and summaries. Any production correction needs a separate named code-worker Green lease and unchanged accepted tests.

## Revision Note

2026-09-20: Created for owner-selected M6-01 planning after completed M5-04. The plan inventories current evidence, scopes the missing frozen no-call binding, preserves the informative-image relevance failure, and leaves later generation/accessibility/reporting tasks unselected. Corrected the manifest property and characterization classification during independent review; planning readiness and documentation checks pass. All execution gates remain pending.
