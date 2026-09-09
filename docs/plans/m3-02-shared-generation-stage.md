# Implement the shared generation stage and validation

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M3-02](../DEVELOPMENT_ROADMAP.md#m3-02--implement-the-shared-generation-stage-and-validation), In progress for owner-requested project review and planning only. Implementation requires a subsequent execution request. No provider adapter, model operation or later task is selected.
- **Entry:** [M302-PLAN-01](#m302-plan-01--reviewed-project-state) confirms M3-01 completion, current source boundaries, fresh strict TypeScript and 119 focused tests. [M302-PLAN-REVIEW-01](#m302-plan-review-01--accepted-planning-readiness) accepts independent planning PASS and documentation checks, not execution gates.
- **Gates:** Before worker preflight, restore and verify the exact frozen manifest bytes under [G0](#g0--entry-and-frozen-input-recovery), then accept the remaining implementation literals, commands and R3 checkpoints under [G1](#g1--freeze-only-the-remaining-implementation-literals). No runtime-generation evidence exists.
- **Ownership/budget:** No active lease. Future research and three sequential TDD slices have the unconsumed allowances in the [Decision Review Contract](#decision-review-contract) and [worker protocol](#worker-protocol-and-budgets). Planning readiness used its one review with no correction/re-review needed; it does not consume or reset future execution allowances.
- **Next:** Await execution authorization; then G0, G1, A, B and C in order. [Commands](#concrete-steps), [acceptance](#validation-and-acceptance) and [recovery](#idempotence-and-recovery) control resumption.

## Progress

- [x] (2026-09-09 22:25Z) Reviewed roadmap-wide state, M3-01 authorities/freeze, current source/test responsibilities and implementation workflow; accepted M302-PLAN-01.
- [x] (2026-09-09 22:25Z) Passed strict TypeScript, 119 focused tests and four source/nine local package hash checks; identified the exact manifest checkout conversion without modifying it.
- [x] (2026-09-09 22:41Z) Accepted independent critical planning PASS with no findings and proportional documentation/preservation checks; M302-PLAN-REVIEW-01 records limits.
- [ ] Receive execution authorization; pass G0 exact-byte recovery and current entry checks.
- [ ] Accept G1 literals, exact commands, mandatory synthesis and both R3 contract reviews.
- [ ] Complete A: pure proposal contract and validation through independent Red/Green and review.
- [ ] Complete B: minimized input, context-fit and one-attempt shared stage through independent Red/Green and review.
- [ ] Complete C: service ownership and durable generation transitions through independent Red/Green and review.
- [ ] Pass full regression, strict/build, different fresh integrated review and documentation closure; archive only after M3-02 is Complete.

## Surprises & Discoveries

- The owner resolved M3-01's eligibility question through a [six-execution-only exception](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception). All actual M2-04 retrievals remain abstained; the exception cannot authorize production eligibility or later real integration/capacity demonstrations.
- Current checkout bytes of `evaluation/m301-generation-v1.json` hash to `23FC0D4DA7AE932992DE3BD4D1D7D38DC1984FC4465AA6E988BB0C8B8B7524AD`, not its frozen `63770583A97E1D0517337474DADC706C1047D78E026E22C7A745CE7674ED9E6B`. Replacing its 546 CRLF pairs with LF **in memory only** reproduces the frozen hash. M3-01's archive explicitly anticipated checkout conversion; G0 handles exact recovery, not a new version or silent hash replacement.
- `createRetrievalOperation` retains ownership after supported retrieval, while `startLocalService` releases its operation reservation. `readRun` uses that owner to distinguish live supported work from historical interrupted work. Generation must continue that exact workflow without either rejecting it as foreign work or releasing ownership prematurely.
- `src/client/run-admission.ts` imports the shared run validator. New aggregate validation must remain browser-safe: filesystem loading, provider clients, secrets and local prompt paths cannot enter its import graph.

## Decision Log

- Decision: Activate only M3-02 planning. Rationale: an ExecPlan request is not implementation authorization. Date/Author: 2026-09-09 / primary.
- Decision: Reuse the M3-01 output and interpretation freeze rather than redesigning it. Rationale: remaining decisions concern runtime placement, fit, dispatch and durability, not prompt tuning or another output schema. Date/Author: 2026-09-09 / primary.
- Decision: Plan three cohesive behavioral slices, with provider-free proof and no rendered UI work. Rationale: pure validation, one-attempt execution and durable integration have independently falsifiable boundaries; actual adapters and Generate UI belong to later tasks. Date/Author: 2026-09-09 / primary.

## Outcomes & Retrospective

Planning identifies the exact prerequisite recovery and implementation handoffs. No production, test, dependency, configuration, corpus or frozen-package file has been changed. Runtime generation, provider integration and model capacity remain unproved. Historical M3-01 completion is preserved; its exact-byte use gate must pass before dependent implementation.

## Purpose / Big Picture

Provide the smallest service-owned generation boundary that both fixed adapters can later call. One explicit request for a live eligible Finding either fails before invocation with a bounded reason, or attempts the selected provider once and admits only a valid, cited proposal into pending review. Invalid output never becomes a proposal or post-call abstention; a persistence failure never becomes durable success. Completed scan evidence, siblings and immutable provider context remain intact.

M3-02 proves this with pure tests and isolated service/filesystem contract doubles. It does not prove that Qwen or Groq works, render a Generate button, consume any fixed generation execution, or provide a production fake adapter.

## Context and Orientation

### M302-PLAN-01 — reviewed project state

Entry is clean HEAD `7726b156911df70e66a09e12693d5bb8795318e9`, 223 tracked files, no staged changes. This is historical evidence, never an executable HEAD constant. Thirteen roadmap tasks are Complete (RD-001–RD-003, M1-01–M1-05, M2-01–M2-04, M3-01). M3-02 alone is selected for planning; fourteen subsequent tasks remain Not started.

Implemented capabilities are exact-three-rule Playwright/axe scanning, the loopback service, validated single-file run persistence, React Analyze/Results, the closed 8-source/16-passage corpus, local exact-vector retrieval, canonical citations, evidence sufficiency and abstention. Generation, review and comparison are not implemented. M2-02's embedding capacity evidence remains separate from unproved Qwen capacity; the M6-03 full-detail 200% visual check remains deferred to that task. The bug index has no recorded defects; the known manifest recovery is retained in this plan rather than reopening historical application work.

M3-01's [final acceptance](completed/m3-01-generation-evaluation-package.md#m301-final-01--final-review-and-documentation-closure) records the static freeze, 96 adverse checks, independent R3 reviews and fresh 449-test regression. Its 449 tests/build are retained evidence, not new M3-02 executions. Current planning freshly passes pinned Node `v24.20.0`, independent strict TypeScript and 119 tests in `run-contract`, `scan-normalization`, `retrieval-contract` and `finding-sufficiency`. All four manifest source references and nine exact local file hashes match. The manifest raw-byte difference is the explicit G0 gate, not an accepted new freeze identity. No model endpoint was probed.

The [safe generation manifest](../../evaluation/m301-generation-v1.json) and [M301-OWNER-02](completed/m3-01-generation-evaluation-package.md#m301-owner-02--accepted-controlled-input-scope-and-resolved-contract) own the output/input/instruction/control literals. The nine ignored artifacts include three exact inputs, three provenance records, instructions, schema and shared no-call definition. Read them only as required; do not copy raw prompts, payloads or ignored working material into tracked source, tests or evidence without applicable explicit authorization.

### M302-PLAN-REVIEW-01 — accepted planning readiness

A fresh read-only `critical_reviewer` reviewed the complete plan and four companion changes, controlling task authorities and relevant service/retrieval/domain/persistence seams. Its trigger was custom identity/privacy, concurrency/recovery and exact frozen-byte integrity. Verdict: **PASS — planning readiness only**, with no Blocker, Major or Minor. The reviewed candidate SHA-256 was `65621169D00B8AE2C759E233AF41D9FF6AFA50412CA192E3006C5310C8471E45`; this receipt and current-state reconciliation are subsequent non-contract documentation changes, not an assertion that the updated plan retains that hash.

The reviewer independently reproduced the manifest raw hash, all 546 CRLF pairs, exact original LF hash and every four source/nine local file hash. It confirmed that actual source responsibilities support the ownership and browser-safe-validator gates. Strict TypeScript/119-test evidence was primary-run and reused, not independently rerun. Primary accepted five-document UTF-8, final-newline, trailing-whitespace, relative-link/anchor, PowerShell parse and `git diff --check` validation. All 220 tracked files outside the three intended existing-document edits remain identical to the 223-file entry fingerprint; only this plan and its progress record are new. Roadmap counts are thirteen Complete, one planning-only In progress and fourteen Not started.

Planning used one review and no correction loop. G0 recovery, L1–L6, exact execution callers, future R3 reviews, implementation and runtime proof remain pending. No frozen artifact or application/test/dependency file was modified. The lesson is to distinguish historical accepted bytes from current checkout identity and to resolve the live ownership handoff before assigning implementation, without adding an evaluation or workflow subsystem.

### Controlling authority route

Read [project requirements](../PROJECT_REQUIREMENTS.md) for statuses and [roadmap](../DEVELOPMENT_ROADMAP.md) for task authority. Resolve these exact identifiers, including their accepted amendments:

- [Evidence/generation requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals): `REQ-GEN-001`–`006`, `008`–`010`; `REQ-EVID-003/011`, `REQ-RETR-004/005` and `REQ-REV-009` constrain preserved evidence, eligibility and pending review.
- [Provider requirements](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): task-owned `REQ-LLM-001/004/008/019`, with `002/005/007/009` governing immutable context, one selected input and no fallback/retry.
- [Privacy](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-013`–`016`; `002/003/004/012/021` constrain secrets, aggregate content, endpoints and diagnostics. [Reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-003`, plus preserved strict validation/publication under `010/011/020`. [Information lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) owns parent/selected-Finding states and nested provenance.
- [ADR-0001](../architecture/decisions/ADR-0001-interchangeable-generation-providers.md), [ADR-0011](../architecture/decisions/ADR-0011-typescript-as-initial-application-language.md) and [ADR-0013](../architecture/decisions/ADR-0013-langchain-as-initial-rag-integration.md) own provider neutrality, application validation and bounded framework use. [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) owns single-file persistence; [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) owns implementation method.
- [SPEC-003/004](../specs/SPEC.feature): `Generate one eligible proposal`, `Fail before invocation when required input does not fit`, and only the shared contract/provenance/result-category portions of `Use one mode without mixing or fallback`, `Fail before invocation when the selected prerequisite is missing`, and `Keep an attempted-call failure bounded and visible`. [HS-008/009](../specs/HARD_SPEC.feature) supply their hard eligibility/context-fit and immutable-mode/provenance views, not authority for adapters or UI.

The applicable MVP Must requirements are Accepted or explicitly Deferred; no product-choice approval is implied by this plan. M3-01 settles output semantics, not new runtime identity, concurrency or recovery mechanics.

## Scope and Non-Goals

In scope: provider-neutral proposal/input/error/provenance types; runtime shape/reference/citation/prohibited-claim validation; selected-only minimization; fail-closed context-fit enforcement; a minimal fixed-mode provider interface; one explicit attempt and bounded deadline/error handling; selected-Finding service integration and durable aggregate validation/transition rules. Preserve the existing abstention behavior and use its policy instead of a second implementation.

Out of scope: Qwen/Groq clients or actual calls, credentials/setup, tokenizer/model acquisition, live embeddings or scans, changing ranking/corpus/evaluation cases, production controlled-input bypass, user-configurable endpoints, HTTP generation exposure or Generate/proposal UI, review actions, comparison, streaming, batching, retry/fallback, schema frameworks, prompt platform, registry, workflow engine, broad refactor, telemetry or release claims. M3-03/M3-04 own actual adapters and operational fit/configuration proof; M3-05 owns visible integration. No frontend-quality overlay is activated by this nonvisual plan; a material rendered change requires replanning under that skill, not expansion of an existing source lease.

## Plan of Work

The smallest proof is the existing Node test runner plus direct isolated service/repository calls, with focused doubles at the future provider boundary. Reuse existing fixture builders, strict object readers, corpus authentication, evidence assessment, citation resolution and safe publication. Add no dependency or separate harness by default. Permanent test doubles may exercise unknown responses and failure timing, but cannot enter normal startup, be presented as actual model evidence, or make the six-execution exception a product API.

### G0 — entry and frozen-input recovery

After execution authorization, refresh Git/lease/readiness state and current command prerequisites. Verify the manifest and every referenced frozen input before consuming them. For the currently evidenced CRLF-only difference, primary may perform only byte-identical LF recovery under [M3-01 recovery](completed/m3-01-generation-evaluation-package.md#idempotence-and-recovery), between leases, using `apply_patch` or a narrowly scoped formatting operation allowed by repository tooling instructions. Freeze the exact recovery caller/effects before it runs; verify the frozen manifest SHA-256 and all thirteen referenced hashes afterward. Do not change JSON values, set a new accepted hash, amend the freeze, delete local inputs, or change Git attributes/settings as part of this recovery. The planning request does not perform it.

If reconstruction does not exactly match, stop dependent work and use the archive's original-byte/new-freeze route. A recoverable checkout conversion does not require a new product decision. Once recovered, record the current accepted entry identity and protect it through every lease. Never compare future lease receipts to this plan's historical HEAD.

### G1 — freeze only the remaining implementation literals

Before worker preflight, use the R3 contract below to resolve L1–L6, exact callable names, per-slice file lists and commands. Do not reselect M3-01 output fields, regexes, input categories, two-message evaluation assembly or generation controls.

| Literal | Decision to freeze now; downstream proof boundary |
| --- | --- |
| L1 Representation and placement | Exact proposal/input/normalized error/ProviderInvocation types and runtime validators; representation of pending proposal and pre-call/attempted failure inside the existing Finding. Preserve old valid records, selected-only references and closed keys. Choose the smallest compatible format-version treatment; no migration system. Keep pure validators browser-safe and external I/O in server modules. |
| L2 Artifact delivery and input projection | Exact service-owned instruction/schema/version/control source, loading and immutable binding, without accepting arbitrary browser-supplied prompts/configuration or silently copying ignored content into tracked files. Use the safe manifest's authored contract for TypeScript validation. Resolve any genuinely missing permission for excluded-content promotion before that action; no unconditional owner gate for ordinary literals. Do not make an ignored task scratch directory a hidden permanent application dependency. Production input derives only from authenticated actual supported retrieval; evaluation bytes are offline conformance inputs, not a service bypass. |
| L3 Context fit | Exact shared fit interface, units, bounds, output reservation, unsupported/unknown result and request identity. Account for the full input, instructions, schema, provider message/template overhead and reserved output. No character-count guess, dropped passage or bare caller-supplied fit=true may establish safety. Bind any count/proof to the precise request and immutable selected configuration; reject missing/stale/malformed evidence. M3-02 proves shared enforcement with boundary vectors. M3-03/M3-04 prove real tokenizer/provider accounting before real calls; unavailable proof fails closed rather than being labeled fit. No new tokenizer or live probe is selected here. |
| L4 Attempt and failure contract | Distinguish configuration/prerequisite checks, context-fit work and actual dispatch. Freeze when one attempted call creates provenance, including synchronous throw, pre-dispatch abort, attempted timeout, malformed result and ambiguous transport outcome. The trusted adapter must not turn a pre-call failure into fabricated invocation; an attempted failure must not erase invocation. Shared code bounds errors, excludes raw bodies/secrets/reasoning, enforces at most one attempt and no retries, and has no synthetic readiness exchange. Actual adapters later implement this exact boundary. |
| L5 Ownership and publication | Continue only the live supported selected workflow owned after retrieval; reject unrelated/terminal/historical interrupted work. Define atomic reservation/ownership transfer and release, persisted invocation/result order, duplicate activation, expected-current update, failure-to-persist and shutdown/deadline/late-result handling. No active record may resume automatically after restart, duplicate a call or publish stale success. Preserve native evidence, scan completion, sibling order/data and provider context; do not create a generalized lock, queue or workflow engine. |
| L6 Proof and minimal integration | Freeze the test-only doubles and isolated roots, production absence-of-adapter behavior, service method boundary, exact command/effect/recovery packet, and correspondence to M3-01. No HTTP/UI entry or actual provider is needed. Explicitly name what unit/service proof cannot establish and what M3-03/M3-04/M3-05 must still demonstrate. |

A literal uncertainty affecting identity, privacy, dispatch or recovery cannot be assigned to a worker to invent or dismissed as future runtime proof. Significant architecture/requirement changes require their existing owner route; routine implementation choices remain primary-owned within this task.

### A — pure proposal contract and runtime validation

**Outcome:** A candidate either becomes a detached, validated selected-Finding proposal under `m301-proposal-v1` or returns a bounded validation failure. Automatable behavior uses TDD; preflight target is the new proposal validator and current strict readers, not a synthetic missing-file assertion alone. **Risk: S3**, exact references, closed input identity and prohibited-content admission.

**Placement/write envelope:** `src/server/generation/proposal-contract.ts` owns proposal types and pure candidate admission, reusing `src/server/domain/run-contract/contract-value-reader.ts` without weakening it. Keep the five lexical rules and their version with this validation responsibility unless G1 establishes a distinct current consumer requiring a small shared policy module. This is not a schema interpreter. Test owner: `tests/generation-contract.test.ts`; a bounded `tests/helpers/m302-generation-fixture.ts` may supply explicitly synthetic vectors. G1 must name any extra file before preflight; only exact named paths enter the lease. Existing policy/corpus files are read-only.

**Contract/proof:** Enforce closed required objects, proposal discriminator, exact Finding ID, selected available EvidencePath membership, supplied canonical correct-profile citation membership, unique references, required field minima, original UTF-16 bounds, nonblank prose, assumptions limits, complete/supported application assessment, categorical confidence, uncertainty, blocking judgment and separate reminder. No null/default/coercion/repair, invented references or probability substitute. Apply every frozen lexical pattern to every specified prose leaf after the exact normalization without changing retained text. Test boundary lengths, missing/extra/accessor/sparse values, cross-Finding/profile references, altered canonical support, missing support, non-proposal candidate, prohibited strings and known lexical limits. A lexical pass does not prove semantic support or clear a human judgment.

**Direction:** Pure proposal validation depends on current pure evidence/reference types and strict readers; it imports no filesystem, provider, service, test fixture or ignored artifact. Hand-authored test proposals are not generated results. Advance only after unchanged Red tests execute at Green, strict checking, actual diff/cohesion inspection and fresh critical review.

### B — minimized input and one-attempt shared execution

**Outcome:** An explicit eligible request produces the smallest allowed request and follows the accepted prerequisite/fit/attempt/validation contract once. **Risk: S3**, model-visible privacy, request/fit identity and timeout semantics. Preflight targets the absent generation execution boundary and reusable evidence/citation policies.

**Placement/write envelope:** `src/server/generation/generation-input.ts` owns selected-only projection and request assembly; `src/server/generation/generation-contract.ts` owns the fixed two-mode adapter/configuration/normalized-result interface; `src/server/generation/generation-stage.ts` owns ordered gate/attempt/deadline coordination and calls A for validation. If L2 requires file I/O, G1 may name `src/server/generation/generation-artifacts.ts` as the service-side loader, never a pure-contract import. Test owner: `tests/generation-stage.test.ts` and the already declared M302 fixture helper. A's accepted test file is forbidden to Green.

**Contract/proof:** Reuse evidence assessment and canonical authentication/support. Invalid canonical input fails before an evidence insufficiency decision when both faults are present; valid incomplete evidence/guidance preserves the application-authored no-call branch. Completed production retrieval and complete evidence are required; the controlled-six-case flag or input package cannot grant eligibility. Project only selected allowlisted facts and required canonical passages/notices; omit URL/origin/locator, arbitrary text/attributes, siblings, scores/vectors, history, credentials and raw provenance. Keep provider protocol/authentication separate from model-visible data.

Use the L3 fit contract to reject unknown, incomplete, mismatched and over-limit accounting, including schema/message overhead and output reservation. Test exact-fit and one-over boundaries; never truncate. Missing selected-mode configuration/adapter/prerequisite and non-fit fail before invocation, not as abstention. Attempted success/error/invalid response creates the appropriate non-secret provenance once; invalid or incomplete output cannot become a proposal. The frozen 120000-ms total request deadline is exercised with bounded deterministic timing, not repeated two-minute waits. Cover abort before dispatch, attempted timeout, synchronous failure, late completion and at-most-once dispatch; no retry/fallback/mixing or hidden second response. Spy on every adapter boundary to prove zero or one invocation as appropriate; absence of a second provider result is not proof it was never called.

**Direction:** Service-owned stage -> input/canonical resolver -> fixed selected adapter boundary -> pure proposal validator. Only the future adapter may own external provider I/O. No default test adapter, import-time/startup inference or secret in the shared request/result. Advance after focused A+B checks, strict checking, closed leases, cohesion acceptance and fresh critical review. Actual token counting, operational availability and model quality remain unproved.

### C — live workflow continuation and durable aggregate integration

**Outcome:** The internal local service can continue the exact live supported Finding through B and durably publish a pending proposal or bounded failure while preserving completed evidence. **Risk: S3**, concurrency/ownership, stale-write rejection, recovery and durable invocation truth. Preflight targets current retrieval ownership, run validation and repository update rules; existing portions may classify PARTIAL rather than MISSING.

**Placement/write envelope:** `src/server/local-service/generation-operation.ts` owns selected-Finding orchestration/publication; `src/server/service.ts` remains composition and its existing single-operation reservation/stop coordinator; `src/server/local-service/contracts.ts` exposes only the internal method/result types. `src/server/local-service/retrieval-operation.ts` permits only the exact L5 live-owner transfer/release change, not retrieval-policy changes. `src/server/domain/run-contract/generation-validation.ts` owns generation-bearing aggregate admission; `run-types.ts`, `finding-analysis-validation.ts`, `finding-validation.ts` and the `src/server/domain/run-contract.ts` facade receive only the necessary type/dispatch wiring. `src/server/persistence/run-repository/generation-transition.ts` owns allowed selected-generation transitions; `contracts.ts` and `src/server/persistence/run-repository.ts` add the narrow update through existing safe publication.

Test owner: `tests/generation-service.test.ts`, plus only affected assertions in `tests/run-contract.test.ts`, `tests/run-repository.test.ts`, `tests/local-service.test.ts`, `tests/retrieval-service.test.ts` and the M302 helper. G1 narrows these exact files before preflight/leases. `src/client/**`, scanner, ranking, package files, frozen inputs and all evidence documents are forbidden to implementation workers. Any newly necessary path or behavioral boundary returns to primary reconciliation, not placement inside an unsuitable allowed file.

**Contract/proof:** Use real repository/service methods with explicit test-owned adapter/retrieval doubles in exclusive ignored test roots, never the application run store or retained M2-04 runs. Such test artifacts are not real provider/scanner observations and do not exercise the six-call exception. Test supported retrieval -> explicit generation -> validated durable readback, missing adapter/prerequisite/fit failure without invocation, attempted error/invalid output with invocation, and proposal pending review without a decision. Original native evidence/retrieval, run mode and siblings must remain unchanged. Reject duplicate/concurrent activation, wrong owner, stale expected aggregate, replay after terminal result and historical interrupted workflow. Shutdown before/during dispatch, deadline, late resolution and write failure must preserve the last valid aggregate and never publish success after stop or allow another operation while cleanup is uncertain. Record accurately when attempted-call provenance could not be persisted; do not claim a disk write succeeded or automatically repeat the request.

Shared run validation must still accept prior valid scan/retrieval/abstention records and reject impossible invocation/result combinations, raw payloads/secret fields and wrong ownership. Persist only compact invocation context and the validated proposal/error, not full instructions, schema, request, response or extra child identities. Reuse existing publication/expected-current mechanics. If a common native-preservation or publication helper is genuinely repeated by generation, declare its exact local extraction in G1; no generic state-machine abstraction or weakening of retrieval transitions.

**Direction:** `service.ts` -> purpose-named generation operation -> shared stage and repository; repository -> pure run validation and generation transition -> existing file publication. Pure browser-imported validators must not reach the service/artifact loader. Existing HTTP/client behavior stays unchanged. Advance after affected service/repository/domain checks, strict/build, independent critical review and task-level integration acceptance.

### Worker protocol and budgets

For each slice use one read-only `test_worker` preflight with no lease and record the exact workflow classification. EXISTING_AND_COVERED reuses valid evidence; EXISTING_BUT_UNCOVERED uses guarded characterization; MISSING/REGRESSION uses Red; PARTIAL requires a reconciled missing gap; UNKNOWN/CONFLICTING stops for primary triage. No production stub or implementation comes before accepted Red. The ADR-0024 first-module exception applies only after the precise absent import/export, working runtime and complete bounded behavioral tests are frozen; record unexecuted assertions and require every one to run unchanged at Green.

Each behavioral slice uses separate persistent `test_worker` and `code_worker` contexts, sequential fresh [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) and [write leases](../../.codex/write-lease-guard.md). One lease at a time; primary documents/guard maintenance only between leases. Tell each worker that others' changes belong to their owners and must not be reverted. Workers use Git read-only. Green cannot edit accepted tests, fixture helpers or frozen evidence. Every follow-up needs a new lease, exact parent/phase/role/path contract and terminal close.

Per unchanged role/phase chain: initial write plus ordinary correction 2 and conditional correction 3 only under the workflow's new-evidence/different-action rule. One slice review correction loop; no fourth attempt, budget reset, new-ID escape or endless microcycles. Stop repeated identical failure twice without new evidence, two no-diff outcomes, changed binding fields, violations or exhausted allowance. The primary triages within existing authority, completes unaffected work and asks the owner only for a genuinely missing decision/input/scope/budget. Exceptional primary test correction remains ADR-0024's between-lease exception with invalidated and reaccepted test evidence.

Inspect actual diffs, focused evidence and terminal compliant receipts before acceptance. Accept Green separately from the required RETAINED/REFACTORED/RECONCILE cohesion disposition. Permitted Refactor is only behavior-preserving within declared responsibilities and paths after Green in that turn; a changed structure contract returns to primary. Each S3 slice receives fresh `critical_reviewer` review. Final integrated review uses a different fresh `critical_reviewer` for remaining identity/ownership/durability risks; do not add another routine reviewer layer.

## Decision Review Contract

**Tier/target:** R3 for remaining M3-02 runtime identity, privacy, dispatch, concurrency and recovery semantics; authoritative output is the L1–L6 contract in this plan, not a new ADR by default. M3-01's settled literal choices and six-case-only exception are fixed inputs. Current planning records the procedure; it does not claim those runtime decisions have passed research/synthesis.

One bounded non-ranking discovery pass may identify the smallest representations and exact existing seams. Freeze candidate alternatives, criteria, hard gates and evidence dimensions before comparing. Criteria are authority fit, faithful frozen semantics, selected-only privacy, truthful invocation/publication, fail-closed fit, preserved old records, browser-safe dependency direction, testability and least maintenance. Forbidden scope is everything excluded above; schema frameworks, generic registries and speculative infrastructure are not fallback candidates.

Use at most two read-only `critical_researcher` reports with Research Assignment Capsule v1: (1) L1–L3 closed contract/input/artifact/fit identity; (2) L4–L6 dispatch, ownership, durable transitions and recovery. Reports may run concurrently while primary gathers repository facts. Each gets exact authority/evidence references, a 1000-word useful-detail limit plus necessary contract tables, no writes/model calls/downloads, and one targeted follow-up round. Reuse current primary documentation only when its claim is still applicable; verify new time-sensitive external API claims against official sources if needed, without running adapters or reopening model selection.

At one evidence barrier, mandatory `decision_analyst` receives both dimensions and returns DRAFT READY, RETURN FOR RESEARCH or OWNER DIRECTION; allow one synthesis and one bounded correction. DRAFT READY is followed by fresh `critical_research_reviewer` pre-draft review, with one supported outline correction. Primary alone authors L1–L6 after PASS; a different fresh `critical_research_reviewer` reviews the complete authored runtime contract and invariant packet before worker preflight. No drafter is needed. Use configured role pins from the [agent policy](../../.codex/README.md#model-and-reasoning-policy), not a blanket parent-model override.

Allow at most two final decision-artifact correction cycles; R3 corrections rerun the full packet and complete review. A new critical mechanism invalidates its earlier checkpoint, not its consumed allowance. Repeated decisive gaps twice, two synthesis returns without new evidence, authority conflict or exhausted budget stops dependent work for precise reconciliation/owner direction. An unavailable actual model is a later-task proof boundary, not permission to weaken this contract.

| Invariant | Trigger and required result | Current evidence / future reviewer |
| --- | --- | --- |
| I1 Completeness and authority | L1–L6 cover every task authority and validation branch; no later-task or six-case exception expansion | M3-01/current authorities; analyst and both R3 reviewers |
| I2 Evidence honesty/freeze | All original hashes/versions and actual abstentions preserved; test doubles cannot count as real calls; no output-informed revision | G0 pending recovery; both R3 reviewers and primary |
| I3 Identity/privacy | One live selected Finding, exact evidence/citations, no forbidden fields, browser-safe validators and no raw prompt/secret retention | Existing strict readers/corpus; L1/L2, A–C proof pending |
| I4 Fit | Full exact request and output allowance fit under matching trusted configuration; unknown/stale/overflow fails before attempt with no truncation | L3 and B pending; actual adapter accounting remains later |
| I5 Attempt truth | Configuration/fit/abstention create no invocation; actual dispatch success/failure does; at most one attempt, immutable mode, no retry/fallback | L4 and B/C pending; R3/S3 reviewers |
| I6 Ownership/durability | Supported live owner continues, foreign/restarted work does not; expected-current/sibling/native invariants hold; failures never claim durable success | Existing retrieval/repository boundaries; L5 and C pending |
| I7 Recovery and structure | Stop/deadline/late-result behavior is explicit; no implicit resume; no mixed-responsibility coordinator or generic engine | L5/L6 and A–C cohesion/review pending |

## Concrete Steps

Working directory: `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Load the definitions from [maintained README preparation](../../README.md#development-command-preparation) in each actual PowerShell caller. Do not execute adjacent install/restore or historical task commands merely to load the definitions.

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'Git status failed' }
$m302EntryHead = git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'HEAD lookup failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Pinned Node required' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test tests/run-contract.test.ts tests/scan-normalization.test.ts tests/retrieval-contract.test.ts tests/finding-sufficiency.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Focused contracts failed' }
}
```

Expected planning baseline: strict PASS, 119 tests. Absence of generation files is not preflight proof; worker preflight must inspect the accepted callable and intended behavior. Revalidate G0 against the frozen manifest receipt and the 4+9 references; use the M3-01 archive's read-only packet only after inspecting its actual scope, bindings and effects. Do not run its historical artifact creation commands.

Before G1 completion, freeze these currently **unresolved future commands and effects**, rather than letting workers invent them:

| Slot | Required exact preparation |
| --- | --- |
| G0 | Exact single-file LF recovery and before/after hash checks; all source/local input checks; no content or Git metadata change |
| Preflight / A | Exact import/export, proposed `tests/generation-contract.test.ts` command and A's strict check; first-module expected failure only if applicable |
| B | Exact A+B focused commands and deterministic deadline/fit spies; fixture ownership, versions and protected tests |
| C | Exact new service suite plus affected run-contract/repository/service/retrieval suites; exclusive ignored ordinary test roots, service-owned ephemeral ports, no real network providers; cleanup and mutation fault boundaries |
| Closure | Existing authoritative thirteen-suite sequence from README plus all new M3-02 suites, independent strict TypeScript and client build; verify browser/tool prerequisites and known scratch effects before invoking browser suites; no acquisition or actual model request |
| Guard / recovery | Exact packet/lease IDs, paths, digest and parent lineage for each write turn; Python prerequisite; terminal close and inspection; exact disposable-output retention/deletion effects |

The future test files above do not yet exist and their paths are proposed ownership, not runnable commands. Freeze exact filenames/callables and all native exit/failure propagation before preflight or leases. Pin relevant source/test/package/input hashes, environment and applicable isolated mutable-state identity for evidence reuse. Do not hard-code a historical HEAD, require an uncommitted plan, or reuse receipts under a different current baseline.

## Validation and Acceptance

G0 passes only on exact original freeze bytes and verified references. G1 passes only after complete L1–L6/I1–I7, mandatory synthesis, both R3 checkpoints, precise worker path/callable contracts and command preparation. Planning PASS cannot substitute for either.

Each behavioral slice records preflight classification, separately owned Red/Green (or justified existing/characterization route), exact test boundary and failure, terminal lease identities, actual passing commands, independent strict check, cohesion disposition, primary acceptance and fresh S3 verdict. No tests skipped/conditionally bypassed to obtain Green. Audit new/changed tests, helpers, fixtures, mocks and focused markers at handoff; remove temporary production substitutes rather than scheduling unspecified cleanup.

Task acceptance requires: frozen proposal semantics implemented; exact selected-only projection and canonical references; fit enforcement with unknown/overflow no-call checks; truthful optional invocation provenance; all normalized failure classes; one explicit attempt with no retry/mixing/fallback; live retrieval-to-generation continuation; preserved native/sibling/context data; durable validated readback, stale-write/duplicate/stop/late-result failures; no review decision while pending; and no browser dependency leak or newly exposed UI/HTTP generation path. Missing adapters remain an honest pre-call outcome in normal startup, not a synthetic success. Pure/test service success is not actual provider or context-tokenizer qualification.

Run the full authoritative suite including new tests once at closure, independent strict TypeScript and build. Broaden/repeat only for changed/stale/contradictory evidence or unresolved critical risk; an agent handoff alone does not invalidate a complete fingerprint. Different fresh integrated critical review must pass with every finding dispositioned against the definition of done. Apply the [documentation closure gate](../README.md#task-closure-documentation-gate): update only materially affected developer commands/status/authority links and task summaries, verify JSON/text/links/configuration as applicable and `git diff --check`. M3-01 immutable evidence is not rewritten to mark downstream proof complete; this plan owns M3-02 evidence. Mark Complete and archive only after Verification and this gate; no later task starts implicitly.

## Idempotence and Recovery

Read Current state, the active contract, evidence and affected authorities before resuming, using PLANS.md's bounded reading rule only when applicable. Refresh current HEAD/dirty paths after an intentional commit. G0 recovers original bytes; it never licenses general normalization of protected files or a new freeze version. Missing local exact inputs follow the existing archive recovery, not a fabricated replacement.

Primary alone triages after a stopped worker and terminally closes its lease before documentation or a new writer. Preserve user/peer changes and failed evidence; do not revert, reset budgets or continue a closed lease. Unknown scope, guard violation or unavailable prerequisite stops dependent work without automatic rollback. Use the bug index for a substantive recurring defect when needed, without expanding task authority.

Tests use exclusive task-owned directories verified ignored, untracked, ordinary and inside their approved root. Never touch retained M2/M3 evaluation inputs, the application run store, models, runtime installations or dependencies for cleanup. Record exact disposable children/process identities and cleanup order before effects; close owned resources before removal. Recovery of a failed attempted-generation test must not retry a provider; actual model operation is outside this task. No commit, push, publication or broad deletion is authorized.

## Artifacts and Notes

Current planning changes only this plan, roadmap activation and plan/progress navigation and summary. Future evidence belongs here as concise G0/G1, assignment/lease, Red/Green, invariant and review entries. Do not create extra design documents, telemetry, raw transcripts or payload archives. Record safe artifact references and decisive results; do not promote ignored prompts/schema/package content into tracked evidence merely because it is synthetic.

## Interfaces and Dependencies

M3-01 supplies the fixed proposal/input/control definition; the existing evidence and corpus policies supply authentic selected context. New pure contract/input modules feed one shared generation stage. The internal service and existing run repository integrate it through explicit, selected-only transitions. M3-03 and M3-04 later implement the fixed adapter interface and prove operational counting/configuration; M3-05 later exposes the Generate interaction. No dependency addition is currently justified, and LangChain remains only a bounded replaceable integration option behind application-owned contracts.

## Revision note

2026-09-09 / primary: Created the M3-02 planning-only ExecPlan from current M3-01 closure and source review. Recorded the exact manifest checkout-recovery gate, reused frozen semantics, and bounded future R3 decisions plus three separate-owner TDD slices. Accepted fresh independent planning PASS and documentation/preservation checks; no implementation or frozen-file correction was performed.
