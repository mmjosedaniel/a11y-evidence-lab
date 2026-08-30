# Freeze the RD-003 scan evaluation boundary

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

- **Owning task:** [RD-003 — Freeze the walking-skeleton evaluation boundary](../DEVELOPMENT_ROADMAP.md#rd-003--freeze-the-walking-skeleton-evaluation-boundary).
- **Canonical status:** Blocked during the owner-requested reproducibility corrections after network acquisition was denied. The roadmap, not this plan, owns status.
- **Authorization:** The project owner explicitly authorized execution of RD-003 on 2026-08-30 (UTC), including its bounded research, guarded setup, observation, review, and closure stages. M1 remains unselected.
- **Current barrier:** Checkout verification passed, but the single guarded clean-start attempt stopped on socket-access denial before downloading Node. The lease is closed compliantly; the two empty task directories are preserved. Network permission and a bounded retry/empty-directory cleanup allowance are required before another attempt. Setup acceptance, implementation reviews, cleanup, and renewed closure remain pending; M1-01 remains unselected.

## Progress

- [x] (2026-08-30 02:02Z) Reviewed the current repository and RD-003 authority route. Baseline `f16c6f0` contains completed RD-002; the initial worktree was clean on `codex/rd-003-scan-evaluation-boundary`.
- [x] (2026-08-30 02:02Z) Confirmed explicit owner selection, completed dependency RD-002, Accepted applicable requirements/decisions, and the distinction between entry gates and task-owned literals.
- [x] (2026-08-30 02:02Z) Created this plan and synchronized RD-003 planning activation; no fixture, manifest, dependency, or application implementation was added.
- [x] (2026-08-30 02:14Z) Fresh planning-artifact review `RD003-PLAN-REVIEW-001` passed with no findings; primary accepted proportional documentation/configuration/negative-scope validation in `RD003-PLAN-VALIDATION-001` below.
- [x] (2026-08-30) Received execution authorization; rechecked HEAD `f16c6f0`, the nine existing changed/new planning documents, Accepted authorities, completed RD-002, and no active lease. Global runtime mismatch and unavailable matching cached browser require bounded task-local provisioning; no setup has run.
- [x] (2026-08-30) Accepted the bounded research and static-validation evidence, and the terminal analyst disposition `OWNER DIRECTION`. Recorded the cleanup-visibility blocker without changing the rejected command or resetting any budget; execution is stopped before drafting/setup.
- [x] (2026-08-30) Received owner allowance for exactly one additional cleanup-contract correction and analyst recheck. Fresh source/configuration hashes, prerequisite identities, HEAD, existing changes, absent task directory, and no active lease remain verified. No other budget or checkpoint changes.
- [x] (2026-08-30) Completed bounded research, `DRAFT READY` synthesis, and the fresh pre-draft checkpoint. Primary accepted `RD003-PREDRAFT-001`, corrected its stale summary sentence, and froze the supported outline for literal manifest authoring; no setup is authorized yet.
- [x] (2026-08-30) Primary authored the versioned manifest, verified its literal readback, and accepted the different fresh final artifact review `RD003-LITERAL-REVIEW-001` with no findings. The command/evidence contract is ready for guarded setup.
- [x] (2026-08-30) Closed and inspected the first setup lease after bootstrap failed at dependency inspection. Accepted only the bounded failure, actual downloaded-runtime identities, unchanged files, and preservation evidence; no fixture/native success or setup acceptance. Command correction requires owner direction.
- [x] (2026-08-30) Received the bounded command-correction/reuse authorization. Rechecked preserved identities and recorded procedure 002 plus the corrected compile-cache inventory; fresh R3 correction review is pending.
- [x] (2026-08-30 04:26Z) Accepted resumed setup after compliant closure/actual inspection and observed all six native states once with required same-target positives, complete coverage, and normal browser closes. No scan correction or repeat batch.
- [x] (2026-08-30) Accepted S3 slice review PASS WITH FOLLOW-UPS; clarified historical snapshots and added the material revision note. No fixture, manifest, or native evidence correction.
- [x] (2026-08-30 05:04Z) Accepted integrated review and resolved its documentation-only follow-up; completed exact task-local cleanup, roadmap Verification, and the documentation gate. RD-003 is Complete; this same plan is archived and M1-01 remains unselected.

- [x] (2026-08-30 14:05Z) Accepted and reproduced the two external reproducibility findings; owner selected their bounded correction and RD-003 was reopened. Original native evidence is preserved.
- [x] (2026-08-30) Accepted complete procedure-003 artifact review PASS WITH FOLLOW-UPS and resolved both Minor wording findings without changing any command or binding contract.
- [x] (2026-08-30 14:23Z) Accepted the exact LF policy and passing checkout verification, then recorded the clean-start network-permission failure. Terminal lease closure and primary structural/source/inventory inspection passed; no acquisition or setup success is claimed.
- [ ] Receive a bounded network-enabled retry/empty-directory cleanup allowance, verify clean-start acquisition, and complete slice/integrated reviews, cleanup, and renewed documentation closure.

## Surprises & Discoveries

- RD-002 is no longer merely planned. Commit `f16c6f0` establishes its toolchain, and its [completed plan](completed/rd-002-minimum-development-toolchain-literals.md#closure-candidate-and-verification-mapping) preserves accepted restoration, strict-checking, harness, and review evidence. The older no-manifest baseline must not be reused.
- The current host reports Node `24.18.0` and npm `11.16.0`, while `package.json` requires Node `24.20.0` and npm `11.19.0`. RD-002's temporary verification distribution was removed. This is an execution prerequisite, not a reason to undo its completion or block plan creation.
- Installed Playwright/axe metadata agrees with the lock. The Playwright browser catalog names Chromium revision `1234`, browser version `151.0.7922.34`; this proves only catalog identity, not an installed executable, successful launch, or fixture compatibility. Exact executable/profile selection and observation remain RD-003 work.
- No `src`, `tests`, `fixtures`, or `evaluation` directory exists at activation. There is no application scan module to reuse yet. The Proposed assessment's eventual shared-module harness cannot be implemented here by silently pulling M1-01 or M1-03 forward.
- This checkout uses CRLF in the four unchanged toolchain files. Their in-memory LF-normalized hashes match RD-002's archived hashes, but the current raw hashes differ. `git diff` confirms unchanged repository content; this does not satisfy byte/environment-bound evidence reuse. Capture fresh checkout fingerprints before execution instead of copying historical ones.
- A successful Windows process query need not expose every executable path. The proposed cleanup filter drops unavailable paths, which cannot clear forced-stop cleanup uncertainty. `RD003-SYNTHESIS-002` identified this remaining static defect after the analyst correction allowance was exhausted; no process leak or runtime failure was observed.

- The frozen bootstrap tried to load `@axe-core/playwright/package.json` through Node package exports. Installed `@axe-core/playwright` exports only its root entry, so Node returned `ERR_PACKAGE_PATH_NOT_EXPORTED` after successful acquisition. Static syntax and source review had not established that exact command compatibility. At that historical bootstrap stop, the primary read-only filesystem-metadata substitution passed but was not yet an accepted replacement command. The later owner-authorized procedure 002, fresh review, and accepted resumed setup below supersede that barrier.

- Read-only Git checkout filters at f34cc5d change all six frozen fixture files and the manifest from LF to CRLF despite matching current contents. The removed task directory also makes CMD-RESUME unusable; the original acquisition command retains its known export error. These are reproducibility defects missed by the original closure checks, not evidence that the six recorded native outcomes were false.

## Decision Log

- Decision: Activate only RD-003 for planning, with RD-002 preserved as Complete and every application task still Not started.
  Rationale: The owner's exact-task request and completed prerequisite satisfy task selection; requesting a plan is not an instruction to run its later setup.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Keep one compact manifest, six logical fixture states, and a bounded direct native observation procedure; do not create a second scanner implementation or evaluation platform.
  Rationale: RD-003 freezes inputs and evidence literals. M1 owns application contracts and runtime behavior. The manifest can later be consumed by the actual shared scan/evidence modules without speculative interfaces now.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Route later evidence-literal selection as R3 for the named privacy/security dimension, not for an invented identity or serialization system.
  Rationale: Choosing the exact native-field and locator projection determines which page-derived values may cross the durable evidence boundary. Accepted exclusions remain binding, but their exact safe implementation literals are unresolved. Use the workflow's critical route only for that dimension; ordinary browser metadata does not justify another critical investigation.
  Date/Author: 2026-08-30 / primary coordinator.
- Decision: Use `TDD: Not applicable` for static fixture preparation and bounded external scanner observations; keep the manifest and all evidence/developer documentation primary-owned.
  Rationale: ADR-0024 explicitly permits this route where there is no production behavior. A fabricated failing product test, worker-owned selection artifact, or permanent vacuous harness would add no valid evidence.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Stop at the terminal synthesis barrier and record RD-003 as Blocked without changing the rejected cleanup command or resetting role budgets.
  Rationale: The analyst returned `OWNER DIRECTION` for an unresolved acceptance condition after its sole correction. Explicit execution authorization includes the plan's stopping rules; it does not grant another analyst pass. The original downstream gates remain required after a bounded owner allowance.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Stop automatic continuation at the bootstrap-command boundary, retain acquired task-local files, and request a bounded correction instead of changing the frozen command under a worker correction lease.
  Rationale: Exact commands are binding under RD003-DRC-001 and the owner explicitly required a stop on changed binding contracts. The one worker handoff contains no fixture diff; its remaining same-contract correction allowance cannot authorize changed command/precondition semantics. No budget is reset.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Apply the owner-authorized procedure correction without changing the manifest, selection conclusion, scan semantics, or original budgets.
  Rationale: Filesystem metadata reads fix the observed export error; preserved acquisition can be reverified without another install. Fresh full R3 artifact review and a fresh rescoped worker preserve the changed-command barrier.
  Date/Author: 2026-08-30 / primary coordinator.

- Decision: Reopen the same RD-003 plan for only the owner-requested checkout policy and clean-start corrections; preserve original results and budgets.
  Rationale: Standard LF attributes and the already supported filesystem metadata read repair verified reproduction gaps without changing scan inputs, evidence semantics, or M1 scope. The revised literal artifact receives fresh full review before guarded setup.
  Date/Author: 2026-08-30 / primary coordinator.

## Outcomes & Retrospective

Current correction status: RD-003 is Blocked. Procedure 003 below owns the current reproduction entry point. Its exact LF policy passed all 21 checkout-filter comparisons, but the clean-start attempt stopped at the first Node download because socket access was denied. The single worker turn is consumed; no acquisition/typecheck success, implementation review, cleanup, or renewed closure is claimed. Two empty task directories are preserved. The following original execution history and all native evidence remain preserved.

Planning is complete and independently reviewed. Owner-authorized execution re-established readiness and completed the bounded research plus the analyst's one correction pass. The analyst returned `OWNER DIRECTION`: the proposed post-termination process check can mistake unavailable executable paths for absence of owned processes. This is a static acceptance-contract defect, not an observed leak. The owner subsequently authorized one additional cleanup-contract correction and analyst recheck, preserving every other budget and checkpoint. Outline 003 makes the process inventory diagnostic and never promotes forced-stop cleanup from unverified. The analyst recheck returned `DRAFT READY`; the fresh pre-draft reviewer then returned `PASS WITH FOLLOW-UPS` for one stale summary sentence, corrected here. The primary authored the versioned manifest from that conclusion; the separate final literal-artifact review passed with no findings. The first guarded bootstrap acquired the pinned runtime/browser but failed at its package-metadata inspection expression. Primary closed the lease compliantly, inspected unchanged non-ignored endpoints and generated files, and confirmed the narrow diagnostic correction without editing the frozen command. The owner has now authorized that bounded correction and reuse. Procedure 002 corrects metadata inspection and accounts for the existing npm compile cache; fresh complete-artifact review precedes one rescoped setup turn. The resumed setup then passed the selected-runtime strict compiler check, exact fixture authoring, and structural validation. Primary closed its lease compliantly, inspected actual files, and observed all six native states once: every intended failing violation and corrected same-target pass met the frozen contract, with no incomplete and normal browser closes. S3 review passed with one documentation follow-up, now resolved. The different fresh integrated review also passed with a documentation-only follow-up, now resolved. Exact task-local cleanup and final Verification/documentation checks passed. RD-003 is Complete and this plan is archived; M1-01 is dependency-ready but unselected. No application behavior or release qualification is claimed.

## Purpose / Big Picture

RD-003 supplies the smallest reproducible scan contract needed before M1-01 can define application records and M1-03 can implement the real scanner. Success is observable as one versioned manifest, exactly three failing/corrected fixture pairs, a recorded matching managed-browser/rule profile, and content-safe native observations showing each intended failing target and corrected same target under that profile.

This is a bounded evaluation baseline. It proves neither product behavior, general scanner correctness, empirical repeatability, accessibility conformance, hostile-page safety, nor release support. M1 must later exercise these inputs through its real application modules. Retrieval gold passages and generation packages are frozen by their later owning tasks, not here.

## Context and Orientation

Start from [the authority map](../README.md), [roadmap](../DEVELOPMENT_ROADMAP.md), [requirements index](../PROJECT_REQUIREMENTS.md), [agent workflow](../../.codex/README.md), [worker workflow](../../.codex/execplan-implementation-workflow.md), and [lease guard](../../.codex/write-lease-guard.md). They control this plan's interpretation and execution.

### Current project state

RD-001 and RD-002 are Complete. At activation there are 94 tracked files, no pending user diff, and no active lease. `package.json`, the sole `package-lock.json`, strict `tsconfig.json`, and minimal `vite.config.ts` exist. Direct scanner dependencies are Playwright `1.62.1` and `@axe-core/playwright` `4.13.0`; the lock resolves Playwright core `1.62.1` and axe-core `4.13.0`. Node `24.20.0`, npm `11.19.0`, and TypeScript `7.0.2` are the selected development prerequisites. React/Vite exist as future application tooling, not as a running UI.

The existing `typecheck` script independently invokes the strict compiler; `test:focused` invokes `node --test`. No product test is retained. `start` and `build` name future application operations whose entry files do not exist; do not run them as current acceptance checks. Do not replace the package pins, introduce another runner, regenerate the lock, or treat global Node/npm as the selected environment.

### Applicable authorities and readiness

| Authority | RD-003 obligation |
| --- | --- |
| [Roadmap RD-003](../DEVELOPMENT_ROADMAP.md#rd-003--freeze-the-walking-skeleton-evaluation-boundary) | Completed RD-002 is the only task dependency; freeze scan/evidence literals before M1-01, not application behavior. |
| [OD-003, OD-009, OD-021, OD-024](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#resolved-decisions-for-the-first-portfolio-slice) | Exactly three failing/corrected pairs; compact non-promotable evaluation; trusted-input runtime boundary remains separate; accepted minimization and positive-observation semantics. All directly applicable portions are Accepted. |
| [REQ-SCAN-002, REQ-SCAN-004, REQ-SCAN-005](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning) | Freeze versioned inputs/profiles; retain only required native controlled evidence; allowlist and sanitize before persistence; preserve items with missing/invalid/withheld fact reasons. |
| [REQ-EVID-002, REQ-EVID-008–REQ-EVID-011](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance) | Controlled scenario, rule, revision/state role, stable target key, native category, minimized facts and provenance; no raw archives, general pass collections, or extra product identities. Locator is supporting evidence, not identity. |
| [REQ-EVAL-004, REQ-EVAL-005 and freeze boundary](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) | Bind observations to exact applicable configuration; changes produce new versions/evidence. Exact literals are resolved inside RD-003, not missing entry approvals. |
| [Accepted controlled profiles](../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#scope) | Image alternative, explicit email-input label association, and normal-text contrast retain their exact accepted rule/SC mapping and manual-judgment limitations. |
| [ADR-0008](../architecture/decisions/ADR-0008-playwright-as-initial-browser-automation.md), [ADR-0009](../architecture/decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md), [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) | Matching managed Chromium, fresh non-persistent context, finite readiness/navigation bounds and cleanup; exactly three rules over the top-level rendered document with frames excluded; one observation per frozen state, not formal repetitions. |
| [REQ-SEC-002, REQ-SEC-007](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security) | No secrets or form values in evidence/diagnostics; only authored synthetic or separately approved minimized material is publishable. |
| [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) | Explicit non-TDD route, bounded worker ownership and automatic leases, proportional evidence and reviews. |

The [controlled-fixture assessment](../architecture/candidates/authorized-scan/CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md) and [evidence-capture assessment](../architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) are Proposed inputs only. Their candidate layout, viewport, values, field spellings, and eventual shared-module implementation are not accepted by association. [Local feasibility](../LOCAL_MVP_FEASIBILITY.md) supplies the reference-machine context, not a proven application-capacity result.

[BHV-01](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope), `SPEC-001`, `HS-001`, `HS-004`, and `HS-006` explain downstream scan/evidence boundaries in the [derived specifications](../specs/README.md). RD-003 supports those later tasks; it does not execute their public-URL, persistence, interface, or all-node runtime scenarios or change their specified/not-executed status.

### Required six-state contract

| Profile | Failing state | Corrected state and required proof |
| --- | --- | --- |
| `informative-image-alt` / `image-alt` / SC 1.1.1 | One intended informative `img` lacks `alt`. | Same target/context with an authored appropriate alternative; native same-target non-failing observation, not just absence from violations. Image purpose/wording quality remain evaluation gold and manual judgment. |
| `form-input-label` / `label` / SC 4.1.2 | Visible “Email address” text beside one stable email input without association or another accessible-name source. | Visible explicit `label` associated by matching `for` and unchanged input `id`; native same-target non-failing observation. Never retain the input value or claim SC 1.3.1/3.3.2 coverage. |
| `text-contrast` / `color-contrast` / SC 1.4.3 | One normal-text target fails the native contrast check. | Same target with corrected contrast and native non-failing observation. Preserve emitted foreground/background, measured/expected ratio, font size and weight when present and valid; never recompute a pass or substitute fixture expectations for scanner measurements. |

There are six logical states, not six applications. Each scan uses all three rules; its expected assertion names the intended rule and target. Coverage facts may summarize all three rules without retaining page-wide pass/inapplicable node collections. Keep actual native `incomplete` observations distinct; do not manufacture one by adding a seventh fixture. The existing [comparison-only contrast vector](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#comparison-only-contrast-policy-vector) remains non-scanner policy input for M5, not a third contrast scan or new RD-003 behavior.

## Scope and Non-Goals

Resolve only the six static synthetic contents, physical layout, stable fixture keys/revision labels, exact managed browser/profile, readiness condition, finite timeout, exact three-rule/options profile, locator representation, and three minimized evidence allowlists. Record each retained field's native source, permitted transformation, validity/bound, missing-value disposition, and whether it is source evidence or evaluation-only metadata. Retain one evidence-policy version per scan profile/run-level provenance, not independently versioned evidence children.

Produce one compact versioned manifest that references the exact authored content and contains these literals and expected native outcomes. Keep accepted observations in this plan unless a distinct required artifact cannot remain coherent there; do not add a report system. A small, exact evaluation-only command may directly use the pinned libraries to observe fixtures while no application module exists. Do not retain a second scanner, normalizer, public-URL intake, run schema, or runtime fixture selector.

Excluded: application `src`, product tests and runtime contracts, public-page smoke scans, M1 behavior, extra fixture families or state variants, external fixture assets, authentication or existing-browser sessions, crawling/interaction, provider calls, models, corpus acquisition, gold passages, prompts, generation/output/rubric selection, comparison implementation, repeated benchmarks, dependency upgrades, schema/validation frameworks, custom identity/serialization/integrity systems, release tooling, or hostile-target containment. Ordinary content fingerprints for workflow evidence are not a new product digest contract.

## Plan of Work

### 1. Re-establish readiness and freeze the literal decision contract

After owner authorization to execute, the primary rechecks status, completed RD-002 evidence, the selected toolchain, and any intervening authority changes. Reuse existing dependencies and documented source evidence where fresh. Do not change the host's global runtime. Confirm a developer-provided exact Node/npm installation or freeze a bounded task-local provisioning procedure before any setup; browser acquisition is likewise developer evaluation setup, not an application installer.

Use the Decision Review Contract below. At most one non-ranking discovery pass may identify exact pinned-source/API questions and viable ordinary content-loading/profile options. Then freeze the candidate set, evidence dimensions, hard gates, and invariants before comparative research. Do not compare browsers, scanners, package managers, or providers already fixed by RD-002/ADRs. A new durable architectural choice stops for its authority rather than being disguised as a literal.

### 2. Primary authors and freezes the scan manifest

After `DRAFT READY` and the required critical pre-draft checkpoint, the primary records exact choices, primary-source links, source-to-retained-field mappings, the complete command/side-effect inventory, and a versioned manifest. This is an authoritative research-derived selection artifact, even if represented as JSON; no worker owns it. The manifest freezes expected outcomes and content definitions before native case execution. Referenced fixture files may be created by the next lease, but their intended literal content is already fixed and reviewable here or in the manifest.

A different fresh `critical_research_reviewer` reviews the complete literal artifact, source evidence, command inventory, and full invariant packet. A passing checkpoint permits the primary to prepare the setup packet, not to claim an observed pass. If a required measurement, native positive result, iframe-exclusion option, or safe locator mapping cannot be supported, resolve it before setup; do not defer its meaning for the worker to invent.

### 3. One guarded fixture and native-observation setup slice

Work-slice ID `RD003-SETUP-01` is internal to RD-003, not another roadmap task. `TDD: Not applicable`: this slice creates authored static evaluation inputs and records external native observations, with no production behavior. Use one `code_worker` for phase `setup`; no test-worker preflight, Red, frontend overlay, or Green is fabricated. If the proposed probe grows into product behavior or a reusable scanner subsystem, stop and return to the owning M1 boundary instead.

The observable contract is six logical states in the enumerated files matching the frozen manifest, clean synthetic content, complete exact-three-rule execution under the frozen profile, the intended violation/non-failing target observations, required minimized measurements or truthful missing-fact reasons, and cleanup. Each frozen state runs once at provider-independent frequency. Do not schedule another six-run batch merely to label it independent verification; reviewers inspect the exact command, files, isolated environment identity, and minimized observations, rerunning only stale, missing, contradictory, changed, or risk-critical evidence under the workflow rule.

Risk is S3 for the native-to-persisted evidence boundary. Use a fresh `critical_reviewer` for this slice. It does not expand scope into hostile-URL testing or formal privacy qualification. The primary inspects the actual worktree and validates accepted results; a worker report or compliant receipt is not proof by itself.

The setup worker runs CMD-BOOTSTRAP, CMD-FIXTURE, and CMD-VALIDATE only. After its terminal compliant lease and primary diff inspection, the primary runs the unchanged CMD-SCAN directly once per state, inspects its minimized stdout, and records evidence. This is one setup slice and one native batch; no worker-owned evidence file or repeat scan is introduced.

Before dispatch, issue a complete [Milestone Assignment Packet v2](../../.codex/execplan-implementation-workflow.md#milestone-assignment-packet-v2), with every binding field and the exact commands below resolved. Primary opens the guard, inserts and verifies its digest, then authorizes writing. Close terminally after the worker stops; require fresh `closed-compliant` and no post-close drift at acceptance before primary documentation edits.

Path ownership is deliberately narrow:

| Owner | Scope |
| --- | --- |
| `code_worker` | Only the exact enumerated static fixture files and, if necessary, a small authored local synthetic image asset fixed by the manifest. No broad root permission. The expected default is a frozen in-memory/CLI observation command, with no persistent probe source file. |
| Primary between leases | This ExecPlan, versioned evaluation manifest, all accepted observed-evidence records, README/developer instructions, roadmap/status/index/progress documents, and any indispensable `.gitignore` maintenance. |
| Forbidden to the worker | Manifest/evidence files; all documentation; `src`, product tests, `.codex`, `.agents`, `AGENTS.md`, `PLANS.md`, `.gitignore`, existing package/lock/TypeScript/Vite files, and every other non-ignored path outside the enumerated fixture list. All Git mutations remain prohibited. |
| Outside guard proof | Only expressly named ignored dependency/cache/browser/runtime/temporary locations and process/network side effects from the frozen command contract. They are not guard `allow` or `forbid` paths. Unnamed generated side effects stop work. |

The six exact filenames are specified in RD003-OUTLINE-003. Before the lease, project those files into the four literal guard path lists; reject ignored scope arguments and overlapping ownership. Do not give the worker “existing development instructions,” the manifest, or permission to select fields, commands, browser identity, expected outcomes, or side effects. A new script file or dependency need changes the packet and requires primary reconciliation before writing, not a worker improvisation.

Budget: one setup write turn and at most one supported same-contract attempt-2 correction with a fresh packet/lease naming its terminal attempt-1 parent. Stop on the same decisive failure twice, two no-diff write handoffs, exhausted budget, an unexpected overlapping change, missing prerequisite, changed binding field, or failed guard. A changed frozen fixture/profile requires a new manifest version and affected evidence, not a same-contract expectation edit or a reset correction allowance. No parallel writers or background worker continues between leases.

### 4. Accept evidence and close only the owning task

After terminal lease acceptance, the primary records content-safe observed native results separately from expected outcomes, including failures and missing facts, without editing the frozen expectation to match an output. Inspect fixture relevance, absence of excluded artifacts, unchanged dependency pins, evidence minimization, and cleanup. Complete the slice review and then a different fresh risk-routed integrated reviewer; use `critical_reviewer` while the selected evidence/privacy boundary remains in the integrated surface.

Update only materially affected authorities/developer instructions and navigation, linking the actual manifest from the existing evaluation owner rather than duplicating it. Preserve Proposed assessment history and all ADR statuses. Only after the roadmap's Verification and documentation gate pass may the primary set RD-003 Complete, record M1-01 as dependency-ready but unselected, and move this same plan to `docs/plans/completed/`. No implementation task starts implicitly.

## Decision Review Contract

**Identity:** `RD003-DRC-001`. **Target:** one scan-only versioned manifest plus this plan's exact literal/command/evidence record. **Tier:** R3, limited to the security-sensitive minimization/locator projection. No custom serialization, record identity, concurrency, recovery protocol, or cross-platform byte contract is proposed. Ordinary fixture labels and version references do not themselves justify those mechanisms.

**Owner boundary:** RD-003 may select ordinary implementation literals inside Accepted requirements. No role may change requirement/OD/ADR status, widen retention, authorize M1, publish sensitive material, or approve a release. If accepted evidence needs cannot fit the permitted native projection, return `OWNER DIRECTION` for the relevant authority; do not weaken the contract.

**Discovery and comparison:** One bounded primary non-ranking pass, then a recorded freeze. Compare only unresolved content-loading/profile and field-projection alternatives compatible with the pinned stack. Common criteria are native fidelity, the six-state contract, complete three-rule coverage, deterministic static inputs, minimum retained content, explicit missing-value semantics, reproducing the selected profile on this reference environment, and smallest command/file surface. No scores, broad ranking, or candidate-per-agent allocation is needed. Hard-gate failure ends expansion of that alternative after recording why and what would reverse it.

**Evidence classes:** controlling repository requirements/ADRs; exact installed/locked package source and type/API definitions; current official Playwright/axe primary sources for unresolved mechanics; and later bounded native observations. Sources establish supported semantics, not actual runtime success. Types are not runtime validation. Gold fixture values, calculations, guessed check IDs, and reconstructed native results cannot substitute for emitted evidence. Keep exact versions/source locations and freshness dates beside claims.

**Research assignments and budget:** One `critical_researcher` covers the critical native-field/locator-to-safe-evidence mapping for the three rules, including positive/incomplete results and absence/invalidity handling. Add at most one `technology_researcher` only for an unresolved browser/content-loading/profile dimension that can run independently. Each receives [Research Assignment Capsule v1](../../.codex/README.md#research-assignment-capsule-v1), exact anchors, frozen alternatives, expected output, read-only permission, synchronization barrier, and at most one bounded follow-up in the same research run. Do not instantiate a separate researcher per rule or use a drafter for this compact artifact.

One `decision_analyst` is required for R3 synthesis, with at most one bounded correction. It returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`; the primary accepts or rejects its support. `DRAFT READY` requires complete decide-now semantics and exact command/path/side-effect slots, followed by the fresh `critical_research_reviewer` pre-draft checkpoint. That checkpoint permits one supported outline correction; failure then returns to the remaining evidence budget or owner. A different fresh `critical_research_reviewer` reviews the primary-written artifact. These requirements follow the named R3 trigger; they are not an unconditional rule imposed on R2 work. If evidence later disproves that trigger, record the reclassification and use the source workflow's conditional R2 checkpoints without silently carrying extra reviews forward.

**Decide now / prove later:** Decide exact contents, browser/profile/options, readiness/timeout, field sources/bounds/transformations, native-result meaning, locator availability semantics, mutation/cleanup scope, expected observations, and failure interpretation before setup. Later execution proves those already defined semantics. Do not allow the worker to resolve what a native pass, a safe string, or missing evidence means by observing whatever happens. If literal compatibility fails, preserve the failed case and version the correction.

**Artifact-local output:** the manifest must name its scan-only version/status, six cases and content references, stable keys and revision roles, expected native rule outcomes, browser/scanner/readiness/timeout profile, exact per-rule evidence allowlists, locator representation, evidence-policy label, permitted missing-fact reasons, and non-promotable limitations. The plan owns provenance, exact commands and side effects, selected/rejected ordinary options with reasons, observations versus expectations, review decisions, and next boundary. No full schema platform or separate approval/report file.

### Cumulative invariant packet

All invariants are pending selection/execution evidence at plan creation. Primary maps actual results to these IDs; the appropriate fresh contract/artifact reviewer checks all of them after every material revision. Implementation reviewers check the same invariants against actual setup and retained evidence.

| ID | Trigger or fixture | Expected result / evidence required | Responsible reviewer |
| --- | --- | --- | --- |
| RD3-I1 | Artifact completeness | All RD-003 outputs and exact command/side-effect slots resolved before the packet; no invented execution value after review. | Contract and final artifact reviewers |
| RD3-I2 | Evidence honesty | Expected, source-supported, actually observed, missing, failed, and unverified values remain distinct; no gold-to-native or absence-to-pass inference. | All applicable reviewers |
| RD3-I3 | Authority/status | Only RD-003 is active; no ADR/requirement promotion, completed scan claim before evidence, or early M1/generation/release work. | All applicable reviewers |
| RD3-I4 | Six-state/native boundary | Exactly the three mapped failing/corrected pairs; same stable target per pair; complete three-rule scan profile; intended native failing and narrow positive outcomes. | Artifact and setup reviewers |
| RD3-I5 | Field/locator projection | Closed per-rule field mapping/bounds; no raw payload, arbitrary text, URL, form value, secret, pass archive, or extra identity. Locator absence preserves the item and does not itself make generation evidence insufficient. | Critical research and setup reviewers |
| RD3-I6 | Missing/invalid/incomplete data | Native incomplete is distinct; a missing/invalid/withheld individual fact is recorded without dropping its item; missing required contrast facts are not fabricated. | Critical research and setup reviewers |
| RD3-I7 | Freeze/change | Exact content/profile and expected result fixed before case execution; changed frozen value creates a new version, preserved prior observation, and affected-case rerun. No empirical-repeatability claim or routine repeat batch. | Artifact and integrated reviewers |
| RD3-I8 | Ownership/side effects | Manifest and documentation primary-owned between leases; exact fixture-only lease; generated paths external to proof separately bounded; pinned toolchain unchanged; no personal browser/global runtime changes. | Setup and integrated reviewers |
| RD3-I9 | Failure/cleanup | Readiness/timeout/setup/scanner/coverage failure cannot be relabeled success; only owned processes and exact validated generated paths are cleaned; six approved inputs remain. | Setup and integrated reviewers |

No evaluator may manufacture additional fixture states, secrets, malicious pages, or a threat-modeling program to exercise this packet. Source inspection and bounded synthetic field-level examples cover projection exclusions; the six browser cases remain fixed. Later M1 behavioral negative tests are not claimed here.

Stop when the same decisive evidence gap appears twice, two synthesis returns lack materially new evidence, the report/follow-up budget is exhausted, a binding contract or authority changes, or two final-artifact correction cycles fail. Normative/Major/uncertain corrections receive complete fresh artifact review and the full packet; R3 corrections always do. Do not reset budgets by spawning a replacement agent. Return to the owner for additional scope or allowance when required.

## Concrete Steps

### Execution discovery and research freeze

`RD003-DISCOVERY-001` (2026-08-30): the one permitted non-ranking discovery pass inspected the installed integration API, axe source availability, browser catalog, local runtime/cache names, and official Node checksum list. Existing shared browser caches are revision `1228`, not required `1234`, and will not be used or modified. The exact official Node Windows x64 ZIP checksum is `6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba`, read from [Node 24.20.0 checksums](https://nodejs.org/dist/v24.20.0/SHASUMS256.txt). Sandbox network access failed; an approved read-only network call succeeded. This is acquisition-source evidence, not runtime execution evidence.

The comparative candidate set is now frozen: (a) literal HTML loaded with Playwright `setContent`, with embedded authored image data; or (b) six exact loopback routes serving those same static contents plus one authored local asset. No file-URL or public-page input is considered. The critical projection alternatives are native result/check data plus bounded element facts read from the unique native target, versus native result/check data plus transient native `node.html` parsing for those same facts. Both must exclude raw content, arbitrary strings, URLs, form values, and general pass archives. Locator candidates are one validated native top-level selector restricted to the authored fixture target, or a concise unavailable category; a fixture key cannot substitute for an emitted locator. These alternatives do not select public runtime semantics.

One `critical_researcher` investigates the native-field/locator dimension; one optional `technology_researcher` is triggered for the independent unresolved managed-browser acquisition and `setContent`/loopback loading dimension. Both use RD003-DRC-001, RD3-I1 through RD3-I9, the existing common criteria and hard gates, one report and at most one targeted follow-up each. The primary then supplies exact commands, paths, side effects, and content definitions to one analyst. No research drafter is used. All bindings remain unselected until synthesis and the fresh pre-draft checkpoint pass.

All commands run from the repository root in PowerShell unless a frozen slot explicitly says otherwise. The current safe inspection commands are:

```powershell
git status --short --branch
git log -3 --oneline
git diff --check
node --version
npm.cmd --version
Get-Content package.json -Raw
Get-Content node_modules/playwright-core/browsers.json -Raw
Test-Path logs/agent-flow-leases/v2/active.json
```

Expected activation evidence is the committed RD-002 baseline, the known global-version mismatch, matching package/catalog metadata, and no active lease. Recheck rather than assume these remain true. `python -B .codex/leases/lease_guard.py self-test` is the existing isolated guard validator; run it before the first implementation lease, not as scan evidence.

### Future commands and mutations to freeze before setup

The table below defines the original slot obligations. RD003-OUTLINE-003 now supplies exact proposed commands or explicit None dispositions for every row; synthesis and both R3 checkpoints must pass before execution. No placeholder, unpinned npx download, or worker-selected default is authorized.

| Slot | Required frozen contents and decisive result |
| --- | --- |
| CMD-ENV | Exact Node/npm executable locations and version checks; dependency resolution/lock comparison; Python/Git guard prerequisites. A mismatch stops setup. |
| CMD-BOOTSTRAP | `None` when prerequisites already match; otherwise the exact developer-evaluation runtime/browser acquisition commands, official source/version, permitted archive/extraction/cache paths and lifecycle effects. No global install, browser/package upgrade, or application installer. |
| CMD-RESTORE | `None` if the existing dependency tree is accepted unchanged; otherwise the existing locked, script-suppressed npm restore with exact task-local cache. Package manifest/lock mutation is forbidden; initial manifest or lock generation is `None` because RD-002 already supplied them. |
| CMD-CLEAN-PREP | Exact clean-state preparation for only named disposable browser contexts/runtime/cache outputs when necessary; validate absolute containment and ordinary non-reparse topology first. Never remove the repository, a shared browser cache, a user profile, authored fixture, or prior evidence. |
| CMD-FIXTURE | Exact six content definitions, filename list, local asset if needed, marker/target uniqueness and no-external-resource checks; worker authors files using `apply_patch`. No fixture generator/platform. |
| CMD-LOAD | Exact evaluation-only content-loading mechanism and in-memory/loopback setup command, allowed local resource routes if any, readiness condition, finite timeout, viewport/locale/color/timezone and browser flags. No public target, arbitrary file server, personal session, or new daemon. |
| CMD-SCAN | Exact bounded direct-library observation command, all three rule IDs/options and iframe exclusion, required native shape/coverage checks, target/positive selection, and content-safe allowlisted output. Native payload stays in memory and is never printed or saved. One execution per frozen state, finite termination and owned-resource cleanup. |
| CMD-VALIDATE | Manifest parse/count/reference/unique-key/content check; source-to-retained-field and negative-content audit; exact independent strict check using the selected toolchain where applicable. No whole-app build or nonexistent suite. |
| CMD-CLEANUP | Exact termination/removal of owned evaluation processes and generated artifacts; explicitly say which task-local runtime/browser/cache outputs remain for reproduction and which are removed. Restore process-local environment overrides; preserve pre-existing state and the six authored fixtures/manifest. |

For each slot record working directory, exact command and expected exit/result, permitted metadata mutations (`None` for existing dependency/config files), all generated output locations, external/network/process effects, and cleanup/retention. Check ignore coverage before a worker lease; ignored paths cannot be guard scope. Browser downloads may require network permission during execution; no download or scan occurs while creating this plan.

### Proposed literal execution outline — RD003-OUTLINE-003

This is the synthesis/pre-draft checkpoint input, not permission to execute. Outline 003 is the one additional owner-authorized correction of the cleanup-visibility defect recorded in `RD003-SYNTHESIS-002`. The prior finding and reviewed identity remain preserved below. Exact contents become binding only after `DRAFT READY`, fresh pre-draft review, primary manifest authoring, and the different fresh final literal-artifact review. No selected source or executable command has run as scan evidence.

**Research reconciliation:** `RD003-RESEARCH-EVIDENCE-001` completed one critical report; no follow-up used. `RD003-RESEARCH-BROWSER-001` completed one report and its one permitted follow-up; that budget is exhausted. The primary accepts their source evidence as input to synthesis, not observed browser evidence. No role changed a file or ran a scan. The browser metadata-only dry run under the global runtime is explicitly not selected-runtime proof. `RD003-GUARD-001`: the existing isolated guard self-test passed all 27 checks.

| Evidence | Source and supported meaning |
| --- | --- |
| E02 | Installed `axe.js:25,19315–19318` sets/emits engine 4.13.0; integration `dist/index.js:38,286–287` loads that source. SHA-256 values are `138a93a4ce7b7c6c08ed84144e45dcd8cc36d2d4ff8ed673619faf0406906d88` and `9a4f63fad34eb93fe99dc3dde41dc21d0614e5956d524f288b029634cbd6b39d`, respectively. |
| E03 | Installed axe aggregation filters checks and can place a rule in several buckets; [versioned API](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md) documents result-type truncation. Keep all four native arrays transient; retain only declared evidence and count-only coverage. |
| E04/E06/E08 | Native label check data can contain raw names; native HTML can be truncated and omits an input's external label. Read only categorical facts from the unique native target; [HTML label association](https://html.spec.whatwg.org/multipage/forms.html#the-label-element) supplies `labels/control` meaning. Reject the HTML-parsing candidate at its completeness gate. |
| E05 | [Versioned contrast source](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js), installed axe lines 27188–27303: emitted ratio is truncated; native bucket controls outcome. Never recompute or substitute authored values. |
| E07 | Integration `dist/index.js:314–342` traverses frames independently of options. Use explicit `iframe` and `frame` exclusions plus `iframes:false`; one full options object prevents accidental runOnly replacement. |
| BR-E1–E6 | [Playwright browser management](https://playwright.dev/docs/browsers#managing-browser-binaries), [new headless mode](https://playwright.dev/docs/browsers#chromium-new-headless-mode), [isolated contexts](https://playwright.dev/docs/api/class-browser#browser-new-context), and [accessibility guidance](https://playwright.dev/docs/accessibility-testing) support the library/profile semantics, not runtime success. |
| BR-E7 | Installed `playwright-core/lib/coreBundle.js:31963–32201,32770–32810,33297–33455,39489–39610` establishes task-local cache, .links, installer lock/sentinels, required Chromium/ffmpeg/winldd, os.tmpdir downloads, and ephemeral browser profile/artifact directories. `--dry-run` is read-only metadata at lines 69394–69416. |

Sources were inspected 2026-08-30 UTC. Exact CJS integration loading in the command below matches E02. No external evidence promotes an Accepted-for-evaluation ADR. The proposed loading choice is `setContent` with a project-authored embedded SVG: six loopback routes add an unnecessary listener, port, asset routing, and cleanup without a current origin/navigation requirement. The blue-square image plus Shape guide context supplies clear author gold; its purpose and wording are not scanner facts.

**Proposed artifact:** `evaluation/rd003-scan-v1.json`, version `rd003-scan-v1`, status `frozen-scan-only-evaluation`; evidence policy `rd003-evidence-v1`. Exactly the six cases below, with no extra asset file or fixture generator. The manifest will contain their exact content strings and references. Stable targets are `rd3-image`, `rd3-email`, `rd3-text`; native selectors must be their unchanged emitted `#...` strings. Each failing state expects one intended native violation, each corrected state one native same-target pass, no other violation, and no incomplete. Unexpected incomplete remains preserved as a separate observation and fails that case expectation.

**Proposed browser and scanner:** Node 24.20.0/npm 11.19.0; Playwright 1.62.1, CJS @axe-core/playwright 4.13.0, axe 4.13.0; matching full managed Chromium 1234 / 151.0.7922.34 using `channel:'chromium'`, headless true, launch timeout 10000 ms, no additional arguments, unchanged pinned Playwright defaults. Context: viewport 1280×720, device scale 1, en-US, UTC, light, forced colors none, reduced motion no-preference, offline true, service workers blocked, downloads false, permissions empty, no imported state. Load/readiness bounds are 10000 ms, one supervised Node-process deadline 45000 ms including ordinary browser cleanup, bounded input/output pipe waits 5000 ms, and forced-stop wait 10000 ms. No asynchronous timeout race remains. Readiness checks document completion, one marker, one target, and decoded nonempty image. All routed requests abort and make the case fail; this is synthetic-only loading, not public-URL containment.

The exact manifest-owned objects consumed by CMD-SCAN are:

```json
{
  "browser": {
    "name": "Playwright-managed Chromium",
    "revision": "1234",
    "version": "151.0.7922.34",
    "launch": {
      "headless": true,
      "channel": "chromium",
      "timeout": 10000,
      "additionalArguments": [],
      "defaultArguments": "Pinned Playwright defaults unchanged"
    },
    "context": {
      "viewport": {
        "width": 1280,
        "height": 720
      },
      "locale": "en-US",
      "timezoneId": "UTC",
      "colorScheme": "light",
      "forcedColors": "none",
      "reducedMotion": "no-preference",
      "deviceScaleFactor": 1,
      "acceptDownloads": false,
      "offline": true,
      "serviceWorkers": "block",
      "permissions": []
    }
  },
  "scanner": {
    "excludedSelectors": [
      "iframe",
      "frame"
    ],
    "options": {
      "runOnly": {
        "type": "rule",
        "values": [
          "image-alt",
          "label",
          "color-contrast"
        ]
      },
      "reporter": "v1",
      "resultTypes": [
        "violations",
        "incomplete",
        "passes",
        "inapplicable"
      ],
      "selectors": true,
      "ancestry": false,
      "xpath": false,
      "absolutePaths": false,
      "elementRef": false,
      "iframes": false
    },
    "coverage": "Validate all four transient arrays and each rule's occurrence in at least one bucket. A rule may occur in several. Unknown rules, duplicate rule per bucket, rule error or malformed rule/node collection are fatal. Missing/malformed individual check groups/IDs remain unavailable facts on the existing observation.",
    "frequency": "Once per frozen state, provider-independent; no repeatability claim."
  }
}
```

**Proposed source-field mapping:** Native rule and bucket stay exact; only source-supported check IDs by rule and group are retained, never invented check booleans. DOM facts are distinctly DOM-observed: element kind; image alt absent/empty/whitespace-only/nonempty; email type; the same categorical aria-label/aria-labelledby/title/placeholder attribute states; role absent/none/presentation/other; explicit/implicit label association none/one/multiple. Attribute values over 256 characters are withheld; no original string, name, ID reference, source URL, or form value is returned. Native `explicit-label.data.explicitLabel` is optional empty/nonempty evidence, with a nonempty value required for the corrected input; raw strings never survive. Locator is the unchanged one native string, at most 64 characters, matching the authored selector uniquely and of the expected kind; missing/invalid/withheld/ambiguous locator preserves the item and makes target matching unavailable. It never becomes a product identity or generation-sufficiency rule.

Contrast retains only native `any[id=color-contrast].data` fields: fgColor/bgColor matching six-digit hex, lowercased; finite contrastRatio 1..21 unchanged; expectedContrastRatio exact 3:1 or 4.5:1 with 4.5:1 required here; fontSize at most 48 characters matching positive finite `pt (px)` numbers each at most 4096; fontWeight normal/bold. Optional messageKey is restricted to the closed source-supported reason list in CMD-SCAN; unknown strings are withheld. Missing/null native values yield missing; absent/null locator is missing, other malformed locator shape invalid, oversized/non-allowlisted locator withheld, nonunique locator ambiguous. Invalid element kind remains invalid rather than being overwritten. Font-size strings longer than 48 characters and naming strings longer than 256 are withheld; malformed values within those bounds are invalid. Missing/null check groups are missing; malformed/unknown/duplicate individual check IDs are invalid facts on the preserved item, not fatal collection failures. Each unavailable fact remains nested in its item, without a separate log/artifact. Required unavailable facts fail the case's evidence expectation; native incomplete retains its bucket independently.

Raw native arrays, node HTML, messages, failure summaries, name strings, relatedNodes, snapshots, arbitrary/hidden text, URLs, form values, credentials, general pass collections, and extra record identities never cross the output boundary. Manifest content is authored synthetic input, not captured page evidence. Coverage consists only of exact rule/bucket node counts. The existing comparison-only contrast vector stays with its M5 authority and adds no execution.

#### Exact proposed fixture contents (CMD-FIXTURE)

Worker writes only these six UTF-8/LF files with `apply_patch`; no worker-selected value is permitted.

- `fixtures/rd003/informative-image-alt/failing.html`; revision `informative-image-alt-v1-failing`, rule `image-alt`, target `rd3-image`, native expectation `violations`.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RD-003 controlled fixture</title><style>body{margin:24px;font:16px Arial,sans-serif;color:#111111;background:#ffffff}h1{font-size:24px}input{font:inherit}</style></head><body><main data-rd003-ready="true"><h1>Shape guide</h1><p>Identify the shape shown below.</p><img id="rd3-image" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%230000ff'/%3E%3C/svg%3E"></main></body></html>
```

- `fixtures/rd003/informative-image-alt/corrected.html`; revision `informative-image-alt-v1-corrected`, rule `image-alt`, target `rd3-image`, native expectation `passes`.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RD-003 controlled fixture</title><style>body{margin:24px;font:16px Arial,sans-serif;color:#111111;background:#ffffff}h1{font-size:24px}input{font:inherit}</style></head><body><main data-rd003-ready="true"><h1>Shape guide</h1><p>Identify the shape shown below.</p><img id="rd3-image" width="64" height="64" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%230000ff'/%3E%3C/svg%3E" alt="Blue square"></main></body></html>
```

- `fixtures/rd003/form-input-label/failing.html`; revision `form-input-label-v1-failing`, rule `label`, target `rd3-email`, native expectation `violations`.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RD-003 controlled fixture</title><style>body{margin:24px;font:16px Arial,sans-serif;color:#111111;background:#ffffff}h1{font-size:24px}input{font:inherit}</style></head><body><main data-rd003-ready="true"><h1>Contact form</h1><div><span>Email address</span> <input id="rd3-email" type="email"></div></main></body></html>
```

- `fixtures/rd003/form-input-label/corrected.html`; revision `form-input-label-v1-corrected`, rule `label`, target `rd3-email`, native expectation `passes`.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RD-003 controlled fixture</title><style>body{margin:24px;font:16px Arial,sans-serif;color:#111111;background:#ffffff}h1{font-size:24px}input{font:inherit}</style></head><body><main data-rd003-ready="true"><h1>Contact form</h1><div><label for="rd3-email">Email address</label> <input id="rd3-email" type="email"></div></main></body></html>
```

- `fixtures/rd003/text-contrast/failing.html`; revision `text-contrast-v1-failing`, rule `color-contrast`, target `rd3-text`, native expectation `violations`.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RD-003 controlled fixture</title><style>body{margin:24px;font:16px Arial,sans-serif;color:#111111;background:#ffffff}h1{font-size:24px}input{font:inherit}</style></head><body><main data-rd003-ready="true"><h1>Reading sample</h1><p id="rd3-text" style="color:#888888;background:#ffffff;font-size:16px;font-weight:400">This is the controlled reading sample.</p></main></body></html>
```

- `fixtures/rd003/text-contrast/corrected.html`; revision `text-contrast-v1-corrected`, rule `color-contrast`, target `rd3-text`, native expectation `passes`.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>RD-003 controlled fixture</title><style>body{margin:24px;font:16px Arial,sans-serif;color:#111111;background:#ffffff}h1{font-size:24px}input{font:inherit}</style></head><body><main data-rd003-ready="true"><h1>Reading sample</h1><p id="rd3-text" style="color:#222222;background:#ffffff;font-size:16px;font-weight:400">This is the controlled reading sample.</p></main></body></html>
```

#### CMD-ENV and CMD-BOOTSTRAP

Before opening the first worker lease or provisioning anything, the primary runs this exact prerequisite check:

```powershell
@'
from pathlib import Path
import hashlib,platform,subprocess
assert platform.python_version()=='3.12.10'
assert subprocess.check_output(['git','--version'],text=True).strip()=='git version 2.53.0.windows.1'
assert not Path('logs/agent-flow-leases/v2/active.json').exists()
assert not Path('temp/rd003-evaluation').exists()
expected={
'package.json':'c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98',
'package-lock.json':'ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553',
'tsconfig.json':'3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde',
'vite.config.ts':'8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07',
'node_modules/axe-core/axe.js':'138a93a4ce7b7c6c08ed84144e45dcd8cc36d2d4ff8ed673619faf0406906d88',
'node_modules/@axe-core/playwright/dist/index.js':'9a4f63fad34eb93fe99dc3dde41dc21d0614e5956d524f288b029634cbd6b39d'}
for name,wanted in expected.items(): assert hashlib.sha256(Path(name).read_bytes()).hexdigest()==wanted,name
print('Pre-mutation Python/Git identities, six file/source hashes, absent task directory, and no active lease verified.')
'@ | python -B -
if ($LASTEXITCODE -ne 0) { throw 'Pre-mutation prerequisite check failed.' }
if ($PSVersionTable.PSVersion.ToString() -ne '7.6.4' -or [Environment]::Version.ToString() -ne '10.0.10') { throw 'PowerShell/.NET identity mismatch.' }
```

Run bootstrap once from the exact repository root after the reviewed packet/lease permits setup. CMD-ENV uses the installed package/source fingerprints above plus fresh runtime/package checks inside this block. Python is 3.12.10 and Git is 2.53.0.windows.1. Fresh checkout SHA-256: package `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98`; lock `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`; TypeScript configuration `3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde`; Vite configuration `8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07`. All must remain unchanged.

CMD-RESTORE: **None**, because the existing locked dependencies/source are preserved and checked, not regenerated. A mismatch stops. Initial package/lock generation: **None**. CMD-CLEAN-PREP: **None**; the named task directory must be absent, so unexpected state is preserved for triage. The guard self-test is already accepted, not scanner evidence.

Bootstrap acquires the exact official Node ZIP with its observed checksum and the pinned Playwright CLI's managed browser/tools. It changes no global installation/package metadata. Network permissions may be requested for these official downloads only. The browser installer has an outer 600000-ms deadline, 120000-ms connection timeout, and at most five native download attempts per artifact; those acquisition retries are not fixture reruns. Timeout kills only the still-running owned installer process tree. Installer logs contain only acquisition diagnostics and are removed at cleanup.

```powershell
$ErrorActionPreference = 'Stop'
$rd003Repo = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab'
if ($PWD.Path -ne $rd003Repo) { throw 'Unexpected working directory.' }
$rd003Temp = Join-Path $rd003Repo 'temp\rd003-evaluation'
if (Test-Path -LiteralPath $rd003Temp) { throw 'Preserve and inspect unexpected existing task directory.' }
foreach ($rd003Parent in @($rd003Repo,(Join-Path $rd003Repo 'temp'))) {
  if ((Test-Path -LiteralPath $rd003Parent) -and ((Get-Item -LiteralPath $rd003Parent).Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Reparse point.' }
}
git check-ignore -q -- temp/rd003-evaluation
if ($LASTEXITCODE -ne 0) { throw 'Task outputs must be ignored.' }
New-Item -ItemType Directory -Path $rd003Temp | Out-Null
New-Item -ItemType Directory -Path (Join-Path $rd003Temp 'os-temp'),(Join-Path $rd003Temp 'npm-cache') | Out-Null
$rd003EnvNames = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','TMPDIR','TMP','TEMP','PATH')
$rd003OldEnv = @{}
foreach ($rd003Name in $rd003EnvNames) { $rd003OldEnv[$rd003Name] = [Environment]::GetEnvironmentVariable($rd003Name,'Process') }
try {
  $env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $rd003Temp 'playwright-browsers'
  $env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = '120000'
  $env:TMPDIR = Join-Path $rd003Temp 'os-temp'
  $env:TMP = $env:TMPDIR
  $env:TEMP = $env:TMPDIR
  $rd003Zip = Join-Path $rd003Temp 'node-v24.20.0-win-x64.zip'
  Invoke-WebRequest -Uri 'https://nodejs.org/dist/v24.20.0/node-v24.20.0-win-x64.zip' -OutFile $rd003Zip -TimeoutSec 300
  if ((Get-FileHash -LiteralPath $rd003Zip -Algorithm SHA256).Hash.ToLowerInvariant() -ne '6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba') { throw 'Node archive identity mismatch.' }
  Expand-Archive -LiteralPath $rd003Zip -DestinationPath $rd003Temp
  $rd003Runtime = Join-Path $rd003Temp 'node-v24.20.0-win-x64'
  $rd003Node = Join-Path $rd003Runtime 'node.exe'
  $env:PATH = $rd003Runtime + ';' + $env:PATH
  if ((& $rd003Node --version) -ne 'v24.20.0') { throw 'Node mismatch.' }
  if ((& $rd003Node (Join-Path $rd003Runtime 'node_modules\npm\bin\npm-cli.js') --version) -ne '11.19.0') { throw 'npm mismatch.' }
  $rd003Installer = Start-Process -FilePath $rd003Node -ArgumentList @((Join-Path $rd003Repo 'node_modules\playwright\cli.js'),'install','chromium','--no-shell') -WorkingDirectory $rd003Repo -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $rd003Temp 'browser-install.stdout') -RedirectStandardError (Join-Path $rd003Temp 'browser-install.stderr')
  if (-not $rd003Installer.WaitForExit(600000)) {
    if (-not $rd003Installer.HasExited) { & "$env:SystemRoot\System32\taskkill.exe" /PID $rd003Installer.Id /T /F | Out-Null }
    throw 'Owned browser installer timed out; inspect task-local outputs before any retry.'
  }
  $rd003Installer.Refresh()
  Get-Content -LiteralPath (Join-Path $rd003Temp 'browser-install.stdout'),(Join-Path $rd003Temp 'browser-install.stderr')
  if ($rd003Installer.ExitCode -ne 0) { throw 'Browser installation failed.' }
  & $rd003Node --input-type=module -e "import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire}from'node:module';const r=createRequire(import.meta.url);const lock=JSON.parse(fs.readFileSync('package-lock.json'));for(const p of ['playwright','playwright-core','@axe-core/playwright','axe-core','typescript'])assert.equal(r(p+'/package.json').version,lock.packages['node_modules/'+p].version);assert.equal(r('axe-core').version,'4.13.0');console.log('Selected runtime and installed scanner dependency identities verified.');"
  if ($LASTEXITCODE -ne 0) { throw 'Dependency identity mismatch.' }
  & $rd003Node (Join-Path $rd003Runtime 'node_modules\npm\bin\npm-cli.js') --global=false --prefix $rd003Repo --cache (Join-Path $rd003Temp 'npm-cache') --ignore-scripts=true --audit=false --fund=false --update-notifier=false --logs-max=0 run typecheck
  if ($LASTEXITCODE -ne 0) { throw 'Strict typecheck failed.' }
} finally {
  foreach ($rd003Name in $rd003EnvNames) { [Environment]::SetEnvironmentVariable($rd003Name,$rd003OldEnv[$rd003Name],'Process') }
}
```

#### CMD-LOAD and CMD-SCAN

This exact inline evaluation command is retained here for reproduction only, never as a probe source file or an application module. It runs each frozen state once. A failed case stops the batch and leaves subsequent states unexecuted; no automatic retry/revised expectation is authorized. All native page/scanner material stays in process memory. Output is only the closed projection. Case identity is manifest/scenario/revision/state plus fixture target key (evaluation metadata); `targetMatch` separately records whether native same-target evidence was established.

```powershell
$ErrorActionPreference = 'Stop'
$rd003Repo = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab'
if ($PWD.Path -ne $rd003Repo) { throw 'Unexpected working directory.' }
$rd003Temp = Join-Path $rd003Repo 'temp\rd003-evaluation'
$rd003Source = @'
import fs from 'node:fs';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { AxeBuilder } = require('@axe-core/playwright');
const m = JSON.parse(fs.readFileSync('evaluation/rd003-scan-v1.json', 'utf8'));
const buckets = ['violations', 'incomplete', 'passes', 'inapplicable'];
const rules = ['image-alt', 'label', 'color-contrast'];
const checkIds = {
  'image-alt': {any:['has-alt','aria-label','aria-labelledby','non-empty-title','presentational-role'],all:[],none:['alt-space-value']},
  label: {any:['implicit-label','explicit-label','aria-label','aria-labelledby','non-empty-title','non-empty-placeholder','presentational-role'],all:[],none:['hidden-explicit-label']},
  'color-contrast': {any:['color-contrast'],all:[],none:[]}
};
const reasons = ['hidden','nonBmp','pseudoContent','complexTextShadows','colorParse','imgNode','bgGradient','bgImage','elmPartiallyObscuring','outsideViewport','bgOverlap','elmPartiallyObscured','equalRatio','shortTextContent','fgOnShadowColor','shadowOnBgColor'];
const unavailable = reason => ({unavailable:reason});
function fact(value, valid, transform = x => x) {
  return value === undefined || value === null ? unavailable('missing') : valid(value) ? transform(value) : unavailable('invalid');
}
function complete(value) {
  return value !== null && typeof value === 'object' ? !value.unavailable && Object.values(value).every(complete) : true;
}
function requireTrue(value) { if (!value) throw new Error('contract'); }
function validSize(value) {
  if (typeof value !== 'string' || value.length > 48) return false;
  const parts = /^(\d+(?:\.\d+)?)pt \((\d+(?:\.\d+)?)px\)$/.exec(value);
  return !!parts && parts.slice(1).every(x => Number(x) > 0 && Number(x) <= 4096);
}
async function project(page, c, rule, bucket, node) {
  const out = {rule, nativeBucket:bucket, targetMatch:false, locator:null, checks:{}, facts:unavailable('missing')};
  const raw = node.target;
  if (!Array.isArray(raw) || raw.length !== 1 || typeof raw[0] !== 'string') {
    out.locator = unavailable(raw === undefined || raw === null ? 'missing' : 'invalid');
  } else if (raw[0].length > 64 || raw[0] !== c.selector) {
    out.locator = unavailable('withheld');
  } else {
    const selected = page.locator(raw[0]);
    if (await selected.count() !== 1) out.locator = unavailable('ambiguous');
    else {
      out.locator = raw[0];
      out.targetMatch = true;
      out.facts = await selected.evaluate(el => {
        const state = name => {
          const value = el.getAttribute(name);
          if (value === null) return 'absent';
          if (value.length > 256) return {unavailable:'withheld'};
          return value.length === 0 ? 'empty' : value.trim().length === 0 ? 'whitespace-only' : 'nonempty';
        };
        const countState = n => n === 0 ? 'none' : n === 1 ? 'one' : 'multiple';
        const tag = el.tagName.toLowerCase();
        if (tag === 'img') return {elementKind:'img',altState:state('alt')};
        if (tag === 'input') {
          const labels = Array.from(el.labels || []);
          const role = el.getAttribute('role');
          return {
            elementKind:'input',inputType:el.type === 'email' ? 'email' : {unavailable:'invalid'},
            ariaLabelState:state('aria-label'),ariaLabelledbyState:state('aria-labelledby'),
            titleState:state('title'),placeholderState:state('placeholder'),
            roleState:role === null ? 'absent' : role.length > 256 ? {unavailable:'withheld'} : role === 'none' || role === 'presentation' ? role : 'other',
            explicitAssociation:countState(labels.filter(x => x.hasAttribute('for') && x.htmlFor === el.id && x.control === el).length),
            implicitAssociation:countState(labels.filter(x => !x.hasAttribute('for') && x.contains(el) && x.control === el).length)
          };
        }
        return {elementKind:tag === 'p' ? 'p' : {unavailable:'invalid'}};
      });
      if (out.facts.elementKind !== c.elementKind) {out.locator=unavailable('invalid');out.targetMatch=false;out.facts={unavailable:'invalid'};}
    }
  }
  for (const group of ['any','all','none']) {
    const list = node[group];
    if (list === null || list === undefined) out.checks[group] = unavailable('missing');
    else if (!Array.isArray(list) || !list.every(x=>x && typeof x==='object' && !Array.isArray(x) && typeof x.id==='string')) out.checks[group] = unavailable('invalid');
    else {
      const ids = list.map(x => x.id);
      out.checks[group] = ids.every(x => checkIds[rule][group].includes(x)) && new Set(ids).size === ids.length ? ids : unavailable('invalid');
    }
  }
  if (rule === 'label') {
    const check = Array.isArray(out.checks.any) ? node.any.find(x => x.id === 'explicit-label') : undefined;
    const name = check?.data?.explicitLabel;
    const sourceReason = out.checks.any.unavailable || (check?.data != null && (typeof check.data!=='object' || Array.isArray(check.data)) ? 'invalid' : null);
    out.nativeExplicitNameState = sourceReason ? unavailable(sourceReason) : typeof name === 'string' && name.length > 256 ? unavailable('withheld') : fact(name, x => typeof x === 'string', x => x.trim().length ? 'nonempty' : 'empty');
  }
  if (rule === 'color-contrast') {
    const data = Array.isArray(out.checks.any) ? node.any.find(x => x.id === 'color-contrast')?.data : undefined;
    const sourceReason = out.checks.any.unavailable || (data != null && (typeof data!=='object' || Array.isArray(data)) ? 'invalid' : null);
    const measurement = (key,valid,transform) => sourceReason ? unavailable(sourceReason) : key==='fontSize' && typeof data?.[key]==='string' && data[key].length>48 ? unavailable('withheld') : fact(data?.[key],valid,transform);
    const color = x => typeof x === 'string' && /^#[0-9a-fA-F]{6}$/.test(x);
    out.measurements = {
      fgColor:measurement('fgColor',color,x=>x.toLowerCase()),
      bgColor:measurement('bgColor',color,x=>x.toLowerCase()),
      contrastRatio:measurement('contrastRatio',x=>typeof x==='number' && Number.isFinite(x) && x>=1 && x<=21),
      expectedContrastRatio:measurement('expectedContrastRatio',x=>x==='4.5:1'||x==='3:1'),
      fontSize:measurement('fontSize',validSize),
      fontWeight:measurement('fontWeight',x=>x==='normal'||x==='bold')
    };
    out.nativeReason = sourceReason ? unavailable(sourceReason) : typeof data?.messageKey === 'string' && !reasons.includes(data.messageKey) ? unavailable('withheld') : fact(data?.messageKey,x=>reasons.includes(x));
  } else if (bucket === 'incomplete') out.nativeReason = unavailable('missing');
  return out;
}
requireTrue(m.version === 'rd003-scan-v1' && m.cases.length === 6);
for (const c of m.cases) requireTrue(fs.readFileSync(c.path,'utf8') === c.content);
const selectedCaseIndex = Number(process.env.RD003_CASE_INDEX);
requireTrue(Number.isInteger(selectedCaseIndex) && selectedCaseIndex>=0 && selectedCaseIndex<6);
{
  const c = m.cases[selectedCaseIndex];
  let browser,context,page,stage='launch',networkAttempt=false;
  let result = {manifest:m.version,evidencePolicy:m.evidencePolicy.version,scenario:c.profile,revision:c.revision,stateRole:c.stateRole,fixtureTargetKey:c.targetKey,status:'failed',observations:[]};
  try {
    await (async () => {
      browser = await chromium.launch({headless:true,channel:'chromium',timeout:10000});
      requireTrue(browser.version() === m.browser.version);
      context = await browser.newContext(m.browser.context);
      await context.route('**/*', route => {networkAttempt=true;return route.abort();});
      page = await context.newPage();
      stage='readiness';
      await page.setContent(c.content,{waitUntil:'load',timeout:10000});
      await page.waitForFunction(selector => document.readyState==='complete' && document.querySelectorAll('[data-rd003-ready="true"]').length===1 && document.querySelectorAll(selector).length===1 && Array.from(document.images).every(x=>x.complete && x.naturalWidth>0),c.selector,{timeout:10000});
      requireTrue(!networkAttempt);
      stage='scan';
      const native = await new AxeBuilder({page}).exclude('iframe').exclude('frame').options(m.scanner.options).analyze();
      stage='shape-and-coverage';
      requireTrue(native.testEngine?.name==='axe-core' && native.testEngine.version==='4.13.0');
      result.browserVersion = browser.version();
      result.engineVersion = native.testEngine.version;
      const coverage = Object.fromEntries(rules.map(r=>[r,{}]));
      for (const bucket of buckets) {
        requireTrue(Array.isArray(native[bucket]));
        const seen = new Set();
        for (const rule of native[bucket]) {
          requireTrue(rule && rules.includes(rule.id) && !seen.has(rule.id) && !rule.error && Array.isArray(rule.nodes));
          seen.add(rule.id);
          coverage[rule.id][bucket] = rule.nodes.length;
          for (const node of rule.nodes) requireTrue(node && typeof node==='object' && !Array.isArray(node));
        }
      }
      requireTrue(rules.every(r=>Object.keys(coverage[r]).length>0));
      result.coverage = coverage;
      stage='projection';
      for (const bucket of ['violations','incomplete','passes']) {
        for (const rule of native[bucket]) {
          for (const node of rule.nodes) {
            if (bucket === 'incomplete' || (rule.id===c.rule && (bucket==='violations' || c.stateRole==='corrected' && Array.isArray(node.target) && node.target.length===1 && node.target[0]===c.selector))) {
              result.observations.push(await project(page,c,rule.id,bucket,node));
            }
          }
        }
      }
      stage='expected-outcome';
      const intended = result.observations.filter(x=>x.rule===c.rule && x.nativeBucket===c.expected.nativeBucket && x.targetMatch);
      requireTrue(intended.length===1 && complete(intended[0].checks) && complete(intended[0].facts));
      requireTrue(native.incomplete.every(r=>r.nodes.length===0));
      const violationCount = native.violations.reduce((n,r)=>n+r.nodes.length,0);
      requireTrue(violationCount === (c.stateRole==='failing'?1:0));
      const observation=intended[0];
      if (c.rule==='image-alt') requireTrue(observation.facts.altState === (c.stateRole==='failing'?'absent':'nonempty') && observation.checks.any.includes('has-alt'));
      if (c.rule==='label') {
        const f=observation.facts;
        requireTrue(f.inputType==='email' && ['ariaLabelState','ariaLabelledbyState','titleState','placeholderState','roleState'].every(k=>f[k]==='absent') && f.implicitAssociation==='none' && f.explicitAssociation===(c.stateRole==='failing'?'none':'one') && observation.checks.any.includes('explicit-label'));
        if(c.stateRole==='corrected') requireTrue(observation.nativeExplicitNameState==='nonempty');
      }
      if (c.rule==='color-contrast') requireTrue(complete(observation.measurements) && observation.measurements.expectedContrastRatio==='4.5:1' && observation.measurements.fontWeight==='normal');
      requireTrue(!networkAttempt);
      result.status='completed';
    })();
  } catch {result.failureStage=stage;}
  finally {
    for (const resource of [page,context,browser]) if(resource) {
      try {await resource.close();}
      catch {result.status='failed';result.cleanup='failed';}
    }
    if (!result.cleanup) result.cleanup='closed';
  }
  console.log(JSON.stringify(result));
  if(result.status!=='completed') process.exitCode=1;
}
'@
$rd003Manifest = Get-Content -Raw evaluation/rd003-scan-v1.json | ConvertFrom-Json
for ($rd003Index=0; $rd003Index -lt 6; $rd003Index++) {
  $rd003Case = $rd003Manifest.cases[$rd003Index]
  $rd003Info = [Diagnostics.ProcessStartInfo]::new()
  $rd003Info.FileName = Join-Path $rd003Temp 'node-v24.20.0-win-x64\node.exe'
  $rd003Info.ArgumentList.Add('--input-type=module')
  $rd003Info.ArgumentList.Add('-')
  $rd003Info.WorkingDirectory = $rd003Repo
  $rd003Info.UseShellExecute = $false
  $rd003Info.CreateNoWindow = $true
  $rd003Info.RedirectStandardInput = $true
  $rd003Info.RedirectStandardOutput = $true
  $rd003Info.RedirectStandardError = $true
  $rd003Info.Environment['PLAYWRIGHT_BROWSERS_PATH'] = Join-Path $rd003Temp 'playwright-browsers'
  foreach ($rd003Name in @('TMPDIR','TMP','TEMP')) { $rd003Info.Environment[$rd003Name] = Join-Path $rd003Temp 'os-temp' }
  foreach ($rd003Name in @('NODE_OPTIONS','NODE_PATH','DEBUG','PWDEBUG')) { $rd003Info.Environment.Remove($rd003Name) | Out-Null }
  $rd003Info.Environment['RD003_CASE_INDEX'] = [string]$rd003Index
  $rd003Process = [Diagnostics.Process]::new()
  $rd003Process.StartInfo = $rd003Info
  $rd003Phase = 'process-start'
  $rd003AcceptedOutput = $false
  $rd003Started = $false
  try {
    if (-not $rd003Process.Start()) { throw 'Process start failed.' }
    $rd003Started = $true
    $rd003Watch = [Diagnostics.Stopwatch]::StartNew()
    $rd003Out = $rd003Process.StandardOutput.ReadToEndAsync()
    $rd003Err = $rd003Process.StandardError.ReadToEndAsync()
    $rd003Phase = 'stdin'
    if (-not $rd003Process.StandardInput.WriteAsync($rd003Source).Wait(5000)) { throw 'Input timeout.' }
    $rd003Process.StandardInput.Close()
    $rd003Phase = 'process-deadline'
    $rd003Remaining = [Math]::Max(0,45000-[int]$rd003Watch.ElapsedMilliseconds)
    if (-not $rd003Process.WaitForExit($rd003Remaining)) { throw 'Case deadline.' }
    $rd003Phase = 'process-output'
    if (-not [Threading.Tasks.Task]::WaitAll([Threading.Tasks.Task[]]@($rd003Out,$rd003Err),5000)) { throw 'Pipe deadline.' }
    $rd003Record = $rd003Out.Result | ConvertFrom-Json
    if ($rd003Record.manifest -ne 'rd003-scan-v1' -or $rd003Record.revision -ne $rd003Case.revision -or $rd003Record.stateRole -ne $rd003Case.stateRole -or $rd003Record.status -notin @('completed','failed')) { throw 'Invalid projected result.' }
    if ($rd003Record.status -eq 'completed' -and ($rd003Process.ExitCode -ne 0 -or $rd003Record.cleanup -ne 'closed')) { throw 'Inconsistent terminal result.' }
    $rd003Record | ConvertTo-Json -Depth 20 -Compress
    $rd003AcceptedOutput = $true
    if ($rd003Record.status -ne 'completed') { throw 'Frozen case failed.' }
  } catch {
    if (-not $rd003AcceptedOutput) {
      $rd003Termination = 'not-required'
      if ($rd003Started -and -not $rd003Process.HasExited) {
        try { $rd003Process.Kill($true); $null=$rd003Process.WaitForExit(10000); $rd003Termination='forced-tree-stop-requested' }
        catch { $rd003Termination='failed' }
      }
      @{manifest='rd003-scan-v1';revision=$rd003Case.revision;stateRole=$rd003Case.stateRole;status='failed';failureStage=$rd003Phase;termination=$rd003Termination;cleanup='unverified'} | ConvertTo-Json -Compress
    }
    throw 'RD003 case failed; late output suppressed, remaining states unexecuted. Inspect owned processes before further work.'
  } finally { $rd003Process.Dispose() }
}

```

#### CMD-VALIDATE

Run structural validation after fixture creation, inspect the actual diff and source mappings, compare printed fingerprints with CMD-ENV, and run the independent strict typecheck during bootstrap. No product test, start, build, new runner, or model command is run.

```powershell
@'
import hashlib,json,pathlib
from html.parser import HTMLParser
root=pathlib.Path('.')
m=json.loads((root/'evaluation/rd003-scan-v1.json').read_text(encoding='utf-8'))
expected=['informative-image-alt','form-input-label','text-contrast']
assert m['version']=='rd003-scan-v1'
assert [p['id'] for p in m['profiles']]==expected
assert len(m['cases'])==6
assert len({c['revision'] for c in m['cases']})==6
assert m['scanner']['options']['runOnly']['values']==['image-alt','label','color-contrast']
class Inspect(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[]; self.markers=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  assert tag in {'html','head','meta','title','style','body','main','h1','p','img','div','span','input','label'}
  assert not any(k.startswith('on') for k in a)
  assert not any(k in a for k in ['href','srcset','action','formaction','value'])
  if 'src' in a: assert tag=='img' and a['src'].startswith('data:image/svg+xml,')
  if 'id' in a: self.ids.append(a['id'])
  if a.get('data-rd003-ready')=='true': self.markers+=1
for profile in expected:
 cases=[c for c in m['cases'] if c['profile']==profile]
 assert [c['stateRole'] for c in cases]==['failing','corrected']
 assert cases[0]['targetKey']==cases[1]['targetKey']
 for c in cases:
  assert c['path']==f"fixtures/rd003/{profile}/{c['stateRole']}.html"
  data=(root/c['path']).read_bytes()
  assert data==c['content'].encode('utf-8')
  p=Inspect(); p.feed(c['content'])
  assert p.ids==[c['targetKey']] and p.markers==1
  print(c['path'],hashlib.sha256(data).hexdigest())
assert sorted(str(p).replace('\\','/') for p in (root/'fixtures/rd003').rglob('*') if p.is_file())==sorted(c['path'] for c in m['cases'])
for name in ['package.json','package-lock.json','tsconfig.json','vite.config.ts','node_modules/axe-core/axe.js','node_modules/@axe-core/playwright/dist/index.js']:
 print(name,hashlib.sha256((root/name).read_bytes()).hexdigest())
print('Manifest, six exact authored contents, marker/target uniqueness, resource exclusions, and file inventory pass.')
'@ | python -B -
if ($LASTEXITCODE -ne 0) { throw 'RD003 structural validation failed.' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace validation failed.' }
```

#### Side-effect inventory and CMD-CLEANUP

The six named fixture files are the complete worker write scope; manifest and documentation remain primary-owned. Generated/ignored paths are **not guard scope**: `temp/rd003-evaluation/node-v24.20.0-win-x64.zip`, extracted `node-v24.20.0-win-x64/`, `npm-cache/`, `browser-install.stdout`, `browser-install.stderr`, `playwright-browsers/` (only `chromium-1234/`, `ffmpeg-1011/`, `winldd-1007/`, native `.links/`, `__dirlock`, `INSTALLATION_COMPLETE` and `DEPENDENCIES_VALIDATED` effects), and `os-temp/` (native `playwright-download-*` directories/archives and `playwright-artifacts-*` / `playwright_chromiumdev_profile-*`). Dynamic suffixes are native-owned generated paths, not wildcard deletion commands. Other generated effects stop acceptance. No server, user profile, persistent browser context, trace/video/HAR/screenshot, downloaded page content, or global cache mutation is allowed.

Every browser case closes page/context/browser after any result. AxeBuilder also creates an internal same-context blank page during finishRun (integration source lines 345–370); it is processing machinery, not a seventh fixture or scan target, and context/tree cleanup owns it. If cleanup fails, the case fails and the primary investigates owned resources before further work. Bootstrap restores its process-local environment values in `finally`; the scan supervisor changes only each child's environment, leaving its parent unchanged. The child also removes NODE_OPTIONS, NODE_PATH, DEBUG, and PWDEBUG so injected options or debug output cannot change the frozen observation path. Normal cleanup evidence requires the child's successful awaited page/context/browser closes and its timely, consistent exit; process inventory is only an additional diagnostic for visible residuals. The primary runs the inventory below after normal completion and before removing generated paths. Unavailable executable paths are counted explicitly, never treated as absence; an empty visible-owned set proves no global absence. If the query itself is permission-blocked, request narrow read-only inspection permission. Forced termination, failed close, pipe/process uncertainty, or visible residuals always preserve cleanup as unverified and stop the run. No result of this inventory, including a fully visible empty set, can promote a forced-stop result to verified cleanup or authorize deletion/continuation. Recovery after that stop requires separately scoped primary inspection and owner direction; it is not an automatic correction or rerun. A descendant is not considered gone merely because its parent exited. The current PowerShell 7.6.4/.NET 10.0.10 exposes `Process.Kill(Boolean)`; [Microsoft's process termination contract](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.kill) explains the descendant caveat, and [redirected output guidance](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.processstartinfo.redirectstandardoutput) supports draining both pipes asynchronously. No generic process service or retained runner is introduced.

```powershell
$rd003OwnedRoot = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd003-evaluation\'
$rd003ProcessRows = @(Get-CimInstance Win32_Process -ErrorAction Stop)
$rd003UnreadableCount = @($rd003ProcessRows | Where-Object { -not $_.ExecutablePath }).Count
$rd003VisibleOwned = @($rd003ProcessRows | Where-Object { $_.ExecutablePath -and $_.ExecutablePath.StartsWith($rd003OwnedRoot,[StringComparison]::OrdinalIgnoreCase) })
if ($rd003VisibleOwned.Count) {
  $rd003VisibleOwned | Select-Object ProcessId,Name
  throw 'Visible owned processes remain; cleanup is unverified and further work stops.'
}
"Diagnostic inventory: zero visible owned executables; $rd003UnreadableCount unavailable executable paths. This is not proof of process absence and cannot clear unverified cleanup."
```

Only after all six cases have normal-close evidence, no failed/unverified cleanup remains, the diagnostic reports no visible owned residuals, and required review passes may the primary remove the whole exact validated task directory with this command. Otherwise preserve the directory for recovery. Retain the task-local runtime/browser only through required review; Preserve the six authored inputs, manifest, evidence in this plan, pre-existing dependencies/caches, and all user changes. No generated runtime/browser/cache output remains after task closure.

```powershell
$ErrorActionPreference = 'Stop'
$rd003Repo = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab'
$rd003Target = Join-Path $rd003Repo 'temp\rd003-evaluation'
if ($PWD.Path -ne $rd003Repo) { throw 'Unexpected working directory.' }
$rd003Resolved = (Resolve-Path -LiteralPath $rd003Target).Path
if ($rd003Resolved -ne 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab\temp\rd003-evaluation') { throw 'Cleanup containment mismatch.' }
$rd003Entries = @((Get-Item -LiteralPath (Join-Path $rd003Repo 'temp')),(Get-Item -LiteralPath $rd003Target)) + @(Get-ChildItem -LiteralPath $rd003Target -Force -Recurse)
if ($rd003Entries | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }) { throw 'Cleanup refuses reparse topology.' }
Remove-Item -LiteralPath $rd003Resolved -Recurse -Force
if (Test-Path -LiteralPath $rd003Target) { throw 'Cleanup incomplete.' }
'Removed only the validated RD-003 task-local runtime, browser/tool cache, archives, logs, and temp directory.'
```

**Decide now/prove later:** All literals, outcomes, projection/failure semantics, commands, paths, and side effects above must pass synthesis/review before setup. Setup later proves actual Node/npm identities, browser launch/version, exact content, native target/rule observations, measurements, and cleanup. It cannot select new meaning. All RD3 invariants remain applicable; no task Verification or completed scan claim follows from this outline.

`RD003-SYNTHESIS-001` returned `RETURN FOR RESEARCH` on outline 001 (SHA-256 `9f7f847ced6ff2c79f41c26a1025ed652d3c376213ced979820f3aba67f188be`). Its one permitted correction produced outline 002: literal scanner/context objects, supervised per-state processes, preserved invalid individual facts, consistent unavailability categories, executable pre-mutation checks, and auxiliary-page inventory. No fixture, manifest, browser setup, or scan occurred. The original research report/follow-up budgets remain unchanged.

`RD003-SYNTHESIS-002` (2026-08-30): the same analyst's sole correction pass returned `OWNER DIRECTION` on complete plan SHA-256 `a909ece64eda138676299ea9f7c383742facefc5e75994fabad869f588497dd0`; the primary independently verified that file hash before disposition. The original findings are resolved. The remaining RD3-I9 gap also affects I1/I2: CMD-CLEANUP filters out `Win32_Process` rows with unavailable `ExecutablePath`, so a successful but partially visible query can print a false absence conclusion. The prose then permits that result to clear previously unverified forced-stop cleanup. [Microsoft's termination contract](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.kill?view=net-10.0) warns that uninspectable descendants can be skipped and parent exit does not prove descendant exit. No process leak was observed; nothing was provisioned or launched. The normal-close path is consistently specified but unexecuted.

Primary disposition: accept this decisive contract finding and stop. A correction must establish adequate visibility for the owned process tree or preserve cleanup as unverified and stop for narrow inspection permission; silently ignoring unavailable executable paths cannot establish cleanup. Do not implement this correction or claim `DRAFT READY` under the exhausted analyst allowance. The critical evidence researcher has one unused follow-up, the browser researcher used its sole follow-up, and the analyst used its sole correction; none of those budgets is reset. No pre-draft/final research reviewer, implementation worker, write lease, S3 slice reviewer, or integrated reviewer was invoked because their entry barriers did not pass. Owner direction is required only for a bounded continuation allowance, not for another product or architecture choice.

`RD003-ALLOWANCE-001` (2026-08-30): the owner authorized exactly one additional cleanup-contract correction and analyst recheck after the documented stop. This is an explicit extension of that exhausted allowance, not a reset of the original budget. Outline 003 changes only cleanup acceptance: successful native closes plus timely child exit support normal cleanup; the process inventory reports unavailable paths and is diagnostic only; any forced/uncertain cleanup stays unverified and stops, regardless of inventory output. No new process mechanism, file, fixture, browser setting, expected outcome, or dependency is introduced. The same analyst performs this one recheck; both fresh critical research checkpoints and all later gates remain required. Another decisive recheck failure stops for owner direction.

`RD003-SYNTHESIS-003` (2026-08-30): the same analyst's single additional owner-authorized recheck returned `DRAFT READY`, with no remaining decide-now blocker, on plan SHA-256 `1b026181304537cad22b363cc204402d05322e5ee01e699b9132e44c448b9cd0`. Primary verified that exact hash before result-only recording. All nine invariants are covered for drafting readiness; normal-close evidence and diagnostic inventory are distinct, and forced/uncertain cleanup cannot be promoted. Source hashes remain current. The supported DOM projection and embedded-image `setContent` choices are unchanged. Actual runtime, all six native observations, required measurements, and cleanup remain unproved. The additional analyst allowance is consumed; both original fresh research checkpoints remain required, starting with the pre-draft review.

`RD003-PREDRAFT-001` (2026-08-30): a fresh `critical_research_reviewer` returned `PASS WITH FOLLOW-UPS` after reviewing the complete contract and all nine invariants at plan SHA-256 `188ffc3134603f58b7b100f2c9367bb34fb3e1e3a2ec070e78752ffc624c5427`, independently confirmed by the primary. There were no Blockers or Majors. Minor `RD003-PRE-F01` identified a stale current-summary sentence claiming the analyst recheck was pending; primary corrected it to the actual `DRAFT READY` result without changing the execution contract. The reviewer reproduced all six prerequisite/source hashes, relevant installed-source mechanics, seven PowerShell and the complete inline JavaScript parse, and 21 isolated projection cases; it reused the 27-check guard result and prior official Node checksum observation. No native case ran. Primary accepts the pre-draft gate and the clarified observation ownership: worker fixture/provisioning validation, then primary direct native observation after lease closure. The different fresh final literal-artifact review remains mandatory before setup.

`RD003-MANIFEST-001` (2026-08-30): primary authored [the scan-only manifest](../../evaluation/rd003-scan-v1.json), SHA-256 `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`, outside any worker lease. It contains three profiles, six exact content definitions and future fixture references, native expectations, stable paired targets/revisions, literal browser/scanner/readiness/deadline settings, evidence-policy mappings, unavailable categories, and limitations. Primary readback verified equality with the reviewed browser/scanner objects and all six HTML blocks, JSON shape/counts and version, final newline, and absence of fixture/runtime/lease state. Its freeze status describes fixed evaluation inputs, not successful native execution. The final literal-artifact checkpoint is pending; no worker may select or edit this artifact.

`RD003-LITERAL-REVIEW-001` (2026-08-30): a different fresh `critical_research_reviewer` returned `PASS`, with no Blocker, Major, or Minor findings, on manifest SHA-256 `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459` and plan SHA-256 `7bc6218ae245ad5e7b58ccebe34481c6d845b800a8aa6bf98b53e631f3b8b119`. Primary independently verified both identities before result-only recording and accepts every invariant's contract-stage result. The reviewer reproduced artifact/source identities, exact content/options, JSON/resource/target checks, PowerShell/JavaScript syntax, 21 field-projection cases, and documentation checks; it reused prior guard/browser and official checksum evidence. No source evidence was invalidated, no research-artifact correction cycle was needed, and no native execution is implied. Existing developer/evaluation-owner documentation updates remain closure obligations after actual observations.

`RD003-SETUP-PACKET-001`: the next bounded assignment is workflow `RD003-20260830-01`, task `RD-003`, slice `RD003-SETUP-01`, phase `setup`, attempt 1, lease `RD003-SETUP-01-setup-01`, owner `rd003-setup-worker-01`, role `code_worker`; correction parent None. The complete Milestone Assignment Packet v2 is issued through the coordinating assignment, not duplicated as a transcript here. It allows only the six manifest-named HTML files, no directory roots, with documentation/evaluation/application/test/agent/configuration paths forbidden and generated effects kept outside guard scope. Worker commands are CMD-BOOTSTRAP, CMD-FIXTURE, and CMD-VALIDATE only. After terminal compliant closure and actual file inspection, the primary runs the unchanged CMD-SCAN once per state. TDD is Not applicable; structural, source/runtime, strict compiler, native, and review evidence replace it. One initial worker turn and at most one separately authorized same-contract correction remain; any changed contract or decisive failure stops. The fresh guard digest and terminal evidence will be recorded only after closure, never by editing documentation during a lease.


### Stopped bootstrap and bounded correction proposal

`RD003-SETUP-RESULT-001` (2026-08-30): one `code_worker` received the complete packet v2 for workflow `RD003-20260830-01`, slice `RD003-SETUP-01`, setup attempt 1, lease `RD003-SETUP-01-setup-01`, owner `rd003-setup-worker-01`, with correction parent None. Dispatch plan SHA-256 was `d9739b09f3fee9642aaa339fd3951862e24cdf5df9ffcd55e0bfce19fc2a3768`; manifest SHA-256 remains `13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459`. Only the six enumerated HTML paths were allowed; generated effects were separately bounded and never guard scope. TDD remained Not applicable.

The worker executed CMD-BOOTSTRAP verbatim once with approved acquisition permissions. Node ZIP checksum and actual Node `24.20.0` / npm `11.19.0` checks passed. The installer exited successfully after downloading Chromium `1234` / `151.0.7922.34`, FFmpeg `1011`, and Winldd `1007`. The next expression, `r(p+'/package.json').version`, failed for `@axe-core/playwright` with `ERR_PACKAGE_PATH_NOT_EXPORTED`; the supervisor reported `Dependency identity mismatch.` and exited 1. This is an inspection-command failure, not evidence of a changed dependency version. The worker stopped without a retry, fixture write, strict typecheck, native scan, or cleanup and restored its process-local environment in the command's finally block.

Primary freshly closed the exact lease with contract digest `3152917f8e3a7dda7a81289293d129975a622abe954861c6600e6206a64b9845`: exit 0, `closed-compliant`, receipt digest `c6190e7e9ac10afe28f97bc32bbede0a5db8b6352df030f4420523afb1f1ddd0`, no replay flag, no changed endpoints, and no sealed Git-state drift. Before documentation edits, pinned status also exited 0 with `post_close_drift:false`. Primary inspected the actual tree and installer logs: no fixture directory exists, all pre-existing planning changes are preserved, and no application/test/configuration path changed. The receipt accepts path compliance only; the setup handoff is `ESCALATE`, not accepted setup.

`RD003-SETUP-TRIAGE-001`: primary read-only inspection found 2,385 ordinary files totaling 595,784,508 bytes under `temp/rd003-evaluation`, no reparse points, and only the previously permitted top-level runtime/archive/cache/log directories and files. The npm-cache and os-temp directories were empty. Installer stderr was empty. Exact post-failure identities:

| Retained input or binary | SHA-256 / observed identity |
| --- | --- |
| Official Node ZIP | `6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba` |
| Extracted node.exe | `5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5`; actual `v24.20.0` |
| Bundled npm CLI | Actual `11.19.0` |
| Managed chrome.exe | `409805a16d6416087e6b2f778df1cf8f7bbb267d6b99f6b5bb0a618eace234f2`; file/product version `151.0.7922.34` |
| Six CMD-ENV source/configuration hashes | All unchanged from the frozen values |
| Global Node/npm | Unchanged `24.18.0` / `11.16.0` |

These observations do not prove a Chromium launch, native scanner outcome, or typecheck. Reading each fixed installed package's JSON from its filesystem path and comparing its version to the lock passed under the selected Node, as did loading `axe-core` and checking its actual `version === '4.13.0'`. An earlier primary diagnostic added an unnecessary TypeScript entry-path assumption and failed because TypeScript 7 exports `lib/version.cjs`; that assumption was rejected and is not proposed for the frozen command. No dependency, expectation, or retained evidence field was changed.

The exact frozen process diagnostic first met sandbox access denial; a narrowly approved read-only invocation returned zero visible owned executables and 167 unavailable executable paths. It neither proves process absence nor clears cleanup. No browser case started and no forced termination was reported, but the current deletion gate requires all six normal-close results and review; it is unsatisfied. Preserve the entire task-local output directory. No automatic deletion, redownload, process termination, or scan retry is authorized at this stop.

`RD003-COMMAND-PROPOSAL-001` is a non-binding correction proposal, not a replacement for CMD-BOOTSTRAP: replace only the failing metadata expression with `JSON.parse(fs.readFileSync('node_modules/'+p+'/package.json')).version`, retaining the same exact five-package list, lock equality checks, selected Node, and actual axe version check. The isolated read-only expression passed; the full revised setup procedure has not been executed or accepted. Existing acquired files mean the original bootstrap's absent-directory precondition also cannot simply be rerun. Proposed continuation is to preserve the failed command and result, version the corrected command/precondition record, explicitly reverify and reuse the already acquired runtime/browser with no new installation or deletion, and retain the original strict typecheck and six-file authoring/validation obligations.

The owner decision is limited to that command correction and generated-state reuse/rescoping. Before another write turn, primary must freeze the complete revised procedure, reconcile the DRC and applicable fresh R3 review barrier with its remaining allowance, and issue a new complete packet and lease under the canonical workflow. No old lease is reusable; a changed binding field is not an automatic same-contract attempt-2 correction. The single no-diff handoff and all consumed research/analyst allowances remain recorded; no budget or review is reset. Fixture contents, manifest, browser/scanner profile, expected native outcomes, minimization, exactly six future observations, and M1 exclusion remain unchanged. S3 slice review, different integrated review, roadmap Verification, cleanup, completion, and archive remain pending.

Documentation impact: the living plan, roadmap, root/documentation/requirements/delivery summaries, and plan/progress indexes and record reflect this accepted failure and Blocked status. The primary-owned manifest is unchanged. No requirement row, ADR, evaluation policy, dependency pin, global installation, or developer command is revised; no native evidence or completion is claimed.

`RD003-BOOTSTRAP-BLOCKED-VALIDATION-001` (2026-08-30): primary inspected the actual tracked diff and current plan/progress record. Validation passed 475 relative links and 104 anchors, all 15 plan sections and nine invariants, JSON parsing and manifest three-profile/six-case counts, current Blocked status and all 25 unstarted application tasks, final-newline/trailing-whitespace checks, and `git diff --check`. The four toolchain files, six frozen source/configuration hashes, manifest hash, HEAD, branch, and empty index remain unchanged. All seven PowerShell blocks remain present; bootstrap, scan, cleanup, and process-diagnostic blocks exactly match their frozen in-memory identities. No fixture/source/test path or active lease exists. Preserved generated files are not cleanup proof. This validates the stopped handoff only; task Verification and both implementation reviews remain pending.

Current non-ignored changed-file inventory: `README.md`, `docs/DEVELOPMENT_ROADMAP.md`, `docs/PROJECT_REQUIREMENTS.md`, `docs/README.md`, `docs/plans/README.md`, `docs/plans/rd-003-scan-evaluation-boundary.md`, `docs/progress/README.md`, `docs/progress/rd-003-scan-evaluation-boundary.md`, `docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md`, and `evaluation/rd003-scan-v1.json`. The nine documents were already changed/new at execution entry; the manifest was primary-authored after the research barriers. The stopped worker added no non-ignored file. No commit, push, archive, or M1 selection occurred.

### Authorized procedure correction — RD003-PROCEDURE-002

RD003-ALLOWANCE-002 (2026-08-30): the owner authorized the bounded package-inspection correction, required fresh review, and reuse of downloaded prerequisites. This authorizes rescoping the stopped setup procedure; it does not reset research, synthesis, review, or worker budgets, change the manifest, or authorize M1.

Procedure version 002 supersedes only the original CMD-ENV absent-output assumption and CMD-BOOTSTRAP acquisition procedure for this preserved checkout. Both original command blocks and their failed result remain historical evidence and must not be rerun here. The single replacement CMD-RESUME below verifies exact preserved identities/topology, reads installed package metadata through filesystem paths, and performs the unchanged selected-runtime strict typecheck. It performs no download, extraction, installation, removal, or browser launch. CMD-RESTORE and CMD-CLEAN-PREP remain None. CMD-FIXTURE, CMD-VALIDATE, primary CMD-SCAN, diagnostic inventory, and CMD-CLEANUP remain byte-identical to reviewed outline 003. The manifest remains rd003-scan-v1 at SHA-256 13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459: no fixture/profile/evidence-policy value changed, so no manifest version is rewritten.

Fresh primary inspection confirmed HEAD f16c6f0, the same ten changed/new paths, absent fixture/source/test directories, no active lease, Python 3.12.10, Git 2.53.0.windows.1, PowerShell 7.6.4/.NET 10.0.10, all ten hashes below, and selected Node/package/source identities. The read-only prefix through the “no browser launched” message passed. Actual npm and strict compiler execution are worker obligations after the task-local environment is set. They are not accepted from metadata or historical RD-002 evidence.

**Inventory correction:** the earlier claim that os-temp was empty was incorrect. Its existing node-compile-cache/v24.20.0-x64-964aae3f contains 70 ordinary eight-hex-digit files (270,576 bytes), already included in the unchanged 2,385-file / 595,784,508-byte aggregate. Bundled npm lib/cli.js:2–5 calls enableCompileCache(); the cache dates to the original bootstrap. This is source-supported generated runtime data, not fixture/page evidence. Preserve it. CMD-RESUME explicitly permits additions/updates only to that same cache's ordinary eight-hex-digit files from npm/strict-check execution, plus the task-local npm-cache effects already bounded by the original command. npm-cache is initially empty; os-temp initially contains only this compile-cache directory. All are ignored effects outside guard proof. No cache outside the task root is selected. The primary's initial draft empty-directory predicate was rejected before freezing this revision; no worker retry occurred.

The change fixes command compatibility and explicitly accounts for already acquired generated state. It introduces no new decision-critical subsystem or evidence/cleanup semantics, so the accepted R3 synthesis/pre-draft conclusion remains applicable; no analyst allowance is reopened. Under the R3 correction protocol, a different fresh critical_research_reviewer must review the complete current plan and unchanged literal manifest, every RD3-I1–I9 invariant, and the changed command/effect record before setup. This uses the first final-artifact correction cycle and the owner's named fresh-review authorization; no correction cycle is reset. Any new Blocker/Major outside the named correction returns to the owner.

**Rescoped setup assignment:** retain the one logical slice RD003-SETUP-01; its owner-authorized execution revision is RD003-SETUP-01R1 (guard cycle ID), workflow RD003-20260830-01, lease/assignment RD003-SETUP-01R1-setup-01, setup attempt 1, correction parent None, owner rd003-setup-worker-02, a fresh code_worker at its configured Sol medium. This is a replacement procedure within RD-003, not a new roadmap task or additional slice outcome. Historical predecessor is terminal lease RD003-SETUP-01-setup-01; do not pretend the binding command change is an automatic same-contract attempt-2 follow-up. Only one resumed write turn is allowed; zero further worker corrections. The first failure/no-diff handoff remains counted, so another no-diff handoff or repeated decisive failure stops. The path lists remain exactly the prior six-file scope with no allowed roots. Manifest, all evidence/docs, and native observation remain primary-owned; no documentation edit occurs during the lease. Terminal closure and actual file/results inspection precede primary scans.

#### CMD-RESUME — selected-runtime checks over preserved acquisition

Run this exact block once in the worker lease after the correction review passes, from the repository root. Expected exit 0, confirmed selected package/Node/npm identities, and successful existing strict/no-emit typecheck. Only the six later CMD-FIXTURE writes and the separately enumerated temporary cache effects are permitted. The worker must stop on any failure; it cannot repair a command, acquire missing input, run a scan, or clean up.

```powershell
$ErrorActionPreference = 'Stop'
$rd003Repo = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab'
if ($PWD.Path -ne $rd003Repo) { throw 'Unexpected working directory.' }
$rd003Temp = Join-Path $rd003Repo 'temp\rd003-evaluation'
if (-not (Test-Path -LiteralPath $rd003Temp -PathType Container)) { throw 'Expected preserved task directory is missing.' }
foreach ($rd003Parent in @($rd003Repo,(Join-Path $rd003Repo 'temp'),$rd003Temp)) {
  if ((Get-Item -LiteralPath $rd003Parent).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Reparse point.' }
}
if (@(Get-ChildItem -LiteralPath $rd003Temp -Recurse -Force | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }).Count) { throw 'Reparse point below task root.' }
$rd003AllowedNames = @('node-v24.20.0-win-x64','npm-cache','os-temp','playwright-browsers','browser-install.stdout','browser-install.stderr','node-v24.20.0-win-x64.zip')
if (@(Get-ChildItem -LiteralPath $rd003Temp -Force | Where-Object { $_.Name -notin $rd003AllowedNames }).Count) { throw 'Unexpected generated path.' }
$rd003BrowserNames = @('.links','chromium-1234','ffmpeg-1011','winldd-1007')
if (@(Get-ChildItem -LiteralPath (Join-Path $rd003Temp 'playwright-browsers') -Force | Where-Object { $_.Name -notin $rd003BrowserNames }).Count) { throw 'Unexpected browser-cache entry.' }
if (-not (Test-Path -LiteralPath (Join-Path $rd003Temp 'npm-cache') -PathType Container) -or @(Get-ChildItem -LiteralPath (Join-Path $rd003Temp 'npm-cache') -Force).Count) { throw 'Expected empty npm cache.' }
if (-not (Test-Path -LiteralPath (Join-Path $rd003Temp 'os-temp') -PathType Container)) { throw 'Missing task temporary directory.' }
if (@(Get-ChildItem -LiteralPath (Join-Path $rd003Temp 'os-temp') -Force | Where-Object { $_.Name -ne 'node-compile-cache' }).Count) { throw 'Unexpected temporary entry.' }
$rd003CompileCache = Join-Path $rd003Temp 'os-temp\node-compile-cache\v24.20.0-x64-964aae3f'
if (-not (Test-Path -LiteralPath $rd003CompileCache -PathType Container)) { throw 'Expected npm compile cache is missing.' }
if (@(Get-ChildItem -LiteralPath (Split-Path $rd003CompileCache) -Force | Where-Object { $_.Name -ne 'v24.20.0-x64-964aae3f' }).Count) { throw 'Unexpected compile-cache version.' }
if (@(Get-ChildItem -LiteralPath $rd003CompileCache -Force | Where-Object { $_.PSIsContainer -or $_.Name -notmatch '^[0-9a-f]{8}$' }).Count) { throw 'Unexpected compile-cache entry.' }
foreach ($rd003Browser in @('chromium-1234','ffmpeg-1011','winldd-1007')) {
  foreach ($rd003Marker in @('INSTALLATION_COMPLETE','DEPENDENCIES_VALIDATED')) {
    if (-not (Test-Path -LiteralPath (Join-Path $rd003Temp "playwright-browsers\$rd003Browser\$rd003Marker") -PathType Leaf)) { throw 'Missing browser installation marker.' }
  }
}
$rd003ExpectedHashes = @{
  'package.json'='c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98'
  'package-lock.json'='ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553'
  'tsconfig.json'='3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde'
  'vite.config.ts'='8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07'
  'node_modules/axe-core/axe.js'='138a93a4ce7b7c6c08ed84144e45dcd8cc36d2d4ff8ed673619faf0406906d88'
  'node_modules/@axe-core/playwright/dist/index.js'='9a4f63fad34eb93fe99dc3dde41dc21d0614e5956d524f288b029634cbd6b39d'
  'evaluation/rd003-scan-v1.json'='13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459'
  'temp/rd003-evaluation/node-v24.20.0-win-x64.zip'='6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba'
  'temp/rd003-evaluation/node-v24.20.0-win-x64/node.exe'='5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5'
  'temp/rd003-evaluation/playwright-browsers/chromium-1234/chrome-win64/chrome.exe'='409805a16d6416087e6b2f778df1cf8f7bbb267d6b99f6b5bb0a618eace234f2'
}
foreach ($rd003Entry in $rd003ExpectedHashes.GetEnumerator()) {
  if ((Get-FileHash -LiteralPath (Join-Path $rd003Repo $rd003Entry.Key) -Algorithm SHA256).Hash.ToLowerInvariant() -ne $rd003Entry.Value) { throw "Identity mismatch: $($rd003Entry.Key)" }
}
git check-ignore -q -- temp/rd003-evaluation
if ($LASTEXITCODE -ne 0) { throw 'Task outputs must remain ignored.' }
$rd003Runtime = Join-Path $rd003Temp 'node-v24.20.0-win-x64'
$rd003Node = Join-Path $rd003Runtime 'node.exe'
if ((& $rd003Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Node mismatch.' }
& $rd003Node --input-type=module -e "import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire}from'node:module';const r=createRequire(import.meta.url);const lock=JSON.parse(fs.readFileSync('package-lock.json'));for(const p of ['playwright','playwright-core','@axe-core/playwright','axe-core','typescript'])assert.equal(JSON.parse(fs.readFileSync('node_modules/'+p+'/package.json')).version,lock.packages['node_modules/'+p].version);assert.equal(r('axe-core').version,'4.13.0');console.log('Selected runtime and installed scanner dependency identities verified.');"
if ($LASTEXITCODE -ne 0) { throw 'Dependency identity mismatch.' }
'Preserved prerequisites and bounded generated-state topology verified; no browser launched.'
$rd003EnvNames = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','TMPDIR','TMP','TEMP','PATH')
$rd003OldEnv = @{}
foreach ($rd003Name in $rd003EnvNames) { $rd003OldEnv[$rd003Name] = [Environment]::GetEnvironmentVariable($rd003Name,'Process') }
try {
  $env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $rd003Temp 'playwright-browsers'
  $env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = '120000'
  $env:TMPDIR = Join-Path $rd003Temp 'os-temp'
  $env:TMP = $env:TMPDIR
  $env:TEMP = $env:TMPDIR
  $env:PATH = $rd003Runtime + ';' + $env:PATH
  if ((& $rd003Node (Join-Path $rd003Runtime 'node_modules\npm\bin\npm-cli.js') --version) -ne '11.19.0' -or $LASTEXITCODE -ne 0) { throw 'npm mismatch.' }
  & $rd003Node (Join-Path $rd003Runtime 'node_modules\npm\bin\npm-cli.js') --global=false --prefix $rd003Repo --cache (Join-Path $rd003Temp 'npm-cache') --ignore-scripts=true --audit=false --fund=false --update-notifier=false --logs-max=0 run typecheck
  if ($LASTEXITCODE -ne 0) { throw 'Strict typecheck failed.' }
} finally {
  foreach ($rd003Name in $rd003EnvNames) { [Environment]::SetEnvironmentVariable($rd003Name,$rd003OldEnv[$rd003Name],'Process') }
}
```

All remaining command slots, finite scan/readiness bounds, expected outcomes, failure handling, and cleanup gates remain those of outline 003. The complete revised artifact awaits fresh correction review; no new lease or scan is authorized by this paragraph alone.

RD003-PROCEDURE-REVIEW-001 (2026-08-30): a different fresh critical_research_reviewer returned PASS with no Blocker, Major, or Minor on the complete plan SHA-256 7f816956b51d0beef47e8e611c556e625f9a5d1d3f42a10419156c573e2c0863 and unchanged manifest SHA-256 13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459. Primary independently checked both identities and accepts all RD3-I1–I9 contract results and the rescoping/budget interpretation. The reviewer reproduced the permitted prefix, ten hashes, eight PowerShell parses, content/profile equality, receipt facts, and unchanged 2,385-file inventory/70 compile-cache hashes without npm, typecheck, browser, or writes. Existing source/projection/guard evidence remains applicable. This consumes the first final-artifact correction review; no further correction was needed. Runtime/typecheck, six fixtures, native observations, generated-effect inspection, S3/integrated reviews, cleanup, and roadmap Verification remain pending. The next packet is RD003-SETUP-01R1-setup-01 under the scope and one-turn/zero-correction allowance above.

### Accepted setup and native observations — RD003-OBSERVATIONS-001

On 2026-08-30 (UTC), the primary accepted the bounded preparation from fresh code_worker assignment RD003-SETUP-01R1-setup-01, after owner-authorized procedure correction and its passing review. Exact CMD-RESUME ran once and exited 0: Node 24.20.0, actual npm 11.19.0, locked dependencies/ten hashes, and the existing strict tsc --project tsconfig.json check passed. The worker wrote only the six frozen files with apply_patch and ran exact CMD-VALIDATE once, exit 0. No worker scan or evidence write occurred.

Primary freshly closed the lease with digest 8465cfcdc58296b9e1fc16976a493637d3061c29918d94295901c5d4c97edf8a. Close exited 0, closed-compliant, receipt 2ce275540f2965778bb74866804e37c469464adabf4d226885fd2107b1c9f619, no replay. Only six allowed creations were present; no other endpoint, index, HEAD/ref, or ignore-control change occurred. Pinned status then exited 0 with post_close_drift:false before any primary documentation edit. Primary read all six actual files and independently reproduced CMD-VALIDATE, including byte equality, target/marker uniqueness, resources, exact file inventory, and the six unchanged source/configuration hashes. The existing strict result is accepted with that unchanged type boundary; HTML fixtures add no TypeScript input, so no duplicate compiler run was needed.

| Fixture | Actual UTF-8/LF SHA-256 |
| --- | --- |
| informative-image-alt/failing.html | bc54dd14df90931d8a5c75544e97a61f15d070550aa8602e850d1255749c308e |
| informative-image-alt/corrected.html | e6b9aea2773848540ac247063860690298dc05c886ae29f8627d4e6be93246e1 |
| form-input-label/failing.html | 5cc916a6e9b497019ebdd962c5676ea9e8687a2ddf8b027a92912beafd6fe17b |
| form-input-label/corrected.html | 6c0c66389d368e201af3a8ce83558abb15df86e5c5eb99d317bfdf2e82a09d43 |
| text-contrast/failing.html | bbf242eeb12489801db17978e059045c587a6be239d51d53b59212548788fc4b |
| text-contrast/corrected.html | 01f9bb19f6bd0612ad01a4fbc5f93f766a5a66a55b626271601b75c60b7c2436 |

All paths above are under fixtures/rd003/. The original failed setup remains preserved; the resumed turn used no correction, additional fixture, or budget reset.

After terminal acceptance and actual-file inspection, PRIMARY executed the unchanged CMD-SCAN once, with narrowly approved local browser execution. It ran exactly six isolated state processes and exited 0. Every case emitted browserVersion 151.0.7922.34 and engineVersion 4.13.0, passed its frozen native assertions, and reported completed/cleanup closed after awaited page/context/browser closes and timely consistent child exit. No forced termination, incomplete observation, extra violation, unavailable required measurement, or request attempt occurred. No other browser batch ran. These are actual native observations, separate from the manifest's authored expectations.

| Profile | Failing native bucket/target | Corrected native bucket/same target | Decisive retained evidence |
| --- | --- | --- | --- |
| informative-image-alt | violations / #rd3-image | passes / #rd3-image | alt absent → nonempty; native has-alt on correction |
| form-input-label | violations / #rd3-email | passes / #rd3-email | explicit association none → one; native explicit-label and nonempty name category |
| text-contrast | violations / #rd3-text | passes / #rd3-text | native contrast 3.54 → 15.9; expected 4.5:1 in both |

The JSON below is the exact allowlisted stdout projection, grouped into one array for readability; it is not a raw scanner payload. Coverage retains only rule/bucket counts. All unrelated pass/inapplicable node data stayed transient. Missing optional native name/reason facts remain explicitly unavailable; check IDs have no invented per-check booleans. The 3.54 and 15.9 measurements were copied from native contrast data, not calculated from fixture colors. Native font size was 12.0pt (16px), weight normal, with foreground/background values preserved under the frozen transformation.

```json
[
  {
    "manifest": "rd003-scan-v1",
    "evidencePolicy": "rd003-evidence-v1",
    "scenario": "informative-image-alt",
    "revision": "informative-image-alt-v1-failing",
    "stateRole": "failing",
    "fixtureTargetKey": "rd3-image",
    "status": "completed",
    "observations": [
      {
        "rule": "image-alt",
        "nativeBucket": "violations",
        "targetMatch": true,
        "locator": "#rd3-image",
        "checks": {
          "any": [
            "has-alt",
            "aria-label",
            "aria-labelledby",
            "non-empty-title",
            "presentational-role"
          ],
          "all": [],
          "none": []
        },
        "facts": {
          "elementKind": "img",
          "altState": "absent"
        }
      }
    ],
    "browserVersion": "151.0.7922.34",
    "engineVersion": "4.13.0",
    "coverage": {
      "image-alt": {
        "violations": 1
      },
      "label": {
        "inapplicable": 0
      },
      "color-contrast": {
        "passes": 2
      }
    },
    "cleanup": "closed"
  },
  {
    "manifest": "rd003-scan-v1",
    "evidencePolicy": "rd003-evidence-v1",
    "scenario": "informative-image-alt",
    "revision": "informative-image-alt-v1-corrected",
    "stateRole": "corrected",
    "fixtureTargetKey": "rd3-image",
    "status": "completed",
    "observations": [
      {
        "rule": "image-alt",
        "nativeBucket": "passes",
        "targetMatch": true,
        "locator": "#rd3-image",
        "checks": {
          "any": [
            "has-alt"
          ],
          "all": [],
          "none": [
            "alt-space-value"
          ]
        },
        "facts": {
          "elementKind": "img",
          "altState": "nonempty"
        }
      }
    ],
    "browserVersion": "151.0.7922.34",
    "engineVersion": "4.13.0",
    "coverage": {
      "image-alt": {
        "passes": 1
      },
      "label": {
        "inapplicable": 0
      },
      "color-contrast": {
        "passes": 2
      }
    },
    "cleanup": "closed"
  },
  {
    "manifest": "rd003-scan-v1",
    "evidencePolicy": "rd003-evidence-v1",
    "scenario": "form-input-label",
    "revision": "form-input-label-v1-failing",
    "stateRole": "failing",
    "fixtureTargetKey": "rd3-email",
    "status": "completed",
    "observations": [
      {
        "rule": "label",
        "nativeBucket": "violations",
        "targetMatch": true,
        "locator": "#rd3-email",
        "checks": {
          "any": [
            "implicit-label",
            "explicit-label",
            "aria-label",
            "aria-labelledby",
            "non-empty-title",
            "non-empty-placeholder",
            "presentational-role"
          ],
          "all": [],
          "none": []
        },
        "facts": {
          "elementKind": "input",
          "inputType": "email",
          "ariaLabelState": "absent",
          "ariaLabelledbyState": "absent",
          "titleState": "absent",
          "placeholderState": "absent",
          "roleState": "absent",
          "explicitAssociation": "none",
          "implicitAssociation": "none"
        },
        "nativeExplicitNameState": {
          "unavailable": "missing"
        }
      }
    ],
    "browserVersion": "151.0.7922.34",
    "engineVersion": "4.13.0",
    "coverage": {
      "image-alt": {
        "inapplicable": 0
      },
      "label": {
        "violations": 1
      },
      "color-contrast": {
        "passes": 3
      }
    },
    "cleanup": "closed"
  },
  {
    "manifest": "rd003-scan-v1",
    "evidencePolicy": "rd003-evidence-v1",
    "scenario": "form-input-label",
    "revision": "form-input-label-v1-corrected",
    "stateRole": "corrected",
    "fixtureTargetKey": "rd3-email",
    "status": "completed",
    "observations": [
      {
        "rule": "label",
        "nativeBucket": "passes",
        "targetMatch": true,
        "locator": "#rd3-email",
        "checks": {
          "any": [
            "explicit-label"
          ],
          "all": [],
          "none": [
            "hidden-explicit-label"
          ]
        },
        "facts": {
          "elementKind": "input",
          "inputType": "email",
          "ariaLabelState": "absent",
          "ariaLabelledbyState": "absent",
          "titleState": "absent",
          "placeholderState": "absent",
          "roleState": "absent",
          "explicitAssociation": "one",
          "implicitAssociation": "none"
        },
        "nativeExplicitNameState": "nonempty"
      }
    ],
    "browserVersion": "151.0.7922.34",
    "engineVersion": "4.13.0",
    "coverage": {
      "image-alt": {
        "inapplicable": 0
      },
      "label": {
        "passes": 1
      },
      "color-contrast": {
        "passes": 3
      }
    },
    "cleanup": "closed"
  },
  {
    "manifest": "rd003-scan-v1",
    "evidencePolicy": "rd003-evidence-v1",
    "scenario": "text-contrast",
    "revision": "text-contrast-v1-failing",
    "stateRole": "failing",
    "fixtureTargetKey": "rd3-text",
    "status": "completed",
    "observations": [
      {
        "rule": "color-contrast",
        "nativeBucket": "violations",
        "targetMatch": true,
        "locator": "#rd3-text",
        "checks": {
          "any": [
            "color-contrast"
          ],
          "all": [],
          "none": []
        },
        "facts": {
          "elementKind": "p"
        },
        "measurements": {
          "fgColor": "#888888",
          "bgColor": "#ffffff",
          "contrastRatio": 3.54,
          "expectedContrastRatio": "4.5:1",
          "fontSize": "12.0pt (16px)",
          "fontWeight": "normal"
        },
        "nativeReason": {
          "unavailable": "missing"
        }
      }
    ],
    "browserVersion": "151.0.7922.34",
    "engineVersion": "4.13.0",
    "coverage": {
      "image-alt": {
        "inapplicable": 0
      },
      "label": {
        "inapplicable": 0
      },
      "color-contrast": {
        "violations": 1,
        "passes": 1
      }
    },
    "cleanup": "closed"
  },
  {
    "manifest": "rd003-scan-v1",
    "evidencePolicy": "rd003-evidence-v1",
    "scenario": "text-contrast",
    "revision": "text-contrast-v1-corrected",
    "stateRole": "corrected",
    "fixtureTargetKey": "rd3-text",
    "status": "completed",
    "observations": [
      {
        "rule": "color-contrast",
        "nativeBucket": "passes",
        "targetMatch": true,
        "locator": "#rd3-text",
        "checks": {
          "any": [
            "color-contrast"
          ],
          "all": [],
          "none": []
        },
        "facts": {
          "elementKind": "p"
        },
        "measurements": {
          "fgColor": "#222222",
          "bgColor": "#ffffff",
          "contrastRatio": 15.9,
          "expectedContrastRatio": "4.5:1",
          "fontSize": "12.0pt (16px)",
          "fontWeight": "normal"
        },
        "nativeReason": {
          "unavailable": "missing"
        }
      }
    ],
    "browserVersion": "151.0.7922.34",
    "engineVersion": "4.13.0",
    "coverage": {
      "image-alt": {
        "inapplicable": 0
      },
      "label": {
        "inapplicable": 0
      },
      "color-contrast": {
        "passes": 2
      }
    },
    "cleanup": "closed"
  }
]
```

Post-scan inspection at 2026-08-30T04:26:55Z found only the permitted 2,408 generated files / 595,825,280 bytes, no reparse points, an empty npm-cache, and only node-compile-cache under os-temp. The 93 compile-cache files / 311,348 bytes account for the entire growth from accepted bootstrap state; native browser profiles/artifact directories were gone. Node/browser and manifest hashes remain unchanged. The exact approved diagnostic returned zero visible owned executables and 166 unavailable executable paths. That diagnostic is supplementary, not proof of global process absence; the six awaited closes and timely exits provide normal cleanup evidence. Task-local acquisition files remain intentionally preserved until required reviews pass; deletion and closure are not yet complete.

Primary accepts this observed six-state result for S3 slice review. It establishes only this scan-evaluation boundary, not application behavior, public-URL containment, statistical repeatability, conformance, provider/model quality, or release support. No raw scanner/page payload, screenshot, trace, arbitrary name/text/URL/form value, or general pass archive was retained. Test relevance: six static canonical fixtures remain; no product test/probe/generator/helper/snapshot/skip marker or application suite exists. M1-01 remains unselected.

RD003-NATIVE-VALIDATION-001: primary verification passed 495 relative links/111 anchors, all required plan sections/invariants, exact manifest and six actual content bytes, and equality of the retained six JSON observations with the direct minimized stdout. All six native bucket/target/version/normal-close assertions pass. The current tree contains ten affected documentation files, one unchanged manifest, and six new fixtures; no source/test/probe, dependency/configuration change, active lease, index change, or M1 selection exists. Existing command syntax/source/negative-projection checks are reused under unchanged identities. This validates the current slice candidate for review, not task completion.

### S3 disposition and closure candidate

RD003-SLICE-REVIEW-001 (2026-08-30): fresh critical_reviewer returned PASS WITH FOLLOW-UPS on plan SHA-256 ff8be5ab20d08746c8f09c9e69de9ecfd33f2a996a4643a137bc29d4ee94eaa9 and unchanged manifest. All RD3-I1–I9 checks passed; no Blocker/Major. Minor RD003-SLICE-F01 asked for historical labels on the earlier synthesis-stop paragraphs and the missing material setup/native revision note. Primary verified the reviewed identity and made only those documentation clarifications; the underlying history, fixture bytes, commands, and native observations are unchanged. The follow-up is resolved, with no worker correction or new scan.

The reviewer independently reproduced CMD-VALIDATE, 148 isolated projection/coverage assertions under selected Node 24.20.0, eight PowerShell parses, observed-record structure, exact fixture/source/archive/binary hashes, both contracts/receipts, 495 links/111 anchors, and the bounded generated inventory. It reused the strict compiler result, sole native batch, normal-close evidence, and guard suite rather than repeating browser work. Primary accepts the slice; no application or generalized privacy/browser-failure qualification is implied.

RD003-CLOSURE-CANDIDATE-001 maps the actual bounded result to roadmap Verification and the documentation gate:

| Obligation | Current evidence and disposition |
| --- | --- |
| One versioned scan manifest with every required field | Unchanged rd003-scan-v1, exact three profiles/six states, revisions/stable targets, native expectations, browser/rule/readiness/deadline profile, locator and evidence mappings; research and correction reviews accepted. |
| Exact canonical fixture content | Six actual UTF-8/LF files match the manifest; resource/marker/target/file inventory and source hashes pass. |
| Native rule results and positive corrected targets | RD003-OBSERVATIONS-001 records six first observations with all three rules, same-target native positives, native measurements, no incomplete, and normal browser closes. |
| Guarded non-TDD setup and relevance | Both leases terminal; only six permitted fixture creations in resumed turn; selected-runtime strict check and structural checks pass. No product test, probe, scanner, generator, dependency, or application source. |
| Minimized and honest evidence | Raw scanner/page content remains transient; retained records contain only frozen fields/counts. Missing optional facts remain explicit. Source/static negative evidence and S3 review pass. |
| Independent review | S3 and different fresh integrated critical reviews accepted; both documentation-only Minors resolved. No native evidence was invalidated. |
| Final cleanup | RD003-CLEANUP-001 records six normal closes without uncertainty, the fresh supplementary diagnostic, validated exact containment/reparse rejection, successful unchanged CMD-CLEANUP, and absent task outputs. Global/shared tools remain unchanged; no native batch repeated. |
| Documentation/status/archive | Twelve-document reconciliation and the 19-path inventory include the integrated review's concept/context follow-up. Post-cleanup input/configuration, absence, link/anchor/JSON/whitespace, and status checks passed before completion. RD-003 is Complete; this same plan is archived with repaired links. M1-01 remains Not started and unselected; only its dependency readiness changes. |

Current changed-path inventory is the twelve documentation files README.md, docs/README.md, docs/PROJECT_REQUIREMENTS.md, docs/PROJECT_CONCEPT.md, docs/PROJECT_CONTEXT.md, docs/DEVELOPMENT_ROADMAP.md, docs/plans/README.md, this plan, docs/progress/README.md, docs/progress/rd-003-scan-evaluation-boundary.md, docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md, and docs/requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md; plus evaluation/rd003-scan-v1.json and the six manifest-named fixtures. Archival changed only this plan's location and affected links, not its evidence or commands.

Documentation impact: the evaluation owner links the literal manifest and native evidence; README distinguishes evaluated fixtures from future application commands; roadmap/status/navigation/progress reflect actual checkpoints. Requirement rows, OD/ADR statuses, candidate history, product purpose, and downstream specifications remain unchanged. No new authority, run schema, platform, provider/corpus/model work, or release claim is introduced. No commit or push is authorized.

### Integrated review disposition

RD003-INTEGRATED-REVIEW-001 (2026-08-30): a different fresh critical_reviewer returned PASS WITH FOLLOW-UPS on plan SHA-256 adadb4d291155e7dd0280d4b6559885c6c99144380391f3f460376ba471cee4c and unchanged manifest SHA-256 13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459. Every RD3-I1–I9 check passed; no Blocker/Major. Minor RD003-INTEGRATED-F01 identified stale RD-003 status in the concept/context summaries, the concept's future-only scan statement, and already frozen literals in the delivery module's open-choice list. Primary verified the reviewed identities and resolved these existing documentation summaries, adding the two documents to the 19-path closure inventory. Application/public-page/comparison behavior remains unimplemented; no requirement, decision status, fixture, manifest, command, native output, or budget changed. The follow-up is dispositioned.

The reviewer independently reproduced CMD-VALIDATE, 125 isolated projection/coverage/expected-outcome assertions, eight PowerShell parses, six retained-record structures, both pinned contract/receipt identities, source/configuration/runtime/browser hashes, and the ordinary 2,408-file / 595,825,280-byte generated inventory. It reused strict compiler, sole native batch, normal-close, guard/source/link evidence; none was invalidated. No repeat browser/compiler/installer/cleanup ran. Primary accepts integrated review and the unchanged cleanup candidate, subject to fresh diagnostic, normal-close reconciliation, containment, actual removal, and final documentation/status/archive validation. Evidence remains limited to the pinned Windows configuration and six states, without native failure-recovery, cross-platform, public-page, repeatability, or release qualification.

### Final cleanup and closure validation

RD003-CLEANUP-001 (2026-08-30 05:04Z): after accepted S3 and different fresh integrated reviews and disposition of both documentation-only Minors, primary reconciled the six completed/cleanup-closed native records with the timely exit-0 batch. No forced or uncertain cleanup exists. The unchanged fresh diagnostic returned zero visible owned executables and 164 unavailable executable paths; this is supplementary visibility, never proof of global absence or clearance of uncertainty. Primary then executed unchanged CMD-CLEANUP once. Its exact absolute-path containment and reparse rejection passed; deletion exited 0, and temp/rd003-evaluation is absent. Only that task-local runtime/browser/tool cache, archive, installer logs, and temporary files were removed. Existing temp material, lease receipts, dependency tree, global installations, and shared Chromium 1228/tool caches remain untouched.

RD003-CLOSURE-VALIDATION-001 (2026-08-30 05:04Z): post-cleanup primary validation passed 533 relative links/122 anchors across twelve documentation paths, all 15 plan sections and nine invariants, JSON/content references, exact frozen manifest and six fixture bytes, equality of the recorded six native observations with the accepted minimized stdout, whitespace, and the nineteen-path scope audit. RD-003 was still In progress for this validation; all 25 application tasks were Not started, M1-01 unselected, index empty, HEAD/branch unchanged, and no active lease or task output directory remained. Global Node remains 24.18.0 with unchanged executable SHA-256 9a4eb5f1c29c6a2e93852ead46b999e284a6a5ca8bab4d4e241d587d025a52de; npm remains 11.16.0. The four pinned toolchain files and scanner sources remain unchanged. Strict compiler, accepted native batch, guard suite, and independent projection evidence remain reusable under their recorded unchanged source/configuration identities; no routine repeat or invented application suite ran.

Roadmap Verification is satisfied by the actual versioned manifest, six exact contents, frozen profile/field mappings, and native evidence above. The primary documentation gate has reconciled the evaluation owner, developer instructions, status summaries, concept/context, navigation, and concise progress; no requirement/OD/ADR status, product purpose, downstream specification, provider/model/corpus scope, or release claim changes. At that pre-completion checkpoint, the only remaining transaction was the authorized Complete/status projection and move of this same plan to completed/, preserving all command/evidence blocks and repairing links, followed by final readback validation. M1-01 remains unselected.

RD003-CLOSURE-VALIDATION-002: final archive readback passed 535 relative links and 124 anchors, all 15 required plan sections/nine invariants, JSON/content/whitespace checks, exact nineteen-path inventory, and the six unchanged native-result records. All eight frozen PowerShell command blocks and other fenced evidence/content blocks were preserved during the contained archive move. RD-003 is Complete; this archived plan exists, the former active path and incoming active-plan links are absent, M1-01 is dependency-ready but unselected, all 25 application tasks remain Not started, and HEAD/branch/index, dependency pins, source/configuration hashes, global tools, and absence of task outputs/active lease remain verified. Primary inspected the actual final diff and resolved both reviews' documentation-only findings. No further runtime observation, native repeat, application suite, commit, or push occurred. Documentation impact is complete across the twelve named documents; requirement/OD/ADR statuses and downstream specifications remain unchanged.

### Current reproduction — RD003-PROCEDURE-003

**Status:** Artifact accepted after RD003-REPRO-CONTRACT-REVIEW-001 and primary disposition of its two wording follow-ups. Checkout execution passed; clean-start acquisition is Blocked by socket permissions after one attempted run. This remains the current reproduction entry point, but its absent-directory precondition no longer holds until separately authorized cleanup of the preserved empty task directory. The original CMD-BOOTSTRAP and preserved-state CMD-RESUME remain historical and are not clean-start instructions. No automatic retry is authorized.

RD003-REPRO-001 (2026-08-30): the owner supplied an independent REVISE review at f34cc5d and explicitly requested these two fixes after primary read-only verification. Current files and committed blobs match the manifest, but core.autocrlf=true checkout filtering changes all six fixtures to CRLF and changes the manifest hash. The original metadata expression reproduces ERR_PACKAGE_PATH_NOT_EXPORTED; its filesystem-read correction passes, but CMD-RESUME requires the task directory removed at closure. These findings invalidate the clean-checkout/clean-start closure claim, not RD003-OBSERVATIONS-001 or the unchanged scan profile. RD-003 is reopened; M1-01 remains unselected.

The correction uses ordinary Git attributes and the already supported metadata read; no unresolved evidence-selection dimension or new subsystem is introduced. Repository-local investigation is R0. The original R3 evidence/locator conclusion, synthesis, and pre-draft checkpoint remain applicable. Because the literal execution artifact changes, a fresh critical_research_reviewer must review the complete revised artifact and all RD3-I1–I9 before setup. This is the next recorded artifact correction checkpoint, not a reset of earlier budgets. The owner authorizes only these named fixes. A new Major outside them, a changed binding contract, repeated decisive failure, unexpected overlap, or exhausted allowance stops for owner direction.

One bounded follow-up slice, RD003-REPRO-01, repairs reproducibility of existing RD-003 inputs. TDD: Not applicable; declarative checkout policy and developer acquisition have no new application behavior. One fresh code_worker receives one setup turn with zero further correction turns, a complete packet, and a fresh primary-managed lease. Allowed file: .gitattributes only. Allowed directory roots: None. All other non-ignored paths are forbidden, including fixtures, manifest, documentation, source/tests, package/lock/compiler/Vite files, .codex, .agents, .gitignore, AGENTS.md and PLANS.md. The primary owns every instruction/evidence/status write between leases. The worker creates the exact attributes below, runs CMD-CHECKOUT, CMD-BOOTSTRAP-CLEAN once, then unchanged CMD-VALIDATE. Primary terminally closes the lease and inspects actual results before acceptance. Use S3 for the deterministic-byte/critical reproducibility finding, with a fresh critical_reviewer for this slice and a different fresh integrated critical_reviewer. Neither repeats the native batch merely for independence.

The [Git attributes manual](https://git-scm.com/docs/gitattributes) defines text/eol checkout conversion and versioned per-path attributes. The [cat-file manual](https://git-scm.com/docs/git-cat-file) defines --filters as checkout-filtered blob output. These standard semantics support the seven exact entries; this adds no custom serialization or global Git configuration. The committed fixture/manifest blobs already use LF, so no renormalization, staging, checkout, or source rewrite is required.

#### Exact checkout policy

Write .gitattributes as UTF-8 with a final newline and precisely this content. Only these seven frozen artifacts receive the LF policy; unrelated files and dependency pins retain their existing treatment.

```gitattributes
# Preserve the exact RD-003 evaluation bytes on every checkout.
/evaluation/rd003-scan-v1.json text eol=lf
/fixtures/rd003/informative-image-alt/failing.html text eol=lf
/fixtures/rd003/informative-image-alt/corrected.html text eol=lf
/fixtures/rd003/form-input-label/failing.html text eol=lf
/fixtures/rd003/form-input-label/corrected.html text eol=lf
/fixtures/rd003/text-contrast/failing.html text eol=lf
/fixtures/rd003/text-contrast/corrected.html text eol=lf
```

#### CMD-CHECKOUT — current and checkout-filtered byte verification

Run from C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab. Python 3.12.10 and Git 2.53.0.windows.1 are the verified developer tools. This is read-only and writes no index/configuration or checkout files. All 21 checkout-filter comparisons and six manifest-content comparisons must pass.

```powershell
@'
from pathlib import Path
import hashlib,json,subprocess
root=Path.cwd()
m=json.loads((root/'evaluation/rd003-scan-v1.json').read_text(encoding='utf-8'))
paths=['evaluation/rd003-scan-v1.json']+[c['path'] for c in m['cases']]
expected_attributes='# Preserve the exact RD-003 evaluation bytes on every checkout.\n'+''.join('/'+p+' text eol=lf\n' for p in paths)
assert (root/'.gitattributes').read_text(encoding='utf-8')==expected_attributes
assert len(m['profiles'])==3 and len(m['cases'])==6
assert hashlib.sha256((root/paths[0]).read_bytes()).hexdigest()=='13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459'
for path in paths:
    expected=(root/path).read_bytes()
    assert b'\r' not in expected and expected.endswith(b'\n'),path
    assert subprocess.check_output(['git','cat-file','blob','HEAD:'+path])==expected,path
    for autocrlf in ['true','false','input']:
        filtered=subprocess.check_output(['git','-c','core.autocrlf='+autocrlf,'cat-file','--filters','HEAD:'+path])
        assert filtered==expected,(path,autocrlf)
for c in m['cases']:
    assert (root/c['path']).read_bytes()==c['content'].encode('utf-8'),c['path']
print('PASS: seven frozen artifacts match committed and checkout-filtered bytes under autocrlf true/false/input; all six fixture contents match the manifest.')
'@ | python -B -
if ($LASTEXITCODE -ne 0) { throw 'Checkout byte validation failed.' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace validation failed.' }
```

#### CMD-BOOTSTRAP-CLEAN — acquire missing task-local prerequisites

Clean start means the completed source tree with the RD-002 locked node_modules retained/restored, and no temp/rd003-evaluation directory. A fresh clone must first follow README's Development toolchain instructions to restore the pinned dependencies with scripts disabled; this command does not replace that separate prerequisite or modify the dependency tree. Package/lock/compiler/Vite/scanner hashes below must match before creating outputs. Run CMD-CHECKOUT first. Existing fixtures are inputs and must never be recreated by CMD-FIXTURE during reproduction.

Run this complete block once from the same repository root. It uses the corrected filesystem metadata read, reacquires exactly Node 24.20.0/npm 11.19.0 and full managed Chromium 1234, verifies acquired binary hashes, and executes the existing strict no-emit typecheck. Global Node/npm, installed packages, and shared browser caches are not changed. Expected exit 0 and the final clean-start success message. This command starts the Playwright installer, not a browser scan; CMD-SCAN remains unchanged and is not run for this correction.

```powershell
$ErrorActionPreference = 'Stop'
$rd003Repo = 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab'
if ($PWD.Path -ne $rd003Repo) { throw 'Unexpected working directory.' }
$rd003Temp = Join-Path $rd003Repo 'temp\rd003-evaluation'
if (Test-Path -LiteralPath $rd003Temp) { throw 'Preserve and inspect unexpected existing task directory.' }
foreach ($rd003Parent in @($rd003Repo,(Join-Path $rd003Repo 'temp'))) {
  if ((Test-Path -LiteralPath $rd003Parent) -and ((Get-Item -LiteralPath $rd003Parent).Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Reparse point.' }
}
git check-ignore -q -- temp/rd003-evaluation
if ($LASTEXITCODE -ne 0) { throw 'Task outputs must be ignored.' }
$rd003Sources = @{
  'package.json'='c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98'
  'package-lock.json'='ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553'
  'tsconfig.json'='3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde'
  'vite.config.ts'='8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07'
  'node_modules/axe-core/axe.js'='138a93a4ce7b7c6c08ed84144e45dcd8cc36d2d4ff8ed673619faf0406906d88'
  'node_modules/@axe-core/playwright/dist/index.js'='9a4f63fad34eb93fe99dc3dde41dc21d0614e5956d524f288b029634cbd6b39d'
}
foreach ($rd003Entry in $rd003Sources.GetEnumerator()) {
  if ((Get-FileHash -LiteralPath (Join-Path $rd003Repo $rd003Entry.Key) -Algorithm SHA256).Hash.ToLowerInvariant() -ne $rd003Entry.Value) { throw "Prerequisite identity mismatch: $($rd003Entry.Key)" }
}
New-Item -ItemType Directory -Path $rd003Temp | Out-Null
New-Item -ItemType Directory -Path (Join-Path $rd003Temp 'os-temp'),(Join-Path $rd003Temp 'npm-cache') | Out-Null
$rd003EnvNames = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','TMPDIR','TMP','TEMP','PATH')
$rd003OldEnv = @{}
foreach ($rd003Name in $rd003EnvNames) { $rd003OldEnv[$rd003Name] = [Environment]::GetEnvironmentVariable($rd003Name,'Process') }
try {
  $env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $rd003Temp 'playwright-browsers'
  $env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = '120000'
  $env:TMPDIR = Join-Path $rd003Temp 'os-temp'
  $env:TMP = $env:TMPDIR
  $env:TEMP = $env:TMPDIR
  $rd003Zip = Join-Path $rd003Temp 'node-v24.20.0-win-x64.zip'
  Invoke-WebRequest -Uri 'https://nodejs.org/dist/v24.20.0/node-v24.20.0-win-x64.zip' -OutFile $rd003Zip -TimeoutSec 300
  if ((Get-FileHash -LiteralPath $rd003Zip -Algorithm SHA256).Hash.ToLowerInvariant() -ne '6cac9ffbca8f6a47091e4b5c772e0606049c3871cb67d900c0cedde630e545ba') { throw 'Node archive identity mismatch.' }
  Expand-Archive -LiteralPath $rd003Zip -DestinationPath $rd003Temp
  $rd003Runtime = Join-Path $rd003Temp 'node-v24.20.0-win-x64'
  $rd003Node = Join-Path $rd003Runtime 'node.exe'
  $env:PATH = $rd003Runtime + ';' + $env:PATH
  if ((& $rd003Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Node mismatch.' }
  if ((& $rd003Node (Join-Path $rd003Runtime 'node_modules\npm\bin\npm-cli.js') --version) -ne '11.19.0' -or $LASTEXITCODE -ne 0) { throw 'npm mismatch.' }
  $rd003Installer = Start-Process -FilePath $rd003Node -ArgumentList @((Join-Path $rd003Repo 'node_modules\playwright\cli.js'),'install','chromium','--no-shell') -WorkingDirectory $rd003Repo -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $rd003Temp 'browser-install.stdout') -RedirectStandardError (Join-Path $rd003Temp 'browser-install.stderr')
  if (-not $rd003Installer.WaitForExit(600000)) {
    if (-not $rd003Installer.HasExited) { & "$env:SystemRoot\System32\taskkill.exe" /PID $rd003Installer.Id /T /F | Out-Null }
    throw 'Owned browser installer timed out; inspect task-local outputs before any retry.'
  }
  $rd003Installer.Refresh()
  Get-Content -LiteralPath (Join-Path $rd003Temp 'browser-install.stdout'),(Join-Path $rd003Temp 'browser-install.stderr')
  if ($rd003Installer.ExitCode -ne 0) { throw 'Browser installation failed.' }
  $rd003Acquired = @{
    'node-v24.20.0-win-x64/node.exe'='5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5'
    'playwright-browsers/chromium-1234/chrome-win64/chrome.exe'='409805a16d6416087e6b2f778df1cf8f7bbb267d6b99f6b5bb0a618eace234f2'
  }
  foreach ($rd003Entry in $rd003Acquired.GetEnumerator()) {
    if ((Get-FileHash -LiteralPath (Join-Path $rd003Temp $rd003Entry.Key) -Algorithm SHA256).Hash.ToLowerInvariant() -ne $rd003Entry.Value) { throw "Acquired identity mismatch: $($rd003Entry.Key)" }
  }
  & $rd003Node --input-type=module -e "import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire}from'node:module';const r=createRequire(import.meta.url);const lock=JSON.parse(fs.readFileSync('package-lock.json'));for(const p of ['playwright','playwright-core','@axe-core/playwright','axe-core','typescript'])assert.equal(JSON.parse(fs.readFileSync('node_modules/'+p+'/package.json')).version,lock.packages['node_modules/'+p].version);assert.equal(r('axe-core').version,'4.13.0');console.log('Selected runtime and installed scanner dependency identities verified.');"
  if ($LASTEXITCODE -ne 0) { throw 'Dependency identity mismatch.' }
  & $rd003Node (Join-Path $rd003Runtime 'node_modules\npm\bin\npm-cli.js') --global=false --prefix $rd003Repo --cache (Join-Path $rd003Temp 'npm-cache') --ignore-scripts=true --audit=false --fund=false --update-notifier=false --logs-max=0 run typecheck
  if ($LASTEXITCODE -ne 0) { throw 'Strict typecheck failed.' }
  'Clean-start acquisition and selected-runtime strict typecheck passed; no browser scan ran.'
} finally {
  foreach ($rd003Name in $rd003EnvNames) { [Environment]::SetEnvironmentVariable($rd003Name,$rd003OldEnv[$rd003Name],'Process') }
}
```

Permitted ignored/generated effects are confined to temp/rd003-evaluation: the named Node ZIP and extracted distribution; playwright-browsers with .links, chromium-1234, ffmpeg-1011, and winldd-1007; browser-install.stdout/stderr; npm-cache with the command's logs disabled; and os-temp including npm's node-compile-cache/v24.20.0-x64-964aae3f ordinary eight-hex files. These are outside guard proof. Node/CDN acquisition uses only the pinned developer toolchain; no provider, model, corpus, page request, browser profile, trace, screenshot, or raw scanner payload is acquired. Temporary PATH/TMP/TEMP/TMPDIR/Playwright values are restored by finally. Any unexpected path, failed acquisition, forced installer termination, or uncertain process exit stops; preserve outputs and never clear uncertainty using process visibility.

#### Reproduction sequence and cleanup

For a later independently requested reproduction: satisfy RD-002 restoration, run CMD-CHECKOUT, run CMD-BOOTSTRAP-CLEAN from an absent task directory, run unchanged CMD-VALIDATE, and only then run unchanged CMD-SCAN once for the six states if new observations are actually requested. It is not necessary to re-author fixtures or satisfy the obsolete CMD-RESUME cache precondition. Existing CMD-VALIDATE, CMD-SCAN, diagnostic, and CMD-CLEANUP are identified by their original headings and retain their exact contents. Validation and diagnostic inspection are read-only; scanning launches processes, and cleanup deletes the bounded task directory. No new persistent probe is added.

For this correction's acquisition-only validation, do not run CMD-SCAN. After both implementation reviews pass, the primary verifies normal successful installer and synchronous Node/npm/compiler exits, that no browser was launched in this acquisition run, no forced/uncertain cleanup, expected ordinary generated topology, and a fresh unchanged diagnostic with no visible owned process. The diagnostic may report unavailable executable paths and cannot prove global process absence. Then run unchanged CMD-CLEANUP once with its exact absolute containment and reparse checks and verify absence. Historical six normal-close records remain preserved, not relabeled as new process evidence. A later scan reproduction additionally requires that run's successful normal closes under the unchanged native command. No failure or uncertainty is cleared by directory removal.

Acceptance requires the actual .gitattributes diff and compliant lease, exact checkout-filtered/current/blob equality including the manifest hash, successful current clean-start acquisition/typecheck, unchanged six fixture/native evidence identities, bounded generated inventory and cleanup, both implementation reviews, and final documentation/link/status reconciliation. Reuse the prior six native outcomes; the correction changes no contents, expected outcome, browser/profile, evidence field, or manifest version. The final correction diff consists of .gitattributes plus the existing twelve documentation owners (the plan returns to its completed path only after closure); no application or fixture file changes. Record correction evidence below without deleting the original failures, allowances, commands, or closure history.

#### Reproduction checkpoint and execution evidence

RD003-REPRO-CONTRACT-REVIEW-001 (2026-08-30): the fresh critical_research_reviewer returned PASS WITH FOLLOW-UPS on plan SHA-256 11327a629c86206a3d1f9d4e3c136335dc658dda9e06584e52ec00d0110bf067 and unchanged manifest SHA-256 13c9722be9ea2e3b0aaf020ea91f429a701180a83814fe7ab21baf2ddad57459; primary verified the reviewed plan identity before editing. All RD3-I1–I9 pass for artifact readiness, with no Blocker or Major. Primary resolved F01 by qualifying historical acceptance and F02 by distinguishing read-only validation/diagnostic inspection from scan and cleanup effects. These edits change no command, prerequisite, expected outcome, permission, or budget. The reviewer independently reproduced seven current/blob identities, the checkout defect, six source hashes, all ten PowerShell parses, unchanged structural validation, and the corrected metadata read under global Node. Original eight commands and six native records are unchanged. This checkpoint is accepted; the single fresh guarded setup turn remains necessary to establish checkout/clean-start execution, followed by S3 and different integrated reviews and cleanup. No research follow-up or new native batch was used.

RD003-REPRO-SETUP-RESULT-001 (2026-08-30 14:23Z): one fresh code_worker executed the complete Milestone Assignment Packet v2 for workflow RD003-REPRO-20260830-01, slice RD003-REPRO-01, setup attempt 1, lease RD003-REPRO-01-setup-01, owner rd003-repro-worker-01, and contract digest 6feec180cebadb0884a625d1ac5ac27375b94225ddedaaafbe0df1fe3b680f6b. Its frozen plan identity was 6d94ea3ce6b16efe18a60ca989125b049c6c42837ff7e9e3eb49457da19a5e8b. The only allowed file was .gitattributes, with no allowed roots; primary documentation and every other non-ignored endpoint remained outside scope. TDD was Not applicable. The one turn and zero correction/retry allowance are consumed.

The worker created only the exact 465-byte UTF-8 LF .gitattributes, SHA-256 65c86ab981c434adc150dd489ea953ef78327bd36faa51d219d7270b9c675d4e. CMD-CHECKOUT ran once, exit 0: all seven current/HEAD files and all 21 checkout-filter comparisons matched, and six fixture contents equal the unchanged manifest. CMD-BOOTSTRAP-CLEAN ran once, exit 1 at its first Invoke-WebRequest to the frozen official Node ZIP URL because socket access was denied by access permissions. Acquisition stopped before an archive, runtime, browser, installer, logs, or compile cache existed. No installer/browser was launched or force-terminated; the command's finally restored its process environment. The worker correctly did not run its next CMD-VALIDATE or retry. This is an environment-permission failure, not evidence that the corrected package-metadata read failed.

Primary terminally closed the lease with fresh closed-compliant exit 0 and receipt digest a80a932e8e7cb91d0149d1fb671d10037ec4152eb1d45a3b47903d2b86d97f23. Pinned status before documentation edits confirmed post_close_drift=false and unchanged HEAD/ref/index/ignore controls. Primary inspected the actual attribute contents/hash and receipt: one allowed creation, no modified, deleted, forbidden, or unleased endpoints. Ignored outputs were separately inspected: temp/rd003-evaluation contains exactly two ordinary empty directories, npm-cache and os-temp, with zero files/bytes and no reparse topology. No active lease remains. The directories are preserved; neither frozen cleanup nor a network-enabled retry has run.

RD003-REPRO-TRIAGE-001: after lease closure, primary ran unchanged read-only CMD-VALIDATE once, exit 0, as failure triage rather than acceptance of the incomplete worker setup. All six exact fixture contents, marker/target uniqueness, resource exclusions, inventory, manifest, and six source/configuration fingerprints pass. The global Node/npm remain 24.18.0/11.16.0; global node.exe SHA-256 remains 9a4eb5f1c29c6a2e93852ead46b999e284a6a5ca8bab4d4e241d587d025a52de. Original eight commands and six native observations remain unchanged. No native batch ran. The required S3 slice and different integrated reviewer are not invoked at this failed setup barrier, and no historical successful runtime/typecheck result substitutes for the missing clean-start result.

Primary disposition: preserve partial checkout success and all failure history, mark RD-003 Blocked, and request only a bounded allowance to remove the verified empty task directory and rerun the unchanged clean-start command with network permission. No command, expected outcome, source/fixture/manifest byte, dependency pin, or original budget is silently changed. Successful acquisition must still precede setup acceptance, both implementation reviews, bounded cleanup, and renewed documentation closure; M1-01 remains unselected.

RD003-REPRO-BLOCKED-VALIDATION-001: proportional blocked-handoff checks pass: 539 relative links and 128 anchors across twelve affected documents; all ten PowerShell command blocks and unchanged inline scanner JavaScript parse; the original eight command blocks and six native records match HEAD; the manifest, six fixture contents, and dependency/configuration fingerprints remain unchanged. HEAD remains f34cc5daafb0ac2b2c6ce743fa32048ebc643fe9, the Git index is empty, all 25 application tasks remain Not started, no active lease exists, and git diff --check passes. The only non-documentation change is the exact .gitattributes addition. This is validation of the blocked handoff, not renewed roadmap Verification or clean-start success.

Documentation impact: the existing README, documentation index, roadmap, requirements/product status summaries, delivery/evaluation notes, plan/progress indexes, progress record, and this same active plan now distinguish the passing LF correction from unverified clean-start acquisition. README links directly to the current procedure and states its present permission/precondition barrier. No requirement row, Accepted decision, manifest version, native evidence, dependency pin, or application contract changes. The plan remains unarchived until the owning task and documentation closure pass. No commit or push occurred.

## Validation and Acceptance
Historical planning acceptance was limited to the complete plan, valid task activation/status/navigation, unchanged implementation/configuration, and its fresh planning review. The original execution met the separate acceptance gates below, as recorded in its preserved closure evidence. The reopened correction must also satisfy procedure 003's checkout, clean-start, review, cleanup, and documentation gates before RD-003 is Complete again.

Execution acceptance requires:

1. Accepted research reports and R3 synthesis/checkpoints with all RD3 invariants covered; exact command inventory, paths, permissions, and non-goals frozen before setup.
2. One versioned manifest and exactly six authored logical states covering the canonical profiles, expected native outcomes, stable target keys, fixture revision roles, viewport/browser and scanner/rule profiles, readiness/timeout, locator representation, and minimized evidence allowlists.
3. Native observations under the frozen profile for each intended failing/corrected target, complete three-rule coverage, real narrow positive evidence, correct native incomplete distinction, and truthful handling of unavailable required facts. No claim that a package catalog, type signature, absence of violations, or hand-authored numeric vector proves a scan passed.
4. Source evidence and bounded negative inspection show that retained output contains only permitted facts and minimal provenance, not raw native/page content, general passes/inapplicable archives, input values, image URLs, secrets, arbitrary text, or fixture gold masquerading as emitted facts.
5. A complete setup packet and terminal compliant lease, primary inspection of the real diff/results, unchanged dependency/configuration hashes, no unauthorized generated side effects, cleanup evidence, and the S3 slice review. No production TDD result is claimed.
6. Every frozen-value change preserves earlier inputs/results under their version and reruns only affected cases. The six-case demonstration remains provider-independent and non-statistical; later product validation still belongs to M1.
7. A relevance/scope audit confirms no retained probe source, product module/test, extra fixture family, model/provider/corpus work, dependency, generic subsystem, or speculative workflow. Existing strict toolchain verification is reused only when its identity remains valid, otherwise rerun its actual command.
8. Fresh integrated review and the task-closure documentation gate pass with all follow-ups dispositioned. Link the frozen artifact and updated developer procedure from the appropriate existing owners. Validate relative links/anchors, JSON/content references, authority/status consistency, whitespace, negative scope, and changed-file inventory. No commit or push without owner authorization.

The roadmap Verification is satisfied only by the actual versioned manifest and its complete frozen fields, not by the plan, role verdict, lease, or status edit. `PASS WITH FOLLOW-UPS` requires explicit primary disposition compatible with every acceptance condition; `REVISE`, `BLOCKED`, or exhausted budget stops advancement.

## Idempotence and Recovery

Read-only repository inspection is repeatable. Bootstrap, cache creation, fixture authoring, and browser execution are not assumed idempotent: inspect existing state, preserve unrelated material, and use the frozen exact targets. A matching existing runtime/browser may be reused after its exact identity is checked; no shared install/cache is deleted to force a clean result. Unknown or unexpected state stops the command.

On failure, stop the worker, terminally close and inspect the lease, retain the bounded failure, and leave prior evidence and user work intact. Never reset/checkout the tree, edit guard records, rewrite an old manifest expectation, reuse a terminal lease, or retry a browser loop automatically. Only the primary reconciles authority, content/profile/version, command and environment identity before deciding whether the one permitted correction is still the same contract or owner direction is needed.

Accepted evidence is reusable only when exact command, working directory, relevant-tree fingerprint, environment and isolated-case identity, and guard-backed no-drift state still match. Browser/network/process evidence is otherwise `Non-reusable`. Pin the isolated synthetic content/state and browser identity when feasible; do not treat a changing public page or dependency catalog as equivalent. A justified rerun creates a new observation and invalidates stale evidence without manufacturing a routine repeatability study.

Use only targeted PowerShell cleanup of validated ordinary paths inside the explicitly named generated directory, and only owned process handles. An unexpected reparse point, active lease, conflicting change, missing permission, or cleanup failure requires primary triage. Cleanup never targets the workspace root, home directory, global browser cache, unrelated process, or authored evaluation input.

## Artifacts and Notes

`RD003-STATE-001` (2026-08-30): clean branch `codex/rd-003-scan-evaluation-boundary`, HEAD `f16c6f0`; RD-001/RD-002 Complete; no active lease; package/lock and installed scanner metadata match; no product/fixture/evaluation directories. Global Node/npm mismatch is explicitly unverified for execution. These are local inspection facts, not new browser evidence.

`RD003-PLAN-REVIEW-001` (2026-08-30): fresh `independent_reviewer` performed the R2 plan-only final-artifact review and returned `PASS`, no Blocker/Major/Minor findings. It checked every required plan section and RD3-I1 through RD3-I9 as future obligations, confirmed exact task selection, justified future R3 routing, non-TDD fixture setup, primary manifest/documentation ownership, separate generated effects, bounded review budgets, and the six-state/M1 separation. The reviewed plan hash was `65DA5FF8D1436E5738A8D5ADD23F043284826B92C55781EB72DFC6E8D1749D08`; primary verified that exact file before result-only bookkeeping. This is not the future R3 selection checkpoint or an implementation review. No substantive correction or extra role was needed.

`RD003-PLAN-VALIDATION-001` (2026-08-30): primary checks passed all 467 relative targets and 97 Markdown anchors across the nine changed/new documents, all 15 required plan sections, final newlines/trailing whitespace, JSON parsing and strict/no-emit configuration, roadmap/status consistency, and `git diff --check`. All 25 application tasks remain Not started. The actual diff contains seven existing documentation updates and only this plan plus its progress record as new files; package/lock/compiler/Vite configuration is unchanged, the index is empty, HEAD remains `f16c6f0`, and no source/test/fixture/evaluation directory or active lease exists. The reviewer independently confirmed the material tree, dependency, version, negative-scope, and whitespace facts. Checkout line-ending notices are not validation failures; the separate fingerprint observation above prevents stale evidence reuse. No install, browser, scan, product command, commit, or push occurred.

Documentation impact: the roadmap, root/project indexes, requirements/delivery current-status statements, plan index, and progress index/record now reflect RD-003 planning activation and its accepted planning checkpoint. Requirement rows, ADRs, Proposed assessments, derived specifications, and the completed RD-002 plan are unchanged because no product/architecture decision, selected scan literal, or implementation evidence changed. Final result-only reconciliation must preserve those boundaries.

`RD003-PLAN-VALIDATION-002` final result-only readback: all 468 relative targets and 98 anchors across the same nine documents resolve, whitespace/final-newline and `git diff --check` pass, and the four existing toolchain files still have no diff. Primary reconciled the passing verdict with the unchanged execution contract, no open findings, RD-003 In progress, and every execution gate still pending. Planning is ready for handoff; task Verification is not complete.

`RD003-EXECUTION-STATIC-001` (2026-08-30): primary read-only checks confirmed the current Python 3.12.10, Git 2.53.0.windows.1, PowerShell 7.6.4/.NET 10.0.10, all six package/configuration/source hashes in CMD-ENV, absent task output directory, and no active lease. The existing isolated guard self-test passed all 27 checks. All seven PowerShell command blocks and the corrected inline JavaScript passed syntax parsing. Bounded field-only calls extracted from `project()` passed missing/null/invalid/withheld locator preservation, missing/invalid check-group handling, attribute/name/size bounds, raw-string exclusion, native contrast-field copying, and incomplete-bucket preservation. These static checks used the unchanged global Node 24.18.0; they do not verify the selected Node 24.20.0, a browser launch, a native scanner result, or cleanup. Source hashes and the analyst-reviewed plan hash were independently checked before accepting the terminal disposition.

Historical snapshot at `RD003-SYNTHESIS-002` (superseded by the accepted setup/native observations above): execution stopped at that earlier barrier. The versioned manifest was not authored; its path/version, six contents, and mappings remain proposed in outline 002. No worker packet or write lease was issued, no task-local runtime/browser was provisioned, and no native case ran. There are no task-created evaluation processes or runtime files to clean up. Required fresh research checkpoints, S3 slice review, integrated review, roadmap Verification, and completion/archive remain unperformed. The unused critical-researcher follow-up does not authorize bypassing the exhausted analyst barrier.

Historical documentation impact at that synthesis stop: this plan preserves accepted source/static evidence and the rejected cleanup condition; the roadmap records Blocked, and root/documentation/requirements/delivery/plan/progress status summaries are reconciled. No requirement row, ADR, evaluation authority, application/developer command, dependency pin, or global installation changes because no scan literal passed its acceptance barrier and no native execution occurred. Historical planning and RD-002 completion evidence remain unchanged. Keep the [progress record](../progress/rd-003-scan-evaluation-boundary.md) a summary of accepted material checkpoints.

`RD003-BLOCKED-HANDOFF-001` (2026-08-30): primary validation passed 470 relative links and 100 anchors across the nine changed/new documents, all 15 plan sections and nine invariants, JSON configuration parsing, final-newline/trailing-whitespace checks, and `git diff --check`. Readback confirms RD-003 Blocked, all 25 application tasks Not started, M1-01 unselected, unchanged toolchain files and global Node/npm 24.18.0/11.16.0, empty Git index, HEAD `f16c6f0`, and no source/test/fixture/evaluation directory, task-local provisioning directory, or active lease. The primary inspected the actual tracked diff and authored plan/progress changes. This validates the blocked handoff, not roadmap Verification or task completion; the plan remains unarchived. No commit or push occurred.

Historical changed-file inventory at the synthesis stop (all were already changed/new planning documents at execution entry): `README.md`, `docs/DEVELOPMENT_ROADMAP.md`, `docs/PROJECT_REQUIREMENTS.md`, `docs/README.md`, `docs/plans/README.md`, `docs/plans/rd-003-scan-evaluation-boundary.md`, `docs/progress/README.md`, `docs/progress/rd-003-scan-evaluation-boundary.md`, and `docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md`. No other non-ignored path changed.

## Interfaces and Dependencies

RD-002's pinned Node/npm, TypeScript, Playwright, `@axe-core/playwright`, and resolved axe-core remain the only toolchain for this task. A matching managed Chromium executable is a developer evaluation prerequisite, not an application distribution artifact. No additional package, server framework, runner, schema library, native driver, model, or provider is selected.

The task's downstream interface is data: exact fixture content, expected native outcomes, ordinary stable evaluation keys/revision references, scan profile/options/readiness/timeout, and field/locator retention literals in one manifest. Product types, scan/normalization modules, runtime failure handling, and `run.json` implementation remain M1 responsibilities. A direct RD-003 native observation command is evidence preparation only and must not become a competing runtime path.

## Revision note

2026-08-30: Recorded the owner's additional bounded allowance and outline 003. The process inventory cannot clear unverified cleanup; forced/uncertain termination remains a stop. Original budgets and downstream checkpoints are preserved.

2026-08-30: Created the RD-003 plan after inspecting committed RD-002 completion and confirming exact owner task selection. This revision activates planning only, preserves the six-state/non-promotable boundary, reserves exact setup and cleanup commands, separates primary evidence ownership from fixture leases, and names the privacy-triggered review route without adding product behavior.

2026-08-30: Recorded the passing independent plan review and proportional validation, clarified the observed checkout-fingerprint difference, and synchronized the accepted planning checkpoint. These are evidence/status updates only; the reviewed execution contract and every unexecuted gate remain unchanged.

2026-08-30: Owner-authorized execution completed readiness and bounded research. Recorded the sole synthesis correction as outline 002, resolving timeout/cleanup, exact options, individual-fact preservation, and prerequisite checks before any setup. No budget was reset.

2026-08-30: The analyst's sole correction pass returned `OWNER DIRECTION` for the remaining process-visibility cleanup defect. Primary verified the reviewed artifact identity, preserved the rejected command, stopped before setup, and reconciled Blocked status and progress. Continuation requires a bounded owner allowance; no task completion or archive is claimed.

2026-08-30: Recorded the first guarded bootstrap failure, fresh compliant lease closure, primary file/runtime inspection, preserved generated outputs, and a non-binding filesystem-metadata correction proposal. Reconciled RD-003 as Blocked because the frozen command and existing-output precondition require owner direction. The reviewed manifest and commands remain unchanged; no setup correction allowance or new review was consumed.

2026-08-30: Recorded owner allowance 002, procedure version 002 for bounded preserved-prerequisite reuse, corrected the npm compile-cache inventory, and reserved one rescoped worker turn after fresh full R3 correction review. No manifest, scan literal, or budget was reset.

2026-08-30: Recorded accepted resumed setup, both compliant terminal leases, the primary's six first native observations and exact minimized outputs, permitted cache inventory, and successful normal browser closes. S3 review passed with one historical-state/revision-note Minor; primary resolved it and prepared the integrated-review/cleanup/documentation closure candidate. No native repetition or input/expectation change occurred.

2026-08-30: Accepted the different fresh integrated review and resolved its documentation-only Minor in the concept/context and delivery summaries. Expanded closure inventory to twelve documents, one unchanged manifest, and six fixtures; original commands/evidence/budgets remain intact.

2026-08-30: Completed the unchanged contained cleanup and post-cleanup validation, reconciled all twelve affected documentation owners, marked only RD-003 Complete, and archived this same plan with repaired links. The manifest, six fixtures, eight frozen commands, and six accepted observations are unchanged. M1-01 remains unselected; no commit or push occurred.

2026-08-30: Reopened RD-003 for two independently verified reproducibility findings after owner direction. Added proposed procedure 003 and exact seven-artifact LF policy, preserving historical commands/native outcomes and budgets. Fresh full-artifact review precedes one guarded follow-up setup; no source or fixture bytes have changed.

2026-08-30: Accepted fresh full-artifact review and resolved its two wording Minors. The guarded worker added only .gitattributes and passed checkout verification, then stopped at the first clean-start download on socket-permission denial. Primary closed the lease compliantly, inspected exact files and empty generated directories, passed read-only structural/source checks, preserved the failed attempt, and reconciled Blocked status without retry, cleanup, further reviewer, or budget reset.
