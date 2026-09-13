# Present and verify explicit generation for one Finding

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Owner:** [M3-05 — Present, integrate, and verify structured generation](../../DEVELOPMENT_ROADMAP.md#m3-05--present-integrate-and-verify-structured-generation), Complete.
- **Accepted closure:** [M305-FINAL-06](#m305-final-06--integrated-review-and-task-closure) accepts the implemented explicit generation flow, all ten integration requirements, the complete Verification and documentation gate.
- **Actual evidence:** One original mechanically validated, durably saved and UI-presented proposal per provider under the same v2 runtime. Both remain pending human review. Earlier failures and their unknown exact causes remain preserved.
- **Remaining limitations:** M3-03/C is independently Blocked; G1 image-guidance relevance, model-quality evaluation and later human-review implementation remain separate. This task supplies no capacity, evaluation or release credit.
- **Allowances:** All execution history and finite grants are preserved below. Cumulative public operations are thirteen scans, nine retrievals and seven generations. H's conditional corrected-verification run is unused and unnecessary; no further actual operation or task is selected.
- **Active lease:** None. All implementation and formatting-maintenance leases are terminally compliant. Owned application services, observer and tabs are closed; runtime scratch is empty. Ollama remains running at the owner's request.
- **Next action:** None for M3-05. The plan is archived and relocated links pass validation. No later task is selected.

## Progress

- [x] (2026-09-13 UTC) Completed both approved diagnostic runs under M305-F-01, preserving canonical evidence and normal cleanup; no proposal passed validation.
- [x] (2026-09-13 UTC) Accepted runtime-only correction after bounded research, corrected evaluation/runtime distinction, mandatory analyst and two different fresh critical research PASS verdicts. Existing implementation approval applies; original evaluation bindings remain unchanged.
- [x] (2026-09-13 UTC) Implement F, correct one test assertion overload between leases, pass 133 focused tests, strict/build, all 25 authoritative suites and fresh S3 review; execute both remaining corrected-verification runs.
- [x] (2026-09-13 UTC) Accept different integrated critical PASS and documentation handoff for the incomplete checkpoint. I9 remains unfulfilled; preserve the active plan and In progress roadmap status.
- [x] (2026-09-12 UTC) Accepted different integrated critical PASS for the incomplete checkpoint, failed actual observations and documentation handoff. I9/task completion remains unfulfilled; no actual-call allowance remains.
- [x] (2026-09-12 23:35Z) Accepted D/E implementation, 73 focused D tests, 10 UI tests, independent strict TypeScript, all 25 authoritative suites, final build and four visual captures, and fresh critical PASS without findings. Actual amended verification remains pending.
- [x] (2026-09-12 01:40Z) Reviewed current status, M3-03/M3-04 handoffs, authorities, frozen definition, current source/test seams and rendered-UI reuse.
- [x] (2026-09-12 01:42Z) Independent strict TypeScript and 103 pure tests passed; original generation manifest and thirteen references match.
- [x] (2026-09-12 01:45Z) Authored the planning-only M3-05 contract and bounded G/A/B/C sequence.
- [x] (2026-09-12 01:54Z) Fresh critical planning review returned PASS WITH FOLLOW-UPS, with no Blocker/Major; primary resolved its per-run eligibility clarification. Documentation validation passes as recorded in M305-PLAN-REVIEW-01.
- [x] (2026-09-12 UTC) Received execution authorization and refreshed clean Git/lease, frozen-input and toolchain evidence in M305-ENTRY-02.
- [x] (2026-09-12 UTC) Accepted G after R3 synthesis, corrected fresh pre-draft PASS and different corrected final PASS; complete A/B command and effect boundaries parse and read-only preconditions pass.
- [x] (2026-09-12 UTC) Accepted A: service-owned adapter selection, loopback generation and client response admission; 28 focused tests, independent strict and fresh critical PASS.
- [x] (2026-09-12 UTC) Accept B: explicit Generate, truthful status and accessible proposal detail, complete regression/build/visual evidence and fresh critical PASS.
- [x] Accept the owner-approved D/E selection amendment and three new actual controlled retrieval observations; G1 relevance failure remains explicit, while G2/G3 match their gold passages.
- [x] (2026-09-13 UTC) Observe C success: thirteen public scans, nine retrievals and seven generations include one mechanically validated, saved and displayed original proposal per provider under runtime v2. H's fresh Local run did not reproduce the prior failure and made no code change.
- [x] (2026-09-13 UTC) Accept final integrated PASS for I1–I10 and the documentation gate; mark the roadmap Complete. The plan is archived and final navigation verification passes.
- [x] (2026-09-12 UTC) Pass complete regression, fresh integrated review and C evidence supplement, owned application cleanup and handoff documentation gate. Full task completion/archive remains blocked by unfulfilled C.

## Surprises & Discoveries

- The roadmap's opening summary still called M3-04 unfinished although its task row and [final closure](m3-04-groq-adapter.md#m304-final-01--integrated-review-and-documentation-closure) establish Complete. This plan's activation corrects only those stale current summaries, preserving historical checkpoints.
- The existing [service continuation](../../../src/server/local-service/generation-operation.ts) already owns generation persistence and cleanup, but [service startup](../../../src/server/service.ts) exposes neither a browser Generate route nor default real-adapter dispatch. [App](../../../src/client/App.tsx) has no Generate callback.
- App's retained-owner flag is deliberately sticky after supported retrieval or uncertain cleanup. Merely adding a button behind the existing busy/owner guard would block valid continuation; blindly clearing that flag would permit unsafe overlap. G must distinguish continuation eligibility from uncertain operation ownership without adding a second lifecycle.
- [FindingOutcome](../../../src/client/components/results/FindingOutcome.tsx) labels every failed Finding “Guidance failed” and otherwise advertises supported eligibility. Generation failures and terminal proposals need narrowly corrected presentation.
- M2-04's three actual gold-profile results all abstained because a required guidance role was missing. The [controlled-input exception](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception) applies only to the six fixed M6-02 evaluations, not this task's real integration or M3-03 capacity. It cannot supply a fabricated production RetrievalResult.
- Groq now uses the owner-accepted 65536-byte serialized-body policy, not proof of complete hosted token fit. Its [forward evaluation amendment](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#groq-admission-amendment-to-the-frozen-generation-definition) leaves original manifest bytes unchanged. Do not revive M3-04's superseded accounting blocker.

## Decision Log

- **Decision:** Plan only M3-05, retaining the amended start condition and every completion proof.
  **Rationale:** M3-03 A/B and Complete M3-04 allow this task to start; pending capacity does not authorize inventing support or closing either task.
  **Date/author:** 2026-09-12 / primary.
- **Decision:** Use two implementation slices, not an adapter rewrite or a separate UI framework.
  **Rationale:** Existing generation, validators, persistence and visual foundations already own the difficult behavior. The missing responsibilities are integration/admission and presentation.
  **Date/author:** 2026-09-12 / primary.
- **Decision:** Defer binding integration literals to G; keep current fact gathering R0 and primary-owned.
  **Rationale:** Security, identity and uncertain cleanup trigger R3 for the unresolved integration contract, not another package/model selection. Planning does not silently approve those mechanics.
  **Date/author:** 2026-09-12 / primary.

## Outcomes & Retrospective

G, A/B, D/E and the F runtime correction are implemented with accepted controlled tests, strict TypeScript, build and independent reviews. Thirteen public scans, nine retrievals and seven generations across finite grants now include one original mechanically validated, durably saved and visibly presented proposal per provider under runtime v2. The H Local run passed without another code change; earlier failures and their unknown exact causes remain preserved. Both proposals require human review, including their explicit judgment and remediation limitations. G1 image-guidance relevance and M3-03 capacity remain separate unresolved work. Final integrated review and documentation closure pass, and M3-05 is Complete. No M4 task is selected.

## Purpose / Big Picture

A user with one genuinely eligible selected Finding should explicitly activate Generate, see which immutable provider/model will be used, and inspect either one validated cited proposal or a truthful bounded failure. Scanner evidence, retrieved guidance, AI interpretation, confidence, uncertainty and required human judgment remain distinct. Scan, selection and insufficient guidance never invoke a generation provider.

A reviewer observes this through the existing loopback UI, selected-only durable readback, deterministic adverse cases and one real eligible call through each provider. Controlled tests prove boundary behavior; they do not prove live retrieval eligibility, provider availability, model capacity, semantic support or release suitability.

## Context and Orientation

### Authority and readiness

Start with the [authority map and task router](../../README.md), [requirement semantics](../../PROJECT_REQUIREMENTS.md), and the exact roadmap row. The following links resolve its complete selected authority set; identifier ranges are inclusive.

| Authority | Applicable contract |
| --- | --- |
| [Evidence and review workflow](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals) | REQ-GEN-001–006 and 008–010: eligible selected-only generation, proposal validation, provenance, no-call abstention, source distinctions |
| [Provider execution](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md#llm-provider-selection-and-generation-execution) | REQ-LLM-001, 003–005, 007–009, 011, 015, 016, 019, 021: fixed modes, attempt-time prerequisites, admission, no retry/fallback |
| [Privacy and security](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security) | REQ-SEC-004, 005, 013–016: service-only provider authority, disclosure, secret exclusion and minimized egress |
| [Application accessibility](../../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#accessibility-of-a11y-evidence-lab) | REQ-A11Y-001–004 and 010; REQ-A11Y-006 supplies the visual-only manual verification method |
| [Evaluation behavior](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope), [SPEC](../../specs/SPEC.feature), [HARD_SPEC](../../specs/HARD_SPEC.feature) | BHV-03/04, SPEC-003/004, HS-008/009, including the current Groq admission amendment |
| [Provider boundary ADR-0001](../../architecture/decisions/ADR-0001-interchangeable-generation-providers.md), [React ADR-0012](../../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), [Groq ADR-0014](../../architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) | Existing fixed provider-neutral service and unprivileged UI boundaries |
| [Setup ADR-0020](../../architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md), [aggregate ADR-0021](../../architecture/decisions/ADR-0021-single-file-run-aggregate.md), [Local ADR-0023](../../architecture/decisions/ADR-0023-local-mode-data-boundary.md) | Attempt-time checks, one run.json, application-owned Local data flow |
| [TDD ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [implementation workflow](../../../.codex/execplan-implementation-workflow.md), [lease guard](../../../.codex/write-lease-guard.md) | Independent owners, sequential writes, proportional validation and closure |
| [Analyze/Results contract](../../ui/ANALYZE_AND_RESULTS_PRESENTATION.md), [UI hierarchy](../../ui/README.md), [visual foundations](../../ui/VISUAL_FOUNDATIONS.md), [frontend-quality skill](../../../.agents/skills/frontend-quality/SKILL.md) | Preserve accepted shell, evidence-first hierarchy and accessible states |

Applicable Must portions are Accepted; unrelated Proposed/Deferred portions remain excluded. Completed M3-01/M3-02, accepted M3-03 A/B, Complete M3-04 and passed M2-02 retrieval capacity satisfy the amended start route. M3-03/C remains its own unfinished full-stack capacity gate. M6-02's exactly-six evaluation, model qualification and M4 review are not selected.

The original [M3-01 manifest](../../../evaluation/m301-generation-v1.json) and thirteen references remain immutable; bind the accepted Groq-only forward amendment with that identity before affected output inspection. No controlled evaluation package replaces live retrieval in C. Significant authority changes require their existing owner route rather than plan-only invention.

### Current modules and terms

`PageAnalysisRun` is the service-owned aggregate; its provider context is immutable configuration, not proof of a call. A Finding is one scanner result with its own nested workflow. A ScannerReviewObservation is not generation-eligible. `supported` means complete required guidance roles without unresolved conflict, not model confidence.

[generateFinding](../../../src/server/local-service/generation-operation.ts) already reserves one exact selected owner, saves running generation, executes the [shared stage](../../../src/server/generation/generation-stage.ts), and saves a proposal or bounded failure. On failed publication, [GenerationServiceOutcome](../../../src/server/local-service/contracts.ts) can carry an unpersisted invocation separately from the last durable run. The browser must not hide that attempt, invent its durability, or describe unknown transport results as confirmed no-call.

[createOllamaGenerationAdapter](../../../src/server/generation/ollama-generation.ts) and [createGroqGenerationAdapter](../../../src/server/generation/groq-generation.ts) already implement the accepted fixed boundaries. Local uses exact token accounting; Groq uses `m304-groq-request-bytes-v1`, inclusive 65536 UTF-8 body bytes and the separately checked 4096-token completion ceiling. Successful byte admission does not prove hosted fit or complete input consumption. Credentials remain exclusively in the existing ignored service-side mechanism.

[App](../../../src/client/App.tsx) coordinates selection and shared announcements; [ResultsSection](../../../src/client/components/results/ResultsSection.tsx) and [ResultDetail](../../../src/client/components/results/ResultDetail.tsx) compose focused regions. [FindingGuidance](../../../src/client/components/results/FindingGuidance.tsx) owns retrieval, [GuidancePassages](../../../src/client/components/results/GuidancePassages.tsx) owns complete citations/notices, and [finding-guidance-admission](../../../src/client/finding-guidance-admission.ts) demonstrates detached, identity-bound browser admission. These existing seams guide reuse, not a generic workflow controller.

## Scope and Non-Goals

Implement explicit selected-Finding generation over same-origin HTTP, service-owned selection of the two existing adapters, strict selected-only browser response admission, generation status/disclosure and complete validated proposal presentation. Preserve native scan, retrieval, siblings and prior run data.

The original A/B boundary below is preserved; the later owner-approved D/E selection policy and durable marker are its only amendments. Do not add packages, change models/endpoints/accounting, alter the corpus/finite query domain, rewrite frozen files, relax proposal validation, add credentials to browser/config examples, or introduce streaming, retries, fallback, cancellation controls, provider registries, queues, chat, combined proposals, review actions, comparison, retained-run navigation, telemetry or a new test platform. A/B introduced no new durable fields or child files. D later adds only its explicitly approved retrieval selection marker; any other demonstrated need returns to the controlling authority. Preserve approved existing runtime/models/dependency trees and unrelated ignored material.

## Plan of Work

The smallest proof is existing tests plus focused service/API/admission and browser tests, followed by the existing developer-managed service and explicit UI actions for C. Prefer extending the existing harness to a new evaluation runner. A helper is justified only for a demonstrated missing bounded proof; it is test-worker-owned under a separate exact test lease, never an application bypass. Reconsider preparation that grows into substantial custom tooling.

### G — Freeze only the integration contract

After execution authorization, primary refreshes Git/lease/frozen identities and completes the Decision Review Contract below. One bounded non-ranking discovery may inspect current seams; do not reopen adapter/package/model choices.

Freeze a small authored contract `M305-G-01` in this plan before A preflight:

1. Exact POST route, closed request containing only runId/findingId, response shape/status mapping, parsing/body limits and abort/error ownership. The planned route is `/api/finding-generation`; its exact binding awaits G. No browser-supplied adapter, model, endpoint, prompt, facts, citations, credential or filesystem path is admitted.
2. Default adapter selection from the service's validated durable run context at the existing generation ownership boundary, with eligibility checked before preparation. Internal injected test seams cannot become HTTP options. Startup, health, Analyze, mode selection and Finding selection perform no provider prerequisite check or call.
3. Browser snapshot/admission and current-owner checks before and after reflection/awaits. Preserve completed scan, provider context, retrieval, siblings and exact selected identity; do not accept a valid-but-unrelated run. Define safe treatment of rejected/malformed/lost responses, detached invocation, persistence failure and cleanup uncertainty. No automatic retry, fabricated terminal success, no-call assurance or unsafe owner release.
4. Exact pending/terminal presentation, focus preservation, shared announcements, finite local request lifetime and safe handling of late settlement/unmount/new run. Reuse the service's 120000-ms generation boundary; do not add a conflicting provider deadline or claim browser timeout cancels remote work.
5. Exact responsibility map, A/B test contracts, reuse audit, command callers and effects, fixture namespace/cleanup and C proof prerequisites. Resolve whether a bounded extraction from the two actual client admission responsibilities is warranted; never create a generic utilities module.

G changes no application source. It is primary-authored decision documentation, not a worker setup lease. R3 synthesis and both fresh research checkpoints precede acceptance. New significant architecture, expanded egress, changed eligibility, model or proof policy requires owner direction; otherwise primary may resolve ordinary task-owned literals within execution authorization.

### A — Service dispatch, HTTP and client admission

**Work slice:** `M305-A`; standard TDD; S3 for provider authority, exact identity and uncertain persistence/cleanup. Persistent `test_worker` owns preflight/Red or characterization; separate `code_worker` owns Green and bounded Refactor. Advance only after primary diff/evidence/lease acceptance and fresh `critical_reviewer` PASS or fully dispositioned nonblocking follow-ups.

Planned production path envelope, frozen to exact selected paths at G:

| Path relative to repository | Responsibility / disposition / direction |
| --- | --- |
| `src/server/local-service/generation-adapters.ts` | CREATE only the fixed two-case default adapter selection; service → existing factories, never browser options or registry |
| `src/server/local-service/generation-operation.ts` | EXTEND at existing durable-context/owner seam; retain generation lifecycle and persistence ownership |
| `src/server/local-service/generation-api.ts` | CREATE focused generation HTTP parsing/response mapping; delegates business work to service |
| `src/server/local-service/loopback-api.ts` | EXTEND route dispatch only; no generic router or unrelated request hardening |
| `src/server/service.ts`, `src/server/local-service/contracts.ts` | EXTEND composition and only necessary internal callable types; no duplicated lifecycle or provider implementation |
| `src/client/finding-generation-admission.ts` | CREATE strict detached response admission and selected-only preservation, consuming existing pure validators; no provider/server-I/O imports |
| `src/client/finding-guidance-admission.ts`, `src/client/finding-response-snapshot.ts` | Optional EXTRACT_LOCAL only for demonstrated common snapshot/preservation mechanics used by both actual admission modules; freeze inclusion at G, preserve guidance behavior |

Red-owned candidates: `tests/finding-generation-api.test.ts`, `tests/finding-generation-admission.test.ts`, `tests/helpers/m305-generation-fixture.ts`; existing `tests/generation-service.test.ts` and `tests/finding-guidance-api.test.ts` only if G identifies required regression edits. All production is forbidden to Red; all accepted tests/helpers are forbidden to Green. Both writers are forbidden docs, evaluation, corpus, dependencies, config, secrets and Git writes.

Test observable dispatch isolation, duplicate activation, missing/invalid/abstained/terminal Finding, schema and status handling, attempted versus pre-call failure, lost response ambiguity, detached invocation, failed save, shutdown, late settlement, exact sibling preservation and getter/reentrant input defenses. Deterministic tests use injected native transport/credential I/O and isolated synthetic run roots; no real credential, runtime generation or Groq call.

A supplies callable generation and trusted response admission, not an enabled rendered control. Keep main.tsx/App wiring in B so the intermediate build remains valid. Existing adapter, shared stage, run schema and repository modules remain protected; a required change outside this envelope pauses the slice for G reconciliation rather than becoming an opportunistic rewrite.

### B — Explicit Generate and proposal detail

**Work slice:** `M305-B`; `frontend-visual`; TDD; S3 because retained owner, reentrant publication, attempted-call status and immutable run identity cross the UI/service boundary. Persistent `test_worker` followed by separate `frontend_code_worker`; one fresh `critical_reviewer` covers both critical semantics and visual evidence. No separate visual-review panel.

`M305-UI-01` is the planned reuse audit below. Primary accepts its exact final disposition/state matrix at G and carries it into the conditional assignment capsule.

| Production path | Current responsibility and bounded change |
| --- | --- |
| `src/client/App.tsx` | EXTEND coordination only: generation callback, exact owner reservation/publication and shared announcements; no proposal markup or provider logic |
| `src/client/main.tsx` | EXTEND one same-origin POST binding to App, with no retry/probe |
| `src/client/components/results/ResultsSection.tsx`, `ResultDetail.tsx` | EXTEND composition/props for the selected generation region; preserve results and native evidence |
| `src/client/components/results/FindingGeneration.tsx` | CREATE generation action, immutable provider/model/location disclosure and truthful failure/invocation status |
| `src/client/components/results/ProposalDetail.tsx` | CREATE original validated proposal's supported claims and confidence/uncertainty/assumptions/judgment/reminder; no review form |
| `src/client/components/results/FindingOutcome.tsx` | EXTEND stage-correct failure/eligibility labels without changing abstention policy |
| `src/client/components/results/resultPresentation.ts` | EXTEND existing `findingWorkflowStatus` for stage-correct list labels; preserve card layout and native status |
| `src/client/components/results/FindingGuidance.tsx` | EXTEND only necessary owner/control projection; keep retrieval responsibility separate |
| `src/client/components/results/GuidancePassages.tsx` | REUSE_AS_IS unless exact local citation anchors are needed by proposal references; then bounded EXTEND with unchanged full text/notices |
| `src/client/styles.css` | EXTEND only generation/proposal styles using existing palette, semantics, spacing and responsive behavior |
| Existing Analyze form, findings list/cards, RuleEvidence and ResultsOverview | REUSE_AS_IS; no layout redesign, future controls or provider metadata in scan-only Results |

Prefixless filenames in this table share the explicitly named preceding directory. No other production path is allowed without reconciliation. No refactor beyond declared coordination adjustments and the A admission extraction is planned.

Test-owned paths: `tests/finding-generation-ui.test.ts`, `tests/helpers/m305-generation-fixture.ts`, and only the needed regressions in `tests/finding-guidance-ui.test.ts` / `tests/target-results-ui.test.ts`. Existing `tests/helpers/m104-ui-harness.ts` may be minimally extended for an immediately required test seam, frozen before lease. Pure admission tests from A remain protected. Green forbids all tests/helpers and server behavior.

The Generate action exists only for a currently eligible selected Finding. No generation action or review action exists on abstentions or ScannerReviewObservations. Show Local/Ollama/`qwen3.5:4b` and loopback location, or Groq/`openai/gpt-oss-20b` and external execution with the permitted minimized selected-fact/guidance categories. This is relevant disclosure, not a repeated consent dialog or provider readiness promise.

Use the exact eleven-field proposal contract. Present finding summary, user impact and remediation as AI interpretation with their evidence references and resolved guidance citations; show complete/supported evidence sufficiency separately from categorical model confidence, uncertainty, assumptions (including empty), blocking manual judgment and non-blocking post-change reminder. Do not render model HTML/Markdown as executable content, infer semantic correctness, fabricate human approval or add approve/edit/reject controls.

The bounded state matrix includes eligible Local/Groq; pending and duplicate activation; pre-call missing-prerequisite/configuration/input-fit; attempted authentication/quota/rate-limit/network/provider/response-validation/timeout; validated proposal; failed persistence with known attempted provenance; uncertain/lost response; abstention; sibling selection and late settlement. Automate adverse cases; manual visual smoke needs representative content, pending/failure and proposal states, not every cross-product.

Verify real managed-browser rendering at desktop 1280×800 and narrow 320 CSS pixels, plus the new generation/proposal region at actual 200% browser zoom. Preserve M2-03's explicitly carried full-guidance/detail zoom item for M6-03; do not claim it was closed here. Automated keyboard, focus, status semantics and application accessibility checks are required. Manual work is visual only, not a screen-reader matrix. Bind build/browser/state/viewport identity and teardown; screenshots, if necessary, stay in the exact ignored synthetic-only proof area. Preserve selected-list focus, no focus-stealing announcements, readable long references and predictable return through the existing flow, without adding a return button.

### C — Bounded real integration and closure

**Owner:** Primary for evaluation, evidence acceptance and documentation. **TDD:** Not applicable to the actual external observations; A/B tests do not replace them. **Responsibility placement:** None — no application-source responsibility changes. Any missing helper is separately test-worker-owned before C; no inline implementation by the primary.

C cannot start until A/B and their reviews pass, G's exact complete command/procedure is frozen, and the actual-call prerequisites below pass. When proof inputs are unavailable, finish unaffected implementation/review/documentation and record the exact blocker. Do not spend model calls exploring eligibility.

- Bind one permitted non-sensitive public target. Each newly executed Local or Groq run requires its own authentic completed scan, actual `supported` retrieval for its selected Finding, and matching live service owner, using the existing finite query admission and closed corpus. Sharing a permitted target never permits cloning or relabeling scan/retrieval records between runs. The separately stated M3-03/C evidence-reuse exception still requires complete identity and coverage. Record permissions and exact run/Finding/retrieval/corpus identities in ignored evidence. No public scan or new embedding invocation follows from this planning request; freeze a finite separately authorized preparation allowance before such work.
- Confirm unchanged original M3-01 definition and forward Groq amendment; record exact app, browser, model/runtime/artifact/context/offload and adapter configurations relevant to the proof. Current Groq model availability/deprecation must be checked against official provider sources before evaluation, without synthetic requests or secret inspection.
- Confirm ignored/untracked fixed secret location without reading or hashing the key; only normal service execution may load it during explicit Generate. If absent, let the developer configure it under the existing mechanism; never request its value in chat.
- Record an explicit execution allowance of at most one generation activation per provider, with the Local and Groq runs separate and no in-run mode switch. Record whether any proposed Local reuse from M3-03/C actually matches complete evidence identity and coverage. No automatic reuse, doubled call allowance, retry or reclassification as M6-02 evaluation.
- Exercise the real UI → same-origin API → shared stage → exact selected real adapter → validator → durable readback → displayed proposal path. Compare immutable native/run/provider/retrieval/sibling fields and inspect minimized provenance without saving raw outbound/response payloads. Keep real run evidence ignored; no real proposal/screenshots/private material in tracked docs.
- Record failure as failure. A pre-call stop is not a real call; an attempted provider/validation failure proves the failure path but not a successful proposal demonstration. An ambiguous outcome consumes its activation and is not retried. A failed proof leaves C incomplete and returns for owner direction when the remaining allowance cannot satisfy Verification.
- Close only owned application/browser resources, preserve developer-managed Ollama/models and unrelated evidence, and confirm exact scratch cleanup or explicitly retained evidence before closure.

No authentic eligible input is established at planning. The original global-three M2-04 observations remain abstentions. Fresh observations under the later D amendment may differ and must retain new evidence. The M3-01 exception cannot bypass this blocker, and changing retrieval, selecting alternative models, broad target search, or inventing support requires new authority. M3-03/C additionally needs its required reviewer interface: an M3-05 Local integration observation is not automatically that full capacity proof.

After accepted A/B, record an honest implementation/interface checkpoint even if C remains Blocked. The amended M4-01 start condition may then be satisfied, but the owner must separately select M4-01; M3-05 and M3-03 remain incomplete until their own Verification passes.

### Ownership, budgets and evidence

Use [Milestone Assignment Packet v2](../../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) and the canonical lease commands; do not duplicate their schemas or create a new workflow tool. Set workflow identity `M3-05-20260912-01`, slices A/B, exact caller/effect paths and forbidden boundaries before preflight.

Each slice has one read-only preflight, one coherent Red/characterization and one Green. Each unchanged role/phase chain permits initial attempt plus one ordinary correction and at most one justified final correction, subject to the workflow's stricter repeated-failure/no-diff stops and one review correction loop. IDs, agent replacements, interruptions and clarification never reset budgets. Every write turn gets a fresh primary-opened/terminally closed lease and returned digest; only one is active per worktree. Workers cannot edit docs or perform Git mutations.

Accept actual diffs, meaningful Red, unchanged accepted tests in Green, independent strict checking, compliant terminal receipts and `RETAINED`/`REFACTORED`/`RECONCILE` cohesion evidence separately. Existing covered behavior receives no fabricated Red. Missing first modules use only ADR-0024's narrow exception. A safe read-only preflight cannot start services/create fixture output; effectful commands wait for the prepared lease.

Reuse evidence only if exact command, cwd, relevant source/test/protected-input identity, environment and guard-backed no-drift state match. Mutable browser, filesystem/runtime/provider observations are non-reusable unless isolated identity/state is pinned. Focused checks occur at slices; complete current authoritative suite at final integration, not after every document edit. A different fresh critical reviewer covers integrated cross-slice risks; do not blindly rerun all already-fresh tests.

## Decision Review Contract

**Identity:** `M305-G-01`; M3-05; R3 because browser-to-service identity, at-most-one generation and truthful recovery/provenance contain security/concurrency mechanics. **Status:** Accepted at M305-G-ACCEPT-01 after research, mandatory DRAFT READY synthesis, corrected fresh pre-draft PASS and different corrected final PASS. Target artifact is this plan, not a new ADR or generic design document.

**Decide now at G:** Minimal request/response ownership, fixed default dispatch placement, browser admission/uncertainty semantics, focus and command/effect boundaries. **Prove later:** Implemented behavior, real eligibility/provider success, accessibility rendering and exact capacity coverage. Do not downgrade a proof obligation into an assumption.

Allow one bounded primary discovery pass. Then freeze feasible placement candidates and evidence gaps before comparing them: extending existing focused seams versus the bounded purpose-named modules above. Hard gates are the selected authorities, unchanged eligibility/egress/attempt semantics, no browser privilege, original frozen bytes, complete command effect coverage, and YAGNI. Judge by correctness, smallest current responsibility, reuse, failure truth and testability; no speculative performance scores or artificial third option.

One `critical_researcher` report covers the coherent identity/ownership/attempt boundary, with at most one targeted follow-up. Primary supplies local source facts and UI reuse evidence. If a genuinely independent critical dimension cannot be covered within this bounded assignment, stop and reconcile the capsule before expanding research; do not silently add a panel. One mandatory `decision_analyst` synthesis plus one bounded correction returns DRAFT READY, RETURN FOR RESEARCH or OWNER DIRECTION. DRAFT READY requires fresh `critical_research_reviewer` pre-draft PASS before primary authors binding literals; a different fresh instance reviews the complete authored contract. No drafter is needed. Allow one pre-draft correction and at most two final-artifact correction cycles under the canonical stops.

Review all invariants below, including artifact completeness, evidence honesty and authority-state consistency, at each applicable complete R3 checkpoint. Security/data-flow choices outside existing Accepted authority require owner approval; literal acceptance does not grant new calls, broaden scope or waive permissions. Record report/synthesis/review identities, decisive sources, outcomes and unresolved items in this plan, not a separate ledger.

## Concrete Steps

All commands run in PowerShell 7 from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Use the complete current [README command preparation](../../../README.md#development-command-preparation); its historic M105 variable names are intentional. Do not replay archived task procedures or clean generated output speculatively.

### Current safe entry commands

These inspect state only; they do not start G, an application or provider work.

```powershell
git status --short
git rev-parse HEAD
git diff --check
git ls-files .env
git check-ignore .env
Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json'
```

Expected: known intentional dirty paths only, no tracked secret, ignored `.env`, no active lease. Never display secret contents or hash the credential. Refresh the accepted endpoint after any intentional intervening commit/doc change; freeze actual HEAD, symbolic ref, index and exact dirty/protected identities in each packet, not the historical entry hash.

After loading the README preparation into the same shell:

```powershell
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'M3-05 strict TypeScript failed.' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/generation-contract.test.ts tests/generation-stage.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M3-05 pure entry checks failed.' }
}
```

Expected entry result: 103 passing tests at the planning endpoint and strict exit 0. Later valid test additions may change the count; compare actual identity/coverage, not a permanent count assertion.

### Command freeze and staged C binding

The owner's execution instruction resolves each applicable slot before its preflight or effects, superseding the earlier blanket pre-A timing. M305-G-01 binds A/B, build, regression and visual commands before A preflight. C remains independently gated: primary must freeze its complete procedure and current identities after A/B and before any C effect. The slot inventory below remains the completeness check, not additional authorization. Merely naming a function or copying a historical helper is insufficient.

| Slot | Required binding and permitted effects |
| --- | --- |
| G entry/identity | Exact Git/lease endpoint, source/test and protected corpus/evaluation/config/dependency hashes; thirteen frozen-reference checks; runtime paths/versions; no secret hashes |
| A focused | Exact selected API/admission/service test files, Node invocation, timeout, prerequisite preparation, synthetic run-root leaves/port ownership and cleanup; fixed injected credential/transport only |
| B focused/browser | Exact generation UI and affected guidance/results commands, harness/build identity, managed-browser executable, fixture origin/routes, desktop/narrow/zoom procedure, screenshot destinations if needed, temp/env setup/restoration and teardown |
| Build | Exact strict/Vite commands and a safe fresh-output procedure for existing `dist/client`; inspect/preserve existing output before an authorized exact replacement; no blanket deletion or installation |
| Test bootstrap/cleanup | Exact missing leaf creation, ignore/untracked checks, ordinary-path containment, current inventory, generated files, expected residue and cleanup commands; never reuse a nonempty fixture root or erase an unfamiliar one |
| C preparation | Exact public target authorization, source/run/Finding identity, finite scan/embedding allowance, authentic support check, service/browser start/stop ownership, runtime and official availability checks; no generation during preparation |
| C activation/readback | Exact UI procedure/caller and one-per-provider allowance, live endpoint/run roots, deadlines, invocation/success checks, secret-safe durable comparison and failure-stop behavior |
| C cleanup | Exact owned resources, terminal cleanup proof before deletion, retained evidence disposition, verified absolute leaf targets and recovery limits |
| Complete regression | Current README's explicit 22-suite inventory plus accepted new suites; serial scratch-qualified callers, independent strict TypeScript, current client build and exact no-active-service prerequisite |
| Documentation closure | Exact affected documents, link/config/format checks, `git diff --check`, status/invariant reconciliation; no requirement or ADR change expected |

No manifest/lockfile generation, dependency restore, browser acquisition or model installation is planned. If existing prerequisites are missing, record the specific blocker and applicable developer-managed route; these slots do not grant acquisition authority. Tests/builds can create output and start isolated services even when application source is unchanged, so they are not misclassified as read-only.

## Validation and Acceptance

The following cumulative packet binds requirement coverage to observable evidence. [A acceptance](#m305-a-accept-01--accepted-service-and-admission-slice), [B acceptance](#m305-b-accept-01--accepted-implementation-and-interface-checkpoint) and [final review/closure](#m305-final-01--accepted-checkpoint-and-unfulfilled-real-proof) establish I1–I8 and applicable I10 for the implementation/interface handoff. Those historical handoffs did not satisfy I9. The retained F Groq proposal and subsequent H Local proposal now satisfy I9 through [final integrated acceptance](#m305-final-06--integrated-review-and-task-closure); all ten requirements pass and failed evidence remains preserved.

| ID | Trigger / expected result | Proof owner |
| --- | --- | --- |
| I1 — completeness and authority | Exact roadmap authority set resolved; no omitted gate, later-task activation or unsupported Complete claim; original frozen manifest and amendment both bound | Primary; G and final reviewers |
| I2 — explicit selected-only call | Analyze, selection, health and unsupported/abstained/manual-review items make no generation call; explicit eligible action dispatches only durable-context adapter once; duplicate/late work cannot cause a second call | A/B tests; S3 |
| I3 — identity and preservation | Malformed, reentrant, foreign or stale responses cannot change run/provider/native/retrieval/siblings; no browser-supplied provider or payload authority | A/B negative tests; S3 |
| I4 — ownership and recovery | Supported retained owner can continue; busy/uncertain cleanup cannot reopen work; failed save/lost response preserves uncertainty and known attempts, no fake durability, retry or fallback | A/B failures; integrated S3 |
| I5 — secret and egress isolation | Browser never receives key, filesystem authority or direct provider access; existing selected-only projection/exclusions retained; no sensitive raw evidence in tracked artifacts | A boundary tests, bundle/import inspection; S3 |
| I6 — admission and failure truth | Local complete token fit versus Groq fixed byte policy remain distinct; pre-call error has no invocation; provider rejection/invalid output has truthful attempted provenance and no abstention | Existing adapter evidence plus A/B integration; S3 |
| I7 — proposal and source clarity | Only validated original eleven-field proposal displayed, references inspectable, evidence/support separate from confidence, uncertainty/assumptions/judgment/reminder retained; no human decision fabricated | B tests/visual; same S3 reviewer |
| I8 — accessible current UI | Semantic native actions, no action on abstention, shared meaningful attempts/failures, keyboard/focus continuity, desktop/narrow/new-region zoom, inert long text and non-color distinctions | B automated/browser/manual visual; same S3 reviewer |
| I9 — real integration and honest limits | One real eligible Local and Groq path, exact configuration, actual attempt/validated proposal/durable readback/UI; no controlled-input exception or automatic capacity/evaluation credit | C primary observations; fresh final S3 |
| I10 — cohesion, cleanup and closure | Focused modules, unchanged accepted Green tests, compliant leases, complete authoritative regression/strict/build, exact owned cleanup and reconciled docs | Primary, slice S3 and different final S3 |

A/B checkpoint requires I1–I8 and applicable I10 with real browser and controlled service-to-disk evidence, explicitly excluding I9. Full completion requires all ten and the roadmap's complete Verification. A blocked C can be handed off honestly but cannot archive this plan or mark M3-05 Complete.

## Idempotence and Recovery

Re-entry always inspects current Git status, active lease, exact partial outputs and previously consumed allowances. Do not force an old HEAD, restore an old index or require this plan to remain uncommitted. An intentional commit requires endpoint revalidation, not rewriting historical evidence or rejecting every subsequent receipt.

Stop an affected branch on stale identity, wrong Red, unknown write, noncompliant lease, unexpected contents, repeated decisive failure or exhausted budget. Primary resolves only within current authority and remaining budgets, preserving accepted work and unrelated changes. Fresh packets/leases are required after reconciliation; a worker stop is not permission for primary implementation.

A browser/network timeout does not prove a provider was not called or stopped. Preserve last valid evidence and the uncertainty/owner guard; never resubmit automatically. Do not rewrite a failed or abstained run into a supported one. New independent Analyze is product behavior, not an agent's permission to spend another evaluation activation.

Before any cleanup, prove resource termination and resolve exact ordinary absolute paths within the task's approved leaf. Preserve unknown/nonempty roots for triage. No recursive operation targets a workspace root, `data/runs`, `temp`, `logs`, model store, dependency tree or developer browser root. Retain declared ignored proof material; report any material deletion and its recoverability. No process-wide kill, runtime/model removal or secret deletion is authorized.

## Artifacts and Notes

### M305-B-RED-RECOVERY-01 — Nonterminal test run and bounded recovery

**Later diagnosis supersedes the failure interpretation below:** M305-B-RED-DIAGNOSIS-02 proves that the shared guidance fixture fails before Generate is reached. Neither attempt establishes behavioral Red. Reporter headlines alone did not expose the error, and the worker's missing-Generate and entered-close interpretations were unsupported.

B Red attempt 1 changed only the new generation UI test and the two allowed helpers. Strict TypeScript passed after two test-only typing corrections. The ordinary App harness reached the managed Chromium with no external/page errors and closed cleanly, while its six behavior cases failed at the missing Generate control. The separate actual-main harness reached the application but its failure did not produce teardown or a terminal command exit. This is **RED INVALID**, not accepted behavioral evidence. The worker stopped all writes, preserving both test changes and owned residue. Attempt 1 remains consumed; ordinary attempt 2 and conditional 3 remain, without a budget reset.

The worker discarded the nested execution session metadata when printing only command output; there is no available stdin/TTY handle for graceful stop. Future long-running tool calls must retain and report the entire nested execution result, including session ID. Exact observed Node PIDs are 15552 and 23748, both started 2026-09-11 22:19:57 -05:00 with this test invocation and the pinned Node executable. Loopback port 5173 remains connectable. CIM/listener ownership queries require a read-only sandbox escalation; ordinary Get-Process and scratch reads remain available.

Primary freezes this operational recovery before its effects: read exact PID command lines, creation times and parentage, then their verified descendants; preserve unrelated processes. If no graceful control exists, terminate only the freshly identity-matched test process tree, never a name-wide Node/Chromium/Ollama kill. Confirm every owned process exited and port 5173 closed before moving any residue. This reconciles the worker's narrower no-process-kill packet within the owner's existing test-resource cleanup authority; it grants no product/model action or additional attempt.

The exact retained source leaf is `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab/temp/m104-ui`. Its only observed children are `m104-test-entry.html`, `m104-test-entry.tsx`, `vite-cache`, `playwright_chromiumdev_profile-d7NdsD`, and `playwright-artifacts-bCGBwY`. After termination, require ordinary contained ancestors, exact child inventory and ordinary recursive contents; preserve them by native PowerShell `Move-Item -LiteralPath` into the previously absent, ignored/untracked ordinary leaf `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab/temp/m305-b-red01-residue`. Do not delete them or touch other scratch/runtime/run contents. Verify both inventories and restored empty scratch before correction. Unknown contents or identity drift stop the affected action for primary triage.

Before corrected Red, the same test worker must resolve primary's concrete witness gaps within the five-file envelope: reuse valid abstention fixtures; keep old/new generation tests inside one mounted App; ensure callback-property reentry actually fires; cover the full bounded attempted and unknown failure matrix; active sibling selection, keyboard activation and proposal-scoped references; representative terminal accessibility/reflow; and exclusive, useful synthetic captures. Missing fixture validity, teardown, import or runner behavior cannot become Red. A remains accepted; C allowances remain unused.

**Recovery result:** Fresh CIM checks matched the exact executable, creation time, parentage and test/profile command before terminating owned headless Chromium 32972 and then the still-running test child 23748. The first Stop-Process call errored and did not establish termination; subsequent identity-checked CIM termination returned zero. Parent 15552 then exited. Fresh checks found no owned browser descendants or either Node process and no port-5173 listener. Browser-driver cleanup removed its two profile/artifact leaves; the remaining exact three entries were ordinary contained paths. Primary preserved all thirteen remaining files with matching lengths and SHA-256 values in the previously absent ignored/untracked `temp/m305-b-red01-residue`; all four required scratch roots are empty. No unrelated runtime, process or run was changed. Recovery does not convert the interrupted run into Red evidence.

**Correction-2 constraints:** Restore timer overrides in finally and change only the generation deadline timer, retaining the real original timer before any override; never leave a patched timer across tests or disable all timers. Diagnose actual-main teardown from its concrete pending resources. Retain complete execution results/session IDs and obtain terminal exit plus normal cleanup evidence. Accessor wrappers must retain component identity across rerenders; reentry must click the observed Generate node and assert a witness. New-run overlap must use ordinary Analyze in the same App. Use validated existing abstention fixtures. Add quota/rate-limit/network/response-validation/attempted-timeout and rejection/malformed/missing-callback witnesses, active sibling selection, Enter activation, proposal-scoped references and representative terminal axe/reflow. Capture only into the frozen eight exclusive files using buffer writes with exclusive creation; bring the generation/proposal region into view.

### M305-B-RED-DIAGNOSIS-02 — Proven fixture failure before cleanup

Red attempt 2 closed compliant with contract `f08f7d7bf18fcd1018e52110ac14209ff2c804c541d63d0419ef5cfedd1943ab` and receipt `7eacd93b97fcc5e8b31d4663fb89f95542069b35083b6a55653567bb8635fab7`; only the same three allowed test/helper files changed. Strict passed. The Node spec reporter emitted six App failure headlines, a passing capture-disabled branch, and actual-main failure at 1577.5313 ms, with suite failure at 2961.7573 ms but no terminal process result. These headlines contain no failure stack and prove no missing production behavior. The first App harness cleaned up; the second was leaked. Session 51073 remained available only to its originating worker; primary polling returned unknown process ID. This is RED INVALID, with no budget reset.

Primary's two read-only, browser-free Node probes used unchanged README preparation and the actual helper, validators and corpus bytes. `generationScanRun` validates, but `supportedGuidanceEnvelope` throws `Synthetic M305 guidance citations must resolve` for both explicit-Local and actual-main IDs. Its `resolveCitations` call passes an active workflow Finding into the native-Finding contract and returns `result-validation`. Passing the corresponding native Finding from the existing scan fixture instead returns valid citations, and the resulting unchanged run/view is accepted by `admitGuidance`. This is a demonstrated correction, not a new hypothesis. The actual-main test creates the harness before those fixture calls but enters try/finally only afterward, so this error bypasses cleanup entirely. Restoring global fetch could not fix that boundary; no evidence supported the earlier alleged await stall.

This material new evidence and the preceding concrete witness improvements justify the existing conditional Red attempt 3 after recovery: use the corresponding native scan Finding for citation resolution, validate every intended valid fixture/envelope before browser effects, and place all post-harness setup inside its try/finally (or prepare fixtures before acquisition). Preserve the acceptance assertions and existing five-file scope, role and objective. Add no timeout extension, skipped main proof or cleanup framework. This is the final test write attempt; unsuccessful attempt 3 or another unresolved decisive failure exhausts automatic continuation. Routine new-test fixture correction remains recorded here under the bug index's task-contained correction exception.

**Recovery freeze before effects:** Fresh CIM inspection identifies Node parent 30088 (parent PowerShell 17208) and test child 7572, both pinned Node executable and creation 2026-09-12 03:43:06Z; child owns loopback 5173. Headless managed Chromium 14860 is child of 7572, created 03:43:08Z with exact profile `temp/m104-ui/playwright_chromiumdev_profile-icFhBy`. Verified browser descendants are 28960, 20956, 23852, 11916, 29440 and 26184, all the same owned runtime/profile. The earlier non-escalated port query exited 1; it was not closure proof. Following fresh identity rechecks, terminate only this owned browser tree and, if still needed, this Node test child; let its parent/wrapper exit and preserve unrelated processes. Require fresh process and port closure. Then verify ordinary contained paths and exact remaining inventory from the five known entries (`m104-test-entry.html`, `m104-test-entry.tsx`, `vite-cache`, the profile above and `playwright-artifacts-3KLOvI`); driver-removed profile/artifacts may be reconciled. Preserve remaining files with matching lengths/hashes in the absent ignored/untracked ordinary `temp/m305-b-red02-residue`, using native PowerShell moves only. All four scratch roots must be empty before Red 3. No model, real run, first recovery archive or other workspace resource may change.

**Recovered and diagnosed:** Exact browser and Node-child termination returned zero; fresh CIM and listener checks confirm all owned processes exited and port 5173 closed. Driver cleanup removed its two leaves. The remaining exact three entries were preserved with all thirteen file lengths/hashes matching in `temp/m305-b-red02-residue`; all four scratch roots are empty. Worker collected session 51073 terminal exit 1: eight tests, one pass, seven failures, zero cancelled/skipped/todo. Every failure is the citation-fixture error at helper line 48; actual-main reaches it at test line 468 before try/finally. This confirms the primary's independent diagnosis and invalidates both missing-Generate interpretations. The caller unwound through environment restoration and its PowerShell session ended. The failed run remains historical evidence only. Conditional Red 3 is authorized by the proven native-Finding substitution and cleanup-boundary correction, within the unchanged five-file envelope; no fourth attempt is authorized.

### M305-B-CAPTURE-CORRECTION-01 — Bounded primary test exception

Final worker Red 3 produced terminal behavior-only evidence: eight tests, two pass and six missing-Generate failures, with normal App/main teardown, no external requests/page errors and empty scratch. The existing guidance 9/9 and Results 30/30 suites and strict TypeScript pass. Receipt `8431c827d9a78a7d1da5d4ee312f50e121330e99fab3d4911cdef621b3f976d4` is closed-compliant; only the generation UI test and fixture changed in this attempt. Earlier harness changes remain present but were unchanged by attempt 3.

Primary inspection found the capture helper still scrolling the entire tall evidence detail. That does not target the required new region and can produce unhelpful guidance-only screenshots. With no active lease and before Green acceptance, the primary applies ADR-0024's narrow test-correction exception to only `tests/finding-generation-ui.test.ts`: scroll the observed Generate control for eligible/pending/failed images and the unique validated proposal summary for proposal images. This changes no product requirement, assertion, production code, capture path/count or effect budget, and authorizes no fourth worker attempt. It is necessary to make the frozen visual-proof caller useful. The old Red identity is invalidated; fresh ordinary generation-UI Red plus strict checking must be accepted before Green. Capture execution remains post-Green, so this structural correction itself is not image evidence. The unchanged baseline suites retain their matching harness/source identity.

### M305-B-RED-ACCEPT-01 — Accepted corrected interface test boundary

Primary independently reproduced strict TypeScript and the complete ordinary generation-UI suite after the capture correction: eight tests, two pass, six behavior-only failures, zero cancelled/skipped/todo, 25659.1395 ms. Terminal Node exit 1 is expected Red; the checking PowerShell caller exited 0 after verifying it and all four empty scratch roots. The exact failures are missing Generate count assertions in App/main and exact-control waits in failure, proposal, reentry and deadline cases. Both harnesses report settled cleanup, zero external requests and zero page errors. This accepts meaningful Red only; assertions beyond the missing boundary remain unexecuted until Green. Capture-disabled success supplies no image evidence. Unchanged guidance 9/9 and Results 30/30 evidence remains valid for its exact source/harness/environment identity.

Frozen generation UI SHA-256 is `0384f1ed47ce16041564a3a8cbe3fced9eaa9247589104aaa9480f9dd9e85535`; M305 helper `3972e6dba41ad497b8f39ff62d2e22bc678a78beec34bd1bb34331d2d580c605`; M104 harness `1e2af93f8fb78bc224751101712827ad5d45d66e0863a6fb5f938eeb10cee54b`. All tests/helpers are immutable during Green. The three B Red worker attempts and the bounded primary exception remain recorded without resetting any ceiling. Green attempt 1 is the next authorized separate-owner phase, restricted to the ten B production paths; no build, captures, manual helper or C effects are part of that worker assignment. `git diff --check` passes.

### M305-A-ACCEPT-01 — Accepted service and admission slice

Fresh `critical_reviewer` M305-A-REVIEW-01 returns **PASS**, with no Blocker/Major/Minor and cohesion RETAINED. Primary accepts A's actual diff, corrected test boundary, compliant leases and M305-A-VERIFY-01 evidence. The reviewer independently reproduced all 28 focused tests and strict TypeScript, twelve additional pure negative witnesses and two positive controls, with zero accessor reads. It verified all six A contract/receipt digests, no active lease, 47 protected baseline files, original manifest and pure client dependency direction; all owned roots were removed.

Reviewed twelve-file A fingerprint is `fca77043f7289e664a9b15ffba042a3858b95481d0039cf80429852491b57a77`; complete 129-file source/test fingerprint is `2ea40888201eb6ecc1a5122e0624ef709ebe690da32a776cfbc09bcd4dbb7855`, using the declared Ordinal/LF algorithm. No further A correction loop was used. Historical failed/no-diff attempts remain recorded. B preflight is accepted MISSING and all its write/review allowances remain unused; B may now begin guarded Red. This checkpoint implements no rendered Generate action and proves no live-provider result, capacity or full-task completion.

### M305-B-GREEN-TRIAGE-01 — Redirect wait correction and status refinement

Green 1 changed only its ten allowed production paths and closed compliant, receipt `34dba8cb57f0ee4c10991063d73d441bfc148051ecfa3afd75b73087a025995a`. Strict checking passed; generation UI passed seven of eight groups, with normal browser/harness cleanup and four empty scratch roots. Primary inspected the actual diff and new component owners. The failed group waits for the requested URL, but the valid redirect fixture and existing UI intentionally display the final URL. Product behavior must not change to satisfy this wait.

With no active lease, ADR-0024's narrow primary test correction applies only to `tests/finding-generation-ui.test.ts`: await detachment of the previously selected detail after the new validated Analyze clears selection. Existing new-run guidance, distinct invocation IDs and late-publication assertions remain unchanged. This observes an actual run transition rather than the already-visible shared final URL. Invalidate the changed test identity and re-accept focused generation UI plus independent strict checking before Green 2; do not fabricate Red against implemented behavior. No worker attempt or review allowance is reset.

Primary re-accepts the corrected test boundary: independent strict checking and all eight generation UI groups passed (10484.501 ms, exit 0), both harnesses closed normally with no external requests or page errors, and all four scratch roots were empty. Test SHA-256 is `490f221016dc8030fd96e39f3d29671ee5f73206584f04f25cb690b2e297a9b4`; both helper hashes in M305-B-RED-ACCEPT-01 are unchanged. These are passing correction checks, not fresh Red.

Green 2 must refine the current overly broad no-call inference to explicit accepted G tuples and project admitted unknown outcomes consistently into detail, list and announcements. Running snapshots without invocation remain unknown; generation-persistence retains ownership even for known pre-call failure. Responsibility placement, ten production paths, tests prohibition and all effect budgets remain unchanged. Green 1's repeated pre-write Red execution was redundant; reuse unchanged evidence going forward.

### M305-B-GREEN-02 — Implemented interface and manual-helper correction

Green 2 closed compliant with only App, FindingGeneration and resultPresentation changed, receipt `89db53c988b66b288eb137ddbb615d5974466c1756b4e6e50f67cdf6d0b86e18`. Primary inspected the final classifier, shared status/persistence wording, exact diff and unchanged accepted tests. Explicit known pre-call tuples replace absence-based inference; unknown save status no longer asserts that nothing was saved. The focused owner separation is RETAINED. Worker strict checking and 8 generation, 9 guidance and 30 results groups pass; after the final isolated wording refinement, strict and the affected eight generation groups passed again. Normal teardown and four empty scratch roots were observed. Pre-manual-correction 132-file fingerprint is `5954c187e6bcfe00fca086bb1e778589f5a4b48504dd5776af3ac30877a7c7ec`. Green 2 is consumed; only conditional Green 3 remains, without resetting any review or Red budget.

Before executing the untested manual mode, primary source inspection proves its broad `getByText(/generation.*pending|generating/i)` matches both the card's Generating proposal and the detail pending paragraph. With no active lease, the narrow ADR-0024 primary test exception changes only that wait in `tests/helpers/m305-generation-fixture.ts` to the unique exact pending paragraph. It changes no fixture, assertion, production behavior, duration or effect scope. Invalidate the helper identity and dependent test evidence; the complete current 25-suite regression plus independent strict and actual manual execution provide replacement verification. Do not invent Red or launch a known-invalid browser helper first. No additional worker attempt is authorized by this correction.

### M305-B-MANUAL-TRIAGE-01 — Earlier duplicate eligibility label

First manual execution exited 1 before Generate: the global exact Eligible for generation text locator matched both the card status span and detail heading. The earlier corrected pending locator was not reached. Normal finally teardown completed with no external requests or page errors; primary verified all four scratch roots empty. No native zoom or real operation occurred.

Between leases, primary narrows only this manual wait to the exact Eligible for generation heading. This is the same ADR-0024 test-locator correction chain, with a distinct observed earlier failure; no product, fixture or ordinary-test behavior changes and no budget reset. All remaining manual locators were inspected: Results heading, exact native controls, unique pending paragraph and unique proposal summary. Re-accept strict and helper-dependent API/admission/service/UI suites plus actual manual execution. The full 25-suite result before this manual-only correction remains historical; unaffected suites have unchanged relevant code. Eight captured images remain bound to their exact pre-correction helper/source identity and unchanged production/rendered fixture; they are retained without overwriting or claiming a new capture. Fresh review must assess this evidence limit.

### M305-B-REVIEW-CORRECTION-01 — Required provider-relevant announcements

Fresh critical review identifies Major B-1: `App.selectResult` announces only the human label for generation states, omitting the provider context and call disposition required by REQ-A11Y-010; successful settlement omits the actual attempted-call information required by REQ-A11Y-004. Primary checked both Accepted rows and the actual source. Visible detail truth does not replace the shared-announcement requirement. The reviewer confirms that reselection of the exact current supported continuation also needs immutable provider context and known no-call-before-Generate wording; mere active state or configured callback does not establish that continuation. Existing generation tests only check generic generation/proposal text and miss this acceptance contract.

No worker lease is active. The ADR-0024 narrow primary test exception corrects only these existing announcement assertions in `tests/finding-generation-ui.test.ts`: Local/Groq exact-current eligible, pending and proposal reselection, successful settlement while a sibling remains selected, pre-call/attempted/unknown failure reselection, and locally unknown collaborator outcomes. Preserve the existing fixture, interaction, focus, invocation-count, timeout and no-retry assertions. This exceptional correction addresses the independently established omission in the current test boundary; it does not open a fourth test-worker attempt, new scope or renewed budget. Prior affected evidence is invalidated. Meaningful failing assertion evidence and independent strict checking must be accepted before any Green correction.

Primary accepts corrected announcement Red: independent strict passes; eight UI groups terminate with six passes and two assertion failures, both showing actual `Selected Image alternative issue 1.` instead of required provider context. Node exits 1 as expected; the wrapper exits 0 only after checking that result. Duration 8782.4843 ms; normal teardown and four empty scratch roots. Test SHA-256 is `3c0c55628410057d9049094dcfe096e0eaa4d89a3414ab3c092ac2853a9e8c77`; final manual helper SHA-256 is `ab4a5bea464e1c4f1d9c50168ad86bca2ae5813e8ea99c3e6836c165a7d588fa`. This is meaningful corrected-boundary Red, not a fourth test-worker write turn.

The same boundary was then completed with the reviewer-confirmed eligible-reselection assertion. Fresh independent strict passes; final Red remains six passing groups and two required-context assertion failures (8461.2827 ms), normal cleanup and four empty scratch roots. Final immutable generation test SHA-256 is `52488c002c1e258ee59dbc3da98a8d6e552e65ea4d6c4ae1366541ad327196d7`; helper remains `ab4a5bea464e1c4f1d9c50168ad86bca2ae5813e8ea99c3e6836c165a7d588fa`. This supersedes the earlier announcement test identity.

Consolidated initial critical review is REVISE for B-1 only, with no additional finding. It inspected all eight captures, independently passed strict checking, twelve admitted failure cases, six attempted-only rejection cases and two mode-success controls, and verified five B leases plus 79 protected paths. Native 200% remains pending. Primary accepts the finding and authorizes conditional Green 3 for B-1 under the justification below, consuming the single review correction loop; tests remain frozen at the final identities above. Green 2 established passing interaction/lifetime behavior and accurate visible unknown statuses; B-1 is materially new evidence of a separate omitted Accepted announcement obligation. A bounded state-derived announcement formatter within FindingGeneration, consumed by App's existing selection/settlement paths, can share the already corrected call classification and preserve one live region and focus. This remains the original ten-file scope and is likely to resolve the identified gap without changing service/admission/lifecycle. The initial review's one correction loop and conditional Green 3 are the remaining authorization; failure exhausts automatic implementation continuation.

### M305-B-GREEN-03 — Corrected announcements and final verification preparation

Final Green 3 closed compliant, receipt `042e8f6d658243fe3292fc671f064e410f29a96d460d141bd4a8836e9dd52ece`, changing only App and FindingGeneration. Primary inspected the actual shared formatter and its exact-continuation/state callers; lifecycle mechanics and accepted tests are unchanged. Worker independent strict and 8/9/30 UI groups pass with normal cleanup. The 132-file fingerprint is `2527532c2f641dff3419c32909b390f731d4760c1237690bce6159a5f3844ef8`. All B worker write allowances are exhausted. The single critical re-review and actual visual/full verification remain; no C operation is authorized before their acceptance.

The prior build and eight captures passed at Green 2 but have older source identities. Preserve their exact inventories below in absent ordinary ignored/untracked archives before rebuilding and creating the replacement set of exactly eight captures through the unchanged callers. This retains historical evidence without overwrite or deletion. The original entry build archive and Red residue archives remain untouched. Primary owns this bounded replacement between leases. Run the complete 25-suite caller, independent strict/build and captures against final source; then the corrected manual helper and actual native 200% inspection. No further automatic implementation correction follows a failed final attempt.

```powershell
$m305ReplacementOutputs = @'
{
  "build": {
    "source": "dist/client",
    "archive": "temp/m305-build-green02",
    "files": {
      "index.html": [
        414,
        "73349bf695e63b7d3ddbef94c1109e851d0f83defde61a82c8ef756857135429"
      ],
      "assets/index-BgmXcACI.js": [
        273303,
        "2d672b887f8c576bf8e118cbd035c7edca50eaf16eddf5fa683be76ec6f016ba"
      ],
      "assets/index-CuLtGKH2.css": [
        5875,
        "48ce995b24643453d9765c9530000d988080c5204aa9a945c583607ce634e86e"
      ]
    }
  },
  "proof": {
    "source": "temp/m305-generation-proof",
    "archive": "temp/m305-generation-proof-green02",
    "files": {
      "eligible-desktop.png": [
        40664,
        "df9e2faa978648cff18fadeed8f5c9101f6a57a2eca7c3bec566d047962aa779"
      ],
      "eligible-narrow.png": [
        25914,
        "04ea46f854259578e82717d009cc2e31866809707889a3c4785f14f9422bf03c"
      ],
      "failed-desktop.png": [
        38185,
        "e71fb0e2b842617ade7f8618c2e447c0d5d071d7b16918e39c3b669dfa3212ea"
      ],
      "failed-narrow.png": [
        26979,
        "a2cdc84ab69273b0c1db8bc5b586104f431a8650a5b0aa3d06fdf114a5ace677"
      ],
      "pending-desktop.png": [
        41420,
        "fab710ee327c34320cdb37b067ed1601f15300f9347874ded02da37b77f82f00"
      ],
      "pending-narrow.png": [
        28008,
        "b814b4ffb8592227457aff41cc36e8a28c55e812e1660c436316112ecf9f98c8"
      ],
      "proposal-desktop.png": [
        46789,
        "56247404718b8a196821cd4cd588a6c6792072247210036ece29248538055917"
      ],
      "proposal-narrow.png": [
        30714,
        "a64eb3d3e823017571c1c00e89e209f2c68ccd3ad5dc51e902775c763fe18223"
      ]
    }
  }
}
'@ | ConvertFrom-Json -AsHashtable
foreach ($m305Output in $m305ReplacementOutputs.Values) {
  $m305Source = Assert-M105OrdinaryPath ([IO.Path]::GetFullPath((Join-Path $m105Repo $m305Output.source)))
  $m305Archive = [IO.Path]::GetFullPath((Join-Path $m105Repo $m305Output.archive))
  $null = Assert-M105OrdinaryPath $m305Archive -AllowMissing
  if (Test-Path -LiteralPath $m305Archive) { throw 'Replacement archive exists' }
  foreach ($m305Path in @($m305Output.source,$m305Output.archive)) {
    git check-ignore --quiet -- $m305Path
    if ($LASTEXITCODE -ne 0) { throw 'Replacement path is not ignored' }
    $m305Tracked = @(git ls-files -- $m305Path)
    if ($LASTEXITCODE -ne 0 -or $m305Tracked.Count) { throw 'Replacement path is tracked' }
  }
  $m305Items = @(Get-ChildItem -LiteralPath $m305Source -Force -Recurse)
  $m305Files = @($m305Items | Where-Object { -not $_.PSIsContainer })
  $m305Dirs = @($m305Items | Where-Object { $_.PSIsContainer })
  $m305ExpectedDirs = if ($m305Output.source -eq 'dist/client') { 1 } else { 0 }
  if ($m305Files.Count -ne $m305Output.files.Count -or $m305Dirs.Count -ne $m305ExpectedDirs) { throw 'Replacement inventory count drift' }
  foreach ($m305Item in $m305Items) {
    $null = Assert-M105OrdinaryPath $m305Item.FullName
    $m305Relative = [IO.Path]::GetRelativePath($m305Source,$m305Item.FullName).Replace('\','/')
    if ($m305Item.PSIsContainer) {
      if ($m305Relative -cne 'assets') { throw 'Unexpected replacement directory' }
    } else {
      if (-not $m305Output.files.ContainsKey($m305Relative)) { throw 'Unexpected replacement file' }
      $m305Expected = $m305Output.files[$m305Relative]
      if ($m305Item.Length -ne $m305Expected[0] -or (Get-FileHash -LiteralPath $m305Item.FullName -Algorithm SHA256).Hash.ToLowerInvariant() -cne $m305Expected[1]) { throw 'Replacement file identity drift' }
    }
  }
}
foreach ($m305Output in $m305ReplacementOutputs.Values) {
  $m305Source = Assert-M105OrdinaryPath ([IO.Path]::GetFullPath((Join-Path $m105Repo $m305Output.source)))
  $m305Archive = [IO.Path]::GetFullPath((Join-Path $m105Repo $m305Output.archive))
  $null = Assert-M105OrdinaryPath $m305Archive -AllowMissing
  if (Test-Path -LiteralPath $m305Archive) { throw 'Archive appeared before move' }
  Move-Item -LiteralPath $m305Source -Destination $m305Archive -ErrorAction Stop
  if (Test-Path -LiteralPath $m305Source) { throw 'Source remained after preservation' }
  $null = Assert-M105OrdinaryPath $m305Archive
}
```

### M305-B-MANUAL-RECOVERY-02 — Restricted desktop visibility

The corrected manual helper reached both manual-ready and proposal-ready at `http://127.0.0.1:5173`. Desktop automation's fresh window and app inventories exposed no owned managed Chromium window. The helper ran in the restricted execution desktop. Sending Ctrl+C through its non-PTY exec session ended the caller with exit 1 and no normal harness teardown; it is not clean-close evidence. Fresh elevated read-only CIM and listener checks then returned zero owned helper/browser processes and zero port-5173 listeners, exit 0. No unrelated window or process was operated.

Before another manual session, primary preserves only the five observed entries from the previously empty `temp/m104-ui`: `m104-test-entry.html`, `m104-test-entry.tsx`, `vite-cache`, `playwright_chromiumdev_profile-8tos3o`, and `playwright-artifacts-RfqF4C`. Verify ordinary contained paths, exact top-level names, absent ignored/untracked `temp/m305-manual-hidden-residue`, and record every descendant's relative path/length/hash before moving these exact entries with native Move-Item. Verify identical complete inventory afterward and empty scratch; no recursive deletion or generated replacement. The preserved browser profile is synthetic and remains ignored.

Retry the unchanged reviewed manual caller once outside the restricted desktop, with a retained primary PTY and explicit network-free synthetic boundary. This is a different, evidenced execution-environment correction, not a worker attempt or budget reset. Close the returned owned browser page through desktop automation, then require normal harness teardown and empty scratch. Do not repeat non-PTY Ctrl+C as a clean shutdown claim. All real allowances remain unused.

### M305-B-MANUAL-RECOVERY-03 — Owner observation and qualified closure

The final-source elevated manual session (PTY 21989, managed Chromium window 11141290, Node 6372, browser 38444, started 2026-09-12 04:45:01Z) reached manual-ready and proposal-ready. Desktop inspection failed twice with a window-binding error. The owner was asked to set that preview to 200%, check Generate/proposal text and citations for readability without horizontal scrolling, reset to 100%, and close only that preview. The owner answered: “Passed; reset to 100% and closed”. This satisfies owner-observed native zoom evidence; device-pixel ratio was not independently measured. Fresh process readback contradicted the reported closure, so it is not cleanup evidence.

The primary's PTY interrupt ended with exit 1 and no normal teardown. Subsequent fresh elevated CIM and port inspection found zero owned helper/browser processes and zero port-5173 listeners. Browser-owned profile/artifact leaves had disappeared, leaving exactly three generated entries. Normal in-helper runtime-preservation and teardown assertions did not execute. Before recovery, the primary freezes the following preservation-only caller; protected runtime identity must be independently reconciled before B acceptance. All real allowances remain unused.

```powershell
$ErrorActionPreference = 'Stop'
$taskRoot = (Get-Location).Path
$taskSource = Join-Path $taskRoot 'temp/m104-ui'
$taskArchive = Join-Path $taskRoot 'temp/m305-manual-visible-residue'
function Assert-OrdinaryTree([string]$path) {
  $item = Get-Item -LiteralPath $path -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Reparse point: $path" }
  if ($item.PSIsContainer) { foreach ($child in Get-ChildItem -LiteralPath $path -Force) { Assert-OrdinaryTree $child.FullName } }
}
foreach ($part in @($taskRoot,(Join-Path $taskRoot 'temp'))) { if ((Get-Item -LiteralPath $part -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Reparse ancestor' } }
Assert-OrdinaryTree $taskSource
if (Test-Path -LiteralPath $taskArchive) { throw 'Archive must be absent' }
git check-ignore --quiet -- temp/m305-manual-visible-residue/record
if ($LASTEXITCODE -ne 0) { throw 'Archive is not ignored' }
if (git ls-files -- temp/m305-manual-visible-residue) { throw 'Archive is tracked' }
$taskNames = @('m104-test-entry.html','m104-test-entry.tsx','vite-cache')
if ((@(Get-ChildItem -LiteralPath $taskSource -Force | Select-Object -ExpandProperty Name | Sort-Object) -join '|') -ne (($taskNames | Sort-Object) -join '|')) { throw 'Unexpected scratch inventory' }
function Get-TaskInventory([string]$root) {
  @(Get-ChildItem -LiteralPath $root -Recurse -Force | Sort-Object FullName | ForEach-Object {
    $relative = [IO.Path]::GetRelativePath($root,$_.FullName)
    if ($_.PSIsContainer) { "$relative|directory" } else { "$relative|$($_.Length)|$((Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash)" }
  }) -join "`n"
}
$taskBefore = Get-TaskInventory $taskSource
New-Item -ItemType Directory -Path $taskArchive | Out-Null
foreach ($name in $taskNames) {
  $resolved = (Resolve-Path -LiteralPath (Join-Path $taskSource $name)).Path
  if (-not $resolved.StartsWith($taskSource + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) { throw 'Outside source' }
  Move-Item -LiteralPath $resolved -Destination $taskArchive
}
if ((Get-TaskInventory $taskArchive) -cne $taskBefore) { throw 'Preservation mismatch' }
foreach ($relative in @('temp/m104-ui','temp/m103-scan','temp/m104-setup','temp/m105-integration')) {
  if (@(Get-ChildItem -LiteralPath (Join-Path $taskRoot $relative) -Force).Count) { throw "Scratch nonempty: $relative" }
}
"Preserved identical inventory; entries=$(@($taskBefore -split "`n").Count); four scratch roots empty."
```

### M305-B-ACCEPT-01 — Accepted implementation and interface checkpoint

Primary accepts B after inspecting the final diff, evidence and fresh critical re-review PASS with no remaining findings. The sole Major B-1 announcement defect was corrected in the final permitted Green turn; no further B worker Red/Green or review-correction allowance remains. Cohesion is RETAINED: App coordinates identity/lifetime, FindingGeneration owns action/status/announcement, ProposalDetail owns original proposal presentation, and existing evidence/guidance owners remain reused. The final Green contract/receipt and 132-file source/test fingerprint are M305-B-GREEN-03.

Final-source verification passes all 25 authoritative suite files, independent strict TypeScript, native-loader production build and a separate complete eight-group capture run with normal automatic harness teardown. Primary inspected all eight desktop/narrow synthetic captures. Owner-observed native 200% passed with the explicit limits in M305-B-MANUAL-RECOVERY-03. Fresh critical review independently passed strict and 34 announcement/classification probes, verified 135 protected files and the final lease identity, reviewed captures/assertions, and accepted qualified recovery. No new provider call occurred.

Recovery preserved all 15 entries under the exact ordinary ignored archive with identical path/type/length/hash inventory; four scratch roots are empty and owned process/listener counts are zero. The complete protected runtime independently matches its historical 332-entry canonical digest E3FCE03453B560FCB9F45FC9325DC086F71579DFF21FA906142D2EFE4F1D2D28, with marker time 2026-09-01T19:46:51.6545663Z and unchanged Chrome SHA-256 409805a16d6416087e6b2f778df1cf8f7bbb267d6b99f6b5bb0a618eace234f2. This independent reconciliation does not claim normal manual-helper teardown.

The final build contains index.html (414 bytes, SHA-256 a5a6b861ff370afd981d9549fd86b1f546532eacf4dbb41d2a86926e043155c2), assets/index-BnlfZKko.js (273980 bytes, 5ff2df95d5e02cd66ccce4f88f00c51c8c8273c7953fec7b5cdaa38341fdb7d2) and assets/index-CuLtGKH2.css (5875 bytes, 48ce995b24643453d9765c9530000d988080c5204aa9a945c583607ce634e86e). Fresh readback matches all 132 source/test files and thirteen frozen references. I1–I8 and applicable I10 pass for the A/B checkpoint; I9 and final integrated/documentation closure remain pending.

### M305-C-PROCEDURE-01 — Frozen finite real verification

Primary freezes this complete procedure after B acceptance and before real effects. M305-C-PERMISSION-01 supplies exactly two scans of `https://docs.ollama.com/capabilities/embeddings`, one per immutable mode, at most one retrieval per run including existing lazy corpus preparation, and at most one gated explicit Generate per provider. Every allowance remains unused at freeze. No alternate target, model acquisition, retries, seeded eligibility, provider test call or broader task is authorized.

**Identity and configuration:** Base HEAD is `6b6644ba65b6ccdfd7d7a86d95f9ce87a95e8c86`; dirty source/test fingerprint is `2527532c2f641dff3419c32909b390f731d4760c1237690bce6159a5f3844ef8`. Bind the final three-file build from M305-B-ACCEPT-01, original manifest SHA-256 `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b` and thirteen unchanged references, plus the accepted forward Groq amendment. The base revision does not claim the dirty changes are committed. Fixed `.env` is present, ignored and untracked; no credential content or hash is read. Initial `data/runs` has zero child directories. Managed scanner/browser runtime retains its accepted 332-entry digest and Chromium 151.0.7922.34.

Before scanning, perform only bounded 20-second metadata requests to fixed loopback Ollama `http://127.0.0.1:11434/api/version`, `/api/tags`, `/api/ps` (GET) and `/api/show` (POST with exactly model qwen3.5:4b), redirects/proxy disabled. Validate the combined metadata using existing `validateOllamaGenerationMetadata`; retain only selected version/digest/quantization and validation result. No chat, embedding, warmup or model-load request occurs here. Expected runtime 0.33.3, digest `2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd`, Q4_K_M, effective context 32768, output 4096, keep_alive 5m, automatic num_gpu=-1; the unchanged adapter owns full attempt-time enforcement. A post-Local /api/ps observation may record loaded context/VRAM if present but cannot establish capacity. Official [Groq models](https://console.groq.com/docs/models), [deprecations](https://console.groq.com/docs/deprecations) and [structured outputs](https://console.groq.com/docs/structured-outputs) were checked 2026-09-12: selected openai/gpt-oss-20b is listed production/strict-supported with no identified deprecation. This does not prove account access. Fixed Groq request admission remains 65536 serialized bytes, not hosted token-fit/complete-consumption proof.

**Service caller and environment:** In a fresh primary-owned elevated PowerShell PTY, load the maintained README's first preparation fence with ScriptBlock.Create and dot-source it unchanged. Require capture flag absent, all four scratch roots empty, no application service and the final build inventory unchanged. Run the README's complete “Run the local service” PowerShell block unchanged: temporary `A11Y_PORT=0`, current verified HEAD in `A11Y_APPLICATION_REVISION`, `Invoke-M105Command { & $m105Node src/server/main.ts; ... }` with scanner scratch, exact NullString restoration and readback in finally. Elevation precedes scanning because the previously established restricted-desktop public-network failure cannot justify retrying a consumed scan. Retain full primary session metadata and observed service-ready URL. Start itself makes no provider call.

**Browser and each provider:** Open only an owned visible in-app CUA tab at that observed loopback URL. Inspect current DOM/control documentation, choose exact target and Local, then Analyze once. Observe result and uniquely new canonical run; validate with existing validateRun and confirm target, immutable provider, application revision, timestamps and displayed counts. Preserve it. In scan order, assess each native violation read-only with assessFindingEvidence and select the first complete one using its observed UI group/ordinal. No complete Finding stops that provider with zero retrieval/Generate. Otherwise select it and activate Get guidance once; ambiguity consumes retrieval. Require actual supported completed retrieval and this same live service owner before Generate. Abstention, failure or ownership uncertainty stops that provider without a second selection/retrieval or substitution. For the separate Groq run, use a new ordinary service instance only after normal stop/exit/port closure of the previous one; repeat its own single scan and at most one selected retrieval. Never clone or relabel eligibility.

Only after authentic support and same-owner eligibility, activate Generate exactly once through the product UI. Ambiguity consumes activation. Observe bounded success/failure and validate canonical readback, invocation/configuration and original pending proposal; compare displayed original fields with durable data. A pre-call stop is not an attempted call, and attempted failure is not successful proposal proof.

**Readback/evidence:** Primary read-only scripts may import existing validators and hash ordinary canonical run files; they may not call service/provider methods or manufacture inputs. For preservation use sorted-object-key/ordered-array canonical JSON: normalize only the selected state to unprocessed and omit its analysis/retrieval/generation/result during retrieval comparison; during generation normalize selected state to active and omit only generation/result. Compare whole-run normalized hashes, selected identity, scan/provider and all siblings. In-memory snapshots may retain actual data for comparison; output only minimal IDs, hashes, timestamps, statuses, counts and provenance. Canonical run.json remains the sole actual result. If needed, exclusively create only absent ordinary contained ignored/untracked `temp/m305-live-proof/record.json`, with safe summary data; retain it. No real image or raw provider/target payload is copied to tracked documents.

**Stop and recovery:** Close only the owned CUA tab. Send literal `stop\r` through the primary service PTY (not Ctrl+C); require service-stopped, exit 0, environment restoration, own loopback port closed, four scratch roots empty and unchanged protected runtime inventory. Failure or ambiguous stop prevents restart; preserve resources for exact identity-based triage rather than blanket termination. Preserve all real runs, Ollama, models, dependency runtime and prior proof/residue archives. Failed proof is retained as failed, allowances never reset. Finish documentation and a different fresh integrated critical review regardless of C success. Without both real eligible successful paths, leave M3-05 In progress/unarchived, M3-03/C independently Blocked, and no M4 task selected.

### M305-C-PREREQUISITE-01 — Runtime unavailable before preparation

The first frozen metadata caller failed on GET http://127.0.0.1:11434/api/version with ECONNREFUSED; tags/show/ps were not reached. Node 24.20.0 ran through the maintained nonbrowser wrapper and returned exit 1 with environment restoration. No service/browser, scan, retrieval, embedding or Generate was started, and no real run was created. Both modes require this developer-managed runtime for actual retrieval. Primary requested that the owner start the existing Ollama runtime and continued unaffected integrated review/documentation. All finite allowances remain unused. A ready confirmation permits the same read-only prerequisite check; it does not renew any effect allowance.

### M305-PAUSE-01 — Safe owner-requested handoff

The owner requested continuation tomorrow and a stop when safe. C is paused before preparation: both scans, both selected retrieval allowances and both Generate allowances remain unused. No application service or owned browser is running; no actual run exists. The first metadata probe found Ollama unavailable, and the pending runtime-start request is superseded by this pause. No automatic follow-up, scheduled task or background evaluation is created.

A/B remain accepted, with no active lease or remaining B write correction. Preserve the final build, eight synthetic captures, historical build/proof archives and all exact residue archives. Scratch roots are empty and protected runtime identity is reconciled. The different integrated reviewer was interrupted for the owner-requested stop before a final verdict. Its interim inspection reported no code finding, but this is REVIEW INCOMPLETE, not PASS; resume its remaining review before final acceptance. No background agent work remains. M3-05 remains In progress and unarchived; C and M3-03 capacity are not complete.

Resumption requires fresh Git/lease/source/build and external runtime state checks against M305-B-ACCEPT-01 and M305-C-PROCEDURE-01. Existing accepted tests/reviews may be reused only under complete evidence identity. Resolve any final-review finding within its applicable original authority/budget; no B allowance resets. When the existing developer-managed Ollama endpoint is ready, repeat the safe metadata gate and then execute only the two authorized per-provider preparations and genuinely eligible generation activations.

### M305-DOCUMENTATION-01 — Safe-pause documentation validation

Documentation impact: Updated the public README's implemented capability, generation API, proposal inspection and exact 25-suite caller; reconciled UI presentation guidance, roadmap/current plan navigation, this living plan and the concise progress record. Requirements, ADRs, executable configuration, corpus and frozen evaluation artifacts are unchanged. No commit, publication or push occurred.

Primary validation passes strict UTF-8/no BOM, final newline and trailing-whitespace checks for all eight changed Markdown documents; 521 local file/anchor links resolve, all 18 maintained PowerShell fences parse, the README suite inventory matches all 25 actual test files, and git diff --check passes. Current source/build and thirteen frozen-reference identities remain M305-B-ACCEPT-01. Fresh elevated safe-state readback confirms zero owned service/manual/browser processes, zero preview listeners, zero actual runs, no active lease and four empty scratch roots. Final integrated-review disposition is separate; this documentation checkpoint cannot complete I9 or archive the task.

### M305-RESUME-01 — Unchanged checkpoint and repeated prerequisite stop

The owner explicitly resumed execution. Fresh readback confirms the same HEAD, all 132 source/test bytes, exact three-file build, manifest and thirteen references, historical 332-entry browser-runtime digest, unchanged marker timestamp, empty four scratch roots, zero actual runs and no active lease. The fixed secret file remains present, ignored and untracked without reading or hashing its contents. Accepted A/B evidence remains applicable; no implementation correction budget resets.

The same bounded metadata check again failed on the initial /api/version request with ECONNREFUSED at 127.0.0.1:11434. No subsequent metadata, application service, scan, retrieval, embedding or generation operation occurred. All live allowances remain unused. The primary requested the developer-managed runtime and resumed the same interrupted read-only integrated reviewer.

Integrated review Minor M305-IR-01 identified the roadmap opening's stale claim that user-facing generation was unverified. Primary corrected that summary and its stale G/A checkpoint mirror to the accepted A/B interface evidence, retaining the separate actual-provider and Qwen-capacity limits. This is a documentation-only correction; no B write allowance is consumed or renewed.

### M305-C-RUNTIME-01 — Authorized retained-runtime startup

The owner explicitly asked the primary to start Ollama. This authorizes one launch of the installed retained runtime with the existing model store; no pull, replacement, upgrade or generation follows from startup. PATH discovery found no Ollama command. The exact previously accepted executable exists at C:/Users/mmjos/Tools/Ollama/v0.33.3/ollama.exe, 36912520 bytes, with unchanged SHA-256 E4FE6BD835FE146659F5C969DCCAFF2E25A9DE63D90EE204CA5D11B9034B0CA5. The existing store is C:/Users/mmjos/Models/Ollama. Before effects, primary freezes the following native hidden launch, ordinary ancestor/executable checks, unused-process/port precondition and exact process-environment restoration. Normal Ollama device discovery and developer-owned runtime state are permitted; the launched server is retained for the developer after application cleanup. Record its returned PID/start time and verify that the 11434 listener belongs to that process before the frozen metadata check. No broad termination or adoption of another server is permitted.

```powershell
$ErrorActionPreference='Stop'
$m305Exe='C:\Users\mmjos\Tools\Ollama\v0.33.3\ollama.exe'
$m305Store='C:\Users\mmjos\Models\Ollama'
foreach($m305Leaf in @($m305Exe,$m305Store)){
 $m305Current=$m305Leaf
 while($m305Current){
  $m305Item=Get-Item -LiteralPath $m305Current -Force
  if($m305Item.Attributes -band [IO.FileAttributes]::ReparsePoint){throw 'Nonordinary runtime/store ancestor'}
  $m305Parent=[IO.Directory]::GetParent($m305Current)
  if($null -eq $m305Parent){break}
  $m305Current=$m305Parent.FullName
 }
}
if((Get-FileHash -LiteralPath $m305Exe).Hash -cne 'E4FE6BD835FE146659F5C969DCCAFF2E25A9DE63D90EE204CA5D11B9034B0CA5'){throw 'Runtime executable drift'}
if(@(Get-CimInstance Win32_Process | Where-Object Name -eq 'ollama.exe').Count){throw 'Existing Ollama process; do not start another'}
if(@(Get-NetTCPConnection -State Listen | Where-Object LocalPort -eq 11434).Count){throw 'Port occupied'}
if(@(Get-ChildItem Env: | Where-Object Name -Like 'OLLAMA*').Count){throw 'Unexpected inherited Ollama settings'}
$m305Settings=@{OLLAMA_HOST='127.0.0.1:11434';OLLAMA_MODELS=$m305Store;OLLAMA_NO_CLOUD='1';OLLAMA_NOPRUNE='1';OLLAMA_DEBUG_LOG_REQUESTS='0'}
$m305Prior=@{}
foreach($m305Name in $m305Settings.Keys){$m305Prior[$m305Name]=[Environment]::GetEnvironmentVariable($m305Name,'Process')}
try {
 foreach($m305Name in $m305Settings.Keys){[Environment]::SetEnvironmentVariable($m305Name,$m305Settings[$m305Name],'Process')}
 $m305Server=Start-Process -FilePath $m305Exe -ArgumentList 'serve' -WorkingDirectory 'C:\Users\mmjos\Tools\Ollama\v0.33.3' -WindowStyle Hidden -PassThru
 [pscustomobject]@{Id=$m305Server.Id;StartTimeUtc=$m305Server.StartTime.ToUniversalTime().ToString('o');Executable=$m305Exe;Ownership='Developer-retained runtime'} | ConvertTo-Json
} finally {
 foreach($m305Name in $m305Settings.Keys){
  $m305Restore=if($null -eq $m305Prior[$m305Name]){[System.Management.Automation.Language.NullString]::Value}else{$m305Prior[$m305Name]}
  [Environment]::SetEnvironmentVariable($m305Name,$m305Restore,'Process')
 }
 foreach($m305Name in $m305Settings.Keys){if([Environment]::GetEnvironmentVariable($m305Name,'Process') -cne $m305Prior[$m305Name]){throw 'Runtime launch environment restoration failed'}}
}
```

### M305-FINAL-REVIEW-01 — Integrated checkpoint review

The different fresh critical reviewer completed its interrupted integrated audit and returned PASS for the A/B checkpoint. No Blocker or Major was found; sole Minor M305-IR-01 was corrected and independently rechecked. I1–I8 and applicable I10 pass. Independent strict TypeScript and all eight generation-admission groups passed; 135 protected source/test/corpus/evaluation paths match final Green, and all nine M305 lease summaries are compliant with matching contract references. The reviewer inspected all changed production owners, identity/lifetime/admission/dispatch mechanics, qualified recovery and representative final captures. These unchanged-source checks do not require replay after C's external observations.

The verdict preserves owner-observed native zoom and non-normal manual-helper teardown limits. It initially left I9 Pending while Ollama was unavailable. The same reviewer receives the actual C observations below as a read-only evidence supplement; no new production correction or role budget follows.

### M305-C-OBSERVATION-01 — Two real scans without eligible Findings

The owner-authorized runtime launch succeeded: PID 11180, started 2026-09-12T21:11:49.0530066Z, with the exact retained executable and model store in M305-C-RUNTIME-01. Fresh process/listener identity bound it to 127.0.0.1:11434. The bounded version/tags/show/ps check passed the existing metadata validator: Ollama 0.33.3, exact Qwen digest 2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd, Q4_K_M, and no loaded model at that observation. This resolves the earlier runtime stop without acquisition, warmup or generation.

Primary executed M305-C-PROCEDURE-01 through the real built UI in two owned in-app browser tabs and separate elevated service instances. Local used port 55483 / primary PTY 46720; Groq used port 56419 / PTY 18580. Each mode was selected explicitly before its sole Analyze activation. Both actual canonical aggregates validate completed with the approved target and base application revision, exact immutable provider context, managed Chromium 151.0.7922.34, axe-core 4.13.0, the three frozen rules, fresh 1280x720 context and closed scanner cleanup.

Both UI and canonical readback report zero automated Findings and twenty color-contrast scanner-review observations. Therefore there is no first evidence-complete native violation to select. Each provider stops at the specified gate, with zero retrieval activations, zero corpus/query embeddings and zero Generate activations. Manual-review observations do not become Findings. No actual provider availability, generation quality, output validation or capacity is proved by these scans.

The two ordinary retained canonical records are:

| Mode | Run identity | Created / finished UTC | Bytes / SHA-256 |
| --- | --- | --- | --- |
| Local | run-38787fa1-d5ac-4294-b672-0bde148769a1 | 2026-09-12T21:13:14.811Z / 21:13:17.147Z | 28486 / e38f23cdbdbf4c80b9679b2b7af6a75d5b69db040436e3829f69683baf62e6cb |
| Groq | run-5a79050e-bf00-4699-afbb-daea6bd3fa3b | 2026-09-12T21:14:47.528Z / 21:14:49.453Z | 28491 / 4e0b0ac166d7b36d02b22f9f2fe99d673e2957621b92acc799be724d7f5e317a |

No workflow update occurred, so there is no retrieval/generation before-after preservation claim to make. Both records remain in the ignored data/runs tree. The exclusively created minimal ignored temp/m305-live-proof/record.json is SHA-256 80a64de9da09dda09b788cdefe726236f9c1bd6d8afdecaa096599c60c5ce92f; it contains only bounded identity/count/status/provenance summaries, not copied native evidence or provider payloads.

Both owned tabs closed. Literal stop followed by Enter produced service-stopped and exit 0 in each primary PTY, including the maintained caller's environment restoration and scanner-scratch check. Independent TCP checks confirmed both application ports closed; all four scratch roots are empty and the complete 332-entry browser-runtime identity remains unchanged. The developer-requested Ollama process remains running for the developer; it is not application residue. Preserve all canonical runs, runtime/models and earlier proof/recovery archives.

Both scan allowances are consumed. The at-most-one retrieval and Generate grants per provider remain unused but unusable on these runs because eligibility is absent. I9 is unfulfilled and M3-05 remains In progress/unarchived. Another target, scan or broader eligibility search needs explicit new finite preparation authority; no automatic retry, substitution, task completion, M3-03 capacity credit, M6-02 credit or M4 activation follows.

### M305-FINAL-01 — Accepted checkpoint and unfulfilled real proof

The same different integrated critical reviewer completed the C evidence supplement and returned PASS for the integrated checkpoint and honest C disposition, with no remaining Blocker/Major/Minor. It independently validated both canonical aggregates, exact hashes/sizes/modes/target/revision/timestamps/browser/scanner identity, exclusive ordinary run records, minimal evidence record and empty scratch. Zero activations and service/port closure rely on primary-observed actions and terminal readback; no provider success is inferred. Primary accepts this supplement and I1–I8/applicable I10, while I9 remains unfulfilled.

Final elevated process/listener readback confirms zero application-service or managed-browser processes, both application ports closed, no active lease and the exact developer-retained Ollama PID 11180 still listening only at 127.0.0.1:11434. No unrelated process, model, run or retained archive was removed. All 25 authoritative suite files, independent strict TypeScript, build and synthetic visual evidence remain applicable under unchanged source/test/build identity; external C observations added no code change requiring repeated regression.

Documentation impact: Updated README capabilities/API/commands, UI presentation guidance, roadmap status, plan navigation, this living plan and the concise progress record. No requirement, ADR, dependency, executable configuration or frozen input changed. Final validation passes all eight changed Markdown documents for strict UTF-8/no BOM/final newline/trailing whitespace, local file/anchor resolution, nineteen maintained PowerShell fences, unchanged exact 25-suite inventory and git diff --check. Requirements/status/commands/navigation distinguish the verified interface from missing real provider success. M3-05 remains In progress and unarchived; no commit, publication, push or M4 activation occurred. Further real preparation requires new finite owner authority, not a reset of the two consumed scans.

### M305-C-PERMISSION-02 — New finite preparation on the selected walkthrough

The owner selected https://almarsguides.com/retro/walkthroughs/PS1/Games/ParasiteEve/FullPlaythrough/Day5/ and explicitly answered yes to two new scans, one per mode, and at most one retrieval per run including embedding preparation. This is a new finite preparation grant, not a reset or deletion of the two earlier consumed scans. The original at-most-one Generate activation per provider remains unused and is carried forward only for genuinely eligible same-owner continuation. No extra Generate allowance, target search, scan/retrieval retry, model acquisition, fallback, protected-input change, implementation-budget reset or later task is authorized.

Before effects, primary binds M305-C-PROCEDURE-01 unchanged except: use this exact target for the new Local and Groq runs; preserve the two existing canonical runs and original temp/m305-live-proof; use the previously absent ordinary ignored/untracked temp/m305-live-proof-02/record.json for exclusive minimal evidence if needed. Fresh metadata passes pinned Ollama/Qwen validation with no loaded models; the 332-entry managed-browser runtime digest and four empty scratch roots match. Recheck source/test/build/frozen identity and baseline run names before starting the maintained service caller. The same first-complete-native-Finding selection, one actual retrieval, authentic support/live-owner gate, no-ambiguity retry, selected-only preservation and normal owned cleanup remain binding. Any unavailable proof stops only that provider and preserves the actual result. The same integrated reviewer will assess the new evidence without reopening unchanged implementation.

### M305-C-OBSERVATION-02 — Second target without eligible Findings

Primary executed the owner's new M305-C-PERMISSION-02 grant using the unchanged procedure, source/test/build/frozen input identities and pinned runtime metadata. Each new run came from its own real UI Analyze activation and separate service instance against the exact approved walkthrough URL. Local used port 63362 / PTY 24588; Groq used port 60294 / PTY 74040. Both completed canonical records validate with their own immutable provider mode, base application revision, managed Chromium 151.0.7922.34, axe-core 4.13.0 and closed scanner cleanup.

Each UI and durable readback reports zero automated Findings and one color-contrast manual-review observation. No first complete native Finding exists, so the prescribed eligibility gate stops both paths before selection, retrieval, embedding preparation or Generate. This is a bounded observed scan result, not a claim that the page is accessible or that either generation provider works. No before-after workflow preservation claim is applicable because no workflow update occurred.

| Mode | Retained run | Created / finished UTC | Bytes / SHA-256 |
| --- | --- | --- | --- |
| Local | run-041dc425-d1a4-48a3-9b08-7e392329857f | 2026-09-12T21:54:08.884Z / 21:54:11.425Z | 3062 / 4e3a092619c6c02555fa5cd1f978017a576c877e8295d2b66019d7a959da0dc9 |
| Groq | run-638e4cc3-0c41-4097-ac8b-78229fd2ee50 | 2026-09-12T21:56:03.980Z / 21:56:06.170Z | 3067 / 5eff449d6c2062f1f9906ac42f6a9cffdcbe0609d7c3797c0a122c2ed3bb14cb |

The exclusively created ordinary ignored/untracked temp/m305-live-proof-02/record.json has SHA-256 66673c9aefa7b82ef8171e779841b59c0e8fc6010fb8a3370b8c13db47b07382. It retains only minimal counts/status/identity and allowance/cleanup summaries. The first preparation's runs and proof remain preserved separately.

Both owned tabs closed. Each literal stop produced service-stopped and terminal exit 0 through the maintained environment-restoring caller. Independent TCP checks confirmed both new application ports closed; all four scratch roots are empty and the complete 332-entry browser-runtime digest is unchanged. Ollama remains developer-retained. No code, test, model, dependency or frozen artifact was changed.

This grant's two scans are consumed: four total across the two distinct grants. No retrieval, embeddings or Generate occurred in either preparation. Original generation activations remain unused, but none of these runs is eligible. The same integrated reviewer receives this bounded evidence supplement. I9 and task completion remain unfulfilled; no retry, new target or additional scan follows without new finite owner authority.

### M305-FINAL-02 — Accepted second evidence supplement

The same independent integrated critical reviewer returned PASS for the second C evidence supplement, with no Blocker/Major/Minor. It independently validated both new canonical records, exact hashes, target/modes/revision/scanner identity and zero-Finding/one-review results; it also proved both earlier run hashes and the original proof-record hash unchanged. All four runs and both evidence records are ordinary, ignored and untracked, and four scratch roots are empty. Service/port closure and zero activations retain their primary-observation evidence class. I9 remains unfulfilled; this verdict does not qualify real generation or capacity.

Documentation impact: Reconciled the owning plan, roadmap and concise progress record for the new finite authorization, retained evidence, all four consumed scans, no retrieval/embedding/Generate and unchanged completion limits. The other accepted capability/command/UI documentation remains applicable. Final validation passes all eight changed Markdown documents, 528 local links/anchors, nineteen PowerShell fences and git diff --check. Source/test/build identity remains unchanged, so accepted complete regression, strict/build and visual evidence are reused without another test execution. No commit, publication, push, archive or later-task activation occurred.

### M305-C-PERMISSION-03 — Bounded public-demo discovery and preparation

The owner explicitly authorized identifying one public accessibility demo with intentional errors, two scans (one per mode) and at most one retrieval per run including embedding preparation. Primary made one focused read-only lookup of [W3C's Inaccessible Home Page](https://www.w3.org/WAI/demos/bad/before/home.html), which identifies itself as the inaccessible side of the Before and After Demonstration. Bind that exact HTTPS URL for this new finite preparation. The page's stated purpose supports target selection only; it does not establish actual scanner findings or supported retrieval.

M305-C-PROCEDURE-01 remains binding with only the new target, the four preserved baseline run directories and the absent exclusive ordinary ignored/untracked temp/m305-live-proof-03/record.json evidence location substituted. No earlier run/proof is overwritten. The two new scans and at-most-one selected retrieval per run are separate from the four consumed scans under earlier grants. Both original Generate activations remain unused and may occur only after each new run's own supported retrieval and exact live-owner gate. No alternate page, second candidate, retry, extra Generate, model acquisition, corpus change, source correction budget or later task is authorized. Refresh the same source/test/build/frozen/runtime identities and metadata; use the maintained service caller, own in-app tabs, first complete native Finding, canonical readback and normal owned cleanup. The same integrated reviewer receives the new bounded observations.

### M305-C-OBSERVATION-03 — Authentic retrieval abstention

Primary executed M305-C-PERMISSION-03 against the exact W3C demo through separate real UI/service sessions: Local port 59568 / PTY 76561 and Groq port 63520 / PTY 24191. Each completed scan produced 35 automated Findings and two manual-review observations using unchanged source/test/build/frozen identities, Chromium 151.0.7922.34 and axe-core 4.13.0. Both canonical records validate and scanner cleanup is closed.

The first complete native Finding in scan order was color-contrast ordinal 1 in each run. Each received exactly one Get guidance activation through its actual UI and existing lazy local corpus/query embedding path. Evidence assessment completed with no blockers, but each authentic retrieval completed with incomplete support, missingRoles criterion and no conflicts. Both selected Findings durably abstained; the UI announced no proposal and no generation provider called. No Generate activation, provider generation, second retrieval, alternate Finding or retry occurred. This establishes correct no-call abstention, not successful generation or a confirmed retrieval defect.

| Mode | Retained run / selected Finding | Final bytes / SHA-256 |
| --- | --- | --- |
| Local | run-df8dd021-2ec3-4f00-acbd-6352183e027d / 22b0d1e9-38d4-4a28-adad-d21adbf1725f | 43029 / 1b7ea8f692f5d84b1b2c8f1029730bae69a99c8e831771de97e2e79caa5815d8 |
| Groq | run-60be394d-2bb7-4826-a67e-d252479f82a0 / f6d41aa7-2de7-4494-887f-709552e0e895 | 43034 / c90916a0938e4ebab3efa875fa174f8c1147eee878d33e07f079405c563cee4c |

Local scan created/finished 2026-09-12T22:06:45.034Z / 22:06:46.554Z; retrieval ran 22:07:28.298Z–22:07:34.623Z. Groq scan created/finished 22:12:17.915Z / 22:12:19.324Z; retrieval ran 22:12:41.739Z–22:12:45.370Z. Whole-run canonical preservation hashes before and after retrieval match after only the permitted selected workflow normalization: Local c1ebd08d8d78738dc0550fbd8d3b6f2141f4a4c015d368839b39924135273ac1; Groq 0f8734d81578893eac7b9236511985797ad42f635a48798add6c83bfde6596f8. No generation normalization proof is applicable because no generation occurred.

Bounded read-only interpretation confirms both actual top-three results contain one remediation passage and two interpretation passages. Existing [ranking](../../../src/server/retrieval/retrieval-ranking.ts) sorts by similarity and retains three; [support classification](../../../src/server/retrieval/support-policy.ts) independently requires every configured guidance role. Thus the observed incomplete-guidance abstention is consistent with current behavior; it does not mean the whole corpus lacks a criterion source. Changing ranking, corpus or the required-role gate lies outside this finite verification. The [bug index](../../bugs/README.md) was consulted; no new confirmed implementation defect is established by these observations.

The exclusively created ordinary ignored/untracked temp/m305-live-proof-03/record.json has SHA-256 2c4260e0bbdb5b184426ede1145233631d370c2c22437f4f961d5ae4146f0625. It contains minimal identity/status/support/preservation facts without raw page, guidance or provider payloads. Earlier runs and proof archives remain separately preserved. Both owned tabs closed; literal stop returned service-stopped and exit 0 through the environment-restoring caller, both ports refused TCP connections, all four scratch roots are empty and the 332-entry managed-browser runtime digest is unchanged. Ollama remains developer-retained.

Six scans are consumed across three grants, and this grant's two selected retrieval allowances are consumed. Both original Generate allowances remain unused, with authentic support absent. I9 remains unfulfilled. Further target discovery, scans or retrieval changes are not authorized by this exhausted finite preparation. The same integrated reviewer will inspect the new evidence without reopening unchanged implementation.

### M305-FINAL-03 — Accepted third evidence supplement

The same independent integrated critical reviewer returned PASS for the third C evidence supplement, with no Blocker/Major/Minor. It independently validated all six run hashes and three proof hashes, both new aggregates and their first-complete native Finding selections, authentic passage identities/support and providerCalled false abstention with no generation records. Each final normalized preservation hash matches its recorded pre-retrieval hash; all 34 sibling Findings per run retain unprocessed native state. The pre-retrieval snapshots, UI activation counts and process/port closure remain primary observations, not independently witnessed originals. Exact embedding call count was not measured.

The reviewer also verified ordinary ignored/untracked third evidence, four empty scratch roots, unchanged 132-file source/test fingerprint, exact final build and thirteen frozen references. Primary rechecked those identities and observed no owned application/manual process, both new ports refused and the exact developer-retained Ollama process still running. Prior complete regression, independent strict TypeScript, build and visual evidence remain applicable without a redundant rerun. I9 remains unfulfilled; this PASS does not establish generation success, capacity, corpus omission or a retrieval defect.

Documentation impact: Reconciled this plan, roadmap and concise progress record for the third finite grant, actual retrieval abstention, preservation, review and remaining scope decision. Existing accepted capability/command/UI documentation remains applicable. Final closure validation passes all eight changed Markdown documents, local file/anchor resolution, nineteen maintained PowerShell fences, the exact 25-suite inventory and git diff --check. No requirement, ADR, executable configuration, frozen input or source/test change occurred in this preparation. M3-05 remains In progress/unarchived; no commit, publication, push or later-task activation occurred.

### M305-D-01 — Approved selection implementation packet

**Owner decision:** After M305-R-REVIEW-01 passed, the owner explicitly approved the concrete combined grant in M305-R-PROPOSAL-01. The amendment is Accepted, not implementation evidence. It authorizes authority reconciliation, the new retrieval implementation assignment, three actual controlled retrieval observations (G1/G2/G3 once each), and exactly two fresh scans of https://www.w3.org/WAI/demos/bad/before/home.html, one Local and one Groq. Each public run permits at most one first-complete-Finding retrieval with existing lazy embedding preparation, then the original unused at-most-one eligible Generate per provider. Preserve every earlier run and all exhausted A/B budgets. No old run replay, new model, acquisition, target search, retry, fallback or M6 generation execution is authorized.

**Execution decomposition:** This one approved amendment has a standard backend/proof-helper part D and a small dependent visual explanation part E. Separate roles follow the existing mixed-work routing; this does not expand the approved behavior or live-operation budget. D owns complete ranking, selection and durable provenance. E only passes that existing provenance to the guidance paragraph. Neither changes lifecycle, provider admission or generation input cardinality. E's visual capsule is frozen before its preflight.

Milestone Assignment Packet v2

Identity
- Workflow ID: M3-05-20260912-01
- Roadmap task ID: M3-05
- Work-slice ID: M305-D
- Assignment ID: M305-D-preflight-01
- Lease ID: None for preflight
- Phase: preflight
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: d_tests
- Guard contract digest: None for preflight

Work-slice capsule
- Owning ExecPlan: this plan, M305-D-01.
- Observable acceptance contract: Score the complete rule/SC-filtered catalog once, exact cosine descending then passage-ID ascending. Select the first passage for each required criterion/interpretation/remediation role, at most three, preserving original score order and scores. New production results emit selectionPolicy: 'highest-per-required-role-v1'. Existing strict descriptor readers accept only this optional finite literal; absent means historical global-three and remains absent on normalized read. Explicit undefined/null/unknown policy, duplicate roles in a marked result, malformed/extra fields, bad canonical identities and scores are rejected. Historical unmarked duplicate-role records remain valid and unmodified. Zero/missing/conflict/error boundaries, evidence sufficiency and exactly-three generation input remain unchanged. Prove new provenance survives domain/repository/service/client validation and reaches the existing generation package without weakening admission.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: amended REQ-CORP-007 and REQ-RETR-006 in ../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval; ADR-0019#selection-amendment--2026-09-12; REQ-EVAL-002 through 005 and dated retrieval amendment in evaluation authority; M3-05 Verification, BHV-02/03, SPEC-002 and abstention/retrieval-failure portions of SPEC-003, HS-006 and HS-008. Resolve specification file locations through roadmap authority key.
- Readiness and evaluation-freeze evidence: M3-05 In progress with accepted A/B and Complete M3-04; owner-amended M3-03 start remains applicable. Original M3-01 manifest SHA256 63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b and all thirteen references unchanged; M2-01 gold unchanged. ADR/requirements and roadmap now explicitly accept this amendment. No model output observed and no new live allowance consumed.
- TDD applicability: Applicable; changed observable selection and record admission. Proof-helper bounded root selection uses structural/negative evidence rather than fabricated Red for live retrieval.
- Current-state and preflight evidence IDs: M305-R-REVIEW-01; current ranking ends resolved.slice(0, 3), strict result rejects selectionPolicy. Preflight classification pending.
- Accepted test boundary and current test owner: None until accepted; d_tests owns the exact test/helper paths below.
- Relevant boundaries and paths: retrieval ranking/contract/exact engine, existing run validation/persistence/client admission and generation-input consumer, maintained M204 actual retrieval driver.
- Production responsibility placement and fit: retrieval-ranking.ts owns scoring/selection using existing canonical role metadata; retrieval-contract.ts owns strict old/new policy admission and ordinary exported finite type/constant; exact-retrieval.ts emits the explicit policy. All are extensions of their current responsibilities. No new module needed.
- Dependency, runtime-call, or interface-edge changes: exact engine -> ranking -> existing catalog; engine -> strict result validator -> unchanged run/service/client readers. Optional policy is durable provenance; no additional I/O or request stage. Existing generation-input consumes the same three canonical passages.
- Reuse, justified separation, bounded creation, or local-extraction disposition: EXTEND the three retrieval owners; REUSE_AS_IS corpus, query/embedding identities, support policy, lifecycle, run and generation validators except their existing delegated retrieval validator. EXTEND tests/helpers/m204-retrieval-checkpoint.ts solely with fixed CLI suffix --m305-role-selection selecting fresh temp/m305-retrieval-role-proof while retaining historical default, ordinary-path containment and exclusive creation. No arbitrary output-root API.
- Permitted local structural refactor: Only small private helpers inside the three existing production owners to express policy validation or first-per-role selection. No wrapper, generic abstraction or moves.
- Non-goals: UI in D, any corpus/gold/query/input-fit/model/adapter change, lifecycle change, score threshold, reranker, extra requests, global k expansion, new generation evaluation, changes to historical retained records.
- Named uncertainties: Preflight must identify behavioral coverage gaps and any actual additional test path necessary before writes. Validator does not claim to reconstruct highest-per-role without discarded candidates; ranking tests establish that property.
- Risk tier: S3 for strict persisted provenance across admission/history boundaries.
- Review and escalation triggers: fresh critical slice review and different fresh integrated final review. Any need to weaken integrity, change protected source or expand effects returns to primary.

Write scope
- Allowed files: None for preflight. Planned Red: tests/embedding-retrieval.test.ts; tests/retrieval-contract.test.ts; tests/retrieval-service.test.ts; tests/generation-service.test.ts; tests/helpers/m204-retrieval-checkpoint.ts. Planned Green: src/server/retrieval/retrieval-ranking.ts; src/server/retrieval/retrieval-contract.ts; src/server/retrieval/exact-retrieval.ts.
- Allowed directory roots: None
- Forbidden files: all files outside the current phase's exact allowlist; all accepted tests during Green
- Forbidden directory roots: docs, .codex, .agents, corpus, evaluation; src during Red and tests during Green

Validation
- Working directory: C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab
- Focused command: Preflight source-only, no tests/fixtures/effects. Red/Green load README's first definitions-only PowerShell block unchanged using the existing M305 preparation; serial Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/<suite>.test.ts; if ($LASTEXITCODE -ne 0) { throw '<suite> failed' } } for embedding-retrieval, retrieval-contract, retrieval-service, generation-service. Do not stop before observing the intended behavioral Red; report each suite separately. Helper syntax/CLI-negative checks must not start preparation or actual model calls. Exact negative caller bound after preflight.
- Task-level command: M305's complete 25-suite serial scratch-qualified regression, independent strict TypeScript and build after D/E; new actual callers frozen after source/helper/build settle.
- Expected decisive result and reusable evidence IDs: Meaningful selection/provenance Red then passing unchanged tests; malformed/legacy and no-call boundaries preserved; fresh-root option cannot overwrite earlier proof. No claim of live retrieval from deterministic tests.
- Relevant-tree fingerprint: Fresh guard baseline at each write turn; source/test identity prior to D is 2527532c2f641dff3419c32909b390f731d4760c1237690bce6159a5f3844ef8 over 132 path/SHA256 entries as previously defined.
- Environment fingerprint or Non-reusable: Node 24.20.0, pinned repository dependency tree, README command environment; mutable I/O evidence Non-reusable without isolated receipt.
- Known external side effects and cleanup: Controlled suites only, existing exclusive synthetic leaves and loopback services with normal cleanup; no real runtime/provider requests. No browser or build in D worker commands. Helper effects remain unexecuted until separately frozen primary verification.

Budget and stopping
- Maximum worker turns: one read-only preflight, at most three Red and three Green turns with third conditional under canonical rules.
- Maximum corrections: one ordinary correction per phase; a second only with required demonstrated progress. One review correction loop within remaining phase budget.
- Maximum repeated identical failure: two; then primary triage under canonical stop, never automatic retry.
- Maximum no-diff outcomes: one per phase; primary triage required.
- Validation cadence: focused at Red/Green boundaries; full suite after D/E, no repetition without new changes/failure/stale evidence.
- Stop and escalate when: undeclared path/responsibility, forbidden change, ambiguous guard/effect, exhausted budget or new authority decision. Worker stops return to primary, not automatically to owner.

Handoff
- Report identity/authority, touched paths, exact commands and decisive results, classification/outcome, unexpected state, residual risks, documentation impact and actual cohesion. Workers are not alone in the codebase; preserve other edits and never perform Git writes.

### M305-D-PREFLIGHT-01 — Accepted missing behavior

The read-only test owner returned MISSING, supported by actual global-three slicing, old exact result keys and absent policy emission, not search absence alone. Primary accepts the planned four test files and one helper; E owns the real App admission/UI check. Existing generation-service A/B edits remain protected in-place. The maintained helper remains compatible with Get guidance and Eligible for generation and never activates Generate.

Red attempt 1 is authorized under the D packet after fresh lease start. Assignment M305-D-red-01, role test_worker, owner d_tests, phase red, attempt 1, parent None. The exact five-file allowlist is unchanged. Helper CLI is the existing forms plus only final --m305-role-selection, selecting fixed temp/m305-retrieval-role-proof; historical default remains. Negative validation may run Node --check and invoke the helper with an invalid mode or misplaced/duplicated suffix, requiring nonzero before any root/receipt/service/browser/model effect. Valid prepare/real/controlled invocations remain reserved for primary's separately frozen proof. Focused four-suite runs remain controlled only. Fresh guard digest is supplied in the dispatch packet and terminal receipt accepted before any Green.

### M305-D-RED-01 — Behavioral Red and helper reconciliation

Red 1 closed compliant, contract a287c9f404fd2f3c728490c0a58af8c66f442f7639b16e2cecc71329c7822ba0, receipt 7a08f75a4342eced96cad82dd6a96749b89e2c43623d0c4d72140a13ef1fa0b1. Primary inspected all five changed paths and preserved A/B overlap. The four focused suites produced six intended failures (66 passing): global membership/ties, missing policy, strict marked admission and the consequent service/generation rejection. Downstream generation-package assertions did not execute. No unrelated suite failure occurred.

The helper negative checks failed before parsing: resultPresentation.ts now imports FindingGeneration.tsx, which native Node cannot load. This is a current verification-caller compatibility gap, not evidence about retrieval and not a reopened B implementation budget. Both proof inventories remained unchanged and the fresh root absent. Primary reconciles the existing helper responsibility to include an independent fixed-fixture expected card-label/order projection, removing its production presentation import. Use only existing three rule labels and per-rule ordinals from the accepted UI contract; preserve selected finding-0 identity, first-rendered distinction, gold/seed bytes and actual rendered-card assertions. No production edit, loader/dependency, fixture change or broad test framework is authorized. This small correction remains in the current task record.

Red 2 uses the same five-file scope, role, objective, phase and budget; parent M305-D-red-01. Add one varied-score selection case in which within-role winners differ from the tie case, asserting complete filtered candidates, unchanged scores and descending final order; add marked-result malformed-score/extra-field rejection and zero/partial validity where needed. Preserve the accepted behavioral assertions. Only affected suites repeat; the unchanged service/generation Red evidence remains applicable. Re-run helper syntax and invalid/misplaced/duplicate CLI checks and require the intended Usage rejection before effects. No valid preparation/actual call follows from this correction. Fresh guard digest is supplied in dispatch; Green waits for primary acceptance.

### M305-D-RED-ACCEPT-01 — Accepted test boundary

Red 2 closed compliant, contract c8d30c92bfdcecb01b6399a478b1791744cd8ac1b981ea5a736b244d1cb9aef2, receipt 68ac975f771737a0b480f82d4d787d97769ed0d7eafbfafe86819479d6e20ebe. Primary inspected the changed helper and both affected test diffs. The varied-score result chooses different within-role winners and a criterion below global three. Native helper syntax passes; invalid/misplaced/duplicate CLI forms now reach intended Usage rejection without changing historical proof or creating the fresh root. This resolves the helper caller gap without changing production presentation or seed/gold facts.

Accepted Red is seven intended failures across the four suites, with 66 passing; service/generation failures retain their earlier unchanged evidence, and their downstream assertions await Green. The immutable five-file test/helper SHA256 boundary is embedding B9B05B695C33E8B3A33483A4AF0E260FADD0C493612BA96C2FB22D3ACFB8EF43; retrieval contract D8D0B050B5F00390048DF052BBF75B44DE6ED41D8279483C18603820DC1EFD68; retrieval service 6AADF2F3E1757576BE2CA0796E8202E29A9316BA69679ADB3DAAEB52DB9FEC84; generation service 3E81C8F6F7B16537F1B94694471ED55CE218A64DA4CC682EA625514A9035F4D0; helper 67D18F28332A21771846E63FCF8465B08701E0999CA4B8E8CCDFD92E72CE4A9A.

Green assignment/lease M305-D-green-01 uses phase green, attempt 1, parent None, standard code_worker, owner d_code, and only the three production paths in D's packet. All tests/helpers are forbidden and immutable. Run the same four focused suites through maintained preparation, plus strict TypeScript; no browser/build/model operation. Primary supplies the fresh guard digest, inspects actual diff and strict evidence, then may accept D behavior for E while combined critical review remains pending. Existing D Red budgets remain consumed.

### M305-D-ACCEPT-01 — Accepted backend behavior

Green 1 closed compliant, contract b8df29373b3007217ed725e355e897b351649bf1e495ded768b4554a3539b5dc, receipt e5deb4a448e64dc39f370a1ceadde839a30199f4ff96b9343113e9a42b69109e. Primary inspected the actual three-module diff and accepts RETAINED cohesion: scoring/selection, strict policy admission and producer emission remain with their existing owners. All five accepted test/helper identities are unchanged. The four focused suites pass 29/13/20/11 tests, 73 total; previously blocked generation-package assertions now execute. Worker strict TypeScript and primary independent strict TypeScript pass. No browser/build/model operation occurred.

D behavior is accepted for the dependent E visual portion; combined fresh critical review and complete regression remain pending. Full retrieval uses the validated catalog length (still sixteen) and preserves the fixed three required roles, complete sorting, original scores and old/new record interpretation. Existing source boundaries, frozen inputs and live budgets remain unchanged.

### M305-E-01 — Approved policy explanation packet

Milestone Assignment Packet v2

Identity
- Workflow ID: M3-05-20260912-01
- Roadmap task ID: M3-05
- Work-slice ID: M305-E
- Assignment ID: M305-E-preflight-01
- Lease ID: None for preflight
- Phase: preflight
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: e_tests
- Guard contract digest: None for preflight

Work-slice capsule
- Owning ExecPlan: this plan, M305-E-01, dependent visual portion of the same approved D amendment.
- Observable acceptance contract: For a completed new-policy retrieval with passages, explain “The highest-ranked passage for each required guidance role is shown.” For historical absent policy with passages, explain “Up to three highest-ranked passages are shown.” Keep the existing similarity/support/confidence distinction. No policy explanation when no retrieved passages. Actual App admission carries the canonical policy from Finding through its existing guidance owner; no synthetic UI state can replace the canonical record. Existing inert citations and accessibility remain unchanged.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: D authorities plus REQ-A11Y-001 through 004 and 010; ../ui/ANALYZE_AND_RESULTS_PRESENTATION.md#m2-03-selected-finding-guidance, BHV-02/08, SPEC-002/003, HS-008.
- Readiness and evaluation-freeze evidence: D accepted strict record policy and focused tests before E preflight; same approved scope and unchanged frozen originals. D's three controlled and two public observation budgets remain separate and unconsumed by E.
- TDD applicability: Applicable, visible interpretation of two actual persisted policy forms.
- Current-state and preflight evidence IDs: M305-E-REUSE-01 below; preflight pending after D.
- Accepted test boundary and current test owner: None until accepted; e_tests owns tests/finding-guidance-ui.test.ts.
- Relevant boundaries and paths: FindingGuidance.tsx, GuidancePassages.tsx, existing actual App/harness and citationOutcome fixture.
- Production responsibility placement and fit: FindingGuidance coordinates the selected canonical Finding and held view, passing only its completed retrieval policy. GuidancePassages owns the source passage explanation and renders the relevant one-sentence policy meaning. No new owner or durable/view field.
- Dependency, runtime-call, or interface-edge changes: Existing Finding -> FindingGuidance -> GuidancePassages optional typed selectionPolicy prop. Type-only import from existing retrieval contract is permitted. No provider, state or I/O edge change.
- Reuse, justified separation, bounded creation, or local-extraction disposition: EXTEND exactly the two components above; REUSE_AS_IS App, admission, source links/notices, styles, status/action/proposal owners and harness. No new abstraction.
- Permitted local structural refactor: None
- Non-goals: CSS/layout/control changes, raw policy IDs, extra confidence/support claims, new theme, dependency, animation, preview framework or state machinery.
- Named uncertainties: None; preflight must report if existing harness cannot present both validated record forms within this scope.
- Risk tier: S2 for truthful policy presentation; integrated D provenance remains S3.
- Review and escalation triggers: Independent visual review may be combined with the fresh D critical review after both parts; different integrated final review remains required. Any changed binding field returns to primary.

Frontend-visual capsule
- Implementation profile: frontend-visual
- Frontend-quality skill: .agents/skills/frontend-quality/SKILL.md
- Exact UI/design authority anchors: the Finding guidance extension in docs/ui/ANALYZE_AND_RESULTS_PRESENTATION.md and its accepted 2026-09-12 selection explanation; REQ-A11Y-001 through 004/010.
- Reuse-audit evidence ID: M305-E-REUSE-01; primary read both actual components and current supported/axe browser tests. Their existing responsibilities fit the two-line data flow and paragraph.
- Reuse dispositions: EXTEND src/client/components/results/FindingGuidance.tsx and GuidancePassages.tsx; all other rendered owners REUSE_AS_IS.
- Required state matrix: new marked supported completed retrieval, historical unmarked supported retrieval, existing no-passages/not-retrieved states. Preserve other abstention/pending/failure behavior through existing suite.
- Required viewport and interaction matrix: current marked and legacy at 1280x800 and 320x800; no horizontal overflow, readable source paragraph/citations. Existing keyboard citation activation/return, selection and axe checks remain. Prior owner-observed actual 200% zoom is retained historical evidence; no new zoom claim.
- Browser or visual-evidence target and reproducibility identity: Actual App via existing m104-ui-harness, pinned managed Chromium 151.0.7922.34; exclusive m203-ui-UUID capture roots from existing suite. Bind fresh source/harness identity and inspect new screenshots.
- Prohibited visual scope, dependencies, fields, copy, effects, and motion: No new dependency/style/action/view-schema or animation; only the exact selection explanation, preserving existing confidence distinction and inert citations.

Write scope
- Allowed files: None for preflight. Planned Red: tests/finding-guidance-ui.test.ts. Planned Green: src/client/components/results/FindingGuidance.tsx; src/client/components/results/GuidancePassages.tsx.
- Allowed directory roots: None
- Forbidden files: all files outside the current phase's exact allowlist; all accepted tests during Green
- Forbidden directory roots: docs, .codex, .agents, corpus, evaluation; src during Red and tests during Green

Validation
- Working directory: C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab
- Focused command: Preflight source-only without effects. Red/Green load maintained README definitions unchanged and run Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/finding-guidance-ui.test.ts; if ($LASTEXITCODE -ne 0) { throw 'Guidance UI failed' } } $m105UiTemp. Assert the four established scratch roots empty before/after. Use the known permitted elevated route for managed browser effects; no acquisition.
- Task-level command: M305's complete 25-suite serial scratch-qualified regression, independent strict TypeScript and build after D/E; new actual callers frozen after source/helper/build settle.
- Expected decisive result and reusable evidence IDs: Meaningful missing policy-copy Red, then full suite passes unchanged, zero axe violations and both policy forms readable without horizontal overflow. Existing synthetic screenshots are fresh evidence, never live provider proof.
- Relevant-tree fingerprint: Fresh guard baseline at each write turn; source/test identity prior to D is 2527532c2f641dff3419c32909b390f731d4760c1237690bce6159a5f3844ef8 over 132 path/SHA256 entries as previously defined.
- Environment fingerprint or Non-reusable: Node 24.20.0, pinned repository dependency tree, README command environment; mutable I/O evidence Non-reusable without isolated receipt.
- Known external side effects and cleanup: Only the existing synthetic UI harness, owned Vite/browser/context/loopback and exclusive screenshot leaf. Close through normal harness cleanup, verify scratch empty; retain captures. No real provider, embedding, scan or build in worker commands.

Budget and stopping
- Maximum worker turns: one read-only preflight, at most three Red and three Green turns with third conditional under canonical rules.
- Maximum corrections: one ordinary correction per phase; a second only with required demonstrated progress. One review correction loop within remaining phase budget.
- Maximum repeated identical failure: two; then primary triage under canonical stop, never automatic retry.
- Maximum no-diff outcomes: one per phase; primary triage required.
- Validation cadence: focused at Red/Green boundaries; full suite after D/E, no repetition without new changes/failure/stale evidence.
- Stop and escalate when: undeclared path/responsibility, forbidden change, ambiguous guard/effect, exhausted budget or new authority decision. Worker stops return to primary, not automatically to owner.

Handoff
- Report identity/authority, touched paths, exact commands and decisive results, classification/outcome, unexpected state, residual risks, documentation impact and actual cohesion. Workers are not alone in the codebase; preserve other edits and never perform Git writes.

### M305-E-PREFLIGHT-01 — Accepted missing policy explanation

Read-only preflight returned MISSING: the canonical policy now survives App admission, but FindingGuidance passes only the view and GuidancePassages has no policy prop or explanation. Primary accepts the single-test-file gap, current source/test identity a47145924afcac63e698618daa8d8f86602d068aa1dc0b173e482d0dbfab1a9d, and the existing E visual/reuse capsule. D source and tests remain protected.

Red assignment/lease M305-E-red-01 uses phase red, attempt 1, parent None, test_worker owner e_tests. Only tests/finding-guidance-ui.test.ts may change. Extend the existing actual-App outcome before validation with policy only in completed retrieval.result; the detached view gains no field. Prove both exact policy sentences at 1280x800 and 320x800, no overflow, absent explanation for no passages, and preserve existing axe/citation/keyboard assertions. Use the existing exclusive m203-ui-UUID evidence mechanism for the four policy/viewport observations; preserve old captures. The complete guidance UI suite and normal harness cleanup use E's exact maintained caller, with the established elevated browser route and no acquisition. Fresh digest is supplied in dispatch; no Green before primary acceptance.

### M305-E-RED-01 — Missing-copy Red and capture correction

Red 1 closed compliant, contract 9bf28e23d969f9eeca5aaa6a3fa9f677ec398d8df0d10d0b44e6c882a2b7fd76, receipt 37007d2372e6afeb7992aa09b89d3cfc5e24f46d0fb68430c24b32ed27b49294. Primary inspected the single-file diff. The actual-App suite has nine passes and one intended four-state missing-copy failure; no-passage absence, citations, keyboard, axe and normal cleanup pass. Red captures are retained at temp/m203-ui-86cb8981-a19a-4282-9569-60d444ca126c.

Primary visual inspection found that those viewport captures show content above the policy paragraph, especially at 320px. They cannot support the later paragraph/citation visual check. Ordinary Red correction 2, parent M305-E-red-01, keeps the same test path, role, contract and assertions, changing only capture positioning: after each viewport settles, align the existing Retrieved guidance heading to the viewport start through its observed locator, settle paint, then capture. This does not move product focus or change production behavior. Re-run the full focused UI suite to retain meaningful missing-copy Red and normal cleanup. Preserve every earlier image; fresh captures use the existing UUID mechanism. Green waits for the corrected immutable test boundary.

### M305-E-RED-ACCEPT-01 — Accepted visual test boundary

Red 2 closed compliant, contract 3fc7bb7cc58e7fa39de74df154f408e3c56dc96bd11878a874f5681d58ad78ca, receipt 6287addc133fff2834a01905301c6f4c309a2b1b842b4e98d9fb97f80090dd5b. Primary inspected the positioning-only diff, corrected test hash and narrow capture. The guidance heading, corpus, similarity distinction and first citation now occupy the captured viewport. Four fresh Red captures remain at temp/m203-ui-687abe46-ba0e-40f0-9dfd-3f55c894d4dc; they still document absent copy, not Green. The same four intended missing-copy failures remain, with nine passing tests and normal empty-scratch cleanup.

The accepted immutable E test SHA256 is 6aa6f7ae3b1b941d4156ea747dd9df4c89ee48fbd3f5cab5a7abf0bc5c3923b4. Green assignment/lease M305-E-green-01 uses phase green, attempt 1, parent None, frontend_code_worker owner e_code and only FindingGuidance.tsx/GuidancePassages.tsx from the E capsule. All tests and other source are forbidden. Run the unchanged complete guidance UI suite and strict TypeScript through maintained callers; retain fresh four-policy/viewport captures and normal cleanup. No build, acquisition, real scan or model call. Primary supplies fresh digest and owns review/acceptance.

### M305-E-ACCEPT-01 — Accepted policy presentation

Green 1 closed compliant, contract d1b9bf6630499f8f8638cc4ad61f8efcffa153d349d2f5e12543b2dafdb67345, receipt f2830d2cadb175498bd47236948f5dbfb3cdec94c07a3442d67f5ab95eeec496. Primary inspected the actual two-component change and accepts RETAINED cohesion: canonical Finding coordination passes the finite policy; passage presentation owns the explanation. No CSS, new view field, action, provider boundary or dependency changed. Accepted test hash remains unchanged.

The worker reproduced Red because complete mutable-browser evidence identity was unavailable, then reached Green. An initial strict union-narrowing error was corrected within that turn; its preceding browser evidence is superseded by the final strict/browser results. Final guidance UI has ten passing tests, normal settled cleanup, no external requests/page errors and four empty scratch roots. Primary independent strict TypeScript passes. Primary inspected all four final marked/legacy desktop/narrow captures under temp/m203-ui-62833259-002b-48b4-97d0-bdc0a03bea8d: exact policy explanations and first citations are readable, with browser-tested no horizontal overflow. Prior native zoom evidence is historical; no new zoom claim is made.

Current 132-file source/test SHA256 is a71442568e7e364c7ac05b09250f587502f7c2db36b4e7901f6612857399cfc6. Primary independently verified all six retained actual run hashes and their validity under the amended reader, plus all three public proof hashes. No actual observation was replayed or altered. Complete regression/build and combined critical review remain pending before M305-VERIFY-04 effects.

### M305-VERIFY-04 — Finite amended verification callers

This staging supplements M305-C-PROCEDURE-01 under the explicit D approval. Effects wait for accepted D/E, complete regression/build, combined critical review and a recorded final source/test/build identity. Preserve the six earlier real runs, three public proof records, original controlled proof and frozen manifests. The final build replaces only dist/client after its previous three-file contents are preserved in absent ordinary temp/m305-build-pre-role.

**Controlled actual retrieval:** Reuse tests/helpers/m204-retrieval-checkpoint.ts with only the accepted final suffix --m305-role-selection. The fixed fresh root is temp/m305-retrieval-role-proof, ordinary, ignored and untracked; it must be absent before exclusive primary creation. Preparation writes its single-use preparation.json, performs only the maintained synthetic browser/seed/admission/cleanup proof and makes zero actual model requests. Keep original G1/G2/G3 seed/gold. Each separately dispatched --real case makes one actual selected retrieval through the default engine with its own service/vector collection and synthetic Analyze seed, never a public scan or Generate. Bounds remain 17 embeddings and at most 25 metadata/embedding requests per case, 51/75 across all three, retrieval 300000 ms, per-embedding 60000 ms, metadata 10000 ms and cooperative outer 330000 ms. Exact call count is not instrumented and must not be claimed measured.

Primary loads the unchanged README preparation before these callers. The preparation bootstrap is:

```powershell
if(Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json'){throw 'Active write lease'}
foreach($m305Scratch in @($m105UiTemp,$m105ScanTemp,(Join-Path $m105Repo 'temp/m104-setup'),(Join-Path $m105Repo 'temp/m105-integration'))){Assert-M105EmptyDirectory $m305Scratch}
$m305RoleRoot=[IO.Path]::GetFullPath((Join-Path $m105Repo 'temp/m305-retrieval-role-proof'))
if(-not $m305RoleRoot.StartsWith($m105Repo+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Proof root escaped repository'}
$null=Assert-M105OrdinaryPath $m305RoleRoot -AllowMissing
if(Test-Path -LiteralPath $m305RoleRoot){throw 'Proof root already exists'}
git check-ignore --quiet -- temp/m305-retrieval-role-proof
if($LASTEXITCODE -ne 0){throw 'Proof root must be ignored'}
$m305Tracked=@(git ls-files -- temp/m305-retrieval-role-proof)
if($LASTEXITCODE -ne 0 -or $m305Tracked.Count){throw 'Proof root must be untracked'}
New-Item -ItemType Directory -Path $m305RoleRoot -ErrorAction Stop | Out-Null
Invoke-M105Command {
 & $m105Node tests/helpers/m204-retrieval-checkpoint.ts --prepare 6b6644ba65b6ccdfd7d7a86d95f9ce87a95e8c86 --m305-role-selection
 if($LASTEXITCODE -ne 0){throw 'M305 retrieval preparation failed; preserve proof and triage'}
} $m105UiTemp
Assert-M105EmptyDirectory $m105UiTemp
```

The three actual calls are separate acceptance boundaries, never a retry loop. Dispatch each exact case only once; preserve failures and inspect canonical result, original gold matches, role suitability and cleanup before the next independent case. The G1 caller below is repeated only by substituting the next separately authorized literal G2, then G3:

```powershell
if(Test-Path -LiteralPath 'logs/agent-flow-leases/v2/active.json'){throw 'Active write lease'}
Assert-M105EmptyDirectory $m105UiTemp
Invoke-M105Command {
 & $m105Node tests/helpers/m204-retrieval-checkpoint.ts --real G1 6b6644ba65b6ccdfd7d7a86d95f9ce87a95e8c86 --m305-role-selection
 if($LASTEXITCODE -ne 0){throw 'M305 G1 failed; preserve evidence and return to primary triage'}
} $m105UiTemp
Assert-M105EmptyDirectory $m105UiTemp
```

A semantic gold miss or unsuitable selected passage is retained and reported separately from role coverage. It cannot justify another retrieval; an unaffected profile may continue after primary triage. Shared runtime, integrity or cleanup failure blocks dependent effects. Preserve each seed/run/evidence.json/desktop.png and the preparation receipt; do not remove case directories. Successful normal closure proves only the owned service/browser/ports/scratch, not model unloading or capacity.

**Public proof:** After accepting the controlled observations, apply M305-C-PROCEDURE-01 with the new source/test/build identity and explicit selectionPolicy, six baseline run directories and target https://www.w3.org/WAI/demos/bad/before/home.html. Use absent exclusive temp/m305-live-proof-04/record.json. Exactly two new scans, one per mode; at most one first-complete-Finding retrieval per run; at most one original unused eligible Generate per provider. Same live-owner, metadata, privacy, preservation, actual UI activation, validated readback and literal stop/cleanup gates apply. The selected public contrast branch is independent of another profile's measured suitability; it still must supply its own authentic complete evidence, supported retrieval and full provider admission. No target substitution, additional scan/retrieval/generation, fallback, acquisition, old-run replay or M6 output follows.

### M305-R-01 — Retrieval coverage investigation and proposal contract

**Authority and scope:** The owner approved investigation of retained retrieval evidence and preparation of a concrete correction proposal after the third preparation. This is decision preparation within M3-05's unresolved integration checkpoint, not authorization to change Accepted requirements, reopen M2, edit application code or repeat live scans/retrieval/generation. Existing grants and exhausted implementation budgets remain unchanged. Target artifact: a Proposed correction in this existing plan, followed by an owner decision on the concrete scope.

**Routing:** R2 because the proposal crosses retrieval, guidance eligibility, persisted provenance and evaluation interpretation and is an owner-controlled decision artifact. The investigation reuses repository-local evidence and existing validation mechanisms; it does not design new serialization, identity verification, concurrency, security or recovery mechanisms. Escalate if such mechanics become necessary. One bounded non-ranking discovery is complete: current exact global top-three selection, a larger global result window, and role-diverse selection after exact ranking are the candidate set. No external product/API selection is needed.

**Frozen comparison:** Compare (A) preserve current selection and abstention, (B) increase the fixed global result limit up to the largest current rule/criterion candidate set, and (C) rank the same complete filtered set and select its highest-ranked passage for each required role, retaining at most three. Common criteria are authentic role coverage, meaningful semantic ranking, unchanged privacy/source/evidence boundaries, minimal implementation and prompt footprint, truthful persisted selection provenance, compatibility with retained evidence and evaluation honesty. Do not tune queries or corpus text against observed results, relax required roles, add fallback retrieval, or claim an unexecuted ranking/model result.

**Hard gates and invariants:** R1: unchanged canonical corpus, source text, embedding model/query and rule/criterion filter. R2: exact scores and stable passage-ID tie ordering; no synthesized passage or fabricated live result. R3: criterion/interpretation/remediation and conflict/evidence gates remain mandatory before Generate. R4: all existing runs and frozen manifests remain unchanged and historical results retain their original interpretation. R5: any amended selection must be distinguishable in future persisted provenance; never label a role-diverse set as the unqualified global top three. R6: no automatic retries, extra model calls, sibling mutations, manual-review promotion or scope/status advancement. R7: the proposal must name affected authorities, code responsibilities, meaningful verification and remaining owner decisions; it cannot treat acceptance as measured quality or capacity.

**Evidence and budget:** M305-C-OBSERVATION-03 and M305-FINAL-03 are accepted actual observations; current source/catalog inspection supplies deterministic evidence. Primary owns local diagnosis and scope mapping. One read-only technology researcher compares the bounded candidates and authority/evaluation impact, with at most one targeted follow-up. Primary synthesis is used unless an R2 analyst trigger remains; fresh independent final semantic review is required for the proposal, with at most one supported correction loop. No pre-draft checkpoint is required unless a published trigger emerges. Stop for changed scope, critical mechanics, contradictory decision semantics or exhausted allowance. The final artifact must separate the decision that can be made now from implementation and future live proof.

### M305-R-PROPOSAL-01 — Proposed selection by guidance role

**Status:** Accepted by the owner after fresh independent final semantic PASS at M305-R-REVIEW-01; execution is bound in M305-D-01. M305-R-01's primary synthesis is DRAFT READY after its one read-only technology-research report and independent primary source/retained-record inspection. There are no contradictory or closely ranked viable corrections, unresolved decision semantics, or new critical mechanisms; no analyst or pre-draft reviewer trigger applies. The original proposal was nonbinding; M305-D-01 records its later acceptance and implementation scope.

**Finding:** Current code implements its contract correctly. Both retained W3C runs used the same query and pinned embedding identity and returned identical passage IDs/scores. The contrast query describes whether the recorded ratio is below, equal to or above the required ratio; an equivalent below-threshold page supplies no new query text. Its criterion source exists in the catalog, but its rank beyond the retained three is unknown. Repeated target selection is therefore not an evidenced correction. No confirmed implementation defect is recorded.

| Option | Assessment |
| --- | --- |
| Keep global top three | Preserves the current semantic-ranking demonstration and lawful abstention, but leaves the demonstrated coverage limitation unresolved. |
| Increase the global limit | Four or five cannot be claimed to include the missing criterion without unavailable complete ranks. Six returns every eligible passage in the current 5/5/6 catalogs, so ranking changes order rather than membership. It also expands prompts and contradicts the generation builder's exactly-three requirement. This is a broader correction. |
| Highest-ranked passage per required role | Retains three results, existing embedding/query/filter/corpus and generation input size. Exact ranking still chooses between candidates within a role. It directly addresses omitted-role coverage and is the recommended bounded amendment. |

**Concrete proposed behavior:** Score every candidate in the existing rule/success-criterion filtered set once using the unchanged exact cosine search and passage-ID tie-break. Traverse that complete ordered set and retain only the first passage for each of criterion, interpretation and remediation. Preserve those selected passages' original scores and relative score/ID order; return at most three. Do not filter by role or exact passage ID before scoring, backfill from outside the ranked set, make an additional embedding request, rewrite the query, or add a second retrieval stage. Keep the existing support classifier, conflict handling, evidence sufficiency, no-call abstention, explicit Generate and provider-fit checks. An absent role still yields incomplete guidance; an empty result, unresolved returned-set conflict or execution/integrity error retains its existing distinct outcome.

**Tradeoff accepted only if approved:** The current catalog contains every role and no declared unresolved conflict. Successful complete retrieval under this rule therefore satisfies its role-coverage check by construction. This is a deliberate change from testing whether global top-three similarity happened to cover every role. It is not proof of relevance or grounding. Current role counts are image-alt 1/2/2, label 1/3/1 and contrast 1/4/1: criterion choice is fixed for every profile, and label/contrast remediation is fixed; semantic competition remains for interpretation and for image remediation. In particular, choosing H67 for the informative-image gold case remains a relevance failure even though it is a remediation-role passage. Preserve gold expectations and report suitability separately.

**Provenance and preservation requirements:** Future results must explicitly identify this selection policy, rather than representing their members as the unqualified global top three. Use the existing strict result-validation and nested provenance mechanisms; the implementation packet must bind an explicit finite policy value and preserve the historical unmarked global-three result form without rewriting old records. This proposal authorizes no new hashing, migration, recovery, historical replay or identity framework. If ordinary existing validation cannot express the distinction, return to the R3 route before defining new mechanics. Existing corpus bytes/version, query/input-fit identities, all six retained runs, M2 observations and frozen generation/evaluation artifacts remain unchanged. Historical records retain their original selection and support interpretation.

**Authority impact if selected:** Amend [ADR-0019](../../architecture/decisions/ADR-0019-in-process-exact-vector-search.md)'s global selection, provenance, sufficiency and non-predetermined-membership rationale, preserving its history. Reconcile [REQ-RETR-006, REQ-CORP-007 and the support policy](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval), and OD-022's corresponding description in [delivery readiness](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md). Preserve REQ-RETR-004 and all generation/evidence/conflict/privacy gates. ADR-0022's closed corpus/source decision remains unchanged. [REQ-EVAL-005/007](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) requires affected fixed retrieval cases to produce fresh, separately identified evidence and retain gold/previous results. Reconcile future evaluation configuration through its authority; no historical manifest overwrite or new generation-evaluation execution count is implied.

**Implementation scope to bind after selection:** Keep scoring and role selection in existing retrieval-ranking.ts; exact-retrieval.ts emits the selected policy and retrieval-contract.ts validates historical/new forms. Existing domain/service/client admission must preserve that field and reject inconsistent results using their existing boundaries. Guidance presentation must disclose the selection meaning without presenting scores as support or confidence. Preserve the exactly-three generation input contract, substantive lifecycle/ownership behavior, canonical corpus and all existing A/B implementation budgets. Primary must explicitly add the approved retrieval scope to the M3-05 roadmap/plan and create its own bounded separate-owner TDD assignment; this is not a B correction or an implicit reopening of a completed M2 task.

**Verification before any live continuation:** Test highest-per-role selection across all profiles, equal-score ordering and input order permutations; missing roles, zero results, malformed/foreign/duplicate passages, errors and conflicts; unchanged query/embedding request count and selected-only updates; retained legacy record validation and explicit new-policy preservation through service/UI; unchanged three-passage generation construction and provider admission. Reuse unchanged evidence and rerun affected fixed retrieval cases with original gold, reporting actual relevance independently from role coverage. Required strict/build, proportional browser evidence, risk-routed fresh review and task documentation closure still apply. Fresh same-owner Local/Groq integration proof requires a new finite live-preparation grant; do not reuse an abstained run or invent an unmeasured criterion score. I9, M3-03 capacity and M6 qualification remain unfulfilled until their own proof exists.

**Decide now / prove later:** The owner's decision is whether to replace global top-three membership with highest-per-required-role membership while keeping the three-result cap and every substantive gate. Implementation planning then binds ordinary field literals, exact owned files/callers, finite budgets and backward-reading checks within that selected behavior. Actual selection, relevance, provider fit and live generation are measurements to obtain afterward; they are not deferred design semantics or promised outcomes.

**Concrete combined execution grant to request after review:** Accept the selection amendment above, its authority reconciliation and one newly scoped retrieval implementation assignment under the existing separate-owner TDD/review/lease procedure, without resetting A/B budgets. Include affected fixed retrieval-case verification with original gold and three new controlled retrieval observations total, one for each existing profile rather than per generation provider; preserve prior evidence. For C, authorize exactly two new scans of the same W3C demo, one per mode, at most one first-complete-Finding retrieval per run including existing lazy embedding preparation, and carry forward the original unused at-most-one Generate activation per provider after genuine same-owner support. No new generation-evaluation execution, model acquisition, target search, second selection, retry or fallback is included. Freeze concrete callers and fresh evidence identity before those effects; failure retains its result and stops the affected finite branch.

### M305-R-REVIEW-01 — Accepted investigation and proposal review

The fresh independent R2 reviewer returned PASS with no Blocker/Major/Minor after checking the complete R1–R7 packet, prospective combined grant, current source/authorities/catalog/gold and both retained actual records. Reviewed plan SHA-256 was 64951279c08f04b1aafd6138020742c947dbe26208fd0b56a22b199eebc6be71; primary status/closure maintenance follows without changing the reviewed recommendation. No researcher follow-up or review correction was needed. The reviewer accepted the decision-versus-implementation boundary and confirmed that no new custom identity, serialization or recovery mechanism is proposed.

Primary accepts the investigation and proposal's readiness for owner consideration, not the changed policy, implementation or live verification. The old lawful abstentions remain unchanged. Primary independently validated the 16-passage catalog, empty declared conflict list, all 132 unchanged source/test files and thirteen frozen references. No new scan, embedding, provider or application operation occurred. Complete ranks beyond the retained three, future relevance, backward-reading implementation, provider fit and live success remain unmeasured.

Documentation impact: Updated only this living plan and its concise progress record for the authorized investigation, comparison, reviewed proposal, exact next decision and prospective finite proof grant. No requirement, ADR, roadmap status, corpus, evaluation artifact, source/test file or runtime configuration changed. Documentation validation covers changed Markdown encoding/whitespace, local file/anchor links and git diff --check; the unchanged nineteen PowerShell fences and exact 25-suite inventory reuse M305-FINAL-03 evidence. M3-05 stays In progress/unarchived. If the owner selects the proposal, reconcile the named authorities and explicitly scope the new retrieval assignment before preflight and effects.

### M305-B-PREFLIGHT-01 — Missing explicit-generation interface

Primary accepts the separate test worker's source-only **MISSING** classification. Stable App/main expose only Analyze and guidance; selected detail has no generation or proposal owner; both existing stage-label functions misdescribe generation states. Existing tests end at supported guidance and do not cover this flow. The preflight made no writes or effects and did not treat the concurrently evolving A source as accepted evidence. B writes still require accepted A and a fresh lease.

The exact five test paths and existing generated entry/scratch remain M305-COMMANDS-01. Primary freezes three bounded additions within that envelope before Red: generation callback/call/AbortSignal capture; separately addressable deferred generation settlements that all participate in the existing teardown settlement; and a generation-only accessor test seam that preserves callback-property reflection until the action. An opt-in test wrapper may call the actual App with a props Proxy during React rendering to exercise that accessor; ordinary harness rendering stays unchanged. Do not use production hooks or a generic scenario controller. The accessor seam must prove no read at ordinary render and reserved/consumed state before its action-time reentry.

For actual-main transport proof, extend existing `startHarness(manual = false, entry = 'app')` with only the fixed `'main'` alternative. Its existing generated TSX imports actual `src/client/main.tsx` and supplies only the teardown bridge; it does not render a second App root. Run that test in a separately opened/closed harness after the ordinary App group releases the shared scratch. Controlled same-origin `window.fetch` responses established by the test drive one synthetic scan, guidance and generation; a separately deferred `response.json()` and observed AbortSignal exercise the real main callback under the App lifetime. Block external requests as before. Closing the owned context/browser/server and settling controlled promises is the terminal cleanup; no inaccessible production React root is claimed to be manually unmounted. This adds no file, route, dependency, production option or real scan/provider effect.

The M305 fixture's manual/citation/browser imports remain lazy behind explicit helper functions or `--manual`, preserving A's inert import contract. All complete captured-state and actual-native-zoom callers, filenames, viewport and effect bounds remain unchanged. Ordinary fixture transformations must clone historical frozen values before mutation and validate intended valid aggregates; invalid-fixture failures are not Red.

### M305-A-VERIFY-01 — Corrected focused verification

Primary reaccepts the corrected test boundary from M305-A-TEST-CORRECTION-01. New admission SHA-256 is `76c78ba75b8bcb34c741571335822423cf1b3df59f1de6c8893803fcd6c6a593`; helper SHA-256 is `1c3c019b7bf2340c73d4b5c5f3fa582e23004619b17524eccc141a061eb35714`. API and generation-service hashes remain those in M305-A-RED-ACCEPT-01. Historical missing-module Red is retained as history only, not reused for the corrected test bytes. No production edit followed the compliant Green closure.

Corrected execution passes **28 focused tests**: generation API 5, generation admission 8, generation service 10 and guidance API 5; zero failures/skips/cancellations/todos. Primary independently ran strict TypeScript successfully. Exact callers and environment restoration are M305-COMMANDS-01; the final admission-only fixture change does not invalidate the preceding successful API execution against the same production/helper bytes. Every preservation witness now passes the unchanged aggregate validator before admission rejection. No synthetic roots remain and no real provider operation occurred.

Primary inspected all eight production changes and all corrected tests. Cohesion is **RETAINED**: fixed resolver, substantive HTTP parser and generation admission are purpose-owned; only existing descriptor snapshot/equality moved into their shared owner; composition changes remain small. `contracts.ts` needs no edit. Protected generation stage/adapters/domain/repository are unchanged. Fresh S3 review is still required before A acceptance and B writes.

### M305-A-TEST-CORRECTION-01 — Bounded fixture reconciliation

A Green attempt 1 added the eight intended production owners/seams without changing tests. Its five API groups pass, but admission passes 7/8 because the supposedly independently valid sibling locator witness fails inside the test's own `valid()` before calling admission. Primary closed `M305-A-green-01` **closed-compliant**, receipt `0b0ca9d320e1355d9da53170c982be2ad6972db55a2bc00baa0f0b7f0820be5e`; only eight allowed source paths changed and protected/Git boundaries remained intact. Independent strict TypeScript then identified one additional test-only defect: `GenerationAdapter` was imported from service, which does not export it.

Primary invokes only ADR-0024's explicit bounded test-correction exception between leases: replace the two unsupported arbitrary-selector fixture literals with distinct permitted structural `:nth-child` locators in `tests/finding-generation-admission.test.ts`, and import the existing adapter type from its actual owner in `tests/helpers/m305-generation-fixture.ts`. Protected `finding-validation.ts::readLocator` permits exactly these structural selectors. Assertions, expected preservation behavior, production code and authoritative validators are unchanged. These isolated fixture/import repairs require no design or implementation judgment by the test's implementation owner.

The affected initial Red and prior focused evidence are invalidated for reuse. Fresh corrected results and hashes must be accepted before any further Green; do not fabricate Red now that production exists. The worker's Green attempt 1 and earlier Red/no-diff history remain consumed; this narrow primary correction does not reset a budget. At most ordinary Green attempt 2 and conditional 3 remain. B's independent read-only preflight is not a write turn or evidence that A passed.

The first corrected run passed strict/API and progressed beyond both locator witnesses, then exposed a separate fixture-construction failure: the historical analysis object is frozen. The same bounded reconciliation clones that one candidate and changes its analysis/retrieval finish timestamps together, as the existing assessed-Finding validator requires. The witness still independently validates before testing exact preservation. This is new fixture evidence, not repeated production failure; all assertions remain intact. Final corrected evidence remains pending until rerun.

### M305-A-RED-ACCEPT-01 — Accepted qualified Red

Primary inspected all four actual test changes, the worker handoff and fresh compliant terminal receipt for `M305-A-red-02`: contract `b2c8438d692d3e026b62818ef41deffd89a41b692c633349733cb98618c85e52`, receipt `4afd1edd59ecc053a8a68a986375b11f31ca4ee8b239cc11a6bdea94ffc1d5b0`. Only the four allowed test files changed; Git/settings/ignore/protected boundaries remained intact. The existing generation-service suite passed all 10 tests with its controlled missing-prerequisite adapter and unchanged assertions. No provider or embedding operation occurred, and owned synthetic roots were removed.

Both primary and worker reproduced the exact missing production modules `generation-api.ts` and `finding-generation-admission.ts` with the frozen callers. This accepts only first-module Red: the five API and eight admission behavior groups have not executed. Their future assertions cover HTTP/default factories, durable-before-construction ordering, strict envelopes and selected-only preservation, invocation/persistence consistency and hostile reflection. Separate Green must pass all four focused suites and cannot modify the accepted tests.

Accepted SHA-256 test boundary: `tests/finding-generation-api.test.ts` = `01fadcfe3985a8fc102eb0f40ac135342efeb0285ab2ef6cec66fddffaf40041`; `tests/finding-generation-admission.test.ts` = `2569cf6ac692bbe33604246ad82d426da5c17aeff7c30d5fc52a9bb270dd3c10`; `tests/helpers/m305-generation-fixture.ts` = `3e08db8cbeb3e419b5fd1c9ef768cca0629f89527fc556ca0bc964c4c4bc276f`; `tests/generation-service.test.ts` = `55dac661ff58908a914ed898a13663cbf8b3745d5f1147026c61d1048ccc0a75`. Test owner remains the separate test worker. Red attempt 2 is consumed, with conditional attempt 3 subject to the original stopping rules; Green starts its own initial attempt without resetting Red history.

Primary also reconciled B's responsibility table before B preflight: existing `resultPresentation.ts::findingWorkflowStatus` owns list labels and otherwise mislabels generation failures and proposals as guidance failure/eligibility. Its bounded stage-label extension belongs in B alongside FindingOutcome, without changing layout, eligibility or the accepted G mechanics. Fresh B critical review must cover both owners. This is a source-supported placement correction, not a reopened architecture decision or live-operation allowance.

### M305-A-RED-01 — Reconciled guard-reading stop

The first test write turn stopped with no edits or effectful tests after incorrectly comparing `active.json`'s self-digest with the Packet v2 contract digest. The active-pointer digest authenticates that separate pointer record; it is not the contract pin. Primary inspected the guard implementation's `_read_active`/`_claim_active` and verified the actual contract's digest `78237728c29f9733eb24a96d7830598b52c523f3e48944e4225af87a195a2f56`. Pinned guard `status` returned active with no drift, then fresh `close` returned **closed-compliant**, receipt `6a5f2e30877b06c69c507291ce362c7172a609306b22b7217e21bfb06f3cac3a`, with no changed paths or Git-state changes.

There was no actual authority mismatch or application defect, and no Red evidence exists. The worker's conflict diagnosis is superseded by this verified interpretation. Red attempt 1 is consumed with one no-diff outcome. Resume through its ordinary attempt-2 correction with terminal parent M305-A-red-01, unchanged path/behavior contract and a fresh baseline; never compare the pointer digest to the contract pin. The same test worker remains owner. No allowance is reset, and a second no-diff outcome or repeated failure without new evidence triggers the existing stop.

### M305-A-PREFLIGHT-01 — Missing integration boundary

The persistent test worker's source-only Packet v2 preflight classifies A **MISSING**. Existing injected-adapter lifecycle tests cover prerequisites; no fixed default resolver, generation HTTP callback/route or client generation admission exists. Primary accepts that coherent classification and the narrow first-module route for the agreed missing production API/admission modules, backed by the fresh entry's strict/103-test runtime evidence. A module-absence Red must identify exactly the agreed production module and openly report unexecuted behavioral assertions; helper, syntax or path failures are not valid Red.

Preflight changed no files or effects and confirmed only four primary documentation paths dirty, unchanged HEAD/source and no lease. Five initially malformed quoted shell invocations produced parser errors and no evidence; corrected read-only inspection succeeded. These are inspection-command errors, not passing validation or behavioral Red. Future commands must use the reviewed PowerShell callers. No worker write or correction budget is reset.

Red's four exact paths and commands are M305-COMMANDS-01. It must first replace the eligible adapterless missing-prerequisite dependency with an explicit controlled prepare failure, preserve existing assertions, register both factory mocks before dynamic service/resolver imports, and keep the shared fixture inert and browser-free. Primary will inspect actual tests, results and terminal lease before accepting Red. Separate Green cannot edit accepted tests. G checkpoint documentation checks pass for four changed Markdown files: UTF-8/no BOM, final newline, whitespace, 190 local links/anchors and diff-check.

### M305-G-ACCEPT-01 — Accepted integration and command contract

Primary accepts M305-G-01 and M305-COMMANDS-01 after the critical researcher, mandatory analyst DRAFT READY, fresh pre-draft PASS with its supported tuple correction, primary authorship and different final research PASS after F1 command correction. No unresolved Blocker/Major/Minor remains. The final reviewer checked the complete I1–I10 packet on both passes, independently parsed all ten PowerShell fences, reproduced source/frozen identities and ran only the build/proof callers' read-only preconditions successfully. Reviewed artifact SHA-256 was `e8a786d5790f911f2372b4d6ac05dec85333ddcb9607800424e5935674f9628a`; current-state acceptance maintenance changes its bytes without changing the reviewed contract.

Both slices are behavior-bearing TDD with S3 review; B uses the accepted frontend-visual capsule and skill. A preflight can now start under Packet v2, with no lease or effects. Separate Red/Green leases, unchanged accepted tests, primary acceptance and critical reviews remain mandatory. Application source/test identity is still the entry identity, and no application/model operation occurred. C's finite target preparation and generation allowances are all unused. C's complete current procedure is frozen only after A/B and before C effects. This checkpoint does not implement Generate, establish real eligibility, close M3-03/C or M3-05, or select M4.

### M305-G-01 — Authored integration contract

**Review state:** Accepted at M305-G-ACCEPT-01 after primary authorship and both required fresh reviews. Research E1–E8, the analyst's DRAFT READY conclusion and the tuple correction in M305-G-SYNTHESIS-01 are incorporated. The pre-draft reviewer independently reproduced HEAD, source identity, manifest and thirteen references without application effects. Its one correction is consumed; no research or worker budget is reset. All I1–I10 remain implementation proof obligations. Confidence is high in the source-supported boundary, not in unexecuted behavior or live success.

**Selected placement:** Adopt the focused owners in the A/B tables above. A includes both admission extraction paths, sharing only descriptor snapshot and order-independent object/ordered-array equality; guidance transition policy stays unchanged. `generation-adapters.ts` owns the fixed two-case factory resolver; `generation-api.ts` owns substantive generation HTTP parsing. Existing stage, adapters, repository, domain validators, corpus, evaluation, dependencies and configuration are protected. B adopts the named action/status and proposal owners; `GuidancePassages.tsx` is REUSE_AS_IS, with canonical source links resolved from the held complete guidance view. No empty wrapper or generic helper is authorized. A's new interface is `admitGeneration(raw, before, findingId)`; B's App callback is `generateFinding(intent, signal): Promise<unknown>`. Current service `generateFinding(input, adapter?)` remains the internal controlled-test seam. Private type names may follow current conventions without changing these responsibility or observable boundaries.

**HTTP and dispatch:** Exact same-origin POST `/api/finding-generation`, no query or fragment. Content-Type is trimmed/lowercased and must equal `application/json` (no charset parameter). Admit at most 1024 accumulated UTF-8 bytes inclusive; reject invalid/oversized declared Content-Length and enforce the accumulated limit independently. Fatal UTF-8 decoding precedes JSON parsing. Existing `readObject` requires exactly `runId` and `findingId`; `readId` requires 1–64 ASCII characters matching `^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`. No browser-owned provider options or payload enter the service. A latch set before callback dispatch prevents repeated dispatch; incomplete request abort/error dispatches nothing, while disconnect after dispatch neither cancels service work nor redispatches. Do not write a destroyed response.

Parser rejection is HTTP 400 with `{ok:false,error:'invalid-request',run:null,persisted:false,cleanupFailed:false,invocationPersisted:false}`. Unexpected callback rejection is HTTP 500 with the same flags except `error:'response-validation'` and `cleanupFailed:true`, explicitly unknown, not confirmed no-call. Normal service outcome is returned unchanged: 200 success; 400 invalid-request; 404 not-found; 409 busy/workflow-active/not-eligible; 503 stopping/shutdown/missing-prerequisite; 500 all remaining existing errors. Existing health JSON stays byte-shape compatible and API-only service construction exposes no generation route. Route composition adds generation only alongside the existing client-backed operations.

Resolve a default adapter only after durable eligibility, synchronous exact retrieval-owner consumption, and successful running-generation publication. Use the immutable validated provider context to call exactly the existing Local or Groq factory with no options. The supplied internal adapter overrides default construction only for controlled calls. Startup, health, Analyze, provider selection, Finding selection and ineligible requests do not construct/prepare adapters. Existing stage controls preparation, at-most-one transport attempt, fit, validation, cleanup and deadlines; no second lifecycle is introduced.

**Admission:** Detach baseline and response through own enumerable data descriptors; reject accessors, cycles, malformed arrays and failed reflection. Validate both runs with existing pure validators and bind the selected identity. Compare the entire aggregate after substituting only selected Finding state/generation/result: native fields, completed analysis and retrieval, provider, scan, observations, siblings and ordering stay exact. Require baseline supported eligibility with no generation/result. Success is only a completed selected generation with its original validated eleven-field proposal in `proposal-pending-review`. A failed envelope never contains a proposal. Validate detached invocation using `readProviderInvocation` and `invocationMatchesProvider`; do not import privileged I/O into client code.

| Failed outcome tuple | Required admission and truth |
| --- | --- |
| `persisted:true` | Non-null run; selected failed generation with matching error. Envelope invocation presence and value must equal durable invocation in both directions; `invocationPersisted` equals invocation presence. Existing generation validator decides stage error/provenance compatibility. |
| `persisted:false`, original eligible run | No invocation and `invocationPersisted:false`. No successful/terminal generation may be invented. `generation-persistence` with complete cleanup confirms failure before an attempt but retains the consumed generation owner. |
| `persisted:false`, running selected generation | `invocationPersisted:false`; a detached invocation is allowed only for `generation-persistence`, is mode-bound, and proves attempted but unsaved outcome. Without invocation, running publication alone does not prove no attempt. |
| `persisted:false`, null run | No invocation; `invocationPersisted:false`. Known service rejection can remain a pre-dispatch failure; it does not release an unrelated owner. |
| API unknown exception | Exactly `response-validation`, null run, all persistence flags false, cleanup uncertainty, no invocation. Admit as unknown only. |
| Nonpersisted attempted-only errors | Reject authentication/quota/rate-limit/network/provider and ordinary response-validation tuples; never infer no-call from absent provenance. The exact API unknown exception above is separate. |
| Service deadline | Nonpersisted shutdown with running/null run, uncertain cleanup and no invocation remains unknown. Late observed provenance may not have reached this envelope. |

For persisted timeout/shutdown, `response/passed` invocation can be valid; do not equate envelope error mechanically with invocation outcome. Pre-call input-integrity/configuration/missing-prerequisite/input-fit failures cannot carry invocation. Contradictory flags, foreign modes, changed selected retrieval/siblings and successful proposals in failure are rejected into local uncertainty, without publication.

**Browser ownership and lifetime:** Successful supported guidance establishes an exact run-snapshot/Finding continuation distinct from uncertain ownership. Generate consumes that continuation, marks the action consumed and reserves a unique operation token before reading/invoking the callback or reflecting collaborator data. Duplicate and synchronous reentrant activation cannot dispatch again. The operation holds its original selection while ordinary sibling selection controls display independently. Recheck mounted state, token, held run snapshot and elapsed deadline after every await and callback-capable reflection, including response admission. Publish only to the held Finding and retain current selection/focus.

Start a local 120000-ms timer before invoking the callback; main passes its AbortSignal to fetch and includes `response.json()` within that promise. Timer expiry, rejection, missing callback, malformed/lost response or admission failure ends pending UI, invalidates publication and aborts local transport, retaining uncertainty and the consumed action. Elapsed checks also run before publication because timer callbacks may be delayed. Clear timer and abort/invalidate on unmount. Old late fulfillment/rejection cannot update a newer run or release a newer token. Abort is local resource handling and never proof the service/provider stopped.

Generation-persistence retains the generation guard even when `cleanupFailed:false`. Busy/workflow-active cannot release another owner. Only a trustworthy clean terminal outcome releases its applicable continuation; no terminal or consumed Finding gains another Generate action. Ordinary Analyze is available once local pending ends, subject to service busy/stopping rejection. A validated independent new run clears per-run maps/continuation without declaring previous cleanup complete or resurrecting eligibility. No retry, polling, cancellation control, mode switch, review action or fallback is added.

**Presentation and proof:** Accept M305-UI-01's A/B placement and complete state/viewport matrix above. Keep one shared announcement pattern, native keyboard controls, pending focus continuity and stage-correct failure labels. Present action submission, known attempt, durable save and unknown outcome distinctly. No action exists for abstention/manual-review items. Local disclosure identifies Ollama/qwen3.5:4b on loopback; Groq identifies openai/gpt-oss-20b and external execution of permitted minimized selected facts/guidance. Keep Local complete token fit distinct from Groq byte admission; show no readiness promise. Proposal claims, evidence references, resolved guidance, confidence, uncertainty, assumptions including empty, blocking judgment and post-change reminder remain separately inspectable inert text. Automated focus/status/keyboard/axe checks plus visual desktop/narrow/new-region actual zoom are required, without spoken-output or full-guidance zoom claims.

### M305-COMMANDS-01 — Complete A/B callers and effects

All commands use the repository cwd and README preparation, without downloads or dependency restoration. In each fresh PowerShell session load the maintained block exactly:

```powershell
$m305Readme = Get-Content -Raw README.md
$m305Prep = [regex]::Match($m305Readme, '(?s)```powershell\r?\n(\$ErrorActionPreference.*?)\r?\n```').Groups[1].Value
if (-not $m305Prep) { throw 'Preparation block missing' }
. ([scriptblock]::Create($m305Prep))
if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')) {
  throw 'M305 requires capture flag absent on session entry; preserve and reconcile inherited environment before continuing'
}
```

The wrapper pins Node 24.20.0 at `C:/nvm4w/nodejs/node.exe`, disables compile cache, qualifies scanner/UI TEMP/TMP and managed Chromium, and restores every changed process environment value in `finally`. Preserve the existing protected runtime and dependency inventory. Fingerprints use **Ordinal** sorting of path strings, lowercase hexadecimal file SHA-256 values and the LF-joined algorithm in M305-ENTRY-02; never hash the secret. Each guard start pins the current endpoint/index/ref and exact dirty paths. Browser/filesystem evidence is Non-reusable unless its isolated state is bound in the handoff.

A preflight is source-only. A Red owns exactly `tests/finding-generation-api.test.ts`, `tests/finding-generation-admission.test.ts`, `tests/helpers/m305-generation-fixture.ts`, and `tests/generation-service.test.ts`. Before default dispatch changes, the existing eligible adapterless missing-prerequisite test must supply an explicit controlled adapter returning missing-prerequisite, preserving its assertions. Other ineligible adapterless tests stay safe. New API tests register both existing factory-module mocks through Node `mock.module` **before dynamic imports** of the real service/resolver, using installed `namedExports` typings. No real key/runtime/provider may be reached. `--experimental-test-module-mocks` is confined to that suite, including regression. Initial missing production modules may establish qualified first-module Red only after preflight and the existing pure 103-test runtime evidence; other failures require their actual classification.

Run A suites serially; Red may stop after the coherent new API/admission Red, while Green requires all four:

```powershell
Invoke-M105Command {
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/finding-generation-api.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M305 API boundary failed' }
}
foreach ($m305Suite in @('finding-generation-admission','generation-service','finding-guidance-api')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 "tests/$m305Suite.test.ts"
    if ($LASTEXITCODE -ne 0) { throw "M305 $m305Suite failed" }
  }
}
```

New API fixtures use exclusive `mkdtemp` leaves under `temp/m305-generation-`, each with its own `runs` child and loopback port 0. Existing suites retain their m203-guidance-api/m302-generation prefixes. Test helpers must ordinary-path check their exact owned leaf, close their service, prove port closure and remove only their own synthetic children in `finally`. No real `data/runs` contents or production provider options are introduced. Failure leaves an identified residue for primary triage, not blind retry or blanket temp deletion.

B Red owns exactly `tests/finding-generation-ui.test.ts`, `tests/helpers/m305-generation-fixture.ts`, `tests/helpers/m104-ui-harness.ts`, `tests/finding-guidance-ui.test.ts`, and `tests/target-results-ui.test.ts`. Harness changes are only the generation callback bridge and immediately required bounded synthetic/manual/capture seams. A admission/API tests are protected. Green owns only B's production table, excluding GuidancePassages. Normal test execution writes no proof images. Desktop is 1280×800, narrow is 320 CSS pixels, with the actual managed Chromium 151.0.7922.34 at the recorded chromium-1234 runtime. The existing harness binds source identity, blocks external routes, uses serviceWorkers block/downloads disabled, loopback port 0 and exclusive ordinary scratch. Run serially after asserting the four existing scratch directories empty:

```powershell
foreach ($m305Leaf in @('temp/m103-scan','temp/m104-ui','temp/m104-setup','temp/m105-integration')) {
  Assert-M105EmptyDirectory (Join-Path $m105Repo $m305Leaf)
}
if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')) {
  throw 'M305 ordinary UI suites require the capture flag absent'
}
foreach ($m305Suite in @('finding-generation-ui','finding-guidance-ui','target-results-ui')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 "tests/$m305Suite.test.ts"
    if ($LASTEXITCODE -ne 0) { throw "M305 $m305Suite failed" }
  } $m105UiTemp
}
foreach ($m305Leaf in @('temp/m103-scan','temp/m104-ui','temp/m104-setup','temp/m105-integration')) {
  Assert-M105EmptyDirectory (Join-Path $m105Repo $m305Leaf)
}
```

Harness output is confined to its existing `m104-test-entry.html`, `m104-test-entry.tsx`, `vite-cache` and browser-owned scratch; teardown closes pending callbacks, context/browser/server, verifies port and unchanged runtime, then removes exact owned generated output. Existing marker and dependency validation remain required. No browser install, trace, video, download, full-page capture of a real target or raw provider payload is authorized.

**Build preservation:** M305 entry `dist/client` contains only `index.html` (414 bytes, SHA-256 `04bf5fd72407d96ffc55bc99a23494cbb7da23760871d69ee9bdd63ce661ea22`), `assets/index-C-5y_5fq.css` (5352, `a53cd0ee68f194febe59fab2c480acb7873e57c9435aec39b6dbdf4c84558937`) and `assets/index-mZuvaPXm.js` (261505, `c053deac8dd57e98edb1aecc028ac6d81f4dd46a1b119efe1691b2d1e9c5b492`). Verify exact ordinary descendants and this inventory before moving the whole owned generated directory to the absent ignored/untracked `temp/m305-build-entry`. Resolve both absolute paths under the repo and use native `Move-Item -LiteralPath $m105Build -Destination $m305BuildArchive`; create no archive over an existing destination. Retain the archive. Subsequent replacement requires an accepted exact generated inventory and cleanup of only those owned files/directories; unexpected output stops replacement.

The complete first-build preservation caller is below. Run it once before the first M305 build, not on every focused test. A later changed-source rebuild requires a newly bound exact owned-output inventory and cleanup caller before its effect; it cannot replay the entry move or overwrite the archive.

```powershell
$m305BuildArchive = [IO.Path]::GetFullPath((Join-Path $m105Repo 'temp/m305-build-entry'))
$m305BuildSource = Assert-M105OrdinaryPath $m105Build
$null = Assert-M105OrdinaryPath $m305BuildArchive -AllowMissing
if (Test-Path -LiteralPath $m305BuildArchive) { throw 'M305 build archive already exists' }
foreach ($m305IgnoredPath in @('dist/client','temp/m305-build-entry')) {
  git check-ignore --quiet -- $m305IgnoredPath
  if ($LASTEXITCODE -ne 0) { throw "M305 path is not ignored: $m305IgnoredPath" }
  $m305Tracked = @(git ls-files -- $m305IgnoredPath)
  if ($LASTEXITCODE -ne 0 -or $m305Tracked.Count) { throw "M305 path is tracked: $m305IgnoredPath" }
}
$m305BuildExpected = @{
  'index.html' = @(414, '04bf5fd72407d96ffc55bc99a23494cbb7da23760871d69ee9bdd63ce661ea22')
  'assets/index-C-5y_5fq.css' = @(5352, 'a53cd0ee68f194febe59fab2c480acb7873e57c9435aec39b6dbdf4c84558937')
  'assets/index-mZuvaPXm.js' = @(261505, 'c053deac8dd57e98edb1aecc028ac6d81f4dd46a1b119efe1691b2d1e9c5b492')
}
$m305BuildItems = @(Get-ChildItem -LiteralPath $m305BuildSource -Recurse -Force)
$m305BuildFiles = @($m305BuildItems | Where-Object { -not $_.PSIsContainer })
$m305BuildDirs = @($m305BuildItems | Where-Object { $_.PSIsContainer })
if ($m305BuildFiles.Count -ne 3 -or $m305BuildDirs.Count -ne 1) { throw 'M305 unexpected build inventory' }
foreach ($m305BuildItem in $m305BuildItems) {
  $null = Assert-M105OrdinaryPath $m305BuildItem.FullName
  $m305BuildRelative = [IO.Path]::GetRelativePath($m305BuildSource,$m305BuildItem.FullName).Replace('\','/')
  if ($m305BuildItem.PSIsContainer) {
    if ($m305BuildRelative -cne 'assets') { throw 'M305 unexpected build directory' }
  } else {
    if (-not $m305BuildExpected.ContainsKey($m305BuildRelative)) { throw 'M305 unexpected build file' }
    $m305BuildExpectedItem = $m305BuildExpected[$m305BuildRelative]
    if ($m305BuildItem.Length -ne $m305BuildExpectedItem[0] -or
        (Get-FileHash -LiteralPath $m305BuildItem.FullName -Algorithm SHA256).Hash.ToLowerInvariant() -cne $m305BuildExpectedItem[1]) {
      throw 'M305 entry build identity drift'
    }
  }
}
Move-Item -LiteralPath $m305BuildSource -Destination $m305BuildArchive -ErrorAction Stop
if (Test-Path -LiteralPath $m305BuildSource) { throw 'M305 build source remained after preservation' }
$null = Assert-M105OrdinaryPath $m305BuildArchive
```

```powershell
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'M305 strict TypeScript failed' }
}
Invoke-M105Command {
  & $m105Node node_modules/vite/bin/vite.js build --configLoader native
  if ($LASTEXITCODE -ne 0) { throw 'M305 client build failed' }
}
```

Primary strict checking is independent of worker/test/build success. After B, inspect client imports and emitted assets for server/provider/credential leakage using the actual diff and bundle; do not read or pattern-match the real key.

**Synthetic visual capture:** After Green, primary uses the complete caller below to verify `temp/m305-generation-proof` absent, ordinary, ignored and untracked, then create only that leaf. The helper requires this ordinary empty leaf and uses exclusive file creation. Session entry and every ordinary UI/regression caller require the capture flag absent; only this scoped capture block may set it. Save the prior process value, set `1`, execute the complete generation UI suite, and restore/verify its exact prior value in `finally` (use `[System.Management.Automation.Language.NullString]::Value` for absence):

```powershell
$m305PriorCapture = [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')
if ($null -ne $m305PriorCapture) { throw 'M305 capture must start with the flag absent' }
$m305ProofRoot = [IO.Path]::GetFullPath((Join-Path $m105Repo 'temp/m305-generation-proof'))
$null = Assert-M105OrdinaryPath $m305ProofRoot -AllowMissing
if (Test-Path -LiteralPath $m305ProofRoot) { throw 'M305 proof leaf already exists; reconcile residue' }
git check-ignore --quiet -- temp/m305-generation-proof
if ($LASTEXITCODE -ne 0) { throw 'M305 proof leaf is not ignored' }
$m305TrackedProof = @(git ls-files -- temp/m305-generation-proof)
if ($LASTEXITCODE -ne 0 -or $m305TrackedProof.Count) { throw 'M305 proof leaf is tracked' }
New-Item -ItemType Directory -Path $m305ProofRoot -ErrorAction Stop | Out-Null
Assert-M105EmptyDirectory $m305ProofRoot
try {
  [Environment]::SetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','1','Process')
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 tests/finding-generation-ui.test.ts
    if ($LASTEXITCODE -ne 0) { throw 'M305 synthetic visual capture failed' }
  } $m105UiTemp
} finally {
  $m305RestoreCapture = if ($null -eq $m305PriorCapture) { [System.Management.Automation.Language.NullString]::Value } else { $m305PriorCapture }
  [Environment]::SetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF',$m305RestoreCapture,'Process')
  if ([Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process') -cne $m305PriorCapture) { throw 'M305 capture environment restoration failed' }
}
```

Capture writes exactly `<eligible|pending|failed|proposal>-<desktop|narrow>.png`, exclusively, never overwriting. Primary visually inspects all eight with `view_image`, records source/harness/state/viewport identities, and retains them ignored. A failed capture requires explicit residue reconciliation before any correction; normal regression has no capture flag and cannot overwrite proof.

**Actual zoom:** The test-owned helper's sole manual mode reuses `startHarness(true)` and actual App with fixed synthetic Local scan, supported guidance, explicit Generate and a 1500-ms pending response before proposal. It prints the exact origin, waits for page close/SIGINT or 15 minutes, and finally runs normal harness teardown. No scenario controller or extra production setting is allowed. Caller:

```powershell
if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')) {
  throw 'M305 manual proof requires the capture flag absent'
}
Invoke-M105Command {
  & $m105Node tests/helpers/m305-generation-fixture.ts --manual
  if ($LASTEXITCODE -ne 0) { throw 'M305 manual browser proof failed' }
} $m105UiTemp
```

Use the separately installed Computer Use skill's documented `@oai/sky` APIs through callable `mcp__node_repl__js`, initialized by importing `@oai/sky`; inspect `list_apps`/`list_windows`, bind the exact returned managed browser window and observe before each action. This is not the CUA surface whose native APIs are disabled. Native browser menu/keyboard controls must visibly establish 200% (not CSS scaling), with observed viewport/devicePixelRatio and window/build identity. Inspect the new generation/proposal region visually, reset zoom to 100%, close only the owned page/window and verify helper teardown/scratch. Tool availability is not zoom proof; inability to perform the check leaves that evidence pending.

**Complete regression:** After A/B, with no other app/test service or active worker lease, run the exact eighteen browser-free suites serially, the dedicated API suite with its flag, admission, both scanner suites under scanner scratch and all three UI suites under UI scratch: 25 suite files total. Use the B empty-directory checks before and after and independent strict/build above. The complete caller is:

```powershell
if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')) {
  throw 'M305 ordinary regression requires the capture flag absent'
}
foreach ($m305Suite in @('run-contract','run-repository','local-service','scan-normalization','retrieval-contract','embedding-retrieval','retrieval-service','finding-sufficiency','finding-guidance-api','generation-contract','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service','groq-generation-contract','groq-generation','groq-generation-service','finding-generation-admission')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 "tests/$m305Suite.test.ts"
    if ($LASTEXITCODE -ne 0) { throw "M305 regression $m305Suite failed" }
  }
}
Invoke-M105Command {
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/finding-generation-api.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M305 API regression failed' }
}
foreach ($m305Suite in @('scan-page','walking-skeleton')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 "tests/$m305Suite.test.ts"
    if ($LASTEXITCODE -ne 0) { throw "M305 regression $m305Suite failed" }
  } $m105ScanTemp
}
foreach ($m305Suite in @('target-results-ui','finding-guidance-ui','finding-generation-ui')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 "tests/$m305Suite.test.ts"
    if ($LASTEXITCODE -ne 0) { throw "M305 regression $m305Suite failed" }
  } $m105UiTemp
}
```

Existing suite effects remain exclusive synthetic m102-store/m102-service/m202-retrieval/m203-guidance-api/m302-generation/m303-generation/m304-groq leaves, m105-integration and scanner scratch. Existing local-service tests own their `m102-demo-UUID` run and synthetic corpus marker via their existing cleanup; preserve every unrelated run/corpus file. No changed default may turn a deterministic suite into a real provider caller. Inspect residual inventories after failure before retry.

**C staging:** Target and finite preparation are M305-C-PERMISSION-01; none is consumed by A/B. Before C, bind current source/build/frozen inputs and safe runtime metadata, official Groq availability/deprecation, ignored/untracked secret presence without content, existing `src/server/main.ts` start caller with temporary A11Y_PORT=0/application revision and exact restoration, own loopback browser, initial run inventory and stop/readback procedures. Each provider gets its own real scan and at most one retrieval of the first evidence-complete violation in scan order. If no such Finding, supported guidance or exact live owner exists, stop that provider without Generate. No alternative target, second retrieval or fabricated eligibility follows. If ownership prevents the next independent run, normal owned stop/restart precedes that provider's sole scan. Real attempt ambiguity consumes activation. Retain all actual runs; do not delete them. The full C procedure must receive primary freeze before its effects; I9 remains Pending.

**Documentation closure:** Reconcile this plan, the roadmap's current summary/task row, plan index, manual progress index/record, README capability/API/command inventory, and materially affected UI presentation instructions. Read each target completely before edits. No requirement, ADR, frozen input or executable configuration change is expected. Validate UTF-8/no BOM, final newline/trailing whitespace, local file/anchor links, all maintained PowerShell fences via the PowerShell parser, exact suite inventory, task-authority/state consistency, and `git diff --check`. Primary owns these writes between leases. Record accepted A/B checkpoint even when C fails; never mark Complete/archive without I9 and every closure gate.

**M305-G-FINAL-REVIEW-01, correction 1:** Different fresh final research review found one Major command-artifact defect, F1: undefined build archive setup, prose-only proof bootstrap and inherited capture flag effects. The primary added the executable first-build inventory/preservation caller, exclusive proof bootstrap and absent-flag entry/caller condition with exact restoration. This uses final correction cycle 1 of at most 2. No application defect, source write or provider effect occurred; complete corrected I1–I10 review remains required before G acceptance.

### M305-G-SYNTHESIS-01 — Nonbinding research conclusion

This records research and synthesis only. It authorizes no worker preflight or effect and is not the authored binding G contract. The initial `critical_researcher` report `M305-G-RESEARCH-01` returned RESEARCH COMPLETE; the mandatory `decision_analyst` returned DRAFT READY. Neither role wrote files or performed provider work. One researcher follow-up and one analyst correction remain; neither has been used. A fresh pre-draft `critical_research_reviewer` is next, followed by primary authorship and a different fresh final reviewer.

Research evidence E1 is the plan/selected authorities; E2 is the synchronous exact-owner transfer and save-failure retention in `generation-operation.ts` and `retrieval-operation.ts`; E3 is the service reservation/outcome contract and existing `generation-service.test.ts` definitions; E4 is descriptor snapshot, preservation and post-reflection ownership checks in the current guidance admission and App; E5 is the pure run/generation/proposal validators; E6 is the existing stage's attempt/deadline boundary and inert adapter factories. All source evidence binds to M305-ENTRY-02's unchanged source/test identity. Existing test definitions are not fresh passing coverage of the proposed integration.

The [Fetch Standard](https://fetch.spec.whatwg.org/#abort-fetch) supports local promise/stream abort, not proof of remote cancellation. [HTML timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers) permits delayed timer execution, so resumed work also needs an elapsed-deadline check. These are research E7/E8, accessed 2026-09-12. The [Node test-runner documentation](https://nodejs.org/docs/latest-v24.x/api/test.html#mockmodulespecifier-options), local Node help and installed type declarations support a dedicated module-mock caller with mocks registered before dynamic imports. M305-G-MOCK-01 safely reproduced `mock.module` with a synthetic `node:path` export and restoration in memory, exit 0; the expected experimental/deprecation warnings do not establish application behavior.

The analyst compared the same two candidates against correctness, current responsibility, reuse, failure truth and testability. Focused generation owners rank first: extending composition can be correct but puts substantive parser/admission/proposal responsibilities in coordinators unless it makes substantially the same extractions. This is a cohesion judgment, not a performance score. Recommended separation is generation API, fixed resolver, generation admission, action/status and proposal owners from the plan; share only descriptor snapshot and JSON equality between the two actual admissions. Stage-specific transition policy stays separate. No new dependency, durable field, provider option, registry or retry follows.

The frozen synthesis recommends exact `/api/finding-generation` POST intent with only the existing two IDs, normalized exact `application/json`, no query/fragment, inclusive 1024-byte body admission, declared-length checking and fatal UTF-8 decoding. Parser rejection precedes dispatch; post-dispatch callback failure must signal uncertainty. Default factories are selected from the validated durable context only after eligibility, exact ownership transfer and successful running publication. Startup, health, scan and ineligible actions do not construct or prepare adapters. Health shape stays unchanged; API-only construction exposes no generation route.

Admission validates detached baseline and response, exact selected native/analysis/retrieval and all remaining run/sibling content and ordering. Success requires the original validated pending proposal. Failure cannot publish a proposal. `persisted:false` permits original eligible or running last-durable state; `persisted:true` requires the selected failed generation and corresponding error. Invocation flags must agree in both directions with invocation presence, provider binding and durable equality. Timeout/shutdown may legitimately accompany `response/passed` provenance; an envelope error must not be equated blindly with invocation outcome.

**Pre-draft tuple reconciliation (E2/E3/E5):** `persisted:false` forbids invocation with null or original eligible run. A detached invocation is admitted only with selected running last-durable generation and error `generation-persistence`; `invocationPersisted` remains false. Nonpersisted authentication/quota/rate-limit/network/provider and ordinary response-validation without invocation are rejected, never interpreted as no-call. The API's exact `response-validation` / null run / `persisted:false` / `invocationPersisted:false` / `cleanupFailed:true` / no-invocation envelope is a separate unknown exception. Nonpersisted shutdown with running or null run, cleanup uncertainty and no invocation remains unknown: the service deadline may lose observed provenance. Generation-persistence without invocation proves no attempt only for the original eligible run and complete cleanup; a running snapshot without invocation remains unknown. Persisted stage failures retain the existing validator's invocation/error compatibility, including timeout/shutdown with response/passed, plus bidirectional envelope equality. Original eligible generation-persistence retains ownership even when cleanup completed. This clarification freezes a source-supported branch; it adds no research or owner-decision allowance.

App consumes an exact run-snapshot/Finding continuation and reserves a token before callback reflection. Mounted/token/run/deadline checks occur after awaits and reflection. Its 120000-ms local lifetime includes response parsing; rejection, malformed or lost response and timeout end pending presentation while retaining uncertainty and the consumed action. Local abort does not cancel the service by claim. Failed publication retains the generation guard even with complete cleanup; busy/workflow-active cannot release someone else's owner. Only a trustworthy clean terminal response releases its applicable continuation. Ordinary Analyze remains usable after local pending ends, subject to service busy/stopping rejection; a new validated run resets per-run state without fabricating ownership. Selection remains independent of the captured operation identity.

Command synthesis binds the maintained README preparation and serial scratch-qualified callers. The new API suite alone uses `--experimental-test-module-mocks`, registering both controlled factory exports before dynamically importing the real service, then proving HTTP/default resolver/shared-stage/repository integration without real credential/runtime I/O. The existing eligible adapterless missing-prerequisite test must receive an explicit controlled adapter before default dispatch changes. Normal B suites write no proof images; a separate post-Green complete generation-UI capture run uses only temporary `A11Y_M305_CAPTURE_PROOF=1`, exact environment restoration and an absent exclusive proof leaf. Later regression cannot overwrite retained captures. The bounded manual helper reuses the actual App/harness with synthetic Local eligibility, visible pending then proposal and native browser 200% zoom; no scenario controller is needed.

The exact C procedure is staged under the latest owner's instruction to resolve each applicable command before its preflight or effects. Primary must explicitly reconcile the earlier stronger pre-A wording. C's target and finite preparation are accepted in M305-C-PERMISSION-01, while final build/service/browser/run identities and genuine support remain downstream evidence. The procedure uses the existing production entry, fresh real scans and retained live owners, never seeded eligibility or the controlled-evaluation exception. A/B can pass without I9; no full task closure follows until I9 passes.

The analyst audited all I1–I10: authority/completeness and frozen-input honesty; selected-only intent and preservation; uncertainty/ownership; fixed privilege/admission limits; proposal/source distinctions and accessibility; separate real proof; cohesion/effects/closure. No owner-controlled choice blocks drafting. Reversal conditions are newly required durable fields, protected-validator/provider-lifecycle changes, incohesive proposed extraction, incompatible deadlines or exhausted authority. The complete authored artifact must contain authority/evidence identity, responsibilities, HTTP/dispatch, an admission truth table, App ownership/deadline behavior, UI matrix, complete callers/effects, staged C gates and recovery/closure. Pre-draft PASS and final review remain mandatory.

### M305-ENTRY-02 — Execution authorization and refreshed baseline

The owner explicitly authorized execution through the prescribed gates, delegated implementation, existing correction budgets, verification and documentation closure, replacing the original planning-only request. The separate C allowance is at most one explicit generation activation per provider; none is consumed. A permitted public target and finite scan/embedding preparation allowance have not been supplied. No later task or Git mutation is authorized.

Entry is clean HEAD `6b6644ba65b6ccdfd7d7a86d95f9ce87a95e8c86`, symbolic ref `refs/heads/codex/m3-05-generation-checkpoint`, with no active lease. The fixed `.env` is ignored and untracked; no secret content was read or hashed. Current runtime discovery exposes the configured custom roles and their pinned model/effort assignments. The owner selects Astra High for the primary; this turn cannot change its own runtime configuration.

Node `v24.20.0`, Python `3.12.10`, independent strict TypeScript and the three entry suites pass: 103 tests, no failures/skips/cancellations/todos. The exact caller loads the maintained README preparation block unchanged with `ScriptBlock.Create`, dot-sources it, and runs the entry commands inside `Invoke-M105Command`; its environment restoration completed. No service, browser, provider or embedding operation occurred.

The original manifest remains SHA-256 `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; all thirteen referenced bytes match their recorded SHA-256 values (hexadecimal case normalized for comparison). The forward Groq amendment remains applicable. Fingerprints use SHA-256 over LF-joined, path-sorted `path + space + lowercase SHA-256` entries without a final LF: 122 tracked source/test files `f4c486548cf7f976785076af134d6e77b2f3c27fddef37ac294e8131780b4185`; 29 tracked corpus/evaluation/workflow/skill and package/lock/TypeScript/Vite/ignore/attributes files `0ed9a13f2d5b7f4179384f8922e2423e63afacc2e86d1e0ba2041dfaebbf9882`.

The bounded primary discovery confirms the existing service continuation, both fixed adapters, pure admission validators and UI seams. Comparison candidates are frozen as extending current composition in place versus the plan's focused generation API/dispatch/admission/action/proposal owners with only demonstrated shared snapshot extraction. Criteria, I1–I10, forbidden scope and prove-later boundaries remain those of the Decision Review Contract. `M305-G-RESEARCH-01` assigns the one critical identity/ownership/attempt report while primary completes command-effect and UI reuse evidence; it is not G acceptance.

### M305-C-PERMISSION-01 — Finite target preparation authority

On 2026-09-12 the owner selected `https://docs.ollama.com/capabilities/embeddings` as a permitted non-sensitive public target and explicitly authorized exactly two scans of that target, one Local run and one Groq run, plus at most one selected-Finding retrieval per run including the existing lazy corpus embedding preparation. This supersedes the entry's missing preparation permission. Both scans, both retrieval allowances and both separately gated generation activations remain unused.

This grants no target search, alternative page, scan retry, second selected retrieval, support fabrication, model acquisition or extra generation. C still waits for accepted A/B and their reviews, the exact procedure/configuration binding, and each run's own authentic completed scan, supported retrieval and matching live service owner. A real abstention remains an abstention. The target's content may change; the permission is not an eligibility or successful-provider promise.

### M305-ENTRY-01 — Planning evidence

Observed 2026-09-12 UTC at clean HEAD `3df7bea4cad7168e4d18ab4392dad8cda22b7d9a`, 261 tracked files. This is a historical planning endpoint only. No active lease existed at `logs/agent-flow-leases/v2/active.json`. The fixed secret location was ignored/untracked; its contents were not read or hashed.

Node 24.20.0, independent strict TypeScript and the three pure suites in Concrete Steps passed: **103 tests, zero failures/skips/cancellations/todos**. No build, browser, model or provider operation was run for these entry checks. The complete 22-suite regression and client build are prior [M3-04 verification](m3-04-groq-adapter.md#m304-verification-accept-01--complete-authoritative-regression), not fresh M3-05 execution.

The original M3-01 manifest SHA-256 is `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; all thirteen referenced hashes matched. Current application/test source and workflow/authority navigation were inspected without reading credential material. No source, test, package, corpus, evaluation or executable configuration change is part of this planning checkpoint.

### M305-PLAN-REVIEW-01 — Accepted planning readiness

Fresh `critical_reviewer` reviewed the complete plan and five-document activation change, applicable authorities and actual source seams. Verdict: **PASS WITH FOLLOW-UPS**, no Blocker or Major. The sole Minor asked C to state authentic eligibility and matching live ownership separately for each newly executed provider run. Primary added that clarification without changing the existing identity-gated M3-03/C evidence-reuse exception or granting any call.

The reviewer independently reproduced HEAD, no active lease, the original manifest and thirteen reference hashes, and `git diff --check`. Its reviewed plan identity was SHA-256 `1613f4bbcd113d2c4662fe78eb387f78f2019db4d16fc5a89926c6d724d69e3e`; that identifies the pre-clarification draft, not a permanent gate. Primary accepts the nonblocking disposition and planning readiness only, not G, implementation or live proof.

Final primary documentation validation passes across all five changed documents: strict UTF-8 without BOM, final newline, no trailing whitespace, 247 local links/anchors, both PowerShell blocks parsing, all sixteen required sections, status consistency and `git diff --check`. All 258 original tracked files outside the three modified documentation files remain byte-identical; the only additions are this plan and its progress record. No active lease, source/test change, secret read, model operation, build or Git mutation occurred.

Planning changes are limited to this plan, the roadmap's current summary and M3-05 activation, the plan/progress indexes and one concise M3-05 progress record. No requirement, ADR, executable configuration, frozen input or UI behavior changes. At implementation closure, primary also reconciles materially affected README commands/capability statements, UI instructions and documentation navigation, after reading each target completely. Do not pre-update those documents to claim an unimplemented Generate flow.


### M305-DE-REVIEW-01 — Accepted amendment and final verification identity

At 2026-09-12 23:35Z, the fresh S3 critical reviewer returned **PASS**, with no Blocker, Major or Minor findings. It independently inspected the actual D/E diff, terminal receipts, immutable accepted tests, policy validation and legacy preservation, selection order/scores, persistence and generation admission, fixed helper effect bounds, responsibility placement and all four final desktop/narrow captures. It reproduced the 132-file source/test identity and checked both current and preserved builds. It performed no writes, actual calls or additional tests. Role coverage still does not establish semantic relevance or successful generation.

Primary complete regression finished with exit 0: all 25 authoritative suite files passed and four scratch roots were empty. Focused D has 73 passing tests; E has 10. Independent strict TypeScript and the final Vite build passed. The frozen source/test fingerprint is `a71442568e7e364c7ac05b09250f587502f7c2db36b4e7901f6612857399cfc6` (132 files, ordinal path order, LF-joined path/space/lowercase SHA-256, no final LF). Build SHA-256 values are index HTML `89a14303364447386ef37bd2c0a9317f26d59675a5728b695e142baa490ea184`, JS `babf503bdbb70e8277ac2be6012e25972340ab57d75dba36836547a5b632a48e`, and CSS `48ce995b24643453d9765c9530000d988080c5204aa9a945c583607ce634e86e`. The previous three-file build is retained at `temp/m305-build-pre-role`.

The original manifest and thirteen references, 332-entry managed-browser identity, six original actual run bytes and three original public proof records remain unchanged; all six historical runs pass the amended reader. Final primary checks passed: 21 PowerShell fences parse, exact 25-suite inventory, 15 changed Markdown documents with 884 local links/anchors, and `git diff --check`. No active lease or application service exists. All three new controlled retrievals and both fresh public scans/retrievals remain unused; both original eligible Generate allowances remain unused. M305-VERIFY-04 governs the next effects. Documentation impact is the accepted policy/legacy amendment and its evidence; full task closure remains pending actual C and a different integrated final review.
## Interfaces and Dependencies

### M305-F-01 — Approved bounded validation-failure diagnosis

**Local observation and diagnostic refinement:** The first new Local scan/retrieval/Generate completed once and failed with saved invocation. All envelope predicates passed, including exact local-only model identity, completion, no extensions/thinking and a parsed JSON object. The proposal probe identified only `findingSummary.prose`; it did not distinguish that field's length, emptiness or prohibited lexical pattern, so no specific wording is inferred. Both debugger and service closed normally. Before the independent Groq call, primary refined only the in-memory probe to add fixed `not-string`, `too-long`, `empty` or `prohibited-0` through `prohibited-4` codes per fixed prose field, using the existing unchanged patterns. It still emitted no text or arbitrary values and added no actual call. Local's diagnostic allowance is consumed and cannot be repeated for a finer observation. Both terminal observations are recorded below.

The owner approved the next diagnosis and new finite allowance after M305-FINAL-04. Primary bounds this new grant to one diagnostic W3C scan/retrieval/eligible Generate per provider, followed only if an evidenced correction is implemented and independently verified by at most one fresh verification scan/retrieval/eligible Generate per affected provider. Thus the ceiling is four fresh scans, four selected retrievals with existing lazy embeddings and four generation activations; no per-run retry, target change, model acquisition, fallback, frozen-input change or relaxation of proposal validation is authorized. Earlier allowances are not reset. Diagnosis starts with unchanged source/test/build identity from M305-DE-REVIEW-01. Fix scope is limited to a demonstrated interoperability/implementation defect; a policy or frozen prompt/schema change returns to its owning authority.

Initial retained-evidence and source inspection cannot distinguish transport-envelope rejection from shared proposal rejection. Use standard temporary Node debugger observation without application edits: load the maintained README service caller unchanged except replacing its exact `& $m105Node src/server/main.ts` with `& $m105Node --inspect=127.0.0.1:0 src/server/main.ts`. Keep all existing environment restoration, port-0 service and scratch checks. Bind only its printed owned loopback inspector URL, never a user browser or another process. Close the inspector before literal service stop; verify both inspector/application ports closed. The debugger alters timing, so observations confer no capacity or timing credit.

The primary's one-off in-memory Node WebSocket command uses the documented Debugger/Runtime protocol. It installs three resolved conditional breakpoints: first executable statement of `chatCandidate` in `ollama-generation-http.ts`, first executable statement of `candidateFrom` in `groq-generation-http.ts`, and the failure return in `validateProposal`. Conditions always return false and do not pause execution or modify candidates, configuration or validation. They print only fixed event names, boolean envelope predicates and fixed validator-field error codes. They never return model prose, arbitrary object keys/values, prompts, headers, credential values, URLs or filesystem content. Existing pure validator helpers classify rejected fields in memory without changing the acceptance decision. No raw provider response is retained. Commands time out after five seconds; the inspector connection closes after at most 300000 ms or literal client `stop`, removing breakpoints and disabling Debugger/Runtime. An unexpected pause is immediately resumed; diagnostic failure consumes no extra provider allowance and cannot justify retry.

Before any Generate, require all three breakpoints resolved and the inspector ready event, plus the existing authentic supported first-complete-Finding, same-owner, metadata, exact source/build/freeze and UI gates. Each provider uses a fresh owned service/tab and one Analyze, one Get guidance and one Generate at most. Read canonical runs and record normalized preservation before retrieval and generation, terminal invocation and UI truth, diagnostic flags and normal cleanup. A diagnostic result is new evidence; it does not establish the precise cause of earlier failed responses. Preserve new canonical records and only minimized diagnostic evidence in an absent ignored `temp/m305-live-proof-05` root. Read-only debugger inspection is operational verification, not a production implementation write or a new reusable helper. Any implementation follows a separate exact worker packet/lease and required review within this new scope.

References checked 2026-09-13: [Node debugger](https://nodejs.org/docs/latest-v24.x/api/debugger.html), [Chrome DevTools Debugger protocol](https://chromedevtools.github.io/devtools-protocol/tot/Debugger/), [Ollama chat API](https://docs.ollama.com/api/chat), [pinned Ollama handler](https://github.com/ollama/ollama/blob/v0.33.3/server/routes.go), and [Groq API reference](https://console.groq.com/docs/api-reference). The provider documentation does not prove what the retained failed responses contained. No diagnostic or new actual operation had executed at the initial freeze; subsequent observations below preserve the consumed allowance.

### M305-F-OBSERVATION-01 — Diagnostic proposal-field rejections

Both newly authorized diagnostic runs completed once on the unchanged W3C target and source/test/build identity. Each selected native index 0 (`color-contrast`, issue 1), obtained complete evidence and authentic supported role-selected retrieval, and attempted its configured provider once. Both saved `response-validation`, invocation `response`/`failed`, and no proposal. UI terminal announcements confirmed the attempted call and saved failure, and Generate stayed disabled.

| Mode | Canonical run / selected Finding | Terminal bytes / SHA-256 | Diagnostic result |
| --- | --- | --- | --- |
| Local | `run-0ddbc564-36ae-4fa8-8bd3-5e377c5e8994` / `b2778d08-9631-4f84-ab3c-e8a1f5911ec6` | 43046 / `bcd6ab0e44ee177b179ae62f06dfed32ef7d2f58d149341e2d906b735ba6f40f` | Envelope passed; only `findingSummary.prose` rejected. Length, empty text and prohibited wording were not distinguished. |
| Groq | `run-a6ee19e9-40c0-4069-be45-653b9e9ded00` / `1ca38fd4-4f3a-4f4e-b5c9-3c3ef061ae98` | 43098 / `41d2911611b5b29a35a2aaa456ed6b70b99b10d883edb833636a6be0531f702e` | Envelope passed; only `remediation.evidenceReferences` rejected. Array shape, membership and duplication were not distinguished. |

The Local activation ran 2026-09-13 00:05:27.236Z–00:05:41.360Z; Groq ran 00:12:11.399Z–00:12:12.645Z. These debugger-instrumented durations provide no capacity evidence. The fixed diagnostic predicates identify these new failures only; they cannot reconstruct earlier responses. No raw provider prose, arbitrary response fields or credentials were retained.

Both canonical reads pass `validateRun`. Whole-run normalization before/after retrieval is unchanged: Local `43cecf6884d84dfaf0ef04fca292912eac3cf03360cef8f4fed819dbf3260a7c`, Groq `e0fa6d94c3643cffce44f945d32b72faa9ab590e8f10921729d7f88beffa31ba`. Generation normalization is likewise unchanged: Local `f0f5f6d9b953ca04047ae96f9bc0d497b9962aafe396c32c10130197c0a5f6cd`, Groq `f21b9c97d292f725b9193c13121529e82f12ba4b92c018c240f3726348e02956`. These preserve scan, retrieval and all 34 sibling Findings. The minimized ignored proof is `temp/m305-live-proof-05/record.json`, SHA-256 `3b05920747b1e2afdb89c795607fe0cdccfc07fddb96e4e0337fdbae352e883f`.

Owned tabs 9/10 closed; debugger clients and services exited normally with exit 0. Inspector/application ports 65035/65036 and 56883/56885 are closed, the 332-entry browser runtime is unchanged, and four scratch roots are empty. Ollama remains running at the owner's request. Both diagnostic allowances are consumed: cumulative public totals are ten scans, six retrievals and four generations. The two conditional corrected-verification runs are not executable until their correction prerequisite passes; no repeat diagnosis is authorized.

### M305-F-DECISION-01 — Prompt clarification comparison contract

This bounded follow-on diagnosis prepares a concrete owner decision, not implementation or a reopened G/A/B budget. Route R2 because a possible shared prompt clarification crosses the frozen evaluation definition and needs an owner-controlled artifact. No new validator, serialization, identity scheme, state transition, egress, model, provider control or output contract is being designed. Escalate to R3 before resolving any such newly required mechanics.

Compare (a) retaining the current prompt and truthful failures, (b) versioning a shared prompt clarification that states the existing validator's prose and reference constraints, and (c) changing provider-facing schema constraints as well. Common criteria are faithfulness to existing validation, minimal change, both-provider consistency, preserved historical evidence, bounded verification and honest causal limits. Hard exclusions are loosening validation, rewriting frozen files or failed observations, sanitizing responses into success, target-specific answers, provider retries/fallback and unsupported success claims.

One `technology_researcher` inspects the exact prompt/input/validator and frozen authority to resolve missing contract instructions and required forward-version scope; at most one targeted follow-up. Primary preserves diagnostic proof and prepares the proposed artifact in parallel. R2 primary synthesis applies unless conflicting evidence or unresolved decide-now semantics triggers an analyst. No drafter is needed. A fresh `independent_reviewer` reviews the complete proposed artifact and diagnostic evidence before the owner checkpoint; one bounded correction/re-review is available. Stop dependent work if a significant authority conflict or critical mechanics require a higher route.

Invariant packet F1: all new observations remain failures with bounded causes, and earlier evidence remains unchanged. F2: any proposal preserves strict validation, current provider models/controls, canonical inputs and local/external data boundaries. F3: changed prompt bytes require new provenance and a successor frozen definition; existing versions and observations retain their meaning. F4: the artifact specifies the exact proposed scope, authority updates, remaining finite call allowance and implementation/review obligations without claiming acceptance. F5: no speculative framework or provider-specific instruction divergence is introduced. Primary supplies source evidence; the fresh reviewer checks all five. Decide now only the proposed clarification and forward-version scope; actual acceptance by models remains downstream proof. No owner question is necessary until that concrete proposal is reviewable.

**Research result and escalation:** The bounded R2 report confirms missing production instructions for exact reference locations/uniqueness/minima, empty reference arrays, prose lengths, assumption limits and lexical rejection even in negation. The original frozen instruction file already describes most of these constraints but has evaluation-specific origin text unsuitable for direct production copying. This is an evidenced instruction difference, not proof of the specific failed wording or a verified remedy. The report also establishes a critical compatibility constraint: `readProviderInvocation` admits and returns only current version constants. A simple prompt-version bump would invalidate earlier durable invocations.

Escalate this decision to R3 for that demonstrated historical-identity boundary before designing a change. The amended frozen comparison is current behavior versus shared prompt-only clarification with bounded historical admission; schema changes are excluded from this proposal because no demonstrated need justifies their broader provider-compatibility work. One `critical_researcher` report covers historical tuple admission, current-only execution and successor-definition identity; at most one targeted follow-up. A mandatory `decision_analyst` audits synthesis, followed by a fresh pre-draft `critical_research_reviewer` and a different fresh final reviewer. No drafter is needed; at most one analyst correction and one correction at each review checkpoint are available. The unneeded R2 final reviewer is replaced by these R3 checkpoints, not run additionally. New unrelated critical dimensions or repeated decisive gaps stop for reconciliation rather than more agents.

Add invariant F6: old persisted prompt identities remain exactly old, unknown or mixed version tuples fail closed, and old identities cannot authorize new provider requests. F7: the successor definition binds exact current instruction bytes with original frozen artifacts and Accepted forward amendments, without rewriting those artifacts or claiming new controlled model executions. Critical researcher supplies candidate mechanics; analyst and both reviewers cover F1–F7. The owner checkpoint remains required for the concrete forward prompt/manifest amendment. Existing F01 conditional verification limits do not expand.

**Corrected authority interpretation and active boundary:** The critical researcher's single follow-up found that [M3-02 L2](m3-02-shared-generation-stage.md#l2--runtime-artifacts-and-authenticated-selected-input) explicitly separates production constants from the six controlled evaluation bindings: runtime constants do not replace their original instruction/schema/input bytes. The earlier proposed `evaluation/m301-generation-v2.json` is withdrawn. No controlled-evaluation instruction or binding needs amendment for this production-only correction. Freeze the new runtime integration identity in this plan and its existing local proof structure; preserve the M3-01 manifest, thirteen files, all six future bindings and all Accepted amendments unchanged.

The primary's earlier fresh-owner-checkpoint restriction above rested on conflating those two instruction definitions. The evaluation authority requires honest new bindings/evidence, but does not require renewed approval for every production correction. The existing explicit approval for further implementation and F01's demonstrated-correction scope cover supplying omitted instructions for already-enforced constraints, with exact historical provenance preserved. This is primary interpretation of existing authorization, not a new owner decision or waiver. It supersedes only the extra owner checkpoint and proposed controlled-manifest change above. Existing strict validation, model/control/egress boundaries, worker ownership and finite limits remain binding. Proceed after the mandatory R3 synthesis and two fresh reviews; do not ask the owner to approve the same authorized implementation again. A newly demonstrated significant policy change or expanded budget would still require direction.

### M305-F-SYNTHESIS-01 — Runtime-only correction candidate

Mandatory R3 analyst returned **DRAFT READY**, covering F1–F7 without an unresolved owner-controlled choice. It independently checked the source boundaries and M3-02 L2 distinction; actual diagnostics are reused evidence. Retaining v1 has lower immediate effort but leaves the verified omissions. The candidate adds only current instructions and bounded historical admission; provider effectiveness remains unknown. Rollback after any v2 record must retain v2 readability. Fresh pre-draft and different final research review remain pending.

The R2 source report and critical report/follow-up confirm missing production instructions and a two-file compatibility boundary. Recommend current prompt `m302-instructions-v2`, unchanged schema `m302-schema-v1` and output contract `m301-proposal-v1`. In `generation-artifacts.ts`, preserve the existing four paragraphs and append the following two paragraphs, separated by blank LF lines and ending with one final LF. Author them from the existing validator; copy no ignored evaluation instruction text into production.

```text
Use unique exact strings from finding.facts[].reference for evidenceReferences and guidance.passages[].passageId for passageIds. Both arrays are required in each supported text field. findingSummary requires at least one evidence reference; userImpact and remediation each require at least one passage ID. Other reference arrays may be empty. Cite only identifiers that support that field's claims.

Every prose string must be nonblank and at most 1000 JavaScript UTF-16 code units before normalization, except remediation.text may contain 2000. assumptions contains zero to five nonblank strings, each at most 500 code units. Avoid words beginning with certif, conform or complian, even in negative statements: the mechanical policy rejects them. Do not state that a Finding, issue or violation is already fixed, resolved or remediated.
```

In `generation-contract.ts`, widen only durable `ProviderInvocation` version typing/admission to two exact tuples: historical `m302-instructions-v1` / `m302-schema-v1` / `m301-proposal-v1`, and current `m302-instructions-v2` / `m302-schema-v1` / `m301-proposal-v1`. Pin all historical literals independently; preserve the admitted tuple exactly instead of replacing it with current constants. Reject unknown, missing, coerced or mismatched tuple values, including evaluation-only `m301-instructions-v1`. Keep `GenerationConfiguration`, `GenerationRequest`, shared stage and both provider wire builders current-only. Existing durable/client readers reuse this boundary. No new module, migration, durable field or general version registry is required.

This corrects an evidenced instruction omission, not a proved cause of every failure or a promise of model success. Historical compatibility is a requirement of that correction, not a current data-loss claim. No bug record is opened for speculative response causes. All F1–F7 apply. Downstream proof must cover old/new tuple preservation through both-provider canonical/client admission, unknown tuple rejection, old configuration/request rejection before preparation/transport, current provenance, identical clarified system instructions, unchanged strict response validation and complete Local/Groq admission. The existing wrong-version test using the newly current v2 literal needs a genuinely invalid replacement; that belongs to the test owner.

The runtime-only freeze records exact new instruction hash, source/test/build identities and unchanged schema/controls before the two remaining affected public observations. Those each use a fresh W3C scan, authentic first-complete-Finding retrieval and one eligible Generate, under the existing owner/procedure/cleanup limits. No inspector is needed for corrected verification. A failed corrected response consumes its allowance and remains failed; no extra diagnosis or retry follows. M3-03 capacity, G1 relevance and the six M6 evaluation executions remain separate.

After mandatory analyst and separate fresh pre-draft/final review, primary opens one new bounded standard implementation slice under M3-05, with separate test/implementation owners and exact leases. Use the published slice budget: one read-only preflight, one Red/characterization, one Green and one correction loop, with only the workflow's evidenced conditional extensions; never reset A/B or F actual-call limits. Primary binds exact test paths, commands/effects and acceptance evidence before writes. Full authoritative regression, independent strict TypeScript, build, fresh S3 slice review and different integrated review precede closure. Existing visual evidence may be reused while rendered source/CSS and behavior stay unchanged; actual terminal UI observation remains required.

### M305-F-IMPLEMENT-01 — Frozen runtime correction and worker packet

**M305-F-REVIEW-01 — accepted S3 slice review:** Fresh critical reviewer returns PASS for implementation and the finite verification procedure, with no Blocker, Major or Minor. It independently reproduces 36 persisted tuple/outcome cases, 98 malformed-tuple rejections, 12 canonical and 12 client preservation cases, six current/historical wire checks, LF/CRLF prompt equivalence, the exact final 132-file identity, nine changed F paths, both current/archived builds and diagnostic proof identities. Both compliant leases and the bounded primary test correction reconcile. Matching focused/strict/build/full-suite evidence is reused. Primary accepts F1–F7 and authorizes execution of only the two already approved corrected-verification runs after create-only runtime-definition readback. Actual success and final integrated review remain pending; no G1 relevance, M3-03 capacity or controlled-evaluation credit follows.

**M305-F-REGRESSION-01 — complete verification:** The exact primary build caller verified and retained the old three-file build in `temp/m305-build-pre-prompt`, then passed independent strict and Vite build, exit 0. New `dist/client/index.html` is 414 bytes / SHA-256 `994fde28d4cd8f72b9b8571ab45f701ff97fc5bff10dfc09bc1db01bbd361ed1`; `assets/index-BJr5kfIg.js` is 274673 / `236069508fea6578f823f3dde325fdfa4def644b216de5551a0182df1eb23b88`; unchanged `assets/index-CuLtGKH2.css` is 5875 / `48ce995b24643453d9765c9530000d988080c5204aa9a945c583607ce634e86e`. The complete maintained twenty-five-suite caller passed sequentially, exit 0, including production-entry, managed-browser scanner and all three UI suites. Teardowns settled with no external requests or page errors. The 132-file identity remains `6abc2e28b2b0d5e640173b0553e16d28dc7cc93785d09fd7bd32389a00bfb3ba`; four scratch roots are empty and all 332 browser-runtime entries remain unchanged. Existing rendered visual evidence applies to unchanged UI source/CSS; live terminal UI still requires observation. Fifteen changed Markdown documents and 894 local links pass validation; 23 PowerShell fences parse and the authoritative suite inventory remains 25. Fresh S3 review is pending before actual calls.

**M305-F-GREEN-ACCEPT-01 — accepted corrected boundary:** The primary's single assertion-overload correction preserves the exact rejection behavior. Fresh execution of the complete focused caller passes all 133 tests with zero failures/skips/cancellations, and independent strict TypeScript passes, both exit 0. The corrected `tests/generation-contract.test.ts` SHA-256 is `3f3909e5cea9cafb3f76bf34dc3e4cd8e529806cd39a34e0520229871fe9023e`; the other six accepted test hashes remain unchanged. This passing revised boundary replaces prior test evidence; no fabricated new Red is claimed. Final 132-file source/test identity is `6abc2e28b2b0d5e640173b0553e16d28dc7cc93785d09fd7bd32389a00bfb3ba`. The two production hashes are artifacts `6ffb25bc4569233f06aa4a9e7feb27f0797a30be3e894b2735370cabd7c29828` and contract `e800275b85c1ebeaf89964456ad4ca89d1d795ac1143d111505455c557d4ac5f`. Actual diff inspection confirms exact prompt bytes, independently pinned historical tuple literals, unchanged current-only configuration/request types, and no validator/schema/model/control change. Cohesion RETAINED: constants and pure admission stay with their existing owners; no new edge or module. Runtime inventory is unchanged and four scratch roots are empty. Green attempt 1 and the one primary test correction are consumed; full regression/build and fresh S3 review remain before actual calls.

**M305-F-TEST-CORRECTION-01 — bounded primary correction:** Green attempt 1 changed only the two assigned production files and passed all 133 focused tests. Independent strict TypeScript exposed TS2345 at `tests/generation-contract.test.ts:114`: the three-argument `assert.throws` call supplied `undefined` where Node's types require an assertion predicate. The same-assumption search found only this occurrence. The implementation worker stopped, and lease `M305-F-green-01` closed compliant with contract digest `12452f5e6eaef94bc748c248980421ba944630d7ca48f858fa1c9b0efebaef8c` and receipt `4e41f73e3ad9ccc71e03ac54c7028be1833df4b23f678091bed5dfb830fbdbd7`. No lease is active. Primary applies the workflow's narrow test-correction exception only to that assertion, using the existing two-argument message overload while preserving its rejection requirement. This mechanical type correction requires no production change or new test contract. Prior Red/test evidence is invalidated until focused checks, independent strict and a fresh test identity are accepted; no renewed actual-call allowance follows.

**M305-F-RED-ACCEPT-01 — accepted Red:** Primary inspected the actual seven-file test diff and reproduced the 132-file source/test SHA-256 `7fe9d391677b7214fdd7ddcc25215f6bdcc04baa9f58b64e34579cd371b0f685`. The exact focused caller produced 133 tests: 124 pass and nine intended failures of the missing v2 instruction/version/admission behavior, with no skipped, cancelled or harness failures. Both providers have canonical/client historical/current admission coverage and old-execution rejection. Existing validation tests remain intact. Synthetic fixtures cleaned normally and four scratch roots are empty. Lease `M305-F-red-01` closed compliant with contract digest `aba82bd85e1bedcaf586994fcab9969afd89854023025402746ac304d7113a7b` and receipt digest `4af7f749a25ada5edb556ad6fc44c6f0839c7dc048b7483428bbb4ca006e6277`; only the seven permitted files changed. Initial Red is consumed; Green attempt 1 is next, owner `f_code`, role `code_worker`, assignment/lease `M305-F-green-01`, with the two production paths and forbidden test boundary below. The primary inserts its fresh guard digest in the coordinating packet before dispatch.

Accepted test SHA-256 boundary, unchanged throughout Green:

| Path | SHA-256 |
| --- | --- |
| `tests/generation-contract.test.ts` | `c4e9f8a0f1fae4add00fec9790e459498522b032d8320cbaa679785759a5cbfb` |
| `tests/generation-stage.test.ts` | `c5cd870b0fcf057e4a54a4520226485e851f94c813830ccd06851adcc0bee29c` |
| `tests/generation-service.test.ts` | `ba30fa4d3f5355aa5937e54f6faeb4400cfb8fa270750b4fc7de13e07415e9e3` |
| `tests/ollama-generation-contract.test.ts` | `513a81eec7df14f24e5e1a006e2d85bd3a710780bc21c39574599f9b446b43de` |
| `tests/groq-generation-contract.test.ts` | `3d89b8e41dd3f587c77a206b87cbc8f45ebc66fc0faebf06ebbbcb086bdb4844` |
| `tests/finding-generation-admission.test.ts` | `342e8e39adc5542612d4f85082d3a87b30d97848395e3e4654da1a53cddc60b5` |
| `tests/helpers/m302-generation-fixture.ts` | `c7a3761d9717cf365cef61ba8a89e54db30547faf7b02773c9102f024fa31845` |

**M305-F-PREFLIGHT-01 — accepted MISSING:** The separate test owner independently reproduced the unchanged 132-file entry identity, current 1227-byte/v1 instruction and schema hashes, and exact old tuple admission/new tuple rejection. The current-only execution gates already occupy the correct shared/provider boundaries. All necessary tests and fixture/literal updates fit the seven frozen test paths; no new helper or production owner is needed. Primary accepts this source/probe-based preflight and the specified meaningful Red outcome. No test execution or write occurred in preflight; the initial Red allowance is now the next boundary.

**Research barrier — accepted:** Mandatory analyst DRAFT READY, fresh pre-draft critical PASS and a different fresh final critical PASS cover F1–F7 without findings. Primary accepts the final artifact reviewed at SHA-256 `26bb955765942611da35cfb79b84f396304e4f708a6a5cf680a2802b62fd23c2`. Final review independently reproduced source/test and instruction/schema identities, original manifest/thirteen references/six bindings, both diagnostic run identities, minimized proof hash, absence of an active lease, syntax and the exact build caller's read-only preconditions. Its preliminary isolated-probe separator concern was invalidated by the actual caller; no correction was warranted. No requirement/ADR or frozen evaluation amendment is needed. Preflight may proceed under the existing authorization; implementation and provider benefit remain unproved.

**Exact runtime definition:** The two appended paragraphs in M305-F-SYNTHESIS-01 plus the unchanged four original paragraphs produce 2066 UTF-8 bytes with SHA-256 `50119e7af78551f7005e48fdb0f6a64f1249aa0ceb0fe0ed2a34ebc4068bba42`. The prior runtime instruction SHA-256 is `12bab6d82714ce2ad246f0f6a4fb8888e85eaa4f177f3e1f2fbb148f7893327d`. Unchanged runtime schema, serialized with `JSON.stringify(GENERATION_SCHEMA)`, has SHA-256 `014f3068a03dd2a155b43b318ebf9c4f5f2313db6159a680c9bb7efeedee4fe7`. The current tuple is `m302-instructions-v2` / `m302-schema-v1` / `m301-proposal-v1`; the one historical tuple pins all three v1-era literals independently as specified above. The runtime-only definition succeeds the previous runtime integration binding; it does not supersede any of the six controlled evaluation bindings.

Milestone Assignment Packet v2:

- **Identity:** Workflow `M3-05-20260912-01`; roadmap `M3-05`; slice `M305-F`; initial assignment `M305-F-preflight-01`; phase preflight; attempt 1; role `test_worker`; owner `f_tests`; lease, correction parent and guard digest None. Later assignments retain workflow/task/slice, replace phase/role/assignment/owner and insert their fresh lease/digest before writes.
- **Owning plan / acceptance:** This plan's F decision, synthesis and implementation sections. Requests through either fixed adapter carry the exact clarified current instruction/version. Old and new persisted tuples survive canonical/client admission unchanged; other tuples fail. Historical configuration/request versions fail before preparation/transport. Strict proposal validation, inputs, provider controls and data boundaries remain unchanged.
- **Authority anchors:** This plan's [complete M3-05 authority map](#authority-and-readiness), [roadmap Verification](../../DEVELOPMENT_ROADMAP.md#m3-05--present-integrate-and-verify-structured-generation), REQ-GEN-001–006/008–010, REQ-LLM-003–005/008/009/015/019/021, REQ-SEC-004/005/013–016, REQ-EVAL-004/005/007/008, BHV-03/04, SPEC-003/004, HS-008/009, ADR-0001/0014/0020/0021/0023/0024, and completed [M3-02 L2](m3-02-shared-generation-stage.md#l2--runtime-artifacts-and-authenticated-selected-input). No requirement, ADR or controlled-evaluation decision changes.
- **Readiness / freeze:** M3-05 In progress under its unchanged satisfied start route; all relevant Must portions Accepted. Original M3-01 manifest/thirteen references and six bindings unchanged. F entry source/test fingerprint is `a71442568e7e364c7ac05b09250f587502f7c2db36b4e7901f6612857399cfc6` for 132 files; HEAD `6b6644ba65b6ccdfd7d7a86d95f9ce87a95e8c86`; branch `codex/m3-05-generation-checkpoint`. No active lease.
- **TDD:** Applicable to version admission, current-only execution and shared request behavior. Instruction wording additionally uses exact-byte and source-to-validator semantic evidence; do not invent a failing model test. Current/preflight evidence: M305-F-OBSERVATION-01 and source evidence in F synthesis; preflight result pending. Accepted test boundary: None until Red acceptance; test owner `f_tests`.
- **Responsibility placement / dependency / reuse:** EXTEND `src/server/generation/generation-artifacts.ts`, existing source-authored constants owner, only for instruction/version. EXTEND `src/server/generation/generation-contract.ts`, existing pure types and admission owner, only for exact historical/current persisted tuple typing/reading. Configuration/request and service/client readers keep existing direction toward these shared contracts. No new runtime edge or module. No structural refactor except local type/value factoring inside that same pure reader when needed for complete tuple preservation.
- **Named uncertainties:** Actual provider benefit and fit after longer instructions remain downstream proof. Preflight must identify required fixture/literal updates; no speculative schema or response repair.
- **Risk / review:** S3 historical identity and integrity. Fresh critical slice review and different integrated critical review required. Broader identity, schema, state or output-policy changes stop for primary reconciliation.
- **Non-goals:** No proposal-validator, schema, model, parameter, endpoint, corpus, retrieval, UI, dependency, generic registry, migration, retry/fallback or controlled-evaluation change. No acquisition, actual runtime/provider operation or secret/ignored evidence access by workers; no Git writes.
- **Preflight write scope:** Allowed files/roots None; forbidden files/roots all writes. Future Red exact file envelope: `tests/generation-contract.test.ts`, `tests/generation-stage.test.ts`, `tests/generation-service.test.ts`, `tests/ollama-generation-contract.test.ts`, `tests/groq-generation-contract.test.ts`, `tests/finding-generation-admission.test.ts`, `tests/helpers/m302-generation-fixture.ts`. Allowed directory roots None. Forbidden roots `src`, `docs`, `evaluation`, `corpus`, `.codex`, `.agents`; forbidden files `README.md`, `AGENTS.md`, `PLANS.md`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`. All other endpoints remain outside scope.
- **Future Green scope:** Only the two production files above; allowed directory roots None. Forbidden roots `tests`, `docs`, `evaluation`, `corpus`, `.codex`, `.agents` and the same forbidden root files. All accepted test/helper hashes are pinned unchanged before Green.
- **Validation / cwd:** Repository root above. Read-only preflight inspects source/tests and reuses the unchanged accepted complete-suite identity; no fixture/test execution that creates files is permitted during preflight. Future Red/Green focused command is the complete F caller below; independent strict uses the maintained preparation and `node_modules/typescript/bin/tsc --project tsconfig.json`. Task-level command is the unchanged README exact twenty-five-file suite, sequentially. Expected Red: executable failures of new current prompt/version or missing current tuple admission; unrelated failures are invalid. Green must pass all focused checks and independent strict.
- **Evidence identity / environment:** Exact source/test hash above at preflight; refresh after every lease and bind accepted test hashes. Windows, PowerShell 7.6.5, Node 24.20.0, Python 3.12.10, TypeScript 7.0.2 and locked unchanged dependencies. The four scratch roots must remain empty outside their owned test lifetime; managed browser has the unchanged 332-entry inventory. Actual external state is Non-reusable except its separately pinned observation.
- **Effects / cleanup:** Focused tests use existing synthetic fixtures, intercepted transports and generation-service-owned unique temporary directories with their existing cleanup; no new helper or namespace. Strict emits nothing. Full regression uses maintained isolated scratch, managed browser and owned local test servers; no live public scan or model call. Primary build moves only verified `dist/client` to absent ordinary contained `temp/m305-build-pre-prompt`, then builds new `dist/client`; both are retained. No deletion or overwrite of historical archives. Restoration/cleanup failure stops dependent effects.
- **Budget / stops:** One read-only preflight, one initial Red and one initial Green; up to two same-chain corrections only under the workflow's rules, with attempt 3 conditional on concrete new evidence. One review correction loop. Same decisive failure twice without new evidence, two no-diff write outcomes, unleased/path drift, wrong Red, command/authority/scope change or exhausted allowance returns to primary. No worker autonomously resets budgets or runs another actual call. Focused checks at each accepted write boundary; full suite once at integration unless changed/stale evidence requires more.
- **Handoff:** Exact assignment/lease/digest, touched paths and diff intent, commands/exits and decisive results, evidence identities, outcome/risks/documentation impact; Green separately dispositions cohesion RETAINED/REFACTORED/RECONCILE. Workers are not alone in this tree and must preserve all other work. Primary alone closes guards and accepts results.

**Complete focused caller** (Red exit 1 is expected only when its detailed assertions establish the intended missing behavior; it is never automatic Red acceptance):

```powershell
$ErrorActionPreference='Stop'
$m305Readme=Get-Content -Raw README.md
$m305Prep=[regex]::Match($m305Readme,'(?s)```powershell\r?\n(\$ErrorActionPreference.*?)\r?\n```').Groups[1].Value
if(-not $m305Prep){throw 'Missing preparation'}
. ([scriptblock]::Create($m305Prep))

if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process')) { throw 'Capture flag must be absent' }
Invoke-M105Command {
  & $m105Node --test --test-concurrency=1 --test-timeout=120000 'tests/generation-contract.test.ts' 'tests/generation-stage.test.ts' 'tests/generation-service.test.ts' 'tests/ollama-generation-contract.test.ts' 'tests/groq-generation-contract.test.ts' 'tests/groq-generation.test.ts' 'tests/finding-generation-admission.test.ts'
  $m305FocusedExit = $LASTEXITCODE
  Write-Output ('M305-F focused exit: ' + $m305FocusedExit)
  if ($m305FocusedExit -ne 0) { throw 'M305-F focused tests failed; inspect expected Red or unexpected failure before continuation.' }
}
```

**Primary-only build replacement caller** (after accepted Green, before dependent production-entry/full regression; syntax and current path/hash preconditions inspected, not yet executed):

```powershell
$ErrorActionPreference='Stop'
$m305Readme=Get-Content -Raw README.md
$m305Prep=[regex]::Match($m305Readme,'(?s)```powershell\r?\n(\$ErrorActionPreference.*?)\r?\n```').Groups[1].Value
if(-not $m305Prep){throw 'Missing preparation'}
. ([scriptblock]::Create($m305Prep))

$m305Archive = Join-Path $m105Repo 'temp/m305-build-pre-prompt'
$null = Assert-M105OrdinaryPath $m105Build
$null = Assert-M105OrdinaryPath $m305Archive -AllowMissing
if (Test-Path -LiteralPath $m305Archive) { throw 'Build archive already exists' }
$m305ExpectedBuild = @{
 'index.html' = '89a14303364447386ef37bd2c0a9317f26d59675a5728b695e142baa490ea184'
 'assets/index-CuLtGKH2.css' = '48ce995b24643453d9765c9530000d988080c5204aa9a945c583607ce634e86e'
 'assets/index-DN_q2uL0.js' = 'babf503bdbb70e8277ac2be6012e25972340ab57d75dba36836547a5b632a48e'
}
$m305Files = @(Get-ChildItem -LiteralPath $m105Build -Recurse -File -Force)
if ($m305Files.Count -ne 3) { throw 'Build inventory changed' }
foreach ($m305File in $m305Files) {
 $null = Assert-M105OrdinaryPath $m305File.FullName
 $m305Relative = [IO.Path]::GetRelativePath($m105Build,$m305File.FullName).Replace('\','/')
 if (-not $m305ExpectedBuild.ContainsKey($m305Relative) -or (Get-FileHash -LiteralPath $m305File.FullName -Algorithm SHA256).Hash -ine $m305ExpectedBuild[$m305Relative]) { throw 'Build identity changed' }
}
Move-Item -LiteralPath $m105Build -Destination $m305Archive -ErrorAction Stop
Invoke-M105Command {
 & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
 if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed before build' }
 & $m105Node node_modules/vite/bin/vite.js build --configLoader native
 if ($LASTEXITCODE -ne 0) { throw 'Client build failed; preserve output and archive for triage' }
}
```

Before the remaining actual calls, primary exclusively creates absent ordinary ignored/untracked `temp/m305-live-proof-06` and a static `runtime-definition.json` binding the instruction/schema hashes above, final source/test/build identity, existing fixed providers/controls, original M3-01 identity and unchanged six bindings, and the F01 remaining two-run procedure. Readback must pass before output inspection. Each run uses the unchanged maintained README ordinary service caller without inspector, a fresh owned CUA tab, one Analyze, first complete native Finding, one authentic supported retrieval and at most one Generate; observations append only minimized `record.json` after completion. Failure or uncertainty consumes the applicable allowance. Close each owned tab/service normally, verify ports/scratch/runtime preservation, and retain Ollama. No helper implementation or actual call is authorized before its gates pass.

Recovery retains all old/new canonical and proof bytes. Do not roll back to a reader that cannot admit already-persisted v2 records. Final documentation reconciles only this owning plan, current roadmap/progress and relevant capability/navigation statements; closed M3-02 and original M3-01 artifacts remain history.

### M305-EOF-01 — Post-closure whitespace correction

Independent review of aff27e6 found one extra EOF blank line in src/client/finding-response-snapshot.ts. Primary reproduced the failure with git diff 6b6644b HEAD --check. A single guarded formatting-only setup removed exactly the final CRLF while preserving the remaining final newline and every preceding byte; the lease closed compliant and primary independently verified the one-line diff. The current file SHA-256 is 5aa4c0143a826b393333f171c5c7550cecf245186964714c0405611d2a57a39b. Earlier source fingerprints remain historical identities; executable text is unchanged, so no functional suite, browser or provider call was repeated. TDD and additional implementation review are not applicable to this S0 formatting correction.

The cumulative working-tree check, git diff 6b6644b --check, and ordinary git diff --check pass. The committed HEAD comparison still describes aff27e6 until a separate authorized commit records the fix. M3-05 remains Complete, with all existing evidence limitations preserved. Documentation impact: Updated this closure note; no requirement, command, capability, navigation or roadmap status changed.

### M305-FINAL-06 — Integrated review and task closure

The different fresh final S3 critical review returns PASS with no Blocker, Major or Minor and accepts I1–I10 and the complete M3-05 Verification, with no remaining actionable finding. Primary accepts the final source and evidence after direct diff, canonical identity and preservation checks. The reviewer independently matched both proof07 hashes, proof06 records, the exact observer text, 132 source/test files, three build artifacts, thirteen frozen references, three canonical runs, six preservation hashes and fourteen negative client-admission mutations. It reconciled 34 contract/receipt digests across seventeen compliant leases. UI actions, probe readiness and terminal cleanup retain their primary-observed evidence class; H's failure probe was not exercised. The retained F Groq success and H Local success each used a genuine completed scan, supported selected-Finding retrieval and one explicit generation action in its matching live service. Each original eleven-field proposal passes validation, is durably saved pending human review and was inspected in the UI. H's non-pausing observer supplied fixed diagnostic predicates without changing candidate data or acceptance.

The complete twenty-five-suite regression, independent strict TypeScript, build, focused tests and required browser evidence remain applicable under the exact matching F source/test/build/dependency/command identities. H changed no executable file or test environment. All write leases are terminally compliant, no lease remains active, owned services/observer/tabs closed, the protected browser runtime remains unchanged and all four runtime scratch roots are empty. Ollama remains running at the owner's request.

This closes the integration task only. The earlier five failed responses remain preserved; the successful H run did not reproduce or explain the previous Local rejection. Both original proposals retain their recorded semantic limitations and require human review. G1 informative-image relevance remains an observed limitation. M3-03 capacity, model qualification, the fixed M6 evaluation and all later product work remain separate. H's conditional corrected-verification run is unnecessary and unused; no further actual call or task is selected.

Documentation impact: Updated the capability/API/command and UI guidance, accepted retrieval-selection authorities and linked indexes, roadmap status, task progress and plan navigation. Preserved historical evidence and stable identifiers. Candidate documentation passed UTF-8, whitespace, all 895 local file/anchor links across fifteen changed documents, 23 PowerShell fences, the exact twenty-five-suite inventory and git diff --check before primary acceptance of roadmap completion. Archive relocation is complete: all 948 local links/anchors across sixteen changed Markdown documents resolve, all 23 PowerShell fences parse, the exact suite inventory remains twenty-five, and git diff --check passes. The stable filename, original historical bodies and failed evidence are preserved; only relative Markdown targets were rebased for relocation. No new requirement, schema, validator relaxation, dependency or evaluation-input change follows H. No commit, publication or push was performed.


### M305-H-01 — Approved Local-only diagnostic continuation

The owner's approval after M305-FINAL-05 authorizes continued investigation of the remaining Local validation failure. Primary bounds this new continuation to one fresh diagnostic W3C scan, one authentic selected-Finding retrieval with existing embeddings and one eligible Local Generate. Only if an evidenced correction within the existing contract is implemented and independently verified may one further fresh Local scan/retrieval/eligible Generate verify it. Ceiling: two Local scans/retrievals/generations, no repeated generation in a run, no Groq rerun, target/model/control/schema/validator relaxation or acquisition. This is new owner authority, not a reset of any earlier allowance. A significant new policy or architecture choice follows its owning route; no speculative correction is selected before diagnosis.

Reuse the reviewed M305-F-01 operational diagnostic procedure and exact v2 source/test/build/runtime identity from M305-FINAL-05. Git changes are preserved, no lease is active, and the 132-file fingerprint remains `6abc2e28b2b0d5e640173b0553e16d28dc7cc93785d09fd7bd32389a00bfb3ba`. M3-05 remains dependency-ready and In progress under its existing Accepted authority set. M3-03 capacity, G1 relevance and Groq semantic-quality limits remain separate. The bug index was consulted: BUG-0001 is a different, Verified metadata-read defect; no implementation cause for this model-output rejection is yet established.

Use the maintained README service caller with only its existing owned loopback inspector flag substitution. The in-memory WebSocket observer installs two non-pausing conditional probes, at Local `chatCandidate`'s first executable line and the final `validateProposal` failure return. It reuses the already reviewed envelope booleans and detailed prose rejection codes, adding only fixed reference-array categories (not-array, non-string, duplicates, unknown, too-many, missing-required) and fixed assumptions shape/count/prose categories. All field names and codes are authored finite literals; no candidate text, arbitrary keys/values, credentials, prompt or raw response is returned or retained. Conditions always return false and do not alter acceptance or data. Five-second command and five-minute observer limits, resolved-breakpoint/ready prerequisites, exact observer-before-service closure and direct owned-port refusal checks remain binding. Inspector timing provides no capacity credit.

Before any Generate, bind and read back absent ordinary ignored `temp/m305-live-proof-07/runtime-definition.json` to the unchanged proof06 runtime definition, current source/build identity and this finite procedure. Use the first complete native Finding in scan order, authentic supported retrieval, same service owner, current Local disclosure and pinned metadata. Primary operates the fresh owned UI once per action and captures minimized baseline/terminal normalization, canonical validation, fixed diagnostic codes and UI truth in create-only `record.json`; preserve every earlier record. A failed diagnostic does not establish the exact cause of earlier responses. If it succeeds, accept only the actual observed integration after required final review, without inventing a correction or consuming an unnecessary verification call.

No production or test write is authorized by this operational packet. A demonstrated implementation correction receives its exact existing-task worker assignment, separate test/implementation ownership, guarded leases, proportional tests and required independent review before the conditional verification. A model-quality or policy finding is reported honestly, not repaired by weakening validation or repeatedly sampling. Complete unaffected documentation and final evidence review before handoff.

### M305-H-OBSERVATION-01 — Successful Local diagnostic observation

The H runtime definition was created and read back before observation at `temp/m305-live-proof-07/runtime-definition.json`, SHA-256 `051c1fc86ff4c09260b5c3722950c4daa4e1c2fb55ffaa048a83c080d2eac1de`. It binds unchanged runtime v2, the proof06 definition, current source/test/build identities, two non-pausing probes and the Local-only grant. Observer syntax and both conditions parse; observer SHA-256 is `676625eecdaff6e9c7e09726e6dd499cb4804f8c9907b56565b141038c806231`. Both probes resolved before Generate. For final independent review, the original in-memory observer text was later transferred create-only to ordinary ignored `temp/m305-h-observer-review.txt`; its readback matches the same pre-call SHA-256. This supporting audit copy contains no provider output and is not a new execution.

Fresh run `run-b785db0b-5ed0-4baa-b62f-9be6181d5e72` completed its native scan with 35 Findings and two manual-review observations. Native Finding index 0, `50dcefee-7e74-4253-a373-c5bbf2ab839b`, received one authentic supported retrieval in the same service, preserving the original scan and siblings. Primary activated Generate once through the UI. The Local envelope passed every expected predicate, with exact local model identity, completed stop, assistant JSON object and no output extensions or thinking. No proposal-rejection event occurred.

Generation completed at 2026-09-13 01:36:56.647Z–01:37:07.838Z with invocation `m302-instructions-v2` / `m302-schema-v1` / `m301-proposal-v1`, unchanged Local parameters, `response` and validation `passed`. Canonical terminal read passes `validateRun`; the original eleven-field proposal is saved pending review. The run is 45196 bytes, SHA-256 `df21550331a276095d3d5780eec301d88285af2f91fcc4414a37848a830726aa`. Whole-run retrieval normalization remains `ab161f69e8cf2971b60795115993a660cf97fb3f50ea8edc00a8470b9c3441a9`; generation normalization remains `b85a715501c216bc9931904e954e24e710f3ddc06f89907f0fb586171281b428`, preserving scan, supported retrieval and all 34 sibling Findings.

The UI showed immutable Local disclosure, pending uncertainty, then a saved original proposal with all eleven fields and inspectable citations. Generate remained disabled and focused; the shared announcement accurately states the attempted call and saved proposal. Uncertainty and assumptions are present, but blocking manual judgment contains the string `false`, which does not establish that human judgment is complete or unnecessary. Suggested size/weight remediation wording also requires human review. Preserve this original output and the independent Groq semantic limitations; mechanical integration success is not model-quality endorsement.

The new run succeeded without any source, test, prompt, model, schema or control change. Its run/Finding identities differ from earlier input, so this is not an identical-input replay or proof of repeatability. The prior Local rejection was not reproduced; its precise cause remains unknown. No new bug is declared Verified and no speculative corrective implementation follows. Inspector timing gives no M3-03 capacity credit.

Owned tab 13 closed, observer and service accepted literal `stop` and exited normally with exit 0. Direct connection probes return ConnectionRefused for inspector port 52520 and application port 52522. Four scratch roots are empty, all 332 browser-runtime entries and the 132-file source/test fingerprint remain unchanged, and Ollama is retained. Minimized create-only proof07 `record.json` has SHA-256 `48c00071b8cf5df1b76140774a78dcf30d81e782433817e8a8d55343574254d6`.

H consumes one scan, one retrieval and one Generate; its conditional corrected-verification run is unused and unnecessary. Cumulative public totals are thirteen/nine/seven, comprising five failed responses and two mechanically validated proposals. Retained proof06 Groq and proof07 Local establish the two actual eligible integration paths under the same runtime/source/build contract. Final review must confirm I1–I10 and the unchanged roadmap Verification; task completion remains pending that review and documentation closure. Reuse the exact matching F focused, strict/build and twenty-five-suite evidence: H changed no executable file, accepted test boundary, dependency, command or isolated test environment, and all runtime scratch is reconciled. No new model invocation or redundant regression is needed merely because this observation arrived in another turn.

### M305-FINAL-05 — Accepted corrected checkpoint and documentation handoff

The different fresh integrated S3 critical reviewer returns PASS for the incomplete checkpoint with no Blocker, Major or Minor. It independently verifies the final 132-file fingerprint, all three build artifacts, exact runtime instruction/schema identities, runtime-definition/proof06 hashes, original manifest/thirteen references, both canonical runs and whole-run preservation of scan, retrieval and 34 siblings. F lease contract/receipt digests reconcile with the authorized production changes, the single primary test assertion correction and five documentation updates. No active lease exists. It reuses the matching F compatibility reproduction, focused tests, independent strict, complete twenty-five-suite regression, build, visual evidence and primary terminal UI/cleanup observations.

Primary accepts I1–I8 and I10 for this checkpoint. I9 remains unfulfilled because Local has no validated proposal. Groq proves one mechanically validated, durably saved and visibly presented original proposal, with the recorded semantic limitations and human review still pending. No model-quality, capacity, release or task-completion claim follows. M3-05 remains In progress and this ExecPlan is not archived. All finite actual allowances remain exhausted.

Documentation impact: Updated the owning plan, roadmap current status/checkpoint, README capability summary, active-plan index and task progress record. F requires no requirement, ADR, frozen-evaluation, configuration or command amendment; earlier D/E authority updates remain preserved. Fifteen changed Markdown documents and 894 local links/anchors pass; all 23 PowerShell fences parse, the authoritative inventory remains 25 suites, and `git diff --check` passes. Direct connection probes confirm both owned ports refuse connections; no lease or owned application service/tab remains, and pinned Ollama is retained. Further work requires a separately bounded Local diagnosis or correction scope, without rewriting failed evidence or resetting consumed budgets.

### M305-F-OBSERVATION-02 — Corrected Local failure and Groq proposal

After accepted F implementation and fresh critical slice PASS, primary created and read back `temp/m305-live-proof-06/runtime-definition.json`, SHA-256 `c48ba696ceadf6b29cd05c340375e977448f88e00da2b926c01af1299a48af56`, before either corrected observation. It binds the exact v2 runtime instructions, unchanged schema/output and fixed provider controls, final 132-file source/test and three-file build identities, original M3-01/thirteen references/six bindings, and the two remaining no-retry procedures. The first ordinary service precheck was denied Windows process metadata access by the sandbox before service start or any scan. The same reviewed caller succeeded with reviewed escalation; no application change or actual allowance was consumed by that precheck.

Both fresh W3C runs completed with 35 Findings and two manual-review observations. Primary selected native Finding index 0, Color contrast issue 1, through each owned UI and retrieved authentic supported guidance once in the same service. The three retrieved roles remained relevant to the contrast issue. Each explicit Generate used the expected v2 tuple and unchanged provider parameters, with no inspector, fallback, retry or raw failed-response capture.

| Mode | Canonical run / selected Finding | Terminal bytes / SHA-256 | Actual outcome |
| --- | --- | --- | --- |
| Local | `run-939a54b9-e179-4367-9a30-33e7859a087f` / `c21e34f8-3d27-4aa9-85bc-df154cdd3b70` | 43046 / `8c139b92a7a877b5e70183b91c15a5b02160182855576af75b702da89c732d84` | Saved `response-validation` failure; response received, validation failed, no proposal. |
| Groq | `run-d4d06856-39d7-4196-b607-8e2f2815b302` / `f0a4f4ff-5beb-4676-9055-0ea763523e70` | 45148 / `61eb5b6fccc59083850ea147838a1049ab42090e75fc82a607c5874663d5960b` | Saved completed generation and original eleven-field proposal; response validation passed, pending human review. |

Local generation ran 2026-09-13 01:09:28.110Z–01:09:41.685Z; Groq ran 01:11:59.722Z–01:12:00.760Z. These are integration observations, not a complete M3-03 capacity sample. No more specific cause is available for the corrected Local rejection, and earlier diagnostic field codes do not establish this response's cause.

Both canonical terminal reads pass `validateRun`. Whole-run retrieval normalization remains Local `5e49704b6930233f68fe43d6c08ba6f216e6caa61004108a69972d49bbd4a54e`, Groq `880285bf47372ec88c5564ee8184398cebec679513ac9f766b59809f3ac25090`. Generation normalization remains Local `2bb3b74bb25ccdf09443e92f8a421d699a8ae6b4a56ce8255274dc0f43a0440c`, Groq `45cd4c7de72b4eebb4bc431f4944c06913cc5ab45b0579b92d16438a09872047`. Scan, supported retrieval and all 34 sibling Findings are preserved.

The UI showed each immutable provider disclosure, pending attempt uncertainty, then the matching saved terminal result with Generate disabled and focus retained. Groq's original proposal displayed all eleven fields and inspectable supporting references, separate from scanner evidence and source guidance. Mechanical validation is not semantic endorsement: its uncertainty and blocking-manual-judgment fields assert no concern despite required human assessment, and its proposed replacement color examples are unverified. Preserve the original output pending human review; do not sanitize it, claim review completion or count it as release-quality evidence.

Owned tabs 11/12 closed; literal `stop` ended both services normally with exit 0 and `service-stopped`. Ports 57320/51221 are closed; four scratch roots are empty and the 332-entry browser runtime is unchanged. Ollama remains running. The minimized create-only `record.json` under proof06 has SHA-256 `b91d49c7150c0da462aad0777f0ddb000d42219f8a0744fe381a9b564e28ad9b`. Runtime definition, canonical records and earlier proof bytes are retained.

All four F scans/retrievals/generations are consumed, including the two earlier diagnostics. Cumulative public totals are twelve scans, eight retrievals and six generations: five failed responses and one mechanically valid Groq proposal. F is accepted implementation with bounded actual observations; it did not resolve Local output validity. I9 and full M3-05 completion remain unfulfilled. Different integrated review and documentation handoff are next; further diagnosis or actual calls need a new concrete bounded scope. No budget reset, new task, commit or push follows.

### M305-FINAL-04 — Accepted amended checkpoint and incomplete handoff

The different fresh integrated S3 critical reviewer returned **PASS for the incomplete checkpoint and truthful failed observations only**, with no remaining concrete documentation, semantic or integrity finding. It independently reproduced the 132-file source/test fingerprint and all 137 prepared source/test/build/corpus hashes plus package configuration. All three controlled runs validate and match their receipts, original seed/query and whole-aggregate preservation; their actual gold results remain 1/3, 3/3 and 3/3. Both public runs validate, match the exact proof hashes, select native Finding index 0, preserve all 34 siblings, and reproduce both recorded normalization hashes. The original six public runs and three proof hashes, M3-01 manifest and all thirteen references remain unchanged. Proof roots/public runs are ordinary, ignored and untracked; four scratch roots are empty and no lease is active.

The reviewer reused accepted focused/full-suite, strict/build and visual evidence and primary actual UI/literal-stop observations. It performed no test rerun, live call, browser operation or write. Passing review accepts the implementation and accurate limits; it cannot substitute for the missing validated proposals. Primary accepts this handoff without marking M3-05 Complete or archiving its plan. M3-03 capacity remains independent and no later task is selected.

Documentation impact is reconciled in the owning plan, roadmap, README capability limits, active-plan summary and task progress record, with the previously accepted requirement/ADR/evaluation/UI selection amendment preserved. Final closure checks pass across 15 changed Markdown documents and 886 local links/anchors; all 21 PowerShell fences parse, the authoritative inventory remains 25 suites, and `git diff --check` passes. No executable configuration, corpus, frozen evaluation, model or secret change follows. Both actual generation allowances are exhausted. The next separate scope must establish why response validation rejected the outputs before any correction or newly authorized actual rerun; retained evidence alone does not reveal the precise cause.

### M305-C-OBSERVATION-04 — Actual Local and Groq response-validation failures

The two fresh owner-authorized W3C runs each completed one native scan with 35 Findings and two manual-review observations. The first complete native violation was Color contrast issue 1: measured 3.88:1 against required 4.5:1. Primary selected that card through the owned browser UI, activated Get guidance once, verified complete evidence and supported suitable contrast guidance with the new marker, then activated Generate once in the same live service. No retry or fallback occurred.

| Mode | Canonical run / selected Finding | Actual generation outcome |
| --- | --- | --- |
| Local | `run-37a57137-8a44-47da-8f0b-6652c1f63329` / `d2b9e011-4246-46b6-a19b-800340f4c71b` | 23:39:14.254Z–23:39:30.574Z; Ollama qwen3.5:4b was attempted; response validation failed; failed generation and invocation saved; no proposal. |
| Groq | `run-0db8cc86-57aa-46d8-8d1e-d71eb2c04fd1` / `7027428a-9758-4416-8efa-fe4c19460918` | 23:41:16.343Z–23:41:17.357Z; Groq openai/gpt-oss-20b was attempted; response validation failed; failed generation and invocation saved; no proposal. |

Both exact reads pass `validateRun`. Each selected generation has status `failed`, error `response-validation`, invocation outcome `response` and validation `failed`. UI pending/terminal announcements and detail matched those durable fields, including explicit attempted-call and saved-failure statements. Generate remained consumed/disabled. The original prompt/schema/output-contract and fixed adapter parameters remain unchanged. This proves actual provider invocation and truthful failure integration, not successful I9 or a validated proposal.

Both authentic retrievals selected G18 remediation 0.5096829257075763, threshold-measurement interpretation 0.5016003654533153 and SC1.4.3 criterion 0.47792865673287177. Selected-only preservation compares the entire normalized aggregate: retrieval normalization preserved Local `a67c2eb5e0f404d2f2e30813c8eba7c60c8fdbebae8dd5fa8762c898b4efe39b` and Groq `e53fa840d473c043fe3c8990e847dfbbcaa18915d4355ea05fbe5320a3606c30`; generation normalization preserved Local `2aacc612da769cba0bf162f4269d50c78efb01a046b2aba6272ddc466afee375` and Groq `af6bca52429270157fc50284775733e77ef2afd86755f65f2f62e1e545733799`. All 34 sibling Findings, native scan, retrieval and provider context were preserved across the applicable operation.

Final canonical bytes/hash are Local 43046 / `548599c6958beba6467cceefb15ae4e4cab969033cf4050c973cf812bb20820c`, Groq 43098 / `b4ac735576dcc5b3ba4172b7bcdedd9c65892918002b3759db1ff275d806f280`. The exclusive ignored minimal proof is `temp/m305-live-proof-04/record.json`, SHA-256 `f8ab503b0a52712c67334f0f2251726057a1306e83216d700303a9aa7ac93183`; actual `run.json` remains the sole canonical result. Raw page/provider bodies and credentials were not copied to tracked content.

Owned tabs 7 and 8 were closed. Each service received literal `stop`, emitted `service-stopped` and exited 0 with caller environment restoration. Ports 64163 and 52249 reject connections; all four scratch roots are empty and the 332-entry managed-browser identity is unchanged. Owner-requested Ollama PID 11180 remains running. No active lease exists.

All two new scans/retrievals and both original Generate activations are consumed. Existing bounded code maps both incomplete/malformed transport output and rejected proposal candidates to this error; the retained invocation does not distinguish those causes. Read-only inspection therefore cannot establish the precise rejected field or whether the cause is provider output or an integration defect. Do not weaken validation, manufacture a successful proposal, retry, or add raw-response capture under this finite grant. A separately scoped diagnosis and any further actual-call allowance are the next owner boundary. M3-05 remains incomplete; no capacity, qualification or M6 credit follows.

### M305-D-OBSERVATION-01 — Three actual controlled retrievals

The single exclusive preparation and G1, G2 and G3 each ran once under M305-VERIFY-04, with terminal exit 0 and unchanged prepared source/test/build/corpus/configuration identities. Each receipt records exactly one seeded Analyze response and one actual guidance request. All canonical runs pass `validateRun`, match their evidence copies and contain the approved selection marker. Context/browser/service/ports/scratch cleanup passed; `apiClosed:false` is expected for these cases without a separate API owner. The 332-entry managed runtime remains unchanged and all four scratch roots are empty. Exact model request counts remain uninstrumented; only the frozen source-derived bounds apply. No public scan or Generate occurred in these cases.

| Case | Ordered actual passages and cosine scores | Gold relevance result |
| --- | --- | --- |
| G1, informative image | h67-ignored-image 0.5111375808580503; wcag22-sc111 0.48338010884526506; understanding111-decoration 0.44174079489543194 | One of three matches. H67 and decorative-image interpretation are unsuitable for the informative-image gold case: relevance failure despite complete role coverage. |
| G2, form label | understanding412-intent 0.3886159586729352; h44-explicit-label 0.37651744701792195; wcag22-sc412 0.2940149620440013 | Three of three match the unchanged gold and are suitable for the recorded missing-name condition. |
| G3, contrast | g18-contrast-remediation 0.5096829257075763; understanding143-threshold-measurement 0.5016003654533153; wcag22-sc143 0.47792865673287177 | Three of three match the unchanged gold and are suitable for the recorded below-threshold contrast condition. |

All three durable support states are `supported` and selected states `active`; this does not erase G1's relevance failure. Primary separately triaged G1 before continuing the unaffected G2 and G3. Their completed observations are accepted as evidence, not universal retrieval quality or generation evaluation. All three actual retrieval allowances are consumed. Original gold and prior observations remain unchanged.

Retained roots are `temp/m305-retrieval-role-proof/g1`, `g2` and `g3`, including seed, run, receipt and desktop capture. Canonical SHA-256 values respectively are `2e065c3b4dc4c63e5c1bf367857741dc97356fc19f70c2ba1193e229bcea6f14`, `5f9b149f4fae2b1dcdd1b0b0a53307afe7363f144fc87e2eeb7491809ee34ce0` and `1c16c3b4d3ad3bc59e041a26bf7cf89a007f72cb5f5a700bc5322d19714720d4`. Receipt hashes respectively are `ddcd26f8c7cfaf92c6b718af615a0860842d341636d9b7aaf990272b4b82bfbb`, `ba935fbd975c3d996e49014871183ba75961f1967b4a285cf9a8db9058973100` and `d026c2ade0ba07f6ffd60ecf7498de681794cdf40b5a2af206aea36ee6314760`. Primary inspected all three captures and the structured gold/support/cleanup evidence.

Fresh read-only Ollama metadata passes the existing exact generation validator: runtime 0.33.3, pinned qwen3.5:4b digest and Q4_K_M. The two independent fresh W3C public integrations may proceed under M305-VERIFY-04; their own first complete Finding must obtain authentic suitable guidance before its single Generate. No G1 result is used for generation.

The existing service-owned `generateFinding` and `GenerationServiceOutcome` are the integration seam. Both existing adapters implement the same `GenerationAdapter`; the shared stage remains the sole proposal validator/attempt authority, and the repository remains the sole durable update owner. The browser sends only selected run/Finding intent and accepts only a strictly validated matching outcome.

The planned HTTP route and client callback do not expose injection seams. Pure client admission may reuse existing safe runtime validators but cannot import privileged adapter, credential, filesystem or process modules. React composes the current evidence/guidance regions with two focused generation/proposal owners. No package, new aggregate schema, provider registry or product workflow engine is needed.

## Revision Note

2026-09-13 / primary: Accepted the successful H Local observation without another code change, different fresh final S3 PASS for I1–I10 and the documentation gate. Marked M3-05 Complete and archived its plan, preserving all failed evidence, pending human review and separate capacity/relevance limits. No further actual call, later task or Git mutation is selected.

2026-09-12 / primary: Completed all three approved actual controlled retrievals and both fresh public integrations. Preserved G1 relevance failure and both saved provider response-validation failures without retry. Accepted different integrated critical review and documentation closure for an incomplete handoff; all actual allowances are exhausted, Ollama remains running, and successful generation/task completion remains unproved.

2026-09-12 / primary: Executed the approved D/E amendment through separate test and implementation owners and compliant terminal leases. Accepted complete regression, strict/build/visual evidence and fresh critical review. Bound the final source/build identity before the finite actual retrieval and public integration checks; no new actual allowance is consumed at this checkpoint.

2026-09-12 / primary: Completed the separately approved retained-evidence investigation and prepared the highest-per-required-role selection proposal. One bounded researcher and fresh independent R2 final review passed without findings. Preserved existing policy, source, evidence and all consumed budgets; the concrete selection amendment and combined implementation/verification grant remain Proposed for the owner.

2026-09-12 / primary: Executed the third finite public-demo preparation and preserved its two actual retrieval abstentions, selected-only evidence identity and normal owned cleanup. Both top-three results omit criterion guidance. Six scans and the third grant's two retrieval allowances are consumed; no Generate occurred and successful live verification remains unfulfilled. Preserved existing implementation, correction budgets and prior proof.

2026-09-12 / primary: Bound the owner's second target/two-scan grant, completed both real scans without an eligible Finding, preserved all earlier evidence, accepted the independent second evidence supplement and renewed documentation closure. Four scans are consumed across two grants; no retrieval, embedding or Generate has occurred, and M3-05 remains incomplete.

2026-09-12 / primary: Resumed the unchanged checkpoint, accepted the different integrated review, started the retained Ollama runtime at the owner's explicit request and completed both permitted real scans. Neither produced an automated Finding, so no retrieval/embedding/Generate occurred. Accepted the independent evidence supplement and documentation closure, retained Ollama and both canonical runs, and left C/task completion unfulfilled with both scan allowances consumed.

2026-09-12 / primary: Accepted G and delegated A/B execution with preserved correction history, full controlled verification, corrected fresh slice reviews and qualified owner-observed native zoom/cleanup evidence. Froze finite C, recorded the unavailable runtime without consuming an allowance, reconciled capability/status/commands, and saved the owner's safe-pause resumption point. No real scan, retrieval, embedding or generation occurred; task completion remains pending.

2026-09-12 / primary: Recorded explicit execution authorization, refreshed baseline and entry verification, preserved all unconsumed real-operation allowances, and entered the bounded G research route. No application behavior changed.

2026-09-12 / primary: Created the M3-05 planning-only ExecPlan after current-state review. Preserved the owner-amended dependency start, M3-03 capacity blocker, M3-04 Groq byte-policy amendment, real-retrieval requirement, independent test/implementation ownership and visual-only manual verification. Bounded the future work to G, two implementation slices and separate actual-call proof; corrected stale roadmap summaries without changing completion authority.

2026-09-12 / primary: Accepted independent planning-readiness PASS WITH FOLLOW-UPS, resolved its per-provider-run live-owner clarification, and reconciled progress and documentation evidence. No binding G literal or execution authority was added.
