# Freeze the generation evaluation package

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M3-01](../DEVELOPMENT_ROADMAP.md#m3-01--freeze-the-generation-evaluation-package), In progress for owner-requested project review and planning only. Execution requires a subsequent explicit request. No generation, acquisition, application change, or later task is authorized.
- **Latest evidence:** [M301-PLAN-01](#m301-plan-01--current-project-state) confirms completed M2-04, the existing contract boundary, clean entry, strict TypeScript and 119 passing focused tests. [M301-PLAN-REVIEW-01](#m301-plan-review-01--accepted-planning-readiness) accepts independent planning PASS and documentation checks.
- **Remaining gates:** Resolve eligible-case provenance, freeze the exact input/output/instruction and interpretation contract, complete the R3 checkpoints, verify the static package and documentation. None of these execution gates has passed.
- **Allowance:** Future research and corrections are bounded in the [Decision Review Contract](#decision-review-contract); none has been consumed. The single planning-readiness review passed after a minor table-format correction; no execution budget was renewed.
- **Active lease:** None. Primary owns this plan and authoritative evaluation artifacts; no implementation-worker assignment is open.
- **Next:** Await execution authorization, then refresh entry evidence and follow [A](#a--resolve-and-freeze-the-package-contract) before [B](#b--author-verify-and-record-the-freeze). [Commands](#concrete-steps), [acceptance](#validation-and-acceptance), and [recovery](#idempotence-and-recovery) control resumption.

## Progress

- [x] (2026-09-09 18:35Z) Reviewed roadmap-wide state, controlling generation/evaluation authorities, M2-04 closure, current domain/retrieval boundaries, test inventory and maintained commands; accepted M301-PLAN-01.
- [x] (2026-09-09 18:35Z) Drafted the task-scoped plan and planning-only activation; no execution artifact or production behavior is claimed.
- [x] (2026-09-09 18:44Z) Accepted fresh independent planning PASS, corrected progress-table formatting, and passed documentation/preservation checks; see M301-PLAN-REVIEW-01.
- [ ] Receive execution authorization and refresh the current Git/input/runtime baseline.
- [ ] Complete A: eligibility provenance and R3 research/synthesis/contract checkpoint.
- [ ] Complete B: exact static package, complete invariant checks and fresh final R3 review.
- [ ] Accept documentation closure, mark M3-01 Complete and archive this plan. M3-02 remains separately selected work.

## Surprises & Discoveries

- M2-04 passed gold-hit verification but none of its three real retrieval sets was generation-eligible. G1 lacked interpretation; G2 and G3 lacked a criterion. Its [accepted observations](completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) explicitly preserve all three abstentions. A gold hit is not complete guidance support.
- The existing `EvidencePath` and canonical passage references already provide bounded reference vocabulary. Reuse them; M3-01 need not invent independently identified evidence, proposal, invocation or review records.
- `REQ-SEC-021` excludes raw prompts and provider payloads from tracked documentation/public evidence even when planning an evaluation. Package provenance must distinguish safe tracked definitions from local exact assembled inputs; synthetic origin is not a blanket exemption.

## Decision Log

- Decision: Create a planning-only activation, preserving M2-04 completion and all later-task statuses. Rationale: the owner requested an ExecPlan, not execution. Date/Author: 2026-09-09 / primary.
- Decision: Put the three-case eligibility/provenance question before package drafting. Rationale: relabeling real incomplete retrieval as supported, adding gold passages to production ranking, or weakening required roles would contradict accepted evidence and exceed this task. No case-construction option is selected by this plan. Date/Author: 2026-09-09 / primary.
- Decision: Use a static, primary-authored freeze with existing validators and direct checks, not a new evaluation runner. Rationale: this task creates no application behavior; runtime output validation belongs to M3-02. Date/Author: 2026-09-09 / primary.

## Outcomes & Retrospective

Planning establishes the task boundary and exposes the eligibility question without rewriting earlier evidence. Independent readiness review and planning-documentation checks pass. Package execution, exact literals and final freeze remain pending. The M2-04 failures and correction history remain in its archive; they are neither new M3-01 attempts nor authority to run more retrieval cases.

## Purpose / Big Picture

Make later generation observations interpretable: one reviewer can identify exactly what each of the three controlled cases supplied, what both providers were asked to return, what support was acceptable, and how success and failure will be judged before seeing an answer. The output is a frozen evaluation definition, not an LLM result, implemented validator, eligible production run or model-capacity claim.

## Context and Orientation

### M301-PLAN-01 — current project state

Planning began at clean HEAD `10edd950d82e74e2fdfd31978dc16c7315ba8b25`, with 220 tracked files. Twelve roadmap tasks are Complete: RD-001–RD-003, M1-01–M1-05 and M2-01–M2-04. M3-01 is the only task selected here; fifteen subsequent tasks remain Not started. This commit is historical entry evidence, never a hard-coded executable HEAD condition.

The implemented application has a loopback service, exact-three-rule Playwright/axe scan, validated single-file aggregate, React target/results UI, closed 8-source/16-passage corpus, local exact-vector retrieval, canonical citation inspection and deterministic sufficiency/abstention. M2-04's [final review](completed/m2-04-retrieval-checkpoint.md#m204-final-01--integrated-review-and-task-closure) passed the 449-test regression, strict/build, actual retrieval and bounded visual checkpoint. The embedding capacity gate passed in M2-02. Neither proves Qwen capacity or generation quality. Full-detail 200% visual verification remains with M6-03; no new UI is planned here.

Fresh planning checks on the unchanged implementation passed pinned Node `v24.20.0`, independent strict TypeScript, and 119 tests across `run-contract`, `scan-normalization`, `retrieval-contract` and `finding-sufficiency`. The full 449-test/build/real-browser results above are retained M2-04 evidence, not fresh planning executions. No generation adapter, proposal validator, review or comparison behavior exists in the current source. The bug index contains no recorded bugs. No model/runtime state was probed or changed.

Read [project requirements](../PROJECT_REQUIREMENTS.md) for status semantics, [roadmap](../DEVELOPMENT_ROADMAP.md) for ownership, and these exact authorities for execution:

- [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-001`, `004`–`008`, freeze boundary, controlled profiles and compact rubric; `002`, `003`, `009` constrain distinct observations, gold identity and reporting. [OD-009](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md) fixes the non-promotable six-execution manifest.
- [Evidence and review](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals): `REQ-GEN-001`–`006`, `008`–`010`, supported profile facts and `REQ-REV-009`; [information lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md) owns nested references, invocation existence and proposal-only review.
- [Provider execution](../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-005`, `008`, `009`, `011`, `015`, `019`; [privacy](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-002`–`007`, `013`–`016`, `021`. Derived [SPEC-003/SPEC-004](../specs/SPEC.feature) and [HS-008/HS-009](../specs/HARD_SPEC.feature) illustrate, but do not add, these contracts.
- [ADR-0003](../architecture/decisions/ADR-0003-initial-local-generation-evaluation-preset.md) selects `qwen3.5:4b` only for capacity screening; [ADR-0014](../architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) fixes Groq `openai/gpt-oss-20b` with strict Structured Outputs. [Local feasibility](../LOCAL_MVP_FEASIBILITY.md) and ADR-0004 govern later capacity, not a new M3-01 model experiment.

Reuse [RD-003 inputs](../../evaluation/rd003-scan-v1.json), [M2-01 gold](../../evaluation/m201-corpus-v1.json), [manifest](../../corpus/wcag22-mvp-v1/manifest.json) and [passages](../../corpus/wcag22-mvp-v1/passages.json), without changing them. Source responsibilities are already separate: [run types](../../src/server/domain/run-contract/run-types.ts), [evidence/reference types](../../src/server/domain/finding-analysis-types.ts), [evidence assessment](../../src/server/domain/finding-sufficiency.ts), [support policy](../../src/server/retrieval/support-policy.ts), and [citation resolution](../../src/server/retrieval/citation-resolution.ts). Inspect their actual exports before using them. M2-04's [fixture helper](../../tests/helpers/m204-checkpoint-fixture.ts) is synthetic seed evidence, not a new native scan or supported result for all profiles.

## Scope and Non-Goals

Freeze exactly three one-Finding case definitions, shared by Local and Groq, their eligible minimized packages, canonical gold/support references, one application-owned output contract, one instruction variant and provenance, material generation controls, one compact rubric, prohibited claims and failure interpretation. Keep scanner, retrieval, structural validity, semantic groundedness and remediation usefulness as separate observations. Retain one shared deterministic incomplete-guidance/no-call case rather than duplicating it per provider.

No source/test/dependency/configuration changes, model/credential setup, downloads, provider probes or calls, embedding requests, public scans, browser proof, fabricated model outputs, or mutations of retained runs are planned. M3-02 implements shared generation and validation; M3-03 owns Local configuration/capacity, M3-04 Groq setup/current availability, M3-05 integration, and M6-02 the six fixed executions. Their first inspected product-model outputs must respect this freeze. Do not spend their execution allowances here.

Do not add a prompt-management system, schema/code-generation framework, new provider, registry, retry/fallback, tuning, role-aware reranking, extra corpus/fixtures, scoring platform, release-grade provenance system or generalized safety classifier. Preserve Deferred prompt-injection hardening and all other Proposed/Deferred boundaries.

## Plan of Work

The smallest proof is direct inspection of a compact manifest and exact local inputs, canonical reconstruction with existing pure functions, and a small set of in-memory adverse variants. No reusable runner, browser harness or live model is necessary. Contract tables may describe future validator behavior without implementing that validator. **TDD: Not applicable**: these are authoritative evaluation definitions and decision artifacts, not executable production behavior. Replacement evidence is structural, semantic, preservation and negative checking below.

### A — resolve and freeze the package contract

After execution authorization, primary refreshes Git status, dependency closure, mapped authorities, protected file identities and command prerequisites. Treat repository fact gathering as R0; the consequential contract choices use the R3 route below. Research only unresolved evidence; do not repeat corpus acquisition or completed M2 verification.

Resolve these six items before `DRAFT READY`:

1. **Eligible-case provenance.** Establish whether a clearly labeled, independently constructed controlled supported package can satisfy the fixed generation case definition without masquerading as actual vector retrieval or entering a production path. Compare that bounded option with stopping for an owner-controlled retrieval/evaluation decision. Audit `REQ-EVAL-001/003/007/008`, `REQ-GEN-003`, and the roadmap's temporary-substitute rule together. Exact selected passages must satisfy all three required roles, match canonical metadata/text and fit `k = 3`; never alter historical G1–G3, invent cosine scores, bypass the existing sufficiency gate or claim controlled success repairs real retrieval. If current authority cannot support three eligible cases, record `OWNER DIRECTION`; do not silently change ranking, gold, inputs or requirements. Unaffected output/rubric definition work may continue, but the final freeze cannot pass.
2. **Input/reference contract.** Freeze exact one-Finding allowlisted facts and references, stable controlled target/fixture provenance kept outside model-visible content, exact guidance and notices where applicable, evidence completeness and support assertions derived from current validators. Keep target URL/origin/locator, page/element text, input values, siblings, raw records, vectors and history out of the model-visible package. Preserve local provenance without duplicating an outbound payload in `run.json`.
3. **Output/instruction contract.** Freeze field names, types, required/optional rules, bounds, evidence and citation reference grammar, exact proposal discriminator, confidence categories and uncertainty, assumptions, user impact, remediation, evidence sufficiency, blocking profile judgment and separate non-blocking reminder. Distinguish an adapter candidate from the application-owned abstention. Freeze one instruction variant, material generation controls and any deliberately defaulted control with documented semantics, not unspecified values. Establish compatibility of the shared contract with the accepted strict Groq schema using current primary documentation, without calls or adopting a schema framework.
4. **Interpretation.** Define a field-to-requirement rubric and expected profile-specific manual judgment. Mechanical rejection covers malformed structure, nonexistent or wrong-Finding evidence references, unresolved/invented citations and defined prohibited claims. A structurally valid but semantically unsupported claim is a reviewer edit/reject issue, not a post-call abstention. Prohibit certification, legal compliance, whole-page/site accessibility, complete SC conformance/non-conformance, and claiming a fix from automated change alone. Freeze exact mechanical policy and its limits; keyword presence is not proof of complete semantic safety. No percentages or aggregate ranking.
5. **Storage/provenance.** Keep one safe tracked manifest at `evaluation/m301-generation-v1.json` and this plan's explanation; do not add another specification document. Reserve `temp/m301-generation-freeze-v1/` for exact local assembled packages/instructions that cannot be copied into tracked evidence under `REQ-SEC-021`. Before any write, select the exact child filenames, encoding/byte identity, contents, approved synthetic provenance, retention and reconstitution procedure; verify ignored/untracked status and ordinary in-repository paths. The safe manifest links versioned identities and validation expectations without raw prompts/payloads. Loss of an exact local package blocks later calls until verified identical reconstruction or a new freeze. A proposal to publish excluded content requires owner direction, not an inferred synthetic-data exception.
6. **Decide now / prove later.** Complete case, output, instruction, control and interpretation semantics now. M3-02 later proves runtime validators, minimization and no-truncation context-fit behavior; M3-03 later records exact acquired Qwen digest/runtime/quantization/context/offload and capacity; M3-04 proves fixed Groq mapping/current availability. Record those as explicitly unproved prerequisite slots, not unresolved M3-01 semantics or a capacity PASS. Before their first output is inspected, the downstream task must bind exact configuration to this package, recheck fit and freeze any material amendment as new evidence. No adapter may choose a different contract or silently shorten the package.

Only after mandatory synthesis and the fresh contract checkpoint may primary author B. Ordinary task literals do not require a new ADR; significant architecture changes or owner-controlled scope/interpretation changes stop at their existing approval route.

### B — author, verify and record the freeze

Primary is sole writer of the authoritative static manifest, local evaluation definitions and living documentation, between leases. No researcher/reviewer writes and no worker receives evidence-document ownership. **Responsibility placement: None — no application-source responsibility changes.** Existing pure validators remain dependencies of verification, never consumers of a new product configuration. No structural refactor is permitted.

Write only after the exact command/storage slots below and A's six items pass their barrier. Inspect every case and contract field against its authority and canonical source; verify both modes reference identical application inputs and output semantics. Run the complete invariant packet, independent strict checking, and fresh final `critical_research_reviewer` review of the whole artifact and evidence. Primary accepts the actual artifacts and results, not just the report. Preserve unresolved runtime proof as later work and do not mark an unproven case successful.

At closure update the task row, plan/progress indexes and task progress, plus the maintained README/evaluation navigation only where the delivered artifact changes their instructions or current statements. Read any newly affected document completely before editing. Mark Complete and archive only after M3-01 Verification and the documentation gate pass. A later task still requires selection.

If inspection demonstrates a necessary executable helper, first reconsider direct checks. Do not improvise code under primary evidence ownership: revise the work-slice contract with exact paths/commands and apply the [worker-first workflow](../../.codex/execplan-implementation-workflow.md) and [write lease](../../.codex/write-lease-guard.md). A non-behavioral setup uses guarded `code_worker`; real production behavior belongs to a separately selected task with independent test/Green ownership. No helper is currently planned or authorized by this planning request.

## Decision Review Contract

**Owner/artifact:** M3-01; the future safe manifest, exact local package and task-owned freeze explanation. **Tier: R3**, triggered by identity/reference binding, closed provider data boundaries and integrity of evidence interpretation, not by model selection or the number of cases. This plan records the future decision procedure; it does not itself select unresolved generation literals. Planning inspection has not executed that research barrier.

One bounded non-ranking discovery pass may identify candidate package provenance/storage representations and primary provider-schema sources. Freeze the viable candidate set and common comparison matrix before comparative research. Compare authority fit, case eligibility, reference correctness, payload minimization, shared-provider expressibility, reproducibility and smallest maintenance burden. A hard-gate failure disqualifies an option; do not rank a forbidden option as a compromise. Required artifact-local outputs are A's six resolved items, input/output/provenance mappings, rubric, failure interpretation and the entire invariant packet.

Use at most two read-only `critical_researcher` reports: (1) eligible-case provenance/canonical references and unchanged retrieval boundary; (2) shared output/instruction/minimization/storage contract and provider expressibility. Each receives [Research Assignment Capsule v1](../../.codex/README.md#research-assignment-capsule-v1), exact authorities, shared evidence identity, no-output/no-write permission, a useful-detail limit of 1,000 words plus necessary contract tables, and one targeted follow-up round. Independent dimensions may run concurrently while primary resolves repository facts. Do not add a routine third researcher or drafter.

Wait at one evidence barrier. Mandatory `decision_analyst` receives the combined evidence and contract, with one synthesis and one bounded correction, and returns exactly `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. R3 requires a fresh `critical_research_reviewer` pre-draft checkpoint even after DRAFT READY; permit its one supported outline correction. Primary drafts only after PASS, then a different fresh `critical_research_reviewer` performs final semantic/evidence review. Use configured role pins from the [model policy](../../.codex/README.md#model-and-reasoning-policy); no policy or model migration is selected here.

Final-artifact corrections have the workflow's two-cycle ceiling. Re-run the entire packet and complete artifact review after every material R3 revision. Reuse researchers only within their remaining follow-up allowance; a new identity never resets a budget. Stop for repeated decisive gaps without new evidence, two unsupported synthesis returns, exhausted allowance, authority conflict or expanded scope. Primary completes unaffected authorized work, records precise missing owner direction and does not present REVISE/BLOCKED as acceptance-ready.

| Invariant | Trigger / expected result | Evidence at planning | Responsible acceptance |
| --- | --- | --- | --- |
| I1 Completeness | All A items resolved; exactly three eligible case definitions, one shared contract and six future case/provider bindings; no model output used to select them | Pending | Analyst; both R3 reviewers; primary |
| I2 Honesty and authority | Actual M2-04 G1–G3 stay abstained; controlled inputs labeled; no ranking/corpus/sufficiency change, new product path, approval or capacity claim | M2-04 closure and M301-PLAN-01 | Both R3 reviewers; primary |
| I3 Identity and support | Each case references exactly one complete Finding; every passage reconstructs from the unchanged corpus; all roles present; unknown/wrong-profile/altered references fail | Existing 119-test boundary; package pending | Researcher 1; both R3 reviewers |
| I4 Privacy and ownership | Selected-only allowlist; forbidden data excluded; adapter credentials never model-visible/retained; tracked artifacts contain no raw prompts/payloads; primary owns evidence writes | Authorities/current source inspected; package pending | Researcher 2; both R3 reviewers |
| I5 Shared output and judgment | Both modes use the same structure and reference policy; confidence is categorical, abstention distinct; blocking judgment/reminder and semantic-review boundary retained | Pending literal freeze | Analyst; both R3 reviewers |
| I6 Failure and no-call meaning | Incomplete/missing/conflicting evidence guidance abstains; integrity/context-fit/prerequisite/call/validation errors remain their distinct failures; no retry/fallback or fabricated invocation | Existing abstention evidence; generation rules unimplemented | Both R3 reviewers; primary |
| I7 Freeze and recovery | Exact local inputs and safe provenance agree; tampering or missing files blocks use; material changes preserve old versions/evidence; all later configuration proofs explicitly pending | Pending exact paths/commands and freeze | Both R3 reviewers; primary |

## Concrete Steps

Run from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Load only the definition block in [README development command preparation](../../README.md#development-command-preparation) into the actual calling PowerShell session; do not replay the adjacent dependency-restore command. Missing runtime/dependencies stop for reconciliation, not installation.

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'Git status failed' }
$m301EntryHead = git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'HEAD lookup failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
```

Record current intentional HEAD, branch, index/dirty paths and relevant file hashes. Classify pre-existing changes and preserve them; no clean-tree or uncommitted-plan requirement is assumed. Recheck all controlled fixtures, corpus/gold, source/tests and package/configuration inputs against the accepted entry. Historical commits and raw checkout hashes are not substituted for the corpus validator's own normalized-content identity.

```powershell
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Pinned Node required' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test tests/run-contract.test.ts tests/scan-normalization.test.ts tests/retrieval-contract.test.ts tests/finding-sufficiency.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Contract checks failed' }
}
```

Expected current result: strict PASS and 119 passing tests; changes in that count require explanation, not editing tests to match it. These checks make no model request. Reuse unaffected M2-04 suite/build evidence by full evidence identity; task closure follows the complete authoritative-suite rule, preparing any required broader command and its effects before execution. Do not blindly launch the browser-heavy suite merely to draft documentation.

These **unresolved future command slots are not executable permission**. Primary fills exact commands, arguments, expected results and caller/error boundaries in this section during A, before package writes or any optional worker lease:

| Slot | Binding content required before use |
| --- | --- |
| Package creation/storage | Exact tracked manifest and local child filenames; UTF-8/newline representation; ordinary-path and ignored/untracked checks; whether paths must be absent; primary `apply_patch` writes; no overwrite of existing evidence |
| Canonical reconstruction | Exact pinned-Node command/imports and evidence/JSON inputs; existing evidence, retrieval and citation validators; selected-Finding and role checks; no model/browser import effects |
| Negative checks | Exact in-memory mutations for missing roles/evidence, wrong/unknown references, altered passage, sibling/forbidden field, incomplete output definition and mismatched version/hash; expected rejection or gate failure, without modifying frozen files |
| Freeze receipt | Exact safe fields, UTC freeze time, versions, hashes and references; verify all three local packages are present and identical across provider bindings; mark downstream runtime/adapter slots unproved |
| Regression/closure | Exact applicable full-suite command, prerequisites and generated scratch effects, or documented unchanged-evidence reuse where permitted; independent strict command above; manifest/Markdown/link/status checks and `git diff --check` |
| Retention/recovery | Preserve exact inputs needed downstream and earlier failures; no default deletion. Any later cleanup names only validated task-owned disposable files and its effects; no broad temp, run, model, dependency or workspace cleanup |

No bootstrap, dependency restore, live retrieval, service/browser startup or generation command is needed for the planned static route. If a slot cannot be resolved without such an effect, return to scope/command triage before acting.

## Validation and Acceptance

A passes only with complete evidence, mandatory DRAFT READY, fresh pre-draft PASS and primary reconciliation of all six decisions and I1–I7. An unresolved eligibility authority or material contract semantic cannot be deferred as runtime proof. Owner-controlled decisions remain owner-controlled.

B passes only when exact packages are frozen before product-model outputs, every case is demonstrably complete/supported under the accepted provenance route, all input/reference and privacy checks pass, both modes bind the same contract, and the rubric/failure policy is complete. Inspect exact artifacts, not a receipt alone. Negative evidence must fail the intended boundary, not merely parse or throw for an unrelated missing import. Hand-authored output vectors, if needed to illustrate validation, are explicitly synthetic and do not count as model success; production runtime validation remains unimplemented.

Recheck protected inputs and current status, full applicable invariants, independent strict TypeScript, applicable regression evidence and fresh final R3 review. Resolve every finding and reconcile the reviewed artifact, verdict, requirements, remaining runtime gates and next action. `PASS WITH FOLLOW-UPS` advances only when no item conflicts with a hard gate or definition of done. Complete the [documentation closure gate](../README.md#task-closure-documentation-gate), including links, JSON syntax, UTF-8/newlines, command parsing, status consistency and `git diff --check` before marking Complete.

There is no test preflight/Red/Green or lease receipt to fabricate for primary-authored decision documents. If the optional helper contingency is actually selected, its revised contract must supply packet/lease/role identities, non-TDD or characterization justification, actual diff inspection and proportional fresh implementation review under the existing workflow.

## Idempotence and Recovery

Inspection and pure checks are safe to repeat; drafting never overwrites an earlier frozen/evaluated version. Before resumption read Current state, applicable A/B contract, affected authorities, evidence and history as required by PLANS.md. Refresh the real HEAD and identities after an intentional commit or intervening edit; a commit alone is not a failure, and historical HEAD is never an executable receipt condition.

Preserve unrelated changes, retained runs, dependencies, runtime/model installations, corpus and fixtures. No recursive deletion or Git mutation is planned. An unexpected path, reference mismatch, secret/raw-content risk or active lease stops affected writes; primary reconciles between leases without reverting others. Missing local exact inputs block downstream evaluation until identical authorized reconstruction is proven; otherwise create a new version and preserve the old evidence. Never use output-informed tuning, a new researcher identity, or reclassification as routine recovery to bypass a gate or replenish allowance.

## Artifacts and Notes

Current deliverables are this plan, roadmap activation, plan index and matching progress record/index only. Future M3-01 execution adds the safe manifest and exact local package specified in A, with concise research, synthesis, checkpoint and validation evidence retained here. No standalone research report, command framework, raw agent transcript or telemetry ledger is needed. Exact paths/hashes and decisive results belong in the execution record; private raw inputs remain outside tracked evidence.

## Interfaces and Dependencies

M2-04 is the completed prerequisite. Existing scanner, corpus, gold, native evidence and support/citation contracts are read-only inputs. M3-01 supplies a frozen case and application-output specification immediately consumed by separately authorized M3-02, not a new runtime API. Local/Groq protocol mapping and operational availability remain with their adapters; no new package, library or service is selected. The agent workflow is repository coordination only, not product-runtime orchestration.

### M301-PLAN-REVIEW-01 — accepted planning readiness

On 2026-09-09 a fresh read-only `critical_reviewer` returned **PASS** for pre-execution planning readiness, with no outstanding findings. Named S3 triggers were selected-Finding privacy, canonical evidence/reference identity and freeze recovery. It reviewed the complete plan and five-file planning surface against controlling authorities, M2-04 closure, the R3 route, command gates, preservation and YAGNI. A minor progress-table separator was corrected by primary and verified by the reviewer. The reviewed plan's SHA-256 was `AD092CDE1FA05482698A093D22DB04BF7993C3F0AF61010820EC491CBA445587`; the subsequent acceptance/status entry changes no execution contract.

Primary accepts that verdict and the underlying evidence: fresh strict TypeScript and 119 focused tests; all affected local Markdown links/anchors, both PowerShell blocks, strict UTF-8, final-newline and whitespace checks pass. Of 220 entry tracked files, all 217 outside the three intended existing-document edits remain byte-identical. Only those edits and two new M3-01 documents exist; the staged diff is empty. Roadmap counts reconcile as 12 Complete, 1 planning-only In progress and 15 Not started. The reviewer independently confirmed Git state, no active lease and absence of the future manifest/local package; it did not repeat model, browser or application execution.

Documentation impact: Updated only this plan, the roadmap planning activation, plan index and matching progress record/index. No requirement, ADR, specification, completed task or application behavior changed. This PASS permits bounded research only after a separate execution request; it is not the future R3 contract checkpoint, package freeze or M3-01 completion.

## Revision note

2026-09-09 / primary: Created the planning-only M3-01 ExecPlan from current M2-04 closure and fresh pure checks. Made the real-retrieval eligibility gap and safe exact-package storage explicit gates; kept implementation, provider execution and speculative tooling outside scope. Recorded independent planning PASS, corrected index formatting and accepted documentation/preservation checks without changing the future execution contract.
