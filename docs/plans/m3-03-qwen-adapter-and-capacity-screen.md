# Integrate Qwen Local generation and verify reference-PC capacity

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M3-03](../DEVELOPMENT_ROADMAP.md#m3-03--integrate-qwen-local-generation-and-run-its-capacity-screen), In progress for owner-requested project review and planning only. No implementation, acquisition, runtime request or capacity execution is authorized by this planning request.
- **Accepted entry:** [M303-PLAN-01](#m303-plan-01--reviewed-project-state); M3-02 and the separate EmbeddingGemma gate are Complete. [M303-PLAN-REVIEW-01](#m303-plan-review-01--accepted-planning-readiness) records independent planning PASS and documentation checks, not execution readiness.
- **Gates:** Execution authorization, refreshed entry/freeze, [P metadata screen](#p--metadata-exclusion-before-acquisition), developer-owned setup, and [G runtime contract](#g--freeze-the-adapter-and-proof-contract) precede dependent implementation. Actual eligible retrieval and the representative UI boundary remain unresolved; [C](#c--one-manual-real-local-stack-capacity-smoke) cannot silently substitute either.
- **Ownership/budget:** No active lease. Planning used one fresh critical readiness review with no correction/re-review needed. Future G research and A/B write/review allowances are unconsumed; [budgets](#agent-workflow-and-budgets) own them. No historical M2/M3 grant is reusable.
- **Next:** Await exact-task execution authorization. Then refresh entry, perform P and any permitted developer setup, resolve G, implement A/B, and pass C plus closure. Unaffected authorized work may proceed when a later proof is blocked.

## Progress

- [x] (2026-09-10 17:02Z) Reviewed roadmap-wide state, M3-02 contracts/closure, local-capacity authorities, current source seams and fixed evaluation limits.
- [x] (2026-09-10 17:02Z) Passed independent strict TypeScript, 99 focused tests, original manifest identity and four source/nine local artifact hash checks.
- [x] (2026-09-10 17:13Z) Accepted fresh critical planning PASS without findings and proportional documentation/preservation checks; M303-PLAN-REVIEW-01 owns the limits.
- [ ] Receive execution authorization; refresh current Git/lease/runtime/frozen-input identity.
- [ ] Pass P with documented working-set/storage safety margin before acquisition; complete only permitted developer setup.
- [ ] Accept G literals, actual-artifact accounting evidence, exact commands and mandatory R3 checkpoints.
- [ ] Complete A: fixed Qwen metadata, complete request accounting and bounded wire contract through independent Red/Green/review.
- [ ] Complete B: one-attempt adapter and internal service integration through independent Red/Green/review.
- [ ] Resolve C's real eligibility and representative-interface prerequisites; perform the one manual exact-configuration smoke.
- [ ] Pass complete regression, strict/build, different fresh integrated review and documentation closure; archive only after M3-03 is Complete.

## Surprises & Discoveries

- M3-02's shared fit validator checks a trusted report; it does not count Qwen tokens. The actual adapter must prove the exact request, template/schema overhead and effective configuration before transport. A post-response token count cannot establish pre-call fit.
- Existing embedding fit admits 63 preverified inputs, not arbitrary text. All three actual M2-04 retrieval observations abstained. A different page, a reopened aggregate or M3-01's independently assembled guidance cannot be assumed to supply a live supported production Finding.
- The roadmap's smoke includes a usable single-reviewer interface, while Generate UI and human-review UI are later tasks. Existing browser responsiveness can be observed, but this plan cannot relabel it as unimplemented review behavior or move later UI work into M3-03.
- The original M3-01 manifest hash now matches after M3-02 recovery. There is no current byte-recovery task. Historical M3-02 BUG-0001 is Verified; protect its metadata/serialization regressions rather than reopening its consumed correction budget.
- Current Ollama context documentation lists a 4k default below 24 GiB VRAM. The shared output reservation alone is 4096 tokens. A usable complete request therefore needs an explicitly verified larger effective context; no particular context size or capacity PASS is selected during planning.

## Decision Log

- Decision: Activate only M3-03 planning. Rationale: creation of an ExecPlan is not execution or model-acquisition authorization. Date/Author: 2026-09-10 / primary.
- Decision: Reuse M3-02 through two behavioral slices followed by one manual capacity proof. Rationale: fixed request admission and actual transport integration are distinct current responsibilities; the real-device observation has no meaningful TDD Red. Date/Author: 2026-09-10 / primary.
- Decision: Preserve unresolved eligibility/UI proof boundaries as explicit gates. Rationale: narrowing a required real smoke or extending the six-case exception requires its controlling authority, not a worker workaround. Date/Author: 2026-09-10 / primary.

## Outcomes & Retrospective

Planning identifies the smallest existing integration seam and the prerequisite decisions needed to use it truthfully. No application, test, dependency, frozen evidence or runtime state has changed. Qwen availability, context accounting, generation quality and reference-PC capacity remain unproved. Planning readiness is distinct from permission or ability to run the smoke.

## Purpose / Big Picture

An explicit eligible Local action should use the fixed locally present `qwen3.5:4b` through the approved Ollama loopback boundary, return one candidate to existing shared validation, and durably publish a valid pending proposal or bounded failure. Missing prerequisites and input-fit failures create no invocation; an attempted transport failure retains truthful provenance. Scanner, retrieval, sibling evidence and immutable run mode stay intact.

The task additionally proves the exact local configuration can complete the required representative workload on the reference PC without out-of-memory/storage failure or an unusable interface. Test doubles prove adapter boundaries, not that capacity outcome. Passing capacity does not prove remediation quality, broad support, offline operation or release readiness.

## Context and Orientation

### M303-PLAN-01 — reviewed project state

Entry is clean HEAD `4f3140eaecb92304df07d236f575375c4dab92e9`, 240 tracked files and no staged changes. This is historical evidence, never a future executable HEAD comparison. Fourteen roadmap tasks are Complete: RD-001–RD-003, M1-01–M1-05, M2-01–M2-04 and M3-01–M3-02. This request selects M3-03 for planning; thirteen later tasks remain Not started.

Current capabilities include exact-three-rule scanning, minimized evidence, loopback service/single-file persistence, Analyze/Results, the closed corpus, real local embedding retrieval, deterministic support/abstention, pure proposal validation and internal durable generation continuation. Actual Local/Groq generation adapters, Generate UI, human review and comparison are not implemented. M6-03 retains the owner-deferred full-detail 200% visual check.

[M3-02 final acceptance](completed/m3-02-shared-generation-stage.md#m302-final-01--final-integrated-review-and-documentation-closure) records 500 tests across sixteen suites, strict/build, separate-owner A/B/C, critical reviews and closure. Those full-suite/build results are retained, not rerun during M3-03 planning. Fresh pinned Node v24.20.0 strict checking and `run-contract` 68 + `generation-contract` 8 + `generation-stage` 23 tests pass: 99 total. The manifest hashes to original `63770583A97E1D0517337474DADC706C1047D78E026E22C7A745CE7674ED9E6B`; all thirteen path/hash references match. No provider or browser request was made.

[M2-02](completed/m2-02-embedding-retrieval-capacity-gate.md#m202-closure-01--final-integrated-verification-and-documentation-impact) separately passed the actual EmbeddingGemma capacity gate. Its 3846.0786-ms cold retrieval and qualified driver-cleanup observations are historical retrieval-only evidence. Developer-owned runtime/artifact retention does not establish current liveness, grant process control, or pass Qwen capacity. Use current scope/evidence links; do not replay its large historical setup/recovery procedures.

A bounded read-only source explorer confirmed these seams while primary reviewed authority: `GenerationAdapter`/`PreparedGeneration` in `src/server/generation/generation-contract.ts`; `executeGeneration` in `generation-stage.ts`; fit validation in `generation-fit.ts`; source-owned artifacts and input assembly in `generation-artifacts.ts`/`generation-input.ts`; internal `LocalService.generateFinding(input, adapter)`; and existing selected-generation publication. `src/server/retrieval/ollama-http.ts` shows native HTTP/abort/UTF-8 patterns but its protocol and errors are embedding-specific. Its model validators and finite input table are not generic Qwen components.

### M303-PLAN-REVIEW-01 — accepted planning readiness

A fresh read-only critical_reviewer passed the complete five-document candidate against the selected authorities, shared accounting/transport contract, module responsibilities, leases/budgets and actual capacity-proof limits, with no Blocker, Major or Minor. The reviewed plan's SHA-256, captured by primary before verdict reconciliation, was `46BFD82BF823B75092B038B35AA1844D16E187A3F70F3CE98B1A92E96F22558B`; this receipt and current-state maintenance are later non-contract edits, not a claim that the maintained document retains that hash.

The reviewer independently confirmed HEAD, the documentation-only working state, no active lease pointer, original manifest identity and passing git diff --check; it inspected the actual generation/service and finite embedding boundaries. It reused primary's fresh strict/99-test and thirteen-reference evidence and ran no model/browser operation. Primary accepted all five documents' local links/anchors, PowerShell parse, UTF-8, final-newline and whitespace checks. All 237 tracked files outside the three intended existing-document edits match the 240-file entry fingerprint; the plan and progress record are the only new files. Roadmap status is fourteen Complete, one planning-only In progress and thirteen Not started.

Planning used one review and no correction loop. P, G, developer setup, implementation and actual capacity remain unexecuted. The useful distinction is that a safe plan may gate unresolved real proof without approving a synthetic substitute or narrowing task Verification. No requirement, ADR, application, test, dependency or frozen artifact changed.

### Controlling authority route

Read the [roadmap task](../DEVELOPMENT_ROADMAP.md#m3-03--integrate-qwen-local-generation-and-run-its-capacity-screen) and [project requirements](../PROJECT_REQUIREMENTS.md), then each selected identifier in its owner:

- [Generation provider execution](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): REQ-LLM-003/005/007/009/011/021; preserve shared REQ-LLM-001/008/019 and fixed controls.
- [Installation/model lifecycle](../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): REQ-INST-005/017, with 003/004/006 defining developer-owned setup and absence of application acquisition.
- [Privacy/security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): REQ-SEC-017, with 004/013–016/021 preserving Local-only inference, minimized input and content-safe retention. [Reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): REQ-QUAL-006/007/009, plus runtime validation/publication requirements.
- [ADR-0003](../architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md), [ADR-0004](../architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), [ADR-0005](../architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md), [ADR-0020](../architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md), [ADR-0023](../architecture/decisions/ADR-0023-local-mode-data-boundary.md) and [local feasibility](../LOCAL_MVP_FEASIBILITY.md) own exact candidate, runtime, capacity and data boundaries.
- [SPEC-004](../specs/SPEC.feature): all three immutable-mode, missing-prerequisite and attempted-failure scenarios; [HS-009](../specs/HARD_SPEC.feature): corresponding hard boundaries. Preserve the [information lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) and [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md).
- [M302-LITERAL-01](completed/m3-02-shared-generation-stage.md#m302-literal-01--authored-runtime-contract) is the current implementation contract. [M3-01](completed/m3-01-generation-evaluation-package.md) and the [six-execution-only exception](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception) own evaluation bytes and their limited interpretation.

Applicable task Must requirements are Accepted or explicitly Deferred; runtime selection remains Accepted for evaluation, not qualification. No new requirement/ADR decision is made by this plan.

### Dated primary-source discovery

On 2026-09-10 the [fixed model page](https://ollama.com/library/qwen3.5%3A4b) lists 3.4 GB, 4.66B, Q4_K_M, Apache 2.0 and digest prefix `2a654d98e6fb`. This is discovery, not a full digest, installed identity or prefilter PASS. Its published inherited sampling settings differ from the explicit shared overrides; G must account for all material effective defaults.

The [chat API](https://docs.ollama.com/api/chat) documents messages, schema format, options, stream/think flags and completion fields. [Structured outputs](https://docs.ollama.com/capabilities/structured-outputs) supports passing schema through format; it does not replace application validation. [Context length](https://docs.ollama.com/context-length) documents VRAM-dependent defaults and observable loaded context/offload. The show-page fetch was unavailable during planning; no missing metadata/API behavior was guessed. Refresh material API/runtime claims from current official documentation or the exact runtime source during G. Published maximum context is not effective allocated context, and none of these pages proves complete pre-call counting.

## Scope and Non-Goals

Implement one fixed Local adapter, its request/accounting/model admission and bounded transport response mapping, minimal internal service composition, concise official setup guidance in the appropriate service/developer boundary, and the required single manual capacity observation.

No Groq implementation/call, 9B or smaller replacement, provider comparison, six fixed quality executions, model/prompt tuning, generalized endpoint/configuration registry, schema platform, telemetry, hardware monitor, downloader, native supervisor, new workflow engine, broad extraction, new UI/HTTP Generate route, human-review implementation or machine-wide egress controls. No dependency is preselected. Adding one requires a demonstrated accepted need and frozen effects, not convenience. Rendered changes require scope reconciliation and the frontend-quality overlay before any affected lease; they are not currently planned.

## Plan of Work

Use direct existing Node tests, current service/repository entry points and one documented developer-operated smoke. Prefer an ordinary bounded command to a new harness; no tracked capacity runner or native process-control tool is justified now. Keep the real output/evaluation observation separate from synthetic contract tests.

### P — metadata exclusion before acquisition

After execution authorization, primary refreshes Git/lease state and prerequisite evidence, then records a fixed-candidate metadata screen under ADR-0004. This is source-based admission of the already selected model, not comparison or model selection. Record current artifact/installed storage estimates, chosen prospective context, estimated model plus context/runtime working set, browser/application/EmbeddingGemma overhead, available RAM/VRAM/storage, runtime/driver support and a documented safety margin with units and uncertainty. Recheck current hardware/storage; the dated 513-GB free-space observation is not current evidence.

Do not declare PASS from file size or nominal VRAM alone. A clearly excessive configuration is excluded before download; unknown decisive estimates remain unresolved. Any consequential mechanism/comparison needed to resolve uncertainty uses G's R3 contract before the dependent effect. No separate routine reviewer layer is added just for recording sourced metadata.

Only after P passes may the developer acquire the exact model through official Ollama setup outside the application and repository. Freeze exact setup commands, runtime/version, destination ownership, license/permission boundary, expected disk/network effects and retained artifacts first. Existing runtime reuse must preserve other developer activity; no reinstall, update, model removal, port takeover or process termination is implied. User action or additional approval is required only when the actual setup/permission/license boundary demands it. The planning request performs none.

Capture full artifact digest, quantization, actual runtime, template/tokenizer/parser identity and effective settings after setup without making a generation request. A provisional prefilter is not actual accounting or a capacity pass. If observed facts invalidate it, stop dependent work rather than increasing context/resources silently.

### G — freeze the adapter and proof contract

Before A/B worker preflight, accept the following unresolved literals through the Decision Review Contract. Metadata-only inspection/setup may precede complete G only within P's recorded authority; it cannot start generation. If actual artifacts are necessary for the proof, retain the research barrier until available instead of accepting placeholders as proven.

| Literal | Required decision/evidence before its consumer |
| --- | --- |
| L1 Local identity/configuration | Fixed loopback origin/path/method policy; concrete runtime and full digest, quantization, tokenizer/template/parser/effective-configuration identities; immutable snapshot creation and currency checks without startup probes. Resolve the fact that configuration must exist before shared prepare but availability is checked only at explicit generation. Map missing runtime/model, drift and malformed metadata to existing bounded categories. |
| L2 Complete fit | Exact tokenizer or demonstrably sound upper bound for the complete wire-equivalent request, instructions, canonical notices/passages, schema/template/special-token overhead and 4096 output reserve. Freeze algorithm/version, supported domain, proof vectors, context/output limits and effective-context enforcement. A finite lookup must cover every admitted production request or fail closed; embedding's 63 rows and M301's three inputs are not universal generation proof. Unknown counts, guessed ratios, post-call counts or synthetic test values cannot authorize transport. |
| L3 Wire and result | Exact prepared serialized bytes and mapping of existing Local controls, schema and model routing; response/model/completion/finish-reason admission, error statuses, bounded byte/UTF-8/JSON handling and no repair. Resolve truncation/incomplete output, unwanted tool/thinking fields and safe non-retention. Enumerate permitted metadata requests separately from the single generation request. |
| L4 Lifetime and provenance | All serialization/prerequisite/accounting work before attemptTransport; exactly one actual HTTP start inside its thunk; no redirect/fallback/retry; total shared deadline, bounded I/O cancellation, complete versus uncertain cleanup, drift before dispatch and late-result rejection. Preserve BUG-0001's safe snapshots and selected-only durable truth. |
| L5 Integration/proof scope | Minimal real adapter factory and internal service consumption, no provider I/O at import/startup/selection/Analyze. Establish a live actually supported retrieval route within the current finite embedding boundary and a precise representative-interface interpretation. No manufactured RetrievalResult, edited abstention or use of the six-case exception for capacity. If a required UI or eligible path is unavailable, obtain the controlling owner decision before substituting/narrowing the proof or changing task dependencies. |
| L6 Execution effects | Exact A/B callables/files/tests; P/setup/metadata commands; one C activation, authorized target/data and isolated state, browser/runtime ownership, observations, output retention and cleanup; failure stop and remaining allowances. Freeze native exit propagation and commands before use. |

Preserve M302 runtime instructions/schema/control versions and M301's separate original six-case bytes. A new exact runtime setting may be a task literal, but changing an accepted instruction, model, eligibility policy, parameter or capacity obligation follows its existing authority. Do not repurpose shared validators to conceal an incompatible adapter.

### A — Qwen request admission and wire boundary

**Outcome/risk:** A fully admitted fixed profile and selected request produce an immutable prepared payload with proven complete fit, or a bounded pre-call failure. S3: Local egress, request/configuration identity and parser integrity. Preflight inspects the absent Qwen exports and the existing M302 fit and embedding transport patterns.

**Proposed placement:** `src/server/generation/ollama-generation-model.ts` owns fixed metadata/effective-profile admission; `ollama-generation-fit.ts` owns concrete complete accounting and payload correspondence; `ollama-generation-http.ts` owns the fixed native HTTP lifecycle and wire-response reader. Keep serialization next to its real consumer; G may combine tightly related details if separation is wrapper-only. Freeze exact paths/symbols before preflight. Existing `src/server/retrieval/ollama-http.ts` and embedding fit/model logic are reference-only unless a demonstrated shared transport primitive merits an explicitly named behavior-preserving extraction in G. Do not make embedding error types or finite tokenizer tables generic.

**Test ownership:** `tests/ollama-generation-contract.test.ts` and, if needed, `tests/helpers/m303-ollama-fixture.ts`; synthetic metadata/HTTP replies remain test-only. Test positive/negative exact shape and identity, foreign/cloud/redirect destination rejection, missing model/runtime, stale tag/digest/template/configuration, complete count boundaries and 4096 reserve, unchanged prepared bytes, inherited controls and unavailable accounting. Test response size/encoding/JSON/completeness/error interpretation with an isolated local test server or injected transport; no Ollama/model call.

**Direction/acceptance:** Pure profile/accounting functions depend on existing application contracts; server-only HTTP owns external I/O and returns normalized data. No browser import reaches HTTP, filesystem or setup. Separate accepted Red/Green, unchanged tests, focused checks, independent strict check, actual diff/cohesion and fresh critical PASS precede B. A unit count example is not a substitute for G's sound accounting proof.

### B — fixed adapter and internal service integration

**Outcome/risk:** The actual `GenerationAdapter` uses A and the existing shared stage/service to preserve zero-call prerequisite failures, one-call results and durable outcome truth. S3: transport-entry authority, cancellation and persistence.

**Proposed placement:** `src/server/generation/ollama-generation.ts` owns the fixed adapter factory, immutable configuration, prepare and dispatch orchestration. Reuse `executeGeneration` and `LocalService.generateFinding(input, adapter)`; keep service/main changes to demonstrably necessary nonvisual composition, with each exact path frozen in G. Do not add an HTTP route or call providers while constructing the service. Existing generation operation/aggregate validators remain authoritative; any new shared-contract change returns to primary reconciliation, not worker invention.

**Test ownership:** `tests/ollama-generation.test.ts`, `tests/ollama-generation-service.test.ts` and the M303 helper. A's accepted test file and existing M302 tests/helpers are protected during Green. G names any narrowly required existing regression edits before preflight; no evidence/developer-document edits enter worker leases.

Exercise the real adapter against controlled wire fixtures through actual stage/service/repository seams: no calls on startup, scan, non-Local mode, abstention or non-fit; attempt-time metadata before generation; single HTTP start; sync/async transport failure, incomplete/invalid output, successful proposal validation, safe snapshots, shutdown/deadline/late response, duplicate dispatch, stale owner and failed publication. Assert native evidence/siblings/provider context unchanged and separate unpersisted invocation from durable state. Test arbitrary response diagnostics/thinking/tool data never enter records. These are synthetic integration tests, not real Qwen or retrieval evidence.

Advance after A+B and affected generation/service regression checks, strict/build, terminal compliant leases, RETAINED/REFACTORED cohesion and fresh critical PASS. Freeze the real observation packet before C; no live-provider exploratory generation loop.

### C — one manual real Local-stack capacity smoke

**TDD: Not applicable.** Primary/developer owns the manual observation, not an implementation worker. Replacement evidence is the exact configuration note, one actual workflow outcome, validated durable readback, resource/UI observations and independent integrated review.

Before the single activation, all of the following must be resolved:

1. P passes; exact developer-owned runtime/model is present; G's full accounting and binding proof passes; A/B are accepted. Record tag `qwen3.5:4b`, full digest, quantization, effective context, runtime version, material parameters, license, offload configuration or supported automatic/default state, and prefilter result. Unknown decisive configuration blocks the call.
2. Freeze one representative lawful target/input and its real scan/retrieval path, within current query admission, with complete native evidence and actual supported guidance. Preserve exact existing evaluation inputs. No retrieval doubles or controlled-six-case packages may satisfy this gate. If the real path abstains, retain it honestly and do not invoke Qwen or search repeatedly for a passing case.
3. Resolve the roadmap/REQ-QUAL-006 single-reviewer-interface boundary against actual available UI. The existing app may remain visibly active for responsiveness observation, but an internal API call or proposed review screen alone cannot prove an absent required interaction. If authority requires later UI, record the precise owner/dependency decision and keep C/task closure pending; do not implement M3-05/M4 or weaken Verification implicitly.
4. Freeze exact target/network permissions, exclusive task-owned run/test roots and ports, developer/runtime process ownership, evidence destination, finite deadlines, required actions and cleanup effects. Never reuse or mutate retained M2-04 runs. Existing developer-owned Ollama may remain running; only owned temporary app/browser resources may be stopped.
5. Arrange readily observable duration, RAM/VRAM/storage pressure and obvious paging/offload, with browser, real screened EmbeddingGemma retrieval, app and Qwen active as required. Use existing OS/runtime observations and ordinary UI actions, not a monitor, benchmark series or custom supervisor. No claim of simultaneous model residency unless actually observed.

Run the one admitted workflow through the actual Local adapter and service, recording one explicit generation attempt and outcome. Keep native scan, actual retrieval, request/configuration identity, normalized result and durable proposal/failure categories traceable without retaining raw prompts/responses in tracked files. A validated proposal still needs later human semantic review; do not fabricate approval. Invalid output is an honest adapter/validation result, not a successful proposal or permission to tune/retry. Record capacity observations separately from output correctness and require every task Verification obligation for closure.

OOM, storage exhaustion or unusable interface fails the capacity gate. A failed fixed model/runtime evaluation pauses Local evaluation for the recorded replacement decision; no smaller model, repeated screen or Groq fallback is preapproved. An infrastructure interruption or missing prerequisite is not silently relabeled as model failure or success; triage exact evidence and remaining authority before any later action. The one C activation is not renewed by a correction, new run ID or operator restart. No extra actual generation is authorized to obtain a cleaner result. This capacity observation is separate from M6-02's exactly six frozen quality executions.

## Agent workflow and budgets

Follow the [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [write-lease guard](../../.codex/write-lease-guard.md) and configured role pins. Separate persistent test_worker/code_worker contexts own each behavioral slice. One read-only preflight precedes any lease; record EXISTING_AND_COVERED, EXISTING_BUT_UNCOVERED, MISSING, REGRESSION, PARTIAL or UNKNOWN/CONFLICTING and take its prescribed route. No fabricated Red. The first-module exception requires exact absent callable, verified environment and complete unchanged behavioral assertions at Green.

Every worker write turn receives a fresh Milestone Assignment Packet v2, exact paths/commands/digest and primary-opened, terminally closed lease. Only one lease per worktree; primary documentation/guard work between leases. Tell workers they are not alone and must preserve peer/user changes. Workers use Git read-only. Primary owns decisions, authoritative writes, integration and acceptance; ordinary implementation is delegated.

Per unchanged role/phase chain: initial write plus correction 2 and conditional correction 3 under the existing new-evidence rule, one slice-review correction loop, no fourth attempt or new-ID budget escape. Stop identical decisive failure twice without new evidence, two no-diff outcomes, changed binding fields, violations or exhausted allowance. Primary triages and continues unaffected authorized work; only a real owner-controlled decision, unavailable permission/input, expanded scope or exhausted budget requires owner direction. The narrow direct-primary test correction follows ADR-0024 and invalidates affected evidence.

Each A/B slice receives fresh critical_reviewer review for its named S3 risks; final integrated review uses a different fresh critical_reviewer. Inspect actual diffs, evidence, terminal receipts, tests/helpers and cohesion; administrative compliance is not proof. Optional agents require an independent useful task; role capacity is not a staffing target. No extra routine planning, research or review layer is added.

## Decision Review Contract

**R3 target:** G's remaining Local identity, complete accounting, transport lifetime and representative-proof semantics in this plan. Triggered properties are custom integrity/identity, privacy, cancellation/recovery and consequential proof interpretation. Fixed model/runtime and M301/M302 semantics are constraints, not candidates.

One bounded non-ranking discovery pass may identify existing metadata, exact source references and smallest implementation alternatives. Freeze alternatives, common criteria, hard gates, evidence classes and authority boundary before comparison. Prefer native transport and a small verifiable counting mechanism; compare only materially viable mechanisms for this exact contract, not models/frameworks. Criteria: correctness before dispatch, exact effective identity, loopback-only flow, evidence honesty, accepted workflow fit, minimal maintenance and existing-code reuse.

Use at most two critical_researcher reports: (1) exact Qwen/runtime metadata, complete counting/configuration and prefilter uncertainties; (2) transport/result/lifetime and real eligible capacity-proof scope. Each receives Research Assignment Capsule v1, exact authority/source evidence, a 1000-word useful-detail limit plus necessary proof tables, one targeted follow-up and read-only permission. No actual generation or artifact acquisition by researchers. Parallel independent research is permitted while primary gathers nonduplicated repository facts. Additional required external artifacts/setup follow P's explicit effects before evidence can be consumed; a missing decisive artifact is not hypothetical proof.

Mandatory decision_analyst returns DRAFT READY, RETURN FOR RESEARCH or OWNER DIRECTION after all critical dimensions are covered. Allow one synthesis and one supported correction. Fresh critical_research_reviewer pre-draft review permits one supported outline correction; primary alone authors accepted G after PASS. A different fresh critical_research_reviewer reviews the complete authored contract and cumulative invariant packet before worker preflight. No drafter is needed. At most two final-artifact correction cycles; R3 corrections rerun the complete packet/review. Repeated decisive gaps twice, conflicting authority or exhausted allowance stops dependent work without budget renewal.

| ID | Trigger / expected result | Evidence owner / reviewer |
| --- | --- | --- |
| I1 | All selected authorities and L1–L6 covered; no fake completion, scope/UI/exception expansion | Primary authority map; analyst and both R3 reviewers |
| I2 | Frozen evaluation/runtime inputs distinguished; original actual abstentions and prior capacity limits preserved | G/current hashes; both R3 reviewers |
| I3 | Exact local artifact/effective configuration, complete fit plus 4096 reserve; unknown/drift/overflow prevents transport | G proof, A/B vectors; critical reviewers |
| I4 | Only fixed loopback metadata and one generation request; no payload redirects, cloud inference, setup or startup probes | A/B transport tests, C actual endpoint evidence |
| I5 | Honest attempt entry, bounded output/error/cleanup, no raw secret/reasoning retention or automatic second attempt | B and inherited M302 regressions |
| I6 | Live actual supported Finding and immutable durable native/sibling/context data; no restart capability reconstruction | B service tests and C actual readback |
| I7 | Metadata exclusion precedes acquisition; one real representative smoke meets every capacity/UI obligation or remains unpassed | P/C observation and different final critical reviewer |
| I8 | Small cohesive modules, current consumers, no generic harness/supervisor and safe owned-resource cleanup | Primary diff/cohesion, A/B/final review |

## Concrete Steps

Working directory: `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Load only the definitions from [README command preparation](../../README.md#development-command-preparation) in each PowerShell caller, not adjacent restore/install or historical evaluation procedures.

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'Git inspection failed' }
$m303EntryHead = git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'HEAD lookup failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Pinned Node required' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test tests/run-contract.test.ts tests/generation-contract.test.ts tests/generation-stage.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Focused generation contracts failed' }
}
```

Current expected result: strict PASS and 99 tests. This is a provider/browser-free planning check; do not infer full-suite reuse from a test count. Before dependent work verify the original manifest and each referenced input plus applicable retained actual-retrieval identities from their evidence owners.

The following slots are deliberately unresolved future callers. G freezes exact commands, environment/native exit propagation, input/output ownership, mutations and recovery before the corresponding action:

| Slot | Required binding |
| --- | --- |
| P | Current hardware/storage/runtime read-only inventory; primary metadata sources and explicit safety-margin calculation; no pull or inference |
| Developer setup | Exact runtime reuse/install/pull action and external ownership/permission/license/effects; no application invocation, repo/model-store deletion or historical grant reuse |
| Metadata/accounting | Exact selected-artifact observation and offline proof commands; expected transient outputs and retention; no hidden generation or acquisition |
| A/B | Final export/file names and focused Node commands, explicit fixture/loopback-server roots and teardown; current M302 regressions plus independently executable strict/build |
| C | One exact manual driver/call sequence with actual eligible data, real adapter/service/browser/runtime identities, safe records, measurements, owned processes/ports and cleanup; no arbitrary payload passed through UI or CLI |
| Closure | README's sixteen-suite sequence plus every new M303 suite, strict and client build; browser prerequisites/scratch effects checked first |
| Guard/recovery | Exact packet/lease lineage, role/path contract and guard Python prerequisite; terminal close, failure evidence, authorized disposable children and retained external artifacts |

No future file listed above is an existing runnable command. Do not put a historical HEAD or requirement for an uncommitted plan into a gate. Current source/test/package/input/environment and mutable-state identities control evidence reuse after intentional commits.

## Validation and Acceptance

Planning is accepted only after a fresh critical readiness review and proportional documentation/preservation checks. It proves a safe route to remaining decisions, not Qwen feasibility or execution readiness.

Execution acceptance requires P, complete G and I1–I8, separately owned A/B preflight/Red/Green/reviews, exact actual Local configuration and wire/counting proof, zero-call missing-prerequisite/fit paths, normalized one-attempt output/failure, preserved service/aggregate behavior and the required real C capacity PASS. Keep prompt/schema production conformance distinct from future frozen evaluation byte conformance. No six-case run, semantic review decision or provider qualification is claimed.

Complete the authoritative suite including new tests, independent strict checking and client build, then different fresh integrated critical review. Broaden or repeat only for changed/stale/contradictory evidence, failed prerequisites or unresolved risk; handoff alone does not invalidate a complete identity. If C cannot satisfy a real prerequisite, accept only supported implementation checkpoints and keep the task In progress or Blocked as warranted. Do not mark Complete from synthetic tests or defer a required proof without the owning decision.

Apply the [documentation closure gate](../README.md#task-closure-documentation-gate): reconcile materially affected runtime/setup instructions, exact Local configuration and capacity notes, roadmap/progress/plan indexes and relevant current-status statements; update requirements/ADRs only for an explicitly accepted material decision. Run link/anchor, UTF-8/final-newline, configuration/command and formatting checks including `git diff --check`. Archive only after Verification and closure pass; no M3-04/M3-05 activation is implied.

## Idempotence and Recovery

Resume from Current state and the latest accepted contract/evidence; historical M202/M302 failures, helpers, grants and receipts are not reusable authorization. Preserve the current developer runtime/model store and existing run evidence. Exact-byte recovery, if later needed, follows the owning freeze procedure, not a new accepted hash.

Primary closes a stopped lease before triage or documentation. Do not revert peer changes, continue a closed lease, reset budgets or silently weaken binding/accounting. An unavailable genuine prerequisite blocks only its dependent work. Investigate substantive recurring defects under the [bug index](../bugs/README.md), preserving BUG-0001 history.

Before any removal verify exact disposable paths are ordinary, ignored, untracked and inside their approved root; stop owned services/requests/browser resources first and inspect their terminal outcomes. Never delete an application run store, retained M2/M3 input, model store, runtime, dependency tree or workspace root for cleanup. No broad process kill, port takeover, hidden model retry, commit, publication or push is authorized.

## Artifacts and Notes

Today primary changes only this plan, roadmap planning activation and the existing plan/progress navigation plus one task progress record. Future safe proof notes belong here; no extra design document, raw transcript, generated ledger, benchmark or diagnostic subsystem is planned. Detailed private inputs remain in explicitly permitted ignored locations; tracked evidence retains only content-safe identities/outcomes.

## Interfaces and Dependencies

The new adapter implements the existing `GenerationAdapter`/`PreparedGeneration` and normalized result types. It consumes M302's immutable request/configuration, uses its attempt capability and returns a candidate to existing application validation. Internal service/repository lifecycle remains the owner of selected state. Existing native Node HTTP is the first reuse candidate; exact accounting remains a G decision, with no tokenizer dependency or custom parser platform preselected. Ollama/model setup remains developer-owned; actual Groq and visible generation/review remain later tasks.

## Revision note

2026-09-10 / primary: Created the M3-03 planning-only ExecPlan after current-state/authority review and bounded source exploration. Preserved fixed Qwen/runtime and prior freezes; separated metadata admission, remaining R3 contracts, two behavioral slices and one real capacity proof. Recorded unresolved actual eligibility and representative UI prerequisites. Accepted independent planning PASS and documentation/preservation checks; no implementation, setup or model operation occurred.
