# Present and verify explicit generation for one Finding

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Owner:** [M3-05 — Present, integrate, and verify structured generation](../DEVELOPMENT_ROADMAP.md#m3-05--present-integrate-and-verify-structured-generation), In progress for planning only.
- **Authorization:** The owner requested current-state review and this plan. No implementation, provider/embedding operation, public scan, credential inspection/configuration, acquisition, commit, or later task is authorized by that request.
- **Latest barrier:** [M305-ENTRY-01](#m305-entry-01--planning-evidence) confirms the amended start prerequisites, unchanged frozen generation inputs, independent strict TypeScript and 103 focused passing tests. [M305-PLAN-REVIEW-01](#m305-plan-review-01--accepted-planning-readiness) accepts planning readiness after independent PASS WITH FOLLOW-UPS and the primary's clarification of per-run live ownership.
- **Remaining gates:** Execution authorization, [G contract and command freeze](#g--freeze-only-the-integration-contract), separate A/B implementation and reviews, and [C real integration](#c--bounded-real-integration-and-closure). No authentic supported live retrieval input has been established. M3-03/C remains Blocked independently.
- **Allowances:** No G research, A/B worker, C activation, or implementation-review allowance has been consumed. [Budgets](#ownership-budgets-and-evidence) govern future execution; planning review does not consume those allowances.
- **Active lease:** None. Primary documentation writes occur between leases.
- **Next action:** Await an explicit execution request. On execution, refresh the actual endpoint and enter G before test preflight. Use [commands](#concrete-steps), [invariants](#validation-and-acceptance), and [recovery](#idempotence-and-recovery). Historical Git hashes are evidence, never permanent execution gates.

## Progress

- [x] (2026-09-12 01:40Z) Reviewed current status, M3-03/M3-04 handoffs, authorities, frozen definition, current source/test seams and rendered-UI reuse.
- [x] (2026-09-12 01:42Z) Independent strict TypeScript and 103 pure tests passed; original generation manifest and thirteen references match.
- [x] (2026-09-12 01:45Z) Authored the planning-only M3-05 contract and bounded G/A/B/C sequence.
- [x] (2026-09-12 01:54Z) Fresh critical planning review returned PASS WITH FOLLOW-UPS, with no Blocker/Major; primary resolved its per-run eligibility clarification. Documentation validation passes as recorded in M305-PLAN-REVIEW-01.
- [ ] Obtain execution authorization and accept G, including exact commands before preflight or effects.
- [ ] Accept A: service-owned adapter selection, loopback generation and client response admission.
- [ ] Accept B: explicit Generate, truthful status and accessible proposal detail.
- [ ] Accept C: one real eligible Local call and one real eligible Groq call, or record the precise unfulfilled prerequisites without claiming completion.
- [ ] Pass complete regression, fresh integrated review, cleanup and task-closure documentation gate; archive only after roadmap Verification passes.

## Surprises & Discoveries

- The roadmap's opening summary still called M3-04 unfinished although its task row and [final closure](completed/m3-04-groq-adapter.md#m304-final-01--integrated-review-and-documentation-closure) establish Complete. This plan's activation corrects only those stale current summaries, preserving historical checkpoints.
- The existing [service continuation](../../src/server/local-service/generation-operation.ts) already owns generation persistence and cleanup, but [service startup](../../src/server/service.ts) exposes neither a browser Generate route nor default real-adapter dispatch. [App](../../src/client/App.tsx) has no Generate callback.
- App's retained-owner flag is deliberately sticky after supported retrieval or uncertain cleanup. Merely adding a button behind the existing busy/owner guard would block valid continuation; blindly clearing that flag would permit unsafe overlap. G must distinguish continuation eligibility from uncertain operation ownership without adding a second lifecycle.
- [FindingOutcome](../../src/client/components/results/FindingOutcome.tsx) labels every failed Finding “Guidance failed” and otherwise advertises supported eligibility. Generation failures and terminal proposals need narrowly corrected presentation.
- M2-04's three actual gold-profile results all abstained because a required guidance role was missing. The [controlled-input exception](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception) applies only to the six fixed M6-02 evaluations, not this task's real integration or M3-03 capacity. It cannot supply a fabricated production RetrievalResult.
- Groq now uses the owner-accepted 65536-byte serialized-body policy, not proof of complete hosted token fit. Its [forward evaluation amendment](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#groq-admission-amendment-to-the-frozen-generation-definition) leaves original manifest bytes unchanged. Do not revive M3-04's superseded accounting blocker.

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

Planning readiness is accepted; application behavior is unchanged. The current system has real scanning, durable evidence, closed-corpus retrieval and deterministic abstention, plus controlled verification of shared generation and both fixed adapters. It has no user-facing generation or verified live generation. A/B may establish an implementation/interface checkpoint without satisfying C. No M4 task is selected by this plan.

## Purpose / Big Picture

A user with one genuinely eligible selected Finding should explicitly activate Generate, see which immutable provider/model will be used, and inspect either one validated cited proposal or a truthful bounded failure. Scanner evidence, retrieved guidance, AI interpretation, confidence, uncertainty and required human judgment remain distinct. Scan, selection and insufficient guidance never invoke a generation provider.

A reviewer observes this through the existing loopback UI, selected-only durable readback, deterministic adverse cases and one real eligible call through each provider. Controlled tests prove boundary behavior; they do not prove live retrieval eligibility, provider availability, model capacity, semantic support or release suitability.

## Context and Orientation

### Authority and readiness

Start with the [authority map and task router](../README.md), [requirement semantics](../PROJECT_REQUIREMENTS.md), and the exact roadmap row. The following links resolve its complete selected authority set; identifier ranges are inclusive.

| Authority | Applicable contract |
| --- | --- |
| [Evidence and review workflow](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals) | REQ-GEN-001–006 and 008–010: eligible selected-only generation, proposal validation, provenance, no-call abstention, source distinctions |
| [Provider execution](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md#llm-provider-selection-and-generation-execution) | REQ-LLM-001, 003–005, 007–009, 011, 015, 016, 019, 021: fixed modes, attempt-time prerequisites, admission, no retry/fallback |
| [Privacy and security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security) | REQ-SEC-004, 005, 013–016: service-only provider authority, disclosure, secret exclusion and minimized egress |
| [Application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#accessibility-of-a11y-evidence-lab) | REQ-A11Y-001–004 and 010; REQ-A11Y-006 supplies the visual-only manual verification method |
| [Evaluation behavior](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope), [SPEC](../specs/SPEC.feature), [HARD_SPEC](../specs/HARD_SPEC.feature) | BHV-03/04, SPEC-003/004, HS-008/009, including the current Groq admission amendment |
| [Provider boundary ADR-0001](../architecture/decisions/ADR-0001-interchangeable-generation-providers.md), [React ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), [Groq ADR-0014](../architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) | Existing fixed provider-neutral service and unprivileged UI boundaries |
| [Setup ADR-0020](../architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md), [aggregate ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md), [Local ADR-0023](../architecture/decisions/ADR-0023-local-mode-data-boundary.md) | Attempt-time checks, one run.json, application-owned Local data flow |
| [TDD ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md), [implementation workflow](../../.codex/execplan-implementation-workflow.md), [lease guard](../../.codex/write-lease-guard.md) | Independent owners, sequential writes, proportional validation and closure |
| [Analyze/Results contract](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md), [UI hierarchy](../ui/README.md), [visual foundations](../ui/VISUAL_FOUNDATIONS.md), [frontend-quality skill](../../.agents/skills/frontend-quality/SKILL.md) | Preserve accepted shell, evidence-first hierarchy and accessible states |

Applicable Must portions are Accepted; unrelated Proposed/Deferred portions remain excluded. Completed M3-01/M3-02, accepted M3-03 A/B, Complete M3-04 and passed M2-02 retrieval capacity satisfy the amended start route. M3-03/C remains its own unfinished full-stack capacity gate. M6-02's exactly-six evaluation, model qualification and M4 review are not selected.

The original [M3-01 manifest](../../evaluation/m301-generation-v1.json) and thirteen references remain immutable; bind the accepted Groq-only forward amendment with that identity before affected output inspection. No controlled evaluation package replaces live retrieval in C. Significant authority changes require their existing owner route rather than plan-only invention.

### Current modules and terms

`PageAnalysisRun` is the service-owned aggregate; its provider context is immutable configuration, not proof of a call. A Finding is one scanner result with its own nested workflow. A ScannerReviewObservation is not generation-eligible. `supported` means complete required guidance roles without unresolved conflict, not model confidence.

[generateFinding](../../src/server/local-service/generation-operation.ts) already reserves one exact selected owner, saves running generation, executes the [shared stage](../../src/server/generation/generation-stage.ts), and saves a proposal or bounded failure. On failed publication, [GenerationServiceOutcome](../../src/server/local-service/contracts.ts) can carry an unpersisted invocation separately from the last durable run. The browser must not hide that attempt, invent its durability, or describe unknown transport results as confirmed no-call.

[createOllamaGenerationAdapter](../../src/server/generation/ollama-generation.ts) and [createGroqGenerationAdapter](../../src/server/generation/groq-generation.ts) already implement the accepted fixed boundaries. Local uses exact token accounting; Groq uses `m304-groq-request-bytes-v1`, inclusive 65536 UTF-8 body bytes and the separately checked 4096-token completion ceiling. Successful byte admission does not prove hosted fit or complete input consumption. Credentials remain exclusively in the existing ignored service-side mechanism.

[App](../../src/client/App.tsx) coordinates selection and shared announcements; [ResultsSection](../../src/client/components/results/ResultsSection.tsx) and [ResultDetail](../../src/client/components/results/ResultDetail.tsx) compose focused regions. [FindingGuidance](../../src/client/components/results/FindingGuidance.tsx) owns retrieval, [GuidancePassages](../../src/client/components/results/GuidancePassages.tsx) owns complete citations/notices, and [finding-guidance-admission](../../src/client/finding-guidance-admission.ts) demonstrates detached, identity-bound browser admission. These existing seams guide reuse, not a generic workflow controller.

## Scope and Non-Goals

Implement explicit selected-Finding generation over same-origin HTTP, service-owned selection of the two existing adapters, strict selected-only browser response admission, generation status/disclosure and complete validated proposal presentation. Preserve native scan, retrieval, siblings and prior run data.

Do not add packages, change models/endpoints/accounting, alter the corpus/ranking/finite query domain, rewrite frozen files, relax proposal validation, add credentials to browser/config examples, or introduce streaming, retries, fallback, cancellation controls, provider registries, queues, chat, combined proposals, review actions, comparison, retained-run navigation, telemetry or a new test platform. No new durable fields or child files are expected; a demonstrated need returns to G and the controlling authority. Preserve approved existing runtime/models/dependency trees and unrelated ignored material.

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

No authentic eligible input is established at planning. The known M2-04 inputs must continue to abstain. The M3-01 exception cannot bypass this blocker, and changing retrieval, selecting alternative models, broad target search, or inventing support requires new authority. M3-03/C additionally needs its required reviewer interface: an M3-05 Local integration observation is not automatically that full capacity proof.

After accepted A/B, record an honest implementation/interface checkpoint even if C remains Blocked. The amended M4-01 start condition may then be satisfied, but the owner must separately select M4-01; M3-05 and M3-03 remain incomplete until their own Verification passes.

### Ownership, budgets and evidence

Use [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2) and the canonical lease commands; do not duplicate their schemas or create a new workflow tool. Set workflow identity `M3-05-20260912-01`, slices A/B, exact caller/effect paths and forbidden boundaries before preflight.

Each slice has one read-only preflight, one coherent Red/characterization and one Green. Each unchanged role/phase chain permits initial attempt plus one ordinary correction and at most one justified final correction, subject to the workflow's stricter repeated-failure/no-diff stops and one review correction loop. IDs, agent replacements, interruptions and clarification never reset budgets. Every write turn gets a fresh primary-opened/terminally closed lease and returned digest; only one is active per worktree. Workers cannot edit docs or perform Git mutations.

Accept actual diffs, meaningful Red, unchanged accepted tests in Green, independent strict checking, compliant terminal receipts and `RETAINED`/`REFACTORED`/`RECONCILE` cohesion evidence separately. Existing covered behavior receives no fabricated Red. Missing first modules use only ADR-0024's narrow exception. A safe read-only preflight cannot start services/create fixture output; effectful commands wait for the prepared lease.

Reuse evidence only if exact command, cwd, relevant source/test/protected-input identity, environment and guard-backed no-drift state match. Mutable browser, filesystem/runtime/provider observations are non-reusable unless isolated identity/state is pinned. Focused checks occur at slices; complete current authoritative suite at final integration, not after every document edit. A different fresh critical reviewer covers integrated cross-slice risks; do not blindly rerun all already-fresh tests.

## Decision Review Contract

**Identity:** `M305-G-01`; M3-05; R3 because browser-to-service identity, at-most-one generation and truthful recovery/provenance contain security/concurrency mechanics not yet frozen. **Status:** Not run; no recommendation or literal acceptance yet. Target artifact is the authored G contract inside this plan, not a new ADR or generic design document.

**Decide now at G:** Minimal request/response ownership, fixed default dispatch placement, browser admission/uncertainty semantics, focus and command/effect boundaries. **Prove later:** Implemented behavior, real eligibility/provider success, accessibility rendering and exact capacity coverage. Do not downgrade a proof obligation into an assumption.

Allow one bounded primary discovery pass. Then freeze feasible placement candidates and evidence gaps before comparing them: extending existing focused seams versus the bounded purpose-named modules above. Hard gates are the selected authorities, unchanged eligibility/egress/attempt semantics, no browser privilege, original frozen bytes, complete command effect coverage, and YAGNI. Judge by correctness, smallest current responsibility, reuse, failure truth and testability; no speculative performance scores or artificial third option.

One `critical_researcher` report covers the coherent identity/ownership/attempt boundary, with at most one targeted follow-up. Primary supplies local source facts and UI reuse evidence. If a genuinely independent critical dimension cannot be covered within this bounded assignment, stop and reconcile the capsule before expanding research; do not silently add a panel. One mandatory `decision_analyst` synthesis plus one bounded correction returns DRAFT READY, RETURN FOR RESEARCH or OWNER DIRECTION. DRAFT READY requires fresh `critical_research_reviewer` pre-draft PASS before primary authors binding literals; a different fresh instance reviews the complete authored contract. No drafter is needed. Allow one pre-draft correction and at most two final-artifact correction cycles under the canonical stops.

Review all invariants below, including artifact completeness, evidence honesty and authority-state consistency, at each applicable complete R3 checkpoint. Security/data-flow choices outside existing Accepted authority require owner approval; literal acceptance does not grant new calls, broaden scope or waive permissions. Record report/synthesis/review identities, decisive sources, outcomes and unresolved items in this plan, not a separate ledger.

## Concrete Steps

All commands run in PowerShell 7 from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Use the complete current [README command preparation](../../README.md#development-command-preparation); its historic M105 variable names are intentional. Do not replay archived task procedures or clean generated output speculatively.

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

### Future command slots — not yet executable authority

G must replace every applicable unresolved slot with exact values and the complete caller before A preflight or any associated effect. Merely naming a function or copying a historical helper is insufficient.

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

The following cumulative packet binds requirement coverage to observable evidence. G records expected results and reviewers; A/B/C later append exact evidence IDs, results and review dispositions. Current status for every implementation invariant is **Pending**.

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

### M305-ENTRY-01 — Planning evidence

Observed 2026-09-12 UTC at clean HEAD `3df7bea4cad7168e4d18ab4392dad8cda22b7d9a`, 261 tracked files. This is a historical planning endpoint only. No active lease existed at `logs/agent-flow-leases/v2/active.json`. The fixed secret location was ignored/untracked; its contents were not read or hashed.

Node 24.20.0, independent strict TypeScript and the three pure suites in Concrete Steps passed: **103 tests, zero failures/skips/cancellations/todos**. No build, browser, model or provider operation was run for these entry checks. The complete 22-suite regression and client build are prior [M3-04 verification](completed/m3-04-groq-adapter.md#m304-verification-accept-01--complete-authoritative-regression), not fresh M3-05 execution.

The original M3-01 manifest SHA-256 is `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`; all thirteen referenced hashes matched. Current application/test source and workflow/authority navigation were inspected without reading credential material. No source, test, package, corpus, evaluation or executable configuration change is part of this planning checkpoint.

### M305-PLAN-REVIEW-01 — Accepted planning readiness

Fresh `critical_reviewer` reviewed the complete plan and five-document activation change, applicable authorities and actual source seams. Verdict: **PASS WITH FOLLOW-UPS**, no Blocker or Major. The sole Minor asked C to state authentic eligibility and matching live ownership separately for each newly executed provider run. Primary added that clarification without changing the existing identity-gated M3-03/C evidence-reuse exception or granting any call.

The reviewer independently reproduced HEAD, no active lease, the original manifest and thirteen reference hashes, and `git diff --check`. Its reviewed plan identity was SHA-256 `1613f4bbcd113d2c4662fe78eb387f78f2019db4d16fc5a89926c6d724d69e3e`; that identifies the pre-clarification draft, not a permanent gate. Primary accepts the nonblocking disposition and planning readiness only, not G, implementation or live proof.

Final primary documentation validation passes across all five changed documents: strict UTF-8 without BOM, final newline, no trailing whitespace, 247 local links/anchors, both PowerShell blocks parsing, all sixteen required sections, status consistency and `git diff --check`. All 258 original tracked files outside the three modified documentation files remain byte-identical; the only additions are this plan and its progress record. No active lease, source/test change, secret read, model operation, build or Git mutation occurred.

Planning changes are limited to this plan, the roadmap's current summary and M3-05 activation, the plan/progress indexes and one concise M3-05 progress record. No requirement, ADR, executable configuration, frozen input or UI behavior changes. At implementation closure, primary also reconciles materially affected README commands/capability statements, UI instructions and documentation navigation, after reading each target completely. Do not pre-update those documents to claim an unimplemented Generate flow.

## Interfaces and Dependencies

The existing service-owned `generateFinding` and `GenerationServiceOutcome` are the integration seam. Both existing adapters implement the same `GenerationAdapter`; the shared stage remains the sole proposal validator/attempt authority, and the repository remains the sole durable update owner. The browser sends only selected run/Finding intent and accepts only a strictly validated matching outcome.

The planned HTTP route and client callback do not expose injection seams. Pure client admission may reuse existing safe runtime validators but cannot import privileged adapter, credential, filesystem or process modules. React composes the current evidence/guidance regions with two focused generation/proposal owners. No package, new aggregate schema, provider registry or product workflow engine is needed.

## Revision Note

2026-09-12 / primary: Created the M3-05 planning-only ExecPlan after current-state review. Preserved the owner-amended dependency start, M3-03 capacity blocker, M3-04 Groq byte-policy amendment, real-retrieval requirement, independent test/implementation ownership and visual-only manual verification. Bounded the future work to G, two implementation slices and separate actual-call proof; corrected stale roadmap summaries without changing completion authority.

2026-09-12 / primary: Accepted independent planning-readiness PASS WITH FOLLOW-UPS, resolved its per-provider-run live-owner clarification, and reconciled progress and documentation evidence. No binding G literal or execution authority was added.
