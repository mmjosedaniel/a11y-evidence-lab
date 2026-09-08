# Add deterministic sufficiency, abstention, and Finding detail

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M2-03](../DEVELOPMENT_ROADMAP.md#m2-03--apply-support-states-abstention-and-finding-detail-presentation), In progress for planning. The owner's 2026-09-08 request authorizes current-state review and this plan, not application execution, model calls, acquisition, commit, or publication.
- **Accepted entry evidence:** [M203-PLAN-01](#m203-plan-01--current-project-review). M2-02 is Complete, including its capacity gate. Planning starts from clean HEAD `acb58a4584c2ca67e36eafdf237c9763993725f5`; this is historical provenance, not an executable HEAD constant.
- **Remaining gates:** Execution authorization, fresh entry reconciliation, the [literal contract](#decision-review-contract), exact command/effect preparation, then sequential [A–C](#plan-of-work). [Planning readiness](#m203-plan-review-01--accepted-planning-readiness) passed; no implementation result is claimed.
- **Allowance / lease:** No execution attempt consumed; use the [recorded budgets](#ownership-budgets-and-advancement). Active lease: None.
- **Next action:** On a subsequent execution request, capture `M203-ENTRY-01` and complete the literal barrier before worker preflight. Resume through [Concrete Steps](#concrete-steps), [Validation and Acceptance](#validation-and-acceptance), and [Idempotence and Recovery](#idempotence-and-recovery).

## Progress

- [x] (2026-09-08 22:48Z) Reviewed roadmap-wide status, current architecture and developer boundary, M2-02 closure/capacity qualifications, frozen inputs, relevant application/test surfaces, and task authorities; see M203-PLAN-01.
- [x] (2026-09-08 22:48Z) Independently passed strict TypeScript and 93 pure run, scan-normalization, and retrieval-contract tests on the unchanged application tree.
- [x] (2026-09-08 23:02Z) Passed plan-only validation and fresh critical readiness review with no findings; accepted M203-PLAN-REVIEW-01 and reconciled the five planning documents.
- [ ] Obtain execution authorization, reconcile current state, and freeze the reviewed task literals and exact commands.
- [ ] Accept slice A: deterministic support, evidence sufficiency, citation resolution, and abstention policy.
- [ ] Accept slice B: selected-Finding durable outcome and loopback integration.
- [ ] Accept slice C: accessible selected-Finding guidance and outcome presentation.
- [ ] Pass task regression, browser integration, fresh integrated review, exact cleanup, and documentation closure before completing M2-03.

## Surprises & Discoveries

- Successful M2-02 retrieval deliberately retains `state: 'active'` and its service owner. `createRetrievalOperation` rejects further activations while that owner exists. Support and terminal decisions must extend this live handoff without introducing automatic resume or silently releasing a supported unfinished workflow.
- `readStoredFinding` permits only unprocessed, active retrieval, and failed retrieval combinations. The repository transition accepts only activation and retrieval completion/failure. Adding an abstention requires a precise new validated transition; a general completed-run rewrite would discard existing guarantees.
- The corpus manifest declares three required roles per profile (`criterion`, `interpretation`, `remediation`) and an empty `unresolvedConflicts` array. An empty production declaration does not excuse omitting conflict-policy tests, nor authorize changing the frozen corpus to create them.
- `ResultDetail` currently renders only `RuleEvidence`; `main.tsx` posts only Analyze. No retrieval HTTP route, citation projection, support policy, or abstention UI exists. The selected evidence layout already preserves card focus and needs no new screen or navigation framework.
- M2-01 source notices explicitly require a presentation review when excerpts are displayed. A citation URL by itself is not the complete accompanying notice presentation.

## Decision Log

- Decision: Activate only M2-03 planning and keep all application effects pending an execution request. Rationale: the owner requested an ExecPlan; M2-02 completion satisfies the dependency but does not supply that grant. Date/Author: 2026-09-08 / primary.
- Decision: Use three cohesive behavioral slices and the existing tools, repository publisher, retrieval engine, and UI owners. Rationale: these are the current policy, durable-operation, and presentation responsibilities; extra services, setup stages, or per-component TDD cycles are unnecessary. Date/Author: 2026-09-08 / primary.
- Decision: Treat planning inspection as R0 and reserve R3 decision work for the unresolved execution literals. Rationale: accepted support meanings already control; planning neither ranks mechanisms nor selects new serialization, ownership, or failure semantics. One critical plan-readiness review addresses the proposed integrity/recovery boundaries. Date/Author: 2026-09-08 / primary.

## Outcomes & Retrospective

Planning is complete and independently accepted for planning readiness only. The implemented baseline ends at internal retrieval and durable provenance. M2-03 remains In progress; implementation, support outcomes, displayed citations, abstention behavior, and new browser results remain unproved. The full M2 integration/gold check remains M2-04. Keep detailed results here and concise material outcomes in the [progress record](../progress/m2-03-sufficiency-abstention-and-detail-ui.md).

## Purpose / Big Picture

After a complete scan, a user can select one Finding, explicitly request guidance, inspect its exact cited passages alongside the preserved scanner evidence, and understand the deterministic outcome. Complete evidence and `supported` guidance indicate eligibility for later generation. Incomplete evidence or completed insufficient/conflicting guidance produces a terminal application-authored abstention with blocking information, no-provider-call confirmation, and manual-investigation guidance. Retrieval execution or integrity failure remains a distinct failure with no support state.

Success is observable through the actual loopback UI and a validated `run.json` readback. No proposal, provider invocation, review decision, or generation action is needed to demonstrate this task.

## Context and Orientation

### Readiness and controlling authorities

Start with the [authority map](../README.md#authority-and-status-map), [task router](../README.md#read-by-task), and [requirements semantics](../PROJECT_REQUIREMENTS.md). M2-02's [final closure](completed/m2-02-embedding-retrieval-capacity-gate.md#m202-closure-01--final-integrated-verification-and-documentation-impact) and the [dated capacity observation](../LOCAL_MVP_FEASIBILITY.md#m2-02-retrieval-only-observation--2026-09-08) satisfy the dependency. Preserve their limitations and consumed grants. All named task Must rows below are Accepted; directly applicable architecture records are Accepted at their stated MVP/evaluation scopes. Ordinary record, HTTP, copy, and test literals belong inside M2-03.

| Authority owner | Required scope |
| --- | --- |
| [Evidence and review workflow](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval) | Roadmap IDs `REQ-EVID-004`, `REQ-EVID-007`, `REQ-RETR-004`, `REQ-RETR-005`, `REQ-GEN-001`, `REQ-GEN-009`, `REQ-GEN-010`; support order and meanings. Also preserve `REQ-EVID-003`, `008`, `009`, `011`, `REQ-RETR-001`, `006`, `REQ-CORP-003`–`007`, and `REQ-UX-002`, `004`, `005`, `010`–`014` on affected boundaries. |
| [Information/lifecycle model](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md#finding-lifecycle) and [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) | Stable run/Finding identity, one active workflow, immutable native/sibling evidence, terminal abstention/failure, failed-write truth, historical reads without resume, one aggregate and no child identities. |
| [ADR-0022](../architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md), [manifest](../../corpus/wcag22-mvp-v1/manifest.json), [passages](../../corpus/wcag22-mvp-v1/passages.json), [gold mappings](../../evaluation/m201-corpus-v1.json) | Exact versioned passages, rule/SC mapping, required roles, normative precedence, curator declarations, attribution and use notices. Gold expectations never become runtime ranking filters. |
| [Application accessibility](../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md) | `REQ-A11Y-001`–`004`, `010`, and preservation of `009`; bounded checks under `006`, not a support matrix. |
| [Privacy](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md) and [reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md) | `REQ-SEC-005`, `012`, `027`; `REQ-QUAL-010`–`012`, `019`, `020`: unprivileged renderer, inert content, service validation, independent strict checking, ownership and last-valid persistence. |
| [ADR-0012](../architecture/decisions/ADR-0012-react-as-initial-user-interface-library.md), [ADR-0015](../architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md), [UI contract](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md), [visual guidance](../ui/VISUAL_FOUNDATIONS.md) | Existing React/loopback composition and OD-026/OD-027 presentation boundary. Preserve scan-only omissions; add only the selected downstream regions. |
| [Evaluation](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#derived-behavioral-scope), [SPEC](../specs/SPEC.feature), [HARD_SPEC](../specs/HARD_SPEC.feature) | BHV-02; abstention/failure portions of BHV-03; SPEC-002; `Abstain when evidence or guidance is insufficient` and `Fail retrieval without assigning a support state` in SPEC-003; no-call/abstention boundary of HS-008. Generation/context-fit execution remains M3. |

The [evaluation freeze](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) preserves RD-003's six scanner fixtures and M2-01's eight-source/16-passage/three-gold snapshot. New deterministic policy vectors must be frozen before their implementation/evaluation; they do not rewrite either manifest. M3-01 owns generation packages and M2-04 owns the full gold and shared abstention integration evaluation.

### M203-PLAN-01 — current project review

At planning entry, Git is clean at `acb58a4584c2ca67e36eafdf237c9763993725f5`, with 198 tracked files and no active write lease. Ten roadmap tasks are Complete, eighteen Not started, and none active before this selection. M1 supplies actual scan-to-disk/HTTP/React behavior; M2-01 supplies the closed corpus; M2-02 supplies actual local embedding/exact search and internal selected-Finding publication. Later generation, human review, comparison, and final evaluation are absent. The bug index contains no records. Proposed architecture assessments and Deferred features remain outside this work.

M2-02's 398-test/build result and 3846.0786-ms capacity observation are historical evidence. Its post-closure final-newline correction is separately proved and does not renew original hashes. This planning review freshly passed Node 24.20.0, strict TypeScript, and 93 tests from `run-contract`, `scan-normalization`, and `retrieval-contract`, with zero failed/skipped/todo cases using C1. It did not rerun browser suites, build, inference, or capacity. Model availability now is not inferred from historical success.

Current responsibility map: `src/server/retrieval/` owns fixed catalog/query, bounded loopback embedding, lazy collection and ranking. `local-service/retrieval-operation.ts` owns the selected operation; `service.ts` owns shared reservation and stop; `persistence/run-repository/` owns staged publication and transition checks; `domain/run-contract/` owns pure record validation. React's `App.tsx` coordinates the current run, selection and announcement; `ResultsSection`, `FindingsPanel`, `ResultCard`, `ResultDetail`, and `RuleEvidence` separate composition, list, selection and evidence. Tests use Node's runner, Playwright and existing controlled helpers; no new dependency is presently justified.

Preserve checkout fingerprints: manifest `87D8867ED1138BFB38E6C44EED67A79B0A43BDAF2532A056AFAFAED828202DA9`; passages `29EA0033E825A0FA20430AA42E9718B87A87AA59EDADDA0A3876A0A7BE871850`; gold `A7D38CACF98BF263CDD53012350708BE987699DF21B4C0F1BB7F32BC1892E29B`; RD-003 manifest `13C9722BE9EA2E3B0AAF020EA91F429A701180A83814FE7AB21BAF2DDAD57459`. These are checkout-byte identities, not substitutes for M2-02's normalized runtime corpus integrity. Investigate an intentional checkout conversion before deciding whether evidence remains applicable.

## Scope and Non-Goals

Own only deterministic support and evidence sufficiency, resolvable citations, the validated abstention branch, distinct retrieval failure, the required selected-Finding transitions/service API, and accessible detail UI. Selection remains evidence inspection; a separate explicit guidance action initiates the operation. Preserve all Findings and ScannerReviewObservations and their current grouping. Observations are never retrieval targets.

Exclude generation calls/adapters/probes, a Generate control, fake proposals, provider invocation records, review actions, automatic retry/resume, batch analysis, new Finding lifecycle aliases, run reopening, new model/corpus versions, ranking changes, thresholds, rerankers, source acquisition, migrations, persistent vector storage, and generic workflow or UI frameworks. Do not change the M2-02 finite query/input domain, model/runtime configuration, package pins, or frozen fixtures. Any demonstrated need beyond these boundaries returns to its authority before dependent work.

## Decision Review Contract

### M203-LITERALS-01 — execution-stage selection barrier

Status: **Not frozen**. Planning inspection is R0; this future decision is R3 because new nested result validation and selected-Finding transitions affect integrity, identity, ownership and recovery. The artifact is the following literal contract completed in this plan by the primary. It cannot approve a new architecture, corpus revision or expanded owner scope.

During authorized execution, allow one non-ranking discovery pass only over the current implementation and applicable primary evidence. Freeze the smallest viable mechanism set, common criteria, required outputs and invariant fixtures before comparison. Criteria are authority fit, preservation, failure truth, direct reuse, demonstrable behavior and maintenance cost. Evidence classes are controlling requirements, current source/tests, frozen corpus metadata, existing accepted M2-02 evidence, and current primary source-use evidence where the display review needs it. No broad model, framework, library or architecture survey is warranted.

| Literal | Required decision before dependent preflight |
| --- | --- |
| D1 — evidence and branch order | Exact required fields for each of the three profiles, reference representation, unavailable and not-applicable handling, and deterministic blocking reasons/manual guidance. A missing comparison-only locator or genuinely optional shadow fact must not automatically become missing required evidence. Native `false`, absent alt, or failing ratios may be complete evidence of a violation. Separate human contextual judgment from required captured evidence. Freeze whether the evidence gate precedes retrieval; if retrieval is attempted, execution/integrity error cannot become abstention. |
| D2 — citations and support | Exact validated catalog-to-citation projection, required roles from manifest, rule/SC applicability and order: error without support, conflicting, missing, incomplete, supported. Define the smallest curator-conflict input/validation and normative-precedence rule; the production snapshot has no conflicts. Synthetic conflict vectors stay test-local, cannot enter through user input, and must not bypass production corpus identity validation. Scores never establish support; do not fetch omitted roles or reorder top three. |
| D3 — result and durable transition | Exact nested fields, discriminants, chronology, allowed evidence/passage references, compatibility with valid M2-02 records, support placement, strict extra-key rejection and format-version disposition. Abstention references existing records without copying evidence/passages; it records the applicable sufficiency, blockers, reason, no-provider-call confirmation and manual investigation, with no remediation conclusion or invocation/review object. Freeze supported unfinished state, terminal abstention/failure, and treatment of incomplete evidence when retrieval is absent. |
| D4 — ownership, API and publication | Exact service callable and browser method/path/request/response/error mapping. Reuse `retrieveFinding`, `updateRetrieval` and their current collaborators where responsibilities fit. Define active-owner retention for supported unfinished work, release after durably terminal outcomes, duplicate/stale/wrong-Finding rejection, read/interrupted behavior, operation versus workflow ownership, failed publication, disconnect, shutdown and late-result handling. Preserve valid historical active records without automatic completion or resume. |
| D5 — browser projection and presentation | Exact response admission and detached citation view, current run/selected identity checks, transient busy/failure handling, source-notice presentation, headings/copy and shared announcements. Complete the reuse audit below, ensure safe original-source links, and freeze browser evidence inputs/commands. Raw corpus text is inert; browser code imports no privileged corpus loader, model, filesystem or process implementation. |

D1–D4 and the shared D5 wire shape are decided before A; remaining reversible D5 layout/copy is frozen before C. Exact runtime conformity and browser observations are proved afterward. A worker cannot invent a missing decision while making tests pass. Add an ADR only if findings require a significant mechanism outside Accepted decisions; ordinary task-owned literals do not need one.

Research budget: one `critical_researcher` covering the related citation/record/transition integrity dimension; a second is permitted only if discovery isolates a distinct unresolved ownership/recovery dimension that cannot fit the first report. At most one targeted follow-up per researcher. One `technology_researcher` is permitted solely if the excerpt-display/use-condition question requires fresh external evidence; otherwise use recorded notices directly. Supply [Research Assignment Capsule v1](../../.codex/README.md#research-assignment-capsule-v1), exact gaps and useful-detail limits; roles remain read-only. One synchronization barrier feeds mandatory `decision_analyst`, then a fresh `critical_research_reviewer` pre-draft checkpoint, primary authoring, and a different fresh final `critical_research_reviewer`. No drafter or optional panel is needed. Apply one supported pre-draft correction and the workflow's two-cycle final decision-artifact ceiling; do not reset budgets through new IDs. `DRAFT READY` and both checkpoints are required; `RETURN FOR RESEARCH` uses remaining allowance and `OWNER DIRECTION` returns to primary triage/owner scope as applicable.

### Cumulative invariant packet

Each future literal review applies this complete packet after every material revision. Actual evidence is pending; record it with `M203-LITERALS-*` identities. The two research reviewers own decision coverage; slice/final reviewers own implemented proof.

| ID | Trigger / fixture | Required result | Implementation review |
| --- | --- | --- | --- |
| I1 | Every revision and baseline change | Complete D1–D5 at their barriers; accepted versus proposed/observed facts and authorization remain honest; old HEAD/dirty paths are not forced. | All reviewers |
| I2 | Full/partial/zero role sets; unresolved conflict; normatively resolved conflict; tied/high/low scores | Exact accepted support order and mapped canonical references; neither score nor gold IDs substitute for roles. | A critical |
| I3 | Missing/invalid/withheld required facts; false/absent but valid facts; optional/not-applicable fields | Exact evidence policy; truthful abstention with references, blockers, investigation and no remediation/invocation/review. | A/B critical |
| I4 | Unknown, duplicated, wrong-version or altered citation; missing/changed catalog; forged support | Integrity failure without support or abstention; no partial misleading citation set or corpus repair. | A/B critical |
| I5 | Two Findings; duplicate request; wrong run; stale response; one active owner | Only selected nested data changes; original scan/observations/siblings/provider context remain identical; no overlap, fan-out or owner transfer by selection. | B/C critical |
| I6 | Activation/final write failure; stop/deadline/disconnect; historical active data | Last valid aggregate authoritative; no unsaved success, false terminal release, late publication, retry or resume. | B/C critical |
| I7 | Browser requests/content and ordinary Analyze/selection | Same-origin application boundary; no user-supplied vectors/support/endpoint; no model work from selection; inert text and safe canonical citation destinations/notices. | B/C critical |
| I8 | Keyboard selection/action/citation inspection; narrow/zoom/long text; outcome changes | Preserved list/focus, shared truthful announcements, distinct source/state labels, no clipped guidance or horizontal page overflow. | C critical with visual coverage |

## Plan of Work

### Ownership, budgets and advancement

Use the current [worker-first procedure](../../.codex/execplan-implementation-workflow.md), [guard](../../.codex/write-lease-guard.md) and [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md). Each slice has a separate `test_worker` and its specified Green worker. Primary completes Packet v2 and accepts read-only preflight, exact test boundary, actual diff/cohesion, terminal receipt and focused evidence before advancing. The path envelopes below are proposed responsibility placements; freeze the exact subset and callables in D1–D5 and project it unchanged into the packet and lease. No directory-wide source permission is implied.

Preflight uses the published classification routes. Covered behavior gets no new test or Green; uncovered behavior gets characterization; missing/regressed behavior gets one coherent Red; partial gaps are isolated. A genuinely absent agreed callable may use only the verified first-module exception, recording which assertions did not execute. Green must run every accepted test unchanged plus independent strict TypeScript. Every write turn has a primary-opened/freshly closed lease; primary documentation occurs between leases. Ordinary test correction belongs to `test_worker`; the bounded primary exception invalidates evidence and requires re-acceptance.

Budgets are one preflight, one Red/characterization, one Green, ordinary attempt-2 correction and conditional attempt-3 correction per unchanged role/phase chain under the current procedure, plus one review correction loop. Record progress/new evidence and the different corrective action before attempt 3. Stop on unsuccessful attempt 3, the same decisive failure twice without new evidence, two no-diff write handoffs, changed binding fields, exhausted authority or unresolved conflict. A worker stop returns to primary triage; continue unaffected authorized work. IDs or replacement agents cannot reset allowances. Post-Green cohesion is `RETAINED`, `REFACTORED` or `RECONCILE`; pre-Green/non-source work uses `None`.

There is no planned setup lease or dependency change. Planning, literal selection, manual browser observations and documentation use **TDD: Not applicable**, with semantic/structural/manual evidence. Any indispensable executable helper is test-worker-owned under its slice, never primary-written as a workaround. Compare a direct use of existing helpers before creating one; do not build another evaluation platform. Independent read-only research may overlap; A, B, C and all write leases remain sequential.

### A — deterministic decision and citation policy

Outcome: one validated native Finding plus an actual validated retrieval/catalog package yields the exact support/evidence decision and either later-generation eligibility or an application-authored abstention; invalid execution/integrity input yields an error. It performs no model call or durable write. Authorities: D1–D3, I2–I4, `REQ-EVID-004`, `007`, `REQ-RETR-004`/`005`, `REQ-GEN-001`/`009`/`010`, ADR-0022, SPEC-002/003 and HS-008.

Production envelope: proposed `src/server/retrieval/citation-resolution.ts` owns canonical passage/source resolution and display metadata; `support-policy.ts` owns role/conflict classification; `src/server/domain/finding-sufficiency.ts` owns required evidence/blockers; `finding-analysis.ts` owns the small typed decision/abstention construction. Reuse fixed catalog/reference validators and existing domain fact readers. These are distinct current responsibilities, not a generic policy or schema framework. Keep decision functions pure; service code supplies validated inputs. Domain policy must not import corpus-file I/O, LangChain, transport or React. If a minimal type extraction is necessary for that direction, freeze its exact path before preflight.

Test envelope: new `tests/finding-sufficiency.test.ts` and, only if needed, `tests/helpers/m203-finding-fixture.ts`; exact affected cases in `tests/retrieval-contract.test.ts`. Reuse M102/M202 native and retrieval factories. Freeze an incomplete-role package and conflict vectors as tests, not edited canonical corpus/gold or fake model evidence. Test every support state and precedence, required versus optional unavailable facts, exact references, forbidden fields, deterministic explanations and no mutation. Focused C-A plus C-STRICT prove the contract. `test_worker` then `code_worker`; S3/fresh `critical_reviewer` for identity/reference integrity. Accept `M203-A-*` before B.

### B — durable selected outcome and application API

Outcome: the existing selected-Finding operation applies A, durably publishes its permitted result, and exposes only the minimum loopback action/citation projection consumed by C. Failure preserves native scan evidence, siblings and the last valid aggregate. Authorities: D3/D4, I3–I7, lifecycle, ADR-0021, `REQ-SEC-027`, `REQ-QUAL-011`/`012`, SPEC-003 failure and HS-008.

Production envelope: `src/server/domain/run-contract/run-types.ts`, `retrieval-validation.ts`, new focused `finding-analysis-validation.ts`, and only required facade/scan/run-validator integration; `src/server/persistence/run-repository/retrieval-transition.ts` and only necessary repository facade/contracts; `src/server/local-service/retrieval-operation.ts`, `contracts.ts`, `loopback-api.ts`, `src/server/service.ts`, and a focused `finding-guidance-view.ts` if citation projection does not fit the existing boundary. Extend the existing publisher and operation, without another writer, queue or generic update API. Preserve native-only scanner admission. Service coordinates pure policy and actual catalog resolution; HTTP handles fixed routing/JSON/status only, never corpus/model selection. Resolve canonical text for display without duplicating it into `run.json`.

Test envelope: `tests/retrieval-service.test.ts`, `run-contract.test.ts`, `run-repository.test.ts`, `local-service.test.ts`, and exact required M202 helper changes; new `tests/finding-guidance-api.test.ts` for its distinct HTTP contract. Each existing assertion change must reflect accepted new behavior, never weakened preservation. A test-only injected executor may supply controlled results; the production HTTP request cannot choose that executor. Test invalid/wrong IDs, zero/insufficient/conflicting guidance, evidence-only abstention, same-owner completion, terminal release, supported ownership, competing scan/retrieval, stale expected state, publication failure, shutdown/deadline, malformed HTTP/projection and absence of new external calls. Historical active records stay valid and non-resumable. C-B and strict checking prove the boundary. Separate test/Green owners; S3/fresh `critical_reviewer`. Accept `M203-B-*` before C.

### C — selected guidance and outcome UI

Outcome: explicit guidance activation uses B, updates only the matching displayed run/Finding after validated durable success, and presents citations and the deterministic outcome in the existing detail. The same risk-routed reviewer covers visual quality; no additional panel. `test_worker` then `frontend_code_worker`, profile **frontend-visual**, S3 for asynchronous identity/admission and the browser-to-service boundary.

Production envelope: `src/client/App.tsx`, `main.tsx`, `components/results/ResultsSection.tsx`, `ResultDetail.tsx`, `ResultCard.tsx`, `resultPresentation.ts`, `styles.css`; proposed `src/client/finding-guidance-admission.ts`, `components/results/FindingGuidance.tsx`, `GuidancePassages.tsx`, and `FindingOutcome.tsx`. Freeze the necessary subset; add a small current-operation hook only if coordination would otherwise mix a distinct responsibility, not merely to shorten App. App retains shared run/selection/reservation/announcement coordination; admission checks wire values and current identities; detail composes native evidence, guidance/citations and application outcome. Display code has no filesystem/model access and does not duplicate authoritative policy.

Test envelope: new `tests/finding-detail-ui.test.ts`, existing `tests/target-results-ui.test.ts`, `tests/helpers/m104-ui-harness.ts`, and one focused `tests/helpers/m203-guidance-harness.ts` only if the existing helper cannot supply the required controlled state/API. Test changes and harness creation stay with the test worker. C-C, affected existing UI checks, C-STRICT and build establish Green; actual-browser evidence below establishes visual behavior.

#### M203-UI-01 — bounded reuse and visual contract

The primary's source audit supplies these starting dispositions; accept the completed D5 capsule before C preflight. Governing anchors are the task's `REQ-A11Y-*`, `REQ-UX-011`, SPEC-002/003, the [selected-evidence contract](../ui/ANALYZE_AND_RESULTS_PRESENTATION.md#selected-evidence), and the [frontend-quality skill](../../.agents/skills/frontend-quality/SKILL.md).

| Responsibility | Disposition and placement |
| --- | --- |
| Native evidence and complete results panel | `REUSE_AS_IS`: `RuleEvidence.tsx`, `FindingsPanel.tsx`, `ResultsOverview.tsx`; preserve full grouped collections and panel scrolling. |
| Selected detail composition | `EXTEND`: `ResultDetail.tsx` and its `ResultsSection.tsx` parent pass current Finding/action/view props. Observations retain evidence-only presentation. |
| Operation coordination and announcements | `EXTEND`: App's existing reservation/current-run and shared live-status pattern; stable selection and late-response rejection. `main.tsx` adds only fixed same-origin transport wiring. |
| Retrieved passages/citations and source notices | `CREATE`: `GuidancePassages.tsx`, a cohesive readable list of at most three exact passages with their source metadata and accompanying notices. Native disclosures are permitted for complete notices. No Markdown interpreter or corpus browser. |
| Guidance activation/status and deterministic outcome | `CREATE`: `FindingGuidance.tsx` for action/status composition and `FindingOutcome.tsx` for sufficiency/abstention/failure explanation. No provider or proposal panel until its owning task. |
| Selected-response admission; bounded workflow label | `CREATE`: pure `finding-guidance-admission.ts`; `EXTEND` result presentation/card only as needed to keep sibling workflow states understandable without restoring raw scan metadata. |

State samples: unprocessed Finding, native scanner-review observation, retrieval running, supported/complete evidence, incomplete evidence, each completed insufficient support state, execution/integrity failure, and unsaved/cleanup-uncertain action failure. Use these as a compact semantic test set, not every state × browser × viewport combination. Supported means eligibility only. No Generate/review/retry action appears. Abstention shows its blockers, reason, no-provider-call confirmation and manual investigation with the applicable immutable run context where provider-relevant; ordinary scan-only Results retain their metadata omissions.

Browser samples: existing desktop layout at 1280×800, 320×800 reflow, and actual browser 200% zoom at desktop width. Use a long canonical passage/citation/notice sample to inspect wrapping. Keep all text inspectable without clipping. Selection leaves focus on its card; action completion/announcements do not steal focus; after citation inspection keyboard navigation can return predictably to the selected card without adding the prohibited Back-to-findings control. A single shared announcement pattern states selected item, start, outcome/failure and no-generation-call fact where relevant. Capture build/source identity, browser/version, viewport/zoom, controlled state, actions and result. Screenshots are optional supporting evidence, kept ignored and synthetic only.

Run one automated accessibility check over the new regions and one bounded keyboard/announcement path. Check an actual screen-reader path for the newly required abstention announcement when the available tooling/operator permits it; DOM inspection is not spoken-output proof. Record missing assistive-technology evidence honestly and complete unaffected work; obtain operator evidence if needed to discharge the task's announcement requirement. The complete proposal/review/comparison smoke remains M6-03. Preserve Evidence Light and current tokens; no new themes, fonts, icon kit, animation or dependencies.

## Concrete Steps

All commands run from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab` in PowerShell. Before any Node command, load exactly the first PowerShell block under [maintained developer preparation](../../README.md#development-command-preparation); it defines values/functions without effects. Do not execute the adjacent `npm ci` block. Current installed dependencies and retained browser/build may be reused after inspection; this task plans no acquisition or dependency restore.

### C0 — read-only execution entry

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'Git status failed' }
git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'HEAD inspection failed' }
git diff --cached --name-status
if ($LASTEXITCODE -ne 0) { throw 'Index inspection failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
```

Primary also records the symbolic ref/logical index, changed-path ownership, guard state, relevant source/test/config/authority fingerprints, all frozen fixture/corpus inputs and generated-output inventory in `M203-ENTRY-01`. Verify required Python only before guard use. Expected: known intentional tree, passed dependency/authorities, no unreconciled active lease. A plan commit is ordinary intentional movement: reconcile it and use the actual execution baseline for every lease/closure check. Never require the historical planning HEAD or an untracked plan.

### C1 — safe planning baseline / C-STRICT

After the maintained preparation, the exact safe check is:

```powershell
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Wrong Node runtime' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' }
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts tests/retrieval-contract.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Pure contract tests failed' }
}
```

Expected planning baseline: exit 0, strict check passes, 93 tests pass. The strict-only prefix inside the same wrapper is C-STRICT for future slices. Test counts may change during execution and never become a requirement to suppress new cases. These commands create no build, run, browser or model output; compilation caching is disabled and the prior environment restored by the maintained wrapper.

### Future command package — freeze before use

The following slots are deliberately not runnable permission. Primary records the exact complete caller, prerequisites, paths, expected outputs, native exit propagation, environment restoration, owned side effects and cleanup before the relevant preflight/lease. Syntax-check compound PowerShell plus read-only prerequisite checks; never let workers improvise binding commands after review.

| Slot | Required exact content and boundary |
| --- | --- |
| C-LEASE | Current guard `start`/`close` callers projected from each exact Packet v2; consume returned digest and structured status; require fresh `closed-compliant`. No worker manages the lease. |
| C-A | `Invoke-M105Command` around pinned Node `--test --test-timeout=120000 tests/finding-sufficiency.test.ts tests/retrieval-contract.test.ts`, followed by independent C-STRICT. Future file must exist after Red; no effects outside admitted test boundaries. |
| C-B | Same runner for `finding-sufficiency`, `finding-guidance-api`, `retrieval-service`, `run-contract`, `run-repository`, `local-service`; freeze exact existing helper/run-root and per-file sequence, then C-STRICT. No live model calls. |
| C-C / C-BUILD | Exact new detail-UI/affected old UI commands with the retained managed browser and existing UI scratch preparation; `vite build --configLoader native` only after handling current `dist/client`. Preserve or explicitly replace the inventoried generated build; never delete an uninspected output. C-STRICT remains independent. |
| C-BROWSER | One controlled application/API/browser path plus the visual/keyboard/announcement samples. Prefer existing M104/M105 helpers and actual service/publication; pin any required test-owned adapter seam and generated root before its test lease. Test doubles are labeled and confined to tests. |
| C-REAL | One bounded actual UI-to-HTTP-to-default-retrieval-to-disk proof using a project-owned controlled Finding and current approved M2-02 runtime/configuration. Reuse its passed capacity gate; check present prerequisites before the call. Freeze invocation count, input, launch/stop, source/build identities, outputs and result criteria. No new model acquisition, capacity benchmark, live public target or generation call. The full three-gold evaluation remains M2-04. |
| C-FULL | The current [complete suite](../../README.md#build-and-verify-the-walking-skeleton), plus all new task tests, sequentially with their exact scratch requirements, strict TypeScript and client build. Audit the final list against all authoritative test files; run once at task closure unless changed evidence/risk justifies another run. |
| C-CLEAN | Exact owned files/directories/processes from command inventories, normal stop first, absolute containment/topology/ownership checks, then only permitted cleanup. Retain pre-existing M2-02 evidence, developer runtime/model/tokenizer trees, dependency backups, build and shared scratch unless explicitly dispositioned. No broad root deletion. |

## Validation and Acceptance

A slice advances only after primary acceptance of its preflight route, complete test boundary, observed Red/characterization, unchanged-test Green, independent strict check, relevant test/fixture/helper audit, actual cohesion and terminal lease, and its fresh risk-routed review. Record `M203-A-*`, `B-*`, `C-*` with exact commands/cwd/relevant-tree/environment identity and any evidence invalidation. Reuse evidence only under the workflow's complete identity rule; mutable browser/model/filesystem results need an isolated pinned run identity or are non-reusable. A handoff alone does not require a duplicate full suite.

Task acceptance requires I1–I8 and every M2-03 Verification clause. Available evidence and exact citation metadata remain inspectable; errors take precedence over support; only complete evidence plus supported guidance yields eligibility; abstention is terminal, application-authored, referential, explanatory and contains no remediation/invocation/review. Invalid or unsaved data cannot appear durable. Evidence reads/selection do not trigger inference. Source notices accompany displayed portions. Actual UI integration uses the real default retrieval path at least once; deterministic adverse packages supplement it without being presented as real ranking outcomes or a completed M2-04 evaluation.

After A–C, run C-FULL and the bounded browser evidence, inspect the complete diff, then obtain a different fresh final `critical_reviewer` for cross-slice identity, lifecycle, persistence and UI admission, including actual visual evidence. It reuses fresh ordinary evidence and reproduces risk-critical checks proportionally. A planning-readiness PASS does not satisfy any implementation barrier.

At closure, compare changed paths and behavior to the authority map. Update the current developer/API instructions and public capability summary, materially affected lifecycle summary, UI guidance if its maintained responsibility changed, the roadmap and progress record, and indexes. Preserve accepted requirement/ADR semantics and historical M2-02 evidence; no new ADR is presumed. Repair inbound links when archiving this same plan only after M2-03 Verification and the documentation gate pass. Leave M2-04 and later tasks Not started. Run local link/fragment, UTF-8/newline/whitespace, authority/status, command-syntax and `git diff --check` checks. No commit/push is authorized.

## Idempotence and Recovery

Read-only inspection and pure checks may repeat safely when needed. Runtime writes and model calls are not idempotent replay instructions. Resume at the last accepted barrier using Current state and exact current contract; historical commands or another task's consumed grants cannot supply permission.

On worker stop, primary closes/inspects the exact lease and triages scope, environment, contract and remaining allowance. Preserve peer/user changes. Never reset/stash/checkout the tree, rewrite guard state, redefine a live lease, or run two writers. A corrected test invalidates its prior evidence before Green resumes. Plan/status writes occur only between leases.

An invalid catalog/citation yields the reviewed failure; do not rewrite the corpus or fetch live sources. A failed nested write preserves last valid bytes and the completed parent. Historical active data is readable but not resumed; an ordinary new Analyze remains the accepted independent-run path. Shutdown forbids late success/owner release. Uncertain cleanup remains visible and prevents unsafe new work under the existing service contract. New task proof uses exclusive owned run/scratch identities and normal service stop; it never modifies or deletes the retained M2-02 capacity run/evidence or the developer's runtime/model stores.

## Artifacts and Notes

Primary owns this plan, the roadmap activation, plan/progress indexes and the task progress record. Planning makes no source, test, package, fixture, corpus, evaluation or workflow-tool change. Keep only decisive evidence IDs/results and necessary command contracts here; no packet schema copies, transcript archive, generated ledger or separate design/decision report.

### M203-PLAN-REVIEW-01 — accepted planning readiness

On 2026-09-08, a fresh read-only `critical_reviewer` reviewed the complete 254-line plan and exact five-file activation surface against the controlling authorities, current implementation, UI overlay and workflow. Trigger: S3 citation/record integrity, selected-Finding ownership/recovery and browser response identity. Verdict: **PASS for planning readiness**, with no Blocker, Major or Minor findings. The primary accepts this result; no contract correction was needed.

Reviewed plan SHA-256: `E0666B87BDE77B1E8163925874771BE49F877E1949A7DD7645B25A2DF178B1FD`. This identifies the pre-closure review artifact, not a future executable hash constraint; subsequent edits record this accepted checkpoint without changing its binding contract. The reviewer independently confirmed the planning HEAD, empty index, absent active lease, four frozen-input hashes, and three corpus profiles/zero declared conflicts/sixteen passages. It reused the fresh strict/93-test evidence and primary documentation/preservation checks without running application, browser, model, build or tests.

Primary closure checks cover all five planning files: local links/fragments, PowerShell syntax, UTF-8, final newline, trailing whitespace, `git diff --check`, and preservation of every tracked path outside the three intended existing Markdown edits. Documentation impact is limited to this plan, its progress record, roadmap activation and two indexes. Execution literals D1–D5, exact future callers, current model prerequisites, durable adverse paths, rendered accessibility and spoken announcements remain unproved execution work; this PASS does not replace their barriers.

## Interfaces and Dependencies

Reuse `LocalService.retrieveFinding`, the selected operation, `RunRepository.updateRetrieval`, `validateRun`, fixed corpus loader/reference validation, `RetrievalResult`, and App's current run/selection/announcement boundaries. M2-03 adds the narrow policy result, strict nested abstention/support validation, citation view and fixed browser action. D1–D5 settle exact signatures and relationship validation before workers implement them; the plan's proposed filenames do not fix unnecessary private helpers.

Existing pinned Node/npm, TypeScript, React, Vite, Node test runner, Playwright/axe, LangChain and approved Ollama/EmbeddingGemma remain sufficient. Do not add a package or modify the finite embedding contract merely for UI display or policy testing. Application source dependencies remain service → pure policy/repository/retrieval, browser → pure admission/types/application HTTP; no client → privileged runtime or policy → transport edge.

## Revision note

2026-09-08: Created the M2-03 planning contract after reviewing completed M2-02 and current source. Reserved execution-stage literals, three guarded TDD slices, the visual reuse/verification contract, and proportional closure. Recorded independent planning-readiness PASS and primary documentation closure without changing the reviewed contract. Historical Git identities remain provenance; current entry and lease baselines are captured at execution.
