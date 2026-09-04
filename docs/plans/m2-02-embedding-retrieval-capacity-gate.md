# Implement and capacity-screen M2-02 local embedding retrieval

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Purpose / Big Picture

Implement only [M2-02](../DEVELOPMENT_ROADMAP.md#m2-02--implement-and-capacity-screen-lazy-local-exact-vector-retrieval): one selected Finding produces a privacy-safe local query, genuinely ranked guidance from the frozen corpus, and durable retrieval provenance, or a bounded failure that preserves the completed scan. Prove the fixed EmbeddingGemma configuration can perform this retrieval on the reference PC while the application and its browser UI are active. This is an enabling retrieval/capacity task, not completion of M2's support-state, abstention, or visible guidance workflow.

**Authorization:** The owner's 2026-09-03 request selects M2-02 for current-state review and ExecPlan creation only. Planning is authorized; implementation, dependency changes, runtime/model acquisition, model calls, and the capacity smoke await an explicit M2-02 execution grant and the gates below. No other task, commit, publication, or push is authorized. Roadmap status is **In progress**, not Complete.

## Progress

- [x] (2026-09-04 00:24Z) Reviewed clean planning HEAD `56a1c97e59311be604b6e96b8e4ee06643f0741c`, global roadmap state, M1 integration, M2-01 closure, delivered corpus/gold, applicable authorities, and current service/domain/storage boundaries.
- [x] (2026-09-04 00:24Z) Confirmed pinned Node 24.20.0, independent strict TypeScript, and 78 passing pure contract/normalization tests; no skipped or failed tests. No browser or model evaluation was run.
- [x] (2026-09-04 00:24Z) Received one read-only R1 report, `M202-PLAN-EMBED-01`, on published facts for the already selected model/runtime. Recorded evidence and unresolved literals below; no model or package was selected or acquired.
- [x] (2026-09-04 00:43Z) Accepted fresh critical plan-readiness review `M202-PLAN-REVIEW-01`: PASS, no findings. Nine-document validation, 603 local links/131 fragments, three PowerShell parses, actual C2 preservation check and all 85 protected inputs pass; see the planning closure record below.
- [ ] Obtain exact-task execution authorization; reconcile the then-current intentional tree and capture execution evidence identities.
- [ ] Complete the execution-stage literal contract, R3 research/synthesis/checkpoints, metadata prefilter, and exact-command freeze.
- [ ] Complete guarded dependency setup and its structural review.
- [ ] Complete slice A: canonical catalog and privacy-safe retrieval contracts through independently owned tests and implementation.
- [ ] Complete slice B: actual loopback embedding and lazy exact-vector retrieval through independently owned tests and implementation.
- [ ] Complete slice C: selected-Finding service integration and durable provenance through independently owned tests and implementation.
- [ ] Complete developer-managed runtime/model setup and exact evaluated-configuration capture, then one real retrieval-specific capacity smoke.
- [ ] Complete task-level regression, test/cohesion audit, different fresh integrated critical review, exact cleanup, and documentation closure before changing task status or archiving this plan.

## Surprises & Discoveries

- M2-01 is now Complete, not merely planned. `corpus/wcag22-mvp-v1/manifest.json` and `passages.json` contain eight sources and 16 passages; `evaluation/m201-corpus-v1.json` contains three gold mappings. The [final freeze](completed/m2-01-closed-corpus-snapshot.md#m201-closure-01--final-freeze-and-documentation-impact) records static checks, reviews and source-capture cleanup. Gold facts are expected subsets, not complete runtime Findings.
- Current `readFinding` accepts only `state: 'unprocessed'`; `checkTransition` rejects every already-terminal run. See `src/server/domain/run-contract/finding-validation.ts` and `src/server/persistence/run-repository/run-transition.ts`. Adding retrieval cannot be implemented by accepting arbitrary terminal rewrites or overwriting the immutable scan.
- Current service admission and shutdown are scan-shaped in `src/server/service.ts`. Retrieval must share their one-operation reservation and late-publication prohibition, not introduce an independent busy flag, queue, or background workflow.
- The fixed catalog leaves genuine ranking choice: five image passages, five label passages, and six contrast passages. Gold IDs and guidance roles must not become retrieval filters. Equal scores spanning the third-result cutoff need deterministic ordering before truncating to three.
- Published Ollama `/api/embed` defaults to truncation and does not document a digest in its response. `/api/tags` supplies the local full digest. A tag or returned model name alone is insufficient vector identity; the exact policy remains a pre-implementation decision, not a claim that planning proved runtime identity.

## Decision Log

- Decision: Keep this request planning-only and preserve every completed task's evidence. Rationale: requesting an ExecPlan is not a runtime or implementation grant. Date/Author: 2026-09-03 / primary.
- Decision: Use one R1 fact report now; perform the triggered R3 literal work only during authorized execution. Rationale: published facts can identify gates without selecting custom corpus, identity, or aggregate semantics prematurely. Date/Author: 2026-09-03 / primary.
- Decision: Use three coherent behavioral slices plus declarative setup and a manual capacity screen. Rationale: catalog/query policy, model/vector I/O, and durable service integration have distinct current responsibilities; assertion-sized cycles and speculative layers are unnecessary. Date/Author: 2026-09-03 / primary.
- Decision: Keep rendered UI, support classification, abstention and gold retrieval-quality evaluation with M2-03/M2-04. Rationale: M2-02 supplies their real retrieval/provenance boundary and prerequisite capacity evidence. A temporary retrieval UI or fake supported result would cross that boundary. Date/Author: 2026-09-03 / primary.
- Decision: Record planning HEAD as history; capture and review the intentional execution HEAD instead of requiring a particular parent commit or a dirty plan. Rationale: committing the plan must not invalidate its own entry or lease checks. Date/Author: 2026-09-03 / primary.
- Decision: Accept planning readiness only after the independent critical review and primary documentation checks. Rationale: no findings remain, but unresolved literals and runtime evidence still block worker execution. Date/Author: 2026-09-04 UTC / primary.

## Outcomes & Retrospective

Planning is complete after independent critical readiness PASS with no findings and primary documentation validation. Nine roadmap tasks are Complete; M2-02 remains In progress for planning and eighteen others remain Not started. M1's 335-test integration result and public-page smoke are historical. Primary and reviewer each freshly ran only strict TypeScript and the 78 pure tests. No retrieval, capacity, full-suite, or provider outcome is inferred from them. Next: explicit execution authorization, fresh endpoint reconciliation and the recorded literal/command gates; no worker or model work has begun.

## Context and Orientation

Start with [documentation routing](../README.md), [requirements status](../PROJECT_REQUIREMENTS.md), the [roadmap](../DEVELOPMENT_ROADMAP.md), [PLANS.md](../../PLANS.md), and the [agent workflow](../../.codex/README.md). The [implementation guide](../../.codex/execplan-implementation-workflow.md), [lease guard](../../.codex/write-lease-guard.md), and [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) control future worker turns. Read the complete selected authority sections, not every requirements module by default.

### Readiness and authority map

| Boundary | Controlling authority and entry disposition |
| --- | --- |
| Task/dependency | M2-02 depends on completed M2-01. Its frozen eight-source catalog, three gold cases and completed M1 Finding contract exist. M2-03 and M2-04 depend on this task's passed capacity gate and remain unselected. |
| Retrieval | [Corpus and retrieval](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval): Accepted `REQ-RETR-001`, `002`, `005`, `006`; preserve `REQ-CORP-001`, `003`–`007` and `REQ-EVID-003`. [ADR-0019](../architecture/decisions/ADR-0019-in-process-exact-vector-search.md) fixes lazy in-process exact cosine, broad rule/SC filtering and k=3. [ADR-0013](../architecture/decisions/ADR-0013-langchain-as-initial-rag-integration.md) bounds LangChain; [ADR-0010](../architecture/decisions/ADR-0010-defer-a-local-reranker.md) excludes reranking. |
| Corpus identity | [ADR-0022](../architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md), M2-01 artifacts and [accompanying notices](../../README.md#closed-corpus-notices). Preserve canonical IDs, text, headings, roles, mappings, source versions and notices. English is a fixed catalog precondition; the delivered JSON has no `language` field to assume or silently add. |
| Local setup and privacy | Accepted `REQ-INST-003`, `006`, `017` in [installation/lifecycle](../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md), `REQ-SEC-004`, `017`, `027` in [privacy/security](../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md), [ADR-0020](../architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md), and [ADR-0023](../architecture/decisions/ADR-0023-local-mode-data-boundary.md). Setup is developer-managed; application-owned embedding text goes only to approved loopback, in either run mode. |
| Fixed model and capacity | [ADR-0004](../architecture/decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), [ADR-0005](../architecture/decisions/ADR-0005-ollama-as-initial-local-model-runtime.md), [ADR-0006](../architecture/decisions/ADR-0006-embeddinggemma-as-initial-embedding-model.md), Accepted `REQ-QUAL-009` in [reliability](../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md), and [reference-PC feasibility](../LOCAL_MVP_FEASIBILITY.md). Acceptance is evaluation-only, not current fit or release qualification. |
| Durable selected-Finding update | [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md), [information/lifecycle](../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), `REQ-EVID-003`, `REQ-RETR-005`, and existing M1 service/storage contracts. Failed downstream publication preserves the last valid completed aggregate; it never fails the parent scan. |
| Evaluation and staged UI | [Freeze boundary](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), [SPEC-002](../specs/SPEC.feature), M2-03 and M2-04. M2-02 proves the retrieval foundation, not the complete SPEC-002 presentation/support scenario. M3-03 separately owns Qwen/full-local-stack capacity. |

No Proposed Must requirement or significant undecided architecture selection blocks planning. Ordinary implementation literals below remain open because M2-02 owns them. They must be resolved before their dependent work, not invented by a worker. A discovery that contradicts an Accepted authority stops for owner direction or the ADR process.

### Current implementation and preserved inputs

`package.json`/`package-lock.json` pin Node 24.20.0/npm 11.19.0, TypeScript 7.0.2, Vite 8.0.16, React 19.2.8, Playwright 1.62.1 and axe integration 4.13.0. No LangChain, embedding adapter or Ollama client dependency exists. Native erasable TypeScript plus `node:test` remain the server/test route; no new testing platform is needed.

`src/server/domain/run-contract.ts` is the public domain facade; focused validators live in its sibling directory. `src/server/persistence/run-repository.ts` owns validated reads and exclusive same-directory staged publication. Its current `finish` handles only scan termination. `src/server/service.ts` coordinates admission, reads, scan work and stop; `src/server/local-service/` owns boundary parsing and record preparation. `src/server/scan/` and `src/client/` are already implemented, with seven authoritative test files. Reuse these boundaries rather than copying their policies.

The planning tree is clean at `56a1c97e59311be604b6e96b8e4ee06643f0741c`. `git diff 12b05f6 HEAD -- src tests package.json package-lock.json tsconfig.json fixtures evaluation/rd003-scan-v1.json` is empty: M2-01 added static corpus evidence, not an application change. Preserve all six RD-003 fixture bytes, its manifest, the three M2-01 artifacts, source notices, unrelated changes and existing data/model stores.

| Frozen input | Planning SHA-256 |
| --- | --- |
| `corpus/wcag22-mvp-v1/manifest.json` | `87D8867ED1138BFB38E6C44EED67A79B0A43BDAF2532A056AFAFAED828202DA9` |
| `corpus/wcag22-mvp-v1/passages.json` | `29EA0033E825A0FA20430AA42E9718B87A87AA59EDADDA0A3876A0A7BE871850` |
| `evaluation/m201-corpus-v1.json` | `A7D38CACF98BF263CDD53012350708BE987699DF21B4C0F1BB7F32BC1892E29B` |

These are current checkout-byte preservation fingerprints, not historical Git-blob hashes or an already-selected production integrity algorithm. The independent reviewer verified the current CRLF representations and historical frozen Git blobs parse to identical JSON. The model is not installed or absent merely because application integration is absent: installed Ollama/model state was deliberately not probed during planning.

## Scope and Non-Goals

Include the metadata prefilter; minimum pinned retrieval dependencies; fixed corpus loading/validation; privacy-safe query projection; separate local embedding adapter; lazy disposable vectors; compatibility/integrity rejection; exact ranking and result validation; minimal nested provenance and service integration; bounded errors; and one manual reference-PC retrieval smoke.

Do not add a corpus/version management subsystem, alter the frozen corpus to improve scores, split or truncate a passage, use gold IDs/roles/source types as ranking filters, tune against observed gold outcomes, add a reranker, vector database, persistent vectors, hosted embeddings, generic provider registry, LLM query rewriting, framework agents, tracing, telemetry, or benchmarking. No generation, Qwen acquisition, Groq credentials/calls, proposal, review, comparison, UI redesign, settings, model manager, startup probe, retry/resume, or release claim enters this task.

The M2-02 callable returns canonical ranked references/metadata for internal inspection. M2-03 supplies visible retrieval controls, citation presentation, support meanings and abstention. Before coding, resolve the narrow persistence/lifecycle handoff described in L5; do not invent a new terminal Finding state, record fake support, or implement later-task policy to avoid that decision. If the accepted lifecycle cannot accommodate the proposed M2-02-only handoff, stop and reconcile the authority/task boundary with the owner.

## Decision Review Contract

### M202-LITERALS-01 — execution-stage contract, not yet selected

**Tier: R3** for corpus/model identity, local text egress, vector compatibility, selected-Finding mutation, one-operation ownership and recovery. Current status: **not frozen; no comparative research or implementation authorized by this planning request**. This section records the stable scope and discovery boundary before any such work. The one planning R1 report is factual input, not R3 synthesis or an accepted literal contract.

Target artifact: the primary-authored literal/evaluation contract inside this plan, followed by only the materially affected developer instructions. Existing ADRs already choose EmbeddingGemma/Ollama and LangChain MemoryVectorStore: do not compare model families, vector databases, providers, architectures or future frameworks. Within that boundary, one bounded non-ranking discovery may identify the current package/API path and smallest corpus/model-identity and aggregate-update mechanisms. Freeze the exact viable mechanism set, evidence dimensions, hard gates and complete invariant packet before comparative research; record rejected mechanisms and decisive reasons without inventing alternatives to fill a matrix.

Common criteria: Accepted behavior; no premature later-task semantics; privacy and identity correctness; evidence preservation; reproducible exact configuration; deterministic ranking; compatibility with current Node/TypeScript; smallest complete cohesive implementation; and bounded failure/cleanup. A hard-gate failure cannot be outweighed by convenience or smaller code. No arbitrary numeric ranking score or performance target is required.

### Required literal outputs and barriers

| ID | Decide and record before the dependent action |
| --- | --- |
| L1 — dependencies and commands | Exact material package pins/imports, Node support, dependency-only bootstrap and locked restore commands, permitted manifest/lock mutations, ignored dependency/cache/build outputs, safe existing-output handling, and cleanup. Choose only what actual MemoryVectorStore and the separate adapter require; no generation SDK in advance. Freeze before setup lease. |
| L2 — corpus and query | Exact fixed-file loading/validation and English precondition; identity comparison and same-version mismatch rule; canonical-to-document mapping; one query template/version; rule-to-SC mapping; allowlisted fact categories and unavailable-fact handling. Freeze exact field values/representations and failure meaning before slice A. No page URL, locator, raw text, image source, form value, arbitrary attribute, sibling or review history can enter the query. |
| L3 — model boundary and input fit | Approved literal loopback endpoint and redirect policy; attempt-time presence/full-digest resolution; prevention/detection of alias drift between corpus/query work; adapter identity; exactly-once document/query formatting; derived effective input limit and defensible token accounting; configured truncation rejection; dimensions, finite/nonzero vectors, cardinality and model-response validation; bounded request/abort/error rules. Freeze policies before A/B tests. Runtime-observed values may be captured after developer setup, but cannot supply missing decision semantics. |
| L4 — cache and ranking | Compatibility tuple covering corpus identity/validated IDs/text, model full digest/dimensions, preprocessing, segmentation and normalization; atomic publication of a fully built in-process collection; discard on failed build; no stale reuse; exact cosine and broad rule/SC filter; passage-ID comparator and tie handling before k=3 cutoff; result reference/score validation. Freeze before A/B tests. No persistent cache/index ID or generalized invalidation service. |
| L5 — selected-Finding persistence | Exact internal service callable/input/result, minimum nested provenance fields and validation, format-version disposition, allowed success/error/unfinished-stage representation at the M2-02/M2-03 boundary, and unchanged-read/no-resume behavior. Define allowed transitions and which fields may change; distinguish completed scan evidence from selected workflow data even though Findings are currently nested under `scan`. Define stale/duplicate request, busy, failed write, shutdown/late result and cleanup-uncertainty handling. Reuse the existing safe publisher and service reservation. Freeze before slice C and before accepting A/B interfaces it depends on. No generic terminal rewrite or fabricated support/abstention. |
| L6 — metadata prefilter | Fresh published artifact/storage metadata, estimated runtime/context/vector working set with assumptions, actual reference-PC RAM/VRAM/free storage and a documented safety margin, runtime support, license/access conditions, and pass/fail rationale. The dated 513 GB free-space note is not a current measurement. Freeze and pass before acquisition or project use of an already installed model. Oversize/unknown fit does not authorize a download. |
| L7 — evaluated configuration and smoke | Configured tag plus resolved full digest; exact runtime/version and available integrity/license metadata; quantization; declared context and effective input limit; dimensions; formatting/preprocessing/segmentation/normalization; configured context and GPU-offload value or evidenced default/automatic/not-exposed disposition. Freeze the single synthetic selected-Finding input, observable pass/fail criteria, exact driver/call command, app/UI-active procedure, resource observations, all generated paths/process ownership and cleanup before the first real retrieval. The full three-case gold-quality evaluation remains M2-04. |

Decide now during execution-stage synthesis: every policy, wire/input/output contract, state transition, validation meaning, rank/tie operation and failure behavior in L1–L5, the prefilter method in L6, and the smoke procedure in L7. Prove later: installed full digest and runtime details, actual response conformity, every frozen passage/query fitting the derived limit, actual resource/UI observations and durable retrieval. The latter do not authorize a worker to change the former. If actual runtime facts invalidate the reviewed policy, stop and reopen the contract before more calls or writes.

Research route after an execution grant: use `Research Assignment Capsule v1`; at most two `critical_researcher` reports, one for corpus/query/model identity and local I/O, one for aggregate/service transition and recovery. One `technology_researcher` is permitted only for an unresolved package/runtime API evidence dimension not already covered by `M202-PLAN-EMBED-01`; reuse fresh official facts. Each gets one bounded follow-up. Synchronize once; mandatory `decision_analyst` returns `DRAFT READY`, `RETURN FOR RESEARCH`, or `OWNER DIRECTION`. Use a fresh `critical_research_reviewer` for the pre-draft contract checkpoint, then primary writes the sole literal contract, then a different fresh `critical_research_reviewer` reviews that complete artifact. No drafter is necessary. Ordinary literals do not require a new ADR; a significant change to Accepted architecture or lifecycle scope requires its owning decision/owner approval before proceeding.

One supported pre-draft correction is allowed. Apply the workflow's two-cycle final decision-artifact correction ceiling; every R3 revision reruns the entire applicable invariant packet. Stop on the same decisive gap twice, two synthesis returns without materially new evidence, exhausted budget, changed scope/contract, or owner-controlled choice. Do not restart budgets by renaming a packet or spawning another researcher. This plan's readiness review is not either future literal checkpoint.

### Cumulative invariant packet

Actual evidence for all execution invariants is **pending**. Researchers supply mechanism-level failure analysis; the analyst audits completeness; both research reviewers examine the full packet; the named implementation reviewer later verifies actual behavior.

| ID | Trigger / fixture | Expected result | Execution reviewer |
| --- | --- | --- | --- |
| I1 | Any selected literal/revision | L1–L7 complete at their proper barriers; facts, proposals and observations distinguishable; no silent authority/status or next-task change. | Both R3 research reviewers; final critical reviewer |
| I2 | Corrupt/duplicate/missing ID, altered text under same version, stale corpus reference, incompatible version | Visible integrity failure; no usable replacement snapshot, partial vector publication, old-vector reuse, or canonical rewrite. An authorized new version requires a new reviewed input, not automatic refresh. | Slice A/B critical reviewer |
| I3 | Unknown/ambiguous rule mapping, unavailable evidence, synthetic URL/selector/page/sibling canaries | Mapping failure before embedding when invalid; allowlisted query only for a valid selected Finding; no invented measured fact or evidence-completeness conclusion. | Slice A critical reviewer |
| I4 | Startup, mode selection, scan; then first/later explicit retrieval | No model check, embedding or MemoryVectorStore construction at startup/selection/scan. First actual retrieval builds once; compatible later requests only embed their query; restart/material incompatibility requires a fresh build. | Slice B critical reviewer |
| I5 | Tag/digest drift, wrong returned model/count/dimension, zero/non-finite vector, oversize input, redirect/off-loopback target | Reject without truncation, retry, fallback, hosted call, mixed vectors or success provenance; bounded content-safe error. Exact policy must establish what digest the vector evidence represents. | Slice B critical reviewer |
| I6 | More than three eligible passages and equal scores spanning rank three; shuffled insertion order | Only exact rule/SC filtering, exact cosine, deterministic passage-ID tie ordering before cutoff, at most three canonical references; role/gold/source authority does not affect order. | Slice A/B critical reviewer |
| I7 | Two selected Findings, simultaneous scan/read/retrieval, duplicate action | One reservation before asynchronous work; no second user operation or queued attempt; only the intended Finding can change, with completed scan/provider context and siblings preserved. | Slice C critical reviewer |
| I8 | Failed nested write, shutdown/deadline, late embedding response, uncertain cleanup, restart after interrupted action | Last valid aggregate remains authoritative; parent stays completed; no unsaved durable success, automatic resume, new retry lineage or late publication; affected action fails within reviewed semantics. | Slice C critical reviewer |
| I9 | Real smoke versus test doubles/published metadata | All 16 canonical passages plus the frozen one-Finding query use real local embeddings and the production exact-search/service/publication path; app/UI active, no OOM/storage exhaustion/unusable UI; no quality or support claim. | Final critical reviewer |

## Plan of Work

### Common execution contract

After owner authorization, primary reconciles HEAD, index, dirty paths, protected-file fingerprints, runtime/tool pins, relevant ignored output inventories and any active lease before advancing. Read-only discovery may proceed with unresolved literals; worker preflight/writes cannot pass the literal/command barriers. Each application slice's packet names its exact callables, expected result, accepted test boundary, responsibility/dependency/refactor contract, commands, side effects and stop conditions. The path envelopes below are planned placements, not blanket leases; freeze exact files before preflight and project them unchanged into each write lease.

For each behavioral slice, keep a separate `test_worker` and `code_worker`. Preflight is read-only with no lease. Accept `EXISTING_AND_COVERED` evidence without writing, characterize `EXISTING_BUT_UNCOVERED`, isolate a confirmed `PARTIAL` gap, use Red for `MISSING`/`REGRESSION`, and stop on `UNKNOWN`/`CONFLICTING`. A genuinely absent agreed callable may use only ADR-0024's first-module Red exception: verified environment and complete behavioral tests, precise missing-callable failure, no stub, and an honest record that assertions did not execute. Green executes all accepted tests unchanged and passes independent strict TypeScript.

Every write turn gets a fresh complete Packet v2 and primary-opened/closed guard lease; require a fresh `closed-compliant` receipt, inspect the real diff and results, and forbid accepted tests during Green. Workers never change Git state or primary-owned documentation. Primary writes this plan, literal/evaluation notes, developer instructions and status only between leases. Ignored runtime/cache outputs are not covered by the guard and need explicit effects/inventories/cleanup checks, never ignored `--allow-file` scopes.

Per behavioral slice: one preflight, one coherent Red/characterization, one Green with optional same-turn behavior-preserving Refactor, at most one same-contract correction per role (attempt 2 naming its terminal parent), and one review correction loop. Stop after the same decisive failure twice, two no-diff write handoffs, exhausted budget or changed binding field. Every post-Green handoff records actual cohesion as `RETAINED`, `REFACTORED`, or `RECONCILE`; setup/pre-Green uses `None`. Material mixed responsibility must be fixed or reconciled before acceptance, not deferred because tests pass. No optional review panel or full-suite rerun per assertion.

### Setup — minimum retrieval dependencies

Once L1–L6 and required research checkpoints pass, one `code_worker` setup lease may change only `package.json` and `package-lock.json` to add the exact reviewed retrieval dependencies. TDD: **Not applicable**, because manifest/lock setup adds no production behavior. Production responsibility: **None — no application-source responsibility changes**. Validate exact pins, import surfaces, script-suppressed restore, unchanged unrelated dependency pins, strict typecheck, and expected generated-output inventory. Freeze both initial lock-generation and later clean-restore commands before this lease; do not improvise an upgrade after a failing install. A fresh S0 `milestone_reviewer` checks the setup and decisive structural evidence. Primary updates developer instructions afterward. No model pull is a package lifecycle script.

### Slice A — canonical catalog and selected-Finding query/result contract

One cohesive outcome: fixed catalog input plus one validated Finding yields a canonical passage view and privacy-safe retrieval request, with bounded integrity/mapping failures and an application-owned ranked-result shape. Preflight inspects M2-01 data, current domain validators and any already-created retrieval source/tests. Authority: L2–L5; `REQ-CORP-001`, `003`, `005`–`007`; `REQ-RETR-001`, `005`, `006`; ADR-0013/0019/0022. Risk **S3**: corpus identity and data minimization.

Planned production placements under `src/server/retrieval/`: `corpus-catalog.ts` for fixed snapshot loading/validation; `finding-query.ts` for mapping and allowlisted semantic projection; `retrieval-contract.ts` for only the current retrieval types/result validator. Separate catalog I/O from query policy; do not add a generic loader or schema platform. Dependency direction: retrieval contracts/query consume the domain's current Finding type and fixed corpus; domain types never depend on Ollama, LangChain or service I/O. L5 must settle any shared shape first; this slice does not enable terminal aggregate mutation.

Test ownership: planned `tests/retrieval-contract.test.ts`, with a task-specific test helper only if current fixture construction warrants it. Production workers may locally extract one cohesive validator within the frozen retrieval path list if that exact permission is recorded before the lease; no generic `utils` or unrelated domain refactor. Other source, corpus, gold, dependencies, fixtures and documentation are forbidden. Focused command C-A and strict check must prove I2/I3/I6's contract portions, detachment, permitted source metadata, and failure without altering input. Primary accepts evidence `M202-A-*`; fresh S3 review must pass before B.

### Slice B — actual local embeddings and lazy exact-vector execution

One cohesive outcome: an explicit retrieval request obtains real-compatible local vectors and at most three deterministically ranked canonical passages; failures publish no partial collection. Preflight inspects the accepted A callable/tests, actual selected package API and L3/L4. Authority: `REQ-RETR-006`, `REQ-INST-006`, `017`, `REQ-SEC-004`, `017`, ADR-0005/0006/0013/0019/0020/0023. Risk **S3**: model identity, loopback privacy, vector compatibility and asynchronous failure.

Planned production placements: `src/server/retrieval/ollama-embedding.ts` owns only approved local transport, attempt-time prerequisites/identity, formatting, input-fit and actual response validation; `src/server/retrieval/exact-retrieval.ts` owns lazy compatible collection construction, broad filtering, exact ranking and canonical result resolution. Reuse A contracts; import LangChain only in the retrieval implementation. The corpus loader never acquires a source, and the adapter never acquires a model. No independent Ollama client/provider registry or vector-store service is needed.

Test ownership: planned `tests/embedding-retrieval.test.ts` and exact named local test helpers. Fake transport/vectors are permitted only inside deterministic boundary tests; include insertion-order-independent ties, compatible repeat calls, restart/incompatibility, incomplete build, model absence/drift, malformed actual responses, no truncation/redirect/retry, and signal/late-result cases. C-B plus C-A and strict checking prove I2–I6. An explicit real smoke remains mandatory; mocks cannot establish capacity or real compatibility. No test can rewrite canonical corpus/gold. Primary accepts `M202-B-*`; fresh S3 review must pass before C.

### Slice C — one selected-Finding operation and durable provenance

One cohesive outcome: the application-owned service invokes B only for an explicit valid selected Finding and durably records only its authorized nested retrieval data. Preflight inspects the current scan-only transition tests, immutable scanner validators, service reservation/shutdown and safe publisher. Authority: L5, `REQ-EVID-003`, `REQ-RETR-005`/`006`, ADR-0021, and the accepted information/lifecycle model. Risk **S3**: aggregate integrity, ownership, failed write and shutdown.

Planned production envelope: `src/server/service.ts`, `src/server/local-service/contracts.ts`, one focused `src/server/local-service/retrieval-operation.ts`; `src/server/persistence/run-repository.ts`, its `contracts.ts`, and a focused `retrieval-transition.ts`; the domain facade plus only the exact `run-types.ts`, `finding-validation.ts`, `scan-validation.ts`, `run-validation.ts` changes and one focused retrieval-field validator required by L5. Freeze the exact subset before preflight. Do not place model I/O or substantive retrieval policy in `service.ts`; it remains coordination. Reuse existing staged publication and ordinary-path checks. Do not reimplement filesystem safety or relax initial scan validation to admit workflow-bearing scanner output.

Dependency direction: service operation reads a validated completed aggregate, selects one Finding, invokes B, constructs the reviewed update and requests the existing repository publisher. Domain validation and selected-update policy remain independent of filesystem/runtime/framework objects. A narrow extraction of the present operation reservation is allowed only if L5 establishes it is needed by both scan and retrieval; no generic scheduler. No rendered UI or new browser-facing route is presumed; L5 freezes the minimum service callable used by the controlled smoke, with M2-03 owning later UI integration.

Test ownership: planned `tests/retrieval-service.test.ts`; exact needed changes to `tests/run-contract.test.ts`, `tests/run-repository.test.ts`, `tests/local-service.test.ts` and `tests/helpers/m102-run-fixture.ts`. Each named existing test change needs an explicit reason tied to the newly accepted nested update, not weakening old guarantees. C-C plus affected M1 tests and strict checking prove I7/I8, scan-only admission, sibling preservation, no invocation provenance, readback, and honest unsaved failures. Primary accepts `M202-C-*`; fresh S3 review must pass before the real smoke.

### Capacity screen and integration closure

TDD: **Not applicable** to the manual metadata screen, developer acquisition and actual capacity observation. Automated adapter/service behavior still uses A–C TDD. Primary owns the developer evaluation note inside this plan; no hardware-monitoring code, generated ledger or separate report is needed.

L6 passes before any model acquisition or project evaluation of a pre-existing model. The developer then installs the reviewed compatible Ollama runtime and pulls only `embeddinggemma` through official tooling, outside the application and repository. Installation/elevation/license acceptance is an explicit developer action, never an application/worker side effect. Preserve pre-existing installations, model stores and unrelated running models; if controlled evaluation would require changing them, obtain direction. Record completed prerequisites without copying raw download logs, private paths or credentials into public docs.

Capture the exact locally resolved L7 configuration before real use. Validate every full role-formatted canonical passage and all bounded query constructions against the frozen effective input limit; character count is not a token-count proof. Use conservative deterministic pre-call accounting and runtime truncation rejection as frozen in L3. A non-fitting passage stops evaluation; do not split, shorten, replace or silently truncate the M2-01 artifact.

Once A–C, L6/L7 and command/effect gates pass, perform **one** real retrieval-specific smoke: start the actual application with the existing built UI, keep the UI browser active and exercise basic existing controls while the production service retrieves for the one frozen project-owned Finding. Reuse existing controlled-fixture/harness boundaries to obtain a complete valid run; do not load gold expected subsets as runtime records. Use all 16 real corpus embeddings and the real selected query, exact search and durable readback. One small test-owned evaluation driver may be added by the test worker within C if required and frozen in its packet; it may coordinate real production calls but cannot simulate or replace production behavior. It is not an automatic test-suite model call, product endpoint, or reusable benchmarking platform.

Pass requires complete real retrieval/publication, matching configuration/provenance and no OOM, storage exhaustion or unusable UI. Record duration, readily observable memory/paging/offload and responsiveness as observations with limits, not a numerical SLA. Do not repeat per Local/Groq mode, run Qwen, evaluate all gold quality cases, or tune ranking during this smoke. Failed capacity pauses dependent work until a new recorded model-selection decision; an infrastructure/permission failure is instead preserved and triaged, never called a capacity pass or silently retried. Exact real-run evidence is `Non-reusable` as a fresh-runtime claim, though its historical observation remains valid for the recorded configuration.

At closure run the complete current seven-file suite plus the new task tests once, independently strict-check and build, inspect actual responsibility placement and test relevance, and obtain a **different fresh `critical_reviewer`** for final integration because critical identity/publication boundaries remain. This review includes the manual capacity evidence; do not add a duplicate capacity review. Dispose every finding, clean only verified task-owned outputs, reconcile documentation, then mark M2-02 Complete and move this same plan to `completed/`. M2-03 requires a separate owner selection.

## Concrete Steps

Run from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab` in PowerShell. C0–C2 below are available now and are read-only. All later commands are explicit **unresolved slots**, not permission to improvise during a lease.

### C0 — reconcile the current endpoint

```powershell
git status --short
git rev-parse HEAD
git symbolic-ref --short HEAD
git diff --check
git diff --cached --name-status
```

Inspect every dirty path. Capture the then-current intentional HEAD, symbolic ref, index, source/test/config/authority/corpus hashes and ignored-runtime inventories as `M202-EXEC-ENTRY-01`. Clean and intentional plan-only dirty trees are both valid; neither old HEAD equality nor an uncommitted plan is required. A newer commit must be inspected for relevant changes; do not automatically bless it. Every later lease uses its fresh actual baseline, and closure compares against that accepted baseline plus authorized task changes. Stop on unexpected overlap, active lease, or relevant drift and revalidate before continuation.

### C1 — pinned pure planning/preflight checks

```powershell
$m202PriorCompileCache = [Environment]::GetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','Process')
try {
  $env:NODE_DISABLE_COMPILE_CACHE = '1'
  $m202Node = 'C:/nvm4w/nodejs/node.exe'
  if ((& $m202Node --version) -ne 'v24.20.0') { throw 'Pinned Node is required.' }
  & $m202Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Independent strict TypeScript failed.' }
  & $m202Node --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Pure baseline failed.' }
} finally {
  [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE',$m202PriorCompileCache,'Process')
}
```

Expected planning result: strict exit 0 and 78 tests pass with no skips. Later authorized contract tests may increase that count; record the actual accepted result. This command creates no browser, run, build or model output. A missing pinned runtime/dependency stops; use existing reviewed developer setup only after authorization, not an automatic installation in preflight.

### C2 — frozen corpus preservation

```powershell
$m202Frozen = @{
  'corpus/wcag22-mvp-v1/manifest.json' = '87D8867ED1138BFB38E6C44EED67A79B0A43BDAF2532A056AFAFAED828202DA9'
  'corpus/wcag22-mvp-v1/passages.json' = '29EA0033E825A0FA20430AA42E9718B87A87AA59EDADDA0A3876A0A7BE871850'
  'evaluation/m201-corpus-v1.json' = 'A7D38CACF98BF263CDD53012350708BE987699DF21B4C0F1BB7F32BC1892E29B'
}
foreach ($m202Path in $m202Frozen.Keys) {
  if ((Get-FileHash -LiteralPath $m202Path -Algorithm SHA256).Hash -ne $m202Frozen[$m202Path]) {
    throw ('Frozen M2-01 input changed: ' + $m202Path)
  }
}
'M2-01 frozen inputs unchanged'
```

If C2 fails, inspect the accepted version/history; do not update constants just to pass. This check preserves reviewed bytes but is not a replacement for A's runtime integrity validation or M2-01's semantic evidence. Reuse M2-01's static validators only via its documented read-only PREP/VALIDATE blocks, never its historical ACQUIRE/CLEANUP commands.

### Future command/effect slots — freeze before use

| ID | Exact values still to record | Gate and effects |
| --- | --- | --- |
| C-SETUP | Selected package names/versions/import checks; exact manifest/lock-generation command; npm executable/version and all script-suppressed flags; registry/cache path; permitted metadata mutations. | Freeze before setup. Only manifest/lock may change tracked state; enumerate ignored `node_modules`/cache/log effects. No lifecycle scripts or unrelated upgrades. |
| C-RESTORE | Exact locked restore, before/after metadata hashes, generated dependency location, safe clean-state preparation and restoration/cleanup of any preserved existing dependency directory. | Freeze before setup. A clean restore must not regenerate the lock. Resolve exact ordinary targets; never delete an existing dependency tree or shared cache implicitly. |
| C-LEASE | Exact Python path/version, guard start/close invocation for every Packet v2 identity/phase/attempt/path list, expected fresh receipt and protected-input comparison. | Primary only, after contract freeze. Follow the existing guard command schema; capture digest immediately before the worker turn. Ignored outputs need separate checks. |
| C-A / C-B / C-C | Exact callable/import names and test files; focused native Node commands; affected-suite command per slice; inherited environment, timeout, temporary root, transport-mocking/no-network mode and expected Red/Green result. | Freeze before each preflight/lease. Planned focused files are `retrieval-contract.test.ts`, `embedding-retrieval.test.ts`, `retrieval-service.test.ts`; not executable until created. No real model in ordinary tests. |
| C-METADATA | Exact read-only hardware/free-storage observations, publisher references and estimates; runtime support/license evidence; explicit safety margin and pass rationale. | Before acquisition or project model use. No probe from startup, browser selection, or Analyze; no monitor or benchmark tool installed. |
| C-MODEL | Developer's exact external installation/pull instructions, runtime/model-store location, expected storage effects, then read-only installed version/tag/full-digest/metadata capture. | After L6 pass and developer authorization. Models outside repository/Git; no application downloads, forced update, or cleanup of pre-existing models. |
| C-INPUT-FIT | Exact deterministic token-accounting/limit check for every role-formatted passage and constructed query; expected reject case; reviewed no-truncation request and response evidence. | Policy before B; actual configuration before smoke. Any required helper is a bounded test-worker artifact, not an unleased coordinator implementation. |
| C-SMOKE | Exact evaluation driver/invocation, frozen synthetic run/Finding source, actual service/UI/build paths, UI activity steps, one request, runtime metadata, observations, readback and failure interpretation. | After A–C acceptance and L7 freeze. Explicit loopback embedding; no public scan, generation, gold scoring or repeated benchmarks. |
| C-FULL | Exact ordered complete suite (existing seven plus new tests), strict check, Vite native build, browser environment wrapper, pinned Chromium path, named empty scratch roots and no concurrent service. | Before C's write/verification packet. Reuse [current developer commands](../../README.md#build-and-verify-the-walking-skeleton) and M105-CMD-PREP definitions; do not replay historical leases or cleanup. |
| C-CLEAN | Exact process handles, service/driver stop commands, generated build/cache/test-run inventory, ordinary-path/hash checks, bounded deletion and pre-existing-output preservation. | Freeze with the operation that creates each output. Stop owned work before cleanup; verify absolute containment and no junction/reparse/hardlink surprise; never recursive-delete a shared root. |

Each resolved slot records working directory, exact command, expected success/failure, known external effects, owned paths and cleanup. Freeze literal fingerprints and the execution identity in the plan before the relevant packet; a packet must project reviewed values, not invent binding commands. Baseline changes after a review trigger proportional revalidation, including every executable comparison/receipt/closure reference that depends on that baseline.

## Validation and Acceptance

Planning acceptance requires a complete current-state/authority map, accurate activation, bounded gates and command slots, fresh plan-readiness review, resolved links/formatting and unchanged executable/frozen inputs. It proves no model fit or implementation.

Task acceptance requires all of the following, with evidence `M202-A-*`, `B-*`, `C-*`, `PREFILTER-*`, `CONFIG-*`, `CAPACITY-*`, and `CLOSURE-*` retained concisely here:

- Accepted execution/literal/command barriers; exact selected dependencies restored without script execution; all model prerequisites remain developer-owned.
- Every slice's classification, accepted tests, decisive Red/characterization and unchanged-test Green, strict result, assignment/digest/fresh terminal lease, actual diff/cohesion disposition and risk-routed review are accepted by primary.
- I1–I8 pass with deterministic tests and actual source/record inspection. A valid current catalog is not mutated; same-version tampering fails; full-digest/config incompatibility never reuses old vectors; ranking is genuine and stable at the k cutoff; only selected minimized facts reach loopback.
- Attempt-time missing prerequisites and retrieval failures are bounded, contain official setup guidance where applicable, preserve completed scanner evidence and siblings, create no generation invocation or support claim, and do not auto-retry or fall back.
- The metadata prefilter passes before acquisition/project model use; exact evaluated configuration and input-fit evidence exist; I9's one real retrieval smoke passes. Published size, mocked vectors and isolated SDK calls are not substitutes.
- Full regression, strict TypeScript and build pass; no skipped/todo/focused-only test or production substitute hides missing behavior. Audit affected tests/helpers/fixtures for keep/change/remove reasons and inspect module cohesion independently of test success.
- The different fresh final critical review has no undispositioned blocking finding; actual owned processes stop, task-only cleanup passes, protected inputs remain intact, and documentation closure passes.

The primary owns documentation closure: compare implementation/decisions/evidence with the authority map; update current status in root/documentation/requirements/delivery/roadmap/plan/progress indexes and materially affected developer instructions. At implementation closure also reconcile the lifecycle's current scan-only statement, architecture implementation summaries and feasibility/evaluation references if evidence changes them. Preserve historical counts and failures. Change requirement/ADR semantics only through their owner process. Verify all moved links before archiving. Do not mark M2-03 started, infer the later quality gate, or call the whole M2 milestone complete.

## Idempotence and Recovery

Read-only status, hash, strict and pure-test checks are safe to repeat under the same environment. A changed fingerprint invalidates dependent evidence, not unrelated historical results. Do not assume the planning SHA is the execution SHA; reconcile intentional plan commits before sealing a fresh baseline. Never alter a lease's baseline or replay a terminal receipt as fresh verification.

Only one writer/lease and one application operation may run in this worktree at a time. If a worker stops unexpectedly, primary first ends the turn, closes/inspects its exact lease, records partial outcomes and reconciles the tree. No reset, stash, checkout, force-close, ignore bypass, or overwritten guard JSON is a recovery mechanism. Unexpected overlapping edits are preserved and require direction if they cannot be isolated.

Keep incomplete vector builds private until complete validation, discard failed/incompatible in-memory vectors and expose failure under the frozen policy. This is not a persistent index recovery system. No startup model request, automatic pull, resume or retry may be used to repair state. A nested publication failure leaves the last valid run bytes authoritative and the parent completed; no failed-run rewrite or unsaved success is allowed. The exact treatment of an interrupted selected action must already be frozen in L5.

Before generated-output or synthetic-run cleanup, stop only task-owned service/driver/browser work, verify normal closure, resolve the exact absolute child paths, inspect ordinary topology/inventory/identity and preserve pre-existing resources. Use one-shell PowerShell literal paths. Never target a workspace root, `data/runs`, corpus, global cache or developer model store with recursive removal. A changed or uncertain target remains for inspection; do not claim successful cleanup. Report removed material and recoverability. Retain completed M2-01 artifacts and notices; no source re-acquisition is part of recovery.

## Artifacts and Notes

### M202-PLAN-STATE-01 — planning evidence

2026-09-03: clean HEAD `56a1c97e59311be604b6e96b8e4ee06643f0741c`, branch `codex/m2-02-embedding-retrieval-capacity-gate`; no existing M2-02 source/test/dependency implementation. Fresh Node 24.20.0, strict TypeScript exit 0 and 78/78 pure tests passed under compile-cache suppression with exact restoration. Application/test/toolchain/fixture diff since `12b05f6` is empty. Corpus/gold hashes are listed above. The existing complete seven-suite 335-test result is historical M1-05 evidence, not newly rerun. No Ollama probe, model download, browser scan, live site, generation or capacity run occurred.

### M202-PLAN-EMBED-01 — published facts, accessed 2026-09-03

One read-only `technology_researcher` returned `RESEARCH COMPLETE`; primary retained only facts and explicit unknowns. The [official Ollama tag listing](https://ollama.com/library/embeddinggemma/tags) displayed 622 MB and 2K context for the canonical model family; its short listing identifier is not a resolved local full digest or memory-fit proof. The [official Google model card](https://huggingface.co/google/embeddinggemma-300m/blob/main/README.md) documents 2,048-token context, 768 base dimensions and distinct retrieval query/document formatting. Applying that formatting exactly once must be proved on the selected path.

The [Ollama embed API](https://docs.ollama.com/api/embed) documents `truncate: false` for rejecting over-context input, vector responses and a model-name field, not a full digest. [Local model listing](https://docs.ollama.com/api/tags) and [model details](https://docs.ollama.com/api-reference/show-model-details) expose the local identity and metadata used by later configuration capture. [Embedding capability documentation](https://docs.ollama.com/capabilities/embeddings) describes normalized outputs. These are published contracts, not validation of an installed runtime or vectors.

Recheck [Windows setup](https://docs.ollama.com/windows), [hardware support](https://docs.ollama.com/gpu), the actual distribution's license/access conditions and selected package APIs at execution. No EmbeddingGemma-specific minimum Ollama version, exact current installation, token-accounting method, alias-race policy or actual GPU offload was established by this report. Google/Hugging Face access conditions must not be assumed to describe a different distribution. Those unresolved items remain L1–L7, not runtime success claims.

### Future evidence retention

Record only accepted literal contracts, source links/access dates, compact command results, expected versus actual failures, assignment/terminal lease identities, protected fingerprints, review dispositions and the bounded capacity observation in this plan. Do not create a parallel task graph, generated telemetry ledger, permanent research report, raw model response archive or copied agent transcript. Update the [progress record](../progress/m2-02-embedding-retrieval-capacity-gate.md) only at material accepted checkpoints.

### M202-PLAN-REVIEW-01 — planning closure

2026-09-04 UTC: a fresh `critical_reviewer` reviewed the whole plan and activation diff against the applicable authorities and actual source boundaries. Verdict: **PASS — planning readiness only**, with no Blocker, Major or Minor. The reviewer independently repeated strict TypeScript and the pinned two-file 78-test baseline, checked HEAD/index/path scope and absence of an active lease, verified C2 and confirmed the historical-versus-checkout corpus hash distinction. Its reviewed plan SHA-256 was `C99E231BC67BF0AA5229BA1A036D711033FC9F598360FBEF8781A9DB43430E8C`; this subsequent review/evidence recording changes that document hash, not the reviewed execution contract.

Primary accepted the review against the actual tree and verified all 85 protected source/test/corpus/evaluation/configuration/workflow/skill inputs unchanged. The nine affected Markdown files pass UTF-8, final newline, trailing whitespace, 603 local links and 131 heading fragments; all three PowerShell blocks parse, actual C2 passes, and `git diff --check` passes. HEAD and logical index remain unchanged; only the nine planning/activation paths are dirty. Roadmap counts are nine Complete, one In progress and eighteen Not started. No active lease or generated build exists; this planning turn performed no model acquisition or runtime operation and created no cleanup target. Installed model state remains unknown. The retained browser prerequisite was not changed.

Documentation impact: created this ExecPlan and its progress record; updated root/documentation/plan/progress navigation, roadmap activation, requirements-index and delivery current-status summaries. No requirement/ADR semantics, corpus/gold, application source, test, dependency or executable configuration changed. Date-only initial planning/source notes use the project-local 2026-09-03 date; Z-suffixed progress and current activation labels use 2026-09-04 UTC. No commit or push occurred. Literal selection, implementation, metadata/acquisition and real capacity gates remain pending, and this plan stays active.

## Interfaces and Dependencies

The existing canonical corpus and domain Finding feed an application-owned privacy-safe request. A separate loopback embedding adapter supplies validated vectors to ephemeral LangChain MemoryVectorStore. Application code owns filtering, deterministic cutoff, canonical references, provenance and the future M2-03 handoff; framework objects/vectors never become persisted domain values. Service coordination alone owns the selected action and reuses the single run repository for publication.

Exact imports, dependency pins, internal callable and nested fields are unresolved L1–L5 outputs. Do not expose direct Ollama/vector/filesystem authority to React. No rendered UI change is planned, so the frontend-quality skill and frontend code worker are not triggered; a newly required visible change stops this plan for scope/profile reconciliation rather than being hidden in a standard lease. Existing UI remains active only for the capacity observation and regression evidence.

## Revision Note

2026-09-03: Created the M2-02 planning candidate after reviewing completed M1/M2-01 evidence and current code. Added planning-only activation, future R3 literal/command barriers, three cohesive worker-first behavior slices, developer-owned setup, one retrieval-specific capacity screen, protected corpus identities and execution-time Git reconciliation. No implementation, dependency, model, source snapshot, requirement or ADR change was made.

2026-09-04 UTC: Accepted fresh critical planning-readiness PASS with no findings; recorded independent and primary validation, clarified checkout versus historical corpus fingerprints and corrected UTC labels. Closed only the planning checkpoint, leaving execution authorization and all literal/runtime gates pending.
