# M6-02 — Six fixed generation executions

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with [PLANS.md](../../PLANS.md).

## Current state

- **Task and scope:** [M6-02](../DEVELOPMENT_ROADMAP.md#m6-02--execute-exactly-six-fixed-generation-cases), In progress for owner-requested current-state review and plan creation only. No implementation, credential access, runtime operation or generation execution is authorized by this planning request.
- **Readiness:** M6-01, the M2-02 retrieval-capacity gate, M3-03 full-local-stack capacity gate and M3-01 freeze are complete. Public Groq documentation currently lists the exact model and strict schema support; account access/limits and actual runtime readiness remain execution-time checks, not established facts.
- **Baseline:** clean HEAD `1554cea3c0558a3c3c52e201ad24e4a2ea45b42d` at planning entry. Treat this as historical evidence, not a future HEAD constant. Active lease: None.
- **Latest evidence:** [M602-ENTRY-01](#m602-entry-01--planning-evidence) and independent critical [planning-readiness PASS](#m602-plan-review-01--planning-readiness-and-documentation). The frozen-to-runtime execution binding remains unresolved and is owned by [G](#g--freeze-the-evaluation-execution-contract), not left for a worker to invent.
- **Allowances:** zero of six fixed operations entered or generation requests attempted in this task. Execution and worker correction allowances are unopened. Planning supplies no actual-call grant.
- **Next boundary:** await owner-authorized execution. Complete G research/contract reviews and [A](#a--qualify-only-the-missing-execution-boundary) before any actual case. [Command gates](#concrete-steps), [acceptance](#validation-and-acceptance) and [recovery](#idempotence-and-recovery) control advancement.

## Progress

- [x] (2026-09-20) Review current project state, M6-01 closure, capacity evidence, frozen definitions, scoped authorities and execution seams.
- [x] (2026-09-20) Verify independent strict TypeScript, 67 generation-contract tests and all 13 frozen references without provider/runtime calls.
- [x] (2026-09-20) Draft task-scoped plan and planning activation.
- [x] (2026-09-20) Independent critical planning-readiness PASS with no findings; proportional documentation checks accepted.
- [ ] Owner authorizes execution; G binds current baseline, exact proof contract, prerequisites, commands and six-operation allowance.
- [ ] A preflight, minimum guarded caller/validation work and critical acceptance complete.
- [ ] B records the three Local and three Groq fixed cases once, with separate observations and one semantic evaluator.
- [ ] C complete regression, strict/build, different final review and documentation closure; archive only after task Verification passes.

## Surprises & Discoveries

- M6-01 is Complete with 883 maintained tests and three current actual retrieval observations. G1 still retrieves unsuitable decorative-image guidance despite complete roles; the controlled generation exception does not repair that failure.
- The runtime uses `m302-instructions-v2`; the immutable M3-01 package uses different instruction bytes. Normal request construction substitutes the runtime instructions and reserializes input. Calling it unchanged would not execute the frozen definition.
- Existing adapter preparers can consume two well-formed messages, but bind runtime configuration and schema object identity. Read-only inspection found the parsed frozen schema deeply equal to the runtime schema, while serialized property ordering differs. Semantic equality is not byte equality; G must make the exact permitted mapping explicit.
- The production proposal validator requires a scored `RetrievalResult`, and persisted invocation validation rejects evaluation-only M3-01 prompt tuples. Forging a retrieval result or a production `run.json` is not a valid bridge. The M3-01 static verification code is a reusable reference, not an executable six-case runner.
- The outer generation stage, not transport alone, owns total deadline, single-use dispatch, duplicate detection and invocation accounting. A caller bypassing that stage must prove those boundaries without introducing general orchestration.

## Decision Log

- **2026-09-20 / Primary — Planning only.** Create one M6-02 plan and keep M6-03/M6-04 unselected; no model or account operation is needed to author it.
- **2026-09-20 / Primary — Freeze preservation.** Retain the original M3-01 bytes and accepted Groq admission amendment. A newer production prompt is not permission to revise fixed inputs.
- **2026-09-20 / Primary — Bounded mechanism selection remains G.** Compare existing direct procedures before custom code. The execution bridge is not selected by this plan; its identity, privacy and replay risks require the R3 contract below before implementation.
- **2026-09-20 / Primary — No success-driven retries.** Six distinct fixed cases are the entire evaluation set. Failed or unknown outcomes remain evidence; neither code-correction budgets nor human editing replenish actual-call allowances.

## Outcomes & Retrospective

Planning is complete with independent critical readiness PASS and documentation checks; the roadmap task remains In progress for planning only. No six-case output has been generated or accepted here. The plan separates completed shared checks from future generation evidence and identifies the concrete frozen/runtime compatibility gap before any call. Execution authorization, G contract resolution and A qualification remain pending.

## Purpose / Big Picture

Demonstrate one structured-generation execution for each of the three controlled profiles through Local Qwen and the same three through Groq. A reader can trace each original result to identical frozen evidence/guidance and evaluate structure, citations, groundedness, useful remediation, human judgment, prohibited claims and completion separately. This is a six-case portfolio observation, not a provider comparison or release qualification.

## Context and Orientation

### Authorities and prerequisite evidence

The [documentation authority map](../README.md#authority-and-status-map), [project requirements](../PROJECT_REQUIREMENTS.md) and roadmap own precedence and readiness. Resolve selected identifiers through the roadmap authority-location key:

- [Evaluation authority](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): REQ-EVAL-001, 002, 004–009, fixed execution definitions, compact rubric, controlled generation input exception, Groq admission amendment and change policy.
- [SPEC.feature](../specs/SPEC.feature): SPEC-003 eligible proposal and SPEC-004 eligible-call/no-mixing/no-fallback portions; [HARD_SPEC.feature](../specs/HARD_SPEC.feature): HS-008 eligible gate, HS-009 provider isolation and HS-015 claims. BHV-03/04 identify the same derived boundaries. The accepted evaluation exception narrows actual-retrieval eligibility only for these six controlled inputs.
- [ADR-0003](../architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md), [ADR-0004](../architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), [ADR-0014](../architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md): one fixed Local configuration, passed reference-PC gate, fixed Groq model and no replacement/fallback.
- [Generation/evidence requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals), [provider requirements](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md) and [privacy](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): unchanged completeness, canonical support, validation, immutable context, payload minimization, credential and content-safe evidence obligations.
- [Agent workflow](../../.codex/README.md), [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [write guard](../../.codex/write-lease-guard.md), and [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) govern roles, research, TDD, leases and correction budgets.

Twenty-five tasks are Complete at entry. [M6-01 final acceptance](completed/m6-01-shared-deterministic-evaluation.md#m601-final-01--integrated-review-and-documentation-closure) records the exact frozen abstention, current three-profile actual retrieval, 883 tests in the maintained 46-file suite, strict/build, preserved original data and different critical PASS. Its [matrix](completed/m6-01-shared-deterministic-evaluation.md#m601-b-matrix-01--separate-shared-observations) owns shared native/synthetic/policy/public evidence. Do not replay its consumed allowances.

The [M2-02 capacity observation](../LOCAL_MVP_FEASIBILITY.md#m2-02-retrieval-only-observation--2026-09-08) passes for the exact embedding configuration. The [M3-03 full-stack observation](../LOCAL_MVP_FEASIBILITY.md#m3-03-full-local-stack-observation--2026-09-16) passes on the existing Windows reference PC: 32 GB RAM and RTX 5060 Laptop GPU with 8 GB VRAM; Qwen Q4_K_M/Ollama 0.33.3, 32768 context and 4096 output reserve. This consumes the prior screen; it is not authority for another capacity call.

M6-01 recorded the developer-managed Ollama server left running. Do not assume that process or listener still exists, take over it, restart it, or replay its startup grant. Preserve the developer's existing runtime. Runtime/model/account drift is checked during authorized G/B; no acquisition or replacement is pre-approved.

M6-03 owns the broad accessible-core-path verification; M6-04 owns final portfolio synthesis. All 200% zoom remains Deferred. M4/M5 actual review/public grants are closed. No new review decision, scan, rescan or retrieval is needed for the six independently assembled packages.

### Immutable cases, controls and meaning

[evaluation/m301-generation-v1.json](../../evaluation/m301-generation-v1.json) has SHA-256 `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`. All 13 referenced files, including the nine ignored files under `temp/m301-generation-freeze-v1/`, matched at entry. `package-lock.json` remains `38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d`.

The six manifest entries are paired by profile, not six independently rewritten prompts:

| Profile | Rule | Fixed Local case | Fixed Groq case |
| --- | --- | --- | --- |
| informative-image-alt | image-alt | Local image | Groq image |
| form-input-label | label | Local label | Groq label |
| text-contrast | color-contrast | Local contrast | Groq contrast |

Use the manifest's exact case/mode/input/instruction/schema hashes; the table labels are navigation, not new artifact identities. Its message assembly requires exactly two messages: exact frozen instruction text including final LF, then exact case input JSON text including final LF. Parse the exact frozen schema for the designated schema field; any checked equivalent runtime object must preserve the declared contract and disclose the actual wire representation. No runtime prompt substitution, reserialization of message text, additional history or case-specific instruction.

Every package has complete selected native facts and exactly three canonical role passages. Independently assembled guidance contains no fabricated score, vector, ranking or embedding provenance. Do not import M6-01 G1's real passages into this package, or portray a controlled success as improved retrieval. Preserve historical M2-04 abstentions and the current G1 semantic limitation separately.

Local uses `qwen3.5:4b` with the accepted full digest `2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd`, runtime and material settings from M3-03. Both modes preserve the manifest's 4096 output ceiling, temperature 0, top-p 1, one response, no streaming, and 120000-ms request deadline. The manifest owns all other explicit/omitted controls.

Before output inspection, bind the [accepted Groq amendment](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#groq-admission-amendment-to-the-frozen-generation-definition) with the original manifest and `m304-groq-request-bytes-v1`: at most 65536 UTF-8 bytes for the complete measured-and-sent body. This is not hosted token fit or proof of complete input consumption. Local still requires complete context fit including schema/template/protocol overhead and output reserve; no truncation or widening.

On 2026-09-20, Groq's [model catalog](https://console.groq.com/docs/models) lists `openai/gpt-oss-20b`, and its [Structured Outputs documentation](https://console.groq.com/docs/structured-outputs) lists strict mode support. The [deprecation page](https://console.groq.com/docs/deprecations) was checked; no retirement of this exact model was found. These are dated public documentation observations, not account access or continued availability. Recheck at execution, including account-specific limits without printing secrets or sending a synthetic capability request. Provider documentation never overrides local runtime validation or no-retry rules.

## Scope and Non-Goals

In scope: freeze an honest execution binding for the existing six packages; implement only the demonstrated missing caller/validation boundary; qualify it offline; execute exactly the six authorized fixed cases; evaluate original outputs against the frozen rubric; preserve local content-safe evidence and close documentation.

Excluded: new model/provider/prompt/schema/corpus/gold, tuning or output repair, extra generation calls, warm-up/capability probes, retries, fallback, batching or concurrent cases, new embeddings/scans, capacity reruns, production eligibility bypasses, canonical aggregate format expansion, retained human decisions, UI redesign, general evaluation framework, scheduler, ledger subsystem, telemetry, statistical scores, multiple semantic evaluators or provider ranking. No model/runtime/dependency acquisition, credential modification, commit or push. A meaningful expansion requires owner authority before dependent work.

## Plan of Work

### G — Freeze the evaluation execution contract

After execution authorization, record current HEAD and dirty paths, relevant source/test/caller/configuration identity, frozen references, protected run/evidence inventories and current prerequisites. Never require the historical planning SHA or an uncommitted plan. Preserve unrelated work and use fresh lease baselines consistently.

Perform the bounded R3 decision work below before choosing the execution bridge. Compare a direct documented procedure using existing adapters and M3-01 validation precedent with the smallest reusable validation/execution extraction, if needed. Neither route may fake a RetrievalResult, silently substitute instructions, or present runtime configuration labels as the actual frozen wire prompt identity. Do not build custom tooling merely because no all-in-one runner exists.

The primary authors `M602-G-CONTRACT-01` after required synthesis/review. It must bind:

- exact six-entry identity, authorization, sequential order, explicit one-case invocation syntax, exclusive output paths and anti-replay checks;
- complete frozen input/provenance/canonical support checks and schema equivalence/representation; distinction between actual message identity and adapter runtime configuration;
- current Local digest/runtime/template/parser/effective context/offload and unchanged material controls; Groq endpoint/model/defaults, accepted byte policy and private credential boundary;
- common candidate validation without synthetic retrieval provenance; full deadline, single-use attempt capability, sticky duplicate handling, normalized failures and resource-terminal cleanup;
- local evidence shape, write-before-effect/uncertainty handling, original validated output identity, secret filtering and no raw envelope/hidden-reasoning retention;
- one semantic evaluator, frozen rubric, exact per-case outcome rules, and practical Local UI/OOM observation during each call;
- exact commands, allowed paths, negative test contract, cleanup and stop rules.

No production interface expansion or persistence-schema change is presumed. Keep evaluation records separate from production aggregates unless an already-authorized truthful representation is demonstrated. The exception creates no runtime flag, route or bypass. A schema/contract incompatibility that cannot be resolved within unchanged semantics returns for owner decision; do not amend M3-01 to unblock a caller.

Public documentation checks and owner-provided non-secret account-limit information are permitted prerequisites. Adapter-owned runtime metadata/credential checks occur only within the bound actual case, not a separate synthetic generation probe. Define request accounting separately for metadata and generation. Missing credentials or runtime may block B while unaffected A/C diagnostics continue.

### A — Qualify only the missing execution boundary

Use workflow ID `m602-six-fixed-generation-executions`, with one coherent `A-fixed-case-execution` slice unless G demonstrates separable responsibilities. Primary supplies the exact Milestone Assignment Packet v2 and responsibility contract; custom roles retain their configured model pins.

Use read-only `test_worker` behavior preflight. `EXISTING_AND_COVERED` reuses current evidence; `EXISTING_BUT_UNCOVERED` uses guarded `evidence` characterization without fabricated Red. Missing/regressed executable behavior uses test-worker Red → accepted test boundary → separate `code_worker` Green/optional behavior-preserving Refactor. Test-only helpers for existing-path characterization remain test-owned; a new substantive execution or validation mechanism is not disguised as a test fixture or non-TDD setup. The preflight classification and exact ownership resolve that distinction before writing.

Candidate paths are a purpose-named M6-02 test and bounded helper under `tests/`, plus only specifically justified existing generation validation/execution modules if extraction is necessary. This is not a broad lease. G freezes exact files, symbols and permitted structural refactor before dispatch. Documentation remains primary-owned; frozen files, historical results, credentials, Git metadata and unrelated source are forbidden.

Responsibility placement: frozen package authentication, one-case execution and output validation are distinct current concerns; reuse existing canonical support, adapter fit, HTTP transport and validation logic. Avoid copied provider implementations or a second diverging proposal policy. No production module imports test helpers or local frozen files. A test-only caller must not become a generic framework; production extraction is permitted only when current duplication or the accepted contract demonstrates its necessity.

Each worker write turn needs a primary-opened lease and fresh packet/digest, terminal compliant close, actual diff inspection, strict/focused evidence and cohesion disposition. One lease per worktree; primary documentation/guard maintenance occurs between leases. Accepted tests remain unchanged during Green. Workers use Git read-only.

Offline qualification covers at least: frozen-byte/canonical/profile mismatch; changed instruction or message newline; schema drift; missing/conflicting roles; Local full-fit and Groq boundary/body correspondence; immutable mode/exact endpoint; zero calls on pre-call failure; duplicate/reentrant dispatch; timeout/abort/ambiguous result; malformed, incomplete or prohibited candidate; invented references; secret echo; occupied output path; result-publication/cleanup failure; re-entry after uncertain effect. Use existing controlled transport doubles, never real calls for negative tests. Default tests must not require ignored inputs or credentials, and an opt-in real command must fail closed rather than skip missing prerequisites.

Fresh S3 `critical_reviewer` acceptance is required before any actual-case use: the named triggers are credentials/egress, frozen identity, single-attempt accounting and cleanup/recovery. Initial and one ordinary correction write per unchanged role/phase chain; attempt 3 only under the workflow's explicit progress/new-evidence/changed-action/expected-benefit conditions. One review-correction loop uses remaining budgets. Stop repeated decisive failure without new evidence, two no-diff handoffs, changed binding fields or exhaustion; primary triages without resetting counters. Consult the [bug index](../bugs/README.md) for substantive defects.

### B — Execute six fixed cases and apply the frozen rubric

Only after owner execution authorization, G acceptance, A critical acceptance, exact prerequisite confirmation and zero unresolved required gaps may B begin. Freeze the order before output inspection: the three Local profiles sequentially, then the same three Groq profiles sequentially. Each entry is an explicit single-case operation, never a loop/batch command that automatically continues after failure.

One future execution authorization for this plan covers at most one entry per fixed case and one generation dispatch per entry, six maximum. Track six-entry status, whether dispatch actually occurred, response/validation outcome and remaining allowance in this plan and the bounded local result records. Do not claim a pre-call failure is a generation execution. An entered operation with no call is still not automatically replayable; ambiguous dispatch consumes its allowance pending explicit owner disposition. No seventh call, warm-up, retry or replacement is authorized.

Run on the reference PC with the current application available for a small existing-UI responsiveness observation during each Local call, without Analyze, retrieval or another Generate. G binds the exact benign interaction, time correlation, readiness/stop procedure and readily observable memory/OOM evidence; no new UI, benchmark tool or numeric performance gate. The prior capacity screen cannot prove these three calls remained usable. If an in-call observation is missed, report the missing proof and do not repeat generation to obtain it. No new embedding work is needed to populate a synthetic full-stack claim.

Before each operation, confirm its unconsumed identity, unchanged frozen/wire configuration, protected paths, private output destination and current necessary prerequisites. Use the fixed adapter; credential material stays inside Groq's existing secret-handling path and is neither printed nor inspected in chat. Record metadata/request counts and whether invocation started honestly. Preserve original evidence on any failure.

Stop subsequent actual generation at the first invalid/failed/unknown case, Local OOM/unusable interface, model/configuration drift, suspected secret exposure, identity discrepancy or cleanup uncertainty. Preserve the failure and complete unaffected offline/documentation work. ADR-0003/0014 and the frozen failure interpretation require owner disposition where the fixed configuration fails; do not switch model, provider, cap or prompt. Corrections and any new evidence campaign follow REQ-EVAL-005/007 and cannot silently replenish this six-case set.

One semantic evaluator applies the frozen M3-01 rubric to original outputs. Primary may fill that role; independent reviewers audit method, binding and evidence rather than becoming extra semantic scorers. For each profile keep structural validity, reference/citation validity and actual support, groundedness, remediation usefulness, confidence/uncertainty, blocking judgment/reminder, prohibited claims and provider completion separate, using the frozen pass/fail/not-run vocabulary. Mechanical pass does not prove semantic support. A human edit cannot retroactively pass the original answer and no actual review decision is created by scoring it.

Retain separate Local and Groq sections here, with one row per case, relevant identity, outcome, separate dimensions, original validated-output reference/hash and limitations. Detailed validated proposals stay in ignored local evidence; tracked text contains no prompts, raw responses, screenshots or private payloads. Do not retain raw provider envelopes, invalid secret-bearing content or hidden reasoning. G defines safe bounded failure evidence. Shared deterministic outcomes are linked to M6-01, not rerun as additional fixed cases or claimed as actual retrieval for controlled packages.

### C — Verify integration and close documentation

After the last accepted executable change, run the current maintained full suite (46 files/883 tests at entry, plus accepted additions), independent strict TypeScript and current build. Run focused checks at earlier boundaries; reuse a valid full run under the complete evidence-identity rule rather than repeating it at handoff. No real-call replay is part of regression.

A different fresh `critical_reviewer` audits the integrated six-case count, frozen/actual wire binding, validated and semantically interpreted original results, Local usability/OOM evidence, secret filtering, preservation, cleanup and documentation. It may inspect retained evidence read-only and reproduce offline risk-critical checks; it cannot make a seventh request.

Task completion requires its Verification, not merely six terminal records. Any failed case or unmet Must keeps completion unmet; report exact completed/failed/not-run entries and obtain necessary owner disposition without relabeling failure as success. Mark Complete and archive only after all required evidence, final review and the [documentation closure gate](../README.md#task-closure-documentation-gate) pass. Reconcile roadmap, instructions, plan/progress navigation and materially affected summaries; M6-03/M6-04 remain unselected.

## Decision Review Contract

**Owner/artifact:** M6-02, `M602-G-CONTRACT-01` inside this plan. **Tier:** R3 for the execution-bridge decision: frozen versus runtime identity, private egress/credential handling, one-call capability and uncertain-result recovery. Planning has mapped facts only; it has not selected the mechanism or started this decision's execution research.

**Question:** What is the smallest truthful, testable way to execute the six unchanged packages through the accepted providers while retaining the common validation and failure contract without fake retrieval or production provenance?

**Unranked candidates for G:** direct documented assembly around existing adapter factories plus reusable M3-01 static-validation logic; or minimal extraction/reuse of production validation/execution primitives with a narrowly scoped evaluation caller. Eliminate any candidate requiring changed frozen messages, fabricated RetrievalResult, false invocation identity, skipped validation, duplicated provider stack or general workflow machinery. A successor manifest/architecture change is an owner decision, not a third implicit implementation route.

**Criteria:** exact accepted semantics/bytes, authentic provider path, full admission/validation and privacy, honest minimal records, no-replay/cleanup truth, maintained testability, responsibility cohesion and least code/procedure. Hard gates outrank convenience. No provider ranking, cost study or model research.

**Routing/budget:** At execution, primary supplies a Research Assignment Capsule v1 with exact sources and this invariant packet. One bounded non-ranking discovery pass may close remaining source questions. Assign one `critical_researcher` to the coupled identity/validation/attempt-boundary question; split only a demonstrably independent unresolved critical dimension. Each assigned researcher has one initial report plus one bounded follow-up. Mandatory `decision_analyst` returns DRAFT READY, RETURN FOR RESEARCH or OWNER DIRECTION. Require a fresh `critical_research_reviewer` pre-draft checkpoint, primary-authored contract, and a different final critical research reviewer. No drafting agent is needed. Apply canonical research correction/stopping limits; never treat role capacity as a staffing target. Required implementation reviews remain separate S3 acceptance of executable code.

| Invariant | Trigger / expected result | Proof and reviewer |
| --- | --- | --- |
| G1 completeness and authority | Every six-case contract/command/retention field resolved; unknown model/account facts stop affected execution | Analyst and both contract reviewers inspect entire artifact; pending G |
| G2 frozen identity | Corrupt hash/newline/order or wrong case rejected before effect; exact messages and schema meaning preserved; runtime labels never misstate actual prompt | Critical researcher; offline vectors and contract reviewers |
| G3 truthful support | Wrong/missing/conflicting canonical guidance rejected or abstains without call; no scored RetrievalResult invented; same candidate validation rules | Researcher plus A critical validation review |
| G4 privacy and fit | Fixed destination/model, only minimized selected content, credential transport-only, no truncation; complete Local fit and measured/sent Groq bytes | Researcher plus negative/native-double evidence |
| G5 one operation and recovery | Occupied/entered/unknown case cannot replay; duplicate/abort/deadline cannot silently dispatch again or erase attempted provenance | Researcher plus A critical failure-path reproduction |
| G6 evidence honesty | Failed output remains failed, original preserved, one semantic evaluator, Local usability observed; no six-case completion with unmet mandatory evidence | Analyst, primary evaluator and different final implementation reviewer |

Decide the interface, provenance representation, validation equivalence, operation-consumption point, failure policy and retention boundary now in G. A/B prove those defined semantics; they cannot decide them after seeing output. Re-run the full invariant packet after a material revision. A required scope/authority change or exhausted budget returns to the owner. No R3 verdict grants provider calls without execution authorization and A acceptance.

## Concrete Steps

Working directory: repository root, PowerShell 7. Load only the definitions under [Development command preparation](../../README.md#development-command-preparation), which supply `Invoke-M105Command`, pinned Node and exact environment restoration. Do not replay adjacent npm-ci, archived generation, acquisition or cleanup commands.

### M602-CMD-ENTRY — Read-only planning/re-entry

```powershell
git status --short
git rev-parse HEAD
if (Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json') {
  throw 'Reconcile active lease before M6-02 maintenance or execution'
}
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) {
    throw 'Pinned Node runtime unavailable'
  }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Independent strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/generation-contract.test.ts tests/ollama-generation-contract.test.ts tests/groq-generation-contract.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Generation contract tests failed' }
}
```

Expected planning result: strict check and 67 tests pass; no browser, actual credential, local runtime or provider access. Actual counts may change with a reconciled future tree; never impose a historical count as a runtime assertion.

### Future command slots

These are blocking placeholders, not executable commands. G freezes exact values and A proves them before use.

| Slot | Required binding |
| --- | --- |
| IDENTITY | Intentional current HEAD/dirty paths, source/test/caller/config hashes, all 13 recursive frozen references, protected original runs/evidence, ordinary path topology and developer prerequisites; no private content output |
| OFFLINE | Exact focused commands/flags, injected doubles, deadlines, scratch and expected assertions; production extraction uses accepted Red/Green ownership |
| PREPARE | Minimal explicit task-owned output location, exclusive creation/permissions and inventory, exact build/scratch/application/browser setup, before/after mutation list; no lock/manifest regeneration or installation |
| LOCAL CASE | Exact one-case command for each Local profile, fixed runtime/model/settings, whole-message fit, metadata request bound, single dispatch, deadline, private evidence, in-call UI/OOM observation and normal stop |
| GROQ CASE | Exact one-case command for each Groq profile, public documentation/account-limit check, fixed credential source without exposure, manifest+amendment binding, measured/sent body, single dispatch, bounded result and cleanup |
| READBACK / RUBRIC | Validate recorded identity/outcome/proposal without execution; original-output binding, one-evaluator checks and tracked content-safe summaries |
| FULL | Current maintained sequential complete suite, accepted additions, independent strict/build, no concurrent service/browser use and capture/actual-case flags absent |
| CLEANUP / DOCS | Exact owned processes and disposable child paths only, ordinary-path/link/content guards and expected effects; preservation and environment restoration; links/status/format/PowerShell checks and git diff --check including separate untracked-file inspection |

Resolve dependencies before an affected lease; workers may not invent commands or credentials procedures. If a slot is unnecessary, mark it Not applicable with evidence. A metadata/account problem is not permission for a synthetic provider probe. No shell loop may execute the six real requests unattended.

## Validation and Acceptance

G/A acceptance requires complete frozen and canonical validation, tested no-effect failures, common output validation, honest configuration/wire identity, bounded attempt/deadline/cleanup and no credential/payload leakage. Receipts and worker summaries support, but do not replace, primary inspection of actual code, responsibility placement and evidence.

B acceptance requires exactly three Local and three Groq attempted fixed generation executions on the same unchanged packages, each with its original outcome and all required observations. Pre-call failures and not-run cases cannot fill the six-execution count. Every happy case must satisfy runtime validation and the frozen happy-case rubric; separately record each failure rather than computing a product score. Local calls must complete sequentially without OOM or unusable interface. Any material evaluated input/adapter/configuration change follows the new-binding/new-evidence authority before further output inspection; never mix an unacknowledged changed configuration into the six-case result.

Final acceptance additionally requires current authoritative regression, independent strict/build, preserved frozen/original evidence, correct private/tracked boundary, different final review and documentation closure. This task does not prove actual retrieval returned the controlled guidance, broad model quality, hosted complete input consumption, public accessibility, hardware support or release readiness.

## Idempotence and Recovery

Re-entry starts read-only: inspect current task/contract, original six-entry allowance, exclusive local records, actual effects and owned process state. Never infer no request from no response or missing result file. An uncertain operation stays consumed/unknown; do not replay it to discover what happened. Preserve partial records and use readback/offline investigation.

G must define a minimal durable consumption boundary before possible dispatch and how publication failure is reported. Prefer existing exclusive-file/directory primitives and six bounded records; do not invent a transactional job runner, retry graph or resumable generation subsystem. Code corrections do not replenish provider allowances. New calls, replacement cases or changed manifests require explicit owner/authority disposition and preserve earlier failed evidence.

Preserve all original `data/runs`, frozen corpus/evaluation artifacts and historical ignored evidence, including M6-01 failure and successful retrieval roots. No raw content enters tracked documentation. Stop only task-owned application/browser processes, restore their environment, then remove only verified ordinary disposable child paths named in G. Never recursively remove `temp`, `data/runs`, browser/model roots or unknown contents. Do not stop or restart the developer-owned Ollama runtime. Cleanup uncertainty stops advancement and remains visible.

Missing frozen files require byte-identical recovery under M3-01's existing contract or an owner-approved successor freeze, not reconstruction from memory. Missing runtime/account prerequisites are not implementation defects; finish unaffected work and request only the material missing prerequisite. No fallback or acquisition is implicit.

## Artifacts and Notes

### M602-ENTRY-01 — Planning evidence

On 2026-09-20, clean HEAD `1554cea3c0558a3c3c52e201ad24e4a2ea45b42d` includes completed M6-01. Primary reviewed current authorities, roadmap, capacity/freeze/prior-provider evidence, specification boundaries and maintained commands. One read-only explorer mapped source/test seams and compared frozen schema/instruction identities; no mechanism was selected or implemented.

Fresh independent strict TypeScript and **67 generation-contract tests** pass with zero failures/skips. All 13 M3-01 file references and the original manifest/lock hashes match. Fourteen retained run directories exist, and no active lease is present. Public Groq documentation checks are linked above; no credential, account request, local runtime request, browser or actual model call occurred. The historical 883-test closure is not a freshly executed complete suite in this planning turn.

### M602-PLAN-REVIEW-01 — Planning readiness and documentation

On 2026-09-20, a fresh read-only `critical_reviewer` returned **PASS**, with no Blocker, Major or Minor finding and no missing mandatory planning requirement. It inspected the complete plan, applicable authorities and source/worker boundaries, including exact frozen messages, controlled support, validation, six-operation accounting, privacy, recovery, R3 routing, ownership and YAGNI. It confirmed only the six expected planning/status/navigation documents changed. It made no edits, ran no tests and accessed no credential, runtime or provider.

Primary accepted this as readiness to begin G after owner execution authorization, not acceptance of the unresolved mechanism or permission to start a worker lease or actual case. G must freeze the binding and commands; A must qualify them. Current runtime/account readiness, original outputs and per-call Local usability remain unverified.

Proportional checks pass across the six changed documents: local files/anchors, all seven PowerShell blocks, all sixteen required plan sections, UTF-8 without BOM, final newlines, trailing whitespace, status consistency and `git diff --check`, including direct inspection of the two untracked documents. Twenty-five tasks remain Complete, M6-02 alone is In progress, and M6-03/M6-04 remain Not started. Documentation impact is limited to this plan, its progress record, roadmap planning activation, plan/progress indexes and the README status summary; no requirement, ADR, product contract or scope changed. No implementation or actual-call result is claimed.

## Interfaces and Dependencies

Existing boundaries include `generation-input.ts`, `generation-stage.ts`, `proposal-contract.ts`, `generation-contract.ts`, the two adapter factories, their fit/model/HTTP modules, canonical corpus/support helpers and the frozen manifest. The [M3-01 static verification precedent](completed/m3-01-generation-evaluation-package.md#m301-command-02--resolved-preparation-validation-and-closure-callers) is read-only reference material, not replay authorization.

No new dependency or product API is selected. G determines whether a bounded caller can reuse these boundaries directly or needs a minimal shared validation extraction. Existing production eligibility, persisted invocation allowlists and aggregate structure stay intact. The caller may produce task-local evaluation evidence; it must not assert a fabricated production run. Every prospective source change declares its exact responsibility, dependency direction, reuse/extraction rationale and test/implementation ownership in the existing assignment packet before coding.

## Revision Note

2026-09-20: Created for owner-selected M6-02 planning after completed M6-01. The plan preserves six immutable cases, names the frozen/runtime identity and validation gap, assigns bounded R3 contract resolution before writes/calls, and excludes retries, model changes and later tasks. Execution remains unauthorized until separately requested.

2026-09-20: Recorded independent critical planning-readiness PASS with no findings and proportional documentation closure. G's unresolved contract remains an explicit future gate; no execution result or allowance was opened.
