# Verify the closed-corpus retrieval checkpoint

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M2-04](../DEVELOPMENT_ROADMAP.md#m2-04--integrate-and-verify-retrieval-and-abstention), In progress for planning only. The owner's 2026-09-09 request authorizes project review and plan creation, not application changes, model calls, downloads, runtime cleanup, commit or publication.
- **Entry evidence:** [M204-PLAN-01](#m204-plan-01--current-project-state). M2-03's renewed closure and M2-02's capacity gate satisfy the dependency. [Planning readiness](#m204-plan-review-01--accepted-planning-readiness) passed; no checkpoint result is claimed.
- **Remaining gates:** Execution request, [fresh entry and proof preparation](#a--reconcile-and-prepare-the-smallest-proof), guarded test-side preparation where necessary, then [bounded evaluation](#b--execute-the-fixed-checkpoint) and closure. No significant product decision is presently selected.
- **Allowance / lease:** No execution allowance consumed. Active lease: None. See [ownership and budgets](#ownership-risk-and-budgets).
- **Next action:** After execution is requested, capture M204-ENTRY-01, freeze M204-CASES-01 and exact callers before effects. Resume through [Concrete Steps](#concrete-steps), [Validation and Acceptance](#validation-and-acceptance), and [Idempotence and Recovery](#idempotence-and-recovery).

## Progress

- [x] (2026-09-09 15:31Z) Reviewed roadmap-wide state, current requirements/workflow, M2-02 capacity and M2-03 renewed closure, gold mappings and relevant implementation/test boundaries; recorded M204-PLAN-01.
- [x] (2026-09-09 15:31Z) Fresh Node 24.20.0, independent strict TypeScript and 119 focused tests passed on the unchanged implementation.
- [x] (2026-09-09 15:40Z) Accepted fresh critical planning-readiness PASS without findings and reconciled the five planning documents; see M204-PLAN-REVIEW-01.
- [ ] Receive execution authorization and accept M204-ENTRY-01 plus the exact proof/command package.
- [ ] Accept A: necessary test-only preparation and its risk-routed review, without inventing production work.
- [ ] Accept B: three real gold observations and the bounded deterministic/presentation cases.
- [ ] Complete regression, independent integrated review, owned cleanup and documentation closure; record proceed, correct M2, or required decision before M3-01.

## Surprises & Discoveries

- M2-03's actual proof produced `incomplete` guidance missing **interpretation**, not the shared evaluation package missing **remediation**. Its real result remains useful historical integration evidence, not completion of this checkpoint's shared package ([M203-C-REAL-RESULT-01](completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-c-real-result-01--actual-guidance-and-persistence)).
- The [old real driver](../../tests/helpers/m203-real-guidance-driver.ts) is tied to one image seed and a consumed root. Its unused supported branch incorrectly expects a busy read; the settled owner is readable with `interrupted: false`. The [recorded restriction](completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-final-01--closure-evidence-and-explicit-manual-check-deferral) forbids reusing that branch without correction. A new task-specific test driver must use the actual service contract, not copy this assertion.
- Generic [M2-02 factories](../../tests/helpers/m202-retrieval-fixture.ts) are not gold inputs: the label factory uses a text input and the contrast factory uses different color/ratio facts. [M2-01 gold](../../evaluation/m201-corpus-v1.json) fixes email and the retained #888888/3.54 contrast facts. M102 factories return frozen snapshots; any seed preparation clones before changing fields.
- The authenticated production snapshot declares no conflicts. [Corpus validation](../../src/server/retrieval/corpus-validation.ts) rejects a changed declaration, and [stored analysis validation](../../src/server/domain/run-contract/finding-analysis-validation.ts) recomputes support under that snapshot. A synthetic conflict can prove the pure policy and isolated outcome view, but cannot honestly be published as a real canonical run.
- Supported outcomes retain the single service workflow owner, including across a new run. Three independent real cases therefore use sequential service lifetimes; the checkpoint must not add owner reset, resume or automatic retry.

## Decision Log

- Decision: Select only M2-04 planning. Rationale: a plan request is not execution permission. Date/Author: 2026-09-09 / primary.
- Decision: Reuse existing application behavior and tests, with one bounded test-side preparation slice followed by evaluation. Rationale: M2-01 through M2-03 implemented the relevant contracts; another production subsystem or unconditional Red/Green cycle would add no proof. Date/Author: 2026-09-09 / primary.
- Decision: Separate real ranking observations from controlled policy/display cases, and preserve the conflict snapshot boundary. Rationale: fixed gold is an expectation, not an input to ranking; test doubles cannot establish real model outcomes or bypass authenticated persistence. Date/Author: 2026-09-09 / primary.

## Outcomes & Retrospective

Planning is complete and independently accepted for readiness only. The application already implements retrieval and deterministic outcomes, but this task has not executed the three gold-profile requests or accepted the shared checkpoint. M2-04 remains In progress. M2-03's visual deferral stays with M6-03. M3-01 and later work remain Not started. Detailed proof belongs here; the [progress record](../progress/m2-04-retrieval-checkpoint.md) holds only accepted material summaries.

## Purpose / Big Picture

Demonstrate that one selected Finding retrieves exact closed-corpus guidance through the actual local embedding, service, UI and single-file publication path. Evaluate relevance, citation validity, support, abstention, failure and preservation separately. Show supported eligibility and the required deterministic adverse branches without invoking any generation provider. Finish with an honest M2 checkpoint disposition, not a model ranking, accessibility certification or release claim.

## Context and Orientation

### Authorities and readiness

Start with the [authority map and task router](../README.md#authority-and-status-map), [requirements semantics](../PROJECT_REQUIREMENTS.md), and exact roadmap task. All directly applicable Must rows are Accepted; no Proposed architecture or Deferred product work is selected.

| Owner | Controlling boundary |
| --- | --- |
| [Evaluation requirements](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#evaluation-requirements) | REQ-EVAL-002–005: separate observations, frozen directly supporting gold, exact applicable provenance, new evidence for affected changes. REQ-EVAL-001/007/008 and the shared-check table preserve provider-independent frequency and pre-observation freeze; no generation execution belongs here. |
| [Evaluation freeze and profiles](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#fixed-mvp-manifest), [gold](../../evaluation/m201-corpus-v1.json), [scan manifest](../../evaluation/rd003-scan-v1.json) | Three controlled failing profiles and predeclared acceptable passages; retain six scanner fixtures and expected native outcomes. Shared `incomplete` package must lack remediation guidance while resolving applicable text. |
| [Evidence and retrieval requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval), [lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#finding-lifecycle) | REQ-EVID-004/007/011, REQ-RETR-001/002/004–006, REQ-GEN-001/009/010; selected-only input, deterministic support/abstention versus failure, immutable scan/siblings, no invocation or review. |
| [ADR-0019](../architecture/decisions/ADR-0019-in-process-exact-vector-search.md), [ADR-0022](../architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | Unchanged broad rule/SC filter, exact cosine top three and passage-ID tie-break, authenticated closed corpus, one validated aggregate. Required-role completeness is evaluated after ranking. |
| [SPEC](../specs/SPEC.feature), [HARD_SPEC](../specs/HARD_SPEC.feature) | BHV-02 and abstention/retrieval-failure portions of BHV-03; SPEC-002, SPEC-003's `Abstain when evidence or guidance is insufficient` and `Fail retrieval without assigning a support state`; HS-006 and no-call/abstention boundary of HS-008. |
| [Application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md), [selected guidance presentation](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md#m2-03-selected-finding-guidance) | REQ-A11Y-001–004/006/009/010 and accepted citation navigation, corpus-version, focus and announcement behavior. Manual checks are visual only; full-detail actual 200% proof remains explicitly deferred to M6-03. |
| [Privacy](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md), [reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) | Content-safe local evidence, renderer isolation, independent strict checking, bounded service operation and last-valid durable truth; preserve the trusted-input limitation. |

M2-03 is Complete after [renewed closure](completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-c-post01-closure--renewed-task-closure). M2-02's [accepted capacity evidence](completed/m2-02-embedding-retrieval-capacity-gate.md#m202-closure-01--final-integrated-verification-and-documentation-impact) and [configuration observation](../LOCAL_MVP_FEASIBILITY.md#m2-02-retrieval-only-observation--2026-09-08) satisfy the upstream gate, not current runtime availability. Do not repeat the capacity benchmark or reopen its acquisition/tokenizer decisions. If actual configuration differs materially, reconcile affected evidence before evaluating it.

### M204-PLAN-01 — current project state

Planning entry is clean HEAD `1adceff9126bfdb146ee5663a839dc6bced80e4e`, 216 tracked files, empty index, and no active lease. Eleven roadmap tasks are Complete; seventeen are Not started before this selection. M1 implements the exact-three-rule walking skeleton; M2-01 owns eight sources, sixteen passages and three gold mappings; M2-02 supplies default local embedding/ranking and its passed capacity screen; M2-03 supplies authenticated citations, sufficiency, abstention, service/API and UI. Generation, human proposal review and comparison remain unimplemented. The bug index has no records.

The new planning baseline freshly passes Node 24.20.0, strict TypeScript and 119 tests from `run-contract`, `scan-normalization`, `retrieval-contract`, and `finding-sufficiency` using C-BASE below. No browser, build, live model or full suite was run for planning. M2-03's 448-test/build results and prior-client actual abstention proof are historical, not fresh M2-04 outcomes. No current runtime availability is inferred.

Preserved checkout SHA-256 values: corpus manifest `87D8867ED1138BFB38E6C44EED67A79B0A43BDAF2532A056AFAFAED828202DA9`; passages `29EA0033E825A0FA20430AA42E9718B87A87AA59EDADDA0A3876A0A7BE871850`; gold `A7D38CACF98BF263CDD53012350708BE987699DF21B4C0F1BB7F32BC1892E29B`; scan manifest `13C9722BE9EA2E3B0AAF020EA91F429A701180A83814FE7AB21BAF2DDAD57459`. These are checkout identities, separate from normalized runtime authentication. Capture all referenced fixture hashes again at execution entry.

The bounded read-only reuse audit identified [existing policy tests](../../tests/finding-sufficiency.test.ts), [service tests](../../tests/retrieval-service.test.ts), [API tests](../../tests/finding-guidance-api.test.ts), [UI tests](../../tests/finding-guidance-ui.test.ts), and the old driver's reusable responsibilities. It found no production fix justified by inspection. This is not a passing execution preflight.

## Scope and Non-Goals

Own only the M2 retrieval integration checkpoint, exact controlled case preparation, necessary test-side coverage and evidence. Production source, packages, lockfile, runtime/model configuration, frozen corpus/gold/scanner inputs, workflow tools and past evidence are unchanged by the planned route. A demonstrated current-contract production defect may receive a newly bounded Red/Green correction in this same plan after primary triage; no speculative repair lease exists now.

Exclude generation or provider probes, new models, downloads, live public scans, query tuning, role preselection, reranking, source expansion, rewritten gold, repeated benchmarking, new state/serialization contracts, workflow reset/resume, runtime testing endpoints, dashboards, a general evaluation runner, and M3/M6 execution. A new significant decision must follow its authority before dependent changes; the checkpoint itself cannot approve it.

## Plan of Work

### Ownership, risk and budgets

Follow the [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [write-lease guard](../../.codex/write-lease-guard.md), and current role TOMLs. Primary owns authoritative documents and acceptance between leases; research/review roles are read-only. Every worker write turn has a fresh Packet v2 and terminally closed lease; only one writer is active in this worktree.

The present route applies already Accepted semantics, not comparative research: no mandatory R3 research panel or new Decision Review Contract is warranted. Primary handles repository facts and ordinary execution literals. If preparation reveals a consequential unresolved decision, classify it under the [R0–R3 policy](../../.codex/README.md#research-work), record its Decision Review Contract here before comparison, and invoke only the triggered roles. Do not confuse a critical implementation/evidence review with authority to skip required decision work.

A uses one test-worker preflight and one coherent evidence assignment when needed, with the existing ordinary attempt-2 and conditional attempt-3 correction rules, plus one review correction loop. No automatic Green is scheduled. Existing covered behavior needs no write; uncovered behavior gets passing characterization. A genuine missing/regressed production behavior requires a separately frozen narrow Red/Green contract, exact source responsibility map and applicable review before it can advance. More than three TDD cycles requires rescoping. IDs, agents or pre-request failures cannot renew budgets; a worker stop returns to primary triage.

S3 review is justified for the proof's citation/record identity, real-versus-controlled evidence, preservation and teardown boundaries. Use one fresh critical reviewer for A's final helper/case package and a different fresh critical reviewer for integrated closure. The same reviewers cover necessary visual evidence; no extra UI panel. Planning receives one fresh critical readiness review with one bounded correction re-review. Independent read-only inspection may overlap primary documentation; all runtime cases and write leases are sequential.

### A — reconcile and prepare the smallest proof

On execution authorization, record M204-ENTRY-01 from the actual HEAD, symbolic ref, index, dirty-path ownership, active lease, relevant source/test/authority/installed-tool identities, frozen inputs and generated-output inventory. Historical HEAD values and consumed M2-03 roots are not entry conditions. Inventory existing build, scratch, data and retained evidence before any command that could replace them.

Freeze M204-CASES-01 in this plan before observing new real outputs: exact three seed objects or deterministic construction plus hashes; matching gold-profile subsets and target keys; source/query/model configuration; controlled adverse values below; expected assertions; exact caller/effect/cleanup packages. Gold arrays are acceptable alternatives: at least one returned passage must belong to the profile's frozen gold set, not every listed passage (some sets exceed k=3). Preserve the complete returned order/scores, gold hit/miss, resolved metadata, role coverage, sufficiency and actual state as distinct observations. No gold membership or guidance role enters the production query/ranking path.

Use test-worker preflight over the existing test/helper family. Prefer the existing thirteen suites and a single purpose-named `tests/helpers/m204-retrieval-checkpoint.ts` only for the currently missing three-profile runtime driver. If a separate case factory is necessary, `tests/helpers/m204-checkpoint-fixture.ts` owns seed/case construction, not runtime policy. No generic framework or change to the consumed M203 driver is planned. Permit only the exact needed subset of these paths and `tests/finding-sufficiency.test.ts`, `tests/retrieval-service.test.ts`, `tests/finding-guidance-api.test.ts`, `tests/finding-guidance-ui.test.ts`, and their existing M203 fixture/harness collaborators in the final packet. New helper imports must not execute model/browser/service work.

Responsibility placement: **None — no application-source responsibility changes.** The helper coordinates existing service/browser/repository boundaries and local evidence; existing validators, query projection, canonical resolver, policy and UI remain the production owners. A uses the applicable preflight/evidence route to characterize existing production behavior, not a non-TDD setup assignment. Test-owned passing characterization, seed validation, exact transition/readback checks, syntax, independent strict checking and controlled failure/cleanup probes establish the test package; no fabricated Red or Green is needed for covered behavior. Manual evaluation and primary documentation alone are **TDD: Not applicable**, with observation and semantic checks. Do not write an executable helper directly as primary or use non-TDD to smuggle production changes.

Validate preparation without live embeddings: clone frozen factories; match email/contrast gold facts and all required evidence; preserve native checks, siblings, observations and chronology; run the real validators/initial publication in exclusive test storage. Prove supported settled service readback succeeds with `interrupted: false`; after restart an active run is historical/interrupted, never resumed. Exercise launch failure, malformed output, deadline, early assertion failure and orderly teardown using bounded existing test seams, not a second cleanup platform. Accept the actual caller, helper diff and fresh S3 review before C-REAL. Missing paths or binding choices remain a preparation gate, not worker discretion.

### B — execute the fixed checkpoint

| Case | Input and proof lane | Required observation |
| --- | --- | --- |
| G1/G2/G3 | Exact `informative-image-alt`, `form-input-label`, `text-contrast` failing-profile seeds matching M2-01; three separate sequential actual service lifetimes | One explicit UI guidance action per case; real HTTP, uninjected default EmbeddingGemma retrieval, authenticated citation view, selected-only publication and validated readback. At least one frozen acceptable gold passage; exact returned top-three support assessed honestly, including legitimate abstention. |
| S | Complete image Finding and the canonical criterion/interpretation/remediation triple from `imagePassages` in the M203 fixture, with existing controlled scores | Controlled service/disk plus UI eligibility; active unfinished owner retained, no result/proposal/invocation/review. This is a policy/integration control, not real ranking evidence. |
| A | Same complete image Finding; only `wcag22-sc111` at score 0.9 | Shared frozen `incomplete` package: interpretation and remediation absent, applicable text resolves; terminal explanatory abstention, missing remediation named, no generation call or review. Exercise real service/publication with the existing test-only executor and browser view. |
| Z | Same valid Finding; empty ranked passages | `missing`, visible exact corpus version despite zero passages, terminal abstention, unchanged scan/siblings. |
| C | Existing pure policy vector: the canonical image triple plus unresolved pair `h37-text-alternative` / `understanding111-intent` | `conflicting`, exact references/explanation/no-call policy and isolated FindingOutcome display; normative WCAG precedence also passes. Separately prove a forged conflict cannot enter the fixed canonical aggregate. Do not claim real corpus conflict or persisted-conflict integration. |
| F | Existing service executor throws bounded `embedding-failed` | Durable selected Finding failure; no support, analysis-result abstention, ProviderInvocation or review; scan/siblings retained; visible failure. |
| I | Scoped in-memory corpus-read substitution with altered passage bytes, restored afterward; canonical files unchanged | Actual authentication fails before a partial citation view can publish; selected failure is durably bounded with no support or abstention. Add only the missing service-level altered-byte case if current read-fault plus policy coverage does not prove this joined path. |

Cases S/A/Z/F/I use explicitly test-only injected collaborators and isolated storage, never ordinary user data or a production test API. If an exact browser-to-service lane is absent, the test worker adds the smallest passing integration characterization; do not intercept a guidance success and call it real service proof. Case C deliberately remains policy/display plus authenticated-rejection evidence because the accepted snapshot is conflict-free. If required acceptance cannot be satisfied by these honest layers, stop for the controlling corpus/requirement decision rather than bypass validation or silently weaken the checkpoint.

G1–G3 use one fresh root per case under the future absent `temp/m204-retrieval-checkpoint` root. A seed is a project-owned synthetic completed scan built through the repository's normal initial publication boundary, not a claim of a freshly observed browser scan. Reuse recorded scanner fidelity and its regression tests; retain each seed's exact construction/provenance. Only the Analyze response may be intercepted to show that already persisted seed. Guidance, default retrieval, canonical resolution, writes and validated readback remain actual. Capture returned versus disk versus repository/service equality and the native/parent/sibling projection before/after.

Request execution authorization for a maximum of three explicit actual guidance activations, one per gold profile; preparation must freeze the corresponding model-request/input budget and deadlines from the existing default engine before use. Each fresh process may build its sixteen passage vectors and query vector; those cold starts are necessary isolation, not three capacity screens. No repeated sample, automatic retry, fallback or tuning. A semantic gold miss remains failed case evidence; complete unaffected authorized cases unless a shared integrity/runtime/safety fault invalidates their prerequisites. New model requests after the allowance require owner direction.

### Existing presentation verification

The [frontend-quality skill](../../.agents/skills/frontend-quality/SKILL.md) applies only to the visible-state proof. `REUSE_AS_IS`: App's current selection/announcement coordination, `FindingGuidance` action/status, `GuidancePassages` citations/notices, `FindingOutcome` explanations, and the grouped list/native-evidence owners. No layout, CSS, action, component or dependency addition is planned; no frontend-visual Green lease is opened merely to run a browser.

Reuse current UI suites for keyboard/focus/announcement semantics, in-flight selection, disabled actions, citation popup isolation and empty corpus-version labeling. Inspect actual G1–G3 citations in the current built UI and one shared abstention detail at 1280×800; use one 320×800 sample for long text/notices. Check complete text and original links, clear source/ranking/support distinctions, visible focus and no clipping. Freeze exact automated/manual observations and build/browser identity before running them. No screenshot archive, exhaustive state-by-viewport matrix or spoken-output claim. Full-detail actual 200% stays at M6-03 under the explicit owner deferral. A reproduced rendered defect triggers primary reconciliation and the skill's bounded visual contract before any UI source edit.

## Concrete Steps

All commands use PowerShell 7 from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Load only the first definitions block under [README development preparation](../../README.md#development-command-preparation) in each shell; do not run the adjacent install block. The maintained `Invoke-M105Command` disables compilation caching and restores its environment; browser commands also use its approved scratch. Existing dependencies/browser are prerequisites, not a download grant.

### C-BASE — safe entry check

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'Git status failed' }
git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'HEAD read failed' }
git diff --cached --name-status
if ($LASTEXITCODE -ne 0) { throw 'Index read failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Wrong Node runtime' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts tests/retrieval-contract.test.ts tests/finding-sufficiency.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Pure checkpoint tests failed' }
}
```

Planning result: exit 0, strict check passes, 119 tests pass with zero failed/skipped/todo. No build, service/browser, model or canonical run is created. Counts may change with justified tests; never suppress cases to retain this count.

### Future caller package — unresolved until prepared

These slots are not runnable permission. Primary records complete exact callers, cwd, installed prerequisites, native exit handling, required structured results, input/output paths, permitted metadata/effects, deadline and cleanup before the relevant preflight/lease or primary evaluation. Syntax-parse compound PowerShell and test decisive failure branches, not only successful subcommands. Reuse the [command-preparation procedure](../../.codex/execplan-implementation-workflow.md#command-preparation).

| Slot | Binding content to freeze |
| --- | --- |
| C-LEASE | Exact guard start/close from each Packet v2, returned digest and required `closed-compliant`; no worker guard/Git writes. |
| C-PREP | Exact seed/factory/helper validation and targeted characterization callers; expected output/temporary storage, no actual model calls. New helper must exist after its evidence turn; do not execute the consumed M203 command. |
| C-CASES | Exact selected existing policy/service/API/UI cases plus necessary additions; per-suite scratch and cleanup; serialized filesystem mocks restored in finally and isolated from real runs. |
| C-BUILD | Independent pinned strict compiler and `vite build --configLoader native`; either prove current build/source correspondence or explicitly preserve/replace the inventoried `dist/client` output. No blind overwrite or restore/install. |
| C-REAL | Task driver entry/options, current intentional HEAD/source/build identities, three exact case IDs/roots/seeds, approved runtime/model provenance and finite-input admission, actual request count/timeout, retained result fields, sequential launch/stop and failure dispositions. Missing runtime is a prerequisite failure, not acquisition permission. |
| C-VISUAL | Exact current build/browser, accepted controlled/real state, desktop plus one narrow sample, automated semantic checks and bounded manual visual checklist; no extra model request or external citation fetch needed. |
| C-FULL | Complete [thirteen-file maintained suite](../../README.md#build-and-verify-the-walking-skeleton) plus any added task test; existing per-file order/scratch, independent strict check and build. Audit the actual authoritative suite list at closure. |
| C-CLEAN | Exact task-owned processes/ports/directories/files, normal stop and settled teardown first, absolute containment/ordinary-path/ownership checks, permitted deletion versus retained evidence and build backups. Never delete a broad root, corpus, developer model/runtime or old evidence. |

## Validation and Acceptance

The primary accepts evidence, not role assertions or receipts alone. Every case records applicable fixture/target identity, exact source/test/build revision, corpus/query/filter/ordered passages/scores/support, exact runtime/model configuration, request count, canonical run/readback identity, and separate completion/failure observations. Label seeds and supplied-result tests as controlled. Generation configuration is not a ProviderInvocation. No raw pages, prompts, model payloads, credentials, external traces, vectors or private files enter tracked evidence.

Acceptance requires all three real gold cases, at least one acceptable gold hit for each, canonical citation inspection, deterministic S/A/Z/C/F/I evidence at their stated honest boundaries, no generation activity, immutable completed scan/siblings, valid aggregate readback, and required UI checks. A real result may legitimately abstain when its ranked roles are incomplete; a controlled supported case does not establish actual supported ranking. The conflict-free snapshot limitation stays explicit rather than being reported as end-to-end conflict persistence.

Run focused validation at A's boundary and the complete authoritative suite/strict/build once at task closure; broaden or repeat only for changed/stale/contradictory evidence or unresolved risk. Confirm no test skipping, unconditional pass, weakened expectation, gold-driven ranking or production test seam. A fresh integrated critical reviewer examines the complete evidence map, actual diff, mutable proof identities, integrity/preservation and cleanup, reusing valid ordinary results and reproducing risk-critical checks proportionally. Planning PASS replaces none of these gates.

The checkpoint disposition is **proceed**, **correct the current milestone**, or **record a significant decision before proceeding**, per the roadmap. A gold miss, fabricated state, unsaved success, failed required check or unresolved critical finding prevents Complete. Record failed observations before any authorized correction. Changes to frozen inputs/configuration need their existing decision/versioning route and new affected evidence; do not rewrite old results or silently alter criteria.

At successful closure reconcile public capability/developer instructions only where materially affected, roadmap, this plan, progress and indexes under the [documentation gate](../README.md#task-closure-documentation-gate). Requirements, ADRs, evaluation gold and past task plans remain unchanged unless a separately justified authoritative amendment is needed. Mark M2-04 Complete and archive this same plan only after verification and closure pass; M3-01 remains Not started until separately selected. Validate links/fragments, UTF-8, final newline, whitespace, command syntax, status consistency and `git diff --check`. No commit/push is authorized.

## Idempotence and Recovery

Read-only checks and pure tests can repeat when justified. Live guidance calls, seeded publication and browser/service startup have effects and consume their explicit budgets; a pre-request failure does not automatically authorize replay. Record whether a request actually began and preserve partial outputs. New attempts use reconciled exact ownership and allowance, never the consumed M203 roots or grants.

Close/inspect every worker lease before primary maintenance; preserve unexpected user/peer changes without reset, stash or checkout. An amended test invalidates affected prior evidence before reuse. Stop shared runtime work on integrity, ownership, deadline or uncertain cleanup faults, complete unaffected read-only work, and return genuine authority/budget gaps to the owner.

Normal service stop and awaited browser teardown precede cleanup. Preserve the last valid canonical run, failed evidence, existing developer runtime/model/tokenizer assets, prior capacity/proof directories and inventoried backups. Never clear supported ownership by editing stored state, resume a historical active Finding, or corrupt the canonical corpus to manufacture an adverse case. Assert exact owned listeners/resources have closed; a successful assertion before failed teardown is not an exit-zero proof.

## Artifacts and Notes

Planning changes only this plan, its progress record, roadmap activation and two indexes. During execution retain compact decisive case/evidence identities here and ignored synthetic run/receipt evidence under the reviewed task root; no new report platform, ledger or separate decision document.

### M204-PLAN-REVIEW-01 — accepted planning readiness

On 2026-09-09, a fresh read-only `critical_reviewer` reviewed the complete 198-line plan, exact five-file surface, controlling authorities and relevant source/test/history. Trigger: S3 citation/evidence identity, selected-only persistence, supported ownership and teardown/recovery. Verdict: **PASS for planning readiness only**, with no Blocker, Major or Minor findings. Primary accepts the result. During review, primary clarified A's applicable preflight/evidence route and reconciled roadmap/table consistency; the reviewer covered the final saved contract.

Reviewed plan SHA-256: `89E36AF76AC692BB34E1CF1A32E2960AAD52567B76028901229A1CA16392A8B0`. This identifies the pre-closure artifact, not a future executable baseline. Subsequent edits record acceptance without changing that contract. The reviewer independently confirmed current HEAD, empty index, exact five-file scope and absent active lease. It reused the fresh strict/119-test evidence and primary deterministic documentation/preservation checks; no model, browser, tests or writes were executed by the reviewer.

Primary planning validation passes five-file local-link/fragment, PowerShell syntax, UTF-8/final-newline/whitespace and `git diff --check` checks. The 216-path tracked baseline audit finds only the three intended existing Markdown changes; source, tests, packages, archived plans and frozen inputs remain unchanged. Roadmap status is eleven Complete, one planning In progress, sixteen Not started. Runtime availability, exact callers and seed identities, actual gold observations, browser proof and owned cleanup remain future gated work. No requirement, ADR, corpus or completed-task amendment is needed for this planning handoff.

## Interfaces and Dependencies

Reuse `LocalService.retrieveFinding`, `POST /api/finding-guidance`, `RunRepository` initial/update/read publication, `validateRun`, `createFindingQuery`, the default embedding/ranking engine, `resolveFindingCitations`, `classifyGuidanceSupport`, `buildFindingAnalysis`, browser admission and current guidance components. The task establishes an evaluation result and bounded test callers, not a new application API, serialization format or package. Existing pinned Node/npm, TypeScript, React/Vite, Playwright/axe, LangChain and the passed Ollama/EmbeddingGemma configuration remain the baseline.

## Revision note

2026-09-09: Created the M2-04 checkpoint plan from completed M2-03 and current source/test/authority evidence. Separated real gold retrieval from controlled adverse proof, preserved the conflict-free corpus and manual-verification limits, and planned test-only preparation plus bounded evaluation rather than another implementation subsystem. Recorded independent readiness PASS and primary planning-document closure without changing the reviewed execution contract.
